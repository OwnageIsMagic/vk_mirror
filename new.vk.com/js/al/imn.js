! function(e) {
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
        s = n(100),
        l = n(73),
        u = n(81);
    window.IM = {
        init: function(e) {
            window.Promise || (window.Promise = s.Promise), cur.ctrl_submit = e.ctrl_submit, cur.module = "im", cur.mutedPeers = e.mutedPeers, cur.peer = e.peer, e
                .blockedFlagUpdates = {}, e.msgid = intval(nav.objLoc.msgid), e.unread_dialogs = Object.keys(e.tabs)
                .filter(function(t) {
                    return e.tabs[t].unread > 0
                })
                .map(intval), e.all_dialogs = e.unread_only ? [] : Object.keys(e.tabs)
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

    function r() {
        for (var e = arguments.length, t = Array(e), n = 0; e > n; n++) t[n] = arguments[n];
        return function(e) {
            return t.reduce(function(t, n) {
                return t & n(e)
            })
        }
    }

    function a(e, t) {
        return e || t.type !== k.eventTypes.SET_DIRECTORIES && t.type !== k.eventTypes.REPLACE_DIRECTORIES && t.type !== k.eventTypes.RESET_DIRECTORIES
    }

    function i(e, t, n) {
        var r = n.reduce(function(e, t) {
            return e[t.peerId] || (e[t.peerId] = []), e[t.peerId].push(t.messageId), e
        }, {});
        Object.keys(r)
            .forEach(function(n) {
                var a = r[n];
                e.set(A.removeMessages.bind(null, a, n))
                    .then(function() {
                        t.removeMessages(a, intval(n), e)
                    })
            })
    }

    function o(e, t, n, r) {
        t.set(A.updateChatPhoto.bind(null, e))
            .then(function() {
                var a = e.kludges.source_act;
                n.updateDialog(e.peerId, t), r.updateChatPhoto(e, a, t)
            })
    }

    function s(e, t, n, r, a, i, o) {
        e.set(A.updateActions.bind(null, t, r, n))
            .then(function() {
                return t === L.CHAT_INVITE_USER ? e.set(A.loadPeer.bind(null, n, e.get()
                    .peer === n, !1)) : e.set(A.chatKickUser.bind(null, n, a, r))
            })
            .then(function() {
                e.get()
                    .peer === n && (o.updateChat(e, n), i.updateDialog(n, e))
            })
    }

    function l(e, t, n) {
        t.removeSelection(e), e.set(A.changePeer.bind(null, 0, !1))
            .then(function() {
                n.changePeer(e)
            })
    }

    function u(e, t, n, r) {
        e.forEach(function(e) {
            var a = e.kludges.source_act,
                i = intval(e.kludges.source_mid);
            switch (a) {
                case L.CHAT_PHOTO_REMOVE:
                case L.CHAT_PHOTO_UPDATE:
                    o(e, t, n, r);
                    break;
                case L.CHAT_KICK_USER:
                case L.CHAT_INVITE_USER:
                    s(t, a, e.peerId, i, e.userId, n, r);
                    break;
                case L.CHAT_TITLE_ACTION:
                    var l = e.kludges.source_text;
                    t.set(A.setChatTitle.bind(null, e.peerId, l))
                        .then(r.updateChatTopic.bind(null, e.peerId))
            }
        })
    }

    function c(e, t) {
        return 2e9 > t && e && !e.match(/^\s*(Re(\(\d*\))?\:)?\s*\.\.\.\s*$/)
    }

    function d(e, t) {
        var n = t.flags & k.eventTypes.FLAG_OUTBOUND,
            r = inArray(t.peerId, e.get()
                .mutedPeers),
            a = t.flags & k.eventTypes.FLAG_DELETED,
            i = e.get()
            .gid;
        if (!n && !r && !a) {
            var o, s, l = c(t.subject, t.peerId) || "",
                u = (l ? l + " " : "") + t.text || "",
                d = t.userId,
                f = t.peerId;
            if (!(0, L.isChatPeer)(f)) return;
            var g = e.get()
                .tabs[f];
            (!e.get()
                .notify_msg && !(0, L.isChatPeer)(f) || i) && Notifier.playSound({
                author_id: f
            }), u = trim(replaceEntities(stripHTML(u.replace(/<br>/g, "\n")
                .replace(/<\*>.*$/, "")))), (0, L.isChatPeer)(f) ? (o = g.data.members[d].name, g.tab && (o += " » " + g.tab), s = g.data.members[d].photo) : (o = g.tab,
                s = g.photo);
            var m = t.attaches[0];
            m && "fwd" === m.type ? u += "\n[" + getLang("mail_added_msgs") + "]" : m && (u += "\n[" + getLang("mail_added_" + m.type) + "]"), o = trim(replaceEntities(
                stripHTML((o || "")
                    .replace("&nbsp;", " ")))), Notifier.proxyIm({
                id: t.messageId,
                text: u,
                author_id: f,
                title: o,
                author_photo: s
            })
        }
    }

    function f(e, t, n) {
        e.set(A.setExecStack.bind(null, (0, I.executionStackPush)(e.get()
            .stack, "im_peer", l.bind(null, e, t, n))))
    }

    function g(e) {
        var t = e.attaches.filter(function(e) {
            return "sticker" !== e.type
        });
        return (0, L.isServiceMsg)(e) || 0 === t.length
    }

    function m(e, t, n, i, o, s, l, c, m, p, _, h, y) {
        return {
            changePeer: function(t, n) {
                e.selectPeer(t, n)
            },
            cancelSearch: function(t) {
                t.get()
                    .searchText && (n.clearSearch(t), e.restoreDialogs(t))
            },
            loadingPeer: function(e) {
                t.loadingPeer(e)
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
                n.rotateCross(e), _.show(e, t)
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
                t.changePeer(n), f(n, e, t)
            },
            updateDialog: function(t, n) {
                e.updateDialog(t, n)
            },
            focusTxt: function(e) {
                t.focustTxt(e)
            },
            resync: function(r) {
                r.get()
                    .searchText && n.clearSearch(r), e.restoreDialogs(r, !0, !0), e.focusOnSelected(r), _.hide(r), t.cleanSelection(r.get()
                        .selectedMessages || []), t.cancelSearch(r, !0), t.changePeer(r), handlePageCount("l_msg", r.get()
                        .unread_cnt)
            },
            toggleSettingsLoader: function(e, t) {
                y.toggleLoader(e, t)
            },
            onUserActions: function(e, t) {
                if (!(0, A.isSearchingInplace)(e.get()
                        .peer, e.get())) {
                    var n = e.get(),
                        r = n.peer;
                    if ((0, L.isFullyLoadedTab)(n, r)) {
                        var a = (0, A.countUnread)(e.get()
                            .peer, e.get());
                        if (a > 0) {
                            var i = n.tabs[r];
                            i.skipped || e.set(A.readLastMessages.bind(null, r))
                        }
                    }
                }
            },
            removeSelection: function(t) {
                e.removeSelection(t), n.focusInput(t)
            },
            updateDialogFilters: function(t) {
                t.get()
                    .searchText || e.restoreDialogs(t), y.updateFilter(t)
            },
            removePeer: function(n, r) {
                t.changePeer(n, n.get()
                    .peer), e.removeDialog(n, r)
            },
            newMessage: function(n, r) {
                e.promoteDialog(r, n), e.scrollUp(), t.addMessage(r, n)
            },
            onEvents: function(i, o) {
                var s = i.get()
                    .gid,
                    l = o.filter(r(a.bind(null, s))),
                    f = o.filter(L.isServiceMsg);
                u(f, i, e, t), i.set(A.checkNewPeople.bind(null, f, c))
                    .then(function() {
                        l.forEach(function(r) {
                            switch (r.type) {
                                case k.eventTypes.ADD_MESSAGE:
                                    var a = (0, L.isDuplicate)(r, i.get());
                                    if (0 === a) {
                                        r.flags & k.eventTypes.FLAG_OUTBOUND || i.set(A.updateFavAndTitle.bind(null, r.peerId, !0));
                                        var o = i.set(A.addMessage.bind(null, r))
                                            .then(function(n) {
                                                d(n, r), e.updateTyping(r, n), e.promoteDialog(n, r), t.updateTyping(r, n), t.addMessage(n, r), y.updateFilter(
                                                    n)
                                            });
                                        g(r) || Promise.all([o, i.set(A.loadMedia.bind(null, r))])
                                            .then(function(e) {
                                                var n = b(e, 2),
                                                    a = n[1];
                                                t.replaceAttachmentPlaceholders(a, r)
                                            })
                                    } else 2 === a && (g(r) || i.set(A.loadMedia.bind(null, r))
                                        .then(function(e) {
                                            t.replaceAttachmentPlaceholders(e, r)
                                        }), i.set(A.replaceMessage.bind(null, r))
                                        .then(t.replaceMessageAttrs.bind(null, r)));
                                    break;
                                case k.eventTypes.READ_INBOUND:
                                    i.set(A.markInboundMessagesAsRead.bind(null, r))
                                        .then(function(t) {
                                            e.updateCounter(t, r), t.get()
                                                .searchText || e.restoreDialogs(t), y.updateFilter(t)
                                        });
                                    break;
                                case k.eventTypes.READ_OUTBOUND:
                                    i.set(A.markOutboundMessagesAsRead.bind(null, r))
                                        .then(function(n) {
                                            e.updateCounter(n, r), t.markMessagesAsRead(n, r)
                                        });
                                    break;
                                case k.eventTypes.UNREAD_COUNT:
                                    i.set(A.updateUnreadCount.bind(null, r.count))
                                        .then(function() {
                                            handlePageCount("msg", r.count), y.updateFilter(i)
                                        });
                                    break;
                                case k.eventTypes.GOT_ONLINE:
                                case k.eventTypes.GOT_OFFLINE:
                                    var s = r.type === k.eventTypes.GOT_ONLINE ? !0 : !1;
                                    i.set(A.updateOnline.bind(null, r.userId, s))
                                        .then(function(n) {
                                            (0, L.isTabLoaded)(n.get(), r.userId) && (e.updateOnline(r.userId, n), t.updateOnline(r.userId, n))
                                        });
                                    break;
                                case k.eventTypes.SET_FLAGS:
                                case k.eventTypes.RESET_FLAGS:
                                    if (r.flags !== k.eventTypes.FLAG_DELETED || r.type !== k.eventTypes.SET_FLAGS || (0, L.isAlreadyDeleted)(i, r.peerId,
                                            r.messageId) || i.get()
                                        .blockedFlagUpdates[r.peerId] || m(r), r.flags === k.eventTypes.FLAG_IMPORTANT) {
                                        var l = r.type === k.eventTypes.SET_FLAGS;
                                        i.set(A.updateImportant.bind(null, l ? 1 : -1, r.messageId))
                                            .then(n.updateImportantCnt), i.set(A.updateFavMessage.bind(null, [r.messageId], r.peerId, l))
                                            .then(function(e) {
                                                t.markImportant(r.messageId, l, i)
                                            })
                                    }
                                    break;
                                case k.eventTypes.TYPING:
                                    i.set(A.setTyping.bind(null, r.peerId, r.userId))
                                        .then(function(n) {
                                            (0, L.isTabLoaded)(n.get(), r.peerId) && (t.updateTyping(r, n), e.updateTyping(r, n))
                                        }), i.set(A.waitTyping.bind(null, r.peerId, r.userId))
                                        .then(function(n) {
                                            (0, L.isTabLoaded)(n.get(), r.peerId) && (t.updateTyping(r, n), e.updateTyping(r, n))
                                        });
                                    break;
                                case k.eventTypes.NOTIFY_SETTINGS_CHANGED:
                                    v(i, p, r.peerId, r.disabledUntil < 0);
                                    break;
                                case k.eventTypes.RESYNC:
                                    i.get()
                                        .longpoll.pause(), i.set(A.resync)
                                        .then(p()
                                            .resync)
                                        .then(function(e) {
                                            return i.get()
                                                .longpoll.resume()
                                        })
                            }
                        })
                    })
            },
            unmount: function(r) {
                show("footer_wrap"), o.stop(), removeEvent(document, "mousemove mousedown keydown", s), removeEvent(document, "keydown", h), removeEvent(window,
                    "resize", l), c.stop(), e.unmount();
                var a = window.devicePixelRatio >= 2 ? "_2x" : "";
                setFavIcon("/images/icons/favicons/fav_logo" + a + ".ico"), t.unmount(), n.unmount()
            }
        }
    }

    function p(e, t, n) {
        t.set(A.updateFavAndTitle.bind(null, !1, !1)), !n || "keypress" !== n.type || 27 === n.which || 13 === n.which || (0, A.isSearchingInplace)(t.get()
                .peer, t.get()) || hasClass(document.activeElement, "_im_text") || hasClass(document.activeElement, "im_editable") || hasClass(document.activeElement,
                "fc_editable") || "INPUT" === document.activeElement.tagName || "TEXTAREA" === document.activeElement.tagName || document.activeElement.getAttribute(
                "contenteditable") || n.ctrlKey || browser.mac && n.metaKey || (0 === t.get()
                .peer ? e()
                .focusSearch(t) : e()
                .focusTxt(t)), (0, L.isReservedPeer)(t.get()
                .peer) || e()
            .onUserActions(t, n)
    }

    function _(e, t, n, r, a, i) {
        var o = ge("page_header"),
            s = (ge("footer_wrap"), window.innerHeight - o.offsetHeight - M);
        if (setStyle(e, {
                height: Math.max(s, x)
            }), r && r.updateScroll(), a && a.updateScroll(), n) {
            var l = n.updateScroll();
            n.scrollFix(t, t.get()
                .peer, l)
        }
    }

    function h(e, t) {
        t && "keydown" === t.type && 27 === t.which && !layers.visible && e.set(A.setExecStack.bind(null, (0, I.executionStackPop)(e.get()
            .stack)))
    }

    function v(e, t, n, r) {
        e.set(A.setMutedPeer.bind(null, n, r))
            .then(t()
                .updateState.bind(null, n))
    }

    function y(e, t) {
        hide("footer_wrap");
        var n = window.devicePixelRatio >= 2 ? "_2x" : "";
        setFavIcon("/images/icons/favicons/fav_im" + n + ".ico"), _(e, t, !1, !1, !1, !0), show(e), t.set(A.fetchLocalHints);
        var r = (0, P.createMutations)(m),
            a = r.callMutations,
            o = r.bindMutations,
            s = (0, k.startLongPoll)(t.get());
        s.on("data", function() {
            for (var e = arguments.length, n = Array(e), r = 0; e > r; r++) n[r] = arguments[r];
            return a()
                .onEvents(t, n)
        });
        var l = (0, C.mount)(geByClass1("_im_page_dcontent", e), t, a),
            u = (0, T.mount)(geByClass1("_im_page_history", e), t, a),
            c = (0, E.mount)(geByClass1("_im_dialogs_search", e), t, a),
            d = (0, w.mount)(geByClass1("_im_dialogs_settings", e), t, a),
            g = (0, S.mount)(geByClass1("_im_dialogs_creation", e), t, a);
        u.updateScroll();
        var v = throttle(p.bind(null, a, t), 300);
        (0, L.isReservedPeer)(t.get()
            .peer) || setTimeout(function(e) {
            f(t, l, u)
        }, 10);
        var y = new IdleManager({
                id: "im",
                element: document,
                focusElement: window,
                triggerEvents: "mousemove mousedown keypress"
            }),
            b = _.bind(null, e, t, u, l, g, !1),
            M = h.bind(null, t);
        t.get()
            .longpoll = s, addEvent(window, "resize", b), t.set(A.setExecStack.bind(null, [])), y.on("unidle", function() {
                s.abortPauses(), v()
            }), y.start(), addEvent(document, "mousemove mousedown keypress", v), addEvent(document, "keydown", M), t.set(A.fetchFriends);
        var x = (0, I.throttleAccumulate)(i.bind(null, t, u), 200);
        return o(l, u, c, e, y, v, b, s, x, a, g, M, d)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var b = function() {
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
    t.mount = y;
    var C = n(3),
        T = n(84),
        E = n(94),
        w = n(96),
        S = n(98),
        P = n(83),
        k = n(75),
        I = (n(77), n(80)),
        A = n(73),
        L = n(81),
        M = 30,
        x = 400
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
        n.toTop(), n.reset(), r = r.length > 0 ? r.concat([{
            type: "sep",
            peerId: "000"
        }]) : [P()], n.pipeReplace(Promise.resolve(r))
    }

    function i(e) {
        return hasClass(e, "_im_search")
    }

    function o(e, t, n, r) {
        return e.get()
            .searchText && e.get()
            .searchAllLoaded ? Promise.resolve([]) : e.get()
            .dialog_search_going ? Promise.resolve(!1) : e.get()
            .searchText ? (0, O.searchMessages)(e.get()
                .searchText, e.get())
            .then(function(e) {
                var t = x(e, 2),
                    n = t[0],
                    r = t[1];
                return w(r, n)
            }) : e.get()
            .dialogsAll ? Promise.resolve([]) : e.set(O.loadDialogs)
            .then(function(t) {
                return L(e)
            })
    }

    function s(e, t) {
        var n = e.get()
            .pendingForward;
        n && n.length > 0 && e.set(O.forwardMessages.bind(null, e.get()
            .pendingForward, t))
    }

    function l(e, t, n, r) {
        var a = parseInt(domData(r, "peer"), 10),
            o = t.get()
            .peer,
            l = parseInt(domData(r, "msgid")),
            u = t.get()
            .msgid;
        i(r) && u !== l ? (e()
            .loadingPeer(t), t.set(O.changePeer.bind(null, a, l))
            .then(e()
                .changePeer.bind(null, l))
            .then(function() {
                t.set(O.selectPeerOnMessage.bind(null, a !== o, o))
                    .then(e()
                        .selectPeer)
            })) : a !== o ? (e()
            .hideFwd(t), e()
            .loadingPeer(t), e()
            .cancelSearch(t), t.set(O.changePeer.bind(null, a, 0))
            .then(e()
                .changePeer.bind(null, !1))
            .then(function() {
                t.set(O.selectPeer.bind(null, !0))
                    .then(function() {
                        s(t, a), e()
                            .selectPeer(t)
                    })
            })) : a === o && (i(r) ? e()
            .changePeer(u, t) : (e()
                .cancelSearch(t), e()
                .changePeer(!1, t)), s(t, o), e()
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
            case "market":
                return getLang("mail_added_market_item")
        }
        return ""
    }

    function c(e, t) {
        var n;
        n = (0, F.isChatPeer)(e) && !t.photo ? (0, F.renderPhotosFromTab)(t, !0) : '<img src="' + t.photo + '"/>';
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

    function f(e, t, n, r, a, i, o) {
        var s = "",
            l = "";
        return e & H.eventTypes.FLAG_OUTBOUND ? s = getLang("mail_by_you") : (0, F.isChatPeer)(n) && 0 !== r && (s = t.data.members[r].first_name), o = o.replace(
            /\<br\s*\/?\>/gi, " "), a && (o = Emoji.emojiToHTML(o, !0)), !o && i.length > 0 && (o = getTemplate("im_dialog_media", {
            name: u(i[0])
        })), l = s ? getTemplate("im_drow_prebody", {
            prebody: s,
            body: o
        }) : o
    }

    function g(e, t, n, r) {
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
                .peer ? "nim-dialog_selected" : ""
        })
    }

    function m(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3],
            a = c(t.peerId, t),
            i = a.photo,
            o = a.userLink,
            s = n || h(t);
        if (!s) return g(t, i, o, e, r);
        var l = s.flags,
            u = t.unread > 0 ? t.unread : "",
            d = "";
        d = (0, F.isServiceMsg)(s) ? (0, F.renderServiceMsg)(s, t, !1) : f(l, t, t.peerId, s.userId, s.kludges.emoji, s.attaches, s.text);
        var m = [];
        return r.search && m.push("_im_search", "nim-dialog_search"), inArray(t.peerId, e.get()
            .mutedPeers) && m.push("nim-dialog_muted"), t.verified && m.push("nim-dialog_verified"), -1 === s.messageId && m.push("nim-dialog_empty"), getTemplate(
            "im_drow", {
                peer: t.peerId,
                msg_id: s.messageId,
                photo: i,
                user_link: o,
                date: s.date ? getShortDateOrTime(s.date, e.get()
                    .timeshift, !0, getLang("months_sm_of", "raw")) : "",
                body: d,
                unread: u,
                more: m.join(" "),
                is_star: t.folders & H.eventTypes.FOLDER_IMPORTANT,
                is_online: t.online ? "nim-peer_online" : "",
                is_unread: u > 0 && l & H.eventTypes.FLAG_UNREAD ? "nim-dialog_unread" : "",
                is_unread_out: l & H.eventTypes.FLAG_UNREAD && l & H.eventTypes.FLAG_OUTBOUND && !(0, F.isSelfMessage)(t.peerId) ? "nim-dialog_unread-out" : "",
                is_selected: r.noselect || t.peerId != e.get()
                    .peer ? "" : "nim-dialog_selected"
            })
    }

    function p(e, t, n, r, a) {
        var i = h(t),
            o = i.flags,
            s = _(t, n),
            l = c(t.peerId, t),
            u = l.photo,
            d = i.date ? getShortDateOrTime(i.date, n.get()
                .timeshift, !0, getLang("months_sm_of", "raw")) : "";
        val(geByClass1("_dialog_body", e), s), val(geByClass1("_im_dialog_date", e), d), val(geByClass1("_im_dialog_unread_ct", e), t.unread ? t.unread : ""), val(
                geByClass1("_im_dialog_link", e), t.tab), val(geByClass1("_im_dialog_photo", e), u), t.folders & H.eventTypes.FOLDER_IMPORTANT, toggleClass(e,
                "nim-dialog_verified", !!t.verified), toggleClass(e, "nim-dialog_muted", inArray(t.peerId, n.get()
                .mutedPeers)), toggleClass(geByClass1("_im_peer_online", e), "nim-peer_online", !!t.online), t.unread > 0 && o & H.eventTypes.FLAG_UNREAD && addClass(e,
                "nim-dialog_unread"), -1 === i.messageId && addClass(e, "nim-dialog_empty"), o & H.eventTypes.FLAG_UNREAD && o & H.eventTypes.FLAG_OUTBOUND && !(0, F.isSelfMessage)
            (t.peerId) && addClass(e, "nim-dialog_unread-out"), a && setTimeout(function() {
                addClass(geByClass1("_im_dialog_" + t.peerId), "nim-dialog_injected")
            }, 100)
    }

    function _(e, t) {
        var n = h(e);
        return (0, F.isServiceMsg)(n) ? (0, F.renderServiceMsg)(n, e, !1) : f(n.flags, e, e.peerId, n.userId, n.emoji, n.attaches, n.text)
    }

    function h(e) {
        var t = e.lastmsg_meta;
        if (isArray(t) && (t = (0, R.addMessageEvent)([4].concat(t))), !t) {
            var n = "";
            return (0, F.isChatPeer)(e.peer) || (n = e.online ? "online" : "offline"), (0, R.addMessageEvent)([4, -1, 0, e.peer, "", "", n, {}, -1])
        }
        return t
    }

    function v(e, t, n, r, a) {
        var i = gpeByClass("_im_dialog", a, n);
        if (i) var o = intval(domData(i, "peer")),
            s = (0, F.showFlushDialog)(o, function(n) {
                (0, F.cleanHistory)(t, s, e, O.flushHistory, o)
            });
        return !1
    }

    function y(e, t) {
        var n = d(e);
        return getTemplate("im_drow", {
            peer: t.peerId,
            msg_id: t.lastmsg,
            photo: (0, F.renderPhotos)(t.photo),
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
                .peer && n ? "nim-dialog_selected" : ""
        })
    }

    function b(e) {
        var t = getLang("mail_search_only_messages");
        return '<li class="im-page--mess-search-w">\n    <div class="im-page--mess-search ' + G + '">\n      ' + t + "\n    </div>\n  </li>"
    }

    function C() {
        return '<li class="im-page--dialogs-empty">\n    ' + getLang("mail_im_search_empty") + "\n  </div>\n  "
    }

    function T(e, t) {
        return !e.get()
            .unread_only || t.unread > 0
    }

    function E(e, t) {
        if ("sep" === t.type) return (0, F.renderMessagesSearch)();
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
                return (0, R.addMessageEvent)([4].concat(e))
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

    function P() {
        return {
            type: "empty",
            peerId: "empty"
        }
    }

    function k(e) {
        return 0 === e.length ? e : e.concat([S()])
    }

    function I(e, t, n) {
        return t()
            .toggleSettingsLoader(n, !0), e.checkMore(!0)
            .then(t()
                .toggleSettingsLoader.bind(null, n, !1))
    }

    function A(e, t, n, r, a, o, s) {
        return {
            selectPeer: function(t, n) {
                for (var r = geByClass("_im_dialog", e), a = n.get()
                        .peer, o = 0; o < r.length; o++) {
                    var s = r[o],
                        l = intval(domData(s, "peer")),
                        u = intval(domData(s, "msgid"));
                    l === a && (!t && !i(s) || t === u && i(s)) ? addClass(s, "nim-dialog_selected") : hasClass(s, "nim-dialog_selected") && removeClass(s,
                        "nim-dialog_selected")
                }
            },
            appendFastDialogs: function(t, n, r) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), o.saveScroll("list"), r ? (o.reset(), n = k(n), o.pipeReplace(Promise.resolve(n))) : o.pipe(
                    Promise.resolve(n)), o.toTop()
            },
            appendSearch: function(t, n, r) {
                var a = w(r, n);
                r.length > 0 ? (addClass(e.parentNode, "im-page--dialogs_with-mess"), o.pipe(Promise.resolve([{
                    type: "sep",
                    peerId: "000"
                }].concat(a)))) : (0 === o.getCurrentElements()
                    .length && o.pipeReplace(Promise.resolve([P()])), removeClass(e.parentNode, "im-page--dialogs_with-mess"))
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
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), 0 !== L(t)
                    .length || o.isLoading() || (n = !0), n && o.reset(), r && o.wipe(), o.pipeReplace(Promise.resolve(L(t)))
                    .then(function(e) {
                        return n ? (o.toTop(), I(o, s, t)) : void o.restoreScroll("list")
                    })
            },
            appendDialogs: function(t, n) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), n.forEach(function(n) {
                    var r = geByClass1("_im_dialog_" + n.peerId);
                    r && p(r, n, t, e, !0)
                }), n = k(n), o.pipe(Promise.resolve(n))
            },
            updateCounter: function(t, n) {
                var r = geByClass1("_im_dialog_" + n.peerId, e);
                if (r && !i(r) && !(0, F.isSelfMessage)(n.peerId)) {
                    var a = t.get()
                        .tabs[n.peerId],
                        o = a.unread > 0 ? a.unread : "";
                    val(geByClass1("_im_dialog_unread_ct", r), o), o ? addClass(r, "nim-dialog_unread") : removeClass(r, "nim-dialog_unread"), a.lastmsg > a.out_up_to &&
                        !a.unread && a.lastmsg_meta.flags & H.eventTypes.FLAG_OUTBOUND ? addClass(r, "nim-dialog_unread-out") : removeClass(r, "nim-dialog_unread-out")
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
                if (a && !i(a) || !t.get()
                    .searchText) {
                    a && re(a);
                    var s = t.get()
                        .tabs[n.peerId];
                    T(t, s) && (o.pipe(Promise.resolve([s])), r()
                        .updateTyping(n, t))
                }
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
                        o = (0, F.formatTyper)(n.get()
                            .tabs[t.peerId].typing, t.peerId, !0, n.get(), 1);
                    val(a, o), toggleClass(r, "nim-dialog_typing", o)
                }
            },
            unmount: function() {
                o.unmount(), (0, D.removeDelegateEvent)(e, "click", "_im_dialog", t), (0, D.removeDelegateEvent)(e, "mouseover", "_im_dialog_close", n), (0, D.removeDelegateEvent)
                    (e, "click", "__im_dialog_close", a)
            }
        }
    }

    function L(e) {
        var t = e.get()
            .unread_only ? e.get()
            .unread_dialogs : e.get()
            .all_dialogs,
            n = e.get()
            .tabs;
        return t.map(function(e) {
            return n[e]
        })
    }

    function M(e, t, n) {
        var r = (0, U.createMutations)(A),
            i = r.callMutations,
            s = r.bindMutations,
            u = l.bind(null, n, t),
            c = v.bind(null, n, t, e),
            d = function(e, t) {
                var n = t.getBoundingClientRect()
                    .top;
                showTooltip(t, {
                    text: getLang("mail_delete"),
                    black: 1,
                    asrtl: 1,
                    toup: n > 150
                })
            },
            f = (0, j.mount)(e, (0, N["default"])({
                limit: 40,
                offset: 0,
                height: 64,
                elements: L(t),
                elCls: "_im_dialogs"
            }), function(e) {
                return {
                    idFn: function(e) {
                        return e.message ? e.message.messageId : e.peerId
                    },
                    renderFn: E.bind(null, t),
                    sortFn: function(e, t) {
                        return "only_mes" === e.type || "only_mes" === t.type ? "only_mes" === e.type ? -1 : 1 : e.message && t.message ? t.message.messageId - e.message
                            .messageId : e.message && !t.message ? 1 : t.message && !e.message ? -1 : "sep" === e.type && t.message ? -1 : "sep" === e.type ? 1 :
                            "sep" === t.type && e.message ? 1 : "sep" === t.type ? -1 : t.lastmsg_meta && e.lastmsg_meta ? h(t)
                            .date - h(e)
                            .date : t.lastmsg - e.lastmsg
                    },
                    more: o.bind(null, t, i),
                    onClick: u
                }
            }),
            g = a.bind(null, t, e, f);
        return (0, D.addDelegateEvent)(e, "click", "_im_dialog_close", c), (0, D.addDelegateEvent)(e, "click", "_im_dialog", u), (0, D.addDelegateEvent)(e, "click", G, g),
            (0, D.addDelegateEvent)(e, "mouseover", "_im_dialog_close", d), s(e, u, d, i, c, f, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var x = function() {
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
    t.mount = M;
    var D = (n(4), n(5)),
        O = n(73),
        F = n(81),
        B = n(76),
        N = r(B),
        j = n(82),
        R = n(77),
        U = n(83),
        H = n(75),
        G = "_im_mess_search"
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
        f = n(10)("iterator"),
        g = !([].keys && "next" in [].keys()),
        m = "@@iterator",
        p = "keys",
        _ = "values",
        h = function() {
            return this
        };
    e.exports = function(e, t, n, v, y, b, C) {
        u(n, t, v);
        var T, E, w, S = function(e) {
                if (!g && e in A) return A[e];
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
            P = t + " Iterator",
            k = y == _,
            I = !1,
            A = e.prototype,
            L = A[f] || A[m] || y && A[y],
            M = L || S(y),
            x = y ? k ? S("entries") : M : void 0,
            D = "Array" == t ? A.entries || L : L;
        if (D && (w = d(D.call(new e)), w !== Object.prototype && (c(w, P, !0), r || s(w, f) || o(w, f, h))), k && L && L.name !== _ && (I = !0, M = function() {
                return L.call(this)
            }), r && !C || !g && !I && A[f] || o(A, f, M), l[t] = M, l[P] = h, y)
            if (T = {
                    values: k ? M : S(_),
                    keys: b ? M : S(p),
                    entries: x
                }, C)
                for (E in T) E in A || i(A, E, T[E]);
            else a(a.P + a.F * (g || I), t, T);
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
            var c, d, f, g, m = e & u.F,
                p = e & u.G,
                _ = e & u.S,
                h = e & u.P,
                v = e & u.B,
                y = p ? r : _ ? r[t] || (r[t] = {}) : (r[t] || {})[l],
                b = p ? a : a[t] || (a[t] = {}),
                C = b[l] || (b[l] = {});
            p && (n = t);
            for (c in n) d = !m && y && void 0 !== y[c], f = (d ? y : n)[c], g = v && d ? s(f, r) : h && "function" == typeof f ? s(Function.call, f) : f, y && o(y, c, f,
                e & u.U), b[c] != f && i(b, c, g), h && C[c] != f && (C[c] = f)
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
    for (var r = n(54), a = n(14), i = n(12), o = n(15), s = n(36), l = n(10), u = l("iterator"), c = l("toStringTag"), d = s.Array, f = ["NodeList", "DOMTokenList",
            "MediaList", "StyleSheetList", "CSSRuleList"
        ], g = 0; 5 > g; g++) {
        var m, p = f[g],
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
        f = n(65),
        g = n(20),
        m = n(66)
        .fastKey,
        p = g ? "_s" : "size",
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
            }), g && r(d.prototype, "size", {
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
            }, n ? "entries" : "values", !n, !0), f(t)
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
        var d, f, g, m = c ? function() {
                return e
            } : l(e),
            p = r(n, u, t ? 2 : 1),
            _ = 0;
        if ("function" != typeof m) throw TypeError(e + " is not iterable!");
        if (i(m))
            for (d = s(e.length); d > _; _++) t ? p(o(f = e[_])[0], f[1]) : p(e[_]);
        else
            for (g = m.call(e); !(f = g.next())
                .done;) a(g, p, f.value, t)
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
        f = function(e, t) {
            if (!i(e, r)) {
                if (!l(e)) return !0;
                if (!t) return !1;
                c(e)
            }
            return e[r].w
        },
        g = function(e) {
            return u && m.NEED && l(e) && !i(e, r) && c(e), e
        },
        m = e.exports = {
            KEY: r,
            NEED: !1,
            fastKey: d,
            getWeak: f,
            onFreeze: g
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
        f = n(68),
        g = n(50),
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
                P = d(function() {
                    w.has(1)
                }),
                k = f(function(e) {
                    new y(e)
                }),
                I = !h && d(function() {
                    for (var e = new y, t = 5; t--;) e[b](t, t);
                    return !e.has(-0)
                });
            k || (y = t(function(t, n) {
                u(t, y, e);
                var r = m(new v, t, y);
                return void 0 != n && l(n, _, r[b], r), r
            }), y.prototype = C, C.constructor = y), (P || I) && (E("delete"), E("has"), _ && E("get")), (I || S) && E(b), h && C.clear && delete C.clear
        } else y = p.getConstructor(t, e, _, b), o(y.prototype, n), s.NEED = !0;
        return g(y, e), T[e] = y, a(a.G + a.W + a.F * (y != v), T), h || p.setStrong(y, e, _), y
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
                    return (0, st.isFullyLoadedTab)(e, t)
                });
            e.renew_hashes = (0, nt.post)(lt, {
                    act: "a_renew_hash",
                    peers: n.join(",")
                })
                .then(function(t) {
                    var r = tt(t, 1),
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
        return r.tabHistoryNotChanged = !1, (0, nt.post)(lt, {
                act: "a_start",
                peer: e,
                msgid: n,
                history: t
            })
            .then(function(t) {
                var a = tt(t, 1),
                    i = a[0];
                if (r.tabs || (r.tabs = {}), r.tabs[e] || (r.tabs[e] = {}), n) {
                    if (r.tabs[e]) {
                        var o = r.tabs[e].lastmsg,
                            s = r.tabs[e].lastmsg_meta;
                        extend(r.tabs[e], i), r.tabs[e].lastmsg = o, r.tabs[e].lastmsg_meta = s
                    }
                } else extend(r.tabs[e], i);
                r.all_dialogs.length > 0 && (r.all_dialogs = [e].concat(r.all_dialogs.filter(function(t) {
                    return t !== e
                }))), r.tabs[e].unread > 0 && (r.unread_dialogs = [e].concat(r.unread_dialogs.filter(function(t) {
                    return t !== e
                })));
                r.imQueue(e, !1);
                return f(e, r)
            })
    }

    function d(e, t) {
        return Object.keys(e.msgs)
            .filter(function(n) {
                return intval(e.msgs[n][4]) === t
            })
            .length > 0
    }

    function f(e, t) {
        var n = t.imQueue(e, !1),
            r = t.tabs[e],
            a = n.filter(function(e) {
                return !d(r, e.rid)
            });
        return r.msgs = a.reduce(function(e, t) {
            return e["rid" + t.rid] = [1, 0, 0, 1, intval(t.rid)], e
        }, r.msgs), t.imQueueSet(e, a), t.tabs[e].history = (0, st.restoreQueue)(a, t, l(t.tabs[e].history)), Promise.resolve(t)
    }

    function g(e, t, n) {
        var r = n.imQueue(e, !1)
            .filter(function(e) {
                return e.failed && e.mess.messageId !== t
            });
        return n.imQueueSet(e, r), Promise.resolve(n)
    }

    function m(e) {
        return "peerAttachesKey_" + vk.id + "_" + e
    }

    function p(e) {
        return "im_draft_" + vk.id + "_" + e
    }

    function _(e) {
        return "peerFwd_" + vk.id + "_" + e
    }

    function h(e, t) {
        var n = t.peer;
        return Promise.resolve(t)
            .then(function(t) {
                return t.tabHistoryNotChanged = !1, (0, st.isFullyLoadedTab)(t, n) && !t.tabs[n].skipped ? Promise.resolve(t)
                    .then(b) : c(n, e, !1, t)
            })
            .then(b)
    }

    function v(e, t, n) {
        var r = n.msgid,
            a = n.peer;
        return !e && (0, st.isFullyLoadedTab)(n, a) && n.tabs[a].msgs[r] ? (t === n.peer ? n.tabHistoryNotChanged = !0 : n.tabHistoryNotChanged = !1, Promise.resolve(n)
                .then(b)) : c(a, !0, r, n)
            .then(b)
    }

    function y(e, t, n) {
        if (ze(n)) throw showFastBox({
            title: getLang("global_error"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, getLang("mail_message_wait_until_uploaded")), new Error("Cant change peer while loading somethind");
        return n.prevPeer = n.peer, n.peer = e, n.msgid = t || "", cur.peer = e, (0, rt.updateLocation)({
            0: "im",
            sel: (0, st.convertPeerToUrl)(e),
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
        n.offset && a.push("photos"), n.offset && a.push("search"), (-2e9 > t || n.offset) && a.push("clear"), !(0, st.isChatPeer)(t) || r.kicked || r.closed || (inArray(t,
            i) ? a.push("unmute") : a.push("mute")), (0, st.isUserPeer)(t) && !e.gid && !n.blacklisted && n.is_friend && a.push("invite");
        var o = r ? r.actions : {},
            s = (0, st.chatActions)(e, o);
        return (0, st.isChatPeer)(t) && n.data.closed && (delete s.invite, o = extend({}, o), delete o.invite), e.curActions = a.concat(Object.keys(o))
            .sort(function(e, t) {
                return ct[e] - ct[t]
            })
            .reduce(function(e, t) {
                return e[t] = s[t], e
            }, {}), Promise.resolve(e)
    }

    function C(e, t, n) {
        var r = n.tabs[n.peer];
        return (0, nt.post)(lt, {
                peer: n.peer,
                whole: e,
                act: "a_history",
                offset: r.offset + (r.skipped || 0),
                toend: t,
                gid: n.gid
            })
            .then(function(e) {
                var t = tt(e, 5),
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
        return (0, nt.post)(lt, {
                peer: e.peer,
                act: "a_history",
                rev: 1,
                offset: t.skipped,
                gid: e.gid
            })
            .then(function(n) {
                var r = tt(n, 5),
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
            var o = a.msgs[i][0] ? at.eventTypes.FLAG_OUTBOUND : 0;
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

    function P(e) {
        return (0, nt.post)(lt, {
                act: "a_get_key",
                uid: e.id,
                gid: e.gid
            })
            .then(function(t) {
                var n = tt(t, 3),
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

    function k(e) {
        return (0, nt.post)(lt, {
                act: "a_get_ts",
                gid: e.gid
            })
            .then(function(t) {
                var n = tt(t, 1),
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
        return r.msgs[t.messageId] && (r.msgs[t.messageId][3] = 1, r.history = (0, st.setMessageError)(e, t, l(r.history))), Promise.resolve(n)
    }

    function L(e, t, n) {
        var r = n.tabs[e];
        return r.msgs[t] && (r.msgs[t][3] = 0, r.history = (0, st.startResendMessage)(e, t, l(r.history))), Promise.resolve(n)
    }

    function M(e, t) {
        var n = e.peerId;
        if ((0, st.isTabLoaded)(t, n)) {
            var r = t.tabs[n];
            if ((0, st.isFullyLoadedTab)(t, n)) {
                var a = l(r.history);
                r.skipped > 0 && r.skipped++, r.offset++, r.history = (0, st.appendToHistory)(t, e, a);
                var i = e.flags & at.eventTypes.FLAG_UNREAD ? 1 : 0,
                    o = e.flags & at.eventTypes.FLAG_OUTBOUND && !(0, st.isSelfMessage)(e.peerId) ? 1 : 0,
                    s = e.flags & at.eventTypes.FLAG_IMPORTANT ? 1 : 0;
                r.msgs[e.messageId] = [o, i, s]
            }
            return r.typing && r.typing[e.userId] && delete r.typing[e.userId], r.lastmsg = e.messageId, r.lastmsg_meta = e, e.flags & at.eventTypes.FLAG_OUTBOUND ? r.unread =
                0 : (!r.unread && x(t, 1, e.peerId), r.unread++), t.all_dialogs.length > 0 && (t.all_dialogs = [n].concat(t.all_dialogs.filter(function(e) {
                    return e !== n
                }))), r.unread > 0 && (t.unread_dialogs = [n].concat(t.unread_dialogs.filter(function(e) {
                    return e !== n
                }))), Promise.resolve(t)
        }
        return c(n, !1, !1, t)
    }

    function x(e, t, n) {
        e.cur_unread_cnt || (e.cur_unread_cnt = {}), -1 === t && delete e.cur_unread_cnt[n], e.unread_cnt += t
    }

    function D(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = n.unread;
            t = E(t, e.peerId, e.upToId, 0), t = S(t, e.peerId, intval(n.skipped)), r > 0 && !n.unread && x(t, -1, e.peerId), n.in_up_to = e.upToId, n.out_up_to < e.upToId &&
                (n.out_up_to = e.upToId), n.lastmsg_meta.messageId <= e.upToId && !(n.lastmsg_meta.flags & at.eventTypes.FLAG_OUTBOUND) && (n.lastmsg_meta.flags ^= at.eventTypes
                    .FLAG_UNREAD), n.history = I(l(n.history))
        } else(0, st.isTabLoaded)(t, e.peerId) && (t.tabs[e.peerId].unread > 0 && x(t, -1, e.peerId), t.tabs[e.peerId].unread = 0, t.tabs[e.peerId].in_up_to = e.upToId);
        return (0, st.isTabLoaded)(t, e.peerId) && (t.unread_dialogs = t.unread_dialogs.filter(function(t) {
            return intval(t) !== e.peerId
        })), 0 === t.unread_cnt && t.unread_only ? Qe(t) : Promise.resolve(t)
    }

    function O(e, t) {
        if ((0, st.isTabLoaded)(t, e.peerId)) {
            var n = t.tabs[e.peerId];
            n.out_up_to = e.upToId, n.lastmsg_meta.messageId <= e.upToId && n.lastmsg_meta.flags & at.eventTypes.FLAG_OUTBOUND && (n.lastmsg_meta.flags ^= at.eventTypes.FLAG_UNREAD)
        }
        if ((0, st.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = l(n.history);
            n.history = (0, st.markMessagesAsRead)(t, e.peerId, r)
        }
        return Promise.resolve(t)
    }

    function F(e, t, n, r) {
        return r.text = {
            attachedFiles: 0
        }, r.imQueue = e, r.imQueueResend = t, r.imQueueSet = n, Promise.resolve(r)
    }

    function B(e, t) {
        var n = tt(e, 3),
            r = n[0],
            a = n[1],
            i = n[2];
        t.text.attachedFiles++, t._attach_cache || (t._attach_cache = {}), i ? t._attach_cache[r + a] = i : i = t._attach_cache[r + a];
        var o = t.peer;
        if ((0, st.isFullyLoadedTab)(t, o)) {
            var s = t.tabs[o];
            s.attaches || (s.attaches = []), r !== !1 ? (s.attaches.push([r, a, i, s.attaches.length]), ls.set(m(o), s.attaches)) : r === !1 && "undefined" != typeof a &&
                (s.attaches = s.attaches.filter(function(e) {
                    return e[3] !== a
                }), ls.set(m(o), s.attaches))
        }
        return Promise.resolve(t)
    }

    function N(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            n.attaches = [], ls.set(m(e), [])
        }
        return Promise.resolve(t)
    }

    function j(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            n.attaches && n.attaches.length || (n.attaches = ls.get(m(e)) || [])
        }
        return Promise.resolve(t)
    }

    function R(e, t) {
        return e.set(j.bind(null, t))
            .then(function(e) {
                return (0, st.isFullyLoadedTab)(e.get(), t) ? e.get()
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
        return (0, st.isTabLoaded)(n, e) && (n.tabs[e].online = t), Promise.resolve(n)
    }

    function G(e, t, n) {
        return (0, st.isTabLoaded)(n, e) && (n.tabs[e].typing = extend(n.tabs[e].typing, r({}, t, Date.now()))), Promise.resolve(n)
    }

    function q(e, t, n) {
        return (0, it.pause)(ut + 2)
            .then(function() {
                if ((0, st.isTabLoaded)(n, e)) {
                    var r = n.tabs[e];
                    if (r.typing) {
                        var a = Date.now() - (r.typing[t] || 0);
                        a >= 1e3 * ut && delete r.typing[t]
                    }
                }
                return n
            })
    }

    function Q(e, t, n) {
        return (0, st.isFullyLoadedTab)(n, e) && (n.tabs[e].imdraft = t, ls.set(p(e), t)), Promise.resolve(n)
    }

    function K(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.imdraft || (n.imdraft = ls.get(p(e))), Promise.resolve(n.imdraft || "")
        }
        return Promise.resolve("")
    }

    function W(e, t) {
        t.selectedMessages || (t.selectedMessages = []);
        var n = t.selectedMessages.filter(function(t) {
            return t !== e
        });
        return n.length !== t.selectedMessages.length ? t.selectedMessages = n : t.selectedMessages.push(e), Promise.resolve(t)
    }

    function z(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function V(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function Y(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = t.imQueue(e.peerId)
                .filter(function(t) {
                    return t.failed && t.rid !== e.randomId
                });
            t.imQueueSet(e.peerId, r), n.history = (0, st.replaceMessageAttrs)(t, l(n.history), e), n.lastmsg_meta = e, n.lastmsg = e.messageId;
            var a = n.msgs["rid" + e.randomId];
            a && (n.msgs[e.messageId] = a, delete n.msgs["rid" + e.randomId])
        }
        return Promise.resolve(t)
    }

    function X(e, t) {
        return Promise.resolve()
    }

    function Z(e, t) {
        return (0, nt.post)(lt, {
                act: "a_get_media",
                id: e.messageId,
                gid: t.gid
            })
            .then(function(n) {
                var r = tt(n, 3),
                    a = r[0],
                    i = r[1],
                    o = r[2],
                    s = t.tabs[e.peerId];
                return s.mediacontent || (s.mediacontent = {}), s.mediacontent[e.messageId] = [a, i, o], $(e, t)
            })
    }

    function $(e, t) {
        var n = t.tabs[e.peerId];
        return n.history = (0, st.replaceAttaches)(l(n.history), e, t), Promise.resolve(t)
    }

    function J(e, t, n) {
        var r = (0, st.dayFromVal)(t),
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
        return (0, nt.post)(lt, {
                act: "a_hints",
                str: e,
                query: n,
                peerIds: t.join(",")
            })
            .then(function(e) {
                var t = tt(e, 1),
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
            }), (0, nt.post)(lt, {
                act: "a_dialogs_preload"
            })
            .then(function(n) {
                var r = tt(n, 1),
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
        return (0, nt.post)("al_im.php", {
                act: "a_get_dialogs",
                offset: e.offset,
                unread: t ? 1 : "",
                gid: e.gid,
                type: e.gfilter
            })
            .then(function(n) {
                var r = tt(n, 2),
                    a = r[0],
                    i = r[1];
                return U(i, e), t ? e.unread_dialogs = e.unread_dialogs.concat(Object.keys(i)
                    .map(intval)) : e.all_dialogs = e.all_dialogs.concat(Object.keys(i)
                    .map(intval)), e.offset = a.offset, e.dialogsAll = !a.has_more, Promise.resolve(e)
            })
    }

    function le(e, t) {
        return (0, nt.post)(lt, {
                act: "a_search",
                q: e,
                from: "all",
                offset: t.searchOffset || 0
            })
            .then(function(e) {
                var n = tt(e, 4),
                    r = n[0],
                    a = n[1],
                    i = n[2],
                    o = n[3];
                return t.searchOffset = i, t.searchAllLoaded = o, [r, a]
            })
    }

    function ue(e, t) {
        var n = t.tabs[e];
        return n.searchAllLoaded
    }

    function ce(e, t) {
        if (t.peer === e && (0, st.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.inplaceSearch
        }
        return !1
    }

    function de(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.inplaceSearch, delete n.searchOffset, delete n.searchAllLoaded, delete n.searchText, delete n.searchDay
        }
        return Promise.resolve(t)
    }

    function fe(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.searchDay, n.searchOffset = 0, n.searchAllLoaded = !1
        }
        return Promise.resolve(t)
    }

    function ge(e, t) {
        var n = t.tabs[e];
        return n.inplaceSearch = !0, Promise.resolve(t)
    }

    function me(e, t) {
        var n = t.tabs[e],
            r = "";
        if (ge(e, t), n.searchDay && (r = "day:" + n.searchDay), !r && !n.searchText) return Promise.reject();
        var a = "in:" + e + " " + r + " " + (n.searchText || "");
        return (0, nt.post)(lt, {
                act: "a_search",
                q: a,
                from: "in",
                offset: n.searchOffset || 0
            })
            .then(function(e) {
                var t = tt(e, 3),
                    r = t[0],
                    a = t[1],
                    i = t[2];
                return n.searchOffset = a, n.searchAllLoaded = i, r
            })
    }

    function pe(e) {
        return (0, nt.post)(lt, {
            act: "a_important",
            offset: e,
            part: e > 0
        })
    }

    function _e(e, t, n) {
        var t = n.peer;
        if ((0, st.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted = r.deleted ? r.deleted.concat(e) : e, r.history = (0, st.removeMessages)(e, l(r.history)), r.offset -= e.filter(function(e) {
                    return r.msgs[e]
                })
                .length, e.forEach(function(e) {
                    return delete r.msgs[e]
                })
        }
        return Promise.resolve(n)
    }

    function he(e, t, n, r) {
        return (0, nt.post)(lt, {
            act: "a_mark",
            peer: t,
            hash: n,
            msgs_ids: e.join(","),
            mark: r
        })
    }

    function ve(e, t, n, r) {
        if ((0, st.isFullyLoadedTab)(r, t)) {
            var a = r.tabs[t];
            a.deleted = a.deleted ? a.deleted.concat(e) : e, a.history = (0, st.removeMessagesWithRestore)(e, t, n, l(a.history)), a.offset -= e.filter(function(e) {
                    return a.msgs[e]
                })
                .length
        }
        return Promise.resolve(r)
    }

    function ye(e, t, n) {
        if ((0, st.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted && (r.deleted = r.deleted.filter(function(t) {
                return t !== e
            })), r.history = (0, st.restoreMessage)(e, t, l(r.history)), r.offset++
        }
        return Promise.resolve(n)
    }

    function be(e, t, n) {
        return (0, nt.post)(lt, {
            act: "a_restore",
            id: e,
            peer: t,
            hash: n
        })
    }

    function Ce(e, t) {
        return t.msgid = e, Promise.resolve(t)
    }

    function Te(e, t, n) {
        if ((0, st.isFullyLoadedTab)(n, t)) {
            n.pendingForward = [];
            var r = n.tabs[t];
            r.fwdMessages = e, ls.set(_(t), e)
        }
        return Promise.resolve(n)
    }

    function Ee(e, t) {
        if ((0, st.isFullyLoadedTab)(t, e)) {
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

    function Pe(e, t, n) {
        var r = Object.keys(e)
            .map(function(t) {
                return t + ":" + e[t].join(",")
            })
            .join(";");
        return t.pause(), (0, nt.post)(lt, {
                act: "a_load_member",
                need: r
            })
            .then(function(e) {
                var r = tt(e, 1),
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

    function ke(e, t, n) {
        var r = e.filter(function(e) {
                return e.kludges.source_act === st.CHAT_INVITE_USER
            })
            .filter(function(e) {
                return !n.tabs[e.peerId].data.members[e.kludges.source_mid]
            })
            .reduce(function(e, t) {
                var n = t.kludges.source_mid;
                return e[t.peerId] || (e[t.peerId] = []), inArray(n, e[t.peerId]) || e[t.peerId].push(n), e
            }, {});
        return Object.keys(r) > 0 ? Pe(r, t, n) : Promise.resolve(n)
    }

    function Ie(e, t, n, r) {
        var a = r.tabs[n];
        if (t !== vk.id) return Promise.resolve(r);
        if ((0, st.isTabLoaded)(r, n)) {
            if (e === st.CHAT_KICK_USER) {
                var a = r.tabs[n];
                a.data.closed = !0, delete a.data.actions.leave, delete a.data.actions.avatar, delete a.data.actions.topic, delete a.data.actions.mute, delete a.data.actions
                    .unmute, t === vk.id && (a.data.actions["return"] = getLang("mail_return_to_chat"))
            } else e === st.CHAT_INVITE_USER && (a.data.closed = !1, delete a.data.actions["return"], a.data.actions.leave = getLang("mail_leave_chat"), a.data.actions.avatar =
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
        return (0, st.isTabLoaded)(n, e) && delete n.tabs[e].data.members[t], Promise.resolve(n)
    }

    function Me(e, t) {
        return t.stack = e, Promise.resolve(t)
    }

    function xe(e, t, n, r) {
        if ((0, st.isFullyLoadedTab)(r, t)) {
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

    function De(e, t, n) {
        n.importants || (n.importants = {});
        var r = n.importants[t] || 0;
        return r !== e && (n.important_cnt += e, n.importants[t] = e), Promise.resolve(n)
    }

    function Oe(e) {
        return (0, nt.post)(lt, {
            act: "a_spam",
            offset: e,
            part: e > 0
        })
    }

    function Fe(e) {
        return (0, nt.post)(lt, {
            act: "a_flush_spam",
            hash: e
        })
    }

    function Be(e, t, n) {
        return n.creationType = e, n.creationFilter = t, Promise.resolve(n)
    }

    function Ne(e, t) {
        return (0, nt.post)(lt, {
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
        return (0, nt.post)("al_page.php", {
                act: "owner_photo_save",
                peer: e,
                _query: t
            })
            .then(function(e) {
                return n
            })
    }

    function Ue(e, t, n, r) {
        return r.creating = !0, (0, nt.post)(lt, {
                act: "a_multi_start",
                hash: r.writeHash,
                peers: t.join(","),
                title: n
            })
            .then(function(e) {
                var t = tt(e, 1),
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
        return (0, nt.post)(lt, {
                act: "a_resync",
                sel: e.peer,
                unread: 0,
                loaded: n
            })
            .then(function(a) {
                var i = tt(a, 2),
                    o = i[0],
                    s = i[1];
                if ((0, ot.lplog)("Resync success", "success"), console.log(o, s, "resync data"), Object.keys(o)
                    .length < n && 100 !== Object.keys(o)
                    .length) throw new Error("Not full data from server, retry");
                var u, c = e.peer;
                return u = (0, st.isReservedPeer)(c) ? Promise.resolve(!1) : U(r({}, c, o[c]), {
                    tabs: r({}, c, e.tabs[c])
                }), u.then(function(n) {
                    return e.tabs = o, n && (e.tabs[c] = n.tabs[c], e.tabs[c].history = (0, st.restoreQueue)(c, e, l(e.tabs[c].history))), e.loadingDialogs = !
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
                return (0, ot.lplog)("Resync error: " + t.message + " " + t.stack, "error"), (0, it.pause)(2)
                    .then(He.bind(null, e))
            })
    }

    function Ge(e, t, n, r) {
        if ((0, st.isTabLoaded)(r, e)) {
            var a = r.tabs[e].data.members[n];
            t == n ? a.closed = 1 : a.kicked = 1, n === vk.id && t != n && (r.tabs[e].data.kicked = 1)
        }
        return Promise.resolve(r)
    }

    function qe(e) {
        return e.all_dialogs.filter(function(t) {
            return e.tabs[t].unread > 0
        })
    }

    function Qe(e) {
        return e.unread_only = !e.unread_only, e.unread_only ? (e.offset = e.unread_dialogs.length, 0 === e.offset && (e.unread_dialogs = qe(e)), e.offset = e.unread_dialogs
            .length) : e.offset = e.all_dialogs.length, (0, rt.updateLocation)({
            unread: e.unread_only ? "1" : ""
        }), e.unread_only && e.dialogsAll && (e.dialogsAllAll = !0), e.dialogsAllAll ? e.unread_dialogs = qe(e) : e.dialogsAll = !1, Promise.resolve(e)
    }

    function Ke(e, t) {
        return t.delayed_message = e, Promise.resolve(t)
    }

    function We(e, t, n) {
        n.attachments_loading || (n.attachments_loading = {});
        var r = !t.loaded || !t.total || t.loaded < t.total;
        if (r) {
            var a = e + "_" + t.fileName;
            clearTimeout(n["clear_attachments_loading_" + a]), n.attachments_loading[a] = !0, n["clear_attachments_loading_" + a] = setTimeout(function() {
                delete n.attachments_loading[a]
            }, 1e3)
        } else delete n.attachments_loading[e + "_" + t.fileName];
        return Promise.resolve(n)
    }

    function ze(e) {
        var t = e.textMediaSelector;
        return t.urlAttachmentLoading || e.attachments_loading && Object.keys(e.attachments_loading)
            .length > 0
    }

    function Ve(e, t) {
        return t.unread_cnt = e, Promise.resolve(t)
    }

    function Ye(e, t) {
        return t.ctrl_submit = !!e, (0, nt.post)(lt, {
                act: "a_save_ctrl_submit",
                to: t.peer,
                hash: t.tabs[t.peer].hash,
                value: e ? 1 : 0
            })
            .then(function(e) {
                return t
            })
    }

    function Xe(e) {
        return "bind_to_url_store_" + e
    }

    function Ze(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach || (n.bind_url_to_attach = ls.get(Xe(e)) || {}), Promise.resolve(n.bind_url_to_attach)
    }

    function $e(e, t, n, r, a) {
        return Ze(e, a)
            .then(function(i) {
                return i[r] = [t, n], ls.set(Xe(e), i), Promise.resolve(a)
            })
    }

    function Je(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach = {}, ls.set(Xe(e), {}), Promise.resolve(t)
    }

    function et(e, t, n) {
        n.cur_unread_cnt || (n.cur_unread_cnt = {}), t && !inArray(e, n.mutedPeers) && (n.cur_unread_cnt[e] = !0);
        var r = document.title,
            a = window.devicePixelRatio >= 2 ? "_2x" : "";
        return t && !n.update_title_to ? n.update_title_to = setInterval(function() {
            n.update_old_title = r;
            var e = Object.keys(n.cur_unread_cnt)
                .length;
            if (0 === e) return document.title = r ? r : document.title, setFavIcon("/images/icons/favicons/fav_im" + a + ".ico"), clearInterval(n.update_title_to),
                void(n.update_title_to = !1);
            if (r) document.title = r, setFavIcon("/images/icons/favicons/fav_im" + a + ".ico"), r = !1;
            else {
                r = document.title;
                var t = e > 9 ? 10 : e;
                setFavIcon("/images/icons/favicons/fav_im" + t + a + ".ico"), document.title = winToUtf(getLang("mail_im_new_messages", e))
            }
        }, 1e3) : !t && n.update_old_title && (document.title = n.update_old_title, n.cur_unread_cnt = {}, r = !1, n.update_old_title = !1, setFavIcon(
            "/images/icons/favicons/fav_im" + a + ".ico"), clearInterval(n.update_title_to), n.update_title_to = !1), Promise.resolve(n)
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.favMessage = t.toggleMutePeer = t.returnToChat = t.leaveChat = t.updateChatPhoto = t.addNewMember = t.updateChatTopic = t.flushHistory = t.sendTyping = t.searchLocalHints =
        t.searchFriends = t.deliverMessage = t.readLastMessages = t.ACTION_PRIORITIES = t.TYPING_PERIOD = void 0;
    var tt = function() {
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
    t.strHistory = u, t.loadPeer = c, t.restoreHistoryQueue = f, t.removeFailed = g, t.selectPeer = h, t.selectPeerOnMessage = v, t.changePeer = y, t.setActions = b, t.loadMoreHistory =
        C, t.loadLessHistory = T, t.countUnread = w, t.loadLongPollKey = P, t.loadLongPollTs = k, t.removeUnreadBar = I, t.setMessageErrored = A, t.resendMessage = L, t.addMessage =
        M, t.markInboundMessagesAsRead = D, t.markOutboundMessagesAsRead = O, t.initTextStore = F, t.addMediaStore = B, t.cleanMediaStore = N, t.restoreAttaches = j,
        t.getAttaches = R, t.mergeTabs = U, t.updateOnline = H, t.setTyping = G, t.waitTyping = q, t.saveTextDraft = Q, t.getTextDraft = K, t.addSelection = W, t.cleanSelected =
        z, t.dropSelection = V, t.replaceMessage = Y, t.saveMedia = X, t.loadMedia = Z, t.replaceMediaAttachesStore = $, t.setCurrentSearchDate = J, t.setCurrentSearch =
        ee, t.searchHints = te, t.searchHintsIndex = ne, t.fetchFriends = ae, t.fetchLocalHints = ie, t.loadDialogs = oe, t.searchMessages = le, t.isSearchAllLoaded = ue,
        t.isSearchingInplace = ce, t.cancelSearch = de, t.clearDate = fe, t.searchInplaceStart = ge, t.searchMessagesInplace = me, t.loadImportant = pe, t.removeMessages =
        _e, t.removeMessageSend = he, t.removeMessagesWithRestore = ve, t.restoreMessage = ye, t.restoreMessageSend = be, t.changeMessage = Ce, t.forwardMessages = Te, t.getForwardedMessages =
        Ee, t.prepareForward = we, t.setChatTitle = Se, t.checkNewPeople = ke, t.updateActions = Ie, t.setMutedPeer = Ae, t.removeMember = Le, t.setExecStack = Me, t.updateFavMessage =
        xe, t.updateImportant = De, t.loadSpam = Oe, t.flushSpam = Fe, t.setCreationType = Be, t.getOwnerPhoto = Ne, t.presetAvatar = je, t.setChatPhoto = Re, t.createChat =
        Ue, t.resync = He, t.chatKickUser = Ge, t.toggleUnreadOnly = Qe, t.setDelayedMessage = Ke, t.observeLoadProgress = We, t.isAnythingLoading = ze, t.updateUnreadCount =
        Ve, t.changeSubmitSettings = Ye, t.getBindAttachToUrl = Ze, t.bindAttachToUrl = $e, t.clearAttachToUrl = Je, t.updateFavAndTitle = et;
    var nt = n(4),
        rt = n(74),
        at = n(75),
        it = n(78),
        ot = n(80),
        st = n(81),
        lt = "al_im.php",
        ut = t.TYPING_PERIOD = 5,
        ct = t.ACTION_PRIORITIES = {
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
        })), r = intval(r.shift()), r <= n.in_up_to ? Promise.resolve(t) : (t.longpoll.push([at.eventTypes.readInboundEvent([6, e, r])]), (0, nt.post)(lt, {
                peer: e,
                ids: [r],
                hash: n.hash,
                act: "a_mark_read"
            })
            .then(function() {
                return E(t, e, r, at.eventTypes.FLAG_OUTBOUND)
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
        return s && (r = s[2].url), (0, nt.post)(lt, {
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
                var t = tt(e, 1),
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
        return t.tabs[e].lastTyping = Date.now(), (0, nt.post)(lt, {
                act: "a_typing",
                peer: e,
                hash: t.tabs[e].hash
            })
            .then(function(e) {
                return t
            })
    }), t.flushHistory = s(function(e, t) {
        return (0, st.isTabLoaded)(t, e) ? (t.blockedFlagUpdates || (t.blockedFlagUpdates = {}), t.blockedFlagUpdates[e] = !0, t.all_dialogs = t.all_dialogs.filter(
                function(t) {
                    return t !== e
                }), t.unread_dialogs = t.unread_dialogs.filter(function(t) {
                return t !== e
            }), t.tabs[e].unread > 0 && x(t, -1, e), 0 === t.unread_cnt && t.unread_only && Qe(t), (0, nt.post)("al_im.php", {
                act: "a_flush_history",
                id: e,
                from: "im",
                hash: t.tabs[e].hash
            })
            .then(function(n) {
                var r = tt(n, 2);
                r[0], r[1];
                return delete t.blockedFlagUpdates[e], delete t.tabs[e], t.peer === e ? y(0, !1, t) : t
            })) : void 0
    }), t.updateChatTopic = s(function(e, t, n) {
        var r = n.tabs[e];
        return (0, nt.post)(lt, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_title: t,
                hash: r.hash
            })
            .then(function(t) {
                var a = tt(t, 2),
                    i = (a[0], a[1]);
                return n.tabs[e] = extend(r, i), n
            })
    }), t.addNewMember = s(function(e, t, n) {
        var r = n.tabs[e];
        return (0, nt.post)(lt, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_peer: t.join(","),
                hash: r.hash
            })
            .then(function(t) {
                var a = tt(t, 2),
                    i = (a[0], a[1]);
                return n.tabs[e] = extend(r, i), n
            })
    }), t.updateChatPhoto = s(function(e, t) {
        return e.kludges.source_act === st.CHAT_PHOTO_REMOVE ? (delete t.tabs[e.peerId].photo, Promise.resolve(t)) : (0, nt.post)(lt, {
                act: "a_get_chat_photo",
                msg_id: e.messageId
            })
            .then(function(n) {
                var r = tt(n, 2),
                    a = r[0],
                    i = r[1];
                t.chat_photo_msg = i;
                var o = t.tabs[e.peerId];
                if (t.tabs[e.peerId].photo = a, (0, st.isFullyLoadedTab)(t, e.peerId)) {
                    var s = e.kludges.source_act;
                    o.history = (0, st.addChatPhotoToUpdate)(e, s, t, l(o.history))
                }
                return t
            })
    }), t.leaveChat = s(function(e, t) {
        return (0, nt.post)(lt, {
                act: "a_leave_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Ie.bind(null, st.CHAT_KICK_USER, vk.id, e, t))
    }), t.returnToChat = s(function(e, t) {
        return (0, nt.post)(lt, {
                act: "a_return_to_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Ie.bind(null, st.CHAT_INVITE_USER, vk.id, e, t))
    }), t.toggleMutePeer = s(function(e, t, n) {
        return (0, nt.post)(lt, {
                act: "a_mute",
                peer: e,
                hash: n.tabs[e].hash,
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
        return xe(e, n, t, r), (0, nt.post)(lt, {
                act: "a_mark_important",
                ids: e,
                val: t ? 1 : 0,
                from: "im",
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
                    .then(f.bind(null, e, t, n));
            case 2:
                return (0, E.lplog)("Key is incorrect", "error"), e.set(u.bind(null, i)), n([b.resyncEvent()]), e.set(p.loadLongPollKey)
                    .then(o)
                    .then(f.bind(null, e, t, n));
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

    function f(e, t, n) {
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

    function g(e, t, n) {
        e.get()
            .stopped || ((0, E.lplog)("New request"), f(e, n, t)
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
                .then(g.bind(null, e, t, n)))
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
            f = d.pause,
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
        return g(y, p.bind(null, s), _.bind(null, s)), {
            on: u.on.bind(u),
            off: u.off.bind(u),
            abortPauses: function() {
                return y.set(c)
            },
            stop: l.bind(null, y),
            pause: f.bind(null, s),
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
        var t = T(e, 2),
            n = t[1];
        return {
            type: E,
            localId: n
        }
    }

    function r(e) {
        var t = T(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: S,
            messageId: n,
            mask: r,
            peerId: a
        }
    }

    function a(e) {
        var t = T(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: w,
            messageId: n,
            flags: r,
            peerId: a
        }
    }

    function i(e) {
        var t = T(e, 4),
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
        for (var t = T(e, 9), n = t[1], r = t[2], a = t[3], i = t[4], o = t[5], s = t[6], l = t[7], u = t[8], c = [], d = 1; l["attach" + d + "_type"];) c.push({
            type: l["attach" + d + "_type"],
            id: l["attach" + d],
            productId: l["attach" + d + "_product_id"],
            build: l["attach" + d + "_build"]
        }), d++;
        if (l.fwd) {
            var f = l.fwd.split(",")
                .map(function(e) {
                    return {
                        text: l["fwd" + e],
                        id: e
                    }
                });
            c.push({
                type: "fwd",
                messages: f
            })
        }
        return l.geo && c.push({
            type: "geo",
            id: l.geo,
            productId: null,
            build: null
        }), {
            type: k,
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
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: I,
            peerId: n,
            upToId: r
        }
    }

    function l(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: A,
            peerId: n,
            upToId: r
        }
    }

    function u(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: L,
            userId: -n,
            platform: r
        }
    }

    function c(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: M,
            userId: -n,
            reason: r
        }
    }

    function d(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: j,
            peerId: n,
            mask: r
        }
    }

    function f(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: R,
            peerId: n,
            flags: r
        }
    }

    function g(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: U,
            peerId: n,
            mask: r
        }
    }

    function m(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: x,
            chatId: n,
            self: r
        }
    }

    function p(e) {
        var t = T(e, 2),
            n = t[1];
        return {
            type: D,
            userId: n,
            peerId: n
        }
    }

    function _(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: D,
            userId: n,
            peerId: r + 2e9
        }
    }

    function h(e) {
        var t = T(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: O,
            userId: n,
            callId: r
        }
    }

    function v(e) {
        var t = T(e, 2),
            n = t[1];
        return {
            type: F,
            count: n
        }
    }

    function y(e) {
        var t = T(e, 2),
            n = t[1],
            r = void 0 === n ? {} : n;
        return {
            type: B,
            peerId: r.peer_id,
            sound: r.sound,
            disabledUntil: r.disabled_until
        }
    }

    function b(e) {
        return {
            type: N,
            params: e
        }
    }

    function C() {
        return {
            type: H
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var T = function() {
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
        u, t.gotOfflineEvent = c, t.resetDirectoriesEvent = d, t.replaceDirectoriesEvent = f, t.setDirectoriesEvent = g, t.chatChangedEvent = m, t.typingUserEvent = p, t.typingChatEvent =
        _, t.videoCallEvent = h, t.unreadCountEvent = v, t.notifySettingsChangedEvent = y, t.emptyEvent = b, t.resyncEvent = C;
    var E = t.DELETE = "event_delete",
        w = t.SET_FLAGS = "event_set_flags",
        S = t.REPLACE_FLAGS = "event_replace_flags",
        P = t.RESET_FLAGS = "event_reset_flags",
        k = t.ADD_MESSAGE = "event_add_message",
        I = t.READ_INBOUND = "event_read_inbound",
        A = t.READ_OUTBOUND = "event_read_outbound",
        L = t.GOT_ONLINE = "event_got_online",
        M = t.GOT_OFFLINE = "event_got_offline",
        x = t.CHAT_CHANGED = "event_chat_changed",
        D = t.TYPING = "event_typing",
        O = t.VIDEO_CALL = "event_video_call",
        F = t.UNREAD_COUNT = "event_unread_count",
        B = t.NOTIFY_SETTINGS_CHANGED = "event_notify_settings_changed",
        N = t.EMPTY = "event_empty",
        j = t.RESET_DIRECTORIES = "event_reset_directories",
        R = t.REPLACE_DIRECTORIES = "event_replace_directories",
        U = t.SET_DIRECTORIES = "event_set_directories",
        H = t.RESYNC = "event_resync";
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
        var n, r;
        try {
            throw new Error("test")
        } catch (a) {
            var r = a.stack
        }
        var i = setInterval(function() {
                try {
                    console.debug("im on pause"), console.debug(r)
                } catch (e) {}
            }, 2e3),
            o = new Promise(function(r) {
                n = r, setTimeout(r.bind(null, t), 1e3 * e)
            })
            .then(function() {
                return clearInterval(i)
            }, function() {
                return clearInterval(i)
            });
        return {
            pause: function() {
                return o
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

    function f(e, t, n) {
        var r = d(e, n);
        return r.pause = t, Promise.resolve(n)
    }

    function g(e, t, n) {
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
                return r.set(g.bind(null, n, a))
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
                r.set(f.bind(null, e, !0))
            },
            isPaused: function(e) {
                return !!d(e, r.get())
                    .pause
            },
            resume: function(n) {
                r.set(f.bind(null, n, !1))
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
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.throttleAccumulate = n, t.execuctionStackFilter = r, t.executionStackPush = a, t.executionStackPop = i, t.lplog = o, t.toArray = s
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        var n;
        "undefined" == typeof ie && (n = geByClass1(e, t), ie = n.firstElementChild.offsetHeight !== n.parentNode.offsetHeight), ie && (n || (n = geByClass1(e, t)),
            setStyle(n.firstElementChild, {
                height: n.parentNode.offsetHeight
            }))
    }

    function a(e, t) {
        var n = window.devicePixelRatio >= 2 ? "256" : "128";
        return t ? '<div class="im_sticker_row">\n      <a onmouseover="return Emoji.stickerOver(' + intval(e) + ', this);"\n        onclick="return Emoji.clickSticker(' +
            intval(t) + ', this, event);">\n          <img height="128"\n            class="im_gift"\n            src="/images/stickers/' + intval(e) + "/" + n +
            '.png"/>\n      </a>\n    </div>' : '<div class="im_sticker_row">\n      <img height="128"\n        class="im_gift"\n        src="/images/stickers/' + intval(e) +
            "/" + n + '.png"/>\n    </div>'
    }

    function i(e, t, n) {
        if (C(e.get(), t)) {
            var r = e.get()
                .tabs[t].deleted || [];
            return inArray(n, r)
        }
        return !1
    }

    function o(e, t, n) {
        var r = n.randomId,
            a = geByClass1("_im_mess_rid" + r, t);
        if (a) {
            var i = a.parentNode;
            if (a.parentNode.removeChild(a), 0 === domChildren(i)
                .length) {
                var o = gpeByClass("_im_mess_stack", i);
                o.parentNode.removeChild(o)
            }
            t = u(e, n, t, !0, !1)
        }
        return t
    }

    function s(e) {
        return getTemplate("im_preloader", {
            preloader: rs(vk.pr_tpl, {
                id: ""
            }),
            cls: "im-preloader_attach im-preloader_visible im-preloader_" + e
        })
    }

    function l(e) {
        var t = e.split(".");
        return (t[0] < 10 ? "0" : "") + t[0] + (t[1] < 10 ? "0" : "") + t[1] + t[2]
    }

    function u(e, t, n) {
        var r = (arguments.length <= 3 || void 0 === arguments[3] ? !0 : arguments[3], arguments.length <= 4 || void 0 === arguments[4] ? !0 : arguments[4]),
            i = e.tabs[t.peerId];
        if (i.skipped > 0) return n;
        var o = "",
            l = "",
            u = ["_im_mess"],
            d = [];
        t.local || (d = e.imQueue(t.peerId, r)), d.length > 0 && F(d.map(function(e) {
                return geByClass1("_im_mess_rid" + e.rid, n)
            }, n)
            .filter(function(e) {
                return e
            })), t.flags & oe.eventTypes.FLAG_OUTBOUND && t.flags & oe.eventTypes.FLAG_UNREAD && u.push("im-mess_unread _im_mess_unread"), t.local && u.push(
            "im-mess_sending " + me), t.failed && u.push("im-mess_failed " + pe);
        var f = t.attaches[0] && "gift" === t.attaches[0].type;
        f && u.push("im-mess_gift");
        var g = t.attaches.map(function(e) {
                return "sticker" === e.type ? a(e.id, e.productId) : s(e.type)
            }),
            m = w(t.text, t.kludges),
            p = getTemplate("im_message_media", {
                messageId: t.messageId,
                attaches: g.join(""),
                text: '<div class="im_msg_text">' + (f ? m : "") + "</div>"
            });
        f || (p = m + p);
        var h = getTemplate("im_msg_row", {
                msg_id: t.messageId,
                from_id: t.peerId,
                text: p,
                ts: t.date,
                cls: u.join(" ")
            }),
            v = domLC(n);
        (hasClass(v, ye) || hasClass(v, ve)) && (v = domPS(v));
        var y = domLC(geByClass1("_im_stack_messages", v)),
            b = intval(domData(v, "peer")),
            C = 1e3 * intval(domData(y, "ts")),
            S = t.flags & oe.eventTypes.FLAG_OUTBOUND ? e.id : t.userId,
            P = t.flags & oe.eventTypes.FLAG_OUTBOUND;
        if (T(P, i.unread, b, C, S, t) || f) {
            var k = "";
            if (e.peer === t.peerId && !i.inplaceSearch || i.unread || t.flags & oe.eventTypes.FLAG_OUTBOUND || (k += getTemplate("im_mess_bar", {})), H(t)) k +=
                getTemplate("im_service_row", {
                    text: q(t, i),
                    type: "",
                    date: t.date,
                    from_id: "",
                    message_id: t.messageId
                });
            else {
                o = _(t.peerId) ? i.data.members[S].name : P ? e.name : i.name, l = _(t.peerId) ? i.data.members[S].photo : P ? e.photo : i.photo;
                var I = _(t.peerId) ? i.data.members[S].link : i.href;
                k += getTemplate("im_mess_stack", {
                    photo: l,
                    href: I,
                    cls: "",
                    date_attr: "",
                    link: "/im?sel=" + t.peerId + "&msgid=" + t.messageId,
                    name: getTemplate("im_mess_stack_name", {
                        name: o,
                        link: I
                    }),
                    peerId: S,
                    date: E(t.date, e),
                    messages: h
                })
            }(0, ue.toArray)(sech(k))
            .forEach(function(e) {
                return n.appendChild(e)
            })
        } else {
            var A = geByClass1("_im_unread_bar_row", n);
            A && e.peer === t.peerId && !i.inplaceSearch && A.parentNode.removeChild(A), geByClass1("_im_stack_messages", v)
                .appendChild(se(h))
        }
        return c(d, e, n)
    }

    function c(e, t, n) {
        var r;
        return r = "object" === ("undefined" == typeof e ? "undefined" : ae(e)) ? e : t.imQueue(e, !1), r.length > 0 && r.map(function(e) {
                return e.mess.failed = !!e.failed, e.mess
            })
            .forEach(function(e) {
                return u(t, e, n, !1)
            }), n
    }

    function d(e, t, n) {
        var r = e.tabs[t];
        return (0, ue.toArray)(geByClass("_im_mess_unread", n))
            .forEach(function(e) {
                var t = intval(domData(e, "msgid"));
                t > 0 && r.out_up_to >= t && (removeClass(e, "_im_mess_unread"), removeClass(e, "im-mess_unread"))
            }), n
    }

    function f(e, t, n) {
        var r = geByClass1("_im_msg_media" + t.messageId, e);
        return r && (r.innerHTML = n.tabs[t.peerId].mediacontent[t.messageId][0]), e
    }

    function g(e, t) {
        if (!b(t, e.peerId)) return 0;
        var n = t.tabs[e.peerId];
        return n.msgs[e.messageId] ? 1 : n.msgs["rid" + e.randomId] ? 2 : 0
    }

    function m(e) {
        return e >= -5 && 0 >= e ? !0 : !1
    }

    function p(e) {
        return e > 0 && 2e9 > e
    }

    function _(e) {
        return e > 2e9
    }

    function h(e) {
        return e > -2e9 && 0 > e
    }

    function v(e) {
        return -2e9 > e
    }

    function y(e, t) {
        return e === t.peer
    }

    function b(e, t) {
        return e.tabs[t] && e.tabs[t].msgs && e.tabs[t].history ? !0 : !1
    }

    function C(e, t) {
        return e.tabs[t] ? !0 : !1
    }

    function T(e, t, n, r, a, i) {
        return n !== a ? !0 : Date.now() - r > 3e5 ? !0 : t || e || a === vk.id ? H(i) ? !0 : !1 : !0
    }

    function E(e, t) {
        var n = new Date(1e3 * e),
            r = t.timeshift;
        return isToday(n) ? langDate(1e3 * e, "{hour}:{minute} {am_pm}", r, [], !0) : langDate(1e3 * e, "{day}.{month}.{short_year}", r, [0, "01", "02", "03", "04", "05",
            "06", "07", "08", "09", "10", "11", "12"
        ], !0)
    }

    function w(e, t, n) {
        return e = (e || "")
            .replace(MESSAGE_REGEXP, function() {
                var e = Array.prototype.slice.apply(arguments),
                    t = e[1] || "",
                    r = e[2] || "http://",
                    a = e[3] || "",
                    i = a + (e[4] || ""),
                    o = (e[2] || "") + e[3] + e[4];
                if (-1 == a.indexOf(".") || -1 != a.indexOf("..")) return e[0];
                var s = a.split(".")
                    .pop();
                if ((s.length > 7 || -1 == indexOf(TOP_DOMAINS.split(","), s)) && (!/^[a-zA-Z]+$/.test(s) || !e[2])) return e[0];
                if (-1 != e[0].indexOf("@")) return e[0];
                try {
                    o = decodeURIComponent(o)
                } catch (l) {}
                if (o.length > 55 && (o = o.substr(0, 53) + ".."), o = clean(o)
                    .replace(/&amp;/g, "&"), !n && a.match(ce)) {
                    i = replaceEntities(i)
                        .replace(de, encodeURIComponent);
                    var u, c = i,
                        d = i.indexOf("#/"),
                        f = "";
                    return d >= 0 ? c = i.substr(d + 1) : (d = i.indexOf("#!"), d >= 0 && (c = "/" + i.substr(d + 2)
                            .replace(/^\//, ""))), u = c.match(fe), u && u[1].length < 32 && (f = ' mention_id="' + u[1] +
                            '" onclick="return mentionClick(this, event)" onmouseover="mentionOver(this)"'), t + '<a href="' + (r + i)
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;") + '" target="_blank"' + f + ">" + o + "</a>"
                }
                return t + '<a href="away.php?utf=1&to=' + encodeURIComponent(r + replaceEntities(i)) + '" target="_blank" onclick="return goAway(\'' + clean(r + i) +
                    "', {}, event);\">" + o + "</a>"
            }), e = e.replace(ge, function(e) {
                return '<a href="/write?email=' + e + '" target="_blank">' + e + "</a>"
            }), t.emoji && (e = Emoji.emojiToHTML(e, !0)), e
    }

    function S(e) {
        return _(e) ? "c" + (e - 2e9) : v(e) ? "e" + Math.abs(e + 2e9) : e
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

    function k(e, t) {
        var n = '<img src="' + e + '" alt="" class="dialogs_inline_chatter dialogs_inline_chatter_half"/>';
        return t && (n = '<a href="' + t + '" target="_blank">' + n + "</a>"),
            '<div class="im_grid">\n    <div class="dialogs_inline_chatter dialogs_inline_chatter_half">\n      ' + n + "\n    </div>\n  </div>"
    }

    function I(e, t) {
        var n = '<img src="' + e + '" alt="" class="dialogs_inline_chatter"/>';
        return t && (n = '<a href="' + t + '" target="_blank">' + n + "</a>"), '<div class="im_grid">\n    <div class="dialogs_inline_chatter">\n      ' + n +
            "\n    </div>\n  </div>"
    }

    function A(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1];
        if ("string" == typeof e) return '<div class="im_grid"><img src="' + e + '" alt=""/></div>';
        switch (e.length) {
            case 1:
                return '<div class="im_grid""><img src="' + e[0] + '" alt=""/></div>';
            case 2:
                return e.map(function(e, n) {
                        return k(e, t[n])
                    })
                    .join("");
            case 3:
                return k(e[0], t[0]) + e.slice(1)
                    .map(function(e, n) {
                        return I(e, t[n])
                    })
                    .join("");
            case 4:
                return e.map(function(e, n) {
                        return I(e, t[n])
                    })
                    .join("")
        }
    }

    function L(e, t) {
        if (e.photo) return '<a href="javascript:void(0)" class="' + ke + '">\n      <div class="im_grid">\n        <img src="' + e.photo +
            '" alt="" />\n      </div>\n    </a>';
        var n = [];
        n = e.data.active ? (0, ue.toArray)(e.data.active)
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
        return i = t ? [] : i, A(a, i)
    }

    function M() {
        return '<li class="im-page--messages-search">' + getLang("mail_search_messages") + "</li>"
    }

    function x(e, t, n) {
        var r = geByClass1("_im_mess_" + t.messageId, n);
        return r && addClass(r, "im-mess_failed " + pe), n
    }

    function D(e, t, n) {
        var r = geByClass1("_im_mess_" + t, n);
        return r && (removeClass(r, "im-mess_failed"), removeClass(r, pe)), n
    }

    function O(e, t) {
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

    function B(e, t, n, r) {
        return e.map(function(e) {
                return geByClass1("_im_mess_" + e, r)
            })
            .filter(function(e) {
                return e
            })
            .forEach(function(e) {
                val(e, R(t, e, n)), addClass(e, "im-mess_light")
            }), r
    }

    function N(e, t, n) {
        var r = geByClass1("_im_mess_" + e, n);
        if (r) {
            var a = geByClass1(_e, r);
            val(r, a.innerHTML), removeClass(r, "im-mess_light")
        }
        return n
    }

    function j(e, t, n, r) {
        var a = arguments.length <= 4 || void 0 === arguments[4] ? 2 : arguments[4],
            i = r.tabs[t];
        if (!e) return "";
        var o = Object.keys(e)
            .sort(function(t, n) {
                return e[n] - e[t]
            });
        if (0 === o.length) return "";
        if (p(t)) {
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

    function R(e, t, n) {
        var r = t.innerHTML,
            a = "delete" === n ? "mail_deleted_stop" : "mail_marked_as_spam";
        return '<div class="im-mess--text">\n    ' + getLang(a) + ' <button type="button" data-peer="' + e + '" class="' + he + ' im-mess--btn">' + getLang("mail_restore") +
            '</button>\n    <div class="' + _e + ' im-mess--original">' + r + "</div>\n  </div>"
    }

    function U() {
        return '<div class="im-page--chat-search-empty">\n    ' + getLang("mail_im_search_empty") + "\n  </div>"
    }

    function H(e) {
        return e.kludges && "undefined" != typeof e.kludges.source_act
    }

    function G(e, t, n) {
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
            case be:
                l = "mail_im_chat_created";
                break;
            case Ce:
                l = "mail_im_title_updated";
                break;
            case Te:
                l = u ? "mail_im_returned_to_chat" : "mail_im_invited";
                break;
            case Ee:
                l = u ? "mail_im_left" : "mail_im_kicked_from_chat";
                break;
            case we:
                l = "mail_im_photo_set";
                break;
            case Se:
                l = "mail_im_photo_removed";
                break;
            default:
                return ""
        }
        if (l = langSex(s.sex, getLang(l, "raw")), l = l.replace("{from}", G(s.link, s.name, n)), i && i !== o) {
            var c = r.source_email;
            if (c) l = l.replace("{user}", G("/im?email=${encodeURIComponent(email)", "email", n));
            else {
                var d = t.data.members[i],
                    f = a === Ee ? d.name_kick_case : d.name_inv_case;
                l = l.replace("{user}", G(d.link, f, n))
            }
        }
        return r.source_text && (l = l.replace("{title}", '&laquo;<b class="im_srv_lnk">' + r.source_text + "</b>&raquo;")), l
    }

    function Q(e, t, n, r) {
        if (t === we) {
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

    function z(e, t) {
        return e.tt = !1, showTooltip(e, {
            url: h(t) ? "al_groups.php" : "al_profile.php",
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

    function V(e) {
        return (0, ue.toArray)(geByClass("page_media_link_img", e))
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

    function X(e, t) {
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

    function Z(e, t) {
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

    function $(e, t) {
        return '<div class="im-mess--text">\n      <span>' + getLang("mail_restored") + '</span>\n      <a class="_im_go_to" href="/im?sel=' + S(e) + "&msgid=" + t + '">' +
            getLang("mail_im_goto_conversation") + "</a>\n    </div>"
    }

    function J(e, t) {
        return showFastBox({
            title: getLang("mail_deleteall1"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, e > 2e9 ? getLang("mail_chat_sure_to_delete_all") : getLang("mail_sure_to_delete_all"), getLang("mail_delete"), t, getLang("global_cancel"))
    }

    function ee(e, t, n, r, a) {
        t.showProgress(), e.set(r.bind(null, a))
            .then(function() {
                t.hideProgress(), t.hide(), n()
                    .removePeer(e, a), n()
                    .updateDialogFilters(e)
            })
    }

    function te(e, t, n, r, a) {
        var i = e.get()
            .peer,
            o = 0;
        showBox("al_im.php", {
            act: "a_show_members_box",
            chat: i - 2e9
        }, {
            stat: ["boxes.css"],
            params: {
                dark: 1
            },
            onDone: function(r, a) {
                1 === o && (r.setControlsText('<button type="button" class="im-page-btn _im_invite_box">' + getLang("mail_im_create_chat_with") + "</button>"),
                    (0, le.addDelegateEvent)(r.bodyNode.parentNode, "click", "_im_invite_box", function() {
                        r.hide(), re(e, e.get()
                            .peer, t, n)
                    })), o++
            }
        }, a)
    }

    function ne(e, t, n, r, a) {
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

    function re(e, t, n, r) {
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
    var ae = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
    };
    t.fixTableCellChildHeight = r, t.renderSticker = a, t.isAlreadyDeleted = i, t.replaceMessageAttrs = o, t.renderAttach = s, t.dayFromVal = l, t.appendToHistory = u, t.restoreQueue =
        c, t.markMessagesAsRead = d, t.replaceAttaches = f, t.isDuplicate = g, t.isReservedPeer = m, t.isUserPeer = p, t.isChatPeer = _, t.isComunityPeer = h, t.isPeerActive =
        y, t.isFullyLoadedTab = b, t.isTabLoaded = C, t.parseMessage = w, t.convertPeerToUrl = S, t.chatActions = P, t.renderPhotos = A, t.renderPhotosFromTab = L, t.renderMessagesSearch =
        M, t.setMessageError = x, t.startResendMessage = D, t.removeMessages = O, t.removeMessagesWithRestore = B, t.restoreMessage = N, t.formatTyper = j, t.renderEmptySearch =
        U, t.isServiceMsg = H, t.renderServiceMsg = q, t.addChatPhotoToUpdate = Q, t.replaceSpecialSymbols = K, t.isSelfMessage = W, t.showVerifiedTooltip = z, t.fixSnippetsHeight =
        V, t.wrapLoading = Y, t.tabFromIds = X, t.checkSelectClick = Z, t.renderGoTo = $, t.showFlushDialog = J, t.cleanHistory = ee, t.showChatMembers = te, t.selectAnotherPeer =
        ne, t.inviteUser = re;
    var ie, oe = n(75),
        le = n(5),
        ue = n(80),
        ce = /^([a-zA-Z0-9\.\_\-]+\.)?(vkontakte\.ru|vk\.com|vkadre\.ru|vshtate\.ru|userapi\.com|vk\.me)$/,
        de = /([^a-zA-Z0-9#%;_\-.\/?&=\[\]])/g,
        fe = /^(?:https?:\/\/)?(?:vk\.com|vkontakte\.ru)?\/([a-zA-Z0-9\._]+)\??$/,
        ge = /([a-zA-Z\-_\.0-9]+@[a-zA-Z\-_0-9]+\.[a-zA-Z\-_\.0-9]+[a-zA-Z\-_0-9]+)/g,
        me = t.SENDING_CLASS = "_im_mess_sending",
        pe = t.FAILED_CLASS = "_im_mess_faild",
        _e = t.ORIGINAL_CLASS = "_im_mess_original",
        he = t.RESTORE_CLASS = "_im_mess_restore",
        ve = t.LAST_ACT_CLASS = "_im_last_act",
        ye = t.TYPING_CLASS = "_im_typing",
        be = t.CREATE_CHAT_ACTION = "chat_create",
        Ce = t.CHAT_TITLE_ACTION = "chat_title_update",
        Te = t.CHAT_INVITE_USER = "chat_invite_user",
        Ee = t.CHAT_KICK_USER = "chat_kick_user",
        we = t.CHAT_PHOTO_UPDATE = "chat_photo_update",
        Se = t.CHAT_PHOTO_REMOVE = "chat_photo_remove",
        Pe = t.DESLECT_ALL_CLASS = "_im_deselect_all",
        ke = t.SHOW_CHAT_MEMBERS_CLASS = "_im_show_chat_mems";
    t.selectionRemove = '<span class="im-deselect ' + Pe + '"></span>'
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

    function f(e, t) {
        return t.pipeId = e, Promise.resolve(t)
    }

    function g(e, t) {
        return t._sortedEls || !e ? t.elements : (t.elements = t.elements.sort(e), t._sortedEls = !0, t.elements)
    }

    function m(e, t, n, r) {
        if ("undefined" != typeof n && r.elements.length > 0) {
            r.scrolled = n;
            var a = g(e, r);
            if (r.height) {
                var i = Math.floor(n / r.height),
                    o = n - i * r.height;
                r.scrollItem = {
                    pad: o,
                    id: t(a[i])
                }
            }
        }
        return Promise.resolve(r)
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
                .sortFn, g(n()
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

    function P(e, t, n) {
        var r = b.bind(null, t, E.bind(null, t, e, n)),
            a = throttle(function(e) {
                return t.set(m.bind(null, n()
                    .sortFn, n()
                    .idFn, e))
            }, 200),
            l = new Scrollbar(e, {
                nokeys: !0,
                shadows: !0,
                nomargin: !0,
                hidden: !0,
                scrollChange: a,
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto",
                more: r.bind(null, !1)
            });
        return t.set(i.bind(null, n()
            .idFn, {})), (0, k.addDelegateEvent)(e, "click", t.get()
            .elCls, n()
            .onClick), {
            pipe: function(r, a) {
                return t.set(f.bind(null, a)), r.then(S.bind(null, t, e, l, n, a))
            },
            pipeReplace: function(r, a) {
                return t.set(f.bind(null, a)), t.set(d), r.then(function(r) {
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
            restoreScroll: function(r) {
                var a = t.get()
                    .scrolls[r];
                if (a) {
                    if (t.set(T.bind(null, r)), !t.get()
                        .height) return void l.scrollTop(a.scrolled);
                    var i = a.scrollItem,
                        o = g(n()
                            .sortFn, t.get()),
                        s = n()
                        .idFn,
                        c = o.reduce(function(e, t, n) {
                            return s(t) === i.id ? n : e
                        }, -1);
                    if (c >= 0) {
                        t.set(u.bind(null, c + 10)), y(e, l, n, t);
                        var d = c * t.get()
                            .height + i.pad;
                        l.scrollTop(d)
                    } else {
                        var d = a.scrolled;
                        Math.floor(d / t.get()
                            .height) + 10;
                        t.set(u.bind(null, c + 10)), y(e, l, n, t), l.scrollTop(d)
                    }
                    t.set(m.bind(null, n()
                        .sortFn, n()
                        .idFn, d))
                }
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
            isLoading: function() {
                return t.get()
                    .loading
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
                (0, k.removeDelegateEvent)(e, "click", t.get()
                    .elCls, n()
                    .onClick), l.destroy()
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = P;
    var k = n(5),
        I = n(81),
        A = n(80)
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
        removeClass(e, "im-page--history_empty"), f(e, t, n, r, a, i, o)
    }

    function i(e, t, n, r) {
        var a = geByClass1("_im_peer_photo", n);
        removeClass(a, "nim-peer--photo_hidden"), (0, M.isChatPeer)(t) ? (removeClass(geByClass1("_im_peer", n), "nim-peer_online", e.online), val(a, (0, M.renderPhotosFromTab)
            (e)), e.data.kicked && addClass(a, "nim-peer--photo_hidden")) : (toggleClass(geByClass1("_im_peer", n), "nim-peer_online", e.online), val(a, rs(r.get()
            .im_peer_img_tpl, {
                peer_photo: e.photo,
                peer_href: e.href
            })))
    }

    function o(e, t, n, r, a) {
        var i = q2ajx(a.getAttribute("href")),
            o = intval(i.msgid);
        o && e.set(L.changePeer.bind(null, e.get()
                .peer, o))
            .then(function() {
                _(n, t, o)
            }), cancelEvent(r)
    }

    function s(e) {
        var t = geByClass1(M.LAST_ACT_CLASS, e);
        t && hide(t)
    }

    function l(e, t) {
        if (!(0, L.isSearchingInplace)(e.get()
                .peer, e.get())) {
            t = c(t)
                .parentNode;
            var n = e.get()
                .peer;
            if ((0, M.isUserPeer)(n) && (0, M.isFullyLoadedTab)(e.get(), n)) {
                var a = e.get()
                    .tabs[n];
                if (!a.last_act || Object.keys(a.typing || {})
                    .length > 0) return;
                if (a.skipped > 0) return;
                var i = getDateText(a.last_act[0]),
                    o = geByClass1(M.LAST_ACT_CLASS, t),
                    s = langSex(a.sex, getLang("mail_last_activity_tip", "raw"))
                    .replace("{user}", a.name)
                    .replace("{time}", i);
                if (a.last_act_mobile) {
                    var l;
                    s += getTemplate("im_wrap_mobile", (l = {}, r(l, "class", "im_status_mob_onl"), r(l, "params", "mid: " + n +
                        ", was: 1, appendParentCls: '_im_last_act_wrap', forcetoup: true"), r(l, "attrs", ""), l))
                }
                if (!a.online && o && domData(o, "time") !== i) val(o, s), attr(o, "data-time", i), show(o);
                else if (!a.online && !o) {
                    var u = getTemplate("im_last_act", {
                        lastact: s
                    });
                    t.insertBefore(se(u), geByClass1("_im_typer_c", t))
                }
            }
        }
    }

    function u(e, t, n, r) {
        if (hasClass(n.target, "_im_mess_marker")) {
            var a = n.target;
            window.tooltips && (0, x.toArray)(geByClass(M.FAILED_CLASS, t))
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

    function f(e, t, n, r, a, o, u) {
        var c = (t.get()
            .tabs || {})[n];
        i(c, n, e, t), o.renderPeer(t);
        var d = geByClass1("_im_peer_history", e);
        if (!t.get()
            .tabHistoryNotChanged) {
            val(geByClass1("_im_page_peer_name", e), c.tab);
            var f = (0, L.strHistory)(c.history);
            toggleClass(e, "im-page--history_empty-hist", !f), f || (f = getLang("mail_im_here_history")), val(d, f), (0, M.fixTableCellChildHeight)("_chat_body_wrap", e),
                (0, M.fixSnippetsHeight)(d), k(t, r, e), !c.online && (0, M.isUserPeer)(n) ? l(t, e) : s(e)
        }(0, L.isSearchingInplace)(n, t.get()) ? a()
            .showSearch(t): a()
            .cancelSearch(t, !1), u.changePeer(n, t), t.get()
            .msgid ? _(r, e, t.get()
                .msgid) : p(r, e, a, t) || r.scrollBottom(G)
    }

    function g(e, t, n, r, a) {
        var i = (0, M.wrapLoading)(n);
        if (!Y && a.obj.scrollTop < H) {
            if ((0, L.isSearchingInplace)(e.get()
                    .peer, e.get())) {
                Y = !0;
                var o = t()
                    .getSearchResulstModule();
                if (o.isAll(e)) return;
                return void i(o.loadMore(e)
                    .then(function(n) {
                        Y = !1, n && t()
                            .loadHistory(e.get()
                                .peer, {}, e, n)
                    }), "up")
            }
            var l = e.get(),
                u = l.tabs[l.peer];
            u.allShown || (Y = !0, i(e.set(L.loadMoreHistory.bind(null, 0, 0))
                .then(t()
                    .loadHistory.bind(null, l.peer, {}))
                .then(function() {
                    Y = !1
                }), "up"))
        }
        if (!Y && 0 > r && a.scrollBottom() < H) {
            if ((0, L.isSearchingInplace)(e.get()
                    .peer, e.get())) return;
            var l = e.get(),
                u = l.tabs[l.peer];
            if (u.skipped > 0) {
                Y = !0, s(n);
                var c = e.set(L.loadLessHistory)
                    .then(t()
                        .loadHistory.bind(null, l.peer, {
                            reversed: !0
                        }))
                    .then(function() {
                        m(e), Y = !1, v(e, n.parentNode), u.skipped || e.set(L.changePeer.bind(null, e.get()
                            .peer, !1))
                    }),
                    d = n.parentNode;
                S(d, !0), c.then(S.bind(null, d, !1))
            }
        }
    }

    function m(e) {
        return e.set(L.readLastMessages.bind(null, e.get()
            .peer))
    }

    function p(e, t, n, r) {
        var a = geByClass1("_im_unread_bar_row", t);
        if (a) {
            var i = a.getBoundingClientRect(),
                o = geByClass1("_im_peer_history_w", t)
                .getBoundingClientRect()
                .top + 20;
            return e.scrollTop(e.obj.scrollTop - o + i.top), g(r, n, c(t), 0, e), m(r), !0
        }
        return !1
    }

    function _(e, t, n) {
        var r = geByClass1("_im_mess_" + n, t);
        if (r) {
            var a = r.offsetTop + domPN(r)
                .offsetTop + domPN(domPN(r))
                .offsetTop + domPN(domPN(domPN(r)))
                .offsetTop;
            e.scrollTop(a - e.scrollHeight / 2), addClass(r, "im-mess_light"), setTimeout(function() {
                removeClass(r, "im-mess_light")
            }, Q)
        }
    }

    function h(e, t, n, r, a) {
        var i = domData(a, "action"),
            o = domData(a, "msgid"),
            s = geByClass1("_im_mess_marker", geByClass1("_im_mess_" + o));
        switch (i) {
            case "resend":
                t(r, a);
                break;
            case "delete":
                e.set(L.removeFailed.bind(null, e.get()
                        .peer, o))
                    .then(function() {
                        (0, M.removeMessages)([o], c(n))
                    })
        }
        tooltips.hide(s, {
            fasthide: !0
        })
    }

    function v(e, t) {
        var n = e.get()
            .peer;
        if (!(0, M.isReservedPeer)(n)) {
            var r = e.get()
                .tabs[n];
            r.skipped > 0 && !(0, L.isSearchingInplace)(e.get()
                .peer, e.get()) ? show(geByClass1(W, t)) : hide(geByClass1(W, t))
        }
    }

    function y(e) {
        var t = geByClass1("_im_unread_bar_row", e);
        t && t.parentNode.removeChild(t)
    }

    function b(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1],
            n = e.scrollBottom();
        return (t ? q + t : q) > n
    }

    function C(e, t, n, r) {
        var a = domData(r, "msgid"),
            i = e.get()
            .peer;
        e.get()
            .imQueueResend(i, a), e.set(L.resendMessage.bind(null, i, a)), (0, M.startResendMessage)(i, a, t)
    }

    function T(e, t, n, r, a) {
        var i = intval(domData(a, "peer")),
            o = intval(domData(gpeByClass("_im_mess", a), "msgid")),
            s = e.get()
            .tabs[i].hash;
        return (0, L.restoreMessageSend)(o, i, s), e.set(L.restoreMessage.bind(null, o, i))
            .then(M.restoreMessage.bind(null, o, i, c(t)))
            .then(function() {
                return k(e, n, t)
            }), !1
    }

    function E(e, t) {
        e()
            .showCreation(t)
    }

    function w(e, t, n) {
        e.set(L.prepareForward.bind(null, []))
            .then(function() {
                t()
                    .changePeer(!1, e), removeClass(n, "im-page--history_fwd")
            })
    }

    function S(e, t) {
        var n = geByClass1(W, e);
        toggleClass(n, "im-to-end_loading", t)
    }

    function P(e, t, n) {
        S(n, !0), t.set(L.changePeer.bind(null, t.get()
                .peer, !1))
            .then(function(e) {
                return t.set(L.loadPeer.bind(null, t.get()
                    .peer, !0, -1))
            })
            .then(function(r) {
                S(n, !1), e()
                    .changePeer(t)
            })
    }

    function k(e, t, n) {
        (0, M.fixTableCellChildHeight)("_chat_body_wrap", n);
        var r = t.scrollHeight;
        t.update(!1, !0);
        var a = t.scrollHeight;
        return r - a
    }

    function I(e, t, n, r, o, l, u, g, m, p, h, C, T, E, w) {
        var S;
        return {
            changePeer: function(i) {
                if (0 === i.get()
                    .peer) return d(e);
                if ((0, M.isFullyLoadedTab)(i.get(), i.get()
                        .peer)) {
                    removeClass(e, "im-page--history_search"), i.set(L.dropSelection), n.changeActions(i);
                    var s = i.get()
                        .peer,
                        l = i.get()
                        .prevPeer;
                    return removeClass(e, "im-page--history_loading"), r.restoreDraft(i), o()
                        .updateTyping({
                            peerId: s
                        }, i), v(i, e), 0 !== l || (0, M.isReservedPeer)(s) ? (0, M.isReservedPeer)(l) || (0, M.isReservedPeer)(s) ? void 0 : f(e, i, s, t, o, n, h) :
                        a(e, i, s, t, o, n, h)
                }
            },
            loadingPeer: function(t) {
                (0, L.isAnythingLoading)(t.get()) || (removeClass(e, "im-page--history_empty"), addClass(e, "im-page--history_loading"))
            },
            deselectDialog: function(e) {
                l()
                    .removeSelection(e)
            },
            replaceMessageAttrs: function(t, n) {
                (0, M.replaceMessageAttrs)(n.get(), c(e), t)
            },
            cleanSelection: function(e) {
                T.cleanSelection(e)
            },
            updateDialogFilters: function(e) {
                l()
                    .updateDialogFilters(e)
            },
            getSearchResulstModule: function() {
                return S
            },
            insertSearch: function(n, r) {
                addClass(e, "im-page--history_search"), s(e), n ? c(e)
                    .innerHTML = n : c(e)
                    .innerHTML = (0, M.renderEmptySearch)(), k(r, t, e), t.scrollBottom(0), v(r, e)
            },
            updateChatTopic: function(e, t) {
                l()
                    .updateDialog(e, t), e === t.get()
                    .peer && n.renderPeer(t)
            },
            updateChatPhoto: function(n, r, a) {
                if ((0, M.isPeerActive)(n.peerId, a.get())) {
                    var o = a.get()
                        .tabs[n.peerId];
                    i(o, n.peerId, e, a);
                    var s = b(t);
                    (0, M.addChatPhotoToUpdate)(n, r, a.get(), c(e)), s && t.scrollBottom(G)
                }
            },
            markImportant: function(t, r, a) {
                var i = geByClass1("_im_mess_" + t, e);
                i && (n.changedMessageSelection(a), C.markImportant(t, r, a))
            },
            loadHistory: function(n, r, a) {
                var i = arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3],
                    o = a.get();
                if ((0, M.isPeerActive)(n, o)) {
                    var s = i || o.tabs[n].historyToAppend;
                    if (!s) return;
                    var l = geByClass1("_im_peer_history", e),
                        u = domFC(l),
                        c = t.scrollBottom(),
                        d = (geByClass1(M.TYPING_CLASS, l), r.reversed ? function(e) {
                            return l.appendChild(e)
                        } : function(e) {
                            return l.insertBefore(e, u)
                        }),
                        f = ce("div");
                    f.innerHTML = s, d(f), (0, M.fixSnippetsHeight)(f), r.reversed || t.scrollBottom(c), t.update(!1, !0)
                }
            },
            addMessage: function(n, r) {
                if (!(0, L.isSearchingInplace)(r.peerId, n.get()) && (0, M.isPeerActive)(r.peerId, n.get())) {
                    if (geByClass1("_im_mess_" + r.messageId, e)) return;
                    var a = b(t);
                    (0, M.appendToHistory)(n.get(), r, c(e)), y(e), (r.local || a) && t.scrollBottom(0), o()
                        .updateTyping(r, n), (0, x.toArray)(geByClass("_im_history_tooltip", e))
                        .forEach(hide)
                }
            },
            setMessageErrored: function(t, n, r) {
                (0, M.setMessageError)(t, n, e)
            },
            markMessagesAsRead: function(t, n) {
                t.get()
                    .peer === n.peerId && (0, M.markMessagesAsRead)(t.get(), n.peerId, e)
            },
            hideFwd: function(t) {
                removeClass(e, "im-page--history_fwd")
            },
            updateTyping: function(t, n) {
                if (!(0, L.isSearchingInplace)(t.peerId, n.get())) {
                    var r = n.get();
                    if (n.get()
                        .peer === t.peerId && (0, M.isFullyLoadedTab)(r, t.peerId)) {
                        var a = geByClass1(M.TYPING_CLASS, e);
                        if (!a) {
                            a = se(getTemplate("im_typing", {}));
                            var i = geByClass1("_im_typer_c", e);
                            i.appendChild(a)
                        }
                        var o = (0, M.formatTyper)(n.get()
                            .tabs[t.peerId].typing, t.peerId, !1, n.get());
                        val(geByClass1("_im_typing_name", a), o), o ? (s(e), addClass(a, "im-page--typing_vis")) : removeClass(a, "im-page--typing_vis")
                    }
                }
            },
            checkHeight: function(n, r) {
                var a = c(e);
                setStyle(a, {
                    height: a.offsetHeight - n
                }), t.update(!0, !0)
            },
            scrollFix: function(e, n, r) {
                (0, M.isPeerActive)(n, e.get()) && b(t, r) && t.scrollBottom(G)
            },
            newMessage: function(e, t) {
                l()
                    .newMessage(e, t)
            },
            showCreation: function(e, t) {
                l()
                    .showCreation(e, t)
            },
            updateScroll: function(n) {
                return k(n, t, e)
            },
            updateOnline: function(t, n) {
                if ((0, M.isTabLoaded)(n.get(), t)) {
                    var r = n.get()
                        .tabs[t].online;
                    if (t === n.get()
                        .peer) {
                        var a = geByClass1("_im_peer", e);
                        toggleClass(a, "nim-peer_online", r), r && s(e)
                    }
                }
            },
            replaceAttachmentPlaceholders: function(n, r) {
                if ((0, M.isPeerActive)(r.peerId, n.get())) {
                    var a = b(t);
                    (0, M.replaceAttaches)(e, r, n.get()), a && t.scrollBottom(0)
                }
            },
            removeMessages: function(n, r, a) {
                a.get()
                    .peer === r && ((0, M.removeMessages)(n, c(e)), k(a, t, e))
            },
            removeMessagesRestore: function(t, n, r, a) {
                a.get()
                    .peer === n && (0, M.removeMessagesWithRestore)(t, n, r, c(e))
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
                addClass(e, "im-page--hisory_search-open"), h.focus(t), S = (0, j.mount)(e, t, o)
            },
            cancelSearch: function(n) {
                var r = arguments.length <= 1 || void 0 === arguments[1] ? !0 : arguments[1];
                if (removeClass(e, "im-page--hisory_search-open"), removeClass(e, "im-page--history_search"), S && (S.unmount(), S = !1), r && !(0, M.isReservedPeer)(n
                        .get()
                        .peer)) {
                    var a = n.get()
                        .tabs[n.get()
                            .peer];
                    c(e)
                        .innerHTML = (0, L.strHistory)(a.history), k(n, t, e), t.scrollBottom(0), n.get()
                        .msgid && (_(t, e, n.get()
                            .msgid), v(n, e))
                }
            },
            unmount: function() {
                (0, D.removeDelegateEvent)(e, "click", M.FAILED_CLASS, u), (0, D.removeDelegateEvent)(e, "click", M.RESTORE_CLASS, g), (0, D.removeDelegateEvent)(e,
                    "click", K, p), removeEvent(geByClass1("_im_start_new", e), "click", E), removeEvent(geByClass1(W, e), "click", w), t.destroy(), r.unmount(), n.unmount(),
                    C.unmount(), T.unmount(), clearInterval(m)
            },
            removePeer: function(e, t) {
                l()
                    .removePeer(e, t)
            },
            respond: function(e, n) {
                r.attachMessages(e, n), r.focusOn(e), t.scrollBottom(G)
            },
            startForward: function(t) {
                addClass(e, "im-page--history_fwd"), geByClass1("_im_explain_fwd", e)
                    .textContent = getLang("mail_explain_fwd", t.get()
                        .pendingForward.length), l()
                    .removeSelection(t)
            }
        }
    }

    function A(e, t, n) {
        var r = geByClass1("_im_peer_history_w", e);
        show(r);
        var a = (0, O.createMutations)(I),
            s = a.callMutations,
            d = a.bindMutations,
            f = new Scrollbar(r, {
                onScroll: g.bind(null, t, s, r),
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto",
                nomargin: !0,
                nokeys: !0,
                hidden: !0
            });
        if ((0, M.isChatPeer)(t.get()
                .peer)) {
            var m = t.get();
            i(m.tabs[m.peer], m.peer, e, t)
        }
        setTimeout(function() {
            t.get()
                .msgid ? _(f, e, t.get()
                    .msgid) : p(f, e, s, t) || f.scrollBottom(G), v(t, e)
        }, 15);
        var y = (0, F.mount)(geByClass1("_im_dialog_actions", e), t, s),
            b = (0, B.mount)(geByClass1("_im_text_input", e), t, s),
            S = (0, N.mount)(geByClass1("_im_history_search", e), t, s),
            k = (0, R.mount)(e, t, s),
            A = (0, U.mount)(e, t, function() {
                return {
                    changedMessageSelection: y.changedMessageSelection
                }
            });
        (0, M.isReservedPeer)(t.get()
            .peer) || t.set(L.restoreHistoryQueue.bind(null, t.get()
                .peer))
            .then(function(n) {
                (0, M.restoreQueue)(t.get()
                    .peer, t.get(), c(e))
            });
        var x = C.bind(null, t, e),
            j = T.bind(null, t, e, f),
            H = w.bind(null, t, n, e),
            q = E.bind(null, n, t),
            Q = P.bind(null, s, t, e),
            Y = u.bind(null, t, e),
            X = h.bind(null, t, x, e),
            Z = M.showChatMembers.bind(null, t, s, L.setCreationType),
            $ = o.bind(null, t, e, f);
        (0, D.addDelegateEvent)(e, "click", M.RESTORE_CLASS, j), (0, D.addDelegateEvent)(e, "mouseover", M.FAILED_CLASS, Y), (0, D.addDelegateEvent)(e, "click", K, H), (0,
            D.addDelegateEvent)(e, "click", z, X), (0, D.addDelegateEvent)(e, "click", M.SHOW_CHAT_MEMBERS_CLASS, Z), (0, D.addDelegateEvent)(e, "click", V, $), addEvent(
            geByClass1("_im_start_new", e), "click", q), addEvent(geByClass1(W, e), "click", Q);
        var J = setInterval(l.bind(null, t, e), 1e3);
        return d(e, f, y, b, s, n, x, j, J, H, S, k, A, q, Q)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = A;
    var L = n(73),
        M = n(81),
        x = n(80),
        D = n(5),
        O = n(83),
        F = n(85),
        B = n(86),
        N = n(90),
        j = n(91),
        R = n(92),
        U = n(93),
        H = 1e3,
        G = -30,
        q = 30,
        Q = 2e3,
        K = "_im_cancel_fwd",
        W = "_im_to_end",
        z = "_im_failed_action",
        V = "_im_mess_link",
        Y = !1
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
        var a = geByClass1(y, e);
        hide(geByClass1(T, e)), hide(geByClass1(b, e)), addClass(geByClass1(E, e), "im-page--mess-actions_visible");
        var i = n.get()
            .tabs[n.get()
                .peer],
            o = r(t, i);
        toggleClass(geByClass1(E, e), "im-page--mess-actions_all-sel", !o);
        var s = getLang("mail_selected", t.length);
        val(a, s.replace("{count}", t.length) + p.selectionRemove), removeClass(e, "im-page--header-chat_verified")
    }

    function i(e, t) {
        var n = geByClass1(y, e),
            r = geByClass1(b, e);
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
                        f = [
                            [s, d.tab]
                        ];
                    e.set(m.setCreationType.bind(null, "chat", []))
                        .then(function(n) {
                            return t()
                                .showCreation(e, f)
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
                var n = t.get()
                    .curActions,
                    r = Object.keys(n)
                    .map(function(e) {
                        var t = "";
                        return 7 === m.ACTION_PRIORITIES[e] && (t = '<div class="ui_actions_menu_sep"></div>'), t + rs(I, n[e])
                    })
                    .join("");
                val(geByClass1(C, e), r)
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
                (0, h.removeDelegateEvent)(e, "click", w, t), (0, h.removeDelegateEvent)(e, "click", v, n), (0, h.removeDelegateEvent)(e, "click", P, r), (0, h.removeDelegateEvent)
                (e, "click", p.DESLECT_ALL_CLASS, o), (0, h.removeDelegateEvent)(e, "mouseover", k, s)
            }
        }
    }

    function f(e, t, n) {
        var r = (0, g.createMutations)(d),
            a = r.callMutations,
            i = r.bindMutations,
            s = o.bind(null, t, n, a),
            l = u.bind(null, t, n, a),
            f = p.showChatMembers.bind(null, t, n, m.setCreationType),
            _ = c.bind(null, t, n, a),
            y = function(e, n) {
                return (0, p.showVerifiedTooltip)(n, t.get()
                    .peer)
            };
        return (0, h.addDelegateEvent)(e, "click", w, s), (0, h.addDelegateEvent)(e, "click", v, l), (0, h.addDelegateEvent)(e, "click", P, f), (0, h.addDelegateEvent)(e,
            "click", p.DESLECT_ALL_CLASS, _), (0, h.addDelegateEvent)(e, "mouseover", k, y), (0, p.isReservedPeer)(t.get()
            .peer) || setTimeout(function() {
            t.set(m.setActions)
                .then(a()
                    .changeActions)
        }), i(e, s, l, f, _, y)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = f;
    var g = n(83),
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
        P = "_im_chat_members",
        k = "_im_chat_verified",
        I = '<a class="ui_actions_menu_item ' + v + ' im-action im-action_%icon%" data-action="%icon%">%name%</a>'
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        if (0 === e.length) return [""];
        for (var n = []; e.length > H;) {
            var r = e.substr(0, H)
                .lastIndexOf(" "); - 1 == r && (r = H), n.push(e.substr(0, r)), e = e.substr(r)
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
            ge("im_rc_em_" + u) || (s += '<a id="im_rc_em_' + u + '" class="im_rc_emojibtn" onmousedown="Emoji.addEmoji(cur.emojiId[cur.peer], \'' + u +
                "', this); return cancelEvent(event);\">" + Emoji.getEmojiHTML(u, !1, !0) + "</a>", l -= 22)
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
        return b(t, r) || C(t, r) ? void 0 : (0, D.getBindAttachToUrl)(t, r.get())
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
                        flags: M.eventTypes.FLAG_OUTBOUND | M.eventTypes.FLAG_UNREAD,
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
                return n.rid = c, n.mess = d, e(t, n), r.set(D.addMessage.bind(null, d))
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
            .loadingPeer(e), e.set(D.changePeer.bind(null, e.get()
                .peer, !1))
            .then(function(t) {
                return e.set(D.loadPeer.bind(null, e.get()
                    .peer, !0, -1))
            })
            .then(function(n) {
                return t()
                    .changePeer(e)
            })
            .then(function(e) {
                return n
            })) : Promise.resolve(n)
    }

    function u(e, t) {
        var n = gpeByClass(K, t.target),
            r = !!intval(domData(n, "val"));
        r !== cur.ctrl_submit && (cur.ctrl_submit = r, e.set(D.changeSubmitSettings.bind(null, r)))
    }

    function c(e, t, n, i, s, u) {
        var c = arguments.length <= 6 || void 0 === arguments[6] ? [] : arguments[6],
            d = geByClass1("_im_send", i);
        if ((0, D.isAnythingLoading)(e.get())) return e.set(D.setDelayedMessage.bind(null, !0))
            .then(function() {
                lockButton(d)
            });
        e.set(D.setDelayedMessage.bind(null, !1))
            .then(function() {
                unlockButton(d)
            });
        var f = e.get(),
            g = f.peer,
            m = geByClass1("_im_text", i);
        Promise.all([(0, D.getAttaches)(e, g), (0, D.getForwardedMessages)(g, e.get())])
            .then(l.bind(null, e, t))
            .then(function(l) {
                var u = L(l, 2),
                    d = u[0],
                    f = u[1];
                d = d.concat(c);
                var p = Emoji.editableVal(m) || "";
                if (p || 0 !== d.length || 0 !== f.length) {
                    f.length > 0 && d.push(["fwd", f]);
                    var _ = r(p);
                    a(m, i, g), _.slice(0, _.length - 1)
                        .forEach(function(r) {
                            o(n, g, {
                                message: r,
                                attaches: []
                            }, e, t, s)
                        });
                    var p = _.slice(-1)[0];
                    o(n, g, {
                        message: p,
                        attaches: d
                    }, e, t, s)
                }
            })
    }

    function d(e, t, n, r) {
        return e.set(D.deliverMessage.bind(null, n, r))
    }

    function f(e, t, n, r) {
        e.set(D.setMessageErrored.bind(null, n, r.mess))
            .then(t()
                .setMessageErrored.bind(null, n, r.mess))
    }

    function g(e, t, n, r, a, i) {
        var o = geByClass1("_im_text", e);
        return addEvent(o, "paste", i), addEvent(o, "focus", function() {
            return cur.focused = t.get()
                .peer
        }), addEvent(o, "blur", function() {
            return cur.focused = !1
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
            t.set(D.cleanMediaStore.bind(null, t.get()
                .peer));
            var l = s.getMedias()
                .slice()
                .map(function(e) {
                    return e.slice(0, 2)
                }),
                u = [];
            "undefined" != typeof a && r ? (o && t.set(D.bindAttachToUrl.bind(null, t.get()
                    .peer, r, a, o)), u = [
                    [r, a, i]
                ]) : r || "undefined" == typeof a || l.splice(a, 1), l = l.concat(u), l.filter(function(e) {
                    return e
                })
                .forEach(function(e) {
                    t.set(D.addMediaStore.bind(null, e))
                });
            var c = e()
                .updateScroll();
            e()
                .scrollFix(t, t.get()
                    .peer, c), t.get()
                .delayed_message && n([])
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
                    els: (0, R.toArray)(geByClass(K)),
                    val: n
                }
            }
        })
    }

    function _(e, t) {
        Emoji.val(e, t), Emoji.focus(e, !0), setTimeout(Emoji.correctCaret.pbind(e), 10)
    }

    function h(e, t) {
        var n = geByClass1(q, t);
        n.innerHTML = getTemplate("im_attach_mess", {
            messages: getLang("mail_title_X_msgs", e.length)
        })
    }

    function v(e, t, n) {
        e.set(D.forwardMessages.bind(null, [], e.get()
                .peer))
            .then(function() {
                var r = geByClass1(q, t);
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
                (0, O.isReservedPeer)(o) || Promise.all([(0, D.getAttaches)(r, o), (0, D.getTextDraft)(o, r.get()), (0, D.getForwardedMessages)(o, r.get())])
                    .then(function(e) {
                        return r.set(D.cleanMediaStore.bind(null, o))
                            .then(function(t) {
                                return e
                            })
                    })
                    .then(function(i) {
                        var s = L(i, 3),
                            l = s[0],
                            u = s[1],
                            c = s[2];
                        k(r, o, t)
                            .then(function(i) {
                                if (!i) {
                                    l.length > 0 && show(ge("_im_media_preview"));
                                    for (var s = 0; s < l.length; s++) e.chooseMedia.apply(e, l[s]);
                                    c.length > 0 ? h(c, n) : geByClass1(q, n)
                                        .innerHTML = "", _(t, u);
                                    var d = a()
                                        .updateScroll();
                                    a()
                                        .scrollFix(r, o, d)
                                }
                            })
                    })
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
                k(e, e.get()
                    .peer, t)
            },
            focusOn: function(e) {
                t.focus()
            },
            clearText: function(r, i) {
                e.unchooseMedia(), e.chosenMedias = [], Emoji.val(t, ""), i.set(D.saveTextDraft.bind(null, r, "")), i.set(D.cleanMediaStore.bind(null, r)), i.set(D.forwardMessages
                    .bind(null, [], r)), i.set(D.clearAttachToUrl.bind(null, r)), v(i, n, a)
            },
            attachMessages: function(e, t) {
                e.get()
                    .peer === t && (0, D.getForwardedMessages)(t, e.get())
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
                removeEvent(t, "paste", c), removeEvent(a, "click", r), (0, N.removeDelegateEvent)(n, "click", "_im_rc_emoji", i), (0, N.removeDelegateEvent)(n,
                    "click", Q, s), (0, N.removeDelegateEvent)(n, "click", "_im_will_fwd", l), e.destroy(), u.unmount(), (0, N.removeDelegateEvent)(bodyNode,
                    "click", K, d)
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
            .tabs[a].imdraft == i || b(a, e) || C(a, e) || (t.checkMessageURLs(i, !0), e.set(D.saveTextDraft.bind(null, a, i)))
    }

    function E(e, t) {
        var n = (0, j.getFiles)(t);
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
            Date.now() - (n.lastTyping || 0) > 1e3 * D.TYPING_PERIOD && e.set(D.sendTyping.bind(null, t))
        }
    }

    function P(e) {
        var t = e.get()
            .peer;
        (0, D.getForwardedMessages)(t, e.get())
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

    function k(e, t, n) {
        return b(t, e) || C(t, e) ? (n.disabled = !0, _(n, b(t, e) ? getLang("mail_chat_youre_kicked") : getLang("mail_send_privacy_error")), n.contentEditable = "false",
            hide(n.previousSibling), Promise.resolve(!0)) : (n.disabled = !1, _(n, ""), n.contentEditable = "true", show(n.previousSibling), (0, D.getTextDraft)(t, e.get())
            .then(function(e) {
                return _(n, e), !1
            }))
    }

    function I(e, t, n, r) {
        e.set(D.observeLoadProgress.bind(null, t, r))
    }

    function A(e, t, n) {
        cur.share_timehash = t.get()
            .share_timehash;
        var r = (0, x.createMutations)(y),
            a = r.callMutations,
            i = r.bindMutations,
            o = (0, U.mount)(e, t, a),
            l = d.bind(null, t, n),
            _ = (0, F.initQueue)(l, f.bind(null, t, n), {
                store: "ls",
                key: "im_send_queue_" + vk.id
            }),
            h = _.pushMessage,
            b = _.inspectQueue,
            C = _.resend,
            k = _.setErrored,
            A = s.bind(null, t, n, h, a),
            L = P.bind(null, t),
            M = E.bind(null, o);
        hide(geByClass1("ms_items_more_helper", e));
        var B, j = new MediaSelector(geByClass1(G, e), "_im_media_preview", [
            ["photo", getLang("profile_wall_photo")],
            ["gift", getLang("profile_wall_gift")],
            ["video", getLang("profile_wall_video")],
            ["audio", getLang("profile_wall_audio")],
            ["doc", getLang("profile_wall_doc")],
            ["map", getLang("profile_wall_map")]
        ], {
            maxShown: 1,
            onAddMediaChange: function(e, r, a, i) {
                m(n, t, H, e, r, a, i, j)
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
        hide(geByClass1("ms_items_more_helper", e)), addEvent(geByClass1(G, e), "mouseover", function() {
            B && clearTimeout(B), show(geByClass1("ms_items_more_helper", e))
        }), addEvent(geByClass1(G, e), "mouseout", function() {
            B = setTimeout(function() {
                hide(geByClass1("ms_items_more_helper", e))
            }, 500)
        }), j.onProgress = I.bind(null, t);
        var R, H = c.bind(null, t, n, h, e, a, j),
            q = debounce(T.bind(null, t, j), 500),
            W = g(e, t, function(r, a) {
                var i = t.get()
                    .peer,
                    o = Emoji.val(a);
                (0, O.isReservedPeer)(i) || t.get()
                    .tabs[i].imdraft == o || S(t), q(r, a);
                var s = e.offsetHeight;
                if (R && R !== s) {
                    var l = n()
                        .updateScroll();
                    n()
                        .scrollFix(t, t.get()
                            .peer, l)
                }
                R = s
            }, H, A, M),
            z = H.bind(null, []),
            V = p.bind(null, t),
            Y = geByClass1("_im_send", e);
        addEvent(Y, "click", z), addEvent(Y, "mouseover", V), t.get()
            .textMediaSelector = j, t.set(D.initTextStore.bind(null, b, C, k));
        var X = (ge("_im_media_preview"), geByClass1("_im_text", e));
        setTimeout(function() {
            a()
                .restoreDraft(t)
        }, 0);
        var Z = w.bind(null, W, t, X, j),
            $ = v.bind(null, t, e, n),
            J = u.bind(null, t);
        return (0, N.addDelegateEvent)(e, "click", "_im_rc_emoji", Z), (0, N.addDelegateEvent)(e, "click", Q, $), (0, N.addDelegateEvent)(e, "click", "_im_will_fwd", L), (
            0, N.addDelegateEvent)(bodyNode, "click", K, J), i(j, X, e, z, n, Z, b, $, L, o, M, J)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var L = function() {
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
    t.mount = A;
    var M = n(75),
        x = n(83),
        D = n(73),
        O = n(81),
        F = n(79),
        B = n(87),
        N = n(5),
        j = n(88),
        R = n(80),
        U = n(89),
        H = 3980,
        G = "_im_media_selector",
        q = "_im_media_fwd",
        Q = "_im_fwd_close",
        K = "_im_submit_btn"
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
        e.set(g.setCurrentSearchDate.bind(null, e.get()
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
        uiSearch.showProgress(n), (0, g.searchMessagesInplace)(e.get()
                .peer, e.get())
            .then(function(r) {
                uiSearch.hideProgress(n), t()
                    .insertSearch(r, e)
            })["catch"](function(e) {
                uiSearch.focus(n), uiSearch.hideProgress(n)
            })
    }

    function l(e, t, n) {
        e.set(g.setExecStack.bind(null, (0, m.executionStackPush)(e.get()
            .stack, _, c.bind(null, e, t, n))))
    }

    function u(e, t, n, r, a, i) {
        if ("keyup" !== i.type || 13 == i.which) {
            var o = clean(uiSearch.getFieldEl(t)
                .value);
            e.set(g.setCurrentSearch.bind(null, o, e.get()
                    .peer))
                .then(a.bind(null, e, r, t))
        }
    }

    function c(e, t, n) {
        e.set(g.setExecStack.bind(null, (0, m.execuctionStackFilter)(e.get()
                .stack, _))), e.set(g.cancelSearch.bind(null, e.get()
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
            }), e.set(g.clearDate.bind(null, e.get()
                .peer))
            .then(s.bind(null, e, t, r))
    }

    function f(e, t, n) {
        var l = geByClass1(v, e),
            f = geByClass1(y, e),
            g = i.bind(null, t, n, f),
            m = r(t, e, l, g),
            _ = o.bind(null, m, e),
            E = u.bind(null, t, f, l, n, debounce(s, 300)),
            w = c.bind(null, t, f, n),
            S = d.bind(null, t, n, m, f);
        return addEvent(geByClass1(h, e), "click", _), addEvent(uiSearch.getFieldEl(f), "keyup", E), addEvent(geByClass1(b, e), "click", E), addEvent(geByClass1(C, e),
            "click", w), (0, p.addDelegateEvent)(e, "click", T, S), a(e, _, f, E, w, S, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = f;
    var g = n(73),
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
            className: "_im_history_tooltip",
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
        if (!((0, u.isSearchingInplace)(e.get()
                .peer, e.get()) || hasClass(r, l.FAILED_CLASS) || hasClass(r, l.SENDING_CLASS) || (0, l.checkSelectClick)(n, r) || "A" === n.target.tagName)) {
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
            e.set(_.setExecStack.bind(null, (0, v.executionStackPush)(e.get()
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
        e.set(_.setExecStack.bind(null, (0, v.execuctionStackFilter)(e.get()
            .stack, "im_search")));
        var r = a(t);
        r.value = "", i(e, n, t, {
            target: r
        })
    }

    function c(e, t, n, r, a) {
        e.get()
            .searchText ? (u(e, t, n), setTimeout(function(t) {
                return f(e, a)
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
                r && (i = (0, y.mount)(t, e, n, r))
            },
            params: {
                width: 638,
                onHide: function() {
                    i.unmount()
                }
            }
        }, r)
    }

    function f(e, t) {
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

    function g(e, t, n, r, i, o, s) {
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
                    r = geByClass1(b, e);
                toggleClass(r, "im-page--stars_hidden", 0 === n), r.innerHTML = "<i></i> " + n
            },
            unmount: function() {
                removeEvent(a(e), "keyup", t), removeEvent(geByClass1("_im_search_croll", e), "click", n), removeEvent(geByClass1(b, e), "click", r), removeEvent(o,
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
            p = f.bind(null, t, r);
        return addEvent(a(e), "keyup", l), addEvent(r, "mousedown", u), addEvent(r, "mouseover", p), addEvent(geByClass1(b, e), "click", m), g(e, l, u, m, o, r, p)
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
        v = (r(h), n(80)),
        y = n(95),
        b = "_im_important_counter"
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
            l = (0, g["default"])({
                peer: 0,
                longpoll: s,
                tabs: (0, d.tabFromIds)(r.msgs, r.hash)
            }),
            f = (0, c.mount)(e.bodyNode, l, function() {
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
            p = i.bind(null, t, f);
        s.on("data", p);
        var _ = a.bind(null, {
            all: !1,
            loading: r.all,
            offset: r.offset
        }, e, o, l);
        return addEvent(o, "scroll", _), {
            unmount: function() {
                removeEvent(o, "scroll", _), m.unmount(), f.unmount(), s.off("data", p)
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
        u = n(91),
        c = n(92),
        d = n(81),
        f = n(76),
        g = r(f),
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
                a && (r = (0, f.mount)(n, e, t, a))
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
            .unread_cnt) && e.set(g.toggleUnreadOnly)
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
            hidedt: 300
        })
    }

    function s() {
        return DesktopNotifications.supported() && !DesktopNotifications.checkPermission() && !ls.get("im_ui_notify_off")
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
        f = n(97),
        g = n(73),
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

    function f(e, t, n, r, a, i, o, s, l, u) {
        return {
            unmount: function() {
                removeEvent(s, "scroll", t), removeEvent(geByClass1(E, e.bodyNode), "click", n), removeEvent(geByClass1(T, e.bodyNode), "click", r), removeEvent(
                        geByClass1("_im_spam_flush", e.bodyNode), "click", l), (0, h.removeDelegateEvent)(e.bodyNode, "click", "_im_mess_restore", a), (0, h.removeDelegateEvent)
                    (e.bodyNode, "click", "_im_go_to", i), (0, h.removeDelegateEvent)(e.bodyNode, "click", _.DESLECT_ALL_CLASS, u), o.unmount()
            }
        }
    }

    function g(e, t, n, r) {
        var g = ge("box_layer_wrap"),
            m = (0, v.createMutations)(f),
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
            }, e, g, w),
            P = s.bind(null, w, e.bodyNode),
            k = c.bind(null, t, e, n, p),
            I = d.bind(null, r.hash, e, p);
        (0, h.addDelegateEvent)(e.bodyNode, "click", "_im_mess_restore", P), (0, h.addDelegateEvent)(e.bodyNode, "click", "_im_go_to", k);
        var A = (0, y.mount)(e.bodyNode, w, function(t) {
                return {
                    changedMessageSelection: i.bind(null, e)
                }
            }),
            L = l.bind(null, w, e.bodyNode, A),
            M = u.bind(null, w, e.bodyNode, A),
            x = o.bind(null, w, e, A);
        return (0, h.addDelegateEvent)(e.bodyNode, "click", _.DESLECT_ALL_CLASS, x), addEvent(g, "scroll", S), addEvent(geByClass1(E, e.bodyNode), "click", L), addEvent(
            geByClass1(T, e.bodyNode), "click", M), addEvent(geByClass1("_im_spam_flush", e.bodyNode), "click", I), b(e, S, L, M, P, k, A, g, I, x)
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
    t.mount = g;
    var p = n(73),
        _ = n(81),
        h = n(5),
        v = n(83),
        y = n(93),
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
            .creationType && (e.set(S.setCreationType.bind(null, "dialog", [])), uiTabs.switchTab(geByClass1("_im_create_tab", t)
                .firstElementChild)), e.set(S.setExecStack.bind(null, (0, P.execuctionStackFilter)(e.get()
                .stack, "im_search")))
    }

    function i(e, t, n) {
        return t && (n.current_create_peer_ids = {}, n.current_create_peers = []), e.forEach(function(e) {
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
            .loadingPeer(e), a(e, t, n, !1, i), e.set(S.changePeer.bind(null, r, !1))
            .then(function(t) {
                return n()
                    .changePeer(!1, e), e.set(S.selectPeer.bind(null, !0))
            })
            .then(function(t) {
                n()
                    .selectPeer(e)
            })
    }

    function l(e, t, n) {
        var r, a = geByClass1(U, n),
            i = t.get()
            .selection.length;
        "add_member" === e.get()
            .creationType ? (r = 1 > i, val(geByClass1("_im_confirm_creation", n), 1 === i ? getLang("mail_append_chat") : getLang("mail_im_create_chat_with"))) : r = 1 >=
            i, toggleClass(a, "button_disabled", r)
    }

    function u(e, t, n, r, a, i, o, u) {
        var c = intval(domData(u, "peer"));
        if (inArray(e.get()
                .creationType, ["chat", "add_member"])) {
            a.remove(c);
            var d = geByClass1("_im_dialog_link", u)
                .textContent;
            r.addSelection(c, d), l(e, i, t)
        } else s(e, t, n, c, r)
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

    function d(e, t, n) {
        return !inArray(t.get()
            .creationType, ["chat", "add_member"]) && n !== !1 && e.peerId < 2e9
    }

    function f(e) {
        return e.get()
            .searchText || !1
    }

    function g(e) {
        return e.get()
            .selection.map(function(e) {
                return e.id
            })
    }

    function m(e, t, n, r) {
        toggleClass(e, "im-create_chat", "chat" === r.get()
            .creationType), toggleClass(e, "im-create_invite", "add_member" === r.get()
            .creationType), val(geByClass1("_im_confirm_creation", e), "add_member" === r.get()
            .creationType ? getLang("mail_im_create_chat_with") : getLang("mail_im_create_chat"));
        var a = n.get()
            .selection.map(function(e) {
                return e.id
            });
        _(e, r, t, !1, a), (0, I.fixTableCellChildHeight)("_im_create_wrap_safe", e)
    }

    function p(e, t, n, r) {
        return e.then(function(e) {
            return e.filter(function(e) {
                return !inArray(e.peerId, t) && (e.is_friend || d(e, r, n)) && !inArray(e.peerId, r.get()
                    .creationFilter)
            })
        })
    }

    function _(e, t, n, r, a) {
        var o, s, l = geByClass1(j, e),
            u = (0, S.searchLocalHints)(r, t.get());
        if (t.get()
            .creation_showed_all = !1, n.reset(), n.pipe(p(u, a, r, t), r), n.toTop(), r) {
            var c = inArray(t.get()
                .creationType, ["chat", "add_member"]) ? "friends" : "correspondents";
            s = (0, S.searchFriends)(r, t.get()), o = (0, S.searchHintsIndex)(r, [], c, data), n.pipe(p(o, a, r, t), r), n.pipe(p(s, a, r, t), r)
        } else o = Promise.resolve([]), s = Promise.resolve([]);
        t.set(i.bind(null, [u, s, o], !0)), uiSearch.showProgress(l), Promise.all([u, o, s])
            .then(uiSearch.hideProgress.bind(null, l))
    }

    function h(e, t, n, r, a, i, o, s) {
        uiTabs.switchTab(s.firstElementChild);
        var l = domData(s, "type");
        switch (l) {
            case "chat":
                i.restore();
                break;
            case "dialog":
                i.save()
        }
        e.set(S.setCreationType.bind(null, l, []))
            .then(m.bind(null, t, r, a))
    }

    function v(e, t, n, r) {
        var a = r.get()
            .searchText || !1,
            i = r.get()
            .selection.map(function(e) {
                return e.id
            });
        e.get()
            .creationQuery = a, _(t, e, n, a, i)
    }

    function y(e, t, n, r) {
        var a = 2e9 + Math.round(rand(1e6, 2e6));
        cur.recieveCropResult = function(n) {
            cur.recieveCropResult = !1, curBox() && curBox()
                .hide(), e.set(S.presetAvatar.bind(null, n)), (0, S.getOwnerPhoto)(n, a)
                .then(function(e) {
                    geByClass1(R, t)
                        .appendChild(ce("img", {
                            className: "im-chat-placeholder--img " + G,
                            src: e
                        }))
                })
        }, Page.ownerPhoto(a)
    }

    function b(e, t, n, r, i, o) {
        t.reset(), _(n, e, r, !1, g(t)), i.resetSelection(), a(e, n, o, !1, i), e.set(S.presetAvatar.bind(null, !1));
        var s = geByClass1(G, n);
        l(e, t, n), uiSearch.reset(geByClass1(N, n)), s && s.parentNode.removeChild(s)
    }

    function C(e, t, n, r, i, o, l) {
        var u = g(t);
        if ("add_member" === e.get()
            .creationType && u.length > 0) return e.set(S.addNewMember.bind(null, e.get()
            .peer, u)), void a(e, n, o, "", i);
        if (!(u.length <= 1) || e.get()
            .creating) {
            lockButton(l.target);
            var c = uiSearch.getFieldEl(geByClass1(N, n))
                .value;
            e.set(S.createChat.bind(null, e.get()
                    .next_chat_avatar, u, c))
                .then(function(a) {
                    b(e, t, n, r, i, o), s(e, n, o, e.get()
                        .next_peer, i), unlockButton(l.target)
                })["catch"](function(e) {
                    unlockButton(l.target), topMsg(getLang("global_unknown_error"), 2, "#FFB4A3")
                })
        }
    }

    function T(e) {
        return showTooltip(e.target, {
            text: getLang("mail_cancel"),
            black: 1,
            zIndex: 1e3,
            shift: [12, 4],
            appendCls: "js-im-page"
        })
    }

    function E(e, t, n, r, i, s, l) {
        return {
            show: function(t) {
                var a = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1];
                o(e, !0), t.set(S.setExecStack.bind(null, (0, P.executionStackPush)(t.get()
                    .stack, "im_create", n))), addClass(e, "im-create_shown"), l.focus(), a && a.forEach(function(e) {
                    return l.addSelection(e[0], e[1])
                }), m(e, r, s, t)
            },
            hide: function(n) {
                a(n, e, t, !1, l)
            },
            updateScroll: function() {
                (0, I.fixTableCellChildHeight)("_im_create_wrap_safe", e), r.updateScroll()
            },
            unmount: function() {
                removeEvent(geByClass1(D, e), "click", n), (0, L.removeDelegateEvent)(e, "click", F, onDialogClick), (0, L.removeDelegateEvent)(e, "click", B, i), r.unmount(),
                    cur.recieveCropResult = void 0
            }
        }
    }

    function w(e, t, n) {
        var r = (0, x["default"])({
                selection: []
            }),
            o = geByClass1(O, e),
            s = (0, k.mount)(o, (0, x["default"])({
                offset: 0,
                limit: q,
                elements: [],
                elCls: F
            }), function(a) {
                return {
                    idFn: function(e) {
                        return intval(e.peerId)
                    },
                    renderFn: c,
                    more: function(e, n) {
                        var a;
                        return t.get()
                            .creation_showed_all || f(r) !== !1 ? a = Promise.resolve([]) : (t.get()
                                .creation_showed_all = !0, a = (0, S.searchFriends)(f(r), t.get())), t.set(i.bind(null, [a], !1)), p(a, g(r), f(r), t)
                    },
                    onClick: function(a, i) {
                        u(t, e, n, m, s, r, a, i)
                    }
                }
            });
        t.get()
            .creationQuery = !1;
        var d = geByClass1(j, e),
            m = (0, A.mount)(d, r, function(n) {
                return {
                    selectionDeleted: function() {
                        l(t, r, e);
                        var n = p(Promise.resolve(t.get()
                            .current_create_peers), g(r), f(r), t);
                        s.pipeReplace(n, f(r))
                    },
                    onChange: v.bind(null, t, e, s)
                }
            }),
            _ = a.bind(null, t, e, n, "cross", m),
            w = h.bind(null, t, e, n, s, r, m),
            P = y.bind(null, t, e),
            I = b.bind(null, t, r, e, s, m, n),
            M = C.bind(null, t, r, e, s, m, n),
            N = geByClass1(D, e);
        return addEvent(N, "click", _), addEvent(N, "mouseover", T), addEvent(geByClass1()), addEvent(geByClass1(R, e), "click", P), addEvent(geByClass1(H, e), "click", I),
            addEvent(geByClass1(U, e), "click", M), (0, L.addDelegateEvent)(e, "click", B, w), E(e, n, _, s, w, r, m, I, M)
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
    t.mount = w;
    var S = n(73),
        P = n(80),
        k = n(82),
        I = n(81),
        A = n(99),
        L = n(5),
        M = n(76),
        x = r(M),
        D = "_im_create_cancel",
        O = "_im_create_list",
        F = "_im_dialog",
        B = "_im_create_tab",
        N = "_im_dialogs_creation_name",
        j = "_im_create_select",
        R = "_im_create_avatar",
        U = "_im_confirm_creation",
        H = "_im_cancel_creation",
        G = "_im_avatar_img",
        q = 100
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
        e.set(g.setCurrentSearch.bind(null, n, !1))
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
        uiSearch.reset(e), uiSearch.focus(e), a.length > 0 ? attr(i, "placeholder", "") : attr(i, "placeholder", getLang("mail_search_creation")), t.innerHTML = a.map(
                function(e) {
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

    function f(e, t, n) {
        uiSearch.init(e, {
            onChange: l.bind(null, t, n)
        });
        var i = uiSearch.getFieldEl(e),
            f = ce("div", {
                className: "_ui_multiselection ui_multiselect_cnt"
            });
        i && i.parentNode.insertBefore(f, i);
        var g = s(i);
        t.set(a);
        var _ = o.bind(null, e, t, n, f, g),
            h = function() {
                return uiSearch.focus(e)
            };
        return (0, m.addDelegateEvent)(e, "click", p, _), (0, m.addDelegateEvent)(e, "mouseover", p, d), addEvent(e, "click", h), {
            addSelection: function(n, a) {
                t.set(r.bind(null, {
                        id: n,
                        name: a
                    }))
                    .then(c.bind(null, e, f, t, g))
            },
            resetSelection: function() {
                u(t, e, f, g)
            },
            focus: function() {
                uiSearch.focus(e)
            },
            save: function() {
                t.stash(), c(e, f, t, g)
            },
            restore: function() {
                t.pop(), c(e, f, t, g)
            },
            unmount: function() {
                (0, m.removeDelegateEvent)(e, "click", p, _), (0, m.removeDelegateEvent)(e, "mouseover", p, d), removeEvent(e, "click", h)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = f;
    var g = n(73),
        m = n(5),
        p = "_ui_multiselect_cancel"
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
                z = e
            }

            function u(e) {
                Z = e
            }

            function c() {
                return function() {
                    e.nextTick(p)
                }
            }

            function d() {
                return function() {
                    W(p)
                }
            }

            function f() {
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

            function g() {
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
                for (var e = 0; X > e; e += 2) {
                    var t = re[e],
                        n = re[e + 1];
                    t(n), re[e] = void 0, re[e + 1] = void 0
                }
                X = 0
            }

            function _() {
                try {
                    var e = n(103);
                    return W = e.runOnLoop || e.runOnContext, d()
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
                    Z(function() {
                        F(r, a, o, i)
                    })
                } else M(n, a, e, t);
                return a
            }

            function v(e) {
                var t = this;
                if (e && "object" == typeof e && e.constructor === t) return e;
                var n = new t(y);
                return k(n, e), n
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
                Z(function(e) {
                    var r = !1,
                        a = E(n, t, function(n) {
                            r || (r = !0, t !== n ? k(e, n) : A(e, n))
                        }, function(t) {
                            r || (r = !0, L(e, t))
                        }, "Settle: " + (e._label || " unknown promise"));
                    !r && a && (r = !0, L(e, a))
                }, e)
            }

            function S(e, t) {
                t._state === se ? A(e, t._result) : t._state === le ? L(e, t._result) : M(t, void 0, function(t) {
                    k(e, t)
                }, function(t) {
                    L(e, t)
                })
            }

            function P(e, t, n) {
                t.constructor === e.constructor && n === ae && constructor.resolve === ie ? S(e, t) : n === ue ? L(e, ue.error) : void 0 === n ? A(e, t) : s(n) ? w(
                    e, t, n) : A(e, t)
            }

            function k(e, t) {
                e === t ? L(e, b()) : o(t) ? P(e, t, T(t)) : A(e, t)
            }

            function I(e) {
                e._onerror && e._onerror(e._result), x(e)
            }

            function A(e, t) {
                e._state === oe && (e._result = t, e._state = se, 0 !== e._subscribers.length && Z(x, e))
            }

            function L(e, t) {
                e._state === oe && (e._state = le, e._result = t, Z(I, e))
            }

            function M(e, t, n, r) {
                var a = e._subscribers,
                    i = a.length;
                e._onerror = null, a[i] = t, a[i + se] = n, a[i + le] = r, 0 === i && e._state && Z(x, e)
            }

            function x(e) {
                var t = e._subscribers,
                    n = e._state;
                if (0 !== t.length) {
                    for (var r, a, i = e._result, o = 0; o < t.length; o += 3) r = t[o], a = t[o + n], r ? F(n, r, a, i) : a(i);
                    e._subscribers.length = 0
                }
            }

            function D() {
                this.error = null
            }

            function O(e, t) {
                try {
                    return e(t)
                } catch (n) {
                    return ce.error = n, ce
                }
            }

            function F(e, t, n, r) {
                var a, i, o, l, u = s(n);
                if (u) {
                    if (a = O(n, r), a === ce ? (l = !0, i = a.error, a = null) : o = !0, t === a) return void L(t, C())
                } else a = r, o = !0;
                t._state !== oe || (u && o ? k(t, a) : l ? L(t, i) : e === se ? A(t, a) : e === le && L(t, a))
            }

            function B(e, t) {
                try {
                    t(function(t) {
                        k(e, t)
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
                    k(a, e)
                }

                function n(e) {
                    L(a, e)
                }
                var r = this,
                    a = new r(y);
                if (!Y(e)) return L(a, new TypeError("You must pass an array to race.")), a;
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
                    B(this, e) : H())
            }

            function q(e, t) {
                this._instanceConstructor = e, this.promise = new e(y), Array.isArray(t) ? (this._input = t, this.length = t.length, this._remaining = t.length,
                    this._result = new Array(this.length), 0 === this.length ? A(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(),
                        0 === this._remaining && A(this.promise, this._result))) : L(this.promise, this._validationError())
            }

            function Q() {
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
            var K;
            K = Array.isArray ? Array.isArray : function(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            };
            var W, z, V, Y = K,
                X = 0,
                Z = function(e, t) {
                    re[X] = e, re[X + 1] = t, X += 2, 2 === X && (z ? z(p) : V())
                },
                $ = "undefined" != typeof window ? window : void 0,
                J = $ || {},
                ee = J.MutationObserver || J.WebKitMutationObserver,
                te = "undefined" != typeof e && "[object process]" === {}.toString.call(e),
                ne = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                re = new Array(1e3);
            V = te ? c() : ee ? f() : ne ? g() : void 0 === $ ? _() : m();
            var ae = h,
                ie = v,
                oe = void 0,
                se = 1,
                le = 2,
                ue = new D,
                ce = new D,
                de = N,
                fe = j,
                ge = R,
                me = 0,
                pe = G;
            G.all = de, G.race = fe, G.resolve = ie, G.reject = ge, G._setScheduler = l, G._setAsap = u, G._asap = Z, G.prototype = {
                constructor: G,
                then: ae,
                "catch": function(e) {
                    return this.then(null, e)
                }
            };
            var _e = q;
            q.prototype._validationError = function() {
                return new Error("Array Methods must be provided an Array")
            }, q.prototype._enumerate = function() {
                for (var e = this.length, t = this._input, n = 0; this._state === oe && e > n; n++) this._eachEntry(t[n], n)
            }, q.prototype._eachEntry = function(e, t) {
                var n = this._instanceConstructor,
                    r = n.resolve;
                if (r === ie) {
                    var a = T(e);
                    if (a === ae && e._state !== oe) this._settledAt(e._state, t, e._result);
                    else if ("function" != typeof a) this._remaining--, this._result[t] = e;
                    else if (n === pe) {
                        var i = new n(y);
                        P(i, e, a), this._willSettleAt(i, t)
                    } else this._willSettleAt(new n(function(t) {
                        t(e)
                    }), t)
                } else this._willSettleAt(r(e), t)
            }, q.prototype._settledAt = function(e, t, n) {
                var r = this.promise;
                r._state === oe && (this._remaining--, e === le ? L(r, n) : this._result[t] = n), 0 === this._remaining && A(r, this._result)
            }, q.prototype._willSettleAt = function(e, t) {
                var n = this;
                M(e, void 0, function(e) {
                    n._settledAt(se, t, e)
                }, function(e) {
                    n._settledAt(le, t, e)
                })
            };
            var he = Q,
                ve = {
                    Promise: pe,
                    polyfill: he
                };
            n(104)
                .amd ? (r = function() {
                    return ve
                }.call(t, n, t, i), !(void 0 !== r && (i.exports = r))) : "undefined" != typeof i && i.exports ? i.exports = ve : "undefined" != typeof this && (
                    this.ES6Promise = ve), he()
        })
        .call(this)
    })
    .call(t, n(101), function() {
        return this
    }(), n(102)(e))
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
