function AudioPage(e, i, t, a) {
    if (!(this instanceof AudioPage)) {
        var o = gpeByClass("_audio_layout", e);
        return o ? data(o, "audioPage") : !1
    }
    if (AudioUtils.toggleAudioHQBodyClass(), addTemplates({
            audio_row: t.audioRowTpl
        }), this.options = t, this._container = ge(e), this._onSilentLoaded = {}, this._readyAudio = a, cur.canAudioAddToGroup = this.options.canAudioAddToGroup, this.ap =
        getAudioPlayer(), ap.langs = t.langs, extend(cur.lang || {}, t.langs), this.ap.getCurrentAudio() && delete this._readyAudio, i.type) {
        var s = getAudioPlayer()
            .hasPlaylist(i.type, i.ownerId, i.albumId);
        s ? i = s : (i = new AudioPlaylist(i), i.loadSilent())
    } else ap.friendBlock = i.blocks, i = this.ap.getCurrentPlaylist(), i.mergeWith({
        blocks: ap.friendBlock
    });
    if (isObject(t.myPlaylist)) {
        var r = new AudioPlaylist(t.myPlaylist);
        this._myPlaylist = r.getId()
    }
    this.searchInputEl = geByClass1("_field", geByClass1("_audio_search_input", this._container)), this._updateAdditionalBlocksAndRightMenu(i), this._initScroll(), this.ap.setStatusExportInfo(
        t.exp), this.onShow(i), this._initialPlaylist = i, data(e, "audioPage", this);
    var d = this;
    this.isLayer() ? uiSearch.init(this.searchInputEl) : (cur.destroy.push(function() {
        ap.off(d), delete d
    }), cur.module = "audio"), this.ap.on(this, AudioPlayer.EVENT_PLAY, function(e, i, t) {
        var a = this.getCurrentPlaylist(),
            o = !this.isLayer() && this.ap.layer && this.ap.layer.isShown();
        i && 0 != t && a.indexOfAudio(e) >= 0 && (o || this.scrollToTrack())
    }.bind(this)), this.isLayer() || (nav.curLoc && nav.setLoc(nav.fromStr(nav.curLoc)), nav.objLoc.q && nav.change(nav.objLoc, !1, {
        forceUpdate: !0,
        globalQuery: nav.objLoc.q
    })), setTimeout(function() {
        d._initAlbumsSort()
    }, 100)
}
AudioPage.address = "audio", AudioPage.updateSearchHighlight = function(e) {
    var i = geByClass1("_audio_playlist", gpeByClass("_audio_layout", this));
    toggleClass(i, "audio_search_focused", "focus" == e.type)
}, AudioPage.onSearchFocused = function(e) {
    AudioPage.updateSearchHighlight(e)
}, AudioPage.onSearchBlurred = function(e) {
    AudioPage.updateSearchHighlight(e);
    var i = AudioPage(e.target);
    i.updateSearchUrl()
}, AudioPage.prototype.updateSearchUrl = function() {
    var e = this.getCurrentPlaylist();
    if (e.getType() == AudioPlaylist.TYPE_SEARCH && !this.isLayer()) {
        var i = e.getSearchParams();
        nav.setLoc(extend(nav.objLoc, {
            q: i.q
        }))
    }
}, AudioPage.prototype._deinitKeyEvents = function() {
    this._audioHQKeyEventHandler1 && removeEvent(window.document, "keydown", this._audioHQKeyEventHandler1), this._audioHQKeyEventHandler2 && removeEvent(window.document,
            "keyup", this._audioHQKeyEventHandler2), this._audioHQKeyEventHandler3 && removeEvent(window.document, "visibilitychange", this._audioHQKeyEventHandler3), this._audioHQKeyEventHandler4 &&
        removeEvent(window.document, "mousedown", this._audioHQKeyEventHandler4), this._audioSeekKeyEventHandler && removeEvent(window.document, "keydown", this._audioSeekKeyEventHandler)
}, AudioPage.prototype._initKeyEvents = function() {
    function e() {
        return !i.isLayer() && ap.layer && ap.layer.isShown()
    }
    this._deinitKeyEvents();
    var i = this;
    window.Notifier && Notifier.addRecvClbk("audio_hq_label", "audio", function() {
        AudioUtils.toggleAudioHQBodyClass()
    }), addEvent(window.document, "visibilitychange", this._audioHQKeyEventHandler3 = function() {
        delete cur.ctrlPressed
    }), addEvent(window.document, "mousedown", this._audioHQKeyEventHandler4 = function(e) {
        e.ctrlKey && (cur.ctrlMouseDown = !0, cur.ctrlPressed = !1)
    }, !0), addEvent(window.document, "keydown", this._audioHQKeyEventHandler1 = function(i) {
        e() || (cur.ctrlPressed = i.keyCode == KEY.CTRL)
    }), addEvent(window.document, "keyup", this._audioHQKeyEventHandler2 = function(i) {
        if (!e() && ((i.keyCode != KEY.CTRL || cur.ctrlMouseDown) && (delete cur.ctrlMouseDown, delete cur.ctrlPressed), cur.ctrlPressed)) {
            var t = getAudioPlayer(),
                a = AudioUtils.hasAudioHQBodyClass();
            t.showHQLabel(!a), window.Notifier && Notifier.lcSend("audio_hq_label"), delete cur.ctrlPressed
        }
    }), addEvent(window.document, "keydown", this._audioSeekKeyEventHandler = function(i) {
        var t = getAudioPlayer();
        i.target && (inArray(i.target.tagName.toLowerCase(), ["input", "textarea"]) && "" != val(i.target) || hasClass(i.target, "fc_editable")) || t.isPlaying() &&
            inArray(i.keyCode, [KEY.RIGHT, KEY.LEFT]) && !i.ctrlKey && (e() || t.seekCurrentAudio(i.keyCode == KEY.RIGHT))
    }), cur.destroy.push(function() {
        i._deinitKeyEvents()
    })
}, AudioPage.prototype.editFeed = function() {
    var e = this;
    showTabbedBox("al_settings.php", {
        act: "a_edit_owners_list",
        list: "audio",
        height: lastWindowHeight
    }, {
        stat: ["privacy.js", "privacy.css", "ui_controls.js", "ui_controls.css", "indexer.js"],
        dark: 1
    }), cur.onOListSave = function(i, t, a, o) {
        var s = curBox(),
            r = {
                act: "a_ignore_olist",
                hash: o.hash
            };
        return i.length < t.length ? r.White = i.join(",") : r.Black = t.join(","), ajax.post("al_audio.php", r, {
            onDone: function(i, t) {
                s.hide();
                var a = e.getCurrentPlaylist();
                a.clean(), e.refreshCurrentPage()
            },
            showProgress: s.showProgress,
            hiderogress: s.hideProgress
        }), !1
    }
}, AudioPage.prototype.refreshCurrentPage = function() {
    this.switchToSection(this.getCurrentPlaylist())
}, AudioPage.prototype.updateStatusExportControls = function() {
    var e = this.ap.getStatusExportInfo();
    each(geByClass("_audio_export_status", this._container), function() {
        toggleClass(this, "on", !!e[domData(this, "oid")])
    });
    var i = this.ap.hasStatusExport(),
        t = geByClass1("_audio_page_player_status", this._container);
    return toggleClass(t, "audio_page_player_btn_enabled", i), !1
}, AudioPage.prototype.updateStatusExport = function(e, i) {
    e && checkbox(e);
    var t, a, i = intval(i),
        o = this.ap.getStatusExportInfo() || {};
    if (i) o[i] ? (delete o[i], t = !1) : (o[i] = 1, t = !0);
    else if (this.ap.hasStatusExport()) {
        for (var s in o) delete o[s];
        t = !1
    } else i = vk.id, o[i] = 1, t = !0;
    this.ap.setStatusExportInfo(o), i != vk.id && i || checkbox("currinfo_audio", this.ap.hasStatusExport()), this.updateStatusExportControls();
    var r = this.ap.getCurrentAudio();
    r && (a = AudioUtils.asObject(r)
        .fullId);
    var d = (this.ap.getCurrentPlaylist(), null);
    ajax.post("al_audio.php", {
        act: "toggle_status",
        exp: intval(t),
        oid: i,
        hash: vk.statusExportHash,
        id: a,
        top: intval(d && (d.top_audio || d.top))
    })
}, AudioPage.prototype.playStatusAudio = function(e, i, t) {
    var a = gpeByClass("_audio_friend", t);
    this.ap.playLive(e, {
        showProgress: showProgress.pbind(a),
        hideProgress: hideProgress.pbind(a)
    }), cancelEvent(i)
}, AudioPage.prototype._initAlbumsSort = function() {
    if (this.options.albumsReorderHash && !this.isLayer()) {
        var e = geByClass1("_audio_albums_wrap", this._container);
        if (!e) {
            var i = geByClass("_audio_album_item", this._container);
            i.length && (e = se('<div class="_audio_albums_wrap audio_albums_wrap"></div>'), domInsertBefore(e, i[0]), each(i, function() {
                e.appendChild(this)
            }))
        }
        this._albumsSorter && this._albumsSorter.destroy();
        var t = this;
        this._albumsSorter = new GridSorter(e, !1, {
            limitBottomMove: !0,
            noPosTransform: !0,
            onReorder: function(e, i) {
                var a = e.id.split("_")
                    .pop(),
                    o = i ? i.id.split("_")
                    .pop() : 0;
                ajax.post("al_audio.php", {
                    act: "reorder_albums",
                    aid: a,
                    before: o,
                    hash: t.options.albumsReorderHash,
                    oid: t.options.oid
                }, {
                    onDone: function() {}
                })
            }
        })
    }
}, AudioPage.deleteAlbum = function(e, i) {
    var t = cur.audioPage.options.oid,
        a = showFastBox({
            title: AudioPlayer.getLang("audio_delete_album_title"),
            dark: 1
        }, AudioPlayer.getLang("audio_delete_album_are_you_sure"), AudioPlayer.getLang("audio_delete_album_button"), function(o) {
            ajax.post("al_audio.php", {
                act: "delete_album",
                album_id: e,
                hash: i,
                gid: 0 > t ? -t : !1
            }, {
                showProgress: lockButton.pbind(o),
                hideProgress: unlockButton.pbind(o),
                onDone: function(i, a) {
                    try {
                        boxQueue.hideAll(), re(geByClass1("_ui_item_audio_album_" + t + "_" + e)), nav.go("/audios" + t)
                    } catch (o) {}
                },
                onFail: function() {
                    a.hide(200)
                }
            })
        }, getLang("global_cancel"))
}, AudioPage.saveAlbum = function(e, i, t) {
    var a = val("album_name");
    if (!a) return notaBene("album_name"), !1;
    var o = curBox(),
        s = cur.audioPage.options.oid,
        r = !t,
        d = {
            act: "save_album",
            album_id: t,
            name: a,
            gid: 0 > s ? -s : 0,
            Audios: e.join(","),
            hash: cur.audioPage.options.saveAlbumHash
        };
    return ajax.post("al_audio.php", d, {
        showProgress: lockButton.pbind(i),
        hideProgress: unlockButton.pbind(i),
        onFail: o.hide,
        onDone: function(i, t, a, o) {
            var d = getAudioPlayer(),
                l = d.getPlaylist(AudioPlaylist.TYPE_ALBUM, s, i);
            l.clean(), l.mergeWith({
                list: o,
                hasMore: !1
            }), d.deletePlaylist(d.getPlaylist(AudioPlaylist.TYPE_RECOM, s, "album" + i)), each(e, function(e, i) {
                var t = {};
                t[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] = i, d.updateAudio(s + "_" + i, t)
            }), each(d.getPlaylists(), function(e, i) {
                i.getType() == AudioPlaylist.TYPE_ALBUM && i.getOwnerId() == s && d.deletePlaylist(i)
            });
            var n = geByClass1("ui_rmenu", cur.audioPage._container),
                u = geByClass1("ui_rmenu_item_sel", n),
                _ = u ? u.id : !1,
                h = domPN(n);
            h.replaceChild(se(a), n), cur.audioPage._initAlbumsSort(), _ && ge(_) && uiRightMenu.switchMenu(ge(_)), curBox()
                .hide(), setTimeout(function() {
                    if (r) nav.go("/audios" + s + "?album_id=" + i);
                    else if (cur.audioPage) {
                        var e = cur.audioPage.getCurrentPlaylist();
                        e.getType() == AudioPlaylist.TYPE_ALBUM && e.getOwnerId() == s && cur.audioPage.switchToSection(e)
                    }
                }, 200)
        }
    }), !1
}, AudioPage.filterByAlbum = function(e, i) {
    for (var t = e.length, a = [], o = 0; t > o; o++) {
        var s = e[o];
        i == s[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] && a.push(s)
    }
    return a
}, AudioPage.showActionTooltip = function(e, i) {
    showTooltip(e, {
        text: i,
        black: 1,
        shift: [8, 5, 0],
        appendParentCls: "_audio_page_player"
    })
}, AudioPage.prototype.createAlbum = function(e, i) {
    return this.editAlbum(0), cancelEvent(e)
}, AudioPage.prototype.editAlbum = function(e, i, t) {
    function a() {
        d && (removeClass(d, "in_progress"), hideProgress(d)), showTabbedBox("al_audio.php", {
            act: "edit_album_box",
            album_id: e || 0,
            oid: o.options.oid
        }, {
            stat: ["privacy.js", "privacy.css", "ui_controls.js", "ui_controls.css", "indexer.js"],
            dark: 1
        })
    }
    var o = this,
        s = getAudioPlayer(),
        r = s.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, AudioPlaylist.ALBUM_ALL),
        d = i ? gpeByClass("_audio_album_btns", i) : null;
    d && (addClass(d, "in_progress"), showProgress(d)), r.loadSilent(function(i) {
        i.isComplete() ? a() : (i = s.getPlaylist(AudioPlaylist.TYPE_ALBUM, o.options.oid, e), i.loadSilent(a))
    }), cancelEvent(t)
}, AudioPage.prototype.onHide = function() {
    var e = this;
    cur.nav = cur.nav.filter(function(i) {
        return e._nav_func != i
    }), this._deinitKeyEvents()
}, AudioPage.prototype.addMd = function(e, i, t) {
    var a = gpeByClass("_audio_row", e),
        o = AudioUtils.getAudioFromEl(a, !0);
    return cur.editTopAudio = o, showBox("al_audio.php", {
        act: "edit_audio_box",
        aid: i,
        top_edit: 1
    }, {
        params: {
            width: "456px",
            bodyStyle: "padding: 20px; background-color: #F7F7F7;",
            hideButtons: 1
        },
        dark: 1
    }), t && cancelEvent(t), !1
}, AudioPage.prototype.removeMd = function(e, i, t) {
    var a = gpeByClass("_audio_row", e),
        o = AudioUtils.getAudioFromEl(a, !0);
    return re(a), ajax.post("al_audio.php", {
        act: "delete_audio",
        oid: o.ownerId,
        aid: o.id,
        hash: o.editHash,
        top_moder: 1
    }), t && cancelEvent(t), !1
}, AudioPage.prototype.showRecoms = function(e, i, t) {
    if (!i) {
        var a = this.readyAudio ? this.readyAudio : this.ap.getCurrentAudio();
        i = AudioUtils.asObject(a)
            .fullId
    }
    return nav.go({
        0: nav.objLoc[0],
        section: "recoms",
        audio_id: i
    }), cancelEvent(t)
}, AudioPage.prototype.showAlbumRecoms = function(e, i, t, a) {
    return nav.go({
        0: nav.objLoc[0],
        section: "recoms",
        album_id: a
    }), cancelEvent(i)
}, AudioPage.prototype.onShow = function(e) {
    this._initNavigation(), this.saveSearchHistoryWait = !1, val(this.searchInputEl, "", !0), uiSearch.removeAllFilters(this.searchInputEl), setTimeout(elfocus.pbind(this.searchInputEl),
            10), e = e || this.ap.getCurrentPlaylist() || this.getCurrentPlaylist(), this.isLayer() && e != this.ap.getCurrentPlaylist() && this._initialPlaylist && (e = this._initialPlaylist),
        this.switchToSection(e), this._initPlayer(), this._initKeyEvents(), this.updateStatusExportControls(), this.isLayer() && setTimeout(function() {
            this.getLayer()
                .sb.widthUpdated()
        }.bind(this)), this.scrollToTrack(!0)
}, AudioPage.prototype.onAudioUploaded = function(e, i) {
    if (i) {
        var t = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, AudioPlaylist.ALBUM_ALL);
        t.addAudio(i, 0);
        var a = this.ap.getCurrentPlaylist();
        a && a.getSelf() == t && a.addAudio(i);
        var o = this.getCurrentPlaylist();
        o == t && this.switchToSection(o)
    }
}, AudioPage.prototype.uploadAudio = function(e) {
    return this.options.uploadBanned ? void setTimeout(showFastBox({
            title: AudioPlayer.getLang("audio_no_upload_title"),
            bodyStyle: "padding: 20px; line-height: 160%;",
            dark: 1
        }, AudioPlayer.getLang("audio_claims_no_upload"))
        .hide, 5e3) : void showBox("al_audio.php", extend(e || {}, {
        act: "new_audio",
        gid: this.options.oid < 0 ? -this.options.oid : 0
    }), {
        params: {
            width: "450px",
            bodyStyle: "padding: 0px; position: relative;"
        },
        dark: 1
    })
}, AudioPage.prototype.editAudio = function(e, i, t) {
    return showBox("al_audio.php", {
        act: "edit_audio_box",
        aid: i
    }, {
        params: {
            width: "456px",
            bodyStyle: "padding: 20px; background-color: #F7F7F7;",
            hideButtons: 1
        },
        dark: 1
    }), t && cancelEvent(t), !1
}, AudioPage.prototype.hideRecommendation = function(e) {
    var i = AudioUtils.getAudioFromEl(e, !0),
        t = AudioUtils.asObject(this.ap.getCurrentAudio());
    t && t.fullId == i.fullId && this.ap.playNext();
    var a = AudioUtils.getAudioExtra(i)
        .recom,
        o = {
            act: "hide_recommendation",
            q: a.q,
            hash: a.hash
        };
    nav.objLoc.audio_id && (o.recommendation_type = "query"), nav.objLoc.album_id && (o.recommendation_type = "album"), ajax.post("al_audio.php", o), cur._audioAddRestoreInfo[
        i.fullId] = {
        state: "recom_hidden"
    };
    var s = this.ap.getCurrentPlaylist();
    s && s.getType() == AudioPlaylist.TYPE_RECOM && (cur._audioAddRestoreInfo[i.fullId].removedCurrentPos = s.removeAudio(i))
}, AudioPage.prototype.restoreRecommendation = function(e) {
    var i = AudioUtils.getAudioFromEl(e, !0),
        t = AudioUtils.getAudioExtra(i)
        .recom,
        a = {
            act: "restore_recommendation",
            q: t.q,
            hash: t.hash,
            aid: i.fullId
        };
    nav.objLoc.audio_id && (a.recommendation_type = "query"), nav.objLoc.album_id && (a.recommendation_type = "album"), ajax.post("al_audio.php", a), removeClass(e,
        "audio_deleted");
    var o = cur._audioAddRestoreInfo[i.fullId].removedCurrentPos,
        s = this.ap.getCurrentPlaylist();
    o >= 0 && s && s.getType() == AudioPlaylist.TYPE_RECOM && s.addAudio(AudioUtils.getAudioFromEl(e), o), delete cur._audioAddRestoreInfo[i.fullId]
}, AudioPage.isInRecentPlayed = function(e) {
    var i = gpeByClass("_audio_playlist", e);
    return i && hasClass(i, "audio_recent_rows") ? data(i, "playlist") : !1
}, AudioPage.prototype.deleteAudio = function(e, i, t, a) {
    function o() {
        return intval(domData(r, "in-progress"))
    }

    function s(e) {
        return domData(r, "in-progress", intval(e))
    }
    window.tooltips && tooltips.hideAll();
    var r = domClosest("_audio_row", e);
    if (!o()) {
        s(!0), hasClass(r, "claimed") && (a = !0);
        var d = AudioUtils.getAudioFromEl(r, !0);
        if (AudioUtils.isRecomAudio(d)) return addClass(r, "audio_deleted"), this.hideRecommendation(r), s(!1), cancelEvent(t);
        var l;
        if (l = AudioPage.isInRecentPlayed(r)) {
            ajax.post("al_audio.php", {
                act: "remove_listened",
                audio_owner_id: d.ownerId,
                audio_id: d.id,
                hash: d.actionHash
            }), s(!1), re(r);
            var n = AudioUtils.asObject(ap.getCurrentAudio());
            return d.id == n.id && d.ownerId == n.ownerId ? l._nextAfterRemovedIndex = l.indexOfAudio(d) : delete l._nextAfterRemovedIndex, l.removeAudio(d), this._updateEmptyPlaceholder(
                l), cancelEvent(t)
        }
        cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {};
        var u = cur._audioAddRestoreInfo[d.fullId];
        if (!hasClass(r, "audio_delete_all") || !u.deleteAll) {
            a ? re(r) : (addClass(r, "audio_deleted"), addClass(r, "canadd"), removeClass(r, "canedit"));
            var _ = this;
            return ajax.post("al_audio.php", {
                act: "delete_audio",
                oid: d.ownerId,
                aid: d.id,
                hash: d.editHash,
                restore: 1
            }, {
                onDone: function(e, i) {
                    a || (s(!1), e && addClass(r, "audio_delete_all")), cur._audioAddRestoreInfo[d.fullId] = {
                        state: "deleted",
                        deleteAll: e,
                        deleteConfirmMsg: i
                    }, a && _._deleteDeletedAudios()
                }
            }), cancelEvent(t)
        }
        showFastBox({
            title: getLang("audio_delete_all_title"),
            dark: 1
        }, u.deleteConfirmMsg || "", getLang("global_delete"), function(e) {
            var i = extend({
                act: "delete_all"
            }, u.deleteAll);
            ajax.post("al_audio.php", i, {
                showProgress: lockButton.pbind(e),
                onDone: function() {
                    var e = getAudioPlayer()
                        .getPlaylist(AudioPlaylist.TYPE_ALBUM, u.deleteAll.from_id, AudioPlaylist.ALBUM_ALL);
                    getAudioPlayer()
                        .deletePlaylist(e), nav.reload()
                }
            })
        }, getLang("global_cancel"))
    }
}, AudioPage.prototype.toggleAudioDurationType = function() {
    this.ap.toggleDurationType()
}, AudioPage.prototype._updateShuffleButton = function(e) {
    toggleClass(geByClass1("_audio_shuffle_btn", this._container), "audio_page_player_btn_enabled", !!e.shuffle)
}, AudioPage.prototype.toggleRepeat = function(e) {
    var i = toggleClass(e, "audio_page_player_btn_enabled");
    if (this.ap.toggleRepeatCurrentAudio(i), this.isLayer() && cur.audioPage) {
        var t = geByClass1("_audio_page_player_repeat", cur.audioPage._container);
        t && toggleClass(t, "audio_page_player_btn_enabled", i)
    }
    var a = geByClass1("_blind_label", e);
    a.innerHTML = this.ap.isRepeatCurrentAudio() ? getLang("audio_dont_repeat_tooltip") : getLang("audio_repeat_tooltip")
}, AudioPage.prototype.toggleShuffle = function(e) {
    var i = this.getCurrentPlaylist();
    i.isShuffled() ? (removeClass(e, "audio_page_player_btn_enabled"), i.shuffle(0)) : (addClass(e, "audio_page_player_btn_enabled"), i.shuffle(irand(1, 999999))), this.switchToSection(
        i)
}, AudioPage.onFilterRemoved = function(e, i) {
    var t = AudioPage(i);
    switch (e) {
        case "performer":
            var a = "audio_search_type_" + intval(t.isLayer()),
                o = window.radioBtns[a];
            radiobtn(o.els[0], 0, a);
            break;
        case "sort":
            var s = t._searchSortFilter.options.defaultItems[0][0];
            t._searchSortFilter.selectItem(s, !1);
            break;
        case "lyrics":
            removeClass(geByClass1("_audio_fltr_with_lyrics", t._container), "on")
    }
    t.onSearchFiltersChanged()
}, AudioPage.prototype.syncParametersUI = function(e) {
    var i = "audio_search_type_" + intval(this.isLayer()),
        t = window.radioBtns[i];
    t && radiobtn(t.els[e.performer ? 1 : 0], !!e.performer, i);
    var a = e.sort;
    !a && this._searchSortFilter && (a = this._searchSortFilter.options.defaultItems[0][0]);
    var o = geByClass1("_audio_fltr_with_lyrics", this._container);
    toggleClass(o, "on", !!e.lyrics);
    var s = {
            performer: AudioPlayer.getLang("audio_performers_only"),
            lyrics: AudioPlayer.getLang("audio_search_with_text"),
            sort: AudioPlayer.getLang("audio_search_by_length")
        },
        r = this.searchInputEl;
    each(["performer", "lyrics", "sort"], function(i, t) {
        uiSearch.toggleFilter(r, t, s[t], !!e[t])
    })
}, AudioPage.prototype.onSearchFiltersChanged = function(e) {
    var i = window.radioBtns["audio_search_type_" + intval(this.isLayer())],
        t = intval(this._searchSortFilter.selectedItems()[0][0]),
        a = {
            performer: i.val ? 1 : null,
            lyrics: hasClass(geByClass1("_audio_fltr_with_lyrics", this._container), "on") ? 1 : null,
            sort: t ? 1 : null
        },
        o = e && isObject(e) ? e : a;
    this.isLayer() && (o = extend({}, this._prevLoc, o)), nav.change(o, !1, {
        fromSearch: !0,
        filtersChanged: !0
    })
}, AudioPage.prototype.initSearchParams = function() {
    window.radioBtns["audio_search_type_" + intval(this.isLayer())] = {
        els: geByClass("_audio_search_type", this._container),
        keep: this.isLayer()
    }, this._searchSortFilter = new Dropdown(geByClass1("_audio_fltr_sort", this._container), this.options.sortFilters, {
        big: 1,
        zeroPlaceholder: !0,
        onChange: this.onSearchFiltersChanged.bind(this)
    }), this.syncParametersUI(nav.objLoc)
}, AudioPage.prototype._getCurrentSearchParams = function() {
    var e = window.radioBtns["audio_search_type_" + intval(this.isLayer())],
        i = intval(this._searchSortFilter.selectedItems()[0][0]);
    return {
        performer: e.val ? 1 : null,
        lyrics: hasClass(geByClass1("_audio_fltr_with_lyrics", this._container), "on") ? 1 : null,
        sort: i ? 1 : null
    }
}, AudioPage.searchAudios = function(e, i, t) {
    AudioPage(this)
        .searchAudios(e, i, t)
}, AudioPage.prototype.searchAudios = function(e, i, t) {
    e = trim(e), nav.change(extend(this._getCurrentSearchParams(), {
        q: e || null
    }), !1, {
        fromSearch: !0,
        globalQuery: i,
        fromHistory: t
    })
}, AudioPage.prototype.onUserAction = function(e, i) {
    var t = i.indexOfAudio(e);
    if (-1 != t && i.getType() == AudioPlaylist.TYPE_SEARCH) {
        var a = i.getOwnerId() == vk.id && t >= 0 && t < i.getLocalFoundCount();
        if (!a) {
            var o = i.getSearchParams();
            o.globalQuery && uiSearch.saveHistorySearch(this.searchInputEl, o.globalQuery, e.ownerId, e.id, i.getTotalCount(), i.getTotalCountHash())
        }
    }
}, AudioPage.searchMoreFriends = function(e) {
    AudioPage(this)
        .searchMoreFriends(e)
}, AudioPage.prototype._updateFriendsList = function(e, i, t) {
    if (e = trim(e), this._friendSearchInProgress = !1, e) {
        var a = geByClass1("_audio_friends_list", this._container),
            o = (getSize(a)[1], se('<div class="audio_friends_list _audio_friends_list" style="opacity: 0; position: absolute; top: 0;">' + e + "</div>"));
        t && (this._shownFriends = []), domPN(a)
            .appendChild(o), setTimeout(function() {
                setStyle(o, {
                    opacity: 1
                })
            }), setTimeout(function() {
                re(a), setStyle(o, {
                    position: "relative"
                }), updateNarrow()
            }, 160)
    }
}, AudioPage.prototype.searchMoreFriends = function(e) {
    this._friendSearchInProgress || (this._friendSearchInProgress = !0, ajax.post("al_audio.php", {
        act: "search_friends",
        str: e
    }, {
        onDone: this._updateFriendsList.bind(this)
    }))
}, AudioPage.prototype.showMoreFriends = function(e, i) {
    if (!this._friendSearchInProgress) {
        this._friendSearchInProgress = !0, this._shownFriends = this._shownFriends || [];
        var t = this;
        each(geByClass("_audio_friend", this._container), function() {
            t._shownFriends.push(domData(this, "id"))
        }), ajax.post("al_audio.php", {
            act: "more_friends",
            exclude: i ? !1 : this._shownFriends.join(","),
            owner: i
        }, {
            showProgress: e ? lockButton.pbind(e) : !1,
            hideProgress: e ? unlockButton.pbind(e) : !1,
            onDone: this._updateFriendsList.bind(this)
        })
    }
}, AudioPage.prototype.catalogShowMorePerformers = function(e) {
    var i = [],
        t = geByClass1("_audio_catalog_performers", gpeByClass("_audio_additional_block", e)),
        a = domData(t, "genre");
    each(geByClass("_audio_catalog_performer", t), function() {
        i.push(domData(this, "performer-id"))
    }), ajax.post("al_audio.php", {
        act: "get_more_performers",
        offset: 4,
        exclude: i.join(","),
        genre: a
    }, {
        onDone: function(i) {
            t.appendChild(se("<div>" + i + "</div>")), re(e)
        },
        showProgress: lockButton.pbind(e),
        hideProgress: unlockButton.pbind(e)
    })
}, AudioPage.prototype.showStatusTooltip = function(e) {
    this.statusTT || (this.statusTT = !0, ajax.post("al_audio.php", {
        act: "status_tt"
    }, {
        onDone: function(i, t) {
            this.statusTT = new ElementTooltip(e, {
                offset: [0, 3],
                content: t,
                width: 300,
                offset: [-5, 0],
                elClassWhenTooltip: "audio_status_tt_shown",
                id: "audio_status_tt",
                onFirstTimeShow: function(e) {
                    this.sb = new uiScroll(geByClass1("audio_status_wrap", e), {
                        global: !0
                    })
                },
                onShow: function() {
                    setTimeout(function() {
                        this.statusTT.sb.update()
                    }.bind(this), 0)
                }.bind(this)
            }), cur._onStatusExportBtn && (this.statusTT.show(), this.statusTT.sb.update())
        }.bind(this)
    }))
}, AudioPage.prototype.isLayer = function() {
    return !!this.getLayer()
}, AudioPage.prototype.getLayer = function() {
    return this.options.layer
}, AudioPage.prototype._initSorter = function(e) {
    function i(i, t, a) {
        var s = domData(i, "full-id"),
            r = domData(t, "full-id"),
            l = domData(a, "full-id"),
            n = e.indexOfAudio(s),
            u = e.indexOfAudio(r),
            _ = e.indexOfAudio(l);
        r ? e.moveAudio(n, u) : l && e.moveAudio(n, _ + 1), o.isLayer() || (s = s.split("_"), ajax.post("al_audio.php", {
            act: "reorder_audios",
            oid: intval(s[0]),
            aid: intval(s[1]),
            before: r,
            after: l,
            hash: o.options.reorderHash,
            top_moder: intval(d)
        }))
    }

    function t(e) {
        var i = e.id.split("_");
        return i[i.length - 1]
    }
    var a = geByClass1("_audio_playlist", this._container);
    this._sorter && !this._sorter.isCurrentlyDragging() && (this._sorter.destroy(), this._sorter = !1);
    var o = this,
        s = !1,
        r = this.getCurrentPlaylist(),
        d = !1;
    if (this.isLayer() ? s = r == this.ap.getCurrentPlaylist() : (d = e.getType() == AudioPlaylist.TYPE_POPULAR && this.options.md, s = e.getOwnerId() > 0 && vk.id != e.getOwnerId() ?
            !1 : this.options.reorderHash && e.getType() == AudioPlaylist.TYPE_ALBUM || d), s && !this._sorter) {
        var l = this.isLayer() ? {} : {
            onDragOverElClass: "_audio_album_item",
            onDragEnter: function(i, a) {
                var o = t(i);
                o != e.getAlbumId() && (addClass(a, "audio_item_drag_over_album"), addClass(i, "audio_album_drop"))
            },
            onDragLeave: function(e, i) {
                removeClass(i, "audio_item_drag_over_album"), removeClass(e, "audio_album_drop")
            },
            onDragDrop: function(i, a) {
                removeClass(a, "audio_item_drag_over_album"), removeClass(i, "audio_album_drop");
                var s = t(i),
                    r = domData(a, "full-id");
                if (s == e.getAlbumId()) return !0;
                ajax.post("al_audio.php", {
                    act: "a_move_to_album",
                    album_id: s,
                    audio_id: r.split("_")[1],
                    hash: o.options.moveHash,
                    gid: o.options.oid < 0 ? -o.options.oid : null
                });
                var d = o.getCurrentPlaylist(),
                    l = d.indexOfAudio(r);
                if (d.getAlbumId() != AudioPlaylist.ALBUM_ALL && l >= 0) d.removeAudio(r), o.switchToSection(d);
                else {
                    var n = o.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, o.options.oid, s);
                    n.clean()
                }
                var u = {};
                return u[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] = s, o.ap.updateAudio(r, u), !0
            }
        };
        this._sorter = new GridSorter(a, extend({
            onReorder: i,
            wrapNode: this.isLayer() ? geByClass1("audio_layer_rows_wrap", this._container) : !1,
            dragCls: "audio_item_drag",
            limitBottomMove: !0
        }, l))
    }
}, AudioPage.prototype._updateLayerRowsBottomPadding = function() {
    if (this.isLayer()) {
        var e = geByClass1("_audio_rows", this._container);
        setStyle(e, "padding-bottom", null);
        var i = (getXY(e)[1], getSize(e)[1] + getSize(this.searchInputEl)[1]),
            t = 0,
            a = geByClass1("_audio_layer_menu_wrap", this._container),
            o = getSize(a)[1],
            s = geByClass1("_audio_layer_rows_wrap", this._container),
            r = getSize(s)[1],
            d = Math.max(o, r);
        d > i ? setStyle(e, "padding-bottom", d - i + t - 1) : setStyle(e, "padding-bottom", null), setTimeout(function() {
            var e = getAudioPlayer()
                .layer;
            e && e.sb.update()
        }, 1)
    }
}, AudioPage.prototype._initAutoList = function(e, i, t) {
    var a = this,
        o = getAudioPlayer(),
        s = geByClass1("_audio_playlist", this._container),
        r = geByClass1("_ui_audio_load_more", this._container),
        d = 50;
    this._autoList && this._autoList.destroy();
    var l = 0,
        n = !1;
    this._autoList = new AutoList(s, {
        isLayer: this.isLayer(),
        scrollNode: this.isLayer() ? geByClass1("_audio_layer_rows_wrap", this._container) : window,
        contentNode: geByClass1("_audio_rows", this._container),
        renderImmediate: !0,
        rowClass: "_audio_row audio_feed_post",
        onNoMore: function() {
            hide(r), a._updateEmptyPlaceholder(e)
        },
        onHasMore: function() {
            a._updateEmptyPlaceholder(e)
        },
        onRendered: function() {
            if (t(!1), a._updateLayerRowsBottomPadding(), o.updateCurrentPlaying(), !n)
                if (n = !0, a.isLayer()) {
                    var e = geByClass1("_audio_layer_rows_wrap", a._container);
                    e.scrollTop = 0, a.getLayer()
                        .sb.update()
                } else scrollToY(0)
        },
        onNeedRows: function(i, n, u, _) {
            function h(e) {
                if (e) {
                    if (0 == n && (s.innerHTML = ""), e.getType() == AudioPlaylist.TYPE_FEED && e != o.getCurrentPlaylist()) g = e.getItemsList()
                        .slice(n, n + d);
                    else {
                        c = e.getAudiosList()
                            .slice(n, n + d);
                        var t = e.getType() == AudioPlaylist.TYPE_SEARCH && o.getCurrentPlaylist() != e,
                            r = !1;
                        if (t) {
                            var l = e.getSearchParams()
                                .q;
                            l += " " + (parseLatin(l) || ""), l = trim(l.replace(/\)/g, "")
                                .replace(/&/, "&amp;")), r = new RegExp("(\\s|^)(" + l.replace(vkIndexer.delimiter, "|")
                                .replace(/(^\||\|$|\?)/g, "") + ")", "gi")
                        }
                        each(c, function(i, a) {
                            t && n + i == e.getLocalFoundCount() && g.push("<h3>" + langNumeric(e.getTotalCount(), o.langs.audio_global_search_found, !0) +
                                "</h3>"), a = clone(a), a[AudioUtils.AUDIO_ITEM_INDEX_TITLE] = a[AudioUtils.AUDIO_ITEM_INDEX_TITLE].replace(r,
                                "$1<em>$2</em>"), a[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] = a[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER].replace(r,
                                "$1<em>$2</em>");
                            var s = "",
                                d = AudioUtils.getAddRestoreInfo()[AudioUtils.asObject(a)
                                    .fullId];
                            d && "added" == d.state && (s = "added"), g.push(AudioUtils.drawAudio(a, s))
                        })
                    }
                    if (i(g), !n && !a.isLayer()) {
                        var u = e.getTitle() || document.title;
                        document.title = replaceEntities(u.replace(/(<em>|<\/em>|<strong>|<\/strong>)/g, ""))
                    }
                }
            }
            var c, g = [];
            l = n, _ || t(!0), n > 0 && (show(r), lockButton(r)), e.load(n, function(e) {
                e.getId() == a.getCurrentPlaylist()
                    .getId() && h(e)
            })
        }
    }), cur.destroy.push(function() {
        this._autoList && this._autoList.destroy()
    }.bind(this))
}, AudioPage.prototype.destroy = function() {
    this._trackSlider.destroy(), this._volumeSlider.destroy(), removeEvent(window, "scroll", this._ev_onScroll)
}, AudioPage.prototype.getCurrentPlaylist = function() {
    var e = geByClass1("_audio_playlist", this._container);
    return data(e, "playlist")
}, AudioPage.prototype._initScroll = function() {
    if (this.isLayer()) {
        var e = geByClass1("audio_layer_menu_wrap", this._container),
            i = geByClass1("audio_layer_rows_wrap", this._container),
            t = geByClass1("audio_rows_header", this._container),
            a = i.scrollTop,
            o = 0,
            s = getSize(t),
            r = this;
        return setStyle(t, {
            width: s[0]
        }), void addEvent(i, "scroll", this._ev_onScroll = function(d) {
            getSize(e)[1], getSize(i)[1];
            if (cur.audioCancelMenuScroll) o = a = 0;
            else {
                var l = i.scrollTop - a;
                o -= l, o = Math.max(getSize(i)[1] - getSize(e)[1], o), o = Math.min(0, o)
            }
            setStyle(e, "top", o), a = i.scrollTop, delete cur.audioCancelMenuScroll;
            var n = geByClass1("_audio_padding_cont", r._container);
            i.scrollTop > 0 ? (setStyle(n, {
                "padding-top": s[1]
            }), addClass(t, "fixed")) : (setStyle(n, {
                "padding-top": null
            }), removeClass(t, "fixed"))
        })
    }
    var r = this,
        d = geByClass1("_audio_rows_header", this._container),
        l = getSize(d)[1],
        n = domPN(d),
        u = getSize(n)[0],
        _ = getSize(ge("page_header_cont"))[1];
    setStyle(d, {
        width: u,
        top: _
    });
    var h = getXY(n)[1];
    addEvent(window, "scroll resize", this._ev_onScroll = function(e) {
        scrollGetY() >= h - _ ? (addClass(d, "fixed"), setStyle(n, {
            "padding-top": l,
            "z-index": 2
        })) : (removeClass(d, "fixed"), setStyle(n, {
            "padding-top": null
        })), hasClass(d, "fixed") && setStyle(d, "left", getXY(n)[0] - scrollGetX())
    }), this.isLayer() || cur.destroy.push(function() {
        removeEvent(window, "scroll resize", r._ev_onScroll)
    })
}, AudioPage.prototype.subscribeToOwner = function(e, i, t) {
    ajax.post("al_audio.php", {
        act: "subscribe_to_owner",
        hash: t,
        owner_id: i
    }, {
        showProgress: lockButton.pbind(e),
        hideProgress: unlockButton.pbind(e),
        onDone: function(i) {
            val(e, i), addClass(e, "secondary"), addClass(e, "no_events")
        }
    })
}, AudioPage.prototype._normalizePlaylistId = function(e) {
    var i = (e.getAlbumId() + "")
        .replace(/^[a-z]*/, "");
    return e.getType() + "_" + e.getOwnerId() + "_" + parseInt(i)
}, AudioPage.prototype.switchToSection = function(e, i) {
    var t = geByClass1("_audio_playlist", this._container);
    toggleClass(t, "audio_recent_rows", e.getType() == AudioPlaylist.TYPE_RECENT), toggleClass(t, "audio_search_rows", e.getType() == AudioPlaylist.TYPE_SEARCH), toggleClass(t,
        "audio_popular_rows", e.getType() == AudioPlaylist.TYPE_POPULAR), toggleClass(t, "audio_current_rows", this.isLayer() && e == getAudioPlayer()
        .getCurrentPlaylist()), toggleClass(t, "audio_md_rows", !!this.options.md), e.load(), e.audioPageRef = this, data(t, "playlist", e), this._initAutoList(e, t,
        function(t) {
            if (t) {
                var a;
                if (this.isLayer() && e == getAudioPlayer()
                    .getCurrentPlaylist() || geByClass1("_ui_item_audio_" + e.getId(), this._getMenuEl()), !a) switch (e.getType()) {
                    case AudioPlaylist.TYPE_POPULAR:
                        a = geByClass1("_ui_item_audio_popular_" + this.options.oid, this._getMenuEl());
                        break;
                    case AudioPlaylist.TYPE_RECOM:
                        a = geByClass1("_ui_item_audio_recoms_" + this.options.oid, this._getMenuEl());
                        break;
                    case AudioPlaylist.TYPE_FEED:
                        a = geByClass1("_ui_item_audio_feed_" + this.options.oid, this._getMenuEl())
                }
                if (a && isVisible(a) ? (uiRightMenu.switchMenu(a), uiRightMenu.showProgress(a)) : this._hideMenuItemProgress(), !a && e.getType() == AudioPlaylist.TYPE_ALBUM &&
                    e.getOwnerId() != vk.id) {
                    var o = geByClass1("_audio_friend_" + e.getOwnerId(), this._container);
                    o && showProgress(o)
                }
                e.getType() == AudioPlaylist.TYPE_SEARCH && uiSearch.showProgress(this.searchInputEl)
            } else unlockButton(geByClass1("audio_more_friends_btn")), this._hideMenuItemProgress(), this._updateAdditionalBlocksAndRightMenu(e, i), this._updateEmptyPlaceholder(
                e), uiSearch.hideProgress(this.searchInputEl), this._initSorter(e)
        }.bind(this)), this.isLayer() && toggleClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty", !val(this.searchInputEl))
}, AudioPage.prototype._getForeignTogglerEl = function() {
    return geByClass1("_ui_toggler", geByClass1("_audio_foreign_filter_block", this._container))
}, AudioPage.prototype.toggleForeign = function() {
    var e = this._getForeignTogglerEl(),
        i = toggleClass(e, "on"),
        t = this.getCurrentPlaylist(),
        a = (t.getAlbumId() + "")
        .replace(/[a-z]*/, ""),
        o = this.ap.getPlaylist(AudioPlaylist.TYPE_POPULAR, vk.id, (i ? "foreign" : "") + a);
    this.switchToSection(o)
}, AudioPage.prototype._updateEmptyPlaceholder = function(e) {
    var i = geByClass1("_audio_empty_placeholder ", this._container);
    if (e.getAudiosCount()) hide(i);
    else {
        show(i);
        var t = "",
            a = e.getType();
        if (a == AudioPlaylist.TYPE_ALBUM) t = e.getOwnerId() == vk.id ? AudioPlayer.getLang("audio_no_rec_load_msg")
            .replace(/\{link\}/, '<a onclick="AudioPage(this).uploadAudio({}); return false">')
            .replace(/\{\/link\}/, "</a>") : AudioPlayer.getLang("audio_album_no_recs");
        else if (a == AudioPlaylist.TYPE_SEARCH) t = AudioPlayer.getLang("audio_no_audios_found")
            .replace("{query}", clean(e.getSearchParams()
                .q));
        else if (a == AudioPlaylist.TYPE_RECENT) t = AudioPlayer.getLang("audio_no_listened_info");
        else if (a == AudioPlaylist.TYPE_RECOM) {
            var o = e.getAlbumId();
            t = isNumeric(o) || 0 == o.indexOf("album") ? AudioPlayer.getLang("audio_no_recs_found") : AudioPlayer.getLang("audio_no_audio_recs_found")
        } else t = AudioPlayer.getLang("audio_album_no_recs");
        val(i, t)
    }
}, AudioPage.prototype._updateAdditionalBlocksAndRightMenu = function(e, i) {
    var t = this,
        a = getAudioPlayer(),
        o = this._getMenuEl(),
        s = null,
        r = e == this.ap.getCurrentPlaylist();
    if (r) s = geByClass1("_ui_item_audio_current", o);
    else switch (e.getType()) {
        case AudioPlaylist.TYPE_RECOM:
            s = geByClass1("_ui_item_audio_recoms_" + e.getOwnerId(), o);
            break;
        case AudioPlaylist.TYPE_FEED:
            s = geByClass1("_ui_item_audio_feed_" + vk.id, o);
            break;
        case AudioPlaylist.TYPE_ALBUM:
            s = geByClass1("_ui_item_audio_" + e.getId(), o);
            break;
        case AudioPlaylist.TYPE_POPULAR:
            var d = this._normalizePlaylistId(e);
            s = geByClass1("_ui_item_audio_" + d, o);
            break;
        case AudioPlaylist.TYPE_RECENT:
            var d = this._normalizePlaylistId(e);
            s = geByClass1("_ui_item_audio_recent_" + e.getOwnerId(), o)
    }
    s ? (this._unselectFriends(), removeClass(s, "unshown"), uiRightMenu.switchMenu(s)) : uiRightMenu.unselectAll(this._getMenuEl());
    var l = e.getBlocks(),
        n = "_ui_item_audio_" + AudioPlaylist.TYPE_POPULAR + "_" + this.options.oid + "_0",
        u = geByClass1(n, this._getMenuEl()),
        _ = geByClass1("_ui_item_audio_popular_" + this.options.oid, this._getMenuEl());
    if (l.submenu && !u) {
        var h = se(l.submenu);
        domInsertAfter(h.children[1], _), domInsertAfter(h.children[0], _), u = geByClass1(n, this._getMenuEl()), setTimeout(uiRightMenu.switchMenu.pbind(u))
    }
    var c = geByClass1("_ui_item_audio_genres", this._getMenuEl()),
        g = isVisible(_);
    if (e.getType() == AudioPlaylist.TYPE_POPULAR) {
        show(c), show(domNS(c)), hide(_);
        var p = geByClass1("_ui_rmenu_audio_albums_toggle", this._getMenuEl());
        hasClass(p, "ui_rmenu_item_expanded") && uiRightMenu.toggleSubmenu("audio_albums", this), g && u && !r && setTimeout(uiRightMenu.switchMenu.pbind(u, !0))
    } else hide(c), hide(domNS(c)), show(_), g || uiRightMenu.hideSliding(this._getMenuEl());
    var y = geByClass1("_audio_foreign_filter_block", this._container);
    toggle(y, e.getType() == AudioPlaylist.TYPE_POPULAR), each(geByClass("_audio_additional_block", this._container), hide), each(geByClass("_audio_additional_blocks_wrap",
        this._container), hide), this._blocks = this._blocks || {}, e.getType() == AudioPlaylist.TYPE_SEARCH && l.search && (this._blocks[e.getId()] = l.search), each(l,
        function(e, i) {
            t._blocks[e] = t._blocks[e] || i
        }), a.friendBlock && (this._blocks.friends = this._blocks.friends || a.friendBlock.friends);
    var A = [];
    switch (e.getType()) {
        case AudioPlaylist.TYPE_ALBUM:
        case AudioPlaylist.TYPE_TEMP:
        case AudioPlaylist.TYPE_FEED:
            var P = e.getOwnerId();
            e.getType() == AudioPlaylist.TYPE_ALBUM && e.isPopBand() ? A.push("pop_band_" + P) : 0 > P ? A.push(this._prevSearchPlaylistId) : A.push("friends"), 0 > P && cur.prevSearchPlaylist &&
                A.push(cur.prevSearchPlaylist.getId());
            break;
        case AudioPlaylist.TYPE_RECOM:
            A.push("recoms");
            break;
        case AudioPlaylist.TYPE_POPULAR:
        case AudioPlaylist.TYPE_SEARCH:
            A.push(e.getId())
    }
    e == getAudioPlayer()
        .getCurrentPlaylist() && A.push("friends"), each(A, function(e, i) {
            if (i) {
                var a = "right";
                0 == i.indexOf("popular_") && (a = "top");
                var o = geByClass1("_audio_additional_blocks_wrap_" + a, t._container),
                    s = geByClass1("_audio_additional_block_" + i, t._container);
                !s && t._blocks[i] && (s = se(rs(t.options.additionalBlockSectionTpl, {
                    block_id: i
                })), val(s, t._blocks[i]), o.appendChild(s)), show(s), show(o)
            }
        }), uiSearch.init("audio_friends_search"), this._updateLayerRowsBottomPadding()
}, AudioPage.prototype.onSubmenuToggle = function() {
    this._updateLayerRowsBottomPadding()
}, AudioPage.prototype._updateLayerBottom = function() {}, AudioPage.prototype._hideMenuItemProgress = function() {
    uiRightMenu.hideProgress(this._getMenuEl()), hideProgress(geByClass1("audio_friends_list", this._container)), each(geByClass("audio_owners_wrap", this._container),
        function() {
            hideProgress(this)
        })
}, AudioPage.prototype._getMenuEl = function() {
    return geByClass1("ui_rmenu", this._container)
}, AudioPage.prototype._hideMenuSelectedItem = function() {
    removeClass(geByClass1("ui_rmenu", this._container), "ui_rmenu_item_sel")
}, AudioPage.prototype._unselectFriends = function() {
    hideProgress(geByClass1("_audio_friends_list", this._container)), each(geByClass("_audio_friend", this._container), function() {
        removeClass(this, "audio_friend_selected")
    }), unlockButton(geByClass1("audio_more_friends_btn"))
}, AudioPage.prototype._deleteDeletedAudios = function() {
    each(cur._audioAddRestoreInfo || {}, function(e, i) {
        ("deleted" == i.state || "recom_hidden" == i.state) && getAudioPlayer()
            .deleteAudioFromAllPlaylists(e)
    })
}, AudioPage.prototype._initNavigation = function() {
    this._prevLoc = !1;
    var e = !1,
        i = !1;
    this._prevSearchPlaylistId = null, cur.nav.push(this._nav_func = function(t, a, o, s) {
        if (this._deleteDeletedAudios(), s.searchPerformer && (o = extend({}, this._prevLoc, o)), this.isLayer()) {
            if (this._prevLoc !== !1) {
                a = clone(this._prevLoc), t = clone(o);
                for (var r in a) a[r] && void 0 === o[r] ? t[r] = !1 : a[r] == o[r] && delete t[r];
                (this._prevLoc.friend && t.friend === !1 || this._prevLoc.band && t.band === !1) && t.q && (o.friend = this._prevLoc.friend, o.band = this._prevLoc.band,
                    delete t.friend, delete t.band)
            }
            i === !1 && (i = a[0]), 0 != o[0].indexOf("audio") && i == o[0] && delete t[0]
        }
        var d = void 0 !== t[0],
            l = t.q === !1;
        if (d && !t.q) {
            var n = this.options.oid;
            if (n != vk.id && !inArray(t[0], ["audios" + n]) || n == vk.id && !inArray(t[0], ["audios" + n, "audio"])) return !0
        }
        if (this.isLayer() && (s.hist || s.back || t[0] && 0 != t[0].indexOf("audio"))) return this.options.eltt.hide(), !0;
        if (!(0 != Object.keys(t)
                .length || s.fromSearch || s.fromMenu || s.friendEl || s.forceUpdate)) return !1;
        l && e && s.fromSearch && (o = e);
        var u;
        if (this._unselectFriends(), o.q) {
            if (!s.fromSearch) {
                var _ = trim(val(this.searchInputEl));
                _ != o.q && val(this.searchInputEl, replaceEntities(o.q))
            }
            s.fromSearch && !s.filtersChanged || s.globalQuery || (s.globalQuery = o.q);
            var h = {
                    q: o.q,
                    globalQuery: s.globalQuery,
                    fromHistory: s.fromHistory
                },
                c = replaceEntities(o.q) + replaceEntities(s.globalQuery);
            each(["performer", "lyrics", "sort"], function(e, i) {
                h[i] = intval(o[i]), c += h[i]
            });
            var g = o.friend || o.band || this.options.oid;
            u = this.ap.getPlaylist(AudioPlaylist.TYPE_SEARCH, g, hashCode(c)), u.mergeWith({
                searchParams: h
            }), removeClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty"), e || a.q || (e = clone(a)), delete o.section
        } else if (o.section == AudioPlaylist.TYPE_POPULAR) {
            var p = hasClass(this._getForeignTogglerEl(), "on") ? "foreign" : "";
            u = this.ap.getPlaylist(AudioPlaylist.TYPE_POPULAR, vk.id, p + intval(o.genre))
        } else if (o.friend) {
            var y = intval(o.friend),
                A = geByClass1("_audio_friend_" + y, this._container);
            addClass(A, "audio_friend_selected"), u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, y, AudioPlaylist.ALBUM_ALL), geByClass1("_audio_friend_" + y) ||
                this.showMoreFriends(!1, y), u._friend = y, a.q && 0 > y && !cur.prevSearchPlaylist && (cur.prevSearchPlaylist = this.getCurrentPlaylist())
        } else if (o.section == AudioPlaylist.TYPE_RECOM) {
            var P = AudioPlaylist.ALBUM_ALL;
            o.audio_id ? P = "audio" + o.audio_id : o.album_id && (P = "album" + o.album_id), u = this.ap.getPlaylist(AudioPlaylist.TYPE_RECOM, this.options.oid, P)
        } else o.section == AudioPlaylist.TYPE_FEED ? u = this.ap.getPlaylist(AudioPlaylist.TYPE_FEED, vk.id, 0) : o.section == AudioPlaylist.TYPE_CURRENT ? u = this.ap
            .getCurrentPlaylist() : o.section == AudioPlaylist.TYPE_RECENT ? u = this.ap.getPlaylist(AudioPlaylist.TYPE_RECENT, vk.id) : o.band ? (u = this.ap.getPlaylist(
                AudioPlaylist.TYPE_ALBUM, intval(o.band), AudioPlaylist.ALBUM_ALL), u.mergeWith({
                band: 1
            })) : o.album_id ? u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, o.album_id) : (u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM,
                this.options.oid, AudioPlaylist.ALBUM_ALL), addClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty"));
        return o.section != AudioPlaylist.TYPE_RECOM && (delete o.audio_id, o.section && delete o.album_id), l && (e = !1, val(this.searchInputEl, "", !0), this._muteFilterEvent = !
                0, uiSearch.removeAllFilters(this.searchInputEl), delete o.performer, delete o.lyrics, delete o.sort, this._muteFilterEvent = !1), o.friend || delete cur
            .prevSearchPlaylist, this.isLayer() || nav.setLoc(o), this._prevLoc = o, this.syncParametersUI(o), this.switchToSection(u, !0), !1
    }.bind(this))
}, AudioPage.prototype.deleteCurrentPlaylist = function(e) {
    this.ap.deleteCurrentPlaylist(), uiRightMenu.hideSliding(this._getMenuEl()), addClass(geByClass1("_ui_item_audio_current", this._getMenuEl()), "unshown");
    var i = this._myPlaylist ? this.ap.getPlaylist(this._myPlaylist) : this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, vk.id, AudioPlaylist.ALBUM_ALL);
    this.switchToSection(i);
    var t = i.getAudiosList()[0];
    t && (this._readyAudio = t, this._initPlayer(!0), cur.audioPage && (cur.audioPage._readyAudio = t, cur.audioPage._initPlayer(!0))), window.tooltips && tooltips.hideAll(),
        this.ap.updateCurrentPlaying(), cancelEvent(e)
}, AudioPage.prototype.setTooltipTitle = function(e) {
    if (!e.titleSet) {
        var i = geByClass1("audio_page_player_title_performer", e),
            t = geByClass1("audio_page_player_title_song", e);
        (i.scrollWidth > i.clientWidth || t.scrollWidth > t.clientWidth) && e.setAttribute("title", e.innerText), e.titleSet = !0
    }
}, AudioPage.prototype._initPlayer = function(e) {
    function i(e) {
        s.isAdPlaying() ? (n.innerHTML = getLang("global_audio_ad"), u.innerHTML = "") : (e = AudioUtils.asObject(e), n.innerHTML = e.performer, u.innerHTML =
            "&nbsp;&ndash;&nbsp;" + e.title, !o.isLayer() && s.getCurrentAudio() && AudioUtils.asObject(s.getCurrentAudio())
            .fullId == e.fullId && (document.title = replaceEntities(stripHTML(e.performer + " - " + e.title)), clearTimeout(window.pageSetTitleTimer)))
    }

    function t(e, i) {
        i = intval(i);
        var t, a = s.getDurationType();
        return t = a && 1 != e ? "-" + formatTime(Math.round(i - e * i)) : formatTime(Math.round(e * i))
    }

    function a() {
        if (o._trackSlider) {
            var e = AudioUtils.asObject(o._readyAudio || s.getCurrentAudio()),
                i = e.ownerId != o.options.oid;
            y !== i && (toggle(p, i), y = i), cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {};
            var t = cur._audioAddRestoreInfo[e.fullId];
            addClass(p, "no_transition"), toggleClass(p, "audio_player_btn_added", !(!t || "added" != t.state)), removeClassDelayed(p, "no_transition"), toggleClass(g,
                "audio_page_player_btn_enabled", o.ap.isRepeatCurrentAudio())
        }
    }
    var o = this,
        s = getAudioPlayer(),
        r = this._container,
        d = geByClass1("_audio_page_player", r),
        l = geByClass1("audio_page_player_title", d),
        n = geByClass1("audio_page_player_title_performer", d),
        u = geByClass1("audio_page_player_title_song", d),
        _ = geByClass1("audio_page_player_duration", d),
        h = geByClass1("_audio_page_player_play", d),
        c = geByClass1("_play_blind_label", h),
        g = geByClass1("_audio_page_player_repeat", d),
        p = geByClass1("_audio_page_player_add", d),
        y = void 0;
    if (!this._trackSlider) {
        var A = s.isAdPlaying() ? s.adsGetCurrentProgress() : s.getCurrentProgress(),
            P = s.isAdPlaying() ? 0 : s.getCurrentBuffered();
        this._trackSlider = new Slider(geByClass1("audio_page_player_track_slider", d), {
            value: A,
            backValue: P,
            size: 1,
            hintClass: "audio_player_hint",
            withBackLine: !0,
            formatHint: function(e) {
                var i = s.getCurrentAudio() || o._readyAudio;
                return i = AudioUtils.asObject(i), formatTime(Math.round(e * i.duration))
            },
            onEndDragging: function(e) {
                s.seek(e)
            }
        }), s.isAdPlaying() && this._trackSlider.toggleAdState(!0), this._volumeSlider = new Slider(geByClass1("audio_page_player_volume_slider", d), {
            value: s.getVolume(),
            size: 1,
            hintClass: "audio_player_hint",
            log: !0,
            formatHint: function(e) {
                return Math.round(100 * e) + "%"
            },
            onChange: function(e) {
                s.setVolume(e)
            }
        }), this.ap.on(this, AudioPlayer.EVENT_AD_DEINITED, function() {
            this._trackSlider.toggleAdMarker(!1)
        }.bind(this)), this.ap.on(this, AudioPlayer.EVENT_AD_READY, function() {
            this._trackSlider.toggleAdMarker(!0)
        }.bind(this)), this.ap.on(this, AudioPlayer.EVENT_AD_STARTED, function() {
            this._trackSlider.toggleAdMarker(!1), this._trackSlider.toggleAdState(!0), this._trackSlider.setBackValue(0)
        }.bind(this)), this.ap.on(this, AudioPlayer.EVENT_AD_COMPLETED, function() {
            this._trackSlider.toggleAdMarker(!1), this._trackSlider.toggleAdState(!1)
        }.bind(this)), this.ap.on(this, AudioPlayer.EVENT_START_LOADING, function() {
            o._trackSlider.toggleLoading(!0)
        }), this.ap.on(this, AudioPlayer.EVENT_CAN_PLAY, function() {
            o._trackSlider.toggleLoading(!1)
        }), this.ap.on(this, AudioPlayer.EVENT_ADDED, function(e, i) {
            e = AudioUtils.asObject(e), e && e.fullId == i && addClass(p, "audio_player_btn_added")
        }), this.ap.on(this, AudioPlayer.EVENT_REMOVED, function(e, i) {
            e = AudioUtils.asObject(e), e && e.fullId == i && removeClass(p, "audio_player_btn_added")
        }), this.ap.on(this, AudioPlayer.EVENT_PLAY, function(e, s, r) {
            delete o._readyAudio, data(d, "audio", e), a(), i(e), addClass(h, "audio_playing"), s && !cur.audioStartReadyAudio && (o._trackSlider.setBackValue(0), _.innerHTML =
                t(0, AudioUtils.asObject(e)
                    .duration), l.setAttribute("title", ""), l.titleSet = !1), c.innerHTML = getLang("global_audio_pause")
        }), this.ap.on(this, AudioPlayer.EVENT_PAUSE, function(e) {
            removeClass(h, "audio_playing"), c.innerHTML = getLang("global_audio_play")
        }), this.ap.on(this, AudioPlayer.EVENT_BUFFERED, function(e, i) {
            o._trackSlider.setBackValue(i)
        }), this.ap.on(this, AudioPlayer.EVENT_VOLUME, function(e, i) {
            o._volumeSlider.setValue(i)
        }), this.ap.on(this, AudioPlayer.EVENT_ENDED, function() {
            o._trackSlider.toggleLoading(!1)
        }), this.ap.on(this, AudioPlayer.EVENT_UPDATE, function(e, a) {
            e && i(e), this.ap.isAdPlaying() || e && a && (_.innerHTML = t(a, AudioUtils.asObject(e)
                .duration))
        }.bind(this)), this.ap.on(this, AudioPlayer.EVENT_PROGRESS, function(e, i, a) {
            o._trackSlider.setValue(i), void 0 !== a && (_.innerHTML = t(i, a))
        })
    }
    var f = this.ap.getCurrentAudio() || this._readyAudio;
    f && (domData(d, "audio", JSON.stringify(f)), i(f), toggleClass(h, "audio_playing", this.ap.isPlaying()), _.innerHTML = t(1, AudioUtils.asObject(f)
        .duration), e && (this._trackSlider.setValue(0), this._trackSlider.setBackValue(0), this._trackSlider.toggleLoading(!1))), a()
}, AudioPage.prototype.scrollToTrack = function(e) {
    var i = this,
        t = this.getCurrentPlaylist(),
        a = this.ap.getCurrentAudio();
    if ((!this.isLayer() || this.getLayer()
            .isShown()) && t && -1 != t.indexOfAudio(a)) {
        this.ap.updateCurrentPlaying();
        var o = geByClass1(AudioUtils.AUDIO_PLAYING_CLS, this._container);
        if (!o) {
            a = AudioUtils.asObject(a);
            for (var s = 100; s-- && (this._autoList.drawMore(), o = geByClass1("_audio_row_" + a.fullId, this._container), !(o || this._autoList.isPendingRows() || this._autoList
                    .isDone())););
        }
        if (o) {
            setTimeout(function() {
                i.ap.updateCurrentPlaying()
            }, 1);
            var r = this.isLayer() ? geByClass1("audio_layer_rows_wrap", this._container) : bodyNode,
                d = this.isLayer() ? r.scrollTop : 0,
                l = this.isLayer() ? getSize(r)[1] : clientHeight(),
                n = this.isLayer() ? getXY(r)[1] : 0,
                u = getXY(o)[1] - n + d,
                _ = getSize(o)[1],
                h = this.isLayer() ? r.scrollTop : scrollGetY();
            if (e || !(h > u || u > h + l)) {
                var c = u - l / 2 + _ / 2;
                i.isLayer() ? (cur.audioCancelMenuScroll = !0, r.scrollTop = c, setTimeout(function() {
                    cur.audioCancelMenuScroll = !0, r.scrollTop = c, i.getLayer()
                        .sb.update(), delete cur.audioCancelMenuScroll
                })) : scrollToY(c, 400)
            }
        }
    }
}, AudioPage.prototype.togglePlayerPlay = function(e) {
    var i = getAudioPlayer();
    if (i.isPlaying()) i.pause();
    else {
        var t = this.getCurrentPlaylist(),
            a = i.getCurrentPlaylist(),
            o = i.getCurrentAudio(),
            s = this._readyAudio ? this._readyAudio : o;
        if (s = s ? s : t.getAudioAt(0), AudioUtils.isClaimedAudio(s)) {
            s = AudioUtils.asObject(s);
            var r = AudioUtils.getAudioExtra(s),
                d = r.claim;
            return void showAudioClaimWarning(s.ownerId, s.id, d.deleteHash, d.id, s.title)
        }
        var l; - 1 != t.indexOfAudio(s) ? l = t : a && -1 != a.indexOfAudio(s) ? l = a : (l = new AudioPlaylist(AudioPlaylist.TYPE_TEMP, vk.id), l.addAudio(s)), delete this._readyAudio,
            cur.audioStartReadyAudio = !0, i.play(s, l)
    }
};
try {
    stManager.done("audio.js")
} catch (e) {}
