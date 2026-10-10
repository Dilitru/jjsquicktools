// ---------- Effects Extractor - CLEAN ----------
// Works on ANY layer type (Text, Shape, Solid, Null, AV)
// Only dumps modified props inside effects, skip defaults
// Based on Shape V2 + Null clean pattern

function enumName(value, enumObj, keys) {
    for (var i = 0; i < keys.length; i++) { try { if (enumObj[keys[i]] === value) return keys[i]; } catch(e){} }
    try { for (var k in enumObj) { try { if (enumObj[k] === value) return k; } catch(e2){} } } catch(e){}
    return "UNKNOWN(" + value + ")";
}
function fmt(v) {
    if (v instanceof Array) {
        var a=[]; for (var i=0;i<v.length;i++) a.push(fmt(v[i]));
        return a.join(",");
    }
    if (v && typeof v === "object" && v.vertices !== undefined) {
        // Shape inside effect (rare, e.g. mask path)
        try { return "vertices:" + fmt(v.vertices) + " | closed:" + v.closed; } catch(e){ return "<shape>"; }
    }
    return (typeof v === "number") ? String(Math.round(v * 1000) / 1000) : String(v);
}
function fmtColor(c) {
    // AE color is [R,G,B] or [R,G,B,A] 0-1 float
    try { return fmt(c) + "  // [R,G,B,A 0-1]"; } catch(e){ return "<color>"; }
}

var BLEND_KEYS = ["NORMAL","DISSOLVE","DANCING_DISSOLVE","DARKEN","MULTIPLY","COLOR_BURN","CLASSIC_COLOR_BURN","LINEAR_BURN","DARKER_COLOR","ADD","LIGHTEN","SCREEN","COLOR_DODGE","CLASSIC_COLOR_DODGE","LINEAR_DODGE","LIGHTER_COLOR","OVERLAY","SOFT_LIGHT","HARD_LIGHT","LINEAR_LIGHT","VIVID_LIGHT","PIN_LIGHT","HARD_MIX","DIFFERENCE","CLASSIC_DIFFERENCE","EXCLUSION","SUBTRACT","DIVIDE","HUE","SATURATION","COLOR","LUMINOSITY","STENCIL_ALPHA","STENCIL_LUMA","SILHOUETE_ALPHA","SILHOUETE_LUMA","ALPHA_ADD"];

function isModifiedProp(p) {
    try { return p.isModified || p.numKeys>0 || (p.canSetExpression && p.expressionEnabled); } catch(e){ return false; }
}

function readKeyframes(prop) {
    var out=[]; var INTERP=["LINEAR","BEZIER","HOLD"];
    for (var k=1;k<=prop.numKeys;k++) {
        var inT=prop.keyInInterpolationType(k); var outT=prop.keyOutInterpolationType(k);
        var valStr="";
        try { valStr=fmt(prop.keyValue(k)); } catch(e){ valStr="<unavailable>"; }
        var s="    key "+k+" @ "+prop.keyTime(k).toFixed(3)+"s | value: "+valStr+" | in: "+enumName(inT,KeyframeInterpolationType,INTERP)+" | out: "+enumName(outT,KeyframeInterpolationType,INTERP);
        out.push(s);
    }
    return out.join("\n");
}

function walkEffectProps(effectGroup, indent, layer, lines) {
    // effectGroup is like ADBE Ramp, contains properties
    for (var i=1; i<=effectGroup.numProperties; i++) {
        var p = effectGroup.property(i);
        if (!p) continue;
        if (p.name === "") continue;

        var isProp = (p.propertyType === PropertyType.PROPERTY);
        var mod = isModifiedProp(p);

        // For effects, we want to show modified OR essential properties like Color, Point, Slider
        // But skip if not modified to keep clean
        if (isProp && !mod) {
            // Keep if it's a key property type? No, skip defaults for clean version
            // Exception: Color properties often have default but we still want if user cares? We skip anyway, only modified
            continue;
        }

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
            if (p.numKeys>0) {
                var kf = readKeyframes(p);
                if (kf) lines.push(kf);
            }
            if (p.canSetExpression && p.expressionEnabled) {
                try { lines.push(indent+"  expression: "+p.expression.replace(/\r?\n/g, " \\n ")); } catch(e){}
            }
        } else {
            // Group inside effect (e.g. some effects have nested groups)
            // Check if any child modified
            var hasModChild = false;
            try {
                for (var ci=1; ci<=p.numProperties; ci++) {
                    var cp = p.property(ci); if (!cp) continue;
                    if (isModifiedProp(cp)) { hasModChild=true; break; }
                    if (cp.numProperties) {
                        for (var cj=1; cj<=cp.numProperties; cj++) {
                            var cc = cp.property(cj); if (!cc) continue;
                            if (isModifiedProp(cc)) { hasModChild=true; break; }
                        }
                    }
                    if (hasModChild) break;
                }
            } catch(e){}
            if (!mod && !hasModChild) continue;
            lines.push(head);
            walkEffectProps(p, indent+"  ", layer, lines);
        }
    }
}

function extractEffects(layer) {
    var comp=layer.containingComp; var lines=[];
    var typeLabel = "Unknown";
    try { if (layer instanceof TextLayer) typeLabel="Text"; else if (layer instanceof ShapeLayer) typeLabel="Shape"; else if (layer.nullLayer) typeLabel="Null"; else if (layer instanceof AVLayer) typeLabel="AV"; } catch(e){}
    lines.push("LAYER: " + layer.name + " (index " + layer.index + ") ["+typeLabel+"]");
    lines.push("  label: " + layer.label + " | threeDLayer: " + layer.threeDLayer + " | enabled: " + layer.enabled);

    try {
        var fxParade = layer.property("ADBE Effect Parade");
        if (!fxParade || fxParade.numProperties===0) {
            lines.push("Effects [ADBE Effect Parade]: 0 effects - none");
            return lines.join("\n");
        }
        lines.push("Effects [ADBE Effect Parade]: " + fxParade.numProperties + " effects");
        for (var ei=1; ei<=fxParade.numProperties; ei++) {
            var fx = fxParade.property(ei);
            if (!fx) continue;
            var fxEnabled = true;
            try { fxEnabled = fx.enabled; } catch(e){}
            lines.push("  Effect "+ei+": "+fx.name+" ["+fx.matchName+"] enabled: "+fxEnabled+"  // NOTE: addProperty('"+fx.matchName+"') to recreate");
            // Dump its params (only modified)
            walkEffectProps(fx, "    ", layer, lines);
        }
    } catch(e) {
        lines.push("Effects: <error "+e.toString()+">");
    }

    // Also dump time for context
    try { lines.push("Time: startTime " + layer.startTime.toFixed(3) + " | inPoint " + layer.inPoint.toFixed(3) + " | outPoint " + layer.outPoint.toFixed(3)); } catch(e){}

    return lines.join("\n");
}

function showOutput(text) {
    var w=new Window("dialog", "Effects Data - CLEAN", undefined, {resizeable: true});
    var et=w.add("edittext", undefined, text, {multiline: true, scrolling: true});
    et.preferredSize=[900,700];
    var g=w.add("group");
    g.add("button", undefined, "Select All").onClick=function(){ et.active=false; et.active=true; };
    g.add("button", undefined, "Close").onClick=function(){ w.close(); };
    w.show();
}

var comp=app.project.activeItem;
if (!(comp instanceof CompItem)) alert("Open a comp first.");
else {
    var out=[];
    for (var n=0;n<comp.selectedLayers.length;n++) {
        var ly=comp.selectedLayers[n];
        try {
            var fxParade = ly.property("ADBE Effect Parade");
            // Include layer even if 0 effects? Let's include all selected, user wants to see
            out.push(extractEffects(ly));
        } catch(e){}
    }
    if (out.length===0) alert("Select at least one layer.");
    else {
        var notes=[
            "NOTES - EFFECTS CLEAN VERSION:",
            "- Works on ANY layer: Text, Shape, Solid, Null, AV, Adjustment",
            "- Only dumps MODIFIED props inside each effect (Position, Color, Slider) to avoid bloat",
            "- Each effect shows matchName needed for recreation: addProperty(matchName)",
            "  Example:",
            "    var fx = layer.property('ADBE Effect Parade').addProperty('ADBE Ramp'); // Gradient Ramp",
            "    fx.name = 'Gradient Ramp';",
            "    fx.property('ADBE Ramp-0001').setValue([100,100]); // Start of Ramp",
            "    fx.property('ADBE Ramp-0002').setValue([1,0,0]); // Start Color",
            "- For Gradient Ramp fix for G-Fill/G-Stroke:",
            "  Use:",
            "    ADBE Ramp (Gradient Ramp): Start of Ramp [ADBE Ramp-0001], End [ADBE Ramp-0002], Start Color [ADBE Ramp-0002? check], etc",
            "    ADBE 4ColorGradient (4-Color Gradient):",
            "      Point1 [ADBE 4ColorGradient-0001], Color1 [ADBE 4ColorGradient-0002], etc",
            "- Keyframes are dumped as: key 1 @ 0.000s | value: ...",
            "- Expressions are dumped if enabled",
            "- To recreate solid Fill replacement + Ramp: add solid Fill, then add Ramp effect"
        ].join("\n");
        showOutput(out.join("\n\n") + "\n\n" + notes);
    }
}
