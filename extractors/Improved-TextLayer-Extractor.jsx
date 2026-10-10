// ---------- Improved Text Layer Extractor ----------
// Decodes MENU numbers directly + embeds lessons from recreation errors

// ---------- helpers ----------
function enumName(value, enumObj, keys) {
    for (var i = 0; i < keys.length; i++) {
        if (enumObj[keys[i]] === value) return keys[i];
    }
    return "UNKNOWN(" + value + ")";
}

function fmt(v) {
    if (v instanceof Array) {
        var a = [];
        for (var i = 0; i < v.length; i++) a.push(fmt(v[i]));
        return a.join(",");
    }
    return (typeof v === "number") ? String(Math.round(v * 100) / 100) : String(v);
}

var KERN_KEYS = ["NO_AUTO_KERN", "METRIC_KERN", "OPTICAL_KERN"];
var JUST_KEYS = ["LEFT_JUSTIFY", "CENTER_JUSTIFY", "RIGHT_JUSTIFY",
                 "FULL_JUSTIFY_LASTLINE_LEFT", "FULL_JUSTIFY_LASTLINE_CENTER",
                 "FULL_JUSTIFY_LASTLINE_RIGHT", "FULL_JUSTIFY_LASTLINE_FULL"];

// ---------- MENU DECODING (stable for years, verified from dump) ----------
var MENU_MAP = {
    "ADBE Text Anchor Point Option": {
        1: "Character",
        2: "Word",
        3: "Line",
        4: "All"
    },
    "ADBE Text Render Order": {
        1: "All Fills Over All Strokes", // default, 2 = All Strokes Over All Fills in newer AE
        2: "All Strokes Over All Fills"
    },
    "ADBE Text Character Blend Mode": {
        1: "Normal"
        // Only Normal exists in UI, but kept as map for completeness
    },
    "ADBE Text Range Units": {
        1: "Percentage",
        2: "Index"
    },
    "ADBE Text Range Type2": { // Based On
        1: "Characters",
        2: "Characters Excluding Spaces",
        3: "Words",
        4: "Lines"
    },
    "ADBE Text Selector Mode": {
        1: "Add",
        2: "Subtract",
        3: "Intersect",
        4: "Min",
        5: "Max",
        6: "Difference"
    },
    "ADBE Text Range Shape": {
        1: "Square",
        2: "Ramp Up",
        3: "Ramp Down",
        4: "Triangle",
        5: "Round", // confirmed from GAME WIN! dump
        6: "Smooth"
    },
    // Extra ones from original script - decoded too
    "ADBE Text Track Type": {
        1: "Before & After",
        2: "Before",
        3: "After"
    },
    "ADBE Text Character Change Type": {
        1: "Character Value",
        2: "Character Value (No Value)"
    },
    "ADBE Text Character Range": {
        1: "Custom",
        2: "Letters",
        3: "Numbers",
        4: "Letters & Numbers"
    }
};

function getMenuLabel(matchName, value) {
    var map = MENU_MAP[matchName];
    if (map && map[value] !== undefined) {
        return value + " (" + map[value] + ")";
    }
    return String(value) + " (UNKNOWN - check UI)";
}

// Dropdown properties: stored as numbers, now auto-decoded
var MENU_PROPS = {
    "ADBE Text Range Units": 1,
    "ADBE Text Range Type2": 1,
    "ADBE Text Selector Mode": 1,
    "ADBE Text Range Shape": 1,
    "ADBE Text Anchor Point Option": 1,
    "ADBE Text Render Order": 1,
    "ADBE Text Character Blend Mode": 1,
    "ADBE Text Track Type": 1,
    "ADBE Text Character Change Type": 1,
    "ADBE Text Character Range": 1
};

// ---------- text document ----------
function readTextDocument(layer) {
    var td = layer.property("ADBE Text Properties")
                  .property("ADBE Text Document").value;
    var names = ["text", "font", "fontSize", "autoLeading", "leading",
                 "autoKernType", "tracking", "horizontalScale", "verticalScale",
                 "baselineShift", "applyFill", "fillColor", "applyStroke",
                 "strokeColor", "strokeWidth", "strokeOverFill",
                 "justification", "fauxBold", "fauxItalic", "allCaps", "smallCaps"];
    var lines = [];
    for (var i = 0; i < names.length; i++) {
        try {
            var v = td[names[i]];
            if (names[i] === "autoKernType") v = enumName(v, AutoKernType, KERN_KEYS);
            if (names[i] === "justification") v = enumName(v, ParagraphJustification, JUST_KEYS);
            if (names[i] === "text") v = String(v).replace(/\r/g, "\\r").replace(/\n/g, "\\n");
            lines.push(names[i] + ": " + v.toString());
        } catch (e) {
            lines.push(names[i] + ": <unavailable>");
        }
    }
    return lines.join("\n");
}

// ---------- keyframes ----------
function readKeyframes(prop) {
    var out = [];
    var INTERP = ["LINEAR", "BEZIER", "HOLD"];
    for (var k = 1; k <= prop.numKeys; k++) {
        var inT  = prop.keyInInterpolationType(k);
        var outT = prop.keyOutInterpolationType(k);
        var s = "key " + k + " @ " + prop.keyTime(k).toFixed(3) + "s"
              + " | value: " + fmt(prop.keyValue(k))
              + " | in: " + enumName(inT, KeyframeInterpolationType, INTERP)
              + " | out: " + enumName(outT, KeyframeInterpolationType, INTERP);

        if (inT === KeyframeInterpolationType.BEZIER || outT === KeyframeInterpolationType.BEZIER) {
            var ei = prop.keyInTemporalEase(k), eo = prop.keyOutTemporalEase(k);
            var ease = [];
            for (var d = 0; d < ei.length; d++) {
                ease.push("[in " + fmt(ei[d].speed) + "/" + fmt(ei[d].influence)
                        + ", out " + fmt(eo[d].speed) + "/" + fmt(eo[d].influence) + "]");
            }
            var allSame = true;
            for (var c = 1; c < ease.length; c++) if (ease[c] !== ease[0]) allSame = false;
            s += " | ease: " + (allSame ? ease[0] : ease.join(" "));
        }
        out.push(s);
    }
    return out.join("\n");
}

// ---------- property walker ----------
function walkGroup(group, indent, layer, lines) {
    for (var i = 1; i <= group.numProperties; i++) {
        var p = group.property(i);

        if (p.name === "") continue;
        if (p.matchName.indexOf("ADBE Position_") === 0 &&
            !layer.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated) continue;
        if (group.matchName === "ADBE Text Animator Properties" &&
            !(p.isModified || p.numKeys > 0 || (p.canSetExpression && p.expressionEnabled))) continue;

        var head = indent + p.name + " [" + p.matchName + "]";

        if (p.propertyType === PropertyType.PROPERTY) {
            if (p.matchName === "ADBE Text Document") {
                lines.push(head + ":");
                var tl = readTextDocument(layer).split("\n");
                for (var j = 0; j < tl.length; j++) lines.push(indent + "  " + tl[j]);
                continue;
            }

            var line = head;
            var isMenu = !!MENU_PROPS[p.matchName];
            if (p.numKeys > 0) {
                line += " (animated, " + p.numKeys + " keys)";
            } else {
                var vt = p.propertyValueType;
                if (vt !== PropertyValueType.NO_VALUE && vt !== PropertyValueType.CUSTOM_VALUE) {
                    try {
                        var rawVal = p.value;
                        if (isMenu) {
                            line += ": " + getMenuLabel(p.matchName, rawVal);
                        } else {
                            line += ": " + fmt(rawVal);
                        }
                    }
                    catch (e) { line += ": <unavailable>"; }
                }
            }
            if (isMenu && p.numKeys === 0) {
                // already decoded, add tag for AI reference
                line += "  <MENU decoded>";
            } else if (isMenu) {
                line += "  <MENU>";
            }
            lines.push(line);

            if (p.numKeys > 0) {
                var kf = readKeyframes(p).split("\n");
                for (var m = 0; m < kf.length; m++) lines.push(indent + "  " + kf[m]);
            }
            if (p.canSetExpression && p.expressionEnabled) {
                lines.push(indent + "  expression: " + p.expression.replace(/\r?\n/g, " \\n "));
            }
        } else {
            // Special note for Animator Properties - must use addProperty()
            if (p.matchName === "ADBE Text Animator Properties") {
                lines.push(head + "  // NOTE: Each property below must be created via addProperty(matchName), not set directly");
            } else {
                lines.push(head);
            }
            walkGroup(p, indent + "  ", layer, lines);
        }
    }
}

function extractTextLayer(layer) {
    var lines = [];
    lines.push("LAYER: " + layer.name + " (index " + layer.index + ")");
    lines.push("Transform");
    walkGroup(layer.property("ADBE Transform Group"), "  ", layer, lines);
    lines.push("Text");
    walkGroup(layer.property("ADBE Text Properties"), "  ", layer, lines);
    return lines.join("\n");
}

function showOutput(text) {
    var w = new Window("dialog", "Text Layer Data", undefined, {resizeable: true});
    var et = w.add("edittext", undefined, text, {multiline: true, scrolling: true});
    et.preferredSize = [700, 500];
    var g = w.add("group");
    var selBtn = g.add("button", undefined, "Select All");
    var closeBtn = g.add("button", undefined, "Close");
    selBtn.onClick = function () { et.active = false; et.active = true; };
    closeBtn.onClick = function () { w.close(); };
    w.show();
}

// ---------- run ----------
var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) {
    alert("Open a comp first.");
} else {
    var out = [];
    for (var n = 0; n < comp.selectedLayers.length; n++) {
        var ly = comp.selectedLayers[n];
        if (ly instanceof TextLayer) out.push(extractTextLayer(ly));
    }
    if (out.length === 0) {
        alert("Select at least one text layer.");
    } else {
        var notesForAI = [
            "NOTES FOR AI RECREATION (learned from 3 previous errors):",
            "1) KeyframeEase Constructor: AE dump shows ease like [in 0/87, out 0/87] meaning speed 0 influence 87. But ExtendScript new KeyframeEase(speed, influence) requires influence 0.1-100, not 0. Always convert influence 0 -> 0.1. Eg: new KeyframeEase(0,0) must be new KeyframeEase(0,0.1). This crashed at line 27 and 52 in GAME WIN! recreation.",
            "2) Hidden 3D Props: Properties ADBE Orientation, ADBE Rotate X, ADBE Rotate Y, and ADBE Material Group > ADBE Envir Appear in Reflect are HIDDEN unless layer.threeDLayer=true. Original GAME WIN! was NOT 3D, so dump included them with 0 but they are hidden. In jsx recreation, either skip them for 2D layers, or set layer.threeDLayer=true BEFORE setting them, or wrap in try{}catch. This crashed at line 60.",
            "3) Hidden Advanced Selector Props: In Text Animator > Range Selector > Advanced, properties like ADBE Text Range Units, ADBE Text Range Type2 (Based On), ADBE Text Selector Mode, ADBE Text Range Shape, ADBE Text Levels Max/Min Ease etc are HIDDEN when parent group is collapsed or depending on Units. Must wrap each setValue in try{}catch. This crashed at line 158 (ADBE Text Range Type2). Also wrap Path Options and More Options similarly.",
            "",
            "MENU DECODING (stable AE enums, verified):",
            "- ADBE Text Anchor Point Option: 1=Character, 2=Word, 3=Line, 4=All",
            "- ADBE Text Render Order: 1=All Fills Over All Strokes, 2=All Strokes Over All Fills",
            "- ADBE Text Character Blend Mode: 1=Normal",
            "- ADBE Text Range Units: 1=Percentage, 2=Index",
            "- ADBE Text Range Type2 (Based On): 1=Characters, 2=Characters Excluding Spaces, 3=Words, 4=Lines",
            "- ADBE Text Selector Mode: 1=Add, 2=Subtract, 3=Intersect, 4=Min, 5=Max, 6=Difference",
            "- ADBE Text Range Shape: 1=Square, 2=Ramp Up, 3=Ramp Down, 4=Triangle, 5=Round, 6=Smooth",
            "The dump now outputs e.g. '1 (Character)' so AI can use directly without asking user."
        ].join("\n");

        showOutput(out.join("\n\n") + "\n\n" + notesForAI);
    }
}
