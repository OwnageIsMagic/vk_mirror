function TopAudioPlayer(i, t) {
    this._el = i, this.ap = t, this._playIconBtn = ge("top_audio"), this.init()
}

function AudioPlayer() {
    this._currentAudio = !1, this._isPlaying = !1, this._prevPlaylist = null, this._currentPlaylist = null, this.subscribers = [], this._tasks = [], this._listened = {}, this._statusExport = {},
        this._currentPlayingRows = [];
    var i = this,
        t = {
            onBufferUpdate: function(t) {
                i._notify(AudioPlayer.EVENT_BUFFERED, t)
            },
            onProgressUpdate: function(t) {
                i._notify(AudioPlayer.EVENT_PROGRESS, t)
            },
            onEnd: function() {
                i.repeatCurrentAudio ? (i._impl.seek(0), i._impl.play()) : (i._isPlaying = !1, i._notify(AudioPlayer.EVENT_PAUSE), i._notify(AudioPlayer.EVENT_ENDED), i.playNext())
            }
        },
        e = browser.msie8 || browser.opera && browser.flash && parseInt(browser.version) < 35;
    AudioPlayerHTML5.isSupported() && !e ? this._impl = new AudioPlayerHTML5(t) : this._impl = new AudioPlayerFlash(t), i._impl.setVolume(0), this._initEvents(), this._restoreState()
}

function AudioPlayerFlash(i) {
    this.opts = i || {}, AudioPlayerFlash.instance = this
}

function AudioPlayerHTML5(i) {
    this.opts = i || {}, this._getAudioEl()
}
var AudioUtils = {
    AUDIO_PLAYLIST_TYPE_ALBUM: "album",
    AUDIO_PLAYLIST_TYPE_POPULAR: "popular",
    AUDIO_PLAYLIST_TYPE_RECOMS: "recoms",
    AUDIO_PLAYLIST_TYPE_SEARCH: "search",
    AUDIO_PLAYLIST_TYPE_FEED: "feed",
    AUDIO_PLAYLIST_TYPE_WALL: "wall",
    AUDIO_PLAYLIST_TYPE_CURRENT: "current",
    AUDIO_PLAYLIST_TYPE_TEMP: "temp",
    AUDIO_ALBUM_ID_ALL: -2,
    AUDIO_ITEM_INDEX_ID: 0,
    AUDIO_ITEM_INDEX_OWNER_ID: 1,
    AUDIO_ITEM_INDEX_URL: 2,
    AUDIO_ITEM_INDEX_TITLE: 3,
    AUDIO_ITEM_INDEX_PERFORMER: 4,
    AUDIO_ITEM_INDEX_DURATION: 5,
    AUDIO_ITEM_INDEX_ALBUM_ID: 6,
    AUDIO_ITEM_INDEX_AUTHOR_LINK: 8,
    AUDIO_ITEM_INDEX_FLAGS: 10,
    AUDIO_ITEM_INDEX_CONTEXT: 11,
    AUDIO_ITEM_INLINED_BIT: 1,
    AUDIO_ITEM_CLAIMED_BIT: 16,
    AUDIO_LAYER_TOP: 46,
    AUDIO_ENOUGH_LOCAL_SEARCH_RESULTS: 500,
    AUDIO_PAGINATED: -1,
    AUDIO_PLAYING_CLS: "audio_row_playing",
    AUDIO_CURRENT_CLS: "audio_row_current",
    ACT_ADDRESS: "/audio",
    AUDIO_LAYER_HEIGHT_RATIO: .5,
    AUDIO_LAYER_HEIGHT_MIN_HEIGHT: 400,
    AUDIO_LAYER_MIN_WIDTH: 400,
    AUDIO_LAYER_MAX_WIDTH: 1200,
    AUDIO_STATE_ADDED: "added",
    AUDIO_STATE_REMOVED: "removed",
    ee: new EventEmitter,
    addAudio: function(i) {
        function t() {
            return hasClass(o, "audio_add_in_progress")
        }

        function e(i) {
            toggleClass(o, "audio_add_in_progress", i)
        }
        var o = gpeByClass("_audio_row", i) || gpeByClass("_audio_page_player", i);
        if (!t()) {
            e(!0);
            var a = window.AudioPage && AudioPage(o),
                l = a && a.options.canAudioAddToGroup,
                s = domData(o, "full-id"),
                r = domData(o, "owner-id"),
                u = domData(o, "id"),
                d = vk.audioParams.addHash,
                n = vk.audioParams.deleteHash;
            cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {};
            var _ = cur._audioAddRestoreInfo[s],
                A = ge("audio_" + s);
            if (A = A == o ? !1 : A, _) {
                if ("recom_hidden" == _.state) a && (a.restoreRecommendation(o), removeClass(o, "audio_deleted"), delete cur._audioAddRestoreInfo[s], e(!1));
                else if ("deleted" == _.state) ajax.post("al_audio.php", {
                    act: "restore_audio",
                    oid: r,
                    aid: u,
                    hash: d
                }, {
                    onDone: function() {
                        e(!1)
                    }
                }), removeClass(o, "audio_deleted"), removeClass(o, "canadd"), addClass(o, "canedit"), delete cur._audioAddRestoreInfo[s];
                else if ("added" == _.state) {
                    var y = _.addedFullId.split("_");
                    ajax.post("al_audio.php", {
                            act: "delete_audio",
                            oid: y[0],
                            aid: y[1],
                            hash: n
                        }, {
                            onDone: function() {
                                if (a) {
                                    var i = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL),
                                        t = a.ap.getPlaylist(i);
                                    t.list.shift(), t.total -= 1, AudioUtils.indexPlaylist(t)
                                }
                                e(!1)
                            }
                        }), removeClass(o, "added"), addClass(o, "canadd"), A && removeClass(A, "added"), A && addClass(A, "canadd"), delete cur._audioAddRestoreInfo[s],
                        AudioUtils.ee.emitEvent("audio_event_removed", [s, _.addedFullId]);
                    var p = getAudioPlayer()
                        .getCurrentPlaylist(),
                        c = getAudioPlayer()
                        .getAudioPlaylistPosition(_.addedFullId, p);
                    c >= 0 && AudioUtils.getPlaylistType(p) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && AudioUtils.getPlaylistAlbumId(p.originalId) == AudioUtils.AUDIO_ALBUM_ID_ALL &&
                        AudioUtils.getPlaylistOwner(p) == vk.id && p.list.splice(c, 1)
                }
            } else {
                var P = a && a.options.oid < 0 && l ? -a.options.oid : 0;
                ajax.post("al_audio.php", {
                    act: "add",
                    gid: P,
                    oid: r,
                    aid: u,
                    hash: d
                }, {
                    onDone: function(i, t, o, l) {
                        var r = i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + i[AudioUtils.AUDIO_ITEM_INDEX_ID];
                        if (cur._audioAddRestoreInfo[s] = {
                                state: AudioUtils.AUDIO_STATE_ADDED,
                                addedFullId: r
                            }, a) {
                            var u = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, P ? -P : vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL),
                                d = a.ap.getPlaylist(u);
                            d.list.unshift(i), d.total += d.has_more ? 0 : 1, AudioUtils.indexPlaylist(d)
                        }
                        var n = getAudioPlayer()
                            .getCurrentPlaylist();
                        0 == P && AudioUtils.getPlaylistType(n) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && AudioUtils.getPlaylistAlbumId(n.originalId) ==
                            AudioUtils.AUDIO_ALBUM_ID_ALL && AudioUtils.getPlaylistOwner(n) == vk.id && n.list.unshift(i), e(!1)
                    }
                }), removeClass(o, "canadd"), addClass(o, "added"), A && removeClass(A, "canadd"), A && addClass(A, "added"), AudioUtils.ee.emitEvent(
                    "audio_event_added", [s])
            }
        }
    },
    drawAudio: function(i, t) {
        for (var e = JSON.parse(getTemplate("audio_bits_to_cls")), o = i[AudioUtils.AUDIO_ITEM_INDEX_FLAGS], a = [], l = 0; 32 > l; l++) {
            var s = 1 << l;
            o & s && a.push(e[s])
        }
        t && a.push("inlined");
        var r = formatTime(i[AudioUtils.AUDIO_ITEM_INDEX_DURATION]),
            u = encodeURIComponent(replaceEntities(i[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER])
                .replace(/(<em>|<\/em>)/g, "")),
            d = getTemplate("audio_row", i);
        return d = d.replace(new RegExp("%cls%"), a.join(" ")), d = d.replace(new RegExp("%duration%"), r), d = d.replace(new RegExp("%performer_escaped%"), u)
    },
    isPaginatedPlaylist: function(i) {
        var t = AudioUtils.getPlaylistType(i);
        return t == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && i.originalId && (t = AudioUtils.getPlaylistType(i.originalId)), inArray(t, [AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR,
            AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS, AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH, AudioUtils.AUDIO_PLAYLIST_TYPE_FEED
        ])
    },
    mergePlaylist: function(i, t, e) {
        var o = getAudioPlayer(),
            a = o.getPlaylist(i);
        if (AudioUtils.getPlaylistType(a) != AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && !a.has_more) return a;
        if (each(["name", "offset", "has_more", "total", "next_offset", "blocks", "feed_from", "feed_offset", "not_full", "pop_band"], function(i, e) {
                if (t.hasOwnProperty(e)) {
                    if ("has_more" == e && !a.has_more && t.has_more) return;
                    if (isArray(t[e]) && 0 == t[e].length) return;
                    if ("blocks" == e && a[e]) return;
                    a[e] = t[e]
                }
            }), AudioUtils.isPaginatedPlaylist(a)) t.items && (a.items = (a.items || [])
            .concat(t.items)), a.list = a.list.concat(t.list);
        else if (a.list.length) {
            for (var l = a.list[a.list.length - 1][AudioUtils.AUDIO_ITEM_INDEX_ID], s = [].concat(t.list); s.length && s[0][AudioUtils.AUDIO_ITEM_INDEX_ID] != l;) s.shift();
            s.shift(), a.list = a.list.concat(s)
        } else a.list = [].concat(t.list);
        return e || each(o.audioPlaylists, function(e, o) {
            o.originalId == i && AudioUtils.mergePlaylist(e, t, !0)
        }), a
    },
    indexPlaylist: function(i, t) {
        if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM) {
            var e = function(i, t) {
                var e = intval(t);
                return e >= 33 && 48 > e ? String.fromCharCode(e) : i
            };
            i.index = new vkIndexer(i.list, function(i) {
                return (i[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] + " " + i[AudioUtils.AUDIO_ITEM_INDEX_TITLE])
                    .replace(/\&\#(\d+);?/gi, e)
            }, t)
        }
    },
    makePlaylistId: function(i, t, e) {
        return e = "undefined" == typeof e ? "_0" : e || 0 === e ? "_" + e : "", i + "_" + t + e
    },
    getPlaylistAlbumId: function(i) {
        if (!i) return !1;
        var t = isString(i) ? i : i.id;
        return t = t.split("_"), t.length >= 3 ? t.slice(2)
            .join("_") : !1
    },
    getPlaylistOwner: function(i) {
        var t = isString(i) ? i : i.id;
        return t = t.split("_"), t.length > 1 ? intval(t[1]) : !1
    },
    getPlaylistType: function(i) {
        if (!i) return !1;
        var t = ("string" == typeof i ? i : i.id)
            .split("_");
        return t[0]
    },
    showAudioLayer: function(btn) {
        stManager.add(["ui_controls.js", "ui_controls.css", "audio.css"], function() {
            getAudioPlayer(function(ap) {
                function initLayer(html, playlist, options, firstSong, script) {
                    eval(script);
                    var telContent = audioLayerTooltip.getContent();
                    addClass(telContent, "no_transition"), removeClass(telContent, "top_audio_loading"), telContent.innerHTML = html;
                    var layerScrollNode = geByClass1("audio_layer_rows_wrap", telContent);
                    setStyle(layerScrollNode, "height", Math.max(clientHeight() * AudioUtils.AUDIO_LAYER_HEIGHT_RATIO, AudioUtils.AUDIO_LAYER_HEIGHT_MIN_HEIGHT)),
                        options.eltt = audioLayerTooltip, options.isLayer = !0, options.layerScrollbar = new Scrollbar(layerScrollNode, {
                            nomargin: !0,
                            right: vk.rtl ? "auto" : 0,
                            left: vk.rtl ? 0 : "auto",
                            global: !0,
                            nokeys: !0,
                            scrollElements: [geByClass1("audio_layer_menu_wrap", telContent)]
                        }), data(layerScrollNode, "sb", options.layerScrollbar);
                    var audioPage = new AudioPage(geByClass1("_audio_layout", telContent), playlist, options, firstSong);
                    data(audioLayerTooltip, "audio-page", audioPage), setTimeout(function() {
                        removeClass(telContent, "no_transition")
                    })
                }

                function getPageEl() {
                    return geByClass1("js-im-page") || ge("page_body")
                }

                function getLayerWidth() {
                    return Math.max(AudioUtils.AUDIO_LAYER_MIN_WIDTH, Math.min(AudioUtils.AUDIO_LAYER_MAX_WIDTH, getSize(getPageEl())[0] -
                        BORDER_COMPENSATION))
                }

                function getAudioBtn() {
                    var i = geByClass1("_top_nav_audio_btn");
                    return hasClass(i, "top_audio_player_enabled") && (i = geByClass1("top_audio_player")), i
                }
                var audioLayerTooltip = data(btn, "layer"),
                    currentPlaylist = ap.getCurrentPlaylist();
                if (audioLayerTooltip)
                    if (hasClass(btn, "active")) audioLayerTooltip.hide(), removeClass(btn, "active"), topHeaderClearClose();
                    else {
                        audioLayerTooltip.show();
                        var initParams = data(audioLayerTooltip, "init-params");
                        if (initParams) initLayer.apply(this, initParams), data(audioLayerTooltip, "init-params", null);
                        else {
                            var audioPage = data(audioLayerTooltip, "audio-page");
                            audioPage && audioPage.onShow()
                        }
                        addClass(btn, "active"), topHeaderClose(function() {
                            audioLayerTooltip.hide()
                        })
                    }
                else {
                    var BORDER_COMPENSATION = 2;
                    audioLayerTooltip = new ElementTooltip(btn, {
                        content: rs(vk.pr_tpl, {
                            id: ""
                        }),
                        cls: "top_audio_loading top_audio_layer",
                        showImmediate: !0,
                        autoShow: !1,
                        id: "audio_layer_tt",
                        appendTo: document.body,
                        hideOnClick: !0,
                        onShow: function() {
                            addClass(getAudioBtn(), "audio_top_btn_active")
                        },
                        onHide: function(i, t) {
                            removeClass(getAudioBtn(), "audio_top_btn_active"), audioPage = data(audioLayerTooltip, "audio-page"), audioPage &&
                                audioPage.onHide(), removeClass(btn, "active"), t && topHeaderClearClose()
                        },
                        width: getLayerWidth,
                        setPos: function() {
                            var i = getXY(getPageEl()),
                                t = getSize(getPageEl())[0] - BORDER_COMPENSATION,
                                e = getLayerWidth(),
                                o = getAudioBtn(),
                                a = getXY(o)[0],
                                l = getSize(o)[0],
                                s = a + l / 2,
                                r = s - e / 2;
                            t <= AudioUtils.AUDIO_LAYER_MAX_WIDTH && t >= AudioUtils.AUDIO_LAYER_MIN_WIDTH && (r = i[0]);
                            var u = a - r + l / 2;
                            return setPseudoStyle(this.getContent(), "after", {
                                left: u + "px"
                            }), {
                                left: r,
                                top: AudioUtils.AUDIO_LAYER_TOP,
                                position: "fixed"
                            }
                        }
                    }), data(btn, "layer", audioLayerTooltip), ap.audioLayer = audioLayerTooltip, addClass(btn, "active"), ajax.post("al_audio.php", {
                        act: "a_layer",
                        my: intval(!currentPlaylist)
                    }, {
                        onDone: function(i, t, e, o, a) {
                            var l = t;
                            AudioUtils.getPlaylistType(l) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && (l = ap.getCurrentPlaylist(), l.blocks =
                                t.blocks), audioLayerTooltip.isShown() ? initLayer(i, l, e, o, a) : data(audioLayerTooltip, "init-params", [
                                i, l, e, o, a
                            ])
                        }
                    }), topHeaderClose(function() {
                        audioLayerTooltip.hide()
                    })
                }
            })
        })
    },
    filterClaimedAudios: function(i) {
        i.list = i.list.filter(function(i) {
            return !(intval(i[AudioUtils.AUDIO_ITEM_INDEX_FLAGS]) & AudioUtils.AUDIO_ITEM_CLAIMED_BIT)
        })
    },
    unsetInlineFlagForAudio: function(i) {
        return i[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] &= ~AudioUtils.AUDIO_ITEM_INLINED_BIT, i
    },
    unsetInlineFlagForPlaylist: function(i) {
        for (var t = 0, e = i.list.length; e > t; t++) i.list[t] = AudioUtils.unsetInlineFlagForAudio(i.list[t])
    },
    makeCurrentPlaylist: function(i) {
        if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) return i;
        if (i.originalId == i.id) return i;
        var t = clone(i, !0);
        return t.id = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, vk.id, irand(1, 99999)), t.originalId = i.id, delete t.localFoundTotal, delete t.items,
            delete t.searchParams, delete t.has_more, AudioUtils.filterClaimedAudios(t), AudioUtils.unsetInlineFlagForPlaylist(t), each(t.list, function(i) {
                t.list[i][AudioUtils.AUDIO_ITEM_INDEX_AUTHOR_LINK] = ""
            }), getAudioPlayer(function(i) {
                i.addPlaylist(t)
            }), t
    },
    findAudioInPlaylist: function(i, t) {
        var e = -1,
            o = null,
            a = "string" == typeof i ? i : AudioUtils.audioObject(i)
            .fullId;
        return each(t.list, function(i, t) {
            return t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID] == a ? (o = t, e = i, !1) : void 0
        }), [o, e]
    },
    audioObject: function(i) {
        return i ? isObject(i) ? i : "string" == typeof i ? {
            id: i
        } : {
            id: i[AudioUtils.AUDIO_ITEM_INDEX_ID],
            owner_id: i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID],
            ownerId: i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID],
            fullId: i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + i[AudioUtils.AUDIO_ITEM_INDEX_ID],
            title: i[AudioUtils.AUDIO_ITEM_INDEX_TITLE],
            performer: i[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER],
            duration: i[AudioUtils.AUDIO_ITEM_INDEX_DURATION],
            url: i[AudioUtils.AUDIO_ITEM_INDEX_URL],
            context: i[AudioUtils.AUDIO_ITEM_INDEX_CONTEXT]
        } : null
    },
    updateCurrentPlaying: function(i) {
        getAudioPlayer(function(t) {
            t.updateCurrentPlaying(i)
        })
    },
    toggleAudio: function(i) {
        getAudioPlayer(function(t) {
            var e = domClosest("_audio_row", i),
                o = hasClass(e, "claimed");
            if (o) {
                var a = domData(e, "claim-id"),
                    l = domData(e, "delete-hash"),
                    s = domData(e, "title");
                return void showAudioClaimWarning(domData(e, "owner-id"), domData(e, "id"), l, a, s)
            }
            var r = hasClass(e, AudioUtils.AUDIO_PLAYING_CLS);
            if (r) t.pause();
            else {
                var u = AudioUtils.getContextPlaylist(e);
                t.play(domData(e, "full-id"), u)
            }
        })
    },
    buildAudioFromRow: function(i) {
        var t = "";
        return [domData(i, "id"), domData(i, "owner-id"), domData(i, "url"), clean(domData(i, "title")), clean(domData(i, "performer")), intval(domData(i, "duration")), "",
            "", "", 0, intval(domData(i, "flags")), t, ""
        ]
    },
    _getContextId: function(i) {
        var t = null;
        if (t = gpeByClass("audios_module", i)) return "._module_" + domData(t, "owner-id");
        if (t = gpeByClass("reply", i)) return "#" + t.id;
        if (t = gpeByClass("_wall_post_cont", i)) {
            var e = t.id;
            return e = e.replace("post", "")
                .replace("wpt", ""), "#post" + e + " ._wall_audio_rows, #wpt" + e + " ._wall_audio_rows"
        }
        if (t = gpeByClass("_post_wrap", i)) {
            var e = t.id;
            return 0 == e.indexOf("top_") && (e = e.substr("top_".length)), "#" + e + " ._wall_audio_rows, #top_" + e + " ._wall_audio_rows"
        }
        return 0
    },
    initDomPlaylist: function(i, t) {
        if (!t || !t.length) {
            var e = null;
            each(geByClass("_audio_playlist"), function() {
                return domData(this, "pl-id") == i.id ? (e = this, !1) : void 0
            }), t = [e]
        }
        var o = getAudioPlayer(),
            a = [];
        return each(t, function(i, t) {
                t && each(geByClass("_audio_row", t), function(i) {
                    a.push(AudioUtils.buildAudioFromRow(this))
                })
            }), o.pushAudiosToPlaylist(i, a), i.offset = i.list.length, AudioUtils.getPlaylistType(i) != AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM && (i.has_more = !1),
            AudioUtils.filterClaimedAudios(i), AudioUtils.unsetInlineFlagForPlaylist(i), i
    },
    needDomInit: function(i) {
        return inArray(AudioUtils.getPlaylistType(i), [AudioUtils.AUDIO_PLAYLIST_TYPE_FEED, AudioUtils.AUDIO_PLAYLIST_TYPE_WALL])
    },
    getContextPlaylist: function(i) {
        function t(i) {
            return [].slice.call(i)
        }
        var e = null,
            o = [],
            a = getAudioPlayer(),
            l = null,
            s = gpeByClass("_audio_playlist", i);
        if (s) {
            var r = domData(s, "pl-id");
            return e = a.getPlaylist(r), AudioUtils.needDomInit(e) ? AudioUtils.initDomPlaylist(e) : e
        }
        if (l = domClosest("_im_peer_history", i)) o = t(geByClass("_im_mess", l));
        else if (l = domClosest("replies_list", i)) o = t(geByClass("wall_audio_rows", l));
        else if (l = domClosest("_bt_rows", i)) o = t(geByClass("_wall_audio_rows", l));
        else if (l = domClosest("_feed_rows", i)) o = t(geByClass("wall_text", l));
        else if (l = domClosest("wall_posts", i)) {
            o = t(geByClass("wall_text", l));
            var u = geByClass1("post_fixed");
            u && o.unshift(geByClass1("wall_text", u))
        } else if (l = gpeByClass("module_body", i)) {
            var r = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM, cur.oid, AudioUtils.AUDIO_ALBUM_ID_ALL);
            e = a.getPlaylist(r), e.has_more && !e.isLoadingSilent && (e.isLoadingSilent = !0, ajax.post("al_audio.php", {
                act: "a_load_silent",
                playlist: e.id,
                offset: geByClass("_audio_row", l)
                    .length,
                limit: 100
            }, {
                onDone: function(i) {
                    delete e.isLoadingSilent, e = AudioUtils.mergePlaylist(e.id, i)
                }
            })), o = [l]
        } else o = [domPN(i)];
        if (!e) {
            var d = domData(i, "full-id"),
                n = a.getCurrentPlaylist();
            n && a.getAudioPlaylistPosition(d, n) >= 0 ? e = n : (e = a.getPlaylist(AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, vk.id, irand(1, 999))),
                e.has_more = !1)
        }
        return e = AudioUtils.initDomPlaylist(e, o)
    },
    getOwnerAlbumPlaylist: function(i, t) {
        throw new "not implemented"
    }
};
TopAudioPlayer.TITLE_CHANGE_ANIM_SPEED = 190, TopAudioPlayer.init = function() {
        getAudioPlayer(function(i) {
            var t = ge("top_audio_player"),
                e = data(t, "object");
            e || (e = new TopAudioPlayer(t, i), data(t, "object", e))
        })
    }, TopAudioPlayer.prototype.init = function() {
        function i(i) {
            return hasClass(this, "top_audio_player_play") ? (t.ap.isPlaying() ? t.ap.pause() : t.ap.play(), !1) : hasClass(this, "top_audio_player_prev") ? (t.ap.playPrev(), !1) :
                hasClass(this, "top_audio_player_next") ? (t.ap.playNext(), !1) : void 0
        }
        var t = this;
        this.ap.on(this, AudioPlayer.EVENT_UPDATE, this.onPlay.bind(this)), this.ap.on(this, AudioPlayer.EVENT_PLAY, this.onPlay.bind(this)), this.ap.on(this, AudioPlayer.EVENT_PAUSE,
            this.onPause.bind(this)), this.ap.top = this, each(["prev", "play", "next"], function(e, o) {
            addEvent(geByClass1("top_audio_player_" + o, t._el), "click", i)
        }), addEvent(this._el, "click", function(i) {
            return 1 != i.which || hasClass(i.target, "top_audio_player_btn") || hasClass(i.target, "top_audio_player_act_icon") ? void 0 : showAudioLayer(i, ge(
                "top_audio"))
        }), this.onPlay(this.ap.getCurrentAudio())
    }, TopAudioPlayer.prototype.onPlay = function(i, t, e) {
        function o() {
            a.ap.audioLayer && a.ap.audioLayer.isShown() && a.ap.audioLayer.updatePosition(), addClass(a._el, "top_audio_player_enabled"), toggleClass(a._el,
                "top_audio_player_playing", a.ap.isPlaying()), i = AudioUtils.audioObject(i), clearTimeout(a._currTitleReTO);
            var t = geByClass1("top_audio_player_title_out", a._el);
            re(t);
            var o = geByClass1("top_audio_player_title", a._el);
            if (0 != e) {
                var l = 0 > e ? -10 : 10,
                    s = o.offsetLeft,
                    r = se('<div class="top_audio_player_title top_audio_player_title_next" style="opacity: 0; top:' + l + "px; left: " + s + 'px">' + i.performer + " &ndash; " +
                        i.title + "</div>");
                r.setAttribute("onmouseover", "setTitle(this)"), e > 0 ? domInsertAfter(r, o) : domInsertBefore(r, o), addClass(o, "top_audio_player_title_out"), setStyle(o, {
                    top: -l,
                    opacity: 0
                }), setTimeout(function() {
                    setStyle(r, {
                        top: 0,
                        opacity: 1
                    })
                }, 1), clearTimeout(a._currTitleReTO), a._currTitleReTO = setTimeout(function() {
                    re(o), removeClass(r, "top_audio_player_title_next")
                }, TopAudioPlayer.TITLE_CHANGE_ANIM_SPEED)
            } else o.innerHTML = i.performer + " &ndash; " + i.title, o.titleSet = 0, o.setAttribute("onmouseover", "setTitle(this)")
        }
        if (i) {
            var a = this;
            e = intval(e), hasClass(this._playIconBtn, "top_audio_player_enabled") ? o() : (addClass(this._playIconBtn, "top_audio_player_enabled"), setTimeout(function() {
                hide(a._playIconBtn), o()
            }, 150))
        }
    }, TopAudioPlayer.prototype.onPause = function() {
        removeClass(this._el, "top_audio_player_playing")
    }, TopAudioPlayer.prototype.onNext = function() {}, AudioPlayer.EVENT_PLAY = "start", AudioPlayer.EVENT_PAUSE = "pause", AudioPlayer.EVENT_STOP = "stop", AudioPlayer.EVENT_UPDATE =
    "update", AudioPlayer.EVENT_LOADED = "loaded", AudioPlayer.EVENT_ENDED = "ended", AudioPlayer.EVENT_BUFFERED = "buffered", AudioPlayer.EVENT_PROGRESS = "progress", AudioPlayer
    .EVENT_VOLUME = "volume", AudioPlayer.EVENT_PLAYLIST_CHANGED = "plchange", AudioPlayer.LS_VER = "v3", AudioPlayer.LS_KEY_PREFIX = "audio", AudioPlayer.LS_PREFIX = AudioPlayer.LS_KEY_PREFIX +
    "_" + AudioPlayer.LS_VER + "_", AudioPlayer.LS_VOLUME = "vol", AudioPlayer.LS_PL = "pl", AudioPlayer.LS_TRACK = "track", AudioPlayer.LS_SAVED = "saved", AudioPlayer.LS_PROGRESS =
    "progress", AudioPlayer.LISTEN_TIME = 3, AudioPlayer.DEFAULT_VOLUME = .8;
var audioIconSuffix = window.devicePixelRatio >= 2 ? "_2x" : "";
AudioPlayer.tabIcons = {
    def: "/images/icons/favicons/fav_logo" + audioIconSuffix + ".ico",
    play: "/images/icons/favicons/fav_play" + audioIconSuffix + ".ico",
    pause: "/images/icons/favicons/fav_pause" + audioIconSuffix + ".ico"
}, AudioPlayer.getLang = function(i) {
    var t = getAudioPlayer();
    return t && t.langs ? t.langs[i] : i
}, AudioPlayer.clearDeprecatedCacheKeys = function() {
    AudioPlayer._iterateCacheKeys(function(i) {
        return i == AudioPlayer.LS_VER
    })
}, AudioPlayer.clearObsoleteCacheKeys = function() {
    var i = ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_SAVED) || 0,
        t = 72e5;
    i < vkNow() - t && AudioPlayer._iterateCacheKeys(function(i, t) {
        return !inArray(t, [AudioPlayer.LS_PL, AudioPlayer.LS_TRACK, AudioPlayer.LS_PROGRESS])
    })
}, AudioPlayer.clearAllCacheKeys = function() {
    AudioPlayer._iterateCacheKeys(function() {
        return !1
    }), setCookie("remixcurr_audio", "", -1)
}, AudioPlayer._iterateCacheKeys = function(i) {
    for (var t in window.localStorage)
        if (0 === t.indexOf(AudioPlayer.LS_KEY_PREFIX + "_")) {
            var e = t.split("_");
            i(e[1], e[2]) || localStorage.removeItem(t)
        }
}, AudioPlayer.prototype.onMediaKeyPressedEvent = function(i) {
    var t = this.getCurrentAudio();
    this.getCurrentPlaylist();
    if (t) switch (i.keyCode) {
        case 179:
            this.isPlaying() ? this.pause() : this.play();
            break;
        case 178:
            this.seek(0), this.pause();
            break;
        case 177:
            this.playPrev();
            break;
        case 176:
            this.playNext()
    }
}, AudioPlayer.prototype.updateCurrentPlaying = function(i) {
    var t = this.getCurrentPlaylist(),
        e = AudioUtils.audioObject(this.getCurrentAudio()),
        o = ([t.id, t.originalId], []);
    o = [window.bodyNode];
    var a = [];
    if (e)
        for (var l = 0, s = o.length; s > l; l++)
            if (o[l]) {
                var r = geByClass("_audio_row_" + e.fullId, o[l]);
                a = a.concat([].slice.call(r))
            }
    for (var l = 0, s = this._currentPlayingRows.length; s > l; l++) {
        var u = this._currentPlayingRows[l];
        u && !inArray(u, a) && this.toggleCurrentAudioRow(u, !1, i)
    }
    if (e)
        for (var l = 0, s = a.length; s > l; l++) {
            var u = a[l];
            u && this.toggleCurrentAudioRow(u, !0, i)
        }
    this._currentPlayingRows = a
}, AudioPlayer.prototype.toggleCurrentAudioRow = function(i, t, e) {
    function o() {
        l && (t ? s._addRowPlayer(i) : s._removeRowPlayer(i)), t ? (s.on(i, AudioPlayer.EVENT_PLAY, function(t) {
                AudioUtils.audioObject(t)
                    .fullId == domData(i, "full-id") && addClass(i, AudioUtils.AUDIO_PLAYING_CLS)
            }), s.on(i, [AudioPlayer.EVENT_PAUSE, AudioPlayer.EVENT_ENDED], function(t) {
                removeClass(i, AudioUtils.AUDIO_PLAYING_CLS)
            }), toggleClass(i, AudioUtils.AUDIO_PLAYING_CLS, s.isPlaying())) : (s.off(i), removeClass(i, AudioUtils.AUDIO_PLAYING_CLS)), (e ? toggleClass : toggleClassDelayed)
            (i, AudioUtils.AUDIO_CURRENT_CLS, t)
    }
    var a = !!intval(domData(i, "is-current"));
    if (a != t) {
        domData(i, "is-current", intval(t));
        var l = hasClass(i, "inlined");
        l && toggleClass(i, "audio_with_transition", !e);
        var s = this;
        e ? o() : setTimeout(o)
    }
}, AudioPlayer.prototype._removeRowPlayer = function(i) {
    removeClass(i, AudioUtils.AUDIO_CURRENT_CLS);
    var t = data(i, "player_inited");
    t && (setTimeout(function() {
            re(geByClass1("_audio_inline_player", i))
        }, 200), geByClass1("audio_duration", i)
        .innerHTML = formatTime(domData(i, "duration")), this.off(i), each(t.sliders, function() {
            this.destroy()
        }), data(i, "player_inited", !1))
}, AudioPlayer.prototype._addRowPlayer = function(i) {
    if (!geByClass1("_audio_inline_player", i)) {
        var t = this,
            e = se(vk.audioParams.audioInlinePlayerTpl || getTemplate("audio_inline_player"));
        i.appendChild(e);
        var o = new Slider(geByClass1("audio_inline_player_volume", e), {
                value: t.getVolume(),
                backValue: 0,
                size: 1,
                hintClass: "audio_player_hint",
                withBackLine: !0,
                formatHint: function(i) {
                    return Math.round(100 * i) + "%"
                },
                onChange: function(i) {
                    t.setVolume(i)
                }
            }),
            a = new Slider(geByClass1("audio_inline_player_progress", e), {
                value: 0,
                backValue: 0,
                size: 1,
                hintClass: "audio_player_hint",
                withBackLine: !0,
                formatHint: function(i) {
                    var e = AudioUtils.audioObject(t.getCurrentAudio());
                    return formatTime(Math.round(i * e.duration))
                },
                onEndDragging: function(i) {
                    t.seek(i)
                }
            });
        t.on(i, AudioPlayer.EVENT_BUFFERED, function(i, t) {
            a.setBackValue(t)
        }), t.on(i, AudioPlayer.EVENT_PROGRESS, function(t, e) {
            a.setValue(e), t = AudioUtils.audioObject(t);
            var o = intval(t.duration),
                l = Math.round(o - e * o);
            geByClass1("audio_duration", i)
                .innerHTML = "- " + formatTime(l)
        }), t.on(i, AudioPlayer.EVENT_VOLUME, function(i, t) {
            o.setValue(t)
        }), data(i, "player_inited", {
            sliders: [o, a]
        })
    }
}, AudioPlayer.prototype.shareMusic = function() {
    var i = this.getCurrentAudio();
    if (i) return i = AudioUtils.audioObject(i), !showBox("like.php", {
        act: "publish_box",
        object: "audio" + i.fullId,
        list: "s" + vk.id,
        to: "mail"
    }, {
        stat: ["page.js", "page.css", "wide_dd.js", "wide_dd.css", "sharebox.js"],
        onFail: function(i) {
            return showDoneBox(i), !0
        }
    })
}, AudioPlayer.prototype.hasStatusExport = function() {
    for (var i in this._statusExport)
        if (this._statusExport[i]) return !0;
    return !1
}, AudioPlayer.prototype.updateStatusExportTooltip = function() {
    var i = this;
    each(geByClass("_audio_export_status"), function() {
        toggleClass(this, "on", !!i._statusExport[domData(this, "oid")])
    });
    var t = this.hasStatusExport();
    return each(geByClass("_audio_status_btn"), function() {
        toggleClass(this, "audio_enabled", t)
    }), !1
}, AudioPlayer.prototype.updateStatus = function(i, t) {
    i && checkbox(i);
    var e, o, t = intval(t);
    if (t) this._statusExport[t] ? (delete this._statusExport[t], e = !1) : (this._statusExport[t] = 1, e = !0);
    else if (this.hasStatusExport()) {
        for (var a in this._statusExport) delete this._statusExport[a];
        e = !1
    } else t = vk.id, this._statusExport[t] = 1, e = !0;
    var l = vk.audioParams.addHash;
    if (l) {
        t != vk.id && t || checkbox("currinfo_audio", this.hasStatusExport()), this.updateStatusExportTooltip();
        var s = this.getCurrentAudio();
        s && (o = AudioUtils.audioObject(s)
            .fullId);
        var r = this.getCurrentPlaylist(),
            u = r ? r.playbackParams : null;
        ajax.post("al_audio.php", {
            act: "toggle_status",
            exp: intval(e),
            oid: t,
            hash: l,
            id: o,
            top: intval(u && (u.top_audio || u.top))
        })
    }
}, AudioPlayer.prototype.deleteAudioFromAllPlaylists = function(i) {
    i = isObject(i) || isArray(i) ? AudioUtils.audioObject(i)
        .fullId : i;
    var t = 0;
    return each(this.audioPlaylists, function(e, o) {
        if (AudioUtils.getPlaylistType(e) != AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT)
            for (var a = 0, l = o.list.length; l > a; a++) {
                var s = o.list[a][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + o.list[a][AudioUtils.AUDIO_ITEM_INDEX_ID];
                if (s == i) return o.list.splice(a, 1), o.total += o.has_more ? 0 : -1, AudioUtils.indexPlaylist(o), void t++
            }
    }), t
}, AudioPlayer.prototype.triggerAudioUpdated = function() {
    this._notify(AudioPlayer.EVENT_UPDATE)
}, AudioPlayer.prototype.updateAudio = function(i, t) {
    var e = isArray(i) ? i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + i[AudioUtils.AUDIO_ITEM_INDEX_ID] : i;
    if (each(this.audioPlaylists, function(o, a) {
            for (var l = 0, s = a.list.length; s > l; l++)
                if (a.list[l][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + a.list[l][AudioUtils.AUDIO_ITEM_INDEX_ID] == e) return isObject(t) && each(t, function(i, t) {
                    a.list[l][i] = t
                }), !isObject(t) && isArray(i) && (a.list[l] = i), void AudioUtils.indexPlaylist(a)
        }), this._currentAudio[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + i[AudioUtils.AUDIO_ITEM_INDEX_ID] == e) {
        if (this._currentAudio = i, isObject(t)) {
            var o = this;
            each(t, function(i, t) {
                o._currentAudio[i] = t
            })
        }!isObject(t) && isArray(i) && (this._currentAudio = i)
    }
    return this._notify(AudioPlayer.EVENT_UPDATE), i
}, AudioPlayer.prototype._sendLCNotification = function() {
    var i = window.Notifier;
    i && i.lcSend("audio_start");
    try {
        var t = ge("video_player") || window.html5video || null;
        t && t.playVideo && t.playVideo(!1)
    } catch (e) {}
}, AudioPlayer.prototype._restoreState = function() {
    AudioPlayer.clearDeprecatedCacheKeys(), AudioPlayer.clearObsoleteCacheKeys();
    var i = ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_VOLUME);
    this._userVolume = void 0 == i || i === !1 ? AudioPlayer.DEFAULT_VOLUME : i, this._currentAudio = ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_TRACK), this._currentPlaylist =
        ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_PL), this._currentPlaylist && this._currentAudio ? (this.addPlaylist(this._currentPlaylist), this._notify(AudioPlayer.EVENT_UPDATE)) :
        this._currentPlaylist = this._currentAudio = !1;
    var t = ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_PROGRESS) || 0;
    if (this._currentAudio && t) {
        var e = this;
        this._queueTask("init", function(i) {
            e._impl.setUrl(e._currentAudio[AudioUtils.AUDIO_ITEM_INDEX_URL], i)
        }), this._queueTask("init", function(i) {
            e._impl.seek(t), i()
        })
    }
}, AudioPlayer.prototype.getCurrentProgress = function() {
    return this._impl.getCurrentProgress()
}, AudioPlayer.prototype.getCurrentBuffered = function() {
    return this._impl.getCurrentBuffered()
}, AudioPlayer.prototype._initEvents = function() {
    var i = window.Notifier,
        t = this;
    i && (i.addRecvClbk("audio_start", "audio", function(i) {
        t.isPlaying() && t.pause(!1, t._fadeVolumeWorker ? !1 : !0), t.pausedByVideo = null
    }), i.addRecvClbk("video_start", "audio", function(i) {
        t.isPlaying() && (t.pause(), t.pausedByVideo = 1)
    }), i.addRecvClbk("video_hide", "audio", function(i) {
        !t.isPlaying() && t.pausedByVideo && (t.play(), delete t.pausedByVideo)
    }), i.addRecvClbk("logged_off", "audio", function() {
        AudioPlayer.clearAllCacheKeys(), t.stop()
    }))
}, AudioPlayer.prototype.addPlaylist = function(i) {
    this.audioPlaylists = this.audioPlaylists || {}, this.audioPlaylists[i.id] || (this.audioPlaylists[i.id] = i)
}, AudioPlayer.prototype.shufflePlaylist = function(i) {
    if (i.shuffle = irand(1, 999), i.has_more)
        if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH) {
            if (i.localFoundTotal && intval(i.localFoundTotal) > 1) {
                var t = i.list.splice(0, i.localFoundTotal);
                i.original = [].concat(t), shuffle(t), i.list = t.concat(i.list)
            }
        } else i.list = [], i.offset = i.next_offset = 0;
    else i.original = [].concat(i.list), shuffle(i.list), delete i.localFoundTotal, this.moveCurrentPlayingAtFirstPos(i)
}, AudioPlayer.prototype.moveCurrentPlayingAtFirstPos = function(i) {
    var t = this.getCurrentAudio();
    if (t && -1 != this.getAudioPlaylistPosition(t, i)) {
        var e = i.list[0];
        if (i.list.length && e[AudioUtils.AUDIO_ITEM_INDEX_ID] == t[AudioUtils.AUDIO_ITEM_INDEX_ID]) return;
        for (var o = 0, a = i.list.length; a > o; o++)
            if (i.list[o][AudioUtils.AUDIO_ITEM_INDEX_ID] == t[AudioUtils.AUDIO_ITEM_INDEX_ID]) {
                i.list.splice(o, 1);
                break
            }
        i.list.unshift(t)
    }
}, AudioPlayer.prototype.restoreShufflePlaylist = function(i) {
    delete i.shuffle, (i.original || AudioUtils.isPaginatedPlaylist(i)) && (i.has_more ? AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && i.localFoundTotal ?
        (i.list.splice(0, i.localFoundTotal), i.list = i.original.concat(i.list)) : (i.list = [], i.offset = i.next_offset = 0) : i.list = i.original, delete i.original)
}, AudioPlayer.prototype.pushAudiosToPlaylist = function(i, t) {
    isArray(t) && !isArray(t[0]) && (t = [t]), i.total = i.total || i.list.length || 0;
    var e = this;
    each(t, function(t, o) {
        -1 == e.getAudioPlaylistPosition(o, i) && (i.list.push(o), i.total++)
    }), AudioUtils.indexPlaylist(i)
}, AudioPlayer.prototype.getPlaylist = function(i) {
    if (arguments.length > 1 && (i = AudioUtils.makePlaylistId.apply(this, arguments)), isObject(i)) return i;
    this.audioPlaylists = this.audioPlaylists || {};
    var t = this.audioPlaylists[i];
    if (!t) {
        var e = this.audioPlaylists[i] = {
            id: i,
            list: [],
            next_offset: 0,
            has_more: !0
        };
        if (AudioUtils.getPlaylistType(i) == AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM) {
            var o = i.split("_"),
                a = this.getPlaylist(o[0] + "_" + o[1] + "_" + AudioUtils.AUDIO_ALBUM_ID_ALL);
            a.has_more || a.not_full || (each(a.list, function(i, t) {
                t[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] == o[2] && e.list.push(t)
            }), e.total = e.list.length, e.has_more = !1)
        }
        t = e
    }
    return t
}, AudioPlayer.prototype.toggleRepeatCurrentAudio = function(i) {
    this.repeatCurrentAudio = i
}, AudioPlayer.prototype.setNext = function(i) {
    i = clone(i), AudioUtils.unsetInlineFlagForAudio(i);
    var t = this.getCurrentPlaylist();
    if (t) {
        var e = AudioUtils.audioObject(this.getCurrentAudio()) || t.list[0],
            o = AudioUtils.audioObject(i);
        if (e && o.fullId == e.fullId) return;
        var a = this.getAudioPlaylistPosition(e, t);
        if (-1 == a) return;
        var l = this.getAudioPlaylistPosition(o, t);
        if (-1 != l) return t.list.splice(l, 1), void t.list.splice(a + 1, 0, i);
        if (AudioUtils.getPlaylistType(t) != AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT) {
            var s = clone(t, !0);
            s.clonedFrom = t.id, s.id = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, vk.id), s.name = "", t = s, this._currentPlaylist = t, this._currentAudio =
                t.list[a], this.audioPlaylists[t.id] = t
        }
        t.list.splice(a + 1, 0, i), t.total = t.list.length
    } else t = this.getPlaylist(AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, vk.id, irand(0, 999))), t.list = [i], t.total = 1, this.play(i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] +
        "_" + i[AudioUtils.AUDIO_ITEM_INDEX_ID], t);
    this.saveCurrentPlaylist()
}, AudioPlayer.prototype.setTabIcon = function(i) {
    setFavIcon(AudioPlayer.tabIcons[i])
}, AudioPlayer.prototype.on = function(i, t, e) {
    isArray(t) || (t = [t]), each(t, function(t, o) {
        this.subscribers.push({
            context: i,
            et: o,
            cb: e
        })
    }.bind(this))
}, AudioPlayer.prototype.off = function(i) {
    this.subscribers = this.subscribers.filter(function(t) {
        return t.context != i
    })
}, AudioPlayer.prototype._notify = function(i, t, e) {
    var o = this._currentAudio;
    if (!this._muteProgressEvents || !inArray(i, [AudioPlayer.EVENT_BUFFERED, AudioPlayer.EVENT_PROGRESS])) switch (each(this.subscribers || [], function(a, l) {
        l.et == i && l.cb(o, t, e)
    }), inArray(i, [AudioPlayer.EVENT_PLAY, AudioPlayer.EVENT_PAUSE]) && (this.subscribers = this.subscribers.filter(function(i) {
        return i.context instanceof Element ? bodyNode.contains(i.context) : !0
    }), AudioUtils.updateCurrentPlaying()), i) {
        case AudioPlayer.EVENT_VOLUME:
            ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_VOLUME, this._userVolume);
            break;
        case AudioPlayer.EVENT_PLAY:
            this.saveCurrentPlaylist(), this.setTabIcon("play");
        case AudioPlayer.EVENT_UPDATE:
            ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_TRACK, this._currentAudio), setCookie("remixcurr_audio", this._currentAudio[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] +
                "_" + this._currentAudio[AudioUtils.AUDIO_ITEM_INDEX_ID], 1);
            break;
        case AudioPlayer.EVENT_PLAYLIST_CHANGED:
            this.saveCurrentPlaylist();
            break;
        case AudioPlayer.EVENT_PROGRESS:
            var a = this._impl.getCurrentProgress();
            ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_PROGRESS, a), this._listenedTime = this._listenedTime || 0, this._listenedTime += a - (this._prevProgress || 0),
                this._prevProgress = a;
            var l = o[AudioUtils.AUDIO_ITEM_INDEX_DURATION],
                s = o[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + o[AudioUtils.AUDIO_ITEM_INDEX_ID];
            !this._listened[s] && this._listenedTime * l > AudioPlayer.LISTEN_TIME && (this._sendPlayback(), this._listened[s] = !0);
            break;
        case AudioPlayer.EVENT_PAUSE:
            this.setTabIcon("pause");
            break;
        case AudioPlayer.EVENT_ENDED:
            var r = this.getCurrentPlaylist();
            if (r.statusOf) {
                var u = this.getAudioPlaylistPosition(o, r);
                if (u == r.list.length - 1) {
                    var d = this;
                    ajax.post("al_audio.php", {
                        act: "get_audio_status",
                        oid: r.statusOf
                    }, {
                        onDone: function(i, t) {
                            o && o[AudioUtils.AUDIO_ITEM_INDEX_ID] != t[AudioUtils.AUDIO_ITEM_INDEX_ID] && (r.list.push(o), r.total = r.list.length, d.play())
                        }
                    })
                }
            }
    }
}, AudioPlayer.prototype.deletePlaylist = function(i) {
    delete this.audioPlaylists[i]
}, AudioPlayer.prototype._initPlaybackParams = function() {
    var i = this.getCurrentPlaylist();
    if (void 0 === i.playbackParams) {
        var t = AudioUtils.audioObject(this.getCurrentAudio()),
            e = i.playbackParams = {},
            o = i.originalId || i.id;
        if (i.isStatus && (e.status = 1), AudioUtils.getPlaylistType(o) == AudioUtils.AUDIO_PLAYLIST_TYPE_RECOMS && (e.recommendation = 1), AudioUtils.getPlaylistType(o) ==
            AudioUtils.AUDIO_PLAYLIST_TYPE_POPULAR && (intval(AudioUtils.getPlaylistAlbumId(o)) && (e.popular_genre = 1), e.top_audio = 1), AudioUtils.getPlaylistType(o) ==
            AudioUtils.AUDIO_PLAYLIST_TYPE_FEED && (e.feed_audio = 1), AudioUtils.getPlaylistType(o) == AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM && (AudioUtils.getPlaylistAlbumId(
                    o) == AudioUtils.AUDIO_ALBUM_ID_ALL && i.pop_band && (e.top_bands = 1, e.friend = AudioUtils.getPlaylistOwner(o)), AudioUtils.getPlaylistAlbumId(o) !=
                AudioUtils.AUDIO_ALBUM_ID_ALL && (e.album = 1)), AudioUtils.getPlaylistType(o) == AudioUtils.AUDIO_PLAYLIST_TYPE_ALBUM && nav.objLoc.friend) {
            var a = intval(nav.objLoc.friend);
            0 > a ? e.club = a : e.friend = a
        }
        "search" != cur.module || "audio" != nav.objLoc["c[section]"] || nav.objLoc["c[q]"] || (e.top = 1), (("groups" == cur.module || "public" == cur.module) && cur.oid == t
                .ownerId && cur.oid < 0 || cur.audioPage && cur.audioPage.options.oid == t.ownerId && cur.audioPage.options.oid < 0) && (e.group = 1), (("audio" == cur.module ||
                "feed" == cur.module) && nav.objLoc.q || "search" == cur.module && nav.objLoc["c[q]"] || AudioUtils.getPlaylistType(o) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH) &&
            (e.search = 1), e.search || "feed" != cur.module || (e.feed = 1), i.playbackParams = e
    }
}, AudioPlayer.prototype._sendStatusExport = function() {
    var i = this.getCurrentAudio();
    if (i && (i = AudioUtils.audioObject(i), this.hasStatusExport() && i.id != this.statusSent)) {
        var t = this.getCurrentPlaylist(),
            e = t ? t.playbackParams : null;
        setTimeout(ajax.post.pbind("al_audio.php", {
            act: "audio_status",
            full_id: i.fullId,
            hash: vk.audioParams.addHash,
            top: intval(e && (e.top_audio || e.top))
        }), 0), this.statusSent = i.id
    }
}, AudioPlayer.prototype._sendPlayback = function() {
    var i = AudioUtils.audioObject(this.getCurrentAudio()),
        t = this.getCurrentPlaylist();
    if (t.playbackParams) {
        var e = extend({
            act: "playback",
            full_id: i.fullId
        }, t.playbackParams);
        i.ownerId == vk.id && i.id && (e.id = i.id), ajax.post("al_audio.php", e)
    }
}, AudioPlayer.prototype.saveCurrentPlaylist = function() {
    if (this._currentPlaylist) {
        var i = clone(this._currentPlaylist, !0);
        each(i, function(t) {
            inArray(t, ["id", "name", "next_offset", "offset", "list", "originalId", "playbackParams"]) || delete i[t]
        }), AudioUtils.getPlaylistType(i) != AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && (i.id = AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, vk.id,
            irand(0, 999))), ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_PL, i), ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_SAVED, vkNow())
    }
}, AudioPlayer.prototype.setVolume = function(i) {
    this._userVolume = i, this._queueTask("volume", function(t) {
        this._impl.setVolume(i), t()
    }.bind(this)), this._notify(AudioPlayer.EVENT_VOLUME, i)
}, AudioPlayer.prototype.getVolume = function(i) {
    return this._userVolume
}, AudioPlayer.prototype.seek = function(i) {
    this._clearQueueTasks("fade-in"), this._queueTask("seek", function(t) {
        this._impl.seek(i), this._impl.setVolume(this._userVolume), this._prevProgress = this._impl.getCurrentProgress(), t()
    }.bind(this))
}, AudioPlayer.prototype.setCurrentPlaylist = function(i) {
    this._currentPlaylist = AudioUtils.makeCurrentPlaylist(i)
}, AudioPlayer.prototype.play = function(i, t, e) {
    var o = this;
    this._impl.onReady(function() {
        o._play(i, t, e)
    })
}, AudioPlayer.prototype._play = function(i, t, e) {
    i = isString(i || "") ? i : AudioUtils.audioObject(i)
        .fullId;
    var o = AudioUtils.audioObject(this._currentAudio);
    !i && o && (i = o.fullId);
    var a = this._currentPlaylist && t ? this._currentPlaylist.id == t.id || this._currentPlaylist.originalId == t.id : !1,
        l = i && o && i == o.fullId,
        s = this;
    if (l && a) {
        this._sendLCNotification(), this._isPlaying = !0, this._notify(AudioPlayer.EVENT_PLAY), this._clearQueueTasks("fade-out"), this._clearQueueTasks("pause");
        var r = AudioUtils.findAudioInPlaylist(i, t)[0];
        this._queueTask("play", function(i) {
            s._impl.setUrl(r[AudioUtils.AUDIO_ITEM_INDEX_URL]), s._impl.play(), i()
        }), this._queueTask("fade-in", function(i) {
            s._impl.fadeVolume(s._userVolume, i)
        })
    } else if (i) {
        t || (t = this.getCurrentPlaylist());
        var r = AudioUtils.findAudioInPlaylist(i, t)[0];
        r && (a || (AudioUtils.getPlaylistType(t) != AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && (this._prevPlaylist = this._currentPlaylist), this._currentPlaylist = AudioUtils
                .makeCurrentPlaylist(t), t.initedByUser = !0), this._muteProgressEvents = !0, this._listenedTime = this._prevProgress = 0, this._currentAudio = r, this._isPlaying = !
            0, this._sendLCNotification(), this._notify(AudioPlayer.EVENT_PLAY, !0, e), this._clearQueueTasks("fade-out"), this._clearQueueTasks("fade-in"), this._clearQueueTasks(
                "play"), this._clearQueueTasks("delay"), this._queueTask("fade-out", function(i) {
                s._impl.fadeVolume(0, i)
            }), this._queueTask("delay", function(i) {
                clearTimeout(s.delayTO), s.delayTO = setTimeout(i, 300)
            }), this._queueTask("play", function(i) {
                s._muteProgressEvents = !1, s._impl.setUrl(r[AudioUtils.AUDIO_ITEM_INDEX_URL]), s._impl.play(), i()
            }), this._queueTask("fade-in", function(i) {
                s._impl.fadeVolume(s._userVolume, i)
            }), a || (this._initPlaybackParams(), this._notify(AudioPlayer.EVENT_PLAYLIST_CHANGED, t)), this._sendStatusExport())
    }
}, AudioPlayer.prototype.getCurrentPlaylist = function() {
    return this._currentPlaylist
}, AudioPlayer.prototype.getPlaylists = function() {
    return this.audioPlaylists
}, AudioPlayer.prototype.getAudioPlaylistPosition = function(i, t) {
    return t ? AudioUtils.findAudioInPlaylist(i, t)[1] : -1
}, AudioPlayer.prototype.pause = function(i, t) {
    this._isPlaying = !1, this._notify(AudioPlayer.EVENT_PAUSE);
    var e = this;
    this._queueTask("fade-out", function(i) {
        e._impl.fadeVolume(0, i)
    }), this._queueTask("pause", function(i) {
        e._impl.pause(), i()
    })
}, AudioPlayer.prototype.stop = function() {
    this._isPlaying = !1, this._impl.stop(), this._notify(AudioPlayer.EVENT_STOP)
}, AudioPlayer.prototype.isPlaying = function() {
    return this._isPlaying
}, AudioPlayer.prototype.getCurrentAudio = function() {
    return this._currentAudio
}, AudioPlayer.prototype._clearQueueTasks = function(i) {
    this._tasks = this._tasks.filter(function(t) {
        return t.name != i
    }), this._currTask && this._currTask.name == i && (this._currTask = null)
}, AudioPlayer.prototype._queueTask = function(i, t) {
    isFunction(i) && (t = i, i = "task_" + irand(0, 99999) + "_" + vkNow()), this._tasks.push({
        name: i,
        fn: t
    }), setTimeout(this._triggerTasks.bind(this))
}, AudioPlayer.prototype._triggerTasks = function() {
    if (!this._currTask && this._tasks.length) {
        var i = this;
        this._currTask = this._tasks[0],
            function(t) {
                t.fn.call(this, function() {
                    var e = i._currTask && t.name == i._currTask.name;
                    e && (i._currTask = null, i._tasks.shift(), setTimeout(i._triggerTasks.bind(i)))
                })
            }(this._currTask)
    }
}, AudioPlayer.prototype.playNext = function() {
    this._playNext(1)
}, AudioPlayer.prototype.playPrev = function() {
    this._playNext(-1)
}, AudioPlayer.prototype._playNext = function(i) {
    if (this._currentAudio && this._currentPlaylist) {
        var t = this.getAudioPlaylistPosition(this._currentAudio, this._currentPlaylist) + i;
        0 > t ? (this.seek(0), t = 0) : (t >= this._currentPlaylist.list.length && (t = 0), this.play(this._currentPlaylist.list[t], this._currentPlaylist, i > 0 ? 1 : -1))
    }
}, AudioPlayerFlash.onAudioFinishCallback = function() {
    var i = AudioPlayerFlash.instance;
    i.opts.onEnd && i.opts.onEnd()
}, AudioPlayerFlash.onAudioProgressCallback = function(i, t) {
    var e = AudioPlayerFlash.instance;
    e._total = t, e._currProgress = i / t, e.opts.onProgressUpdate && e.opts.onProgressUpdate(e._currProgress)
}, AudioPlayerFlash.onAudioLoadProgressCallback = function(i, t) {
    var e = AudioPlayerFlash.instance;
    e._currBuffered = i / t, e.opts.onBufferUpdate && e.opts.onBufferUpdate(e._currBuffered)
}, AudioPlayerFlash.prototype.fadeVolume = function(i, t) {
    t && setTimeout(t, 0)
}, AudioPlayerFlash.prototype.onReady = function(i) {
    this._onReady = i;
    var t = {
            url: "/swf/audio_lite.swf",
            id: "player",
            height: 2
        },
        e = {
            swliveconnect: "true",
            allowscriptaccess: "always",
            wmode: "opaque"
        },
        o = {
            onPlayFinish: "AudioPlayerFlash.onAudioFinishCallback",
            onLoadProgress: "AudioPlayerFlash.onAudioLoadProgressCallback",
            onPlayProgress: "AudioPlayerFlash.onAudioProgressCallback"
        },
        a = "flash_audio";
    ge(a) || document.body.appendChild(ce("div", {
        id: a,
        className: "fixed"
    }));
    var l = this;
    renderFlash(a, t, e, o) && setTimeout(function() {
        l._checkFlashLoaded()
    }, 50)
}, AudioPlayerFlash.prototype.setUrl = function(i, t) {
    this._player && this._player.loadAudio(i), t && t()
}, AudioPlayerFlash.prototype.setVolume = function(i) {
    this._player && this._player.setVolume && this._player.setVolume(i)
}, AudioPlayerFlash.prototype.play = function() {
    this._player && this._player.playAudio()
}, AudioPlayerFlash.prototype.seek = function(i) {
    var t = (this._total || 0) * i;
    this._player && this._player.playAudio(t)
}, AudioPlayerFlash.prototype.pause = function() {
    this._player && this._player.pauseAudio()
}, AudioPlayerFlash.prototype.getCurrentProgress = function() {
    return this._currProgress || 0
}, AudioPlayerFlash.prototype.getCurrentBuffered = function() {
    return this._currBuffered || 0
}, AudioPlayerFlash.prototype._checkFlashLoaded = function() {
    var i = ge("player");
    if (i && i.paused) {
        this._player = i;
        var t = this._onReady;
        t && t(), this._onReady = null
    } else {
        var e = this;
        setTimeout(function() {
            e._checkFlashLoaded()
        }, 50)
    }
}, AudioPlayerHTML5.AUDIO_EL_ID = "ap_audio", AudioPlayerHTML5.isSupported = function() {
    var i = document.createElement("audio");
    return !(!i.canPlayType || !i.canPlayType("audio/mpeg;")
        .replace(/no/, ""))
}, AudioPlayerHTML5.prototype._getAudioEl = function() {
    if (!this._audioEl && !(this._audioEl = ge(AudioPlayerHTML5.AUDIO_EL_ID))) {
        var i = this._audioEl = ce("audio", {
            id: AudioPlayerHTML5.AUDIO_EL_ID
        });
        if (inArray(i.canPlayType("audio/mpeg"), ["probably", "maybe"])) {
            document.body.appendChild(i);
            var t = this;
            this.opts.onBufferUpdate && addEvent(i, "progress", function() {
                t.opts.onBufferUpdate(t.getCurrentBuffered())
            }), this.opts.onProgressUpdate && addEvent(i, "timeupdate", function() {
                t.opts.onProgressUpdate(t.getCurrentProgress())
            }), this.opts.onEnd && addEvent(i, "ended", function() {
                t.opts.onEnd()
            }), addEvent(i, "canplay", function() {
                if (t._seekOnReady) {
                    var i = t._seekOnReady;
                    t._seekOnReady = !1, t.seek(i)
                }
            })
        } else this._audioEl = null
    }
    return this._audioEl
}, AudioPlayerHTML5.prototype.onReady = function(i) {
    i()
}, AudioPlayerHTML5.prototype.seek = function(i) {
    var t = this._getAudioEl();
    isNaN(t.duration) ? this._seekOnReady = i : t.currentTime = t.duration * i
}, AudioPlayerHTML5.prototype.setVolume = function(i) {
    var t = this._getAudioEl();
    t.volume = i
}, AudioPlayerHTML5.prototype.getCurrentProgress = function() {
    var i = this._getAudioEl();
    return isNaN(i.duration) ? 0 : Math.max(0, Math.min(1, i.currentTime / i.duration))
}, AudioPlayerHTML5.prototype.getCurrentBuffered = function() {
    var i = this._getAudioEl();
    return i && i.buffered.length ? Math.min(1, i.buffered.end(0) / i.duration) : 0
}, AudioPlayerHTML5.prototype.setUrl = function(i, t) {
    var e = this._getAudioEl();
    return this._seekOnReady = !1, e.src == i ? t && t() : (t && addEvent(e, "loadedmetadata", function() {
        t(), removeEvent(e, "loadedmetadata")
    }), void(e.src = i))
}, AudioPlayerHTML5.prototype.play = function() {
    var i = this._getAudioEl();
    i.src && i.play()
}, AudioPlayerHTML5.prototype.pause = function() {
    var i = this._getAudioEl();
    i.src && i.pause()
}, AudioPlayerHTML5.prototype.stop = function() {
    var i = this._getAudioEl();
    i.src = ""
}, AudioPlayerHTML5.prototype._setFadeVolumeInterval = function(i) {
    if (i) {
        if (!this._fadeVolumeWorker && window.Worker && window.Blob) {
            var t = new Blob([
                "         var interval;         onmessage = function(e) {           clearInterval(interval);           if (e.data == 'start') {             interval = setInterval(function() { postMessage({}); }, 60); }           }       "
            ]);
            try {
                this._fadeVolumeWorker = new Worker(window.URL.createObjectURL(t))
            } catch (e) {
                this._fadeVolumeWorker = !1
            }
        }
        this._fadeVolumeWorker ? (this._fadeVolumeWorker.onmessage = i, this._fadeVolumeWorker.postMessage("start")) : this._fadeVolumeInterval = setInterval(i, 60)
    } else this._fadeVolumeWorker && this._fadeVolumeWorker.postMessage("stop"), this._fadeVolumeInterval && clearInterval(this._fadeVolumeInterval)
}, AudioPlayerHTML5.prototype.fadeVolume = function(i, t) {
    var e = this._getAudioEl();
    i = Math.max(0, Math.min(1, i));
    var o = i < e.volume ? -.25 : .14;
    Math.abs(i - e.volume) <= o && t && t();
    var a = e.volume;
    this._setFadeVolumeInterval(function() {
        a += o;
        var l = !1;
        l = 0 > o ? i >= a : a >= i, l && (a = i, this._setFadeVolumeInterval(), t && t()), e.volume = a
    }.bind(this))
};
try {
    stManager.done("audioplayer.js")
} catch (e) {}
