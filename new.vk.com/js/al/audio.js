function AudioPage(e, i, t, o) {
    function a() {
        r.isLayer() || (nav.curLoc && nav.setLoc(nav.fromStr(nav.curLoc)), nav.objLoc.q && r.onSearchFiltersChanged(nav.objLoc))
    }
    if (!(this instanceof AudioPage)) {
        var s = gpeByClass("_audio_layout", e);
        return s ? data(s, "audioPage") : !1
    }
    AudioUtils.toggleAudioHQBodyClass(), addTemplates({
            audio_row: t.audioRowTpl
        }), this.options = t, this._container = ge(e), this._onSilentLoaded = {}, this._restores = {}, this._added = {}, this._readyAudio = o, cur.canAudioAddToGroup = this.options
        .canAudioAddToGroup, this.ap = getAudioPlayer(), ap.langs = t.langs, extend(cur.lang || {}, t.langs), this.ap.getCurrentAudio() && delete this._readyAudio, i.type ? (i =
            new AudioPlaylist(i), i.loadSilent()) : (ap.friendBlock = i.blocks, i = this.ap.getCurrentPlaylist(), i.mergeWith({
            blocks: ap.friendBlock
        })), this._updateAdditionalBlocksAndRightMenu(i), this._initSearch(), this._initScroll(), this.ap.setStatusExportInfo(t.exp), this.onShow(i), data(e, "audioPage", this);
    var r = this;
    this.isLayer() || cur.destroy.push(function() {
        ap.off(r), delete r
    }), this.ap.on(this, AudioPlayer.EVENT_PLAY, function(e, i, t) {
        var o = this.getCurrentPlaylist(),
            a = !this.isLayer() && this.ap.layer && this.ap.layer.isShown();
        i && 0 != t && o.indexOfAudio(e) >= 0 && (a || this.scrollToTrack())
    }.bind(this)), a(), setTimeout(function() {
        r._initAlbumsSort()
    }, 100)
}
AudioPage.address = "audio", AudioPage.onSearchFocused = function(e) {
    var i = geByClass1("_audio_playlist", gpeByClass("_audio_layout", this));
    toggleClass(i, "audio_search_focused", "focus" == e.type)
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
    window.Notifier.addRecvClbk("audio_hq_label", "audio", function() {
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
                o = AudioUtils.hasAudioHQBodyClass();
            t.showHQLabel(!o), window.Notifier.lcSend("audio_hq_label"), delete cur.ctrlPressed
        }
    }), addEvent(window.document, "keydown", this._audioSeekKeyEventHandler = function(i) {
        var t = getAudioPlayer();
        if ((!i.target || !(inArray(i.target.tagName.toLowerCase(), ["input", "textarea"]) && "" != val(i.target) || hasClass(i.target, "fc_editable"))) && t.isPlaying() &&
            inArray(i.keyCode, [KEY.RIGHT, KEY.LEFT]) && !e()) {
            var o = AudioUtils.asObject(t.getCurrentAudio()),
                a = 10 / o.duration,
                s = t.getCurrentProgress() + (i.keyCode == KEY.RIGHT ? a : -a);
            s = Math.max(0, Math.min(1, s)), t.seek(s)
        }
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
    }), cur.onOListSave = function(i, t, o, a) {
        var s = curBox(),
            r = {
                act: "a_ignore_olist",
                hash: a.hash
            };
        return i.length < t.length ? r.White = i.join(",") : r.Black = t.join(","), ajax.post("al_audio.php", r, {
            onDone: function(i, t) {
                s.hide();
                var o = e.getCurrentPlaylist();
                o.clean(), e.refreshCurrentPage()
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
    var t, o, i = intval(i),
        a = this.ap.getStatusExportInfo() || {};
    if (i) a[i] ? (delete a[i], t = !1) : (a[i] = 1, t = !0);
    else if (this.ap.hasStatusExport()) {
        for (var s in a) delete a[s];
        t = !1
    } else i = vk.id, a[i] = 1, t = !0;
    this.ap.setStatusExportInfo(a);
    var r = vk.audioParams.addHash;
    if (r) {
        i != vk.id && i || checkbox("currinfo_audio", this.ap.hasStatusExport()), this.updateStatusExportControls();
        var n = this.ap.getCurrentAudio();
        n && (o = AudioUtils.asObject(n)
            .fullId);
        var d = (this.ap.getCurrentPlaylist(), null);
        ajax.post("al_audio.php", {
            act: "toggle_status",
            exp: intval(t),
            oid: i,
            hash: r,
            id: o,
            top: intval(d && (d.top_audio || d.top))
        })
    }
}, AudioPage.prototype.playStatusAudio = function(e, i, t) {
    var o = gpeByClass("_audio_friend", t);
    this.ap.playLive(e, {
        showProgress: showProgress.pbind(o),
        hideProgress: hideProgress.pbind(o)
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
                var o = e.id.split("_")
                    .pop(),
                    a = i ? i.id.split("_")
                    .pop() : 0;
                ajax.post("al_audio.php", {
                    act: "reorder_albums",
                    aid: o,
                    before: a,
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
        o = showFastBox({
            title: AudioPlayer.getLang("audio_delete_album_title"),
            dark: 1
        }, AudioPlayer.getLang("audio_delete_album_are_you_sure"), AudioPlayer.getLang("audio_delete_album_button"), function(a) {
            ajax.post("al_audio.php", {
                act: "delete_album",
                album_id: e,
                hash: i,
                gid: 0 > t ? -t : !1
            }, {
                showProgress: lockButton.pbind(a),
                hideProgress: unlockButton.pbind(a),
                onDone: function(i, o) {
                    try {
                        boxQueue.hideAll(), re(geByClass1("_ui_item_audio_album_" + t + "_" + e)), nav.go("/audios" + t)
                    } catch (a) {}
                },
                onFail: function() {
                    o.hide(200)
                }
            })
        }, getLang("global_cancel"))
}, AudioPage.saveAlbum = function(e, i, t) {
    var o = val("album_name");
    if (!o) return notaBene("album_name"), !1;
    var a = curBox(),
        s = cur.audioPage.options.oid,
        r = !t,
        n = {
            act: "save_album",
            album_id: t,
            name: o,
            gid: 0 > s ? -s : 0,
            Audios: e.join(","),
            hash: cur.audioPage.options.saveAlbumHash
        };
    return ajax.post("al_audio.php", n, {
        showProgress: lockButton.pbind(i),
        hideProgress: unlockButton.pbind(i),
        onFail: a.hide,
        onDone: function(i, t, o, a) {
            var n = getAudioPlayer(),
                d = n.getPlaylist(AudioPlaylist.TYPE_ALBUM, s, i);
            if (d.clean(), d.mergeWith({
                    list: a,
                    hasMore: !1
                }), n.deletePlaylist(n.getPlaylist(AudioPlaylist.TYPE_RECOM, s, "album" + i)), each(e, function(e, i) {
                    var t = {};
                    t[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] = i, n.updateAudio(s + "_" + i, t)
                }), each(n.getPlaylists(), function(e, i) {
                    i.getType() == AudioPlaylist.TYPE_ALBUM && i.getOwnerId() == s && i.clean()
                }), r) {
                var l = geByClass1("ui_rmenu", cur.audioPage._container),
                    u = domPN(l);
                u.replaceChild(se(o), l), cur.audioPage._initAlbumsSort()
            }
            curBox()
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
    for (var t = e.length, o = [], a = 0; t > a; a++) {
        var s = e[a];
        i == s[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] && o.push(s)
    }
    return o
}, AudioPage.showActionTooltip = function(e, i) {
    showTooltip(e, {
        text: i,
        black: 1,
        shift: [8, 5, 0],
        appendParentCls: "_audio_page_player"
    })
}, AudioPage.prototype.createAlbum = function(e) {
    return this.editAlbum(0)
}, AudioPage.prototype.editAlbum = function(e, i, t) {
    var o = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, AudioUtils.AUDIO_ALBUM_ID_ALL),
        a = this,
        s = i ? gpeByClass("_audio_album_btns", i) : null;
    s && (addClass(s, "in_progress"), showProgress(s)), o.loadSilent(function(i) {
        s && (removeClass(s, "in_progress"), hideProgress(s));
        showTabbedBox("al_audio.php", {
            act: "edit_album_box",
            album_id: e || 0,
            oid: a.options.oid
        }, {
            stat: ["privacy.js", "privacy.css", "ui_controls.js", "ui_controls.css", "indexer.js"],
            dark: 1
        })
    }), cancelEvent(t)
}, AudioPage.prototype.onHide = function() {
    var e = this;
    cur.nav = cur.nav.filter(function(i) {
        return e._nav_func != i
    }), this._deinitKeyEvents()
}, AudioPage.prototype.showRecoms = function(e, i, t) {
    if (!i) {
        var o = this.readyAudio ? this.readyAudio : this.ap.getCurrentAudio();
        i = AudioUtils.asObject(o)
            .fullId
    }
    return nav.go({
        0: nav.objLoc[0],
        section: "recoms",
        audio_id: i
    }), cancelEvent(t)
}, AudioPage.prototype.showAlbumRecoms = function(e, i, t, o) {
    return nav.go({
        0: nav.objLoc[0],
        section: "recoms",
        album_id: o
    }), cancelEvent(i)
}, AudioPage.prototype.onShow = function(e) {
    this._initNavigation(), val(this.searchInputEl, ""), uiSearch.removeAllFilters(this.searchInputEl), setTimeout(elfocus.pbind(this.searchInputEl), 10), e = e || this.ap.getCurrentPlaylist() ||
        this.getCurrentPlaylist(), this.switchToSection(e), this._initPlayer(), this._initKeyEvents(), this.updateStatusExportControls(), this.isLayer() && (setTimeout(
            function() {
                var e = geByClass1("_audio_rows_header", this._container);
                setStyle(e, "width", getSize(geByClass1("_audio_rows", this._container))[0] - 1), this.getLayer()
                    .sb.widthUpdated()
            }.bind(this)), this.scrollToTrack())
}, AudioPage.prototype.onAudioUploaded = function(e, i) {
    if (i) {
        var t = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, AudioUtils.AUDIO_ALBUM_ID_ALL);
        t.addAudio(i, 0);
        var o = this.ap.getCurrentPlaylist();
        o && o.getSelf() == t && o.addAudio(i);
        var a = this.getCurrentPlaylist();
        a == t && this.switchToSection(a)
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
}, AudioPage.prototype.showActionTooltip = function(e, i, t) {
    if (!this._addRestoreInProgress) {
        switch (t) {
            case "delete":
                var o = this._restores[i];
                t = o && o.deleteAll ? o.deleteAll.text : AudioPlayer.getLang("audio_delete_audio");
                break;
            case "add":
                var o = this._restores[i];
                t = o ? AudioPlayer.getLang("audio_restore_audio") : this.options.oid < 0 && this.options.canAddToGroup ? AudioPlayer.getLang("audio_add_to_group") :
                    AudioPlayer.getLang("audio_add_to_audio");
                break;
            case "edit":
                t = AudioPlayer.getLang("audio_edit_audio")
        }
        showTooltip(e, {
            text: function() {
                return t
            },
            black: 1,
            shift: [15, 10, 0]
        })
    }
}, AudioPage.prototype.hideRecommendation = function(e) {
    var i = AudioUtils.getAudioFromEl(e, !0),
        t = AudioUtils.asObject(this.ap.getCurrentAudio());
    t && t.fullId == i.fullId && this.ap.playNext();
    var o = AudioUtils.getAudioExtra(i)
        .recom,
        a = {
            act: "hide_recommendation",
            q: o.q,
            hash: o.hash
        };
    nav.objLoc.audio_id && (a.recommendation_type = "query"), nav.objLoc.album_id && (a.recommendation_type = "album"), ajax.post("al_audio.php", a), cur._audioAddRestoreInfo[
        i.fullId] = {
        state: "recom_hidden"
    }
}, AudioPage.prototype.restoreRecommendation = function(e) {
    var i = AudioUtils.getAudioFromEl(e, !0),
        t = AudioUtils.getAudioExtra(i)
        .recom,
        o = {
            act: "restore_recommendation",
            q: t.q,
            hash: t.hash,
            aid: i.fullId
        };
    nav.objLoc.audio_id && (o.recommendation_type = "query"), nav.objLoc.album_id && (o.recommendation_type = "album"), ajax.post("al_audio.php", o), removeClass(e,
        "audio_deleted"), delete cur._audioAddRestoreInfo[i.fullId]
}, AudioPage.prototype.deleteAudio = function(e, i, t) {
    function o() {
        return intval(domData(s, "in-progress"))
    }

    function a(e) {
        return domData(s, "in-progress", intval(e))
    }
    var s = gpeByClass("_audio_row", e);
    if (!o()) {
        a(!0), window.tooltips && tooltips.hideAll();
        var r = AudioUtils.getAudioFromEl(s, !0),
            n = vk.audioParams.deleteHash;
        return cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {}, AudioUtils.isRecomAudio(r) ? (addClass(s, "audio_deleted"), this.hideRecommendation(s), a(!1),
            cancelEvent(t)) : (addClass(s, "audio_deleted"), addClass(s, "canadd"), removeClass(s, "canedit"), ajax.post("al_audio.php", {
            act: "delete_audio",
            oid: r.ownerId,
            aid: r.id,
            hash: n,
            restore: 1
        }, {
            onDone: function(e, i) {
                a(!1), cur._audioAddRestoreInfo[r.fullId] = {
                    state: "deleted",
                    deleteAll: e,
                    deleteConfirmMsg: i
                }
            }
        }), cancelEvent(t))
    }
}, AudioPage.prototype.toggleAudioDurationType = function() {
    this.ap.toggleDurationType()
}, AudioPage.prototype._updateShuffleButton = function(e) {
    toggleClass(geByClass1("_audio_shuffle_btn", this._container), "audio_page_player_btn_enabled", !!e.shuffle)
}, AudioPage.prototype.toggleRepeat = function(e) {
    var i = toggleClass(e, "audio_page_player_btn_enabled");
    this.ap.toggleRepeatCurrentAudio(i)
}, AudioPage.prototype.toggleShuffle = function(e) {
    var i = this.getCurrentPlaylist();
    i.isShuffled() ? (removeClass(e, "audio_page_player_btn_enabled"), i.shuffle(0)) : (addClass(e, "audio_page_player_btn_enabled"), i.shuffle(irand(1, 999999))), this.switchToSection(
        i)
}, AudioPage.onFilterRemoved = function(e, i) {
    var t = AudioPage(i);
    switch (e) {
        case "performer":
            var o = "audio_search_type_" + intval(t.isLayer()),
                a = window.radioBtns[o];
            radiobtn(a.els[0], 0, o);
            break;
        case "sort":
            var s = t._searchSortFilter.options.defaultItems[0][0];
            t._searchSortFilter.selectItem(s, !1);
            break;
        case "lyrics":
            removeClass(geByClass1("_audio_fltr_with_lyrics", t._container), "on")
    }
    t.onSearchFiltersChanged()
}, AudioPage.prototype.syncFilters = function(e) {
    var i = "audio_search_type_" + intval(this.isLayer()),
        t = window.radioBtns[i];
    t && radiobtn(t.els[e.performer ? 1 : 0], !!e.performer, i);
    var o = e.sort;
    o || (o = this._searchSortFilter.options.defaultItems[0][0]), toggleClass(geByClass1("_audio_fltr_with_lyrics", this._container), "on", !!e.lyrics);
    var a = {
        performer: AudioPlayer.getLang("audio_performers_only"),
        lyrics: AudioPlayer.getLang("audio_search_with_text"),
        sort: AudioPlayer.getLang("audio_search_by_length")
    };
    this._muteFilterEvent = !0;
    var s = this;
    each(["performer", "lyrics", "sort"], function(i, t) {
        uiSearch.toggleFilter(s.searchInputEl, t, a[t], !!e[t])
    }), this._muteFilterEvent = !1
}, AudioPage.prototype.onSearchFiltersChanged = function(e) {
    if (!this._muteFilterEvent) {
        var i = window.radioBtns["audio_search_type_" + intval(this.isLayer())],
            t = intval(this._searchSortFilter.selectedItems()[0][0]),
            o = {
                performer: i.val ? 1 : null,
                lyrics: hasClass(geByClass1("_audio_fltr_with_lyrics", this._container), "on") ? 1 : null,
                sort: t ? 1 : null
            },
            a = e && isObject(e) ? e : o;
        this.isLayer() && (a = extend({}, this._prevLoc, a)), nav.change(a, !1, {
            fromSearch: !0,
            filtersChanged: !0
        })
    }
}, AudioPage.prototype._initSearch = function() {
    var e = geByClass1("_audio_search_input", this._container);
    this.searchInputEl = geByClass1("_field", e), uiSearch.init(e), window.radioBtns["audio_search_type_" + intval(this.isLayer())] = {
        els: geByClass("_audio_search_type", this._container),
        keep: !0
    }, this._searchSortFilter = new Dropdown(geByClass1("_audio_fltr_sort", this._container), this.options.sortFilters, {
        big: 1,
        zeroPlaceholder: !0,
        onChange: this.onSearchFiltersChanged.bind(this)
    });
    var i = this;
    new Suggester(this.searchInputEl, {
            section: "audio",
            sidePadding: "47px",
            onSelect: function(e) {
                val(i.searchInputEl, e[3])
            },
            onChoose: function(e) {
                val(i.searchInputEl, e[3]), i.searchAudios(e[3])
            }
        }), this.toggleSearchProgress = debounce(this.toggleSearchProgress, 100)
        .bind(this)
}, AudioPage.searchAudios = function(e) {
    AudioPage(this)
        .searchAudios(e)
}, AudioPage.prototype.searchAudios = function(e) {
    e = trim(e), nav.change(extend({
        q: e ? e : !1
    }), !1, {
        fromSearch: !0,
        q: e
    })
}, AudioPage.searchMoreFriends = function(e) {
    AudioPage(this)
        .searchMoreFriends(e)
}, AudioPage.prototype._updateFriendsList = function(e, i, t) {
    if (e = trim(e), this._friendSearchInProgress = !1, e) {
        var o = geByClass1("_audio_friends_list", this._container),
            a = (getSize(o)[1], se('<div class="audio_friends_list _audio_friends_list" style="opacity: 0; position: absolute; top: 0;">' + e + "</div>"));
        t && (this._shownFriends = []), domPN(o)
            .appendChild(a), setTimeout(function() {
                setStyle(a, {
                    opacity: 1
                })
            }), setTimeout(function() {
                re(o), setStyle(a, {
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
        o = domData(t, "genre");
    each(geByClass("_audio_catalog_performer", t), function() {
        i.push(domData(this, "performer-id"))
    }), ajax.post("al_audio.php", {
        act: "get_more_performers",
        offset: 4,
        exclude: i.join(","),
        genre: o
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
                    this.sb = new Scrollbar(geByClass1("audio_status_wrap", e), {
                        top: 0,
                        global: !0,
                        nokeys: !0
                    })
                }
            }), cur._onStatusExportBtn && this.statusTT.show()
        }.bind(this)
    }))
}, AudioPage.prototype.isLayer = function() {
    return !!this.getLayer()
}, AudioPage.prototype.getLayer = function() {
    return this.options.layer
}, AudioPage.prototype._initSorter = function(e) {
    function i(i, t, o) {
        var s = domData(i, "full-id"),
            r = domData(t, "full-id"),
            n = domData(o, "full-id"),
            d = e.indexOfAudio(s),
            l = e.indexOfAudio(r),
            u = e.indexOfAudio(n);
        r ? e.moveAudio(d, l) : n && e.moveAudio(d, u + 1), a.isLayer() || (s = s.split("_")[1], r = r ? r.split("_")[1] : "", n = n ? n.split("_")[1] : "", ajax.post(
            "al_audio.php", {
                act: "reorder_audios",
                oid: a.options.oid,
                aid: intval(s),
                before: intval(r),
                after: intval(n),
                hash: a.options.reorderHash
            }))
    }

    function t(e) {
        var i = e.id.split("_");
        return i[i.length - 1]
    }
    var o = geByClass1("_audio_playlist", this._container);
    this._sorter && !this._sorter.isCurrentlyDragging() && (this._sorter.destroy(), this._sorter = !1);
    var a = this,
        s = !1,
        r = this.getCurrentPlaylist();
    if (s = this.isLayer() ? r == this.ap.getCurrentPlaylist() : this.options.reorderHash && e.getType() == AudioPlaylist.TYPE_ALBUM, s && !this._sorter) {
        var n = this.isLayer() ? {} : {
            onDragOverElClass: "_audio_album_item",
            onDragEnter: function(i, o) {
                var a = t(i);
                a != e.getAlbumId() && (addClass(o, "audio_item_drag_over_album"), addClass(i, "audio_album_drop"))
            },
            onDragLeave: function(e, i) {
                removeClass(i, "audio_item_drag_over_album"), removeClass(e, "audio_album_drop")
            },
            onDragDrop: function(i, o) {
                removeClass(o, "audio_item_drag_over_album"), removeClass(i, "audio_album_drop");
                var s = t(i),
                    r = domData(o, "full-id");
                if (s == e.getAlbumId()) return !0;
                ajax.post("al_audio.php", {
                    act: "a_move_to_album",
                    album_id: s,
                    audio_id: r.split("_")[1],
                    hash: a.options.moveHash,
                    gid: a.options.oid < 0 ? -a.options.oid : null
                });
                var n = a.getCurrentPlaylist(),
                    d = n.indexOfAudio(r);
                if (n.getAlbumId() != AudioUtils.AUDIO_ALBUM_ID_ALL && d >= 0) n.removeAudio(r), a.switchToSection(n);
                else {
                    var l = a.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, a.options.oid, s);
                    l.clean()
                }
                var u = {};
                return u[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] = s, a.ap.updateAudio(r, u), !0
            }
        };
        this._sorter = new GridSorter(o, extend({
            onReorder: i,
            wrapNode: this.isLayer() ? geByClass1("audio_layer_rows_wrap", this._container) : !1,
            dragCls: "audio_item_drag",
            limitBottomMove: !0
        }, n))
    }
}, AudioPage.prototype._updateLayerRowsBottomPadding = function() {
    if (this.isLayer()) {
        var e = geByClass1("_audio_rows", this._container);
        setStyle(e, "padding-bottom", null);
        var i = (getXY(e)[1], getSize(e)[1] + getSize(this.searchInputEl)[1]),
            t = 14,
            o = geByClass1("_audio_layer_menu_wrap", this._container),
            a = getSize(o)[1],
            s = geByClass1("_audio_layer_rows_wrap", this._container),
            r = getSize(s)[1],
            n = Math.max(a, r);
        n > i ? setStyle(e, "padding-bottom", n - i + t - 1) : setStyle(e, "padding-bottom", null), this.getLayer()
            .sb.update()
    }
}, AudioPage.prototype._initAutoList = function(e, i, t) {
    var o = geByClass1("_audio_playlist", this._container),
        a = geByClass1("_ui_audio_load_more", this._container),
        s = this,
        r = 50;
    this._autoList && this._autoList.destroy();
    var n = 0,
        d = !1;
    this._autoList = new AutoList(o, {
        isLayer: this.isLayer(),
        scrollNode: this.isLayer() ? geByClass1("audio_layer_rows_wrap", this._container) : window,
        renderImmediate: !0,
        rowClass: "_audio_row audio_feed_post",
        onNoMore: function() {
            hide(a), s._updateEmptyPlaceholder(e)
        },
        onHasMore: function() {
            s._updateEmptyPlaceholder(e)
        },
        onRendered: function() {
            if (t(!1), s._updateLayerRowsBottomPadding(), s.ap.updateCurrentPlaying(), !d)
                if (d = !0, s.isLayer()) {
                    var e = geByClass1("audio_layer_rows_wrap", s._container);
                    e.scrollTop = 0, s.getLayer()
                        .sb.update()
                } else scrollToY(0)
        },
        onNeedRows: function(d, l, u, _) {
            function h(e) {
                if (e) {
                    0 == l && (o.innerHTML = "");
                    var t = !1,
                        a = !1;
                    if (e.getType() == AudioPlaylist.TYPE_FEED && e != ap.getCurrentPlaylist()) g = e.getItemsList()
                        .slice(l, l + r);
                    else {
                        c = e.getAudiosList()
                            .slice(l, l + r);
                        var t = e.getType() == AudioPlaylist.TYPE_SEARCH,
                            n = !1;
                        if (t) {
                            var u = e.getSearchParams()
                                .q;
                            u += " " + (parseLatin(u) || ""), u = trim(u.replace(/\)/g, "")
                                .replace(/&/, "&amp;")), n = new RegExp("(\\s|^)(" + u.replace(vkIndexer.delimiter, "|")
                                .replace(/(^\||\|$|\?)/g, "") + ")", "gi")
                        }
                        each(c, function(i, o) {
                            t && l + i == e.getLocalFoundCount() && g.push("<h3>" + langNumeric(e.getTotalCount(), ap.langs.audio_global_search_found, !0) +
                                "</h3>"), o = clone(o), o[AudioUtils.AUDIO_ITEM_INDEX_TITLE] = o[AudioUtils.AUDIO_ITEM_INDEX_TITLE].replace(n,
                                "$1<em>$2</em>"), o[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] = o[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER].replace(n,
                                "$1<em>$2</em>"), g.push(AudioUtils.drawAudio(o))
                        }), a && (i.innerHTML = "", a = !1)
                    }
                    if (d(g), !l && !s.isLayer()) {
                        var _ = e.getTitle() || document.title;
                        document.title = replaceEntities(_.replace(/(<em>|<\/em>|<strong>|<\/strong>)/g, ""))
                    }
                }
            }
            var c, g = [];
            n = l, _ || t(!0), l > 0 && (show(a), lockButton(a)), e.load(l, function(e) {
                h(e)
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
}, AudioPage.prototype._loadSilent = function(e, i) {
    var e = isObject(e) ? e : this.ap.getPlaylist(e),
        t = this,
        o = this.getCurrentPlaylist();
    if (AudioUtils.getPlaylistType(e) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) return void AudioUtils.indexPlaylist(e, function() {
        t._callOnSilentLoaded(e)
    });
    if (e.has_more) {
        if ((i || AudioUtils.getPlaylistType(o) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH) && this.toggleSearchProgress(!0), this._silentLoading = this._silentLoading || {},
            this._silentLoading[e.id]) return;
        this._silentLoading[e.id] = !0, ajax.post("al_audio.php", {
            act: "a_load_silent",
            playlist: e.id,
            offset: e.list.length,
            pop_band: intval(e.pop_band)
        }, {
            onDone: function(i) {
                t.toggleSearchProgress(!1), t._silentLoading[e.id] = !1, e = AudioUtils.mergePlaylist(e.id, i), e.shuffle && t.ap.shufflePlaylist(e), AudioUtils.indexPlaylist(
                    e,
                    function() {
                        t._callOnSilentLoaded(e)
                    })
            }
        })
    }
}, AudioPage.prototype._addOnSilentLoaded = function(e, i) {
    var t = this.ap.getPlaylist(e);
    if (!t.has_more) return void i(t);
    var o = "" + i;
    this._onSilentLoaded[t.id] = (this._onSilentLoaded[t.id] || [])
        .filter(function(e) {
            return "" + e != o
        }), this._onSilentLoaded[t.id].push(i)
}, AudioPage.prototype._callOnSilentLoaded = function() {
    var e = Array.prototype.slice.call(arguments),
        i = e[0];
    if (this._onSilentLoaded && this._onSilentLoaded[i.id]) {
        var t = this._onSilentLoaded[i.id] || [];
        this._onSilentLoaded[i.id] = [];
        var o = this;
        each(t, function(i, t) {
            t.apply(o, e)
        })
    }
}, AudioPage.prototype._initScroll = function() {
    if (this.isLayer()) {
        var e = geByClass1("audio_layer_menu_wrap", this._container),
            i = geByClass1("audio_layer_rows_wrap", this._container),
            t = geByClass1("audio_rows_header", this._container),
            o = i.scrollTop,
            a = 0,
            s = getSize(t),
            r = this;
        return setStyle(t, {
            width: s[0]
        }), void addEvent(i, "scroll", this._ev_onScroll = function(n) {
            getSize(e)[1], getSize(i)[1];
            if (cur.audioCancelMenuScroll) a = o = 0;
            else {
                var d = i.scrollTop - o;
                a -= d, a = Math.max(getSize(i)[1] - getSize(e)[1], a), a = Math.min(0, a)
            }
            setStyle(e, "top", a), o = i.scrollTop, delete cur.audioCancelMenuScroll;
            var l = geByClass1("_audio_padding_cont", r._container);
            i.scrollTop > 0 ? (setStyle(l, {
                "padding-top": s[1]
            }), addClass(t, "fixed")) : (setStyle(l, {
                "padding-top": null
            }), removeClass(t, "fixed"))
        })
    }
    var r = this,
        n = geByClass1("_audio_rows_header", this._container),
        d = getSize(n)[1],
        l = domPN(n),
        u = getSize(l)[0],
        _ = getSize(ge("page_header_cont"))[1];
    setStyle(n, {
        width: u,
        top: _
    });
    var h = getXY(l)[1];
    addEvent(window, "scroll", this._ev_onScroll = function() {
        scrollGetY() >= h - _ ? (addClass(n, "fixed"), setStyle(l, {
            "padding-top": d,
            "z-index": 2
        })) : (removeClass(n, "fixed"), setStyle(l, {
            "padding-top": null
        }))
    }), this.isLayer() || cur.destroy.push(function() {
        removeEvent(window, "scroll", r._ev_onScroll)
    })
}, AudioPage.prototype.toggleSearchProgress = function(e) {
    var i = geByClass1("ui_search_fltr_control", this._container),
        t = geByClass1("ui_search_fltr", t);
    hideProgress(t), e && showProgress(t), hasClass(i, "shown") || toggleClass(gpeByClass("_wrap", this.searchInputEl), "ui_search_loading", e)
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
    var t = this,
        o = geByClass1("_audio_playlist", this._container);
    toggleClass(o, "audio_search_rows", e.getType() == AudioPlaylist.TYPE_SEARCH), this._initAutoList(e, o, function(a) {
        if (a) {
            var s = geByClass1("_ui_item_audio_" + e.getId(), t._getMenuEl());
            if (!s) switch (e.getType()) {
                case AudioPlaylist.TYPE_POPULAR:
                    s = geByClass1("_ui_item_audio_popular_" + t.options.oid, t._getMenuEl());
                    break;
                case AudioPlaylist.TYPE_RECOM:
                    s = geByClass1("_ui_item_audio_recoms_" + t.options.oid, t._getMenuEl());
                    break;
                case AudioPlaylist.TYPE_FEED:
                    s = geByClass1("_ui_item_audio_feed_" + t.options.oid, t._getMenuEl())
            }
            if (s && isVisible(s) ? (uiRightMenu.switchMenu(s), uiRightMenu.showProgress(s)) : t._hideMenuItemProgress(), !s && e.getType() == AudioPlaylist.TYPE_ALBUM &&
                e.getOwnerId() != vk.id) {
                var r = geByClass1("_audio_friend_" + e.getOwnerId(), t._container);
                r && showProgress(r)
            }
            e.getType() == AudioPlaylist.TYPE_SEARCH && uiSearch.showProgress(t.searchInputEl)
        } else data(o, "playlist", e), unlockButton(geByClass1("audio_more_friends_btn")), t._hideMenuItemProgress(), t._updateAdditionalBlocksAndRightMenu(e, i), t._updateEmptyPlaceholder(
            e), uiSearch.hideProgress(t.searchInputEl), t._initSorter(e)
    }), this.isLayer() && toggleClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty", !val(this.searchInputEl))
}, AudioPage.prototype._getForeignTogglerEl = function() {
    return geByClass1("_ui_toggler", geByClass1("_audio_foreign_filter_block", this._container))
}, AudioPage.prototype.toggleForeign = function() {
    var e = this._getForeignTogglerEl(),
        i = toggleClass(e, "on"),
        t = this.getCurrentPlaylist(),
        o = (t.getAlbumId() + "")
        .replace(/[a-z]*/, ""),
        a = this.ap.getPlaylist(AudioPlaylist.TYPE_POPULAR, vk.id, (i ? "foreign" : "") + o);
    this.switchToSection(a)
}, AudioPage.prototype._updateEmptyPlaceholder = function(e) {
    var i = geByClass1("_audio_empty_placeholder ", this._container);
    if (e.getAudiosCount()) hide(i);
    else {
        show(i);
        var t = "",
            o = e.getType();
        t = o == AudioPlaylist.TYPE_ALBUM ? e.getOwnerId() == vk.id ? AudioPlayer.getLang("audio_no_rec_load_msg")
            .replace(/\{link\}/, '<a onclick="AudioPage(this).uploadAudio({}); return false">')
            .replace(/\{\/link\}/, "</a>") : AudioPlayer.getLang("audio_album_no_recs") : o == AudioPlaylist.TYPE_SEARCH ? AudioPlayer.getLang("audio_no_audios_found")
            .replace("{query}", clean(e.getSearchParams()
                .q)) : o == AudioPlaylist.TYPE_RECOM ? 0 == e.getAlbumId()
            .indexOf("album") ? AudioPlayer.getLang("audio_no_recs_found") : AudioPlayer.getLang("audio_no_audio_recs_found") : AudioPlayer.getLang("audio_album_no_recs"), val(
                i, t)
    }
}, AudioPage.prototype._updateAdditionalBlocksAndRightMenu = function(e, i) {
    var t = this,
        o = getAudioPlayer(),
        a = this._getMenuEl(),
        s = null;
    if (e == this.ap.getCurrentPlaylist()) s = geByClass1("_ui_item_audio_current", a);
    else switch (e.getType()) {
        case AudioPlaylist.TYPE_RECOM:
            s = geByClass1("_ui_item_audio_recoms_" + e.getOwnerId(), a);
            break;
        case AudioPlaylist.TYPE_FEED:
            s = geByClass1("_ui_item_audio_feed_" + vk.id, a);
            break;
        case AudioPlaylist.TYPE_ALBUM:
            s = geByClass1("_ui_item_audio_" + e.getId(), a);
            break;
        case AudioPlaylist.TYPE_POPULAR:
            var r = this._normalizePlaylistId(e);
            s = geByClass1("_ui_item_audio_" + r, a)
    }
    s ? (this._unselectFriends(), removeClass(s, "unshown"), uiRightMenu.switchMenu(s)) : uiRightMenu.unselectAll(this._getMenuEl());
    var n = e.getBlocks(),
        d = "_ui_item_audio_" + AudioPlaylist.TYPE_POPULAR + "_" + this.options.oid + "_0",
        l = geByClass1(d, this._getMenuEl()),
        u = geByClass1("_ui_item_audio_popular_" + this.options.oid, this._getMenuEl());
    if (n.submenu && !l) {
        var _ = se(n.submenu);
        domInsertAfter(_.children[1], u), domInsertAfter(_.children[0], u), l = geByClass1(d, this._getMenuEl()), uiRightMenu.switchMenu(l)
    }
    var h = geByClass1("_ui_item_audio_genres", this._getMenuEl());
    isVisible(u);
    if (e.getType() == AudioPlaylist.TYPE_POPULAR) {
        show(h), show(domNS(h)), hide(u), uiRightMenu.hideSliding(this._getMenuEl());
        var c = geByClass1("_ui_rmenu_audio_albums_toggle", this._getMenuEl());
        hasClass(c, "ui_rmenu_item_expanded") && uiRightMenu.toggleSubmenu("audio_albums", this)
    } else hide(h), hide(domNS(h)), show(u);
    var g = geByClass1("_audio_foreign_filter_block", this._container);
    toggle(g, e.getType() == AudioPlaylist.TYPE_POPULAR), setTimeout(function() {
            uiRightMenu.hideSliding(t._getMenuEl())
        }, 150), each(geByClass("_audio_additional_block", this._container), hide), each(geByClass("_audio_additional_blocks_wrap", this._container), hide), this._blocks =
        this._blocks || {}, e.getType() == AudioPlaylist.TYPE_SEARCH && n.search && (this._blocks[e.getId()] = n.search), each(n, function(e, i) {
            t._blocks[e] = t._blocks[e] || i
        }), o.friendBlock && (this._blocks.friends = this._blocks.friends || o.friendBlock.friends);
    var p = [];
    switch (e.getType()) {
        case AudioPlaylist.TYPE_ALBUM:
        case AudioPlaylist.TYPE_TEMP:
        case AudioPlaylist.TYPE_FEED:
            var y = e.getOwnerId();
            e.getType() == AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM && e.isPopBand() ? p.push("pop_band_" + y) : 0 > y ? p.push(this._prevSearchPlaylistId) : p.push("friends"), 0 >
                y && cur.prevSearchPlaylist && p.push(cur.prevSearchPlaylist.getId());
            break;
        case AudioPlaylist.TYPE_RECOM:
            p.push("recoms");
            break;
        case AudioPlaylist.TYPE_POPULAR:
        case AudioPlaylist.TYPE_SEARCH:
            p.push(e.getId())
    }
    e == getAudioPlayer()
        .getCurrentPlaylist() && p.push("friends"), each(p, function(e, i) {
            if (i) {
                var o = "right";
                0 == i.indexOf("popular_") && (o = "top");
                var a = geByClass1("_audio_additional_blocks_wrap_" + o, t._container),
                    s = geByClass1("_audio_additional_block_" + i, t._container);
                !s && t._blocks[i] && (s = se(rs(t.options.additionalBlockSectionTpl, {
                    block_id: i
                })), val(s, t._blocks[i]), a.appendChild(s)), show(s), show(a)
            }
        }), uiSearch.init("audio_friends_search"), this._updateLayerRowsBottomPadding()
}, AudioPage.prototype.onSubmenuToggle = function() {
    this._updateLayerRowsBottomPadding()
}, AudioPage.prototype._updateLayerBottom = function() {}, AudioPage.prototype._loadMorePaginatedPlaylist = function(e, i, t) {
    if ("string" == typeof e && (e = this.ap.getPlaylist(e)), !e.has_more) return t && t(e);
    if (i * this.options.audioRowsPerPage < e.next_offset) return t && t(e);
    if (AudioUtils.getPlaylistType(e) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) return t && t(e);
    if (AudioUtils.getPlaylistType(e) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && 0 == i && e.list.length) return e.has_more = e.list.length < AudioUtils.AUDIO_ENOUGH_LOCAL_SEARCH_RESULTS,
        t && t(e);
    var o = e.id,
        a = o + (e.shuffle ? "_" + intval(e.shuffle) : ""),
        s = this;
    if (cur._playlistLoadingLock = cur._playlistLoadingLock || {}, !cur._playlistLoadingLock[a]) {
        cur._playlistLoadingLock[a] = !0, AudioUtils.getPlaylistType(e) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && (e.list.length && 1 == i || !e.list.length && 0 == i) &&
            this.toggleSearchProgress(!0);
        var r = {
            act: "a_load_section",
            section: e.id,
            offset: e.next_offset
        };
        AudioUtils.getPlaylistType(e) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && extend(r, {
            q: e.searchParams.q,
            lyrics: e.searchParams.lyrics,
            performer: e.searchParams.performer,
            sort: e.searchParams.sort
        }), AudioUtils.getPlaylistType(e) == AudioUtils.AUDIO_PLAYLIST_TYPE_FEED && extend(r, {
            feed_from: e.feed_from,
            feed_offset: e.feed_offset
        }), e.shuffle && (r.shuffle = intval(e.shuffle)), this._lastRequestedPlaylistId = o, ajax.post("/al_audio.php", r, {
            onDone: function(i) {
                if (cur._playlistLoadingLock[a] = !1, s.toggleSearchProgress(!1), s._lastRequestedPlaylistId != o) return t && t(!1);
                i && (e = AudioUtils.mergePlaylist(o, i));
                var r = s.ap.getCurrentPlaylist();
                r && e.id == r.id && this.ap.moveCurrentPlayingAtFirstPos(e), t && t(e)
            }
        })
    }
}, AudioPage.prototype._hideMenuItemProgress = function() {
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
}, AudioPage.prototype._initNavigation = function() {
    this._prevLoc = !1;
    var e = !1,
        i = !1;
    this._prevSearchPlaylistId = null, cur.nav.push(this._nav_func = function(t, o, a, s) {
        if (each(cur._audioAddRestoreInfo || {}, function(e, i) {
                ("deleted" == i.state || "recom_hidden" == i.state) && getAudioPlayer()
                    .deleteAudioFromAllPlaylists(e)
            }), s.searchPerformer && (a = extend({}, this._prevLoc, a)), this.isLayer()) {
            if (this._prevLoc !== !1) {
                o = clone(this._prevLoc), t = clone(a);
                for (var r in o) o[r] && void 0 === a[r] ? t[r] = !1 : o[r] == a[r] && delete t[r]
            }
            i === !1 && (i = o[0]), 0 != a[0].indexOf("audio") && i == a[0] && delete t[0]
        }
        var n = !!t[0],
            d = t.q === !1;
        if (n) {
            var l = this.options.oid;
            if (l != vk.id && !inArray(t[0], ["audios" + l]) || l == vk.id && !inArray(t[0], ["audios" + l, "audio"])) return !0
        }
        if (this.isLayer() && (s.hist || s.back || t[0] && 0 != t[0].indexOf("audio"))) return this.options.eltt.hide(), !0;
        if (0 == Object.keys(t)
            .length && !s.fromSearch && !s.fromMenu && !s.friendEl) return !1;
        d && e && s.fromSearch && (a = e);
        var u;
        if (this._unselectFriends(), a.q) {
            var _ = trim(val(this.searchInputEl));
            _ != a.q && val(this.searchInputEl, replaceEntities(a.q));
            var h = replaceEntities(a.q),
                c = {
                    q: a.q
                };
            each(["performer", "lyrics", "sort"], function(e, i) {
                c[i] = intval(a[i]), h += c[i]
            }), h = hashCode(h);
            var g = a.friend || a.band || this.options.oid;
            u = this.ap.getPlaylist(AudioPlaylist.TYPE_SEARCH, g, h), u.mergeWith({
                searchParams: c
            }), removeClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty"), e || o.q || (e = o), delete a.section
        } else if (a.section == AudioPlaylist.TYPE_POPULAR) {
            var p = hasClass(this._getForeignTogglerEl(), "on") ? "foreign" : "";
            u = this.ap.getPlaylist(AudioPlaylist.TYPE_POPULAR, vk.id, p + intval(a.genre))
        } else if (a.friend) {
            var y = intval(a.friend),
                f = geByClass1("_audio_friend_" + y, this._container);
            addClass(f, "audio_friend_selected"), u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, y, AudioUtils.AUDIO_ALBUM_ID_ALL), geByClass1("_audio_friend_" + y) ||
                this.showMoreFriends(!1, y), o.q && 0 > y && !cur.prevSearchPlaylist && (cur.prevSearchPlaylist = this.getCurrentPlaylist())
        } else if (a.section == AudioPlaylist.TYPE_RECOM) {
            var A = AudioUtils.AUDIO_ALBUM_ID_ALL;
            a.audio_id ? A = "audio" + a.audio_id : a.album_id && (A = "album" + a.album_id), u = this.ap.getPlaylist(AudioPlaylist.TYPE_RECOM, this.options.oid, A)
        } else a.section == AudioPlaylist.TYPE_FEED ? u = this.ap.getPlaylist(AudioPlaylist.TYPE_FEED, vk.id, 0) : a.section == AudioPlaylist.TYPE_CURRENT ? u = this.ap
            .getCurrentPlaylist() : a.band ? (u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, intval(a.band), AudioUtils.AUDIO_ALBUM_ID_ALL), u.mergeWith({
                band: 1
            })) : a.album_id ? u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, a.album_id) : (u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM,
                this.options.oid, AudioUtils.AUDIO_ALBUM_ID_ALL), addClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty"));
        return a.section != AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS && (delete a.audio_id, a.section && delete a.album_id), d && (e = !1, val(this.searchInputEl, ""),
            this._muteFilterEvent = !0, uiSearch.removeAllFilters(this.searchInputEl), delete a.performer, delete a.lyrics, delete a.sort, this._muteFilterEvent = !
            1), a.friend || delete cur.prevSearchPlaylist, this.isLayer() || nav.setLoc(a), this._prevLoc = a, this.syncFilters(a), this.switchToSection(u, !0), !1
    }.bind(this))
}, AudioPage.prototype.deleteCurrentPlaylist = function(e) {
    this.ap.deleteCurrentPlaylist();
    var i = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL);
    this.switchToSection(i), re(geByClass1("_ui_item_audio_current", this._getMenuEl())), window.tooltips && tooltips.hideAll(), this.ap.updateCurrentPlaying(), cancelEvent(e)
}, AudioPage.prototype.setTooltipTitle = function(e) {
    if (!e.titleSet) {
        var i = geByClass1("audio_page_player_title_performer", e),
            t = geByClass1("audio_page_player_title_song", e);
        (i.scrollWidth > i.clientWidth || t.scrollWidth > t.clientWidth) && e.setAttribute("title", e.innerText), e.titleSet = !0
    }
}, AudioPage.prototype._initPlayer = function() {
    function e(e) {
        e = AudioUtils.asObject(e), d.innerHTML = e.performer, l.innerHTML = "&ndash; " + e.title
    }

    function i(e, i) {
        e = AudioUtils.asObject(e);
        var t, o = a.getDurationType(),
            s = intval(e.duration);
        return t = o ? "-" + formatTime(Math.round(s - i * s)) : formatTime(Math.round(i * s))
    }

    function t() {
        if (o._trackSlider) {
            var e = AudioUtils.asObject(o._readyAudio || a.getCurrentAudio()),
                i = e.ownerId != o.options.oid;
            g !== i && (toggle(c, i), g = i), cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {};
            var t = cur._audioAddRestoreInfo[e.fullId];
            addClass(c, "no_transition"), toggleClass(c, "audio_player_btn_added", !(!t || "added" != t.state)), removeClassDelayed(c, "no_transition"), toggleClass(h,
                "audio_page_player_btn_enabled", o.ap.isRepeatCurrentAudio())
        }
    }
    var o = this,
        a = getAudioPlayer(),
        s = this._container,
        r = geByClass1("_audio_page_player", s),
        n = geByClass1("audio_page_player_title", r),
        d = geByClass1("audio_page_player_title_performer", r),
        l = geByClass1("audio_page_player_title_song", r),
        u = geByClass1("audio_page_player_duration", r),
        _ = geByClass1("_audio_page_player_play", r),
        h = geByClass1("_audio_page_player_repeat", r),
        c = geByClass1("_audio_page_player_add", r),
        g = void 0;
    this._trackSlider = new Slider(geByClass1("audio_page_player_track_slider", r), {
        value: a.getCurrentProgress(),
        backValue: a.getCurrentBuffered(),
        size: 1,
        hintClass: "audio_player_hint",
        withBackLine: !0,
        formatHint: function(e) {
            var i = a.getCurrentAudio() || o._readyAudio;
            return i = AudioUtils.asObject(i), formatTime(Math.round(e * i.duration))
        },
        onEndDragging: function(e) {
            a.seek(e)
        }
    }), this._volumeSlider = new Slider(geByClass1("audio_page_player_volume_slider", r), {
        value: a.getVolume(),
        size: 1,
        hintClass: "audio_player_hint",
        formatHint: function(e) {
            return Math.round(100 * e) + "%"
        },
        onChange: function(e) {
            a.setVolume(e)
        }
    }), this.ap.on(this, AudioPlayer.EVENT_START_LOADING, function() {
        o._trackSlider.toggleLoading(!0)
    }), this.ap.on(this, AudioPlayer.EVENT_CAN_PLAY, function() {
        o._trackSlider.toggleLoading(!1)
    }), this.ap.on(this, AudioPlayer.EVENT_ADDED, function(e, i) {
        e = AudioUtils.asObject(e), e && e.fullId == i && addClass(c, "audio_player_btn_added")
    }), this.ap.on(this, AudioPlayer.EVENT_REMOVED, function(e, i) {
        e = AudioUtils.asObject(e), e && e.fullId == i && removeClass(c, "audio_player_btn_added")
    }), this.ap.on(this, AudioPlayer.EVENT_PLAY, function(a, s, d) {
        delete o._readyAudio, data(r, "audio", a), t(), e(a), addClass(_, "audio_playing"), s && !cur.audioStartReadyAudio && (o._trackSlider.setBackValue(0), o._trackSlider
            .setValue(0), u.innerHTML = i(a, 0), n.setAttribute("title", ""), n.titleSet = !1)
    }), this.ap.on(this, AudioPlayer.EVENT_PAUSE, function(e) {
        removeClass(_, "audio_playing")
    }), this.ap.on(this, AudioPlayer.EVENT_BUFFERED, function(e, i) {
        o._trackSlider.setBackValue(i)
    }), this.ap.on(this, AudioPlayer.EVENT_VOLUME, function(e, i) {
        o._volumeSlider.setValue(i)
    }), this.ap.on(this, AudioPlayer.EVENT_UPDATE, function(e, t) {
        e && t && (u.innerHTML = i(e, t))
    }), this.ap.on(this, AudioPlayer.EVENT_PROGRESS, function(e, t) {
        o._trackSlider.setValue(t), u.innerHTML = i(e, t)
    });
    var p = this.ap.getCurrentAudio() || this._readyAudio;
    p && (domData(r, "audio", JSON.stringify(p)), e(p), toggleClass(_, "audio_playing", this.ap.isPlaying())), t()
}, AudioPage.prototype.scrollToTrack = function() {
    var e = this,
        i = this.getCurrentPlaylist(),
        t = this.ap.getCurrentAudio();
    if ((!this.isLayer() || this.getLayer()
            .isShown()) && i && -1 != i.indexOfAudio(t)) {
        this.ap.updateCurrentPlaying();
        var o = geByClass1(AudioUtils.AUDIO_PLAYING_CLS, this._container);
        if (!o && this.isLayer()) {
            t = AudioUtils.asObject(t);
            for (var a = 100; a-- && (this._autoList.drawMore(), o = geByClass1("_audio_row_" + t.fullId, this._container), !(o || this._autoList.isPendingRows() || this._autoList
                    .isDone())););
        }
        if (o) {
            var s = this.isLayer() ? geByClass1("audio_layer_rows_wrap", this._container) : bodyNode,
                r = this.isLayer() ? s.scrollTop : 0,
                n = this.isLayer() ? getSize(s)[1] : clientHeight(),
                d = this.isLayer() ? getXY(s)[1] : 0,
                l = getXY(o)[1] - d + r,
                u = getSize(o)[1],
                _ = l - n / 2 + u / 2;
            e.isLayer() ? (cur.audioCancelMenuScroll = !0, s.scrollTop = _, setTimeout(function() {
                cur.audioCancelMenuScroll = !0, s.scrollTop = _, e.getLayer()
                    .sb.update(), delete cur.audioCancelMenuScroll
            })) : scrollToY(_, 400)
        }
    }
}, AudioPage.prototype.togglePlayerPlay = function(e) {
    if (this.ap.isPlaying()) this.ap.pause();
    else {
        var i = this.getCurrentPlaylist(),
            t = this.ap.getCurrentPlaylist(),
            o = this.ap.getCurrentAudio(),
            a = this._readyAudio ? this._readyAudio : o;
        a = a ? a : i.getAudioAt(0);
        var s; - 1 != i.indexOfAudio(a) ? s = i : t && -1 != t.indexOfAudio(a) ? s = t : (s = new AudioPlaylist(AudioPlaylist.TYPE_TEMP, vk.id), s.addAudio(a)), delete this._readyAudio,
            cur.audioStartReadyAudio = !0, this.ap.play(a, s)
    }
};
try {
    stManager.done("audio.js")
} catch (e) {}
