// ---------- Null Layer Extractor - CLEAN ----------
// Same pattern as Shape V2 + Solid: skip defaults, only modified transform, skip Material unless 3D

function enumName(value, enumObj, keys) {
    for (var i = 0; i < keys.length; i++) { try { if (enumObj[keys[i]] === value) return keys[i]; } catch(e){} }
    try { for (var k in enumObj) { try { if (enumObj[k] === value) return k; } catch(e2){} } } catch(e){}
    return "UNKNOWN(" + value + ")";
}
function fmt(v) {
    if (v instanceof Array) { var a=[]; for (var i=0;i<v.length;i++) a.push(fmt(v[i])); return a.join(","); }
    return (typeof v === "number") ? String(Math.round(v * 1000) / 1000) : String(v);
}
var BLEND_KEYS = ["NORMAL","DISSOLVE","DANCING_DISSOLVE","DARKEN","MULTIPLY","COLOR_BURN","CLASSIC_COLOR_BURN","LINEAR_BURN","DARKER_COLOR","ADD","LIGHTEN","SCREEN","COLOR_DODGE","CLASSIC_COLOR_DODGE","LINEAR_DODGE","LIGHTER_COLOR","OVERLAY","SOFT_LIGHT","HARD_LIGHT","LINEAR_LIGHT","VIVID_LIGHT","PIN_LIGHT","HARD_MIX","DIFFERENCE","CLASSIC_DIFFERENCE","EXCLUSION","SUBTRACT","DIVIDE","HUE","SATURATION","COLOR","LUMINOSITY","STENCIL_ALPHA","STENCIL_LUMA","SILHOUETE_ALPHA","SILHOUETE_LUMA","ALPHA_ADD"];
var TRACK_MATTE_KEYS = ["NO_TRACK_MATTE","ALPHA_MATTE","ALPHA_INVERTED_MATTE","LUMA_MATTE","LUMA_INVERTED_MATTE","ALPHA","ALPHA_INVERTED","LUMA","LUMA_INVERTED"];

function readKeyframes(prop) {
    var out=[]; var INTERP=["LINEAR","BEZIER","HOLD"];
    for (var k=1;k<=prop.numKeys;k++) {
        var inT=prop.keyInInterpolationType(k); var outT=prop.keyOutInterpolationType(k);
        var s="key "+k+" @ "+prop.keyTime(k).toFixed(3)+"s | value: "+fmt(prop.keyValue(k))+" | in: "+enumName(inT,KeyframeInterpolationType,INTERP)+" | out: "+enumName(outT,KeyframeInterpolationType,INTERP);
        if (inT===KeyframeInterpolationType.BEZIER || outT===KeyframeInterpolationType.BEZIER) {
            try {
                var ei=prop.keyInTemporalEase(k), eo=prop.keyOutTemporalEase(k);
                var ease=[]; for (var d=0; d<ei.length; d++) ease.push("[in "+fmt(ei[d].speed)+"/"+fmt(ei[d].influence)+", out "+fmt(eo[d].speed)+"/"+fmt(eo[d].influence)+"]");
                s+=" | ease: "+ease.join(" ");
            } catch(e){}
        }
        out.push(s);
    }
    return out.join("\n");
}
function isModifiedProp(p) {
    try { return p.isModified || p.numKeys>0 || (p.canSetExpression && p.expressionEnabled); } catch(e){ return false; }
}

function walkTransform(group, indent, layer, lines) {
    if (!group) return;
    for (var i=1;i<=group.numProperties;i++) {
        var p=group.property(i); if (!p) continue; if (p.name==="") continue;
        if (p.matchName==="ADBE Effect Parade") continue;
        if (p.matchName.indexOf("ADBE Position_")===0 && !layer.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated) continue;
        if (p.matchName==="ADBE Material Group" && !layer.threeDLayer) continue;
        // For null, skip defaults unless modified - same as Shape V2 clean
        if (!isModifiedProp(p) && p.propertyType===PropertyType.PROPERTY) continue;
        var head=indent + p.name + " [" + p.matchName + "]";
        if (p.propertyType===PropertyType.PROPERTY) {
            var line=head;
            if (p.numKeys>0) line+=" (animated, "+p.numKeys+" keys)"; else try { line+=": "+fmt(p.value); } catch(e){ line+=": <unavailable>"; }
            lines.push(line);
            if (p.numKeys>0) { var kf=readKeyframes(p).split("\n"); for (var m=0;m<kf.length;m++) lines.push(indent+"  "+kf[m]); }
            if (p.canSetExpression && p.expressionEnabled) lines.push(indent+"  expression: "+p.expression.replace(/\r?\n/g, " \\n "));
        } else {
            lines.push(head);
            walkTransform(p, indent+"  ", layer, lines);
        }
    }
}

function extractNullLayer(layer) {
    var comp=layer.containingComp; var lines=[];
    lines.push("LAYER: " + layer.name + " (index " + layer.index + ") [Null]");
    lines.push("  label: " + layer.label + " | threeDLayer: " + layer.threeDLayer + " | locked: " + layer.locked + " | shy: " + layer.shy + " | solo: " + layer.solo + " | enabled: " + layer.enabled + " | nullLayer: " + layer.nullLayer);
    try { lines.push("  blendingMode: " + enumName(layer.blendingMode, BlendingMode, BLEND_KEYS) + " (" + layer.blendingMode + ")"); } catch(e){}
    try {
        var tmType=layer.trackMatteType; var tmName=enumName(tmType, TrackMatteType, TRACK_MATTE_KEYS);
        lines.push("  trackMatteType: " + tmName + " (" + tmType + ")");
        if (tmType!==TrackMatteType.NO_TRACK_MATTE && tmType!==5012) {
            var matte=null; try { if (layer.index>1) matte=comp.layer(layer.index-1); } catch(e2){}
            if (matte) lines.push("  trackMatteLayer: " + matte.name + " (index " + matte.index + ")");
        }
    } catch(e){}
    // Parent
    try {
        if (layer.parent) lines.push("  parent: " + layer.parent.name + " (index " + layer.parent.index + ")");
        else lines.push("  parent: none");
    } catch(e) {}

    lines.push("Transform");
    try { walkTransform(layer.property("ADBE Transform Group"), "  ", layer, lines); } catch(e){ lines.push("  Transform: <error "+e.toString()+">"); }

    // Material Options only if 3D
    if (layer.threeDLayer) {
        try { lines.push("Material Options"); walkTransform(layer.property("ADBE Material Group"), "  ", layer, lines); } catch(e){}
    }

    // Nulls can have masks? Usually no, but check
    try {
        var maskParade=layer.property("ADBE Mask Parade");
        if (maskParade && maskParade.numProperties>0) { lines.push("Masks: " + maskParade.numProperties); walkTransform(maskParade, "  ", layer, lines); }
        else lines.push("Masks: none");
    } catch(e){}

    try { lines.push("Time: startTime " + layer.startTime.toFixed(3) + " | inPoint " + layer.inPoint.toFixed(3) + " | outPoint " + layer.outPoint.toFixed(3) + " | stretch " + layer.stretch); } catch(e){}

    // Effects? Nulls can have effects - we skip by default but note if present
    try {
        var fxParade = layer.property("ADBE Effect Parade");
        if (fxParade && fxParade.numProperties>0) lines.push("Effects: " + fxParade.numProperties + " (skipped to avoid bloat - enable if needed)");
        else lines.push("Effects: none");
    } catch(e){}

    return lines.join("\n");
}

function showOutput(text) {
    var w=new Window("dialog", "Null Layer Data - CLEAN", undefined, {resizeable: true});
    var et=w.add("edittext", undefined, text, {multiline: true, scrolling: true});
    et.preferredSize=[900,700];
    var g=w.add("group"); g.add("button", undefined, "Select All").onClick=function(){ et.active=false; et.active=true; };
    g.add("button", undefined, "Close").onClick=function(){ w.close(); };
    w.show();
}

var comp=app.project.activeItem;
if (!(comp instanceof CompItem)) alert("Open a comp first.");
else {
    var out=[]; for (var n=0;n<comp.selectedLayers.length;n++) {
        var ly=comp.selectedLayers[n];
        var isNull=false;
        try { if (ly.nullLayer) isNull=true; } catch(e){}
        if (isNull) out.push(extractNullLayer(ly));
    }
    if (out.length===0) alert("Select at least one NULL layer (Layer > New > Null Object).");
    else {
        var notes=[
            "NOTES - NULL CLEAN VERSION:",
            "- Null has no source, no vectors - only Transform + flags",
            "- Transform only dumps modified props (Position, Scale etc if not default) - same as Shape V2",
            "- Material Options SKIPPED if threeDLayer=false (2D null)",
            "- Parent dumped if exists",
            "- blendingMode / trackMatte dumped but usually NORMAL / NO_TRACK_MATTE for nulls",
            "- Creation: comp.layers.addNull() - then set name, label, threeDLayer, parent, transform",
            "- Time: startTime / inPoint / outPoint / stretch"
        ].join("\n");
        showOutput(out.join("\n\n") + "\n\n" + notes);
    }
}
