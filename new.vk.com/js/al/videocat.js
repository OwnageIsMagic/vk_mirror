var Videocat = window.Videocat || {
    VIDEO_MODULE: "videocat",
    subscribeToChannel: function(e, o, t) {
        if (!buttonLocked(e)) {
            var s = hasClass(e, "secondary"),
                i = {
                    showProgress: lockButton.pbind(e),
                    hideProgress: unlockButton.pbind(e),
                    onDone: function() {
                        toggleClass(e, "secondary")
                    }
                };
            ajax.post("al_groups.php", {
                act: s ? "a_leave" : "a_enter",
                gid: o,
                hash: t,
                from: "videocat"
            }, i)
        }
    },
    moreUGC: function(e) {
        var o = geByClass("video_item", gpeByClass("video_block_layout", e)),
            t = 0,
            s = 0;
        each(o, function() {
            return isVisible(this) || (removeClass(this, "video_skip_thumb_load"), t++), s++, 9 == t ? !1 : void 0
        }), s >= o.length && re(e)
    },
    moreSeries: function(e) {
        var o = geByClass("videocat_featured_playlist", gpeByClass("video_block_layout", e)),
            t = 0,
            s = 0;
        each(o, function() {
            return isVisible(this) || (removeClass(this, "videocat_featured_playlist_hidden"), t++), s++, 16 == t ? !1 : void 0
        }), s >= o.length && re(e)
    },
    moreChannels: function(e, o) {
        var t = !1;
        if (each(cur.moreChannelsInfo, function(e, s) {
                return s.cat_id == o ? (t = s, !1) : void 0
            }), cur.moreChannelsOffsets = cur.moreChannelsOffsets || {}, t) {
            var s = 0,
                i = gpeByClass("video_block_layout", e);
            s = cur.moreChannelsOffsets[o] ? cur.moreChannelsOffsets[o] : geByClass("videocat_row", i)
                .length, ajax.post("al_video.php", {
                    act: "a_more_channels",
                    cat_id: o,
                    offset: s,
                    channels: t.channels.join(",")
                }, {
                    showProgress: lockButton.pbind(e),
                    hideProgress: unlockButton.pbind(e),
                    onDone: function(s, a) {
                        cur.moreChannelsOffsets[o] = a, each(s, function(o, t) {
                            i.insertBefore(se(trim(t)), domPN(e))
                        }), a >= t.channels.length - 1 && re(domPN(e))
                    }
                })
        } else re(domPN(e))
    },
    updateTitle: function(e) {
        e.getAttribute("title") && e.scrollWidth <= e.clientWidth && e.removeAttribute("title")
    },
    _onScroll: function() {
        if (Video.isInCatalog()) {
            var e = [];
            each(geByClass("videocat_page_block"), function() {
                0 === this.getAttribute("data-type")
                    .indexOf("cat_") && e.push(this)
            });
            var o = getXY(e[e.length - 1]);
            if (!cur.videocatLoadingMoreCats && clientHeight() + scrollGetY() > o[1]) {
                cur.videocatLoadingMoreCats = !0;
                var t = [];
                each(cur.moreChannelsInfo, function(e, o) {
                    t.push(o.cat_id + ":" + o.channels.join(","))
                });
                var s = cur.moreCatsOffsets = cur.moreCatsOffsets || e.length;
                ajax.post("al_video.php", {
                    act: "a_more_cats",
                    offset: s,
                    cats: t.join("/")
                }, {
                    onDone: function(e, o) {
                        var t = ge("videocat_other_blocks");
                        each(e, function(e, o) {
                            t.appendChild(se(trim(o)))
                        }), cur.catVideosList = extend(cur.catVideosList, o)
                    }
                })
            }
        }
    },
    init: function(e, o, t, s, i, a) {
        function n() {
            removeEvent(window, "scroll", cur._videocat_onScroll)
        }
        cur._videocatInited || (cur._videocatInited = !0, Videocat.lists = extend(Videocat.lists || {}, s), Videocat.moreBlocks = e, Videocat.feedData = o, Videocat.preloadLists =
            t, Videocat.top3playlists = i, Videocat.moreChannelsInfo = a, cur.videoCatRecomsLoaded = !1, cur._sessionChannelsSubscriptions = [], cur._videocat_onScroll &&
            removeEvent(window, "scroll", cur._videocat_onScroll), addEvent(window, "scroll", cur._videocat_onScroll = Videocat._onScroll), cur.destroy.push(n), cur._back
            .hide.push(n))
    },
    show: function(e, o, t, s, i, a) {
        return checkEvent(o) ? !0 : (showVideo(t, s, {
            playlistId: i,
            autoplay: 1,
            module: ["feed_block", "feed_recoms_block"].indexOf(i) >= 0 ? i : Videoview.getVideoModule(t),
            addParams: {
                force_no_repeat: 1,
                show_next: i ? 1 : 0,
                playlist_id: i
            }
        }), !1)
    },
    extendSlider: function(e, o) {
        e && (o = trim(o), o && (o = se(o), o && (Videocat._sliderExtends = Videocat._sliderExtends || [], Videocat._sliderExtends.push(function() {
            var t = geByClass1("videocat_row_slider_items_cont", e);
            each(geByClass("video_item", o), function(e, o) {
                t.appendChild(o)
            });
            var s = geByClass1("videocat_row_slider_btn_right", e);
            Videocat.slideRow(s, -3, !0), Videocat.slideRow(s, 3, !0)
        }))))
    },
    sliderSubscribeTo: function(e, o, t, s) {
        var i = gpeByClass("videocat_row", e),
            a = geByClass1("videocat_block_subscribe", i),
            n = geByClass1("videocat_block_unsubscribe", i);
        ajax.post("/al_video.php", {
            act: "a_subscribe",
            hash: t,
            gid: o,
            unsubscribe: +(s || 0),
            from: "recomm_page"
        }, {
            showProgress: function() {
                lockButton(e)
            },
            hideProgress: function() {
                unlockButton(e)
            },
            onDone: function() {
                s ? (hide(n), show(a), cur._sessionChannelsSubscriptions[-o] = !1) : (hide(a), show(n), cur._sessionChannelsSubscriptions[-o] = !0)
            },
            onError: unlockButton(e)
        })
    },
    subscribeTo: function(e, o, t, s) {
        function i() {
            s ? hide("video_channel_subs_progress") : unlockButton(e)
        }
        ajax.post("/al_video.php", {
            act: "a_subscribe",
            hash: t,
            gid: o,
            unsubscribe: +(s || 0)
        }, {
            showProgress: function() {
                s ? (hide("video_channel_subscribe_msg"), show("video_channel_subs_progress")) : lockButton(e)
            },
            hideProgress: i,
            onDone: function() {
                Videocat.onChannelSubscribed(o, t, s)
            },
            onError: i
        })
    },
    onChannelSubscribed: function(e, o, t) {
        var s = ge("video_channel_subscribe_msg"),
            i = ge("video_channel_subscribe");
        if (t) show(i), hide(s), cur._sessionChannelsSubscriptions[-e] = !1;
        else {
            cur._sessionChannelsSubscriptions[-e] = !0;
            var a = getLang("video_you_are_subscribed");
            a = rs(a, {
                channelId: e,
                subsHash: o
            }), hide(i), show(s), s.innerHTML = a
        }
    },
    gotoChannel: function(e, o, t, s, i, a, n) {
        if (e && checkEvent(e)) return !0;
        var c = "channel" + o;
        return cur._channels = cur._channels || {}, "undefined" != typeof cur._sessionChannelsSubscriptions[-o] && (a = cur._sessionChannelsSubscriptions[-o]), cur._channels[
            o] = {
            oid: o,
            shortTitle: t,
            thumb: s,
            href: i,
            isSubscribed: a,
            subsHash: n
        }, cur.videoList[c] = {
            needPreload: !0
        }, nav.change({
            section: c
        }), !1
    },
    gotoCategory: function(e, o, t) {
        return e && checkEvent(e) ? !0 : (cur.categoryTitle = t, nav.change({
            section: "cat_" + o
        }), !1)
    },
    collapseUGCPopular: function() {
        var e = gpeByClass("videocat_row", ge("videocat_header_ugc_popular"));
        each(geByClass("videocat_row_item", e), function(e) {
            toggle(this, 12 > e)
        })
    },
    showMore: function(e, o, t) {
        var s = e.previousElementSibling,
            i = !1,
            a = !1;
        each(s.children, function(e, t) {
            if (!isVisible(t)) {
                if (i) return a = !0, !1;
                show(t), o--, o || (i = !0)
            }
        }), "recom" == t ? toggle(e, Videocat.currRecomParams.more) : toggle(e, a), "recom" == t && ajax.post("/al_video.php", {
            act: "a_fetch_next_recoms",
            from: Videocat.currRecomParams.from,
            offset: +Videocat.currRecomParams.offset,
            more: +Videocat.currRecomParams.more,
            params_sig: Videocat.currRecomParams.params_sig
        }, {
            onDone: function(o, t, s) {
                Videocat.currRecomParams = t;
                for (var i = geByClass1("videocat_grid_wrap", domPN(e)), a = se(trim(o))
                        .children; a.length;) i.appendChild(a[0]), hide(a[0]);
                t && t.more || re(e), s && s.recom && s.recom.list.length && Videocat.lists.recoms && (Videocat.lists.recoms.list = Videocat.lists.recoms.list.concat(
                    s.recom.list))
            }
        })
    },
    showMoreBlocks: function(e) {
        var o = Videocat.moreBlocks[0];
        Videocat.moreBlocks = Videocat.moreBlocks.slice(1);
        var t = Videocat.moreBlocks.length > 0,
            s = geByClass1("videocat_more_toggle_text", e),
            i = geByClass1("videocat_more_toggle_progress", e);
        ajax.post("/al_video.php", {
            act: "a_fetch_next_blocks",
            list: o
        }, {
            showProgress: function() {
                hide(s), show(i)
            },
            hideProgress: function() {
                show(s), hide(i), toggle(e, t)
            },
            onDone: function(o, t) {
                t && !isEmpty(t) && (Videocat.lists = extend(Videocat.lists, t));
                for (var s = ge("videocat_page"), i = se(trim(o))
                        .children; i.length;) s.insertBefore(i[0], e)
            }
        })
    },
    slideRow: function(e, o, t) {
        function s(e, o) {
            e ? addEvent(o, "mouseleave", function() {
                setStyle(o, "pointer-events", "none"), removeEvent(o, "mouseleave")
            }) : setStyle(o, "pointer-events", "all")
        }
        var i = domPN(e),
            a = geByClass1("videocat_row_slider_items_cont", i),
            n = gpeByClass("videocat_row_slider", e),
            c = getSize(a.children[0])[0],
            r = 3,
            d = r * (o > 0 ? 1 : -1),
            l = d + (data(a, "items_offset") || 0);
        l = Math.min(l, 0), l = Math.max(l, -a.children.length + r), data(a, "items_offset", l);
        var u;
        u = 0 == l ? 15 : -l == a.children.length - r ? 56 : 37, setStyle(a, {
            left: c * l + u
        });
        var _ = geByClass1("videocat_row_slider_btn_left", i),
            h = geByClass1("videocat_row_slider_btn_right", i),
            f = 0 == l,
            v = -(l - r) >= a.children.length;
        if (toggleClass(_, "videocat_row_slider_hidden", f), toggleClass(h, "videocat_row_slider_hidden", v), s(f, _), s(v, h), f && Videocat.slideMouseLeave(_, "right"),
            v && Videocat.slideMouseLeave(h, "left"), toggleClass(n, "videocat_slider_offseted", !f && !v), cur._slideTimeouts = cur._slideTimeouts || [], each(cur._slideTimeouts,
                function(e, o) {
                    clearTimeout(o)
                }), each(geByClass("video_item", i), function(e) {
                e >= -l + r && -l + 2 * r > e && removeClass(this, "video_skip_thumb_load"), e == -l - 1 || e == -l + r ? ! function(e) {
                    cur._slideTimeouts.push(setTimeout(function() {
                        addClass(e, "videocat_item_transparent")
                    }, 270))
                }(this) : removeClass(this, "videocat_item_transparent")
            }), !t && Videocat._sliderExtends && (each(Videocat._sliderExtends, function(e, o) {
                o()
            }), Videocat._sliderExtends = []), !t && 0 > o) {
            var g = gpeByClass("videocat_row", e),
                m = g ? g.getAttribute("data-type") : "";
            if (m) {
                m = intval(m), Videocat.slideLoadMore(g, m)
            }
            if (!Videocat.feedDataLoading && g && "feed" == g.getAttribute("data-block-id") && Videocat.feedData && !isEmpty(Videocat.feedData)) {
                Videocat.feedDataLoading = !0;
                var p = Videocat.feedData;
                p.act = "a_fetch_next_feed", p.module = cur.module, ajax.post("al_video.php", p, {
                    onDone: function(e, o, t, s, i) {
                        Videocat.feedData = extend(Videocat.feedData, {
                            video_feed_from: t,
                            video_feed_offset: s,
                            hash: i
                        }), t || (Videocat.feedData = !1), o && o.feed && (Videocat.lists.feed = Videocat.lists.feed || {}, Videocat.lists.feed.list =
                            Videocat.lists.feed.list.concat(o.feed.list)), Videocat.extendSlider(g, e), Videocat.feedDataLoading = !1
                    }
                })
            }
        }
    },
    slideLoadMore: function(e, o, t) {
        var s = cur.moreVideosInfo[o];
        s && (cur.moreVideosInfo[o] = !1, ajax.post("al_video.php", {
            act: "a_more_videos",
            type: o,
            videos: s.join(",")
        }, {
            onDone: function(o, s) {
                Videocat.extendSlider(e, o), each(s, function(e, o) {
                    cur.catVideosList[e].list = cur.catVideosList[e].list.concat(o.list)
                }), isFunction(t) && t()
            }
        }))
    },
    slideMouseEnter: function(e, o) {
        var t = domPN(e),
            s = geByClass1("videocat_row_slider_items_cont", t);
        hasClass(e, "videocat_row_slider_hidden") || addClass(s, "videocat_row_slider_shift_" + o)
    },
    slideMouseLeave: function(e, o) {
        var t = domPN(e),
            s = geByClass1("videocat_row_slider_items_cont", t);
        removeClass(s, "videocat_row_slider_shift_" + o)
    },
    toggleRepeat: function(e, o) {
        var t = "playlistAutoplay",
            s = ls.get(t);
        ls.set(t, !s), toggleClass(o, "video_header_btn_active", s)
    },
    isAutoplayEnabled: function() {
        return !1
    },
    closeBlock: function(e, o, t) {
        var s = gpeByClass("videocat_row", e);
        setStyle(s, {
                "max-height": getSize(s)[1]
            }), setTimeout(function() {
                addClass(s, "videocat_row_closed")
            }), ajax.post("al_video.php", {
                act: "a_videocat_closeblock",
                block_id: o,
                hash: t
            }), window.tooltips && tooltips.hideAll(), 1 == domPN(s)
            .children.length && setTimeout(function() {
                re(gpeByClass("videocat_page_block", s))
            }, 500)
    },
    isTop3Playlist: function(e) {
        var o = !1;
        return each(Videocat.top3playlists || [], function(t, s) {
            return s == e ? (o = !0, !1) : void 0
        }), o
    }
};
try {
    stManager.done("videocat.js")
} catch (e) {}
