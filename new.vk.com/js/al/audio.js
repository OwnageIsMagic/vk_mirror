function AudioPage(i, t, e, o) {
    if (!(this instanceof AudioPage)) {
        var a = gpeByClass("_audio_layout", i);
        return a ? data(a, "audioPage") : !1
    }
    this._container = ge(i), this._onSilentLoaded = {}, this._restores = {}, this._added = {}, addTemplates({
        audio_row: e.audioRowTpl
    }), this.options = e, cur.canAudioAddToGroup = this.options.canAudioAddToGroup, this._updateAdditionalBlocksAndRightMenu(t), getAudioPlayer(function(a) {
        function s() {
            r.options.isLayer || (nav.curLoc && nav.setLoc(nav.fromStr(nav.curLoc)), nav.objLoc.q && r.onSearchFiltersChanged(nav.objLoc))
        }
        if (this.ap = a, a.langs = e.langs, extend(cur.lang || {}, e.langs), AudioUtils.getPlaylistType(t) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) {
            var l = t.blocks;
            t = a.getCurrentPlaylist(), t.blocks = l, this.layerInitialBlocksPl = t
        } else {
            t = AudioUtils.mergePlaylist(t.id, t), inArray(AudioUtils.getPlaylistType(t), [AudioUtils.AUDIO_PLAYLIST_TYPE_FEED, AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT]) ||
                AudioUtils.isPaginatedPlaylist(t) || !t.has_more || this._loadSilent(t.id);
            var d = a.getCurrentAudio();
            this.readyAudio = d ? d : o, this.readyPlaylistId = t.id
        }
        var r = this;
        a.on(this, AudioPlayer.EVENT_PLAYLIST_CHANGED, function() {
            r._updateLayerBottom()
        }), a.addPlaylist(t), this._initSearch(), this._initScroll(), this.onShow(t), e.exp && (a._statusExport = e.exp, checkbox("currinfo_audio", a.hasStatusExport()),
            delete e.exp, a.updateStatusExportTooltip()), data(i, "audioPage", this), this.options.isLayer || cur.destroy.push(function() {
            a.off(this)
        });
        var r = this;
        t.has_more ? s() : AudioUtils.indexPlaylist(t, s), setTimeout(function() {
            r._initAlbumsSort()
        }, 100)
    }.bind(this))
}
AudioPage.address = "audio", AudioPage.onSearchFocused = function(i) {
    var t = geByClass1("_audio_playlist", gpeByClass("_audio_layout", this));
    toggleClass(t, "audio_search_focused", "focus" == i.type)
}, AudioPage.prototype.playStatusAudio = function(i, t, e) {
    var o = ap.getPlaylist(AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, vk.id, irand(0, 999)));
    o.statusOf = i, o.list = [t], this.ap.play(t, o), cancelEvent(e)
}, AudioPage.prototype._initAlbumsSort = function() {
    if (this.options.albumsReorderHash && !this.options.isLayer) {
        var i = geByClass1("_audio_albums_wrap", this._container);
        if (!i) {
            var t = geByClass("_audio_album_item", this._container);
            t.length && (i = se('<div class="_audio_albums_wrap audio_albums_wrap"></div>'), domInsertBefore(i, t[0]), each(t, function() {
                i.appendChild(this)
            }))
        }
        this._albumsSorter && this._albumsSorter.destroy();
        var e = this;
        this._albumsSorter = new GridSorter(i, !1, {
            limitBottomMove: !0,
            noPosTransform: !0,
            onReorder: function(i, t) {
                var o = i.id.split("_")
                    .pop(),
                    a = t ? t.id.split("_")
                    .pop() : 0;
                ajax.post("al_audio.php", {
                    act: "reorder_albums",
                    aid: o,
                    before: a,
                    hash: e.options.albumsReorderHash,
                    oid: e.options.oid
                }, {
                    onDone: function() {}
                })
            }
        })
    }
}, AudioPage.deleteAlbum = function(i, t) {
    var e = cur.audioPage.options.oid,
        o = showFastBox({
            title: AudioPlayer.getLang("audio_delete_album_title"),
            dark: 1
        }, AudioPlayer.getLang("audio_delete_album_are_you_sure"), AudioPlayer.getLang("audio_delete_album_button"), function(a) {
            ajax.post("al_audio.php", {
                act: "delete_album",
                album_id: i,
                hash: t,
                gid: 0 > e ? -e : !1
            }, {
                showProgress: lockButton.pbind(a),
                hideProgress: unlockButton.pbind(a),
                onDone: function(t, o) {
                    try {
                        boxQueue.hideAll(), re(geByClass1("_ui_item_audio_album_" + e + "_" + i)), nav.go("/audios" + e)
                    } catch (a) {}
                },
                onFail: function() {
                    o.hide(200)
                }
            })
        }, getLang("global_cancel"))
}, AudioPage.saveAlbum = function(i, t, e) {
    var o = val("album_name");
    if (!o) return notaBene("album_name"), !1;
    var a = curBox(),
        s = cur.audioPage.options.oid,
        l = !e,
        d = {
            act: "save_album",
            album_id: e,
            name: o,
            gid: 0 > s ? -s : 0,
            Audios: i.join(","),
            hash: cur.audioPage.options.saveAlbumHash
        };
    return ajax.post("al_audio.php", d, {
        showProgress: lockButton.pbind(t),
        hideProgress: unlockButton.pbind(t),
        onFail: a.hide,
        onDone: function(t, o, a, d) {
            var r = getAudioPlayer()
                .getPlaylist(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, s, t);
            r.list = d, r.total = d.length, r.has_more = !1, AudioUtils.indexPlaylist(r);
            var n = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS, s, "a" + e);
            getAudioPlayer()
                .deletePlaylist(n), each(i, function(i, e) {
                    var o = {};
                    o[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] = t, getAudioPlayer()
                        .updateAudio(s + "_" + e, o)
                });
            var u = geByClass1("ui_rmenu", cur.audioPage._container),
                _ = domPN(u);
            _.replaceChild(se(a), u), cur.audioPage._initAlbumsSort(), curBox()
                .hide(), setTimeout(function() {
                    if (l) nav.go("/audios" + s + "?album_id=" + t);
                    else if (cur.audioPage) {
                        var i = cur.audioPage.getCurrentPlaylist();
                        AudioUtils.getPlaylistAlbumId(i.id) == e && cur.audioPage.refreshCurrentSection()
                    }
                }, 200)
        }
    }), !1
}, AudioPage.filterByAlbum = function(i, t) {
    for (var e = i.length, o = [], a = 0; e > a; a++) {
        var s = i[a];
        t == s[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] && o.push(s)
    }
    return o
}, AudioPage.showActionTooltip = function(i, t) {
    showTooltip(i, {
        text: t,
        black: 1,
        shift: [11, 9, 0]
    })
}, AudioPage.prototype.createAlbum = function(i) {
    return this.editAlbum(0)
}, AudioPage.prototype.editAlbum = function(i, t, e) {
    var o = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, this.options.oid, AudioUtils.AUDIO_ALBUM_ID_ALL),
        a = this.ap.getPlaylist(o),
        s = this,
        l = t ? gpeByClass("_audio_album_btns", t) : null;
    l && (addClass(l, "in_progress"), showProgress(l)), this._addOnSilentLoaded(o, function(t) {
        l && (removeClass(l, "in_progress"), hideProgress(l));
        showTabbedBox("al_audio.php", {
            act: "edit_album_box",
            album_id: i || 0,
            oid: s.options.oid
        }, {
            stat: ["privacy.js", "privacy.css", "ui_controls.js", "ui_controls.css", "indexer.js"],
            dark: 1
        })
    }), this._loadSilent(a), cancelEvent(e)
}, AudioPage.prototype.onHide = function() {
    var i = this;
    cur.nav = cur.nav.filter(function(t) {
        return i._nav_func != t
    })
}, AudioPage.prototype.showRecoms = function(i, t, e) {
    if (!t) {
        var o = this.readyAudio ? this.readyAudio : this.ap.getCurrentAudio();
        t = AudioUtils.audioObject(o)
            .fullId
    }
    return nav.go({
        0: nav.objLoc[0],
        section: "recoms",
        audio_id: t
    }), cancelEvent(e)
}, AudioPage.prototype.showAlbumRecoms = function(i, t, e, o) {
    return nav.go({
        0: nav.objLoc[0],
        section: "recoms",
        album_id: o
    }), cancelEvent(t)
}, AudioPage.prototype.onShow = function(i) {
    this._initNavigation(), val(this.searchInputEl, ""), uiSearch.removeAllFilters(this.searchInputEl), setTimeout(elfocus.pbind(this.searchInputEl), 10), this.switchToSection(
        i), this._initPlayer(), this.options.isLayer && setTimeout(function() {
        var i = geByClass1("_audio_rows_header", this._container);
        setStyle(i, "width", getSize(geByClass1("_audio_rows", this._container))[0] - 1), this.options.layerScrollbar.widthUpdated()
    }.bind(this)), this.ap.updateStatusExportTooltip(), this.scrollToTrack()
}, AudioPage.prototype.onAudioUploaded = function(i, t) {
    var e = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, this.options.oid, AudioUtils.AUDIO_ALBUM_ID_ALL),
        o = this.ap.getPlaylist(e);
    o.list.unshift(t), o.total += 1, AudioUtils.indexPlaylist(o);
    var a = this.ap.getCurrentPlaylist();
    a && a.originalId == e && (a.list.unshift(t), a.total += 1), this._updateRowsList(o)
}, AudioPage.prototype.uploadAudio = function(i) {
    return this.options.uploadBanned ? void setTimeout(showFastBox({
            title: AudioPlayer.getLang("audio_no_upload_title"),
            bodyStyle: "padding: 20px; line-height: 160%;",
            dark: 1
        }, AudioPlayer.getLang("audio_claims_no_upload"))
        .hide, 5e3) : void showBox("al_audio.php", extend(i || {}, {
        act: "new_audio",
        gid: this.options.oid < 0 ? -this.options.oid : 0
    }), {
        params: {
            width: "450px",
            bodyStyle: "padding: 0px; position: relative;"
        },
        dark: 1
    })
}, AudioPage.prototype.editAudio = function(i, t, e) {
    return showBox("al_audio.php", {
        act: "edit_audio_box",
        aid: t
    }, {
        params: {
            width: "456px",
            bodyStyle: "padding: 20px; background-color: #F7F7F7;",
            hideButtons: 1
        },
        dark: 1
    }), e && cancelEvent(e), !1
}, AudioPage.prototype.showActionTooltip = function(i, t, e) {
    if (!this._addRestoreInProgress) {
        switch (e) {
            case "delete":
                var o = this._restores[t];
                e = o && o.deleteAll ? o.deleteAll.text : AudioPlayer.getLang("audio_delete_audio");
                break;
            case "add":
                var o = this._restores[t];
                e = o ? AudioPlayer.getLang("audio_restore_audio") : this.options.oid < 0 && this.options.canAddToGroup ? AudioPlayer.getLang("audio_add_to_group") :
                    AudioPlayer.getLang("audio_add_to_audio");
                break;
            case "edit":
                e = AudioPlayer.getLang("audio_edit_audio")
        }
        showTooltip(i, {
            text: function() {
                return e
            },
            black: 1,
            shift: [15, 10, 0]
        })
    }
}, AudioPage.prototype.hideRecommendation = function(i) {
    var t = AudioUtils.audioObject(this.ap.getCurrentAudio());
    t && t.fullId == domData(i, "full-id") && this.ap.playNext();
    var e = domData(i, "q"),
        o = domData(i, "toggle-recom-hash"),
        a = {
            act: "hide_recommendation",
            q: e,
            hash: o
        };
    nav.objLoc.audio_id && (a.recommendation_type = "query"), nav.objLoc.album_id && (a.recommendation_type = "album"), ajax.post("al_audio.php", a), cur._audioAddRestoreInfo[
        domData(i, "full-id")] = {
        state: "recom_hidden"
    }
}, AudioPage.prototype.restoreRecommendation = function(i) {
    var t = AudioUtils.audioObject(this.ap.getCurrentAudio());
    t && t.fullId == domData(i, "full-id") && this.ap.playNext();
    var e = domData(i, "q"),
        o = domData(i, "toggle-recom-hash"),
        a = {
            act: "restore_recommendation",
            q: e,
            hash: o,
            aid: domData(i, "full-id")
        };
    nav.objLoc.audio_id && (a.recommendation_type = "query"), nav.objLoc.album_id && (a.recommendation_type = "album"), ajax.post("al_audio.php", a)
}, AudioPage.prototype.deleteAudio = function(i, t, e) {
    if (!cur._addRestoreInProgress) {
        cur._addRestoreInProgress = !0, window.tooltips && tooltips.hideAll();
        var o = gpeByClass("_audio_row", i),
            a = t.split("_"),
            s = vk.audioParams.deleteHash;
        return cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {}, hasClass(o, "recoms") ? (addClass(o, "audio_deleted"), this.hideRecommendation(o), cur._addRestoreInProgress = !
            1, cancelEvent(e)) : (addClass(o, "audio_deleted"), addClass(o, "canadd"), removeClass(o, "canedit"), ajax.post("al_audio.php", {
            act: "delete_audio",
            oid: a[0],
            aid: a[1],
            hash: s,
            restore: 1
        }, {
            onDone: function(i, e) {
                cur._addRestoreInProgress = !1, cur._audioAddRestoreInfo[t] = {
                    state: "deleted",
                    deleteAll: i,
                    deleteConfirmMsg: e
                }
            }
        }), cancelEvent(e))
    }
}, AudioPage.addAudio = function(i) {
    function t() {
        return hasClass(o, "audio_add_in_progress")
    }

    function e(i) {
        toggleClass(o, "audio_add_in_progress", i)
    }
    var o = gpeByClass("_audio_row", i),
        a = domData(o, "id"),
        s = domData(o, "owner-id"),
        l = s + "_" + a,
        d = AudioPage(i),
        r = vk.audioParams.addHash,
        n = vk.audioParams.deleteHash,
        u = d && d.options.canAudioAddToGroup;
    if (hasClass(o, "recoms") && hasClass(o, "audio_deleted")) return removeClass(o, "audio_deleted"), d.restoreRecommendation(o), void(window.tooltips && tooltips.hideAll());
    if (!t()) {
        if (e(!0), d && d._restores[l]) delete d._restores[l], ajax.post("al_audio.php", {
            act: "restore_audio",
            oid: s,
            aid: a,
            hash: r
        }, {
            onDone: function() {
                e(!1)
            }
        }), removeClass(o, "audio_deleted"), removeClass(o, "canadd"), addClass(o, "canedit");
        else if (hasClass(o, "added")) {
            a = domData(o, "added-aid"), s = domData(o, "added-aoid"), o.id = "audio_" + domData(o, "owner-id") + "_" + domData(o, "id"), domData(o, "added-aid", ""), ajax.post(
                "al_audio.php", {
                    act: "delete_audio",
                    oid: s,
                    aid: a,
                    hash: n
                }, {
                    onDone: function() {
                        if (d) {
                            var i = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL),
                                t = d.ap.getPlaylist(i);
                            t.list.shift(), t.total -= 1, AudioUtils.indexPlaylist(t)
                        }
                        e(!1)
                    }
                }), removeClass(o, "added"), addClass(o, "canadd");
            var _ = geByClass("_audio_add_btn");
            each(_, function() {
                domData(this, "audio-id") == s + "_" + a && (removeClass(this, "audio_player_btn_added"), domData(this, "audio-id", domData(this, "prev-audio-id")))
            })
        } else {
            var h = d && d.options.oid < 0 && u ? -d.options.oid : 0;
            ajax.post("al_audio.php", {
                act: "add",
                gid: h,
                oid: s,
                aid: a,
                hash: r
            }, {
                onDone: function(i, t, l, r) {
                    if (domData(o, "added-aid", i[AudioUtils.AUDIO_ITEM_INDEX_ID]), domData(o, "added-aoid", i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID]), d) {
                        var n = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, h ? -h : vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL),
                            u = d.ap.getPlaylist(n);
                        u.list.unshift(i), u.total += u.has_more ? 0 : 1, AudioUtils.indexPlaylist(u), o.id = "audio_" + i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] +
                            "_" + i[AudioUtils.AUDIO_ITEM_INDEX_ID]
                    }
                    var _ = geByClass("_audio_add_btn");
                    each(_, function() {
                        domData(this, "audio-id") == s + "_" + a && (addClass(this, "audio_player_btn_added"), domData(this, "prev-audio-id", s + "_" + a),
                            domData(this, "audio-id", i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + i[AudioUtils.AUDIO_ITEM_INDEX_ID]))
                    }), e(!1)
                }
            }), removeClass(o, "canadd"), addClass(o, "added")
        }
        window.tooltips && tooltips.hideAll()
    }
}, AudioPage.prototype.toggleAudioDurationType = function() {
    this.ap.toggleDurationType()
}, AudioPage.prototype._updateShuffleButton = function(i) {
    toggleClass(geByClass1("_audio_shuffle_btn", this._container), "audio_enabled", !!i.shuffle)
}, AudioPage.prototype.toggleRepeat = function(i) {
    var t = toggleClass(i, "audio_enabled");
    this.ap.toggleRepeatCurrentAudio(t)
}, AudioPage.prototype.toggleShuffle = function(i) {
    var t = this.getCurrentPlaylist(),
        e = this.ap.getCurrentPlaylist();
    t.shuffle ? (removeClass(i, "audio_enabled"), this.ap.restoreShufflePlaylist(t)) : (addClass(i, "audio_enabled"), this.ap.shufflePlaylist(t)), e && e.originalId == t.id &&
        this.ap.setCurrentPlaylist(t);
    var o = this;
    this._updateRowsList(t, function(i) {
        i ? uiRightMenu.showProgress(o._getMenuEl()) : (uiRightMenu.hideProgress(o._getMenuEl()), AudioUtils.updateCurrentPlaying())
    })
}, AudioPage.onFilterRemoved = function(i, t) {
    var e = AudioPage(t);
    switch (i) {
        case "performer":
            var o = "audio_search_type_" + intval(e.options.isLayer),
                a = window.radioBtns[o];
            radiobtn(a.els[0], 0, o);
            break;
        case "sort":
            var s = e._searchSortFilter.options.defaultItems[0][0];
            e._searchSortFilter.selectItem(s, !1);
            break;
        case "lyrics":
            removeClass(geByClass1("_audio_fltr_with_lyrics", e._container), "on")
    }
    e.onSearchFiltersChanged()
}, AudioPage.prototype.syncFilters = function(i) {
    var t = "audio_search_type_" + intval(this.options.isLayer),
        e = window.radioBtns[t];
    radiobtn(e.els[i.performer ? 1 : 0], !!i.performer, t);
    var o = i.sort;
    o || (o = this._searchSortFilter.options.defaultItems[0][0]), toggleClass(geByClass1("_audio_fltr_with_lyrics", this._container), "on", !!i.lyrics);
    var a = {
        performer: AudioPlayer.getLang("audio_performers_only"),
        lyrics: AudioPlayer.getLang("audio_search_with_text"),
        sort: AudioPlayer.getLang("audio_search_by_length")
    };
    this._muteFilterEvent = !0;
    var s = this;
    each(["performer", "lyrics", "sort"], function(t, e) {
        uiSearch.toggleFilter(s.searchInputEl, e, a[e], !!i[e])
    }), this._muteFilterEvent = !1
}, AudioPage.prototype.onSearchFiltersChanged = function(i) {
    if (!this._muteFilterEvent) {
        var t = window.radioBtns["audio_search_type_" + intval(this.options.isLayer)],
            e = intval(this._searchSortFilter.selectedItems()[0][0]),
            o = {
                performer: t.val ? 1 : null,
                lyrics: hasClass(geByClass1("_audio_fltr_with_lyrics", this._container), "on") ? 1 : null,
                sort: e ? 1 : null
            };
        nav.change(i && isObject(i) ? i : o, !1, {
            fromSearch: !0,
            filtersChanged: !0
        })
    }
}, AudioPage.prototype._initSearch = function() {
    var i = geByClass1("_audio_search_input", this._container);
    this.searchInputEl = geByClass1("_field", i), uiSearch.init(i), window.radioBtns["audio_search_type_" + intval(this.options.isLayer)] = {
        els: geByClass("_audio_search_type", this._container),
        keep: !0
    }, this._searchSortFilter = new Dropdown(geByClass1("_audio_fltr_sort", this._container), this.options.sortFilters, {
        big: 1,
        zeroPlaceholder: !0,
        onChange: this.onSearchFiltersChanged.bind(this)
    });
    var t = this;
    new Suggester(this.searchInputEl, {
            section: "audio",
            sidePadding: "47px",
            onSelect: function(i) {
                val(t.searchInputEl, i[3])
            },
            onChoose: function(i) {
                val(t.searchInputEl, i[3]), t.searchAudios(i[3])
            }
        }), this.toggleSearchProgress = debounce(this.toggleSearchProgress, 100)
        .bind(this)
}, AudioPage.searchAudios = function(i) {
    AudioPage(this)
        .searchAudios(i)
}, AudioPage.prototype.searchAudios = function(i) {
    i = trim(i), nav.change(extend({
        q: i ? i : !1
    }), !1, {
        fromSearch: !0,
        q: i
    })
}, AudioPage.searchMoreFriends = function(i) {
    AudioPage(this)
        .searchMoreFriends(i)
}, AudioPage.prototype._updateFriendsList = function(i, t, e) {
    if (i = trim(i)) {
        var o = this,
            a = geByClass1("_audio_friends_list", this._container),
            s = (getSize(a)[1], se('<div class="audio_friends_list _audio_friends_list" style="opacity: 0; position: absolute; top: 0;">' + i + "</div>"));
        e && (this._shownFriends = []), domPN(a)
            .appendChild(s), setTimeout(function() {
                setStyle(s, {
                    opacity: 1
                })
            }), setTimeout(function() {
                re(a), setStyle(s, {
                    position: "relative"
                }), o._friendSearchInProgress = !1
            }, 160)
    }
}, AudioPage.prototype.searchMoreFriends = function(i) {
    this._friendSearchInProgress || (this._friendSearchInProgress = !0, ajax.post("al_audio.php", {
        act: "search_friends",
        str: i
    }, {
        onDone: this._updateFriendsList.bind(this)
    }))
}, AudioPage.prototype.showMoreFriends = function(i, t) {
    if (!this._friendSearchInProgress) {
        this._friendSearchInProgress = !0, this._shownFriends = this._shownFriends || [];
        var e = this;
        each(geByClass("_audio_friend", this._container), function() {
            e._shownFriends.push(domData(this, "id"))
        }), ajax.post("al_audio.php", {
            act: "more_friends",
            exclude: t ? !1 : this._shownFriends.join(","),
            owner: t
        }, {
            showProgress: i ? lockButton.pbind(i) : !1,
            hideProgress: i ? unlockButton.pbind(i) : !1,
            onDone: this._updateFriendsList.bind(this)
        })
    }
}, AudioPage.prototype.playUsersNow = function(i, t) {}, AudioPage.prototype.catalogShowMorePerformers = function(i) {
    var t = [],
        e = geByClass1("_audio_catalog_performers", gpeByClass("_audio_additional_block", i)),
        o = domData(e, "genre");
    each(geByClass("_audio_catalog_performer", e), function() {
        t.push(domData(this, "performer-id"))
    }), ajax.post("al_audio.php", {
        act: "get_more_performers",
        offset: 4,
        exclude: t.join(","),
        genre: o
    }, {
        onDone: function(t) {
            e.appendChild(se("<div>" + t + "</div>")), re(i)
        },
        showProgress: lockButton.pbind(i),
        hideProgress: unlockButton.pbind(i)
    })
}, AudioPage.prototype.showStatusTooltip = function(i) {
    this.statusTT || (this.statusTT = !0, ajax.post("al_audio.php", {
        act: "status_tt"
    }, {
        onDone: function(t, e) {
            this.statusTT = new ElementTooltip(i, {
                offset: [0, 3],
                content: e,
                showImmediate: !!cur._onStatusExportBtn,
                width: 300,
                id: "audio_status_tt",
                onFirstTimeShow: function(i) {
                    this.sb = new Scrollbar(geByClass1("audio_status_wrap", i), {
                        top: 0,
                        global: !0,
                        nokeys: !0
                    })
                }
            })
        }.bind(this)
    }))
}, AudioPage.prototype._initSorter = function(i) {
    function t(i, t, e) {
        var o = domData(i, "full-id"),
            s = domData(t, "full-id"),
            d = domData(e, "full-id");
        if (a.options.isLayer) {
            var r = AudioUtils.findAudioInPlaylist(o, l)[1],
                n = s ? AudioUtils.findAudioInPlaylist(s, l)[1] : l.list.length - 1,
                u = l.list.splice(r, 1);
            if (l.list.splice(n, 0, u[0]), l.originalId = !1, a.ap.isPlaying()) {
                var _ = a.ap.getCurrentAudio();
                a.ap.play(_, l)
            }
        } else {
            var h = a.ap.getCurrentPlaylist();
            if (h.originalId == l.id) {
                var c = a.ap.getAudioPlaylistPosition(o, h),
                    p = a.ap.getAudioPlaylistPosition(s || d, h);
                if (c >= 0 && p >= 0) {
                    var u = h.list.splice(c, 1);
                    p = a.ap.getAudioPlaylistPosition(s || d, h), h.list.splice(s ? p : p + 1, 0, u[0])
                }
            }
            o = o.split("_")[1], s = s ? s.split("_")[1] : "", d = d ? d.split("_")[1] : "", ajax.post("al_audio.php", {
                act: "reorder_audios",
                oid: a.options.oid,
                aid: intval(o),
                before: intval(s),
                after: intval(d),
                hash: a.options.reorderHash
            }, {
                onDone: function() {}
            })
        }
    }

    function e(i) {
        var t = i.id.split("_");
        return t[t.length - 1]
    }
    var o = geByClass1("_audio_playlist", this._container);
    this._sorter && !this._sorter.isCurrentlyDragging() && (this._sorter.destroy(), this._sorter = !1);
    var a = this,
        s = !1,
        l = this.getCurrentPlaylist(),
        d = AudioUtils.getPlaylistAlbumId(l);
    if (this.options.isLayer ? (l = this.ap.getPlaylist(l.id), s = AudioUtils.getPlaylistType(l) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) : s = this.options.reorderHash &&
        inArray(AudioUtils.getPlaylistType(l), [AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM]), s && !this._sorter) {
        var r = this.options.isLayer ? {} : {
            onDragOverElClass: "_audio_album_item",
            onDragEnter: function(i, t) {
                var o = e(i);
                o != d && (addClass(t, "audio_item_drag_over_album"), addClass(i, "audio_album_drop"))
            },
            onDragLeave: function(i, t) {
                removeClass(t, "audio_item_drag_over_album"), removeClass(i, "audio_album_drop")
            },
            onDragDrop: function(i, t) {
                removeClass(t, "audio_item_drag_over_album"), removeClass(i, "audio_album_drop");
                var o = e(i),
                    s = domData(t, "id");
                if (o == d) return !0;
                ajax.post("al_audio.php", {
                    act: "a_move_to_album",
                    album_id: o,
                    audio_id: s,
                    hash: a.options.moveHash,
                    gid: a.options.oid < 0 ? -a.options.oid : null
                });
                var l = domData(t, "full-id"),
                    r = a.getCurrentPlaylist(),
                    n = AudioUtils.findAudioInPlaylist(l, r);
                AudioUtils.getPlaylistAlbumId(r) != AudioUtils.AUDIO_ALBUM_ID_ALL && -1 != n[1] ? (r.list.splice(n[1], 1), r.total -= 1, setTimeout(function() {
                    a.switchToSection(r)
                })) : a.ap.deletePlaylist(AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, a.options.oid, o));
                var u = {};
                return u[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] = o, a.ap.updateAudio(l, u), !0
            }
        };
        this._sorter = new GridSorter(o, extend({
            onReorder: t,
            wrapNode: this.options.isLayer ? geByClass1("audio_layer_rows_wrap", this._container) : !1,
            dragCls: "audio_item_drag"
        }, r)), this._sorter.plId = i.id
    }
}, AudioPage.prototype._initAutoList = function(i, t, e) {
    function o(i) {
        each(geByClass("_audio_row", i), function() {
            d.ap.toggleCurrentAudioRow(this, !1, !0)
        }), i.innerHTML = ""
    }

    function a(i) {
        if (d.options.isLayer) {
            var t = geByClass1("_audio_playlist", d._container);
            if (i) return void setStyle(t, "padding-bottom", null);
            var e = getSize(t)[1],
                o = getSize(geByClass1("audio_layer_rows_wrap", d._container))[1] - 75,
                a = getSize(geByClass1("audio_layer_menu_wrap", d._container))[1],
                s = Math.max(o, a);
            s > e ? setStyle(t, "padding-bottom", s - e) : setStyle(t, "padding-bottom", null)
        }
    }
    var s = geByClass1("_audio_playlist", this._container),
        l = geByClass1("_ui_audio_load_more", this._container),
        d = this,
        r = 50;
    this._autoList && this._autoList.destroy(), this._waitForPlaylistId = i.id;
    var n = !!i.list.length || !i.has_more,
        u = AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH,
        _ = u && 0 == i.localFoundTotal,
        h = AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_FEED;
    n ? o(s) : e && e(!0);
    var c = 0;
    this._autoList = new AutoList(s, {
        isLayer: this.options.isLayer,
        scrollNode: this.options.isLayer ? geByClass1("audio_layer_rows_wrap", this._container) : window,
        renderImmediate: !0,
        showProgress: lockButton.pbind(l),
        hideProgress: unlockButton.pbind(l),
        rowClass: "_audio_row audio_feed_post",
        onNoMore: function() {
            hide(l), d._updateEmptyPlaceholder(i)
        },
        onHasMore: function() {
            u && i.list.length < AudioUtils.AUDIO_ENOUGH_LOCAL_SEARCH_RESULTS || (d._updateEmptyPlaceholder(i), show(l))
        },
        onRendered: function() {
            e && e(!1), AudioUtils.updateCurrentPlaying(!0), 0 == c ? (a(), d._scrollListTO = setTimeout(function() {
                var i = d.options.isLayer ? geByClass1("audio_layer_rows_wrap", d._container) : bodyNode;
                i.scrollTop = 0, d.options.isLayer && d.options.layerScrollbar.update()
            }, 10)) : d.options.isLayer && d.options.layerScrollbar.update()
        },
        onNeedRows: function(e, p, g) {
            function A(i) {
                if (i && i.id == d._waitForPlaylistId) {
                    if (n || 0 != p || o(s), u && 1 == g && (d._updateAdditionalBlocksAndRightMenu(i), _ && (p = 0)), h) P = i.items.slice(p, p + r);
                    else {
                        y = i.list.slice(p, p + r);
                        var l = !1;
                        if (u) {
                            var c = i.searchParams.q;
                            c += " " + (parseLatin(c) || ""), c = trim(c.replace(/\)/g, "")
                                .replace(/&/, "&amp;")), l = new RegExp("(\\s|^)(" + c.replace(vkIndexer.delimiter, "|")
                                .replace(/(^\||\|$|\?)/g, "") + ")", "gi")
                        }
                        each(y, function(t, e) {
                            if (u && p + t == i.localFoundTotal) {
                                var o = 0 == i.localFoundTotal ? "audio_first" : "";
                                P.push('<h3 class="' + o + '">' + langNumeric(i.total, ap.langs.audio_global_search_found, !0) + "</h3>")
                            }
                            e = clone(e), e[AudioUtils.AUDIO_ITEM_INDEX_TITLE] = e[AudioUtils.AUDIO_ITEM_INDEX_TITLE].replace(l, "$1<em>$2</em>"), e[
                                AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] = e[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER].replace(l, "$1<em>$2</em>"), P.push(
                                AudioUtils.drawAudio(e))
                        }), _ && (t.innerHTML = "", _ = !1)
                    }
                    if (P.length && a(!0), e(P), !p && !d.options.isLayer) {
                        var A = i.name || document.title;
                        document.title = replaceEntities(A.replace(/(<em>|<\/em>|<strong>|<\/strong>)/g, ""))
                    }
                }
            }
            var y, P = [];
            c = p, AudioUtils.isPaginatedPlaylist(i) ? (u && 0 == g && i.list.length < AudioUtils.AUDIO_ENOUGH_LOCAL_SEARCH_RESULTS && hide(l), d._loadMorePaginatedPlaylist(
                i, g,
                function(i) {
                    A(i)
                })) : 0 == p && i.list.length ? A(i) : (d._addOnSilentLoaded(i.id, function(i) {
                A(i)
            }), d._loadSilent(i))
        }
    }), cur.destroy.push(function() {
        this._autoList && this._autoList.destroy()
    }.bind(this))
}, AudioPage.prototype.destroy = function() {
    this._trackSlider.destroy(), this._volumeSlider.destroy(), removeEvent(window, "scroll", this._ev_onScroll)
}, AudioPage.prototype.getCurrentPlaylist = function() {
    var i = geByClass1("_audio_playlist", this._container),
        t = domData(i, "pl-id"),
        e = this.ap.getPlaylist(t);
    return e
}, AudioPage.prototype._loadSilent = function(i, t) {
    var i = isObject(i) ? i : this.ap.getPlaylist(i),
        e = this,
        o = this.getCurrentPlaylist();
    if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) return void AudioUtils.indexPlaylist(i, function() {
        e._callOnSilentLoaded(i)
    });
    if (i.has_more) {
        if ((t || AudioUtils.getPlaylistType(o) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH) && this.toggleSearchProgress(!0), this._silentLoading = this._silentLoading || {},
            this._silentLoading[i.id]) return;
        this._silentLoading[i.id] = !0, ajax.post("al_audio.php", {
            act: "a_load_silent",
            playlist: i.id,
            offset: i.list.length,
            pop_band: intval(i.pop_band)
        }, {
            onDone: function(t) {
                e.toggleSearchProgress(!1), e._silentLoading[i.id] = !1, i = AudioUtils.mergePlaylist(i.id, t), i.shuffle && e.ap.shufflePlaylist(i), AudioUtils.indexPlaylist(
                    i,
                    function() {
                        e._callOnSilentLoaded(i)
                    })
            }
        })
    }
}, AudioPage.prototype._addOnSilentLoaded = function(i, t) {
    var e = this.ap.getPlaylist(i);
    if (!e.has_more) return void t(e);
    var o = "" + t;
    this._onSilentLoaded[e.id] = (this._onSilentLoaded[e.id] || [])
        .filter(function(i) {
            return "" + i != o
        }), this._onSilentLoaded[e.id].push(t)
}, AudioPage.prototype._callOnSilentLoaded = function() {
    var i = Array.prototype.slice.call(arguments),
        t = i[0];
    if (this._onSilentLoaded && this._onSilentLoaded[t.id]) {
        var e = this._onSilentLoaded[t.id] || [];
        this._onSilentLoaded[t.id] = [];
        var o = this;
        each(e, function(t, e) {
            e.apply(o, i)
        })
    }
}, AudioPage.prototype._initScroll = function() {
    if (this.options.isLayer) {
        var i = geByClass1("audio_layer_menu_wrap", this._container),
            t = geByClass1("audio_layer_rows_wrap", this._container),
            e = geByClass1("audio_rows_header", this._container),
            o = t.scrollTop,
            a = 0,
            s = getSize(e),
            l = this;
        vkNow();
        return setStyle(e, {
            width: s[0]
        }), void addEvent(t, "scroll", this._ev_onScroll = function(d) {
            var r = (getSize(i)[1], getSize(t)[1], t.scrollTop - o);
            o = t.scrollTop, a -= r, a = Math.max(getSize(t)[1] - getSize(i)[1], a), a = Math.min(0, a), setStyle(i, "top", a);
            var n = geByClass1("_audio_padding_cont", l._container);
            t.scrollTop > 0 ? (setStyle(n, {
                "padding-top": s[1]
            }), addClass(e, "fixed")) : (setStyle(n, {
                "padding-top": null
            }), removeClass(e, "fixed"))
        })
    }
    var l = this,
        d = geByClass1("_audio_rows_header", this._container),
        r = getSize(d)[1],
        n = domPN(d),
        u = getSize(n)[0],
        _ = getSize(ge("page_header_cont"))[1];
    setStyle(d, {
        width: u,
        top: _
    });
    var h = getXY(n)[1];
    addEvent(window, "scroll", this._ev_onScroll = function() {
        scrollGetY() >= h - _ ? (addClass(d, "fixed"), setStyle(n, {
            "padding-top": r,
            "z-index": 2
        })) : (removeClass(d, "fixed"), setStyle(n, {
            "padding-top": null
        }))
    }), this.options.isLayer || cur.destroy.push(function() {
        removeEvent(window, "scroll", l._ev_onScroll)
    })
}, AudioPage.prototype._updateRowsList = function(i, t) {
    if (i) {
        var e = geByClass1("_audio_playlist", this._container),
            o = (geByClass1("_ui_load_more_btn", this._container), this);
        this._initAutoList(i, e, function(a) {
            a || (domData(e, "pl-id", i.id), domData(e, "pl-name", i.name), domData(e, "pl-page", 0), o._initSorter(i)), t && t(a)
        }), this._updateLayerBottom(), this.options.isLayer || scrollToTop(0)
    }
}, AudioPage.prototype.toggleSearchProgress = function(i) {
    var t = geByClass1("ui_search_fltr_control", this._container),
        e = geByClass1("ui_search_fltr", e);
    hideProgress(e), i && showProgress(e), hasClass(t, "shown") || toggleClass(gpeByClass("_wrap", this.searchInputEl), "ui_search_loading", i)
}, AudioPage.prototype.refreshCurrentSection = function() {
    var i = this.getCurrentPlaylist();
    this.switchToSection(i.id)
}, AudioPage.prototype.switchToSearchSection = function(i) {
    var t = this.ap.getPlaylist(AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, this.options.oid, AudioUtils.AUDIO_ALBUM_ID_ALL)),
        e = this;
    this._addOnSilentLoaded(t, function(t) {
        i.has_more && !i.list.length && (i.list = t.index.search(i.searchParams.q), i.localFoundTotal = i.list.length), e._updateRowsList(i)
    }), this._loadSilent(t, !0)
}, AudioPage.prototype._normalizePlaylistId = function(i) {
    return AudioUtils.getPlaylistType(i) + "_" + AudioUtils.getPlaylistOwner(i) + "_" + parseInt(AudioUtils.getPlaylistAlbumId(i))
}, AudioPage.prototype.switchToSection = function(i, t) {
    if (isObject(i) && (i = i.id), !i) {
        var e = this.ap.getCurrentPlaylist();
        i = e ? e.id : AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL)
    }
    this._renderedPlaylistId = i;
    var o = this.ap.getPlaylist(i),
        a = this;
    AudioUtils.getPlaylistType(o) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH ? this.switchToSearchSection(o) : (this._updateShuffleButton(o), this._updateRowsList(o, function(i) {
        if (i) {
            var e = a._normalizePlaylistId(o),
                s = geByClass1("_ui_item_audio_" + e, a._getMenuEl());
            if (!s) switch (AudioUtils.getPlaylistType(o)) {
                case AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR:
                    s = geByClass1("_ui_item_audio_popular_" + a.options.oid, a._getMenuEl());
                    break;
                case AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS:
                    s = geByClass1("_ui_item_audio_recoms_" + a.options.oid, a._getMenuEl());
                    break;
                case AudioUtils.AUDIO_PLAYLIST_TYPE_FEED:
                    s = geByClass1("_ui_item_audio_feed_" + a.options.oid, a._getMenuEl())
            }
            s ? (uiRightMenu.switchMenu(s), uiRightMenu.showProgress(s)) : uiRightMenu.unselectAll(a._getMenuEl())
        } else unlockButton(geByClass1("audio_more_friends_btn")), a._hideMenuItemProgress(), a._updateAdditionalBlocksAndRightMenu(o, t), a._updateEmptyPlaceholder(
            o), AudioUtils.updateCurrentPlaying(!0)
    })), this.options.isLayer && toggleClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty", !val(this.searchInputEl))
}, AudioPage.prototype._getForeignTogglerEl = function() {
    return geByClass1("_ui_toggler", geByClass1("_audio_foreign_filter_block", this._getMenuEl()))
}, AudioPage.prototype.toggleForeign = function() {
    var i = this._getForeignTogglerEl(),
        t = toggleClass(i, "on"),
        e = this.getCurrentPlaylist(),
        o = parseInt(AudioUtils.getPlaylistAlbumId(e)),
        a = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR, vk.id, o + (t ? "f" : ""));
    this.ap.getPlaylist(a);
    this.switchToSection(a)
}, AudioPage.prototype._updateEmptyPlaceholder = function(i) {
    var t = geByClass1("_audio_empty_placeholder ", this._container);
    if (i.list.length || (i.items ? i.items.length : 0)) hide(t);
    else {
        show(t);
        var e = "",
            o = AudioUtils.getPlaylistType(i);
        e = o == AudioUtils.AUDIO_ALBUM_ID_ALL ? AudioPlayer.getLang("audio_no_rec_load_msg") : o == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH ? AudioPlayer.getLang(
                "audio_no_audios_found")
            .replace("{query}", clean(i.searchParams.q)) : o == AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS ? 0 == AudioUtils.getPlaylistAlbumId(i) ? AudioPlayer.getLang(
                "audio_no_recs_found") : AudioPlayer.getLang("audio_no_audio_recs_found") : AudioPlayer.getLang("audio_album_no_recs"), val(t, e), this._updateAdditionalBlocksAndRightMenu(
                i)
    }
}, AudioPage.prototype._updateAdditionalBlocksAndRightMenu = function(i, t) {
    var e = this,
        o = AudioUtils.getPlaylistType(i),
        a = this._getMenuEl(),
        s = null;
    switch (o) {
        case AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT:
            s = geByClass1("_ui_item_audio_current_" + vk.id, a);
            break;
        case AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS:
            var l = AudioUtils.getPlaylistOwner(i);
            s = geByClass1("_ui_item_audio_recoms_" + l, a);
            break;
        case AudioUtils.AUDIO_PLAYLIST_TYPE_FEED:
            s = geByClass1("_ui_item_audio_feed_" + vk.id, a);
            break;
        case AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM:
            s = geByClass1("_ui_item_audio_" + i.id, a);
            break;
        case AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR:
            var d = this._normalizePlaylistId(i);
            s = geByClass1("_ui_item_audio_" + d, a)
    }
    s ? (this._unselectFriends(), removeClass(s, "unshown"), uiRightMenu.switchMenu(s)) : uiRightMenu.unselectAll(this._getMenuEl());
    var r = i.blocks || {},
        n = "_ui_item_audio_" + AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR, this.options.oid, 0),
        u = geByClass1(n, this._getMenuEl()),
        _ = geByClass1("_ui_item_audio_popular_" + this.options.oid, this._getMenuEl());
    if (r.submenu && !u) {
        var h = se(r.submenu);
        domInsertAfter(h.children[1], _), domInsertAfter(h.children[0], _), u = geByClass1(n, this._getMenuEl()), uiRightMenu.switchMenu(u)
    }
    var c = geByClass1("_ui_item_audio_genres", this._getMenuEl());
    isVisible(_);
    if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR) {
        show(c), show(domNS(c)), hide(_), uiRightMenu.hideSliding(this._getMenuEl());
        var p = geByClass1("_ui_rmenu_audio_albums_toggle", this._getMenuEl());
        hasClass(p, "ui_rmenu_item_expanded") && uiRightMenu.toggleSubmenu("audio_albums", this)
    } else hide(c), hide(domNS(c)), show(_);
    var g = geByClass1("_audio_foreign_filter_block", this._container);
    toggle(g, AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR), setTimeout(function() {
            uiRightMenu.hideSliding(e._getMenuEl())
        }, 150), each(geByClass("_audio_additional_block", this._container), hide), each(geByClass("_audio_additional_blocks_wrap", this._container), hide), o == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH &&
        i.blocks && i.blocks.search && (i.blocks[i.id] = i.blocks.search), this._blocks = this._blocks || {}, each(i.blocks || {}, function(i, t) {
            e._blocks[i] = e._blocks[i] || t
        });
    var A = [];
    switch (o) {
        case AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM:
        case AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT:
        case AudioUtils.AUDIO_PLAYLIST_TYPE_FEED:
            var l = AudioUtils.getPlaylistOwner(i);
            o == AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM && i.pop_band ? A.push("pop_band_" + l) : 0 > l ? A.push(this._prevSearchPlaylistId) : A.push("friends");
            break;
        case AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS:
            A.push("recoms");
            break;
        case AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR:
        case AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH:
            A.push(i.id)
    }
    each(A, function(i, t) {
        if (t) {
            var o = "right";
            0 == t.indexOf("popular_") && (o = "top");
            var a = geByClass1("_audio_additional_blocks_wrap_" + o, e._container),
                s = geByClass1("_audio_additional_block_" + t, e._container);
            s || (s = se(rs(e.options.additionalBlockSectionTpl, {
                block_id: t
            })), val(s, e._blocks[t]), a.appendChild(s)), show(s), show(a)
        }
    }), uiSearch.init("audio_friends_search")
}, AudioPage.prototype._updateLayerBottom = function() {
    var i = this.ap.getCurrentPlaylist();
    if (this.options.isLayer && i) {
        var t = geByClass1("_audio_layer_current_playlist", this._container),
            e = (geByClass1("_audio_layer_show_prev", this._container), "");
        i.title ? e = i.title : i.name && (e = AudioPlayer.getLang("audio_current_playing_from")
            .replace("{playlist}", i.name)), t.innerHTML = e
    }
}, AudioPage.prototype._loadMorePaginatedPlaylist = function(i, t, e) {
    if ("string" == typeof i && (i = this.ap.getPlaylist(i)), !i.has_more) return e && e(i);
    if (t * this.options.audioRowsPerPage < i.next_offset) return e && e(i);
    if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) return e && e(i);
    if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && 0 == t && i.list.length) return i.has_more = i.list.length < AudioUtils.AUDIO_ENOUGH_LOCAL_SEARCH_RESULTS,
        e && e(i);
    var o = i.id,
        a = o + (i.shuffle ? "_" + intval(i.shuffle) : ""),
        s = this;
    if (cur._playlistLoadingLock = cur._playlistLoadingLock || {}, !cur._playlistLoadingLock[a]) {
        cur._playlistLoadingLock[a] = !0, AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && (i.list.length && 1 == t || !i.list.length && 0 == t) &&
            this.toggleSearchProgress(!0);
        var l = {
            act: "a_load_section",
            section: i.id,
            offset: i.next_offset
        };
        AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && extend(l, {
            q: i.searchParams.q,
            lyrics: i.searchParams.lyrics,
            performer: i.searchParams.performer,
            sort: i.searchParams.sort
        }), AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_FEED && extend(l, {
            feed_from: i.feed_from,
            feed_offset: i.feed_offset
        }), i.shuffle && (l.shuffle = intval(i.shuffle)), this._lastRequestedPlaylistId = o, ajax.post("/al_audio.php", l, {
            onDone: function(t) {
                if (cur._playlistLoadingLock[a] = !1, s.toggleSearchProgress(!1), s._lastRequestedPlaylistId != o) return e && e(!1);
                t && (i = AudioUtils.mergePlaylist(o, t));
                var l = s.ap.getCurrentPlaylist();
                l && i.id == l.id && this.ap.moveCurrentPlayingAtFirstPos(i), e && e(i)
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
    var i = !1;
    this._prevSearchPlaylistId = null, cur.nav.push(this._nav_func = function(t, e, o, a) {
        if (each(cur._audioAddRestoreInfo || {}, function(i, t) {
                "deleted" == t.state && this.ap.deleteAudioFromAllPlaylists(i)
            }.bind(this)), this.options.isLayer && (a.hist || a.back || t[0] && 0 != t[0].indexOf("audio"))) return this.options.eltt.hide(), !0;
        if (0 == Object.keys(t)
            .length && !a.fromSearch && !a.fromMenu && !a.friendEl) return !1;
        if (a.friendEl && (t.friend = domData(a.friendEl, "id")), !a.fromMenu && this.options.isLayer && e[0] != o[0] && 1 == Object.keys(o)
            .length) return !0;
        if (a.filtersChanged && i && i.q && "undefined" == typeof t.q && !o.q && (o.q = i.q), JSON.stringify(i) == JSON.stringify(o)) return !1;
        if (a.search && (o[0] = e[0]), (t.friend || t.q) && 1 == Object.keys(t)
            .length);
        else if (!this.options.isLayer && e[0] != o[0]) return !0;
        t.friend && t.friend < 0 && delete o.q;
        var s = "";
        if (this._unselectFriends(), o.q) {
            var l = trim(val(this.searchInputEl));
            l != o.q && val(this.searchInputEl, replaceEntities(o.q));
            var d = replaceEntities(o.q),
                r = {
                    q: o.q
                };
            each(["performer", "lyrics", "sort"], function(i, t) {
                r[t] = intval(o[t]), d += "-" + t + "_" + r[t]
            }), this._prevSearchPlaylistId = s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH, this.options.oid, hashCode(d));
            var n = this.ap.getPlaylist(s);
            n.searchParams = r, removeClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty"), this._prevSearchLoc || (this._prevSearchLoc = i), this._renderedPlaylistId &&
                AudioUtils.getPlaylistType(this._renderedPlaylistId) != AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && (this._prevRenderedPlaylistId = this._renderedPlaylistId),
                delete o.section
        } else if (o.section == AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR) {
            var u = this._getForeignTogglerEl(),
                _ = hasClass(u, "on") ? "f" : "";
            s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR, vk.id, intval(o.genre) + _)
        } else if (t.friend) {
            var h = geByClass1("_audio_friend_" + t.friend, this._container);
            addClass(h, "audio_friend_selected"), showProgress(h), h || lockButton(geByClass1("audio_more_friends_btn")), s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM,
                t.friend, AudioUtils.AUDIO_ALBUM_ID_ALL), geByClass1("_audio_friend_" + t.friend) || this.showMoreFriends(!1, t.friend)
        } else if (o.section == AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS) {
            var c = o.audio_id || 0,
                p = intval(o.album_id) || 0;
            p && (p = "a" + p), s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS, this.options.oid, c ? c : p)
        } else if (o.section == AudioUtils.AUDIO_PLAYLIST_TYPE_FEED) s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_FEED, this.options.oid, 0);
        else if (o.section == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) {
            var g = this.ap.getCurrentPlaylist();
            if (AudioUtils.getPlaylistType(g) == AudioUtils.AUDIO_PLAYLIST_TYPE_FEED) {
                s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, vk.id);
                var n = this.ap.getPlaylist(s);
                n.has_more && (n.has_more = !1, n.list = clone(g.list, !0), n.copiedFrom = g.id)
            } else s = this.ap.getCurrentPlaylist()
                .id
        } else if (o.band) s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, intval(o.band), AudioUtils.AUDIO_ALBUM_ID_ALL), this.ap.getPlaylist(s)
            .pop_band = 1;
        else if (o.album_id) s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, this.options.oid, o.album_id);
        else {
            if (this.options.isLayer && AudioUtils.getPlaylistType(this._prevRenderedPlaylistId) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && !a.fromMenu) s = ap.getCurrentPlaylist()
                .id;
            else {
                var A = this.options.oid;
                1 == Object.keys(o)
                    .length && 0 == o[0].indexOf("audios") && (A = intval(o[0].substr("audios".length)) || this.options.oid), s = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM,
                        A, AudioUtils.AUDIO_ALBUM_ID_ALL)
            }
            addClass(uiSearch.getWrapEl(this.searchInputEl), "ui_search_field_empty")
        }
        return o.section != AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS && (delete o.audio_id, o.section && delete o.album_id), o.q || (this._prevRenderedPlaylistId = !1,
            this._prevSearchLoc = !1, val(this.searchInputEl, ""), this._muteFilterEvent = !0, uiSearch.removeAllFilters(this.searchInputEl), delete o.performer,
            delete o.lyrics, delete o.sort, this._muteFilterEvent = !1), this.options.isLayer ? i = o : nav.setLoc(o), this.syncFilters(o), this.switchToSection(s, !
            0), !1
    }.bind(this))
}, AudioPage.prototype._initPlayer = function() {
    function i() {
        if (!e.options.isLayer || e.options.eltt.isShown()) {
            var i = e.readyAudio ? e.readyAudio : e.ap.getCurrentAudio();
            i && (i = AudioUtils.audioObject(i), u.innerHTML = i.performer, _.innerHTML = i.title, domData(a, "id", i.id), domData(a, "owner-id", i.ownerId), domData(a,
                "full-id", i.fullId));
            var t = getSize(domPN(p))[0],
                o = getSize(c)[0];
            setStyle(p, "width", t - o - 20)
        }
    }

    function t() {
        var t = e.readyAudio ? e.readyAudio : e.ap.getCurrentAudio();
        if (t = AudioUtils.audioObject(t), e._trackSlider) {
            var o = geByClass1("_audio_add_btn", a),
                r = t.ownerId != vk.id;
            A !== r && (toggle(o, r), setStyle(l, {
                right: getSize(s)[0] + 22
            }), e._trackSlider.updateSize(getSize(d)[0]), A = r), domData(o, "audio-id", t.fullId), i(), cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {};
            var n = cur._audioAddRestoreInfo[t.fullId];
            addClass(o, "no_transition"), toggleClass(o, "audio_player_btn_added", !(!n || "added" != n.state)), removeClassDelayed(o, "no_transition")
        }
    }
    var e = this,
        o = this._container,
        a = geByClass1("_audio_page_player", o),
        s = geByClass1("audio_player_controls", a),
        l = geByClass1("audio_page_line_player", a),
        d = geByClass1("audio_page_player_progress", a),
        r = geByClass1("audio_page_player_progress_line", a),
        n = geByClass1("audio_page_player_volume_line", a),
        u = geByClass1("audio_performer", a),
        _ = geByClass1("audio_title", a),
        h = geByClass1("audio_play", a),
        c = geByClass1("audio_page_player_duration", a),
        p = geByClass1("audio_page_player_title", a),
        g = geByClass1("_audio_add_btn", a),
        A = void 0;
    if (i(), t(), !this._playerInited) {
        this._playerInited = !0;
        var y = this._trackSlider = new Slider(r, {
                value: this.ap.getCurrentProgress(),
                backValue: this.ap.getCurrentBuffered(),
                size: 1,
                hintClass: "audio_player_hint",
                withBackLine: !0,
                formatHint: function(i) {
                    var t = e.ap.getCurrentAudio() || e.readyAudio;
                    return t = AudioUtils.audioObject(t), formatTime(Math.round(i * t.duration))
                },
                onEndDragging: function(i) {
                    e.ap.seek(i)
                }
            }),
            P = this._volumeSlider = new Slider(n, {
                value: e.ap.getVolume(),
                size: 1,
                hintClass: "audio_player_hint",
                formatHint: function(i) {
                    return Math.round(100 * i) + "%"
                },
                onChange: function(i) {
                    e.ap.setVolume(i)
                }
            });
        toggleClass(h, "audio_playing", this.ap.isPlaying()), AudioUtils.ee.on("audio_event_added", function(i) {
            var t = AudioUtils.audioObject(e.ap.getCurrentAudio() || e.readyAudio);
            t.fullId == i && addClass(g, "audio_player_btn_added")
        }), AudioUtils.ee.on("audio_event_removed", function(i) {
            var t = AudioUtils.audioObject(e.ap.getCurrentAudio() || e.readyAudio);
            t.fullId == i && removeClass(g, "audio_player_btn_added")
        }), this.ap.on(this, AudioPlayer.EVENT_PLAY, function(o, a, s) {
            e.readyAudio = !1, t(), o = AudioUtils.audioObject(o), addClass(h, "audio_playing"), a && (y.setBackValue(0), y.setValue(0), c.innerHTML = "- " +
                formatTime(o.duration)), i(), AudioUtils.updateCurrentPlaying(), s && e.scrollToTrack()
        }), this.ap.on(this, AudioPlayer.EVENT_PAUSE, function(i) {
            removeClass(h, "audio_playing")
        }), this.ap.on(this, AudioPlayer.EVENT_BUFFERED, function(i, t) {
            y.setBackValue(t)
        }), this.ap.on(this, AudioPlayer.EVENT_VOLUME, function(i, t) {
            P.setValue(t)
        }), this.ap.on(this, AudioPlayer.EVENT_UPDATE, function(e, o) {
            t(), i()
        }), this.ap.on(this, AudioPlayer.EVENT_PROGRESS, function(t, o) {
            t = AudioUtils.audioObject(t), y.setValue(o);
            var a, s = e.ap.getDurationType(),
                l = intval(t.duration);
            a = s ? "-" + formatTime(Math.round(l - o * l)) : formatTime(Math.round(o * l)), c.innerHTML = a, i()
        }), t()
    }
}, AudioPage.prototype.scrollToTrack = function() {
    if (this.ap.getCurrentPlaylist() && (!this.options.isLayer || this.options.eltt.isShown())) {
        var i = geByClass1(AudioUtils.AUDIO_PLAYING_CLS, this._container);
        if (!i && this.options.isLayer) {
            var t = AudioUtils.audioObject(this.ap.getCurrentAudio()),
                e = this.getCurrentPlaylist();
            if (e.id == this.ap.getCurrentPlaylist()
                .id)
                for (var o = 100; o-- && (this._autoList.drawMore(), i = geByClass1("_audio_row_" + t.id, this._container), !i && !this._autoList.isPendingRows()););
        }
        if (i) {
            var a = this.options.isLayer ? geByClass1("audio_layer_rows_wrap", this._container) : bodyNode,
                s = a.scrollTop,
                l = this.options.isLayer ? getSize(a)[1] : clientHeight(),
                d = getXY(i)[1],
                r = getSize(i)[1];
            this.options.isLayer && (d -= scrollNode.scrollTop - s + 110);
            var n = 2 * r;
            (d > s + l - n || s + n > d) && (this.options.isLayer ? a.scrollTop = Math.max(0, d - l / 2 - r / 2) : scrollToY(d - .7 * l, 400))
        }
        this.options.isLayer && this.options.layerScrollbar.update(), clearTimeout(this._scrollListTO)
    }
}, AudioPage.ensurePlaylistHasIndex = function(i, t) {
    AudioPage.isPaginatedPlaylist(i) || i.index ? t(i) : i.index = new vkIndexer(i.list, function(i) {
        return i[2] + " " + i[3]
    }, function() {
        t(i)
    })
}, AudioPage.playNext = function(i) {
    getAudioPlayer(function(i) {
        i.playNext()
    })
}, AudioPage.playPrev = function(i) {
    getAudioPlayer(function(i) {
        i.playPrev()
    })
}, AudioPage.prototype.togglePlayerPlay = function(i) {
    if (this.ap.isPlaying()) this.ap.pause();
    else {
        var t = this.ap.getCurrentPlaylist() || this.getCurrentPlaylist();
        this.readyAudio && !t.list.length && (t = this.ap.getPlaylist(this.readyPlaylistId));
        var e = this.readyAudio || this.ap.getCurrentAudio() || t.list[0];
        this.ap.play(e, t), this.readyAudio = !1
    }
    AudioUtils.updateCurrentPlaying()
};
try {
    stManager.done("audio.js")
} catch (e) {}
