/*
    JJ Media Panel - After Effects ScriptUI panel
    Install: copy to  ...\Support Files\Scripts\ScriptUI Panels\  then open from the Window menu.

    Emoji are written as \u escapes so the file survives any text encoding.
    Swap them in the EMOJI block below if one shows as an empty box.
*/
(function MediaPanel(thisObj) {

    // ---------- Config ----------
    var SECTION = "JJMediaPanel";
    var KEY_FOLDER = "folder";
    // Videos and pictures. WebP is left out on purpose: AE does not import it. Add |webp here only if your AE can.
    var VIDEO_RE = /\.(mp4|mov|png|jpg|jpeg|gif)$/i;
    var BIN_IMAGE = "STOCK IMAGE";                  // png, jpg, jpeg, gif
    var BIN_VIDEO = "STOCK VIDEO";                  // everything else (mp4, mov)
    var IMAGE_RE = /\.(png|jpg|jpeg|gif)$/i;
    var UNCAT = "Uncategorized";
    var ALL = "All";

    var EMOJI_SWAP = "\u267E\uFE0F";        // infinity
    var EMOJI_FOLDER = "\uD83D\uDCC1";      // folder
    var EMOJI_REFRESH = "\uD83D\uDD04";     // refresh
    var EMOJI_SEARCH = "\uD83D\uDD0D";      // magnifier
    var EMOJI_CLEAR = "\u274C";             // cross

    // Sizes (same as JJ_Quick_Tools)
    var PANEL_W = 200;
    var MARGIN = 4;
    var SPACING = 2;
    var BTN_W = 30;
    var BTN_H = 22;
    var FIELD_W = 60;       // search field / dropdown preferred width, they stretch to fill the row
    var FIELD_MIN = 20;     // ...and squeeze down to this, so fixed-size buttons are never overlapped
    var LIST_W = 192;
    var LIST_H = 200;

    var INDENT = "     ";                   // videos are indented under their grey category row

    var RED_COLOR = [0.45, 0.08, 0.08, 1];  // Auto-search off
    var GREEN_COLOR = [0.1, 0.4, 0.15, 1];  // Quick Swap on
    var BTN_FONT = ScriptUI.newFont("dialog", "REGULAR", 12);
    var LIST_FONT = ScriptUI.newFont("dialog", "REGULAR", 12);

    // ---------- State ----------
    var allVideos = [];        // {name, lower, path, category, tags}
    var rows = [];          // one entry per listbox row: the video record, or null for a category row
    var nameIndex = {};     // "n_" + lowercase file name -> true (swap lookup)
    var dupeCount = 0;
    var matchCount = 0;
    var folderSet = false;
    var swapOn = false;     // Quick Swap, off by default
    var autoSearch = true;  // search as you type, on by default
    var busy = false;       // true while we change the dropdown/list ourselves
    var ui = {};

    // ---------- Settings / scanning ----------
    function getSavedFolder() {
        if (app.settings.haveSetting(SECTION, KEY_FOLDER)) {
            var f = new Folder(app.settings.getSetting(SECTION, KEY_FOLDER));
            if (f.exists) return f;
        }
        return null;
    }

    // ---------- Name tags ----------
    // Tags sit at the end of the file name, before the extension, chained with underscores:
    //   Clip_fw_m-screen_tli_p.mp4
    // They are read from the end, one at a time, while each piece is a known tag. The first unknown piece stops
    // the reading, so "Show_p_final.mp4" has no tags. If two tags conflict (_fw and _fh, two mattes...) the one
    // closest to the end of the name wins.
    //   _fw / _fh            scale to fit width / height
    //   _m-<mode>            blend mode, e.g. _m-screen
    //   _ta _tai _tl _tli    alpha / inverted alpha / luma / inverted luma matte of the selected layer
    //   _p                   parent to the selected layer
    //   _keep / _override    Quick Swap only: keep the layer's settings / apply tags without removing anything else
    var MODE_NAMES = {
        normal: "NORMAL", add: "ADD", screen: "SCREEN", multiply: "MULTIPLY", overlay: "OVERLAY",
        softlight: "SOFT_LIGHT", hardlight: "HARD_LIGHT", lighten: "LIGHTEN", darken: "DARKEN",
        difference: "DIFFERENCE", exclusion: "EXCLUSION", colordodge: "COLOR_DODGE", colorburn: "COLOR_BURN",
        lineardodge: "LINEAR_DODGE", linearburn: "LINEAR_BURN", hue: "HUE", saturation: "SATURATION",
        color: "COLOR", luminosity: "LUMINOSITY", hardmix: "HARD_MIX", vividlight: "VIVID_LIGHT",
        linearlight: "LINEAR_LIGHT", pinlight: "PIN_LIGHT", lightercolor: "LIGHTER_COLOR",
        darkercolor: "DARKER_COLOR", dissolve: "DISSOLVE"
    };
    var MATTE_TAGS = { ta: "alpha", tai: "alphaInv", tl: "luma", tli: "lumaInv" };

    function parseTags(fileName) {
        var base = fileName.replace(/\.[^.]*$/, "");
        var t = { fit: null, mode: null, matte: null, parent: false, swap: null };
        while (true) {
            var i = base.lastIndexOf("_");
            if (i < 0) break;
            var seg = base.substring(i + 1).toLowerCase();
            if (seg === "fw" || seg === "fh") {
                if (t.fit === null) t.fit = seg.charAt(1);
            } else if (MATTE_TAGS.hasOwnProperty(seg)) {
                if (t.matte === null) t.matte = MATTE_TAGS[seg];
            } else if (seg === "p") {
                t.parent = true;
            } else if (seg === "keep" || seg === "override") {
                if (t.swap === null) t.swap = seg;
            } else if (seg.indexOf("m-") === 0 && MODE_NAMES.hasOwnProperty(seg.substring(2))) {
                if (t.mode === null) t.mode = seg.substring(2);
            } else {
                break;
            }
            base = base.substring(0, i);
        }
        return t;
    }

    function scanFolder(root) {
        var out = [];
        function walk(folder, category) {
            var items = folder.getFiles();
            for (var i = 0; i < items.length; i++) {
                var it = items[i];
                var nm = decodeURI(it.name);
                if (it instanceof Folder) {
                    if (nm.charAt(0) === ".") continue;
                    // top-level subfolder is the category, deeper folders inherit it
                    walk(it, category === null ? nm : category);
                } else if (VIDEO_RE.test(nm)) {
                    out.push({
                        name: nm,
                        lower: nm.toLowerCase(),
                        path: it.fsName,
                        category: category === null ? UNCAT : category,
                        tags: parseTags(nm)
                    });
                }
            }
        }
        walk(root, null);
        out.sort(function (a, b) {
            return a.lower < b.lower ? -1 : (a.lower > b.lower ? 1 : 0);
        });
        return out;
    }

    function rescan() {
        var folder = getSavedFolder();
        allVideos = [];
        nameIndex = {};
        dupeCount = 0;
        folderSet = !!folder;
        if (folder) {
            allVideos = scanFolder(folder);
            for (var i = 0; i < allVideos.length; i++) {
                var key = "n_" + allVideos[i].lower;
                if (nameIndex[key]) dupeCount++;
                else nameIndex[key] = true;
            }
        }
        rebuildCategories();
        applyFilter();
    }

    // ---------- List / filter ----------
    function getTokens() {
        var q = ui.search.text.toLowerCase().replace(/^\s+|\s+$/g, "");
        return (q === "") ? [] : q.split(/\s+/);
    }

    function rebuildCategories() {
        var prev = ui.dd.selection ? ui.dd.selection.text : ALL;
        var seen = {};
        var cats = [];
        for (var i = 0; i < allVideos.length; i++) {
            var c = allVideos[i].category;
            if (!seen["c_" + c]) {
                seen["c_" + c] = true;
                cats.push(c);
            }
        }
        cats.sort(function (a, b) {
            var x = a.toLowerCase(), y = b.toLowerCase();
            return x < y ? -1 : (x > y ? 1 : 0);
        });
        busy = true;
        ui.dd.removeAll();
        ui.dd.add("item", ALL);
        var sel = 0;
        for (var j = 0; j < cats.length; j++) {
            ui.dd.add("item", cats[j]);
            if (cats[j] === prev) sel = j + 1;
        }
        ui.dd.selection = sel;
        busy = false;
    }

    function applyFilter() {
        var tokens = getTokens();
        var wantCat = ui.dd.selection ? ui.dd.selection.text : ALL;

        var groups = {};
        var order = [];
        matchCount = 0;
        for (var i = 0; i < allVideos.length; i++) {
            var rec = allVideos[i];
            if (wantCat !== ALL && rec.category !== wantCat) continue;
            var ok = true;
            for (var t = 0; t < tokens.length; t++) {
                if (rec.lower.indexOf(tokens[t]) === -1) { ok = false; break; }
            }
            if (!ok) continue;
            var k = "c_" + rec.category;
            if (!groups[k]) { groups[k] = []; order.push(rec.category); }
            groups[k].push(rec);
            matchCount++;
        }
        order.sort(function (a, b) {
            var x = a.toLowerCase(), y = b.toLowerCase();
            return x < y ? -1 : (x > y ? 1 : 0);
        });

        rows = [];
        ui.list.removeAll();
        for (var c = 0; c < order.length; c++) {
            var cat = order[c];
            var items = groups["c_" + cat];
            var head = ui.list.add("item", cat);
            head.enabled = false;           // grey and unselectable
            rows.push(null);
            for (var j = 0; j < items.length; j++) {
                ui.list.add("item", INDENT + items[j].name);
                rows.push(items[j]);
            }
        }
    }

    // ---------- Project helpers ----------
    function getBin(binName) {
        var root = app.project.rootFolder;
        for (var i = 1; i <= app.project.numItems; i++) {
            var it = app.project.item(i);
            if (it instanceof FolderItem && it.name === binName && it.parentFolder === root) return it;
        }
        return app.project.items.addFolder(binName);
    }

    function findFootage(file) {
        var target = file.fsName.toLowerCase();
        for (var i = 1; i <= app.project.numItems; i++) {
            var it = app.project.item(i);
            if (it instanceof FootageItem && it.file && it.file.fsName.toLowerCase() === target) return it;
        }
        return null;
    }

    function getFootage(file) {
        var existing = findFootage(file);
        if (existing) return existing;
        var item = app.project.importFile(new ImportOptions(file));
        item.parentFolder = getBin(IMAGE_RE.test(file.name) ? BIN_IMAGE : BIN_VIDEO);
        return item;
    }

    function selectOnly(comp, layer) {
        var sel = comp.selectedLayers;
        for (var i = 0; i < sel.length; i++) sel[i].selected = false;
        layer.selected = true;
    }

    // Quick Swap target: exactly one selected, a footage video layer, name is a file in our list
    function findSwapTarget(comp) {
        var sel = comp.selectedLayers;
        if (sel.length !== 1) return null;
        var l = sel[0];
        if (!(l instanceof AVLayer)) return null;
        if (!l.hasVideo || !(l.source instanceof FootageItem)) return null;
        if (!nameIndex["n_" + l.name.toLowerCase()]) return null;
        return l;
    }

    // Pictures have no duration of their own
    function isStill(footage) {
        try { return footage.mainSource.isStill; } catch (e) {}
        return footage.duration === 0;
    }

    // ---------- Applying tags ----------
    function setScale(layer, pct) {
        try {
            var prop = layer.property("ADBE Transform Group").property("ADBE Scale");
            if (prop.numKeys > 0) return;       // leave keyframed scale alone
            prop.setValue(layer.threeDLayer ? [pct, pct, pct] : [pct, pct]);
        } catch (e) {}
    }

    // which: "w" fit width, "h" fit height. Same scale on both axes, so no stretching.
    function fitLayer(comp, layer, which) {
        var src = layer.source;
        var par = (src.pixelAspect || 1) / (comp.pixelAspect || 1);
        var s = (which === "w") ? comp.width / (src.width * par) : comp.height / src.height;
        setScale(layer, s * 100);
    }

    function setBlend(layer, modeKey) {
        var bm = BlendingMode[MODE_NAMES[modeKey]];
        if (bm !== undefined) layer.blendingMode = bm;
    }

    // matteLayer becomes the matte of user (the layer below it)
    function applyMatte(matteLayer, user, kind) {
        if (!(user instanceof AVLayer)) return;
        var types = {
            alpha: TrackMatteType.ALPHA,
            alphaInv: TrackMatteType.ALPHA_INVERTED,
            luma: TrackMatteType.LUMA,
            lumaInv: TrackMatteType.LUMA_INVERTED
        };
        try {
            user.setTrackMatte(matteLayer, types[kind]);    // AE 2023 and later
        } catch (e) {
            user.trackMatteType = types[kind];              // older AE: the matte must sit directly above, and it does
        }
    }

    // The layer that currently uses `layer` as its track matte, or null
    function findMatteUser(comp, layer) {
        for (var i = 1; i <= comp.numLayers; i++) {
            var l = comp.layer(i);
            try {
                if (l.hasTrackMatte && l.trackMatteLayer && l.trackMatteLayer.index === layer.index) return l;
            } catch (e) {}
        }
        if (layer.index < comp.numLayers) {     // older AE: the matte sits directly above the layer that uses it
            var below = comp.layer(layer.index + 1);
            try {
                if (below.hasTrackMatte && below.trackMatteLayer === undefined) return below;
            } catch (e) {}
        }
        return null;
    }

    // ---------- Add / swap ----------
    function addLayer(comp, footage, rec) {
        var t = comp.time;

        // remember the selected layer (topmost one if several) before adding, since adding changes the stack
        var anchor = null;
        var sel = comp.selectedLayers;
        for (var i = 0; i < sel.length; i++) {
            if (!anchor || sel[i].index < anchor.index) anchor = sel[i];
        }

        var layer = comp.layers.add(footage);
        layer.startTime = t;                    // in-point at the current time
        layer.name = rec.name;
        if (isStill(footage)) layer.outPoint = comp.duration;   // pictures run to the end of the comp
        if (anchor) layer.moveBefore(anchor);   // sits directly above the selected layer

        var tags = rec.tags;
        if (tags.fit) fitLayer(comp, layer, tags.fit);
        if (tags.mode) setBlend(layer, tags.mode);
        if (tags.matte && anchor) applyMatte(layer, anchor, tags.matte);    // needs a selected layer
        if (tags.parent && anchor) layer.parent = anchor;                   // needs a selected layer
        selectOnly(comp, layer);                // only the new layer is selected
    }

    // Quick Swap. Default is a true reset (new file's tags applied, everything else back to normal),
    // _keep leaves the layer alone, _override applies the new file's tags and removes nothing.
    function swapLayer(comp, target, footage, rec) {
        var tags = rec.tags;
        var mode = tags.swap || "reset";

        var oldIn = target.inPoint;             // visible (trimmed) in-point of the old layer
        var oldOut = target.outPoint;
        var oldParent = target.parent;
        var matteUser = findMatteUser(comp, target);

        target.replaceSource(footage, false);
        target.name = rec.name;
        target.startTime = oldIn;               // new video begins at the old in-point
        target.inPoint = oldIn;
        if (isStill(footage)) target.outPoint = oldOut;     // a picture has no length, keep the old out-point
        else target.outPoint = oldIn + footage.duration;

        if (mode === "reset") {
            if (tags.fit) fitLayer(comp, target, tags.fit); else setScale(target, 100);
            setBlend(target, tags.mode ? tags.mode : "normal");
            if (matteUser) {
                try { matteUser.trackMatteType = TrackMatteType.NO_TRACK_MATTE; } catch (e1) {}
            }
            target.parent = null;
            // matte and parent tags re-apply to the layer it was already working with
            if (tags.matte && matteUser) applyMatte(target, matteUser, tags.matte);
            if (tags.parent && oldParent) target.parent = oldParent;
        } else if (mode === "override") {
            if (tags.fit) fitLayer(comp, target, tags.fit);
            if (tags.mode) setBlend(target, tags.mode);
            if (tags.matte && matteUser) applyMatte(target, matteUser, tags.matte);
        }
        // "keep": nothing else is touched

        comp.time = oldIn;                      // playhead to the same spot
        selectOnly(comp, target);               // stays selected so the next double-click can swap again
    }

    function addVideo(rec) {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert("Open a comp first.");
            return;
        }
        var file = new File(rec.path);
        if (!file.exists) {
            alert("File not found:\n" + rec.path);
            return;
        }
        app.beginUndoGroup("Media: " + rec.name);
        try {
            var footage = getFootage(file);
            var target = swapOn ? findSwapTarget(comp) : null;
            if (target) swapLayer(comp, target, footage, rec);
            else addLayer(comp, footage, rec);
        } catch (e) {
            alert("Media panel error:\n" + e.toString() + " (line " + e.line + ")");
        }
        app.endUndoGroup();
    }

    // ---------- UI helpers ----------
    function fixSize(ctrl, w, h) {
        ctrl.preferredSize = [w, h];
        ctrl.minimumSize = [w, h];
        ctrl.maximumSize = [w, h];
    }

    function makeButton(parent, emoji, tip) {
        var b = parent.add("button", undefined, emoji);
        fixSize(b, BTN_W, BTN_H);
        b.graphics.font = BTN_FONT;
        b.helpTip = tip;
        return b;
    }

    // Toggle = two buttons stacked in one slot (same trick as Quick Tools).
    // One is the plain default button, the other is drawn in customColor.
    // customWhenOn true: coloured while ON. false: coloured while OFF.
    function makeToggle(parent, emoji, label, initial, customColor, customWhenOn, onChange) {
        var isOn = initial;
        var stack = parent.add("group");
        stack.orientation = "stack";
        stack.margins = 0;
        stack.spacing = 0;
        fixSize(stack, BTN_W, BTN_H);

        var plain = stack.add("button", undefined, emoji);
        var colored = stack.add("button", undefined, emoji);
        var both = [plain, colored];
        for (var i = 0; i < both.length; i++) {
            fixSize(both[i], BTN_W, BTN_H);
            both[i].graphics.font = BTN_FONT;
        }

        colored.onDraw = function () {
            var g = this.graphics;
            var w = this.size.width, h = this.size.height;
            g.newPath();
            g.rectPath(0, 0, w, h);
            g.fillPath(g.newBrush(g.BrushType.SOLID_COLOR, customColor));
            var sz = g.measureString(emoji, BTN_FONT);
            var tw = (sz.width !== undefined) ? sz.width : sz[0];
            var th = (sz.height !== undefined) ? sz.height : sz[1];
            g.drawString(emoji, g.newPen(g.PenType.SOLID_COLOR, [1, 1, 1, 1], 1), (w - tw) / 2, (h - th) / 2, BTN_FONT);
        };

        function refresh() {
            var showColored = (isOn === customWhenOn);
            colored.visible = showColored;
            plain.visible = !showColored;
            var tip = label + ": " + (isOn ? "ON" : "OFF");
            plain.helpTip = tip;
            colored.helpTip = tip;
        }

        function flip() {
            isOn = !isOn;
            refresh();
            onChange(isOn);
        }
        plain.onClick = flip;
        colored.onClick = flip;

        refresh();
        return stack;
    }

    // The search field and dropdown get exact widths instead of relying on "fill" along a row
    // (which doesn't spread space reliably). Both rows end at the same right edge:
    //   row 1 = field + 3 buttons, row 2 = dropdown + 2 buttons.
    // Below FIELD_MIN the buttons stay fixed and overflow on the right (cut off, never overlapped).
    function setFixedWidth(ctrl, w) {
        ctrl.alignment = ["left", "center"];
        ctrl.preferredSize = [w, BTN_H];
        ctrl.minimumSize = [w, BTN_H];
        ctrl.maximumSize = [w, BTN_H];
    }

    function applyWidths(win) {
        var total = (win.size && win.size.width > 0) ? win.size.width : PANEL_W;
        var inner = total - MARGIN * 2;
        var w1 = inner - 3 * BTN_W - 3 * SPACING;
        var w2 = inner - 2 * BTN_W - 2 * SPACING;
        if (w1 < FIELD_MIN) w1 = FIELD_MIN;
        if (w2 < FIELD_MIN) w2 = FIELD_MIN;
        setFixedWidth(ui.search, w1);
        setFixedWidth(ui.ddHolder, w2);
    }

    // ---------- Naming note (shown before picking a folder) ----------
    var GUIDE_TEXT =
        "Note: Add tags to the end of a file name (before the extension) to set up the layer automatically.\n" +
        "_fw / _fh : scale to fit width / height\n" +
        "_m-screen : blend mode (also _m-multiply, _m-add, _m-overlay ...)\n" +
        "_ta / _tai : alpha matte / inverted, of the selected layer\n" +
        "_tl / _tli : luma matte / inverted, of the selected layer\n" +
        "_p : parent to the selected layer\n" +
        "Quick Swap resets the layer by default. _keep keeps its current settings, _override applies the tags without removing anything else.\n" +
        "i.e. \"Clip_fw_m-screen_p\"";

    // Add Folder / Cancel dialog. Returns true when Add Folder is pressed.
    function showNamingGuide() {
        var dlg = new Window("dialog", "Add Folder");
        dlg.orientation = "column";
        dlg.alignChildren = ["fill", "top"];
        dlg.margins = 12;
        dlg.spacing = 10;

        // rough height: about 52 characters fit on a line at this width
        var lines = GUIDE_TEXT.split("\n");
        var rows = 0;
        for (var i = 0; i < lines.length; i++) rows += Math.ceil(lines[i].length / 52);
        var txt = dlg.add("statictext", undefined, GUIDE_TEXT, { multiline: true });
        txt.preferredSize = [380, rows * 16 + 8];

        var btns = dlg.add("group");
        btns.alignment = ["right", "top"];
        btns.spacing = 8;
        var ok = btns.add("button", undefined, "Add Folder", { name: "ok" });
        var cancel = btns.add("button", undefined, "Cancel", { name: "cancel" });
        ok.preferredSize = [100, 32];
        cancel.preferredSize = [100, 32];

        return dlg.show() === 1;
    }

    // ---------- Build UI ----------
    function buildUI(host) {
        var win = (host instanceof Panel) ? host : new Window("palette", "JJ Media Panel", undefined, { resizeable: true });
        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.margins = MARGIN;
        win.spacing = SPACING;
        win.preferredSize = [PANEL_W, 300];

        // Row 1: search field, clear, auto-search, Quick Swap
        // Field and dropdown widths are set in applyWidths()
        var row = win.add("group");
        row.orientation = "row";
        row.alignChildren = ["left", "center"];
        row.margins = 0;
        row.spacing = SPACING;

        ui.search = row.add("edittext", undefined, "");
        ui.search.preferredSize = [FIELD_W, BTN_H];
        ui.search.minimumSize = [FIELD_MIN, BTN_H];
        ui.search.alignment = ["fill", "center"];
        ui.search.graphics.font = LIST_FONT;

        ui.clear = makeButton(row, EMOJI_CLEAR, "Clear search");
        makeToggle(row, EMOJI_SEARCH, "Auto-search", true, RED_COLOR, false, function (on) {
            autoSearch = on;
            if (on) applyFilter();
        });
        makeToggle(row, EMOJI_SWAP, "Quick Swap", false, GREEN_COLOR, true, function (on) {
            swapOn = on;
        });

        // Row 2: category dropdown, set folder, refresh
        var row2 = win.add("group");
        row2.orientation = "row";
        row2.alignChildren = ["left", "center"];
        row2.margins = 0;
        row2.spacing = SPACING;

        // The dropdown itself gets no fixed size (that broke its popup). It fills a holder group,
        // and the holder is the thing that gets the exact width in applyWidths().
        ui.ddHolder = row2.add("group");
        ui.ddHolder.orientation = "column";
        ui.ddHolder.margins = 0;
        ui.ddHolder.alignChildren = ["fill", "center"];
        ui.dd = ui.ddHolder.add("dropdownlist", undefined, [ALL]);
        ui.dd.preferredSize = [FIELD_W, BTN_H];
        ui.dd.selection = 0;

        ui.folderBtn = makeButton(row2, EMOJI_FOLDER, "Set media folder");
        ui.refreshBtn = makeButton(row2, EMOJI_REFRESH, "Rescan folder");

        // List: grey category rows, click selects, double-click applies
        ui.list = win.add("listbox", undefined, [], { multiselect: false });
        ui.list.alignment = ["fill", "fill"];
        ui.list.preferredSize = [LIST_W, LIST_H];
        ui.list.graphics.font = LIST_FONT;

        // Events
        ui.search.onChanging = function () { if (autoSearch) applyFilter(); };
        ui.search.onChange = function () { applyFilter(); };   // Enter / focus lost, works when auto-search is off
        ui.clear.onClick = function () {
            ui.search.text = "";
            applyFilter();
        };
        ui.folderBtn.onClick = function () {
            if (!showNamingGuide()) return;     // Cancel: leave the folder as it is
            var f = Folder.selectDialog("Choose your media folder");
            if (f) {
                app.settings.saveSetting(SECTION, KEY_FOLDER, f.fsName);
                rescan();
            }
        };
        ui.refreshBtn.onClick = function () { rescan(); };
        ui.dd.onChange = function () { if (!busy) applyFilter(); };

        ui.list.onDoubleClick = function () {
            var sel = ui.list.selection;
            if (!sel) return;
            var rec = rows[sel.index];      // null for category rows
            if (rec) addVideo(rec);
        };

        applyWidths(win);
        win.layout.layout(true);
        win.onResizing = win.onResize = function () {
            applyWidths(this);
            this.layout.layout(true);
            this.layout.resize();
        };
        return win;
    }

    // ---------- Run ----------
    var w = buildUI(thisObj);
    rescan();
    if (w instanceof Window) {
        w.center();
        w.show();
    }

})(this);
