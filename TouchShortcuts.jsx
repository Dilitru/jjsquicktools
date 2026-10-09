/*
    TouchShortcuts.jsx v8.9 - Fixed Prev/Next Keyframe logic + restored full build
*/

(function(thisObj){
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "", undefined, {resizeable:true});
    win.text = ""; win.preferredSize.width = 200; win.preferredSize.height = 300; win.minimumSize.width = 200; win.minimumSize.height = 200; win.maximumSize.width = 200;
    win.orientation = "column"; win.alignChildren = ["fill","top"]; win.spacing = 2; win.margins = 4;
    win.onResizing = win.onResize = function(){ try{ this.layout.resize(); }catch(e){} };

    var topRow = win.add("group");
    topRow.orientation = "row"; topRow.alignChildren = ["fill","center"]; topRow.alignment = ["fill","top"]; topRow.spacing = 2; topRow.preferredSize.height = 36;
    var tabDropdown = topRow.add("dropdownlist", undefined, ["LAYER TOOLS", "PROPERTIES", "KEYFRAMING", "TRANSFORM", "EDIT"]);
    tabDropdown.selection = 0; tabDropdown.alignment = ["fill","center"]; tabDropdown.preferredSize.width = 90; tabDropdown.preferredSize.height = 36;
    var btnFlow = topRow.add("button", undefined, "\u21B9");
    btnFlow.preferredSize.width = 32; btnFlow.preferredSize.height = 36; btnFlow.minimumSize.width = 32; btnFlow.minimumSize.height = 36; btnFlow.maximumSize.width = 32; btnFlow.maximumSize.height = 36; btnFlow.alignment = ["right","center"]; btnFlow.helpTip = "Composition Mini-Flowchart (Tab)";
    try{ var ff = btnFlow.graphics.font; btnFlow.graphics.font = ScriptUI.newFont(ff.family, ScriptUI.FontStyle.REGULAR, 18); }catch(e){}
    var btnUndo = topRow.add("button", undefined, "\u21A9");
    btnUndo.preferredSize.width = 32; btnUndo.preferredSize.height = 36; btnUndo.minimumSize.width = 32; btnUndo.minimumSize.height = 36; btnUndo.maximumSize.width = 32; btnUndo.maximumSize.height = 36; btnUndo.alignment = ["right","center"]; btnUndo.helpTip = "Undo";
    try{ var fu = btnUndo.graphics.font; btnUndo.graphics.font = ScriptUI.newFont(fu.family, ScriptUI.FontStyle.REGULAR, 18); }catch(e){}
    btnUndo.onClick = function(){ try{ app.executeCommand(16); }catch(e){ try{ var id=app.findMenuCommandId("Undo"); if(id) app.executeCommand(id); }catch(e2){} } };
    var btnDelete = topRow.add("button", undefined, "\uD83D\uDDD1\uFE0F");
    try{ btnDelete.text = "\uD83D\uDDD1\uFE0F"; }catch(e){ btnDelete.text = "DEL"; }
    btnDelete.preferredSize.width = 32; btnDelete.preferredSize.height = 36; btnDelete.minimumSize.width = 32; btnDelete.minimumSize.height = 36; btnDelete.maximumSize.width = 32; btnDelete.maximumSize.height = 36; btnDelete.alignment = ["right","center"]; btnDelete.helpTip = "Clear (Edit -> Clear)";
    try{ var fd = btnDelete.graphics.font; btnDelete.graphics.font = ScriptUI.newFont(fd.family, ScriptUI.FontStyle.REGULAR, 16); }catch(e){}

    var errorGroup = win.add("group"); errorGroup.orientation = "row"; errorGroup.alignChildren = ["fill","center"]; errorGroup.alignment = ["fill","top"]; errorGroup.spacing = 2; errorGroup.margins = 2; errorGroup.preferredSize.height = 26; errorGroup.minimumSize.height = 26; errorGroup.maximumSize.height = 26;
    try{ errorGroup.graphics.backgroundColor = errorGroup.graphics.newBrush(errorGroup.graphics.BrushType.SOLID_COLOR, [0.18,0.18,0.18,1]); }catch(e){}
    var errorText = errorGroup.add("statictext", undefined, "", {multiline: true}); errorText.alignment = ["fill","center"]; errorText.preferredSize.height = 20; errorText.maximumSize.height = 20; errorText.minimumSize.height = 20; errorText.justify = "center";
    try{ errorText.graphics.font = ScriptUI.newFont(errorText.graphics.font.family, ScriptUI.FontStyle.BOLD, 11); }catch(e){}
    var _errorClearTask = null;
    function setError(msg){ try{ if(!msg || msg===""){ clearError(); return; } errorText.text = "\u26A0\uFE0F " + msg; try{ errorGroup.graphics.backgroundColor = errorGroup.graphics.newBrush(errorGroup.graphics.BrushType.SOLID_COLOR, [0.85,0.18,0.18,1]); }catch(e){} try{ errorText.graphics.foregroundColor = errorText.graphics.newPen(errorText.graphics.PenType.SOLID_COLOR, [1,1,1],1); }catch(e){} try{ errorText.graphics.font = ScriptUI.newFont(errorText.graphics.font.family, ScriptUI.FontStyle.BOLD, 11); }catch(e){} try{ win.layout.layout(true); }catch(e){} try{ $.global._ts_errorText = errorText; $.global._ts_errorGroup = errorGroup; $.global._ts_win = win; $.global._ts_clearError = function(){ try{ $.global._ts_errorText.text = ""; try{ $.global._ts_errorGroup.graphics.backgroundColor = $.global._ts_errorGroup.graphics.newBrush($.global._ts_errorGroup.graphics.BrushType.SOLID_COLOR, [0.18,0.18,0.18,0.15]); }catch(e){} try{ $.global._ts_errorText.graphics.foregroundColor = $.global._ts_errorText.graphics.newPen($.global._ts_errorText.graphics.PenType.SOLID_COLOR, [0.6,0.6,0.6],1); }catch(e){} try{ $.global._ts_win.layout.layout(true); }catch(e){} }catch(e){} }; try{ if(_errorClearTask) app.cancelTask(_errorClearTask); }catch(e){} _errorClearTask = app.scheduleTask("$.global._ts_clearError()", 5000, false); }catch(e){} }catch(e){ try{ errorText.text = msg; }catch(e2){} } }
    function setSuccess(msg){ try{ if(!msg || msg===""){ clearError(); return; } errorText.text = "\u2705 " + msg; try{ errorGroup.graphics.backgroundColor = errorGroup.graphics.newBrush(errorGroup.graphics.BrushType.SOLID_COLOR, [0.15,0.6,0.25,1]); }catch(e){} try{ errorText.graphics.foregroundColor = errorText.graphics.newPen(errorText.graphics.PenType.SOLID_COLOR, [1,1,1],1); }catch(e){} try{ errorText.graphics.font = ScriptUI.newFont(errorText.graphics.font.family, ScriptUI.FontStyle.BOLD, 11); }catch(e){} try{ win.layout.layout(true); }catch(e){} try{ $.global._ts_errorText = errorText; $.global._ts_errorGroup = errorGroup; $.global._ts_win = win; $.global._ts_clearError = function(){ try{ $.global._ts_errorText.text = ""; try{ $.global._ts_errorGroup.graphics.backgroundColor = $.global._ts_errorGroup.graphics.newBrush($.global._ts_errorGroup.graphics.BrushType.SOLID_COLOR, [0.18,0.18,0.18,0.15]); }catch(e){} try{ $.global._ts_errorText.graphics.foregroundColor = $.global._ts_errorText.graphics.newPen($.global._ts_errorText.graphics.PenType.SOLID_COLOR, [0.6,0.6,0.6],1); }catch(e){} try{ $.global._ts_win.layout.layout(true); }catch(e){} }catch(e){} }; try{ if(_errorClearTask) app.cancelTask(_errorClearTask); }catch(e){} _errorClearTask = app.scheduleTask("$.global._ts_clearError()", 5000, false); }catch(e){} }catch(e){ try{ errorText.text = msg; }catch(e2){} } }
    function clearError(){ try{ try{ if(_errorClearTask) app.cancelTask(_errorClearTask); }catch(e){} _errorClearTask = null; errorText.text = ""; try{ errorGroup.graphics.backgroundColor = errorGroup.graphics.newBrush(errorGroup.graphics.BrushType.SOLID_COLOR, [0.18,0.18,0.18,0.15]); }catch(e){} try{ errorText.graphics.foregroundColor = errorText.graphics.newPen(errorText.graphics.PenType.SOLID_COLOR, [0.6,0.6,0.6],1); }catch(e){} try{ win.layout.layout(true); }catch(e){} }catch(e){ try{ errorText.text = ""; }catch(e2){} } }
    try{ clearError(); }catch(e){}

    var gridContainer = win.add("group"); gridContainer.orientation = "column"; gridContainer.alignChildren = ["fill","top"]; gridContainer.alignment = ["fill","top"]; gridContainer.spacing = 2; gridContainer.preferredSize.height = 180; gridContainer.minimumSize.height = 100;
    function clearGrid(){ while(gridContainer.children.length > 0) gridContainer.remove(gridContainer.children[0]); }
    var BTN_SIZE = 43; var EMOJI_SIZE = 22;
    function setBigFont(btn, sz){ try{ var f = btn.graphics.font; btn.graphics.font = ScriptUI.newFont(f.family, ScriptUI.FontStyle.REGULAR, sz); }catch(e){ try{ btn.graphics.font = ScriptUI.newFont("Arial", ScriptUI.FontStyle.REGULAR, sz); }catch(e2){ try{ btn.graphics.font = ScriptUI.newFont("Segoe UI Emoji", ScriptUI.FontStyle.REGULAR, sz); }catch(e3){} } } }
    function makeSquareBtn(parent, label, tooltip, onClickFunc){ if(!label||label===""){ var s=parent.add("group"); s.preferredSize.width=BTN_SIZE; s.preferredSize.height=BTN_SIZE; s.minimumSize.width=BTN_SIZE; s.minimumSize.height=BTN_SIZE; return null; } var b=parent.add("button", undefined, label); b.preferredSize.width=BTN_SIZE; b.preferredSize.height=BTN_SIZE; b.minimumSize.width=BTN_SIZE; b.minimumSize.height=BTN_SIZE; b.maximumSize.width=BTN_SIZE; b.maximumSize.height=BTN_SIZE; b.alignment=["center","top"]; if(tooltip) b.helpTip=tooltip; b.onClick=onClickFunc||function(){}; try{ setBigFont(b, EMOJI_SIZE); }catch(e){} return b; }
    function addRow(items){ var row=gridContainer.add("group"); row.orientation="row"; row.alignChildren=["fill","top"]; row.alignment=["fill","top"]; row.spacing=2; row.preferredSize.height=BTN_SIZE; row.minimumSize.height=BTN_SIZE; for(var i=0;i<items.length;i++){ var it=items[i]; if(!it||!it.label||it.label===""){ var g=row.add("group"); g.preferredSize.width=BTN_SIZE; g.preferredSize.height=BTN_SIZE; g.minimumSize.width=BTN_SIZE; g.minimumSize.height=BTN_SIZE; continue; } makeSquareBtn(row, it.label, it.tooltip, it.onClick); } }
    function getActiveComp(){ var comp=app.project.activeItem; if(comp && comp instanceof CompItem) return comp; setError("No active comp"); return null; }
    function runMenu(name){ try{ var id = app.findMenuCommandId(name); if(id && id!==0){ app.executeCommand(id); return true; } }catch(e){} return false; }
    function doDelete(){ app.beginUndoGroup("Touch: Clear"); clearError(); var names=["Clear","Delete"]; var ok=false; for(var i=0;i<names.length;i++){ if(runMenu(names[i])){ ok=true; break; } } if(!ok){ try{ app.executeCommand(1998); ok=true; }catch(e){} if(!ok){ try{ app.executeCommand(103); ok=true; }catch(e){} } } if(!ok) setError("Clear not found"); app.endUndoGroup(); }
    btnDelete.onClick=doDelete;
    function showMiniFlowchart(){ app.beginUndoGroup("Touch: Mini-Flowchart"); clearError(); var names=["Composition Mini-Flowchart","Composition Mini Flowchart","Mini-Flowchart","Show Mini-Flowchart","Composition Flowchart"]; var ok=false; for(var i=0;i<names.length;i++){ if(runMenu(names[i])){ ok=true; break; } } if(!ok){ try{ var id=app.findMenuCommandId("Tab"); if(id) app.executeCommand(id); else setError("Mini-Flowchart not found"); }catch(e){ setError("Mini-Flowchart not found"); } } app.endUndoGroup(); }
    btnFlow.onClick=showMiniFlowchart;

    function moveInPointToCTI(){ app.beginUndoGroup("Touch: Move In to CTI"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } for(var i=0;i<comp.selectedLayers.length;i++){ var layer=comp.selectedLayers[i]; try{ var diff=comp.time - layer.inPoint; layer.startTime += diff; }catch(e){} } app.endUndoGroup(); }
    function moveOutPointToCTI(){ app.beginUndoGroup("Touch: Move Out to CTI"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } for(var i=0;i<comp.selectedLayers.length;i++){ var layer=comp.selectedLayers[i]; try{ var diff=comp.time - layer.outPoint; layer.startTime += diff; }catch(e){} } app.endUndoGroup(); }
function getExtendLimits(layer){ if(!(layer instanceof AVLayer) || !(layer.source instanceof CompItem)) return null; if(layer.timeRemapEnabled || layer.stretch <= 0) return null; var start = layer.startTime; return { minIn: start, maxOut: start + layer.source.duration * layer.stretch / 100 }; }
function cutInPointToCTI(){ app.beginUndoGroup("Touch: Trim In to CTI"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } var t = comp.time; var fd = comp.frameDuration; var eps = fd / 100; for(var i=0;i<comp.selectedLayers.length;i++){ var layer=comp.selectedLayers[i]; try{ if(layer.inPoint >= layer.outPoint){ setError("Layer in/out inverted"); continue; } if(t >= layer.outPoint - eps){ setError("CTI past layer end"); continue; } var oldOut = layer.outPoint; var newIn = t; if(t < layer.inPoint - eps){ var lim = getExtendLimits(layer); if(!lim){ setError("Only comps extend"); continue; } newIn = Math.max(t, lim.minIn); if(newIn >= layer.inPoint - eps){ setError("Comp can't extend"); continue; } } layer.inPoint = newIn; if(Math.abs(layer.outPoint - oldOut) > fd/2) layer.outPoint = oldOut; }catch(e){ setError("Trim In err: " + e.toString()); } } app.endUndoGroup(); }
function cutOutPointToCTI(){ app.beginUndoGroup("Touch: Trim Out to CTI"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } var t = comp.time; var fd = comp.frameDuration; var eps = fd / 100; for(var i=0;i<comp.selectedLayers.length;i++){ var layer=comp.selectedLayers[i]; try{ if(layer.inPoint >= layer.outPoint){ setError("Layer in/out inverted"); continue; } if(t <= layer.inPoint + eps){ setError("CTI before layer start"); continue; } var oldIn = layer.inPoint; var newOut = t; if(t > layer.outPoint + eps){ var lim = getExtendLimits(layer); if(!lim){ setError("Only comps extend"); continue; } newOut = Math.min(t, lim.maxOut); if(newOut <= layer.outPoint + eps){ setError("Comp can't extend"); continue; } } layer.outPoint = newOut; if(Math.abs(layer.inPoint - oldIn) > fd/2) layer.inPoint = oldIn; }catch(e){ setError("Trim Out err: " + e.toString()); } } app.endUndoGroup(); }
    function duplicateLayers(){ app.beginUndoGroup("Touch: Duplicate"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } try{ var id = app.findMenuCommandId("Duplicate"); if(id) app.executeCommand(id); else setError("Duplicate not found"); }catch(e){ setError("Duplicate err: "+e.toString()); } app.endUndoGroup(); }
    function splitLayers(){ app.beginUndoGroup("Touch: Split"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } try{ var id = app.findMenuCommandId("Split Layer"); if(!id) id = app.findMenuCommandId("Split"); if(id) app.executeCommand(id); else { var t=comp.time; for(var i=0;i<comp.selectedLayers.length;i++){ var layer=comp.selectedLayers[i]; try{ if(t>layer.inPoint && t<layer.outPoint) layer.duplicate().inPoint=t; }catch(e){} } } }catch(e){ setError("Split err: "+e.toString()); } app.endUndoGroup(); }
function trueLayerDuplicatorClone() {
    app.beginUndoGroup("True Layer Duplicator Clone");
    var activeComp = app.project.activeItem;
    if (!(activeComp && activeComp instanceof CompItem)) { alert("Please select a comp."); app.endUndoGroup(); return; }
    var compMap = {};
    function getNewName(oldName) { var match = oldName.match(/(.*?)(\d+)$/); if (match) { var base = match[1]; var num = parseInt(match[2], 10); return base + (num + 1); } else { return oldName + " 2"; } }
    function duplicateRecursive(comp, isTopLevel) {
        if (compMap[comp.id]) { return compMap[comp.id]; }
        if (!isTopLevel && comp.name.toLowerCase().indexOf("dontduplicate") !== -1) { compMap[comp.id] = comp; return comp; }
        var dupComp = comp.duplicate(); dupComp.name = getNewName(comp.name); compMap[comp.id] = dupComp;
        for (var i = 1; i <= dupComp.numLayers; i++) { var lyr = dupComp.layer(i); if (lyr.source && lyr.source instanceof CompItem) { var dupSub = duplicateRecursive(lyr.source, false); lyr.replaceSource(dupSub, false); } }
        return dupComp;
    }
    var selLayers = activeComp.selectedLayers;
    if (selLayers.length < 1) { alert("Please select at least one comp layer."); app.endUndoGroup(); return; }
    for (var i = 0; i < selLayers.length; i++) {
        var targetLayer = selLayers[i]; if (!(targetLayer.source && targetLayer.source instanceof CompItem)) continue;
        var dupSubComp = duplicateRecursive(targetLayer.source, true);
        var dupLayer = activeComp.layers.add(dupSubComp); dupLayer.moveBefore(targetLayer);
        dupLayer.startTime = targetLayer.startTime; if (targetLayer.inPoint > targetLayer.startTime) { dupLayer.inPoint = targetLayer.inPoint; } dupLayer.outPoint = targetLayer.outPoint;
        var origEffects = targetLayer.property("ADBE Effect Parade"); var dupEffects = dupLayer.property("ADBE Effect Parade");
        if (origEffects && dupEffects) { for (var e = 1; e <= origEffects.numProperties; e++) { var origEffect = origEffects.property(e); var newEffect = dupEffects.addProperty(origEffect.matchName); for (var p = 1; p <= origEffect.numProperties; p++) { var origProp = origEffect.property(p); var dupProp = newEffect.property(p); if (origProp.isTimeVarying) { for (var k = 1; k <= origProp.numKeys; k++) { var val = origProp.keyValue(k); var time = origProp.keyTime(k); dupProp.setValueAtTime(time, val); dupProp.setInterpolationTypeAtKey(k, origProp.keyInInterpolationType(k), origProp.keyOutInterpolationType(k)); } } else { dupProp.setValue(origProp.value); } if (origProp.canSetExpression && origProp.expressionEnabled) { dupProp.expression = origProp.expression; dupProp.expressionEnabled = true; } } } }
        var transformProps = ["Anchor Point", "Position", "Scale", "Rotation", "Opacity"];
        for (var t = 0; t < transformProps.length; t++) { var propName = transformProps[t]; var origProp = targetLayer.property("Transform").property(propName); var dupProp = dupLayer.property("Transform").property(propName); if (origProp.isTimeVarying) { for (var k = 1; k <= origProp.numKeys; k++) { var val = origProp.keyValue(k); var time = origProp.keyTime(k); dupProp.setValueAtTime(time, val); dupProp.setInterpolationTypeAtKey(k, origProp.keyInInterpolationType(k), origProp.keyOutInterpolationType(k)); } } else { dupProp.setValue(origProp.value); } if (origProp.canSetExpression && origProp.expressionEnabled) { dupProp.expression = origProp.expression; dupProp.expressionEnabled = true; } }
        dupLayer.collapseTransformation = targetLayer.collapseTransformation; dupLayer.motionBlur = targetLayer.motionBlur; dupLayer.adjustmentLayer = targetLayer.adjustmentLayer; dupLayer.threeDLayer = targetLayer.threeDLayer;
    }
    app.endUndoGroup();
}
    function swapLayerSource(){ app.beginUndoGroup("Touch: Swap Source"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } var projSel = app.project.selection; if(!projSel||projSel.length==0){ setError("Select footage in Project"); app.endUndoGroup(); return; } var newSource=null; for(var i=0;i<projSel.length;i++){ if(projSel[i] instanceof FootageItem || projSel[i] instanceof CompItem){ newSource=projSel[i]; break; } } if(!newSource){ setError("No footage selected"); app.endUndoGroup(); return; } for(var j=0;j<comp.selectedLayers.length;j++){ try{ comp.selectedLayers[j].replaceSource(newSource, false); }catch(e){ setError("Swap err: "+e.toString()); } } app.endUndoGroup(); }
    function revealTransformViaError(propKey){ app.beginUndoGroup("Touch: Reveal " + propKey); var comp=app.project.activeItem; if(!(comp && comp instanceof CompItem)){ setError("No active comp"); app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } var propMap = { "Position": ["ADBE Position"], "Scale": ["ADBE Scale"], "Rotation": ["ADBE Rotate Z", "ADBE Rotation", "ADBE Rotate X", "ADBE Rotate Y"], "Opacity": ["ADBE Opacity"], "Anchor": ["ADBE Anchor Point"], "Audio": ["ADBE Audio Lvl", "ADBE Audio Levels", "ADBE Audio"] }; var matchNames = propMap[propKey]; if(!matchNames){ setError("Unknown prop " + propKey); app.endUndoGroup(); return; } try{ for(var li=0; li<comp.selectedLayers.length; li++){ var l = comp.selectedLayers[li]; try{ var tg = l.property("ADBE Transform Group"); if(tg){ for(var t=1;t<=tg.numProperties;t++){ try{ tg.property(t).selected=false; }catch(e){} } } }catch(e){} try{ var ag = l.property("ADBE Audio Group"); if(ag){ for(var t=1;t<=ag.numProperties;t++){ try{ ag.property(t).selected=false; }catch(e){} } } }catch(e){} } }catch(e){} var saved = []; var propsToReveal = []; var foundAny = false; for(var li=0; li<comp.selectedLayers.length; li++){ var layer = comp.selectedLayers[li]; try{ var trans = layer.property("ADBE Transform Group"); if(!trans && propKey!=="Audio") continue; var found = null; if(trans){ for(var mi=0; mi<matchNames.length; mi++){ try{ var p = trans.property(matchNames[mi]); if(p){ found = p; break; } }catch(e){} } } if(!found && propKey==="Audio"){ try{ var audioGroup = layer.property("ADBE Audio Group"); if(audioGroup){ for(var ai=0; ai<matchNames.length; ai++){ try{ var ap = audioGroup.property(matchNames[ai]); if(ap){ found = ap; break; } }catch(e){} } if(!found){ try{ found = layer.property("Audio").property("Audio Levels"); }catch(e){} } } }catch(e){} } if(!found) continue; foundAny=true; var targets = []; try{ if(found.dimensionsSeparated && propKey==="Position"){ try{ var px = trans.property("ADBE Position_0"); var py = trans.property("ADBE Position_1"); var pz = trans.property("ADBE Position_2"); if(px) targets.push(px); if(py) targets.push(py); if(pz && layer.threeDLayer) targets.push(pz); if(targets.length===0){ targets.push(found); } }catch(e){ targets.push(found); } } else { targets.push(found); } }catch(e){ targets.push(found); } for(var tii=0; tii<targets.length; tii++){ var tProp = targets[tii]; try{ var origExpr = ""; var origEnabled = false; try{ origExpr = tProp.expression; }catch(e){} try{ origEnabled = tProp.expressionEnabled; }catch(e){} saved.push({prop: tProp, expr: origExpr, enabled: origEnabled}); propsToReveal.push(tProp); try{ tProp.expressionEnabled = true; tProp.expression = "throw new Error('reveal_' + Math.random());"; }catch(e){ try{ tProp.expression = "thisIsABadExpressionForReveal_12345"; }catch(e2){} } }catch(e){} } }catch(e){} } if(!foundAny || propsToReveal.length===0){ setError("Prop not found"); app.endUndoGroup(); return; } var revealed = false; try{ var cmdNames = ["Expression Errors", "Reveal Expression Errors", "Show Expression Errors", "Reveal Expressions with Errors", "Show Expressions with Errors", "Expression Error", "Show All Expression Errors"]; for(var ci=0; ci<cmdNames.length; ci++){ try{ var id = app.findMenuCommandId(cmdNames[ci]); if(id && id>0){ app.executeCommand(id); revealed = true; break; } }catch(e){} } }catch(e){} if(!revealed){ var tryIds = [2779, 2780, 2732, 2733, 2771, 3603, 3604, 3555, 3556, 2625, 3781, 3782]; for(var ii=0; ii<tryIds.length; ii++){ try{ app.executeCommand(tryIds[ii]); revealed = true; break; }catch(e){} } } for(var si=0; si<saved.length; si++){ var s = saved[si]; try{ if(s.enabled){ s.prop.expression = s.expr; s.prop.expressionEnabled = true; } else { s.prop.expressionEnabled = false; try{ s.prop.expression = s.expr; }catch(e){ try{ s.prop.expression = ""; }catch(e2){} } } }catch(e){ try{ s.prop.expressionEnabled = false; s.prop.expression = ""; }catch(e2){} } } try{ for(var li2=0; li2<comp.selectedLayers.length; li2++){ var layer2 = comp.selectedLayers[li2]; var trans2 = layer2.property("ADBE Transform Group"); if(!trans2) continue; for(var tj=1; tj<=trans2.numProperties; tj++){ try{ trans2.property(tj).selected = false; }catch(e){} } } }catch(e){} for(var ri=0; ri<propsToReveal.length; ri++){ try{ propsToReveal[ri].selected = true; }catch(e){} } clearError(); app.endUndoGroup(); }
    function revealPosition(){ revealTransformViaError("Position"); } function revealScale(){ revealTransformViaError("Scale"); } function revealRotation(){ revealTransformViaError("Rotation"); } function revealOpacity(){ revealTransformViaError("Opacity"); } function revealAnchor(){ revealTransformViaError("Anchor"); } function revealAudio(){ revealTransformViaError("Audio"); }

    // Helper: recursively collect all animatable properties with keys from a PropertyGroup
    function collectPropsWithKeys(group, outArr){
        if(!group) return;
        try{
            var n = group.numProperties;
            for(var i=1;i<=n;i++){
                var prop=null;
                try{ prop = group.property(i); }catch(e){ continue; }
                if(!prop) continue;
                try{
                    // PropertyType may not exist in older AE, fallback to checking numKeys
                    if(prop.propertyType === PropertyType.PROPERTY || prop.propertyType === 0){
                        try{
                            if(prop.canVaryOverTime && prop.numKeys>0){
                                outArr.push(prop);
                            }
                        }catch(e){}
                    }else{
                        collectPropsWithKeys(prop, outArr);
                    }
                }catch(e){
                    // fallback: if it has numKeys and numProperties, treat as group if no numKeys
                    try{
                        if(prop.numKeys !== undefined && prop.numKeys>0){
                            outArr.push(prop);
                        }else if(prop.numProperties !== undefined){
                            collectPropsWithKeys(prop, outArr);
                        }
                    }catch(e2){}
                }
            }
        }catch(e){}
    }

    function getAllKeyablePropsFromLayer(layer){
        var out=[];
        try{ collectPropsWithKeys(layer, out); }catch(e){}
        // dedup by reference
        var uniq=[];
        for(var i=0;i<out.length;i++){
            var p=out[i]; var exists=false;
            for(var j=0;j<uniq.length;j++){ if(uniq[j]===p){ exists=true; break; } }
            if(!exists) uniq.push(p);
        }
        return uniq;
    }

    function jumpToKey(dir){
        app.beginUndoGroup(dir<0 ? "Touch: Prev Key" : "Touch: Next Key");
        clearError();
        var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; }
        var selLayers = comp.selectedLayers;
        if(!selLayers || selLayers.length!==1){
            if(!selLayers || selLayers.length===0) setError("Select 1 layer");
            else setError("Select only 1 layer");
            app.endUndoGroup();
            return;
        }
        var layer = selLayers[0];
        var selProps = null;
        try{ selProps = comp.selectedProperties; }catch(e){ selProps=null; }

        var targetProps=[];
        if(selProps && selProps.length>0){
            // From selected properties (or groups containing keys)
            for(var s=0;s<selProps.length;s++){
                var sp = selProps[s];
                try{
                    if(sp.numKeys !== undefined && sp.numKeys>0){
                        targetProps.push(sp);
                    }else{
                        collectPropsWithKeys(sp, targetProps);
                    }
                }catch(e){
                    try{ collectPropsWithKeys(sp, targetProps); }catch(e2){}
                }
            }
        }else{
            // No property selected: get all keyframes in layer
            targetProps = getAllKeyablePropsFromLayer(layer);
        }

        if(targetProps.length===0){
            setError("No keyframes found");
            app.endUndoGroup();
            return;
        }

        var cur = comp.time;
        var fd = comp.frameDuration;
        var eps = fd/3;

        var bestTime = null;
        if(dir<0){
            var latest = -1e20;
            for(var pi=0;pi<targetProps.length;pi++){
                var prop = targetProps[pi];
                try{
                    for(var k=1;k<=prop.numKeys;k++){
                        var kt = prop.keyTime(k);
                        if(kt < cur - eps && kt > latest){
                            latest = kt;
                        }
                    }
                }catch(e){}
            }
            if(latest > -1e19) bestTime = latest;
        }else{
            var earliest = 1e20;
            for(var pi=0;pi<targetProps.length;pi++){
                var prop = targetProps[pi];
                try{
                    for(var k=1;k<=prop.numKeys;k++){
                        var kt = prop.keyTime(k);
                        if(kt > cur + eps && kt < earliest){
                            earliest = kt;
                        }
                    }
                }catch(e){}
            }
            if(earliest < 1e19) bestTime = earliest;
        }

        if(bestTime===null){
            if(dir<0) setError("No previous key");
            else setError("No next key");
        }else{
            try{ comp.time = bestTime; clearError(); }catch(e){ setError("Jump err: "+e.toString()); }
        }
        app.endUndoGroup();
    }

    function addRemoveKey(){ app.beginUndoGroup("Touch: Add/Remove Key"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } var props=comp.selectedProperties; if(!props||props.length==0){ setError("Select a property"); app.endUndoGroup(); return; } for(var i=0;i<props.length;i++){ var prop=props[i]; try{ if(prop.canVaryOverTime && prop.numKeys>0){ var t=comp.time; var found=-1; for(var k=1;k<=prop.numKeys;k++){ if(Math.abs(prop.keyTime(k)-t)<0.0005){ found=k; break; } } if(found>0) prop.removeKey(found); else prop.setValueAtTime(t, prop.valueAtTime(t, false)); }else if(prop.canVaryOverTime){ prop.setValueAtTime(comp.time, prop.valueAtTime(comp.time, false)); } }catch(e){} } app.endUndoGroup(); }
    function revealAnimated(){ app.beginUndoGroup("Touch: Reveal Animated"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } try{ var id=app.findMenuCommandId("Reveal Properties with Keyframes"); if(!id) id=app.findMenuCommandId("U"); if(id) app.executeCommand(id); else setError("Reveal Animated not found"); }catch(e){ setError("Reveal err: "+e.toString()); } app.endUndoGroup(); }
    function revealAllModified(){ app.beginUndoGroup("Touch: Reveal Modified"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } try{ var id=app.findMenuCommandId("Reveal All Modified Properties"); if(!id) id=app.findMenuCommandId("UU"); if(id) app.executeCommand(id); else setError("Reveal Modified not found"); }catch(e){ setError("Reveal err: "+e.toString()); } app.endUndoGroup(); }
    function applyEasyEase(){ app.beginUndoGroup("Touch: Easy Ease"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } var props=comp.selectedProperties; if(!props||props.length==0){ setError("Select keyframes"); app.endUndoGroup(); return; } try{ var id=app.findMenuCommandId("Easy Ease"); if(!id) id=app.findMenuCommandId("F9"); if(id) app.executeCommand(id); else setError("Easy Ease not found"); }catch(e){ setError("EasyEase err: "+e.toString()); } app.endUndoGroup(); }
    function addExpressionToSelected(){ app.beginUndoGroup("Touch: Add Expression"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } var props = comp.selectedProperties; if(!props||props.length===0){ setError("Select a property"); app.endUndoGroup(); return; } try{ var id = app.findMenuCommandId("Add Expression"); if(!id) id = app.findMenuCommandId("Add Expression..."); if(!id) id = app.findMenuCommandId("Expression"); if(id){ app.executeCommand(id); app.endUndoGroup(); return; } }catch(e){} var added = 0; for(var i=0;i<props.length;i++){ var prop = props[i]; try{ if(prop.canSetExpression){ if(!prop.expressionEnabled){ prop.expressionEnabled = true; try{ if(!prop.expression || prop.expression==="") prop.expression = ""; }catch(e){} added++; } } }catch(e){} } if(added===0){ setError("No expression added"); } if(added===0){ try{ app.executeCommand(2702); }catch(e){ try{ app.executeCommand(2703); }catch(e2){} } } app.endUndoGroup(); }
    function goToLayerInPoint(){ app.beginUndoGroup("Touch: Go to In Point"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } try{ var layer = comp.selectedLayers[comp.selectedLayers.length-1]; comp.time = layer.inPoint; }catch(e){ setError("Go to In err: "+e.toString()); } app.endUndoGroup(); }
    function goToLayerOutPoint(){ app.beginUndoGroup("Touch: Go to Out Point"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } try{ var layer = comp.selectedLayers[comp.selectedLayers.length-1]; comp.time = layer.outPoint; }catch(e){ setError("Go to Out err: "+e.toString()); } app.endUndoGroup(); }
    function transform_fitComp(){ app.beginUndoGroup("Touch: Fit to Comp"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } if(!runMenu("Fit to Comp")) setError("Fit to Comp not found"); app.endUndoGroup(); }
    function transform_fitCompWidth(){ app.beginUndoGroup("Touch: Fit to Comp Width"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } if(!runMenu("Fit to Comp Width")) setError("Fit to Comp Width not found"); app.endUndoGroup(); }
    function transform_fitCompHeight(){ app.beginUndoGroup("Touch: Fit to Comp Height"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } if(!runMenu("Fit to Comp Height")) setError("Fit to Comp Height not found"); app.endUndoGroup(); }
    function transform_centerView(){ app.beginUndoGroup("Touch: Center In View"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } if(!runMenu("Center In View")) setError("Center In View not found"); app.endUndoGroup(); }
    function transform_centerAnchor(){ app.beginUndoGroup("Touch: Center Anchor in Layer Content"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } if(!runMenu("Center Anchor Point in Layer Content")) setError("Center Anchor not found"); app.endUndoGroup(); }
    function transform_flipH(){ app.beginUndoGroup("Touch: Flip Horizontal"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } if(!runMenu("Flip Horizontal")) setError("Flip Horizontal not found"); app.endUndoGroup(); }
    function transform_flipV(){ app.beginUndoGroup("Touch: Flip Vertical"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select a layer"); app.endUndoGroup(); return; } if(!runMenu("Flip Vertical")) setError("Flip Vertical not found"); app.endUndoGroup(); }
    var COPY2_COMP_NAME = "_TouchClipboard_Internal";
    function getOrCreateClipboardComp(){ for(var i=1;i<=app.project.numItems;i++){ try{ var it=app.project.item(i); if(it && it.name===COPY2_COMP_NAME && it instanceof CompItem) return it; }catch(e){} } var w=1920, h=1080, par=1, dur=10, fps=30; try{ var ac=getActiveComp(); if(ac){ w=ac.width; h=ac.height; par=ac.pixelAspect; dur=ac.duration; fps=ac.frameRate; } }catch(e){} try{ var c=app.project.items.addComp(COPY2_COMP_NAME, w, h, par, dur, fps); return c; }catch(e){ setError("Clipboard comp err: "+e.toString()); return null; } }
    function clearClipboardComp(comp){ try{ while(comp.numLayers>0){ try{ comp.layer(1).remove(); }catch(e){ break; } } }catch(e){} }
    function clipboard_cut(){ app.beginUndoGroup("Touch: Cut"); clearError(); if(!runMenu("Cut")) setError("Cut not found"); app.endUndoGroup(); }
    function clipboard_copy(){ app.beginUndoGroup("Touch: Copy"); clearError(); if(!runMenu("Copy")) setError("Copy not found"); app.endUndoGroup(); }
    function clipboard_paste(){ app.beginUndoGroup("Touch: Paste"); clearError(); if(!runMenu("Paste")) setError("Paste not found"); app.endUndoGroup(); }
    function clipboard_pasteReverse(){ app.beginUndoGroup("Touch: Paste Reverse"); clearError(); var names=["Paste Reverse Keyframes","Paste Keyframes Reversed","Paste Reversed","Paste Reverse","Paste Keyframes Reverse"]; var ok=false; for(var i=0;i<names.length;i++){ if(runMenu(names[i])){ ok=true; break; } } if(!ok){ try{ app.executeCommand(4003); ok=true; }catch(e){} } if(!ok) setError("Paste Reverse not found"); app.endUndoGroup(); }
    function clipboard_copy2(){ app.beginUndoGroup("Touch: Copy2"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } if(!comp.selectedLayers||comp.selectedLayers.length==0){ setError("Select layers for Copy2"); app.endUndoGroup(); return; } var clipComp=getOrCreateClipboardComp(); if(!clipComp){ app.endUndoGroup(); return; } clearClipboardComp(clipComp); var count=0; for(var i=0;i<comp.selectedLayers.length;i++){ try{ comp.selectedLayers[i].copyToComp(clipComp); count++; }catch(e){} } if(count>0){ setSuccess("Copy2: " + count + " layer" + (count>1?"s":"") + " saved"); }else{ setError("Copy2 failed"); } app.endUndoGroup(); }
    function clipboard_paste2(){ app.beginUndoGroup("Touch: Paste2"); clearError(); var comp=getActiveComp(); if(!comp){ app.endUndoGroup(); return; } var clipComp=null; for(var i=1;i<=app.project.numItems;i++){ try{ var it=app.project.item(i); if(it && it.name===COPY2_COMP_NAME && it instanceof CompItem){ clipComp=it; break; } }catch(e){} } if(!clipComp || clipComp.numLayers===0){ setError("Copy2 empty - copy first"); app.endUndoGroup(); return; } var pasted=0; var cti=comp.time; var toCopy=[]; for(var l=1;l<=clipComp.numLayers;l++){ try{ toCopy.push(clipComp.layer(l)); }catch(e){} } for(var j=toCopy.length-1;j>=0;j--){ try{ var srcL=toCopy[j]; var newL=srcL.copyToComp(comp); try{ var delta = cti - newL.inPoint; newL.startTime += delta; }catch(e){} pasted++; }catch(e){} } if(pasted>0){ setSuccess("Paste2: " + pasted + " layer" + (pasted>1?"s":"") + " at CTI"); }else{ setError("Paste2 failed"); } app.endUndoGroup(); }
    function composition_addToRenderQueue(){ app.beginUndoGroup("Touch: Add to Render Queue"); clearError(); var names=["Add to Render Queue","Add To Render Queue","Render Queue"]; var ok=false; for(var i=0;i<names.length;i++){ if(runMenu(names[i])){ ok=true; break; } } if(!ok){ try{ app.executeCommand(2989); ok=true; }catch(e){} if(!ok){ try{ app.executeCommand(2459); ok=true; }catch(e){} } } if(!ok) setError("Add to Render Queue not found"); else clearError(); app.endUndoGroup(); }
    function file_save(){ app.beginUndoGroup("Touch: Save"); clearError(); var names=["Save","Save Project"]; var ok=false; for(var i=0;i<names.length;i++){ if(runMenu(names[i])){ ok=true; break; } } if(!ok){ try{ app.executeCommand(3); ok=true; }catch(e){} if(!ok){ try{ app.executeCommand(2); ok=true; }catch(e){} } } if(!ok) setError("Save not found"); else clearError(); app.endUndoGroup(); }
    function composition_settings(){ app.beginUndoGroup("Touch: Composition Settings"); clearError(); var names=["Composition Settings","Composition Settings...","Settings","Comp Settings"]; var ok=false; for(var i=0;i<names.length;i++){ if(runMenu(names[i])){ ok=true; break; } } if(!ok){ try{ app.executeCommand(2007); ok=true; }catch(e){} if(!ok){ try{ app.executeCommand(3700); ok=true; }catch(e){} } } if(!ok) setError("Composition Settings not found"); else clearError(); app.endUndoGroup(); }

    var TABS = {
        "LAYER TOOLS": [
            [ {label: "\u23EE\uFE0F", tooltip: "Move in to CTI", onClick: moveInPointToCTI}, {label: "\u23ED\uFE0F", tooltip: "Move out to CTI", onClick: moveOutPointToCTI}, {label: "\u23EA\u2702\uFE0F", tooltip: "Trim In to CTI (just trim)", onClick: cutInPointToCTI}, {label: "\u2702\uFE0F\u23E9", tooltip: "Trim Out to CTI", onClick: cutOutPointToCTI} ],
            [ {label: "\uD83D\uDCCB", tooltip: "Duplicate", onClick: duplicateLayers}, {label: "\u2702\uFE0F", tooltip: "Split at CTI", onClick: splitLayers}, {label: "\uD83E\uDDEC", tooltip: "True Layer Duplicator", onClick: trueLayerDuplicatorClone}, {label: "\uD83D\uDD04", tooltip: "Swap source (select layer + project item)", onClick: swapLayerSource} ]
        ],
        "PROPERTIES": [
            [ {label: "\uD83D\uDCCD", tooltip: "Position (error reveal hack)", onClick: revealPosition}, {label: "\u2922", tooltip: "Scale (error reveal hack)", onClick: revealScale}, {label: "\uD83D\uDD03", tooltip: "Rotation (error reveal hack)", onClick: revealRotation}, {label: "\uD83D\uDC41\uFE0F", tooltip: "Opacity (error reveal hack)", onClick: revealOpacity} ],
            [ {label: "\u2693", tooltip: "Anchor (error reveal hack)", onClick: revealAnchor}, {label: "\uD83D\uDD0A", tooltip: "Audio Levels (error reveal hack)", onClick: revealAudio}, {label: "", tooltip: ""}, {label: "", tooltip: ""} ]
        ],
        "KEYFRAMING": [
            [ {label: "\u23EA", tooltip: "Previous Keyframe", onClick: function(){ jumpToKey(-1); }}, {label: "\u2666\uFE0F", tooltip: "Add/remove Keyframe", onClick: addRemoveKey}, {label: "\u23E9", tooltip: "Next Keyframe", onClick: function(){ jumpToKey(1); }}, {label: "\uD83D\uDD11", tooltip: "Reveal All Keyframes", onClick: revealAnimated} ],
            [ {label: "\u23EE\uFE0F", tooltip: "Move to Layer In Point", onClick: goToLayerInPoint}, {label: "\u23ED\uFE0F", tooltip: "Move to Layer End Point", onClick: goToLayerOutPoint}, {label: "\uD83C\uDF0A", tooltip: "Easy Ease", onClick: applyEasyEase}, {label: "\uD83D\uDCDC", tooltip: "Reveal All Modified Values", onClick: revealAllModified} ],
            [ {label: "\u0192x", tooltip: "Add Expression", onClick: addExpressionToSelected}, {label: "", tooltip: ""}, {label: "", tooltip: ""}, {label: "", tooltip: ""} ]
        ],
        "TRANSFORM": [
            [ {label: "⛶", tooltip: "Fit to Comp", onClick: transform_fitComp}, {label: "\u2194\uFE0F", tooltip: "Fit to Comp Width", onClick: transform_fitCompWidth}, {label: "\u2195\uFE0F", tooltip: "Fit to Comp Height", onClick: transform_fitCompHeight}, {label: "\uD83C\uDFAF", tooltip: "Center In View", onClick: transform_centerView} ],
            [ {label: "\u2693", tooltip: "Center Anchor Point in Layer Content", onClick: transform_centerAnchor}, {label: "\u2194\uFE0F\uD83E\uDE9E", tooltip: "Flip Horizontal", onClick: transform_flipH}, {label: "\u2195\uFE0F\uD83E\uDE9E", tooltip: "Flip Vertical", onClick: transform_flipV}, {label: "", tooltip: ""} ]
        ],
        "EDIT": [
            [ {label: "\u2702\uFE0F", tooltip: "Cut", onClick: clipboard_cut}, {label: "\uD83D\uDCCB", tooltip: "Copy", onClick: clipboard_copy}, {label: "\uD83D\uDCCB\uD83D\uDCCC", tooltip: "Paste", onClick: clipboard_paste}, {label: "\uD83D\uDD04\uD83D\uDCCB", tooltip: "Paste Reverse Keyframes", onClick: clipboard_pasteReverse} ],
            [ {label: "\uD83D\uDCCB2", tooltip: "Copy 2 - Independent buffer", onClick: clipboard_copy2}, {label: "\uD83D\uDCCC2", tooltip: "Paste 2 at CTI - Independent", onClick: clipboard_paste2}, {label: "\uD83C\uDFAC\u2795", tooltip: "Add to Render Queue (Composition -> Add to Render Queue)", onClick: composition_addToRenderQueue}, {label: "\uD83D\uDCBE", tooltip: "Save (File -> Save)", onClick: file_save} ],
            [ {label: "\u2699\uFE0F", tooltip: "Composition Settings (Composition -> Composition Settings)", onClick: composition_settings}, {label: "", tooltip: ""}, {label: "", tooltip: ""}, {label: "", tooltip: ""} ]
        ]
    };

    function buildGrid(tabName){ clearGrid(); clearError(); var rows=TABS[tabName]; if(!rows) return; for(var r=0;r<rows.length;r++) addRow(rows[r]); try{ win.layout.layout(true); win.layout.resize(); }catch(e){} }
    function switchTab(){ var sel=tabDropdown.selection?tabDropdown.selection.text:"LAYER TOOLS"; buildGrid(sel); }
    tabDropdown.onChange=switchTab; buildGrid("LAYER TOOLS");
    if(win instanceof Window){ win.center(); win.show(); } else { try{ win.layout.layout(true); win.layout.resize(); win.layout.layout(true); }catch(e){} }
})(this);
