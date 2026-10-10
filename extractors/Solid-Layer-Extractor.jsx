// ---------- Solid Layer Extractor - Full Data (no Effects) ----------
// Extracts solid color, size, transform, masks, blending, material - skips Effects to avoid bloat

// ---------- helpers ----------
function enumName(value, enumObj, keys) {
    // Try provided keys first
    for (var i = 0; i < keys.length; i++) {
        try { if (enumObj[keys[i]] === value) return keys[i]; } catch(e){}
    }
    // Fallback: brute-force all properties of enumObj (handles version differences like ALPHA vs ALPHA_MATTE)
    try {
        for (var k in enumObj) {
            try { if (enumObj[k] === value) return k; } catch(e2){}
        }
    } catch(e){}
    return "UNKNOWN(" + value + ")";
}
function fmt(v) {
    if (v instanceof Array) {
        var a = [];
        for (var i = 0; i < v.length; i++) a.push(fmt(v[i]));
        return a.join(",");
    }
    return (typeof v === "number") ? String(Math.round(v * 1000) / 1000) : String(v);
}

var BLEND_KEYS = ["NORMAL","DISSOLVE","DANCING_DISSOLVE","DARKEN","MULTIPLY","COLOR_BURN","CLASSIC_COLOR_BURN","LINEAR_BURN","DARKER_COLOR",
                  "ADD","LIGHTEN","SCREEN","COLOR_DODGE","CLASSIC_COLOR_DODGE","LINEAR_DODGE","LIGHTER_COLOR","OVERLAY","SOFT_LIGHT","HARD_LIGHT",
                  "LINEAR_LIGHT","VIVID_LIGHT","PIN_LIGHT","HARD_MIX","DIFFERENCE","CLASSIC_DIFFERENCE","EXCLUSION","SUBTRACT","DIVIDE",
                  "HUE","SATURATION","COLOR","LUMINOSITY","STENCIL_ALPHA","STENCIL_LUMA","SILHOUETE_ALPHA","SILHOUETE_LUMA","ALPHA_ADD","LUMINOSITY"];

var TRACK_MATTE_KEYS = ["NO_TRACK_MATTE","ALPHA_MATTE","ALPHA_INVERTED_MATTE","LUMA_MATTE","LUMA_INVERTED_MATTE","ALPHA","ALPHA_INVERTED","LUMA","LUMA_INVERTED"];

// MENU decoding for solid-related dropdowns
var MENU_MAP = {
    "ADBE Blend Mode": { // used inside masks etc but keep
        1: "Normal", 2: "Dissolve"
    },
    "ADBE Text Anchor Point Option": {1:"Character",2:"Word",3:"Line",4:"All"},
    "ADBE Text Render Order": {1:"All Fills Over All Strokes",2:"All Strokes Over All Fills"},
    "ADBE Text Character Blend Mode": {1:"Normal"},
    "ADBE Text Range Units": {1:"Percentage",2:"Index"},
    "ADBE Text Range Type2": {1:"Characters",2:"Characters Excluding Spaces",3:"Words",4:"Lines"},
    "ADBE Text Selector Mode": {1:"Add",2:"Subtract",3:"Intersect",4:"Min",5:"Max",6:"Difference"},
    "ADBE Text Range Shape": {1:"Square",2:"Ramp Up",3:"Ramp Down",4:"Triangle",5:"Round",6:"Smooth"}
};

function getMenuLabel(matchName, value) {
    var map = MENU_MAP[matchName];
    if (map && map[value] !== undefined) return value + " (" + map[value] + ")";
    return String(value);
}

var MENU_PROPS = {
    "ADBE Text Range Units": 1,
    "ADBE Text Range Type2": 1,
    "ADBE Text Selector Mode": 1,
    "ADBE Text Range Shape": 1,
    "ADBE Text Anchor Point Option": 1,
    "ADBE Text Render Order": 1,
    "ADBE Text Character Blend Mode": 1
};

function readKeyframes(prop) {
    var out = [];
    var INTERP = ["LINEAR","BEZIER","HOLD"];
    for (var k = 1; k <= prop.numKeys; k++) {
        var inT = prop.keyInInterpolationType(k);
        var outT = prop.keyOutInterpolationType(k);
        var s = "key " + k + " @ " + prop.keyTime(k).toFixed(3) + "s | value: " + fmt(prop.keyValue(k)) + " | in: " + enumName(inT, KeyframeInterpolationType, INTERP) + " | out: " + enumName(outT, KeyframeInterpolationType, INTERP);
        if (inT === KeyframeInterpolationType.BEZIER || outT === KeyframeInterpolationType.BEZIER) {
            var ei = prop.keyInTemporalEase(k), eo = prop.keyOutTemporalEase(k);
            var ease = [];
            for (var d = 0; d < ei.length; d++) {
                ease.push("[in " + fmt(ei[d].speed) + "/" + fmt(ei[d].influence) + ", out " + fmt(eo[d].speed) + "/" + fmt(eo[d].influence) + "]");
            }
            var allSame = true;
            for (var c = 1; c < ease.length; c++) if (ease[c] !== ease[0]) allSame = false;
            s += " | ease: " + (allSame ? ease[0] : ease.join(" "));
        }
        out.push(s);
    }
    return out.join("\n");
}

function walkGroup(group, indent, layer, lines) {
    if (!group) return;
    for (var i = 1; i <= group.numProperties; i++) {
        var p = group.property(i);
        if (!p) continue;
        if (p.name === "") continue;
        // Skip Effects entirely
        if (p.matchName === "ADBE Effect Parade") continue;
        if (p.matchName.indexOf("ADBE Position_") === 0 && !layer.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated) continue;
        var head = indent + p.name + " [" + p.matchName + "]";
        if (p.propertyType === PropertyType.PROPERTY) {
            var line = head;
            var isMenu = !!MENU_PROPS[p.matchName];
            if (p.numKeys > 0) {
                line += " (animated, " + p.numKeys + " keys)";
            } else {
                var vt = p.propertyValueType;
                if (vt !== PropertyValueType.NO_VALUE && vt !== PropertyValueType.CUSTOM_VALUE) {
                    try {
                        var rawVal = p.value;
                        if (isMenu) line += ": " + getMenuLabel(p.matchName, rawVal);
                        else line += ": " + fmt(rawVal);
                    } catch(e) { line += ": <unavailable>"; }
                }
            }
            if (isMenu && p.numKeys === 0) line += "  <MENU decoded>";
            lines.push(line);
            if (p.numKeys > 0) {
                var kf = readKeyframes(p).split("\n");
                for (var m = 0; m < kf.length; m++) lines.push(indent + "  " + kf[m]);
            }
            if (p.canSetExpression && p.expressionEnabled) {
                lines.push(indent + "  expression: " + p.expression.replace(/\r?\n/g, " \\n "));
            }
        } else {
            // Avoid walking into Effects
            if (p.matchName === "ADBE Effect Parade") continue;
            // Note for material hidden props
            if (p.matchName === "ADBE Material Group" && !layer.threeDLayer) {
                lines.push(head + " // SKIPPED - hidden unless threeDLayer=true");
                continue;
            }
            lines.push(head);
            walkGroup(p, indent + "  ", layer, lines);
        }
    }
}

function extractSolidLayer(layer) {
    var comp = layer.containingComp;
    var lines = [];
    lines.push("LAYER: " + layer.name + " (index " + layer.index + ") [Solid]");
    lines.push("  label: " + layer.label + " | threeDLayer: " + layer.threeDLayer + " | locked: " + layer.locked + " | shy: " + layer.shy + " | solo: " + layer.solo + " | enabled: " + layer.enabled);
    try {
        var bmName = enumName(layer.blendingMode, BlendingMode, BLEND_KEYS);
        // Clean up: if UNKNOWN, try to at least show that Multiply 5216 etc are valid - brute force already does
        lines.push("  blendingMode: " + bmName + " (" + layer.blendingMode + ")");
    } catch(e) { lines.push("  blendingMode: <unavailable>"); }
    try {
        var tmType = layer.trackMatteType;
        var tmName = enumName(tmType, TrackMatteType, TRACK_MATTE_KEYS);
        lines.push("  trackMatteType: " + tmName + " (" + tmType + ")");
        // If NO_TRACK_MATTE (5012), do nothing per request
        if (tmType !== TrackMatteType.NO_TRACK_MATTE && tmType !== 5012) {
            // Try to resolve matte layer - it's the layer immediately above this one
            var matteLayer = null;
            try {
                if (layer.index > 1) matteLayer = comp.layer(layer.index - 1);
            } catch(e2) {}
            if (matteLayer) {
                lines.push("  trackMatteLayer: " + matteLayer.name + " (index " + matteLayer.index + ")  // <-- VERIFY: this is the layer directly above, is this your matte?");
            } else {
                lines.push("  trackMatteLayer: <could not auto-resolve, layer is topmost>  // <-- USER: please tell AI what layer name should be the matte");
            }
            lines.push("  // AI NOTE: If trackMatteType is not NO_TRACK_MATTE, ask user to confirm matte layer name. If NO_TRACK_MATTE (5012), skip track matte recreation.");
        }
    } catch(e) {
        lines.push("  trackMatteType: <unavailable: " + e.toString() + ">");
    }
    try { lines.push("  preserveTransparency: " + layer.preserveTransparency); } catch(e) {}
    // quality skipped per user request - always defaults to BEST on recreation, Wireframe was unintended bloat
    // try { lines.push("  quality: " + layer.quality); } catch(e) {}

    // Source - color and size by numbers (always accessible)
    try {
        var src = layer.source;
        if (src) {
            var w = src.width;
            var h = src.height;
            var par = src.pixelAspect;
            lines.push("  Source:");
            lines.push("    width: " + w + " | height: " + h + " | pixelAspect: " + par + " | frameRate: " + src.frameRate);
            try {
                var col = src.mainSource.color; // 0-1
                var col255 = [Math.round(col[0]*255), Math.round(col[1]*255), Math.round(col[2]*255)];
                lines.push("    solidColor [0-1]: " + fmt(col) + " | [0-255]: " + fmt(col255) + " | hex: #" + 
                    ("0"+col255[0].toString(16)).slice(-2) + ("0"+col255[1].toString(16)).slice(-2) + ("0"+col255[2].toString(16)).slice(-2));
            } catch(e) {
                lines.push("    solidColor: <unavailable: " + e.toString() + ">");
            }
            lines.push("    source name: " + src.name);
        }
    } catch(e) {
        lines.push("  Source: <unavailable " + e.toString() + ">");
    }

    lines.push("Transform");
    try {
        walkGroup(layer.property("ADBE Transform Group"), "  ", layer, lines);
    } catch(e) { lines.push("  Transform: <error " + e.toString() + ">"); }

    // Material options - only if 3D
    if (layer.threeDLayer) {
        try {
            lines.push("Material Options");
            walkGroup(layer.property("ADBE Material Group"), "  ", layer, lines);
        } catch(e) {}
    }

    // Masks - full data
    try {
        var maskParade = layer.property("ADBE Mask Parade");
        if (maskParade && maskParade.numProperties > 0) {
            lines.push("Masks [ADBE Mask Parade]: " + maskParade.numProperties + " masks");
            walkGroup(maskParade, "  ", layer, lines);
        } else {
            lines.push("Masks: none");
        }
    } catch(e) { lines.push("Masks: <unavailable>"); }

    // Time stretch, in/out
    try {
        lines.push("Time: startTime " + layer.startTime.toFixed(3) + " | inPoint " + layer.inPoint.toFixed(3) + " | outPoint " + layer.outPoint.toFixed(3) + " | stretch " + layer.stretch);
    } catch(e) {}

    return lines.join("\n");
}

function showOutput(text) {
    var w = new Window("dialog", "Solid Layer Data", undefined, {resizeable: true});
    var et = w.add("edittext", undefined, text, {multiline: true, scrolling: true});
    et.preferredSize = [800, 600];
    var g = w.add("group");
    var selBtn = g.add("button", undefined, "Select All");
    var closeBtn = g.add("button", undefined, "Close");
    selBtn.onClick = function () { et.active = false; et.active = true; };
    closeBtn.onClick = function () { w.close(); };
    w.show();
}

var comp = app.project.activeItem;
if (!(comp instanceof CompItem)) {
    alert("Open a comp first.");
} else {
    var out = [];
    for (var n = 0; n < comp.selectedLayers.length; n++) {
        var ly = comp.selectedLayers[n];
        // Solid is AVLayer with source mainSource instanceof SolidSource
        var isSolid = false;
        try {
            if (ly instanceof AVLayer && ly.source && ly.source.mainSource && ly.source.mainSource instanceof SolidSource) isSolid = true;
        } catch(e) {}
        if (isSolid) {
            out.push(extractSolidLayer(ly));
        } else if (ly instanceof AVLayer) {
            // For debugging, still allow AVLayer but tag as non-solid
            out.push("LAYER: " + ly.name + " (index " + ly.index + ") [AVLayer - NOT a Solid, skipping color/size]\nTransform\n  <use Solid extractor only on solids>");
        }
    }
    if (out.length === 0) {
        alert("Select at least one SOLID layer (Layer > New > Solid).");
    } else {
        var notesForAI = [
            "NOTES FOR AI RECREATION (from text layer lessons, adapted for solids):",
            "1) KeyframeEase Constructor: AE dump shows ease like [in 0/87, out 0/87] meaning speed 0 influence 87. But ExtendScript new KeyframeEase(speed, influence) requires influence 0.1-100, not 0. Always convert influence 0 -> 0.1. Eg: new KeyframeEase(0,0) must be new KeyframeEase(0,0.1). This crashed at line 27 and 52 in GAME WIN! recreation.",
            "2) Hidden 3D Props: Properties ADBE Orientation, ADBE Rotate X, ADBE Rotate Y, and ADBE Material Group > ADBE Envir Appear in Reflect are HIDDEN unless layer.threeDLayer=true. Original GAME WIN! was NOT 3D, so dump included them with 0 but they are hidden. In jsx recreation, either skip them for 2D layers, or set layer.threeDLayer=true BEFORE setting them, or wrap in try{}catch. This crashed at line 60. For solids, Material Options are also hidden unless 3D.",
            "3) Hidden Advanced Selector Props: For text layers, Advanced props hidden when parent collapsed. For solids, same applies to Material and Mask feather etc - always wrap setValue in try{}catch.",
            "4) Animator Properties MUST be added via addProperty(): For text, Scale [ADBE Text Scale 3D] required addProperty. For solids, no animator, but Masks MUST be added via maskParade.addProperty('ADBE Mask Atom') or similar, not set directly. And solid creation itself is via comp.layers.addSolid(color, name, width, height, pixelAspect, duration) - color is 0-1 float array from dump.",
            "5) Solid specific: To recreate solid, use comp.layers.addSolid([R,G,B], name, width, height, pixelAspect, duration). Color comes from dump 'solidColor [0-1]: 1,0,0'. Width/height from 'width: 1920 | height: 1080'. Blending mode via layer.blendingMode = BlendingMode.ADD etc. Track matte via layer.trackMatteType.",
            "",
            "MENU DECODING:",
            "- blendingMode: Use BlendingMode enum (NORMAL=2? actually BlendingMode.NORMAL). Dump shows name like ADD (9).",
            "- trackMatteType: NO_TRACK_MATTE, ALPHA_MATTE, etc.",
            "- For solids, no MENU for color/size - direct numbers.",
            "Effects are intentionally excluded to avoid bloat (as requested)."
        ].join("\n");
        showOutput(out.join("\n\n") + "\n\n" + notesForAI);
    }
}
