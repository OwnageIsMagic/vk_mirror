var Videoview = {
        isFS: !1,
        playerCallback: {
            resize: function(e, i) {},
            debugLog: function() {
                var e = Array.prototype.slice.call(arguments);
                e.unshift("video player:"), debugLog.apply(null, e)
            },
            fullscreen: function(e) {
                Videoview.isFS = e, Videoview.updateExternalVideoFinishBlock()
            },
            incViewCounter: function(e, i, o, t, a, r, d) {
                r || (r = "flash");
                var n = Videoview.getVideoModule(e + "_" + i),
                    v = {
                        act: "inc_view_counter",
                        oid: e,
                        vid: i,
                        hash: o,
                        curr_res: t,
                        max_res: a,
                        player: r,
                        type: d,
                        module: n
                    };
                if (cur.videoSearchStats) {
                    var s = parseInt(cur.videoSearchPos);
                    isNaN(s) || (v.search_pos = s, cur.videoSearchStats.positions[s] = extend({
                        viewStarted: 0
                    }, cur.videoSearchStats.positions[s]), cur.videoSearchStats.positions[s].viewStarted++), cur.videoSearchStats.totalViews++
                }
                ajax.post("al_video.php", v, {
                    onDone: function(e) {}
                })
            },
            rotateVideo: function(e, i, o, t) {
                ajax.post("al_video.php", {
                    act: "rotate_video",
                    oid: e,
                    vid: i,
                    angle: o,
                    hash: t
                })
            },
            scoreCardCounter: function() {},
            onVideoNext: function(e, i, o) {
                setTimeout(function() {
                    var t = 0;
                    i || e ? i && o ? t = 5 : i && !o ? t = 6 : e && (t = 7) : t = 4, Videoview.sendPlayerStats(t, 0), e && !i ? VideoPlaylist.showVideo(e) :
                        VideoPlaylist.nextVideo()
                }, 0)
            },
            setSuggestions: function(e) {
                ajax.post("/al_video.php", {
                    act: "fetch_player_suggestions",
                    videos: e
                }, {
                    onDone: function(e) {
                        e && window.mvcur && mvcur.mvData && (mvcur.mvData.playerSuggestions = e)
                    }
                })
            },
            onSuggestionsShown: function(e) {
                if (Videoview.sendPlayerStats(e ? 14 : 12, 0), e) {
                    var i = "";
                    each(mvcur.mvData.playerSuggestions, function(e, o) {
                            i += "&vid=" + o.vid
                        }), vkImage()
                        .src = "//go.imgsmail.ru/vk?pxn=vs&qid=" + e + i
                }
            },
            onSuggestionClick: function(e, i, o, t) {
                Videoview.sendPlayerStats(i ? 13 : 11, 0), showVideo(e, "", {
                    autoplay: 1,
                    module: Videoview.getVideoModule(e),
                    addParams: {
                        suggestions_qid: i
                    }
                }), i && (vkImage()
                    .src = "//go.imgsmail.ru/vk?pxn=vic&qid=" + i + "&vid=" + e + "&p=" + o + "&t=" + t)
            },
            onSuggestionQuarterWatched: function(e, i, o) {
                vkImage()
                    .src = "//go.imgsmail.ru/vk?pxn=vt25&qid=" + e + "&vid=" + i + "&t=" + o
            },
            onOpenInPopup: function(e, i, o) {
                Videoview.sendPlayerStats(8, 0), showVideo(e, i, {
                    autoplay: 1,
                    queue: 1,
                    addParams: {
                        t: o
                    }
                })
            },
            onVideoAdEvent: function(e, i, o, t, a, r, d) {
                if (o) {
                    cur._vadStatQueue = cur._vadStatQueue || {}, cur._vadStatQueue[e + "_" + i] = cur._vadStatQueue[e + "_" + i] || {
                        type: "",
                        events: []
                    };
                    var n = cur._vadStatQueue[e + "_" + i];
                    n.type = a, n.events.push(t), n.err = r, n.pl_type = d, clearTimeout(cur._vadStatTimer), cur._vadStatTimer = setTimeout(Videoview.sendVideoAdStat.bind(
                        Videoview, e, i, o), 1e3)
                }
            },
            onVideoAdShown: function(e, i, o, t) {
                ajax.post("al_video.php", {
                    act: "ad_event",
                    oid: e,
                    vid: i,
                    type: o,
                    event: t
                })
            },
            onVideoResolutionChanged: function(e, i, o, t) {
                window.mvcur && mvcur.mvData && (mvcur.mvData.resolution = t)
            },
            onInitialized: function() {
                window.mvcur && mvcur.mvShown ? (VideoPlaylist.toggle(!VideoPlaylist.isCollapsed()), mvcur.options.focusPlay && ("visible" == document.visibilityState ?
                    Videoview.togglePlay(!0) : "hidden" == document.visibilityState && addEvent(window, "focus", function i() {
                        Videoview.togglePlay(!0), removeEvent(window, "focus", i)
                    }))) : cur.pinnedVideoInitHandlers && cur.pinnedVideoInitHandlers();
                var e = ge("video_player");
                e && e.focus()
            },
            onVideoPlayProgress: function(e, i, o, t, a) {
                var r = e + "_" + i;
                5e3 > t && cur.tnsStart != r ? (this.playerCallback.scoreCardCounter(), cur.tnsStart = r) : t > a / 2 && cur.tnsEnd != r && (cur.tnsEnd = r), mvcur.adData && (
                    mvcur.adData.stat_link_start && !mvcur.adData.view_complete_start && t >= 5e3 && (ajax.post(mvcur.adData.stat_link_start, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_start = !0), mvcur.adData.stat_link_half && !mvcur.adData.view_complete_half && t >= a / 2 && (ajax.post(mvcur.adData.stat_link_half, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_half = !0), mvcur.adData.stat_link_full && !mvcur.adData.view_complete_full && t >= .9 * a && (ajax.post(mvcur.adData.stat_link_full, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_full = !0))
            },
            onVideoStreamPlaying: function(e, i, o) {
                if (e + "_" + i == cur.pinnedVideo) {
                    var t = ge("video_player") || window.html5video;
                    if (!(t && t.isTouchedByUser && t.isTouchedByUser())) return;
                    cur.pinnedVideoDestroyHandlers()
                }
                var a = window.Notifier,
                    r = window.ap;
                a && setTimeout(function() {
                    a.lcSend("video_start")
                }, 0), r && r.isPlaying() && (r.pause(), r.pausedByVideo = 1), window.mvcur && mvcur.mvData && !i && !e && (mvcur.mvData.randomNumber = Math.round(1e9 *
                    Math.random()))
            },
            onVideoPlayStarted: function(e, i, o) {
                var t = Videoview.getVideoModule(e + "_" + i),
                    a = "";
                if (window.Video && Video.isInCatalog()) {
                    var r = VideoPlaylist.getCurListId();
                    a = Videocat.isTop3Playlist(r) ? "featured" : r
                }
                var d;
                d = cur.mvOpts && cur.mvOpts.inline || window.mvcur && mvcur.mvData && mvcur.mvData.inline ? "inline" : window.mvcur && window.mvcur.options && window.mvcur.options
                    .playlistId ? "layer_with_playlist" : "layer";
                var n = ajax.post("al_video.php", {
                    act: "video_view_started",
                    oid: e,
                    vid: i,
                    hash: o,
                    quality: window.mvcur ? mvcur.mvData.resolution : 0,
                    module: t,
                    videocat: a,
                    inline: -1,
                    player_view_type: d
                }, {
                    onDone: function(e) {}
                });
                if (void 0 !== n) {
                    window.mvcur && (vkImage()
                        .src = locProtocol + "//www.tns-counter.ru/V13a****pladform_ru/ru/CP1251/tmsec=pladform_videovk-playerstart/" + this.playerCallback.randomNumber());
                    var v = 0;
                    switch (cur.mvOpts ? v = cur.mvOpts.l_type : window.mvcur && (v = mvcur.mvData.l_type), v) {
                        case 1:
                            vkImage()
                                .src = locProtocol +
                                "//vk.com/rtrg?r=JQ6ueUeOxlSLb8IoA8ToayylOLgRkThaoFV0XVgG5qvS1x1xWrkfqAg73sYWJxwq9PXWucKtMS02J3CsGLZdmOMNj9dv9UCjDN4a3ShJZXcJFMhgfVwSoPWoxp*Y/LAFUnKz5*XBvDCQXeaygAqI*gY9gz*jWTXaOXyT2lSfIPY-";
                            break;
                        case 2:
                            vkImage()
                                .src = locProtocol +
                                "//vk.com/rtrg?r=lD4OYmfC8ehvdc/8TL9AsAjM956qNaHyj20XV5mCNiTgYKQ6X*IXgwE8VbgqOf7rdbLJq7uCRBrdnFPTcUU2NjMgy8x4y6NWrYVwQMteNWh62XnLoNVZqobnsMMGm1OyTW09rhEkmiX5jqk3CI3JIIYbIbd8K7EC0ytQ4Kp4Kro-"
                    }
                }
            },
            onVideoPlayFinished: function() {
                cur.pinnedVideoDestroy && cur.pinnedVideoDestroy(), window.mvcur && mvcur.mvShown && (mvcur.finished = !0, mvcur.mousemoved = !0, Videoview.moveCheck(), mvcur.adData ?
                    (mvcur.adData.stat_link_start && !mvcur.adData.view_complete_start && (ajax.post(mvcur.adData.stat_link_start, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_start = !0), mvcur.adData.stat_link_half && !mvcur.adData.view_complete_half && (ajax.post(mvcur.adData.stat_link_half, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_half = !0), mvcur.adData.stat_link_full && !mvcur.adData.view_complete_full && (ajax.post(mvcur.adData.stat_link_full, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_full = !0)) : vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****pladform_ru/ru/CP1251/tmsec=pladform_videovk-playerend/" + this.playerCallback.randomNumber())
            },
            randomNumber: function() {
                return mvcur.mvData.randomNumber = mvcur.mvData.randomNumber || Math.round(1e9 * Math.random()), mvcur.mvData.randomNumber
            },
            onVideoAdsLoadStarted: function(e, i, o) {
                vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****vk_com/ru/CP1251/tmsec=vk_videoload-license/" + this.playerCallback.randomNumber()
            },
            onVideoAdsPlayStarted: function(e, i, o) {
                vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****vk_com/ru/CP1251/tmsec=vk_videostart-license/" + this.playerCallback.randomNumber()
            },
            onVideoAdsPlayFinished: function(e, i, o) {
                vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****vk_com/ru/CP1251/tmsec=vk_videoend-license/" + this.playerCallback.randomNumber()
            },
            onViewSegmentsChanged: function(e, i, o, t) {
                if (o && !cur.segmentsSaveProcess) {
                    var a = "vsegs" + vk.id + "_" + e + "_" + i,
                        r = ls.get(a);
                    r && r.ts && (new Date)
                        .getTime() - r.ts > 864e5 && (r = null, ls.remove(a));
                    var d = r && r.segments ? r.segments.split("|")[2] : "";
                    if (!r || !d || o != d) {
                        cur.segmentsSaveProcess = !0;
                        var n = {
                                act: "a_view_segments",
                                module: Videoview.getVideoModule(e + "_" + i),
                                vid: i,
                                oid: e,
                                s: o,
                                prev_s: r ? r.segments : "",
                                prev_sig: r ? r.segmentsSig : "",
                                hash: t
                            },
                            v = parseInt(cur.videoSearchPos);
                        isNaN(v) || (n.search_pos = v), ajax.post("/al_video.php", n, {
                            onDone: function(e, i, o) {
                                if (!(0 > e)) {
                                    e && ls.set(a, {
                                        segments: e,
                                        segmentsSig: i,
                                        ts: (new Date)
                                            .getTime()
                                    }), cur.segmentsSaveProcess = !1, o = parseInt(o) || 0;
                                    var t = parseInt(cur.videoSearchPos);
                                    o > 0 && !isNaN(t) && cur.videoSearchStats && (cur.videoSearchStats.positions[t] = extend({
                                        viewedParts: 0
                                    }, cur.videoSearchStats.positions[t]), cur.videoSearchStats.positions[t].viewedParts++)
                                }
                            }
                        }), cur.videoSearchStats && (cur.videoSearchStats.totalViewedTime || (cur.videoSearchStats.totalViewedTime = 0), cur.videoSearchStats.totalViewedTime +=
                            mvcur.mvData.vsegsSize, isNaN(v) || (cur.videoSearchStats.positions[v] = extend({
                                viewedSeconds: 0
                            }, cur.videoSearchStats.positions[v]), cur.videoSearchStats.positions[v].viewedSeconds += mvcur.mvData.vsegsSize))
                    }
                }
            },
            onLike: function(e) {
                Videoview.like(null, !0), Videoview.sendPlayerStats(1, e)
            },
            onAdd: function(e, i, o) {
                Videoview.addSmall(e, i), Videoview.sendPlayerStats(3, o)
            },
            onRemove: function() {
                Videoview.removeVideo()
            },
            onShare: function(e) {
                Videoview.share(), Videoview.sendPlayerStats(2, e)
            },
            onSubscribe: function(e, i, o, t) {
                var a = mvcur && mvcur.mvData ? mvcur.mvData.isClosed : !1;
                Videoview.subscribeToAuthor(null, null, e, i, o, a, !0, "player"), Videoview.sendPlayerStats(o ? 9 : 10, t)
            }
        },
        cleanUpStoredVSegs: function() {
            if (window.localStorage) {
                var e = vkNow();
                for (var i in window.localStorage)
                    if (0 === i.indexOf("vsegs")) {
                        var o = localStorage.getItem(i);
                        o = JSON.parse(o), e - o.ts > 1728e5 && localStorage.removeItem(i)
                    }
            }
        },
        getVideoModule: function(e) {
            var i = cur.currentModule ? cur.currentModule() : cur.module;
            return window.Video && Video.isInVideosList() && (i = cur.oid < 0 ? "community_videos" : cur.oid == vk.id ? "profile_own_videos" : "profile_videos"), "feed" == i &&
                "feed_block" == VideoPlaylist.getCurListId() && (i = "feed_block"), "feed" == i && "videos" == cur.section && (i = "feed_videos"), i
        },
        showPlaylist: function() {
            VideoPlaylist.toggle(!0)
        },
        sendPlayerStats: function(e, i) {
            ajax.post("/al_video.php", {
                act: "a_player_stat",
                action: e,
                type: i
            })
        },
        removeVideo: function() {
            var e = Videoview.getMvData();
            e && e.deleteFromAllAlbumsHash && (ajax.post("/al_video.php", {
                act: "a_delete_from_all_albums",
                vid: e.vid,
                oid: e.oid,
                target_id: vk.id,
                hash: e.deleteFromAllAlbumsHash
            }, {}), e.playlists && each(e.playlists, function(e, i) {
                i.added = !1
            }), window.mvcur && Videoview.initAddButton(), e.added = !1, removeClass(geByClass1("mv_finish_add", "mv_external_finish"), "selected"))
        },
        getNextVideosData: function() {
            return VideoPlaylist.getNextVideos()
                .slice(0, 3)
        },
        getSuggestionsData: function() {
            var e = Videoview.getMvData();
            return e && e.playerSuggestions
        },
        getMvData: function() {
            return cur.mvOpts || window.mvcur && mvcur.mvData
        },
        getPlayerObject: function() {
            return ge("video_yt") && window.VideoYoutube || ge("video_player") || window.html5video || null
        },
        getPlayerObjectEl: function() {
            return ge("video_player") || ge("html5_player") || geByClass1("extra_player") || null
        },
        playerOnAdded: function() {
            var e = Videoview.getPlayerObject();
            try {
                e && e.onAdded && e.onAdded()
            } catch (i) {}
        },
        playerOnLiked: function() {
            var e = Videoview.getPlayerObject();
            e && e.onLiked && e.onLiked()
        },
        playerNextTimerUpdate: function() {
            var e;
            mvcur.scrolledAway || mvcur.commentingInProgress || isVisible(window.boxLayerWrap) ? (e = "nextTimerReset", mvcur.nextTimerStopped = !0) : (e = "nextTimerStart",
                mvcur.nextTimerStopped = !1);
            var i = mvcur.playerPrevTimerFunc == e ? 100 : 0;
            mvcur.playerPrevTimerFunc = e, clearTimeout(mvcur.playerTimerDebounce), mvcur.playerTimerDebounce = setTimeout(function() {
                var i = Videoview.getPlayerObject();
                i && i[e] && i[e](), mvcur.nextTimer && mvcur.nextTimer[e] && mvcur.nextTimer[e]()
            }, i)
        },
        togglePlay: function(e) {
            if (ge("video_yt") && window.VideoYoutube) VideoYoutube.togglePlay(e);
            else if (window.mvcur && mvcur.player) mvcur.player.togglePlay(e);
            else {
                var i = ge("video_player") || window.html5video;
                i == window.html5video ? i.playVideo(e, !0) : i && i.playVideo && i && i.playVideo(e)
            }
        },
        sendVideoAdStat: function(e, i, o) {
            if (cur._vadStatQueue && cur._vadStatQueue[e + "_" + i]) {
                var t = cur._vadStatQueue[e + "_" + i],
                    a = "undefined" != typeof cur.vSearchPos && null !== cur.vSearchPos;
                t.events.length && (ajax.post("al_video.php", {
                    act: "ads_stat",
                    ev: t.events.join(","),
                    ad_type: t.type,
                    hash: o,
                    oid: e,
                    vid: i,
                    err: t.err,
                    pl_type: t.pl_type,
                    from_search: a
                }), t.events = [])
            }
        },
        subscribeToAuthor: function(e, i, o, t, a, r, d, n) {
            function v() {
                toggleClass(ge("mv_subscribe_btn_wrap"), "mv_state_subscribed", a), toggleClass(ge("mv_subscribed_msg"), "mv_state_subscribed", a), ajax.post("al_video.php", {
                    act: "a_subscribe",
                    gid: o,
                    hash: t,
                    unsubscribe: intval(!a),
                    from: n
                });
                var e = Videoview.getMvData();
                if (e.subscribed = a, !d) {
                    var i = Videoview.getPlayerObject();
                    i && i.onSubscribed && i.onSubscribed()
                }
                var r = ge("mv_finish_subscribe_btn");
                r && (r.innerHTML = a ? getLang("video_view_subscribed_msg") : getLang("video_view_subscribe_to_author"), toggleClass("mv_finish_subscribe",
                    "mv_finish_subscribed", a))
            }
            if (t)
                if (!a && r) {
                    var s = showFastBox({
                        title: getLang("video_leave_closed_group_title"),
                        bodyStyle: "padding: 20px; line-height: 160%;",
                        dark: 1,
                        forceNoBtn: 1
                    }, getLang("video_leave_closed_group_text"), getLang("box_yes"), function() {
                        s.hide(), v()
                    }, getLang("box_no"));
                    Videoview.playerNextTimerUpdate()
                } else v()
        },
        addPlaylist: function(onlyPrivate) {
            showBox("/al_video.php", {
                act: "add_playlist_box",
                oid: mvcur.mvData.oid,
                vid: mvcur.mvData.vid,
                only_private: onlyPrivate ? 1 : 0
            }, {
                params: {
                    dark: 1
                },
                onDone: function(box) {
                    box.removeButtons(), box.addButton(getLang("Save"), function(btn) {
                        var title = trim(val("mv_video_playlist_edit_title")),
                            privacy = Privacy.getValue("video_playlist");
                        title && ajax.post("/al_video.php", {
                            act: "a_save_playlist",
                            title: title,
                            privacy: privacy,
                            hash: val("video_playlist_edit_hash"),
                            oid: mvcur.mvData.oid,
                            vid: mvcur.mvData.vid
                        }, {
                            showProgress: lockButton.pbind(btn),
                            hideProgress: unlockButton.pbind(btn),
                            onDone: function(playlistId, text, playlist, video) {
                                curBox()
                                    .hide(), text && showDoneBox(text), mvcur.mvData.playlists.push({
                                        id: playlistId,
                                        added: !0,
                                        title: clean(title),
                                        "private": intval(privacy)
                                    }), Videoview.initAddButton(), window.Video && playlist && (playlist = eval("(" + playlist + ")"), Video.updateAlbum(
                                        playlistId, !1, playlist), video && (video = eval("(" + video + ")"), Video.updateVideo(vk.id,
                                        video, [], !1, [playlistId])))
                            }
                        })
                    })
                }
            }), Videoview.playerNextTimerUpdate()
        },
        updateVideo: function(e, i, o, t) {
            window.mvcur && mvcur.mvData.oid == e && mvcur.mvData.vid == i && (mvcur.mvData.title = o, mvcur.mvData.desc = t, Videoview.setTitle(), Videoview.setDesc())
        },
        setAddButtonStateAdded: function() {
            window.mvcur && mvcur.mvShown && (mvcur.mvData.published = !0, triggerEvent("mv_add_button", "setAdded"))
        },
        initAddButton: function() {
            function e(e) {
                mvcur.addButtonTT = mvcur.addButtonTT || new ElementTooltip(n, {
                    elClassWhenTooltip: "mv_no_active",
                    onFirstTimeShow: function(i) {
                        var o = '<div id="mv_pl_tt">' + (d ? '<div class="mv_tt_private_only">' + getLang("video_only_private_video") + "</div>" : "") +
                            '<div class="mv_tt_playlists' + (d ? " with_border" : "") + '">';
                        each(mvcur.mvData.playlists, function(i, t) {
                                var a = t.added || e && t.id == mvcur.mvData.PLAYLIST_ADDED_ID,
                                    r = t["private"] ? '<span class="mv_tt_playlist_private_icon" onmouseover="showTooltip(this,{black:1,text: \'' + getLang(
                                        "video_album_is_private_tt") + "', shift:[16, 8, 0]})\"></span>" : "";
                                o += '<div class="mv_tt_playlist">  <div class="checkbox' + (a ? " on" : "") + (t.disabled ? " disabled" : "") + '" data-id="' +
                                    t.id + '" onclick="checkbox(this);">' + clean(t.title) + "</div>" + r + "</div>          "
                            }), o += "</div>", o += '<div class="mv_tt_add_playlist" onclick="Videoview.addPlaylist(' + d +
                            ')"><span class="mv_tt_plus_icon"></span>' + (d ? getLang("video_add_private_album") : getLang("video_add_album")) + "</div></div>", i.innerHTML =
                            o, each(geByClass("mv_tt_playlist", i), function() {
                                var i = domFC(this);
                                addEvent(i, "click", a), e && attr(i, "data-id") == mvcur.mvData.PLAYLIST_ADDED_ID && triggerEvent(i, "click")
                            })
                    }
                })
            }

            function i(i, t, a) {
                i = r ? !0 : i;
                var d = geByClass1("mv_added_icon", n),
                    s = geByClass1("mv_plus_icon", n),
                    l = geByClass1("mv_add_text", n);
                toggleClass(s, "mv_add_icon_curr", !i), toggleClass(s, "mv_add_icon_down", i), toggleClass(d, "mv_add_icon_curr", i), removeEvent(n, "click", o), removeEvent(n,
                        "setAdded", o), i ? (l.innerHTML = getLang("video_added_to_my_playlist"), e(t)) : (l.innerHTML = getLang("video_add_to_my_playlist"), mvcur.addButtonTT &&
                        mvcur.addButtonTT.destroy(), mvcur.addButtonTT = null, addEvent(n, "click", o), addEvent(n, "setAdded", o)), a || v == i || Videoview.playerOnAdded(),
                    v = i;
                var c = Videoview.getMvData();
                c.added = i
            }

            function o(e) {
                mvcur.mvData.published ? (i(!0, !0, "setAdded" == e.type), mvcur.addButtonTT.show()) : Videoview.showAddDialog(mvcur.mvData.oid + "_" + mvcur.mvData.vid)
            }

            function t() {
                var e = !1;
                return each(mvcur.mvData.playlists, function(i, o) {
                    return o.added ? (e = !0, !1) : void 0
                }), e
            }

            function a(e) {
                var o = e.currentTarget || e.target;
                if (!hasClass(o, "disabled")) {
                    var a = isChecked(o),
                        r = +o.getAttribute("data-id");
                    each(mvcur.mvData.playlists, function(e, i) {
                        return i.id == r ? (i.added = a, !1) : void 0
                    }), ajax.post("/al_video.php", {
                        act: "a_add_to_playlist",
                        oid: mvcur.mvData.oid,
                        vid: mvcur.mvData.vid,
                        hash: mvcur.mvData.playlistAddHash,
                        playlist_id: r,
                        add: +a,
                        info: window.Video && Video.isInCatalog() ? VideoPlaylist.getCurListId() : ""
                    }, {
                        onDone: function(e) {
                            var i = [],
                                o = [];
                            if (a) {
                                i.push(r);
                                var t = e.indexOf(r);
                                e.splice(t, 1)
                            } else o.push(r), e.push(r);
                            mvcur.mvData.info && window.Video && !Video.isInCatalog() && Video.updateVideo(vk.id, mvcur.mvData.info, e, !1, i, o)
                        }
                    }), i(t()), cancelEvent(e)
                }
            }
            mvcur.addButtonTT && (mvcur.addButtonTT.destroy(), mvcur.addButtonTT = null);
            var r = mvcur.mvData.uploaded,
                d = mvcur.mvData.noPublicAdd,
                n = ge("mv_add_button"),
                v = !1;
            n && (d ? e(!1) : i(r || t(), !1, !0))
        },
        locNav: function(e, i, o) {
            o = nav.toStr(o);
            var t = o.match(/^video(-?\d+_\d+)$/);
            return t ? void 0 : void Videoview.hide()
        },
        showPlayer: function(e) {
            var i = ge("video_player");
            i && (e || !i.getAttribute("preventhide") || browser.safari_mobile) && (browser.msie && setStyle(i, {
                position: "static",
                top: 0
            }), browser.safari_mobile ? show(i) : i.style.visibility = "visible")
        },
        hidePlayer: function(e) {
            var i = ge("video_player");
            i && (e || !i.getAttribute("preventhide") || browser.safari_mobile) && (browser.msie && setStyle(i, {
                position: "absolute",
                top: "-5000px"
            }), browser.safari_mobile ? hide(i) : i.style.visibility = "hidden")
        },
        init: function() {
            window.mvcur = {}, window.mvLayer || (window.mvLayer = ce("div", {
                    id: "mv_layer"
                }), addEvent(mvLayer, "mousemove", function() {
                    mvcur.mousemoved = !0, mvcur.blackout && Videoview.moveCheck()
                }), window.mvLayerWrap = ce("div", {
                    id: "mv_layer_wrap",
                    className: "scroll_fix_wrap fixed layer_wrap"
                }), mvLayerWrap.appendChild(window.mvLayer), bodyNode.appendChild(mvLayerWrap), window.mvLayer.style.width = lastWindowWidth - sbWidth() - 2 + "px",
                addEvent(mvLayerWrap, "scroll", videoview.viewScroll))
        },
        moveCheck: function() {
            mvcur.mousemoved ? mvcur.blackout && (mvcur.blackout = !1, isVisible(layerBG) ? animate(layerBG, {
                opacity: .8
            }, 200) : setStyle(layerBG, {
                opacity: .8
            })) : mvcur.blackout || mvcur.finished || !isVisible(layerBG) || (mvcur.blackout = !0, animate(layerBG, {
                opacity: .9
            }, 5e3)), mvcur.mousemoved = !1
        },
        show: function(e, i, o, t) {
            var a = window.ap;
            if (a && a.isPlaying() && (a.pause(), a.pausedByVideo = 1), window.forcePauseAudio = !0, t && t.autoplay && Videoview.playerCallback.onVideoStreamPlaying(),
                debugLog("show video " + i), window.mvcur && mvcur.minimized) {
                if (!t.nomin) return t.playlistId ? Videoview.initPlaylistBlock(i, t.playlistId, t.catLoadMore) : VideoPlaylist.removeBlock(), !0;
                t.prevLoc && (mvcur.mvPrevLoc = t.prevLoc), debugLog("unminimizing in show"), Videoview.unminimize(!0, !1, !0)
            }
            t.queue && (debugLog("pushing in videoview.show"), layerQueue.push(), t.queue = !1), !t.noLocChange && nav.objLoc.z && 0 == nav.objLoc.z.indexOf("video") && (cur.mvHistoryBack =
                cur.mvHistoryBack || 1, cur.mvHistoryBack++);
            var r = window.mvcur && mvcur.mvShown && !mvcur.minimized;
            r || layerQueue.hide(), window.forcePauseAudio = !1;
            var d = window.mvcur && mvcur.player;
            return d && d.unloadVideo(), d && domFC(ge("video_player")) === d.el || (val("mv_content", ""), show("mv_progress")), this.init(), mvcur.showTime = (new Date)
                .getTime(), removeEvent(window, "resize", Videoview.onResize), removeEvent(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange),
                removeEvent(document, "keydown", Videoview.onKeyDown), removeEvent(mvLayerWrap, "click", Videoview.onClick), addEvent(window, "resize", Videoview.onResize),
                addEvent(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), addEvent(document, "keydown", Videoview.onKeyDown),
                addEvent(mvLayerWrap, "click", Videoview.onClick), boxQueue.hideAll(), layers.wrapshow(mvLayerWrap, .8), layers.fullhide = Videoview.hide, setTimeout(function() {
                    layers.wrapshow(mvLayerWrap, .8), layers.fullhide = Videoview.hide
                }, 0), mvcur.noLocChange = 0, t.ad_video && (t.hideInfo = 1, t.noLocChange = 1, mvcur.noLocChange = 1, mvcur.videoAds = 1), mvcur.noHistory = t.noLocChange ||
                t.noHistory, mvcur.blackInterval = setInterval(Videoview.moveCheck, 18e4), mvcur.videoRaw = i, mvcur.options = t, mvcur.listId = o, mvcur.mvData = !1, mvcur.mvShown = !
                0, mvcur.player = d, t.prevLoc ? mvcur.mvPrevLoc = t.prevLoc : setTimeout(function() {
                    var e = document.URL;
                    Videoview.setLocation(t.noLocChange), e == document.URL && (e = ""), setTimeout(window.comScoreUDM && comScoreUDM.pbind(locProtocol + "//" + location.host +
                        "/al_video.php?comscorekw=pageview_candidate", e), 10)
                }, 0), e && e.pageX && e.pageY && extend(mvcur, {
                    mvOldX: e.pageX,
                    mvOldY: e.pageY,
                    mvOldT: vkNow()
                }), r ? Videoview.cleanLayerContent() : Videoview.buildLayerContent(), t.minimized && setTimeout(Videoview.minimize.bind(Videoview), 0), t.playlistId ?
                Videoview.initPlaylistBlock(i, t.playlistId, t.catLoadMore) : VideoPlaylist.removeBlock(), Videoview.cleanUpStoredVSegs(), !1
        },
        buildLayerContent: function() {
            var e = "mv_dark";
            addClass(window.mvLayerWrap, e), addClass(window.layerBG, e);
            var i = mvcur.options.hideInfo ? "display: none" : "";
            mvLayer.innerHTML =
                '<div id="mv_container">  <div id="mv_box" onclick="mvcur.mvClicked = true;">    <div id="mv_approve" style="display: none;"></div>    <div id="mv_publish" style="display: none;"></div>    <div id="mv_min_layer">      <div class="mv_min_header">        <div class="mv_mini_control fl_r" onmousedown="return Videoview.hide(false, true);">          <div class="mv_close_control"></div>        </div>        <div class="mv_mini_control fl_r" onclick="return Videoview.unminimize();">          <div class="mv_max_control"></div>        </div>        <div class="mv_min_title" id="mv_min_title"></div>      </div>    </div>    <div class="no_select mv_data">      <div class="mv_pl_prev_wrap">        <div class="mv_playlist_controls" id="mv_pl_prev" onclick="return VideoPlaylist.prevVideo()">          <div class="mv_playlist_controls_icon"></div>        </div>      </div>      <div class="mv_pl_next_wrap">        <div class="mv_playlist_controls" id="mv_pl_next" onclick="return VideoPlaylist.nextVideo()">          <div class="mv_playlist_controls_icon"></div>        </div>      </div>      <div class="mv_top_controls_wrap">        <div id="mv_top_controls">          <div onclick="return Videoview.hide(false, true, event, true);" class="mv_top_button"><div class="mv_small_close_icon"></div></div>          <div onclick="return Videoview.minimize(event);" class="mv_top_button mv_top_minimize"><div class="mv_minimize_icon"></div></div>          <div onclick="return VideoPlaylist.toggle();" class="mv_top_button mv_top_pl_toggle" id="mv_top_pl_toggle"><div class="mv_pl_toggle_icon"></div></div>        </div>      </div>      <div id="mv_progress">' +
                getProgressHtml() +
                '</div>      <div id="mv_content"></div>    </div>    <div id="mv_service_btns_wrap">      <div id="mv_service_btns"></div>    </div>    <div class="mv_controls clear_fix" id="mv_controls" style="' +
                i + '"></div>    <div id="mv_warning" style="display: none;"></div>  </div></div>  ', browser.mobile && setStyle("mv_container", {
                    paddingTop: intval(window.pageYOffset) + 10 + "px"
                }), Videoview.updateSize()
        },
        cleanLayerContent: function() {
            val("mv_controls", ""), toggle("mv_controls", !mvcur.options.hideInfo)
        },
        initPlaylistBlock: function(e, i, o) {
            if (/^wall_/.test(i) && VideoPlaylist.lists[i] && cur.wallVideos && cur.wallVideos[i]) {
                VideoPlaylist.extendList(i, cur.wallVideos[i].list);
                var t = !0
            }
            var a = !!VideoPlaylist.getBlock(),
                r = VideoPlaylist.buildBlock(i, e, t);
            if (toggleClass("mv_container", "mv_container_has_pl", !!r && !mvcur.minimized), r) {
                domByClass(mvLayer, "mv_data")
                    .appendChild(r), VideoPlaylist.restoreScrollPos(), VideoPlaylist.updateScrollbar(), VideoPlaylist.setCurVideo(e, a), VideoPlaylist.updateControls();
                var d = VideoPlaylist.getCurList()
                    .list.length;
                (window.Video && Video.isInVideosList() && vk.id == cur.oid || 5 > d) && (a || VideoPlaylist.toggle(!1))
            }
            VideoPlaylist.toggleStateClasses(), isFunction(o) && o(VideoPlaylist.updateBlockList.pbind(i))
        },
        hide: function(e, i, o, t) {
            if (window.mvcur && (i || mvcur.mvShown)) {
                if (t) {
                    var a = cur.videoBackOnClick;
                    if (cur.videoBackOnClick = !1, a) return history.back()
                }
                if (cur.videoSearchPos && delete cur.videoSearchPos, cur.videoSearchStats && (cur.videoSearchStats.lastActionTime = (new Date)
                        .getTime()), !i && mvcur.minimized) return void(mvcur.noLocChange || e === !0 || (2 === e ? nav.setLoc(hab.getLoc()) : layerQueue.count() || Videoview.backLocation()));
                if (!mvcur.noHistory && !e && !t) {
                    mvcur.noHistory = 1, mvcur.forceHistoryHide = i, __adsUpdate("very_lazy");
                    var r = cur.mvHistoryBack ? -cur.mvHistoryBack : -1;
                    return cur.mvHistoryBack = 0, setTimeout(function() {
                        mvcur.mvShown || (Videoview.destroyPlayer(), VideoPlaylist.removeBlock())
                    }, 10), history.go(r)
                }
                if (mvcur.forceHistoryHide && (i = mvcur.forceHistoryHide, mvcur.forceHistoryHide = !1), mvcur.statusVideo) {
                    var d = ge("mv_like_icon");
                    if (d) {
                        var n = d.parentNode.tt;
                        n && n.container && re(n.container), d.parentNode.tt && delete d.parentNode.tt
                    }
                }
                var v = mvcur.minimized;
                if (v && (Videoview.unminimize(!0, !0, !0), mvcur.minimized = !1, e = !0), Wall.cancelEdit(!0), mvcur.mvData.duration > 60 && !i && !mvcur.finished) {
                    var s = (new Date)
                        .getTime() - mvcur.showTime,
                        l = getLang("video_are_you_sure_close");
                    if (s > 3e4 && "are you sure close" != l && !browser.safari_mobile) {
                        var c = showFastBox({
                                title: getLang("video_are_you_sure_close_title"),
                                bodyStyle: "padding: 20px; line-height: 160%;",
                                dark: 1,
                                forceNoBtn: 1
                            }, l, getLang("box_yes"), function() {
                                c.hide(), Videoview.hide(e, !0)
                            }, getLang("box_no")),
                            m = function(i) {
                                13 == i.keyCode && (c.hide(), Videoview.hide(e, !0))
                            };
                        return addEvent(document, "keydown", m), c.onHide = function() {
                            removeEvent(document, "keydown", m)
                        }, !0
                    }
                }
                if (!window.forcePauseAudio) {
                    var u = window.ap,
                        _ = window.Notifier;
                    u && !u.isPlaying() && u.pausedByVideo && (u.play(), delete u.pausedByVideo), _ && _.lcSend("video_hide")
                }
                v ? hide(mvLayerWrap) : (layers.wraphide(mvLayerWrap), layers.fullhide = !1), window.tooltips && tooltips.destroyAll(cur.mvBox);
                var p = "mv_dark";
                removeClass(mvLayerWrap, p), removeClass(layerBG, p), mvcur.mvShown = mvcur.mvClicked = !1, removeEvent(window, "resize", Videoview.onResize), removeEvent(
                        document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), removeEvent(document, "keydown", Videoview.onKeyDown),
                    removeEvent(mvLayerWrap, "click", Videoview.onClick), Videoview.destroyPlayer(), val("mv_content", ""), mvcur.changeCanvasSize = !1;
                VideoPlaylist.getBlock();
                return v && isVisible(layerWrap) || (debugLog("pop from videoview.hide"), setTimeout(layerQueue.pop, 0)), mvcur.blackInterval && clearInterval(mvcur.blackInterval),
                    t && nav.objLoc.z ? (layerQueue.skipVideo = !0, delete nav.objLoc.z, nav.setLoc(nav.objLoc)) : mvcur.noLocChange || e === !0 || (2 === e ? nav.setLoc(hab.getLoc()) :
                        Videoview.backLocation(), __adsUpdate("very_lazy")), __adsUpdate(), mvcur.bodyScrollTop = scrollNode.scrollTop, setTimeout(function() {
                        void 0 !== mvcur.bodyScrollTop && (scrollNode.scrollTop = mvcur.bodyScrollTop, delete mvcur.bodyScrollTop)
                    }, 0), vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****pladform_ru/ru/CP1251/tmsec=pladform_videovk-playerend/" + Videoview.playerCallback.randomNumber(), !1
            }
        },
        destroyPlayer: function() {
            mvcur.player && (mvcur.player.destroy(), delete mvcur.player), ge("html5_player") && window.html5video && html5video.destroy(), ge("video_yt") && window.VideoYoutube &&
                VideoYoutube.destroy()
        },
        cmp: function(e, i) {
            var o = e.length,
                t = i.length;
            return t > o ? -1 : o > t ? 1 : i > e ? -1 : e > i ? 1 : 0
        },
        onClick: function(e) {
            if (mvcur.mvClicked || e && cur.__mdEvent && e.target != cur.__mdEvent.target) return void(mvcur.mvClicked = !1);
            var i = Math.abs(e.pageX - intval(mvcur.mvOldX)),
                o = Math.abs(e.pageY - intval(mvcur.mvOldY));
            (i > 3 || o > 3) && vkNow() - intval(mvcur.mvOldT) > 300 && Videoview.hide()
        },
        onKeyDown: function(e) {
            return e.returnValue === !1 ? !1 : e.keyCode == KEY.ESC ? Videoview.isFS ? (ge("video_player")
                .toggleFullscreen(), !1) : (mvcur.mvEditing ? videoview.cancelInline() : Videoview.hide(), cancelEvent(e)) : void 0
        },
        onResize: function() {
            var e = lastWindowWidth,
                i = lastWindowHeight,
                o = sbWidth(),
                t = e - o - 2 - 120 - 34 - 50,
                a = i - 31 - 28 - 72;
            t > 1280 ? t = 1280 : t > 807 && 907 > t ? t = 807 : 604 > t && (t = 604), 453 > a && (a = 453), mvcur.mvWidth = t, mvcur.mvHeight = a;
            var r = !1,
                d = mvcur.mvVeryBig;
            mvcur.mvVeryBig = t > 1280 ? 2 : t > 807 ? 1 : !1, r = d != mvcur.mvVeryBig, Videoview.updateExternalVideoFinishBlock(), Videoview.updateReplyFormPos()
        },
        onFullscreenChange: function() {
            Videoview.updateExternalVideoFinishBlock()
        },
        updateSize: function() {
            if (mvcur.minimized) return !1;
            var e = document.documentElement,
                i = window.innerHeight || e.clientHeight || bodyNode.clientHeight,
                o = 2;
            isVisible("mv_controls") || (o = 1.2), setStyle("mv_container", {
                top: Math.max((i - 800) / o, 50) + "px"
            }), onBodyResize(), Videoview.onResize()
        },
        getPrevLoc: function() {
            mvcur.mvPrevLoc = {};
            for (var e in nav.objLoc) "z" == e && nav.objLoc[e].match(new RegExp("^video" + mvcur.videoRaw, "")) || (mvcur.mvPrevLoc[e] = nav.objLoc[e])
        },
        setLocation: function(e) {
            if (mvcur.options.fromPreload) {
                var i = mvcur.listId.match(new RegExp("([a-z]*)([0-9-]*)")),
                    o = mvcur.listId.match(new RegExp("claim=([0-9]+)")),
                    t = parseInt(i[2]);
                mvcur.mvPrevLoc = {
                    0: "videos" + t
                }, "videos" != i[1] && (mvcur.mvPrevLoc.section = i[1]), o && o[1] && (mvcur.mvPrevLoc.claim = o[1])
            } else e ? mvcur.mvPrevLoc = "z" : Videoview.getPrevLoc();
            if (!e) {
                var a, a, r = mvcur.videoRaw.match(/^(-?\d+)(photo|video)?_/),
                    d = (intval(r[1]), "video" + mvcur.videoRaw);
                mvcur.listId && (d += "/" + mvcur.listId), mvcur.options.playlistId && (d += "/pl_" + mvcur.options.playlistId), a = extend(nav.objLoc, {
                    z: d
                }), nav.strLoc != nav.toStr(a) && (nav.setLoc(a), (mvcur.options || {})
                    .fromQueue && (mvcur.noHistory = 1)), mvcur.options && (mvcur.options.fromQueue = !1)
            }
        },
        backLocation: function() {
            if ("z" == mvcur.mvPrevLoc || !mvcur.mvPrevLoc && nav.objLoc.z) {
                var e = clone(nav.objLoc);
                delete e.z, nav.setLoc(e)
            } else mvcur.mvPrevLoc ? nav.setLoc(mvcur.mvPrevLoc) : ("video" == nav.objLoc[0] || nav.objLoc[0].match(/^video-?\d+_\d+/)) && nav.setLoc({
                0: "video"
            });
            mvcur.options.prevTitle && (window.document.title = replaceEntities(stripHTML(mvcur.options.prevTitle)), delete mvcur.options.prevTitle), mvcur.noHistory = 1
        },
        highlightComment: function(e) {
            if (e = ge(e)) {
                var i = animate.pbind(e, {
                        backgroundColor: "#ECEFF3"
                    }, 200, function() {
                        setTimeout(function() {
                            animate(e, {
                                backgroundColor: "#FFF"
                            }, 200)
                        }, 1e3)
                    }),
                    o = getXY(e, !0)[1];
                0 > o || o > lastWindowHeight - 200 ? animate(mvLayerWrap, {
                    scrollTop: mvLayerWrap.scrollTop + o - 50
                }, 300, i) : i()
            }
        },
        showComment: function(e) {
            var i = ge("post" + e);
            return i ? Videoview.highlightComment(i) : Videoview.moreComments(e), !1
        },
        commActionDone: function(commId, from, text, del, script) {
            var node = ge("post" + commId.split("_")
                .join("video_") + from);
            if (node) {
                var comment = domByClass(node, "reply_wrap"),
                    msg = domByClass(node, "dld");
                if (!text) return re(msg), show(comment), "mv" == from ? (++mvcur.mvData.commcount, ++mvcur.mvData.commshown) : (++cur.commentsCount, ++cur.commentsShown),
                    void Videoview.updateComms(from);
                hide(comment), node.appendChild(se(text)), del ? ("mv" == from ? (--mvcur.mvData.commcount, --mvcur.mvData.commshown) : (--cur.commentsCount, --cur.commentsShown),
                    Videoview.updateComms(from)) : "mv" == from && Videoview.recache(), script && eval(script)
            }
        },
        commAction: function(e, i, o, t) {
            var a = ge("post" + i + "video_" + o + "mv"),
                r = domByClass(a, "post_actions"),
                d = ge("reply_" + e + i + "video_" + o + "mv"),
                n = "mv";
            attr(a, "data-action", e), d && tooltips.hide(d), ajax.post("al_video.php", {
                act: e + "_comment",
                comment: i + "_" + o,
                hash: t,
                videoview: 1,
                from: n
            }, {
                onDone: Videoview.commActionDone.pbind(i + "_" + o, n),
                showProgress: addClass.pbind(r, "post_actions_progress"),
                hideProgress: removeClass.pbind(r, "post_actions_progress"),
                stat: ["privacy.js", "privacy.css"]
            })
        },
        moreComments: function(e) {
            if (isVisible("mv_comments_header") && !hasClass(domFC(ge("mv_comments_header")), "pr") && !(e && Videoview.cmp(domFC(ge("mv_comments"))
                    .id, "post" + e) < 0)) {
                var i = mvcur.mvData;
                ge("mv_comments_link");
                ajax.post("al_video.php", {
                    act: "video_comments",
                    offset: i.commshown,
                    video: i.videoRaw
                }, {
                    onDone: function(i, o) {
                        Videoview.receiveComms(i, o, !0, e), e && ge("post" + e) && Videoview.showComment(e)
                    },
                    showProgress: function() {
                        var e = ge("mv_comments_header");
                        mvcur.mvCommInfo = e.innerHTML, e.innerHTML = "", showProgress(e)
                    },
                    hideProgress: function() {
                        ge("mv_comments_header")
                            .innerHTML = mvcur.mvCommInfo
                    }
                })
            }
        },
        updateComms: function(e) {
            if ("review" == e) return void Video.changeSummary();
            var i = mvcur.mvData,
                o = "";
            i.commcount > i.commshown && (o = getLang("video_show_previous_comments", i.commcount - i.commshown)), i.commcount && val("mv_comments_summary", getLang(
                    "video_comments_summary", i.commcount)), setStyle("mv_comments_summary", {
                    display: i.commcount ? null : "none"
                }), toggleClass("mv_comments_header", "mv_comments_expanded", !o), toggleClass("mv_comments_summary", "mv_comments_expanded", !o), val("mv_comments_header", o),
                Videoview.recache()
        },
        showEditReply: function(e) {
            mvcur.commentingInProgress = !0,
                Videoview.playerNextTimerUpdate()
        },
        hideEditReply: function(e) {
            mvcur.commentingInProgress = !1;
            var i = mvcur.post;
            rf = ge("reply_field" + i), composer = rf && data(rf, "composer"), composer ? Composer.reset(composer) : val(rf, ""), Wall.hideEditReply(i), mvcur.mvReplyTo = !1,
                Videoview.updateReplyFormPos(), setTimeout(Videoview.updateReplyFormPos, 10)
        },
        commentClick: function(e, i, o, t) {
            Wall.checkReplyClick(e, i) || (mvcur.mvReplyTo = [o, t], Wall.replyTo(mvcur.post, t, o))
        },
        receiveComms: function(e, i, o, t) {
            for (var a, r, d = ce("div", {
                    innerHTML: e
                }), n = ge("mv_comments"), v = a = domLC(n), s = getXY(a, !0)[1], l = mvcur.mvData; r = domLC(d);) {
                for (; a && Videoview.cmp(a.id, r.id) > 0;) a = domPS(a);
                a && !Videoview.cmp(a.id, r.id) ? (n.replaceChild(r, a), a = r) : (a && domNS(a) ? n.insertBefore(r, domNS(a)) : !a && domFC(n) ? o ? n.insertBefore(r, domFC(n)) :
                    (--l.commshown, d.removeChild(r)) : n.appendChild(r), o || ++l.commcount, ++l.commshown)
            }
            t && v && (mvLayerWrap.scrollTop += getXY(v, !0)[1] - s), extend(mvcur.mvReplyNames, i), window.updateWndVScroll && updateWndVScroll(), Videoview.updateComms(),
                Videoview.updateReplyFormPos()
        },
        commSaved: function(e) {},
        sendComment: function(e, i, o) {
            var t = ge("reply_field" + e),
                a = t && data(t, "composer"),
                r = (mvcur.mvReplyNames[(mvcur.mvReplyTo || {})[0]] || [])[1],
                d = ge("reply_button" + e);
            if (o) var n = {
                message: "",
                attach1_type: "sticker",
                attach1: o
            };
            else {
                var n = a ? Composer.getSendParams(a, Videoview.sendComment) : {
                    message: trim(val(t))
                };
                if (n.delayed) return;
                if (!n.attach1_type && (!n.message || r && !r.indexOf(n.message))) return void elfocus(t)
            }
            ajax.post("al_video.php", Wall.fixPostParams(extend(n, {
                act: "post_comment",
                video: mvcur.mvData.videoRaw,
                hash: mvcur.mvData.hash,
                fromview: 1,
                videoviewer: 1,
                from_group: isChecked(ge("reply_as_group" + mvcur.post)),
                reply_to: (mvcur.mvReplyTo || {})[1]
            })), {
                onDone: function(i, o) {
                    Videoview.receiveComms(i, o), val("mv_comments_summary", getLang("video_comments_summary", mvcur.mvData.commcount)), Composer.reset(a), hide(
                        "reply_warn" + e), Wall.cancelReplyTo(e), mvLayerWrap.scrollTop = 9e9
                },
                onFail: function(e) {
                    return t ? (showTooltip(t, {
                        text: e,
                        showdt: 200,
                        forcetodown: 0,
                        slide: 15
                    }), elfocus(t), !0) : void 0
                },
                showProgress: lockButton.pbind(d),
                hideProgress: unlockButton.pbind(d)
            })
        },
        activate: function(e, i, o) {
            2 == i ? animate(e, {
                color: "#FFFFFF"
            }, "undefined" != typeof o ? 0 : 200) : animate(e, {
                opacity: 1
            }, 200)
        },
        deactivate: function(e, i) {
            2 == i ? animate(e, {
                color: "#777777"
            }, "undefined" != typeof fast ? 0 : 200) : animate(e, {
                opacity: .5
            }, 200)
        },
        addVideo: function(videoRaw, hash, obj, gid, accessHash, from) {
            if (window.mvcur && mvcur.statusVideo) var params = {
                    act: "external_add",
                    status: videoRaw,
                    hash: hash,
                    from: from || "videoviewer"
                },
                url = "al_video_external.php";
            else {
                var params = {
                    act: "a_add",
                    video: videoRaw,
                    hash: hash,
                    from: from || "videoviewer",
                    module: cur.module || "",
                    info: window.Video && Video.isInCatalog() ? VideoPlaylist.getCurListId() : ""
                };
                gid && (params.gid = gid);
                var url = "al_video.php"
            }
            return accessHash && (params.access_hash = accessHash), ajax.post(url, params, {
                onDone: function(text, row, hash, shareHash) {
                    obj && (obj.parentNode.innerHTML = text);
                    try {
                        isArray(row) || (row = eval("(" + row + ")"))
                    } catch (e) {}
                    window.mvcur && (mvcur.mvData && mvcur.mvData.afterAdd ? mvcur.mvData.afterAdd(row[0] + "_" + row[1], shareHash) : row && (mvcur.mvData.addedVideo =
                        row[0] + "_" + row[1], mvcur.mvData.addedVideoHash = hash, mvcur.mvData.addedVideoShareHash = shareHash));
                    var videoEl = ge("video_cont" + videoRaw);
                    videoEl && addClass(videoEl, "video_row_added"), "list" == from && showDoneBox(text), window.Video && !Video.isInCatalog() && Video.updateVideo(
                        cur.oid, row, [], !1, [-2]), Videoview.setAddButtonStateAdded()
                }
            }), !1
        },
        likeUpdate: function(e, i, o, t) {
            i = intval(i);
            var a = Videoview.getMvData(),
                r = window.mvcur && mvcur.statusVideo ? "wall" : "video",
                d = (ge("like_table_" + r + a.videoRaw), ge("like_title_" + r + a.videoRaw)),
                n = ge("like_real_count_" + r + a.videoRaw) || {},
                v = ge("mv_like_wrap");
            if (icon = domByClass(v, "_icon"), countNode = domByClass(v, "_count"), a.likes = i, a.liked = e, countNode) {
                var s = v.tt || {},
                    l = clone(s.opts || {}),
                    n = domByClass(s.container, "_value"),
                    c = domByClass(s.container, "_content"),
                    d = domByClass(s.container, "_title");
                o && d && val(d, o), n && (n.value = i), animateCount(countNode, i), toggleClass(v, "my_like", e), toggleClass(v, "no_likes", !i), toggleClass(c, "me_hidden", !
                    e), i ? t || !s.el || isVisible(s.container) || o || tooltips.show(s.el, extend(l, {
                    showdt: 0
                })) : s.el && s.hide()
            }
        },
        _isCurrentVideoPublished: function() {
            return cur.mvOpts ? cur._videoPublished : window.mvcur && mvcur.mvData && mvcur.mvData.published
        },
        addSmall: function(e, i, o, t) {
            if (Videoview._isCurrentVideoPublished()) {
                window.mvcur && mvcur.mvShown ? Videoview.setAddButtonStateAdded() : Videoview.addVideo(e, i, !1, o, t), hide("video_add_action_link"), addClass(ge(
                    "mv_like_line"), "video_added"), addClass(geByClass1("mv_finish_add", "mv_external_finish"), "selected");
                var a = Videoview.getMvData();
                a.added = !0
            } else Videoview.showAddDialog(e)
        },
        showAddDialog: function(e) {
            if (cur._recentAddedVideos = cur._recentAddedVideos || {}, !cur._recentAddedVideos[e]) {
                var i = e.split("_");
                showBox("/al_video.php", {
                    act: "show_add_video_box",
                    oid: i[0],
                    vid: i[1]
                }, {
                    params: {
                        dark: 1
                    },
                    onDone: function(e, o) {
                        o && (e.removeButtons(), e.addButton(getLang("Save"), function(e) {
                            var t = trim(val("mv_video_add_title"));
                            t && ajax.post("/al_video.php", {
                                act: "a_add_publish_video",
                                title: t,
                                video_privacy: Privacy.getValue("video_add"),
                                videocomm_privacy: Privacy.getValue("videocomm_add"),
                                hash: o,
                                oid: i[0],
                                vid: i[1]
                            }, {
                                showProgress: lockButton.pbind(e),
                                hideProgress: unlockButton.pbind(e),
                                onDone: function() {
                                    cur._recentAddedVideos[e] = !0;
                                    var e = mvcur.videoRaw,
                                        o = mvcur.listId;
                                    Videoview.hide(!0, !0), Videoview.recache(i[0] + "_" + i[1]), showVideo(e, o)
                                }
                            })
                        }))
                    }
                })
            }
        },
        share: function(e, i, o) {
            if (vk.id) {
                var t = Videoview.getMvData();
                return t && !t.addedVideo && (t.addedVideo = t.videoRaw), (t || e) && showBox("like.php", {
                    act: "publish_box",
                    object: "video" + (t.addedVideo || e),
                    action_type: o
                }, {
                    onDone: function() {
                        window.mvcur && mvcur.mvShown && Videoview.playerNextTimerUpdate()
                    }
                }), !1
            }
        },
        like: function(e, i) {
            if (vk.id) {
                var o = Videoview.getMvData();
                if (o) {
                    var t = o;
                    if (window.mvcur && mvcur.statusVideo) var a = "wall" + t.videoRaw;
                    else var a = "video" + t.videoRaw;
                    var r = "";
                    if (window.Video && Video.isInCatalog()) {
                        var d = VideoPlaylist.getCurListId();
                        r = Videocat.isTop3Playlist(d) ? "featured" : d
                    }
                    ajax.post("like.php", {
                        act: "a_do_" + (t.liked ? "un" : "") + "like",
                        object: a,
                        hash: t.likeHash,
                        short_view: 1,
                        from: "videoview",
                        info: r
                    }, {
                        onDone: Videoview.likeUpdate.pbind(!t.liked)
                    }), i || Videoview.playerOnLiked(), toggleClass(geByClass1("mv_finish_like", "mv_external_finish"), "selected", !t.liked), Videoview.likeUpdate(!t.liked,
                        t.likes + (t.liked ? -1 : 1), null, i), Videoview.recache()
                }
            }
        },
        likeShare: function(e) {
            if (vk.id) {
                var i = mvcur.mvData;
                if (mvcur.statusVideo) var o = "wall" + i.videoRaw;
                else var o = "video" + i.videoRaw;
                var t = ge("like_share_video" + i.videoRaw),
                    a = isChecked(t);
                checkbox(t), ajax.post("like.php", {
                    act: "a_do_" + (a ? "un" : "") + "publish",
                    object: o,
                    hash: e,
                    short_view: 1,
                    list: mvcur.listId
                }, {
                    onDone: Videoview.likeUpdate.pbind(!0)
                }), Videoview.likeUpdate(!0, i.likes + (i.liked ? 0 : 1))
            }
        },
        likeOver: function(e) {
            var i = mvcur.mvData;
            if (mvcur.statusVideo) var o = "wall" + i.videoRaw;
            else var o = "video" + i.videoRaw;
            var t = getSize(ge("mv_like_link")),
                a = t ? t[0] : 20;
            showTooltip(e, {
                url: "like.php",
                params: {
                    act: "a_get_stats",
                    object: o,
                    list: mvcur.listId
                },
                slide: 15,
                shift: [0, 8, 9],
                ajaxdt: 100,
                showdt: 400,
                hidedt: 200,
                typeClass: "like_tt",
                className: "mv_like_tt",
                dir: "auto",
                init: function(e) {
                    if (e.container) {
                        var i = geByClass1("bottom_pointer", e.container, "div"),
                            o = geByClass1("top_pointer", e.container, "div");
                        setStyle(i, {
                            marginLeft: a + 2
                        }), setStyle(o, {
                            marginLeft: a + 2
                        })
                    }
                }
            })
        },
        showEditBox: function(e, i, o, t) {
            Videoview.hidePlayer();
            var a = showBox("al_video.php", {
                act: "edit_box",
                vid: e,
                oid: i,
                is_publish: +t
            }, {
                stat: ["privacy.js", "privacy.css", "video.css"],
                dark: 1
            });
            return a.setOptions({
                onHide: function() {
                    Videoview.showPlayer()
                }
            }), o && cancelEvent(o)
        },
        restoreVideo: function(e, i, o, t, a) {
            var r = ge("mv_warning");
            return r && (r.innerHTML = '<img style="margin-left: 100px;" src="/images/upload.gif" />'), ajax.post("al_video.php", {
                act: "restore_video",
                vid: e,
                oid: i,
                hash: o,
                from: t || "videoviewer"
            }, {
                onDone: function(o) {
                    if ("list" == t && cur.restoreRaw && cur.restoreRaw[i + "_" + e]) {
                        var a = ge("video_row" + i + "_" + e);
                        a.innerHTML = cur.restoreRaw[i + "_" + e], removeClass(a, "video_row_loading"), removeClass(a, "video_row_deleted"), setStyle(geByClass1(
                            "video_row_icon_delete", a), {
                            opacity: .8
                        })
                    } else;
                    hide("mv_warning"), show("mv_controls"), cur.claimedVideoText && (ge("video_player")
                        .innerHTML = cur.claimedVideoText, cur.claimedVideoText = "")
                },
                onFail: function(e) {
                    return setTimeout(showFastBox({
                            title: getLang("global_error"),
                            bodyStyle: "padding: 20px; line-height: 160%;",
                            dark: 1
                        }, e)
                        .hide, 5e3), !0
                }
            }), cancelEvent(a)
        },
        publish: function(e, i, o, t) {
            t && hasClass(t, "loading") || Videoview.showEditBox(i, e, null, !0)
        },
        deleteVideo: function(e, i, o, t, a, r, d) {
            r && hasClass(r, "loading") || ajax.post("al_video.php", {
                act: "delete_video",
                vid: e,
                oid: i,
                hash: o,
                sure: t ? 1 : 0,
                from: a
            }, {
                onDone: function(t, n, v, s, l) {
                    if (Videoview.recache(i + "_" + e), "sure" == t) {
                        Videoview.hidePlayer();
                        var c = showFastBox({
                            title: n,
                            bodyStyle: "padding: 20px; line-height: 160%;",
                            dark: 1
                        }, v);
                        c.setOptions({
                            onHide: function() {
                                Videoview.showPlayer()
                            }
                        }), c.removeButtons(), c.addButton(l, c.hide, "no"), c.addButton(s, function() {
                            c.showProgress(), Videoview.deleteVideo(e, i, o, !0, a, r, c.hide)
                        }, "yes")
                    } else if ("result" == t && (d && d(v), "videoviewer" == a && (ge("mv_controls") && (hide("mv_controls"), val("mv_warning", v), show(
                            "mv_warning"), hide("mv_publish")), v = n), window.Video && Video.isInVideosList())) return Video.updateVideo(cur.oid, [i, e], [], !0), !
                        0
                },
                showProgress: r ? addClass.pbind(r, "loading") : !1,
                hideProgress: r ? removeClass.pbind(r, "loading") : !1
            })
        },
        deleteVideoOnClaim: function(e, i, o, t, a, r) {
            Videoview.deleteVideo(e, i, o, t, a, r, function(e) {
                "videoviewer" == a && (hide("mv_controls"), cur.claimedVideoText = ge("video_player")
                    .innerHTML, ge("video_player")
                    .innerHTML = e)
            })
        },
        recache: function(e) {
            !e && window.mvcur && mvcur.mvData.videoRaw && (e = mvcur.mvData.videoRaw);
            for (var i in ajaxCache) i.match(/^\/al_video\.php\#act=show/) && i.match(new RegExp("&video=" + e + "([^0-9]|$)", "")) && delete ajaxCache[i]
        },
        getVideoCode: function(e, i) {
            Videoview.sendVideo(!0)
        },
        reportBox: function(e, i) {
            Videoview.hidePlayer(), showBox("reports.php", {
                act: "a_report_video_box",
                oid: e,
                vid: i
            }, {
                onHideAttempt: function() {
                    Videoview.showPlayer()
                },
                stat: ["ui_controls.js", "ui_controls.css"],
                dark: 1
            })
        },
        setAdult: function(e, i, o, t, a) {
            ajax.post("al_video.php", {
                act: "set_adult_video",
                vid: i,
                oid: e,
                hash: o,
                value: t
            }, {
                onDone: function(e, i) {
                    a && (a.innerHTML = i)
                }
            })
        },
        spamVideo: function(e, i, o, t, a, r, d) {
            t && addClass(t, "loading"), ajax.post("al_video.php", {
                act: "spam_video",
                vid: i,
                oid: e,
                hash: o,
                sure: r ? 1 : 0,
                from: a
            }, {
                onDone: function(r, n, v, s, l) {
                    if (t && removeClass(t, "loading"), Videoview.recache(e + "_" + i), "sure" == r) {
                        Videoview.hidePlayer();
                        var c = showFastBox({
                            title: n,
                            bodyStyle: "padding: 20px; line-height: 160%;",
                            dark: 1
                        }, v);
                        c.setOptions({
                            onHide: function() {
                                Videoview.showPlayer()
                            }
                        }), c.removeButtons(), c.addButton(l, c.hide, "no"), c.addButton(s, function() {
                            c.showProgress(), Videoview.spamVideo(e, i, o, t, a, !0, c.hide)
                        }, "yes")
                    } else if ("result" == r) {
                        if (d && d(), "videoviewer" == a && window.Video && Video.removeFromLists(e + "_" + i), "list" == a) return ge("video_row" + e + "_" + i)
                            .innerHTML = '<div class="video_row">' + v + "</div>", Video.removeFromLists(e + "_" + i, !0), !0
                    } else t.parentNode.innerHTML = r
                }
            })
        },
        licensed: function(e, i) {
            var o = ge("mv_licensed_info");
            (o || e)
            .innerHTML = '<img src="/images/upload.gif" />', show(o), ajax.post("al_video.php", {
                act: "change_licensed",
                video: mvcur.mvData.videoRaw,
                hash: i
            }, {
                onDone: function(i, t) {
                    o && (o.innerHTML = t, (t ? show : hide)(o)), e.innerHTML = i
                }
            })
        },
        claimed: function(e, i, o) {
            ge("claim_link")
                .innerHTML = getProgressHtml(), ajax.post("al_claims.php", {
                    act: "a_" + i,
                    type: "video",
                    id: mvcur.mvData.vid,
                    owner_id: mvcur.mvData.oid,
                    claim_id: e,
                    extra: o
                }, {
                    onDone: function() {
                        "claim" == i ? ge("claim_link")
                            .innerHTML = '<a onclick="return Videoview.claimed(' + e + ", 'unclaim', '" + o + "');\">Вернуть</a>" : ge("claim_link")
                            .innerHTML = '<a onclick="return Videoview.claimed(' + e + ", 'claim', '" + o + "');\">Изъять</a>"
                    }
                })
        },
        setStyle: function(e, i, o) {
            i = ge(i), mvcur.restoreStyles || (mvcur.restoreStyles = {});
            for (var t in o) mvcur.restoreStyles[e] || (mvcur.restoreStyles[e] = {}), mvcur.restoreStyles[e][t] = i.style[t], i.style[t] = o[t]
        },
        restoreStyle: function(e, i) {
            i = ge(i), setStyle(i, mvcur.restoreStyles[e])
        },
        showVideo: function(title, html, js, desc, serviceBtns, opt) {
            if (mvcur.mvShown && opt.mvData.videoRaw == mvcur.videoRaw) {
                if (!vk.id && !html) return void setTimeout(function() {
                    Videoview.hide(!1, !0), showDoneBox(title)
                }, 500);
                if (title && !html) return val("mv_content", '<div id="video_player" class="video_layer_message">' + title + "</div>"), hide("mv_progress"), void hide(
                    "mv_controls");
                if (opt = opt || {}, cur.lang = extend(cur.lang || {}, opt.lang), mvcur.post = opt.post, mvcur.maxReplyLength = opt.maxReplyLength, mvcur.maxDescriptionLength =
                    opt.maxDescriptionLength, mvcur.mvData = opt.mvData, mvcur.videoRaw = opt.mvData.videoRaw, mvcur.commentsTpl = opt.commentsTpl, mvcur.mvMediaTypes = opt.media,
                    mvcur.mvMediaShare = opt.share, mvcur.mvReplyNames = opt.names || {}, mvcur.rmedia_types = opt.rmedia_types, mvcur.adminLevel = opt.adminLevel, opt.queueData &&
                    (mvcur.queueKey = opt.queueData.key, mvcur.qversion = opt.qversion), mvcur.wallTpl = opt.wallTpl, opt.pl_list) {
                    var lists = JSON.parse(opt.pl_list);
                    each(lists, function(e, i) {
                        VideoPlaylist.addList(i)
                    });
                    var playlistId = mvcur.options.playlistId,
                        playlist = VideoPlaylist.getList(playlistId);
                    if (playlist) {
                        var plBlockEl = VideoPlaylist.buildBlock(playlistId, mvcur.videoRaw, !0);
                        toggleClass("mv_container", "mv_container_has_pl", !!plBlockEl), plBlockEl && (domByClass(mvLayer, "mv_data")
                            .appendChild(plBlockEl), VideoPlaylist.updateScrollbar(), VideoPlaylist.toggleStateClasses(), VideoPlaylist.setCurVideo(mvcur.videoRaw),
                            VideoPlaylist.updateControls())
                    }
                }
                if (Wall.cancelEdit(!0), opt.is_vk_player && !opt.is_flv && !opt.cantPlay && mvcur.player && domPN(mvcur.player.el) === ge("video_player")) {
                    var videoBoxWrap = domByClass(ge("mv_content"), "video_box_wrap");
                    attr(videoBoxWrap, "id", "video_box_wrap" + mvcur.videoRaw)
                } else val("mv_content", html);
                hide("mv_progress"), val("mv_controls", desc), val("mv_service_btns", serviceBtns);
                var rf = ge("reply_field" + mvcur.post);
                if (rf && placeholderInit(rf, {
                        editable: 1
                    }), mvcur.finished = !1, js && eval("(function(){" + js + "})()"), opt.publishAction) {
                    var publishAction = ge("mv_publish");
                    publishAction.innerHTML = opt.publishAction, show(publishAction)
                }
                if (Videoview.updateSize(), mvcur.changeCanvasSize = function() {
                        Videoview.updateSize(), window.checkRBoxes && checkRBoxes()
                    }, mvcur.minimized && Videoview.minimizePlayer(), mvcur.statusVideo) {
                    var statusCont = ge("like_count" + mvcur.mvData.videoRaw);
                    if (statusCont) {
                        var tt = statusCont.parentNode.tt;
                        tt && tt.container && re(tt.container), statusCont.parentNode.tt && delete statusCont.parentNode.tt
                    }
                }
                if (show("mv_content"), window.updateWndVScroll && updateWndVScroll(), (mvcur.options || {})
                    .scroll && (mvLayerWrap.scrollTop = mvcur.options.scroll, mvcur.options.scroll = 0), toggle("mv_controls", !mvcur.mvData.noControls && !mvcur.minimized), !
                    mvcur.mvData.noControls) {
                    var titleWidth = mvcur.minimized ? mvcur.minSize.wrap.w : !1;
                    Videoview.setTitle(titleWidth), Videoview.initAddButton();
                    var items = [];
                    mvcur.mvData.publishToGroups && items.push(["_onAddToCommunity", getLang("video_add_to_group")]), mvcur.mvData.canExport && items.push(["_onExport",
                            getLang("video_export_action")
                        ]), mvcur.mvData.stats && items.push(["_onViewStats", getLang("video_statistics")]), mvcur.mvData.oid != vk.id && mvcur.mvData.reportReasons && mvcur.mvData
                        .reportReasons.length && items.push(["_onReport", getLang("video_complain")]), mvcur.mvData.deleteHash && !mvcur.mvData.hideEdit && items.push([
                            "_onDelete", getLang("video_menu_delete")
                        ]), items.length ? new InlineDropdown("mv_more", {
                            items: items,
                            withArrow: !0,
                            keepTitle: !0,
                            autoShow: !0,
                            autoHide: 300,
                            headerLeft: -17,
                            headerTop: -11,
                            sublists: vk.id != mvcur.mvData.oid ? {
                                _onReport: {
                                    items: mvcur.mvData.reportReasons,
                                    onSelect: function(e) {
                                        return Videoview.reportFromDD(mvcur.mvData.reportHash, e), !0
                                    }
                                }
                            } : {},
                            onSelect: function(e) {
                                Videoview[e]()
                            }
                        }) : re("mv_more"), toggle(ge("mv_edit_button"), mvcur.mvData.editHash && !mvcur.mvData.hideEdit)
                }
                mvcur.mvData.uploaded || Videoview.recache();
                var replyField = ge("reply_field" + mvcur.post);
                replyField && addEvent(replyField, "blur focus", function(e) {
                    mvcur.commentingInProgress = "focus" == e.type, Videoview.playerNextTimerUpdate()
                }), Videoview.adaptRecomsHeight(), Videoview.updateReplyFormPos(), opt.queueData && stManager.add("notifier.js", function() {
                    Videoview.checkUpdates(opt.queueData)
                })
            }
        },
        adaptRecomsHeight: function() {
            var e = geByClass1("mv_wide_column", "mv_controls"),
                i = geByClass1("mv_narrow_column", "mv_controls");
            if (e && i)
                for (var o = geByClass("mv_recom_item", i), t = o.length - 1; getSize(e)[1] < getSize(i)[1] && t > 0; --t) hide(o[t])
        },
        checkUpdates: function(e) {
            window.mvcur && mvcur.mvShown && mvcur.queueKey === e.key && (Notifier.addKey(e, Videoview.receiveUpdates), setTimeout(Videoview.checkUpdates.pbind(e), 25e3))
        },
        receiveUpdates: function(e, i) {
            if (window.mvcur && mvcur.mvShown && mvcur.queueKey === e && i) {
                if (i.failed) return void(mvcur.queueKey = null);
                each(i.events, function() {
                    var e = this.split("<!>"),
                        i = e[0],
                        o = e[1];
                    if (i == mvcur.qversion) switch (o) {
                        case "new_reply":
                            Videoview.onNewCommentReceived(e), Videoview.updateComms();
                            break;
                        case "edit_reply":
                            var t = ge("wpt" + e[2]);
                            t && !attr(t, "data-action") && val(t, psr(e[3]));
                            break;
                        case "del_reply":
                            var t = ge("post" + e[2]);
                            t ? attr(t, "data-action") || (mvcur.mvData.commcount--, mvcur.mvData.commshown--, re(t)) : mvcur.mvData.commcount--, Videoview.updateComms();
                            break;
                        case "like_reply":
                            var a = (e[2], +e[3]),
                                r = e[4],
                                d = e[5],
                                t = ge("wpe_bottom" + e[2]);
                            if (t) {
                                var n = domByClass(t, "_like_wrap"),
                                    v = domByClass(n, "_count");
                                val(v, a > 0 ? a : ""), toggleClass(n, "no_likes", !a), r == vk.id && toggleClass(n, "my_like", !d)
                            }
                            break;
                        default:
                            debugLog("unhandled video event")
                    }
                }), Videoview.updateReplyFormPos()
            }
        },
        onNewCommentReceived: function(e) {
            if (!ge("post" + e[3] + "video_" + e[4] + "mv")) {
                var i = "";
                mvcur.adminLevel > 0 || e[3] == vk.id || e[5] == vk.id ? i += mvcur.commentsTpl.del_reply : e[3] != e[5] && (i += mvcur.commentsTpl.spam_reply), (mvcur.adminLevel >
                    1 && e[3] == e[5] || e[5] == vk.id) && (i += mvcur.commentsTpl.edit_reply), i = rs(mvcur.commentsTpl.actions, {
                    actions: i
                });
                var o = langDate(1e3 * e[10], getLang("global_short_date_time", "raw"), 0, []),
                    t = rs(mvcur.commentsTpl.reply, {
                        actions: i,
                        post_oid: e[3],
                        reply_id: e[3] + "video_" + e[4] + "mv",
                        reply_msg_id: e[4],
                        from_id: e[5],
                        name: e[6],
                        photo: e[7],
                        href: e[8],
                        message: e[9],
                        date: o,
                        to_link: e[11]
                    });
                mvcur.mvReplyNames[e[5]] = [e[12], e[13]], ge("mv_comments")
                    .insertAdjacentHTML("beforeend", t), mvcur.mvData.commcount++, mvcur.mvData.commshown++
            }
        },
        onVideoShared: function(e, i, o) {
            "publish" != e || Videoview._isCurrentVideoPublished() || (Videoview.hide(!0, !0), setTimeout(function() {
                0 == i.indexOf("video") && (i = i.substr("video".length)), Videoview.recache(i), showVideo(i, o)
            }, 100))
        },
        _onAddToCommunity: function() {
            showBox("/al_video.php", {
                act: "add_to_club_pl_box",
                oid: mvcur.mvData.oid,
                vid: mvcur.mvData.vid
            }, {
                params: {
                    dark: 1
                },
                onDone: function(e) {}
            })
        },
        _onDelete: function() {
            var e = mvcur.mvData.oid,
                i = mvcur.mvData.vid,
                o = mvcur.mvData.deleteHash,
                t = !1,
                a = "videoviewer";
            Videoview.deleteVideo(i, e, o, t, a)
        },
        _onExport: function() {
            Videoview.sendVideo(!0)
        },
        _onViewStats: function() {
            showBox("al_stats.php", {
                act: "video_stat",
                oid: mvcur.mvData.stats.stat_oid,
                vid: mvcur.mvData.stats.stat_vid
            }, {
                params: {
                    width: 795,
                    bodyStyle: "padding: 0"
                },
                dark: 1
            })
        },
        addToClubPlaylistBoxInit: function(e, i, o) {
            function t(e, i) {
                return hide("mv_add_to_club_albums"), val("mv_add_to_club_albums_list", ""), -1 == e ? void val("mv_add_to_club_gid", "") : (show(
                    "mv_add_to_club_albums_progress"), void ajax.post("/al_video.php", {
                    act: "a_get_club_playlists",
                    gid: i,
                    oid: mvcur.mvData.oid,
                    vid: mvcur.mvData.vid
                }, {
                    onDone: function(e) {
                        playlistsHtml = "", each(e, function(e, i) {
                            playlistsHtml += '<div class="mv_add_to_club_albums_list_item checkbox ' + (+i.added ? "on" : "") + '" data-id="' + i.id +
                                '" onclick="checkbox(this)">' + clean(i.title) + "</div>"
                        }), val("mv_add_to_club_albums_list", playlistsHtml), val("mv_add_to_club_gid", i), hide("mv_add_to_club_albums_progress"), show(
                            "mv_add_to_club_albums")
                    }
                }))
            }
            WideDropdown.deinit("add_to_pl_club_dd"), mvcur.addToClubPl = WideDropdown.init("add_to_pl_club_dd", {
                defaultItems: i,
                noResult: "no result",
                introText: "choose",
                onChange: t
            }), setTimeout(elfocus.pbind("add_to_pl_club_dd_input"), 0), e.removeButtons(), e.addButton(getLang("Save"), function(e) {
                var i = val("mv_add_to_club_gid"),
                    t = [];
                each(geByClass("mv_add_to_club_albums_list_item"), function(e, i) {
                    isChecked(i) && t.push(attr(i, "data-id"))
                }), ajax.post("/al_video.php", {
                    act: "a_add_to_playlist",
                    hash: o,
                    gid: i,
                    oid: mvcur.mvData.oid,
                    vid: mvcur.mvData.vid,
                    playlists: t.length ? t : "0"
                }, {
                    showProgress: lockButton.pbind(e),
                    hideProgress: unlockButton.pbind(e),
                    onDone: function() {
                        curBox()
                            .hide(), showDoneBox(getLang("video_changes_saved"))
                    }
                })
            }, null, !0)
        },
        setTitle: function(e) {
            var i = mvcur.mvData.title || "";
            e = e || 590, ge("mv_min_title")
                .innerHTML = Videoview._isCurrentVideoPublished() ? i : "", setStyle(ge("mv_min_title"), {
                    maxWidth: Math.max(0, e - 60)
                });
            var o = ge("mv_title");
            if (o) {
                var t = getSize(o);
                setStyle(o, {
                    overflow: "visible",
                    width: "inherit",
                    position: "absolute",
                    "max-width": "initial"
                }), t[0] < getSize(o)[0] && o.setAttribute("title", replaceEntities(i)), setStyle(o, {
                    overflow: "",
                    width: "",
                    position: "",
                    "max-width": ""
                }), val(o, i)
            }
        },
        expandDescr: function(e) {
            var i = ge("mv_desc_full_text");
            ge("mv_descr_field")
                .innerHTML = i.innerHTML, Videoview.cleanExpandDescrEls()
        },
        cleanExpandDescrEls: function() {
            re(ge("mv_desc_full_text")), re(ge("mv_descr_expand_toggle"))
        },
        setDesc: function() {
            ge("mv_descr_field") && val(ge("mv_descr_field"), mvcur.mvData.desc || "")
        },
        getContSize: function() {
            return mvcur.contSize || (mvcur.contSize = getSize("mv_box")), mvcur.contSize
        },
        getContPlace: function(e, i) {
            var o = 0,
                t = Videoview.getContSize(),
                a = e.clientX - mvcur.minSize.wrap.l,
                r = e.clientY - mvcur.minSize.wrap.t;
            return 6 > r && (o += 1), a > t[0] - 20 && (o += 2), r > t[1] - 10 && (o += 4), 10 > a && (o += 8), 1 == o && a > t[0] - 55 && (o = 0), !o && 25 > r && a < t[0] -
                55 && (o += 16), o
        },
        changeCursor: function(e) {
            var i = Videoview.getContPlace(e),
                o = "default";
            if (i && mvcur.minimized) {
                var t = "";
                1 & i && (t += "n"), 4 & i && (t += "s"), 2 & i && (t += "e"), 8 & i && (t += "w"), o = t + "-resize", 16 & i && (o = "move")
            }
            setStyle("mv_box", {
                cursor: o
            })
        },
        getMinSize: function() {
            extend(mvcur.minSize, {
                wrap: {
                    t: intval(mvLayerWrap.style.top),
                    l: intval(mvLayerWrap.style.left),
                    w: intval(mvLayerWrap.style.width),
                    h: intval(mvLayerWrap.style.height)
                },
                player: {
                    w: intval(mvcur.mvPlayer && mvcur.mvPlayer.style.width),
                    h: intval(mvcur.mvPlayer && mvcur.mvPlayer.style.height)
                }
            })
        },
        startDrag: function(e) {
            if (!e.button || 1 === e.button) {
                var i = Videoview.getContPlace(e, !0);
                if (i) {
                    var o = (new Date)
                        .getTime();
                    if (Videoview.getMinSize(), extend(mvcur.minSize, {
                            x: e.clientX,
                            y: e.clientY
                        }), mvcur.resizeDiff = 0, mvcur.mvPlayerCont = mvcur.mvPlayer ? domPN(mvcur.mvPlayer) : ge("video_box_wrap" + mvcur.videoRaw), !i || 16 & i) var t =
                        Videoview.onMinMove;
                    else var t = Videoview.onMinResize;
                    mvcur.resizeMask = i;
                    var a = function(e) {
                        removeEvent(document, "mouseup", a), removeEvent(document, "mousemove", t), removeEvent(document, "drag", t);
                        var r = (new Date)
                            .getTime();
                        return Videoview.getMinSize(), mvcur.resizeDiff < 8 && 400 > r - o && (16 & i || 1 == i) && Videoview.unminimize(), removeClass(mvLayerWrap,
                            "mv_resizing"), hide("mv_progress"), addEvent("mv_box", "mousemove", Videoview.changeCursor), ls.set("mv_minSize", mvcur.minSize), !1
                    };
                    return addClass(mvLayerWrap, "mv_resizing"), show("mv_progress"), addEvent(document, "mouseup", a), addEvent(document, "mousemove", t), addEvent(document,
                        "drag", t), removeEvent("mv_box", "mousemove", Videoview.changeCursor), cancelEvent(e)
                }
            }
        },
        onMinMove: function(e) {
            if (e) var i = e.clientY - mvcur.minSize.y,
                o = e.clientX - mvcur.minSize.x;
            else var i = 0,
                o = 0;
            return mvcur.minSize.wrap.t + i > mvcur.minSize.ch - mvcur.minSize.wrap.h - 15 && (i = mvcur.minSize.ch - mvcur.minSize.wrap.h - mvcur.minSize.wrap.t), mvcur.minSize
                .wrap.l + o > mvcur.minSize.cw - mvcur.minSize.wrap.w - 25 && (o = mvcur.minSize.cw - mvcur.minSize.wrap.w - mvcur.minSize.wrap.l - 14), mvcur.minSize.wrap.t +
                i < 15 && (i = -mvcur.minSize.wrap.t), mvcur.minSize.wrap.l + o < 15 && (o = -mvcur.minSize.wrap.l), setStyle(mvLayerWrap, {
                    top: mvcur.minSize.wrap.t + i + "px",
                    left: mvcur.minSize.wrap.l + o + "px"
                }), mvcur.resizeDiff = Math.max(Math.abs(o), Math.max(Math.abs(i), mvcur.resizeDiff)), e ? cancelEvent(e) : !1
        },
        onMinResize: function(e) {
            var i = 0,
                o = 0,
                t = mvcur.resizeMask,
                a = 1 & t || 4 & t ? e.clientY - mvcur.minSize.y : 0,
                r = 2 & t || 8 & t ? e.clientX - mvcur.minSize.x : 0;
            4 & t && mvcur.minSize.wrap.t + a > mvcur.minSize.ch - mvcur.minSize.wrap.h && (a = mvcur.minSize.ch - mvcur.minSize.wrap.h - mvcur.minSize.wrap.t), 1 & t && mvcur
                .minSize.wrap.t + a < 0 && (a = -mvcur.minSize.wrap.t), 2 & t && mvcur.minSize.wrap.l + r > mvcur.minSize.cw - mvcur.minSize.wrap.w - 14 && (r = mvcur.minSize.cw -
                    mvcur.minSize.wrap.w - mvcur.minSize.wrap.l - 14), 8 & t && mvcur.minSize.wrap.l + r < 0 && (r = -mvcur.minSize.wrap.l), 8 & t && (i = r, r = -r), 1 & t &&
                (o = a, a = -a), mvcur.minSize.wrap.w + r < 250 && (r = 250 - mvcur.minSize.wrap.w, 8 & t && (i = -r)), mvcur.minSize.wrap.h + a < 200 && (a = 200 - mvcur.minSize
                    .wrap.h, 1 & t && (o = -a));
            var d = Math.abs(r) + Math.abs(a),
                n = mvcur.minSize.wrap.w + r;
            setStyle(mvLayerWrap, {
                top: mvcur.minSize.wrap.t + o + "px",
                left: positive(mvcur.minSize.wrap.l + i) + "px",
                width: n + "px",
                height: mvcur.minSize.wrap.h + a + "px"
            });
            var v = {
                height: mvcur.minSize.player.h + a + "px",
                width: mvcur.minSize.player.w + r + "px"
            };
            return mvcur.flashResizeStyle || (d > 4 && clearTimeout(mvcur.resizeTimeout), mvcur.resizeTimeout = setTimeout(function() {
                    setStyle(mvcur.mvPlayer, mvcur.flashResizeStyle), mvcur.flashResizeStyle = !1
                }, 200)), mvcur.flashResizeStyle = v, setStyle(mvcur.mvPlayerCont, v), mvcur.resizeDiff = Math.max(d, mvcur.resizeDiff), mvcur.contSize = !1, Videoview.setTitle(
                    n), mvcur.player && mvcur.player.resize(), ge("html5_player") && window.html5video && html5video.onResize(), ge("video_yt") && window.VideoYoutube &&
                VideoYoutube.onResize(), Videoview.updateExternalVideoFinishBlock(), !1
        },
        minimize: function(e) {
            if (e && cancelEvent(e), mvcur.minimized) return !1;
            VideoPlaylist.toggleStateClasses(), mvcur.controlsVisibility = isVisible("mv_controls"), show("mv_min_header"), hide("mv_controls"), hide("mv_top_controls"),
                isVisible("mv_approve") ? (mvcur.needShowApprove = !0, hide("mv_approve")) : mvcur.needShowApprove = !1, Wall.cancelEdit(!0), addClass(mvLayerWrap,
                    "mv_minimized"), mvcur.minSize || (mvcur.minSize = ls.get("mv_minSize"));
            var i = "mv_dark";
            removeClass(mvLayerWrap, i), removeClass(layerBG, i), layers.fullhide = !1, mvcur.minSize && Videoview.enabledResize() && mvcur.minSize.wrap.w || (mvcur.minSize = {
                wrap: {
                    w: 300,
                    h: 198
                }
            });
            var o = mvcur.minSize.wrap;
            mvcur.minSize.player = {
                    w: o.w - 12,
                    h: o.h - 36
                }, Videoview.setStyle("mvContainer", "mv_container", {
                    left: "0px",
                    top: "0px"
                }), setStyle(mvLayer, {
                    width: "auto"
                }), mvcur.mvData && Videoview.minimizePlayer(), window.tooltips && tooltips.destroyAll("mv_container"), removeEvent(window, "resize", Videoview.onResize),
                removeEvent(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), removeEvent(document, "keydown", Videoview.onKeyDown),
                addEvent(window, "resize", Videoview.minResize), Videoview.enabledResize() ? (addEvent("mv_box", "mousedown", Videoview.startDrag), addEvent("mv_box",
                    "mousemove", Videoview.changeCursor), mvcur.minDestroy = function() {
                    removeEvent("mv_box", "mousedown", Videoview.startDrag), removeEvent("mv_box", "mousemove", Videoview.changeCursor), setStyle("mv_box", {
                        cursor: "default"
                    })
                }) : (addEvent(ge("mv_min_title"), "click", Videoview.unminimize), mvcur.minDestroy = function() {
                    removeEvent(ge("mv_min_title"), "click", Videoview.unminimize)
                }), Videoview.setTitle(o.w), Videoview.minResize(), Videoview.setStyle("mvLayerWrap", mvLayerWrap, {
                    width: mvcur.minSize.wrap.w + "px",
                    height: mvcur.minSize.wrap.h + "px"
                }), mvcur.minimized = !0, layers.wraphide(), ge("html5_player") && window.html5video && setTimeout(html5video.onResize, 10), ge("video_yt") && window.VideoYoutube &&
                setTimeout(VideoYoutube.onResize, 10);
            var t = layerQueue.count();
            return mvcur.noLocChange || (Videoview.backLocation(), mvcur.noHistory = 1), layerQueue.skipVideo = !0, t && (debugLog("pop from minimize"), layerQueue.pop()),
                VideoPlaylist.toggleStateClasses(), Videoview.updateExternalVideoFinishBlock(), !1
        },
        isMinimized: function() {
            return window.mvcur && mvcur.mvShown && mvcur.minimized
        },
        enabledResize: function() {
            return (browser.safari || browser.chrome || browser.mozilla || browser.opera) && !browser.safari_mobile
        },
        minimizePlayer: function() {
            if (mvcur.mvPlayer = ge("video_player") || ge("extra_player") || ge("html5_player") || ge("video_box_wrap" + mvcur.videoRaw), mvcur.mvPlayer) {
                var e = {
                    width: mvcur.minSize.player.w + "px",
                    height: mvcur.minSize.player.h + "px"
                };
                Videoview.setStyle("mvPlayer", mvcur.mvPlayer, e), Videoview.setStyle("mvPlayerParent", mvcur.mvPlayer.parentNode, e), mvcur.player && mvcur.player.resize(),
                    ge("html5_player") && window.html5video && html5video.onResize(), ge("video_yt") && window.VideoYoutube && VideoYoutube.onResize()
            }
        },
        minResize: function() {
            var e = document.documentElement;
            mvcur.minSize.ch = window.innerHeight || e.clientHeight || bodyNode.clientHeight, mvcur.minSize.cw = window.innerWidth || e.clientWidth || bodyNode.clientWidth;
            var i = getXY(ge("page_layout"));
            void 0 === mvcur.minSize.wrap.t && (mvcur.minSize.wrap.t = mvcur.minSize.ch - mvcur.minSize.wrap.h), void 0 === mvcur.minSize.wrap.l && (mvcur.minSize.wrap.l =
                Math.max(String(i[0] - mvcur.minSize.player.w / 2), 30)), setStyle(mvLayerWrap, {
                left: mvcur.minSize.wrap.l + "px",
                top: mvcur.minSize.wrap.t + "px"
            }), Videoview.onMinMove(), mvcur.minimized && Videoview.getMinSize()
        },
        unminimize: function(e, i, o) {
            if (mvcur.minimized) {
                o || layerQueue.push(), i || (layerQueue.hide(), setTimeout(function() {
                        mvcur.noHistory = 1, layerQueue.noHistory(), layers.wrapshow(mvLayerWrap, .7), layers.fullhide = Videoview.hide
                    }, 0)), Videoview.hidePlayer(!0), mvcur.controlsVisibility && show("mv_controls"), hide("mv_min_header"), show("mv_top_controls"), mvcur.minimized = !1,
                    removeClass(mvLayerWrap, "mv_minimized"), Videoview.restoreStyle("mvLayerWrap", mvLayerWrap);
                var t = "mv_dark";
                return addClass(mvLayerWrap, t), addClass(layerBG, t), mvcur.needShowApprove && (mvcur.needShowApprove = !1, show("mv_approve")), Videoview.restoreStyle(
                        "mvContainer", "mv_container"), mvcur.mvPlayer && (Videoview.restoreStyle("mvPlayer", mvcur.mvPlayer), Videoview.restoreStyle("mvPlayerParent", mvcur.mvPlayer
                        .parentNode)), Videoview.updateSize(), addEvent(window, "resize", Videoview.onResize), addEvent(document,
                        "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), addEvent(document, "keydown", Videoview.onKeyDown),
                    removeEvent(window, "resize", Videoview.minResize), mvcur.minDestroy && mvcur.minDestroy(), mvcur.noLocChange || e === !0 || Videoview.setLocation(),
                    onBodyResize(!0), setStyle(mvLayerWrap, {
                        left: "0px",
                        top: "0px"
                    }), Videoview.showPlayer(!0), Videoview.setTitle(), VideoPlaylist.toggleStateClasses(), Videoview.viewScroll(), mvcur.player && mvcur.player.resize(), ge(
                        "html5_player") && window.html5video && setTimeout(html5video.onResize, 0), ge("video_yt") && window.VideoYoutube && VideoYoutube.onResize(), !1
            }
        },
        sendVideo: function(e) {
            Videoview.hidePlayer();
            var i = showBox("like.php", {
                act: "publish_box",
                object: "video" + mvcur.videoRaw,
                list: mvcur.listId,
                is_export: e
            }, {
                stat: ["page.js", "page.css", "wide_dd.js", "wide_dd.css", "sharebox.js"]
            });
            i.setOptions({
                onHideAttempt: function() {
                    return Videoview.showPlayer(), !0
                }
            }), Videoview.playerNextTimerUpdate()
        },
        showDD: function(e, i) {
            if (clearTimeout(cur.hideShareTimer), e.blur(), !hasClass(i, "mv_dd_hiding")) {
                if (isVisible(i)) return fadeIn(i, 0);
                cur.ddShown && videoview.hideDD(0), cur.ddShown = i, setTimeout(addEvent.pbind(document, "click", Videoview.hideDD), 1), show(i)
            }
        },
        hideDD: function(e) {
            if (e > 0) return void(cur.hideShareTimer = setTimeout(Videoview.hideDD.pbind(0), e));
            var i = cur.ddShown;
            i && (-1 == e ? hide(i) : (addClass(i, "mv_dd_hiding"), fadeOut(i, 200, function() {
                removeClass(i, "mv_dd_hiding")
            })), removeEvent(document, "click", Videoview.hideDD), cur.ddShown = !1)
        },
        reportFromDD: function(e, i) {
            ajax.post("reports.php", {
                act: "new_report",
                type: "video",
                reason: i,
                hash: e,
                oid: mvcur.mvData.oid,
                item_id: mvcur.mvData.vid
            }, {
                onDone: function(e) {
                    showDoneBox(e)
                },
                showProgress: function() {},
                hideProgress: function() {}
            })
        },
        reportComment: function(e, i, o) {
            stManager.add(["privacy.js", "privacy.css"], function() {
                return Privacy.show(e, i, "report_" + o)
            })
        },
        descTT: function(e) {
            return showTooltip(e, {
                text: getLang("video_edit_desc"),
                black: 1,
                shift: [0, 7, 0],
                showdt: 0
            })
        },
        viewScroll: function() {
            var e, i = 6,
                o = (ge("mv_top_controls"), getXY("mv_box", !0)[1]),
                t = getSize("mv_content")[1];
            e = o - i, e = 0 > e ? -e : 0, toggleClass("mv_top_controls", "fixed", e > 0), toggleClass("mv_pl_prev", "fixed", e > 0), toggleClass("mv_pl_next", "fixed", e > 0),
                toggleClass("mv_top_pl_toggle", "hidden", e > t), mvcur.scrolledAway = e > t / 3, Videoview.playerNextTimerUpdate(), Videoview.updateReplyFormPos()
        },
        updateReplyFormPos: function() {
            var e = ge("mv_reply_form"),
                i = ge("mv_comments_wrap"),
                o = getSize(e),
                t = domPN(e),
                a = clientHeight(),
                r = (mvLayerWrap.scrollTop, getXY(mvLayerWrap)[1]),
                d = getXY("mv_box")[1] - r,
                n = getXY(i)[1] - r,
                v = getSize(i)[1],
                s = getSize("mv_box")[1],
                l = d + s > a && v > 0;
            l ? (addClass(e, "mv_reply_form_fixed"), setStyle(e, {
                bottom: Math.min(a - n - o[1], 0) + "px"
            }), setStyle(t, {
                width: o[0] + "px",
                height: o[1] + "px"
            })) : (removeClass(e, "mv_reply_form_fixed"), setStyle(e, {
                bottom: null
            }), setStyle(t, {
                width: null,
                height: null
            }))
        },
        editInline: function(e) {
            if (!(e && "A" == e.target.tagName || !window.mvcur || mvcur.mvEditing) && ge("mv_description")) {
                var i = mvcur.videoRaw,
                    o = mvcur.mvShown,
                    t = mvcur.mvData,
                    a = !t.desc,
                    r = function(e) {
                        if (mvcur.mvShown && mvcur.videoRaw == i && mvcur.mvShown == o && !mvcur.mvEditing) {
                            Videoview.cleanExpandDescrEls(), mvcur.mvEditing = i;
                            var t = "margin-bottom:" + (browser.chrome || browser.safari ? -4 : 0) + "px",
                                a = ce("div", {
                                    id: "mv_edit_text_wrap",
                                    innerHTML: '<textarea id="mv_edit_text" style="' + t +
                                        '" onkeydown="onCtrlEnter(event, videoview.saveInline)" onkeyup="checkTextLength(mvcur.maxDescriptionLength, this, ge(\'mv_caption_warn\'));" placeholder="' +
                                        getLang("video_edit_desc_intro") + '">' + e + '</textarea><div id="mv_caption_warn"></div>'
                                });
                            ge("mv_description")
                                .appendChild(a);
                            var r = ge("mv_edit_text");
                            setStyle(r, {
                                width: ge("mv_description")
                                    .offsetWidth + "px"
                            }), placeholderInit(r), autosizeSetup(r, {
                                minHeight: 18,
                                ignorePadding: !0
                            }), setTimeout(function() {
                                show(a), elfocus(r), addEvent(r, "blur", videoview.saveInline), hide("mv_descr_field")
                            }, 1)
                        }
                    };
                a ? r("") : ajax.post("al_video.php", {
                    act: "edit_desc",
                    oid: t.oid,
                    vid: t.vid
                }, {
                    onDone: r,
                    progress: "mv_inline_edit_pr"
                })
            }
        },
        cancelInline: function() {
            mvcur.mvEditing = !1, removeEvent(ge("mv_edit_text"), "blur"), show("mv_descr_field"), re("mv_edit_text_wrap")
        },
        saveInline: function() {
            if (mvcur.mvEditing) {
                removeEvent(ge("mv_edit_text"), "blur");
                var e = mvcur.mvEditing,
                    i = mvcur.mvShown,
                    o = mvcur.mvData;
                ajax.post("al_video.php", {
                    act: "save_desc",
                    oid: o.oid,
                    vid: o.vid,
                    hash: o.editHash,
                    desc: val("mv_edit_text")
                }, {
                    onDone: function(t) {
                        o.desc = t;
                        var a = mvcur.mvShown && e == mvcur.videoRaw && i == mvcur.mvShown;
                        if (a) {
                            mvcur.mvEditing = !1;
                            var r = ge("mv_descr_field");
                            val(r, t || '<span class="mv_desc_edit">' + getLang("video_edit_desc") + "</span>"), r.onmouseover = t ? videoview.descTT.pbind(r) :
                                function() {}, show(r), re("mv_edit_text_wrap")
                        }
                    },
                    progress: "mv_inline_edit_pr"
                })
            }
        },
        onExternalVideoEnded: function(e) {
            e = e || domPN(ge("video_player"));
            var i = getSize(e),
                o = (Videoview.getNextVideosData() || [])[0],
                t = !!window.CanvasRenderingContext2D,
                a = Videoview.getMvData();
            if (e && a && !ge("mv_external_finish")) {
                var r = a.liked,
                    d = a.added,
                    n = a.can_add,
                    v = a.subscribed,
                    s = "";
                if (o && i[0] >= 400 && i[1] >= 300) s =
                    '<div id="mv_finish_next" class="mv_finish_next" onclick="Videoview.onExternalVideoNext(true)">  <div class="mv_finish_next_caption">' + getLang(
                        "video_player_next_title") + '</div>  <div class="mv_finish_next_thumb" style="background-image: url(' + o.thumb +
                    ')"></div>  <div class="mv_finish_next_timer">    <canvas class="mv_finish_next_timer_canvas" width="100" height="100"></canvas>    <div class="mv_finish_next_timer_play mv_finish_icon"></div>  </div>  <div class="mv_finish_next_info">    <div class="mv_finish_next_title">' +
                    o.title + '</div>    <div class="mv_finish_next_views">' + o.views +
                    '</div>  </div>  <div class="mv_finish_next_cancel mv_finish_icon" onclick="Videoview.onExternalVideoNextCancel(event)"></div></div>    ';
                else if (!ge("video_yt")) return;
                var l = Videoview.getSuggestionsData(),
                    c = "onSuggestionClick";
                l && l.length || (l = Videoview.getNextVideosData(), c = "onVideoNext");
                var m = "";
                l && l.length && i[0] >= 580 && i[1] >= 300 && (m = '<div id="mv_finish_suggestions" class="mv_finish_suggestions ' + (s ? "hidden" : "") + '">', each(l,
                    function(e, i) {
                        m += '<a class="mv_finish_suggestions_item" onclick="videoCallback([\'' + c + "', '" + i.vid + '\']); return false;" href="//vk.com/video' + i.vid +
                            '" title="' + i.title + '">  <div class="mv_finish_suggestions_item_thumb" style="background-image: url(' + i.thumb +
                            ')"></div>  <div class="mv_finish_suggestions_item_title">' + i.title + '</div>  <div class="mv_finish_suggestions_item_views">' + i.views +
                            "</div></a>      "
                    }), m += "</div>");
                var u = !1,
                    _ = !1;
                if (!s && !m) {
                    if (a.nolikes) return;
                    i[0] > 250 && i[1] > 200 ? u = !0 : _ = !0
                }
                var p = window.mvcur && mvcur.minimized,
                    h = se(
                        '<div class="mv_external_finish" id="mv_external_finish" onclick="Videoview.onExternalVideoBgClick(this, event)">  <div class="mv_finish_header">    <div id="mv_finish_subscribe" class="fl_r mv_finish_subscribe ' +
                        (v ? "mv_finish_subscribed" : "") +
                        '">      <button id="mv_finish_subscribe_btn" class="mv_finish_subscribe_btn fl_l" onclick="Videoview.onExternalVideoSubscribe()">' + (v ? getLang(
                            "video_view_subscribed_msg") : getLang("video_view_subscribe_to_author")) + '</button>      <a href="' + a.authorHref +
                        '" target="_blank" class="fl_r"><img class="mv_finish_author_img" src="' + a.authorPhoto +
                        '"></a>    </div>    <div id="mv_finish_title" class="mv_finish_title" style="' + (p ? "display:none" : "") + '">' + a.title +
                        '</div>  </div>  <div id="mv_finish_actions" class="mv_finish_actions ' + (u ? "mv_finish_actions_extended" : "") + " " + (n ? "" :
                            "mv_finish_actions_cant_add") + " " + (_ ? "mv_finish_actions_no_content" : "") + '">    <div class="mv_finish_like ' + (r ? "selected" : "") +
                        '" onclick="Videoview.onExternalVideoLike()">      <div class="mv_finish_like_icon mv_finish_icon"></div>      <div class="mv_finish_liked_icon mv_finish_icon"></div>      <div class="mv_finish_like_text">' +
                        getLang("video_i_like") +
                        '</div>    </div>    <div class="mv_finish_share" onclick="Videoview.onExternalVideoShare()">      <div class="mv_finish_share_icon mv_finish_icon"></div>      <div class="mv_finish_share_text">' +
                        getLang("video_share_with_friends") + '</div>    </div>    <div class="mv_finish_add ' + (d ? "selected" : "") +
                        '" onclick="Videoview.onExternalVideoAdd()">      <div class="mv_finish_add_icon mv_finish_icon"></div>      <div class="mv_finish_added_icon mv_finish_icon"></div>    </div>  </div>  ' +
                        s + "  " + m + "</div>  ");
                a.canSubscribe || re(geByClass1("mv_finish_subscribe", h)), (a.noControls || a.nolikes) && re(geByClass1("mv_finish_actions", h)), e.appendChild(h), t && o &&
                    s && (mvcur.nextTimer = {
                            ctx: geByClass1("mv_finish_next_timer_canvas", h)
                                .getContext("2d"),
                            nextTimerReset: function() {
                                clearTimeout(mvcur.nextTimer.timeout), mvcur.nextTimer.ctx.clearRect(0, 0, 100, 100), mvcur.nextTimer.started = null
                            },
                            nextTimerStart: function() {
                                mvcur.nextTimer.started || (mvcur.nextTimer.started = (new Date)
                                    .getTime(), Videoview.onExternalVideoTimer())
                            }
                        }, mvcur.nextTimer.ctx.lineWidth = 6, mvcur.nextTimer.ctx.lineCap = "round", mvcur.nextTimer.ctx.strokeStyle = "#fff", mvcur.nextTimerStopped || mvcur.nextTimer
                        .nextTimerStart())
            }
        },
        onExternalVideoTimer: function() {
            if (window.mvcur && mvcur.nextTimer && mvcur.nextTimer.ctx && mvcur.nextTimer.started) {
                var e = Math.min(1, Math.max(0, ((new Date)
                        .getTime() - mvcur.nextTimer.started) / 1e4)),
                    i = mvcur.nextTimer.ctx;
                i.clearRect(0, 0, 100, 100), i.beginPath(), i.arc(50, 50, 47, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * e), i.stroke(), 1 > e ? mvcur.nextTimer.timeout =
                    setTimeout(Videoview.onExternalVideoTimer, 20) : Videoview.onExternalVideoNext()
            }
        },
        onExternalVideoNext: function(e) {
            mvcur.nextTimer = null, re("mv_external_finish"), VideoPlaylist.nextVideo(), Videoview.sendPlayerStats(e ? 6 : 5, 4)
        },
        onExternalVideoNextCancel: function(e) {
            e && e.stopPropagation(), clearTimeout(mvcur.nextTimer.timeout), mvcur.nextTimer = null, ge("video_yt") ? (re("mv_finish_next"), removeClass(
                "mv_finish_suggestions", "hidden")) : re("mv_external_finish")
        },
        onExternalVideoBgClick: function(e, i) {
            i.target === e && re("mv_external_finish")
        },
        onExternalVideoLike: function() {
            videoCallback(["onLike", 4]);
            var e = Videoview.getPlayerObject();
            e.onLiked && e.onLiked()
        },
        onExternalVideoShare: function() {
            if (Videoview.isFS) {
                var e = Videoview.getPlayerObject();
                e && e.toggleFullscreen && e.toggleFullscreen()
            }
            videoCallback(["onShare", 4])
        },
        onExternalVideoAdd: function() {
            var e = Videoview.getMvData();
            if (e) {
                e.added ? videoCallback(["onRemove"]) : videoCallback(["onAdd", e.videoRaw, e.add_hash, 4]);
                var i = Videoview.getPlayerObject();
                i.onAdded && i.onAdded()
            }
        },
        onExternalVideoSubscribe: function() {
            var e = Videoview.getMvData();
            if (e) {
                var i = !e.subscribed,
                    o = e.isClosed;
                Videoview.subscribeToAuthor(null, null, e.oid, e.subscribeHash, i, o, !1, "external_player"), Videoview.sendPlayerStats(i ? 9 : 10, 4)
            }
        },
        updateExternalVideoFinishBlock: function() {
            var e = ge("mv_external_finish");
            if (e) {
                var i = getSize(e);
                (isVisible("mv_finish_next") && (i[0] < 400 || i[1] < 300) || isVisible("mv_finish_suggestions") && (i[0] < 580 || i[1] < 300) || hasClass("mv_finish_actions",
                    "mv_finish_actions_extended") && (i[0] < 250 || i[1] < 200)) && (mvcur.nextTimer && Videoview.onExternalVideoNextCancel(), re("mv_finish_next"), re(
                    "mv_finish_suggestions"), removeClass("mv_finish_actions", "mv_finish_actions_extended"), addClass("mv_finish_actions", "mv_finish_actions_no_content")),
                toggle("mv_finish_title", !(window.mvcur && mvcur.minimized)), toggleClass("mv_finish_subscribe", "mv_finish_subscribe_min", i[0] < 500)
            }
        },
        removeExternalVideoFinishBlock: function() {
            window.mvcur && mvcur.nextTimer && Videoview.onExternalVideoNextCancel(), re("mv_external_finish")
        }
    },
    videoview = Videoview,
    VideoPlaylist = {
        VIDEOS_LIMIT: 100,
        lists: {},
        blockTpl: '<div class="video_plb_wrap" id="video_mvpl" onmouseenter="VideoPlaylist.toggleHeaderButtons(this, true)" onmouseleave="VideoPlaylist.toggleHeaderButtons(this, false)">  <div class="video_plb_header clear_fix">    <div class="video_plb_header_buttons unshown">      <div id="mv_pl_autoplay" class="video_plb_header_btn %autoplayBtnClass%" onmouseover="VideoPlaylist.showAutoplayTooltip(this);" onclick="VideoPlaylist.toggleAutoplay(this)"><div class="video_plb_header_autoplay_icon"></div></div>      <div id="mv_pl_reverse" class="video_plb_header_btn _opaque" onmouseover="VideoPlaylist.showReverseTooltip(this);" onclick="VideoPlaylist.toggleReverse(this)"><div class="video_plb_header_reverse_icon"></div></div>    </div>    <div class="video_plb_header_title">%title%</div>  </div>  <div class="video_plb_list">    <div class="video_plb_list_cont">      %items%    </div>  </div></div>  ',
        blockItemTpl: '<a class="video_plb_video %itemClass%" onclick="return VideoPlaylist.showVideo(\'%vid%\');" data-vid="%vid%" href="/video%vid%">  <div class="video_plb_v_thumb" style="background-image: url(\'%thumb%\');">    <div class="video_plb_v_duration video_plb_v_duration">%duration%</div>  </div>  <div class="video_plb_v_info">    <div class="video_plb_v_title">%title%</div>    <div class="video_plb_v_views">%views%</div>  </div></a>  ',
        toggleHeaderButtons: function(e, i) {
            toggleClass(domByClass(e, "video_plb_header_buttons"), "unshown", !i)
        },
        showReverseTooltip: function(e) {
            showTooltip(e, {
                text: getLang("video_playlist_reverse_tt"),
                shift: [7, 7, 0],
                showdt: 0,
                black: 1
            })
        },
        showAutoplayTooltip: function(e) {
            var i = VideoPlaylist.isAutoplayEnabled(),
                o = "video_playlist_autoplay_" + (i ? "disable" : "enable") + "_tt",
                t = getLang(o);
            showTooltip(e, {
                text: t,
                shift: [7, 7, 0],
                showdt: 0,
                black: 1
            })
        },
        toggleAutoplay: function(e) {
            var i = !!ls.get("mv_pl_autoplay_disabled");
            toggleClass(e, "_active", i), i ? ls.remove("mv_pl_autoplay_disabled") : ls.set("mv_pl_autoplay_disabled", "1"), tooltips.destroy(e), VideoPlaylist.showAutoplayTooltip(
                e)
        },
        isAutoplayEnabled: function() {
            return !ls.get("mv_pl_autoplay_disabled")
        },
        toggleReverse: function(e) {
            var i = VideoPlaylist.getCurList();
            i && (i.reversed = !i.reversed, toggleClass(e, "_active", i.reversed), VideoPlaylist.updateBlockList(i.id))
        },
        buildBlock: function(e, i, o) {
            var t = VideoPlaylist.getBlock(),
                a = t ? data(t, "playlist") : !1;
            if (a && a.id == e && !o) return t;
            VideoPlaylist.removeBlock();
            var a = VideoPlaylist.getList(e, i);
            if (!a || a.list.length <= 1) return !1;
            var r = trim(VideoPlaylist.blockTpl),
                d = VideoPlaylist.buildBlockList(a),
                n = se(rs(r, {
                    items: d,
                    title: a.title || "",
                    autoplayBtnClass: VideoPlaylist.isAutoplayEnabled() ? "_active" : ""
                }));
            return data(n, "playlist", a), this._block = n, n
        },
        buildBlockList: function(e) {
            for (var i = trim(VideoPlaylist.blockItemTpl), o = "", t = e.reversed ? e.list.length - 1 : 0, a = function(i) {
                    return e.reversed ? i >= 0 : i < e.list.length
                }, r = function(i) {
                    return e.reversed ? --i : ++i
                }, d = t; a(d); d = r(d)) {
                var n, v = e.list[d];
                if (isArray(v)) {
                    var s = v[VideoConstants.VIDEO_ITEM_INDEX_OWNER_ID] + "_" + v[VideoConstants.VIDEO_ITEM_INDEX_ID];
                    n = {
                        vid: s,
                        thumb: v[VideoConstants.VIDEO_ITEM_INDEX_THUMB],
                        title: v[VideoConstants.VIDEO_ITEM_INDEX_TITLE],
                        duration: v[VideoConstants.VIDEO_ITEM_INDEX_DURATION],
                        views: getLang("video_N_views_list", v[VideoConstants.VIDEO_ITEM_INDEX_VIEWS] || 1, !0),
                        itemClass: s == e.current ? "video_plb_active" : ""
                    }
                } else n = extend({}, v, {
                    itemClass: v.vid == e.current ? "video_plb_active" : ""
                });
                o += rs(i, n)
            }
            return o
        },
        updateBlockList: function(e) {
            var i = VideoPlaylist.getCurList();
            if (i && i.id == e) {
                var o = VideoPlaylist.getBlock(),
                    t = geByClass1("video_plb_list_cont", o),
                    a = VideoPlaylist.buildBlockList(i);
                val(t, a);
                var r = data(o, "sb");
                r && r.update(), VideoPlaylist.setCurVideo(i.current), VideoPlaylist.updateControls()
            }
        },
        getBlock: function() {
            return this._block
        },
        removeBlock: function() {
            var e = data(this._block, "sb");
            e && e.destroy(), re(this._block), removeData(this._block), this._block = null, VideoPlaylist.toggleStateClasses()
        },
        setCurVideo: function(e, i) {
            function o() {
                var e = VideoPlaylist.getBlock();
                if (e) {
                    var i = data(e, "sb");
                    i && i.update()
                }
            }
            var t = VideoPlaylist.getBlock();
            if (t) {
                var a = data(t, "playlist");
                if (a) {
                    var r = !1;
                    if (each(geByClass("video_plb_video", t), function() {
                            var i = this.getAttribute("data-vid");
                            if (e) i == e && (r = this), toggleClass(this, "video_plb_active", i == e);
                            else if (hasClass(this, "video_plb_active")) return r = this, !1
                        }), r) {
                        e && (a.current = e);
                        var d = geByClass1("video_plb_list", t),
                            n = getXY(r)[1],
                            v = getSize(r)[1],
                            s = getXY(d)[1],
                            l = getSize(d)[1],
                            c = n - s;
                        if (0 > c || c + v > l) {
                            var m = d.scrollTop + n - s - l / 2 + v / 2;
                            d.scrollTop != m && (i ? animate(d, {
                                scrollTop: m,
                                transition: Fx.Transitions.easeOutCubic
                            }, 450, o) : (d.scrollTop = m, o()))
                        }
                        VideoPlaylist._queueNextVideo(e)
                    }
                }
            }
        },
        getList: function(e, i) {
            if (this.lists[e]) return this.lists[e];
            var o = /^wall_-?\d+$/;
            if (postPlaylistRE = /^post_-?\d+_\d+$/, catPlaylistRE = /^cat_(\d|[\w_])+$/, ownerPlaylistRE = /^-?\d+_-?\d+$/, o.test(e)) return cur.wallVideos && cur.wallVideos[
                e] && this.uniqList(cur.wallVideos[e]);
            if (postPlaylistRE.test(e)) return cur.pageVideosList && cur.pageVideosList[e];
            if (catPlaylistRE.test(e)) return cur.catVideosList && cur.catVideosList[e];
            if (ownerPlaylistRE.test(e)) {
                var t, a, r, d = e.split("_"),
                    n = d[0],
                    v = d[1];
                if (-2 == v ? (t = "all", a = cur.playlistAddedTitle) : -1 == v ? (t = "uploaded", a = cur.playlistUploadedTitle) : (t = "album_" + v, a = cur.playlistTitle),
                    each([cur.silentLoaded, cur.pageVideosList], function(e, i) {
                        return i && i[n] && i[n][t] ? (r = i[n][t], !1) : void 0
                    }), r) {
                    var s;
                    if (i)
                        for (s = r.length; --s;) {
                            var l = r[s];
                            if (l[0] + "_" + l[1] == i) break
                        } else s = 0;
                    var c = positive(s - VideoPlaylist.VIDEOS_LIMIT / 2),
                        m = c + VideoPlaylist.VIDEOS_LIMIT;
                    return r = r.slice(c, m), {
                        id: e,
                        title: a,
                        list: r
                    }
                }
            }
        },
        getCurList: function() {
            var e = VideoPlaylist.getBlock();
            return e ? data(e, "playlist") : void 0
        },
        getCurListId: function() {
            var e = VideoPlaylist.getCurList();
            return e ? e.id : void 0
        },
        addList: function(e) {
            this.lists[e.id] = e
        },
        extendList: function(e, i) {
            if (!this.lists[e]) return !1;
            for (var o = this.lists[e].list, t = [], a = {}, r = 0, d = 0;;)
                if (o[r] && i[d] && o[r].vid == i[d].vid) a[o[r].vid] || (t.push(o[r]), a[o[r].vid] = 1), ++r, ++d;
                else if (o[r]) a[o[r].vid] || (t.push(o[r]), a[o[r].vid] = 1), ++r;
            else {
                if (!i[d]) break;
                a[i[d].vid] || (t.push(i[d]), a[i[d].vid] = 1), ++d
            }
            return this.lists[e].list = t, this.lists[e]
        },
        uniqList: function(e) {
            for (var i, o = {}, t = 0; i = e.list[t]; ++t) o[i.vid] ? e.list.splice(t, 1) : o[i.vid] = !0;
            return e
        },
        isCollapsed: function() {
            var e = VideoPlaylist.getBlock();
            return !(!e || !data(e, "collapsed"))
        },
        toggle: function(e, i) {
            if (isUndefined(e) && (e = VideoPlaylist.isCollapsed()), !mvcur.minimized || !e) {
                var o = VideoPlaylist.getBlock();
                if (o && VideoPlaylist.isCollapsed() != !e) return data(o, "collapsed", !e), VideoPlaylist.toggleStateClasses(), Videoview.updateReplyFormPos(), e && (
                    VideoPlaylist.updateScrollbar(), VideoPlaylist.setCurVideo()), !1
            }
        },
        toggleStateClasses: function() {
            var e = VideoPlaylist.getBlock(),
                i = window.mvcur && mvcur.minimized;
            e && !i ? (addClass("mv_container", "mv_container_has_pl"), toggleClass("mv_container", "mv_container_hide_pl", VideoPlaylist.isCollapsed())) : (removeClass(
                "mv_container", "mv_container_has_pl"), removeClass("mv_container", "mv_container_hide_pl"))
        },
        updateScrollbar: function() {
            var e = VideoPlaylist.getBlock();
            if (e) {
                var i = data(e, "sb");
                if (i) i.update(!0, !0);
                else {
                    var o = geByClass1("video_plb_list", e),
                        i = new Scrollbar(o, {
                            prefix: "mv_pl_",
                            nokeys: !0,
                            padding: 0
                        });
                    data(e, "sb", i)
                }
            }
        },
        updateControls: function() {
            var e = VideoPlaylist.getCurList();
            if (e) {
                var i = VideoPlaylist.getVideoIndex();
                e.reversed && (i = e.list.length - i - 1), toggle("mv_pl_prev", i > 0), toggle("mv_pl_next", i < e.list.length - 1)
            }
        },
        showVideo: function(e) {
            var i = VideoPlaylist.getCurList();
            if (i) {
                if (VideoPlaylist.saveScrollPos(), mvcur.options.params && "direct" == mvcur.options.params.module && mvcur.mvPrevLoc && Videoview.backLocation(), i.loaded &&
                    i.loaded.vid == e) {
                    var o = i.loaded;
                    Videoview.show(null, e, o.listId, extend(o.options, {
                        playlistId: i.id
                    })), Videoview.showVideo.apply(videoview, o.hubData);
                    var t = mvcur.preloadStatsHashes ? mvcur.preloadStatsHashes[e] : "";
                    t && ajax.post("/al_video.php", {
                        act: "a_inc_preload_stats",
                        stat_preload_hash: t
                    }), i.loaded = !1
                } else {
                    var a = VideoPlaylist.getVideoIndex(e),
                        r = i.reversed ? i.list.length - a : a,
                        d = r < i.list.length - 1 ? 1 : 0,
                        n = i.list[a][11];
                    showVideo(e, n, {
                        autoplay: 1,
                        playlistId: i.id,
                        addParams: {
                            force_no_repeat: 1,
                            show_next: d
                        },
                        module: Videoview.getVideoModule()
                    })
                }
                return !1
            }
        },
        saveScrollPos: function() {
            var e = VideoPlaylist.getBlock(),
                i = domByClass(e, "video_plb_list");
            data(e, "savedScrollTop", i.scrollTop)
        },
        restoreScrollPos: function() {
            var e = VideoPlaylist.getBlock(),
                i = domByClass(e, "video_plb_list"),
                o = data(e, "savedScrollTop");
            o && (i.scrollTop = o)
        },
        _queueNextVideo: function(e) {
            var i = VideoPlaylist.getCurList();
            if (i) {
                e = e || i.current;
                var o = VideoPlaylist._getNextVideoIndex(e);
                if (-1 != o) {
                    var t = i.list[o],
                        a = isArray(t) ? t[0] + "_" + t[1] : t.vid,
                        r = isArray(t) ? "" : t.hash;
                    if (i.queued != a && (!i.loaded || i.loaded.vid != a)) {
                        i.loaded = !1, i.queued = a;
                        var d = o < i.list.length - 1 ? 1 : 0;
                        showVideo(a, r, {
                            hidden: function(e, o, t, a) {
                                i.queued == a && (i.loaded = {
                                    vid: a,
                                    hubData: e,
                                    options: o,
                                    listId: t
                                }), i.queued = !1
                            },
                            module: Videoview.getVideoModule(a),
                            addParams: {
                                autoplay: 1,
                                force_no_repeat: 1,
                                preload: 1,
                                show_next: d,
                                playlist_id: i.id
                            }
                        })
                    }
                }
            }
        },
        getNextVideos: function() {
            var e = [];
            if (!(VideoPlaylist.isAutoplayEnabled() || window.mvcur && mvcur.player)) return e;
            var i = VideoPlaylist.getCurList(),
                o = VideoPlaylist._getNextVideoIndex();
            if (!i || 0 > o) return e;
            for (; e.length < 3 && o >= 0 && o < i.list.length;) {
                var t, a = i.list[o];
                t = isArray(a) ? {
                    vid: a[VideoConstants.VIDEO_ITEM_INDEX_OWNER_ID] + "_" + a[VideoConstants.VIDEO_ITEM_INDEX_ID],
                    thumb: a[VideoConstants.VIDEO_ITEM_INDEX_THUMB],
                    views: getLang("video_N_views_list", a[VideoConstants.VIDEO_ITEM_INDEX_VIEWS], !0),
                    title: a[VideoConstants.VIDEO_ITEM_INDEX_TITLE],
                    duration: a[VideoConstants.VIDEO_ITEM_INDEX_DURATION]
                } : a, e.push(t), o += i.reversed ? -1 : 1
            }
            return e
        },
        prevVideo: function() {
            var e = VideoPlaylist.getCurList();
            if (e) {
                var i = VideoPlaylist.getVideoIndex() + (e.reversed ? 1 : -1);
                if (!(0 > i)) {
                    var o = e.list[i],
                        t = isArray(o) ? o[0] + "_" + o[1] : o.vid;
                    VideoPlaylist.showVideo(t)
                }
            }
        },
        nextVideo: function() {
            var e = VideoPlaylist.getCurList();
            if (e) {
                var i = VideoPlaylist._getNextVideoIndex();
                if (!(0 > i)) {
                    var o = e.list[i],
                        t = isArray(o) ? o[0] + "_" + o[1] : o.vid;
                    VideoPlaylist.showVideo(t)
                }
            }
        },
        getVideoIndex: function(e) {
            var i = VideoPlaylist.getCurList();
            if (!i) return -1;
            if (e || (e = i.current), !e) return -1;
            var o = -1;
            return each(i.list, function(i, t) {
                var a = isArray(t) ? t[0] + "_" + t[1] : t.vid;
                return a == e ? (o = i, !1) : void 0
            }), o
        },
        _getNextVideoIndex: function(e) {
            var i = VideoPlaylist.getCurList();
            if (!i) return -1;
            var o = VideoPlaylist.getVideoIndex(e);
            if (0 > o) return 0;
            var t = o + (i.reversed ? -1 : 1);
            return t >= 0 && t < i.list.length ? t : -1
        }
    };
try {
    stManager.done("videoview.js")
} catch (e) {}