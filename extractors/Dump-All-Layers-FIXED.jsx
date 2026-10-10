// ---------- Full Comp Extractor - DEEP RECURSIVE MASTER + TRACK MATTE REAL TARGET ----------
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
function fmtShape(shape) {
    try { return "vertices:" + fmt(shape.vertices) + " | inTangents:" + fmt(shape.inTangents) + " | outTangents:" + fmt(shape.outTangents) + " | closed:" + shape.closed; }
    catch(e) { return "<shape unavailable>"; }
}
var BLEND_KEYS = ["NORMAL","DISSOLVE","DANCING_DISSOLVE","DARKEN","MULTIPLY","COLOR_BURN","CLASSIC_COLOR_BURN","LINEAR_BURN","DARKER_COLOR","ADD","LIGHTEN","SCREEN","COLOR_DODGE","CLASSIC_COLOR_DODGE","LINEAR_DODGE","LIGHTER_COLOR","OVERLAY","SOFT_LIGHT","HARD_LIGHT","LINEAR_LIGHT","VIVID_LIGHT","PIN_LIGHT","HARD_MIX","DIFFERENCE","CLASSIC_DIFFERENCE","EXCLUSION","SUBTRACT","DIVIDE","HUE","SATURATION","COLOR","LUMINOSITY","STENCIL_ALPHA","STENCIL_LUMA","SILHOUETE_ALPHA","SILHOUETE_LUMA","ALPHA_ADD"];
var TRACK_MATTE_KEYS = ["NO_TRACK_MATTE","ALPHA_MATTE","ALPHA_INVERTED_MATTE","LUMA_MATTE","LUMA_INVERTED_MATTE","ALPHA","ALPHA_INVERTED","LUMA","LUMA_INVERTED"];
var KERN_KEYS = ["NO_AUTO_KERN", "METRIC_KERN", "OPTICAL_KERN"];
var JUST_KEYS = ["LEFT_JUSTIFY", "CENTER_JUSTIFY", "RIGHT_JUSTIFY","FULL_JUSTIFY_LASTLINE_LEFT", "FULL_JUSTIFY_LASTLINE_CENTER","FULL_JUSTIFY_LASTLINE_RIGHT", "FULL_JUSTIFY_LASTLINE_FULL"];
var MENU_MAP = {
    "ADBE Text Anchor Point Option": {1: "Character",2: "Word",3: "Line",4: "All"},
    "ADBE Text Render Order": {1: "All Fills Over All Strokes",2: "All Strokes Over All Fills"},
    "ADBE Text Character Blend Mode": {1: "Normal"},
    "ADBE Text Range Units": {1: "Percentage",2: "Index"},
    "ADBE Text Range Type2": {1: "Characters",2: "Characters Excluding Spaces",3: "Words",4: "Lines"},
    "ADBE Text Selector Mode": {1: "Add",2: "Subtract",3: "Intersect",4: "Min",5: "Max",6: "Difference"},
    "ADBE Text Range Shape": {1: "Square",2: "Ramp Up",3: "Ramp Down",4: "Triangle",5: "Round",6: "Smooth"},
    "ADBE Text Track Type": {1: "Before & After",2: "Before",3: "After"},
    "ADBE Text Character Change Type": {1: "Character Value",2: "Character Value (No Value)"},
    "ADBE Text Character Range": {1: "Custom",2: "Letters",3: "Numbers",4: "Letters & Numbers"}
};
function getMenuLabel(matchName, value) {
    var map = MENU_MAP[matchName];
    if (map && map[value] !== undefined) return value + " (" + map[value] + ")";
    return String(value) + " (UNKNOWN - check UI)";
}
var MENU_PROPS = {
    "ADBE Text Range Units": 1,"ADBE Text Range Type2": 1,"ADBE Text Selector Mode": 1,"ADBE Text Range Shape": 1,
    "ADBE Text Anchor Point Option": 1,"ADBE Text Render Order": 1,"ADBE Text Character Blend Mode": 1,
    "ADBE Text Track Type": 1,"ADBE Text Character Change Type": 1,"ADBE Text Character Range": 1
};
function countProps(obj){ var c=0; for(var k in obj){ try{ if(obj.hasOwnProperty(k)) c++; else c++; }catch(e){ c++; } } return c; }
var gradientIssues = [];
var subcompList = [];
var visitedComps = {};
var compOrder = [];
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
function readKeyframes(prop) {
    var out=[]; var INTERP=["LINEAR","BEZIER","HOLD"];
    for (var k=1;k<=prop.numKeys;k++) {
        var inT=prop.keyInInterpolationType(k); var outT=prop.keyOutInterpolationType(k);
        var valStr=""; try { var v=prop.keyValue(k); if (v && v.vertices!==undefined) valStr=fmtShape(v); else valStr=fmt(v); } catch(e){ valStr="<unavailable>"; }
        var s="key "+k+" @ "+prop.keyTime(k).toFixed(3)+"s | value: "+valStr+" | in: "+enumName(inT,KeyframeInterpolationType,INTERP)+" | out: "+enumName(outT,KeyframeInterpolationType,INTERP);
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
function walkTransform(group, indent, layer, lines) {
    if (!group) return;
    for (var i=1;i<=group.numProperties;i++) {
        var p=group.property(i); if (!p) continue; if (p.name==="") continue;
        if (p.matchName==="ADBE Effect Parade") continue;
        if (p.matchName.indexOf("ADBE Position_")===0 && !layer.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated) continue;
        if (p.matchName==="ADBE Material Group" && !layer.threeDLayer) continue;
        if (p.propertyType===PropertyType.PROPERTY) {
            if (!isModifiedProp(p) && !isEssential(p.matchName)) continue;
            var head = indent + p.name + " ["+p.matchName+"]";
            try {
                var valStr="";
                if (p.value && p.value.vertices!==undefined) valStr=fmtShape(p.value);
                else if (p.value instanceof Array && p.matchName.indexOf("Color")!==-1) valStr=fmtColor(p.value);
                else valStr=fmt(p.value);
                head += ": "+valStr;
            } catch(e){ head += ": <unavailable>"; }
            if (p.numKeys>0) {
                head += " (animated, "+p.numKeys+" keys)\n"+indent+"  "+readKeyframes(p).split("\n").join("\n"+indent+"  ");
            }
            lines.push(head);
        } else {
            var isEssentialGroup = isEssential(p.matchName) || p.matchName.indexOf("ADBE Vector")===0 || p.matchName.indexOf("ADBE Root")===0 || p.matchName.indexOf("ADBE Vectors")===0;
            if (!isEssentialGroup && p.numProperties>0) {
                var hasMod=false;
                for (var ci=1; ci<=p.numProperties; ci++) { try { var cp=p.property(ci); if (isModifiedProp(cp) || isEssential(cp.matchName)) { hasMod=true; break; } } catch(e){} }
                if (!hasMod) continue;
            }
            var line=indent + p.name + " ["+p.matchName+"]";
            lines.push(line);
            walkTransform(p, indent+"  ", layer, lines);
        }
    }
}
function walkGroup(group, indent, layer, lines) {
    if (!group) return;
    for (var i=1;i<=group.numProperties;i++) {
        var p=group.property(i); if (!p) continue;
        if (p.propertyType===PropertyType.PROPERTY) {
            if (!isModifiedProp(p) && !isEssential(p.matchName)) continue;
            var line=indent + p.name + " [" + p.matchName + "]";
            try {
                if (p.matchName==="ADBE Vector Grad Colors") {
                    gradientIssues.push({layerName: layer.name, shapeGroupName: group.name, gradType: "Gradient", gradName: p.name});
                    line += ": <GRADIENT NOT SCRIPTABLE - USE RAMP EFFECT>";
                } else if (p.value && p.value.vertices!==undefined) {
                    line += ": " + fmtShape(p.value);
                } else if (p.value instanceof Array && p.matchName.indexOf("Color")!==-1) {
                    line += ": " + fmtColor(p.value);
                } else {
                    line += ": " + fmt(p.value);
                }
            } catch(e){ line += ": <unavailable>"; }
            if (p.numKeys>0) line += " (animated, "+p.numKeys+" keys)\n"+indent+"  "+readKeyframes(p).split("\n").join("\n"+indent+"  ");
            lines.push(line);
        } else {
            var isEssentialGroup = isEssential(p.matchName) || p.matchName.indexOf("ADBE Vector")===0 || p.matchName.indexOf("ADBE Root")===0 || p.matchName.indexOf("ADBE Vectors")===0;
            if (!isEssentialGroup && p.numProperties>0) {
                var hasMod=false;
                for (var ci=1; ci<=p.numProperties; ci++) { try { var cp=p.property(ci); if (isModifiedProp(cp) || isEssential(cp.matchName)) { hasMod=true; break; } } catch(e){} }
                if (!hasMod) continue;
            }
            lines.push(indent + p.name + " [" + p.matchName + "]");
            walkGroup(p, indent+"  ", layer, lines);
        }
    }
}
function extractLayer(layer) {
    var lines=[];
    var layerType="UNKNOWN";
    try {
        if (layer instanceof TextLayer) layerType="Text";
        else if (layer instanceof ShapeLayer) layerType="Shape";
        else if (layer instanceof CameraLayer) layerType="Camera";
        else if (layer instanceof LightLayer) layerType="Light";
        else if (layer instanceof AVLayer) {
            if (layer.source instanceof CompItem) layerType="Comp";
            else if (layer.adjustmentLayer) layerType="Adjustment";
            else if (layer.nullLayer) layerType="Null";
            else if (layer.source && layer.source.mainSource && layer.source.mainSource instanceof SolidSource) layerType="Solid";
            else layerType="AV";
        }
    } catch(e){}
    lines.push("LAYER "+layer.index+": "+layer.name+" ["+layerType+"]");
    lines.push("  label: "+layer.label+" | threeDLayer: "+layer.threeDLayer+" | locked: "+layer.locked+" | shy: "+layer.shy+" | solo: "+layer.solo+" | enabled: "+layer.enabled);
    try { lines.push("  blendingMode: "+enumName(layer.blendingMode, BlendingMode, BLEND_KEYS)+" ("+layer.blendingMode+")"); } catch(e){}
    try { 
        lines.push("  trackMatteType: "+enumName(layer.trackMatteType, TrackMatteType, TRACK_MATTE_KEYS)+" ("+layer.trackMatteType+")");
        // REAL TARGET EXTRACTION
        if (layer.trackMatteType!==TrackMatteType.NO_TRACK_MATTE) {
            try {
                var above = layer.containingComp.layer(layer.index-1);
                var srcName = "unknown";
                try { if (above.source) srcName = above.source.name; else srcName = above.matchName || above.name; } catch(e2){ srcName = above.name; }
                var blend = "unknown";
                try { blend = enumName(above.blendingMode, BlendingMode, BLEND_KEYS); } catch(e2){}
                lines.push("  TrackMatte REAL TARGET -> ABOVE layer "+above.index+": '"+above.name+"' source:'"+srcName+"' blend:"+blend+" enabled:"+above.enabled+" label:"+above.label);
                try {
                    var chain = [];
                    var cur = above;
                    while(cur && cur.trackMatteType!==TrackMatteType.NO_TRACK_MATTE){
                        var up = cur.containingComp.layer(cur.index-1);
                        chain.push(up.index+":'"+up.name+"'");
                        cur = up;
                        if(chain.length>10) break;
                    }
                    if(chain.length>0){
                        lines.push("  TrackMatte CHAIN up: "+chain.join(" -> "));
                    }
                } catch(eChain){}
            } catch(e){
                lines.push("  TrackMatte REAL TARGET -> ABOVE layer "+(layer.index-1)+" (unable to resolve - "+e.toString()+")");
            }
        }
    } catch(e){}
    try { if (layer.parent) lines.push("  parent: "+layer.parent.index+" '"+layer.parent.name+"'"); else lines.push("  parent: none"); } catch(e){}
    try { lines.push("  Time: startTime "+layer.startTime.toFixed(3)+"s | inPoint "+layer.inPoint.toFixed(3)+"s | outPoint "+layer.outPoint.toFixed(3)+"s | stretch "+layer.stretch.toFixed(3)+" | offset "+layer.offset.toFixed(3)); } catch(e){ try{ lines.push("  Time: startTime "+fmt(layer.startTime)+" | inPoint "+fmt(layer.inPoint)+" | outPoint "+fmt(layer.outPoint)+" | stretch "+fmt(layer.stretch)); }catch(e2){} }
    if (layerType==="Comp") {
        try {
            var src=layer.source;
            lines.push("  Source Comp: '"+src.name+"' ["+src.width+"x"+src.height+"] duration "+src.duration.toFixed(3)+"s | id: "+src.id+" | frameRate: "+src.frameRate);
            lines.push("  PLACEHOLDER INSTRUCTION: For recreation, use null placeholder named '"+src.name+"' -> see NOTES, BUT full dump of this subcomp is included below in DEEP DUMP");
            lines.push("  collapseTransformation: "+layer.collapseTransformation+" | frameBlending: "+layer.frameBlending+" | motionBlur: "+layer.motionBlur);
            lines.push("  adjustmentLayer: "+layer.adjustmentLayer+" | guideLayer: "+layer.guideLayer);
            subcompList.push({layerIndex: layer.index, layerName: layer.name, compName: src.name, compId: src.id, width: src.width, height: src.height, duration: src.duration, frameRate: src.frameRate, srcComp: src});
        } catch(e){ lines.push("  Source Comp: <error "+e.toString()+">"); }
    } else if (layerType==="Solid") {
        try { var s=layer.source; lines.push("  Solid: '"+s.name+"' ["+s.width+"x"+s.height+"] color "+fmt(s.mainSource.color)); } catch(e){}
    }
    try { if (layer.property("ADBE Time Remapping") && layer.property("ADBE Time Remapping").enabled) lines.push("  Time Remapping [ADBE Time Remapping]: enabled true"); } catch(e){}
    var xform=layer.property("ADBE Transform Group");
    if (xform) {
        walkTransform(xform, "", layer, lines);
    }
    // Text
    if (layerType==="Text") {
        try {
            var tdProp=layer.property("ADBE Text Properties").property("ADBE Text Document");
            var td=tdProp.value;
            lines.push("  Source Text [ADBE Text Document]:");
            lines.push("    text: "+td.text.replace(/\r/g, "\\r").replace(/\n/g, "\\n"));
            try { lines.push("    font: "+td.font); } catch(e){}
            lines.push("    fontSize: "+td.fontSize);
            lines.push("    autoLeading: "+td.autoLeading);
            lines.push("    leading: "+td.leading);
            try { lines.push("    autoKernType: "+enumName(td.autoKernType, AutoKernType, KERN_KEYS)); } catch(e){}
            lines.push("    tracking: "+td.tracking);
            lines.push("    horizontalScale: "+td.horizontalScale);
            lines.push("    verticalScale: "+td.verticalScale);
            lines.push("    baselineShift: "+td.baselineShift);
            lines.push("    applyFill: "+td.applyFill);
            try { lines.push("    fillColor: "+fmt(td.fillColor)); } catch(e){}
            lines.push("    applyStroke: "+td.applyStroke);
            try { lines.push("    strokeColor: "+fmt(td.strokeColor)); } catch(e){ lines.push("    strokeColor: <unavailable>"); }
            lines.push("    strokeWidth: "+td.strokeWidth);
            lines.push("    strokeOverFill: "+td.strokeOverFill);
            try { lines.push("    justification: "+enumName(td.justification, ParagraphJustification, JUST_KEYS)); } catch(e){}
            lines.push("    fauxBold: "+td.fauxBold);
            lines.push("    fauxItalic: "+td.fauxItalic);
            lines.push("    allCaps: "+td.allCaps);
            lines.push("    smallCaps: "+td.smallCaps);
        } catch(e){ lines.push("  Text Document: <error "+e.toString()+">"); }
        try {
            var pathOpt=layer.property("ADBE Text Properties").property("ADBE Text Path Options");
            if (pathOpt) { lines.push("  Path Options [ADBE Text Path Options]"); walkTransform(pathOpt, "    ", layer, lines); }
        } catch(e){}
        try {
            var moreOpt=layer.property("ADBE Text Properties").property("ADBE Text More Options");
            if (moreOpt) { lines.push("  More Options [ADBE Text More Options]"); walkTransform(moreOpt, "    ", layer, lines); }
        } catch(e){}
        try {
            var animators=layer.property("ADBE Text Properties").property("ADBE Text Animators");
            if (animators && animators.numProperties>0) {
                lines.push("  Animators [ADBE Text Animators]");
                walkTransform(animators, "    ", layer, lines);
            }
        } catch(e){}
    } else if (layerType==="Shape") {
        lines.push("Shape [ADBE Root Vectors Group]");
        try {
            var root=layer.property("ADBE Root Vectors Group");
            walkGroup(root, "  ", layer, lines);
        } catch(e){ lines.push("  Shape: <error "+e.toString()+">"); }
    }
    try {
        var masks=layer.property("ADBE Mask Parade");
        if (masks && masks.numProperties>0) {
            lines.push("Masks: "+masks.numProperties+" masks");
            for (var mi=1; mi<=masks.numProperties; mi++) {
                var m=masks.property(mi);
                lines.push("  Mask "+mi+": "+m.name+" ["+m.matchName+"]");
                walkTransform(m, "    ", layer, lines);
            }
        } else { lines.push("Masks: none"); }
    } catch(e){ lines.push("Masks: <error>"); }
    try {
        var effParade=layer.property("ADBE Effect Parade");
        if (effParade && effParade.numProperties>0) {
            lines.push("Effects [ADBE Effect Parade]: "+effParade.numProperties+" effects");
            for (var ei=1; ei<=effParade.numProperties; ei++) {
                var eff=effParade.property(ei);
                lines.push("  Effect "+ei+": "+eff.name+" ["+eff.matchName+"] enabled: "+eff.enabled+"  // addProperty('"+eff.matchName+"')");
                for (var ej=1; ej<=eff.numProperties; ej++) {
                    var ep=eff.property(ej);
                    if (!isModifiedProp(ep)) continue;
                    var epLine = "    "+ep.name+" ["+ep.matchName+"]: "+fmt(ep.value);
                    if (ep.numKeys>0) {
                        epLine += " (animated, "+ep.numKeys+" keys)\n      " + readKeyframes(ep).split("\n").join("\n      ");
                    }
                    lines.push(epLine);
                }
            }
        } else { lines.push("Effects: none"); }
    } catch(e){ lines.push("Effects: <error>"); }
    return lines.join("\n");
}
function dumpCompRecursive(comp, depth, parentInfo) {
    if (visitedComps[comp.id]) {
        return "=== SKIP DUPLICATE COMP id:"+comp.id+" '"+comp.name+"' already dumped (depth "+depth+") | parent: "+parentInfo+" ===\n";
    }
    visitedComps[comp.id] = true;
    compOrder.push({comp: comp, depth: depth, parentInfo: parentInfo});
    var outLines=[];
    outLines.push("");
    outLines.push("################################################################################");
    if (depth===0) {
        outLines.push("=== MAIN COMP DEPTH 0: "+comp.name+" ["+comp.width+"x"+comp.height+"] duration "+comp.duration.toFixed(3)+"s frameRate "+comp.frameRate+" | id: "+comp.id+" | numLayers: "+comp.numLayers+" | bgColor: "+fmt(comp.bgColor)+" ===");
    } else {
        outLines.push("=== SUBCOMP DEPTH "+depth+": "+comp.name+" ["+comp.width+"x"+comp.height+"] duration "+comp.duration.toFixed(3)+"s frameRate "+comp.frameRate+" | id: "+comp.id+" | numLayers: "+comp.numLayers+" | bgColor: "+fmt(comp.bgColor)+" | PARENT: "+parentInfo+" ===");
    }
    outLines.push("  workAreaStart: "+comp.workAreaStart.toFixed(3)+" | workAreaDuration: "+comp.workAreaDuration.toFixed(3)+" | displayStartTime: "+comp.displayStartTime.toFixed(3));
    outLines.push("  RECREATE AS NEW COMP - JS CODE:");
    outLines.push("    var newComp = app.project.items.addComp(\"" + comp.name.replace(/"/g, '\\"') + "\", " + comp.width + ", " + comp.height + ", 1, " + comp.duration.toFixed(3) + ", " + comp.frameRate + ");");
    outLines.push("    newComp.bgColor = [" + fmt(comp.bgColor) + "];");
    outLines.push("    try { newComp.workAreaStart = " + comp.workAreaStart.toFixed(3) + "; } catch(e) {}");
    outLines.push("    try { newComp.workAreaDuration = " + comp.workAreaDuration.toFixed(3) + " - 0.001; } catch(e) {}");
    outLines.push("    // Then add layers to newComp (bottom to top)");
    outLines.push("");
    var layersToDump=[];
    for (var i=1;i<=comp.numLayers;i++) layersToDump.push(comp.layer(i));
    var matteUsage = {};
    var matteRelations = [];
    for (var li=0; li<layersToDump.length; li++) {
        try { 
            var lyr = layersToDump[li];
            outLines.push(extractLayer(lyr)); 
            try{
                if(lyr.trackMatteType!==TrackMatteType.NO_TRACK_MATTE){
                    var aboveIdx = lyr.index-1;
                    var aboveLyr = comp.layer(aboveIdx);
                    var key = aboveIdx+":'"+aboveLyr.name+"'";
                    if(!matteUsage[key]) matteUsage[key]={count:0, matted:[], matteIdx:aboveIdx, matteName:aboveLyr.name, matteSource: (aboveLyr.source?aboveLyr.source.name:"")};
                    matteUsage[key].count++;
                    matteUsage[key].matted.push(lyr.index+":'"+lyr.name+"'");
                    matteRelations.push({mattedIdx:lyr.index, mattedName:lyr.name, matteIdx:aboveIdx, matteName:aboveLyr.name, matteSource: (aboveLyr.source?aboveLyr.source.name:"")});
                }
            }catch(eMatte){}
        } catch(e){ outLines.push("LAYER "+layersToDump[li].index+": <error "+e.toString()+">"); }
        outLines.push("");
    }
    try{
        outLines.push("=== TRACK MATTE ANALYSIS for '"+comp.name+"' ===");
        if(matteRelations.length===0){
            outLines.push("  No track mattes in this comp");
        } else {
            for(var mr=0; mr<matteRelations.length; mr++){
                var r=matteRelations[mr];
                outLines.push("  Layer "+r.mattedIdx+" '"+r.mattedName+"' is MATTED by layer "+r.matteIdx+" '"+r.matteName+"' source:'"+r.matteSource+"'");
            }
            outLines.push("");
            outLines.push("  Matte usage counts:");
            for(var k in matteUsage){
                var u=matteUsage[k];
                outLines.push("    Matte "+k+" source:'"+u.matteSource+"' used by "+u.count+" layer(s): "+u.matted.join(", "));
            }
            try{
                var bottom = comp.layer(comp.numLayers);
                var isPC2Bottom = bottom && bottom.source && bottom.source.name && bottom.source.name.indexOf("Pre-comp 2")!==-1;
                var solidNames=[];
                for(var i=1;i<comp.numLayers;i++){
                    var l=comp.layer(i);
                    if(l.source && l.source.mainSource && l.source.mainSource instanceof SolidSource){
                        solidNames.push(l.name);
                    }
                }
                if(isPC2Bottom && solidNames.length>=4){
                    outLines.push("");
                    outLines.push("  >>> SHARED MATTE CANDIDATE DETECTED <<<");
                    outLines.push("  Bottom layer "+comp.numLayers+" is '"+bottom.name+"' (Pre-comp 2) - likely intended matte for all solids: "+solidNames.join(", "));
                    outLines.push("  Current dump shows chain but user says all A-E matted by Pre-comp 2");
                    outLines.push("  WORKAROUND: Duplicate Pre-comp 2 as matte for each solid + keep 1 visible copy at bottom");
                    outLines.push("  RECREATOR PROMPT: Create 11 layers: 5 matte copies of Pre-comp 2 + 5 solids ALPHA + 1 visible Pre-comp 2 bottom");
                    outLines.push("  ALTERNATIVE: Use Set Matte effect on each solid pointing to Pre-comp 2 visible layer to keep all visible");
                }
            }catch(eDetect){}
        }
        outLines.push("=== END TRACK MATTE ANALYSIS ===");
        outLines.push("");
    }catch(eAnalysis){
        outLines.push("=== TRACK MATTE ANALYSIS FAILED: "+eAnalysis.toString()+" ===");
    }
    var fullText = outLines.join("\n");
    var subTexts=[];
    for (var s=0; s<subcompList.length; s++) {
        var sc = subcompList[s];
        var belongs=false;
        try {
            for (var ci=1; ci<=comp.numLayers; ci++) {
                var l=comp.layer(ci);
                if (l.index===sc.layerIndex && l.name===sc.layerName) { belongs=true; break; }
            }
        } catch(e){ belongs=true; }
        if (!belongs) continue;
        if (visitedComps[sc.compId]) continue;
        var subCompItem = sc.srcComp;
        if (!subCompItem) {
            try { subCompItem = app.project.itemByID(sc.compId); } catch(e){}
        }
        if (subCompItem && subCompItem instanceof CompItem) {
            var parentLabel = comp.name+" layer "+sc.layerIndex+" '"+sc.layerName+"'";
            var subDump = dumpCompRecursive(subCompItem, depth+1, parentLabel);
            subTexts.push(subDump);
        }
    }
    if (subTexts.length>0) {
        fullText += "\n" + subTexts.join("\n");
    }
    return fullText;
}
function main() {
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) { alert("Select a comp first!"); return; }
    gradientIssues=[]; subcompList=[]; visitedComps={}; compOrder=[];
    var deepText = dumpCompRecursive(comp, 0, "ROOT");
    var header="=== DEEP EXTRACTOR - TRUE RECURSIVE ===\n";
    header+="Main comp: "+comp.name+" id:"+comp.id+" ["+comp.width+"x"+comp.height+"] duration "+comp.duration.toFixed(3)+"s\n";
    header+="Total unique comps found: "+countProps(visitedComps)+"\n";
    header+="Recreation order (deepest first):\n";
    var sorted = compOrder.slice().sort(function(a,b){ return b.depth - a.depth; });
    for (var i=0;i<sorted.length;i++) {
        var co=sorted[i];
        header+="- Depth "+co.depth+": '"+co.comp.name+"' id:"+co.comp.id+" ["+co.comp.width+"x"+co.comp.height+"] parent: "+co.parentInfo+"\n";
    }
    header+="\n=== HOW TO RECREATE (DEEP) ===\n";
    header+="1) Recreate comps from deepest depth to 0\n";
    header+="2) For [Comp] layers, use parentComp.layers.add(childComp)\n";
    header+="=== END HEADER ===\n\n";
    var warningHeader="";
    if (gradientIssues.length>0) {
        warningHeader = "=== GRADIENT WARNING ===\nFound "+gradientIssues.length+" gradient(s) NOT scriptable:\n";
        for (var gi=0; gi<gradientIssues.length; gi++) {
            var it=gradientIssues[gi];
            warningHeader += "- Layer ["+it.layerName+"] > Shape ["+it.shapeGroupName+"] has "+it.gradType+" ["+it.gradName+"]\n";
        }
        warningHeader+="=== END GRADIENT WARNING ===\n\n";
    }
    var notes=[
        "NOTES - DEEP COMP CLEAN VERSION + TRACK MATTE REAL TARGET:",
        "- This file contains MAIN comp + ALL nested subcomps recursively",
        "- Each layer now has TrackMatte REAL TARGET -> ABOVE layer X",
        "- Plus TRACK MATTE ANALYSIS footer per comp with shared matte detection",
        "- For shared matte like Pre-comp 2 for all solids, use duplication workaround"
    ].join("\n");
    var finalText = header + warningHeader + deepText + "\n\n" + notes;
    try {
        var cleanName = comp.name.replace(/[\\\/:\*\?]/g, "_").replace(/"/g, "_").replace(/</g, "_").replace(/>/g, "_").replace(/\|/g, "_");
        if (cleanName==="") cleanName="Comp";
        var defaultFile = new File(Folder.desktop.fsName + "/" + cleanName + "_DEEP.txt");
        var file=null;
        try { file = defaultFile.saveDlg("Save DEEP Comp Dump as .txt", "Text Files:*.txt;All Files:*.*"); } catch(eDlg) { file = File.saveDialog("Save DEEP Comp Dump", "Text Files:*.txt;All Files:*.*"); }
        if (file) {
            file.encoding="UTF-8"; file.open("w"); file.write(finalText); file.close();
            alert("Saved DEEP dump to:\n"+file.fsName+"\n\nTotal comps: "+countProps(visitedComps)+"\nWith TRACK MATTE REAL TARGET extraction");
            var w=new Window("dialog", "DEEP Comp Dump - Saved + Preview", undefined, {resizeable: true});
            var et=w.add("edittext", undefined, finalText, {multiline: true, scrolling: true});
            et.preferredSize=[1000,700];
            var g=w.add("group"); g.add("button", undefined, "Select All").onClick=function(){ et.active=false; et.active=true; };
            g.add("button", undefined, "Close").onClick=function(){ w.close(); };
            w.show();
        } else {
            var w2=new Window("dialog", "DEEP Comp Dump - Preview (not saved)", undefined, {resizeable: true});
            var et2=w2.add("edittext", undefined, finalText, {multiline: true, scrolling: true});
            et2.preferredSize=[1000,700];
            var g2=w2.add("group"); g2.add("button", undefined, "Select All").onClick=function(){ et2.active=false; et2.active=true; };
            g2.add("button", undefined, "Close").onClick=function(){ w2.close(); };
            w2.show();
        }
    } catch(e) {
        alert("Save failed: "+e.toString());
        var w3=new Window("dialog", "DEEP Comp Dump - Error", undefined, {resizeable: true});
        var et3=w3.add("edittext", undefined, finalText, {multiline: true, scrolling: true});
        et3.preferredSize=[1000,700];
        w3.show();
    }
}
main();
