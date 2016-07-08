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
        s = r(i),
        o = n(106),
        l = n(77);
    window.IM = {
        init: function(e) {
            window.Promise || (window.Promise = o.Promise), window.cur.lang.dont_attach = getLang("mail_dont_add_media"), cur.ctrl_submit = e.ctrl_submit, cur.module =
                "im", cur.mutedPeers = e.mutedPeers, cur.gid = e.gid, cur.peer = e.peer, e.blockedFlagUpdates = {}, e.msgid = intval(nav.objLoc.msgid), e.unread_dialogs =
                Object.keys(e.tabs)
                .filter(function(t) {
                    return e.tabs[t].unread > 0
                })
                .map(intval);
            var t = (0, s["default"])(e),
                n = (0, a.mount)(geByClass1("js-im-page", ge("page_body")), t);
            IM.chatPhotoSaved = function(e) {
                curBox() && curBox()
                    .hide();
                var n = (e || {})[1];
                return n ? (cur.pvShown && layers.fullhide(!0, !0), "im" != cur.module || t.get()
                    .peer != n ? nav.go("/im?sel=c" + (n - 2e9)) : void 0) : nav.reload()
            }, IM.activateTab = function(e) {
                t.get()
                    .longpoll.push([(0, l.changePeer)(intval(e), !1, !1, !0)])
            }, cur.nav.push(function() {
                var e = n.route.apply(null, arguments);
                return e !== !1 && n.unmount(), e
            })
        }
    };
    try {
        stManager.done("imn.js")
    } catch (u) {}
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

    function a(e, t, n) {
        var r = n.reduce(function(e, t) {
            return e[t.peerId] || (e[t.peerId] = []), e[t.peerId].push(t.messageId), e
        }, {});
        Object.keys(r)
            .forEach(function(n) {
                var a = r[n];
                e.set(Q.removeMessages.bind(null, a, n))
                    .then(function() {
                        t.removeMessages(a, intval(n), e)
                    })
            })
    }

    function i(e, t, n, r) {
        t.set(Q.updateChatPhoto.bind(null, e))
            .then(function() {
                var a = e.kludges.source_act;
                n.updateDialog(e.peerId, t), r.updateChatPhoto(e, a, t)
            })
    }

    function s(e, t, n, r, a, i, s) {
        e.set(Q.updateActions.bind(null, t, r, n))
            .then(function() {
                return t === W.CHAT_INVITE_USER ? e.set(Q.loadPeer.bind(null, n, e.get()
                    .peer === n, !1, !1)) : e.set(Q.chatKickUser.bind(null, n, a, r))
            })
            .then(function() {
                e.get()
                    .peer === n && (s.updateChat(e, n), i.updateDialog(n, e))
            })
    }

    function o(e, t) {
        "spam" === t ? (0, W.showSpamLayer)(e, z.mount, {}) : "fav" === t && (0, W.showFavvedBox)(e, {}, Y.mount, {})
    }

    function l(e, t) {
        if (e.get()
            .gid) {
            var n = t.parentNode,
                r = geByClass("_im_right_menu_counter", n),
                a = e.get()
                .dialog_tab_cts;
            r.forEach(function(e) {
                var t = domData(e, "tab");
                val(e, a[t] || "")
            })
        }
    }

    function u(e, t, n, r) {
        t.removeSelection(e), removeClass(r, "im-page_history-show");
        var a = e.get()
            .peer;
        e.set(Q.changePeer.bind(null, 0, !1))
            .then(function() {
                (0, W.isClassicInterface)(e) && t.activate(), n.changePeer(e), t.restoreScroll(e), setTimeout(function() {
                    e.get()
                        .longpoll.push([H.eventTypes.transitionEvent("search")])
                }, 13), (0, W.isLocksAvailable)(e) && (0, W.isPeerBlockedByMe)(a, e) && e.set(Q.releaseBlock.bind(null, a))
            })
    }

    function c(e, t, n, r, a) {
        e.forEach(function(e) {
            var o = e.kludges.source_act,
                l = intval(e.kludges.source_mid);
            switch (o) {
                case W.CHAT_PHOTO_REMOVE:
                case W.CHAT_PHOTO_UPDATE:
                    i(e, t, n, r);
                    break;
                case W.CHAT_KICK_USER:
                case W.CHAT_INVITE_USER:
                    s(t, o, e.peerId, l, e.userId, n, r);
                    break;
                case W.CHAT_TITLE_ACTION:
                    var u = e.kludges.source_text;
                    t.set(Q.setChatTitle.bind(null, e.peerId, u))
                        .then(function() {
                            r.updateChatTopic(e.peerId, t), (0, W.isClassicInterface)(t) && a.updateName(e.peerId, t)
                        })
            }
        })
    }

    function d(e, t) {
        return 2e9 > t && e && !e.match(/^\s*(Re(\(\d*\))?\:)?\s*\.\.\.\s*$/)
    }

    function g(e, t) {
        var n = t.flags & H.eventTypes.FLAG_OUTBOUND,
            r = inArray(t.peerId, e.get()
                .mutedPeers),
            a = t.flags & H.eventTypes.FLAG_DELETED,
            i = e.get()
            .gid;
        if (!n && !r && !a) {
            var s, o, l = d(t.subject, t.peerId) || "",
                u = (l ? l + " " : "") + t.text || "",
                c = t.userId,
                g = t.peerId,
                f = e.get()
                .tabs[g];
            if ((!e.get()
                    .notify_msg && !(0, W.isChatPeer)(g) || i && !e.get()
                    .mute) && window.Notifier && Notifier.playSound({
                    author_id: g
                }), !(0, W.isChatPeer)(g)) return;
            u = trim(replaceEntities(stripHTML(u.replace(/<br>/g, "\n")
                .replace(/<\*>.*$/, "")))), (0, W.isChatPeer)(g) ? (s = f.data.members[c].name, f.tab && (s += " » " + f.tab), o = f.data.members[c].photo) : (s = f.tab,
                o = f.photo);
            var m = t.attaches[0];
            m && "fwd" === m.type ? u += "\n[" + getLang("mail_added_msgs") + "]" : m && (u += "\n[" + getLang("mail_added_" + m.type) + "]"), s = trim(replaceEntities(
                stripHTML((s || "")
                    .replace("&nbsp;", " ")))), window.Notifier && Notifier.proxyIm({
                id: t.messageId,
                text: u,
                author_id: g,
                title: s,
                author_photo: o
            })
        }
    }

    function f(e) {
        var t = e.get()
            .longpoll.push.bind(null, [H.eventTypes.resetPeer()]);
        e.set(Q.setExecStack.bind(null, (0, K.executionStackPush)(e.get()
            .stack, "im_peer", t)))
    }

    function m(e, t) {
        var n = e.get()
            .tabs[t.peerId],
            r = e.get()
            .active_tab;
        return r === W.FOLDER_ALL ? !0 : (0, Q.filterFromTab)(r)(n)
    }

    function p(e) {
        var t = e.attaches.filter(function(e) {
            return "sticker" !== e.type
        });
        return (0, W.isServiceMsg)(e) || 0 === t.length
    }

    function _(e, t, n) {
        addClass(n, "im-page_history-show"), t.loadingPeer(e)
    }

    function v(e, t) {
        (0, W.isPendingForward)(e) && (e.set(Q.setExecStack.bind(null, (0, K.execuctionStackFilter)(e.get()
            .stack, "forward"))), e.set(Q.forwardMessages.bind(null, e.get()
            .pendingForward, t)))
    }

    function h(e, t) {
        var n = e.get()
            .gid ? 186 : 109;
        return n += 12, Math.floor((t.offsetHeight - n) / 32)
    }

    function b(e, t) {
        var n = h(e, t);
        if (e.get()
            .tabbedPeers.length > n) {
            var r = e.get()
                .tabbedPeers.slice(0, n);
            return e.set(Q.updateTabbedPeers.bind(null, r, !0))
        }
        return Promise.resolve(e)
    }

    function y(e, t, n, r, a, i, s, o, l) {
        t.forward && r.hideFwd(e), e.get()
            .searchText && t.cancelSearch && (a.clearSearch(e), n.restoreDialogs(e)), C(e, o, l), _(e, r, i);
        var u = e.get()
            .peer,
            c = e.set(Q.changePeer.bind(null, t.peerId, t.msgid))
            .then(function() {
                n.selectPeer(t.msgid, e), (0, W.isClassicInterface)(e) && (n.deactivate(), b(e, i)
                    .then(function() {
                        s.updateMenu(e)
                    }))
            });
        return c = t.msgid ? c.then(function() {
            return e.set(Q.selectPeerOnMessage.bind(null, t.peerId === u, u))
        }) : c.then(function() {
            return e.set(Q.selectPeer.bind(null, !0))
        }), c.then(function() {
            t.forward && (v(e, e.get()
                .peer), e.set(Q.readLastMessages.bind(null, e.get()
                .peer))), r.changePeer(e), r.updateTyping(t, e), f(e)
        })
    }

    function C(e, t, n) {
        t && e.get()
            .showed && (t.hide(e), n()
                .createCanceled(e))
    }

    function T(e, t, n) {
        e.get()
            .searchText && (t.clearSearch(e), n.restoreDialogs(e))
    }

    function E(e, t, n, a, i, s, d, v, h, E, w, S, k, I, P, A, M, x, O, B, F) {
        return {
            changePeer: function(t, n) {
                e.selectPeer(t, n)
            },
            cancelSearch: function(t) {
                T(t, n, e)
            },
            loadingPeer: function(e) {
                _(e, t, a)
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
            showCreation: function(r, i) {
                (0, W.isClassicInterface)(r) && (e.saveScroll(r), t.saveScroll(r)), n.rotateCross(r), addClass(a, "im-page_creating"), w && w.show(r, i), (0, W.isClassicInterface)
                    (r) && setTimeout(function() {
                        setStyle(a.parentNode, {
                            overflow: "hidden"
                        })
                    }, 200)
            },
            updateState: function(n, r) {
                e.updateDialog(n, r), r.get()
                    .peer === n && t.updateChat(r, n)
            },
            appendFastDialogs: function(t, n) {
                e.appendFastDialogs(t, n, !0)
            },
            createCanceled: function(r, i) {
                n.createCanceled(r, i), removeClass(a.parentNode, "im-page_creating"), (0, W.isClassicInterface)(r) && (setStyle(a.parentNode, {
                    overflow: "visible"
                }), setTimeout(function() {
                    0 === r.get()
                        .peer ? e.restoreScroll(r) : t.restoreScroll(r, r.get()
                            .peer)
                }, 0))
            },
            updateMenu: function(e) {
                B && B.updateMenu(e)
            },
            hideFwd: function(e) {
                t.hideFwd(e)
            },
            selectPeer: function(e) {
                t.changePeer(e), f(e)
            },
            updateDialog: function(t, n) {
                e.updateDialog(t, n)
            },
            focusTxt: function(e) {
                t.focustTxt(e)
            },
            resync: function(r) {
                r.get()
                    .searchText && n.clearSearch(r), e.restoreDialogs(r, !0, !0), e.focusOnSelected(r), w && w.hide(r), (0, W.isCommunityInterface)(r) && l(r, a), (0,
                        W.isClassicInterface)(r) && r.get()
                    .tabbedPeers.forEach(function(e) {
                        var t = e.peer;
                        B.updateCounter(r, t), B.updateName(t, r)
                    }), t.cleanSelection(r.get()
                        .selectedMessages || []), t.cancelSearch(r, !0), t.changePeer(r);
                var i = r.get()
                    .gid ? "l_mgid" + r.get()
                    .gid : "msg";
                handlePageCount(i, r.get()
                    .unread_cnt)
            },
            toggleSettingsLoader: function(e, t) {
                k.toggleLoader(e, t)
            },
            onUserActions: function(e, t) {
                if (!(0, Q.isSearchingInplace)(e.get()
                        .peer, e.get())) {
                    var n = e.get(),
                        r = n.peer;
                    if ((0, W.isFullyLoadedTab)(n, r) && !i.is_idle) {
                        var a = (0, Q.countUnread)(e.get()
                            .peer, e.get());
                        if (a > 0) {
                            var s = n.tabs[r];
                            s.skipped || e.set(Q.readLastMessages.bind(null, r))
                        }
                    }
                }
            },
            removeSelection: function(t) {
                e.removeSelection(t), n.focusInput(t)
            },
            route: function(t, r, i, s) {
                if (t[0]) return !0;
                geByClass1("_im_right_menu", a.parentNode);
                t.box && (t = {
                    box: t.box
                });
                var l = !1;
                return Object.keys(t)
                    .sort()
                    .forEach(function(e) {
                        switch (e) {
                            case "sel":
                                l = !0;
                                var t = i.sel ? (0, W.unUrlPeer)(i.sel) : 0;
                                0 === t ? I.get()
                                    .longpoll.push([H.eventTypes.resetPeer()]) : I.get()
                                    .longpoll.push([H.eventTypes.changePeer(t)]);
                                break;
                            case "tab":
                                C(I, w, E), l = !0;
                                var n = i.tab || W.FOLDER_ALL;
                                I.get()
                                    .longpoll.push([H.eventTypes.changeTab(n)]);
                                break;
                            case "box":
                                o(I, i.box)
                        }
                    }), (0, W.isClassicInterface)(I) && "undefined" == typeof t.sel && B.updateMenu(I), l && T(I, n, e), !1
            },
            updateDialogFilters: function(t) {
                t.get()
                    .searchText || e.restoreDialogs(t), k.updateFilter(t)
            },
            removePeer: function(n, r) {
                t.changePeer(n, n.get()
                    .peer), e.removeDialog(n, r), (0, W.isClassicInterface)(n) && (B.updateMenu(n), n.get()
                    .longpoll.push([H.eventTypes.resetPeer()]))
            },
            newMessage: function(n, r) {
                e.promoteDialog(r, n), e.scrollUp(!0), t.addMessage(r, n)
            },
            onEvents: function(i, s) {
                var o = (i.get()
                        .gid, s),
                    d = s.filter(W.isServiceMsg),
                    f = s.filter(function(e) {
                        return e.type === H.eventTypes.ADD_MESSAGE
                    });
                c(d, i, e, t, B), i.set(Q.checkNewPeople.bind(null, d, f, v))
                    .then(function() {
                        o.forEach(function(s) {
                            switch (s.type) {
                                case H.eventTypes.ADD_MESSAGE:
                                    var o = (0, W.isDuplicate)(s, i.get());
                                    if (0 === o) {
                                        s.flags & H.eventTypes.FLAG_OUTBOUND || i.set(Q.updateFavAndTitle.bind(null, s.peerId, !0));
                                        var c = i.set(Q.addMessage.bind(null, s))
                                            .then(function() {
                                                return b(i, a)
                                            })
                                            .then(function() {
                                                m(i, s) && (g(i, s), e.updateTyping(s, i), i.get()
                                                        .searchText ? e.updateDialog(s.peerId, i) : e.promoteDialog(i, s)), (0, W.isClassicInterface)(i) &&
                                                    (B.updateCounter(i, s.peerId), B.updateMenu(i)), t.updateTyping(s, i), t.addMessage(i, s), (0, W.isClassicInterface)
                                                    (i) || k.updateFilter(i)
                                            });
                                        p(s) || Promise.all([c, i.set(Q.loadMedia.bind(null, s))])
                                            .then(function(e) {
                                                var n = D(e, 2),
                                                    r = n[1];
                                                t.replaceAttachmentPlaceholders(r, s)
                                            })
                                    } else 2 === o && (p(s) || i.set(Q.loadMedia.bind(null, s))
                                        .then(function(e) {
                                            t.replaceAttachmentPlaceholders(e, s)
                                        }), i.set(Q.replaceMessage.bind(null, s))
                                        .then(t.replaceMessageAttrs.bind(null, s)));
                                    break;
                                case H.eventTypes.READ_INBOUND:
                                    i.set(Q.markInboundMessagesAsRead.bind(null, s))
                                        .then(function(t) {
                                            e.updateCounter(t, s), (0, W.isClassicInterface)(t) && B.updateCounter(t, s.peerId), t.get()
                                                .searchText || e.restoreDialogs(t), k.updateFilter(t)
                                        });
                                    break;
                                case H.eventTypes.READ_OUTBOUND:
                                    i.set(Q.markOutboundMessagesAsRead.bind(null, s))
                                        .then(function(n) {
                                            e.updateCounter(n, s), t.markMessagesAsRead(n, s)
                                        });
                                    break;
                                case H.eventTypes.UNREAD_COUNT:
                                    i.set(Q.updateUnreadCount.bind(null, s.count))
                                        .then(function() {
                                            var e = i.get()
                                                .gid ? "l_mgid" + i.get()
                                                .gid : "msg";
                                            handlePageCount(e, s.count), k.updateFilter(i), (0, W.isClassicInterface)(i) && l(i, a)
                                        });
                                    break;
                                case H.eventTypes.GOT_ONLINE:
                                case H.eventTypes.GOT_OFFLINE:
                                    var d = s.type === H.eventTypes.GOT_ONLINE ? !0 : !1;
                                    i.set(Q.updateOnline.bind(null, s.userId, d))
                                        .then(function(n) {
                                            (0, W.isTabLoaded)(n.get(), s.userId) && (e.updateOnline(s.userId, n), t.updateOnline(s.userId, n))
                                        });
                                    break;
                                case H.eventTypes.SET_FLAGS:
                                case H.eventTypes.RESET_FLAGS:
                                    if (s.flags !== H.eventTypes.FLAG_DELETED || s.type !== H.eventTypes.SET_FLAGS || (0, W.isAlreadyDeleted)(i, s.peerId,
                                            s.messageId) || i.get()
                                        .blockedFlagUpdates[s.peerId] || h(s), s.flags === H.eventTypes.FLAG_IMPORTANT) {
                                        var f = s.type === H.eventTypes.SET_FLAGS;
                                        i.set(Q.updateImportant.bind(null, f ? 1 : -1, s.messageId))
                                            .then(function() {
                                                (0, W.isClassicInterface)(i) || n.updateImportantCnt(i)
                                            }), i.set(Q.updateFavMessage.bind(null, [s.messageId], s.peerId, f))
                                            .then(function(e) {
                                                t.markImportant(s.messageId, f, i)
                                            })
                                    }
                                    break;
                                case H.eventTypes.TYPING:
                                    (0, W.isSelfMessage)(s.peerId, i.get()
                                        .gid) || (i.set(Q.setTyping.bind(null, s.peerId, s.userId))
                                        .then(function(n) {
                                            (0, W.isTabLoaded)(n.get(), s.peerId) && (t.updateTyping(s, n), e.updateTyping(s, n))
                                        }), i.set(Q.waitTyping.bind(null, s.peerId, s.userId))
                                        .then(function(n) {
                                            (0, W.isTabLoaded)(n.get(), s.peerId) && (t.updateTyping(s, n), e.updateTyping(s, n))
                                        }));
                                    break;
                                case H.eventTypes.NOTIFY_SETTINGS_CHANGED:
                                    L(i, E, s.peerId, 0 !== s.disabledUntil);
                                    break;
                                case H.eventTypes.RESYNC:
                                    i.get()
                                        .longpoll.pause(), i.set(Q.resync)
                                        .then(E()
                                            .resync)
                                        .then(function(e) {
                                            return i.get()
                                                .longpoll.resume()
                                        });
                                    break;
                                case H.eventTypes.TRANSITION:
                                    P.transition(s.state);
                                    break;
                                case H.eventTypes.RESET_PEER:
                                    u(i, e, t, a), s.cancelSearch && T(i, n, e), (0, W.isClassicInterface)(i) && B.updateMenu(i), (0, W.isPendingForward)(i) &&
                                        n.focusInput(i);
                                    break;
                                case H.eventTypes.CHANGE_TAB:
                                    (0, W.changeTab)(s.tab, i, E, Q.changeDialogsTab);
                                    break;
                                case H.eventTypes.RESET_DIRECTORIES:
                                case H.eventTypes.SET_DIRECTORIES:
                                case H.eventTypes.REPLACE_DIRECTORIES:
                                    i.set(Q.updateFolderState.bind(null, s.peerId, s.mask, s.type, s.local))
                                        .then(function(n) {
                                            n.get()
                                                .searchText || s.type === H.eventTypes.RESET_DIRECTORIES && s.mask === H.eventTypes.FOLDER_IMPORTANT ||
                                                s.type === H.eventTypes.REPLACE_DIRECTORIES || e.restoreDialogs(n), e.updateDialog(s.peerId, n), l(n, a),
                                                n.get()
                                                .peer === s.peerId && t.changedMessageSelection(n)
                                        });
                                    break;
                                case H.eventTypes.CHANGE_PEER:
                                    y(i, s, e, t, n, a, B, w, E);
                                    break;
                                case H.eventTypes.MUTEX:
                                    var _ = r({}, s.peerId, s),
                                        v = (0, W.isPeerBlocked)(s.peerId, i);
                                    i.set(Q.updateBlockStates.bind(null, _))
                                        .then(function() {
                                            e.updateDialog(s.peerId, i);
                                            var n = (0, W.isPeerBlocked)(s.peerId, i);
                                            (0, W.isFullyLoadedTab)(i.get(), s.peerId) && v !== n && t.updateChat(i, s.peerId)
                                        })
                            }
                        })
                    })
            },
            unmount: function() {
                clearInterval(I.get()
                        .update_title_to), show("footer_wrap"), i.stop(), removeEvent(document, "mousemove mousedown keydown", s), removeEvent(document, "keydown", A),
                    removeEvent(document, "keyup", M), removeEvent(document, "keydown", S), removeEvent(window, "resize", d), v.stop(), e.unmount();
                var r = window.devicePixelRatio >= 2 ? "_2x" : "";
                setFavIcon("/images/icons/favicons/fav_logo" + r + ".ico"), t.unmount(), n.unmount(), B && B.unmount(), F && F(), x && x(), (0, W.isLocksAvailable)(I) &&
                    I.get()
                    .peer && I.set(Q.releaseBlock.bind(null, I.get()
                        .peer)), B && B.unmount(), clearInterval(O)
            }
        }
    }

    function w(e, t, n) {
        !n || "keypress" !== n.type || 27 === n.which || 13 === n.which || (0, Q.isSearchingInplace)(t.get()
                .peer, t.get()) || hasClass(document.activeElement, "_im_text") || hasClass(document.activeElement, "im_editable") || hasClass(document.activeElement,
                "fc_editable") || "INPUT" === document.activeElement.tagName || "TEXTAREA" === document.activeElement.tagName || document.activeElement.getAttribute(
                "contenteditable") || n.ctrlKey || browser.mac && n.metaKey || (0 === t.get()
                .peer ? e()
                .focusSearch(t) : e()
                .focusTxt(t)), (0, W.isReservedPeer)(t.get()
                .peer) || e()
            .onUserActions(t, n), t.set(Q.updateFavAndTitle.bind(null, !1, !1))
    }

    function S(e, t, n, a, i, s) {
        var o = arguments.length <= 6 || void 0 === arguments[6] ? !0 : arguments[6];
        if (!isFullScreen()) {
            var l = ge("page_header"),
                u = (ge("footer_wrap"), (window.innerHeight || document.documentElement.clientHeight) - l.offsetHeight - Z - 2),
                c = (0, W.isClassicInterface)(t) ? "minHeight" : "height",
                d = (0, W.isClassicInterface)(t) ? $ : V;
            if (setStyle(e, r({}, c, Math.max(u, d))), a && a.updateScroll(), i && i.updateScroll(), n) {
                var g = n.updateScroll();
                n.scrollFix(t, t.get()
                    .peer, g)
            }
            o && setTimeout(function() {
                return S(e, t, n, a, i, s, !1)
            }, 100)
        }
    }

    function k(e, t, n, a) {
        function i() {
            var t = (0, R.getNativeOption)("scrollLeft"),
                n = hasClass(e, "im-page--header_static"),
                a = [];
            c !== t ? a = u.slice()
                .concat([e]) : n !== d && (a = [e]), c = t, d = n, a.length > 0 && a.forEach(function(a) {
                    var i = e === a && n ? 0 : -t;
                    setStyle(a, r({}, cssTransformProp, 0 === i ? "unset" : "translateX(" + i + "px)"))
                })
        }
        if (browser.mobile) return !1;
        var s = ge("side_bar"),
            o = geByClass1("_im_chat_input_w", a),
            l = geByClass1("_im_dialog_actions", a),
            u = [t, n, s, o, l],
            c = null,
            d = hasClass(e, "im-page--header_static");
        return addEvent(window, "scroll", i), i(),
            function() {
                removeEvent(window, "scroll", i), setStyle(s, {
                    transform: ""
                })
            }
    }

    function I(e, t) {
        var t = e.get()
            .tabbedPeers[t];
        t && e.get()
            .longpoll.push([H.eventTypes.changePeer(t.peer, !1, !0, !0)])
    }

    function P(e, t) {
        t && "keydown" === t.type && !layers.visible && 27 === t.which && e.set(Q.setExecStack.bind(null, (0, K.executionStackPop)(e.get()
            .stack)))
    }

    function L(e, t, n, r) {
        e.set(Q.setMutedPeer.bind(null, n, r))
            .then(t()
                .updateState.bind(null, n))
    }

    function A(e, t) {
        var n;
        hide("footer_wrap");
        var r = window.devicePixelRatio >= 2 ? "_2x" : "";
        setFavIcon("/images/icons/favicons/fav_im" + r + ".ico"), S(e, t, !1, !1, !1, !0), show(e), t.set(Q.fetchLocalHints);
        var i = (0, j.createMutations)(E),
            s = i.callMutations,
            l = i.bindMutations,
            u = (0, H.startLongPoll)(t.get());
        u.on("data", function() {
            for (var e = arguments.length, n = Array(e), r = 0; e > r; r++) n[r] = arguments[r];
            return s()
                .onEvents(t, n)
        }), window.lpl = u;
        var c = geByClass1("_im_dialogs_search", e),
            d = geByClass1("_im_dialogs_settings", e),
            g = (0, M.mount)(geByClass1("_im_page_dcontent", e), t, s),
            m = (0, x.mount)(geByClass1("_im_page_history", e), t, s),
            p = (0, O.mount)(c, t, s),
            _ = (0, B.mount)(d, t, s);
        if ((0, W.isClassicInterface)(t) && _.updateSettings(t), (0, W.isClassicInterface)(t)) var v = geByClass1("_im_ui_peers_list", e.parentNode),
            h = (0, q.mount)(v, t, s),
            b = k(c, d, geByClass1("_im_right_menu", e.parentNode), e);
        (0, W.isClassicInterface)(t) && t.get()
            .peer && g.deactivate(), t.get()
            .gid || (n = (0, F.mount)(geByClass1("_im_dialogs_creation", e), t, s));
        var y = 0 === t.get()
            .peer ? "search" : "default",
            C = (0, U.create)(t, y, t.get()
                .ctrl_submit, g, m);
        m.updateScroll();
        var T = throttle(w.bind(null, s, t), 300);
        (0, W.isReservedPeer)(t.get()
            .peer) || setTimeout(function(e) {
            f(t)
        }, 10);
        var L = new IdleManager({
                id: "im",
                element: document,
                focusElement: window,
                triggerEvents: "mousemove mousedown keypress"
            }),
            A = S.bind(null, e, t, m, g, n, !1),
            R = P.bind(null, t);
        if (t.get()
            .longpoll = u, addEvent(window, "resize", A), t.set(Q.setExecStack.bind(null, [])), L.on("unidle", function() {
                u.abortPauses(), T()
            }), L.start(), addEvent(document, "mousemove mousedown keypress", T), addEvent(document, "keydown", R), (0, W.isLocksAvailable)(t)) var z = (0, G.createWorker)
            (t.get()
                .mutex_key,
                function(e) {
                    t.get()
                        .longpoll.push([H.eventTypes.mutexEvent(e)])
                },
                function(e, n) {
                    return (0, Q.getMutexQueue)(t.get()
                            .gid)
                        .then(function(e) {
                            var t = D(e, 1),
                                n = t[0];
                            return n
                        })
                }),
            Y = z.stop;
        var Z, V = function(e) {
                13 === e.which && C.signal(e.which, e), clearInterval(Z), Z = !1
            },
            $ = function(e) {
                if (!layers.visible) {
                    if (e.which >= 49 && e.which <= 57 && (e.ctrlKey || e.metaKey && browser.mac) && (0, W.isClassicInterface)(t)) return I(t, e.which - 49), cancelEvent(e);
                    !Z && inArray(e.which, [38, 40, 33, 34]) && (C.signal(e.which, e), Z = setInterval(C.signal.bind(null, e.which, e), 130))
                }
            };
        if (nav.objLoc.box && (o(t, nav.objLoc.box), (0, N.updateLocation)({
                box: null
            })), addEvent(document, "keydown", $), addEvent(document, "keyup", V), t.set(Q.fetchFriends), (0, W.isLocksAvailable)(t)) var X = setInterval(W.blockLatencyCompensation
            .bind(null, t, t.get()
                .longpoll), 2e3);
        var J = (0, K.throttleAccumulate)(a.bind(null, t, m), 200);
        return l(g, m, p, e, L, T, A, u, J, s, n, R, _, t, C, $, V, Y, X, h, b)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var D = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    var M = n(3),
        x = n(86),
        O = n(97),
        B = n(99),
        F = n(101),
        N = n(74),
        R = n(84),
        j = n(85),
        U = n(103),
        H = n(75),
        G = (n(77), n(104)),
        z = n(100),
        q = n(105),
        K = n(80),
        Q = n(73),
        W = n(81),
        Y = n(98),
        Z = 30,
        V = 400,
        $ = 250
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
        }].concat(r) : [P()], n.pipeReplace(Promise.resolve(r))
    }

    function i(e) {
        return hasClass(e, "_im_search")
    }

    function s(e, t, n, r) {
        if (e.get()
            .searchText && e.get()
            .searchAllLoaded) return Promise.resolve([]);
        if (e.get()
            .dialog_search_going || (0, z.isClassicInterface)(e) && 0 !== e.get()
            .peer) return Promise.resolve(!1);
        if (e.get()
            .searchText) return (0, G.searchMessages)(e.get()
                .searchText, e.get())
            .then(function(e) {
                var t = U(e, 2),
                    n = t[0],
                    r = t[1];
                return k(r, n)
            });
        var a = e.get()
            .active_tab,
            i = e.get()
            .dialog_tabs_all;
        return i[z.FOLDER_ALL] || i[a] ? 0 === R(e)
            .length ? Promise.resolve([{
                type: "empty_dialogs",
                peerId: "000"
            }]) : Promise.resolve([]) : e.set(G.loadDialogs)
            .then(function(t) {
                var n = R(e);
                return 0 === n.length ? [{
                    type: "empty_dialogs",
                    peerId: "000"
                }] : n
            })
    }

    function o(e, t, n, r, a) {
        var s = parseInt(domData(a, "peer"), 10);
        if (!gpeByClass("_im_peer_target", r.target)) {
            if (checkEvent(r)) {
                var o = t.get()
                    .tabs[s];
                return void window.open((0, z.isClassicInterface)(t) ? (0, z.getBaseLink)(t) + "?sel=" + o.peerId : o.href)
            }
            var l = t.get()
                .peer,
                u = parseInt(domData(a, "msgid"));
            n.saveScroll("list");
            var c = t.get()
                .msgid;
            if (i(a) && c !== u) t.get()
                .longpoll.push([Z.eventTypes.changePeer(s, u)]);
            else if (s !== l) {
                t.get()
                    .longpoll.push([Z.eventTypes.changePeer(s, !1, !0, !0)]);
                var d = t.get()
                    .searchText;
                d && !(0, z.isClassicInterface)(t) && setTimeout(function() {
                    n.scrollTo(s, !0, $, "center")
                }, 100)
            } else s === l && t.get()
                .longpoll.push([Z.eventTypes.changePeer(s, !1, !0, !i(a))])
        }
    }

    function l(e) {
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

    function u(e, t, n) {
        var r;
        (0, z.isChatPeer)(e) && !t.photo ? r = (0, z.renderPhotosFromTab)(t, !n) : (r = '<img src="' + t.photo + '" alt=""/>', n && (r = getTemplate("im_dialogs_link_img", {
            href: t.href,
            photo: r
        })));
        var a = '<span class="_im_dialog_link">' + t.tab + "</span>";
        return {
            photo: r,
            userLink: a
        }
    }

    function c(e) {
        return !(0, z.isPendingForward)(e)
    }

    function d(e, t, n, r, a, i, s, o, u, c) {
        var d = "",
            g = "";
        return e & Z.eventTypes.FLAG_OUTBOUND ? d = u ? getTemplate("im_img_prebody", {
            photo: c
        }) : getLang("mail_by_you") + ":" : (0, z.isChatPeer)(n) && 0 !== r && (d = t.data.members[r].first_name + ":"), s = s.replace(/\<br\s*\/?\>/gi, " "), a && (s =
            Emoji.emojiToHTML(s, !0)), o && "..." !== o.trim() && !(0, z.isChatPeer)(n) && (s = getTemplate("im_topic", {
            topic: o,
            cls: "im-topic_dialog"
        }) + s), !s && i.length > 0 && (s = getTemplate("im_dialog_media", {
            name: l(i[0])
        })), g = d ? getTemplate("im_drow_prebody", {
            prebody: d,
            body: s
        }) : s
    }

    function g(e, t, n, r) {
        var a = arguments.length <= 4 || void 0 === arguments[4] ? {} : arguments[4],
            i = [];
        return (0, z.isClassicInterface)(r) && i.push("nim-dialog_classic"), i.push("nim-dialog_empty"), a.search && i.push("_im_search"), getTemplate("im_drow", {
            peer: e.peerId,
            msg_id: "",
            photo: t,
            user_link: n,
            date: "",
            body: "",
            unread: "",
            more: i.join(" "),
            is_star: "",
            is_online: onlinePlatformClass(e.online),
            is_unread: "",
            is_unread_out: "",
            is_selected: e.peerId == r.get()
                .peer ? "nim-dialog_selected _im_dialog_selected" : ""
        })
    }

    function f(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3],
            a = u(t.peerId, t, (0, z.isClassicInterface)(e)),
            i = a.photo,
            s = a.userLink,
            o = n || _(t);
        if (!o) return g(t, i, s, e, r);
        var l = o.flags,
            c = t.unread > 0 ? t.unread : "",
            d = p(t, e, n),
            f = [];
        return r.search && f.push("_im_search", "nim-dialog_search"), inArray(t.peerId, e.get()
                .mutedPeers) && f.push("nim-dialog_muted"), t.verified && f.push("nim-dialog_verified"), -1 === o.messageId && f.push("nim-dialog_empty"), (0, z.isClassicInterface)
            (e) && f.push("nim-dialog_classic"), t.folders & Z.eventTypes.FOLDER_IMPORTANT && f.push("nim-dialog_starred"), !r.search && (0, z.isUnrespond)(e, t.peerId, t) &&
            f.push("nim-dialog_unrespond"), getTemplate("im_drow", {
                peer: t.peerId,
                msg_id: o.messageId,
                photo: i,
                user_link: s,
                date: o.date ? getShortDateOrTime(o.date, 0, !0, getLang("months_sm_of", "raw")) : "",
                body: d,
                unread: c,
                more: f.join(" "),
                is_online: onlinePlatformClass(t.online),
                is_unread: c > 0 && l & Z.eventTypes.FLAG_UNREAD ? "nim-dialog_unread" : "",
                is_unread_out: l & Z.eventTypes.FLAG_UNREAD && l & Z.eventTypes.FLAG_OUTBOUND && !(0, z.isSelfMessage)(t.peerId, e.get()
                    .gid) ? "nim-dialog_unread-out" : "",
                is_selected: r.noselect || t.peerId != e.get()
                    .peer ? "" : "nim-dialog_selected _im_dialog_selected"
            })
    }

    function m(e, t, n, r, a) {
        if (!t.deletedDialog) {
            var i = _(t),
                s = i.flags,
                o = p(t, n),
                l = u(t.peerId, t, (0, z.isClassicInterface)(n)),
                c = l.photo,
                d = i.date ? getShortDateOrTime(i.date, 0, !0, getLang("months_sm_of", "raw")) : "";
            val(geByClass1("_dialog_body", e), o), val(geByClass1("_im_dialog_date", e), d), val(geByClass1("_im_dialog_unread_ct", e), t.unread ? t.unread : ""), val(
                geByClass1("_im_dialog_link", e), t.tab);
            var g = geByClass1("_im_dialog_photo", e);
            g.innerHTML !== c && val(g, c), toggleClass(e, "nim-dialog_verified", !!t.verified), toggleClass(e, "nim-dialog_starred", t.folders & Z.eventTypes.FOLDER_IMPORTANT),
                toggleClass(e, "nim-dialog_muted", inArray(t.peerId, n.get()
                    .mutedPeers)), toggleClass(e, "nim-dialog_unrespond", (0, z.isUnrespond)(n, t.peerId, t)), toggleClass(e, "nim-dialog_classic", (0, z.isClassicInterface)
                    (n)), toggleOnline(geByClass1("_im_peer_online", e), t.online), t.unread > 0 && s & Z.eventTypes.FLAG_UNREAD && addClass(e, "nim-dialog_unread"),
                toggleClass(e, "nim-dialog_empty", -1 === i.messageId), s & Z.eventTypes.FLAG_UNREAD && s & Z.eventTypes.FLAG_OUTBOUND && !(0, z.isSelfMessage)(t.peerId, n
                    .get()
                    .gid) && addClass(e, "nim-dialog_unread-out"), a && setTimeout(function() {
                    addClass(geByClass1("_im_dialog_" + t.peerId, r), "nim-dialog_injected")
                }, 100)
        }
    }

    function p(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = n || _(e);
        if ((0, z.isPeerBlocked)(e.peerId, t)) {
            var a = t.get()
                .block_states[e.peerId].name,
                i = getLang("mail_community_answering")
                .replace("{username}", a);
            return getTemplate("im_drow_prebody", {
                prebody: i,
                body: ""
            })
        }
        return (0, z.isServiceMsg)(r) ? (0, z.renderServiceMsg)(r, e, !1) : d(r.flags, e, e.peerId, r.userId, !0, r.attaches, r.text, r.subject, (0, z.isCommunityInterface)
            (t), t.get()
            .author_photo)
    }

    function _(e) {
        var t = e.lastmsg_meta;
        if (isArray(t) && (t = (0, W.addMessageEvent)([4].concat(t))), !t) {
            var n = "";
            return (0, z.isChatPeer)(e.peer) || (n = e.online ? getLang("global_online_sm") : getLang("mail_offline")), (0, W.addMessageEvent)([4, -1, 0, e.peer, "", "", n, {}, -
                1
            ])
        }
        return t
    }

    function v(e, t, n, r, a) {
        var i = geByClass1("_dialog_body", t);
        addClass(t, "nim-dialog_deleted"), removeClass(t, "_im_dialog"), val(i, getTemplate("im_delete_actions", {
            text: langNumeric(n, getLang("mail_im_X_message_deleted", "raw")),
            peer: e,
            spam_id: r
        }))
    }

    function h(e, t, n) {
        var r = (0, z.showFlushDialog)(t, function(a) {
            n()
                .updateMenu(e), (0, z.cleanHistory)(e, r, n, G.flushHistory, t)
        })
    }

    function b(e, t, n, r, a) {
        var i = gpeByClass("_im_dialog", a, n);
        if (i) {
            var s = intval(domData(i, "peer"));
            (0, z.isClassicInterface)(t) ? (0, G.deleteDialog)(s, t.get())
            .then(function(n) {
                var r = U(n, 2),
                    a = r[0],
                    o = r[1];
                a ? (v(s, i, a, o, t), e()
                    .updateMenu(t)) : h(t, s, e)
            }): h(t, s, e)
        }
        return !1
    }

    function y(e, t) {
        var n = c(e),
            r = [];
        return (0, z.isClassicInterface)(e) && r.push("nim-dialog_classic"), r.push("nim-dialog_empty"), getTemplate("im_drow", {
            peer: t.peerId,
            msg_id: t.lastmsg,
            photo: (0, z.renderPhotos)(t.photo),
            user_link: "<span>" + t.name + "</span>",
            date: "",
            body: "",
            unread: "",
            is_star: "",
            is_unread: "nim-dialog_prep-injected",
            is_unread_out: "",
            more: r.join(" "),
            is_online: onlinePlatformClass(t.online),
            is_selected: t.peerId == e.get()
                .peer && n ? "nim-dialog_selected _im_dialog_selected" : ""
        })
    }

    function C(e) {
        var t = e.get()
            .gid ? "mail_search_only_messages_comm" : "mail_search_only_messages",
            n = getLang(t);
        return '<li class="im-page--mess-search-w">\n    <div class="im-page--mess-search ' + X + '">\n      ' + n + "\n    </div>\n  </li>"
    }

    function T(e) {
        return getTemplate("im_dialogs_none", {
            msg: e || getLang("mail_im_search_empty")
        })
    }

    function E(e, t) {
        return !e.get()
            .unread_only || t.unread > 0
    }

    function w(e, t) {
        if ("sep" === t.type) return (0, z.renderMessagesSearch)();
        if ("empty_dialogs" === t.type) return getTemplate("im_dialogs_none", {
            msg: getLang("mail_dialogs_list_empty")
        });
        if ("empty" === t.type) return T(t.lang);
        if ("only_mes" === t.type) return C(e);
        var n = e.get()
            .tabs_cache || {};
        return t.local_index && !n[t.peerId] ? y(e, t) : (t.local_index && (t = n[t.peerId]), t.message ? f(e, t, t.message, {
            noselect: !0,
            search: !0
        }) : f(e, t))
    }

    function S(e, t, n, r, a, i) {
        var s = intval(domData(i, "peer")),
            o = domData(i, "action"),
            l = domData(i, "sid"),
            u = geByClass1("_im_dialog_" + s, t),
            c = intval(domData(i, "spam"));
        switch (o) {
            case "restore":
                u && e.set(G.restoreDialog.bind(null, s, l, c))
                    .then(function() {
                        addClass(u, "_im_dialog"), removeClass(u, "nim-dialog_deleted"), m(u, e.get()
                                .tabs[s], e, t, !1), r()
                            .updateMenu(e)
                    });
                break;
            case "spam":
                var d = getLang("mail_im_dialog_marked_spam") +
                    '\n        <button type="button" class="nim-dialog--daction nim-dialog--daction_last _im_dialog_daction"\n          data-action="restore"\n          data-spam="1"\n          data-sid="' +
                    l + '" data-peer="' + s + '">\n            ' + getLang("mail_restore") + "\n        </button>";
                if (u) {
                    var g = geByClass1("_dialog_body", u);
                    val(g, d), (0, G.spamDialog)(s, l, e.get())
                }
                break;
            case "block":
                var f = (0, z.showBlacklistBox)(s, e);
                f.once("success", function() {
                    e.set(G.flushHistory.bind(null, s))
                        .then(function() {
                            n()
                                .restoreDialogs(e)
                        })
                })
        }
    }

    function k(e, t) {
        return e.map(function(e) {
                return (0, W.addMessageEvent)([4].concat(e))
            })
            .map(function(e) {
                return extend({}, t[e.peerId], {
                    message: e
                })
            })
    }

    function I() {
        return {
            type: "only_mes",
            peerId: "00001"
        }
    }

    function P(e) {
        return {
            type: "empty",
            peerId: "empty",
            lang: e
        }
    }

    function L(e) {
        return 0 === e.length ? e : [I()].concat(e)
    }

    function A(e, t, n) {
        return t()
            .toggleSettingsLoader(n, !0), e.checkMore(!(0, z.isClassicInterface)(n))
            .then(t()
                .toggleSettingsLoader.bind(null, n, !1))
    }

    function D(e, t) {
        var n = e.get()
            .msg_local_ids_sort && e.get()
            .msg_local_ids_sort[t.lastmsg];
        return "undefined" != typeof n ? 2e9 + n : t.lastmsg
    }

    function M(e, t, n, r) {
        var a = gpeByClass("_im_dialog", r, t),
            i = intval(domData(a, "peer"));
        return e.set(G.toggleDialogImportant.bind(null, i)), setTimeout(function() {
            B(e, t, n, r)
        }, 100), !1
    }

    function x(e, t, n) {
        return t.message && n.message ? n.message.messageId - t.message.messageId : t.message && !n.message ? 1 : n.message && !t.message ? -1 : D(e, n) - D(e, t)
    }

    function O(e, t) {
        for (; !hasClass(e, "_im_dialog") && e;) e = t(e);
        return e
    }

    function B(e, t, n, r) {
        var a = r.getBoundingClientRect()
            .top;
        showTooltip(r, {
            text: function() {
                var n = gpeByClass("_im_dialog", r, t),
                    a = domData(n, "peer");
                return e.get()
                    .tabs[a].folders & Z.eventTypes.FOLDER_IMPORTANT ? getLang("mail_im_toggle_important_off") : getLang("mail_im_toggle_important")
            },
            black: 1,
            zIndex: 1,
            shift: [14, 8],
            toup: a > 150
        })
    }

    function F(e, t, n, r, a) {
        var i = gpeByClass("_im_dialog", a, t),
            s = intval(domData(i, "peer")),
            o = e.get()
            .tabs[s].lastmsg;
        return e.set(G.markDialogAnswered.bind(null, s, o))
            .then(function() {
                m(i, e.get()
                        .tabs[s], e, t), n()
                    .restoreDialogs(e)
            }), showDoneBox(getLang("mail_marked_as_answered"), {
                out: 1e3
            }), !1
    }

    function N(e, t, n, r, a, s, l) {
        return {
            selectPeer: function(t, n) {
                for (var r = geByClass("_im_dialog", e), a = n.get()
                        .peer, s = 0; s < r.length; s++) {
                    var o = r[s],
                        l = intval(domData(o, "peer")),
                        u = intval(domData(o, "msgid"));
                    l === a && (!i(o) || t === u && i(o)) ? (addClass(o, "nim-dialog_selected"), addClass(o, "_im_dialog_selected")) : hasClass(o,
                        "_im_dialog_selected") && (removeClass(o, "nim-dialog_selected"), removeClass(o, "_im_dialog_selected"))
                }
            },
            appendFastDialogs: function(t, n, r) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), s.saveScroll("list"), r ? (s.reset(), n = L(n), s.pipeReplace(Promise.resolve(n))) : s.pipe(
                    Promise.resolve(n)), s.toTop()
            },
            deactivate: function() {
                s.deactivate()
            },
            activate: function() {
                s.activate()
            },
            hoverDialog: function(t, n) {
                var r = geByClass1("_im_dialog_hovered", e);
                r || (r = geByClass1("_im_dialog_selected", e));
                var a;
                if (r) {
                    var i = "next" === t ? domNS : domPS,
                        o = i(r),
                        a = O(o, i);
                    if (!a) return;
                    removeClass(r, "_im_dialog_hovered"), removeClass(r, "nim-dialog_hovered")
                } else a = O(e.firstElementChild, domNS);
                if (a) {
                    addClass(a, "_im_dialog_hovered"), addClass(a, "nim-dialog_hovered");
                    var l = geByClass1("_im_mess_search", e);
                    s.scrollTo(intval(domData(a, "peer")), !1, l ? $ + 37 : $, l ? 37 : 0)
                }
            },
            selectHoveredDialog: function(t) {
                var n = geByClass1("_im_dialog_hovered", e);
                n || (n = geByClass1("_im_dialog", e)), o(l, t, s, {}, n)
            },
            appendSearch: function(t, n, r) {
                var a = k(r, n);
                r.length > 0 ? (addClass(e.parentNode, "im-page--dialogs_with-mess"), s.pipe(Promise.resolve([{
                    type: "sep",
                    peerId: "000"
                }].concat(a)))) : (0 === s.getCurrentElements()
                    .length && s.pipeReplace(Promise.resolve([P()])), removeClass(e.parentNode, "im-page--dialogs_with-mess"))
            },
            updateDialog: function(t, n) {
                var r = geByClass1("_im_dialog_" + t);
                r && m(r, n.get()
                    .tabs[t], n, e)
            },
            focusOnSelected: function(e) {
                var t = e.get()
                    .peer;
                if (t) {
                    var n = geByClass1("_im_dialog_" + t);
                    n ? s.scrollTop(n.offsetTop - n.offsetHeight) : s.toTop()
                }
            },
            restoreScroll: function(e) {
                var t = s.restoreScroll("list");
                t || s.toTop()
            },
            restoreDialogs: function(t, n, r) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), 0 !== R(t)
                    .length || s.isLoading() || (n = !0), n && s.reset(), r && s.wipe(), s.pipeReplace(Promise.resolve(R(t)))
                    .then(function(e) {
                        if (!(!n || (0, z.isClassicInterface)(t) && t.get()
                                .peer)) {
                            var r = A(s, l, t);
                            return s.toTop(), r
                        }(0, z.isClassicInterface)(t) || s.restoreScroll("list")
                    })
            },
            appendDialogs: function(t, n) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), n.forEach(function(n) {
                    var r = geByClass1("_im_dialog_" + n.peerId, e);
                    r && m(r, n, t, e, !0)
                }), n = L(n), s.isEmpty() && 0 === n.length && (0, z.isPendingForward)(t) && (n = [P(getLang("mail_im_search_empty_chats"))]), s.replacePreserveOrder(
                    n)
            },
            updateCounter: function(t, n) {
                var r = geByClass1("_im_dialog_" + n.peerId, e);
                if (r && !i(r)) {
                    var a = t.get()
                        .tabs[n.peerId],
                        s = a.unread > 0 ? a.unread : "";
                    val(geByClass1("_im_dialog_unread_ct", r), s), s ? addClass(r, "nim-dialog_unread") : removeClass(r, "nim-dialog_unread"), a.lastmsg > a.out_up_to &&
                        !a.unread && a.lastmsg_meta.flags & Z.eventTypes.FLAG_OUTBOUND ? addClass(r, "nim-dialog_unread-out") : removeClass(r, "nim-dialog_unread-out")
                }
            },
            removeDialog: function(e, t) {
                s.remove(t)
            },
            updateOnline: function(t, n) {
                var r = geByClass1("_im_dialog_" + t, e);
                if (r) {
                    var a = n.get()
                        .tabs[t],
                        i = geByClass1("_im_peer_online", r);
                    toggleOnline(i, a.online)
                }
            },
            scrollUp: function(e) {
                s.toTop(e), s.saveScroll("list", !0)
            },
            saveScroll: function(e) {
                s.saveScroll("list", !0)
            },
            promoteDialog: function(t, n) {
                var a = geByClass1("_im_dialog_" + n.peerId, e);
                if ((!a || i(a)) && t.get()
                    .searchText) return void s.unsetScroll("list");
                var o = t.get()
                    .tabs[n.peerId];
                E(t, o) && (s.pipeReplace(Promise.resolve(R(t)), void 0, !0)
                    .then(function(r) {
                        var i = U(r, 1),
                            s = i[0];
                        !inArray(n.peerId, s) && a && m(a, t.get()
                            .tabs[n.peerId], t, e)
                    }), r()
                    .updateTyping(n, t))
            },
            removeSelection: function(t) {
                var n = t.get()
                    .peer;
                removeClass(geByClass1("_im_dialog_" + n, e), "nim-dialog_selected")
            },
            updateScroll: function() {
                s.updateScroll()
            },
            updateTyping: function(t, n) {
                var r = geByClass1("_im_dialog_" + t.peerId, e);
                if (r && !i(r) && !n.get()
                    .tabs[t.peerId].deletedDialog) {
                    var a = geByClass1("_im_dialog_typing", r),
                        s = (0, z.formatTyper)(n.get()
                            .tabs[t.peerId].typing, t.peerId, !0, n.get(), 1);
                    val(a, s), toggleClass(r, "nim-dialog_typing", s)
                }
            },
            unmount: function() {
                s.unmount(), (0, H.removeDelegateEvent)(e, "click", "_im_dialog", t), (0, H.removeDelegateEvent)(e, "mouseover", "_im_dialog_close", n), (0, H.removeDelegateEvent)
                    (e, "click", "__im_dialog_close", a)
            }
        }
    }

    function R(e) {
        var t = e.get()
            .active_tab,
            n = e.get()
            .dialog_tabs[t],
            r = e.get()
            .tabs;
        return n.map(function(e) {
                return r[e]
            })
            .sort(x.bind(null, e))
    }

    function j(e, t, n) {
        var r = (0, Y.createMutations)(N),
            i = r.callMutations,
            l = r.bindMutations,
            u = b.bind(null, n, t, e),
            c = function(e, t) {
                var n = t.getBoundingClientRect()
                    .top;
                showTooltip(t, {
                    text: getLang("mail_delete"),
                    black: 1,
                    center: !0,
                    shift: [1, 10],
                    toup: n > 150,
                    zIndex: 1
                })
            },
            d = function(e, t) {
                var n = t.getBoundingClientRect()
                    .top;
                showTooltip(t, {
                    text: getLang("mail_end_conversation"),
                    black: 1,
                    center: !0,
                    zIndex: 1,
                    shift: [1, 4],
                    toup: n > 150
                })
            },
            g = B.bind(null, t, e),
            f = M.bind(null, t, e),
            m = F.bind(null, t, e, i),
            p = geByClass1("_im_dialogs_search"),
            _ = {
                idFn: function(e) {
                    return e.message ? e.message.messageId : e.peerId
                },
                renderFn: w.bind(null, t),
                more: s.bind(null, t, i),
                onScroll: (0, z.isClassicInterface)(t) ? function() {
                    var e = bodyNode.scrollTop || document.documentElement.scrollTop;
                    0 >= e && !layers.visible && browser.safari ? addClass(p, "im-page--header_static") : removeClass(p, "im-page--header_static")
                } : !1
            },
            v = (0, Q.mount)(e, (0, K["default"])({
                limit: 40,
                offset: 0,
                nativeScroll: !!(0, z.isClassicInterface)(t),
                height: V,
                elements: R(t)
            }), function(e) {
                return _
            }),
            h = o.bind(null, n, t, v),
            y = a.bind(null, t, e, v),
            C = S.bind(null, t, e, i, n);
        return (0, H.addDelegateEvent)(e, "click", "_im_dialog_close", u), (0, H.addDelegateEvent)(e, "click", "_im_dialog_markre", m), (0, H.addDelegateEvent)(e, "click",
                J, f), (0, H.addDelegateEvent)(e, "click", "_im_dialog", h), (0, H.addDelegateEvent)(e, "click", X, y), (0, H.addDelegateEvent)(e, "mouseover",
                "_im_dialog_close", c), (0, H.addDelegateEvent)(e, "mouseover", "_im_dialog_markre", d), (0, H.addDelegateEvent)(e, "mouseover", J, g), (0, H.addDelegateEvent)
            (e, "click", ee, C), addEvent(e, "mouseover", throttle(function() {
                var t = geByClass("_im_dialog_hovered", e);
                t.forEach(function(e) {
                    removeClass(e, "_im_dialog_hovered"), removeClass(e, "nim-dialog_hovered")
                })
            }, 100)), l(e, h, c, i, u, v, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var U = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    t.mount = j;
    var H = (n(4), n(5)),
        G = n(73),
        z = n(81),
        q = n(76),
        K = r(q),
        Q = n(83),
        W = n(77),
        Y = n(85),
        Z = n(75),
        V = 64,
        $ = 45,
        X = "_im_mess_search",
        J = "_im_dialog_star",
        ee = "_im_dialog_daction"
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
            var i, s = Date.now(),
                o = n.timeout || 60,
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
                Date.now() - s > 1e3 * o && (a("", {}), clearInterval(i))
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
                    var i, s = o(n[a], 2),
                        l = s[0],
                        u = s[1];
                    if (hasClass(e.target, l) ? i = u(e, e.target) : (r = gpeByClass(l, e.target, e.currentTarget)) && (i = u(e, r)), i === !1) break
                }
        }
    }

    function i(e, t, n, r) {
        var i = c.get(e);
        i || (c.set(e, {}), i = c.get(e));
        for (var s = t.split(" "), o = 0; o < s.length; o++) {
            var l = s[o];
            i[l] || (i[l] = [], addEvent(e, l, a)), i[l].push([n, r])
        }
    }

    function s(e, t, n, r) {
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
    var o = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    t.addDelegateEvent = i, t.removeDelegateEvent = s;
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
        s = function(e, t) {
            try {
                return e[t]
            } catch (n) {}
        };
    e.exports = function(e) {
        var t, n, o;
        return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof(n = s(t = Object(e), a)) ? n : i ? r(t) : "Object" == (o = r(t)) && "function" ==
            typeof t.callee ? "Arguments" : o
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
        s = "function" == typeof i;
    e.exports = function(e) {
        return r[e] || (r[e] = s && i[e] || (s ? i : a)("Symbol." + e))
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
        s = n(13)("src"),
        o = "toString",
        l = Function[o],
        u = ("" + l)
        .split(o);
    n(26)
        .inspectSource = function(e) {
            return l.call(e)
        }, (e.exports = function(e, t, n, o) {
            var l = "function" == typeof n;
            l && (i(n, "name") || a(n, "name", t)), e[t] !== n && (l && (i(n, s) || a(n, s, e[t] ? "" + e[t] : u.join(String(t)))), e === r ? e[t] = n : o ? e[t] ? e[t] =
                n : a(e, t, n) : (delete e[t], a(e, t, n)))
        })(Function.prototype, o, function() {
            return "function" == typeof this && this[s] || l.call(this)
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
        s = Object.defineProperty;
    t.f = n(20) ? Object.defineProperty : function(e, t, n) {
        if (r(e), t = i(t, !0), r(n), a) try {
            return s(e, t, n)
        } catch (o) {}
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
            var i, s, o = String(a(t)),
                l = r(n),
                u = o.length;
            return 0 > l || l >= u ? e ? "" : void 0 : (i = o.charCodeAt(l), 55296 > i || i > 56319 || l + 1 === u || (s = o.charCodeAt(l + 1)) < 56320 || s >
                57343 ? e ? o.charAt(l) : i : e ? o.slice(l, l + 2) : (i - 55296 << 10) + (s - 56320) + 65536)
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
        s = n(15),
        o = n(25),
        l = n(36),
        u = n(37),
        c = n(50),
        d = n(51),
        g = n(10)("iterator"),
        f = !([].keys && "next" in [].keys()),
        m = "@@iterator",
        p = "keys",
        _ = "values",
        v = function() {
            return this
        };
    e.exports = function(e, t, n, h, b, y, C) {
        u(n, t, h);
        var T, E, w, S = function(e) {
                if (!f && e in L) return L[e];
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
            I = b == _,
            P = !1,
            L = e.prototype,
            A = L[g] || L[m] || b && L[b],
            D = A || S(b),
            M = b ? I ? S("entries") : D : void 0,
            x = "Array" == t ? L.entries || A : A;
        if (x && (w = d(x.call(new e)), w !== Object.prototype && (c(w, k, !0), r || o(w, g) || s(w, g, v))), I && A && A.name !== _ && (P = !0, D = function() {
                return A.call(this)
            }), r && !C || !f && !P && L[g] || s(L, g, D), l[t] = D, l[k] = v, b)
            if (T = {
                    values: I ? D : S(_),
                    keys: y ? D : S(p),
                    entries: M
                }, C)
                for (E in T) E in L || i(L, E, T[E]);
            else a(a.P + a.F * (f || P), t, T);
        return T
    }
}, function(e, t) {
    e.exports = !1
}, function(e, t, n) {
    var r = n(12),
        a = n(26),
        i = n(15),
        s = n(14),
        o = n(34),
        l = "prototype",
        u = function(e, t, n) {
            var c, d, g, f, m = e & u.F,
                p = e & u.G,
                _ = e & u.S,
                v = e & u.P,
                h = e & u.B,
                b = p ? r : _ ? r[t] || (r[t] = {}) : (r[t] || {})[l],
                y = p ? a : a[t] || (a[t] = {}),
                C = y[l] || (y[l] = {});
            p && (n = t);
            for (c in n) d = !m && b && void 0 !== b[c], g = (d ? b : n)[c], f = h && d ? o(g, r) : v && "function" == typeof g ? o(Function.call, g) : g, b && s(b, c, g,
                e & u.U), y[c] != g && i(y, c, f), v && C[c] != g && (C[c] = g)
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
        s = {};
    n(15)(s, n(10)("iterator"), function() {
        return this
    }), e.exports = function(e, t, n) {
        e.prototype = r(s, {
            next: a(1, n)
        }), i(e, t + " Iterator")
    }
}, function(e, t, n) {
    var r = n(17),
        a = n(39),
        i = n(48),
        s = n(47)("IE_PROTO"),
        o = function() {},
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
        return null !== e ? (o[l] = r(e), n = new o, o[l] = null, n[s] = e) : n = u(), void 0 === t ? n : a(n, t)
    }
}, function(e, t, n) {
    var r = n(16),
        a = n(17),
        i = n(40);
    e.exports = n(20) ? Object.defineProperties : function(e, t) {
        a(e);
        for (var n, s = i(t), o = s.length, l = 0; o > l;) r.f(e, n = s[l++], t[n]);
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
        s = n(47)("IE_PROTO");
    e.exports = function(e, t) {
        var n, o = a(e),
            l = 0,
            u = [];
        for (n in o) n != s && r(o, n) && u.push(n);
        for (; t.length > l;) r(o, n = t[l++]) && (~i(u, n) || u.push(n));
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
        return function(t, n, s) {
            var o, l = r(t),
                u = a(l.length),
                c = i(s, u);
            if (e && n != n) {
                for (; u > c;)
                    if (o = l[c++], o != o) return !0
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
        s = Object.prototype;
    e.exports = Object.getPrototypeOf || function(e) {
        return e = a(e), r(e, i) ? e[i] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? s : null
    }
}, function(e, t, n) {
    var r = n(30);
    e.exports = function(e) {
        return Object(r(e))
    }
}, function(e, t, n) {
    for (var r = n(54), a = n(14), i = n(12), s = n(15), o = n(36), l = n(10), u = l("iterator"), c = l("toStringTag"), d = o.Array, g = ["NodeList", "DOMTokenList",
            "MediaList", "StyleSheetList", "CSSRuleList"
        ], f = 0; 5 > f; f++) {
        var m, p = g[f],
            _ = i[p],
            v = _ && _.prototype;
        if (v) {
            v[u] || s(v, u, d), v[c] || s(v, c, p), o[p] = d;
            for (m in r) v[m] || a(v, m, r[m], !0)
        }
    }
}, function(e, t, n) {
    "use strict";
    var r = n(55),
        a = n(56),
        i = n(36),
        s = n(42);
    e.exports = n(31)(Array, "Array", function(e, t) {
        this._t = s(e), this._i = 0, this._k = t
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
        s = n(34),
        o = n(60),
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
                o(e, d, t, "_i"), e._i = a(null), e._f = void 0, e._l = void 0, e[p] = 0, void 0 != r && u(r, n, e[c], e)
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
                    o(this, d, "forEach");
                    for (var t, n = s(e, arguments.length > 1 ? arguments[1] : void 0, 3); t = t ? t.n : this._f;)
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
        s = n(17),
        o = n(45),
        l = n(64);
    e.exports = function(e, t, n, u, c) {
        var d, g, f, m = c ? function() {
                return e
            } : l(e),
            p = r(n, u, t ? 2 : 1),
            _ = 0;
        if ("function" != typeof m) throw TypeError(e + " is not iterable!");
        if (i(m))
            for (d = o(e.length); d > _; _++) t ? p(s(g = e[_])[0], g[1]) : p(e[_]);
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
            var s = e["return"];
            throw void 0 !== s && r(s.call(e)), i
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
        s = n(10)("species");
    e.exports = function(e) {
        var t = r[e];
        i && t && !t[s] && a.f(t, s, {
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
        s = n(16)
        .f,
        o = 0,
        l = Object.isExtensible || function() {
            return !0
        },
        u = !n(21)(function() {
            return l(Object.preventExtensions({}))
        }),
        c = function(e) {
            s(e, r, {
                value: {
                    i: "O" + ++o,
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
        s = n(59),
        o = n(66),
        l = n(61),
        u = n(60),
        c = n(18),
        d = n(21),
        g = n(68),
        f = n(50),
        m = n(69);
    e.exports = function(e, t, n, p, _, v) {
        var h = r[e],
            b = h,
            y = _ ? "set" : "add",
            C = b && b.prototype,
            T = {},
            E = function(e) {
                var t = C[e];
                i(C, e, "delete" == e ? function(e) {
                    return v && !c(e) ? !1 : t.call(this, 0 === e ? 0 : e)
                } : "has" == e ? function(e) {
                    return v && !c(e) ? !1 : t.call(this, 0 === e ? 0 : e)
                } : "get" == e ? function(e) {
                    return v && !c(e) ? void 0 : t.call(this, 0 === e ? 0 : e)
                } : "add" == e ? function(e) {
                    return t.call(this, 0 === e ? 0 : e), this
                } : function(e, n) {
                    return t.call(this, 0 === e ? 0 : e, n), this
                })
            };
        if ("function" == typeof b && (v || C.forEach && !d(function() {
                (new b)
                .entries()
                    .next()
            }))) {
            var w = new b,
                S = w[y](v ? {} : -0, 1) != w,
                k = d(function() {
                    w.has(1)
                }),
                I = g(function(e) {
                    new b(e)
                }),
                P = !v && d(function() {
                    for (var e = new b, t = 5; t--;) e[y](t, t);
                    return !e.has(-0)
                });
            I || (b = t(function(t, n) {
                u(t, b, e);
                var r = m(new h, t, b);
                return void 0 != n && l(n, _, r[y], r), r
            }), b.prototype = C, C.constructor = b), (k || P) && (E("delete"), E("has"), _ && E("get")), (P || S) && E(y), v && C.clear && delete C.clear
        } else b = p.getConstructor(t, e, _, y), s(b.prototype, n), o.NEED = !0;
        return f(b, e), T[e] = b, a(a.G + a.W + a.F * (b != h), T), v || p.setStrong(b, e, _), b
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
    } catch (s) {}
    e.exports = function(e, t) {
        if (!t && !a) return !1;
        var n = !1;
        try {
            var i = [7],
                s = i[r]();
            s.next = function() {
                n = !0
            }, i[r] = function() {
                return s
            }, e(i)
        } catch (o) {}
        return n
    }
}, function(e, t, n) {
    var r = n(18),
        a = n(70)
        .set;
    e.exports = function(e, t, n) {
        var i, s = t.constructor;
        return s !== n && "function" == typeof s && (i = s.prototype) !== n.prototype && r(i) && a && a(e, i), e
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
        s = n(23),
        o = n(25),
        l = n(19),
        u = Object.getOwnPropertyDescriptor;
    t.f = n(20) ? u : function(e, t) {
        if (e = i(e), t = s(t, !0), l) try {
            return u(e, t)
        } catch (n) {}
        return o(e, t) ? a(!r.f.call(e, t), e[t]) : void 0
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
                    return (0, St.isFullyLoadedTab)(e, t)
                });
            e.renew_hashes = (0, yt.post)(kt, {
                    act: "a_renew_hash",
                    peers: n.join(","),
                    gid: e.gid
                })
                .then(function(t) {
                    var r = bt(t, 1),
                        a = r[0];
                    return n.forEach(function(t) {
                        e.tabs[t].hash = a[t]
                    }), delete e.renew_hashes, e.last_hashes_update = Date.now(), e
                })
        }
        return e.renew_hashes
    }

    function s(e, t, n) {
        return a(e)
            .then(function(r) {
                return r ? t.apply(null, n) : i(e)
                    .then(function(e) {
                        return t.apply(null, n)
                    })
            })
    }

    function o(e) {
        return function() {
            var t = arguments,
                n = t[t.length - 1];
            return e.apply(null, t)["catch"](function(r) {
                if (r && r.match && r.match(/1001;/)) return s(n, e, t);
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

    function c(e, t) {
        return t.block_states = extend(t.block_states, e), Promise.resolve(t)
    }

    function d(e, t, n, r, a) {
        return a.tabHistoryNotChanged = !1, (0, yt.post)(kt, {
                act: "a_start",
                peer: e,
                msgid: n,
                history: t,
                prevpeer: a.prevPeer,
                gid: a.gid,
                block: r
            })
            .then(function(t) {
                var r = bt(t, 4),
                    i = r[0],
                    s = r[1],
                    o = r[2],
                    l = r[3];
                if (a.tabs || (a.tabs = {}), a.dialog_tab_cts = l, a.tabs[e] || (a.tabs[e] = {}), c(o, a), n) {
                    if (a.tabs[e]) {
                        var u = a.tabs[e].lastmsg,
                            d = a.tabs[e].lastmsg_meta;
                        extend(a.tabs[e], i), a.tabs[e].lastmsg = u, a.tabs[e].lastmsg_meta = d
                    }
                } else extend(a.tabs[e], i);
                a.admins = extend(a.admins, s);
                a.imQueue(e, !1);
                return f(e, a)
            })
    }

    function g(e, t) {
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
                return !g(r, e.rid)
            });
        return r.msgs = a.reduce(function(e, t) {
            return e["rid" + t.rid] = [1, 0, 0, 1, intval(t.rid)], e
        }, r.msgs), t.imQueueSet(e, a), t.tabs[e].history = (0, St.restoreQueue)(a, t, l(t.tabs[e].history)), Promise.resolve(t)
    }

    function m(e, t, n) {
        var r = n.imQueue(e, !1)
            .filter(function(e) {
                return e.failed && e.mess.messageId !== t
            });
        return n.imQueueSet(e, r), n.tabs[e].history = (0, St.removeMessages)([t], l(n.tabs[e].history)), Promise.resolve(n)
    }

    function p(e) {
        return "im_draft" + vk.id + "_" + e
    }

    function _(e) {
        return "im_draft" + vk.id + "_" + e
    }

    function v(e) {
        return "peerFwd_" + vk.id + "_" + e
    }

    function h(e, t) {
        return (t.block_states[e] || {})
            .free === !1 ? Promise.resolve(t) : (0, yt.post)(kt, {
                act: "a_block",
                peer: e,
                prevPeer: t.prevPeer,
                gid: t.gid
            })
            .then(function(e) {
                var n = bt(e, 1),
                    r = n[0];
                return c(r, t)
            })
    }

    function b(e, t) {
        var n = t.peer;
        return Promise.resolve(t)
            .then(function(t) {
                return t.tabHistoryNotChanged = !1, (0, St.isFullyLoadedTab)(t, n) && !t.tabs[n].skipped ? (t.gid && h(n, t), Promise.resolve(t)
                    .then(T)) : d(n, e, !1, !0, t)
            })
            .then(T)
    }

    function y(e, t, n) {
        var r = n.msgid,
            a = n.peer;
        return !e && (0, St.isFullyLoadedTab)(n, a) && n.tabs[a].msgs[r] ? (t === n.peer ? n.tabHistoryNotChanged = !0 : n.tabHistoryNotChanged = !1, n.gid && h(a, n),
                Promise.resolve(n)
                .then(T)) : d(a, !0, r, !0, n)
            .then(T)
    }

    function C(e, t, n) {
        if ($e(n)) throw showFastBox({
            title: getLang("global_error"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, getLang("mail_message_wait_until_uploaded")), new Error("Cant change peer while loading somethind");
        var r = n.gid ? "gim" + n.gid : "im";
        if (n.prevPeer = n.peer, n.peer = e, n.msgid = t || "", cur.peer = e, Lt({
                sel: e ? (0, St.convertPeerToUrl)(e) : null,
                msgid: n.msgid,
                email: "",
                0: r
            }), 0 !== e) {
            var a = [];
            a = n.tabbedPeers.map(function(e) {
                    return e.peer
                })
                .indexOf(e) < 0 ? [{
                    peer: e,
                    type: "perm"
                }].concat(n.tabbedPeers) : n.tabbedPeers.map(function(t) {
                    return t.peer == e && "perm" !== t.type && (t.type = "perm"), t
                }), vt(a, !1, n)
        } else vt(n.tabbedPeers, !1, n);
        return At(), ve(n.prevPeer, n)
    }

    function T(e) {
        var t = e.peer;
        if (0 === t) return Promise.resolve(e);
        var n = e.tabs[t],
            r = n.data,
            a = [],
            i = e.mutedPeers;
        n.offset && a.push("photos"), n.offset && a.push("search"), (-2e9 > t || n.offset) && a.push("clear"), e.gid && a.push("block"), !(0, St.isChatPeer)(t) || r.kicked ||
            r.closed || (inArray(t, i) ? a.push("unmute") : a.push("mute")), (0, St.isUserPeer)(t) && !e.gid && !n.blacklisted && n.is_friend && a.push("invite");
        var s = r ? r.actions : {},
            o = (0, St.chatActions)(e, s);
        return (0, St.isChatPeer)(t) && n.data.closed && (delete o.invite, s = extend({}, s), delete s.invite), e.curActions = a.concat(Object.keys(s))
            .sort(function(e, t) {
                return Dt[e] - Dt[t]
            })
            .reduce(function(e, t) {
                return e[t] = o[t], e
            }, {}), Promise.resolve(e)
    }

    function E(e, t, n) {
        var r = n.tabs[n.peer];
        return (0, yt.post)(kt, {
                peer: n.peer,
                whole: e,
                act: "a_history",
                offset: r.offset + (r.skipped || 0),
                toend: t,
                gid: n.gid
            })
            .then(function(e) {
                var t = bt(e, 4),
                    a = t[0],
                    i = t[1],
                    s = t[2],
                    o = t[3];
                return r.allShown = s, n.admins = extend(n.admins, o), r.history = a + u(r.history), r.historyToAppend = a, r.offset += Object.keys(i)
                    .length, r.msgs = extend(r.msgs, i), n
            })
    }

    function w(e) {
        var t = e.tabs[e.peer];
        return (0, yt.post)(kt, {
                peer: e.peer,
                act: "a_history",
                rev: 1,
                offset: t.skipped,
                gid: e.gid
            })
            .then(function(n) {
                var r = bt(n, 5),
                    a = r[0],
                    i = r[1],
                    s = r[2];
                r[3], r[4];
                return t.allShown = s, t.history = u(t.history) + a, t.historyToAppend = a, t.skipped -= Object.keys(i)
                    .length, t.msgs = extend(t.msgs, i), e
            })
    }

    function S(e, t, n, r) {
        var a = e.tabs[t];
        for (var i in a.msgs) {
            var s = a.msgs[i][0] ? Tt.eventTypes.FLAG_OUTBOUND : 0;
            n >= i && s === r && (a.msgs[i][1] = 0)
        }
        return e
    }

    function k(e, t) {
        var n = t.tabs[e],
            r = 0;
        for (var a in n.msgs) !n.msgs[a][0] && intval(a) > n.in_up_to && (r += n.msgs[a][1]);
        return r
    }

    function I(e, t, n) {
        var r = e.tabs[t];
        return r.unread = k(t, e) + n, e
    }

    function P(e) {
        return (0, yt.post)(kt, {
                act: "a_get_key",
                uid: e.id,
                gid: e.gid
            })
            .then(function(t) {
                var n = bt(t, 3),
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

    function L(e) {
        return (0, yt.post)(kt, {
                act: "a_get_ts",
                gid: e.gid
            })
            .then(function(t) {
                var n = bt(t, 1),
                    r = n[0];
                return extend({}, e, {
                    imTs: r
                })
            })
    }

    function A(e) {
        var t = geByClass1("_im_unread_bar_row", e);
        return t && (t.parentNode.removeChild(t), (0, St.showInvisibleBar)(e)), e
    }

    function D(e, t, n) {
        var r = n.tabs[e];
        return r.msgs[t.messageId] && (r.msgs[t.messageId][3] = 1, r.history = (0, St.setMessageError)(e, t, l(r.history))), Promise.resolve(n)
    }

    function M(e, t, n) {
        var r = n.tabs[e];
        return r.msgs[t] && (r.msgs[t][3] = 0, r.history = (0, St.startResendMessage)(e, t, l(r.history))), Promise.resolve(n)
    }

    function x(e, t, n, r) {
        var a = arguments.length <= 4 || void 0 === arguments[4] ? !1 : arguments[4];
        t.deletedDialog || (e.dialog_tabs = Object.keys(e.dialog_tabs)
            .reduce(function(e, i) {
                return !n && !ot(i)(t) || a && !a(i, e[i], t) || (e[i] = (0, wt.arrayUnique)(r(e[i], i))), e
            }, e.dialog_tabs))
    }

    function O(e, t) {
        return 0 === e.length ? Promise.resolve(t) : (0, yt.post)(kt, {
                act: "a_get_admin",
                admins: e.join(","),
                gid: t.gid
            })
            .then(function(e) {
                var n = bt(e, 1),
                    r = n[0];
                return t.admins = extend(t.admins, r), t
            })
    }

    function B(e, t) {
        inArray(e, t.tabbedPeers.map(function(e) {
            return e.peer
        })) || 0 === t.peer && !t.searchText || inArray(e, t.mutedPeers) || t.tabbedPeers.push({
            peer: e,
            type: "temp"
        })
    }

    function F(e, t) {
        var n = e.flags & Tt.eventTypes.FLAG_OUTBOUND,
            a = e.peerId;
        if ((0, St.isTabLoaded)(t, a)) {
            var i = t.tabs[a];
            if (i.deletedDialog = !1, (0, St.isFullyLoadedTab)(t, a)) {
                var s = l(i.history);
                i.skipped > 0 && i.skipped++, i.offset++, i.history = (0, St.appendToHistory)(t, e, s);
                var o = e.flags & Tt.eventTypes.FLAG_UNREAD ? 1 : 0,
                    u = e.flags & Tt.eventTypes.FLAG_OUTBOUND && !(0, St.isSelfMessage)(e.peerId, t.gid) ? 1 : 0,
                    c = e.flags & Tt.eventTypes.FLAG_IMPORTANT ? 1 : 0;
                i.msgs[e.messageId] = [u, o, c]
            }
            return !t.msg_local_ids_sort && e.local ? t.msg_local_ids_sort = r({}, e.messageId, 0) : e.local && (t.msg_local_ids_sort[e.messageId] = Object.keys(t.msg_local_ids_sort)
                .length), i.typing && i.typing[e.userId] && delete i.typing[e.userId], i.lastmsg = e.messageId, i.lastmsg_meta = e, n ? i.unread = 0 : (!i.unread && N(
                t, 1, e.peerId), i.unread++, B(e.peerId, t)), x(t, i, !1, function(e) {
                return [a].concat(e)
            }), Promise.resolve(t)
        }
        return d(a, !1, !1, !1, t)
            .then(function(e) {
                var t = e.tabs[a];
                return x(e, t, !1, function(e) {
                    return [a].concat(e)
                }), e
            })
    }

    function N(e, t, n) {
        e.cur_unread_cnt || (e.cur_unread_cnt = {}), -1 === t && delete e.cur_unread_cnt[n], e.unread_cnt += t
    }

    function R(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = n.unread;
            t = S(t, e.peerId, e.upToId, 0), t = I(t, e.peerId, intval(n.skipped)), r > 0 && !n.unread && N(t, -1, e.peerId), n.in_up_to = e.upToId, n.out_up_to < e.upToId &&
                (n.out_up_to = e.upToId), n.lastmsg_meta.messageId <= e.upToId && !(n.lastmsg_meta.flags & Tt.eventTypes.FLAG_OUTBOUND) && (n.lastmsg_meta.flags ^= Tt.eventTypes
                    .FLAG_UNREAD), n.history = A(l(n.history))
        } else(0, St.isTabLoaded)(t, e.peerId) && (t.tabs[e.peerId].unread > 0 && N(t, -1, e.peerId), t.tabs[e.peerId].unread = 0, t.tabs[e.peerId].in_up_to = e.upToId);
        return (0, St.isTabLoaded)(t, e.peerId) && (t.dialog_tabs[St.FOLDER_UNREAD] = t.dialog_tabs[St.FOLDER_UNREAD].filter(function(t) {
            return intval(t) !== e.peerId
        })), 0 !== t.unread_cnt || t.active_tab !== St.FOLDER_UNREAD || t.gid ? Promise.resolve(t) : lt(St.FOLDER_ALL, t)
    }

    function j(e, t) {
        if ((0, St.isTabLoaded)(t, e.peerId)) {
            var n = t.tabs[e.peerId];
            n.out_up_to = e.upToId, n.lastmsg_meta.messageId <= e.upToId && n.lastmsg_meta.flags & Tt.eventTypes.FLAG_OUTBOUND && (n.lastmsg_meta.flags ^= Tt.eventTypes.FLAG_UNREAD)
        }
        if ((0, St.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = l(n.history);
            n.history = (0, St.markMessagesAsRead)(t, e.peerId, r)
        }
        return Promise.resolve(t)
    }

    function U(e, t, n, r, a) {
        return a.text = {
            attachedFiles: 0
        }, a.imQueue = e, a.imQueueResend = t, a.imQueueSet = n, a.imQueueComplete = r, Promise.resolve(a)
    }

    function H(e, t) {
        var n = bt(e, 3),
            r = n[0],
            a = n[1],
            i = n[2];
        t.text.attachedFiles++, t._attach_cache || (t._attach_cache = {}), i ? t._attach_cache[r + a] = i : i = t._attach_cache[r + a];
        var s = t.peer;
        if ((0, St.isFullyLoadedTab)(t, s)) {
            var o = t.tabs[s];
            o.attaches || (o.attaches = []);
            var l = ls.get(p(s)) || {};
            r !== !1 ? (o.attaches.push([r, a, i, o.attaches.length]), ls.set(p(s), extend({
                txt: ""
            }, l, {
                medias: o.attaches
            }))) : r === !1 && "undefined" != typeof a && (o.attaches = o.attaches.filter(function(e) {
                return e[3] !== a
            }), ls.set(p(s), extend({
                txt: ""
            }, l, {
                medias: o.attaches
            })))
        }
        return Promise.resolve(t)
    }

    function G(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            n.attaches = [];
            var r = ls.get(p(e)) || {};
            ls.set(p(e), extend({
                txt: ""
            }, r, {
                medias: []
            }))
        }
        return Promise.resolve(t)
    }

    function z(e, t, n) {
        return e = e.map(function(e) {
                return e.slice(0, 2)
                    .join(",")
            })
            .join("*"), (0, yt.post)(kt, {
                act: "draft_medias",
                media: e
            })
            .then(function(e) {
                var r = bt(e, 1),
                    a = r[0];
                return n.tabs[t].attaches = a, n
            })
    }

    function q(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            if (!n.attaches || !n.attaches.length) {
                var r = ls.get(p(e)) || {},
                    a = (r.medias || [])
                    .filter(function(e) {
                        return !e[2]
                    });
                if (a.length > 0) return z(r.medias, e, t);
                n.attaches = r.medias || []
            }
        }
        return Promise.resolve(t)
    }

    function K(e, t) {
        return e.set(q.bind(null, t))
            .then(function(e) {
                return (0, St.isFullyLoadedTab)(e.get(), t) ? e.get()
                    .tabs[t].attaches : []
            })
    }

    function Q(e, t) {
        var n = t.tabs[t.peer];
        return t.tabs = Object.keys(e)
            .reduce(function(n, r) {
                var a = t.tabs[r] ? t.tabs[r].msgs : {},
                    i = extend({}, a || {}, e[r].msgs || {});
                return n[r] = extend(t.tabs[r] || {}, e[r]), i && (n[r].msgs = i), n
            }, t.tabs), t.tabs[t.peer] = n, Promise.resolve(t)
    }

    function W(e, t, n) {
        return (0, St.isTabLoaded)(n, e) && (n.tabs[e].online = t), Promise.resolve(n)
    }

    function Y(e, t, n) {
        return (0, St.isTabLoaded)(n, e) && (n.tabs[e].typing = extend(n.tabs[e].typing, r({}, t, Date.now()))), Promise.resolve(n)
    }

    function Z(e, t, n) {
        return (0, Et.pause)(It + 2)
            .then(function() {
                if ((0, St.isTabLoaded)(n, e)) {
                    var r = n.tabs[e];
                    if (r.typing) {
                        var a = Date.now() - (r.typing[t] || 0);
                        a >= 1e3 * It && delete r.typing[t]
                    }
                }
                return n
            })
    }

    function V(e, t, n) {
        if ((0, St.isFullyLoadedTab)(n, e)) {
            t = clean(t), n.tabs[e].imdraft = t;
            var r = ls.get(_(e)) || {};
            ls.set(_(e), extend(r, {
                txt: t
            }))
        }
        return Promise.resolve(n)
    }

    function $(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            if (!n.imdraft) {
                var r = ls.get(_(e));
                r && r.txt && (n.imdraft = r.txt)
            }
            return Promise.resolve(n.imdraft || "")
        }
        return Promise.resolve("")
    }

    function X(e, t) {
        t.selectedMessages || (t.selectedMessages = []);
        var n = t.selectedMessages.filter(function(t) {
            return t !== e
        });
        return n.length !== t.selectedMessages.length ? t.selectedMessages = n : t.selectedMessages.push(e), Promise.resolve(t)
    }

    function J(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function ee(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function te(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = t.imQueue(e.peerId)
                .filter(function(t) {
                    return t.failed && t.rid !== e.randomId
                });
            t.imQueueSet(e.peerId, r), t.imQueueComplete(e.peerId, e.randomId), n.history = (0, St.replaceMessageAttrs)(t, l(n.history), e), n.lastmsg_meta = e, n.lastmsg =
                e.messageId;
            var a = n.msgs["rid" + e.randomId];
            a && (n.msgs[e.messageId] = a, delete n.msgs["rid" + e.randomId])
        }
        return Promise.resolve(t)
    }

    function ne(e, t) {
        return Promise.resolve()
    }

    function re(e, t) {
        return (0, yt.post)(kt, {
                act: "a_get_media",
                id: e.messageId,
                gid: t.gid
            })
            .then(function(n) {
                var r = bt(n, 3),
                    a = r[0],
                    i = r[1],
                    s = r[2],
                    o = t.tabs[e.peerId];
                return o.mediacontent || (o.mediacontent = {}), o.mediacontent[e.messageId] = [a, i, s], ae(e, t)
            })
    }

    function ae(e, t) {
        var n = t.tabs[e.peerId];
        return n.history = (0, St.replaceAttaches)(l(n.history), e, t), Promise.resolve(t)
    }

    function ie(e, t, n) {
        var r = (0, St.dayFromVal)(t),
            a = n.tabs[e];
        return a.searchDay = r, a.searchOffset = 0, a.searchAllLoaded = !1, Promise.resolve(n)
    }

    function oe(e, t, n) {
        if (t) {
            var r = n.tabs[t];
            r.searchText = e, r.searchOffset = 0, r.searchAllLoaded = !1
        } else n.searchText = e, n.searchOffset = 0, n.searchAllLoaded = !1;
        return Promise.resolve(n)
    }

    function le(e, t, n, r) {
        return (0, yt.post)(kt, {
                act: "a_hints",
                str: e,
                gid: r.gid,
                query: n,
                peerIds: t.join(",")
            })
            .then(function(e) {
                var t = bt(e, 2),
                    n = t[0],
                    a = t[1];
                return c(a, r), Object.keys(n)
                    .sort(function(e, t) {
                        return n[e].order - n[t].order
                    })
                    .map(function(e) {
                        return n[e]
                    })
            })
    }

    function ue(e, t, n, r) {
        return le(e, t, n, r)
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

    function ce(e, t) {
        return function(n, r) {
            return e(r)
                .then(function(e) {
                    var a;
                    a = n === !1 ? e.list : e.search(n);
                    var i = a.sort(t)
                        .map(function(e) {
                            return {
                                peerId: e[0],
                                name: e[1],
                                tab: e[1],
                                photo: e[2],
                                lastmsg: e[3],
                                href: e[4],
                                online: e[5],
                                is_friend: e[6],
                                rating: e[7],
                                local_index: !0
                            }
                        });
                    return r.mapped_index || (r.mapped_index = {}), i.forEach(function(e) {
                        r.mapped_index[e.peerId] = e
                    }), i
                })
        }
    }

    function de(e) {
        var t;
        return e.friendsTree = new Promise(function(e) {
                t = e
            }), (0, yt.post)(kt, {
                act: "a_dialogs_preload",
                gid: e.gid
            })
            .then(function(n) {
                var r = bt(n, 1),
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

    function ge(e) {
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

    function fe(e) {
        var t = e.active_tab;
        return (0, yt.post)("al_im.php", {
                act: "a_get_dialogs",
                offset: e.offset,
                tab: t,
                gid: e.gid
            })
            .then(function(n) {
                var r = bt(n, 3),
                    a = r[0],
                    i = r[1],
                    s = r[2];
                return c(s, e), Q(i, e), e.dialog_tabs[t] = e.dialog_tabs[t].concat(Object.keys(i)
                    .map(intval)), e.offset = a.offset, e.dialog_tabs_all[t] = !a.has_more, Promise.resolve(e)
            })
    }

    function me(e, t) {
        return (0, yt.post)(kt, {
                act: "a_search",
                q: e,
                from: "all",
                gid: t.gid,
                offset: t.searchOffset || 0
            })
            .then(function(n) {
                var r = bt(n, 4),
                    a = r[0],
                    i = r[1],
                    s = r[2],
                    o = r[3];
                return e === t.searchText && (t.searchOffset = s, t.searchAllLoaded = o), [a, i]
            })
    }

    function pe(e, t) {
        var n = t.tabs[e];
        return n.searchAllLoaded
    }

    function _e(e, t) {
        if (t.peer === e && (0, St.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.inplaceSearch
        }
        return !1
    }

    function ve(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.inplaceSearch, delete n.searchOffset, delete n.searchAllLoaded, delete n.searchText, delete n.searchDay
        }
        return Promise.resolve(t)
    }

    function he(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.searchDay, n.searchOffset = 0, n.searchAllLoaded = !1
        }
        return Promise.resolve(t)
    }

    function be(e, t) {
        var n = t.tabs[e];
        return n.inplaceSearch = !0, Promise.resolve(t)
    }

    function ye(e, t) {
        var n = t.tabs[e],
            r = "";
        if (be(e, t), n.searchDay && (r = "day:" + n.searchDay), !r && !n.searchText) return Promise.reject();
        var a = "in:" + e + " " + r + " " + (n.searchText || "");
        return (0, yt.post)(kt, {
                act: "a_search",
                q: a,
                from: "in",
                gid: t.gid,
                offset: n.searchOffset || 0
            })
            .then(function(e) {
                var t = bt(e, 3),
                    r = t[0],
                    a = t[1],
                    i = t[2];
                return n.searchOffset = a, n.searchAllLoaded = i, r
            })
    }

    function Ce(e) {
        return (0, yt.post)(kt, {
            act: "a_important",
            offset: e,
            gid: data.gid,
            part: e > 0
        })
    }

    function Te(e, t, n) {
        var t = n.peer;
        if ((0, St.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted = r.deleted ? r.deleted.concat(e) : e, r.history = (0, St.removeMessages)(e, l(r.history)), r.offset -= e.filter(function(e) {
                    return r.msgs[e]
                })
                .length, e.forEach(function(e) {
                    return delete r.msgs[e]
                })
        }
        return Promise.resolve(n)
    }

    function Ee(e, t, n, r, a) {
        return (0, yt.post)(kt, {
            act: "a_mark",
            peer: t,
            hash: n,
            gid: a,
            msgs_ids: e.join(","),
            mark: r
        })
    }

    function we(e, t, n, r) {
        if ((0, St.isFullyLoadedTab)(r, t)) {
            var a = r.tabs[t];
            a.deleted = a.deleted ? a.deleted.concat(e) : e, a.history = (0, St.removeMessagesWithRestore)(e, t, n, l(a.history)), a.offset -= e.filter(function(e) {
                    return a.msgs[e]
                })
                .length
        }
        return Promise.resolve(r)
    }

    function Se(e, t, n) {
        if ((0, St.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted && (r.deleted = r.deleted.filter(function(t) {
                return t !== e
            })), r.history = (0, St.restoreMessage)(e, t, l(r.history)), r.offset++
        }
        return Promise.resolve(n)
    }

    function ke(e, t, n, r) {
        return (0, yt.post)(kt, {
            act: "a_restore",
            id: e,
            peer: t,
            hash: n,
            gid: r
        })
    }

    function Ie(e, t) {
        return t.msgid = e, Promise.resolve(t)
    }

    function Pe(e, t, n) {
        if ((0, St.isFullyLoadedTab)(n, t)) {
            n.pendingForward = [];
            var r = n.tabs[t];
            r.fwdMessages = e, ls.set(v(t), e)
        }
        return Promise.resolve(n)
    }

    function Le(e, t) {
        if ((0, St.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.fwdMessages || (n.fwdMessages = ls.get(v(e)) || []), Promise.resolve(n.fwdMessages)
        }
        return Promise.resolve([])
    }

    function Ae(e, t) {
        return t.pendingForward = e, Promise.resolve(t)
    }

    function De(e, t, n) {
        return n.tabs[e].tab = t, Promise.resolve(n)
    }

    function Me(e, t) {
        if (isEmpty(e)) return Promise.resolve(t);
        var n = Object.keys(e)
            .map(function(t) {
                return t + ":" + e[t].join(",")
            })
            .join(";");
        return (0, yt.post)(kt, {
                act: "a_load_member",
                need: n
            })
            .then(function(e) {
                var n = bt(e, 1),
                    r = n[0];
                return Object.keys(r)
                    .forEach(function(e) {
                        var n = r[e];
                        Object.keys(n)
                            .forEach(function(r) {
                                n[r] && (t.tabs[e].data.members[r] = n[r])
                            })
                    }), t
            })
    }

    function xe(e, t, n, r) {
        var a = e.filter(function(e) {
                return e.kludges.source_act === St.CHAT_INVITE_USER
            })
            .filter(function(e) {
                return !r.tabs[e.peerId].data.members[e.kludges.source_mid]
            })
            .reduce(function(e, t) {
                var n = t.kludges.source_mid;
                return e[t.peerId] || (e[t.peerId] = []), inArray(n, e[t.peerId]) || e[t.peerId].push(n), e
            }, {}),
            i = t.filter(function(e) {
                return e.flags & Tt.eventTypes.FLAG_OUTBOUND && !e.local
            })
            .map(function(e) {
                return e.kludges.from_admin
            })
            .filter(function(e) {
                return e && !r.admins[e]
            });
        return 0 === Object.keys(a)
            .length && 0 === i.length ? Promise.resolve(r) : (n.pause(), Promise.all([Me(a, r), O(i, r)])["catch"](function() {
                    return r
                })
                .then(function() {
                    return n.resume()
                })
                .then(function() {
                    return r
                }))
    }

    function Oe(e, t, n, r) {
        var a = r.tabs[n];
        if (t !== vk.id) return Promise.resolve(r);
        if ((0, St.isTabLoaded)(r, n)) {
            if (e === St.CHAT_KICK_USER) {
                var a = r.tabs[n];
                a.data.closed = !0, delete a.data.actions.leave, delete a.data.actions.avatar, delete a.data.actions.topic, delete a.data.actions.mute, delete a.data.actions
                    .unmute, t === vk.id && (a.data.actions["return"] = getLang("mail_return_to_chat"))
            } else e === St.CHAT_INVITE_USER && (a.data.closed = !1, delete a.data.actions["return"], a.data.actions.leave = getLang("mail_leave_chat"), a.data.actions.avatar =
                getLang("mail_update_photo"), a.data.actions.topic = getLang("mail_change_topic"), a.data.actions.mute = getLang("mail_im_mute"), a.data.actions.unmute =
                getLang("mail_im_unmute"));
            r = r.peer === n ? T(r) : Promise.resolve(r)
        }
        return r
    }

    function Be(e, t, n) {
        var r = n.mutedPeers.filter(function(t) {
            return t !== e
        });
        return t && r.push(e), n.mutedPeers = r, T(n)
    }

    function Fe(e, t, n) {
        return (0, St.isTabLoaded)(n, e) && delete n.tabs[e].data.members[t], Promise.resolve(n)
    }

    function Ne(e, t) {
        return t.stack = e, Promise.resolve(t)
    }

    function Re(e, t, n, r) {
        if ((0, St.isFullyLoadedTab)(r, t)) {
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

    function je(e, t, n) {
        n.importants || (n.importants = {});
        var r = n.importants[t] || 0;
        return r !== e && (n.important_cnt += e, n.importants[t] = e), Promise.resolve(n)
    }

    function Ue(e, t) {
        return (0, yt.post)(kt, {
            act: "a_spam",
            offset: e,
            gid: t,
            part: e > 0
        })
    }

    function He(e, t) {
        return (0, yt.post)(kt, {
            act: "a_flush_spam",
            gid: t,
            hash: e
        })
    }

    function Ge(e, t, n) {
        return n.creationType = e, n.creationFilter = t, Promise.resolve(n)
    }

    function ze(e, t) {
        return (0, yt.post)(kt, {
            act: "a_owner_photo",
            photo: JSON.parse(e)
                .data[0],
            peer: t
        })
    }

    function qe(e, t) {
        return t.next_chat_avatar = e, Promise.resolve(t)
    }

    function Ke(e, t, n) {
        return (0, yt.post)("al_page.php", {
                act: "owner_photo_save",
                peer: e,
                _query: t
            })
            .then(function(e) {
                return n
            })
    }

    function Qe(e, t, n, r) {
        return r.creating = !0, r.longpoll.pause(), (0, yt.post)(kt, {
                act: "a_multi_start",
                hash: r.writeHash,
                peers: t.join(","),
                title: n
            })
            .then(function(e) {
                var t = bt(e, 1),
                    n = t[0];
                return r.next_peer = n.peerId, r.tabs[n.peerId] = n, x(r, n, !1, function(e) {
                    return [n.peerId].concat(e)
                }), r.longpoll.resume(), r
            })
            .then(function(t) {
                return e ? Ke(t.next_peer, e, t) : t
            })
            .then(function(e) {
                return e.creating = !1, e
            })["catch"](function(e) {
                throw r.creating = !1, r.longpoll.resume(), e
            })
    }

    function We(e) {
        var t;
        e.resync_in_process = new Promise(function(e) {
            t = e
        });
        var n = Object.keys(e.tabs)
            .length,
            a = e.active_tab;
        return (0, yt.post)(kt, {
                act: "a_resync",
                sel: e.peer,
                gid: e.gid,
                loaded: n,
                tab: a,
                add_peers: e.tabbedPeers.map(function(e) {
                        return e.peer
                    })
                    .join(",")
            })
            .then(function(i) {
                var s = bt(i, 4),
                    o = s[0],
                    u = s[1],
                    c = s[2],
                    d = s[3];
                if (u.user_unread && handlePageCount("msg", u.user_unread), (0, wt.lplog)("Resync success", "success"), console.log(o, u, "resync data"), a === St.FOLDER_ALL &&
                    Object.keys(o)
                    .length < n && 100 !== Object.keys(o)
                    .length) throw new Error("Not full data from server, retry");
                var g, f = e.peer;
                return g = (0, St.isReservedPeer)(f) ? Promise.resolve(!1) : Q(r({}, f, o[f]), {
                    tabs: r({}, f, e.tabs[f])
                }), g.then(function(n) {
                    e.tabs = o, e.admins = extend(e.admins, c), n && (e.tabs[f] = n.tabs[f], e.tabs[f].history = (0, St.restoreQueue)(f, e, l(e.tabs[f].history))),
                        e.loadingDialogs = !1, e.offset = Object.keys(o)
                        .length, e.mutedPeers = u.mutedPeers, e.lastDialogsOptions = {
                            has_more: u.has_more
                        }, e.dialog_tab_cts = u.folder_cts, e.dialog_tabs[a] = d.map(intval);
                    var r = e.dialog_tabs[a].map(function(t) {
                        return e.tabs[t]
                    });
                    return Object.keys(e.dialog_tabs)
                        .filter(function(e) {
                            return e != a
                        })
                        .forEach(function(t) {
                            a == St.FOLDER_ALL ? e.dialog_tabs[t] = r.filter(ot(t))
                                .map(function(e) {
                                    return e.peerId
                                }) : e.dialog_tabs[t] = []
                        }), delete e.resync_in_process, setTimeout(t.bind(null, !0), 0), Xe(intval(u.unread), e)
                })
            })["catch"](function(t) {
                return (0, wt.lplog)("Resync error: " + t.message + " " + t.stack, "error"), (0, Et.pause)(2)
                    .then(We.bind(null, e))
            })
    }

    function Ye(e, t, n, r) {
        if ((0, St.isTabLoaded)(r, e)) {
            var a = r.tabs[e].data.members[n];
            t == n ? a.closed = 1 : a.kicked = 1, n === vk.id && t != n && (r.tabs[e].data.kicked = 1)
        }
        return Promise.resolve(r)
    }

    function Ze(e, t, n) {
        return e && !n.delayed_message ? (n.delayed_message = e, n.delayed_ts = t) : e || (n.delayed_message = e, n.delayed_ts = t), Promise.resolve(n)
    }

    function Ve() {
        return window.Upload && Upload.options ? Object.keys(Upload.options)
            .map(function(e) {
                return Upload.options[e]
            })
            .filter(function(e) {
                return e.xhr && 4 !== e.xhr.readyState && 0 !== e.xhr.readyState
            })
            .length > 0 : !1
    }

    function $e(e) {
        var t = e.textMediaSelector;
        return !!t.urlAttachmentLoading || Ve()
    }

    function Xe(e, t) {
        return t.unread_cnt = e, t.dialog_tab_cts[St.FOLDER_UNREAD] = e, Promise.resolve(t)
    }

    function Je(e, t) {
        return t.ctrl_submit = !!e, (0, yt.post)(kt, {
                act: "a_save_ctrl_submit",
                to: t.peer,
                hash: t.tabs[t.peer].hash,
                value: e ? 1 : 0
            })
            .then(function(e) {
                return t
            })
    }

    function et(e) {
        return "bind_to_url_store_" + e
    }

    function tt(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach || (n.bind_url_to_attach = ls.get(et(e)) || {}), Promise.resolve(n.bind_url_to_attach)
    }

    function nt(e, t, n, r, a) {
        return tt(e, a)
            .then(function(i) {
                return i[r] = [t, n], ls.set(et(e), i), Promise.resolve(a)
            })
    }

    function rt(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach = {}, ls.set(et(e), {}), Promise.resolve(t)
    }

    function at(e, t, n) {
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

    function it(e, t, n) {
        n.cur_unread_cnt || (n.cur_unread_cnt = {}), t && !inArray(e, n.mutedPeers) && (n.cur_unread_cnt[e] = !0);
        var r = document.title,
            a = window.devicePixelRatio >= 2 ? "_2x" : "";
        if (t && !n.update_title_to) {
            var i = at(r, a, n);
            n.update_title_to = setInterval(i, 1e3), i()
        } else !t && n.update_old_title && (document.title = n.update_old_title, n.cur_unread_cnt = {}, r = !1, n.update_old_title = !1, setFavIcon(
            "/images/icons/favicons/fav_im" + a + ".ico"), clearInterval(n.update_title_to), n.update_title_to = !1);
        return Promise.resolve(n)
    }

    function st(e, t, n) {
        return (0, St.isFullyLoadedTab)(n, e) && (n.tabs[e].scrollBottom = t), Promise.resolve(n)
    }

    function ot(e) {
        return e === St.FOLDER_ALL ? function() {
            return !0
        } : e === St.FOLDER_UNREAD ? function(e) {
            return e.unread > 0
        } : e === St.FOLDER_UNRESPOND ? function(t) {
            return !(t.folders & St.FOLDER_MASKS[e])
        } : function(t) {
            return t.folders & St.FOLDER_MASKS[e]
        }
    }

    function lt(e, t) {
        t.active_tab;
        t.active_tab = e, (0, Ct.updateLocation)({
            tab: e === St.FOLDER_ALL ? null : e
        });
        var n = [];
        if (e !== St.FOLDER_ALL) {
            var r = t.dialog_tabs[e];
            n = t.dialog_tabs[St.FOLDER_ALL].map(function(e) {
                    return t.tabs[e]
                })
                .filter(ot(e))
                .map(function(e) {
                    return e.peerId
                }), t.dialog_tabs[e] = r.length >= n.length ? r : n
        }
        return t.offset = t.dialog_tabs[e].length, Promise.resolve(t)
    }

    function ut(e, t, n) {
        return e === Tt.eventTypes.SET_DIRECTORIES && n.folders & t ? !1 : e !== Tt.eventTypes.RESET_DIRECTORIES || n.folders & t ? !0 : !1
    }

    function ct(e, t, n) {
        var r;
        return r = t === Tt.eventTypes.REPLACE_DIRECTORIES ? e.folders & St.FOLDER_MASKS[n] ? -1 : 1 : t === Tt.eventTypes.SET_DIRECTORIES ? 1 : -1, n === St.FOLDER_UNRESPOND &&
            (r = -r), r
    }

    function dt(e, t, n, r, a) {
        if ((0, St.isTabLoaded)(a, e)) {
            var i = a.tabs[e];
            if (n === Tt.eventTypes.REPLACE_DIRECTORIES && (t ^= i.folders), ut(n, t, i)) {
                Object.keys(St.FOLDER_MASKS)
                    .filter(function(e) {
                        return St.FOLDER_MASKS[e] & t
                    })
                    .forEach(function(e) {
                        a.dialog_tab_cts[e] += ct(i, n, e)
                    })
            }
            n === Tt.eventTypes.SET_DIRECTORIES ? a.tabs[e].folders |= t : n === Tt.eventTypes.RESET_DIRECTORIES ? a.tabs[e].folders &= ~t : a.tabs[e].folders = t ^= i.folders;
            var s = a.dialog_tabs_all;
            return x(a, a.tabs[e], !0, function(t, n) {
                return t.concat([e])
                    .map(function(e) {
                        return a.tabs[e]
                    })
                    .filter(ot(n))
                    .map(function(e) {
                        return e.peerId
                    })
            }, function(e, t, n) {
                if (s[St.FOLDER_ALL] || s[e]) return !0;
                if (t.filter(function(e) {
                        return e === n.peerId
                    })
                    .length > 0) return !0;
                var r = t.map(function(e) {
                        return a.tabs[e]
                    })
                    .filter(function(e) {
                        return e.lastmsg < n.lastmsg
                    });
                return r.length > 0 ? !0 : !1
            }), Promise.resolve(a)
        }
        return d(e, !1, !1, !1, a)
            .then(dt.bind(null, e, t, n, a))
    }

    function gt(e) {
        return (0, yt.post)(kt, {
            act: "a_get_mutex_key",
            gid: e
        })
    }

    function ft(e, t) {
        return c(r({}, e, {
                free: !0
            }), t), (0, yt.post)(kt, {
                act: "a_block_release",
                peer: e,
                gid: t.gid
            })
            .then(function() {
                return t
            })
    }

    function mt(e, t) {
        var n = ls.get("comm_mute_" + t.gid) ? 1 : 0;
        return e && (n = 1 ^ n), ls.set("comm_mute_" + t.gid, n), t.mute = n, Promise.resolve(t)
    }

    function pt(e, t, n, r) {
        return (0, yt.post)(kt, {
                act: "a_restore_dialog",
                hash: t,
                gid: r.gid,
                spam: n ? 1 : 0,
                peer: e
            })
            .then(function(t) {
                return r.tabs[e].deletedDialog = !1, x(r, r.tabs[e], !1, function(t) {
                    return [e].concat(t)
                }), r.tabs[e].unread = t, r
            })
    }

    function _t(e, t, n) {
        return (0, yt.post)(kt, {
            act: "a_spam_dialog",
            peer: e,
            gid: n.gid,
            hash: t
        })
    }

    function vt(e, t, n) {
        return n.tabbedPeers = e, (0, St.isClassicInterface)(n) && (Lt({
            peers: n.tabbedPeers.filter(function(e) {
                    var t = e.peer,
                        r = e.type;
                    return t !== n.peer && "perm" === r
                })
                .map(function(e) {
                    return (0, St.getBareTab)(e.peer, n)
                })
                .filter(function(e) {
                    return !e.deletedDialog
                })
                .map(function(e) {
                    return e.peerId
                })
                .map(St.convertPeerToUrl)
                .join("_")
        }), t && At()), Promise.resolve(n)
    }

    function ht(e) {
        return e.peer ? _e(e.peer, e) ? pe(e.peer, e) : (0, St.isFullyLoadedTab)(e, e.peer) ? e.tabs[e.peer].allShown : !1 : !0
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.deleteDialog = t.markDialogAnswered = t.toggleDialogImportant = t.favMessage = t.toggleMutePeer = t.returnToChat = t.leaveChat = t.updateChatPhoto = t.addNewMember =
        t.updateChatTopic = t.flushHistory = t.sendTyping = t.searchLocalHints = t.searchFriends = t.deliverMessage = t.readLastMessages = t.ACTION_PRIORITIES = t.TYPING_PERIOD =
        void 0;
    var bt = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    t.strHistory = u, t.updateBlockStates = c, t.loadPeer = d, t.restoreHistoryQueue = f, t.removeFailed = m, t.selectPeer = b, t.selectPeerOnMessage = y, t.changePeer = C,
        t.setActions = T, t.loadMoreHistory = E, t.loadLessHistory = w, t.countUnread = k, t.loadLongPollKey = P, t.loadLongPollTs = L, t.removeUnreadBar = A, t.setMessageErrored =
        D, t.resendMessage = M, t.loadAdmins = O, t.addMessage = F, t.markInboundMessagesAsRead = R, t.markOutboundMessagesAsRead = j, t.initTextStore = U, t.addMediaStore =
        H, t.cleanMediaStore = G, t.restoreAttaches = q, t.getAttaches = K, t.mergeTabs = Q, t.updateOnline = W, t.setTyping = Y, t.waitTyping = Z, t.saveTextDraft = V, t.getTextDraft =
        $, t.addSelection = X, t.cleanSelected = J, t.dropSelection = ee, t.replaceMessage = te, t.saveMedia = ne, t.loadMedia = re, t.replaceMediaAttachesStore = ae, t.setCurrentSearchDate =
        ie, t.setCurrentSearch = oe, t.searchHints = le, t.searchHintsIndex = ue, t.fetchFriends = de, t.fetchLocalHints = ge, t.loadDialogs = fe, t.searchMessages = me, t
        .isSearchAllLoaded = pe, t.isSearchingInplace = _e, t.cancelSearch = ve, t.clearDate = he, t.searchInplaceStart = be, t.searchMessagesInplace = ye, t.loadImportant =
        Ce, t.removeMessages = Te, t.removeMessageSend = Ee, t.removeMessagesWithRestore = we, t.restoreMessage = Se, t.restoreMessageSend = ke, t.changeMessage = Ie, t.forwardMessages =
        Pe, t.getForwardedMessages = Le, t.prepareForward = Ae, t.setChatTitle = De, t.checkNewPeople = xe, t.updateActions = Oe, t.setMutedPeer = Be, t.removeMember = Fe,
        t.setExecStack = Ne, t.updateFavMessage = Re, t.updateImportant = je, t.loadSpam = Ue, t.flushSpam = He, t.setCreationType = Ge, t.getOwnerPhoto = ze, t.presetAvatar =
        qe, t.setChatPhoto = Ke, t.createChat = Qe, t.resync = We, t.chatKickUser = Ye, t.setDelayedMessage = Ze, t.isAnythingLoading = $e, t.updateUnreadCount = Xe, t.changeSubmitSettings =
        Je, t.getBindAttachToUrl = tt, t.bindAttachToUrl = nt, t.clearAttachToUrl = rt, t.updateFavAndTitle = it, t.saveHistoryScroll = st, t.filterFromTab = ot, t.changeDialogsTab =
        lt, t.updateFolderState = dt, t.getMutexQueue = gt, t.releaseBlock = ft, t.toggleCommunityMute = mt, t.restoreDialog = pt, t.spamDialog = _t, t.updateTabbedPeers =
        vt, t.isEverythingLoaded = ht;
    var yt = n(4),
        Ct = n(74),
        Tt = n(75),
        Et = n(78),
        wt = n(80),
        St = n(81),
        kt = "al_im.php",
        It = t.TYPING_PERIOD = 5,
        Pt = (0, Ct.updateLazyLocation)(),
        Lt = Pt.scheduleNav,
        At = Pt.commitNav,
        Dt = t.ACTION_PRIORITIES = {
            block: 1,
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
    t.readLastMessages = o(function(e, t) {
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
        })), r = intval(r.shift()), r <= n.in_up_to ? Promise.resolve(t) : (t.longpoll.push([Tt.eventTypes.readInboundEvent([6, e, r])]), (0, yt.post)(kt, {
                peer: e,
                ids: [r],
                hash: n.hash,
                act: "a_mark_read",
                gid: t.gid
            })
            .then(function() {
                return S(t, e, r, Tt.eventTypes.FLAG_OUTBOUND)
            }))
    }), t.deliverMessage = o(function(e, t, n) {
        var r, a = Date.now() + rand(0, 100)
            .toFixed(0),
            i = n.tabs[e],
            s = t.attaches.map(function(e) {
                return "fwd" === e[0] ? ["mail", e[1].join(";")] : e
            })
            .map(function(e) {
                return e[0] + ":" + e[1]
            })
            .join(","),
            o = t.attaches.filter(function(e) {
                return "share" === e[0]
            })
            .pop();
        return o && (r = o[2].url), (0, yt.post)(kt, {
                act: "a_send",
                to: e,
                hash: i.hash,
                msg: t.message,
                media: s,
                guid: a,
                share_url: r,
                random_id: t.rid,
                gid: n.gid,
                sticker_referrer: t.sticker_referrer
            })
            .then(function(e) {
                var t = bt(e, 1),
                    r = t[0];
                return n.version !== r.version && nav.reload({
                    force: !0
                }), n
            })
    }), t.searchFriends = ce(function(e) {
        return e.friendsTree
    }, function(e, t) {
        return t[3] - e[3]
    }), t.searchLocalHints = ce(function(e) {
        return e.hintsTree
    }, function(e, t) {
        return e[3] - t[3]
    }), t.sendTyping = o(function(e, t) {
        return t.tabs[e].lastTyping = Date.now(), (0, yt.post)(kt, {
                act: "a_typing",
                peer: e,
                gid: t.gid,
                hash: t.tabs[e].hash
            })
            .then(function(e) {
                return t
            })
    }), t.flushHistory = o(function(e, t) {
        if ((0, St.isTabLoaded)(t, e)) {
            t.blockedFlagUpdates || (t.blockedFlagUpdates = {}), t.blockedFlagUpdates[e] = !0, x(t, t.tabs[e], !0, function(t) {
                return t.filter(function(t) {
                    return t !== e
                })
            }), t.tabs[e].unread > 0 && N(t, -1, e), 0 === t.unread_cnt && t.unread_only && toggleUnreadOnly(t);
            var n = t.tabs[e];
            n.deletedDialog = !0;
            var r = t.tabbedPeers.filter(function(t) {
                return t.peer !== e
            });
            return vt(r, !0, t), (0, yt.post)("al_im.php", {
                    act: "a_flush_history",
                    id: e,
                    from: "im",
                    gid: t.gid,
                    hash: t.tabs[e].hash
                })
                .then(function(r) {
                    var a = bt(r, 2);
                    a[0], a[1];
                    return delete t.blockedFlagUpdates[e], n.msgs = null, n.history = null, n.unread = 0, t.peer === e ? C(0, !1, t) : t
                })
        }
    }), t.updateChatTopic = o(function(e, t, n) {
        var r = n.tabs[e];
        return (0, yt.post)(kt, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_title: t,
                hash: r.hash
            })
            .then(function(t) {
                var a = bt(t, 2),
                    i = (a[0], a[1]);
                return n.tabs[e] = extend(r, i), n
            })
    }), t.addNewMember = o(function(e, t, n) {
        var r = n.tabs[e];
        return (0, yt.post)(kt, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_peer: t.join(","),
                hash: r.hash
            })
            .then(function(t) {
                var a = bt(t, 2),
                    i = (a[0], a[1]);
                return n.tabs[e] = extend(r, i), n
            })
    }), t.updateChatPhoto = o(function(e, t) {
        return e.kludges.source_act === St.CHAT_PHOTO_REMOVE ? (delete t.tabs[e.peerId].photo, Promise.resolve(t)) : (0, yt.post)(kt, {
                act: "a_get_chat_photo",
                msg_id: e.messageId
            })
            .then(function(n) {
                var r = bt(n, 2),
                    a = r[0],
                    i = r[1];
                t.chat_photo_msg = i;
                var s = t.tabs[e.peerId];
                if (t.tabs[e.peerId].photo = a, (0, St.isFullyLoadedTab)(t, e.peerId)) {
                    var o = e.kludges.source_act;
                    s.history = (0, St.addChatPhotoToUpdate)(e, o, t, l(s.history))
                }
                return t
            })
    }), t.leaveChat = o(function(e, t) {
        return (0, yt.post)(kt, {
                act: "a_leave_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Oe.bind(null, St.CHAT_KICK_USER, vk.id, e, t))
    }), t.returnToChat = o(function(e, t) {
        return (0, yt.post)(kt, {
                act: "a_return_to_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Oe.bind(null, St.CHAT_INVITE_USER, vk.id, e, t))
    }), t.toggleMutePeer = o(function(e, t, n) {
        return (0, yt.post)(kt, {
                act: "a_mute",
                peer: e,
                hash: n.tabs[e].hash,
                gid: n.gid,
                value: t
            })
            .then(function() {
                var r = t ? "mute" : "unmute";
                return window.Notifier && Notifier.lcSend("im", {
                    act: r,
                    peer: e
                }), n
            })
            .then(Be.bind(null, e, t))
    }), t.favMessage = o(function(e, t, n, r) {
        return Re(e, n, t, r), (0, yt.post)(kt, {
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
    }), t.toggleDialogImportant = o(function(e, t) {
        var n = St.FOLDER_MASKS[St.FOLDER_IMPORTANT],
            r = t.tabs[e].folders & n,
            a = r ? Tt.eventTypes.resetDirectoriesEvent : Tt.eventTypes.setDirectoriesEvent;
        return t.longpoll.push([a([0, e, n, !0])]), (0, yt.post)(kt, {
                act: "a_dialog_star",
                val: r ? 0 : 1,
                peer: e,
                hash: t.tabs[e].hash,
                gid: t.gid
            })
            .then(function() {
                return t
            })
    }), t.markDialogAnswered = o(function(e, t, n) {
        var r = St.FOLDER_MASKS[St.FOLDER_UNRESPOND];
        return n.longpoll.push([Tt.eventTypes.setDirectoriesEvent([0, e, r, !0]), Tt.eventTypes.readInboundEvent([6, e, t])]), (0, yt.post)(kt, {
                act: "a_mark_answered",
                peer: e,
                lastmsg: t,
                hash: n.tabs[e].hash,
                gid: n.gid
            })
            .then(function() {
                return n
            })
    }), t.deleteDialog = o(function(e, t) {
        return x(t, t.tabs[e], !0, function(t) {
                return t.filter(function(t) {
                    return t !== e
                })
            }), t.tabs[e].deletedDialog = !0, (0, yt.post)(kt, {
                act: "a_delete_dialog",
                peer: e,
                gid: t.gid,
                hash: t.tabs[e].hash
            })
            .then(function(n) {
                return n[0] && (t.tabs[e].unread = 0), n
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

    function r() {
        var e = {};
        return {
            scheduleNav: function(t) {
                e = extend(e, t)
            },
            commitNav: function() {
                n(e), e = {}
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.updateLocation = n, t.updateLazyLocation = r
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
                    return y.deleteEvent(e);
                case 1:
                    return y.replaceFlagsEvent(e);
                case 2:
                    return y.setFlagsEvent(e);
                case 3:
                    return y.resetFlagsEvent(e);
                case 4:
                    return y.addMessageEvent(e);
                case 6:
                    return y.readInboundEvent(e);
                case 7:
                    return y.readOutboundEvent(e);
                case 8:
                    return y.gotOnlineEvent(e);
                case 9:
                    return y.gotOfflineEvent(e);
                case 10:
                    return y.resetDirectoriesEvent(e);
                case 11:
                    return y.replaceDirectoriesEvent(e);
                case 12:
                    return y.setDirectoriesEvent(e);
                case 51:
                    return y.chatChangedEvent(e);
                case 61:
                    return y.typingUserEvent(e);
                case 62:
                    return y.typingChatEvent(e);
                case 70:
                    return y.videoCallEvent(e);
                case 80:
                    return y.unreadCountEvent(e);
                case 114:
                    return y.notifySettingsChangedEvent(e);
                case -1:
                    return y.resyncEvent();
                default:
                    return y.emptyEvent(e)
            }
        })
    }

    function s(e, t) {
        return Promise.resolve(extend({}, t, {
            timeout: 64 > e ? 2 * e : e
        }))
    }

    function o(e, t) {
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
            s = a.pause;
        switch (r.failed) {
            case 1:
                return (0, E.lplog)("Old timestamp, init resync", "error"), e.set(u.bind(null, i)), n([y.resyncEvent()]), e.set(p.loadLongPollTs)
                    .then(s)
                    .then(g.bind(null, e, t, n));
            case 2:
                return (0, E.lplog)("Key is incorrect", "error"), e.set(u.bind(null, i)), e.set(p.loadLongPollKey)
                    .then(s)
                    .then(g.bind(null, e, t, n));
            case 3:
                throw nav.reload({
                    force: !0
                }), new Error("ts is very wrong");
            default:
                return e.set(o.bind(null, r.ts))
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
        return (0, h.plainget)(a, {
                act: "a_check",
                key: r.imKey,
                version: 1,
                ts: r.imTs,
                wait: 25,
                mode: r.mode
            })
            .then(function(t) {
                return e.set(s.bind(null, 1)), JSON.parse(t)
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
                            s.bind(null, n() ? S / 2 : e.get()
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
            s = e.lhost,
            o = "main",
            u = new EventEmitter,
            d = (0, T.initQueue)(function(e, t) {
                return u.trigger("data", t), Promise.resolve({})
            }),
            g = d.pause,
            m = d.resume,
            p = d.pushMessage,
            _ = d.isPaused,
            h = d.reset,
            b = (0, v["default"])({
                id: t,
                gid: n,
                mode: w,
                timeout: 1,
                imKey: r,
                imTs: a,
                imPart: i,
                imUrl: s,
                pause: !1
            });
        return f(b, p.bind(null, o), _.bind(null, o)), {
            on: u.on.bind(u),
            off: u.off.bind(u),
            abortPauses: function() {
                return b.set(c)
            },
            stop: l.bind(null, b),
            pause: g.bind(null, o),
            resume: m.bind(null, o),
            reset: h.bind(null, o),
            push: p.bind(null, o)
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.eventTypes = void 0, t.startLongPoll = m;
    var p = n(73),
        _ = n(76),
        v = a(_),
        h = n(4),
        b = n(77),
        y = r(b),
        C = n(78),
        T = n(79),
        E = n(80),
        w = (t.eventTypes = y, 202),
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
        var t = I(e, 2),
            n = t[1];
        return {
            type: P,
            localId: n
        }
    }

    function r(e) {
        var t = I(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: A,
            messageId: n,
            mask: r,
            peerId: a
        }
    }

    function a(e) {
        var t = I(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: L,
            messageId: n,
            flags: r,
            peerId: a
        }
    }

    function i(e) {
        var t = I(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: D,
            messageId: n,
            flags: r,
            peerId: a
        }
    }

    function s(e) {
        for (var t = I(e, 9), n = t[1], r = t[2], a = t[3], i = t[4], s = t[5], o = t[6], l = t[7], u = t[8], c = [], d = 1; l["attach" + d + "_type"];) c.push({
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
            type: M,
            messageId: intval(n),
            flags: intval(r),
            peerId: intval(a),
            date: intval(i),
            attaches: c,
            subject: s,
            text: o,
            kludges: l,
            randomId: intval(u),
            userId: intval(a) > 2e9 ? intval(l.from) : intval(a)
        }
    }

    function o(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: x,
            peerId: n,
            upToId: r
        }
    }

    function l(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: O,
            peerId: n,
            upToId: r
        }
    }

    function u(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: B,
            userId: -n,
            platform: r
        }
    }

    function c(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: F,
            userId: -n,
            reason: r
        }
    }

    function d(e) {
        var t = I(e, 4),
            n = t[1],
            r = t[2],
            a = t[3],
            i = void 0 === a ? !1 : a;
        return {
            type: z,
            peerId: n,
            mask: r,
            local: i
        }
    }

    function g(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: q,
            peerId: n,
            mask: r
        }
    }

    function f(e) {
        var t = I(e, 4),
            n = t[1],
            r = t[2],
            a = t[3],
            i = void 0 === a ? !1 : a;
        return {
            type: K,
            peerId: n,
            mask: r,
            local: i
        }
    }

    function m(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: N,
            chatId: n,
            self: r
        }
    }

    function p(e) {
        var t = I(e, 2),
            n = t[1];
        return {
            type: R,
            userId: n,
            peerId: n
        }
    }

    function _(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: R,
            userId: n,
            peerId: r + 2e9
        }
    }

    function v(e) {
        var t = I(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: j,
            userId: n,
            callId: r
        }
    }

    function h(e) {
        var t = I(e, 2),
            n = t[1];
        return {
            type: U,
            count: n
        }
    }

    function b(e) {
        var t = I(e, 2),
            n = t[1],
            r = void 0 === n ? {} : n;
        return {
            type: H,
            peerId: r.peer_id,
            sound: r.sound,
            disabledUntil: r.disabled_until
        }
    }

    function y(e) {
        return {
            type: G,
            params: e
        }
    }

    function C(e) {
        return {
            type: W,
            state: e
        }
    }

    function T() {
        return {
            type: Q
        }
    }

    function E() {
        var e = arguments.length <= 0 || void 0 === arguments[0] ? !1 : arguments[0];
        return {
            type: Y,
            cancelSearch: e
        }
    }

    function w(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1],
            n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3];
        return {
            type: V,
            peerId: e,
            msgid: t,
            forward: n,
            cancelSearch: r
        }
    }

    function S(e) {
        return {
            type: $,
            tab: e
        }
    }

    function k(e) {
        var t = I(e, 6),
            n = (t[0], t[1]),
            r = t[2],
            a = t[3],
            i = t[4],
            s = t[5];
        return {
            type: Z,
            free: !!intval(n) || intval(i) === vk.id,
            resource: r,
            peerId: intval(a),
            who: intval(i),
            name: s
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var I = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    t.deleteEvent = n, t.replaceFlagsEvent = r, t.setFlagsEvent = a, t.resetFlagsEvent = i, t.addMessageEvent = s, t.readInboundEvent = o, t.readOutboundEvent = l, t.gotOnlineEvent =
        u, t.gotOfflineEvent = c, t.resetDirectoriesEvent = d, t.replaceDirectoriesEvent = g, t.setDirectoriesEvent = f, t.chatChangedEvent = m, t.typingUserEvent = p, t.typingChatEvent =
        _, t.videoCallEvent = v, t.unreadCountEvent = h, t.notifySettingsChangedEvent = b, t.emptyEvent = y, t.transitionEvent = C, t.resyncEvent = T, t.resetPeer = E, t.changePeer =
        w, t.changeTab = S, t.mutexEvent = k;
    var P = t.DELETE = "event_delete",
        L = t.SET_FLAGS = "event_set_flags",
        A = t.REPLACE_FLAGS = "event_replace_flags",
        D = t.RESET_FLAGS = "event_reset_flags",
        M = t.ADD_MESSAGE = "event_add_message",
        x = t.READ_INBOUND = "event_read_inbound",
        O = t.READ_OUTBOUND = "event_read_outbound",
        B = t.GOT_ONLINE = "event_got_online",
        F = t.GOT_OFFLINE = "event_got_offline",
        N = t.CHAT_CHANGED = "event_chat_changed",
        R = t.TYPING = "event_typing",
        j = t.VIDEO_CALL = "event_video_call",
        U = t.UNREAD_COUNT = "event_unread_count",
        H = t.NOTIFY_SETTINGS_CHANGED = "event_notify_settings_changed",
        G = t.EMPTY = "event_empty",
        z = t.RESET_DIRECTORIES = "event_reset_directories",
        q = t.REPLACE_DIRECTORIES = "event_replace_directories",
        K = t.SET_DIRECTORIES = "event_set_directories",
        Q = t.RESYNC = "event_resync",
        W = t.TRANSITION = "transition_event",
        Y = t.RESET_PEER = "reset_peer",
        Z = t.MUTEX = "mutex",
        V = t.CHANGE_PEER = "change_peer",
        $ = t.CHANGE_TAB = "evnt_change_tab";
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

    function s(e, t, n) {
        return n.queues[e] ? (t ? n.queues[e].errored = [] : n.queues[e].errored = n.queues[e].errored.concat(n.queues[e].evs), n.queues[e].evs = [], a(e, n)) : Promise.resolve(
            n)
    }

    function o(e, t) {
        var n = d(e, t.get())
            .errored;
        return n.length > 0 ? n[n.length - 1] : !1
    }

    function l(e, t, n, r) {
        var s = r.get()
            .queues[e];
        if (s && !s.currEv && s.evs.length > 0 && !s.pause) {
            var u = l.bind(null, e, t, n, r),
                c = s.evs.shift();
            s.currEv = c, t(e, c)
                .then(function() {
                    r.set(a.bind(null, e))
                })
                .then(u)["catch"](function(t) {
                    if ("" === t) try {
                        console.log(t), console.trace()
                    } catch (a) {}
                    return r.set(i.bind(null, e))
                        .then(function() {
                            n(e, o(e, r))
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
            o = Object.keys(r.get()
                .queues);
        return o.forEach(function(e) {
            r.set(i.bind(null, e)), r.set(s.bind(null, e, !1))
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
                return r.set(s.bind(null, n, !0))
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
            complete: function(e, t) {
                var n = r.get();
                n.queues[e].currEv && n.queues[e].currEv.rid === t && r.set(a.bind(null, e))
            },
            resume: function(n) {
                r.set(g.bind(null, n, !1))
                    .then((0, v.pause)(.1))
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
        v = n(78)
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

    function s(e, t) {
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

    function o(e) {
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
    }), t.throttleAccumulate = n, t.execuctionStackFilter = r, t.executionStackPush = a, t.executionStackPop = i, t.lplog = s, t.toArray = o, t.arrayUnique = l
}, function(e, t, n) {
    "use strict";

    function r(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t["default"] = e, t
    }

    function a(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function i(e, t) {
        var n = geByClass1(e, t),
            r = n.firstElementChild.offsetHeight !== n.parentNode.offsetHeight;
        r && setStyle(n.firstElementChild, {
            height: n.parentNode.offsetHeight
        })
    }

    function s(e, t) {
        var n = window.devicePixelRatio >= 2 ? "256" : "128";
        return t ? '<div class="im_sticker_row">\n      <a onmouseover="return Emoji.stickerOver(' + intval(e) + ', this);"\n        onclick="return Emoji.clickSticker(' +
            intval(t) + ', this, event);">\n          <img height="128"\n            class="im_gift"\n            src="/images/stickers/' + intval(e) + "/" + n +
            '.png"/>\n      </a>\n    </div>' : '<div class="im_sticker_row">\n      <img height="128"\n        class="im_gift"\n        src="/images/stickers/' + intval(e) +
            "/" + n + '.png"/>\n    </div>'
    }

    function o(e, t, n) {
        if (w(e.get(), t)) {
            var r = e.get()
                .tabs[t].deleted || [];
            return inArray(n, r)
        }
        return !1
    }

    function l(e, t, n) {
        var r = n.randomId,
            a = geByClass1("_im_mess_rid" + r, t);
        if (a) {
            var i = a.parentNode;
            if (a.parentNode.removeChild(a), 0 === domChildren(i)
                .length) {
                var s = gpeByClass("_im_mess_stack", i);
                s.parentNode.removeChild(s)
            }
            t = g(e, n, t, !0, !1)
        }
        return t
    }

    function u(e) {
        return getTemplate("im_preloader", {
            preloader: rs(vk.pr_tpl, {
                id: ""
            }),
            cls: "im-preloader_attach im-preloader_visible im-preloader_" + e
        })
    }

    function c(e) {
        var t = e.split(".");
        return (t[0] < 10 ? "0" : "") + t[0] + (t[1] < 10 ? "0" : "") + t[1] + t[2]
    }

    function d(e) {
        var t = geByClass1("_im_invisible_bar", e);
        t && (removeClass(t, "_im_invisible_bar"), removeClass(t, "im-page--history-new-bar_hide"))
    }

    function g(e, t, n) {
        var r = (arguments.length <= 3 || void 0 === arguments[3] ? !0 : arguments[3], arguments.length <= 4 || void 0 === arguments[4] ? !0 : arguments[4]),
            a = e.tabs[t.peerId];
        if (geByClass1("_im_mess", n) || geByClass1("_im_bar_date", n) || (n.innerHTML = ""), a.skipped > 0) return n;
        var i = "",
            o = "",
            l = ["_im_mess"],
            c = [];
        t.local || (c = e.imQueue(t.peerId, r)), c.length > 0 && j(c.map(function(e) {
                return geByClass1("_im_mess_rid" + e.rid, n)
            }, n)
            .filter(function(e) {
                return e
            })), t.flags & Ae.eventTypes.FLAG_OUTBOUND && t.flags & Ae.eventTypes.FLAG_UNREAD && l.push("im-mess_unread _im_mess_unread");
        var g = Date.now() - 1e3 * t.date > 1e3;
        t.local && g && l.push("im-mess_sending"), t.local && l.push("" + Be), t.failed && l.push("im-mess_failed " + Fe);
        var m = t.attaches[0] && "gift" === t.attaches[0].type,
            p = t.attaches[0] && "chronicle_invite" === t.attaches[0].type;
        m && l.push("im-mess_gift");
        var _ = t.attaches.map(function(e) {
                return "sticker" === e.type ? s(e.id, e.productId) : u(e.type)
            }),
            v = I(t.text, t.kludges);
        t.subject && "..." !== t.subject.trim() && !b(t.peerId) && (v = getTemplate("im_topic", {
            topic: t.subject
        }) + v);
        var h = getTemplate("im_message_media", {
            messageId: t.messageId,
            attaches: _.join(""),
            text: '<div class="im_msg_text">' + (m ? v : "") + "</div>"
        });
        m || (h = v + h);
        var y = getTemplate("im_msg_row", {
                msg_id: t.messageId,
                from_id: t.peerId,
                text: h,
                ts: t.date,
                cls: l.join(" ")
            }),
            C = domLC(n);
        (hasClass(C, Ue) || hasClass(C, je)) && (C = domPS(C));
        var T = geByClass("_im_mess", n)
            .pop(),
            E = C ? intval(domData(C, "peer")) : 0,
            w = T ? 1e3 * intval(domData(T, "ts")) : 0,
            P = C ? intval(domData(C, "admin")) : !1,
            L = t.flags & Ae.eventTypes.FLAG_OUTBOUND ? e.id : t.userId,
            A = t.flags & Ae.eventTypes.FLAG_OUTBOUND;
        if (S(A, a.unread, E, w, L, t, P, e.gid) || m) {
            var D = "",
                M = !1;
            if (e.peer === t.peerId && !a.inplaceSearch || a.unread || t.flags & Ae.eventTypes.FLAG_OUTBOUND || (D += getTemplate("im_mess_bar", {}), M = !0), !isToday(new Date(
                    w)) && (t.local && r || !t.local && r)) {
                var x = new Date,
                    O = M ? "im-page--history-new-bar_hide _im_invisible_bar" : "";
                D += getTemplate("im_day_bar", {
                    day: getShortDate(t.date, !1, !0, getLang("months_of", "raw")),
                    date: t.date,
                    day_class: x.getDate() + x.getMonth() + x.getFullYear() + " " + O
                })
            }
            if (K(t)) D += getTemplate("im_service_row", {
                text: W(t, a),
                type: "",
                date: t.date,
                from_id: "",
                message_id: t.messageId
            });
            else {
                i = b(t.peerId) ? a.data.members[L].name : A ? e.name : a.name;
                var B = 1;
                B = b(t.peerId) ? intval(a.data.members[L].sex) : A ? e.im_sex : intval(a.sex), o = b(t.peerId) ? a.data.members[L].photo : A ? e.photo : a.photo;
                var F;
                F = A ? e.author_link : b(t.peerId) ? a.data.members[L].link : a.href;
                var N = getTemplate("im_mess_stack_name", {
                    name: i,
                    link: F
                });
                if (m) {
                    var R = getLang("mail_gift_message_sent", "raw");
                    N += ' <span class="im-mess-stack--gift">' + langSex(B, R) + "</span>"
                }
                p && (N += " " + getLang("mail_chronicle_invite_inf"));
                var U = intval(t.kludges.from_admin),
                    H = e.gid ? "/gim" + e.gid : "/im";
                if (t.local) var G = k(t.date);
                else var G = getTemplate("im_stack_date", {
                    date: k(t.date),
                    link: H + "?sel=" + t.peerId + "&msgid=" + t.messageId
                });
                if (e.gid && A && e.admins[U]) {
                    var z = e.admins[U],
                        i = U === vk.id ? getLang("mail_by_you") : z[0];
                    G = G + " " + getTemplate("im_admin_link", {
                        name: i,
                        href: z[1]
                    })
                }
                D += getTemplate("im_mess_stack", {
                    photo: o,
                    href: F,
                    cls: "",
                    date_attr: "",
                    link: "/im?sel=" + t.peerId + "&msgid=" + t.messageId,
                    name: N,
                    peerId: L,
                    date: G,
                    messages: y,
                    admin: t.kludges.from_admin || 0
                })
            }(0, Oe.toArray)(sech(D))
            .forEach(function(e) {
                return n.appendChild(e)
            })
        } else {
            var q = geByClass1("_im_unread_bar_row", n);
            q && e.peer === t.peerId && !a.inplaceSearch && (q.parentNode.removeChild(q), d(n)), geByClass1("_im_stack_messages", C)
                .appendChild(se(y))
        }
        return t.flags & Ae.eventTypes.FLAG_OUTBOUND && !g && setTimeout(function() {
            var e = geByClass1("_im_mess_" + t.messageId, n);
            hasClass(e, Be) && addClass(e, "im-mess_sending")
        }, 500), c = c.filter(function(e) {
            return e.rid !== t.randomId
        }), f(c, e, n)
    }

    function f(e, t, n) {
        var r;
        return r = "object" === ("undefined" == typeof e ? "undefined" : Le(e)) ? e : t.imQueue(e, !1), r.length > 0 && r.map(function(e) {
                return e.mess.failed = !!e.failed, e.mess
            })
            .forEach(function(e) {
                return g(t, e, n, !1)
            }), n
    }

    function m(e, t, n) {
        var r = e.tabs[t];
        return (0, Oe.toArray)(geByClass("_im_mess_unread", n))
            .forEach(function(e) {
                var t = intval(domData(e, "msgid"));
                t > 0 && r.out_up_to >= t && (removeClass(e, "_im_mess_unread"), removeClass(e, "im-mess_unread"))
            }), n
    }

    function p(e, t, n) {
        var r = geByClass1("_im_msg_media" + t.messageId, e);
        return r && (r.innerHTML = n.tabs[t.peerId].mediacontent[t.messageId][0]), e
    }

    function _(e, t) {
        if (!E(t, e.peerId)) return 0;
        var n = t.tabs[e.peerId];
        return n.msgs[e.messageId] ? 1 : n.msgs["rid" + e.randomId] ? 2 : 0
    }

    function v(e) {
        return e >= -5 && 0 >= e ? !0 : !1
    }

    function h(e) {
        return e > 0 && 2e9 > e
    }

    function b(e) {
        return e > 2e9
    }

    function y(e) {
        return e > -2e9 && 0 > e
    }

    function C(e) {
        return -2e9 > e
    }

    function T(e, t) {
        return e === t.peer
    }

    function E(e, t) {
        return e = ye(e), e.tabs[t] && e.tabs[t].msgs && e.tabs[t].history ? !0 : !1
    }

    function w(e, t) {
        return e.tabs[t] ? !0 : !1
    }

    function S(e, t, n, r, a, i, s, o) {
        return n !== a ? !0 : o && s !== intval(i.kludges.from_admin) ? !0 : Date.now() - r > 3e5 ? !0 : t || e || a === vk.id ? K(i) ? !0 : isToday(new Date(r)) ? !1 : !0 :
            !0
    }

    function k(e) {
        var t = new Date(1e3 * e);
        return isToday(t) ? langDate(1e3 * e, "{hour}:{minute} {am_pm}", 0, [], !0) : langDate(1e3 * e, "{day}.{month}.{short_year}", 0, [0, "01", "02", "03", "04", "05",
            "06", "07", "08", "09", "10", "11", "12"
        ], !0)
    }

    function I(e, t, n) {
        return e = (e || "")
            .replace(Me.MESSAGE_REGEXP, function() {
                var e = Array.prototype.slice.apply(arguments),
                    t = e[1] || "",
                    r = e[2] || "http://",
                    a = e[3] || "",
                    i = a + (e[4] || ""),
                    s = (e[2] || "") + e[3] + e[4];
                if (-1 == a.indexOf(".") || -1 != a.indexOf("..")) return e[0];
                var o = a.split(".")
                    .pop();
                if ((o.length > 7 || -1 == indexOf(Me.TOP_DOMAINS.split(","), o)) && (!/^[a-zA-Z]+$/.test(o) || !e[2])) return e[0];
                if (-1 != e[0].indexOf("@")) return e[0];
                try {
                    s = decodeURIComponent(s)
                } catch (l) {}
                if (s.length > 55 && (s = s.substr(0, 53) + ".."), s = clean(s)
                    .replace(/&amp;/g, "&"), !n && a.match(Me.OUR_DOMAINS)) {
                    i = replaceEntities(i)
                        .replace(Me.ENTITIES, encodeURIComponent);
                    var u, c = i,
                        d = i.indexOf("#/"),
                        g = "";
                    return d >= 0 ? c = i.substr(d + 1) : (d = i.indexOf("#!"), d >= 0 && (c = "/" + i.substr(d + 2)
                            .replace(/^\//, ""))), u = c.match(Me.VK_DOMAIN), u && u[1].length < 32 && (g = ' mention_id="' + u[1] +
                            '" onclick="return mentionClick(this, event)" onmouseover="mentionOver(this)"'), t + '<a href="' + (r + i)
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;") + '" target="_blank"' + g + ">" + s + "</a>"
                }
                return t + '<a href="away.php?utf=1&to=' + encodeURIComponent(r + replaceEntities(i)) + '" target="_blank" onclick="return goAway(\'' + clean(r + i) +
                    "', {}, event);\">" + s + "</a>"
            }), e = e.replace(Me.EMAIL, function(e) {
                return '<a href="/write?email=' + e + '" target="_blank">' + e + "</a>"
            }), t.emoji && (e = Emoji.emojiToHTML(e, !0)), e
    }

    function P(e) {
        return b(e) ? "c" + (e - 2e9) : C(e) ? "e" + Math.abs(e + 2e9) : e
    }

    function L(e) {
        var t = e.substr(0, 1);
        switch (t) {
            case "e":
                return -2e9 - intval(e.substr(1));
            case "c":
                return 2e9 + intval(e.substr(1));
            default:
                return intval(e)
        }
    }

    function A(e, t) {
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
            block: {
                icon: "block",
                name: getLang("mail_block_user")
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

    function D(e, t) {
        var n = '<img src="' + e + '" alt="" class="dialogs_inline_chatter dialogs_inline_chatter_half"/>';
        return t && (n = getTemplate("im_dialogs_link", {
            href: t,
            photo: n
        })), '<div class="im_grid">\n    <div class="dialogs_inline_chatter dialogs_inline_chatter_half">\n      ' + n + "\n    </div>\n  </div>"
    }

    function M(e, t) {
        var n = '<img src="' + e + '" alt="" class="dialogs_inline_chatter"/>';
        return t && (n = getTemplate("im_dialogs_link", {
            href: t,
            photo: n
        })), '<div class="im_grid">\n    <div class="dialogs_inline_chatter">\n      ' + n + "\n    </div>\n  </div>"
    }

    function x(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1];
        if ("string" == typeof e) return '<div class="im_grid"><img src="' + e + '" alt=""/></div>';
        switch (e.length) {
            case 1:
                return '<div class="im_grid""><img src="' + e[0] + '" alt=""/></div>';
            case 2:
                return e.map(function(e, n) {
                        return D(e, t[n])
                    })
                    .join("");
            case 3:
                return D(e[0], t[0]) + e.slice(1)
                    .map(function(e, n) {
                        return M(e, t[n + 1])
                    })
                    .join("");
            case 4:
                return e.map(function(e, n) {
                        return M(e, t[n])
                    })
                    .join("")
        }
    }

    function O(e, t) {
        if (e.photo) return '<a href="javascript:void(0)">\n      <div class="im_grid">\n        <img src="' + e.photo + '" alt="" />\n      </div>\n    </a>';
        var n = [];
        n = e.data.active ? (0, Oe.toArray)(e.data.active)
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
        return i = t ? [] : i, x(a, i)
    }

    function B() {
        return '<li class="im-page--messages-search">' + getLang("mail_search_messages") + "</li>"
    }

    function F(e, t, n) {
        var r = geByClass1("_im_mess_" + t.messageId, n);
        return r && addClass(r, "im-mess_failed " + Fe), n
    }

    function N(e, t, n) {
        var r = geByClass1("_im_mess_" + t, n);
        return r && (removeClass(r, "im-mess_failed"), removeClass(r, Fe)), n
    }

    function R(e, t) {
        var n = e.map(function(e) {
                return geByClass1("_im_mess_" + e, t)
            })
            .filter(function(e) {
                return e
            });
        return j(n, t)
    }

    function j(e, t) {
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

    function U(e, t, n, r) {
        return e.map(function(e) {
                return geByClass1("_im_mess_" + e, r)
            })
            .filter(function(e) {
                return e
            })
            .forEach(function(e) {
                val(e, z(t, e, n)), addClass(e, "im-mess_light")
            }), r
    }

    function H(e, t, n) {
        var r = geByClass1("_im_mess_" + e, n);
        if (r) {
            var a = geByClass1(Ne, r);
            val(r, a.innerHTML), removeClass(r, "im-mess_light")
        }
        return n
    }

    function G(e, t, n, r) {
        var a = arguments.length <= 4 || void 0 === arguments[4] ? 2 : arguments[4],
            i = r.tabs[t];
        if (!e) return "";
        var s = Object.keys(e)
            .sort(function(t, n) {
                return e[n] - e[t]
            });
        if (0 === s.length) return "";
        if (h(t) || y(t)) {
            var o = n ? "" : i.name;
            return o + " " + getLang("mail_typing")
        }
        var l = getLang("mail_typing_several", s.length),
            u = s.slice(0, s.length > a ? a : a - 1)
            .map(function(e) {
                return i.data.members[e].short_name
            })
            .join(", ");
        if (s.length > a) {
            var c = s.length - a;
            u += " " + getLang("mail_and_peer")
                .replace("{count}", c)
                .replace("{typing}", l)
        } else {
            var d = !!u;
            if (d && s[a - 1] && (u += " " + getLang("mail_and_peer_one") + " "), d && s.length !== a || !s[a - 1]) var o = "";
            else var o = i.data.members[s[a - 1]].short_name;
            u += o + " " + l
        }
        return u
    }

    function z(e, t, n) {
        var r = t.innerHTML,
            a = "delete" === n ? "mail_deleted_stop" : "mail_marked_as_spam";
        return '<div class="im-mess--text">\n    ' + getLang(a) + ' <button type="button" data-peer="' + e + '" class="' + Re + ' im-mess--btn">' + getLang("mail_restore") +
            '</button>\n    <div class="' + Ne + ' im-mess--original">' + r + "</div>\n  </div>"
    }

    function q() {
        return '<div class="im-page--chat-search-empty">\n    ' + getLang("mail_im_search_empty") + "\n  </div>"
    }

    function K(e) {
        return e.kludges && "undefined" != typeof e.kludges.source_act
    }

    function Q(e, t, n) {
        return n ? '<a class="im_srv_lnk" target="_blank" href="' + e + '">' + t + "</a>" : "<span>" + t + "</span>"
    }

    function W(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !0 : arguments[2],
            r = e.kludges,
            a = r.source_act,
            i = intval(r.source_mid),
            s = e.userId,
            o = t.data.members[s],
            l = "",
            u = s === i;
        switch (a) {
            case He:
                l = "mail_im_chat_created";
                break;
            case Ge:
                l = "mail_im_title_updated";
                break;
            case ze:
                l = u ? "mail_im_returned_to_chat" : "mail_im_invited";
                break;
            case qe:
                l = u ? "mail_im_left" : "mail_im_kicked_from_chat";
                break;
            case Ke:
                l = "mail_im_photo_set";
                break;
            case Qe:
                l = "mail_im_photo_removed";
                break;
            default:
                return ""
        }
        if (l = langSex(o.sex, getLang(l, "raw")), l = l.replace("{from}", Q(o.link, o.name, n)), i && i !== s) {
            var c = r.source_email;
            if (c) l = l.replace("{user}", Q("/im?email=${encodeURIComponent(email)", "email", n));
            else {
                var d = t.data.members[i],
                    g = a === qe ? d.name_kick_case : d.name_inv_case;
                l = l.replace("{user}", Q(d.link, g, n))
            }
        }
        return r.source_text && (l = l.replace("{title}", '&laquo;<b class="im_srv_lnk">' + r.source_text + "</b>&raquo;")), l
    }

    function Y(e, t, n, r) {
        if (t === Ke) {
            var a = geByClass1("_im_mess_" + e.messageId, r);
            if (a) {
                var i = n.tabs[e.peerId];
                a.parentNode.innerHTML = getTemplate("im_msg_row", {
                    msg_id: e.messageId,
                    from_id: e.peerId,
                    text: W(e, i) + n.chat_photo_msg,
                    ts: e.date,
                    cls: "im-mess_srv"
                })
            }
        }
        return r
    }

    function Z(e) {
        return e.replace(/&lt;&lt;/g, "&laquo;")
            .replace(/&gt;&gt;/g, "&raquo;")
            .replace(/ \-\-/g, " &mdash;")
            .replace(/\-\- /g, "&mdash; ")
    }

    function V(e, t) {
        return t ? !1 : e === vk.id
    }

    function $(e, t) {
        return e.tt = !1, showTooltip(e, {
            url: y(t) ? "al_groups.php" : "al_profile.php",
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

    function X(e) {
        return (0, Oe.toArray)(geByClass("page_media_link_img", e))
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

    function J(e) {
        return function(t) {
            var n = arguments.length <= 1 || void 0 === arguments[1] ? "bottom" : arguments[1],
                r = arguments.length <= 2 || void 0 === arguments[2] ? "" : arguments[2],
                a = se(getTemplate("im_preloader", {
                    preloader: rs(vk.pr_tpl, {
                        id: ""
                    }),
                    cls: ["bottom" === n ? "im-preloader_bottom" : "im-preloader_top", r].join(" ")
                })),
                i = !1;
            setTimeout(function() {
                i || ("bottom" === n ? e.appendChild(a) : e.insertBefore(a, domFC(e)), addClass(a, "im-preloader_visible"))
            }, 0), t.then(function() {
                i = !0, removeClass(a, "im-preloader_visible"), a.parentNode && a.parentNode.removeChild(a)
            })
        }
    }

    function ee(e, t) {
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

    function te(e, t) {
        var n = e;
        if (!t && !n) return !1;
        var r = n.target || n.srcElement,
            a = 4,
            i = !1,
            s = /_im_mess|im_log_act|im_log_ract|_im_log_body|im_log_rspacer|page_media_link_desc/;
        do
            if (!r || r.onclick || r.onmousedown || "A" == r.tagName || "IMG" == r.tagName && !hasClass(r, "emoji") && !hasClass(r, "emoji_css") && !hasClass(r, "im_gift") ||
                "TEXTAREA" == r.tagName || hasClass(r, "play_new") || (i = s.test(r.className))) break;
        while (a-- && (r = r.parentNode));
        if (!i) return !0;
        var o = trim((window.getSelection && window.getSelection() || document.getSelection && document.getSelection() || document.selection && document.selection.createRange()
                .text || "")
            .toString());
        return o ? !0 : !1
    }

    function ne(e, t) {
        return '<div class="im-mess--text">\n      <span>' + getLang("mail_restored") + '</span>\n      <a class="_im_go_to" href="/im?sel=' + P(e) + "&msgid=" + t + '">' +
            getLang("mail_im_goto_conversation") + "</a>\n    </div>"
    }

    function re(e, t) {
        return showFastBox({
            title: getLang("mail_deleteall1"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, e > 2e9 ? getLang("mail_chat_sure_to_delete_all") : getLang("mail_sure_to_delete_all"), getLang("mail_delete"), t, getLang("global_cancel"))
    }

    function ae(e, t, n, r, a) {
        t.showProgress(), e.set(r.bind(null, a))
            .then(function() {
                t.hideProgress(), t.hide(), n()
                    .removePeer(e, a), n()
                    .updateDialogFilters(e)
            })
    }

    function ie(e, t, n, r, a) {
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
                r.setControlsText('<button type="button" class="im-page-btn _im_invite_box">' + getLang("mail_im_create_chat_with") + "</button>"), (0, xe.addDelegateEvent)
                    (r.bodyNode.parentNode, "click", "_im_invite_box", function() {
                        r.hide(), oe(e, e.get()
                            .peer, t, n)
                    })
            }
        }, r)
    }

    function oe(e, t, n, r) {
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

    function le(e, t, n) {
        if (e.get()
            .active_tab === Ze && 0 === e.get()
            .unread_cnt) return !1;
        var r = e.get()
            .active_tab === Ze ? Ye : Ze;
        return e.set(n.bind(null, r))
            .then(function(e) {
                t()
                    .restoreDialogs(e, !0)
            })
    }

    function ue(e, t, n, r) {
        return t.get()
            .active_tab === e ? !1 : (t.set(r.bind(null, e))
                .then(function(e) {
                    n()
                        .restoreDialogs(e, !0)
                }), !0)
    }

    function ce(e, t) {
        "undefined" == typeof t && (t = e.get()
            .peer);
        var n = e.get()
            .tabs[t];
        return Xe[$e] & n.folders
    }

    function de(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2];
        if ("undefined" == typeof t && (t = e.get()
                .peer), !Ee(e)) return !1;
        var r = n || e.get()
            .tabs[t];
        return !(Xe[Ve] & r.folders)
    }

    function ge(e, t) {
        return (t.get()
                .block_states[e] || {})
            .free === !1
    }

    function fe(e) {
        return e.get()
            .pendingForward && e.get()
            .pendingForward.length > 0
    }

    function me(e, t) {
        return (t.get()
                .block_states[e] || {})
            .who === vk.id
    }

    function pe(e, t) {
        var n = e.get()
            .block_states;
        Object.keys(n)
            .forEach(function(r) {
                n[r].time ? n[r].free === !1 && Date.now() - n[r].time >= 5e4 && t.push([Ae.eventTypes.mutexEvent([, 1, "gim" + e.get()
                    .gid, r, 0, ""
                ])]) : n[r].time = Date.now()
            })
    }

    function _e(e, t, n) {
        var r;
        return !showTabbedBox("al_im.php", {
            act: "a_spam",
            offset: "0",
            gid: e.get()
                .gid
        }, {
            onDone: function(n, a) {
                a && (r = t(n, e, a))
            },
            params: {
                width: 638,
                onHide: function() {
                    r.unmount()
                }
            }
        }, n)
    }

    function ve(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3],
            a = e.get()
            .tabs[t];
        if (!a.last_act) return {
            str: "",
            time: ""
        };
        var i = getDateText(a.last_act[0], 0),
            s = langSex(a.sex, getLang("mail_last_activity_tip", "raw"))
            .replace("{user}", n ? a.name : "")
            .replace("{time}", i);
        return a.last_act_mobile && (s += he(t, r)), {
            str: getTemplate("im_last_act", {
                lastact: s
            }),
            time: i
        }
    }

    function he(e, t) {
        var n;
        return getTemplate("im_wrap_mobile", (n = {}, a(n, "class", "im_status_mob_onl"), a(n, "params", "mid: " + e + ", was: 1," + (t ? "forcetoup: true" :
            "forcetodown: true")), a(n, "attrs", ""), n))
    }

    function be(e, t) {
        return showBox("groupsedit.php", {
            act: "bl_edit",
            name: "/id" + e,
            gid: t.get()
                .gid
        }, {
            stat: ["page.css", "ui_controls.js", "ui_controls.css"],
            dark: 1
        })
    }

    function ye(e) {
        return e.get ? e.get() : e
    }

    function Ce(e) {
        var t = ye(e);
        return t.gid || t.isClassic
    }

    function Te(e) {
        return ye(e)
            .gid
    }

    function Ee(e) {
        return ye(e)
            .gid
    }

    function we(e) {
        return ye(e)
            .gid
    }

    function Se(e) {
        return e.get()
            .gid ? "/gim" + e.get()
            .gid : "/im"
    }

    function ke(e, t, n, r) {
        var a;
        return !showTabbedBox("al_im.php", {
            act: "a_important",
            offset: "0"
        }, {
            onDone: function(r, i) {
                i && (a = n(r, e, t, i))
            },
            params: {
                width: 638,
                onDestroy: function() {
                    a && a.unmount()
                }
            }
        }, r)
    }

    function Ie(e, t) {
        var n = ye(t);
        return n.tabs[e] || n.mapped_index[e]
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.selectionRemove = t.FOLDER_MASKS = t.FOLDERS = t.FOLDER_IMPORTANT = t.FOLDER_UNRESPOND = t.FOLDER_ALL = t.FOLDER_UNREAD = t.SHOW_CHAT_MEMBERS_CLASS = t.DESLECT_ALL_CLASS =
        t.CHAT_PHOTO_REMOVE = t.CHAT_PHOTO_UPDATE = t.CHAT_KICK_USER = t.CHAT_INVITE_USER = t.CHAT_TITLE_ACTION = t.CREATE_CHAT_ACTION = t.TYPING_CLASS = t.LAST_ACT_CLASS =
        t.RESTORE_CLASS = t.ORIGINAL_CLASS = t.FAILED_CLASS = t.SENDING_CLASS = void 0;
    var Pe, Le = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
    };
    t.fixTableCellChildHeight = i, t.renderSticker = s, t.isAlreadyDeleted = o, t.replaceMessageAttrs = l, t.renderAttach = u, t.dayFromVal = c, t.showInvisibleBar = d, t.appendToHistory =
        g, t.restoreQueue = f, t.markMessagesAsRead = m, t.replaceAttaches = p, t.isDuplicate = _, t.isReservedPeer = v, t.isUserPeer = h, t.isChatPeer = b, t.isComunityPeer =
        y, t.isPeerActive = T, t.isFullyLoadedTab = E, t.isTabLoaded = w, t.parseMessage = I, t.convertPeerToUrl = P, t.unUrlPeer = L, t.chatActions = A, t.renderPhotos =
        x, t.renderPhotosFromTab = O, t.renderMessagesSearch = B, t.setMessageError = F, t.startResendMessage = N, t.removeMessages = R, t.removeMessagesWithRestore = U, t
        .restoreMessage = H, t.formatTyper = G, t.renderEmptySearch = q, t.isServiceMsg = K, t.renderServiceMsg = W, t.addChatPhotoToUpdate = Y, t.replaceSpecialSymbols =
        Z, t.isSelfMessage = V, t.showVerifiedTooltip = $, t.fixSnippetsHeight = X, t.wrapLoading = J, t.tabFromIds = ee, t.checkSelectClick = te, t.renderGoTo = ne, t.showFlushDialog =
        re, t.cleanHistory = ae, t.showChatMembers = ie, t.inviteUser = oe, t.showUnreadOnly = le, t.changeTab = ue, t.isImportant = ce, t.isUnrespond = de, t.isPeerBlocked =
        ge, t.isPendingForward = fe, t.isPeerBlockedByMe = me, t.blockLatencyCompensation = pe, t.showSpamLayer = _e, t.getLastTime = ve, t.getMobileIcon = he, t.showBlacklistBox =
        be, t.isClassicInterface = Ce, t.isLocksAvailable = Te, t.isFoldersAvailable = Ee, t.isCommunityInterface = we, t.getBaseLink = Se, t.showFavvedBox = ke, t.getBareTab =
        Ie;
    var Ae = n(75),
        De = n(82),
        Me = r(De),
        xe = n(5),
        Oe = n(80),
        Be = t.SENDING_CLASS = "_im_mess_sending",
        Fe = t.FAILED_CLASS = "_im_mess_faild",
        Ne = t.ORIGINAL_CLASS = "_im_mess_original",
        Re = t.RESTORE_CLASS = "_im_mess_restore",
        je = t.LAST_ACT_CLASS = "_im_last_act",
        Ue = t.TYPING_CLASS = "_im_typing",
        He = t.CREATE_CHAT_ACTION = "chat_create",
        Ge = t.CHAT_TITLE_ACTION = "chat_title_update",
        ze = t.CHAT_INVITE_USER = "chat_invite_user",
        qe = t.CHAT_KICK_USER = "chat_kick_user",
        Ke = t.CHAT_PHOTO_UPDATE = "chat_photo_update",
        Qe = t.CHAT_PHOTO_REMOVE = "chat_photo_remove",
        We = t.DESLECT_ALL_CLASS = "_im_deselect_all",
        Ye = (t.SHOW_CHAT_MEMBERS_CLASS = "_im_show_chat_mems", t.FOLDER_UNREAD = "unread"),
        Ze = t.FOLDER_ALL = "all",
        Ve = t.FOLDER_UNRESPOND = "unrespond",
        $e = t.FOLDER_IMPORTANT = "important",
        Xe = (t.FOLDERS = [Ze, Ye, Ve, $e], t.FOLDER_MASKS = (Pe = {}, a(Pe, Ve, 2), a(Pe, $e, 1), Pe));
    t.selectionRemove = '<span class="im-deselect ' + We + '"></span>'
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
        return n.ids = {}, n.scrolls = t, n.activated = !0, a(n.elements, e, n), Promise.resolve(n)
    }

    function s(e) {
        return e.activated = !1, Promise.resolve(e)
    }

    function o(e) {
        return e.activated = !0, Promise.resolve(e)
    }

    function l(e, t, n) {
        return n.elements = e, n.ids = {}, n._sortedEls = !1, a(e, t, n), Promise.resolve(n)
    }

    function u(e, t, n) {
        return n.elements = n.elements.filter(function(n) {
            return t(n) !== e
        }), delete n.ids[e], Promise.resolve(n)
    }

    function c(e, t, n) {
        var r = [];
        n.elements = n.elements.map(function(n) {
            var a = t(n);
            r.push(a);
            var i = e.filter(function(e) {
                return t(e) === a
            })[0];
            return i ? i : n
        });
        var a = e.filter(function(e) {
            return !inArray(t(e), r)
        });
        return n.elements = n.elements.concat(a), Promise.resolve(n)
    }

    function d(e) {
        return e.offset += e.limit, Promise.resolve(e)
    }

    function g(e, t) {
        return t.offset = e, Promise.resolve(t)
    }

    function f(e) {
        return e.stop = !0, Promise.resolve(e)
    }

    function m(e) {
        return e.stop = !1, Promise.resolve(e)
    }

    function p(e, t) {
        return t.pipeId = e, Promise.resolve(t)
    }

    function _(e, t) {
        return t._sortedEls || !e ? t.elements : (t.elements = t.elements.sort(e), t._sortedEls = !0, t.elements)
    }

    function v(e, t) {
        return "undefined" != typeof e && t.elements.length > 0 && (t.scrolled = e), Promise.resolve(t)
    }

    function h(e) {
        var t = {};
        return e.forEach(function(e) {
                "r" === e[0] && t["a," + e[1]] ? delete t["a," + e[1]] : t[e[0] + "," + e[1]] = e
            }), Object.keys(t)
            .map(function(e) {
                return t[e]
            })
    }

    function b(e, t) {
        for (var n = [], r = Math.max(e.length, t.length), a = 0; r > a; a++) {
            if (e[a]) var i = e[a];
            if (t[a]) var s = t[a];
            !i && s ? n.push(["a", s, a]) : i && !s ? n.push(["r", i, a]) : i !== s && (n.push(["r", i, a]), n.push(["a", s, a])), i = !1, s = !1
        }
        var o = h(n),
            l = h(n.reverse());
        return o.length > l.length ? l : o
    }

    function y(e, t, n, r, a, i) {
        for (var s = 0; r > s; s++) e = domNS(e);
        var o = se(a(t));
        return domData(o, "list-id", n), e ? i.insertBefore(o, e) : i.appendChild(o), e
    }

    function C(e, t, n, r) {
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
                for (var s = a.shift(), o = s[2], l = y(e.children[o], n[s[2]], s[1], 0, r, e), u = 0; u < a.length; u++) {
                    s = a[u];
                    var c = n[s[2]];
                    l = y(e.children[o], c, s[1], s[2] - o, r, e), o = s[2]
                }
        }
    }

    function T(e, t) {
        e.get()
            .loading ? t.update(!1, !0) : (e.get()
                .loading = !0, t.update(!1, !0), e.get()
                .loading = !1)
    }

    function E(e, t, n, r, a) {
        var i = r.get()
            .limit,
            s = r.get()
            .offset,
            o = (n()
                .sortFn, _(n()
                    .sortFn, r.get()));
        o = o.slice(0, s + i);
        var l = (0, O.toArray)(e.children)
            .map(function(e) {
                return domData(e, "list-id")
            }),
            u = o.map(function(e) {
                return n()
                    .idFn(e)
                    .toString()
            }),
            c = b(l, u);
        C(e, c, o, n()
            .renderFn), T(r, t);
        var d = c.filter(function(e) {
                return "a" == e[0]
            })
            .map(function(e) {
                return parseInt(e[1])
            });
        return a ? [d] : void 0
    }

    function w(e, t) {
        if (e.get()
            .loading || e.get()
            .stop || !e.get()
            .activated) return Promise.resolve([]);
        Math.random();
        e.get()
            .loading = !0;
        for (var n = arguments.length, r = Array(n > 2 ? n - 2 : 0), a = 2; n > a; a++) r[a - 2] = arguments[a];
        return t.apply(void 0, r)
            .then(function(t) {
                e.get()
                    .loading = !1
            })
    }

    function S(e, t, n) {
        return n.scrolls || (n.scrolls = {}), (!n.scrolls[e] || t) && (n.scrolls[e] = {
            scrolled: n.scrolled || 0,
            scrollItem: n.scrollItem
        }), Promise.resolve(n)
    }

    function k(e, t) {
        return delete t.scrolls[e], Promise.resolve(t)
    }

    function I(e, t, n, r, a) {
        var i = e.get()
            .elements,
            s = e.set(d)
            .then(function(r) {
                var s, o = e.get()
                    .offset,
                    l = e.get()
                    .limit;
                return l + o > i.length ? s = n()
                    .more(o, l)
                    .then(function(t) {
                        return t === !1 ? [] : (0 === t.length && e.set(f), t)
                    })
                    .then(L.bind(null, e, t, a, n, e.get()
                        .pipeId)) : (s = Promise.resolve(), E(t, a, n, e)), s
            });
        return r || (0, x.wrapLoading)(t)(s, "bottom", "im-preloader_fixed-bottom"), s
    }

    function P(e, t) {
        var n = e.get()
            .pipeId;
        return !("undefined" != typeof n && "undefined" != typeof t && n !== t)
    }

    function L(e, t, n, a, i, s) {
        return P(e, i) ? e.set(r.bind(null, s, a()
                .idFn))
            .then(E.bind(null, t, n, a)) : !1
    }

    function A(e, t, n, r, a) {
        return e.set(c.bind(null, a, r()
                .idFn))
            .then(E.bind(null, t, n, r))
    }

    function D(e, t, n) {
        var r = w.bind(null, t, I.bind(null, t, e, n)),
            a = function(e, r) {
                (t.get()
                    .activated || e) && (t.set(v.bind(null, r)), n()
                    .onScroll && n()
                    .onScroll())
            },
            c = (0, B.createScroll)(e, {
                nokeys: !0,
                shadows: !0,
                nomargin: !0,
                noScroll: t.get()
                    .noScroll,
                nativeScroll: t.get()
                    .nativeScroll,
                hidden: !0,
                scrollChange: a.bind(null, !1),
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto",
                more: n()
                    .more ? r.bind(null, !1) : !1
            });
        return t.set(i.bind(null, n()
            .idFn, {})), (0, M.addDelegateEvent)(e, "click", t.get()
            .elCls, n()
            .onClick), {
            pipe: function(r, a) {
                return t.set(p.bind(null, a)), r.then(L.bind(null, t, e, c, n, a))
            },
            replacePreserveOrder: function(r) {
                return A(t, e, c, n, r)
            },
            pipeReplace: function(r, a) {
                var i = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2];
                return t.set(p.bind(null, a)), t.set(m), r.then(function(r) {
                    return P(t, a) ? t.set(l.bind(null, r, n()
                            .idFn))
                        .then(E.bind(null, e, c, n, t, i)) : void 0
                })
            },
            wipe: function() {
                e.innerHTML = ""
            },
            saveScroll: function(e, n) {
                return t.set(S.bind(null, e, n))
            },
            updateScroll: function() {
                c.update(!1, !0)
            },
            deactivate: function() {
                t.set(s)
            },
            activate: function() {
                t.set(o)
            },
            toTop: function(e) {
                c.scrollTop(0), e && a(e, 0)
            },
            scrollTop: function(e) {
                return c.scrollTop(e)
            },
            restoreScroll: function(e) {
                var n = t.get()
                    .scrolls[e];
                return n ? (t.set(k.bind(null, e)), c.scrollTop(n.scrolled), !0) : !1
            },
            checkMore: function(e) {
                return t.get()
                    .elements.length < t.get()
                    .limit ? r(e, c) : Promise.resolve([])
            },
            add: function(r, a) {
                return L(t, e, c, n, a, r)
            },
            reset: function() {
                var e = t.get()
                    .scrolls;
                t.reset(), t.set(i.bind(null, n()
                    .idFn, e))
            },
            unsetScroll: function(e) {
                t.set(k.bind(null, e))
            },
            isLoading: function() {
                return t.get()
                    .loading
            },
            scrollTo: function(r) {
                var a = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1],
                    i = arguments.length <= 2 || void 0 === arguments[2] ? 0 : arguments[2],
                    s = arguments.length <= 3 || void 0 === arguments[3] ? 0 : arguments[3],
                    o = t.get()
                    .elements,
                    l = o.map(n()
                        .idFn)
                    .indexOf(r);
                if (!(0 > l)) {
                    var u;
                    u = t.get()
                        .limit + t.get()
                        .offset < l ? t.set(g.bind(null, l - t.get()
                            .limit + 1))
                        .then(E.bind(null, e, c, n)) : Promise.resolve(), u.then(function() {
                            var t = e.children[l],
                                n = c.scrollTop(),
                                r = c.getScrollHeight(),
                                o = t.offsetHeight;
                            "center" === i && (i = -c.getScrollHeight() / 2);
                            var u = t.offsetTop - i,
                                d = a ? function(e) {
                                    c.smoothScroll(e - c.scrollTop())
                                } : c.scrollTop.bind(c);
                            "center" === s && (s = r / 2), n > u ? d(u) : u + o > n + r && d(u + o - r + s)
                        })
                }
            },
            getCurrentElements: function() {
                return t.get()
                    .elements
            },
            isEmpty: function() {
                return 0 === t.get()
                    .elements.length
            },
            remove: function(r) {
                t.set(u.bind(null, r, n()
                        .idFn))
                    .then(E.bind(null, e, c, n))
            },
            unmount: function() {
                (0, M.removeDelegateEvent)(e, "click", t.get()
                    .elCls, n()
                    .onClick), c.destroy()
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = D;
    var M = n(5),
        x = n(81),
        O = n(80),
        B = n(84)
}, function(e, t) {
    "use strict";

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        return bodyNode[e] || document.documentElement[e]
    }

    function a(e, t, n) {
        "scrollTop" === e && window.scrollTo(0, t)
    }

    function i(e, t) {
        return t.noScroll ? new o : t.nativeScroll ? new s(e, t) : new Scrollbar(e, t)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.getNativeOption = r, t.setNativeOption = a, t.createScroll = i;
    var s = function() {
            function e(t, r) {
                n(this, e), this.el = t, this.opts = r, this.scrollListener = this.onScroll.bind(this), this.resizeListener = this.resize.bind(this), addEvent(window,
                    "scroll", this.scrollListener), addEvent(window, "resize", this.resizeListener), this.innerHeight = window.innerHeight, this.prevScroll = this.scrollTop()
            }
            return e.prototype.update = function() {}, e.prototype.resize = function() {
                this.innerHeight = window.innerHeight
            }, e.prototype.scrollTop = function(e) {
                return "undefined" == typeof e ? r("scrollTop", this.el) : void a("scrollTop", e, this.el)
            }, e.prototype.contHeight = function() {
                return r("scrollHeight")
            }, e.prototype.smoothScroll = function(e) {
                scrollToY(e + this.scrollTop(), 300)
            }, e.prototype.scrollBottom = function(e) {
                if ("undefined" == typeof e) return this.contHeight() - this.scrollTop() - this.getScrollHeight();
                var t = this.contHeight() - e - this.getScrollHeight();
                this.scrollTop(t)
            }, e.prototype.onScroll = function(e) {
                var t = this.scrollTop(),
                    n = t - this.prevScroll,
                    r = this.contHeight();
                this.opts.onScroll && this.opts.onScroll(-n, this), this.opts.scrollChange && this.opts.scrollChange(t), this.opts.more && r - t < 2 * this.innerHeight &&
                    this.opts.more(this), this.prevScroll = t
            }, e.prototype.getScrollHeight = function() {
                return this.innerHeight
            }, e.prototype.destroy = function() {
                removeEvent(window, "scroll", this.scrollListener)
            }, e
        }(),
        o = function() {
            function e(t, r) {
                n(this, e)
            }
            return e.prototype.update = function() {}, e.prototype.scrollTop = function(e) {
                return 0
            }, e.prototype.contHeight = function() {
                return 0
            }, e.prototype.smoothScroll = function(e) {}, e.prototype.scrollBottom = function(e) {
                return 0
            }, e.prototype.getScrollHeight = function() {
                return 0
            }, e.prototype.destroy = function() {}, e
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

    function r(e, t, n, r, a, i, s, o, l) {
        removeClass(e, "im-page--history_empty"), u(e, t, n, r, a, i, s, o, l)
    }

    function a(e, t, n, r) {
        var a = geByClass1("_im_peer_photo", n);
        removeClass(a, "nim-peer--photo_hidden"), (0, x.isChatPeer)(t) ? (toggleOnline(geByClass1("_im_peer", n), !1), val(a, '<div class="im-page--chat-photo ' + x.SHOW_CHAT_MEMBERS_CLASS +
            '">' + (0, x.renderPhotosFromTab)(e) + "</div>"), e.data.kicked && addClass(a, "nim-peer--photo_hidden")) : (toggleOnline(geByClass1("_im_peer", n), e.online),
            val(a, rs(r.get()
                .im_peer_img_tpl, {
                    peer_photo: e.photo,
                    peer_href: e.href
                })))
    }

    function i(e, t, n, r, a) {
        if (checkEvent(r)) return !0;
        var i = q2ajx(a.getAttribute("href")),
            s = intval(i.msgid);
        s && e.set(M.changePeer.bind(null, e.get()
                .peer, s))
            .then(function() {
                m(n, t, s)
            }), cancelEvent(r)
    }

    function s(e, t, n, r) {
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
                className: "im-page--failed-tt",
                appendParentCls: "_chat_body_wrap",
                dir: "down",
                noZIndex: !0,
                shift: [12, 8],
                hasover: !0
            })
        }
    }

    function o(e) {
        return geByClass1("_im_peer_history", e)
    }

    function l(e) {
        addClass(e, "im-page--history_empty"), o(e)
            .innerHTML = ""
    }

    function u(e, t, n, r, i, s, o) {
        var l = arguments.length <= 7 || void 0 === arguments[7] ? !0 : arguments[7],
            u = arguments.length <= 8 || void 0 === arguments[8] ? !1 : arguments[8],
            c = (t.get()
                .tabs || {})[n];
        a(c, n, e, t), s.renderPeer(t);
        var d = geByClass1("_im_peer_history", e);
        if (!t.get()
            .tabHistoryNotChanged) {
            val(geByClass1("_im_page_peer_name", e), c.tab);
            var g = (0, M.strHistory)(c.history);
            toggleClass(e, "im-page--history_empty-hist", !g), g || (g = getLang("mail_im_here_history")), val(d, g), getAudioPlayer()
                .updateCurrentPlaying(), (0, x.isClassicInterface)(t) || (0, x.fixTableCellChildHeight)("_chat_body_wrap", e), (0, x.fixSnippetsHeight)(d), I(t, r, e)
        }(0, M.isSearchingInplace)(n, t.get()) ? i()
            .showSearch(t): i()
            .cancelSearch(t, !1), o.changePeer(n, t), t.get()
            .msgid ? m(r, e, t.get()
                .msgid) : f(r, e, i, t, u) || (c.scrollBottom && l ? r.scrollBottom(c.scrollBottom) : r.scrollBottom(Q))
    }

    function c(e, t) {
        var n = t.scrollBottom(),
            r = e.get()
            .peer;
        e.set(M.saveHistoryScroll.bind(null, r, n))
    }

    function d(e, t, n, r, a, i, s) {
        if (a.update(i, s), 0 !== e.get()
            .peer && (0, x.isFullyLoadedTab)(e.get(), e.get()
                .peer) && !(layers.visible || e.get()
                .showed && (0, x.isClassicInterface)(e))) {
            var o = (0, x.wrapLoading)(n);
            if ((0, M.isSearchingInplace)(e.get()
                    .peer, e.get()) || r(s), !ne && s.scrollTop() < K) {
                if ((0, M.isSearchingInplace)(e.get()
                        .peer, e.get())) {
                    ne = !0;
                    var l = t()
                        .getSearchResulstModule();
                    return l.isAll(e) ? void(ne = !1) : void o(l.loadMore(e)
                        .then(function(n) {
                            ne = !1, n && t()
                                .loadHistory(e.get()
                                    .peer, {}, e, n)
                        }), "up")
                }
                var u = e.get(),
                    c = u.tabs[u.peer];
                c.allShown || (ne = !0, o(e.set(M.loadMoreHistory.bind(null, 0, 0))
                    .then(t()
                        .loadHistory.bind(null, u.peer, {}))
                    .then(function() {
                        ne = !1
                    }), "up"))
            }
            if (!ne && 0 > i && s.scrollBottom() < K) {
                if ((0, M.isSearchingInplace)(e.get()
                        .peer, e.get())) return;
                var d = gpeByClass("_im_page_history", d),
                    u = e.get(),
                    c = u.tabs[u.peer];
                if (c.skipped > 0) {
                    ne = !0;
                    var f = e.set(M.loadLessHistory)
                        .then(t()
                            .loadHistory.bind(null, u.peer, {
                                reversed: !0
                            }))
                        .then(function() {
                            g(e), ne = !1, h(e, d), c.skipped || e.set(M.changePeer.bind(null, e.get()
                                .peer, !1))
                        });
                    S(d, !0), f.then(S.bind(null, d, !1))
                }
            }
        }
    }

    function g(e) {
        return e.set(M.readLastMessages.bind(null, e.get()
            .peer))
    }

    function f(e, t, n, r, a) {
        var i = geByClass1("_im_unread_bar_row", t);
        if (i) {
            var s = i.getBoundingClientRect(),
                l = geByClass1("_im_peer_history_w", t)
                .getBoundingClientRect()
                .top + 20;
            return (0, x.isClassicInterface)(r) && (l += 47), e.scrollTop(e.scrollTop() - l + s.top), d(r, n, o(t), function() {}, a, 0, e), g(r), !0
        }
        return !1
    }

    function m(e, t, n) {
        var r = geByClass1("_im_mess_" + n, t);
        if (r) {
            var a = r.offsetTop + domPN(r)
                .offsetTop + domPN(domPN(r))
                .offsetTop + domPN(domPN(domPN(r)))
                .offsetTop;
            e.scrollTop(a - e.getScrollHeight() / 2), addClass(r, "im-mess_light"), setTimeout(function() {
                removeClass(r, "im-mess_light")
            }, Y)
        }
    }

    function p(e) {
        var t = geByClass1(ee, e);
        val(t, "")
    }

    function _(e, t) {
        if ((0, x.isClassicInterface)(e)) {
            var n = e.get()
                .peer;
            if (0 !== n && !(0, x.isChatPeer)(n) && (0, x.isFullyLoadedTab)(e, n)) {
                var r = e.get()
                    .tabs[n];
                if (!r.online && !(0, M.isSearchingInplace)(n, e.get())) {
                    var a = r.typing && Object.keys(r.typing)
                        .length > 0;
                    if (!a) {
                        var i = geByClass1(ee, t),
                            s = geByClass1(te, i),
                            o = (0, x.getLastTime)(e, n, !0, !0),
                            l = o.str,
                            u = o.time;
                        if (s) {
                            var c = domData(s, "rdate"),
                                d = domData(s, "peer");
                            (c !== u || n !== intval(d)) && (val(s, l), domData(s, "rdate", u), domData(s, "peer", n))
                        } else l = '<div class="' + te + ' im-page--lastact" data-rdate="' + u + '">' + l + "</div>", val(i, l)
                    }
                }
            }
        }
    }

    function v(e, t, n, r, a) {
        var i = domData(a, "action"),
            s = domData(a, "msgid"),
            l = geByClass1("_im_mess_marker", geByClass1("_im_mess_" + s));
        switch (i) {
            case "resend":
                t(r, a);
                break;
            case "delete":
                e.set(M.removeFailed.bind(null, e.get()
                        .peer, s))
                    .then(function() {
                        (0, x.removeMessages)([s], o(n))
                    })
        }
        tooltips.hide(l, {
            fasthide: !0
        })
    }

    function h(e, t) {
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
        t && t.parentNode.removeChild(t), (0, x.showInvisibleBar)(e)
    }

    function y(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1],
            n = e.scrollBottom();
        return (t ? W + t : W) > n
    }

    function C(e, t, n, r) {
        var a = domData(r, "msgid"),
            i = e.get()
            .peer;
        e.get()
            .imQueueResend(i, a), e.set(M.resendMessage.bind(null, i, a)), (0, x.startResendMessage)(i, a, t)
    }

    function T(e, t, n, r, a) {
        var i = intval(domData(a, "peer")),
            s = intval(domData(gpeByClass("_im_mess", a), "msgid")),
            l = e.get()
            .tabs[i].hash;
        return (0, M.restoreMessageSend)(s, i, l, e.get()
                .gid), e.set(M.restoreMessage.bind(null, s, i))
            .then(x.restoreMessage.bind(null, s, i, o(t)))
            .then(function() {
                return I(e, n, t)
            }), !1
    }

    function E(e, t) {
        e()
            .showCreation(t)
    }

    function w(e, t, n) {
        e.set(M.setExecStack.bind(null, (0, O.execuctionStackFilter)(e.get()
                .stack, "forward"))), e.set(M.prepareForward.bind(null, []))
            .then(function() {
                t()
                    .changePeer(!1, e), removeClass(n, "im-page--history_fwd")
            })
    }

    function S(e, t) {
        var n = geByClass1(V, e);
        toggleClass(n, "im-to-end_loading", t)
    }

    function k(e, t, n) {
        S(n, !0), t.set(M.changePeer.bind(null, t.get()
                .peer, !1))
            .then(function(e) {
                return t.set(M.loadPeer.bind(null, t.get()
                    .peer, !0, -1, !1))
            })
            .then(function(r) {
                S(n, !1), e()
                    .changePeer(t, !1, !1)
            })
    }

    function I(e, t, n) {
        if ((0, x.isClassicInterface)(e)) {
            var r = t.contHeight(),
                a = geByClass1("_im_chat_input_w", n),
                i = geByClass1("_im_peer_history_w", n);
            return setStyle(i, {
                paddingBottom: a.offsetHeight
            }), t.contHeight() - r
        }(0, x.fixTableCellChildHeight)("_chat_body_wrap", n);
        var r = t.getScrollHeight();
        t.update(!1, !0);
        var s = t.getScrollHeight();
        return r - s
    }

    function P(e, t, n, r) {
        var a = t.offsetHeight;
        r(), e.heightIncreased(t.offsetHeight - a, n)
    }

    function L(e, t) {
        var n = t.getBoundingClientRect()
            .top;
        showTooltip(t, {
            className: "im-page--admin-tt",
            text: getLang("mail_only_admin_see"),
            appendParentCls: "_chat_body_wrap",
            shift: [20, 5],
            dir: "auto",
            showdt: 400,
            noZIndex: !0,
            toup: n > 200
        })
    }

    function A(e, t, n, i, s, d, g, f, v, C, T, E, S, k, L, A, D, F, N) {
        var R;
        return {
            changePeer: function(a) {
                var o = arguments.length <= 1 || void 0 === arguments[1] ? !0 : arguments[1],
                    c = arguments.length <= 2 || void 0 === arguments[2] ? !0 : arguments[2];
                if (0 === a.get()
                    .peer && N.disable(), 0 === a.get()
                    .peer && !(0, x.isClassicInterface)(a)) return l(e, a);
                if ((0, x.isFullyLoadedTab)(a.get(), a.get()
                        .peer)) {
                    removeClass(e, "im-page--history_search"), a.set(M.dropSelection), n.changeActions(a);
                    var d = a.get()
                        .peer,
                        g = a.get()
                        .prevPeer;
                    return removeClass(e, "im-page--history_loading"), o && i.restoreDraft(a), s()
                        .updateTyping({
                            peerId: d
                        }, a), h(a, e), (0, x.isClassicInterface)(a) && (p(e), _(a, e)), 0 !== g || (0, x.isReservedPeer)(d) ? (0, x.isReservedPeer)(g) || (0, x.isReservedPeer)
                        (d) ? void 0 : (u(e, a, d, t, s, n, C, c, N), void N.reset(t)) : (r(e, a, d, t, s, n, C, c, N), void N.reset(t))
                }
            },
            saveScroll: function(e) {
                return c(e, t)
            },
            loadingPeer: function(t) {
                (0, M.isAnythingLoading)(t.get()) || (removeClass(e, "im-page--history_empty"), addClass(e, "im-page--history_loading"))
            },
            deselectDialog: function(e) {
                d()
                    .removeSelection(e)
            },
            replaceMessageAttrs: function(t, n) {
                (0, x.replaceMessageAttrs)(n.get(), o(e), t)
            },
            cleanSelection: function(e) {
                E.cleanSelection(e)
            },
            updateDialogFilters: function(e) {
                d()
                    .updateDialogFilters(e)
            },
            getSearchResulstModule: function() {
                return R
            },
            insertSearch: function(n, r) {
                R || (R = (0, U.mount)(e, r, s)), addClass(e, "im-page--history_search"), n ? (removeClass(e, "im-page--history_search-empty"), o(e)
                    .innerHTML = n) : (addClass(e, "im-page--history_search-empty"), o(e)
                    .innerHTML = (0, x.renderEmptySearch)()), I(r, t, e), t.scrollBottom(0), h(r, e), N.reset(t)
            },
            updateChatTopic: function(e, t) {
                d()
                    .updateDialog(e, t), e === t.get()
                    .peer && n.renderPeer(t)
            },
            updateChatPhoto: function(n, r, i) {
                if ((0, x.isPeerActive)(n.peerId, i.get())) {
                    var s = i.get()
                        .tabs[n.peerId];
                    a(s, n.peerId, e, i);
                    var l = y(t);
                    (0, x.addChatPhotoToUpdate)(n, r, i.get(), o(e)), l && t.scrollBottom(Q)
                }
            },
            markImportant: function(t, r, a) {
                var i = geByClass1("_im_mess_" + t, e);
                i && (n.changedMessageSelection(a), T.markImportant(t, r, a))
            },
            loadHistory: function(n, r, a) {
                var i = arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3],
                    s = a.get();
                if ((0, x.isPeerActive)(n, s)) {
                    var o = i || s.tabs[n].historyToAppend;
                    if (!o) return;
                    var l = geByClass1("_im_peer_history", e),
                        u = domFC(l),
                        c = t.scrollBottom(),
                        d = (geByClass1(x.TYPING_CLASS, l), r.reversed ? function(e) {
                            return l.appendChild(e)
                        } : function(e) {
                            return l.insertBefore(e, u)
                        }),
                        g = 0;
                    r.reversed && (g = l.offsetHeight);
                    var f = ce("div");
                    f.innerHTML = o, d(f), r.reversed && N.heightIncreased(l.offsetHeight - g, t), (0, x.fixSnippetsHeight)(f), r.reversed || t.scrollBottom(c), t.update(!
                        1, !0), N.parseMore(f, t)
                }
            },
            sendMessage: function(e) {
                0 !== e.get()
                    .peer && i.sendMessage()
            },
            addMessage: function(n, r) {
                if (!(0, M.isSearchingInplace)(r.peerId, n.get()) && (0, x.isPeerActive)(r.peerId, n.get())) {
                    if (geByClass1("_im_mess_" + r.messageId, e)) return;
                    var a = o(e);
                    P(N, a, t, function() {
                        var i = y(t);
                        (0, x.appendToHistory)(n.get(), r, a), removeClass(e, "im-page--history_empty-hist"), b(e), (r.local || i || (0, x.isServiceMsg)(r) &&
                                r.userId === vk.id) && t.scrollBottom(0), s()
                            .updateTyping(r, n), (0, O.toArray)(geByClass("_im_history_tooltip", e))
                            .forEach(hide)
                    });
                    var i = domPS(domLC(a));
                    if (hasClass(i, "_im_bar_date")) {
                        var l = ce("div");
                        l.innerHTML = i.outterHTML, N.parseMore(l, t)
                    }
                    N.update(0, t)
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
                        var a = (0, x.formatTyper)(n.get()
                                .tabs[t.peerId].typing, t.peerId, !1, n.get()),
                            i = geByClass1(x.TYPING_CLASS, e);
                        if (i || a) {
                            if (!i) {
                                var s = geByClass1(ee, e);
                                val(s, getTemplate("im_typing", {})), i = geByClass1(x.TYPING_CLASS, e)
                            }
                            val(geByClass1("_im_typing_name", i), a), a ? addClass(i, "im-page--typing_vis") : removeClass(i, "im-page--typing_vis")
                        }
                    }
                }
            },
            scrollFix: function(e, n, r) {
                N.heightIncreased(r, t), N.update(0, t), (0, x.isPeerActive)(n, e.get()) && y(t, r) && t.scrollBottom(Q)
            },
            newMessage: function(e, t) {
                d()
                    .newMessage(e, t)
            },
            scroll: function(e, n) {
                var r = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2];
                if (0 !== e.get()
                    .peer) {
                    var a = r ? t.getScrollHeight() : 40;
                    a = "up" === n ? -a : a, r ? t.smoothScroll(a, function() {
                        L(a, t)
                    }) : (t.scrollTop(t.scrollTop() + a), L(a, t))
                }
            },
            showCreation: function(e, t) {
                d()
                    .showCreation(e, t)
            },
            updateScroll: function() {
                return I(A, t, e)
            },
            toggleBarDate: function(e) {
                N.toggle(e)
            },
            changedMessageSelection: function(e) {
                n.changedMessageSelection(e)
            },
            updateOnline: function(t, r) {
                if ((0, x.isTabLoaded)(r.get(), t)) {
                    var a = r.get()
                        .tabs[t].online;
                    if (t === r.get()
                        .peer) {
                        var i = geByClass1("_im_peer", e);
                        toggleOnline(i, a), n.renderPeer(r), a ? p(e) : _(r, e)
                    }
                }
            },
            replaceAttachmentPlaceholders: function(n, r) {
                (0, x.isPeerActive)(r.peerId, n.get()) && (P(N, o(e), t, function() {
                    var a = y(t);
                    (0, x.replaceAttaches)(e, r, n.get()), a && t.scrollBottom(0)
                }), N.update(0, t))
            },
            removeMessages: function(n, r, a) {
                a.get()
                    .peer === r && ((0, x.removeMessages)(n, o(e)), I(a, t, e))
            },
            removeMessagesRestore: function(t, n, r, a) {
                a.get()
                    .peer === n && (0, x.removeMessagesWithRestore)(t, n, r, o(e))
            },
            updateState: function(e, t) {
                d()
                    .updateState(e, t)
            },
            updateChat: function(t, r) {
                if (t.get()
                    .peer === r) {
                    var s = t.get()
                        .tabs[r];
                    n.changeActions(t), a(s, r, e, t), n.renderPeer(t), i.updateState(t)
                }
            },
            focustTxt: function(e) {
                i.focusOn(e)
            },
            showSearch: function(t) {
                addClass(e, "im-page--hisory_search-open"), C.focus(t)
            },
            cancelSearch: function(n) {
                var r = arguments.length <= 1 || void 0 === arguments[1] ? !0 : arguments[1];
                if (removeClass(e, "im-page--hisory_search-open"), removeClass(e, "im-page--history_search"), removeClass(e, "im-page--history_search-empty"), R && (R.unmount(),
                        R = !1), r && !(0, x.isReservedPeer)(n.get()
                        .peer)) {
                    var a = n.get()
                        .tabs[n.get()
                            .peer];
                    o(e)
                        .innerHTML = (0, M.strHistory)(a.history), I(n, t, e), t.scrollBottom(0), n.get()
                        .msgid && (m(t, e, n.get()
                            .msgid), h(n, e)), D(t), N.reset(t)
                }
            },
            unmount: function() {
                (0, B.removeDelegateEvent)(e, "click", x.FAILED_CLASS, g), (0, B.removeDelegateEvent)(e, "click", x.RESTORE_CLASS, f), (0, B.removeDelegateEvent)(e,
                    "click", Z, v), removeEvent(geByClass1("_im_start_new", e), "click", S), removeEvent(geByClass1(V, e), "click", k), t.destroy(), clearInterval(F),
                    i.unmount(), n.unmount(), T.unmount(), E.unmount()
            },
            removePeer: function(e, t) {
                d()
                    .removePeer(e, t)
            },
            restoreScroll: function(e, n) {
                var r = e.get()
                    .tabs[n];
                t.scrollBottom(r.scrollBottom || 0)
            },
            respond: function(e, n) {
                i.attachMessages(e, n), i.focusOn(e), t.scrollBottom(Q), D(t)
            },
            startForward: function(t) {
                addClass(e, "im-page--history_fwd"), geByClass1("_im_explain_fwd", e)
                    .textContent = getLang("mail_explain_fwd", t.get()
                        .pendingForward.length), d()
                    .cancelSearch(t), d()
                    .removeSelection(t);
                var n = (0, O.executionStackPush)(t.get()
                    .stack, "forward",
                    function() {
                        return w(t, d, e)
                    });
                t.set(M.setExecStack.bind(null, n))
            }
        }
    }

    function D(e, t, n) {
        var r = geByClass1("_im_peer_history_w", e);
        show(r);
        var l = (0, F.createMutations)(A),
            u = l.callMutations,
            g = l.bindMutations,
            p = function(e) {
                var t = debounce(e, 100),
                    n = throttle(e, 100);
                return function(e) {
                    t(e), n(e)
                }
            }(c.bind(null, t)),
            b = (0, q.mount)(t, e),
            y = d.bind(null, t, u, r, p, b),
            S = (0, z.createScroll)(r, {
                onScroll: y,
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto",
                nomargin: !0,
                shadows: !1,
                nokeys: !0,
                hidden: !0,
                nativeScroll: (0, x.isClassicInterface)(t)
            });
        if ((0, x.isChatPeer)(t.get()
                .peer)) {
            var I = t.get();
            a(I.tabs[I.peer], I.peer, e, t)
        }
        setTimeout(function() {
            t.get()
                .peer && (t.get()
                    .msgid ? m(S, e, t.get()
                        .msgid) : f(S, e, u, t, b) || S.scrollBottom(Q), b.reset(S), h(t, e))
        }, 15);
        var P = (0, N.mount)(geByClass1("_im_dialog_actions", e), t, u),
            D = (0, R.mount)(geByClass1("_im_text_input", e), t, u),
            O = (0, j.mount)(geByClass1("_im_dialog_actions", e), t, u),
            U = (0, H.mount)(e, t, u),
            K = (0, G.mount)(e, t, function() {
                return {
                    changedMessageSelection: P.changedMessageSelection
                }
            });
        (0, x.isReservedPeer)(t.get()
            .peer) || t.set(M.restoreHistoryQueue.bind(null, t.get()
                .peer))
            .then(function(n) {
                (0, x.restoreQueue)(t.get()
                    .peer, t.get(), o(e))
            });
        var W = C.bind(null, t, e),
            Y = T.bind(null, t, e, S),
            ee = w.bind(null, t, n, e),
            te = E.bind(null, n, t),
            ne = k.bind(null, u, t, e),
            re = s.bind(null, t, e),
            ae = v.bind(null, t, W, e),
            ie = x.showChatMembers.bind(null, t, u, M.setCreationType),
            se = i.bind(null, t, e, S);
        (0, B.addDelegateEvent)(e, "click", x.RESTORE_CLASS, Y), (0, B.addDelegateEvent)(e, "mouseover", x.FAILED_CLASS, re), (0, B.addDelegateEvent)(e, "click", Z, ee), (
            0, B.addDelegateEvent)(e, "click", $, ae), (0, B.addDelegateEvent)(e, "click", x.SHOW_CHAT_MEMBERS_CLASS, ie), (0, B.addDelegateEvent)(e, "click", X, se), (0,
            B.addDelegateEvent)(e, "mouseover", J, L), addEvent(geByClass1("_im_start_new", e), "click", te), addEvent(geByClass1(V, e), "click", ne);
        var oe = setInterval(_.bind(null, t, e), 1e3);
        return g(e, S, P, D, u, n, W, Y, ee, O, U, K, te, ne, y, t, p, oe, b)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = D;
    var M = n(73),
        x = n(81),
        O = n(80),
        B = n(5),
        F = n(85),
        N = n(87),
        R = n(88),
        j = n(92),
        U = n(93),
        H = n(94),
        G = n(95),
        z = n(84),
        q = n(96),
        K = 1e3,
        Q = -30,
        W = 30,
        Y = 2e3,
        Z = "_im_cancel_fwd",
        V = "_im_to_end",
        $ = "_im_failed_action",
        X = "_im_mess_link",
        J = "_im_admin_name",
        ee = "_im_typer_c",
        te = "_im_last_hist_act",
        ne = !1
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

    function a(e, t) {
        if ((0, y.isClassicInterface)(e)) return "";
        var n = e.get()
            .tabs[t];
        return n.online ? "online" + (mobPlatforms[n.online] ? (0, y.getMobileIcon)(t) : "") : (0, y.getLastTime)(e, t)
            .str
    }

    function i(e, t) {
        var n = e.get()
            .peer,
            r = geByClass1(y.LAST_ACT_CLASS, t);
        if (r && e.get()
            .peer) {
            var a = (0, y.getLastTime)(e, n),
                i = a.time,
                s = a.str;
            (domData(r, "time") !== i || intval(domData(r, "peer")) !== n) && (val(r, s), attr(r, "data-time", i), attr(r, "data-peer", n))
        }
    }

    function s(e, t, n) {
        geByClass("_im_header_icon", e)
            .forEach(function(e) {
                if (n.length > 0) hide(e);
                else if ("star" === domData(e, "type") && (0, y.isFoldersAvailable)(t) && (toggleClass(e, "im-page--header-icon_star-active", (0, y.isImportant)(t)),
                        setStyle(e, {
                            display: "inline-block"
                        })), "answer" === domData(e, "type") && (0, y.isFoldersAvailable)(t) && (toggleClass(e, "im-page--header-icon_answer-shown", (0, y.isUnrespond)
                        (t)), (0, y.isUnrespond)(t) ? setStyle(e, {
                        display: "inline-block"
                    }) : hide(e)), "search" === domData(e, "type")) {
                    var r = (0, y.isFullyLoadedTab)(t, t.get()
                            .peer) && t.get()
                        .tabs[t.get()
                            .peer].offset;
                    setStyle(e, {
                        display: "inline-block"
                    }), toggleClass(e, "im-page-header-icon_search-shown", r)
                }
            })
    }

    function o(e, t, n) {
        var a = "mail_selected_shorted",
            i = getLang(a, t.length);
        val(geByClass1("_im_name_el", e), getTemplate("im_simple_name", {
            name: i.replace("{count}", t.length) + y.selectionRemove,
            name_attr: ""
        }));
        var o = geByClass1(L, e),
            l = geByClass1(S, e);
        addClass(l, "im-page--peer_actions"), addClass(l, y.DESLECT_ALL_CLASS), hide(geByClass1(P, e)), hide(geByClass1(k, e)), s(e, n, t), addClass(o,
            "im-page--mess-actions_visible");
        var u = n.get()
            .tabs[n.get()
                .peer],
            c = r(t, u);
        toggleClass(o, "im-page--mess-actions_all-sel", !c), removeClass(e, "im-page--header-chat_verified");
        var d = 55;
        (0, y.isClassicInterface)(n) && (d = 53), (0, y.isCommunityInterface)(n) && (d = 40), setStyle(l, {
            "max-width": l.parentNode.offsetWidth - o.offsetWidth - d
        })
    }

    function l(e, t) {
        var n = t.get()
            .tabs[t.get()
                .peer],
            r = stripHTML(unclean(n.tab)),
            i = (0, y.isClassicInterface)(t) ? getTemplate("im_back_btn", {
                name: n.tab,
                link: (0, y.getBaseLink)(t),
                name_attr: r
            }) : getTemplate("im_simple_name", {
                name: n.tab,
                name_attr: r
            });
        val(geByClass1("_im_name_el", e), i);
        var o = geByClass1(S, e);
        removeClass(o, y.DESLECT_ALL_CLASS), setStyle(o, {
            "max-width": 280
        });
        var l = geByClass1(k, e);
        show(geByClass1(P, e)), setStyle(l, {
            display: "inline-block"
        }), removeClass(e, "im-page--header-chat_short"), removeClass(geByClass1(L, e), "im-page--mess-actions_visible"), removeClass(geByClass1(L, e),
            "im-page--mess-actions_all-sel"), s(e, t, []);
        var u = t.get()
            .peer,
            n = t.get()
            .tabs[u];
        if (toggleClass(e, "im-page--header-chat_verified", !!n.verified), (0, y.isChatPeer)(u)) {
            var c = Object.keys(n.data.members)
                .filter(function(e) {
                    return !n.data.members[e].closed && !n.data.members[e].kicked
                })
                .length,
                r = n.data.closed || n.data.kicked ? "" : getTemplate("im_chat_members", {
                    name: getLang("mail_im_n_chat_members", c)
                });
            val(l, r)
        } else {
            if ((0, y.isClassicInterface)(t)) {
                var d = geByClass1("_im_page_back", e);
                attr(d, "href", (0, y.getBaseLink)(t) + "?tab=" + t.get()
                    .active_tab)
            }
            removeClass(l, "im-page--peer-online_mute"), val(l, a(t, u)), n.online || (0, y.isClassicInterface)(t) || addClass(e, "im-page--header-chat_short")
        }
        var g = geByClass1(O, e);
        toggleClass(g, "im-page--peer-online_mute", inArray(u, t.get()
            .mutedPeers))
    }

    function u(e, t, n, a, i) {
        var s = e.get()
            .selectedMessages,
            o = domData(i, "action"),
            l = e.get()
            .peer;
        switch (o) {
            case "delete":
            case "spam":
                e.set(b.removeMessagesWithRestore.bind(null, s, l, o))
                    .then(t()
                        .removeMessagesRestore.bind(null, s, l, o));
                var u = e.get()
                    .tabs[l];
                (0, b.removeMessageSend)(s, l, u.hash, o, e.get()
                    .gid);
                break;
            case "forward":
                e.set(b.prepareForward.bind(null, s))
                    .then(function() {
                        if ((0, y.isClassicInterface)(e)) {
                            var n = (0, T.executionStackPush)(e.get()
                                .stack, "forward",
                                function(t) {
                                    e.set(b.prepareForward.bind(null, []))
                                        .then(function() {
                                            e.get()
                                                .longpoll.push([(0, C.changePeer)(t)])
                                        })
                                }.bind(null, e.get()
                                    .peer));
                            e.set(b.setExecStack.bind(null, n)), e.get()
                                .longpoll.push([(0, C.resetPeer)(!0)])
                        } else t()
                            .startForward(e)
                    });
                break;
            case "star":
                var u = e.get()
                    .tabs[l],
                    c = r(s, u);
                e.set(b.favMessage.bind(null, s, c, l)), e.get()
                    .longpoll.push(s.map(function(e) {
                        return {
                            type: c ? C.SET_FLAGS : C.RESET_FLAGS,
                            messageId: e,
                            peerId: l,
                            flags: C.FLAG_IMPORTANT
                        }
                    }));
                break;
            case "respond":
                e.set(b.forwardMessages.bind(null, s, l))
                    .then(function(e) {
                        t()
                            .respond(e, l)
                    })
        }
        f(e, t, n)
    }

    function c(e, t, n, r, a, i) {
        if ("keydown" !== i.type || 13 === i.which) {
            var s = trim(val(a));
            return s ? (s !== n && e.set(b.updateChatTopic.bind(null, t, s))
                .then(r()
                    .updateChatTopic.bind(null, t)), !0) : (notaBene(a), !1)
        }
    }

    function d(e, t, n) {
        if ((0, y.isChatPeer)(t)) {
            var r = e.get()
                .tabs[t].data.title,
                a = c.bind(null, e, t, r, n),
                i = showFastBox({
                    title: getLang("mail_chat_topic_change_title"),
                    dark: 1
                }, getTemplate("im_chat_change_topic", {
                    value: r
                }), getLang("global_save"), function(e, t) {
                    var n = a(s, t);
                    n && i.hide()
                }, getLang("global_cancel"), function() {
                    i.hide()
                }),
                s = geByClass1(D, i.bodyNode);
            elfocus(s), addEvent(s, "keydown", function(e) {
                var t = a(s, e);
                t && i.hide()
            })
        }
    }

    function g(e, t, n, r, a) {
        var i = domData(a, "action"),
            s = geByClass1(I)
            .parentNode,
            o = e.get()
            .peer;
        switch (i) {
            case "clear":
                var l = (0, y.showFlushDialog)(o, function(n) {
                    (0, y.cleanHistory)(e, l, t, b.flushHistory, e.get()
                        .peer)
                });
                break;
            case "media":
                showWiki({
                    w: "history" + (0, y.convertPeerToUrl)(o) + "_photo"
                });
                break;
            case "topic":
                d(e, o, t);
                break;
            case "avatar":
                cur.recieveCropResult = void 0, Page.ownerPhoto(o);
                break;
            case "search":
                t()
                    .showSearch(e);
                break;
            case "block":
                var l = (0, y.showBlacklistBox)(o, e);
                l.once("success", function(t) {
                    t.delta && (showDoneBox(t.msg), e.get()
                        .longpoll.push([(0, C.resetPeer)()]))
                });
                break;
            case "leave":
                var l = showFastBox({
                    title: getLang("mail_chat_leave_title"),
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, getLang("mail_chat_leave_confirm"), getLang("mail_leave_chat"), function() {
                    e.set(b.leaveChat.bind(null, o)), l.hide(), e.get()
                        .longpoll.push([(0, C.resetPeer)()])
                }, getLang("global_cancel"), function() {
                    l.hide()
                });
                break;
            case "return":
                e.set(b.returnToChat.bind(null, o));
                break;
            case "unmute":
            case "mute":
                var u = "mute" === i ? 1 : 0;
                e.set(b.toggleMutePeer.bind(null, o, u))
                    .then(t()
                        .updateState.bind(null, o));
                break;
            case "invite":
                if ((0, y.isChatPeer)(o))(0, y.inviteUser)(e, o, t, b.setCreationType);
                else if ((0, y.isUserPeer)(o)) {
                    var c = e.get()
                        .tabs[o],
                        g = [
                            [o, c.tab]
                        ];
                    e.set(b.setCreationType.bind(null, "chat", []))
                        .then(function(n) {
                            return t()
                                .showCreation(e, g)
                        })
                }
        }
        uiActionsMenu.toggle(s, !1)
    }

    function f(e, t, n) {
        var r = e.get()
            .selectedMessages;
        e.set(b.cleanSelected)
            .then(n()
                .changedMessageSelection)
            .then(t()
                .cleanSelection.bind(null, r))
    }

    function m(e, t, n, r) {
        var a = domData(r, "type"),
            i = "";
        switch (a) {
            case "star":
                i = function() {
                    return (0, y.isImportant)(e) ? getLang("mail_im_toggle_important_off") : getLang("mail_im_toggle_important")
                };
                break;
            case "answer":
                i = getLang("mail_end_conversation");
                break;
            case "search":
                i = getLang("mail_search_in_peer")
        }
        showTooltip(r, {
            text: i,
            black: 1,
            shift: [4, -8],
            forcetoup: !0,
            appendParentCls: "_im_mess_actions"
        })
    }

    function p(e, t, n, r, a) {
        var i = domData(a, "type");
        switch (i) {
            case "star":
                e.set(b.toggleDialogImportant.bind(null, e.get()
                    .peer)), setTimeout(function() {
                    return m(e, t, r, a)
                }, 40);
                break;
            case "search":
            case "search":
                n()
                    .showSearch(e), window.tooltips && tooltips.hide(a, {
                        fasthide: !0
                    });
                break;
            case "answer":
                e.set(b.markDialogAnswered.bind(null, e.get()
                        .peer, 0)), showDoneBox(getLang("mail_marked_as_answered"), {
                        out: 1e3
                    }), e.get()
                    .longpoll.push([(0, C.resetPeer)()])
        }
    }

    function _(e, t, n, r, a, i, s, u) {
        return {
            changeActions: function(t) {
                var n = geByClass1(I, e),
                    r = geByClass1(P, e),
                    a = t.get()
                    .curActions,
                    i = Object.keys(a)
                    .map(function(e) {
                        var t = "";
                        return 7 === b.ACTION_PRIORITIES[e] && (t = '<div class="ui_actions_menu_sep"></div>'), t + rs(B, a[e])
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
                l(e, t)
            },
            changedMessageSelection: function(t) {
                var n = t.get()
                    .selectedMessages || [],
                    r = n.length > 0;
                n.length > 0 ? o(e, n, t) : l(e, t), u()
                    .toggleBarDate(!r)
            },
            unmount: function() {
                (0, E.removeDelegateEvent)(e, "click", A, t), (0, E.removeDelegateEvent)(e, "click", w, n), (0, E.removeDelegateEvent)(e, "click", M, r), (0, E.removeDelegateEvent)
                (e, "click", y.DESLECT_ALL_CLASS, a), (0, E.removeDelegateEvent)(e, "mouseover", x, i), clearInterval(s)
            }
        }
    }

    function v(e, t, n) {
        var r = (0, h.createMutations)(_),
            a = r.callMutations,
            s = r.bindMutations,
            o = u.bind(null, t, n, a),
            l = g.bind(null, t, n, a),
            c = y.showChatMembers.bind(null, t, n, b.setCreationType),
            d = f.bind(null, t, n, a),
            v = function(e, n) {
                return (0, y.showVerifiedTooltip)(n, t.get()
                    .peer)
            },
            T = m.bind(null, t, e),
            S = p.bind(null, t, e, n);
        (0, E.addDelegateEvent)(e, "click", A, o), (0, E.addDelegateEvent)(e, "click", w, l), (0, E.addDelegateEvent)(e, "click", M, c), (0, E.addDelegateEvent)(e, "click",
            y.DESLECT_ALL_CLASS, d), (0, E.addDelegateEvent)(e, "mouseover", x, v), (0, E.addDelegateEvent)(e, "mouseover", "_im_header_icon", T), (0, E.addDelegateEvent)(
            e, "click", "_im_header_icon", S), (0, E.addDelegateEvent)(e, "click", "_im_page_back", function(e) {
            checkEvent(e) || (t.get()
                .longpoll.push([(0, C.resetPeer)()]), cancelEvent(e))
        });
        var k = setInterval(i.bind(null, t, e), 1e3);
        return (0, y.isReservedPeer)(t.get()
            .peer) || setTimeout(function() {
            t.set(b.setActions)
                .then(a()
                    .changeActions)
        }), s(e, o, l, c, d, v, k, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = v;
    var h = n(85),
        b = n(73),
        y = n(81),
        C = n(77),
        T = n(80),
        E = n(5),
        w = "_im_action",
        S = "_im_page_peer_name",
        k = "_im_page_peer_online",
        I = "_im_dialog_actions_items",
        P = "_im_dialog_action_wrapper",
        L = "_im_mess_actions",
        A = "_im_page_action",
        D = "_im_chat_topic_change_input",
        M = "_im_chat_members",
        x = "_im_chat_verified",
        O = "_im_peer_mute",
        B = '<a class="ui_actions_menu_item ' + w + ' im-action im-action_%icon%" data-action="%icon%">%name%</a>'
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        if (0 === e.length) return [""];
        for (var n = []; e.length > z;) {
            var r = e.substr(0, z)
                .lastIndexOf(" "); - 1 == r && (r = z), n.push(e.substr(0, r)), e = e.substr(r)
        }
        return e.length > 0 && n.push(e), n
    }

    function a(e, t, n) {
        var r = {},
            a = geByClass("emoji", e);
        for (var i in a) r[Emoji.getCode(a[i])] = 1;
        var a = geByClass("emoji_css", e);
        for (var i in a) r[Emoji.getCode(a[i])] = 1;
        var s = geByClass1("_im_rcemoji", t),
            o = "",
            l = 0;
        for (var u in r) {
            var c = ge("im_rc_em_" + u);
            if (c) {
                if (!(n > 2e9) || c.nextSibling) continue;
                re(c)
            }
            ge("im_rc_em_" + u) || (o += getTemplate("im_emoji_line", {
                code: u,
                emoji: Emoji.getEmojiHTML(u, !1, !0)
            }), l -= 22)
        }
        s.insertBefore(cf(o), s.firstChild), setStyle(s, {
            marginLeft: l
        }), animate(s, {
            marginLeft: 0
        }, {
            duration: 150,
            transition: Fx.Transitions.easeOutCubic,
            onComplete: function() {
                var e = geByClass("im_rc_emojibtn", s)
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

    function s(e, t, n, r, a, s) {
        var o = arguments.length <= 6 || void 0 === arguments[6] ? !0 : arguments[6];
        r.get()
            .tabs[t];
        return E(t, r) ? void 0 : (0, B.getBindAttachToUrl)(t, r.get())
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
                var c = (0, R.random)(),
                    d = {
                        peerId: t,
                        messageId: "rid" + c,
                        flags: x.eventTypes.FLAG_OUTBOUND | x.eventTypes.FLAG_UNREAD,
                        date: intval(Date.now() / 1e3),
                        subject: "",
                        text: (0, F.replaceSpecialSymbols)(clean(n.message))
                            .replace(/\n/gi, "<br>"),
                        local: !0,
                        kludges: {
                            emoji: !0,
                            from_admin: r.get()
                                .gid ? vk.id : null
                        },
                        attaches: i(n.attaches)
                    };
                return n.rid = c, n.mess = d, e(t, n), r.set(B.addMessage.bind(null, d))
                    .then(function() {
                        o && s()
                            .clearText(t, r)
                    })
                    .then(a()
                        .newMessage.bind(null, d, r))
            })
    }

    function o(e, t, n, r, a, i) {
        var o = e.get()
            .peer;
        l(e, t, !1)
            .then(function(l) {
                s(n, o, {
                    message: "",
                    attaches: a,
                    sticker_referrer: i
                }, e, t, r, !1)
            })
    }

    function l(e, t, n) {
        var r = e.get()
            .tabs[e.get()
                .peer];
        return r.skipped > 0 ? (t()
            .loadingPeer(e), e.set(B.changePeer.bind(null, e.get()
                .peer, !1))
            .then(function(t) {
                return e.set(B.loadPeer.bind(null, e.get()
                    .peer, !0, -1, !1))
            })
            .then(function(n) {
                return t()
                    .changePeer(e, !1)
            })
            .then(function(e) {
                return n
            })) : Promise.resolve(n)
    }

    function u(e, t, n) {
        var r = !!intval(domData(n, "val"));
        r !== cur.ctrl_submit && (cur.ctrl_submit = r, e.set(B.changeSubmitSettings.bind(null, r)))
    }

    function c(e, t, n) {
        return e.get()
            .delayed_ts ? !1 : setTimeout(function() {
                d.apply(null, n)
            }, t)
    }

    function d(e, t, n, i, o, u) {
        var d = arguments.length <= 6 || void 0 === arguments[6] ? [] : arguments[6],
            g = geByClass1("_im_send", i);
        if ((0, B.isAnythingLoading)(e.get())) {
            var f = c(e, G, (0, U.toArray)(arguments));
            return e.set(B.setDelayedMessage.bind(null, !0, f))
                .then(function() {
                    lockButton(g)
                })
        }
        clearTimeout(e.get()
                .delayed_ts), e.set(B.setDelayedMessage.bind(null, !1, !1))
            .then(function() {
                unlockButton(g)
            });
        var m = e.get(),
            p = m.peer,
            _ = geByClass1("_im_text", i);
        Promise.all([(0, B.getAttaches)(e, p), (0, B.getForwardedMessages)(p, e.get())])
            .then(l.bind(null, e, t))
            .then(function(l) {
                var u = M(l, 2),
                    c = u[0],
                    g = u[1];
                c = c.concat(d);
                var f = Emoji.editableVal(_) || "";
                if (f || 0 !== c.length || 0 !== g.length) {
                    g.length > 0 && c.push(["fwd", g]);
                    var m = r(f);
                    a(_, i, p), m.slice(0, m.length - 1)
                        .forEach(function(r) {
                            s(n, p, {
                                message: r,
                                attaches: []
                            }, e, t, o)
                        });
                    var f = m.slice(-1)[0];
                    s(n, p, {
                        message: f,
                        attaches: c
                    }, e, t, o)
                }
            })
    }

    function g(e, t, n, r) {
        return e.set(B.deliverMessage.bind(null, n, r))
    }

    function f(e, t, n, r) {
        e.set(B.setMessageErrored.bind(null, n, r.mess))
            .then(t()
                .setMessageErrored.bind(null, n, r.mess))
    }

    function m(e, t, n, r, a, i, s) {
        var o = geByClass1("_im_text", e);
        return addEvent(o, "paste", i), addEvent(o, "focus", function() {
            t.get()
                .longpoll.push([x.eventTypes.transitionEvent("message")]), cur.focused = t.get()
                .peer
        }), addEvent(o, "blur", function() {
            t.get()
                .longpoll.push([x.eventTypes.transitionEvent("default")]), cur.focused = !1
        }), Emoji.init(o, {
            ttDiff: 93,
            rPointer: !0,
            onSend: r.bind(null, []),
            controlsCont: e,
            forceTxt: !t.get()
                .editable,
            checkEditable: n,
            onStickerSend: function(e, t) {
                a([
                    ["sticker", e]
                ], t)
            },
            uploadActions: s
        })
    }

    function p(e, t, n, r, a, i, s, o, l) {
        if ("album" === a) return !1;
        if (show("_im_media_preview"), !t.get()
            .rebuilding_draft) {
            if ("page" === a) return !1;
            if (!("share" !== a || s.title && o)) return !1;
            t.set(B.cleanMediaStore.bind(null, t.get()
                .peer));
            var u = l.getMedias()
                .slice()
                .map(function(e) {
                    return e.slice(0, 2)
                }),
                c = [];
            "undefined" != typeof i && a ? (o && t.set(B.bindAttachToUrl.bind(null, t.get()
                    .peer, a, i, o)), c = [
                    [a, i, s]
                ]) : a || "undefined" == typeof i || u.splice(i, 1), u = u.concat(c), u.filter(function(e) {
                    return e
                })
                .forEach(function(e) {
                    t.set(B.addMediaStore.bind(null, e))
                });
            var d = e()
                .updateScroll();
            return e()
                .scrollFix(t, t.get()
                    .peer, d), toggleClass(r, "im-chat-input--textarea_has-attaches", u.length > 0), t.get()
                .delayed_message && !(0, B.isAnythingLoading)(t.get()) ? (n([]), !1) : void 0
        }
    }

    function _(e, t) {
        var n = e.get()
            .ctrl_submit ? 1 : 0;
        return showTooltip(t.target, {
            text: getTemplate("ctrl_submit_hint", {
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
                    els: (0, U.toArray)(geByClass(W)),
                    val: n
                }
            }
        })
    }

    function v(e, t) {
        Emoji.val(e, t), Emoji.focus(e, !0), setTimeout(Emoji.correctCaret.pbind(e), 10)
    }

    function h(e, t) {
        var n = geByClass1(K, t);
        n.innerHTML = getTemplate("im_attach_mess", {
            messages: getLang("mail_title_X_msgs", e.length)
        })
    }

    function b(e, t, n) {
        e.set(B.forwardMessages.bind(null, [], e.get()
                .peer))
            .then(function() {
                var r = geByClass1(K, t);
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

    function y(e, t, n, r, a, i, s, o, l, u, c, d) {
        return {
            restoreDraft: function(r) {
                r.get()
                    .rebuilding_draft = !0, e.unchooseMedia(), e.chosenMedias = [], r.get()
                    .rebuilding_draft = !1;
                var i = geByClass1("ms_item_gift", n);
                (0, F.isUserPeer)(r.get()
                    .peer) && !r.get()
                    .gid ? show(i) : hide(i);
                var s = r.get()
                    .peer;
                (0, F.isReservedPeer)(s) || Promise.all([(0, B.getAttaches)(r, s), (0, B.getTextDraft)(s, r.get()), (0, B.getForwardedMessages)(s, r.get())])
                    .then(function(e) {
                        return r.set(B.cleanMediaStore.bind(null, s))
                            .then(function(t) {
                                return e
                            })
                    })
                    .then(function(i) {
                        var o = M(i, 3),
                            l = o[0],
                            u = o[1],
                            c = o[2];
                        A(r, s, t)
                            .then(function(i) {
                                if (!i) {
                                    l.length > 0 && show(ge("_im_media_preview"));
                                    for (var o = 0; o < l.length; o++) e.chooseMedia.apply(e, l[o]);
                                    c.length > 0 ? h(c, n) : geByClass1(K, n)
                                        .innerHTML = "", v(t, u);
                                    var d = a()
                                        .updateScroll();
                                    a()
                                        .scrollFix(r, s, d)
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
                A(e, e.get()
                    .peer, t)
            },
            focusOn: function(e) {
                Emoji.editableFocus(t, !1, !0)
            },
            clearText: function(r, i) {
                e.unchooseMedia(), e.chosenMedias = [], Emoji.val(t, ""), i.set(B.saveTextDraft.bind(null, r, "")), i.set(B.cleanMediaStore.bind(null, r)), i.set(B.forwardMessages
                    .bind(null, [], r)), i.set(B.clearAttachToUrl.bind(null, r)), b(i, n, a);
                var s = a()
                    .updateScroll();
                a()
                    .scrollFix(i, i.get()
                        .peer, s)
            },
            attachMessages: function(e, t) {
                e.get()
                    .peer === t && (0, B.getForwardedMessages)(t, e.get())
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
                removeEvent(t, "paste", c), removeEvent(a, "click", r), (0, j.removeDelegateEvent)(n, "click", "_im_rc_emoji", i), (0, j.removeDelegateEvent)(n,
                    "click", Q, o), (0, j.removeDelegateEvent)(n, "click", "_im_will_fwd", l), e.destroy(), u.unmount(), (0, j.removeDelegateEvent)(bodyNode,
                    "click", W, d)
            }
        }
    }

    function C(e, t) {
        return (0, F.isChatPeer)(e) ? t.get()
            .tabs[e].data.kicked : !1
    }

    function T(e, t) {
        if (!(0, F.isUserPeer)(e) && !(0, F.isComunityPeer)(e)) return !1;
        var n = t.get()
            .tabs[e];
        return n.blacklisted
    }

    function E(e, t) {
        return C(e, t) || T(e, t) || (0, F.isLocksAvailable)(t) && (0, F.isPeerBlocked)(e, t) || !P(e, t)
    }

    function w(e, t, n, r) {
        var a = e.get()
            .peer,
            i = Emoji.val(r);
        (0, F.isReservedPeer)(a) || e.get()
            .tabs[a].imdraft == i || E(a, e) || (t.checkMessageURLs(i, !0, G), e.set(B.saveTextDraft.bind(null, a, i)))
    }

    function S(e, t) {}

    function k(e, t, n, r, a, i) {
        var s = domData(i, "emoji");
        Emoji.addEmoji(e, s), w(t, r, e, n)
    }

    function I(e) {
        var t = e.get()
            .peer;
        if ((0, F.isFullyLoadedTab)(e.get(), t)) {
            var n = e.get()
                .tabs[t];
            Date.now() - (n.lastTyping || 0) > 1e3 * B.TYPING_PERIOD && e.set(B.sendTyping.bind(null, t))
        }
    }

    function P(e, t) {
        return !(0, F.isComunityPeer)(e) || t.get()
            .gid ? !0 : t.get()
            .tabs[e].can_message
    }

    function L(e) {
        var t = e.get()
            .peer;
        (0, B.getForwardedMessages)(t, e.get())
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

    function A(e, t, n) {
        if (E(t, e)) {
            n.disabled = !0;
            var r;
            if (T(t, e)) r = getLang("mail_send_privacy_error");
            else if (C(t, e)) r = getLang("mail_chat_youre_kicked");
            else if (P(t, e)) {
                var a = e.get()
                    .block_states[t].name;
                r = getLang("mail_community_answering")
                    .replace("{username}", a)
            } else r = getLang("mail_cant_send_messages_to_community");
            return addClass(n, "im-chat-input--text_disabled"), v(n, r), n.contentEditable = "false", hide(n.previousSibling), Promise.resolve(!0)
        }
        return n.disabled && (n.disabled = !1, v(n, ""), n.contentEditable = "true", removeClass(n, "im-chat-input--text_disabled"), show(n.previousSibling)), (0, B.getTextDraft)
            (t, e.get())
            .then(function(e) {
                return v(n, e), !1
            })
    }

    function D(e, t, n) {
        cur.share_timehash = t.get()
            .share_timehash;
        var r = (0, O.createMutations)(y),
            a = r.callMutations,
            i = r.bindMutations,
            s = (0, H.mount)(e, t, a),
            l = g.bind(null, t, n),
            c = (0, N.initQueue)(l, f.bind(null, t, n), {
                store: "ls",
                key: "im_send_queue_" + vk.id
            }),
            v = c.pushMessage,
            h = c.inspectQueue,
            C = c.resend,
            T = c.setErrored,
            P = c.complete,
            A = o.bind(null, t, n, v, a),
            D = L.bind(null, t),
            M = S.bind(null, s);
        hide(geByClass1("ms_items_more_helper", e));
        var x, R = new MediaSelector(geByClass1(q, e), "_im_media_preview", [
            ["photo", getLang("profile_wall_photo")],
            ["gift", getLang("profile_wall_gift")],
            ["video", getLang("profile_wall_video")],
            ["audio", getLang("profile_wall_audio")],
            ["doc", getLang("profile_wall_doc")],
            ["map", getLang("profile_wall_map")]
        ], {
            maxShown: 1,
            onAddMediaChange: function(r, a, i, s) {
                return p(n, t, G, e, r, a, i, s, R)
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
            forceToUp: !0,
            toId: t.get()
                .gid ? -t.get()
                .gid : void 0,
            blockPersonal: t.get()
                .gid ? 1 : 0,
            docParams: t.get()
                .gid ? {
                    imhash: t.get()
                        .im_doc_hash,
                    from: "from_gim"
                } : {}
        });
        hide(geByClass1("ms_items_more_helper", e)), addEvent(geByClass1(q, e), "mouseover", function() {
            x && clearTimeout(x), show(geByClass1("ms_items_more_helper", e))
        }), addEvent(geByClass1(q, e), "mouseout", function() {
            x = setTimeout(function() {
                hide(geByClass1("ms_items_more_helper", e))
            }, 500)
        });
        var U, G = d.bind(null, t, n, v, e, a, R),
            z = debounce(w.bind(null, t, R), 500),
            K = m(e, t, function(r, a) {
                var i = t.get()
                    .peer,
                    s = Emoji.val(a);
                (0, F.isReservedPeer)(i) || E(i, t) || t.get()
                    .tabs[i].imdraft == s || !s || I(t), z(r, a);
                var o = e.offsetHeight;
                if (U && U !== o) {
                    var l = n()
                        .updateScroll();
                    n()
                        .scrollFix(t, t.get()
                            .peer, l)
                }
                U = o
            }, G, A, M, s),
            Y = G.bind(null, []),
            Z = _.bind(null, t),
            V = geByClass1("_im_send", e);
        addEvent(V, "click", Y), addEvent(V, "mouseover", Z), t.get()
            .textMediaSelector = R, t.set(B.initTextStore.bind(null, h, C, T, P));
        var $ = (ge("_im_media_preview"), geByClass1("_im_text", e));
        setTimeout(function() {
            a()
                .restoreDraft(t)
        }, 0);
        var X = k.bind(null, K, t, $, R),
            J = b.bind(null, t, e, n),
            ee = u.bind(null, t);
        return addEvent(geByClass1("_im_text_wrap", e), "click", function() {
                $ !== document.activeElement && (window.Emoji ? Emoji.focus : elfocus)($)
            }), (0, j.addDelegateEvent)(e, "click", "_im_rc_emoji", X), (0, j.addDelegateEvent)(e, "click", Q, J), (0, j.addDelegateEvent)(e, "click", "_im_will_fwd", D),
            (0, j.addDelegateEvent)(bodyNode, "click", W, ee), i(R, $, e, Y, n, X, h, J, D, s, M, ee)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var M = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    var x = n(75),
        O = n(85),
        B = n(73),
        F = n(81),
        N = n(79),
        R = n(89),
        j = n(5),
        U = (n(90), n(80)),
        H = n(91),
        G = 4e3,
        z = 3980,
        q = "_im_media_selector",
        K = "_im_media_fwd",
        Q = "_im_fwd_close",
        W = "_im_submit_btn"
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
            s = ge("upload" + i + "_progress_wrap");
        s && hide(geByClass1("progress_x", s)), ajax.post("al_photos.php", extend({
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

    function a(e, t, n, r, a, i, s) {
        return {
            focus: function(e) {
                uiSearch.focus(n), l(e, n, s)
            },
            changePeer: function(e, t) {
                uiSearch.getFieldEl(n)
                    .value = t.get()
                    .tabs[e].searchText || ""
            },
            unmount: function() {
                removeEvent(geByClass1(v, e), "click", t), removeEvent(geByClass1(y, e), "click", r), removeEvent(geByClass1(C, e), "click", a), removeEvent(uiSearch.getFieldEl(
                    n), "keyup", r), (0, p.removeDelegateEvent)(e, "click", T, i)
            }
        }
    }

    function i(e, t, n, r) {
        e.set(f.setCurrentSearchDate.bind(null, e.get()
                .peer, r.d + "." + r.m + "." + r.y))
            .then(o.bind(null, e, t, n))
    }

    function s(e, t) {
        e.then(function(e) {
            triggerEvent(geByClass1("datepicker_control", t), "mousedown", !1, !0)
        })
    }

    function o(e, t, n) {
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
            var s = clean(uiSearch.getFieldEl(t)
                .value);
            e.set(f.setCurrentSearch.bind(null, s, e.get()
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
            .then(o.bind(null, e, t, r))
    }

    function g(e, t, n) {
        var l = geByClass1(h, e),
            g = geByClass1(b, e),
            f = i.bind(null, t, n, g),
            m = r(t, e, l, f),
            _ = s.bind(null, m, e),
            E = u.bind(null, t, g, l, n, debounce(o, 300)),
            w = c.bind(null, t, g, n),
            S = d.bind(null, t, n, m, g);
        return addEvent(geByClass1(v, e), "click", _), addEvent(uiSearch.getFieldEl(g), "keyup", E), addEvent(geByClass1(y, e), "click", E), addEvent(geByClass1(C, e),
            "click", w), (0, p.addDelegateEvent)(e, "click", T, S), a(e, _, g, E, w, S, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = g;
    var f = n(73),
        m = n(80),
        p = n(5),
        _ = "im_hist_search",
        v = "_im_search_date",
        h = "_im_search_date_input",
        b = "_im_search_history_input",
        y = "_im_start_inplace_search",
        C = "_im_cancel_inplace_search",
        T = "_im_clear_date"
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        var r = intval(domData(n, "msgid"));
        if (!getSelectionText() && !(0, u.checkSelectClick)(t)) {
            var a = intval(domData(n, "peer"));
            return e.get()
                .longpoll.push([(0, c.changePeer)(a, r)]), !1
        }
    }

    function a(e) {
        return (0, l.isSearchAllLoaded)(e.get()
            .peer, e.get()) ? Promise.resolve("") : (0, l.searchMessagesInplace)(e.get()
            .peer, e.get())
    }

    function i(e, t) {
        return {
            isAll: function(e) {
                return (0, l.isSearchAllLoaded)(e.get()
                    .peer, e.get())
            },
            loadMore: function(e) {
                return a(e)
            },
            unmount: function() {
                (0, o.removeDelegateEvent)(e, "click", "_im_mess", t, !0)
            }
        }
    }

    function s(e, t) {
        var n = r.bind(null, t);
        return (0, o.addDelegateEvent)(e, "click", "_im_mess", n, !0), i(e, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = s;
    var o = n(5),
        l = n(73),
        u = n(81),
        c = n(77)
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        var r = gpeByClass("_im_mess", n),
            i = intval(domData(r, "msgid")),
            s = e.get()
            .peer,
            o = e.get()
            .tabs[s].msgs[i],
            c = !o[2];
        return e.get()
            .longpoll.push([{
                peerId: s,
                messageId: i,
                type: c ? u.SET_FLAGS : u.RESET_FLAGS,
                flags: u.FLAG_IMPORTANT
            }]), e.set(l.favMessage.bind(null, [i], c, s)), a(e, -10, t, n), !1
    }

    function a(e, t, n, r) {
        var a = getLang("mail_im_toggle_important")
            .length > 10;
        return showTooltip(r, {
            shift: [a ? 75 : 40, 10],
            black: 1,
            className: "_im_history_tooltip " + (a ? "im-star-tt_long" : "im-star-tt"),
            appendParentCls: "_im_mess_stack",
            text: function() {
                var t = gpeByClass("_im_mess", r),
                    n = intval(domData(t, "msgid")),
                    a = e.get()
                    .peer,
                    i = e.get()
                    .tabs[a],
                    s = i.msgs[n];
                return s[2] ? getLang("mail_im_unmark_important") : getLang("mail_im_toggle_important")
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
                (0, o.removeDelegateEvent)(e, "click", c, n), (0, o.removeDelegateEvent)(e, "mouseover", c, r)
            }
        }
    }

    function s(e, t, n) {
        var s = a.bind(null, t, 0),
            l = r.bind(null, t);
        return (0, o.addDelegateEvent)(e, "click", c, l), (0, o.addDelegateEvent)(e, "mouseover", c, s), i(e, n, l, s)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = s;
    var o = n(5),
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
                s = e.get()
                .tabs[i].deleted || [];
            inArray(a, s) || e.set(u.addSelection.bind(null, a))
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
                (0, o.removeDelegateEvent)(e, "click", "_im_mess", n), (0, o.removeDelegateEvent)(e, "click", "_im_mess_stack", r)
            }
        }
    }

    function s(e, t, n) {
        var s = a.bind(null, t, n);
        return (0, o.addDelegateEvent)(e, "click", "_im_mess", s), (0, o.addDelegateEvent)(e, "click", "_im_mess_stack", r), i(e, n, s)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = s;
    var o = n(5),
        l = n(81),
        u = n(73)
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function i(e, t) {
        if (domData(e, "ts") !== t.date) {
            e.innerHTML = t.text, domData(e, "ts", t.date);
            var n = {
                visibility: "visible"
            };
            setStyle(e, n)
        }
    }

    function s(e, t, n, r) {
        var a = geByClass("_im_bar_date", e),
            i = t.contHeight(),
            s = a.reduce(function(e, t) {
                return e[domData(t, "date")] = [t.offsetTop, i, t], e
            }, {}),
            o = !n && r.barMap ? r.barMap : {};
        return r.barMap = extend(o, s), r.barMapKeys = Object.keys(r.barMap)
            .sort(), Promise.resolve(r)
    }

    function o(e, t) {
        return t.barMapKeys.forEach(function(n) {
            t.barMap[n][0] -= e
        }), Promise.resolve(t)
    }

    function l(e, t, n, r) {
        var a = e.get()
            .barMap[t];
        return n - (a[0] + n - a[1]) + r
    }

    function u(e, t) {
        var n = e.get()
            .barMap[t][2];
        return {
            text: n.textContent,
            date: domData(n, "date")
        }
    }

    function c(e, t, n, r) {
        var a = e.get(),
            i = void 0,
            s = void 0,
            o = n - t;
        a.barMapKeys.forEach(function(t) {
            var a = l(e, t, n, r);
            if (a >= o) {
                var u = i ? l(e, i, n, r) : n;
                i = u > a ? t : i
            } else if (o > a) {
                var c = s ? l(e, s, n, r) : 0;
                s = a > c ? t : s
            }
        });
        var c = {};
        return [
            [s, "prev"],
            [i, "cur"]
        ].forEach(function(t) {
            var a = m(t, 2),
                i = a[0],
                s = a[1];
            i && (c[s + "Bar"] = u(e, i), c[s + "Left"] = l(e, i, n, r) - o)
        }), c
    }

    function d(e) {
        var t = geByClass1("_im_mess", e),
            n = domData(t, "ts");
        return {
            text: getShortDate(intval(n), !1, !0, getLang("months_of", "raw")),
            date: n
        }
    }

    function g(e, t, n, r, s) {
        var o = (0, _.isEverythingLoaded)(e.get()),
            l = t.get(),
            u = s.scrollTop();
        l.lastTop ? l.lastTop - u : 0;
        l.lastTop = u;
        var g = ((0, p.isClassicInterface)(e) ? b : 0) - y / 2 - 2,
            f = s.contHeight(),
            m = c(t, u, f, g),
            v = m.prevBar,
            h = m.curBar,
            C = m.prevLeft,
            E = (m.curLeft, !1),
            w = !1;
        if (h || o || (h = d(r)), h) {
            var S;
            w = h, S = {}, a(S, cssTransformProp, "translateY(0px)"), a(S, "visibility", "visible"), E = S
        } else {
            var k;
            k = {}, a(k, cssTransformProp, "translateY(0px)"), a(k, "visibility", "hidden"), E = k
        }
        if (v)
            if (C > -y && T > C && h) {
                var I;
                w = h, I = {}, a(I, cssTransformProp, "translateY(" + (-y - C) + "px)"), a(I, "visibility", "visible"), E = I
            } else if (C >= T && 0 > C) {
            var P;
            w = v, P = {}, a(P, cssTransformProp, "translateY(" + -C + "px)"), a(P, "visibility", "visible"), E = P
        }
        w && i(n, w), E && setStyle(n, E)
    }

    function f(e, t) {
        var n = geByClass1("_im_top_date_bar"),
            r = (0, h["default"])({
                lastTop: !1,
                barMap: {},
                barMapKeys: []
            }),
            a = !1,
            i = debounce(function(e) {
                r.set(s.bind(null, t, e, !1))
            }, 500);
        return {
            reset: function(a) {
                r.set(s.bind(null, t, a, !0))
                    .then(function() {
                        g(e, r, n, t, a)
                    })
            },
            disable: function() {
                r.reset()
            },
            heightIncreased: function(e, t) {
                return i(t), r.set(o.bind(null, e))
            },
            parseMore: function(a, i) {
                r.set(s.bind(null, a, i, !1))
                    .then(function() {
                        g(e, r, n, t, i)
                    })
            },
            toggle: function(e) {
                e ? show(n) : hide(n)
            },
            update: function(i, s) {
                a && clearTimeout(a), a = setTimeout(function() {
                    g(e, r, n, t, s)
                }, C), g(e, r, n, t, s)
            }
        }
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
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    t.setCurrentDateBar = i, t.mount = f;
    var p = n(81),
        _ = n(73),
        v = n(76),
        h = r(v),
        b = 46,
        y = 24,
        C = 300,
        T = -7
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

    function i(e, t, n, r, a) {
        var i = trim(a);
        if (i && i !== e.get()
            .searchText) {
            var s = u.bind(null, e, n, t);
            e.set(h.setExecStack.bind(null, (0, T.executionStackPush)(e.get()
                    .stack, "im_search", s))), e.set(h.setCurrentSearch.bind(null, i, !1))
                .then(t), addClass(r, "im-page--dialogs-search_fill")
        } else i || (e.set(h.setCurrentSearch.bind(null, "", !1))
            .then(t), removeClass(r, "im-page--dialogs-search_fill"))
    }

    function s(e, t, n) {
        return function() {
            var r = t.get()
                .searchText;
            r === e && n.apply(null, arguments)
        }
    }

    function o(e, t) {
        var n = t.get(),
            r = t.get()
            .searchText;
        if (!r) return void e()
            .restoreDialogs(t);
        var a = s(r, t, e()
                .appendDialogs.bind(null, t)),
            i = s(r, t, e()
                .appendFastDialogs.bind(null, t)),
            o = s(r, t, e()
                .appendSearch);
        (0, b.isPendingForward)(t) ? ((0, h.searchFriends)(r, n)
            .then(i), (0, h.searchHints)(r, [], "all", n)
            .then(a)) : (t.get()
            .dialog_search_going = !0, Promise.all([(0, h.searchFriends)(r, n)
                .then(function(e) {
                    i(e);
                    var t = e.map(function(e) {
                        return e.peerId
                    });
                    return (0, h.searchHints)(r, t, "all", n)
                        .then(a)
                }), (0, h.searchMessages)(r, n)
            ])
            .then(function(e) {
                var n = v(e, 2),
                    r = v(n[1], 2),
                    a = r[0],
                    i = r[1];
                o(t, a, i, !0), t.get()
                    .dialog_search_going = !1
            }))
    }

    function l(e, t, n) {
        n()
            .showCreation(e)
    }

    function u(e, t, n) {
        e.set(h.setExecStack.bind(null, (0, T.execuctionStackFilter)(e.get()
            .stack, "im_search")));
        var r = a(t);
        uiSearch.reset(r), i(e, n, t, r, r.value)
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
        return (0, b.showFavvedBox)(e, n, E.mount, r)
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
            shift: [3, -3],
            appendCls: "js-im-page"
        })
    }

    function f(e, t, n) {
        var r = n.target;
        e.set(h.toggleCommunityMute.bind(null, t))
            .then(function() {
                toggleClass(r, "im-page--gim-mute_muted", e.get()
                    .mute), t && m(e, {
                    target: r
                })
            })
    }

    function m(e, t) {
        var n = t.target;
        return showTooltip(n, {
            text: function() {
                return e.get()
                    .mute ? getLang("mail_im_sound_off") : getLang("mail_im_sound_on")
            },
            black: 1,
            shift: [13, 9],
            appendCls: "js-im-page"
        })
    }

    function p(e, t, n, r, i, s, o) {
        return {
            focusInput: function(t) {
                uiSearch.focus(a(e)
                    .parentNode)
            },
            createCanceled: function(e, t) {
                removeClass(s, "im-dialog-select_rotated")
            },
            rotateCross: function(e) {
                addClass(s, "im-dialog-select_rotated")
            },
            clearSearch: function(t) {
                u(t, e, function(e) {
                    return !1
                })
            },
            updateImportantCnt: function(t) {
                var n = t.get()
                    .important_cnt,
                    r = geByClass1(w, e);
                toggleClass(r, "im-page--stars_hidden", 0 === n), r.innerHTML = "<i></i> " + n
            },
            unmount: function() {
                removeEvent(a(e), "keyup", t), removeEvent(geByClass1("_im_search_croll", e), "click", n), removeEvent(geByClass1(w, e), "click", r), removeEvent(s,
                    "mouseover", o)
            }
        }
    }

    function _(e, t, n) {
        var r = geByClass1("_im_search_croll", e),
            s = a(e),
            l = debounce(o.bind(null, n), 50),
            u = i.bind(null, t, l, e, s),
            _ = c.bind(null, t, e, l, n, r),
            v = d.bind(null, t, e, n),
            h = geByClass1("_im_dialogs_search_input", e);
        uiSearch.init(h, {
            onChange: u
        });
        var y = g.bind(null, t, r);
        if (addEvent(geByClass1("_im_av_time", e), "mouseover", function(e) {
                showTooltip(e.target, {
                    text: getLang("mail_admin_av_time"),
                    dir: "up",
                    shift: [0, 8]
                })
            }), addEvent(r, "mousedown", _), addEvent(r, "mouseover", y), addEvent(geByClass1(w, e), "click", v), (0, b.isClassicInterface)(t)) {
            var T = f.bind(null, t, !0),
                E = m.bind(null, t),
                k = geByClass1(S, e);
            f(t, !1, {
                target: k
            }), addEvent(k, "click", T), addEvent(k, "mouseover", E)
        }
        return addEvent(s, "focus", function() {
            t.get()
                .longpoll.push([(0, C.transitionEvent)("search")])
        }), addEvent(s, "blur", function() {
            t.get()
                .longpoll.push([(0, C.transitionEvent)("default")])
        }), p(e, u, _, v, l, r, y)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var v = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    t.mount = _;
    var h = n(73),
        b = n(81),
        y = n(76),
        C = (r(y), n(77)),
        T = n(80),
        E = n(98),
        w = "_im_important_counter",
        S = "_im_gim_mute"
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
                        var n = o(t, 4),
                            a = (n[0], n[1]),
                            s = (n[2], n[3]);
                        e.all = s.all, e.offset = s.offset, e.all ? addClass(i, "im-important_all") : e.loading = !1, r.set(l.mergeTabs.bind(null, (0, d.tabFromIds)
                            (s.msgs, s.hash)));
                        var u = ce("div");
                        u.innerHTML = a, i.appendChild(u)
                    }), "bottom")
            }
        }
    }

    function i(e, t, n) {
        for (var r = arguments.length, a = Array(r > 3 ? r - 3 : 0), i = 3; r > i; i++) a[i - 3] = arguments[i];
        a.filter(function(e) {
                return inArray(e.type, [m.SET_FLAGS, m.RESET_FLAGS, m.CHANGE_PEER])
            })
            .forEach(function(r) {
                if (r.type === m.CHANGE_PEER) return void n.hide();
                if (r.flags === m.FLAG_IMPORTANT) {
                    var a = r.type === m.SET_FLAGS;
                    e.set(l.updateFavMessage.bind(null, [r.messageId], 0, a))
                        .then(function(n) {
                            t.markImportant(r.messageId, a, e)
                        })
                }
            })
    }

    function s(e, t, n, r) {
        var s = ge("box_layer_wrap"),
            o = t.get()
            .longpoll,
            l = (0, f["default"])({
                peer: 0,
                longpoll: o,
                tabs: (0, d.tabFromIds)(r.msgs, r.hash)
            }),
            g = (0, c.mount)(e.bodyNode, l, function() {
                return {}
            }),
            m = (0, u.mount)(e.bodyNode, t),
            p = i.bind(null, t, g, e);
        o.on("data", p);
        var _ = a.bind(null, {
            all: !1,
            loading: r.all,
            offset: r.offset
        }, e, s, l);
        return addEvent(s, "scroll", _), {
            unmount: function() {
                removeEvent(s, "scroll", _), m.unmount(), g.unmount(), o.off("data", p)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var o = function() {
        function e(e, t) {
            var n = [],
                r = !0,
                a = !1,
                i = void 0;
            try {
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
    t.mount = s;
    var l = n(73),
        u = n(93),
        c = n(94),
        d = n(81),
        g = n(76),
        f = r(g),
        m = n(77)
}, function(e, t, n) {
    "use strict";

    function r() {
        var e = arguments.length <= 0 || void 0 === arguments[0] ? "im_settings" : arguments[0];
        return getTemplate(e, {
            sound: ls.get("sound_notify_off") ? getLang("mail_im_sound_off") : getLang("mail_im_sound_on"),
            browser: i() ? getLang("mail_im_notifications_on") : getLang("mail_im_notifications_off")
        })
    }

    function a(e, t) {
        showTooltip(t.target, {
            content: r("im_settings_pop"),
            dir: "down",
            shift: [220, 9],
            hasover: !0,
            showdt: 300
        })
    }

    function i() {
        return DesktopNotifications.supported() && !DesktopNotifications.checkPermission() && !ls.get("im_ui_notify_off")
    }

    function s(e, t, n, a, s) {
        var o = domData(s, "action"),
            l = gpeByClass("_im_settings_menu", s),
            u = hasClass(l, "_im_settings_popup") ? "im_settings_pop" : "im_settings";
        switch (o) {
            case "spam":
                (0, g.showSpamLayer)(e, c.mount, a);
                break;
            case "sound":
                ls.get("sound_notify_off") ? ls.set("sound_notify_off", 0) : ls.set("sound_notify_off", 1), l.outerHTML = r(u);
                break;
            case "browser":
                var d = i();
                d ? (ls.set("im_ui_notify_off", 1), l.outerHTML = r(u)) : DesktopNotifications.checkPermission() ? DesktopNotifications.requestPermission(function() {
                    l.parentNode && (l.outerHTML = r(u))
                }) : (ls.set("im_ui_notify_off", 0), l.outerHTML = r(u))
        }
    }

    function o(e, t) {
        return {
            updateFilter: function(t) {
                var n, r = t.get()
                    .active_tab === g.FOLDER_UNREAD;
                n = t.get()
                    .unread_cnt > 0 ? getTemplate("im_filter", {
                        filter: r ? getLang("mail_to_all_dialogs") : getLang("mail_to_unread")
                    }) : getTemplate("im_filter", {
                        filter: getLang("mail_all_dialogs"),
                        cls: "im-page--dialogs-filter_disabled"
                    }), val(geByClass1(p, e), n)
            },
            toggleLoader: function(t, n) {
                var r = geByClass1(f, e);
                toggleClass(r, "im-page--dialogs-settings_loading", n)
            },
            updateSettings: function(t) {
                var n = geByClass1("_im_settings_menu", e);
                n.outerHTML = r()
            },
            unmount: function() {
                removeEvent(geByClass1(f, e), "mouseover", t)
            }
        }
    }

    function l(e, t, n) {
        var r = a.bind(null, t),
            i = s.bind(null, t, n, e),
            l = function(e, r) {
                if ((0, g.showUnreadOnly)(t, n, d.changeDialogsTab)) {
                    var a = t.get()
                        .active_tab === g.FOLDER_UNREAD;
                    val(r, getTemplate("im_filter", {
                        filter: a ? getLang("mail_to_all_dialogs") : getLang("mail_to_unread")
                    }))
                }
            };
        return (0, u.addDelegateEvent)(e, "mouseover", f, r), (0, u.addDelegateEvent)(e, "click", m, i), (0, u.addDelegateEvent)(e, "click", p, l), o(e, r)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = l;
    var u = n(5),
        c = n(100),
        d = n(73),
        g = n(81),
        f = "_im_dialogs_cog_settings",
        m = "_im_settings_action",
        p = "_im_to_unread"
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
                e.loading = !0, (0, _.wrapLoading)(i)((0, p.loadSpam)(e.offset, r.get()
                        .gid)
                    .then(function(t) {
                        var n = m(t, 4),
                            a = (n[0], n[1]),
                            s = (n[2], n[3]);
                        e.all = s.all, e.offset = s.offset, e.all ? addClass(i, "im-important_all") : e.loading = !1, r.set(p.mergeTabs.bind(null, (0, _.tabFromIds)
                            (s.msgs, s.hash)));
                        var o = ce("div");
                        o.innerHTML = a, i.appendChild(o)
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
        0 === n.length ? removeClass(r, "im-important-box_with-sel") : (addClass(r, "im-important-box_with-sel"), val(geByClass1(E), getLang("mail_im_mark_notspam", n.length)),
            val(geByClass1(w), getLang("mail_im_mark_delspam", n.length)))
    }

    function s(e, t, n) {
        var r = e.get()
            .selectedMessages;
        e.set(p.cleanSelected)
            .then(n.cleanSelection.bind(null, r))
            .then(function(n) {
                return i(t, e)
            })
    }

    function o(e, t, n, r) {
        var a = gpeByClass("_im_mess", r, t);
        if (a) {
            var i = intval(domData(a, "msgid"));
            a && ((0, p.removeMessageSend)([i], 0, e.get()
                .tabs[0].hash, "undel", e.get()
                .gid), (0, _.restoreMessage)(i, 0, t))
        }
    }

    function l(e, t, n) {
        var r = e.get()
            .selectedMessages;
        (0, p.removeMessageSend)(r, 0, e.get()
            .tabs[0].hash, "delete", e.get()
            .gid), (0, _.removeMessagesWithRestore)(r, 0, "delete", t), s(e, t, n)
    }

    function u(e, t, n) {
        var r = e.get()
            .selectedMessages;
        (0, p.removeMessageSend)(r, 0, e.get()
            .tabs[0].hash, "nospam", e.get()
            .gid), r.map(function(e) {
                return geByClass1("_im_mess_" + e)
            })
            .filter(function(e) {
                return e
            })
            .forEach(function(e) {
                var t = intval(domData(e, "peer")),
                    n = intval(domData(e, "msgid"));
                val(e, (0, _.renderGoTo)(t, n)), addClass(e, "im-mess_light")
            }), s(e, t, n)
    }

    function c(e, t, n, r, a) {
        var i = gpeByClass("_im_mess", a, t.bodyNode),
            s = intval(domData(i, "peer")),
            o = intval(domData(i, "msgid"));
        return t.hide(), n()
            .unmount(), e.get()
            .longpoll.push([(0, T.changePeer)(s, o)]), stopEvent(r), cancelEvent(r), !1
    }

    function d(e, t, n, r) {
        var a = showFastBox({
            title: getLang("mail_deleteall1"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, getLang("mail_delete_all_spam"), getLang("mail_delete"), function(i) {
            (0, p.flushSpam)(e, r)
            .then(function(e) {
                    var t = m(e, 2),
                        n = (t[0], t[1]);
                    showDoneBox(n)
                }), a.hide(), t.hide(), n()
                .unmount()
        }, getLang("mail_close"), function(e) {
            a.hide()
        })
    }

    function g(e, t, n, r, a, i, s, o, l, u) {
        return {
            unmount: function() {
                removeEvent(o, "scroll", t), removeEvent(geByClass1(w, e.bodyNode), "click", n), removeEvent(geByClass1(E, e.bodyNode), "click", r), removeEvent(
                        geByClass1("_im_spam_flush", e.bodyNode), "click", l), (0, v.removeDelegateEvent)(e.bodyNode, "click", "_im_mess_restore", a), (0, v.removeDelegateEvent)
                    (e.bodyNode, "click", "_im_go_to", i), (0, v.removeDelegateEvent)(e.bodyNode, "click", _.DESLECT_ALL_CLASS, u), s.unmount()
            }
        }
    }

    function f(e, t, n) {
        var r = ge("box_layer_wrap"),
            f = (0, h.createMutations)(g),
            m = f.callMutations,
            p = f.bindMutations,
            y = (0, C["default"])({
                peer: 0,
                tabs: (0, _.tabFromIds)(n.msgs, n.hash),
                gid: t.get()
                    .gid
            }),
            T = a.bind(null, {
                all: n.all,
                loading: !1,
                offset: n.offset
            }, e, r, y),
            S = o.bind(null, y, e.bodyNode),
            k = c.bind(null, t, e, m),
            I = d.bind(null, n.hash, e, m, t.get()
                .gid);
        (0, v.addDelegateEvent)(e.bodyNode, "click", "_im_mess_restore", S), (0, v.addDelegateEvent)(e.bodyNode, "click", "_im_go_to", k);
        var P = (0, b.mount)(e.bodyNode, y, function(t) {
                return {
                    changedMessageSelection: i.bind(null, e)
                }
            }),
            L = l.bind(null, y, e.bodyNode, P),
            A = u.bind(null, y, e.bodyNode, P),
            D = s.bind(null, y, e, P);
        return (0, v.addDelegateEvent)(e.bodyNode, "click", _.DESLECT_ALL_CLASS, D), addEvent(r, "scroll", T), addEvent(geByClass1(w, e.bodyNode), "click", L), addEvent(
            geByClass1(E, e.bodyNode), "click", A), addEvent(geByClass1("_im_spam_flush", e.bodyNode), "click", I), p(e, T, L, A, S, k, P, r, I, D)
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
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
        v = n(5),
        h = n(85),
        b = n(95),
        y = n(76),
        C = r(y),
        T = n(77),
        E = "_im_spam_not_spam",
        w = "_im_spam_spam"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t, n, r, a, i) {
        removeClass(t, "im-create_shown"), setTimeout(s.bind(null, t, !1), 100);
        var o = g(i);
        o.map(function(e) {
                return geByClass1("_im_dialog" + e)
            })
            .forEach(function(e) {
                removeClass(e, "olist_item_wrap_on")
            }), n()
            .createCanceled(e, r), a.resetSelection(), "add_member" === e.get()
            .creationType && e.set(w.setCreationType.bind(null, "chat", [])), e.set(w.presetAvatar.bind(null, !1));
        var u = geByClass1(G, t);
        l(e, i, t), uiSearch.reset(geByClass1(N, t)), uiSearch.reset(geByClass1(R, t)), u && u.parentNode.removeChild(u), l(e, i, t), e.set(w.setExecStack.bind(null, (0, S
            .execuctionStackFilter)(e.get()
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

    function s(e, t) {
        toggleClass(e, "im-create_material", t)
    }

    function o(e, t, n, r, i, s) {
        a(e, t, n, !1, i, s), e.get()
            .longpoll.push([(0, M.changePeer)(r)])
    }

    function l(e, t, n) {
        var r, a = geByClass1(U, n),
            i = t.get()
            .selection.length;
        "add_member" === e.get()
            .creationType ? (r = 1 > i, val(geByClass1("_im_confirm_creation", n), 1 === i ? getLang("mail_append_chat") : getLang("mail_im_create_chat_with"))) : r = 1 >=
            i, toggleClass(n, "im-create_tools", !r), toggleClass(a, "button_disabled", r)
    }

    function u(e, t, n, r, a, i, s, o) {
        if (!checkEvent(s)) {
            var u, c = intval(domData(o, "list-id")),
                d = g(i),
                f = trim(o.textContent),
                m = geByClass1(R, t),
                p = getSize(m)[1];
            inArray(c, d) ? (u = r.removeSelection(c, f), removeClass(o, "olist_item_wrap_on")) : (u = r.addSelection(c, f), addClass(o, "olist_item_wrap_on")), u.then(
                function() {
                    var e = p - getSize(m)[1],
                        t = a.scrollTop();
                    a.scrollTop(t - e)
                }), l(e, i, t);
            var _ = geByClass1(R, t);
            return uiSearch.reset(_), cancelEvent(s), !1
        }
    }

    function c(e, t) {
        var n = g(e),
            r = [],
            a = [];
        return t.online && a.push("online"), mobPlatforms[t.online] && a.push("mobile"), r.push("_im_dialog", "_im_dialog" + t.peerId, "im-creation--item"), inArray(t.peerId,
            n) && r.push("olist_item_wrap_on"), getTemplate("im_owner_item", {
            owner_id: t.peerId,
            cls: " " + r.join(" "),
            photo: t.photo,
            name: t.name,
            link: t.href,
            img_cls: a.join(" ")
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
        var s = n.get()
            .selection.map(function(e) {
                return e.id
            });
        p(e, r, t, !1, s), (0, I.fixTableCellChildHeight)("_im_create_wrap_safe", e)
    }

    function m(e, t, n) {
        return e.then(function(e) {
            return e.filter(function(e) {
                return e.is_friend && !inArray(e.peerId, n.get()
                    .creationFilter)
            })
        })
    }

    function p(e, t, n, r, a) {
        var s, o, l = geByClass1(R, e),
            u = (0, w.searchLocalHints)(r, t.get());
        t.get()
            .creation_showed_all = !1, n.reset(), n.pipe(m(u, r, t), r), n.toTop(), r ? (o = (0, w.searchFriends)(r, t.get()), s = (0, w.searchHintsIndex)(r, [], "friends",
                data), n.pipe(m(s, r, t), r), n.pipe(m(o, r, t), r)) : (s = Promise.resolve([]), o = Promise.resolve([])), t.set(i.bind(null, [u, o, s], !0)), uiSearch.showProgress(
                l), Promise.all([u, s, o])
            .then(uiSearch.hideProgress.bind(null, l))
    }

    function _(e, t, n, r, a, i, s, o) {
        uiTabs.switchTab(o.firstElementChild);
        var l = domData(o, "type");
        switch (l) {
            case "chat":
                i.restore()
        }
        e.set(w.setCreationType.bind(null, l, []))
            .then(f.bind(null, t, r, a))
    }

    function v(e, t, n, r) {
        var a = r.get()
            .searchText || !1,
            i = r.get()
            .selection.map(function(e) {
                return e.id
            });
        e.get()
            .creationQuery = a, p(t, e, n, a, i)
    }

    function h(e, t, n, r) {
        var a = 2e9 + Math.round(rand(1e6, 2e6));
        cur.recieveCropResult = function(n) {
            cur.recieveCropResult = !1, curBox() && curBox()
                .hide(), e.set(w.presetAvatar.bind(null, n)), (0, w.getOwnerPhoto)(n, a)
                .then(function(e) {
                    geByClass1(j, t)
                        .appendChild(ce("img", {
                            className: "im-chat-placeholder--img " + G,
                            src: e
                        }))
                })
        }, Page.ownerPhoto(a)
    }

    function b(e, t, n, r, i, s) {
        var o = g(t);
        o.map(function(e) {
                return geByClass1("_im_dialog" + e)
            })
            .forEach(function(e) {
                removeClass(e, "olist_item_wrap_on")
            }), t.reset(), p(n, e, r, !1, g(t)), i.resetSelection(), a(e, n, s, !1, i, t)
    }

    function y(e, t, n, r, i, s, l) {
        var u = g(t);
        if ("add_member" === e.get()
            .creationType && u.length > 0) return e.set(w.addNewMember.bind(null, e.get()
            .peer, u)), void a(e, n, s, "", i, t);
        if (!(u.length <= 1) || e.get()
            .creating) {
            lockButton(l.target);
            var c = uiSearch.getFieldEl(geByClass1(N, n))
                .value;
            e.set(w.createChat.bind(null, e.get()
                    .next_chat_avatar, u, c))
                .then(function(a) {
                    b(e, t, n, r, i, s), o(e, n, s, e.get()
                            .next_peer, i, t), unlockButton(l.target), s()
                        .restoreDialogs(e)
                })["catch"](function(e) {
                    unlockButton(l.target), topMsg(getLang("global_unknown_error"), 2, "#FFB4A3")
                })
        }
    }

    function C(e, t) {
        return showTooltip(e, {
            text: getLang("mail_cancel"),
            black: 1,
            zIndex: 1e3,
            shift: [3, -2],
            appendCls: "js-im-page"
        })
    }

    function T(e, t, n, r, i, o, l) {
        return {
            show: function(t) {
                var a = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1];
                t.get()
                    .showed = !0, s(e, !0), t.set(w.setExecStack.bind(null, (0, S.executionStackPush)(t.get()
                        .stack, "im_create", n))), addClass(e, "im-create_shown"), l.focus(), a && a.forEach(function(e) {
                        return l.addSelection(e[0], e[1])
                    }), f(e, r, o, t)
            },
            hide: function(n) {
                n.get()
                    .showed = !1, a(n, e, t, !1, l, o)
            },
            updateScroll: function() {
                (0, I.fixTableCellChildHeight)("_im_create_wrap_safe", e), r.updateScroll()
            },
            unmount: function() {
                removeEvent(geByClass1(x, e), "click", n), (0, L.removeDelegateEvent)(e, "click", B, onDialogClick), (0, L.removeDelegateEvent)(e, "click", F, i), r.unmount(),
                    cur.recieveCropResult = void 0
            }
        }
    }

    function E(e, t, n) {
        var r = (0, D["default"])({
                selection: []
            }),
            s = geByClass1(O, e),
            o = (0, k.mount)(s, (0, D["default"])({
                offset: 0,
                limit: z,
                elements: [],
                elCls: B
            }), function(a) {
                return {
                    idFn: function(e) {
                        return intval(e.peerId)
                    },
                    renderFn: c.bind(null, r),
                    more: function(e, n) {
                        var a;
                        return t.get()
                            .showed ? (t.get()
                                .creation_showed_all || d(r) !== !1 ? a = Promise.resolve([]) : (t.get()
                                    .creation_showed_all = !0, a = (0, w.searchFriends)(d(r), t.get())), t.set(i.bind(null, [a], !1)), m(a, d(r), t)) : Promise.resolve(!
                                1)
                    },
                    onClick: function(a, i) {
                        u(t, e, n, f, o, r, a, i)
                    }
                }
            });
        t.get()
            .creationQuery = !1, t.get()
            .creationType = "chat";
        var g = geByClass1(R, e),
            f = (0, P.mount)(g, r, function(n) {
                return {
                    selectionDeleted: function(n, r) {
                        l(t, n, e), removeClass(geByClass1("_im_dialog" + r), "olist_item_wrap_on")
                    },
                    onChange: v.bind(null, t, e, o)
                }
            }),
            p = a.bind(null, t, e, n, "cross", f, r),
            E = _.bind(null, t, e, n, o, r, f),
            S = h.bind(null, t, e),
            I = b.bind(null, t, r, e, o, f, n),
            A = y.bind(null, t, r, e, o, f, n),
            M = geByClass1(x, e);
        return addEvent(M, "click", p), addEvent(M, "mouseover", C.bind(null, M)), addEvent(geByClass1(j, e), "click", S), addEvent(geByClass1(H, e), "click", I), addEvent(
            geByClass1(U, e), "click", A), (0, L.addDelegateEvent)(e, "click", F, E), T(e, n, p, o, E, r, f, I, A)
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
                for (var s, o = e[Symbol.iterator](); !(r = (s = o.next())
                        .done) && (n.push(s.value), !t || n.length !== t); r = !0);
            } catch (l) {
                a = !0, i = l
            } finally {
                try {
                    !r && o["return"] && o["return"]()
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
        I = n(81),
        P = n(102),
        L = n(5),
        A = n(76),
        D = r(A),
        M = n(77),
        x = "_im_create_cancel",
        O = "_im_create_list",
        B = "_im_dialog",
        F = "_im_create_tab",
        N = "_im_dialogs_creation_name",
        R = "_im_create_select",
        j = "_im_create_avatar",
        U = "_im_confirm_creation",
        H = "_im_cancel_creation",
        G = "_im_avatar_img",
        z = 100
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

    function s(e, t, n, r, a, s, o) {
        var l = intval(domData(o, "peer"));
        tooltips.hide(o), t.set(i.bind(null, l))
            .then(function(i) {
                c(e, r, t, a), n()
                    .selectionDeleted(t, l)
            })
    }

    function o(e) {
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
        uiSearch.focus(e), a.length > 0 ? attr(i, "placeholder", "") : attr(i, "placeholder", unclean(getLang("mail_search_creation"))), t.innerHTML = a.map(function(e) {
                return '<div class="token">\n      <div class="token_title">' + e.name + '</div>\n      <div data-peer="' + e.id + '" class="token_del ' + p +
                    '"></div>\n    </div>'
            })
            .join(""), toggleClass(e, "ui_multiselect_has_selection", a.length > 0), domFC(e)
            .scrollTop += 50, r()
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
        var g = uiSearch.getFieldEl(e),
            f = ce("div", {
                className: "_ui_multiselection ui_multiselect_cnt"
            });
        g && g.parentNode.insertBefore(f, g);
        var _ = o(g);
        t.set(a);
        var v = s.bind(null, e, t, n, f, _),
            h = function() {
                return uiSearch.focus(e)
            };
        return (0, m.addDelegateEvent)(e, "click", p, v), (0, m.addDelegateEvent)(e, "mouseover", p, d), addEvent(e, "click", h), {
            addSelection: function(n, a) {
                return t.set(r.bind(null, {
                        id: n,
                        name: a
                    }))
                    .then(c.bind(null, e, f, t, _))
            },
            removeSelection: function(n) {
                return t.set(i.bind(null, n))
                    .then(c.bind(null, e, f, t, _))
            },
            resetSelection: function() {
                u(t, e, f, _)
            },
            focus: function() {
                uiSearch.focus(e)
            },
            save: function() {
                t.stash(), c(e, f, t, _)
            },
            restore: function() {
                t.pop(), c(e, f, t, _)
            },
            unmount: function() {
                (0, m.removeDelegateEvent)(e, "click", p, v), (0, m.removeDelegateEvent)(e, "mouseover", p, d), removeEvent(e, "click", h)
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

    function s(e, t, n, r, a) {
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

    function o(e, t, n, r, a) {
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
                        return s(u, t, n, r, e);
                    case "message":
                        return o(u, t, n, l, e);
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
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e) {
        return e.queue || e.key
    }

    function i(e) {
        return window.curNotifier ? !curNotifier.addQueues[a(e)] : !1
    }

    function s(e) {
        return window.curNotifier ? void!curNotifier.addQueues[a(e)] : !1
    }

    function o() {
        _.forEach(function(e, t) {
            var n = e.onData,
                r = e.onUpdateKey,
                a = e.ts;
            i(t) && Notifier.addKey(extend(t, {
                ts: a
            }), d.bind(null, n, r, t))
        })
    }

    function l() {
        v || (v = setInterval(o, 3e3))
    }

    function u(e) {
        s(e), _["delete"](e), 0 === _.size && (clearInterval(v), v = !1)
    }

    function c(e, t, n, r) {
        var a;
        switch (e) {
            case 1:
            case 2:
            case 3:
            case 5:
                a = r(t, e);
                break;
            case 4:
                a = (0, p.pause)(1)
                    .then(function() {
                        return t
                    });
                break;
            default:
                throw new Error("Unkonwn error from queue: " + e)
        }(0, p.pause)(3)
        .then(function() {
                return a
            })
            .then(function(e) {
                _.set(e, {
                    onUpdateKey: r,
                    onData: n,
                    ts: e.ts
                }), o(), l()
            })
    }

    function d(e, t, n, r, a) {
        return a.failed ? (u(n), void c(a.err, n, e, t)) : (_.set(n, {
                onData: e,
                onUpdateKey: t,
                ts: intval(a.ts)
            }), void a.events.map(function(e) {
                return e.split("<!>")
            })
            .forEach(e))
    }

    function g(e, t, n) {
        return Notifier.addKey(e, d.bind(null, t, n, e)), _.set(e, {
            onData: t,
            onUpdateKey: n,
            ts: e.ts
        }), l(), {
            stop: u.bind(null, e)
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.createWorker = g;
    var f = n(6),
        m = r(f),
        p = n(78),
        _ = new m["default"],
        v = !1
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e) {
        var t = e.get()
            .tabbedPeers.map(function(t) {
                return e.get()
                    .tabs[t.peer] || e.get()
                    .mapped_index[t.peer]
            })
            .filter(function(e) {
                return !e.deletedDialog
            })
            .map(function(e) {
                var t = e.peerId;
                return {
                    type: "peer",
                    peer: t
                }
            });
        return t.length > 0 && (t = [{
            type: "sep"
        }].concat(t)), t
    }

    function i(e, t) {
        if ("sep" === t.type) return getTemplate("im_right_menu_sep", {});
        var n = (0, m.getBaseLink)(e) + "?sel=" + t.peer + "&tab=" + e.get()
            .active_tab,
            r = (0, m.getBareTab)(t.peer, e),
            a = r.tab;
        return a = getTemplate("im_right_menu_ct", {
            name: a,
            count: r.unread > 0 ? r.unread : ""
        }), getTemplate("im_right_menu_tpl", {
            href: n,
            label: a,
            peer: t.peer,
            cls: r.unread > 0 ? "im-right-menu--unread" : ""
        })
    }

    function s(e, t, n, r) {
        var a = gpeByClass("_im_peer_tab", r),
            i = intval(domData(a, "list-id")),
            s = e.get()
            .tabbedPeers.filter(function(e) {
                var t = e.peer;
                return t !== i
            });
        return e.set(_.updateTabbedPeers.bind(null, s, !0))
            .then(function() {
                if (o(t, e), i === e.get()
                    .peer) e.get()
                    .longpoll.push([(0, v.resetPeer)()]);
                else if (0 !== e.get()
                    .peer) {
                    var n = gpeByClass("_im_right_menu", r);
                    uiRightMenu.hideSliding(n)
                }
            }), cancelEvent(n), !1
    }

    function o(e, t) {
        return e.pipeReplace(Promise.resolve(a(t)))
    }

    function l(e, t) {
        geByClass("_im_peer_tab", e)
            .forEach(function(e) {
                var n = q2ajx(attr(e, "href")
                    .split("?")[1]);
                n.tab !== t.get()
                    .active_tab && attr(e, "href", (0, m.getBaseLink)(t) + "?sel=" + n.sel + "&tab=" + t.get()
                        .active_tab)
            })
    }

    function u(e, t, n, r) {
        return {
            updateMenu: function(t) {
                l(e, t), o(n, t)
                    .then(function() {
                        var n;
                        n = t.get()
                            .peer ? ge("ui_rmenu_peer_" + t.get()
                                .peer) : ge("ui_rmenu_" + t.get()
                                .active_tab), n && uiRightMenu.switchMenu(n), uiRightMenu.hideProgress(e.parentNode)
                    })
            },
            updateName: function(e, t) {
                var n = ge("ui_rmenu_peer_" + e);
                if (n) {
                    var r = geByClass1("_im_r_tx", n),
                        a = t.get()
                        .tabs[e].tab;
                    val(r, a)
                }
            },
            updateCounter: function(e, t) {
                var n = ge("ui_rmenu_peer_" + t);
                if (n) {
                    var r = geByClass1("_im_r_ct", n),
                        a = e.get()
                        .tabs[t].unread;
                    val(r, a > 0 ? a : ""), toggleClass(n, "im-right-menu--unread", a > 0)
                }
            },
            unmount: function() {
                (0, p.removeDelegateEvent)(e, "click", "_im_r_cl", r), n.unmount()
            }
        }
    }

    function c(e, t, n) {
        var r = (0, d.mount)(e, (0, f["default"])({
                limit: 50,
                offset: 0,
                noScroll: !0,
                elements: a(t)
            }), function(e) {
                return {
                    idFn: function(e) {
                        return e.peer || "000"
                    },
                    renderFn: i.bind(null, t)
                }
            }),
            o = s.bind(null, t, r);
        return (0, p.addDelegateEvent)(e, "click", "_im_r_cl", o), (0, p.addDelegateEvent)(e, "click", "_im_peer_tab", function(e, n) {
            if (!checkEvent(e)) {
                var r = intval(domData(n, "list-id"));
                t.get()
                    .longpoll.push([(0, v.changePeer)(r, !1, !0, !0)]), cancelEvent(e)
            }
        }), u(e, t, r, o)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = c;
    var d = n(83),
        g = n(76),
        f = r(g),
        m = n(81),
        p = n(5),
        _ = n(73),
        v = (n(80), n(77))
}, function(e, t, n) {
    var r;
    (function(e, a, i) {
        (function() {
            "use strict";

            function s(e) {
                return "function" == typeof e || "object" == typeof e && null !== e
            }

            function o(e) {
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
                    Q(p)
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
                for (var e = 0; V > e; e += 2) {
                    var t = re[e],
                        n = re[e + 1];
                    t(n), re[e] = void 0, re[e + 1] = void 0
                }
                V = 0
            }

            function _() {
                try {
                    var e = n(109);
                    return Q = e.runOnLoop || e.runOnContext, d()
                } catch (t) {
                    return m()
                }
            }

            function v(e, t) {
                var n = this,
                    r = n._state;
                if (r === oe && !e || r === le && !t) return this;
                var a = new this.constructor(b),
                    i = n._result;
                if (r) {
                    var s = arguments[r - 1];
                    $(function() {
                        B(r, a, s, i)
                    })
                } else D(n, a, e, t);
                return a
            }

            function h(e) {
                var t = this;
                if (e && "object" == typeof e && e.constructor === t) return e;
                var n = new t(b);
                return I(n, e), n
            }

            function b() {}

            function y() {
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
                            r || (r = !0, t !== n ? I(e, n) : L(e, n))
                        }, function(t) {
                            r || (r = !0, A(e, t))
                        }, "Settle: " + (e._label || " unknown promise"));
                    !r && a && (r = !0, A(e, a))
                }, e)
            }

            function S(e, t) {
                t._state === oe ? L(e, t._result) : t._state === le ? A(e, t._result) : D(t, void 0, function(t) {
                    I(e, t)
                }, function(t) {
                    A(e, t)
                })
            }

            function k(e, t, n) {
                t.constructor === e.constructor && n === ae && constructor.resolve === ie ? S(e, t) : n === ue ? A(e, ue.error) : void 0 === n ? L(e, t) : o(n) ? w(
                    e, t, n) : L(e, t)
            }

            function I(e, t) {
                e === t ? A(e, y()) : s(t) ? k(e, t, T(t)) : L(e, t)
            }

            function P(e) {
                e._onerror && e._onerror(e._result), M(e)
            }

            function L(e, t) {
                e._state === se && (e._result = t, e._state = oe, 0 !== e._subscribers.length && $(M, e))
            }

            function A(e, t) {
                e._state === se && (e._state = le, e._result = t, $(P, e))
            }

            function D(e, t, n, r) {
                var a = e._subscribers,
                    i = a.length;
                e._onerror = null, a[i] = t, a[i + oe] = n, a[i + le] = r, 0 === i && e._state && $(M, e)
            }

            function M(e) {
                var t = e._subscribers,
                    n = e._state;
                if (0 !== t.length) {
                    for (var r, a, i = e._result, s = 0; s < t.length; s += 3) r = t[s], a = t[s + n], r ? B(n, r, a, i) : a(i);
                    e._subscribers.length = 0
                }
            }

            function x() {
                this.error = null
            }

            function O(e, t) {
                try {
                    return e(t)
                } catch (n) {
                    return ce.error = n, ce
                }
            }

            function B(e, t, n, r) {
                var a, i, s, l, u = o(n);
                if (u) {
                    if (a = O(n, r), a === ce ? (l = !0, i = a.error, a = null) : s = !0, t === a) return void A(t, C())
                } else a = r, s = !0;
                t._state !== se || (u && s ? I(t, a) : l ? A(t, i) : e === oe ? L(t, a) : e === le && A(t, a))
            }

            function F(e, t) {
                try {
                    t(function(t) {
                        I(e, t)
                    }, function(t) {
                        A(e, t)
                    })
                } catch (n) {
                    A(e, n)
                }
            }

            function N(e) {
                return new _e(this, e)
                    .promise
            }

            function R(e) {
                function t(e) {
                    I(a, e)
                }

                function n(e) {
                    A(a, e)
                }
                var r = this,
                    a = new r(b);
                if (!Z(e)) return A(a, new TypeError("You must pass an array to race.")), a;
                for (var i = e.length, s = 0; a._state === se && i > s; s++) D(r.resolve(e[s]), void 0, t, n);
                return a
            }

            function j(e) {
                var t = this,
                    n = new t(b);
                return A(n, e), n
            }

            function U() {
                throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
            }

            function H() {
                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
            }

            function G(e) {
                this._id = me++, this._state = void 0, this._result = void 0, this._subscribers = [], b !== e && ("function" != typeof e && U(), this instanceof G ?
                    F(this, e) : H())
            }

            function z(e, t) {
                this._instanceConstructor = e, this.promise = new e(b), Array.isArray(t) ? (this._input = t, this.length = t.length, this._remaining = t.length,
                    this._result = new Array(this.length), 0 === this.length ? L(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(),
                        0 === this._remaining && L(this.promise, this._result))) : A(this.promise, this._validationError())
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
            var K;
            K = Array.isArray ? Array.isArray : function(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            };
            var Q, W, Y, Z = K,
                V = 0,
                $ = function(e, t) {
                    re[V] = e, re[V + 1] = t, V += 2, 2 === V && (W ? W(p) : Y())
                },
                X = "undefined" != typeof window ? window : void 0,
                J = X || {},
                ee = J.MutationObserver || J.WebKitMutationObserver,
                te = "undefined" != typeof e && "[object process]" === {}.toString.call(e),
                ne = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                re = new Array(1e3);
            Y = te ? c() : ee ? g() : ne ? f() : void 0 === X ? _() : m();
            var ae = v,
                ie = h,
                se = void 0,
                oe = 1,
                le = 2,
                ue = new x,
                ce = new x,
                de = N,
                ge = R,
                fe = j,
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
                for (var e = this.length, t = this._input, n = 0; this._state === se && e > n; n++) this._eachEntry(t[n], n)
            }, z.prototype._eachEntry = function(e, t) {
                var n = this._instanceConstructor,
                    r = n.resolve;
                if (r === ie) {
                    var a = T(e);
                    if (a === ae && e._state !== se) this._settledAt(e._state, t, e._result);
                    else if ("function" != typeof a) this._remaining--, this._result[t] = e;
                    else if (n === pe) {
                        var i = new n(b);
                        k(i, e, a), this._willSettleAt(i, t)
                    } else this._willSettleAt(new n(function(t) {
                        t(e)
                    }), t)
                } else this._willSettleAt(r(e), t)
            }, z.prototype._settledAt = function(e, t, n) {
                var r = this.promise;
                r._state === se && (this._remaining--, e === le ? A(r, n) : this._result[t] = n), 0 === this._remaining && L(r, this._result)
            }, z.prototype._willSettleAt = function(e, t) {
                var n = this;
                D(e, void 0, function(e) {
                    n._settledAt(oe, t, e)
                }, function(e) {
                    n._settledAt(le, t, e)
                })
            };
            var ve = q,
                he = {
                    Promise: pe,
                    polyfill: ve
                };
            n(110)
                .amd ? (r = function() {
                    return he
                }.call(t, n, t, i), !(void 0 !== r && (i.exports = r))) : "undefined" != typeof i && i.exports ? i.exports = he : "undefined" != typeof this && (
                    this.ES6Promise = he), ve()
        })
        .call(this)
    })
    .call(t, n(107), function() {
        return this
    }(), n(108)(e))
}, function(e, t) {
    function n() {
        u = !1, s.length ? l = s.concat(l) : c = -1, l.length && r()
    }

    function r() {
        if (!u) {
            var e = setTimeout(n);
            u = !0;
            for (var t = l.length; t;) {
                for (s = l, l = []; ++c < t;) s && s[c].run();
                c = -1, t = l.length
            }
            s = null, u = !1, clearTimeout(e)
        }
    }

    function a(e, t) {
        this.fun = e, this.array = t
    }

    function i() {}
    var s, o = e.exports = {},
        l = [],
        u = !1,
        c = -1;
    o.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
            l.push(new a(e, t)), 1 !== l.length || u || setTimeout(r, 0)
        }, a.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = i, o.addListener = i, o.once = i, o.off = i, o.removeListener =
        i, o.removeAllListeners = i, o.emit = i, o.binding = function(e) {
            throw new Error("process.binding is not supported")
        }, o.cwd = function() {
            return "/"
        }, o.chdir = function(e) {
            throw new Error("process.chdir is not supported")
        }, o.umask = function() {
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
