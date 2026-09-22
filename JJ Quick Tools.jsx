// JJ Quick Tools with Categories + Search
// Save in Scripts/ScriptUI Panels

function JJQuickTools(thisObj) {
    // The second argument "JJ Quick Tools" is the display name in AE's Window menu
    var panel = (thisObj instanceof Panel)
        ? thisObj
        : new Window("palette", "JJ Quick Tools", undefined, {resizeable:true});

    panel.orientation = "column";
    panel.alignChildren = ["fill","top"];


    // --- Search field ---
var searchField = panel.add("edittext", undefined, "Search...");
searchField.characters = 20;

// Clear placeholder when focused
searchField.onActivate = function() {
    if (searchField.text === "Search...") {
        searchField.text = "";
    }
};		


    // --- Listbox ---
    var toolList = panel.add("listbox", undefined, [], {multiselect:false});
    toolList.preferredSize = [250, 200];

    // --- All tools with categories ---
    var allTools = [
        {category:"Animate In", name:"Fade In"},
        {category:"Animate In", name:"Scale In"},
        {category:"Animate In", name:"Fade + Scale In"},
		{category:"Animate In", name:"Fade + Scale Down"},
        {category:"Animate In", name:"Scale In (Bounce)"},
        {category:"Animate In", name:"Fade from Black"},
        {category:"Animate In", name:"Fade from White"},
        {category:"Animate In", name:"Slide in from Top"},
        {category:"Animate In", name:"Slide in from Left"},
        {category:"Animate In", name:"Slide in from Right"},
        {category:"Animate In", name:"Slide in from Bottom"},
        {category:"Animate In", name:"Slide in from Random"},
		{category:"Animate In", name:"Smooth Linear Wipe"},
        {category:"Animate In", name:"Card In"},
        {category:"Animate Out", name:"Fade Out"},
        {category:"Animate Out", name:"Scale Out"},
		{category:"Animate Out", name:"Fade To Black"},
		{category:"Animate Out", name:"Fade To White"},
        {category:"Emphasis", name:"Quick Light Sweep"},
        {category:"Emphasis", name:"Pulse Scale"},
		{category:"Emphasis", name:"Grow Over Time"},
		{category:"Emphasis", name:"Glow (Quick)"},
		{category:"Emphasis", name:"Glow (Intense)"},
        {category:"Color Control", name:"Saturation to 0"},
		{category:"Color Control", name:"Desaturate Footage"},
		{category:"Color Control", name:"Darken Footage"},
		{category:"Color Control", name:"Lighten Footage"},
		{category:"Audio Control", name:"Audio Fade Out"},
        {category:"Text Tools", name:"Text with Violator"},
		{category:"Text Tools", name:"Text with Violator (Use Comp Name)"},
        {category:"Text Tools", name:"Stylish Text In"},
        {category:"Text Tools", name:"Unscatter"},
        {category:"Text Tools", name:"Dark Souls Text"},
        {category:"Text Tools", name:"Tracking In"},
        {category:"Transitions", name:"Lens Distort Transition"},
        {category:"Transitions", name:"Lens Flare Transition"},
        {category:"Transitions", name:"Offset Transition"},
        {category:"Transitions", name:"Rotation Transition"},
        {category:"Transitions", name:"Zoom Transition"},
        {category:"Transitions", name:"Hexagon Transition"},
        {category:"Effects", name:"Lens Flare Horizontal"},
        {category:"Effects", name:"Radial Flare"},
        {category:"Effects", name:"Motion Blur Bloom"},
        {category:"Effects", name:"Offset (Horizontal)"},
        {category:"Effects", name:"Particle Star Burst"},
        {category:"Effects", name:"Particle Sweep"},
        {category:"Effects", name:"Rainbow Refraction"},
        {category:"Effects", name:"Chromatic Abberation"},
        {category:"Layer Management", name:"True Layer Duplicator"},
        {category:"Layer Management", name:"Create Master Null"},
        {category:"Timeline Management", name:"Loop Maker"},
        {category:"Audio Management", name:"BGM Compressor"},
        {category:"Collage Maker", name:"Sphere Collage (20)"},
        {category:"Collage Maker", name:"Cross Photos Collage"},
        {category:"Collage Maker", name:"Ferris Wheel Collage"},
        {category:"Collage Maker", name:"Carousel Collage"},
        {category:"Collage Maker", name:"Film Strip Collage"},
        {category:"Collage Maker", name:"Simple Collage"},
        {category:"Storyboard Maker", name:"1 Story: Mark Audio"},
        {category:"Storyboard Maker", name:"2 Story: Rename Markers"},
        {category:"Storyboard Maker", name:"3 Story: Build Comps"},
		{category:"Automation", name:"Show Match Names"},
		{category:"Automation", name:"seeComp"},
		{category:"Automation", name:"seeLayers"},
		{category:"Automation", name:"runAutomation"},
		{category:"Automation", name:"runJSXFile"},
		{category:"Version", name:"Version 092226-1644"},


    ];

    // --- Populate list with categories ---
    function populateList(query) {
        toolList.removeAll();
        var currentCategory = "";
        for (var i=0; i<allTools.length; i++) {
            var tool = allTools[i];
            if (query && tool.name.toLowerCase().indexOf(query) === -1) continue;

            if (tool.category !== currentCategory) {
                currentCategory = tool.category;
                var catItem = toolList.add("item", currentCategory);
                catItem.enabled = false; // category label
            }
            toolList.add("item", "   " + tool.name);
        }
    }
    populateList("");

    // --- Search behavior ---
    searchField.onChanging = function() {
        populateList(searchField.text.toLowerCase());
    };

    // --- Action when selecting a tool ---
    toolList.onDoubleClick = function() {
        var selected = toolList.selection;
        if (!selected || !selected.enabled) return; // ignore category labels
        var toolName = selected.text.replace(/^\s+/, ""); // trim spaces

        var comp = app.project.activeItem;
        if (!comp || comp.selectedLayers.length === 0) return;
        var layer = comp.selectedLayers[0];

        switch(toolName) {
            case "Fade In":
			    FadeIn();
				break;
            case "Fade Out":
				fadeOut();
				break;
            case "Scale In":
				scaleIn();
				break;
			case "Fade + Scale In":
				fadePlusScaleIn();
			break;
            case "Scale Out":
                scaleOut();
                break;
            case "Scale In (Bounce)":
                scaleInBounce();
                break;
            case "Text with Violator":
                textWithViolator();
                break;
			case "Text with Violator (Use Comp Name)":
				TextOnCompName();
				break;
			case "Stylish Text In":
				applyTextAppear(comp, layer);
			break;
			case "Dark Souls Text":
				DarkSoulsText();
			break;
			case "Tracking In":
				TextTrackingIn();
			break;
			case "Lens Distort Transition":
				lensTransition();
			break;
			case "Lens Flare Transition":
				lensFlareTransition();
			break;
			case "Offset Transition":
				offsetTransition();
			break;
			case "Rotation Transition":
				rotationTransition();
			break;
			case "Zoom Transition":
				zoomPushTransition();
			break;
			case "Saturation to 0":
				applyColorBalanceSaturation(comp, layer);
			break;
			case "Fade from Black":
				applyFadeFromBlack(comp, layer);
			break;
			case "Fade from White":
				applyFadeFromWhite(comp, layer);
			break;
			case "Lens Flare Horizontal":
			    lensFlareHorizontal();
			break;
			case "Radial Flare":
			    radialStarburstFlare();
			break;
			case "Motion Blur Bloom":
			    motionBlurBloom();
		    break;
			case "Particle Star Burst":
			    ParticleStarBurst();
		    break;
			case "Particle Sweep":
			    ParticleSweep();
		    break;
			case "Rainbow Refraction":
			    RainbowRefraction();
		    break;
			case "Chromatic Abberation":
			    ChromaticAbberation();
		    break;
			case "Quick Light Sweep":
			    quickLightSweep();
		    break;
			case "True Layer Duplicator":
				trueLayerDuplicatorClone();
			break;
			case "Create Master Null":
				createMasterNull();
			break;
			case "Loop Maker":
				loopMaker();
			break;
			case "BGM Compressor":
				BGMCompressor();
			break;
			case "Sphere Collage (20)":
				SphereCollage();
			break;
			case "Cross Photos Collage":
				CrossPhotosCollage();
			break;
			case "Ferris Wheel Collage":
				FerrisWheelCollage();
			break;
			case "Carousel Collage":
				CarouselCollage();
			break;
			case "Film Strip Collage":
				FilmstripCollageMaker();
			break;
			case "Simple Collage":
				SimpleCollage();
			break;
			case "Offset (Horizontal)":
				offsetHorizontal();
			break;
			case "Pulse Scale":
				pulseScale();
			break;
			case "1 Story: Mark Audio":
				markAudio();
			break;
			case "2 Story: Rename Markers":
				markerRename();
			break;
			case "3 Story: Build Comps":
				buildComps();
			break;
			case "Show Match Names":
				ShowMatchNames();
			break;
			case "seeComp":
				seeComp();
			break;
			case "seeLayers":
				seeLayers();
			break;
			case "runAutomation":
				runAutomation();
			break;
			case "Slide in from Bottom":
				SlideInFromBottom();
			break;
			case "Slide in from Left":
				SlideInFromLeft();
			break;
			case "Slide in from Right":
				SlideInFromRight();
			break;
			case "Slide in from Top":
				SlideInFromTop();
			break;
			case "Slide in from Random":
				SlideInFromRandom();
			break;
			case "Card In":
				CardIn();
			break;
			case "runJSXFile":
				runJSXFile("oneOffScript.jsx");
			break;
			case "Fade + Scale Down":
				fadePlusScaleDown();
				break;
			case "Smooth Linear Wipe":
				smoothLinearWipe();
				break;
			case "Fade Out":
				fadeOut();
				break;
			case "Fade To Black":
				fadeToBlack();
				break;
			case "Fade To White":
				fadeToWhite();
				break;
			case "Audio Fade Out":
				audioFadeOut();
				break;
			case "Grow Over Time":
				growOverTime();
				break;
			case "Glow (Quick)":
				QuickGlow();
				break;
			case "Glow (Intense)":
				IntenseGlow();
				break;
			case "Desaturate Footage":
				desaturateFootage();
				break;
			case "Darken Footage":
				darkenFootage();
				break;
			case "Lighten Footage":
				lightenFootage();
				break;
			case "Hexagon Transition":
				hexagonTransition();
				break;
			case "Unscatter":
				SpinIn();
				break;
        }
    };

    return panel;
}

function applyTextAppear(comp, layer) {
    app.beginUndoGroup("Quick Tools: Text Appear");

    // --- Opacity ---
    var opacity = layer.property("Transform").property("Opacity");
    var o1 = opacity.addKey(comp.time);
    var o2 = opacity.addKey(comp.time+0.5);
    opacity.setValueAtKey(o1, 0);
    opacity.setValueAtKey(o2, 100);
    opacity.setInterpolationTypeAtKey(o1, KeyframeInterpolationType.BEZIER);
    opacity.setInterpolationTypeAtKey(o2, KeyframeInterpolationType.BEZIER);

    // --- Scale ---
    var scale = layer.property("Transform").property("Scale");
    var s1 = scale.addKey(comp.time);
    var s2 = scale.addKey(comp.time+0.5);
    scale.setValueAtKey(s1, [50,50,50]);
    scale.setValueAtKey(s2, [100,100,100]);
    scale.setInterpolationTypeAtKey(s1, KeyframeInterpolationType.BEZIER);
    scale.setInterpolationTypeAtKey(s2, KeyframeInterpolationType.BEZIER);

    // Easing for Scale
    var easeOut = new KeyframeEase(0, 30);   // start ease
    var easeIn  = new KeyframeEase(0, 100);  // end ease
    scale.setTemporalEaseAtKey(s1, [easeOut,easeOut,easeOut], [easeOut,easeOut,easeOut]);
    scale.setTemporalEaseAtKey(s2, [easeIn,easeIn,easeIn], [easeIn,easeIn,easeIn]);

    app.endUndoGroup();
}

function TextTrackingIn(textLayer) {
	app.beginUndoGroup("Text Tracking In");
    textLayer = textLayer || app.project.activeItem.selectedLayers[0];
    var comp = textLayer.containingComp;
    var t0 = comp.time; // animation starts at current playhead position

    // 1. Opacity fade in, 0.5s
    var opacity = textLayer.property("ADBE Transform Group").property("ADBE Opacity");
    opacity.setValueAtTime(t0, 0);
    opacity.setValueAtTime(t0 + 0.5, 100);

    // 2. Text Animator — Tracking Amount, additive, 100 -> 0 over 1s
    var animators = textLayer.property("ADBE Text Properties").property("ADBE Text Animators");
    var animator = animators.addProperty("ADBE Text Animator");
    animator.name = "Tracking In";

    var trackingProp = animator.property("ADBE Text Animator Properties")
                                .addProperty("ADBE Text Tracking Amount");
    trackingProp.setValueAtTime(t0, 100);
    trackingProp.setValueAtTime(t0 + 1, 0);
	
	var trackingProp = animator.property("ADBE Text Animator Properties")
                                .addProperty("ADBE Text Tracking Amount");
    trackingProp.setValueAtTime(t0, 100);
    trackingProp.setValueAtTime(t0 + 1, 0);

    var ease = new KeyframeEase(0, 33); // speed 0, influence 33% — standard Easy Ease
    trackingProp.setTemporalEaseAtKey(1, [ease], [ease]);
    trackingProp.setTemporalEaseAtKey(2, [ease], [ease]);

    return textLayer;
	app.endUndoGroup();
}

function applyColorBalanceSaturation(comp, layer) {
    app.beginUndoGroup("Quick Tools: Color Balance Saturation");

    // Always add the effect
    var fx = layer.Effects.addProperty("Color Balance (HLS)");
    var saturation = fx.property("Saturation");

    // Capture current value
    var currentVal = saturation.value;

    // Add keyframes
    var k1 = saturation.addKey(comp.time);
    var k2 = saturation.addKey(comp.time+0.25);

    // Assign values
    saturation.setValueAtKey(k1, currentVal);
    saturation.setValueAtKey(k2, -100);

    // Interpolation (Bezier for consistency)
    saturation.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
    saturation.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

    app.endUndoGroup();
}

function applyFadeFromBlack(comp, layer) {
    app.beginUndoGroup("Quick Tools: Fade from Black");

    // Add the effect
    var fx = layer.Effects.addProperty("Color Balance (HLS)");

    // Rename the effect
    fx.name = "fade from black";

    // Grab Lightness property
    var lightness = fx.property("Lightness");

    // Add keyframes
    var k1 = lightness.addKey(comp.time);
    var k2 = lightness.addKey(comp.time+1);

    // Assign values
    lightness.setValueAtKey(k1, -100);
    lightness.setValueAtKey(k2, 0);

    // Interpolation (Bezier for consistency)
    lightness.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
    lightness.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

    app.endUndoGroup();
}

function applyFadeFromWhite(comp, layer) {
    app.beginUndoGroup("Quick Tools: Fade from Black");

    // Add the effect
    var fx = layer.Effects.addProperty("Color Balance (HLS)");

    // Rename the effect
    fx.name = "fade from black";

    // Grab Lightness property
    var lightness = fx.property("Lightness");

    // Add keyframes
    var k1 = lightness.addKey(comp.time);
    var k2 = lightness.addKey(comp.time+1);

    // Assign values
    lightness.setValueAtKey(k1, 100);
    lightness.setValueAtKey(k2, 0);

    // Interpolation (Bezier for consistency)
    lightness.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
    lightness.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

    app.endUndoGroup();
}

function lensFlareHorizontal() {
		//NULL MAKER
		function parentToNullWithOpacity(layers, flareComp) {

		
			// Create null in the center of flareComp
			var nullLayer = flareComp.layers.addNull();
			nullLayer.name = "Flare Control";
			nullLayer.property("Transform").property("Position").setValue([flareComp.width/2, flareComp.height/2]);
			
			// Loop through layers array
			for (var i = 0; i < layers.length; i++) {
            var lyr = layers[i];

            // Parent to null
            lyr.parent = nullLayer;

			}
		}
		
        app.beginUndoGroup("Lens Flare");

        var flareCompName = "LensFlareComp";
        var flareComp = null;

        // Check if comp already exists
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem && item.name === flareCompName) {
                flareComp = item;
                break;
            }
        }

        // If not found, create new comp
        if (flareComp === null) {
            flareComp = app.project.items.addComp(flareCompName, 2881, 801, 1, 300, 30);
			// --- Horizontal streak (yellow) ---
			var streak = flareComp.layers.addSolid([0,0,0], "Streak", flareComp.width, flareComp.height, 1);
			var streakCircle = streak.property("Effects").addProperty("ADBE Circle");
			streakCircle.property("ADBE Circle-0001").setValue([flareComp.width/2, flareComp.height/2]);
			streakCircle.property("ADBE Circle-0002").setValue(100);
			streakCircle.property("ADBE Circle-0003").setValue(1);
			streakCircle.property("ADBE Circle-0006").setValue(100);
			streakCircle.property("ADBE Circle-0010").setValue([1,1,0]); // Yellow
			streak.blendingMode = BlendingMode.ADD;
			streak.property("Transform").property("Scale").setValue([565,12]); // Stretch horizontally
			
			//Orange glow
			var glow = flareComp.layers.addSolid([0,0,0], "Glow", flareComp.width, flareComp.height, 1);
			var glowCircle = glow.property("Effects").addProperty("ADBE Circle");
			glowCircle.property("ADBE Circle-0001").setValue([flareComp.width/2, flareComp.height/2]);
			glowCircle.property("ADBE Circle-0002").setValue(150);
			glowCircle.property("ADBE Circle-0003").setValue(1);
			glowCircle.property("ADBE Circle-0006").setValue(320);
			glowCircle.property("ADBE Circle-0010").setValue([1,0.5,0]); // Orange
			glow.property("Transform").property("Scale").setValue([214,73]);
			glow.blendingMode = BlendingMode.ADD;
			
			//Inner streak
			var innerStreak = flareComp.layers.addSolid([0,0,0], "Inner Streak", flareComp.width, flareComp.height, 1);
			var innerStreakCircle = innerStreak.property("Effects").addProperty("ADBE Circle");
			innerStreakCircle.property("ADBE Circle-0001").setValue([flareComp.width/2, flareComp.height/2]); // Center
			innerStreakCircle.property("ADBE Circle-0002").setValue(75);   // Radius
			innerStreakCircle.property("ADBE Circle-0003").setValue(1);    // Edge = None
			innerStreakCircle.property("ADBE Circle-0006").setValue(11);  // Feather Outer
			innerStreakCircle.property("ADBE Circle-0010").setValue([1,1,1]); // Color (white)
			innerStreak.property("Transform").property("Scale").setValue([694,13]);
			innerStreak.blendingMode = BlendingMode.ADD;
			
			//Center core
			var core = flareComp.layers.addSolid([0,0,0], "Core", flareComp.width, flareComp.height, 1);
			var coreCircle = core.property("Effects").addProperty("ADBE Circle");
			coreCircle.property("ADBE Circle-0001").setValue([flareComp.width/2, flareComp.height/2]); // Center
			coreCircle.property("ADBE Circle-0002").setValue(50);   // Radius
			coreCircle.property("ADBE Circle-0003").setValue(1);    // Edge = None
			coreCircle.property("ADBE Circle-0006").setValue(52);  // Feather Outer
			coreCircle.property("ADBE Circle-0010").setValue([1,1,1]); // Color (white)
			core.property("Transform").property("Scale").setValue([217,72]);
			core.blendingMode = BlendingMode.ADD;
			
			parentToNullWithOpacity([streak,glow,innerStreak,core], flareComp);
			
        }

        // Add flare comp to active comp
        var mainComp = app.project.activeItem;
		if (mainComp != null && mainComp instanceof CompItem) {
			var currentTime = mainComp.time; // playhead position
			var flareLayer = mainComp.layers.add(flareComp);

			// Move layer start to current time
			flareLayer.startTime = currentTime;

			// Animate opacity for fade-in
			var opacityProp = flareLayer.property("Transform").property("Opacity");
			opacityProp.setValueAtTime(currentTime, 0);              // start invisible
			opacityProp.setValueAtTime(currentTime + 0.25, 100);     // fade in over 0.25s
		}

        app.endUndoGroup();
    }
	
	function radialStarburstFlare() {
        app.beginUndoGroup("Radial Starburst Flare");

        var flareCompName = "RadialStarburstFlare";
        var flareComp = null;

        // Check if comp already exists
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem && item.name === flareCompName) {
                flareComp = item;
                break;
            }
        }

        if (flareComp === null) {
            flareComp = app.project.items.addComp(flareCompName, 2000, 2000, 1, 300, 30); // 5 minutes
        }

        // --- Core burst (white) ---
        var core = flareComp.layers.addSolid([0,0,0], "Core Burst", flareComp.width, flareComp.height, 1);
        var coreCircle = core.property("Effects").addProperty("Circle");
        coreCircle.property("Center").setValue([flareComp.width/2, flareComp.height/2]);
        coreCircle.property("Radius").setValue(40);
        coreCircle.property("ADBE Circle-0006").setValue(100); // Feather
        coreCircle.property("Color").setValue([1,1,1]); // white
        coreCircle.property("Opacity").setValue(100);
        core.blendingMode = BlendingMode.ADD;

        // --- Radial glow (orange/yellow mix) ---
        var glow = flareComp.layers.addSolid([0,0,0], "Radial Glow", flareComp.width, flareComp.height, 1);
        var glowCircle = glow.property("Effects").addProperty("Circle");
        glowCircle.property("Center").setValue([flareComp.width/2, flareComp.height/2]);
        glowCircle.property("Radius").setValue(200); // smaller radius
        glowCircle.property("ADBE Circle-0006").setValue(100);
        glowCircle.property("Color").setValue([1,0.8,0.3]); // warm orange-yellow
        glowCircle.property("Opacity").setValue(60);
        glow.blendingMode = BlendingMode.ADD;

        // --- Radial spikes (irregular angles, contained size) ---
        var angles = [0, 40, 95, 150, 210, 275];
        for (var i = 0; i < angles.length; i++) {
            var spike = flareComp.layers.addSolid([0,0,0], "Spike " + (i+1), flareComp.width, flareComp.height, 1);
            var spikeCircle = spike.property("Effects").addProperty("Circle");
            spikeCircle.property("Center").setValue([flareComp.width/2, flareComp.height/2]);
            spikeCircle.property("Radius").setValue(80 + (Math.random()*20)); // smaller radius
            spikeCircle.property("ADBE Circle-0006").setValue(100);
            spikeCircle.property("Color").setValue([1,1,0]); // yellow
            spikeCircle.property("Opacity").setValue(30 + (Math.random()*20));
            spike.blendingMode = BlendingMode.ADD;

            // Scale less aggressively to keep inside comp
            spike.property("Transform").property("Scale").setValue([500, 50 + (Math.random()*30)]);
            spike.property("Transform").property("Rotation").setValue(angles[i]);
        }

        // Add flare comp to active comp at playhead
        var mainComp = app.project.activeItem;
        if (mainComp != null && mainComp instanceof CompItem) {
            var currentTime = mainComp.time;
            var flareLayer = mainComp.layers.add(flareComp);
            flareLayer.startTime = currentTime;

            // Fade in over 0.25s
            var opacityProp = flareLayer.property("Transform").property("Opacity");
            opacityProp.setValueAtTime(currentTime, 0);
            opacityProp.setValueAtTime(currentTime + 0.25, 100);
			
			// Add slow rotation expression
			var rotationProp = flareLayer.property("Transform").property("Rotation");
			rotationProp.expression = "time * 5"; 
			// rotates 10 degrees per second; adjust multiplier for slower/faster spin
        }

        app.endUndoGroup();
    }

    
function motionBlurBloom() {
        app.beginUndoGroup("Motion Blur Bloom");

        var mainComp = app.project.activeItem;
        if (!(mainComp && mainComp instanceof CompItem)) {
            alert("Please select a layer in a comp.");
            return;
        }

        var selLayers = mainComp.selectedLayers;
        if (selLayers.length === 0) {
            alert("Select a layer first.");
            return;
        }

        var targetLayer = selLayers[0];

        // Precompose the selected layer
        var precompName = targetLayer.name + "_BloomComp";
        var precompLayerIndex = mainComp.layers.precompose([targetLayer.index], precompName, true);

        // The new precomp layer is now at precompLayerIndex in mainComp
        var precompLayer = mainComp.layer(precompLayerIndex);

        // Get the actual CompItem by name
        var bloomComp = null;
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem && item.name === precompName) {
                bloomComp = item;
                break;
            }
        }

        if (!bloomComp) {
            alert("Could not find the precomp.");
            return;
        }

        // Get the single layer inside the precomp
        var baseLayer = bloomComp.layer(1);

        // 1. Glow effect (full opacity)
        var glowLayer = baseLayer.duplicate();
        var glow = glowLayer.property("Effects").addProperty("Glow");
        glow.property("Composite Original").setValue(2); // "On Top"
        glowLayer.blendingMode = BlendingMode.ADD;
        glowLayer.opacity.setValue(100);

        // Helper function to duplicate with blur
        function addBlurLayer(direction, length) {
            var blurLayer = baseLayer.duplicate();
            var blurEffect = blurLayer.property("Effects").addProperty("Directional Blur");
            blurEffect.property("Direction").setValue(direction);
            blurEffect.property("Blur Length").setValue(length);
            blurLayer.blendingMode = BlendingMode.ADD;
            blurLayer.opacity.setValue(45);
        }

        // 2. Directional Blur 0°
        addBlurLayer(0, 300);

        // 3. Directional Blur 90°
        addBlurLayer(90, 300);

        // 4. Directional Blur 45°
        addBlurLayer(45, 150);

        // 5. Directional Blur -45°
        addBlurLayer(-45, 150);

        app.endUndoGroup();
}

function ParticleStarBurst() {
    app.beginUndoGroup("Particle Star Burst");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        app.endUndoGroup();
        return;
    }

    var selLayers = comp.selectedLayers;
    var solidLayer;

    // Create white solid
    var solid = comp.layers.addSolid([1,1,1], "Particle Star Burst", comp.width, comp.height, comp.pixelAspect, comp.duration);

    // Place solid above selected layer or at top
    if (selLayers.length > 0) {
        solid.moveBefore(selLayers[0]);
    } else {
        solid.moveToBeginning();
    }
    solidLayer = solid;

    var effects = solidLayer.property("ADBE Effect Parade");

    // --- CC Star Burst ---
    var starBurst = effects.addProperty("CC Star Burst");
    if (starBurst) {
        starBurst.property("CC Star Burst-0004").setValue(12.0);   // Grid Spacing
        starBurst.property("CC Star Burst-0005").setValue(61.0);   // Size
        starBurst.property("CC Star Burst-0007").setValue(0.0);    // Shading
        starBurst.property("CC Star Burst-0001").setValue(600.0);  // Scatter
        starBurst.property("CC Star Burst-0002").setValue(0.10);   // Speed
        starBurst.property("CC Star Burst-0003").setValue(0.0);    // Phase
        starBurst.property("CC Star Burst-0006").setValue(0.0);    // Blend w. Original
    }

    // --- Glow ---
    var glow = effects.addProperty("ADBE Glo2");
    if (glow) {
        glow.property("ADBE Glo2-0002").setValue(0.0);     // Glow Threshold
        glow.property("ADBE Glo2-0003").setValue(40.0);    // Glow Radius
        glow.property("ADBE Glo2-0004").setValue(255.0);   // Glow Intensity
        glow.property("ADBE Glo2-0006").setValue(2);       // Glow Operation (Add)
    }

    app.endUndoGroup();
}
		

function quickLightSweep() {
        app.beginUndoGroup("CC Light Sweep Quick Tool");

        var mainComp = app.project.activeItem;
        if (!(mainComp && mainComp instanceof CompItem)) {
            alert("Please select a layer in a comp.");
            return;
        }

        var selLayers = mainComp.selectedLayers;
        if (selLayers.length === 0) {
            alert("Select a layer first.");
            return;
        }

        var targetLayer = selLayers[0];

        // Add CC Light Sweep effect directly to the selected layer
        var sweepEffect = targetLayer.property("Effects").addProperty("CC Light Sweep");

        if (!sweepEffect) {
            alert("Could not add CC Light Sweep effect.");
            return;
        }

        // Access properties
        var centerProp = sweepEffect.property("Center");
        var intensityProp = sweepEffect.property("Sweep Intensity");

        if (!centerProp || !intensityProp) {
            alert("Could not access CC Light Sweep properties.");
            return;
        }

        // Calculate layer bounds
        var layerWidth = targetLayer.width;
        var layerHeight = targetLayer.height;
        var yCenter = layerHeight / 2;

        // Animate Center from left to right in 3 seconds
        var startTime = mainComp.time;
        centerProp.setValueAtTime(startTime, [-100, yCenter]);
        centerProp.setValueAtTime(startTime + 3, [layerWidth + 100, yCenter]);

        // Set Sweep Intensity to 100
        intensityProp.setValue(100);

        app.endUndoGroup();
}

function trueLayerDuplicatorClone() {
    app.beginUndoGroup("True Layer Duplicator Clone");

    var activeComp = app.project.activeItem;
    if (!(activeComp && activeComp instanceof CompItem)) {
        alert("Please select a comp.");
        app.endUndoGroup();
        return;
    }

    var compMap = {}; // map original comp IDs to duplicates

    function getNewName(oldName) {
        var match = oldName.match(/(.*?)(\d+)$/);
        if (match) {
            var base = match[1];
            var num = parseInt(match[2], 10);
            return base + (num + 1);
        } else {
            return oldName + " 2";
        }
    }

    function duplicateRecursive(comp, isTopLevel) {
        if (compMap[comp.id]) {
            return compMap[comp.id]; // already processed
        }

        // Only skip duplication for nested subcomps, never for the top-level target comp
        if (!isTopLevel && comp.name.toLowerCase().indexOf("dontduplicate") !== -1) {
            compMap[comp.id] = comp;
            return comp;
        }

        var dupComp = comp.duplicate();
        dupComp.name = getNewName(comp.name);
        compMap[comp.id] = dupComp;

        // Iterate through layers
        for (var i = 1; i <= dupComp.numLayers; i++) {
            var lyr = dupComp.layer(i);
            if (lyr.source && lyr.source instanceof CompItem) {
                var dupSub = duplicateRecursive(lyr.source, false); // nested, so check applies
                lyr.replaceSource(dupSub, false);
            }
        }

        return dupComp;
    }

    var selLayers = activeComp.selectedLayers;
    if (selLayers.length < 1) {
        alert("Please select at least one comp layer.");
        app.endUndoGroup();
        return;
    }

    for (var i = 0; i < selLayers.length; i++) {
        var targetLayer = selLayers[i];
        if (!(targetLayer.source && targetLayer.source instanceof CompItem)) continue;

        // Duplicate the source comp recursively — top-level always duplicates
        var dupSubComp = duplicateRecursive(targetLayer.source, true);

        // Add duplicated comp as a new layer
        var dupLayer = activeComp.layers.add(dupSubComp);

        // Place directly above the original
        dupLayer.moveBefore(targetLayer);

        // --- Timing ---
        // Match startTime
        dupLayer.startTime = targetLayer.startTime;

        // If the inPoint has been trimmed after startTime, match that too
        if (targetLayer.inPoint > targetLayer.startTime) {
            dupLayer.inPoint = targetLayer.inPoint;
        }

        // Always match outPoint
        dupLayer.outPoint = targetLayer.outPoint;

        // --- Copy Effects ---
        var origEffects = targetLayer.property("ADBE Effect Parade");
        var dupEffects = dupLayer.property("ADBE Effect Parade");
        if (origEffects && dupEffects) {
            for (var e = 1; e <= origEffects.numProperties; e++) {
                var origEffect = origEffects.property(e);
                var newEffect = dupEffects.addProperty(origEffect.matchName);

                for (var p = 1; p <= origEffect.numProperties; p++) {
                    var origProp = origEffect.property(p);
                    var dupProp = newEffect.property(p);

                    if (origProp.isTimeVarying) {
                        for (var k = 1; k <= origProp.numKeys; k++) {
                            var val = origProp.keyValue(k);
                            var time = origProp.keyTime(k);
                            dupProp.setValueAtTime(time, val);
                            dupProp.setInterpolationTypeAtKey(
                                k,
                                origProp.keyInInterpolationType(k),
                                origProp.keyOutInterpolationType(k)
                            );
                        }
                    } else {
                        dupProp.setValue(origProp.value);
                    }

                    if (origProp.canSetExpression && origProp.expressionEnabled) {
                        dupProp.expression = origProp.expression;
                        dupProp.expressionEnabled = true;
                    }
                }
            }
        }

        // --- Copy Transform Properties ---
        var transformProps = ["Anchor Point", "Position", "Scale", "Rotation", "Opacity"];
        for (var t = 0; t < transformProps.length; t++) {
            var propName = transformProps[t];
            var origProp = targetLayer.property("Transform").property(propName);
            var dupProp = dupLayer.property("Transform").property(propName);

            if (origProp.isTimeVarying) {
                for (var k = 1; k <= origProp.numKeys; k++) {
                    var val = origProp.keyValue(k);
                    var time = origProp.keyTime(k);
                    dupProp.setValueAtTime(time, val);
                    dupProp.setInterpolationTypeAtKey(
                        k,
                        origProp.keyInInterpolationType(k),
                        origProp.keyOutInterpolationType(k)
                    );
                }
            } else {
                dupProp.setValue(origProp.value);
            }

            if (origProp.canSetExpression && origProp.expressionEnabled) {
                dupProp.expression = origProp.expression;
                dupProp.expressionEnabled = true;
            }
        }

        // --- Copy Layer Switches ---
        dupLayer.collapseTransformation = targetLayer.collapseTransformation;
        dupLayer.motionBlur = targetLayer.motionBlur;
        dupLayer.adjustmentLayer = targetLayer.adjustmentLayer;
        dupLayer.threeDLayer = targetLayer.threeDLayer;
    }

    app.endUndoGroup();
} 

 function scaleIn() {
        app.beginUndoGroup("Scale In Quick Tool");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a comp.");
            return;
        }

        var selLayers = comp.selectedLayers;
        if (selLayers.length === 0) {
            alert("Select a layer first.");
            return;
        }

        var layer = selLayers[0];
        var scale = layer.property("Transform").property("Scale");

        // Get the current scale value
        var currentScale = scale.value;

        // Add keyframes
        scale.setValueAtTime(comp.time, [0,0,0]);
        scale.setValueAtTime(comp.time + 0.5, currentScale);

        // Find the indices of the keys we just added
        var k1 = scale.nearestKeyIndex(comp.time);
        var k2 = scale.nearestKeyIndex(comp.time + 0.5);

        // Set interpolation type
        scale.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
        scale.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

        // Define easing
        var easeOut = new KeyframeEase(0, 30);   // start ease
        var easeIn  = new KeyframeEase(0, 100);  // end ease

        // Apply easing to all 3 dimensions of the keys we added
        scale.setTemporalEaseAtKey(k1, [easeOut, easeOut, easeOut], [easeOut, easeOut, easeOut]);
        scale.setTemporalEaseAtKey(k2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);

        app.endUndoGroup();
}

function scaleOut() {
    app.beginUndoGroup("Scale Out Quick Tool");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a comp.");
        return;
    }

    var selLayers = comp.selectedLayers;
    if (selLayers.length === 0) {
        alert("Select a layer first.");
        return;
    }

    var t = comp.time;

    try {
        for (var i = 0; i < selLayers.length; i++) {
            var layer = selLayers[i];
            if (layer.locked) { continue; }

            var scale = layer.property("Transform").property("Scale");
            if (!scale) { continue; }

            // Get the current scale value
            var currentScale = scale.value;

            // Add keyframes
            scale.setValueAtTime(t, currentScale);
            scale.setValueAtTime(t + 0.5, [0, 0, 0]);

            // Find the indices of the keys we just added
            var k1 = scale.nearestKeyIndex(t);
            var k2 = scale.nearestKeyIndex(t + 0.5);

            // Set interpolation type
            scale.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
            scale.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

            // Define easing
            var easeOut = new KeyframeEase(0, 30);   // start ease
            var easeIn  = new KeyframeEase(0, 100);  // end ease

            // Apply easing to all 3 dimensions of the keys we added
            scale.setTemporalEaseAtKey(k1, [easeOut, easeOut, easeOut], [easeOut, easeOut, easeOut]);
            scale.setTemporalEaseAtKey(k2, [easeIn, easeIn, easeIn], [easeIn, easeIn, easeIn]);
        }
    } finally {
        app.endUndoGroup();
    }
}

function loopMaker() {
        app.beginUndoGroup("Loop Maker");

        var activeComp = app.project.activeItem;
        if (!(activeComp && activeComp instanceof CompItem)) {
            alert("Please select a comp.");
            return;
        }

        var selLayers = activeComp.selectedLayers;
        if (selLayers.length === 0) {
            alert("Please select one or more layers.");
            return;
        }

        // Find earliest inPoint, latest outPoint, and lowest layer index (before removal)
        var earliestIn = selLayers[0].inPoint;
        var latestOut = selLayers[0].outPoint;
        var lowestIndex = selLayers[0].index;
        for (var j = 1; j < selLayers.length; j++) {
            if (selLayers[j].inPoint < earliestIn) earliestIn = selLayers[j].inPoint;
            if (selLayers[j].outPoint > latestOut) latestOut = selLayers[j].outPoint;
            if (selLayers[j].index < lowestIndex) lowestIndex = selLayers[j].index;
        }

        // Use the name of the first selected layer for naming
        var baseName = selLayers[0].name;
        var newCompName = baseName + "_loop";

        // Create new comp with duration = latestOut
        var newComp = app.project.items.addComp(
            newCompName,
            activeComp.width,
            activeComp.height,
            activeComp.pixelAspect,
            latestOut,
            activeComp.frameRate
        );

        // Copy layers into new comp
        for (var i = 0; i < selLayers.length; i++) {
            selLayers[i].copyToComp(newComp);
        }

        // Remove selected layers from active comp
        // Removing from highest index to lowest avoids reindexing issues
        var indices = [];
        for (var m = 0; m < selLayers.length; m++) indices.push(selLayers[m].index);
        indices.sort(function(a,b){return b-a;});
        for (var n = 0; n < indices.length; n++) {
            activeComp.layer(indices[n]).remove();
        }

        // Add new comp layer (it will be placed at the top by default)
        var compLayer = activeComp.layers.add(newComp);

        // Determine where to insert the new comp so it occupies the same stacking position
        // After removal, the layer indices have changed. If lowestIndex is greater than
        // the current number of layers + 1, place at end; otherwise move before the layer
        // currently at lowestIndex (if that layer is not the compLayer itself).
        var targetIndex = lowestIndex;
        // If targetIndex is greater than current number of layers, moveToEnd
        if (targetIndex <= activeComp.numLayers) {
            var targetLayer = activeComp.layer(targetIndex);
            // Safety: ensure we are not moving before ourselves
            if (targetLayer !== compLayer) {
                compLayer.moveBefore(targetLayer);
            } else {
                // If targetLayer is the same as compLayer (rare), move it one position down if possible
                if (targetIndex < activeComp.numLayers) {
                    var nextLayer = activeComp.layer(targetIndex + 1);
                    if (nextLayer !== compLayer) compLayer.moveBefore(nextLayer);
                } else {
                    compLayer.moveToEnd();
                }
            }
        } else {
            compLayer.moveToEnd();
        }

        // Place comp layer at the same timeline position as the selected group
        compLayer.startTime = earliestIn;

        // Fade in over 0.5s
        var opacity = compLayer.property("Transform").property("Opacity");
        opacity.setValueAtTime(earliestIn, 0);
        opacity.setValueAtTime(earliestIn + 0.5, 100);

        // Split comp at 0.5s after earliestIn
        var splitTime = earliestIn + 0.5;
        var secondHalf = compLayer.splitLayer(splitTime);

        // First half: keep duration = 0.5s, move whole layer to last 0.5s of active comp
        compLayer.startTime = activeComp.duration - 0.5;

        // Second half: shift whole layer so its inPoint lands at 0 (start of comp)
        var offset = secondHalf.inPoint; // current inPoint after split
        secondHalf.startTime -= offset;

        // Ensure first half is above second half
        if (compLayer !== secondHalf) compLayer.moveBefore(secondHalf);

        app.endUndoGroup();
    }
	
function BGMCompressor() {
    app.beginUndoGroup("BGM Compressor");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        app.endUndoGroup();
        return;
    }

    var selLayers = comp.selectedLayers;
    if (selLayers.length !== 1) {
        alert("Please select exactly one audio layer.");
        app.endUndoGroup();
        return;
    }

    var layer = selLayers[0];
    var effects = layer.property("ADBE Effect Parade");
    if (effects) {
        var compressor = effects.addProperty("ADBE Aud Compressor");

        if (compressor) {
            // Threshold (dB): -24.0
            compressor.property("ADBE Aud Compressor-0001").setValue(-24.0);

            // Ratio (x:1): 30.0
            compressor.property("ADBE Aud Compressor-0002").setValue(30.0);

            // Knee (dB): 15
            compressor.property("ADBE Aud Compressor-0003").setValue(15.0);

            // Attack (ms): 6
            compressor.property("ADBE Aud Compressor-0004").setValue(6.0);

            // Release (ms): 440
            compressor.property("ADBE Aud Compressor-0005").setValue(440.0);

            // Auto Release: enabled
            compressor.property("ADBE Aud Compressor-0006").setValue(1);

            // Makeup Gain (dB): 10.0
            compressor.property("ADBE Aud Compressor-0007").setValue(10.0);

            // Output Limit (dB): -1.0
            compressor.property("ADBE Aud Compressor-0008").setValue(-1.0);
        }
    }

    app.endUndoGroup();
}

	function offsetHorizontal() {
        app.beginUndoGroup("offsetHorizontal");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        var sel = comp.selectedLayers;
        if (!sel || sel.length === 0) {
            alert("Please select one or more layers.");
            return;
        }

        for (var i = 0; i < sel.length; i++) {
            var layer = sel[i];

            // Add Offset effect
            var effects = layer.property("ADBE Effect Parade");
            if (!effects) continue;
            var offsetFx = effects.addProperty("ADBE Offset");
            if (!offsetFx) continue;

            // Get the Shift Center To property (display name)
            var shiftProp = offsetFx.property("Shift Center To");
            if (!shiftProp) {
                shiftProp = offsetFx.property(1);
                if (!shiftProp) continue;
            }

            // Times
            var inT = layer.inPoint;
            var secondT = inT + 5.0;
            if (secondT > comp.duration) secondT = comp.duration;

            // X positions: 0 and layer width (use source.width if available, otherwise comp.width)
            var layerWidth = comp.width;
            try {
                if (layer.source && typeof layer.source.width === "number") {
                    layerWidth = layer.source.width;
                }
            } catch (e) {
                layerWidth = comp.width;
            }
            var x0 = 0;
            var x1 = layerWidth;

            // Y position: half the source height if available, otherwise half the comp height
            var layerHeight = comp.height;
            try {
                if (layer.source && typeof layer.source.height === "number") {
                    layerHeight = layer.source.height;
                }
            } catch (e) {
                layerHeight = comp.height;
            }
            var y = layerHeight / 2;

            // Set keyframe at inPoint
            shiftProp.setValueAtTime(inT, [x0, y]);

            // Set keyframe 5 seconds after inPoint (clamped)
            shiftProp.setValueAtTime(secondT, [x1, y]);

            // Make keyframes linear if supported
            try {
                var kfCount = shiftProp.numKeys;
                for (var k = 1; k <= kfCount; k++) {
                    shiftProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR, KeyframeInterpolationType.LINEAR);
                }
            } catch (e) {
                // ignore if property doesn't support interpolation settings
            }

            // Add loopOut expression to the property
            try {
                shiftProp.expression = "loopOut()";
            } catch (e) {
                // ignore if expression cannot be set
            }
        }

        app.endUndoGroup();
    }
	
function pulseScale() {
        app.beginUndoGroup("pulseScale");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        var sel = comp.selectedLayers;
        if (!sel || sel.length === 0) {
            alert("Please select one or more layers.");
            return;
        }

        // Start at current comp time
        var t0 = comp.time;
        var t1 = t0 + 0.375; // halfway
        var t2 = t0 + 0.75;  // full duration

        for (var i = 0; i < sel.length; i++) {
            var layer = sel[i];
            var scaleProp = layer.property("Transform").property("Scale");
            if (!scaleProp) continue;

            var currentScale = scaleProp.value;
            var growScale = [
                currentScale[0] * 1.2,
                currentScale[1] * 1.2,
                currentScale.length > 2 ? currentScale[2] * 1.2 : 100
            ];

            // Set keyframes
            scaleProp.setValueAtTime(t0, currentScale);
            scaleProp.setValueAtTime(t1, growScale);
            scaleProp.setValueAtTime(t2, currentScale);

            // Apply simple Easy Ease
            var easeIn = new KeyframeEase(0, 33);  // influence 33%
            var easeOut = new KeyframeEase(0, 33);

            var kfCount = scaleProp.numKeys;
            for (var k = 1; k <= kfCount; k++) {
                scaleProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
                // Apply same ease to all 3 dimensions
                scaleProp.setTemporalEaseAtKey(k, [easeIn, easeIn, easeIn], [easeOut, easeOut, easeOut]);
            }
        }

        app.endUndoGroup();
}

function markAudio(){
app.beginUndoGroup("Mark Silence in Audio");

try {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        throw "Please select a composition.";
    }

    var audioLayer = comp.selectedLayers[0];
    if (!audioLayer) {
        throw "Please select the audio layer you want to mark.";
    }

    var ampLayer = comp.layer("Audio Amplitude");
    if (!ampLayer) {
        throw "No 'Audio Amplitude' layer found.\n\n" +
              "You need to run 'Convert Audio to Keyframes' first:\n" +
              "1. Select your audio layer.\n" +
              "2. Go to menu: Animation > Keyframe Assistant > Convert Audio to Keyframes.\n" +
              "3. Then re‑run this script.";
    }

    var slider = ampLayer.property("Effects").property("Both Channels").property("Slider");

    var threshold = 1;      // silence threshold
    var minDuration = 10;    // frames of silence before marking

    var silenceFrames = 0;
    var markerCount = 1;    // start naming at 1

    for (var i = 1; i <= slider.numKeys; i++) {
        var val = slider.keyValue(i);
        if (val < threshold) {
            silenceFrames++;
        } else {
            if (silenceFrames >= minDuration) {
                // Mark when audio resumes (current keyframe time)
                var t = slider.keyTime(i);

                // Offset 3 frames earlier
                var offset = comp.frameDuration * 3;
                var markTime = t - offset;
                if (markTime < 0) markTime = 0;

                var markerName = "Keyframe " + markerCount;
                audioLayer.property("Marker").setValueAtTime(markTime, new MarkerValue(markerName));
                markerCount++;
            }
            silenceFrames = 0;
        }
    }

} catch (err) {
    alert(err);
}

app.endUndoGroup();

}

function markerRename(){
	app.beginUndoGroup("Marker Renamer");

try {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        throw "Please select a composition.";
    }

    var audioLayer = comp.selectedLayers[0];
    if (!audioLayer) {
        throw "Please select the audio layer with markers.";
    }

    var markers = audioLayer.property("Marker");
    if (!markers || markers.numKeys === 0) {
        throw "No markers found on the selected layer.";
    }

    var keyframeIndex = 1;

    for (var i = 1; i <= markers.numKeys; i++) {
        var marker = markers.keyValue(i);
        var name = marker.comment || ""; // ensure it's a string

        // Case 1: Blank marker → assign Keyframe [count]
        if (name === "") {
            marker.comment = "Keyframe " + keyframeIndex;
            markers.setValueAtKey(i, marker);
        }
        // Case 2: Named "Keyframe X" but wrong number → fix it
        else {
            var match = name.match(/^Keyframe\s*(\d+)$/);
            if (match) {
                var num = parseInt(match[1], 10);
                if (num !== keyframeIndex) {
                    marker.comment = "Keyframe " + keyframeIndex;
                    markers.setValueAtKey(i, marker);
                }
            }
            // Case 3: Custom name → leave unchanged
        }

        keyframeIndex++;
    }

} catch (err) {
    alert(err);
}

app.endUndoGroup();
}

function buildComps(){
	app.beginUndoGroup("Build Subcomps from Audio Markers");

// Helper: scale layer to fit comp height
function fitLayerToCompHeight(layer, comp) {
    var src = layer.source;
    var srcHeight;

    if (src instanceof FootageItem && src.hasVideo) {
        srcHeight = src.height;
    } else if (src instanceof CompItem) {
        srcHeight = src.height;
    } else {
        return; // Unsupported source type
    }

    var compHeight = comp.height;
    var scaleFactor = (compHeight / srcHeight) * 100;
    layer.property("Scale").setValue([scaleFactor, scaleFactor]);
}

try {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        throw "Please select a composition.";
    }

    var audioLayer = comp.selectedLayers[0];
    if (!audioLayer) {
        throw "Please select the audio layer with markers.";
    }

    // Collect valid footage/comps from project selection
    var validItems = [];
    for (var i = 0; i < app.project.selection.length; i++) {
        var item = app.project.selection[i];
        if (item instanceof FootageItem || item instanceof CompItem) {
            if (item.hasVideo || item instanceof CompItem) {
                validItems.push(item);
            } else {
                throw "Selection contains audio footage. Please select only images, videos, or comps.";
            }
        } else {
            throw "Selection contains unsupported items. Please select only images, videos, or comps.";
        }
    }

    var markers = audioLayer.property("Marker");
    var markerKeys = [];
    for (var i = 1; i <= markers.numKeys; i++) {
        markerKeys.push({time: markers.keyTime(i), name: markers.keyValue(i).comment});
    }

    var currentTime = 0;
    var unnamedCount = 1;

    // Build subcomps based on markers
    for (var j = 0; j < markerKeys.length; j++) {
        var start = markerKeys[j].time;
        var end = (j < markerKeys.length - 1) ? markerKeys[j+1].time : comp.duration;
        var dur = end - start;

        var name = markerKeys[j].name;
        if (!name || name === "") {
            name = "UnnamedComp " + (unnamedCount++);
        }

        // Subcomp lasts dur + 5s
        var subComp = app.project.items.addComp(name, comp.width, comp.height, comp.pixelAspect, dur + 5, comp.frameRate);
		
		if (j < validItems.length) {
            var layer = subComp.layers.add(validItems[j]);
            fitLayerToCompHeight(layer, subComp);
        } else {
            var solidColor = [Math.random(), Math.random(), Math.random()];
            subComp.layers.addSolid(solidColor, "FallbackSolid_" + (j+1), comp.width, comp.height, 1);
        }
		
        // Add audio slice for this segment
        var audioSeg = subComp.layers.add(audioLayer.source);
        audioSeg.startTime = -start;   // offset so segment begins at 0
        audioSeg.outPoint = dur;       // trim to segment duration

        var subLayer = comp.layers.add(subComp);
        subLayer.startTime = currentTime;

        // Advance only by dur (not dur+5), so overlap occurs
        currentTime += dur;
    }

    // Finally, mute the original audio layer
    audioLayer.audioEnabled = false;

} catch (err) {
    alert(err);
}
app.endUndoGroup();
}

function textWithViolator() {
        app.beginUndoGroup("Text with Violator");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            app.endUndoGroup();
            return;
        }

        var selLayers = comp.selectedLayers;
        if (selLayers.length < 1) {
            alert("Please select a layer to place above.");
            app.endUndoGroup();
            return;
        }

        var refLayer = selLayers[0];

        // --- Check if "TextWithViolatorComp" already exists ---
        var compName = "TextWithViolatorComp";
        var existingComp = null;
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof CompItem && item.name === compName) {
                existingComp = item;
                break;
            }
        }

        if (existingComp) {
            // Append timestamp if already exists
            var timestamp = new Date().getTime();
            compName = "TextWithViolatorComp_" + timestamp;
        }

        // Create a new comp with fixed size 1920x1080
        var subComp = app.project.items.addComp(compName, 1920, 1080, 1, comp.duration, comp.frameRate);

        // Place the sub‑comp into the main comp, above the selected layer
        var subLayer = comp.layers.add(subComp);
        subLayer.moveBefore(refLayer);

        // Enable Collapse Transformations (the star icon beside shy)
        subLayer.collapseTransformation = true;

        // --- Inside the sub‑comp ---
        // Violator BG (rounded rectangle)
        var bg = subComp.layers.addShape();
        bg.name = "Violator BG";

        var rect = bg.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rect.property("Size").expression =
            "var pad = 50; var t = thisComp.layer('Violator Text'); var r = t.sourceRectAtTime(time,false); [r.width + pad*2, r.height + pad*2];";
        rect.property("Position").expression =
            "var t = thisComp.layer('Violator Text'); var r = t.sourceRectAtTime(time,false); [r.left + r.width/2, r.top + r.height/2];";

        // Roundness set to 75
        rect.property("Roundness").setValue(75);

        // Fill color #a103fc
        var fill = bg.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue([161/255, 3/255, 252/255]);
		
		// Stroke (white outline)
		var stroke = bg.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
		stroke.property("Color").setValue([1,1,1]); // white
		stroke.property("Stroke Width").setValue(5); // adjust thickness as needed

        // Text layer (added after BG so it sits above)
        var textLayer = subComp.layers.addText("YOUR NAME HERE");
        textLayer.name = "Violator Text";

        app.endUndoGroup();
    }

function lensTransition() {
        app.beginUndoGroup("Lens Transition");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            app.endUndoGroup();
            return;
        }

        var selLayers = comp.selectedLayers;
        if (selLayers.length < 1) {
            alert("Please select a layer.");
            app.endUndoGroup();
            return;
        }

        var targetLayer = selLayers[0];
        var cutTime = comp.time;
        var t0 = cutTime;              // start
        var tQuarter = cutTime + 0.25; // 0.25s in
        var tMid = cutTime + 0.5;      // midpoint
        var t1 = cutTime + 1.0;        // end

        // Helper: effect parade
        var effectsParade = targetLayer.property("ADBE Effect Parade");
        if (!effectsParade) effectsParade = null;

        // Helper: find first index of an effect by exact name
        function findFirstEffectIndex(effectName) {
            if (!effectsParade) return -1;
            for (var i = 1; i <= effectsParade.numProperties; i++) {
                var ef = effectsParade.property(i);
                if (ef && ef.name === effectName) return i;
            }
            return -1;
        }

        // Helper: remove duplicate effects by name, keep the first occurrence
        function removeDuplicateEffects(effectName) {
            if (!effectsParade) return;
            var firstIndex = findFirstEffectIndex(effectName);
            if (firstIndex === -1) return;
            for (var i = effectsParade.numProperties; i >= 1; i--) {
                if (i === firstIndex) continue;
                var ef = effectsParade.property(i);
                if (ef && ef.name === effectName) {
                    effectsParade.removeProperty(i);
                }
            }
        }

        // Remove duplicates for the effects we use
        removeDuplicateEffects("CC Lens");
        removeDuplicateEffects("CC Radial Blur");

        // Now get or add CC Lens (safe: no duplicates remain)
        var ccLens = findFirstEffectIndex("CC Lens") !== -1 ? effectsParade.property(findFirstEffectIndex("CC Lens")) : targetLayer.Effects.addProperty("CC Lens");
        if (ccLens) {
            // Size (slow start → fast finish)
            var size = ccLens.property("Size");
            if (size) {
                for (var k = size.numKeys; k >= 1; k--) {
                    var kt = size.keyTime(k);
                    if (kt >= t0 && kt <= t1) size.removeKey(k);
                }

                size.setValueAtTime(t0, 0);
                size.setValueAtTime(t1, 500);

                size.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
                size.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);

                var easeInSize = new KeyframeEase(0.1, 75);
                var easeOutSize = new KeyframeEase(75, 0.1);

                size.setTemporalEaseAtKey(1, [easeInSize], [easeInSize]);
                size.setTemporalEaseAtKey(2, [easeOutSize], [easeOutSize]);
            }

            // Convergence
            var convergence = ccLens.property("Convergence");
            if (convergence) {
                for (var ck = convergence.numKeys; ck >= 1; ck--) {
                    var ckt = convergence.keyTime(ck);
                    if (ckt >= t0 && ckt <= t1) convergence.removeKey(ck);
                }

                convergence.setValueAtTime(t0, 100);
                convergence.setValueAtTime(tMid, 100);
                convergence.setValueAtTime(t1, 0);

                for (var ck2 = 1; ck2 <= convergence.numKeys; ck2++) {
                    convergence.setInterpolationTypeAtKey(ck2, KeyframeInterpolationType.LINEAR);
                }
            }
        }

        // Now get or add CC Radial Blur (safe: no duplicates remain)
        var radialBlur = findFirstEffectIndex("CC Radial Blur") !== -1 ? effectsParade.property(findFirstEffectIndex("CC Radial Blur")) : targetLayer.Effects.addProperty("CC Radial Blur");
        if (radialBlur) {
            var amount = radialBlur.property("Amount");
            if (amount) {
                for (var ak = amount.numKeys; ak >= 1; ak--) {
                    var akt = amount.keyTime(ak);
                    if (akt >= t0 && akt <= t1) amount.removeKey(ak);
                }

                // 0 -> 15 -> 0 across the transition
                amount.setValueAtTime(t0, 0);
                amount.setValueAtTime(tMid, 15);
                amount.setValueAtTime(t1, 0);

                for (var ak2 = 1; ak2 <= amount.numKeys; ak2++) {
                    amount.setInterpolationTypeAtKey(ak2, KeyframeInterpolationType.LINEAR);
                }
            }
        }

        // Scale (starts at tQuarter, eased fast→slow) on layer Transform
        var scaleProp = targetLayer.property("Transform").property("Scale");
        if (scaleProp) {
            for (var sk = scaleProp.numKeys; sk >= 1; sk--) {
                var skt = scaleProp.keyTime(sk);
                if (skt >= tQuarter && skt <= t1) scaleProp.removeKey(sk);
            }

            var currentScale = scaleProp.value;
            var sx = currentScale[0] || 100;
            var sy = currentScale[1] || sx;
            var sz = (currentScale.length > 2) ? currentScale[2] : sx;
            var startScale = [sx * 1.5, sy * 1.5, sz * 1.5];
            var endScale = [sx, sy, sz];

            scaleProp.setValueAtTime(tQuarter, startScale);
            scaleProp.setValueAtTime(t1, endScale);

            var keyCount = scaleProp.numKeys;
            var k1 = keyCount - 1;
            var k2 = keyCount;

            if (k1 >= 1 && k2 >= 1) {
                scaleProp.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
                scaleProp.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

                var easeInX = new KeyframeEase(75, 0.1);
                var easeInY = new KeyframeEase(75, 0.1);
                var easeInZ = new KeyframeEase(75, 0.1);

                var easeOutX = new KeyframeEase(0.1, 75);
                var easeOutY = new KeyframeEase(0.1, 75);
                var easeOutZ = new KeyframeEase(0.1, 75);

                scaleProp.setTemporalEaseAtKey(k1, [easeInX, easeInY, easeInZ], [easeInX, easeInY, easeInZ]);
                scaleProp.setTemporalEaseAtKey(k2, [easeOutX, easeOutY, easeOutZ], [easeOutX, easeOutY, easeOutZ]);
            }
        }

        // Rotation updated to current + 30 -> current
        var rotationProp = targetLayer.property("Transform").property("Rotation");
        if (rotationProp) {
            // Remove any existing keys in our time range to avoid duplicates
            for (var rk = rotationProp.numKeys; rk >= 1; rk--) {
                var rkt = rotationProp.keyTime(rk);
                if (rkt >= t0 && rkt <= t1) rotationProp.removeKey(rk);
            }

            // Capture current rotation value once
            var currentRot = rotationProp.value;

            // Set keyframes: current + 30 at start, current at end
            rotationProp.setValueAtTime(t0, currentRot - 180);
            rotationProp.setValueAtTime(t1, currentRot);

            var rKeyCount = rotationProp.numKeys;
            var rk1 = rKeyCount - 1;
            var rk2 = rKeyCount;

            if (rk1 >= 1 && rk2 >= 1) {
                rotationProp.setInterpolationTypeAtKey(rk1, KeyframeInterpolationType.BEZIER);
                rotationProp.setInterpolationTypeAtKey(rk2, KeyframeInterpolationType.BEZIER);

                var easeInRot = new KeyframeEase(75, 0.1);   // fast start
                var easeOutRot = new KeyframeEase(0.1, 75);  // slow finish

                rotationProp.setTemporalEaseAtKey(rk1, [easeInRot], [easeInRot]);
                rotationProp.setTemporalEaseAtKey(rk2, [easeOutRot], [easeOutRot]);
            }
        }

        app.endUndoGroup();
}

function lensFlareTransition() {
        app.beginUndoGroup("Lens Flare Transition");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        var selLayers = comp.selectedLayers;
        if (selLayers.length < 1) {
            alert("Please select a layer.");
            return;
        }

        var baseLayer = selLayers[0];
        var cutTime = comp.time;       // transition trigger
        var t0 = cutTime - 0.25;       // start 0.25s before
        var t1 = cutTime + 0.25;       // end 0.25s after

        // Create adjustment layer
        var adj = comp.layers.addSolid([0, 0, 0], "Lens Flare Transition", comp.width, comp.height, comp.pixelAspect, comp.duration);
        adj.adjustmentLayer = true;
        adj.moveBefore(baseLayer);

        // Trim in/out points so the layer only exists during the transition
        adj.inPoint = t0;
        adj.outPoint = t1;

        // Add Lens Flare effect
        var flare = adj.Effects.addProperty("ADBE Lens Flare");
        if (!flare) {
            alert("Failed to add Lens Flare effect.");
            app.endUndoGroup();
            return;
        }

        // Animate flare brightness (up to 220%)
        var brightness = flare.property("Flare Brightness");
        brightness.setValueAtTime(t0, 0);
        brightness.setValueAtTime(cutTime - 0.1, 100);
        brightness.setValueAtTime(cutTime, 220); // peak at cut
        brightness.setValueAtTime(t1, 0);

        // Animate flare center sweep fully offscreen
        var center = flare.property("Flare Center");
        if (center) {
            var yMid = comp.height * 0.5;
            center.setValueAtTime(t0, [comp.width * -0.2, yMid]);   // -20% offscreen left
            center.setValueAtTime(cutTime, [comp.width * 0.5, yMid]); // center
            center.setValueAtTime(t1, [comp.width * 1.2, yMid]);   // 120% offscreen right
        }

        // Use 105mm Prime lens type (enum value 3)
        var flareType = flare.property("Lens Type");
        if (flareType) flareType.setValue(3);

        app.endUndoGroup();
    }

function offsetTransition() {
        app.beginUndoGroup("Offset Transition");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        var selLayers = comp.selectedLayers;
        if (selLayers.length < 1) {
            alert("Please select a layer.");
            return;
        }

        var baseLayer = selLayers[0];
        var cutTime = comp.time;       // transition trigger
        var t0 = cutTime - 0.25;       // start 0.25s before
        var t1 = cutTime + 0.25;       // end 0.25s after

        // Create adjustment layer
        var adj = comp.layers.addSolid([0, 0, 0], "Offset Transition", comp.width, comp.height, comp.pixelAspect, comp.duration);
        adj.adjustmentLayer = true;
        adj.moveBefore(baseLayer);

        // Trim in/out points to match transition window
        adj.inPoint = t0;
        adj.outPoint = t1;

        // Add Offset effect
        var offset = adj.Effects.addProperty("ADBE Offset");
        if (!offset) {
            alert("Failed to add Offset effect.");
            app.endUndoGroup();
            return;
        }

        // Animate Shift Center To: center → far right
        var shiftCenter = offset.property("Shift Center To");
        if (shiftCenter) {
            var xMid = comp.width * 0.5;
            var yMid = comp.height * 0.5;

            shiftCenter.setValueAtTime(t0, [xMid, yMid]);          // start at center
            shiftCenter.setValueAtTime(t1, [xMid * 3, yMid]);      // end at 3× width

            // Apply easing: fast start, slow end
            var kfs = shiftCenter.keyFrames;
            if (shiftCenter.numKeys >= 2) {
                shiftCenter.setInterpolationTypeAtKey(1, KeyframeInterpolationType.LINEAR);
                shiftCenter.setInterpolationTypeAtKey(2, KeyframeInterpolationType.LINEAR);
                shiftCenter.setTemporalEaseAtKey(2, [new KeyframeEase(0, 75)], [new KeyframeEase(0, 75)]);
            }
        }

        // Add CC Force Motion Blur effect (default settings)
        var blur = adj.Effects.addProperty("CC Force Motion Blur");

        app.endUndoGroup();
    }

function rotationTransition() {
        app.beginUndoGroup("Rotation Transition");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        var selLayers = comp.selectedLayers;
        if (selLayers.length < 1) {
            alert("Please select a layer.");
            return;
        }

        var baseLayer = selLayers[0];
        var cutTime = comp.time;
        var t0 = cutTime - 0.25; // start
        var tMid = cutTime;      // halfway point
        var t1 = cutTime + 0.25; // end

        // Create adjustment layer
        var adj = comp.layers.addSolid([0, 0, 0], "Rotation Transition", comp.width, comp.height, comp.pixelAspect, comp.duration);
        adj.adjustmentLayer = true;
        adj.moveBefore(baseLayer);
        adj.inPoint = t0;
        adj.outPoint = t1;

        // Add Motion Tile effect first
        var motionTile = adj.Effects.addProperty("Motion Tile");
        if (motionTile) {
            var outWidth = motionTile.property("Output Width");
            var outHeight = motionTile.property("Output Height");
            var mirrorEdges = motionTile.property("Mirror Edges");
            if (outWidth) outWidth.setValue(200);
            if (outHeight) outHeight.setValue(200);
            if (mirrorEdges) mirrorEdges.setValue(true);
        }

        // Add Transform effect
        var transform = adj.Effects.addProperty("Transform");
        if (!transform) {
            alert("Failed to add Transform effect.");
            app.endUndoGroup();
            return;
        }

        // Animate Scale
        var scale = transform.property("Scale");
        if (scale) {
            scale.setValueAtTime(t0, 100);
            scale.setValueAtTime(t0 + 0.1, 150);
            scale.setValueAtTime(t1, 100);

            scale.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
            scale.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);
            scale.setInterpolationTypeAtKey(3, KeyframeInterpolationType.BEZIER);
        }

        // Replace previous Rotation block with this (two-key spike-style easing)
var rotation = transform.property("Rotation");
if (rotation) {
    // Two keyframes only: start and end
    rotation.setValueAtTime(t0, 0);
    rotation.setValueAtTime(t1, 360); // one full turn

    rotation.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
    rotation.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);

    // Easing to mimic: start slow -> quick spike -> slow finish
    // KeyframeEase(speed, influence)
    // Start: gentle incoming, very strong outgoing speed (small outgoing influence)
    var startIn  = new KeyframeEase(60, 0.1);    // gentle initial ramp
    var startOut = new KeyframeEase(0.1, 60);   // strong outgoing speed -> spike

    // End: strong incoming influence (slow down), small outgoing (not used much)
    var endIn    = new KeyframeEase(0.1, 100);   // high incoming influence -> decelerate
    var endOut   = new KeyframeEase(0.1, 75);    // small outgoing safety value

    rotation.setTemporalEaseAtKey(1, [startIn],  [startOut]);
    rotation.setTemporalEaseAtKey(2, [endIn],    [endOut]);
}





        // Add CC Radial Blur
        var radialBlur = adj.Effects.addProperty("CC Radial Blur");
        if (radialBlur) {
            var amount = radialBlur.property("Amount");
            if (amount) {
                amount.setValueAtTime(t0, 0);   // start
                amount.setValueAtTime(tMid, 15); // peak blur at halfway
                amount.setValueAtTime(t1, 0);   // fade out at end
            }
        }

        app.endUndoGroup();
    }

function zoomPushTransition() {
        app.beginUndoGroup("Zoom Push Transition");

        var comp = app.project.activeItem;
        if (!(comp && comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        var selLayers = comp.selectedLayers;
        if (selLayers.length < 1) {
            alert("Please select a layer.");
            return;
        }

        var baseLayer = selLayers[0];
        var cutTime = comp.time;
        var t0 = cutTime - 0.25;
        var t1 = cutTime + 0.25;
        var frameDur = 1 / comp.frameRate;

        // Create adjustment layer
        var adj = comp.layers.addSolid([0, 0, 0], "Zoom Push Transition", comp.width, comp.height, comp.pixelAspect, comp.duration);
        adj.adjustmentLayer = true;
        adj.moveBefore(baseLayer);
        adj.inPoint = t0;
        adj.outPoint = t1;

        // Add Motion Tile effect first
        var motionTile = adj.Effects.addProperty("Motion Tile");
        if (motionTile) {
            var outWidth = motionTile.property("Output Width");
            var outHeight = motionTile.property("Output Height");
            if (outWidth) outWidth.setValue(200);
            if (outHeight) outHeight.setValue(200);
        }

        // Add Transform effect
        var transform = adj.Effects.addProperty("Transform");
        if (!transform) {
            alert("Failed to add Transform effect.");
            app.endUndoGroup();
            return;
        }

        // Animate Scale Width & Height in sync
        var scaleWidth = transform.property("Scale Width");
        var scaleHeight = transform.property("Scale Height");

        if (scaleWidth && scaleHeight) {
            // Start
            scaleWidth.setValueAtTime(t0, 100);
            scaleHeight.setValueAtTime(t0, 100);

            // Halfway
            scaleWidth.setValueAtTime(cutTime, 300);
            scaleHeight.setValueAtTime(cutTime, 300);

            // Next frame after halfway
            scaleWidth.setValueAtTime(cutTime + frameDur, 50);
            scaleHeight.setValueAtTime(cutTime + frameDur, 50);

            // End
            scaleWidth.setValueAtTime(t1, 100);
            scaleHeight.setValueAtTime(t1, 100);

            // Ease: fast start, slow end
            for (var k = 1; k <= scaleWidth.numKeys; k++) {
                scaleWidth.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
                scaleWidth.setTemporalEaseAtKey(k, [new KeyframeEase(0, 75)], [new KeyframeEase(0, 75)]);
            }
            for (var k = 1; k <= scaleHeight.numKeys; k++) {
                scaleHeight.setInterpolationTypeAtKey(k, KeyframeInterpolationType.LINEAR);
                scaleHeight.setTemporalEaseAtKey(k, [new KeyframeEase(0, 75)], [new KeyframeEase(0, 75)]);
            }
        }

        // Add CC Radial Blur effect
        var radialBlur = adj.Effects.addProperty("CC Radial Blur");
        if (radialBlur) {
            var amount = radialBlur.property("Amount");
            if (amount) {
                amount.setValueAtTime(t0, -4);       // start
                amount.setValueAtTime(cutTime, -15); // midpoint stronger blur
                amount.setValueAtTime(t1, 0);        // fade out at end
            }
        }

        app.endUndoGroup();
    }

function TextOnCompName() {
    app.beginUndoGroup("Text On Comp Name");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        app.endUndoGroup();
        return;
    }

    // --- Generate random 6 letters ---
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var randStr = "";
    for (var i = 0; i < 6; i++) {
        randStr += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // --- New comp name ---
    var newCompName = "text" + randStr + "_txt";

    // Create new comp
    var subComp = app.project.items.addComp(newCompName, 1920, 1080, 1, comp.duration, comp.frameRate);

    // Place subComp above selected layer (if any)
    var selLayers = comp.selectedLayers;
    if (selLayers.length > 0) {
        var refLayer = selLayers[0];
        var subLayer = comp.layers.add(subComp);
        subLayer.moveBefore(refLayer);
        subLayer.collapseTransformation = true;
    } else {
        comp.layers.add(subComp);
    }

    // --- Violator BG ---
    var bg = subComp.layers.addShape();
    bg.name = "Violator BG";

    var rect = bg.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rect.property("Size").expression =
        "var pad = 50; var t = thisComp.layer('Violator Text'); var r = t.sourceRectAtTime(time,false); [r.width + pad*2, r.height + pad*2];";
    rect.property("Position").expression =
        "var t = thisComp.layer('Violator Text'); var r = t.sourceRectAtTime(time,false); [r.left + r.width/2, r.top + r.height/2];";
    rect.property("Roundness").setValue(75);

    // Fill color #7B4C9C
    var fill = bg.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue([123/255, 76/255, 156/255]);

	// Stroke (white outline)
	var stroke = bg.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
	stroke.property("Color").setValue([1,1,1]); // white
	stroke.property("Stroke Width").setValue(5); // adjust thickness as needed

    // --- Violator Text ---
    var textLayer = subComp.layers.addText("TEMP");
    textLayer.name = "Violator Text";

    // Expression: dynamically derive text from comp name
    // - Cut at underscore
    // - Replace backslashes with new lines
    var expr = 
        "var nm = thisComp.name;\n" +
        "var idx = nm.indexOf('_');\n" +
        "if (idx !== -1) nm = nm.substring(0, idx);\n" +
        "nm.replace(/\\\\/g, '\\r');";
    textLayer.property("Source Text").expression = expr;

    app.endUndoGroup();
}

function createMasterNull() {
    app.beginUndoGroup("Create Master Null");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        app.endUndoGroup();
        return;
    }

    var selLayers = comp.selectedLayers;
    if (selLayers.length < 1) {
        alert("Please select one or more layers.");
        app.endUndoGroup();
        return;
    }

    // Collect positions of unparented layers
    var totalPos = [0, 0, 0];
    var count = 0;
    var earliestInPoint = selLayers[0].inPoint;

    for (var i = 0; i < selLayers.length; i++) {
        var lyr = selLayers[i];

        // Track earliest inPoint
        if (lyr.inPoint < earliestInPoint) {
            earliestInPoint = lyr.inPoint;
        }

        // Skip if no Position property
        var posProp = lyr.property("Transform").property("Position");
        if (!posProp) continue;

        if (lyr.parent === null) {
            var pos = posProp.value;
            totalPos[0] += pos[0];
            totalPos[1] += pos[1];
            totalPos[2] += (pos.length > 2 ? pos[2] : 0);
            count++;
        }
    }

    // If no unparented layers, default to comp center
    var targetPos;
    if (count > 0) {
        targetPos = [totalPos[0]/count, totalPos[1]/count, totalPos[2]/count];
    } else {
        targetPos = [comp.width/2, comp.height/2, 0];
    }

    // Generate random 6-letter suffix
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var suffix = "";
    for (var j = 0; j < 6; j++) {
        suffix += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Create Null
    var nullLayer = comp.layers.addNull();
    nullLayer.name = "Master_" + suffix;

    // Place null above the topmost selected layer
    nullLayer.moveBefore(selLayers[0]);

    // Set position
    nullLayer.property("Transform").property("Position").setValue(targetPos);

    // Set inPoint to earliest among selected layers
    nullLayer.inPoint = earliestInPoint;

    // Add marker at inPoint with comment
    var markerComment = "MASTER FOR: ";
    var maxNames = Math.min(selLayers.length, 5);
    for (var k = 0; k < maxNames; k++) {
        markerComment += selLayers[k].name;
        if (k < maxNames - 1) markerComment += ", ";
    }
    var marker = new MarkerValue(markerComment);
    nullLayer.property("Marker").setValueAtTime(nullLayer.inPoint, marker);

    // Parent selected layers (only if they don’t already have a parent)
    for (var m = 0; m < selLayers.length; m++) {
        var lyr = selLayers[m];
        if (lyr.parent === null) {
            lyr.parent = nullLayer;
        }
    }

    app.endUndoGroup();
}

/**
 * ShowMatchNames
 * Scans the selected effect and displays a UI window with 
 * the Effect Match Name and all internal Property Match Names.
 */
function ShowMatchNames() {
    var comp = app.project.activeItem;
    
    // 1. Basic selection validation
    if (!(comp && comp instanceof CompItem) || comp.selectedLayers.length === 0) {
        alert("Selection Error: Please select a layer first.");
        return;
    }

    var layer = comp.selectedLayers[0];
    var selectedProps = layer.selectedProperties;

    if (selectedProps.length === 0) {
        alert("Selection Error: Please select an Effect in the Effect Controls panel.");
        return;
    }

    // 2. Identify the target
    var targetEffect = selectedProps[0];

    // Check if the property is actually an effect or inside an effect group
    if (targetEffect.elided || !targetEffect.matchName) {
        alert("Selection Error: The selected item does not have a valid Match Name.");
        return;
    }

    // 3. Build the data report
    var report = "EFFECT INFO\n";
    report += "Display Name: " + targetEffect.name + "\n";
    report += "Match Name:   " + targetEffect.matchName + "\n";
    report += "--------------------------------------------------\n\n";
    report += "PROPERTIES LIST\n";
    report += "Format: [Index] Display Name -> Match Name\n";
    report += "--------------------------------------------------\n";

    if (targetEffect.numProperties > 0) {
        for (var i = 1; i <= targetEffect.numProperties; i++) {
            var prop = targetEffect.property(i);
            report += "[" + i + "] " + prop.name + "\n";
            report += "    " + prop.matchName + "\n\n";
        }
    } else {
        report += "No sub-properties found for this selection.";
    }

    // 4. Create UI Window for easy copying
    var win = new Window("dialog", "AE Match Name Mapper");
    win.orientation = "column";
    win.alignChildren = ["fill", "fill"];
    win.spacing = 10;
    win.margins = 15;

    var header = win.add("statictext", undefined, "Select and copy the names below:");
    header.graphics.font = ScriptUI.newFont("Tahoma", "Bold", 13);

    var txt = win.add("edittext", [0, 0, 500, 450], report, {multiline: true, readonly: true});
    
    var btnGroup = win.add("group");
    btnGroup.alignment = "right";
    var closeBtn = btnGroup.add("button", undefined, "Close", {name: "ok"});
    
    closeBtn.onClick = function() {
        win.close();
    };

    win.show();
}

function FadeIn() {
    app.beginUndoGroup("Fade In");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition.");
        app.endUndoGroup();
        return;
    }

    var selLayers = comp.selectedLayers;
    if (selLayers.length < 1) {
        alert("Please select one or more layers.");
        app.endUndoGroup();
        return;
    }

    for (var i = 0; i < selLayers.length; i++) {
        var layer = selLayers[i];
        var opacity = layer.property("Transform").property("Opacity");

        if (opacity) {
            // Add keyframes
            var k1 = opacity.addKey(comp.time);
            var k2 = opacity.addKey(comp.time + 0.5);

            // Assign values
            opacity.setValueAtKey(k1, 0);
            opacity.setValueAtKey(k2, 100);

            // Set interpolation type
            opacity.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
            opacity.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);
        }
    }

    app.endUndoGroup();
}

// SphereCollage — All-in-one ExtendScript (solid hidden when media added)
// Creates SphereCollageComp, subcomps, RotNulls, SubcompScaleControl, keyframes,
// moves items into a folder, and attempts to add the SphereCollageComp to the active comp.
// If a selected item is placed into a subcomp, the random solid in that subcomp is disabled (hidden).

function SphereCollage() {
    if (!app.project) {
        alert("No project open.");
        return;
    }

    app.beginUndoGroup("SphereCollage All-in-One (patched: hide solid when media added)");

    // ---------- Settings ----------
    var compWidth = 3840;
    var compHeight = 2160;
    var compDuration = 20;
    var compFrameRate = (app.project.activeItem && app.project.activeItem instanceof CompItem) ? app.project.activeItem.frameRate : 30;
    var mainCompName = "SphereCollageComp";
    var subPrefix = "Sphere_Sub_";
    var folderName = "SphereCollageComp";
    var subCount = 20;
    var subW = 1920;
    var subH = 1080;
    var radius = Math.min(compWidth, compHeight) * 0.28;
    var center = [1920, 1080, 0];

    // ---------- Helpers ----------
    function randomColor() {
        return [Math.random(), Math.random(), Math.random()];
    }
    function findFolderByName(name) {
        for (var i = 1; i <= app.project.numItems; i++) {
            var it = app.project.item(i);
            if (it instanceof FolderItem && it.name === name) return it;
        }
        return null;
    }
    function findCompByName(name) {
        for (var i = 1; i <= app.project.numItems; i++) {
            var it = app.project.item(i);
            if (it instanceof CompItem && it.name === name) return it;
        }
        return null;
    }
    function applyEasyEase(prop, keyIndex) {
        try {
            var easeIn = new KeyframeEase(0, 33);
            var easeOut = new KeyframeEase(0, 33);
            var dims = (prop.value && prop.value.length) ? prop.value.length : 1;
            var inArr = [];
            var outArr = [];
            for (var d = 0; d < dims; d++) { inArr.push(easeIn); outArr.push(easeOut); }
            prop.setTemporalEaseAtKey(keyIndex, inArr, outArr);
            prop.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
        } catch (e) {}
    }

    // ---------- Create main comp ----------
    var sphereComp = app.project.items.addComp(mainCompName, compWidth, compHeight, 1, compDuration, compFrameRate);

    // Gather selected project items (images/videos) up to subCount
    var sel = app.project.selection;
    var selectedItems = [];
    for (var s = 0; s < sel.length && selectedItems.length < subCount; s++) {
        var it = sel[s];
        if (it instanceof FootageItem || it instanceof CompItem) selectedItems.push(it);
    }

    // ---------- Create subcomps ----------
    var subCompItems = [];
    for (var i = 0; i < subCount; i++) {
        var name = subPrefix + (i + 1);
        var sc = app.project.items.addComp(name, subW, subH, sphereComp.pixelAspect, sphereComp.duration, sphereComp.frameRate);
        // random solid
        var col = randomColor();
        var solid = sc.layers.addSolid(col, "Solid_Color", subW, subH, sc.pixelAspect, sc.duration);
        solid.locked = false;

        // optional selected media
        if (i < selectedItems.length) {
            var projItem = selectedItems[i];
            try {
                var mediaLayer = sc.layers.add(projItem);

                // Determine item dimensions robustly
                var itemW = 0, itemH = 0;
                if (projItem instanceof FootageItem && projItem.mainSource && projItem.mainSource.width) {
                    itemW = projItem.mainSource.width;
                    itemH = projItem.mainSource.height;
                } else if (projItem instanceof CompItem) {
                    itemW = projItem.width;
                    itemH = projItem.height;
                } else {
                    try {
                        var rect = mediaLayer.sourceRectAtTime(0, false);
                        itemW = rect.width;
                        itemH = rect.height;
                    } catch (e) {
                        itemW = subW; itemH = subH;
                    }
                }

                // Fit rules: taller-or-square -> fit to comp height; wider -> fit to comp width
                var scaleFactor;
                if (itemH >= itemW) scaleFactor = (subH / itemH) * 100;
                else scaleFactor = (subW / itemW) * 100;
                mediaLayer.property("Transform").property("Scale").setValue([scaleFactor, scaleFactor]);

                // Place media above the solid
                mediaLayer.moveBefore(solid);

                // IMPORTANT: hide the solid layer when a media item is placed in the subcomp
                try {
                    solid.enabled = false;
                } catch (e) {
                    // fallback: set solid's opacity to 0 if enabled property not available
                    try {
                        solid.property("Transform").property("Opacity").setValue(0);
                    } catch (e2) {}
                }
            } catch (e) {
                // ignore if adding fails
            }
        }

        subCompItems.push(sc);
    }

    // ---------- Add subcomp layers to main comp ----------
    var subLayers = [];
    for (var j = 0; j < subCompItems.length; j++) {
        var layer = sphereComp.layers.add(subCompItems[j]);
        layer.name = subCompItems[j].name;
        layer.threeDLayer = true;
        subLayers.push(layer);
    }

    // ---------- Create Sphere Null ----------
    var sphereNull = sphereComp.layers.addNull();
    sphereNull.name = "Sphere Null";
    sphereNull.threeDLayer = true;
    try { sphereNull.property("Transform").property("Position").setValue(center); } catch (e) {}

    // ---------- Create SubcompScaleControl (3D null) and keyframes ----------
    var controlLayer = null;
    for (var L = 1; L <= sphereComp.numLayers; L++) {
        var ly = sphereComp.layer(L);
        if (ly && ly.name === "SubcompScaleControl") { controlLayer = ly; break; }
    }
    if (!controlLayer) {
        controlLayer = sphereComp.layers.addNull();
        controlLayer.name = "SubcompScaleControl";
    }
    controlLayer.threeDLayer = true;
    try { controlLayer.property("Transform").property("Position").setValue(center); } catch (e) {}

    // Clear existing scale keys in 0-4s range (safe)
    var ctrlScaleProp = controlLayer.property("Transform").property("Scale");
    try {
        for (var k = ctrlScaleProp.numKeys; k >= 1; k--) {
            var kt = ctrlScaleProp.keyTime(k);
            if (kt >= 0 && kt <= 4.001) ctrlScaleProp.removeKey(k);
        }
    } catch (e) {}

    // Add keyframes: 0s -> 20%, 1s -> 30%, 4s -> 20%
    var t0 = 3, t1 = 4, t4 = 5;
    try {
        ctrlScaleProp.setValueAtTime(t0, [20,20,20]);
        ctrlScaleProp.setValueAtTime(t1, [25,25,25]);
        ctrlScaleProp.setValueAtTime(t4, [20,20,20]);
        for (var ki = 1; ki <= ctrlScaleProp.numKeys; ki++) {
            var kt = ctrlScaleProp.keyTime(ki);
            if (Math.abs(kt - t0) < 0.0001 || Math.abs(kt - t1) < 0.0001 || Math.abs(kt - t4) < 0.0001) {
                applyEasyEase(ctrlScaleProp, ki);
            }
        }
    } catch (e) {
        try {
            ctrlScaleProp.setValueAtTime(t0, [20,20]);
            ctrlScaleProp.setValueAtTime(t1, [25,25]);
            ctrlScaleProp.setValueAtTime(t4, [20,20]);
        } catch (e2) {}
    }

    // ---------- Position subcomps on sphere and create RotNulls that cancel Sphere Null rotation ----------
    var goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (var k = 0; k < subLayers.length; k++) {
        var iN = k + 0.5;
        var phi = Math.acos(1 - 2 * (iN / subCount));
        var theta = goldenAngle * k;

        var x = radius * Math.sin(phi) * Math.cos(theta);
        var y = radius * Math.sin(phi) * Math.sin(theta);
        var z = radius * Math.cos(phi);

        // Create RotNull
        var rotNull = sphereComp.layers.addNull();
        rotNull.name = "RotNull_" + (k + 1);
        rotNull.threeDLayer = true;
        rotNull.parent = sphereNull;

        // Set RotNull local position to spherical offset
        try { rotNull.property("Transform").property("Position").setValue([x, y, z]); } catch (e) {}

        // Orientation expression that negates Sphere Null's effective orientation (uses valueAtTime(time))
        var rotNullOrientExpr =
            "var ctrl = thisComp.layer('Sphere Null').transform;\n" +
            "try {\n" +
            "  var por = ctrl.orientation.valueAtTime(time);\n" +
            "  if (por && por.length === 3) {\n" +
            "    [-por[0], -por[1], -por[2]];\n" +
            "  } else {\n" +
            "    var xr = ctrl.xRotation.valueAtTime(time);\n" +
            "    var yr = ctrl.yRotation.valueAtTime(time);\n" +
            "    var zr = ctrl.zRotation.valueAtTime(time);\n" +
            "    [-xr, -yr, -zr];\n" +
            "  }\n" +
            "} catch (err) {\n" +
            "  var xr2 = ctrl.xRotation.valueAtTime(time);\n" +
            "  var yr2 = ctrl.yRotation.valueAtTime(time);\n" +
            "  var zr2 = ctrl.zRotation.valueAtTime(time);\n" +
            "  [-xr2, -yr2, -zr2];\n" +
            "}\n";

        try {
            rotNull.property("Transform").property("Orientation").expression = rotNullOrientExpr;
        } catch (e) {
            try {
                rotNull.property("Transform").property("X Rotation").expression = "-thisComp.layer('Sphere Null').transform.xRotation.valueAtTime(time)";
                rotNull.property("Transform").property("Y Rotation").expression = "-thisComp.layer('Sphere Null').transform.yRotation.valueAtTime(time)";
                rotNull.property("Transform").property("Z Rotation").expression = "-thisComp.layer('Sphere Null').transform.zRotation.valueAtTime(time)";
            } catch (e2) {}
        }

        // Parent subcomp to RotNull and set local position to [0,0,0]
        var subLayer = subLayers[k];
        subLayer.parent = rotNull;
        try { subLayer.property("Transform").property("Position").setValue([0,0,0]); } catch (e) {}

        // Link subcomp scale to SubcompScaleControl via expression
        try {
            subLayer.threeDLayer = true;
            var scaleProp = subLayer.property("Transform").property("Scale");
            try { for (var kk = scaleProp.numKeys; kk >= 1; kk--) scaleProp.removeKey(kk); } catch (e) {}
            var scaleExpr = "var s = thisComp.layer('SubcompScaleControl').transform.scale.valueAtTime(time);\n" +
                            "if (s.length === 3) s; else [s[0], s[1], s[0]];";
            scaleProp.expression = scaleExpr;
        } catch (e) {}

        // Ensure subcomp local rotations are zero
        try {
            subLayer.property("Transform").property("Orientation").setValue([0,0,0]);
            subLayer.property("Transform").property("X Rotation").setValue(0);
            subLayer.property("Transform").property("Y Rotation").setValue(0);
            subLayer.property("Transform").property("Z Rotation").setValue(0);
        } catch (e) {}
    }

    // ---------- Add keyframes to Sphere Null ----------
    try {
        var sScale = sphereNull.property("Transform").property("Scale");
        try { for (var kk = sScale.numKeys; kk >= 1; kk--) { var kt = sScale.keyTime(kk); if (kt >= 0 && kt <= 10.001) sScale.removeKey(kk); } } catch (e) {}
        sScale.setValueAtTime(0, [0,0,0]);
        sScale.setValueAtTime(2, [135,135,135]);
        for (var kidx = 1; kidx <= sScale.numKeys; kidx++) {
            var kt = sScale.keyTime(kidx);
            if (Math.abs(kt - 0) < 0.0001 || Math.abs(kt - 2) < 0.0001) applyEasyEase(sScale, kidx);
        }
    } catch (e) {}

    try {
        var orientProp = sphereNull.property("Transform").property("Orientation");
        try { for (var kk = orientProp.numKeys; kk >= 1; kk--) { var kt = orientProp.keyTime(kk); if (kt >= 0 && kt <= 20.001) orientProp.removeKey(kk); } } catch (e) {}
        // Set orientation keyframes at 0s, 4s, 18s
        orientProp.setValueAtTime(0, [0,0,180]);
        orientProp.setValueAtTime(4, [0,0,0]);      // moved to 4s
        orientProp.setValueAtTime(18, [0,28,247]);  // moved to 18s
        // Apply AE-style default ease to all orientation keys
        for (var ki = 1; ki <= orientProp.numKeys; ki++) {
            applyEasyEase(orientProp, ki);
        }
    } catch (e) {
        try {
            var xr = sphereNull.property("Transform").property("X Rotation");
            var yr = sphereNull.property("Transform").property("Y Rotation");
            var zr = sphereNull.property("Transform").property("Z Rotation");
            try { for (var kk = xr.numKeys; kk >= 1; kk--) { var kt = xr.keyTime(kk); if (kt >= 0 && kt <= 20.001) xr.removeKey(kk); } } catch (e) {}
            // Match the orientation keyframes using separate channels
            xr.setValueAtTime(0, 0);  xr.setValueAtTime(4, 0);  xr.setValueAtTime(18, 0);
            yr.setValueAtTime(0, 0);  yr.setValueAtTime(4, 0);  yr.setValueAtTime(18, 28);
            zr.setValueAtTime(0, 180); zr.setValueAtTime(4, 0);  zr.setValueAtTime(18, 247);
            var props = [xr, yr, zr];
            for (var p = 0; p < props.length; p++) {
                var pr = props[p];
                for (var kk = 1; kk <= pr.numKeys; kk++) {
                    applyEasyEase(pr, kk);
                }
            }
        } catch (e2) {}
    }


    // ---------- Move comps into folder ----------
    var targetFolder = findFolderByName(folderName);
    if (!targetFolder) targetFolder = app.project.items.addFolder(folderName);

    try { sphereComp.parentFolder = targetFolder; } catch (e) {}
    for (var m = 0; m < subCompItems.length; m++) {
        try { subCompItems[m].parentFolder = targetFolder; } catch (e) {}
    }

    // ---------- Attempt to add SphereCollageComp to active comp ----------
    var active = app.project.activeItem;
    if (active && active instanceof CompItem) {
        if (active !== sphereComp) {
            try {
                var addedLayer = active.layers.add(sphereComp);
                addedLayer.name = sphereComp.name;
                try {
                    var fitScale = (active.width / sphereComp.width) * 100;
                    var scaleProp = addedLayer.property("Transform").property("Scale");
                    if (scaleProp) {
                        if (addedLayer.threeDLayer) scaleProp.setValue([fitScale, fitScale, fitScale]);
                        else scaleProp.setValue([fitScale, fitScale]);
                    }
                } catch (e) {}
            } catch (err) {}
        }
    }

    app.endUndoGroup();
    alert("SphereCollageComp created. Adjust animation using the Sphere Null layer.");
};

function CrossPhotosCollage() {
    app.beginUndoGroup("Cross Photos Collage");

    var proj = app.project;
    var selItems = proj.selection;

    // DEMO MODE: if nothing selected, generate 10 random solids
    if (selItems.length < 1) {
        alert("No items selected. Running demo mode with 10 placeholder solids.");
        selItems = [];
        for (var d = 0; d < 10; d++) {
            var r = Math.random();
            var g = Math.random();
            var b = Math.random();
            var solid = proj.items.addSolid([r,g,b], "DemoSolid_" + d, 1920, 1080, 1, 30);
            selItems.push(solid);
        }
    }

    // Validate selection
    for (var i = 0; i < selItems.length; i++) {
        if (!(selItems[i] instanceof FootageItem) && !(selItems[i] instanceof SolidSource)) {
            alert("Selection must only contain photos/videos.");
            app.endUndoGroup();
            return;
        }
    }

    var timestamp = new Date().getTime();

    // Mother comp (4K)
    var motherCompName = "Cross Photos Mother Comp " + timestamp;
    var motherComp = proj.items.addComp(motherCompName, 3840, 2160, 1, 30, 30);

    // Border subcomp
    var borderComp = proj.items.addComp("border", 1920, 1080, 1, 30, 30);
    var borderShape = borderComp.layers.addShape();
    borderShape.name = "Border Shape";

    var rectGroup = borderShape.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rectGroup.property("Size").setValue([1920,1080]);
    rectGroup.property("Position").setValue([0,0]); // centered at 0,0

    var stroke = borderShape.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([1,1,1]); // white
    stroke.property("Stroke Width").setValue(100); // thick border

    var fill = borderShape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.enabled = false;

    // Create Bin folder
    var binFolder = proj.items.addFolder(motherCompName);

    // Move comps into Bin
    motherComp.parentFolder = binFolder;
    borderComp.parentFolder = binFolder;

    // Loop through items
    for (var i = 0; i < selItems.length; i++) {
        var footage = selItems[i];

        // Subcomp for each photo
        var subComp = proj.items.addComp("crossPhotoSubcomp_" + i, 1920, 1080, 1, 30, 30);
        subComp.parentFolder = binFolder;

        // Add footage
        var footageLayer = subComp.layers.add(footage);
        var scaleFactor = (1920 / footage.width) * 100;
        footageLayer.property("Transform").property("Scale").setValue([scaleFactor, scaleFactor]);

        // Add border
        subComp.layers.add(borderComp);

        // Add subcomp to mother comp
        var subLayer = motherComp.layers.add(subComp);

        // Add drop shadow effect
        var shadow = subLayer.property("Effects").addProperty("ADBE Drop Shadow");
        shadow.property("Opacity").setValue(75);
        shadow.property("Direction").setValue(135);
        shadow.property("Distance").setValue(20);
        shadow.property("Softness").setValue(50);

        // Random rotation between -10 and 10
        var randRot = (Math.random() * 20) - 10;
        subLayer.property("Transform").property("Rotation").setValue(randRot);

        // Animate based on order
        var idx = i + 1;
        var delay = (i * 0.25); // stagger start times

        if (idx % 5 === 1) { // center bottom → center
            subLayer.property("Transform").property("Scale").setValue([50,50]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay, [1920, 3000]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay+1, [1920,1080]);

            // === Flourish for FIRST photo only ===
            if (i === 0) {
                subLayer.threeDLayer = true; // enable 3D

                // X Rotation: -90 → 0
                var yRot = subLayer.property("Transform").property("Y Rotation");
                yRot.setValueAtTime(delay, -180);
                yRot.setValueAtTime(delay+1, 0);

                // Color Balance (HLS)
                var hls = subLayer.property("Effects").addProperty("Color Balance (HLS)");
                var lightness = hls.property("Lightness");
                lightness.setValueAtTime(delay, 100);
                lightness.setValueAtTime(delay+0.5, 0);

                // Two CC Light Sweeps
                var sweep1 = subLayer.property("Effects").addProperty("CC Light Sweep");
                sweep1.property("CC Light Sweep-0005").setValue(200);
                sweep1.property("Center").setValueAtTime(delay+1.00, [0.5,1080]);
                sweep1.property("Center").setValueAtTime(delay+1.75, [3840,1080]);

                var sweep2 = subLayer.property("Effects").addProperty("CC Light Sweep");
                sweep2.property("CC Light Sweep-0005").setValue(100);
                sweep2.property("Center").setValueAtTime(delay+1.15, [0,1080]);
                sweep2.property("Center").setValueAtTime(delay+1.95, [3840,1080]);
				
				var scaleProp = subLayer.property("Transform").property("Scale");

				// For the 1st photo layer (subLayer)
				var scaleProp = subLayer.property("Transform").property("Scale");

				// Scale keyframes
				scaleProp.setValueAtTime(0, [75,75]);   // 0s → 75%
				scaleProp.setValueAtTime(1, [75,75]);   // hold at 75% until 1s
				scaleProp.setValueAtTime(2, [50,50]);   // 2s → 50%

				// Apply Easy Ease Out (fast start, slow end)
				for (var k = 1; k <= scaleProp.numKeys; k++) {
					scaleProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER);

					// Each dimension needs its own KeyframeEase object
					var easeIn = [new KeyframeEase(0,75), new KeyframeEase(0,75), new KeyframeEase(0,75)];
					var easeOut = [new KeyframeEase(0,25), new KeyframeEase(0,25), new KeyframeEase(0,25)];

					scaleProp.setTemporalEaseAtKey(k, easeIn, easeOut);
				}

            }
        }
        else if (idx % 5 === 2) { // left
            subLayer.property("Transform").property("Scale").setValue([40,40]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay, [-1000,1080]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay+1, [1080,1080]);
        }
        else if (idx % 5 === 3) { // bottom side
            subLayer.property("Transform").property("Scale").setValue([40,40]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay, [1920,3000]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay+1, [1920,1520]);
        }
        else if (idx % 5 === 4) { // top side
            subLayer.property("Transform").property("Scale").setValue([40,40]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay, [1920,-1000]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay+1, [1920,640]);
        }
        else if (idx % 5 === 0) { // right
            subLayer.property("Transform").property("Scale").setValue([40,40]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay, [5000,1080]);
            subLayer.property("Transform").property("Position").setValueAtTime(delay+1, [2700,1080]);
        }

        // Easy Ease Out (fast start, slow end)
        var posProp = subLayer.property("Transform").property("Position");
        for (var k = 1; k <= posProp.numKeys; k++) {
            posProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER);
            posProp.setTemporalEaseAtKey(k, [new KeyframeEase(0,75)], [new KeyframeEase(0,25)]);
        }
    }

    // === Add Mother Comp on top of currently selected layer in active comp ===
    if (proj.activeItem instanceof CompItem && proj.activeItem.selectedLayers.length > 0) {
        var targetLayer = proj.activeItem.selectedLayers[0];
        var motherLayer = proj.activeItem.layers.add(motherComp);
        motherLayer.moveBefore(targetLayer);
        motherLayer.startTime = proj.activeItem.time; // align start to current time
    }

    app.endUndoGroup();
}

function FerrisWheelCollage() {
    app.beginUndoGroup("Ferris Wheel Collage");

    var proj = app.project;
    var selItems = proj.selection;

    // Validate selection
    if (selItems.length < 1) {
        alert("Please select at least one footage item or comp in the Project panel.");
        app.endUndoGroup();
        return;
    }
    for (var i = 0; i < selItems.length; i++) {
        if (!(selItems[i] instanceof FootageItem) && !(selItems[i] instanceof CompItem)) {
            alert("Selection must only contain photos, videos, or comps.");
            app.endUndoGroup();
            return;
        }
    }

    var timestamp = new Date().getTime();

    // Mother comp (4K, 1 min)
    var motherCompName = "FerrisWheelCollage_" + timestamp;
    var motherComp = proj.items.addComp(motherCompName, 3840, 2160, 1, 60, 30);

    // Create Bin folder
    var binFolder = proj.items.addFolder(motherCompName);
    motherComp.parentFolder = binFolder;

    // Stroke comp (gold stroke, 1 min)
    var strokeComp = proj.items.addComp("FerrisWheelStroke", 1920, 1080, 1, 60, 30);
    strokeComp.parentFolder = binFolder;

    var strokeShape = strokeComp.layers.addShape();
    strokeShape.name = "GoldStroke";

    var rectGroup = strokeShape.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rectGroup.property("Size").setValue([1920,1080]);
    rectGroup.property("Position").setValue([0,0]); // at 0,0
    rectGroup.property("Roundness").setValue(80);

    var stroke = strokeShape.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Stroke Width").setValue(20);
    stroke.property("Color").setValue([1,0.84,0]); // gold

    var numItems = selItems.length;
    var radius = 1200; // circle radius (further spacing)
    var centerX = 1920;
    var centerY = 1080;

    var subLayers = [];

    // Create subcomps and arrange in circle
    for (var i = 0; i < numItems; i++) {
        var footage = selItems[i];

        // Subcomp (1 min)
        var subComp = proj.items.addComp("FerrisWheelSubcomp_" + i, 1920, 1080, 1, 60, 30);
        subComp.parentFolder = binFolder;

        // Add footage
        var footageLayer = subComp.layers.add(footage);
        var scaleFactor = (1920 / footage.width) * 100;
        footageLayer.property("Transform").property("Scale").setValue([scaleFactor, scaleFactor]);

        // Rounded rectangle mask (fill only)
        var maskShape = subComp.layers.addShape();
        maskShape.name = "RoundedMask";

        var maskRect = maskShape.property("Contents").addProperty("ADBE Vector Shape - Rect");
        maskRect.property("Size").setValue([1920,1080]);
        maskRect.property("Position").setValue([0,0]); // at 0,0
        maskRect.property("Roundness").setValue(80);

        var fill = maskShape.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill.property("Color").setValue([1,1,1]); // solid white fill

        // Use mask as track matte
        footageLayer.trackMatteType = TrackMatteType.ALPHA;

        // Add stroke comp on top
        subComp.layers.add(strokeComp);

        // Add subcomp to mother comp
        var subLayer = motherComp.layers.add(subComp);
        subLayer.threeDLayer = true;

        // Position in circle
        var angle = (i / numItems) * 2 * Math.PI;
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        subLayer.property("Transform").property("Position").setValue([x, y, 0]);

        // Rotate sideways (Y=90)
        subLayer.property("Transform").property("Y Rotation").setValue(90);

        // Z Orientation so it spikes outward (perpendicular to center)
        var deg = angle * 180 / Math.PI;
        subLayer.property("Transform").property("Orientation").setValue([0, 0, deg + 90]);

        subLayers.push(subLayer);
    }

    // Add central null
    var nullLayer = motherComp.layers.addNull();
    nullLayer.name = "FerrisWheel_Null";
    nullLayer.threeDLayer = true;
    nullLayer.property("Transform").property("Position").setValue([centerX, centerY, 0]);

    // Parent all subcomps to null
    for (var k = 0; k < subLayers.length; k++) {
        subLayers[k].parent = nullLayer;
    }

    // === Null controller modifications ===
    // Scale animation: 0 → 100 over 1.5s, eased
    var scaleProp = nullLayer.property("Transform").property("Scale");
    scaleProp.setValueAtTime(0, [0,0,0]);
    scaleProp.setValueAtTime(1.5, [50,50,50]);

    for (var k = 1; k <= scaleProp.numKeys; k++) {
        scaleProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER);
        var easeIn = [new KeyframeEase(0,75), new KeyframeEase(0,75), new KeyframeEase(0,75)];
        var easeOut = [new KeyframeEase(0,25), new KeyframeEase(0,25), new KeyframeEase(0,25)];
        scaleProp.setTemporalEaseAtKey(k, easeIn, easeOut);
    }

    // Orientation and Y Rotation
    nullLayer.property("Transform").property("Orientation").setValue([344,311,45]);
    nullLayer.property("Transform").property("Y Rotation").setValue(-26);

    // Animate Z Rotation: 0x → 1x over 15s, loopOut()
    var zRot = nullLayer.property("Transform").property("Z Rotation");
    zRot.setValueAtTime(0, 0);
    zRot.setValueAtTime(15, 360); // 1 full rotation in 15s
    zRot.expression = "loopOut()"; // continuous loop

    // === Add Mother Comp on top of currently selected layer in active comp ===
    if (proj.activeItem instanceof CompItem && proj.activeItem.selectedLayers.length > 0) {
        var targetLayer = proj.activeItem.selectedLayers[0];
        var motherLayer = proj.activeItem.layers.add(motherComp);
        motherLayer.moveBefore(targetLayer);
        motherLayer.startTime = proj.activeItem.time; // align start to current time
    }

    app.endUndoGroup();
}

function CarouselCollage() {
    app.beginUndoGroup("Carousel Collage");

    var proj = app.project;
    var selItems = proj.selection;

    // Validate selection
    if (selItems.length < 1) {
        alert("Please select at least one footage item or comp in the Project panel.");
        app.endUndoGroup();
        return;
    }
    for (var i = 0; i < selItems.length; i++) {
        if (!(selItems[i] instanceof FootageItem) && !(selItems[i] instanceof CompItem)) {
            alert("Selection must only contain photos, videos, or comps.");
            app.endUndoGroup();
            return;
        }
    }

    var timestamp = new Date().getTime();

    // Mother comp (4K, 1 min)
    var motherCompName = "CarouselCollage_" + timestamp;
    var motherComp = proj.items.addComp(motherCompName, 3840, 2160, 1, 60, 30);

    // Create Bin folder
    var binFolder = proj.items.addFolder(motherCompName);
    motherComp.parentFolder = binFolder;

    var numItems = selItems.length;
    var radius = 600; // circle radius for 2D layout
    var centerX = 1920;
    var centerY = 1080;

    var subLayers = [];

    // Create subcomps and arrange in circle
    for (var i = 0; i < numItems; i++) {
        var footage = selItems[i];

        // Subcomp (1 min)
        var subComp = proj.items.addComp("CarouselSubcomp_" + i, 1920, 1080, 1, 60, 30);
        subComp.parentFolder = binFolder;

        // Add footage
        var footageLayer = subComp.layers.add(footage);
        var scaleFactor = (1920 / footage.width) * 100;
        footageLayer.property("Transform").property("Scale").setValue([scaleFactor, scaleFactor]);

        // Add subcomp to mother comp
        var subLayer = motherComp.layers.add(subComp);

        // Position in circle (2D)
        var angle = (i / numItems) * 2 * Math.PI;
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);
        subLayer.property("Transform").property("Position").setValue([x, y]);

        // Scale animation: 0 → 25% over 2s, eased (3 dimensions)
        var scaleProp = subLayer.property("Transform").property("Scale");
        scaleProp.setValueAtTime(0, [0,0,0]);
        scaleProp.setValueAtTime(2, [25,25,25]);

        for (var k = 1; k <= scaleProp.numKeys; k++) {
            scaleProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER);
            var easeIn = [new KeyframeEase(0,75), new KeyframeEase(0,75), new KeyframeEase(0,75)];
            var easeOut = [new KeyframeEase(0,25), new KeyframeEase(0,25), new KeyframeEase(0,25)];
            scaleProp.setTemporalEaseAtKey(k, easeIn, easeOut);
        }

        subLayers.push(subLayer);
    }

    // Add central null
    var nullLayer = motherComp.layers.addNull();
    nullLayer.name = "Carousel_Null";
    nullLayer.property("Transform").property("Position").setValue([centerX, centerY]);

    // Parent all subcomps to null
    for (var k = 0; k < subLayers.length; k++) {
        subLayers[k].parent = nullLayer;

        // Expression to negate null rotation (stay upright)
        subLayers[k].property("Transform").property("Rotation").expression =
            "var ctrl = thisComp.layer('Carousel_Null');\n" +
            "-ctrl.transform.rotation;";
    }

    // Animate Rotation: 0 → 360 over 10s, loopOut()
    var rot = nullLayer.property("Transform").property("Rotation");
    rot.setValueAtTime(0, 0);
    rot.setValueAtTime(10, 360); // one full rotation in 10s
    rot.expression = "loopOut()"; // continuous loop

    // === Add Mother Comp on top of currently selected layer in active comp ===
    if (proj.activeItem instanceof CompItem && proj.activeItem.selectedLayers.length > 0) {
        var targetLayer = proj.activeItem.selectedLayers[0];
        var motherLayer = proj.activeItem.layers.add(motherComp);
        motherLayer.moveBefore(targetLayer);
        motherLayer.startTime = proj.activeItem.time; // align start to current time
    }

    app.endUndoGroup();
}

function FilmstripCollageMaker() {
    app.beginUndoGroup("Filmstrip Collage Maker");

    var proj = app.project;
    var selItems = proj.selection;

    if (selItems.length < 1) {
        alert("Please select one or more footage items (images/videos) in the Project panel.");
        app.endUndoGroup();
        return;
    }

    var timestamp = new Date().getTime();

    // Create main comp (4K, 30s long)
    var mainComp = proj.items.addComp("Film strip " + timestamp, 3840, 2160, 1, 30, 30);

    // === Create Film background comp once ===
    var filmBgComp = proj.items.addComp("Film background", 1920, 1080, 1, 30, 30);

    // White background
    var bg = filmBgComp.layers.addSolid([1,1,1], "Background", 1920, 1080, 1);

    // Side holes: black shapes
    var holesLayer = filmBgComp.layers.addShape();
    holesLayer.name = "Side Holes";
    holesLayer.property("Transform").property("Position").setValue([0,0]);

    var contents = holesLayer.property("Contents");

    // Left hole
    var leftRect = contents.addProperty("ADBE Vector Shape - Rect");
    leftRect.property("Size").setValue([120,880]);
    leftRect.property("Position").setValue([0,540]);
    leftRect.property("Roundness").setValue(250);

    // Right hole
    var rightRect = contents.addProperty("ADBE Vector Shape - Rect");
    rightRect.property("Size").setValue([120,880]);
    rightRect.property("Position").setValue([1920,540]);
    rightRect.property("Roundness").setValue(250);

    // Fill black
    var fill = contents.addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue([0,0,0]);

    // Use holes as alpha inverted matte for background
    holesLayer.moveBefore(bg);
    bg.trackMatteType = TrackMatteType.ALPHA_INVERTED;

    var xOffset = 0;
    var sectionLayers = [];

    // === Loop through selected footage ===
    for (var i = 0; i < selItems.length; i++) {
        var footage = selItems[i];
        if (!(footage instanceof FootageItem)) continue;

        // Create Film section comp (unique per footage)
        var filmSection = proj.items.addComp("Film section_" + i, 1920, 1080, 1, 30, 30);

        // Drop Film background comp inside
        filmSection.layers.add(filmBgComp);

        // Create Container subcomp (1600x900)
        var containerComp = proj.items.addComp("Container_" + i, 1600, 900, 1, 30, 30);

        // Rounded rectangle shape (mask)
        var shapeLayer = containerComp.layers.addShape();
        shapeLayer.name = "Mask Shape";

        var rectGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Shape - Rect");
        rectGroup.property("Size").setValue([1600,900]);
        rectGroup.property("Position").setValue([0,0]); // origin
        rectGroup.property("Roundness").setValue(50);

        var fill2 = shapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
        fill2.property("Color").setValue([1,1,1]);

        // Add footage
        var footageLayer = containerComp.layers.add(footage);

        // Scale to fit width
        var scaleFactor = (1600 / footage.width) * 100;
        footageLayer.property("Transform").property("Scale").setValue([scaleFactor, scaleFactor]);

        // Mask footage with shape layer
        shapeLayer.moveBefore(footageLayer);
        footageLayer.trackMatteType = TrackMatteType.ALPHA;

        // Add Container to Film section
        var containerLayer = filmSection.layers.add(containerComp);
        containerLayer.property("Transform").property("Position").setValue([960,540,0]);

        // Add Film section to main comp
        var sectionLayer = mainComp.layers.add(filmSection);
        sectionLayer.property("Transform").property("Position").setValue([960 + xOffset, 1080, 0]);

        sectionLayers.push(sectionLayer);

        xOffset += 1920;
    }

    // === Animation Step ===
    var masterNull = mainComp.layers.addNull();
    masterNull.name = "Filmstrip_Controller";

    for (var j = 0; j < sectionLayers.length; j++) {
        sectionLayers[j].parent = masterNull;
    }

    var posProp = masterNull.property("Transform").property("Position");
    var startX = 5000; // start at 5000,1080
    var endX = 1080 - ((1920 * selItems.length) - 2160);

    posProp.setValueAtTime(0, [startX, 1080, 0]);
    posProp.setValueAtTime(30, [endX, 1080, 0]);

    // === Add Film strip comp as a layer in the currently active comp ===
    if (proj.activeItem instanceof CompItem) {
        var filmLayer = proj.activeItem.layers.add(mainComp);
        // Move the in-point of the filmstrip layer to the current timeline time
        filmLayer.startTime = proj.activeItem.time;
    }

    app.endUndoGroup();
}

// JJ Quick Tool Extensions
// Adds See Comp, See Layers, and Run Automation

function seeComp(comp) {
    var data = {
        name: comp.name,
        layers: []
    };

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        var layerData = {
            name: layer.name,
            type: layer.matchName
        };

        // Recursively include subcomps
        if (layer.source && layer.source instanceof CompItem) {
            layerData.subcomp = seeComp(layer.source);
        }

        data.layers.push(layerData);
    }

    return data;
}

function safeDescribeProperty(prop) {
    var propData = {
        name: prop.name,
        matchName: prop.matchName,
        keys: []
    };

    try {
        if (prop.numKeys > 0) {
            for (var k = 1; k <= prop.numKeys; k++) {
                propData.keys.push({
                    time: prop.keyTime(k),
                    value: prop.keyValue(k)
                });
            }
        } else {
            propData.value = prop.value;
        }
    } catch (err) {
        propData.error = err.toString();
    }

    return propData;
}

function seeLayers(comp) {
    var selectedLayers = comp.selectedLayers;
    var data = [];

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var layerData = {
            name: layer.name,
            type: layer.matchName,
            properties: [],
            effects: []
        };

        // Transform properties
        var transformProps = ["Position", "Scale", "Rotation", "Opacity"];
        for (var t = 0; t < transformProps.length; t++) {
            var prop = layer.property("Transform").property(transformProps[t]);
            if (prop) {
                layerData.properties.push(safeDescribeProperty(prop));
            }
        }

        // Effects
        var effectsGroup = layer.property("ADBE Effect Parade");
        if (effectsGroup && effectsGroup.numProperties > 0) {
            for (var e = 1; e <= effectsGroup.numProperties; e++) {
                var effect = effectsGroup.property(e);
                var effectData = {
                    name: effect.name,
                    matchName: effect.matchName,
                    properties: []
                };

                for (var p = 1; p <= effect.numProperties; p++) {
                    var prop = effect.property(p);
                    if (prop) {
                        effectData.properties.push(safeDescribeProperty(prop));
                    }
                }
                layerData.effects.push(effectData);
            }
        }

        data.push(layerData);
    }

    return data;
}

function runAutomation() {
    var scriptFile = new File($.fileName); // current JJ Quick Tools.jsx
    var folder = scriptFile.parent;
    var automationFile = new File(folder.fsName + "/automation.jsx");

    if (automationFile.exists) {
        app.beginUndoGroup("Run Automation");
        $.evalFile(automationFile);
        app.endUndoGroup();
    } else {
        alert("automation.jsx not found in JJ Quick Tools folder.");
    }
}

function SimpleCollage() {
    app.beginUndoGroup("Simple Collage");

    var proj = app.project;
    var selItems = proj.selection;

    // Validate selection
    if (selItems.length < 1) {
        alert("Please select at least one footage, comp, or solid in the Project panel.");
        app.endUndoGroup();
        return;
    }
    for (var i = 0; i < selItems.length; i++) {
        if (!(selItems[i] instanceof FootageItem) &&
            !(selItems[i] instanceof CompItem) &&
            !(selItems[i] instanceof SolidSource)) {
            alert("Selection must only contain footage, comps, or solids.");
            app.endUndoGroup();
            return;
        }
    }

    // Mother comp (2560x1440)
    var motherCompName = "SimpleCollageMother";
    var motherComp = proj.items.addComp(motherCompName, 2560, 1440, 1, 60, 30);

    // Create Bin folder
    var binFolder = proj.items.addFolder(motherCompName);
    motherComp.parentFolder = binFolder;

    // Border comp (768x360)
    var borderComp = proj.items.addComp("SimpleCollageBorder", 768, 360, 1, 60, 30);
    borderComp.parentFolder = binFolder;
    var borderShape = borderComp.layers.addShape();
    var rect = borderShape.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rect.property("Size").setValue([768,360]); // correct size
    rect.property("Position").setValue([0,0]); // at 0,0
    var stroke = borderShape.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Stroke Width").setValue(10);
    stroke.property("Color").setValue([1,1,1]); // white border

    // Grid setup
    var rows = 6;
    var cols = 5;
    var subW = 2560 / cols; // 512 px wide
    var subH = 1440 / rows; // 240 px tall
    var totalCells = rows * cols;

    // Create subcomps
    for (var i = 0; i < totalCells; i++) {
        var item = selItems[i % selItems.length];

        var subComp = proj.items.addComp("SimpleCollageSub_" + i, subW, subH, 1, 60, 30);
        subComp.parentFolder = binFolder;

        // Add footage/comp/solid
        var layer = subComp.layers.add(item);

        // Scale to fit width
        var scaleFactor = (subW / item.width) * 100;
        layer.property("Transform").property("Scale").setValue([scaleFactor, scaleFactor]);

        // Add border comp
        subComp.layers.add(borderComp);

        // Place subcomp into mother comp
        var subLayer = motherComp.layers.add(subComp);
        var row = Math.floor(i / cols);
        var col = i % cols;
        var x = col * subW + subW/2;
        var y = row * subH + subH/2;
        subLayer.property("Transform").property("Position").setValue([x,y]);

        // Fade-in effect (0 → 100 opacity over 0.5s)
        var opacityProp = subLayer.property("Transform").property("Opacity");
        var startT = Math.random() * 0.5; // random start between 0–0.5s
        subLayer.startTime = startT;
        opacityProp.setValueAtTime(startT, 0);
        opacityProp.setValueAtTime(startT + 0.5, 100);

        // Ease opacity
        for (var k = 1; k <= opacityProp.numKeys; k++) {
            opacityProp.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER);
            var easeIn = [new KeyframeEase(0,75)];
            var easeOut = [new KeyframeEase(0,25)];
            opacityProp.setTemporalEaseAtKey(k, easeIn, easeOut);
        }
    }

    // === Add Mother Comp on top of currently selected layer in active comp ===
    if (proj.activeItem instanceof CompItem && proj.activeItem.selectedLayers.length > 0) {
        var targetLayer = proj.activeItem.selectedLayers[0]; // first selected layer only
        var motherLayer = proj.activeItem.layers.add(motherComp);
        motherLayer.moveBefore(targetLayer);
        motherLayer.startTime = proj.activeItem.time; // align start to current time
    }

    app.endUndoGroup();
}

// Helper to apply easing curve like screenshot
function applyEase(prop) {
    // Key 1 (start): ease out fast
    prop.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
    var easeOutStart = [new KeyframeEase(0,30), new KeyframeEase(0,30)];
    var easeInStart  = [new KeyframeEase(0,0), new KeyframeEase(0,0)];
    prop.setTemporalEaseAtKey(1, easeInStart, easeOutStart);

    // Key 2 (end): slow down heavily
    prop.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);
    var easeOutEnd = [new KeyframeEase(0,0), new KeyframeEase(0,0)];
    var easeInEnd  = [new KeyframeEase(0,100), new KeyframeEase(0,100)];
    prop.setTemporalEaseAtKey(2, easeInEnd, easeOutEnd);
}

function getScaledSize(layer) {
    var scale = layer.property("Transform").property("Scale").value;
    var w = layer.width * (scale[0] / 100);
    var h = layer.height * (scale[1] / 100);
    return [w, h];
}


function SlideInFromTop() {
    app.beginUndoGroup("Slide In From Top");

    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) { alert("Please select a comp."); return; }

    var layers = comp.selectedLayers;
    if (layers.length < 1) { alert("Please select at least one layer."); return; }

    var t = comp.time;

    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }

            var pos = layer.property("Transform").property("Position");
            if (!pos) { continue; }

            var finalPos = pos.value;
            var size = getScaledSize(layer);
            var offY = -size[1] / 2; // above comp

            pos.setValueAtTime(t, [finalPos[0], offY]);
            pos.setValueAtTime(t + 0.5, finalPos);

            // Find the indices of the keys we just added
            var k1 = pos.nearestKeyIndex(t);
            var k2 = pos.nearestKeyIndex(t + 0.5);

            pos.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
            pos.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

            // Same ease pairing pattern as scaleOut
            var easeOut = new KeyframeEase(0, 30);   // start ease
            var easeIn  = new KeyframeEase(0, 100);  // end ease

            pos.setTemporalEaseAtKey(k1, [easeOut, easeOut], [easeOut, easeOut]);
            pos.setTemporalEaseAtKey(k2, [easeIn, easeIn], [easeIn, easeIn]);
        }
    } finally {
        app.endUndoGroup();
    }
}

function SlideInFromLeft() {
    app.beginUndoGroup("Slide In From Left");
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) { alert("Please select a comp."); return; }
    var layers = comp.selectedLayers;
    if (layers.length < 1) { alert("Please select at least one layer."); return; }
    var t = comp.time;
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }
            var pos = layer.property("Transform").property("Position");
            if (!pos) { continue; }
            var finalPos = pos.value;
            var size = getScaledSize(layer);
            var offX = -size[0] / 2; // left of comp
            pos.setValueAtTime(t, [offX, finalPos[1]]);
            pos.setValueAtTime(t + 0.5, finalPos);
            // Find the indices of the keys we just added
            var k1 = pos.nearestKeyIndex(t);
            var k2 = pos.nearestKeyIndex(t + 0.5);
            pos.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
            pos.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);
            // Same ease pairing pattern as scaleOut
            var easeOut = new KeyframeEase(0, 30);   // start ease
            var easeIn  = new KeyframeEase(0, 100);  // end ease
            pos.setTemporalEaseAtKey(k1, [easeOut], [easeOut]);
            pos.setTemporalEaseAtKey(k2, [easeIn], [easeIn]);
        }
    } finally {
        app.endUndoGroup();
    }
}


function SlideInFromRight() {
    app.beginUndoGroup("Slide In From Right");
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) { alert("Please select a comp."); return; }
    var layers = comp.selectedLayers;
    if (layers.length < 1) { alert("Please select at least one layer."); return; }
    var t = comp.time;
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }
            var pos = layer.property("Transform").property("Position");
            if (!pos) { continue; }
            var finalPos = pos.value;
            var size = getScaledSize(layer);
            var offX = size[0] / 2; // right of comp... actually beyond right edge
            pos.setValueAtTime(t, [comp.width + offX, finalPos[1]]);
            pos.setValueAtTime(t + 0.5, finalPos);
            // Find the indices of the keys we just added
            var k1 = pos.nearestKeyIndex(t);
            var k2 = pos.nearestKeyIndex(t + 0.5);
            pos.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
            pos.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);
            // Same ease pairing pattern as scaleOut
            var easeOut = new KeyframeEase(0, 30);   // start ease
            var easeIn  = new KeyframeEase(0, 100);  // end ease
            pos.setTemporalEaseAtKey(k1, [easeOut], [easeOut]);
            pos.setTemporalEaseAtKey(k2, [easeIn], [easeIn]);
        }
    } finally {
        app.endUndoGroup();
    }
}


function SlideInFromBottom() {
    app.beginUndoGroup("Slide In From Bottom");
    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) { alert("Please select a comp."); return; }
    var layers = comp.selectedLayers;
    if (layers.length < 1) { alert("Please select at least one layer."); return; }
    var t = comp.time;
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }
            var pos = layer.property("Transform").property("Position");
            if (!pos) { continue; }
            var finalPos = pos.value;
            var size = getScaledSize(layer);
            var offY = size[1] / 2; // below comp
            pos.setValueAtTime(t, [finalPos[0], comp.height + offY]);
            pos.setValueAtTime(t + 0.5, finalPos);
            // Find the indices of the keys we just added
            var k1 = pos.nearestKeyIndex(t);
            var k2 = pos.nearestKeyIndex(t + 0.5);
            pos.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
            pos.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);
            // Same ease pairing pattern as scaleOut
            var easeOut = new KeyframeEase(0, 30);   // start ease
            var easeIn  = new KeyframeEase(0, 100);  // end ease
            pos.setTemporalEaseAtKey(k1, [easeOut], [easeOut]);
            pos.setTemporalEaseAtKey(k2, [easeIn], [easeIn]);
        }
    } finally {
        app.endUndoGroup();
    }
}

function SlideInFromRandom() {
    app.beginUndoGroup("Slide In From Random");

    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) { alert("Please select a comp."); return; }

    var layers = comp.selectedLayers;
    if (layers.length < 1) { alert("Please select at least one layer."); return; }

    var t = comp.time;
    var compDiagonal = Math.sqrt(Math.pow(comp.width, 2) + Math.pow(comp.height, 2));

    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }

            var pos = layer.property("Transform").property("Position");
            if (!pos) { continue; }

            var finalPos = pos.value;
            var size = getScaledSize(layer); // FIXED: no longer needs comp

            // Random angle per layer
            var randomAngle = Math.random() * Math.PI * 2;

            var maxLayerSize = Math.max(size[0], size[1]);
            var offscreenDist = compDiagonal / 2 + maxLayerSize + 200;

            var dirX = Math.cos(randomAngle);
            var dirY = Math.sin(randomAngle);

            var offX = finalPos[0] + dirX * offscreenDist;
            var offY = finalPos[1] + dirY * offscreenDist;

            pos.setValueAtTime(t, [offX, offY]);
            pos.setValueAtTime(t + 0.5, finalPos);

            var k1 = pos.nearestKeyIndex(t);
            var k2 = pos.nearestKeyIndex(t + 0.5);

            pos.setInterpolationTypeAtKey(k1, KeyframeInterpolationType.BEZIER);
            pos.setInterpolationTypeAtKey(k2, KeyframeInterpolationType.BEZIER);

            var easeOut = new KeyframeEase(0, 30);
            var easeIn = new KeyframeEase(0, 100);

            pos.setTemporalEaseAtKey(k1, [easeOut], [easeOut]);
            pos.setTemporalEaseAtKey(k2, [easeIn], [easeIn]);
        }
    } finally {
        app.endUndoGroup();
    }
}

function CardIn() {
    app.beginUndoGroup("Card In");

    var comp = app.project.activeItem;
    if (!(comp instanceof CompItem)) { alert("Please select a comp."); return; }
    var layers = comp.selectedLayers;
    if (layers.length < 1) { alert("Please select at least one layer."); return; }

    var t = comp.time; // current timeline time

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        // 1) Set to 3D if not already
        if (!layer.threeDLayer) {
            layer.threeDLayer = true;
        }

        // 2) Slide in from bottom
        SlideInFromBottom();

        // 3) Y Rotation from -180 → 0 over 1s
        var yRot = layer.property("Transform").property("Y Rotation");
        yRot.setValueAtTime(t, -180);
        yRot.setValueAtTime(t+1, 0);

        // Apply easing (fast start, slow end)
        yRot.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER);
        yRot.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER);
        var easeOutStart = [new KeyframeEase(0,30)];
        var easeInEnd   = [new KeyframeEase(0,100)];
        yRot.setTemporalEaseAtKey(1, [new KeyframeEase(0,0)], easeOutStart);
        yRot.setTemporalEaseAtKey(2, easeInEnd, [new KeyframeEase(0,0)]);
    }

    // 4) Move current time forward 0.3s
    comp.time = t + 0.3;

    // 5) Trigger quickLightSweep()
    quickLightSweep();

    app.endUndoGroup();
}


function IdentifyFont() {
	var layer = app.project.activeItem.layer(1);
	alert(layer.property("Source Text").value.font);
}

// Quick Tool: Run JSX File
function runJSXFile(filePath) {
    var f = new File(filePath);
    if (f.exists) {
        try {
            $.evalFile(f);
            alert("Ran script: " + f.name);
        } catch (err) {
            alert("Error running " + f.name + ":\n" + err.toString());
        }
    } else {
        alert("File not found:\n" + filePath);
    }
}

function SphereOfSpheres() {
    app.beginUndoGroup("Sphere of Spheres");

    var proj = app.project;

    // 1) Create a new 1080p comp, 5 minutes long
    var comp = proj.items.addComp("SphereOfSpheres", 1920, 1080, 1, 300, 30); 
    // duration = 300s (5 minutes), framerate = 30fps

    // 2) Create a Bin folder to organize subcomps
    var binFolder = proj.items.addFolder("SphereOfSpheres_Bin");

    // 3) Create a subcomp with CC Sphere (small spheres)
    var sphereComp = proj.items.addComp("SmallSphereComp", 100, 100, 1, comp.duration, comp.frameRate);
    sphereComp.parentFolder = binFolder;

    var solid = sphereComp.layers.addSolid([0.988, 0.953, 0.902], "CreamSolid", 100, 100, 1);
    var ccSphere = solid.Effects.addProperty("CC Sphere");
    ccSphere.property("CC Sphere-0006").setValue(30);   // Radius only
	// Set Ambient and Diffuse
	ccSphere.property("CC Sphere-0016").setValue(55.0); // Ambient
	ccSphere.property("CC Sphere-0017").setValue(73.0); // Diffuse

    // 4) Create a parent null at comp center
    var nullLayer = comp.layers.addNull();
    nullLayer.threeDLayer = true;
    nullLayer.name = "Sphere Null";
    nullLayer.property("Position").setValue([comp.width/2, comp.height/2, 0]);

    // 5) Distribute instances in spherical coordinates
    var numLat = 18;  // 75% of 24
    var numLon = 36;  // 75% of 48
    var radius = 400; // sphere radius

    for (var lat = 0; lat <= numLat; lat++) {
        var theta = Math.PI * lat / numLat;
        for (var lon = 0; lon < numLon; lon++) {
            var phi = 2 * Math.PI * lon / numLon;

            var x = radius * Math.sin(theta) * Math.cos(phi);
            var y = radius * Math.cos(theta);
            var z = radius * Math.sin(theta) * Math.sin(phi);

            var inst = comp.layers.add(sphereComp);
            inst.threeDLayer = true;
            inst.parent = nullLayer;

            // Place relative to null (centered)
            inst.property("Position").setValue([x, y, z]);

            // Counteract null’s Y rotation so sphere always faces forward
            inst.property("Rotation Y").expression = "-parent.transform.yRotation";
        }
    }

    // 6) Add a central large sphere (not parented to null)
    var centerSphere = comp.layers.add(sphereComp);
    centerSphere.threeDLayer = true;
    centerSphere.property("Position").setValue([comp.width/2, comp.height/2, 0]);
    centerSphere.property("Scale").setValue([1300, 1300, 1300]); // 1300% size

    // 7) Animate null’s Y Rotation from 0x to 1x in 30s, then loop
    var yRot = nullLayer.property("Rotation Y");
    yRot.setValueAtTime(0, 0);          // 0x
    yRot.setValueAtTime(30, 360);       // 1x (360 degrees)
    yRot.expression = "loopOut('cycle')";

    // 8) If a layer is selected in the active comp, add SphereOfSpheres on top
    var activeComp = proj.activeItem;
    if (activeComp instanceof CompItem && activeComp.selectedLayers.length > 0) {
        var targetLayer = activeComp.selectedLayers[0]; // use first/topmost
        var sphereLayer = activeComp.layers.add(comp);
        sphereLayer.moveBefore(targetLayer);
    }

    app.endUndoGroup();
}

// ============================================================
//  QUICK TOOLS FOR AFTER EFFECTS
//  ExtendScript (.jsx) — run via File > Scripts > Run Script File
// ============================================================

// ─────────────────────────────────────────────────────────────
// 1. fadeOut
//    Selected layers: opacity drops from current value → 0
//    over 0.5 s starting at current time. No easing.
// ─────────────────────────────────────────────────────────────
function fadeOut() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    var layers = comp.selectedLayers;
    if (layers.length === 0) { alert("No layers selected."); return; }

    var t = comp.time;

    app.beginUndoGroup("Quick Tool: fadeOut");
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            if (layer.locked) { continue; } // skip locked layers, don't throw

            var opacity = layer.property("Transform").property("Opacity");
            if (!opacity) { continue; } // skip layers without Opacity (e.g. some guide/camera types)

            var currentOpacity = opacity.value;
            opacity.setValueAtTime(t, currentOpacity);
            opacity.setValueAtTime(t + 0.5, 0);
        }
    } finally {
        app.endUndoGroup();
    }
}


// ─────────────────────────────────────────────────────────────
// 2. fadePlusScaleIn
//    Selected layers: opacity 0 → current over 0.5 s (no ease),
//    scale (50 % of current) → current over 0.5 s (eased 30/100).
// ─────────────────────────────────────────────────────────────
function fadePlusScaleIn() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: fadePlusScaleIn");

    var layers = comp.selectedLayers;
    var t = comp.time;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];

        // ── Opacity (no easing) ──────────────────────────────
        var opacity = layer.property("Transform").property("Opacity");
        var currentOpacity = opacity.value;

        opacity.setValueAtTime(t, 0);
        opacity.setValueAtTime(t + 0.5, currentOpacity);

        // ── Scale (eased) ────────────────────────────────────
        var scale = layer.property("Transform").property("Scale");
        var currentScale = scale.value; // [x, y, z]

        var startScale = [currentScale[0] * 0.5,
                          currentScale[1] * 0.5,
                          currentScale[2] * 0.5];

        scale.setValueAtTime(t, startScale);
        scale.setValueAtTime(t + 0.5, currentScale);

        var easeIn  = new KeyframeEase(0, 30);
        var easeOut = new KeyframeEase(0, 100);

        scale.setTemporalEaseAtKey(1,
            [easeIn,  easeIn,  easeIn ],
            [easeOut, easeOut, easeOut]);
        scale.setTemporalEaseAtKey(2,
            [easeIn,  easeIn,  easeIn ],
            [easeOut, easeOut, easeOut]);
    }

    app.endUndoGroup();
}


// ─────────────────────────────────────────────────────────────
// 2b. fadePlusScaleDown
//    Selected layers: opacity 0 → current over 0.5 s (no ease),
//    scale (300 % of current) → current over 0.5 s (eased 30/70).
// ─────────────────────────────────────────────────────────────
function fadePlusScaleDown() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    var layers = comp.selectedLayers;
    if (layers.length === 0) { alert("No layers selected."); return; }

    var t = comp.time;

    app.beginUndoGroup("Quick Tool: fadePlusScaleDown");
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }

            // ── Opacity (no easing) ──────────────────────────
            var opacity = layer.property("Transform").property("Opacity");
            if (!opacity) { continue; }
            var currentOpacity = opacity.value;
            opacity.setValueAtTime(t, 0);
            opacity.setValueAtTime(t + 0.5, currentOpacity);

            // ── Scale (eased) ─────────────────────────────────
            var scale = layer.property("Transform").property("Scale");
            if (!scale) { continue; }
            var currentScale = scale.value; // [x, y, z]
            var startScale = [currentScale[0] * 3,
                              currentScale[1] * 3,
                              currentScale[2] * 3];
            scale.setValueAtTime(t, startScale);
            scale.setValueAtTime(t + 0.5, currentScale);

            var easeIn  = new KeyframeEase(0, 30);
            var easeOut = new KeyframeEase(0, 70);
            scale.setTemporalEaseAtKey(1,
                [easeIn,  easeIn,  easeIn ],
                [easeOut, easeOut, easeOut]);
            scale.setTemporalEaseAtKey(2,
                [easeIn,  easeIn,  easeIn ],
                [easeOut, easeOut, easeOut]);
        }
    } finally {
        app.endUndoGroup();
    }
}


// ─────────────────────────────────────────────────────────────
// 3. scaleInBounce
//    Selected layers:
//      t+0.00 s → 0 %
//      t+0.25 s → 120 % of current scale
//      t+0.50 s → current scale
//    Default Easy Ease (33.33 influence) on every keyframe.
// ─────────────────────────────────────────────────────────────
function scaleInBounce() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    var layers = comp.selectedLayers;
    if (layers.length === 0) { alert("No layers selected."); return; }

    var t = comp.time;

    app.beginUndoGroup("Quick Tool: scaleInBounce");
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }

            var scale = layer.property("Transform").property("Scale");
            if (!scale) { continue; }
            var currentScale = scale.value;

            var zeroScale = [0, 0, 0];
            var peakScale = [currentScale[0] * 1.2,
                             currentScale[1] * 1.2,
                             currentScale[2] * 1.2];

            scale.setValueAtTime(t,        zeroScale);
            scale.setValueAtTime(t + 0.25, peakScale);
            scale.setValueAtTime(t + 0.5,  currentScale);

            // Default Easy Ease: influence 33.33 on both sides, speed 0
            var easyEase = new KeyframeEase(0, 33.33);
            for (var k = 1; k <= 3; k++) {
                scale.setTemporalEaseAtKey(k,
                    [easyEase, easyEase, easyEase],
                    [easyEase, easyEase, easyEase]);
            }
        }
    } finally {
        app.endUndoGroup();
    }
}

// ─────────────────────────────────────────────────────────────
// 4. fadeToBlack
//    Selected layers: apply Color Balance (HLS),
//    Lightness 0 → -100 over 0.5 s. No easing.
// ─────────────────────────────────────────────────────────────
function fadeToBlack() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: fadeToBlack");

    var layers = comp.selectedLayers;
    var t = comp.time;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var effect = layer.Effects.addProperty("ADBE Color Balance (HLS)");
        var lightness = effect.property("ADBE Color Balance (HLS)-0002");

        lightness.setValueAtTime(t,       0);
        lightness.setValueAtTime(t + 0.5, -100);
    }

    app.endUndoGroup();
}


// ─────────────────────────────────────────────────────────────
// 5. fadeToWhite
//    Selected layers: apply Color Balance (HLS),
//    Lightness 0 → 100 over 0.5 s. No easing.
// ─────────────────────────────────────────────────────────────
function fadeToWhite() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: fadeToWhite");

    var layers = comp.selectedLayers;
    var t = comp.time;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var effect = layer.Effects.addProperty("ADBE Color Balance (HLS)");
        var lightness = effect.property("ADBE Color Balance (HLS)-0002");

        lightness.setValueAtTime(t,       0);
        lightness.setValueAtTime(t + 0.5, 100);
    }

    app.endUndoGroup();
}


// ─────────────────────────────────────────────────────────────
// 5b. desaturateFootage
//    Selected layers: apply Color Balance (HLS),
//    set Saturation to -50. Static, no keyframes.
// ─────────────────────────────────────────────────────────────
function desaturateFootage() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: desaturateFootage");

    var layers = comp.selectedLayers;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var effect = layer.Effects.addProperty("ADBE Color Balance (HLS)");
        effect.property("ADBE Color Balance (HLS)-0003").setValue(-50);
    }

    app.endUndoGroup();
}


// ─────────────────────────────────────────────────────────────
// 6. growOverTime
//    Selected layers:
//      • Slider "Default Scale" = current scale value
//      • Slider "Growth Rate"   = 25
//      • Slider "Start Time"    = comp time when the script was run
//      • Expression on Scale uses (time - Start Time) * Growth Rate
//        so growth starts at the currently selected time, not 0 or inPoint.
// ─────────────────────────────────────────────────────────────
function growOverTime() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    var layers = comp.selectedLayers;
    if (layers.length === 0) { alert("No layers selected."); return; }

    var t = comp.time;

    app.beginUndoGroup("Quick Tool: growOverTime");
    try {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.locked) { continue; }

            var scale = layer.property("Transform").property("Scale");
            if (!scale) { continue; }
            var currentScale = scale.value; // [x, y, z]

            var defaultScaleSlider = layer.Effects.addProperty("Slider Control");
            defaultScaleSlider.name = "Default Scale";
            defaultScaleSlider.property("Slider").setValue(currentScale[0]);

            var growthRateSlider = layer.Effects.addProperty("Slider Control");
            growthRateSlider.name = "Growth Rate";
            growthRateSlider.property("Slider").setValue(2);

            var startTimeSlider = layer.Effects.addProperty("Slider Control");
            startTimeSlider.name = "Start Time";
            startTimeSlider.property("Slider").setValue(t);

            var expression = [
                'var s = effect("Default Scale")("Slider");',
                'var r = effect("Growth Rate")("Slider");',
                'var startTime = effect("Start Time")("Slider");',
                'var elapsed = Math.max(0, time - startTime);',
                'var v = s + elapsed * r;',
                '[v, v, 100]'
            ].join("\n");

            scale.expression = expression;
        }
    } finally {
        app.endUndoGroup();
    }
}


// ─────────────────────────────────────────────────────────────
// smoothLinearWipe
//    Selected layers: apply Linear Wipe,
//    Transition Completion 100 → 0 over 0.5 s (eased 30/100),
//    Wipe Angle set to -90 (static), Feather set to 100 (static).
// ─────────────────────────────────────────────────────────────
function smoothLinearWipe() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: smoothLinearWipe");

    var layers = comp.selectedLayers;
    var t = comp.time;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var effect = layer.Effects.addProperty("ADBE Linear Wipe");

        // Static properties
        effect.property("ADBE Linear Wipe-0002").setValue(-90);  // Wipe Angle
        effect.property("ADBE Linear Wipe-0003").setValue(100);  // Feather

        // Transition Completion: 100 → 0 with keyframes
        var transition = effect.property("ADBE Linear Wipe-0001");
        transition.setValueAtTime(t,       100);
        transition.setValueAtTime(t + 0.5, 0);

        var easeIn  = new KeyframeEase(0, 33);
        var easeOut = new KeyframeEase(0, 33);

        transition.setTemporalEaseAtKey(1, [easeIn],  [easeOut]);
        transition.setTemporalEaseAtKey(2, [easeIn],  [easeOut]);
    }

    app.endUndoGroup();
}


// ─────────────────────────────────────────────────────────────
// 7. darkenFootage
//    Selected layers: apply Brightness & Contrast,
//    set Brightness to -50.
// ─────────────────────────────────────────────────────────────
function darkenFootage() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: darkenFootage");

    var layers = comp.selectedLayers;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var effect = layer.Effects.addProperty("Brightness & Contrast");
        effect.property("Brightness").setValue(-50);
    }

    app.endUndoGroup();
}


// ─────────────────────────────────────────────────────────────
// audioFadeOut
//    Selected layers: Audio Levels from current value → -48 dB
//    over 2 s. Trims layer out point to t + 2 s.
// ─────────────────────────────────────────────────────────────
function audioFadeOut() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: audioFadeOut");

    var layers = comp.selectedLayers;
    var t = comp.time;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var audio = layer.property("Audio");
        if (!audio) { continue; }

        var audioLevels = audio.property("Audio Levels");
        var currentLevels = audioLevels.value; // [L, R] in dB

        audioLevels.setValueAtTime(t,     currentLevels);
        audioLevels.setValueAtTime(t + 2, [-48, -48]);

        // Trim out point to end of fade
        layer.outPoint = t + 2;
    }

    app.endUndoGroup();
}


// ─────────────────────────────────────────────────────────────
// layerSearch
//    Opens a search window. Matches layer names by substring.
//    Select First: selects first match, reveals modified props, closes.
//    Select All:   selects all matches, closes.
//    Search in Sub: searches inside a single selected precomp recursively.
//    Close: dismisses the window.
// ─────────────────────────────────────────────────────────────
function layerSearch() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    // ── Helper: find layers matching query in a given comp ──
    function findMatches(targetComp, query) {
        var matches = [];
        var q = query.toLowerCase();
        for (var i = 1; i <= targetComp.numLayers; i++) {
            if (targetComp.layer(i).name.toLowerCase().indexOf(q) !== -1) {
                matches.push(targetComp.layer(i));
            }
        }
        return matches;
    }

    // ── Helper: recursively search inside a precomp ─────────
    // Returns { comp: CompItem, layer: Layer } or null
    function searchInSub(precompLayer, query) {
        var source = precompLayer.source;
        if (!source || !(source instanceof CompItem)) { return null; }

        var q = query.toLowerCase();
        for (var i = 1; i <= source.numLayers; i++) {
            var layer = source.layer(i);
            if (layer.name.toLowerCase().indexOf(q) !== -1) {
                return { comp: source, layer: layer };
            }
            // Recurse if this layer is also a precomp
            if (layer.source && (layer.source instanceof CompItem)) {
                var deeper = searchInSub(layer, query);
                if (deeper) { return deeper; }
            }
        }
        return null;
    }

    // ── Build UI ─────────────────────────────────────────────
    var win = new Window("palette", "Layer Search", undefined, { resizeable: false });
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 12;

    var searchBox = win.add("edittext", undefined, "");
    searchBox.preferredSize = [280, 24];

    var btnGroup = win.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignChildren = ["fill", "center"];
    btnGroup.spacing = 6;

    var btnFirst  = btnGroup.add("button", undefined, "Select First");
    var btnAll    = btnGroup.add("button", undefined, "Select All");
    var btnSub    = btnGroup.add("button", undefined, "Search in Sub");
    var btnClose  = btnGroup.add("button", undefined, "Close");

    // ── Actions ──────────────────────────────────────────────
    btnFirst.onClick = function () {
        var query = searchBox.text;
        if (!query) { return; }

        var matches = findMatches(comp, query);
        if (matches.length === 0) {
            alert("No layers found matching: " + query);
            return;
        }

        // Deselect all, select first match
        for (var i = 1; i <= comp.numLayers; i++) {
            comp.layer(i).selected = false;
        }
        matches[0].selected = true;

        // Reveal modified properties (equivalent to pressing U twice)
        app.executeCommand(2797); // U  — keyframed properties
        app.executeCommand(2797); // UU — all modified properties

        win.close();
    };

    btnAll.onClick = function () {
        var query = searchBox.text;
        if (!query) { return; }

        var matches = findMatches(comp, query);
        if (matches.length === 0) {
            alert("No layers found matching: " + query);
            return;
        }

        // Deselect all, then select all matches
        for (var i = 1; i <= comp.numLayers; i++) {
            comp.layer(i).selected = false;
        }
        for (var j = 0; j < matches.length; j++) {
            matches[j].selected = true;
        }

        win.close();
    };

    btnSub.onClick = function () {
        var query = searchBox.text;
        if (!query) { return; }

        var selected = comp.selectedLayers;
        if (selected.length !== 1) {
            alert("Please select exactly 1 precomp layer before using Search in Sub.");
            return;
        }

        var precompLayer = selected[0];
        if (!precompLayer.source || !(precompLayer.source instanceof CompItem)) {
            alert("The selected layer is not a precomp.");
            return;
        }

        var result = searchInSub(precompLayer, query);
        if (!result) {
            alert("No layers found matching: " + query);
            return;
        }

        // Open the comp where the match was found and select the layer
        result.comp.openInViewer();
        for (var i = 1; i <= result.comp.numLayers; i++) {
            result.comp.layer(i).selected = false;
        }
        result.layer.selected = true;

        win.close();
    };

    btnClose.onClick = function () {
        win.close();
    };

    // Allow Enter key to trigger Select First
    searchBox.addEventListener("keydown", function (e) {
        if (e.keyName === "Enter") { btnFirst.notify("onClick"); }
    });

    win.show();

    // Focus the text box immediately so the user can start typing
    searchBox.active = true;
}


// ─────────────────────────────────────────────────────────────
// 8. lightenFootage
//    Selected layers: apply Brightness & Contrast,
//    set Brightness to +50.
// ─────────────────────────────────────────────────────────────
function lightenFootage() {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) { alert("No active composition."); return; }

    app.beginUndoGroup("Quick Tool: lightenFootage");

    var layers = comp.selectedLayers;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var effect = layer.Effects.addProperty("Brightness & Contrast");
        effect.property("Brightness").setValue(50);
    }

    app.endUndoGroup();
}

// ─────────────────────────────────────────────────────────────
// Hexagon Transition
//    Simple hexagon transition that covers from left to right
// ─────────────────────────────────────────────────────────────
function hexagonTransition() {
    app.beginUndoGroup("hexagonTransition");

    var hexComp = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        var item = app.project.item(i);
        if (item instanceof CompItem && item.name === "hexagonTransition") {
            hexComp = item;
            break;
        }
    }

    var targetComp = null;
    if (app.project.activeItem instanceof CompItem && app.project.activeItem.name!== "hexagonTransition") {
        targetComp = app.project.activeItem;
    }
    var selectedLayers = targetComp? targetComp.selectedLayers : [];

    // Only create if it doesn't exist
    if (hexComp === null) {
        // 2) 5 mins long = 300 seconds
        hexComp = app.project.items.addComp("hexagonTransition", 1920, 1080, 1, 300, 30);

        var ROWS = 5;
        var R = hexComp.height / (ROWS * Math.sqrt(3));
        var HEX_H = Math.sqrt(3) * R;
        var X_STEP = 1.5 * R;
        var Y_STEP = HEX_H;
        var cols = Math.ceil(hexComp.width / X_STEP) + 3;
        var rows = ROWS + 2;
        var totalStagger = 1.2;
        var fadeDuration = 0.35;
        var jitterAmount = 0.25;

        function seededRandom(idx) {
            var x = Math.sin(idx * 127.1) * 43758.5453;
            return x - Math.floor(x);
        }

        var hexagons = [];
        for (var c = -1; c < cols; c++) {
            for (var r = -1; r < rows; r++) {
                var x = c * X_STEP;
                var y = r * Y_STEP + (c % 2!= 0? Y_STEP / 2 : 0);
                hexagons.push({x: x, y: y});
            }
        }
        hexagons.sort(function(a,b){ return a.x - b.x; });
        var maxX = hexagons[hexagons.length-1].x;
        var minX = hexagons[0].x;

        for (var j = 0; j < hexagons.length; j++) {
            var h = hexagons[j];
            var normX = (h.x - minX) / (maxX - minX);
            var jitter = (seededRandom(j) - 0.5) * jitterAmount;
            var delay = Math.max(0, Math.min(1, normX)) * totalStagger + jitter;

            var shapeLayer = hexComp.layers.addShape();
            shapeLayer.name = "Hex_" + j;
            var root = shapeLayer.property("ADBE Root Vectors Group");
            var vecGroup = root.addProperty("ADBE Vector Group");
            var contents = vecGroup.property("ADBE Vectors Group");
            var polyPath = contents.addProperty("ADBE Vector Shape - Star");
            polyPath.property("ADBE Vector Star Type").setValue(2);
            polyPath.property("ADBE Vector Star Points").setValue(6);
            polyPath.property("ADBE Vector Star Outer Radius").setValue(R);
            polyPath.property("ADBE Vector Star Rotation").setValue(30);
            var fill = contents.addProperty("ADBE Vector Graphic - Fill");
            fill.property("ADBE Vector Fill Color").setValue([0,0,0]);
            shapeLayer.property("ADBE Transform Group").property("ADBE Position").setValue([h.x, h.y]);
            var opacity = shapeLayer.property("ADBE Transform Group").property("ADBE Opacity");
            opacity.setValueAtTime(0, 0);
            opacity.setValueAtTime(delay, 0);
            opacity.setValueAtTime(delay + fadeDuration, 100);
        }

        // 1) Add a black solid that fills the screen at 1.5s to fill gaps
        var bg = hexComp.layers.addSolid([0,0,0], "Background Fill", 1920, 1080, 1);
        bg.moveToEnd(); // behind all hexes
        var bgOpacity = bg.property("ADBE Transform Group").property("ADBE Opacity");
        bgOpacity.setValueAtTime(0, 0);
        bgOpacity.setValueAtTime(1.5, 0);
        bgOpacity.setValueAtTime(1.5 + 0.1, 100); // quick fade in at 1.5s
    }

    if (targetComp!== null && targetComp!== hexComp) {
        targetComp.openInViewer();

        if (selectedLayers.length > 0) {
            selectedLayers.sort(function(a,b){ return b.index - a.index; });
            for (var s = 0; s < selectedLayers.length; s++) {
                var layerToMatte = selectedLayers[s];
                var matteLayer = targetComp.layers.add(hexComp);
                matteLayer.name = "hexagonTransition MATTE";
                var scaleToFit = (targetComp.width / hexComp.width) * 100;
                matteLayer.property("ADBE Transform Group").property("ADBE Scale").setValue([scaleToFit, scaleToFit]);
                matteLayer.moveBefore(layerToMatte);
                layerToMatte.trackMatteType = TrackMatteType.ALPHA;

                // 3) Hide the matte layer after setting it (eyeball off, matte still works)
                matteLayer.enabled = false;
            }
        } else {
            var matteLayer = targetComp.layers.add(hexComp);
            matteLayer.name = "hexagonTransition MATTE";
            var scaleToFit = (targetComp.width / hexComp.width) * 100;
            matteLayer.property("ADBE Transform Group").property("ADBE Scale").setValue([scaleToFit, scaleToFit]);
            matteLayer.moveToBeginning();
            matteLayer.enabled = false;
        }
    }

    app.endUndoGroup();
}

/**
 * SpinIn() - Final Function
 * - Position Z: 2426.5 -> 0 (2s eased)
 * - Spatial Phase: 168° -> 0° (2s eased)
 * - Y Rotation: 1x+0° (360°) -> 0° (2s eased)
 * - Wiggles/Second: 0.2 -> 0 (2s)
 * - Gaussian Blur: Blurriness 60 -> 0 (1s)
 * 
 * Wiggly: Max 100% Min -100% Based On Characters Correlation 0%
 */

function SpinIn() {
    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) { alert("Open a comp"); return; }
    var layer = comp.selectedLayers[0];
    if (!(layer instanceof TextLayer)) { alert("Select a Text Layer"); return; }

    app.beginUndoGroup("SpinIn");

    layer.threeDLayer = true;
    try { layer.property("ADBE Text Properties").property("ADBE Text More Options").property("ADBE Text Per-Character 3D").setValue(1); } catch(e){}

    var textProp = layer.property("ADBE Text Properties");
	var opacityProp = layer.property("Transform").property("Opacity");
    var animators = textProp.property("ADBE Text Animators");
    var t = comp.time;
    var dur = 2.0;
    var blurDur = 1.0;

    // Easing
    var easeIn = new KeyframeEase(0, 33);
    var easeOut = new KeyframeEase(0, 75);

    // --- ANIMATOR ---
    var anim = animators.addProperty("ADBE Text Animator");
    anim.name = "SpinIn";

    var animProps = anim.property("ADBE Text Animator Properties");
	
	// Transparency
	opacityProp.setValueAtTime(t, [0]);
	opacityProp.setValueAtTime(t+dur*0.1, [100]);
	
    // Position 3D
    var posProp = animProps.addProperty("ADBE Text Position 3D");
    posProp.setValueAtTime(t, [0,50,1000]);
    posProp.setValueAtTime(t+dur, [0,0,0]);
    try {
        posProp.setTemporalEaseAtKey(1, [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]);
        posProp.setTemporalEaseAtKey(2, [easeIn,easeIn,easeIn], [easeOut,easeOut,easeOut]);
    } catch(e){}

    // Y Rotation - 1x+0° = 360° -> 0°
    var yRotProp = null;
    try {
        yRotProp = animProps.addProperty("ADBE Text Rotation Y");
        yRotProp.setValueAtTime(t, 360); // 1x+0°
        yRotProp.setValueAtTime(t+dur, 0);
        try {
            yRotProp.setTemporalEaseAtKey(1, [easeIn], [easeOut]);
            yRotProp.setTemporalEaseAtKey(2, [easeIn], [easeOut]);
        } catch(e){}
    } catch(e){ alert("Y Rotation failed: "+e.message); }

    // --- WIGGLY SELECTOR ---
    var selGroup = anim.property("ADBE Text Selectors");
    var wiggly = null;
    for (var i=1; i<=selGroup.numProperties; i++){
        var s = selGroup.property(i);
        if (s.matchName.indexOf("Wiggly") !== -1) { wiggly = s; break; }
    }
    if (!wiggly) {
        try { wiggly = selGroup.addProperty("ADBE Text Wiggly Selector"); } catch(e){}
    }

    function findProp(group, keywords) {
        for (var i=1; i<=group.numProperties; i++){
            try {
                var p = group.property(i);
                var n = p.name.toLowerCase();
                var m = p.matchName.toLowerCase();
                for (var k=0;k<keywords.length;k++){
                    if (n.indexOf(keywords[k].toLowerCase()) !== -1 || m.indexOf(keywords[k].toLowerCase()) !== -1) return p;
                }
            } catch(e){}
        }
        return null;
    }

    if (wiggly) {
        // Constants
        var maxP = findProp(wiggly, ["max amount", "wiggly max"]); if (maxP) maxP.setValue(100);
        var minP = findProp(wiggly, ["min amount", "wiggly min"]); if (minP) minP.setValue(-100);
        var corrP = findProp(wiggly, ["correlation"]); if (corrP) corrP.setValue(0);
        var randP = findProp(wiggly, ["random seed"]); if (randP) randP.setValue(0);
        var lockP = findProp(wiggly, ["lock dimensions"]); if (lockP) lockP.setValue(0);
        var modeP = findProp(wiggly, ["mode"]); if (modeP) modeP.setValue(1);
        var basedP = findProp(wiggly, ["based on"]); if (basedP) basedP.setValue(1); // Characters
        var tempP = findProp(wiggly, ["temporal phase"]); if (tempP) tempP.setValue(0);

        // Keyframed: Wiggles/Second 0.2 -> 0.0
        var wiggSec = findProp(wiggly, ["wiggles/second", "wiggles per second", "wiggles"]);
        if (wiggSec) {
            wiggSec.setValueAtTime(t, 0.2);
            wiggSec.setValueAtTime(t+dur, 0.0);
        }

        // Keyframed: Spatial Phase 168 -> 0 with easing
        var spatP = findProp(wiggly, ["spatial phase"]);
        if (spatP) {
            spatP.setValueAtTime(t, 168);
            spatP.setValueAtTime(t+dur, 0);
            try {
                spatP.setTemporalEaseAtKey(1, [easeIn], [easeOut]);
                spatP.setTemporalEaseAtKey(2, [easeIn], [easeOut]);
            } catch(e){}
        }
    }

    // --- GAUSSIAN BLUR EFFECT ---
    try {
        var effects = layer.property("ADBE Effect Parade");
        var blurEffect = effects.addProperty("ADBE Gaussian Blur 2");
        // Find Blurriness property
        var blurProp = null;
        for (var i=1; i<=blurEffect.numProperties; i++){
            var bp = blurEffect.property(i);
            if (bp.name.toLowerCase().indexOf("blurriness") !== -1 || bp.matchName.toLowerCase().indexOf("blurriness") !== -1) {
                blurProp = bp; break;
            }
        }
        if (!blurProp) blurProp = blurEffect.property(1); // first is usually blurriness

        blurProp.setValueAtTime(t, 60);
        blurProp.setValueAtTime(t+blurDur, 0);
        try {
            blurProp.setTemporalEaseAtKey(1, [easeIn], [easeOut]);
            blurProp.setTemporalEaseAtKey(2, [easeIn], [easeOut]);
        } catch(e){}

    } catch(e){
        // Try alternative name
        try {
            var effects = layer.property("ADBE Effect Parade");
            var blurEffect = effects.addProperty("ADBE Gaussian Blur");
            var blurProp = blurEffect.property("ADBE Text Blur"); // fallback
            blurProp.setValueAtTime(t, 60);
            blurProp.setValueAtTime(t+blurDur, 0);
        } catch(e2){ alert("Gaussian Blur effect failed: "+e2.message); }
    }

    app.endUndoGroup();
}

/* Particle Sweep Effect*/

function ParticleSweep(){
    app.beginUndoGroup("ParticleSweep");

    var sourceComp = app.project.activeItem;
    if(!(sourceComp && sourceComp instanceof CompItem)){
        alert("Select a comp/layer first");
        return;
    }
    var selectedLayer = sourceComp.selectedLayers[0];
    var currentTime = sourceComp.time; // <-- NEW: get CTI
    var sourceCompWidth = sourceComp.width;
    var sourceCompHeight = sourceComp.height;

    var targetComp = null;
    for(var i=1; i<=app.project.numItems; i++){
        var item = app.project.item(i);
        if(item instanceof CompItem && item.name === "Particle Sweep"){
            targetComp = item;
            break;
        }
    }
    if(targetComp === null){
        targetComp = app.project.items.addComp("Particle Sweep", 1920, 1080, 1, 5, 30);
    }
    targetComp.width = 1920;
    targetComp.height = 1080;
    targetComp.duration = 5;

    var solid = null;
    for(var l=1; l<=targetComp.numLayers; l++){
        if(targetComp.layer(l).name === "Particle Sweep Solid"){
            solid = targetComp.layer(l);
            break;
        }
    }
    if(solid === null){
        solid = targetComp.layers.addSolid([0,0,0], "Particle Sweep Solid", targetComp.width, targetComp.height, 1, targetComp.duration);
    }
    solid.startTime = 0;
    solid.outPoint = 5;

    var fx = null;
    try { fx = solid.property("ADBE Effect Parade").property("CC Particle Systems II"); } catch(e){}
    if(fx == null){
        fx = solid.property("ADBE Effect Parade").addProperty("CC Particle Systems II");
    }

    function setByMatchName(effect, matchName, value){
        function search(group){
            for(var k=1; k<=group.numProperties; k++){
                var p = group.property(k);
                if(p == null) continue;
                if(p.matchName === matchName){
                    try { p.setValue(value); } catch(e){}
                    return true;
                }
                if(p.numProperties > 0){
                    if(search(p)) return true;
                }
            }
            return false;
        }
        search(effect);
    }

    setByMatchName(fx, "CC Particle Systems II-0001", 4.00000000000001);
    setByMatchName(fx, "CC Particle Systems II-0002", 0.90459363957597);
    setByMatchName(fx, "CC Particle Systems II-0005", 3);
    setByMatchName(fx, "CC Particle Systems II-0006", 82);
    setByMatchName(fx, "CC Particle Systems II-0009", 9);
    setByMatchName(fx, "CC Particle Systems II-0010", 0.5);
    setByMatchName(fx, "CC Particle Systems II-0011", 0);
    setByMatchName(fx, "CC Particle Systems II-0012", 0);
    setByMatchName(fx, "CC Particle Systems II-0013", 0);
    setByMatchName(fx, "CC Particle Systems II-0014", -90);
    setByMatchName(fx, "CC Particle Systems II-0015", 0);
    setByMatchName(fx, "CC Particle Systems II-0018", 2);
    setByMatchName(fx, "CC Particle Systems II-0019", 0.09);
    setByMatchName(fx, "CC Particle Systems II-0020", 0);
    setByMatchName(fx, "CC Particle Systems II-0021", 0.5);
    setByMatchName(fx, "CC Particle Systems II-0022", 3);
    setByMatchName(fx, "CC Particle Systems II-0023", 0.75);
    setByMatchName(fx, "CC Particle Systems II-0029", 0);
    setByMatchName(fx, "CC Particle Systems II-0024", 1);
    setByMatchName(fx, "CC Particle Systems II-0025", [0.9450980424881,0.86417061090469,0.70789694786072,1]);
    setByMatchName(fx, "CC Particle Systems II-0026", [0.52549022436142,0.48752400279045,0.41420993208885,1]);
    setByMatchName(fx, "CC Particle Systems II-0028", 1);
    setByMatchName(fx, "CC Particle Systems II-0030", 0);
    setByMatchName(fx, "ADBE Force CPU GPU", 1);

    var posProp = null;
    (function findPos(group){
        for(var k=1; k<=group.numProperties; k++){
            var p = group.property(k);
            if(p == null) continue;
            if(p.matchName === "CC Particle Systems II-0004"){ posProp = p; return; }
            if(p.numProperties > 0) findPos(p);
        }
    })(fx);

    if(posProp){
        var startPos = [-100, 540];
        var endPos = [2500, 540];
        posProp.setValueAtTime(0, startPos);
        posProp.setValueAtTime(5, endPos);
        try{
            var inFast = new KeyframeEase(0, 5);
            var outFast = new KeyframeEase(0, 5);
            var inSlow = new KeyframeEase(0, 85);
            var outSlow = new KeyframeEase(0, 85);
            posProp.setInterpolationTypeAtKey(1, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
            posProp.setInterpolationTypeAtKey(2, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
            posProp.setTemporalEaseAtKey(1, [inFast], [outFast]);
            posProp.setTemporalEaseAtKey(2, [inSlow], [outSlow]);
        }catch(e){}
    }

    solid.outPoint = 5;

    if(sourceComp!== targetComp){
        sourceComp.openInViewer();

        var compLayer = sourceComp.layers.add(targetComp);
        compLayer.name = "Particle Sweep";

        if(selectedLayer){
            compLayer.moveBefore(selectedLayer);
        }

        // TWEAK: Start at current time (CTI)
        compLayer.startTime = currentTime;
        compLayer.outPoint = currentTime + 5;

        var scaleFactor = (sourceCompWidth / targetComp.width) * 100;
        var scaleProp = compLayer.property("ADBE Transform Group").property("ADBE Scale");
        scaleProp.setValue([scaleFactor, scaleFactor]);

        var pos = compLayer.property("ADBE Transform Group").property("ADBE Position");
        pos.setValue([sourceCompWidth/2, sourceCompHeight/2]);
    }

    app.endUndoGroup();
}

/* DarkSoulsText.jsx - One-click function DarkSoulsText() - FINAL */
function DarkSoulsText() {
    app.beginUndoGroup("DarkSoulsText");

    function getRandomLetters(n) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var res = "";
        for (var i=0;i<n;i++) res+=chars.charAt(Math.floor(Math.random()*chars.length));
        return res;
    }
    function getUniqueCompName(baseName) {
        var exists=false;
        for(var i=1;i<=app.project.numItems;i++){ if(app.project.item(i) instanceof CompItem && app.project.item(i).name===baseName){ exists=true; break; } }
        if(!exists) return baseName;
        var newName;
        do{
            newName=baseName+getRandomLetters(3);
            exists=false;
            for(var j=1;j<=app.project.numItems;j++){ if(app.project.item(j) instanceof CompItem && app.project.item(j).name===newName){ exists=true; break; } }
        }while(exists);
        return newName;
    }

    var originalComp=null, selectedLayer=null, currentTime=0;
    if(app.project.activeItem instanceof CompItem){
        originalComp=app.project.activeItem;
        currentTime=originalComp.time;
        if(originalComp.selectedLayers.length>0) selectedLayer=originalComp.selectedLayers[0];
    }

    var compName=getUniqueCompName("DarkSoulsText");
    var compDuration=4;
    var compFps=originalComp?originalComp.frameRate:24;
    var frameDur=1/compFps;
    var newComp=app.project.items.addComp(compName,1920,1080,1,compDuration,compFps);
    newComp.bgColor=[0,0,0];

    var banner=newComp.layers.addSolid([0,0,0],"BG_Banner",1920,350,1,compDuration);
    banner.property("ADBE Transform Group").property("ADBE Position").setValue([960,540]);
    var bBlur=banner.Effects.addProperty("ADBE Box Blur");
    bBlur.property("ADBE Box Blur-0001").setValue(70);
    bBlur.property("ADBE Box Blur-0002").setValue(2);
    var bScale=banner.property("ADBE Transform Group").property("ADBE Scale");
    bScale.setValue([0.1,100]);
    bScale.setValueAtTime(0,[0.1,100]);
    bScale.setValueAtTime(0.3,[100,100]);
    bScale.setValueAtTime(3.5,[100,100]);
    var bOp=banner.property("ADBE Transform Group").property("ADBE Opacity");
    bOp.setValueAtTime(0,0);
    bOp.setValueAtTime(0.4,45);
    bOp.setValueAtTime(2.8,45);
    bOp.setValueAtTime(3.6,0);

    // >>> CHANGE COLOR HERE <<<
    var TEXT_COLOR = [0.78431372549, 0.6, 0.20392156862]; // C89934

    function makeTextDoc(doc){
        try{ doc.font="TrajanPro-Bold"; }catch(e){ try{ doc.font="TrajanPro-Regular"; }catch(e2){ try{ doc.font="Arial-BoldMT"; }catch(e3){} } }
        doc.fontSize=92;
        doc.tracking=-20;
        doc.justification=ParagraphJustification.CENTER_JUSTIFY;
        try{ doc.applyFill = true; }catch(e){}
        try{ doc.fillColor = TEXT_COLOR; }catch(e){}
        return doc;
    }

    var lightLayer=newComp.layers.addText("VICTORY ACHIEVED");
    lightLayer.name="Light Burst";
    var lp=lightLayer.property("ADBE Text Properties").property("ADBE Text Document");
    var ld=lp.value;
    ld=makeTextDoc(ld);
    lp.setValue(ld);
    // Force re-apply color after setValue - AE sometimes drops it on first set
    try{
        var ld2 = lightLayer.property("ADBE Text Properties").property("ADBE Text Document").value;
        ld2.fillColor = TEXT_COLOR;
        ld2.applyFill = true;
        lightLayer.property("ADBE Text Properties").property("ADBE Text Document").setValue(ld2);
    }catch(e){}

    lightLayer.property("ADBE Transform Group").property("ADBE Position").setValue([960,555]);
    var tScale=lightLayer.property("ADBE Transform Group").property("ADBE Scale");
    tScale.setValueAtTime(0.1,[112,112]);
    tScale.setValueAtTime(0.7,[100,100]);
    tScale.setValueAtTime(2.8,[100.5,100.5]);
    var easeOut=new KeyframeEase(0,85), easeIn=new KeyframeEase(0.1,0.1);
    try{
        tScale.setTemporalEaseAtKey(1,[easeOut,easeOut],[easeIn,easeIn]);
        tScale.setTemporalEaseAtKey(2,[easeOut,easeOut],[easeIn,easeIn]);
    }catch(e){}

    var tOp=lightLayer.property("ADBE Transform Group").property("ADBE Opacity");
    tOp.setValueAtTime(0.1,0);
    tOp.setValueAtTime(0.45,100);
    tOp.setValueAtTime(2.8,100);
    tOp.setValueAtTime(3.6,0);

    var burst=lightLayer.Effects.addProperty("CC Light Burst 2.5");
    burst.name="CC Light Burst 2.5";
    try{
        burst.property(1).setValue([960,540]);
        burst.property(2).setValue(200);
        var rayProp=burst.property(3);
        rayProp.setValueAtTime(0.5, 0);
        rayProp.setValueAtTime(0.5 + frameDur, 30);
        rayProp.setValueAtTime(2.0, 0);
    }catch(e){}

    var sweep=lightLayer.Effects.addProperty("CC Light Sweep");
    sweep.name="CC Light Sweep";
    try{
        sweep.property("CC Light Sweep-0001").setValue([961,525]);
        sweep.property("CC Light Sweep-0002").setValue(-90);
        sweep.property("CC Light Sweep-0003").setValue(2);
        sweep.property("CC Light Sweep-0004").setValue(11);
        sweep.property("CC Light Sweep-0005").setValue(34);
        sweep.property("CC Light Sweep-0006").setValue(0);
        sweep.property("CC Light Sweep-0007").setValue(0);
        sweep.property("CC Light Sweep-0008").setValue([1,1,1]);
        sweep.property("CC Light Sweep-0009").setValue(5);
    }catch(e){}

    var baseLayer=newComp.layers.addText("VICTORY ACHIEVED");
    baseLayer.name="Base";
    var bp=baseLayer.property("ADBE Text Properties").property("ADBE Text Document");
    var bd=bp.value;
    bd=makeTextDoc(bd);
    bp.setValue(bd);
    try{
        var bd2 = baseLayer.property("ADBE Text Properties").property("ADBE Text Document").value;
        bd2.fillColor = TEXT_COLOR;
        bd2.applyFill = true;
        baseLayer.property("ADBE Text Properties").property("ADBE Text Document").setValue(bd2);
    }catch(e){}
    baseLayer.property("ADBE Transform Group").property("ADBE Position").setValue([960,555]);
    baseLayer.parent=lightLayer;
    try{ baseLayer.property("ADBE Transform Group").property("ADBE Scale").setValue([100,100]); }catch(e){}
    try{ baseLayer.property("ADBE Text Properties").property("ADBE Text Document").expression='thisComp.layer("Light Burst").text.sourceText'; }catch(e){}
    try{ baseLayer.property("ADBE Transform Group").property("ADBE Opacity").expression='thisComp.layer("Light Burst").transform.opacity'; }catch(e){}
    baseLayer.moveAfter(lightLayer);

    if(originalComp){
        var compLayer=originalComp.layers.add(newComp);
        compLayer.name=compName;
        compLayer.startTime=currentTime;
        if(selectedLayer) compLayer.moveBefore(selectedLayer);
        else compLayer.moveToBeginning();
    }
    app.endUndoGroup();
}

/*
    Quick Glow
*/

function QuickGlow() {
    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition and at least one layer.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select at least one layer.");
        return;
    }

    app.beginUndoGroup("QuickGlow");

    // Current time as start of ramp
    var t0 = comp.time;
    var t1 = t0 + 1.0; // 1 second later

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var fxParade = layer.property("ADBE Effect Parade");

        // --- Effect 2 (We create bottom first, so final order is correct) ---
        // The spec says: Outer Halo should be on the BOTTOM of Inner Halo
        // If we add effects, newest is added at top of stack visually? Actually addProperty adds to bottom of effect stack UI.
        // So to guarantee order: Create Inner first, then Outer -> Outer will be below Inner.
        // We'll do Inner then Outer.

        // --- Effect 1: Glow Inner Halo (TOP) ---
        var innerGlow = fxParade.addProperty("ADBE Glo2");
        innerGlow.name = "Glow Inner Halo";

        // Settings - ONLY set what you specified
        // [2] Glow Threshold - ADBE Glo2-0002 - 0-255 range
        innerGlow.property("ADBE Glo2-0002").setValue(127); // 50% of 255
        // [5] Composite Original - ADBE Glo2-0005 : 1 = On Top
        try {
            innerGlow.property("ADBE Glo2-0005").setValue(1); // On Top
        } catch(e) {}

        // [3] Glow Radius - ADBE Glo2-0003 - Keyframe 0 -> 50 over 1s
        var innerRadius = innerGlow.property("ADBE Glo2-0003");
        innerRadius.setValueAtTime(t0, 0);
        innerRadius.setValueAtTime(t1, 50);

        // [4] Glow Intensity - ADBE Glo2-0004 - Keyframe 0 -> 3 over 1s
        var innerIntensity = innerGlow.property("ADBE Glo2-0004");
        innerIntensity.setValueAtTime(t0, 0);
        innerIntensity.setValueAtTime(t1, 3);
    }

    app.endUndoGroup();
}

/*
    IntenseGlow - 1-Click Double Glow
    Applies two ADBE Glo2 effects with keyframed intensity (0 -> target in 1 sec)

    Installation:
    - AE: File > Scripts > Run Script File > IntenseGlow.jsx
    - Or place in: (AE Folder)/Scripts/ScriptUI Panels/

    Usage: Select one or more layers, run the script.
*/

function IntenseGlow() {
    var comp = app.project.activeItem;

    if (!(comp && comp instanceof CompItem)) {
        alert("Please select a composition and at least one layer.");
        return;
    }

    var selectedLayers = comp.selectedLayers;
    if (selectedLayers.length === 0) {
        alert("Please select at least one layer.");
        return;
    }

    app.beginUndoGroup("IntenseGlow");

    // Current time as start of ramp
    var t0 = comp.time;
    var t1 = t0 + 1.0; // 1 second later

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var fxParade = layer.property("ADBE Effect Parade");

        // --- Effect 2 (We create bottom first, so final order is correct) ---
        // The spec says: Outer Halo should be on the BOTTOM of Inner Halo
        // If we add effects, newest is added at top of stack visually? Actually addProperty adds to bottom of effect stack UI.
        // So to guarantee order: Create Inner first, then Outer -> Outer will be below Inner.
        // We'll do Inner then Outer.

        // --- Effect 1: Glow Inner Halo (TOP) ---
        var innerGlow = fxParade.addProperty("ADBE Glo2");
        innerGlow.name = "Glow Inner Halo";

        // Settings - ONLY set what you specified
        // [2] Glow Threshold - ADBE Glo2-0002 - 0-255 range
        innerGlow.property("ADBE Glo2-0002").setValue(127); // 50% of 255
        // [5] Composite Original - ADBE Glo2-0005 : 1 = On Top
        try {
            innerGlow.property("ADBE Glo2-0005").setValue(1); // On Top
        } catch(e) {}

        // [3] Glow Radius - ADBE Glo2-0003 - Keyframe 0 -> 50 over 1s
        var innerRadius = innerGlow.property("ADBE Glo2-0003");
        innerRadius.setValueAtTime(t0, 0);
        innerRadius.setValueAtTime(t1, 50);

        // [4] Glow Intensity - ADBE Glo2-0004 - Keyframe 0 -> 3 over 1s
        var innerIntensity = innerGlow.property("ADBE Glo2-0004");
        innerIntensity.setValueAtTime(t0, 0);
        innerIntensity.setValueAtTime(t1, 3);

        // --- Effect 2: Glow Outer Halo (BOTTOM) ---
        var outerGlow = fxParade.addProperty("ADBE Glo2");
        outerGlow.name = "Glow Outer Halo";

        outerGlow.property("ADBE Glo2-0002").setValue(255); // 100% = 255

        try {
            outerGlow.property("ADBE Glo2-0005").setValue(1); // On Top
        } catch(e) {}

        // Radius 0 -> 100
        var outerRadius = outerGlow.property("ADBE Glo2-0003");
        outerRadius.setValueAtTime(t0, 0);
        outerRadius.setValueAtTime(t1, 100);

        // Intensity 0 -> 2
        var outerIntensity = outerGlow.property("ADBE Glo2-0004");
        outerIntensity.setValueAtTime(t0, 0);
        outerIntensity.setValueAtTime(t1, 2);
    }

    app.endUndoGroup();
}

/* RainbowRefraction - MASTER FUNCTION vFinal
   One-click build + adds to selected layer at CTI
*/

/*RAINBOW REFRACTION*/
function createLightStreak(comp, opts) {
    opts = opts || {};
    var width  = opts.width  || 1800;
    var height = opts.height || 28;
    var pos    = opts.position || [comp.width / 2, comp.height / 2];
    var name   = opts.name || "Light Streak";
    var layer = comp.layers.addShape();
    layer.name = name;
    var group = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var gc = group.property("ADBE Vectors Group");
    var ellipse = gc.addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("ADBE Vector Ellipse Size").setValue([width, height]);
    var fill = gc.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
    layer.property("ADBE Transform Group").property("ADBE Position").setValue(pos);
    var ramp = layer.property("ADBE Effect Parade").addProperty("ADBE Ramp");
    ramp.property("ADBE Ramp-0001").setValue([pos[0] - width / 2, pos[1]]);
    ramp.property("ADBE Ramp-0003").setValue([pos[0] + width / 2, pos[1]]);
    ramp.property("ADBE Ramp-0005").setValue(1);
    layer.property("ADBE Effect Parade").addProperty("APC Colorama");
    var blur = layer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
    blur.property("ADBE Gaussian Blur 2-0001").setValue(30);
    return layer;
}

function RainbowRefraction() {
    app.beginUndoGroup("RainbowRefraction");

    var originalComp = null;
    var originalSelLayer = null;
    var currentTime = 0;

    if(app.project && app.project.activeItem && app.project.activeItem instanceof CompItem){
        originalComp = app.project.activeItem;
        currentTime = originalComp.time;
        if(originalComp.selectedLayers && originalComp.selectedLayers.length>0){
            originalSelLayer = originalComp.selectedLayers[0];
        }
    }

    function findComp(name){
        for(var i=1;i<=app.project.numItems;i++){
            var it=app.project.item(i);
            if(it instanceof CompItem && it.name==name) return it;
        }
        return null;
    }

    var soloComp = findComp("SoloStreak");
    if(soloComp){ soloComp.duration=60; soloComp.width=2500; soloComp.height=200; while(soloComp.numLayers>0) soloComp.layer(1).remove(); }
    else { soloComp = app.project.items.addComp("SoloStreak", 2500, 200, 1, 60, 24); }
    soloComp.bgColor=[0,0,0]; soloComp.bitsPerChannel=16;
    createLightStreak(soloComp,{width:1800,height:28,position:[1250,100],name:"Light Streak"});

    var singleComp = findComp("SingleLightStreak");
    if(singleComp){ singleComp.duration=60; singleComp.width=2500; singleComp.height=200; while(singleComp.numLayers>0) singleComp.layer(1).remove(); }
    else { singleComp = app.project.items.addComp("SingleLightStreak", 2500, 200, 1, 60, 24); }
    singleComp.bgColor=[0,0,0]; singleComp.bitsPerChannel=16;
    var soloLayer = singleComp.layers.add(soloComp);
    soloLayer.name="SoloStreak";
    var posProp = soloLayer.property("Position");
    var opProp = soloLayer.property("Opacity");
    posProp.setValueAtTime(0, [910, 100]); posProp.setValueAtTime(2, [1705, 100]); posProp.setValueAtTime(3, [1705, 100]);
    opProp.setValueAtTime(0, 0); opProp.setValueAtTime(0.15, 100); opProp.setValueAtTime(1.85, 100); opProp.setValueAtTime(2, 0); opProp.setValueAtTime(3, 0);
    posProp.expression = 'loopOut("cycle")'; opProp.expression = 'loopOut("cycle")';

    var radialComp = findComp("RadialRainbow");
    if(radialComp){ radialComp.duration=60; radialComp.width=1920; radialComp.height=1080; while(radialComp.numLayers>0) radialComp.layer(1).remove(); }
    else { radialComp = app.project.items.addComp("RadialRainbow", 1920, 1080, 1, 60, 24); }
    radialComp.bgColor=[0,0,0]; radialComp.bitsPerChannel=16;
    var center = radialComp.layers.addNull(); center.name="CENTER"; center.property("Position").setValue([960,540]);
    var seed=7; function rand(a,b){ seed=(seed*9301+49297)%233280; return a+(seed/233280)*(b-a); }
    for(var n=0;n<12;n++){
        var streakNum=n+1; var lyr=radialComp.layers.add(singleComp); lyr.name="Streak_"+streakNum;
        var len=rand(7,21.25); var thick=rand(45,80);
        if(streakNum==2||streakNum==8){ len*=0.75; thick*=0.75; }
        if(streakNum==2||streakNum==3){ thick*=2; }
        lyr.property("Scale").setValue([len, thick, 100]);
        var baseAng=(360/12)*n; var ang=baseAng+rand(-22,22);
        if(streakNum==9) ang-=12; if(streakNum==10) ang+=12; if(streakNum==5) ang-=10; if(streakNum==6) ang+=14;
        lyr.property("Rotation").setValue(ang);
        var dist=rand(350,650); if(streakNum==9) dist-=80; if(streakNum==10) dist+=80; if(streakNum==5) dist-=60; if(streakNum==6) dist+=60;
        lyr.property("Position").setValue([960+Math.cos(ang*Math.PI/180)*dist, 540+Math.sin(ang*Math.PI/180)*dist]);
        lyr.startTime=rand(0,4); try{ lyr.blendingMode=BlendingMode.ADD; }catch(e){} lyr.property("Opacity").setValue(rand(70,100));
    }

    if(originalComp && originalComp != radialComp && originalComp != soloComp && originalComp != singleComp){
        try {
            var added = originalComp.layers.add(radialComp);
            added.name = "RadialRainbow";
            try { added.collapseTransformation = true; } catch(e){}
            try { added.blendingMode = BlendingMode.ADD; } catch(e2){}
            added.startTime = currentTime;
            if(originalSelLayer){
                try {
                    var stillExists = false;
                    for(var i=1;i<=originalComp.numLayers;i++){ if(originalComp.layer(i) === originalSelLayer) { stillExists=true; break; } }
                    if(stillExists){ added.moveBefore(originalSelLayer); }
                } catch(eMove){}
            }
        } catch(eAdd){}
    }

    if(!originalComp){ radialComp.openInViewer(); }

    app.endUndoGroup();
}

/*
Chromatic Abberation
*/
function ChromaticAbberation() {
    app.beginUndoGroup("Fake CA - Fixed Placement");

    var comp = app.project.activeItem;
    if (!(comp && comp instanceof CompItem)) {
        alert("Select a comp and a layer.");
        app.endUndoGroup();
        return;
    }
    if (comp.selectedLayers.length === 0) {
        alert("Select a layer first.");
        app.endUndoGroup();
        return;
    }

    var origLayer = comp.selectedLayers[0];
    var origName = origLayer.name;
    var origIndex = origLayer.index;
    var offset = 8;

    // STEP 1: Original -> SOURCE (keeps origIndex)
    var sourceCompName = "CA_SOURCE - " + origName;
    comp.layers.precompose([origIndex], sourceCompName, true);

    // Get fresh ref - it's at origIndex
    var baseLayer = comp.layer(origIndex);
    baseLayer.name = sourceCompName + " - BASE";

    // STEP 2: Duplicate at same spot (duplicate places above)
    // After first duplicate: new layer at origIndex, base pushes to origIndex+1
    var blueLayer = baseLayer.duplicate();
    blueLayer.name = sourceCompName + " - BLUE";
    
    var redLayer = baseLayer.duplicate();
    redLayer.name = sourceCompName + " - RED";

    // Now we have 3 contiguous layers at origIndex area:
    // Index: origIndex = RED (top), origIndex+1 = BLUE (middle), origIndex+2 = BASE (bottom)
    // This is perfect: BASE bottommost as requested

    // STEP 3: Apply effects

    // BASE - no changes, bottommost
    try { baseLayer.blendingMode = BlendingMode.NORMAL; } catch(e) {}
    baseLayer.property("ADBE Transform Group").property("ADBE Opacity").setValue(100);

    // BLUE - 50% Lighten, upper right, Shift 1,1,10,4
    var shB = blueLayer.property("ADBE Effect Parade").addProperty("ADBE Shift Channels");
    shB.name = "Shift - Blue";
    try {
        shB.property("ADBE Shift Channels-0001").setValue(1);  // Red = Off
        shB.property("ADBE Shift Channels-0002").setValue(10);  // Green = Off
        shB.property("ADBE Shift Channels-0003").setValue(10); // Blue = Blue (your value)
        shB.property("ADBE Shift Channels-0004").setValue(4);  // Alpha = Alpha (your value)
    } catch(e) {}
    try { blueLayer.blendingMode = BlendingMode.LIGHTEN; } catch(e) {
        try { blueLayer.property("ADBE Transform Group").property("ADBE Blend Mode").setValue(17); } catch(e2) {}
    }
    var posB = blueLayer.property("ADBE Transform Group").property("ADBE Position").value;
    posB[0] = posB[0] + offset;
    posB[1] = posB[1] - offset;
    blueLayer.property("ADBE Transform Group").property("ADBE Position").setValue(posB);
    blueLayer.property("ADBE Transform Group").property("ADBE Opacity").setValue(50);

    // RED - 50% Lighten, lower left, Shift 10,1,1,4 (mirrored from your blue spec)
    var shR = redLayer.property("ADBE Effect Parade").addProperty("ADBE Shift Channels");
    shR.name = "Shift - Red";
    try {
        shR.property("ADBE Shift Channels-0001").setValue(1); // Red = Red
        shR.property("ADBE Shift Channels-0002").setValue(2);  // Green = Off
        shR.property("ADBE Shift Channels-0003").setValue(10);  // Blue = Off
        shR.property("ADBE Shift Channels-0004").setValue(10);  // Alpha = Alpha
    } catch(e) {}
    try { redLayer.blendingMode = BlendingMode.LIGHTEN; } catch(e) {
        try { redLayer.property("ADBE Transform Group").property("ADBE Blend Mode").setValue(17); } catch(e2) {}
    }
    var posR = redLayer.property("ADBE Transform Group").property("ADBE Position").value;
    posR[0] = posR[0] - offset;
    posR[1] = posR[1] + offset;
    redLayer.property("ADBE Transform Group").property("ADBE Position").setValue(posR);
    redLayer.property("ADBE Transform Group").property("ADBE Opacity").setValue(50);

    // STEP 4: Precompose R/G/B into FINAL
    // Indices are contiguous at origIndex
    var indices = [redLayer.index, blueLayer.index, baseLayer.index];
    indices.sort(function(a,b){return a-b;});

    comp.layers.precompose(indices, "CA_FINAL - " + origName, true);
    var finalLayer = comp.selectedLayers[0];
    finalLayer.name = "CA_FINAL - " + origName;

    // FORCE placement back to original index (AE often puts new precomp at top)
    // Move it to origIndex
    try {
        if (finalLayer.index !== origIndex) {
            // If final is above origIndex, we need to move it down
            // Move after the layer that is currently at origIndex-1, repeatedly
            while (finalLayer.index < origIndex && finalLayer.index < comp.numLayers) {
                var nextLayer = comp.layer(finalLayer.index + 1);
                if (nextLayer) finalLayer.moveAfter(nextLayer);
                else break;
            }
            while (finalLayer.index > origIndex) {
                var prevLayer = comp.layer(finalLayer.index - 1);
                if (prevLayer) finalLayer.moveBefore(prevLayer);
                else break;
            }
        }
    } catch(e) {
        // Fallback: just try moveBefore layer at origIndex
        try {
            var target = comp.layer(origIndex);
            if (target && target !== finalLayer) finalLayer.moveBefore(target);
        } catch(e2) {}
    }

    app.endUndoGroup();
}

// Keep this on the bottom!
var myUI = JJQuickTools(this);
if (myUI instanceof Window) {
    myUI.center();
    myUI.show();
} else {
    myUI.layout.layout(true);
}
