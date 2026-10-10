// ---------- Shape Layer Extractor V2 - Skip Defaults + Gradient Warning ----------
// Parametric = numbers only, Bezier = vertices, skip Material Options defaults
// NEW: Detects G-Fill/G-Stroke and warns user to use Gradient Ramp / 4-Color Gradient

function enumName(value, enumObj, keys) {
    for (var i = 0; i < keys.length; i++) { try { if (enumObj[keys[i]] === value) return keys[i]; } catch(e){} }
    try { for (var k in enumObj) { try { if (enumObj[k] === value) return k; } catch(e2){} } } catch(e){}
    return "UNKNOWN(" + value + ")";
}
function fmt(v) {
    if (v instanceof Array) { var a=[]; for (var i=0;i<v.length;i++) a.push(fmt(v[i])); return a.join(","); }
    return (typeof v === "number") ? String(Math.round(v * 1000) / 1000) : String(v);
}
function fmtShape(shape) {
    try { return "vertices:" + fmt(shape.vertices) + " | inTangents:" + fmt(shape.inTangents) + " | outTangents:" + fmt(shape.outTangents) + " | closed:" + shape.closed; }
    catch(e) { return "<shape unavailable>"; }
}
var BLEND_KEYS = ["NORMAL","DISSOLVE","DANCING_DISSOLVE","DARKEN","MULTIPLY","COLOR_BURN","CLASSIC_COLOR_BURN","LINEAR_BURN","DARKER_COLOR","ADD","LIGHTEN","SCREEN","COLOR_DODGE","CLASSIC_COLOR_DODGE","LINEAR_DODGE","LIGHTER_COLOR","OVERLAY","SOFT_LIGHT","HARD_LIGHT","LINEAR_LIGHT","VIVID_LIGHT","PIN_LIGHT","HARD_MIX","DIFFERENCE","CLASSIC_DIFFERENCE","EXCLUSION","SUBTRACT","DIVIDE","HUE","SATURATION","COLOR","LUMINOSITY","STENCIL_ALPHA","STENCIL_LUMA","SILHOUETE_ALPHA","SILHOUETE_LUMA","ALPHA_ADD"];
var TRACK_MATTE_KEYS = ["NO_TRACK_MATTE","ALPHA_MATTE","ALPHA_INVERTED_MATTE","LUMA_MATTE","LUMA_INVERTED_MATTE","ALPHA","ALPHA_INVERTED","LUMA","LUMA_INVERTED"];

var gradientIssues = []; // global collection: {layerName, shapeGroupName, gradName, gradType}

function readKeyframes(prop) {
    var out=[]; var INTERP=["LINEAR","BEZIER","HOLD"];
    for (var k=1;k<=prop.numKeys;k++) {
        var inT=prop.keyInInterpolationType(k); var outT=prop.keyOutInterpolationType(k);
        var val=prop.keyValue(k); var valStr="";
        try { if (val && val.vertices!==undefined) valStr=fmtShape(val); else valStr=fmt(val); } catch(e){ valStr="<unavailable>"; }
        var s="key "+k+" @ "+prop.keyTime(k).toFixed(3)+"s | value: "+valStr+" | in: "+enumName(inT,KeyframeInterpolationType,INTERP)+" | out: "+enumName(outT,KeyframeInterpolationType,INTERP);
        out.push(s);
    }
    return out.join("\n");
}

function isModifiedProp(p) {
    try { return p.isModified || p.numKeys>0 || (p.canSetExpression && p.expressionEnabled); } catch(e){ return false; }
}
function isEssential(matchName) {
    var list=["ADBE Vector Shape","ADBE Vector Shape - Group","ADBE Vector Shape - Rect","ADBE Vector Shape - Ellipse","ADBE Vector Shape - Star",
              "ADBE Vector Rect Size","ADBE Vector Rect Position","ADBE Vector Rect Roundness",
              "ADBE Vector Ellipse Size","ADBE Vector Ellipse Position",
              "ADBE Vector Star Points","ADBE Vector Star Position","ADBE Vector Star Outer Radius","ADBE Vector Star Inner Radius","ADBE Vector Star Inner Roundness","ADBE Vector Star Outer Roundness",
              "ADBE Vector Fill Color","ADBE Vector Stroke Color","ADBE Vector Grad Colors",
              "ADBE Vector Fill Opacity","ADBE Vector Stroke Opacity","ADBE Vector Stroke Width",
              "ADBE Vector Anchor","ADBE Vector Position","ADBE Vector Scale","ADBE Vector Rotation","ADBE Vector Group Opacity",
              "ADBE Vector Blend Mode","ADBE Vector Shape Direction","ADBE Anchor Point","ADBE Position","ADBE Scale","ADBE Opacity"];
    for (var i=0;i<list.length;i++) if (list[i]===matchName) return true;
    return false;
}

function walkVectors(group, indent, layer, lines, parentGroupName) {
    if (!group) return;
    if (parentGroupName === undefined) parentGroupName = "<root>";
    for (var i=1;i<=group.numProperties;i++) {
        var p=group.property(i); if (!p) continue; if (p.name==="") continue; if (p.matchName==="ADBE Effect Parade") continue;

        if (p.matchName==="ADBE Vector Materials Group" && !layer.threeDLayer) continue;

        // --- GRADIENT DETECTION ---
        if (p.matchName==="ADBE Vector Graphic - G-Fill" || p.matchName==="ADBE Vector Graphic - G-Stroke") {
            var gradType = (p.matchName==="ADBE Vector Graphic - G-Fill") ? "Gradient Fill" : "Gradient Stroke";
            gradientIssues.push({
                layerName: layer.name,
                layerIndex: layer.index,
                shapeGroupName: parentGroupName,
                gradName: p.name,
                gradType: gradType,
                matchName: p.matchName
            });
        }

        var mod=isModifiedProp(p);
        var hasModChild=false;
        if (p.propertyType!==PropertyType.PROPERTY) {
            try {
                for (var ci=1; ci<=p.numProperties; ci++) {
                    var cp=p.property(ci); if (!cp) continue;
                    if (isModifiedProp(cp) || isEssential(cp.matchName)) { hasModChild=true; break; }
                    if (cp.numProperties) {
                        for (var cj=1; cj<=cp.numProperties; cj++) {
                            var cc=cp.property(cj); if (!cc) continue;
                            if (isModifiedProp(cc)) { hasModChild=true; break; }
                        }
                    }
                    if (hasModChild) break;
                }
            } catch(e){}
            if (p.matchName==="ADBE Vector Materials Group" || p.matchName==="ADBE Vector Stroke Dashes" || p.matchName==="ADBE Vector Stroke Taper" || p.matchName==="ADBE Vector Stroke Wave") {
                if (!hasModChild && !mod) continue;
            }
            // Keep gradient groups even if not modified, so we can warn
            if (p.matchName==="ADBE Vector Graphic - G-Fill" || p.matchName==="ADBE Vector Graphic - G-Stroke") {
                // force keep
            } else if (!mod && !hasModChild && p.matchName!=="ADBE Vector Group" && p.matchName!=="ADBE Vectors Group" && p.matchName!=="ADBE Root Vectors Group" && p.matchName!=="ADBE Vector Transform Group" && !isEssential(p.matchName)) {
                if (p.numProperties===0 || p.propertyType===PropertyType.PROPERTY) continue;
            }
        } else {
            if (!mod && !isEssential(p.matchName)) continue;
        }

        var head=indent + p.name + " [" + p.matchName + "]";
        if (p.propertyType===PropertyType.PROPERTY) {
            var line=head;
            if (p.numKeys>0) line+=" (animated, "+p.numKeys+" keys)";
            else {
                try {
                    if (p.propertyValueType===PropertyValueType.SHAPE) line+=": "+fmtShape(p.value)+"  // BEZIER";
                    else if (p.propertyValueType!==PropertyValueType.NO_VALUE && p.propertyValueType!==PropertyValueType.CUSTOM_VALUE) line+=": "+fmt(p.value);
                    else if (p.matchName==="ADBE Vector Grad Colors") line+=": <GRADIENT COLORS - not scriptable>";
                } catch(e){ line+=": <unavailable>"; }
            }
            // Add inline warning for gradients
            if (p.matchName==="ADBE Vector Graphic - G-Fill" || p.matchName==="ADBE Vector Graphic - G-Stroke") {
                // handled as container below
            }
            lines.push(line);
            if (p.numKeys>0) {
                var kf=readKeyframes(p).split("\n");
                for (var m=0;m<kf.length;m++) lines.push(indent+"  "+kf[m]);
            }
        } else {
            if (p.matchName==="ADBE Vector Transform Group") {
                var tLines=[];
                for (var ti=1; ti<=p.numProperties; ti++) {
                    var tp=p.property(ti); if (!tp) continue;
                    if (isModifiedProp(tp)) {
                        var tl=indent+"  "+tp.name+" ["+tp.matchName+"]: ";
                        try { tl+=fmt(tp.value); } catch(e){ tl+="<unavailable>"; }
                        tLines.push(tl);
                    }
                }
                if (tLines.length===0) continue;
                lines.push(head + "  // NOTE: addProperty required for parent group");
                for (var tl2=0; tl2<tLines.length; tl2++) lines.push(tLines[tl2]);
                continue;
            }

            var isGradGroup = (p.matchName==="ADBE Vector Graphic - G-Fill" || p.matchName==="ADBE Vector Graphic - G-Stroke");
            if (isGradGroup) {
                lines.push(head + "  // *** GRADIENT DETECTED - NOT SCRIPTABLE ***");
                lines.push(indent+"  // WARNING: Layer ["+layer.name+"] Shape ["+parentGroupName+"] has "+p.name+" ("+ (p.matchName==="ADBE Vector Graphic - G-Fill"?"G-Fill":"G-Stroke") +")");
                lines.push(indent+"  // FIX: Use Effect > Generate > Gradient Ramp or 4-Color Gradient instead of G-Fill/G-Stroke, OR replace with solid Fill/Stroke");
            } else {
                lines.push(head);
            }

            if (p.matchName==="ADBE Root Vectors Group" || p.matchName==="ADBE Vector Group" || p.matchName==="ADBE Vectors Group") {
                lines.push(indent+"  // NOTE: addProperty(matchName) required");
            }

            var nextParent = parentGroupName;
            if (p.matchName==="ADBE Vector Group") nextParent = p.name;

            walkVectors(p, indent+"  ", layer, lines, nextParent);
        }
    }
}

function walkTransform(group, indent, layer, lines) {
    if (!group) return;
    for (var i=1;i<=group.numProperties;i++) {
        var p=group.property(i); if (!p) continue; if (p.name==="") continue;
        if (p.matchName==="ADBE Effect Parade") continue;
        if (p.matchName.indexOf("ADBE Position_")===0 && !layer.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated) continue;
        if (p.matchName==="ADBE Material Group" && !layer.threeDLayer) continue;
        if (!isModifiedProp(p) && p.propertyType===PropertyType.PROPERTY) continue;
        var head=indent + p.name + " [" + p.matchName + "]";
        if (p.propertyType===PropertyType.PROPERTY) {
            var line=head;
            if (p.numKeys>0) line+=" (animated, "+p.numKeys+" keys)"; else try { line+=": "+fmt(p.value); } catch(e){ line+=": <unavailable>"; }
            lines.push(line);
        } else { lines.push(head); walkTransform(p, indent+"  ", layer, lines); }
    }
}

function extractShapeLayer(layer) {
    var comp=layer.containingComp; var lines=[];
    lines.push("LAYER: " + layer.name + " (index " + layer.index + ") [Shape]");
    lines.push("  label: " + layer.label + " | threeDLayer: " + layer.threeDLayer + " | locked: " + layer.locked + " | shy: " + layer.shy + " | solo: " + layer.solo + " | enabled: " + layer.enabled);
    try { lines.push("  blendingMode: " + enumName(layer.blendingMode, BlendingMode, BLEND_KEYS) + " (" + layer.blendingMode + ")"); } catch(e){}
    try {
        var tmType=layer.trackMatteType; var tmName=enumName(tmType, TrackMatteType, TRACK_MATTE_KEYS);
        lines.push("  trackMatteType: " + tmName + " (" + tmType + ")");
    } catch(e){}
    lines.push("Transform");
    try { walkTransform(layer.property("ADBE Transform Group"), "  ", layer, lines); } catch(e){ lines.push("  Transform: <error>"); }
    if (layer.threeDLayer) { try { lines.push("Material Options"); walkTransform(layer.property("ADBE Material Group"), "  ", layer, lines); } catch(e){} }
    try {
        var root=layer.property("ADBE Root Vectors Group");
        if (root) { lines.push("Contents [ADBE Root Vectors Group]: " + root.numProperties + " groups"); walkVectors(root, "  ", layer, lines, "<root>"); }
    } catch(e){ lines.push("Contents: <error "+e.toString()+">"); }
    try {
        var maskParade=layer.property("ADBE Mask Parade");
        if (maskParade && maskParade.numProperties>0) { lines.push("Masks: " + maskParade.numProperties); walkTransform(maskParade, "  ", layer, lines); }
        else lines.push("Masks: none");
    } catch(e){}
    try { lines.push("Time: startTime " + layer.startTime.toFixed(3) + " | inPoint " + layer.inPoint.toFixed(3) + " | outPoint " + layer.outPoint.toFixed(3) + " | stretch " + layer.stretch); } catch(e){}
    return lines.join("\n");
}

function showGradientWarningDialog(issues) {
    var w = new Window("dialog", "Gradient Detected - Warning", undefined, {resizeable: true});
    w.orientation = "column";
    var msg = w.add("statictext", undefined, "Found "+issues.length+" gradient fill/stroke(s) that cannot be recreated via code.", {multiline: true});
    msg.preferredSize.width = 500;

    var listText = "";
    for (var i=0;i<issues.length;i++) {
        var it = issues[i];
        listText += "- Layer ["+it.layerName+"] (index "+it.layerIndex+") > Shape ["+it.shapeGroupName+"] has "+it.gradType+" ["+it.gradName+"]\n";
    }
    listText += "\nFix: Use Effect > Generate > Gradient Ramp or 4-Color Gradient instead of G-Fill/G-Stroke,\n";
    listText += "OR replace with solid Fill/Stroke (ADBE Vector Graphic - Fill/Stroke) which is fully scriptable.\n";
    listText += "\nGradients (G-Fill/G-Stroke) use CUSTOM_VALUE and cannot be set via ExtendScript.\n";
    listText += "If you proceed, dump will still be created but gradient colors will be default black->white and need manual fix.";

    var et = w.add("edittext", undefined, listText, {multiline: true, scrolling: true, readonly: true});
    et.preferredSize.width = 500;
    et.preferredSize.height = 200;

    var btnGroup = w.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignment = "right";
    var proceedBtn = btnGroup.add("button", undefined, "Proceed Anyway (Dump with Warning)", {name: "ok"});
    var cancelBtn = btnGroup.add("button", undefined, "Cancel - Let me fix it", {name: "cancel"});

    var result = false;
    proceedBtn.onClick = function() { result = true; w.close(); };
    cancelBtn.onClick = function() { result = false; w.close(); };

    w.show();
    return result;
}

function showOutput(text) {
    var w=new Window("dialog", "Shape Layer Data - CLEAN + Gradient Check", undefined, {resizeable: true});
    var et=w.add("edittext", undefined, text, {multiline: true, scrolling: true});
    et.preferredSize=[900,700];
    var g=w.add("group"); g.add("button", undefined, "Select All").onClick=function(){ et.active=false; et.active=true; };
    g.add("button", undefined, "Close").onClick=function(){ w.close(); };
    w.show();
}

var comp=app.project.activeItem;
if (!(comp instanceof CompItem)) alert("Open a comp first.");
else {
    gradientIssues = [];
    var out=[]; for (var n=0;n<comp.selectedLayers.length;n++) { var ly=comp.selectedLayers[n]; try { if (ly instanceof ShapeLayer) out.push(extractShapeLayer(ly)); } catch(e){} }
    if (out.length===0) alert("Select SHAPE layer.");
    else {
        if (gradientIssues.length>0) {
            var shouldProceed = showGradientWarningDialog(gradientIssues);
            if (!shouldProceed) {
                // User chose to cancel and fix
                alert("Cancelled. Please replace Gradient Fill/Stroke with solid Fill/Stroke or use Gradient Ramp / 4-Color Gradient effect instead, then run extractor again.");
            } else {
                var warningHeader = "=== GRADIENT WARNING ===\nFound "+gradientIssues.length+" gradient(s) that are NOT scriptable:\n";
                for (var i=0;i<gradientIssues.length;i++) {
                    var it=gradientIssues[i];
                    warningHeader += "- Layer ["+it.layerName+"] > Shape ["+it.shapeGroupName+"] has "+it.gradType+" ["+it.gradName+"] -> Use Gradient Ramp or 4-Color Gradient instead\n";
                }
                warningHeader += "These will appear as default black->white in recreation and need manual fix.\n=== END WARNING ===\n\n";

                var notes=[
                    "NOTES - CLEAN VERSION + GRADIENT CHECK:",
                    "- Material Options SKIPPED if threeDLayer=false",
                    "- GRADIENT DETECTION: G-Fill/G-Stroke detected, warned user, still dumped with warning",
                    "- Fix suggested: Effect > Generate > Gradient Ramp or 4-Color Gradient (scriptable) OR solid Fill/Stroke",
                    "- Parametric Rect/Ellipse: only Size/Position/Roundness",
                    "- Bezier Shape: full vertices"
                ].join("\n");
                showOutput(warningHeader + out.join("\n\n") + "\n\n" + notes);
            }
        } else {
            var notes=[
                "NOTES - CLEAN VERSION + GRADIENT CHECK:",
                "- No gradients found - fully scriptable",
                "- Material Options SKIPPED if threeDLayer=false",
                "- Parametric: Size/Position/Roundness only, Bezier: vertices"
            ].join("\n");
            showOutput(out.join("\n\n") + "\n\n" + notes);
        }
    }
}
