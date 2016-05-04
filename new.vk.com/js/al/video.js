var Video = {
    regBR: new RegExp("<br>", "g"),
    CHANNEL_PREFIX: "channel",
    CATEGORY_PREFIX: "cat_",
    SIGNIFICANT_POSITIONS: 50,
    VIDEO_SEARCH_TYPE: "search_videos",
    VIDEO_GLOBAL_SEARCH_TYPE: "search_global_videos",
    ALBUM_SEARCH_TYPE: "search_albums",
    SEARCH_FILTERS: ["hd", "notsafe", "date", "order", "len"],
    AVAILABLE_TABS: ["all", "uploaded", "albums"],
    VIDEOS_PER_PAGE: 60,
    ALBUMS_PER_PAGE: 12,
    VIDEOS_PER_ROW: 3,
    PLAYLIST_OBJECT_ID_INDEX: 6,
    SEARCH_STATS_POSITION_FIELDS: ["oid", "vid", "clicked", "viewStarted", "viewedParts", "viewedSeconds"],
    getLoc: function() {
        return cur.curLoc ? cur.curLoc : (isEmpty(nav.objLoc) || !nav.objLoc[0] || 0 != nav.objLoc[0].indexOf("video")) && cur.section && inArray(cur.section, ["catalog",
            "all", "uploaded", "albums"
        ]) ? {
            0: "catalog" == cur.section ? "video" : "videos" + cur.oid
        } : nav.objLoc
    },
    init: function() {
        cur.searchInputEl = geByClass1("video_search_input"), cur.videoRecentlyRemoved = {}, cur.videoShowWindow = {}, cur.found = {}, cur.silentLoaded = {}, cur.currentSortings = {},
            cur._preloadedPages = {}, cur.videoSearchFilters = {}, cur.videoSearchStats = null, cur.videoSearchPos = null, cur.module = "video", cur.albumsPreload = cur.albumsPreload ||
            {}, cur.albumsShowingAll = {}, cur.curLoc = cur.query ? nav.fromStr(cur.query) : !1, cur._back = {
                hide: [function() {
                    removeEvent(window, "scroll", cur._ev_onScroll)
                }],
                show: [function() {
                    Video._initScroll()
                }]
            }, isObject(cur.curLoc) && (cur.curLoc.section = cur.section), cur.getOwnerId = function() {
                return cur.oid
            }, Video.initNavigation(), Video.initSearch(), Video.isInAlbum() || Video.loadSilent(), Video.loadSilent(Video.getLoc()
                .section);
        var e = Video._getCurrentSectionType();
        "catalog" == e ? (Videocat.init(), Video._preloadPage("all")) : (Video.initOwnerVideoPage(), vk.id == cur.getOwnerId() && -1 != Video.AVAILABLE_TABS.indexOf(e) &&
                Video._preloadPage("catalog")), cur.curLoc = !1, cur.section = !1, Video.getLoc()
            .q && (Video._prepareSearchFilters(Video.getLoc()), cur.searchText = Video.getLoc()
                .q, val(cur.searchInputEl, cur.searchText), Video.doSearch(Video.getLoc()
                    .q), Video._initScrollFixedSearch(!0)), cur.currentModule = function() {
                return Video.isInCatalog() ? "videocat" : "video"
            }, Video._initScroll(), addEvent(window, "beforeunload", function(e) {
                var o = Video.getLoc();
                return o[0].indexOf("video") >= 0 && o.q && Video.logSearchStats(), !0
            })
    },
    _initScroll: function() {
        cur._ev_onScroll && removeEvent(window, "scroll", cur._ev_onScroll), addEvent(window, "scroll", cur._ev_onScroll = Video.onScroll), cur.destroy.push(function() {
            removeEvent(window, "scroll", cur._ev_onScroll)
        })
    },
    _preloadPage: function(e) {
        ajax.post("al_video.php", {
            act: "s",
            section: e,
            preload: 1
        }, {
            onDone: function(o, i, t) {
                var r = cur.getOwnerId(),
                    d = cur.videosCount[r];
                extend(cur, i), extend(cur.videosCount[r], d), cur._preloadedPages = cur._preloadedPages || {}, cur._preloadedPages[e] = ce("div", {
                        innerHTML: o,
                        id: "video_content_" + e
                    }), cur._preloadedPages.other = t, cur._switchOnPagePreloaded && Video._switch.apply(Video, cur._switchOnPagePreloaded), cur._switchOnPagePreloaded = !
                    1
            }
        })
    },
    initOwnerVideoPage: function() {
        if (!cur._videoInited) {
            cur._videoInited = !0, cur.videoCanSort && (Video.isInAlbum() || (cur.albumsSorter = new GridSorter("video_albums_list", "video_playlist_item_a", {
                onReorder: Video._onAlbumReorder
            })), Video._createSorters());
            var e = ge("video_sort_dd");
            e && (cur.videoSortDD = new InlineDropdown(e, {
                items: cur.videoSortItems,
                withArrow: !0,
                selected: "default",
                onSelect: Video._sortVideos
            })), toggle("video_sort_dd_wrap", "albums" != Video.getLoc()
                .section)
        }
    },
    _switch: function(e, o) {
        var i = ge("video_content_" + o);
        if (!i && "undefined" == typeof cur._preloadedPages[o]) return cur._switchOnPagePreloaded = [e, o], !1;
        if (Video.doSearch(""), val(cur.searchInputEl, ""), hide("video_content_" + e), toggle("videocat_other_blocks", "catalog" != e), i || ge("video_layout_contents")
            .appendChild(cur._preloadedPages[o]), show(i), "catalog" == e) Video.initOwnerVideoPage(), document.title = getLang("video_myvideos");
        else {
            var t = ge("videocat_other_blocks");
            trim(t.innerHTML) || (t.innerHTML = cur._preloadedPages.other), Videocat.init(), document.title = getLang("video_catalogue_tab_full")
        }
        return toggle("video_add_album_btn", "catalog" != o), uiTabs.switchTab(domFC(ge("videocat_tab_" + o))), uiTabs.hideProgress("video_main_tabs"), !1
    },
    updateEmptyPlaceholder: function(e) {
        if (e) {
            var o = !1,
                i = "";
            "albums" == e ? cur.playlistsCount || (o = !0, i = "video_no_albums_placeholder_text") : cur.videosCount[cur.getOwnerId()][e] || (o = !0, i =
                "video_no_videos_here_yet"), Video._toggleEmptyPlaceholder(o, i)
        }
    },
    initNavigation: function() {
        cur.nav.push(function(e, o, i, t) {
            var r = !!e[0],
                d = r && i[0] == "videos" + vk.id,
                n = r && "video" == i[0],
                a = i.q && !o.q && i[0].indexOf("video") >= 0,
                c = o.q && !i.q && o[0].indexOf("video") >= 0,
                s = e.q;
            if ((c || s) && Video.logSearchStats(), a || s ? Video._initSearchStats(i) : c && Video._clearSearchStats(), r) {
                var l = cur.getOwnerId();
                if (l == vk.id && !inArray(e[0], ["video", "videos" + l])) return !0;
                if (l != vk.id && !inArray(e[0], ["videos" + l])) return !0
            }
            var u;
            if (d ? (nav.setLoc(i), u = Video._switch("catalog", "all")) : n && (nav.setLoc(i), u = Video._switch("all", "catalog")), u) return !0;
            if (uiTabs.hideProgress("video_main_tabs"), "all" == e.section && delete i.section, a && (cur.videoLocBeforeSearch = o), c && (cur.videoSearchStr = "",
                    cur.videoSearchFilters = {}, Video.doSearch(), cur.videoLocBeforeSearch && t.fromSearch)) {
                var _ = clone(cur.videoLocBeforeSearch);
                return delete cur.videoLocBeforeSearch, nav.go(_), !1
            }
            trim(val(cur.searchInputEl)) != trim(i.q || "") && val(cur.searchInputEl, trim(i.q || ""));
            var v = i.section || "all";
            if (i.q) Video.isInAlbum() || delete i.section, Video._prepareSearchFilters(i), cur.videoSearchStr = val(cur.searchInputEl), Video.doSearch();
            else {
                if (-1 == Video.AVAILABLE_TABS.indexOf(v)) return !0;
                if (Video.isInAlbum(o.section)) return nav.setLoc(i), !0;
                each(Video.AVAILABLE_TABS, function(e, o) {
                    hide("video_subtab_pane_" + o)
                }), show("video_subtab_pane_" + v), Video.updateEmptyPlaceholder(v);
                var h = domFC(ge("video_tab_" + v));
                h && uiTabs.switchTab(h, {
                    noAnim: t.hist
                }), "albums" != v ? (Video.loadSilent(v), cur.videoSortDD && cur.videoSortDD.select(cur.currentSortings[v] || "default", !0), show(
                    "video_sort_dd_wrap")) : hide("video_sort_dd_wrap"), Video._createSorters(v)
            }
            return nav.setLoc(i), !1;
            var v, h
        }), cur.destroy.push(function() {
            cur.nav.pop()
        })
    },
    initSearch: function() {
        function e() {
            cur.searchText = trim(val(cur.searchInputEl)), clearTimeout(cur._sto), cur._sto = setTimeout(function() {
                if (!cur.searchText) {
                    var e = {};
                    each(Video.SEARCH_FILTERS, function(o, i) {
                        e[i] = !1
                    })
                }
                nav.change(extend({
                    q: cur.searchText ? cur.searchText : !1
                }, e), !1, {
                    fromSearch: !0
                })
            }, cur.searchText ? 400 : 0)
        }

        function o() {
            var e = trim(val(cur.searchInputEl));
            e && (cur.vSearchInputBlurred = !0)
        }
        Video.initFilters(), cur.searchInputEl = ge("video_search_input"), (Video.isInCatalog() || cur.getOwnerId() == vk.id) && new Suggester(cur.searchInputEl, {
            section: "video",
            sidePadding: "43px",
            onSelect: function(e) {
                val(cur.searchInputEl, e[3])
            },
            onChoose: function(o) {
                val(cur.searchInputEl, o[3]), e()
            }
        }), cur.searchInputEl && (data(cur.searchInputEl, "opts")
            .onChange = e, data(cur.searchInputEl, "opts")
            .onBlur = o, cur.searchInputEl.focus())
    },
    _sortVideos: function(e) {
        window.tooltips && tooltips.hideAll();
        var o = Video._getCurrentSectionType(),
            i = cur.getOwnerId();
        "album" == o && (o = Video.getLoc()
            .section);
        var t = cur.silentLoaded[i][o];
        return t = t.filter(function(e) {
            var o = e[VideoConstants.VIDEO_ITEM_INDEX_OWNER_ID] + "_" + e[VideoConstants.VIDEO_ITEM_INDEX_ID];
            return !cur.videoRecentlyRemoved[o]
        }), cur.silentLoaded[i][o] = t, t ? (hide("video_sort_progress"), show("video_sort_dd"), clearTimeout(cur._sortTO), void(cur._sortTO = setTimeout(function() {
            if (t.length) {
                t.sort(function(o, i) {
                    switch (e) {
                        case "default":
                            return o[cur.indexIndex] - i[cur.indexIndex];
                        case "new":
                            return i[VideoConstants.VIDEO_ITEM_INDEX_DATE] - o[VideoConstants.VIDEO_ITEM_INDEX_DATE];
                        case "old":
                            return o[VideoConstants.VIDEO_ITEM_INDEX_DATE] - i[VideoConstants.VIDEO_ITEM_INDEX_DATE];
                        case "popularity":
                            return i[VideoConstants.VIDEO_ITEM_INDEX_VIEWS] - o[VideoConstants.VIDEO_ITEM_INDEX_VIEWS]
                    }
                });
                var r = ge("video_" + o + "_list");
                r.innerHTML = "", cur.videoShowWindow && cur.videoShowWindow[i] && (cur.videoShowWindow[i][o] = !1), Video.showMore(o), Video._reinitSorters(
                    "default" != e), cur.currentSortings = cur.currentSortings || {}, cur.currentSortings[o] = e
            }
        }, 10))) : (show("video_sort_progress"), hide("video_sort_dd"), void Video._addPendingAction(o, function() {
            Video._sortVideos(e)
        }))
    },
    _reindex: function(e) {
        for (var o = 0, i = e.length; i > o; o++) e[o].length >= cur.indexIndex ? e[o][cur.indexIndex] = o : e[o].push(o)
    },
    _onAlbumReorder: function(e, o, i) {
        var t = e.getAttribute("data-id"),
            r = i ? i.getAttribute("data-id") : null,
            d = o ? o.getAttribute("data-id") : null;
        ajax.post("al_video.php", {
            act: "reorder_albums",
            oid: cur.getOwnerId(),
            aid: t,
            before: d,
            after: r,
            hash: cur.videoAlbumsSortHash
        })
    },
    _onReorder: function(e, o, i) {
        var t = cur.getOwnerId(),
            r = domData(e, "id"),
            d = i ? domData(i, "id") : null,
            n = o ? domData(o, "id") : null,
            a = Video._getCurrentSectionType();
        "album" == a && (a = Video.getLoc()
            .section.split("_")[1]);
        var c = Video._getCurrentSectionType(),
            s = cur.silentLoaded[t][c];
        if (s) {
            var l = -1,
                u = -1;
            if (each(s, function(e, o) {
                    var i = o[VideoConstants.VIDEO_ITEM_INDEX_OWNER_ID] + "_" + o[VideoConstants.VIDEO_ITEM_INDEX_ID];
                    return i == r && (l = e), i == d && (u = e), u >= 0 && l >= 0 ? !1 : void 0
                }), l >= 0) {
                var _ = s.splice(l, 1)[0];
                0 > u ? s.unshift(_) : (u > l && u--, s.splice(u + 1, 0, _)), Video._reindex(s)
            }
        }
        ajax.post("al_video.php", {
            act: "reorder_videos",
            album_id: a,
            target_id: t,
            vid: r,
            before: n,
            after: d,
            hash: cur.videoSortHash
        })
    },
    _prepareSearchFilters: function(e) {
        return cur.videoSearchFilters = {}, each(Video.SEARCH_FILTERS, function(o, i) {
            cur.videoSearchFilters[i] = e[i]
        }), cur.videoSearchFilters
    },
    onFilterRemoved: function(e) {
        Video._setFilterSelector(e), clearTimeout(cur._frto), cur._frto = setTimeout(Video._onFiltersChanged, 10)
    },
    _setFilterSelector: function(e, o) {
        var i, t = cur["videoFilter_" + e];
        return "Selector" == t.__className ? (void 0 === o && (o = t.options.defaultItems[0][0]), t.selectItem(o, !1), i = clone(t.selectedItems()[0]), i.push(i[0] == t.options
            .defaultItems[0][0])) : hasClass(t, "checkbox") && (toggleClass(t, "on", !!o), i = [!!o, data(t, "title"), !o]), i
    },
    _onFiltersChanged: function() {
        var e = hasClass("video_fltr_hd", "on"),
            o = hasClass("video_fltr_notsafe", "on"),
            i = cur.videoFilter_len.selectedItems()[0][0],
            t = cur.videoFilter_date.selectedItems()[0][0],
            r = cur.videoFilter_order.selectedItems()[0][0];
        nav.change({
            hd: e ? 1 : !1,
            len: i > 0 ? i : !1,
            date: t > 0 ? t : !1,
            order: r >= 0 ? r : !1,
            notsafe: o ? 1 : !1
        }, !1, {
            filtersChanged: !0
        })
    },
    initFilters: function() {
        var e = geByClass1("video_search_input");
        e && (cur.videoFilter_len = new Dropdown(ge("video_fltr_len"), cur.lenFilters, {
                big: 1,
                zeroPlaceholder: !0,
                onChange: Video._onFiltersChanged
            }), cur.videoFilter_date = new Dropdown(ge("video_fltr_date"), cur.dateFilters, {
                big: 1,
                zeroPlaceholder: !0,
                onChange: Video._onFiltersChanged
            }), cur.videoFilter_order = new Dropdown(ge("video_fltr_order"), cur.orderFilters, {
                big: 1,
                zeroPlaceholder: !0,
                onChange: Video._onFiltersChanged
            }), cur.videoFilter_hd = ge("video_fltr_hd"), removeEvent(cur.videoFilter_hd, "click"), addEvent(cur.videoFilter_hd, "click", Video._onFiltersChanged),
            data(cur.videoFilter_hd, "title", cur.lang.video_hd_checkbox), cur.videoFilter_notsafe = ge("video_fltr_notsafe"), removeEvent(cur.videoFilter_notsafe,
                "click"), addEvent(cur.videoFilter_notsafe, "click", Video._onFiltersChanged), data(cur.videoFilter_notsafe, "title", cur.lang.video_filter_no_safe))
    },
    _isGeneralSection: function(e) {
        for (var o = 0; o < Video.AVAILABLE_TABS.length; o++)
            if (e == Video.AVAILABLE_TABS[o]) return !0;
        return !1
    },
    loadSilent: function(e) {
        e = e || "all";
        var o = cur.getOwnerId(),
            i = Video.isInAlbum(e);
        if ((i || this._isGeneralSection(e)) && "albums" != e) {
            cur.silentLoadingProgress = cur.silentLoadingProgress || {}, cur.silentLoadingProgress[o] = cur.silentLoadingProgress[o] || {}, cur.silentLoaded = cur.silentLoaded ||
                {}, cur.silentLoaded[o] = cur.silentLoaded[o] || {};
            var t = cur.silentLoadingProgress[o][e];
            if (t !== !0) return t === !1 ? void Video._callPendingAction(e) : void("undefined" == typeof t && (cur.silentLoadingProgress[o][e] = !0, function(e) {
                function i(i, t) {
                    cur.silentLoadingProgress && cur.silentLoadingProgress[o] && (cur.silentLoadingProgress[o][e] = !1, i && (i.length && (cur.indexIndex =
                        i[0].length), Video._reindex(i), cur.silentLoaded[o][e] = i), t && (cur.albumsPreload[o] = !1, cur.silentLoaded[o].albums =
                        t), Video.indexItems(function() {
                        cur.silentLoadingProgress && (Video._callPendingAction(e), t && Video._callPendingAction("albums"), Video.showMore(e))
                    }))
                }

                function t() {
                    var t = [].concat.apply([], u),
                        a = vkNow(),
                        c = {};
                    each(n || {}, function(i, t) {
                        (o != t.oid || e != t.section) && a - t.ts < 36e5 && (c[i] = t)
                    }), c[d] = {
                        videos: t,
                        albums: _,
                        ts: a,
                        oid: cur.getOwnerId(),
                        section: e
                    }, ls.set(r, c), i(t, _)
                }
                var r = "video_silent_cache",
                    d = o + "_" + e + "_" + cur.videoOwnerCacheHash,
                    n = ls.get(r);
                if (cur.noVideos) i([], []);
                else {
                    if (!cur.videosCount || !cur.videosCount[o]) return i([], []);
                    var a = cur.VIDEO_SILENT_VIDEOS_CHUNK_SIZE,
                        c = cur.videosCount[o][e],
                        s = Math.ceil(c / a),
                        l = new callHub(t, s),
                        u = new Array(s),
                        _ = [];
                    if (0 == s) return i([], []);
                    for (var v = 0; s > v; v++) ! function(i) {
                        ajax.post("/al_video.php", {
                            act: "load_videos_silent",
                            oid: o,
                            section: e,
                            rowlen: Video.VIDEOS_PER_ROW,
                            offset: i * a,
                            need_albums: "all" == e && intval(0 == i),
                            is_layer: intval(cur.isCurrentVideoLayer)
                        }, {
                            onDone: function(o, t, r, d) {
                                o && o[e] && o[e].list ? u[i] = o[e].list : u[i] = [], 0 == i && (_ = d), l.done()
                            }
                        })
                    }(v)
                }
            }(e)))
        }
    },
    indexItems: function(e) {
        var o = 0,
            i = cur.getOwnerId();
        cur.videoIndexes = cur.videoIndexes || {}, cur.videoIndexes[i] = cur.videoIndexes[i] || {}, each(cur.silentLoaded[i], function(e, t) {
            cur.videoIndexes[i][e] || o++
        });
        var t = new callHub(e, o);
        each(cur.silentLoaded[i], function(e, o) {
            cur.videoIndexes[i][e] || (cur.videoIndexes[i][e] = new vkIndexer(o, function(o) {
                return "albums" == e ? o[0] : o[VideoConstants.VIDEO_ITEM_INDEX_TITLE]
            }, function() {
                t.done()
            }))
        })
    },
    _updateSearchPageTitle: function(e) {
        curBox() || (e ? (cur.prevVideoPageTitle || (cur.prevVideoPageTitle = document.title), document.title = getLang("video_title_search")
            .replace("{q}", e)) : cur.prevVideoPageTitle && (document.title = cur.prevVideoPageTitle))
    },
    doSearch: function(e) {
        var o = trim(e ? e : cur.videoSearchStr);
        each(Video.SEARCH_FILTERS, function(e, o) {
            var i = Video._setFilterSelector(o, cur.videoSearchFilters[o]);
            uiSearch.toggleFilter(cur.searchInputEl, o, i[1], !i[2])
        });
        var i = gpeByClass("_wrap", cur.searchInputEl);
        toggleClass(i, "ui_search_field_empty", !o), cur.noEmptyLocalResults = Video.isInCatalog(), Video._toggleSearchProgress(!!o);
        var t = [Video.VIDEO_SEARCH_TYPE, Video.ALBUM_SEARCH_TYPE, Video.VIDEO_GLOBAL_SEARCH_TYPE];
        Video.isInSearch() && cur.noEmptyLocalResults && t.pop(), each(t, function(e, o) {
                hide("video_subtab_pane_" + o)
            }), hide("videocat_other_blocks"), o || Video._toggleSearchContent(!1), curBox() ? ge("box_layer_wrap")
            .scrollTop = 0 : scrollToTop(1e3);
        var r = Video.isInAlbum(),
            d = r ? Video.getLoc()
            .section : "all";
        Video._clearPendingAction(d), Video._updateSearchPageTitle(o), o && (Video._addPendingAction(d, function() {
            var e = Video._searchLocally(o);
            15 > e && Video._searchGlobally(o), Video._toggleSearchProgress(!1)
        }), Video.loadSilent(d), Video._searchGlobally(o))
    },
    _toggleSearchProgress: function(e) {
        cur.searchProgressRef = cur.searchProgressRef || 0, cur.searchProgressRef = Math.max(0, cur.searchProgressRef + (e ? 1 : -1)), e = cur.searchProgressRef > 0;
        var o = geByClass1("ui_search_fltr_control", geByClass1("video_search_input")),
            i = geByClass1("ui_search_fltr_progress", o);
        toggle(i, e), hasClass(o, "shown") || toggleClass(gpeByClass("_wrap", cur.searchInputEl), "ui_search_loading", e)
    },
    _buildFiltersSearchStr: function() {
        var e = [];
        return each(cur.videoSearchFilters || {}, function(o, i) {
            i && e.push(o + ":" + i)
        }), "$" + e.join("#")
    },
    _searchGlobally: function(e, o) {
        o = intval(o);
        var i = o > 0;
        cur.globalSearchResults = cur.globalSearchResults || {};
        var t = e + Video._buildFiltersSearchStr();
        return !i && cur.globalSearchResults[t] ? void Video._showGlobalSearchResults(e) : void(cur.globalSearchInProgress != e && (cur.globalSearchInProgress = e, !i &&
            Video._toggleSearchProgress(!0), ajax.post("/al_video.php", extend({
                act: "search_video",
                q: e,
                offset: o || 0
            }, cur.videoSearchFilters), {
                onDone: function(o, r, d, n, a) {
                    cur.globalSearchInProgress = !1, !i && Video._toggleSearchProgress(!1), cur.globalSearchResults[t] = cur.globalSearchResults[t] || {
                        count: 0,
                        list: [],
                        realOffset: 0
                    };
                    var c = cur.globalSearchResults[t];
                    c.done = c.done || !r.list || 0 == r.list.length;
                    var s = c.list.length;
                    if (!c.done) {
                        for (var l = r.list[0], u = 0, _ = c.list.length - 1; _ >= 0; _--) {
                            var v = c.list.length - _;
                            if (v > 20) break;
                            var h = c.list[_];
                            if (l[0] == h[0] && l[1] == h[1]) {
                                u = v;
                                break
                            }
                        }
                        c.count = parseInt(o), Array.prototype.push.apply(c.list, r.list.slice(u));
                        var g = c.list.length % Video.VIDEOS_PER_ROW;
                        o > Video.VIDEOS_PER_PAGE && g && c.list.length < c.count && (c.list.splice(-g, Video.VIDEOS_PER_ROW), a -= g), c.realOffset = a
                    }(d || !c.done && c.list.length == s) && (c.done = !0), Video._showGlobalSearchResults(e, i)
                }
            })))
    },
    _toggleEmptySearchPlaceholder: function(e, o) {
        var i = ge("video_empty_placeholder_search"),
            t = cur.getOwnerId() < 0 ? "video_not_found_group" : "video_not_found_user";
        cur.getOwnerId() == vk.id && (t = "video_not_found_yours"), Video.isInAlbum() && (t = "video_not_found_in_album"), Video.isInCatalog() && (t =
                "video_not_found_globally"), i.innerHTML = getLang(t)
            .replace("{searchText}", "<b>" + clean(o ? o.replace(/\$/g, "$$$$") : "") + "</b>"), toggle(i, e)
    },
    _toggleEmptyPlaceholder: function(e, o) {
        var i = ge("video_empty_placeholder_main");
        e && i && (i.innerHTML = getLang(o)), toggle(i, e)
    },
    _showSearchResult: function(e) {
        var o = cur.found[e],
            i = cur.getOwnerId();
        if (toggle("video_subtab_pane_" + e, !!o.count), o.count) {
            var t, r = "";
            switch (e) {
                case Video.ALBUM_SEARCH_TYPE:
                    t = "albums";
                case Video.VIDEO_SEARCH_TYPE:
                    t = t || "videos", r = Video.isInAlbum() ? cur.lang["video_found_" + t + "_in_album"] : cur.getOwnerId() < 0 ? cur.lang["video_found_" + t +
                        "_community"] : cur.getOwnerId() == vk.id ? cur.lang["video_found_" + t + "_yours"] : cur.lang["video_found_" + t + "_of"];
                    break;
                case Video.VIDEO_GLOBAL_SEARCH_TYPE:
                    r = cur.lang.video_found_videos_global
            }
            r = langNumeric(o.count, r, !0), r = r.replace("{user}", cur.lang.video_owner_name_gen);
            var d = geByClass1("video_subtitle", ge("video_subtab_pane_" + e));
            val(d, r), ge("video_" + e + "_list")
                .innerHTML = "", cur.videoShowWindow && cur.videoShowWindow[i] && delete cur.videoShowWindow[i][e], Video.showMore(e)
        }
    },
    _showGlobalSearchResults: function(e, o) {
        var i = e + Video._buildFiltersSearchStr(),
            t = cur.getOwnerId(),
            r = Video.isInAlbum() ? Video.getLoc()
            .section : "all",
            d = cur.silentLoaded[t][r];
        if (cur.searchText == e && d && cur.globalSearchResults[i] && cur.globalSearchResults[i].count > 0) {
            var n = cur.globalSearchResults[i];
            cur.found[Video.VIDEO_GLOBAL_SEARCH_TYPE] = {
                list: n.list,
                count: n.count,
                done: n.done,
                realOffset: n.realOffset
            }, cur.noEmptyLocalResults && (Video._toggleSearchContent(!0), 0 == n.count && Video._toggleEmptySearchPlaceholder(!0, e)), o || Video._showSearchResult(
                Video.VIDEO_GLOBAL_SEARCH_TYPE), Video._callPendingAction(Video.VIDEO_GLOBAL_SEARCH_TYPE)
        }
    },
    _toggleSearchContent: function(e) {
        toggle("video_layout_contents", !e), toggle("video_layout_search", !!e)
    },
    _searchLocally: function(e) {
        if (cur.found = {}, !e || !cur.videoIndexes) return !1;
        var o = cur.getOwnerId(),
            i = [],
            t = [];
        !Video.isInAlbum() && cur.videoIndexes[o].albums && (t = cur.videoIndexes[o].albums.search(e), cur.found[Video.ALBUM_SEARCH_TYPE] = {
            list: t,
            count: t.length
        }, Video._showSearchResult(Video.ALBUM_SEARCH_TYPE));
        var r = Video.isInAlbum() ? Video.getLoc()
            .section : "all";
        if (cur.videoIndexes[o][r]) {
            var d = cur.videoIndexes[o][r].search(e);
            each(d, function(e, o) {
                (!cur.videoSearchFilters.hd || o[VideoConstants.VIDEO_ITEM_INDEX_FLAGS] & VideoConstants.VIDEO_ITEM_FLAG_HD) && (vkNow() / 1e3 - o[VideoConstants.VIDEO_ITEM_INDEX_DATE] >
                    cur.videoSearchFilters.date || i.push(o))
            }), cur.found[Video.VIDEO_SEARCH_TYPE] = {
                list: i,
                count: i.length
            }, Video._showSearchResult(Video.VIDEO_SEARCH_TYPE)
        }
        var n = t.length + i.length;
        return n ? (Video._toggleSearchContent(!0), Video._toggleEmptySearchPlaceholder(!1)) : cur.noEmptyLocalResults ? Video._toggleEmptySearchPlaceholder(!1) : (Video._toggleSearchContent(!
            0), Video._toggleEmptySearchPlaceholder(!0, e)), i ? i.length : 0
    },
    onItemEnter: function(e) {
        setTitle(e, e, e.innerHTML.replace(/<\/?em>/g, ""))
    },
    showMoreAlbums: function(e) {
        var o = !1,
            i = cur.getOwnerId();
        cur.albumsPreload && cur.albumsPreload[i] && !cur.silentLoaded[i].albums && (cur.silentLoaded[i].albums = cur.albumsPreload[i], o = !0), cur.albumsShowingAll[i] = !
            0, Video.showMore("albums", e), o && (cur.silentLoaded[i].albums = !1)
    },
    prepareVideoItemAttrs: function(e) {
        var o = attrs = "",
            i = {};
        i[VideoConstants.VIDEO_ITEM_FLAG_EXTERNAL] = "video_ext", i[VideoConstants.VIDEO_ITEM_FLAG_DOMAIN_YT] = "video_wm_yt", i[VideoConstants.VIDEO_ITEM_FLAG_DOMAIN_COUB] =
            "video_wm_coub", i[VideoConstants.VIDEO_ITEM_FLAG_DOMAIN_RT] = "video_wm_rutube", i[VideoConstants.VIDEO_ITEM_FLAG_DOMAIN_PLADFORM] = "video_wm_plad", i[
                VideoConstants.VIDEO_ITEM_FLAG_DOMAIN_VIMEO] = "video_wm_vimeo", i[VideoConstants.VIDEO_ITEM_FLAG_CAN_EDIT] = "video_can_edit", i[VideoConstants.VIDEO_ITEM_FLAG_CAN_ADD] =
            "video_can_add", i[VideoConstants.VIDEO_ITEM_FLAG_CAN_DELETE] = "video_can_delete", i[VideoConstants.VIDEO_ITEM_FLAG_PRIVATE] = "video_private", i[
                VideoConstants.VIDEO_ITEM_FLAG_NO_AUTOPLAY] = "video_nap", i[VideoConstants.VIDEO_ITEM_FLAG_ADDED] = "video_added", i[VideoConstants.VIDEO_ITEM_FLAG_SKIP_THUMB_LOAD] =
            "video_skip_thumb_load";
        var t = e[VideoConstants.VIDEO_ITEM_INDEX_FLAGS];
        return each(i, function(e, i) {
                t & e && (o += i + " ")
            }), e[VideoConstants.VIDEO_ITEM_INDEX_DURATION] || (o += " video_no_duration"), t & VideoConstants.VIDEO_ITEM_FLAG_CAN_EDIT || t & VideoConstants.VIDEO_ITEM_FLAG_CAN_DELETE ||
            t & VideoConstants.VIDEO_ITEM_FLAG_CAN_ADD || (o += " video_no_actions"), t & VideoConstants.VIDEO_ITEM_FLAG_NEED_SIGN_IN && (attrs += ' rel="nofollow"'), [o,
                attrs
            ]
    },
    buildVideoEl: function(e) {
        var o = trim(cur.videoItemTpl);
        e = clone(e), e[VideoConstants.VIDEO_ITEM_INDEX_VIEWS] = langNumeric(e[VideoConstants.VIDEO_ITEM_INDEX_VIEWS], cur.lang.video_N_views_list, !0), e[VideoConstants.VIDEO_ITEM_INDEX_DATE] =
            Video.getFormattedUpdatedTime(e[VideoConstants.VIDEO_ITEM_INDEX_DATE]);
        var i = Video.prepareVideoItemAttrs(e),
            t = rs(o, e);
        return t = t.replace("%classes%", i[0])
            .replace("%attrs%", i[1]), t = se(t)
    },
    buildPlaylistEl: function(e) {
        var o = trim(cur.albumItemTpl);
        return se(rs(o, e))
    },
    onMoreLoaded: function(e, o, i, t, r) {
        Video._loading = !1;
        var d, n = cur.getOwnerId(),
            a = cur.videoShowWindow[n][o],
            c = ge("video_" + o + "_list");
        if (c) {
            e = geByClass1("ui_load_more_btn", gpeByClass("ge_video_pane", c));
            var s = o.indexOf("albums") >= 0,
                l = s ? 0 : 3,
                u = Video._getCurrentSectionType();
            u = "album" == u ? Video.getLoc()
                .section : "all";
            var _ = !1;
            o.indexOf("search") >= 0 && cur.searchText && (_ = new RegExp("(" + cur.searchText.replace(/\|/g, "")
                .replace(cur.videoIndexes[n][u].delimiter, "|")
                .replace(/^\||\|$/g, "")
                .replace(/([\+\*\)\(])/g, "\\$1") + ")", "gi"));
            for (var v = 0, h = i.length; h > v; v++) {
                var g = extend({}, i[v]);
                _ && (g[l] = g[l].replace(_, "<em>$1</em>")), d = s ? Video.buildPlaylistEl(g) : Video.buildVideoEl(g), o == Video.VIDEO_GLOBAL_SEARCH_TYPE && d.setAttribute(
                    "data-search-pos", v + a.offset), c.appendChild(d)
            }
            a.offset = t, a.done = !i.length || r, toggle(e, !a.done), o == Video.VIDEO_GLOBAL_SEARCH_TYPE && (cur.videoSearchStats || Video._initSearchStats(Video.getLoc()),
                cur.videoSearchStats.lastActionTime = (new Date)
                .getTime(), Video._updateLastSeenElement(c))
        }
    },
    showMore: function(e, o) {
        e = e || Video._getCurrentSectionType();
        var i = curBox() ? curBox()
            .bodyNode : void 0,
            t = geByClass1("_video_" + e + "_list", i);
        if (t) {
            var r = Video.isInAlbum(e),
                d = cur.getOwnerId();
            if ((r || -1 != Video.AVAILABLE_TABS.indexOf(e)) && !cur.silentLoaded[d][e]) return void(isButtonLocked(o) || (Video._addPendingAction(e, function() {
                Video.showMore(e, o)
            }), lockButton(o)));
            unlockButton(o), cur.videoShowWindow = cur.videoShowWindow || {}, cur.videoShowWindow[d] = cur.videoShowWindow[d] || {}, cur.videoShowWindow[d][e] || (cur.videoShowWindow[
                d][e] = {
                done: !1,
                offset: t.children.length
            });
            var n = cur.videoShowWindow[d][e];
            if (!n.done)
                if (e.indexOf("search") >= 0 && cur.found[e]) {
                    var a, c, s, l;
                    if (e == Video.VIDEO_GLOBAL_SEARCH_TYPE) {
                        if (a = cur.found[e].list.length, c = cur.found[e].realOffset || a, s = cur.found[e].list.slice(n.offset, a), l = cur.found[e].done, !l && 0 == s.length)
                            return Video._addPendingAction(e, function() {
                                Video.showMore(e, o)
                            }), lockButton(o), void(cur.globalSearchInProgress || Video._searchGlobally(cur.searchText, c))
                    } else a = n.offset + Video.VIDEOS_PER_PAGE, s = cur.found[e].list.slice(n.offset, a), l = a >= cur.found[e].list.length;
                    Video.onMoreLoaded(o, e, s, a, l)
                } else if ((r || -1 != Video.AVAILABLE_TABS.indexOf(e)) && cur.silentLoaded[d][e]) {
                var u = cur.silentLoaded[d][e],
                    a = Math.min(u.length, n.offset + Video.VIDEOS_PER_PAGE),
                    s = u.slice(n.offset, a),
                    l = !1;
                "albums" == e && cur.albumsPreload[d] ? (l = cur.albumsNoMore, cur.albumsPreload[d] = !1) : l = a >= u.length, "albums" == e && (cur.albumsShowingAll[d] = !
                    l), Video.onMoreLoaded(o, e, s, a, l)
            }
        }
    },
    isInAlbum: function(e) {
        return 0 === (e || Video.getLoc()
                .section || "")
            .indexOf("album_")
    },
    isInSearch: function() {
        return !!Video.getLoc()
            .q
    },
    _getSectionAlbumId: function() {
        var e = Video.getLoc()
            .section || "all";
        switch (e) {
            case "all":
                return -2;
            case "uploaded":
                return -1;
            default:
                return e.split("_")[1]
        }
    },
    isInCatalog: function(e) {
        return e = e || Video.getLoc(), "video" == e[0] && !e.section
    },
    _getCurrentSectionType: function() {
        return cur.videoForcedSection ? cur.videoForcedSection : Video.isInCatalog() ? "catalog" : Video.isInAlbum(Video.getLoc()
                .section) ? "album" : Video.getLoc()
            .section || "all"
    },
    onScroll: function() {
        var e;
        cur.albumsShowingAll[cur.getOwnerId()] ? e = "albums" : (e = Video._getCurrentSectionType(), Video.getLoc()
            .q || "search" == e ? e = isVisible(gpeByClass("ge_video_pane", "ui_search_global_videos_load_more")) ? Video.VIDEO_GLOBAL_SEARCH_TYPE : Video.VIDEO_SEARCH_TYPE :
            "album" == e && (e = Video.getLoc()
                .section));
        var o = curBox() ? curBox()
            .bodyNode : void 0,
            i = geByClass1("_video_" + e + "_list", o);
        if (i) {
            var t = gpeByClass("ge_video_pane", i),
                r = geByClass1("ui_load_more_btn", t);
            if (r) {
                var d = clientHeight(),
                    n = scrollGetY(),
                    a = getXY(r);
                n + d > a[1] - d / 2 && Video.showMore(e, r)
            }
            e == Video.VIDEO_GLOBAL_SEARCH_TYPE && Video._updateLastSeenElement(i)
        }
        Video._updateChooseFixedBottom()
    },
    _initScrollFixedSearch: function(e) {
        var o = geByClass1("video_search_input");
        toggleClass(o, "video_need_fix", e), e && (cur.fixSearchHeaderInfo = cur.fixSearchHeaderInfo || {
            searchTop: getXY(o)[1],
            mainHeaderHeight: getSize("page_header_cont")[1],
            videoContWidth: getSize(geByClass1("video_content"))[0]
        })
    },
    getFormattedUpdatedTime: function(e) {
        function o(e, o, i) {
            return isArray(o) && e < o.length ? o[e] : langNumeric(e, i)
        }
        var i = intval(vkNow() / 1e3),
            t = i - e,
            r = "",
            d = "video_added_";
        return r = 5 > t ? getLang(d + "now") : 60 > t ? o(t, cur.lang[d + "sec"][0], cur.lang[d + "sec"][1]) : 3600 > t ? o(intval(t / 60), cur.lang[d + "min"][0], cur.lang[
            d + "min"][1]) : 86400 > t ? o(intval(t / 3600), cur.lang[d + "hour"][0], cur.lang[d + "hour"][1]) : 2592e3 > t ? o(intval(t / 86400), cur.lang[d + "day"][
            0
        ], cur.lang[d + "day"][1]) : 31536e3 > t ? o(intval(t / 2592e3), cur.lang[d + "month"][0], cur.lang[d + "month"][1]) : o(intval(t / 31536e3), cur.lang[d +
            "year"][0], cur.lang[d + "year"][1])
    },
    _createSorters: function(e) {
        cur.videoCanSort && (cur.videoSorter && cur.videoSorter.destroy(), e = e || Video._getCurrentSectionType(), "album" == e && (e = Video.getLoc()
            .section), cur.videoSorter = new GridSorter(ge("video_" + e + "_list"), "video_item_thumb", {
            onReorder: Video._onReorder,
            onDragOverElClass: "video_playlist_item",
            onDragLeave: function(e, o) {
                removeClass(e, "video_on_drag_over"), removeClass(o, "video_on_drag_over")
            },
            onDragEnter: function(e, o) {
                addClass(e, "video_on_drag_over"), addClass(o, "video_on_drag_over")
            },
            onDragDrop: function(e, o) {
                var i = attr(o, "data-id")
                    .split("_"),
                    t = attr(e, "data-id");
                return ajax.post("/al_video.php", {
                    act: "a_add_to_playlist",
                    oid: i[0],
                    vid: i[1],
                    gid: cur.getOwnerId() < 0 ? -cur.getOwnerId() : 0,
                    add: 1,
                    playlist_id: t,
                    own: 1,
                    hash: cur.videoAddToPlaylistOwnHash
                }, {
                    onDone: function(o, i) {
                        if (i && i[t]) {
                            var r = Video.buildPlaylistEl(i[t]);
                            domPN(e)
                                .replaceChild(r, e), Video._reinitSorters(), cur.albumsSorter.update()
                        }
                    }
                }), !0
            }
        }))
    },
    _reinitSorters: function(e) {
        cur.videoCanSort && (clearTimeout(cur._rsto), cur._rsto = setTimeout(function() {
            cur.videoSorter ? e ? cur.videoSorter.disable() : cur.videoSorter.enable() : Video._createSorters()
        }))
    },
    onVideoAdd: function(e, o, i, t, r) {
        var d = gpeByClass("_video_item", o),
            n = intval(toggleClass(d, "video_added")),
            a = {};
        return a = n ? {
            playlist_id: -2
        } : {
            playlists: 0
        }, ajax.post("/al_video.php", extend({
            act: "a_add_to_playlist",
            oid: i,
            vid: t,
            add: intval(n),
            hash: r
        }, a), {
            onDone: function(e, o, r) {
                var d = cur.currentSortings && (!cur.currentSortings.all || "default" == cur.currentSortings.all),
                    a = cur._preloadedPages ? geByClass1("_video_list_my_all", cur._preloadedPages.all) : !1,
                    c = !1;
                if (a) {
                    var s = geByClass1("ge_video_item_" + i + "_" + t, a);
                    s && re(s), c = !!s, n && d && a.insertBefore(Video.buildVideoEl(r), a.firstChild)
                }
                if (cur.silentLoaded && cur.silentLoaded[vk.id] && cur.silentLoaded[vk.id].all) {
                    var l = cur.silentLoaded[vk.id].all;
                    if (n) d && (l.unshift(r), Video._reindex(l));
                    else
                        for (var u = 0, _ = l.length; _ > u; u++)
                            if (l[u][0] == i && l[u][1] == t) {
                                l.splice(u, 1);
                                break
                            } if (cur.videosCount[vk.id]) {
                        var v = n ? 1 : -1;
                        1 == v && c && (v = 0);
                        var h = cur.videosCount[vk.id].all = Math.max(0, (cur.videosCount[vk.id].all || 0) + v),
                            g = ge("video_tab_all");
                        if (g) {
                            var S = geByClass1("ui_tab_count", g);
                            S.innerHTML = h
                        }
                    }
                }
            }
        }), window.tooltips && tooltips.destroyAll(), cancelEvent(e)
    },
    onVideoMove: function(e, o, i, t) {
        return showBox("/al_video.php", {
            act: "video_playlists_box",
            target_id: cur.getOwnerId(),
            oid: i,
            vid: t
        }, {
            dark: 1
        }), cancelEvent(e)
    },
    _showProgressPanel: function(e) {
        var o = se('<div class="video_delete_progress _video_delete_progress"><div class="round_spinner"></div></div>');
        return e.appendChild(o), o
    },
    onVideoDelete: function(e, o, i, t, r) {
        var d = gpeByClass("_video_item", o),
            n = (attr(d, "data-id"), Video._getCurrentSectionType());
        addClass(d, "video_deleted");
        var a = Video._showProgressPanel(d),
            c = "album" == n ? Video._getSectionAlbumId() : -2;
        return cur.videoRecentlyRemoved[i + "_" + t] = !0, ajax.post("/al_video.php", {
            act: "a_delete_video",
            oid: i,
            vid: t,
            from: cur.oid,
            pl_id: c,
            hash: r
        }, {
            onDone: function(e) {
                re(a), d.appendChild(se(e));
                var o = data(d, "restoreTO");
                clearTimeout(o), o = setTimeout(function() {
                    re(geByClass1("_video_restore_act", d))
                }, 6e4), data(d, "restoreTO", o)
            }
        }), Video._reinitSorters(!0), cancelEvent(e)
    },
    restoreVideo: function(e, o, i, t, r) {
        var d = gpeByClass("_video_item", e),
            n = gpeByClass("_video_restore", e),
            a = Video._showProgressPanel(d),
            c = Video._getCurrentSectionType();
        re(n);
        var s = "album" == c ? Video._getSectionAlbumId() : -2;
        ajax.post("/al_video.php", {
            act: "a_restore_video",
            from: t,
            video_id: i,
            pl_id: s,
            hash: r
        }, {
            onDone: function() {
                removeClass(d, "video_deleted"), re(a)
            }
        }), delete cur.videoRecentlyRemoved[i]
    },
    onVideoEdit: function(e, o, i, t, r) {
        cur.videoEditItem = gpeByClass("video_item", o), window.Videoview && Videoview.hidePlayer();
        var d = showBox("al_video.php", {
            act: "edit_box",
            vid: t,
            oid: i
        }, {
            dark: 1
        });
        return d.setOptions({
            onHide: function() {
                window.Videoview && Videoview.showPlayer()
            }
        }), cancelEvent(e)
    },
    switchChooserToOwner: function(e) {
        function o() {
            showBox("al_video.php", extend({
                to_id: e,
                switched: 1
            }, {
                act: "a_choose_video_box"
            }), {
                cache: 1,
                dark: 1
            })
        }
        var i = curBox();
        showBox("al_video.php", extend({
            to_id: e,
            switched: 1
        }, {
            act: "a_choose_video_box"
        }), {
            showProgress: i.showCloseProgress.bind(i),
            hideProgress: i.hideCloseProgress.bind(i),
            cache: 1,
            dark: 1,
            onDone: function() {
                curBox()
                    .hide(), o()
            }
        })
    },
    chooseBoxBack: function() {
        cur.videoChoosePrevSection = cur.videoChoosePrevSection || "all", 0 == cur.videoChoosePrevSection.indexOf("album_") && (cur.videoChoosePrevSection = "albums"), nav
            .go("/videos?section=" + cur.videoChoosePrevSection)
    },
    initChooseBox: function(e, o, i, t) {
        function r() {
            setStyle(gpeByClass("popup_box_container", l.bodyNode))
        }

        function d() {
            l.setOptions({
                    width: 631,
                    bodyStyle: "padding: 0",
                    hideButtons: !0
                }), r(), ge("box_layer_wrap")
                .scrollTop = 0
        }

        function n() {
            each(Video.AVAILABLE_TABS, function(e, o) {
                hide("video_subtab_pane_" + o)
            }), hide(geByClass1("video_subtab_pane_album"))
        }

        function a() {
            l.setOptions({
                title: '<div class="back" onclick="Video.chooseBoxBack();">' + getLang("video_choose_box_back_to_videos") + "</div>",
                bodyStyle: "padding: 0"
            }), r()
        }

        function c() {
            var e = t;
            if (!o && cur.videoSwitchOwnerId) {
                var d = i == vk.id ? getLang("video_choose_wall_to_group_videos") : getLang("video_choose_wall_to_my_videos"),
                    n = i == vk.id ? cur.videoSwitchOwnerId : vk.id;
                e += '<span class="divider">|</span><a class="toggle" onclick="Video.switchChooserToOwner(' + n + ')">' + d + "</a>"
            }
            l.getOptions()
                .defaultTitle && (e = l.getOptions()
                    .defaultTitle), l.setOptions({
                    title: e,
                    grey: o
                }), r()
        }

        function s() {
            curBox() && each(geByClass("video_item", curBox()
                .bodyNode), function() {
                var e = geByClass1("media_check_btn_wrap", this),
                    o = this.getAttribute("data-id");
                toggleClass(e, "checked", -1 != cur.chosenVideos.indexOf(o))
            })
        }
        cur.found = {}, cur.currentSortings = {}, cur._preloadedPages = {}, cur.videoSearchFilters = {}, cur.chosenVideos = [], cur.albumsShowingAll = {}, cur.isNoteEdit =
            e, cur.videoShowWindow = {}, cur.getOwnerId = function() {
                return i
            };
        var l = curBox();
        cur.nav.push(function(e, o, i, t) {
            if (!t.filtersChanged && 1 == Object.keys(i)
                .length && i[0] && 0 != i[0].indexOf("video") && !t.fromSearch) return !0;
            hide("global_prg");
            var r = geByClass1("video_default_tabs", l.bodyNode),
                u = geByClass1("video_subtab_pane_album", l.bodyNode),
                _ = e.section ? e.section : "all";
            Video._prepareSearchFilters(i);
            var v = e.section ? "" : i.q || val(cur.searchInputEl);
            if (v ? (trim(val(cur.searchInputEl)) != trim(v) && val(cur.searchInputEl, trim(v)),
                    _ = "search", Video.doSearch(v), a(), Video._updateChooseFixedBottom()) : (val(cur.searchInputEl, ""), Video.doSearch("")), cur.videoForcedSection =
                _, -1 != Video.AVAILABLE_TABS.indexOf(_)) n(), show("video_subtab_pane_" + _), show(r), hide("albumPane"), c(), d(), cur.videoChoosePrevSection = _,
                "albums" != _ && Video.loadSilent(_), Video.updateEmptyPlaceholder(_);
            else if (_ && 0 == _.indexOf("album_")) {
                var h = _.split("_")[1];
                showGlobalPrg(ge("video_playlist_item_" + h), {
                    cls: "progress_inv_img",
                    w: 46,
                    h: 16,
                    shift: [0, -22],
                    zIndex: 1e3
                }), Video._addPendingAction(_, function() {
                    a(), n(), hide("global_prg"), hide(r), u.id = "video_subtab_pane_" + _;
                    var e = geByClass1("video_items_list", u);
                    e.id = "video_" + _ + "_list", e.innerHTML = "", show(u);
                    var o = cur.getOwnerId();
                    cur.videoShowWindow = cur.videoShowWindow || {}, cur.videoShowWindow[o] = cur.videoShowWindow[o] || {}, cur.videoShowWindow[o][_] = !1,
                        Video.showMore(_, geByClass1("ui_load_more_btn", ge("video_subtab_pane_album"))), d(), s(), Video._updateChooseFixedBottom()
                }), cur.videoChoosePrevSection = _, Video.loadSilent(_)
            }
            return s(), !1
        }), cur.isCurrentVideoLayer = !0, Video.loadSilent(), d(), addEvent(ge("box_layer_wrap"), "scroll", Video.onScroll), Video.initSearch(), c(), o || (cur.chooseVideoMedia =
            function(e, o, i) {
                var t = e;
                hasClass(t, "media_check_btn_wrap") ? cur.cancelClick = !0 : t = geByClass1("media_check_btn_wrap", t), toggleClass(t, "checked");
                var r = 0;
                if ((r = cur.chosenVideos.indexOf(o)) >= 0) cur.chosenVideos.splice(r, 1);
                else {
                    if (cur.chosenVideos.length >= 10) return;
                    cur.chosenVideos.push(o)
                }
                if (1 == cur.chosenVideos.length && !i) return Video.doAttachSelectedVideos(e), !1;
                var d = ge("video_choosebox_bottom");
                if (cur.chosenVideos.length > 0) {
                    show(d);
                    var n = cur.chooseVideoAdd ? cur.lang.video_add_videos : cur.lang.global_attach_videos;
                    val(geByClass1("video_choosebox_attach_btn", d), langNumeric(cur.chosenVideos.length, n)), Video._updateChooseFixedBottom()
                } else hide(d);
                return toggleClass(ge("video_choose_box"), "with_bottom_fixed", isVisible(d)), !1
            }), window.uiScrollBox && uiScrollBox.init(curBox(), {
            onHide: function() {
                hide("global_prg"), cur.nav.pop(), removeEvent(ge("box_layer_wrap"), "scroll", Video.onScroll), cur.isCurrentVideoLayer = !1
            }
        }), r()
    },
    doAttachSelectedVideos: function(e) {
        return hasClass(e, "flat_button") ? lockButton(e) : showGlobalPrg(e, {
            cls: "progress_inv_img",
            w: 46,
            h: 16,
            zIndex: 1e3
        }), cur.chooseVideoAdd ? cur.chooseVideoAdd(cur.chosenVideos) : void ajax.post("al_video.php", {
            act: "a_videos_attach_info",
            videos: cur.chosenVideos.join(",")
        }, {
            onDone: function(o) {
                hasClass(e, "flat_button") && unlockButton(e), hide("global_prg"), each(o, function(e, o) {
                        cur.isNoteEdit && window.editorChooseVideo ? editorChooseVideo(o.thumb, o.name, o.duration, "/video" + e, e) : cur.chooseMedia(
                            "video", e, o, !1, cur.chosenVideos.length > 1)
                    }), curBox() && cur.chosenVideos.length > 1 && curBox()
                    .hide()
            }
        })
    },
    _updateChooseFixedBottom: function() {
        var e = curBox(),
            o = ge("video_choosebox_bottom");
        if (e && o) {
            var i = gpeByClass("box_layout", e.bodyNode),
                t = getSize(i)[1],
                r = getXY(i)[1];
            t + r - clientHeight() > 0 ? addClass(o, "fixed") : removeClass(o, "fixed")
        }
    },
    _addPendingAction: function(e, o) {
        var i = cur.getOwnerId();
        if (cur.videoPendingAction = cur.videoPendingAction || {}, cur.videoPendingAction[i] = cur.videoPendingAction[i] || {}, e) {
            var t = cur.videoPendingAction[i][e];
            cur.videoPendingAction[i][e] = function() {
                o(), t && t()
            }
        }
    },
    _callPendingAction: function(e) {
        Video._addPendingAction();
        var o = cur.getOwnerId();
        cur.videoPendingAction[o][e] && cur.videoPendingAction[o][e](), cur.videoPendingAction[o][e] = !1
    },
    _clearPendingAction: function(e) {
        Video._addPendingAction(), cur.videoPendingAction[cur.getOwnerId()][e] = !1
    },
    toggleTooltip: function(e, o) {
        showTooltip(e, {
            appendParentCls: "videocat_row",
            black: 1,
            text: o,
            shift: [9, 18, 3],
            needLeft: !0
        })
    },
    toggleAddTooltip: function(e, o, i) {
        var t = gpeByClass("_video_item", e);
        Video.toggleTooltip(e, hasClass(t, "video_added") ? i : o)
    },
    show: function(e, o, i, t) {
        if (cur.isCurrentChooseVideoBox) {
            var r = window.event,
                d = o.split("_");
            return ajax.post("al_video.php", {
                act: "a_video_photo_sizes",
                oid: d[0],
                vid: d[1],
                type: cur.isCurrentChooseVideoBox
            }, {
                onDone: function() {
                    switch (window.event = r || window.event, cur.isCurrentChooseVideoBox) {
                        case "video_add":
                            cur.chooseVideoAdd(o, arguments[0]);
                            break;
                        case "wiki_editor":
                            editorChooseVideo(arguments[0], arguments[1], arguments[2], "video" + o, o);
                            break;
                        case "video_choose":
                            cur.chooseMedia("video", o, arguments[0])
                    }
                }
            }), cancelEvent(e), !1
        }
        if (t && hasClass(t, "video_row_deleted")) return !1;
        if (!vk.id && t && hasClass(t, "video_row_not_public")) return showDoneBox(getLang("video_please_sign_in")), !1;
        var n = extend({
                root: 1,
                autoplay: 1
            }, i || {}),
            a = i ? i.listId : "";
        if (a || (a = cur.oid < 0 ? "club" + -cur.oid : "tagged" == cur.vSection ? "tag" + cur.oid : cur.pvVideoTagsShown && cur.pvShown ? "tag" + cur.pvVideoTagsShown :
                ""), n.module || (n.module = cur.currentModule ? cur.currentModule() : cur.module), Video.isInVideosList()) {
            var c, s = Video.getLoc()
                .section || "all";
            "all" == s ? n.playlistId = cur.oid + "_-2" : "uploaded" == s ? n.playlistId = cur.oid + "_-1" : (c = s.match(/^album_(\d+)$/)) && (n.playlistId = cur.oid +
                "_" + c[1])
        }
        if (Video.isInCatalog() && n.playlistId && /^cat_\d+$/.test(n.playlistId) && t) {
            var l = gpeByClass("videocat_row", t),
                u = l ? l.getAttribute("data-type") : "";
            u = intval(u.replace("cat_", "")), u && cur.moreVideosInfo[u] && (n.catLoadMore = function(e, o, i) {
                Videocat.slideLoadMore(e, o, i)
            }.pbind(l, u))
        }
        if (n.playlistId && (n.addParams = extend(n.addParams || {}, {
                playlist_id: n.playlistId,
                show_next: intval(window.VideoPlaylist && !!VideoPlaylist.getList(n.playlistId)),
                force_no_repeat: 1
            })), cur.videoSearchStats) {
            var _ = domClosest("video_item", t);
            if (_ && _.hasAttribute("data-search-pos")) {
                cur.videoSearchPos = parseInt(_.getAttribute("data-search-pos")), cur.videoSearchPos > cur.videoSearchStats.lastSeenIndex && (cur.videoSearchStats.lastSeenElement =
                    _, cur.videoSearchStats.lastSeenIndex = cur.videoSearchPos), cur.videoSearchStats.positions[cur.videoSearchPos] = extend({
                    clicked: 0
                }, cur.videoSearchStats.positions[cur.videoSearchPos]), cur.videoSearchStats.positions[cur.videoSearchPos].clicked++;
                var v = ++cur.videoSearchStats.clickNum,
                    h = (new Date)
                    .getTime() - cur.videoSearchStats.lastActionTime;
                n.addParams = extend(n.addParams || {}, {
                    click_num: v,
                    click_time: h
                })
            }
        }
        return showVideo(o, a, n, e)
    },
    isInVideosList: function() {
        var e = Video.getLoc();
        return /^videos-?\d+|video-?\d+_\d+$/.test(e[0]) && !e.q
    },
    onDeleteFromPlaylist: function(event, vid, oid) {
        var video = !1,
            list = cur.videoList[cur.vSection].list,
            spliceIndex = -1;
        if (each(list, function(e, o) {
                return o[0] == oid && o[1] == vid ? (video = o, !1) : void 0
            }), "all" == cur.vSection) video[VideoConstants.VIDEO_ITEM_INDEX_HASH] && ajax.post("/al_video.php", {
            act: "a_delete_from_all_albums",
            vid: vid,
            oid: oid,
            target_id: cur.oid,
            hash: video[VideoConstants.VIDEO_ITEM_INDEX_HASH]
        }, {
            onDone: function() {
                Video.updateVideo(cur.oid, video, [], !0), Video.initSorter()
            }
        });
        else {
            var hash, currPlaylistId = (cur.vSection || "_")
                .split("_")[1];
            each(cur.sections, function(e, o) {
                return o[0] == currPlaylistId ? (hash = o[VideoConstants.VIDEO_ITEM_INDEX_HASH], !1) : void 0
            }), hash && ajax.post("/al_video.php", {
                act: "a_add_to_playlist",
                vid: vid,
                oid: oid,
                gid: cur.oid < 0 ? -cur.oid : 0,
                hash: hash,
                playlist_id: currPlaylistId,
                add: 0
            }, {
                onDone: function(playlists) {
                    var playlists = eval("(" + playlists + ")"),
                        removed = [currPlaylistId];
                    playlists.push(currPlaylistId), Video.updateVideo(cur.oid, video, playlists, !1, [], removed), Video.initSorter()
                }
            })
        }
        window.tooltips && tooltips.hideAll(), cancelEvent(event)
    },
    deleteAlbum: function(e, o) {
        return e = e.split("_")[1], showBox("al_video.php", {
            act: "delete_album",
            aid: e,
            oid: cur.oid
        }, {
            dark: 1
        }), cancelEvent(o)
    },
    editAlbum: function(e, o) {
        return e = e.split("_")[1], showBox("al_video.php", {
            act: "edit_album",
            oid: cur.oid,
            aid: e
        }, {
            dark: 1
        }), cancelEvent(o)
    },
    createAlbum: function() {
        showBox("al_video.php", {
            act: "edit_album",
            oid: cur.oid
        }, {
            dark: 1
        })
    },
    uploadVideoBox: function() {
        if (cur.uploadBanned) return setTimeout(showFastBox({
                title: getLang("video_no_upload_title"),
                dark: 1,
                bodyStyle: "padding: 20px; line-height: 160%;"
            }, getLang("video_claims_no_upload"))
            .hide, 5e3), !1;
        showTabbedBox("al_video.php", {
            act: "upload_box",
            oid: cur.oid
        }, {
            stat: ["video_edit.css", "privacy.css", "privacy.js"],
            params: {
                bodyStyle: "position: relative;",
                dark: 1,
                hideButtons: 1
            }
        });
        return !1
    },
    isVideoPlayerOpen: function(e, o) {
        var i = e;
        return o && (i += "_" + o), window.mvcur && mvcur.mvShown === !0 && mvcur.videoRaw === i
    },
    startPollVideoReady: function(e, o) {
        var i = e + "_" + o;
        setTimeout(function() {
            ajax.post("al_video.php", {
                act: "check_upload_status",
                video: i,
                oid: e,
                vid: o
            }, {
                onDone: function(t) {
                    Video.isVideoPlayerOpen(e, o) && (t ? (mvcur.minimized ? Videoview.hide(!1, !0) : Videoview.backLocation(), showVideo(i, "", {})) :
                        Video.startPollVideoReady(e, o))
                }
            })
        }, 1e4)
    },
    showPlaylistsBox: function(e, o, i) {
        showBox("/al_video.php", {
            act: "video_playlists_box",
            target_id: cur.oid,
            oid: i,
            vid: o
        }, {
            dark: 1
        }), cancelEvent(e)
    },
    tcSlide: function(e, o, i, t) {
        function r(e, o) {
            e ? addEvent(o, "mouseleave", function() {
                setStyle(o, "pointer-events", "none"), removeEvent(o, "mouseleave")
            }) : setStyle(o, "pointer-events", "all")
        }
        var d = 4,
            n = gpeByClass("video_tc_slider", o),
            a = geByClass1("video_tc_slider_cont", n),
            c = getSize(a.children[0])[0] + 5,
            s = data(a, "currOffset") || 0;
        s += i, s = Math.max(-a.children.length + d, Math.min(0, s)), data(a, "currOffset", s), t && addClass(a, "no_transition"), setStyle(a, {
            left: s * c
        }), t && setTimeout(function() {
            removeClass(a, "no_transition")
        });
        var l = 0 == s,
            u = s == -(a.children.length - d),
            _ = geByClass1("video_tc_btn_left", n),
            v = geByClass1("video_tc_btn_right", n);
        return toggleClass(_, "video_tc_btn_none", l), toggleClass(v, "video_tc_btn_none", u), r(l, _), r(u, v), e && cancelEvent(e), !1
    },
    deleteUploadedVideo: function() {
        showFastBox({
            title: getLang("video_header_delete"),
            bodyStyle: "padding: 20px; line-height: 160%;",
            dark: 1,
            forceNoBtn: 1
        }, getLang("video_delete_all_user_uploaded"), getLang("box_yes"), function() {
            ajax.post("al_video.php", {
                act: "deleteAllUploaded",
                oid: cur.oid
            }, {
                showProgress: function() {
                    curBox()
                        .showProgress()
                },
                onDone: function() {
                    boxQueue.hideLast()
                }
            })
        }, getLang("box_no"))
    },
    updateAlbum: function() {},
    updateVideo: function() {},
    _initSearchStats: function(e) {
        cur.videoSearchPos = null, cur.videoSearchStats = {
            loc: e,
            totalViews: 0,
            lastSeenElement: null,
            lastSeenIndex: -1,
            totalViewedTime: 0,
            clickNum: 0,
            lastActionTime: (new Date)
                .getTime(),
            positions: []
        }
    },
    _clearSearchStats: function() {
        delete cur.videoSearchPos, delete cur.videoSearchStats
    },
    logSearchStats: function() {
        if (cur.vSearchInputBlurred && cur.videoSearchStats) {
            cur.vSearchInputBlurred = !1;
            var e = cur.videoSearchStats.loc.q + Video._buildFiltersSearchStr();
            if (!cur.globalSearchResults || !cur.globalSearchResults[e]) return;
            for (var o = cur.globalSearchResults[e].list || [], i = Video._serializeSearchParams(cur.videoSearchStats.loc), t = cur.videoSearchStats.lastSeenIndex + 1, r = [],
                    d = 0; t > d; d++) {
                var n = extend(cur.videoSearchStats.positions[d] || {}, Video._extractSearchStat(o[d]));
                r.push(Video._serializeSearchStat(n))
            }
            ajax.post("al_video.php", {
                act: "a_search_query_stat",
                query: i,
                count: cur.videoSearchStats.totalViews,
                total_viewed_time: cur.videoSearchStats.totalViewedTime,
                scrolled_until: t,
                position_stats: r
            })
        }
    },
    _serializeSearchParams: function(e) {
        var o = e.hd ? "1" : "0",
            i = e.notsafe ? "1" : "0",
            t = e.order || "",
            r = e.date || "",
            d = e.len || "",
            n = e.q;
        return o + "#" + i + "#" + t + "#" + r + "#" + d + "#" + n
    },
    _extractSearchStat: function(e) {
        return e ? {
            oid: e[0],
            vid: e[1]
        } : {}
    },
    _serializeSearchStat: function(e) {
        e = e || {};
        for (var o = "", i = 0; i < Video.SEARCH_STATS_POSITION_FIELDS.length; i++) {
            var t = e[Video.SEARCH_STATS_POSITION_FIELDS[i]];
            (null === t || "undefined" == typeof t) && (t = ""), o += o ? "," + t : t
        }
        return o
    },
    _updateLastSeenElement: function(e) {
        if (null !== cur.videoSearchStats.lastSeenElement && e.contains(cur.videoSearchStats.lastSeenElement) || (cur.videoSearchStats.lastSeenElement = domFC(e), cur.videoSearchStats
                .lastSeenElement)) {
            cur.videoSearchStats.lastSeenIndex = 0;
            var o = clientHeight(),
                i = domNS(cur.videoSearchStats.lastSeenElement);
            if (i) {
                for (var t = i.getBoundingClientRect(); null !== i && t.top + i.clientHeight / 2 < o && (cur.videoSearchStats.lastSeenElement = i, i = domNS(cur.videoSearchStats
                        .lastSeenElement));) t = i.getBoundingClientRect();
                cur.videoSearchStats.lastSeenIndex = parseInt(cur.videoSearchStats.lastSeenElement.getAttribute("data-search-pos")) || 0
            }
        }
    }
};
try {
    stManager.done("video.js")
} catch (e) {}
