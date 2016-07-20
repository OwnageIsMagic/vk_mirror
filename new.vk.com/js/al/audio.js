function AudioPage(e, i, t, o) {
    function a() {
        n.isLayer() || (nav.curLoc && nav.setLoc(nav.fromStr(nav.curLoc)), nav.objLoc.q && n.onSearchFiltersChanged(nav.objLoc))
    }
    if (!(this instanceof AudioPage)) {
        var s = gpeByClass("_audio_layout", e);
        return s ? data(s, "audioPage") : !1
    }
    if (AudioUtils.toggleAudioHQBodyClass(), addTemplates({
            audio_row: t.audioRowTpl
        }), this.options = t, this._container = ge(e), this._onSilentLoaded = {}, this._readyAudio = o, cur.canAudioAddToGroup = this.options.canAudioAddToGroup, this.ap =
        getAudioPlayer(), ap.langs = t.langs, extend(cur.lang || {}, t.langs), this.ap.getCurrentAudio() && delete this._readyAudio, i.type) {
        var r = getAudioPlayer()
            .hasPlaylist(i.type, i.ownerId, i.albumId);
        r ? i = r : (i = new AudioPlaylist(i), i.loadSilent())
    } else ap.friendBlock = i.blocks, i = this.ap.getCurrentPlaylist(), i.mergeWith({
        blocks: ap.friendBlock
    });
    if (isObject(t.myPlaylist)) {
        var d = new AudioPlaylist(t.myPlaylist);
        this._myPlaylist = d.getId()
    }
    this._updateAdditionalBlocksAndRightMenu(i), this._initSearch(), this._initScroll(), this.ap.setStatusExportInfo(t.exp), this.onShow(i), data(e, "audioPage", this);
    var n = this;
    this.isLayer() || (cur.destroy.push(function() {
        ap.off(n), delete n
    }), cur.module = "audio"), this.ap.on(this, AudioPlayer.EVENT_PLAY, function(e, i, t) {
        var o = this.getCurrentPlaylist(),
            a = !this.isLayer() && this.ap.layer && this.ap.layer.isShown();
        i && 0 != t && o.indexOfAudio(e) >= 0 && (a || this.scrollToTrack())
    }.bind(this)), a(), setTimeout(function() {
        n._initAlbumsSort()
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
                o = AudioUtils.hasAudioHQBodyClass();
            t.showHQLabel(!o), window.Notifier && Notifier.lcSend("audio_hq_label"), delete cur.ctrlPressed
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
        var d = this.ap.getCurrentAudio();
        d && (o = AudioUtils.asObject(d)
            .fullId);
        var n = (this.ap.getCurrentPlaylist(), null);
        ajax.post("al_audio.php", {
            act: "toggle_status",
            exp: intval(t),
            oid: i,
            hash: r,
            id: o,
            top: intval(n && (n.top_audio || n.top))
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
        d = {
            act: "save_album",
            album_id: t,
            name: o,
            gid: 0 > s ? -s : 0,
            Audios: e.join(","),
            hash: cur.audioPage.options.saveAlbumHash
        };
    return ajax.post("al_audio.php", d, {
        showProgress: lockButton.pbind(i),
        hideProgress: unlockButton.pbind(i),
        onFail: a.hide,
        onDone: function(i, t, o, a) {
            var d = getAudioPlayer(),
                n = d.getPlaylist(AudioPlaylist.TYPE_ALBUM, s, i);
            n.clean(), n.mergeWith({
                list: a,
                hasMore: !1
            }), d.deletePlaylist(d.getPlaylist(AudioPlaylist.TYPE_RECOM, s, "album" + i)), each(e, function(e, i) {
                var t = {};
                t[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] = i, d.updateAudio(s + "_" + i, t)
            }), each(d.getPlaylists(), function(e, i) {
                i.getType() == AudioPlaylist.TYPE_ALBUM && i.getOwnerId() == s && d.deletePlaylist(i)
            });
            var l = geByClass1("ui_rmenu", cur.audioPage._container),
                u = geByClass1("ui_rmenu_item_sel", l),
                _ = u ? u.id : !1,
                c = domPN(l);
            c.replaceChild(se(o), l), cur.audioPage._initAlbumsSort(), _ && uiRightMenu.switchMenu(ge(_)), curBox()
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
    function o() {
        d && (removeClass(d, "in_progress"), hideProgress(d)), showTabbedBox("al_audio.php", {
            act: "edit_album_box",
            album_id: e || 0,
            oid: a.options.oid
        }, {
            stat: ["privacy.js", "privacy.css", "ui_controls.js", "ui_controls.css", "indexer.js"],
            dark: 1
        })
    }
    var a = this,
        s = getAudioPlayer(),
        r = s.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, AudioPlaylist.ALBUM_ALL),
        d = i ? gpeByClass("_audio_album_btns", i) : null;
    d && (addClass(d, "in_progress"), showProgress(d)), r.loadSilent(function(i) {
        i.isComplete() ? o() : (i = s.getPlaylist(AudioPlaylist.TYPE_ALBUM, a.options.oid, e), i.loadSilent(o))
    }), cancelEvent(t)
}, AudioPage.prototype.onHide = function() {
    var e = this;
    cur.nav = cur.nav.filter(function(i) {
        return e._nav_func != i
    }), this._deinitKeyEvents()
}, AudioPage.prototype.addMd = function(e, i, t) {
    var o = gpeByClass("_audio_row", e),
        a = AudioUtils.getAudioFromEl(o, !0);
    return cur.editTopAudio = a, showBox("al_audio.php", {
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
    var o = gpeByClass("_audio_row", e),
        a = AudioUtils.getAudioFromEl(o, !0);
    return re(o), ajax.post("al_audio.php", {
        act: "delete_audio",
        oid: a.ownerId,
        aid: a.id,
        hash: a.actHash,
        top_moder: 1
    }), t && cancelEvent(t), !1
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
        this.getCurrentPlaylist(), this.switchToSection(e), this._initPlayer(), this._initKeyEvents(), this.updateStatusExportControls(), this.isLayer() && setTimeout(function() {
            var e = geByClass1("_audio_rows_header", this._container);
            setStyle(e, "width", getSize(geByClass1("_audio_rows", this._container))[0] - 1), this.getLayer()
                .sb.widthUpdated()
        }.bind(this)), this.scrollToTrack(!0)
}, AudioPage.prototype.onAudioUploaded = function(e, i) {
    if (i) {
        var t = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, AudioPlaylist.ALBUM_ALL);
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
    };
    var s = this.ap.getCurrentPlaylist();
    s && s.getType() == AudioPlaylist.TYPE_RECOM && (cur._audioAddRestoreInfo[i.fullId].removedCurrentPos = s.removeAudio(i))
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
        "audio_deleted");
    var a = cur._audioAddRestoreInfo[i.fullId].removedCurrentPos,
        s = this.ap.getCurrentPlaylist();
    a >= 0 && s && s.getType() == AudioPlaylist.TYPE_RECOM && s.addAudio(AudioUtils.getAudioFromEl(e), a), delete cur._audioAddRestoreInfo[i.fullId]
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
            d = vk.audioParams.deleteHash;
        if (cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {}, AudioUtils.isRecomAudio(r)) return addClass(s, "audio_deleted"), this.hideRecommendation(s), a(!1),
            cancelEvent(t);
        var n = cur._audioAddRestoreInfo[r.fullId];
        if (!hasClass(s, "audio_delete_all") || !n.deleteAll) return addClass(s, "audio_deleted"), addClass(s, "canadd"), removeClass(s, "canedit"), ajax.post("al_audio.php", {
            act: "delete_audio",
            oid: r.ownerId,
            aid: r.id,
            hash: d,
            restore: 1
        }, {
            onDone: function(e, i) {
                a(!1), e && addClass(s, "audio_delete_all"), cur._audioAddRestoreInfo[r.fullId] = {
                    state: "deleted",
                    deleteAll: e,
                    deleteConfirmMsg: i
                }
            }
        }), cancelEvent(t);
        showFastBox({
            title: getLang("audio_delete_all_title"),
            dark: 1
        }, n.deleteConfirmMsg || "", getLang("global_delete"), function(e) {
            var i = extend({
                act: "delete_all"
            }, n.deleteAll);
            ajax.post("al_audio.php", i, {
                showProgress: lockButton.pbind(e),
                onDone: function() {
                    var e = getAudioPlayer()
                        .getPlaylist(AudioPlaylist.TYPE_ALBUM, n.deleteAll.from_id, AudioPlaylist.ALBUM_ALL);
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
            l = e.indexOfAudio(s),
            u = e.indexOfAudio(r),
            _ = e.indexOfAudio(n);
        r ? e.moveAudio(l, u) : n && e.moveAudio(l, _ + 1), a.isLayer() || (s = s.split("_"), ajax.post("al_audio.php", {
            act: "reorder_audios",
            oid: intval(s[0]),
            aid: intval(s[1]),
            before: r,
            after: n,
            hash: a.options.reorderHash,
            top_moder: intval(d)
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
        r = this.getCurrentPlaylist(),
        d = !1;
    if (this.isLayer() ? s = r == this.ap.getCurrentPlaylist() : (d = e.getType() == AudioPlaylist.TYPE_POPULAR && this.options.md, s = this.options.reorderHash && e.getType() ==
            AudioPlaylist.TYPE_ALBUM || d), s && !this._sorter) {
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
                var d = a.getCurrentPlaylist(),
                    n = d.indexOfAudio(r);
                if (d.getAlbumId() != AudioPlaylist.ALBUM_ALL && n >= 0) d.removeAudio(r), a.switchToSection(d);
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
            d = Math.max(a, r);
        d > i ? setStyle(e, "padding-bottom", d - i + t - 1) : setStyle(e, "padding-bottom", null), setTimeout(function() {
            var e = getAudioPlayer()
                .layer;
            e && e.sb.update()
        }, 1)
    }
}, AudioPage.prototype._initAutoList = function(e, i, t) {
    var o = this,
        a = getAudioPlayer(),
        s = geByClass1("_audio_playlist", this._container),
        r = geByClass1("_ui_audio_load_more", this._container),
        d = 50;
    this._autoList && this._autoList.destroy();
    var n = 0,
        l = !1;
    this._autoList = new AutoList(s, {
        isLayer: this.isLayer(),
        scrollNode: this.isLayer() ? geByClass1("_audio_layer_rows_wrap", this._container) : window,
        contentNode: geByClass1("_audio_rows", this._container),
        renderImmediate: !0,
        rowClass: "_audio_row audio_feed_post",
        onNoMore: function() {
            hide(r), o._updateEmptyPlaceholder(e)
        },
        onHasMore: function() {
            o._updateEmptyPlaceholder(e)
        },
        onRendered: function() {
            if (t(!1), o._updateLayerRowsBottomPadding(), a.updateCurrentPlaying(), !l)
                if (l = !0, o.isLayer()) {
                    var e = geByClass1("_audio_layer_rows_wrap", o._container);
                    e.scrollTop = 0, o.getLayer()
                        .sb.update()
                } else scrollToY(0)
        },
        onNeedRows: function(i, l, u, _) {
            function c(e) {
                if (e) {
                    if (0 == l && (s.innerHTML = ""), e.getType() == AudioPlaylist.TYPE_FEED && e != a.getCurrentPlaylist()) g = e.getItemsList()
                        .slice(l, l + d);
                    else {
                        h = e.getAudiosList()
                            .slice(l, l + d);
                        var t = e.getType() == AudioPlaylist.TYPE_SEARCH && a.getCurrentPlaylist() != e,
                            r = !1;
                        if (t) {
                            var n = e.getSearchParams()
                                .q;
                            n += " " + (parseLatin(n) || ""), n = trim(n.replace(/\)/g, "")
                                .replace(/&/, "&amp;")), r = new RegExp("(\\s|^)(" + n.replace(vkIndexer.delimiter, "|")
                                .replace(/(^\||\|$|\?)/g, "") + ")", "gi")
                        }
                        each(h, function(i, o) {
                            t && l + i == e.getLocalFoundCount() && g.push("<h3>" + langNumeric(e.getTotalCount(), a.langs.audio_global_search_found, !0) +
                                "</h3>"), o = clone(o), o[AudioUtils.AUDIO_ITEM_INDEX_TITLE] = o[AudioUtils.AUDIO_ITEM_INDEX_TITLE].replace(r,
                                "$1<em>$2</em>"), o[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] = o[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER].replace(r,
                                "$1<em>$2</em>");
                            var s = "",
                                d = AudioUtils.getAddRestoreInfo()[AudioUtils.asObject(o)
                                    .fullId];
                            d && "added" == d.state && (s = "added"), g.push(AudioUtils.drawAudio(o, s))
                        })
                    }
                    if (i(g), !l && !o.isLayer()) {
                        var u = e.getTitle() || document.title;
                        document.title = replaceEntities(u.replace(/(<em>|<\/em>|<strong>|<\/strong>)/g, ""))
                    }
                }
            }
            var h, g = [];
            n = l, _ || t(!0), l > 0 && (show(r), lockButton(r)), e.load(l, function(e) {
                c(e)
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
            o = i.scrollTop,
            a = 0,
            s = getSize(t),
            r = this;
        return setStyle(t, {
            width: s[0]
        }), void addEvent(i, "scroll", this._ev_onScroll = function(d) {
            getSize(e)[1], getSize(i)[1];
            if (cur.audioCancelMenuScroll) a = o = 0;
            else {
                var n = i.scrollTop - o;
                a -= n, a = Math.max(getSize(i)[1] - getSize(e)[1], a), a = Math.min(0, a)
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
        d = geByClass1("_audio_rows_header", this._container),
        n = getSize(d)[1],
        l = domPN(d),
        u = getSize(l)[0],
        _ = getSize(ge("page_header_cont"))[1];
    setStyle(d, {
        width: u,
        top: _
    });
    var c = getXY(l)[1];
    addEvent(window, "scroll", this._ev_onScroll = function() {
        scrollGetY() >= c - _ ? (addClass(d, "fixed"), setStyle(l, {
            "padding-top": n,
            "z-index": 2
        })) : (removeClass(d, "fixed"), setStyle(l, {
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
    toggleClass(o, "audio_search_rows", e.getType() == AudioPlaylist.TYPE_SEARCH), toggleClass(o, "audio_popular_rows", e.getType() == AudioPlaylist.TYPE_POPULAR), toggleClass(
        o, "audio_current_rows", this.isLayer() && e == getAudioPlayer()
        .getCurrentPlaylist()), toggleClass(o, "audio_md_rows", !!this.options.md), e.load(), this._initAutoList(e, o, function(a) {
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
        if (o == AudioPlaylist.TYPE_ALBUM) t = e.getOwnerId() == vk.id ? AudioPlayer.getLang("audio_no_rec_load_msg")
            .replace(/\{link\}/, '<a onclick="AudioPage(this).uploadAudio({}); return false">')
            .replace(/\{\/link\}/, "</a>") : AudioPlayer.getLang("audio_album_no_recs");
        else if (o == AudioPlaylist.TYPE_SEARCH) t = AudioPlayer.getLang("audio_no_audios_found")
            .replace("{query}", clean(e.getSearchParams()
                .q));
        else if (o == AudioPlaylist.TYPE_RECOM) {
            var a = e.getAlbumId();
            t = isNumeric(a) || 0 == a.indexOf("album") ? AudioPlayer.getLang("audio_no_recs_found") : AudioPlayer.getLang("audio_no_audio_recs_found")
        } else t = AudioPlayer.getLang("audio_album_no_recs");
        val(i, t)
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
    var d = e.getBlocks(),
        n = "_ui_item_audio_" + AudioPlaylist.TYPE_POPULAR + "_" + this.options.oid + "_0",
        l = geByClass1(n, this._getMenuEl()),
        u = geByClass1("_ui_item_audio_popular_" + this.options.oid, this._getMenuEl());
    if (d.submenu && !l) {
        var _ = se(d.submenu);
        domInsertAfter(_.children[1], u), domInsertAfter(_.children[0], u), l = geByClass1(n, this._getMenuEl()), uiRightMenu.switchMenu(l)
    }
    var c = geByClass1("_ui_item_audio_genres", this._getMenuEl());
    isVisible(u);
    if (e.getType() == AudioPlaylist.TYPE_POPULAR) {
        show(c), show(domNS(c)), hide(u), uiRightMenu.hideSliding(this._getMenuEl());
        var h = geByClass1("_ui_rmenu_audio_albums_toggle", this._getMenuEl());
        hasClass(h, "ui_rmenu_item_expanded") && uiRightMenu.toggleSubmenu("audio_albums", this)
    } else hide(c), hide(domNS(c)), show(u);
    var g = geByClass1("_audio_foreign_filter_block", this._container);
    toggle(g, e.getType() == AudioPlaylist.TYPE_POPULAR), setTimeout(function() {
            uiRightMenu.hideSliding(t._getMenuEl())
        }, 150), each(geByClass("_audio_additional_block", this._container), hide), each(geByClass("_audio_additional_blocks_wrap", this._container), hide), this._blocks =
        this._blocks || {}, e.getType() == AudioPlaylist.TYPE_SEARCH && d.search && (this._blocks[e.getId()] = d.search), each(d, function(e, i) {
            t._blocks[e] = t._blocks[e] || i
        }), o.friendBlock && (this._blocks.friends = this._blocks.friends || o.friendBlock.friends);
    var p = [];
    switch (e.getType()) {
        case AudioPlaylist.TYPE_ALBUM:
        case AudioPlaylist.TYPE_TEMP:
        case AudioPlaylist.TYPE_FEED:
            var y = e.getOwnerId();
            e.getType() == AudioPlaylist.TYPE_ALBUM && e.isPopBand() ? p.push("pop_band_" + y) : 0 > y ? p.push(this._prevSearchPlaylistId) : p.push("friends"), 0 > y && cur.prevSearchPlaylist &&
                p.push(cur.prevSearchPlaylist.getId());
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
                for (var r in o) o[r] && void 0 === a[r] ? t[r] = !1 : o[r] == a[r] && delete t[r];
                (this._prevLoc.friend && t.friend === !1 || this._prevLoc.band && t.band === !1) && t.q && (a.friend = this._prevLoc.friend, a.band = this._prevLoc.band,
                    delete t.friend, delete t.band)
            }
            i === !1 && (i = o[0]), 0 != a[0].indexOf("audio") && i == a[0] && delete t[0]
        }
        var d = void 0 !== t[0],
            n = t.q === !1;
        if (d) {
            var l = this.options.oid;
            if (l != vk.id && !inArray(t[0], ["audios" + l]) || l == vk.id && !inArray(t[0], ["audios" + l, "audio"])) return !0
        }
        if (this.isLayer() && (s.hist || s.back || t[0] && 0 != t[0].indexOf("audio"))) return this.options.eltt.hide(), !0;
        if (0 == Object.keys(t)
            .length && !s.fromSearch && !s.fromMenu && !s.friendEl) return !1;
        n && e && s.fromSearch && (a = e);
        var u;
        if (this._unselectFriends(), a.q) {
            var _ = trim(val(this.searchInputEl));
            _ != a.q && val(this.searchInputEl, replaceEntities(a.q));
            var c = replaceEntities(a.q),
                h = {
                    q: a.q
                };
            each(["performer", "lyrics", "sort"], function(e, i) {
                h[i] = intval(a[i]), c += h[i]
            }), c = hashCode(c);
            var g = a.friend || a.band || this.options.oid;
            u = this.ap.getPlaylist(AudioPlaylist.TYPE_SEARCH, g, c), u.mergeWith({
                searchParams: h
            }), removeClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty"), e || o.q || (e = o), delete a.section
        } else if (a.section == AudioPlaylist.TYPE_POPULAR) {
            var p = hasClass(this._getForeignTogglerEl(), "on") ? "foreign" : "";
            u = this.ap.getPlaylist(AudioPlaylist.TYPE_POPULAR, vk.id, p + intval(a.genre))
        } else if (a.friend) {
            var y = intval(a.friend),
                P = geByClass1("_audio_friend_" + y, this._container);
            addClass(P, "audio_friend_selected"), u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, y, AudioPlaylist.ALBUM_ALL), geByClass1("_audio_friend_" + y) ||
                this.showMoreFriends(!1, y), o.q && 0 > y && !cur.prevSearchPlaylist && (cur.prevSearchPlaylist = this.getCurrentPlaylist())
        } else if (a.section == AudioPlaylist.TYPE_RECOM) {
            var A = AudioPlaylist.ALBUM_ALL;
            a.audio_id ? A = "audio" + a.audio_id : a.album_id && (A = "album" + a.album_id), u = this.ap.getPlaylist(AudioPlaylist.TYPE_RECOM, this.options.oid, A)
        } else a.section == AudioPlaylist.TYPE_FEED ? u = this.ap.getPlaylist(AudioPlaylist.TYPE_FEED, vk.id, 0) : a.section == AudioPlaylist.TYPE_CURRENT ? u = this.ap
            .getCurrentPlaylist() : a.band ? (u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, intval(a.band), AudioPlaylist.ALBUM_ALL), u.mergeWith({
                band: 1
            })) : a.album_id ? u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM, this.options.oid, a.album_id) : (u = this.ap.getPlaylist(AudioPlaylist.TYPE_ALBUM,
                this.options.oid, AudioPlaylist.ALBUM_ALL), addClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty"));
        return a.section != AudioPlaylist.TYPE_RECOM && (delete a.audio_id, a.section && delete a.album_id), n && (e = !1, val(this.searchInputEl, ""), this._muteFilterEvent = !
                0, uiSearch.removeAllFilters(this.searchInputEl), delete a.performer, delete a.lyrics, delete a.sort, this._muteFilterEvent = !1), a.friend || delete cur
            .prevSearchPlaylist, this.isLayer() || nav.setLoc(a), this._prevLoc = a, this.syncFilters(a), this.switchToSection(u, !0), !1
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
        e = AudioUtils.asObject(e), l.innerHTML = e.performer, u.innerHTML = "&ndash; " + e.title, !a.isLayer() && s.getCurrentAudio() && AudioUtils.asObject(s.getCurrentAudio())
            .fullId == e.fullId && (document.title = replaceEntities(stripHTML(e.performer + " - " + e.title)), clearTimeout(window.pageSetTitleTimer))
    }

    function t(e, i) {
        e = AudioUtils.asObject(e);
        var t, o = s.getDurationType(),
            a = intval(e.duration);
        return t = o && 1 != i ? "-" + formatTime(Math.round(a - i * a)) : formatTime(Math.round(i * a))
    }

    function o() {
        if (a._trackSlider) {
            var e = AudioUtils.asObject(a._readyAudio || s.getCurrentAudio()),
                i = e.ownerId != a.options.oid;
            p !== i && (toggle(g, i), p = i), cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {};
            var t = cur._audioAddRestoreInfo[e.fullId];
            addClass(g, "no_transition"), toggleClass(g, "audio_player_btn_added", !(!t || "added" != t.state)), removeClassDelayed(g, "no_transition"), toggleClass(h,
                "audio_page_player_btn_enabled", a.ap.isRepeatCurrentAudio())
        }
    }
    var a = this,
        s = getAudioPlayer(),
        r = this._container,
        d = geByClass1("_audio_page_player", r),
        n = geByClass1("audio_page_player_title", d),
        l = geByClass1("audio_page_player_title_performer", d),
        u = geByClass1("audio_page_player_title_song", d),
        _ = geByClass1("audio_page_player_duration", d),
        c = geByClass1("_audio_page_player_play", d),
        h = geByClass1("_audio_page_player_repeat", d),
        g = geByClass1("_audio_page_player_add", d),
        p = void 0;
    this._trackSlider || (this._trackSlider = new Slider(geByClass1("audio_page_player_track_slider", d), {
        value: s.getCurrentProgress(),
        backValue: s.getCurrentBuffered(),
        size: 1,
        hintClass: "audio_player_hint",
        withBackLine: !0,
        formatHint: function(e) {
            var i = s.getCurrentAudio() || a._readyAudio;
            return i = AudioUtils.asObject(i), formatTime(Math.round(e * i.duration))
        },
        onEndDragging: function(e) {
            s.seek(e)
        }
    }), this._volumeSlider = new Slider(geByClass1("audio_page_player_volume_slider", d), {
        value: s.getVolume(),
        size: 1,
        hintClass: "audio_player_hint",
        formatHint: function(e) {
            return Math.round(100 * e) + "%"
        },
        onChange: function(e) {
            s.setVolume(e)
        }
    }), this.ap.on(this, AudioPlayer.EVENT_START_LOADING, function() {
        a._trackSlider.toggleLoading(!0)
    }), this.ap.on(this, AudioPlayer.EVENT_CAN_PLAY, function() {
        a._trackSlider.toggleLoading(!1)
    }), this.ap.on(this, AudioPlayer.EVENT_ADDED, function(e, i) {
        e = AudioUtils.asObject(e), e && e.fullId == i && addClass(g, "audio_player_btn_added")
    }), this.ap.on(this, AudioPlayer.EVENT_REMOVED, function(e, i) {
        e = AudioUtils.asObject(e), e && e.fullId == i && removeClass(g, "audio_player_btn_added")
    }), this.ap.on(this, AudioPlayer.EVENT_PLAY, function(e, s, r) {
        delete a._readyAudio, data(d, "audio", e), o(), i(e), addClass(c, "audio_playing"), s && !cur.audioStartReadyAudio && (a._trackSlider.setBackValue(0), a._trackSlider
            .setValue(0), _.innerHTML = t(e, 0), n.setAttribute("title", ""), n.titleSet = !1)
    }), this.ap.on(this, AudioPlayer.EVENT_PAUSE, function(e) {
        removeClass(c, "audio_playing")
    }), this.ap.on(this, AudioPlayer.EVENT_BUFFERED, function(e, i) {
        a._trackSlider.setBackValue(i)
    }), this.ap.on(this, AudioPlayer.EVENT_VOLUME, function(e, i) {
        a._volumeSlider.setValue(i)
    }), this.ap.on(this, AudioPlayer.EVENT_UPDATE, function(e, i) {
        e && i && (_.innerHTML = t(e, i))
    }), this.ap.on(this, AudioPlayer.EVENT_PROGRESS, function(e, i) {
        a._trackSlider.setValue(i), _.innerHTML = t(e, i)
    }));
    var y = this.ap.getCurrentAudio() || this._readyAudio;
    y && (domData(d, "audio", JSON.stringify(y)), i(y), toggleClass(c, "audio_playing", this.ap.isPlaying()), _.innerHTML = t(y, 1), e && (this._trackSlider.setValue(0), this._trackSlider
        .setBackValue(0), this._trackSlider.toggleLoading(!1))), o()
}, AudioPage.prototype.scrollToTrack = function(e) {
    var i = this,
        t = this.getCurrentPlaylist(),
        o = this.ap.getCurrentAudio();
    if ((!this.isLayer() || this.getLayer()
            .isShown()) && t && -1 != t.indexOfAudio(o)) {
        this.ap.updateCurrentPlaying();
        var a = geByClass1(AudioUtils.AUDIO_PLAYING_CLS, this._container);
        if (!a) {
            o = AudioUtils.asObject(o);
            for (var s = 100; s-- && (this._autoList.drawMore(), a = geByClass1("_audio_row_" + o.fullId, this._container), !(a || this._autoList.isPendingRows() || this._autoList
                    .isDone())););
        }
        if (a) {
            setTimeout(function() {
                i.ap.updateCurrentPlaying()
            }, 1);
            var r = this.isLayer() ? geByClass1("audio_layer_rows_wrap", this._container) : bodyNode,
                d = this.isLayer() ? r.scrollTop : 0,
                n = this.isLayer() ? getSize(r)[1] : clientHeight(),
                l = this.isLayer() ? getXY(r)[1] : 0,
                u = getXY(a)[1] - l + d,
                _ = getSize(a)[1],
                c = this.isLayer() ? r.scrollTop : scrollGetY();
            if (e || !(c > u || u > c + n)) {
                var h = u - n / 2 + _ / 2;
                i.isLayer() ? (cur.audioCancelMenuScroll = !0, r.scrollTop = h, setTimeout(function() {
                    cur.audioCancelMenuScroll = !0, r.scrollTop = h, i.getLayer()
                        .sb.update(), delete cur.audioCancelMenuScroll
                })) : scrollToY(h, 400)
            }
        }
    }
}, AudioPage.prototype.togglePlayerPlay = function(e) {
    if (this.ap.isPlaying()) this.ap.pause();
    else {
        var i = this.getCurrentPlaylist(),
            t = this.ap.getCurrentPlaylist(),
            o = this.ap.getCurrentAudio(),
            a = this._readyAudio ? this._readyAudio : o;
        if (a = a ? a : i.getAudioAt(0), AudioUtils.isClaimedAudio(a)) {
            a = AudioUtils.asObject(a);
            var s = AudioUtils.getAudioExtra(a),
                r = s.claim;
            return void showAudioClaimWarning(a.ownerId, a.id, r.deleteHash, r.id, a.title)
        }
        var d; - 1 != i.indexOfAudio(a) ? d = i : t && -1 != t.indexOfAudio(a) ? d = t : (d = new AudioPlaylist(AudioPlaylist.TYPE_TEMP, vk.id), d.addAudio(a)), delete this._readyAudio,
            cur.audioStartReadyAudio = !0, this.ap.play(a, d)
    }
};
try {
    stManager.done("audio.js")
} catch (e) {}
