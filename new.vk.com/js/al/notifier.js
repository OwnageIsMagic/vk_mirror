function IdleManager(t) {
    this.started = !1, this.is_idle = !0, this.is_activated = !1, this.cbActiveB = this.cbActive.bind(this), this.cbInactiveB = this.cbInactive.bind(this), this.cbInactiveB = this
        .cbInactive.bind(this), this.opts = extend({
            triggerEvents: "mousemove keydown",
            onIdleCb: function() {},
            onUnIdleCb: function() {},
            focusElement: t.element,
            element: null,
            idleTimeout: 3e4
        }, t)
}

function Sound(t, e) {
    var i, a = !1,
        s = this;
    if (!t) throw "Undefined filename";
    e = e || {};
    try {
        var o = ce("audio");
        a = !!o.canPlayType, "no" != o.canPlayType("audio/mpeg") && "" != o.canPlayType("audio/mpeg") ? i = ".mp3?1" : "no" == o.canPlayType('audio/ogg; codecs="vorbis"') || "" ==
            o.canPlayType('audio/ogg; codecs="vorbis"') || e.forceMp3 ? a = !1 : i = ".ogg?1"
    } catch (r) {}
    var n = e.forcePath || "/" + t + i;
    if (a) {
        o.src = n;
        var c = !1;
        o.addEventListener("ended", function() {
            c = !0
        }, !0), o.load(), this.playSound = function() {
            c && o.load(), o.play(), c = !1
        }, this.pauseSound = function() {
            o.pause()
        }
    } else {
        cur.__sound_guid = cur.__sound_guid || 0;
        var l = ge("flash_sounds_wrap") || utilsNode.appendChild(ce("span", {
                id: "flash_sounds_wrap"
            })),
            u = "flash_sound_" + cur.__sound_guid++,
            e = {
                url: "/swf/audio_lite.swf?4",
                id: u
            },
            d = {
                swliveconnect: "true",
                allowscriptaccess: "always",
                wmode: "opaque"
            };
        if (renderFlash(l, e, d, {})) {
            var h = browser.msie ? window[u] : document[u],
                f = !1,
                p = setInterval(function() {
                    if (h && h.paused) try {
                        h.setVolume(1), h.loadAudio(n), h.pauseAudio()
                    } catch (t) {
                        debugLog(t)
                    }
                    f = !0, clearInterval(p)
                }, 300);
            s.playSound = function() {
                f && h.playAudio(0)
            }, s.pauseSound = function() {
                f && h.pauseAudio()
            }
        }
    }
}

function getWndInner() {
    var t = lastWindowWidth,
        e = lastWindowHeight,
        i = sbWidth();
    return (lastWndScroll[0] !== !1 ? lastWndScroll[0] : browser.msie6 ? pageNode.scrollHeight > pageNode.clientHeight : !browser.msie6 && htmlNode.scrollHeight > htmlNode.clientHeight) &&
        (t -= i + (i ? 1 : 0)), [e, t]
}

function updateWndVScroll() {
    var t = window,
        e = (getWndInner(), !1);
    e = t.boxLayerWrap && isVisible(boxLayerWrap) ? boxLayerWrap.scrollHeight > boxLayerWrap.clientHeight ? 1 : 0 : t.layerWrap && isVisible(layerWrap) ? layerWrap.scrollHeight >
        layerWrap.clientHeight ? 1 : 0 : t.mvLayerWrap && isVisible(mvLayerWrap) ? mvLayerWrap.scrollHeight > mvLayerWrap.clientHeight ? 1 : 0 : !1, each(curRBox.tabs, function(t) {
            this.options.marginFixedToLayer && setStyle(this.wrap, {
                marginRight: hasClass(document.body, "layers_shown") ? sbWidth() : 0
            })
        }), e !== lastWndScroll[0] && (lastWndScroll[0] = e, each(curRBox.tabs, function(t) {
            this.toRight && !this.options.marginFixedToLayer && setStyle(this.wrap, {
                marginRight: e ? sbWidth() : 0
            })
        }))
}

function defBox(t, e) {
    var i = '<div class="' + (t.subClass || "") +
        '"><div class="fc_tab_head"><a class="fc_tab_close_wrap fl_r"><div class="chats_sp fc_tab_close"></div></a><div class="fc_tab_title noselect">%title%</div></div><div id="fc_ctabs_cont"><div class="fc_ctab fc_ctab_active">%content%</div></div></div></div>';
    if (t.content) var a = '<div class="fc_content_wrap"><div class="fc_content">' + t.content + "</div></div>";
    else var a = t.innerHTML;
    var s = se(rs(i, {
            title: t.title,
            content: a
        })),
        a = geByClass1("fc_content", s, "div"),
        o = {
            movable: geByClass1("fc_tab_head", s),
            hider: geByClass1("fc_tab_close_wrap", s, "a"),
            startLeft: t.x,
            startTop: t.y,
            startHeight: t.height,
            startWidth: t.width,
            resizeableH: a,
            resize: !1,
            minH: t.minH,
            onBeforeHide: t.onBeforeHide || function() {},
            onHide: t.onHide || function() {},
            onDragEnd: function(t, e) {},
            onResize: function(t, e) {}
        },
        r = new RBox(s, extend(o, t));
    if (t.content) var n = new Scrollbar(a, {
        prefix: "fc_",
        more: debugLog,
        nomargin: !0,
        global: !0,
        nokeys: !0,
        right: vk.rtl ? "auto" : 0,
        left: vk.rtl ? 0 : "auto",
        onHold: t.onHold
    });
    return e({
        id: r.id,
        cont: a,
        update: function() {
            n && n.update()
        }
    }), r
}

function RBox(t, e) {
    var i = this,
        a = {
            minH: 50,
            minW: 50
        };
    i.options = e = extend(a, e), i.content = t;
    var s = i.id = "rb_box_" + (e.id || curRBox.guid++);
    i.wrap = ce("div", {
        id: s,
        className: "rb_box_wrap fixed" + (e.fixed ? " fc_fixed" : "")
    });
    var o = {};
    i.toBottom = i.toRight = !1, e.fixed ? (o.bottom = 0, o.right = 72) : (void 0 !== e.startTop ? o.top = e.startTop : void 0 !== e.startBottom && (o.bottom = e.startBottom),
            void 0 !== e.startLeft ? o.left = e.startLeft : void 0 !== e.startRight && (o.right = e.startRight)), setStyle(i.wrap, o), e.movable && addEvent(e.movable, "mousedown",
            i._head_mdown.bind(i)), i.resizeableH = e.resizeableH || t, e.startHeight && setStyle(i.resizeableH, "height", e.startHeight), i.resizeableW = e.resizeableW || t, e.startWidth &&
        setStyle(i.resizeableW, "width", e.startWidth), addEvent(t, "mousedown", i._cont_mdown.bind(i)), e.closer && (addEvent(e.closer, "mousedown", i._close_mdown.bind(i)),
            addEvent(e.closer, "click", i._close_click.bind(i))), e.hider && (addEvent(e.hider, "mousedown", i._close_mdown.bind(i)), addEvent(e.hider, "click", i._hide_click.bind(
            i))), e.minimizer && e.minimizer !== !0 && (addEvent(e.minimizer, "mousedown", i._close_mdown.bind(i)), addEvent(e.minimizer, "click", i._min_toggle.bind(i))), i.wrap.appendChild(
            t), e.resize !== !1 && (i.resizeWrap = ce("div", {
            className: "rb_resize_wrap",
            innerHTML: '<div class="chats_sp rb_resize"></div>'
        }), i.wrap.appendChild(i.resizeWrap), addEvent(i.resizeWrap, "mousedown", i._resize_mdown.bind(i))), e.minimized && (addClass(i.wrap, "rb_minimized"), i.minimized = !0),
        bodyNode.insertBefore(i.wrap, ge("page_wrap"));
    var r = getStyle(i.wrap, "top"),
        n = getStyle(i.wrap, "bottom"),
        c = getStyle(i.wrap, "left"),
        l = getStyle(i.wrap, "right");
    this.toBottom = ("auto" === r || "" === r || browser.msie && 0 === r) && "auto" != n && "" !== n && !(browser.msie && 0 === n), this.toRight = ("auto" === c || "" === c ||
        browser.msie && 0 === c) && "auto" != l && "" !== l && !(browser.msie && 0 === l), this.toRight && setStyle(i.wrap, {
        marginRight: lastWndScroll[0] ? sbWidth() : 0
    }), (e.nofocus || e.noshow) && addClass(i.wrap, "rb_inactive"), this.toBottom && (setStyle(i.wrap, {
        marginRight: lastWndScroll[0] ? sbWidth() : 0
    }), addClass(i.wrap, "fc_tobottom")), this.options.marginFixedToLayer && setStyle(i.wrap, {
        marginRight: hasClass(document.body, "layers_shown") ? sbWidth() : 0
    }), curRBox.tabs[s] = i, i.pos = !1, e.noshow ? (setStyle(i.wrap, {
        visibility: "hidden",
        display: "block"
    }), i._update_pos(), setStyle(i.wrap, {
        visibility: "",
        display: ""
    })) : i.show(!1, e.nofocus)
}
window.curNotifier || (curNotifier = {
    addQueues: {},
    recvClbks: {},
    recvData: {},
    onConnectionId: []
});
var BASIC_CHAT_ZINDEX = 1010;
extend(IdleManager.prototype, EventEmitter.prototype), extend(IdleManager.prototype, {
    stop: function() {
        this.started = !1, removeEvent(this.opts.element, this.opts.triggerEvents, this.cbActiveB), removeEvent(this.opts.focusElement, "focus", this.cbActiveB),
            removeEvent(this.opts.focusElement, "blur", this.cbInactiveB), clearTimeout(this.setIdleTo), clearTimeout(this.checkIdleCbTo), clearTimeout(this.sendCbTO),
            this.is_idle = !0, this.opts.parentManager && this.opts.parentManager.off("idle", this.cbInactiveB)
    },
    idle: function(t) {
        this.is_idle = !0, t || this.opts.onIdleCb(), this.emit("idle")
    },
    unidle: function(t) {
        this.is_idle = !1, t || this.opts.onUnIdleCb(), this.emit("unidle")
    },
    activate: function() {
        this.is_idle = !1, this.is_activated = !0
    },
    start: function() {
        this.started = !0, browser.mobile || (this.opts.parentManager && this.opts.parentManager.on("idle", this.cbInactiveB), addEvent(this.opts.focusElement, "focus",
                this.cbActiveB), addEvent(this.opts.focusElement, "blur", this.cbInactiveB), clearTimeout(this.checkIdleCbTo), this.checkIdleCb(), this.checkIdleCbTo =
            setTimeout(this.checkIdleCb.bind(this), this.opts.idleTimeout))
    },
    checkIdleCb: function() {
        this.started && (addEvent(this.opts.element, this.opts.triggerEvents, this.cbActiveB), clearTimeout(this.setIdleTo), this.setIdleTo = setTimeout(this.cbInactiveB,
            this.opts.idleTimeout))
    },
    cbActive: function() {
        this.started && (clearTimeout(this.setIdleTo), this.is_idle && (this.is_idle = !1, clearTimeout(this.sendCbTO), this.sendCbTO = setTimeout(function() {
                this.emit("unidle"), this.opts.onUnIdleCb && this.opts.onUnIdleCb()
            }.bind(this), 100)), removeEvent(this.opts.element, this.opts.triggerEvents, this.cbActiveB), clearTimeout(this.checkIdleCbTo), this.checkIdleCbTo =
            setTimeout(this.checkIdleCb.bind(this), this.opts.idleTimeout))
    },
    cbInactive: function() {
        this.started && (this.is_idle || (this.is_idle = !0, clearTimeout(this.sendCbTO), this.sendCbTO = setTimeout(function() {
            this.emit("idle"), this.opts.onIdleCb && this.opts.onIdleCb()
        }.bind(this), 100)), clearTimeout(this.checkIdleCbTo), removeEvent(this.opts.element, this.opts.triggerEvents, this.cbActiveB), addEvent(this.opts.element,
            this.opts.triggerEvents, this.cbActiveB), this.checkIdleCbTo = setTimeout(this.checkIdleCb, this.opts.idleTimeout))
    }
}), Notifier = {
    debug: !1,
    init: function(t) {
        if (!window.curNotifier || !curNotifier.connection_id) {
            if (Notifier.notificationsGc(), curNotifier = extend({
                    q_events: [],
                    q_shown: [],
                    q_closed: [],
                    negotiations: {},
                    currentIm: {},
                    q_max: 3,
                    uiNotifications: [],
                    q_idle_max: 5,
                    browser_shown: {},
                    done_events: {},
                    addQueues: curNotifier.addQueues || {},
                    recvClbks: curNotifier.recvClbks || {},
                    recvData: curNotifier.recvData || {},
                    error_timeout: 1,
                    sound: new Sound("mp3/bb1"),
                    sound_im: new Sound("mp3/bb2"),
                    onConnectionId: []
                }, t), !this.initFrameTransport()) return !1;
            this.initIdleMan(), this.initCommunityQueues(), (curNotifier.cont = ge("notifiers_wrap")) || bodyNode.insertBefore(curNotifier.cont = ce("div", {
                id: "notifiers_wrap",
                className: "fixed"
            }), ge("page_wrap"))
        }
    },
    initCommunityQueues: function(t) {
        return !1
    },
    notificationsGc: function() {
        curNotifier.uiGcTo = setTimeout(function() {
            for (var t = curNotifier.uiNotifications, e = [], i = 0; i < t.length; i++) {
                var a = t[i];
                vkNow() - a[1] > 1e4 ? a[0].close() : e.push(a)
            }
            curNotifier.uiNotifications = e, Notifier.notificationsGc()
        }, 5e3)
    },
    resetCommConnection: function(t) {
        var e = ls.get("im_m_comms_key");
        e && delete curNotifier.addQueues[e.queue], ls.set("im_m_comms_key", !1), Notifier.initCommunityQueues(t || 0)
    },
    proccessCommunityQueues: function(t, e) {
        return "empty" !== t && t ? void Notifier.addKey(t, function(t, i) {
            if (i.failed) return e++, void(50 > e && setTimeout(Notifier.resetCommConnection.pbind(e), 100));
            var t = ls.get("im_m_comms_key");
            t && (t.ts = i.ts, ls.set("im_m_comms_key", t));
            var a = i.events;
            a && a.map(function(t) {
                    return t.split("<!>")
                })
                .forEach(function(t) {
                    if ("update_cnt" === t[1]) {
                        var e = t[5],
                            i = t[4];
                        handlePageCount("mgid" + e, i)
                    }
                })
        }) : !1
    },
    destroy: function() {
        Notifier.hideAllEvents(), curNotifier.idle_manager.stop(), curNotifier.uiGcTo && clearTimeout(curNotifier.uiGcTo), curNotifier = {}, re("notifiers_wrap"), re(
            "queue_transport_wrap")
    },
    reinit: function() {
        ajax.post("notifier.php?act=a_get_params", {}, {
            onDone: function(t) {
                t ? (curNotifier.error_timeout = 1, this.init(t)) : (curNotifier.error_timeout = curNotifier.error_timeout || 1, setTimeout(this.reinit.bind(
                    this), 1e3 * curNotifier.error_timeout), curNotifier.error_timeout < 256 && (curNotifier.error_timeout *= 2))
            }.bind(this),
            onFail: function() {
                return curNotifier.error_timeout = curNotifier.error_timeout || 1, setTimeout(this.reinit.bind(this), 1e3 * curNotifier.error_timeout),
                    curNotifier.error_timeout < 256 && (curNotifier.error_timeout *= 2), !0
            }.bind(this)
        })
    },
    standby: function(t) {
        this.destroy(), curNotifier.error_timeout = t || 1, setTimeout(this.reinit.bind(this), 1e3 * curNotifier.error_timeout)
    },
    freezeEvents: function() {
        curNotifier.frozen = !0, each(curNotifier.q_shown, function() {
            clearTimeout(this.fadeTO), getStyle(this.baloonEl, "opacity") < 1 && animate(this.baloonEl, {
                opacity: 1
            }, 100)
        })
    },
    unfreezeEvents: function() {
        curNotifier.frozen = !1, each(curNotifier.q_shown, function() {
            this.fadeTO = setTimeout(this.startFading, 5e3)
        })
    },
    getTransportWrap: function() {
        return ge("queue_transport_wrap") || utilsNode.appendChild(ce("div", {
            id: "queue_transport_wrap"
        }))
    },
    setFocus: function(t) {
        var e = (t ? "1" : "0") + curNotifier.instance_id;
        "flash" == curNotifier.transport && curNotifier.flash_transport ? curNotifier.flash_transport.setInstanceFocused(e) : "frame" == curNotifier.transport && (Notifier
            .lcSend("focus", {
                instance_id: e
            }), this.onInstanceFocus(e))
    },
    initIdleMan: function() {
        curNotifier.idle_manager && curNotifier.idle_manager.started || (curNotifier.idle_manager = new IdleManager({
            onIdleCb: function() {
                Notifier.freezeEvents(), Notifier.setFocus(0), cur.onIdle && each(cur.onIdle, function(t, e) {
                    e()
                })
            },
            onUnIdleCb: function() {
                Notifier.unfreezeEvents(), Notifier.setFocus(1), cur.onUnidle && each(cur.onUnidle, function(t, e) {
                    e()
                }), FastChat && FastChat.onUnidle(), vk.spentLastSendTS = vkNow()
            },
            id: "window",
            element: document,
            focusElement: window
        }), curNotifier.idle_manager.start())
    },
    initFrameTransport: function() {
        if (!ls.checkVersion() || browser.msie8 || !("onmessage" in window || "postMessage" in window)) return !1;
        curNotifier.connection_id = "queue_connection_" + curNotifier.queue_id, curNotifier.lc_prev_value = "", curNotifier.is_server = !1, curNotifier.lp_connected = !1,
            curNotifier.error_timeout = 1;
        var t = browser.version.split("."),
            e = intval(t[0]),
            i = intval(t[1]);
        curNotifier.post_message = Notifier.debug || !(browser.opera && intval(browser.version) < 15 || browser.msie || browser.mozilla && e >= 31 || browser.safari && (e >
            7 || 7 == e && i >= 1)), curNotifier.transport = "frame", this.lcInit();
        for (var a in curNotifier.onConnectionId) curNotifier.onConnectionId[a]();
        return curNotifier.onConnectionId = [], !0
    },
    onActivated: function() {
        curNotifier.idle_manager && !curNotifier.idle_manager.is_activated ? curNotifier.idle_manager.activate() : curNotifier.idle_manager && curNotifier.idle_manager.is_idle ||
            Notifier.setFocus(1), removeEvent(document, "mousemove keydown touchstart", Notifier.onActivated)
    },
    onConnectionInit: function() {
        addEvent(document, "mousemove keydown touchstart", Notifier.onActivated)
    },
    onConnectionFailed: function() {},
    onRelogin: function() {
        setTimeout(function() {
            Notifier.standby()
        }, 0)
    },
    onMessage: function(msg) {
        if (!curNotifier.focus_instance || curNotifier.focus_instance == curNotifier.instance_id) try {
            var events = eval("(" + msg + ")"),
                pushed = !1;
            Notifier.pushEvents(events)
        } catch (e) {
            debugLog(e.message)
        }
    },
    onInstanceFocus: function(t) {
        var e = t.charAt(0);
        return t = t.substr(1), "1" != e ? void(curNotifier.focus_instance == t && (curNotifier.focus_instance = "")) : (curNotifier.focus_instance = t, void(t !=
            curNotifier.instance_id && (curNotifier.idle_manager.is_idle || curNotifier.idle_manager.idle(), Notifier.hideAllEvents())))
    },
    onInstanceServer: function(t) {
        curNotifier.is_server = !!intval(t)
    },
    pushEvents: function(t, e) {
        var i = 0;
        each(t, function(t, a) {
            i |= Notifier.pushEvent(a, e)
        }), i && !ls.get("sound_notify_off") && curNotifier.is_server && (2 & i ? curNotifier.sound_im.play() : curNotifier.sound.play())
    },
    pushEvent: function(msg, cnt) {
        if ("nop" != msg) {
            if (msg = msg.split("<!>"), msg[0] != curNotifier.version) return debugLog("Notifier old version"), !1;
            if ("update_cnt" == msg[1]) return "nws" === msg[3] ? (handlePageCount("ntf", msg[9]), 0) : (handlePageCount(msg[3], msg[4], msg[5], msg[6]), 0);
            var ev = {
                    type: msg[1],
                    title: msg[2],
                    author_photo: psr(msg[3] || ""),
                    author_link: msg[4] || "",
                    text: psr(msg[5]),
                    add_photo: psr(msg[6]) || "",
                    link: msg[7],
                    onclick: msg[8],
                    add: msg[9],
                    id: msg[10],
                    author_id: msg[11],
                    top_count: msg[12]
                },
                push = cnt ? 0 : 1;
            if (msg[13] && (ev.custom = eval("(" + msg[13] + ")")), !curNotifier.done_events[ev.id]) {
                switch (curNotifier.done_events[ev.id] = 1, void 0 !== ev.top_count && -1 != ev.top_count && handlePageCount("ntf", ev.top_count), ev.type) {
                    case "video_process_ready":
                        if (ev.add && window.Video && Video.isVideoPlayerOpen(ev.add)) return;
                        break;
                    case "mail":
                        handlePageCount("msg", ev.add), window.Call && Call.params.call_id && intval(ev.author_id) == intval(Call.params.far_uid) && Call.showChat(), "im" !=
                            cur.module && FastChat.prepareTabIcon(intval(ev.author_id), {
                                fixedLoad: 1
                            });
                        break;
                    case "mail_failed":
                        var peer = intval(ev.author_id);
                        if ("im" == nav.objLoc[0] && cur.tabs[peer]) {
                            var msg = ge("mess" + ev.add);
                            if (msg && hasClass(msg, "im_new_msg")) {
                                removeClass(msg, "im_new_msg"), addClass(msg, "im_failed");
                                var n = geByClass1("im_log_author_chat_name", msg);
                                n && (n.innerHTML += " &nbsp;<span>" + cur.lang.mail_send_failed + "</span>"), push = 2
                            }
                        }
                        break;
                    case "friend_request":
                        handlePageCount("fr", ev.add);
                        break;
                    case "mail_cnt":
                        handlePageCount("msg", ev.add), push = 0;
                        break;
                    case "clear_notify":
                        Notifier.hideAllEvents(), push = 0;
                        break;
                    case "support_reply":
                        handlePageCount("spr", ev.add, "support", ev.author_id ? "act=show&id=" + ev.author_id : "act=show"), toggle("l_spr", ev.add > 0);
                        break;
                    case "support_cnt":
                        handlePageCount("spr", ev.add, "support", ev.author_id ? "act=show&id=" + ev.author_id : "act=show"), toggle("l_spr", ev.add > 0), push = 0;
                        break;
                    case "balance_changed":
                        updateMoney(ev.add), ev.custom && "app" == ev.custom[0] && cur.app && cur.app.params.api_id == ev.custom[1] && cur.app.balanceUpdated(ev.custom[2]);
                        break;
                    case "gift_sent":
                        re("left_block10_0");
                        var left_block = ev.add;
                        if (left_block) {
                            var leftBlocksElem = ge("left_blocks"),
                                left_unpaid_gifts = se(left_block);
                            leftBlocksElem && (leftBlocksElem.firstChild ? leftBlocksElem.insertBefore(left_unpaid_gifts, leftBlocksElem.firstChild) : leftBlocksElem.appendChild(
                                left_unpaid_gifts))
                        }
                        break;
                    case "call_start":
                        window.Call ? Call.incomingReceive(ev) : stManager.add(["call.js", "call.css", "notifier.css"], function() {
                            Call.incomingReceive(ev)
                        }), push = 0;
                        break;
                    case "call":
                        window.Call ? Call.processNotify(ev) : debugLog("wnd Call event without call obj"), push = 0;
                        break;
                    case "call_app":
                        var callId = ev.custom.call_id,
                            onScriptCame = function(script) {
                                clearTimeout(curNotifier.appCallTimeout), script = script && script[0] == callId ? script[1] : !1, script && -1 != script && stManager.add(
                                    ["call.js", "call.css", "apps.js", "apps.css"],
                                    function() {
                                        eval(script)
                                    })
                            };
                        curNotifier.appCallTimeout = setTimeout(function() {
                            var t = curNotifier.recvData.apps_call_receive;
                            t = t && t[0] == callId ? t[1] : !1, t || (ajax.post("/al_apps.php", {
                                act: "call_receive"
                            }, {
                                onDone: function(t) {
                                    debugLog("script came"), t = [callId, t], Notifier.lcSend("apps_call_receive", t), onScriptCame(t)
                                },
                                stat: ["call.js", "call.css", "apps.js", "apps.css"]
                            }), Notifier.lcSend("apps_call_receive", [callId, -1]))
                        }, 0), Notifier.setRecvClbk("apps_call_receive", onScriptCame), push = 0;
                        break;
                    case "call_app_reject":
                        "app" == cur.module && cur.aid == ev.custom.aid && cur.app.runCallback("onCallReject", ev.custom.key), push = 0;
                        break;
                    case "call_app_accept":
                        "app" == cur.module && cur.aid == ev.custom.aid && cur.app.runCallback("onCallAccept", ev.custom.key), push = 0;
                        break;
                    case "notify_tt":
                    case "login_attempt":
                        ev.add && (ev.add = eval("(" + ev.add + ")"), TopNotifier.showTooltip(ev.add.text, ev.add.key)), push = 0
                }
                return "mail" === ev.type && (push = this.sendMailNotification(ev)), 1 & push && (curNotifier.q_events.push(ev), curNotifier.q_events.length > 30 &&
                    curNotifier.q_events.splice(0, curNotifier.q_events.length - 30), this.checkEvents()), push
            }
        }
    },
    isActive: function() {
        return window.curNotifier && curNotifier.idle_manager && !curNotifier.idle_manager.is_idle
    },
    sendImProxy: function(t) {
        t.text = winToUtf(t.text), curNotifier.browser_shown[t.id] || (curNotifier.browser_shown[t.id] = !0, Notifier.trySendBrowserNotification(t, !0), setTimeout(
            function() {
                curNotifier.browser_shown[t.id] = void 0
            }, 2e3))
    },
    shouldShowNotification: function(t) {
        return "im" !== cur.module && !FastChat.isChatOpen(t.author_id)
    },
    sendSimpleNotification: function(t) {
        return Notifier.playSound(t), Notifier.shouldShowNotification(t) ? 3 : 0
    },
    sendBrowserNotification: function(t) {
        "im" !== cur.module ? Notifier.negotiate({
            message: "send_im_notification",
            onSuccess: function(e) {
                Notifier.lcSend("negotiate_back", {
                    token: e.msg,
                    ev: t
                })
            },
            onFail: function() {
                Notifier.showBrowserNotification(t)
            }
        }) : (t.onclick = "IM.activateTab(" + t.author_id + ");", Notifier.showBrowserNotification(t))
    },
    shouldPlaySound: function(t) {
        return !ls.get("sound_notify_off") && cur.focused != t.author_id && !inArray(t.author_id, cur.mutedPeers)
    },
    playSound: function(t) {
        curNotifier.sound_im && curNotifier.sound_im.play && Notifier.shouldPlaySound(t) && curNotifier.sound_im.play()
    },
    trySendBrowserNotification: function(t, e) {
        Notifier.negotiate({
            message: "who_is_active",
            msg: t.author_id,
            onFail: function() {
                !Notifier.canNotifyUi() || cur.peer == t.author_id && Notifier.isActive() ? e ? Notifier.playSound(t) : (Notifier.lcSend("show_notification", t),
                    Notifier.shouldShowNotification(t) && Notifier.showEvent(t, !0), Notifier.playSound(t)) : Notifier.sendBrowserNotification(t)
            }
        })
    },
    showBrowserNotification: function(t) {
        Notifier.showEventUi(t), Notifier.playSound(t)
    },
    proxyIm: function(t) {
        return this.isActive() && (this.playSound(t), Notifier.canNotifyUi() && cur.peer != t.author_id && Notifier.shouldPlaySound(t)) ? void Notifier.showEventUi(t) :
            void(curNotifier.is_server ? (t.onclick = "IM.activateTab(" + t.author_id + ");", this.sendImProxy(t)) : curNotifier.is_server || this.lcSend("message_from_im",
                t))
    },
    sendMailNotification: function(t) {
        if ("im" == cur.module ? t.onclick = "IM.activateTab('" + t.author_id + "');" : t.onclick = "FastChat.selectPeer('" + t.author_id + "');", this.isActive() &&
            Notifier.canNotifyUi()) this.playSound(t), this.shouldPlaySound(t) && cur.peer != t.author_id && this.showEventUi(t);
        else {
            if (this.isActive()) return this.sendSimpleNotification(t);
            curNotifier.is_server && this.trySendBrowserNotification(t)
        }
        return 0
    },
    checkEvents: function() {
        if (!(!curNotifier.q_events.length || curNotifier.q_shown.length >= (curNotifier.idle_manager.is_idle ? curNotifier.q_idle_max : curNotifier.q_max) || !curNotifier
                .idle_manager.is_idle && curNotifier.frozen)) {
            var t = curNotifier.q_events.shift();
            this.showEvent(t)
        }
    },
    showEvent: function(ev, force) {
        curNotifier.q_shown.push(ev);
        var thumbEl = "";
        thumbEl = "video_process_ready" == ev.type ? '<div class="notifier_video_thumb" style="background-image: url(' + Notifier.fixPhoto(ev.author_photo) + ')"></div>' :
            '<img src="' + Notifier.fixPhoto(ev.author_photo) + '" class="notifier_image" />';
        var typeClassName = "notifier_type_" + ev.type;
        ev.baloonWrapEl = ce("div", {
            className: "notifier_baloon_wrap",
            innerHTML: '<div class="notifier_baloon ' + typeClassName +
                '"><div class="notifier_baloon_head clear_fix"><div class="notifier_close_wrap"><a class="notifier_close" title="' + getLang("global_close") +
                '" href=""></a></div><div class="notifier_baloon_title">' + ev.title + '</div></div><div class="notifier_baloon_body clear_fix">' + (ev.author_photo &&
                    '<div class="notifier_image_wrap">' + (ev.author_link && '<a href="' + ev.author_link + '">') + thumbEl + (ev.author_link && "</a>") + "</div>"
                ) + (ev.add_photo && '<div class="notifier_add_image_wrap"><img src="' + ev.add_photo + '" class="notifier_add_image" /></div>') +
                '<div class="notifier_baloon_msg wrapped">' + ev.text + "</div></div></div>"
        }), ev.baloonEl = ev.baloonWrapEl.firstChild, ev.closeEl = geByClass1("notifier_close_wrap", ev.baloonEl), addEvent(ev.baloonEl, "mouseover mouseout", function(
            t) {
            ev.over = "mouseover" == t.type, ev.over ? Notifier.freezeEvents() : Notifier.unfreezeEvents()
        }), addEvent(ev.baloonEl, "mousedown", function(e) {
            e = e.originalEvent || e || window.event;
            var btn = e.which,
                nohide = !1;
            if (browser.msie && (btn = 1 == e.button ? 1 : 2 == e.button ? 3 : 2), 1 == btn && (e.ctrlKey || browser.mac && e.metaKey) && (btn = 2, browser.mac &&
                    (nohide = !0)), "A" != (e.target || e.srcElement)
                .tagName) {
                switch (btn) {
                    case 1:
                        eval(ev.onclick), Notifier.hideEvent(ev);
                        break;
                    case 2:
                        var wnd = window.open(ev.link, "_blank");
                        try {
                            wnd.blur(), window.focus()
                        } catch (e) {}
                        nohide || Notifier.hideEvent(ev);
                        break;
                    case 3:
                        if (browser.mozilla) return
                }
                return cancelEvent(e)
            }
            switch (btn) {
                case 1:
                    break;
                case 3:
            }
        }), addEvent(ev.baloonEl, "contextmenu", function(t) {
            return setTimeout(function() {
                Notifier.hideEvent(ev, !1, !1, !0)
            }, 10), cancelEvent(t)
        }), addEvent(ev.closeEl, "mousedown", function(t) {
            return Notifier.hideEvent(ev, !1, !1, !0), cancelEvent(t)
        }), ev.startFading = function() {
            ev.fading = animate(ev.baloonEl, {
                    opacity: 0
                }, 1e3, Notifier.hideEvent.bind(Notifier)
                .pbind(ev, !1)), ev.over && ev.fading.stop()
        }, curNotifier.cont.insertBefore(ev.baloonWrapEl, curNotifier.cont.firstChild);
        var h = ev.baloonWrapEl.offsetHeight;
        re(ev.baloonWrapEl), curNotifier.cont.appendChild(ev.baloonWrapEl), setStyle(curNotifier.cont, {
            bottom: -h
        }), setStyle(ev.baloonWrapEl, {
            visibility: "visible"
        }), animate(curNotifier.cont, {
            bottom: 0
        }, 200), (!curNotifier.idle_manager.is_idle || force) && (ev.fadeTO = setTimeout(ev.startFading, 7e3))
    },
    canNotifyUi: function() {
        return !ls.get("im_ui_notify_off") && DesktopNotifications.supported() && DesktopNotifications.checkPermission() <= 0
    },
    showEventUi: function(ev) {
        if (!this.canNotifyUi()) return !1;
        var title, text;
        if ("mail" === ev.type) {
            var div = ce("div");
            div.innerHTML = ev.text, title = div.firstChild.textContent.trim(), text = stripHTML(replaceEntities(ev.text.replace(/<br\/?>/g, "\n"))
                    .replace(/<span class='notifier_author_quote'.*<\/span>(.*?)/, "$1")
                    .replace(/<img.*?alt="(.*?)".*?>/gi, "$1"))
                .replace(/&laquo;|&raquo;/gi, '"')
                .trim()
        } else title = ev.title, text = ev.text;
        var notification = ev.uiNotification = DesktopNotifications.createNotification(ev.author_photo, title, text);
        return curNotifier.uiNotifications.push([notification, vkNow()]), notification.onclick = function(e) {
            window.focus(), eval(ev.onclick), Notifier.hideEvent(ev)
        }, notification.onclose = function() {
            Notifier.hideEvent(ev, !0)
        }, notification.show(), ev.closeTO = setTimeout(Notifier.hideEvent.bind(Notifier)
            .pbind(ev), 5e3), !0
    },
    hideEvent: function(t, e, i, a) {
        clearTimeout(t.closeTO), clearTimeout(t.fadeTO), t.fading && t.fading.stop();
        var s, o = indexOf(curNotifier.q_shown, t); - 1 != o && curNotifier.q_shown.splice(o, 1), Notifier.unfreezeEvents(), e || (t.baloonWrapEl ? (cleanElems(t.closeEl,
            t.baloonEl), re(t.baloonWrapEl)) : t.uiNotification && t.uiNotification.cancel()), a === !0 && isArray(curNotifier.q_closed) && (curNotifier.q_closed.unshift(
            vkNow()), (s = curNotifier.q_closed.length) > 3 && (curNotifier.q_closed.splice(3, s - 3), s = 3), 3 == s && curNotifier.q_closed[0] - curNotifier.q_closed[
            2] < 700 && Notifier.hideAllEvents()), -1 != a && this.checkEvents(), "frame" != curNotifier.transport || i || this.lcSend("hide", {
            event_id: t.id
        }), a !== !0 && curNotifier.idle_manager.is_idle || curNotifier.q_events.length || curNotifier.q_shown.length || ajax.post("notifier.php", {
            act: "a_clear_notifier"
        })
    },
    hideAllEvents: function() {
        curNotifier.q_events = [], each(clone(curNotifier.q_shown), function() {
            Notifier.hideEvent(this, !1, !0, -1)
        }), curNotifier.q_shown = [], curNotifier.q_closed = []
    },
    onEventHide: function(t) {
        t && (each(curNotifier.q_shown, function() {
            return this.id == t ? (Notifier.hideEvent(this, !1, !0), !1) : void 0
        }), each(curNotifier.q_events, function(e) {
            return this.id == t ? (curNotifier.q_events.splice(e, 1), !1) : void 0
        }))
    },
    lcInit: function() {
        if (curNotifier.post_message) {
            addEvent(window, "message", this.lcOnMessage.bind(this));
            var t = curNotifier.storage_el = ce("iframe", {
                id: "queue_storage_frame",
                name: "queue_storage_frame",
                src: "/notifier.php?act=storage_frame&from=" + location.host + (Notifier.debug ? "&debug=" + vkNow() : "&4") + "#" + curNotifier.connection_id
            });
            Notifier.getTransportWrap()
                .appendChild(t), curNotifier.storage_frame = t.contentWindow, curNotifier.storage_frame_origin = location.protocol + "//" + locHost
        } else browser.msie && intval(browser.version) < 9 ? addEvent(document, "storage", this.lcOnStorage.bind(this)) : addEvent(window, "storage", this.lcOnStorage.bind(
            this)), this.lcStart()
    },
    lcStart: function() {
        Notifier.lcCheckServer() ? this.lcServer() : (this.lcSend("check"), clearTimeout(curNotifier.becomeServerTO), curNotifier.becomeServerTO = setTimeout(this.lcServer
            .bind(this)
            .pbind(!0), 500)), curNotifier.checkServerInt = setInterval(function() {
            curNotifier.is_server || vkNow() - curNotifier.last_succ > 8e3 && Notifier.lcCheckServer() && (debugLog("timeout"), this.lcServer(!0))
        }.bind(this), 1e3 + intval(rand(-100, 100))), curNotifier.isServerBroadcastInt = setInterval(function() {
            curNotifier.is_server && (Notifier.lcCheckServer() ? this.lcSend("check_ok") : (debugLog("no server from server broadcast"), this.lcNoServer()))
        }.bind(this), 5e3 + intval(rand(-100, 100))), void 0 !== curNotifier.fc && stManager.add(["emoji.js"], function() {
            FastChat.init(curNotifier.fc)
        })
    },
    lcStop: function() {
        clearInterval(curNotifier.isServerBroadcastInt), clearInterval(curNotifier.checkServerInt), clearTimeout(curNotifier.becomeServerTO)
    },
    lcSend: function(t, e) {
        if (!curNotifier.connection_id) return curNotifier.onConnectionId.push(Notifier.lcSend.pbind(t, e)), !1;
        Notifier.debug && debugLog(curNotifier.instance_id + ": sending", t, e || "");
        var i = extend({
            __client: curNotifier.instance_id,
            __act: t,
            __rnd: Math.random()
        }, e || {});
        if (curNotifier.post_message) try {
            curNotifier.storage_frame.postMessage(curNotifier.connection_id + ":" + JSON.stringify(i), curNotifier.storage_frame_origin)
        } catch (a) {
            debugLog(a, a.message, a.stack)
        } else ls.set(curNotifier.connection_id, i)
    },
    lcRecv: function(t) {
        if (!isEmpty(t) && t.__client != curNotifier.instance_id) {
            var e = t.__act;
            switch (delete t.__client, delete t.__act, delete t.__rnd, Notifier.debug && debugLog(curNotifier.instance_id + ": recv", e, t), e) {
                case "new_server":
                    curNotifier.last_succ = vkNow() + 1e3;
                    break;
                case "feed":
                    curNotifier.timestamp = t.ts, curNotifier.key = t.key, Notifier.pushEvents(t.events, !t.full);
                    break;
                case "addfeed":
                    Notifier.addFeed(t[0], t[1]);
                    break;
                case "new_key":
                    debugLog("new key", t), curNotifier.timestamp = t.ts, curNotifier.key = t.key;
                    break;
                case "new_addkey":
                    var i = t.queue || t.key,
                        a = curNotifier.addQueues[i],
                        s = !a && curNotifier.is_server;
                    a ? a[0] = vkNow() : curNotifier.addQueues[i] = [vkNow(), t.ts, t.key], s && Notifier.lpReset();
                    break;
                case "clear_addkeys":
                    curNotifier.addQueues = {};
                    break;
                case "check_ok":
                    curNotifier.last_succ = vkNow(), curNotifier.becomeServerTO && (clearTimeout(curNotifier.becomeServerTO), curNotifier.becomeServerTO = !1), curNotifier
                        .lp_connected || (curNotifier.lp_connected = !0, Notifier.onConnectionInit());
                    break;
                case "focus":
                    Notifier.onInstanceFocus(t.instance_id);
                    break;
                case "hide":
                    Notifier.onEventHide(t.event_id);
                    break;
                case "check_playlist":
                    var o = ls.get("pad_playlist");
                    o && o.instance == curNotifier.instance_id && ls.set("pad_pltime", vkNow());
                    break;
                case "who_is_active":
                    Notifier.isActive() && (intval(t.msg) > 2e9 && "im" === cur.module || intval(t.msg) < 2e9) && this.lcSend("negotiate_back", t);
                    break;
                case "show_notification":
                    Notifier.shouldShowNotification(t) && Notifier.showEvent(t, !0);
                    break;
                case "send_im_notification":
                    if ("im" === cur.module) {
                        var r = Notifier.createNegotiationSlot({
                            onSuccess: function(t) {
                                t.ev.onclick = "IM.activateTab(" + t.ev.author_id + ");", Notifier.showBrowserNotification(t.ev)
                            }
                        });
                        Notifier.lcSend("negotiate_back", {
                            msg: r.token,
                            token: t.token
                        })
                    }
                    break;
                case "negotiate_back":
                    Notifier.endNegotiation(t);
                    break;
                default:
                    if (curNotifier.recvClbks && curNotifier.recvClbks[e])
                        for (var n in curNotifier.recvClbks[e]) curNotifier.recvClbks[e][n](t);
                    else curNotifier.recvData[e] = t
            }
            if (curNotifier.is_server) switch (e) {
                case "new_server":
                case "new_key":
                case "check_ok":
                    debugLog("no server from lcRecv", e), Notifier.lcNoServer();
                    break;
                case "check":
                    this.lcSend("check_ok");
                    break;
                case "message_from_im":
                    Notifier.sendImProxy(t)
            }
        }
    },
    negotiate: function(t) {
        t = this.createNegotiationSlot(t), this.lcSend(t.message, {
            token: t.token,
            msg: t.msg
        })
    },
    createNegotiationSlot: function(t) {
        var e = "negotiations_" + Date.now() + Math.round(rand(0, 1e4));
        return t = extend({
            timeout: 600,
            token: e,
            msg: ""
        }, t), curNotifier.negotiations[t.token] = {}, curNotifier.negotiations[t.token].timer = setTimeout(function() {
            t.onFail && t.onFail(), curNotifier.negotiations[t.token] && (curNotifier.negotiations[t.token] = void 0)
        }, t.timeout), curNotifier.negotiations[t.token].success = t.onSuccess, t
    },
    endNegotiation: function(t) {
        var e = t.token,
            i = curNotifier.negotiations[e];
        i && (clearTimeout(i.timer), curNotifier.negotiations[e].success && curNotifier.negotiations[e].success(t), curNotifier.negotiations[e] = void 0)
    },
    lcOnStorage: function(t) {
        t = t || window.event, Notifier.debug && debugLog("onstorage", t.key, t.newValue, t);
        var e = t.key,
            i = t.newValue;
        if (i) {
            if (e) {
                if (t.key != curNotifier.connection_id) return
            } else {
                if (e = curNotifier.connection_id, i = localStorage.getItem(e), i == curNotifier.lc_prev_value) return;
                curNotifier.lc_prev_value = i
            }
            this.lcRecv(JSON.parse(i) || {})
        }
    },
    lcOnMessage: function(t) {
        if (t = t || window.event, Notifier.debug && debugLog("onmessage", t.data, t.origin, t), !(t.origin && t.origin != curNotifier.storage_frame_origin || "string" !=
                typeof t.data || t.data.indexOf("q_st"))) {
            var e, i, a = t.data.substr(4);
            if ("ready" == a) curNotifier.storage_frame = t.source, this.lcStart();
            else {
                if (-1 == (e = a.indexOf(":")) || (i = a.substr(0, e)) != curNotifier.connection_id || !a.substr(e + 1)) return;
                this.lcRecv(JSON.parse(a.substr(e + 1)))
            }
        }
    },
    lcServer: function(t) {
        debugLog("becoming server"), this.lpInit(), this.lcSend("new_server"), Notifier.lcCheckServer(!0), curNotifier.is_server = !0, Notifier.onInstanceServer(1),
            curNotifier.lp_connected || (curNotifier.lp_connected = !0, Notifier.onConnectionInit()), window.curFastChat && curFastChat.inited && FastChat.becameServer(),
            this.lpStop(), t ? this.lpReset(this.lpStart.bind(this)) : this.lpStart()
    },
    lcNoServer: function() {
        this.lpStop(), curNotifier.is_server && (debugLog("not server now"), this.onInstanceServer(0), curNotifier.is_server = !1)
    },
    lcCheckServer: function(t) {
        var e, i = "server_" + curNotifier.connection_id,
            a = vkNow();
        return !t && isArray(e = ls.get(i)) && e[0] != curNotifier.instance_id && a - e[1] < 8e3 ? !1 : (ls.set(i, [curNotifier.instance_id, a]), !0)
    },
    lpInit: function() {
        curNotifier.lpMakeRequest || (delete curNotifier.lpMakeRequest, re("queue_transport_frame"), Notifier.getTransportWrap()
            .appendChild(ce("iframe", {
                id: "queue_transport_frame",
                name: "queue_transport_frame",
                src: curNotifier.frame_path
            })))
    },
    lpStart: function() {
        curNotifier.lp_started = !0, Notifier.lpCheck()
    },
    lpStop: function() {
        curNotifier.lp_started = !1, clearTimeout(curNotifier.lp_check_to), clearTimeout(curNotifier.lp_error_to), clearTimeout(curNotifier.lp_req_check_to)
    },
    lpCheck: function() {
        if (curNotifier.lp_started && !curNotifier.lpActive && !curNotifier.lpInvalid) {
            if (!curNotifier.lpMakeRequest) return clearTimeout(curNotifier.lp_check_to), void(curNotifier.lp_check_to = setTimeout(this.lpCheck.bind(this), 1e3));
            if (!Notifier.lcCheckServer()) return debugLog("no server from check"), void this.lcNoServer();
            var now = vkNow(),
                add_queues = [],
                completed = !1,
                params = {
                    act: "a_check",
                    ts: curNotifier.timestamp,
                    key: curNotifier.key,
                    id: curNotifier.uid,
                    wait: 25
                };
            each(curNotifier.addQueues, function(t, e) {
                return now - e[0] > 3e4 && !t.match(/nccts/) ? (debugLog("drop key", t, now - e[0]), void delete curNotifier.addQueues[t]) : (add_queues.push(t),
                    params.ts += "_" + e[1], void(params.key += e[2]))
            });
            var onFail = function(t) {
                completed || (completed = !0, curNotifier.lpActive = !1, clearTimeout(curNotifier.lp_req_check_to), curNotifier.error_timeout = curNotifier.error_timeout ||
                    1, clearTimeout(curNotifier.lp_error_to), curNotifier.lp_error_to = setTimeout(this.lpCheck.bind(this), 1e3 * curNotifier.error_timeout + irand(
                        1e3, 1e4)), curNotifier.error_timeout < 64 && (curNotifier.error_timeout *= 2))
            }.bind(this);
            curNotifier.lpActive = !0, clearTimeout(curNotifier.lp_req_check_to), curNotifier.lp_req_check_to = setTimeout(onFail, 1e3 * (params.wait + 5)), curNotifier.lpMakeRequest(
                curNotifier.frame_url, params,
                function(text) {
                    if (!completed && (completed = !0, curNotifier.lpActive = !1, curNotifier.lp_started)) {
                        this.lcSend("check_ok");
                        try {
                            var response = eval("(" + text + ")"),
                                main_response = response,
                                add_response, add_queue, busy = 0;
                            if (isArray(response))
                                for (main_response = response.shift();
                                    (add_response = response.shift()) && (add_queue = add_queues.shift());) 2 != add_response.failed || 4 != add_response.err ? (this.lcSend(
                                    "addfeed", [add_queue, add_response]), this.addFeed(add_queue, add_response), add_response.failed && delete curNotifier.addQueues[
                                    add_queue]) : (debugLog("!!notifier key busy!! " + curNotifier.instance_id), busy |= 1);
                            else if (response.failed) {
                                for (; add_queue = add_queues.shift();) this.lcSend("addfeed", [add_queue, response]), this.addFeed(add_queue, response), delete curNotifier
                                    .addQueues[add_queue];
                                this.lcSend("clear_addkeys")
                            }
                            switch (this.lpChecked(main_response)) {
                                case 0:
                                    break;
                                case 1:
                                    return;
                                case 2:
                                    busy |= 2;
                                    break;
                                default:
                                    return
                            }
                            busy ? this.lcNoServer() : (this.lpCheck(), curNotifier.error_timeout = Math.max(1, (curNotifier.error_timeout || 1) / 1.5))
                        } catch (e) {
                            text && -1 == text.indexOf("Ad Muncher") && (topError("Notifier error: " + e.message, {
                                    dt: -1,
                                    type: 5,
                                    stack: e.stack,
                                    answer: text + "\n\nbusy:" + busy + "\nserver:" + curNotifier.is_server + "\ninstance:" + curNotifier.instance_id,
                                    url: curNotifier.frame_url,
                                    query: params && ajx2q(params)
                                }), debugLog(e.message, e.stack, e)), curNotifier.error_timeout = curNotifier.error_timeout || 1, clearTimeout(curNotifier.lp_error_to),
                                curNotifier.lp_error_to = setTimeout(this.lpCheck.bind(this), 1e3 * curNotifier.error_timeout), curNotifier.error_timeout < 64 && (
                                    curNotifier.error_timeout *= 2)
                        }
                    }
                }.bind(this), onFail)
        }
    },
    lpChecked: function(t) {
        var e = t.failed;
        if (2 == e) return 4 == t.err ? 2 : (curNotifier.lpInvalid = !0, clearTimeout(curNotifier.lp_error_to), curNotifier.lp_error_to = setTimeout(this.lpGetKey.bind(
            this), 1e3 * curNotifier.error_timeout), curNotifier.error_timeout < 64 && (curNotifier.error_timeout *= 2), 1 == t.err ? 1 : 3);
        if (e) throw getLang("global_unknown_error");
        return this.lcSend("feed", extend({
            full: curNotifier.idle_manager && curNotifier.idle_manager.is_idle && !this.canNotifyUi(),
            key: curNotifier.key
        }, t)), curNotifier.timestamp = t.ts, Notifier.pushEvents(t.events), 0
    },
    lpOnReset: function() {
        curNotifier.lpOnReset && curNotifier.lpOnReset()
    },
    lpReset: function(t) {
        t && (curNotifier.lpOnReset = t), clearTimeout(curNotifier.resetTO), curNotifier.resetTO = setTimeout(function() {
            if (curNotifier.is_server && !curNotifier.lp_started) return void Notifier.lpStart();
            if (curNotifier.lpMakeRequest && !curNotifier.lpInvalid) {
                var t = curNotifier.key,
                    e = curNotifier.timestamp;
                each(curNotifier.addQueues, function(i, a) {
                    t += a[2], e += "_" + a[1]
                }), curNotifier.lpMakeRequest(curNotifier.frame_url, {
                    act: "a_release",
                    key: t,
                    ts: e,
                    id: curNotifier.uid,
                    wait: 25
                }, Notifier.lpOnReset, Notifier.lpOnReset)
            } else ajax.post("notifier.php?act=a_reset", !1, {
                onDone: Notifier.lpOnReset,
                onFail: function() {
                    return Notifier.lpOnReset(), !0
                }
            })
        }, 100)
    },
    lpGetKey: function() {
        vkNow();
        ajax.post("notifier.php?act=a_get_key", {
            id: curNotifier.uid
        }, {
            onDone: function(t, e) {
                curNotifier.timestamp = e, curNotifier.key = t, curNotifier.lpInvalid = !1, this.lcSend("new_key", {
                    ts: e,
                    key: t
                }), this.lpCheck()
            }.bind(this),
            onFail: function(t) {
                switch (t) {
                    case 1:
                    case 3:
                        return void Notifier.standby();
                    case 4:
                        return void Notifier.standby(300);
                    case 2:
                        return void Notifier.onRelogin()
                }
                return curNotifier.error_timeout = 64, clearTimeout(this.lp_error_to), this.lp_error_to = setTimeout(this.lpGetKey.bind(this), 1e3 *
                    curNotifier.error_timeout), !0
            }.bind(this)
        })
    },
    addKey: function(t, e, i) {
        if (curNotifier.flash_transport || !t) return !1;
        var a = t.queue || t.key,
            s = curNotifier.addQueues[a],
            o = !s && curNotifier.is_server;
        return s ? (s[0] = vkNow(), s[3] = e, s[4] = i) : curNotifier.addQueues[a] = [vkNow(), t.ts, t.key, e, i], i || Notifier.lcSend("new_addkey", t), o && Notifier.lpReset(), !
            0
    },
    addFeed: function(t, e) {
        var i = curNotifier.addQueues[t];
        isArray(i) && i.length && (i[1] = e.ts, isFunction(i[3]) && i[3](t, e))
    },
    addRecvClbk: function(t, e, i, a) {
        curNotifier.recvClbks || (curNotifier.recvClbks = {}), curNotifier.recvClbks[t] || (curNotifier.recvClbks[t] = {}), (!curNotifier.recvClbks[t][e] || a) && (
            curNotifier.recvClbks[t][e] = i)
    },
    setRecvClbk: function(t, e) {
        curNotifier.recvClbks || (curNotifier.recvClbks = {}), curNotifier.recvClbks[t] = [e]
    },
    fixPhoto: function(t, e) {
        return t = clean(t), -1 == t.indexOf("question_c.gif") ? t : e ? "/images/question_inv_xc.png" : "/images/question_inv_c.png"
    }
}, Sound.prototype = {
    play: function() {
        try {
            this.playSound()
        } catch (t) {}
    },
    pause: function() {
        try {
            this.pauseSound()
        } catch (t) {}
    }
}, window.lastWndScroll = [!1, !1], window.curRBox || (curRBox = {
    guid: 0,
    active: !1,
    focused: [],
    tabs: {}
}), extend(RBox.prototype, {
    show: function(t, e) {
        var i = this;
        void 0 === t && (t = 0), t ? (setStyle(i.wrap, {
            opacity: 0,
            display: "block"
        }), i.visible = !0, !e && i.focus(), animate(i.wrap, {
            opacity: 1
        }, t, function() {
            setStyle(i.wrap, browser.msie ? {
                filter: "none"
            } : {
                opacity: ""
            }), i._update_pos()
        })) : (show(i.wrap), i.visible = !0, !e && i.focus(), i._update_pos()), i.options.onShow && i.options.onShow()
    },
    hide: function(t, e, i) {
        var a = this;
        return !e && a.options.onBeforeHide && a.options.onBeforeHide() ? !0 : (void 0 === t && (t = 0), t ? (setStyle(a.wrap, {
            opacity: 1,
            display: "block"
        }), animate(a.wrap, {
            opacity: 0
        }, t, function() {
            hide(a.wrap), setStyle(a.wrap, browser.msie ? {
                filter: "none"
            } : {
                opacity: ""
            })
        })) : hide(a.wrap), a.visible = !1, void(!e && a.options.onHide && a.options.onHide(i || {})))
    },
    _head_mdown: function(t) {
        if (!checkEvent(t)) {
            (t.originalEvent || t)
            .cancelBubble = !0;
            var e, i, a = this,
                s = t.target,
                o = getWndInner(),
                r = curRBox.active == a.id,
                n = t.pageY,
                c = t.pageX,
                l = a.wrap.offsetHeight,
                u = a.wrap.offsetWidth,
                d = 0,
                h = 0,
                f = o[0] - l,
                p = o[1] - u,
                v = browser.msie ? "selectstart" : "mousedown";
            a.options.fixed && FastChat.pinTab(a.options.peer || -1, t, !0), r || a.focus(t), a.toBottom ? (a.toBottom = !1, e = o[0] - intval(getStyle(a.wrap,
                "bottom")) - l, setStyle(a.wrap, {
                top: e,
                bottom: "auto"
            }), removeClass(a.wrap, "fc_tobottom")) : e = intval(getStyle(a.wrap, "top")), a.toRight ? (a.toRight = !1, i = o[1] - intval(getStyle(a.wrap, "right")) -
                u, setStyle(a.wrap, {
                    left: i,
                    right: "auto"
                })) : i = intval(getStyle(a.wrap, "left")), d = e, h = i, cur._fcdrag = 1;
            var _ = function(t) {
                    return d = Math.max(0, Math.min(f, e + t.pageY - n)), 10 > f - d ? d = f : 10 > d && (d = 0), a.wrap.style.top = d + "px", h = Math.max(0, Math.min(
                        p, i + t.pageX - c)), 10 > p - h ? h = p : 10 > h && (h = 0), a.wrap.style.left = h + "px", cancelEvent(t)
                },
                m = function(t) {
                    cur._fcdrag = 0, removeEvent(document, "mousemove", _), removeEvent(document, "mouseup", m), removeEvent(document, v, cancelEvent), setStyle(
                        bodyNode, "cursor", ""), setStyle(s, "cursor", ""), (a.toBottom = d >= f - 5) && (setStyle(a.wrap, {
                        top: "auto",
                        bottom: 0
                    }), addClass(a.wrap, "fc_tobottom")), (a.toRight = h >= p - 5) && setStyle(a.wrap, {
                        left: "auto",
                        right: 0,
                        marginRight: lastWndScroll[0] ? sbWidth() : 0
                    }), a._update_pos();
                    var e = Math.abs(t.pageY - n) < 3 && Math.abs(t.pageX - c) < 3;
                    cur._fcpromo > 0 ? cur._fcpromo = e ? 0 : -1 : a.options.minimizer && e ? !a.minimized && r ? a.minimize(!0) : a.minimized && a.unminimize(!0) : a.options
                        .onDragEnd && a.options.onDragEnd(a.toBottom ? -1 : d / o[0], a.toRight ? -1 : h / o[1])
                };
            return addEvent(document, "mousemove", _), addEvent(document, "mouseup", m), addEvent(document, v, cancelEvent), setStyle(bodyNode, "cursor", "move"),
                setStyle(s, "cursor", "move"), !1
        }
    },
    _resize_mdown: function(t) {
        if (!checkEvent(t)) {
            this.focus(t);
            var e, i, a = this,
                s = t.target,
                o = getWndInner(),
                r = t.pageY,
                n = t.pageX,
                c = a.wrap.offsetHeight,
                l = a.wrap.offsetWidth,
                u = 0,
                d = 0,
                h = a.resizeableH.clientHeight - intval(getStyle(a.resizeableH, "paddingBottom")) - intval(getStyle(a.resizeableH, "paddingTop")),
                f = a.resizeableW.clientWidth - intval(getStyle(a.resizeableW, "paddingRight")) - intval(getStyle(a.resizeableW, "paddingLeft")),
                p = browser.msie ? "selectstart" : "mousedown",
                v = !browser.msie && a.options.onResize || !1;
            a.toBottom ? (a.toBottom = !1, e = o[0] - intval(getStyle(a.wrap, "bottom")) - c, setStyle(a.wrap, {
                top: e,
                bottom: "auto"
            }), removeClass(a.wrap, "fc_tobottom")) : e = intval(getStyle(a.wrap, "top")), a.toRight ? (a.toRight = !1, i = o[1] - intval(getStyle(a.wrap, "right")) -
                l, setStyle(a.wrap, {
                    left: i,
                    right: "auto"
                })) : i = intval(getStyle(a.wrap, "left")), a.options.onResizeStart && a.options.onResizeStart(h, f);
            var _ = h + o[0] - e - c,
                m = f + o[1] - i - l,
                g = function(t) {
                    return u = Math.max(a.options.minH, Math.min(_, h + t.pageY - r)), 10 > _ - u && (u = _), a.resizeableH.style.height = u + "px", d = Math.max(a.options
                        .minW, Math.min(m, f + t.pageX - n)), 10 > m - d && (d = m), a.resizeableW.style.width = d + "px", v && v(u, d), cancelEvent(t)
                },
                C = function(t) {
                    removeEvent(document, "mousemove", g), removeEvent(document, "mouseup", C), removeEvent(document, p, cancelEvent), setStyle(bodyNode, "cursor", ""),
                        setStyle(s, "cursor", ""), (a.toBottom = u == _) && (setStyle(a.wrap, {
                            top: "auto",
                            bottom: 0
                        }), addClass(a.wrap, "fc_tobottom")), (a.toRight = d == m) && setStyle(a.wrap, {
                            left: "auto",
                            right: 0,
                            marginRight: lastWndScroll[0] ? sbWidth() : 0
                        }), a._update_pos(), a.options.onResizeEnd && a.options.onResizeEnd(u, d, o[0], o[1], a.toBottom, a.toRight)
                };
            return addEvent(document, "mousemove", g), addEvent(document, "mouseup", C), addEvent(document, p, cancelEvent), setStyle(bodyNode, "cursor", "move"),
                setStyle(s, "cursor", "move"), !1
        }
    },
    _update_pos: function() {
        var t = this;
        t.wrap;
        t.pos = [t.wrap.offsetTop, t.wrap.offsetLeft, t.wrap.offsetHeight, t.wrap.offsetWidth]
    },
    _wnd_resize: function(t, e, i) {
        var a = this;
        a.toBottom && (a.pos[0] = a.wrap.offsetTop), a.toRight && (a.pos[1] = a.wrap.offsetLeft);
        var s = {},
            o = !1,
            r = !1,
            n = a.pos[0] + a.pos[2] - t,
            c = a.pos[0],
            l = a.resizeableH.clientHeight - a.options.minH,
            u = a.pos[1] + a.pos[3] - e,
            d = a.pos[1],
            h = a.options.resize !== !1 ? a.resizeableW.clientWidth - a.options.minW : 0;
        i && (0 > h && setStyle(a.resizeableW, a.options.minW), 0 > l && setStyle(a.resizeableH, a.options.minH)), (0 >= n || 0 >= c && 0 >= l) && (0 >= u || 0 >= d &&
            0 >= h) || (n > 0 && c > 0 && (c = Math.min(n, c), n -= c, s.top = a.pos[0] - c, s.bottom = ""), n > 0 && l > 0 && (l = Math.min(n, l), o = a.resizeableH
            .clientHeight - l), u > 0 && d > 0 && (d = Math.min(u, d), u -= d, s.left = a.pos[1] - d, s.right = ""), u > 0 && h > 0 && (h = Math.min(u, h), r =
            a.resizeableW.clientWidth - h), r !== !1 && setStyle(a.resizeableW, "width", r), o !== !1 && setStyle(a.resizeableH, "height", o), setStyle(a.wrap,
            s), a._update_pos(), a.options.onResize && a.options.onResize(a.resizeableH.clientHeight, a.resizeableW.clientWidth))
    },
    _cont_mdown: function(t) {
        var e = curRBox.active != this.id;
        return e && (this.focus(t), !hasClass(t.target, "fc_editable")) ? cancelEvent(t) : void 0
    },
    _focus: function() {
        var t = this,
            e = indexOf(curRBox.focused, t.id),
            i = curRBox.active,
            a = i && curRBox.tabs[i];
        if (i != t.id) {
            a && isFunction(a.options.onBlur) && a.options.onBlur(), -1 != e && curRBox.focused.splice(e, 1), curRBox.focused.unshift(t.id);
            var s = BASIC_CHAT_ZINDEX + curRBox.focused.length,
                o = !0;
            each(curRBox.focused, function(t, e) {
                var i = curRBox.tabs[e].wrap;
                o ? (addClass(i, "rb_active"), removeClass(i, "rb_inactive"), curRBox.active = e, o = !1) : (removeClass(i, "rb_active"), addClass(i,
                    "rb_inactive")), setStyle(i, "zIndex", s), s--
            })
        }
    },
    _hide_click: function() {
        this.hide()
    },
    minimize: function(t) {
        var e = this,
            i = e.wrap;
        return e.options.fixed ? !1 : (addClass(i, "rb_minimized"), e.minimized = !0, e._update_pos(), void(t && e.options.onMinimize && e.options.onMinimize(0)))
    },
    unminimize: function(t) {
        var e = this,
            i = e.wrap,
            a = getWndInner();
        removeClass(i, "rb_minimized"), e.minimized = !1, e._update_pos(), e._wnd_resize(a[0], a[1], !0), curRBox.active = !1, e.focus(), t && e.options.onMinimize &&
            e.options.onMinimize(1)
    },
    _min_toggle: function(t) {
        var e = this;
        setTimeout(function() {
            e.minimized ? e.unminimize(!0) : e.minimize(!0)
        }, 50)
    },
    destroy: function() {
        var t = this,
            e = indexOf(curRBox.focused, t.id); - 1 != e && curRBox.focused.splice(e, 1), cleanElems(t.wrap, t.resizeWrap, t.content, t.options.movable, t.options.closer,
            t.options.hider), re(t.wrap), delete curRBox.tabs[t.id], delete t
    },
    _close_mdown: function(t) {
        (t.originalEvent || t)
        .cancelBubble = !0
    },
    _close_click: function(t) {
        this.close()
    },
    _close: function(t) {
        this.destroy(), curRBox.focused[0] && t !== !0 && curRBox.tabs[curRBox.focused[0]].focus()
    },
    focus: function(t) {
        var e = this,
            i = curRBox.active != e.id || !0;
        return e._focus(), i && isFunction(e.options.onFocus) && e.options.onFocus(t), i
    },
    close: function() {
        var t = this,
            e = t.pos;
        t._close(), isFunction(t.options.onClose) && t.options.onClose(e)
    }
}), window.curFastChat || (curFastChat = {}), FastChat = {
    init: function(t) {
        extend(curFastChat, {
            tabs: {},
            needPeers: {},
            gotPeers: {},
            needMedia: {},
            gotMedia: {},
            myTypingEvents: {},
            typingEvents: {},
            inited: !0,
            options: t,
            posSeq: 0,
            error_timeout: 1
        }), delete curFastChat.standby, delete curFastChat.standbyTO, Notifier.addRecvClbk("fastchat", 0, FastChat.lcRecv, !0), Notifier.addRecvClbk("logged_off", 0,
            FastChat.standby, !0), FastChat.lcSend("needSettings", {
            version: t.version,
            lang_id: langConfig.id
        }), clearTimeout(curFastChat.getSettingsTO), curFastChat.getSettingsTO = setTimeout(FastChat.getSettings, 300)
    },
    getSettings: function() {
        var t = ls.get("fcFriends" + vk.id);
        ajax.post("al_im.php", {
            act: "a_get_fast_chat",
            friends: t && t.version
        }, {
            onDone: function(e) {
                -1 == e.friends ? (e.friends_version = t.version, e.friends = t.list) : ls.set("fcFriends" + vk.id, {
                    version: e.friends_version,
                    list: e.friends
                }), FastChat.gotSettings(e), FastChat.sendSettings()
            },
            onFail: function() {
                return !0
            }
        })
    },
    gotSettings: function(t) {
        t.emoji_stickers && (window.emojiStickers = t.emoji_stickers), window.Emoji && Emoji.updateTabs(), clearTimeout(curFastChat.getSettingsTO), window.lang = extend(
            window.lang || {}, t.lang), extend(curFastChat, t, {
            lang_id: langConfig.id
        }), curNotifier.is_server && (t.im_queue ? curFastChat.lpInited || FastChat.initLp() : (clearTimeout(curFastChat.lp_error_to), curFastChat.lp_error_to =
            setTimeout(FastChat.updateQueueKeys.bind(FastChat), 1e3 * (curNotifier.error_timeout || 1)))), curFastChat.friendsCnt = 0;
        for (var e in curFastChat.friends || {}) curFastChat.friendsCnt++;
        setTimeout(FastChat.clistCache.pbind(!1), 10), FastChat.initUI()
    },
    sendSettings: function() {
        clearTimeout(curFastChat.sendSettingsTO);
        var t, e = {},
            i = ["friends", "friends_version", "onlines", "tpl", "lang", "me", "version", "im_queue", "cl_queue"];
        for (t in i) {
            if ("cl_queue" != i[t] && void 0 === curFastChat[i[t]]) return;
            e[i[t]] = curFastChat[i[t]]
        }
        clearTimeout(curFastChat.sendSettingsTO), curFastChat.sendSettingsTO = setTimeout(function() {
            FastChat.lcSend("settings", {
                settings: e
            })
        }, curNotifier.is_server ? 0 : irand(50, 100))
    },
    becameServer: function() {
        !curFastChat.lpInited && curFastChat.version && (delete curNotifier.addQueues["fastchat" + vk.id], delete curNotifier.addQueues["contacts" + vk.id], curFastChat.im_queue ?
            curFastChat.lpInited || FastChat.initLp() : (clearTimeout(curFastChat.lp_error_to), curFastChat.lp_error_to = setTimeout(FastChat.updateQueueKeys.bind(
                FastChat), 1e3 * (curNotifier.error_timeout || 1))))
    },
    destroy: function() {
        if (!curFastChat.inited) return !1;
        return FastChat.stopLp(), each(curFastChat.tabs || {}, function(t, e) {
            e.box.destroy()
        }), curFastChat.clistBox && curFastChat.clistBox.destroy(), each(curFastChat.el || {}, function() {
            cleanElems(this)
        }), clearInterval(curFastChat.updateFriendsInt), clearInterval(curFastChat.updateTypingsInt), clearTimeout(curFastChat.correspondentsTO), clearTimeout(
            curFastChat.lp_error_to), curFastChat = {
            inited: !1
        }, !0
    },
    isChatOpen: function(t) {
        return window.curFastChat && curFastChat.inited && t && (curFastChat.tabs && curFastChat.tabs[t] && curFastChat.tabs[t].box.visible || curFastChat.clistBox &&
            curFastChat.clistBox.visible) ? !0 : !1
    },
    standby: function(t) {
        FastChat.destroy(), curFastChat.standby = !0;
        var e = 1,
            i = function() {
                return curNotifier.is_server ? void ajax.post("notifier.php?act=a_get_reload", {
                    version: t
                }, {
                    onDone: function(t, e) {
                        FastChat.lcSend("gotConfig", {
                            navVersion: t,
                            config: e
                        }), FastChat.gotConfig(t, e)
                    },
                    onFail: function() {
                        return e *= 2, clearTimeout(curFastChat.standbyTO), curFastChat.standbyTO = setTimeout(i, 1e3 * e), !0
                    }
                }) : (clearTimeout(curFastChat.standbyTO), void(curFastChat.standbyTO = setTimeout(i, 1e3 * e)))
            };
        i()
    },
    gotConfig: function(t, e) {
        clearTimeout(curFastChat.standbyTO), curFastChat.standby && setTimeout(function() {
            t > stVersions.nav && (debugLog("appending al loader"), headNode.appendChild(ce("script", {
                type: "text/javascript",
                src: "/js/loader_nav" + t + "_" + vk.lang + ".js"
            }))), setTimeout(function() {
                return t <= stVersions.nav ? void stManager.add(["notifier.js", "notifier.css", "emoji.js"], function() {
                    FastChat.init(e)
                }) : void setTimeout(arguments.callee, 100)
            }, 0)
        }, curNotifier.is_server ? 0 : irand(1e3, 2e3))
    },
    updateVersion: function(t) {
        FastChat.lcSend("standby", {
            version: t
        }), FastChat.standby(t)
    },
    lcSend: function(t, e) {
        Notifier.lcSend("fastchat", extend({
            act: t,
            __id: curFastChat.me && curFastChat.me.id || vk.id
        }, e))
    },
    lcRecv: function(t) {
        if (!isEmpty(t)) {
            var e = t.act;
            t.__id == (curFastChat.me && curFastChat.me.id || vk.id) && (delete t.act, delete t.__id, FastChat.lcFeed(e, t))
        }
    },
    lcFeed: function(t, e) {
        switch (t) {
            case "needSettings":
                curFastChat.version < e.version || e.lang_id == curFastChat.lang_id && FastChat.sendSettings();
                break;
            case "settings":
                !curFastChat.version && curFastChat.options && e.settings.version == curFastChat.options.version && FastChat.gotSettings(e.settings), clearTimeout(
                    curFastChat.sendSettingsTO);
                break;
            case "standby":
                if (!curFastChat.version) break;
                FastChat.standby(e.version);
                break;
            case "gotConfig":
                FastChat.gotConfig(e.navVersion, e.config);
                break;
            case "clFeed":
                if (!curFastChat.version) break;
                FastChat.clFeed(e.events);
                break;
            case "clistOnlines":
                if (!curFastChat.version) break;
                FastChat.clistGotOnlines(e);
                break;
            case "imFeeds":
                if (!curFastChat.version) break;
                FastChat.imFeeds(e);
                break;
            case "needPeer":
                if (!curFastChat.version) break;
                var i, a, s = e.id,
                    o = curFastChat.tabs[s],
                    r = !1;
                if (void 0 !== o) {
                    r = {
                        name: o.name,
                        photo: o.photo,
                        fname: o.fname,
                        hash: o.hash,
                        sex: o.sex,
                        data: o.data,
                        online: o.online
                    };
                    for (i in o.msgs) {
                        r.history = [o.log.innerHTML, o.msgs];
                        break
                    }
                } else(a = curFastChat.friends[s + "_"]) && (r = {
                    name: a[0],
                    photo: a[1],
                    fname: a[2],
                    hash: a[3],
                    data: a[4],
                    online: curFastChat.onlines[s]
                });
                if (r === !1) break;
                curFastChat.gotPeers[s] = setTimeout(function() {
                    var t = {};
                    t[s] = r, FastChat.lcSend("gotPeers", t)
                }, curNotifier.is_server ? 0 : irand(50, 100));
                break;
            case "fetchingPeers":
                if (!curFastChat.version) break;
                each(e, function(t, e) {
                    var i = curFastChat.needPeers[t];
                    i && (e & i[0]) == i[0] && clearTimeout(i[2])
                });
                break;
            case "gotPeers":
                if (!curFastChat.version) break;
                FastChat.gotPeers(e);
                break;
            case "stateChange":
                if (!curFastChat.version) break;
                FastChat.onStateChanged(e);
                break;
            case "queueSet":
                extend(curFastChat, e);
                break;
            case "queueClean":
                curNotifier.is_server || (delete curFastChat.im_queue, delete curFastChat.cl_queue);
                break;
            case "needMedia":
                var n = e.msgId,
                    c = curFastChat.gotMedia[n];
                if (void 0 === c || 0 === c) break;
                curFastChat.gotMedia[n][3] = setTimeout(function() {
                    FastChat.lcSend("gotMedia", {
                        msgId: n,
                        peer: c[0],
                        text: c[1],
                        msgOpts: c[2]
                    })
                }, curNotifier.is_server ? 0 : irand(50, 100));
                break;
            case "fetchingMedia":
                var n = e.msgId,
                    l = curFastChat.needMedia[n];
                if (void 0 === l || 0 === curFastChat.gotMedia[n]) break;
                clearTimeout(l[1]), l[1] = setTimeout(FastChat.loadMsgMedia.pbind(l[0], n), 1e3);
                break;
            case "gotMedia":
                var n = e.msgId,
                    c = curFastChat.gotMedia[n];
                isArray(c) && clearTimeout(c[3]), FastChat.gotMsgMedia(e.peer, n, e.text, e.msgOpts)
        }
    },
    initLp: function() {
        curFastChat.lpInited = !0, FastChat.checkLp(), curFastChat.checkLpInt = setInterval(FastChat.checkLp, 2e4)
    },
    stopLp: function() {
        curFastChat.lpInited = !1, clearInterval(curFastChat.checkLpInt), delete curFastChat.im_queue, delete curFastChat.cl_queue
    },
    checkLp: function() {
        curNotifier.is_server && curFastChat.im_queue && (Notifier.addKey({
            queue: curFastChat.im_queue.id,
            key: curFastChat.im_queue.key,
            ts: curFastChat.im_queue.ts
        }, FastChat.imChecked, !0), curFastChat.cl_queue && Notifier.addKey({
            queue: curFastChat.cl_queue.id,
            key: curFastChat.cl_queue.key,
            ts: curFastChat.cl_queue.ts
        }, FastChat.clChecked, !0), FastChat.lcSend("queueSet", {
            im_queue: curFastChat.im_queue,
            cl_queue: curFastChat.cl_queue
        }))
    },
    updateQueueKeys: function() {
        curFastChat.updatingQueues || (curFastChat.updatingQueues = 1, FastChat.lcSend("queueClean"), FastChat.stopLp(), ajax.post("al_im.php", {
            act: "a_get_fc_queue"
        }, {
            onDone: function(t) {
                return t.version > curFastChat.version ? void FastChat.updateVersion(t.version) : (delete curFastChat.updatingQueues, extend(curFastChat, t),
                    FastChat.lcSend("queueSet", t), void(curNotifier.is_server && (FastChat.initLp(), FastChat.clistUpdate())))
            },
            onFail: function() {
                return delete curFastChat.updatingQueues, FastChat.destroy(), !0
            }
        }))
    },
    clChecked: function(t, e) {
        if (curFastChat.inited && curFastChat.ready && curFastChat.cl_queue) {
            if (e.failed) return clearTimeout(curFastChat.lp_error_to), void(curFastChat.lp_error_to = setTimeout(FastChat.updateQueueKeys.bind(FastChat), 1e3 * (
                curNotifier.error_timeout || 1)));
            e.ts && (e.key && (curFastChat.cl_queue.key = e.key), curFastChat.cl_queue.ts = e.ts, FastChat.lcSend("queueSet", {
                cl_queue: curFastChat.cl_queue
            })), isArray(e.events) && e.events.length && (FastChat.clFeed(e.events), FastChat.lcSend("clFeed", {
                events: e.events
            }))
        }
    },
    clFeed: function(t) {
        if (curFastChat.inited && curFastChat.ready && curFastChat.tabs) {
            var e = !1,
                i = !1;
            each(t, function() {
                var t = this.split("<!>"),
                    a = t[0],
                    s = t[1],
                    o = t[2],
                    r = t[3] ? t[3] : 1,
                    n = curFastChat.tabs[o],
                    c = curFastChat.onlines[o];
                if (a != curFastChat.version) return FastChat.updateVersion(a), i = !0, !1;
                if (curFastChat.friends[o + "_"] || n) switch (s) {
                    case "online":
                        if (c == r) break;
                        curFastChat.onlines[o] = r, FastChat.tabNotify(o, "online", r), e = !0;
                        break;
                    case "offline":
                        if (!c) break;
                        delete curFastChat.onlines[o], re("fc_contact" + o) && curFastChat.clistBox.visible && FastChat.clistShowMore(), FastChat.tabNotify(o,
                            "offline")
                }
            }), i || (e && curFastChat.clistBox.visible && curNotifier.idle_manager && !curNotifier.idle_manager.is_idle && (curFastChat.el.clist.scrollTop < 100 ||
                curRBox.active != curFastChat.clistBox.id) ? FastChat.clistRender() : FastChat.clistUpdateTitle())
        }
    },
    imChecked: function(t, e) {
        if (curFastChat.inited && curFastChat.ready && curFastChat.im_queue) {
            if (e.failed) return clearTimeout(curFastChat.lp_error_to), void(curFastChat.lp_error_to = setTimeout(FastChat.updateQueueKeys.bind(FastChat), 1e3 * (
                curNotifier.error_timeout || 1)));
            if (e.ts && curFastChat.im_queue && (e.key && (curFastChat.im_queue.key = e.key), curFastChat.im_queue.ts = e.ts, FastChat.lcSend("queueSet", {
                    im_queue: curFastChat.im_queue
                })), isArray(e.events) && e.events.length) {
                var i = {},
                    a = !1;
                each(e.events, function() {
                    var t = this.split("<!>"),
                        e = t[0],
                        s = t[1],
                        o = t[2],
                        r = 0;
                    curFastChat.tabs[o];
                    if (e != curFastChat.version) return FastChat.updateVersion(e), a = !0, !1;
                    switch (s) {
                        case "read":
                            break;
                        case "typing":
                            r = 1;
                            break;
                        case "new":
                            r = 2 & t[4] ? 0 : 2;
                            break;
                        default:
                            return
                    }
                    i[o] || (i[o] = [0]), i[o][0] |= r, i[o].push(t)
                }), a || isEmpty(i) || (FastChat.lcSend("imFeeds", i), FastChat.imFeeds(i))
            }
        }
    },
    imFeeds: function(t) {
        curFastChat.inited && curFastChat.ready && each(t, function(t, e) {
            e.shift();
            FastChat.imFeed(t, e)
        })
    },
    blinkEl: function(t, e, i) {
        return e > 10 ? (i(), !1) : void(e % 2 == 0 ? animate(t, {
            opacity: 0
        }, 400, function() {
            FastChat.blinkEl(t, e + 1, i)
        }) : animate(t, {
            opacity: 1
        }, 400, function() {
            setTimeout(function() {
                FastChat.blinkEl(t, e + 1, i)
            }, 400)
        }))
    },
    blinkTyping: function(t) {
        var e = ge("chat_tab_icon_" + t);
        if (e) {
            var i = geByClass1("chat_tab_typing_wrap", e);
            fadeIn(i, 150, function() {
                FastChat.blinkEl(i.firstChild, 0, function() {
                    fadeOut(i, 150)
                })
            })
        }
    },
    imFeed: function(t, e) {
        var i = curFastChat.tabs[t],
            a = vkNow();
        return each(e, function(e, i) {
            switch (i[1]) {
                case "new":
                    1 === (3 & i[4]) && FastChat.changePeerCounter(t, 1);
                    break;
                case "read":
                    var a = 1;
                    each(i[3].split(","), function(t, e) {
                        a += 1
                    }), FastChat.changePeerCounter(t, -a);
                    break;
                case "typing":
                    Chat.tabs[t] && FastChat.blinkTyping(t)
            }
        }), i ? (each(e, function(e, s) {
            switch (s[1]) {
                case "new":
                    stManager.add(["imn.js"], function() {
                        each(i.sentmsgs, function(t, e) {
                            var i = ge("fc_msg" + e),
                                a = i && i.parentNode;
                            re(i) && a && !geByClass("fc_msg", a)
                                .length && re(domClosest("fc_msgs_wrap", a))
                        }), ge("fc_msg" + s[3]) || (FastChat.addMsg(FastChat.prepareMsgData(s.slice(2))), i.msgs[s[3]] = [2 & s[4] ? 1 : 0, 1 & s[4]],
                            1 === (3 & s[4]) && i.unread++, FastChat.scroll(t)), FastChat.blinkTab(t)
                    });
                    break;
                case "read":
                    var o = [],
                        r = intval(s[3]);
                    each(i.msgs, function(t) {
                        intval(t) <= r && i.msgs[t][1] && o.push(intval(t))
                    }), each(o, function(t, e) {
                        var a, s = ge("fc_msg" + e);
                        s && (a = i.msgs[e] && i.msgs[e][0] ? s.parentNode.parentNode : s.parentNode, i.msgs[e] && i.msgs[e][1] && (i.msgs[e][1] = 0, i
                            .msgs[e][0] || i.unread--), removeClass(s, "fc_msg_unread"), hasClass(a.parentNode, "fc_msgs_unread") && each(a.childNodes,
                            function() {
                                return hasClass(this, "fc_msg_unread") ? void 0 : (removeClass(a.parentNode, "fc_msgs_unread"), !1)
                            }))
                    });
                    break;
                case "typing":
                    t > 2e9 ? (curFastChat.typingEvents[t] || (curFastChat.typingEvents[t] = {}), curFastChat.typingEvents[t][s[3]] = a) : curFastChat.typingEvents[
                        t] = a, FastChat.updateTyping(t)
            }
        }), i.unread > 0 && (i.unread = 0, each(i.msgs, function() {
            !this[0] && this[1] && i.unread++
        })), i.auto && !i.unread && (i.box._close(!0), delete curFastChat.tabs[t]), void FastChat.updateUnreadTab(t)) : !1
    },
    tabNotify: function(t, e, i) {
        var a = curFastChat.tabs[t];
        if (t > 0 && 2e9 > t && isFunction(cur.onPeerStatusChanged) && cur.onPeerStatusChanged(t, e, i), !(0 >= t) && a && a.box && !a.box.minimized) {
            switch (clearTimeout(a.hideNotifyTO), e) {
                case "online":
                    text = getLang("mail_im_user_became_online", 3 - a.sex), FastChat.blinkTab(t);
                    break;
                case "offline":
                    text = getLang("mail_im_user_became_offline", 3 - a.sex), FastChat.blinkTab(t);
                    break;
                case "unavail":
                    text = getLang("mail_im_not_online", 3 - a.sex)
                        .replace(/\.$/, "")
            }
            text = text.replace("{user}", a.fname), val(a.notify, '<div class="fc_tab_notify fc_tab_notify_' + e + '">' + text + "</div>");
            var s = a.notify.firstChild;
            clearTimeout(a.hideNotifyTO), a.hideNotifyTO = setTimeout(function() {
                fadeOut(s, 200, function() {
                    val(a.notify, "")
                })
            }, 5e3)
        }
    },
    hideChatCtrl: function() {
        removeClass(Chat.wrap, "chat_active"), removeEvent(document, "mousedown", FastChat.onDocClick)
    },
    showChatCtrl: function() {
        addClass(Chat.wrap, "chat_active"), setTimeout(function() {
            addEvent(document, "mousedown", FastChat.onDocClick)
        }, 0)
    },
    initUI: function() {
        var t = curFastChat.el = {},
            e = getWndInner();
        re("rb_box_fc_clist"), t.clistWrap = se(curFastChat.tpl.clist), t.clist = geByClass1("fc_contacts", t.clistWrap, "div"), t.clistTitle = geByClass1("fc_tab_title",
            t.clistWrap, "div"), t.clistOnline = geByClass1("fc_clist_online", t.clistWrap, "div");
        var i = curFastChat.options.state || !1,
            a = !curFastChat.friendsCnt || (i && void 0 !== i.clist.min ? i.clist.min : e[1] < 1200 || curFastChat.friendsCnt < 5);
        curFastChat.clistW = 270, curFastChat.clistH = 299;
        var s = {
            id: "fc_clist",
            movable: geByClass1("fc_tab_head", t.clistWrap),
            hider: geByClass1("fc_tab_close_wrap", t.clistWrap, "a"),
            startHeight: curFastChat.clistH,
            startWidth: curFastChat.clistW,
            resizeableH: t.clist,
            resize: !1,
            minH: 150,
            fixed: a,
            onHide: function(e) {
                val("fc_clist_filter", curFastChat.q = ""), addClass(curFastChat.clistBox.wrap, "fc_fixed"), curFastChat.clistBox.fixed = !0, FastChat.stateChange({
                    op: "clist_toggled",
                    val: 0
                }), setStyle(curFastChat.clistBox.wrap, {
                    top: "auto",
                    bottom: 0,
                    right: 72,
                    left: "auto"
                }), show(t.topLink), FastChat.hideChatCtrl()
            },
            onShow: function() {
                FastChat.showChatCtrl()
            },
            onDragEnd: function(t, e) {
                FastChat.stateChange({
                    op: "clist_moved",
                    y: t,
                    x: e
                })
            },
            onResize: function(t, e) {
                curFastChat.clistBoxScroll && curFastChat.clistBoxScroll.update(!1, !0)
            }
        };
        i && !a && (i.clist.x !== !1 && (-1 == i.clist.x ? s.startRight = 0 : s.startLeft = e[1] * i.clist.x), i.clist.y !== !1 && (-1 == i.clist.y ? s.startBottom = 0 : s
                .startTop = e[0] * i.clist.y)), a && (s.noshow = !0), void 0 === s.startTop && void 0 === s.startBottom && (s.startTop = e[0] < 800 ? 0 : .1 * e[0]), void 0 ===
            s.startLeft && void 0 === s.startRight && (s.startRight = 0), curFastChat.clistBox = new RBox(t.clistWrap, s), s.noshow || void 0 === s.startLeft && void 0 ===
            s.startTop || curFastChat.clistBox._wnd_resize(e[0], e[1], !0), curFastChat.clistBoxScroll = new Scrollbar(t.clist, {
                prefix: "fc_",
                scrollChange: FastChat.clistShowMore,
                nomargin: !0,
                global: !0,
                nokeys: !0,
                right: vk.rtl ? "auto" : 1,
                left: vk.rtl ? 1 : "auto"
            }), curFastChat.updateFriendsInt = setInterval(FastChat.clistUpdate, 18e4), curFastChat.updateTypingsInt = setInterval(FastChat.updateTypings, 5e3);
        var o = ge("fc_clist_filter");
        if (placeholderInit(o, {
                global: !0
            }), curFastChat.q = "", addEvent(o, "keyup " + (browser.opera ? "keypress" : "keydown"), function(t) {
                if (t.keyCode == KEY.ESC) return FastChat.clistHide(), cancelEvent(t);
                var e = FastChat.clistFilterKey(t);
                return void 0 !== e ? e : (curFastChat.q = trim(val(this)), void FastChat.clistRender())
            }), t.clistOnline) {
            var r, n;
            bodyNode.appendChild(n = ce("nobr", {
                className: "fl_l",
                innerHTML: getLang("mail_im_clist_onlines")
            }, {
                visibility: "hidden",
                position: "absolute"
            })), r = (n.offsetWidth || 179) - 7, re(n), addEvent(t.clistOnline, "mouseover", function(e) {
                showTooltip(this, {
                    text: getLang("mail_im_clist_onlines"),
                    forcetoup: 1,
                    shift: [12, 4, 3],
                    className: "tt_fc_onlines",
                    init: function() {
                        browser.msie && (t.clistOnline.tt.isFixed = !1)
                    },
                    black: 1
                })
            }), addEvent(t.clistOnline, "click", function(t) {
                (t.originalEvent || t)
                .cancelBubble = !0, FastChat.clistToggleOnlines(), FastChat.clistRender()
            }), i && i.clist && i.clist.onlines && FastChat.clistToggleOnlines(!0)
        }
        a ? FastChat.clistUpdateTitle() : FastChat.clistRender(), curFastChat.ready = !0, i && i.tabs && each(i.tabs, function(t, i) {
            t = intval(t);
            var a = {
                nofocus: 1
            };
            this.min && (a.minimized = !0), this.h && (a.startHeight = this.h * e[0]), this.w && (a.startWidth = this.w * e[1]), void 0 !== this.x && this.x <= 1 &&
                (this.x < 0 ? a.startRight = 0 : a.startLeft = e[1] * this.x), void 0 !== this.y && this.y <= 1 && (this.y < 0 ? a.startBottom = 0 : a.startTop = e[
                    0] * this.y), i.fx ? (a.fixedLoad = !0, FastChat.prepareTabIcon(t, a, !0)) : (a.noAnim = !0, FastChat.addPeer(t, !1, !1, a))
        }), addEvent(Chat.itemsCont, "mousemove mouseover", FastChat.itemsTT), addEvent(Chat.itemsCont, "mouseout", FastChat.itemsOut)
    },
    itemsOffset: 12,
    itemsTT: function(t) {
        for (var e = t.target, i = !1; e && e != Chat.itemsCont;) {
            if (hasClass(e, "chat_tab_wrap")) {
                i = e;
                break
            }
            e = e.parentNode
        }
        if (!i) return clearTimeout(Chat.ttOutTimeout), Chat.ttOutTimeout = !1, !1;
        var a = i.id.split("_")[3],
            s = Chat.tabs[a];
        return s ? curFastChat.activeBox && curFastChat.activeBox.visible && curFastChat.activeBox.options.peer == a ? (FastChat.itemsOut(), !1) : (clearTimeout(Chat.ttOutTimeout),
            Chat.ttOutTimeout = !1, showTooltip(i, {
                text: s.name,
                slideX: 15,
                black: 1,
                asrtl: 1,
                appendEl: Chat.ttNode,
                className: "tt_black_side",
                shift: [-58, -37, 0]
            }), void(Chat.ttPeer = i)) : !1
    },
    itemsOut: function() {
        return Chat.ttOutTimeout ? !1 : void(Chat.ttOutTimeout = setTimeout(function() {
            return Chat.ttOutTimeout = !1, Chat.ttPeer ? (triggerEvent(Chat.ttPeer, "mouseout"), void(Chat.ttPeer = !1)) : !1
        }, 0))
    },
    stateChange: function(t) {
        ajax.post("al_im.php", extend({
            act: "a_state_fc",
            hash: curFastChat.options.state_hash || ""
        }, t), {
            onFail: function() {
                return !0
            }
        }), FastChat.lcSend("stateChange", t)
    },
    onStateChanged: function(t) {
        var e = t.peer ? curFastChat.tabs[t.peer] : !1,
            i = t.peer ? e && e.box : curFastChat.clistBox,
            a = getWndInner();
        switch (t.op) {
            case "added":
                if (e) {
                    delete e.auto;
                    break
                }
                t.fixed ? FastChat.prepareTabIcon(t.peer, {
                    fixedLoad: !0
                }) : FastChat.addPeer(t.peer);
                break;
            case "unfixed":
                var s = {
                    startHeight: intval(a[0] * t.h),
                    startWidth: intval(a[1] * t.w)
                }; - 1 == t.y ? s.startBottom = 0 : s.startTop = intval(a[0] * t.y), -1 == t.x ? s.startRight = 0 : s.startLeft = intval(a[1] * t.x), FastChat.addPeer(t.peer, !
                    1, !1, s);
                break;
            case "closed":
                if (Chat.tabs[t.peer] && FastChat.closeTabIcon(t.peer), !e || !i) break;
                i.close();
                break;
            case "hidden":
                if (!e || !i) break;
                i.close();
                break;
            case "minimized":
                if (!e || !i) break;
                t.val ? i.unminimize() : i.minimize();
                break;
            case "moved":
                setStyle(i.wrap, {
                    bottom: -1 == t.y ? 0 : "auto",
                    top: -1 != t.y ? intval(a[0] * t.y) : "auto",
                    right: -1 == t.x ? 0 : "auto",
                    left: -1 != t.x ? intval(a[1] * t.x) : "auto"
                }), i.toBottom = -1 == t.y, i.toRight = -1 == t.x;
                break;
            case "resized":
                setStyle(i.wrap, {
                    bottom: -1 == t.y ? 0 : "auto",
                    top: -1 != t.y ? intval(a[0] * t.y) : "auto",
                    right: -1 == t.x ? 0 : "auto",
                    left: -1 != t.x ? intval(a[1] * t.x) : "auto"
                }), i.toBottom = -1 == t.y, i.toRight = -1 == t.x;
                var o = intval(a[1] * t.w);
                setStyle(i.resizeableH, "height", intval(a[0] * t.h)), setStyle(i.resizeableW, "width", o), FastChat.fixResized(e, o);
                break;
            case "clist_toggled":
                t.val ? i.show(0, !0) : i.hide(0, !0), toggle(curFastChat.el.topLink, !t.val);
                break;
            case "clist_moved":
                setStyle(i.wrap, {
                    bottom: -1 == t.y ? 0 : "auto",
                    top: -1 != t.y ? intval(a[0] * t.y) : "auto",
                    right: -1 == t.x ? 0 : "auto",
                    left: -1 != t.x ? intval(a[1] * t.x) : "auto"
                }), i.toBottom = -1 == t.y, i.toRight = -1 == t.x;
                break;
            case "onlines_toggled":
                FastChat.clistToggleOnlines(t.val), FastChat.clistRender()
        }
    },
    onUnidle: function() {
        curNotifier.version && curFastChat.clistBox && (curFastChat.clistBox.visible && (curFastChat.el.clist.scrollTop < 100 || curRBox.active != curFastChat.clistBox.id) ?
            FastChat.clistRender() : FastChat.clistUpdateTitle(), each(curFastChat.tabs, function(t) {
                FastChat.restoreDraft(t)
            }))
    },
    clistUpdate: function() {
        var t = vkNow();
        if (curNotifier.is_server && !(curFastChat.clistUpdatedTs && t - curFastChat.clistUpdatedTs < 6e4)) {
            curFastChat.clistUpdatedTs = t;
            var e, i = [];
            for (e in curFastChat.tabs) i.push(e);
            for (e in Chat.tabs) i.push(e);
            ajax.post("al_im.php", {
                act: "a_onlines",
                peer: i.join(",")
            }, {
                onDone: function(t) {
                    FastChat.clistGotOnlines(t), FastChat.lcSend("clistOnlines", t)
                }
            })
        }
    },
    clistGotOnlines: function(t) {
        var e = curFastChat.onlines,
            i = [];
        curFastChat.onlines = t, curNotifier.idle_manager && curNotifier.idle_manager.is_idle || !curFastChat.tabs && Chat.tabs || (each(curFastChat.tabs, function(a) {
            curFastChat.onlines[a] != e[a] && (FastChat.tabNotify(a, t[a] ? "online" : "offline", t[a]), t[a] || (i[a] = 1))
        }), each(Chat.tabs, function(i) {
            curFastChat.onlines[i] != e[i] && (t[i] ? addClass(ge("chat_tab_icon_" + i), "chat_tab_online") : removeClass(ge("chat_tab_icon_" + i),
                "chat_tab_online"))
        }), i = arrayKeyDiff(e, t, i), each(i, function(t) {
            FastChat.tabNotify(t, "offline")
        }), FastChat.clistRender())
    },
    clistShow: function() {
        var t = hasClass(Chat.wrap, "chat_active");
        FastChat.clistRender(), curFastChat.clistBox.visible ? curFastChat.clistBox.focus() : (curFastChat.activeBox && curFastChat.activeBox != curFastChat.clistBox &&
            curFastChat.activeBox.hide(), curFastChat.clistBox.show(), FastChat.setActive(curFastChat.clistBox), curFastChat.clistBoxScroll && curFastChat.clistBoxScroll
            .update(!1, !0), curFastChat.el.topLink && hide(curFastChat.el.topLink)), elfocus("fc_clist_filter"), FastChat.movePointer(!1, t)
    },
    clistHide: function() {
        curFastChat.clistBox.hide(), curFastChat.activeBox == curFastChat.clistBox && FastChat.setActive(!1)
    },
    clistRender: function(t) {
        var e = [],
            i = !t,
            a = 1 + (t ? 40 : 20),
            s = curFastChat.q,
            o = !1,
            r = !1,
            n = !1;
        if (s ? (n = [], each(FastChat.clistCache(s), function() {
                n.push(escapeRE(this))
            }), n = new RegExp("([ -]|^|s|&nbsp;|\b)(" + n.join("|") + ")", "gi"), o = curFastChat.clistCache[s] || {}) : curFastChat.clOnlines && (o = curFastChat.onlines),
            curFastChat.clHasMore = !1, each(curFastChat.friends, function(t) {
                var s = intval(t),
                    c = !o || o[s];
                curFastChat.tabs[s] ? curFastChat.tabs[s].unread : 0;
                if (!i) return void(s == curFastChat.clOffset && (i = !0));
                if (c) {
                    if (!--a) return curFastChat.clHasMore = !0, !1;
                    e.push(FastChat.clistWrapPeer(s, this, n)), r = s
                }
            }), r !== !1 || t || s ? s && !curFastChat.clHasMore && e.push(FastChat.getCorrespondents(s, n, r === !1)) : e.push('<div class="fc_clist_empty">' + getLang(s ?
                "mail_im_clist_notfound" : "mail_im_clist_empty") + "</div>"), curFastChat.clOffset = r, t) {
            for (var c = ce("div", {
                    innerHTML: e.join("")
                }), l = document.createDocumentFragment(); c.firstChild;) l.appendChild(c.firstChild);
            curFastChat.el.clist.appendChild(l), curFastChat.clHasMore || FastChat.clistUpdateTitle(!0)
        } else val(curFastChat.el.clist, e.join("")), FastChat.clistUpdateTitle(!0), (browser.chrome || browser.safari) && setTimeout(function() {
            setStyle(curFastChat.el.clist.firstChild, {
                width: curFastChat.el.clist.firstChild.clientWidth
            }), setTimeout(function() {
                setStyle(curFastChat.el.clist.firstChild, {
                    width: ""
                })
            }, 0)
        }, 0);
        if (curFastChat.clSel) {
            var u = ge("fc_contact" + curFastChat.clSel);
            u ? FastChat.clistPeerOver(u, 1) : curFastChat.clSel = !1
        } else {
            var u = geByClass1("fc_contact", curFastChat.el.clist);
            FastChat.clistPeerOver(u, 1)
        }
        curFastChat.clistBoxScroll && curFastChat.clistBoxScroll.update()
    },
    clistWrapPeer: function(t, e, i) {
        var a, s, o = curFastChat.tabs[t] ? curFastChat.tabs[t].unread : 0,
            r = curFastChat.onlines[t],
            n = r ? r > 0 && 6 > r ? " fc_contact_mobile" : " fc_contact_online" : "",
            c = (e[0] || "")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        if (i && (c = c.replace(i, '$1<em class="fc_clist_hl">$2</em>')), t > 0 && 2e9 > t ? (a = "/id" + t, s =
                'onmousemove="FastChat.clistPeerOver(this.parentNode, 2);"  onmouseout="FastChat.clistPeerOver(this.parentNode, 1);"') : (a = "/im?sel=" + t, s = ""), t >
            2e9 && e[3]) var l = e[3];
        else var l = '<img src="' + Notifier.fixPhoto(e[1]) + '" class="fc_contact_photo"/>';
        return '<a href="' + a + '" class="fc_contact clear_fix' + n + '" id="fc_contact' + t + '" onclick="return FastChat.selectPeer(' + t +
            ', event);" onmousedown="event.cancelBubble = true;" onmouseover="FastChat.clistPeerOver(this, 1, event);"  onmouseout="FastChat.clistPeerOver(this, 0, event);"><span class="fc_contact_photo" ' +
            s + ">" + l + '</span><span class="fc_contact_status"></span><span class="fc_contact_name">' + c + '<span id="fc_contact_unread' + t +
            '" class="fc_contact_unread">' + (o ? " <b>+" + o + "</b>" : "") + "</span></span></a>"
    },
    clistPeerOver: function(t, e, i) {
        if (t && checkOver(i, t)) {
            var a = t.id.substr(10);
            curFastChat.clSel && e && curFastChat.clSel != a && FastChat.clistPeerOver(ge("fc_contact" + curFastChat.clSel), 0), toggleClass(t, "fc_contact_over", e), e ?
                curFastChat.clSel = a : curFastChat.clSel == a && (curFastChat.clSel = !1)
        }
    },
    authorOver: function(t, e) {
        var i = t.getAttribute("data-title"),
            a = gpeByClass("fc_tab_log", t),
            s = !1,
            o = t.getBoundingClientRect()
            .top,
            r = a.getBoundingClientRect()
            .top;
        if (10 > o - r && (s = !0), i) {
            var n = t.getAttribute("data-date");
            n && (i += "<br>" + n), showTooltip(t, {
                text: '<div class="fc_author_tt">' + i + "</div>",
                black: 1,
                center: 1,
                forcetodown: s,
                shift: [1, 8, 0]
            })
        }
    },
    getCorrespondents: function(t, e, i) {
        return clearTimeout(curFastChat.correspondentsTO), curFastChat.correspondents && void 0 !== curFastChat.correspondents[t] ? FastChat.wrapCorrespondents(curFastChat
            .correspondents[t]) || i && '<div class="fc_clist_empty">' + getLang("mail_im_clist_notfound") + "</div>" || "" : (curFastChat.correspondentsTO =
            setTimeout(FastChat.loadCorrespondents.pbind(t, e), 100), '<div id="fc_correspondents"></div>')
    },
    loadCorrespondents: function(t, e) {
        t == curFastChat.q && ajax.post("hints.php", {
            act: "a_json_friends",
            str: t,
            from: "fc",
            allow_multi: 1
        }, {
            onDone: function(i) {
                curFastChat.correspondents || (curFastChat.correspondents = {});
                var a, s = {};
                if (each(i, function() {
                        a = this[3] + "_", curFastChat.friends[a] || (s[a] = [this[1], this[2], this[3], this[4] || ""])
                    }), curFastChat.correspondents[t] = s, t == curFastChat.q) {
                    var o = ge("fc_correspondents");
                    if (o) {
                        var r = o.parentNode,
                            n = ce("div", {
                                innerHTML: FastChat.wrapCorrespondents(s, e)
                            }),
                            c = document.createDocumentFragment();
                        if (n.firstChild)
                            for (; n.firstChild;) c.appendChild(n.firstChild);
                        else r.firstChild == o && c.appendChild(ce("div", {
                            className: "fc_clist_empty",
                            innerHTML: getLang("mail_im_clist_notfound")
                        }));
                        r.replaceChild(c, o), FastChat.clistUpdateTitle(!0), curFastChat.clistBoxScroll && curFastChat.clistBoxScroll.update()
                    }
                }
            }
        })
    },
    wrapCorrespondents: function(t, e) {
        var i = [];
        return each(t, function(t) {
            i.push(FastChat.clistWrapPeer(intval(t), this, e))
        }), i.join("")
    },
    updateFriends: function(t) {
        if (window.Chat && Chat.inited) {
            var e = Chat.onl;
            e && (t > 0 ? (val(e, t), show(Chat.wrap)) : hide(Chat.wrap))
        }
    },
    onDocClick: function(t) {
        if (curFastChat.activeBox) {
            var e = t.target;
            if (curBox()) return !0;
            for (; e;) {
                if ("fc_tab_wrap" == e.className || "chat_onl_wrap" == e.id || "custom_menu_cont" == e.id || "layer_wrap" == e.id || "box_layer_wrap" == e.id ||
                    "wk_layer_wrap" == e.id) return !0;
                e = e.parentNode
            }
            var i = curFastChat.tabs[curFastChat.activeBox.options.peer];
            return i && (trim(Emoji.editableVal(i.txt)) || i.imMedia && i.imMedia.getMedias()
                .length) ? !0 : void curFastChat.activeBox.hide()
        }
    },
    clistCache: function(t) {
        if (t) {
            var e, i, a, s, o, r, n, c, l, u = [t];
            if ((i = parseLatin(t)) && u.push(i), (i = parseLatKeys(t)) && u.push(i), (i = parseCyr(t)) && u.push(i), void 0 !== curFastChat.clistCache[t]) return u;
            l = curFastChat.clistCache[t] = {};
            for (a in u)
                if (e = u[a], o = curFastChat.clistCache[" " + e.charAt(0)
                        .toLowerCase()]) {
                    n = new RegExp("(^|\\s|\\()" + escapeRE(e), "gi");
                    for (s in o) c = curFastChat.friends[s + "_"], isArray(c) && null !== c[0].match(n) && (l[s] = 1)
                }
            s = 0;
            for (a in l) s++;
            return l._num = s, u
        }
        var r, d, h;
        curFastChat.clistCache = {};
        for (a in curFastChat.friends)
            for (r = curFastChat.friends[a][0], a = intval(a), d = 0;;) {
                if (h = " " + r.charAt(d)
                    .toLowerCase(), curFastChat.clistCache[h] || (curFastChat.clistCache[h] = {}), curFastChat.clistCache[h][a] = 1, d = r.indexOf(" ", d + 1), -1 == d)
                    break;
                ++d
            }
    },
    clistShowMore: function() {
        if (curFastChat.clHasMore) {
            var t = curFastChat.el.clist,
                e = t.scrollTop,
                i = t.clientHeight,
                a = t.scrollHeight;
            e + 3 * i > a && FastChat.clistRender(!0)
        }
    },
    clistUpdateTitle: function(t) {
        var e, i = 0,
            a = 0;
        for (e in curFastChat.friends) curFastChat.onlines[intval(e)] ? (a++, i++) : curFastChat.clOnlines || i++;
        newVal = (a ? getLang("mail_im_X_onlines_title", a) : getLang("mail_im_onlines_title"))
            .toString(), FastChat.updateFriends(a), val(curFastChat.el.clistTitle, newVal), val(curFastChat.el.topLink, newVal.toLowerCase()), curFastChat.clistBoxScroll &&
            (!curFastChat.clHasMore && t ? i = curFastChat.el.clist.childNodes.length : curFastChat.q && (i = intval((curFastChat.clistCache[curFastChat.q] || {})
                ._num)), curFastChat.clistBoxScroll.options.contHeight = 50 * i)
    },
    clistToggleOnlines: function(t) {
        void 0 === t && (t = !curFastChat.clOnlines, FastChat.stateChange({
            op: "onlines_toggled",
            val: t ? 1 : 0
        })), toggleClass(curFastChat.el.clistOnline, "fc_clist_online_active", t), curFastChat.clOnlines = t
    },
    clistFilterKey: function(t) {
        var e;
        switch (t.keyCode) {
            case KEY.DOWN:
            case KEY.UP:
                if ("keyup" != t.type) {
                    if (e = curFastChat.clSel && ge("fc_contact" + curFastChat.clSel)) {
                        var i = t.keyCode == KEY.DOWN ? "nextSibling" : "previousSibling",
                            a = e;
                        do a = a[i]; while (a && (1 != a.nodeType || !hasClass(a, "fc_contact")))
                    } else curFastChat.clSel || t.keyCode != KEY.DOWN || (a = geByClass1("fc_contact", curFastChat.el.clist, "a"));
                    if (a && a != e) {
                        FastChat.clistPeerOver(a, 1);
                        var s = curFastChat.el.clist;
                        a.offsetTop + 16 > s.clientHeight + s.scrollTop ? (s.scrollTop = a.offsetTop + 16 - s.clientHeight, curFastChat.clistBoxScroll.update()) : a.offsetTop -
                            36 < s.scrollTop && (s.scrollTop = a.offsetTop - 36, curFastChat.clistBoxScroll.update())
                    }
                }
                break;
            case KEY.LEFT:
            case KEY.RIGHT:
                return !0;
            case KEY.ENTER:
                if ("keyup" == t.type || !(e = curFastChat.clSel && ge("fc_contact" + curFastChat.clSel))) break;
                t.ctrlKey || t.metaKey && browser.mac ? nav.go(e.href.match(/\b(vkontakte\.ru|vk\.com)(\/[^\/]+?)$/)[2]) : FastChat.selectPeer(curFastChat.clSel);
            case KEY.ESC:
                if ("keyup" != t.type) {
                    var o = ge("fc_clist_filter"),
                        r = val(o) || curFastChat.clSel;
                    o.blur(), val(o, curFastChat.q = ""), curFastChat.clSel = !1, r && FastChat.clistRender()
                }
                break;
            default:
                return
        }
        return cancelEvent(t)
    },
    changePeerCounter: function(t, e, i) {
        if (!Chat.tabs[t]) return !1;
        var a = ge("chat_tab_icon_" + t),
            s = geByClass1("chat_tab_counter", a);
        s || (s = ce("div", {
                className: "chat_tab_counter"
            }), a.insertBefore(s, a.firstChild)), void 0 === i ? Chat.counters[t] = positive((Chat.counters[t] || 0) + e) : Chat.counters[t] = i, Chat.counters[t] ? s.innerHTML =
            Chat.counters[t] : re(s)
    },
    prepareTabIcon: function(t, e, i) {
        var a = curFastChat.friends && curFastChat.friends[t + "_"];
        if (a) {
            var s = {
                name: a[0],
                photo: a[1],
                online: curFastChat.onlines[t]
            };
            FastChat.addTabIcon(t, s, i)
        } else {
            var o = 3;
            curFastChat.needPeers[t] = [o, !1, setTimeout(FastChat.getPeers, irand(150, 200)), e], FastChat.lcSend("needPeer", {
                id: t,
                mask: o
            })
        }
    },
    addTabIcon: function(t, e, i) {
        if (!Chat.tabs[t]) {
            if (t > 2e9) var a = e.data.members_grid_fc || "";
            else var a = '<img class="chat_tab_img" src="' + e.photo + '"/>';
            if (t > 2e9) var s = "im?sel=c" + (t - 2e9);
            else var s = e.alink || "/id" + t;
            var o = se('<a class="chat_tab_wrap' + (i ? "" : " chat_tab_beforeanim") + (e.online ? " chat_tab_online" : "") + '" id="chat_tab_icon_' + t + '" href="' + s +
                '" onclick="FastChat.itemsOut();return FastChat.togglePeer(' + t +
                ', event);"><div class="chat_tab_imgcont"><div class="chat_tab_online_icon"></div><div class="chat_tab_typing_wrap"><div class="chats_sp chat_tab_typing_icon"></div></div><div class="chat_tab_close" onclick="return FastChat.closeTabIcon(' +
                t + ', event)"></div>' + a + "</div></a>");
            Chat.itemsCont.insertBefore(o, Chat.itemsCont.firstChild), Chat.tabs[t] = {
                el: o,
                name: e.name
            }, addClass(Chat.wrap, "chat_expand"), i || removeClass(o, "chat_tab_beforeanim"), FastChat.checkChatHeight(), Chat.scrollNode.scrollTop = 0
        }
    },
    checkChatHeight: function() {
        var t = getSize(Chat.itemsCont)[1];
        Chat.lastHeight = t, t > Chat.maxHeight ? (Chat.fixH || (Chat.fixH = !0, addClass(Chat.scrollNode, "chat_fix_height"), setStyle(Chat.scrollNode, {
                height: Chat.maxHeight
            }), addEvent(Chat.scrollNode, "mousewheel", FastChat.scrollWrap), addEvent(Chat.scrollNode, "DOMMouseScroll", FastChat.scrollWrap), FastChat.checkShadow()),
            Chat.scrollNode.scrollTop = t - Chat.maxHeight) : Chat.fixH && (Chat.fixH = !1, removeClass(Chat.scrollNode, "chat_fix_height"), setStyle(Chat.scrollNode, {
            height: "auto"
        }), removeEvent(Chat.scrollNode, "mousewheel", FastChat.scrollWrap), removeEvent(Chat.scrollNode, "DOMMouseScroll", FastChat.scrollWrap), FastChat.checkShadow())
    },
    checkShadow: function() {
        var t = intval(Chat.scrollNode.scrollTop);
        t && Chat.fixH ? Chat.shadowTop || (addClass(Chat.wrap, "chat_scroll_top"), fadeIn(geByClass1("chat_cont_sh_top", Chat.wrap), 200), Chat.shadowTop = !0) : Chat.shadowTop &&
            (fadeOut(geByClass1("chat_cont_sh_top", Chat.wrap), 200), Chat.shadowTop = !1), Chat.lastHeight - t > Chat.maxHeight && Chat.fixH ? Chat.shadowBottom || (
                fadeIn(geByClass1("chat_cont_sh_bottom", Chat.wrap), 200), Chat.shadowBottom = !0) : Chat.shadowBottom && (fadeOut(geByClass1("chat_cont_sh_bottom", Chat.wrap),
                200), Chat.shadowBottom = !1)
    },
    scrollWrap: function(t) {
        t || (t = window.event);
        var e = 0;
        return t.wheelDeltaY || t.wheelDelta ? e = (t.wheelDeltaY || t.wheelDelta) / 2 : t.detail && (e = 10 * -t.detail), Chat.scrollNode.scrollTop -= e, curFastChat.activeBox ==
            curFastChat.clistBox ? (curFastChat.pointerMargin = 0, FastChat.setPointer(!1, curFastChat.pointerMargin, curFastChat.prevPointer)) : (curFastChat.pointerMargin = -
                Chat.scrollNode.scrollTop, FastChat.setPointer(!0, curFastChat.pointerMargin, curFastChat.prevPointer)), FastChat.checkShadow(), setStyle(Chat.ttNode, {
                top: -Chat.scrollNode.scrollTop
            }), cancelEvent(t)
    },
    togglePeer: function(t, e) {
        return curFastChat.activeBox && curFastChat.activeBox.options.peer == t ? (curFastChat.activeBox.hide(), FastChat.setActive(!1), !1) : FastChat.selectPeer(t, e)
    },
    selectPeer: function(t, e, i) {
        if (checkEvent(e)) return !0;
        var a = hasClass(Chat.wrap, "chat_active");
        curFastChat.friends && curFastChat.friends[t + "_"];
        if (curFastChat.tabs && curFastChat.tabs[t]) {
            var s = curFastChat.tabs[t].box;
            s.minimized && s.unminimize(!0), FastChat.activateTab(t), FastChat.movePointer(t, a)
        } else i || (i = {}), i.fixed = !0, i.onPeerAdded = function() {
            FastChat.movePointer(t, a)
        }, i.onHistoryLoaded = FastChat.readLastMsgs.pbind(t), FastChat.addPeer(t, !1, !0, i);
        return curFastChat.tabs[t] && curFastChat.tabs[t].iman && curFastChat.tabs[t].iman.unidle(), !1
    },
    closeTabIcon: function(t, e, i) {
        curFastChat.activeBox && curFastChat.activeBox.options.peer == t && !i && (curFastChat.activeBox.hide(), FastChat.setActive(!1));
        var a = ge("chat_tab_icon_" + t);
        addClass(a, "chat_tab_hiding"), delete Chat.tabs[t], curFastChat.tabs[t] && curFastChat.tabs[t].box.options.fixed && (curFastChat.tabs[t].iman.stop(), delete curFastChat
            .tabs[t]);
        var s = function() {
            re(a), a && (a = !1, curFastChat.activeBox && FastChat.movePointer(curFastChat.activeBox.options.peer, !0)), FastChat.checkChatHeight()
        };
        animate(a, {
            height: 0,
            opacity: 0
        }, {
            duration: 100,
            onComplete: s
        }), i || FastChat.stateChange({
            op: "closed",
            peer: t
        });
        var o = 0;
        for (var r in Chat.tabs) o += 1;
        return o || removeClass(Chat.wrap, "chat_expand"), FastChat.itemsOut(), cancelEvent(e)
    },
    getPointerShift: function(t, e, i) {
        var a = i - e,
            s = Chat.maxHeight + 32;
        return t && 62 > a ? a - 62 : t && a > s ? a - s : 0
    },
    setPointer: function(t, e, i) {
        if (!curFastChat.activeBox) return !1;
        var a = FastChat.getPointerShift(t, e, i),
            s = geByClass1("fc_tab_pointer", curFastChat.activeBox.wrap);
        return setStyle(s, {
            marginTop: e + a
        }), a
    },
    movePointer: function(t, e) {
        if (!curFastChat.activeBox) return !1;
        var i = geByClass1("fc_pointer_offset", curFastChat.activeBox.wrap);
        if (t) {
            var a = ge("chat_tab_icon_" + t);
            if (!a) return !1;
            if (!Chat.fixH && a.nextSibling) var s = getXY(a.nextSibling)[1] - 50;
            else if (a.nextSibling || Chat.fixH) var s = getXY(a)[1] + Chat.scrollNode.scrollTop;
            else var s = getXY(ge("chat_tab_wrap"))[1] - 50;
            var o = 23 + getXY(Chat.cont)[1] - s,
                r = -Chat.scrollNode.scrollTop
        } else var o = 28,
            r = 0;
        var n = FastChat.setPointer(t, r, o);
        if (e) {
            if (curFastChat.prevPointer) {
                var c = (curFastChat.prevPointer - r + n, FastChat.getPointerShift(!0, r + n, curFastChat.prevPointer));
                setStyle(i, {
                    bottom: curFastChat.prevPointer - c + n
                })
            }
            animate(i, {
                bottom: o
            }, {
                duration: 100
            })
        } else setStyle(i, {
            bottom: o
        });
        curFastChat.prevPointer = o
    },
    setActive: function(t) {
        curFastChat.activeBox = t, t && FastChat.moveBoxesLeft(t.pos[1])
    },
    moveBoxesLeft: function(e, i) {
        var e = e - 8,
            a = !1,
            s = 0;
        for (var o in curFastChat.tabs)
            if (t = curFastChat.tabs[o], i || (t.box.movedLeft = !1), t && !t.box.options.fixed && t.box.toBottom && !t.box.movedLeft && !t.box.noMove) {
                var r = t.box.pos;
                r[1] + r[3] >= e && r[1] > s && (a = t, s = r[1])
            }
        if (a) {
            var n = e - a.box.pos[3],
                c = a.box.pos[0];
            0 > n && (n = 0), a.box.movedLeft = !0, animate(a.box.wrap, {
                left: n
            }, 200), a.box.pos = [c, n, a.box.pos[2], a.box.pos[3]];
            var l = getWndInner();
            FastChat.stateChange({
                op: "moved",
                peer: a.box.options.peer,
                y: c / l[0],
                x: n / l[1]
            }), n && FastChat.moveBoxesLeft(n, !0)
        } else FastChat.moveLeftY = 0
    },
    moveBoxAway: function(t, e) {
        for (var i = e - t.pos[3] - 20, a = t.pos[3], s = t.pos[0], o = (t.pos[2], !1); i > 0 && !o;) {
            o = !0;
            for (var r in curFastChat.tabs) {
                var n = curFastChat.tabs[r].box.pos;
                n[0] + n[2] / 2 > s && n[1] + n[3] > i && n[1] < i + a && (i -= n[3], o = !1)
            }
        }
        0 > i && (i = positive(Math.random() * e)), animate(t.wrap, {
            left: i
        }, 300);
        var c = getWndInner();
        FastChat.stateChange({
            op: "moved",
            peer: t.options.peer,
            y: s / c[0],
            x: i / c[1]
        })
    },
    pinTab: function(t, e, i) {
        if (-1 == t) var a = curFastChat.clistBox;
        else var a = curFastChat.tabs[t].box;
        a.options.fixed = !1, removeClass(a.wrap, "fc_fixed"), FastChat.hideChatCtrl(), FastChat.setActive(!1);
        var s = a.wrap.offsetTop,
            o = a.wrap.offsetLeft - 10;
        setStyle(a.wrap, {
            left: a.wrap.offsetLeft,
            top: a.wrap.offsetTop,
            right: "auto",
            bottom: "auto"
        }), i || animate(a.wrap, {
            left: o,
            top: s
        }, 300), a.pos = [s, o, a.pos[2], a.pos[3]], a.toRight = !1, a.toBottom = !0, addClass(a.wrap, "fc_tobottom");
        var r = a.resizeableW.clientWidth - intval(getStyle(a.resizeableW, "paddingRight")) - intval(getStyle(a.resizeableW, "paddingLeft")),
            n = a.resizeableH.clientHeight - intval(getStyle(a.resizeableH, "paddingBottom")) - intval(getStyle(a.resizeableH, "paddingTop")),
            c = getWndInner(); - 1 == t ? FastChat.stateChange({
            op: "clist_toggled",
            val: 1,
            y: a.toBottom ? -1 : a.pos[0] / c[0],
            x: a.toRight ? -1 : a.pos[1] / c[1]
        }) : FastChat.stateChange({
            op: "unfixed",
            peer: t,
            y: a.toBottom ? -1 : a.pos[0] / c[0],
            x: a.toRight ? -1 : a.pos[1] / c[1],
            h: n / c[0],
            w: r / c[1]
        }), a.noMove = !0, FastChat.moveBoxesLeft(o), a.noMove = !1
    },
    addPeer: function(t, e, i, a) {
        a || (a = {});
        var s = curFastChat.friends && curFastChat.friends[t + "_"],
            o = 0;
        if (i ? FastChat.stateChange({
                op: "added",
                peer: t,
                fixed: a.fixed
            }) : curNotifier.idle_manager && !curNotifier.idle_manager.is_idle && e && (i = !0), s) {
            var r = {
                name: s[0],
                photo: s[1],
                fname: s[2],
                hash: s[3],
                online: curFastChat.onlines[t],
                sex: s[4]
            };
            FastChat.addTabIcon(t, r, a.noAnim), FastChat.addBox(t, r, a), e ? (curFastChat.tabs[t].auto = 1, FastChat.imFeed(t, e)) : (a && a.nofocus || FastChat.activateTab(
                t), curFastChat.onlines[t] || FastChat.tabNotify(t, "unavail"), o |= 2)
        } else o = 3;
        o && (i ? (curFastChat.needPeers[t] = [o, e, !1, a], FastChat.getPeers()) : (curFastChat.needPeers[t] = [o, e, setTimeout(FastChat.getPeers, irand(150, 200)), a],
            FastChat.lcSend("needPeer", {
                id: t,
                mask: o
            })))
    },
    getPeers: function() {
        var t = [],
            e = {};
        each(curFastChat.needPeers, function(i) {
            t.push(i), t.push(this[0]), clearTimeout(this[2]), e[i] = this[0]
        }), t.length && (FastChat.lcSend("fetchingPeers", e), ajax.post("al_im.php", {
            act: "a_get_fc_peers",
            peers: t.join(",")
        }, {
            onDone: function(t) {
                FastChat.gotPeers(t), FastChat.lcSend("gotPeers", t)
            }
        }))
    },
    gotPeers: function(t) {
        each(curFastChat.needPeers, function(e) {
            if (t[e]) {
                t[e] < 2e9 && (curFastChat.friends[e + "_"] = [t[e].name, t[e].photo, t[e].fname, t[e].hash, intval(t[e].sex)]);
                var i = this[1],
                    a = this[3];
                2 & this[0] && void 0 === t[e].history || (clearTimeout(this[2]), delete curFastChat.needPeers[e]), curFastChat.tabs[e] ? FastChat.gotHistory(e, t[
                        e].history) : a.fixedLoad ? FastChat.addTabIcon(e, t[e]) : (FastChat.addTabIcon(e, t[e]), FastChat.addBox(e, t[e], a), i ? (curFastChat.tabs[
                        e].auto = 1, FastChat.imFeed(e, i)) : (2 & this[0] && FastChat.gotHistory(e, t[e].history), a && a.nofocus || FastChat.activateTab(e))), a.onHistoryLoaded &&
                    a.onHistoryLoaded()
            }
        })
    },
    gotHistory: function(t, e) {
        if (isArray(e) && e.length && e[0]) {
            var i = curFastChat.tabs[t],
                a = e[0],
                s = e[1];
            i.offset = e[2], extend(i.msgs, s), each(s, function(t, e) {
                !e[0] && e[1] && i.unread++
            }), val(i.log, a), i.logWrap.scrollTop = i.logWrap.scrollHeight, setTimeout(function() {
                i.logWrap.scrollTop = i.logWrap.scrollHeight, i.scroll && i.scroll.update(!1, !0)
            }, 10)
        }
    },
    decHashCb: function(t) {
        ! function(t) {
            curFastChat.decodedHashes[t] = function(t) {
                var e = ge ? "" : "___";
                for (____ = 0; ____ < t.length; ++____) e += t.charAt(t.length - ____ - 1);
                return geByClass ? e : "___"
            }(t.substr(t.length - 5) + t.substr(4, t.length - 12))
        }(t)
    },
    decodehash: function(t) {
        return curFastChat.decodedHashes || (curFastChat.decodedHashes = {}), curFastChat.decodedHashes[t] || FastChat.decHashCb(t), curFastChat.decodedHashes[t]
    },
    onMyTyping: function(t) {
        t = intval(t);
        var e = curFastChat.tabs[t];
        if (!(-2e9 >= t) && e) {
            var i = vkNow();
            curFastChat.myTypingEvents[t] && i - curFastChat.myTypingEvents[t] < 5e3 || (curFastChat.myTypingEvents[t] = i, ajax.post("al_im.php", {
                act: "a_typing",
                peer: t,
                hash: e.sendhash,
                from: "fc"
            }))
        }
    },
    updateTypings: function() {
        each(curFastChat.tabs || {}, function(t, e) {
            FastChat.updateTyping(t)
        })
    },
    updateTyping: function(t, e) {
        var i, a = curFastChat.tabs[t],
            s = [],
            o = curFastChat.typingEvents[t],
            r = vkNow(),
            n = ge("fc_tab_typing" + t),
            c = geByClass1("_fc_tab_typing_name", n);
        if (2e9 > t) o && 6e3 > r - o && (s.push(a.fname || a.name || ""), i = a.sex);
        else {
            var l = a.data.members;
            each(o || {}, function(t, e) {
                e && 6e3 > r - e && l[t] && l[t].first_name && (s.push(l[t].first_name || ""), i = l[t].sex)
            })
        }
        if (!s.length) return e ? setStyle(n, "opacity", 0) : fadeTo(n, 1e3, 0);
        if (1 == s.length) val(c, langSex(i, lang.mail_im_typing)
            .replace("{user}", s[0]));
        else {
            var u = s.pop();
            val(c, getLang("mail_im_multi_typing")
                .replace("{users}", s.join(", "))
                .replace("{last_user}", u))
        }
        return e ? setStyle(n, "opacity", 1) : fadeTo(n, 200, 1)
    },
    readLastMsgs: function(t) {
        var e = curFastChat.tabs[t];
        if (t && e) {
            if (!e.markingRead && e.unread) {
                var i = [];
                for (var a in e.msgs) !e.msgs[a][0] && e.msgs[a][1] && i.push(a);
                FastChat.markRead(t, i)
            }
            FastChat.changePeerCounter(t, 0, 0)
        }
    },
    markRead: function(t, e) {
        if (e.length) {
            var i = curFastChat.tabs[t];
            i.markingRead = !0, ajax.post("al_im.php", {
                act: "a_mark_read",
                peer: t,
                ids: e,
                hash: i.sendhash
            }, {
                onDone: function(a, s) {
                    i.markingRead = !1;
                    for (var o in e) {
                        var r = e[o],
                            n = ge("fc_msg" + r),
                            c = n && n.parentNode;
                        n && (i.msgs[r] && i.msgs[r][1] && (i.msgs[r][1] = 0, i.msgs[r][0] || i.unread--), removeClass(n, "fc_msg_unread"), hasClass(c.parentNode,
                            "fc_msgs_unread") && each(c.childNodes, function() {
                            return hasClass(this, "fc_msg_unread") ? void 0 : (removeClass(c.parentNode, "fc_msgs_unread"), !1)
                        }))
                    }
                    i.unread > 0 && (i.unread = 0, each(i.msgs, function() {
                        !this[0] && this[1] && i.unread++
                    })), FastChat.updateUnreadTab(t)
                },
                onFail: function() {
                    i.markingRead = !1
                }
            })
        }
    },
    mkMsg: function(t) {
        var e = clean(t)
            .replace(/\n/g, "<br>"),
            i = !1;
        return e = e.replace(/([a-zA-Z\-_\.0-9]+@[a-zA-Z\-_0-9]+\.[a-zA-Z\-_\.0-9]+[a-zA-Z\-_0-9]+)/g, function(t) {
            return '<a href="/write?email=' + t + '" target="_blank">' + t + "</a>"
        }), e = e.replace(
            /(^|[^A-Za-z0-9�-��-���\-\_])(https?:\/\/)?((?:[A-Za-z\$0-9�-��-���](?:[A-Za-z\$0-9\-\_�-��-���]*[A-Za-z\$0-9�-��-���])?\.){1,5}[A-Za-z\$������������������������\-\d]{2,22}(?::\d{2,5})?)((?:\/(?:(?:\&amp;|\&#33;|,[_%]|[A-Za-z0-9�-��-���\-\_#%?+\/\$.~=;:]+|\[[A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\))*(?:,[_%]|[A-Za-z0-9�-��-���\-\_#%?+\/\$.~=;:]*[A-Za-z0-9�-��-���\_#%?+\/\$~=]|\[[A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\)))?)?)/gi,
            function() {
                var t = Array.prototype.slice.apply(arguments),
                    e = t[1] || "",
                    a = t[2] || "http://",
                    s = t[3] || "",
                    o = s + (t[4] || ""),
                    r = (t[2] || "") + t[3] + t[4];
                if (-1 == s.indexOf(".") || -1 != s.indexOf("..")) return t[0];
                var n = s.split(".")
                    .pop();
                if (n.length > 7 || -1 == indexOf(
                        "info,name,academy,aero,arpa,coop,media,museum,mobi,travel,xxx,asia,biz,com,net,org,gov,mil,edu,int,tel,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,ax,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cd,cf,cg,ch,ci,ck,cl,cm,cn,co,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,er,es,et,eu,fi,fj,fk,fm,fo,fr,ga,gd,ge,gf,gg,gh,gi,gl,gm,gn,gp,gq,gr,gs,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,im,in,io,iq,ir,is,it,je,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,mk,ml,mm,mn,mo,mp,mq,mr,ms,mt,mu,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,ps,pt,pw,py,qa,re,ro,ru,rs,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,ss,st,su,sv,sx,sy,sz,tc,td,tf,tg,th,tj,tk,tl,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,um,us,uy,uz,va,vc,ve,vg,vi,vn,vu,wf,ws,ye,yt,yu,za,zm,zw,��,���,����,������,���,cat,pro,local"
                        .split(","), n)) return t[0];
                if (-1 != t[0].indexOf("@")) return t[0];
                try {
                    r = decodeURIComponent(r)
                } catch (c) {}
                if (r.length > 55 && (r = r.substr(0, 53) + ".."), r = clean(r)
                    .replace(/&amp;/g, "&"), !i && s.match(/^([a-zA-Z0-9\.\_\-]+\.)?(vkontakte\.ru|vk\.com|vkadre\.ru|vshtate\.ru|userapi\.com|vk\.me)$/)) {
                    o = replaceEntities(o)
                        .replace(/([^a-zA-Z0-9#%;_\-.\/?&=\[\]])/g, encodeURIComponent);
                    var l, u = o,
                        d = o.indexOf("#/"),
                        h = "";
                    return d >= 0 ? u = o.substr(d + 1) : (d = o.indexOf("#!"), d >= 0 && (u = "/" + o.substr(d + 2)
                            .replace(/^\//, ""))), l = u.match(/^(?:https?:\/\/)?(?:vk\.com|vkontakte\.ru)?\/([a-zA-Z0-9\._]+)\??$/), l && l[1].length < 32 && (h =
                            ' mention_id="' + l[1] + '" onclick="return mentionClick(this, event)" onmouseover="mentionOver(this)"'), e + '<a href="' + (a + o)
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;") + '" target="_blank"' + h + ">" + r + "</a>"
                }
                return e + '<a href="away.php?utf=1&to=' + encodeURIComponent(a + replaceEntities(o)) + '" target="_blank" onclick="return goAway(\'' + clean(a + o) +
                    "', {}, event);\">" + r + "</a>"
            }), e = Emoji.emojiToHTML(e, 1)
    },
    getEditCont: function(t) {
        return stManager.add(["emoji.js"]), '<div class="emoji_cont _emoji_field_wrap">' + Emoji.tplSmile(getLang("mail_emoji_hint")) +
            '<div class="fc_editable dark" tabindex="0" contenteditable="true" placeholder="' + getLang("mail_chat_placeholder") + '"></div></div>'
    },
    getVal: function(t) {
        return Emoji ? Emoji.editableVal(t) : ""
    },
    onTxtResize: function(t) {
        var e = curFastChat.tabs[t],
            i = geByClass1("fc_tab_txt", e.wrap),
            a = getSize(i)[1];
        if (a > 40) {
            var s = positive(a - 40),
                o = intval(getSize(e.box.resizeableH)[1]);
            o + e.hDiff - s < 40 && (s = o + e.hDiff - 40), setStyle(e.box.resizeableH, {
                height: o + (e.hDiff || 0) - s
            }), e.hDiff = s, FastChat.fixResized(e, e.wrap.clientWidth, !0)
        } else if (e.hDiff) {
            var o = intval(getSize(e.box.resizeableH)[1]);
            setStyle(e.box.resizeableH, {
                height: o + e.hDiff
            }), e.hDiff = 0, FastChat.fixResized(e, e.wrap.clientWidth, !0)
        }
    },
    initTab: function(t, e, i) {
        var a = geByClass1("fc_editable", i),
            s = curFastChat.tabs[t] = {
                name: e.name,
                fname: e.fname,
                photo: e.photo,
                link: e.alink || "/id" + t,
                hash: e.hash,
                sendhash: FastChat.decodehash(e.hash),
                sex: e.sex || 0,
                data: e.data || {},
                online: e.online,
                msgs: {},
                msgscount: 0,
                unread: 0,
                sent: 0,
                sentmsgs: [],
                box: !1,
                wrap: i,
                editable: 1,
                txt: a,
                txtWrap: a.parentNode.parentNode,
                logWrap: geByClass1("fc_tab_log", i),
                log: geByClass1("fc_tab_log_msgs", i),
                notify: geByClass1("fc_tab_notify_wrap", i),
                title: geByClass1("fc_tab_title", i)
            },
            o = 30;
        if (s.addMediaBtn = geByClass1("fc_tab_attach", i), s.editable) cur.t = s, s.emojiId = Emoji.init(s.txt, {
            controlsCont: geByClass1("fc_tab_txt_wrap", i),
            ttDiff: -46,
            ttShift: 0,
            rPointer: !0,
            global: !0,
            noRce: !0,
            peer: t,
            isChat: !0,
            noCtrlSend: !0,
            onSend: FastChat.send.pbind(t),
            checkEditable: FastChat.checkEditable,
            onResize: function() {
                FastChat.onTxtResize(t)
            },
            addMediaBtn: s.addMediaBtn,
            onShow: function() {
                cssAnim(s.scroll.scrollbar, {
                    opacity: 0
                }, {
                    duration: 400
                }), enterWorks = !1
            },
            onHide: function() {
                cssAnim(s.scroll.scrollbar, {
                    opacity: 1
                }, {
                    duration: 400
                }), setTimeout(function() {
                    enterWorks = !0
                }, 0)
            },
            onEsc: function(t) {
                return s.box.hide(), cancelEvent(t)
            },
            onStickerSend: function(e) {
                --s.sent;
                FastChat.send(t, e)
            }
        });
        else {
            var r = 15;
            autosizeSetup(s.txt, {
                minHeight: r,
                maxHeight: 42
            }), s.txt.autosize.options.onResize = function(t) {
                if (!s.box.minimized) {
                    var e = 42 == t ? 42 : r;
                    e != t && setStyle(s.txt, "height", e), e != o && (setStyle(s.logWrap, "height", s.logWrap.clientHeight - e + o), o = e, s.scroll && s.scroll.update(!
                        1, !0))
                }
            }
        }
        return s.imPeerMedias = {}, s.imSortedMedias = {}, s.previewEl = geByClass1("fc_tab_preview", i), stManager.add(["page.js", "page.css", "ui_media_selector.js",
            "ui_media_selector.css"
        ], function() {
            s.imMedia = new MediaSelector(s.addMediaBtn, s.previewEl, [
                ["photo", getLang("profile_wall_photo")],
                ["video", getLang("profile_wall_video")],
                ["audio", getLang("profile_wall_audio")],
                ["doc", getLang("profile_wall_doc")],
                ["map", getLang("profile_wall_map")]
            ], {
                limit: 10,
                hideAfterCount: 0,
                maxShown: 0,
                mail: 1,
                tooltip: 1,
                topOffset: 0,
                forceUp: 1,
                global: 1,
                toId: vk.id
            }), s.imMedia.onChange = setTimeout.pbind(function() {
                curFastChat.sendOnUpload && (FastChat.send(curFastChat.sendOnUpload), curFastChat.sendOnUpload = void 0), FastChat.onTxtResize(t)
            }, 0)
        }), s
    },
    addBox: function(t, e, i) {
        if (void 0 === curFastChat.tabs[t]) {
            var a = FastChat.getEditCont(Emoji.last);
            i = i || {}, curFastChat.tabs[t] = {};
            var s = se(rs(FastChat.tplBox, {
                id: t,
                name: e.name,
                myphoto: Notifier.fixPhoto(curFastChat.me.photo, !0),
                cont: a
            }));
            i.fixed && curFastChat.activeBox && curFastChat.activeBox.hide(0, !1, {
                noState: !0
            });
            var o = FastChat.initTab(t, e, s);
            if (wndInner = getWndInner(), opts = {
                    id: "fc_peer" + t,
                    marginFixedToLayer: !0,
                    peer: t,
                    movable: geByClass1("fc_tab_head", s),
                    closer: geByClass1("fc_tab_close_wrap", s, "a"),
                    resizeableH: o.logWrap,
                    startHeight: 250,
                    startWidth: 270,
                    fixed: i.fixed,
                    minH: 150,
                    minW: 270,
                    nofocus: !0,
                    onFocus: function(e) {
                        o.auto && (FastChat.stateChange({
                                op: "added",
                                peer: t
                            }), delete o.auto), FastChat.restoreDraft(t), o.editable ? Emoji.editableFocus(o.txt, !1, !0) : elfocus(o.txt), o.wrap.clientWidth &&
                            setStyle(o.title, {
                                maxWidth: o.wrap.clientWidth - 71
                            }), o.editable || setStyle(o.txt.autosize.helper, {
                                width: getStyle(o.txt, "width", !1)
                            }), o.scroll && o.scroll.update(!1, !0), setTimeout(elfocus.pbind(o.txt), 10)
                    },
                    onHide: function() {
                        i.fixed && FastChat.hideChatCtrl(), curFastChat.activeBox && t == curFastChat.activeBox.options.peer && FastChat.setActive(!1)
                    },
                    onClose: function(e) {
                        this.onHide(), i && i.beforeClose && i.beforeClose();
                        var a = curFastChat.tabs,
                            s = a[t].posSeq;
                        if (delete a[t], curNotifier.isIdle || FastChat.stateChange({
                                op: "hidden",
                                peer: t
                            }), s) {
                            var o, r, n, c, l, u = {},
                                d = [];
                            for (each(a, function() {
                                    this.posSeq > s && (u[this.posSeq] = this, d.push(this.posSeq))
                                }), d.unshift(s), d.sort(), l = !browser.msie && d.length < 10, o = 1; o < d.length; o++) r = d[o], n = u[r].box, c = o > 1 ? u[d[o - 1]]
                                .box.pos : e, l ? animate(n.wrap, {
                                    left: c[1]
                                }, 100, function(t) {
                                    t._update_pos()
                                }.pbind(n)) : setStyle(n.wrap, {
                                    left: c[1]
                                });
                            if (!l)
                                for (o = 1; o < d.length; o++) n = u[d[o]].box, n._update_pos()
                        }
                    },
                    onMinimize: function(e) {
                        FastChat.stateChange({
                            op: "minimized",
                            peer: t,
                            val: e
                        }), FastChat.fixResized(o, o.wrap.clientWidth, !0), e || (o.txt.blur(), FastChat.restoreDraft(t))
                    },
                    onResizeEnd: function(e, i) {
                        var a = getWndInner(),
                            s = o.box.pos;
                        o.scroll && o.scroll.show(), FastChat.fixResized(o, i, !0), FastChat.stateChange({
                            op: "resized",
                            peer: t,
                            h: e / a[0],
                            w: i / a[1],
                            y: o.box.toBottom ? -1 : s[0] / a[0],
                            x: o.box.toRight ? -1 : s[1] / a[1]
                        })
                    },
                    onResize: function(t, e) {
                        FastChat.fixResized(o, e);
                        var i = geByClass1("fc_tab_title", o.box.content);
                        setStyle(i, {
                            width: e - 78
                        })
                    },
                    onResizeStart: function() {
                        delete o.posSeq, o.scroll && o.scroll.hide(), val(o.notify, ""), clearTimeout(o.hideNotifyTO)
                    },
                    onDragEnd: function(e, i) {
                        delete o.posSeq, FastChat.stateChange({
                            op: "moved",
                            peer: t,
                            y: e,
                            x: i
                        })
                    }
                }, i && extend(opts, i), void 0 === opts.startLeft && void 0 === opts.startRight) {
                var r = [],
                    n = wndInner[0] - 350,
                    c = curFastChat.clistBox.pos,
                    l = !1;
                if (window.Call && (Call.box || Call.invitation)) {
                    var u = Call.calcBoxPos();
                    r.push([u.x, u.x + u.w]), l = !0
                }
                c[0] + c[2] > n && (curFastChat.clistBox.visible || !l) && r.push([c[1], c[1] + c[3]]), each(curFastChat.tabs, function(e) {
                    (c = this.box && this.box.pos) && e != t && c[0] + c[2] > n && r.push([c[1], c[1] + c[3]])
                });
                var d, h, f, p = lastWindowWidth - 262 - sbWidth(),
                    v = 0,
                    _ = !1,
                    m = !1,
                    g = v > p ? 1 : -1;
                for (d = p; g * v > g * d; d += 135 * g) {
                    for (h = 0, f = 0; f < r.length; f++) d > r[f][0] - 260 && d < r[f][1] && h++, d > r[f][0] - 10 && d < r[f][0] + 10 && (h += 1.1);
                    (_ === !1 || m > h) && (_ = d, m = h)
                }
                l && m && (_ = p), extend(opts, {
                    startBottom: 0,
                    startLeft: _
                })
            }
            var C, b = !0;
            for (C in i || {})
                if ("nofocus" != C) {
                    b = !1;
                    break
                }
            b && (o.posSeq = ++curFastChat.posSeq), opts.fixed && (opts.startHeight = curFastChat.clistH, opts.startWidth = curFastChat.clistW, opts.onShow = FastChat.showChatCtrl),
                o.box = new RBox(s, opts), o.iman = new IdleManager({
                    id: "tab" + t,
                    element: o.box.content,
                    onUnIdleCb: function() {
                        FastChat.readLastMsgs(t)
                    },
                    parentManager: curNotifier.idle_manager,
                    idleTimeout: 1e4
                }), curFastChat.tabs[t].iman.start(), opts.fixed && FastChat.setActive(o.box), o.scroll = new Scrollbar(o.logWrap, {
                    prefix: "fc_",
                    nomargin: !0,
                    nokeys: !0,
                    global: !0,
                    right: vk.rtl ? "auto" : 1,
                    left: vk.rtl ? 1 : "auto",
                    onScroll: FastChat.onScroll.pbind(o)
                }), opts.minimized || !i || void 0 === i.startLeft && void 0 === i.startTop && void 0 === i.startWidth && void 0 === i.startHeight || o.box._wnd_resize(
                    wndInner[0], wndInner[1], !0);
            o.wrap.clientWidth && setStyle(o.title, {
                maxWidth: o.wrap.clientWidth - 71
            }), addEvent(o.txt, "keydown focus mousedown keyup", function(e) {
                if ("mousedown" == e.type) return void(curRBox.active == o.box.id && ((e.originalEvent || e)
                    .cancelBubble = !0));
                if ("keydown" == e.type && e.ctrlKey && e.keyCode == KEY.RETURN) {
                    var i = this.value;
                    if ("number" == typeof this.selectionStart && "number" == typeof this.selectionEnd) {
                        var a = this.selectionStart;
                        this.value = i.slice(0, a) + "\n" + i.slice(this.selectionEnd), this.selectionStart = this.selectionEnd = a + 1
                    } else if (document.selection && document.selection.createRange) {
                        this.focus(e);
                        var s = document.selection.createRange();
                        s.text = "\r\n", s.collapse(!1), browser.opera && (s.moveEnd("character", 0), s.moveStart("character", 0)), s.select()
                    }
                    return o.editable ? FastChat.checkEditable(o.emojiId, o.txt) : (o.txt.autosize.update(), setTimeout(function() {
                        o.txt.autosize.update()
                    }, 0)), !1
                }
                if ("focus" == e.type) curFastChat.peer = t;
                else if ("keyup" == e.type) {
                    var r = o.lastVal || "",
                        n = FastChat.getVal(this);
                    (n.length != r.length || n != r) && (n && FastChat.onMyTyping(t), o.lastVal = n), clearTimeout(o.saveDraftTO), o.saveDraftTO = setTimeout(
                        FastChat.saveDraft.pbind(t), n.length ? 300 : 0), FastChat.checkEditable(o.emojiId, o.txt)
                }
            }), FastChat.restoreDraft(t), opts.onPeerAdded && opts.onPeerAdded()
        }
    },
    onScroll: function(t) {
        var e = t.scroll.obj.scrollTop,
            i = geByClass1("_fc_msgs_more", t.logWrap);
        200 > e && isVisible(i) && i.click()
    },
    loadMore: function(t, e) {
        var i = curFastChat.tabs[t];
        return offset = i.offset, i.moreLoading ? !1 : (i.moreLoading = !0, void ajax.post("al_im.php", {
            act: "a_history",
            peer: t,
            offset: offset,
            from: "fc"
        }, {
            onDone: function(t) {
                t[3] || hide(e);
                var a = e.parentNode,
                    s = a.clientHeight;
                a.insertBefore(cf(t[0]), e.nextSibling);
                var o = a.clientHeight - s;
                o && (i.logWrap.scrollTop += o), i.scroll.update(), i.offset = t[2], i.moreLoading = !1, FastChat.onScroll(i)
            },
            onFail: function() {
                i.moreLoading = !1
            },
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e)
        }))
    },
    sendOnResponse: function(t, e, i) {
        if (t.version && intval(t.version) > curFastChat.version) return void FastChat.updateVersion(t.version);
        var a = ge("fc_msg" + e),
            s = t.msg_id,
            o = indexOf(e, i.newmsgs);
        if (a) {
            if (t.media) {
                var r = {
                    sticker: intval(t.sticker)
                };
                FastChat.lcSend("gotMedia", {
                    msgId: e,
                    peer: i.box.options.peer,
                    text: t.media,
                    msgOpts: r
                }), FastChat.gotMsgMedia(i.box.options.peer, e, t.media, r)
            }++i.msgscount, -1 != o && i.newmsgs.splice(o, 1), a.id = "fc_msg" + s, i.msgs[s] = [1, 1]
        }
    },
    checkEditable: function(t, e) {
        Emoji.checkEditable(t, e, {
            height: 52
        })
    },
    fixResized: function(t, e, i) {
        t && (t.logWrap.scrollTop = t.logWrap.scrollHeight, e > 0 && setStyle(t.title, {
            maxWidth: e - 71
        }), i && (t.editable || setStyle(t.txt.autosize.helper, {
            width: getStyle(t.txt, "width", !1)
        }), t.scroll && t.scroll.update(!1, !0)))
    },
    activateTab: function(t) {
        var e = curFastChat.tabs[t].box;
        curFastChat.activeBox && curFastChat.activeBox != e && curFastChat.activeBox.hide(0, !1, {
            noState: !0
        }), e.show(), e.options.fixed && FastChat.setActive(e)
    },
    updateUnreadTab: function(t) {
        var e = curFastChat.tabs[t];
        e && (val(e.title, e.name + (e.unread ? ' <span class="fc_tab_count">(' + e.unread + ")</span>" : "")), val("fc_contact_unread" + t, e.unread ? " <b>+" + e.unread +
            "</b>" : ""), FastChat.changePeerCounter(t, !1, e.unread))
    },
    blinkTab: function(t) {
        var e = curFastChat.tabs[t];
        if (!e.blinking && curFastChat.peer != t) {
            e.blinking = !0, clearTimeout(e.blinkingTO);
            var i = e.box.wrap,
                a = i.className,
                s = Math.min(BASIC_CHAT_ZINDEX, intval(getStyle(i, "zIndex")));
            setStyle(i, {
                zIndex: BASIC_CHAT_ZINDEX
            }), removeClass(i, "rb_inactive"), e.blinkingTO = setTimeout(function() {
                delete e.blinking, delete e.blinkingTO, getStyle(i, "zIndex") == BASIC_CHAT_ZINDEX && (setStyle(i, {
                    zIndex: s
                }), i.className = a)
            }, 2e3)
        }
    },
    createProgress: function(t, e, i) {
        var a = ce("span", {
            innerHTML: rs(vk.pr_tpl, {
                id: "",
                cls: ""
            }),
            className: "fc_msg_progress",
            id: "fc_msg_progress" + e
        });
        return t.insertBefore(a, i), a
    },
    removeProgress: function(t) {
        re("fc_msg_progress" + t)
    },
    send: function(t, e) {
        var i = curFastChat.tabs[t],
            a = trim(i.editable ? Emoji.editableVal(i.txt) : val(i.txt));
        if (e) {
            var s = [
                ["sticker", e]
            ];
            a = ""
        } else var s = i.imMedia ? i.imMedia.getMedias() : [];
        var o = ge("fc_tab_typing" + t),
            r = geByClass1("page_progress_preview", i.wrap);
        if (r && r.childNodes.length > 0) {
            curFastChat.sendOnUpload = t;
            var n = geByClass("fc_tab_log", i.wrap)[0];
            return FastChat.createProgress(n, t, n.lastChild), void(o.style.visibility = "hidden")
        }
        if (curFastChat.sendOnUpload = !1, FastChat.removeProgress(t), o.style.visibility = "visible", !a && !s.length) return void(i.editable ? Emoji.editableFocus(i.txt, !
            1, !0) : elfocus(i.txt));
        for (var c, l = --i.sent, u = {
                act: "a_send",
                to: t,
                hash: i.sendhash,
                msg: a,
                from: "fc",
                media: []
            }, d = 0, h = s.length; h > d; ++d)(c = s[d]) && u.media.push(c[0] + ":" + c[1]);
        u.media = u.media.join(","), i.sending = !0, Emoji.ttHide(i.emojiId), ajax.post("al_im.php", u, {
            onDone: function(e) {
                clearTimeout(i.saveDraftTO), FastChat.saveDraft(t), FastChat.sendOnResponse(e, l, i)
            },
            onFail: function(e) {
                FastChat.error(t, e || getLang("global_unknown_error")), elfocus(i.txt), val(i.txt, a), i.editable ? FastChat.checkEditable(i.emojiId, i.txt) :
                    i.txt.autosize.update();
                var s = ge("fc_msg" + l);
                return s ? (s.appendChild(ce("span", {
                    className: "fc_msg_error",
                    innerHTML: getLang("global_error")
                })), FastChat.scroll(t), !0) : void 0
            },
            showProgress: function() {
                i.sending = !0, i.sendProgressTO = setTimeout(function() {
                    var t = ge("fc_msg" + l);
                    t && FastChat.createProgress(t, l, t.firstChild)
                }, 2e3)
            },
            hideProgress: function() {
                i.sending = !1, clearTimeout(i.sendProgressTO), FastChat.removeProgress(l)
            }
        }), re("fc_error" + t), i.sentmsgs.push(l), e || (val(i.txt, ""), i.imMedia && i.imMedia.unchooseMedia());
        var f = u.media ? 1 : 0;
        e && (f += 8), FastChat.addMsg(FastChat.prepareMsgData([t, l, 3, FastChat.mkMsg(a), f])), delete curFastChat.myTypingEvents[t], i.editable ? FastChat.checkEditable(
            i.emojiId, i.txt) : i.txt.autosize.update(!1, !0), elfocus(i.txt), FastChat.scroll(t)
    },
    saveDraft: function(t) {
        var e = curFastChat.tabs[t],
            i = (e || {})
            .txt;
        if (i && e) {
            var a = Emoji.editableVal(i),
                s = {
                    txt: trim(a) || "",
                    medias: []
                };
            s.txt.length || (s = !1), s ? ls.set("im_draft" + vk.id + "_" + t, s) : ls.remove("im_draft" + vk.id + "_" + t)
        }
    },
    restoreDraft: function(t) {
        var e = curFastChat.tabs[t],
            i = e.txt,
            a = ls.get("im_draft" + vk.id + "_" + t);
        return !i || !e || !a || val(i)
            .length > a.txt.length ? !1 : (a.txt = clean(a.txt), e.editable ? i.innerHTML = Emoji.emojiToHTML(a.txt, 1) : val(i, a.txt || ""), FastChat.checkEditable(e.emojiId,
                i), setTimeout(function() {
                i.scrollTop = i.scrollHeight
            }, 10), !0)
    },
    error: function(t, e) {
        t = t || curFastChat.peer;
        var i = curFastChat.tabs[t];
        re("fc_error" + t), i.log.appendChild(ce("div", {
            id: "fc_error" + t,
            className: "fc_msgs_error",
            innerHTML: e || getLang("global_error")
        })), FastChat.scroll(t)
    },
    scroll: function(t) {
        t = t || curFastChat.peer;
        var e = curFastChat.tabs[t];
        e && (e.logWrap.scrollTop = e.logWrap.scrollHeight, e.scroll && e.scroll.update(!1, !0))
    },
    mkdate: function(t) {
        var e = new Date(1e3 * t),
            i = new Date,
            a = function(t) {
                return (t + "")
                    .length < 2 ? "0" + t : t
            };
        if (e.getDay() == i.getDay()) return a(e.getHours()) + ":" + a(e.getMinutes());
        var s = a(e.getDate()) + "." + a(e.getMonth() + 1);
        return e.getFullYear() != i.getFullYear() && (s += "." + (e.getFullYear() + "")
            .substr(2)), s
    },
    prepareMsgData: function(t) {
        var e, i = t[0],
            a = intval(t[2]),
            s = 2 & a ? curFastChat.me.id : i > 2e9 ? t[5] : i,
            o = intval(vkNow() / 1e3),
            r = {
                id: t[1],
                peer: i,
                from_id: s,
                text: t[3],
                out: 2 & a ? !0 : !1,
                unread: 1 & a ? !0 : !1,
                date: o,
                date_str: FastChat.mkdate(o)
            },
            n = t[4],
            c = "";
        if (n && (1 & n && (c += rs(vk.pr_tpl, {
                id: "",
                cls: ""
            }), t[1] > 0 && setTimeout(FastChat.needMsgMedia.pbind(i, t[1]), 5)), 6 & n && (c += rs(curFastChat.tpl.msg_fwd, {
                msg_id: t[1],
                peer_nice: FastChat.nicePeer(i),
                label: getLang(2 & n ? "mail_im_fwd_msg" : "mail_im_fwd_msgs")
            })), 8 & n && (r.sticker = !0), c && (r.text += '<div class="fc_msg_attachments" id="fc_msg_attachments' + r.id + '">' + c + "</div>")), e = 2 & a ?
            curFastChat.me : i > 2e9 ? curFastChat.tabs[i].data.members[s] : curFastChat.tabs[i], extend(r, {
                from_id: s,
                link: e.link,
                photo: e.photo,
                name: e.name,
                fname: i > 2e9 ? e.fname || e.first_name : ""
            }), t[5]) {
            t[5].split(",")
        }
        return r
    },
    needMsgMedia: function(t, e) {
        0 >= e || (FastChat.lcSend("needMedia", {
            msgId: e
        }), curFastChat.needMedia[e] = [t, setTimeout(FastChat.loadMsgMedia.pbind(t, e), curNotifier.is_server ? 0 : irand(150, 250))])
    },
    loadMsgMedia: function(t, e) {
        0 >= e || void 0 !== curFastChat.gotMedia[e] && 0 !== curFastChat.gotMedia[e] || (FastChat.lcSend("fetchingMedia", {
            msgId: e
        }), curFastChat.gotMedia[e] = 0, ajax.post("al_im.php", {
            act: "a_get_media",
            id: e,
            from: "fc"
        }, {
            onDone: function(i, a, s) {
                FastChat.lcSend("gotMedia", {
                    msgId: e,
                    peer: t,
                    text: i,
                    msgOpts: s
                }), FastChat.gotMsgMedia(t, e, i, s)
            }
        }))
    },
    gotMsgMedia: function(t, e, i, a) {
        if (val("fc_msg_attachments" + e, i), a && a.sticker) {
            var s = ge("fc_msg" + e),
                o = s.parentNode;
            addClass(o.parentNode, "fc_msg_sticker")
        }
        FastChat.scroll(t), curFastChat.gotMedia[e] = [t, i, a], a.stickers && window.Emoji && Emoji.updateTabs(a.stickers), void 0 !== curFastChat.needMedia[e] && (
            clearTimeout(curFastChat.needMedia[e][1]), delete curFastChat.needMedia[e])
    },
    addMsg: function(t) {
        var e = t.peer,
            i = curFastChat.tabs[e],
            a = i.log,
            s = a.lastChild;
        if (s && "fc_msgs_error" == s.className && (s = s.previousSibling), !i || t.out || !i.box.visible || i.iman.is_idle || curNotifier.idle_manager.is_idle || (t.unread = !
                1, FastChat.markRead(t.peer, [t.id])), !s || !hasClass(s, "fc_msgs_wrap") || !hasClass(s, "fc_msgs_unread") && t.unread === !0 || s.getAttribute(
                "data-from") != t.from_id || t.date - intval(s.getAttribute("data-date")) >= 300 || t.sticker || hasClass(s, "fc_msg_sticker")) {
            re("fc_log_empty" + e);
            var o = (t.out ? "fc_msgs_out " : "") + (t.unread ? "fc_msgs_unread" : "");
            t.sticker && (o += " fc_msg_sticker");
            var r = t.out ? curFastChat.tpl.msgs_out : curFastChat.tpl.msgs;
            s = se(rs(r, {
                from_id: t.from_id,
                link: t.link,
                photo: Notifier.fixPhoto(t.photo),
                name: t.from_id == curFastChat.me.id ? getLang("mail_im_thats_u") : stripHTML(t.name),
                classname: o,
                date: t.date,
                date_str: t.date_str,
                msgs: ""
            })), a.appendChild(s)
        } else t.unread || removeClass(s, "fc_msgs_unread");
        var n = geByClass1("fc_msgs", s, "div"),
            c = geByClass1("fc_msgs_date", n),
            l = geByClass1("fc_msg_last", n);
        l && removeClass(l, "fc_msg_last");
        var u = se(rs(curFastChat.tpl.msg, {
            msg_id: t.id,
            classname: (t.unread ? "fc_msg_unread" : "") + " fc_msg_last",
            text: t.text
        }));
        domFC(n) && "BR" == domFC(n)
            .tagName && re(domFC(n)), c ? n.insertBefore(u, c) : n.appendChild(u), vk.id != t.from_id && (delete curFastChat.typingEvents[e], FastChat.updateTyping(e, 1)),
            i.scroll && i.scroll.update()
    },
    showMsgFwd: function(t) {
        return !showBox("al_im.php", {
            act: "a_show_forward_box",
            id: vk.id + "_" + t,
            from: "mail"
        }, {
            stat: ["im.css"],
            dark: 1
        })
    },
    closeTab: function(t) {
        var e = curFastChat.tabs[t].box;
        e.close()
    },
    openSnapsterLayer: function(t) {
        return checkEvent(t) ? void 0 : (showBox("/snapster.php", {
            act: "show"
        }, {
            containerClass: "chronicle_layer",
            dark: 1
        }), cancelEvent(t))
    },
    nicePeer: function(t) {
        return t > 2e9 ? "c" + intval(t - 2e9) : -2e9 > t ? "e" + intval(-t - 2e9) : t
    },
    tplBox: '<div class="fc_tab_wrap"><div class="fc_tab_head clear_fix"><a class="fc_tab_close_wrap"><div class="chats_sp fc_tab_close"></div></a><a class="fc_tab_max_wrap" href="/im?sel=%id%" onmousedown="event.cancelBubble = true;" onclick="return nav.go(this, event);"><div class="chats_sp fc_tab_max"></div></a><a class="fc_tab_pin_wrap" onmousedown="event.cancelBubble = true;" onclick="return FastChat.pinTab(%id%, event);"><div class="chats_sp fc_tab_pin"></div></a><div class="fc_tab_title noselect">%name%</div></div><div class="fc_tab"><div class="fc_tab_log_wrap"><div class="fc_tab_notify_wrap"></div><div class="fc_tab_log"><div class="fc_tab_log_msgs"></div><div class="fc_tab_typing" id="fc_tab_typing%id%"><div class="fc_tab_typing_icon"></div><div class="fc_tab_typing_name _fc_tab_typing_name"></div></div></div></div><div class="fc_tab_txt_wrap"><a class="fc_tab_attach"></a><div class="fc_tab_txt">%cont%<div class="fc_tab_preview"></div></div></div></div><div class="fc_pointer_offset"><div class="fc_tab_pointer fc_tab_pointer_peer"></div></div></div>',
    tplTab: '<div class="fc_tab_log_wrap"><div class="fc_tab_notify_wrap"></div><div class="fc_tab_log"><div class="fc_tab_log_msgs"></div><div class="fc_tab_typing" id="fc_tab_typing%id%"><div class="fc_tab_typing_icon"></div><div class="fc_tab_typing_name _fc_tab_typing_name"></div></div></div></div><div class="fc_tab_txt_wrap"><div class="fc_tab_txt">%cont%</div></div>'
};
var DesktopNotifications = {
        supported: function() {
            return !(!window.webkitNotifications && !window.Notification)
        },
        checkPermission: function() {
            return window.webkitNotifications ? webkitNotifications.checkPermission() : "granted" == Notification.permission ? 0 : 1
        },
        requestPermission: function(t) {
            (window.webkitNotifications || window.Notification)
            .requestPermission(t)
        },
        createNotification: function(t, e, i) {
            var a;
            return window.webkitNotifications ? a = webkitNotifications.createNotification(t, e, i) : (a = new Notification(e, {
                icon: t,
                body: i
            }), a.cancel = function() {
                this.close()
            }, a.show = function() {}), vk.id % 100 < 10 && statlogsValueEvent("browser_notification", 0), a
        }
    },
    TopNotifier = {
        tnLink: "top_notify_btn",
        tnCount: "top_notify_count",
        _qParams: {
            section: "notifications",
            _tb: 1
        },
        loaded: !1,
        onLoad: function(rows, js) {
            val("top_notify_cont", rows), eval("(function(){" + js + ";})()"), TopNotifier.cleanCount(), TopNotifier.refresh()
        },
        preload: function() {
            this.shown() || vk.isBanned || ajax.post("/al_feed.php", extend(this._qParams, {
                _preload: 1
            }), {
                cache: 1,
                onDone: function(t, e) {
                    TopNotifier.shown() && geByClass1("pr", "top_notify_cont") && TopNotifier.onLoad(t, e)
                },
                stat: ["feed.css", "page.css", "post.css"]
            })
        },
        show: function(t) {
            if (checkEvent(t) !== !0 && !vk.isBanned) {
                if (this.shown() && t !== !0) return gpeByClass("top_notify_wrap", t.target, ge("top_nav")) || this.hide(), cancelEvent(t);
                vk.counts.ntf = 0, this.setCount(0, !0);
                var e = ge(TopNotifier.tnLink),
                    i = ge("top_notify_cont");
                if (e.tt && e.tt.hide && e.tt.hide(), !i) {
                    var a = ce("div", {
                        innerHTML: '<div class="top_notify_header"><a href="/settings?act=notify" class="top_notify_prefs_lnk">' + getLang(
                                "global_notifications_settings") + "</a>" + getLang("global_last_notifitications") +
                            '</div><div id="top_notify_cont" class="top_notify_cont wall_module"  ontouchstart="event.cancelBubble = true;" onmousedown="event.cancelBubble = true;"></div><a href="/feed?section=notifications" class="top_notify_show_all" onmousedown="event.cancelBubble = true;" onclick="TopNotifier.hide(); return nav.go(this, event);">' +
                            getLang("global_notify_show_all") + "</a>",
                        id: "top_notify_wrap",
                        className: "scroll_fix_wrap top_notify_wrap"
                    });
                    e.appendChild(a), i = ge("top_notify_cont")
                }
                cur.tnScrollbar || (cur.tnScrollbar = new Scrollbar("top_notify_cont", {
                    nomargin: !0,
                    right: vk.rtl ? "auto" : 0,
                    left: vk.rtl ? 0 : "auto",
                    forceCancelEvent: !0,
                    nokeys: !0
                }), cur.destroy.push(function() {
                    cur.tnScrollbar && cur.tnScrollbar.destroy()
                })), TopNotifier.loaded || (ajax.post("/al_feed.php", this._qParams, {
                    onDone: TopNotifier.onLoad,
                    showProgress: TopNotifier.showProgress,
                    stat: ["feed.css"]
                }), TopNotifier.loaded = !0), addClass(this.tnLink, "active");
                var s = window.innerHeight || document.documentElement.clientHeight;
                return setStyle(i, {
                    maxHeight: Math.max(s - 200, 400)
                }), TopNotifier.refresh(), t !== !0 && topHeaderClose(TopNotifier.hide.bind(this)), t ? cancelEvent(t) : !1
            }
        },
        hide: function() {
            removeClass(this.tnLink, "active"), topHeaderClearClose()
        },
        shown: function() {
            return hasClass(this.tnLink, "active")
        },
        showProgress: function() {
            var t = ge("top_notify_cont");
            geByClass1("pr", t) || (val(t, ""), showProgress(t), TopNotifier.refresh())
        },
        showTooltip: function(t, e) {
            function i(t) {
                if (!t && cur.topNotifyTTKey && (t = cur.topNotifyTTKey, delete cur.topNotifyTTKey), t) {
                    var e = t.split(":"),
                        i = ls.get("ntfseen") || {};
                    2 == e.length && (i[0] = parseInt((new Date)
                        .getTime() / 1e3), i[e[0]] = e[1], ls.set("ntfseen", i))
                }
            }
            if (!TopNotifier.shown()) {
                var a = ge(TopNotifier.tnLink),
                    s = {};
                if ("shownow" == a.tt && removeAttr(a, "tt"), t) s.text = function() {
                    return t
                }, e && (s.onHide = i.pbind(e));
                else {
                    a.tt && a.tt.destroy && a.tt.destroy();
                    var o = ls.get("ntfseen") || {},
                        r = [];
                    each(o, function(t, e) {
                        r.push(t + ":" + e)
                    }), s = extend(s, {
                        url: "al_feed.php",
                        params: {
                            act: "a_last_notify",
                            seen: r.join(";")
                        },
                        ajaxdt: 2e3,
                        noload: 1,
                        onHide: i
                    })
                }
                var n = function(t) {
                    setTimeout(function() {
                        return window.curNotifier && curNotifier.idle_manager && curNotifier.idle_manager.is_idle ? void n(t) : void(t && t.hide())
                    }, 6e3)
                };
                showTooltip(a, extend(s, {
                    typeClass: "top_notify_tt",
                    dir: "up",
                    width: 250,
                    shift: [0, 1],
                    nohideover: 1,
                    nohide: 1,
                    onShowStart: function(t) {
                        TopNotifier.shown() && (t.opts.onHide = !1, t.hide()), addEvent(t.container, "mousedown", function(t) {
                            return t && inArray(t.target.tagName, ["A", "IMG"]) ? void 0 : (TopNotifier.show(t), cancelEvent(t))
                        }), n(t)
                    }
                }))
            }
        },
        invalidate: function() {
            TopNotifier.loaded = !1
        },
        setCount: function(t, e) {
            isString(t) && (t = trim(t)), hasClass(this.tnLink, "has_notify") && t ? animateCount(this.tnCount, t, {
                str: "auto"
            }) : val(this.tnCount, t), toggleClass(this.tnLink, "has_notify", !!t), e || this.invalidate()
        },
        cleanCount: function() {
            cur.topNotifyHash && ajax.post("/al_feed.php", {
                act: "a_clean_notify",
                hash: cur.topNotifyHash
            })
        },
        refresh: function() {
            cur.tnScrollbar && cur.tnScrollbar.update(!1, !0)
        },
        postTooltip: function(t, e, i) {
            return !1
        },
        hideRow: function(t, e, i) {
            var a = gpeByClass("feed_row", t);
            ajax.post("/al_feed.php", {
                act: "a_hide_notify",
                item: e,
                hash: i
            }), t.tt && t.tt.hide && t.tt.hide(), slideUp(a, 200, function() {
                re(a), geByClass("feed_row", "top_notify_cont")
                    .length || val("top_notify_cont", '<div class="top_notify_empty no_rows">' + getLang("news_no_new_notifications") + "</div>"), TopNotifier.refresh()
            })
        },
        checkClick: function(t, e) {
            if (e = e || window.event, !t || !e) return !0;
            var i = e.target || e.srcElement,
                a = 8,
                s = !1,
                o = /(feedback_sticky_text|feedback_sticky_icon|feedback_row)/;
            do
                if (!i || i == t || i.onclick || i.onmousedown || inArray(i.tagName, ["A", "IMG", "TEXTAREA", "EMBED", "OBJECT"]) || (s = i.className.match(o))) break;
            while (a-- && (i = i.parentNode));
            return s ? i || !0 : !1
        },
        showGiftBox: function(t, e) {
            return !showBox("al_gifts.php", {
                act: "get_gift_box",
                fids: t,
                fr: 1
            }, {
                stat: ["gifts.css", "wide_dd.js", "wide_dd.css"],
                cache: 1,
                dark: 1
            }, e)
        }
    };
try {
    stManager.done("notifier.js")
} catch (e) {}
