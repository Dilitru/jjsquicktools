// ---------- Adjustment Layer Extractor - CLEAN ----------
// Combines Null CLEAN + Effects CLEAN
// Adjustment layers are AVLayers with adjustmentLayer=true

function enumName(value, enumObj, keys) {
    for (var i = 0; i < keys.length; i++) { try { if (enumObj[keys[i]] === value) return keys[i]; } catch(e){} }
    try { for (var k in enumObj) { try { if (enumObj[k] === value) return k; } catch(e2){} } } catch(e){}
    return "UNKNOWN(" + value + ")";
}
function fmt(v) {
    if (v instanceof Array) { var a=[]; for (var i=0;i<v.length;i++) a.push(fmt(v[i])); return a.join(","); }
    return (typeof v === "number") ? String(Math.round(v * 1000) / 1000) : String(v);
}
function fmtColor(c) { try { return fmt(c) + "  // [R,G,B,A 0-1]"; } catch(e){ return "<color>"; } }
var BLEND_KEYS = ["NORMAL","DISSOLVE","DANCING_DISSOLVE","DARKEN","MULTIPLY","COLOR_BURN","CLASSIC_COLOR_BURN","LINEAR_BURN","DARKER_COLOR","ADD","LIGHTEN","SCREEN","COLOR_DODGE","CLASSIC_COLOR_DODGE","LINEAR_DODGE","LIGHTER_COLOR","OVERLAY","SOFT_LIGHT","HARD_LIGHT","LINEAR_LIGHT","VIVID_LIGHT","PIN_LIGHT","HARD_MIX","DIFFERENCE","CLASSIC_DIFFERENCE","EXCLUSION","SUBTRACT","DIVIDE","HUE","SATURATION","COLOR","LUMINOSITY","STENCIL_ALPHA","STENCIL_LUMA","SILHOUETE_ALPHA","SILHOUETE_LUMA","ALPHA_ADD"];
var TRACK_MATTE_KEYS = ["NO_TRACK_MATTE","ALPHA_MATTE","ALPHA_INVERTED_MATTE","LUMA_MATTE","LUMA_INVERTED_MATTE","ALPHA","ALPHA_INVERTED","LUMA","LUMA_INVERTED"];

function isModifiedProp(p) {
    try { return p.isModified || p.numKeys>0 || (p.canSetExpression && p.expressionEnabled); } catch(e){ return false; }
}
function readKeyframes(prop) {
    var out=[]; var INTERP=["LINEAR","BEZIER","HOLD"];
    for (var k=1;k<=prop.numKeys;k++) {
        var inT=prop.keyInInterpolationType(k); var outT=prop.keyOutInterpolationType(k);
        var s="key "+k+" @ "+prop.keyTime(k).toFixed(3)+"s | value: "+fmt(prop.keyValue(k))+" | in: "+enumName(inT,KeyframeInterpolationType,INTERP)+" | out: "+enumName(outT,KeyframeInterpolationType,INTERP);
        out.push(s);
    }
    return out.join("\n");
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
            if (p.numKeys>0) { var kf=readKeyframes(p).split("\n"); for (var m=0;m<kf.length;m++) lines.push(indent+"  "+kf[m]); }
            if (p.canSetExpression && p.expressionEnabled) lines.push(indent+"  expression: "+p.expression.replace(/\r?\n/g, " \\n "));
        } else { lines.push(head); walkTransform(p, indent+"  ", layer, lines); }
    }
}
function walkEffectProps(effectGroup, indent, layer, lines) {
    for (var i=1; i<=effectGroup.numProperties; i++) {
        var p = effectGroup.property(i); if (!p) continue; if (p.name === "") continue;
        var isProp = (p.propertyType === PropertyType.PROPERTY);
        var mod = isModifiedProp(p);
        if (isProp && !mod) continue;
        var head = indent + p.name + " [" + p.matchName + "]";
        if (isProp) {
            var line = head;
            if (p.numKeys>0) line += " (animated, "+p.numKeys+" keys)";
            else {
                try {
                    var vt = p.propertyValueType;
                    if (vt === PropertyValueType.COLOR) line += ": " + fmtColor(p.value);
                    else if (vt !== PropertyValueType.NO_VALUE && vt !== PropertyValueType.CUSTOM_VALUE) line += ": " + fmt(p.value);
                    else line += ": <custom: " + fmt(p.value) + ">";
                } catch(e){ line += ": <unavailable>"; }
            }
            lines.push(line);
            if (p.numKeys>0) { var kf=readKeyframes(p); if (kf) lines.push(indent+"  "+kf); }
            if (p.canSetExpression && p.expressionEnabled) try { lines.push(indent+"  expression: "+p.expression.replace(/\r?\n/g, " \\n ")); } catch(e){}
        } else {
            var hasModChild=false;
            try { for (var ci=1; ci<=p.numProperties; ci++) { var cp=p.property(ci); if (!cp) continue; if (isModifiedProp(cp)) { hasModChild=true; break; } } } catch(e){}
            if (!mod && !hasModChild) continue;
            lines.push(head);
            walkEffectProps(p, indent+"  ", layer, lines);
        }
    }
}

function extractAdjustmentLayer(layer) {
    var comp=layer.containingComp; var lines=[];
    lines.push("LAYER: " + layer.name + " (index " + layer.index + ") [Adjustment]");
    lines.push("  label: " + layer.label + " | threeDLayer: " + layer.threeDLayer + " | locked: " + layer.locked + " | shy: " + layer.shy + " | solo: " + layer.solo + " | enabled: " + layer.enabled + " | adjustmentLayer: " + layer.adjustmentLayer);
    try { lines.push("  blendingMode: " + enumName(layer.blendingMode, BlendingMode, BLEND_KEYS) + " (" + layer.blendingMode + ")"); } catch(e){}
    try {
        var tmType=layer.trackMatteType; var tmName=enumName(tmType, TrackMatteType, TRACK_MATTE_KEYS);
        lines.push("  trackMatteType: " + tmName + " (" + tmType + ")");
        if (tmType!==TrackMatteType.NO_TRACK_MATTE && tmType!==5012) {
            var matte=null; try { if (layer.index>1) matte=comp.layer(layer.index-1); } catch(e2){}
            if (matte) lines.push("  trackMatteLayer: " + matte.name + " (index " + matte.index + ")");
        }
    } catch(e){}
    try { if (layer.parent) lines.push("  parent: " + layer.parent.name + " (index " + layer.parent.index + ")"); else lines.push("  parent: none"); } catch(e) {}

    lines.push("Transform");
    try { walkTransform(layer.property("ADBE Transform Group"), "  ", layer, lines); } catch(e){ lines.push("  Transform: <error "+e.toString()+">"); }

    if (layer.threeDLayer) {
        try { lines.push("Material Options"); walkTransform(layer.property("ADBE Material Group"), "  ", layer, lines); } catch(e){}
    }

    // Masks - adjustment layers often use masks
    try {
        var maskParade=layer.property("ADBE Mask Parade");
        if (maskParade && maskParade.numProperties>0) { lines.push("Masks: " + maskParade.numProperties); walkTransform(maskParade, "  ", layer, lines); }
        else lines.push("Masks: none");
    } catch(e){}

    // Effects - CRITICAL for adjustment layers
    try {
        var fxParade = layer.property("ADBE Effect Parade");
        if (!fxParade || fxParade.numProperties===0) {
            lines.push("Effects [ADBE Effect Parade]: 0 effects - none (adjustment layer usually needs effects)");
        } else {
            lines.push("Effects [ADBE Effect Parade]: " + fxParade.numProperties + " effects");
            for (var ei=1; ei<=fxParade.numProperties; ei++) {
                var fx = fxParade.property(ei); if (!fx) continue;
                var fxEnabled=true; try { fxEnabled=fx.enabled; } catch(e){}
                lines.push("  Effect "+ei+": "+fx.name+" ["+fx.matchName+"] enabled: "+fxEnabled+"  // NOTE: addProperty('"+fx.matchName+"')");
                walkEffectProps(fx, "    ", layer, lines);
            }
        }
    } catch(e){ lines.push("Effects: <error "+e.toString()+">"); }

    try { lines.push("Time: startTime " + layer.startTime.toFixed(3) + " | inPoint " + layer.inPoint.toFixed(3) + " | outPoint " + layer.outPoint.toFixed(3) + " | stretch " + layer.stretch); } catch(e){}

    return lines.join("\n");
}

function showOutput(text) {
    var w=new Window("dialog", "Adjustment Layer Data - CLEAN", undefined, {resizeable: true});
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
        var isAdj=false;
        try { if (ly.adjustmentLayer) isAdj=true; } catch(e){}
        if (isAdj) out.push(extractAdjustmentLayer(ly));
    }
    if (out.length===0) alert("Select at least one ADJUSTMENT layer (Layer > New > Adjustment Layer or toggle adjustment switch).");
    else {
        var notes=[
            "NOTES - ADJUSTMENT LAYER CLEAN VERSION:",
            "- Adjustment = AVLayer + adjustmentLayer=true (flag)",
            "- Transform only modified props (same as Null/Shape V2)",
            "- Effects are CRITICAL: dumps only modified effect params, with matchName for recreation",
            "- Masks dumped if present (adjustment layers often use masks)",
            "- Creation: ",
            "  var adj = comp.layers.addSolid([1,1,1], 'Adjustment', comp.width, comp.height, 1);",
            "  adj.adjustmentLayer = true;",
            "  adj.name = 'Adjustment Layer 1';",
            "  // or comp.layers.addBoxText() not needed - solid is common",
            "  var fx = adj.property('ADBE Effect Parade').addProperty('ADBE Ramp');",
            "- blendingMode usually NORMAL, but can be other for adjustment",
            "- Time: inPoint/outPoint define where adjustment applies"
        ].join("\n");
        showOutput(out.join("\n\n") + "\n\n" + notes);
    }
}
