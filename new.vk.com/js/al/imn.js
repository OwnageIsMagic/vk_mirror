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
    e.exports = n(87)
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
                    return (0, At.isFullyLoadedTab)(e, t)
                });
            e.renew_hashes = (0, St.post)(Dt, {
                    act: "a_renew_hash",
                    peers: n.join(","),
                    gid: e.gid
                })
                .then(function(t) {
                    var r = wt(t, 1),
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
        return a.tabHistoryNotChanged = !1, (0, St.post)(Dt, {
                act: "a_start",
                peer: e,
                msgid: n,
                history: t,
                prevpeer: a.prevPeer,
                gid: a.gid,
                block: r
            })
            .then(function(t) {
                var r = wt(t, 4),
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
        }, r.msgs), t.imQueueSet(e, a), t.tabs[e].history = (0, At.restoreQueue)(a, t, l(t.tabs[e].history)), Promise.resolve(t)
    }

    function m(e, t, n) {
        var r = n.imQueue(e, !1)
            .filter(function(e) {
                return e.failed && e.mess.messageId !== t
            });
        return n.imQueueSet(e, r), n.tabs[e].history = (0, At.removeMessages)([t], l(n.tabs[e].history)), Promise.resolve(n)
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
            .free === !1 ? Promise.resolve(t) : (0, St.post)(Dt, {
                act: "a_block",
                peer: e,
                prevPeer: t.prevPeer,
                gid: t.gid
            })
            .then(function(e) {
                var n = wt(e, 1),
                    r = n[0];
                return c(r, t)
            })
    }

    function b(e, t) {
        var n = t.peer;
        return Promise.resolve(t)
            .then(function(t) {
                return t.tabHistoryNotChanged = !1, (0, At.isFullyLoadedTab)(t, n) && !t.tabs[n].skipped ? (t.gid && h(n, t), Promise.resolve(t)
                    .then(T)) : d(n, e, !1, !0, t)
            })
            .then(T)
            .then(y.bind(null, n))
    }

    function y(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2];
        return (0, At.isTabLoaded)(t, e) && (t.tabs[e].last_touched = Date.now()), (0, At.isTabLoaded)(t, e) && n && (t.tabs[e].last_visited = Date.now()), t
    }

    function C(e, t, n) {
        var r = n.msgid,
            a = n.peer;
        return !e && (0, At.isFullyLoadedTab)(n, a) && n.tabs[a].msgs[r] ? (t === n.peer ? n.tabHistoryNotChanged = !0 : n.tabHistoryNotChanged = !1, n.gid && h(a, n),
                Promise.resolve(n)
                .then(T)
                .then(y.bind(null, a))) : d(a, !0, r, !0, n)
            .then(T)
            .then(y.bind(null, a))
    }

    function E(e, t, n) {
        if (et(n)) throw showFastBox({
            title: getLang("global_error"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, getLang("mail_message_wait_until_uploaded")), new Error("Cant change peer while loading somethind");
        var r = n.gid ? "gim" + n.gid : "im";
        if (n.prevPeer = n.peer, n.peer = e, n.msgid = t || "", cur.peer = e, xt({
                sel: e ? (0, At.convertPeerToUrl)(e) : null,
                msgid: n.msgid,
                email: "",
                0: r
            }), 0 != n.prevPeer && y(n.prevPeer, n, !0), 0 !== e) {
            var a = [];
            (0, At.isTabLoaded)(n, e) && y(e, n, !0), a = n.tabbedPeers.map(function(e) {
                    return e.peer
                })
                .indexOf(e) < 0 ? [{
                    peer: e,
                    type: "perm"
                }].concat(n.tabbedPeers) : n.tabbedPeers.map(function(t) {
                    return t.peer == e && "perm" !== t.type && (t.type = "perm"), t
                }), yt(a, !1, n)
        } else yt(n.tabbedPeers, !1, n);
        return Bt(), ye(n.prevPeer, n)
    }

    function T(e) {
        var t = e.peer;
        if (0 === t) return Promise.resolve(e);
        var n = e.tabs[t],
            r = n.data,
            a = [],
            i = e.mutedPeers;
        n.offset && a.push("photos"), n.offset && a.push("search"), (-2e9 > t || n.offset) && a.push("clear"), e.gid && a.push("block"), (0, At.isChatPeer)(t) && (r.kicked ||
            r.closed) || (inArray(t, i) ? a.push("unmute") : a.push("mute")), (0, At.isUserPeer)(t) && !e.gid && !n.blacklisted && n.is_friend && a.push("invite");
        var s = extend({}, r ? r.actions : {}),
            o = (0, At.chatActions)(e, s);
        return (0, At.isChatPeer)(t) && n.data.closed && (delete o.invite, s = extend({}, s), delete s.invite), e.curActions = a.concat(Object.keys(s))
            .sort(function(e, t) {
                return Ft[e] - Ft[t]
            })
            .reduce(function(e, t) {
                return e[t] = o[t], e
            }, {}), Promise.resolve(e)
    }

    function w(e, t, n) {
        var r = n.tabs[n.peer];
        return (0, St.post)(Dt, {
                peer: n.peer,
                whole: e,
                act: "a_history",
                offset: r.offset + (r.skipped || 0),
                toend: t,
                gid: n.gid
            })
            .then(function(e) {
                var t = wt(e, 4),
                    a = t[0],
                    i = t[1],
                    s = t[2],
                    o = t[3];
                return r.allShown = s, n.admins = extend(n.admins, o), r.history = a + u(r.history), r.historyToAppend = a, r.offset += Object.keys(i)
                    .length, r.msgs = extend(r.msgs, i), n
            })
    }

    function S(e) {
        var t = e.tabs[e.peer];
        return (0, St.post)(Dt, {
                peer: e.peer,
                act: "a_history",
                rev: 1,
                offset: t.skipped,
                gid: e.gid
            })
            .then(function(n) {
                var r = wt(n, 5),
                    a = r[0],
                    i = r[1],
                    s = r[2];
                r[3], r[4];
                return t.allShown = s, t.history = u(t.history) + a, t.historyToAppend = a, t.skipped -= Object.keys(i)
                    .length, t.msgs = extend(t.msgs, i), e
            })
    }

    function k(e, t, n, r) {
        var a = e.tabs[t];
        for (var i in a.msgs) {
            var s = a.msgs[i][0] ? It.eventTypes.FLAG_OUTBOUND : 0;
            n >= i && s === r && (a.msgs[i][1] = 0)
        }
        return e
    }

    function I(e, t) {
        var n = t.tabs[e],
            r = 0;
        for (var a in n.msgs) !n.msgs[a][0] && intval(a) > n.in_up_to && (r += n.msgs[a][1]);
        return r
    }

    function P(e, t, n) {
        var r = e.tabs[t];
        r.unread;
        return r.unread = I(t, e) + (r.unread > 0 ? n : 0), e
    }

    function L(e, t) {
        return (0, St.post)(Dt, {
                act: "a_email_start",
                email: e,
                hash: t.writeHash
            })
            .then(function(e) {
                var n = wt(e, 2),
                    r = n[0],
                    a = n[1];
                return V(r, t), a
            })
    }

    function A(e) {
        return (0, St.post)(Dt, {
                act: "a_get_key",
                uid: e.id,
                gid: e.gid
            })
            .then(function(t) {
                var n = wt(t, 3),
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

    function D(e) {
        return (0, St.post)(Dt, {
                act: "a_get_ts",
                gid: e.gid
            })
            .then(function(t) {
                var n = wt(t, 1),
                    r = n[0];
                return extend({}, e, {
                    imTs: r
                })
            })
    }

    function M(e) {
        var t = geByClass1("_im_unread_bar_row", e);
        return t && (t.parentNode.removeChild(t), (0, At.showInvisibleBar)(e)), e
    }

    function O(e, t, n) {
        var r = n.tabs[e];
        return r.msgs[t.messageId] && (r.msgs[t.messageId][3] = 1, r.history = (0, At.setMessageError)(e, t, l(r.history))), Promise.resolve(n)
    }

    function x(e, t, n, r) {
        var a = r.tabs[e];
        return a.msgs[t] && (a.msgs[t][3] = 0, a.lastmsg_meta = n, a.lastmsg = t, a.history = (0, At.startResendMessage)(e, t, l(a.history))), Promise.resolve(r)
    }

    function B(e, t, n, r) {
        var a = arguments.length <= 4 || void 0 === arguments[4] ? !1 : arguments[4];
        t.deletedDialog || (e.dialog_tabs = Object.keys(e.dialog_tabs)
            .reduce(function(e, i) {
                return !n && !ct(i)(t) || a && !a(i, e[i], t) || (e[i] = (0, Lt.arrayUnique)(r(e[i], i))), e
            }, e.dialog_tabs))
    }

    function F(e, t) {
        return 0 === e.length ? Promise.resolve(t) : (0, St.post)(Dt, {
                act: "a_get_admin",
                admins: e.join(","),
                gid: t.gid
            })
            .then(function(e) {
                var n = wt(e, 1),
                    r = n[0];
                return t.admins = extend(t.admins, r), t
            })
    }

    function N(e, t) {
        if (!inArray(e, t.tabbedPeers.map(function(e) {
                return e.peer
            })) && (0 !== t.peer || t.searchText) && !inArray(e, t.mutedPeers)) {
            var n = {
                peer: e,
                type: "temp"
            };
            yt(t.tabbedPeers.concat([n]), !1, t)
        }
    }

    function R(e, t) {
        return (0, At.isFullyLoadedTab)(t, e) && (t.tabs[e].data.kicked = 0), Promise.resolve(t)
    }

    function j(e, t) {
        var n = e.flags & It.eventTypes.FLAG_OUTBOUND,
            a = e.peerId;
        if ((0, At.isTabLoaded)(t, a)) {
            var i = t.tabs[a];
            if (i.deletedDialog = !1, (0, At.isFullyLoadedTab)(t, a)) {
                var s = l(i.history);
                i.skipped > 0 && i.skipped++, i.offset++, i.history = (0, At.appendToHistory)(t, e, s);
                var o = e.flags & It.eventTypes.FLAG_UNREAD ? 1 : 0,
                    u = e.flags & It.eventTypes.FLAG_OUTBOUND && !(0, At.isSelfMessage)(e.peerId, t.gid) ? 1 : 0,
                    c = e.flags & It.eventTypes.FLAG_IMPORTANT ? 1 : 0;
                i.msgs[e.messageId] = [u, o, c]
            }
            return !t.msg_local_ids_sort && e.local ? t.msg_local_ids_sort = r({}, e.messageId, 0) : e.local && (t.msg_local_ids_sort[e.messageId] = Object.keys(t.msg_local_ids_sort)
                    .length), i.typing && i.typing[e.userId] && delete i.typing[e.userId], i.lastmsg = e.messageId, i.lastmsg_meta = e, y(e.peerId, t), n ? i.unread = 0 :
                (!i.unread && U(t, 1, e.peerId), i.unread++, N(e.peerId, t)), B(t, i, !1, function(e) {
                    return [a].concat(e)
                }), Promise.resolve(t)
        }
        return d(a, !1, !1, !1, t)
            .then(function(t) {
                var r = t.tabs[a];
                return B(t, r, !1, function(e) {
                    return [a].concat(e)
                }), y(e.peerId, t), n || N(e.peerId, t), t
            })
    }

    function U(e, t, n) {
        e.cur_unread_cnt || (e.cur_unread_cnt = {}), -1 === t && delete e.cur_unread_cnt[n], e.unread_cnt += t
    }

    function H(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = n.unread;
            t = k(t, e.peerId, e.upToId, 0), t = P(t, e.peerId, intval(n.skipped)), r > 0 && !n.unread && U(t, -1, e.peerId), n.in_up_to = e.upToId, n.out_up_to < e.upToId &&
                (n.out_up_to = e.upToId), n.lastmsg_meta.messageId <= e.upToId && !(n.lastmsg_meta.flags & It.eventTypes.FLAG_OUTBOUND) && (n.lastmsg_meta.flags ^= It.eventTypes
                    .FLAG_UNREAD), n.history = M(l(n.history))
        } else(0, At.isTabLoaded)(t, e.peerId) && (t.tabs[e.peerId].unread > 0 && U(t, -1, e.peerId), t.tabs[e.peerId].unread = 0, t.tabs[e.peerId].in_up_to = e.upToId);
        return (0, At.isTabLoaded)(t, e.peerId) && (t.dialog_tabs[At.FOLDER_UNREAD] = t.dialog_tabs[At.FOLDER_UNREAD].filter(function(t) {
            return intval(t) !== e.peerId
        })), 0 !== t.unread_cnt || t.active_tab !== At.FOLDER_UNREAD || t.gid ? Promise.resolve(t) : dt(At.FOLDER_ALL, t)
    }

    function G(e, t) {
        if ((0, At.isTabLoaded)(t, e.peerId)) {
            var n = t.tabs[e.peerId];
            n.out_up_to = e.upToId, n.lastmsg_meta.messageId <= e.upToId && n.lastmsg_meta.flags & It.eventTypes.FLAG_OUTBOUND && (n.lastmsg_meta.flags ^= It.eventTypes.FLAG_UNREAD)
        }
        if ((0, At.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = l(n.history);
            n.history = (0, At.markMessagesAsRead)(t, e.peerId, r)
        }
        return Promise.resolve(t)
    }

    function z(e, t, n, r, a) {
        return a.text = {
            attachedFiles: 0
        }, a.imQueue = e, a.imQueueResend = t, a.imQueueSet = n, a.imQueueComplete = r, Promise.resolve(a)
    }

    function q(e, t) {
        var n = wt(e, 3),
            r = n[0],
            a = n[1],
            i = n[2];
        t.text.attachedFiles++, t._attach_cache || (t._attach_cache = {}), i ? t._attach_cache[r + a] = i : i = t._attach_cache[r + a];
        var s = t.peer;
        if ((0, At.isFullyLoadedTab)(t, s)) {
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

    function K(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e)) {
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

    function W(e, t, n) {
        return e = e.map(function(e) {
                return e.slice(0, 2)
                    .join(",")
            })
            .join("*"), (0, St.post)(Dt, {
                act: "draft_medias",
                media: e
            })
            .then(function(e) {
                var r = wt(e, 1),
                    a = r[0];
                return n.tabs[t].attaches = a, n
            })
    }

    function Q(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            if (!n.attaches || !n.attaches.length) {
                var r = ls.get(p(e)) || {},
                    a = (r.medias || [])
                    .filter(function(e) {
                        return !e[2]
                    });
                if (a.length > 0) return W(r.medias, e, t);
                n.attaches = r.medias || []
            }
        }
        return Promise.resolve(t)
    }

    function Y(e, t) {
        return e.set(Q.bind(null, t))
            .then(function(e) {
                return (0, At.isFullyLoadedTab)(e.get(), t) ? e.get()
                    .tabs[t].attaches : []
            })
    }

    function V(e, t) {
        var n = t.tabs[t.peer];
        return t.tabs = Object.keys(e)
            .reduce(function(n, r) {
                var a = t.tabs[r] ? t.tabs[r].msgs : {},
                    i = extend({}, a || {}, e[r].msgs || {});
                return n[r] = extend(t.tabs[r] || {}, e[r]), i && (n[r].msgs = i), n
            }, t.tabs), t.tabs[t.peer] = n, Promise.resolve(t)
    }

    function Z(e, t, n) {
        return (0, At.isTabLoaded)(n, e) && (n.tabs[e].online = t), Promise.resolve(n)
    }

    function $(e, t, n) {
        return (0, At.isTabLoaded)(n, e) && (n.tabs[e].typing = extend(n.tabs[e].typing, r({}, t, Date.now()))), Promise.resolve(n)
    }

    function X(e, t, n) {
        return (0, Pt.pause)(Mt + 2)
            .then(function() {
                if ((0, At.isTabLoaded)(n, e)) {
                    var r = n.tabs[e];
                    if (r.typing) {
                        var a = Date.now() - (r.typing[t] || 0);
                        a >= 1e3 * Mt && delete r.typing[t]
                    }
                }
                return n
            })
    }

    function J(e, t, n) {
        if ((0, At.isFullyLoadedTab)(n, e)) {
            t = clean(t), n.tabs[e].imdraft = t;
            var r = ls.get(_(e)) || {};
            ls.set(_(e), extend(r, {
                txt: t
            }))
        }
        return Promise.resolve(n)
    }

    function ee(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            if (!n.imdraft) {
                var r = ls.get(_(e));
                r && r.txt && (n.imdraft = r.txt)
            }
            return Promise.resolve(n.imdraft || "")
        }
        return Promise.resolve("")
    }

    function te(e, t) {
        t.selectedMessages || (t.selectedMessages = []);
        var n = t.selectedMessages.filter(function(t) {
            return t !== e
        });
        return n.length !== t.selectedMessages.length ? t.selectedMessages = n : t.selectedMessages.push(e), Promise.resolve(t)
    }

    function ne(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function re(e) {
        return e.selectedMessages = [], Promise.resolve(e)
    }

    function ae(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e.peerId)) {
            var n = t.tabs[e.peerId],
                r = t.imQueue(e.peerId)
                .filter(function(t) {
                    return t.failed && t.rid !== e.randomId
                });
            t.imQueueSet(e.peerId, r), t.imQueueComplete(e.peerId, e.randomId), n.history = (0, At.replaceMessageAttrs)(t, l(n.history), e), n.lastmsg_meta = e, n.lastmsg =
                e.messageId;
            var a = n.msgs["rid" + e.randomId];
            a && (n.msgs[e.messageId] = a, delete n.msgs["rid" + e.randomId])
        }
        return Promise.resolve(t)
    }

    function ie(e, t) {
        return Promise.resolve()
    }

    function oe(e, t) {
        return (0, St.post)(Dt, {
                act: "a_get_media",
                id: e.messageId,
                gid: t.gid
            })
            .then(function(n) {
                var r = wt(n, 3),
                    a = r[0],
                    i = r[1],
                    s = r[2],
                    o = t.tabs[e.peerId];
                return o.mediacontent || (o.mediacontent = {}), o.mediacontent[e.messageId] = [a, i, s], le(e, t)
            })
    }

    function le(e, t) {
        var n = t.tabs[e.peerId];
        return n.history = (0, At.replaceAttaches)(l(n.history), e, t), Promise.resolve(t)
    }

    function ue(e, t, n) {
        var r = (0, At.dayFromVal)(t),
            a = n.tabs[e];
        return a.searchDay = r, a.searchOffset = 0, a.searchAllLoaded = !1, Promise.resolve(n)
    }

    function ce(e, t, n) {
        if (t) {
            var r = n.tabs[t];
            r.searchText = e, r.searchOffset = 0, r.searchAllLoaded = !1
        } else n.searchText = e, n.searchOffset = 0, n.searchAllLoaded = !1;
        return Promise.resolve(n)
    }

    function de(e, t, n, r) {
        return (0, St.post)(Dt, {
                act: "a_hints",
                str: e,
                gid: r.gid,
                query: n,
                peerIds: t.join(",")
            })
            .then(function(e) {
                var t = wt(e, 2),
                    n = t[0],
                    a = t[1];
                return c(a, r), V(n, r), Object.keys(n)
                    .sort(function(e, t) {
                        return n[e].order - n[t].order
                    })
                    .map(function(e) {
                        return n[e]
                    })
            })
    }

    function ge(e, t, n, r) {
        return de(e, t, n, r)
            .then(function(e) {
                return e.map(function(e) {
                    return {
                        peerId: e.peerId,
                        name: e.tab,
                        photo: e.photo,
                        lastmsg: e.lastmsg,
                        online: e.online,
                        is_friend: "friends" === n ? !0 : !1
                    }
                })
            })
    }

    function fe(e, t) {
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

    function me(e) {
        var t;
        return e.friendsTree = new Promise(function(e) {
                t = e
            }), (0, St.post)(Dt, {
                act: "a_dialogs_preload",
                gid: e.gid
            })
            .then(function(n) {
                var r = wt(n, 1),
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

    function pe(e) {
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

    function _e(e) {
        var t = e.active_tab;
        return (0, St.post)("al_im.php", {
                act: "a_get_dialogs",
                offset: e.offset,
                tab: t,
                gid: e.gid
            })
            .then(function(n) {
                var r = wt(n, 3),
                    a = r[0],
                    i = r[1],
                    s = r[2];
                return c(s, e), V(i, e), e.dialog_tabs[t] = e.dialog_tabs[t].concat(Object.keys(i)
                    .map(intval)), e.offset = a.offset, e.dialog_tabs_all[t] = !a.has_more, Promise.resolve(e)
            })
    }

    function ve(e, t) {
        return (0, St.post)(Dt, {
                act: "a_search",
                q: e,
                from: "all",
                gid: t.gid,
                offset: t.searchOffset || 0
            })
            .then(function(n) {
                var r = wt(n, 4),
                    a = r[0],
                    i = r[1],
                    s = r[2],
                    o = r[3];
                return e === t.searchText && (t.searchOffset = s, t.searchAllLoaded = o), [a, i]
            })
    }

    function he(e, t) {
        var n = t.tabs[e];
        return n.searchAllLoaded
    }

    function be(e, t) {
        if (t.peer === e && (0, At.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.inplaceSearch
        }
        return !1
    }

    function ye(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.inplaceSearch, delete n.searchOffset, delete n.searchAllLoaded, delete n.searchText, delete n.searchDay
        }
        return Promise.resolve(t)
    }

    function Ce(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            delete n.searchDay, n.searchOffset = 0, n.searchAllLoaded = !1
        }
        return Promise.resolve(t)
    }

    function Ee(e, t) {
        var n = t.tabs[e];
        return n.inplaceSearch = !0, Promise.resolve(t)
    }

    function Te(e, t) {
        var n = t.tabs[e],
            r = "";
        if (Ee(e, t), n.searchDay && (r = "day:" + n.searchDay), !r && !n.searchText) return Promise.reject();
        var a = "in:" + e + " " + r + " " + (n.searchText || "");
        return (0, St.post)(Dt, {
                act: "a_search",
                q: a,
                from: "in",
                gid: t.gid,
                offset: n.searchOffset || 0
            })
            .then(function(e) {
                var t = wt(e, 3),
                    r = t[0],
                    a = t[1],
                    i = t[2];
                return n.searchOffset = a, n.searchAllLoaded = i, r
            })
    }

    function we(e) {
        return (0, St.post)(Dt, {
            act: "a_important",
            offset: e,
            gid: data.gid,
            part: e > 0
        })
    }

    function Se(e, t, n) {
        var t = n.peer;
        if ((0, At.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted = r.deleted ? r.deleted.concat(e) : e, r.history = (0, At.removeMessages)(e, l(r.history)), r.offset -= e.filter(function(e) {
                    return r.msgs[e]
                })
                .length, e.forEach(function(e) {
                    return delete r.msgs[e]
                })
        }
        return Promise.resolve(n)
    }

    function ke(e, t, n, r, a) {
        return (0, St.post)(Dt, {
            act: "a_mark",
            peer: t,
            hash: n,
            gid: a,
            msgs_ids: e.join(","),
            mark: r
        })
    }

    function Ie(e, t, n, r) {
        if ((0, At.isFullyLoadedTab)(r, t)) {
            var a = r.tabs[t];
            a.deleted = a.deleted ? a.deleted.concat(e) : e, a.history = (0, At.removeMessagesWithRestore)(e, t, n, l(a.history)), a.offset -= e.filter(function(e) {
                    return a.msgs[e]
                })
                .length
        }
        return Promise.resolve(r)
    }

    function Pe(e, t, n) {
        if ((0, At.isFullyLoadedTab)(n, t)) {
            var r = n.tabs[t];
            r.deleted && (r.deleted = r.deleted.filter(function(t) {
                return t !== e
            })), r.history = (0, At.restoreMessage)(e, t, l(r.history)), r.offset++
        }
        return Promise.resolve(n)
    }

    function Le(e, t, n, r) {
        return (0, St.post)(Dt, {
            act: "a_restore",
            id: e,
            peer: t,
            hash: n,
            gid: r
        })
    }

    function Ae(e, t) {
        return t.msgid = e, Promise.resolve(t)
    }

    function De(e, t, n) {
        if ((0, At.isFullyLoadedTab)(n, t)) {
            n.pendingForward = [];
            var r = n.tabs[t];
            r.fwdMessages = e, ls.set(v(t), e)
        }
        return Promise.resolve(n)
    }

    function Me(e, t) {
        if ((0, At.isFullyLoadedTab)(t, e)) {
            var n = t.tabs[e];
            return n.fwdMessages || (n.fwdMessages = ls.get(v(e)) || []), Promise.resolve(n.fwdMessages)
        }
        return Promise.resolve([])
    }

    function Oe(e, t) {
        return t.pendingForward = e, Promise.resolve(t)
    }

    function xe(e, t, n) {
        return n.tabs[e].tab = t, n.tabs[e].data.title = t, Promise.resolve(n)
    }

    function Be(e, t) {
        if (isEmpty(e)) return Promise.resolve(t);
        var n = Object.keys(e)
            .map(function(t) {
                return t + ":" + e[t].join(",")
            })
            .join(";");
        return (0, St.post)(Dt, {
                act: "a_load_member",
                need: n
            })
            .then(function(e) {
                var n = wt(e, 1),
                    r = n[0];
                return Object.keys(r)
                    .forEach(function(e) {
                        var n = r[e];
                        Object.keys(n)
                            .forEach(function(r) {
                                n[r] && t.tabs[e] && (t.tabs[e].data.members[r] = n[r])
                            })
                    }), t
            })
    }

    function Fe(e, t, n, r) {
        var a = e.filter(function(e) {
                return e.kludges.source_act === At.CHAT_INVITE_USER
            })
            .filter(function(e) {
                return r.tabs[e.peerId] && !r.tabs[e.peerId].data.members[e.kludges.source_mid]
            })
            .reduce(function(e, t) {
                var n = t.kludges.source_mid;
                return e[t.peerId] || (e[t.peerId] = []), inArray(n, e[t.peerId]) || e[t.peerId].push(n), e
            }, {}),
            i = t.filter(function(e) {
                return e.flags & It.eventTypes.FLAG_OUTBOUND && !e.local
            })
            .map(function(e) {
                return e.kludges.from_admin
            })
            .filter(function(e) {
                return e && !r.admins[e]
            });
        return 0 === Object.keys(a)
            .length && 0 === i.length ? Promise.resolve(r) : (n.pause(), Promise.all([Be(a, r), F(i, r)])["catch"](function() {
                    return r
                })
                .then(function() {
                    return n.resume()
                })
                .then(function() {
                    return r
                }))
    }

    function Ne(e, t, n, r) {
        var a = r.tabs[n];
        if (t !== vk.id) return Promise.resolve(r);
        if ((0, At.isTabLoaded)(r, n)) {
            if (e === At.CHAT_KICK_USER) {
                var a = r.tabs[n];
                a.data.closed = !0, delete a.data.actions.leave, delete a.data.actions.avatar, delete a.data.actions.topic, t === vk.id && (a.data.actions["return"] =
                    getLang("mail_return_to_chat"))
            } else e === At.CHAT_INVITE_USER && (a.data.closed = !1, delete a.data.actions["return"], a.data.actions.leave = getLang("mail_leave_chat"), a.data.actions.avatar =
                getLang("mail_update_photo"), a.data.actions.topic = getLang("mail_change_topic"));
            r = r.peer === n ? T(r) : Promise.resolve(r)
        }
        return Promise.resolve(r)
    }

    function Re(e, t, n) {
        var r = n.mutedPeers.filter(function(t) {
            return t !== e
        });
        return t && r.push(e), n.mutedPeers = r, cur.mutedPeers = n.mutedPeers, T(n)
    }

    function je(e, t, n) {
        return (0, At.isTabLoaded)(n, e) && delete n.tabs[e].data.members[t], Promise.resolve(n)
    }

    function Ue(e, t) {
        return t.stack = e, Promise.resolve(t)
    }

    function He(e, t, n, r) {
        if ((0, At.isFullyLoadedTab)(r, t)) {
            var a = r.tabs[t];
            e.filter(function(e) {
                    return a.msgs[e]
                })
                .forEach(function(e) {
                    a.msgs[e][2] = n, a.history = (0, At.updateStar)(e, n, l(a.history))
                })
        }
        return Promise.resolve(r)
    }

    function Ge(e, t, n) {
        n.importants || (n.importants = {});
        var r = n.importants[t] || 0;
        return r !== e && (n.important_cnt += e, n.importants[t] = e), Promise.resolve(n)
    }

    function ze(e, t) {
        return (0, St.post)(Dt, {
            act: "a_spam",
            offset: e,
            gid: t,
            part: e > 0
        })
    }

    function qe(e, t) {
        return (0, St.post)(Dt, {
            act: "a_flush_spam",
            gid: t,
            hash: e
        })
    }

    function Ke(e, t, n) {
        return n.creationType = e, n.creationFilter = t, Promise.resolve(n)
    }

    function We(e, t) {
        return (0, St.post)(Dt, {
            act: "a_owner_photo",
            photo: JSON.parse(e)
                .data[0],
            peer: t
        })
    }

    function Qe(e, t) {
        return t.next_chat_avatar = e, Promise.resolve(t)
    }

    function Ye(e, t, n) {
        return (0, St.post)("al_page.php", {
                act: "owner_photo_save",
                peer: e,
                _query: t
            })
            .then(function(e) {
                return n
            })
    }

    function Ve(e, t, n, r) {
        return r.creating = !0, r.longpoll.pause(), (0, St.post)(Dt, {
                act: "a_multi_start",
                hash: r.writeHash,
                peers: t.join(","),
                title: n
            })
            .then(function(e) {
                var t = wt(e, 1),
                    n = t[0];
                return r.next_peer = n.peerId, r.tabs[n.peerId] = n, B(r, n, !1, function(e) {
                    return [n.peerId].concat(e)
                }), r.longpoll.resume(), r
            })
            .then(function(t) {
                return e ? Ye(t.next_peer, e, t) : t
            })
            .then(function(e) {
                return e.creating = !1, e
            })["catch"](function(e) {
                throw r.creating = !1, r.longpoll.resume(), e
            })
    }

    function Ze(e) {
        var t;
        e.resync_in_process = new Promise(function(e) {
            t = e
        });
        var n = Object.keys(e.tabs)
            .length,
            a = e.active_tab;
        return (0, St.post)(Dt, {
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
                var s = wt(i, 4),
                    o = s[0],
                    u = s[1],
                    c = s[2],
                    d = s[3];
                if (u.user_unread && handlePageCount("msg", u.user_unread), (0, Lt.lplog)("Resync success", "success"), console.log(o, u, "resync data"), a === At.FOLDER_ALL &&
                    Object.keys(o)
                    .length < n && 100 !== Object.keys(o)
                    .length) throw new Error("Not full data from server, retry");
                var g, f = e.peer;
                return g = (0, At.isReservedPeer)(f) ? Promise.resolve(!1) : V(r({}, f, o[f]), {
                    tabs: r({}, f, e.tabs[f])
                }), g.then(function(n) {
                    e.tabs = o, e.admins = extend(e.admins, c), n && (e.tabs[f] = n.tabs[f], e.tabs[f].history = (0, At.restoreQueue)(f, e, l(e.tabs[f].history))),
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
                            a == At.FOLDER_ALL ? e.dialog_tabs[t] = r.filter(ct(t))
                                .map(function(e) {
                                    return e.peerId
                                }) : e.dialog_tabs[t] = []
                        }), delete e.resync_in_process, setTimeout(t.bind(null, !0), 0), tt(intval(u.unread), e)
                })
            })["catch"](function(t) {
                return (0, Lt.lplog)("Resync error: " + t.message + " " + t.stack, "error"), (0, Pt.pause)(2)
                    .then(Ze.bind(null, e))
            })
    }

    function $e(e, t, n, r) {
        if ((0, At.isTabLoaded)(r, e)) {
            var a = r.tabs[e].data.members[n];
            t == n ? a.closed = 1 : a.kicked = 1, n === vk.id && t != n && (r.tabs[e].data.kicked = 1)
        }
        return Promise.resolve(r)
    }

    function Xe(e, t, n) {
        return e && !n.delayed_message ? (n.delayed_message = e, n.delayed_ts = t) : e || (n.delayed_message = e, n.delayed_ts = t), Promise.resolve(n)
    }

    function Je() {
        return window.Upload && Upload.options ? Object.keys(Upload.options)
            .map(function(e) {
                return Upload.options[e]
            })
            .filter(function(e) {
                return e.xhr && 4 !== e.xhr.readyState && 0 !== e.xhr.readyState
            })
            .length > 0 : !1
    }

    function et(e) {
        var t = e.textMediaSelector;
        return !!t.urlAttachmentLoading || Je()
    }

    function tt(e, t) {
        return t.unread_cnt = e, t.dialog_tab_cts[At.FOLDER_UNREAD] = e, Promise.resolve(t)
    }

    function nt(e, t) {
        return t.ctrl_submit = !!e, (0, St.post)(Dt, {
                act: "a_save_ctrl_submit",
                to: t.peer,
                hash: t.tabs[t.peer].hash,
                value: e ? 1 : 0
            })
            .then(function(e) {
                return t
            })
    }

    function rt(e) {
        return "bind_to_url_store_" + e
    }

    function at(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach || (n.bind_url_to_attach = ls.get(rt(e)) || {}), Promise.resolve(n.bind_url_to_attach)
    }

    function it(e, t, n, r, a) {
        return at(e, a)
            .then(function(i) {
                return i[r] = [t, n], ls.set(rt(e), i), Promise.resolve(a)
            })
    }

    function st(e, t) {
        var n = t.tabs[e];
        return n.bind_url_to_attach = {}, ls.set(rt(e), {}), Promise.resolve(t)
    }

    function ot(e, t, n) {
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

    function lt(e, t, n) {
        n.cur_unread_cnt || (n.cur_unread_cnt = {}), t && !inArray(e, n.mutedPeers) && (n.cur_unread_cnt[e] = !0);
        var r = document.title,
            a = window.devicePixelRatio >= 2 ? "_2x" : "";
        if (t && !n.update_title_to) {
            var i = ot(r, a, n);
            n.update_title_to = setInterval(i, 1e3), i()
        } else !t && n.update_old_title && (document.title = n.update_old_title, n.cur_unread_cnt = {}, r = !1, n.update_old_title = !1, setFavIcon(
            "/images/icons/favicons/fav_im" + a + ".ico"), clearInterval(n.update_title_to), n.update_title_to = !1);
        return Promise.resolve(n)
    }

    function ut(e, t, n) {
        return (0, At.isFullyLoadedTab)(n, e) && (n.tabs[e].scrollBottom = t), Promise.resolve(n)
    }

    function ct(e) {
        return e === At.FOLDER_ALL ? function() {
            return !0
        } : e === At.FOLDER_UNREAD ? function(e) {
            return e.unread > 0
        } : e === At.FOLDER_UNRESPOND ? function(t) {
            return !(t.folders & At.FOLDER_MASKS[e])
        } : function(t) {
            return t.folders & At.FOLDER_MASKS[e]
        }
    }

    function dt(e, t) {
        t.active_tab;
        t.active_tab = e, (0, kt.updateLocation)({
            tab: e === At.FOLDER_ALL ? null : e
        });
        var n = [];
        if (e !== At.FOLDER_ALL) {
            var r = t.dialog_tabs[e];
            n = t.dialog_tabs[At.FOLDER_ALL].map(function(e) {
                    return t.tabs[e]
                })
                .filter(ct(e))
                .map(function(e) {
                    return e.peerId
                }), t.dialog_tabs[e] = r.length >= n.length ? r : n
        }
        return t.offset = t.dialog_tabs[e].length, Promise.resolve(t)
    }

    function gt(e, t, n) {
        return e === It.eventTypes.SET_DIRECTORIES && n.folders & t ? !1 : e !== It.eventTypes.RESET_DIRECTORIES || n.folders & t ? !0 : !1
    }

    function ft(e, t, n) {
        var r;
        return r = t === It.eventTypes.REPLACE_DIRECTORIES ? e.folders & At.FOLDER_MASKS[n] ? -1 : 1 : t === It.eventTypes.SET_DIRECTORIES ? 1 : -1, n === At.FOLDER_UNRESPOND &&
            (r = -r), r
    }

    function mt(e, t, n, r, a) {
        if ((0, At.isTabLoaded)(a, e)) {
            var i = a.tabs[e];
            if (n === It.eventTypes.REPLACE_DIRECTORIES && (t ^= i.folders), gt(n, t, i)) {
                Object.keys(At.FOLDER_MASKS)
                    .filter(function(e) {
                        return At.FOLDER_MASKS[e] & t
                    })
                    .forEach(function(e) {
                        a.dialog_tab_cts[e] += ft(i, n, e)
                    })
            }
            n === It.eventTypes.SET_DIRECTORIES ? a.tabs[e].folders |= t : n === It.eventTypes.RESET_DIRECTORIES ? a.tabs[e].folders &= ~t : a.tabs[e].folders = t ^= i.folders;
            var s = a.dialog_tabs_all;
            return B(a, a.tabs[e], !0, function(t, n) {
                return t.concat([e])
                    .map(function(e) {
                        return a.tabs[e]
                    })
                    .filter(ct(n))
                    .map(function(e) {
                        return e.peerId
                    })
            }, function(e, t, n) {
                if (s[At.FOLDER_ALL] || s[e]) return !0;
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
            .then(mt.bind(null, e, t, n, a))
    }

    function pt(e) {
        return (0, St.post)(Dt, {
            act: "a_get_mutex_key",
            gid: e
        })
    }

    function _t(e, t) {
        return c(r({}, e, {
                free: !0
            }), t), (0, St.post)(Dt, {
                act: "a_block_release",
                peer: e,
                gid: t.gid
            })
            .then(function() {
                return t
            })
    }

    function vt(e, t) {
        var n = ls.get("comm_mute_" + t.gid) ? 1 : 0;
        return e && (n = 1 ^ n), ls.set("comm_mute_" + t.gid, n), t.mute = n, Promise.resolve(t)
    }

    function ht(e, t, n, r) {
        return (0, St.post)(Dt, {
                act: "a_restore_dialog",
                hash: t,
                gid: r.gid,
                spam: n ? 1 : 0,
                peer: e
            })
            .then(function(t) {
                return r.tabs[e].deletedDialog = !1, B(r, r.tabs[e], !1, function(t) {
                    return [e].concat(t)
                }), r.tabs[e].unread = t, r
            })
    }

    function bt(e, t, n) {
        return (0, St.post)(Dt, {
            act: "a_spam_dialog",
            peer: e,
            gid: n.gid,
            hash: t
        })
    }

    function yt(e, t, n) {
        return n.tabbedPeers = e, (0, At.isClassicInterface)(n) && (xt({
            peers: n.tabbedPeers.filter(function(e) {
                    var t = e.peer,
                        r = e.type;
                    return t !== n.peer && "perm" === r
                })
                .map(function(e) {
                    return (0, At.getBareTab)(e.peer, n)
                })
                .filter(function(e) {
                    return !e.deletedDialog
                })
                .map(function(e) {
                    return e.peerId
                })
                .map(At.convertPeerToUrl)
                .join("_")
        }), t && Bt()), Promise.resolve(n)
    }

    function Ct(e) {
        return e.peer ? be(e.peer, e) ? he(e.peer, e) : (0, At.isFullyLoadedTab)(e, e.peer) ? e.tabs[e.peer].allShown : !1 : !0
    }

    function Et(e, t) {
        var n = t.tabs[e];
        return (0, At.isFullyLoadedTab)(t, e) && (n.last_act_mobile = null, n.last_act = null, n.skipped = null, n.msgs = null, n.offset = null, n.allShown = null, n.history =
            null), console.log(n), Promise.resolve(t)
    }

    function Tt(e, t) {
        var n = t.tabs[e];
        return (0, At.isFullyLoadedTab)(t, e) && (n.history = u(n.history)), Promise.resolve(t)
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.deleteDialog = t.markDialogAnswered = t.toggleDialogImportant = t.favMessage = t.toggleMutePeer = t.returnToChat = t.leaveChat = t.updateChatPhoto = t.addNewMember =
        t.updateChatTopic = t.flushHistory = t.sendTyping = t.searchLocalHints = t.searchFriends = t.deliverMessage = t.readLastMessages = t.ACTION_PRIORITIES = t.TYPING_PERIOD =
        void 0;
    var wt = function() {
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
    t.strHistory = u, t.updateBlockStates = c, t.loadPeer = d, t.restoreHistoryQueue = f, t.removeFailed = m, t.selectPeer = b, t.selectPeerOnMessage = C, t.changePeer = E,
        t.setActions = T, t.loadMoreHistory = w, t.loadLessHistory = S, t.countUnread = I, t.createEmailChat = L, t.loadLongPollKey = A, t.loadLongPollTs = D, t.removeUnreadBar =
        M, t.setMessageErrored = O, t.resendMessage = x, t.loadAdmins = F, t.returnedToChat = R, t.addMessage = j, t.markInboundMessagesAsRead = H, t.markOutboundMessagesAsRead =
        G, t.initTextStore = z, t.addMediaStore = q, t.cleanMediaStore = K, t.restoreAttaches = Q, t.getAttaches = Y, t.mergeTabs = V, t.updateOnline = Z, t.setTyping = $,
        t.waitTyping = X, t.saveTextDraft = J, t.getTextDraft = ee, t.addSelection = te, t.cleanSelected = ne, t.dropSelection = re, t.replaceMessage = ae, t.saveMedia =
        ie, t.loadMedia = oe, t.replaceMediaAttachesStore = le, t.setCurrentSearchDate = ue, t.setCurrentSearch = ce, t.searchHints = de, t.searchHintsIndex = ge, t.fetchFriends =
        me, t.fetchLocalHints = pe, t.loadDialogs = _e, t.searchMessages = ve, t.isSearchAllLoaded = he, t.isSearchingInplace = be, t.cancelSearch = ye, t.clearDate = Ce,
        t.searchInplaceStart = Ee, t.searchMessagesInplace = Te, t.loadImportant = we, t.removeMessages = Se, t.removeMessageSend = ke, t.removeMessagesWithRestore = Ie, t
        .restoreMessage = Pe, t.restoreMessageSend = Le, t.changeMessage = Ae, t.forwardMessages = De, t.getForwardedMessages = Me, t.prepareForward = Oe, t.setChatTitle =
        xe, t.loadChatMember = Be, t.checkNewPeople = Fe, t.updateActions = Ne, t.setMutedPeer = Re, t.removeMember = je, t.setExecStack = Ue, t.updateFavMessage = He, t.updateImportant =
        Ge, t.loadSpam = ze, t.flushSpam = qe, t.setCreationType = Ke, t.getOwnerPhoto = We, t.presetAvatar = Qe, t.setChatPhoto = Ye, t.createChat = Ve, t.resync = Ze, t.chatKickUser =
        $e, t.setDelayedMessage = Xe, t.isAnythingLoading = et, t.updateUnreadCount = tt, t.changeSubmitSettings = nt, t.getBindAttachToUrl = at, t.bindAttachToUrl = it, t
        .clearAttachToUrl = st, t.updateFavAndTitle = lt, t.saveHistoryScroll = ut, t.filterFromTab = ct, t.changeDialogsTab = dt, t.updateFolderState = mt, t.getMutexQueue =
        pt, t.releaseBlock = _t, t.toggleCommunityMute = vt, t.restoreDialog = ht, t.spamDialog = bt, t.updateTabbedPeers = yt, t.isEverythingLoaded = Ct, t.cleanTab = Et,
        t.stringifyTab = Tt;
    var St = n(38),
        kt = n(52),
        It = n(22),
        Pt = n(25),
        Lt = n(10),
        At = n(2),
        Dt = "al_im.php",
        Mt = t.TYPING_PERIOD = 5,
        Ot = (0, kt.updateLazyLocation)(),
        xt = Ot.scheduleNav,
        Bt = Ot.commitNav,
        Ft = t.ACTION_PRIORITIES = {
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
                return t - e;
            });
        return n.skipped > 0 && (r = r.filter(function(e) {
            return intval(e) <= n.lastmsg - n.skipped
        })), r = intval(r.shift()), r <= n.in_up_to ? Promise.resolve(t) : (t.longpoll.push([It.eventTypes.readInboundEvent([6, e, r])]), (0, St.post)(Dt, {
                peer: e,
                ids: [r],
                hash: n.hash,
                act: "a_mark_read",
                gid: t.gid
            })
            .then(function() {
                return k(t, e, r, It.eventTypes.FLAG_OUTBOUND)
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
        return o && (r = o[2].url), (0, St.post)(Dt, {
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
                var t = wt(e, 1),
                    r = t[0];
                return n.version !== r.version && nav.reload({
                    force: !0
                }), n
            })
    }), t.searchFriends = fe(function(e) {
        return e.friendsTree
    }, function(e, t) {
        return t[3] - e[3]
    }), t.searchLocalHints = fe(function(e) {
        return e.hintsTree
    }, function(e, t) {
        return e[3] - t[3]
    }), t.sendTyping = o(function(e, t) {
        return t.tabs[e].lastTyping = Date.now(), (0, St.post)(Dt, {
                act: "a_typing",
                peer: e,
                gid: t.gid,
                hash: t.tabs[e].hash
            })
            .then(function(e) {
                return t
            })
    }), t.flushHistory = o(function(e, t) {
        if ((0, At.isTabLoaded)(t, e)) {
            t.blockedFlagUpdates || (t.blockedFlagUpdates = {}), t.blockedFlagUpdates[e] = !0, B(t, t.tabs[e], !0, function(t) {
                return t.filter(function(t) {
                    return t !== e
                })
            }), t.tabs[e].unread > 0 && U(t, -1, e), 0 === t.unread_cnt && t.unread_only && toggleUnreadOnly(t);
            var n = t.tabs[e];
            n.deletedDialog = !0;
            var r = t.tabbedPeers.filter(function(t) {
                return t.peer !== e
            });
            return yt(r, !0, t), (0, St.post)("al_im.php", {
                    act: "a_flush_history",
                    id: e,
                    from: "im",
                    gid: t.gid,
                    hash: t.tabs[e].hash
                })
                .then(function(r) {
                    var a = wt(r, 2);
                    a[0], a[1];
                    return delete t.blockedFlagUpdates[e], n.msgs = null, n.history = null, n.unread = 0, t
                })
        }
    }), t.updateChatTopic = o(function(e, t, n) {
        var r = n.tabs[e];
        return (0, St.post)(Dt, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_title: t,
                hash: r.hash
            })
            .then(function(t) {
                var a = wt(t, 2),
                    i = (a[0], a[1]);
                return n.tabs[e] = extend(r, i), n
            })
    }), t.addNewMember = o(function(e, t, n) {
        var r = n.tabs[e];
        return (0, St.post)(Dt, {
                act: "a_get_chat",
                cur_peers: Object.keys(r.data.members)
                    .join(","),
                cur_title: r.data.title,
                chat: e - 2e9,
                new_peer: t.join(","),
                hash: r.hash
            })
            .then(function(t) {
                var a = wt(t, 2),
                    i = a[0],
                    s = a[1];
                return i.forEach(function(e) {
                    if (e.error) throw new Error(e.message)
                }), n.tabs[e] = extend(r, s), n
            })
    }), t.updateChatPhoto = o(function(e, t) {
        return e.kludges.source_act === At.CHAT_PHOTO_REMOVE ? (delete t.tabs[e.peerId].photo, Promise.resolve(t)) : (0, St.post)(Dt, {
                act: "a_get_chat_photo",
                msg_id: e.messageId
            })
            .then(function(n) {
                var r = wt(n, 2),
                    a = r[0],
                    i = r[1];
                t.chat_photo_msg = i;
                var s = t.tabs[e.peerId];
                if (t.tabs[e.peerId].photo = a, (0, At.isFullyLoadedTab)(t, e.peerId)) {
                    var o = e.kludges.source_act;
                    s.history = (0, At.addChatPhotoToUpdate)(e, o, t, l(s.history))
                }
                return t
            })
    }), t.leaveChat = o(function(e, t) {
        return (0, St.post)(Dt, {
                act: "a_leave_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Ne.bind(null, At.CHAT_KICK_USER, vk.id, e, t))
    }), t.returnToChat = o(function(e, t) {
        return (0, St.post)(Dt, {
                act: "a_return_to_chat",
                chat: e - 2e9,
                hash: t.tabs[e].hash
            })
            .then(Ne.bind(null, At.CHAT_INVITE_USER, vk.id, e, t))
    }), t.toggleMutePeer = o(function(e, t, n) {
        return (0, St.post)(Dt, {
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
            .then(Re.bind(null, e, t))
    }), t.favMessage = o(function(e, t, n, r) {
        return He(e, n, t, r), (0, St.post)(Dt, {
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
        var n = At.FOLDER_MASKS[At.FOLDER_IMPORTANT],
            r = t.tabs[e].folders & n,
            a = r ? It.eventTypes.resetDirectoriesEvent : It.eventTypes.setDirectoriesEvent;
        return t.longpoll.push([a([0, e, n, !0])]), (0, St.post)(Dt, {
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
        var r = At.FOLDER_MASKS[At.FOLDER_UNRESPOND];
        return n.longpoll.push([It.eventTypes.setDirectoriesEvent([0, e, r, !0]), It.eventTypes.readInboundEvent([6, e, t])]), (0, St.post)(Dt, {
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
        return B(t, t.tabs[e], !0, function(t) {
                return t.filter(function(t) {
                    return t !== e
                })
            }), t.tabs[e].deletedDialog = !0, (0, St.post)(Dt, {
                act: "a_delete_dialog",
                peer: e,
                gid: t.gid,
                hash: t.tabs[e].hash
            })
            .then(function(n) {
                return n[0] && (t.tabs[e].unread = 0), n
            })
    })
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
            })), t.flags & Me.eventTypes.FLAG_OUTBOUND && t.flags & Me.eventTypes.FLAG_UNREAD && l.push("im-mess_unread _im_mess_unread");
        var g = Date.now() - 1e3 * t.date > 1e3;
        t.local && g && l.push("im-mess_sending"), t.local && l.push("" + Ne), t.failed && l.push("im-mess_failed " + Re);
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
                aria_hidden: t.local && !t.failed ? "true" : "false",
                ts: t.date,
                marker_params: t.failed ? 'aria-label="' + getLang("mail_send_message_error") + '" role="link"' : "",
                cls: l.join(" ")
            }),
            C = domLC(n);
        (hasClass(C, Ge) || hasClass(C, He)) && (C = domPS(C));
        var E = geByClass("_im_mess", n)
            .pop(),
            T = C ? intval(domData(C, "peer")) : 0,
            w = E ? 1e3 * intval(domData(E, "ts")) + 1e3 * e.timeshift : 0,
            P = C ? intval(domData(C, "admin")) : !1,
            L = t.flags & Me.eventTypes.FLAG_OUTBOUND ? e.id : t.userId,
            A = t.flags & Me.eventTypes.FLAG_OUTBOUND;
        if (S(A, a.unread, T, w, L, t, P, e.gid) || m) {
            var D = "",
                M = !1;
            if (e.peer === t.peerId && !a.inplaceSearch || a.unread || t.flags & Me.eventTypes.FLAG_OUTBOUND || (D += getTemplate("im_mess_bar", {}), M = !0), !isToday(new Date(
                    w)) && (t.local && r || !t.local && r)) {
                var O = new Date,
                    x = M ? "im-page--history-new-bar_hide _im_invisible_bar" : "";
                D += getTemplate("im_day_bar", {
                    day: getShortDate(t.date, e.timeshift, !0, getLang("months_of", "raw")),
                    date: t.date,
                    day_class: O.getDate() + O.getMonth() + O.getFullYear() + " " + x
                })
            }
            if (K(t)) D += getTemplate("im_service_row", {
                text: Q(t, a),
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
                if (t.local) var G = k(t.date, e.timeshift);
                else var G = getTemplate("im_stack_date", {
                    date: k(t.date, e.timeshift),
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
            }(0, Fe.toArray)(sech(D))
            .forEach(function(e) {
                return n.appendChild(e)
            })
        } else {
            var q = geByClass1("_im_unread_bar_row", n);
            q && e.peer === t.peerId && !a.inplaceSearch && (q.parentNode.removeChild(q), d(n)), geByClass1("_im_stack_messages", C)
                .appendChild(se(y))
        }
        return t.flags & Me.eventTypes.FLAG_OUTBOUND && !g && setTimeout(function() {
            var e = geByClass1("_im_mess_" + t.messageId, n);
            hasClass(e, Ne) && addClass(e, "im-mess_sending")
        }, 500), c = c.filter(function(e) {
            return e.rid !== t.randomId
        }), f(c, e, n)
    }

    function f(e, t, n) {
        var r;
        return r = "object" === ("undefined" == typeof e ? "undefined" : De(e)) ? e : t.imQueue(e, !1), r.length > 0 && r.map(function(e) {
                return e.mess.failed = !!e.failed, e.mess
            })
            .forEach(function(e) {
                return g(t, e, n, !1)
            }), n
    }

    function m(e, t, n) {
        var r = e.tabs[t];
        return (0, Fe.toArray)(geByClass("_im_mess_unread", n))
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
        if (!T(t, e.peerId)) return 0;
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

    function E(e, t) {
        return e === t.peer
    }

    function T(e, t) {
        return e = ye(e), e.tabs[t] && e.tabs[t].msgs && e.tabs[t].history ? !0 : !1
    }

    function w(e, t) {
        return e.tabs[t] ? !0 : !1
    }

    function S(e, t, n, r, a, i, s, o) {
        return n !== a ? !0 : o && s !== intval(i.kludges.from_admin) ? !0 : Date.now() - r > 3e5 ? !0 : t || e || a === vk.id ? K(i) ? !0 : isToday(new Date(r)) ? !1 : !0 :
            !0
    }

    function k(e, t) {
        new Date(1e3 * e);
        return langDate(1e3 * e, "{hour}:{minute} {am_pm}", 1e3 * t, [], !0)
    }

    function I(e, t, n) {
        return e = (e || "")
            .replace(xe.MESSAGE_REGEXP, function() {
                var e = Array.prototype.slice.apply(arguments),
                    t = e[1] || "",
                    r = e[2] || "http://",
                    a = e[3] || "",
                    i = a + (e[4] || ""),
                    s = (e[2] || "") + e[3] + e[4];
                if (-1 == a.indexOf(".") || -1 != a.indexOf("..")) return e[0];
                var o = a.split(".")
                    .pop();
                if ((o.length > 7 || -1 == indexOf(xe.TOP_DOMAINS.split(","), o)) && (!/^[a-zA-Z]+$/.test(o) || !e[2])) return e[0];
                if (-1 != e[0].indexOf("@")) return e[0];
                try {
                    s = decodeURIComponent(s)
                } catch (l) {}
                if (s.length > 55 && (s = s.substr(0, 53) + ".."), s = clean(s)
                    .replace(/&amp;/g, "&"), !n && a.match(xe.OUR_DOMAINS)) {
                    i = replaceEntities(i)
                        .replace(xe.ENTITIES, encodeURIComponent);
                    var u, c = i,
                        d = i.indexOf("#/"),
                        g = "";
                    return d >= 0 ? c = i.substr(d + 1) : (d = i.indexOf("#!"), d >= 0 && (c = "/" + i.substr(d + 2)
                            .replace(/^\//, ""))), u = c.match(xe.VK_DOMAIN), u && u[1].length < 32 && (g = ' mention_id="' + u[1] +
                            '" onclick="return mentionClick(this, event)" onmouseover="mentionOver(this)"'), t + '<a href="' + (r + i)
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;") + '" target="_blank"' + g + ">" + s + "</a>"
                }
                return t + '<a href="away.php?utf=1&to=' + encodeURIComponent(r + replaceEntities(i)) + '" target="_blank" onclick="return goAway(\'' + clean(r + i) +
                    "', {}, event);\">" + s + "</a>"
            }), e = e.replace(xe.EMAIL, function(e) {
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

    function O(e) {
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

    function x(e, t) {
        if (e.photo) return '<a href="javascript:void(0)">\n      <div class="im_grid">\n        <img src="' + e.photo + '" alt="" />\n      </div>\n    </a>';
        var n = [];
        n = e.data.active ? (0, Fe.toArray)(e.data.active)
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
        return i = t ? [] : i, O(a, i)
    }

    function B() {
        return '<li class="im-page--messages-search">' + getLang("mail_search_messages") + "</li>"
    }

    function F(e, t, n) {
        var r = geByClass1("_im_mess_" + t.messageId, n);
        if (r) {
            attr(r, "aria-hidden", "false"), addClass(r, "im-mess_failed " + Re);
            var a = geByClass1("_im_mess_marker", r);
            attr(a, "aria-label", getLang("mail_send_message_error")), attr(a, "role", "link")
        }
        return n
    }

    function N(e, t, n) {
        var r = geByClass1("_im_mess_" + t, n);
        if (r) {
            removeClass(r, "im-mess_failed"), attr(r, "aria-hidden", "true"), removeClass(r, Re);
            var a = geByClass1("_im_mess_marker", r);
            attr(a, "aria-label", ""), attr(a, "role", "")
        }
        return n
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
            var a = geByClass1(je, r);
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
        return '<div class="im-mess--text">\n    ' + getLang(a) + ' <button type="button" data-peer="' + e + '" class="' + Ue + ' im-mess--btn">' + getLang("mail_restore") +
            '</button>\n    <div class="' + je + ' im-mess--original">' + r + "</div>\n  </div>"
    }

    function q() {
        return '<div class="im-page--chat-search-empty">\n    ' + getLang("mail_im_search_empty") + "\n  </div>"
    }

    function K(e) {
        return e.kludges && "undefined" != typeof e.kludges.source_act
    }

    function W(e, t, n) {
        return n ? '<a class="im_srv_lnk" target="_blank" href="' + e + '">' + t + "</a>" : "<span>" + t + "</span>"
    }

    function Q(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !0 : arguments[2],
            r = e.kludges,
            a = r.source_act,
            i = intval(r.source_mid),
            s = e.userId,
            o = t.data.members[s],
            l = "",
            u = s === i;
        switch (a) {
            case ze:
                l = "mail_im_chat_created";
                break;
            case qe:
                l = "mail_im_title_updated";
                break;
            case Ke:
                l = u ? "mail_im_returned_to_chat" : "mail_im_invited";
                break;
            case We:
                l = u ? "mail_im_left" : "mail_im_kicked_from_chat";
                break;
            case Qe:
                l = "mail_im_photo_set";
                break;
            case Ye:
                l = "mail_im_photo_removed";
                break;
            default:
                return ""
        }
        if (l = langSex(o.sex, getLang(l, "raw")), l = l.replace("{from}", W(o.link, o.name, n)), i && i !== s) {
            var c = r.source_email;
            if (c) l = l.replace("{user}", W("/im?email=${encodeURIComponent(email)", "email", n));
            else {
                var d = t.data.members[i],
                    g = a === We ? d.name_kick_case : d.name_inv_case;
                l = l.replace("{user}", W(d.link, g, n))
            }
        }
        return r.source_text && (l = l.replace("{title}", '&laquo;<b class="im_srv_lnk">' + r.source_text + "</b>&raquo;")), l
    }

    function Y(e, t, n, r) {
        if (t === Qe) {
            var a = geByClass1("_im_mess_" + e.messageId, r);
            if (a) {
                var i = n.tabs[e.peerId];
                a.parentNode.innerHTML = getTemplate("im_msg_row", {
                    msg_id: e.messageId,
                    from_id: e.peerId,
                    text: Q(e, i) + n.chat_photo_msg,
                    ts: e.date,
                    cls: "im-mess_srv"
                })
            }
        }
        return r
    }

    function V(e) {
        return e.replace(/&lt;&lt;/g, "&laquo;")
            .replace(/&gt;&gt;/g, "&raquo;")
            .replace(/ \-\-/g, " &mdash;")
            .replace(/\-\- /g, "&mdash; ")
    }

    function Z(e, t) {
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

    function J(e, t) {
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

    function ee(e, t) {
        var n = e;
        if (!t && !n) return !1;
        var r = n.target || n.srcElement,
            a = 4,
            i = !1,
            s = /_im_mess|im_log_act|im_log_ract|_im_log_body|im_log_rspacer|_im_graffiti_w/;
        do
            if (!r || r.onclick || r.onmousedown || "A" == r.tagName || hasClass(r, "im_msg_media_link") || "IMG" == r.tagName && !hasClass(r, "_im_graffiti") && !hasClass(
                    r, "emoji") && !hasClass(r, "emoji_css") && !hasClass(r, "im_gift") || "TEXTAREA" == r.tagName || hasClass(r, "play_new") || (i = s.test(r.className)))
                break;
        while (a-- && (r = r.parentNode));
        if (!i) return !0;
        var o = trim((window.getSelection && window.getSelection() || document.getSelection && document.getSelection() || document.selection && document.selection.createRange()
                .text || "")
            .toString());
        return o ? !0 : !1
    }

    function te(e, t) {
        return '<div class="im-mess--text">\n      <span>' + getLang("mail_restored") + '</span>\n      <a class="_im_go_to" href="/im?sel=' + P(e) + "&msgid=" + t + '">' +
            getLang("mail_im_goto_conversation") + "</a>\n    </div>"
    }

    function ne(e, t) {
        return showFastBox({
            title: getLang("mail_deleteall1"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, e > 2e9 ? getLang("mail_chat_sure_to_delete_all") : getLang("mail_sure_to_delete_all"), getLang("mail_delete"), t, getLang("global_cancel"))
    }

    function re(e, t, n, r, a) {
        t.showProgress(), e.set(r.bind(null, a))
            .then(function() {
                t.hideProgress(), t.hide(), n()
                    .removePeer(e, a), n()
                    .updateDialogFilters(e)
            })
    }

    function ae(e, t, n, r, a) {
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
                (0, Be.addDelegateEvent)(r.bodyNode.parentNode, "click", "_im_invite_box", function() {
                    r.hide(), ie(e, e.get()
                        .peer, t, n)
                })
            }
        }, r)
    }

    function ie(e, t, n, r) {
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

    function oe(e, t, n) {
        if (e.get()
            .active_tab === $e && 0 === e.get()
            .unread_cnt) return !1;
        var r = e.get()
            .active_tab === $e ? Ze : $e;
        return e.set(n.bind(null, r))
            .then(function(e) {
                t()
                    .restoreDialogs(e, !0)
            })
    }

    function le(e, t, n, r) {
        return t.get()
            .active_tab === e ? !1 : (t.set(r.bind(null, e))
                .then(function(e) {
                    n()
                        .restoreDialogs(e, !0)
                }), !0)
    }

    function ue(e, t) {
        "undefined" == typeof t && (t = e.get()
            .peer);
        var n = e.get()
            .tabs[t];
        return et[Je] & n.folders
    }

    function ce(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2];
        if ("undefined" == typeof t && (t = e.get()
                .peer), !Te(e)) return !1;
        var r = n || e.get()
            .tabs[t];
        return !(et[Xe] & r.folders)
    }

    function de(e, t) {
        return (t.get()
                .block_states[e] || {})
            .free === !1
    }

    function ge(e) {
        return e.get()
            .pendingForward && e.get()
            .pendingForward.length > 0
    }

    function fe(e, t) {
        return (t.get()
                .block_states[e] || {})
            .who === vk.id
    }

    function me(e, t) {
        var n = e.get()
            .block_states;
        Object.keys(n)
            .forEach(function(r) {
                n[r].time ? n[r].free === !1 && Date.now() - n[r].time >= 5e4 && t.push([Me.eventTypes.mutexEvent([, 1, "gim" + e.get()
                    .gid, r, 0, ""
                ])]) : n[r].time = Date.now()
            })
    }

    function pe(e, t, n) {
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

    function _e(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3],
            a = e.get()
            .tabs[t];
        if (!a.last_act || !a.last_act[0]) return {
            str: "",
            time: ""
        };
        var i = getDateText(a.last_act[0], e.get()
                .timeshift),
            s = langSex(a.sex, getLang("mail_last_activity_tip", "raw"))
            .replace("{user}", n ? a.name : "")
            .replace("{time}", i);
        return a.last_act_mobile && (s += ve(t, r)), {
            str: getTemplate("im_last_act", {
                lastact: s
            }),
            time: i
        }
    }

    function ve(e, t) {
        var n;
        return getTemplate("im_wrap_mobile", (n = {}, a(n, "class", "im_status_mob_onl"), a(n, "params", "mid: " + e + ", was: 1," + (t ? "forcetoup: true" :
            "forcetodown: true")), a(n, "attrs", ""), n))
    }

    function he(e, t) {
        var n = t.get()
            .tabs[e];
        return showBox("al_settings.php", {
            act: "blacklist_box",
            q: n.href
        }, {
            stat: ["settings.js", "settings.css"],
            dark: 1
        })
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

    function Ee(e) {
        return ye(e)
            .gid
    }

    function Te(e) {
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

    function Pe() {
        return "INPUT" === document.activeElement.tagName || "TEXTAREA" === document.activeElement.tagName || document.activeElement.getAttribute("contenteditable")
    }

    function Le(e, t, n) {
        var r = geByClass1("_im_mess_" + e, n);
        return r && toggleClass(r, "im-mess_fav", t), n
    }
    Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.selectionRemove = t.FOLDER_MASKS = t.FOLDERS = t.FOLDER_IMPORTANT = t.FOLDER_UNRESPOND = t.FOLDER_ALL = t.FOLDER_UNREAD = t.SHOW_CHAT_MEMBERS_CLASS = t.DESLECT_ALL_CLASS =
        t.CHAT_PHOTO_REMOVE = t.CHAT_PHOTO_UPDATE = t.CHAT_KICK_USER = t.CHAT_INVITE_USER = t.CHAT_TITLE_ACTION = t.CREATE_CHAT_ACTION = t.TYPING_CLASS = t.LAST_ACT_CLASS =
        t.RESTORE_CLASS = t.ORIGINAL_CLASS = t.FAILED_CLASS = t.SENDING_CLASS = void 0;
    var Ae, De = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
    };
    t.fixTableCellChildHeight = i, t.renderSticker = s, t.isAlreadyDeleted = o, t.replaceMessageAttrs = l, t.renderAttach = u, t.dayFromVal = c, t.showInvisibleBar = d, t.appendToHistory =
        g, t.restoreQueue = f, t.markMessagesAsRead = m, t.replaceAttaches = p, t.isDuplicate = _, t.isReservedPeer = v, t.isUserPeer = h, t.isChatPeer = b, t.isComunityPeer =
        y, t.isPeerActive = E, t.isFullyLoadedTab = T, t.isTabLoaded = w, t.parseMessage = I, t.convertPeerToUrl = P, t.unUrlPeer = L, t.chatActions = A, t.renderPhotos =
        O, t.renderPhotosFromTab = x, t.renderMessagesSearch = B, t.setMessageError = F, t.startResendMessage = N, t.removeMessages = R, t.removeMessagesWithRestore = U, t
        .restoreMessage = H, t.formatTyper = G, t.renderEmptySearch = q, t.isServiceMsg = K, t.renderServiceMsg = Q, t.addChatPhotoToUpdate = Y, t.replaceSpecialSymbols =
        V, t.isSelfMessage = Z, t.showVerifiedTooltip = $, t.wrapLoading = X, t.tabFromIds = J, t.checkSelectClick = ee, t.renderGoTo = te, t.showFlushDialog = ne, t.cleanHistory =
        re, t.showChatMembers = ae, t.inviteUser = ie, t.showUnreadOnly = oe, t.changeTab = le, t.isImportant = ue, t.isUnrespond = ce, t.isPeerBlocked = de, t.isPendingForward =
        ge, t.isPeerBlockedByMe = fe, t.blockLatencyCompensation = me, t.showSpamLayer = pe, t.getLastTime = _e, t.getMobileIcon = ve, t.showBlacklistBoxUser = he, t.showBlacklistBox =
        be, t.isClassicInterface = Ce, t.isLocksAvailable = Ee, t.isFoldersAvailable = Te, t.isCommunityInterface = we, t.getBaseLink = Se, t.showFavvedBox = ke, t.getBareTab =
        Ie, t.isEditableFocused = Pe, t.updateStar = Le;
    var Me = n(22),
        Oe = n(37),
        xe = r(Oe),
        Be = n(3),
        Fe = n(10),
        Ne = t.SENDING_CLASS = "_im_mess_sending",
        Re = t.FAILED_CLASS = "_im_mess_faild",
        je = t.ORIGINAL_CLASS = "_im_mess_original",
        Ue = t.RESTORE_CLASS = "_im_mess_restore",
        He = t.LAST_ACT_CLASS = "_im_last_act",
        Ge = t.TYPING_CLASS = "_im_typing",
        ze = t.CREATE_CHAT_ACTION = "chat_create",
        qe = t.CHAT_TITLE_ACTION = "chat_title_update",
        Ke = t.CHAT_INVITE_USER = "chat_invite_user",
        We = t.CHAT_KICK_USER = "chat_kick_user",
        Qe = t.CHAT_PHOTO_UPDATE = "chat_photo_update",
        Ye = t.CHAT_PHOTO_REMOVE = "chat_photo_remove",
        Ve = t.DESLECT_ALL_CLASS = "_im_deselect_all",
        Ze = (t.SHOW_CHAT_MEMBERS_CLASS = "_im_show_chat_mems", t.FOLDER_UNREAD = "unread"),
        $e = t.FOLDER_ALL = "all",
        Xe = t.FOLDER_UNRESPOND = "unrespond",
        Je = t.FOLDER_IMPORTANT = "important",
        et = (t.FOLDERS = [$e, Ze, Xe, Je], t.FOLDER_MASKS = (Ae = {}, a(Ae, Xe, 2), a(Ae, Je, 1), Ae));
    t.selectionRemove = function() {
        return '<button aria-label="' + getLang("mail_deselect_all") + '" type="button" class="im-deselect ' + Ve + '"></button>'
    }
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
    var l = n(56),
        u = r(l),
        c = new u["default"]
}, function(e, t) {
    "use strict";

    function n(e) {
        var t = L(e, 2),
            n = t[1];
        return {
            type: A,
            localId: n
        }
    }

    function r(e) {
        var t = L(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: M,
            messageId: n,
            mask: r,
            peerId: a
        }
    }

    function a(e) {
        var t = L(e, 4),
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

    function i(e) {
        var t = L(e, 4),
            n = t[1],
            r = t[2],
            a = t[3];
        return {
            type: O,
            messageId: n,
            flags: r,
            peerId: a
        }
    }

    function s(e) {
        for (var t = L(e, 9), n = t[1], r = t[2], a = t[3], i = t[4], s = t[5], o = t[6], l = t[7], u = t[8], c = [], d = 1; l["attach" + d + "_type"];) c.push({
            type: l["attach" + d + "_type"],
            id: l["attach" + d],
            productId: l["attach" + d + "_product_id"],
            build: l["attach" + d + "_build"],
            kind: l["attach" + d + "_kind"]
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
            type: x,
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
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: B,
            peerId: n,
            upToId: r
        }
    }

    function l(e) {
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: F,
            peerId: n,
            upToId: r
        }
    }

    function u(e) {
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: N,
            userId: -n,
            platform: r
        }
    }

    function c(e) {
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: R,
            userId: -n,
            reason: r
        }
    }

    function d(e) {
        var t = L(e, 4),
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

    function g(e) {
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: W,
            peerId: n,
            mask: r
        }
    }

    function f(e) {
        var t = L(e, 4),
            n = t[1],
            r = t[2],
            a = t[3],
            i = void 0 === a ? !1 : a;
        return {
            type: Q,
            peerId: n,
            mask: r,
            local: i
        }
    }

    function m(e) {
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: j,
            chatId: n,
            self: r
        }
    }

    function p(e) {
        var t = L(e, 2),
            n = t[1];
        return {
            type: U,
            userId: n,
            peerId: n
        }
    }

    function _(e) {
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: U,
            userId: n,
            peerId: r + 2e9
        }
    }

    function v(e) {
        var t = L(e, 3),
            n = t[1],
            r = t[2];
        return {
            type: H,
            userId: n,
            callId: r
        }
    }

    function h(e) {
        var t = L(e, 2),
            n = t[1];
        return {
            type: G,
            count: n
        }
    }

    function b(e) {
        var t = L(e, 2),
            n = t[1],
            r = void 0 === n ? {} : n;
        return {
            type: z,
            peerId: r.peer_id,
            sound: r.sound,
            disabledUntil: r.disabled_until
        }
    }

    function y(e) {
        return {
            type: q,
            params: e
        }
    }

    function C(e) {
        return {
            type: V,
            state: e
        }
    }

    function E() {
        return {
            type: Y
        }
    }

    function T() {
        var e = arguments.length <= 0 || void 0 === arguments[0] ? !1 : arguments[0];
        return {
            type: Z,
            cancelSearch: e
        }
    }

    function w(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1],
            n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? !1 : arguments[3];
        return {
            type: X,
            peerId: e,
            msgid: t,
            forward: n,
            cancelSearch: r
        }
    }

    function S(e) {
        return {
            type: J,
            tab: e
        }
    }

    function k(e, t) {
        return {
            type: ee,
            message: t,
            peer: e
        }
    }

    function I(e) {
        var t = L(e, 6),
            n = (t[0], t[1]),
            r = t[2],
            a = t[3],
            i = t[4],
            s = t[5];
        return {
            type: $,
            free: !!intval(n) || intval(i) === vk.id,
            resource: r,
            peerId: intval(a),
            who: intval(i),
            name: s
        }
    }

    function P(e, t) {
        return {
            type: te,
            message: t,
            peerId: e
        }
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
        _, t.videoCallEvent = v, t.unreadCountEvent = h, t.notifySettingsChangedEvent = b, t.emptyEvent = y, t.transitionEvent = C, t.resyncEvent = E, t.resetPeer = T, t.changePeer =
        w, t.changeTab = S, t.failedMessage = k, t.mutexEvent = I, t.resendEvent = P;
    var A = t.DELETE = "event_delete",
        D = t.SET_FLAGS = "event_set_flags",
        M = t.REPLACE_FLAGS = "event_replace_flags",
        O = t.RESET_FLAGS = "event_reset_flags",
        x = t.ADD_MESSAGE = "event_add_message",
        B = t.READ_INBOUND = "event_read_inbound",
        F = t.READ_OUTBOUND = "event_read_outbound",
        N = t.GOT_ONLINE = "event_got_online",
        R = t.GOT_OFFLINE = "event_got_offline",
        j = t.CHAT_CHANGED = "event_chat_changed",
        U = t.TYPING = "event_typing",
        H = t.VIDEO_CALL = "event_video_call",
        G = t.UNREAD_COUNT = "event_unread_count",
        z = t.NOTIFY_SETTINGS_CHANGED = "event_notify_settings_changed",
        q = t.EMPTY = "event_empty",
        K = t.RESET_DIRECTORIES = "event_reset_directories",
        W = t.REPLACE_DIRECTORIES = "event_replace_directories",
        Q = t.SET_DIRECTORIES = "event_set_directories",
        Y = t.RESYNC = "event_resync",
        V = t.TRANSITION = "transition_event",
        Z = t.RESET_PEER = "reset_peer",
        $ = t.MUTEX = "mutex",
        X = t.CHANGE_PEER = "change_peer",
        J = t.CHANGE_TAB = "event_change_tab",
        ee = t.FAILED_MESSAGE = "event_failed_message",
        te = t.RESEND = "event_resend";
    t.FLAG_UNREAD = 1, t.FLAG_OUTBOUND = 2, t.FLAG_IMPORTANT = 8, t.FLAG_CHAT = 16, t.FLAG_FRIENDS = 32, t.FLAG_SPAM = 64, t.FLAG_DELETED = 128, t.FLAG_MEDIA = 512, t.FOLDER_IMPORTANT =
        1, t.FOLDER_UNRESPOND = 2
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
}, , , function(e, t, n) {
    var r = n(69)("wks"),
        a = n(35),
        i = n(9)
        .Symbol,
        s = "function" == typeof i;
    e.exports = function(e) {
        return r[e] || (r[e] = s && i[e] || (s ? i : a)("Symbol." + e))
    }
}, function(e, t) {
    var n = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
    "number" == typeof __g && (__g = n)
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

    function r(e) {
        return e.length > 0 && e.pop()
            .func(), e
    }

    function a(e, t) {
        var n, r;
        if (window.__debugMode) {
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
    }

    function i(e) {
        var t = [];
        if ("undefined" == typeof e.length) return Object.keys(e)
            .map(function(t) {
                return e[t]
            });
        for (var n = 0; n < e.length; n++) t.push(e[n]);
        return t
    }

    function s(e) {
        for (var t = {}, n = [], r = 0; r < e.length; r++) t[e[r]] || (n.push(e[r]), t[n[r]] = 1);
        return n
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.throttleAccumulate = n, t.executionStackPop = r, t.lplog = a, t.toArray = i, t.arrayUnique = s
}, , function(e, t, n) {
    e.exports = !n(33)(function() {
        return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            })
            .a
    })
}, function(e, t) {
    var n = {}.hasOwnProperty;
    e.exports = function(e, t) {
        return n.call(e, t)
    }
}, function(e, t, n) {
    var r = n(20),
        a = n(42);
    e.exports = n(12) ? function(e, t, n) {
        return r.f(e, t, a(1, n))
    } : function(e, t, n) {
        return e[t] = n, e
    }
}, function(e, t) {
    e.exports = function(e) {
        return "object" == typeof e ? null !== e : "function" == typeof e
    }
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
}, , , function(e, t, n) {
    var r = n(15);
    e.exports = function(e) {
        if (!r(e)) throw TypeError(e + " is not an object!");
        return e
    }
}, function(e, t, n) {
    var r = n(19),
        a = n(64),
        i = n(71),
        s = Object.defineProperty;
    t.f = n(12) ? Object.defineProperty : function(e, t, n) {
        if (r(e), t = i(t, !0), r(n), a) try {
            return s(e, t, n)
        } catch (o) {}
        if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");
        return "value" in n && (e[t] = n.value), e
    }
}, function(e, t, n) {
    var r = n(9),
        a = n(14),
        i = n(13),
        s = n(35)("src"),
        o = "toString",
        l = Function[o],
        u = ("" + l)
        .split(o);
    n(30)
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
        return e.pauses || (e.pauses = []), (0, T.lplog)("Aborting all pauses", "error"), e.pauses.forEach(function(e) {
            return e()
        }), e.pauses = [], Promise.resolve(e)
    }

    function d(e, t, n, r) {
        if (r.failed) var a = (0, C.abortablePause)(S, e),
            i = a.abort,
            s = a.pause;
        switch (r.failed) {
            case 1:
                return (0, T.lplog)("Old timestamp, init resync", "error"), e.set(u.bind(null, i)), n([y.resyncEvent()]), e.set(p.loadLongPollTs)
                    .then(s)
                    .then(g.bind(null, e, t, n));
            case 2:
                return (0, T.lplog)("Key is incorrect", "error"), e.set(u.bind(null, i)), e.set(p.loadLongPollKey)
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
            .stopped || ((0, T.lplog)("New request"), g(e, n, t)
                .then(i)
                .then(function(e) {
                    return (0, T.lplog)("Request success", "success"), e
                })
                .then(t)["catch"](function(t) {
                    return "pause" !== t.message && topError(t), (0, T.lplog)("Error, waiting: " + (t.message || "no message (probably browser reset)"), "error"), e.set(
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
            d = (0, E.initQueue)(function(e, t) {
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
    var p = n(1),
        _ = n(5),
        v = a(_),
        h = n(38),
        b = n(4),
        y = r(b),
        C = n(25),
        E = n(51),
        T = n(10),
        w = (t.eventTypes = y, 202),
        S = 4
}, , function(e, t) {
    e.exports = {}
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
}, , , , function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    t.screenfull = function() {
        var e = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
            t = function() {
                for (var e, t, n = [
                        ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                        ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange",
                            "webkitfullscreenerror"
                        ],
                        ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange",
                            "webkitfullscreenerror"
                        ],
                        ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
                        ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
                    ], r = 0, a = n.length, i = {}; a > r; r++)
                    if (e = n[r], e && e[1] in document) {
                        for (r = 0, t = e.length; t > r; r++) i[n[0][r]] = e[r];
                        return i
                    }
                return !1
            }(),
            n = {
                request: function r(n) {
                    var r = t.requestFullscreen;
                    n = n || document.documentElement, /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? n[r]() : n[r](e && Element.ALLOW_KEYBOARD_INPUT)
                },
                exit: function() {
                    document[t.exitFullscreen]()
                },
                toggle: function(e) {
                    this.isFullscreen ? this.exit() : this.request(e)
                },
                raw: t
            };
        return t ? (Object.defineProperties(n, {
            isFullscreen: {
                get: function() {
                    return Boolean(document[t.fullscreenElement])
                }
            },
            element: {
                enumerable: !0,
                get: function() {
                    return document[t.fullscreenElement]
                }
            },
            enabled: {
                enumerable: !0,
                get: function() {
                    return Boolean(document[t.fullscreenEnabled])
                }
            }
        }), n) : !1
    }()
}, function(e, t) {
    var n = e.exports = {
        version: "2.2.1"
    };
    "number" == typeof __e && (__e = n)
}, function(e, t, n) {
    var r = n(110);
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
        if (void 0 == e) throw TypeError("Can't call method on  " + e);
        return e
    }
}, function(e, t) {
    e.exports = function(e) {
        try {
            return !!e()
        } catch (t) {
            return !0
        }
    }
}, function(e, t, n) {
    var r = n(117),
        a = n(32);
    e.exports = function(e) {
        return r(a(e))
    }
}, function(e, t) {
    var n = 0,
        r = Math.random();
    e.exports = function(e) {
        return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++n + r)
            .toString(36))
    }
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

    function E(e, t) {
        e.get()
            .loading ? t.update(!1, !0) : (e.get()
                .loading = !0, t.update(!1, !0), e.get()
                .loading = !1)
    }

    function T(e, t, n, r, a) {
        var i = r.get()
            .limit,
            s = r.get()
            .offset,
            o = (n()
                .sortFn, _(n()
                    .sortFn, r.get()));
        o = o.slice(0, s + i);
        var l = (0, x.toArray)(e.children)
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
            .renderFn), E(r, t);
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
                        .pipeId)) : (s = Promise.resolve(), T(t, a, n, e)), s
            });
        return r || (0, O.wrapLoading)(t)(s, "bottom", "im-preloader_fixed-bottom"), s
    }

    function P(e, t) {
        var n = e.get()
            .pipeId;
        return !("undefined" != typeof n && "undefined" != typeof t && n !== t)
    }

    function L(e, t, n, a, i, s) {
        return P(e, i) ? e.set(r.bind(null, s, a()
                .idFn))
            .then(T.bind(null, t, n, a)) : !1
    }

    function A(e, t, n, r, a) {
        return e.set(c.bind(null, a, r()
                .idFn))
            .then(T.bind(null, t, n, r))
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
                        .then(T.bind(null, e, c, n, t, i)) : void 0
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
                        .then(T.bind(null, e, c, n)) : Promise.resolve(), u.then(function() {
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
                    .then(T.bind(null, e, c, n))
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
    var M = n(3),
        O = n(2),
        x = n(10),
        B = n(39)
}, function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var n = (t.OUR_DOMAINS = /^([a-zA-Z0-9\.\_\-]+\.)?(vkontakte\.ru|vk\.com|vkadre\.ru|vshtate\.ru|userapi\.com|vk\.me)$/, t.ENTITIES = /([^a-zA-Z0-9#%;_\-.\/?&=\[\]])/g,
            t.VK_DOMAIN = /^(?:https?:\/\/)?(?:vk\.com|vkontakte\.ru)?\/([a-zA-Z0-9\._]+)\??$/, t.EMAIL =
            /([a-zA-Z\-_\.0-9]+@[a-zA-Z\-_0-9]+\.[a-zA-Z\-_\.0-9]+[a-zA-Z\-_0-9]+)/g, t.TOP_DOMAINS =
            "camera,info,name,academy,aero,arpa,coop,media,museum,mobi,travel,xxx,asia,biz,com,net,org,gov,mil,edu,int,tel,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,ax,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cd,cf,cg,ch,ci,ck,cl,cm,cn,co,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,er,es,et,eu,fi,fj,fk,fm,fo,fr,ga,gd,ge,gf,gg,gh,gi,gl,gm,gn,gp,gq,gr,gs,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,im,in,io,iq,ir,is,it,je,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,mk,ml,mm,mn,mo,mp,mq,mr,ms,mt,mu,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,ps,pt,pw,py,qa,re,ro,ru,rs,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,ss,st,su,sv,sx,sy,sz,tc,td,tf,tg,th,tj,tk,tl,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,um,us,uy,uz,va,vc,ve,vg,vi,vn,vu,wf,ws,ye,yt,yu,za,zm,zw,рф,укр,сайт,онлайн,срб,дети,cat,pro,local",
            t.MESSAGE_REGEXP =
            /(^|[^A-Za-z0-9А-Яа-яёЁ\-\_])(https?:\/\/)?((?:[A-Za-z\$0-9А-Яа-яёЁ](?:[A-Za-z\$0-9\-\_А-Яа-яёЁ]*[A-Za-z\$0-9А-Яа-яёЁ])?\.){1,5}[A-Za-z\$рфуконлайнстдетиРФУКОНЛАЙНСТДЕТИ\-\d]{2,22}(?::\d{2,5})?)((?:\/(?:(?:\&amp;|\&#33;|,[_%]|[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.~=;:]+|\[[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\))*(?:,[_%]|[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.~=;:]*[A-Za-z0-9А-Яа-яёЁ\_#%?+\/\$~=]|\[[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\)))?)?)/gi,
            t.ARROW_UP = 38),
        r = t.ARROW_DOWN = 40,
        a = t.PAGE_UP = 33,
        i = t.PAGE_DOWN = 34,
        s = t.END_KEY = 35,
        o = t.HOME = 36,
        l = t.ENTER = 13,
        u = t.ESC = 27;
    t.UNPRINTABLE_KEYS = [n, r, a, i, l, u, s, o], t.UP_DOWN_CONTROLS = [a, i, r, n], t.PRINTABLE = "printable"
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
}, , function(e, t, n) {
    "use strict";
    var r = n(122),
        a = n(62),
        i = n(21),
        s = n(14),
        o = n(13),
        l = n(24),
        u = n(120),
        c = n(43),
        d = n(125),
        g = n(8)("iterator"),
        f = !([].keys && "next" in [].keys()),
        m = "@@iterator",
        p = "keys",
        _ = "values",
        v = function() {
            return this
        };
    e.exports = function(e, t, n, h, b, y, C) {
        u(n, t, h);
        var E, T, w, S = function(e) {
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
            O = "Array" == t ? L.entries || A : A;
        if (O && (w = d(O.call(new e)), w !== Object.prototype && (c(w, k, !0), r || o(w, g) || s(w, g, v))), I && A && A.name !== _ && (P = !0, D = function() {
                return A.call(this)
            }), r && !C || !f && !P && L[g] || s(L, g, D), l[t] = D, l[k] = v, b)
            if (E = {
                    values: I ? D : S(_),
                    keys: y ? D : S(p),
                    entries: M
                }, C)
                for (T in E) T in L || i(L, T, E[T]);
            else a(a.P + a.F * (f || P), t, E);
        return E
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
}, function(e, t, n) {
    var r = n(20)
        .f,
        a = n(13),
        i = n(8)("toStringTag");
    e.exports = function(e, t, n) {
        e && !a(e = n ? e : e.prototype, i) && r(e, i, {
            configurable: !0,
            value: t
        })
    }
}, function(e, t, n) {
    var r = n(69)("keys"),
        a = n(35);
    e.exports = function(e) {
        return r[e] || (r[e] = a(e))
    }
}, function(e, t) {
    var n = Math.ceil,
        r = Math.floor;
    e.exports = function(e) {
        return isNaN(e = +e) ? 0 : (e > 0 ? r : n)(e)
    }
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
    var l = n(1),
        u = n(47),
        c = n(50),
        d = n(2),
        g = n(5),
        f = r(g),
        m = n(4)
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
    var o = n(3),
        l = n(1),
        u = n(2),
        c = n(4)
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
                    var n = inArray(a, e.get()
                        .selectedMessages);
                    toggleClass(r, "im-mess_selected", n);
                    var i = void 0;
                    i = n ? getLang("mail_deselect_message") : getLang("mail_select_message");
                    var s = geByClass1("_im_mess_blind_label_select", r);
                    val(s, i), t()
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
    var o = n(3),
        l = n(2),
        u = n(1)
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
            i = i.replace("{count}", n.length), val(a, i + (0, _.selectionRemove)())
        } else val(a, getLang("mail_spam"));
        0 === n.length ? removeClass(r, "im-important-box_with-sel") : (addClass(r, "im-important-box_with-sel"), val(geByClass1(T), getLang("mail_im_mark_notspam", n.length)),
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
            .longpoll.push([(0, E.changePeer)(s, o)]), stopEvent(r), cancelEvent(r), !1
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
                removeEvent(o, "scroll", t), removeEvent(geByClass1(w, e.bodyNode), "click", n), removeEvent(geByClass1(T, e.bodyNode), "click", r), removeEvent(
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
            E = a.bind(null, {
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
        return (0, v.addDelegateEvent)(e.bodyNode, "click", _.DESLECT_ALL_CLASS, D), addEvent(r, "scroll", E), addEvent(geByClass1(w, e.bodyNode), "click", L), addEvent(
            geByClass1(T, e.bodyNode), "click", A), addEvent(geByClass1("_im_spam_flush", e.bodyNode), "click", I), p(e, E, L, A, S, k, P, r, I, D)
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
    var p = n(1),
        _ = n(2),
        v = n(3),
        h = n(16),
        b = n(48),
        y = n(5),
        C = r(y),
        E = n(4),
        T = "_im_spam_not_spam",
        w = "_im_spam_spam"
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        var r = gpeByClass("_im_mess", n),
            i = intval(domData(r, "msgid")),
            s = e.get()
            .peer,
            o = e.get()
            .tabs[s].msgs[i],
            u = !o[2];
        return e.get()
            .longpoll.push([{
                peerId: s,
                messageId: i,
                type: u ? c.SET_FLAGS : c.RESET_FLAGS,
                flags: c.FLAG_IMPORTANT
            }]), e.set(l.favMessage.bind(null, [i], u, s)), a(e, -10, t, n), !1
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
                (0, u.updateStar)(t, n, e)
            },
            unmount: function() {
                (0, o.removeDelegateEvent)(e, "click", d, n), (0, o.removeDelegateEvent)(e, "mouseover", d, r)
            }
        }
    }

    function s(e, t, n) {
        var s = a.bind(null, t, 0),
            l = r.bind(null, t);
        return (0, o.addDelegateEvent)(e, "click", d, l), (0, o.addDelegateEvent)(e, "mouseover", d, s), i(e, n, l, s)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = s;
    var o = n(3),
        l = n(1),
        u = n(2),
        c = n(4),
        d = "_im_mess_fav"
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
                return r.set(u.bind(null, n, a))
                    .then(function(i) {
                        var s = r.get()
                            .queues[n].evs.filter(function(e) {
                                return e.mess.messageId === a
                            })[0];
                        return l(n, e, t, r), s
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
    var p = n(5),
        _ = r(p),
        v = n(25)
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
}, , , , function(e, t, n) {
    n(137), n(138), n(139), n(136), e.exports = n(30)
        .Map
}, function(e, t) {
    e.exports = function(e, t, n, r) {
        if (!(e instanceof t) || void 0 !== r && r in e) throw TypeError(n + ": incorrect invocation!");
        return e
    }
}, function(e, t, n) {
    var r = n(59),
        a = n(8)("toStringTag"),
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
    var r = n(15),
        a = n(9)
        .document,
        i = r(a) && r(a.createElement);
    e.exports = function(e) {
        return i ? a.createElement(e) : {}
    }
}, function(e, t) {
    e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
}, function(e, t, n) {
    var r = n(9),
        a = n(30),
        i = n(14),
        s = n(21),
        o = n(31),
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
    var r = n(31),
        a = n(119),
        i = n(118),
        s = n(19),
        o = n(70),
        l = n(134);
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
    e.exports = !n(12) && !n(33)(function() {
        return 7 != Object.defineProperty(n(60)("div"), "a", {
                get: function() {
                    return 7
                }
            })
            .a
    })
}, function(e, t) {
    e.exports = function(e, t) {
        return {
            value: t,
            done: !!e
        }
    }
}, function(e, t, n) {
    var r = n(35)("meta"),
        a = n(15),
        i = n(13),
        s = n(20)
        .f,
        o = 0,
        l = Object.isExtensible || function() {
            return !0
        },
        u = !n(33)(function() {
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
    var r = n(19),
        a = n(123),
        i = n(61),
        s = n(44)("IE_PROTO"),
        o = function() {},
        l = "prototype",
        u = function() {
            var e, t = n(60)("iframe"),
                r = i.length,
                a = ">";
            for (t.style.display = "none", n(115)
                .appendChild(t), t.src = "javascript:", e = t.contentWindow.document, e.open(), e.write("<script>document.F=Object</script" + a), e.close(), u = e.F; r--;)
                delete u[l][i[r]];
            return u()
        };
    e.exports = Object.create || function(e, t) {
        var n;
        return null !== e ? (o[l] = r(e), n = new o, o[l] = null, n[s] = e) : n = u(), void 0 === t ? n : a(n, t)
    }
}, function(e, t, n) {
    var r = n(21);
    e.exports = function(e, t, n) {
        for (var a in t) r(e, a, t[a], n);
        return e
    }
}, function(e, t, n) {
    var r = n(9),
        a = "__core-js_shared__",
        i = r[a] || (r[a] = {});
    e.exports = function(e) {
        return i[e] || (i[e] = {})
    }
}, function(e, t, n) {
    var r = n(45),
        a = Math.min;
    e.exports = function(e) {
        return e > 0 ? a(r(e), 9007199254740991) : 0
    }
}, function(e, t, n) {
    var r = n(15);
    e.exports = function(e, t) {
        if (!r(e)) return e;
        var n, a;
        if (t && "function" == typeof(n = e.toString) && !r(a = n.call(e))) return a;
        if ("function" == typeof(n = e.valueOf) && !r(a = n.call(e))) return a;
        if (!t && "function" == typeof(n = e.toString) && !r(a = n.call(e))) return a;
        throw TypeError("Can't convert object to primitive value")
    }
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
            name: i.replace("{count}", t.length) + (0, y.selectionRemove)(),
            name_attr: ""
        }));
        var o = geByClass1(P, e),
            l = geByClass1(w, e);
        addClass(l, "im-page--peer_actions"), addClass(l, y.DESLECT_ALL_CLASS), hide(geByClass1(I, e)), hide(geByClass1(S, e)), s(e, n, t), addClass(o,
            "im-page--mess-actions_visible");
        var u = n.get()
            .tabs[n.get()
                .peer],
            c = r(t, u);
        toggleClass(o, "im-page--mess-actions_all-sel", !c);
        var d = c ? getLang("mail_im_toggle_important") : getLang("mail_im_toggle_important_off");
        attr(geByClass1("_im_page_action_star", e), "aria-label", d), removeClass(e, "im-page--header-chat_verified");
        var g = 55;
        (0, y.isClassicInterface)(n) && (g = 53), (0, y.isCommunityInterface)(n) && (g = 40), setStyle(l, {
            "max-width": l.parentNode.offsetWidth - o.offsetWidth - g
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
        var o = geByClass1(w, e);
        removeClass(o, y.DESLECT_ALL_CLASS), setStyle(o, {
            "max-width": 280
        });
        var l = geByClass1(S, e);
        show(geByClass1(I, e)), setStyle(l, {
            display: "inline-block"
        }), removeClass(geByClass1(P, e), "im-page--mess-actions_visible"), removeClass(geByClass1(P, e), "im-page--mess-actions_all-sel"), s(e, t, []);
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
            removeClass(l, "im-page--peer-online_mute"), val(l, a(t, u))
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
                        (0, y.isClassicInterface)(e) ? (cancelStackPush("forward", function(t) {
                                e.set(b.prepareForward.bind(null, []))
                                    .then(function() {
                                        e.get()
                                            .longpoll.push([(0, C.changePeer)(t)])
                                    })
                            }.bind(null, e.get()
                                .peer)), e.get()
                            .longpoll.push([(0, C.resetPeer)(!0)])) : t()
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
                s = geByClass1(A, i.bodyNode);
            elfocus(s), addEvent(s, "keydown", function(e) {
                var t = a(s, e);
                t && i.hide()
            })
        }
    }

    function g(e, t, n, r, a, i) {
        var s = domData(i, "action"),
            o = geByClass1(k, r)
            .parentNode,
            l = e.get()
            .peer;
        switch (s) {
            case "clear":
                var u = (0, y.showFlushDialog)(l, function(n) {
                    (0, y.cleanHistory)(e, u, t, b.flushHistory, e.get()
                        .peer)
                });
                break;
            case "media":
                showWiki({
                    w: "history" + (0, y.convertPeerToUrl)(l) + "_photo"
                });
                break;
            case "topic":
                d(e, l, t);
                break;
            case "avatar":
                cur.recieveCropResult = void 0, Page.ownerPhoto(l);
                break;
            case "search":
                t()
                    .showSearch(e);
                break;
            case "block":
                var u = (0, y.showBlacklistBox)(l, e);
                u.once("success", function(t) {
                    t.delta && (showDoneBox(t.msg), e.get()
                        .longpoll.push([(0, C.resetPeer)()]))
                });
                break;
            case "leave":
                var u = showFastBox({
                    title: getLang("mail_chat_leave_title"),
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, getLang("mail_chat_leave_confirm"), getLang("mail_leave_chat"), function() {
                    e.set(b.leaveChat.bind(null, l)), u.hide(), e.get()
                        .longpoll.push([(0, C.resetPeer)()])
                }, getLang("global_cancel"), function() {
                    u.hide()
                });
                break;
            case "return":
                e.set(b.returnToChat.bind(null, l));
                break;
            case "unmute":
            case "mute":
                var c = "mute" === s ? 1 : 0;
                e.set(b.toggleMutePeer.bind(null, l, c))
                    .then(t()
                        .updateState.bind(null, l));
                break;
            case "invite":
                if ((0, y.isChatPeer)(l))(0, y.inviteUser)(e, l, t, b.setCreationType);
                else if ((0, y.isUserPeer)(l)) {
                    var g = e.get()
                        .tabs[l],
                        f = [
                            [l, g.tab]
                        ];
                    e.set(b.setCreationType.bind(null, "chat", []))
                        .then(function(n) {
                            return t()
                                .showCreation(e, f)
                        })
                }
        }
        uiActionsMenu.toggle(o, !1)
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
            i = "",
            s = void 0;
        switch (a) {
            case "star":
                s = [3, -4], i = function() {
                    return (0, y.isImportant)(e) ? getLang("mail_im_toggle_important_off") : getLang("mail_im_toggle_important")
                };
                break;
            case "answer":
                s = [4, -4], i = getLang("mail_end_conversation");
                break;
            case "search":
                s = [4, -4], i = getLang("mail_search_in_peer")
        }
        showTooltip(r, {
            text: i,
            black: 1,
            shift: s,
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
                var n = geByClass1(k, e),
                    r = geByClass1(I, e),
                    a = t.get()
                    .curActions,
                    i = Object.keys(a)
                    .map(function(e) {
                        var t = "";
                        return 7 === b.ACTION_PRIORITIES[e] && (t = '<div class="ui_actions_menu_sep"></div>'), t + rs(x, a[e])
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
                (0, E.removeDelegateEvent)(e, "click", L, t), (0, E.removeDelegateEvent)(e, "click", T, n), (0, E.removeDelegateEvent)(e, "click", D, r), (0, E.removeDelegateEvent)
                (e, "click", y.DESLECT_ALL_CLASS, a), (0, E.removeDelegateEvent)(e, "mouseover", M, i), clearInterval(s), cancelStackFilter("fowrward")
            }
        }
    }

    function v(e, t, n) {
        var r = (0, h.createMutations)(_),
            a = r.callMutations,
            s = r.bindMutations,
            o = u.bind(null, t, n, a),
            l = g.bind(null, t, n, a, e),
            c = y.showChatMembers.bind(null, t, n, b.setCreationType),
            d = f.bind(null, t, n, a),
            v = function(e, n) {
                return (0, y.showVerifiedTooltip)(n, t.get()
                    .peer)
            },
            w = m.bind(null, t, e),
            S = p.bind(null, t, e, n);
        (0, E.addDelegateEvent)(e, "click", L, o), (0, E.addDelegateEvent)(e, "click", T, l), (0, E.addDelegateEvent)(e, "click", D, c), (0, E.addDelegateEvent)(e, "click",
            y.DESLECT_ALL_CLASS, d), (0, E.addDelegateEvent)(e, "mouseover", M, v), (0, E.addDelegateEvent)(e, "mouseover", "_im_header_icon", w), (0, E.addDelegateEvent)(
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
    var h = n(16),
        b = n(1),
        y = n(2),
        C = n(4),
        E = n(3),
        T = "_im_action",
        w = "_im_page_peer_name",
        S = "_im_page_peer_online",
        k = "_ui_menu",
        I = "_im_dialog_action_wrapper",
        P = "_im_mess_actions",
        L = "_im_page_action",
        A = "_im_chat_topic_change_input",
        D = "_im_chat_members",
        M = "_im_chat_verified",
        O = "_im_peer_mute",
        x = '<a tabindex="0" role="link" class="ui_actions_menu_item ' + T + ' im-action im-action_%icon%" data-action="%icon%">%name%</a>'
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
        return n - (a[0] + n - a[1]) + r - T
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
            T = (m.curLeft, !1),
            w = !1,
            S = !1;
        if (h || o || (h = d(r)), h) {
            var k;
            w = h, k = {}, a(k, cssTransformProp, "translateY(0px)"), a(k, "visibility", "visible"), T = k
        } else {
            var I;
            S = !0, I = {}, a(I, cssTransformProp, "translateY(0px)"), a(I, "visibility", "hidden"), T = I
        }
        if (v)
            if (C > -y && E > C && h) {
                var P;
                S = !1, w = h, P = {}, a(P, cssTransformProp, "translateY(" + (-y - C) + "px)"), a(P, "visibility", "visible"), T = P
            } else if (C >= E && 0 > C) {
            var L;
            S = !1, w = v, L = {}, a(L, cssTransformProp, "translateY(" + -C + "px)"), a(L, "visibility", "visible"), T = L
        }
        w && i(n, w), T && setStyle(n, T), toggleClass(n.parentNode, "im-page--top-date-bar_no-b", S)
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
    var p = n(2),
        _ = n(1),
        v = n(5),
        h = r(v),
        b = 46,
        y = 24,
        C = 300,
        E = -7,
        T = 7
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
        var u = geByClass1(H, t);
        l(e, i, t), uiSearch.reset(geByClass1(F, t)), uiSearch.reset(geByClass1(N, t)), u && u.parentNode.removeChild(u), l(e, i, t), cancelStackFilter("im_search");
        var c = 0 === e.get()
            .peer ? "search" : "default";
        e.get()
            .longpoll.push([(0, D.transitionEvent)(c)]), attr(t, "aria-hidden", "true")
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
            .longpoll.push([(0, D.changePeer)(r)])
    }

    function l(e, t, n) {
        var r, a = geByClass1(j, n),
            i = t.get()
            .selection.length;
        "add_member" === e.get()
            .creationType ? (r = 1 > i, val(geByClass1(j, n), 1 === i ? getLang("mail_append_chat") : getLang("mail_im_create_chat_with"))) : r = 1 >= i, toggleClass(n,
                "im-create_tools", !r), toggleClass(a, "button_disabled", r)
    }

    function u(e, t, n, r, a, i, s, o) {
        if (!checkEvent(s)) {
            var u, c = intval(domData(o, "list-id")),
                d = g(i),
                f = trim(o.textContent),
                m = geByClass1(N, t),
                p = getSize(m)[1];
            inArray(c, d) ? (u = r.removeSelection(c, f), removeClass(o, "olist_item_wrap_on")) : (u = r.addSelection(c, f), addClass(o, "olist_item_wrap_on")), u.then(
                function() {
                    var e = p - getSize(m)[1],
                        t = a.scrollTop();
                    a.scrollTop(t - e)
                }), l(e, i, t);
            var _ = geByClass1(N, t);
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
        val(i, a), val(geByClass1(j, e), "add_member" === r.get()
            .creationType ? getLang("mail_im_create_chat_with") : getLang("mail_im_create_chat"));
        var s = n.get()
            .selection.map(function(e) {
                return e.id
            });
        p(e, r, t, !1, s), (0, k.fixTableCellChildHeight)("_im_create_wrap_safe", e)
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
        var s, o, l = geByClass1(N, e),
            u = (0, w.searchLocalHints)(r, t.get());
        t.get()
            .creation_showed_all = !1, n.reset(), n.pipe(m(u, r, t), r), n.toTop(), r ? (o = (0, w.searchFriends)(r, t.get()), s = (0, w.searchHintsIndex)(r, [], "friends",
                t.get()), n.pipe(m(s, r, t), r), n.pipe(m(o, r, t), r)) : (s = Promise.resolve([]), o = Promise.resolve([])), t.set(i.bind(null, [u, o, s], !0)), uiSearch.showProgress(
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
                    geByClass1(R, t)
                        .appendChild(ce("img", {
                            className: "im-chat-placeholder--img " + H,
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
            .peer, u))["catch"](function(e) {
            showFastBox(getLang("global_error"), e.message)
        }), void a(e, n, s, "", i, t);
        if (!(u.length <= 1) || e.get()
            .creating) {
            var c = geByClass1(j, n);
            lockButton(c);
            var d = uiSearch.getFieldEl(geByClass1(F, n))
                .value;
            e.set(w.createChat.bind(null, e.get()
                    .next_chat_avatar, u, d))
                .then(function(a) {
                    b(e, t, n, r, i, s), o(e, n, s, e.get()
                            .next_peer, i, t), unlockButton(c), s()
                        .restoreDialogs(e)
                })["catch"](function(e) {
                    unlockButton(c), topMsg(getLang("global_unknown_error"), 2, "#FFB4A3")
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

    function E(e, t, n, r, i, o, l, u, c) {
        return {
            show: function(t) {
                var a = arguments.length <= 1 || void 0 === arguments[1] ? [] : arguments[1];
                t.get()
                    .showed = !0, s(e, !0), cancelStackPush("im_create", n), addClass(e, "im-create_shown"), a && a.forEach(function(e) {
                        return l.addSelection(e[0], e[1])
                    }), f(e, r, o, t), setTimeout(function() {
                        t.get()
                            .longpoll.push([(0, D.transitionEvent)("create")]), attr(e, "aria-hidden", "false"), l.focus()
                    }, 1)
            },
            focusSearch: function(e) {
                l.focus()
            },
            confirmCreate: function(e) {
                c()
            },
            hide: function(n) {
                n.get()
                    .showed = !1, a(n, e, t, !1, l, o)
            },
            updateScroll: function() {
                (0, k.fixTableCellChildHeight)("_im_create_wrap_safe", e), r.updateScroll()
            },
            unmount: function() {
                removeEvent(geByClass1(M, e), "click", n), (0, P.removeDelegateEvent)(e, "click", x, onDialogClick), (0, P.removeDelegateEvent)(e, "click", B, i), r.unmount(),
                    cancelStackFilter("im_create"), cur.recieveCropResult = void 0
            }
        }
    }

    function T(e, t, n) {
        var r = (0, A["default"])({
                selection: []
            }),
            s = geByClass1(O, e),
            o = (0, S.mount)(s, (0, A["default"])({
                offset: 0,
                limit: G,
                elements: [],
                elCls: x
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
        var g = geByClass1(N, e),
            f = (0, I.mount)(g, r, function(n) {
                return {
                    selectionDeleted: function(n, r) {
                        l(t, n, e), removeClass(geByClass1("_im_dialog" + r), "olist_item_wrap_on")
                    },
                    onChange: v.bind(null, t, e, o)
                }
            }),
            p = a.bind(null, t, e, n, "cross", f, r),
            T = _.bind(null, t, e, n, o, r, f),
            k = h.bind(null, t, e),
            L = b.bind(null, t, r, e, o, f, n),
            D = y.bind(null, t, r, e, o, f, n),
            F = geByClass1(M, e);
        return addEvent(F, "click", p), addEvent(F, "mouseover", C.bind(null, F)), addEvent(geByClass1(R, e), "click", k), addEvent(geByClass1(U, e), "click", L), addEvent(
            geByClass1(j, e), "click", D), (0, P.addDelegateEvent)(e, "click", B, T), E(e, n, p, o, T, r, f, L, D)
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
    t.mount = T;
    var w = n(1),
        S = n(36),
        k = n(2),
        I = n(86),
        P = n(3),
        L = n(5),
        A = r(L),
        D = n(4),
        M = "_im_create_cancel",
        O = "_im_create_list",
        x = "_im_dialog",
        B = "_im_create_tab",
        F = "_im_dialogs_creation_name",
        N = "_im_create_select",
        R = "_im_create_avatar",
        j = "_im_confirm_creation",
        U = "_im_cancel_creation",
        H = "_im_avatar_img",
        G = 100
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
        }].concat(r) : [D()], n.pipeReplace(Promise.resolve(r))
    }

    function i(e) {
        return hasClass(e, "_im_search")
    }

    function s(e, t, n, r) {
        if (e.get()
            .searchText && e.get()
            .searchAllLoaded) return Promise.resolve([]);
        if (e.get()
            .dialog_search_going || (0, W.isClassicInterface)(e) && 0 !== e.get()
            .peer) return Promise.resolve(!1);
        if (e.get()
            .searchText) return (0, K.searchMessages)(e.get()
                .searchText, e.get())
            .then(function(e) {
                var t = z(e, 2),
                    n = t[0],
                    r = t[1];
                return L(r, n)
            });
        var a = e.get()
            .active_tab,
            i = e.get()
            .dialog_tabs_all;
        return i[W.FOLDER_ALL] || i[a] ? 0 === H(e)
            .length ? Promise.resolve([{
                type: "empty_dialogs",
                peerId: "000"
            }]) : Promise.resolve([]) : e.set(K.loadDialogs)
            .then(function(t) {
                var n = H(e);
                return 0 === n.length ? [{
                    type: "empty_dialogs",
                    peerId: "000"
                }] : n
            })
    }

    function o(e, t, n, r, a) {
        var s = parseInt(domData(a, "peer"), 10);
        if (!gpeByClass("_im_peer_target", r.target)) {
            var o = t.get()
                .tabs[s];
            if (hasClass(a, "_im_create_email")) {
                var l = trim(geByClass1("_im_dialog_name", a)
                    .textContent);
                o = {
                    name: l,
                    type: "email_create"
                }
            }
            if (checkEvent(r)) return void window.open(_(t, o));
            if (o && "email_create" === o.type) return (0, K.createEmailChat)(o.name, t.get())
                .then(function(e) {
                    return t.get()
                        .longpoll.push([X.eventTypes.changePeer(e, !1, !0, !0)])
                })["catch"](function(e) {
                    showFastBox(getLang("global_error"), e)
                });
            var u = t.get()
                .peer,
                c = parseInt(domData(a, "msgid"));
            n.saveScroll("list");
            var d = t.get()
                .msgid;
            if (i(a) && d !== c) t.get()
                .longpoll.push([X.eventTypes.changePeer(s, c)]);
            else if (s !== u) {
                t.get()
                    .longpoll.push([X.eventTypes.changePeer(s, !1, !0, !0)]);
                var g = t.get()
                    .searchText;
                g && !(0, W.isClassicInterface)(t) && setTimeout(function() {
                    n.scrollTo(s, !0, ee, "center")
                }, 100)
            } else s === u && t.get()
                .longpoll.push([X.eventTypes.changePeer(s, !1, !0, !i(a))]);
            cancelEvent(r)
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
                return "graffiti" === e.kind ? getLang("mail_added_graffiti") : getLang("mail_added_docs");
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
        (0, W.isChatPeer)(e) && !t.photo ? r = (0, W.renderPhotosFromTab)(t, !n) : (r = '<img src="' + t.photo + '" alt="">', n && (r = getTemplate("im_dialogs_link_img", {
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
        return !(0, W.isPendingForward)(e)
    }

    function d(e, t, n, r, a, i, s, o, u, c) {
        var d = "",
            g = "";
        return e & X.eventTypes.FLAG_OUTBOUND ? d = u ? getTemplate("im_img_prebody", {
            photo: c
        }) : getLang("mail_by_you") + ":" : (0, W.isChatPeer)(n) && 0 !== r && (d = t.data.members[r].first_name + ":"), s = s.replace(/\<br\s*\/?\>/gi, " "), a && (s =
            Emoji.emojiToHTML(s, !0)), o && "..." !== o.trim() && !(0, W.isChatPeer)(n) && (s = getTemplate("im_topic", {
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
        return (0, W.isClassicInterface)(r) && i.push("nim-dialog_classic"), i.push("nim-dialog_empty"), a.search && i.push("_im_search"), getTemplate("im_drow", {
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

    function f(e) {
        return e > 9999999 ? Math.floor(e / 1e6) + "M" : e > 9999 ? Math.floor(e / 1e3) + "K" : e ? e.toString() : ""
    }

    function m(e, t, n) {
        return n & X.eventTypes.FLAG_UNREAD && n & X.eventTypes.FLAG_OUTBOUND ? (0, W.isSelfMessage)(t.peerId, e.get()
            .gid) ? !1 : (0, W.isChatPeer)(t.peerId) && t.data && t.data.closed ? !1 : t.unread ? !1 : t.lastmsg <= t.out_up_to ? !1 : !0 : !1
    }

    function p(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? {} : arguments[3],
            a = u(t.peerId, t, (0, W.isClassicInterface)(e)),
            i = a.photo,
            s = a.userLink,
            o = n || b(t);
        if (!o) return g(t, i, s, e, r);
        var l = o.flags,
            c = t.unread > 0 ? t.unread : "",
            d = f(c),
            p = h(t, e, n),
            v = [];
        r.search && v.push("_im_search", "nim-dialog_search"), inArray(t.peerId, e.get()
                .mutedPeers) && v.push("nim-dialog_muted"), t.verified && v.push("nim-dialog_verified"), -1 === o.messageId && v.push("nim-dialog_empty"), (0, W.isClassicInterface)
            (e) && v.push("nim-dialog_classic"), t.folders & X.eventTypes.FOLDER_IMPORTANT && v.push("nim-dialog_starred"), !r.search && (0, W.isUnrespond)(e, t.peerId, t) &&
            v.push("nim-dialog_unrespond");
        var y = e.get()
            .timeshift,
            C = m(e, t, l) ? "nim-dialog_unread-out" : "";
        return getTemplate("im_drow", {
            peer: t.peerId,
            msg_id: o.messageId,
            photo: i,
            user_link: s,
            date: o.date ? getShortDateOrTime(o.date, y, !0, getLang("months_sm_of", "raw")) : "",
            body: p,
            tab_name: stripHTML(t.tab),
            href: _(e, t),
            unread: d,
            more: v.join(" "),
            is_online: onlinePlatformClass(t.online),
            is_unread: c > 0 && l & X.eventTypes.FLAG_UNREAD ? "nim-dialog_unread" : "",
            is_unread_out: C,
            is_selected: r.noselect || t.peerId != e.get()
                .peer ? "" : "nim-dialog_selected _im_dialog_selected"
        })
    }

    function _(e, t) {
        return "email_create" === t.type ? (0, W.getBaseLink)(e) + "?email=" + t.name : (0, W.isUserPeer)(t.peerId) ? (0, W.isClassicInterface)(e) ? (0, W.getBaseLink)(e) +
            "?sel=" + (0, W.convertPeerToUrl)(t.peerId) : t.href : (0, W.getBaseLink)(e) + "?sel=" + (0, W.convertPeerToUrl)(t.peerId)
    }

    function v(e, t, n, r, a) {
        if (!t.deletedDialog) {
            var i = b(t),
                s = i.flags,
                o = h(t, n),
                l = u(t.peerId, t, (0, W.isClassicInterface)(n)),
                c = l.photo,
                d = n.get()
                .timeshift,
                g = i.date ? getShortDateOrTime(i.date, d, !0, getLang("months_sm_of", "raw")) : "";
            val(geByClass1("_dialog_body", e), o), val(geByClass1("_im_dialog_date", e), g), val(geByClass1("_im_dialog_unread_ct", e), f(t.unread)), val(geByClass1(
                "_im_dialog_link", e), t.tab);
            var p = geByClass1("_im_dialog_photo", e);
            p.innerHTML !== c && val(p, c), toggleClass(e, "nim-dialog_verified", !!t.verified), toggleClass(e, "nim-dialog_starred", t.folders & X.eventTypes.FOLDER_IMPORTANT),
                toggleClass(e, "nim-dialog_muted", inArray(t.peerId, n.get()
                    .mutedPeers)), toggleClass(e, "nim-dialog_unrespond", (0, W.isUnrespond)(n, t.peerId, t)), toggleClass(e, "nim-dialog_classic", (0, W.isClassicInterface)
                    (n)), removeClass(e, "nim-dialog_failed"), toggleOnline(geByClass1("_im_peer_online", e), t.online), t.unread > 0 && s & X.eventTypes.FLAG_UNREAD &&
                addClass(e, "nim-dialog_unread"), toggleClass(e, "nim-dialog_empty", -1 === i.messageId), m(n, t, s) && addClass(e, "nim-dialog_unread-out"), a &&
                setTimeout(function() {
                    addClass(geByClass1("_im_dialog_" + t.peerId, r), "nim-dialog_injected")
                }, 100)
        }
    }

    function h(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? !1 : arguments[2],
            r = n || b(e);
        if ((0, W.isPeerBlocked)(e.peerId, t)) {
            var a = t.get()
                .block_states[e.peerId].name,
                i = getLang("mail_community_answering")
                .replace("{username}", a);
            return getTemplate("im_drow_prebody", {
                prebody: i,
                body: ""
            })
        }
        return (0, W.isServiceMsg)(r) ? (0, W.renderServiceMsg)(r, e, !1) : d(r.flags, e, e.peerId, r.userId, !0, r.attaches, r.text, r.subject, (0, W.isCommunityInterface)
            (t), t.get()
            .author_photo)
    }

    function b(e) {
        var t = e.lastmsg_meta;
        if (isArray(t) && (t = (0, Z.addMessageEvent)([4].concat(t))), !t) {
            var n = "";
            return (0, W.isChatPeer)(e.peer) || (n = e.online ? getLang("global_online_sm") : getLang("mail_offline")), (0, Z.addMessageEvent)([4, -1, 0, e.peer, "", "", n, {}, -
                1
            ])
        }
        return t
    }

    function y(e, t, n, r, a) {
        var i = geByClass1("_dialog_body", t);
        addClass(t, "nim-dialog_deleted"), removeClass(t, "_im_dialog"), val(i, getTemplate("im_delete_actions", {
            text: langNumeric(n, getLang("mail_im_X_message_deleted", "raw")),
            peer: e,
            spam_id: r
        }))
    }

    function C(e, t, n) {
        var r = (0, W.showFlushDialog)(t, function(a) {
            n()
                .updateMenu(e), (0, W.cleanHistory)(e, r, n, K.flushHistory, t)
        })
    }

    function E(e, t, n, r, a) {
        var i = gpeByClass("_im_dialog", a, n);
        if (i) {
            var s = intval(domData(i, "peer")),
                o = (0, W.isComunityPeer)(s) || (0, W.isUserPeer)(s);
            (0, W.isClassicInterface)(t) && o ? (0, K.deleteDialog)(s, t.get())
                .then(function(n) {
                    var r = z(n, 2),
                        a = r[0],
                        o = r[1];
                    a ? (y(s, i, a, o, t), e()
                        .updateMenu(t)) : C(t, s, e)
                }) : C(t, s, e)
        }
        return cancelEvent(r), !1
    }

    function T(e, t) {
        var n = arguments.length <= 2 || void 0 === arguments[2] ? "" : arguments[2],
            r = arguments.length <= 3 || void 0 === arguments[3] ? "" : arguments[3],
            a = c(e),
            i = [];
        return r && i.push(r), (0, W.isClassicInterface)(e) && i.push("nim-dialog_classic"), i.push("nim-dialog_empty"), "" === n && i.push("nim-dialog_prep-injected"),
            getTemplate("im_drow", {
                peer: t.peerId,
                msg_id: t.lastmsg,
                photo: (0, W.renderPhotos)(t.photo),
                user_link: "<span>" + t.name + "</span>",
                date: "",
                body: n,
                href: _(e, t),
                unread: "",
                tab_name: stripHTML(t.name),
                is_star: "",
                is_unread: "",
                is_unread_out: "",
                more: i.join(" "),
                is_online: onlinePlatformClass(t.online),
                is_selected: t.peerId == e.get()
                    .peer && a ? "nim-dialog_selected _im_dialog_selected" : ""
            })
    }

    function w(e) {
        var t = e.get()
            .gid ? "mail_search_only_messages_comm" : "mail_search_only_messages",
            n = getLang(t);
        return '<li class="im-page--mess-search-w">\n    <div class="im-page--mess-search ' + te + '">\n      ' + n + "\n    </div>\n  </li>"
    }

    function S(e) {
        return getTemplate("im_dialogs_none", {
            msg: e || getLang("mail_im_search_empty")
        })
    }

    function k(e, t) {
        return !e.get()
            .unread_only || t.unread > 0
    }

    function I(e, t) {
        if ("sep" === t.type) return (0, W.renderMessagesSearch)();
        if ("email_create" === t.type) return T(e, {
            peerId: t.peerId,
            lastmsg: -1,
            photo: "/images/contact_2x.png",
            online: "",
            type: t.type,
            name: t.query
        }, getLang("mail_enter_email_address"), "_im_create_email");
        if ("empty_dialogs" === t.type) return getTemplate("im_dialogs_none", {
            msg: getLang("mail_dialogs_list_empty")
        });
        if ("empty" === t.type) return S(t.lang);
        if ("only_mes" === t.type) return w(e);
        var n = e.get()
            .tabs_cache || {};
        return t.local_index && !n[t.peerId] ? T(e, t) : (t.local_index && (t = n[t.peerId]), t.message ? p(e, t, t.message, {
            noselect: !0,
            search: !0
        }) : p(e, t))
    }

    function P(e, t, n, r, a, i) {
        var s = intval(domData(i, "peer")),
            o = domData(i, "action"),
            l = domData(i, "sid"),
            u = geByClass1("_im_dialog_" + s, t),
            c = intval(domData(i, "spam"));
        switch (o) {
            case "restore":
                u && e.set(K.restoreDialog.bind(null, s, l, c))
                    .then(function() {
                        addClass(u, "_im_dialog"), removeClass(u, "nim-dialog_deleted"), v(u, e.get()
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
                    val(g, d), (0, K.spamDialog)(s, l, e.get())
                }
                break;
            case "block":
                var f = void 0;
                f = (0, W.isCommunityInterface)(e) ? (0, W.showBlacklistBox)(s, e) : (0, W.showBlacklistBoxUser)(s, e), f.once("success", function() {
                    e.set(K.flushHistory.bind(null, s))
                        .then(function() {
                            n()
                                .restoreDialogs(e)
                        })
                })
        }
        cancelEvent(a)
    }

    function L(e, t) {
        return e.map(function(e) {
                return (0, Z.addMessageEvent)([4].concat(e))
            })
            .map(function(e) {
                return extend({}, t[e.peerId], {
                    message: e
                })
            })
    }

    function A() {
        return {
            type: "only_mes",
            peerId: "00001"
        }
    }

    function D(e) {
        return {
            type: "empty",
            peerId: "empty",
            lang: e
        }
    }

    function M(e) {
        return 0 === e.length ? e : [A()].concat(e)
    }

    function O(e, t, n) {
        return t()
            .toggleSettingsLoader(n, !0), e.checkMore(!(0, W.isClassicInterface)(n))
            .then(t()
                .toggleSettingsLoader.bind(null, n, !1))
    }

    function x(e, t) {
        var n = e.get()
            .msg_local_ids_sort && e.get()
            .msg_local_ids_sort[t.lastmsg];
        return "undefined" != typeof n ? 2e9 + n : t.lastmsg
    }

    function B(e, t, n, r) {
        var a = gpeByClass("_im_dialog", r, t),
            i = intval(domData(a, "peer"));
        return e.set(K.toggleDialogImportant.bind(null, i)), setTimeout(function() {
            R(e, t, n, r)
        }, 100), cancelEvent(n), !1
    }

    function F(e, t, n) {
        return t.message && n.message ? n.message.messageId - t.message.messageId : t.message && !n.message ? 1 : n.message && !t.message ? -1 : x(e, n) - x(e, t)
    }

    function N(e, t) {
        for (; !hasClass(e, "_im_dialog") && e;) e = t(e);
        return e
    }

    function R(e, t, n, r) {
        var a = r.getBoundingClientRect()
            .top;
        showTooltip(r, {
            text: function() {
                var n = gpeByClass("_im_dialog", r, t),
                    a = domData(n, "peer");
                return e.get()
                    .tabs[a].folders & X.eventTypes.FOLDER_IMPORTANT ? getLang("mail_im_toggle_important_off") : getLang("mail_im_toggle_important")
            },
            black: 1,
            zIndex: 1,
            shift: [14, 8],
            toup: a > 150
        })
    }

    function j(e, t, n, r, a) {
        var i = gpeByClass("_im_dialog", a, t),
            s = intval(domData(i, "peer")),
            o = e.get()
            .tabs[s].lastmsg;
        return e.set(K.markDialogAnswered.bind(null, s, o))
            .then(function() {
                v(i, e.get()
                        .tabs[s], e, t), n()
                    .restoreDialogs(e)
            }), showDoneBox(getLang("mail_marked_as_answered"), {
                out: 1e3
            }), cancelEvent(r), !1
    }

    function U(e, t, n, r, a, s, l) {
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
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), s.saveScroll("list"), r ? (s.reset(), n = M(n), s.pipeReplace(Promise.resolve(n))) : s.pipe(
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
                        a = N(o, i);
                    if (!a) return;
                    removeClass(r, "_im_dialog_hovered"), removeClass(r, "nim-dialog_hovered")
                } else a = N(e.firstElementChild, domNS);
                if (a) {
                    addClass(a, "_im_dialog_hovered"), addClass(a, "nim-dialog_hovered");
                    var l = geByClass1("_im_mess_search", e);
                    s.scrollTo(intval(domData(a, "peer")), !1, l ? ee + 37 : ee, l ? 37 : 0)
                }
            },
            selectHoveredDialog: function(t) {
                var n = geByClass1("_im_dialog_hovered", e);
                n || (n = geByClass1("_im_dialog", e)), n && o(l, t, s, {}, n)
            },
            appendSearch: function(t, n, r) {
                var a = L(r, n);
                r.length > 0 ? (addClass(e.parentNode, "im-page--dialogs_with-mess"), s.pipe(Promise.resolve([{
                    type: "sep",
                    peerId: "000"
                }].concat(a)))) : (0 === s.getCurrentElements()
                    .length && s.pipeReplace(Promise.resolve([D()])), removeClass(e.parentNode, "im-page--dialogs_with-mess"))
            },
            updateDialog: function(t, n) {
                var r = geByClass1("_im_dialog_" + t);
                r && !i(r) && v(r, n.get()
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
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), 0 !== H(t)
                    .length || s.isLoading() || (n = !0), n && s.reset(), r && s.wipe(), s.pipeReplace(Promise.resolve(H(t)))
                    .then(function(e) {
                        if (!(!n || (0, W.isClassicInterface)(t) && t.get()
                                .peer)) {
                            var r = O(s, l, t);
                            return s.toTop(), r
                        }(0, W.isClassicInterface)(t) || s.restoreScroll("list")
                    })
            },
            appendDialogs: function(t, n) {
                removeClass(e.parentNode, "im-page--dialogs_with-mess"), n.forEach(function(n) {
                    var r = geByClass1("_im_dialog_" + n.peerId, e);
                    r && v(r, n, t, e, !0)
                }), n = M(n), s.isEmpty() && 0 === n.length && (0, W.isPendingForward)(t) && (n = [D(getLang("mail_im_search_empty_chats"))]), s.replacePreserveOrder(
                    n)
            },
            updateCounter: function(t, n) {
                var r = geByClass1("_im_dialog_" + n.peerId, e);
                if (r && !i(r)) {
                    var a = t.get()
                        .tabs[n.peerId],
                        s = f(a.unread > 0 ? a.unread : "");
                    val(geByClass1("_im_dialog_unread_ct", r), s), s ? addClass(r, "nim-dialog_unread") : removeClass(r, "nim-dialog_unread"), toggleClass(r,
                        "nim-dialog_unread-out", m(t, a, a.lastmsg_meta.flags))
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
            setDialogFailed: function(t, n, r) {
                var a = geByClass1("_im_dialog_" + t, e);
                if (a) {
                    var i = r.get()
                        .tabs[t];
                    i.lastmsg === n && (addClass(a, "nim-dialog_failed"), val(geByClass1("_im_dialog_unread_ct", a), "!"))
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
                k(t, o) && (s.pipeReplace(Promise.resolve(H(t)), void 0, !0)
                    .then(function(r) {
                        var i = z(r, 1),
                            s = i[0];
                        !inArray(n.peerId, s) && a && v(a, t.get()
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
                        s = (0, W.formatTyper)(n.get()
                            .tabs[t.peerId].typing, t.peerId, !0, n.get(), 1);
                    val(a, s), toggleClass(r, "nim-dialog_typing", s)
                }
            },
            unmount: function() {
                s.unmount(), (0, q.removeDelegateEvent)(e, "click", "_im_dialog", t), (0, q.removeDelegateEvent)(e, "mouseover", "_im_dialog_close", n), (0, q.removeDelegateEvent)
                    (e, "click", "__im_dialog_close", a)
            }
        }
    }

    function H(e) {
        var t = e.get()
            .active_tab,
            n = e.get()
            .dialog_tabs[t],
            r = e.get()
            .tabs;
        return n.map(function(e) {
                return r[e]
            })
            .sort(F.bind(null, e))
    }

    function G(e, t, n) {
        var r = (0, $.createMutations)(U),
            i = r.callMutations,
            l = r.bindMutations,
            u = E.bind(null, n, t, e),
            c = function(t, n) {
                var r = geByClass1(te, e),
                    a = n.getBoundingClientRect()
                    .top;
                r && (a -= r.offsetHeight), showTooltip(n, {
                    text: getLang("mail_delete"),
                    black: 1,
                    center: !0,
                    shift: [1, 10],
                    toup: a > 150,
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
            g = R.bind(null, t, e),
            f = B.bind(null, t, e),
            m = j.bind(null, t, e, i),
            p = geByClass1("_im_dialogs_search"),
            _ = {
                idFn: function(e) {
                    return e.message ? e.message.messageId : e.peerId
                },
                renderFn: I.bind(null, t),
                more: s.bind(null, t, i),
                onScroll: (0, W.isClassicInterface)(t) ? function() {
                    var e = bodyNode.scrollTop || document.documentElement.scrollTop;
                    0 >= e && !layers.visible && browser.safari ? addClass(p, "im-page--header_static") : removeClass(p, "im-page--header_static")
                } : !1
            },
            v = (0, V.mount)(e, (0, Y["default"])({
                limit: 40,
                offset: 0,
                nativeScroll: !!(0, W.isClassicInterface)(t),
                height: J,
                elements: H(t)
            }), function(e) {
                return _
            }),
            h = o.bind(null, n, t, v),
            b = a.bind(null, t, e, v),
            y = P.bind(null, t, e, i, n);
        return (0, q.addDelegateEvent)(e, "click", "_im_dialog_close", u), (0, q.addDelegateEvent)(e, "click", "_im_dialog_markre", m), (0, q.addDelegateEvent)(e, "click",
                ne, f), (0, q.addDelegateEvent)(e, "click", "_im_dialog", h), (0, q.addDelegateEvent)(e, "click", te, b), (0, q.addDelegateEvent)(e, "mouseover",
                "_im_dialog_close", c), (0, q.addDelegateEvent)(e, "mouseover", "_im_dialog_markre", d), (0, q.addDelegateEvent)(e, "mouseover", ne, g), (0, q.addDelegateEvent)
            (e, "click", re, y), addEvent(e, "mouseover", throttle(function() {
                var t = geByClass("_im_dialog_hovered", e);
                t.forEach(function(e) {
                    removeClass(e, "_im_dialog_hovered"), removeClass(e, "nim-dialog_hovered")
                })
            }, 100)), l(e, h, c, i, u, v, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var z = function() {
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
    t.mount = G;
    var q = (n(38), n(3)),
        K = n(1),
        W = n(2),
        Q = n(5),
        Y = r(Q),
        V = n(36),
        Z = n(4),
        $ = n(16),
        X = n(22),
        J = 64,
        ee = 45,
        te = "_im_mess_search",
        ne = "_im_dialog_star",
        re = "_im_dialog_daction"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        var t = e.get()
            .tabs,
            n = e.get()
            .peer,
            r = Object.keys(t)
            .filter(function(t) {
                return (0, i.isFullyLoadedTab)(e, t) && intval(t) !== n
            })
            .map(function(e) {
                return t[e]
            });
        r.filter(function(e) {
                return Date.now() - e.last_visited > l
            })
            .forEach(function(t) {
                return e.set(s.cleanTab.bind(null, t.peerId))
            }), r.filter(function(t) {
                return (0, i.isFullyLoadedTab)(e, t.peerId) && "string" != typeof t.history && Date.now() - t.last_touched > u
            })
            .forEach(function(t) {
                return e.set(s.stringifyTab.bind(null, t.peerId))
            })
    }

    function a(e) {
        var t = setInterval(r.bind(null, e), o);
        return {
            unmount: function() {
                clearInterval(t)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = a;
    var i = n(2),
        s = n(1),
        o = 5e3,
        l = 108e6,
        u = 72e5
}, function(e, t, n) {
    "use strict";

    function r(e, t, n, r, a, i, s, o, l) {
        removeClass(e, "im-page--history_empty"), u(e, t, n, r, a, i, s, o, l)
    }

    function a(e, t, n, r) {
        var a = geByClass1("_im_peer_photo", n);
        removeClass(a, "nim-peer--photo_hidden"), (0, x.isChatPeer)(t) ? (toggleOnline(geByClass1("_im_peer", n), !1), val(a, '<div class="im-page--chat-photo ' + x.SHOW_CHAT_MEMBERS_CLASS +
            '">' + (0, x.renderPhotosFromTab)(e, !0) + "</div>"), e.data.kicked && addClass(a, "nim-peer--photo_hidden")) : (toggleOnline(geByClass1("_im_peer", n), e.online),
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
        s && e.set(O.changePeer.bind(null, e.get()
                .peer, s))
            .then(function() {
                m(n, t, s)
            }), cancelEvent(r)
    }

    function s(e, t, n, r) {
        if (hasClass(n.target, "_im_mess_marker")) {
            var a = n.target;
            window.tooltips && (0, F.toArray)(geByClass(x.FAILED_CLASS, t))
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
            var g = (0, O.strHistory)(c.history);
            toggleClass(e, "im-page--history_empty-hist", !g), g || (g = getLang("mail_im_here_history")), val(d, g), getAudioPlayer()
                .updateCurrentPlaying(), (0, x.isClassicInterface)(t) || (0, x.fixTableCellChildHeight)("_chat_body_wrap", e), I(t, r, e)
        }(0, O.isSearchingInplace)(n, t.get()) ? i()
            .showSearch(t): i()
            .cancelSearch(t, !1), o.changePeer(n, t), t.get()
            .msgid ? m(r, e, t.get()
                .msgid) : f(r, e, i, t, u) || (c.scrollBottom && l ? r.scrollBottom(c.scrollBottom) : r.scrollBottom(V))
    }

    function c(e, t) {
        var n = t.scrollBottom(),
            r = e.get()
            .peer;
        e.set(O.saveHistoryScroll.bind(null, r, n))
    }

    function d(e, t, n, r, a, i, s) {
        if (a.update(i, s), 0 !== e.get()
            .peer && (0, x.isFullyLoadedTab)(e.get(), e.get()
                .peer) && !(layers.visible || e.get()
                .showed && (0, x.isClassicInterface)(e))) {
            var o = (0, x.wrapLoading)(n);
            if ((0, O.isSearchingInplace)(e.get()
                    .peer, e.get()) || r(s), !ie && s.scrollTop() < Y) {
                if ((0, O.isSearchingInplace)(e.get()
                        .peer, e.get())) {
                    ie = !0;
                    var l = t()
                        .getSearchResulstModule();
                    return l.isAll(e) ? void(ie = !1) : void o(l.loadMore(e)
                        .then(function(n) {
                            ie = !1, n && t()
                                .loadHistory(e.get()
                                    .peer, {}, e, n)
                        }), "up")
                }
                var u = e.get(),
                    c = u.tabs[u.peer];
                c.allShown || (ie = !0, o(e.set(O.loadMoreHistory.bind(null, 0, 0))
                    .then(t()
                        .loadHistory.bind(null, u.peer, {}))
                    .then(function() {
                        ie = !1
                    }), "up"))
            }
            if (!ie && 0 > i && s.scrollBottom() < Y) {
                if ((0, O.isSearchingInplace)(e.get()
                        .peer, e.get())) return;
                var d = gpeByClass("_im_page_history", d),
                    u = e.get(),
                    c = u.tabs[u.peer];
                if (c.skipped > 0) {
                    ie = !0;
                    var f = e.set(O.loadLessHistory)
                        .then(t()
                            .loadHistory.bind(null, u.peer, {
                                reversed: !0
                            }))
                        .then(function() {
                            g(e), ie = !1, h(e, d), c.skipped || e.set(O.changePeer.bind(null, e.get()
                                .peer, !1))
                        });
                    S(d, !0), f.then(S.bind(null, d, !1))
                }
            }
        }
    }

    function g(e) {
        return e.set(O.readLastMessages.bind(null, e.get()
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
            }, $)
        }
    }

    function p(e) {
        var t = geByClass1(re, e);
        val(t, "")
    }

    function _(e, t) {
        if ((0, x.isClassicInterface)(e)) {
            var n = e.get()
                .peer;
            if (0 !== n && !(0, x.isChatPeer)(n) && (0, x.isFullyLoadedTab)(e, n)) {
                var r = e.get()
                    .tabs[n];
                if (!r.online && !(0, O.isSearchingInplace)(n, e.get())) {
                    var a = r.typing && Object.keys(r.typing)
                        .length > 0;
                    if (!a) {
                        var i = geByClass1(re, t),
                            s = geByClass1(ae, i),
                            o = (0, x.getLastTime)(e, n, !0, !0),
                            l = o.str,
                            u = o.time;
                        if (s) {
                            var c = domData(s, "rdate"),
                                d = domData(s, "peer");
                            (c !== u || n !== intval(d)) && (val(s, l), domData(s, "rdate", u), domData(s, "peer", n))
                        } else l = '<div class="' + ae + ' im-page--lastact" data-rdate="' + u + '">' + l + "</div>", val(i, l)
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
                e.set(O.removeFailed.bind(null, e.get()
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
            r.skipped > 0 && !(0, O.isSearchingInplace)(e.get()
                .peer, e.get()) ? show(geByClass1(J, t)) : hide(geByClass1(J, t))
        }
    }

    function b(e) {
        var t = geByClass1("_im_unread_bar_row", e);
        t && t.parentNode.removeChild(t), (0, x.showInvisibleBar)(e)
    }

    function y(e) {
        var t = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1],
            n = e.scrollBottom();
        return (t ? Z + t : Z) > n
    }

    function C(e, t, n, r) {
        var a = domData(r, "msgid"),
            i = e.get()
            .peer;
        e.get()
            .imQueueResend(i, a)
            .then(function(t) {
                e.get()
                    .longpoll.push([(0, Q.resendEvent)(i, t.mess)])
            })
    }

    function E(e, t, n, r, a) {
        var i = intval(domData(a, "peer")),
            s = intval(domData(gpeByClass("_im_mess", a), "msgid")),
            l = e.get()
            .tabs[i].hash;
        return (0, O.restoreMessageSend)(s, i, l, e.get()
                .gid), e.set(O.restoreMessage.bind(null, s, i))
            .then(x.restoreMessage.bind(null, s, i, o(t)))
            .then(function() {
                return I(e, n, t)
            }), !1
    }

    function T(e, t) {
        e()
            .showCreation(t)
    }

    function w(e, t, n) {
        cancelStackFilter("forward"), e.set(O.prepareForward.bind(null, []))
            .then(function() {
                t()
                    .changePeer(!1, e), removeClass(n, "im-page--history_fwd"), e.get()
                    .longpoll.push([(0, Q.transitionEvent)("default")])
            })
    }

    function S(e, t) {
        var n = geByClass1(J, e);
        toggleClass(n, "im-to-end_loading", t)
    }

    function k(e, t, n) {
        S(n, !0), t.set(O.changePeer.bind(null, t.get()
                .peer, !1))
            .then(function(e) {
                return t.set(O.loadPeer.bind(null, t.get()
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

    function A(e, t) {
        0 !== t.get()
            .peer && (0, x.isClassicInterface)(t) && e()
            .restoreScroll(t, t.get()
                .peer)
    }

    function D(e, t, n, i, s, d, g, f, v, C, E, T, S, k, L, A, D, M, R, j) {
        var U;
        return {
            changePeer: function(a) {
                var o = arguments.length <= 1 || void 0 === arguments[1] ? !0 : arguments[1],
                    c = arguments.length <= 2 || void 0 === arguments[2] ? !0 : arguments[2];
                if (0 === a.get()
                    .peer && R.disable(), 0 === a.get()
                    .peer && !(0, x.isClassicInterface)(a)) return l(e, a);
                if ((0, x.isFullyLoadedTab)(a.get(), a.get()
                        .peer)) {
                    removeClass(e, "im-page--history_search"), a.set(O.dropSelection), n.changeActions(a);
                    var d = a.get()
                        .peer,
                        g = a.get()
                        .prevPeer;
                    return removeClass(e, "im-page--history_loading"), o && i.restoreDraft(a), s()
                        .updateTyping({
                            peerId: d
                        }, a), h(a, e), (0, x.isClassicInterface)(a) && (p(e), _(a, e)), 0 !== g || (0, x.isReservedPeer)(d) ? (0, x.isReservedPeer)(g) || (0, x.isReservedPeer)
                        (d) ? void 0 : (u(e, a, d, t, s, n, C, c, R), void R.reset(t)) : (r(e, a, d, t, s, n, C, c, R), void R.reset(t))
                }
            },
            saveScroll: function(e) {
                return c(e, t)
            },
            loadingPeer: function(t) {
                (0, O.isAnythingLoading)(t.get()) || (removeClass(e, "im-page--history_empty"), addClass(e, "im-page--history_loading"))
            },
            deselectDialog: function(e) {
                d()
                    .removeSelection(e)
            },
            replaceMessageAttrs: function(t, n) {
                (0, x.replaceMessageAttrs)(n.get(), o(e), t)
            },
            cleanSelection: function(e) {
                T.cleanSelection(e)
            },
            updateDialogFilters: function(e) {
                d()
                    .updateDialogFilters(e)
            },
            getSearchResulstModule: function() {
                return U
            },
            insertSearch: function(n, r) {
                U || (U = (0, G.mount)(e, r, s)), addClass(e, "im-page--history_search"), n ? (removeClass(e, "im-page--history_search-empty"), o(e)
                    .innerHTML = n) : (addClass(e, "im-page--history_search-empty"), o(e)
                    .innerHTML = (0, x.renderEmptySearch)()), I(r, t, e), t.scrollBottom(0), h(r, e), R.reset(t)
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
                    (0, x.addChatPhotoToUpdate)(n, r, i.get(), o(e)), l && t.scrollBottom(V)
                }
            },
            markImportant: function(t, r, a) {
                var i = geByClass1("_im_mess_" + t, e);
                i && (n.changedMessageSelection(a), E.markImportant(t, r, a))
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
                    f.innerHTML = o, d(f), r.reversed && R.heightIncreased(l.offsetHeight - g, t), r.reversed || t.scrollBottom(c), t.update(!1, !0), R.parseMore(f, t)
                }
            },
            sendMessage: function(e) {
                0 !== e.get()
                    .peer && i.sendMessage()
            },
            addMessage: function(n, r) {
                if (!(0, O.isSearchingInplace)(r.peerId, n.get()) && (0, x.isPeerActive)(r.peerId, n.get())) {
                    if (geByClass1("_im_mess_" + r.messageId, e)) return;
                    var a = o(e);
                    P(R, a, t, function() {
                        var i = y(t);
                        (0, x.appendToHistory)(n.get(), r, a), removeClass(e, "im-page--history_empty-hist"), b(e), (r.local || i || (0, x.isServiceMsg)(r) &&
                                r.userId === vk.id) && t.scrollBottom(0), s()
                            .updateTyping(r, n), (0, F.toArray)(geByClass("_im_history_tooltip", e))
                            .forEach(hide)
                    });
                    var i = domPS(domLC(a));
                    if (hasClass(i, "_im_bar_date")) {
                        var l = ce("div");
                        l.innerHTML = i.outterHTML, R.parseMore(l, t)
                    }
                    R.update(0, t)
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
                if (!(0, O.isSearchingInplace)(t.peerId, n.get())) {
                    var r = n.get();
                    if (n.get()
                        .peer === t.peerId && (0, x.isFullyLoadedTab)(r, t.peerId)) {
                        var a = (0, x.formatTyper)(n.get()
                                .tabs[t.peerId].typing, t.peerId, !1, n.get()),
                            i = geByClass1(x.TYPING_CLASS, e);
                        if (i || a) {
                            if (!i) {
                                var s = geByClass1(re, e);
                                val(s, getTemplate("im_typing", {
                                    cls: (0, x.isClassicInterface)(n) ? "im-typing_classic" : ""
                                })), i = geByClass1(x.TYPING_CLASS, e)
                            }
                            val(geByClass1("_im_typing_name", i), a), a ? addClass(i, "im-page--typing_vis") : removeClass(i, "im-page--typing_vis")
                        }
                    }
                }
            },
            scrollFix: function(e, n, r) {
                R.heightIncreased(r, t), R.update(0, t), (0, x.isPeerActive)(n, e.get()) && y(t, r) && t.scrollBottom(V)
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
                R.toggle(e)
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
                (0, x.isPeerActive)(r.peerId, n.get()) && (P(R, o(e), t, function() {
                    var a = y(t);
                    (0, x.replaceAttaches)(e, r, n.get()), a && t.scrollBottom(0)
                }), R.update(0, t))
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
                if (removeClass(e, "im-page--hisory_search-open"), removeClass(e, "im-page--history_search"), removeClass(e, "im-page--history_search-empty"), U && (U.unmount(),
                        U = !1), r && !(0, x.isReservedPeer)(n.get()
                        .peer)) {
                    var a = n.get()
                        .tabs[n.get()
                            .peer];
                    o(e)
                        .innerHTML = (0, O.strHistory)(a.history), I(n, t, e), t.scrollBottom(0), n.get()
                        .msgid && (m(t, e, n.get()
                            .msgid), h(n, e)), D(t), R.reset(t)
                }
            },
            unmount: function() {
                (0, N.removeDelegateEvent)(e, "click", x.FAILED_CLASS, g), (0, N.removeDelegateEvent)(e, "click", x.RESTORE_CLASS, f), (0, N.removeDelegateEvent)(e,
                    "click", X, v), removeEvent(geByClass1("_im_start_new", e), "click", S), removeEvent(geByClass1(J, e), "click", k), B.screenfull.raw && removeEvent(
                        document, B.screenfull.raw.fullscreenchange, j), t.destroy(), clearInterval(M), i.unmount(), n.unmount(), E.unmount(), T.unmount(),
                    cancelStackFilter("forward")
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
            resendMessage: function(t, n) {
                t === A.get()
                    .peer && (0, x.startResendMessage)(t, n, e)
            },
            respond: function(e, n) {
                i.attachMessages(e, n), i.focusOn(e), t.scrollBottom(V), D(t)
            },
            startForward: function(t) {
                addClass(e, "im-page--history_fwd"), geByClass1("_im_explain_fwd", e)
                    .textContent = getLang("mail_explain_fwd", t.get()
                        .pendingForward.length), d()
                    .cancelSearch(t), d()
                    .removeSelection(t), cancelStackPush("forward", function() {
                        return w(t, d, e)
                    })
            }
        }
    }

    function M(e, t, n) {
        var r = geByClass1("_im_peer_history_w", e);
        show(r);
        var l = (0, R.createMutations)(D),
            u = l.callMutations,
            g = l.bindMutations,
            p = function(e) {
                var t = debounce(e, 100),
                    n = throttle(e, 100);
                return function(e) {
                    t(e), n(e)
                }
            }(c.bind(null, t)),
            b = (0, W.mount)(t, e),
            y = d.bind(null, t, u, r, p, b),
            S = (0, K.createScroll)(r, {
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
                        .msgid) : f(S, e, u, t, b) || S.scrollBottom(V), b.reset(S), h(t, e))
        }, 15);
        var P = (0, j.mount)(geByClass1("_im_dialog_actions", e), t, u),
            M = (0, U.mount)(geByClass1("_im_text_input", e), t, u),
            F = (0, H.mount)(geByClass1("_im_dialog_actions", e), t, u),
            G = (0, z.mount)(e, t, u),
            Q = (0, q.mount)(e, t, function() {
                return {
                    changedMessageSelection: P.changedMessageSelection
                }
            });
        (0, x.isReservedPeer)(t.get()
            .peer) || t.set(O.restoreHistoryQueue.bind(null, t.get()
                .peer))
            .then(function(n) {
                (0, x.restoreQueue)(t.get()
                    .peer, t.get(), o(e))
            });
        var Y = C.bind(null, t, e),
            Z = E.bind(null, t, e, S),
            $ = w.bind(null, t, n, e),
            re = T.bind(null, n, t),
            ae = k.bind(null, u, t, e),
            ie = s.bind(null, t, e),
            se = v.bind(null, t, Y, e),
            oe = x.showChatMembers.bind(null, t, u, O.setCreationType),
            le = i.bind(null, t, e, S),
            ue = A.bind(null, u, t);
        (0, N.addDelegateEvent)(e, "click", x.RESTORE_CLASS, Z), (0, N.addDelegateEvent)(e, "mouseover click", x.FAILED_CLASS, ie), (0, N.addDelegateEvent)(e, "click", X,
            $), (0, N.addDelegateEvent)(e, "click", ee, se), (0, N.addDelegateEvent)(e, "click", x.SHOW_CHAT_MEMBERS_CLASS, oe), (0, N.addDelegateEvent)(e, "click", te, le),
        (0, N.addDelegateEvent)(e, "mouseover", ne, L), addEvent(geByClass1("_im_start_new", e), "click", re), addEvent(geByClass1(J, e), "click", ae), B.screenfull.raw &&
            addEvent(document, B.screenfull.raw.fullscreenchange, ue);
        var ce = setInterval(_.bind(null, t, e), 1e3);
        return g(e, S, P, M, u, n, Y, Z, $, F, G, Q, re, ae, y, t, p, ce, b, ue)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = M;
    var O = n(1),
        x = n(2),
        B = n(29),
        F = n(10),
        N = n(3),
        R = n(16),
        j = n(72),
        U = n(84),
        H = n(78),
        G = n(47),
        z = n(50),
        q = n(48),
        K = n(39),
        W = n(73),
        Q = n(4),
        Y = 1e3,
        V = -30,
        Z = 30,
        $ = 2e3,
        X = "_im_cancel_fwd",
        J = "_im_to_end",
        ee = "_im_failed_action",
        te = "_im_mess_link",
        ne = "_im_admin_name",
        re = "_im_typer_c",
        ae = "_im_last_hist_act",
        ie = !1
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
                removeEvent(geByClass1(_, e), "click", t), removeEvent(geByClass1(b, e), "click", r), removeEvent(geByClass1(y, e), "click", a), removeEvent(uiSearch.getFieldEl(
                    n), "keyup", r), (0, m.removeDelegateEvent)(e, "click", C, i), cancelStackFilter(p)
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
        cancelStackPush(p, c.bind(null, e, t, n))
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
        cancelStackFilter(p), e.set(f.cancelSearch.bind(null, e.get()
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
        var l = geByClass1(v, e),
            g = geByClass1(h, e),
            f = i.bind(null, t, n, g),
            p = r(t, e, l, f),
            E = s.bind(null, p, e),
            T = u.bind(null, t, g, l, n, debounce(o, 300)),
            w = c.bind(null, t, g, n),
            S = d.bind(null, t, n, p, g);
        return addEvent(geByClass1(_, e), "click", E), addEvent(uiSearch.getFieldEl(g), "keyup", T), addEvent(geByClass1(b, e), "click", T), addEvent(geByClass1(y, e),
            "click", w), (0, m.addDelegateEvent)(e, "click", C, S), a(e, E, g, T, w, S, n)
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = g;
    var f = n(1),
        m = n(3),
        p = "im_hist_search",
        _ = "_im_search_date",
        v = "_im_search_date_input",
        h = "_im_search_history_input",
        b = "_im_start_inplace_search",
        y = "_im_cancel_inplace_search",
        C = "_im_clear_date"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function a(e, t) {
        return t.signalTimer = e, Promise.resolve(t)
    }

    function i(e) {
        return e.which || e.keyCode
    }

    function s(e, t) {
        var t = e.get()
            .tabbedPeers[t];
        t && e.get()
            .longpoll.push([(0, m.changePeer)(t.peer, !1, !0, !0)])
    }

    function o(e, t, n) {
        !n || inArray(i(n), d.UNPRINTABLE_KEYS) || (0, g.isSearchingInplace)(e.get()
            .peer, e.get()) || (0, f.isEditableFocused)() || n.ctrlKey || browser.mac && n.metaKey || n.key && 1 !== n.key.length || t.signal("printable", n)
    }

    function l(e, t, n) {
        i(n) === d.ENTER && e.signal(i(n), n), clearInterval(t.get()
            .signalTimer), t.set(a.bind(null, !1))
    }

    function u(e, t, n, r) {
        var o = i(r);
        if (!layers.visible) {
            if (o >= 49 && 57 >= o && (r.ctrlKey || r.metaKey && browser.mac) && isClassicInterface(t)) return s(t, o - 49), cancelEvent(r);
            if (!n.get()
                .signalTimer && inArray(o, d.UP_DOWN_CONTROLS)) {
                e.signal(o, r);
                var l = setInterval(e.signal.bind(null, o, r), 130);
                n.set(a.bind(null, l))
            }
        }
    }

    function c(e, t) {
        var n = browser.mozilla ? "keydown" : "keypress",
            r = (0, _["default"])({
                signalTimer: !1
            }),
            a = o.bind(null, e, t),
            i = u.bind(null, t, e, r),
            s = l.bind(null, t, r);
        return addEvent(document, "keydown", i), addEvent(document, "keyup", s), addEvent(document, n, a), {
            unmount: function() {
                removeEvent(document, n, a), removeEvent(document, "keydown", i), removeEvent(document, "keyup", s)
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.mount = c;
    var d = n(37),
        g = n(1),
        f = n(2),
        m = n(4),
        p = n(5),
        _ = r(p)
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
                e.set(W.removeMessages.bind(null, a, n))
                    .then(function() {
                        t.removeMessages(a, intval(n), e)
                    })
            })
    }

    function i(e, t, n, r) {
        t.set(W.updateChatPhoto.bind(null, e))
            .then(function() {
                var a = e.kludges.source_act;
                n.updateDialog(e.peerId, t), r.updateChatPhoto(e, a, t)
            })
    }

    function s(e, t, n, a, i, s, o) {
        e.set(W.updateActions.bind(null, t, a, n))
            .then(function() {
                return t === Q.CHAT_INVITE_USER ? (a === vk.id && e.set(W.returnedToChat.bind(null, n)), e.set(W.loadChatMember.bind(null, r({}, n, [a])))) : e.set(W.chatKickUser
                    .bind(null, n, i, a))
            })
            .then(function() {
                e.get()
                    .peer === n && (o.updateChat(e, n), s.updateDialog(n, e))
            })
    }

    function o(e, t) {
        "spam" === t ? (0, Q.showSpamLayer)(e, G.mount, {}) : "fav" === t && (0, Q.showFavvedBox)(e, {}, Y.mount, {})
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
        e.set(W.changePeer.bind(null, 0, !1))
            .then(function() {
                (0, Q.isClassicInterface)(e) && t.activate(), n.changePeer(e), t.restoreScroll(e), setTimeout(function() {
                    e.get()
                        .longpoll.push([U.eventTypes.transitionEvent("search")])
                }, 13), (0, Q.isLocksAvailable)(e) && (0, Q.isPeerBlockedByMe)(a, e) && e.set(W.releaseBlock.bind(null, a))
            })
    }

    function c(e, t, n, r, a) {
        e.forEach(function(e) {
            var o = e.kludges.source_act,
                l = intval(e.kludges.source_mid);
            switch (o) {
                case Q.CHAT_PHOTO_REMOVE:
                case Q.CHAT_PHOTO_UPDATE:
                    i(e, t, n, r);
                    break;
                case Q.CHAT_KICK_USER:
                case Q.CHAT_INVITE_USER:
                    s(t, o, e.peerId, l, e.userId, n, r);
                    break;
                case Q.CHAT_TITLE_ACTION:
                    var u = e.kludges.source_text;
                    t.set(W.setChatTitle.bind(null, e.peerId, u))
                        .then(function() {
                            r.updateChatTopic(e.peerId, t), (0, Q.isClassicInterface)(t) && a.updateName(e.peerId, t)
                        })
            }
        })
    }

    function d(e, t) {
        return 2e9 > t && e && !e.match(/^\s*(Re(\(\d*\))?\:)?\s*\.\.\.\s*$/)
    }

    function g(e, t) {
        var n = t.flags & U.eventTypes.FLAG_OUTBOUND,
            r = inArray(t.peerId, e.get()
                .mutedPeers),
            a = t.flags & U.eventTypes.FLAG_DELETED,
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
                    .notify_msg && !(0, Q.isChatPeer)(g) || i && !e.get()
                    .mute) && window.Notifier && Notifier.playSound({
                    author_id: g
                }), !(0, Q.isChatPeer)(g)) return;
            u = trim(replaceEntities(stripHTML(u.replace(/<br>/g, "\n")
                .replace(/<\*>.*$/, "")))), (0, Q.isChatPeer)(g) ? (s = f.data.members[c].name, f.tab && (s += " » " + f.tab), o = f.data.members[c].photo) : (s = f.tab,
                o = f.photo);
            var m = t.attaches[0];
            if (m && "fwd" === m.type) u += "\n[" + getLang("mail_added_msgs") + "]";
            else if (m) {
                var p = "doc" === m.type && "graffiti" === m.kind ? "graffiti" : m.type;
                u += "\n[" + getLang("mail_added_" + p) + "]"
            }
            s = trim(replaceEntities(stripHTML((s || "")
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
            .longpoll.push.bind(null, [U.eventTypes.resetPeer()]);
        cancelStackPush("im_peer", t)
    }

    function m(e, t) {
        var n = e.get()
            .tabs[t.peerId],
            r = e.get()
            .active_tab;
        return r === Q.FOLDER_ALL ? !0 : (0, W.filterFromTab)(r)(n)
    }

    function p(e) {
        var t = e.attaches.filter(function(e) {
            return "sticker" !== e.type
        });
        return (0, Q.isServiceMsg)(e) || 0 === t.length
    }

    function _(e, t, n) {
        addClass(n, "im-page_history-show"), t.loadingPeer(e)
    }

    function v(e, t) {
        (0, Q.isPendingForward)(e) && (cancelStackFilter("forward"), e.set(W.forwardMessages.bind(null, e.get()
            .pendingForward, t)))
    }

    function h(e, t) {
        var n = (0, Q.isCommunityInterface)(e) ? ne : re;
        return n += ae, Math.floor((t.offsetHeight - n) / J)
    }

    function b(e, t) {
        var n = h(e, t);
        if (e.get()
            .tabbedPeers.length > n) {
            var r = function() {
                var t = e.get()
                    .tabbedPeers.filter(function(t) {
                        var n = t.peer;
                        return intval(n) !== e.get()
                            .peer
                    }),
                    r = t.map(function(t) {
                        var n = t.peer;
                        return e.get()
                            .tabs[n]
                    }),
                    a = r.sort(function(e, t) {
                        return t.last_touched - e.last_touched
                    }),
                    i = [];
                0 !== e.get()
                    .peer && i.push(e.get()
                        .tabs[e.get()
                            .peer]);
                var s = i.concat(a)
                    .slice(n)
                    .map(function(e) {
                        return e.peerId
                    }),
                    o = e.get()
                    .tabbedPeers.filter(function(e) {
                        return !inArray(e.peer, s)
                    });
                return {
                    v: e.set(W.updateTabbedPeers.bind(null, o, !0))
                }
            }();
            if ("object" === ("undefined" == typeof r ? "undefined" : A(r))) return r.v
        }
        return Promise.resolve(e)
    }

    function y(e, t, n, r, a, i, s, o, l) {
        t.forward && r.hideFwd(e), e.get()
            .searchText && t.cancelSearch && (a.clearSearch(e), n.restoreDialogs(e)), C(e, o, l), _(e, r, i);
        var u = e.get()
            .peer,
            c = e.set(W.changePeer.bind(null, t.peerId, t.msgid))
            .then(function() {
                n.selectPeer(t.msgid, e), (0, Q.isClassicInterface)(e) && (n.deactivate(), b(e, i)
                    .then(function() {
                        return s.updateMenu(e)
                    }))
            });
        return c = t.msgid ? c.then(function() {
            return e.set(W.selectPeerOnMessage.bind(null, t.peerId === u, u))
        }) : c.then(function() {
            return e.set(W.selectPeer.bind(null, !0))
        }), c.then(function() {
            t.forward && (v(e, e.get()
                .peer), e.set(W.readLastMessages.bind(null, e.get()
                .peer))), (0, Q.isClassicInterface)(e) && s.updateMenu(e), r.changePeer(e), r.updateTyping(t, e), f(e)
        })
    }

    function C(e, t, n) {
        t && e.get()
            .showed && (t.hide(e), n()
                .createCanceled(e))
    }

    function E(e, t, n) {
        e.get()
            .searchText && (t.clearSearch(e), n.restoreDialogs(e))
    }

    function T(e, t, n, a, i, s, d, v, h, T, w, S, k, P, A, D, M, O, x, B) {
        return {
            changePeer: function(t, n) {
                e.selectPeer(t, n)
            },
            cancelSearch: function(t) {
                E(t, n, e)
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
                (0, Q.isClassicInterface)(r) && (e.saveScroll(r), t.saveScroll(r)), n.rotateCross(r), addClass(a, "im-page_creating"), w && w.show(r, i), (0, Q.isClassicInterface)
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
                n.createCanceled(r, i), removeClass(a.parentNode, "im-page_creating"), (0, Q.isClassicInterface)(r) ? (setStyle(a.parentNode, {
                    overflow: "visible"
                }), setTimeout(function() {
                    n.focusInput(r), 0 === r.get()
                        .peer ? e.restoreScroll(r) : t.restoreScroll(r, r.get()
                            .peer)
                }, 0)) : setTimeout(function() {
                    0 === r.get()
                        .peer ? n.focusInput(r) : t.focustTxt(r)
                }, 0)
            },
            updateMenu: function(e) {
                M && M.updateMenu(e)
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
                    .searchText && n.clearSearch(r), e.restoreDialogs(r, !0, !0), e.focusOnSelected(r), w && w.hide(r), (0, Q.isCommunityInterface)(r) && l(r, a), (0,
                        Q.isClassicInterface)(r) && r.get()
                    .tabbedPeers.forEach(function(e) {
                        var t = e.peer;
                        M.updateCounter(r, t), M.updateName(t, r)
                    }), t.cleanSelection(r.get()
                        .selectedMessages || []), t.cancelSearch(r, !0), t.changePeer(r);
                var i = r.get()
                    .gid ? "l_mgid" + r.get()
                    .gid : "msg";
                handlePageCount(i, r.get()
                    .unread_cnt)
            },
            toggleSettingsLoader: function(e, t) {
                S.toggleLoader(e, t)
            },
            onUserActions: function(e, t) {
                if (!(0, W.isSearchingInplace)(e.get()
                        .peer, e.get())) {
                    var n = e.get(),
                        r = n.peer;
                    if ((0, Q.isFullyLoadedTab)(n, r) && !i.is_idle) {
                        var a = (0, W.countUnread)(e.get()
                            .peer, e.get());
                        if (a > 0) {
                            var s = n.tabs[r];
                            s.skipped || e.set(W.readLastMessages.bind(null, r))
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
                                var t = i.sel ? (0, Q.unUrlPeer)(i.sel) : 0;
                                0 === t ? k.get()
                                    .longpoll.push([U.eventTypes.resetPeer()]) : k.get()
                                    .longpoll.push([U.eventTypes.changePeer(t)]);
                                break;
                            case "tab":
                                C(k, w, T), l = !0;
                                var n = i.tab || Q.FOLDER_ALL;
                                k.get()
                                    .longpoll.push([U.eventTypes.changeTab(n)]);
                                break;
                            case "box":
                                o(k, i.box)
                        }
                    }), (0, Q.isClassicInterface)(k) && "undefined" == typeof t.sel && M.updateMenu(k), l && E(k, n, e), !1
            },
            updateDialogFilters: function(t) {
                t.get()
                    .searchText || e.restoreDialogs(t), S.updateFilter(t)
            },
            removePeer: function(t, n) {
                e.removeDialog(t, n), e.saveScroll(t), t.get()
                    .peer === n && t.get()
                    .longpoll.push([U.eventTypes.resetPeer()]), (0, Q.isClassicInterface)(t) && M.updateMenu(t)
            },
            newMessage: function(n, r) {
                e.promoteDialog(r, n), (0, Q.isClassicInterface)(r) || e.scrollUp(!0), t.addMessage(r, n)
            },
            onEvents: function(i, s) {
                var o = (i.get()
                        .gid, s),
                    d = s.filter(Q.isServiceMsg),
                    f = s.filter(function(e) {
                        return e.type === U.eventTypes.ADD_MESSAGE
                    });
                c(d, i, e, t, M), i.set(W.checkNewPeople.bind(null, d, f, v))
                    .then(function() {
                        o.forEach(function(s) {
                            switch (s.type) {
                                case U.eventTypes.ADD_MESSAGE:
                                    var o = (0, Q.isDuplicate)(s, i.get());
                                    if (0 === o) {
                                        s.flags & U.eventTypes.FLAG_OUTBOUND || i.set(W.updateFavAndTitle.bind(null, s.peerId, !0));
                                        var c = i.set(W.addMessage.bind(null, s))
                                            .then(function() {
                                                return b(i, a)
                                            })
                                            .then(function() {
                                                m(i, s) && (g(i, s), e.updateTyping(s, i), i.get()
                                                        .searchText ? e.updateDialog(s.peerId, i) : e.promoteDialog(i, s)), (0, Q.isClassicInterface)(i) &&
                                                    (M.updateCounter(i, s.peerId), M.updateMenu(i)), t.updateTyping(s, i), t.addMessage(i, s), (0, Q.isClassicInterface)
                                                    (i) || S.updateFilter(i)
                                            });
                                        p(s) || Promise.all([c, i.set(W.loadMedia.bind(null, s))])
                                            .then(function(e) {
                                                var n = L(e, 2),
                                                    r = n[1];
                                                t.replaceAttachmentPlaceholders(r, s)
                                            })
                                    } else 2 === o && (p(s) || i.set(W.loadMedia.bind(null, s))
                                        .then(function(e) {
                                            t.replaceAttachmentPlaceholders(e, s)
                                        }), i.set(W.replaceMessage.bind(null, s))
                                        .then(t.replaceMessageAttrs.bind(null, s)));
                                    break;
                                case U.eventTypes.READ_INBOUND:
                                    i.set(W.markInboundMessagesAsRead.bind(null, s))
                                        .then(function(t) {
                                            e.updateCounter(t, s), (0, Q.isClassicInterface)(t) && M.updateCounter(t, s.peerId), t.get()
                                                .searchText || e.restoreDialogs(t), S.updateFilter(t)
                                        });
                                    break;
                                case U.eventTypes.READ_OUTBOUND:
                                    i.set(W.markOutboundMessagesAsRead.bind(null, s))
                                        .then(function(n) {
                                            e.updateCounter(n, s), t.markMessagesAsRead(n, s)
                                        });
                                    break;
                                case U.eventTypes.UNREAD_COUNT:
                                    i.set(W.updateUnreadCount.bind(null, s.count))
                                        .then(function() {
                                            var e = i.get()
                                                .gid ? "l_mgid" + i.get()
                                                .gid : "msg";
                                            handlePageCount(e, s.count), S.updateFilter(i), (0, Q.isClassicInterface)(i) && l(i, a)
                                        });
                                    break;
                                case U.eventTypes.GOT_ONLINE:
                                case U.eventTypes.GOT_OFFLINE:
                                    var d = s.type === U.eventTypes.GOT_ONLINE ? !0 : !1;
                                    i.set(W.updateOnline.bind(null, s.userId, d))
                                        .then(function(n) {
                                            (0, Q.isTabLoaded)(n.get(), s.userId) && (e.updateOnline(s.userId, n), t.updateOnline(s.userId, n))
                                        });
                                    break;
                                case U.eventTypes.SET_FLAGS:
                                case U.eventTypes.RESET_FLAGS:
                                    if (s.flags !== U.eventTypes.FLAG_DELETED || s.type !== U.eventTypes.SET_FLAGS || (0, Q.isAlreadyDeleted)(i, s.peerId,
                                            s.messageId) || i.get()
                                        .blockedFlagUpdates[s.peerId] || h(s), s.flags === U.eventTypes.FLAG_IMPORTANT) {
                                        var f = s.type === U.eventTypes.SET_FLAGS;
                                        i.set(W.updateImportant.bind(null, f ? 1 : -1, s.messageId))
                                            .then(function() {
                                                (0, Q.isClassicInterface)(i) || n.updateImportantCnt(i)
                                            }), i.set(W.updateFavMessage.bind(null, [s.messageId], s.peerId, f))
                                            .then(function(e) {
                                                t.markImportant(s.messageId, f, i)
                                            })
                                    }
                                    break;
                                case U.eventTypes.TYPING:
                                    (0, Q.isSelfMessage)(s.peerId, i.get()
                                        .gid) || (i.set(W.setTyping.bind(null, s.peerId, s.userId))
                                        .then(function(n) {
                                            (0, Q.isTabLoaded)(n.get(), s.peerId) && (t.updateTyping(s, n), e.updateTyping(s, n))
                                        }), i.set(W.waitTyping.bind(null, s.peerId, s.userId))
                                        .then(function(n) {
                                            (0, Q.isTabLoaded)(n.get(), s.peerId) && (t.updateTyping(s, n), e.updateTyping(s, n))
                                        }));
                                    break;
                                case U.eventTypes.NOTIFY_SETTINGS_CHANGED:
                                    I(i, T, s.peerId, 0 !== s.disabledUntil);
                                    break;
                                case U.eventTypes.RESYNC:
                                    i.get()
                                        .longpoll.pause(), i.set(W.resync)
                                        .then(T()
                                            .resync)
                                        .then(function(e) {
                                            return i.get()
                                                .longpoll.resume()
                                        });
                                    break;
                                case U.eventTypes.TRANSITION:
                                    P.transition(s.state);
                                    break;
                                case U.eventTypes.RESET_PEER:
                                    u(i, e, t, a), s.cancelSearch && E(i, n, e), (0, Q.isClassicInterface)(i) && M.updateMenu(i), n.focusInput(i);
                                    break;
                                case U.eventTypes.CHANGE_TAB:
                                    (0, Q.changeTab)(s.tab, i, T, W.changeDialogsTab);
                                    break;
                                case U.eventTypes.RESET_DIRECTORIES:
                                case U.eventTypes.SET_DIRECTORIES:
                                case U.eventTypes.REPLACE_DIRECTORIES:
                                    i.set(W.updateFolderState.bind(null, s.peerId, s.mask, s.type, s.local))
                                        .then(function(n) {
                                            n.get()
                                                .searchText || s.type === U.eventTypes.RESET_DIRECTORIES && s.mask === U.eventTypes.FOLDER_IMPORTANT ||
                                                s.type === U.eventTypes.REPLACE_DIRECTORIES || e.restoreDialogs(n), e.updateDialog(s.peerId, n), l(n, a),
                                                n.get()
                                                .peer === s.peerId && t.changedMessageSelection(n)
                                        });
                                    break;
                                case U.eventTypes.CHANGE_PEER:
                                    y(i, s, e, t, n, a, M, w, T);
                                    break;
                                case U.eventTypes.MUTEX:
                                    var _ = r({}, s.peerId, s),
                                        v = (0, Q.isPeerBlocked)(s.peerId, i);
                                    i.set(W.updateBlockStates.bind(null, _))
                                        .then(function() {
                                            e.updateDialog(s.peerId, i);
                                            var n = (0, Q.isPeerBlocked)(s.peerId, i);
                                            (0, Q.isFullyLoadedTab)(i.get(), s.peerId) && v !== n && t.updateChat(i, s.peerId)
                                        });
                                    break;
                                case U.eventTypes.FAILED_MESSAGE:
                                    i.set(W.setMessageErrored.bind(null, s.peer, s.message))
                                        .then(function() {
                                            t.setMessageErrored(s.peer, s.message, i), e.setDialogFailed(s.peer, s.message.messageId, i)
                                        });
                                    break;
                                case U.eventTypes.RESEND:
                                    var C = s.message.messageId;
                                    i.set(W.resendMessage.bind(null, s.peerId, C, s.message))
                                        .then(function() {
                                            t.resendMessage(s.peerId, C), e.promoteDialog(i, s.message)
                                        })
                            }
                        })
                    })
            },
            unmount: function() {
                clearInterval(k.get()
                    .update_title_to), i.stop(), removeEvent(document, "mousemove mousedown keypress", s), removeEvent(window, "resize", d), v.stop(), e.unmount();
                var r = window.devicePixelRatio >= 2 ? "_2x" : "";
                setFavIcon("/images/icons/favicons/fav_logo" + r + ".ico"), t.unmount(), n.unmount(), cancelStackFilter("im_peer"), M && M.unmount(), O && O(), A && A(),
                    (0, Q.isLocksAvailable)(k) && k.get()
                    .peer && k.set(W.releaseBlock.bind(null, k.get()
                        .peer)), x.unmount(), M && M.unmount(), B.unmount(), clearInterval(D)
            }
        }
    }

    function w(e, t, n, r) {
        (0, Q.isReservedPeer)(t.get()
            .peer) || e()
            .onUserActions(t, r), t.set(W.updateFavAndTitle.bind(null, !1, !1))
    }

    function S(e, t, n, a, i, s) {
        var o = arguments.length <= 6 || void 0 === arguments[6] ? !0 : arguments[6];
        if (!isFullScreen()) {
            var l = ge("page_header"),
                u = (window.innerHeight || document.documentElement.clientHeight) - l.offsetHeight - Z - 2,
                c = (0, Q.isClassicInterface)(t) ? "minHeight" : "height",
                d = (0, Q.isClassicInterface)(t) ? X : $;
            if (setStyle(e, "height", "auto"), setStyle(e, r({}, c, Math.max(u, d))), (0, Q.isClassicInterface)(t)) {
                var g = geByClass1("_im_chat_body_abs", e),
                    f = geByClass1("_im_page_dialogs", e),
                    m = geByClass1("_im_page_history", e);
                [f, m].forEach(function(e) {
                    setStyle(e, {
                        minHeight: Math.max(u, d),
                        position: "static",
                        top: 0
                    })
                }), setStyle(g, {
                    minHeight: Math.max(u, d),
                    height: Math.max(u, d),
                    position: "static",
                    top: 0
                })
            }
            if (a && a.updateScroll(), i && i.updateScroll(), n) {
                var p = n.updateScroll();
                n.scrollFix(t, t.get()
                    .peer, p)
            }
            o && setTimeout(function() {
                return S(e, t, n, a, i, s, !1)
            }, 100)
        }
    }

    function k(e, t, n, a) {
        function i() {
            var t = (0, N.getNativeOption)("scrollLeft"),
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

    function I(e, t, n, r) {
        e.set(W.setMutedPeer.bind(null, n, r))
            .then(t()
                .updateState.bind(null, n))
    }

    function P(e, t) {
        var n, r = window.devicePixelRatio >= 2 ? "_2x" : "";
        setFavIcon("/images/icons/favicons/fav_im" + r + ".ico"), S(e, t, !1, !1, !1, !0), show(e), t.set(W.fetchLocalHints);
        var i = (0, R.createMutations)(T),
            s = i.callMutations,
            l = i.bindMutations,
            u = (0, U.startLongPoll)(t.get());
        u.on("data", function() {
            for (var e = arguments.length, n = Array(e), r = 0; e > r; r++) n[r] = arguments[r];
            return s()
                .onEvents(t, n)
        }), window.lpl = u;
        var c = geByClass1("_im_dialogs_search", e),
            d = geByClass1("_im_dialogs_settings", e),
            g = (0, D.mount)(geByClass1("_im_page_dcontent", e), t, s),
            m = (0, M.mount)(geByClass1("_im_page_history", e), t, s),
            p = (0, O.mount)(c, t, s),
            _ = (0, x.mount)(d, t, s),
            v = (0, q.mount)(t);
        if ((0, Q.isClassicInterface)(t) && _.updateSettings(t), (0, Q.isClassicInterface)(t)) var h = geByClass1("_im_ui_peers_list", e.parentNode),
            b = (0, z.mount)(h, t, s),
            y = k(c, d, geByClass1("_im_right_menu", e.parentNode), e);
        (0, Q.isClassicInterface)(t) && t.get()
            .peer && g.deactivate(), t.get()
            .gid || (n = (0, B.mount)(geByClass1("_im_dialogs_creation", e), t, s));
        var C = 0 === t.get()
            .peer ? "search" : "default",
            E = (0, j.create)(t, C, g, m, p, n),
            I = (0, V.mount)(t, E);
        m.updateScroll();
        var P = w.bind(null, s, t, E);
        (0, Q.isReservedPeer)(t.get()
            .peer) || setTimeout(function(e) {
            f(t)
        }, 10);
        var A = new IdleManager({
                id: "im",
                element: document,
                focusElement: window,
                triggerEvents: "mousemove mousedown keypress"
            }),
            N = S.bind(null, e, t, m, g, n, !1);
        if (t.get()
            .longpoll = u, addEvent(window, "resize", N), t.set(W.setExecStack.bind(null, [])), A.on("unidle", function() {
                u.abortPauses(), P()
            }), A.start(), addEvent(document, "mousemove mousedown", P), nav.objLoc.box && (o(t, nav.objLoc.box), (0, F.updateLocation)({
                box: null
            })), (0, Q.isLocksAvailable)(t)) var G = (0, H.createWorker)(t.get()
                .mutex_key,
                function(e) {
                    t.get()
                        .longpoll.push([U.eventTypes.mutexEvent(e)])
                },
                function(e, n) {
                    return (0, W.getMutexQueue)(t.get()
                            .gid)
                        .then(function(e) {
                            var t = L(e, 1),
                                n = t[0];
                            return n
                        })
                }),
            Y = G.stop;
        if (t.set(W.fetchFriends), (0, Q.isLocksAvailable)(t)) var Z = setInterval(Q.blockLatencyCompensation.bind(null, t, t.get()
            .longpoll), 2e3);
        var $ = (0, K.throttleAccumulate)(a.bind(null, t, m), 200);
        return l(g, m, p, e, A, P, N, u, $, s, n, _, t, E, Y, Z, b, y, v, I)
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
        }(),
        A = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
        };
    t.mount = P;
    var D = n(75),
        M = n(77),
        O = n(82),
        x = n(83),
        B = n(74),
        F = n(52),
        N = n(39),
        R = n(16),
        j = n(91),
        U = n(22),
        H = (n(4), n(92)),
        G = n(49),
        z = n(81),
        q = n(76),
        K = n(10),
        W = n(1),
        Q = n(2),
        Y = n(46),
        V = n(79),
        Z = 30,
        $ = 400,
        X = 250,
        J = 32,
        ee = 12,
        te = 52,
        ne = 5 * J + 2 * ee + te,
        re = 3 * J + 2 * ee,
        ae = 10
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
                    .mapped_index && e.get()
                    .mapped_index[t.peer]
            })
            .filter(function(e) {
                return e
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
            attrs: 'title="' + stripHTML(r.tab) + '"',
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
                l(e, t);
                var r = gpeByClass("_im_right_menu", e);
                o(n, t)
                    .then(function() {
                        var e;
                        e = t.get()
                            .peer ? ge("ui_rmenu_peer_" + t.get()
                                .peer) : ge("ui_rmenu_" + t.get()
                                .active_tab), e && uiRightMenu.switchMenu(e, !0), uiRightMenu.hideProgress(r)
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
    var d = n(36),
        g = n(5),
        f = r(g),
        m = n(2),
        p = n(3),
        _ = n(1),
        v = (n(10), n(4))
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
            var s = d.bind(null, e, n, t);
            cancelStackPush("im_search", s), e.set(y.setCurrentSearch.bind(null, i, !1))
                .then(t), addClass(r, "im-page--dialogs-search_fill")
        } else i || (e.set(y.setCurrentSearch.bind(null, "", !1))
            .then(t), removeClass(r, "im-page--dialogs-search_fill"))
    }

    function s(e, t, n) {
        return function() {
            var r = t.get()
                .searchText;
            r === e && n.apply(null, arguments)
        }
    }

    function o(e, t, n) {
        var r = t()
            .appendFastDialogs.bind(null, n),
            a = s(e, n, r);
        return (0, y.searchFriends)(e, n.get())
            .then(function(t) {
                var n = t;
                if (e.indexOf("@") >= 0) {
                    var r = {
                        type: "email_create",
                        query: clean(e),
                        peerId: Math.random()
                    };
                    n = [r].concat(t)
                }
                return a(n), t
            })
    }

    function l(e, t, n) {
        var r = n.get()
            .searchText;
        return r ? o(r, e, n)
            .then(function(a) {
                var i = a.map(function(e) {
                    return e.peerId
                });
                return t(r, e, i, n)
            }) : (e()
                .restoreDialogs(n), Promise.resolve(!1))
    }

    function u(e, t, n, r) {
        var a = r.get(),
            i = s(e, r, t()
                .appendDialogs.bind(null, r)),
            o = s(e, r, t()
                .appendSearch);
        return (0, C.isPendingForward)(r) ? (0, y.searchHints)(e, n, "all", a)
            .then(i) : (r.get()
                .dialog_search_going = !0, Promise.all([(0, y.searchHints)(e, n, "all", a)
                    .then(i), (0, y.searchMessages)(e, a)
                ])
                .then(function(e) {
                    var t = b(e, 2),
                        n = b(t[1], 2),
                        a = n[0],
                        i = n[1];
                    o(r, a, i, !0), r.get()
                        .dialog_search_going = !1
                }))
    }

    function c(e, t, n) {
        n()
            .showCreation(e)
    }

    function d(e, t, n) {
        cancelStackFilter("im_search");
        var r = a(t);
        uiSearch.reset(r), i(e, n, t, r, r.value)
    }

    function g(e, t, n, r, a) {
        e.get()
            .searchText ? (d(e, t, n), setTimeout(function(t) {
                return m(e, a)
            }, 10)) : (window.tooltips && tooltips.hide(a, {
                showsp: 0
            }), c(e, a, r))
    }

    function f(e, t, n, r, a) {
        return (0, C.showFavvedBox)(e, n, w.mount, r)
    }

    function m(e, t) {
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

    function p(e, t, n) {
        var r = n.target;
        e.set(y.toggleCommunityMute.bind(null, t))
            .then(function() {
                toggleClass(r, "im-page--gim-mute_muted", e.get()
                    .mute), t && _(e, {
                    target: r
                })
            })
    }

    function _(e, t) {
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

    function v(e, t, n, r, i, s, o) {
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
                d(t, e, function(e) {
                    return !1
                })
            },
            updateImportantCnt: function(t) {
                var n = t.get()
                    .important_cnt,
                    r = geByClass1(S, e);
                toggleClass(r, "im-page--stars_hidden", 0 === n), r.innerHTML = "<i></i> " + n
            },
            unmount: function() {
                removeEvent(a(e), "keyup", t), removeEvent(geByClass1("_im_search_croll", e), "click", n), removeEvent(geByClass1(S, e), "click", r), removeEvent(s,
                    "mouseover", o), cancelStackFilter("im_search")
            }
        }
    }

    function h(e, t, n) {
        var r = geByClass1("_im_search_croll", e),
            s = a(e),
            o = debounce(u, 300),
            c = l.bind(null, n, o),
            d = i.bind(null, t, c, e, s),
            h = g.bind(null, t, e, c, n, r),
            b = f.bind(null, t, e, n),
            y = geByClass1("_im_dialogs_search_input", e);
        uiSearch.init(y, {
            onChange: d
        });
        var E = m.bind(null, t, r);
        if (addEvent(geByClass1("_im_av_time", e), "mouseover", function(e) {
                showTooltip(e.target, {
                    text: getLang("mail_admin_av_time"),
                    dir: "up",
                    shift: [0, 8]
                })
            }), addEvent(r, "click", h), addEvent(r, "mouseover", E), addEvent(geByClass1(S, e), "click", b), (0, C.isClassicInterface)(t)) {
            var w = p.bind(null, t, !0),
                I = _.bind(null, t),
                P = geByClass1(k, e);
            p(t, !1, {
                target: P
            }), addEvent(P, "click", w), addEvent(P, "mouseover", I)
        }
        return addEvent(s, "focus", function() {
            t.get()
                .longpoll.push([(0, T.transitionEvent)("search")])
        }), addEvent(s, "blur", function() {
            var e = void 0;
            e = 0 === t.get()
                .peer ? "search" : (0, C.isPendingForward)(t) ? "search" : "default", t.get()
                .longpoll.push([(0, T.transitionEvent)(e)])
        }), v(e, d, h, b, c, r, E)
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
    t.mount = h;
    var y = n(1),
        C = n(2),
        E = n(5),
        T = (r(E), n(4)),
        w = n(46),
        S = "_im_important_counter",
        k = "_im_gim_mute"
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
    var u = n(3),
        c = n(49),
        d = n(1),
        g = n(2),
        f = "_im_dialogs_cog_settings",
        m = "_im_settings_action",
        p = "_im_to_unread"
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        if (0 === e.length) return [""];
        for (var n = []; e.length > G;) {
            var r = e.substr(0, G)
                .lastIndexOf(" "); - 1 == r && (r = G), n.push(e.substr(0, r)), e = e.substr(r)
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
        return T(t, r) ? void 0 : (0, x.getBindAttachToUrl)(t, r.get())
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
                var c = (0, N.random)(),
                    d = {
                        peerId: t,
                        messageId: "rid" + c,
                        flags: M.eventTypes.FLAG_OUTBOUND | M.eventTypes.FLAG_UNREAD,
                        date: intval(Date.now() / 1e3) - r.get()
                            .timeshift,
                        subject: "",
                        text: (0, B.replaceSpecialSymbols)(clean(n.message))
                            .replace(/\n/gi, "<br>"),
                        local: !0,
                        kludges: {
                            emoji: !0,
                            from_admin: r.get()
                                .gid ? vk.id : null
                        },
                        attaches: i(n.attaches)
                    };
                return n.rid = c, n.mess = d, e(t, n), r.set(x.addMessage.bind(null, d))
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
            .loadingPeer(e), e.set(x.changePeer.bind(null, e.get()
                .peer, !1))
            .then(function(t) {
                return e.set(x.loadPeer.bind(null, e.get()
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
        r !== cur.ctrl_submit && (cur.ctrl_submit = r, e.set(x.changeSubmitSettings.bind(null, r)))
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
        if ((0, x.isAnythingLoading)(e.get())) {
            var f = c(e, H, (0, j.toArray)(arguments));
            return e.set(x.setDelayedMessage.bind(null, !0, f))
                .then(function() {
                    lockButton(g)
                })
        }
        clearTimeout(e.get()
                .delayed_ts), e.set(x.setDelayedMessage.bind(null, !1, !1))
            .then(function() {
                unlockButton(g)
            });
        var m = e.get(),
            p = m.peer,
            _ = geByClass1("_im_text", i);
        Promise.all([(0, x.getAttaches)(e, p), (0, x.getForwardedMessages)(p, e.get())])
            .then(l.bind(null, e, t))
            .then(function(l) {
                var u = D(l, 2),
                    c = u[0],
                    g = u[1];
                c = c.concat(d);
                var f = Emoji.editableVal(_) || "";
                if (trim(f) || 0 !== c.length || 0 !== g.length) {
                    g.length > 0 && c.push(["fwd", g]);
                    var m = r(f);
                    a(_, i, p), m.slice(0, m.length - 1)
                        .forEach(function(r) {
                            s(n, p, {
                                message: trim(r),
                                attaches: []
                            }, e, t, o)
                        });
                    var f = m.slice(-1)[0];
                    s(n, p, {
                        message: trim(f),
                        attaches: c
                    }, e, t, o)
                }
            })
    }

    function g(e, t, n, r) {
        return e.set(x.deliverMessage.bind(null, n, r))
    }

    function f(e, t, n) {
        e.get()
            .longpoll.push([M.eventTypes.failedMessage(t, n.mess)])
    }

    function m(e, t, n, r, a, i) {
        var s = geByClass1("_im_text", e);
        return addEvent(s, "focus", function() {
            t.get()
                .longpoll.push([M.eventTypes.transitionEvent("message")]), cur.focused = t.get()
                .peer
        }), addEvent(s, "blur", function() {
            var e = 0 === t.get()
                .peer ? "search" : "default";
            t.get()
                .longpoll.push([M.eventTypes.transitionEvent(e)]), cur.focused = !1
        }), Emoji.init(s, {
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
            uploadActions: i
        })
    }

    function p(e, t, n, r, a, i, s, o, l) {
        if ("album" === a) return !1;
        if (show("_im_media_preview"), !t.get()
            .rebuilding_draft) {
            if ("page" === a) return !1;
            if (!("share" !== a || s.title && o)) return !1;
            t.set(x.cleanMediaStore.bind(null, t.get()
                .peer));
            var u = l.getMedias()
                .slice()
                .map(function(e) {
                    return e.slice(0, 2)
                }),
                c = [];
            "undefined" != typeof i && a ? (o && t.set(x.bindAttachToUrl.bind(null, t.get()
                    .peer, a, i, o)), c = [
                    [a, i, s]
                ]) : a || "undefined" == typeof i || u.splice(i, 1), u = u.concat(c), u.filter(function(e) {
                    return e
                })
                .forEach(function(e) {
                    t.set(x.addMediaStore.bind(null, e))
                });
            var d = e()
                .updateScroll();
            return e()
                .scrollFix(t, t.get()
                    .peer, d), toggleClass(r, "im-chat-input--textarea_has-attaches", u.length > 0), t.get()
                .delayed_message && !(0, x.isAnythingLoading)(t.get()) ? (n([]), !1) : void 0
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
                    els: (0, j.toArray)(geByClass(W)),
                    val: n
                }
            }
        })
    }

    function v(e, t) {
        Emoji.val(e, t), Emoji.focus(e, !0), setTimeout(Emoji.correctCaret.pbind(e), 10)
    }

    function h(e, t) {
        var n = geByClass1(q, t);
        n.innerHTML = getTemplate("im_attach_mess", {
            messages: getLang("mail_title_X_msgs", e.length)
        })
    }

    function b(e, t, n) {
        e.set(x.forwardMessages.bind(null, [], e.get()
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

    function y(e, t, n, r, a, i, s, o, l, u, c) {
        return {
            restoreDraft: function(r) {
                r.get()
                    .rebuilding_draft = !0, e.unchooseMedia(), e.chosenMedias = [], r.get()
                    .rebuilding_draft = !1;
                var i = geByClass1("ms_item_gift", n),
                    s = geByClass1("ms_item_money", n);
                (0, B.isUserPeer)(r.get()
                    .peer) && !r.get()
                    .gid ? show(i, s) : hide(i, s);
                var o = r.get()
                    .peer;
                (0, B.isReservedPeer)(o) || Promise.all([(0, x.getAttaches)(r, o), (0, x.getTextDraft)(o, r.get()), (0, x.getForwardedMessages)(o, r.get())])
                    .then(function(e) {
                        return r.set(x.cleanMediaStore.bind(null, o))
                            .then(function(t) {
                                return e
                            })
                    })
                    .then(function(i) {
                        var s = D(i, 3),
                            l = s[0],
                            u = s[1],
                            c = s[2],
                            d = L(r, o, t);
                        if (!d) {
                            l.length > 0 && show(ge("_im_media_preview"));
                            for (var g = 0; g < l.length; g++) e.chooseMedia.apply(e, l[g]);
                            c.length > 0 ? h(c, n) : geByClass1(q, n)
                                .innerHTML = "", v(t, u);
                            var f = a()
                                .updateScroll();
                            a()
                                .scrollFix(r, o, f)
                        }
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
                L(e, e.get()
                    .peer, t)
            },
            focusOn: function(e) {
                Emoji.editableFocus(t, !1, !0)
            },
            clearText: function(r, i) {
                e.unchooseMedia(), e.chosenMedias = [], Emoji.val(t, ""), i.set(x.saveTextDraft.bind(null, r, "")), i.set(x.cleanMediaStore.bind(null, r)), i.set(x.forwardMessages
                    .bind(null, [], r)), i.set(x.clearAttachToUrl.bind(null, r)), b(i, n, a);
                var s = a()
                    .updateScroll();
                a()
                    .scrollFix(i, i.get()
                        .peer, s)
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
                var t = geByClass1("_im_send", n);
                removeEvent(t, "click", r), (0, R.removeDelegateEvent)(n, "click", "_im_rc_emoji", i), (0, R.removeDelegateEvent)(n, "click", K, o), (0, R.removeDelegateEvent)
                    (n, "click", "_im_will_fwd", l), e.destroy(), u.unmount(), (0, R.removeDelegateEvent)(bodyNode, "click", W, c)
            }
        }
    }

    function C(e, t) {
        return (0, B.isChatPeer)(e) ? t.get()
            .tabs[e].data.kicked : !1
    }

    function E(e, t) {
        if (!(0, B.isUserPeer)(e) && !(0, B.isComunityPeer)(e)) return !1;
        var n = t.get()
            .tabs[e];
        return n.blacklisted
    }

    function T(e, t) {
        return C(e, t) || E(e, t) || (0, B.isLocksAvailable)(t) && (0, B.isPeerBlocked)(e, t) || !I(e, t)
    }

    function w(e, t, n, r) {
        var a = e.get()
            .peer,
            i = Emoji.val(r);
        (0, B.isReservedPeer)(a) || e.get()
            .tabs[a].imdraft == i || T(a, e) || (t.checkMessageURLs(i, !0, H), e.set(x.saveTextDraft.bind(null, a, i)))
    }

    function S(e, t, n, r, a, i) {
        var s = domData(i, "emoji");
        Emoji.addEmoji(e, s), w(t, r, e, n)
    }

    function k(e) {
        var t = e.get()
            .peer;
        if ((0, B.isFullyLoadedTab)(e.get(), t)) {
            var n = e.get()
                .tabs[t];
            Date.now() - (n.lastTyping || 0) > 1e3 * x.TYPING_PERIOD && e.set(x.sendTyping.bind(null, t))
        }
    }

    function I(e, t) {
        return !(0, B.isComunityPeer)(e) || t.get()
            .gid ? !0 : t.get()
            .tabs[e].can_message
    }

    function P(e) {
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

    function L(e, t, n) {
        var r = geByClass1("_im_chat_input_error", a),
            a = gpeByClass("_im_chat_input_parent", n);
        if (T(t, e)) {
            n.disabled = !0;
            var i;
            if (E(t, e)) i = getLang("mail_send_privacy_error");
            else if (C(t, e)) i = getLang("mail_chat_youre_kicked");
            else if (I(t, e)) {
                var s = e.get()
                    .block_states[t].name;
                i = getLang("mail_community_answering")
                    .replace("{username}", s)
            } else i = getLang("mail_cant_send_messages_to_community");
            return addClass(n, "im-chat-input--text_disabled"), addClass(a, "im-chat-input_error"), n.contentEditable = "false", hide(n.previousSibling), val(r, i), !0
        }
        return n.disabled ? (n.disabled = !1, removeClass(a, "im-chat-input_error"), n.contentEditable = "true", removeClass(n, "im-chat-input--text_disabled"), show(n.previousSibling),
            val(r, ""), !1) : !1
    }

    function A(e, t, n) {
        cur.share_timehash = t.get()
            .share_timehash;
        var r = (0, O.createMutations)(y),
            a = r.callMutations,
            i = r.bindMutations,
            s = (0, U.mount)(e, t, a),
            l = g.bind(null, t, n),
            c = (0, F.initQueue)(l, f.bind(null, t), {
                store: "ls",
                key: "im_send_queue_" + vk.id
            }),
            v = c.pushMessage,
            h = c.inspectQueue,
            C = c.resend,
            E = c.setErrored,
            I = c.complete,
            L = o.bind(null, t, n, v, a),
            A = P.bind(null, t);
        hide(geByClass1("ms_items_more_helper", e));
        var D = [
            ["gift", getLang("profile_wall_gift")],
            ["video", getLang("profile_wall_video")],
            ["audio", getLang("profile_wall_audio")],
            ["doc", getLang("profile_wall_doc")],
            ["map", getLang("profile_wall_map")]
        ];
        t.get()
            .moneyTransferAvail && D.unshift(["money", getLang("profile_wall_money")]), D.unshift(["photo", getLang("profile_wall_photo")]);
        var M, N = new MediaSelector(geByClass1(z, e), "_im_media_preview", D, {
                maxShown: 1,
                onAddMediaChange: function(r, a, i, s) {
                    return p(n, t, j, e, r, a, i, s, N)
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
            }),
            j = d.bind(null, t, n, v, e, a, N),
            H = debounce(w.bind(null, t, N), 500),
            G = m(e, t, function(r, a) {
                var i = t.get()
                    .peer,
                    s = Emoji.val(a);
                (0, B.isReservedPeer)(i) || T(i, t) || t.get()
                    .tabs[i].imdraft == s || !s || k(t), H(r, a);
                var o = e.offsetHeight;
                if (M && M !== o) {
                    var l = n()
                        .updateScroll();
                    n()
                        .scrollFix(t, t.get()
                            .peer, l)
                }
                M = o
            }, j, L, s),
            q = j.bind(null, []),
            Q = _.bind(null, t),
            Y = geByClass1("_im_send", e);
        addEvent(Y, "click", q), addEvent(Y, "mouseover", Q), t.get()
            .textMediaSelector = N, t.set(x.initTextStore.bind(null, h, C, E, I));
        var V = (ge("_im_media_preview"), geByClass1("_im_text", e));
        setTimeout(function() {
            a()
                .restoreDraft(t)
        }, 0);
        var Z = S.bind(null, G, t, V, N),
            $ = b.bind(null, t, e, n),
            X = u.bind(null, t);
        return addEvent(geByClass1("_im_text_wrap", e), "click", function() {
                V !== document.activeElement && (window.Emoji ? Emoji.focus : elfocus)(V)
            }), (0, R.addDelegateEvent)(e, "click", "_im_rc_emoji", Z), (0, R.addDelegateEvent)(e, "click", K, $), (0, R.addDelegateEvent)(e, "click", "_im_will_fwd", A),
            (0, R.addDelegateEvent)(bodyNode, "click", W, X), i(N, V, e, q, n, Z, h, $, A, s, X)
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
    var M = n(22),
        O = n(16),
        x = n(1),
        B = n(2),
        F = n(51),
        N = n(93),
        R = n(3),
        j = (n(90), n(10)),
        U = n(85),
        H = 4e3,
        G = 3980,
        z = "_im_media_selector",
        q = "_im_media_fwd",
        K = "_im_fwd_close",
        W = "_im_submit_btn"
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
                return params.photos ? (statlogsValueEvent("upload_photo_fails", 1, data.opts.server, "success"), void onPhotoUploaded(info, params,
                    parentMutations)) : void Upload.onUploadError(info)
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
            onUploadError: function(e, t) {
                statlogsValueEvent("upload_photo_fails", 1, data.opts.server, t), uploadFailed(parentMutations, e, t)
            },
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
    var f = n(1),
        m = n(3),
        p = "_ui_multiselect_cancel"
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }
    var a = n(80),
        i = n(5),
        s = r(i),
        o = n(140),
        l = n(4);
    window.IM = {
        init: function(e) {
            window.Promise || (window.Promise = o.Promise), window.cur.lang.dont_attach = getLang("mail_dont_add_media"), cur.ctrl_submit = e.ctrl_submit, cur.module =
                "im", cur.mutedPeers = e.mutedPeers, cur.gid = e.gid, cur.peer = e.peer, e.blockedFlagUpdates = {}, e.msgid = intval(nav.objLoc.msgid), cur.options = {
                    blacklist_hash: e.thash
                };
            var t = 60 * (new Date)
                .getTimezoneOffset(),
                n = -10800,
                r = n - t,
                i = e.timeshift;
            e.timeshift = i - r, e.unread_dialogs = Object.keys(e.tabs)
                .filter(function(t) {
                    return e.tabs[t].unread > 0
                })
                .map(intval);
            var u = (0, s["default"])(e),
                c = (0, a.mount)(geByClass1("js-im-page", ge("page_body")), u);
            IM.chatPhotoSaved = function(e) {
                curBox() && curBox()
                    .hide();
                var t = (e || {})[1];
                return t ? (cur.pvShown && layers.fullhide(!0, !0), "im" != cur.module || u.get()
                    .peer != t ? nav.go("/im?sel=c" + (t - 2e9)) : void 0) : nav.reload()
            };
            var d = !1;
            Notifier.addRecvClbk("logged_off", "im", function() {
                d || (c.unmount(), Notifier.addRecvClbk("logged_off", "im", function() {}, !0), nav.go("/login"), d = !0)
            }, !0), IM.activateTab = function(e) {
                u.get()
                    .longpoll.push([(0, l.changePeer)(intval(e), !1, !1, !0)])
            }, cur.nav.push(function() {
                var e = c.route.apply(null, arguments);
                return e === !1 || d || (c.unmount(), Notifier.addRecvClbk("logged_off", "im", function() {}, !0), d = !0), e
            })
        }
    };
    try {
        stManager.done("imn.js")
    } catch (u) {}
}, , , function(e, t) {
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
            case f.ARROW_UP:
                r.scroll(a, "up");
                break;
            case f.ARROW_DOWN:
                r.scroll(a, "down");
                break;
            case f.PAGE_UP:
                r.scroll(a, "up", !0);
                break;
            case f.PAGE_DOWN:
                r.scroll(a, "down", !0);
                break;
            case f.PRINTABLE:
                r.focustTxt(e)
        }
    }

    function s(e, t, n, r, a, i) {
        switch (t) {
            case f.ARROW_DOWN:
                r.hoverDialog("next");
                break;
            case f.ARROW_UP:
                r.hoverDialog("prev");
                break;
            case f.ENTER:
                (!(0, g.isEditableFocused)() || gpeByClass("_im_dialogs_search_input", document.activeElement)) && r.selectHoveredDialog(i);
                break;
            case f.PRINTABLE:
                a.focusInput(i)
        }
    }

    function o(e, t, n, r, a) {
        switch (t) {
            case f.PAGE_UP:
            case f.PAGE_DOWN:
                i(e, t, n, r, a)
        }
    }

    function l(e, t, n, r, a) {
        switch (t) {
            case f.ARROW_DOWN:
                break;
            case f.ARROW_UP:
                break;
            case f.ENTER:
                gpeByClass("_im_dialogs_creation_name", document.activeElement) && r.confirmCreate(a);
                break;
            case f.PRINTABLE:
                r.focusSearch(a)
        }
    }

    function u(e, t, n, r, u, c) {
        var g = (0, d["default"])({
            state: t || "default"
        });
        return {
            signal: function(t, a) {
                switch (g.get()
                    .state) {
                    case "default":
                        return i(g, t, a, r, e);
                    case "fwd":
                    case "search":
                        return s(g, t, a, n, u, e);
                    case "create":
                        return l(g, t, a, c, e);
                    case "message":
                        return o(g, t, a, r, e);
                    default:
                        throw new Error("Unknown state: " + g.get()
                            .state)
                }
            },
            transition: function(e) {
                return g.set(a.bind(null, e))
            }
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), t.create = u;
    var c = n(5),
        d = r(c),
        g = n(2),
        f = n(37)
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
    var f = n(56),
        m = r(f),
        p = n(25),
        _ = new m["default"],
        v = !1
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
}, , , , , , , , , , , , , , , , , function(e, t) {
    e.exports = function(e) {
        if ("function" != typeof e) throw TypeError(e + " is not a function!");
        return e
    }
}, function(e, t, n) {
    var r = n(8)("unscopables"),
        a = Array.prototype;
    void 0 == a[r] && n(14)(a, r, {}), e.exports = function(e) {
        a[r][e] = !0
    }
}, function(e, t, n) {
    var r = n(34),
        a = n(70),
        i = n(132);
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
    "use strict";
    var r = n(20)
        .f,
        a = n(67),
        i = (n(14), n(68)),
        s = n(31),
        o = n(57),
        l = n(32),
        u = n(63),
        c = n(41),
        d = n(65),
        g = n(130),
        f = n(12),
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
    "use strict";
    var r = n(9),
        a = n(62),
        i = n(21),
        s = n(68),
        o = n(66),
        l = n(63),
        u = n(57),
        c = n(15),
        d = n(33),
        g = n(121),
        f = n(43),
        m = n(116);
    e.exports = function(e, t, n, p, _, v) {
        var h = r[e],
            b = h,
            y = _ ? "set" : "add",
            C = b && b.prototype,
            E = {},
            T = function(e) {
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
            }), b.prototype = C, C.constructor = b), (k || P) && (T("delete"), T("has"), _ && T("get")), (P || S) && T(y), v && C.clear && delete C.clear
        } else b = p.getConstructor(t, e, _, y), s(b.prototype, n), o.NEED = !0;
        return f(b, e), E[e] = b, a(a.G + a.W + a.F * (b != h), E), v || p.setStrong(b, e, _), b
    }
}, function(e, t, n) {
    e.exports = n(9)
        .document && document.documentElement
}, function(e, t, n) {
    var r = n(15),
        a = n(129)
        .set;
    e.exports = function(e, t, n) {
        var i, s = t.constructor;
        return s !== n && "function" == typeof s && (i = s.prototype) !== n.prototype && r(i) && a && a(e, i), e
    }
}, function(e, t, n) {
    var r = n(59);
    e.exports = Object("z")
        .propertyIsEnumerable(0) ? Object : function(e) {
            return "String" == r(e) ? e.split("") : Object(e)
        }
}, function(e, t, n) {
    var r = n(24),
        a = n(8)("iterator"),
        i = Array.prototype;
    e.exports = function(e) {
        return void 0 !== e && (r.Array === e || i[a] === e)
    }
}, function(e, t, n) {
    var r = n(19);
    e.exports = function(e, t, n, a) {
        try {
            return a ? t(r(n)[0], n[1]) : t(n)
        } catch (i) {
            var s = e["return"];
            throw void 0 !== s && r(s.call(e)), i
        }
    }
}, function(e, t, n) {
    "use strict";
    var r = n(67),
        a = n(42),
        i = n(43),
        s = {};
    n(14)(s, n(8)("iterator"), function() {
        return this
    }), e.exports = function(e, t, n) {
        e.prototype = r(s, {
            next: a(1, n)
        }), i(e, t + " Iterator")
    }
}, function(e, t, n) {
    var r = n(8)("iterator"),
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
}, function(e, t) {
    e.exports = !1
}, function(e, t, n) {
    var r = n(20),
        a = n(19),
        i = n(127);
    e.exports = n(12) ? Object.defineProperties : function(e, t) {
        a(e);
        for (var n, s = i(t), o = s.length, l = 0; o > l;) r.f(e, n = s[l++], t[n]);
        return e
    }
}, function(e, t, n) {
    var r = n(128),
        a = n(42),
        i = n(34),
        s = n(71),
        o = n(13),
        l = n(64),
        u = Object.getOwnPropertyDescriptor;
    t.f = n(12) ? u : function(e, t) {
        if (e = i(e), t = s(t, !0), l) try {
            return u(e, t)
        } catch (n) {}
        return o(e, t) ? a(!r.f.call(e, t), e[t]) : void 0
    }
}, function(e, t, n) {
    var r = n(13),
        a = n(133),
        i = n(44)("IE_PROTO"),
        s = Object.prototype;
    e.exports = Object.getPrototypeOf || function(e) {
        return e = a(e), r(e, i) ? e[i] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? s : null
    }
}, function(e, t, n) {
    var r = n(13),
        a = n(34),
        i = n(112)(!1),
        s = n(44)("IE_PROTO");
    e.exports = function(e, t) {
        var n, o = a(e),
            l = 0,
            u = [];
        for (n in o) n != s && r(o, n) && u.push(n);
        for (; t.length > l;) r(o, n = t[l++]) && (~i(u, n) || u.push(n));
        return u
    }
}, function(e, t, n) {
    var r = n(126),
        a = n(61);
    e.exports = Object.keys || function(e) {
        return r(e, a)
    }
}, function(e, t) {
    t.f = {}.propertyIsEnumerable
}, function(e, t, n) {
    var r = n(15),
        a = n(19),
        i = function(e, t) {
            if (a(e), !r(t) && null !== t) throw TypeError(t + ": can't set as prototype!")
        };
    e.exports = {
        set: Object.setPrototypeOf || ("__proto__" in {} ? function(e, t, r) {
            try {
                r = n(31)(Function.call, n(124)
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
    "use strict";
    var r = n(9),
        a = n(20),
        i = n(12),
        s = n(8)("species");
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
    var r = n(45),
        a = n(32);
    e.exports = function(e) {
        return function(t, n) {
            var i, s, o = String(a(t)),
                l = r(n),
                u = o.length;
            return 0 > l || l >= u ? e ? "" : void 0 : (i = o.charCodeAt(l), 55296 > i || i > 56319 || l + 1 === u || (s = o.charCodeAt(l + 1)) < 56320 || s >
                57343 ? e ? o.charAt(l) : i : e ? o.slice(l, l + 2) : (i - 55296 << 10) + (s - 56320) + 65536)
        }
    }
}, function(e, t, n) {
    var r = n(45),
        a = Math.max,
        i = Math.min;
    e.exports = function(e, t) {
        return e = r(e), 0 > e ? a(e + t, 0) : i(e, t)
    }
}, function(e, t, n) {
    var r = n(32);
    e.exports = function(e) {
        return Object(r(e))
    }
}, function(e, t, n) {
    var r = n(58),
        a = n(8)("iterator"),
        i = n(24);
    e.exports = n(30)
        .getIteratorMethod = function(e) {
            return void 0 != e ? e[a] || e["@@iterator"] || i[r(e)] : void 0
        }
}, function(e, t, n) {
    "use strict";
    var r = n(111),
        a = n(65),
        i = n(24),
        s = n(34);
    e.exports = n(41)(Array, "Array", function(e, t) {
        this._t = s(e), this._i = 0, this._k = t
    }, function() {
        var e = this._t,
            t = this._k,
            n = this._i++;
        return !e || n >= e.length ? (this._t = void 0, a(1)) : "keys" == t ? a(0, n) : "values" == t ? a(0, e[n]) : a(0, [n, e[n]])
    }, "values"), i.Arguments = i.Array, r("keys"), r("values"), r("entries")
}, function(e, t, n) {
    "use strict";
    var r = n(113);
    e.exports = n(114)("Map", function(e) {
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
    var r = n(58),
        a = {};
    a[n(8)("toStringTag")] = "z", a + "" != "[object z]" && n(21)(Object.prototype, "toString", function() {
        return "[object " + r(this) + "]"
    }, !0)
}, function(e, t, n) {
    "use strict";
    var r = n(131)(!0);
    n(41)(String, "String", function(e) {
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
    for (var r = n(135), a = n(21), i = n(9), s = n(14), o = n(24), l = n(8), u = l("iterator"), c = l("toStringTag"), d = o.Array, g = ["NodeList", "DOMTokenList",
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
                Q = e
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
                    W(p)
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
                for (var e = 0; Z > e; e += 2) {
                    var t = re[e],
                        n = re[e + 1];
                    t(n), re[e] = void 0, re[e + 1] = void 0
                }
                Z = 0
            }

            function _() {
                try {
                    var e = n(144);
                    return W = e.runOnLoop || e.runOnContext, d()
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

            function E(e) {
                try {
                    return e.then
                } catch (t) {
                    return ue.error = t, ue
                }
            }

            function T(e, t, n, r) {
                try {
                    e.call(t, n, r)
                } catch (a) {
                    return a
                }
            }

            function w(e, t, n) {
                $(function(e) {
                    var r = !1,
                        a = T(n, t, function(n) {
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
                e === t ? A(e, y()) : s(t) ? k(e, t, E(t)) : L(e, t)
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

            function O() {
                this.error = null
            }

            function x(e, t) {
                try {
                    return e(t)
                } catch (n) {
                    return ce.error = n, ce
                }
            }

            function B(e, t, n, r) {
                var a, i, s, l, u = o(n);
                if (u) {
                    if (a = x(n, r), a === ce ? (l = !0, i = a.error, a = null) : s = !0, t === a) return void A(t, C())
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
                if (!V(e)) return A(a, new TypeError("You must pass an array to race.")), a;
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
            var W, Q, Y, V = K,
                Z = 0,
                $ = function(e, t) {
                    re[Z] = e, re[Z + 1] = t, Z += 2, 2 === Z && (Q ? Q(p) : Y())
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
                ue = new O,
                ce = new O,
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
                    var a = E(e);
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
            n(141)
                .amd ? (r = function() {
                    return he
                }.call(t, n, t, i), !(void 0 !== r && (i.exports = r))) : "undefined" != typeof i && i.exports ? i.exports = he : "undefined" != typeof this && (
                    this.ES6Promise = he), ve()
        })
        .call(this)
    })
    .call(t, n(143), function() {
        return this
    }(), n(142)(e))
}, function(e, t) {
    e.exports = function() {
        throw new Error("define cannot be used indirect")
    }
}, function(e, t) {
    e.exports = function(e) {
        return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children = [], e.webpackPolyfill = 1), e
    }
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
}, function(e, t) {}]);
