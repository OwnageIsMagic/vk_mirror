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
            incViewCounter: function(e, i, t, o, a, d, r) {
                var n = {
                    act: "inc_view_counter",
                    oid: e,
                    vid: i,
                    hash: t,
                    curr_res: o,
                    max_res: a,
                    player: d || "flash",
                    type: r,
                    module: Videoview.getVideoModule(e + "_" + i)
                };
                if (cur.videoSearchStats) {
                    var s = parseInt(cur.videoSearchPos);
                    isNaN(s) || (n.search_pos = s, cur.videoSearchStats.positions[s] = extend({
                        viewStarted: 0
                    }, cur.videoSearchStats.positions[s]), cur.videoSearchStats.positions[s].viewStarted++), cur.videoSearchStats.totalViews++
                }
                ajax.post("al_video.php", n)
            },
            rotateVideo: function(e, i, t, o) {
                ajax.post("al_video.php", {
                    act: "rotate_video",
                    oid: e,
                    vid: i,
                    angle: t,
                    hash: o
                })
            },
            scoreCardCounter: function() {},
            onVideoNext: function(e, i, t) {
                setTimeout(function() {
                    var o = 0;
                    i || e ? i && t ? o = 5 : i && !t ? o = 6 : e && (o = 7) : o = 4, Videoview.sendPlayerStats(o, 0), e && !i ? VideoPlaylist.showVideo(e) :
                        VideoPlaylist.nextVideo()
                }, 0)
            },
            setSuggestions: function(e) {
                var i = Videoview.getMvData(),
                    t = i.videoRaw;
                ajax.post("/al_video.php", {
                    act: "fetch_player_suggestions",
                    videos: e
                }, {
                    onDone: function(e) {
                        var i = Videoview.getMvData();
                        i && i.videoRaw == t && (i.playerSuggestions = e)
                    }
                })
            },
            onSuggestionsShown: function(e, i, t) {
                var o = t ? 16 : e ? 14 : 12;
                if (Videoview.sendPlayerStats(o, 0), e) {
                    var a = "",
                        d = Videoview.getMvData();
                    each(d.playerSuggestions, function(e, t) {
                            t.vid != i && (a += "&vid=" + t.vid)
                        }), vkImage()
                        .src = "//go.imgsmail.ru/vk?pxn=vs&qid=" + e + a
                }
            },
            onSuggestionClick: function(e, i, t, o, a) {
                var d = a ? 15 : i ? 13 : 11;
                Videoview.sendPlayerStats(d, 0), showVideo(e, "", {
                    autoplay: 1,
                    module: Videoview.getVideoModule(e),
                    addParams: {
                        suggestions_qid: i
                    }
                }), i && (vkImage()
                    .src = "//go.imgsmail.ru/vk?pxn=vic&qid=" + i + "&vid=" + e + "&p=" + t + "&t=" + o)
            },
            onSuggestionQuarterWatched: function(e, i, t) {
                vkImage()
                    .src = "//go.imgsmail.ru/vk?pxn=vt25&qid=" + e + "&vid=" + i + "&t=" + t
            },
            onSuggestionsReplayClicked: function() {
                Videoview.sendPlayerStats(17, 0)
            },
            onOpenInPopup: function(e, i, t) {
                Videoview.sendPlayerStats(8, 0), showVideo(e, i, {
                    autoplay: 1,
                    queue: 1,
                    addParams: {
                        t: t
                    }
                })
            },
            onExpandInline: function(e, i, t) {
                Videoview.sendPlayerStats(8, 0), showVideo(e, i, {
                    queue: 1,
                    expandPlayer: t
                })
            },
            onVideoAdEvent: function(e, i, t, o, a, d, r) {
                if (t) {
                    cur._vadStatQueue = cur._vadStatQueue || {}, cur._vadStatQueue[e + "_" + i] = cur._vadStatQueue[e + "_" + i] || {
                        type: "",
                        events: []
                    };
                    var n = cur._vadStatQueue[e + "_" + i];
                    n.type = a, n.events.push(o), n.pl_type = r, clearTimeout(cur._vadStatTimer), cur._vadStatTimer = setTimeout(Videoview.sendVideoAdStat.bind(Videoview, e, i,
                        t), 1e3)
                }
            },
            onVideoAdShown: function(e, i, t, o) {
                ajax.post("al_video.php", {
                    act: "ad_event",
                    oid: e,
                    vid: i,
                    type: t,
                    event: o
                })
            },
            onVideoResolutionChanged: function(e, i, t, o) {
                window.mvcur && mvcur.mvData && (mvcur.mvData.resolution = o)
            },
            onInitialized: function() {
                window.mvcur && mvcur.mvShown ? (VideoPlaylist.toggle(!VideoPlaylist.isCollapsed()), mvcur.options.focusPlay && ("visible" == document.visibilityState ?
                    Videoview.togglePlay(!0) : "hidden" == document.visibilityState && addEvent(window, "focus", function i() {
                        Videoview.togglePlay(!0), removeEvent(window, "focus", i)
                    }))) : cur.pinnedVideoInitHandlers && cur.pinnedVideoInitHandlers();
                var e = window.mvcur && mvcur.player && mvcur.player.el || ge("video_player");
                e && e.focus()
            },
            onVideoPlayProgress: function(e, i, t, o, a) {
                var d = e + "_" + i;
                5e3 > o && cur.tnsStart != d ? (this.playerCallback.scoreCardCounter(), cur.tnsStart = d) : o > a / 2 && cur.tnsEnd != d && (cur.tnsEnd = d), window.mvcur &&
                    mvcur.adData && (mvcur.adData.stat_link_start && !mvcur.adData.view_complete_start && o >= 5e3 && (ajax.post(mvcur.adData.stat_link_start, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_start = !0), mvcur.adData.stat_link_half && !mvcur.adData.view_complete_half && o >= a / 2 && (ajax.post(mvcur.adData.stat_link_half, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_half = !0), mvcur.adData.stat_link_full && !mvcur.adData.view_complete_full && o >= .9 * a && (ajax.post(mvcur.adData.stat_link_full, {}, {
                        onDone: function() {},
                        onFail: function() {
                            return !0
                        }
                    }), mvcur.adData.view_complete_full = !0))
            },
            onVideoStreamPlaying: function(e, i) {
                var t = window.mvcur && mvcur.player || cur.videoInlinePlayer || ge("video_player");
                if (t && (t.isFromAutoplay && t.isFromAutoplay() || e + "_" + i == cur.pinnedVideo)) {
                    if (!t.isTouchedByUser || !t.isTouchedByUser()) return;
                    cur.pinnedVideoDestroyHandlers && cur.pinnedVideoDestroyHandlers()
                }
                window.Notifier && setTimeout(function() {
                    Notifier.lcSend("video_start")
                }, 0), window.ap && ap.isPlaying() && (ap.pause(), ap.pausedByVideo = 1), window.mvcur && mvcur.mvData && !i && !e && (mvcur.mvData.randomNumber = Math.round(
                    1e9 * Math.random()))
            },
            onVideoPlayStarted: function(e, i, t) {
                var o = Videoview.getVideoModule(e + "_" + i),
                    a = "";
                if (window.Video && Video.isInCatalog()) {
                    var d = VideoPlaylist.getCurListId();
                    d = d.replace("cat_", ""), a = Videocat.isTop3Playlist(d) ? "featured" : d
                }
                var r;
                r = cur.mvOpts && cur.mvOpts.inline || window.mvcur && mvcur.mvData && mvcur.mvData.inline ? "inline" : window.mvcur && window.mvcur.options && window.mvcur.options
                    .playlistId ? "layer_with_playlist" : "layer", window.mvcur && mvcur.mvData && (mvcur.viewStartedTimestamp = (new Date)
                        .getTime());
                var n = ajax.post("al_video.php", {
                    act: "video_view_started",
                    oid: e,
                    vid: i,
                    hash: t,
                    quality: window.mvcur ? mvcur.mvData.resolution : 0,
                    module: o,
                    videocat: a,
                    inline: -1,
                    player_view_type: r
                }, {
                    onDone: function(e) {}
                });
                if (void 0 !== n) {
                    window.mvcur && (vkImage()
                        .src = locProtocol + "//www.tns-counter.ru/V13a****pladform_ru/ru/CP1251/tmsec=pladform_videovk-playerstart/" + this.playerCallback.randomNumber());
                    var s = 0;
                    switch (cur.mvOpts ? s = cur.mvOpts.l_type : window.mvcur && (s = mvcur.mvData.l_type), s) {
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
                cur.pinnedVideoDestroy && cur.pinnedVideoDestroy(), window.mvcur && mvcur.mvShown && (mvcur.finished = !0, mvcur.mousemoved = !0, Videoview.moveCheck(),
                    Videoview.logViewedPercentage(), mvcur.adData ? (mvcur.adData.stat_link_start && !mvcur.adData.view_complete_start && (ajax.post(mvcur.adData.stat_link_start, {}, {
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
            onVideoAdsLoadStarted: function() {
                vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****vk_com/ru/CP1251/tmsec=vk_videoload-license/" + this.playerCallback.randomNumber()
            },
            onVideoAdsPlayStarted: function() {
                vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****vk_com/ru/CP1251/tmsec=vk_videostart-license/" + this.playerCallback.randomNumber()
            },
            onVideoAdsPlayFinished: function() {
                vkImage()
                    .src = locProtocol + "//www.tns-counter.ru/V13a****vk_com/ru/CP1251/tmsec=vk_videoend-license/" + this.playerCallback.randomNumber()
            },
            onViewSegmentsChanged: function(e, i, t, o) {
                if (t && !cur.segmentsSaveProcess) {
                    var a = "vsegs" + vk.id + "_" + e + "_" + i,
                        d = ls.get(a);
                    d && d.ts && (new Date)
                        .getTime() - d.ts > 864e5 && (d = null, ls.remove(a));
                    var r = d && d.segments ? d.segments.split("|")[2] : "";
                    if (!d || !r || t != r) {
                        cur.segmentsSaveProcess = !0;
                        var n = {
                                act: "a_view_segments",
                                module: Videoview.getVideoModule(e + "_" + i),
                                vid: i,
                                oid: e,
                                s: t,
                                prev_s: d ? d.segments : "",
                                prev_sig: d ? d.segmentsSig : "",
                                hash: o
                            },
                            s = parseInt(cur.videoSearchPos);
                        if (isNaN(s) || (n.search_pos = s), ajax.post("/al_video.php", n, {
                                onDone: function(e, i, t) {
                                    if (!(0 > e)) {
                                        e && ls.set(a, {
                                            segments: e,
                                            segmentsSig: i,
                                            ts: (new Date)
                                                .getTime()
                                        }), cur.segmentsSaveProcess = !1, t = parseInt(t) || 0;
                                        var o = parseInt(cur.videoSearchPos);
                                        t > 0 && !isNaN(o) && cur.videoSearchStats && (cur.videoSearchStats.positions[o] = extend({
                                            viewedParts: 0
                                        }, cur.videoSearchStats.positions[o]), cur.videoSearchStats.positions[o].viewedParts++)
                                    }
                                }
                            }), cur.videoSearchStats && (cur.videoSearchStats.totalViewedTime || (cur.videoSearchStats.totalViewedTime = 0), cur.videoSearchStats.totalViewedTime +=
                                mvcur.mvData.vsegsSize, !isNaN(s))) {
                            cur.videoSearchStats.positions[s] = extend({
                                viewedSeconds: 0
                            }, cur.videoSearchStats.positions[s]);
                            var v = cur.videoSearchStats.positions[s].viewedSeconds;
                            v = Math.min(mvcur.mvData.duration, v + mvcur.mvData.vsegsSize), cur.videoSearchStats.positions[s].viewedSeconds = v
                        }
                    }
                }
            },
            onLike: function(e) {
                Videoview.like(null, !0), Videoview.sendPlayerStats(1, e)
            },
            onAdd: function(e, i, t) {
                Videoview.addSmall(e, i), Videoview.sendPlayerStats(3, t)
            },
            onRemove: function() {
                Videoview.removeVideo()
            },
            onShare: function(e) {
                Videoview.share(), Videoview.sendPlayerStats(2, e)
            },
            onSubscribe: function(e, i, t, o) {
                var a = Videoview.getMvData(),
                    d = a.isClosedGroup || !1;
                Videoview.subscribeToAuthor(null, null, e, i, t, d, !0, "player"), Videoview.sendPlayerStats(t ? 9 : 10, o)
            },
            onLiveViewersCountChange: function(e, i) {
                window.mvcur && mvcur.mvShown && mvcur.videoRaw == e && Videoview.updateLiveViewersCount(i)
            }
        },
        cleanUpStoredVSegs: function() {
            if (window.localStorage) {
                var e = vkNow();
                for (var i in window.localStorage)
                    if (0 === i.indexOf("vsegs")) {
                        var t = localStorage.getItem(i);
                        t = JSON.parse(t), e - t.ts > 1728e5 && localStorage.removeItem(i)
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
            return e && e.playerSuggestions || []
        },
        getMvData: function() {
            return cur.mvOpts || window.mvcur && mvcur.mvData
        },
        getPlayerObject: function() {
            return window.mvcur && mvcur.player || cur.videoInlinePlayer || ge("video_yt") && window.VideoYoutube || ge("video_player") || window.html5video || null
        },
        getPlayerObjectEl: function() {
            return ge("video_player") || ge("html5_player") || geByClass1("extra_player") || null
        },
        playerOnAdded: function() {
            var e = Videoview.getPlayerObject();
            e && e.onAdded && e.onAdded()
        },
        playerOnLiked: function() {
            var e = Videoview.getPlayerObject();
            e && e.onLiked && e.onLiked()
        },
        playerOnResize: function() {
            mvcur.player && mvcur.player.resize(), ge("html5_player") && window.html5video && html5video.onResize(), ge("video_yt") && window.VideoYoutube && VideoYoutube.onResize()
        },
        playerNextTimerUpdate: function() {
            var e;
            mvcur.scrolledAway || mvcur.replyFormShown || "visible" != document.visibilityState || curBox() ? (e = "nextTimerReset", mvcur.nextTimerStopped = !0) : (e =
                "nextTimerStart", mvcur.nextTimerStopped = !1), mvcur.playerPrevTimerFunc != e && (mvcur.playerPrevTimerFunc = e, clearTimeout(mvcur.playerTimerDebounce),
                mvcur.playerTimerDebounce = setTimeout(function() {
                    var i = Videoview.getPlayerObject();
                    i && i[e] && i[e](), mvcur.nextTimer && mvcur.nextTimer[e] && mvcur.nextTimer[e]()
                }, 0))
        },
        togglePlay: function(e) {
            if (ge("video_yt") && window.VideoYoutube) VideoYoutube.togglePlay(e);
            else if (window.mvcur && mvcur.player) mvcur.player.togglePlay(e);
            else if (cur.videoInlinePlayer) cur.videoInlinePlayer.togglePlay(e);
            else {
                var i = ge("video_player") || window.html5video;
                i && i === window.html5video ? i.playVideo(e, !0) : i && i.playVideo && i && i.playVideo(e)
            }
        },
        sendVideoAdStat: function(e, i, t) {
            if (cur._vadStatQueue && cur._vadStatQueue[e + "_" + i]) {
                var o = cur._vadStatQueue[e + "_" + i],
                    a = "undefined" != typeof cur.vSearchPos && null !== cur.vSearchPos;
                o.events.length && (ajax.post("al_video.php", {
                    act: "ads_stat",
                    ev: o.events.join(","),
                    ad_type: o.type,
                    hash: t,
                    oid: e,
                    vid: i,
                    err: o.err,
                    pl_type: o.pl_type,
                    from_search: a
                }), o.events = [])
            }
        },
        subscribeToAuthor: function(e, i, t, o, a, d, r, n) {
            function s() {
                toggleClass(ge("mv_subscribe_btn_wrap"), "mv_state_subscribed", a), toggleClass(ge("mv_subscribed_msg"), "mv_state_subscribed", a), ajax.post("al_video.php", {
                    act: "a_subscribe",
                    gid: t,
                    hash: o,
                    unsubscribe: intval(!a),
                    from: n
                });
                var e = Videoview.getMvData();
                if (e.subscribed = a, !r) {
                    var i = Videoview.getPlayerObject();
                    i && i.onSubscribed && i.onSubscribed()
                }
                var d = ge("mv_finish_subscribe_btn");
                d && (d.innerHTML = a ? getLang("video_view_subscribed_msg") : getLang("video_view_subscribe_to_author"), toggleClass("mv_finish_subscribe",
                    "mv_finish_subscribed", a))
            }
            if (o)
                if (!a && d) {
                    var v = showFastBox({
                        title: getLang("video_leave_closed_group_title"),
                        bodyStyle: "padding: 20px; line-height: 160%;",
                        dark: 1,
                        forceNoBtn: 1
                    }, getLang("video_leave_closed_group_text"), getLang("box_yes"), function() {
                        v.hide(), s()
                    }, getLang("box_no"));
                    Videoview.playerNextTimerUpdate()
                } else s()
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
        updateVideo: function(e, i, t, o) {
            window.mvcur && mvcur.mvData.oid == e && mvcur.mvData.vid == i && (mvcur.mvData.title = t, mvcur.mvData.desc = o, Videoview.setTitle(), Videoview.setDesc())
        },
        setAddButtonStateAdded: function() {
            window.mvcur && mvcur.mvShown && (mvcur.mvData.published = !0, triggerEvent("mv_add_button", "setAdded"))
        },
        initAddButton: function() {
            function e(e) {
                mvcur.addButtonTT = mvcur.addButtonTT || new ElementTooltip(n, {
                    elClassWhenTooltip: "mv_no_active",
                    onFirstTimeShow: function(i) {
                        var t = '<div id="mv_pl_tt">' + (r ? '<div class="mv_tt_private_only">' + getLang("video_only_private_video") + "</div>" : "") +
                            '<div class="mv_tt_playlists' + (r ? " with_border" : "") + '">';
                        each(mvcur.mvData.playlists, function(i, o) {
                                var a = o.added || e && o.id == mvcur.mvData.PLAYLIST_ADDED_ID,
                                    d = o["private"] ? '<span class="mv_tt_playlist_private_icon" onmouseover="showTooltip(this,{black:1,text: \'' + getLang(
                                        "video_album_is_private_tt") + "', shift:[16, 8, 0]})\"></span>" : "";
                                t += '<div class="mv_tt_playlist">  <div class="checkbox' + (a ? " on" : "") + (o.disabled ? " disabled" : "") + '" data-id="' +
                                    o.id + '" onclick="checkbox(this);">' + o.title + "</div>" + d + "</div>          "
                            }), t += "</div>", t += '<div class="mv_tt_add_playlist" onclick="Videoview.addPlaylist(' + r +
                            ')"><span class="mv_tt_plus_icon"></span>' + (r ? getLang("video_add_private_album") : getLang("video_add_album")) + "</div></div>", i.innerHTML =
                            t, each(geByClass("mv_tt_playlist", i), function() {
                                var i = domFC(this);
                                addEvent(i, "click", a), e && attr(i, "data-id") == mvcur.mvData.PLAYLIST_ADDED_ID && triggerEvent(i, "click")
                            })
                    }
                })
            }

            function i(i, o, a) {
                i = d ? !0 : i;
                var r = geByClass1("mv_added_icon", n),
                    v = geByClass1("mv_plus_icon", n),
                    l = geByClass1("mv_add_text", n);
                toggleClass(v, "mv_add_icon_curr", !i), toggleClass(v, "mv_add_icon_down", i), toggleClass(r, "mv_add_icon_curr", i), removeEvent(n, "click", t), removeEvent(n,
                        "setAdded", t), i ? (l.innerHTML = getLang("video_added_to_my_playlist"), e(o)) : (l.innerHTML = getLang("video_add_to_my_playlist"), mvcur.addButtonTT &&
                        mvcur.addButtonTT.destroy(), mvcur.addButtonTT = null, addEvent(n, "click", t), addEvent(n, "setAdded", t)), a || s == i || Videoview.playerOnAdded(),
                    s = i;
                var c = Videoview.getMvData();
                c.added = i
            }

            function t(e) {
                mvcur.mvData.published ? (i(!0, !0, "setAdded" == e.type), mvcur.addButtonTT.show()) : Videoview.showAddDialog(mvcur.mvData.oid + "_" + mvcur.mvData.vid)
            }

            function o() {
                var e = !1;
                return each(mvcur.mvData.playlists, function(i, t) {
                    return t.added ? (e = !0, !1) : void 0
                }), e
            }

            function a(e) {
                var t = e.currentTarget || e.target;
                if (!hasClass(t, "disabled")) {
                    var a = isChecked(t),
                        d = +t.getAttribute("data-id");
                    each(mvcur.mvData.playlists, function(e, i) {
                        return i.id == d ? (i.added = a, !1) : void 0
                    }), ajax.post("/al_video.php", {
                        act: "a_add_to_playlist",
                        oid: mvcur.mvData.oid,
                        vid: mvcur.mvData.vid,
                        hash: mvcur.mvData.playlistAddHash,
                        playlist_id: d,
                        add: +a,
                        info: window.Video && Video.isInCatalog() ? VideoPlaylist.getCurListId() : ""
                    }, {
                        onDone: function(e) {
                            var i = [],
                                t = [];
                            if (a) {
                                i.push(d);
                                var o = e.indexOf(d);
                                e.splice(o, 1)
                            } else t.push(d), e.push(d);
                            mvcur.mvData.info && window.Video && !Video.isInCatalog() && Video.updateVideo(vk.id, mvcur.mvData.info, e, !1, i, t)
                        }
                    }), i(o()), cancelEvent(e)
                }
            }
            mvcur.addButtonTT && (mvcur.addButtonTT.destroy(), mvcur.addButtonTT = null);
            var d = mvcur.mvData.uploaded,
                r = mvcur.mvData.noPublicAdd,
                n = ge("mv_add_button"),
                s = !1;
            n && (r ? e(!1) : i(d || o(), !1, !0))
        },
        locNav: function(e, i, t) {
            t = nav.toStr(t);
            var o = t.match(/^video(-?\d+_\d+)$/);
            return o ? void 0 : void Videoview.hide()
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
                className: "fixed layer_wrap"
            }), mvLayerWrap.appendChild(window.mvLayer), bodyNode.appendChild(mvLayerWrap), setStyle(mvLayer, {
                width: lastWindowWidth - sbWidth() - 2 + "px"
            }), addEvent(mvLayerWrap, "scroll", Videoview.viewScroll))
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
        show: function(e, i, t, o) {
            var a = window.ap;
            a && a.isPlaying() && (a.pause(), a.pausedByVideo = 1), window.forcePauseAudio = !0, o && o.autoplay && Videoview.playerCallback.onVideoStreamPlaying(), debugLog(
                "show video " + i);
            var d = window.mvcur && mvcur.mvShown,
                r = window.mvcur && mvcur.player;
            if (d && (r && domPN(r.el) === ge("video_player") ? r.deinitVideo() : (val("mv_player_box", ""), hide("mv_player_box"), show("mv_progress_box"))), window.mvcur &&
                clearInterval(mvcur.nextTimerUpdateInterval), window.mvcur && mvcur.minimized) {
                if (!o.nomin) return mvcur.videoRaw = i, mvcur.options = o, mvcur.listId = t, mvcur.mvData = !1, o.playlistId ? Videoview.initPlaylistBlock(i, o.playlistId, o.catLoadMore) :
                    VideoPlaylist.removeBlock(), !0;
                o.prevLoc && (mvcur.mvPrevLoc = o.prevLoc), debugLog("unminimizing in show"), Videoview.unminimize(!0, !1, !0)
            }
            if (o.queue && (debugLog("pushing in videoview.show"), layerQueue.push(), o.queue = !1), !o.noLocChange && nav.objLoc.z && 0 == nav.objLoc.z.indexOf("video") && (
                    cur.mvHistoryBack = cur.mvHistoryBack || 1, cur.mvHistoryBack++), d || layerQueue.hide(), window.forcePauseAudio = !1, this.init(), mvcur.showTime = (new Date)
                .getTime(), removeEvent(window, "resize", Videoview.onResize), removeEvent(window, "focus blur", Videoview.onPageFocusChange), removeEvent(document,
                    "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), removeEvent(document, "keydown", Videoview.onKeyDown),
                removeEvent(mvLayerWrap, "click", Videoview.onClick), addEvent(window, "resize", Videoview.onResize), addEvent(window, "focus blur", Videoview.onPageFocusChange),
                addEvent(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), addEvent(document, "keydown", Videoview.onKeyDown),
                addEvent(mvLayerWrap, "click", Videoview.onClick), boxQueue.hideAll(), layers.wrapshow(mvLayerWrap, .8), layers.fullhide = Videoview.hide, mvcur.nextTimerUpdateInterval =
                setInterval(Videoview.playerNextTimerUpdate, 1e3), setTimeout(function() {
                    layers.wrapshow(mvLayerWrap, .8), layers.fullhide = Videoview.hide
                }, 0), mvcur.noLocChange = 0, o.ad_video && (o.hideInfo = 1, o.noLocChange = 1, mvcur.noLocChange = 1, mvcur.videoAds = 1), mvcur.noHistory = o.noLocChange ||
                o.noHistory, mvcur.blackInterval = setInterval(Videoview.moveCheck, 18e4), mvcur.videoRaw = i, mvcur.options = o, mvcur.listId = t, mvcur.mvData = !1, mvcur.mvShown = !
                0, mvcur.player = r, o.prevLoc ? mvcur.mvPrevLoc = o.prevLoc : setTimeout(function() {
                    var e = document.URL;
                    Videoview.setLocation(o.noLocChange), e == document.URL && (e = ""), setTimeout(window.comScoreUDM && comScoreUDM.pbind(locProtocol + "//" + locHost +
                        "/al_video.php?comscorekw=pageview_candidate", e), 10)
                }, 0), e && e.pageX && e.pageY && extend(mvcur, {
                    mvOldX: e.pageX,
                    mvOldY: e.pageY,
                    mvOldT: vkNow()
                }), d ? Videoview.disableLayerContent() : Videoview.buildLayerContent(), toggle("mv_info", !o.hideInfo), o.expandPlayer) {
                mvcur.player = o.expandPlayer, o.expandPlayer = 1;
                var n = domClosest("video_box_wrap", mvcur.player.el);
                ge("mv_player_box")
                    .appendChild(n), hide("mv_progress_box"), show("mv_player_box"), mvcur.player.onExpanded()
            }
            return o.playlistId ? Videoview.initPlaylistBlock(i, o.playlistId, o.catLoadMore) : VideoPlaylist.removeBlock(), Videoview.cleanUpStoredVSegs(), o.minimized &&
                setTimeout(Videoview.minimize.bind(Videoview), 0), !1
        },
        buildLayerContent: function() {
            var e = "mv_dark";
            addClass(window.mvLayerWrap, e), addClass(window.layerBG, e), val(mvLayer,
                '<div id="mv_container" class="scroll_fix_wrap">  <div id="mv_box" onclick="mvcur.mvClicked = true;">    <div id="mv_approve" style="display: none;"></div>    <div id="mv_publish" style="display: none;"></div>    <div class="mv_min_header">      <div class="mv_min_control" onmousedown="return Videoview.hide(false, true);" role="button" tabindex="0" aria-label="' +
                getLang("global_close") +
                '">        <div class="mv_min_control_close"></div>      </div>      <div class="mv_min_control" onclick="return Videoview.unminimize();">        <div class="mv_min_control_max"></div>      </div>      <div class="mv_min_title" id="mv_min_title"></div>    </div>    <div id="mv_main" class="mv_main">      <div class="mv_pl_prev_wrap">        <div class="mv_playlist_controls" id="mv_pl_prev" onclick="return VideoPlaylist.prevVideo()">          <div class="mv_playlist_controls_icon"></div>        </div>      </div>      <div class="mv_pl_next_wrap">        <div class="mv_playlist_controls" id="mv_pl_next" onclick="return VideoPlaylist.nextVideo()">          <div class="mv_playlist_controls_icon"></div>        </div>      </div>      <div id="mv_progress_box">' +
                getProgressHtml() +
                '</div>      <div id="mv_player_box"></div>      <div class="mv_top_controls_wrap">        <div id="mv_top_controls">          <div onclick="return Videoview.hide(false, true, event, true);" class="mv_top_button mv_top_close" role="button" tabindex="0" aria-label="' +
                getLang("global_close") +
                '">            <div class="mv_close_icon"></div>          </div>          <div onclick="return Videoview.minimize(event);" class="mv_top_button mv_top_minimize" role="button" tabindex="0" aria-label="' +
                getLang("global_min") +
                '">            <div class="mv_minimize_icon"></div>          </div>          <div onclick="return Videoview.toggleSideBlock();" class="mv_top_button mv_top_toggle_sideblock" id="mv_top_pl_toggle" role="button" tabindex="0">            <div class="mv_toggle_sideblock_icon"></div>          </div>        </div>      </div>    </div>    <div id="mv_service_btns_wrap">      <div id="mv_service_btns"></div>    </div>    <div class="mv_info" id="mv_info"></div>    <div id="mv_warning" style="display: none;"></div>  </div></div>  '
            ), browser.mobile && setStyle("mv_container", {
                paddingTop: intval(window.pageYOffset) + 10 + "px"
            }), Videoview.updateSize()
        },
        disableLayerContent: function() {
            addClass("mv_info", "mv_info_disabled")
        },
        initPlaylistBlock: function(e, i, t) {
            var o = !!VideoPlaylist.getBlock(),
                a = VideoPlaylist.buildBlock(i, e);
            if (a && /^wall_/.test(i) && VideoPlaylist.lists[i] && cur.wallVideos && cur.wallVideos[i] && (VideoPlaylist.extendList(i, cur.wallVideos[i].list), VideoPlaylist.updateBlockList(
                    i)), a) {
                ge("mv_main")
                    .appendChild(a), VideoPlaylist.restoreScrollPos(), VideoPlaylist.updateScrollbar(), VideoPlaylist.setCurVideo(e, o);
                var d = VideoPlaylist.getCurList()
                    .list.length;
                (window.Video && Video.isInVideosList() && vk.id == cur.oid || 5 > d) && (o || VideoPlaylist.toggle(!1))
            }
            VideoPlaylist.toggleStateClasses(), VideoPlaylist.updateControls(), isFunction(t) && t(VideoPlaylist.updateBlockList.pbind(i))
        },
        hide: function(e, i, t, o) {
            if (window.mvcur && (i || mvcur.mvShown)) {
                if (o) {
                    var a = cur.videoBackOnClick;
                    if (cur.videoBackOnClick = !1, a) return history.back()
                }
                if (!i && mvcur.minimized) return void(mvcur.noLocChange || e === !0 || (2 === e ? nav.setLoc(hab.getLoc()) : layerQueue.count() || Videoview.backLocation()));
                if (!mvcur.noHistory && !e && !o) {
                    mvcur.noHistory = 1, mvcur.forceHistoryHide = i, __adsUpdate("very_lazy");
                    var d = cur.mvHistoryBack ? -cur.mvHistoryBack : -1;
                    return cur.mvHistoryBack = 0, setTimeout(function() {
                        mvcur.mvShown || (Videoview.destroyPlayer(), VideoPlaylist.removeBlock())
                    }, 10), history.go(d)
                }
                if (mvcur.forceHistoryHide && (i = mvcur.forceHistoryHide, mvcur.forceHistoryHide = !1), mvcur.statusVideo) {
                    var r = ge("mv_like_icon");
                    if (r) {
                        var n = r.parentNode.tt;
                        n && n.container && re(n.container), r.parentNode.tt && delete r.parentNode.tt
                    }
                }
                var s = mvcur.minimized;
                if (s && (Videoview.unminimize(!0, !0, !0), mvcur.minimized = !1, e = !0), Wall.cancelEdit(!0), mvcur.replyFormShown && Wall.hideEditReply(mvcur.post), (mvcur.mvData
                        .duration > 60 || mvcur.mvData.is_live) && !i && !mvcur.finished) {
                    var v = (new Date)
                        .getTime() - mvcur.showTime,
                        l = getLang("video_are_you_sure_close");
                    if (v > 3e4 && "are you sure close" != l && !browser.safari_mobile) {
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
                cur.vSearchPos && delete cur.vSearchPos, cur.vSearchLastActionTime && (cur.vSearchLastActionTime = (new Date)
                    .getTime()), mvcur.finished || Videoview.logViewedPercentage(), window.forcePauseAudio || (window.ap && !ap.isPlaying() && ap.pausedByVideo && (ap.play(),
                    delete ap.pausedByVideo), window.Notifier && Notifier.lcSend("video_hide")), s ? hide(mvLayerWrap) : (layers.wraphide(mvLayerWrap), layers.fullhide = !
                    1), window.tooltips && tooltips.destroyAll(cur.mvBox);
                var u = "mv_dark";
                removeClass(mvLayerWrap, u), removeClass(layerBG, u), mvcur.mvShown = mvcur.mvClicked = !1, removeEvent(window, "resize", Videoview.onResize), removeEvent(
                        document, "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), removeEvent(document, "keydown", Videoview.onKeyDown),
                    removeEvent(mvLayerWrap, "click", Videoview.onClick), clearInterval(mvcur.nextTimerUpdateInterval), Videoview.removeExternalVideoFinishBlock(), Videoview.destroyPlayer(),
                    val("mv_player_box", "");
                VideoPlaylist.getBlock();
                return s && isVisible(layerWrap) || (debugLog("pop from videoview.hide"), setTimeout(layerQueue.pop, 0)), mvcur.blackInterval && clearInterval(mvcur.blackInterval),
                    o && nav.objLoc.z ? (layerQueue.skipVideo = !0, delete nav.objLoc.z, nav.setLoc(nav.objLoc)) : mvcur.noLocChange || e === !0 || (2 === e ? nav.setLoc(hab.getLoc()) :
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
            var t = e.length,
                o = i.length;
            return o > t ? -1 : t > o ? 1 : i > e ? -1 : e > i ? 1 : 0
        },
        onClick: function(e) {
            if (mvcur.mvClicked || e && cur.__mdEvent && e.target != cur.__mdEvent.target) return void(mvcur.mvClicked = !1);
            var i = Math.abs(e.pageX - intval(mvcur.mvOldX)),
                t = Math.abs(e.pageY - intval(mvcur.mvOldY));
            (i > 3 || t > 3) && vkNow() - intval(mvcur.mvOldT) > 300 && Videoview.hide()
        },
        onKeyDown: function(e) {
            return e.returnValue === !1 ? !1 : e.keyCode == KEY.ESC ? (mvcur.mvEditing ? Videoview.cancelInline() : Videoview.hide(), cancelEvent(e)) : void 0
        },
        onResize: function() {
            var e = lastWindowWidth,
                i = lastWindowHeight,
                t = sbWidth(),
                o = e - t - 2 - 120 - 34 - 50,
                a = i - 31 - 28 - 72;
            o > 1280 ? o = 1280 : o > 807 && 907 > o ? o = 807 : 604 > o && (o = 604), 453 > a && (a = 453), mvcur.mvWidth = o, mvcur.mvHeight = a;
            var d = !1,
                r = mvcur.mvVeryBig;
            mvcur.mvVeryBig = o > 1280 ? 2 : o > 807 ? 1 : !1, d = r != mvcur.mvVeryBig, Videoview.updateExternalVideoFinishBlock(), Videoview.updateReplyFormPos()
        },
        onPageFocusChange: function() {
            setTimeout(Videoview.playerNextTimerUpdate, 10)
        },
        onFullscreenChange: function() {
            Videoview.updateExternalVideoFinishBlock(), mvcur.chatMode && VideoChat.updateScroll()
        },
        updateSize: function() {
            if (mvcur.minimized) return !1;
            var e = document.documentElement,
                i = window.innerHeight || e.clientHeight || bodyNode.clientHeight,
                t = 2;
            isVisible("mv_info") || (t = 1.2), setStyle("mv_container", {
                top: Math.max((i - 800) / t, 50) + "px"
            }), onBodyResize(), Videoview.onResize()
        },
        getPrevLoc: function() {
            mvcur.mvPrevLoc = {};
            for (var e in nav.objLoc) "z" == e && nav.objLoc[e].match(new RegExp("^video" + mvcur.videoRaw, "")) || (mvcur.mvPrevLoc[e] = nav.objLoc[e])
        },
        setLocation: function(e) {
            if (mvcur.options.fromPreload) {
                var i = mvcur.listId.match(new RegExp("([a-z]*)([0-9-]*)")),
                    t = mvcur.listId.match(new RegExp("claim=([0-9]+)")),
                    o = parseInt(i[2]);
                mvcur.mvPrevLoc = {
                    0: "videos" + o
                }, "videos" != i[1] && (mvcur.mvPrevLoc.section = i[1]), t && t[1] && (mvcur.mvPrevLoc.claim = t[1])
            } else e ? mvcur.mvPrevLoc = "z" : Videoview.getPrevLoc();
            if (!e) {
                var a, d = "video" + mvcur.videoRaw;
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
                    t = getXY(e, !0)[1];
                0 > t || t > lastWindowHeight - 200 ? animate(mvLayerWrap, {
                    scrollTop: mvLayerWrap.scrollTop + t - 50
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
                    void Videoview.updateCommentsHeader(from);
                hide(comment), node.appendChild(se(text)), del ? ("mv" == from ? (--mvcur.mvData.commcount, --mvcur.mvData.commshown) : (--cur.commentsCount, --cur.commentsShown),
                    Videoview.updateCommentsHeader(from)) : "mv" == from && Videoview.recache(), script && eval(script), Videoview.updateReplyFormPos()
            }
        },
        commAction: function(e, i, t, o, a) {
            var d = ge("post" + i + "video_" + t + a),
                r = domByClass(d, "post_actions"),
                n = ge("reply_" + e + i + "video_" + t + a);
            attr(d, "data-action", e), n && tooltips.hide(n), ajax.post("al_video.php", {
                act: e + "_comment",
                comment: i + "_" + t,
                hash: o,
                videoview: 1,
                from: a
            }, {
                onDone: Videoview.commActionDone.pbind(i + "_" + t, a),
                showProgress: addClass.pbind(r, "post_actions_progress"),
                hideProgress: removeClass.pbind(r, "post_actions_progress"),
                stat: ["privacy.js", "privacy.css"]
            })
        },
        moreComments: function(e) {
            if (isVisible("mv_comments_header") && !hasClass(domFC(ge("mv_comments_header")), "pr") && !(e && Videoview.cmp(domFC(ge("mv_comments"))
                    .id, "post" + e) < 0)) {
                var i = mvcur.mvData;
                ajax.post("al_video.php", {
                    act: "video_comments",
                    offset: i.commshown,
                    video: i.videoRaw
                }, {
                    onDone: function(i, t) {
                        Videoview.receiveComms(i, t, !0, e), e && ge("post" + e) && Videoview.showComment(e)
                    },
                    showProgress: function() {
                        var e = ge("mv_comments_header");
                        mvcur.mvCommInfo = val(e), val(e, ""), showProgress(e)
                    },
                    hideProgress: function() {
                        val("mv_comments_header", mvcur.mvCommInfo)
                    }
                })
            }
        },
        updateCommentsHeader: function(e) {
            if ("review" != e) {
                var i = mvcur.mvData,
                    t = "";
                i.commcount > i.commshown && (t = getLang("video_show_previous_comments", i.commcount - i.commshown)), i.commcount && val("mv_comments_summary", getLang(
                    "video_comments_summary", i.commcount)), setStyle("mv_comments_summary", {
                    display: i.commcount ? null : "none"
                }), toggleClass("mv_comments_header", "mv_comments_expanded", !t), toggleClass("mv_comments_summary", "mv_comments_expanded", !t), val("mv_comments_header",
                    t), Videoview.recache()
            }
        },
        onShowEditReply: function() {
            mvcur.replyFormShown = !0, Videoview.updateReplyFormPos(), Videoview.playerNextTimerUpdate()
        },
        onHideEditReply: function() {
            mvcur.replyFormShown = !1, mvcur.mvReplyTo = !1, Videoview.updateReplyFormPos(), setTimeout(Videoview.updateReplyFormPos, 0), Videoview.playerNextTimerUpdate()
        },
        commentClick: function(e, i, t, o) {
            Wall.checkReplyClick(e, i) || (mvcur.mvReplyTo = [t, o], Wall.replyTo(mvcur.post, o, t))
        },
        receiveComms: function(e, i, t, o) {
            for (var a, d, r = ce("div", {
                    innerHTML: e
                }), n = ge("mv_comments"), s = a = domLC(n), v = getXY(a, !0)[1], l = mvcur.mvData; d = domLC(r);) {
                for (; a && Videoview.cmp(a.id, d.id) > 0;) a = domPS(a);
                a && !Videoview.cmp(a.id, d.id) ? (n.replaceChild(d, a), a = d) : (a && domNS(a) ? n.insertBefore(d, domNS(a)) : !a && domFC(n) ? t ? n.insertBefore(d, domFC(n)) :
                    (--l.commshown, r.removeChild(d)) : n.appendChild(d), t || ++l.commcount, ++l.commshown)
            }
            o && s && (mvLayerWrap.scrollTop += getXY(s, !0)[1] - v), extend(mvcur.mvReplyNames, i), window.updateWndVScroll && updateWndVScroll(), Videoview.updateCommentsHeader(),
                Videoview.updateReplyFormPos()
        },
        commSaved: function(e) {},
        sendComment: function(e, i, t) {
            var o = ge("reply_field" + e),
                a = o && data(o, "composer"),
                d = (mvcur.mvReplyNames[(mvcur.mvReplyTo || {})[0]] || [])[1],
                r = ge("reply_button" + e);
            if (t) var n = {
                message: "",
                attach1_type: "sticker",
                attach1: t
            };
            else {
                var n = a ? Composer.getSendParams(a, Videoview.sendComment) : {
                    message: trim(val(o))
                };
                if (n.delayed) return;
                if (!n.attach1_type && (!n.message || d && !d.indexOf(n.message))) return void elfocus(o)
            }
            ajax.post("al_video.php", Wall.fixPostParams(extend(n, {
                act: "post_comment",
                video: mvcur.mvData.videoRaw,
                hash: mvcur.mvData.hash,
                fromview: 1,
                videoviewer: 1,
                from_group: hasClass(domClosest("_submit_post_box", ge("reply_as_group" + mvcur.post)), "as_group") ? 1 : "",
                reply_to: (mvcur.mvReplyTo || {})[1]
            })), {
                onDone: function(i, t) {
                    Videoview.receiveComms(i, t), val("mv_comments_summary", getLang("video_comments_summary", mvcur.mvData.commcount)), Composer.reset(a), hide(
                        "reply_warn" + e), Wall.cancelReplyTo(e), mvLayerWrap.scrollTop = 9e9
                },
                onFail: function(e) {
                    return o ? (showTooltip(o, {
                        text: e,
                        showdt: 200,
                        forcetodown: 0,
                        slide: 15
                    }), elfocus(o), !0) : void 0
                },
                showProgress: lockButton.pbind(r),
                hideProgress: unlockButton.pbind(r)
            })
        },
        activate: function(e, i, t) {
            2 == i ? animate(e, {
                color: "#FFFFFF"
            }, "undefined" != typeof t ? 0 : 200) : animate(e, {
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
                    if (obj && val(domPN(obj), text), !isArray(row)) try {
                        row = eval("(" + row + ")")
                    } catch (e) {}
                    window.mvcur && (mvcur.mvData && mvcur.mvData.afterAdd ? mvcur.mvData.afterAdd(row[0] + "_" + row[1], shareHash) : row && (mvcur.mvData.addedVideo =
                        row[0] + "_" + row[1], mvcur.mvData.addedVideoHash = hash, mvcur.mvData.addedVideoShareHash = shareHash));
                    var videoEl = ge("video_cont" + videoRaw);
                    videoEl && addClass(videoEl, "video_row_added"), "list" == from && showDoneBox(text), window.Video && !Video.isInCatalog() && Video.updateVideo(
                        cur.oid, row, [], !1, [-2]), Videoview.setAddButtonStateAdded()
                }
            }), !1
        },
        likeUpdate: function(e, i, t, o) {
            i = intval(i);
            var a = Videoview.getMvData(),
                d = window.mvcur && mvcur.statusVideo ? "wall" : "video",
                r = (ge("like_table_" + d + a.videoRaw), ge("like_title_" + d + a.videoRaw)),
                n = ge("like_real_count_" + d + a.videoRaw) || {},
                s = ge("mv_like_wrap");
            if (icon = domByClass(s, "_icon"), countNode = domByClass(s, "_count"), a.likes = i, a.liked = e, countNode) {
                var v = s.tt || {},
                    l = clone(v.opts || {}),
                    n = domByClass(v.container, "_value"),
                    c = domByClass(v.container, "_content"),
                    r = domByClass(v.container, "_title");
                t && r && val(r, t), n && (n.value = i), animateCount(countNode, i), toggleClass(s, "my_like", e), toggleClass(s, "no_likes", !i), toggleClass(c, "me_hidden", !
                    e), i ? o || !v.el || isVisible(v.container) || t || tooltips.show(v.el, extend(l, {
                    showdt: 0
                })) : v.el && v.hide()
            }
        },
        _isCurrentVideoPublished: function() {
            return cur.mvOpts ? cur._videoPublished : window.mvcur && mvcur.mvData && mvcur.mvData.published
        },
        addSmall: function(e, i, t, o) {
            if (Videoview._isCurrentVideoPublished()) {
                window.mvcur && mvcur.mvShown ? Videoview.setAddButtonStateAdded() : Videoview.addVideo(e, i, !1, t, o), hide("video_add_action_link"), addClass(ge(
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
                    onDone: function(e, t) {
                        t && (e.removeButtons(), e.addButton(getLang("Save"), function(e) {
                            var o = trim(val("mv_video_add_title"));
                            o && ajax.post("/al_video.php", {
                                act: "a_add_publish_video",
                                title: o,
                                video_privacy: Privacy.getValue("video_add"),
                                videocomm_privacy: Privacy.getValue("videocomm_add"),
                                hash: t,
                                oid: i[0],
                                vid: i[1]
                            }, {
                                showProgress: lockButton.pbind(e),
                                hideProgress: unlockButton.pbind(e),
                                onDone: function() {
                                    cur._recentAddedVideos[e] = !0;
                                    var e = mvcur.videoRaw,
                                        t = mvcur.listId;
                                    Videoview.hide(!0, !0), Videoview.recache(i[0] + "_" + i[1]), showVideo(e, t)
                                }
                            })
                        }))
                    }
                })
            }
        },
        share: function(e, i, t) {
            if (vk.id) {
                var o = Videoview.getMvData();
                return o && !o.addedVideo && (o.addedVideo = o.videoRaw), (o || e) && showBox("like.php", {
                    act: "publish_box",
                    object: "video" + (o.addedVideo || e),
                    action_type: t
                }, {
                    onDone: function() {
                        window.mvcur && mvcur.mvShown && Videoview.playerNextTimerUpdate()
                    }
                }), !1
            }
        },
        like: function(e, i) {
            if (vk.id) {
                var t = Videoview.getMvData();
                if (t) {
                    var o = t;
                    if (window.mvcur && mvcur.statusVideo) var a = "wall" + o.videoRaw;
                    else var a = "video" + o.videoRaw;
                    var d = "";
                    if (window.Video && Video.isInCatalog()) {
                        var r = VideoPlaylist.getCurListId();
                        d = Videocat.isTop3Playlist(r) ? "featured" : r
                    }
                    ajax.post("like.php", {
                        act: "a_do_" + (o.liked ? "un" : "") + "like",
                        object: a,
                        hash: o.likeHash,
                        short_view: 1,
                        from: "videoview",
                        info: d
                    }, {
                        onDone: Videoview.likeUpdate.pbind(!o.liked)
                    }), i || Videoview.playerOnLiked(), toggleClass(geByClass1("mv_finish_like", "mv_external_finish"), "selected", !o.liked), Videoview.likeUpdate(!o.liked,
                        o.likes + (o.liked ? -1 : 1), null, i), Videoview.recache()
                }
            }
        },
        likeShare: function(e) {
            if (vk.id) {
                var i = mvcur.mvData;
                if (mvcur.statusVideo) var t = "wall" + i.videoRaw;
                else var t = "video" + i.videoRaw;
                var o = ge("like_share_video" + i.videoRaw),
                    a = isChecked(o);
                checkbox(o), ajax.post("like.php", {
                    act: "a_do_" + (a ? "un" : "") + "publish",
                    object: t,
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
            if (mvcur.statusVideo) var t = "wall" + i.videoRaw;
            else var t = "video" + i.videoRaw;
            var o = getSize(ge("mv_like_link")),
                a = o ? o[0] : 20;
            showTooltip(e, {
                url: "like.php",
                params: {
                    act: "a_get_stats",
                    object: t,
                    list: mvcur.listId,
                    from: "videoview"
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
                            t = geByClass1("top_pointer", e.container, "div");
                        setStyle(i, {
                            marginLeft: a + 2
                        }), setStyle(t, {
                            marginLeft: a + 2
                        })
                    }
                }
            })
        },
        showEditBox: function(e, i, t, o) {
            Videoview.hidePlayer();
            var a = showBox("al_video.php", {
                act: "edit_box",
                vid: e,
                oid: i,
                is_publish: +o
            }, {
                stat: ["privacy.js", "privacy.css", "video.js", "video.css"],
                dark: 1
            });
            return a.setOptions({
                onHide: function() {
                    Videoview.showPlayer()
                }
            }), t && cancelEvent(t)
        },
        restoreVideo: function(e, i, t, o, a) {
            var d = ge("mv_warning");
            return d && (d.innerHTML = '<img style="margin-left: 100px;" src="/images/upload.gif" />'), ajax.post("al_video.php", {
                act: "restore_video",
                vid: e,
                oid: i,
                hash: t,
                from: o || "videoviewer"
            }, {
                onDone: function(t) {
                    if ("list" == o && cur.restoreRaw && cur.restoreRaw[i + "_" + e]) {
                        var a = ge("video_row" + i + "_" + e);
                        val(a, cur.restoreRaw[i + "_" + e]), removeClass(a, "video_row_loading"), removeClass(a, "video_row_deleted"), setStyle(geByClass1(
                            "video_row_icon_delete", a), {
                            opacity: .8
                        })
                    } else;
                    hide("mv_warning"), show("mv_info"), cur.claimedVideoText && (val("video_player", cur.claimedVideoText), cur.claimedVideoText = "")
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
        publish: function(e, i, t, o) {
            o && hasClass(o, "loading") || Videoview.showEditBox(i, e, null, !0)
        },
        deleteVideo: function(e, i, t, o, a, d, r) {
            d && hasClass(d, "loading") || ajax.post("al_video.php", {
                act: "delete_video",
                vid: e,
                oid: i,
                hash: t,
                sure: o ? 1 : 0,
                from: a
            }, {
                onDone: function(o, n, s, v, l) {
                    if (Videoview.recache(i + "_" + e), "sure" == o) {
                        Videoview.hidePlayer();
                        var c = showFastBox({
                            title: n,
                            bodyStyle: "padding: 20px; line-height: 160%;",
                            dark: 1
                        }, s);
                        c.setOptions({
                            onHide: function() {
                                Videoview.showPlayer()
                            }
                        }), c.removeButtons(), c.addButton(l, c.hide, "no"), c.addButton(v, function() {
                            c.showProgress(), Videoview.deleteVideo(e, i, t, !0, a, d, c.hide)
                        }, "yes")
                    } else if ("result" == o && (r && r(s), "videoviewer" == a && (ge("mv_info") && (hide("mv_info"), val("mv_warning", s), show("mv_warning"),
                            hide("mv_publish")), s = n), window.Video && Video.isInVideosList())) return Video.updateVideo(cur.oid, [i, e], [], !0), !0
                },
                showProgress: d ? addClass.pbind(d, "loading") : !1,
                hideProgress: d ? removeClass.pbind(d, "loading") : !1
            })
        },
        deleteVideoOnClaim: function(e, i, t, o, a, d) {
            Videoview.deleteVideo(e, i, t, o, a, d, function(e) {
                "videoviewer" == a && (hide("mv_info"), cur.claimedVideoText = val("video_player"), val("video_player", e))
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
        setAdult: function(e, i, t, o, a) {
            ajax.post("al_video.php", {
                act: "set_adult_video",
                vid: i,
                oid: e,
                hash: t,
                value: o
            }, {
                onDone: function(e, i) {
                    a && (a.innerHTML = i)
                }
            })
        },
        spamVideo: function(e, i, t, o, a, d, r) {
            o && addClass(o, "loading"), ajax.post("al_video.php", {
                act: "spam_video",
                vid: i,
                oid: e,
                hash: t,
                sure: d ? 1 : 0,
                from: a
            }, {
                onDone: function(d, n, s, v, l) {
                    if (o && removeClass(o, "loading"), Videoview.recache(e + "_" + i), "sure" == d) {
                        Videoview.hidePlayer();
                        var c = showFastBox({
                            title: n,
                            bodyStyle: "padding: 20px; line-height: 160%;",
                            dark: 1
                        }, s);
                        c.setOptions({
                            onHide: function() {
                                Videoview.showPlayer()
                            }
                        }), c.removeButtons(), c.addButton(l, c.hide, "no"), c.addButton(v, function() {
                            c.showProgress(), Videoview.spamVideo(e, i, t, o, a, !0, c.hide)
                        }, "yes")
                    } else if ("result" == d) {
                        if (r && r(), window.Video)
                            if ("videoviewer" == a) Video.removeFromLists(e + "_" + i);
                            else if ("list" == a) return val("video_row" + e + "_" + i, '<div class="video_row">' + s + "</div>"), Video.removeFromLists(e + "_" +
                            i, !0), !0
                    } else val(domPN(o), d)
                }
            })
        },
        licensed: function(e, i) {
            var t = ge("mv_licensed_info");
            (t || e)
            .innerHTML = '<img src="/images/upload.gif" />', show(t), ajax.post("al_video.php", {
                act: "change_licensed",
                video: mvcur.mvData.videoRaw,
                hash: i
            }, {
                onDone: function(i, o) {
                    t && (t.innerHTML = o, (o ? show : hide)(t)), e.innerHTML = i
                }
            })
        },
        claimed: function(e, i, t) {
            ge("claim_link")
                .innerHTML = getProgressHtml(), ajax.post("al_claims.php", {
                    act: "a_" + i,
                    type: "video",
                    id: mvcur.mvData.vid,
                    owner_id: mvcur.mvData.oid,
                    claim_id: e,
                    extra: t
                }, {
                    onDone: function() {
                        "claim" == i ? ge("claim_link")
                            .innerHTML = '<a onclick="return Videoview.claimed(' + e + ", 'unclaim', '" + t + "');\">Вернуть</a>" : ge("claim_link")
                            .innerHTML = '<a onclick="return Videoview.claimed(' + e + ", 'claim', '" + t + "');\">Изъять</a>"
                    }
                })
        },
        setStyle: function(e, i, t) {
            i = ge(i), mvcur.restoreStyles || (mvcur.restoreStyles = {});
            for (var o in t) mvcur.restoreStyles[e] || (mvcur.restoreStyles[e] = {}), mvcur.restoreStyles[e][o] = i.style[o], i.style[o] = t[o]
        },
        restoreStyle: function(e, i) {
            i = ge(i), setStyle(i, mvcur.restoreStyles[e])
        },
        showVideo: function(videoRaw, title, html, js, desc, serviceBtns, opt) {
            if (mvcur.mvShown && videoRaw == mvcur.videoRaw) {
                if (!vk.id && !html && !mvcur.options.expandPlayer) return void setTimeout(function() {
                    Videoview.hide(!1, !0), showDoneBox(title)
                }, 500);
                if (title && !html && !mvcur.options.expandPlayer) return val("mv_player_box",
                    '<div class="mv_video_unavailable_message_wrap"><div class="mv_video_unavailable_message">' + title + "</div></div>"), show("mv_player_box"), hide(
                    "mv_progress_box"), void hide("mv_info");
                if (opt = opt || {}, addLangKeys(opt.lang, !0), cur.share_timehash = cur.share_timehash || opt.share_timehash, mvcur.post = opt.post, mvcur.maxReplyLength =
                    opt.maxReplyLength, mvcur.maxChatReplyLength = opt.maxChatReplyLength, mvcur.maxDescriptionLength = opt.maxDescriptionLength, mvcur.mvData = opt.mvData,
                    mvcur.videoRaw = opt.mvData.videoRaw, mvcur.commentsTpl = opt.commentsTpl, mvcur.mvMediaTypes = opt.media, mvcur.mvMediaShare = opt.share, mvcur.mvReplyNames =
                    opt.names || {}, mvcur.rmedia_types = opt.rmedia_types, mvcur.adminLevel = opt.adminLevel, mvcur.chatMode = !!opt.chatMode, opt.queueData && (mvcur.queueKey =
                        opt.queueData.key, mvcur.qversion = opt.qversion), mvcur.wallTpl = opt.wallTpl, opt.pl_list) {
                    var lists = JSON.parse(opt.pl_list);
                    each(lists, function(e, i) {
                        VideoPlaylist.addList(i)
                    });
                    var playlistId = mvcur.options.playlistId,
                        playlist = VideoPlaylist.getList(playlistId);
                    if (playlist) {
                        var plBlockEl = VideoPlaylist.buildBlock(playlistId, mvcur.videoRaw, !0);
                        toggleClass("mv_box", "_has_playlist", !!plBlockEl), plBlockEl && (ge("mv_main")
                            .appendChild(plBlockEl), VideoPlaylist.updateScrollbar(), VideoPlaylist.setCurVideo(mvcur.videoRaw), VideoPlaylist.updateControls())
                    }
                }
                VideoPlaylist.toggleStateClasses(), Wall.cancelEdit(!0);
                var needRemin = !0;
                if (!mvcur.options.expandPlayer) {
                    var videoBoxWrap = domByClass(ge("mv_player_box"), "video_box_wrap");
                    opt.is_vk_player && !opt.is_flv && !opt.cantPlay && mvcur.player && domClosest("video_box_wrap", mvcur.player.el) === videoBoxWrap ? (attr(videoBoxWrap,
                        "id", "video_box_wrap" + mvcur.videoRaw), needRemin = !1) : (mvcur.player && re(mvcur.player.el), val("mv_player_box", html)), hide(
                        "mv_progress_box")
                }
                if (val("mv_info", desc), val("mv_service_btns", serviceBtns), toggleClass("mv_box", "_has_chat", mvcur.chatMode && !mvcur.minimized), mvcur.chatMode) {
                    VideoPlaylist.removeBlock();
                    var chatBlock = se(opt.chatBlock);
                    ge("mv_main")
                        .appendChild(chatBlock), VideoChat.init(chatBlock)
                }
                var rf = ge("reply_field" + mvcur.post);
                if (rf && placeholderInit(rf, {
                        editable: 1
                    }), mvcur.finished = !1, js && eval("(function(){" + js + "})()"), opt.publishAction) {
                    var publishAction = ge("mv_publish");
                    val(publishAction, opt.publishAction), show(publishAction)
                }
                if (Videoview.updateSize(), mvcur.minimized && needRemin && Videoview.minimizePlayer(), mvcur.statusVideo) {
                    var statusCont = ge("like_count" + mvcur.mvData.videoRaw);
                    if (statusCont) {
                        var tt = statusCont.parentNode.tt;
                        tt && tt.container && re(tt.container), statusCont.parentNode.tt && delete statusCont.parentNode.tt
                    }
                }
                if (show("mv_player_box"), window.updateWndVScroll && updateWndVScroll(), (mvcur.options || {})
                    .scroll && (mvLayerWrap.scrollTop = mvcur.options.scroll, mvcur.options.scroll = 0), toggle("mv_info", !mvcur.options.hideInfo && !mvcur.mvData.noControls &&
                        !mvcur.minimized), removeClass("mv_info", "mv_info_disabled"), !mvcur.mvData.noControls) {
                    var titleWidth = mvcur.minimized ? mvcur.minSize.wrap.w : !1;
                    Videoview.setTitle(titleWidth), Videoview.initAddButton();
                    var items = [];
                    mvcur.mvData.publishToGroups && items.push(["_onAddToCommunity", getLang("video_add_to_group")]), mvcur.mvData.canExport && items.push(["_onExport",
                            getLang("video_export_action")
                        ]), mvcur.mvData.stats && items.push(["_onViewStats", getLang("video_statistics")]), mvcur.mvData.oid != vk.id && mvcur.mvData.reportReasons && mvcur.mvData
                        .reportReasons.length && items.push(["_onReport", getLang("video_complain")]), mvcur.mvData.editHash && mvcur.mvData.editFromDropdown && !mvcur.mvData.hideEdit &&
                        items.push(["_onEdit", getLang("video_edit")]), mvcur.mvData.deleteHash && !mvcur.mvData.hideEdit && items.push(["_onDelete", getLang(
                            "video_menu_delete")]), items.length ? new InlineDropdown("mv_more", {
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
                        }) : re("mv_more"), toggle(ge("mv_edit_button"), mvcur.mvData.editHash && !mvcur.mvData.hideEdit && !mvcur.mvData.editFromDropdown)
                }
                mvcur.mvData.uploaded || Videoview.recache(), mvcur.mvData.is_active_live || Videoview.adaptRecomsHeight(), Videoview.updateReplyFormPos(), opt.queueData &&
                    stManager.add("notifier.js", function() {
                        Videoview.checkUpdates(opt.queueData)
                    }), mvcur.mvData.is_live && setTimeout(Videoview.checkOtherLives.pbind(videoRaw), 6e4)
            }
        },
        adaptRecomsHeight: function() {
            var e = geByClass1("mv_info_wide_column", "mv_info"),
                i = geByClass1("mv_info_narrow_column", "mv_info");
            if (e && i)
                for (var t = geByClass("mv_recom_item", i), o = t.length - 1; getSize(e)[1] < getSize(i)[1] && o > 0; --o) hide(t[o])
        },
        checkUpdates: function(e) {
            window.mvcur && mvcur.mvShown && mvcur.queueKey === e.key && (window.Notifier && Notifier.addKey(e, Videoview.receiveUpdates), setTimeout(Videoview.checkUpdates.pbind(
                e), 25e3))
        },
        receiveUpdates: function(e, i) {
            function t(e, i) {
                return e + "video_" + i + "mv"
            }
            if (window.mvcur && mvcur.mvShown && mvcur.queueKey === e && i) return i.failed ? void(mvcur.queueKey = null) : void each(i.events, function() {
                var e = this.split("<!>"),
                    i = e[0],
                    o = e[1];
                if (i == mvcur.qversion) switch (o) {
                    case "new_reply":
                        mvcur.chatMode || (Videoview.appendNewComment.apply(Videoview, e.slice(2)), Videoview.updateCommentsHeader(), Videoview.updateReplyFormPos());
                        break;
                    case "new_reply_chat":
                        mvcur.chatMode && VideoChat.receiveMessage.apply(VideoChat, e.slice(2));
                        break;
                    case "edit_reply":
                        var a = e[2],
                            d = e[3],
                            r = e[4],
                            n = ge("wpt" + t(a, d));
                        n && !attr(n, "data-action") && val(n, psr(r)), Videoview.updateReplyFormPos();
                        break;
                    case "del_reply":
                        var a = e[2],
                            d = e[3];
                        if (mvcur.chatMode) VideoChat.receiveDelete(a, d);
                        else {
                            var n = ge("post" + t(a, d));
                            n ? attr(n, "data-action") || (mvcur.mvData.commcount--, mvcur.mvData.commshown--, re(n)) : mvcur.mvData.commcount--, Videoview.updateCommentsHeader(),
                                Videoview.updateReplyFormPos()
                        }
                        break;
                    case "like_reply":
                        var a = e[2],
                            d = e[3],
                            s = +e[4],
                            v = +e[5],
                            l = +e[6],
                            n = ge("wpe_bottom" + t(a, d));
                        if (n) {
                            var c = domByClass(n, "_like_wrap"),
                                m = domByClass(c, "_count");
                            val(m, s > 0 ? s : ""), toggleClass(c, "no_likes", !s), v == vk.id && toggleClass(c, "my_like", !l)
                        }
                        break;
                    case "video_view":
                        Videoview.updateLiveViewersCount(e[3]);
                        break;
                    case "end_live":
                        var u = mvcur.player;
                        u.onLiveEnded();
                        break;
                    default:
                        debugLog("unhandled video event")
                }
            })
        },
        appendNewComment: function(e, i, t, o, a, d, r, n, s, v, l) {
            if (!ge("post" + e + "video_" + i + "mv")) {
                var c = "";
                mvcur.adminLevel > 0 || e == vk.id || t == vk.id ? c += mvcur.commentsTpl.del_reply : e != t && (c += mvcur.commentsTpl.spam_reply), (mvcur.adminLevel > 1 && e ==
                    t || o == vk.id) && (c += mvcur.commentsTpl.edit_reply), c = rs(mvcur.commentsTpl.actions, {
                    actions: c
                });
                var m = langDate(1e3 * n, getLang("global_short_date_time", "raw"), 0, []),
                    u = psr(rs(mvcur.commentsTpl.reply, {
                        actions: c,
                        post_oid: e,
                        reply_id: e + "video_" + i + "mv",
                        reply_msg_id: i,
                        from_id: t,
                        name: o,
                        photo: a,
                        href: d,
                        message: r,
                        date: m,
                        to_link: s
                    }));
                mvcur.mvReplyNames[t] = [v, l], ge("mv_comments")
                    .insertAdjacentHTML("beforeend", u), mvcur.mvData.commcount++, mvcur.mvData.commshown++
            }
        },
        updateLiveViewersCount: function(e) {
            (e = intval(e)) && val("mv_views", getLang("video_live_N_watching", e, !0))
        },
        checkOtherLives: function(e) {
            mvcur.mvShown && !mvcur.minimized && mvcur.videoRaw == e && (ajax.post("/al_video.php", {
                act: "live_other_videos",
                video: e
            }, {
                onDone: function(i) {
                    Videoview.updateOtherLives(e, i)
                },
                onFail: function() {
                    return !0
                }
            }), setTimeout(Videoview.checkOtherLives.pbind(e), 6e4))
        },
        updateOtherLives: function(e, i) {
            if (mvcur.mvShown && mvcur.videoRaw == e) {
                var t = domByClass(mvLayer, "mv_info_narrow_column");
                val(t, i), mvcur.mvData.is_active_live || Videoview.adaptRecomsHeight()
            }
        },
        onVideoShared: function(e, i, t) {
            "publish" != e || Videoview._isCurrentVideoPublished() || (Videoview.hide(!0, !0), setTimeout(function() {
                0 == i.indexOf("video") && (i = i.substr("video".length)), Videoview.recache(i), showVideo(i, t)
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
        _onEdit: function() {
            var e = mvcur.mvData.oid,
                i = mvcur.mvData.vid;
            Videoview.showEditBox(i, e)
        },
        _onDelete: function() {
            var e = mvcur.mvData.oid,
                i = mvcur.mvData.vid,
                t = mvcur.mvData.deleteHash,
                o = !1,
                a = "videoviewer";
            Videoview.deleteVideo(i, e, t, o, a)
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
        addToClubPlaylistBoxInit: function(e, i, t) {
            function o(e, i) {
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
                                '" onclick="checkbox(this)">' + i.title + "</div>"
                        }), val("mv_add_to_club_albums_list", playlistsHtml), val("mv_add_to_club_gid", i), hide("mv_add_to_club_albums_progress"), show(
                            "mv_add_to_club_albums")
                    }
                }))
            }
            WideDropdown.deinit("add_to_pl_club_dd"), mvcur.addToClubPl = WideDropdown.init("add_to_pl_club_dd", {
                defaultItems: i,
                noResult: "no result",
                introText: "choose",
                onChange: o
            }), setTimeout(elfocus.pbind("add_to_pl_club_dd_input"), 0), e.removeButtons(), e.addButton(getLang("Save"), function(e) {
                var i = val("mv_add_to_club_gid"),
                    o = [];
                each(geByClass("mv_add_to_club_albums_list_item"), function(e, i) {
                    isChecked(i) && o.push(attr(i, "data-id"))
                }), ajax.post("/al_video.php", {
                    act: "a_add_to_playlist",
                    hash: t,
                    gid: i,
                    oid: mvcur.mvData.oid,
                    vid: mvcur.mvData.vid,
                    playlists: o.length ? o : "0"
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
            e = e || 590, val("mv_min_title", Videoview._isCurrentVideoPublished() ? stripHTML(i) : ""), setStyle("mv_min_title", {
                maxWidth: Math.max(0, e - 60)
            });
            var t = ge("mv_title");
            t && (setStyle(t, {
                display: "block"
            }), t.scrollHeight > t.offsetHeight && attr(t, "title", replaceEntities(stripHTML(i))), setStyle(t, {
                display: ""
            }))
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
            var t = 0,
                o = Videoview.getContSize(),
                a = e.clientX - mvcur.minSize.wrap.l,
                d = e.clientY - mvcur.minSize.wrap.t;
            return 6 > d && (t += 1), a > o[0] - 20 && (t += 2), d > o[1] - 10 && (t += 4), 10 > a && (t += 8), 1 == t && a > o[0] - 55 && (t = 0), !t && 25 > d && a < o[0] -
                55 && (t += 16), t
        },
        changeCursor: function(e) {
            if (!Videoview.isFS) {
                var i = Videoview.getContPlace(e),
                    t = "default";
                if (i && mvcur.minimized) {
                    var o = "";
                    1 & i && (o += "n"), 4 & i && (o += "s"), 2 & i && (o += "e"), 8 & i && (o += "w"), t = o + "-resize", 16 & i && (t = "move")
                }
                setStyle("mv_box", {
                    cursor: t
                })
            }
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
            if (!(Videoview.isFS || e.button && 1 !== e.button)) {
                var i = Videoview.getContPlace(e, !0);
                if (i) {
                    var t = (new Date)
                        .getTime();
                    if (Videoview.getMinSize(), extend(mvcur.minSize, {
                            x: e.clientX,
                            y: e.clientY
                        }), mvcur.resizeDiff = 0, !i || 16 & i) var o = Videoview.onMinMove;
                    else var o = Videoview.onMinResize;
                    mvcur.resizeMask = i;
                    var a = function(e) {
                        removeEvent(document, "mouseup", a), removeEvent(document, "mousemove", o), removeEvent(document, "drag", o);
                        var d = (new Date)
                            .getTime();
                        return Videoview.getMinSize(), mvcur.resizeDiff < 8 && 400 > d - t && (16 & i || 1 == i) && Videoview.unminimize(), removeClass(mvLayerWrap,
                            "mv_resizing"), removeClass("mv_player_box", "no_events"), addEvent("mv_box", "mousemove", Videoview.changeCursor), ls.set("mv_minSize",
                            mvcur.minSize), !1
                    };
                    return addClass(mvLayerWrap, "mv_resizing"), addClass("mv_player_box", "no_events"), addEvent(document, "mouseup", a), addEvent(document, "mousemove", o),
                        addEvent(document, "drag", o), removeEvent("mv_box", "mousemove", Videoview.changeCursor), cancelEvent(e)
                }
            }
        },
        onMinMove: function(e) {
            if (e) var i = e.clientY - mvcur.minSize.y,
                t = e.clientX - mvcur.minSize.x;
            else var i = 0,
                t = 0;
            return mvcur.minSize.wrap.t + i > mvcur.minSize.ch - mvcur.minSize.wrap.h - 15 && (i = mvcur.minSize.ch - mvcur.minSize.wrap.h - mvcur.minSize.wrap.t), mvcur.minSize
                .wrap.l + t > mvcur.minSize.cw - mvcur.minSize.wrap.w - 25 && (t = mvcur.minSize.cw - mvcur.minSize.wrap.w - mvcur.minSize.wrap.l - 14), mvcur.minSize.wrap.t +
                i < 15 && (i = -mvcur.minSize.wrap.t), mvcur.minSize.wrap.l + t < 15 && (t = -mvcur.minSize.wrap.l), setStyle(mvLayerWrap, {
                    top: mvcur.minSize.wrap.t + i + "px",
                    left: mvcur.minSize.wrap.l + t + "px"
                }), mvcur.resizeDiff = Math.max(Math.abs(t), Math.max(Math.abs(i), mvcur.resizeDiff)), e ? cancelEvent(e) : !1
        },
        onMinResize: function(e) {
            var i = 0,
                t = 0,
                o = mvcur.resizeMask,
                a = 1 & o || 4 & o ? e.clientY - mvcur.minSize.y : 0,
                d = 2 & o || 8 & o ? e.clientX - mvcur.minSize.x : 0;
            4 & o && mvcur.minSize.wrap.t + a > mvcur.minSize.ch - mvcur.minSize.wrap.h && (a = mvcur.minSize.ch - mvcur.minSize.wrap.h - mvcur.minSize.wrap.t), 1 & o && mvcur
                .minSize.wrap.t + a < 0 && (a = -mvcur.minSize.wrap.t), 2 & o && mvcur.minSize.wrap.l + d > mvcur.minSize.cw - mvcur.minSize.wrap.w - 14 && (d = mvcur.minSize.cw -
                    mvcur.minSize.wrap.w - mvcur.minSize.wrap.l - 14), 8 & o && mvcur.minSize.wrap.l + d < 0 && (d = -mvcur.minSize.wrap.l), 8 & o && (i = d, d = -d), 1 & o &&
                (t = a, a = -a), mvcur.minSize.wrap.w + d < 250 && (d = 250 - mvcur.minSize.wrap.w, 8 & o && (i = -d)), mvcur.minSize.wrap.h + a < 200 && (a = 200 - mvcur.minSize
                    .wrap.h, 1 & o && (t = -a));
            var r = Math.abs(d) + Math.abs(a),
                n = mvcur.minSize.wrap.w + d;
            setStyle(mvLayerWrap, {
                top: mvcur.minSize.wrap.t + t + "px",
                left: positive(mvcur.minSize.wrap.l + i) + "px",
                width: n + "px",
                height: mvcur.minSize.wrap.h + a + "px"
            });
            var s = {
                height: mvcur.minSize.player.h + a + "px",
                width: mvcur.minSize.player.w + d + "px"
            };
            return setStyle(mvcur.mvPlayer, s), mvcur.resizeDiff = Math.max(r, mvcur.resizeDiff), mvcur.contSize = !1, Videoview.setTitle(n), Videoview.playerOnResize(),
                Videoview.updateExternalVideoFinishBlock(), !1
        },
        minimize: function(e) {
            if (e && cancelEvent(e), mvcur.minimized) return !1;
            mvcur.controlsVisibility = isVisible("mv_info"), show("mv_min_header"), hide("mv_info"), hide("mv_top_controls"), isVisible("mv_approve") ? (mvcur.needShowApprove = !
                0, hide("mv_approve")) : mvcur.needShowApprove = !1, Wall.cancelEdit(!0), addClass(mvLayerWrap, "mv_minimized"), mvcur.minSize || (mvcur.minSize = ls.get(
                "mv_minSize"));
            var i = "mv_dark";
            removeClass(mvLayerWrap, i), removeClass(layerBG, i), layers.fullhide = !1, mvcur.minSize && Videoview.enabledResize() && mvcur.minSize.wrap.w || (mvcur.minSize = {
                wrap: {
                    w: 300,
                    h: 198
                }
            });
            var t = mvcur.minSize.wrap;
            mvcur.minSize.player = {
                    w: t.w - 12,
                    h: t.h - 36
                }, Videoview.setStyle("mvContainer", "mv_container", {
                    left: "0px",
                    top: "0px"
                }), setStyle(mvLayer, {
                    width: "auto"
                }), Videoview.minimizePlayer(), window.tooltips && tooltips.destroyAll("mv_container"), removeEvent(window, "resize", Videoview.onResize), removeEvent(document,
                    "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), removeEvent(document, "keydown", Videoview.onKeyDown),
                addEvent(window, "resize", Videoview.minResize), Videoview.enabledResize() ? (addEvent("mv_box", "mousedown", Videoview.startDrag), addEvent("mv_box",
                    "mousemove", Videoview.changeCursor), mvcur.minDestroy = function() {
                    removeEvent("mv_box", "mousedown", Videoview.startDrag), removeEvent("mv_box", "mousemove", Videoview.changeCursor), setStyle("mv_box", {
                        cursor: "default"
                    })
                }) : (addEvent(ge("mv_min_title"), "click", Videoview.unminimize), mvcur.minDestroy = function() {
                    removeEvent("mv_min_title", "click", Videoview.unminimize)
                }), Videoview.setTitle(t.w), Videoview.minResize(), Videoview.setStyle("mvLayerWrap", mvLayerWrap, {
                    width: mvcur.minSize.wrap.w + "px",
                    height: mvcur.minSize.wrap.h + "px"
                }), mvcur.minimized = !0, layers.wraphide(), setTimeout(Videoview.playerOnResize, 10);
            var o = layerQueue.count();
            return mvcur.noLocChange || (Videoview.backLocation(), mvcur.noHistory = 1), layerQueue.skipVideo = !0, o && (debugLog("pop from minimize"), layerQueue.pop()),
                VideoPlaylist.toggleStateClasses(), VideoChat.toggleStateClasses(), Videoview.updateExternalVideoFinishBlock(), !1
        },
        isMinimized: function() {
            return window.mvcur && mvcur.mvShown && mvcur.minimized
        },
        enabledResize: function() {
            return !browser.mobile
        },
        minimizePlayer: function() {
            if (mvcur.mvPlayer = ge("mv_player_box"), mvcur.mvPlayer) {
                var e = {
                    width: mvcur.minSize.player.w + "px",
                    height: mvcur.minSize.player.h + "px"
                };
                Videoview.setStyle("mvPlayer", mvcur.mvPlayer, e), Videoview.playerOnResize()
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
        unminimize: function(e, i, t) {
            if (mvcur.minimized) {
                t || layerQueue.push(), i || (layerQueue.hide(), setTimeout(function() {
                        mvcur.noHistory = 1, layerQueue.noHistory(), layers.wrapshow(mvLayerWrap, .7), layers.fullhide = Videoview.hide
                    }, 0)), Videoview.hidePlayer(!0), mvcur.controlsVisibility && show("mv_info"), hide("mv_min_header"), show("mv_top_controls"), mvcur.minimized = !1,
                    removeClass(mvLayerWrap, "mv_minimized"), Videoview.restoreStyle("mvLayerWrap", mvLayerWrap);
                var o = "mv_dark";
                return addClass(mvLayerWrap, o), addClass(layerBG, o), mvcur.needShowApprove && (mvcur.needShowApprove = !1, show("mv_approve")), Videoview.restoreStyle(
                        "mvContainer", "mv_container"), mvcur.mvPlayer && Videoview.restoreStyle("mvPlayer", mvcur.mvPlayer), setStyle("mv_player_box", {
                        width: "",
                        height: ""
                    }), Videoview.updateSize(), addEvent(window, "resize", Videoview.onResize), addEvent(document,
                        "webkitfullscreenchange mozfullscreenchange fullscreenchange", Videoview.onFullscreenChange), addEvent(document, "keydown", Videoview.onKeyDown),
                    removeEvent(window, "resize", Videoview.minResize), mvcur.minDestroy && mvcur.minDestroy(),
                    mvcur.noLocChange || e === !0 || Videoview.setLocation(), onBodyResize(!0), setStyle(mvLayerWrap, {
                        left: "0px",
                        top: "0px"
                    }), Videoview.showPlayer(!0), Videoview.setTitle(), VideoPlaylist.toggleStateClasses(), mvcur.chatMode && (VideoChat.toggleStateClasses(), VideoChat.updateScroll()),
                    Videoview.viewScroll(), Videoview.playerOnResize(), !1
            }
        },
        toggleSideBlock: function() {
            mvcur.chatMode ? VideoChat.toggle() : VideoPlaylist.toggle()
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
                cur.ddShown && Videoview.hideDD(0), cur.ddShown = i, setTimeout(addEvent.pbind(document, "click", Videoview.hideDD), 1), show(i)
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
        reportComment: function(e, i, t) {
            stManager.add(["privacy.js", "privacy.css"], function() {
                return Privacy.show(e, i, "report_" + t)
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
                t = (ge("mv_top_controls"), getXY("mv_main", !0)[1]),
                o = getSize("mv_player_box")[1];
            e = t - i, e = 0 > e ? -e : 0, toggleClass("mv_top_controls", "fixed", e > 0), toggleClass("mv_pl_prev", "fixed", e > 0), toggleClass("mv_pl_next", "fixed", e > 0),
                toggleClass("mv_top_pl_toggle", "hidden", e > o), mvcur.scrolledAway = e > o / 3, Videoview.playerNextTimerUpdate(), Videoview.updateReplyFormPos()
        },
        updateReplyFormPos: function() {
            var e = ge("mv_reply_form"),
                i = ge("mv_comments_wrap"),
                t = getSize(e),
                o = domPN(e),
                a = clientHeight(),
                d = (mvLayerWrap.scrollTop, getXY(mvLayerWrap)[1]),
                r = getXY("mv_box")[1] - d,
                n = getXY(i)[1] - d,
                s = getSize(i)[1],
                v = getSize("mv_box")[1],
                l = r + v > a && s > 0;
            l ? (addClass(e, "mv_reply_form_fixed"), setStyle(e, {
                bottom: Math.min(a - n - t[1], 0) + "px"
            }), setStyle(o, {
                width: t[0] + "px",
                height: t[1] + "px"
            })) : (removeClass(e, "mv_reply_form_fixed"), setStyle(e, {
                bottom: null
            }), setStyle(o, {
                width: null,
                height: null
            }))
        },
        editInline: function(e) {
            if (!(e && "A" == e.target.tagName || !window.mvcur || mvcur.mvEditing) && ge("mv_description")) {
                var i = mvcur.videoRaw,
                    t = mvcur.mvShown,
                    o = mvcur.mvData,
                    a = !o.desc,
                    d = function(e) {
                        if (mvcur.mvShown && mvcur.videoRaw == i && mvcur.mvShown == t && !mvcur.mvEditing) {
                            Videoview.cleanExpandDescrEls(), mvcur.mvEditing = i;
                            var o = "margin-bottom:" + (browser.chrome || browser.safari ? -4 : 0) + "px",
                                a = ce("div", {
                                    id: "mv_edit_text_wrap",
                                    innerHTML: '<textarea id="mv_edit_text" style="' + o +
                                        '" onkeydown="onCtrlEnter(event, Videoview.saveInline)" onkeyup="checkTextLength(mvcur.maxDescriptionLength, this, ge(\'mv_caption_warn\'));" placeholder="' +
                                        getLang("video_edit_desc_intro") + '">' + e + '</textarea><div id="mv_caption_warn"></div>'
                                });
                            ge("mv_description")
                                .appendChild(a);
                            var d = ge("mv_edit_text");
                            setStyle(d, {
                                width: ge("mv_description")
                                    .offsetWidth + "px"
                            }), placeholderInit(d), autosizeSetup(d, {
                                minHeight: 18,
                                ignorePadding: !0
                            }), setTimeout(function() {
                                show(a), elfocus(d), addEvent(d, "blur", Videoview.saveInline), hide("mv_descr_field")
                            }, 1)
                        }
                    };
                a ? d("") : ajax.post("al_video.php", {
                    act: "edit_desc",
                    oid: o.oid,
                    vid: o.vid
                }, {
                    onDone: d,
                    progress: "mv_inline_edit_pr"
                })
            }
        },
        cancelInline: function() {
            mvcur.mvEditing = !1, removeEvent("mv_edit_text", "blur"), show("mv_descr_field"), re("mv_edit_text_wrap")
        },
        saveInline: function() {
            if (mvcur.mvEditing) {
                removeEvent("mv_edit_text", "blur");
                var e = mvcur.mvEditing,
                    i = mvcur.mvShown,
                    t = mvcur.mvData;
                ajax.post("al_video.php", {
                    act: "save_desc",
                    oid: t.oid,
                    vid: t.vid,
                    hash: t.editHash,
                    desc: val("mv_edit_text")
                }, {
                    onDone: function(o) {
                        t.desc = o;
                        var a = mvcur.mvShown && e == mvcur.videoRaw && i == mvcur.mvShown;
                        if (a) {
                            mvcur.mvEditing = !1;
                            var d = ge("mv_descr_field");
                            val(d, o || '<span class="mv_desc_edit">' + getLang("video_edit_desc") + "</span>"), d.onmouseover = o ? Videoview.descTT.pbind(d) :
                                function() {}, show(d), re("mv_edit_text_wrap")
                        }
                    },
                    progress: "mv_inline_edit_pr"
                })
            }
        },
        onExternalVideoEnded: function(e) {
            e = e || domPN(ge("video_player"));
            var i = getSize(e),
                t = (Videoview.getNextVideosData() || [])[0],
                o = !!window.CanvasRenderingContext2D,
                a = Videoview.getMvData();
            if (e && a && !ge("mv_external_finish")) {
                var d = a.liked,
                    r = a.added,
                    n = a.can_add,
                    s = a.subscribed;
                Videoview.logViewedPercentage();
                var v = "";
                if (t && i[0] >= 400 && i[1] >= 300) v =
                    '<div id="mv_finish_next" class="mv_finish_next" onclick="Videoview.onExternalVideoNext(true)">  <div class="mv_finish_next_caption">' + getLang(
                        "video_player_next_title") + '</div>  <div class="mv_finish_next_thumb" style="background-image: url(' + t.thumb +
                    ')"></div>  <div class="mv_finish_next_timer">    <canvas class="mv_finish_next_timer_canvas" width="100" height="100"></canvas>    <div class="mv_finish_next_timer_play mv_finish_icon"></div>  </div>  <div class="mv_finish_next_info">    <div class="mv_finish_next_title">' +
                    t.title + '</div>    <div class="mv_finish_next_views">' + t.views +
                    '</div>  </div>  <div class="mv_finish_next_cancel mv_finish_icon" onclick="Videoview.onExternalVideoNextCancel(event)"></div></div>    ';
                else if (!ge("video_yt")) return;
                var l = Videoview.getSuggestionsData(),
                    c = "onSuggestionClick";
                l && l.length || (l = Videoview.getNextVideosData(), c = "onVideoNext");
                var m = "";
                l && l.length && i[0] >= 580 && i[1] >= 300 && (m = '<div id="mv_finish_suggestions" class="mv_finish_suggestions ' + (v ? "hidden" : "") + '">', each(l,
                    function(e, i) {
                        m += '<a class="mv_finish_suggestions_item" onclick="videoCallback([\'' + c + "', '" + i.vid + '\']); return false;" href="//vk.com/video' + i.vid +
                            '" title="' + i.title + '">  <div class="mv_finish_suggestions_item_thumb" style="background-image: url(' + i.thumb +
                            ')"></div>  <div class="mv_finish_suggestions_item_title">' + i.title + '</div>  <div class="mv_finish_suggestions_item_views">' + i.views +
                            "</div></a>      "
                    }), m += "</div>");
                var u = !1,
                    _ = !1;
                if (!v && !m) {
                    if (a.noControls || a.nolikes) return;
                    i[0] > 250 && i[1] > 200 ? u = !0 : _ = !0
                }
                var p = window.mvcur && mvcur.minimized,
                    h = se(
                        '<div class="mv_external_finish" id="mv_external_finish" onclick="Videoview.onExternalVideoBgClick(this, event)">  <div class="mv_finish_header">    <div id="mv_finish_subscribe" class="fl_r mv_finish_subscribe ' +
                        (s ? "mv_finish_subscribed" : "") +
                        '">      <button id="mv_finish_subscribe_btn" class="mv_finish_subscribe_btn fl_l" onclick="Videoview.onExternalVideoSubscribe()">' + (s ? getLang(
                            "video_view_subscribed_msg") : getLang("video_view_subscribe_to_author")) + '</button>      <a href="' + a.authorHref +
                        '" target="_blank" class="fl_r"><img class="mv_finish_author_img" src="' + a.authorPhoto +
                        '"></a>    </div>    <div id="mv_finish_title" class="mv_finish_title" style="' + (p ? "display:none" : "") + '">' + a.title +
                        '</div>  </div>  <div id="mv_finish_actions" class="mv_finish_actions ' + (u ? "mv_finish_actions_extended" : "") + " " + (n ? "" :
                            "mv_finish_actions_cant_add") + " " + (_ ? "mv_finish_actions_no_content" : "") + '">    <div class="mv_finish_like ' + (d ? "selected" : "") +
                        '" onclick="Videoview.onExternalVideoLike()">      <div class="mv_finish_like_icon mv_finish_icon"></div>      <div class="mv_finish_liked_icon mv_finish_icon"></div>      <div class="mv_finish_like_text">' +
                        getLang("video_i_like") +
                        '</div>    </div>    <div class="mv_finish_share" onclick="Videoview.onExternalVideoShare()">      <div class="mv_finish_share_icon mv_finish_icon"></div>      <div class="mv_finish_share_text">' +
                        getLang("video_share_with_friends") + '</div>    </div>    <div class="mv_finish_add ' + (r ? "selected" : "") +
                        '" onclick="Videoview.onExternalVideoAdd()">      <div class="mv_finish_add_icon mv_finish_icon"></div>      <div class="mv_finish_added_icon mv_finish_icon"></div>    </div>  </div>  ' +
                        v + "  " + m + "</div>  ");
                a.canSubscribe || re(geByClass1("mv_finish_subscribe", h)), (a.noControls || a.nolikes) && re(geByClass1("mv_finish_actions", h)), e.appendChild(h), o && t &&
                    v && (window.focus(), mvcur.nextTimer = {
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
            Videoview.removeExternalVideoFinishBlock(), mvcur.nextTimer = null, VideoPlaylist.nextVideo(), Videoview.sendPlayerStats(e ? 6 : 5, 4)
        },
        onExternalVideoNextCancel: function(e) {
            e && e.stopPropagation(), clearTimeout(mvcur.nextTimer.timeout), mvcur.nextTimer = null, ge("video_yt") ? (re("mv_finish_next"), removeClass(
                "mv_finish_suggestions", "hidden")) : re("mv_external_finish")
        },
        onExternalVideoBgClick: function(e, i) {
            i.target === e && Videoview.removeExternalVideoFinishBlock()
        },
        onExternalVideoLike: function() {
            videoCallback(["onLike", 4]), Videoview.playerOnLiked()
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
                    t = e.isClosedGroup;
                Videoview.subscribeToAuthor(null, null, e.oid, e.subscribeHash, i, t, !1, "external_player"), Videoview.sendPlayerStats(i ? 9 : 10, 4)
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
        },
        logViewedPercentage: function() {
            if (mvcur && mvcur.mvData && mvcur.mvData.videoRaw && mvcur.mvData.duration) {
                var e = mvcur.mvData.videoRaw,
                    i = mvcur.mvData.duration,
                    t = (new Date)
                    .getTime(),
                    o = mvcur.viewStartedTimestamp;
                if (!o) return !1;
                var a = Math.min(Math.round((t - o) / 1e3), i);
                delete mvcur.viewStartedTimestamp, ajax.post("al_video.php", {
                    act: "a_viewed_percentage",
                    video_raw: e,
                    viewed_time: a,
                    duration: i
                })
            }
        }
    },
    videoview = Videoview,
    VideoPlaylist = {
        VIDEOS_LIMIT: 100,
        lists: {},
        blockTpl: '<div class="mv_playlist" id="video_mvpl" onmouseenter="VideoPlaylist.toggleHeaderButtons(this, true)" onmouseleave="VideoPlaylist.toggleHeaderButtons(this, false)">  <div class="mv_playlist_header clear_fix">    <div class="mv_playlist_header_buttons_wrap unshown">      <div id="mv_pl_autoplay" class="mv_playlist_header_btn %autoplayBtnClass%" onmouseover="VideoPlaylist.showAutoplayTooltip(this);" onclick="VideoPlaylist.toggleAutoplay(this)"><div class="mv_playlist_header_autoplay_icon"></div></div>      <div id="mv_pl_reverse" class="mv_playlist_header_btn _opaque" onmouseover="VideoPlaylist.showReverseTooltip(this);" onclick="VideoPlaylist.toggleReverse(this)"><div class="mv_playlist_header_reverse_icon"></div></div>    </div>    <div class="mv_playlist_header_title">%title%</div>  </div>  <div class="mv_playlist_list">    <div class="mv_playlist_list_cont">      %items%    </div>  </div></div>  ',
        blockItemTpl: '<a class="mv_playlist_item %itemClass%" id="mv_playlist_video%vid%" onclick="return VideoPlaylist.showVideo(\'%vid%\');" data-vid="%vid%" href="/video%vid%">  <div class="mv_playlist_item_thumb" style="background-image: url(\'%thumb%\');">    <div class="mv_playlist_item_duration">%duration%</div>  </div>  <div class="mv_playlist_item_info">    <div class="mv_playlist_item_title">%title%</div>    <div class="mv_playlist_item_views">%views%</div>  </div></a>  ',
        toggleHeaderButtons: function(e, i) {
            toggleClass(domByClass(e, "mv_playlist_header_buttons_wrap"), "unshown", !i)
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
                t = "video_playlist_autoplay_" + (i ? "disable" : "enable") + "_tt",
                o = getLang(t);
            showTooltip(e, {
                text: o,
                shift: [7, 7, 0],
                showdt: 0,
                black: 1
            })
        },
        toggleAutoplay: function(e) {
            var i = !VideoPlaylist.isAutoplayEnabled();
            toggleClass(e, "_active", i), i ? ls.remove("video_playlist_autoplay_disabled") : ls.set("video_playlist_autoplay_disabled", 1), tooltips.destroy(e), VideoPlaylist
                .showAutoplayTooltip(e)
        },
        isAutoplayEnabled: function() {
            return !ls.get("video_playlist_autoplay_disabled")
        },
        toggleReverse: function(e) {
            var i = VideoPlaylist.getCurList();
            i && (i.reversed = !i.reversed, toggleClass(e, "_active", i.reversed), VideoPlaylist.updateBlockList(i.id))
        },
        buildBlock: function(e, i, t) {
            var o = VideoPlaylist.getBlock(),
                a = o ? data(o, "playlist") : !1;
            if (a && a.id == e && !t) return o;
            VideoPlaylist.removeBlock();
            var a = VideoPlaylist.getList(e, i);
            if (!a || a.list.length <= 1) return !1;
            var d = trim(VideoPlaylist.blockTpl),
                r = VideoPlaylist.buildBlockList(a),
                n = se(rs(d, {
                    items: r,
                    title: a.title || "",
                    autoplayBtnClass: VideoPlaylist.isAutoplayEnabled() ? "_active" : ""
                }));
            return data(n, "playlist", a), this._block = n, n
        },
        buildBlockList: function(e) {
            for (var i = trim(VideoPlaylist.blockItemTpl), t = "", o = function() {
                    return e.reversed ? e.list.length - 1 : 0
                }, a = function(i) {
                    return e.reversed ? i >= 0 : i < e.list.length
                }, d = function(i) {
                    return e.reversed ? --i : ++i
                }, r = o(); a(r); r = d(r)) {
                var n, s = e.list[r];
                if (isArray(s)) {
                    var v = s[VideoConstants.VIDEO_ITEM_INDEX_OWNER_ID] + "_" + s[VideoConstants.VIDEO_ITEM_INDEX_ID];
                    n = {
                        vid: v,
                        thumb: s[VideoConstants.VIDEO_ITEM_INDEX_THUMB],
                        title: s[VideoConstants.VIDEO_ITEM_INDEX_TITLE],
                        duration: s[VideoConstants.VIDEO_ITEM_INDEX_DURATION],
                        views: getLang("video_N_views_list", s[VideoConstants.VIDEO_ITEM_INDEX_VIEWS] || 1, !0),
                        itemClass: v == e.current ? "mv_playlist_item_active" : ""
                    }
                } else n = extend({}, s, {
                    itemClass: s.vid == e.current ? "mv_playlist_item_active" : ""
                });
                t += rs(i, n)
            }
            return t
        },
        updateBlockList: function(e) {
            var i = VideoPlaylist.getCurList();
            if (i && i.id == e) {
                var t = VideoPlaylist.getBlock(),
                    o = geByClass1("mv_playlist_list_cont", t),
                    a = VideoPlaylist.buildBlockList(i);
                val(o, a);
                var d = data(t, "sb");
                d && d.update(), VideoPlaylist.setCurVideo(i.current), VideoPlaylist.updateControls()
            }
        },
        getBlock: function() {
            return this._block
        },
        removeBlock: function() {
            var e = data(this._block, "sb");
            e && e.destroy(), re(this._block), removeData(this._block), this._block = null, VideoPlaylist.toggleStateClasses(), VideoPlaylist.updateControls()
        },
        setCurVideo: function(e, i) {
            function t() {
                var e = VideoPlaylist.getBlock();
                if (e) {
                    var i = data(e, "sb");
                    i && i.update()
                }
            }
            var o = VideoPlaylist.getBlock();
            if (o) {
                var a = data(o, "playlist");
                if (a) {
                    e && (a.current = e);
                    var d = domByClass(o, "mv_playlist_item_active");
                    if (e && (removeClass(d, "mv_playlist_item_active"), d = ge("mv_playlist_video" + e), addClass(d, "mv_playlist_item_active")), d) {
                        var r = geByClass1("mv_playlist_list", o),
                            n = getXY(d)[1],
                            s = getSize(d)[1],
                            v = getXY(r)[1],
                            l = getSize(r)[1],
                            c = n - v;
                        if (0 > c || c + s > l) {
                            var m = r.scrollTop + n - v - l / 2 + s / 2;
                            r.scrollTop != m && (i ? animate(r, {
                                scrollTop: m,
                                transition: Fx.Transitions.easeOutCubic
                            }, 450, t) : (r.scrollTop = m, t()))
                        }
                        VideoPlaylist._queueNextVideo(e)
                    }
                }
            }
        },
        getList: function(e, i) {
            if (this.lists[e]) return this.lists[e];
            var t = /^wall_-?\d+$/;
            if (postPlaylistRE = /^post_-?\d+_\d+$/, catPlaylistRE = /^cat_(\d|[\w_])+$/, ownerPlaylistRE = /^-?\d+_-?\d+$/, t.test(e)) return cur.wallVideos && cur.wallVideos[
                e] && this.uniqList(cur.wallVideos[e]);
            if (postPlaylistRE.test(e)) return cur.pageVideosList && cur.pageVideosList[e];
            if (catPlaylistRE.test(e)) return cur.catVideosList && cur.catVideosList[e];
            if (ownerPlaylistRE.test(e)) {
                var o, a, d, r = e.split("_"),
                    n = r[0],
                    s = r[1];
                if (-2 == s ? (o = "all", a = cur.playlistAddedTitle) : -1 == s ? (o = "uploaded", a = cur.playlistUploadedTitle) : (o = "album_" + s, a = cur.playlistTitle),
                    each([cur.silentLoaded, cur.pageVideosList], function(e, i) {
                        return i && i[n] && i[n][o] ? (d = i[n][o], !1) : void 0
                    }), d && d.length) {
                    var v;
                    if (i)
                        for (v = d.length; --v;) {
                            var l = d[v];
                            if (l[0] + "_" + l[1] == i) break
                        } else v = 0;
                    if (d.length > VideoPlaylist.VIDEOS_LIMIT) {
                        var c = positive(v - VideoPlaylist.VIDEOS_LIMIT / 2),
                            m = c + VideoPlaylist.VIDEOS_LIMIT;
                        m > d.length && (c = positive(d.length - VideoPlaylist.VIDEOS_LIMIT), m = d.length), d = d.slice(c, m)
                    }
                    return {
                        id: e,
                        title: a,
                        list: d
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
            for (var t = this.lists[e].list, o = [], a = {}, d = 0, r = 0;;)
                if (t[d] && i[r] && t[d].vid == i[r].vid) a[t[d].vid] || (o.push(t[d]), a[t[d].vid] = 1), ++d, ++r;
                else if (t[d]) a[t[d].vid] || (o.push(t[d]), a[t[d].vid] = 1), ++d;
            else {
                if (!i[r]) break;
                a[i[r].vid] || (o.push(i[r]), a[i[r].vid] = 1), ++r
            }
            return this.lists[e].list = o, this.lists[e]
        },
        uniqList: function(e) {
            for (var i, t = {}, o = 0; i = e.list[o]; ++o) t[i.vid] ? e.list.splice(o, 1) : t[i.vid] = !0;
            return e
        },
        isCollapsed: function() {
            var e = VideoPlaylist.getBlock();
            return !(!e || !data(e, "collapsed"))
        },
        toggle: function(e, i) {
            if (isUndefined(e) && (e = VideoPlaylist.isCollapsed()), !mvcur.minimized || !e) {
                var t = VideoPlaylist.getBlock();
                if (t && VideoPlaylist.isCollapsed() != !e) return data(t, "collapsed", !e), VideoPlaylist.toggleStateClasses(), Videoview.playerOnResize(), Videoview.updateReplyFormPos(),
                    e && (VideoPlaylist.updateScrollbar(), VideoPlaylist.setCurVideo()), !1
            }
        },
        toggleStateClasses: function() {
            var e = !!VideoPlaylist.getBlock(),
                i = Videoview.isMinimized(),
                t = VideoPlaylist.isCollapsed();
            toggleClass("mv_box", "_has_playlist", e && !i), toggleClass("mv_box", "_hide_playlist", e && !i && t);
            var o = "";
            e && (o = getLang(t ? "video_aria_expand_playlist" : "video_aria_minimize_playlist")), attr("mv_top_pl_toggle", "aria-label", o)
        },
        updateScrollbar: function() {
            var e = VideoPlaylist.getBlock();
            if (e) {
                var i = data(e, "sb");
                if (i) i.update(!0, !0);
                else {
                    var t = geByClass1("mv_playlist_list", e),
                        i = new Scrollbar(t, {
                            prefix: "mv_pl_",
                            nokeys: !0,
                            padding: 0
                        });
                    data(e, "sb", i)
                }
            }
        },
        updateControls: function() {
            var e = VideoPlaylist.getCurList(),
                i = VideoPlaylist.getVideoIndex();
            e && e.reversed && (i = e.list.length - i - 1), toggle("mv_pl_prev", !!e && i > 0), toggle("mv_pl_next", !!e && i < e.list.length - 1)
        },
        showVideo: function(e) {
            var i = VideoPlaylist.getCurList();
            if (i) {
                if (VideoPlaylist.saveScrollPos(), mvcur.options.params && "direct" == mvcur.options.params.module && mvcur.mvPrevLoc && Videoview.backLocation(), i.loaded &&
                    i.loaded.vid == e) {
                    var t = i.loaded;
                    Videoview.show(null, e, t.listId, extend(t.options, {
                        playlistId: i.id
                    })), Videoview.showVideo.apply(Videoview, t.hubData);
                    var o = mvcur.preloadStatsHashes ? mvcur.preloadStatsHashes[e] : "";
                    o && ajax.post("/al_video.php", {
                        act: "a_inc_preload_stats",
                        stat_preload_hash: o
                    }), i.loaded = !1
                } else {
                    var a = VideoPlaylist.getVideoIndex(e),
                        d = i.reversed ? i.list.length - a : a,
                        r = d < i.list.length - 1 ? 1 : 0,
                        n = i.list[a][11];
                    showVideo(e, n, {
                        autoplay: 1,
                        playlistId: i.id,
                        addParams: {
                            force_no_repeat: 1,
                            show_next: r
                        },
                        module: Videoview.getVideoModule()
                    })
                }
                return !1
            }
        },
        saveScrollPos: function() {
            var e = VideoPlaylist.getBlock(),
                i = domByClass(e, "mv_playlist_list");
            data(e, "savedScrollTop", i.scrollTop)
        },
        restoreScrollPos: function() {
            var e = VideoPlaylist.getBlock(),
                i = domByClass(e, "mv_playlist_list"),
                t = data(e, "savedScrollTop");
            t && (i.scrollTop = t)
        },
        _queueNextVideo: function(e) {
            var i = VideoPlaylist.getCurList();
            if (i) {
                e = e || i.current;
                var t = VideoPlaylist._getNextVideoIndex(e);
                if (-1 != t) {
                    var o = i.list[t],
                        a = isArray(o) ? o[0] + "_" + o[1] : o.vid,
                        d = isArray(o) ? "" : o.hash;
                    if (i.queued != a && (!i.loaded || i.loaded.vid != a)) {
                        i.loaded = !1, i.queued = a;
                        var r = t < i.list.length - 1 ? 1 : 0;
                        showVideo(a, d, {
                            hidden: function(e, t, o, a) {
                                i.queued == a && (i.loaded = {
                                    vid: a,
                                    hubData: e,
                                    options: t,
                                    listId: o
                                }), i.queued = !1
                            },
                            module: Videoview.getVideoModule(a),
                            addParams: {
                                autoplay: 1,
                                force_no_repeat: 1,
                                preload: 1,
                                show_next: r,
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
                t = VideoPlaylist._getNextVideoIndex();
            if (!i || 0 > t) return e;
            for (; e.length < 3 && t >= 0 && t < i.list.length;) {
                var o, a = i.list[t];
                o = isArray(a) ? {
                    vid: a[VideoConstants.VIDEO_ITEM_INDEX_OWNER_ID] + "_" + a[VideoConstants.VIDEO_ITEM_INDEX_ID],
                    thumb: a[VideoConstants.VIDEO_ITEM_INDEX_THUMB],
                    views: getLang("video_N_views_list", a[VideoConstants.VIDEO_ITEM_INDEX_VIEWS], !0),
                    title: a[VideoConstants.VIDEO_ITEM_INDEX_TITLE],
                    duration: a[VideoConstants.VIDEO_ITEM_INDEX_DURATION]
                } : a, e.push(o), t += i.reversed ? -1 : 1
            }
            return e
        },
        prevVideo: function() {
            var e = VideoPlaylist.getCurList();
            if (e) {
                var i = VideoPlaylist.getVideoIndex() + (e.reversed ? 1 : -1);
                if (!(0 > i)) {
                    var t = e.list[i],
                        o = isArray(t) ? t[0] + "_" + t[1] : t.vid;
                    VideoPlaylist.showVideo(o)
                }
            }
        },
        nextVideo: function() {
            var e = VideoPlaylist.getCurList();
            if (e) {
                var i = VideoPlaylist._getNextVideoIndex();
                if (!(0 > i)) {
                    var t = e.list[i],
                        o = isArray(t) ? t[0] + "_" + t[1] : t.vid;
                    VideoPlaylist.showVideo(o)
                }
            }
        },
        getVideoIndex: function(e) {
            var i = VideoPlaylist.getCurList();
            if (!i) return -1;
            if (e || (e = i.current), !e) return -1;
            var t = -1;
            return each(i.list, function(i, o) {
                var a = isArray(o) ? o[0] + "_" + o[1] : o.vid;
                return a == e ? (t = i, !1) : void 0
            }), t
        },
        _getNextVideoIndex: function(e) {
            var i = VideoPlaylist.getCurList();
            if (!i) return -1;
            var t = VideoPlaylist.getVideoIndex(e);
            if (0 > t) return 0;
            var o = t + (i.reversed ? -1 : 1);
            return o >= 0 && o < i.list.length ? o : -1
        }
    },
    VideoChat = {
        SCROLL_EDGE_BELOW_THRESHOLD: 20,
        init: function(e) {
            VideoChat.block && VideoChat.destroy(), e && (VideoChat.block = e, VideoChat.messagesWrap = domByClass(e, "mv_chat_messages_wrap"), VideoChat.scroll = new uiScroll(
                    domFC(VideoChat.messagesWrap), {
                        reversed: !0,
                        preserveEdgeBelow: !0,
                        preserveEdgeBelowThreshold: VideoChat.SCROLL_EDGE_BELOW_THRESHOLD,
                        theme: "videoview",
                        onupdate: VideoChat.onScrollUpdate
                    }), this.scrollBottomBtnWrap = domByClass(e, "mv_chat_new_messages_btn_wrap"), VideoChat.replyForm = domByClass(e, "mv_chat_reply_form"), VideoChat.replyForm &&
                (VideoChat.replyInput = domByClass(e, "mv_chat_reply_input"), VideoChat.initReplyInput()), VideoChat.firstMsgIntro = domByClass(e,
                    "mv_chat_first_message_intro"))
        },
        initReplyInput: function() {
            placeholderInit(VideoChat.replyInput, {
                editable: 1
            }), stManager.add(["emoji.js", "notifier.css"], function() {
                var e = Emoji.init(VideoChat.replyInput, {
                    controlsCont: VideoChat.replyForm,
                    noLineBreaks: 1,
                    noCtrlSend: 1,
                    onSend: function() {
                        VideoChat.sendMessage()
                    },
                    checkEditable: function() {
                        VideoChat.checkFormHeight(), VideoChat.checkTextLen()
                    },
                    onStickerSend: function(e, i) {
                        VideoChat.sendMessage(e)
                    }
                });
                data(VideoChat.replyForm, "optId", e)
            })
        },
        checkFormHeight: function() {
            var e = VideoChat.replyForm,
                i = e.offsetHeight;
            if (e.lastHeight !== i) {
                e.lastHeight = i;
                var t = !VideoChat.scroll.data.scrollBottom;
                setStyle(VideoChat.messagesWrap, {
                    bottom: i + "px"
                }), t && VideoChat.scroll.scrollBottom()
            }
        },
        checkTextLen: function() {
            var e = VideoChat.replyInput,
                i = trim(Emoji.editableVal(e));
            if (e.lastLen !== i.length) {
                var t = e.lastLen = i.length,
                    o = mvcur.maxChatReplyLength;
                t > o ? showTooltip(e, {
                    text: getLang("video_live_chat_msg_too_long"),
                    black: 1
                }) : window.tooltips && tooltips.destroy(e)
            }
        },
        mentionOver: function(e) {
            return mentionOver(e, {
                shift: [-20, 7, 7]
            })
        },
        stickerClick: function(e, i, t) {
            return stManager.add(["emoji.js", "notifier.css"], function() {
                Emoji.clickSticker(e, i, t)
            }), !1
        },
        onScrollUpdate: function(e) {
            e.data.scrollBottom < VideoChat.SCROLL_EDGE_BELOW_THRESHOLD && VideoChat.toggleScrollBottomBtn(!1)
        },
        receiveMessage: function(e, i, t, o, a, d, r, n) {
            r && (d = getTemplate("video_chat_sticker", {
                sticker_id: r,
                pack_id: n,
                img_size: isRetina() ? 256 : 128
            }));
            var s = psr(getTemplate("video_chat_message", {
                author_href: a,
                author_photo: o,
                author_name: t,
                message: d,
                video_owner_id: e,
                msg_id: i
            }));
            VideoChat.appendMessage(s, i)
        },
        receiveDelete: function(e, i) {
            VideoChat.scroll.updateAbove(function() {
                re("mv_chat_msg" + e + "_" + i)
            })
        },
        appendMessage: function(e, i) {
            if (!ge("mv_chat_msg" + mvcur.mvData.oid + "_" + i)) {
                VideoChat.firstMsgIntro && (re(VideoChat.firstMsgIntro), VideoChat.firstMsgIntro = null);
                var t = VideoChat.scroll.content,
                    o = se(e);
                VideoChat.scroll.updateBelow(function() {
                    t.appendChild(o)
                });
                var a = t.childNodes;
                a.length > 500 && VideoChat.scroll.updateAbove(function() {
                    re(a[0])
                }), !VideoChat.isHidden() && VideoChat.scroll.data.scrollBottom > o.offsetHeight && VideoChat.toggleScrollBottomBtn(!0)
            }
        },
        toggleScrollBottomBtn: function(e) {
            toggleClass(this.scrollBottomBtnWrap, "hidden", !e)
        },
        scrollBottom: function() {
            VideoChat.scroll.scrollBottom(0, !0)
        },
        sendMessage: function(e) {
            if (!VideoChat.messageSending) {
                var i = {};
                if (e) i = {
                    message: "",
                    attach1_type: "sticker",
                    attach1: e
                };
                else if (i = {
                        message: trim(Emoji.val(VideoChat.replyInput))
                    }, !i.message) return void elfocus(VideoChat.replyInput);
                if (vkNow() - VideoChat.lastMsgSent < 1e3) return window.tooltips && tooltips.destroy(VideoChat.replyInput), void showTooltip(VideoChat.replyInput, {
                    text: getLang("video_live_chat_too_fast"),
                    black: 1
                });
                ajax.post("al_video.php", Wall.fixPostParams(extend(i, {
                    act: "post_comment",
                    video: mvcur.mvData.videoRaw,
                    hash: mvcur.mvData.hash,
                    fromview: 1,
                    videoviewer_chat: 1
                })), {
                    onDone: function(e, i) {
                        VideoChat.messageSending = !1, e && i && VideoChat.appendMessage(e, i), Emoji.val(VideoChat.replyInput, ""), VideoChat.checkFormHeight(),
                            VideoChat.scroll.data.scrollBottom && VideoChat.scrollBottom(), VideoChat.lastMsgSent = vkNow()
                    },
                    onFail: function(e) {
                        return VideoChat.messageSending = !1, VideoChat.replyInput ? (window.tooltips && tooltips.destroy(VideoChat.replyInput), showTooltip(
                            VideoChat.replyInput, {
                                text: e,
                                showdt: 200,
                                forcetodown: 0,
                                slide: 15,
                                black: 1
                            }), elfocus(VideoChat.replyInput), !0) : void 0
                    }
                }), VideoChat.messageSending = !0
            }
        },
        isHidden: function() {
            return !!this.hidden
        },
        setHidden: function(e) {
            this.hidden = e
        },
        toggle: function() {
            var e = VideoChat.isHidden();
            this.setHidden(!e), VideoChat.toggleStateClasses(), e && VideoChat.scroll && VideoChat.updateScroll()
        },
        toggleStateClasses: function() {
            var e = !!this.block,
                i = VideoChat.isHidden(),
                t = Videoview.isMinimized();
            toggleClass("mv_box", "_has_chat", e && !t), toggleClass("mv_box", "_hide_chat", e && !t && i);
            var o = "";
            e && (o = getLang(i ? "video_aria_expand_playlist" : "video_aria_minimize_playlist")), attr("mv_top_pl_toggle", "aria-label", o)
        },
        updateScroll: function() {
            VideoChat.scroll.update(), VideoChat.scroll.scrollBottom(), VideoChat.toggleScrollBottomBtn(!1)
        },
        destroy: function() {
            if (VideoChat.block) {
                if (VideoChat.scroll && (VideoChat.scroll.destroy(), VideoChat.scroll = null), VideoChat.replyForm) {
                    var e = data(VideoChat.replyForm, "optId");
                    e && Emoji.destroy(e), removeData(VideoChat.replyForm), removeData(VideoChat.replyInput), VideoChat.replyForm = VideoChat.replyInput = null
                }
                removeData(VideoChat.block), re(VideoChat.block), VideoChat.block = null, VideoChat.firstMsgIntro = null, VideoChat.messageSending = !1
            }
        }
    };
try {
    stManager.done("videoview.js")
} catch (e) {}
