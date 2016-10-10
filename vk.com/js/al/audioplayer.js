function TopAudioPlayer(t, e) {
    this.ap = getAudioPlayer(), this._el = t, this._playIconBtn = ge("top_audio"), this.init()
}

function AudioPlaylist(t, e, i) {
    if (this.constructor != AudioPlaylist) throw new Error("AudioPlaylist was called without 'new' operator");
    getAudioPlayer()
        .addPlaylist(this);
    var o = {};
    return t && isFunction(t.getId) ? (this._ref = t, void getAudioPlayer()
        .addPlaylist(this)) : (isObject(t) ? o = t : (o.ownerId = e, o.type = t, o.albumId = i || ++AudioPlaylist.plIndex), this._type = o.type, this._ownerId = o.ownerId ||
        vk.id, this._albumId = o.albumId || 0, this._list = [], this.mergeWith(o), this)
}

function AudioPlayer() {
    if (this._currentAudio = !1, this._isPlaying = !1, this._prevPlaylist = null, this._currentPlaylist = null, this._playlists = [], this.subscribers = [], this._tasks = [], this
        ._listened = {}, this._statusExport = {}, this._currentPlayingRows = [], this._allowPrefetchNext = !1, !vk.isBanned) {
        AudioUtils.debugLog("Player creation"), this._initImpl(), this._initEvents(), this._restoreVolumeState();
        var t = this;
        setTimeout(function() {
            t._restoreState(), AudioUtils.toggleAudioHQBodyClass(), t.updateCurrentPlaying()
        })
    }
}

function AudioPlayerFlash(t) {
    this.opts = t || {}, window._flashAudioInstance = this
}

function AudioPlayerHTML5(t) {
    this.opts = t || {}, this._audioNodes = [], this._currentAudioEl = this._createAudioNode(), this._prefetchAudioEl = this._createAudioNode()
}
var AudioUtils = {
    AUDIO_ITEM_INDEX_ID: 0,
    AUDIO_ITEM_INDEX_OWNER_ID: 1,
    AUDIO_ITEM_INDEX_URL: 2,
    AUDIO_ITEM_INDEX_TITLE: 3,
    AUDIO_ITEM_INDEX_PERFORMER: 4,
    AUDIO_ITEM_INDEX_DURATION: 5,
    AUDIO_ITEM_INDEX_ALBUM_ID: 6,
    AUDIO_ITEM_INDEX_AUTHOR_LINK: 8,
    AUDIO_ITEM_INDEX_LYRICS: 9,
    AUDIO_ITEM_INDEX_FLAGS: 10,
    AUDIO_ITEM_INDEX_CONTEXT: 11,
    AUDIO_ITEM_INDEX_EXTRA: 12,
    AUDIO_ITEM_INDEX_ACT_HASH: 13,
    AUDIO_ITEM_INLINED_BIT: 1,
    AUDIO_ITEM_CLAIMED_BIT: 16,
    AUDIO_ITEM_RECOMS_BIT: 64,
    AUDIO_ITEM_TOP_BIT: 1024,
    AUDIO_ENOUGH_LOCAL_SEARCH_RESULTS: 500,
    AUDIO_PLAYING_CLS: "audio_row_playing",
    AUDIO_CURRENT_CLS: "audio_row_current",
    AUDIO_LAYER_HEIGHT: 550,
    AUDIO_LAYER_MIN_WIDTH: 400,
    AUDIO_LAYER_MAX_WIDTH: 1e3,
    AUDIO_HQ_LABEL_CLS: "audio_hq_label_show",
    toggleAudioHQBodyClass: function() {
        var t = getAudioPlayer()
            .showHQLabel();
        toggleClass(document.body, AudioUtils.AUDIO_HQ_LABEL_CLS, t)
    },
    hasAudioHQBodyClass: function() {
        return hasClass(document.body, AudioUtils.AUDIO_HQ_LABEL_CLS)
    },
    showNeedFlashBox: function() {
        var t = getLang("global_audio_flash_required")
            .replace("{link}", '<a target=_blank href="https://get.adobe.com/flashplayer">')
            .replace("{/link}", "</a>");
        new MessageBox({
                title: getLang("audio_need_flash_title")
            })
            .content(t)
            .setButtons("Ok", function() {
                curBox()
                    .hide()
            })
            .show()
    },
    getAddRestoreInfo: function() {
        return cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {}, cur._audioAddRestoreInfo
    },
    addAudio: function(t) {
        function e() {
            return intval(domData(o, "in-progress"))
        }

        function i(t) {
            return domData(o, "in-progress", intval(t))
        }
        var o = gpeByClass("_audio_row", t);
        if (!e()) {
            i(!0);
            var a = window.AudioPage && AudioPage(o),
                s = a && a.options.oid < 0 && a.options.canAudioAddToGroup,
                l = s ? -a.options.oid : 0,
                r = AudioUtils.getAudioFromEl(o, !0),
                u = vk.audioParams.addHash,
                n = vk.audioParams.deleteHash,
                d = AudioUtils.getAddRestoreInfo(),
                _ = d[r.fullId],
                A = ge("audio_" + r.fullId);
            A = A == o ? !1 : A;
            var y = a && a.getCurrentPlaylist(),
                p = (intval(r.isTop), intval(a && a.getCurrentPlaylist()
                    .getType() == AudioPlaylist.TYPE_SEARCH), {
                    act: "add",
                    gid: l,
                    oid: r.ownerId,
                    aid: r.id,
                    hash: u
                });
            if (y) {
                var h = y.getAlbumId();
                switch (p.from = y.getType(), y.getType()) {
                    case AudioPlaylist.TYPE_RECOM:
                        isString(h) && (0 == h.indexOf("album") && (p.recommendation_type = "album"), 0 == h.indexOf("audio") && (p.recommendation_type = "query"));
                        break;
                    case AudioPlaylist.TYPE_POPULAR:
                        p.top_genre = h;
                        break;
                    case AudioPlaylist.TYPE_FEED:
                }
            }
            if (_) {
                if ("recom_hidden" == _.state) a && (a.restoreRecommendation(o), i(!1));
                else if ("deleted" == _.state) ajax.post("al_audio.php", {
                    act: "restore_audio",
                    oid: r.ownerId,
                    aid: r.id,
                    hash: u
                }, {
                    onDone: function() {
                        i(!1)
                    }
                }), removeClass(o, "audio_deleted"), removeClass(o, "canadd"), addClass(o, "canedit"), delete cur._audioAddRestoreInfo[r.fullId];
                else if ("added" == _.state) {
                    var c = _.addedFullId.split("_");
                    ajax.post("al_audio.php", {
                            act: "delete_audio",
                            oid: c[0],
                            aid: c[1],
                            hash: n
                        }, {
                            onDone: function() {
                                if (a) {
                                    var t = getAudioPlayer()
                                        .getPlaylist(AudioPlaylist.TYPE_ALBUM, l ? -l : vk.id, AudioPlaylist.ALBUM_ALL);
                                    t.removeAudio(_.addedFullId)
                                }
                                i(!1)
                            }
                        }), removeClass(o, "added"), addClass(o, "canadd"), A && (removeClass(A, "added"), addClass(A, "canadd")), delete cur._audioAddRestoreInfo[r.fullId],
                        getAudioPlayer()
                        .notify(AudioPlayer.EVENT_REMOVED, r.fullId, _.addedFullId)
                }
            } else {
                var f = gpeByClass("_post", t);
                f && (p.post_id = domData(f, "post-id")), p.at = r.title, p.ap = r.performer, ajax.post("al_audio.php", p, {
                        onDone: function(t, e, o, s) {
                            if (t) {
                                var u = t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID];
                                if (d[r.fullId] = {
                                        state: "added",
                                        addedFullId: u
                                    }, a) {
                                    var n = getAudioPlayer()
                                        .getPlaylist(AudioPlaylist.TYPE_ALBUM, l ? -l : vk.id, AudioPlaylist.ALBUM_ALL);
                                    n.addAudio(t, 0)
                                }
                            }
                            i(!1)
                        },
                        onFail: function() {
                            removeClass(o, "added"), addClass(o, "canadd"), i(!1)
                        }
                    }), removeClass(o, "canadd"), addClass(o, "added"), A && (removeClass(A, "canadd"), addClass(A, "added")), getAudioPlayer()
                    .notify(AudioPlayer.EVENT_ADDED, r.fullId)
            }
        }
    },
    addAudioFromChooseBox: function(t, e, i, o, a, s, l) {
        var r = e.ctrlKey;
        t.innerHTML = "", showProgress(t), ajax.post("al_audio.php", {
            act: "add",
            gid: a,
            oid: i,
            aid: o,
            hash: s
        }, {
            onDone: function(e, i, o, s) {
                var u = a ? -a : vk.id;
                if (e) {
                    var n = getAudioPlayer()
                        .getPlaylist(AudioPlaylist.TYPE_ALBUM, u, AudioPlaylist.ALBUM_ALL);
                    n.addAudio(e, 0), cur.audioPage && cur.audioPage.switchToSection(n)
                }
                if (r) hideProgress(t), domReplaceEl(t, '<span class="choose_link audio_choose_added_label">' + l + "</span>");
                else
                    for (; __bq.count();) __bq.hideLast();
                nav.go("audios" + u)
            }
        })
    },
    chooseAudioBox: function(t, e, i) {
        if (window.event = window.event || i, void 0 !== t.selected) cur.lastAddMedia.unchooseMedia(t.selected), t.selected = void 0, removeClass(domPN(t),
            "audio_selected"), t.innerHTML = e.labels.add;
        else {
            var o = cur.attachCount && cur.attachCount() || 0;
            cur.chooseMedia("audio", e.owner_id + "_" + e.id, e.info), (!cur.attachCount || cur.attachCount() > o) && cur.lastAddMedia && (t.selected = cur.lastAddMedia.chosenMedias
                .length - 1, addClass(domPN(t), "audio_selected"), t.innerHTML = e.labels.cancel)
        }
        window.event = void 0
    },
    drawAudio: function(t, e) {
        for (var i = JSON.parse(getTemplate("audio_bits_to_cls")), o = t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS], a = [], s = 0; 32 > s; s++) {
            var l = 1 << s;
            o & l && a.push(i[l])
        }
        e && a.push(e);
        var r = formatTime(t[AudioUtils.AUDIO_ITEM_INDEX_DURATION]),
            u = t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER].replace(/<\/?em>/g, ""),
            n = clean(JSON.stringify(t))
            .split("$")
            .join("$$"),
            d = getTemplate("audio_row", t);
        return d = d.replace(/%cls%/, a.join(" ")), d = d.replace(/%duration%/, r), d = d.replace(/%serialized%/, n), d = d.replace(/%search_href%/, "/search?c[q]=" +
            encodeURIComponent(u) + "&c[section]=audio&c[performer]=1")
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
    getAudioFromEl: function(t, e) {
        t = domClosest("_audio_row", t);
        var i = data(t, "audio");
        return i || (i = JSON.parse(domData(t, "audio"))), e ? AudioUtils.asObject(i) : i
    },
    showAudioLayer: function(btn) {
        function initLayer(html, playlist, options, firstSong, script) {
            var telContent = ap.layer.getContent();
            addClass(telContent, "no_transition"), removeClass(telContent, "top_audio_loading"), telContent.innerHTML = html, eval(script);
            var layerScrollNode = geByClass1("audio_layer_rows_wrap", telContent);
            setStyle(layerScrollNode, "height", AudioUtils.AUDIO_LAYER_HEIGHT), options.layer = ap.layer, options.layer.sb = new Scrollbar(layerScrollNode, {
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
            return geByClass1("_im-page-wrap") || ge("page_body")
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
            if (ap.layer.isShown()) ap.layer.hide(), cancelStackFilter("top_audio", !0);
            else {
                ap.layer.show();
                var initFunc = data(ap.layer, "init-func");
                if (initFunc) data(ap.layer, "init-func", null), initFunc();
                else {
                    var audioPage = data(ap.layer, "audio-page");
                    audioPage && audioPage.onShow()
                }
                addClass(btn, "active"), cancelStackPush("top_audio", function() {
                    ap.layer.hide()
                }, !0)
            }
        else {
            var BORDER_COMPENSATION = 2,
                attachTo = ge("top_audio_layer_place");
            ap.layer = new ElementTooltip(attachTo, {
                delay: 0,
                content: rs(vk.pr_tpl, {
                    id: "",
                    cls: "pr_big"
                }),
                cls: "top_audio_loading top_audio_layer",
                autoShow: !1,
                forceSide: "bottom",
                onHide: function(t, e) {
                    audioPage = data(ap.layer, "audio-page"), audioPage && audioPage.onHide(), removeClass(btn, "active"), e && cancelStackFilter("top_audio", !
                        0)
                },
                width: getLayerWidth,
                setPos: function(t) {
                    var e, i, o;
                    isVisible(btn) ? (i = e = btn, o = 2) : (e = attachTo, i = geByClass1("top_audio_player_play"), o = 3);
                    var a = (getSize(btn), getXY(e)),
                        s = getXY(i),
                        l = getSize(i),
                        r = getXY("page_body"),
                        u = a[0] - r[0];
                    if (u = Math.min(u, 400), l[0]) {
                        var n = u + (s[0] - a[0]) + l[0] / 2 - o;
                        setPseudoStyle(this.getContent(), "after", {
                            left: n + "px"
                        })
                    }
                    return {
                        marginLeft: -u
                    }
                }
            }), ap.layer.show(), addClass(btn, "active"), ajax.post("al_audio.php", {
                act: "show_layer",
                my: currentPlaylist ? 0 : 1
            }, {
                onDone: function(t, e, i, o, a) {
                    var s = e;
                    ap.layer.isShown() ? initLayer(t, s, i, o, a) : data(ap.layer, "init-func", initLayer.pbind(t, s, i, o, a))
                }
            }), cancelStackPush("top_audio", function() {
                ap.layer.hide()
            }, !0)
        }
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
        for (var e = 0, i = t.list.length; i > e; e++) t.list[e] = AudioUtils.prepareAudioForPlaylist(t.list[e])
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
            lyrics: intval(t[AudioUtils.AUDIO_ITEM_INDEX_LYRICS]),
            url: t[AudioUtils.AUDIO_ITEM_INDEX_URL],
            flags: t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS],
            context: t[AudioUtils.AUDIO_ITEM_INDEX_CONTEXT],
            extra: t[AudioUtils.AUDIO_ITEM_INDEX_EXTRA],
            isTop: t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] & AudioUtils.AUDIO_ITEM_TOP_BIT,
            actHash: t[AudioUtils.AUDIO_ITEM_INDEX_ACT_HASH]
        } : null
    },
    initDomPlaylist: function(t, e) {
        var i = (getAudioPlayer(), []);
        return each(e, function(t, e) {
            e && each(geByClass("_audio_row", e), function(t) {
                i.push(AudioUtils.getAudioFromEl(this))
            })
        }), t.addAudio(i), t
    },
    getContextPlaylist: function(t) {
        function e(t) {
            return [].slice.call(t)
        }
        var i = null,
            o = [],
            a = getAudioPlayer(),
            s = 0,
            l = AudioUtils.getAudioFromEl(t, !0),
            r = null,
            u = gpeByClass("_audio_playlist", t);
        if (u) return i = data(u, "playlist");
        if (!cur.pid && inArray(cur.module, ["public", "wall", "groups", "profile"]) && (r = domClosest("_wall_audio_rows", t))) {
            var n = gpeByClass("_replies_list", t);
            n && (o = o.concat(e([n])));
            var d = inArray(cur.wallType, ["own", "full_own"]) ? "own" : "all";
            if (s = hashCode(d + "_" + (cur.wallQuery || "")), i = a.getPlaylist(AudioPlaylist.TYPE_WALL, cur.oid, s), -1 == i.indexOfAudio(l)) {
                i.clean();
                var _ = gpeByClass("_post", t),
                    A = domData(_, "post-id");
                A = A ? A.split("_")[1] : !1;
                var y = cur.wallQuery,
                    p = ge("wall_search");
                "wall" == cur.module && val(p) && (y = val(p)), A ? i.mergeWith({
                    postId: A,
                    wallQuery: y,
                    wallType: d
                }) : i = null
            }
            o = o.concat(e([r]))
        } else if (r = domClosest("choose_audio_rows", t)) cur.chooseAudioPlaylist = i = new AudioPlaylist(AudioPlaylist.TYPE_TEMP, vk.id, irand(999, 99999)), o = [r];
        else if (r = domClosest("_im_peer_history", t)) o = e(geByClass("_im_mess", r));
        else if (r = domClosest("replies_list", t)) o = e(geByClass("wall_audio_rows", r));
        else if (r = domClosest("_bt_rows", t)) o = e(geByClass("_wall_audio_rows", r));
        else if (r = domClosest("_feed_rows", t)) o = e(geByClass("wall_text", r)), s = "feed";
        else if ((r = domClosest("wall_posts", t)) && !domClosest("wall_tt", t)) {
            o = e(geByClass("wall_text", r));
            var h = geByClass1("post_fixed");
            h && o.unshift(geByClass1("wall_text", h))
        } else(r = gpeByClass("_module", t)) ? (i = a.getPlaylist(AudioPlaylist.TYPE_ALBUM, cur.oid, AudioPlaylist.ALBUM_ALL), o = [r]) : o = [domPN(t)];
        return i || (i = a.getPlaylist(AudioPlaylist.TYPE_TEMP, vk.id, s)), i = AudioUtils.initDomPlaylist(i, o), -1 == i.indexOfAudio(l) && (i = new AudioPlaylist(
            AudioPlaylist.TYPE_TEMP, vk.id, irand(999, 99999)), i = AudioUtils.initDomPlaylist(i, [domPN(t)])), i.load(), i
    },
    LOG_LS_KEY: "audiolog",
    debugLog: function() {},
    renderAudioDiag: function() {
        var t = ge("audio_diag_log"),
            e = ls.get(AudioUtils.LOG_LS_KEY) || [];
        t && each(e, function(e, i) {
            var o = new Date(i.shift())
                .toUTCString();
            i = i.join(", "), t.appendChild(se('<div class="audio_diag_log_row"><span class="audio_diag_log_time">' + o + "</span>" + i + "</div>"))
        })
    },
    claim: function(t) {
        var e = AudioUtils.getAudioFromEl(t, !0),
            i = AudioUtils.getAudioExtra(e);
        ajax.post("al_claims.php", {
            act: "a_claim",
            claim_id: i.moder_claim.claim,
            type: "audio",
            id: e.id,
            owner_id: e.owner_id,
            hash: e.actHash
        }, {
            onDone: function(e) {
                var i = gpeByClass("audio_row", t);
                addClass(i, "claimed claim_hidden")
            }
        })
    },
    unclaim: function(t) {
        var e = AudioUtils.getAudioFromEl(t, !0),
            i = AudioUtils.getAudioExtra(e),
            e = AudioUtils.getAudioFromEl(t, !0),
            i = AudioUtils.getAudioExtra(e);
        ajax.post("al_claims.php", {
            act: "a_unclaim",
            claim_id: i.moder_claim.claim,
            type: "audio",
            id: e.id,
            owner_id: e.owner_id,
            hash: e.actHash
        }, {
            onDone: function(e) {
                var i = gpeByClass("audio_row", t);
                removeClass(i, "claimed"), removeClass(i, "claim_hidden")
            }
        })
    },
    getUMAInfo: function(t) {
        var e = AudioUtils.getAudioFromEl(t, !0);
        AudioUtils.getAudioExtra(e);
        showBox("al_claims.php", {
            act: "getUMARestrictions",
            id: e.id,
            owner_id: e.owner_id,
            hash: e.actHash
        })
    }
};
TopAudioPlayer.TITLE_CHANGE_ANIM_SPEED = 190, TopAudioPlayer.init = function() {
        var t = ge("top_audio_player"),
            e = data(t, "object");
        e || (e = new TopAudioPlayer(t), data(t, "object", e))
    }, TopAudioPlayer.prototype.init = function() {
        function t(t) {
            return hasClass(this, "top_audio_player_play") ? (e.ap.isPlaying() ? e.ap.pause() : e.ap.play(), !1) : hasClass(this, "top_audio_player_prev") ? (e.ap.playPrev(), !1) :
                hasClass(this, "top_audio_player_next") ? (e.ap.playNext(), !1) : void 0
        }
        var e = this;
        this.ap.on(this, AudioPlayer.EVENT_UPDATE, this.onPlay.bind(this)), this.ap.on(this, AudioPlayer.EVENT_PLAY, this.onPlay.bind(this)), this.ap.on(this, AudioPlayer.EVENT_PAUSE,
            this.onPause.bind(this)), this.ap.top = this, each(["prev", "play", "next"], function(i, o) {
            addEvent(geByClass1("top_audio_player_" + o, e._el), "click", t)
        }), addEvent(this._el, "mousedown", function(t) {
            return cancelEvent(t), hasClass(domPN(t.target), "top_audio_player_btn") ? void 0 : 1 != t.which || hasClass(t.target, "top_audio_player_btn") || hasClass(t.target,
                "top_audio_player_act_icon") ? void 0 : showAudioLayer(t, ge("top_audio"))
        }), this.onPlay(this.ap.getCurrentAudio())
    }, TopAudioPlayer.prototype.onPlay = function(t, e, i) {
        function o() {
            var e = getAudioPlayer();
            setTimeout(function() {
                e.layer && e.layer.isShown() && e.layer.updatePosition()
            }, 1), addClass(l._el, a), toggleClass(l._el, "top_audio_player_playing", e.isPlaying());
            var o = geByClass1("_top_audio_player_play_blind_label");
            o && (o.innerHTML = e.isPlaying() ? getLang("global_audio_pause") : getLang("global_audio_play")), t = AudioUtils.asObject(t), clearTimeout(l._currTitleReTO);
            var s = geByClass1("top_audio_player_title_out", l._el);
            re(s);
            var r = geByClass1("top_audio_player_title", l._el);
            if (0 != i) {
                var u = 0 > i ? -10 : 10,
                    n = r.offsetLeft,
                    d = se('<div class="top_audio_player_title top_audio_player_title_next" style="opacity: 0; top:' + u + "px; left: " + n + 'px">' + t.performer + " &ndash; " +
                        t.title + "</div>");
                d.setAttribute("onmouseover", "setTitle(this)"), i > 0 ? domInsertAfter(d, r) : domInsertBefore(d, r), addClass(r, "top_audio_player_title_out"), setStyle(r, {
                    top: -u,
                    opacity: 0
                }), setTimeout(function() {
                    setStyle(d, {
                        top: 0,
                        opacity: 1
                    })
                }, 10), clearTimeout(l._currTitleReTO), l._currTitleReTO = setTimeout(function() {
                    re(r), removeClass(d, "top_audio_player_title_next")
                }, TopAudioPlayer.TITLE_CHANGE_ANIM_SPEED)
            } else r.innerHTML = t.performer + " &ndash; " + t.title, r.titleSet = 0, r.setAttribute("onmouseover", "setTitle(this)")
        }
        var a = "top_audio_player_enabled";
        if (!t) {
            removeClass(this._playIconBtn, a), removeClass(this._el, a), removeClass(this._el, "top_audio_player_playing"), show(this._playIconBtn);
            var s = getAudioPlayer();
            return void(s.layer && s.layer.isShown() && s.layer.updatePosition())
        }
        var l = this;
        i = intval(i), hasClass(this._playIconBtn, a) ? o() : (addClass(this._playIconBtn, a), setTimeout(function() {
            hide(l._playIconBtn), o()
        }, 150))
    }, TopAudioPlayer.prototype.onPause = function() {
        removeClass(this._el, "top_audio_player_playing");
        var t = geByClass1("_top_audio_player_play_blind_label");
        t && (t.innerHTML = getLang("global_audio_play"))
    }, TopAudioPlayer.prototype.onNext = function() {}, AudioPlaylist.plIndex = 0, AudioPlaylist.TYPE_CURRENT = "current", AudioPlaylist.TYPE_ALBUM = "album", AudioPlaylist.TYPE_TEMP =
    "temp", AudioPlaylist.TYPE_RECOM = "recoms", AudioPlaylist.TYPE_POPULAR = "popular", AudioPlaylist.TYPE_SEARCH = "search", AudioPlaylist.TYPE_FEED = "feed", AudioPlaylist.TYPE_LIVE =
    "live", AudioPlaylist.TYPE_WALL = "wall", AudioPlaylist.ALBUM_ALL = -2, AudioPlaylist.prototype.serialize = function() {
        var t = {},
            e = getAudioPlayer()
            .getCurrentAudio(),
            i = Math.max(0, this.indexOfAudio(e));
        return t.list = clone(this.getAudiosList()
            .slice(Math.max(0, i - 300), i + 300), !0), each(t.list, function(t, e) {
            e[AudioUtils.AUDIO_ITEM_INDEX_URL] = ""
        }), t.type = AudioPlaylist.TYPE_TEMP, t.ownerId = vk.id, t.albumId = irand(1, 999), t.hasMore = !1, t.title = this.getTitle(), JSON.stringify(t)
    }, AudioPlaylist.prototype.getId = function() {
        return this.getType() + "_" + this.getOwnerId() + "_" + this.getAlbumId()
    }, AudioPlaylist.prototype.isReference = function() {
        return !!this._ref
    }, AudioPlaylist.prototype.getSelf = function() {
        return this._ref && isObject(this._ref) ? this._ref : this
    }, AudioPlaylist.prototype._unref = function() {
        var t = this._ref;
        if (isObject(t)) {
            for (var e in t)
                if (t.hasOwnProperty(e) && !isFunction(t[e]) && 0 == e.indexOf("_")) {
                    var i = t[e];
                    params[e.substr(1)] = isObject(i) ? clone(i) : i
                }
            delete params.ownerId, delete params.hasMore, delete this._ref, this._type = AudioPlaylist.TYPE_TEMP, this._ownerId = params.ownerId || vk.id, this._albumId =
                AudioPlaylist.plIndex++, this._hasMore = !1, this._list = [], this.mergeWith(params)
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
        var e = this.getSelf();
        e._playbackParams = t
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
        var e = this.getSelf();
        e._localFoundTotal = t
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
            e = this.indexOfAudio(t); - 1 != e && (this._list.splice(e, 1), this._list.unshift(t))
    }, AudioPlaylist.prototype.clean = function() {
        this._unref(), this._hasMore = !0, this._list = [], this._items = [], this._feedOffset = this._feedFrom = 0, this._nextOffset = 0
    }, AudioPlaylist.prototype.shuffle = function(t) {
        if (this._unref(), this._shuffle = t, this._shuffle)
            if (this.hasMore()) {
                if (this._needSilentLoading()) return !1;
                if (this.getType() == AudioPlaylist.TYPE_SEARCH) {
                    if (this.getLocalFoundCount() > 1) {
                        var e = this._list.splice(0, this.getLocalFoundCount());
                        this._originalList = [].concat(e), shuffle(e), this._list = e.concat(this._list)
                    }
                } else {
                    var i = getAudioPlayer()
                        .getCurrentAudio();
                    this.indexOfAudio(i) >= 0 && (this._audioToFirstPos = i), this.clean()
                }
            } else this._originalList = [].concat(this._list), shuffle(this._list), this._moveCurrentAudioAtFirstPosition();
        else {
            if (this._originalList) this.getType() == AudioPlaylist.TYPE_SEARCH ? (this._list.splice(0, this.getLocalFoundCount()), this._list = this._originalList.concat(this._list)) :
                this._list = this._originalList;
            else {
                var i = getAudioPlayer()
                    .getCurrentAudio();
                this.indexOfAudio(i) >= 0 && (this._audioToFirstPos = i), this.clean()
            }
            delete this._shuffle, delete this._originalList
        }
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
        var e = this.indexOfAudio(t);
        this.load(e + 1);
        var i = 1;
        return e >= 0 && e + i < this.getAudiosCount() ? this.getAudioAt(e + i) : !1
    }, AudioPlaylist.prototype.load = function(t, e) {
        var i = void 0 === t,
            o = this;
        if (t = intval(t), this.getType() == AudioPlaylist.TYPE_SEARCH && void 0 === this.getLocalFoundCount()) {
            var a = getAudioPlayer()
                .getPlaylist(AudioPlaylist.TYPE_ALBUM, this.getOwnerId(), AudioPlaylist.ALBUM_ALL);
            return void a.loadSilent(function() {
                var i = o.getSearchParams();
                a.search(i.q, function(i) {
                    o.setLocalFoundCount(i.length), o.addAudio(i), o.load(t, e)
                })
            })
        }
        var s = this.getType() == AudioPlaylist.TYPE_FEED ? this.getItemsCount() : this.getAudiosCount();
        if (!i && this.hasMore() && 0 == t && s > 0) return e && e(this);
        if (!this.hasMore()) return e && e(this);
        if (this.getType() == AudioPlaylist.TYPE_ALBUM) return this.loadSilent(e);
        if (s - 20 > t) return e && e(this);
        if (this._onDoneLoading = this._onDoneLoading || [], this._onDoneLoading.push(e), !this._loading) {
            this._loading = !0;
            var l = this.getSearchParams();
            ajax.post("al_audio.php", {
                act: "a_load_section",
                type: this.getType(),
                owner_id: this.getOwnerId(),
                album_id: this.getAlbumId(),
                offset: this.getNextOffset(),
                search_q: l ? l.q : null,
                search_performer: l ? l.performer : null,
                search_lyrics: l ? l.lyrics : null,
                search_sort: l ? l.sort : null,
                feed_from: this.getFeedFrom(),
                feed_offset: this.getFeedOffset(),
                shuffle: this.getShuffle(),
                post_id: this.getPostId(),
                wall_query: this.getWallQuery(),
                wall_type: this.getWallType(),
                claim: intval(nav.objLoc.claim)
            }, {
                onDone: function(t) {
                    getAudioPlayer()
                        .mergePlaylistData(o, t), o._audioToFirstPos && (o.addAudio(o._audioToFirstPos, 0), delete o._audioToFirstPos), delete o._loading;
                    var e = o._onDoneLoading;
                    delete o._onDoneLoading, each(e || [], function(t, e) {
                            e && e(o)
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
        var e = this.indexOfAudio(t);
        if (e >= 0) {
            this._unref();
            var i = this._list.splice(e, 1);
            return this._index && this._index.remove(i[0]), e
        }
        return -1
    }, AudioPlaylist.prototype.addAudio = function(t, e) {
        function i(t) {
            var i = o.indexOfAudio(t);
            if (i >= 0) {
                if (a) return;
                o._list.splice(i, 1)
            }
            t = clone(t), t[AudioUtils.AUDIO_ITEM_INDEX_TITLE] = clean(replaceEntities(t[AudioUtils.AUDIO_ITEM_INDEX_TITLE])
                    .replace(/(<em>|<\/em>)/g, "")), t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] = clean(replaceEntities(t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER])
                    .replace(/(<em>|<\/em>)/g, "")), t[AudioUtils.AUDIO_ITEM_INDEX_FLAGS] &= ~AudioUtils.AUDIO_ITEM_INLINED_BIT, a ? o._list.push(t) : o._list.splice(e, 0, t), o._index &&
                o._index.remove(t)
        }
        this._unref();
        var o = this,
            a = void 0 === e;
        if (isArray(t) && isArray(t[0]))
            for (var s = 0, l = t.length; l > s; s++) i(t[s]);
        else t.length && i(t)
    }, AudioPlaylist.prototype.mergeWith = function(t) {
        if (!isObject(this._ref)) {
            var e = t.list;
            if (e) {
                var i = getAudioPlayer()
                    .getCurrentAudio();
                if (i && this.indexOfAudio(i) >= 0) {
                    for (var o = -1, a = 0, s = e.length; s > a; a++)
                        if (i[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] == e[a][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] && i[AudioUtils.AUDIO_ITEM_INDEX_ID] == e[a][AudioUtils.AUDIO_ITEM_INDEX_ID]) {
                            o = a;
                            break
                        }
                    o >= 0 && this.clean()
                }
                this.addAudio(t.list)
            }
            if (t.items) {
                this._items = this._items || [];
                for (var a = 0, s = t.items.length; s > a; a++) this._items.push(t.items[a])
            }
            var l = this;
            each("blocks nextOffset hasMore isComplete title feedFrom feedOffset live searchParams totalCount band postId wallQuery wallType".split(" "), function(e, i) {
                void 0 !== t[i] && (l["_" + i] = t[i])
            })
        }
    }, AudioPlaylist.prototype.moveAudio = function(t, e) {
        this._unref();
        var i = this._list.splice(t, 1);
        e > t && (e -= 1), this._list.splice(e, 0, i[0])
    }, AudioPlaylist.prototype.indexOfAudio = function(t) {
        if (!t) return -1;
        var e;
        isString(t) ? e = t : isObject(t) ? e = t.fullId : isArray(t) && (e = t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[AudioUtils.AUDIO_ITEM_INDEX_ID]), e = e.split("_");
        for (var i = this.getSelf(), o = 0, a = i._list.length; a > o; o++)
            if (e[0] == i._list[o][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] && e[1] == i._list[o][AudioUtils.AUDIO_ITEM_INDEX_ID]) return o;
        return -1
    }, AudioPlaylist.prototype.getAudio = function(t) {
        isString(t) ? t : AudioUtils.asObject(t)
            .fullId;
        t = t.split("_");
        for (var e = this.getSelf(), i = 0, o = e._list.length; o > i; i++)
            if (t[0] == e._list[i][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] && t[1] == e._list[i][AudioUtils.AUDIO_ITEM_INDEX_ID]) return e._list[i];
        return null
    }, AudioPlaylist.prototype._ensureIndex = function(t) {
        var e = this.getSelf();
        if (this.getType() == AudioPlaylist.TYPE_ALBUM) {
            var i = function(t, e) {
                var i = intval(e);
                return i >= 33 && 48 > i ? String.fromCharCode(i) : t
            };
            e._index = new vkIndexer(e._list, function(t) {
                return (t[AudioUtils.AUDIO_ITEM_INDEX_PERFORMER] + " " + t[AudioUtils.AUDIO_ITEM_INDEX_TITLE])
                    .replace(/\&\#(\d+);?/gi, i)
            }, t)
        } else t && t()
    }, AudioPlaylist.prototype.search = function(t, e) {
        var i = this.getSelf();
        this._ensureIndex(function() {
            return e(i._index ? i._index.search(t) : [])
        }.bind(this))
    }, AudioPlaylist.prototype.toString = function() {
        return this.getId()
    }, AudioPlaylist.prototype.fetchNextLiveAudio = function(t) {
        var e = this.getLiveInfo(),
            i = this;
        ajax.post("al_audio.php", {
            act: "a_get_audio_status",
            host_id: e.hostId
        }, {
            onDone: function(e) {
                if (e) {
                    var o = i.indexOfAudio(e);
                    o >= 0 ? i.moveAudio(o, i.getAudiosCount() - 1) : i.addAudio(e)
                }
                t && t(e)
            }
        })
    }, AudioPlaylist.prototype.loadSilent = function(t, e) {
        var i = this;
        if (this.hasMore() && this.getType() == AudioPlaylist.TYPE_ALBUM) {
            if (this._onDoneLoading = this._onDoneLoading || [], this._onDoneLoading.push(t), this._silentLoading) return;
            this._silentLoading = !0, ajax.post("al_audio.php", {
                act: "load_silent",
                owner_id: this.getOwnerId(),
                album_id: this.getAlbumId(),
                claim: nav.objLoc.claim,
                band: this.isPopBand() ? this.getOwnerId() : !1
            }, {
                showProgress: e ? e.showProgress : !1,
                hideProgress: e ? e.hideProgress : !1,
                onDone: function(t) {
                    getAudioPlayer()
                        .mergePlaylistData(i, t), delete i._silentLoading;
                    var e = i._onDoneLoading;
                    delete i._onDoneLoading, each(e || [], function(t, e) {
                        e && e(i)
                    })
                }
            })
        } else t && t(this)
    }, AudioPlayer.prototype._initImpl = function(t) {
        function e(t) {
            if (t && (o++, i._implSetDelay(200), o > 3)) {
                o = 0;
                var e = new MessageBox({
                        title: getLang("global_error")
                    })
                    .content(getLang("audio_error_loading"))
                    .setButtons("Ok", function() {
                        curBox()
                            .hide()
                    });
                return e.show(), void setWorkerTimeout(function() {
                    e.hide()
                }, 3e3)
            }
            i._repeatCurrent ? (i._implSeekImmediate(0), i._implPlay()) : (i._isPlaying = !1, i.notify(AudioPlayer.EVENT_PAUSE), i.notify(AudioPlayer.EVENT_ENDED), i.playNext(!0))
        }
        var i = this;
        this._impl && this._impl.destroy();
        var o = 0,
            a = -1,
            s = {
                onBufferUpdate: function(t) {
                    i.notify(AudioPlayer.EVENT_BUFFERED, t)
                },
                onSeeked: function() {
                    a = -1
                },
                onSeek: function() {
                    a = -1
                },
                onEnd: function() {
                    "html5" != i._impl.type && e()
                },
                onFail: function() {
                    e(!0)
                },
                onCanPlay: function() {
                    i.notify(AudioPlayer.EVENT_CAN_PLAY)
                },
                onProgressUpdate: function(t) {
                    var o = i.getCurrentAudio();
                    if (!i._muteProgressEvents && o) {
                        var s = 0;
                        if (a > 0 && (s = Math.max(0, t - a)), a = t, i.notify(AudioPlayer.EVENT_PROGRESS, t), i._testIncCurrentDelay(o[AudioUtils.AUDIO_ITEM_INDEX_DURATION] *
                                s), "html5" == i._impl.type) {
                            if (o) {
                                var l = .3;
                                s = Math.min(s, l / o[AudioUtils.AUDIO_ITEM_INDEX_DURATION])
                            }
                            t >= 1 - s && e()
                        }
                        a = t
                    }
                }
            };
        AudioUtils.debugLog("Implementation init"), AudioUtils.debugLog("param browser.flash", browser.flash), AudioUtils.debugLog("param force HTML5", !!t), AudioPlayerHTML5.isSupported() ||
            t ? (AudioUtils.debugLog("Initializing HTML5 impl"), this._impl = new AudioPlayerHTML5(s)) : browser.flash && (AudioUtils.debugLog("Initializing Flash impl"), this._impl =
                new AudioPlayerFlash(s)), this._implSetVolume(0)
    }, AudioPlayer.EVENT_PLAY = "start", AudioPlayer.EVENT_PAUSE = "pause", AudioPlayer.EVENT_STOP = "stop", AudioPlayer.EVENT_UPDATE = "update", AudioPlayer.EVENT_LOADED =
    "loaded", AudioPlayer.EVENT_ENDED = "ended", AudioPlayer.EVENT_FAILED = "failed", AudioPlayer.EVENT_BUFFERED = "buffered", AudioPlayer.EVENT_PROGRESS = "progress", AudioPlayer
    .EVENT_VOLUME = "volume", AudioPlayer.EVENT_PLAYLIST_CHANGED = "plchange", AudioPlayer.EVENT_ADDED = "added", AudioPlayer.EVENT_REMOVED = "removed", AudioPlayer.EVENT_START_LOADING =
    "start_load", AudioPlayer.EVENT_CAN_PLAY = "actual_start", AudioPlayer.LS_VER = "v10", AudioPlayer.LS_KEY_PREFIX = "audio", AudioPlayer.LS_PREFIX = AudioPlayer.LS_KEY_PREFIX +
    "_" + AudioPlayer.LS_VER + "_", AudioPlayer.LS_VOLUME = "vol", AudioPlayer.LS_PL = "pl", AudioPlayer.LS_TRACK = "track", AudioPlayer.LS_SAVED = "saved", AudioPlayer.LS_PROGRESS =
    "progress", AudioPlayer.LS_DURATION_TYPE = "dur_type", AudioPlayer.LS_TEST_CURRENT_DELAY = "test_current_delay_v2", AudioPlayer.LISTEN_TIME = 10, AudioPlayer.DEFAULT_VOLUME =
    .8;
var audioIconSuffix = window.devicePixelRatio >= 2 ? "_2x" : "";
AudioPlayer.tabIcons = {
        def: "/images/icons/favicons/fav_logo" + audioIconSuffix + ".ico",
        play: "/images/icons/favicons/fav_play" + audioIconSuffix + ".ico",
        pause: "/images/icons/favicons/fav_pause" + audioIconSuffix + ".ico"
    }, AudioPlayer.getLang = function(t) {
        var e = getAudioPlayer();
        return e && e.langs ? e.langs[t] : t
    }, AudioPlayer.clearDeprecatedCacheKeys = function() {
        AudioPlayer._iterateCacheKeys(function(t) {
            return t == AudioPlayer.LS_VER
        })
    }, AudioPlayer.clearOutdatedCacheKeys = function() {
        var t = ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_SAVED) || 0,
            e = 72e5;
        t < vkNow() - e && AudioPlayer._iterateCacheKeys(function(t, e) {
            return !inArray(e, [AudioPlayer.LS_PL, AudioPlayer.LS_TRACK, AudioPlayer.LS_PROGRESS])
        })
    }, AudioPlayer.clearAllCacheKeys = function() {
        AudioPlayer._iterateCacheKeys(function() {
            return !1
        }), setCookie("remixcurr_audio", "", -1)
    }, AudioPlayer._iterateCacheKeys = function(t) {
        for (var e in window.localStorage)
            if (0 === e.indexOf(AudioPlayer.LS_KEY_PREFIX + "_")) {
                var i = e.split("_");
                t(i[1], i[2]) || localStorage.removeItem(e)
            }
    }, AudioPlayer.prototype._testGetCurrentDelay = function() {
        var t = this._lsGet(AudioPlayer.LS_TEST_CURRENT_DELAY) || {
            ts: vkNow(),
            delay: 0
        };
        return vkNow() - t.ts > 18e6 ? (this._testSetCurrentDelay(0), 0) : t.delay
    }, AudioPlayer.prototype._testSetCurrentDelay = function(t) {
        this._lsSet(AudioPlayer.LS_TEST_CURRENT_DELAY, {
            delay: t,
            ts: vkNow()
        })
    }, AudioPlayer.prototype._testIncCurrentDelay = function(t) {
        var e = this._testGetCurrentDelay() + t;
        this._testSetCurrentDelay(e), cur.showCurrentDelay && debugLog(Math.round(e))
    }, AudioPlayer.prototype._testPlayTest = function() {
        this._testTexts.test_play_text && debugLog(this._testTexts.test_play_text), ajax.post("al_audio.php", {
            act: "test_event",
            event: "play",
            section: this._testCurSection
        }), this._testNeedPlayTest = !1
    }, AudioPlayer.prototype._testIsNeedPlayTest = function() {
        return this._testNeedPlayTest || !1
    }, AudioPlayer.prototype.getLayerTT = function() {
        return this.layerTT
    }, AudioPlayer.prototype.isImplInited = function() {
        return !!this._impl
    }, AudioPlayer.prototype.onMediaKeyPressedEvent = function(t) {
        var e = this.getCurrentAudio();
        this.getCurrentPlaylist();
        if (e) switch (t.keyCode) {
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
        for (var e = 0; e < this._playlists.length; e++) this._playlists[e] == t && this._playlists.splice(e, 1);
        delete t
    }, AudioPlayer.prototype.mergePlaylistData = function(t, e) {
        return t.hasMore() ? void each(this._playlists, function(i, o) {
            o.getId() == t.getId() && o.mergeWith(e)
        }) : t
    }, AudioPlayer.prototype.deleteCurrentPlaylist = function() {
        this.stop(), delete this._currentAudio, delete this._currentPlaylist, this.notify(AudioPlayer.EVENT_UPDATE), this.notify(AudioPlayer.EVENT_PLAYLIST_CHANGED)
    }, AudioPlayer.prototype.updateCurrentPlaying = function(t) {
        t = !!t;
        var e = (this.getCurrentPlaylist(), AudioUtils.asObject(this.getCurrentAudio())),
            i = [];
        if (e) {
            var o = geByClass("_audio_row_" + e.fullId);
            i = i.concat([].slice.call(o))
        }
        for (var a = 0, s = this._currentPlayingRows.length; s > a; a++) {
            var l = this._currentPlayingRows[a];
            l && !inArray(l, i) && this.toggleCurrentAudioRow(l, !1, t)
        }
        if (e)
            for (var a = 0, s = i.length; s > a; a++) {
                var l = i[a];
                l && this.toggleCurrentAudioRow(l, !0, t)
            }
        this._currentPlayingRows = i
    }, AudioPlayer.prototype.toggleCurrentAudioRow = function(t, e, i) {
        function o() {
            if (r && (e ? u._addRowPlayer(t, i) : u._removeRowPlayer(t)), e) u.on(t, AudioPlayer.EVENT_PLAY, function(e) {
                AudioUtils.asObject(e)
                    .fullId == AudioUtils.getAudioFromEl(t, !0)
                    .fullId && (addClass(t, AudioUtils.AUDIO_PLAYING_CLS), s && attr(s, "aria-label", getLang("global_audio_pause")), l && attr(l, "role", "heading"))
            }), u.on(t, AudioPlayer.EVENT_PROGRESS, function(e, i) {
                e = AudioUtils.asObject(e);
                var o, a = intval(e.duration);
                o = u.getDurationType() ? "-" + formatTime(Math.round(a - i * a)) : formatTime(Math.round(i * a)), geByClass1("audio_duration", t)
                    .innerHTML = o
            }), u.on(t, [AudioPlayer.EVENT_PAUSE, AudioPlayer.EVENT_ENDED], function(e) {
                removeClass(t, AudioUtils.AUDIO_PLAYING_CLS), s && attr(s, "aria-label", getLang("global_audio_play")), l && attr(l, "role", "")
            }), toggleClass(t, AudioUtils.AUDIO_PLAYING_CLS, u.isPlaying());
            else {
                u.off(t), removeClass(t, AudioUtils.AUDIO_PLAYING_CLS);
                var o = geByClass1("audio_duration", t);
                o && (o.innerHTML = formatTime(AudioUtils.getAudioFromEl(t, !0)
                    .duration)), s && attr(s, "aria-label", getLang("global_audio_play")), l && attr(l, "role", "")
            }
            i ? setTimeout(function() {
                var e = intval(domData(t, "is-current"));
                toggleClass(t, AudioUtils.AUDIO_CURRENT_CLS, !!e)
            }) : toggleClass(t, AudioUtils.AUDIO_CURRENT_CLS, e)
        }
        var a = !!intval(domData(t, "is-current"));
        if (a != e) {
            domData(t, "is-current", intval(e));
            var s = geByClass1("_audio_play", t),
                l = geByClass1("_audio_title", t),
                r = hasClass(t, "inlined");
            r && toggleClass(t, "audio_with_transition", i), i = r ? i : !1;
            var u = this;
            i ? setTimeout(o) : o()
        }
    }, AudioPlayer.prototype._removeRowPlayer = function(t) {
        removeClass(t, AudioUtils.AUDIO_CURRENT_CLS);
        var e = data(t, "player_inited");
        if (e) {
            setTimeout(function() {
                re(geByClass1("_audio_inline_player", t))
            }, 200);
            var i = geByClass1("_audio_duration", t);
            i && (i.innerHTML = formatTime(AudioUtils.getAudioFromEl(t, !0)
                .duration)), this.off(t), each(e.sliders, function() {
                this.destroy()
            }), data(t, "player_inited", !1)
        }
    }, AudioPlayer.prototype._addRowPlayer = function(t, e) {
        if (!geByClass1("_audio_inline_player", t)) {
            var i = this,
                o = se(vk.audioParams.audioInlinePlayerTpl || getTemplate("audio_inline_player")),
                a = geByClass1("_audio_player_wrap", t);
            a.appendChild(o);
            var s = new Slider(geByClass1("audio_inline_player_volume", o), {
                    value: i.getVolume(),
                    backValue: 0,
                    size: 1,
                    hintClass: "audio_player_hint",
                    withBackLine: !0,
                    log: !0,
                    formatHint: function(t) {
                        return Math.round(100 * t) + "%"
                    },
                    onChange: function(t) {
                        i.setVolume(t)
                    }
                }),
                l = new Slider(geByClass1("audio_inline_player_progress", o), {
                    value: 0,
                    backValue: 0,
                    size: 1,
                    hintClass: "audio_player_hint",
                    withBackLine: !0,
                    formatHint: function(t) {
                        var e = AudioUtils.asObject(i.getCurrentAudio());
                        return formatTime(Math.round(t * e.duration))
                    },
                    onEndDragging: function(t) {
                        i.seek(t)
                    }
                });
            i.on(t, AudioPlayer.EVENT_START_LOADING, function() {
                l.toggleLoading(!0)
            }), i.on(t, AudioPlayer.EVENT_CAN_PLAY, function() {
                l.toggleLoading(!1)
            }), i.on(t, AudioPlayer.EVENT_BUFFERED, function(t, e) {
                l.setBackValue(e)
            }), i.on(t, AudioPlayer.EVENT_PROGRESS, function(t, e) {
                l.setValue(e)
            }), i.on(t, AudioPlayer.EVENT_VOLUME, function(t, e) {
                s.setValue(e)
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
            .fullId : t, each(this._playlists, function(e, i) {
                i.removeAudio(t)
            })
    }, AudioPlayer.prototype.triggerAudioUpdated = function() {
        this.notify(AudioPlayer.EVENT_UPDATE)
    }, AudioPlayer.prototype.updateAudio = function(t, e) {
        var i = "";
        if (isString(t) ? i = t : isArray(t) && (i = AudioUtils.asObject(t)
                .fullId), e || (e = t), each(this._playlists, function(t, o) {
                for (var a = o.getAudiosList(), s = 0, l = a.length; l > s; s++)
                    if (a[s][AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + a[s][AudioUtils.AUDIO_ITEM_INDEX_ID] == i) return isObject(e) && each(e, function(t, e) {
                        a[s][t] = e
                    }), void(isArray(e) && (a[s] = e))
            }), this._currentAudio[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + this._currentAudio[AudioUtils.AUDIO_ITEM_INDEX_ID] == i) {
            if (isObject(e)) {
                var o = this;
                each(e, function(t, e) {
                    o._currentAudio[t] = e
                })
            }
            isArray(e) && (this._currentAudio = e)
        }
        return this.notify(AudioPlayer.EVENT_UPDATE), t
    }, AudioPlayer.prototype._sendLCNotification = function() {
        var t = window.Notifier;
        t && t.lcSend("audio_start");
        try {
            var e = ge("video_player") || window.html5video || null;
            e && e.playVideo && e.playVideo(!1)
        } catch (i) {}
    }, AudioPlayer.prototype.showHQLabel = function(t) {
        var e = "_audio_show_hq_label";
        return void 0 === t ? !!ls.get(e) : (t = !!t, ls.set(e, t), AudioUtils.toggleAudioHQBodyClass(), t)
    }, AudioPlayer.prototype._restoreVolumeState = function() {
        AudioPlayer.clearDeprecatedCacheKeys(), AudioPlayer.clearOutdatedCacheKeys();
        var t = this._lsGet(AudioPlayer.LS_VOLUME);
        this._userVolume = void 0 == t || t === !1 ? AudioPlayer.DEFAULT_VOLUME : t
    }, AudioPlayer.prototype._restoreState = function() {
        if (!vk.widget) {
            AudioPlayer.clearDeprecatedCacheKeys(), AudioPlayer.clearOutdatedCacheKeys(), this._currentAudio = this._lsGet(AudioPlayer.LS_TRACK);
            var t = this._lsGet(AudioPlayer.LS_PL);
            t && (t = JSON.parse(t), this._currentPlaylist = new AudioPlaylist(t)), this._currentPlaylist && this._currentAudio ? this.notify(AudioPlayer.EVENT_UPDATE) : this._currentPlaylist =
                this._currentAudio = !1;
            var e = this._lsGet(AudioPlayer.LS_PROGRESS) || 0;
            this._currentAudio && e && this._impl && "html5" == this._impl.type && (this._implSetUrl(this._currentAudio, !0), this._implSeek(e), this._implSetVolume(0))
        }
    }, AudioPlayer.prototype._ensureImplReady = function(t) {
        var e = this;
        this._impl && this._impl.onReady(function(i) {
            return i ? t() : void("flash" == e._impl.type && (AudioUtils.debugLog("Flash not initialized, lets try HTML5 as desperate way"), e._initImpl(!0)))
        })
    }, AudioPlayer.prototype._implNewTask = function(t, e) {
        this._taskIDCounter = this._taskIDCounter || 1, this._tasks = this._tasks || [], this._tasks.push({
            name: t,
            cb: e,
            id: t + "_" + this._taskIDCounter++
        }), this._implDoTasks()
    }, AudioPlayer.prototype._implDoTasks = function() {
        if (this._tasks = this._tasks || [], !this._taskInProgress) {
            var t = this._tasks.shift();
            if (t) {
                var e = this;
                t = clone(t), this._taskInProgress = t.id, this._ensureImplReady(function() {
                    t.cb.call(e, function() {
                        return e._taskAbort == t.id ? void(e._taskAbort = !1) : (e._taskInProgress = !1, void e._implDoTasks())
                    })
                })
            }
        }
    }, AudioPlayer.prototype._implClearAllTasks = function() {
        this._taskAbort = this._taskInProgress, this._taskInProgress = !1, this._tasks = []
    }, AudioPlayer.prototype._implClearTask = function(t) {
        this._tasks = this._tasks || [], this._tasks = this._tasks.filter(function(e) {
            return e.name != t
        })
    }, AudioPlayer.prototype._implSetDelay = function(t) {
        this._implNewTask("delay", function e(t) {
            setWorkerTimeout(t, e)
        })
    }, AudioPlayer.prototype._implPlay = function() {
        var t = this;
        this._implNewTask("play", function(e) {
            audio = AudioUtils.asObject(t.getCurrentAudio()), t._impl.play(audio.url), t._muteProgressEvents = !1, t._allowPrefetchNext = !0, e()
        })
    }, AudioPlayer.prototype._implSeekImmediate = function(t) {
        this._impl && this._impl.seek(t)
    }, AudioPlayer.prototype._implSeek = function(t) {
        var e = this;
        this._implClearTask("seek"), this._implNewTask("seek", function(i) {
            e._impl.seek(t), i()
        })
    }, AudioPlayer.prototype._implPause = function() {
        var t = this;
        this._implNewTask("pause", function(e) {
            t._impl.pause(), e()
        })
    }, AudioPlayer.prototype._implSetVolume = function(t, e) {
        if (this._impl) {
            var i = this;
            if (e) {
                var o = 0 == t ? "vol_down" : "vol_up";
                this._implNewTask(o, function(e) {
                    i._impl.fadeVolume(t, function() {
                        e()
                    })
                })
            } else this._implNewTask("vol_set", function(e) {
                i._impl.setVolume(t), e()
            })
        }
    }, AudioPlayer.prototype._implSetUrl = function(t, e) {
        var i = this;
        this._implClearTask("url"), this._implNewTask("url", function(o) {
            e || i.notify(AudioPlayer.EVENT_START_LOADING);
            var a = i._taskInProgress;
            i._ensureHasURL(t, function(t) {
                a == i._taskInProgress && (t = AudioUtils.asObject(t), i._impl.setUrl(t.url, function(t) {
                    t || (i._implClearAllTasks(), i._onFailedUrl()), o()
                }))
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
            e = this;
        t && (t.addRecvClbk("audio_start", "audio", function(t) {
            e.isPlaying() && e.pause(!1, e._fadeVolumeWorker ? !1 : !0), delete e.pausedByVideo
        }), t.addRecvClbk("video_start", "audio", function(t) {
            e.isPlaying() && (e.pause(), e.pausedByVideo = vkNow())
        }), t.addRecvClbk("video_hide", "audio", function(t) {
            !e.isPlaying() && e.pausedByVideo && (vkNow() - e.pausedByVideo < 18e4 && e.play(), delete e.pausedByVideo)
        }), t.addRecvClbk("logged_off", "audio", function() {
            cur.loggingOff = !0, AudioPlayer.clearAllCacheKeys(), e.stop()
        }))
    }, AudioPlayer.prototype.addPlaylist = function(t) {
        this.hasPlaylist(t.getId()) || this._playlists.push(t)
    }, AudioPlayer.prototype.shufflePlaylist = function(t) {
        if (t.shuffle = irand(1, 999), t.has_more)
            if (AudioUtils.getPlaylistType(t) == AudioPlaylist.TYPE_SEARCH) {
                if (t.localFoundTotal && intval(t.localFoundTotal) > 1) {
                    var e = t.list.splice(0, t.localFoundTotal);
                    t.original = [].concat(e), shuffle(e), t.list = e.concat(t.list)
                }
            } else t.list = [], t.offset = t.next_offset = 0;
        else t.original = [].concat(t.list), shuffle(t.list), delete t.localFoundTotal, this.moveCurrentPlayingAtFirstPos(t)
    }, AudioPlayer.prototype.moveCurrentPlayingAtFirstPos = function(t) {
        var e = this.getCurrentAudio();
        if (e && -1 != this.getAudioPlaylistPosition(e, t)) {
            var i = t.list[0];
            if (t.list.length && i[AudioUtils.AUDIO_ITEM_INDEX_ID] == e[AudioUtils.AUDIO_ITEM_INDEX_ID]) return;
            for (var o = 0, a = t.list.length; a > o; o++)
                if (t.list[o][AudioUtils.AUDIO_ITEM_INDEX_ID] == e[AudioUtils.AUDIO_ITEM_INDEX_ID]) {
                    t.list.splice(o, 1);
                    break
                }
            t.list.unshift(e)
        }
    }, AudioPlayer.prototype.restoreShufflePlaylist = function(t) {
        delete t.shuffle, (t.original || AudioUtils.isPaginatedPlaylist(t)) && (t.has_more ? AudioUtils.getPlaylistType(t) == AudioPlaylist.TYPE_SEARCH && t.localFoundTotal ? (t.list
            .splice(0, t.localFoundTotal), t.list = t.original.concat(t.list)) : (t.list = [], t.offset = t.next_offset = 0) : t.list = t.original, delete t.original)
    }, AudioPlayer.prototype.hasPlaylist = function(t, e, i) {
        var o;
        o = void 0 !== e && void 0 !== i ? t + "_" + e + "_" + i : t;
        for (var a = 0; a < this._playlists.length; a++) {
            var s = this._playlists[a];
            if (!s.isReference() && s.getId() == o) return s
        }
        return !1
    }, AudioPlayer.prototype.getPlaylist = function(t, e, i) {
        if (t && !e && !i) {
            var o = t.split("_");
            t = o[0], e = o[1], i = o[2]
        }
        var a = this.hasPlaylist(t, e, i);
        if (a) return a;
        if (t == AudioPlaylist.TYPE_ALBUM && i != AudioPlaylist.ALBUM_ALL) {
            var s = this.getPlaylist(AudioPlaylist.TYPE_ALBUM, e, AudioPlaylist.ALBUM_ALL);
            if (!s.hasMore() && s.isComplete()) {
                var l = new AudioPlaylist(AudioPlaylist.TYPE_ALBUM, e, i);
                return each(s.getAudiosList(), function(t, e) {
                    e[AudioUtils.AUDIO_ITEM_INDEX_ALBUM_ID] == i && l.addAudio(e)
                }), l
            }
        }
        return new AudioPlaylist({
            type: t,
            ownerId: e,
            albumId: i,
            hasMore: t != AudioPlaylist.TYPE_TEMP
        })
    }, AudioPlayer.prototype.toggleRepeatCurrentAudio = function() {
        this._repeatCurrent = !this._repeatCurrent
    }, AudioPlayer.prototype.isRepeatCurrentAudio = function() {
        return !!this._repeatCurrent
    }, AudioPlayer.prototype.setNext = function(t, e) {
        var i = domClosest("_audio_row", t),
            o = AudioUtils.getAudioFromEl(i),
            a = AudioUtils.asObject(o);
        if (!hasClass(i, "audio_added_next")) {
            addClass(i, "audio_added_next");
            var s = this.getCurrentPlaylist();
            if (s) {
                var l = AudioUtils.asObject(this.getCurrentAudio());
                if (l && a.fullId == l.fullId) return;
                var r = s.indexOfAudio(l);
                if (-1 == r) return;
                var u = s.indexOfAudio(a); - 1 != u ? s.moveAudio(u, r + 1) : s.addAudio(o, r + 1)
            } else s = AudioUtils.getContextPlaylist(i), this.play(o, s)
        }
        return cancelEvent(e)
    }, AudioPlayer.prototype._setTabIcon = function(t) {
        setFavIcon(AudioPlayer.tabIcons[t])
    }, AudioPlayer.prototype.on = function(t, e, i) {
        isArray(e) || (e = [e]), each(e, function(e, o) {
            this.subscribers.push({
                context: t,
                et: o,
                cb: i
            })
        }.bind(this))
    }, AudioPlayer.prototype.off = function(t) {
        this.subscribers = this.subscribers.filter(function(e) {
            return e.context != t
        })
    }, AudioPlayer.prototype.notify = function(t, e, i) {
        var o = this.getCurrentAudio();
        if (this._impl && (!this._muteProgressEvents || !inArray(t, [AudioPlayer.EVENT_BUFFERED, AudioPlayer.EVENT_PROGRESS]))) switch (inArray(t, [AudioPlayer.EVENT_PLAY,
            AudioPlayer.EVENT_PAUSE
        ]) && (this.subscribers = this.subscribers.filter(function(t) {
            return t.context instanceof Element ? bodyNode.contains(t.context) : !0
        }), this.updateCurrentPlaying(!0)), each(this.subscribers || [], function(a, s) {
            s.et == t && s.cb(o, e, i)
        }), t) {
            case AudioPlayer.EVENT_VOLUME:
                this._lsSet(AudioPlayer.LS_VOLUME, this._userVolume);
                break;
            case AudioPlayer.EVENT_PLAY:
                this.saveStateCurrentPlaylist(), this._saveStateCurrentAudio(), this._setTabIcon("play"), this._sendStatusExport();
                break;
            case AudioPlayer.EVENT_PLAYLIST_CHANGED:
                this.saveStateCurrentPlaylist(), this._saveStateCurrentAudio();
                break;
            case AudioPlayer.EVENT_PROGRESS:
                if (!vk.widget) {
                    var a = this._impl.getCurrentProgress();
                    this._lsSet(AudioPlayer.LS_PROGRESS, a);
                    var s = o[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + o[AudioUtils.AUDIO_ITEM_INDEX_ID];
                    if (!this._listened[s] && this._impl.getPlayedTime() >= AudioPlayer.LISTEN_TIME && (this._sendPlayback(), this._listened[s] = !0), this._allowPrefetchNext &&
                        a >= .8) {
                        var l = this.getCurrentPlaylist(),
                            r = l.getNextAudio(o);
                        r && this._impl.isFullyLoaded() && (this._allowPrefetchNext = !1, this._prefetchAudio(r))
                    }
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
            var e = AudioUtils.asObject(this.getCurrentAudio()),
                i = {};
            if (t.isLive() && (i.status = 1), t.getType() == AudioPlaylist.TYPE_RECOM && (i.recommendation = 1), t.getType() == AudioPlaylist.TYPE_POPULAR) {
                var o = (t.getAlbumId() + "")
                    .replace("foreign", "");
                intval(o) && (i.popular_genre = 1), i.top_audio = 1
            }
            if (t.getType() == AudioPlaylist.TYPE_FEED && (i.feed_audio = 1), t.getType() == AudioPlaylist.TYPE_ALBUM && (t.getAlbumId() == AudioPlaylist.ALBUM_ALL && t.isPopBand() &&
                    (i.top_bands = 1, i.friend = t.getOwnerId()), t.getAlbumId() != AudioPlaylist.ALBUM_ALL && (i.album = 1), t.getOwnerId() > 0 && t.getOwnerId() != vk.id && (i.user_list =
                        1)), t.getType() == AudioPlaylist.TYPE_ALBUM && nav.objLoc.friend) {
                var a = intval(nav.objLoc.friend);
                0 > a ? i.club = a : i.friend = a
            }
            "search" != cur.module || "audio" != nav.objLoc["c[section]"] || nav.objLoc["c[q]"] || (i.top = 1), (("groups" == cur.module || "public" == cur.module) && cur.oid == e
                    .ownerId && cur.oid < 0 || cur.audioPage && cur.audioPage.options.oid == e.ownerId && cur.audioPage.options.oid < 0) && (i.group = 1), (("audio" == cur.module ||
                    "feed" == cur.module) && nav.objLoc.q || "search" == cur.module && nav.objLoc["c[q]"] || t.getType() == AudioPlaylist.TYPE_SEARCH) && (i.search = 1), i.search ||
                "feed" != cur.module || (i.feed = 1), t.setPlaybackParams(i)
        }
    }, AudioPlayer.prototype.playLive = function(t, e) {
        var i = this.getPlaylist(AudioPlaylist.TYPE_LIVE, vk.id, data[0]);
        i.mergeWith({
            live: t,
            hasMore: !1
        });
        var t = i.getLiveInfo(),
            o = this;
        ajax.post("al_audio.php", {
            act: "a_play_audio_status",
            audio_id: t.audioId,
            host_id: t.hostId,
            hash: t.hash
        }, extend(e, {
            onDone: function(t, e) {
                i.mergeWith({
                    title: e.title,
                    list: [t]
                }), o.play(t, i)
            }
        }))
    }, AudioPlayer.prototype.startListenLive = function(t) {
        t = t.split(","), ajax.post("al_audio.php", {
            act: "a_play_audio_status",
            host_id: t[0],
            audio_id: t[1],
            hash: t[2]
        })
    }, AudioPlayer.prototype.getNextLiveAudio = function(t, e) {
        if (t.live) {
            var i = t.live.split(",");
            ajax.post("al_audio.php", {
                act: "a_get_audio_status",
                host_id: i[0]
            }, {
                onDone: function(i) {
                    i ? (t.addAudio(i), e(i)) : (delete t.live, t.title = "", e())
                }
            })
        }
    }, AudioPlayer.prototype._sendStatusExport = function() {
        var t = this.getCurrentAudio();
        if (t) {
            t = AudioUtils.asObject(t);
            var e = this.statusSent ? this.statusSent.split(",") : [!1, 0],
                i = vkNow() - intval(e[1]);
            if (this.hasStatusExport() && (t.id != e[0] || i > 3e5)) {
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
            var e = AudioUtils.asObject(this.getCurrentAudio()),
                i = extend({
                    act: "playback",
                    full_id: e.fullId,
                    impl: this._impl.type
                }, t.getPlaybackParams());
            e.ownerId == vk.id && e.id && (i.id = e.id), cur.audioLoadTimings && (i.timings = cur.audioLoadTimings.join(","), cur.audioLoadTimings = []), i.overall_progress = Math
                .round(this._testGetCurrentDelay()), ajax.post("al_audio.php", i, {
                    onDone: function(t) {
                        t && t.need_play_test && (this._testSetCurrentDelay(0), this._testNeedPlayTest = t.need_play_test, this._testTexts = t, this._testCurSection = t.section,
                            this._testTexts.test_prepare_text && debugLog(this._testTexts.test_prepare_text))
                    }.bind(this)
                })
        }
    }, AudioPlayer.prototype.saveStateCurrentPlaylist = function() {
        if (!vk.widget) {
            var t = this.getCurrentPlaylist();
            if (t) {
                var e = t.serialize();
                this._lsSet(AudioPlayer.LS_PL, e)
            } else this._lsSet(AudioPlayer.LS_PL, null);
            this._lsSet(AudioPlayer.LS_SAVED, vkNow())
        }
    }, AudioPlayer.prototype._saveStateCurrentAudio = function() {
        if (!vk.widget) {
            var t = this.getCurrentAudio();
            if (t) {
                var e = clone(t);
                e[AudioUtils.AUDIO_ITEM_INDEX_URL] = "", this._lsSet(AudioPlayer.LS_TRACK, e), setCookie("remixcurr_audio", t[AudioUtils.AUDIO_ITEM_INDEX_OWNER_ID] + "_" + t[
                    AudioUtils.AUDIO_ITEM_INDEX_ID], 1)
            } else this._lsSet(AudioPlayer.LS_TRACK, null), setCookie("remixcurr_audio", null, 1)
        }
    }, AudioPlayer.prototype.seekCurrentAudio = function(t) {
        var e = AudioUtils.asObject(this.getCurrentAudio()),
            i = 10 / e.duration,
            o = this.getCurrentProgress() + (t ? i : -i);
        o = Math.max(0, Math.min(1, o)), this.seek(o)
    }, AudioPlayer.prototype._lsGet = function(t) {
        return ls.get(AudioPlayer.LS_PREFIX + t)
    }, AudioPlayer.prototype._lsSet = function(t, e) {
        ls.set(AudioPlayer.LS_PREFIX + t, e)
    }, AudioPlayer.prototype.setVolume = function(t) {
        t = Math.min(1, Math.max(0, t)), this._userVolume = t, this._implSetVolume(t), this.notify(AudioPlayer.EVENT_VOLUME, t)
    }, AudioPlayer.prototype.getVolume = function() {
        return void 0 === this._userVolume ? .8 : this._userVolume
    }, AudioPlayer.prototype.seek = function(t) {
        this._implSeekImmediate(t)
    }, AudioPlayer.prototype._ensureHasURL = function(t, e) {
        var i = [];
        this._currentUrlEnsure = this._currentUrlEnsure || {};
        var o = AudioUtils.asObject(t);
        if (o.url) return e && e(t);
        var a = this.getCurrentPlaylist(),
            s = a.indexOfAudio(t);
        if (s >= 0)
            for (var l = s; s + 5 > l; l++) {
                var r = AudioUtils.asObject(a.getAudioAt(l));
                !r || r.url || this._currentUrlEnsure[r.fullId] || (i.push(r.fullId), this._currentUrlEnsure[r.fullId] = !0)
            }
        if (i.push(o.fullId), i.length) {
            var u = this;
            ajax.post("al_audio.php", {
                act: "reload_audio",
                ids: i.join(",")
            }, {
                onDone: function(i, a) {
                    getAudioPlayer()
                        .setStatusExportInfo(a), each(i, function(e, i) {
                            i = AudioUtils.asObject(i);
                            var a = {};
                            a[AudioUtils.AUDIO_ITEM_INDEX_URL] = i.url, u.updateAudio(i.fullId, a), o.fullId == i.fullId && (t[AudioUtils.AUDIO_ITEM_INDEX_URL] = i
                                    .url), u.currentAudio && AudtioUtils.asObject(u.currentAudio)
                                .fullId == i.fullId && (u.currentAudio[AudioUtils.AUDIO_ITEM_INDEX_URL] = i.url), delete u._currentUrlEnsure[i.fullId]
                        }), e && e(t)
                }
            })
        }
    }, AudioPlayer.prototype.toggleAudio = function(t, e) {
        var i = domClosest("_audio_row", t),
            o = cur.cancelClick || e && (hasClass(e.target, "audio_lyrics") || domClosest("_audio_duration_wrap", e.target) || domClosest("_audio_inline_player", e.target) ||
                domClosest("audio_performer", e.target));
        if (cur._sliderMouseUpNowEl && cur._sliderMouseUpNowEl == geByClass1("audio_inline_player_progress", i) && (o = !0), delete cur.cancelClick, delete cur._sliderMouseUpNowEl,
            o) return !0;
        var a = AudioUtils.getAudioFromEl(i, !0);
        if (AudioUtils.isClaimedAudio(a)) {
            var s = AudioUtils.getAudioExtra(a),
                l = s.claim;
            if (l) return void showAudioClaimWarning(a.ownerId, a.id, l.id, a.title, l.reason)
        }
        var r = hasClass(i, AudioUtils.AUDIO_PLAYING_CLS);
        if (r) this.pause();
        else {
            var u = AudioUtils.getContextPlaylist(i);
            this.play(a.fullId, u)
        }
    }, AudioPlayer.prototype._onFailedUrl = function(t) {
        this.notify(AudioPlayer.EVENT_FAILED), this.isPlaying() && (this.pause(), this.playNext(!0))
    }, AudioPlayer.prototype.switchToPrevPlaylist = function() {
        this._prevPlaylist && (this.pause(), setTimeout(function() {
            this._currentPlaylist = this._prevPlaylist, this._currentAudio = this._prevAudio, this._prevPlaylist = this._prevAudio = null, this.notify(AudioPlayer.EVENT_PLAYLIST_CHANGED,
                this._currentPlaylist), this.notify(AudioPlayer.EVENT_UPDATE), this.updateCurrentPlaying()
        }.bind(this), 1))
    }, AudioPlayer.prototype.play = function(t, e, i, o) {
        if (!cur.loggingOff) {
            if (!this._impl) return void AudioUtils.showNeedFlashBox();
            this._testIsNeedPlayTest() && this._testPlayTest(), (isObject(t) || isArray(t)) && (t = AudioUtils.asObject(t), t && (t = t.fullId));
            var a = AudioUtils.asObject(this._currentAudio),
                s = this.getCurrentPlaylist();
            !t && a && (t = a.fullId);
            var l = !1,
                r = !1;
            r = t && a && t == a.fullId, e ? s && (l = e == s.getSelf() || e == s) : (e = s, l = !0);
            if (r && l) {
                if (!this.isPlaying()) {
                    this._isPlaying = !0, this._sendLCNotification(), this.notify(AudioPlayer.EVENT_PLAY);
                    var u = e.getAudio(t);
                    this._implClearAllTasks(), this._implSetVolume(0), this._implSetUrl(u), this._implPlay(), this._implSetVolume(this.getVolume(), !0)
                }
            } else if (t) {
                var u = e.getAudio(t);
                u && (l || (this._currentPlaylist && (this._prevPlaylist = this._currentPlaylist, this._prevAudio = this._currentAudio), this._currentPlaylist = new AudioPlaylist(
                        e)), this._listenedTime = this._prevProgress = 0, this._currentAudio = u, this._isPlaying = !0, this._sendLCNotification(), this.notify(AudioPlayer.EVENT_PLAY, !
                        0, intval(i), o), this._muteProgressEvents = !0, this._implClearAllTasks(), o ? (this._implSetUrl(u), this._implPlay(), this._implSetVolume(this.getVolume())) :
                    (this._implSetVolume(0, !0), this._implSetDelay(200), this._implSetUrl(u), this._implPlay(), this._implSetVolume(this.getVolume())), l || (this._initPlaybackParams(),
                        this.notify(AudioPlayer.EVENT_PLAYLIST_CHANGED, e)))
            }
        }
    }, AudioPlayer.prototype._prefetchAudio = function(t) {
        "html5" == this._impl.type && (t = AudioUtils.asObject(t), t && t.url && this._impl.prefetch(t.url))
    }, AudioPlayer.prototype.getCurrentPlaylist = function() {
        return this._currentPlaylist
    }, AudioPlayer.prototype.getPlaylists = function() {
        return clone(this._playlists)
    }, AudioPlayer.prototype.pause = function() {
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
    }, AudioPlayer.prototype._playNext = function(t, e) {
        var i = this.getCurrentAudio(),
            o = this.getCurrentPlaylist(),
            a = this;
        if (i && o)
            if (t > 0) {
                var s = o.getNextAudio(i);
                s ? this.play(s, o, 1, e) : o.isLive() ? (this._muteProgressEvents = !0, o.fetchNextLiveAudio(function(t) {
                    a.play(t, o, 1, e)
                })) : (s = o.getAudioAt(0), this.play(s, o, 1, e))
            } else {
                var l = o.indexOfAudio(this._currentAudio) - 1;
                0 > l ? this.seek(0) : this.play(o.getAudioAt(l), o, -1, e)
            }
    }, AudioPlayerFlash.onAudioFinishCallback = function() {
        var t = window._flashAudioInstance;
        t.opts.onEnd && t.opts.onEnd()
    }, AudioPlayerFlash.onAudioProgressCallback = function(t, e) {
        var i = window._flashAudioInstance;
        e && (i._total = e, i._currProgress = t / e, i.opts.onProgressUpdate && i.opts.onProgressUpdate(i._currProgress))
    }, AudioPlayerFlash.onAudioLoadProgressCallback = function(t, e) {
        var i = window._flashAudioInstance;
        i._currBuffered = t / e, i.opts.onBufferUpdate && i.opts.onBufferUpdate(i._currBuffered)
    }, AudioPlayerFlash.prototype.fadeVolume = function(t, e) {
        return this.setVolume(t), e()
    }, AudioPlayerFlash.prototype.type = "flash", AudioPlayerFlash.PLAYER_EL_ID = "flash_audio", AudioPlayerFlash.prototype.destroy = function() {
        re(AudioPlayerFlash.PLAYER_EL_ID)
    }, AudioPlayerFlash.prototype.onReady = function(t) {
        if (this._player) return t(!0);
        if (this._player === !1) return t(!1);
        this._onReady = t;
        var e = {
                url: "/swf/audio_lite.swf",
                id: "player",
                height: 2
            },
            i = {
                swliveconnect: "true",
                allowscriptaccess: "always",
                wmode: "opaque"
            },
            o = {
                onPlayFinish: "AudioPlayerFlash.onAudioFinishCallback",
                onLoadProgress: "AudioPlayerFlash.onAudioLoadProgressCallback",
                onPlayProgress: "AudioPlayerFlash.onAudioProgressCallback"
            };
        ge(AudioPlayerFlash.PLAYER_EL_ID) || document.body.appendChild(ce("div", {
            id: AudioPlayerFlash.PLAYER_EL_ID,
            className: "fixed"
        }));
        var a = this;
        renderFlash(AudioPlayerFlash.PLAYER_EL_ID, e, i, o) && setTimeout(function() {
            a._checkFlashLoaded()
        }, 50)
    }, AudioPlayerFlash.prototype.setUrl = function(t, e) {
        return this._url == t ? void(e && e(!0)) : (this._url = t, this._player && this._player.loadAudio(t), void(e && e(!0)))
    }, AudioPlayerFlash.prototype.setVolume = function(t) {
        this._player && this._player.setVolume && this._player.setVolume(t)
    }, AudioPlayerFlash.prototype.play = function() {
        this._player && this._player.playAudio()
    }, AudioPlayerFlash.prototype.seek = function(t) {
        var e = (this._total || 0) * t;
        this._player && this._player.playAudio(e)
    }, AudioPlayerFlash.prototype.pause = function() {
        this._player && this._player.pauseAudio()
    }, AudioPlayerFlash.prototype.isFullyLoaded = function() {
        return !1
    }, AudioPlayerFlash.prototype.getPlayedTime = function() {
        return 0
    }, AudioPlayerFlash.prototype.getCurrentProgress = function() {
        return this._currProgress || 0
    }, AudioPlayerFlash.prototype.getCurrentBuffered = function() {
        return this._currBuffered || 0
    }, AudioPlayerFlash.prototype.stop = function() {
        this._player && this._player.stopAudio()
    }, AudioPlayerFlash.prototype._checkFlashLoaded = function() {
        var t = ge("player");
        if (this._checks = this._checks || 0, this._checks++, AudioUtils.debugLog("Flash element check", this._checks), this._checks > 10) {
            AudioUtils.debugLog("No Flash element found after some amount of checks"), this._player = !1;
            var e = this._onReady;
            return e && e(!1)
        }
        if (t && t.paused) {
            AudioUtils.debugLog("Flash element found"), this._player = t;
            var e = this._onReady;
            e && e(!0), this._onReady = null
        } else {
            var i = this;
            setTimeout(function() {
                i._checkFlashLoaded()
            }, 100)
        }
    }, AudioPlayerHTML5.AUDIO_EL_ID = "ap_audio", AudioPlayerHTML5.STATE_HAVE_NOTHING = 0, AudioPlayerHTML5.STATE_HAVE_FUTURE_DATA = 3, AudioPlayerHTML5.HAVE_ENOUGH_DATA = 4,
    AudioPlayerHTML5.SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=", AudioPlayerHTML5.isSupported = function() {
        var t = "undefined" != typeof navigator ? navigator.userAgent : "";
        if (/(Windows NT 5.1|Windows XP)/.test(t) && (browser.vivaldi || browser.opera || browser.mozilla)) return AudioUtils.debugLog(
            "Force no HTML5 (xp vivaldi / opera / mozilla)"), !1;
        if (/(Windows 7|Windows NT 6.1)/.test(t) && (browser.vivaldi || browser.opera)) return AudioUtils.debugLog("Force no HTML5 (win7 vivaldi / opera)"), !1;
        var e = document.createElement("audio");
        if (e.canPlayType) {
            var i = e.canPlayType('audio/mpeg; codecs="mp3"'),
                o = !!i.replace(/no/, "");
            return AudioUtils.debugLog("HTML5 browser support " + (o ? "yes" : "no"), i, t), o
        }
        return AudioUtils.debugLog("audio.canPlayType is not available", t), !1
    }, AudioPlayerHTML5.prototype.type = "html5", AudioPlayerHTML5.prototype.destroy = function() {}, AudioPlayerHTML5.prototype.getPlayedTime = function() {
        for (var t = this._currentAudioEl.played, e = 0, i = 0; i < t.length; i++) e += t.end(i) - t.start(i);
        return e
    }, AudioPlayerHTML5.prototype._setAudioNodeUrl = function(t, e) {
        data(t, "setUrlTime", e == AudioPlayerHTML5.SILENCE ? 0 : vkNow()), t.src = e
    }, AudioPlayerHTML5.prototype._createAudioNode = function(t) {
        var e = new Audio,
            i = this;
        return this.opts.onBufferUpdate && addEvent(e, "progress", function() {
            i._currentAudioEl == e && i.opts.onBufferUpdate(i.getCurrentBuffered());
            var t = e.buffered;
            t.length;
            1 == t.length && 0 == t.start(0) && t.end(0) == e.duration && (e._fullyLoaded = !0)
        }), this.opts.onProgressUpdate && addEvent(e, "timeupdate", function() {
            i._currentAudioEl == e && i.opts.onProgressUpdate(i.getCurrentProgress())
        }), this.opts.onEnd && addEvent(e, "ended", function() {
            i._currentAudioEl == e && i.opts.onEnd()
        }), this.opts.onSeeked && addEvent(e, "seeked", function() {
            i._currentAudioEl == e && i.opts.onSeeked()
        }), this.opts.onSeek && addEvent(e, "seeking", function() {
            i._currentAudioEl == e && i.opts.onSeek()
        }), addEvent(e, "error", function() {
            AudioUtils.debugLog("HTML5 error track loding"), i._prefetchAudioEl == e ? i._prefetchAudioEl = i._createAudioNode() : i._currentAudioEl == e && i.opts.onFail &&
                i.opts.onFail()
        }), addEvent(e, "canplay", function() {
            var t = data(e, "setUrlTime");
            t && (cur.audioLoadTimings = cur.audioLoadTimings || [], cur.audioLoadTimings.push(vkNow() - t), data(e, "setUrlTime", 0)), i._prefetchAudioEl == e, i._currentAudioEl ==
                e && (i.opts.onCanPlay && i.opts.onCanPlay(), i._seekOnReady && (i.seek(i._seekOnReady), i._seekOnReady = !1))
        }), t && (this._setAudioNodeUrl(e, t), e.preload = "auto", e.volume = this._volume || 1, e.load()), this._audioNodes.push(e), e
    }, AudioPlayerHTML5.prototype.onReady = function(t) {
        t(!0)
    }, AudioPlayerHTML5.prototype.prefetch = function(t) {
        this._prefetchAudioEl && this._setAudioNodeUrl(this._prefetchAudioEl, AudioPlayerHTML5.SILENCE), this._prefetchAudioEl = this._createAudioNode(t)
    }, AudioPlayerHTML5.prototype.seek = function(t) {
        var e = this._currentAudioEl;
        isNaN(e.duration) ? this._seekOnReady = t : e.currentTime = e.duration * t
    }, AudioPlayerHTML5.prototype.setVolume = function(t) {
        void 0 === t && (t = this._currentAudioEl.volume), this._currentAudioEl.volume = t, this._prefetchAudioEl && (this._prefetchAudioEl.volume = t), this._volume = t
    }, AudioPlayerHTML5.prototype.getCurrentProgress = function() {
        var t = this._currentAudioEl;
        return isNaN(t.duration) ? 0 : Math.max(0, Math.min(1, t.currentTime / t.duration))
    }, AudioPlayerHTML5.prototype.getCurrentBuffered = function() {
        var t = this._currentAudioEl;
        return t && t.buffered.length ? Math.min(1, t.buffered.end(0) / t.duration) : 0
    }, AudioPlayerHTML5.prototype.isFullyLoaded = function() {
        return this._currentAudioEl._fullyLoaded
    }, AudioPlayerHTML5.prototype.setUrl = function(t, e) {
        var i = this._currentAudioEl;
        if (this._seekOnReady = !1, i.src == t) return this.opts.onCanPlay && this.opts.onCanPlay(), e && e(!0);
        if (this._prefetchAudioEl && this._prefetchAudioEl.readyState > AudioPlayerHTML5.STATE_HAVE_NOTHING)
            if (this._prefetchAudioEl.src == t) {
                this._currentAudioEl.pause(0),
                    this._setAudioNodeUrl(this._currentAudioEl, AudioPlayerHTML5.SILENCE);
                var o = this;
                this._prefetchAudioEl.readyState >= AudioPlayerHTML5.STATE_HAVE_FUTURE_DATA && setTimeout(function() {
                    o.opts.onCanPlay && o.opts.onCanPlay()
                }), i = this._currentAudioEl = this._prefetchAudioEl, this._prefetchAudioEl = !1
            } else this._prefetchAudioEl.src && this._setAudioNodeUrl(this._prefetchAudioEl, AudioPlayerHTML5.SILENCE);
        return i.src != t && (this._setAudioNodeUrl(i, t), i.load()), e && e(!0)
    }, AudioPlayerHTML5.prototype.play = function(t) {
        this._prefetchAudioEl.src == t && this._prefetchAudioEl.readyState > AudioPlayerHTML5.STATE_HAVE_NOTHING && (this._setAudioNodeUrl(this._currentAudioEl, AudioPlayerHTML5.SILENCE),
            this._currentAudioEl = this._prefetchAudioEl, this._prefetchAudioEl = this._createAudioNode(), this.opts.onCanPlay && this.opts.onCanPlay());
        var e = this._currentAudioEl;
        if (e.src) {
            var i = e.play();
            void 0 !== i && i["catch"](function(t) {
                t.code != t.ABORT_ERR ? setWorkerTimeout(function() {
                    triggerEvent(e, "error", !1, !0)
                }, 10) : debugLog("HTML5 audio play error: " + t)
            })
        }
    }, AudioPlayerHTML5.prototype.pause = function() {
        var t = this._currentAudioEl;
        if (t.src) {
            var e = t.pause();
            void 0 != e && e["catch"](function() {})
        }
    }, AudioPlayerHTML5.prototype.stop = function() {
        var t = this._currentAudioEl;
        this._setAudioNodeUrl(t, AudioPlayerHTML5.SILENCE)
    }, AudioPlayerHTML5.prototype._setFadeVolumeInterval = function(t) {
        if (t) {
            if (!this._fadeVolumeWorker && window.Worker && window.Blob) {
                var e = new Blob([
                    "         var interval;         onmessage = function(e) {           clearInterval(interval);           if (e.data == 'start') {             interval = setInterval(function() { postMessage({}); }, 20);           }         }       "
                ]);
                try {
                    this._fadeVolumeWorker = new Worker(window.URL.createObjectURL(e))
                } catch (i) {
                    this._fadeVolumeWorker = !1
                }
            }
            this._fadeVolumeWorker ? (this._fadeVolumeWorker.onmessage = t, this._fadeVolumeWorker.postMessage("start")) : this._fadeVolumeInterval = setInterval(t, 60)
        } else this._fadeVolumeWorker && (this._fadeVolumeWorker.terminate(), this._fadeVolumeWorker = null), this._fadeVolumeInterval && clearInterval(this._fadeVolumeInterval)
    }, AudioPlayerHTML5.prototype.fadeVolume = function(t, e) {
        t = Math.max(0, Math.min(1, t));
        var i = this._currentAudioEl,
            o = 0;
        if (o = t < i.volume ? -.04 : .001, Math.abs(t - i.volume) <= .001) return this._setFadeVolumeInterval(), e && e();
        var a = i.volume;
        this._setFadeVolumeInterval(function() {
            o > 0 && (o *= 1.2), a += o;
            var i = !1;
            return (i = 0 > o ? t >= a : a >= t) ? (this.setVolume(t), this._setFadeVolumeInterval(), e && e()) : void this.setVolume(a)
        }.bind(this))
    };
try {
    stManager.done("audioplayer.js")
} catch (e) {}
