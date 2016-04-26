﻿! function(e) {
    function t(r) {
        if (n[r]) return n[r].exports;
        var a = n[r] = {
            exports: {},
            id: r,
            loaded: !1
        };
        return e[r].call(a.exports, a, a.exports, t), a.loaded = !0, a.exports
    }
    var n = {};
    return t.m = e, t.c = n, t.p = "", t(0)
}([function(e, t, n) {
    e.exports = n(1)
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }
    var a = n(2),
        i = n(76),
        o = r(i),
        s = n(103),
        l = n(73),
        u = n(81);
    window.IM = {
        init: function(e) {
            window.Promise || (window.Promise = s.Promise), cur.ctrl_submit = e.ctrl_submit, cur.module = "im", cur.mutedPeers = e.mutedPeers, cur.peer = e.peer, e
                .blockedFlagUpdates = {}, e.msgid = intval(nav.objLoc.msgid), e.unread_dialogs = Object.keys(e.tabs)
                .filter(function(t) {
                    return e.tabs[t].unread > 0
                })
                .map(intval);
            var t = (0, o["default"])(e),
                n = (0, a.mount)(geByClass1("js-im-page", ge("page_body")), t);
            IM.chatPhotoSaved = function(e) {
                curBox() && curBox()
                    .hide();
                var n = (e || {})[1];
                return n ? (cur.pvShown && layers.fullhide(!0, !0), "im" != cur.module || t.get()
                    .peer != n ? nav.go("/im?sel=c" + (n - 2e9)) : void 0) : nav.reload()
            }, IM.activateTab = function(e) {
                (0, u.selectAnotherPeer)(t, intval(e), l.changePeer, l.selectPeer, function() {
                    return n
                })
            }, cur.nav.push(n.unmount)
        }
    };
    try {
        stManager.done("imn.js")
    } catch (c) {}
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function a() {
        for (var e = arguments.length, t = Array(e), n = 0; e > n; n++) t[n] = arguments[n];
        return function(e) {
            return t.reduce(function(t, n) {
                return t & n(e)
            })
        }
    }

    function i(e, t) {
        return e || t.type !== A.eventTypes.SET_DIRECTORIES && t.type !== A.eventTypes.REPLACE_DIRECTORIES && t.type !== A.eventTypes.RESET_DIRECTORIES
    }

    function o(e, t, n) {
        var r = n.reduce(function(e, t) {
            return e[t.peerId] || (e[t.peerId] = []), e[t.peerId].push(t.messageId), e
        }, {});
        Object.keys(r)
            .forEach(function(n) {
                var a = r[n];
                e.set(M.removeMessages.bind(null, a, n))
                    .then(function() {
                        t.removeMessages(a, intval(n), e)
                    })
            })
    }

    function s(e, t, n, r) {
        t.set(M.updateChatPhoto.bind(null, e))
            .then(function() {
                var a = e.kludges.source_act;
                n.updateDialog(e.peerId, t), r.updateChatPhoto(e, a, t)
            })
    }

    function l(e, t, n, r, a, i, o) {
        e.set(M.updateActions.bind(null, t, r, n))
            .then(function() {
                return t === x.CHAT_INVITE_USER ? e.set(M.loadPeer.bind(null, n, e.get()
                    .peer === n, !1)) : e.set(M.chatKickUser.bind(null, n, a, r))
            })
            .then(function() {
                e.get()
                    .peer === n && (o.updateChat(e, n), i.updateDialog(n, e))
            })
    }

    function u(e, t, n, r) {
        t.removeSelection(e), removeClass(r, "im-page_history-show"), e.set(M.changePeer.bind(null, 0, !1))
            .then(function() {
                n.changePeer(e), setTimeout(function() {
                    e.get()
                        .longpoll.push([A.eventTypes.transitionEvent("search")])
                }, 13)
            })
    }

    function c(e, t, n, r) {
        e.forEach(function(e) {
            var a = e.kludges.source_act,
                i = intval(e.kludges.source_mid);
            switch (a) {
                case x.CHAT_PHOTO_REMOVE:
                case x.CHAT_PHOTO_UPDATE:
                    s(e, t, n, r);
                    break;
                case x.CHAT_KICK_USER:
                case x.CHAT_INVITE_USER:
                    l(t, a, e.peerId, i, e.userId, n, r);
                    break;
                case x.CHAT_TITLE_ACTION:
                    var o = e.kludges.source_text;
                    t.set(M.setChatTitle.bind(null, e.peerId, o))
                        .then(r.updateChatTopic.bind(null, e.peerId))
            }
        })
    }

    function d(e, t) {
        return 2e9 > t && e && !e.match(/^\s*(Re(\(\d*\))?\:)?\s*\.\.\.\s*$/)
    }

    function g(e, t) {
        var n = t.flags & A.eventTypes.FLAG_OUTBOUND,
            r = inArray(t.peerId, e.get()
                .mutedPeers),
            a = t.flags & A.eventTypes.FLAG_DELETED,
            i = e.get()
            .gid;
        if (!n && !r && !a) {
            var o, s, l = d(t.subject, t.peerId) || "",
                u = (l ? l + " " : "") + t.text || "",
                c = t.userId,
                g = t.peerId;
            if (!(0, x.isChatPeer)(g)) return;
            var f = e.get()
                .tabs[g];
            (!e.get()
                .notify_msg && !(0, x.isChatPeer)(g) || i) && Notifier.playSound({
                author_id: g
            }), u = trim(replaceEntities(stripHTML(u.replace(/<br>/g, "\n")
                .replace(/<\*>.*$/, "")))), (0, x.isChatPeer)(g) ? (o = f.data.members[c].name, f.tab && (o += " » " + f.tab), s = f.data.members[c].photo) : (o = f.tab,
                s = f.photo);
            var m = t.attaches[0];
            m && "fwd" === m.type ? u += "\n[" + getLang("mail_added_msgs") + "]" : m && (u += "\n[" + getLang("mail_added_" + m.type) + "]"), o = trim(replaceEntities(
                stripHTML((o || "")
                    .replace("&nbsp;", " ")))), Notifier.proxyIm({
                id: t.messageId,
                text: u,
                author_id: g,
                title: o,
                author_photo: s
            })
        }
    }

    function f(e, t, n, r) {
        e.set(M.setExecStack.bind(null, (0, L.executionStackPush)(e.get()
            .stack, "im_peer", u.bind(null, e, t, n, r))))
    }

    function m(e) {
        var t = e.attaches.filter(function(e) {
            return "sticker" !== e.type
        });
        return (0, x.isServiceMsg)(e) || 0 === t.length
    }

    function p(e, t, n, r, o, s, l, u, d, p, _, h, v, b, T, E, w) {
        return {
            changePeer: function(t, n) {
                e.selectPeer(t, n)
            },
            cancelSearch: function(t) {
                t.get()
                    .searchText && (n.clearSearch(t), e.restoreDialogs(t))
            },
            loadingPeer: function(e) {
                addClass(r, "im-page_history-show"), t.loadingPeer(e)
            },
            restoreDialogs: function(t, n) {
                e.restoreDialogs(t, n)
            },
            focusSearch: function(e) {
                n.focusInput(e)
            },
            appendSearch: function(t, n, r, a) {
                e.appendSearch(t, n, r, a)
            },
            appendDialogs: function(t, n) {
                e.appendDialogs(t, n)
            },
            showCreation: function(e, t) {
                n.rotateCross(e), _ && _.show(e, t)
            },
            updateState: function(n, r) {
                e.updateDialog(n, r), r.get()
                    .peer === n && t.updateChat(r, n)
            },
            appendFastDialogs: function(t, n) {
                e.appendFastDialogs(t, n, !0)
            },
            createCanceled: function(e, t) {
                n.createCanceled(e, t)
            },
            hideFwd: function(e) {
                t.hideFwd(e)
            },
            selectPeer: function(n) {
                t.changePeer(n), f(n, e, t, r)
            },
            updateDialog: function(t, n) {
                e.updateDialog(t, n)
            },
            focusTxt: function(e) {
                t.focustTxt(e)
            },
            resync: function(r) {
                r.get()
                    .searchText && n.clearSearch(r), e.restoreDialogs(r, !0, !0), e.focusOnSelected(r), _ && _.hide(r), t.cleanSelection(r.get()
                        .selectedMessages || []), t.cancelSearch(r, !0), t.changePeer(r), handlePageCount("l_msg", r.get()
                        .unread_cnt)
            },
            toggleSettingsLoader: function(e, t) {
                v.toggleLoader(e, t)
            },
            onUserActions: function(e, t) {
                if (!(0, M.isSearchingInplace)(e.get()
                        .peer, e.get())) {
                    var n = e.get(),
                        r = n.peer;
                    if ((0, x.isFullyLoadedTab)(n, r)) {
                        var a = (0, M.countUnread)(e.get()
                            .peer, e.get());
                        if (a > 0) {
                            var i = n.tabs[r];
                            i.skipped || e.set(M.readLastMessages.bind(null, r))
                        }
                    }
                }
            },
            removeSelection: function(t) {
                e.removeSelection(t), n.focusInput(t)
            },
            updateDialogFilters: function(t) {
                t.get()
                    .searchText || e.restoreDialogs(t), v.updateFilter(t)
            },
            removePeer: function(n, r) {
                t.changePeer(n, n.get()
                    .peer), e.removeDialog(n, r)
            },
            newMessage: function(n, r) {
                e.promoteDialog(r, n), e.scrollUp(), t.addMessage(r, n)
            },
            onEvents: function(r, o) {
                var s = r.get()
                    .gid,
                    l = o.filter(a(i.bind(null, s))),
                    f = o.filter(x.isServiceMsg);
                c(f, r, e, t), r.set(M.checkNewPeople.bind(null, f, u))
                    .then(function() {
                        l.forEach(function(a) {
                            switch (a.type) {
                                case A.eventTypes.ADD_MESSAGE:
                                    var i = (0, x.isDuplicate)(a, r.get());
                                    if (0 === i) {
                                        a.flags & A.eventTypes.FLAG_OUTBOUND || r.set(M.updateFavAndTitle.bind(null, a.peerId, !0));
                                        var o = r.set(M.addMessage.bind(null, a))
                                            .then(function(n) {
                                                g(n, a), e.updateTyping(a, n), e.promoteDialog(n, a), t.updateTyping(a, n), t.addMessage(n, a), v.updateFilter(
                                                    n)
                                            });
                                        m(a) || Promise.all([o, r.set(M.loadMedia.bind(null, a))])
                                            .then(function(e) {
                                                var n = C(e, 2),
                                                    r = n[1];
                                                t.replaceAttachmentPlaceholders(r, a)
                                            })
                                    } else 2 === i && (m(a) || r.set(M.loadMedia.bind(null, a))
                                        .then(function(e) {
                                            t.replaceAttachmentPlaceholders(e, a)
                                        }), r.set(M.replaceMessage.bind(null, a))
                                        .then(t.replaceMessageAttrs.bind(null, a)));
                                    break;
                                case A.eventTypes.READ_INBOUND:
                                    r.set(M.markInboundMessagesAsRead.bind(null, a))
                                        .then(function(t) {
                                            e.updateCounter(t, a), t.get()
                                                .searchText || e.restoreDialogs(t), v.updateFilter(t)
                                        });
                                    break;
                                case A.eventTypes.READ_OUTBOUND:
                                    r.set(M.markOutboundMessagesAsRead.bind(null, a))
                                        .then(function(n) {
                                            e.updateCounter(n, a), t.markMessagesAsRead(n, a)
                                        });
                                    break;
                                case A.eventTypes.UNREAD_COUNT:
                                    r.set(M.updateUnreadCount.bind(null, a.count))
                                        .then(function() {
                                            handlePageCount("msg", a.count), v.updateFilter(r)
                                        });
                                    break;
                                case A.eventTypes.GOT_ONLINE:
                                case A.eventTypes.GOT_OFFLINE:
                                    var s = a.type === A.eventTypes.GOT_ONLINE ? !0 : !1;
                                    r.set(M.updateOnline.bind(null, a.userId, s))
                                        .then(function(n) {
                                            (0, x.isTabLoaded)(n.get(), a.userId) && (e.updateOnline(a.userId, n), t.updateOnline(a.userId, n))
                                        });
                                    break;
                                case A.eventTypes.SET_FLAGS:
                                case A.eventTypes.RESET_FLAGS:
                                    if (a.flags !== A.eventTypes.FLAG_DELETED || a.type !== A.eventTypes.SET_FLAGS || (0, x.isAlreadyDeleted)(r, a.peerId,
                                            a.messageId) || r.get()
                                        .blockedFlagUpdates[a.peerId] || d(a), a.flags === A.eventTypes.FLAG_IMPORTANT) {
                                        var l = a.type === A.eventTypes.SET_FLAGS;
                                        r.set(M.updateImportant.bind(null, l ? 1 : -1, a.messageId))
                                            .then(n.updateImportantCnt), r.set(M.updateFavMessage.bind(null, [a.messageId], a.peerId, l))
                                            .then(function(e) {
                                                t.markImportant(a.messageId, l, r)
                                            })
                                    }
                                    break;
                                case A.eventTypes.TYPING:
                                    r.set(M.setTyping.bind(null, a.peerId, a.userId))
                                        .then(function(n) {
                                            (0, x.isTabLoaded)(n.get(), a.peerId) && (t.updateTyping(a, n), e.updateTyping(a, n))
                                        }), r.set(M.waitTyping.bind(null, a.peerId, a.userId))
                                        .then(function(n) {
                                            (0, x.isTabLoaded)(n.get(), a.peerId) && (t.updateTyping(a, n), e.updateTyping(a, n))
                                        });
                                    break;
                                case A.eventTypes.NOTIFY_SETTINGS_CHANGED:
                                    y(r, p, a.peerId, a.disabledUntil < 0);
                                    break;
                                case A.eventTypes.RESYNC:
                                    r.get()
                                        .longpoll.pause(), r.set(M.resync)
                                        .then(p()
                                            .resync)
                                        .then(function(e) {
                                            return r.get()
                                                .longpoll.resume()
                                        });
                                    break;
                                case A.eventTypes.TRANSITION:
                                    T.transition(a.state)
                            }
                        })
                    })
            },
            unmount: function() {
                clearInterval(b.get()
                        .update_title_to), show("footer_wrap"), o.stop(), removeEvent(document, "mousemove mousedown keydown", s), removeEvent(document, "keydown", E),
                    removeEvent(document, "keyup", w), removeEvent(document, "keydown", h), removeEvent(window, "resize", l), u.stop(), e.unmount();
                var r = window.devicePixelRatio >= 2 ? "_2x" : "";
                setFavIcon("/images/icons/favicons/fav_logo" + r + ".ico"), t.unmount(), n.unmount()
            }
        }
    }

    function _(e, t, n) {
        !n || "keypress" !== n.type || 27 === n.which || 13 === n.which || (0, M.isSearchingInplace)(t.get()
                .peer, t.get()) || hasClass(document.activeElement, "_im_text") || hasClass(document.activeElement, "im_editable") || hasClass(document.activeElement,
                "fc_editable") || "INPUT" === document.activeElement.tagName || "TEXTAREA" === document.activeElement.tagName || document.activeElement.getAttribute(
                "contenteditable") || n.ctrlKey || browser.mac && n.metaKey || (0 === t.get()
                .peer ? e()
                .focusSearch(t) : e()
                .focusTxt(t)), (0, x.isReservedPeer)(t.get()
                .peer) || e()
            .onUserActions(t, n), t.set(M.updateFavAndTitle.bind(null, !1, !1))
    }

    function h(e, t, n, a, i, o) {
        var s = ge("page_header"),
            l = (ge("footer_wrap"), window.innerHeight - s.offsetHeight - O - 2),
            u = t.get()
            .gid ? "minHeight" : "height";
        if (setStyle(e, r({}, u, Math.max(l, D))), a && a.updateScroll(), i && i.updateScroll(), n) {
            var c = n.updateScroll();
            n.scrollFix(t, t.get()
                .peer, c)
        }
    }

    function v(e, t) {
        t && "keydown" === t.type && !layers.visible && 27 === t.which && e.set(M.setExecStack.bind(null, (0, L.executionStackPop)(e.get()
            .stack)))
    }

    function y(e, t, n, r) {
        e.set(M.setMutedPeer.bind(null, n, r))
            .then(t()
                .updateState.bind(null, n))
    }

    function b(e, t) {
        var n;
        hide("footer_wrap");
        var r = window.devicePixelRatio >= 2 ? "_2x" : "";
        setFavIcon("/images/icons/favicons/fav_im" + r + ".ico"), h(e, t, !1, !1, !1, !0), show(e), t.set(M.fetchLocalHints);
        var a = (0, P.createMutations)(p),
            i = a.callMutations,
            s = a.bindMutations,
            l = (0, A.startLongPoll)(t.get());
        l.on("data", function() {
            for (var e = arguments.length, n = Array(e), r = 0; e > r; r++) n[r] = arguments[r];
            return i()
                .onEvents(t, n)
        });
        var u = (0, T.mount)(geByClass1("_im_page_dcontent", e), t, i),
            c = (0, E.mount)(geByClass1("_im_page_history", e), t, i),
            d = (0, w.mount)(geByClass1("_im_dialogs_search", e), t, i),
            g = (0, S.mount)(geByClass1("_im_dialogs_settings", e), t, i);
        t.get()
            .gid || (n = (0, k.mount)(geByClass1("_im_dialogs_creation", e), t, i));
        var m = 0 === t.get()
            .peer ? "search" : "default",
            y = (0, I.create)(t, m, t.get()
                .ctrl_submit, u, c);
        c.updateScroll();
        var b = throttle(_.bind(null, i, t), 300);
        (0, x.isReservedPeer)(t.get()
            .peer) || setTimeout(function(n) {
            f(t, u, c, e)
        }, 10);
        var C = new IdleManager({
                id: "im",
                element: document,
                focusElement: window,
                triggerEvents: "mousemove mousedown keypress"
            }),
            O = h.bind(null, e, t, c, u, n, !1),
            D = v.bind(null, t);
        t.get()
            .longpoll = l, addEvent(window, "resize", O), t.set(M.setExecStack.bind(null, [])), C.on("unidle", function() {
                l.abortPauses(), b()
            }), C.start(), addEvent(document, "mousemove mousedown keypress", b), addEvent(document, "keydown", D);
        var B, F = function(e) {
                13 === e.which && y.signal(e.which, e), clearInterval(B), B = !1
            },
            N = function(e) {
                layers.visible || !B && inArray(e.which, [38, 40, 33, 34]) && (y.signal(e.which, e), B = setInterval(y.signal.bind(null, e.which, e), 130))
            };
        addEvent(document, "keydown", N), addEvent(document, "keyup", F), t.set(M.fetchFriends);
        var j = (0, L.throttleAccumulate)(o.bind(null, t, c), 200);
        return s(u, c, d, e, C, b, O, l, j, i, n, D, g, t, y, N, F)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var C = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.mount = b;
    var T = n(3),
        E = n(86),
        w = n(96),
        S = n(98),
        k = n(100),
        P = n(85),
        I = n(102),
        A = n(75),
        L = (n(77), n(80)),
        M = n(73),
        x = n(81),
        O = 30,
        D = 400
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t, n) {
        removeClass(t.parentNode, "im-page--dialogs_with-mess");
        var r = n.getCurrentElements()
            .filter(function(e) {
                return e.message
            });
        n.toTop(), n.reset(), r = r.length > 0 ? [{
            type: "sep",
            peerId: "000"
        }].concat(r) : [k()], n.pipeReplace(Promise.resolve(r))
    }

    function i(e) {
        return hasClass(e, "_im_search")
    }

    function o(e, t, n, r) {
        return e.get()
            .searchText && e.get()
            .searchAllLoaded ? Promise.resolve([]) : e.get()
            .dialog_search_going ? Promise.resolve(!1) : e.get()
            .searchText ? (0, N.searchMessages)(e.get()
                .searchText, e.get())
            .then(function(e) {
                var t = B(e, 2),
                    n = t[0],
                    r = t[1];
                return w(r, n)
            }) : e.get()
            .dialogsAll ? Promise.resolve([]) : e.set(N.loadDialogs)
            .then(function(t) {
                return O(e)
            })
    }

    function s(e, t) {
        var n = e.get()
            .pendingForward;
        n && n.length > 0 && e.set(N.forwardMessages.bind(null, e.get()
            .pendingForward, t))
    }

    function l(e, t, n, r, a) {
        var o = parseInt(domData(a, "peer"), 10);
        if (checkEvent(r)) {
            var l = t.get()
                .tabs[o];
            return void window.open(l.href)
        }
        var u = t.get()
            .peer,
            c = parseInt(domData(a, "msgid")),
            d = t.get()
            .msgid;
        if (i(a) && d !== c) e()
            .loadingPeer(t), t.set(N.changePeer.bind(null, o, c))
            .then(e()
                .changePeer.bind(null, c))
            .then(function() {
                t.set(N.selectPeerOnMessage.bind(null, o !== u, u))
                    .then(e()
                        .selectPeer)
            });
        else if (o !== u) {
            var g = t.get()
                .searchText;
            e()
                .hideFwd(t), e()
                .loadingPeer(t), e()
                .cancelSearch(t), t.set(N.changePeer.bind(null, o, 0))
                .then(function() {
                    g && setTimeout(function() {
                            n.scrollTo(o, !0, K, "center")
                        }, 100), e()
                        .changePeer(!1, t)
                })
                .then(function() {
                    t.set(N.selectPeer.bind(null, !0))
                        .then(function() {
                            s(t, o), e()
                                .selectPeer(t)
                        })
                })
        } else o === u && (i(a) ? e()
            .changePeer(d, t) : (e()
                .cancelSearch(t), e()
                .changePeer(!1, t)), s(t, u), e()
            .hideFwd(t), e()
            .selectPeer(t))
    }

    function u(e) {
        switch (e.type) {
            case "fwd":
                return e.messages.length > 1 ? getLang("mail_added_msgs") : getLang("mail_added_msg");
            case "photo":
                return getLang("mail_added_photo");
            case "video":
                return getLang("mail_added_video");
            case "audio":
                return getLang("mail_added_audio");
            case "doc":
                return getLang("mail_added_docs");
            case "geo":
            case "map":
                return getLang("mail_added_geo");
            case "wall":
                return getLang("mail_added_wall");
            case "wall_reply":
                return getLang("mail_added_wall_reply");
            case "gift":
                return getLang("mail_added_gift");
            case "link":
            case "share":
                return getLang("mail_added_link");
            case "sticker":
                return getLang("mail_added_sticker");
            case "chronicle":
                return getLang("mail_added_chronicle");
            case "chronicle_invite":
                return getLang("mail_invite_chronice");
            case "market":
                return getLang("mail_added_market_item")
        }
        return ""
    }

    function c(e, t) {
        var n;
        n = (0, j.isChatPeer)(e) && !t.photo ? (0, j.renderPhotosFromTab)(t, !0) : '<img src="' + t.photo + '"/>';
        var r = '<span class="_im_dialog_link">' + t.tab + "</span>";
        return {
            photo: n,
            userLink: r
        }
    }

    function d(e) {
        return !e.get()
            .pendingForward || 0 === e.get()
            .pendingForward.length
    }

    function g(e, t, n, r, a, i, o) {
        var s = "",
            l = "";
        return e & q.eventTypes.FLAG_OUTBOUND ? s = getLang("mail_by_you") : (0, j.isChatPeer)(n) && 0 !== r && (s = t.data.members[r].first_name), o = o.replace(
            /\<br\s*\/?\>/gi, " "), a && (o = Emoji.emojiToHTML(o, !0)), !o && i.length > 0 && (o = getTemplate("im_dialog_media", {
            name: u(i[0])
        })), l = s ? getTemplate("im_drow_prebody", {
            prebody: s,
            body: o
        }) : o
    }

    function f(e, t, n, r) {
        var a = arguments.length <= 4 || void 0 === arguments[4] ? {} : arguments[4];
        return getTemplate("im_drow", {
            peer: e.peerId,
            msg_id: "",
            photo: t,
            user_link: n,
            date: "",
            body: "",
            unread: "",
            more: a.search ? "_im_search" : "",
            is_star: "",
            is_online: e.online ? "nim-peer_online" : "",
            is_unread: "",
            is_unread_out: "",
            is_selected: e.peerId == r.get()
                .peer ? "nim-dialog_selected _im_dialog_selected" : ""
        })
    }

    function m(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3],
            a = c(t.peerId, t),
            i = a.photo,
            o = a.userLink,
            s = n || h(t);
        if (!s) return f(t, i, o, e, r);
        var l = s.flags,
            u = t.unread > 0 ? t.unread : "",
            d = "";
        d = (0, j.isServiceMsg)(s) ? (0, j.renderServiceMsg)(s, t, !1) : g(l, t, t.peerId, s.userId, s.kludges.emoji, s.attaches, s.text);
        var m = [];
        return r.search && m.push("_im_search", "nim-dialog_search"), inArray(t.peerId, e.get()
            .mutedPeers) && m.push("nim-dialog_muted"), t.verified && m.push("nim-dialog_verified"), -1 === s.messageId && m.push("nim-dialog_empty"), getTemplate(
            "im_drow", {
                peer: t.peerId,
                msg_id: s.messageId,
                photo: i,
                user_link: o,
                date: s.date ? getShortDateOrTime(s.date, 0, !0, getLang("months_sm_of", "raw")) : "",
                body: d,
                unread: u,
                more: m.join(" "),
                is_star: t.folders & q.eventTypes.FOLDER_IMPORTANT,
                is_online: t.online ? "nim-peer_online" : "",
                is_unread: u > 0 && l & q.eventTypes.FLAG_UNREAD ? "nim-dialog_unread" : "",
                is_unread_out: l & q.eventTypes.FLAG_UNREAD && l & q.eventTypes.FLAG_OUTBOUND && !(0, j.isSelfMessage)(t.peerId) ? "nim-dialog_unread-out" : "",
                is_selected: r.noselect || t.peerId != e.get()
                    .peer ? "" : "nim-dialog_selected _im_dialog_selected"
            })
    }

    function p(e, t, n, r, a) {
        var i = h(t),
            o = i.flags,
            s = _(t, n),
            l = c(t.peerId, t),
            u = l.photo,
            d = i.date ? getShortDateOrTime(i.date, 0, !0, getLang("months_sm_of", "raw")) : "";
        val(geByClass1("_dialog_body", e), s), val(geByClass1("_im_dialog_date", e), d), val(geByClass1("_im_dialog_unread_ct", e), t.unread ? t.unread : ""), val(
                geByClass1("_im_dialog_link", e), t.tab), val(geByClass1("_im_dialog_photo", e), u), t.folders & q.eventTypes.FOLDER_IMPORTANT, toggleClass(e,
                "nim-dialog_verified", !!t.verified), toggleClass(e, "nim-dialog_muted", inArray(t.peerId, n.get()
                .mutedPeers)), toggleClass(geByClass1("_im_peer_online", e), "nim-peer_online", !!t.online), t.unread > 0 && o & q.eventTypes.FLAG_UNREAD && addClass(e,
                "nim-dialog_unread"), -1 === i.messageId && addClass(e, "nim-dialog_empty"), o & q.eventTypes.FLAG_UNREAD && o & q.eventTypes.FLAG_OUTBOUND && !(0, j.isSelfMessage)
            (t.peerId) && addClass(e, "nim-dialog_unread-out"), a && setTimeout(function() {
                addClass(geByClass1("_im_dialog_" + t.peerId, r), "nim-dialog_injected")
            }, 100)
    }

    function _(e, t) {
        var n = h(e);
        return (0, j.isServiceMsg)(n) ? (0, j.renderServiceMsg)(n, e, !1) : g(n.flags, e, e.peerId, n.userId, n.emoji, n.attaches, n.text)
    }

    function h(e) {
        var t = e.lastmsg_meta;
        if (isArray(t) && (t = (0, G.addMessageEvent)([4].concat(t))), !t) {
            var n = "";
            return (0, j.isChatPeer)(e.peer) || (n = e.online ? "online" : "offline"), (0, G.addMessageEvent)([4, -1, 0, e.peer, "", "", n, {}, -1])
        }
        return t
    }

    function v(e, t, n, r, a) {
        var i = gpeByClass("_im_dialog", a, n);
        if (i) var o = intval(domData(i, "peer")),
            s = (0, j.showFlushDialog)(o, function(n) {
                (0, j.cleanHistory)(t, s, e, N.flushHistory, o)
            });
        return !1
    }

    function y(e, t) {
        var n = d(e);
        return getTemplate("im_drow", {
            peer: t.peerId,
            msg_id: t.lastmsg,
            photo: (0, j.renderPhotos)(t.photo),
            user_link: "<span>" + t.name + "</span>",
            date: "",
            body: "",
            unread: "",
            is_star: "",
            is_unread: "nim-dialog_prep-injected",
            is_unread_out: "",
            more: "",
            is_online: t.online ? "nim-peer_online" : "",
            is_selected: t.peerId == e.get()
                .peer && n ? "nim-dialog_selected _im_dialog_selected" : ""
        })
    }

    function b(e) {
        var t = getLang("mail_search_only_messages");
        return '<li class="im-page--mess-search-w">\n    <div class="im-page--mess-search ' + W + '">\n      ' + t + "\n    </div>\n  </li>"
    }

    function C() {
        return '<li class="im-page--dialogs-empty">\n    ' + getLang("mail_im_search_empty") + "\n  </div>\n  "
    }

    function T(e, t) {
        return !e.get()
            .unread_only || t.unread > 0
    }

    function E(e, t) {
        if ("sep" === t.type) return (0, j.renderMessagesSearch)();
        if ("empty" === t.type) return C();
        if ("only_mes" === t.type) return b(e);
        var n = e.get()
            .tabs_cache || {};
        return t.local_index && !n[t.peerId] ? y(e, t) : (t.local_index && (t = n[t.peerId]), t.message ? m(e, t, t.message, {
            noselect: !0,
            search: !0
        }) : m(e, t))
    }

    function w(e, t) {
        return e.map(function(e) {
                return (0, G.addMessageEvent)([4].concat(e))
            })
            .map(function(e) {
                return extend({}, t[e.peerId], {
                    message: e
                })
            })
    }

    function S() {
        return {
            type: "only_mes",
            peerId: "00001"
        }
    }

    function k() {
        return {
            type: "empty",
            peerId: "empty"
        }
    }

    function P(e) {
        return 0 === e.length ? e : [S()].concat(e)
    }

    function I(e, t, n) {
        return t()
            .toggleSettingsLoader(n, !0), e.checkMore(!0)
            .then(t()
                .toggleSettingsLoader.bind(null, n, !1))
    }

    function A(e, t) {
        var n = e.get()
            .msg_local_ids_sort && e.get()
            .msg_local_ids_sort[t.lastmsg];
        return "undefined" != typeof n ? 2e9 + n : t.lastmsg
    }

    function L(e, t, n) {
        return t.message && n.message ? n.message.messageId - t.message.messageId : t.message && !n.message ? 1 : n.message && !t.message ? -1 : A(e, n) - A(e, t)
    }

    function M(e, t) {
        for (; !hasClass(e, "_im_dialog") && e;) e = t(e);
        return e
    }

    function x(e, t, n, r, a, o, s) {
        return {
            selectPeer: function(t, n) {
                for (var r = geByClass("_im_dialog", e), a = n.get()
                        .peer, o = 0; o < r.length; o++) {
                    var s = r[o],
                        l = intval(domData(s, "peer")),
                        u = intval(domData(s, "msgid"));
                    l === a && (!t && !i(s) || t === u && i(s)) ? (addClass(s, "nim-dialog_selected"), addClass(s, "_im_dialog_selected")) : hasClass(s,
                        "_im_dialog_selected") && (removeClass(s, "nim-dialog_selected"), removeClass(s, "_im_dialog_selected"))
                }
            },
            appendFastDialogs: function(t, n, r) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), o.saveScroll("list"), r ? (o.reset(), n = P(n), o.pipeReplace(Promise.resolve(n))) : o.pipe(
                    Promise.resolve(n)), o.toTop()
            },
            hoverDialog: function(t, n) {
                var r = geByClass1("_im_dialog_hovered", e);
                r || (r = geByClass1("_im_dialog_selected", e));
                var a;
                if (r) {
                    var i = "next" === t ? domNS : domPS,
                        s = i(r),
                        a = M(s, i);
                    if (!a) return;
                    removeClass(r, "_im_dialog_hovered"), removeClass(r, "nim-dialog_hovered")
                } else a = M(e.firstElementChild, domNS);
                if (a) {
                    addClass(a, "_im_dialog_hovered"), addClass(a, "nim-dialog_hovered");
                    var l = geByClass1("_im_mess_search", e);
                    o.scrollTo(intval(domData(a, "peer")), !1, l ? K + 37 : K, l ? 37 : 0)
                }
            },
            selectHoveredDialog: function(t) {
                var n = geByClass1("_im_dialog_hovered", e);
                n && l(s, t, o, {}, n)
            },
            appendSearch: function(t, n, r) {
                var a = w(r, n);
                r.length > 0 ? (addClass(e.parentNode, "im-page--dialogs_with-mess"), o.pipe(Promise.resolve([{
                    type: "sep",
                    peerId: "000"
                }].concat(a)))) : (0 === o.getCurrentElements()
                    .length && o.pipeReplace(Promise.resolve([k()])), removeClass(e.parentNode, "im-page--dialogs_with-mess"))
            },
            updateDialog: function(t, n) {
                var r = geByClass1("_im_dialog_" + t);
                r && p(r, n.get()
                    .tabs[t], n, e)
            },
            focusOnSelected: function(e) {
                var t = e.get()
                    .peer;
                if (t) {
                    var n = geByClass1("_im_dialog_" + t);
                    n ? o.scrollTop(n.offsetTop - n.offsetHeight) : o.toTop()
                }
            },
            restoreDialogs: function(t, n, r) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), 0 !== O(t)
                    .length || o.isLoading() || (n = !0), n && o.reset(), r && o.wipe(), o.pipeReplace(Promise.resolve(O(t)))
                    .then(function(e) {
                        return n ? (o.toTop(), I(o, s, t)) : void o.restoreScroll("list")
                    })
            },
            appendDialogs: function(t, n) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), n.forEach(function(n) {
                    var r = geByClass1("_im_dialog_" + n.peerId, e);
                    r && p(r, n, t, e, !0)
                }), n = P(n), o.pipe(Promise.resolve(n))
            },
            updateCounter: function(t, n) {
                var r = geByClass1("_im_dialog_" + n.peerId, e);
                if (r && !i(r)) {
                    var a = t.get()
                        .tabs[n.peerId],
                        o = a.unread > 0 ? a.unread : "";
                    val(geByClass1("_im_dialog_unread_ct", r), o), o ? addClass(r, "nim-dialog_unread") : removeClass(r, "nim-dialog_unread"), a.lastmsg > a.out_up_to &&
                        !a.unread && a.lastmsg_meta.flags & q.eventTypes.FLAG_OUTBOUND ? addClass(r, "nim-dialog_unread-out") : removeClass(r, "nim-dialog_unread-out")
                }
            },
            removeDialog: function(e, t) {
                o.remove(t)
            },
            updateOnline: function(t, n) {
                var r = geByClass1("_im_dialog_" + t, e);
                if (r) {
                    var a = n.get()
                        .tabs[t],
                        i = geByClass1("_im_peer_online", r);
                    toggleClass(i, "nim-peer_online", a.online)
                }
            },
            scrollUp: function() {
                o.toTop()
            },
            promoteDialog: function(t, n) {
                var a = geByClass1("_im_dialog_" + n.peerId, e);
                if ((!a || i(a)) && t.get()
                    .searchText) return void o.unsetScroll("list");
                a && re(a);
                var s = t.get()
                    .tabs[n.peerId];
                T(t, s) && (o.pipeReplace(Promise.resolve(O(t))), r()
                    .updateTyping(n, t))
            },
            removeSelection: function(t) {
                var n = t.get()
                    .peer;
                removeClass(geByClass1("_im_dialog_" + n, e), "nim-dialog_selected")
            },
            updateScroll: function() {
                o.updateScroll()
            },
            updateTyping: function(t, n) {
                var r = geByClass1("_im_dialog_" + t.peerId, e);
                if (r && !i(r)) {
                    var a = geByClass1("_im_dialog_typing", r),
                        o = (0, j.formatTyper)(n.get()
                            .tabs[t.peerId].typing, t.peerId, !0, n.get(), 1);
                    val(a, o), toggleClass(r, "nim-dialog_typing", o)
                }
            },
            unmount: function() {
                o.unmount(), (0, F.removeDelegateEvent)(e, "click", "_im_dialog", t), (0, F.removeDelegateEvent)(e, "mouseover", "_im_dialog_close", n), (0, F.removeDelegateEvent)
                    (e, "click", "__im_dialog_close", a)
            }
        }
    }

    function O(e) {
        var t = e.get()
            .unread_only ? e.get()
            .unread_dialogs : e.get()
            .all_dialogs,
            n = e.get()
            .tabs;
        return t.map(function(e) {
                return n[e]
            })
            .sort(L.bind(null, e))
    }

    function D(e, t, n) {
        var r = (0, z.createMutations)(x),
            i = r.callMutations,
            s = r.bindMutations,
            u = v.bind(null, n, t, e),
            c = function(e, t) {
                var n = t.getBoundingClientRect()
                    .top;
                showTooltip(t, {
                    text: getLang("mail_delete"),
                    black: 1,
                    center: !0,
                    shift: [1, 10],
                    toup: n > 150
                })
            },
            d = (0, H.mount)(e, (0, U["default"])({
                limit: 40,
                offset: 0,
                nativeScroll: !!t.get()
                    .gid,
                height: Q,
                elements: O(t)
            }), function(e) {
                return {
                    idFn: function(e) {
                        return e.message ? e.message.messageId : e.peerId
                    },
                    renderFn: E.bind(null, t),
                    more: o.bind(null, t, i)
                }
            }),
            g = l.bind(null, n, t, d),
            f = a.bind(null, t, e, d);
        return (0, F.addDelegateEvent)(e, "click", "_im_dialog_close", u), (0, F.addDelegateEvent)(e, "click", "_im_dialog", g), (0, F.addDelegateEvent)(e, "click", W, f),
            (0, F.addDelegateEvent)(e, "mouseover", "_im_dialog_close", c), addEvent(e, "mouseover", throttle(function() {
                var t = geByClass("_im_dialog_hovered", e);
                t.forEach(function(e) {
                    removeClass(e, "_im_dialog_hovered"), removeClass(e, "nim-dialog_hovered")
                })
            }, 100)), s(e, g, c, i, u, d, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var B = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.mount = D;
    var F = (n(4), n(5)),
        N = n(73),
        j = n(81),
        R = n(76),
        U = r(R),
        H = n(83),
        G = n(77),
        z = n(85),
        q = n(75),
        Q = 64,
        K = 45,
        W = "_im_mess_search"
}, function(e, t) {
    "use strict";

    function n(e, t) {
        return new Promise(function(n, r) {
            ajax.post(e, t, {
                onDone: function() {
                    n.apply(null, [
                        [].concat(Array.prototype.slice.call(arguments))
                    ])
                },
                onFail: function() {
                    return r.apply(null, arguments), !0
                }
            })
        })
    }

    function r(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2];
        return new Promise(function(r, a) {
            var i, o = Date.now(),
                s = n.timeout || 60,
                l = ajx2q(t);
            if (window.XDomainRequest) {
                var u = new XDomainRequest;
                u.open("get", e + "?" + l), u.ontimeout = function() {
                    a("", {})
                }, u.onerror = function() {
                    a("", {})
                }, u.onload = function() {
                    r(u.responseText)
                }, setTimeout(function() {
                    u.send()
                }, 0)
            } else {
                var c = ajax._getreq();
                c.onreadystatechange = function() {
                    4 == c.readyState && (clearInterval(i), c.status >= 200 && c.status < 300 ? r(c.responseText, c) : a(c.responseText, c))
                };
                try {
                    c.open("GET", e + "?" + l, !0)
                } catch (d) {
                    return a(d)
                }
                c.send()
            }
            i = setInterval(function() {
                Date.now() - o > 1e3 * s && (a("", {}), clearInterval(i))
            }, 1e3)
        })
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.post = n, t.plainget = r
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e) {
        var t = c.get(e.currentTarget);
        if (t) {
            var n = t[e.type];
            if (n)
                for (var r, a = 0; a < n.length; a++) {
                    var i, o = s(n[a], 2),
                        l = o[0],
                        u = o[1];
                    if (hasClass(e.target, l) ? i = u(e, e.target) : (r = gpeByClass(l, e.target, e.currentTarget)) && (i = u(e, r)), i === !1) break
                }
        }
    }

    function i(e, t, n, r) {
        var i = c.get(e);
        i || (c.set(e, {}), i = c.get(e));
        for (var o = t.split(" "), s = 0; s < o.length; s++) {
            var l = o[s];
            i[l] || (i[l] = [], addEvent(e, l, a)), i[l].push([n, r])
        }
    }

    function o(e, t, n, r) {
        var i = c.get(e);
        if (i) {
            t.split(" ")
                .forEach(function(t) {
                    i[t] && (i[t] = i[t].filter(function(e) {
                        return e[0] !== n || e[1] !== r
                    }), 0 === i[t].length && removeEvent(e, t, a))
                })
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var s = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.addDelegateEvent = i, t.removeDelegateEvent = o;
    var l = n(6),
        u = r(l),
        c = new u["default"]
}, function(e, t, n) {
    n(7), n(27), n(53), n(57), e.exports = n(26)
        .Map
}, function(e, t, n) {
    "use strict";
    var r = n(8),
        a = {};
    a[n(10)("toStringTag")] = "z", a + "" != "[object z]" && n(14)(Object.prototype, "toString", function() {
        return "[object " + r(this) + "]"
    }, !0)
}, function(e, t, n) {
    var r = n(9),
        a = n(10)("toStringTag"),
        i = "Arguments" == r(function() {
            return arguments
        }()),
        o = function(e, t) {
            try {
                return e[t]
            } catch (n) {}
        };
    e.exports = function(e) {
        var t, n, s;
        return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof(n = o(t = Object(e), a)) ? n : i ? r(t) : "Object" == (s = r(t)) && "function" ==
            typeof t.callee ? "Arguments" : s
    }
}, function(e, t) {
    var n = {}.toString;
    e.exports = function(e) {
        return n.call(e)
            .slice(8, -1)
    }
}, function(e, t, n) {
    var r = n(11)("wks"),
        a = n(13),
        i = n(12)
        .Symbol,
        o = "function" == typeof i;
    e.exports = function(e) {
        return r[e] || (r[e] = o && i[e] || (o ? i : a)("Symbol." + e))
    }
}, function(e, t, n) {
    var r = n(12),
        a = "__core-js_shared__",
        i = r[a] || (r[a] = {});
    e.exports = function(e) {
        return i[e] || (i[e] = {})
    }
}, function(e, t) {
    var n = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
    "number" == typeof __g && (__g = n)
}, function(e, t) {
    var n = 0,
        r = Math.random();
    e.exports = function(e) {
        return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++n + r)
            .toString(36))
    }
}, function(e, t, n) {
    var r = n(12),
        a = n(15),
        i = n(25),
        o = n(13)("src"),
        s = "toString",
        l = Function[s],
        u = ("" + l)
        .split(s);
    n(26)
        .inspectSource = function(e) {
            return l.call(e)
        }, (e.exports = function(e, t, n, s) {
            var l = "function" == typeof n;
            l && (i(n, "name") || a(n, "name", t)), e[t] !== n && (l && (i(n, o) || a(n, o, e[t] ? "" + e[t] : u.join(String(t)))), e === r ? e[t] = n : s ? e[t] ? e[t] =
                n : a(e, t, n) : (delete e[t], a(e, t, n)))
        })(Function.prototype, s, function() {
            return "function" == typeof this && this[o] || l.call(this)
        })
}, function(e, t, n) {
    var r = n(16),
        a = n(24);
    e.exports = n(20) ? function(e, t, n) {
        return r.f(e, t, a(1, n))
    } : function(e, t, n) {
        return e[t] = n, e
    }
}, function(e, t, n) {
    var r = n(17),
        a = n(19),
        i = n(23),
        o = Object.defineProperty;
    t.f = n(20) ? Object.defineProperty : function(e, t, n) {
        if (r(e), t = i(t, !0), r(n), a) try {
            return o(e, t, n)
        } catch (s) {}
        if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
        return "value" in n && (e[t] = n.value), e
    }
}, function(e, t, n) {
    var r = n(18);
    e.exports = function(e) {
        if (!r(e)) throw TypeError(e + " is not an object!");
        return e
    }
}, function(e, t) {
    e.exports = function(e) {
        return "object" == typeof e ? null !== e : "function" == typeof e
    }
}, function(e, t, n) {
    e.exports = !n(20) && !n(21)(function() {
        return 7 != Object.defineProperty(n(22)("div"), "a", {
                get: function() {
                    return 7
                }
            })
            .a
    })
}, function(e, t, n) {
    e.exports = !n(21)(function() {
        return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            })
            .a
    })
}, function(e, t) {
    e.exports = function(e) {
        try {
            return !!e()
        } catch (t) {
            return !0
        }
    }
}, function(e, t, n) {
    var r = n(18),
        a = n(12)
        .document,
        i = r(a) && r(a.createElement);
    e.exports = function(e) {
        return i ? a.createElement(e) : {}
    }
}, function(e, t, n) {
    var r = n(18);
    e.exports = function(e, t) {
        if (!r(e)) return e;
        var n, a;
        if (t && "function" == typeof(n = e.toString) && !r(a = n.call(e))) return a;
        if ("function" == typeof(n = e.valueOf) && !r(a = n.call(e))) return a;
        if (!t && "function" == typeof(n = e.toString) && !r(a = n.call(e))) return a;
        throw TypeError("Can't convert object to primitive value")
    }
}, function(e, t) {
    e.exports = function(e, t) {
        return {
            enumerable: !(1 & e),
            configurable: !(2 & e),
            writable: !(4 & e),
            value: t
        }
    }
}, function(e, t) {
    var n = {}.hasOwnProperty;
    e.exports = function(e, t) {
        return n.call(e, t)
    }
}, function(e, t) {
    var n = e.exports = {
        version: "2.2.1"
    };
    "number" == typeof __e && (__e = n)
}, function(e, t, n) {
    "use strict";
    var r = n(28)(!0);
    n(31)(String, "String", function(e) {
        this._t = String(e), this._i = 0
    }, function() {
        var e, t = this._t,
            n = this._i;
        return n >= t.length ? {
            value: void 0,
            done: !0
        } : (e = r(t, n), this._i += e.length, {
            value: e,
            done: !1
        })
    })
}, function(e, t, n) {
    var r = n(29),
        a = n(30);
    e.exports = function(e) {
        return function(t, n) {
            var i, o, s = String(a(t)),
                l = r(n),
                u = s.length;
            return 0 > l || l >= u ? e ? "" : void 0 : (i = s.charCodeAt(l), 55296 > i || i > 56319 || l + 1 === u || (o = s.charCodeAt(l + 1)) < 56320 || o >
                57343 ? e ? s.charAt(l) : i : e ? s.slice(l, l + 2) : (i - 55296 << 10) + (o - 56320) + 65536)
        }
    }
}, function(e, t) {
    var n = Math.ceil,
        r = Math.floor;
    e.exports = function(e) {
        return isNaN(e = +e) ? 0 : (e > 0 ? r : n)(e)
    }
}, function(e, t) {
    e.exports = function(e) {
        if (void 0 == e) throw TypeError("Can't call method on  " + e);
        return e
    }
}, function(e, t, n) {
    "use strict";
    var r = n(32),
        a = n(33),
        i = n(14),
        o = n(15),
        s = n(25),
        l = n(36),
        u = n(37),
        c = n(50),
        d = n(51),
        g = n(10)("iterator"),
        f = !([].keys && "next" in [].keys()),
        m = "@@iterator",
        p = "keys",
        _ = "values",
        h = function() {
            return this
        };
    e.exports = function(e, t, n, v, y, b, C) {
        u(n, t, v);
        var T, E, w, S = function(e) {
                if (!f && e in A) return A[e];
                switch (e) {
                    case p:
                        return function() {
                            return new n(this, e)
                        };
                    case _:
                        return function() {
                            return new n(this, e)
                        }
                }
                return function() {
                    return new n(this, e)
                }
            },
            k = t + " Iterator",
            P = y == _,
            I = !1,
            A = e.prototype,
            L = A[g] || A[m] || y && A[y],
            M = L || S(y),
            x = y ? P ? S("entries") : M : void 0,
            O = "Array" == t ? A.entries || L : L;
        if (O && (w = d(O.call(new e)), w !== Object.prototype && (c(w, k, !0), r || s(w, g) || o(w, g, h))), P && L && L.name !== _ && (I = !0, M = function() {
                return L.call(this)
            }), r && !C || !f && !I && A[g] || o(A, g, M), l[t] = M, l[k] = h, y)
            if (T = {
                    values: P ? M : S(_),
                    keys: b ? M : S(p),
                    entries: x
                }, C)
                for (E in T) E in A || i(A, E, T[E]);
            else a(a.P + a.F * (f || I), t, T);
        return T
    }
}, function(e, t) {
    e.exports = !1
}, function(e, t, n) {
    var r = n(12),
        a = n(26),
        i = n(15),
        o = n(14),
        s = n(34),
        l = "prototype",
        u = function(e, t, n) {
            var c, d, g, f, m = e & u.F,
                p = e & u.G,
                _ = e & u.S,
                h = e & u.P,
                v = e & u.B,
                y = p ? r : _ ? r[t] || (r[t] = {}) : (r[t] || {})[l],
                b = p ? a : a[t] || (a[t] = {}),
                C = b[l] || (b[l] = {});
            p && (n = t);
            for (c in n) d = !m && y && void 0 !== y[c], g = (d ? y : n)[c], f = v && d ? s(g, r) : h && "function" == typeof g ? s(Function.call, g) : g, y && o(y, c, g,
                e & u.U), b[c] != g && i(b, c, f), h && C[c] != g && (C[c] = g)
        };
    r.core = a, u.F = 1, u.G = 2, u.S = 4, u.P = 8, u.B = 16, u.W = 32, u.U = 64, u.R = 128, e.exports = u
}, function(e, t, n) {
    var r = n(35);
    e.exports = function(e, t, n) {
        if (r(e), void 0 === t) return e;
        switch (n) {
            case 1:
                return function(n) {
                    return e.call(t, n)
                };
            case 2:
                return function(n, r) {
                    return e.call(t, n, r)
                };
            case 3:
                return function(n, r, a) {
                    return e.call(t, n, r, a)
                }
        }
        return function() {
            return e.apply(t, arguments)
        }
    }
}, function(e, t) {
    e.exports = function(e) {
        if ("function" != typeof e) throw TypeError(e + " is not a function!");
        return e
    }
}, function(e, t) {
    e.exports = {}
}, function(e, t, n) {
    "use strict";
    var r = n(38),
        a = n(24),
        i = n(50),
        o = {};
    n(15)(o, n(10)("iterator"), function() {
        return this
    }), e.exports = function(e, t, n) {
        e.prototype = r(o, {
            next: a(1, n)
        }), i(e, t + " Iterator")
    }
}, function(e, t, n) {
    var r = n(17),
        a = n(39),
        i = n(48),
        o = n(47)("IE_PROTO"),
        s = function() {},
        l = "prototype",
        u = function() {
            var e, t = n(22)("iframe"),
                r = i.length,
                a = ">";
            for (t.style.display = "none", n(49)
                .appendChild(t), t.src = "javascript:", e = t.contentWindow.document, e.open(), e.write("<script>document.F=Object</script" + a), e.close(), u = e.F; r--;)
                delete u[l][i[r]];
            return u()
        };
    e.exports = Object.create || function(e, t) {
        var n;
        return null !== e ? (s[l] = r(e), n = new s, s[l] = null, n[o] = e) : n = u(), void 0 === t ? n : a(n, t)
    }
}, function(e, t, n) {
    var r = n(16),
        a = n(17),
        i = n(40);
    e.exports = n(20) ? Object.defineProperties : function(e, t) {
        a(e);
        for (var n, o = i(t), s = o.length, l = 0; s > l;) r.f(e, n = o[l++], t[n]);
        return e
    }
}, function(e, t, n) {
    var r = n(41),
        a = n(48);
    e.exports = Object.keys || function(e) {
        return r(e, a)
    }
}, function(e, t, n) {
    var r = n(25),
        a = n(42),
        i = n(44)(!1),
        o = n(47)("IE_PROTO");
    e.exports = function(e, t) {
        var n, s = a(e),
            l = 0,
            u = [];
        for (n in s) n != o && r(s, n) && u.push(n);
        for (; t.length > l;) r(s, n = t[l++]) && (~i(u, n) || u.push(n));
        return u
    }
}, function(e, t, n) {
    var r = n(43),
        a = n(30);
    e.exports = function(e) {
        return r(a(e))
    }
}, function(e, t, n) {
    var r = n(9);
    e.exports = Object("z")
        .propertyIsEnumerable(0) ? Object : function(e) {
            return "String" == r(e) ? e.split("") : Object(e)
        }
}, function(e, t, n) {
    var r = n(42),
        a = n(45),
        i = n(46);
    e.exports = function(e) {
        return function(t, n, o) {
            var s, l = r(t),
                u = a(l.length),
                c = i(o, u);
            if (e && n != n) {
                for (; u > c;)
                    if (s = l[c++], s != s) return !0
            } else
                for (; u > c; c++)
                    if ((e || c in l) && l[c] === n) return e || c; return !e && -1
        }
    }
}, function(e, t, n) {
    var r = n(29),
        a = Math.min;
    e.exports = function(e) {
        return e > 0 ? a(r(e), 9007199254740991) : 0
    }
}, function(e, t, n) {
    var r = n(29),
        a = Math.max,
        i = Math.min;
    e.exports = function(e, t) {
        return e = r(e), 0 > e ? a(e + t, 0) : i(e, t)
    }
}, function(e, t, n) {
    var r = n(11)("keys"),
        a = n(13);
    e.exports = function(e) {
        return r[e] || (r[e] = a(e))
    }
}, function(e, t) {
    e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
}, function(e, t, n) {
    e.exports = n(12)
        .document && document.documentElement
}, function(e, t, n) {
    var r = n(16)
        .f,
        a = n(25),
        i = n(10)("toStringTag");
    e.exports = function(e, t, n) {
        e && !a(e = n ? e : e.prototype, i) && r(e, i, {
            configurable: !0,
            value: t
        })
    }
}, function(e, t, n) {
    var r = n(25),
        a = n(52),
        i = n(47)("IE_PROTO"),
        o = Object.prototype;
    e.exports = Object.getPrototypeOf || function(e) {
        return e = a(e), r(e, i) ? e[i] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? o : null
    }
}, function(e, t, n) {
    var r = n(30);
    e.exports = function(e) {
        return Object(r(e))
    }
}, function(e, t, n) {
    for (var r = n(54), a = n(14), i = n(12), o = n(15), s = n(36), l = n(10), u = l("iterator"), c = l("toStringTag"), d = s.Array, g = ["NodeList", "DOMTokenList",
            "MediaList", "StyleSheetList", "CSSRuleList"
        ], f = 0; 5 > f; f++) {
        var m, p = g[f],
            _ = i[p],
            h = _ && _.prototype;
        if (h) {
            h[u] || o(h, u, d), h[c] || o(h, c, p), s[p] = d;
            for (m in r) h[m] || a(h, m, r[m], !0)
        }
    }
}, function(e, t, n) {
    "use strict";
    var r = n(55),
        a = n(56),
        i = n(36),
        o = n(42);
    e.exports = n(31)(Array, "Array", function(e, t) {
        this._t = o(e), this._i = 0, this._k = t
    }, function() {
        var e = this._t,
            t = this._k,
            n = this._i++;
        return !e || n >= e.length ? (this._t = void 0, a(1)) : "keys" == t ? a(0, n) : "values" == t ? a(0, e[n]) : a(0, [n, e[n]])
    }, "values"), i.Arguments = i.Array, r("keys"), r("values"), r("entries")
}, function(e, t, n) {
    var r = n(10)("unscopables"),
        a = Array.prototype;
    void 0 == a[r] && n(15)(a, r, {}), e.exports = function(e) {
        a[r][e] = !0
    }
}, function(e, t) {
    e.exports = function(e, t) {
        return {
            value: t,
            done: !!e
        }
    }
}, function(e, t, n) {
    "use strict";
    var r = n(58);
    e.exports = n(67)("Map", function(e) {
        return function() {
            return e(this, arguments.length > 0 ? arguments[0] : void 0)
        }
    }, {
        get: function(e) {
            var t = r.getEntry(this, e);
            return t && t.v
        },
        set: function(e, t) {
            return r.def(this, 0 === e ? 0 : e, t)
        }
    }, r, !0)
}, function(e, t, n) {
    "use strict";
    var r = n(16)
        .f,
        a = n(38),
        i = (n(15), n(59)),
        o = n(34),
        s = n(60),
        l = n(30),
        u = n(61),
        c = n(31),
        d = n(56),
        g = n(65),
        f = n(20),
        m = n(66)
        .fastKey,
        p = f ? "_s" : "size",
        _ = function(e, t) {
            var n, r = m(t);
            if ("F" !== r) return e._i[r];
            for (n = e._f; n; n = n.n)
                if (n.k == t) return n
        };
    e.exports = {
        getConstructor: function(e, t, n, c) {
            var d = e(function(e, r) {
                s(e, d, t, "_i"), e._i = a(null), e._f = void 0, e._l = void 0, e[p] = 0, void 0 != r && u(r, n, e[c], e)
            });
            return i(d.prototype, {
                clear: function() {
                    for (var e = this, t = e._i, n = e._f; n; n = n.n) n.r = !0, n.p && (n.p = n.p.n = void 0), delete t[n.i];
                    e._f = e._l = void 0, e[p] = 0
                },
                "delete": function(e) {
                    var t = this,
                        n = _(t, e);
                    if (n) {
                        var r = n.n,
                            a = n.p;
                        delete t._i[n.i], n.r = !0, a && (a.n = r), r && (r.p = a), t._f == n && (t._f = r), t._l == n && (t._l = a), t[p]--
                    }
                    return !!n
                },
                forEach: function(e) {
                    s(this, d, "forEach");
                    for (var t, n = o(e, arguments.length > 1 ? arguments[1] : void 0, 3); t = t ? t.n : this._f;)
                        for (n(t.v, t.k, this); t && t.r;) t = t.p
                },
                has: function(e) {
                    return !!_(this, e)
                }
            }), f && r(d.prototype, "size", {
                get: function() {
                    return l(this[p])
                }
            }), d
        },
        def: function(e, t, n) {
            var r, a, i = _(e, t);
            return i ? i.v = n : (e._l = i = {
                i: a = m(t, !0),
                k: t,
                v: n,
                p: r = e._l,
                n: void 0,
                r: !1
            }, e._f || (e._f = i), r && (r.n = i), e[p]++, "F" !== a && (e._i[a] = i)), e
        },
        getEntry: _,
        setStrong: function(e, t, n) {
            c(e, t, function(e, t) {
                this._t = e, this._k = t, this._l = void 0
            }, function() {
                for (var e = this, t = e._k, n = e._l; n && n.r;) n = n.p;
                return e._t && (e._l = n = n ? n.n : e._t._f) ? "keys" == t ? d(0, n.k) : "values" == t ? d(0, n.v) : d(0, [n.k, n.v]) : (e._t = void 0, d(
                    1))
            }, n ? "entries" : "values", !n, !0), g(t)
        }
    }
}, function(e, t, n) {
    var r = n(14);
    e.exports = function(e, t, n) {
        for (var a in t) r(e, a, t[a], n);
        return e
    }
}, function(e, t) {
    e.exports = function(e, t, n, r) {
        if (!(e instanceof t) || void 0 !== r && r in e) throw TypeError(n + ": incorrect invocation!");
        return e
    }
}, function(e, t, n) {
    var r = n(34),
        a = n(62),
        i = n(63),
        o = n(17),
        s = n(45),
        l = n(64);
    e.exports = function(e, t, n, u, c) {
        var d, g, f, m = c ? function() {
                return e
            } : l(e),
            p = r(n, u, t ? 2 : 1),
            _ = 0;
        if ("function" != typeof m) throw TypeError(e + " is not iterable!");
        if (i(m))
            for (d = s(e.length); d > _; _++) t ? p(o(g = e[_])[0], g[1]) : p(e[_]);
        else
            for (f = m.call(e); !(g = f.next())
                .done;) a(f, p, g.value, t)
    }
}, function(e, t, n) {
    var r = n(17);
    e.exports = function(e, t, n, a) {
        try {
            return a ? t(r(n)[0], n[1]) : t(n)
        } catch (i) {
            var o = e["return"];
            throw void 0 !== o && r(o.call(e)), i
        }
    }
}, function(e, t, n) {
    var r = n(36),
        a = n(10)("iterator"),
        i = Array.prototype;
    e.exports = function(e) {
        return void 0 !== e && (r.Array === e || i[a] === e)
    }
}, function(e, t, n) {
    var r = n(8),
        a = n(10)("iterator"),
        i = n(36);
    e.exports = n(26)
        .getIteratorMethod = function(e) {
            return void 0 != e ? e[a] || e["@@iterator"] || i[r(e)] : void 0
        }
}, function(e, t, n) {
    "use strict";
    var r = n(12),
        a = n(16),
        i = n(20),
        o = n(10)("species");
    e.exports = function(e) {
        var t = r[e];
        i && t && !t[o] && a.f(t, o, {
            configurable: !0,
            get: function() {
                return this
            }
        })
    }
}, function(e, t, n) {
    var r = n(13)("meta"),
        a = n(18),
        i = n(25),
        o = n(16)
        .f,
        s = 0,
        l = Object.isExtensible || function() {
            return !0
        },
        u = !n(21)(function() {
            return l(Object.preventExtensions({}))
        }),
        c = function(e) {
            o(e, r, {
                value: {
                    i: "O" + ++s,
                    w: {}
                }
            })
        },
        d = function(e, t) {
            if (!a(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;
            if (!i(e, r)) {
                if (!l(e)) return "F";
                if (!t) return "E";
                c(e)
            }
            return e[r].i
        },
        g = function(e, t) {
            if (!i(e, r)) {
                if (!l(e)) return !0;
                if (!t) return !1;
                c(e)
            }
            return e[r].w
        },
        f = function(e) {
            return u && m.NEED && l(e) && !i(e, r) && c(e), e
        },
        m = e.exports = {
            KEY: r,
            NEED: !1,
            fastKey: d,
            getWeak: g,
            onFreeze: f
        }
}, function(e, t, n) {
    "use strict";
    var r = n(12),
        a = n(33),
        i = n(14),
        o = n(59),
        s = n(66),
        l = n(61),
        u = n(60),
        c = n(18),
        d = n(21),
        g = n(68),
        f = n(50),
        m = n(69);
    e.exports = function(e, t, n, p, _, h) {
        var v = r[e],
            y = v,
            b = _ ? "set" : "add",
            C = y && y.prototype,
            T = {},
            E = function(e) {
                var t = C[e];
                i(C, e, "delete" == e ? function(e) {
                    return h && !c(e) ? !1 : t.call(this, 0 === e ? 0 : e)
                } : "has" == e ? function(e) {
                    return h && !c(e) ? !1 : t.call(this, 0 === e ? 0 : e)
                } : "get" == e ? function(e) {
                    return h && !c(e) ? void 0 : t.call(this, 0 === e ? 0 : e)
                } : "add" == e ? function(e) {
                    return t.call(this, 0 === e ? 0 : e), this
                } : function(e, n) {
                    return t.call(this, 0 === e ? 0 : e, n), this
                })
            };
        if ("function" == typeof y && (h || C.forEach && !d(function() {
                (new y)
                .entries()
                    .next()
            }))) {
            var w = new y,
                S = w[b](h ? {} : -0, 1) != w,
                k = d(function() {
                    w.has(1)
                }),
                P = g(function(e) {
                    new y(e)
                }),
                I = !h && d(function() {
                    for (var e = new y, t = 5; t--;) e[b](t, t);
                    return !e.has(-0)
                });
            P || (y = t(function(t, n) {
                u(t, y, e);
                var r = m(new v, t, y);
                return void 0 != n && l(n, _, r[b], r), r
            }), y.prototype = C, C.constructor = y), (k || I) && (E("delete"), E("has"), _ && E("get")), (I || S) && E(b), h && C.clear && delete C.clear
        } else y = p.getConstructor(t, e, _, b), o(y.prototype, n), s.NEED = !0;
        return f(y, e), T[e] = y, a(a.G + a.W + a.F * (y != v), T), h || p.setStrong(y, e, _), y
    }
}, function(e, t, n) {
    var r = n(10)("iterator"),
        a = !1;
    try {
        var i = [7][r]();
        i["return"] = function() {
            a = !0
        }, Array.from(i, function() {
            throw 2
        })
    } catch (o) {}
    e.exports = function(e, t) {
        if (!t && !a) return !1;
        var n = !1;
        try {
            var i = [7],
                o = i[r]();
            o.next = function() {
                n = !0
            }, i[r] = function() {
                return o
            }, e(i)
        } catch (s) {}
        return n
    }
}, function(e, t, n) {
    var r = n(18),
        a = n(70)
        .set;
    e.exports = function(e, t, n) {
        var i, o = t.constructor;
        return o !== n && "function" == typeof o && (i = o.prototype) !== n.prototype && r(i) && a && a(e, i), e
    }
}, function(e, t, n) {
    var r = n(18),
        a = n(17),
        i = function(e, t) {
            if (a(e), !r(t) && null !== t) throw TypeError(t + ": can't set as prototype!")
        };
    e.exports = {
        set: Object.setPrototypeOf || ("__proto__" in {} ? function(e, t, r) {
            try {
                r = n(34)(Function.call, n(71)
                    .f(Object.prototype, "__proto__")
                    .set, 2), r(e, []), t = !(e instanceof Array)
            } catch (a) {
                t = !0
            }
            return function(e, n) {
                return i(e, n), t ? e.__proto__ = n : r(e, n), e
            }
        }({}, !1) : void 0),
        check: i
    }
}, function(e, t, n) {
    var r = n(72),
        a = n(24),
        i = n(42),
        o = n(23),
        s = n(25),
        l = n(19),
        u = Object.getOwnPropertyDescriptor;
    t.f = n(20) ? u : function(e, t) {
        if (e = i(e), t = o(t, !0), l) try {
            return u(e, t)
        } catch (n) {}
        return s(e, t) ? a(!r.f.call(e, t), e[t]) : void 0
    }
}, function(e, t) {
    t.f = {}.propertyIsEnumerable
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function a(e) {
        return e.resync_in_process ? e.resync_in_process : Promise.resolve(!1)
    }

    function i(e) {
        if (!e.renew_hashes) {
            var t = e.last_hashes_update || 0;
            if (Date.now() - t < 1e4) return Promise.resolve();
            var n = Object.keys(e.tabs)
                .filter(function(t) {
                    return (0, ut.isFullyLoadedTab)(e, t)
                });
            e.renew_hashes = (0, at.post)(ct, {
                    act: "a_renew_hash",
                    peers: n.join(","),
                    gid: e.gid
                })
                .then(function(t) {
                    var r = rt(t, 1),
                        a = r[0];
                    return n.forEach(function(t) {
                        e.tabs[t].hash = a[t]
                    }), delete e.renew_hashes, e.last_hashes_update = Date.now(), e
                })
        }
        return e.renew_hashes
    }

    function o(e, t, n) {
        return a(e)
            .then(function(r) {
                return r ? t.apply(null, n) : i(e)
                    .then(function(e) {
                        return t.apply(null, n)
                    })
            })
    }

    function s(e) {
        return function() {
            var t = arguments,
                n = t[t.length - 1];
            return e.apply(null, t)["catch"](function(r) {
                if (r && r.match && r.match(/1001;/)) return o(n, e, t);
                throw r
            })
        }
    }

    function l(e) {
        return "string" == typeof e ? se("<div>" + e + "</div>") : e
    }

    function u(e) {
        return "string" == typeof e ? e : e.innerHTML
    }

    function c(e, t, n, r) {
        return r.tabHistoryNotChanged = !1, (0, at.post)(ct, {
                act: "a_start",
                peer: e,
                msgid: n,
                history: t,
                gid: r.gid
            })
            .then(function(t) {
                var a = rt(t, 1),
                    i = a[0];
                if (r.tabs || (r.tabs = {}), r.tabs[e] || (r.tabs[e] = {}), n) {
                    if (r.tabs[e]) {
                        var o = r.tabs[e].lastmsg,
                            s = r.tabs[e].lastmsg_meta;
                        extend(r.tabs[e], i), r.tabs[e].lastmsg = o, r.tabs[e].lastmsg_meta = s
                    }
                } else extend(r.tabs[e], i);
                r.imQueue(e, !1);
                return g(e, r)
            })
    }

    function d(e, t) {
        return Object.keys(e.msgs)
            .filter(function(n) {
                return intval(e.msgs[n][4]) === t
            })
            .length > 0
    }

    function g(e, t) {
        var n = t.imQueue(e, !1),
            r = t.tabs[e],
            a = n.filter(function(e) {
                return !d(r, e.rid)
            });
        return r.msgs = a.reduce(function(e, t) {
            return e["rid" + t.rid] = [1, 0, 0, 1, intval(t.rid)], e
        }, r.msgs), t.imQueueSet(e, a), t.tabs[e].history = (0, ut.restoreQueue)(a, t, l(t.tabs[e].history)), Promise.resolve(t)
    }

    function f(e, t, n) {
        var r = n.imQueue(e, !1)
            .filter(function(e) {
                return e.failed && e.mess.messageId !== t
            });
        return n.imQueueSet(e, r), n.tabs[e].history = (0, ut.removeMessages)([t], l(n.tabs[e].history)), Promise.resolve(n)
    }

    function m(e) {
        return "im_draft" + vk.id + "_" + e
    }

    function p(e) {
        return "im_draft" + vk.id + "_" + e
    }

    function _(e) {
        return "peerFwd_" + vk.id + "_" + e
    }

    function h(e, t) {
        var n = t.peer;
        return Promise.resolve(t)
            .then(function(t) {
                return t.tabHistoryNotChanged = !1, (0, ut.isFullyLoadedTab)(t, n) && !t.tabs[n].skipped ? Promise.resolve(t)
                    .then(b) : c(n, e, !1, t)
            })
            .then(b)
    }

    function v(e, t, n) {
        var r = n.msgid,
            a = n.peer;
        return !e && (0, ut.isFullyLoadedTab)(n, a) && n.tabs[a].msgs[r] ? (t === n.peer ? n.tabHistoryNotChanged = !0 : n.tabHistoryNotChanged = !1, Promise.resolve(n)
                .then(b)) : c(a, !0, r, n)
            .then(b)
    }

    function y(e, t, n) {
        if (We(n)) throw showFastBox({
            title: getLang("global_error"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, getLang("mail_message_wait_until_uploaded")), new Error("Cant change peer while loading somethind");
        return n.prevPeer = n.peer, n.peer = e, n.msgid = t || "", cur.peer = e, (0, it.updateLocation)({
            sel: (0, ut.convertPeerToUrl)(e),
            msgid: n.msgid,
            email: ""
        }), de(n.prevPeer, n)
    }

    function b(e) {
        var t = e.peer,
            n = e.tabs[t],
            r = n.data,
            a = [],
            i = e.mutedPeers;
        n.offset && a.push("photos"), n.offset && a.push("search"), (-2e9 > t || n.offset) && a.push("clear"), !(0, ut.isChatPeer)(t) || r.kicked || r.closed || (inArray(t,
            i) ? a.push("unmute") : a.push("mute")), (0, ut.isUserPeer)(t) && !e.gid && !n.blacklisted && n.is_friend && a.push("invite");
        var o = r ? r.actions : {},
            s = (0, ut.chatActions)(e, o);
        return (0, ut.isChatPeer)(t) && n.data.closed && (delete s.invite, o = extend({}, o), delete o.invite), e.curActions = a.concat(Object.keys(o))
            .sort(function(e, t) {
                return gt[e] - gt[t]
            })
            .reduce(function(e, t) {
                return e[t] = s[t], e
            }, {}), Promise.resolve(e)
    }

    function C(e, t, n) {
        var r = n.tabs[n.peer];
        return (0, at.post)(ct, {
                peer: n.peer,
                whole: e,
                act: "a_history",
                offset: r.offset + (r.skipped || 0),
                toend: t,
                gid: n.gid
            })
            .then(function(e) {
                var t = rt(e, 5),
                    a = t[0],
                    i = t[1],
                    o = t[2];
                t[3], t[4];
                return r.allShown = o, r.history = a + u(r.history), r.historyToAppend = a, r.offset += Object.keys(i)
                    .length, r.msgs = extend(r.msgs, i), n
            })
    }

    function T(e) {
        var t = e.tabs[e.peer];
        return (0, at.post)(ct, {
                peer: e.peer,
                act: "a_history",
                rev: 1,
                offset: t.skipped,
                gid: e.gid
            })
            .then(function(n) {
                var r = rt(n, 5),
                    a = r[0],
                    i = r[1],
                    o = r[2];
                r[3], r[4];
                return t.allShown = o, t.history = u(t.history) + a, t.historyToAppend = a, t.skipped -= Object.keys(i)
                    .length, t.msgs = extend(t.msgs, i), e
            })
    }

    function E(e, t, n, r) {
        var a = e.tabs[t];
        for (var i in a.msgs) {
            var o = a.msgs[i][0] ? ot.eventTypes.FLAG_OUTBOUND : 0;
            n >= i && o === r && (a.msgs[i][1] = 0)
        }
        return e
    }

    function w(e, t) {
        var n = t.tabs[e],
            r = 0;
        for (var a in n.msgs) !n.msgs[a][0] && intval(a) > n.in_up_to && (r += n.msgs[a][1]);
        return r
    }

    function S(e, t, n) {
        var r = e.tabs[t];
        return r.unread = w(t, e) + n, e
    }

    function k(e) {
        return (0, at.post)(ct, {
                act: "a_get_key",
                uid: e.id,
                gid: e.gid
            })
            .then(function(t) {
                var n = rt(t, 3),
                    r = n[0],
                    a = n[1],
                    i = n[2];
                return extend({}, e, {
                    imKey: r,
                    imUrl: a,
                    imPart: i
                })
            })
    }

    function P(e) {
        return (0, at.post)(ct, {
                act: "a_get_ts",
                gid: e.gid
            })
            .then(function(t) {
                var n = rt(t, 1),
                    r = n[0];
                return extend({}, e, {
                    imTs: r
                })
            })
    }

    function I(e) {
        var t = geByClass1("_im_unread_bar_row", e);
        return t && t.parentNode.removeChild(t), e
    }

    function A(e, t, n) {
        var r = n.tabs[e];
        return r.msgs[t.messageId] && (r.msgs[t.messageId][3] = 1, r.history = (0, ut.setMessageError)(e, t, l(r.history))), Promise.resolve(n)
    }

    function L(e, t, n) {
        var r = n.tabs[e];
        return r.msgs[t] && (r.msgs[t][3] = 0, r.history = (0, ut.startResendMessage)(e, t, l(r.history))), Promise.resolve(n)
    }

    function M(e, t) {
        var n = e.peerId;
        if ((0, ut.isTabLoaded)(t, n)) {
            var a = t.tabs[n];
            if ((0, ut.isFullyLoadedTab)(t, n)) {
                var i = l(a.history);
                a.skipped > 0 && a.skipped++, a.offset++, a.history = (0, ut.appendToHistory)(t, e, i);
                var o = e.flags & ot.eventTypes.FLAG_UNREAD ? 1 : 0,
                    s = e.flags & ot.eventTypes.FLAG_OUTBOUND && !(0, ut.isSelfMessage)(e.peerId) ? 1 : 0,
                    u = e.flags & ot.eventTypes.FLAG_IMPORTANT ? 1 : 0;
                a.msgs[e.messageId] = [s, o, u]
            }
            return !t.msg_local_ids_sort && e.local ? t.msg_local_ids_sort = r({}, e.messageId, 0) : e.local && (t.msg_local_ids_sort[e.messageId] = Object.keys(t.msg_local_ids_sort)
                    .length), a.typing && a.typing[e.userId] && delete a.typing[e.userId], a.lastmsg = e.messageId, a.lastmsg_meta = e, e.flags & ot.eventTypes.FLAG_OUTBOUND ?
                a.unread = 0 : (!a.unread && x(t, 1, e.peerId), a.unread++), t.all_dialogs.length > 0 && (t.all_dialogs = [n].concat(t.all_dialogs.filter(function(e) {
                    return e !== n
                }))), a.unread > 0 && (t.unread_dialogs = [n].concat(t.unread_dialogs.filter(function(e) {
                    return e !== n
                }))), Promise.resolve(t)
        }
        return c(n, !1, !1, t)
            .then(function(e) {
                return e.all_dialogs.length > 0 && (e.all_dialogs = (0, lt.arrayUnique)([n].concat(e.all_dialogs))), e.tabs[n].unread > 0 && (e.unread_dialogs = (0, lt
                    .arrayUnique)([n].concat(e.unread_dialogs))), e
            })
    }

    function x(e, t, n) {
        e.cur_unread_cnt || (e.cur_unread_cnt = {}), -1 === t && delete e.cur_unread_cnt[n], e.unread_cnt += t
    }

    function O(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = n.unread;
            t = E(t, e.peerId, e.upToId, 0), t = S(t, e.peerId, intval(n.skipped)), r > 0 && !n.unread && x(t, -1, e.peerId), n.in_up_to = e.upToId, n.out_up_to < e.upToId &&
                (n.out_up_to = e.upToId), n.lastmsg_meta.messageId <= e.upToId && !(n.lastmsg_meta.flags & ot.eventTypes.FLAG_OUTBOUND) && (n.lastmsg_meta.flags ^= ot.eventTypes
                    .FLAG_UNREAD), n.history = I(l(n.history))
        } else(0, ut.isTabLoaded)(t, e.peerId) && (t.tabs[e.peerId].unread > 0 && x(t, -1, e.peerId), t.tabs[e.peerId].unread = 0, t.tabs[e.peerId].in_up_to = e.upToId);
        return (0, ut.isTabLoaded)(t, e.peerId) && (t.unread_dialogs = t.unread_dialogs.filter(function(t) {
            return intval(t) !== e.peerId
        })), 0 === t.unread_cnt && t.unread_only ? qe(t) : Promise.resolve(t)
    }

    function D(e, t) {
        if ((0, ut.isTabLoaded)(t, e.peerId)) {
            var n = t.tabs[e.peerId];
            n.out_up_to = e.upToId, n.lastmsg_meta.messageId <= e.upToId && n.lastmsg_meta.flags & ot.eventTypes.FLAG_OUTBOUND && (n.lastmsg_meta.flags ^= ot.eventTypes.FLAG_UNREAD)
        }
        if ((0, ut.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = l(n.history);
            n.history = (0, ut.markMessagesAsRead)(t, e.peerId, r)
        }
        return Promise.resolve(t)
    }

    function B(e, t, n, r) {
        return r.text = {
            attachedFiles: 0
        }, r.imQueue = e, r.imQueueResend = t, r.imQueueSet = n, Promise.resolve(r)
    }

    function F(e, t) {
        var n = rt(e, 3),
            r = n[0],
            a = n[1],
            i = n[2];
        t.text.attachedFiles++, t._attach_cache || (t._attach_cache = {}), i ? t._attach_cache[r + a] = i : i = t._attach_cache[r + a];
        var o = t.peer;
        if ((0, ut.isFullyLoadedTab)(t, o)) {
            var s = t.tabs[o];
            s.attaches || (s.attaches = []);
            var l = ls.get(m(o)) || {};
            r !== !1 ? (s.attaches.push([r, a, i, s.attaches.length]), ls.set(m(o), extend({
                txt: ""
            }, l, {
                medias: s.attaches
            }))) : r === !1 && "undefined" != typeof a && (s.attaches = s.attaches.filter(function(e) {
                return e[3] !== a
            }), ls.set(m(o), extend({
                txt: ""
            }, l, {
                medias: s.attaches
            })))
        }
        return Promise.resolve(t)
    }

    function N(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            n.attaches = [];
            var r = ls.get(m(e)) || {};
            ls.set(m(e), extend({
                txt: ""
            }, r, {
                medias: []
            }))
        }
        return Promise.resolve(t)
    }

    function j(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            if (!n.attaches || !n.attaches.length) {
                var r = ls.get(m(e)) || {};
                n.attaches = r.medias || []
            }
        }
        return Promise.resolve(t)
    }

    function R(e, t) {
        return e.set(j.bind(null, t))
            .then(function(e) {
                return (0, ut.isFullyLoadedTab)(e.get(), t) ? e.get()
                    .tabs[t].attaches : []
            })
    }

    function U(e, t) {
        var n = t.tabs[t.peer];
        return t.tabs = Object.keys(e)
            .reduce(function(n, r) {
                var a = t.tabs[r] ? t.tabs[r].msgs : {},
                    i = extend({}, a || {}, e[r].msgs || {});
                return n[r] = extend(t.tabs[r] || {}, e[r]), i && (n[r].msgs = i), n
            }, t.tabs), t.tabs[t.peer] = n, Promise.resolve(t)
    }

    function H(e, t, n) {
        return (0, ut.isTabLoaded)(n, e) && (n.tabs[e].online = t), Promise.resolve(n)
    }

    function G(e, t, n) {
        return (0, ut.isTabLoaded)(n, e) && (n.tabs[e].typing = extend(n.tabs[e].typing, r({}, t, Date.now()))), Promise.resolve(n)
    }

    function z(e, t, n) {
        return (0, st.pause)(dt + 2)
            .then(function() {
                if ((0, ut.isTabLoaded)(n, e)) {
                    var r = n.tabs[e];
                    if (r.typing) {
                        var a = Date.now() - (r.typing[t] || 0);
                        a >= 1e3 * dt && delete r.typing[t]
                    }
                }
                return n
            })
    }

    function q(e, t, n) {
        if ((0, ut.isFullyLoadedTab)(n, e)) {
            t = clean(t), n.tabs[e].imdraft = t;
            var r = ls.get(p(e)) || {};
            ls.set(p(e), extend(r, {
                txt: t
            }))
        }
        return Promise.resolve(n)
    }

    function Q(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            if (!n.imdraft) {
                var r = ls.get(p(e));
                r && r.txt && (n.imdraft = r.txt)
            }
            return Promise.resolve(n.imdraft || "")
        }
        return Promise.resolve("")
    }

    function K(e, t) {
        t.selectedMessages || (t.selectedMessages = []);
        var n = t.selectedMessages.filter(function(t) {
            return t !== e
        });
        return n.length !== t.selectedMessages.length ? t.selectedMessages = n : t.selectedMessages.push(e), Promise.resolve(t)
    }

    function W(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function V(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function Z(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = t.imQueue(e.peerId)
                .filter(function(t) {
                    return t.failed && t.rid !== e.randomId
                });
            t.imQueueSet(e.peerId, r), n.history = (0, ut.replaceMessageAttrs)(t, l(n.history), e), n.lastmsg_meta = e, n.lastmsg = e.messageId;
            var a = n.msgs["rid" + e.randomId];
            a && (n.msgs[e.messageId] = a, delete n.msgs["rid" + e.randomId])
        }
        return Promise.resolve(t)
    }

    function Y(e, t) {
        return Promise.resolve()
    }

    function $(e, t) {
        return (0, at.post)(ct, {
                act: "a_get_media",
                id: e.messageId,
                gid: t.gid
            })
            .then(function(n) {
                var r = rt(n, 3),
                    a = r[0],
                    i = r[1],
                    o = r[2],
                    s = t.tabs[e.peerId];
                return s.mediacontent || (s.mediacontent = {}), s.mediacontent[e.messageId] = [a, i, o], X(e, t)
            })
    }

    function X(e, t) {
        var n = t.tabs[e.peerId];
        return n.history = (0, ut.replaceAttaches)(l(n.history), e, t), Promise.resolve(t)
    }

    function J(e, t, n) {
        var r = (0, ut.dayFromVal)(t),
            a = n.tabs[e];
        return a.searchDay = r, a.searchOffset = 0, a.searchAllLoaded = !1, Promise.resolve(n)
    }

    function ee(e, t, n) {
        if (t) {
            var r = n.tabs[t];
            r.searchText = e, r.searchOffset = 0, r.searchAllLoaded = !1
        } else n.searchText = e, n.searchOffset = 0, n.searchAllLoaded = !1;
        return Promise.resolve(n)
    }

    function te(e, t, n, r) {
        return (0, at.post)(ct, {
                act: "a_hints",
                str: e,
                gid: r.gid,
                query: n,
                peerIds: t.join(",")
            })
            .then(function(e) {
                var t = rt(e, 1),
                    n = t[0];
                return r.tabs_cache = extend({}, r.tabs_cache, n), Object.keys(n)
                    .sort(function(e, t) {
                        return n[e].order - n[t].order
                    })
                    .map(function(e) {
                        return n[e]
                    })
            })
    }

    function ne(e, t, n, r) {
        return te(e, t, n, r)
            .then(function(e) {
                return e.map(function(e) {
                    return {
                        peerId: e.peerId,
                        name: e.tab,
                        photo: e.photo,
                        lastmsg: e.lastmsg,
                        online: e.online
                    }
                })
            })
    }

    function re(e, t) {
        return function(n, r) {
            return e(r)
                .then(function(e) {
                    var r;
                    return r = n === !1 ? e.list : e.search(n), r.sort(t)
                        .map(function(e) {
                            return {
                                peerId: e[0],
                                name: e[1],
                                photo: e[2],
                                lastmsg: e[3],
                                href: e[4],
                                online: e[5],
                                is_friend: e[6],
                                rating: e[7],
                                local_index: !0
                            }
                        })
                })
        }
    }

    function ae(e) {
        var t;
        return e.friendsTree = new Promise(function(e) {
                t = e
            }), (0, at.post)(ct, {
                act: "a_dialogs_preload",
                gid: e.gid
            })
            .then(function(n) {
                var r = rt(n, 1),
                    a = r[0],
                    i = Object.keys(a)
                    .map(function(e) {
                        return a[e]
                    });
                return new vkIndexer(i, function(e) {
                    return e[1]
                }, t), e
            })
    }

    function ie(e) {
        var t;
        e.hintsTree = new Promise(function(e) {
            t = e
        });
        var n = Object.keys(e.hints_preloaded)
            .map(function(t) {
                return e.hints_preloaded[t]
            });
        return new vkIndexer(n, function(e) {
            return e[1]
        }, t), Promise.resolve(e)
    }

    function oe(e) {
        var t = e.unread_only;
        return (0, at.post)("al_im.php", {
                act: "a_get_dialogs",
                offset: e.offset,
                unread: t ? 1 : "",
                gid: e.gid,
                type: e.gfilter
            })
            .then(function(n) {
                var r = rt(n, 2),
                    a = r[0],
                    i = r[1];
                return U(i, e), t ? e.unread_dialogs = e.unread_dialogs.concat(Object.keys(i)
                    .map(intval)) : e.all_dialogs = e.all_dialogs.concat(Object.keys(i)
                    .map(intval)), e.offset = a.offset, e.dialogsAll = !a.has_more, Promise.resolve(e)
            })
    }

    function le(e, t) {
        return (0, at.post)(ct, {
                act: "a_search",
                q: e,
                from: "all",
                gid: t.gid,
                offset: t.searchOffset || 0
            })
            .then(function(n) {
                var r = rt(n, 4),
                    a = r[0],
                    i = r[1],
                    o = r[2],
                    s = r[3];
                return e === t.searchText && (t.searchOffset = o, t.searchAllLoaded = s), [a, i]
            })
    }

    function ue(e, t) {
        var n = t.tabs[e];
        return n.searchAllLoaded
    }

    function ce(e, t) {
        if (t.peer === e && (0, ut.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.inplaceSearch
        }
        return !1
    }

    function de(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.inplaceSearch, delete n.searchOffset, delete n.searchAllLoaded, delete n.searchText, delete n.searchDay
        }
        return Promise.resolve(t)
    }

    function ge(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.searchDay, n.searchOffset = 0, n.searchAllLoaded = !1
        }
        return Promise.resolve(t)
    }

    function fe(e, t) {
        var n = t.tabs[e];
        return n.inplaceSearch = !0, Promise.resolve(t)
    }

    function me(e, t) {
        var n = t.tabs[e],
            r = "";
        if (fe(e, t), n.searchDay && (r = "day:" + n.searchDay), !r && !n.searchText) return Promise.reject();
        var a = "in:" + e + " " + r + " " + (n.searchText || "");
        return (0, at.post)(ct, {
                act: "a_search",
                q: a,
                from: "in",
                gid: t.gid,
                offset: n.searchOffset || 0
            })
            .then(function(e) {
                var t = rt(e, 3),
                    r = t[0],
                    a = t[1],
                    i = t[2];
                return n.searchOffset = a, n.searchAllLoaded = i, r
            })
    }

    function pe(e) {
        return (0, at.post)(ct, {
            act: "a_important",
            offset: e,
            gid: data.gid,
            part: e > 0
        })
    }

    function _e(e, t, n) {
        var t = n.peer;
        if ((0, ut.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted = r.deleted ? r.deleted.concat(e) : e, r.history = (0, ut.removeMessages)(e, l(r.history)), r.offset -= e.filter(function(e) {
                    return r.msgs[e]
                })
                .length, e.forEach(function(e) {
                    return delete r.msgs[e]
                })
        }
        return Promise.resolve(n)
    }

    function he(e, t, n, r) {
        return (0, at.post)(ct, {
            act: "a_mark",
            peer: t,
            hash: n,
            gid: data.gid,
            msgs_ids: e.join(","),
            mark: r
        })
    }

    function ve(e, t, n, r) {
        if ((0, ut.isFullyLoadedTab)(r, t)) {
            var a = r.tabs[t];
            a.deleted = a.deleted ? a.deleted.concat(e) : e, a.history = (0, ut.removeMessagesWithRestore)(e, t, n, l(a.history)), a.offset -= e.filter(function(e) {
                    return a.msgs[e]
                })
                .length
        }
        return Promise.resolve(r)
    }

    function ye(e, t, n) {
        if ((0, ut.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted && (r.deleted = r.deleted.filter(function(t) {
                return t !== e
            })), r.history = (0, ut.restoreMessage)(e, t, l(r.history)), r.offset++
        }
        return Promise.resolve(n)
    }

    function be(e, t, n) {
        return (0, at.post)(ct, {
            act: "a_restore",
            id: e,
            peer: t,
            hash: n,
            gid: data.gid
        })
    }

    function Ce(e, t) {
        return t.msgid = e, Promise.resolve(t)
    }

    function Te(e, t, n) {
        if ((0, ut.isFullyLoadedTab)(n, t)) {
            n.pendingForward = [];
            var r = n.tabs[t];
            r.fwdMessages = e, ls.set(_(t), e)
        }
        return Promise.resolve(n)
    }

    function Ee(e, t) {
        if ((0, ut.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.fwdMessages || (n.fwdMessages = ls.get(_(e)) || []), Promise.resolve(n.fwdMessages)
        }
        return Promise.resolve([])
    }

    function we(e, t) {
        return t.pendingForward = e, Promise.resolve(t)
    }

    function Se(e, t, n) {
        return n.tabs[e].tab = t, Promise.resolve(n)
    }

    function ke(e, t, n) {
        var r = Object.keys(e)
            .map(function(t) {
                return t + ":" + e[t].join(",")
            })
            .join(";");
        return t.pause(), (0, at.post)(ct, {
                act: "a_load_member",
                need: r
            })
            .then(function(e) {
                var r = rt(e, 1),
                    a = r[0];
                return t.resume(), Object.keys(a)
                    .forEach(function(e) {
                        var t = a[e];
                        Object.keys(t)
                            .forEach(function(r) {
                                t[r] && (n.tabs[e].data.members[r] = t[r])
                            })
                    }), n
            })
    }

    function Pe(e, t, n) {
        var r = e.filter(function(e) {
                return e.kludges.source_act === ut.CHAT_INVITE_USER
            })
            .filter(function(e) {
                return !n.tabs[e.peerId].data.members[e.kludges.source_mid]
            })
            .reduce(function(e, t) {
                var n = t.kludges.source_mid;
                return e[t.peerId] || (e[t.peerId] = []), inArray(n, e[t.peerId]) || e[t.peerId].push(n), e
            }, {});
        return Object.keys(r) > 0 ? ke(r, t, n) : Promise.resolve(n)
    }

    function Ie(e, t, n, r) {
        var a = r.tabs[n];
        if (t !== vk.id) return Promise.resolve(r);
        if ((0, ut.isTabLoaded)(r, n)) {
            if (e === ut.CHAT_KICK_USER) {
                var a = r.tabs[n];
                a.data.closed = !0, delete a.data.actions.leave, delete a.data.actions.avatar, delete a.data.actions.topic, delete a.data.actions.mute, delete a.data.actions
                    .unmute, t === vk.id && (a.data.actions["return"] = getLang("mail_return_to_chat"))
            } else e === ut.CHAT_INVITE_USER && (a.data.closed = !1, delete a.data.actions["return"], a.data.actions.leave = getLang("mail_leave_chat"), a.data.actions.avatar =
                getLang("mail_update_photo"), a.data.actions.topic = getLang("mail_change_topic"), a.data.actions.mute = getLang("mail_im_mute"), a.data.actions.unmute =
                getLang("mail_im_unmute"));
            r = r.peer === n ? b(r) : Promise.resolve(r)
        }
        return r
    }

    function Ae(e, t, n) {
        var r = n.mutedPeers.filter(function(t) {
            return t !== e
        });
        return t && r.push(e), n.mutedPeers = r, b(n)
    }

    function Le(e, t, n) {
        return (0, ut.isTabLoaded)(n, e) && delete n.tabs[e].data.members[t], Promise.resolve(n)
    }

    function Me(e, t) {
        return t.stack = e, Promise.resolve(t)
    }

    function xe(e, t, n, r) {
        if ((0, ut.isFullyLoadedTab)(r, t)) {
            var a = r.tabs[t];
            e.filter(function(e) {
                    return a.msgs[e]
                })
                .forEach(function(e) {
                    a.msgs[e][2] = n
                })
        }
        return Promise.resolve(r)
    }

    function Oe(e, t, n) {
        n.importants || (n.importants = {});
        var r = n.importants[t] || 0;
        return r !== e && (n.important_cnt += e, n.importants[t] = e), Promise.resolve(n)
    }

    function De(e) {
        return (0, at.post)(ct, {
            act: "a_spam",
            offset: e,
            gid: data.gid,
            part: e > 0
        })
    }

    function Be(e) {
        return (0, at.post)(ct, {
            act: "a_flush_spam",
            gid: data.gid,
            hash: e
        })
    }

    function Fe(e, t, n) {
        return n.creationType = e, n.creationFilter = t, Promise.resolve(n)
    }

    function Ne(e, t) {
        return (0, at.post)(ct, {
            act: "a_owner_photo",
            photo: JSON.parse(e)
                .data[0],
            peer: t
        })
    }

    function je(e, t) {
        return t.next_chat_avatar = e, Promise.resolve(t)
    }

    function Re(e, t, n) {
        return (0, at.post)("al_page.php", {
                act: "owner_photo_save",
                peer: e,
                _query: t
            })
            .then(function(e) {
                return n
            })
    }

    function Ue(e, t, n, r) {
        return r.creating = !0, (0, at.post)(ct, {
                act: "a_multi_start",
                hash: r.writeHash,
                peers: t.join(","),
                title: n
            })
            .then(function(e) {
                var t = rt(e, 1),
                    n = t[0];
                return r.next_peer = n.peer, r
            })
            .then(function(t) {
                return e ? Re(t.next_peer, e, t) : t
            })
            .then(function(e) {
                return e.creating = !1, e
            })["catch"](function(e) {
                throw r.creating = !1, e
            })
    }

    function He(e) {
        var t;
        e.resync_in_process = new Promise(function(e) {
            t = e
        });
        var n = Object.keys(e.tabs)
            .length;
        return (0, at.post)(ct, {
                act: "a_resync",
                sel: e.peer,
                gid: e.gid,
                unread: 0,
                loaded: n
            })
            .then(function(a) {
                var i = rt(a, 2),
                    o = i[0],
                    s = i[1];
                if ((0, lt.lplog)("Resync success", "success"), console.log(o, s, "resync data"), Object.keys(o)
                    .length < n && 100 !== Object.keys(o)
                    .length) throw new Error("Not full data from server, retry");
                var u, c = e.peer;
                return u = (0, ut.isReservedPeer)(c) ? Promise.resolve(!1) : U(r({}, c, o[c]), {
                    tabs: r({}, c, e.tabs[c])
                }), u.then(function(n) {
                    return e.tabs = o, n && (e.tabs[c] = n.tabs[c], e.tabs[c].history = (0, ut.restoreQueue)(c, e, l(e.tabs[c].history))), e.loadingDialogs = !
                        1, e.offset = Object.keys(o)
                        .length, e.mutedPeers = s.mutedPeers, e.lastDialogsOptions = {
                            has_more: s.has_more
                        }, e.all_dialogs = Object.keys(e.tabs)
                        .map(intval), e.unread_tabs = Object.keys(e.tabs)
                        .filter(function(e) {
                            return e.unread > 0
                        })
                        .map(intval), delete e.resync_in_process, setTimeout(t.bind(null, !0), 0), Ve(intval(s.cnts[0]), e)
                })
            })["catch"](function(t) {
                return (0, lt.lplog)("Resync error: " + t.message + " " + t.stack, "error"), (0, st.pause)(2)
                    .then(He.bind(null, e))
            })
    }

    function Ge(e, t, n, r) {
        if ((0, ut.isTabLoaded)(r, e)) {
            var a = r.tabs[e].data.members[n];
            t == n ? a.closed = 1 : a.kicked = 1, n === vk.id && t != n && (r.tabs[e].data.kicked = 1)
        }
        return Promise.resolve(r)
    }

    function ze(e) {
        return e.all_dialogs.filter(function(t) {
            return e.tabs[t].unread > 0
        })
    }

    function qe(e) {
        return e.unread_only = !e.unread_only, e.unread_only ? (e.offset = e.unread_dialogs.length, 0 === e.offset && (e.unread_dialogs = ze(e)), e.offset = e.unread_dialogs
            .length) : e.offset = e.all_dialogs.length, (0, it.updateLocation)({
            unread: e.unread_only ? "1" : ""
        }), e.unread_only && e.dialogsAll && (e.dialogsAllAll = !0), e.dialogsAllAll ? e.unread_dialogs = ze(e) : e.dialogsAll = !1, Promise.resolve(e)
    }

    function Qe(e, t) {
        return t.delayed_message = e, Promise.resolve(t)
    }

    function Ke() {
        return window.Upload && Upload.options ? Object.keys(Upload.options)
            .map(function(e) {
                return Upload.options[e]
            })
            .filter(function(e) {
                return e.xhr && 4 !== e.xhr.readyState && 0 !== e.xhr.readyState
            })
            .length > 0 : !1
    }

    function We(e) {
        var t = e.textMediaSelector;
        return !!t.urlAttachmentLoading || Ke()
    }

    function Ve(e, t) {
        return t.unread_cnt = e, Promise.resolve(t)
    }

    function Ze(e, t) {
        return t.ctrl_submit = !!e, (0, at.post)(ct, {
                act: "a_save_ctrl_submit",
                to: t.peer,
                hash: t.tabs[t.peer].hash,
                value: e ? 1 : 0
            })
            .then(function(e) {
                return t
            })
    }

    function Ye(e) {
        return "bind_to_url_store_" + e
    }

    function $e(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach || (n.bind_url_to_attach = ls.get(Ye(e)) || {}), Promise.resolve(n.bind_url_to_attach)
    }

    function Xe(e, t, n, r, a) {
        return $e(e, a)
            .then(function(i) {
                return i[r] = [t, n], ls.set(Ye(e), i), Promise.resolve(a)
            })
    }

    function Je(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach = {}, ls.set(Ye(e), {}), Promise.resolve(t)
    }

    function et(e, t, n) {
        return function() {
            n.update_old_title = e;
            var r = Object.keys(n.cur_unread_cnt)
                .length;
            if (0 === r) return document.title = e ? e : document.title, setFavIcon("/images/icons/favicons/fav_im" + t + ".ico"), clearInterval(n.update_title_to),
                void(n.update_title_to = !1);
            if (e) document.title = e, setFavIcon("/images/icons/favicons/fav_im" + t + ".ico"), e = !1;
            else {
                e = document.title;
                var a = r > 9 ? 10 : r;
                setFavIcon("/images/icons/favicons/fav_im" + a + t + ".ico"), document.title = winToUtf(getLang("mail_im_new_messages", r))
            }
        }
    }

    function tt(e, t, n) {
        n.cur_unread_cnt || (n.cur_unread_cnt = {}), t && !inArray(e, n.mutedPeers) && (n.cur_unread_cnt[e] = !0);
        var r = document.title,
            a = window.devicePixelRatio >= 2 ? "_2x" : "";
        if (t && !n.update_title_to) {
            var i = et(r, a, n);
            n.update_title_to = setInterval(i, 1e3), i()
        } else !t && n.update_old_title && (document.title = n.update_old_title, n.cur_unread_cnt = {}, r = !1, n.update_old_title = !1, setFavIcon(
            "/images/icons/favicons/fav_im" + a + ".ico"), clearInterval(n.update_title_to), n.update_title_to = !1);
        return Promise.resolve(n)
    }

    function nt(e, t, n) {
        return (0, ut.isFullyLoadedTab)(n, e) && (n.tabs[e].scrollBottom = t), Promise.resolve(n)
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.favMessage = t.toggleMutePeer = t.returnToChat = t.leaveChat = t.updateChatPhoto = t.addNewMember = t.updateChatTopic = t.flushHistory = t.sendTyping = t.searchLocalHints =
        t.searchFriends = t.deliverMessage = t.readLastMessages = t.ACTION_PRIORITIES = t.TYPING_PERIOD = void 0;
    var rt = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.strHistory = u, t.loadPeer = c, t.restoreHistoryQueue = g, t.removeFailed = f, t.selectPeer = h, t.selectPeerOnMessage = v, t.changePeer = y, t.setActions = b, t.loadMoreHistory =
        C, t.loadLessHistory = T, t.countUnread = w, t.loadLongPollKey = k, t.loadLongPollTs = P, t.removeUnreadBar = I, t.setMessageErrored = A, t.resendMessage = L, t.addMessage =
        M, t.markInboundMessagesAsRead = O, t.markOutboundMessagesAsRead = D, t.initTextStore = B, t.addMediaStore = F, t.cleanMediaStore = N, t.restoreAttaches = j, t.getAttaches =
        R, t.mergeTabs = U, t.updateOnline = H, t.setTyping = G, t.waitTyping = z, t.saveTextDraft = q, t.getTextDraft = Q, t.addSelection = K, t.cleanSelected = W, t.dropSelection =
        V, t.replaceMessage = Z, t.saveMedia = Y, t.loadMedia = $, t.replaceMediaAttachesStore = X, t.setCurrentSearchDate = J, t.setCurrentSearch = ee, t.searchHints = te,
        t.searchHintsIndex = ne, t.fetchFriends = ae, t.fetchLocalHints = ie, t.loadDialogs = oe, t.searchMessages = le, t.isSearchAllLoaded = ue, t.isSearchingInplace =
        ce, t.cancelSearch = de, t.clearDate = ge, t.searchInplaceStart = fe, t.searchMessagesInplace = me, t.loadImportant = pe, t.removeMessages = _e, t.removeMessageSend =
        he, t.removeMessagesWithRestore = ve, t.restoreMessage = ye, t.restoreMessageSend = be, t.changeMessage = Ce, t.forwardMessages = Te, t.getForwardedMessages = Ee,
        t.prepareForward = we, t.setChatTitle = Se, t.checkNewPeople = Pe, t.updateActions = Ie, t.setMutedPeer = Ae, t.removeMember = Le, t.setExecStack = Me, t.updateFavMessage =
        xe, t.updateImportant = Oe, t.loadSpam = De, t.flushSpam = Be, t.setCreationType = Fe, t.getOwnerPhoto = Ne, t.presetAvatar = je, t.setChatPhoto = Re, t.createChat =
        Ue, t.resync = He, t.chatKickUser = Ge, t.toggleUnreadOnly = qe, t.setDelayedMessage = Qe, t.isAnythingLoading = We, t.updateUnreadCount = Ve, t.changeSubmitSettings =
        Ze, t.getBindAttachToUrl = $e, t.bindAttachToUrl = Xe, t.clearAttachToUrl = Je, t.updateFavAndTitle = tt, t.saveHistoryScroll = nt;
    var at = n(4),
        it = n(74),
        ot = n(75),
        st = n(78),
        lt = n(80),
        ut = n(81),
        ct = "al_im.php",
        dt = t.TYPING_PERIOD = 5,
        gt = t.ACTION_PRIORITIES = {
            fav: 1,
            chat: 2,
            invite: 2,
            topic: 3,
            avatar: 4,
            photos: 5,
            search: 6,
            mute: 7,
            unmute: 7,
            clear: 8,
            leave: 9,
            "return": 9
        };
    t.readLastMessages = s(function(e, t) {
        var n = t.tabs[e],
            r = Object.keys(n.msgs)
            .filter(function(e) {
                return !n.msgs[e][0]
            })
            .sort(function(e, t) {
                return t - e
            });
        return n.skipped > 0 && (r = r.filter(function(e) {
            return intval(e) <= n.lastmsg - n.skipped
        })), r = intval(r.shift()), r <= n.in_up_to ? Promise.resolve(t) : (t.longpoll.push([ot.eventTypes.readInboundEvent([6, e, r])]), (0, at.post)(ct, {
                peer: e,
                ids: [r],
                hash: n.hash,
                act: "a_mark_read",
                gid: t.gid
            })
            .then(function() {
                return E(t, e, r, ot.eventTypes.FLAG_OUTBOUND)
            }))
    }), t.deliverMessage = s(function(e, t, n) {
        var r, a = Date.now() + rand(0, 100)
            .toFixed(0),
            i = n.tabs[e],
            o = t.attaches.map(function(e) {
                return "fwd" === e[0] ? ["mail", e[1].join(";")] : e
            })
            .map(function(e) {
                return e[0] + ":" + e[1]
            })
            .join(","),
            s = t.attaches.filter(function(e) {
                return "share" === e[0]
            })
            .pop();
        return s && (r = s[2].url), (0, at.post)(ct, {
                act: "a_send",
                to: e,
                hash: i.hash,
                msg: t.message,
                media: o,
                guid: a,
                share_url: r,
                random_id: t.rid,
                gid: n.gid
            })
            .then(function(e) {
                var t = rt(e, 1),
                    r = t[0];
                return n.version !== r.version && nav.reload({
                    force: !0
                }), n
            })
    }), t.searchFriends = re(function(e) {
        return e.friendsTree
    }, function(e, t) {
        return t[3] - e[3]
    }), t.searchLocalHints = re(function(e) {
        return e.hintsTree
    }, function(e, t) {
        return e[3] - t[3]
    }), t.sendTyping = s(function(e, t) {
        return t.tabs[e].lastTyping = Date.now(), (0, at.post)(ct, {
                act: "a_typing",
                peer: e,
                gid: t.gid,
                hash: t.tabs[e].hash
            })
            .then(function(e) {
                return t
            })
    }), t.flushHistory = s(function(e, t) {
        return (0, ut.isTabLoaded)(t, e) ? (t.blockedFlagUpdates || (t.blockedFlagUpdates = {}), t.blockedFlagUpdates[e] = !0, t.all_dialogs = t.all_dialogs.filter(
                function(t) {
                    return t !== e
                }), t.unread_dialogs = t.unread_dialogs.filter(function(t) {
                return t !== e
            }), t.tabs[e].unread > 0 && x(t, -1, e), 0 === t.unread_cnt && t.unread_only && qe(t), (0, at.post)("al_im.php", {
                act: "a_flush_history",
                id: e,
                from: "im",
                gid: t.gid,
                hash: t.tabs[e].hash
            })
            .then(function(n) {
                var r = rt(n, 2);
                r[0], r[1];
                return delete t.blockedFlagUpdates[e], delete t.tabs[e], t.peer === e ? y(0, !1, t) : t
            })) : void 0
    }), t.updateChatTopic = s(function(e, t, n) {
        var r = n.tabs[e];
        return (0, at.post)(ct, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_title: t,
                hash: r.hash
            })
            .then(function(t) {
                var a = rt(t, 2),
                    i = (a[0], a[1]);
                return n.tabs[e] = extend(r, i), n
            })
    }), t.addNewMember = s(function(e, t, n) {
        var r = n.tabs[e];
        return (0, at.post)(ct, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_peer: t.join(","),
                hash: r.hash
            })
            .then(function(t) {
                var a = rt(t, 2),
                    i = (a[0], a[1]);
                return n.tabs[e] = extend(r, i), n
            })
    }), t.updateChatPhoto = s(function(e, t) {
        return e.kludges.source_act === ut.CHAT_PHOTO_REMOVE ? (delete t.tabs[e.peerId].photo, Promise.resolve(t)) : (0, at.post)(ct, {
                act: "a_get_chat_photo",
                msg_id: e.messageId
            })
            .then(function(n) {
                var r = rt(n, 2),
                    a = r[0],
                    i = r[1];
                t.chat_photo_msg = i;
                var o = t.tabs[e.peerId];
                if (t.tabs[e.peerId].photo = a, (0, ut.isFullyLoadedTab)(t, e.peerId)) {
                    var s = e.kludges.source_act;
                    o.history = (0, ut.addChatPhotoToUpdate)(e, s, t, l(o.history))
                }
                return t
            })
    }), t.leaveChat = s(function(e, t) {
        return (0, at.post)(ct, {
                act: "a_leave_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Ie.bind(null, ut.CHAT_KICK_USER, vk.id, e, t))
    }), t.returnToChat = s(function(e, t) {
        return (0, at.post)(ct, {
                act: "a_return_to_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Ie.bind(null, ut.CHAT_INVITE_USER, vk.id, e, t))
    }), t.toggleMutePeer = s(function(e, t, n) {
        return (0, at.post)(ct, {
                act: "a_mute",
                peer: e,
                hash: n.tabs[e].hash,
                gid: n.gid,
                value: t
            })
            .then(function() {
                var r = t ? "mute" : "unmute";
                return Notifier.lcSend("im", {
                    act: r,
                    peer: e
                }), n
            })
            .then(Ae.bind(null, e, t))
    }), t.favMessage = s(function(e, t, n, r) {
        return xe(e, n, t, r), (0, at.post)(ct, {
                act: "a_mark_important",
                ids: e,
                val: t ? 1 : 0,
                from: "im",
                gid: r.gid,
                peer: n,
                hash: r.tabs[n].hash
            })
            .then(function(e) {
                return r
            })
    })
}, function(e, t) {
    "use strict";

    function n(e) {
        var t = extend({}, nav.objLoc, e);
        Object.keys(t)
            .filter(function(e) {
                return "" === t[e]
            })
            .forEach(function(e) {
                delete t[e]
            });
        var n = nav.toStr(t);
        nav.setLoc(n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.updateLocation = n
}, function(e, t, n) {
    "use strict";

    function r(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t["default"] = e, t
    }

    function a(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function i(e) {
        var t = e.updates;
        return t.map(function(e) {
            switch (e[0]) {
                case 0:
                    return b.deleteEvent(e);
                case 1:
                    return b.replaceFlagsEvent(e);
                case 2:
                    return b.setFlagsEvent(e);
                case 3:
                    return b.resetFlagsEvent(e);
                case 4:
                    return b.addMessageEvent(e);
                case 6:
                    return b.readInboundEvent(e);
                case 7:
                    return b.readOutboundEvent(e);
                case 8:
                    return b.gotOnlineEvent(e);
                case 9:
                    return b.gotOfflineEvent(e);
                case 51:
                    return b.chatChangedEvent(e);
                case 61:
                    return b.typingUserEvent(e);
                case 62:
                    return b.typingChatEvent(e);
                case 70:
                    return b.videoCallEvent(e);
                case 80:
                    return b.unreadCountEvent(e);
                case 114:
                    return b.notifySettingsChangedEvent(e);
                case -1:
                    return b.resyncEvent();
                default:
                    return b.emptyEvent(e)
            }
        })
    }

    function o(e, t) {
        return Promise.resolve(extend({}, t, {
            timeout: 64 > e ? 2 * e : e
        }))
    }

    function s(e, t) {
        return Promise.resolve(extend({}, t, {
            imTs: e
        }))
    }

    function l(e) {
        e.set(function(e) {
            return Promise.resolve(extend({}, e, {
                stopped: !0
            }))
        })
    }

    function u(e, t) {
        return t.pauses || (t.pauses = []), t.pauses.push(e), Promise.resolve(t)
    }

    function c(e) {
        return e.pauses || (e.pauses = []), (0, E.lplog)("Aborting all pauses", "error"), e.pauses.forEach(function(e) {
            return e()
        }), e.pauses = [], Promise.resolve(e)
    }

    function d(e, t, n, r) {
        if (r.failed) var a = (0, C.abortablePause)(S, e),
            i = a.abort,
            o = a.pause;
        switch (r.failed) {
            case 1:
                return (0, E.lplog)("Old timestamp, init resync", "error"), e.set(u.bind(null, i)), n([b.resyncEvent()]), e.set(p.loadLongPollTs)
                    .then(o)
                    .then(g.bind(null, e, t, n));
            case 2:
                return (0, E.lplog)("Key is incorrect", "error"), e.set(u.bind(null, i)), e.set(p.loadLongPollKey)
                    .then(o)
                    .then(g.bind(null, e, t, n));
            case 3:
                throw nav.reload({
                    force: !0
                }), new Error("ts is very wrong");
            default:
                return e.set(s.bind(null, r.ts))
                    .then(function() {
                        return r
                    })
        }
    }

    function g(e, t, n) {
        if (e.get()
            .stopped) return Promise.resolve({
            updates: []
        });
        if (t()) return Promise.reject(new Error("pause"));
        var r = e.get(),
            a = r.imUrl + "/" + r.imPart;
        return (0, v.plainget)(a, {
                act: "a_check",
                key: r.imKey,
                version: 1,
                ts: r.imTs,
                wait: 25,
                mode: r.mode
            })
            .then(function(t) {
                return e.set(o.bind(null, 1)), JSON.parse(t)
            })
            .then(d.bind(null, e, t, n))
    }

    function f(e, t, n) {
        e.get()
            .stopped || ((0, E.lplog)("New request"), g(e, n, t)
                .then(i)
                .then(function(e) {
                    return (0, E.lplog)("Request success", "success"), e
                })
                .then(t)["catch"](function(t) {
                    return "pause" !== t.message && topError(t), (0, E.lplog)("Error, waiting: " + (t.message || "no message (probably browser reset)"), "error"), e.set(
                            o.bind(null, n() ? S / 2 : e.get()
                                .timeout))
                        .then(function() {
                            var t = (0, C.abortablePause)(e.get()
                                    .timeout, e),
                                n = t.abort,
                                r = t.pause;
                            return e.set(u.bind(null, n))
                                .then(r)
                        })
                })
                .then(f.bind(null, e, t, n)))
    }

    function m(e) {
        var t = e.id,
            n = e.gid,
            r = e.key,
            a = e.ts,
            i = e.url,
            o = e.lhost,
            s = "main",
            u = new EventEmitter,
            d = (0, T.initQueue)(function(e, t) {
                return u.trigger("data", t), Promise.resolve({})
            }),
            g = d.pause,
            m = d.resume,
            p = d.pushMessage,
            _ = d.isPaused,
            v = d.reset,
            y = (0, h["default"])({
                id: t,
                gid: n,
                mode: w,
                timeout: 1,
                imKey: r,
                imTs: a,
                imPart: i,
                imUrl: o,
                pause: !1
            });
        return f(y, p.bind(null, s), _.bind(null, s)), {
            on: u.on.bind(u),
            off: u.off.bind(u),
            abortPauses: function() {
                return y.set(c)
            },
            stop: l.bind(null, y),
            pause: g.bind(null, s),
            resume: m.bind(null, s),
            reset: v.bind(null, s),
            push: p.bind(null, s)
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.eventTypes = void 0, t.startLongPoll = m;
    var p = n(73),
        _ = n(76),
        h = a(_),
        v = n(4),
        y = n(77),
        b = r(y),
        C = n(78),
        T = n(79),
        E = n(80),
        w = (t.eventTypes = b, 202),
        S = 4
}, function(e, t) {
    "use strict";

    function n(e, t) {
        return t ? void ls.set(e, t) : ls.get(e)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t["default"] = function() {
        var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
            t = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
            r = extend({}, e),
            a = [];
        return t.store && (r = n(t.key) || r), {
            get: function() {
                return r
            },
            set: function(e) {
                var a = this;
                return new Promise(function(t, n) {
                        e(r)
                            .then(t)["catch"](n)
                    })
                    .then(function(e) {
                        return r = e, t.store && n(t.key, e), a
                    })
            },
            stash: function() {
                a.push(r), r = extend({}, e)
            },
            reset: function() {
                r = extend({}, e)
            },
            pop: function() {
                a.length > 0 && (r = a.pop())
            }
        }
    }
}, function(e, t) {
    "use strict";

    function n(e) {
        var t = E(e, 2),
            n = t[1];
        return {
            type: w,
            localId: n
        }
    }

    function r(e) {
        var t = E(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: k,
            messageId: n,
            mask: r,
            peerId: a
        }
    }

    function a(e) {
        var t = E(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: S,
            messageId: n,
            flags: r,
            peerId: a
        }
    }

    function i(e) {
        var t = E(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: P,
            messageId: n,
            flags: r,
            peerId: a
        }
    }

    function o(e) {
        for (var t = E(e, 9), n = t[1], r = t[2], a = t[3], i = t[4], o = t[5], s = t[6], l = t[7], u = t[8], c = [], d = 1; l["attach" + d + "_type"];) c.push({
            type: l["attach" + d + "_type"],
            id: l["attach" + d],
            productId: l["attach" + d + "_product_id"],
            build: l["attach" + d + "_build"]
        }), d++;
        if (l.fwd) {
            var g = l.fwd.split(",")
                .map(function(e) {
                    return {
                        text: l["fwd" + e],
                        id: e
                    }
                });
            c.push({
                type: "fwd",
                messages: g
            })
        }
        return l.geo && c.push({
            type: "geo",
            id: l.geo,
            productId: null,
            build: null
        }), {
            type: I,
            messageId: intval(n),
            flags: intval(r),
            peerId: intval(a),
            date: intval(i),
            attaches: c,
            subject: o,
            text: s,
            kludges: l,
            randomId: intval(u),
            userId: intval(a) > 2e9 ? intval(l.from) : intval(a)
        }
    }

    function s(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: A,
            peerId: n,
            upToId: r
        }
    }

    function l(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: L,
            peerId: n,
            upToId: r
        }
    }

    function u(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: M,
            userId: -n,
            platform: r
        }
    }

    function c(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: x,
            userId: -n,
            reason: r
        }
    }

    function d(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: R,
            peerId: n,
            mask: r
        }
    }

    function g(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: U,
            peerId: n,
            flags: r
        }
    }

    function f(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: H,
            peerId: n,
            mask: r
        }
    }

    function m(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: O,
            chatId: n,
            self: r
        }
    }

    function p(e) {
        var t = E(e, 2),
            n = t[1];
        return {
            type: D,
            userId: n,
            peerId: n
        }
    }

    function _(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: D,
            userId: n,
            peerId: r + 2e9
        }
    }

    function h(e) {
        var t = E(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: B,
            userId: n,
            callId: r
        }
    }

    function v(e) {
        var t = E(e, 2),
            n = t[1];
        return {
            type: F,
            count: n
        }
    }

    function y(e) {
        var t = E(e, 2),
            n = t[1],
            r = void 0 === n ? {} : n;
        return {
            type: N,
            peerId: r.peer_id,
            sound: r.sound,
            disabledUntil: r.disabled_until
        }
    }

    function b(e) {
        return {
            type: j,
            params: e
        }
    }

    function C(e) {
        return {
            type: z,
            state: e
        }
    }

    function T() {
        return {
            type: G
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var E = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.deleteEvent = n, t.replaceFlagsEvent = r, t.setFlagsEvent = a, t.resetFlagsEvent = i, t.addMessageEvent = o, t.readInboundEvent = s, t.readOutboundEvent = l, t.gotOnlineEvent =
        u, t.gotOfflineEvent = c, t.resetDirectoriesEvent = d, t.replaceDirectoriesEvent = g, t.setDirectoriesEvent = f, t.chatChangedEvent = m, t.typingUserEvent = p, t.typingChatEvent =
        _, t.videoCallEvent = h, t.unreadCountEvent = v, t.notifySettingsChangedEvent = y, t.emptyEvent = b, t.transitionEvent = C, t.resyncEvent = T;
    var w = t.DELETE = "event_delete",
        S = t.SET_FLAGS = "event_set_flags",
        k = t.REPLACE_FLAGS = "event_replace_flags",
        P = t.RESET_FLAGS = "event_reset_flags",
        I = t.ADD_MESSAGE = "event_add_message",
        A = t.READ_INBOUND = "event_read_inbound",
        L = t.READ_OUTBOUND = "event_read_outbound",
        M = t.GOT_ONLINE = "event_got_online",
        x = t.GOT_OFFLINE = "event_got_offline",
        O = t.CHAT_CHANGED = "event_chat_changed",
        D = t.TYPING = "event_typing",
        B = t.VIDEO_CALL = "event_video_call",
        F = t.UNREAD_COUNT = "event_unread_count",
        N = t.NOTIFY_SETTINGS_CHANGED = "event_notify_settings_changed",
        j = t.EMPTY = "event_empty",
        R = t.RESET_DIRECTORIES = "event_reset_directories",
        U = t.REPLACE_DIRECTORIES = "event_replace_directories",
        H = t.SET_DIRECTORIES = "event_set_directories",
        G = t.RESYNC = "event_resync",
        z = t.TRANSITION = "transition_event";
    t.FLAG_UNREAD = 1, t.FLAG_OUTBOUND = 2, t.FLAG_IMPORTANT = 8, t.FLAG_CHAT = 16, t.FLAG_FRIENDS = 32, t.FLAG_SPAM = 64, t.FLAG_DELETED = 128, t.FLAG_MEDIA = 512, t.FOLDER_IMPORTANT =
        1, t.FOLDER_UNRESPOND = 2
}, function(e, t) {
    "use strict";

    function n(e, t) {
        return new Promise(function(n) {
            setTimeout(n.bind(null, t), 1e3 * e)
        })
    }

    function r(e, t) {
        var n;
        try {
            throw new Error("test")
        } catch (r) {
            r.stack
        }
        var a = new Promise(function(r) {
            n = r, setTimeout(r.bind(null, t), 1e3 * e)
        });
        return {
            pause: function() {
                return a
            },
            abort: function() {
                n(t)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.pause = n, t.abortablePause = r
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t) {
        return t.queues[e].currEv = !1, Promise.resolve(t)
    }

    function i(e, t) {
        var n = t.queues[e].currEv;
        return n ? (t.queues[e].errored.push(n), a(e, t)) : Promise.resolve(t)
    }

    function o(e, t, n) {
        return n.queues[e] ? (t ? n.queues[e].errored = [] : n.queues[e].errored = n.queues[e].errored.concat(n.queues[e].evs), n.queues[e].evs = [], a(e, n)) : Promise.resolve(
            n)
    }

    function s(e, t) {
        var n = d(e, t.get())
            .errored;
        return n.length > 0 ? n[n.length - 1] : !1
    }

    function l(e, t, n, r) {
        var o = r.get()
            .queues[e];
        if (o && !o.currEv && o.evs.length > 0 && !o.pause) {
            var u = l.bind(null, e, t, n, r),
                c = o.evs.shift();
            o.currEv = c, t(e, c)
                .then(function() {
                    r.set(a.bind(null, e))
                })
                .then(u)["catch"](function(t) {
                    return "" === t ? Promise.reject("Reload in process") : r.set(i.bind(null, e))
                        .then(function() {
                            n(e, s(e, r))
                        })
                        .then(u)
                })
        }
    }

    function u(e, t, n) {
        var r = n.queues[e];
        return r.errored.filter(function(e) {
                return e.mess.messageId === t
            })
            .forEach(function(e) {
                e.failed = !1, r.evs.push(e)
            }), r.errored = r.errored.filter(function(e) {
                return e.mess.messageId !== t
            }), Promise.resolve(n)
    }

    function c() {
        return {
            evs: [],
            pause: !1,
            errored: [],
            currEv: !1
        }
    }

    function d(e, t) {
        return t.queues[e] || (t.queues[e] = c()), t.queues[e]
    }

    function g(e, t, n) {
        var r = d(e, n);
        return r.pause = t, Promise.resolve(n)
    }

    function f(e, t, n) {
        t.ts = Date.now();
        var r = d(e, n);
        return r.evs.push(t), Promise.resolve(n)
    }

    function m(e, t, n) {
        var r = (0, _["default"])({
                queues: {}
            }, n),
            a = Object.keys(r.get()
                .queues);
        return a.forEach(function(e) {
            r.set(i.bind(null, e)), r.set(o.bind(null, e, !1))
        }), {
            pushMessage: function(n, a) {
                return r.set(f.bind(null, n, a))
                    .then(function(r) {
                        l(n, e, t, r)
                    })
            },
            resend: function(n, a) {
                r.set(u.bind(null, n, a))
                    .then(function(a) {
                        l(n, e, t, r)
                    })
            },
            reset: function(n) {
                return r.set(o.bind(null, n, !0))
                    .then(function(r) {
                        l(n, e, t, r)
                    })
            },
            setErrored: function(e, t) {
                return r.set(function(n) {
                    var r = d(e, n);
                    return r.errored = t, Promise.resolve(n)
                })
            },
            pause: function(e) {
                r.set(g.bind(null, e, !0))
            },
            isPaused: function(e) {
                return !!d(e, r.get())
                    .pause
            },
            resume: function(n) {
                r.set(g.bind(null, n, !1))
                    .then((0, h.pause)(.1))
                    .then(function() {
                        l(n, e, t, r)
                    })
            },
            inspectQueue: function(e) {
                var t = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1];
                if (!r.get()
                    .queues[e]) return [];
                var n = r.get()
                    .queues[e],
                    a = t && n.currEv ? [n.currEv] : [];
                return a.concat(n.evs.slice())
                    .concat(n.errored.slice()
                        .map(function(e) {
                            return extend({}, e, {
                                failed: !0
                            })
                        }))
                    .sort(function(e, t) {
                        return e.ts - t.ts
                    })
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.initQueue = m;
    var p = n(76),
        _ = r(p),
        h = n(78)
}, function(e, t) {
    "use strict";

    function n(e, t) {
        var n = [],
            r = 0;
        return function(a) {
            n.push(a), r || (r = setTimeout(function() {
                r = !1, e(n), n = []
            }, t))
        }
    }

    function r(e, t) {
        return e.filter(function(e) {
            return e.name !== t
        })
    }

    function a(e, t, n) {
        return r(e, t)
            .concat([{
                func: n,
                name: t
            }])
    }

    function i(e) {
        return e.length > 0 && e.pop()
            .func(), e
    }

    function o(e, t) {
        var n, r;
        switch (t) {
            case "error":
                n = "color: red", r = "background: red; color: white";
                break;
            case "success":
                n = "color: green", r = "background: green; color: white";
                break;
            default:
                n = "color: blue;", r = "background: #000; color: #fff;"
        }
        try {
            var a = new Date;
            console.debug("%cLP:[" + a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds() + ":" + a.getMilliseconds() + "]%c " + e, r, n)
        } catch (i) {}
    }

    function s(e) {
        var t = [];
        if ("undefined" == typeof e.length) return Object.keys(e)
            .map(function(t) {
                return e[t]
            });
        for (var n = 0; n < e.length; n++) t.push(e[n]);
        return t
    }

    function l(e) {
        for (var t = {}, n = [], r = 0; r < e.length; r++) t[e[r]] || (n.push(e[r]), t[n[r]] = 1);
        return n
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.throttleAccumulate = n, t.execuctionStackFilter = r, t.executionStackPush = a, t.executionStackPop = i, t.lplog = o, t.toArray = s, t.arrayUnique = l
}, function(e, t, n) {
    "use strict";

    function r(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t["default"] = e, t
    }

    function a(e, t) {
        var n = geByClass1(e, t),
            r = n.firstElementChild.offsetHeight !== n.parentNode.offsetHeight;
        r && setStyle(n.firstElementChild, {
            height: n.parentNode.offsetHeight
        })
    }

    function i(e, t) {
        var n = window.devicePixelRatio >= 2 ? "256" : "128";
        return t ? '<div class="im_sticker_row">\n      <a onmouseover="return Emoji.stickerOver(' + intval(e) + ', this);"\n        onclick="return Emoji.clickSticker(' +
            intval(t) + ', this, event);">\n          <img height="128"\n            class="im_gift"\n            src="/images/stickers/' + intval(e) + "/" + n +
            '.png"/>\n      </a>\n    </div>' : '<div class="im_sticker_row">\n      <img height="128"\n        class="im_gift"\n        src="/images/stickers/' + intval(e) +
            "/" + n + '.png"/>\n    </div>'
    }

    function o(e, t, n) {
        if (T(e.get(), t)) {
            var r = e.get()
                .tabs[t].deleted || [];
            return inArray(n, r)
        }
        return !1
    }

    function s(e, t, n) {
        var r = n.randomId,
            a = geByClass1("_im_mess_rid" + r, t);
        if (a) {
            var i = a.parentNode;
            if (a.parentNode.removeChild(a), 0 === domChildren(i)
                .length) {
                var o = gpeByClass("_im_mess_stack", i);
                o.parentNode.removeChild(o)
            }
            t = c(e, n, t, !0, !1)
        }
        return t
    }

    function l(e) {
        return getTemplate("im_preloader", {
            preloader: rs(vk.pr_tpl, {
                id: ""
            }),
            cls: "im-preloader_attach im-preloader_visible im-preloader_" + e
        })
    }

    function u(e) {
        var t = e.split(".");
        return (t[0] < 10 ? "0" : "") + t[0] + (t[1] < 10 ? "0" : "") + t[1] + t[2]
    }

    function c(e, t, n) {
        var r = (arguments.length <= 3 || void 0 === arguments[3] ? !0 : arguments[3], arguments.length <= 4 || void 0 === arguments[4] ? !0 : arguments[4]),
            a = e.tabs[t.peerId];
        if (geByClass1("_im_mess", n) || (n.innerHTML = ""), a.skipped > 0) return n;
        var o = "",
            s = "",
            u = ["_im_mess"],
            c = [];
        t.local || (c = e.imQueue(t.peerId, r)), c.length > 0 && F(c.map(function(e) {
                return geByClass1("_im_mess_rid" + e.rid, n)
            }, n)
            .filter(function(e) {
                return e
            })), t.flags & oe.eventTypes.FLAG_OUTBOUND && t.flags & oe.eventTypes.FLAG_UNREAD && u.push("im-mess_unread _im_mess_unread");
        var g = Date.now() - 1e3 * t.date > 1e3;
        t.local && g && u.push("im-mess_sending"), t.local && u.push("" + ge), t.failed && u.push("im-mess_failed " + fe);
        var f = t.attaches[0] && "gift" === t.attaches[0].type,
            m = t.attaches[0] && "chronicle_invite" === t.attaches[0].type;
        f && u.push("im-mess_gift");
        var p = t.attaches.map(function(e) {
                return "sticker" === e.type ? i(e.id, e.productId) : l(e.type)
            }),
            _ = S(t.text, t.kludges),
            v = getTemplate("im_message_media", {
                messageId: t.messageId,
                attaches: p.join(""),
                text: '<div class="im_msg_text">' + (f ? _ : "") + "</div>"
            });
        f || (v = _ + v);
        var y = getTemplate("im_msg_row", {
                msg_id: t.messageId,
                from_id: t.peerId,
                text: v,
                ts: t.date,
                cls: u.join(" ")
            }),
            b = domLC(n);
        (hasClass(b, he) || hasClass(b, _e)) && (b = domPS(b));
        var C = domLC(geByClass1("_im_stack_messages", b)),
            T = intval(domData(b, "peer")),
            k = 1e3 * intval(domData(C, "ts")),
            P = t.flags & oe.eventTypes.FLAG_OUTBOUND ? e.id : t.userId,
            I = t.flags & oe.eventTypes.FLAG_OUTBOUND;
        if (E(I, a.unread, T, k, P, t) || f) {
            var A = "";
            if (e.peer === t.peerId && !a.inplaceSearch || a.unread || t.flags & oe.eventTypes.FLAG_OUTBOUND || (A += getTemplate("im_mess_bar", {})), G(t)) A +=
                getTemplate("im_service_row", {
                    text: q(t, a),
                    type: "",
                    date: t.date,
                    from_id: "",
                    message_id: t.messageId
                });
            else {
                o = h(t.peerId) ? a.data.members[P].name : I ? e.name : a.name;
                var L = 1;
                L = h(t.peerId) ? a.data.members[P].sex : a.sex, s = h(t.peerId) ? a.data.members[P].photo : I ? e.photo : a.photo;
                var M;
                M = I ? e.author_link : h(t.peerId) ? a.data.members[P].link : a.href;
                var x = getTemplate("im_mess_stack_name", {
                    name: o,
                    link: M
                });
                f && (x += ' <span class="im-mess-stack--gift">' + getLang("mail_gift_message_sent", L) + "</span>"), m && (x += " " + getLang("mail_chronicle_invite_inf")),
                    A += getTemplate("im_mess_stack", {
                        photo: s,
                        href: M,
                        cls: "",
                        date_attr: "",
                        link: "/im?sel=" + t.peerId + "&msgid=" + t.messageId,
                        name: x,
                        peerId: P,
                        date: w(t.date),
                        messages: y
                    })
            }(0, de.toArray)(sech(A))
            .forEach(function(e) {
                return n.appendChild(e)
            })
        } else {
            var O = geByClass1("_im_unread_bar_row", n);
            O && e.peer === t.peerId && !a.inplaceSearch && O.parentNode.removeChild(O), geByClass1("_im_stack_messages", b)
                .appendChild(se(y))
        }
        return t.flags & oe.eventTypes.FLAG_OUTBOUND && !g && setTimeout(function() {
            var e = geByClass1("_im_mess_" + t.messageId, n);
            hasClass(e, ge) && addClass(e, "im-mess_sending")
        }, 500), c = c.filter(function(e) {
            return e.rid !== t.randomId
        }), d(c, e, n)
    }

    function d(e, t, n) {
        var r;
        return r = "object" === ("undefined" == typeof e ? "undefined" : ie(e)) ? e : t.imQueue(e, !1), r.length > 0 && r.map(function(e) {
                return e.mess.failed = !!e.failed, e.mess
            })
            .forEach(function(e) {
                return c(t, e, n, !1)
            }), n
    }

    function g(e, t, n) {
        var r = e.tabs[t];
        return (0, de.toArray)(geByClass("_im_mess_unread", n))
            .forEach(function(e) {
                var t = intval(domData(e, "msgid"));
                t > 0 && r.out_up_to >= t && (removeClass(e, "_im_mess_unread"), removeClass(e, "im-mess_unread"))
            }), n
    }

    function f(e, t, n) {
        var r = geByClass1("_im_msg_media" + t.messageId, e);
        return r && (r.innerHTML = n.tabs[t.peerId].mediacontent[t.messageId][0]), e
    }

    function m(e, t) {
        if (!C(t, e.peerId)) return 0;
        var n = t.tabs[e.peerId];
        return n.msgs[e.messageId] ? 1 : n.msgs["rid" + e.randomId] ? 2 : 0
    }

    function p(e) {
        return e >= -5 && 0 >= e ? !0 : !1
    }

    function _(e) {
        return e > 0 && 2e9 > e
    }

    function h(e) {
        return e > 2e9
    }

    function v(e) {
        return e > -2e9 && 0 > e
    }

    function y(e) {
        return -2e9 > e
    }

    function b(e, t) {
        return e === t.peer
    }

    function C(e, t) {
        return e.tabs[t] && e.tabs[t].msgs && e.tabs[t].history ? !0 : !1
    }

    function T(e, t) {
        return e.tabs[t] ? !0 : !1
    }

    function E(e, t, n, r, a, i) {
        return n !== a ? !0 : Date.now() - r > 3e5 ? !0 : t || e || a === vk.id ? G(i) ? !0 : !1 : !0
    }

    function w(e) {
        var t = new Date(1e3 * e);
        return isToday(t) ? langDate(1e3 * e, "{hour}:{minute} {am_pm}", 0, [], !0) : langDate(1e3 * e, "{day}.{month}.{short_year}", 0, [0, "01", "02", "03", "04", "05",
            "06", "07", "08", "09", "10", "11", "12"
        ], !0)
    }

    function S(e, t, n) {
        return e = (e || "")
            .replace(ue.MESSAGE_REGEXP, function() {
                var e = Array.prototype.slice.apply(arguments),
                    t = e[1] || "",
                    r = e[2] || "http://",
                    a = e[3] || "",
                    i = a + (e[4] || ""),
                    o = (e[2] || "") + e[3] + e[4];
                if (-1 == a.indexOf(".") || -1 != a.indexOf("..")) return e[0];
                var s = a.split(".")
                    .pop();
                if ((s.length > 7 || -1 == indexOf(ue.TOP_DOMAINS.split(","), s)) && (!/^[a-zA-Z]+$/.test(s) || !e[2])) return e[0];
                if (-1 != e[0].indexOf("@")) return e[0];
                try {
                    o = decodeURIComponent(o)
                } catch (l) {}
                if (o.length > 55 && (o = o.substr(0, 53) + ".."), o = clean(o)
                    .replace(/&amp;/g, "&"), !n && a.match(ue.OUR_DOMAINS)) {
                    i = replaceEntities(i)
                        .replace(ue.ENTITIES, encodeURIComponent);
                    var u, c = i,
                        d = i.indexOf("#/"),
                        g = "";
                    return d >= 0 ? c = i.substr(d + 1) : (d = i.indexOf("#!"), d >= 0 && (c = "/" + i.substr(d + 2)
                            .replace(/^\//, ""))), u = c.match(ue.VK_DOMAIN), u && u[1].length < 32 && (g = ' mention_id="' + u[1] +
                            '" onclick="return mentionClick(this, event)" onmouseover="mentionOver(this)"'), t + '<a href="' + (r + i)
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;") + '" target="_blank"' + g + ">" + o + "</a>"
                }
                return t + '<a href="away.php?utf=1&to=' + encodeURIComponent(r + replaceEntities(i)) + '" target="_blank" onclick="return goAway(\'' + clean(r + i) +
                    "', {}, event);\">" + o + "</a>"
            }), e = e.replace(ue.EMAIL, function(e) {
                return '<a href="/write?email=' + e + '" target="_blank">' + e + "</a>"
            }), t.emoji && (e = Emoji.emojiToHTML(e, !0)), e
    }

    function k(e) {
        return h(e) ? "c" + (e - 2e9) : y(e) ? "e" + Math.abs(e + 2e9) : e
    }

    function P(e, t) {
        return {
            search: {
                name: getLang("mail_im_peer_search"),
                icon: "search"
            },
            clear: {
                name: e.peer < -2e9 ? getLang("mail_im_delete_email_contact") : getLang("mail_im_delete_all_history"),
                icon: "clear"
            },
            chat: {
                name: getLang("mail_im_create_chat_with"),
                icon: "invite"
            },
            mute: {
                name: getLang("mail_im_mute"),
                icon: "mute"
            },
            unmute: {
                name: getLang("mail_im_unmute"),
                icon: "unmute"
            },
            photos: {
                name: e.gid ? getLang("mail_im_show_media_history_group") : getLang("mail_im_show_media_history"),
                icon: "media"
            },
            avatar: {
                icon: "avatar",
                name: t.avatar
            },
            invite: {
                icon: "invite",
                name: getLang("mail_im_create_chat_with")
            },
            leave: {
                icon: "leave",
                name: t.leave
            },
            topic: {
                icon: "topic",
                name: t.topic
            },
            "return": {
                icon: "return",
                name: t["return"]
            }
        }
    }

    function I(e, t) {
        var n = '<img src="' + e + '" alt="" class="dialogs_inline_chatter dialogs_inline_chatter_half"/>';
        return t && (n = '<a href="' + t + '" target="_blank">' + n + "</a>"),
            '<div class="im_grid">\n    <div class="dialogs_inline_chatter dialogs_inline_chatter_half">\n      ' + n + "\n    </div>\n  </div>"
    }

    function A(e, t) {
        var n = '<img src="' + e + '" alt="" class="dialogs_inline_chatter"/>';
        return t && (n = '<a href="' + t + '" target="_blank">' + n + "</a>"), '<div class="im_grid">\n    <div class="dialogs_inline_chatter">\n      ' + n +
            "\n    </div>\n  </div>"
    }

    function L(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1];
        if ("string" == typeof e) return '<div class="im_grid"><img src="' + e + '" alt=""/></div>';
        switch (e.length) {
            case 1:
                return '<div class="im_grid""><img src="' + e[0] + '" alt=""/></div>';
            case 2:
                return e.map(function(e, n) {
                        return I(e, t[n])
                    })
                    .join("");
            case 3:
                return I(e[0], t[0]) + e.slice(1)
                    .map(function(e, n) {
                        return A(e, t[n])
                    })
                    .join("");
            case 4:
                return e.map(function(e, n) {
                        return A(e, t[n])
                    })
                    .join("")
        }
    }

    function M(e, t) {
        if (e.photo) return '<a href="javascript:void(0)">\n      <div class="im_grid">\n        <img src="' + e.photo + '" alt="" />\n      </div>\n    </a>';
        var n = [];
        n = e.data.active ? (0, de.toArray)(e.data.active)
            .slice(0, 4)
            .map(function(t) {
                return e.data.members[t]
            }) : Object.keys(e.data.members)
            .filter(function(e) {
                return intval(e) != vk.id
            })
            .slice(0, 4)
            .map(function(t) {
                return e.data.members[t]
            });
        var r = n.reduce(function(e, t) {
                return e.photos.push(t.photo), e.links.push(t.link), e
            }, {
                photos: [],
                links: []
            }),
            a = r.photos,
            i = r.links;
        return i = t ? [] : i, L(a, i)
    }

    function x() {
        return '<li class="im-page--messages-search">' + getLang("mail_search_messages") + "</li>"
    }

    function O(e, t, n) {
        var r = geByClass1("_im_mess_" + t.messageId, n);
        return r && addClass(r, "im-mess_failed " + fe), n
    }

    function D(e, t, n) {
        var r = geByClass1("_im_mess_" + t, n);
        return r && (removeClass(r, "im-mess_failed"), removeClass(r, fe)), n
    }

    function B(e, t) {
        var n = e.map(function(e) {
                return geByClass1("_im_mess_" + e, t)
            })
            .filter(function(e) {
                return e
            });
        return F(n, t)
    }

    function F(e, t) {
        var n = e.filter(function(e) {
                return !hasClass(e, "im-mess_srv")
            })
            .map(function(e) {
                return e.parentNode
            });
        return e.forEach(function(e) {
                return e.parentNode.removeChild(e)
            }), n.filter(function(e) {
                return 0 === domChildren(e)
                    .length
            })
            .map(function(e) {
                return gpeByClass("_im_mess_stack", e)
            })
            .forEach(function(e) {
                e.parentNode && e.parentNode.removeChild(e)
            }), t
    }

    function N(e, t, n, r) {
        return e.map(function(e) {
                return geByClass1("_im_mess_" + e, r)
            })
            .filter(function(e) {
                return e
            })
            .forEach(function(e) {
                val(e, U(t, e, n)), addClass(e, "im-mess_light")
            }), r
    }

    function j(e, t, n) {
        var r = geByClass1("_im_mess_" + e, n);
        if (r) {
            var a = geByClass1(me, r);
            val(r, a.innerHTML), removeClass(r, "im-mess_light")
        }
        return n
    }

    function R(e, t, n, r) {
        var a = arguments.length <= 4 || void 0 === arguments[4] ? 2 : arguments[4],
            i = r.tabs[t];
        if (!e) return "";
        var o = Object.keys(e)
            .sort(function(t, n) {
                return e[n] - e[t]
            });
        if (0 === o.length) return "";
        if (_(t) || v(t)) {
            var s = n ? "" : i.name;
            return s + " " + getLang("mail_typing")
        }
        var l = getLang("mail_typing_several", o.length),
            u = o.slice(0, o.length > a ? a : a - 1)
            .map(function(e) {
                return i.data.members[e].short_name
            })
            .join(", ");
        if (o.length > a) {
            var c = o.length - a;
            u += " " + getLang("mail_and_peer")
                .replace("{count}", c)
                .replace("{typing}", l)
        } else {
            var d = !!u;
            if (d && o[a - 1] && (u += " " + getLang("mail_and_peer_one") + " "), d && o.length !== a || !o[a - 1]) var s = "";
            else var s = i.data.members[o[a - 1]].short_name;
            u += s + " " + l
        }
        return u
    }

    function U(e, t, n) {
        var r = t.innerHTML,
            a = "delete" === n ? "mail_deleted_stop" : "mail_marked_as_spam";
        return '<div class="im-mess--text">\n    ' + getLang(a) + ' <button type="button" data-peer="' + e + '" class="' + pe + ' im-mess--btn">' + getLang("mail_restore") +
            '</button>\n    <div class="' + me + ' im-mess--original">' + r + "</div>\n  </div>"
    }

    function H() {
        return '<div class="im-page--chat-search-empty">\n    ' + getLang("mail_im_search_empty") + "\n  </div>"
    }

    function G(e) {
        return e.kludges && "undefined" != typeof e.kludges.source_act
    }

    function z(e, t, n) {
        return n ? '<a class="im_srv_lnk" target="_blank" href="' + e + '">' + t + "</a>" : "<span>" + t + "</span>"
    }

    function q(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !0 : arguments[2],
            r = e.kludges,
            a = r.source_act,
            i = intval(r.source_mid),
            o = e.userId,
            s = t.data.members[o],
            l = "",
            u = o === i;
        switch (a) {
            case ve:
                l = "mail_im_chat_created";
                break;
            case ye:
                l = "mail_im_title_updated";
                break;
            case be:
                l = u ? "mail_im_returned_to_chat" : "mail_im_invited";
                break;
            case Ce:
                l = u ? "mail_im_left" : "mail_im_kicked_from_chat";
                break;
            case Te:
                l = "mail_im_photo_set";
                break;
            case Ee:
                l = "mail_im_photo_removed";
                break;
            default:
                return ""
        }
        if (l = langSex(s.sex, getLang(l, "raw")), l = l.replace("{from}", z(s.link, s.name, n)), i && i !== o) {
            var c = r.source_email;
            if (c) l = l.replace("{user}", z("/im?email=${encodeURIComponent(email)", "email", n));
            else {
                var d = t.data.members[i],
                    g = a === Ce ? d.name_kick_case : d.name_inv_case;
                l = l.replace("{user}", z(d.link, g, n))
            }
        }
        return r.source_text && (l = l.replace("{title}", '&laquo;<b class="im_srv_lnk">' + r.source_text + "</b>&raquo;")), l
    }

    function Q(e, t, n, r) {
        if (t === Te) {
            var a = geByClass1("_im_mess_" + e.messageId, r);
            if (a) {
                var i = n.tabs[e.peerId];
                a.parentNode.innerHTML = getTemplate("im_msg_row", {
                    msg_id: e.messageId,
                    from_id: e.peerId,
                    text: q(e, i) + n.chat_photo_msg,
                    ts: e.date,
                    cls: "im-mess_srv"
                })
            }
        }
        return r
    }

    function K(e) {
        return e.replace(/&lt;&lt;/g, "&laquo;")
            .replace(/&gt;&gt;/g, "&raquo;")
            .replace(/ \-\-/g, " &mdash;")
            .replace(/\-\- /g, "&mdash; ")
    }

    function W(e) {
        return e === vk.id
    }

    function V(e, t) {
        return e.tt = !1, showTooltip(e, {
            url: v(t) ? "al_groups.php" : "al_profile.php",
            params: {
                act: "verified_tt",
                mid: t,
                gid: t
            },
            slide: 15,
            ajxdt: 200,
            showdt: 200,
            hidedt: 200,
            dir: "auto",
            shift: [94, 7, 7],
            className: "verified_tt"
        })
    }

    function Z(e) {
        return (0, de.toArray)(geByClass("page_media_link_img", e))
            .forEach(function(e) {
                var t = intval(domData(e, "height")),
                    n = intval(domData(e, "width"));
                if (n > 0 && t > 0) {
                    var r = e.parentNode.getBoundingClientRect()
                        .width,
                        a = t * (r / n);
                    attr(e, "height", a)
                }
            }), e
    }

    function Y(e) {
        return function(t) {
            var n = arguments.length <= 1 || void 0 === arguments[1] ? "bottom" : arguments[1],
                r = arguments.length <= 2 || void 0 === arguments[2] ? "" : arguments[2],
                a = se(getTemplate("im_preloader", {
                    preloader: rs(vk.pr_tpl, {
                        id: ""
                    }),
                    cls: ["bottom" === n ? "im-preloader_bottom" : "im-preloader_top", r].join(" ")
                }));
            "bottom" === n ? e.appendChild(a) : e.insertBefore(a, domFC(e)), addClass(a, "im-preloader_visible"), t.then(function() {
                removeClass(a, "im-preloader_visible"), a.parentNode && a.parentNode.removeChild(a)
            })
        }
    }

    function $(e, t) {
        return {
            0: {
                msgs: e.reduce(function(e, t) {
                    return e[t] = [0, 0, 1], e
                }, {}),
                hash: t,
                history: 1
            }
        }
    }

    function X(e, t) {
        var n = e;
        if (!t && !n) return !1;
        var r = n.target || n.srcElement,
            a = 4,
            i = !1,
            o = /_im_mess|im_log_act|im_log_ract|_im_log_body|im_log_rspacer|page_media_link_desc/;
        do
            if (!r || r.onclick || r.onmousedown || "A" == r.tagName || "IMG" == r.tagName && !hasClass(r, "emoji") && !hasClass(r, "emoji_css") && !hasClass(r, "im_gift") ||
                "TEXTAREA" == r.tagName || hasClass(r, "play_new") || (i = o.test(r.className))) break;
        while (a-- && (r = r.parentNode));
        if (!i) return !0;
        var s = trim((window.getSelection && window.getSelection() || document.getSelection && document.getSelection() || document.selection && document.selection.createRange()
                .text || "")
            .toString());
        return s ? !0 : !1
    }

    function J(e, t) {
        return '<div class="im-mess--text">\n      <span>' + getLang("mail_restored") + '</span>\n      <a class="_im_go_to" href="/im?sel=' + k(e) + "&msgid=" + t + '">' +
            getLang("mail_im_goto_conversation") + "</a>\n    </div>"
    }

    function ee(e, t) {
        return showFastBox({
            title: getLang("mail_deleteall1"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, e > 2e9 ? getLang("mail_chat_sure_to_delete_all") : getLang("mail_sure_to_delete_all"), getLang("mail_delete"), t, getLang("global_cancel"))
    }

    function te(e, t, n, r, a) {
        t.showProgress(), e.set(r.bind(null, a))
            .then(function() {
                t.hideProgress(), t.hide(), n()
                    .removePeer(e, a), n()
                    .updateDialogFilters(e)
            })
    }

    function ne(e, t, n, r, a) {
        var i = e.get()
            .peer;
        cancelEvent(r), showBox("al_im.php", {
            act: "a_show_members_box",
            chat: i - 2e9
        }, {
            stat: ["boxes.css"],
            params: {
                dark: 1
            },
            onDone: function(r, a) {
                r.setControlsText('<button type="button" class="im-page-btn _im_invite_box">' + getLang("mail_im_create_chat_with") + "</button>"), (0, ce.addDelegateEvent)
                    (r.bodyNode.parentNode, "click", "_im_invite_box", function() {
                        r.hide(), ae(e, e.get()
                            .peer, t, n)
                    })
            }
        }, r)
    }

    function re(e, t, n, r, a) {
        return a()
            .loadingPeer(e), e.set(n.bind(null, t, !1))
            .then(function() {
                return a()
                    .changePeer(!1, e)
            })
            .then(function() {
                return e.set(r.bind(null, !0))
            })
            .then(function() {
                return a()
                    .selectPeer(e)
            })
    }

    function ae(e, t, n, r) {
        var a = Object.keys(e.get()
                .tabs[t].data.members)
            .filter(function(n) {
                return !e.get()
                    .tabs[t].data.members[n].kicked
            })
            .map(function(e) {
                return intval(e)
            });
        e.set(r.bind(null, "add_member", a))
            .then(n()
                .showCreation)
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.selectionRemove = t.SHOW_CHAT_MEMBERS_CLASS = t.DESLECT_ALL_CLASS = t.CHAT_PHOTO_REMOVE = t.CHAT_PHOTO_UPDATE = t.CHAT_KICK_USER = t.CHAT_INVITE_USER = t.CHAT_TITLE_ACTION =
        t.CREATE_CHAT_ACTION = t.TYPING_CLASS = t.LAST_ACT_CLASS = t.RESTORE_CLASS = t.ORIGINAL_CLASS = t.FAILED_CLASS = t.SENDING_CLASS = void 0;
    var ie = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
    };
    t.fixTableCellChildHeight = a, t.renderSticker = i, t.isAlreadyDeleted = o, t.replaceMessageAttrs = s, t.renderAttach = l, t.dayFromVal = u, t.appendToHistory = c, t.restoreQueue =
        d, t.markMessagesAsRead = g, t.replaceAttaches = f, t.isDuplicate = m, t.isReservedPeer = p, t.isUserPeer = _, t.isChatPeer = h, t.isComunityPeer = v, t.isPeerActive =
        b, t.isFullyLoadedTab = C, t.isTabLoaded = T, t.parseMessage = S, t.convertPeerToUrl = k, t.chatActions = P, t.renderPhotos = L, t.renderPhotosFromTab = M, t.renderMessagesSearch =
        x, t.setMessageError = O, t.startResendMessage = D, t.removeMessages = B, t.removeMessagesWithRestore = N, t.restoreMessage = j, t.formatTyper = R, t.renderEmptySearch =
        H, t.isServiceMsg = G, t.renderServiceMsg = q, t.addChatPhotoToUpdate = Q, t.replaceSpecialSymbols = K, t.isSelfMessage = W, t.showVerifiedTooltip = V, t.fixSnippetsHeight =
        Z, t.wrapLoading = Y, t.tabFromIds = $, t.checkSelectClick = X, t.renderGoTo = J, t.showFlushDialog = ee, t.cleanHistory = te, t.showChatMembers = ne, t.selectAnotherPeer =
        re, t.inviteUser = ae;
    var oe = n(75),
        le = n(82),
        ue = r(le),
        ce = n(5),
        de = n(80),
        ge = t.SENDING_CLASS = "_im_mess_sending",
        fe = t.FAILED_CLASS = "_im_mess_faild",
        me = t.ORIGINAL_CLASS = "_im_mess_original",
        pe = t.RESTORE_CLASS = "_im_mess_restore",
        _e = t.LAST_ACT_CLASS = "_im_last_act",
        he = t.TYPING_CLASS = "_im_typing",
        ve = t.CREATE_CHAT_ACTION = "chat_create",
        ye = t.CHAT_TITLE_ACTION = "chat_title_update",
        be = t.CHAT_INVITE_USER = "chat_invite_user",
        Ce = t.CHAT_KICK_USER = "chat_kick_user",
        Te = t.CHAT_PHOTO_UPDATE = "chat_photo_update",
        Ee = t.CHAT_PHOTO_REMOVE = "chat_photo_remove",
        we = t.DESLECT_ALL_CLASS = "_im_deselect_all";
    t.SHOW_CHAT_MEMBERS_CLASS = "_im_show_chat_mems", t.selectionRemove = '<span class="im-deselect ' + we + '"></span>'
}, function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    t.OUR_DOMAINS = /^([a-zA-Z0-9\.\_\-]+\.)?(vkontakte\.ru|vk\.com|vkadre\.ru|vshtate\.ru|userapi\.com|vk\.me)$/, t.ENTITIES = /([^a-zA-Z0-9#%;_\-.\/?&=\[\]])/g, t.VK_DOMAIN =
        /^(?:https?:\/\/)?(?:vk\.com|vkontakte\.ru)?\/([a-zA-Z0-9\._]+)\??$/, t.EMAIL = /([a-zA-Z\-_\.0-9]+@[a-zA-Z\-_0-9]+\.[a-zA-Z\-_\.0-9]+[a-zA-Z\-_0-9]+)/g, t.TOP_DOMAINS =
        "info,name,academy,aero,arpa,coop,media,museum,mobi,travel,xxx,asia,biz,com,net,org,gov,mil,edu,int,tel,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,ax,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cd,cf,cg,ch,ci,ck,cl,cm,cn,co,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,er,es,et,eu,fi,fj,fk,fm,fo,fr,ga,gd,ge,gf,gg,gh,gi,gl,gm,gn,gp,gq,gr,gs,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,im,in,io,iq,ir,is,it,je,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,mk,ml,mm,mn,mo,mp,mq,mr,ms,mt,mu,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,ps,pt,pw,py,qa,re,ro,ru,rs,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,ss,st,su,sv,sx,sy,sz,tc,td,tf,tg,th,tj,tk,tl,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,um,us,uy,uz,va,vc,ve,vg,vi,vn,vu,wf,ws,ye,yt,yu,za,zm,zw,рф,укр,сайт,онлайн,срб,cat,pro,local",
        t.MESSAGE_REGEXP =
        /(^|[^A-Za-z0-9А-Яа-яёЁ\-\_])(https?:\/\/)?((?:[A-Za-z\$0-9А-Яа-яёЁ](?:[A-Za-z\$0-9\-\_А-Яа-яёЁ]*[A-Za-z\$0-9А-Яа-яёЁ])?\.){1,5}[A-Za-z\$рфуконлайнстРФУКОНЛАЙНСТ\-\d]{2,22}(?::\d{2,5})?)((?:\/(?:(?:\&amp;|\&#33;|,[_%]|[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.~=;:]+|\[[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\))*(?:,[_%]|[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.~=;:]*[A-Za-z0-9А-Яа-яёЁ\_#%?+\/\$~=]|\[[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\)))?)?)/gi
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return n._sortedEls = !1, e = e.filter(function(e) {
            return !n.ids[t(e)]
        }), a(e, t, n), n.elements = n.elements.concat(e), Promise.resolve(n)
    }

    function a(e, t, n) {
        n.ids = e.map(t)
            .reduce(function(e, t) {
                return e[t] = !0, e
            }, n.ids)
    }

    function i(e, t, n) {
        return n.ids = {}, n.scrolls = t, a(n.elements, e, n), Promise.resolve(n)
    }

    function o(e, t, n) {
        return n.elements = e, n.ids = {}, n._sortedEls = !1, a(e, t, n), Promise.resolve(n)
    }

    function s(e, t, n) {
        return n.elements = n.elements.filter(function(n) {
            return t(n) !== e
        }), delete n.ids[e], Promise.resolve(n)
    }

    function l(e) {
        return e.offset += e.limit, Promise.resolve(e)
    }

    function u(e, t) {
        return t.offset = e, Promise.resolve(t)
    }

    function c(e) {
        return e.stop = !0, Promise.resolve(e)
    }

    function d(e) {
        return e.stop = !1, Promise.resolve(e)
    }

    function g(e, t) {
        return t.pipeId = e, Promise.resolve(t)
    }

    function f(e, t) {
        return t._sortedEls || !e ? t.elements : (t.elements = t.elements.sort(e), t._sortedEls = !0, t.elements)
    }

    function m(e, t) {
        return "undefined" != typeof e && t.elements.length > 0 && (t.scrolled = e), Promise.resolve(t)
    }

    function p(e) {
        var t = {};
        return e.forEach(function(e) {
                "r" === e[0] && t["a," + e[1]] ? delete t["a," + e[1]] : t[e[0] + "," + e[1]] = e
            }), Object.keys(t)
            .map(function(e) {
                return t[e]
            })
    }

    function _(e, t) {
        for (var n = [], r = Math.max(e.length, t.length), a = 0; r > a; a++) {
            if (e[a]) var i = e[a];
            if (t[a]) var o = t[a];
            !i && o ? n.push(["a", o, a]) : i && !o ? n.push(["r", i, a]) : i !== o && (n.push(["r", i, a]), n.push(["a", o, a])), i = !1, o = !1
        }
        var s = p(n),
            l = p(n.reverse());
        return s.length > l.length ? l : s
    }

    function h(e, t, n, r, a, i) {
        for (var o = 0; r > o; o++) e = domNS(e);
        var s = se(a(t));
        return domData(s, "list-id", n), e ? i.insertBefore(s, e) : i.appendChild(s), e
    }

    function v(e, t, n, r) {
        if (0 !== t.length) {
            t = t.sort(function(e, t) {
                return e[2] - t[2]
            });
            var a = t.filter(function(e) {
                    return "a" === e[0]
                }),
                i = t.filter(function(e) {
                    return "r" === e[0]
                });
            i.map(function(t) {
                    return e.children[t[2]]
                })
                .forEach(function(e) {
                    return re(e)
                });
            if (0 !== a.length)
                for (var o = a.shift(), s = o[2], l = h(e.children[s], n[o[2]], o[1], 0, r, e), u = 0; u < a.length; u++) {
                    o = a[u];
                    var c = n[o[2]];
                    l = h(e.children[s], c, o[1], o[2] - s, r, e), s = o[2]
                }
        }
    }

    function y(e, t, n, r) {
        var a = r.get()
            .limit,
            i = r.get()
            .offset,
            o = (n()
                .sortFn, f(n()
                    .sortFn, r.get()));
        o = o.slice(0, i + a);
        var s = (0, A.toArray)(e.children)
            .map(function(e) {
                return domData(e, "list-id")
            }),
            l = o.map(function(e) {
                return n()
                    .idFn(e)
                    .toString()
            }),
            u = _(s, l);
        v(e, u, o, n()
            .renderFn), t.update(!1, !0)
    }

    function b(e, t) {
        if (e.get()
            .loading || e.get()
            .stop) return Promise.resolve([]);
        e.get()
            .loading = !0;
        for (var n = arguments.length, r = Array(n > 2 ? n - 2 : 0), a = 2; n > a; a++) r[a - 2] = arguments[a];
        return t.apply(void 0, r)
            .then(function(t) {
                e.get()
                    .loading = !1
            })
    }

    function C(e, t) {
        return t.scrolls || (t.scrolls = {}), t.scrolls[e] || (t.scrolls[e] = {
            scrolled: t.scrolled,
            scrollItem: t.scrollItem
        }), Promise.resolve(t)
    }

    function T(e, t) {
        return delete t.scrolls[e], Promise.resolve(t)
    }

    function E(e, t, n, r, a) {
        var i = e.get()
            .elements,
            o = e.set(l)
            .then(function(r) {
                var o, s = e.get()
                    .offset,
                    l = e.get()
                    .limit;
                return l + s > i.length ? o = n()
                    .more(s, l)
                    .then(function(t) {
                        return t === !1 ? [] : (0 === t.length && e.set(c), t)
                    })
                    .then(S.bind(null, e, t, a, n, e.get()
                        .pipeId)) : (o = Promise.resolve(), y(t, a, n, e)), o
            });
        return r || (0, I.wrapLoading)(t)(o, "bottom", "im-preloader_fixed-bottom"), o
    }

    function w(e, t) {
        var n = e.get()
            .pipeId;
        return !("undefined" != typeof n && "undefined" != typeof t && n !== t)
    }

    function S(e, t, n, a, i, o) {
        return w(e, i) ? e.set(r.bind(null, o, a()
                .idFn))
            .then(y.bind(null, t, n, a)) : !1
    }

    function k(e, t, n) {
        var r = b.bind(null, t, E.bind(null, t, e, n)),
            a = function(e) {
                return t.set(m.bind(null, e))
            },
            l = (0, L.createScroll)(e, {
                nokeys: !0,
                shadows: !0,
                nomargin: !0,
                nativeScroll: t.get()
                    .nativeScroll,
                hidden: !0,
                scrollChange: a,
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto",
                more: r.bind(null, !1)
            });
        return t.set(i.bind(null, n()
            .idFn, {})), (0, P.addDelegateEvent)(e, "click", t.get()
            .elCls, n()
            .onClick), {
            pipe: function(r, a) {
                return t.set(g.bind(null, a)), r.then(S.bind(null, t, e, l, n, a))
            },
            pipeReplace: function(r, a) {
                return t.set(g.bind(null, a)), t.set(d), r.then(function(r) {
                    return w(t, a) ? t.set(o.bind(null, r, n()
                            .idFn))
                        .then(y.bind(null, e, l, n)) : void 0
                })
            },
            wipe: function() {
                e.innerHTML = ""
            },
            saveScroll: function(e) {
                return t.set(C.bind(null, e))
            },
            updateScroll: function() {
                l.update(!1, !0)
            },
            toTop: function() {
                l.scrollTop(0)
            },
            scrollTop: function(e) {
                l.scrollTop(e)
            },
            restoreScroll: function(e) {
                var n = t.get()
                    .scrolls[e];
                n && (t.set(T.bind(null, e)), l.scrollTop(n.scrolled))
            },
            checkMore: function(e) {
                return t.get()
                    .elements.length < t.get()
                    .limit ? r(e, l) : Promise.resolve([])
            },
            add: function(r, a) {
                return S(t, e, l, n, a, r)
            },
            reset: function() {
                var e = t.get()
                    .scrolls;
                t.reset(), t.set(i.bind(null, n()
                    .idFn, e))
            },
            unsetScroll: function(e) {
                t.set(T.bind(null, e))
            },
            isLoading: function() {
                return t.get()
                    .loading
            },
            scrollTo: function(r) {
                var a = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1],
                    i = arguments.length <= 2 || void 0 === arguments[2] ? 0 : arguments[2],
                    o = arguments.length <= 3 || void 0 === arguments[3] ? 0 : arguments[3],
                    s = t.get()
                    .elements,
                    c = s.map(n()
                        .idFn)
                    .indexOf(r);
                if (!(0 > c)) {
                    var d;
                    d = t.get()
                        .limit + t.get()
                        .offset < c ? t.set(u.bind(null, c - t.get()
                            .limit + 1))
                        .then(y.bind(null, e, l, n)) : Promise.resolve(), d.then(function() {
                            var t = e.children[c],
                                n = l.scrollTop(),
                                r = l.getScrollHeight(),
                                s = t.offsetHeight;
                            "center" === i && (i = -l.getScrollHeight() / 2);
                            var u = t.offsetTop - i,
                                d = a ? function(e) {
                                    l.smoothScroll(e - l.scrollTop())
                                } : l.scrollTop.bind(l);
                            "center" === o && (o = r / 2), n > u ? d(u) : u + s > n + r && d(u + s - r + o)
                        })
                }
            },
            getCurrentElements: function() {
                return t.get()
                    .elements
            },
            remove: function(r) {
                t.set(s.bind(null, r, n()
                        .idFn))
                    .then(y.bind(null, e, l, n))
            },
            unmount: function() {
                (0, P.removeDelegateEvent)(e, "click", t.get()
                    .elCls, n()
                    .onClick), l.destroy()
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = k;
    var P = n(5),
        I = n(81),
        A = n(80),
        L = n(84)
}, function(e, t) {
    "use strict";

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        return t.nativeScroll ? new i(e, t) : new Scrollbar(e, t)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var a = function() {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
            }
        }
        return function(t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t
        }
    }();
    t.createScroll = r;
    var i = function() {
        function e(t, r) {
            n(this, e), this.el = bodyNode, this.opts = r, this.scrollListener = this.onScroll.bind(this), this.resizeListener = this.resize.bind(this), addEvent(
                    window, "scroll", this.scrollListener), addEvent(window, "resize", this.resizeListener), this.innerHeight = window.innerHeight, this.prevScroll =
                this.scrollTop()
        }
        return a(e, [{
            key: "update",
            value: function() {}
        }, {
            key: "resize",
            value: function() {
                this.innerHeight = window.innerHeight
            }
        }, {
            key: "scrollTop",
            value: function(e) {
                return "undefined" == typeof e ? this.el.scrollTop : void(this.el.scrollTop = e)
            }
        }, {
            key: "contHeight",
            value: function() {
                return this.el.scrollHeight
            }
        }, {
            key: "smoothScroll",
            value: function(e) {
                scrollToY(e + this.el.scrollTop, 300)
            }
        }, {
            key: "scrollBottom",
            value: function(e) {
                if ("undefined" == typeof e) return this.contHeight() - this.innerHeight - this.scrollTop();
                var t = this.contHeight() - e;
                this.scrollTop(t)
            }
        }, {
            key: "onScroll",
            value: function(e) {
                var t = this.scrollTop(),
                    n = t - this.prevScroll,
                    r = this.getScrollHeight();
                this.opts.onScroll && this.opts.onScroll(n, this), this.opts.scrollChange && this.opts.scrollChange(n), this.opts.more && r - t < 2 *
                    this.innerHeight && this.opts.more(this), this.prevScroll = t
            }
        }, {
            key: "getScrollHeight",
            value: function() {
                return this.innerHeight
            }
        }, {
            key: "destroy",
            value: function() {
                removeEvent(window, "scroll", this.scrollListener)
            }
        }]), e
    }()
}, function(e, t) {
    "use strict";

    function n(e) {
        return {
            callMutations: function() {
                if ("function" == typeof e) throw console.trace(), new Error("Mutations are not initialized");
                return e
            },
            bindMutations: function() {
                return e = e.apply(void 0, arguments)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.createMutations = n
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function a(e, t, n, r, a, i, o) {
        removeClass(e, "im-page--history_empty"), g(e, t, n, r, a, i, o)
    }

    function i(e, t, n, r) {
        var a = geByClass1("_im_peer_photo", n);
        removeClass(a, "nim-peer--photo_hidden"), (0, x.isChatPeer)(t) ? (removeClass(geByClass1("_im_peer", n), "nim-peer_online", e.online), val(a,
            '<div class="im-page--chat-photo ' + x.SHOW_CHAT_MEMBERS_CLASS + '">' + (0, x.renderPhotosFromTab)(e) + "</div>"), e.data.kicked && addClass(a,
            "nim-peer--photo_hidden")) : (toggleClass(geByClass1("_im_peer", n), "nim-peer_online", e.online), val(a, rs(r.get()
            .im_peer_img_tpl, {
                peer_photo: e.photo,
                peer_href: e.href
            })))
    }

    function o(e, t, n, r, a) {
        var i = q2ajx(a.getAttribute("href")),
            o = intval(i.msgid);
        o && e.set(M.changePeer.bind(null, e.get()
                .peer, o))
            .then(function() {
                h(n, t, o)
            }), cancelEvent(r)
    }

    function s(e) {
        var t = geByClass1(x.LAST_ACT_CLASS, e);
        t && hide(t)
    }

    function l(e, t) {
        if (!(0, M.isSearchingInplace)(e.get()
                .peer, e.get())) {
            t = c(t)
                .parentNode;
            var n = e.get()
                .peer;
            if ((0, x.isUserPeer)(n) && (0, x.isFullyLoadedTab)(e.get(), n)) {
                var a = e.get()
                    .tabs[n];
                if (!a.last_act || Object.keys(a.typing || {})
                    .length > 0) return;
                if (a.skipped > 0) return;
                var i = getDateText(a.last_act[0], 0),
                    o = geByClass1(x.LAST_ACT_CLASS, t),
                    s = langSex(a.sex, getLang("mail_last_activity_tip", "raw"))
                    .replace("{user}", a.name)
                    .replace("{time}", i);
                if (a.last_act_mobile) {
                    var l;
                    s += getTemplate("im_wrap_mobile", (l = {}, r(l, "class", "im_status_mob_onl"), r(l, "params", "mid: " + n +
                        ", was: 1, appendParentCls: '_im_last_act_wrap', forcetoup: true"), r(l, "attrs", ""), l))
                }
                if (!a.online && o)(domData(o, "time") !== i || intval(domData(o, "peer")) !== n) && (val(o, s), attr(o, "data-time", i), attr(o, "data-peer", n)), show(o);
                else if (!a.online && !o) {
                    var u = getTemplate("im_last_act", {
                        lastact: s
                    });
                    geByClass1("_im_last_act_wrap", t)
                        .appendChild(se(u))
                }
            }
        }
    }

    function u(e, t, n, r) {
        if (hasClass(n.target, "_im_mess_marker")) {
            var a = n.target;
            window.tooltips && (0, O.toArray)(geByClass(x.FAILED_CLASS, t))
                .map(function(e) {
                    return geByClass1("_im_mess_marker", e)
                })
                .filter(function(e) {
                    return e !== a
                })
                .forEach(function(e) {
                    return tooltips.hide(e, {
                        fasthide: !0
                    })
                });
            var i = domData(r, "msgid");
            showTooltip(a, {
                content: getTemplate("im_failed_menu", {
                    id: i
                }),
                appendParentCls: "_chat_body_wrap",
                dir: "down",
                shift: [24, 8],
                hasover: !0
            })
        }
    }

    function c(e) {
        return geByClass1("_im_peer_history", e)
    }

    function d(e) {
        addClass(e, "im-page--history_empty"), c(e)
            .innerHTML = ""
    }

    function g(e, t, n, r, a, o, u) {
        var c = (t.get()
            .tabs || {})[n];
        i(c, n, e, t), o.renderPeer(t);
        var d = geByClass1("_im_peer_history", e);
        if (!t.get()
            .tabHistoryNotChanged) {
            val(geByClass1("_im_page_peer_name", e), c.tab);
            var g = (0, M.strHistory)(c.history);
            toggleClass(e, "im-page--history_empty-hist", !g), g || (g = getLang("mail_im_here_history")), val(d, g), getAudioPlayer(function(e) {
                    return e.updateCurrentPlaying()
                }), t.get()
                .gid || (0, x.fixTableCellChildHeight)("_chat_body_wrap", e), (0, x.fixSnippetsHeight)(d), I(t, r, e), !c.online && (0, x.isUserPeer)(n) ? l(t, e) : s(e)
        }(0, M.isSearchingInplace)(n, t.get()) ? a()
            .showSearch(t): a()
            .cancelSearch(t, !1), u.changePeer(n, t), t.get()
            .msgid ? h(r, e, t.get()
                .msgid) : _(r, e, a, t) || (c.scrollBottom ? r.scrollBottom(c.scrollBottom) : r.scrollBottom(q))
    }

    function f(e, t) {
        var n = t.scrollBottom(),
            r = e.get()
            .peer;
        e.set(M.saveHistoryScroll.bind(null, r, n))
    }

    function m(e, t, n, r, a, i) {
        if (0 !== e.get()
            .peer) {
            var o = (0, x.wrapLoading)(n);
            if ((0, M.isSearchingInplace)(e.get()
                    .peer, e.get()) || r(i), !$ && i.scrollTop() < z) {
                if ((0, M.isSearchingInplace)(e.get()
                        .peer, e.get())) {
                    $ = !0;
                    var l = t()
                        .getSearchResulstModule();
                    return l.isAll(e) ? void($ = !1) : void o(l.loadMore(e)
                        .then(function(n) {
                            $ = !1, n && t()
                                .loadHistory(e.get()
                                    .peer, {}, e, n)
                        }), "up")
                }
                var u = e.get(),
                    c = u.tabs[u.peer];
                c.allShown || ($ = !0, o(e.set(M.loadMoreHistory.bind(null, 0, 0))
                    .then(t()
                        .loadHistory.bind(null, u.peer, {}))
                    .then(function() {
                        $ = !1
                    }), "up"))
            }
            if (!$ && 0 > a && i.scrollBottom() < z) {
                if ((0, M.isSearchingInplace)(e.get()
                        .peer, e.get())) return;
                var u = e.get(),
                    c = u.tabs[u.peer];
                if (c.skipped > 0) {
                    $ = !0, s(n);
                    var d = e.set(M.loadLessHistory)
                        .then(t()
                            .loadHistory.bind(null, u.peer, {
                                reversed: !0
                            }))
                        .then(function() {
                            p(e), $ = !1, y(e, n.parentNode), c.skipped || e.set(M.changePeer.bind(null, e.get()
                                .peer, !1))
                        }),
                        g = n.parentNode;
                    k(g, !0), d.then(k.bind(null, g, !1))
                }
            }
        }
    }

    function p(e) {
        return e.set(M.readLastMessages.bind(null, e.get()
            .peer))
    }

    function _(e, t, n, r) {
        var a = geByClass1("_im_unread_bar_row", t);
        if (a) {
            var i = a.getBoundingClientRect(),
                o = geByClass1("_im_peer_history_w", t)
                .getBoundingClientRect()
                .top + 20;
            return e.scrollTop(e.scrollTop() - o + i.top), m(r, n, c(t), function() {}, 0, e), p(r), !0
        }
        return !1
    }

    function h(e, t, n) {
        var r = geByClass1("_im_mess_" + n, t);
        if (r) {
            var a = r.offsetTop + domPN(r)
                .offsetTop + domPN(domPN(r))
                .offsetTop + domPN(domPN(domPN(r)))
                .offsetTop;
            e.scrollTop(a - e.getScrollHeight() / 2), addClass(r, "im-mess_light"), setTimeout(function() {
                removeClass(r, "im-mess_light")
            }, K)
        }
    }

    function v(e, t, n, r, a) {
        var i = domData(a, "action"),
            o = domData(a, "msgid"),
            s = geByClass1("_im_mess_marker", geByClass1("_im_mess_" + o));
        switch (i) {
            case "resend":
                t(r, a);
                break;
            case "delete":
                e.set(M.removeFailed.bind(null, e.get()
                        .peer, o))
                    .then(function() {
                        (0, x.removeMessages)([o], c(n))
                    })
        }
        tooltips.hide(s, {
            fasthide: !0
        })
    }

    function y(e, t) {
        var n = e.get()
            .peer;
        if (!(0, x.isReservedPeer)(n)) {
            var r = e.get()
                .tabs[n];
            r.skipped > 0 && !(0, M.isSearchingInplace)(e.get()
                .peer, e.get()) ? show(geByClass1(V, t)) : hide(geByClass1(V, t))
        }
    }

    function b(e) {
        var t = geByClass1("_im_unread_bar_row", e);
        t && t.parentNode.removeChild(t)
    }

    function C(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1],
            n = e.scrollBottom();
        return (t ? Q + t : Q) > n
    }

    function T(e, t, n, r) {
        var a = domData(r, "msgid"),
            i = e.get()
            .peer;
        e.get()
            .imQueueResend(i, a), e.set(M.resendMessage.bind(null, i, a)), (0, x.startResendMessage)(i, a, t)
    }

    function E(e, t, n, r, a) {
        var i = intval(domData(a, "peer")),
            o = intval(domData(gpeByClass("_im_mess", a), "msgid")),
            s = e.get()
            .tabs[i].hash;
        return (0, M.restoreMessageSend)(o, i, s), e.set(M.restoreMessage.bind(null, o, i))
            .then(x.restoreMessage.bind(null, o, i, c(t)))
            .then(function() {
                return I(e, n, t)
            }), !1
    }

    function w(e, t) {
        e()
            .showCreation(t)
    }

    function S(e, t, n) {
        e.set(M.prepareForward.bind(null, []))
            .then(function() {
                t()
                    .changePeer(!1, e), removeClass(n, "im-page--history_fwd")
            })
    }

    function k(e, t) {
        var n = geByClass1(V, e);
        toggleClass(n, "im-to-end_loading", t)
    }

    function P(e, t, n) {
        k(n, !0), t.set(M.changePeer.bind(null, t.get()
                .peer, !1))
            .then(function(e) {
                return t.set(M.loadPeer.bind(null, t.get()
                    .peer, !0, -1))
            })
            .then(function(r) {
                k(n, !1), e()
                    .changePeer(t)
            })
    }

    function I(e, t, n) {
        if (e.get()
            .gid) {
            var r = t.contHeight(),
                a = geByClass1("_im_chat_input_w", n),
                i = geByClass1("_im_peer_history_w", n);
            return setStyle(i, {
                paddingBottom: a.offsetHeight
            }), t.contHeight() - r
        }(0, x.fixTableCellChildHeight)("_chat_body_wrap", n);
        var r = t.getScrollHeight();
        t.update(!1, !0);
        var o = t.getScrollHeight();
        return r - o
    }

    function A(e, t, n, r, o, l, u, f, m, p, _, v, T, E, w, S, k, P) {
        var A;
        return {
            changePeer: function(i) {
                var s = arguments.length <= 1 || void 0 === arguments[1] ? !0 : arguments[1];
                if (0 === i.get()
                    .peer) return d(e);
                if ((0, x.isFullyLoadedTab)(i.get(), i.get()
                        .peer)) {
                    removeClass(e, "im-page--history_search"), i.set(M.dropSelection), n.changeActions(i);
                    var l = i.get()
                        .peer,
                        u = i.get()
                        .prevPeer;
                    return removeClass(e, "im-page--history_loading"), s && r.restoreDraft(i), o()
                        .updateTyping({
                            peerId: l
                        }, i), y(i, e), 0 !== u || (0, x.isReservedPeer)(l) ? (0, x.isReservedPeer)(u) || (0, x.isReservedPeer)(l) ? void 0 : g(e, i, l, t, o, n, _) :
                        a(e, i, l, t, o, n, _)
                }
            },
            loadingPeer: function(t) {
                (0, M.isAnythingLoading)(t.get()) || (removeClass(e, "im-page--history_empty"), addClass(e, "im-page--history_loading"))
            },
            deselectDialog: function(e) {
                l()
                    .removeSelection(e)
            },
            replaceMessageAttrs: function(t, n) {
                (0, x.replaceMessageAttrs)(n.get(), c(e), t)
            },
            cleanSelection: function(e) {
                T.cleanSelection(e)
            },
            updateDialogFilters: function(e) {
                l()
                    .updateDialogFilters(e)
            },
            getSearchResulstModule: function() {
                return A
            },
            insertSearch: function(n, r) {
                addClass(e, "im-page--history_search"), s(e), n ? (removeClass(e, "im-page--history_search-empty"), c(e)
                    .innerHTML = n) : (addClass(e, "im-page--history_search-empty"), c(e)
                    .innerHTML = (0, x.renderEmptySearch)()), I(r, t, e), t.scrollBottom(0), y(r, e)
            },
            updateChatTopic: function(e, t) {
                l()
                    .updateDialog(e, t), e === t.get()
                    .peer && n.renderPeer(t)
            },
            updateChatPhoto: function(n, r, a) {
                if ((0, x.isPeerActive)(n.peerId, a.get())) {
                    var o = a.get()
                        .tabs[n.peerId];
                    i(o, n.peerId, e, a);
                    var s = C(t);
                    (0, x.addChatPhotoToUpdate)(n, r, a.get(), c(e)), s && t.scrollBottom(q)
                }
            },
            markImportant: function(t, r, a) {
                var i = geByClass1("_im_mess_" + t, e);
                i && (n.changedMessageSelection(a), v.markImportant(t, r, a))
            },
            loadHistory: function(n, r, a) {
                var i = arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3],
                    o = a.get();
                if ((0, x.isPeerActive)(n, o)) {
                    var s = i || o.tabs[n].historyToAppend;
                    if (!s) return;
                    var l = geByClass1("_im_peer_history", e),
                        u = domFC(l),
                        c = t.scrollBottom(),
                        d = (geByClass1(x.TYPING_CLASS, l), r.reversed ? function(e) {
                            return l.appendChild(e)
                        } : function(e) {
                            return l.insertBefore(e, u)
                        }),
                        g = ce("div");
                    g.innerHTML = s, d(g), (0, x.fixSnippetsHeight)(g), r.reversed || t.scrollBottom(c), t.update(!1, !0)
                }
            },
            sendMessage: function(e) {
                0 !== e.get()
                    .peer && r.sendMessage()
            },
            addMessage: function(n, r) {
                if (!(0, M.isSearchingInplace)(r.peerId, n.get()) && (0, x.isPeerActive)(r.peerId, n.get())) {
                    if (geByClass1("_im_mess_" + r.messageId, e)) return;
                    var a = C(t);
                    (0, x.appendToHistory)(n.get(), r, c(e)), removeClass(e, "im-page--history_empty-hist"), b(e), (r.local || a) && t.scrollBottom(0), o()
                        .updateTyping(r, n), (0, O.toArray)(geByClass("_im_history_tooltip", e))
                        .forEach(hide)
                }
            },
            setMessageErrored: function(t, n, r) {
                (0, x.setMessageError)(t, n, e)
            },
            markMessagesAsRead: function(t, n) {
                t.get()
                    .peer === n.peerId && (0, x.markMessagesAsRead)(t.get(), n.peerId, e)
            },
            hideFwd: function(t) {
                removeClass(e, "im-page--history_fwd")
            },
            updateTyping: function(t, n) {
                if (!(0, M.isSearchingInplace)(t.peerId, n.get())) {
                    var r = n.get();
                    if (n.get()
                        .peer === t.peerId && (0, x.isFullyLoadedTab)(r, t.peerId)) {
                        var a = geByClass1(x.TYPING_CLASS, e);
                        if (!a) {
                            a = se(getTemplate("im_typing", {}));
                            var i = geByClass1("_im_typer_c", e);
                            i.appendChild(a)
                        }
                        var o = (0, x.formatTyper)(n.get()
                            .tabs[t.peerId].typing, t.peerId, !1, n.get());
                        val(geByClass1("_im_typing_name", a), o), o ? (s(e), addClass(a, "im-page--typing_vis")) : removeClass(a, "im-page--typing_vis")
                    }
                }
            },
            scrollFix: function(e, n, r) {
                (0, x.isPeerActive)(n, e.get()) && C(t, r) && t.scrollBottom(q)
            },
            newMessage: function(e, t) {
                l()
                    .newMessage(e, t)
            },
            scroll: function(e, n) {
                var r = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2];
                if (0 !== e.get()
                    .peer) {
                    var a = r ? t.getScrollHeight() : 40;
                    a = "up" === n ? -a : a, r ? t.smoothScroll(a, function() {
                        S(a, t)
                    }) : (t.scrollTop(t.scrollTop() + a), S(a, t))
                }
            },
            showCreation: function(e, t) {
                l()
                    .showCreation(e, t)
            },
            updateScroll: function() {
                return I(k, t, e)
            },
            updateOnline: function(t, r) {
                if ((0, x.isTabLoaded)(r.get(), t)) {
                    var a = r.get()
                        .tabs[t].online;
                    if (t === r.get()
                        .peer) {
                        var i = geByClass1("_im_peer", e);
                        toggleClass(i, "nim-peer_online", a), n.renderPeer(r), a && s(e)
                    }
                }
            },
            replaceAttachmentPlaceholders: function(n, r) {
                if ((0, x.isPeerActive)(r.peerId, n.get())) {
                    var a = C(t);
                    (0, x.replaceAttaches)(e, r, n.get()), a && t.scrollBottom(0)
                }
            },
            removeMessages: function(n, r, a) {
                a.get()
                    .peer === r && ((0, x.removeMessages)(n, c(e)), I(a, t, e))
            },
            removeMessagesRestore: function(t, n, r, a) {
                a.get()
                    .peer === n && (0, x.removeMessagesWithRestore)(t, n, r, c(e))
            },
            updateState: function(e, t) {
                l()
                    .updateState(e, t)
            },
            updateChat: function(t, a) {
                if (t.get()
                    .peer === a) {
                    var o = t.get()
                        .tabs[a];
                    n.changeActions(t), i(o, a, e, t), n.renderPeer(t), r.updateState(t)
                }
            },
            focustTxt: function(e) {
                r.focusOn(e)
            },
            showSearch: function(t) {
                addClass(e, "im-page--hisory_search-open"), _.focus(t), A = (0, R.mount)(e, t, o)
            },
            cancelSearch: function(n) {
                var r = arguments.length <= 1 || void 0 === arguments[1] ? !0 : arguments[1];
                if (removeClass(e, "im-page--hisory_search-open"), removeClass(e, "im-page--history_search"), removeClass(e, "im-page--history_search-empty"), A && (A.unmount(),
                        A = !1), r && !(0, x.isReservedPeer)(n.get()
                        .peer)) {
                    var a = n.get()
                        .tabs[n.get()
                            .peer];
                    c(e)
                        .innerHTML = (0, M.strHistory)(a.history), I(n, t, e), t.scrollBottom(0), n.get()
                        .msgid && (h(t, e, n.get()
                            .msgid), y(n, e)), P(t)
                }
            },
            unmount: function() {
                (0, D.removeDelegateEvent)(e, "click", x.FAILED_CLASS, u), (0, D.removeDelegateEvent)(e, "click", x.RESTORE_CLASS, f), (0, D.removeDelegateEvent)(e,
                    "click", W, p), removeEvent(geByClass1("_im_start_new", e), "click", E), removeEvent(geByClass1(V, e), "click", w), t.destroy(), r.unmount(), n.unmount(),
                    v.unmount(), T.unmount(), clearInterval(m)
            },
            removePeer: function(e, t) {
                l()
                    .removePeer(e, t)
            },
            respond: function(e, n) {
                r.attachMessages(e, n), r.focusOn(e), t.scrollBottom(q)
            },
            startForward: function(t) {
                addClass(e, "im-page--history_fwd"), geByClass1("_im_explain_fwd", e)
                    .textContent = getLang("mail_explain_fwd", t.get()
                        .pendingForward.length), l()
                    .removeSelection(t)
            }
        }
    }

    function L(e, t, n) {
        var r = geByClass1("_im_peer_history_w", e);
        show(r);
        var a = (0, B.createMutations)(A),
            s = a.callMutations,
            d = a.bindMutations,
            g = function(e) {
                var t = debounce(e, 100),
                    n = throttle(e, 100);
                return function(e) {
                    t(e), n(e)
                }
            }(f.bind(null, t)),
            p = m.bind(null, t, s, r, g),
            b = (0, G.createScroll)(r, {
                onScroll: p,
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto",
                nomargin: !0,
                shadows: !0,
                nokeys: !0,
                hidden: !0,
                nativeScroll: t.get()
                    .gid
            });
        if ((0, x.isChatPeer)(t.get()
                .peer)) {
            var C = t.get();
            i(C.tabs[C.peer], C.peer, e, t)
        }
        setTimeout(function() {
            t.get()
                .msgid ? h(b, e, t.get()
                    .msgid) : _(b, e, s, t) || b.scrollBottom(q), y(t, e)
        }, 15);
        var k = (0, F.mount)(geByClass1("_im_dialog_actions", e), t, s),
            I = (0, N.mount)(geByClass1("_im_text_input", e), t, s),
            L = (0, j.mount)(geByClass1("_im_history_search", e), t, s),
            O = (0, U.mount)(e, t, s),
            R = (0, H.mount)(e, t, function() {
                return {
                    changedMessageSelection: k.changedMessageSelection
                }
            });
        (0, x.isReservedPeer)(t.get()
            .peer) || t.set(M.restoreHistoryQueue.bind(null, t.get()
                .peer))
            .then(function(n) {
                (0, x.restoreQueue)(t.get()
                    .peer, t.get(), c(e))
            });
        var z = T.bind(null, t, e),
            Q = E.bind(null, t, e, b),
            K = S.bind(null, t, n, e),
            $ = w.bind(null, n, t),
            X = P.bind(null, s, t, e),
            J = u.bind(null, t, e),
            ee = v.bind(null, t, z, e),
            te = x.showChatMembers.bind(null, t, s, M.setCreationType),
            ne = o.bind(null, t, e, b);
        (0, D.addDelegateEvent)(e, "click", x.RESTORE_CLASS, Q), (0, D.addDelegateEvent)(e, "mouseover", x.FAILED_CLASS, J), (0, D.addDelegateEvent)(e, "click", W, K), (0,
            D.addDelegateEvent)(e, "click", Z, ee), (0, D.addDelegateEvent)(e, "click", x.SHOW_CHAT_MEMBERS_CLASS, te), (0, D.addDelegateEvent)(e, "click", Y, ne),
        addEvent(geByClass1("_im_start_new", e), "click", $), addEvent(geByClass1(V, e), "click", X);
        var re = setInterval(l.bind(null, t, e), 1e3);
        return d(e, b, k, I, s, n, z, Q, re, K, L, O, R, $, X, p, t, g)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = L;
    var M = n(73),
        x = n(81),
        O = n(80),
        D = n(5),
        B = n(85),
        F = n(87),
        N = n(88),
        j = n(92),
        R = n(93),
        U = n(94),
        H = n(95),
        G = n(84),
        z = 1e3,
        q = -30,
        Q = 30,
        K = 2e3,
        W = "_im_cancel_fwd",
        V = "_im_to_end",
        Z = "_im_failed_action",
        Y = "_im_mess_link",
        $ = !1
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        return !e.map(function(e) {
                return t.msgs[e][2]
            })
            .reduce(function(e, t) {
                return e && t
            })
    }

    function a(e, t, n) {
        var a = geByClass1(E, e),
            i = geByClass1(y, e);
        addClass(i, "im-page--peer_actions"), hide(geByClass1(T, e)), hide(geByClass1(b, e)), addClass(a, "im-page--mess-actions_visible");
        var o = n.get()
            .tabs[n.get()
                .peer],
            s = r(t, o);
        toggleClass(a, "im-page--mess-actions_all-sel", !s);
        var l = getLang("mail_selected", t.length);
        val(i, l.replace("{count}", t.length) + p.selectionRemove), removeClass(e, "im-page--header-chat_verified"), setStyle(i, {
            "max-width": i.parentNode.offsetWidth - a.offsetWidth - 35
        })
    }

    function i(e, t) {
        var n = geByClass1(y, e);
        setStyle(n, {
            "max-width": 280
        }), removeClass(n, "im-page--peer_actions");
        var r = geByClass1(b, e);
        show(geByClass1(T, e)), setStyle(r, {
            display: "inline-block"
        }), removeClass(e, "im-page--header-chat_short"), removeClass(geByClass1(E, e), "im-page--mess-actions_visible"), removeClass(geByClass1(E, e),
            "im-page--mess-actions_all-sel");
        var a = t.get()
            .tabs[t.get()
                .peer];
        val(n, a.tab), n.setAttribute("title", unclean(a.tab));
        var i = t.get()
            .peer,
            a = t.get()
            .tabs[i];
        if (toggleClass(e, "im-page--header-chat_verified", !!a.verified), (0, p.isChatPeer)(i)) {
            var o = Object.keys(a.data.members)
                .filter(function(e) {
                    return !a.data.members[e].closed && !a.data.members[e].kicked
                })
                .length,
                s = a.data.closed || a.data.kicked ? "" : getTemplate("im_chat_members", {
                    name: getLang("mail_im_n_chat_members", o)
                });
            val(r, s)
        } else removeClass(r, "im-page--peer-online_mute"), val(r, a.online ? "online" : ""), a.online || addClass(e, "im-page--header-chat_short");
        toggleClass(r, "im-page--peer-online_mute", inArray(i, t.get()
            .mutedPeers))
    }

    function o(e, t, n, a, i) {
        var o = e.get()
            .selectedMessages,
            s = domData(i, "action"),
            l = e.get()
            .peer;
        switch (s) {
            case "delete":
            case "spam":
                e.set(m.removeMessagesWithRestore.bind(null, o, l, s))
                    .then(t()
                        .removeMessagesRestore.bind(null, o, l, s));
                var u = e.get()
                    .tabs[l];
                (0, m.removeMessageSend)(o, l, u.hash, s);
                break;
            case "forward":
                e.set(m.prepareForward.bind(null, o))
                    .then(function() {
                        t()
                            .startForward(e)
                    });
                break;
            case "star":
                var u = e.get()
                    .tabs[l],
                    d = r(o, u);
                e.set(m.favMessage.bind(null, o, d, l)), e.get()
                    .longpoll.push(o.map(function(e) {
                        return {
                            type: d ? _.SET_FLAGS : _.RESET_FLAGS,
                            messageId: e,
                            peerId: l,
                            flags: _.FLAG_IMPORTANT
                        }
                    }));
                break;
            case "respond":
                e.set(m.forwardMessages.bind(null, o, l))
                    .then(function(e) {
                        t()
                            .respond(e, l)
                    })
        }
        c(e, t, n)
    }

    function s(e, t, n, r, a, i) {
        if ("keydown" !== i.type || 13 === i.which) {
            var o = trim(val(a));
            return o ? (o !== n && e.set(m.updateChatTopic.bind(null, t, o))
                .then(r()
                    .updateChatTopic.bind(null, t)), !0) : (notaBene(a), !1)
        }
    }

    function l(e, t, n) {
        if ((0, p.isChatPeer)(t)) {
            var r = e.get()
                .tabs[t].data.title,
                a = s.bind(null, e, t, r, n),
                i = showFastBox({
                    title: getLang("mail_chat_topic_change_title"),
                    dark: 1
                }, getTemplate("im_chat_change_topic", {
                    value: r
                }), getLang("global_save"), function(e, t) {
                    var n = a(o, t);
                    n && i.hide()
                }, getLang("global_cancel"), function() {
                    i.hide()
                }),
                o = geByClass1(S, i.bodyNode);
            elfocus(o), addEvent(o, "keydown", function(e) {
                var t = a(o, e);
                t && i.hide()
            })
        }
    }

    function u(e, t, n, r, a) {
        var i = domData(a, "action"),
            o = geByClass1(C)
            .parentNode,
            s = e.get()
            .peer;
        switch (i) {
            case "clear":
                var u = (0, p.showFlushDialog)(s, function(n) {
                    (0, p.cleanHistory)(e, u, t, m.flushHistory, e.get()
                        .peer)
                });
                break;
            case "media":
                showWiki({
                    w: "history" + (0, p.convertPeerToUrl)(s) + "_photo"
                });
                break;
            case "search":
                t()
                    .showSearch(e);
                break;
            case "topic":
                l(e, s, t);
                break;
            case "avatar":
                cur.recieveCropResult = void 0, Page.ownerPhoto(s);
                break;
            case "leave":
                var u = showFastBox({
                    title: getLang("mail_chat_leave_title"),
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, getLang("mail_chat_leave_confirm"), getLang("mail_leave_chat"), function() {
                    e.set(m.leaveChat.bind(null, s)), u.hide(), t()
                        .deselectDialog(e), e.set(m.changePeer.bind(null, 0, !1))
                        .then(function() {
                            t()
                                .changePeer(e)
                        })
                }, getLang("global_cancel"), function() {
                    u.hide()
                });
                break;
            case "return":
                e.set(m.returnToChat.bind(null, s));
                break;
            case "unmute":
            case "mute":
                var c = "mute" === i ? 1 : 0;
                e.set(m.toggleMutePeer.bind(null, s, c))
                    .then(t()
                        .updateState.bind(null, s));
                break;
            case "invite":
                if ((0, p.isChatPeer)(s))(0, p.inviteUser)(e, s, t, m.setCreationType);
                else if ((0, p.isUserPeer)(s)) {
                    var d = e.get()
                        .tabs[s],
                        g = [
                            [s, d.tab]
                        ];
                    e.set(m.setCreationType.bind(null, "chat", []))
                        .then(function(n) {
                            return t()
                                .showCreation(e, g)
                        })
                }
        }
        uiActionsMenu.toggle(o, !1)
    }

    function c(e, t, n) {
        var r = e.get()
            .selectedMessages;
        e.set(m.cleanSelected)
            .then(n()
                .changedMessageSelection)
            .then(t()
                .cleanSelection.bind(null, r))
    }

    function d(e, t, n, r, o, s) {
        return {
            changeActions: function(t) {
                var n = geByClass1(C, e),
                    r = geByClass1(T, e),
                    a = t.get()
                    .curActions,
                    i = Object.keys(a)
                    .map(function(e) {
                        var t = "";
                        return 7 === m.ACTION_PRIORITIES[e] && (t = '<div class="ui_actions_menu_sep"></div>'), t + rs(I, a[e])
                    })
                    .join("");
                0 === Object.keys(a)
                    .length ? setStyle(r, {
                        opacity: 0
                    }) : (setStyle(r, {
                        opacity: 1
                    }), val(n, i))
            },
            renderPeer: function(t) {
                i(e, t)
            },
            changedMessageSelection: function(t) {
                var n = t.get()
                    .selectedMessages || [];
                n.length > 0 ? a(e, n, t) : i(e, t)
            },
            unmount: function() {
                (0, h.removeDelegateEvent)(e, "click", w, t), (0, h.removeDelegateEvent)(e, "click", v, n), (0, h.removeDelegateEvent)(e, "click", k, r), (0, h.removeDelegateEvent)
                (e, "click", p.DESLECT_ALL_CLASS, o), (0, h.removeDelegateEvent)(e, "mouseover", P, s)
            }
        }
    }

    function g(e, t, n) {
        var r = (0, f.createMutations)(d),
            a = r.callMutations,
            i = r.bindMutations,
            s = o.bind(null, t, n, a),
            l = u.bind(null, t, n, a),
            g = p.showChatMembers.bind(null, t, n, m.setCreationType),
            _ = c.bind(null, t, n, a),
            y = function(e, n) {
                return (0, p.showVerifiedTooltip)(n, t.get()
                    .peer)
            };
        return (0, h.addDelegateEvent)(e, "click", w, s), (0, h.addDelegateEvent)(e, "click", v, l), (0, h.addDelegateEvent)(e, "click", k, g), (0, h.addDelegateEvent)(e,
            "click", p.DESLECT_ALL_CLASS, _), (0, h.addDelegateEvent)(e, "mouseover", P, y), (0, p.isReservedPeer)(t.get()
            .peer) || setTimeout(function() {
            t.set(m.setActions)
                .then(a()
                    .changeActions)
        }), i(e, s, l, g, _, y)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = g;
    var f = n(85),
        m = n(73),
        p = n(81),
        _ = n(77),
        h = n(5),
        v = "_im_action",
        y = "_im_page_peer_name",
        b = "_im_page_peer_online",
        C = "_im_dialog_actions_items",
        T = "_im_dialog_action_wrapper",
        E = "_im_mess_actions",
        w = "_im_page_action",
        S = "_im_chat_topic_change_input",
        k = "_im_chat_members",
        P = "_im_chat_verified",
        I = '<a class="ui_actions_menu_item ' + v + ' im-action im-action_%icon%" data-action="%icon%">%name%</a>'
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        if (0 === e.length) return [""];
        for (var n = []; e.length > U;) {
            var r = e.substr(0, U)
                .lastIndexOf(" "); - 1 == r && (r = U), n.push(e.substr(0, r)), e = e.substr(r)
        }
        return e.length > 0 && n.push(e), n
    }

    function a(e, t, n) {
        var r = {},
            a = geByClass("emoji", e);
        for (var i in a) r[Emoji.getCode(a[i])] = 1;
        var a = geByClass("emoji_css", e);
        for (var i in a) r[Emoji.getCode(a[i])] = 1;
        var o = geByClass1("_im_rcemoji", t),
            s = "",
            l = 0;
        for (var u in r) {
            var c = ge("im_rc_em_" + u);
            if (c) {
                if (!(n > 2e9) || c.nextSibling) continue;
                re(c)
            }
            ge("im_rc_em_" + u) || (s += getTemplate("im_emoji_line", {
                code: u,
                emoji: Emoji.getEmojiHTML(u, !1, !0)
            }), l -= 22)
        }
        o.insertBefore(cf(s), o.firstChild), setStyle(o, {
            marginLeft: l
        }), animate(o, {
            marginLeft: 0
        }, {
            duration: 150,
            transition: Fx.Transitions.easeOutCubic,
            onComplete: function() {
                var e = geByClass("im_rc_emojibtn", o)
                    .slice(7);
                for (var t in e) re(e[t])
            }
        })
    }

    function i(e) {
        var t = e.filter(function(e) {
            return "fwd" === e[0]
        });
        return e.filter(function(e) {
                return "fwd" !== e[0]
            })
            .map(function(e) {
                return {
                    id: e[1],
                    type: e[0]
                }
            })
            .concat(t.map(function(e) {
                return {
                    type: e[0],
                    messages: e[1]
                }
            }))
    }

    function o(e, t, n, r, a, o) {
        var s = arguments.length <= 6 || void 0 === arguments[6] ? !0 : arguments[6];
        r.get()
            .tabs[t];
        return b(t, r) || C(t, r) ? void 0 : (0, x.getBindAttachToUrl)(t, r.get())
            .then(function(l) {
                var u = Object.keys(l)
                    .filter(function(e) {
                        return e === n.message
                    })
                    .map(function(e) {
                        return l[e]
                    })
                    .map(function(e) {
                        return n.attaches.filter(function(t) {
                                return t.id === e.id && t.type === e.type
                            })
                            .length
                    })
                    .reduce(function(e, t) {
                        return e || t
                    }, !1);
                u && (n.message = "");
                var c = (0, B.random)(),
                    d = {
                        peerId: t,
                        messageId: "rid" + c,
                        flags: L.eventTypes.FLAG_OUTBOUND | L.eventTypes.FLAG_UNREAD,
                        date: intval(Date.now() / 1e3),
                        subject: "",
                        text: (0, O.replaceSpecialSymbols)(clean(n.message))
                            .replace(/\n/gi, "<br>"),
                        local: !0,
                        kludges: {
                            emoji: !0
                        },
                        attaches: i(n.attaches)
                    };
                return n.rid = c, n.mess = d, e(t, n), r.set(x.addMessage.bind(null, d))
                    .then(function() {
                        s && o()
                            .clearText(t, r)
                    })
                    .then(a()
                        .newMessage.bind(null, d, r))
            })
    }

    function s(e, t, n, r, a) {
        var i = e.get()
            .peer;
        l(e, t, !1)
            .then(function(s) {
                o(n, i, {
                    message: "",
                    attaches: a
                }, e, t, r, !1)
            })
    }

    function l(e, t, n) {
        var r = e.get()
            .tabs[e.get()
                .peer];
        return r.skipped > 0 ? (t()
            .loadingPeer(e), e.set(x.changePeer.bind(null, e.get()
                .peer, !1))
            .then(function(t) {
                return e.set(x.loadPeer.bind(null, e.get()
                    .peer, !0, -1))
            })
            .then(function(n) {
                return t()
                    .changePeer(e, !1)
            })
            .then(function(e) {
                return n
            })) : Promise.resolve(n)
    }

    function u(e, t) {
        var n = gpeByClass(q, t.target),
            r = !!intval(domData(n, "val"));
        r !== cur.ctrl_submit && (cur.ctrl_submit = r, e.set(x.changeSubmitSettings.bind(null, r)))
    }

    function c(e, t, n, i, s, u) {
        var c = arguments.length <= 6 || void 0 === arguments[6] ? [] : arguments[6],
            d = geByClass1("_im_send", i);
        if ((0, x.isAnythingLoading)(e.get())) return e.set(x.setDelayedMessage.bind(null, !0))
            .then(function() {
                lockButton(d)
            });
        e.set(x.setDelayedMessage.bind(null, !1))
            .then(function() {
                unlockButton(d)
            });
        var g = e.get(),
            f = g.peer,
            m = geByClass1("_im_text", i);
        Promise.all([(0, x.getAttaches)(e, f), (0, x.getForwardedMessages)(f, e.get())])
            .then(l.bind(null, e, t))
            .then(function(l) {
                var u = A(l, 2),
                    d = u[0],
                    g = u[1];
                d = d.concat(c);
                var p = Emoji.editableVal(m) || "";
                if (p || 0 !== d.length || 0 !== g.length) {
                    g.length > 0 && d.push(["fwd", g]);
                    var _ = r(p);
                    a(m, i, f), _.slice(0, _.length - 1)
                        .forEach(function(r) {
                            o(n, f, {
                                message: r,
                                attaches: []
                            }, e, t, s)
                        });
                    var p = _.slice(-1)[0];
                    o(n, f, {
                        message: p,
                        attaches: d
                    }, e, t, s)
                }
            })
    }

    function d(e, t, n, r) {
        return e.set(x.deliverMessage.bind(null, n, r))
    }

    function g(e, t, n, r) {
        e.set(x.setMessageErrored.bind(null, n, r.mess))
            .then(t()
                .setMessageErrored.bind(null, n, r.mess))
    }

    function f(e, t, n, r, a, i) {
        var o = geByClass1("_im_text", e);
        return addEvent(o, "paste", i), addEvent(o, "focus", function() {
            t.get()
                .longpoll.push([L.eventTypes.transitionEvent("message")]), cur.focused = t.get()
                .peer
        }), addEvent(o, "blur", function() {
            t.get()
                .longpoll.push([L.eventTypes.transitionEvent("default")]), cur.focused = !1
        }), Emoji.init(o, {
            ttDiff: 93,
            rPointer: !0,
            noStickers: cur.gid ? !0 : !1,
            onSend: r.bind(null, []),
            controlsCont: e,
            forceTxt: !t.get()
                .editable,
            checkEditable: n,
            onStickerSend: function(e) {
                a([
                    ["sticker", e]
                ])
            }
        })
    }

    function m(e, t, n, r, a, i, o, s) {
        if (show("_im_media_preview"), !t.get()
            .rebuilding_draft) {
            if ("page" === r) return !1;
            t.set(x.cleanMediaStore.bind(null, t.get()
                .peer));
            var l = s.getMedias()
                .slice()
                .map(function(e) {
                    return e.slice(0, 2)
                }),
                u = [];
            "undefined" != typeof a && r ? (o && t.set(x.bindAttachToUrl.bind(null, t.get()
                    .peer, r, a, o)), u = [
                    [r, a, i]
                ]) : r || "undefined" == typeof a || l.splice(a, 1), l = l.concat(u), l.filter(function(e) {
                    return e
                })
                .forEach(function(e) {
                    t.set(x.addMediaStore.bind(null, e))
                });
            var c = e()
                .updateScroll();
            return e()
                .scrollFix(t, t.get()
                    .peer, c), t.get()
                .delayed_message && !(0, x.isAnythingLoading)(t.get()) ? (n([]), !1) : void 0
        }
    }

    function p(e, t) {
        var n = e.get()
            .ctrl_submit ? 1 : 0;
        return showTooltip(t.target, {
            content: getTemplate("ctrl_submit_hint", {
                enter_on: n ? "" : "on",
                ctrl_on: n ? "on" : ""
            }),
            dir: "down",
            hasover: !0,
            showdt: 700,
            zIndex: 200,
            hidedt: 700,
            appendParentCls: "_page_wrap",
            onCreate: function() {
                radioBtns.im_submit = {
                    els: (0, j.toArray)(geByClass(q)),
                    val: n
                }
            }
        })
    }

    function _(e, t) {
        Emoji.val(e, t), Emoji.focus(e, !0), setTimeout(Emoji.correctCaret.pbind(e), 10)
    }

    function h(e, t) {
        var n = geByClass1(G, t);
        n.innerHTML = getTemplate("im_attach_mess", {
            messages: getLang("mail_title_X_msgs", e.length)
        })
    }

    function v(e, t, n) {
        e.set(x.forwardMessages.bind(null, [], e.get()
                .peer))
            .then(function() {
                var r = geByClass1(G, t);
                if (r && r.children.length) {
                    r.innerHTML = "";
                    var a = n()
                        .updateScroll();
                    n()
                        .scrollFix(e, e.get()
                            .peer, a)
                }
            })
    }

    function y(e, t, n, r, a, i, o, s, l, u, c, d) {
        return {
            restoreDraft: function(r) {
                r.get()
                    .rebuilding_draft = !0, e.unchooseMedia(), e.chosenMedias = [], r.get()
                    .rebuilding_draft = !1;
                var i = geByClass1("ms_item_gift", n);
                (0, O.isUserPeer)(r.get()
                    .peer) ? show(i): hide(i);
                var o = r.get()
                    .peer;
                (0, O.isReservedPeer)(o) || Promise.all([(0, x.getAttaches)(r, o), (0, x.getTextDraft)(o, r.get()), (0, x.getForwardedMessages)(o, r.get())])
                    .then(function(e) {
                        return r.set(x.cleanMediaStore.bind(null, o))
                            .then(function(t) {
                                return e
                            })
                    })
                    .then(function(i) {
                        var s = A(i, 3),
                            l = s[0],
                            u = s[1],
                            c = s[2];
                        P(r, o, t)
                            .then(function(i) {
                                if (!i) {
                                    l.length > 0 && show(ge("_im_media_preview"));
                                    for (var s = 0; s < l.length; s++) e.chooseMedia.apply(e, l[s]);
                                    c.length > 0 ? h(c, n) : geByClass1(G, n)
                                        .innerHTML = "", _(t, u);
                                    var d = a()
                                        .updateScroll();
                                    a()
                                        .scrollFix(r, o, d)
                                }
                            })
                    })
            },
            sendMessage: function() {
                r()
            },
            choose: function(t, n, r) {
                e.chooseMedia(t, n, r)
            },
            unchoose: function(t) {
                e.unchooseMedia(t)
            },
            attachCount: function() {
                return e.attachCount()
            },
            progress: function(t, n, r) {
                show("_im_media_preview"), e.showMediaProgress(t, n, r)
            },
            updateState: function(e) {
                P(e, e.get()
                    .peer, t)
            },
            focusOn: function(e) {
                t.focus()
            },
            clearText: function(r, i) {
                e.unchooseMedia(), e.chosenMedias = [], Emoji.val(t, ""), i.set(x.saveTextDraft.bind(null, r, "")), i.set(x.cleanMediaStore.bind(null, r)), i.set(x.forwardMessages
                    .bind(null, [], r)), i.set(x.clearAttachToUrl.bind(null, r)), v(i, n, a);
                var o = a()
                    .updateScroll();
                a()
                    .scrollFix(i, i.get()
                        .peer, o)
            },
            attachMessages: function(e, t) {
                e.get()
                    .peer === t && (0, x.getForwardedMessages)(t, e.get())
                    .then(function(r) {
                        if (r.length > 0) {
                            h(r, n);
                            var i = a()
                                .updateScroll();
                            a()
                                .scrollFix(e, t, i)
                        }
                    })
            },
            unmount: function() {
                var a = geByClass1("_im_send", n);
                removeEvent(t, "paste", c), removeEvent(a, "click", r), (0, F.removeDelegateEvent)(n, "click", "_im_rc_emoji", i), (0, F.removeDelegateEvent)(n,
                    "click", z, s), (0, F.removeDelegateEvent)(n, "click", "_im_will_fwd", l), e.destroy(), u.unmount(), (0, F.removeDelegateEvent)(bodyNode,
                    "click", q, d)
            }
        }
    }

    function b(e, t) {
        return (0, O.isChatPeer)(e) ? t.get()
            .tabs[e].data.kicked : !1
    }

    function C(e, t) {
        if (!(0, O.isUserPeer)(e) && !(0, O.isComunityPeer)(e)) return !1;
        var n = t.get()
            .tabs[e];
        return n.blacklisted
    }

    function T(e, t, n, r) {
        var a = e.get()
            .peer,
            i = Emoji.val(r);
        (0, O.isReservedPeer)(a) || e.get()
            .tabs[a].imdraft == i || b(a, e) || C(a, e) || (t.checkMessageURLs(i, !0), e.set(x.saveTextDraft.bind(null, a, i)))
    }

    function E(e, t) {
        var n = (0, N.getFiles)(t);
        if (n.length > 0) {
            var n = n.map(function(e) {
                return e.name = e.filename = "upload_" + (new Date)
                    .toISOString() + rand(0, 100) + ".png", e
            });
            e.paste(n)
        }
    }

    function w(e, t, n, r, a, i) {
        var o = domData(i, "emoji");
        Emoji.addEmoji(e, o), T(t, r, e, n)
    }

    function S(e) {
        var t = e.get()
            .peer;
        if ((0, O.isFullyLoadedTab)(e.get(), t)) {
            var n = e.get()
                .tabs[t];
            Date.now() - (n.lastTyping || 0) > 1e3 * x.TYPING_PERIOD && e.set(x.sendTyping.bind(null, t))
        }
    }

    function k(e) {
        var t = e.get()
            .peer;
        (0, x.getForwardedMessages)(t, e.get())
        .then(function(t) {
            showBox("al_im.php", {
                act: "a_show_forward_box",
                will_fwd: t.join(";"),
                gid: e.get()
                    .gid
            }, {
                dark: 1
            })
        })
    }

    function P(e, t, n) {
        return b(t, e) || C(t, e) ? (n.disabled = !0, _(n, b(t, e) ? getLang("mail_chat_youre_kicked") : getLang("mail_send_privacy_error")), n.contentEditable = "false",
            hide(n.previousSibling), Promise.resolve(!0)) : (n.disabled = !1, _(n, ""), n.contentEditable = "true", show(n.previousSibling), (0, x.getTextDraft)(t, e.get())
            .then(function(e) {
                return _(n, e), !1
            }))
    }

    function I(e, t, n) {
        cur.share_timehash = t.get()
            .share_timehash;
        var r = (0, M.createMutations)(y),
            a = r.callMutations,
            i = r.bindMutations,
            o = (0, R.mount)(e, t, a),
            l = d.bind(null, t, n),
            _ = (0, D.initQueue)(l, g.bind(null, t, n), {
                store: "ls",
                key: "im_send_queue_" + vk.id
            }),
            h = _.pushMessage,
            b = _.inspectQueue,
            C = _.resend,
            P = _.setErrored,
            I = s.bind(null, t, n, h, a),
            A = k.bind(null, t),
            L = E.bind(null, o);
        hide(geByClass1("ms_items_more_helper", e));
        var B, N = new MediaSelector(geByClass1(H, e), "_im_media_preview", [
            ["photo", getLang("profile_wall_photo")],
            ["gift", getLang("profile_wall_gift")],
            ["video", getLang("profile_wall_video")],
            ["audio", getLang("profile_wall_audio")],
            ["doc", getLang("profile_wall_doc")],
            ["map", getLang("profile_wall_map")]
        ], {
            maxShown: 1,
            onAddMediaChange: function(e, r, a, i) {
                return m(n, t, U, e, r, a, i, N)
            },
            editable: 1,
            onChangedSize: function() {
                var e = n()
                    .updateScroll();
                n()
                    .scrollFix(t, t.get()
                        .peer, e)
            },
            sortable: 1,
            teWidth: 150,
            mail: 1,
            teHeight: 100,
            forceToUp: !0
        });
        hide(geByClass1("ms_items_more_helper", e)), addEvent(geByClass1(H, e), "mouseover", function() {
            B && clearTimeout(B), show(geByClass1("ms_items_more_helper", e))
        }), addEvent(geByClass1(H, e), "mouseout", function() {
            B = setTimeout(function() {
                hide(geByClass1("ms_items_more_helper", e))
            }, 500)
        });
        var j, U = c.bind(null, t, n, h, e, a, N),
            G = debounce(T.bind(null, t, N), 500),
            Q = f(e, t, function(r, a) {
                var i = t.get()
                    .peer,
                    o = Emoji.val(a);
                !(0, O.isReservedPeer)(i) && t.get()
                    .tabs[i].imdraft != o && o && S(t), G(r, a);
                var s = e.offsetHeight;
                if (j && j !== s) {
                    var l = n()
                        .updateScroll();
                    n()
                        .scrollFix(t, t.get()
                            .peer, l)
                }
                j = s
            }, U, I, L),
            K = U.bind(null, []),
            W = p.bind(null, t),
            V = geByClass1("_im_send", e);
        addEvent(V, "click", K), addEvent(V, "mouseover", W), t.get()
            .textMediaSelector = N, t.set(x.initTextStore.bind(null, b, C, P));
        var Z = (ge("_im_media_preview"), geByClass1("_im_text", e));
        setTimeout(function() {
            a()
                .restoreDraft(t)
        }, 0);
        var Y = w.bind(null, Q, t, Z, N),
            $ = v.bind(null, t, e, n),
            X = u.bind(null, t);
        return addEvent(geByClass1("_im_text_wrap", e), "click", function() {
                Z !== document.activeElement && elfocus(Z)
            }), (0, F.addDelegateEvent)(e, "click", "_im_rc_emoji", Y), (0, F.addDelegateEvent)(e, "click", z, $), (0, F.addDelegateEvent)(e, "click", "_im_will_fwd", A),
            (0, F.addDelegateEvent)(bodyNode, "click", q, X), i(N, Z, e, K, n, Y, b, $, A, o, L, X)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var A = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.mount = I;
    var L = n(75),
        M = n(85),
        x = n(73),
        O = n(81),
        D = n(79),
        B = n(89),
        F = n(5),
        N = n(90),
        j = n(80),
        R = n(91),
        U = 3980,
        H = "_im_media_selector",
        G = "_im_media_fwd",
        z = "_im_fwd_close",
        q = "_im_submit_btn"
}, function(e, t) {
    "use strict";

    function n() {
        try {
            if (window.crypto) {
                var e = new Uint32Array(4);
                return crypto.getRandomValues(e), e.reduce(function(e, t) {
                    return e + t
                })
            }
        } catch (t) {}
        return intval(rand(0, r)
            .toFixed(0))
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.random = n;
    var r = t.MAX_SAFE_INTEGER = 9007199254740991
}, function(e, t) {
    "use strict";

    function n(e) {
        return e && e.clipboardData ? e.clipboardData : e && e.originalEvent && e.originalEvent.clipboardData ? e.originalEvent.clipboardData : window.clipboardData
    }

    function r(e) {
        var t = n(e);
        if (!t) return [];
        var r = t.items;
        if (!r) return [];
        for (var a = [], i = 0; i < r.length; i++) 0 == r[i].type.indexOf("image") && a.push(r[i].getAsFile());
        return a
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.getFiles = r
}, function(module, exports) {
    "use strict";

    function uploadFailed(e, t, n) {
        var r = void 0 !== t.ind ? t.ind : t;
        (t.fileName ? t.fileName : t)
        .replace(/[&<>"']/g, "");
        if ("fileApi" == Upload.types[r] && !Upload.options[r].wiki_editor) {
            var a = t.fileName ? r + "_" + t.fileName : t;
            re("upload" + a + "_progress_wrap"), e()
                .unchoose(a)
        }
        topError("Upload failed", {
            dt: -1,
            type: 102,
            url: (ge("file_uploader_form" + r) || {})
                .action
        }), Upload.embed(r)
    }

    function onPhotoUploaded(e, t, n) {
        var r = void 0 !== e.ind ? e.ind : e,
            a = (e.fileName ? e.fileName : e)
            .replace(/[&<>"']/g, ""),
            i = e.fileName ? r + "_" + e.fileName : e,
            o = ge("upload" + i + "_progress_wrap");
        o && hide(geByClass1("progress_x", o)), ajax.post("al_photos.php", extend({
            act: "choose_uploaded"
        }, t), {
            onDone: function(e, t) {
                n()
                    .choose("photo", e, extend(t, {
                        upload_ind: r + "_" + a
                    }))
            },
            onFail: uploadFailed.bind(null, n, e)
        })
    }

    function uploadHide(e) {
        hide(geByClass1(UPLOAD_WRAP_CLASS, e))
    }

    function uploadShow(e) {
        hide(geByClass1(UPLOAD_WRAP_CLASS, e))
    }

    function initUploader(text, store, parentMutations) {
        var data = store.get()
            .upload_options,
            uploadHolder = geByClass1(UPLOAD_CLASS, text),
            dropbox = geByClass1(DROPBOX_CLASS, text);
        return Upload.init(uploadHolder, data.url, data.params, {
            file_name: "photo",
            file_size_limit: 26214400,
            file_types_description: "Image files (*.jpg, *.jpeg, *.png, *.gif)",
            file_types: "*.jpg;*.JPG;*.png;*.PNG;*.gif;*.GIF;*.jpeg;*.JPEG",
            file_input: null,
            accept: "image/jpeg,image/png,image/gif",
            file_match: data.opts.ext_re,
            lang: data.opts.lang,
            wiki_editor: 0,
            onUploadStart: function(e, t) {
                var n = void 0 !== e.ind ? e.ind : e,
                    r = Upload.options[n];
                "form" == Upload.types[n] && (geByClass1("file", ge("choose_photo_upload"))
                    .disabled = !0), "fileApi" == Upload.types[n] && (cur.notStarted && (boxQueue.hideLast(), delete cur.notStarted), r.multi_progress &&
                    this.onUploadProgress(e, 0, 0))
            },
            onUploadComplete: function onUploadComplete(info, res) {
                var params, i = void 0 !== info.ind ? info.ind : info,
                    fileName = (info.fileName ? info.fileName : info)
                    .replace(/[&<>"']/g, "");
                try {
                    params = eval("(" + res + ")")
                } catch (e) {
                    params = q2ajx(res)
                }
                return params.photos ? void onPhotoUploaded(info, params, parentMutations) : void Upload.onUploadError(info)
            },
            onUploadProgress: function(e, t, n) {
                var r = void 0 !== e.ind ? e.ind : e;
                if ("fileApi" == Upload.types[r]) {
                    var a = {
                        loaded: t,
                        total: n
                    };
                    e.fileName && (a.fileName = e.fileName.replace(/[&<>"']/g, "")), parentMutations()
                        .progress("photo", r, a)
                }
            },
            onUploadError: uploadFailed.bind(null, parentMutations),
            onCheckServerFailed: function() {
                uploadHide(text)
            },
            onUploadCompleteAll: function(e) {
                "form" == Upload.types[e] && Upload.embed(e)
            },
            onDragEnter: function(e) {
                if (browser.chrome && e.dataTransfer && e.dataTransfer.items) {
                    var t = e.dataTransfer.items[0].type.split("/");
                    if (t[1] && !t[1].match(/^(jpg|jpeg|png)$/i) && !ge("docs_choose_upload_area_wrap")) {
                        var n = store.get()
                            .gid ? {
                                imhash: store.get()
                                    .im_doc_hash,
                                from: "from_gim"
                            } : {};
                        cur.dropDoc = !0, cur.chooseMedia = parentMutations()
                            .choose;
                        var r = 0;
                        cur.showMediaProgress = function() {
                                0 === r && boxQueue.hideLast(), r++, parentMutations()
                                    .progress.apply(null, arguments)
                            }, cur.attachCount = parentMutations()
                            .attachCount, showBox("docs.php", extend({
                                act: "a_choose_doc_box",
                                toId: cur.gid ? -cur.gid : void 0,
                                scrollbar_width: sbWidth(),
                                blockPersonal: cur.gid ? 1 : 0,
                                mail_add: 1
                            }, n), {
                                stat: ["docs.css"]
                            }), setTimeout(uploadHide.bind(null, text))
                    }
                }
            },
            noFlash: 1,
            multiple: 1,
            multi_progress: 1,
            max_files: 10,
            chooseBox: 1,
            clear: 1,
            type: "photo",
            max_attempts: 3,
            server: data.opts.server,
            error: data.opts.default_error,
            error_hash: data.opts.error_hash,
            dropbox: dropbox,
            label: data.opts.label,
            dragEl: bodyNode
        })
    }

    function mount(e, t, n) {
        removeEvent(bodyNode, "dragover dragenter");
        var r = initUploader(e, t, n);
        return uploadShow(e), {
            paste: function(e) {
                Upload.onFileApiSend(r, e)
            },
            unmount: function() {
                Upload.deinit(r)
            }
        }
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.mount = mount;
    var UPLOAD_CLASS = "_im_upload",
        DROPBOX_CLASS = "_im_upload_dropbox",
        UPLOAD_WRAP_CLASS = "_im_upload_wrap"
}, function(e, t, n) {
    "use strict";

    function r(e, t, n, r) {
        var a = '<td class="im_cal_clear" colspan="7"><button type="button" class="im_cal_clear_lnk _im_clear_date">' + getLang("wall_clear_date_filter") +
            "</button></td>";
        return new Promise(function(e) {
            stManager.add(["ui_controls.js", "datepicker.js", "datepicker.css"], function() {
                var t = new Datepicker(n, {
                    width: 140,
                    resfmt: "plain",
                    addRows: '<tr id="im_day_clear">' + a + "</tr>",
                    addRowsM: '<tr id="im_month_clear">' + a + "</tr>",
                    onUpdate: r
                });
                e(t)
            })
        })
    }

    function a(e, t, n, r, a, i, o) {
        return {
            focus: function(e) {
                uiSearch.focus(n), l(e, n, o)
            },
            changePeer: function(e, t) {
                uiSearch.getFieldEl(n)
                    .value = t.get()
                    .tabs[e].searchText || ""
            },
            unmount: function() {
                removeEvent(geByClass1(h, e), "click", t), removeEvent(geByClass1(b, e), "click", r), removeEvent(geByClass1(C, e), "click", a), removeEvent(uiSearch.getFieldEl(
                    n), "keyup", r), (0, p.removeDelegateEvent)(e, "click", T, i)
            }
        }
    }

    function i(e, t, n, r) {
        e.set(f.setCurrentSearchDate.bind(null, e.get()
                .peer, r.d + "." + r.m + "." + r.y))
            .then(s.bind(null, e, t, n))
    }

    function o(e, t) {
        e.then(function(e) {
            triggerEvent(geByClass1("datepicker_control", t), "mousedown", !1, !0)
        })
    }

    function s(e, t, n) {
        l(e, n, t);
        e.get()
            .peer;
        uiSearch.showProgress(n), (0, f.searchMessagesInplace)(e.get()
                .peer, e.get())
            .then(function(r) {
                uiSearch.hideProgress(n), t()
                    .insertSearch(r, e)
            })["catch"](function(e) {
                uiSearch.focus(n), uiSearch.hideProgress(n)
            })
    }

    function l(e, t, n) {
        e.set(f.setExecStack.bind(null, (0, m.executionStackPush)(e.get()
            .stack, _, c.bind(null, e, t, n))))
    }

    function u(e, t, n, r, a, i) {
        if ("keyup" !== i.type || 13 == i.which) {
            var o = clean(uiSearch.getFieldEl(t)
                .value);
            e.set(f.setCurrentSearch.bind(null, o, e.get()
                    .peer))
                .then(a.bind(null, e, r, t))
        }
    }

    function c(e, t, n) {
        e.set(f.setExecStack.bind(null, (0, m.execuctionStackFilter)(e.get()
                .stack, _))), e.set(f.cancelSearch.bind(null, e.get()
                .peer))
            .then(function() {
                uiSearch.getFieldEl(t)
                    .value = "", n()
                    .cancelSearch(e)
            })
    }

    function d(e, t, n, r) {
        n.then(function(e) {
                e.hide()
            }), e.set(f.clearDate.bind(null, e.get()
                .peer))
            .then(s.bind(null, e, t, r))
    }

    function g(e, t, n) {
        var l = geByClass1(v, e),
            g = geByClass1(y, e),
            f = i.bind(null, t, n, g),
            m = r(t, e, l, f),
            _ = o.bind(null, m, e),
            E = u.bind(null, t, g, l, n, debounce(s, 300)),
            w = c.bind(null, t, g, n),
            S = d.bind(null, t, n, m, g);
        return addEvent(geByClass1(h, e), "click", _), addEvent(uiSearch.getFieldEl(g), "keyup", E), addEvent(geByClass1(b, e), "click", E), addEvent(geByClass1(C, e),
            "click", w), (0, p.addDelegateEvent)(e, "click", T, S), a(e, _, g, E, w, S, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = g;
    var f = n(73),
        m = n(80),
        p = n(5),
        _ = "im_hist_search",
        h = "_im_search_date",
        v = "_im_search_date_input",
        y = "_im_search_history_input",
        b = "_im_start_inplace_search",
        C = "_im_cancel_inplace_search",
        T = "_im_clear_date"
}, function(e, t, n) {
    "use strict";

    function r(e, t, n, r) {
        var a = intval(domData(r, "msgid"));
        if (!getSelectionText() && !(0, u.checkSelectClick)(n)) {
            t()
                .loadingPeer(e);
            var i = intval(domData(r, "peer")),
                o = e.get()
                .peer;
            return e.set(l.changePeer.bind(null, i, a))
                .then(function() {
                    e.set(l.selectPeerOnMessage.bind(null, !1, o))
                        .then(function() {
                            e.set(l.setActions), t()
                                .changePeer(e)
                        })
                }), !1
        }
    }

    function a(e) {
        return (0, l.isSearchAllLoaded)(e.get()
            .peer, e.get()) ? Promise.resolve("") : (0, l.searchMessagesInplace)(e.get()
            .peer, e.get())
    }

    function i(e, t, n) {
        return {
            isAll: function(e) {
                return (0, l.isSearchAllLoaded)(e.get()
                    .peer, e.get())
            },
            loadMore: function(e) {
                return a(e)
            },
            unmount: function() {
                (0, s.removeDelegateEvent)(e, "click", "_im_mess", n, !0)
            }
        }
    }

    function o(e, t, n) {
        var a = r.bind(null, t, n);
        return (0, s.addDelegateEvent)(e, "click", "_im_mess", a, !0), i(e, n, a)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = o;
    var s = n(5),
        l = n(73),
        u = n(81)
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        var r = gpeByClass("_im_mess", n),
            i = intval(domData(r, "msgid")),
            o = e.get()
            .peer,
            s = e.get()
            .tabs[o].msgs[i],
            c = !s[2];
        return e.get()
            .longpoll.push([{
                peerId: o,
                messageId: i,
                type: c ? u.SET_FLAGS : u.RESET_FLAGS,
                flags: u.FLAG_IMPORTANT
            }]), e.set(l.favMessage.bind(null, [i], c, o)), a(e, -10, t, n), !1
    }

    function a(e, t, n, r) {
        return showTooltip(r, {
            shift: [50, 10],
            black: 1,
            className: "_im_history_tooltip im-star-tt",
            appendParentCls: "_im_mess_stack",
            text: function() {
                var t = gpeByClass("_im_mess", r),
                    n = intval(domData(t, "msgid")),
                    a = e.get()
                    .peer,
                    i = e.get()
                    .tabs[a],
                    o = i.msgs[n];
                return o[2] ? getLang("mail_im_unmark_important") : getLang("mail_im_toggle_important")
            }
        })
    }

    function i(e, t, n, r) {
        return {
            markImportant: function(t, n, r) {
                var a = geByClass1("_im_mess_" + t, e);
                a && toggleClass(a, "im-mess_fav", n)
            },
            unmount: function() {
                (0, s.removeDelegateEvent)(e, "click", c, n), (0, s.removeDelegateEvent)(e, "mouseover", c, r)
            }
        }
    }

    function o(e, t, n) {
        var o = a.bind(null, t, 0),
            l = r.bind(null, t);
        return (0, s.addDelegateEvent)(e, "click", c, l), (0, s.addDelegateEvent)(e, "mouseover", c, o), i(e, n, l, o)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = o;
    var s = n(5),
        l = n(73),
        u = n(77),
        c = "_im_mess_fav"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        stopEvent(e)
    }

    function a(e, t, n, r) {
        if (!(0, u.isSearchingInplace)(e.get()
                .peer, e.get()) && !(hasClass(r, l.FAILED_CLASS) || hasClass(r, l.SENDING_CLASS) || hasClass(r, "_im_mess_srv") || (0, l.checkSelectClick)(n, r) || "A" ===
                n.target.tagName)) {
            var a = intval(domData(r, "msgid")),
                i = e.get()
                .peer,
                o = e.get()
                .tabs[i].deleted || [];
            inArray(a, o) || e.set(u.addSelection.bind(null, a))
                .then(function() {
                    var n = e.get()
                        .selectedMessages[a];
                    toggleClass(r, "im-mess_selected", n), t()
                        .changedMessageSelection(e)
                })
        }
    }

    function i(e, t, n) {
        return {
            cleanSelection: function(t) {
                t.map(function(t) {
                        return geByClass1("_im_mess_" + t, e)
                    })
                    .filter(function(e) {
                        return e
                    })
                    .forEach(function(e) {
                        return removeClass(e, "im-mess_selected")
                    })
            },
            unmount: function() {
                (0, s.removeDelegateEvent)(e, "click", "_im_mess", n), (0, s.removeDelegateEvent)(e, "click", "_im_mess_stack", r)
            }
        }
    }

    function o(e, t, n) {
        var o = a.bind(null, t, n);
        return (0, s.addDelegateEvent)(e, "click", "_im_mess", o), (0, s.addDelegateEvent)(e, "click", "_im_mess_stack", r), i(e, n, o)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = o;
    var s = n(5),
        l = n(81),
        u = n(73)
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e) {
        return ge("im_dialogs_search", e)
    }

    function i(e, t, n, r) {
        var a = trim(r.target.value);
        if (a && a !== e.get()
            .searchText) {
            var i = u.bind(null, e, n, t);
            e.set(_.setExecStack.bind(null, (0, y.executionStackPush)(e.get()
                    .stack, "im_search", i))), e.set(_.setCurrentSearch.bind(null, a, !1))
                .then(t), addClass(r.target, "im-page--dialogs-search_fill")
        } else a || (e.set(_.setCurrentSearch.bind(null, "", !1))
            .then(t), removeClass(r.target, "im-page--dialogs-search_fill"))
    }

    function o(e, t, n) {
        return function() {
            var r = t.get()
                .searchText;
            r === e && n.apply(null, arguments)
        }
    }

    function s(e, t) {
        var n = t.get(),
            r = t.get()
            .searchText;
        if (!r) return void e()
            .restoreDialogs(t);
        var a = o(r, t, e()
                .appendDialogs.bind(null, t)),
            i = o(r, t, e()
                .appendFastDialogs.bind(null, t)),
            s = o(r, t, e()
                .appendSearch);
        t.get()
            .pendingForward && t.get()
            .pendingForward.length > 0 ? ((0, _.searchFriends)(r, n)
                .then(i), (0, _.searchHints)(r, [], "all", n)
                .then(a)) : (t.get()
                .dialog_search_going = !0, Promise.all([(0, _.searchFriends)(r, n)
                    .then(function(e) {
                        i(e);
                        var t = e.map(function(e) {
                            return e.peerId
                        });
                        return (0, _.searchHints)(r, t, "all", n)
                            .then(a)
                    }), (0, _.searchMessages)(r, n)
                ])
                .then(function(e) {
                    var n = p(e, 2),
                        r = p(n[1], 2),
                        a = r[0],
                        i = r[1];
                    s(t, a, i, !0), t.get()
                        .dialog_search_going = !1
                }))
    }

    function l(e, t, n) {
        n()
            .showCreation(e)
    }

    function u(e, t, n) {
        e.set(_.setExecStack.bind(null, (0, y.execuctionStackFilter)(e.get()
            .stack, "im_search")));
        var r = a(t);
        r.value = "", i(e, n, t, {
            target: r
        })
    }

    function c(e, t, n, r, a) {
        e.get()
            .searchText ? (u(e, t, n), setTimeout(function(t) {
                return g(e, a)
            }, 10)) : (window.tooltips && tooltips.hide(a, {
                showsp: 0
            }), l(e, a, r))
    }

    function d(e, t, n, r, a) {
        var i;
        return !showTabbedBox("al_im.php", {
            act: "a_important",
            offset: "0"
        }, {
            onDone: function(t, r) {
                r && (i = (0, b.mount)(t, e, n, r))
            },
            params: {
                width: 638,
                onDestroy: function() {
                    i && i.unmount()
                }
            }
        }, r)
    }

    function g(e, t) {
        e.get()
            .searchText;
        return showTooltip(t, {
            text: function() {
                return e.get()
                    .searchText ? getLang("mail_cancel") : getLang("mail_start_conversaion")
            },
            black: 1,
            shift: [13, 6],
            appendCls: "js-im-page"
        })
    }

    function f(e, t, n, r, i, o, s) {
        return {
            focusInput: function(t) {
                uiSearch.focus(a(e)
                    .parentNode)
            },
            createCanceled: function(e, t) {
                removeClass(o, "im-dialog-select_rotated")
            },
            rotateCross: function(e) {
                addClass(o, "im-dialog-select_rotated")
            },
            clearSearch: function(t) {
                u(t, e, function(e) {
                    return !1
                })
            },
            updateImportantCnt: function(t) {
                var n = t.get()
                    .important_cnt,
                    r = geByClass1(C, e);
                toggleClass(r, "im-page--stars_hidden", 0 === n), r.innerHTML = "<i></i> " + n
            },
            unmount: function() {
                removeEvent(a(e), "keyup", t), removeEvent(geByClass1("_im_search_croll", e), "click", n), removeEvent(geByClass1(C, e), "click", r), removeEvent(o,
                    "mouseover", s)
            }
        }
    }

    function m(e, t, n) {
        var r = geByClass1("_im_search_croll", e),
            o = debounce(s.bind(null, n), 50),
            l = i.bind(null, t, o, e),
            u = c.bind(null, t, e, o, n, r),
            m = d.bind(null, t, e, n),
            p = g.bind(null, t, r),
            _ = a(e);
        return addEvent(_, "keyup", l), addEvent(r, "mousedown", u), addEvent(r, "mouseover", p), addEvent(geByClass1(C, e), "click", m), addEvent(_, "focus", function() {
            t.get()
                .longpoll.push([(0, v.transitionEvent)("search")])
        }), addEvent(_, "blur", function() {
            t.get()
                .longpoll.push([(0, v.transitionEvent)("default")])
        }), f(e, l, u, m, o, r, p)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var p = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.mount = m;
    var _ = n(73),
        h = n(76),
        v = (r(h), n(77)),
        y = n(80),
        b = n(97),
        C = "_im_important_counter"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t, n, r) {
        if (!e.loading && !e.all) {
            var a = n.scrollTop + window.innerHeight - n.scrollHeight;
            if (a > -300) {
                var i = geByClass1("_im_peer_history", t.bodyNode);
                e.loading = !0, (0, d.wrapLoading)(i)((0, l.loadImportant)(e.offset)
                    .then(function(t) {
                        var n = s(t, 4),
                            a = (n[0], n[1]),
                            o = (n[2], n[3]);
                        e.all = o.all, e.offset = o.offset, e.all ? addClass(i, "im-important_all") : e.loading = !1, r.set(l.mergeTabs.bind(null, (0, d.tabFromIds)
                            (o.msgs, o.hash)));
                        var u = ce("div");
                        u.innerHTML = a, i.appendChild(u)
                    }), "bottom")
            }
        }
    }

    function i(e, t) {
        for (var n = arguments.length, r = Array(n > 2 ? n - 2 : 0), a = 2; n > a; a++) r[a - 2] = arguments[a];
        r.filter(function(e) {
                return inArray(e.type, [m.SET_FLAGS, m.RESET_FLAGS])
            })
            .forEach(function(n) {
                if (n.flags === m.FLAG_IMPORTANT) {
                    var r = n.type === m.SET_FLAGS;
                    e.set(l.updateFavMessage.bind(null, [n.messageId], 0, r))
                        .then(function(a) {
                            t.markImportant(n.messageId, r, e)
                        })
                }
            })
    }

    function o(e, t, n, r) {
        var o = ge("box_layer_wrap"),
            s = t.get()
            .longpoll,
            l = (0, f["default"])({
                peer: 0,
                longpoll: s,
                tabs: (0, d.tabFromIds)(r.msgs, r.hash)
            }),
            g = (0, c.mount)(e.bodyNode, l, function() {
                return {}
            }),
            m = (0, u.mount)(e.bodyNode, t, function() {
                return {
                    loadingPeer: function() {
                        n()
                            .loadingPeer(t), e.hide()
                    },
                    changePeer: function() {
                        n()
                            .changePeer(!1, t), n()
                            .selectPeer(t)
                    }
                }
            }),
            p = i.bind(null, t, g);
        s.on("data", p);
        var _ = a.bind(null, {
            all: !1,
            loading: r.all,
            offset: r.offset
        }, e, o, l);
        return addEvent(o, "scroll", _), {
            unmount: function() {
                removeEvent(o, "scroll", _), m.unmount(), g.unmount(), s.off("data", p)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var s = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.mount = o;
    var l = n(73),
        u = n(93),
        c = n(94),
        d = n(81),
        g = n(76),
        f = r(g),
        m = n(77)
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        var r;
        return !showTabbedBox("al_im.php", {
            act: "a_spam",
            offset: "0"
        }, {
            onDone: function(n, a) {
                a && (r = (0, g.mount)(n, e, t, a))
            },
            params: {
                width: 638,
                onHide: function() {
                    r.unmount()
                }
            }
        }, n)
    }

    function a(e, t, n, r) {
        (e.get()
            .unread_only || 0 !== e.get()
            .unread_cnt) && e.set(f.toggleUnreadOnly)
            .then(function(e) {
                var n = e.get()
                    .unread_only;
                val(r, getTemplate("im_filter", {
                        filter: n ? getLang("mail_to_all_dialogs") : getLang("mail_to_unread")
                    })), t()
                    .restoreDialogs(e, !0)
            })
    }

    function i() {
        return getTemplate("im_settings", {
            sound: ls.get("sound_notify_off") ? getLang("mail_im_sound_off") : getLang("mail_im_sound_on"),
            browser: s() ? getLang("mail_im_notifications_on") : getLang("mail_im_notifications_off")
        })
    }

    function o(e, t) {
        showTooltip(t.target, {
            content: i(),
            dir: "down",
            shift: [225, 9],
            hasover: !0,
            showdt: 300,
            hidedt: 300
        })
    }

    function s() {
        return DesktopNotifications.supported() && !DesktopNotifications.checkPermission() && !ls.get("im_ui_notify_off");
    }

    function l(e, t, n, a, o) {
        var l = domData(o, "action"),
            u = gpeByClass("_im_settings_menu", o);
        switch (l) {
            case "spam":
                r(e, t, a);
                break;
            case "sound":
                ls.get("sound_notify_off") ? ls.set("sound_notify_off", 0) : ls.set("sound_notify_off", 1), u.outerHTML = i();
                break;
            case "browser":
                var c = s();
                c ? (ls.set("im_ui_notify_off", 1), u.outerHTML = i()) : DesktopNotifications.checkPermission() ? DesktopNotifications.requestPermission(function() {
                    u.parentNode && (u.outerHTML = i())
                }) : (ls.set("im_ui_notify_off", 0), u.outerHTML = i())
        }
    }

    function u(e, t) {
        return {
            updateFilter: function(t) {
                var n, r = t.get()
                    .unread_only;
                n = t.get()
                    .unread_cnt > 0 ? getTemplate("im_filter", {
                        filter: r ? getLang("mail_to_all_dialogs") : getLang("mail_to_unread")
                    }) : getTemplate("im_filter", {
                        filter: getLang("mail_all_dialogs"),
                        cls: "im-page--dialogs-filter_disabled"
                    }), val(geByClass1(_, e), n)
            },
            toggleLoader: function(t, n) {
                var r = geByClass1(m, e);
                toggleClass(r, "im-page--dialogs-settings_loading", n)
            },
            unmount: function() {
                removeEvent(geByClass1(m, e), "mouseover", t)
            }
        }
    }

    function c(e, t, n) {
        var r = o.bind(null, t),
            i = l.bind(null, t, n, e),
            s = a.bind(null, t, n);
        return addEvent(geByClass1(m, e), "mouseover", r), (0, d.addDelegateEvent)(e, "click", p, i), (0, d.addDelegateEvent)(e, "click", _, s), u(e, r)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = c;
    var d = n(5),
        g = n(99),
        f = n(73),
        m = "_im_dialogs_cog_settings",
        p = "_im_settings_action",
        _ = "_im_to_unread"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t, n, r) {
        if (!e.loading && !e.all) {
            var a = n.scrollTop + window.innerHeight - n.scrollHeight;
            if (a > -300) {
                var i = geByClass1("_im_peer_history", t.bodyNode);
                e.loading = !0, (0, _.wrapLoading)(i)((0, p.loadSpam)(e.offset)
                    .then(function(t) {
                        var n = m(t, 4),
                            a = (n[0], n[1]),
                            o = (n[2], n[3]);
                        e.all = o.all, e.offset = o.offset, e.all ? addClass(i, "im-important_all") : e.loading = !1, r.set(p.mergeTabs.bind(null, (0, _.tabFromIds)
                            (o.msgs, o.hash)));
                        var s = ce("div");
                        s.innerHTML = a, i.appendChild(s)
                    }), "bottom")
            }
        }
    }

    function i(e, t) {
        var n = t.get()
            .selectedMessages,
            r = geByClass1("_im_spam_box", e.bodyNode),
            a = geByClass1("ui_tab_sel", e.bodyNode);
        if (n.length > 0) {
            var i = getLang("mail_selected", n.length);
            i = i.replace("{count}", n.length), val(a, i + _.selectionRemove)
        } else val(a, getLang("mail_spam"));
        0 === n.length ? removeClass(r, "im-important-box_with-sel") : (addClass(r, "im-important-box_with-sel"), val(geByClass1(T), getLang("mail_im_mark_notspam", n.length)),
            val(geByClass1(E), getLang("mail_im_mark_delspam", n.length)))
    }

    function o(e, t, n) {
        var r = e.get()
            .selectedMessages;
        e.set(p.cleanSelected)
            .then(n.cleanSelection.bind(null, r))
            .then(function(n) {
                return i(t, e)
            })
    }

    function s(e, t, n, r) {
        var a = gpeByClass("_im_mess", r, t);
        if (a) {
            var i = intval(domData(a, "msgid"));
            a && ((0, p.removeMessageSend)([i], 0, e.get()
                .tabs[0].hash, "undel"), (0, _.restoreMessage)(i, 0, t))
        }
    }

    function l(e, t, n) {
        var r = e.get()
            .selectedMessages;
        (0, p.removeMessageSend)(r, 0, e.get()
            .tabs[0].hash, "delete"), (0, _.removeMessagesWithRestore)(r, 0, "delete", t), o(e, t, n)
    }

    function u(e, t, n) {
        var r = e.get()
            .selectedMessages;
        (0, p.removeMessageSend)(r, 0, e.get()
            .tabs[0].hash, "nospam"), r.map(function(e) {
                return geByClass1("_im_mess_" + e)
            })
            .filter(function(e) {
                return e
            })
            .forEach(function(e) {
                var t = intval(domData(e, "peer")),
                    n = intval(domData(e, "msgid"));
                val(e, (0, _.renderGoTo)(t, n)), addClass(e, "im-mess_light")
            }), o(e, t, n)
    }

    function c(e, t, n, r, a, i) {
        var o = gpeByClass("_im_mess", i, t.bodyNode),
            s = intval(domData(o, "peer")),
            l = intval(domData(o, "msgid"));
        t.hide(), r()
            .unmount();
        var u = e.get()
            .peer;
        return e.set(p.changePeer.bind(null, s, l))
            .then(function(t) {
                n()
                    .changePeer(!1, e), n()
                    .loadingPeer(e)
            })
            .then(function() {
                e.set(p.selectPeerOnMessage.bind(null, e.get()
                        .peer !== s, u))
                    .then(n()
                        .selectPeer)
            }), stopEvent(a), cancelEvent(a), !1
    }

    function d(e, t, n) {
        var r = showFastBox({
            title: getLang("mail_deleteall1"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, getLang("mail_delete_all_spam"), getLang("mail_delete"), function(a) {
            (0, p.flushSpam)(e)
            .then(function(e) {
                    var t = m(e, 2),
                        n = (t[0], t[1]);
                    showDoneBox(n)
                }), r.hide(), t.hide(), n()
                .unmount()
        }, getLang("mail_close"), function(e) {
            r.hide()
        })
    }

    function g(e, t, n, r, a, i, o, s, l, u) {
        return {
            unmount: function() {
                removeEvent(s, "scroll", t), removeEvent(geByClass1(E, e.bodyNode), "click", n), removeEvent(geByClass1(T, e.bodyNode), "click", r), removeEvent(
                        geByClass1("_im_spam_flush", e.bodyNode), "click", l), (0, h.removeDelegateEvent)(e.bodyNode, "click", "_im_mess_restore", a), (0, h.removeDelegateEvent)
                    (e.bodyNode, "click", "_im_go_to", i), (0, h.removeDelegateEvent)(e.bodyNode, "click", _.DESLECT_ALL_CLASS, u), o.unmount()
            }
        }
    }

    function f(e, t, n, r) {
        var f = ge("box_layer_wrap"),
            m = (0, v.createMutations)(g),
            p = m.callMutations,
            b = m.bindMutations,
            w = (0, C["default"])({
                peer: 0,
                tabs: (0, _.tabFromIds)(r.msgs, r.hash)
            }),
            S = a.bind(null, {
                all: r.all,
                loading: !1,
                offset: r.offset
            }, e, f, w),
            k = s.bind(null, w, e.bodyNode),
            P = c.bind(null, t, e, n, p),
            I = d.bind(null, r.hash, e, p);
        (0, h.addDelegateEvent)(e.bodyNode, "click", "_im_mess_restore", k), (0, h.addDelegateEvent)(e.bodyNode, "click", "_im_go_to", P);
        var A = (0, y.mount)(e.bodyNode, w, function(t) {
                return {
                    changedMessageSelection: i.bind(null, e)
                }
            }),
            L = l.bind(null, w, e.bodyNode, A),
            M = u.bind(null, w, e.bodyNode, A),
            x = o.bind(null, w, e, A);
        return (0, h.addDelegateEvent)(e.bodyNode, "click", _.DESLECT_ALL_CLASS, x), addEvent(f, "scroll", S), addEvent(geByClass1(E, e.bodyNode), "click", L), addEvent(
            geByClass1(T, e.bodyNode), "click", M), addEvent(geByClass1("_im_spam_flush", e.bodyNode), "click", I), b(e, S, L, M, k, P, A, f, I, x)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var m = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }();
    t.mount = f;
    var p = n(73),
        _ = n(81),
        h = n(5),
        v = n(85),
        y = n(95),
        b = n(76),
        C = r(b),
        T = "_im_spam_not_spam",
        E = "_im_spam_spam"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t, n, r, a) {
        removeClass(t, "im-create_shown"), setTimeout(o.bind(null, t, !1), 100), n()
            .createCanceled(e, r), a.resetSelection(), "add_member" === e.get()
            .creationType && e.set(w.setCreationType.bind(null, "chat", [])), e.set(w.setExecStack.bind(null, (0, S.execuctionStackFilter)(e.get()
                .stack, "im_search")))
    }

    function i(e, t, n) {
        return t && (n.current_create_peer_ids = {}, n.current_create_peers = []), n.current_create_peer_ids || (n.current_create_peer_ids = {}), n.current_create_peers ||
            (n.current_create_peers = []), e.forEach(function(e) {
                e.then(function(e) {
                    e = e.filter(function(e) {
                        return !n.current_create_peer_ids[e.peerId]
                    }), n.current_create_peer_ids = e.reduce(function(e, t) {
                        return e[t.peerId] = !0, e
                    }, n.current_create_peer_ids), n.current_create_peers = n.current_create_peers.concat(e)
                })
            }), Promise.resolve(n)
    }

    function o(e, t) {
        toggleClass(e, "im-create_material", t)
    }

    function s(e, t, n, r, i) {
        n()
            .loadingPeer(e), a(e, t, n, !1, i), e.set(w.changePeer.bind(null, r, !1))
            .then(function(t) {
                return n()
                    .changePeer(!1, e), e.set(w.selectPeer.bind(null, !0))
            })
            .then(function(t) {
                n()
                    .selectPeer(e)
            })
    }

    function l(e, t, n) {
        var r, a = geByClass1(R, n),
            i = t.get()
            .selection.length;
        "add_member" === e.get()
            .creationType ? (r = 1 > i, val(geByClass1("_im_confirm_creation", n), 1 === i ? getLang("mail_append_chat") : getLang("mail_im_create_chat_with"))) : r = 1 >=
            i, toggleClass(a, "button_disabled", r)
    }

    function u(e, t, n, r, a, i, o, s) {
        var u = intval(domData(s, "peer"));
        a.remove(u);
        var c = geByClass1("_im_dialog_link", s)
            .textContent;
        r.addSelection(u, c), l(e, i, t)
    }

    function c(e) {
        return getTemplate("im_drow", {
            peer: e.peerId,
            msg_id: e.lastmsg,
            photo: '<img src="' + e.photo + '" alt="" />',
            user_link: '<span class="_im_dialog_link">' + e.name + "</span>",
            date: "",
            body: "",
            unread: "",
            more: "nim-dialog_simple",
            is_star: "",
            is_online: e.online ? "nim-peer_online" : "",
            is_unread: "",
            is_unread_out: "",
            is_selected: ""
        })
    }

    function d(e) {
        return e.get()
            .searchText || !1
    }

    function g(e) {
        return e.get()
            .selection.map(function(e) {
                return e.id
            })
    }

    function f(e, t, n, r) {
        toggleClass(e, "im-create_chat", "chat" === r.get()
            .creationType), toggleClass(e, "im-create_invite", "add_member" === r.get()
            .creationType);
        var a = "chat" === r.get()
            .creationType ? getLang("mail_im_group_dialog") : getLang("mail_im_friends_tab"),
            i = geByClass1("_im_create_title", e);
        val(i, a), val(geByClass1("_im_confirm_creation", e), "add_member" === r.get()
            .creationType ? getLang("mail_im_create_chat_with") : getLang("mail_im_create_chat"));
        var o = n.get()
            .selection.map(function(e) {
                return e.id
            });
        p(e, r, t, !1, o), (0, P.fixTableCellChildHeight)("_im_create_wrap_safe", e)
    }

    function m(e, t, n, r) {
        return e.then(function(e) {
            return e.filter(function(e) {
                return !inArray(e.peerId, t) && e.is_friend && !inArray(e.peerId, r.get()
                    .creationFilter)
            })
        })
    }

    function p(e, t, n, r, a) {
        var o, s, l = geByClass1(N, e),
            u = (0, w.searchLocalHints)(r, t.get());
        t.get()
            .creation_showed_all = !1, n.reset(), n.pipe(m(u, a, r, t), r), n.toTop(), r ? (s = (0, w.searchFriends)(r, t.get()), o = (0, w.searchHintsIndex)(r, [],
                "friends", data), n.pipe(m(o, a, r, t), r), n.pipe(m(s, a, r, t), r)) : (o = Promise.resolve([]), s = Promise.resolve([])), t.set(i.bind(null, [u, s, o], !
                0)), uiSearch.showProgress(l), Promise.all([u, o, s])
            .then(uiSearch.hideProgress.bind(null, l))
    }

    function _(e, t, n, r, a, i, o, s) {
        uiTabs.switchTab(s.firstElementChild);
        var l = domData(s, "type");
        switch (l) {
            case "chat":
                i.restore()
        }
        e.set(w.setCreationType.bind(null, l, []))
            .then(f.bind(null, t, r, a))
    }

    function h(e, t, n, r) {
        var a = r.get()
            .searchText || !1,
            i = r.get()
            .selection.map(function(e) {
                return e.id
            });
        e.get()
            .creationQuery = a, p(t, e, n, a, i)
    }

    function v(e, t, n, r) {
        var a = 2e9 + Math.round(rand(1e6, 2e6));
        cur.recieveCropResult = function(n) {
            cur.recieveCropResult = !1, curBox() && curBox()
                .hide(), e.set(w.presetAvatar.bind(null, n)), (0, w.getOwnerPhoto)(n, a)
                .then(function(e) {
                    geByClass1(j, t)
                        .appendChild(ce("img", {
                            className: "im-chat-placeholder--img " + H,
                            src: e
                        }))
                })
        }, Page.ownerPhoto(a)
    }

    function y(e, t, n, r, i, o) {
        t.reset(), p(n, e, r, !1, g(t)), i.resetSelection(), a(e, n, o, !1, i), e.set(w.presetAvatar.bind(null, !1));
        var s = geByClass1(H, n);
        l(e, t, n), uiSearch.reset(geByClass1(F, n)), s && s.parentNode.removeChild(s)
    }

    function b(e, t, n, r, i, o, l) {
        var u = g(t);
        if ("add_member" === e.get()
            .creationType && u.length > 0) return e.set(w.addNewMember.bind(null, e.get()
            .peer, u)), void a(e, n, o, "", i);
        if (!(u.length <= 1) || e.get()
            .creating) {
            lockButton(l.target);
            var c = uiSearch.getFieldEl(geByClass1(F, n))
                .value;
            e.set(w.createChat.bind(null, e.get()
                    .next_chat_avatar, u, c))
                .then(function(a) {
                    y(e, t, n, r, i, o), s(e, n, o, e.get()
                        .next_peer, i), unlockButton(l.target)
                })["catch"](function(e) {
                    unlockButton(l.target), topMsg(getLang("global_unknown_error"), 2, "#FFB4A3")
                })
        }
    }

    function C(e) {
        return showTooltip(e.target, {
            text: getLang("mail_cancel"),
            black: 1,
            zIndex: 1e3,
            shift: [12, 4],
            appendCls: "js-im-page"
        })
    }

    function T(e, t, n, r, i, s, l) {
        return {
            show: function(t) {
                var a = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1];
                o(e, !0), t.set(w.setExecStack.bind(null, (0, S.executionStackPush)(t.get()
                    .stack, "im_create", n))), addClass(e, "im-create_shown"), l.focus(), a && a.forEach(function(e) {
                    return l.addSelection(e[0], e[1])
                }), f(e, r, s, t)
            },
            hide: function(n) {
                a(n, e, t, !1, l)
            },
            updateScroll: function() {
                (0, P.fixTableCellChildHeight)("_im_create_wrap_safe", e), r.updateScroll()
            },
            unmount: function() {
                removeEvent(geByClass1(x, e), "click", n), (0, A.removeDelegateEvent)(e, "click", D, onDialogClick), (0, A.removeDelegateEvent)(e, "click", B, i), r.unmount(),
                    cur.recieveCropResult = void 0
            }
        }
    }

    function E(e, t, n) {
        var r = (0, M["default"])({
                selection: []
            }),
            o = geByClass1(O, e),
            s = (0, k.mount)(o, (0, M["default"])({
                offset: 0,
                limit: G,
                elements: [],
                elCls: D
            }), function(a) {
                return {
                    idFn: function(e) {
                        return intval(e.peerId)
                    },
                    renderFn: c,
                    more: function(e, n) {
                        var a;
                        return t.get()
                            .creation_showed_all || d(r) !== !1 ? a = Promise.resolve([]) : (t.get()
                                .creation_showed_all = !0, a = (0, w.searchFriends)(d(r), t.get())), t.set(i.bind(null, [a], !1)), m(a, g(r), d(r), t)
                    },
                    onClick: function(a, i) {
                        u(t, e, n, p, s, r, a, i)
                    }
                }
            });
        t.get()
            .creationQuery = !1, t.get()
            .creationType = "chat";
        var f = geByClass1(N, e),
            p = (0, I.mount)(f, r, function(n) {
                return {
                    selectionDeleted: function() {
                        l(t, r, e);
                        var n = m(Promise.resolve(t.get()
                            .current_create_peers), g(r), d(r), t);
                        s.pipeReplace(n, d(r))
                    },
                    onChange: h.bind(null, t, e, s)
                }
            }),
            E = a.bind(null, t, e, n, "cross", p),
            S = _.bind(null, t, e, n, s, r, p),
            P = v.bind(null, t, e),
            L = y.bind(null, t, r, e, s, p, n),
            F = b.bind(null, t, r, e, s, p, n),
            H = geByClass1(x, e);
        return addEvent(H, "click", E), addEvent(H, "mouseover", C), addEvent(geByClass1(j, e), "click", P), addEvent(geByClass1(U, e), "click", L), addEvent(geByClass1(R,
            e), "click", F), (0, A.addDelegateEvent)(e, "click", B, S), T(e, n, E, s, S, r, p, L, F)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    (function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var o, s = e[Symbol.iterator](); !(r = (o = s.next())
                        .done) && (n.push(o.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && s["return"] && s["return"]()
                } finally {
                    if (a) throw i
                }
            }
            return n
        }
        return function(t, n) {
            if (Array.isArray(t)) return t;
            if (Symbol.iterator in Object(t)) return e(t, n);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    })();
    t.mount = E;
    var w = n(73),
        S = n(80),
        k = n(83),
        P = n(81),
        I = n(101),
        A = n(5),
        L = n(76),
        M = r(L),
        x = "_im_create_cancel",
        O = "_im_create_list",
        D = "_im_dialog",
        B = "_im_create_tab",
        F = "_im_dialogs_creation_name",
        N = "_im_create_select",
        j = "_im_create_avatar",
        R = "_im_confirm_creation",
        U = "_im_cancel_creation",
        H = "_im_avatar_img",
        G = 100
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        return t.selection || (t.selection = []), t.selection.push(e), Promise.resolve(t)
    }

    function a(e) {
        return e.selection = [], Promise.resolve(e)
    }

    function i(e, t) {
        return t.selection = t.selection.filter(function(t) {
            return t.id !== e
        }), Promise.resolve(t)
    }

    function o(e, t, n, r, a, o, s) {
        var l = intval(domData(s, "peer"));
        tooltips.hide(s), t.set(i.bind(null, l))
            .then(function(i) {
                c(e, r, t, a), n()
                    .selectionDeleted(t)
            })
    }

    function s(e) {
        var t = 0;
        return function() {
            var n = e.offsetWidth;
            setStyle(e, {
                width: 1
            });
            var r = e.offsetLeft;
            if (t === r) return void setStyle(e, {
                width: n
            });
            t = r;
            var n = e.parentNode.offsetWidth;
            setStyle(e, {
                width: Math.max(30, n - r - 20)
            })
        }
    }

    function l(e, t, n, r) {
        e.set(f.setCurrentSearch.bind(null, n, !1))
            .then(t()
                .onChange)
    }

    function u(e, t, n, r) {
        e.set(a)
            .then(c.bind(null, t, n, e, r))
    }

    function c(e, t, n, r) {
        var a = n.get()
            .selection,
            i = uiSearch.getFieldEl(e);
        uiSearch.reset(e), uiSearch.focus(e), a.length > 0 ? attr(i, "placeholder", "") : attr(i, "placeholder", unclean(getLang("mail_search_creation"))), t.innerHTML = a
            .map(function(e) {
                return '<div class="token">\n      <div class="token_title">' + e.name + '</div>\n      <div data-peer="' + e.id + '" class="token_del ' + p +
                    '"></div>\n    </div>'
            })
            .join(""), toggleClass(e, "ui_multiselect_has_selection", a.length > 0), r()
    }

    function d(e, t) {
        return showTooltip(t, {
            text: getLang("mail_create_chat_remove_user"),
            black: 1,
            shift: [15, 8],
            appendParentCls: "_wrap"
        })
    }

    function g(e, t, n) {
        uiSearch.init(e, {
            onChange: l.bind(null, t, n)
        });
        var i = uiSearch.getFieldEl(e),
            g = ce("div", {
                className: "_ui_multiselection ui_multiselect_cnt"
            });
        i && i.parentNode.insertBefore(g, i);
        var f = s(i);
        t.set(a);
        var _ = o.bind(null, e, t, n, g, f),
            h = function() {
                return uiSearch.focus(e)
            };
        return (0, m.addDelegateEvent)(e, "click", p, _), (0, m.addDelegateEvent)(e, "mouseover", p, d), addEvent(e, "click", h), {
            addSelection: function(n, a) {
                t.set(r.bind(null, {
                        id: n,
                        name: a
                    }))
                    .then(c.bind(null, e, g, t, f))
            },
            resetSelection: function() {
                u(t, e, g, f)
            },
            focus: function() {
                uiSearch.focus(e)
            },
            save: function() {
                t.stash(), c(e, g, t, f)
            },
            restore: function() {
                t.pop(), c(e, g, t, f)
            },
            unmount: function() {
                (0, m.removeDelegateEvent)(e, "click", p, _), (0, m.removeDelegateEvent)(e, "mouseover", p, d), removeEvent(e, "click", h)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = g;
    var f = n(73),
        m = n(5),
        p = "_ui_multiselect_cancel"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e) {
        return data.state = e, Promise.resolve(data)
    }

    function i(e, t, n, r, a) {
        switch (t) {
            case d:
                r.scroll(a, "up");
                break;
            case g:
                r.scroll(a, "down");
                break;
            case f:
                r.scroll(a, "up", !0);
                break;
            case m:
                r.scroll(a, "down", !0)
        }
    }

    function o(e, t, n, r, a) {
        switch (t) {
            case g:
                r.hoverDialog("next");
                break;
            case d:
                r.hoverDialog("prev");
                break;
            case p:
                r.selectHoveredDialog(a)
        }
    }

    function s(e, t, n, r, a) {
        switch (t) {
            case f:
            case m:
                i(e, t, n, r, a)
        }
    }

    function l(e, t, n, r, l) {
        var u = (0, c["default"])({
            state: t || "default",
            ctrl_submit: n
        });
        return {
            signal: function(t, n) {
                switch (u.get()
                    .state) {
                    case "default":
                        return i(u, t, n, l, e);
                    case "fwd":
                    case "search":
                        return o(u, t, n, r, e);
                    case "message":
                        return s(u, t, n, l, e);
                    default:
                        throw new Error("Unknown state: " + u.get()
                            .state)
                }
            },
            transition: function(e) {
                return u.set(a.bind(null, e))
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.create = l;
    var u = n(76),
        c = r(u),
        d = 38,
        g = 40,
        f = 33,
        m = 34,
        p = 13
}, function(e, t, n) {
    var r;
    (function(e, a, i) {
        (function() {
            "use strict";

            function o(e) {
                return "function" == typeof e || "object" == typeof e && null !== e
            }

            function s(e) {
                return "function" == typeof e
            }

            function l(e) {
                W = e
            }

            function u(e) {
                $ = e
            }

            function c() {
                return function() {
                    e.nextTick(p)
                }
            }

            function d() {
                return function() {
                    K(p)
                }
            }

            function g() {
                var e = 0,
                    t = new ee(p),
                    n = document.createTextNode("");
                return t.observe(n, {
                        characterData: !0
                    }),
                    function() {
                        n.data = e = ++e % 2
                    }
            }

            function f() {
                var e = new MessageChannel;
                return e.port1.onmessage = p,
                    function() {
                        e.port2.postMessage(0)
                    }
            }

            function m() {
                return function() {
                    setTimeout(p, 1)
                }
            }

            function p() {
                for (var e = 0; Y > e; e += 2) {
                    var t = re[e],
                        n = re[e + 1];
                    t(n), re[e] = void 0, re[e + 1] = void 0
                }
                Y = 0
            }

            function _() {
                try {
                    var e = n(106);
                    return K = e.runOnLoop || e.runOnContext, d()
                } catch (t) {
                    return m()
                }
            }

            function h(e, t) {
                var n = this,
                    r = n._state;
                if (r === se && !e || r === le && !t) return this;
                var a = new this.constructor(y),
                    i = n._result;
                if (r) {
                    var o = arguments[r - 1];
                    $(function() {
                        B(r, a, o, i)
                    })
                } else M(n, a, e, t);
                return a
            }

            function v(e) {
                var t = this;
                if (e && "object" == typeof e && e.constructor === t) return e;
                var n = new t(y);
                return P(n, e), n
            }

            function y() {}

            function b() {
                return new TypeError("You cannot resolve a promise with itself")
            }

            function C() {
                return new TypeError("A promises callback cannot return that same promise.")
            }

            function T(e) {
                try {
                    return e.then
                } catch (t) {
                    return ue.error = t, ue
                }
            }

            function E(e, t, n, r) {
                try {
                    e.call(t, n, r)
                } catch (a) {
                    return a
                }
            }

            function w(e, t, n) {
                $(function(e) {
                    var r = !1,
                        a = E(n, t, function(n) {
                            r || (r = !0, t !== n ? P(e, n) : A(e, n))
                        }, function(t) {
                            r || (r = !0, L(e, t))
                        }, "Settle: " + (e._label || " unknown promise"));
                    !r && a && (r = !0, L(e, a))
                }, e)
            }

            function S(e, t) {
                t._state === se ? A(e, t._result) : t._state === le ? L(e, t._result) : M(t, void 0, function(t) {
                    P(e, t)
                }, function(t) {
                    L(e, t)
                })
            }

            function k(e, t, n) {
                t.constructor === e.constructor && n === ae && constructor.resolve === ie ? S(e, t) : n === ue ? L(e, ue.error) : void 0 === n ? A(e, t) : s(n) ? w(
                    e, t, n) : A(e, t)
            }

            function P(e, t) {
                e === t ? L(e, b()) : o(t) ? k(e, t, T(t)) : A(e, t)
            }

            function I(e) {
                e._onerror && e._onerror(e._result), x(e)
            }

            function A(e, t) {
                e._state === oe && (e._result = t, e._state = se, 0 !== e._subscribers.length && $(x, e))
            }

            function L(e, t) {
                e._state === oe && (e._state = le, e._result = t, $(I, e))
            }

            function M(e, t, n, r) {
                var a = e._subscribers,
                    i = a.length;
                e._onerror = null, a[i] = t, a[i + se] = n, a[i + le] = r, 0 === i && e._state && $(x, e)
            }

            function x(e) {
                var t = e._subscribers,
                    n = e._state;
                if (0 !== t.length) {
                    for (var r, a, i = e._result, o = 0; o < t.length; o += 3) r = t[o], a = t[o + n], r ? B(n, r, a, i) : a(i);
                    e._subscribers.length = 0
                }
            }

            function O() {
                this.error = null
            }

            function D(e, t) {
                try {
                    return e(t)
                } catch (n) {
                    return ce.error = n, ce
                }
            }

            function B(e, t, n, r) {
                var a, i, o, l, u = s(n);
                if (u) {
                    if (a = D(n, r), a === ce ? (l = !0, i = a.error, a = null) : o = !0, t === a) return void L(t, C())
                } else a = r, o = !0;
                t._state !== oe || (u && o ? P(t, a) : l ? L(t, i) : e === se ? A(t, a) : e === le && L(t, a))
            }

            function F(e, t) {
                try {
                    t(function(t) {
                        P(e, t)
                    }, function(t) {
                        L(e, t)
                    })
                } catch (n) {
                    L(e, n)
                }
            }

            function N(e) {
                return new _e(this, e)
                    .promise
            }

            function j(e) {
                function t(e) {
                    P(a, e)
                }

                function n(e) {
                    L(a, e)
                }
                var r = this,
                    a = new r(y);
                if (!Z(e)) return L(a, new TypeError("You must pass an array to race.")), a;
                for (var i = e.length, o = 0; a._state === oe && i > o; o++) M(r.resolve(e[o]), void 0, t, n);
                return a
            }

            function R(e) {
                var t = this,
                    n = new t(y);
                return L(n, e), n
            }

            function U() {
                throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
            }

            function H() {
                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
            }

            function G(e) {
                this._id = me++, this._state = void 0, this._result = void 0, this._subscribers = [], y !== e && ("function" != typeof e && U(), this instanceof G ?
                    F(this, e) : H())
            }

            function z(e, t) {
                this._instanceConstructor = e, this.promise = new e(y), Array.isArray(t) ? (this._input = t, this.length = t.length, this._remaining = t.length,
                    this._result = new Array(this.length), 0 === this.length ? A(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(),
                        0 === this._remaining && A(this.promise, this._result))) : L(this.promise, this._validationError())
            }

            function q() {
                var e;
                if ("undefined" != typeof a) e = a;
                else if ("undefined" != typeof self) e = self;
                else try {
                    e = Function("return this")()
                } catch (t) {
                    throw new Error("polyfill failed because global object is unavailable in this environment")
                }
                var n = e.Promise;
                (!n || "[object Promise]" !== Object.prototype.toString.call(n.resolve()) || n.cast) && (e.Promise = pe)
            }
            var Q;
            Q = Array.isArray ? Array.isArray : function(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            };
            var K, W, V, Z = Q,
                Y = 0,
                $ = function(e, t) {
                    re[Y] = e, re[Y + 1] = t, Y += 2, 2 === Y && (W ? W(p) : V())
                },
                X = "undefined" != typeof window ? window : void 0,
                J = X || {},
                ee = J.MutationObserver || J.WebKitMutationObserver,
                te = "undefined" != typeof e && "[object process]" === {}.toString.call(e),
                ne = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                re = new Array(1e3);
            V = te ? c() : ee ? g() : ne ? f() : void 0 === X ? _() : m();
            var ae = h,
                ie = v,
                oe = void 0,
                se = 1,
                le = 2,
                ue = new O,
                ce = new O,
                de = N,
                ge = j,
                fe = R,
                me = 0,
                pe = G;
            G.all = de, G.race = ge, G.resolve = ie, G.reject = fe, G._setScheduler = l, G._setAsap = u, G._asap = $, G.prototype = {
                constructor: G,
                then: ae,
                "catch": function(e) {
                    return this.then(null, e)
                }
            };
            var _e = z;
            z.prototype._validationError = function() {
                return new Error("Array Methods must be provided an Array")
            }, z.prototype._enumerate = function() {
                for (var e = this.length, t = this._input, n = 0; this._state === oe && e > n; n++) this._eachEntry(t[n], n)
            }, z.prototype._eachEntry = function(e, t) {
                var n = this._instanceConstructor,
                    r = n.resolve;
                if (r === ie) {
                    var a = T(e);
                    if (a === ae && e._state !== oe) this._settledAt(e._state, t, e._result);
                    else if ("function" != typeof a) this._remaining--, this._result[t] = e;
                    else if (n === pe) {
                        var i = new n(y);
                        k(i, e, a), this._willSettleAt(i, t)
                    } else this._willSettleAt(new n(function(t) {
                        t(e)
                    }), t)
                } else this._willSettleAt(r(e), t)
            }, z.prototype._settledAt = function(e, t, n) {
                var r = this.promise;
                r._state === oe && (this._remaining--, e === le ? L(r, n) : this._result[t] = n), 0 === this._remaining && A(r, this._result)
            }, z.prototype._willSettleAt = function(e, t) {
                var n = this;
                M(e, void 0, function(e) {
                    n._settledAt(se, t, e)
                }, function(e) {
                    n._settledAt(le, t, e)
                })
            };
            var he = q,
                ve = {
                    Promise: pe,
                    polyfill: he
                };
            n(107)
                .amd ? (r = function() {
                    return ve
                }.call(t, n, t, i), !(void 0 !== r && (i.exports = r))) : "undefined" != typeof i && i.exports ? i.exports = ve : "undefined" != typeof this && (
                    this.ES6Promise = ve), he()
        })
        .call(this)
    })
    .call(t, n(104), function() {
        return this
    }(), n(105)(e))
}, function(e, t) {
    function n() {
        u = !1, o.length ? l = o.concat(l) : c = -1, l.length && r()
    }

    function r() {
        if (!u) {
            var e = setTimeout(n);
            u = !0;
            for (var t = l.length; t;) {
                for (o = l, l = []; ++c < t;) o && o[c].run();
                c = -1, t = l.length
            }
            o = null, u = !1, clearTimeout(e)
        }
    }

    function a(e, t) {
        this.fun = e, this.array = t
    }

    function i() {}
    var o, s = e.exports = {},
        l = [],
        u = !1,
        c = -1;
    s.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
            l.push(new a(e, t)), 1 !== l.length || u || setTimeout(r, 0)
        }, a.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, s.title = "browser", s.browser = !0, s.env = {}, s.argv = [], s.version = "", s.versions = {}, s.on = i, s.addListener = i, s.once = i, s.off = i, s.removeListener =
        i, s.removeAllListeners = i, s.emit = i, s.binding = function(e) {
            throw new Error("process.binding is not supported")
        }, s.cwd = function() {
            return "/"
        }, s.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }, s.umask = function() {
            return 0
        }
}, function(e, t) {
    e.exports = function(e) {
        return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children = [], e.webpackPolyfill = 1), e
    }
}, function(e, t) {}, function(e, t) {
    e.exports = function() {
        throw new Error("define cannot be used indirect")
    }
}]);
