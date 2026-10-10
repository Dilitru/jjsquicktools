// ---------- Comp Layer Extractor - CLEAN (No Deep Dive) ----------
// For Precomp layers: AVLayer where source is CompItem
// Only extracts transforms ON the layer itself, does NOT open source comp

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
                } catch(e){ line += ": <unavailable>"; }
            }
            lines.push(line);
        } else {
            var hasModChild=false;
            try { for (var ci=1; ci<=p.numProperties; ci++) { var cp=p.property(ci); if (!cp) continue; if (isModifiedProp(cp)) { hasModChild=true; break; } } } catch(e){}
            if (!mod && !hasModChild) continue;
            lines.push(head);
            walkEffectProps(p, indent+"  ", layer, lines);
        }
    }
}

function extractCompLayer(layer) {
    var comp=layer.containingComp; var lines=[];
    lines.push("LAYER: " + layer.name + " (index " + layer.index + ") [Comp/Precomp]");
    lines.push("  label: " + layer.label + " | threeDLayer: " + layer.threeDLayer + " | locked: " + layer.locked + " | shy: " + layer.shy + " | solo: " + layer.solo + " | enabled: " + layer.enabled);

    // Source Comp Info - DO NOT OPEN, just reference
    try {
        var src = layer.source;
        if (src && src instanceof CompItem) {
            lines.push("  source: Comp '"+src.name+"' ["+src.width+"x"+src.height+"] duration "+src.duration.toFixed(3)+"s | id: "+src.id+"  // NOTE: Does NOT open inner comp");
        } else if (src) {
            lines.push("  source: "+src.name+" (not a CompItem - type: "+src.typeName+")");
        } else {
            lines.push("  source: <no source>");
        }
    } catch(e){ lines.push("  source: <unavailable "+e.toString()+">"); }

    // AVLayer specific flags
    try { lines.push("  collapseTransformation (continuously rasterize): " + layer.collapseTransformation); } catch(e){}
    try { lines.push("  frameBlending: " + layer.frameBlending + " | motionBlur: " + layer.motionBlur); } catch(e){}
    try { lines.push("  adjustmentLayer: " + layer.adjustmentLayer + " | nullLayer: " + layer.nullLayer + " | guideLayer: " + layer.guideLayer); } catch(e){}

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

    // Time
    try {
        lines.push("AV Timing");
        lines.push("  startTime: "+layer.startTime.toFixed(3)+" | inPoint: "+layer.inPoint.toFixed(3)+" | outPoint: "+layer.outPoint.toFixed(3)+" | stretch: "+layer.stretch);
        try { lines.push("  sourceTimeOffset (timeRemap disabled): "+layer.sourceTimeOffset.toFixed(3)); } catch(e2){}
        // Time Remap
        try {
            var timeRemap = layer.property("ADBE Time Remapping");
            if (timeRemap) {
                if (timeRemap.enabled || timeRemap.numKeys>0 || timeRemap.isModified) {
                    lines.push("  Time Remapping [ADBE Time Remapping]: enabled "+timeRemap.enabled+" (modified)");
                    if (timeRemap.numKeys>0) {
                        var kf = readKeyframes(timeRemap);
                        lines.push(kf);
                    }
                } else {
                    lines.push("  Time Remapping: disabled (default)");
                }
            }
        } catch(e){}
    } catch(e){}

    // Masks
    try {
        var maskParade=layer.property("ADBE Mask Parade");
        if (maskParade && maskParade.numProperties>0) { lines.push("Masks: " + maskParade.numProperties); walkTransform(maskParade, "  ", layer, lines); }
        else lines.push("Masks: none");
    } catch(e){}

    // Effects (if any on precomp layer itself)
    try {
        var fxParade = layer.property("ADBE Effect Parade");
        if (!fxParade || fxParade.numProperties===0) {
            lines.push("Effects: none");
        } else {
            lines.push("Effects [ADBE Effect Parade]: " + fxParade.numProperties + " effects");
            for (var ei=1; ei<=fxParade.numProperties; ei++) {
                var fx = fxParade.property(ei); if (!fx) continue;
                var fxEnabled=true; try { fxEnabled=fx.enabled; } catch(e){}
                lines.push("  Effect "+ei+": "+fx.name+" ["+fx.matchName+"] enabled: "+fxEnabled+" // addProperty('"+fx.matchName+"')");
                walkEffectProps(fx, "    ", layer, lines);
            }
        }
    } catch(e){}

    return lines.join("\n");
}

function showOutput(text) {
    var w=new Window("dialog", "Comp Layer Data - CLEAN (No Open)", undefined, {resizeable: true});
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
        var isComp=false;
        try {
            if (ly instanceof AVLayer && ly.source instanceof CompItem) isComp=true;
        } catch(e){}
        if (isComp) out.push(extractCompLayer(ly));
    }
    if (out.length===0) alert("Select at least one COMP / PRECOMP layer (AVLayer with CompItem source).");
    else {
        var notes=[
            "NOTES - COMP LAYER CLEAN VERSION (No Deep Dive):",
            "- Only extracts transforms ON the comp layer itself, does NOT open source comp",
            "- Source info dumped as: name, width x height, duration, id - for reference only",
            "- Flags: collapseTransformation (continuously rasterize), frameBlending, motionBlur",
            "- Transform only modified props (same as Null/Shape V2)",
            "- AV Timing: startTime/inPoint/outPoint/stretch/sourceTimeOffset",
            "- Time Remapping dumped if enabled/modified",
            "- Masks dumped if present",
            "- Effects on precomp layer itself (not inside) dumped clean",
            "- Creation:",
            "  var precompLayer = comp.layers.add(sourceComp); // sourceComp is CompItem from project",
            "  precompLayer.name = 'My Precomp';",
            "  precompLayer.collapseTransformation = true; // continuously rasterize",
            "  precompLayer.startTime = 0; precompLayer.inPoint = 0;",
            "- To find source comp: app.project.itemById(id) or loop project.items for CompItem with matching name"
        ].join("\n");
        showOutput(out.join("\n\n") + "\n\n" + notes);
    }
}
