// RECREATOR - BUILT FROM LATEST DUMP WITH REAL TARGET EXTRACTION
// Dump: Comp_1_DEEP.txt with TrackMatte REAL TARGET + SHARED MATTE CANDIDATE detection
// User wants: Red Solid A,B,C,D,E all matted by Pre-comp 2, but Pre-comp 2 stays visible
// Workaround: 11 layers (5 matte copies + 5 solids + 1 visible PC2)

function gameWinText() {
    function safeEase(s,i){ if(i<0.1)i=0.1; if(i>100)i=100; return new KeyframeEase(s,i); }
    function setV(p,v){ try{ if(p) p.setValue(v); }catch(e){} }
    function setAt(p,t,v){ try{ if(p) p.setValueAtTime(t,v); }catch(e){} }
    function setTime(layer, st, ip, op, str){
        try{ if(str!==undefined) layer.stretch=str; }catch(e){}
        try{ if(st!==undefined) layer.startTime=st; }catch(e){}
        try{ if(ip!==undefined) layer.inPoint=ip; }catch(e){}
        try{ if(op!==undefined) layer.outPoint=op; }catch(e){}
    }
    function getUniqueName(base){
        var name=base;
        for(var i=1;i<=app.project.numItems;i++){ try{ if(app.project.item(i).name===name && app.project.item(i) instanceof CompItem){ name=base+"_Recreated"; break; } }catch(e){} }
        if(name!==base){
            var n=1; while(true){
                var found=false;
                for(var j=1;j<=app.project.numItems;j++){ try{ if(app.project.item(j).name===base+"_Recreated_"+n){ found=true; break; } }catch(e){} }
                if(!found){ name=base+"_Recreated_"+n; break; }
                n++;
            }
            var found=false;
            for(var j=1;j<=app.project.numItems;j++){ try{ if(app.project.item(j).name===base+"_Recreated"){ found=true; } }catch(e){} }
            if(!found) name=base+"_Recreated";
        }
        return name;
    }
    function createComp(name,w,h,dur,fps){
        var n=getUniqueName(name);
        var c=app.project.items.addComp(n,w,h,1,dur,fps);
        c.bgColor=[0,0,0];
        try{ c.workAreaStart=0; }catch(e){}
        try{ c.workAreaDuration=dur-0.001; }catch(e){ try{ c.workAreaDuration=c.duration-0.01; }catch(e2){} }
        return c;
    }

    app.beginUndoGroup("Recreate Comp 1 REAL TARGET + SHARED MATTE WORKAROUND");

    var comps={};

    // DEPTH 4: Red Solid 1 Comp 2 [960x135] 311.417s
    // LAYER 1: Red Solid x Solid 1,0,0 Time 0|0|311.417 Linear Wipe 100@0->0@0.5 BEZIER
    var comp_RSC2 = createComp("Red Solid 1 Comp 2", 960, 135, 311.417, 24);
    comps["Red Solid 1 Comp 2"]=comp_RSC2;
    var lRSC2 = comp_RSC2.layers.addSolid([1,0,0], "Red Solid x", 960, 135, 1, 311.417);
    lRSC2.name="Red Solid x"; lRSC2.label=10;
    try{ lRSC2.blendingMode=BlendingMode.NORMAL; }catch(e){}
    try{ lRSC2.trackMatteType=TrackMatteType.NO_TRACK_MATTE; }catch(e){}
    setTime(lRSC2, 0, 0, 311.417, 100);
    try{
        var eff = lRSC2.property("ADBE Effect Parade").addProperty("ADBE Linear Wipe");
        var tc = eff.property("ADBE Linear Wipe-0001");
        setAt(tc, 0.0, 100);
        setAt(tc, 0.5, 0);
        try{ tc.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER); }catch(e){}
        try{ tc.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER); }catch(e){}
        try{ tc.setTemporalEaseAtKey(1, [safeEase(0,95)], [safeEase(0,50)]); tc.setTemporalEaseAtKey(2, [safeEase(0,95)], [safeEase(0,50)]); }catch(e){}
        try{ eff.property("ADBE Linear Wipe-0002").setValue(-270); }catch(e){}
        try{ eff.property("ADBE Linear Wipe-0003").setValue(100); }catch(e){}
    }catch(e){}

    // DEPTH 3: Pre-comp 1 [1920x1080] 312.125s - 10 layers RSC2
    var comp_PC1 = createComp("Pre-comp 1", 1920, 1080, 312.125, 24);
    comps["Pre-comp 1"]=comp_PC1;
    var pc1=[
        {pos:[1440,460.862,0], rot:180, st:0.708, ip:0.708, op:312.125},
        {pos:[480,460.862,0], rot:0, st:0.708, ip:0.708, op:312.125},
        {pos:[1440,460.862,0], rot:180, st:0.542, ip:0.542, op:311.958},
        {pos:[480,460.862,0], rot:0, st:0.542, ip:0.542, op:311.958},
        {pos:[1440,328.19,0], rot:180, st:0.375, ip:0.375, op:311.792},
        {pos:[480,328.19,0], rot:0, st:0.375, ip:0.375, op:311.792},
        {pos:[1440,197.845,0], rot:180, st:0.167, ip:0.167, op:311.583},
        {pos:[480,197.845,0], rot:0, st:0.167, ip:0.167, op:311.583},
        {pos:[1440,67.5,0], rot:180, st:0, ip:0, op:311.417},
        {pos:[480,67.5,0], rot:0, st:0, ip:0, op:311.417}
    ];
    for(var i=pc1.length-1;i>=0;i--){
        var d=pc1[i];
        var l=comp_PC1.layers.add(comps["Red Solid 1 Comp 2"]);
        l.name="Red Solid 1 Comp 2"; l.label=15;
        setV(l.property("ADBE Transform Group").property("ADBE Position"), d.pos);
        if(d.rot!==0) setV(l.property("ADBE Transform Group").property("ADBE Rotate Z"), d.rot);
        try{ l.trackMatteType=TrackMatteType.NO_TRACK_MATTE; }catch(e){}
        setTime(l, d.st, d.ip, d.op, 100);
    }

    // DEPTH 2: Pre-comp 2 [1920x1080] 311.417s - 5 layers PC1
    var comp_PC2 = createComp("Pre-comp 2", 1920, 1080, 311.417, 24);
    comps["Pre-comp 2"]=comp_PC2;
    var pc2=[
        {pos:[960,283.448,0], scl:[100,50,100], rot:0, en:true, st:0, ip:0, op:311.417},
        {pos:[960,543.512,0], scl:[100,50,100], rot:0, en:true, st:0.583, ip:0.583, op:312},
        {pos:[960,529.967,0], scl:[100,50,100], rot:180, en:true, st:0.583, ip:0.583, op:312},
        {pos:[960,790.03,0], scl:[100,50,100], rot:180, en:true, st:0, ip:0, op:311.417},
        {pos:[960,548.983,0], scl:[100,105,100], rot:0, en:false, st:0, ip:0, op:311.417}
    ];
    for(var i=pc2.length-1;i>=0;i--){
        var d=pc2[i];
        var l=comp_PC2.layers.add(comps["Pre-comp 1"]);
        l.name="Pre-comp 1"; l.label=15;
        try{ l.enabled=d.en; }catch(e){}
        setV(l.property("ADBE Transform Group").property("ADBE Position"), d.pos);
        setV(l.property("ADBE Transform Group").property("ADBE Scale"), d.scl);
        if(d.rot!==0) setV(l.property("ADBE Transform Group").property("ADBE Rotate Z"), d.rot);
        try{ l.trackMatteType=TrackMatteType.NO_TRACK_MATTE; }catch(e){}
        setTime(l, d.st, d.ip, d.op, 100);
    }

    // DEPTH 1: Red Solid 1 Comp 1 [1920x1080] 311.417s - 6 layers originally but with REAL TARGET analysis
    // From latest dump with REAL TARGET:
    // L1 Red Solid A MULTIPLY ALPHA REAL TARGET -> ABOVE layer 0 ERROR (invalid, no matte)
    // L2 Red Solid B MULTIPLY ALPHA REAL TARGET -> ABOVE 1:'Red Solid A'
    // L3 Red Solid C MULTIPLY ALPHA REAL TARGET -> ABOVE 2:'Red Solid B'
    // L4 Red Solid D MULTIPLY ALPHA REAL TARGET -> ABOVE 3:'Red Solid C'
    // L5 Red Solid E MULTIPLY ALPHA REAL TARGET -> ABOVE 4:'Red Solid D'
    // L6 Pre-comp 2 NORMAL NO_TRACK_MATTE
    // TRACK MATTE ANALYSIS says SHARED MATTE CANDIDATE: Pre-comp 2 intended matte for all A-E
    // WORKAROUND PROMPT: 11 layers: 5 matte copies of PC2 + 5 solids ALPHA + 1 visible PC2 bottom
    // All solids keep MULTIPLY blend and positions from dump:
    // A 960,128.017 scale 218,218
    // B 960,128.017 scale 218,218
    // C 960,265.345 scale 218,218
    // D 960,749.483 scale 218,218
    // E 960,540 scale 218,218 (from latest dump, not null)
    var comp_RSC1 = createComp("Red Solid 1 Comp 1", 1920, 1080, 311.417, 24);
    comps["Red Solid 1 Comp 1"]=comp_RSC1;
    var solids=[
        {name:"Red Solid A", pos:[960,128.017,0], scl:[218,218,100], blend:BlendingMode.MULTIPLY, st:0, ip:0, op:311.417},
        {name:"Red Solid B", pos:[960,128.017,0], scl:[218,218,100], blend:BlendingMode.MULTIPLY, st:0, ip:0, op:311.417},
        {name:"Red Solid C", pos:[960,265.345,0], scl:[218,218,100], blend:BlendingMode.MULTIPLY, st:0, ip:0, op:311.417},
        {name:"Red Solid D", pos:[960,749.483,0], scl:[218,218,100], blend:BlendingMode.MULTIPLY, st:0, ip:0, op:311.417},
        {name:"Red Solid E", pos:[960,540,0], scl:[218,218,100], blend:BlendingMode.MULTIPLY, st:0, ip:0, op:311.417}
    ];
    // Bottom visible Pre-comp 2 - stays visible
    var lVisible = comp_RSC1.layers.add(comps["Pre-comp 2"]);
    lVisible.name="Pre-comp 2 - VISIBLE"; lVisible.label=15;
    try{ lVisible.blendingMode=BlendingMode.NORMAL; }catch(e){}
    try{ lVisible.trackMatteType=TrackMatteType.NO_TRACK_MATTE; }catch(e){}
    setTime(lVisible, 0, 0, 311.417, 100);

    // Add pairs bottom up: E+matte, D+matte, C+matte, B+matte, A+matte
    for(var i=solids.length-1;i>=0;i--){
        var d=solids[i];
        var sl=comp_RSC1.layers.addSolid([0.8,0,0], d.name, 960, 135, 1, 311.417);
        sl.name=d.name; sl.label=10;
        try{ sl.blendingMode=d.blend; }catch(e){}
        try{ sl.trackMatteType=TrackMatteType.ALPHA; }catch(e){}
        if(d.pos) setV(sl.property("ADBE Transform Group").property("ADBE Position"), d.pos);
        setV(sl.property("ADBE Transform Group").property("ADBE Scale"), d.scl);
        setTime(sl, d.st, d.ip, d.op, 100);
        var matte = comp_RSC1.layers.add(comps["Pre-comp 2"]);
        matte.name="Pre-comp 2 - MATTE for "+d.name; matte.label=15;
        try{ matte.blendingMode=BlendingMode.NORMAL; }catch(e){}
        try{ matte.trackMatteType=TrackMatteType.NO_TRACK_MATTE; }catch(e){}
        setTime(matte, 0, 0, 311.417, 100);
    }
    // Re-set mattes to ensure correct: odd=top mattes NO_TRACK, even=solids ALPHA
    try{
        for(var mi=1; mi<=10; mi++){
            var lyr = comp_RSC1.layer(mi);
            if(mi%2==0){
                try{ lyr.trackMatteType = TrackMatteType.ALPHA; }catch(e){}
            } else {
                try{ lyr.trackMatteType = TrackMatteType.NO_TRACK_MATTE; }catch(e){}
            }
        }
        try{ comp_RSC1.layer(11).trackMatteType = TrackMatteType.NO_TRACK_MATTE; }catch(e){}
    }catch(e){}

    // DEPTH 0: Comp 1 [1920x1080] 311.417s
    // L1 GAME WIN! Text Time 0|0|311.417 Position animated, Scale animated, Opacity animated, Animator
    // L2 Red Solid 1 Comp 1 Time 0|0|311.417 Opacity 100@2.708->0@3.208 + CC Lens 229
    var comp_C1 = createComp("Comp 1", 1920, 1080, 311.417, 24);
    comps["Comp 1"]=comp_C1;

    var lC1_2 = comp_C1.layers.add(comps["Red Solid 1 Comp 1"]);
    lC1_2.name="Red Solid 1 Comp 1"; lC1_2.label=15;
    try{ lC1_2.trackMatteType=TrackMatteType.NO_TRACK_MATTE; }catch(e){}
    setTime(lC1_2, 0, 0, 311.417, 100);
    var opC1_2 = lC1_2.property("ADBE Transform Group").property("ADBE Opacity");
    setAt(opC1_2, 2.708, 100);
    setAt(opC1_2, 3.208, 0);
    try{ opC1_2.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR); }catch(e){}
    try{ opC1_2.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR); }catch(e){}
    try{
        var cc = lC1_2.property("ADBE Effect Parade").addProperty("CC Lens");
        try{ cc.property("CC Lens-0002").setValue(229); }catch(e){ try{ cc.property("Size").setValue(229); }catch(e2){} }
    }catch(e){}

    var lC1_1 = comp_C1.layers.addText("GAME\rWIN!");
    lC1_1.name="GAME WIN!"; lC1_1.label=1;
    try{ lC1_1.trackMatteType=TrackMatteType.NO_TRACK_MATTE; }catch(e){}
    setTime(lC1_1, 0, 0, 311.417, 100);
    var pos=lC1_1.property("ADBE Transform Group").property("ADBE Position");
    setAt(pos, 0.0, [959.281,974.768,0]);
    setAt(pos, 0.75, [959.281,515.768,0]);
    try{ pos.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER); }catch(e){}
    try{ pos.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER); }catch(e){}
    try{ pos.setTemporalEaseAtKey(1, [safeEase(0,95)],[safeEase(0,50)]); pos.setTemporalEaseAtKey(2, [safeEase(0,95)],[safeEase(0,50)]); }catch(e){}
    var scl=lC1_1.property("ADBE Transform Group").property("ADBE Scale");
    setAt(scl, 0.0, [0,0,100]);
    setAt(scl, 0.75, [120,120,100]);
    setAt(scl, 1.083, [90,90,100]);
    setAt(scl, 3.042, [90,90,100]);
    setAt(scl, 3.333, [0,0,100]);
    for(var k=1;k<=5;k++){ try{ scl.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER); }catch(e){} }
    try{
        scl.setTemporalEaseAtKey(1, [safeEase(0,87),safeEase(0,87),safeEase(0,87)], [safeEase(0,87),safeEase(0,87),safeEase(0,87)]);
        scl.setTemporalEaseAtKey(2, [safeEase(0,87),safeEase(0,87),safeEase(0,87)], [safeEase(0,87),safeEase(0,87),safeEase(0,87)]);
        scl.setTemporalEaseAtKey(3, [safeEase(0,16.667),safeEase(0,16.667),safeEase(0,16.667)], [safeEase(0,16.667),safeEase(0,16.667),safeEase(0,16.667)]);
        scl.setTemporalEaseAtKey(4, [safeEase(0,16.667),safeEase(0,16.667),safeEase(0,16.667)], [safeEase(0,16.667),safeEase(0,16.667),safeEase(0,16.667)]);
        scl.setTemporalEaseAtKey(5, [safeEase(0,16.667),safeEase(0,16.667),safeEase(0,16.667)], [safeEase(0,16.667),safeEase(0,16.667),safeEase(0,16.667)]);
    }catch(e){}
    var op=lC1_1.property("ADBE Transform Group").property("ADBE Opacity");
    setAt(op, 0.0, 0);
    setAt(op, 0.75, 100);
    try{ op.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.BEZIER); }catch(e){}
    try{ op.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.BEZIER); }catch(e){}
    try{ op.setTemporalEaseAtKey(1, [safeEase(0,16.667)], [safeEase(0,90)]); op.setTemporalEaseAtKey(2, [safeEase(133.333,16.667)], [safeEase(0,90)]); }catch(e){}
    var tdProp=lC1_1.property("ADBE Text Properties").property("ADBE Text Document");
    var td=tdProp.value;
    td.text="GAME\rWIN!";
    try{ td.font="BebasNeue-Regular"; }catch(e){ try{ td.font="BebasNeue"; }catch(e2){} }
    td.fontSize=369; td.leading=326; td.tracking=0;
    td.justification=ParagraphJustification.CENTER_JUSTIFY;
    td.fillColor=[1,1,1]; td.applyFill=true; td.applyStroke=false; td.strokeWidth=11;
    try{ td.autoKernType=AutoKernType.METRIC_KERN; }catch(e){}
    tdProp.setValue(td);
    try{
        var mo=lC1_1.property("ADBE Text Properties").property("ADBE Text More Options");
        if(mo){ try{ mo.property("ADBE Text Anchor Point Align").setValue([0,-38]); }catch(e){} }
    }catch(e){}
    var anims=lC1_1.property("ADBE Text Properties").property("ADBE Text Animators");
    var anim1=anims.addProperty("ADBE Text Animator"); anim1.name="Animator 1";
    var ap=anim1.property("ADBE Text Animator Properties");
    var sc3d=ap.addProperty("ADBE Text Scale 3D"); setAt(sc3d, 0.0, [150,150,100]);
    var tr=ap.addProperty("ADBE Text Tracking Amount"); setV(tr, 40);
    var sels=anim1.property("ADBE Text Selectors");
    var rs=sels.addProperty("ADBE Text Selector"); rs.name="Range Selector 1";
    try{ rs.property("ADBE Text Percent Start").setValue(0); }catch(e){}
    try{ rs.property("ADBE Text Percent End").setValue(100); }catch(e){}
    try{ rs.property("ADBE Text Index Start").setValue(0); }catch(e){}
    try{ rs.property("ADBE Text Index End").setValue(0); }catch(e){}
    try{ rs.property("ADBE Text Index Offset").setValue(0); }catch(e){}
    var off=rs.property("ADBE Text Percent Offset");
    setAt(off, 0.958, -100);
    setAt(off, 2.125, 100);
    try{ off.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER); }catch(e){}
    try{ off.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER); }catch(e){}
    try{ off.setTemporalEaseAtKey(1, [safeEase(0,16.667)], [safeEase(0,45)]); off.setTemporalEaseAtKey(2, [safeEase(0,45)], [safeEase(0,16.667)]); }catch(e){}
    try{
        var adv=rs.property("ADBE Text Range Advanced");
        if(adv){
            try{ adv.property("ADBE Text Range Units").setValue(1); }catch(e){}
            try{ adv.property("ADBE Text Range Type2").setValue(1); }catch(e){}
            try{ adv.property("ADBE Text Selector Mode").setValue(1); }catch(e){}
            try{ adv.property("ADBE Text Selector Max Amount").setValue(100); }catch(e){}
            try{ adv.property("ADBE Text Range Shape").setValue(5); }catch(e){}
            try{ adv.property("ADBE Text Selector Smoothness").setValue(100); }catch(e){}
            try{ adv.property("ADBE Text Levels Max Ease").setValue(0); }catch(e){}
            try{ adv.property("ADBE Text Levels Min Ease").setValue(60); }catch(e){}
            try{ adv.property("ADBE Text Randomize Order").setValue(0); }catch(e){}
            try{ adv.property("ADBE Text Random Seed").setValue(0); }catch(e){}
        }
    }catch(e){}

    app.endUndoGroup();
    comp_C1.openInViewer();
    alert("RECREATED FROM LATEST DUMP WITH REAL TARGET + SHARED MATTE WORKAROUND\n\nDepth 4 RSC2 Linear Wipe\nDepth 3 PC1 10 layers\nDepth 2 PC2 5 layers\nDepth 1 RSC1: 11 layers - 5x PC2 matte copies + 5 solids ALPHA matted by PC2 + 1 visible PC2\nDepth 0 Comp1 GAME WIN!\n\nAll A-E now matted by Pre-comp 2 but Pre-comp 2 stays visible");
}
