function TopAudioPlayer(t, i) {
    this.ap = getAudioPlayer(), this._el = t, this._playIconBtn = ge("top_audio"), this.init()
}

function AudioPlaylist(t, i, e) {
    if (this.constructor != AudioPlaylist) throw new Error("AudioPlaylist was called without 'new' operator");
    var o = {};
    return t && isFunction(t.getId) ? (this._ref = t, void getAudioPlayer()
        .addPlaylist(this)) : (isObject(t) ? o = t : (o.ownerId = i, o.type = t, o.albumId = e || ++AudioPlaylist.plIndex), this._type = o.type, this._ownerId = o.ownerId ||
        vk.id, this._albumId = o.albumId || 0, o.copied && (this._copied = o.copied), this._list = [], this.mergeWith(o), getAudioPlayer()
        .addPlaylist(this), this)
}

function AudioPlayer() {
    function t() {
        i._repeatCurrent ? (i._implSeekImmediate(0), i._implPlay()) : (i._isPlaying = !1, i.notify(AudioPlayer.EVENT_PAUSE), i.notify(AudioPlayer.EVENT_ENDED), i.playNext(!0))
    }
    this._currentAudio = !1, this._isPlaying = !1, this._prevPlaylist = null, this._currentPlaylist = null, this._playlists = [], this.subscribers = [], this._tasks = [], this._listened = {},
        this._statusExport = {}, this._currentPlayingRows = [], this._currentProgress = 0;
    var i = this,
        e = {
            onBufferUpdate: function(t) {
                i.notify(AudioPlayer.EVENT_BUFFERED, t)
            },
            onSeeked: function() {
                i._currentProgress = 0
            },
            onSeek: function() {
                i._currentProgress = 0
            },
            onEnd: function() {
                "html5" != i._impl.type && t()
            },
            onProgressUpdate: function(e) {
                if (!i._muteProgressEvents) {
                    i.notify(AudioPlayer.EVENT_PROGRESS, e);
                    var o = 0;
                    i._currentProgress && (o = e - i._currentProgress, o = o > 0 ? o : 0), i._currentProgress = e, e >= 1 - o && "html5" == i._impl.type && t()
                }
            }
        };
    AudioPlayerHTML5.isSupported() ? this._impl = new AudioPlayerHTML5(e) : browser.flash && (this._impl = new AudioPlayerFlash(e)), this._implSetVolume(0), this._initEvents(),
        setTimeout(function() {
            i._restoreState()
        })
}

function AudioPlayerFlash(t) {
    this.opts = t || {}, AudioPlayerFlash.instance = this
}

function AudioPlayerHTML5(t) {
    this.opts = t || {}, this._checkUrlTOs = {}, this._checkedUrls = {}, this._onReadyCallbacks = {}, this._canPlayTimeout = AudioPlayerHTML5.FAILED_URL_TIMEOUT, this._currentAudioEl =
        this._createAudioEl(), this._prefetchAudioEl = this._createAudioEl()
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
    AUDIO_ITEM_INDEX_EXTRA: 12,
    AUDIO_ITEM_INLINED_BIT: 1,
    AUDIO_ITEM_CLAIMED_BIT: 16,
    AUDIO_ITEM_RECOMS_BIT: 64,
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
    showNeedFlashBox: function() {},
    addAudio: function(t) {
        function i() {
            return intval(domData(o, "in-progress"))
        }

        function e(t) {
            return domData(o, "in-progress", intval(t))
        }
        var o = gpeByClass("_audio_row", t);
        if (!i()) {
            e(!0);
            var a = window.AudioPage && AudioPage(o),
                s = a && a.options.oid < 0 && a.options.canAudioAddToGroup,
                l = s ? -a.options.oid : 0,
                r = AudioUtils.getAudioFromEl(o, !0),
                u = AudioUtils.asObject(r),
                n = vk.audioParams.addHash,
                d = vk.audioParams.deleteHash;
            cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {};
            var _ = cur._audioAddRestoreInfo[u.fullId],
                A = ge("audio_" + u.fullId);
            if (A = A == o ? !1 : A, _) {
                if ("recom_hidden" == _.state) a && (a.restoreRecommendation(o), e(!1));
                else if ("deleted" == _.state) ajax.post("al_audio.php", {
                    act: "restore_audio",
                    oid: u.ownerId,
                    aid: u.id,
                    hash: n
                }, {
                    onDone: function() {
                        e(!1)
                    }
                }), removeClass(o, "audio_deleted"), removeClass(o, "canadd"), addClass(o, "canedit"), delete cur._audioAddRestoreInfo[u.fullId];
                else if ("added" == _.state) {
                    var p = _.addedFullId.split("_");
                    ajax.post("al_audio.php", {
                            act: "delete_audio",
                            oid: p[0],
                            aid: p[1],
                            hash: d
                        }, {
                            onDone: function() {
                                if (a) {
                                    var t = getAudioPlayer()
                                        .getPlaylist(AudioPlaylist.TYPE_ALBUM, l ? -l : vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL);
                                    t.removeAudio(_.addedFullId)
                                }
                                e(!1)
                            }
                        }), removeClass(o, "added"), addClass(o, "canadd"), A && (removeClass(A, "added"), addClass(A, "canadd")), delete cur._audioAddRestoreInfo[u.fullId],
                        getAudioPlayer()
                        .notify(AudioPlayer.EVENT_REMOVED, u.fullId, _.addedFullId)
                }
            } else ajax.post("al_audio.php", {
                    act: "add",
                    gid: l,
                    oid: u.ownerId,
                    aid: u.id,
                    hash: n
                }, {
                    onDone: function(t, i, o, s) {
                        var r = t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID];
                        if (cur._audioAddRestoreInfo[u.fullId] = {
                                state: "added",
                                addedFullId: r
                            }, a) {
                            var n = getAudioPlayer()
                                .getPlaylist(AudioPlaylist.TYPE_ALBUM, l ? -l : vk.id, AudioUtils.AUDIO_ALBUM_ID_ALL);
                            n.addAudio(t, 0)
                        }
                        e(!1)
                    }
                }), removeClass(o, "canadd"), addClass(o, "added"), A && (removeClass(A, "canadd"), addClass(A, "added")), getAudioPlayer()
                .notify(AudioPlayer.EVENT_ADDED, u.fullId)
        }
    },
    drawAudio: function(t, i) {
        for (var e = JSON.parse(getTemplate("audio_bits_to_cls")), o = t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS], a = [], s = 0; 32 > s; s++) {
            var l = 1 << s;
            o & l && a.push(e[l])
        }
        i && a.push("inlined");
        var r = formatTime(t[AudioUtils.AUDIO_ITEM_INDEX_DURATION]),
            u = encodeURIComponent(replaceEntities(t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER])
                .replace(/(<em>|<\/em>)/g, "")),
            n = clean(JSON.stringify(t))
            .replace(/\$\&/, "$$$&"),
            d = getTemplate("audio_row", t);
        return d = d.replace(/%cls%/, a.join(" ")), d = d.replace(/%duration%/, r), d = d.replace(/%performer_escaped%/, u), d = d.replace(/%serialized%/, n)
    },
    isRecomAudio: function(t) {
        return t = AudioUtils.asObject(t), t.flags & AudioUtils.AUDIO_ITEM_RECOMS_BIT
    },
    isClaimedAudio: function(t) {
        return t = AudioUtils.asObject(t), t.flags & AudioUtils.AUDIO_ITEM_CLAIMED_BIT
    },
    getAudioExtra: function(t) {
        return t = AudioUtils.asObject(t), JSON.parse(t.extra || "{}")
    },
    getAudioFromEl: function(t, i) {
        var e = data(t, "audio");
        return e || (e = JSON.parse(domData(t, "audio"))), i ? AudioUtils.asObject(e) : e
    },
    showAudioLayer: function(btn) {
        stManager.add(["ui_controls.js", "ui_controls.css", "audio.css"], function() {
            function initLayer(html, playlist, options, firstSong, script) {
                eval(script);
                var telContent = ap.layer.getContent();
                addClass(telContent, "no_transition"), removeClass(telContent, "top_audio_loading"), telContent.innerHTML = html;
                var layerScrollNode = geByClass1("audio_layer_rows_wrap", telContent);
                setStyle(layerScrollNode, "height", Math.max(clientHeight() * AudioUtils.AUDIO_LAYER_HEIGHT_RATIO, AudioUtils.AUDIO_LAYER_HEIGHT_MIN_HEIGHT)),
                    options.layer = ap.layer, options.layer.sb = new Scrollbar(layerScrollNode, {
                        nomargin: !0,
                        right: vk.rtl ? "auto" : 0,
                        left: vk.rtl ? 0 : "auto",
                        global: !0,
                        nokeys: !0,
                        scrollElements: [geByClass1("audio_layer_menu_wrap", telContent)]
                    }), data(layerScrollNode, "sb", options.layerScrollbar);
                var audioPage = new AudioPage(geByClass1("_audio_layout", telContent), playlist, options, firstSong);
                data(ap.layer, "audio-page", audioPage), setTimeout(function() {
                    removeClass(telContent, "no_transition")
                })
            }

            function getPageEl() {
                return geByClass1("js-im-page") || ge("page_body")
            }

            function getLayerWidth() {
                return Math.max(AudioUtils.AUDIO_LAYER_MIN_WIDTH, Math.min(AudioUtils.AUDIO_LAYER_MAX_WIDTH, getSize(getPageEl())[0] - BORDER_COMPENSATION))
            }

            function getAudioBtn() {
                var t = geByClass1("_top_nav_audio_btn");
                return hasClass(t, "top_audio_player_enabled") && (t = geByClass1("top_audio_player")), t
            }
            var ap = getAudioPlayer(),
                currentPlaylist = ap.getCurrentPlaylist();
            if (ap.layer)
                if (hasClass(btn, "active")) ap.layer.hide(), removeClass(btn, "active"), topHeaderClearClose();
                else {
                    ap.layer.show();
                    var initFunc = data(ap.layer, "init-func");
                    if (initFunc) data(ap.layer, "init-func", null), initFunc();
                    else {
                        var audioPage = data(ap.layer, "audio-page");
                        audioPage && audioPage.onShow()
                    }
                    addClass(btn, "active"), topHeaderClose(function() {
                        ap.layer.hide()
                    })
                }
            else {
                var BORDER_COMPENSATION = 2;
                ap.layer = new ElementTooltip(btn, {
                    delay: 0,
                    content: rs(vk.pr_tpl, {
                        id: ""
                    }),
                    cls: "top_audio_loading top_audio_layer",
                    showImmediate: !0,
                    autoShow: !1,
                    appendTo: document.body,
                    hideOnClick: !0,
                    elClassWhenTooltip: "audio_top_btn_active",
                    onHide: function(t, i) {
                        audioPage = data(ap.layer, "audio-page"), audioPage && audioPage.onHide(), removeClass(btn, "active"), i && topHeaderClearClose()
                    },
                    width: getLayerWidth,
                    setPos: function() {
                        var t = getXY(getPageEl()),
                            i = getSize(getPageEl())[0] - BORDER_COMPENSATION,
                            e = getLayerWidth(),
                            o = getAudioBtn(),
                            a = getXY(o)[0],
                            s = getSize(o)[0],
                            l = a + s / 2,
                            r = l - e / 2;
                        i <= AudioUtils.AUDIO_LAYER_MAX_WIDTH && i >= AudioUtils.AUDIO_LAYER_MIN_WIDTH && (r = t[0]);
                        var u = 37,
                            n = a - r + Math.min(s / 2, u);
                        return setPseudoStyle(this.getContent(), "after", {
                            left: n + "px"
                        }), {
                            left: r,
                            top: AudioUtils.AUDIO_LAYER_TOP,
                            position: "fixed"
                        }
                    }
                }), addClass(btn, "active"), ajax.post("al_audio.php", {
                    act: "show_layer",
                    my: currentPlaylist ? 0 : 1
                }, {
                    onDone: function(t, i, e, o, a) {
                        var s = i;
                        ap.layer.isShown() ? initLayer(t, s, e, o, a) : data(ap.layer, "init-func", initLayer.pbind(t, s, e, o, a))
                    }
                }), topHeaderClose(function() {
                    ap.layer.hide()
                })
            }
        })
    },
    filterClaimedAudios: function(t) {
        t.list = t.list.filter(function(t) {
            return !(intval(t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS]) & AudioUtils.AUDIO_ITEM_CLAIMED_BIT)
        })
    },
    prepareAudioForPlaylist: function(t) {
        return t[AudioUtils.AUDIO_ITEM_INDEX_TITLE] = clean(replaceEntities(t[AudioUtils.AUDIO_ITEM_INDEX_TITLE])
            .replace(/(<em>|<\/em>)/g, "")), t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] = clean(replaceEntities(t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER])
            .replace(/(<em>|<\/em>)/g, "")), t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] &= ~AudioUtils.AUDIO_ITEM_INLINED_BIT, t
    },
    unsetInlineFlagForPlaylist: function(t) {
        for (var i = 0, e = t.list.length; e > i; i++) t.list[i] = AudioUtils.prepareAudioForPlaylist(t.list[i])
    },
    asObject: function(t) {
        return t ? isObject(t) ? t : "string" == typeof t ? {
            id: t
        } : {
            id: intval(t[AudioUtils.AUDIO_ITEM_INDEX_ID]),
            owner_id: intval(t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID]),
            ownerId: t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID],
            fullId: t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID],
            title: t[AudioUtils.AUDIO_ITEM_INDEX_TITLE],
            performer: t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER],
            duration: intval(t[AudioUtils.AUDIO_ITEM_INDEX_DURATION]),
            url: t[AudioUtils.AUDIO_ITEM_INDEX_URL],
            flags: t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS],
            context: t[AudioUtils.AUDIO_ITEM_INDEX_CONTEXT],
            extra: t[AudioUtils.AUDIO_ITEM_INDEX_EXTRA]
        } : null
    },
    initDomPlaylist: function(t, i) {
        var e = (getAudioPlayer(), []);
        return each(i, function(t, i) {
            i && each(geByClass("_audio_row", i), function(t) {
                e.push(AudioUtils.getAudioFromEl(this))
            })
        }), t.addAudio(e), t
    },
    getContextPlaylist: function(t) {
        function i(t) {
            return [].slice.call(t)
        }
        var e = null,
            o = [],
            a = getAudioPlayer(),
            s = 0,
            l = AudioUtils.getAudioFromEl(t, !0),
            r = null,
            u = gpeByClass("_audio_playlist", t);
        if (u) return data(u, "playlist");
        if (!cur.pid && inArray(cur.module, ["public", "wall", "groups"]) && (r = domClosest("_wall_audio_rows", t))) {
            var n = inArray(cur.wallType, ["own", "full_own"]) ? "own" : "all";
            if (s = hashCode(n + "_" + (cur.wallQuery || "")), e = a.getPlaylist(AudioPlaylist.TYPE_WALL, cur.oid, s), -1 == e.indexOfAudio(l)) {
                e.clean();
                var d = gpeByClass("_post", t),
                    _ = domData(d, "post-id")
                    .split("_")[1];
                e.mergeWith({
                    postId: _,
                    wallQuery: cur.wallQuery,
                    wallType: n
                })
            }
            o = i([r])
        } else if (r = domClosest("choose_audio_rows", t)) cur.chooseAudioPlaylist = e = new AudioPlaylist(AudioPlaylist.TYPE_TEMP, vk.id, irand(999, 99999)), o = [r];
        else if (r = domClosest("_im_peer_history", t)) o = i(geByClass("_im_mess", r));
        else if (r = domClosest("replies_list", t)) o = i(geByClass("wall_audio_rows", r));
        else if (r = domClosest("_bt_rows", t)) o = i(geByClass("_wall_audio_rows", r));
        else if (r = domClosest("_feed_rows", t)) o = i(geByClass("wall_text", r)), s = "feed";
        else if ((r = domClosest("wall_posts", t)) && !domClosest("wall_tt", t)) {
            o = i(geByClass("wall_text", r));
            var A = geByClass1("post_fixed");
            A && o.unshift(geByClass1("wall_text", A))
        } else(r = gpeByClass("_module", t)) ? (e = a.getPlaylist(AudioPlaylist.TYPE_ALBUM, cur.oid, AudioUtils.AUDIO_ALBUM_ID_ALL), e.loadSilent(), o = [r]) : o = [domPN(
            t)];
        return e || (e = a.getPlaylist(AudioPlaylist.TYPE_TEMP, vk.id, s)), e = AudioUtils.initDomPlaylist(e, o), -1 == e.indexOfAudio(l) && (e = new AudioPlaylist(
            AudioPlaylist.TYPE_TEMP, vk.id, irand(999, 99999)), e = AudioUtils.initDomPlaylist(e, [domPN(t)])), e
    }
};
TopAudioPlayer.TITLE_CHANGE_ANIM_SPEED = 190, TopAudioPlayer.init = function() {
        var t = ge("top_audio_player"),
            i = data(t, "object");
        i || (i = new TopAudioPlayer(t), data(t, "object", i))
    }, TopAudioPlayer.prototype.init = function() {
        function t(t) {
            return hasClass(this, "top_audio_player_play") ? (i.ap.isPlaying() ? i.ap.pause() : i.ap.play(), !1) : hasClass(this, "top_audio_player_prev") ? (i.ap.playPrev(), !1) :
                hasClass(this, "top_audio_player_next") ? (i.ap.playNext(), !1) : void 0
        }
        var i = this;
        this.ap.on(this, AudioPlayer.EVENT_UPDATE, this.onPlay.bind(this)), this.ap.on(this, AudioPlayer.EVENT_PLAY, this.onPlay.bind(this)), this.ap.on(this, AudioPlayer.EVENT_PAUSE,
            this.onPause.bind(this)), this.ap.top = this, each(["prev", "play", "next"], function(e, o) {
            addEvent(geByClass1("top_audio_player_" + o, i._el), "click", t)
        }), addEvent(this._el, "click", function(t) {
            return 1 != t.which || hasClass(t.target, "top_audio_player_btn") || hasClass(t.target, "top_audio_player_act_icon") ? void 0 : showAudioLayer(t, ge(
                "top_audio"))
        }), this.onPlay(this.ap.getCurrentAudio())
    }, TopAudioPlayer.prototype.onPlay = function(t, i, e) {
        function o() {
            a.ap.audioLayer && a.ap.audioLayer.isShown() && a.ap.audioLayer.updatePosition(), addClass(a._el, "top_audio_player_enabled"), toggleClass(a._el,
                "top_audio_player_playing", a.ap.isPlaying()), t = AudioUtils.asObject(t), clearTimeout(a._currTitleReTO);
            var i = geByClass1("top_audio_player_title_out", a._el);
            re(i);
            var o = geByClass1("top_audio_player_title", a._el);
            if (0 != e) {
                var s = 0 > e ? -10 : 10,
                    l = o.offsetLeft,
                    r = se('<div class="top_audio_player_title top_audio_player_title_next" style="opacity: 0; top:' + s + "px; left: " + l + 'px">' + t.performer + " &ndash; " +
                        t.title + "</div>");
                r.setAttribute("onmouseover", "setTitle(this)"), e > 0 ? domInsertAfter(r, o) : domInsertBefore(r, o), addClass(o, "top_audio_player_title_out"), setStyle(o, {
                    top: -s,
                    opacity: 0
                }), setTimeout(function() {
                    setStyle(r, {
                        top: 0,
                        opacity: 1
                    })
                }, 1), clearTimeout(a._currTitleReTO), a._currTitleReTO = setTimeout(function() {
                    re(o), removeClass(r, "top_audio_player_title_next")
                }, TopAudioPlayer.TITLE_CHANGE_ANIM_SPEED)
            } else o.innerHTML = t.performer + " &ndash; " + t.title, o.titleSet = 0, o.setAttribute("onmouseover", "setTitle(this)")
        }
        if (t) {
            var a = this;
            e = intval(e), hasClass(this._playIconBtn, "top_audio_player_enabled") ? o() : (addClass(this._playIconBtn, "top_audio_player_enabled"), setTimeout(function() {
                hide(a._playIconBtn), o()
            }, 150))
        }
    }, TopAudioPlayer.prototype.onPause = function() {
        removeClass(this._el, "top_audio_player_playing")
    }, TopAudioPlayer.prototype.onNext = function() {}, AudioPlaylist.plIndex = 0, AudioPlaylist.TYPE_CURRENT = "current", AudioPlaylist.TYPE_ALBUM = "album", AudioPlaylist.TYPE_TEMP =
    "temp", AudioPlaylist.TYPE_RECOM = "recoms", AudioPlaylist.TYPE_POPULAR = "popular", AudioPlaylist.TYPE_SEARCH = "search", AudioPlaylist.TYPE_FEED = "feed", AudioPlaylist.TYPE_LIVE =
    "live", AudioPlaylist.TYPE_WALL = "wall", AudioPlaylist.prototype.serialize = function() {
        var t = {},
            i = getAudioPlayer()
            .getCurrentAudio(),
            e = Math.max(0, this.indexOfAudio(i));
        return t.list = clone(this.getAudiosList()
            .slice(Math.max(0, e - 300), e + 300), !0), each(t.list, function(t, i) {
            i[AudioUtils.AUDIO_ITEM_INDEX_URL] = ""
        }), t.type = AudioPlaylist.TYPE_TEMP, t.ownerId = vk.id, t.albumId = irand(1, 999), t.hasMore = !1, t.title = this.getTitle(), JSON.stringify(t)
    }, AudioPlaylist.prototype.getId = function() {
        return this.getType() + "_" + this.getOwnerId() + "_" + this.getAlbumId()
    }, AudioPlaylist.prototype.isOriginal = function() {
        return !this._ref
    }, AudioPlaylist.prototype.getSelf = function() {
        return this._ref && isObject(this._ref) ? this._ref : this
    }, AudioPlaylist.prototype._unref = function() {
        var t = this._ref;
        if (isObject(t)) {
            for (var i in t)
                if (t.hasOwnProperty(i) && !isFunction(t[i]) && 0 == i.indexOf("_")) {
                    var e = t[i];
                    params[i.substr(1)] = isObject(e) ? clone(e) : e
                }
            this._ref = !0, this._type = params.type, this._ownerId = params.ownerId || vk.id, this._albumId = params.albumId || 0, this._list = [], this.mergeWith(params)
        }
    }, AudioPlaylist.prototype.getType = function() {
        return this.getSelf()
            ._type
    }, AudioPlaylist.prototype.getOwnerId = function() {
        return this.getSelf()
            ._ownerId
    }, AudioPlaylist.prototype.getAlbumId = function() {
        return this.getSelf()
            ._albumId
    }, AudioPlaylist.prototype.getTitle = function() {
        return this.getSelf()
            ._title || ""
    }, AudioPlaylist.prototype.getBlocks = function() {
        return this.getSelf()
            ._blocks || {}
    }, AudioPlaylist.prototype.isPopBand = function() {
        return !!this.getSelf()
            ._band
    }, AudioPlaylist.prototype.getPlaybackParams = function() {
        return this.getSelf()
            ._playbackParams
    }, AudioPlaylist.prototype.setPlaybackParams = function(t) {
        var i = this.getSelf();
        i._playbackParams = t
    }, AudioPlaylist.prototype.hasMore = function() {
        return !!this.getSelf()
            ._hasMore
    }, AudioPlaylist.prototype.getFeedFrom = function() {
        return this.getSelf()
            ._feedFrom
    }, AudioPlaylist.prototype.getFeedOffset = function() {
        return this.getSelf()
            ._feedOffset
    }, AudioPlaylist.prototype._needSilentLoading = function() {
        return this.getType() == AudioPlaylist.TYPE_ALBUM
    }, AudioPlaylist.prototype.getSearchParams = function() {
        return this.getSelf()
            ._searchParams || null
    }, AudioPlaylist.prototype.getLocalFoundCount = function() {
        return this.getSelf()
            ._localFoundTotal
    }, AudioPlaylist.prototype.setLocalFoundCount = function(t) {
        var i = this.getSelf();
        i._localFoundTotal = t
    }, AudioPlaylist.prototype.getTotalCount = function() {
        return this.getSelf()
            ._totalCount
    }, AudioPlaylist.prototype.isShuffled = function() {
        return !!this.getShuffle()
    }, AudioPlaylist.prototype.getShuffle = function() {
        return this.getSelf()
            ._shuffle
    }, AudioPlaylist.prototype._moveCurrentAudioAtFirstPosition = function() {
        this._unref();
        var t = getAudioPlayer()
            .getCurrentAudio(),
            i = this.indexOfAudio(t); - 1 != i && (this._list.splice(i, 1), this._list.unshift(t))
    }, AudioPlaylist.prototype.clean = function() {
        this._unref(), this._hasMore = !0, this._list = [], this._nextOffset = 0
    }, AudioPlaylist.prototype.shuffle = function(t) {
        if (this._unref(), this._shuffle = t, this._shuffle)
            if (this.hasMore()) {
                if (this._needSilentLoading()) return !1;
                if (this.getType() == AudioPlaylist.TYPE_SEARCH) {
                    if (this.getLocalFoundCount() > 1) {
                        var i = this._list.splice(0, this.getLocalFoundCount());
                        this._originalList = [].concat(i), shuffle(i), this._list = i.concat(this._list)
                    }
                } else this.clean()
            } else this._originalList = [].concat(this._list), shuffle(this._list), this._moveCurrentAudioAtFirstPosition();
        else this._originalList ? this.getType() == AudioPlaylist.TYPE_SEARCH ? (this._list.splice(0, this.getLocalFoundCount()), this._list = this._originalList.concat(this._list)) :
            this._list = this._originalList : this.clean(), delete this._shuffle, delete this._originalList;
        return !0
    }, AudioPlaylist.prototype.isComplete = function() {
        return this.getSelf()
            .getType() == AudioPlaylist.TYPE_ALBUM ? this.getSelf()
            ._isComplete : !0
    }, AudioPlaylist.prototype.getNextOffset = function() {
        return this.getSelf()
            ._nextOffset || 0
    }, AudioPlaylist.prototype.getAudiosList = function() {
        return this.getSelf()
            ._list || []
    }, AudioPlaylist.prototype.getItemsList = function() {
        return this.getSelf()
            ._items || []
    }, AudioPlaylist.prototype.getPostId = function() {
        return this.getSelf()
            ._postId
    }, AudioPlaylist.prototype.getWallQuery = function() {
        return this.getSelf()
            ._wallQuery
    }, AudioPlaylist.prototype.getWallType = function() {
        return this.getSelf()
            ._wallType
    }, AudioPlaylist.prototype.getNextAudio = function(t) {
        var i = this.indexOfAudio(t);
        this.load(i);
        var e = 1;
        return i >= 0 && i + e < this.getAudiosCount() ? this.getAudioAt(i + e) : !1
    }, AudioPlaylist.prototype.load = function(t, i) {
        var e = this;
        if (this.getType() == AudioPlaylist.TYPE_SEARCH && void 0 === this.getLocalFoundCount()) {
            var o = getAudioPlayer()
                .getPlaylist(AudioPlaylist.TYPE_ALBUM, this.getOwnerId(), AudioUtils.AUDIO_ALBUM_ID_ALL);
            return void o.loadSilent(function() {
                var a = e.getSearchParams();
                o.search(a.q, function(o) {
                    e.setLocalFoundCount(o.length), e.addAudio(o.reverse()), e.load(t, i)
                })
            })
        }
        var a = this.getType() == AudioPlaylist.TYPE_FEED ? this.getItemsCount() : this.getAudiosCount();
        if (this.hasMore() && 0 == t && a > 0) return i && i(this);
        if (!this.hasMore()) return i && i(this);
        if (this.getType() == AudioPlaylist.TYPE_ALBUM) return this.loadSilent(i);
        if (a - 20 > t) return i && i(this);
        if (this._onDoneLoading = this._onDoneLoading || [], this._onDoneLoading.push(i), !this._loading) {
            this._loading = !0;
            var s = this.getSearchParams();
            ajax.post("al_audio.php", {
                act: "a_load_section",
                type: this.getType(),
                owner_id: this.getOwnerId(),
                album_id: this.getAlbumId(),
                offset: this.getNextOffset(),
                search_q: s ? s.q : null,
                search_performer: s ? s.performer : null,
                search_lyrics: s ? s.lyrics : null,
                search_sort: s ? s.sort : null,
                feed_from: this.getFeedFrom(),
                feed_offset: this.getFeedOffset(),
                shuffle: this.getShuffle(),
                post_id: this.getPostId(),
                wall_query: this.getWallQuery(),
                wall_type: this.getWallType()
            }, {
                onDone: function(t) {
                    getAudioPlayer()
                        .mergePlaylistData(e, t), delete e._loading;
                    var i = e._onDoneLoading;
                    delete e._onDoneLoading, each(i || [], function(t, i) {
                            i && i(e)
                        }), getAudioPlayer()
                        .saveStateCurrentPlaylist()
                }
            })
        }
    }, AudioPlaylist.prototype.getLiveInfo = function() {
        var t = this.getSelf()
            ._live;
        return t ? (t = t.split(","), {
            hostId: t[0],
            audioId: t[1],
            hash: t[2]
        }) : !1
    }, AudioPlaylist.prototype.isLive = function() {
        return !!this.getLiveInfo()
    }, AudioPlaylist.prototype.getAudioAt = function(t) {
        return this.getSelf()
            ._list.length > t ? this.getSelf()
            ._list[t] : null
    }, AudioPlaylist.prototype.getAudiosCount = function() {
        return this.getSelf()
            ._list.length
    }, AudioPlaylist.prototype.getItemsCount = function() {
        var t = this.getSelf();
        return t._items = t._items || [], t._items.length
    }, AudioPlaylist.prototype.removeAudio = function(t) {
        var i = this.indexOfAudio(t);
        if (i >= 0) {
            this._unref();
            var e = this._list.splice(i, 1);
            this._index && this._index.remove(e[0])
        }
    }, AudioPlaylist.prototype.addAudio = function(t, i) {
        function e(t) {
            if (!AudioUtils.isClaimedAudio(t)) {
                var e = o.indexOfAudio(t);
                if (e >= 0) {
                    if (a) return;
                    o._list.splice(e, 1)
                }
                t = clone(t), t[AudioUtils.AUDIO_ITEM_INDEX_TITLE] = clean(replaceEntities(t[AudioUtils.AUDIO_ITEM_INDEX_TITLE])
                        .replace(/(<em>|<\/em>)/g, "")), t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] = clean(replaceEntities(t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER])
                        .replace(/(<em>|<\/em>)/g, "")), t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] &= ~AudioUtils.AUDIO_ITEM_INLINED_BIT, a ? o._list.push(t) : o._list.splice(i, 0, t),
                    o._index && o._index.remove(t)
            }
        }
        this._unref();
        var o = this,
            a = void 0 === i;
        if (isArray(t) && isArray(t[0]))
            for (var s = 0, l = t.length; l > s; s++) e(t[s]);
        else t.length && e(t)
    }, AudioPlaylist.prototype.mergeWith = function(t) {
        if (!isObject(this._ref)) {
            if (t.list)
                for (var i = 0, e = t.list.length; e > i; i++) this.addAudio(t.list[i]);
            if (t.items) {
                this._items = this._items || [];
                for (var i = 0, e = t.items.length; e > i; i++) this._items.push(t.items[i])
            }
            var o = this;
            each("blocks nextOffset hasMore isComplete title feedFrom feedOffset live searchParams totalCount band postId wallQuery wallType".split(" "), function(i, e) {
                void 0 !== t[e] && (o["_" + e] = t[e])
            })
        }
    }, AudioPlaylist.prototype.moveAudio = function(t, i) {
        this._unref();
        var e = this._list.splice(t, 1);
        i > t && (i -= 1), this._list.splice(i, 0, e[0])
    }, AudioPlaylist.prototype.indexOfAudio = function(t) {
        if (!t) return -1;
        var i;
        isString(t) ? i = t : isObject(t) ? i = t.fullId : isArray(t) && (i = t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID]), i = i.split("_");
        for (var e = this.getSelf(), o = 0, a = e._list.length; a > o; o++)
            if (i[0] == e._list[o][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] && i[1] == e._list[o][AudioUtils.AUDIO_ITEM_INDEX_ID]) return o;
        return -1
    }, AudioPlaylist.prototype.getAudio = function(t) {
        isString(t) ? t : AudioUtils.asObject(t)
            .fullId;
        t = t.split("_");
        for (var i = this.getSelf(), e = 0, o = i._list.length; o > e; e++)
            if (t[0] == i._list[e][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] && t[1] == i._list[e][AudioUtils.AUDIO_ITEM_INDEX_ID]) return i._list[e];
        return null
    }, AudioPlaylist.prototype._ensureIndex = function(t) {
        var i = this.getSelf();
        if (this.getType() == AudioPlaylist.TYPE_ALBUM) {
            var e = function(t, i) {
                var e = intval(i);
                return e >= 33 && 48 > e ? String.fromCharCode(e) : t
            };
            i._index = new vkIndexer(i._list, function(t) {
                return (t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] + " " + t[AudioUtils.AUDIO_ITEM_INDEX_TITLE])
                    .replace(/\&\#(\d+);?/gi, e)
            }, t)
        } else t && t()
    }, AudioPlaylist.prototype.search = function(t, i) {
        var e = this.getSelf();
        this._ensureIndex(function() {
            return i(e._index ? e._index.search(t) : [])
        }.bind(this))
    }, AudioPlaylist.prototype.toString = function() {
        return this.getId()
    }, AudioPlaylist.prototype.fetchNextLiveAudio = function(t) {
        var i = this.getLiveInfo(),
            e = this;
        ajax.post("al_audio.php", {
            act: "a_get_audio_status",
            host_id: i.hostId
        }, {
            onDone: function(i) {
                if (i) {
                    var o = e.indexOfAudio(i);
                    o >= 0 ? e.moveAudio(o, e.getAudiosCount() - 1) : e.addAudio(i)
                }
                t && t(i)
            }
        })
    }, AudioPlaylist.prototype.loadSilent = function(t, i) {
        var e = this;
        if (this.hasMore() && this.getType() == AudioPlaylist.TYPE_ALBUM) {
            if (this._onDoneLoading = this._onDoneLoading || [], this._onDoneLoading.push(t), this._silentLoading) return;
            this._silentLoading = !0, ajax.post("al_audio.php", {
                act: "load_silent",
                owner_id: this.getOwnerId(),
                album_id: this.getAlbumId(),
                band: this.isPopBand() ? this.getOwnerId() : !1
            }, {
                showProgress: i ? i.showProgress : !1,
                hideProgress: i ? i.hideProgress : !1,
                onDone: function(t) {
                    getAudioPlayer()
                        .mergePlaylistData(e, t), delete e._silentLoading;
                    var i = e._onDoneLoading;
                    delete e._onDoneLoading, each(i || [], function(t, i) {
                        i && i(e)
                    })
                }
            })
        } else t && t(this)
    }, AudioPlayer.EVENT_PLAY = "start", AudioPlayer.EVENT_PAUSE = "pause", AudioPlayer.EVENT_STOP = "stop", AudioPlayer.EVENT_UPDATE = "update", AudioPlayer.EVENT_LOADED =
    "loaded", AudioPlayer.EVENT_ENDED = "ended", AudioPlayer.EVENT_FAILED = "failed", AudioPlayer.EVENT_BUFFERED = "buffered", AudioPlayer.EVENT_PROGRESS = "progress", AudioPlayer
    .EVENT_VOLUME = "volume", AudioPlayer.EVENT_PLAYLIST_CHANGED = "plchange", AudioPlayer.EVENT_ADDED = "added", AudioPlayer.EVENT_REMOVED = "removed", AudioPlayer.LS_VER = "v10",
    AudioPlayer.LS_KEY_PREFIX = "audio", AudioPlayer.LS_PREFIX = AudioPlayer.LS_KEY_PREFIX + "_" + AudioPlayer.LS_VER + "_", AudioPlayer.LS_VOLUME = "vol", AudioPlayer.LS_PL =
    "pl", AudioPlayer.LS_TRACK = "track", AudioPlayer.LS_SAVED = "saved", AudioPlayer.LS_PROGRESS = "progress", AudioPlayer.LS_DURATION_TYPE = "dur_type", AudioPlayer.LISTEN_TIME =
    10, AudioPlayer.DEFAULT_VOLUME = .8;
var audioIconSuffix = window.devicePixelRatio >= 2 ? "_2x" : "";
AudioPlayer.tabIcons = {
    def: "/images/icons/favicons/fav_logo" + audioIconSuffix + ".ico",
    play: "/images/icons/favicons/fav_play" + audioIconSuffix + ".ico",
    pause: "/images/icons/favicons/fav_pause" + audioIconSuffix + ".ico"
}, AudioPlayer.getLang = function(t) {
    var i = getAudioPlayer();
    return i && i.langs ? i.langs[t] : t
}, AudioPlayer.clearDeprecatedCacheKeys = function() {
    AudioPlayer._iterateCacheKeys(function(t) {
        return t == AudioPlayer.LS_VER
    })
}, AudioPlayer.clearOutdatedCacheKeys = function() {
    var t = ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_SAVED) || 0,
        i = 72e5;
    t < vkNow() - i && AudioPlayer._iterateCacheKeys(function(t, i) {
        return !inArray(i, [AudioPlayer.LS_PL, AudioPlayer.LS_TRACK, AudioPlayer.LS_PROGRESS])
    })
}, AudioPlayer.clearAllCacheKeys = function() {
    AudioPlayer._iterateCacheKeys(function() {
        return !1
    }), setCookie("remixcurr_audio", "", -1)
}, AudioPlayer._iterateCacheKeys = function(t) {
    for (var i in window.localStorage)
        if (0 === i.indexOf(AudioPlayer.LS_KEY_PREFIX + "_")) {
            var e = i.split("_");
            t(e[1], e[2]) || localStorage.removeItem(i)
        }
}, AudioPlayer.prototype.getLayerTT = function() {
    return this.layerTT
}, AudioPlayer.prototype.isImplInited = function() {
    return !!this._impl
}, AudioPlayer.prototype.onMediaKeyPressedEvent = function(t) {
    var i = this.getCurrentAudio();
    this.getCurrentPlaylist();
    if (i) switch (t.keyCode) {
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
}, AudioPlayer.prototype.deletePlaylist = function(t) {
    for (var i = 0; i < this._playlists.length; i++) this._playlists[i] == t && this._playlists.splice(i, 1);
    delete t
}, AudioPlayer.prototype.mergePlaylistData = function(t, i) {
    return t.hasMore() ? void each(this._playlists, function(e, o) {
        o.getId() == t.getId() && o.mergeWith(i)
    }) : t
}, AudioPlayer.prototype.mergePlaylist2 = function(t, i, e) {
    return t.hasMore() ? (t.mergeWith(i), void(e || each(this.audioPlaylists, function(e, o) {
        o.getOriginalId() == t.getId() && o.mergeWith(i)
    }))) : t
}, AudioPlayer.prototype.updateCurrentPlaying = function(t) {
    t = !!t;
    var i = (this.getCurrentPlaylist(), AudioUtils.asObject(this.getCurrentAudio())),
        e = [];
    if (i) {
        var o = geByClass("_audio_row_" + i.fullId);
        e = e.concat([].slice.call(o))
    }
    for (var a = 0, s = this._currentPlayingRows.length; s > a; a++) {
        var l = this._currentPlayingRows[a];
        l && !inArray(l, e) && this.toggleCurrentAudioRow(l, !1, t)
    }
    if (i)
        for (var a = 0, s = e.length; s > a; a++) {
            var l = e[a];
            l && this.toggleCurrentAudioRow(l, !0, t)
        }
    this._currentPlayingRows = e
}, AudioPlayer.prototype.toggleCurrentAudioRow = function(t, i, e) {
    function o() {
        s && (i ? l._addRowPlayer(t, e) : l._removeRowPlayer(t)), i ? (l.on(t, AudioPlayer.EVENT_PLAY, function(i) {
            AudioUtils.asObject(i)
                .fullId == AudioUtils.getAudioFromEl(t, !0)
                .fullId && addClass(t, AudioUtils.AUDIO_PLAYING_CLS)
        }), l.on(t, AudioPlayer.EVENT_PROGRESS, function(i, e) {
            i = AudioUtils.asObject(i);
            var o, a = intval(i.duration);
            o = l.getDurationType() ? "-" + formatTime(Math.round(a - e * a)) : formatTime(Math.round(e * a)), geByClass1("audio_duration", t)
                .innerHTML = o
        }), l.on(t, [AudioPlayer.EVENT_PAUSE, AudioPlayer.EVENT_ENDED], function(i) {
            removeClass(t, AudioUtils.AUDIO_PLAYING_CLS)
        }), toggleClass(t, AudioUtils.AUDIO_PLAYING_CLS, l.isPlaying())) : (l.off(t), removeClass(t, AudioUtils.AUDIO_PLAYING_CLS), geByClass1("audio_duration", t)
            .innerHTML = formatTime(AudioUtils.getAudioFromEl(t, !0)
                .duration)), (e ? toggleClassDelayed : toggleClass)(t, AudioUtils.AUDIO_CURRENT_CLS, i)
    }
    var a = !!intval(domData(t, "is-current"));
    if (a != i) {
        domData(t, "is-current", intval(i));
        var s = hasClass(t, "inlined");
        s && toggleClass(t, "audio_with_transition", e);
        var l = this;
        e ? setTimeout(o) : o()
    }
}, AudioPlayer.prototype._removeRowPlayer = function(t) {
    removeClass(t, AudioUtils.AUDIO_CURRENT_CLS);
    var i = data(t, "player_inited");
    i && (setTimeout(function() {
            re(geByClass1("_audio_inline_player", t))
        }, 200), geByClass1("audio_duration", t)
        .innerHTML = formatTime(AudioUtils.getAudioFromEl(t, !0)
            .duration), this.off(t), each(i.sliders, function() {
            this.destroy()
        }), data(t, "player_inited", !1))
}, AudioPlayer.prototype._addRowPlayer = function(t, i) {
    if (!geByClass1("_audio_inline_player", t)) {
        var e = this,
            o = se(vk.audioParams.audioInlinePlayerTpl || getTemplate("audio_inline_player")),
            a = geByClass1("_audio_player_wrap", t);
        a.appendChild(o);
        var s = new Slider(geByClass1("audio_inline_player_volume", o), {
                value: e.getVolume(),
                backValue: 0,
                size: 1,
                hintClass: "audio_player_hint",
                withBackLine: !0,
                formatHint: function(t) {
                    return Math.round(100 * t) + "%"
                },
                onChange: function(t) {
                    e.setVolume(t)
                }
            }),
            l = new Slider(geByClass1("audio_inline_player_progress", o), {
                value: 0,
                backValue: 0,
                size: 1,
                hintClass: "audio_player_hint",
                withBackLine: !0,
                formatHint: function(t) {
                    var i = AudioUtils.asObject(e.getCurrentAudio());
                    return formatTime(Math.round(t * i.duration))
                },
                onEndDragging: function(t) {
                    e.seek(t)
                }
            });
        e.on(t, AudioPlayer.EVENT_BUFFERED, function(t, i) {
            l.setBackValue(i)
        }), e.on(t, AudioPlayer.EVENT_PROGRESS, function(t, i) {
            l.setValue(i)
        }), e.on(t, AudioPlayer.EVENT_VOLUME, function(t, i) {
            s.setValue(i)
        }), data(t, "player_inited", {
            sliders: [s, l]
        })
    }
}, AudioPlayer.prototype.shareMusic = function() {
    var t = this.getCurrentAudio();
    if (t) return t = AudioUtils.asObject(t), !showBox("like.php", {
        act: "publish_box",
        object: "audio" + t.fullId,
        list: "s" + vk.id,
        to: "mail"
    }, {
        stat: ["page.js", "page.css", "wide_dd.js", "wide_dd.css", "sharebox.js"],
        onFail: function(t) {
            return showDoneBox(t), !0
        }
    })
}, AudioPlayer.prototype.hasStatusExport = function() {
    for (var t in this._statusExport)
        if (this._statusExport[t]) return !0;
    return !1
}, AudioPlayer.prototype.getStatusExportInfo = function() {
    return this._statusExport
}, AudioPlayer.prototype.setStatusExportInfo = function(t) {
    this._statusExport = t
}, AudioPlayer.prototype.deleteAudioFromAllPlaylists = function(t) {
    t = isObject(t) || isArray(t) ? AudioUtils.asObject(t)
        .fullId : t, each(this._playlists, function(i, e) {
            e.removeAudio(t)
        })
}, AudioPlayer.prototype.triggerAudioUpdated = function() {
    this.notify(AudioPlayer.EVENT_UPDATE)
}, AudioPlayer.prototype.updateAudio = function(t, i) {
    var e = "";
    if (isString(t) ? e = t : isArray(t) && (e = AudioUtils.asObject(t)
            .fullId), each(this._playlists, function(t, o) {
            for (var a = o.getAudiosList(), s = 0, l = a.length; l > s; s++)
                if (a[s][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + a[s][AudioUtils.AUDIO_ITEM_INDEX_ID] == e) return isObject(i) && each(i, function(t, i) {
                    a[s][t] = i
                }), void(isArray(i) && (a[s] = i))
        }), this._currentAudio[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID] == e) {
        if (isObject(i)) {
            var o = this;
            each(i, function(t, i) {
                o._currentAudio[t] = i
            })
        }
        isArray(i) && (this._currentAudio = i)
    }
    return this.notify(AudioPlayer.EVENT_UPDATE), t
}, AudioPlayer.prototype._sendLCNotification = function() {
    var t = window.Notifier;
    t && t.lcSend("audio_start");
    try {
        var i = ge("video_player") || window.html5video || null;
        i && i.playVideo && i.playVideo(!1)
    } catch (e) {}
}, AudioPlayer.prototype._restoreState = function() {
    if (!vk.widget) {
        AudioPlayer.clearDeprecatedCacheKeys(), AudioPlayer.clearOutdatedCacheKeys();
        var t = this._lsGet(AudioPlayer.LS_VOLUME);
        this._userVolume = void 0 == t || t === !1 ? AudioPlayer.DEFAULT_VOLUME : t, this._currentAudio = this._lsGet(AudioPlayer.LS_TRACK);
        var i = this._lsGet(AudioPlayer.LS_PL);
        i && (i = JSON.parse(i), this._currentPlaylist = new AudioPlaylist(i)), this._currentPlaylist && this._currentAudio ? this.notify(AudioPlayer.EVENT_UPDATE) : this._currentPlaylist =
            this._currentAudio = !1;
        var e = this._lsGet(AudioPlayer.LS_PROGRESS) || 0;
        this._currentAudio && e && this._impl && "html5" == this._impl.type && (this._implSetUrl(this._currentAudio), this._implSeek(e), this._implSetVolume(0))
    }
}, AudioPlayer.prototype._ensureImplReady = function(t) {
    this._impl && this._impl.onReady(function(i) {
        return i ? t() : void AudioUtils.showNeedFlashBox()
    })
}, AudioPlayer.prototype._implNewTask = function(t, i) {
    this._tasks = this._tasks || [], this._tasks.push({
        name: t,
        cb: i
    }), this._implDoTasks()
}, AudioPlayer.prototype._implDoTasks = function() {
    if (this._tasks = this._tasks || [], !this._taskInProgress) {
        var t = this._tasks.shift();
        if (t) {
            var i = this;
            this._taskInProgress = t.name, this._ensureImplReady(function() {
                t.cb.call(i, function() {
                    i._taskInProgress = !1, i._implDoTasks()
                })
            })
        }
    }
}, AudioPlayer.prototype._implClearAllTasks = function() {
    this._tasks = []
}, AudioPlayer.prototype._implClearTask = function(t) {
    this._tasks = this._tasks || [], this._tasks = this._tasks.filter(function(i) {
        return i.name != t
    })
}, AudioPlayer.prototype._implSetDelay = function(t) {
    this._implNewTask("delay", function(i) {
        setTimeout(i, t)
    })
}, AudioPlayer.prototype._implPlay = function() {
    var t = this;
    this._implNewTask("play", function(i) {
        audio = AudioUtils.asObject(t.getCurrentAudio()), t._impl.play(audio.url), t._muteProgressEvents = !1, i()
    })
}, AudioPlayer.prototype._implSeekImmediate = function(t) {
    this._impl && this._impl.seek(t)
}, AudioPlayer.prototype._implSeek = function(t) {
    var i = this;
    this._implClearTask("seek"), this._implNewTask("seek", function(e) {
        i._impl.seek(t), e()
    })
}, AudioPlayer.prototype._implPause = function() {
    var t = this;
    this._implNewTask("pause", function(i) {
        t._impl.pause(), i()
    })
}, AudioPlayer.prototype._implSetVolume = function(t, i) {
    if (this._impl) {
        var e = this;
        if (i) {
            var o = 0 == t ? "vol_down" : "vol_up";
            this._implNewTask(o, function(i) {
                e._impl.fadeVolume(t, function() {
                    i()
                })
            })
        } else this._implNewTask("vol_set", function(i) {
            e._impl.setVolume(t), i()
        })
    }
}, AudioPlayer.prototype._implSetUrl = function(t) {
    var i = this;
    this._implClearTask("url"), this._implNewTask("url", function(e) {
        i._ensureHasURL(t, function(t) {
            t = AudioUtils.asObject(t), i._impl.setUrl(t.url, function(t) {
                t || (i._implClearAllTasks(), i._onFailedUrl()), e()
            })
        })
    })
}, AudioPlayer.prototype.toggleDurationType = function() {
    var t = intval(ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_DURATION_TYPE));
    t = !t, ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_DURATION_TYPE, t), this.notify(AudioPlayer.EVENT_UPDATE, this.getCurrentProgress())
}, AudioPlayer.prototype.getDurationType = function() {
    return intval(ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_DURATION_TYPE))
}, AudioPlayer.prototype.getCurrentProgress = function() {
    return this._impl ? this._impl.getCurrentProgress() : 0
}, AudioPlayer.prototype.getCurrentBuffered = function() {
    return this._impl ? this._impl.getCurrentBuffered() : 0
}, AudioPlayer.prototype._initEvents = function() {
    var t = window.Notifier,
        i = this;
    t && (t.addRecvClbk("audio_start", "audio", function(t) {
        i.isPlaying() && i.pause(!1, i._fadeVolumeWorker ? !1 : !0), i.pausedByVideo = null
    }), t.addRecvClbk("video_start", "audio", function(t) {
        i.isPlaying() && (i.pause(), i.pausedByVideo = 1)
    }), t.addRecvClbk("video_hide", "audio", function(t) {
        !i.isPlaying() && i.pausedByVideo && (i.play(), delete i.pausedByVideo)
    }), t.addRecvClbk("logged_off", "audio", function() {
        AudioPlayer.clearAllCacheKeys(), i.stop()
    }))
}, AudioPlayer.prototype.addPlaylist = function(t) {
    this._playlists.push(t)
}, AudioPlayer.prototype.shufflePlaylist = function(t) {
    if (t.shuffle = irand(1, 999), t.has_more)
        if (AudioUtils.getPlaylistType(t) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH) {
            if (t.localFoundTotal && intval(t.localFoundTotal) > 1) {
                var i = t.list.splice(0, t.localFoundTotal);
                t.original = [].concat(i), shuffle(i), t.list = i.concat(t.list)
            }
        } else t.list = [], t.offset = t.next_offset = 0;
    else t.original = [].concat(t.list), shuffle(t.list), delete t.localFoundTotal, this.moveCurrentPlayingAtFirstPos(t)
}, AudioPlayer.prototype.moveCurrentPlayingAtFirstPos = function(t) {
    var i = this.getCurrentAudio();
    if (i && -1 != this.getAudioPlaylistPosition(i, t)) {
        var e = t.list[0];
        if (t.list.length && e[AudioUtils.AUDIO_ITEM_INDEX_ID] == i[AudioUtils.AUDIO_ITEM_INDEX_ID]) return;
        for (var o = 0, a = t.list.length; a > o; o++)
            if (t.list[o][AudioUtils.AUDIO_ITEM_INDEX_ID] == i[AudioUtils.AUDIO_ITEM_INDEX_ID]) {
                t.list.splice(o, 1);
                break
            }
        t.list.unshift(i)
    }
}, AudioPlayer.prototype.restoreShufflePlaylist = function(t) {
    delete t.shuffle, (t.original || AudioUtils.isPaginatedPlaylist(t)) && (t.has_more ? AudioUtils.getPlaylistType(t) == AudioUtils.AUDIO_PLAYLIST_TYPE_SEARCH && t.localFoundTotal ?
        (t.list.splice(0, t.localFoundTotal), t.list = t.original.concat(t.list)) : (t.list = [], t.offset = t.next_offset = 0) : t.list = t.original, delete t.original)
}, AudioPlayer.prototype.pushAudiosToPlaylist = function(t, i) {
    isArray(i) && !isArray(i[0]) && (i = [i]), t.total = t.total || t.list.length || 0;
    var e = this;
    each(i, function(i, o) {
        -1 == e.getAudioPlaylistPosition(o, t) && (o = clone(o), AudioUtils.prepareAudioForPlaylist(o), t.list.push(o), t.total++)
    }), AudioUtils.getPlaylistType(t) != AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT && AudioUtils.indexPlaylist(t)
}, AudioPlayer.prototype.getPlaylist = function(t, i, e) {
    var o;
    if (void 0 !== i && void 0 !== e) o = t + "_" + i + "_" + e;
    else {
        o = t;
        var a = t.split("_");
        t = a[0], i = a[1], e = a[2]
    }
    for (var s = 0; s < this._playlists.length; s++) {
        var l = this._playlists[s];
        if (l.isOriginal() && l.getId() == o) return l
    }
    if (t == AudioPlaylist.TYPE_ALBUM && e != AudioUtils.AUDIO_ALBUM_ID_ALL) {
        var r = this.getPlaylist(AudioPlaylist.TYPE_ALBUM, i, AudioUtils.AUDIO_ALBUM_ID_ALL);
        if (!r.hasMore() && r.isComplete()) {
            var u = new AudioPlaylist(AudioPlaylist.TYPE_ALBUM, i, e);
            return each(r.getAudiosList(), function(t, i) {
                i[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] == e && u.addAudio(i)
            }), u
        }
    }
    return new AudioPlaylist({
        type: t,
        ownerId: i,
        albumId: e,
        hasMore: t != AudioPlaylist.TYPE_TEMP
    })
}, AudioPlayer.prototype.toggleRepeatCurrentAudio = function() {
    this._repeatCurrent = !this._repeatCurrent
}, AudioPlayer.prototype.isRepeatCurrentAudio = function() {
    return !!this._repeatCurrent
}, AudioPlayer.prototype.setNext = function(t, i) {
    var e = domClosest("_audio_row", t),
        o = AudioUtils.getAudioFromEl(e, !0),
        a = AudioUtils.asObject(o),
        s = this.getCurrentPlaylist();
    if (s) {
        var l = AudioUtils.asObject(this.getCurrentAudio());
        if (l && a.fullId == l.fullId) return;
        var r = s.indexOfAudio(l);
        if (-1 == r) return;
        var u = s.indexOfAudio(a); - 1 != u ? s.moveAudio(u, r + 1) : s.addAudio(o, r + 1)
    } else s = AudioUtils.getContextPlaylist(e), this.play(o, s);
    return cancelEvent(i)
}, AudioPlayer.prototype._setTabIcon = function(t) {
    setFavIcon(AudioPlayer.tabIcons[t])
}, AudioPlayer.prototype.on = function(t, i, e) {
    isArray(i) || (i = [i]), each(i, function(i, o) {
        this.subscribers.push({
            context: t,
            et: o,
            cb: e
        })
    }.bind(this))
}, AudioPlayer.prototype.off = function(t) {
    this.subscribers = this.subscribers.filter(function(i) {
        return i.context != t
    })
}, AudioPlayer.prototype.notify = function(t, i, e) {
    var o = this._currentAudio;
    if (this._impl && (!this._muteProgressEvents || !inArray(t, [AudioPlayer.EVENT_BUFFERED, AudioPlayer.EVENT_PROGRESS]))) switch (inArray(t, [AudioPlayer.EVENT_PLAY,
        AudioPlayer.EVENT_PAUSE
    ]) && (this.subscribers = this.subscribers.filter(function(t) {
        return t.context instanceof Element ? bodyNode.contains(t.context) : !0
    }), this.updateCurrentPlaying(!0)), each(this.subscribers || [], function(a, s) {
        s.et == t && s.cb(o, i, e)
    }), t) {
        case AudioPlayer.EVENT_VOLUME:
            ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_VOLUME, this._userVolume);
            break;
        case AudioPlayer.EVENT_PLAY:
            this.saveStateCurrentPlaylist(), this._saveStateCurrentAudio(), this._setTabIcon("play"), this._sendStatusExport();
            break;
        case AudioPlayer.EVENT_PLAYLIST_CHANGED:
            break;
        case AudioPlayer.EVENT_PROGRESS:
            if (!vk.widget) {
                var a = this._impl.getCurrentProgress();
                this._lsSet(AudioPlayer.LS_PROGRESS, a), this._listenedTime = this._listenedTime || 0, this._listenedTime += a - (this._prevProgress || 0), this._prevProgress =
                    a;
                var s = o[AudioUtils.AUDIO_ITEM_INDEX_DURATION],
                    l = o[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + o[AudioUtils.AUDIO_ITEM_INDEX_ID];
                !this._listened[l] && this._listenedTime * s > AudioPlayer.LISTEN_TIME && (this._sendPlayback(), this._listened[l] = !0)
            }
            break;
        case AudioPlayer.EVENT_PAUSE:
            this._setTabIcon("pause");
            break;
        case AudioPlayer.EVENT_ENDED:
    }
}, AudioPlayer.prototype._initPlaybackParams = function() {
    var t = this.getCurrentPlaylist();
    if (void 0 === t.getPlaybackParams()) {
        var i = AudioUtils.asObject(this.getCurrentAudio()),
            e = {};
        t.originalId || t.id;
        if (t.isLive() && (e.status = 1), t.getType() == AudioPlaylist.TYPE_RECOM && (e.recommendation = 1), t.getType() == AudioPlaylist.TYPE_POPULAR) {
            var o = (t.getAlbumId() + "")
                .replace("foreign", "");
            intval(o) && (e.popular_genre = 1), e.top_audio = 1
        }
        if (t.getType() == AudioPlaylist.TYPE_FEED && (e.feed_audio = 1), t.getType() == AudioPlaylist.TYPE_ALBUM && (t.getAlbumId() == AudioUtils.AUDIO_ALBUM_ID_ALL && t.isPopBand() &&
                (e.top_bands = 1, e.friend = t.getOwnerId()), t.getAlbumId() != AudioUtils.AUDIO_ALBUM_ID_ALL && (e.album = 1)), t.getType() == AudioPlaylist.TYPE_ALBUM && nav
            .objLoc.friend) {
            var a = intval(nav.objLoc.friend);
            0 > a ? e.club = a : e.friend = a
        }
        "search" != cur.module || "audio" != nav.objLoc["c[section]"] || nav.objLoc["c[q]"] || (e.top = 1), (("groups" == cur.module || "public" == cur.module) && cur.oid == i
                .ownerId && cur.oid < 0 || cur.audioPage && cur.audioPage.options.oid == i.ownerId && cur.audioPage.options.oid < 0) && (e.group = 1), (("audio" == cur.module ||
                "feed" == cur.module) && nav.objLoc.q || "search" == cur.module && nav.objLoc["c[q]"] || t.getType() == AudioPlaylist.TYPE_SEARCH) && (e.search = 1), e.search ||
            "feed" != cur.module || (e.feed = 1), t.setPlaybackParams(e)
    }
}, AudioPlayer.prototype.playLive = function(t, i) {
    var e = this.getPlaylist(AudioPlaylist.TYPE_LIVE, vk.id, data[0]);
    e.mergeWith({
        live: t,
        hasMore: !1
    });
    var t = e.getLiveInfo(),
        o = this;
    ajax.post("al_audio.php", {
        act: "a_play_audio_status",
        audio_id: t.audioId,
        host_id: t.hostId,
        hash: t.hash
    }, extend(i, {
        onDone: function(t, i) {
            e.mergeWith({
                title: i.title,
                list: [t]
            }), o.play(t, e)
        }
    }))
}, AudioPlayer.prototype.startListenLive = function(t) {
    t = t.split(","), ajax.post("al_audio.php", {
        act: "a_play_audio_status",
        host_id: t[0],
        audio_id: t[1],
        hash: t[2]
    })
}, AudioPlayer.prototype.getNextLiveAudio = function(t, i) {
    if (t.live) {
        var e = t.live.split(","),
            o = this;
        ajax.post("al_audio.php", {
            act: "a_get_audio_status",
            host_id: e[0]
        }, {
            onDone: function(e) {
                e ? (o.pushAudiosToPlaylist(t, e), i(e)) : (delete t.live, t.title = "", i())
            }
        })
    }
}, AudioPlayer.prototype._sendStatusExport = function() {
    var t = this.getCurrentAudio();
    if (t) {
        t = AudioUtils.asObject(t);
        var i = this.statusSent ? this.statusSent.split(",") : [!1, 0],
            e = vkNow() - intval(i[1]);
        if (this.hasStatusExport() && (t.id != i[0] || e > 3e5)) {
            var o = this.getCurrentPlaylist(),
                a = o ? o.playbackParams : null;
            setTimeout(ajax.post.pbind("al_audio.php", {
                act: "audio_status",
                full_id: t.fullId,
                hash: vk.audioParams.addHash,
                top: intval(a && (a.top_audio || a.top))
            }), 0), this.statusSent = t.id + "," + vkNow()
        }
    }
}, AudioPlayer.prototype._sendPlayback = function() {
    var t = this.getCurrentPlaylist();
    if (t.getPlaybackParams()) {
        var i = AudioUtils.asObject(this.getCurrentAudio()),
            e = extend({
                act: "playback",
                full_id: i.fullId
            }, t.getPlaybackParams());
        i.ownerId == vk.id && i.id && (e.id = i.id), ajax.post("al_audio.php", e)
    }
}, AudioPlayer.prototype.saveStateCurrentPlaylist = function() {
    if (!vk.widget) {
        var t = this.getCurrentPlaylist();
        if (t) {
            var i = t.serialize();
            this._lsSet(AudioPlayer.LS_PL, i), this._lsSet(AudioPlayer.LS_SAVED, vkNow())
        }
    }
}, AudioPlayer.prototype._saveStateCurrentAudio = function() {
    if (!vk.widget) {
        var t = this.getCurrentAudio();
        if (t) {
            var i = clone(t);
            i[AudioUtils.AUDIO_ITEM_INDEX_URL] = "", this._lsSet(AudioPlayer.LS_TRACK, i), setCookie("remixcurr_audio", t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[
                AudioUtils.AUDIO_ITEM_INDEX_ID], 1)
        }
    }
}, AudioPlayer.prototype._lsGet = function(t) {
    return ls.get(AudioPlayer.LS_PREFIX + t)
}, AudioPlayer.prototype._lsSet = function(t, i) {
    ls.set(AudioPlayer.LS_PREFIX + t, i)
}, AudioPlayer.prototype.setVolume = function(t) {
    this._userVolume = t, this._implSetVolume(t), this.notify(AudioPlayer.EVENT_VOLUME, t)
}, AudioPlayer.prototype.getVolume = function() {
    return void 0 === this._userVolume ? .8 : this._userVolume
}, AudioPlayer.prototype.seek = function(t) {
    this._implSeekImmediate(t)
}, AudioPlayer.prototype._ensureHasURL = function(t, i) {
    var e = [];
    this._currentUrlEnsure = this._currentUrlEnsure || {};
    var o = AudioUtils.asObject(t);
    if (!o.url) {
        var a = this.getCurrentPlaylist(),
            s = a.indexOfAudio(t);
        if (s >= 0)
            for (var l = s; s + 5 > l; l++) {
                var r = AudioUtils.asObject(a.getAudioAt(l));
                !r || r.url || this._currentUrlEnsure[r.fullId] || (e.push(r.fullId), this._currentUrlEnsure[r.fullId] = !0)
            }
        e.push(o.fullId)
    }
    if (!e.length) return i && i(t);
    var u = this;
    ajax.post("al_audio.php", {
        act: "reload_audio",
        ids: e.join(",")
    }, {
        onDone: function(e) {
            each(e, function(i, e) {
                e = AudioUtils.asObject(e);
                var a = {};
                a[AudioUtils.AUDIO_ITEM_INDEX_URL] = e.url, u.updateAudio(e.fullId, a), o.fullId == e.fullId && (t[AudioUtils.AUDIO_ITEM_INDEX_URL] = e.url),
                    u.currentAudio && AudtioUtils.asObject(u.currentAudio)
                    .fullId == e.fullId && (u.currentAudio[AudioUtils.AUDIO_ITEM_INDEX_URL] = e.url), delete u._currentUrlEnsure[e.fullId]
            }), i && i(t)
        }
    })
}, AudioPlayer.prototype.toggleAudio = function(t, i) {
    if (cur._sliderMouseUpNow) return delete cur._sliderMouseUpNow, !1;
    if (i && (hasClass(i.target, "audio_lyrics") || domClosest("_audio_duration_wrap", i.target) || domClosest("_audio_inline_player", i.target) || domClosest(
            "audio_performer", i.target))) return !1;
    var e = domClosest("_audio_row", t),
        o = AudioUtils.getAudioFromEl(e, !0);
    if (AudioUtils.isClaimedAudio(o)) {
        var a = AudioUtils.getAudioExtra(o),
            s = a.claim;
        return void showAudioClaimWarning(o.ownerId, o.id, s.deleteHash, s.id, o.title)
    }
    var l = hasClass(e, AudioUtils.AUDIO_PLAYING_CLS);
    if (l) this.pause();
    else {
        var r = AudioUtils.getContextPlaylist(e);
        this.play(o.fullId, r)
    }
}, AudioPlayer.prototype._onFailedUrl = function(t) {
    this.notify(AudioPlayer.EVENT_FAILED), this.isPlaying() && (this.pause(), this.playNext(!0))
}, AudioPlayer.prototype.switchToPrevPlaylist = function() {
    this._prevPlaylist && (this.pause(), this._currentPlaylist = this._prevPlaylist, this._currentAudio = this._prevAudio, this._prevPlaylist = this._prevAudio = null, this.notify(
        AudioPlayer.EVENT_PLAYLIST_CHANGED, this._currentPlaylist), this.notify(AudioPlayer.EVENT_UPDATE), this.updateCurrentPlaying())
}, AudioPlayer.prototype.play = function(t, i, e, o) {
    (isObject(t) || isArray(t)) && (t = AudioUtils.asObject(t), t && (t = t.fullId));
    var a = AudioUtils.asObject(this._currentAudio),
        s = this.getCurrentPlaylist();
    !t && a && (t = a.fullId);
    var l = !1,
        r = !1;
    r = t && a && t == a.fullId, i ? s && (l = i == s.getSelf() || i == s) : (i = s, l = !0);
    if (r && l) {
        this._isPlaying = !0, this._sendLCNotification(), this.notify(AudioPlayer.EVENT_PLAY);
        var u = i.getAudio(t);
        this._implClearAllTasks(), this._implSetVolume(0), this._implSetUrl(u), this._implPlay(), this._implSetVolume(this.getVolume(), !0)
    } else if (t) {
        var u = i.getAudio(t);
        u && (l || (this._currentPlaylist && (this._prevPlaylist = this._currentPlaylist, this._prevAudio = this._currentAudio), i.getType() == AudioPlaylist.TYPE_TEMP ? this._currentPlaylist =
                i : this._currentPlaylist = new AudioPlaylist(i)), this._listenedTime = this._prevProgress = 0, this._currentAudio = u, this._isPlaying = !0, this._sendLCNotification(),
            this.notify(AudioPlayer.EVENT_PLAY, !0, intval(e), o), this._muteProgressEvents = !0, this._implClearAllTasks(), o ? (this._implSetUrl(u), this._implPlay(),
                this._implSetVolume(this.getVolume())) : (this._implSetVolume(0, !0), this._implSetDelay(200), this._implSetUrl(u), this._implPlay(), this._implSetVolume(
                this.getVolume())), this._prefetchNextAudio(), l || (this._initPlaybackParams(), this.notify(AudioPlayer.EVENT_PLAYLIST_CHANGED, i)))
    }
}, AudioPlayer.prototype._prefetchNextAudio = function() {
    if ("html5" == this._impl.type) {
        var t = this.getCurrentPlaylist(),
            i = t.getNextAudio(this.getCurrentAudio());
        i && (i = AudioUtils.asObject(i), this._impl.prefetch(i.url))
    }
}, AudioPlayer.prototype.getCurrentPlaylist = function() {
    return this._currentPlaylist
}, AudioPlayer.prototype.getPlaylists = function() {
    return this._playlists
}, AudioPlayer.prototype.pause = function(t, i) {
    this._isPlaying = !1, this.notify(AudioPlayer.EVENT_PAUSE), this._implSetVolume(0, !0), this._implPause()
}, AudioPlayer.prototype.stop = function() {
    this._isPlaying = !1, this._impl.stop(), this.notify(AudioPlayer.EVENT_STOP)
}, AudioPlayer.prototype.isPlaying = function() {
    return this._isPlaying
}, AudioPlayer.prototype.getCurrentAudio = function() {
    return this._currentAudio
}, AudioPlayer.prototype.playNext = function(t) {
    this._playNext(1, t)
}, AudioPlayer.prototype.playPrev = function() {
    this._playNext(-1)
}, AudioPlayer.prototype._playNext = function(t, i) {
    var e = this.getCurrentAudio(),
        o = this.getCurrentPlaylist(),
        a = this;
    if (e && o)
        if (t > 0) {
            var s = o.getNextAudio(e);
            s ? this.play(s, o, 1, i) : o.isLive() ? (this._muteProgressEvents = !0, o.fetchNextLiveAudio(function(t) {
                a.play(t, o, 1, i)
            })) : (s = o.getAudioAt(0), this.play(s, o, 1, i))
        } else {
            var l = o.indexOfAudio(this._currentAudio) - 1;
            0 > l ? this.seek(0) : this.play(o.getAudioAt(l), o, -1, i)
        }
}, AudioPlayerFlash.onAudioFinishCallback = function() {
    var t = AudioPlayerFlash.instance;
    t.opts.onEnd && t.opts.onEnd()
}, AudioPlayerFlash.onAudioProgressCallback = function(t, i) {
    var e = AudioPlayerFlash.instance;
    i && (e._total = i, e._currProgress = t / i, e.opts.onProgressUpdate && e.opts.onProgressUpdate(e._currProgress))
}, AudioPlayerFlash.onAudioLoadProgressCallback = function(t, i) {
    var e = AudioPlayerFlash.instance;
    e._currBuffered = t / i, e.opts.onBufferUpdate && e.opts.onBufferUpdate(e._currBuffered)
}, AudioPlayerFlash.prototype.fadeVolume = function(t, i) {
    return this.setVolume(t), i()
}, AudioPlayerFlash.prototype.type = "flash", AudioPlayerFlash.prototype.onReady = function(t) {
    if (this._player) return t(!0);
    if (this._player === !1) return t(!1);
    this._onReady = t;
    var i = {
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
    var s = this;
    renderFlash(a, i, e, o) && setTimeout(function() {
        s._checkFlashLoaded()
    }, 50)
}, AudioPlayerFlash.prototype.setUrl = function(t, i) {
    return this._url == t ? void(i && i(!0)) : (this._url = t, this._player && this._player.loadAudio(t), void(i && i(!0)))
}, AudioPlayerFlash.prototype.setVolume = function(t) {
    this._player && this._player.setVolume && this._player.setVolume(t)
}, AudioPlayerFlash.prototype.play = function() {
    this._player && this._player.playAudio()
}, AudioPlayerFlash.prototype.seek = function(t) {
    var i = (this._total || 0) * t;
    this._player && this._player.playAudio(i)
}, AudioPlayerFlash.prototype.pause = function() {
    this._player && this._player.pauseAudio()
}, AudioPlayerFlash.prototype.getCurrentProgress = function() {
    return this._currProgress || 0
}, AudioPlayerFlash.prototype.getCurrentBuffered = function() {
    return this._currBuffered || 0
}, AudioPlayerFlash.prototype._checkFlashLoaded = function() {
    var t = ge("player");
    if (this._checks = this._checks || 0, this._checks++, this._checks > 10) {
        this._player = !1;
        var i = this._onReady;
        return i && i(!1)
    }
    if (t && t.paused) {
        this._player = t;
        var i = this._onReady;
        i && i(!0), this._onReady = null
    } else {
        var e = this;
        setTimeout(function() {
            e._checkFlashLoaded()
        }, 100)
    }
}, AudioPlayerHTML5.AUDIO_EL_ID = "ap_audio", AudioPlayerHTML5.FAILED_URL_TIMEOUT = 14e3, AudioPlayerHTML5.isSupported = function() {
    var t = document.createElement("audio");
    return !(!t.canPlayType || !t.canPlayType('audio/mpeg; codecs="mp3"')
        .replace(/no/, ""))
}, AudioPlayerHTML5.prototype.type = "html5", AudioPlayerHTML5.prototype._createAudioEl = function() {
    var t = ce("audio", {
            id: AudioPlayerHTML5.AUDIO_EL_ID
        }),
        i = this;
    return this.opts.onBufferUpdate && addEvent(t, "progress", function() {
        i._currentAudioEl == t && i.opts.onBufferUpdate(i.getCurrentBuffered())
    }), this.opts.onProgressUpdate && addEvent(t, "timeupdate", function() {
        i._currentAudioEl == t && i.opts.onProgressUpdate(i.getCurrentProgress())
    }), this.opts.onEnd && addEvent(t, "ended", function() {
        i._currentAudioEl == t && i.opts.onEnd()
    }), this.opts.onSeeked && addEvent(t, "seeked", function() {
        i._currentAudioEl == t && i.opts.onSeeked()
    }), this.opts.onSeek && addEvent(t, "seeking", function() {
        i._currentAudioEl == t && i.opts.onSeek()
    }), addEvent(t, "error", function() {
        var e = t.src;
        clearTimeout(i._checkUrlTOs[e]), delete i._checkedUrls[e];
        var o = i._onReadyCallbacks[e];
        o && o(!1)
    }), addEvent(t, "canplay", function() {
        var e = t.src;
        clearTimeout(i._checkUrlTOs[e]), i._checkedUrls[e] = !0;
        var o = i._onReadyCallbacks[e];
        if (o && o(!0), delete i._onReadyCallbacks[e], i._currentAudioEl == t && i._seekOnReady) {
            var a = i._seekOnReady;
            i._seekOnReady = !1, i.seek(a)
        }
    }), t
}, AudioPlayerHTML5.prototype.onReady = function(t) {
    t(!0)
}, AudioPlayerHTML5.prototype.prefetch = function(t) {
    this._prefetchAudioEl.src = this._emptyBLOB(), this._prefetchAudioEl.src = t
}, AudioPlayerHTML5.prototype.seek = function(t) {
    var i = this._currentAudioEl;
    isNaN(i.duration) ? this._seekOnReady = t : i.currentTime = i.duration * t
}, AudioPlayerHTML5.prototype.setVolume = function(t) {
    this._currentAudioEl.volume = t, this._prefetchAudioEl.volume = t
}, AudioPlayerHTML5.prototype.getCurrentProgress = function() {
    var t = this._currentAudioEl;
    return isNaN(t.duration) ? 0 : Math.max(0, Math.min(1, t.currentTime / t.duration))
}, AudioPlayerHTML5.prototype.getCurrentBuffered = function() {
    var t = this._currentAudioEl;
    return t && t.buffered.length ? Math.min(1, t.buffered.end(0) / t.duration) : 0
}, AudioPlayerHTML5.prototype.setUrl = function(t, i) {
    var e = this._currentAudioEl;
    if (this._seekOnReady = !1, e.src == t || this._prefetchAudioEl.src == t && this._checkedUrls[t]) return i && i(!0);
    var o = this;
    clearTimeout(this._checkUrlTOs[t]), this._checkUrlTOs[t] = setTimeout(function() {
        o._canPlayTimeout *= 2, i && i(!1, t)
    }, this._canPlayTimeout), this._onReadyCallbacks[t] = i, e.src = t
}, AudioPlayerHTML5.prototype._emptyBLOB = function() {
    return URL.createObjectURL(new Blob([], {
        type: "audio/mp3"
    }))
}, AudioPlayerHTML5.prototype.play = function(t) {
    if (this._prefetchAudioEl.src == t) {
        if (!this._checkedUrls[t]) return this._prefetchAudioEl.src = this._emptyBLOB(), void this.setUrl(t, function() {
            e.play()
        });
        var i = this._currentAudioEl;
        this._currentAudioEl = this._prefetchAudioEl, this._prefetchAudioEl = i, this._prefetchAudioEl.pause(), this._prefetchAudioEl.src = this._emptyBLOB()
    }
    var e = this._currentAudioEl;
    if (e.src) try {
        e.play()
    } catch (o) {
        debugLog("Audio: url set failed (html5 impl)")
    }
}, AudioPlayerHTML5.prototype.pause = function() {
    var t = this._currentAudioEl;
    t.src && t.pause()
}, AudioPlayerHTML5.prototype.stop = function() {
    var t = this._currentAudioEl;
    t.src = ""
}, AudioPlayerHTML5.prototype._setFadeVolumeInterval = function(t) {
    if (t) {
        if (!this._fadeVolumeWorker && window.Worker && window.Blob) {
            var i = new Blob([
                "         var interval;         onmessage = function(e) {           clearInterval(interval);           if (e.data == 'start') {             interval = setInterval(function() { postMessage({}); }, 20);           }         }       "
            ]);
            try {
                this._fadeVolumeWorker = new Worker(window.URL.createObjectURL(i))
            } catch (e) {
                this._fadeVolumeWorker = !1
            }
        }
        this._fadeVolumeWorker ? (this._fadeVolumeWorker.onmessage = t, this._fadeVolumeWorker.postMessage("start")) : this._fadeVolumeInterval = setInterval(t, 60)
    } else this._fadeVolumeWorker && this._fadeVolumeWorker.postMessage("stop"), this._fadeVolumeInterval && clearInterval(this._fadeVolumeInterval)
}, AudioPlayerHTML5.prototype.fadeVolume = function(t, i) {
    t = Math.max(0, Math.min(1, t));
    var e = this._currentAudioEl,
        o = 0;
    if (o = t < e.volume ? -.04 : .001, Math.abs(t - e.volume) <= .001) return this._setFadeVolumeInterval(), i && i();
    var a = e.volume;
    this._setFadeVolumeInterval(function() {
        o > 0 && (o *= 1.2), a += o;
        var s = !1;
        return (s = 0 > o ? t >= a : a >= t) ? (e.volume = t, this._prefetchAudioEl.volume = t, this._setFadeVolumeInterval(), void(i && i())) : (this._prefetchAudioEl
            .volume = a, void(e.volume = a))
    }.bind(this))
};
try {
    stManager.done("audioplayer.js")
} catch (e) {}
