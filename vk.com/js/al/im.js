window._iconAdd || (window._iconAdd = window.devicePixelRatio >= 2 ? "_2x" : ""), window._la || (window._la = 0);
var IM = {
    FOLDER_UNRESPOND: 2,
    FOLDER_IMPORTANT: 1,
    LOCK_TIMEOUT: 5e4,
    updateCounts: function(e) {
        if (e && e.length) {
            cur.gid || handlePageCount("msg", e[0]);
            var r = ge("im_filter_out_groups");
            if (cur.unr && cur.nu) {
                var i = ge("im_sum");
                e[0] > 0 ? val(i, getLang("mail_n_unread_dialogs", e[0])) : IM.switchUnr(0, 0), r && e[0] <= 0 && cur.gid && IM.gfilter("all", geByClass1(
                    "_tab_gfilter_all", r)), toggleClass(i, "unshown", e[0] <= 0), toggleClass(domNS(i), "unshown", e[0] <= 0)
            }
            r && e[0] <= 0 && cur.gid && hide(geByClass1("_tab_gfilter_unread", r)
                .parentNode), e.length > 1 && (val("im_important_count", e[1] ? e[1] : ""), toggle("im_important_btn", e[1] && -1 == cur.peer), val("im_spam_cnt", e[3] ?
                " +" + e[3] : ""), toggle("im_spam_link", e[2]))
        }
    },
    switchImportance: function(e, r, i) {
        cur.peer === i && toggleClass(geByClass1("_add_to_fav"), "im_dialog_fav_active", r), e && (toggleClass(e.parentNode, "dialogs_star_wrap_active", r), toggleClass(ge(
            "im_dialog" + i), "dialogs_row_important", r))
    },
    gfilter: function(e, r) {
        switch (e) {
            case "all":
                cur.unr = 0, e = void 0;
                break;
            case "unread":
                cur.unr = 1, e = void 0;
                break;
            default:
                cur.unr = 0
        }
        cur.gfilter = e, IM.updateDialogs(!0), IM.updateLoc();
        var i = geByClass1("summary_tab_sel", "im_filter_out_groups");
        removeClass(i, "summary_tab_sel"), addClass(i, "summary_tab"), removeClass(r.parentNode, "summary_tab"), addClass(r.parentNode, "summary_tab_sel")
    },
    markImportant: function(e, r, i) {
        return r ? (i ^= 1, IM.switchImportance(geByClass1("_dialogs_star", r), i, e), r.setAttribute("data-important", i), cur.tabs[e] && (i ? cur.tabs[e].folders = cur.tabs[
            e].folders | i : cur.tabs[e].folders = cur.tabs[e].folders & (15 ^ IM.FOLDER_IMPORTANT)), i) : void 0
    },
    starDialogD: function(e, r) {
        this.starDialog(r), setTimeout(function() {
            triggerEvent(e, "mouseout")
        })
    },
    starDialog: function(e) {
        var r, i = ge("im_dialog" + e);
        return r = cur.tabs[e] ? cur.tabs[e].folders & IM.FOLDER_IMPORTANT : parseInt(i.getAttribute("data-important")), r = IM.markImportant(e, i, r), ajax.post(
            "al_im.php", {
                act: "a_dialog_star",
                peer: e,
                gid: cur.gid,
                val: r
            }, {
                onDone: function(r, t) {
                    t || IM.markImportant(e, i, r)
                }.pbind(r)
            }), r
    },
    updateUnreadMsgs: function() {
        cur.unreadMsgs = 0;
        var e, r;
        for (e in cur.tabs) r = intval(cur.tabs[e].unread), r > 0 && cur.peer != e ? val("im_unread" + e, '&nbsp;<span class="im_unread">+' + r + "</span>") : val(
            "im_unread" + e, ""), cur.unreadMsgs += r;
        cur.unreadMsgs && cur.gid && show(geByClass1("_tab_gfilter_unread")
            .parentNode), cur.gid || val("im_unread_count", cur.unreadMsgs ? "+" + cur.unreadMsgs : ""), toggleClass(ge("tab_conversation"), "count", IM.r() && cur.unreadMsgs)
    },
    peerToId: function(e) {
        return e > 2e9 ? "c" + (e - 2e9) : !IM.r(e) && -2e9 > e ? "e" + (-e - 2e9) : e
    },
    idToPeer: function(e) {
        var r = (e + "")
            .charAt(0);
        return "c" == r ? 2e9 + intval(e.substr(1)) : "e" == r ? -2e9 - intval(e.substr(1)) : intval(e)
    },
    fullQ: function() {
        return (cur.qPeer ? "in:" + IM.peerToId(cur.qPeer) + " " : "") + (cur.qDay ? "day:" + cur.qDay + " " : "") + cur.searchQ
    },
    setFullQ: function(e) {
        e = e || "";
        var r = e.match(/^in\:([ce]?\d+)\s+/);
        r ? (cur.qPeer = IM.idToPeer(r[1]), val("im_filter", cur.lastSearchQ = cur.searchQ = e = e.replace(/^in\:[ce]?\d+\s+/, ""))) : cur.qPeer = !1;
        var i = e.match(/^day\:(\d{8})\s*/);
        i ? (cur.qDay = i[1], val("im_filter", cur.lastSearchQ = cur.searchQ = e = e.replace(/^day\:\d{8}\s*/, ""))) : cur.qDay = !1
    },
    dayFromVal: function(e) {
        var r = e.split(".");
        return (r[0] < 10 ? "0" : "") + r[0] + (r[1] < 10 ? "0" : "") + r[1] + r[2]
    },
    updateLoc: function(e, r) {
        cur.peer != cur.prev_peer && !IM.r(cur.prev_peer) && cur.gid && cur.prev_peer && IM.lockRelease(cur.prev_peer);
        var i = [],
            t = {
                0: 0 === cur.gid ? "im" : nav.objLoc[0]
            }; - 2 == cur.peer ? t.q = IM.fullQ() : -1 == cur.peer ? cur.unr && (t.unread = 1) : t.sel = IM.peerToId(cur.peer);
        var a = nav.strLoc;
        for (var s in cur.tabs) cur.peer != s && i.push(IM.peerToId(s));
        return i.length && (t.peers = i.join("_")), r > 0 && ge("mess" + r) && (t.msgid = r), cur.gfilter && (t.folder = cur.gfilter), e ? nav.toStr(t) : void(t != a && (
            clearTimeout(cur.setLocTO), cur.setLocTO = setTimeout(function() {
                nav.strLoc == a && nav.setLoc(t)
            }, 500)))
    },
    scroll: function(e, r, i) {
        if (cur.fixedScroll || IM.r()) {
            var t = 0,
                a = r > 0 ? ge("mess" + r) : 0 > r ? ge("im_unread_bar" + cur.peer) : !1;
            if (cur.tabs[cur.peer] && cur.tabs[cur.peer].q_offset && !a) return;
            if (!e) {
                var s, o = Math.max(intval(window.innerHeight), intval(document.documentElement.clientHeight)),
                    n = cur.imEl.cont.offsetHeight,
                    c = cur.imEl.head.clientHeight,
                    l = cur.imEl.nav.offsetHeight,
                    d = a ? a.offsetHeight : 0,
                    u = getXY(a)[1];
                d > 0 ? (s = o - c - l - cur.imEl.controls.offsetHeight - 34, t = d > s + 20 || 20 > s ? u - c - l - 10 : r > 0 || d > s + 10 ? u - Math.floor((s - d) / 2) -
                    c - l : u - c - l - 10, i === !0 && r > 0 && (animate(a, {
                        backgroundColor: "#EDF1F5"
                    }, 200, function() {
                        a.hltt = setTimeout(function() {
                            animate(a, {
                                backgroundColor: "#FFF"
                            }, 1e3, setStyle.pbind(a, {
                                backgroundColor: ""
                            }))
                        }, 1e3)
                    }), IM.updateLoc(!1, r))) : t = n - o + c + l
            }
            scrollToY(t, 0)
        } else cur.imEl.rows.scrollTop = e ? 0 : cur.imEl.rows.scrollHeight;
        IM.updateScroll(!0)
    },
    contSH: function() {
        return Math.max(intval(bodyNode.scrollHeight), intval(pageNode.scrollHeight), intval(htmlNode.scrollHeight))
    },
    scrollAppended: function(e, r) {
        var i = cur.tabs[cur.peer];
        if (!i || !i.q_offset) {
            if (!cur.fixedScroll) return IM.scrollOn();
            e = 0;
            var t = Math.max(intval(window.innerHeight), intval(document.documentElement.clientHeight)),
                a = scrollGetY(!0),
                s = IM.contSH(),
                o = !1,
                n = i && i.firstUnr && ge("mess" + i.firstUnr),
                c = a > s - t - (e || 0) - 200;
            if (cur.nu && c) {
                if (2 === r && re("im_unread_bar" + cur.peer), n) {
                    var l = getXY(n)[1],
                        d = s - t + cur.imEl.head.clientHeight + cur.imEl.nav.offsetHeight + 10 + 49;
                    d > l && (o = !0, c = !1)
                }
                c && 1 === r && (re("im_unread_bar" + cur.peer), delete i.firstUnr)
            }
            if (IM.updateScroll(!c), o) {
                var u = ge("im_log" + cur.peer);
                !ge("im_unread_bar" + cur.peer) && u && (extend(extend(u.insertRow(n.rowIndex), {
                        id: "im_unread_bar" + cur.peer,
                        className: "im_unread_bar_tr"
                    })
                    .insertCell(0), {
                        colSpan: 5,
                        className: "im_unread_bar_td",
                        innerHTML: '<div class="im_unread_bar">  <span class="im_unread_bar_wrap"><span class="im_unread_bar_text">' + getLang(
                            "mail_new_unread_msgs") + "</span></span></div>"
                    }), removeClass(n, "im_add_row")), window.scroll(scrollGetX(), getXY(n)[1] - cur.imEl.head.clientHeight - cur.imEl.nav.offsetHeight - 10 - 49)
            }
        }
    },
    scrollOn: function(e, r) {
        cur.tabs[cur.peer] && cur.tabs[cur.peer].q_offset && (!r || r > 0 && !ge("mess" + r) || 0 > r && !ge("im_unread_bar" + cur.peer)) || (clearTimeout(cur.scrollTO),
            IM.scroll(e, r, !0), cur.scrollTO = setTimeout(IM.scroll.bind(IM)
                .pbind(e, r), 100))
    },
    error: function(e, r) {
        if (!IM.r()) {
            var i = ge("im_error" + (r || cur.peer));
            i && (i.innerHTML = e, show(i), IM.scrollOn())
        }
    },
    mkdate: function(e) {
        var r = new Date(1e3 * e),
            i = new Date,
            t = function(e) {
                return (e + "")
                    .length < 2 ? "0" + e : e
            };
        return r.getDay() == i.getDay() ? t(r.getHours()) + ":" + t(r.getMinutes()) + ":" + t(r.getSeconds()) : t(r.getDate()) + "." + t(r.getMonth() + 1) + "." + (r.getFullYear() +
                "")
            .substr(2)
    },
    mknotonline: function(e, r) {
        return e && 2 != e ? lang.mail_im_not_online[2].replace("{user}", r)
            .replace(/\..+$/, ".") : lang.mail_im_not_online[1].replace("{user}", r)
            .replace(/\..+$/, ".")
    },
    updateOnline: function(e, r) {
        var i = "";
        e && (i = langSex(r, window.global_online_sm), e > 0 && 6 > e && (i += '<b class="mob_onl im_status_mob_onl" onmouseover="mobileOnlineTip(this, {mid: ' + cur.peer +
            '})" onclick="mobilePromo()"></b>')), val("im_status_holder", i), e && IM.hideLastAct(cur.peer)
    },
    getAdminName: function(e, r, i) {
        return vk.id !== e ? getLang("mail_by_who_nw")
            .replace("{user_href}", '<a href="' + i + '" target="_blank">' + r + "</a>") : getLang("mail_by_who_nw")
            .replace("{user_href}", r)
    },
    updateAdminName: function(e, r) {
        ajax.post("al_im.php", {
            act: "a_get_admin",
            admin: r,
            gid: cur.gid
        }, {
            onDone: function(e, r, i, t) {
                var a = ge("mess" + e),
                    s = geByClass1("im_date_link", a);
                s.innerHTML = IM.getAdminName(r, i, t) + s.innerHTML, cur.admins[r] = [i, t]
            }.pbind(e, r)
        })
    },
    getTable: function(e) {
        return ge("im_log" + e)
    },
    goodTitle: function(e, r) {
        return 2e9 > r && e && !e.match(/^\s*(Re(\(\d*\))?\:)?\s*\.\.\.\s*$/)
    },
    addMsg: function(e, r, i, t, a, s, o, n, c, l) {
        var d = !!ge("mess" + i);
        d && re("mess" + i);
        var u, m, _, g, p = n ? IM.mkdate(n) : "",
            f = cur.tabs[e].data,
            h = c.from || !1,
            v = 4 == t && !a,
            b = IM.needMark(e),
            M = "";
        if (cur.gid && c.from_admin && (-1 == r ? u = getLang("mail_groups_by_you") : (m = intval(c.from_admin), g = m === vk.id, g ? (u = getLang("mail_groups_by_you"), _ =
                cur.real_author_link) : cur.admins[m] && (u = cur.admins[m][0], _ = cur.admins[m][1])), u ? M = IM.getAdminName(m, u, _) : IM.updateAdminName(i, m)), !l &&
            !d && i > 0 && (++cur.tabs[e].msg_count, !a && t > 1 && (cur.nu ? intval(cur.tabs[e].unr[i]) <= 0 && (++cur.tabs[e].unread, cur.tabs[e].unr[i] = 1) : ++cur.tabs[
                e].unread, !b && cur.nu))) {
            var w = ge("im_dialog" + e),
                I = w ? intval(w.getAttribute("data-unread")) : 0;
            w && w.setAttribute("data-unread", ++I)
        }
        if (e > 2e9 && 2e9 > h && h && !f.members[h]) return i > 0 && c.source_act && !c._no_media_load && IM.loadMedia(i, e), void(l || (cur.tabs[e].delayed.push([e, r, i,
            t, a, s, o, n, c, !0
        ]), IM.updateChat(e)));
        if (cur.tabs[e] && cur.tabs[e].q_offset) {
            var y = intval(domLC(geByTag1("tbody", ge("im_log" + e)))
                .id.replace(/^mess/, ""));
            return void(y && i > y && (++cur.tabs[e].q_offset, !a && t > 1 && (!cur.nu || cur.tabs[e].inUpto < i) && (cur.tabs[e].q_new_cnt ? ++cur.tabs[e].q_new_cnt : cur
                .tabs[e].q_new_cnt = 1, cur.tabs[e].q_new[i] = 1), IM.updateMoreNew(e)))
        }
        nav.objLoc.msgid && !cur.setLocTO && IM.updateLoc(), !a && t > 1 && cur.focused != e && !inArray(e, cur.mutedPeers) && IM.notify(e, [t, a, s, o, n, c]);
        var k = 1,
            T = "",
            C = "sticker" == c.attach1_type;
        if (C) T = c.attach1_product_id ? '<div class="im_sticker_row"><a onmouseover="return Emoji.stickerOver(' + intval(c.attach1) +
            ', this);" onclick="return Emoji.clickSticker(' + intval(c.attach1_product_id) + ', this, event);"><img height="128" class="im_gift" src="/images/stickers/' +
            intval(c.attach1) + "/" + (window.devicePixelRatio >= 2 ? "256" : "128") + '.png"/></a></div>' :
            '<div class="im_sticker_row"><img height="128" class="im_gift" src="/images/stickers/' + intval(c.attach1) + "/" + (window.devicePixelRatio >= 2 ? "256" :
                "128") + '.png"/></div>';
        else
            for (; c["attach" + k + "_type"];) T += '<div class="progress im_media_progress im_' + c["attach" + k + "_type"] + '_filler" style="display: block;"></div>', k++;
        var x = h || (a ? cur.id : e),
            L = IM.getServiceMsg(e, x, c);
        L === !0 && (L = '<div id="im_msg_media' + i + '" class="wall_module"></div>', i > 0 && !c._no_media_load && IM.loadMedia(i, e)), L || (o = (o || "")
            .replace(
                /(^|[^A-Za-z0-9�-��-���\-\_])(https?:\/\/)?((?:[A-Za-z\$0-9�-��-���](?:[A-Za-z\$0-9\-\_�-��-���]*[A-Za-z\$0-9�-��-���])?\.){1,5}[A-Za-z\$��������������������������������\-\d]{2,22}(?::\d{2,5})?)((?:\/(?:(?:\&amp;|\&#33;|,[_%]|[A-Za-z0-9�-��-���\-\_#%?+\/\$.~=;:]+|\[[A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\))*(?:,[_%]|[A-Za-z0-9�-��-���\-\_#%?+\/\$.~=;:]*[A-Za-z0-9�-��-���\_#%?+\/\$~=]|\[[A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9�-��-���\-\_#%?+\/\$.,~=;:]*\)))?)?)/gi,
                function() {
                    var e = Array.prototype.slice.apply(arguments),
                        r = e[1] || "",
                        i = e[2] || "http://",
                        t = e[3] || "",
                        a = t + (e[4] || ""),
                        s = (e[2] || "") + e[3] + e[4];
                    if (-1 == t.indexOf(".") || -1 != t.indexOf("..")) return e[0];
                    var o = t.split(".")
                        .pop();
                    if ((o.length > 7 || -1 == indexOf(
                            "camera,info,name,academy,aero,arpa,coop,media,museum,mobi,travel,xxx,asia,biz,com,net,org,gov,mil,edu,int,tel,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,ax,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cd,cf,cg,ch,ci,ck,cl,cm,cn,co,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,er,es,et,eu,fi,fj,fk,fm,fo,fr,ga,gd,ge,gf,gg,gh,gi,gl,gm,gn,gp,gq,gr,gs,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,im,in,io,iq,ir,is,it,je,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,mk,ml,mm,mn,mo,mp,mq,mr,ms,mt,mu,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,ps,pt,pw,py,qa,re,ro,ru,rs,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,ss,st,su,sv,sx,sy,sz,tc,td,tf,tg,th,tj,tk,tl,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,um,us,uy,uz,va,vc,ve,vg,vi,vn,vu,wf,ws,ye,yt,yu,za,zm,zw,��,���,����,������,���,����,cat,pro,local"
                            .split(","), o)) && (!/^[a-zA-Z]+$/.test(o) || !e[2])) return e[0];
                    if (-1 != e[0].indexOf("@")) return e[0];
                    try {
                        s = decodeURIComponent(s)
                    } catch (n) {}
                    if (s.length > 55 && (s = s.substr(0, 53) + ".."), s = clean(s)
                        .replace(/&amp;/g, "&"), !v && t.match(/^([a-zA-Z0-9\.\_\-]+\.)?(vkontakte\.ru|vk\.com|vkadre\.ru|vshtate\.ru|userapi\.com|vk\.me)$/)) {
                        a = replaceEntities(a)
                            .replace(/([^a-zA-Z0-9#%;_\-.\/?&=\[\]])/g, encodeURIComponent);
                        var c, l = a,
                            d = a.indexOf("#/"),
                            u = "";
                        return d >= 0 ? l = a.substr(d + 1) : (d = a.indexOf("#!"), d >= 0 && (l = "/" + a.substr(d + 2)
                                .replace(/^\//, ""))), c = l.match(/^(?:https?:\/\/)?(?:vk\.com|vkontakte\.ru)?\/([a-zA-Z0-9\._]+)\??$/), c && c[1].length < 32 && (u =
                                ' mention_id="' + c[1] + '" onclick="return mentionClick(this, event)" onmouseover="mentionOver(this)"'), r + '<a href="' + (i + a)
                            .replace(/"/g, "&quot;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;") + '" target="_blank"' + u + ">" + s + "</a>"
                    }
                    return r + '<a href="away.php?utf=1&to=' + encodeURIComponent(i + replaceEntities(a)) + '" target="_blank" onclick="return goAway(\'' + clean(i + a) +
                        "', {}, event);\">" + s + "</a>"
                }), o = o.replace(/([a-zA-Z\-_\.0-9]+@[a-zA-Z\-_0-9]+\.[a-zA-Z\-_\.0-9]+[a-zA-Z\-_0-9]+)/g, function(e) {
                return '<a href="/write?email=' + e + '" target="_blank">' + e + "</a>"
            }), c.emoji && (o = Emoji.emojiToHTML(o, !0)), o = '<div class="im_msg_text">' + o + "</div>", c.geo && (T +=
                '<div class="progress im_media_progress im_map_filler" style="display: block;"></div>'), c.fwd && (T +=
                '<div class="progress im_media_progress im_forward_filler" style="display: block;"></div>'), T && (o += '<div id="im_msg_media' + i +
                '" class="wall_module">' + T + "</div>"), i > 0 && !c._no_media_load && (T || c.source_act) && !C && IM.loadMedia(i, e), IM.goodTitle(s, e) && (o =
                '<div class="im_subj">' + s + "</div>" + o), v && (o = rs(cur.susp_msg, {
                msg_id: i,
                message: o
            })));
        var S, E = IM.getTable(e),
            D = E.rows.length;
        if (-1 == r) S = D;
        else if (r) {
            var P = ge("mess" + r);
            S = Math.min(D, P.rowIndex + 1)
        } else S = 0;
        var N = [a ? "im_out" : "im_in"];
        L && N.push("im_chat_event"), t > 1 && (a || !cur.nu) && N.push("im_new_msg");
        var j = L ? !0 : IM.getMsgInfo(i, c);
        !(S && E.rows[S - 1].getAttribute("data-from") == x && n - intval(E.rows[S - 1].getAttribute("data-date")) < 300) || hasClass(E.rows[S - 1], "im_chat_event") ||
            cur.gid && c.from_admin && cur.last_admin != c.from_admin || j || N.push("im_add_row"), S < E.rows.length && E.rows[S].getAttribute("data-from") == x && intval(
                E.rows[S].getAttribute("data-date")) - n < 300 && removeClass(E.rows[S], "im_add_row"), S == D && (IM.readPeer(e, i > 0 ? i - 1 : 0, !a), D > E.rows.length &&
                (S = D = E.rows.length)), c.from_admin && -1 != r && (cur.last_admin = c.from_admin);
        var H, B, O = E.insertRow(S);
        if (O.setAttribute("data-date", n), O.setAttribute("data-from", x), O.id = "mess" + i, O.className = N.join(" "), L) extend(O.insertCell(0), {
            colSpan: 5,
            className: "im_srv_msg_td",
            innerHTML: '<div class="im_srv_msg">' + L + "</div>"
        });
        else {
            if (f && h && (H = f.members[h])) H = [H.link, H.photo, H.name];
            else if (a) {
                var F = cur.author_link || "/id" + cur.id;
                H = [F, cur.photo, cur.name]
            } else {
                var F = cur.tabs[e].href || "/id" + x,
                    q = cur.tabs[e].photo,
                    U = cur.tabs[e].name; - 2e9 > x ? (e > 2e9 ? (U = "Unknown", F = "/im?sel=c" + (e - 2e9)) : F = "/im?sel=e" + (-x - 2e9), q = "/images/contact_50.gif") :
                    e > 2e9 && (U = "Unknown", q = "/images/camera_c.gif"), H = [F, q, U]
            }
            B = '<div class="im_log_author_chat_thumb"><a href="' + H[0] + '" target="_blank"><img src="' + H[1] +
                '" class="im_log_author_chat_thumb" width="32" height="32"/></a></div>', o = '<div class="im_log_author_chat_name"><a href="' + H[0] +
                '" class="mem_link" target="_blank">' + H[2] + "</a>" + j + "</div>" + o;
            var A = "";
            i > 0 ? (A = '<div id="ma' + i + '" class="im_log_check_wrap"><div class="im_log_check" id="mess_check' + i + '"></div></div>', addEvent(O, "mouseover", IM.logMessState
                .pbind(1, i)), addEvent(O, "mouseout", IM.logMessState.pbind(0, i)), O.onclick = function(e) {
                IM.checkLogClick(this, e || window.event) || IM.checkLogMsg(i)
            }) : A = '<div id="ma' + i + '" style="visibility: visible;"><div class="progress" id="mprg' + i + '"></div></div>', extend(O.insertCell(0), {
                className: "im_log_act",
                innerHTML: A
            }), extend(O.insertCell(1), {
                className: "im_log_author",
                innerHTML: B
            }), extend(O.insertCell(2), {
                className: "im_log_body",
                innerHTML: '<div class="wrapped">' + o + "</div>"
            });
            var R = cur.gid ? "gim" + cur.gid + "?msgid=" + i + "&sel=" + cur.peer : "mail?act=show&id=" + i,
                W = i > 0 ? '<a class="im_important_toggler" onclick="return IM.toggleImportant(' + i +
                ');" onmouseover="IM.showImportantTT(this);"></a><div class="im_date_link">' + M + '<a href="/' + R + '">' + p + "</a></div>" :
                '<span class="im_date_link">' + M + p + "</span>";
            extend(O.insertCell(3), {
                    className: "im_log_date",
                    innerHTML: W
                }), O.insertCell(4)
                .className = "im_log_rspacer", t > 1 && !a && !cur.nu && addEvent(O, "mouseover", IM.onNewMsgOver.pbind(e, i))
        }
        hide("im_none" + e), show("im_log" + e);
        var z = cur.nu && a;
        if (a || (b && (IM.markPeer(e), z = 1), IM.hideLastAct(e)), S == D && cur.peer == e) {
            var Y = cur.tabs[e];
            cur.nu && (a ? delete Y.firstUnr : Y.unread && (Y.firstUnr && ge("mess" + Y.firstUnr) || (Y.firstUnr = i, z = 2))), IM.scrollAppended(O.offsetHeight, z)
        }
    },
    notify: function(e, r) {
        var i, t, a, s = IM.goodTitle(r[2], e) && r[2] || "";
        if (message = (s ? s + " " : "") + r[3] || "", peer_data = cur.tabs[e].data, actual_peer = r[3].match(/<\*>from:(\d+)/), (!cur.notify_msg && 2e9 > e || cur.gid) &&
            Notifier.playSound({
                author_id: r[4]
            }), peer_data) {
            if (message = trim(replaceEntities(stripHTML(message.replace(/<br>/g, "\n")
                    .replace(/<\*>.*$/, "")))), actual_peer = actual_peer && actual_peer[1] || r[5].from || e, peer_data && peer_data.members[actual_peer]) a = peer_data.members[
                actual_peer].name, peer_data.title && (a += " � " + peer_data.title), t = peer_data.members[actual_peer].photo;
            else if (i = cur.friends[actual_peer + "_"]) a = i[1], t = i[2];
            else {
                if (!(i = cur.tabs[actual_peer])) return;
                a = i.tab_text, t = i.photo
            }
            r[5].attach1_type ? message += "\n[" + getLang("mail_added_" + r[5].attach1_type) + "]" : r[5].fwd && (message += "\n[" + getLang("mail_added_msgs") + "]"), a =
                trim(replaceEntities(stripHTML((a || "")
                    .replace("&nbsp;", " ")))), Notifier.proxyIm({
                    id: r[4],
                    text: message,
                    author_id: e,
                    title: a,
                    author_photo: t
                })
        }
    },
    receivePeerData: function(e, r) {
        r.hash && (r.hash = IM.decodehash(r.hash)), extend(cur.tabs[e], r), cur.peer == e && IM.applyPeer(), el = ge("im_dialog" + e), el && (el = geByClass1(
            "dialogs_photo", el)), cur.tabs[e] && el && val(el, cur.tabs[e].data.members_grid_small)
    },
    loadMedia: function(e, r) {
        ajax.post("al_im.php", {
            act: "a_get_media",
            id: e,
            gid: cur.gid
        }, {
            onDone: function(i, t, a) {
                t && (val("im_msg_info" + e, t), val("im_dialogs_msginfo" + e, t)), a && a.peer && ge("mess" + e) && IM.receivePeerData(r, a.peer);
                var s = ge("im_msg_media" + e);
                if (s) {
                    if (val(s, i), s.id = "", a && a.gift) {
                        var o = ge("mess" + e);
                        addClass(o, "im_gift_msg");
                        var n = geByClass1("im_msg_text", o);
                        n.parentNode.appendChild(n)
                    }
                    cur.peer == r && IM.scrollAppended(0)
                }
                if (a.srv) {
                    var c = ge("dialogs_msg_media" + e);
                    c && (val(c, i), re(geByClass1("im_chat_photo_upd", c)))
                }
                a.stickers && window.Emoji && Emoji.updateTabs(a.stickers), shortCurrency()
            },
            onFail: function(i) {
                debugLog("load media fail", e, r), topError("IM media fail: " + i + "; " + r + "_" + e, {
                    dt: -1
                }), re("im_msg_media" + e)
            }
        })
    },
    chatPhotoSaved: function(e) {
        curBox() && curBox()
            .hide();
        var r = (e || {})[1];
        if (!r) return nav.reload();
        if (cur.pvShown && layers.fullhide(!0, !0), "im" != cur.module || cur.peer != r) return nav.go("/im?sel=c" + (r - 2e9));
        IM.updateUnread(e[3]), IM.receivePeerData(r, e[4]);
        var i = e[0];
        if (i) {
            ge("mess" + i) || IM.addMsg(r, -1, i, 2, 1, "", "", e[2], {
                source_act: e[5] ? "chat_photo_update" : "chat_photo_removed",
                from: cur.id,
                attach1_type: "photo",
                _no_media_load: 1
            });
            var t = ge("im_msg_media" + i);
            t && (val(t, e[5]), t.id = ""), val("im_msg_info" + i, e[6]), val("im_dialogs_msginfo" + i, e[6]), IM.scroll(), cur.nu && re("im_unread_bar" + cur.peer)
        }
    },
    setLastAct: function(e, r) {
        var i = ge("im_lastact" + e);
        i.innerHTML = r, show(i), hide("im_typing" + e)
    },
    hideLastAct: function(e) {
        hide("im_lastact" + e)
    },
    loadHistory: function(e, r, i, t) {
        if (!cur.tabs[e] || cur.tabs[e].loadingHistory) return !1;
        cur.tabs[e].loadingHistory = !0, r || (r = 0);
        var a = setTimeout(function() {
                cur.tabs && cur.tabs[e] && (cur.tabs[e].loadingHistory = !1)
            }, 5e3),
            s = 0,
            o = "im_more" + e;
        return 0 > r ? (s = cur.tabs[e].q_offset, o = "im_morenew" + e) : r && (s = cur.tabs[e].q_offset + cur.tabs[e].msg_count), r && nav.objLoc.msgid && IM.updateLoc(),
            ajax.post("al_im.php", {
                act: "a_history",
                peer: e,
                msg: i,
                offset: s,
                toend: t,
                rev: 0 > r ? 1 : 0,
                gid: cur.gid,
                whole: 2 == r ? 1 : 0
            }, {
                showProgress: addClass.pbind(o, "im_more_loading"),
                hideProgress: removeClass.pbind(o, "im_more_loading"),
                onDone: function(t, s, o, n, c) {
                    if (cur.tabs[e]) {
                        var l = ge("im_log" + e);
                        if (!l) return void debugLog("table#im_log" + e + " not found");
                        r || (l = IM.clearHistory(e, l), cur.tabs[e].q_offset = c.q_offset), cur.tabs[e].inUpto < c.inUpto && (cur.tabs[e].inUpto = c.inUpto), cur.tabs[
                            e].outUpto < c.outUpto && (cur.tabs[e].outUpto = c.outUpto);
                        var d, u, m = geByTag1("tbody", l),
                            _ = se(t),
                            g = geByTag1("tbody", _),
                            p = m.firstChild;
                        domPN(l)
                            .insertBefore(_, 0 > r ? domNS(l) : l), 0 > r ? o = cur.tabs[e].all_shown : o && hide("im_more" + e), IM.updateScroll(0 > r, !r), c &&
                            c.lastact && (cur.friends && cur.friends[e + "_"] && cur.friends[e + "_"][0] || IM.setLastAct(e, c.lastact)), setTimeout(function() {
                                for (; d = g.firstChild;) d.id.match(/^mess\d+/) || d.id.match(/^im_unread_bar/) ? (u = d.id, d.id = "", ge(u) ? re(d) : (d.id =
                                    u, 0 > r ? m.appendChild(d) : m.insertBefore(d, p))) : re(d);
                                re(_), IM.updatePeer(e, s, o, 0 > r ? -1 : 0), delete cur.tabs[e].loadingHistory, clearTimeout(a), cur.focused == e && IM.readLastMsgs(),
                                    cur.peer == e && IM.applyPeer(), IM.markPeer(e), IM.updateScroll(0 > r, !r), r || cur.peer != e || IM.scrollOn(!1, i ? i :
                                        -1), cur.fixedScroll || r || IM.scrollOn(), cur.tabs[e].markAfter && (delete cur.tabs[e].markAfter, IM.markPeer(e))
                            }, 0), IM.updateCounts(n), cur.fixedScroll || r || IM.scrollOn()
                    }
                },
                onFail: function() {
                    cur.tabs[e].loadingHistory = !1, clearTimeout(a)
                }
            }), !1
    },
    deleteHistory: function(e, r) {
        r = r || cur.tabs[e].hash;
        var i = !1,
            t = function() {
                cur.flushing_peer = e, ajax.post("/al_im.php", {
                    act: "a_flush_history",
                    hash: r,
                    id: e,
                    from: "im",
                    gid: cur.gid
                }, {
                    onDone: function(r, t) {
                        cur.flushing_peer = !1, cur.tabs[e] && IM.closeTab(e), re("im_dialog" + e), geByClass1("dialogs_row", ge("im_dialogs")) || (show(
                                "im_rows_none"), hide("im_dialogs_summary")), i && i.hide(), -2e9 > e && (delete cur.emails[e + "_"], IM.cacheFriends()),
                            showDoneBox(t)
                    },
                    showProgress: i && i.showProgress,
                    hideProgress: i && i.hideProgress
                })
            };
        i = showFastBox({
            title: getLang("mail_deleteall1"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, e > 2e9 ? getLang("mail_chat_sure_to_delete_all") : getLang("mail_sure_to_delete_all"), getLang("mail_delete"), t, getLang("global_cancel"), i.hide)
    },
    deleteDialog: function(e, r) {
        re("im_deleted_dialog" + e);
        var i = cur.tabs[e],
            t = geByClass1("dialogs_del", ge("im_dialog" + e), "div");
        if (t && t.tt && t.tt.el && t.tt.destroy(), i) {
            var a = !1;
            if (each(i.msgs || [], function(e, r) {
                    return e && r && (a = r[0]) ? !1 : void 0
                }), a) return void IM.deleteHistory(e);
            r || (r = i.hash || "")
        }
        ajax.post("al_im.php", {
            act: "a_delete_dialog",
            peer: e,
            hash: r,
            gid: cur.gid
        }, {
            onDone: function(r, i) {
                if (r) {
                    var t = ge("im_dialog" + e),
                        a = se('<div class="dialogs_row dialogs_deleted_row" id="im_deleted_dialog' + e + '">' + val(t) + "</div>");
                    cur.deletedDialogs[e] = t, t.parentNode.replaceChild(a, t), val(geByClass1("dialogs_msg_body", a, "div"), r), cur.gid && IM.closeTab(e)
                } else IM.deleteHistory(e, i)
            }
        })
    },
    spamDialog: function(e, r) {
        ajax.post("al_im.php", {
            act: "a_spam_dialog",
            peer: e,
            hash: r,
            gid: cur.gid
        }, {
            onDone: function(r) {
                val(geByClass1("dialogs_msg_body", ge("im_deleted_dialog" + e), "div"), r)
            }
        })
    },
    blackList: function(e) {
        var r = 0;
        showBox("al_groups.php", {
            act: "bl_edit",
            name: "/id" + e,
            gid: cur.gid
        }, {
            stat: ["page.css", "ui_controls.js", "ui_controls.css"],
            dark: 1,
            onDone: function(e, i) {
                if (r > 0) {
                    var t = cur.blbSave;
                    cur.blbSave = function() {
                        t.apply(cur, arguments), IM.activateTab(-1)
                    }
                }
                r++
            }
        })
    },
    restoreDialog: function(e, r, i) {
        ajax.post("al_im.php", {
            act: "a_restore_dialog",
            peer: e,
            hash: r,
            spam: i,
            gid: cur.gid
        }, {
            onDone: function(r) {
                var i = ge("im_deleted_dialog" + e);
                i.parentNode.replaceChild(cur.deletedDialogs[e], i), delete cur.deletedDialogs[e]
            }
        })
    },
    startChatWith: function(e) {
        IM.activateTab(0, 1), cur.multi = !0, cur.multi_friends = {}, cur.multi_friends[e] = 1, IM.updateTopNav(), IM.updateFriends(!0), !browser.mobile && setTimeout(
            "if (!cur.peer) elfocus('im_filter')", browser.msie ? 100 : 0)
    },
    showMediaHistory: function(e, r) {
        return showWiki({
            w: "history" + IM.peerToId(e) + "_" + r
        })
    },
    onUploadDone: function() {
        unlockButton(ge("im_send")), cur.sendOnUploadDone && (delete cur.sendOnUploadDone, IM.send())
    },
    mute: function(e) {
        ajax.post("al_im.php", {
            act: "a_mute",
            value: 1,
            peer: e,
            hash: cur.tabs[e].hash
        }, {
            onDone: function(r) {
                IM.updateMutedPeer(e), Notifier.lcSend("im", {
                    act: "mute",
                    peer: e
                })
            }
        })
    },
    unmute: function(e) {
        ajax.post("al_im.php", {
            act: "a_mute",
            value: 0,
            peer: e,
            hash: cur.tabs[e].hash
        }, {
            onDone: function(r) {
                IM.updateUnmutedPeer(e), Notifier.lcSend("im", {
                    act: "unmute",
                    peer: e
                })
            }
        })
    },
    updateMutedPeers: function(e) {
        e = e || [];
        for (i in e) {
            var r = e[i],
                t = cur.mutedPeers.indexOf(r);
            t > -1 ? cur.mutedPeers.splice(t, 1) : IM.updateMutedPeer(r)
        }
        for (i in cur.mutedPeers) {
            var a = cur.mutedPeers[i];
            IM.updateUnmutedPeer(a)
        }
        cur.mutedPeers = e
    },
    updateMutedPeer: function(e) {
        if (!inArray(e, cur.mutedPeers)) {
            cur.mutedPeers.push(e), e == cur.peer && IM.applyPeer();
            var r = ge("im_tab" + e);
            addClass(r, "muted");
            var i = ge("im_dialog" + e),
                t = geByClass1("dialogs_online", i);
            if (t && !geByClass1("dialogs_push_muted", t)) {
                var a = ce("b", {
                    className: "dialogs_push_muted"
                });
                t.appendChild(a)
            }
        }
    },
    updateUnmutedPeer: function(e) {
        var r = cur.mutedPeers.indexOf(e);
        if (-1 != r) {
            cur.mutedPeers.splice(r, 1), e == cur.peer && IM.applyPeer();
            var i = ge("im_tab" + e);
            removeClass(i, "muted");
            var t = ge("im_dialog" + e),
                a = geByClass1("dialogs_push_muted", t);
            re(a)
        }
    },
    extractEmoji: function(e, r) {
        var i = {},
            t = geByClass("emoji", e);
        for (var a in t) i[Emoji.getCode(t[a])] = 1;
        var t = geByClass("emoji_css", e);
        for (var a in t) i[Emoji.getCode(t[a])] = 1;
        var s = ge("im_rcemoji"),
            o = "",
            n = 0;
        for (var c in i) {
            var l = ge("im_rc_em_" + c);
            if (l) {
                if (!(r > 2e9) || l.nextSibling) continue;
                re(l)
            }
            ge("im_rc_em_" + c) || (o += '<a id="im_rc_em_' + c + '" class="im_rc_emojibtn" onmousedown="Emoji.addEmoji(cur.emojiId[cur.peer], \'' + c +
                "', this); return cancelEvent(event);\">" + Emoji.getEmojiHTML(c, !1, !0) + "</a>", n -= 22)
        }
        s.insertBefore(cf(o), s.firstChild), setStyle(s, {
            marginLeft: n
        }), animate(s, {
            marginLeft: 0
        }, {
            duration: 150,
            transition: Fx.Transitions.easeOutCubic,
            onComplete: function() {
                var e = geByClass("im_rc_emojibtn", s)
                    .slice(7);
                for (var r in e) re(e[r])
            }
        })
    },
    getMedias: function(e) {
        if (e || (e = cur.peer), !e || !cur.imPeerMedias || !cur.imPeerMedias[e]) return [];
        var r = [],
            i = {};
        return each(cur.imSortedMedias[e] || [], function(t, a) {
            cur.imPeerMedias[e][a] && (r.push(cur.imPeerMedias[e][a]), i[a] = !0)
        }), each(cur.imPeerMedias[e], function(e, t) {
            t && isArray(t) && !i[e] && r.push(t)
        }), r
    },
    saveMedias: function(e) {
        if (e || (e = cur.peer), e && cur.imPeerMedias && cur.imPeerMedias[e]) {
            var r, i = [];
            each(ge("im_media_preview")
                .childNodes,
                function(e, t) {
                    (r = (t.className || "")
                        .match(/im_preview_ind(\d+)/)) && i.push(intval(r[1]))
                }), each(ge("im_media_dpreview")
                .childNodes,
                function(e, t) {
                    (r = (t.className || "")
                        .match(/im_preview_ind(\d+)/)) && i.push(intval(r[1]))
                }), each(ge("im_docs_preview")
                .childNodes,
                function(e, t) {
                    (r = (t.className || "")
                        .match(/im_preview_ind(\d+)/)) && i.push(intval(r[1]))
                }), cur.imSortedMedias[e] = i, clearTimeout(cur.tabs[cur.peer].saveDraftTO), IM.saveDraft(cur.peer)
        }
    },
    getPlainText: function() {
        var e = Emoji.editableVal(ge("im_editable" + cur.peer));
        return e = e.replace(Emoji.emojiRegEx, "")
    },
    send: function(e, r, i) {
        var t = cur.peer;
        i && (t = i);
        var a = cur.imPeerMedias[t] || [],
            s = cur.imSortedMedias[t] || [],
            o = cur.tabs[t],
            n = ge("im_txt" + t),
            c = ge("im_progress_preview"),
            l = cur.imMedia && cur.imMedia.urlAttachmentLoading,
            d = IM.getMedias(t);
        if (cur.editable && (n = ge("im_editable" + t)), t && n && !n.disabled) {
            if (!cur.sendOnUploadTrigger && (c.childNodes.length || l && vkNow() - l[0] < 3e3)) return lockButton(ge("im_send")), cur.sendOnUploadDone = !0, cur.sendOnUploadTrigger = !
                0, void(cur.sendOnUploadTriggerTimeout = setTimeout(IM.send.pbind(e, r, i), 3e3));
            if (delete cur.sendOnUploadDone, cur.sendOnUploadTriggerTimeout && (clearTimeout(cur.sendOnUploadTriggerTimeout), cur.sendOnUploadTriggerTimeout = null), cur.sendOnUploadTrigger &&
                (unlockButton(ge("im_send")), cur.sendOnUploadTrigger = !1), setStyle(bodyNode, {
                    cursor: "default"
                }), cur.editable) {
                if (cur.textSendCut) u = cur.textSendCut, cur.textSendCut = !1;
                else var u = Emoji.editableVal(n);
                if (u.length > 3980) {
                    var m = u.substr(0, 3980)
                        .lastIndexOf(" "); - 1 == m && (m = 3980), cur.textSendCut = u.substr(m), u = u.substr(0, m)
                }
                IM.extractEmoji(n, t)
            } else var u = val(n);
            var _ = isVisible("im_title_wrap" + t) && val("im_title" + t) || "";
            if (!trim(u)
                .length && !d.length) return void(cur.editable ? Emoji.editableFocus(n, !1, !0) : ge("im_txt" + t)
                .focus());
            if (!o.sending) {
                o.sending = !0, cur.guid = (cur.guid || 0) + 1;
                var g = (cur.guid + Math.random())
                    .toFixed(10),
                    p = --o.sent,
                    f = {
                        act: "a_send",
                        to: t,
                        hash: o.hash,
                        msg: u,
                        title: _,
                        ts: cur.ts,
                        guid: g,
                        gid: cur.gid
                    },
                    h = [],
                    v = {},
                    b = 1;
                if (d) {
                    var M = 0,
                        w = "";
                    each(d, function(e, r) {
                        "share" == r[0] && (M++, r[4] && (w = r[4]))
                    });
                    var I = 1 == M;
                    each(d, function(e, r) {
                        ("share" != r[0] || I) && (h.push(r[0] + ":" + r[1]), "mail" == r[0] ? v.fwd = r[1] : "map" == r[0] ? v.geo = "GEO" : (v["attach" + b +
                            "_type"] = r[0], v["attach" + b] = r[1]), r[4] && trim(u) == r[4] && (f.msg = u = n.innerHTML = ""))
                    }), f.media = h.join(","), w && (f.share_url = w), cur.imPeerMedias[t] = !1, cur.imSortedMedias[t] = !1, IM.restorePeerMedia(t)
                }
                if (cur.imMedia) {
                    var y = cur.imMedia.lnkId;
                    show(geByClass("add_media_type_" + y + "_map", ge("add_media_menu_" + y))[0])
                }
                if (hide("im_error" + t, "im_title_wrap" + t), cur.editable) {
                    Emoji.cleanCont(n);
                    var k = n.innerHTML;
                    k = k.replace(new RegExp('src="' + location.protocol + "//" + location.host, "g"), 'src="'), k = trim(k.replace(/[ ]+/, " "))
                } else var k = clean(u)
                    .replace(/\n/g, "<br>"),
                    T = clean(_)
                    .replace(/\n/g, "<br>");
                ajax.post("al_im.php", f, {
                        onDone: function(e) {
                            if (cur.textSendCut && setTimeout(IM.send.pbind(!1, !1, cur.peer), 0), o.sending = !1, delete cur.myTypingEvents[t], e.version &&
                                intval(e.version) > cur.version) return void(document.location = IM.updateLoc(!0));
                            if (o.q_offset) return void IM.toEnd();
                            var r = ge("mess" + p),
                                i = e.msg_id;
                            if (r && (t != vk.id || cur.gid)) {
                                ++o.msg_count;
                                for (var a = o.new_msgs.length; a--;)
                                    if (o.new_msgs[a] == p) {
                                        o.new_msgs[a] = o.new_msgs.pop();
                                        break
                                    }
                                var s = "";
                                cur.gid && (s = IM.getAdminName(vk.id, getLang("mail_groups_by_you"), cur.real_author_link), cur.last_admin = vk.id.toString());
                                cur.gid ? "gim" + cur.gid + "?msgid=" + i + "&sel=" + cur.peer : "mail?act=show&id=" + i;
                                r.cells[3].innerHTML = '<a class="im_important_toggler" onclick="return IM.toggleImportant(' + i +
                                    ');" onmouseover="IM.showImportantTT(this);"></a><div class="im_date_link">' + s + '<a href="">' + IM.mkdate(e.date + cur.tsDiff) +
                                    '</a><input type="hidden" id="im_date' + i + '" value="' + e.date + '" />', r.id = "mess" + i, r.cells[0].innerHTML =
                                    '<div id="ma' + i + '" class="im_log_check_wrap"><div class="im_log_check" id="mess_check' + i + '"></div></div>', addEvent(r,
                                        "mouseover", IM.logMessState.pbind(1, i)), addEvent(r, "mouseout", IM.logMessState.pbind(0, i)), r.onclick = function(e) {
                                        IM.checkLogClick(this, e || window.event) || IM.checkLogMsg(i)
                                    };
                                var n = ge("im_msg_media" + p);
                                n && (val(n, e.media || ""), ge(n)
                                    .id = "", e.media || debugLog("MEDIA FAIL", p, i, e, f), IM.scrollOn()), o.msgs[i] = [1, !cur.nu || o.outUpto < i ? 1 : 0,
                                    0
                                ], cur.peer == t && IM.updateOnline(e.online, e.sex), IM.updateCounts(e.cnts)
                            }
                        },
                        onFail: function(e) {
                            o.sending = !1, IM.error(e || getLang("global_unknown_error")), cur.editable ? (ge("im_editable" + t)
                                    .innerHTML = k, Emoji.editableFocus(ge("im_editable" + t), !1, !0)) : (ge("im_txt" + t)
                                    .focus(), ge("im_txt" + t)
                                    .value = u), _ && show("im_title_wrap" + t), a && (cur.imPeerMedias[t] = a, cur.imSortedMedias[t] = s, IM.restorePeerMedia(t)),
                                cur.editable || o.txt.update(), clearTimeout(o.saveDraftTO), IM.saveDraft(t);
                            var r = ge("mess" + p);
                            return r ? (re("mprg" + p), r.cells[3].innerHTML = '<span class="im_log_date_error">' + getLang("global_error") +
                                '</span><input type="hidden" id="im_date' + r.id.substr(4) + '" value="0" />', IM.scroll(), IM.updateMoreNew(t), !0) : void 0
                        }
                    }), k = k.replace(/&lt;&lt;/g, "�")
                    .replace(/&gt;&gt;/g, "�")
                    .replace(/ \-\-/g, " �")
                    .replace(/\-\- /g, "� "), cur.emoji && (k = Emoji.emojiToHTML(k, !1)), o.data && (v.from = cur.id), cur.gid && (v.from_admin = vk.id.toString()), IM.addPeerMsg(
                        t, p, T, k, v), cur.editable ? (n.innerHTML = "", Emoji.editableFocus(n, !1, !0), IM.checkEditable(cur.emojiId[t], n)) : (n.value = "", o.txt.update(),
                        elfocus(n)), IM.panelUpdate(!1), IM.panelUpdate(!0), IM.updateTopNav(), IM.updateScroll(), cur.imMedia && (cur.imMedia.urlsCancelled = []),
                    clearTimeout(o.saveDraftTO), IM.saveDraft(t)
            }
        }
    },
    feed: function(e, r) {
        var i = !1,
            t = !1;
        if (cur.tabs[e] && void 0 !== cur.tabs[e].msgs) {
            for (var a in r) {
                var s = r[a],
                    o = ge("mess" + a);
                if (cur.debug && debugLog("new update", s, "ex msg", o), !s[0] && o) {
                    if (cur.deletedRows[a]) continue;
                    var n = IM.getTable(e),
                        c = o.rowIndex;
                    n.deleteRow(c), !cur.tabs[e].msgs[a][0] && cur.tabs[e].msgs[a][1] && (cur.nu ? intval(cur.tabs[e].unr[a]) > 0 && (delete cur.tabs[e].unr[a], --cur.tabs[
                        e].unread) : --cur.tabs[e].unread), --cur.tabs[e].msg_count, cur.tabs[e].msgs[a] = !1
                } else if (s[0]) {
                    var l = !s[1] && s[0] > 1,
                        d = cur.tabs[e].msgs[a];
                    if (d && l && (d[0] || d[1]) && (l = !1), i = i || l, o || cur.tabs[e].q_new[a]) {
                        if (d) {
                            var u = d[0],
                                m = d[1],
                                _ = d[2],
                                g = geByClass1("dialogs_msg" + a, ge("im_dialogs"), "div");
                            u && g && (g = geByClass1("dialogs_msg_body", g)), s[0] > 1 && !m && o && !cur.nu ? (addClass(o, "im_new_msg"), addClass(g, "dialogs_new_msg"),
                                u || (addEvent(o, "mouseover", IM.onNewMsgOver.pbind(e, a)), ++cur.tabs[e].unread), d[1] = 1) : s[0] < 2 && m && !cur.nu && (o && (
                                removeClass(o, "im_new_msg"), removeClass(g, "dialogs_new_msg")), u || (o && (removeEvent(o, "mouseover"), addEvent(o, "mouseover",
                                IM.logMessState.pbind(1, a))), --cur.tabs[e].unread), d[1] = 0, cur.tabs[e].q_offset && (cur.tabs[e].q_new[a] && (delete cur.tabs[e]
                                .q_new[a], --cur.tabs[e].q_new_cnt), IM.updateMoreNew(e))), o && s[6] != _ && (d[2] = s[6], toggleClass(o, "im_important_msg", s[6]));
                        }
                    } else {
                        if (!cur.tabs[e].history && cur.tabs[e].loadingHistory) continue;
                        cur.tabs[e].new_msgs.length && each(cur.tabs[e].new_msgs, function(e, r) {
                            re("mess" + r)
                        });
                        for (var p, f = IM.getTable(e), h = 0, v = f.rows.length; v - h > 1;) {
                            var b = Math.floor((v + h) / 2),
                                M = intval(f.rows[b].id.substr(6));
                            a > M ? h = b : v = b
                        }
                        if (p = -1, f.rows[h] && (p = intval(f.rows[h].id.substr(4))), t = [a, s[0], s[1], s[2], s[3], s[4], s[5]], IM.addMsg(e, p, a, s[0], s[1], s[2], s[
                                3], s[4] + cur.tsDiff, s[5]), !cur.tabs[e]) return;
                        cur.tabs[e].msgs[a] = [s[1], s[0] > 1 ? 1 : 0, 0], (e == cur.peer || -1 == cur.peer) && (delete cur.typingEvents[e], IM.updateTyping(!1))
                    }
                } else if (cur.tabs[e].q_offset) {
                    cur.tabs[e].q_new[a] && (delete cur.tabs[e].q_new[a], --cur.tabs[e].q_new_cnt, !cur.tabs[e].msgs[a][0] && cur.tabs[e].msgs[a][1] && (cur.nu ? intval(
                        cur.tabs[e].unr[a]) > 0 && (delete cur.tabs[e].unr[a], --cur.tabs[e].unread) : --cur.tabs[e].unread), cur.tabs[e].msgs[a] = !1);
                    var v = intval(domLC(geByTag1("tbody", ge("im_log" + e)))
                        .id.replace(/^mess/, ""));
                    v && a > v && --cur.tabs[e].q_offset, IM.updateMoreNew(e)
                }
            }
            cur.tabs[e].msg_count ? (hide("im_none" + e), show("im_log" + e)) : (show("im_none" + e), hide("im_log" + e)), IM.updateUnreadMsgs(), cur.focused || !cur.titleTO &&
                cur.unreadMsgs && (cur.titleTO = setInterval(IM.changeTitle, 1e3)), cur.tabs[e].unread ? cur.peer != e ? (i && addClass(ge("im_tab" + e), "im_tab_over"),
                    IM.updateScroll()) : i && cur.friends[e + "_"] && IM.updateOnline(cur.friends[e + "_"][0] || 1, cur.friends[e + "_"][5]) : IM.checkUnread(e);
            var w = cur.tabs[e];
            if (t && w && !w.loading) {
                var I = ge("im_dialog" + e),
                    y = IM.updateDialog.pbind(e, t);
                w.lupd = t[0], t[2] || I ? y(t[2] ? 0 : intval(I.getAttribute("data-unread")), !1, w.folders) : ajax.post("al_im.php", {
                    act: "a_dialog_unread",
                    peer: e,
                    gid: cur.gid
                }, {
                    onDone: y
                })
            }
        }
    },
    formatUnread: function(e) {
        return e && cur.nu ? e > 9999999 ? "+" + intval(e / 1e6) + "M" : e > 9999 ? "+" + intval(e / 1e3) + "K" : "+" + e : ""
    },
    updateDialog: function(e, r, i, t, a) {
        var s = cur.tabs[e];
        if (s && !s.loading && s.lupd == r[0] && (t && IM.updateCounts(t), IM.isImportantDialog(a))) {
            var o, n = {
                    msg_id: r[0],
                    peer: e,
                    timestamp: r[5],
                    body_class: r[1] && r[2] && "dialogs_new_msg" || "",
                    row_class: r[1] && !r[2] && "dialogs_new_msg" || "",
                    unread_cnt: i,
                    unread_class: "unshown",
                    online: ""
                },
                c = "",
                l = new Date(1e3 * n.timestamp),
                d = l.getHours(),
                u = l.getMinutes(),
                m = 4 == r[1] && !r[2],
                _ = r[3],
                g = r[4],
                p = r[6],
                f = "";
            (n.unread = IM.formatUnread(i)) && (n.unread_class = ""), cur.nu && (n.row_class = n.unread ? "dialogs_new_msg" : ""), cur.time_system && (c = cur.time_system[
                    d > 11 ? 1 : 0], d = d % 12 || 12), o = d > 9 ? d : "0" + d, n.date = getLang("mail_im_row_date_format")
                .replace("{am_pm}", c)
                .replace("{hour}", d)
                .replace("{num_hour}", o)
                .replace("{minute}", (10 > u ? "0" : "") + u);
            var h = IM.getServiceMsg(e, p.from || (r[2] ? vk.id : e), p);
            if (h === !0 && (h = '<div id="dialogs_msg_media' + r[0] + '"></div>'), !h) {
                g || (g = ""), g = g.replace(/(<br\s?\/?>){3,}/gi, "<br/><br/>");
                var v = g.match(/^(.*?<br>)(.*<br>.*)$/);
                v && (g = v[1] + v[2].replace(/<br>/g, " "));
                var b = 90;
                _ = IM.goodTitle(_, e) ? _ : "", _ && (_.length > 48 && (_ = _.substr(0, 48) + ".."), _ = '<div class="im_subj">' + _ + "</div>", b = 40, g = g.replace(
                        /<br>/g, " ")), g.length > b && (g = g.substr(0, b) + ".."), p.emoji && (g = Emoji.emojiToHTML(g, !0)), g = _ + g, p.attach1_type ? g +=
                    '<div class="im_row_attach"><div class="im_attach_' + p.attach1_type + '"></div>' + getLang("mail_added_" + p.attach1_type) + "</div>" : p.fwd ? g +=
                    '<div class="im_row_attach"><div class="im_attach_mail"></div>' + (p.fwd.match(/,\(/) ? getLang("mail_added_msgs") : getLang("mail_added_msg")) +
                    "</div>" : p.source_act && !g && (g += '<div class="im_row_attach" id="im_dialogs_msginfo' + r[0] + '"></div>')
            }
            m ? g = getLang("mail_message_susp_title") : h && (g = h), !h && (r[2] || p.from && s.data && s.data.members[p.from]) && (r[2] || (g =
                '<div class="dialogs_chat_title">' + s.data.members[p.from].name + "</div>" + g), f = '<img class="dialogs_inline_author fl_l" src="' + (r[2] ? cur
                .photo : s.data.members[p.from].photo) + '" width="32" height="32"/>');
            var M = inArray(e, cur.mutedPeers) ? '<b class="dialogs_push_muted"></b>' : "";
            if (2e9 > e) {
                if (n.photo = '<a href="/id' + e +
                    '" target="_blank" onclick="event.cancelBubble = true; return nav.go(this, event);" onmousedown="event.cancelBubble = true;"><img src="' + s.photo +
                    '" width="50" height="50" /></a>', n.user_link = '<a href="/id' + e +
                    '" target="_blank" onclick="event.cancelBubble = true; return nav.go(this, event);" onmousedown="event.cancelBubble = true;">' + s.tab_text.replace(
                        "&nbsp;", " ") + "</a>", !r[2] || cur.friends[e + "_"] && cur.friends[e + "_"][0]) {
                    var w = langSex((s || {})
                            .sex || (cur.friends[e + "_"] || {})[5], window.global_online),
                        I = cur.friends[e + "_"] && cur.friends[e + "_"][0] || 0;
                    I > 0 && 6 > I && (w += '<b class="mob_onl dialogs_mob_onl" onmouseover="mobileOnlineTip(this, {mid: ' + e +
                        '})" onclick="mobilePromo(); return cancelEvent(event);"></b>'), n.online = '<div class="dialogs_online">' + w + M + "</div>"
                }
            } else n.user_link = '<a href="/im?sel=' + e + '" onclick="event.cancelBubble = true; if (!checkEvent(event)) {IM.addPeer(' + e + '); return false;}">' + s.name +
                "</a>", n.photo = s.data.members_grid_small, s.data.count > 0 && (n.online = '<div class="dialogs_online">' + getLang("mail_im_n_chat_members", s.data.count) +
                    M + "</div>");
            if (n.body = g, n.inline_author = f, re("im_dialog" + e), cur.nu && cur.unr && 0 >= i) return void(vk.counts.msg <= 0 && !cur.gid && IM.switchUnr(0, 0));
            a & IM.FOLDER_IMPORTANT ? (n.is_important = "dialogs_row_important", n.is_star = "dialogs_star_wrap_active", n.is_important_val = 1) : (n.is_important_val = 0,
                n.is_important = "", n.is_star = "");
            var y = se(rs(cur.drow_template, n)),
                k = ge("im_dialogs"),
                T = k && k.firstChild;
            for (cur.gid && cur.blocks[e] && cur.blocks[e][0] === !1 && IM.updateDialogLock(e, y); T && !(hasClass(T, "dialogs_row") && n.timestamp > intval(T.getAttribute(
                    "data-date")));) T = T.nextSibling;
            T ? k.insertBefore(y, T) : k.appendChild(y), hide("im_rows_none"), show("im_dialogs_summary")
        }
    },
    getKey: function() {
        if (cur.lastOperation = vkNow(), cur.key = !1, cur.keyReq) try {
            cur.keyReq.abort()
        } catch (e) {}
        cur.keyReq = ajax.post("al_im.php", {
            act: "a_get_key",
            uid: cur.id,
            gid: cur.gid
        }, {
            onDone: function(e, r, i, t) {
                e = trim(e), /[0-9a-f]{40}/i.test(e) ? (cur.key = e, cur.url = i, ge("transport_frame")
                    .src != r && (ge("transport_frame")
                        .src = r, delete IM.makeRequest, delete cur.imMakeRequest), IM.check()) : IM.error(getLang("mail_im_auth_failed")), IM.updateCounts(
                    t)
            },
            onFail: function(e) {
                setTimeout(IM.getKey, 1e3 * cur.errorTimeout), debugLog("from getKey delaying getKey for " + cur.errorTimeout + "secs"), cur.errorTimeout < 64 &&
                    (cur.errorTimeout *= 2)
            }
        })
    },
    clearHistory: function(e, r) {
        hide("im_more" + e), extend(cur.tabs[e], {
            msgs: {},
            unr: {},
            all_shown: 0,
            msg_count: 0,
            q_offset: 0,
            q_new: {},
            q_new_cnt: 0,
            tables: 0,
            unread: 0,
            auto: 0,
            sent: 0,
            new_msgs: [],
            delayed: [],
            history: !1
        });
        var i = se('<table cellspacing="0" cellpadding="0" id="im_log' + e + '" class="im_log_t"><tbody></tbody></table>');
        return domPN(r)
            .replaceChild(i, r), IM.updateMoreNew(e), i
    },
    markPeer: function(e) {
        if (cur.nu && e == cur.peer && cur.tabs[e]) {
            var r = cur.tabs[e],
                i = r.unr,
                t = r.q_new,
                a = [];
            if (r.loadingHistory) return void(r.markAfter = 1);
            if (delete r.firstUnr, !(r.unread - r.q_new_cnt <= 0)) {
                for (var s in i) i[s] > 0 && !t[s] && (a.push(s), r.inUpto < s && (r.inUpto = s), --r.unread, removeClass(ge("mess" + s), "im_new_msg"));
                if (!a.length) return void(r.unread = 0);
                for (var s in a) i[a[s]] = -1;
                a.length && ajax.post("al_im.php", {
                    act: "a_mark_read",
                    peer: e,
                    ids: a,
                    hash: r.hash,
                    gid: cur.gid
                }, {
                    onDone: function() {
                        for (var e in a) i[a[e]] < 0 && delete i[a[e]]
                    },
                    onFail: function() {
                        for (var e in a) i[a[e]] < 0 && (i[a[e]] = 1, ++r.unread)
                    }
                }), IM.checkUnread(e)
            }
        }
    },
    needMark: function(e) {
        return cur.nu && _wf > 0 && _la > vkNow() - 6e4 && e == cur.peer
    },
    checkUnread: function(e) {
        cur.tabs[e] && !cur.tabs[e].unread && (cur.peer != e && cur.tabs[e].auto ? IM.closeTab(e) : removeClass(ge("im_tab" + e), "im_tab_over"))
    },
    readPeer: function(e, r, i) {
        if (cur.nu) {
            if (cur.tabs[e]) {
                var t = i ? "outUpto" : "inUpto";
                if (cur.tabs[e][t] < r) {
                    if (!i) {
                        re("im_unread_bar" + e);
                        for (var a in cur.tabs[e].unr) r >= a && cur.tabs[e].unr[a] > 0 && (delete cur.tabs[e].unr[a], --cur.tabs[e].unread);
                        if (cur.tabs[e].q_offset) {
                            for (var a in cur.tabs[e].q_new) r >= a && (delete cur.tabs[e].q_new[a], --cur.tabs[e].q_new_cnt);
                            IM.updateMoreNew(e)
                        } else delete cur.tabs[e].lastScrollTop, e == cur.peer && IM.scroll();
                        IM.checkUnread(e)
                    }
                    cur.tabs[e] && (cur.tabs[e][t] = r)
                }
            }
            var s = ge("im_dialog" + e);
            if (s && (i ? removeClass(geByClass1("dialogs_msg_body", s), "dialogs_new_msg") : cur.unr ? (re(s), vk.counts.msg <= 0 && !cur.gid && IM.switchUnr(0, 0)) : (
                    removeClass(s, "dialogs_new_msg"), addClass(ge("dialogs_unread" + e), "unshown"), s.setAttribute("data-unread", 0))), i && cur.tabs[e]) {
                var o = (ge("im_log" + e) || {})
                    .rows,
                    n = i ? "im_out" : "im_in";
                if (o && o.length)
                    for (var a = o.length; a > 0; --a) {
                        var c = o[a - 1];
                        if (!hasClass(c, n)) break;
                        if (!hasClass(c, "im_new_msg")) break;
                        removeClass(c, "im_new_msg")
                    }
            }
        }
    },
    toggleUnrespondTab: function(e, r) {
        var i = geByClass1("_tab_gfilter_unrespond");
        if (i && r && show(i.parentNode), cur.tabs[e] && (r ? cur.tabs[e].folders &= ~IM.FOLDER_UNRESPOND : cur.tabs[e].folders |= IM.FOLDER_UNRESPOND), cur.peer === e ||
            cur.prev_peer === e) {
            var t = geByClass1("_add_to_responded");
            r ? show(t) : hide(t)
        }
    },
    checked: function(e) {
        var r = e.failed;
        if (1 == r || cur.ts >= e.ts + 256 || cur.failedCheck) {
            delete cur.failedCheck, cur.ts = e.ts;
            var i = IM.r(cur.peer) ? !1 : cur.tabs[cur.peer].q_offset;
            for (var t in cur.tabs) t != cur.peer && IM.clearHistory(t, ge("im_log" + t));
            if (IM.r(cur.peer) || i || IM.loadHistory(cur.peer), IM.updateUnreadMsgs(), r) return !0
        } else {
            if (2 == r) return debugLog("delaying getKey for " + cur.errorTimeout + "secs"), setTimeout(IM.getKey, 1e3 * cur.errorTimeout), cur.errorTimeout < 64 && (cur.errorTimeout *=
                2), !1;
            if (r) throw getLang("global_unknown_error")
        }
        cur.ts = e.ts;
        var a = {},
            s = {},
            o = {};
        if (e.updates)
            for (var t in e.updates) {
                var n = e.updates[t],
                    c = intval(n[0]),
                    l = intval(n[1]),
                    d = intval(n[2]),
                    u = intval(n[3]);
                if (51 != c)
                    if ((10 === c || 12 === c) && d & IM.FOLDER_UNRESPOND && IM.toggleUnrespondTab(n[1], 10 === c), (12 === c || 10 === c) && d & IM.FOLDER_IMPORTANT && (
                            12 === c && "important" === cur.gfilter && IM.updateDialogs(), IM.markImportant(n[1], ge("im_dialog" + n[1]), 12 === c ? 0 : 1)), 80 == c && IM
                        .updateCounts([l]), 61 != c && 62 != c)
                        if (8 != c && 9 != c)
                            if (6 != c && 7 != c) {
                                if (u) {
                                    if (0 == c || 1 == c || 2 == c || 3 == c) {
                                        if (void 0 !== a[u] && void 0 !== a[u][l] && (2 == a[u][l][0] && (3 == c && 1 & d || 1 == c && !(1 & d)) && (a[u][l][0] = 1), (0 ==
                                                c || (1 == c || 2 == c) && 192 & d) && (a[u][l][0] = 0), 3 == c && 128 & d && (a[u][l][0] = 0)), !cur.tabs[u] || !cur.tabs[
                                                u].msgs) continue;
                                        var m = cur.tabs[u].msgs[l];
                                        if (!m) {
                                            if (!cur.tabs[u].q_offset || !(128 & d || cur.tabs[u].q_new[l] && !(1 & d))) continue;
                                            m = [0, 0]
                                        }
                                        var _ = void 0 !== o[u + "_" + l] ? o[u + "_" + l] : 2 * m[0] + m[1];
                                        0 == c ? d = 128 | _ : 2 == c ? d = _ | d : 3 == c && (d = _ & ~d), o[u + "_" + l] = d
                                    }
                                    if (4096 & d && (d = 128 | d), 64 & d && (d = 128 | d), a[u] || (a[u] = {}), 2 == c && 16384 == d) var g = 3;
                                    else var g = 128 & d ? 0 : 32768 & d ? 4 : 1 & d ? 2 : 1;
                                    if (g) {
                                        var p = n[6],
                                            f = n[5],
                                            h = intval(n[4]),
                                            v = 2 & d ? 1 : 0,
                                            b = 8 & d ? 1 : 0;
                                        (ge("mess" + l) || void 0 !== p || cur.tabs[u].q_new[l]) && (a[u][l] = [g, v, f, p, h, n[7] || {}, b])
                                    } else a[u][l] = [0]
                                }
                            } else IM.readPeer(l, d, 7 == c);
                else {
                    var M = -l,
                        w = 9 == c ? 0 : d || 7;
                    65535 == w && (w = 7), cur.friends && void 0 !== cur.friends[M + "_"] && (cur.friends[M + "_"][0] = w), cur.peer && cur.peer == M && IM.updateOnline(w,
                        (cur.tabs[cur.peer] || {})
                        .sex || (cur.friends[cur.peer + "_"] || {})[5])
                } else 62 == c ? (-1 == cur.peer || cur.peer == 2e9 + d) && IM.onTyping(2e9 + d, l) : (-1 == cur.peer || cur.peer == l) && IM.onTyping(l);
                else {
                    var u = 2e9 + l,
                        I = cur.tabs[u];
                    !I || s[u] || 1 & d && !(vkNow() - intval(I.lastModifiedTime) > 2e3) || (s[u] = 1)
                }
            } else a = e.result;
        if (a)
            for (var u in a)
                if (intval(u) && cur.flushing_peer != u) {
                    var y = a[u];
                    if (cur.tabs[u]) IM.feed(u, y);
                    else {
                        if (inArray(u, cur.mutedPeers)) continue;
                        var k = !1;
                        for (var t in y)
                            if ((1 == y[t][0] || 2 == y[t][0]) && !y[t][1]) {
                                k = !0;
                                break
                            }
                        k && IM.addPeer(u, y)
                    }
                }
        for (var u in s) {
            var I = cur.tabs[u];
            I && !I.loading && IM.updateChat(u, !0)
        }
        return !0
    },
    check: function() {
        if (cur.imInited === !0) {
            cur.lastOperation = vkNow();
            var makeRequest = cur.imMakeRequest || IM.makeRequest;
            if (!makeRequest) return void setTimeout(IM.check, 1e3);
            try {
                makeRequest(function(obj, text) {
                    if (13033 == cur.id || 2943 == cur.id) {
                        var success = IM.checked(eval("(" + text + ")"));
                        success && (IM.check(), cur.errorTimeout = 1)
                    } else try {
                        var success = IM.checked(eval("(" + text + ")"));
                        success && (IM.check(), cur.errorTimeout = 1)
                    } catch (e) {
                        IM.error("Error: " + e.message);
                        try {
                            debugLog("error", e.message || "no message", e.type || "no type", e.stack || "no stack")
                        } catch (e) {}
                        setTimeout(IM.check, 1e3 * cur.errorTimeout), cur.errorTimeout < 64 && (cur.errorTimeout *= 2)
                    }
                }, function() {
                    setTimeout(IM.check, 1e3 * cur.errorTimeout), cur.errorTimeout < 64 && (cur.errorTimeout *= 2)
                })
            } catch (e) {
                debugLog("makeRequest failed", e)
            }
        }
    },
    checkConnection: function() {
        var e = vkNow() - cur.lastOperation;
        e > 6e4 && e > 1500 * cur.errorTimeout && (cur.key ? (debugLog("check from check conn"), IM.check()) : (debugLog("gkey from check conn"), IM.getKey()))
    },
    changeTitle: function() {
        if (!cur.unreadMsgs) return IM.restoreTitle();
        if (cur.old_title) document.title = cur.old_title, cur.old_title = !1, setFavIcon("/images/fav_chat" + _iconAdd + ".ico");
        else {
            cur.old_title = document.title.toString(), document.title = winToUtf(getLang("mail_im_new_messages", cur.unreadMsgs));
            var e = cur.unreadMsgs > 9 ? 10 : cur.unreadMsgs;
            setFavIcon("/images/icons/fav_im" + e + _iconAdd + ".ico")
        }
    },
    restoreTitle: function() {
        if (cur.old_title) {
            var e = cur.old_title;
            setTimeout(function() {
                document.title = e
            }, 200), setFavIcon("/images/fav_chat" + _iconAdd + ".ico"), cur.old_title = !1
        }
        clearInterval(cur.titleTO), cur.titleTO = !1
    },
    markRead: function(e, r) {
        if (r.length) {
            var i = -4 == e ? cur.spam : cur.tabs[e];
            i.markingRead = !0, -4 != e && cur.nu || ajax.post("al_im.php", {
                act: "a_mark_read",
                peer: e,
                ids: r,
                hash: i.hash,
                gid: cur.gid
            }, {
                onDone: function(t, a) {
                    i.markingRead = !1, each(r, function(r, t) {
                        if (-4 == e && (t = "s" + t), IM.r(e) || i.msgs[t] && !i.msgs[t][0] && i.msgs[t][1]) {
                            IM.r(e) || (i.msgs[t][1] = 0, --i.unread);
                            var a = ge("mess" + t),
                                s = geByClass1("dialogs_msg" + t, ge("im_dialogs"), "div");
                            removeClass(a, "im_new_msg"), removeEvent(a, "mouseover"), removeClass(s, "dialogs_new_msg"), addEvent(a, "mouseover", IM.logMessState
                                .pbind(1, t))
                        }
                    }), IM.r(e) || cur.peer != e || IM.updateScroll(), IM.updateCounts(a), IM.r(e) || IM.updateUnreadMsgs()
                },
                onFail: function() {
                    i.markingRead = !1
                }
            })
        }
    },
    getNewTxt: function() {
        return ge(cur.editable ? "imw_editable" : "imw_text")
    },
    getTxt: function(e) {
        return e = e || cur.peer, ge((cur.editable ? "im_editable" : "im_txt") + e)
    },
    initTxt: function(e) {
        try {
            var r = IM.getTxt(e),
                i = cur.tabs[e];
            cur.editable || i.txt || browser.mobile || (autosizeSetup(r, {
                minHeight: 42,
                maxHeight: 100,
                exact: 1,
                onResize: IM.updateScroll,
                preventEnter: !0
            }), i.txt = r.autosize), cur.sharedIm = {}, cur.emojiId[e] = Emoji.init(r, {
                ttDiff: 93,
                rPointer: !0,
                noStickers: cur.gid ? !0 : !1,
                controlsCont: ge("im_peer_controls"),
                shouldFocus: e == cur.peer,
                onSend: IM.send,
                forceTxt: !cur.editable,
                sharedTT: cur.sharedIm,
                checkEditable: IM.checkEditable,
                saveDraft: IM.saveDraft.pbind(e),
                rceCont: ge("im_rcemoji_cont"),
                addMediaBtn: ge("im_add_media"),
                sendWrap: ge("im_send_wrap"),
                onKeyAction: function(r) {
                    if (clearTimeout(i.saveDraftTO), "paste" == r.type ? IM.saveDraft(cur.peer, r.type) : i.saveDraftTO = setTimeout(IM.saveDraft.pbind(cur.peer,
                            r.type), 300), "keyup" == r.type)
                        if (IM.readLastMsgs(), cur.editable) r.ctrlKey || r.metaKey || (!(r.keyCode > 40) || inArray(r.keyCode, [91, 92]) || r.keyCode >= 112 &&
                            r.keyCode <= 125) && 32 != r.keyCode && 8 != r.keyCode || IM.onMyTyping(e);
                        else {
                            var t = i.lastVal || "",
                                a = this.value;
                            (a.length != t.length || a != t) && (IM.onMyTyping(e), i.lastVal = a)
                        }
                },
                onStickerSend: function(e) {
                    var r = cur.peer,
                        i = cur.tabs[r];
                    ajax.post("/al_im.php", {
                        act: "a_send",
                        to: r,
                        hash: i.hash,
                        msg: "",
                        ts: cur.ts,
                        media: "sticker:" + e
                    }, {
                        onDone: function() {
                            return i.q_offset ? void IM.toEnd() : void 0
                        },
                        onFail: function(e) {
                            return IM.error(e || getLang("global_unknown_error")), !0
                        }
                    });
                    var t = --i.sent;
                    debugLog("stNum", e), IM.addPeerMsg(r, t, "", "", {
                        attach1_type: "sticker",
                        attach1: e
                    })
                }
            }), addEvent(r, "focus", function() {
                cur.focused = cur.peer, IM.panelUpdate(!0), IM.restoreTitle()
            }), addEvent(r, "blur", function() {
                cur.focused = 0, IM.panelUpdate(!1)
            }), addEvent(r, "paste", function(e) {
                var r, i = e.clipboardData || e.originalEvent.clipboardData;
                if (i && (i = i.items)) {
                    for (var t = 0; t < i.length; t++) 0 == i[t].type.indexOf("image") && (r = i[t].getAsFile());
                    r && (r.name = r.filename = "upload_" + (new Date)
                        .toISOString() + ".png", Upload.onFileApiSend(cur.imUploadInd, [r]))
                }
            }), e == cur.peer && (cur.editable || ge("im_txt" + e)
                .focus())
        } catch (t) {
            debugLog("err", t.message, t), setTimeout("IM.initTxt(" + e + ")", 100)
        }
    },
    saveDraft: function(e, r) {
        var i = cur.tabs[e],
            t = IM.getTxt(e);
        if (t && i && cur.peer == e) {
            for (var a = Emoji.editableVal(t), s = {
                    txt: trim(a),
                    medias: []
                }, o = IM.getMedias(e), n = 0, c = o.length; c > n; ++n) o[n] && s.medias.push([o[n][0], o[n][1]]);
            s.medias.length || s.txt.length || (s = !1), ls.set("im_draft" + vk.id + "_" + e, s), s && s.txt.length && cur.imMedia && ("paste" == r || "keyup" == r) && cur
                .imMedia.checkMessageURLs(a, "keyup" != r)
        }
    },
    restoreDraft: function(e) {
        var r = cur.tabs[e],
            i = ls.get("im_draft" + vk.id + "_" + e) || {},
            t = i.txt || "",
            a = IM.getTxt(e),
            s = Emoji.editableVal(a);
        if (browser.mobile || !a || !r || !t && !i.medias || cur.peer != e || s.length > t.length || (cur.imPeerMedias[e] || [])
            .length > (i.medias || [])
            .length) return !1;
        if (s.length < t.length && (cur.editable ? (val(a, clean(t)
                .replace(/\n/g, "<br/>")), Emoji.editableFocus(a, !1, !0)) : val(a, t)), setTimeout(function() {
                a.scrollTop = a.scrollHeight
            }, 10), IM.checkEditable(cur.emojiId[e], a), (i.medias || [])
            .length && !(cur.imPeerMedias[e] || [])
            .length) {
            var o = [];
            for (var n in i.medias) i.medias[n] && o.push(i.medias[n].slice(0, 2)
                .join(","));
            return ajax.post("al_im.php", {
                act: "draft_medias",
                media: o.join("*")
            }, {
                onDone: function(r) {
                    !(cur.imPeerMedias || [])
                    .length && cur.peer == e && (r || [])
                        .length && each(r, function() {
                            IM.onMediaChange.apply(IM, this)
                        })
                }
            }), !0
        }
        return !1
    },
    shortSearch: function(e) {
        e.keyCode == KEY.RETURN && (IM.updateTopNav(), ge("im_filter")
            .value = e.target.value, IM.searchMessages(), e.target.value = "")
    },
    onNewMsgOver: function(e, r) {
        if (!cur.tabs[e].markingRead && !document.hidden) {
            var i = ge("im_susp_wrap" + r);
            if (i && !hasClass(i, "im_msg_susp_wrap_done")) return !1;
            IM.markRead(e, [r])
        }
    },
    onMediaChange: function(e, r, i, t) {
        debugLog("onchange", e, r, i, t);
        var a = IM.getTxt(cur.peer);
        if (IM.r(cur.peer) || t && -1 == (a.innerText || a.textContent)
            .indexOf(t)) return !1;
        if (e && this.attachedCount(!0) >= cur.attachments_num_max) return !1;
        isArray(cur.imPeerMedias[cur.peer]) || (cur.imPeerMedias[cur.peer] = [], cur.imSortedMedias[cur.peer] = []);
        var s, o = "",
            n = "",
            c = "",
            l = [ge("im_docs_preview"), ge("im_media_preview"), ge("im_media_dpreview"), ge("im_media_mpreview"), ge("im_sdocs_preview")],
            d = ge("im_progress_preview"),
            u = cur.imPeerMedias[cur.peer];
        if (e)
            for (s in u)
                if (u[s][0] == e && (u[s][1] == r || "mail" == e)) return cur.fileApiUploadStarted && void 0 !== i.upload_ind || cur.preventBoxHide || boxQueue.hideLast(), !
                    1;
        cur.dropDoc && (boxQueue.hideLast(), delete cur.dropDoc);
        var m, _, g = 0;
        switch (e) {
            case "photo":
                isObject(i) || (i = {
                        thumb_m: i[0] || "",
                        thumb_s: i[1] || "",
                        list: i[2] || "",
                        view_opts: i[3] || "",
                        upload_ind: i.upload_ind || void 0
                    }), vkImage()
                    .src = i.thumb_s, o = "<div onclick=\"if (cur.cancelClick) return (cur.cancelClick = false); return IM.showPhoto('" + r + "', '" + i.list + "', " + i.view_opts
                    .replace(/"/g, "&quot;") + ');" class="im_preview_photo"><img class="im_preview_photo" src="' + i.thumb_s + '" onload="IM.refr()" />', n = "</div>", g =
                    1, c = ' id="iam_photo' + r + '"', _ = "inl_bl";
                break;
            case "video":
                isObject(i) || (i = {
                        thumb: i || ""
                    }), o = "<div onclick=\"if (cur.cancelClick) return (cur.cancelClick = false); return showVideo('" + r +
                    '\');" class="im_preview_video"><div class="im_preview_video_thumb" style="background-image:url(\'' + i.thumb + '\')" onload="IM.refr()"></div>', n =
                    "</div>", g = 1, c = ' id="iam_video' + r + '"', _ = "inl_bl";
                break;
            case "audio":
                if (!i.info) return !1;
                o = Page.addAudioPreview(r, i), g = 0, _ = "clear_fix", c = ' id="iam_audio' + r + '"';
                break;
            case "doc":
                if (!i.lang) return !1;
                i.thumb && i.thumb_s ? (o = '<a target="_blank" href="' + i.href +
                    '" class="fl_l pam_dpic" onclick="if (cur.cancelClick) return (cur.cancelClick = false);"><div class="im_preview_photo_doc"><img src="' + i.thumb_s +
                    '" align="middle"></div><div class="im_preview_doc_photo_hint">' + i.title + "</div>", n = '</a><div class="pam_bg">&nbsp;</div>', g = 2, _ =
                    "fl_l") : (o = '<a target="_blank" href="' + i.href +
                    '" class="medadd_h medadd_h_doc inl_bl" onclick="if (cur.cancelClick) return (cur.cancelClick = false);">' + i.lang.profile_choose_doc + "</a>", n =
                    '<div class="medadd_c medadd_c_doc"><a target="_blank" href="' + i.href + '" title="' + i.title + '">' + i.title + "</a></div>", g = 0, _ =
                    "clear_fix"), c = ' id="iam_doc' + r + '"';
                break;
            case "mail":
                o = '<a onclick="if (cur.cancelClick) return (cur.cancelClick = false); IM.willForward()" class="medadd_h medadd_h_mail inl_bl">' + getLang(
                        "mail_im_forward") + "</a>", n = '<div class="medadd_c medadd_c_mail"><a onclick="IM.willForward()">' + getLang("mail_title_X_msgs", i[0]) +
                    "</a></div>", g = 4, _ = "clear_fix";
                break;
            case "map":
                o = "<div class=\"fl_l\"><a onclick=\"return showBox('al_places.php', {act: 'geo_box', lat: " + i[0] + ", long: " + i[1] +
                    '}, {dark: 1});"><div class="page_media_map_point"></div><img class="page_preview_map" width="174" height="70" src="/maps?lat=' + i[0] + "&lng=" + i[1] +
                    "&z=11&" + (window.devicePixelRatio >= 2 ? "w=360&h=140" : "w=174&h=70") + '" /></a></div>', g = 3, _ = "fl_l";
                var p = cur.imMedia.lnkId;
                hide(geByClass("add_media_type_" + p + "_map", ge("add_media_menu_" + p))[0]);
                break;
            case "share":
                var f = "";
                i.microdata_preview_html && (f = '<div class="im_preview_share_microdata">' + i.microdata_preview_html + "</div>");
                var h = trim(i.title),
                    v = trim(i.description);
                if (!h.length || !v.length) return IM.onUploadDone(), !1;
                var b = 0;
                if (each(u, function(e, r) {
                        "share" == r[0] && b++
                    }), b) return IM.onUploadDone(), !1;
                o = '<a class="medadd_h medadd_h_share"> ' + h + "</a>", n = f + '<div class="im_preview_share_domain">' + i.domain + "</div>", g = 4, _ = "";
                break;
            case "market":
                o = '<div class="medadd_c_market fl_l"><a target="_blank" href="' + i.href + '"><img class="medadd_c_market_thumb fl_l" src="' + i.thumb +
                    '" /></a><div class="medadd_c_market_info fl_l"><a class="medadd_c_market_title" target="_blank" href="' + i.href + '">' + i.title +
                    '</a><div class="medadd_c_market_price">' + i.price + "</div></div>";
                break;
            case !1:
                break;
            default:
                return IM.onUploadDone(), !1
        }
        if (e) {
            var M = u.length,
                w = "";
            if (void 0 !== i.upload_ind && re("upload" + i.upload_ind + "_progress_wrap"), o || n) {
                w = '<div class="im_preview_' + e + "_wrap im_preview_ind%ind% " + _ + '"' + c + ">" + o + '<div nosorthandle="1" class="im_media_x inl_bl" ' + (browser.msie ?
                        "title" : "tooltip") + '="' + getLang("dont_attach") +
                    '" onmouseover="if (browser.msie) return; showTooltip(this, {text: this.getAttribute(\'tooltip\'), shift: [14, 3, 3], black: 1})" onclick="cur.addMedia[%lnkId%].unchooseMedia(%ind%); return cancelEvent(event);"><div class="im_x" nosorthandle="1"></div></div>' +
                    n + "</div>";
                var I = se(rs(w, {
                    lnkId: cur.imMedia.lnkId,
                    ind: M
                }));
                shortCurrency(), (m = l[g])
                    .appendChild(I)
            }
            u.push([e, r, g, w, t]);
            var y = window.event,
                k = y && "click" == y.type && (y.ctrlKey || y.metaKey || y.shiftKey);
            cur.fileApiUploadStarted && void 0 !== i.upload_ind || k || cur.preventBoxHide || (boxQueue.hideLast(), delete cur.dropDoc), void 0 !== i.upload_ind && delete i
                .upload_ind, show(m)
        } else if (u[r]) {
            if (m = l[g = u[r][2]], m.sorter && m.sorter.destroy(), m.qsorter && m.qsorter.destroy(), m.usorter && m.usorter.destroy(), "map" == u[r][0]) {
                var p = cur.imMedia.lnkId;
                show(geByClass("add_media_type_" + p + "_map", ge("add_media_menu_" + p))[0])
            }
            var I = geByClass1("im_preview_ind" + r, m, "div"),
                T = geByClass1("im_media_x", I, "div");
            T && T.tt && T.tt.el && T.tt.destroy(), re(I), u[r] = !1, domFC(m) || hide(m)
        }
        return m && (!browser.msie || browser.version > 8) && (0 === g && m.childNodes.length > 1 ? stManager.add(["sorter.js"], function() {
                m.sorter ? sorter.added(m) : m.childNodes.length > 1 && sorter.init(m, {
                    noscroll: 1,
                    onReorder: IM.saveMedias.pbind(cur.peer)
                })
            }) : 1 === g && m.childNodes.length > 1 ? stManager.add(["usorter.js"], function() {
                m.usorter ? usorter.added(m) : m.childNodes.length > 1 && usorter.init(m, {
                    clsUp: "im_preview_up",
                    onReorder: IM.saveMedias.pbind(cur.peer)
                })
            }) : 2 === g && m.childNodes.length > 1 && stManager.add(["qsorter.js"], function() {
                m.qsorter ? qsorter.added(m) : m.childNodes.length > 1 && qsorter.init(m, IM.qsorterOpts())
            })), shortCurrency(), IM.saveMedias(), toggle("im_add_media", this.attachedCount() < cur.attachments_num_max), domFC(d) ? show(d) : (hide(d), IM.onUploadDone()),
            IM.scrollOn(), IM.panelUpdate(!1), !1
    },
    refr: function() {
        var e = ge("im_media_preview");
        e && e.usorter && (!browser.msie || browser.version > 8) && usorter.added(e)
    },
    qsorterOpts: function() {
        return {
            xsize: Math.floor(ge("im_media_dpreview")
                .offsetWidth / 110),
            width: 110,
            height: 83,
            noscroll: 1,
            onReorder: IM.saveMedias.pbind(cur.peer),
            clsUp: "pam_dpic_up"
        }
    },
    showPhoto: function(e, r, i, t) {
        !cur.pvData || cur.pvShown && cur.pvListId == r || delete cur.pvData[r];
        for (var a in ajaxCache) a.toString()
            .match(/^\/al_photos\.php\#act=show&draft_photos/) && delete ajaxCache[a];
        var s = IM.getMedias(cur.peer),
            o = [];
        return each(s, function(e, r) {
            r && "photo" == r[0] && o.push(r[1] + "/" + (cur.imPhLists[r[1]] || ""))
        }), i.additional = {
            draft_photos: o.join(";")
        }, showPhoto(e, r, extend(i, {
            queue: 1
        }), t)
    },
    onMediaProgress: function(e, r, i) {
        debugLog("onProgress", e, r, i);
        var t = ge("im_progress_preview"),
            a = intval(i.loaded / i.total * 100),
            s = (i.fileName || i.name || "")
            .replace(/[&<>"']/g, ""),
            o = s ? r + "_" + s : r,
            n = s ? s.length > 33 ? s.substr(0, 30) + "..." : s : "";
        if (ge("upload" + o + "_progress_wrap")) setStyle(ge("upload" + o + "_progress"), {
            width: a + "%"
        }), show("upload" + o + "_progress");
        else {
            var c = '<div class="page_attach_progress_wrap">        <div id="upload' + o + '_progress" class="page_attach_progress" style="width: ' + a +
                '%;"></div>      </div></div>',
                l = ce("div", {
                    id: "upload" + o + "_progress_wrap",
                    innerHTML: '<div class="fl_l">' + c + "</div>" + (n ? '<div class="attach_label fl_l">' + n + "</div>" : "") +
                        '<div class="progress_x fl_l" style="margin-top: 0px;" onmouseover="animate(this, {opacity: 1}, 200); showTooltip(this, {text: \'' + getLang(
                            "dont_attach") + '\', shift: [6, 3, 3]})" onmouseout="animate(this, {opacity: 0.6}, 200);" onclick="Upload.terminateUpload(' + r + ", '" +
                        (s || r) + "', this);\"></div>",
                    className: "clear_fix upload_" + r + "_progress"
                }, {
                    marginTop: "6px"
                });
            t.appendChild(l), show(t), toggle("im_add_media", this.attachedCount() < cur.attachments_num_max), a || hide("upload" + o + "_progress")
        }
        return !1
    },
    onMyTyping: function(e) {
        e = intval(e);
        var r = cur.tabs[e];
        if (!(-2e9 >= e) && r) {
            var i = vkNow();
            cur.myTypingEvents[e] && i - cur.myTypingEvents[e] < 5e3 || (cur.myTypingEvents[e] = i, ajax.post("al_im.php", {
                act: "a_typing",
                peer: e,
                hash: r.hash,
                gid: cur.gid
            }))
        }
    },
    onTyping: function(e, r) {
        var i = vkNow();
        e > 2e9 ? (cur.typingEvents[e] || (cur.typingEvents[e] = {}), cur.typingEvents[e][r] = i) : cur.typingEvents[e] = i, IM.updateTyping(!1)
    },
    _restoreDialogTypings: function() {
        cur._currDialogTypings = cur._currDialogTypings || {};
        var e = vkNow();
        each(cur._currDialogTypings, function(r, i) {
            (e - i.ts > 6e3 || !cur.typingEvents[i.peer]) && delete cur._currDialogTypings[r]
        });
        var r = [];
        for (var i in cur._currDialogTypings) cur._currDialogTypings.hasOwnProperty(i) && r.push(i);
        if (r.length) each(cur._currDialogTypings, function(e, r) {
            IM._showDialogTyping(e, r.names, !0)
        }), clearTimeout(IM._dialogTypingsClearTimer), IM._dialogTypingsClearTimer = setTimeout(IM._restoreDialogTypings, 7e3);
        else
            for (var t = geByClass("dialogs_row"), i = 0; i < t.length; i++) IM._showDialogTyping(t[i].getAttribute("id"), "")
    },
    _showDialogTyping: function(e, r, i) {
        var t = ge(e);
        if (t) {
            var a = geByClass1("dialogs_msg_body", t),
                s = geByClass1("dialogs_typing_box", t);
            r ? a && (s || (s = ce("div", {
                className: "dialogs_typing_box"
            }), a.parentNode.appendChild(s)), s.innerHTML = '<div class="dialogs_typing_icon"></div>' + r, i ? (setStyle(a, {
                opacity: 0
            }), setStyle(s, {
                opacity: 1,
                marginTop: "-7px"
            })) : setTimeout(function() {
                cssAnim(a, {
                    opacity: 0
                }, {
                    duration: 200
                }), cssAnim(s, {
                    opacity: 1,
                    marginTop: -7
                }, {
                    duration: 200
                })
            }, 10)) : (cssAnim(a, {
                opacity: 1
            }, {
                duration: 200
            }), cssAnim(s, {
                opacity: 0,
                "margin-top": 0
            }, {
                duration: 200
            }, function() {
                re(s), setStyle(a, {
                    opacity: 1
                })
            }), a && (a.style.webkitTransition = "", a.style.MozTransition = "", a.style.transition = "", a.style.msTransition = ""))
        }
    },
    updateTypingDialogsList: function() {
        if (cur.dialogs_members && cur.lang.mail_im_multi_typing_w_count && getLang("mail_im_multi_typing")) {
            var e = vkNow();
            cur._currDialogTypings = cur._currDialogTypings || {}, each(cur.typingEvents, function(r, i) {
                var t = ge("im_dialog" + r);
                if (t) {
                    var a, s, o = [],
                        n = !0;
                    if (!isObject(i)) {
                        var c = i;
                        i = {}, i[r] = c, n = !1
                    }
                    if (each(i, function(r) {
                            if (e - i[r] < 6e3 && cur.dialogs_members[r]) {
                                var t = cur.dialogs_members[r].first_name;
                                n && cur.dialogs_members[r].last_name && (t += " " + cur.dialogs_members[r].last_name[0] + "."), o.push(t), s = cur.dialogs_members[
                                    r].sex
                            }
                        }), 0 == o.length) a = "", delete cur._currDialogTypings["im_dialog" + r];
                    else if (o.length > 1) {
                        var l = 0,
                            d = !1;
                        if (each(o, function(e, r) {
                                return l += r.length, l > 25 ? (d = e, !1) : void 0
                            }), d !== !1) {
                            d = Math.max(1, d);
                            var u = o.slice(0, d),
                                m = o.length - u.length;
                            a = langNumeric(m, cur.lang.mail_im_multi_typing_w_count, !0), a = a.replace("{users}", u.join(", "))
                                .replace("{users_count}", m)
                        } else {
                            var _ = o.pop();
                            a = getLang("mail_im_multi_typing")
                                .replace("{users}", o.join(", "))
                                .replace("{last_user}", _)
                        }
                    } else o[0] && (a = langSex(s, cur.lang.mail_im_typing)
                        .replace("{user}", o[0]));
                    IM._showDialogTyping(t, a), a && (cur._currDialogTypings["im_dialog" + r] = {
                        names: a,
                        ts: e,
                        peer: r
                    })
                }
            }), cur.gid && IM.updateDialogLocks()
        }
    },
    updateTyping: function(e) {
        var r, i = cur.peer,
            t = i && cur.tabs && cur.tabs[i],
            a = [],
            s = i && cur.typingEvents && cur.typingEvents[i],
            o = vkNow(),
            n = ge("im_typing" + i);
        if (IM._restoreDialogTypings(), IM.updateTypingDialogsList(), -1 != cur.peer && i && t && !IM.r(i)) {
            if (2e9 > i) s && 6e3 > o - s && (a.push(t.name), r = t.sex);
            else {
                var c = t.data.members;
                each(s || {}, function(e, i) {
                    c[e] && i && 6e3 > o - i && (a.push(c[e].name), r = c[e].sex)
                })
            }
            if (!a.length) return void(e ? (setStyle(n, {
                opacity: 0
            }), hide(n)) : fadeTo(n, 1e3, 0));
            if (1 == a.length) cur.lang.mail_im_typing && val(n, langSex(r, cur.lang.mail_im_typing)
                .replace("{user}", a[0]));
            else {
                var l = a.pop();
                val(n, getLang("mail_im_multi_typing")
                    .replace("{users}", a.join(", "))
                    .replace("{last_user}", l))
            }
            IM.hideLastAct(i), e ? (show(n), setStyle(n, {
                opacity: 1
            })) : fadeTo(n, 200, 1), IM.scrollAppended()
        }
    },
    shouldActivateSmallSearch: function(e) {
        return 0 !== cur.gid && (!cur.searchQ && !cur.qDay || -2 !== cur.peer)
    },
    attachedCount: function(e) {
        var r = ge("im_media_preview"),
            i = ge("im_media_dpreview"),
            t = ge("im_media_mpreview"),
            a = ge("im_docs_preview"),
            s = ge("im_sdocs_preview"),
            o = ge("im_progress_preview");
        return r.childNodes.length + i.childNodes.length + t.childNodes.length + a.childNodes.length / (a.sorter ? 2 : 1) + s.childNodes.length + (e ? 0 : o.childNodes.length)
    },
    toEnd: function() {
        nav.objLoc.msgid && IM.updateLoc();
        var e;
        IM.loadHistory(cur.peer, e, e, 1);
        var r = ge("im_to_end_wrap");
        "progress_inline" != domFC(r)
            .className && val("im_to_end_wrap", '<span data-for="' + cur.peer + '" class="progress_inline"></span>')
    },
    updateMoreNew: function(e) {
        if (!cur.tabs[e]) return void removeClass(cur.imEl.controls, "im_to_end_controls");
        if (toggle("im_morenew" + e, cur.tabs[e].q_offset), cur.peer == e && cur.tabs[e].q_offset) {
            var r = ge("im_to_end_wrap"),
                i = cur.tabs[e].q_new_cnt || 0,
                t = i ? "(" + getLang("mail_im_new_messages", i) + ")" : "",
                a = trim(getLang("mail_goto_history_end")
                    .replace("{new}", t));
            if ("progress_inline" == domFC(r)
                .className && domFC(r)
                .getAttribute("data-for") == e && isVisible(r)) return;
            val(r, '<span class="im_to_end">' + a + "</span>"), addClass(cur.imEl.controls, "im_to_end_controls")
        } else removeClass(cur.imEl.controls, "im_to_end_controls")
    },
    starTT: function(e) {
        showTooltip(e, {
            text: function(e) {
                var r = intval(e.parentNode.parentNode.getAttribute("data-important"));
                return r ? cur.lang.mail_im_unmark_important : cur.lang.mail_im_mark_important
            }.bind(this, e),
            black: 1,
            shift: [14, 4, 0]
        })
    },
    updatePeer: function(e, r, i, t) {
        if (!cur.tabs[e]) return !1;
        cur.tabs[e].history = 1;
        var a, s, o = 0,
            n = 0,
            c = 0;
        for (var l in r) ++o, 0 > t && ++c, s = cur.tabs[e].msgs[l], cur.tabs[e].msgs[l] = r[l], a = ge("mess" + l), addEvent(a, "mouseover", IM.logMessState.pbind(1, l)),
            addEvent(a, "mouseout", IM.logMessState.pbind(0, l)), r[l][0] || !r[l][1] || s && s[1] && !(t > 0) || (cur.nu ? intval(cur.tabs[e].unr[l]) <= 0 && (++n, cur.tabs[
                e].unr[l] = 1) : (++n, addEvent(a, "mouseover", IM.onNewMsgOver.pbind(e, l))));
        cur.tabs[e].msg_count += o, cur.tabs[e].unread += n, cur.tabs[e].all_shown = i, cur.tabs[e].q_offset -= c, cur.tabs[e].q_offset < 0 && (cur.tabs[e].q_offset = 0),
            toggle("im_more" + e, !i), toggle("im_log" + e, cur.tabs[e].msg_count), toggle("im_none" + e, !cur.tabs[e].msg_count), IM.updateMoreNew(e)
    },
    readLastMsgs: function() {
        var e = cur.peer,
            r = cur.tabs[e];
        if (!IM.r(e) && !cur.nu && !r.markingRead && r.unread) {
            var i, t = [];
            for (var a in r.msgs) r.msgs[a][0] || !r.msgs[a][1] || (i = ge("im_susp_wrap" + a)) && !hasClass(i, "im_msg_susp_wrap_done") || t.push(a);
            IM.markRead(e, t)
        }
    },
    decHash: function(e) {
        ! function(e) {
            cur.decodedHashes[e] = function(e) {
                var r = ge ? "" : "___";
                for (____ = 0; ____ < e.length; ++____) r += e.charAt(e.length - ____ - 1);
                return geByClass ? r : "___"
            }(e.substr(e.length - 5) + e.substr(4, e.length - 12))
        }(e)
    },
    decodehash: function(e) {
        return cur.decodedHashes || (cur.decodedHashes = {}), cur.decodedHashes[e] || IM.decHash(e), cur.decodedHashes[e]
    },
    updLA: function(e) {
        cur.nu && (_la = vkNow(), IM.markPeer(cur.peer))
    },
    init: function(e) {
        var r = nav.objLoc;
        if (e.fail_try) return nav.setLoc(extend({
            fail_try: e.fail_try
        }, r)), void nav.reload();
        r = extend({}, r), r.fail_try && delete r.fail_try, nav.setLoc(r), setFavIcon("/images/fav_chat" + _iconAdd + ".ico"), ge("content")
            .appendChild(ce("iframe", {
                id: "transport_frame",
                src: e.transport_frame
            })), e.mutex_key && IM.subscribeLocks(e.mutex_key), removeEvent(document, "mousemove mousedown keydown", IM.updLA), addEvent(document,
                "mousemove mousedown keydown", IM.updLA), addEvent(geByClass1("_add_to_responded"), "click", IM.markAnswered),
            e.emoji_stickers && (window.emojiStickers = e.emoji_stickers);
        var i = geByClass1("_filter_search");
        if (i && addEvent(i, "keypress keydown", IM.shortSearch), extend(cur, e, {
                deletedRows: {},
                imPhLists: {},
                module: "im",
                fail_try: 0,
                unreadMsgs: 0,
                lastOperation: 0,
                errorTimeout: 1,
                filterTO: 0,
                titleTO: 0,
                txtsblock: {},
                blocksTs: {},
                wasFocused: 0,
                lastDialogsY: 0,
                lastDialogsPeer: 0,
                multi_friends: {},
                lpMode: (13033 == vk.id ? 10 : 2) + 64,
                selMsgs: [],
                selSpam: [],
                selSpamSingle: !1,
                hiddenChats: {},
                deletedDialogs: {},
                myTypingEvents: {},
                typingEvents: {},
                emojiId: {},
                tsDiff: e.timestamp ? 900 * Math.round((vkNow() / 1e3 - e.timestamp) / 900) : 0,
                imInited: !0,
                imEl: {
                    rowsWrap: ge("im_rows_wrap"),
                    rows: ge("im_rows"),
                    friends: ge("im_friends"),
                    head: ge("page_header"),
                    nav: ge("im_nav_wrap"),
                    bar: ge("im_bar"),
                    cont: ge("im_content"),
                    controls: ge("im_controls_wrap"),
                    resizable: ge("im_footer_filler")
                },
                hideReferrer: !0
            }), e.left_menu) {
            var t = geByTag1("a", ge("l_msg"));
            t && (t.href = "/im")
        }
        delete cur.tabs.t;
        for (var a in cur.tabs) - 4 != a && (cur.tabs[a] = extend(cur.tabs[a], {
            hash: IM.decodehash(cur.tabs[a].hash),
            unr: {},
            msg_count: 0,
            q_offset: a == cur.peer ? cur.tabs[a].q_offset : 0,
            q_new: {},
            q_new_cnt: 0,
            history: 0,
            unread: 0,
            inUpto: a == cur.peer ? cur.tabs[a].inUpto : 0,
            outUpto: a == cur.peer ? cur.tabs[a].outUpto : 0,
            auto: 0,
            new_msgs: [],
            sent: 0,
            delayed: []
        }));
        cur.fixedScroll = !(browser.msie && browser.version < 8 || browser.mobile), cur.scrollNode = browser.msie6 ? pageNode : window, cur.withUpload = !(browser.msie111 ||
            browser.safari_mobile) && cur.upload_options;
        var s = ge("im_send");
        createButton(s, IM.send), !browser.mobile && s && (s.onmouseover = function() {
            showTooltip(s, {
                text: cur.ctrl_submit_hint,
                className: "im_submit_side_tt",
                slideX: -15,
                shift: cur.fixedScroll ? [244, -36, -123] : [244, -31, 500],
                hasover: 1,
                toup: 1,
                showdt: 700,
                hidedt: 700,
                onCreate: function() {
                    var e = cur.ctrl_submit ? 1 : 0;
                    radioBtns.im_submit = {
                        els: Array.prototype.slice.apply(geByClass("radiobtn", ge("im_submit_hint_opts"))),
                        val: e
                    }, hasClass(radioBtns.im_submit.els[e], "on") || (addClass(radioBtns.im_submit.els[e], "on"), removeClass(radioBtns.im_submit.els[
                        1 ^ e], "on"))
                }
            })
        }), cur.withUpload && ImUpload.init();
        var o = IM.r();
        toggle("im_peer_controls_wrap", !o), toggle("im_sound_controls", o), toggle("im_more-2", -2 == cur.peer && cur.searchOffset), toggle("im_none-2", -2 == cur.peer &&
            !geByTag1("tr", ge("im_log_search"))), toggle("im_more-4", -4 == cur.peer && cur.spamOffset), toggle("im_none-4", -4 == cur.peer && !geByTag1("tr", ge(
            "im_log_spam"))), toggle(cur.imEl.bar, -3 != cur.peer), toggle(cur.imEl.controls, -3 != cur.peer);
        var n = ge("im_sound");
        if ((cur.sound_off = !!ls.get("sound_notify_off")) && val("im_sound", getLang("mail_im_sound_off")), addEvent(n, "click", function() {
                return cur.sound_off ? (cur.sound_off = !1, ls.set("sound_notify_off", 0), val("im_sound", getLang("mail_im_sound_on"))) : (cur.sound_off = !0, ls.set(
                    "sound_notify_off", 1), val("im_sound", getLang("mail_im_sound_off"))), !1
            }), cur.urlsCancelled = {}, cur.uiNotifications = {}, cur.notify_on = window.DesktopNotifications && DesktopNotifications.supported()) {
            cur.notify_on = DesktopNotifications.checkPermission() <= 0, ls.get("im_ui_notify_off") && (cur.notify_on = !1);
            var c = ge("im_browser_notify");
            show(c), c = geByTag1("a", c), cur.notify_on || (c.innerHTML = getLang("mail_im_notifications_off"));
            var l = function(e) {
                window.DesktopNotifications ? (cur.notify_on = DesktopNotifications.checkPermission() <= 0, cur.notify_on || e ? cur.notify_on ? (c.innerHTML = getLang(
                    "mail_im_notifications_on"), ls.set("im_ui_notify_off", 0)) : showFastBox({
                    title: getLang("global_error"),
                    dark: 1
                }, getLang("mail_please_enable_notifications")) : DesktopNotifications.requestPermission(l.bind(null, !0))) : (cur.notify_on = !1, ls.set(
                    "im_ui_notify_off", 0))
            };
            addEvent(c, "click", function() {
                return cur.notify_on ? (cur.notify_on = !1, c.innerHTML = getLang("mail_im_notifications_off"), ls.set("im_ui_notify_off", 1)) : l(), !1
            })
        }
        addEvent(window, "focus", IM.onWindowFocus), addEvent(window, "blur", IM.onWindowBlur);
        var d = geByClass1("_add_to_fav");
        addEvent(d, "click", function(e) {
            IM.starDialog(cur.peer);
            cancelEvent(e), setTimeout(function() {
                triggerEvent(this, "mouseout")
            }.bind(this))
        }), addEvent(d, "mouseover", function(e) {
            showTooltip(this, {
                text: function() {
                    var e = 0;
                    return cur.tabs[cur.peer] && (e = cur.tabs[cur.peer].folders & IM.FOLDER_IMPORTANT), e ? getLang("mail_im_unmark_important") :
                        getLang("mail_im_mark_important")
                },
                black: 1,
                center: !0,
                shift: [0, 0, 5, 0]
            })
        }), addEvent(geByClass1("_add_to_responded"), "mouseover", function(e) {
            showTooltip(this, {
                text: getLang("mail_end_conversation"),
                black: 1,
                center: !0,
                shift: [0, 0, 5, 0]
            })
        });
        for (var a in cur.tabs) cur.tabs[a].elem = ge("im_tab" + a), IM.initTabEvents(a), IM.initTxt(a);
        IM.initTabEvents(ge("im_tab_cancel_mark")), IM.initTabEvents(ge("im_tab_cancel_spam_mark"));
        var u = ge("im_filter"),
            m = ge("im_filter_reset");
        if (placeholderSetup(u, {
                back: !0
            }), addEvent(u, "keydown keypress", function(e) {
                -2 != cur.peer && IM.r(cur.peer) ? (IM.activateTab(0), clearTimeout(cur.filterTO), cur.filterTO = setTimeout(function() {
                    IM.filterFriends(!0)
                }, 10)) : e.keyCode != KEY.RETURN || IM.r(cur.peer) || IM.searchMessages()
            }), addEvent(u, "keyup", function(e) {
                toggle(m, val(this))
            }), addEvent(u, "focus", function() {
                cur.focused = -1, IM.restoreTitle(), clearTimeout(cur.filterTO), IM.filterFriends(!1, !0)
            }), addEvent(u, "blur", function() {
                cur.focused = 0
            }), toggle(m, val(u)), addEvent(m, "mouseover mouseout click", function(e) {
                return "click" != e.type ? void(isVisible(m) && animate(m, {
                    opacity: "mouseover" == e.type ? 1 : .5
                }, 100)) : (val(u, ""), elfocus(u), triggerEvent(u, "keyup"), void(-2 == cur.peer && IM.searchMessages()))
            }), IM.cacheFriends(), -2 == cur.peer && (IM.setFullQ(cur.searchQ), isVisible("im_rows-2") || (hide("im_more-2"), show("im_none-2")), setTimeout(elfocus.pbind(
                "im_filter"), 0), IM.calendarUpdTip(cur.searchTip)), cur.peer ? IM.updateFriends() : (IM.filterFriends(), setTimeout(
                "if (!cur.peer && !ge('im_dialogs')) ge('im_filter').focus()", 0)), IM.initEvents(), IM.initInts(), IM.updateTopNav(IM.shouldActivateSmallSearch()), window
            .devicePixelRatio >= 2) var _ = {
            bgsprite: "/images/icons/im_actions_iconset2_2x.png?10",
            bgSize: "20px 382px"
        };
        else var _ = {
            bgsprite: "/images/icons/im_actions_iconset2.png?10"
        };
        if (browser.mozilla && 0 === cur.gid ? _.leftOffset = 47 : _.leftOffset = 55, browser.mozilla && (_.topOffset = 1), cur.actionsMenu = initCustomMedia(
                "chat_actions", [], _), IM.r()) hide("soviet_im_img"), (-2 == cur.peer || -4 == cur.peer) && IM.scrollOn();
        else {
            IM.updatePeer(cur.peer, cur.tabs[cur.peer].msgs, cur.tabs[cur.peer].all_shown, 1), IM.applyPeer(), nav.objLoc.msgid || ge("im_unread_bar" + cur.peer) ? (IM.updateScroll(!
                1, !0), IM.scrollOn(!1, nav.objLoc.msgid ? nav.objLoc.msgid : -1)) : IM.scrollOn();
            show("soviet_im_img")
        }
        if (cur.fixedScroll) {
            var g = geByClass("top_info_wrap", ge("page_wrap"));
            each(g, function() {
                hide(this)
            }), hide(_stlSide), setTimeout(function() {
                each(g, function() {
                    hide(this)
                }), hide(_stlSide)
            }, 110);
            var p = cur.imEl.head.clientHeight,
                f = getXY(cur.imEl.head, !0)[1],
                h = cur.imEl.head.clientWidth,
                v = ls.get("im_toggler_attached" + vk.id) ? 0 : IM.getFillerHeight();
            setStyle(cur.imEl.head, {
                width: h,
                top: f
            }), setStyle("side_bar", {
                top: p + f
            }), IM.resizableSet(v), setStyle(cur.imEl.nav, {
                top: p + f
            }), setStyle(cur.imEl.rowsWrap, {
                height: "auto"
            }), -3 != cur.peer && (addClass(bodyNode, "im_fixed_nav"), _fixedNav = !0), removeClass(bodyNode, "im_fixed_nav_loading")
        } else hide("im_footer_sh", "im_footer_filler"), setStyle("im_resizer_wrap", {
            cursor: "default",
            visibility: "hidden"
        });
        re("im_fixed_nav_progress_wrap"), -3 == cur.peer && IM.initWrite(), (IM.r() || !nav.objLoc.msgid) && IM.updateScroll(), cur.imPeerMedias = {}, cur.imSortedMedias = {};
        var b = [
            ["photo", getLang("profile_wall_photo")],
            ["video", getLang("profile_wall_video")],
            ["audio", getLang("profile_wall_audio")],
            ["doc", getLang("profile_wall_doc")],
            ["map", getLang("profile_wall_map")]
        ];
        if (cur.gid || b.push(["gift", getLang("profile_wall_gift")]), cur.imMedia = initAddMedia("im_add_media_link", "im_media_preview", b, {
                mail: 1,
                onCheckURLDone: IM.onUploadDone,
                toId: cur.gid ? -cur.gid : void 0,
                blockPersonal: cur.gid ? 1 : 0,
                docParams: cur.gid ? {
                    imhash: cur.im_doc_hash,
                    from: "from_gim"
                } : {}
            }), val("im_media_preview", ""), cur.imMedia.onChange = IM.onMediaChange, cur.imMedia.onProgress = IM.onMediaProgress, cur.imMedia.attachedCount = IM.attachedCount,
            cur.nav.push(function(e, r, i, t) {
                if (cur.gid && e[0] && !IM.r(cur.peer) && IM.lockRelease(cur.peer), cur.gid && e[0] && (showBackLink(!1), cur.lockCheckcerTO && clearInterval(cur.lockCheckcerTO)),
                    void 0 !== e[0] || i.act) return void(window.history && "scrollRestoration" in history && (history.scrollRestoration = "manual"));
                if (i.sel && !IM.r(i.sel)) cur.multi_appoint = !1, IM.selectPeer(IM.idToPeer(i.sel), i.msgid);
                else if (i.email) IM.addEmail(-2e9, i.email);
                else if (i.q) IM.setFullQ(i.q), toggle("im_filter_reset", cur.searchQ), IM.searchMessages();
                else if (-4 == i.sel) IM.spamMessages();
                else if (-5 == i.sel) IM.importantMessages();
                else if (void 0 !== e.sel) {
                    var i = e.sel;
                    IM.activateTab("0" === i || "-3" === i ? intval(i) : -1, t.back ? 3 : 0)
                } else void 0 !== e.q && IM.activateTab(-1);
                return !1
            }), placeholderSetup("im_chat_title_input"), cur.destroy.push(function() {
                removeEvent(document, "mousemove mousedown keydown", IM.updLA), setFavIcon("/images/favicon" + (vk.intnat ? "_vk" : "new") + _iconAdd + ".ico"),
                    clearInterval(cur.checkConnectionInt), clearTimeout(cur.checkTO), clearTimeout(cur.updateScrollTO), clearTimeout(cur.updateFriendsTO), clearTimeout(
                        cur.filterTO), clearInterval(cur.titleTO), clearTimeout(cur.setLocTO), clearInterval(cur.scrollInt), clearInterval(cur.updateNotifierInt),
                    clearTimeout(cur.scrollTO), clearTimeout(cur.notifyTO), clearTimeout(cur.correspondentsTO), clearInterval(cur.updateTypingInt), removeEvent(cur.scrollNode,
                        "scroll", IM.onScroll), removeEvent(cur.scrollNode, "mousewheel", IM.onWheel), removeEvent(document, "keydown", IM.onKey), removeEvent(window,
                        "focus", IM.onWindowFocus), clearTimeout(window.__fTO), removeEvent(window, "blur", IM.onWindowBlur), removeEvent(window,
                        "DOMMouseScroll mousewheel", IM.onWheel), removeEvent(document, "DOMMouseScroll", IM.onWheel);
                var e = geByClass1("_filter_search");
                if (e && removeEvent(e, "keypress keydown", IM.shortSearch), cur.fixedScroll && (each(geByClass("top_info_wrap", ge("page_wrap")), function() {
                            show(this)
                        }), removeEvent(window, "resize", IM.updateScroll), setStyle(cur.imEl.head, {
                            width: "",
                            top: ""
                        }), setStyle("side_bar", {
                            top: ""
                        }), setStyle(cur.imEl.nav, {
                            top: ""
                        }), setStyle(cur.imEl.controls, {
                            bottom: ""
                        }), setStyle(cur.imEl.cont, {
                            padding: 0
                        }), setStyle(cur.imEl.rowsWrap, "height", ""), removeClass(bodyNode, "im_fixed_nav"), _fixedNav = !1, show(_stlLeft, _stlSide), _stlShown = 1,
                        hide("im_top_sh", "im_bottom_sh")), window.curFastChat && curFastChat.inited);
                delete IM.makeRequest, delete cur.imMakeRequest
            }), updGlobalPlayer(), e.show_notify) {
            var M = ge("im_switch_btn");
            showTooltip(M, {
                content: '<div class="im_switch_notify"><div class="im_switch_notify_title">' + e.show_notify + "</div>" + e.show_notify_cont +
                    '<div class="im_switch_notify_btn"><div class="button_blue"><button onclick="ge(\'im_switch_btn\').tt.hide();">' + e.show_notify_close +
                    '</button></div></div></div><div class="im_switch_notify_pointer"></div>',
                showdt: 0,
                slide: 15,
                slideX: 0,
                shift: [0, 6, 0],
                forceup: !0,
                nohide: !0,
                nohideover: !0,
                noload: 1
            }), cur.switchTooltip = M
        }
        if (e.text_data || e.media_data) {
            var w = IM.getTxt(),
                I = replaceEntities(e.text_data || "");
            cur.editable ? (val(w, clean(I)
                .replace(/\n/g, "<br/>")), Emoji.editableFocus(w, !1, !0)) : val(w, I), each(e.media_data || {}, function() {
                IM.onMediaChange.apply(IM, this)
            })
        } else !IM.r() && IM.restoreDraft(cur.peer) && IM.restorePeerMedia(cur.peer);
        (browser.opera_mobile || browser.opera_mini) && hide("im_smile", "imw_smile"), _la = vkNow(), IM.needMark(cur.peer) && IM.markPeer(cur.peer), Notifier.addRecvClbk(
            "im", 0, IM.lcRecv, !0), each(geByClass("_im_disabled_txt"), function() {
            var e = this.getAttribute("data-peer"),
                r = cur.tabs[e],
                i = IM.getTxt(e);
            r.block && cur.gid && IM.toggleInput(r.block[0], i, e, r.block[2])
        }), IM.checkDisableGroupPeer(cur.peer), cur.gid && (IM.updateDialogLocks(), IM.spawnLockChecker())
    },
    lcRecv: function(e) {
        if (!isEmpty(e)) {
            var r = e.act;
            "mute" == r ? IM.updateMutedPeer(e.peer) : "unmute" == r && IM.updateUnmutedPeer(e.peer)
        }
    },
    friendOver: function(e, r) {
        if (cur.multi)
            if (e && "im_friends_sel" == e.parentNode.id) var i = e.parentNode;
            else var i = ge("im_friends_all");
        else var i = cur.imEl.friends;
        var t, a, s = geByClass("im_friend_over", i);
        if (!e) {
            if (e = s[0]) {
                do
                    if (r == KEY.DOWN) {
                        var o = e.nextSibling;
                        o || e.parentNode == i ? o && !o.id && "div" == o.tagName.toLowerCase() && (o = o.firstChild) : (e = e.parentNode.nextSibling, e && (o = e.firstChild)),
                            e = o, a = !0
                    } else {
                        if (r != KEY.UP) return !1;
                        var n = e.previousSibling;
                        n || e.parentNode == i || (e = e.parentNode.previousSibling, n = e && !e.id && "div" == e.tagName.toLowerCase() ? e.lastChild : e), e = n, t = !0
                    }
                while (!hasClass(e, "im_friend") && e)
            } else e = i.firstChild;
            if (!e || !hasClass(e, "im_friend")) return
        }
        if (!hasClass(e, "im_friend_over")) {
            var c = getXY(e)[1],
                l = window.innerHeight || document.documentElement.clientHeight,
                d = scrollGetY(!0);
            r && c > d + l - 60 && scrollToY(c - l + 100, 120), r && d + 130 > c && scrollToY(c - 130, 120);
            for (var u in s) removeClass(s[u], "im_friend_over");
            addClass(e, "im_friend_over")
        }
    },
    onWindowFocus: function() {
        if (IM.updLA(), __afterFocus) {
            if (cur.id != vk.id && -2e9 > cur.id) return void nav.reload({
                force: !0
            });
            var e = cur.peer;
            if (cur.wasFocused ? cur.focused = cur.wasFocused : e ? cur.focused = e : cur.focused = -1, -1 == e && scrollGetY(!0) < 100) {
                var r = !1;
                each(cur.deletedDialogs, function(e, i) {
                    return i ? (r = !0, !1) : void 0
                }), r || IM.updateDialogs()
            } else IM.r() || cur.txtsblock && cur.txtsblock[e] || !IM.restoreDraft(e) ? -3 == cur.peer && IM.restoreWriteDraft() : IM.restorePeerMedia(e);
            IM.restoreTitle(), IM.updateScroll(null, null, !0), clearTimeout(window.__fTO), window.__fTO = setTimeout(IM.updateScroll, 500), IM.readLastMsgs()
        }
    },
    onWindowBlur: function(e) {
        cur.wasFocused = cur.focused, cur.focused = 0
    },
    getFillerHeight: function() {
        var e = lastWindowHeight,
            r = cur.imEl.head.clientHeight,
            i = cur.imEl.nav.offsetHeight;
        return Math.max(0, Math.min(e - r - i - 350, .4 * e) - 100)
    },
    initEvents: function() {
        addEvent(cur.scrollNode, "scroll", IM.onScroll), addEvent(window, "DOMMouseScroll mousewheel", IM.onWheel), addEvent(document, "DOMMouseScroll", IM.onWheel),
            addEvent(document, browser.opera ? "keypress" : "keydown", IM.onKey), cur.fixedScroll ? (addEvent(window, "resize", IM.updateScroll), addEvent(
                "im_resizer_wrap", "mousedown", IM.onResizeStart), addEvent("im_resizer_wrap", "dblclick", IM.toggleResize)) : (addEvent(cur.imEl.rows, "scroll", IM.onScrollIE),
                addEvent(cur.imEl.rows, "mousewheel", function(e) {
                    return this.scrollHeight <= this.clientHeight ? void 0 : !this.scrollTop && e.wheelDeltaY > 0 || this.scrollTop + this.clientHeight >= this.scrollHeight &&
                        e.wheelDeltaY < 0 ? (cancelEvent(e), !1) : void(e.cancelBubble = !0)
                }))
    },
    initInts: function() {
        cur.checkConnectionInt = setInterval(IM.checkConnection, 5e3), cur.checkTO = setTimeout(IM.check, 1e3), cur.updateScrollTO = setTimeout(IM.updateScroll.pbind(!0),
            2e3), clearTimeout(cur.updateFriendsTO), cur.updateFriendsTO = setTimeout(IM.updateFriends, 3e5), cur.updateTypingInt = setInterval(IM.updateTyping.pbind(!
            1), 5e3), cur.updateNotifierInt = setInterval(function() {
            ls.set("im_opened" + vk.id, vkNow())
        }, 1e3)
    },
    addEmail: function(e, r) {
        cur.peer || (val("im_filter", ""), hide("im_filter_reset"));
        var i = {
            act: "a_email_start",
            peer: e
        };
        r && (i.email = r), ajax.post("al_im.php", i, {
            onDone: function(e) {
                cur.tabs[e.peer] && (e.peer && cur.tabs[e.peer] ? IM.activateTab(e.peer) : (IM.addTab(e.peer, e.tab, e.name, e.photo, e.hash, 0, e.data), IM.updateScroll(),
                    cur.tabs[e.peer].history = !1, IM.activateTab(e.peer)), cur.emails[e.peer + "_"] = e.name, IM.cacheFriends(), IM.attachMsgs())
            },
            onFail: function(e) {
                return setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, e, getLang("global_close"))
                    .hide, 4500), !0
            }
        })
    },
    getTextForPeer: function(e) {
        val(IM.getTxt(e), val(IM.getNewTxt()));
        var r = val("imw_title"),
            i = cur.imwMedia ? cur.imwMedia.getMedias() : [];
        r && (show("im_title_wrap" + e), val("im_title" + e, r)), cur.mediaToAdd = [];
        for (var t = 0, a = i.length; a > t; ++t) {
            var s = i[t],
                o = cur.imwMediaSaved[s[0] + s[1]];
            o && cur.mediaToAdd.push(o)
        }
        IM.clearWrite(), cur.mediaToAdd.length && setTimeout(function() {
            for (var e in cur.mediaToAdd) {
                var r = cur.mediaToAdd[e];
                IM.onMediaChange(r[0], r[1], r[2])
            }
            cur.mediaToAdd = !1
        }, 0)
    },
    subscribeLocks: function(e) {
        Notifier.addKey(e, IM.checkLocks), setTimeout(IM.subscribeLocks.pbind(e), 3e4)
    },
    checkLocks: function(e, r) {
        var i = r.events;
        i && (each(i, function(e, r) {
            var i = r.split("<!>");
            i = {
                type: i[0],
                action: parseInt(i[1]),
                resource: i[2],
                peer: i[3],
                whoid: i[4],
                name: i[5]
            }, "mutex" === i.type && IM.processLock(i)
        }), IM.updateDialogLocks())
    },
    updateDialogLocks: function(e) {
        e || (e = cur.blocks);
        for (var r in e) IM.updateDialogLock(r)
    },
    spawnLockChecker: function() {
        cur.lockCheckcerTO = setInterval(function() {
            var e = {};
            for (var r in cur.blocks) {
                if (cur.blocksTs[r] && !cur.blocks[r][0]) {
                    var i = vkNow() - cur.blocksTs[r] > IM.LOCK_TIMEOUT;
                    cur.blocks[r] = i ? [!0] : cur.blocks[r], i && (e[r] = !0), cur.tabs[r] && i && (cur.tabs[r].block = [!0], IM.toggleInput(!0, IM.getTxt(r), r))
                } else cur.blocksTs[r] = vkNow();
                e.length && IM.updateDialogLocks(e)
            }
        }, 500)
    },
    updateDialogLock: function(e, r) {
        if (r || (r = ge("im_dialog" + e)), r) {
            var i = geByClass1("dialogs_msg_body", r),
                t = geByClass1("dialogs_block_box", r);
            t || (t = ce("div", {
                className: "dialogs_block_box"
            }), i.parentNode.appendChild(t));
            var a = cur.blocks[e] ? cur.blocks[e][3] : "";
            if (cur.blocks[e] && !cur.blocks[e][0]) {
                var s = getLang("mail_community_answering")
                    .replace("{username}", a);
                setStyle(i, {
                    visibility: "hidden"
                }), setStyle(t, {
                    opacity: 1
                }), addClass(i.parentNode, "dialogs_blocked_box"), t.textContent = s
            } else setStyle(i, {
                visibility: "visible"
            }), setStyle(t, {
                opacity: 0
            }), t.textContent = "";
            toggleClass(i.parentNode, "dialogs_blocked_box", cur.blocks[e] && !cur.blocks[e][0])
        }
    },
    processLock: function(e) {
        var r = e.action || e.whoid == vk.id;
        if (cur.blocks[e.peer] = [r, parseInt(e.whoid), , e.name], r && (cur.blocksTs[e.peer] = vkNow()), cur.tabs[e.peer] && cur.gid) {
            cur.tabs[e.peer].block = [r, e.whoid];
            var i = IM.getTxt(e.peer);
            i && IM.toggleInput(r, i, e.peer, e.name)
        }
    },
    lockRelease: function(e) {
        ajax.post("al_im.php", {
            act: "a_block_release",
            gid: cur.gid,
            peer: e
        }, {
            onDone: function(r) {
                cur.tabs[e] && r && (cur.tabs[e].block = [!0], cur.txtsblock[e] = !1)
            }
        })
    },
    lockResult: function(e, r) {
        IM.processLock({
            action: r[0],
            whoid: r[1],
            peer: e,
            name: r[2]
        })
    },
    addPeer: function(e, r, i, t, a) {
        if (!IM.r(e) && void 0 !== cur.tabs) {
            if (cur.peer || (val("im_filter", ""), hide("im_filter_reset")), cur.tabs[e] && cur.tabs[e].loading) return r || i || (cur.tabs[e].activate = !0), void(isArray(
                r) && r.length && (cur.tabs[e].events = (cur.tabs[e].events || [])
                .concat(r)));
            if (-1 == cur.peer && (cur.lastDialogsY = scrollGetY(!0), cur.lastDialogsPeer = e), cur.tabs[e] && !r) return cur.gid && !i && ajax.post("al_im.php", {
                act: "a_block",
                peer: e,
                gid: cur.gid
            }, {
                onDone: IM.lockResult.pbind(e)
            }), t && IM.getTextForPeer(e), void(i || (IM.activateTab(e, !1, a), IM.attachMsgs()));
            var s = !r && !i,
                o = vkNow(),
                n = function(e, i, n, c, l, d, u, m, _, g, p, f) {
                    cur.debug && debugLog("fetched in ", vkNow() - o);
                    var h = ge("im_dialog" + e);
                    h && removeClass(h, "dialogs_row_over");
                    var v = cur.bottom;
                    IM.addTab(e, i, n, c, l, d, u, m, g), IM.updateScroll(), t && IM.getTextForPeer(e), f && (r = f.events, s = f.activate, extend(cur.tabs[e], {
                        inUpto: f.inUpto,
                        outUpto: f.outUpto,
                        unr: f.unr,
                        unread: f.unread,
                        block: m,
                        folders: _,
                        idisabled: p
                    })), r && IM.feed(e, r), cur.tabs[e] && (cur.tabs[e].history = !1), s ? (IM.activateTab(e, !1, a), IM.attachMsgs(), IM.scrollOn(!1)) : v && IM.scrollOn(!
                        1), cur.prev_peer || cur.peer == e || (cur.prev_peer = e, IM.updateTopNav(IM.shouldActivateSmallSearch()))
                };
            if (cur.friends[e + "_"] && 0 === cur.gid) {
                var c = cur.friends[e + "_"];
                n(e, c[1], c[3], c[2], c[4], c[5])
            } else {
                cur.tabs[e] = {
                    loading: 1,
                    activate: s,
                    events: r,
                    unread: 0,
                    unr: {},
                    inUpto: 0,
                    outUpto: 0
                };
                var l = ge("im_dialog" + e),
                    d = geByClass1("dialogs_msg_contents", l);
                if (d) var u = d.innerHTML;
                var m = !1;
                ajax.post("al_im.php", {
                    act: "a_start",
                    peer: e,
                    gid: cur.gid,
                    block: cur.gid && s ? 1 : 0
                }, {
                    onDone: function(r) {
                        var i = cur.tabs[e];
                        delete cur.tabs[e], IM.isImportantDialog(r.folders) && n(e, r.tab, r.name, r.photo, r.hash, r.sex, r.data, r.block, r.folders, r.href,
                            r.input_disabled, i)
                    },
                    onFail: function() {
                        delete cur.tabs[e]
                    },
                    showProgress: function() {
                        m = setTimeout(function() {
                            m = !1, d && (setStyle(d, {
                                height: getSize(d)[1]
                            }), d.innerHTML = '<span class="progress_inline" style="margin: 0px 5px;"></span>')
                        }, 1e3)
                    },
                    hideProgress: function() {
                        m ? (clearTimeout(m), m = !1) : d && (setStyle(d, {
                            height: "auto"
                        }), d.innerHTML = u)
                    }
                })
            }
        }
    },
    isImportantDialog: function(e) {
        return !cur.gid || "important" != cur.gfilter || e & IM.FOLDER_IMPORTANT
    },
    initTabEvents: function(e) {
        if (e) {
            if (!e.className) {
                var r = e;
                e = cur.tabs[r].elem, addEvent(e, "click", function() {
                    IM.activateTab(r)
                })
            }
            var i = geByClass1("im_tab2", e),
                t = geByClass1("im_tabx", i);
            addEvent(e, "mouseover", function() {
                addClass(e, "im_tab_over")
            }), addEvent(e, "mouseout", function() {
                removeClass(e, "im_tab_over")
            }), addEvent(t, "mouseover", function() {
                addClass(this, "im_tabx_over")
            }), addEvent(t, "mouseout", function() {
                removeClass(this, "im_tabx_over")
            })
        }
    },
    closeTab: function(e) {
        if (cur.peer == e)
            if (cur.prev_peer && cur.prev_peer != e && cur.tabs[cur.prev_peer]) IM.activateTab(cur.prev_peer);
            else if (cur.gid) IM.activateTab(-1);
        else {
            for (var r = ge("im_tab" + e)
                    .previousSibling; r && (!r.tagName || "div" != r.tagName.toLowerCase());) r = r.previousSibling;
            if (!r)
                for (var r = ge("im_tab" + e)
                        .nextSibling; r && (!r.tagName || "div" != r.tagName.toLowerCase());) r = r.nextSibling;
            IM.activateTab(r ? intval(r.id.substr(6)) : -1)
        }
        cur.tabs[e] && (delete cur.tabs[e].txt, delete cur.tabs[e]), re("im_tab" + e), re("im_txt_wrap" + e), re("im_rows" + e), cur.prev_peer == e && (cur.prev_peer = 0),
            IM.updateUnreadMsgs(), IM.updateTopNav(IM.shouldActivateSmallSearch()), IM.updateScroll(), IM.updateLoc()
    },
    updateTopNav: function(e, r) {
        var i = "active_link",
            t = cur.peer;
        toggleClass("tab_friends", i, 0 == t), toggleClass("tab_dialogs", i, -1 == t), toggleClass("tab_search", i, -2 == t), setStyle("tab_search", {
            display: cur.lastSearchQ ? "block" : ""
        }), toggleClass("tab_write", i, -3 == t), setStyle("tab_write", {
            display: cur.lastWasIMW ? "block" : ""
        }), toggleClass("tab_spam", i, -4 == t), toggleClass("tab_important", i, -5 == t), toggleClass("tab_conversation", i, !IM.r(t));
        var a = IM.r() ? cur.prev_peer || 0 : t;
        if (IM.r(a))
            for (a in cur.tabs) break;
        if (!IM.r(a) && cur.tabs[a]) {
            var s = ge("tab_conversation");
            show(s), ge(s)
                .onclick = function() {
                    return IM.r() && (IM.r(a) ? setStyle(s, "display", "") : (-1 == cur.peer && (cur.lastDialogsY = scrollGetY(!0)), IM.activateTab(a))), !1
                }
        } else setStyle("tab_conversation", "display", "");
        val("im_write", getLang(t || cur.multi ? 0 == cur.gid ? "mail_show_flist" : "mail_back_community" : "mail_im_write_multi")), toggle("im_filter_out", -4 != t && IM.r() &&
                !e || !!cur.qPeerShown), toggle("im_filter_out_groups", -4 != t && IM.r() && e || !!cur.qPeerShown), toggle("im_write_btn", -2 != t && !cur.qPeerShown),
            toggle("im_search_cancel", -2 == t || !!cur.qPeerShown), val("im_search_cancel", getLang(cur.qPeer ? cur.qPeer > 2e9 ? "mail_back_to_conv" :
                "mail_back_to_dialog" : "global_cancel")), toggle("im_search_btn", -2 == t || !!cur.qPeerShown), toggle("im_datesearch_wrap", -2 == t || !!cur.qPeerShown),
            toggle("im_tabs", !IM.r() && !cur.selMsgs.length && !cur.qPeerShown), toggle("im_log_controls", !IM.r() && cur.selMsgs.length), toggle("im_spam_controls", -4 ==
                t && cur.selSpam.length), toggle("im_spam_flush", -4 == t && !cur.selSpam.length), toggle("im_write", 0 != t || !cur.multi && !cur.multi_appoint), toggle(
                "im_top_multi", t > 2e9 && cur.tabs[t].data.top_controls), toggle("im_important_btn", -1 == t && intval(val("im_important_count"))), r || IM.updateTopLink(
                t)
    },
    updateTopLink: function(e) {
        if (e = intval(e), -1 !== e) {
            var r = cur.gid ? "gim" + cur.gid + "?sel=-1" : "im?sel=-1";
            showBackLink(r, getLang(cur.gid ? "mail_im_back_to_dialogs_groups" : "mail_im_back_to_dialogs"), 1)
        } else -1 === e && cur.gid ? showBackLink("club" + cur.gid, cur.gname, 1) : showBackLink(!1);
        cur._noUpLink = e > 0 || -2e9 > e
    },
    resetStyles: function() {
        cur.imEl.head.style.left = ge("side_bar")
            .style.left = cur.imEl.nav.style.left = cur.imEl.controls.style.left = ""
    },
    updateScroll: function(e, r, i) {
        if (!cur.imEl.nav) return !1;
        var t = Math.max(intval(window.innerHeight), intval(document.documentElement.clientHeight)),
            a = cur.imEl.head.clientHeight,
            s = cur.imEl.nav.offsetHeight,
            o = cur.imEl.controls.offsetHeight,
            n = a + s;
        if (cur.fixedScroll) {
            var c = scrollGetY(!0),
                l = !1;
            if (IM.r(cur.peer) && -2 != cur.peer && -4 != cur.peer && -5 != cur.peer) setStyle(cur.imEl.rows, {
                height: "auto"
            });
            else {
                var d = cur.imEl.rows.clientHeight,
                    u = ge("im_rows" + (-5 == cur.peer ? -2 : cur.peer)),
                    m = u.clientHeight;
                m = Math.max(m, t - o - n - 1), setStyle(cur.imEl.rows, {
                    height: m
                }), e !== !0 && m != d && (c += m - d, l = !0), IM.r(cur.peer) && setStyle(u, {
                    minHeight: t - o - n - 21
                })
            }
            var _ = Math.max(o, t - n - cur.imEl.rowsWrap.offsetHeight - 1),
                g = getStyle(cur.imEl.cont, "paddingTop"),
                p = getStyle(cur.imEl.cont, "paddingBottom"),
                f = (getStyle(cur.imEl.cont, "padding") || "")
                .split(" ");
            3 == f.length && (g || (g = f[0]), p || (p = f[2])), g = intval(g), p = intval(p), cur.lastContentH = n + o + 20, -3 != cur.peer ? setStyle(cur.imEl.cont, {
                padding: n + "px 0 " + _ + "px"
            }) : setStyle(cur.imEl.cont, {
                padding: ""
            }), g && g != n && (!cur.bottom || n > g) && (c += n - g, l = !0), l && scrollToY(c, 0);
            var h = e && e !== !0 && "resize" == e.type;
            if (!browser.mozilla && !browser.msie && (cur.lastWW !== lastWindowWidth || h || i)) {
                cur.lastWW = lastWindowWidth;
                var v = ge("page_layout")
                    .offsetLeft,
                    b = v + cur.imEl.cont.offsetLeft;
                cur.imEl.head.style.left = ge("side_bar")
                    .style.left = v + "px", cur.imEl.nav.style.left = cur.imEl.controls.style.left = b + "px", setTimeout(IM.resetStyles, 0)
            }
            r || (h ? IM.panelToTop() : IM.onScroll())
        } else IM.r() ? setStyle(cur.imEl.rows, {
            height: "",
            overflow: ""
        }) : (setStyle(cur.imEl.rows, {
            height: 500,
            overflow: "auto"
        }), setStyle("im_peer_controls", {
            paddingLeft: 68 - (cur.imEl.rows.scrollHeight > cur.imEl.rows.clientHeight ? sbWidth() : 0)
        }))
    },
    panelToTop: function(e) {
        if (e || (clearTimeout(cur.panelResetTo), cur.panelResetTo = setTimeout(IM.panelReset, 1e3)), cur.isPanelToTop) {
            var r = lastWindowHeight - cur.lastWinH,
                i = Math.max(0, cur.oldResizableH + r);
            return void(r && IM.resizableSet(i))
        }
        if (cur.oldResizableH = cur.imEl.resizable.clientHeight, !cur.oldResizableH) return void 0 === cur.wasBottom && (cur.wasBottom = cur.bottom), void(cur.wasBottom &&
            IM.scroll());
        cur.isPanelToTop = !0;
        var t = Math.max(intval(window.innerHeight), intval(document.documentElement.clientHeight));
        cur.lastWinH = t, setStyle(cur.imEl.controls, {
            bottom: "",
            top: t - cur.imEl.controls.offsetHeight + 2
        })
    },
    panelReset: function() {
        if (cur.isPanelToTop) {
            cur.isPanelToTop = !1, delete cur.wasBottom;
            var e = Math.max(intval(window.innerHeight), intval(document.documentElement.clientHeight)),
                r = e - cur.lastWinH,
                i = Math.max(0, Math.min(.4 * e, e + cur.oldResizableH + r - cur.lastContentH, cur.oldResizableH + r));
            r && IM.resizableSet(i), setStyle(cur.imEl.controls, {
                bottom: "-2px",
                top: ""
            }), setTimeout(IM.updateScroll, 0)
        }
    },
    panelUpdate: function(e) {
        if (IM.r() || void 0 === cur.resizableH) return void IM.panelReset();
        var r = IM.getTxt(),
            i = r.clientHeight,
            t = i - 48,
            a = Math.max(0, cur.resizableH - t);
        cur.oldResizableH += a - cur.imEl.resizable.clientHeight, setStyle(cur.imEl.resizable, "height", a), e && t < cur.resizableH ? IM.panelToTop(!0) : IM.panelReset()
    },
    onScroll: function() {
        if (!cur.imEl) return !1;
        var e = lastWindowHeight,
            r = scrollGetY(!0),
            i = Math.max(bodyNode.scrollHeight, pageNode.scrollHeight, scrollNode.scrollHeight),
            t = cur.imEl.cont;
        t.offsetHeight, cur.imEl.controls.offsetHeight;
        if (IM.r() && -2 != cur.peer && -3 != cur.peer && -4 != cur.peer && -5 != cur.peer) {
            var a = cur.peer ? ge("im_more_dialogs") : ge("im_more_friends");
            a && isVisible(a) && a.offsetTop < r + e + 200 && a.onclick()
        }
        if (!cur.fixedScroll) return void hide("im_top_sh", "im_bottom_sh");
        if (!(IM.r() && -2 != cur.peer && -4 != cur.peer && -5 != cur.peer || curBox() || isVisible(layerBG))) {
            var a = ge("im_more" + (-5 == cur.peer ? -2 : cur.peer)),
                s = (cur.tabs[cur.peer] || {})
                .q_offset ? ge("im_morenew" + cur.peer) : !1;
            a && isVisible(a) && 300 > r ? a.onclick() : s && isVisible(s) && s.offsetTop < r + e + 200 && s.onclick()
        }
        toggle("im_top_sh", r > 2), cur.bottom = r >= i - e - 2, toggle("im_bottom_sh", !cur.bottom), r > 30 && cur.switchTooltip && cur.switchTooltip.tt && cur.switchTooltip
            .tt.hide && cur.switchTooltip.tt.hide()
    },
    onWheel: function() {
        IM.updLA(), clearInterval(cur.scrollInt), clearTimeout(cur.scrollTO)
    },
    onScrollIE: function() {
        if (!IM.r()) {
            var e = cur.imEl.rows.scrollHeight,
                r = cur.imEl.rows.clientHeight,
                i = cur.imEl.rows.scrollTop,
                t = e > r;
            toggle("im_top_sh", t && i), toggle("im_bottom_sh", t && e > i + r)
        }
    },
    toggleResize: function(e) {
        var r = cur.imEl.resizable.clientHeight,
            i = r ? 0 : IM.getFillerHeight(),
            t = scrollGetY(!0),
            a = t + 2 * (i - r);
        IM.resizableSet(i), scrollToY(a, 0), triggerEvent(document, "mouseup"), IM.updateScroll(), IM.scroll()
    },
    onResizeStart: function(e) {
        if (!IM.r()) {
            if (cur.focused == cur.peer) try {
                IM.getTxt()
                    .blur()
            } catch (e) {}
            cur.resizeStartY = e.clientY, cur.resizeStartH = cur.imEl.resizable.clientHeight, cur.resizeStartScroll = scrollGetY(!0), cur.emMove = void 0;
            var r = function(e) {
                setStyle(bodyNode, "cursor", ""), removeEvent(document, "mouseup", r), removeEvent(document, "mousemove", IM.onResize), removeEvent(document, "drag",
                    IM.onResize)
            };
            return setStyle(bodyNode, "cursor", "s-resize"), addEvent(document, "mouseup", r), addEvent(document, "mousemove", IM.onResize), addEvent(document, "drag", IM.onResize),
                cancelEvent(e)
        }
    },
    onResize: function(e) {
        var r = e.clientY - cur.resizeStartY,
            i = cur.resizeStartH - r,
            t = !!r;
        return 20 > i ? (i = 0, t = !1) : i > .4 * lastWindowHeight && (i = .4 * lastWindowHeight, t = !1), IM.resizableSet(i), t && scrollToY(cur.resizeStartScroll - r, 0),
            IM.updateScroll(), cancelEvent(e), !1
    },
    resizableSet: function(e) {
        setStyle(cur.imEl.resizable, "height", e), IM.r() || (e -= IM.getTxt()
            .clientHeight - 48), cur.resizableH = e, ls.set("im_toggler_attached" + vk.id, !e)
    },
    onKey: function(e) {
        var r = "INPUT" == e.target.tagName || "TEXTAREA" == e.target.tagName || hasClass(e.target, "im_editable") || e.target.getAttribute("contenteditable");
        if (e.keyCode > 47 && e.keyCode < 58 && !e.altKey) {
            var i = e.keyCode - 49,
                t = 0;
            if (e = e.originalEvent || e, browser.safari ? e.ctrlKey : e.metaKey || e.ctrlKey) return -1 == i && (i = 9), each(ge("im_tabs")
                .childNodes,
                function() {
                    return hasClass(this, "im_tab") || hasClass(this, "im_tab_selected") ? t == i ? (IM.activateTab(this.id.match(/-?\d+/)[0]), !1) : void t++ :
                        void 0
                }), cancelEvent(e)
        }
        if (e.keyCode == KEY.UP || e.keyCode == KEY.DOWN) {
            if (0 == cur.peer) return IM.friendOver(!1, e.keyCode), cancelEvent(e)
        } else if (13 != e.keyCode || 0 != cur.peer && -2 != cur.peer) {
            if (!(e.keyCode != KEY.PAGEUP && e.keyCode != KEY.PAGEDOWN || e.ctrlKey || e.metaKey || browser.opera)) {
                var a = lastWindowHeight - cur.imEl.head.clientHeight - cur.imEl.nav.offsetHeight - cur.imEl.controls.offsetHeight,
                    s = scrollGetY(!0);
                return scrollToY(s + (e.keyCode == KEY.PAGEUP ? -1 : 1) * a, 0), cancelEvent()
            }
            if (!(e.keyCode > 40) || e.ctrlKey || e.metaKey || r || e.keyCode > 165 && e.keyCode < 184) e.keyCode == KEY.ESC && (Emoji.shown ? (Emoji.editableFocus(IM.getTxt(
                cur.peer), !1, !0), Emoji.ttClick(ge(-3 == cur.peer ? "imw_smile" : "im_smile"), !0), cur.emojiFocused = !1) : layers.visible || IM.activateTab(-1));
            else if (cur.editable && !IM.r()) Emoji.editableFocus(ge("im_editable" + cur.peer), !1, !0);
            else {
                var o = ge(IM.r() ? "im_filter" : "im_txt" + cur.peer);
                !o.active && elfocus(o)
            }
        } else {
            var o = geByClass1("im_friend_over", cur.multi ? ge("im_friends_all") : cur.imEl.friends, "div");
            if (-2 == cur.peer || (cur.searchQ || cur.qDay) && !o) cur.peer || (cur.qDay = cur.qPeer = cur.qPeerShown = !1), IM.searchMessages();
            else if (o) return e.target.blur && e.target.blur(), setTimeout(o.onclick, 0), cancelEvent(e)
        }
        return !0
    },
    activateTab: function(e, r, i) {
        0 !== cur.gid && !geByClass1("_peer_tab" + e) && cur.tabs[e] && IM.rewriteGroupTab(e, cur.tabs[e].tab_text, cur.tabs[e].photo, cur.tabs[e].href);
        var t = cur.editable ? "Emoji.editableFocus(ge('im_editable' + cur.peer), false, true)" : "elfocus('im_txt' + cur.peer)";
        if (IM.r(e) || cur.uiNotifications[e] && (cur.uiNotifications[e].cancel(), cur.uiNotifications[e] = !1), cur.peer == e) return void(-1 == e ? (scrollGetY(!0) > 100 &&
            scrollToY(0, 0), IM.updateDialogs(!0)) : !e && r ? (cur.multi = !0, cur.multi_friends = {}, IM.updateTopNav(), IM.updateFriends(!0), setTimeout(
            "if (!cur.peer) ge('im_filter').focus()", browser.msie ? 100 : 0)) : i && (i > 0 && ge("mess" + i) || 0 > i && ge("im_unread_bar" + e) ? IM.scrollOn(!
            1, i) : i > 0 && IM.loadHistory(e, 0, i))); - 1 == e && val("im_filter", ""), cur.multi = !1, cur.multi_friends = {}, cur.multi_appoint = 2 == r ? cur.peer : !
            1, clearTimeout(cur.scrollTO);
        var a = cur.peer;
        if (cur.prev_tab = a, -2 == e || !cur.qPeerShown && -2 != a ? -2 == e && val(geByClass1("input_back_content", domPS(ge("im_filter"))), getLang(
                "mail_search_placeholder")) : val(geByClass1("input_back_content", domPS(ge("im_filter"))), getLang("mail_im_filter_friend_intro")), cur.qPeerShown && cur.qPeerShown !=
            e && delete cur.qPeerShown, cur.imMedia && (cur.urlsCancelled[a] = (cur.imMedia || {})
                .urlsCancelled || [], cur.imMedia.urlsCancelled = (cur.urlsCancelled || {})[e] || []), IM.r(a)) - 4 == a ? IM.uncheckSpamMsgs() : -2 == a ? cur.lastSearchScroll =
            scrollGetY(!0) : -5 == a && (cur.lastImportantScroll = scrollGetY(!0));
        else {
            var s = ge("im_progress_preview");
            if (s.childNodes.length > 0) return showFastBox({
                title: getLang("global_error"),
                dark: 1,
                bodyStyle: "padding: 20px; line-height: 160%;"
            }, getLang("mail_message_wait_until_uploaded")), !1;
            cur.prev_peer = a, !cur.fwdFromPeer && cur.selMsgs.length && IM.uncheckLogMsgs();
            var o = cur.tabs[a] || {};
            cur.bottom ? delete o.lastScrollTop : o.lastScrollTop = scrollGetY(!0), IM.panelUpdate(!1)
        }
        if (!IM.r(a)) {
            geByClass("im_tabx", cur.tabs[a].elem)[0].style.backgroundColor = "";
            var n = "im_tab" + a;
            removeClass(n, "im_tab_selected"), addClass(n, "im_tab")
        }
        if (!IM.r(e)) {
            geByClass("im_tabx", cur.tabs[e].elem)[0].style.backgroundColor = "";
            var n = "im_tab" + e;
            removeClass(n, "im_tab"), addClass(n, "im_tab_selected")
        }
        var c = IM.r(e);
        if (c || IM.r(a)) {
            toggle("im_peer_controls_wrap", !c), toggle("im_sound_controls", c);
            try {
                __adsUpdate("force")
            } catch (l) {
                topError(l, {
                    dt: -1,
                    type: 5,
                    answer: ""
                })
            }
        }
        if (IM.r(a) ? -3 == a && IM.deinitWrite() : hide("im_txt_wrap" + a), IM.r(cur.peer = e)) e ? -1 == e || (-2 == e && cur.lastSearchQ ? (val("im_filter", cur.searchQ =
            cur.lastSearchQ), toggle("im_filter_reset", cur.searchQ), !browser.mobile && elfocus("im_filter")) : -3 == e && IM.initWrite()) : (cur.lastSearchQ = cur.searchQ =
            "", cur.qDay = !1, cur.imDP && cur.imDP.hide(), val("im_filter", ""), hide("im_filter_reset"), setTimeout("if (!cur.peer) ge('im_filter').focus()", browser
                .msie ? 100 : 0), IM.updateFriends(!0));
        else {
            cur.tabs[e].auto = 0, show("im_txt_wrap" + e), cur.txtsblock[e] || (IM.restoreDraft(e), IM.restorePeerMedia(e));
            !browser.mobile && setTimeout("if (!IM.r()) " + t, browser.msie ? 100 : 0)
        }
        IM.updateMoreNew(e);
        var d = ge("im_rows" + (-5 == a ? -2 : a)),
            u = ge("im_rows" + (-5 == e ? -2 : e));
        if (revertLastInlineVideo(d), hide(d), show(cur.imEl.rows.appendChild(u)), IM.applyPeer(), IM.updateTopNav(IM.shouldActivateSmallSearch(), !0), setTimeout(function() {
                IM.updateTopLink(cur.peer)
            }, 0), IM.updateUnreadMsgs(), IM.updateLoc(), cur.gid && IM.switchImportance(!1, cur.tabs[e] && cur.tabs[e].folders & IM.FOLDER_IMPORTANT, e), IM.r(e)) {
            if (IM.updateScroll(!0, -2 == e || -5 == e), -1 == e) {
                var m = cur.lastDialogsY;
                cur.lastDialogsPeer;
                if (cur.lastDialogsY = 0, cur.lastDialogsPeer = 0, 3 == r && m > 100) return void setTimeout(scrollToY.pbind(m, 0), 0);
                IM.updateDialogs()
            }
        } else !cur.tabs[e].history || i ? i > 0 && ge("mess" + i) || 0 > i && ge("im_unread_bar" + e) ? IM.scrollOn(!1, i) : (!cur.tabs[e].history || i > 0) && IM.loadHistory(
            e, 0, i) : IM.updateScroll(!0, !0), IM.readLastMsgs();
        var _ = 0;
        if (cur.nu && !IM.r(e)) {
            var g = cur.tabs[e].inUpto;
            if (cur.tabs[e].unread) {
                for (var p in cur.tabs[e].unr) p > g && (!_ || _ > p) && (_ = p);
                if (_) {
                    var f = ge("im_log" + e),
                        h = ge("mess" + _);
                    f && h ? (re("im_unread_bar" + e), extend(extend(f.insertRow(h.rowIndex), {
                            id: "im_unread_bar" + e,
                            className: "im_unread_bar_tr"
                        })
                        .insertCell(0), {
                            colSpan: 5,
                            className: "im_unread_bar_td",
                            innerHTML: '<div class="im_unread_bar">  <span class="im_unread_bar_wrap"><span class="im_unread_bar_text">' + getLang(
                                "mail_new_unread_msgs") + "</span></span></div>"
                        }), removeClass(h, "im_add_row")) : _ = 0
                }
            } else void 0 === cur.tabs[e].lastScrollTop && re("im_unread_bar" + e)
        }
        IM.r(e) || void 0 === cur.tabs[e].lastScrollTop ? -2 == e && void 0 !== cur.lastSearchScroll && 3 == r ? (scrollToY(cur.lastSearchScroll, 0), delete cur.lastSearchScroll,
                IM.onScroll()) : -5 == e && void 0 !== cur.lastImportantScroll && 3 == r ? (scrollToY(cur.lastImportantScroll, 0), delete cur.lastImportantScroll, IM.onScroll()) :
            cur.nu && !IM.r(e) && cur.tabs[e].unread ? IM.scrollOn(!1, _ ? -1 : 0) : IM.scrollOn(IM.r(e) && -2 != e && -4 != e && -5 != e) : (scrollToY(cur.tabs[e].lastScrollTop,
                0), delete cur.tabs[e].lastScrollTop, IM.onScroll()), IM.updLA();
        var v = window.audioPlayer,
            b = currentAudioId();
        if (v && b && v.showCurrentTrack && v.showCurrentTrack(), cur.tabs[e] && cur.tabs[e].block && cur.gid) {
            var M = IM.getTxt(e);
            IM.toggleInput(cur.tabs[e].block[0], M, e, cur.tabs[e].block[2])
        }
        IM.checkDisableGroupPeer(e), (e > 0 || -3 == e) && (IM.checkEditable(cur.emojiId[e], ge("im_editable" + e)), Emoji.reappendEmoji(cur.emojiId[cur.peer]))
    },
    checkDisableGroupPeer: function(e) {
        if (cur.tabs[e] && 0 > e && cur.tabs[e].idisabled && !cur.gid) {
            var r = IM.getTxt(e),
                i = getLang("mail_cant_send_messages_to_community");
            IM.toggleInput(!1, r, e, " ", i)
        }
    },
    preventFocus: function(e) {
        return setTimeout(function() {
            e.target.blur()
        }, 50), cancelEvent(e)
    },
    toggleInput: function(e, r, i, t, a) {
        cur.txtsblock || (cur.txtsblock = {}), e ? e && (removeClass(r.parentNode, "im_editable_txt_disabled"), r.setAttribute("contenteditable", "true"), r.setDisabled &&
            r.setDisabled(!1), cur.txtsblock[i] && (removeEvent(r, "focus", IM.preventFocus), removeEvent(r.parentNode, "focus keypress keydown keyup paste",
                cancelEvent, !0)), cur.txtsblock[i] && setTimeout(function() {
                r.setPlaceholder(cur.lang.mail_im_enter_msg), IM.restoreDraft(i)
            }, 100), cur.txtsblock[i] = !1) : (addClass(r.parentNode, "im_editable_txt_disabled"), r.removeAttribute("contenteditable"), setTimeout(function() {
                t && (a || (a = getLang("mail_community_answering")
                    .replace("{username}", t)), r.setPlaceholder(a), IM.saveWriteDraft(), Emoji.val(r, ""), r.focus(), r.blur(), r.setDisabled && r.setDisabled(!
                    0))
            }, 100), cur.txtsblock[i] || (addEvent(r, "focus", IM.preventFocus), addEvent(r.parentNode, "focus keypress keydown keyup paste", cancelEvent, !1, !1, !0)),
            cur.txtsblock[i] = !0)
    },
    restorePeerMedia: function(e) {
        var r = [ge("im_docs_preview"), ge("im_media_preview"), ge("im_media_dpreview"), ge("im_media_mpreview"), ge("im_sdocs_preview")],
            i = [!1, !1, !1, !1, !1],
            t = cur.imPeerMedias[e] || [],
            a = cur.imSortedMedias[e] || [],
            s = {},
            o = 0;
        r[0].sorter && r[0].sorter.destroy(), r[1].usorter && r[1].usorter.destroy(), r[2].qsorter && r[2].qsorter.destroy(), each(r, function() {
            val(this, "")
        }), each(a, function(e, a) {
            if (e = a, a = t[a]) {
                var n = se(rs(a[3], {
                        lnkId: cur.imMedia.lnkId,
                        ind: e
                    })),
                    c = intval(a[2]);
                0 > c || c > 4 || ("audio" == a[0] && stManager.add(["audioplayer.css"]), r[c].appendChild(n), i[c] = !0, ++o, s[e] = !0)
            }
        }), each(t, function(e, t) {
            if (t && !s[e] && t[3]) {
                var a = se(rs(t[3], {
                        lnkId: cur.imMedia.lnkId,
                        ind: e
                    })),
                    n = intval(t[2]);
                0 > n || n > 4 || ("audio" == t[0] && stManager.add(["audioplayer.css"]), r[n].appendChild(a), i[n] = !0, ++o)
            }
        }), each(i, function(e, i) {
            toggle(r[e], i)
        }), (!browser.msie || browser.version > 8) && stManager.add(["sorter.js", "usorter.js", "qsorter.js"], function() {
            r[0].childNodes.length > 0 && (r[0].sorter && r[0].sorter.destroy(), sorter.init(r[0], {
                noscroll: 1,
                onReorder: IM.saveMedias.pbind(cur.peer)
            })), r[1].childNodes.length > 1 && (r[1].usorter && r[1].usorter.destroy(), usorter.init(r[1], {
                clsUp: "im_preview_up",
                onReorder: IM.saveMedias.pbind(cur.peer)
            })), r[2].childNodes.length > 1 && (r[2].qsorter && r[2].qsorter.destroy(), qsorter.init(r[2], IM.qsorterOpts()))
        }), toggle("im_add_media", o < cur.attachments_num_max)
    },
    applyPeer: function() {
        var e = cur.peer;
        if (IM.r(e)) return val("im_peer_holders", ""), void hide("im_chat_actions");
        if (cur.imMedia) {
            var r = ge("add_media_menu_" + cur.imMedia.lnkId),
                i = geByClass1("add_media_type_" + cur.imMedia.lnkId + "_gift", r);
            if (i) {
                var t = isVisible(r) ? getSize(r.firstChild)[1] : 0;
                if (toggle(i, e > 0 && 2e9 > e), t && cur.imMedia.menu.reverse) {
                    var a = t - getSize(r.firstChild)[1];
                    r.style.top = intval(r.style.top) + a + "px"
                }
            }
        }
        var s = cur.tabs[e],
            o = s.data,
            n = {},
            c = {};
        if (s.msg_count && (n.search = getLang("mail_im_peer_search")), s.msg_count && !s.all_shown && (n.history = getLang("mail_im_load_all_history")), -2e9 > e ? n.clear =
            getLang("mail_im_delete_email_contact") : s.msg_count && (n.clear = getLang("mail_im_delete_all_history")), e > 0 && 2e9 > e && cur.friends[e + "_"] && !cur.gid &&
            (n.chat = getLang("mail_im_create_chat_with")), !cur.mute_enabled || o && (o.kicked || o.closed) || (inArray(e, cur.mutedPeers) ? n.unmute = getLang(
                "mail_im_unmute") : e > 2e9 && (n.mute = getLang("mail_im_mute"))), e > 2e9) {
            val("im_peer_holders", o.members_grid), val("im_rcpt", o.members_text), addClass(ge("im_peer_controls"), "im_peer_multi"), extend(n, o.actions);
            var l = IM.getTxt(e);
            l.disabled && !o.kicked ? (l.disabled = !1, IM.txtVal(l, ""), cur.editable && (l.contentEditable = "true"), show(l.previousSibling)) : !l.disabled && o.kicked &&
                (l.disabled = !0, IM.txtVal(l, getLang("mail_chat_youre_kicked")), cur.editable && (l.contentEditable = "false"), hide(l.previousSibling)), val(geByClass1(
                    "im_tab3", ge("im_tab" + e), "div"), '<span class="im_tab4">' + s.name + '</span><span id="im_unread' + e + '">' + val("im_unread" + e) + "</span>")
        } else {
            if (-2e9 > e) var d = "/im?sel=e" + (-e - 2e9);
            else if (0 > e) var d = "/club" + Math.abs(e);
            else var d = "/id" + e;
            cur.tabs[e].href && (d = cur.tabs[e].href), val("im_peer_holders", '<div class="im_peer_holder fl_l"><div class="im_photo_holder"><a href="' + d +
                    '" target="_blank"><img src="' + s.photo + '" width="50" height="50"/></a></div><div class="im_status_holder" id="im_status_holder"></div></div>'), cur
                .friends[e + "_"] ? IM.updateOnline(cur.friends[e + "_"][0], cur.friends[e + "_"][5]) : e == vk.id && IM.updateOnline(7, 1)
        }
        var u = [],
            m = {
                invite: 3,
                topic: -19,
                "return": -107,
                leave: -84,
                history: -41,
                search: -171,
                clear: -63,
                chat: 3,
                photos: -213,
                avatar: -192,
                mute: -319,
                unmute: -297
            };
        c.hideItem = -1, c.hideLabel = "", s.msg_count && (n.photos = cur.gid ? getLang("mail_im_show_media_history_group") : getLang("mail_im_show_media_history")), !cur.gid ||
            cur.tabs[e].folders & IM.FOLDER_UNRESPOND ? cur.gid && hide(geByClass1("_add_to_responded")) : show(geByClass1("_add_to_responded")), cur.gid && u.push([
                "block", getLang("mail_block_user"), "3px -360px", IM.blackList.pbind(cur.peer), !1, !1
            ]), each(["chat", "invite", "topic", "avatar", "photos", "search", "history", "mute", "unmute", "clear", "leave", "return"], function(e, r) {
                n[r] && u.push([r, n[r], "3px " + m[r] + "px", IM.onActionMenu.pbind(r), !1, !1])
            }), cur.actions_types = u, cur.actionsMenu.setOptions(c), cur.actionsMenu.setItems(u);
        var _ = !1;
        for (var g in n) {
            _ = !0;
            break
        }
        toggle("im_chat_actions", _), toggle("im_rcpt", e > 2e9), toggleClass(ge("im_peer_controls"), "im_peer_multi", e > 2e9), IM.updateTyping(!0)
    },
    markAnswered: function(e) {
        lockFlatButton(e.target);
        var r = cur.peer;
        ajax.post("al_im.php", {
            act: "a_mark_answered",
            peer: r,
            gid: cur.gid
        }, {
            onDone: function() {
                cur.tabs[r] && (cur.tabs[r].folders |= IM.FOLDER_UNRESPOND), showDoneBox(getLang("mail_marked_as_answered"), {
                    out: 1e3
                }), unlockFlatButton(e.target), IM.activateTab(-1)
            }
        })
    },
    rewriteGroupTab: function(e, r, i, t) {
        r = r.replace(/\s+/g, "&nbsp;");
        var a = se(rs(cur.group_tab_tpl, {
                peer_id: e,
                peer_name: r,
                photo: i,
                href: t
            })),
            s = geByClass1("_a_group_tab");
        return s.innerHTML = "", s.appendChild(a)
    },
    addTab: function(e, r, i, t, a, s, o, n, c) {
        var l, d, u, m = inArray(e, cur.mutedPeers) ? "muted" : "",
            _ = r.replace(/\s+/g, "&nbsp;");
        d = se(rs(cur.tab_template, {
                peer_id: e,
                peer_name: _,
                muted: m
            })), u = ge("im_tabs")
            .appendChild(d), cur.gid && IM.r(cur.peer) && IM.rewriteGroupTab(e, _, t, c), txtWrap = se(rs(cur.txt_template, {
                peer_id: e
            })), txt = geByTag1("textarea", txtWrap), ge("im_texts")
            .appendChild(txtWrap), cur.tabs[e] = {
                name: i,
                tab_text: r,
                photo: t,
                hash: IM.decodehash(a),
                sex: s,
                msgs: {},
                all_shown: 0,
                unr: {},
                msg_count: 0,
                href: c,
                q_offset: 0,
                q_new: {},
                q_new_cnt: 0,
                tables: 0,
                unread: 0,
                inUpto: 0,
                outUpto: 0,
                auto: 1,
                sent: 0,
                new_msgs: [],
                elem: u,
                data: o || !1,
                delayed: [],
                block: n
            }, IM.initTabEvents(e), l = ['<a href="/write', e, '?hist=1&offset=-1" target="_blank" class="im_more" id="im_more', e, '" onclick="return IM.loadHistory(', e,
                ', 1)" style="display: block;"><div class="im_more_text">', getLang("mail_im_more_history"), '</div><div class="im_more_progress">&nbsp;</div></a>',
                '<table cellspacing="0" cellpadding="0" id="im_log', e, '" class="im_log_t"><tbody></tbody></table>', '<a href="/write', e,
                '?hist=1&offset=-1" target="_blank" class="im_morenew" id="im_morenew', e, '" onclick="return IM.loadHistory(', e,
                ', -1)" style="display: none;"><div class="im_more_text">', getLang("mail_im_morenew_history"), '</div><div class="im_more_progress">&nbsp;</div></a>',
                '<div class="im_none" id="im_none', e, '">', getLang("mail_im_here_history"), "</div>", '<div class="im_typing_wrap"><div class="im_typing" id="im_typing',
                e, '"></div><div id="im_lastact', e, '" class="im_lastact"></div></div>', '<div class="error" style="margin: 5px; display: none" id="im_error', e,
                '"></div>'
            ];
        var g = ce("div", {
            className: "im_rows im_peer_rows",
            id: "im_rows" + e,
            innerHTML: l.join("")
        }, {
            display: "none"
        });
        cur.imEl.rows.appendChild(g), IM.initTxt(e), show(ge("im_tab" + e)), IM.updateTopNav(), IM.updateScroll()
    },
    updateFriends: function(e) {
        if (!cur.imEl) return void(window.console && console.trace && console.trace());
        if (e && (toggle("im_friends", !cur.multi), toggle("im_friends_multi", cur.multi), IM.multiFriends()), cur.peer || IM.filterFriends(), cur.friendsLoaded) ajax.post(
            "al_im.php", {
                act: "a_onlines",
                peer: cur.peer
            }, {
                onDone: function(e, r) {
                    for (var i in cur.friends) cur.friends[i][0] = intval(e[intval(i)]);
                    cur.peer ? IM.updateOnline(intval(e[cur.peer]), (cur.tabs[cur.peer] || {})
                        .sex || (cur.friends[cur.peer + "_"] || {})[5]) : IM.filterFriends(), IM.updateCounts(r)
                }
            });
        else {
            if (cur.multi) return;
            ajax.post("al_im.php", {
                act: "a_friends"
            }, {
                onDone: function(e) {
                    cur.friendsLoaded = 1, cur.friends = e, IM.cacheFriends(), cur.peer ? !IM.r() && cur.friends[cur.peer + "_"] && IM.applyPeer() : IM.filterFriends()
                }
            })
        }
        cur.peer > 2e9 && IM.updateChat(cur.peer), clearTimeout(cur.updateFriendsTO), cur.updateFriendsTO = setTimeout(IM.updateFriends, 3e5)
    },
    switchUnr: function(e, r) {
        return 0 !== e && checkEvent(e) ? void 0 : (cur.unr = r, IM.updateDialogs(!0), IM.updateLoc(), 0 === e || cancelEvent(e))
    },
    updateDialogs: function(e) {
        geByClass1("tab_word", ge("tab_dialogs"), "b");
        ajax.post("al_im.php", {
            act: "a_get_dialogs",
            offset: 0,
            unread: cur.unr,
            gid: cur.gid,
            type: cur.gfilter,
            fail_try: cur.fail_try
        }, {
            onDone: function(e, r, i) {
                if (setStyle("im_progress", {
                        display: "none"
                    }), show("im_dialogs_summary"), e.fail_try) return cur.fail_try++, IM.updateDialogs(!0);
                if (cur.fail_try = 0, e.summary) {
                    if (val("im_dialogs_summary", e.summary), cur.gid) {
                        var t = geByClass1("summary", ge("im_dialogs_summary")),
                            a = getLang("mail_average_response_time_admin")
                            .replace("{time}", cur.average_time);
                        t.innerHTML += '<div class="fl_r im_group_average_summary">' + a + "</div>"
                    }
                    show("im_dialogs_summary")
                } else hide("im_dialogs_summary");
                if (r) {
                    var s = ge("im_dialogs"),
                        o = ge("im_more_dialogs") || cur.moreEl,
                        n = ge("im_rows_none"),
                        c = bodyNode.scrollTop,
                        l = !1;
                    s.innerHTML = r, (l = bodyNode.scrollTop != c) && setTimeout(function() {
                        bodyNode.scrollTop = c
                    }), o && s.appendChild(o), s.insertBefore(n, domFC(s)), i ? (s.appendChild(ce("div", {
                            id: "im_dialogs_next",
                            innerHTML: i
                        })), ge("im_more_dialogs")
                        .onclick = function() {
                            return IM.showMoreDialogs(e.offset, e.has_more), !1
                        }, show(o)) : hide(o), hide(n), l && IM.onScroll(), cur.gid && (IM.updateScroll(), IM.updateDialogLocks())
                } else {
                    if (cur.gid) {
                        if (hide("im_dialogs_summary"), "unrespond" == cur.gfilter) return void IM.gfilter("all", geByClass1("_tab_gfilter_all"));
                        if (cur.unr) return void IM.updateCounts(e.cnts);
                        cur.moreEl = ge("im_more_dialogs")
                    }
                    var s = ge("im_dialogs"),
                        n = ge("im_rows_none");
                    cur.gid && (toggle("im_rows_none_all", "important" !== cur.gfilter), toggle("im_rows_none_imp", "important" === cur.gfilter)), s.innerHTML =
                        "", s.appendChild(n), show(n), IM.updateScroll()
                }
                e.folders && 0 == e.folders.unrespond && hide(geByClass1("_tab_gfilter_unrespond")
                    .parentNode), IM.updateCounts(e.cnts), cur.deletedDialogs = {}, IM.updateMutedPeers(e.mutedPeers), IM._restoreDialogTypings()
            }
        }), e && setStyle("im_progress", {
            display: "inline-block"
        })
    },
    cacheFriends: function(e) {
        if (e) {
            cur.friends_cache[e] || (cur.friends_cache[e] = {});
            var r, i = [e];
            (r = parseLatin(e)) && i.push(r), (r = parseLatKeys(e)) && (i.push(r), (r = parseCyr(r)) && i.push(r)), (r = parseCyr(e)) && i.push(r);
            for (var t in i) {
                query = i[t];
                var a = cur.friends_cache[query.substr(0, 1)
                    .toLowerCase()];
                if (a) {
                    query = escapeRE(query);
                    for (var t in a) {
                        if (intval(t) > 2e9) var s = cur.chats[t];
                        else if (intval(t) < -2e9) var s = cur.emails[t];
                        else if (cur.friends[t]) var s = cur.friends[t][1].replace("&nbsp;", " ");
                        new RegExp("^" + query + "|\\s" + query + "|\\(" + query, "gi")
                            .test(s.replace(/�/g, "�")) && (cur.friends_cache[e][t] = 1)
                    }
                }
            }
        } else {
            cur.friends_cache = {};
            for (var t in cur.friends)
                for (var o, s = cur.friends[t][1].replace("&nbsp;", " ")
                        .replace(/�/g, "�"), n = 0;;) {
                    if (o = s.charAt(n)
                        .toLowerCase(), cur.friends_cache[o] || (cur.friends_cache[o] = {}), cur.friends_cache[o][t] = 1, n = s.indexOf(" ", n + 1), -1 == n) break;
                    ++n
                }
            for (t in cur.chats)
                for (var o, s = cur.chats[t].replace("&nbsp;", " ")
                        .replace(/�/g, "�"), n = 0;;) {
                    if (o = s.charAt(n)
                        .toLowerCase(), cur.friends_cache[o] || (cur.friends_cache[o] = {}), cur.friends_cache[o][t] = 1, n = s.indexOf(" ", n + 1), -1 == n) break;
                    ++n
                }
            for (t in cur.emails)
                for (var o, s = cur.emails[t], n = 0;;) {
                    if (o = s.charAt(n)
                        .toLowerCase(), cur.friends_cache[o] || (cur.friends_cache[o] = {}), cur.friends_cache[o][t] = 1, n = s.indexOf(" ", n + 1), -1 == n) break;
                    ++n
                }
        }
    },
    wrapFriends: function(e, r, i, t) {
        var a, s = [];
        for (var o in e)
            if (a = intval(o), !(a > 2e9 || -2e9 > a)) {
                var n = cur.friends[o] || [0, "DELETED"];
                if (1 !== r) {
                    if (r === !0 && !n[0] || r === !1 && n[0] || cur.multi_friends[intval(o)]) continue;
                    if (cur.multi_appoint && cur.tabs[cur.multi_appoint].data.members[intval(o)]) continue;
                    if (cur.friends_to_pass-- > 0) continue;
                    if (++cur.friends_shown > cur.friends_to_show) {
                        var c = "�������� ������ ������";
                        cur.friends_last_list = e, cur.friends_last_match = i, s.push('<a href="#" onclick="IM.showMoreFriends(); return false;" id="im_more_friends">' + c +
                            "</a>");
                        break
                    }
                }
                var l = n[1].replace("&nbsp;", " ");
                i && each(i, function() {
                    var e = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + this + ")(?![^<>]*>)(?![^&;]+;)", "gi");
                    l = l.replace(e, "<em>$1</em>")
                });
                var d = '<div class="im_photo"><img src="' + n[2] + '" class="fl_l" width="43" height="43"/></div><div class="fl_l name"><nobr>' + l + "</nobr></div>";
                if (n[0]) {
                    var u = langSex(n[5], window.global_online_sm);
                    n[0] > 0 && n[0] < 6 && (u += '<b class="mob_onl im_friend_mob_onl" onmouseover="mobileOnlineTip(this, {mid: ' + a +
                        '})" onclick="mobilePromo(); return cancelEvent(event);"></b>'), d += '<div class="online fl_l">' + u + "</div>"
                }
                var m = "";
                if (cur.isPeerFirst && (m = " im_friend_over", cur.isPeerFirst = !1), t) var _ =
                    "onmouseover=\"addClass(this, 'im_friend_over');\" onmouseout=\"removeClass(this, 'im_friend_over');\"";
                else var _ = 'onmousemove="IM.friendOver(this);"';
                s.push('<div class="im_friend', m, '" id="im_friend', intval(o), '" ', _, ' onclick="IM.selectPeer(', intval(o), ')">', d, "</div>")
            }
        return s.join("")
    },
    wrapCorrespondents: function(e, r) {
        clearTimeout(cur.correspondentsTO), cur.correspondentsTO = setTimeout(function() {
            e == cur.searchQ && ajax.post("hints.php", {
                act: "a_json_friends",
                str: e,
                from: "im"
            }, {
                onDone: function(i) {
                    if (e == cur.searchQ) {
                        var t = [];
                        each(i || [], function(e) {
                            var i = intval(this[3]),
                                a = i > 2e9;
                            if (!ge("im_friend" + i)) {
                                var s = this[1];
                                each(r, function() {
                                    var e = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + this + ")(?![^<>]*>)(?![^&;]+;)", "gi");
                                    s = s.replace(e, "<em>$1</em>")
                                });
                                var o = IM.wrapChatPhoto(this[2]),
                                    n = o;
                                a && (n += '<div class="fl_l icon"></div>'), n += '<div class="fl_l name"><nobr>' + s + "</nobr></div>", this[0] &&
                                    (n += '<div class="online fl_l">' + langSex(0, getLang("global_online_sm")) + "</div>");
                                var c = "";
                                a && (c += " im_chat"), cur.isPeerFirst && (c += " im_friend_over", cur.isPeerFirst = !1), t.push(
                                    '<div class="im_friend' + c + '" id="im_friend', i, '" ', 'onmousemove="IM.friendOver(this);"',
                                    ' onclick="IM.selectPeer(', this[3], ')">', n, "</div>")
                            }
                        });
                        var a = ge("im_correspondents");
                        if (a) {
                            var s = a.parentNode,
                                o = t.length > 0,
                                n = cf(t.join(""));
                            if (re(geByClass1("im_friend_not_found", s)), re(geByClass1("im_find_in_mail", s)), !o && cur.multi && (!i || !i.length))
                                return void n.appendChild(ce("div", {
                                    className: "im_friend_not_found",
                                    innerHTML: cur.lang.mail_im_empty_search
                                }));
                            if (!cur.multi)
                                if (cur.multi_appoint) n.appendChild(ce("div", {
                                    className: "im_friend_not_found",
                                    innerHTML: getLang("mail_im_empty_search")
                                }));
                                else {
                                    var c = "im_find_in_mail im_friend" + (o || cur.friends_shown ? "" : " im_friend_over"),
                                        l = ce("a", {
                                            href: "/im?q=" + encodeURIComponent(e),
                                            onmousemove: function() {
                                                IM.friendOver(this)
                                            },
                                            className: c,
                                            innerHTML: '<span class="im_find_mail">' + getLang("mail_im_search_query")
                                                .replace("{query}", "<b>" + clean(e) + "</b>") + "</span>",
                                            onclick: IM.findClick
                                        });
                                    s.insertBefore(l, s.firstChild)
                                }
                            s.replaceChild(n, a)
                        }
                    }
                },
                cache: 1
            })
        }, 100)
    },
    findClick: function(e) {
        return e = e || window.event, checkEvent(e) ? void 0 : (cur.qDay = cur.qPeer = cur.qPeerShown = !1, IM.searchMessages(), cancelEvent(e))
    },
    wrapEmail: function(e, r, i) {
        i || (i = -2e9, -1 == e.split("@")[1].indexOf(".") && (e += "..."));
        var t = "";
        cur.isPeerFirst && (t = " im_friend_over", cur.isPeerFirst = !1);
        var a = ['<div class="im_friend im_chat', t, '" id="im_friend', i, '" onmousemove="IM.friendOver(this);" onclick="IM.selectPeer(', i,
            ')"><div class="im_photo"><img src="/images/contact' + (window.devicePixelRatio >= 2 ? "_2x" : "") +
            '.png?1" class="fl_l" width="43" height="43" /></div><div class="fl_l name"><nobr>', clean(e), "</nobr></div></div>"
        ];
        return a.join("")
    },
    wrapEmails: function(e, r, i) {
        var t = [],
            a = r ? e : cur.emails;
        for (var s in a) {
            var o = intval(s);
            if (!(r && o > -2e9) && (i || !cur.multi || !cur.multi_friends[o])) {
                var n = cur.emails[s];
                if (!(cur.friends_to_pass-- > 0)) {
                    if (!i && ++cur.friends_shown > cur.friends_to_show) {
                        var c = "�������� ������ ������";
                        cur.friends_last_list = e, cur.friends_last_match = r, t.push('<a href="#" onclick="IM.showMoreFriends(); return false;" id="im_more_friends">' + c +
                            "</a>");
                        break
                    }
                    r && each(r, function() {
                        var e = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + this + ")(?![^<>]*>)(?![^&;]+;)", "gi");
                        n = (n || "")
                            .replace(e, "<em>$1</em>")
                    });
                    var l = "";
                    if (cur.isPeerFirst && (l = " im_friend_over", cur.isPeerFirst = !1), i) var d =
                        "onmouseover=\"addClass(this, 'im_friend_over');\" onmouseout=\"removeClass(this, 'im_friend_over');\"";
                    else var d = 'onmousemove="IM.friendOver(this);"';
                    t.push('<div class="im_friend im_chat', l, '" id="im_friend', o, '" ', d, ' onclick="IM.selectPeer(', o,
                        ')"><div class="im_photo"><img src="/images/contact' + (window.devicePixelRatio >= 2 ? "_2x" : "") +
                        '.png?1" class="fl_l" width="43" height="43" /></div><div class="fl_l name"><nobr>', n, "</nobr></div></div>")
                }
            }
        }
        return t.join("")
    },
    wrapChatPhoto: function(e) {
        var r = [];
        if ("string" == typeof e && (e = [e]), 1 == e.length) r.push('<img src="', e[0], '" width="43" height="43" class="fl_l" />');
        else
            for (var i = "", t = 4, a = Math.min(4, e.length), s = 0; s < e.length; s++) {
                var i = e[s];
                if (!i || !t--) break;
                var o = 3 == a && 3 == t || 3 > a ? 43 : 20,
                    n = 43 == o ? "dialogs_inline_chatter_half" : "",
                    c = window.is_rtl ? "margin-left: 0;" : "margin-right: 0;",
                    l = 4 == a && (2 == t || 0 == t) || 3 == a && (1 == t || 2 == t) || 2 == a && 2 == t ? c : "";
                r.push('<span><div class="dialogs_inline_chatter ', n, '" style="', l, '"><img class="dialogs_inline_chatter ', n, '" src="', i, '" width="', o,
                    '" height="', o, '"/></div></span>')
            }
        return '<div class="im_photo">' + r.join("") + "</div>"
    },
    wrapChats: function(e, r) {
        var i = [],
            t = r ? e : cur.chats,
            a = 20;
        for (var s in t)
            if (!(r && intval(s) < 2e9)) {
                var o = cur.chats[s];
                if (!(cur.friends_to_pass-- > 0)) {
                    if (!r && !a--) break;
                    if (++cur.friends_shown > cur.friends_to_show) {
                        var n = "�������� ������ ������";
                        cur.friends_last_list = e, cur.friends_last_match = r, i.push('<a href="#" onclick="IM.showMoreFriends(); return false;" id="im_more_friends">' + n +
                            "</a>");
                        break
                    }
                    var c = o;
                    r && each(r, function() {
                        var e = new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + this + ")(?![^<>]*>)(?![^&;]+;)", "gi");
                        c = c.replace(e, "<em>$1</em>")
                    });
                    var l = "";
                    cur.isPeerFirst && (l = " im_friend_over", cur.isPeerFirst = !1);
                    var d = IM.wrapChatPhoto((cur.chat_photos || {})[s]),
                        u = d + '<div class="fl_l icon"></div><div class="fl_l name"><nobr>' + c + "</nobr></div>";
                    i.push('<div class="im_friend im_chat', l, '" id="im_friend' + intval(s) + '" onmousemove="IM.friendOver(this);" onclick="IM.selectPeer(' + intval(s) +
                        ')">' + u + "</div>")
                }
            }
        return i.join("")
    },
    wrapPeers: function(e, r) {
        var i = "",
            t = '<div id="im_correspondents"></div>';
        if (cur.isPeerFirst = r ? !0 : !1, cur.multi) {
            var a, s = !1;
            for (a in cur.multi_friends || {}) {
                s = !0;
                break
            }
            if (cur.multi_appoint || s || (i += IM.wrapChats(e, r)), cur.friends_shown <= cur.friends_to_show && (i += IM.wrapFriends(e, !0, r)), cur.friends_shown <= cur.friends_to_show &&
                (i += IM.wrapFriends(e, !1, r)), cur.friends_shown <= cur.friends_to_show && (i += IM.wrapEmails(e, r)), cur.addEmailPeer && r) {
                var a = 0;
                for (a in e) break;
                a || (i += IM.wrapEmail(cur.addEmailPeer, r))
            }
            r && !i && (i += '<div class="im_friend_not_found">' + getLang("mail_im_empty_search") + "</div>")
        } else {
            if (i += IM.wrapFriends(e, !0, r), cur.friends_shown <= cur.friends_to_show && (i += IM.wrapFriends(e, !1, r)), cur.friends_shown <= cur.friends_to_show && !
                cur.multi_appoint && (i += IM.wrapChats(e, r)), cur.friends_shown <= cur.friends_to_show && (i += IM.wrapEmails(e, r), cur.addEmailPeer && r)) {
                var a = 0;
                for (a in e) break;
                a || (i += IM.wrapEmail(cur.addEmailPeer, r))
            }
            if (cur.friends_shown <= cur.friends_to_show && r && !cur.multi_appoint && (re("im_correspondents"), i += t, IM.wrapCorrespondents(cur.searchQ, r)), trim(cur.searchQ) &&
                !cur.multi_appoint) {
                var o = "im_find_in_mail im_friend" + (cur.friends_shown ? "" : " im_friend_over");
                i = '<a href="/im?q=' + encodeURIComponent(cur.searchQ) + '" class="' + o +
                    '" onmousemove="IM.friendOver(this)" onclick="return IM.findClick(event)"><span class="im_find_mail">' + getLang("mail_im_search_query")
                    .replace("{query}", "<b>" + clean(cur.searchQ) + "</b>") + "</span></a>" + i
            }
            cur.multi_appoint && r && !cur.friends_shown && !cur.addEmailPeer && (i += '<div class="im_friend_not_found">' + getLang("mail_im_empty_search") + "</div>")
        }
        return i
    },
    showMoreFriends: function() {
        var e = cur.friends_last_list,
            r = cur.friends_last_match;
        cur.friends_to_pass = cur.friends_shown, cur.friends_to_show += 100;
        var i = IM.wrapPeers(e, r),
            t = ge("im_more_friends");
        t.parentNode.removeChild(t), ge("im_friends")
            .appendChild(ce("div", {
                innerHTML: i
            }))
    },
    filterFriends: function(e) {
        var r = trim(val("im_filter"))
            .toLowerCase();
        if (!e || r != cur.searchQ) {
            cur.searchQ = r;
            var i = parseLatin(r),
                t = i ? [escapeRE(r), escapeRE(i)] : r ? [escapeRE(r)] : !1;
            (r.length > 1 && !IM.cacheFriends[r] || 1 == r.length && parseLatin(r)) && IM.cacheFriends(r);
            var a = r ? cur.friends_cache[r] : cur.friends;
            cur.addEmailPeer = 2 == r.split("@")
                .length ? r : !1;
            for (var s in a) break;
            cur.selUser = intval(s), cur.friends_shown = 0, cur.friends_to_show = 100, cur.friends_to_pass = 0;
            var o = IM.wrapPeers(a, t);
            if (!cur.friends_shown) {
                var n = !1;
                for (var c in cur.friends) {
                    n = !0;
                    break
                }!n && cur.friendsLoaded && (o += '<div class="im_none" style="display: block;">' + getLang("mail_im_no_friends") + "</div>")
            }
            val(cur.multi ? "im_friends_all" : "im_friends", o), val(cur.multi ? "im_friends" : "im_friends_all", ""), IM.updateScroll()
        }
    },
    multiFriends: function() {
        var e, r = 0;
        for (e in cur.multi_friends) r++;
        if (toggle("im_friends_none_wrap", !r), toggle("im_friends_yes_wrap", r), r) {
            var e, i = {};
            for (e in cur.multi_friends) e > 0 ? i[e + "_"] = cur.friends[e + "_"] : -2e9 > e && (i[e + "_"] = cur.emails[e + "_"]);
            var t = IM.wrapFriends(i, 1, !1, !0);
            t += IM.wrapEmails(i, 1, !0), val("im_friends_sel", t), val("im_friends_sel_count", getLang("mail_im_X_friends_selected", r))
        }
    },
    selectDialog: function(e, r) {
        if (checkEvent(r)) {
            var i = window.open("/im?sel=" + IM.peerToId(e) + (cur.gid ? "&gid=" + cur.gid : ""), "_blank");
            try {
                i.blur(), window.focus()
            } catch (r) {}
        } else IM.addPeer(e)
    },
    selectPeer: function(e, r) {
        if (!cur.multi) return -2e9 == e && cur.addEmailPeer ? void(cur.multi_appoint ? (IM.updateChat(cur.multi_appoint, !0, {
            new_peer: cur.addEmailPeer
        }), IM.activateTab(cur.multi_appoint)) : IM.addEmail(e, cur.addEmailPeer)) : void(cur.multi_appoint ? (IM.updateChat(cur.multi_appoint, !0, {
            new_peer: e
        }), IM.activateTab(cur.multi_appoint)) : (cur.fixedScroll || (r = 0), IM.addPeer(e, !1, !1, !1, r)));
        if (!(cur.multi && ge("im_chat_start") && buttonLocked("im_chat_start"))) {
            if (e > 2e9) return void IM.addPeer(e);
            var i, t = 0,
                a = ge("im_friend" + e);
            for (i in cur.multi_friends) t++;
            if (-2e9 == e) {
                var s = -2e9;
                for (i in cur.emails) {
                    if (cur.emails[i] == cur.addEmailPeer) {
                        var o = ge("im_filter");
                        return val(o, ""), hide("im_filter_reset"), void o.focus()
                    }
                    intval(i) < s && (s = intval(i))
                }
                e = s - 1, cur.emails[e + "_"] = cur.addEmailPeer.replace(/,/g, "")
            }
            if (cur.multi_friends[e]) re(a), delete cur.multi_friends[e], IM.multiFriends(), IM.filterFriends();
            else {
                if (t >= cur.multi_peers_max - 1) return void setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, getLang("mail_im_multi_limit", cur.multi_peers_max))
                    .hide, 5e3);
                re(a), cur.multi_friends[e] = 1, t && a && ge("im_friends_sel")
                    .appendChild(a), IM.multiFriends()
            }
            var o = ge("im_filter");
            val(o, ""), hide("im_filter_reset"), o.focus()
        }
    },
    startChat: function(e) {
        var r, i = [];
        for (r in cur.multi_friends) - 2e9 > r ? i.push(cur.emails[r + "_"]) : i.push(r);
        if (i.length && !buttonLocked(e)) {
            if (1 == i.length) return void IM.addPeer(i[0]);
            if (i.length >= cur.multi_peers_max) return void setTimeout(showFastBox({
                    title: getLang("global_error"),
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, getLang("mail_im_multi_limit", cur.multi_peers_max))
                .hide, 5e3);
            ajax.post("al_im.php", {
                act: "a_multi_start",
                title: val("im_chat_title_input"),
                peers: i.join(","),
                hash: cur.writeHash
            }, {
                onDone: function(e) {
                    e.peer && cur.tabs[e.peer] ? IM.activateTab(e.peer) : (IM.addTab(e.peer, e.tab, e.name, e.photo, e.hash, 0, e.data), IM.updateScroll(), cur
                        .tabs[e.peer] && (cur.tabs[e.peer].history = !1), IM.activateTab(e.peer)), IM.attachMsgs()
                },
                onFail: function(e) {
                    return setTimeout(showFastBox({
                            title: getLang("global_error"),
                            dark: 1,
                            bodyStyle: "padding: 20px; line-height: 160%;",
                            onHide: function() {
                                IM.activateTab(-1)
                            }
                        }, e, getLang("global_close"))
                        .hide, 4500), !0
                },
                showProgress: lockButton.pbind(e),
                hideProgress: unlockButton.pbind(e)
            }), val("im_chat_title_input", "")
        }
    },
    updateChat: function(e, r, i) {
        var t = cur.tabs[e],
            a = t.data,
            s = [];
        i && (t.lastModifiedTime = vkNow()), vkNow() - t.lastUpdatedTime < 1e4 && !r || (t.lastUpdatedTime = vkNow(), each(a.members, function(e) {
            s.push(e)
        }), ajax.post("al_im.php", extend({
            act: "a_get_chat",
            chat: e - 2e9,
            cur_peers: s.join(","),
            cur_title: replaceEntities(a.title),
            hash: t.hash
        }, i || {}), {
            onDone: function(r, i) {
                IM.receivePeerData(e, i);
                var a, s = ge("im_log" + e),
                    o = s && s.rows.length;
                if (!s) return void debugLog("no chat log found", e, r);
                for (each(r, function() {
                        var r = --t.sent,
                            i = extend(s.insertRow(o++), {
                                className: "im_in im_chat_event",
                                id: "mess" + r
                            }),
                            a = Math.floor(vkNow() / 1e3);
                        i.setAttribute("data-date", a), i.setAttribute("data-from", 0), this.error ? IM.error(this.message, e) : (extend(i.insertCell(0), {
                            className: "im_log_act"
                        }), extend(i.insertCell(1), {
                            innerHTML: this.user || "",
                            className: "im_log_author"
                        }), extend(i.insertCell(2), {
                            innerHTML: this.message,
                            className: "im_log_body"
                        }), extend(i.insertCell(3), {
                            innerHTML: "<span>" + IM.mkdate(a + cur.tsDiff) + "</span>",
                            className: "im_log_date"
                        }), extend(i.insertCell(4), {
                            className: "im_log_rspacer"
                        })), hide("im_none" + e), show("im_log" + e)
                    }); a = t.delayed.shift();) IM.addMsg.apply(IM, a);
                cur.peer == e && IM.scrollAppended()
            },
            onFail: function() {
                return i ? void 0 : !0
            }
        }))
    },
    inviteToChat: function() {
        if (!(cur.peer <= 2e9)) {
            var e, r = cur.tabs[cur.peer].data.members,
                i = 0;
            for (e in r) i++;
            return i >= cur.multi_peers_max ? void setTimeout(showFastBox({
                    title: getLang("global_error"),
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, getLang("mail_im_multi_limit", cur.multi_peers_max))
                .hide, 5e3) : cur.tabs[cur.peer].data.closed ? void setTimeout(showFastBox({
                    title: getLang("global_error"),
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, getLang("mail_im_invite_closed"))
                .hide, 5e3) : void IM.activateTab(0, 2)
        }
    },
    chatAva: function() {
        return cur.peer <= 2e9 ? void 0 : cur.tabs[cur.peer].data.closed ? void setTimeout(showFastBox({
                title: getLang("global_error"),
                dark: 1,
                bodyStyle: "padding: 20px; line-height: 160%;"
            }, getLang("mail_im_invite_closed"))
            .hide, 5e3) : void Page.ownerPhoto(cur.peer)
    },
    leaveChat: function(e) {
        var r = cur.peer;
        if (!(2e9 >= r))
            if (e) ajax.post("al_im.php", extend({
                act: "a_leave_chat",
                chat: r - 2e9,
                hash: cur.tabs[r].hash
            }), {
                onDone: function() {
                    delete cur.chats[r + "_"], cur.chat_photos && delete cur.chat_photos[r + "_"], IM.cacheFriends(), IM.closeTab(r)
                }
            });
            else var i = showFastBox({
                title: getLang("mail_chat_leave_title"),
                dark: 1,
                bodyStyle: "padding: 20px; line-height: 160%;"
            }, getLang("mail_chat_leave_confirm"), getLang("mail_leave_chat"), function() {
                IM.leaveChat(!0), i.hide()
            }, getLang("global_cancel"), function() {
                i.hide()
            })
    },
    returnToChat: function() {
        var e = cur.peer;
        2e9 >= e || ajax.post("al_im.php", extend({
            act: "a_return_to_chat",
            chat: e - 2e9,
            hash: cur.tabs[e].hash
        }), {
            onFail: function(e) {
                return setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, e, getLang("global_close"))
                    .hide, 4500), !0
            }
        })
    },
    changeChatTopic: function(e) {
        var r = cur.peer;
        if (!(2e9 >= r)) {
            var i = function() {
                    var e = trim(val(a));
                    return e ? (e !== cur.tabs[r].data.title && IM.updateChat(r, !0, {
                        new_title: e
                    }), void t.hide()) : void notaBene(a)
                },
                t = showFastBox({
                        title: getLang("mail_chat_topic_change_title"),
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, '<div class="im_change_topic_wrap clear_fix"><div class="im_change_topic_label fl_l ta_r">' + getLang("mail_chat_topic_change_label") +
                    '</div><div class="im_change_topic_labeled fl_l"><input id="im_change_topic_val" class="text" /></div></div>', getLang("global_save"), i, getLang(
                        "global_cancel"),
                    function() {
                        t.hide()
                    }),
                a = ge("im_change_topic_val");
            val(a, replaceEntities(cur.tabs[cur.peer].name)), elfocus(a), addEvent(a, "keydown", function(e) {
                13 == e.keyCode && i()
            })
        }
    },
    showChatMembers: function(e) {
        var r = cur.peer;
        if (!(2e9 >= r)) {
            cur.tabs[r];
            return !showBox("al_im.php", {
                act: "a_show_members_box",
                chat: r - 2e9
            }, {
                stat: ["boxes.css"],
                params: {
                    dark: 1
                }
            }, e)
        }
    },
    searchPeer: function() {
        val("im_filter", ""), hide("im_write_btn", "im_filter_reset"), val("im_search_cancel", getLang(cur.peer > 2e9 ? "mail_back_to_conv" : "mail_back_to_dialog")), show(
                "im_search_btn", "im_search_cancel", "im_datesearch_wrap"), show("im_filter_out"), hide("im_tabs", "im_log_controls"), IM.updateScroll(!0), cur.qPeer = cur
            .qPeerShown = cur.peer, cur.qDay = !1, cur.imDP && cur.imDP.hide(), IM.calendarUpdTip(), val(geByClass1("input_back_content", domPS(ge("im_filter"))), getLang(
                "mail_search_placeholder")), setTimeout(elfocus.pbind("im_filter"), 0)
    },
    searchMessages: function() {
        var e = ge("im_filter"),
            r = trim(val(e)),
            i = ge("im_search_btn"),
            t = geByClass1("input_back_content", domPS(e));
        return cur.lastSearchQ = cur.searchQ = r || "", cur.imDP && cur.imDP.hide(), r || cur.qDay ? (val(t, getLang("mail_search_placeholder")), void(buttonLocked(i) || (
            IM.activateTab(-2), cur.searchOffset = !1, cur.searchLoading = !0, delete cur.lastSearchScroll, ajax.post("al_im.php", {
                act: "a_search",
                q: IM.fullQ(),
                gid: cur.gid
            }, {
                onDone: function(e, i, t) {
                    IM.calendarUpdTip(t),
                        cur.searchLoading = !1, cur.searchOffset = i;
                    var a = !e;
                    if (toggle("im_more-2", e && i), toggle("im_log_search", !a), toggle("im_none-2", a), !a) {
                        var s = ge("im_log_search");
                        s.parentNode.replaceChild(se(e), s)
                    }
                    IM.scrollOn(), IM.updateLoc(), cur.lastSearchQ = r
                },
                showProgress: lockButton.pbind(i),
                hideProgress: unlockButton.pbind(i)
            })))) : (delete cur.qPeerShown, val(t, getLang("mail_im_filter_friend_intro")), void(IM.r(cur.peer) ? cur.qPeer ? (setTimeout(IM.selectPeer.pbind(cur.qPeer,
            0), 50), delete cur.qPeer) : setTimeout(IM.activateTab.pbind(-1), 50) : (toggle("im_tabs", !cur.selMsgs.length), toggle("im_log_controls", cur.selMsgs
            .length), hide("im_filter_out"), delete cur.qPeer, IM.updateScroll(!0))))
    },
    showMoreSearch: function() {
        if (-5 == cur.peer) return IM.showMoreImportant();
        var e = cur.searchQ,
            r = cur.qPeer,
            i = cur.qDay;
        return cur.searchLoading || cur.searchOffset === !1 || !e && !i ? !1 : (cur.searchLoading = !0, ajax.post("al_im.php", {
            act: "a_search",
            q: IM.fullQ(),
            offset: cur.searchOffset,
            gid: cur.gid
        }, {
            showProgress: addClass.pbind("im_more-2", "im_more_loading"),
            hideProgress: removeClass.pbind("im_more-2", "im_more_loading"),
            onDone: function(t, a) {
                if (e == cur.searchQ && r == cur.qPeer && i == cur.qDay) {
                    if (!t) return void hide("im_more-2");
                    cur.searchLoading = !1;
                    var s = ge("im_log_search");
                    if (!s) return void debugLog("table#im_log_search not found");
                    cur.searchOffset = a;
                    var o, n, c = geByTag1("tbody", s),
                        l = se(t),
                        d = geByTag1("tbody", l),
                        u = c.firstChild;
                    s.parentNode.insertBefore(l, s), toggle("im_more-2", a), IM.updateScroll(), setTimeout(function() {
                        for (; o = d.firstChild;) o.id.match(/messq\d+/) ? (n = o.id, o.id = "", ge(n) ? d.removeChild(o) : (o.id = n, c.insertBefore(
                            o, u))) : d.removeChild(o);
                        re(l), IM.updateScroll()
                    }, 0)
                }
            },
            onFail: function() {
                cur.searchLoading = !1
            }
        }), !1)
    },
    importantMessages: function() {
        IM.activateTab(-5), cur.importantOffset = !1, cur.importantLoading = !0, delete cur.lastImportantScroll, ajax.post("al_im.php", {
            act: "a_important"
        }, {
            onDone: function(e, r) {
                cur.importantLoading = !1, cur.importantOffset = r;
                var i = !e;
                if (i) hide("im_log_search");
                else {
                    var t = ge("im_log_search");
                    t.parentNode.replaceChild(se(e), t), toggle("im_more-2", r)
                }
                toggle("im_none-2", i), IM.scrollOn(), IM.updateLoc()
            }
        })
    },
    showMoreImportant: function() {
        return cur.importantLoading ? !1 : (cur.importantLoading = !0, ajax.post("al_im.php", {
            act: "a_important",
            offset: cur.importantOffset
        }, {
            showProgress: addClass.pbind("im_more-2", "im_more_loading"),
            hideProgress: removeClass.pbind("im_more-2", "im_more_loading"),
            onDone: function(e, r) {
                cur.importantLoading = !1;
                var i = ge("im_log_search");
                if (!i) return void debugLog("table#im_log_search not found");
                cur.importantOffset = r;
                var t, a, s = geByTag1("tbody", i),
                    o = se(e),
                    n = geByTag1("tbody", o),
                    c = s.firstChild;
                i.parentNode.insertBefore(o, i), toggle("im_more-2", r), IM.updateScroll(), setTimeout(function() {
                    for (; t = n.firstChild;) t.id.match(/messq\d+/) ? (a = t.id, t.id = "", ge(a) ? n.removeChild(t) : (t.id = a, s.insertBefore(t,
                        c))) : n.removeChild(t);
                    re(o), IM.updateScroll()
                }, 0)
            },
            onFail: function() {
                cur.importantLoading = !1
            }
        }), !1)
    },
    spamMessages: function() {
        IM.activateTab(-4), cur.selSpam = [], cur.spamOffset = !1, cur.spamLoading = !0, ajax.post("al_im.php", {
            act: "a_spam",
            gid: cur.gid
        }, {
            onDone: function(e, r) {
                cur.spamLoading = !1, cur.spamOffset = r;
                var i = !e;
                if (toggle("im_more-4", e && r), toggle("im_log_spam", !i), toggle("im_none-4", i), !i) {
                    var t = ge("im_log_spam");
                    t.parentNode.replaceChild(se(e), t)
                }
                IM.scrollOn(), IM.updateLoc()
            }
        })
    },
    showMoreSpam: function() {
        return cur.spamLoading ? !1 : (cur.spamLoading = !0, ajax.post("al_im.php", {
            act: "a_spam",
            offset: cur.spamOffset,
            gid: cur.gid
        }, {
            showProgress: addClass.pbind("im_more-4", "im_more_loading"),
            hideProgress: removeClass.pbind("im_more-4", "im_more_loading"),
            onDone: function(e, r) {
                cur.spamLoading = !1;
                var i = ge("im_log_spam");
                if (!i) return void debugLog("table#im_log_spam not found");
                cur.spamOffset = r;
                var t, a, s = geByTag1("tbody", i),
                    o = se(e),
                    n = geByTag1("tbody", o),
                    c = s.firstChild;
                i.parentNode.insertBefore(o, i), toggle("im_more-4", r), IM.updateScroll(), setTimeout(function() {
                    for (; t = n.firstChild;) t.id.match(/messs\d+/) ? (a = t.id, t.id = "", ge(a) ? n.removeChild(t) : (t.id = a, s.insertBefore(t,
                        c))) : n.removeChild(t);
                    re(o), IM.updateScroll()
                }, 0)
            },
            onFail: function() {
                cur.spamLoading = !1
            }
        }), !1)
    },
    showMoreDialogs: function(e, r) {
        var i = ge("im_dialogs_next");
        i && (i.id = "", r ? ajax.post("al_im.php", {
            act: "a_get_dialogs",
            offset: e,
            unread: cur.unr,
            gid: cur.gid,
            type: cur.gfilter
        }, {
            onDone: function(e, r) {
                extend(cur.dialogs_members, JSON.parse(e.dialogs_members)), r && (ge("im_dialogs")
                    .appendChild(ce("div", {
                        id: "im_dialogs_next",
                        innerHTML: r
                    })), ge("im_more_dialogs")
                    .onclick = function() {
                        return IM.showMoreDialogs(e.offset, e.has_more), !1
                    }, ge("im_dialogs")
                    .appendChild(ge("im_more_dialogs")), IM.onScroll()), IM.updateCounts(e.cnts), IM._restoreDialogTypings()
            }
        }) : hide("im_more_dialogs"))
    },
    logMessState: function(e, r) {
        if (cur.selSpamSingle) return !0;
        var i = indexOf(cur.selMsgs, r),
            t = indexOf(cur.selSpam, r),
            a = ge("mess" + r); - 1 == i && -1 == t && a && !cur.deletedRows[r] && (toggleClass(a, "im_msg_over", e), -4 == cur.peer && !cur.spam.markingRead && hasClass(
            "mess" + r, "im_new_msg") && IM.markRead(-4, [r.substr(1)]))
    },
    checkLogClick: function(e, r) {
        if (r = r || window.event, !e && !r) return !1;
        var i = r.target || r.srcElement,
            t = 4,
            a = !1,
            s = /wrapped|im_log_act|im_log_ract|im_log_author|im_log_body|im_log_date|im_log_rspacer|page_media_link_desc/;
        do
            if (!i || i == e || i.onclick || i.onmousedown || "A" == i.tagName || "IMG" == i.tagName && !hasClass(i, "emoji") && !hasClass(i, "emoji_css") && !hasClass(i,
                    "im_gift") || "TEXTAREA" == i.tagName || hasClass(i, "play_new") || (a = s.test(i.className))) break;
        while (t-- && (i = i.parentNode));
        if (!a) return cur.updateScrollTO = setTimeout(IM.updateScroll.pbind(!1), 100), !0;
        var o = trim((window.getSelection && window.getSelection() || document.getSelection && document.getSelection() || document.selection && document.selection.createRange()
                .text || "")
            .toString());
        return o ? !0 : !1
    },
    checkLogMsg: function(e) {
        if (cur.selSpamSingle) return e == cur.selSpamSingle ? IM.uncheckSpamSingle() : !1;
        var r = indexOf(cur.selMsgs, e),
            i = ge("mess" + e);
        if (i && !cur.deletedRows[e]) {
            if (-1 == r) {
                if (cur.selMsgs.length >= 100) return !1;
                cur.selMsgs.length || (cur.lastNavHeight = cur.imEl.nav.offsetHeight), cur.selMsgs.push(e), data(i, "tween") && (data(i, "tween")
                    .stop(!1), setStyle(i, {
                        backgroundColor: ""
                    })), i.hltt && (clearTimeout(i.hltt), setStyle(i, {
                    backgroundColor: ""
                })), addClass(i, "im_sel_row"), removeClass(ge("mess_check" + e), "im_log_check_on"), setStyle("ma" + e, {
                    visibility: ""
                })
            } else cur.selMsgs.splice(r, 1), removeClass(i, "im_sel_row"), cur.selMsgs.length || (cur.lastNavHeight = cur.imEl.nav.offsetHeight);
            toggleClass("im_log_fav_btn", "im_log_fav_btn__active", IM.checkLogIsImportant()), val("im_n_marked", getLang("mail_im_X_sel_msgs", cur.selMsgs.length)),
                toggle("im_tabs", !cur.selMsgs.length && !cur.qPeerShown), toggle("im_log_controls", cur.selMsgs.length && !cur.qPeerShown), IM.updateScroll()
        }
    },
    checkLogIsImportant: function() {
        if (!cur.selMsgs.length || IM.r()) return !1;
        var e = !0,
            r = cur.tabs[cur.peer].msgs;
        return each(cur.selMsgs, function(i, t) {
            return r[t] && !r[t][2] ? (e = !1, !1) : void 0
        }), e
    },
    markLogMsgsImportant: function(e) {
        var r = IM.checkLogIsImportant(),
            i = cur.selMsgs;
        ajax.post("al_im.php", {
            act: "a_mark_important",
            ids: i,
            val: r ? 0 : 1,
            from: "im",
            hash: cur.mark_hash,
            gid: cur.gid
        }, {
            onDone: function(e, i) {
                var t = cur.tabs[cur.peer].msgs;
                r = r ? 0 : 1, each(e, function(e, i) {
                    void 0 !== t[i] && (t[i][2] = r);
                    var a = ge("mess" + i);
                    toggleClass(a, "im_important_msg", r), IM.updateImportantTT(a, r)
                }), IM.uncheckLogMsgs(), IM.updateCounts(i)
            },
            showProgress: function() {
                lockButton(e), addClass("im_log_fav_btn", "im_log_fav_btn__loading")
            },
            hideProgress: function() {
                unlockButton(e), removeClass("im_log_fav_btn", "im_log_fav_btn__loading")
            }
        })
    },
    showImportantTT: function(e) {
        if (IM.r()) var r = e.parentNode.parentNode,
            i = r.id.substr(5),
            t = !intval(r.getAttribute("data-notimportant"));
        else var i = e.parentNode.parentNode.id.substr(4),
            t = cur.tabs[cur.peer].msgs[i][2];
        var a = t ? getLang("mail_im_toggle_important_off") : getLang("mail_im_toggle_important");
        showTooltip(e, {
            text: a,
            showdt: 0,
            black: 1,
            shift: [10, -2, 0],
            className: "im_important_tt"
        })
    },
    updateImportantTT: function(e, r) {
        var i = geByClass1("im_important_toggler", e),
            t = i && i.tt,
            a = r ? getLang("mail_im_toggle_important_off") : getLang("mail_im_toggle_important");
        if (t)
            if (isVisible(t.container)) {
                var s = geByClass1("tt_text", t.container);
                val(s, a)
            } else t.hide({
                fasthide: 1
            }), t.destroy()
    },
    toggleImportant: function(e) {
        var r = cur.tabs[cur.peer].msgs[e][2];
        return ajax.post("al_im.php", {
            act: "a_mark_important",
            ids: [e],
            val: r ? 0 : 1,
            from: "im",
            hash: cur.mark_hash,
            gid: cur.gid
        }, {
            onDone: function(e, i) {
                var t = cur.tabs[cur.peer].msgs;
                r = r ? 0 : 1, each(e, function(e, i) {
                    void 0 !== t[i] && (t[i][2] = r);
                    var a = ge("mess" + i);
                    toggleClass(a, "im_important_msg", r), IM.updateImportantTT(a, r)
                }), IM.updateCounts(i), toggleClass("im_log_fav_btn", "im_log_fav_btn__active", IM.checkLogIsImportant())
            }
        }), !1
    },
    toggleListImportant: function(e) {
        var r = ge("messq" + e),
            i = intval(r.getAttribute("data-notimportant"));
        return ajax.post("al_im.php", {
            act: "a_mark_important",
            ids: [e],
            val: i ? 1 : 0,
            from: "im",
            hash: cur.mark_hash,
            gid: cur.gid
        }, {
            onDone: function(e, t) {
                each(e, function(e, t) {
                    r = ge("messq" + t), r.setAttribute("data-notimportant", i ? 0 : 1), toggleClass(r, "im_important_msg", i), IM.updateImportantTT(r,
                        i)
                }), IM.updateCounts(t)
            }
        }), !1
    },
    markLogMsgs: function(e, r) {
        if (cur.selMsgs.length && !IM.r()) {
            if ("cancel" == e) return void IM.uncheckLogMsgs();
            if ("reply" == e) {
                cur.fwdFromPeer = cur.peer, IM.attachMsgs();
                var i = IM.getTxt(cur.peer);
                return void(cur.editable ? Emoji.editableFocus(i, !1, !0) : elfocus(i))
            }
            if ("fwd" == e) return cur.fwdFromPeer = cur.peer, void IM.activateTab(-1);
            each(cur.selMsgs, function(e, r) {
                cur.deletedRows[r] = 1
            }), ajax.post("al_mail.php", {
                act: "a_mark",
                msgs_ids: cur.selMsgs.join(","),
                mark: e,
                from: "im",
                hash: cur.mark_hash,
                gid: cur.gid
            }, {
                onDone: function(r, i, t) {
                    each(cur.selMsgs, function(r, t) {
                        cur.deletedRows[t] = 1;
                        var a = ge("mess" + t),
                            s = geByClass1("wrapped", a),
                            o = ce("div", {
                                id: "mres" + t,
                                className: "im_marked_res",
                                innerHTML: i.replace(/%s/, t)
                            });
                        hide(s), s.parentNode.insertBefore(o, s), addClass(a, "del" == e ? "im_del_row" : "im_spam_row")
                    }), IM.uncheckLogMsgs()
                },
                showProgress: lockButton.pbind(r),
                hideProgress: unlockButton.pbind(r)
            })
        }
    },
    uncheckLogMsgs: function() {
        each(cur.selMsgs, function(e, r) {
            var i = ge("mess" + r);
            removeClass(i, "im_sel_row"), removeClass(i, "im_msg_over")
        }), cur.selMsgs = [], cur.lastNavHeight = cur.imEl.nav.offsetHeight, show("im_tabs"), hide("im_log_controls"), IM.updateScroll()
    },
    attachMsgs: function() {
        cur.fwdFromPeer && cur.selMsgs.length && (IM.onMediaChange("mail", cur.selMsgs.join(";"), [cur.selMsgs.length]), IM.uncheckLogMsgs())
    },
    checkSpamMsg: function(e) {
        var r = indexOf(cur.selSpam, e),
            i = ge("mess" + e);
        if (i && !cur.deletedRows[e]) {
            if (-1 == r) {
                if (cur.selSpam.length >= 100) return !1;
                cur.selSpam.push(e), addClass(i, "im_sel_row"), removeClass(ge("mess_check" + e), "im_log_check_on"), setStyle("ma" + e, {
                    visibility: ""
                })
            } else cur.selSpam.splice(r, 1), removeClass(i, "im_sel_row");
            val("im_spam_n_marked", getLang("mail_im_X_sel_msgs", cur.selSpam.length)), val("im_spam_mark_no", getLang("mail_im_mark_notspam", cur.selSpam.length)), val(
                "im_spam_mark_del", getLang("mail_im_mark_delspam", cur.selSpam.length)), toggle("im_spam_controls", cur.selSpam.length), toggle("im_spam_flush", !cur.selSpam
                .length)
        }
    },
    markSpamMsgs: function(e, r) {
        if (cur.selSpam.length && (cur.selSpamSingle || -4 == cur.peer)) {
            if ("cancel" == e) return void IM.uncheckSpamMsgs();
            each(cur.selSpam, function(e, r) {
                cur.deletedRows[r] = 1
            }), ajax.post("al_mail.php", {
                act: "a_mark",
                msgs_ids: cur.selSpam.join(",")
                    .replace(/s/g, ""),
                mark: e,
                from: "im",
                hash: cur.mark_hash,
                gid: cur.gid
            }, {
                onDone: function(r, i, t) {
                    each(cur.selSpam, function(r, t) {
                        if (cur.selSpamSingle == t) {
                            var a = ge("im_susp_wrap" + t);
                            if (addClass(a, "im_msg_susp_wrap_done"), "nospam" == e) return each(geByTag("a", geByClass1("im_msg_susp", a, "div")),
                                function() {
                                    this.href = this.href.replace(/&?h=-1/, "")
                                        .replace("?&", "?"), this.setAttribute("onclick", (this.getAttribute("onclick") || "")
                                            .replace(/,?\s*("|'|)h\1\s*:\s*-\s*1/, ""))
                                }), void delete cur.deletedRows[t]
                        }
                        cur.deletedRows[t] = 1;
                        var s = ge("mess" + t),
                            o = geByClass1("wrapped", s),
                            n = ce("div", {
                                id: "mres" + t,
                                className: "im_marked_res",
                                innerHTML: i.replace(/%s/, t)
                            });
                        hide(o), o.parentNode.insertBefore(n, o), addClass(s, "delspam" == e ? "im_del_row" : "im_spam_row")
                    }), IM.uncheckSpamMsgs(), IM.updateCounts(t)
                },
                showProgress: lockButton.pbind(r),
                hideProgress: unlockButton.pbind(r)
            })
        }
    },
    openMsgDialog: function(e, r) {
        var i = ge("mess" + e);
        if (i) {
            var t = i.getAttribute("data-from");
            t && IM.selectDialog(t, r)
        }
    },
    uncheckSpamMsgs: function() {
        return cur.selSpamSingle ? IM.uncheckSpamSingle() : (each(cur.selSpam, function(e, r) {
            removeClass(ge("mess" + r), "im_sel_row")
        }), cur.selSpam = [], hide("im_spam_controls"), void show("im_spam_flush"))
    },
    checkSpamSingle: function(e) {
        return addClass("im_susp_wrap" + e, "im_msg_susp_wrap_opened"), IM.uncheckLogMsgs(), IM.uncheckSpamMsgs(), IM.checkSpamMsg(e), cur.selSpamSingle = e, hide(
            "im_tabs", "im_log_controls"), show("im_spam_controls"), !1
    },
    uncheckSpamSingle: function() {
        each(cur.selSpam, function(e, r) {
            removeClass(ge("mess" + r), "im_sel_row"), removeClass("im_susp_wrap" + r, "im_msg_susp_wrap_opened")
        }), cur.selSpam = [], cur.selSpamSingle = !1, hide("im_spam_controls", "im_log_controls"), show("im_tabs")
    },
    flushSpam: function() {
        var e = function() {
                ajax.post("/al_mail.php", {
                    act: "a_flush_spam",
                    hash: cur.spamFlushhash,
                    from: "im",
                    gid: cur.gid
                }, {
                    onDone: function(e, i, t) {
                        r.hide(), IM.activateTab(-1), showDoneBox(i), IM.updateCounts(t)
                    },
                    showProgress: r.showProgress,
                    hideProgress: r.hideProgress
                })
            },
            r = showFastBox({
                title: getLang("mail_deleteall1"),
                dark: 1,
                bodyStyle: "padding: 20px; line-height: 160%;"
            }, getLang("mail_delete_all_spam"), getLang("mail_delete"), e, getLang("mail_close"), i),
            i = function() {
                r.hide()
            }
    },
    showForwardedBox: function(e, r, i) {
        showBox("al_im.php", {
            act: "a_show_forward_box",
            id: e,
            ref_id: r,
            hash: i,
            gid: cur.gid
        }, {
            dark: 1
        })
    },
    willForward: function() {
        each((cur.imPeerMedias || {})[cur.peer] || [], function(e, r) {
            return r && "mail" == r[0] ? (showBox("al_im.php", {
                act: "a_show_forward_box",
                will_fwd: r[1],
                gid: cur.gid
            }, {
                dark: 1
            }), !1) : void 0
        })
    },
    deleteLogMsg: function(e) {
        var r = ge("ma" + e),
            i = ge("mess" + e);
        return i && r ? (r.innerHTML = '<img src="/images/upload.gif" />', cur.deletedRows[e] = 1, ajax.post("al_mail.php", {
            act: "a_delete",
            id: e,
            from: "im",
            hash: cur.mark_hash
        }, {
            onDone: function(t, a, s) {
                var o = geByClass1("wrapped", i),
                    n = ce("div", {
                        id: "mres" + e,
                        innerHTML: a
                    });
                hide(o), o.parentNode.insertBefore(n, o), addClass(i, "im_del_row"), r.innerHTML = s
            }
        }), !1) : !1
    },
    restoreLogMsg: function(e) {
        var r = ge("ma" + e),
            i = ge("mess" + e);
        if (!i || !r) return !1;
        var t = geByClass1("wrapped", i),
            a = ge("mres" + e);
        return t && a ? (a.innerHTML = '<img src="/images/upload.gif" />', cur.deletedRows[e] = 0, ajax.post("al_mail.php", {
            act: "a_restore",
            id: e,
            from: "im",
            hash: cur.mark_hash,
            gid: cur.gid
        }, {
            onDone: function(e, r) {
                show(t), re(a), removeClass(i, "im_del_row")
            }
        }), !1) : !1
    },
    restoreSpamMsg: function(e) {
        var r = ge("ma" + e),
            i = ge("mess" + e);
        if (!i || !r) return !1;
        var t = geByClass1("wrapped", i),
            a = ge("mres" + e);
        return t && a ? (a.innerHTML = '<img src="/images/upload.gif" />', cur.deletedRows[e] = 0, ajax.post("al_mail.php", {
            act: "a_restore_spam",
            id: e,
            from: "imspam",
            hash: cur.mark_hash,
            gid: cur.gid
        }, {
            onDone: function(e, r) {
                IM.updateCounts(r), show(t), re(a), removeClass(i, "im_del_row")
            }
        }), !1) : !1
    },
    reportLogMsg: function(e) {
        var r = ge("ma" + e),
            i = ge("mess" + e);
        if (!i || !r) return !1;
        var t = geByClass1("wrapped", i),
            a = ge("mres" + e);
        return t && a ? (r.innerHTML = '<img src="/images/upload.gif" />', ajax.post("al_mail.php", {
            act: "a_report_spam",
            id: e,
            from: "im",
            hash: cur.mark_hash
        }, {
            onDone: function(e, r) {
                addClass(i, "im_spam_row"), removeClass(i, "im_del_row"), a.innerHTML = r
            }
        }), !1) : !1
    },
    restoreSpamLogMsg: function(e) {
        var r = ge("ma" + e),
            i = ge("mess" + e);
        if (!i || !r) return !1;
        var t = geByClass1("wrapped", i),
            a = ge("mres" + e);
        return t && a ? (a.innerHTML = '<img src="/images/upload.gif" />', cur.deletedRows[e] = 0, ajax.post("al_mail.php", {
            act: "a_restore_spam",
            id: e,
            from: "im",
            hash: cur.mark_hash,
            gid: cur.gid
        }, {
            onDone: function(e, r) {
                show(t), re(a), removeClass(i, "im_spam_row")
            }
        }), !1) : !1
    },
    onSubmitSettingsChanged: function(e) {
        var r = intval(getCookie("remixsettings_bits"));
        2 & r && (r &= -3, setCookie("remixsettings_bits", r, 365)), ajax.post("al_im.php", {
            act: "a_save_ctrl_submit",
            to: cur.peer,
            value: e ? 1 : 0,
            hash: cur.tabs[cur.peer].hash
        }), cur.ctrl_submit = !!e
    },
    onActionMenu: function(e) {
        switch (e) {
            case "search":
                IM.searchPeer();
                break;
            case "invite":
                IM.inviteToChat();
                break;
            case "topic":
                IM.changeChatTopic();
                break;
            case "return":
                IM.returnToChat();
                break;
            case "leave":
                IM.leaveChat();
                break;
            case "history":
                IM.loadHistory(cur.peer, 2);
                break;
            case "clear":
                IM.deleteHistory(cur.peer);
                break;
            case "chat":
                IM.startChatWith(cur.peer);
                break;
            case "photos":
                IM.showMediaHistory(cur.peer, "photo");
                break;
            case "videos":
                IM.showMediaHistory(cur.peer, "video");
                break;
            case "audios":
                IM.showMediaHistory(cur.peer, "audio");
                break;
            case "docs":
                IM.showMediaHistory(cur.peer, "doc");
                break;
            case "avatar":
                IM.chatAva();
                break;
            case "mute":
                IM.mute(cur.peer);
                break;
            case "unmute":
                IM.unmute(cur.peer)
        }
    },
    r: function(e) {
        return void 0 === e && (e = cur.peer), 0 == e || -1 == e || -2 == e || -3 == e || -4 == e || -5 == e
    },
    deinitWrite: function() {
        show(cur.imEl.bar, cur.imEl.controls, "im_write_wrap"), hide("im_to_dialog"), cur.imEl.rowsWrap.style.overflow = "hidden", cur.fixedScroll && (addClass(bodyNode,
            "im_fixed_nav"), _fixedNav = !0)
    },
    showToDialog: function(e) {
        hide("im_to_dialog");
        var r = !1,
            i = 0,
            t = "";
        for (var a in e) {
            if (r) return;
            if (r = e[a][0], r != intval(r)) return;
            i = e[a][6], t = e[a][7]
        }
        if (r > 2e9) val("im_to_dialog", '<a href="/im?sel=c' + (r - 2e9) + '" onclick="if (checkEvent(event) === false) { IM.addPeer(' + r +
            ', false, false, true); return false; }">' + getLang("mail_im_to_multidialog") + "</a>"), show("im_to_dialog");
        else {
            if (!r || !i || !t) return;
            t = getLang("mail_im_to_dialog", 3 - i)
                .replace("{user}", t), val("im_to_dialog", '<a href="/im?sel=' + r + '" onclick="if (checkEvent(event) === false) { IM.addPeer(' + r +
                    ', false, false, true); return false; }">' + t + "</a>"), show("im_to_dialog")
        }
    },
    initWriteDD: function() {
        if (WideDropdown.init("imw_dd", {
                defaultItems: cur.ddfriends,
                url: "hints.php",
                params: {
                    act: "a_json_friends",
                    from: "imwrite"
                },
                noResult: getLang("mail_not_found"),
                img: "imw_ava",
                maxItems: cur.multi_peers_max,
                introText: getLang("mail_choose_recipient"),
                custom: function(e) {
                    return 2 == e.split("@")
                        .length ? [
                            [clean(e), clean(e), getLang("mail_enter_email_address"), "/images/pics/contact50.gif", 0, ""]
                        ] : !1
                },
                chooseOnBlur: function(e) {
                    return e = trim(e + ""), e.length < 64 && e.match(/^[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]{2,6}$/i)
                },
                onChange: function(e) {
                    var r = cur.wdd.imw_dd,
                        i = r.selCount;
                    1 != i || IM.editableHasVal(IM.getNewTxt()) || IM.restoreWriteDraft(), 1 == e && setTimeout(cur.editable ? Emoji.editableFocus.pbind(IM.getNewTxt(),
                        domLC(IM.getNewTxt())) : elfocus.pbind(IM.getNewTxt()), 0), IM.checkNewLen(IM.getNewTxt()), IM.showToDialog(r.selected), val(
                        "imw_to_header", getLang(i > 1 ? "mail_rcpnts" : "mail_rcpnt"))
                },
                itemMark: function(e) {
                    return intval((cur.friends[e[0] + "_"] || [e[5]])[0])
                }
            }) && cur.destroy.push(WideDropdown.deinit.pbind("imw_dd")), cur.ddfriends_sel) {
            cur.ddfriends_sel[0];
            WideDropdown.select("imw_dd", !1, cur.ddfriends_sel), delete cur.ddfriends_sel, IM.restoreWriteDraft()
        }
    },
    getWritePeer: function() {
        var e = (cur.wdd || {})
            .imw_dd,
            r = (e || {})
            .selCount,
            i = !1;
        if (1 != r) return !1;
        for (i in e.selected) break;
        return intval(i)
    },
    restoreWriteDraft: function() {
        if (cur.imwMedia) {
            var e, r = IM.getWritePeer(),
                i = IM.getNewTxt();
            if (!browser.mobile && r) {
                if ((e = ls.get("im_draft" + vk.id + "_" + r)) && (Emoji.editableVal(i)
                        .length < 2 && (cur.editable ? val(i, clean(e.txt || "")
                            .replace(/\n/g, "<br/>")) : val(i, e.txt || "")), (e.medias || [])
                        .length && !(cur.imwMedia.chosenMedias || [])
                        .length)) {
                    var t = [];
                    for (var a in e.medias) e.medias[a] && t.push(e.medias[a].slice(0, 2)
                        .join(","));
                    ajax.post("al_im.php", {
                        act: "draft_medias",
                        media: t.join("*")
                    }, {
                        onDone: function(e) {
                            -3 == cur.peer && IM.getWritePeer() == r && (e || [])
                                .length && each(e, function() {
                                    cur.imwMedia.chooseMedia.apply(cur.imwMedia, this)
                                })
                        }
                    })
                }
                IM.checkEditable(cur.emojiId[r], i), IM.checkNewLen(i)
            }
        }
    },
    saveWriteDraft: function() {
        var e, r = IM.getWritePeer();
        if (r) {
            e = {
                txt: Emoji.editableVal(IM.getNewTxt()),
                medias: []
            }, m = cur.imwMedia ? cur.imwMedia.getMedias() : [];
            for (var i = 0, t = m.length; t > i; ++i) m[i] && e.medias.push([m[i][0], m[i][1]]);
            e.medias.length || e.txt.length || (e = !1), ls.set("im_draft" + vk.id + "_" + r, e)
        }
    },
    initWrite: function() {
        removeClass(bodyNode, "im_fixed_nav"), _fixedNav = !1, hide(cur.imEl.bar, cur.imEl.controls, "im_top_sh", "im_bottom_sh", "im_write_wrap"), cur.imEl.rowsWrap.style
            .overflow = "visible";
        var e = IM.getNewTxt();
        cur.emojiId[cur.peer] = Emoji.init(e, {
            ttDiff: -49,
            noStickers: cur.gid ? !0 : !1,
            controlsCont: ge("imw_emoji_wrap"),
            shouldFocus: !0,
            onSend: IM.sendNewMsg,
            noEnterSend: 1,
            rPointer: 1,
            forceTxt: !cur.editable,
            checkEditable: IM.checkWriteEditable,
            saveDraft: IM.saveWriteDraft,
            rceCont: ge("im_rcemoji_cont"),
            sendWrap: ge("imw_buttons"),
            noCtrlSend: !0,
            onKeyAction: function(e) {
                clearTimeout(cur.saveWriteDraftTO), cur.saveWriteDraftTO = setTimeout(IM.saveWriteDraft, "paste" == e.type ? 0 : 300)
            },
            onStickerSend: function(e) {
                var r = cur.wdd && cur.wdd.imw_dd;
                if (!r || !r.selCount) return elfocus("imw_inp");
                var i = [];
                for (var t in r.selected) i.push(t.replace(/_$/, ""));
                i = i.join(","), ajax.post("/al_mail.php", {
                    act: "a_send",
                    to_ids: i,
                    chas: cur.writeHash,
                    msg: "",
                    ts: cur.ts,
                    media: "sticker:" + e,
                    from: "im"
                }, {
                    onDone: function(e) {
                        IM.clearWrite(), clearTimeout(cur.saveWriteDraftTO), e && ls.set("im_draft" + vk.id + "_" + e, !1), !cur.tabs[e] || cur.tabs[
                            e].history && !cur.tabs[e].q_offset || IM.clearHistory(e, ge("im_log" + e)), IM.addPeer(e)
                    },
                    showProgress: lockButton.pbind("imw_send"),
                    hideProgress: unlockButton.pbind("imw_send"),
                    onFail: function(e) {
                        return setTimeout(showFastBox({
                                title: getLang("global_error"),
                                dark: 1,
                                bodyStyle: "padding: 20px; line-height: 160%;"
                            }, e)
                            .hide, 3e3), !0
                    }
                })
            }
        }), cur.wdd && cur.wdd.imw_dd ? IM.showToDialog(cur.wdd.imw_dd.selected) : cur.ddfriends ? stManager.add(["wide_dd.css", "wide_dd.js"], IM.initWriteDD) : ajax.post(
            "hints.php", {
                act: "a_json_friends",
                from: "imwrite",
                str: ""
            }, {
                stat: ["wide_dd.css", "wide_dd.js"],
                onDone: function(e) {
                    cur.ddfriends = e, IM.initWriteDD()
                }
            }), cur.imwMedia || (cur.imwMediaSaved = {}, cur.imwMedia = initAddMedia("imw_attach", "imw_media_preview", [
            ["photo", getLang("profile_wall_photo")],
            ["video", getLang("profile_wall_video")],
            ["audio", getLang("profile_wall_audio")],
            ["doc", getLang("profile_wall_doc")],
            ["map", getLang("profile_wall_map")]
        ], {
            mail: 1,
            editable: 1,
            sortable: 1,
            teWidth: 350,
            teHeight: 300,
            toggleLnk: 1
        }), cur.imwMedia.onChange = function(e, r, i) {
            e ? (show("imw_media_preview"), cur.imwMediaSaved[e + r] = [e, r, i]) : cur.imwMedia.attachCount() || hide("imw_media_preview"), IM.updateNewMsg(),
                clearTimeout(cur.saveWriteDraftTO), cur.saveWriteDraftTO = setTimeout(IM.saveWriteDraft, 300), setTimeout(function() {
                    var e = ge("imw_media_preview"),
                        r = geByClass1("page_pics_preview", e)
                        .childNodes.length + geByClass1("page_docs_preview", e)
                        .childNodes.length;
                    toggle("imw_attach", 10 > r)
                })
        }, cur.imwMedia.onProgress = function(e) {
            e && show("imw_media_preview")
        }, IM.restoreWriteDraft());
        var r = ge("emoji_block");
        Emoji.reappendEmoji(cur.emojiId[cur.peer], r)
    },
    clearWrite: function() {
        WideDropdown.deselect("imw_dd"), val(IM.getNewTxt(), ""), val("imw_title", ""), IM.checkNewLen(IM.getNewTxt()), cur.imwMedia.unchooseMedia(), cur.imwMediaSaved = {},
            hide("imw_title_wrap")
    },
    updateNewMsg: function() {
        cur.lastWasIMW = (cur.newTxtV || {})
            .lastLen || isVisible("imw_media_preview") || isVisible("imw_title_wrap") && val("imw_title") || ((cur.wdd || {})
                .imw_dd || {})
            .selCount ? !0 : !1
    },
    checkNewLen: function(e) {
        cur.newTxtV || (cur.newTxtV = {}), cur.newTxtV.value = Emoji.editableVal(e), checkTextLength(4096, cur.newTxtV, "imw_warn");
        var r = cur.wdd && cur.wdd.imw_dd,
            i = r.full && 1 == r.selCount;
        if (r) {
            if (i)
                for (var t in r.selected) i = intval(t) > 2e9;
            toggle("imw_title_wrap", cur.newTxtV.lastLen > 200 && !i || r.selCount > 1 || val("imw_title")), IM.updateNewMsg()
        }
    },
    sendNewMsg: function() {
        var e = IM.getNewTxt(),
            r = Emoji.editableVal(e),
            i = cur.imwMedia ? cur.imwMedia.getMedias() : [],
            t = cur.wdd && cur.wdd.imw_dd;
        if (!t || !t.selCount) return elfocus("imw_inp");
        if (!buttonLocked("imw_send")) {
            cur.editable && IM.extractEmoji(e, IM.getWritePeer());
            for (var a, s = {
                    act: "a_send",
                    chas: cur.writeHash,
                    message: r,
                    title: isVisible("imw_title_wrap") && val("imw_title") || "",
                    from: "im",
                    media: [],
                    to_ids: []
                }, o = 0, n = i.length; n > o; ++o)(a = i[o]) && s.media.push(a[0] + ":" + a[1]);
            if (s.media = s.media.join(","), !r && !s.media) return cur.editable ? Emoji.editableFocus(IM.getNewTxt(), domLC(IM.getNewTxt())) : elfocus(IM.getNewTxt());
            for (var o in t.selected) s.to_ids.push(o.replace(/_$/, ""));
            s.to_ids = s.to_ids.join(","), ajax.post("al_mail.php", s, {
                onDone: function(e) {
                    IM.clearWrite(), clearTimeout(cur.saveWriteDraftTO), e && ls.set("im_draft" + vk.id + "_" + e, !1), !cur.tabs[e] || cur.tabs[e].history &&
                        !cur.tabs[e].q_offset || IM.clearHistory(e, ge("im_log" + e)), IM.addPeer(e)
                },
                showProgress: lockButton.pbind("imw_send"),
                hideProgress: unlockButton.pbind("imw_send"),
                onFail: function(e) {
                    return setTimeout(showFastBox({
                            title: getLang("global_error"),
                            dark: 1,
                            bodyStyle: "padding: 20px; line-height: 160%;"
                        }, e)
                        .hide, 3e3), !0
                }
            })
        }
    },
    txtVal: function(e, r) {
        cur.editable ? e.innerHTML = r : val(e, r)
    },
    editableHasVal: function(e) {
        return e ? "TEXTAREA" == e.tagName ? !!val(e) : !(!geByTag1("IMG", e) && !stripHTML(val(e))
            .replace(/[\s\xa0]/g, "")
            .length) : !1
    },
    checkWriteEditable: function(e, r) {
        r && Emoji.checkEditable(e, r, {
            height: 400
        })
    },
    checkEditable: function(e, r) {
        if (r) {
            Emoji.checkEditable(e, r, {
                height: 180
            });
            var i = r.scrollHeight;
            if (cur.prevScHeight !== i) {
                cur.prevScHeight = i;
                var t = cur.bottom;
                IM.r() || cur.focused != cur.peer || IM.panelUpdate(!0), IM.updateScroll(), t && !cur.bottom && IM.scroll()
            }
        }
    },
    getMsgInfo: function(e, r, i) {
        var t = "";
        return ("gift" == r.attach1_type || r.source_act) && (t = '<span id="im_msg_info' + e + '"></span>'), t
    },
    getServiceMsg: function(e, r, i) {
        var t = i,
            a = t.source_act,
            s = t.source_mid,
            o = (cur.tabs[e].data || {})
            .members || {};
        if (!a || !cur.lang) return !1;
        if (t.attach1_type || !o[r] || s > 0) return !0;
        var t = 0,
            n = o[r],
            c = (o[s], i.source_email),
            l = i.source_text;
        switch (a) {
            case "chat_create":
                t = "mail_im_chat_created";
                break;
            case "chat_title_update":
                t = "mail_im_title_updated";
                break;
            case "chat_invite_user":
                t = s == r ? "mail_im_returned_to_chat" : "mail_im_invited";
                break;
            case "chat_kick_user":
                t = s == r ? "mail_im_left" : "mail_im_kicked_from_chat";
                break;
            case "chat_photo_remove":
                t = "mail_im_photo_removed";
                break;
            default:
                return !1
        }
        return t = langSex(n.sex, cur.lang[t])
            .replace("{from}", '<a class="im_srv_lnk" target="_blank" href="' + n.link + '">' + n.name + "</a>"), s && (t = t.replace("{user}",
                '<a class="im_srv_lnk" target="_blank" href="/im?email=' + encodeURIComponent(c) + '">' + c + "</a>")), l && (t = t.replace("{title}",
                '�<b class="im_srv_lnk">' + l + "</b>�")), t
    },
    calendarUpd: function(e) {
        if (cur.imDPIgnore) return void(cur.imDPIgnore = !1);
        var r = val("im_datesearch")
            .split("."),
            i = new Date;
        if (i = [i.getDate(), i.getMonth() + 1, i.getFullYear()], r[2] > i[2] || r[2] == i[2] && (r[1] > i[1] || r[1] == i[1] && r[0] > i[0])) return void cur.imDP.setDate();
        if ("clear" === e) cur.imDP.setDate(), cur.imSD = !1;
        else {
            if (cur.imSD == val("im_datesearch")) return;
            cur.imSD = val("im_datesearch")
        }
        cur.qDay = cur.imSD ? IM.dayFromVal(cur.imSD) : !1, IM.searchMessages(), cur.imDP.hide()
    },
    calendarUpdTip: function(e) {
        var r = ge("im_search_date");
        r && (r.tt && r.tt.destroy && r.tt.destroy(), r.onmouseover = showTooltip.pbind(r, {
            text: e || getLang("mail_im_date_search"),
            black: 1,
            shift: [10, 3, 3]
        }))
    },
    calendar: function() {
        stManager.add(["ui_controls.js", "datepicker.js", "datepicker.css"], function() {
            if (!cur.imDP) {
                var e = '<td class="im_cal_clear" colspan="7"><a onclick="IM.calendarUpd(\'clear\');" class="im_cal_clear_lnk">' + getLang("wall_clear_date_filter") +
                    "</a></td>";
                cur.imDP = new Datepicker(ge("im_datesearch"), {
                    width: 140,
                    resfmt: "plain",
                    addRows: '<tr id="im_day_clear">' + e + "</tr>",
                    addRowsM: '<tr id="im_month_clear">' + e + "</tr>",
                    onUpdate: IM.calendarUpd
                })
            }
            cur.imDPIgnore = !0, cur.qDay ? (cur.imDP.setDate(intval(cur.qDay.substr(4)), intval(cur.qDay.substr(2, 2)), intval(cur.qDay.substr(0, 2))), cur.imSD =
                    val("im_datesearch")) : (cur.imDP.setDate(), cur.imSD = !1), toggleClass(ge("im_datesearch_wrap"), "im_no_search_day", !cur.imSD), triggerEvent(
                    geByClass1("datepicker_control", ge("im_datesearch_wrap")), "mousedown", !1, !0), ge("im_datesearch_cal_box")
                .style[vk.rtl ? "right" : "left"] = ge("im_search_btn")[vk.rtl ? "offsetRight" : "offsetLeft"] + "px", ge("im_datesearch_cal_box")
                .style.marginTop = "24px"
        })
    },
    addPeerMsg: function(e, r, i, t, a) {
        var s = cur.tabs[e];
        s.q_offset ? val("im_to_end_wrap", '<span data-for="' + e + '" class="progress_inline"></span>') : (s.new_msgs.push(r), IM.addMsg(e, -1, r, 2, 1, i, t, Math.floor(
            (new Date)
            .getTime() / 1e3), a), setTimeout(function() {
            var e = ge("mprg" + r);
            e && setStyle(e, {
                visibility: "visible",
                display: "block"
            })
        }, 5e3), IM.scroll(), cur.nu && re("im_unread_bar" + e))
    },
    openSnapsterLayer: function(e, r) {
        return checkEvent(e) ? void 0 : (showBox("/snapster.php", {
            act: "show",
            from: r || ""
        }, {
            containerClass: "chronicle_layer",
            dark: 1
        }), cancelEvent(e))
    },
    toggleFwdMsgs: function(e) {
        for (var r = e;
            (r = domNS(r)) && hasClass(r, "_im_hidden");) toggleClass(r, "unshown");
        each(domChildren(e), function(e, r) {
            toggleClass(r, "unshown")
        })
    }
};
ImUpload = {
    photoUploaded: function(e, r) {
        var i = void 0 !== e.ind ? e.ind : e,
            t = (e.fileName ? e.fileName : e)
            .replace(/[&<>"']/g, ""),
            a = e.fileName ? i + "_" + e.fileName : e,
            s = ge("upload" + a + "_progress_wrap");
        s && hide(geByClass1("progress_x", s)), ajax.post("al_photos.php", extend({
            act: "choose_uploaded"
        }, r), {
            onDone: function(e, r) {
                debugLog("chosen", e, r), cur.imMedia.chooseMedia("photo", e, extend(r, {
                    upload_ind: i + "_" + t
                }))
            },
            onFail: ImUpload.uploadFailed.pbind(e)
        })
    },
    uploadFailed: function(e, r) {
        var i = void 0 !== e.ind ? e.ind : e,
            t = (e.fileName ? e.fileName : e)
            .replace(/[&<>"']/g, "");
        if ("fileApi" == Upload.types[i] && !Upload.options[i].wiki_editor) {
            var a, s = e.fileName ? i + "_" + e.fileName : e;
            cur.imMedia ? (re("upload" + s + "_progress_wrap"), a = cur.imMedia.lnkId, cur.addMedia[a].unchooseMedia()) : cur.addMedia && (re("upload" + s +
                "_progress_wrap"), a = (cur.attachMediaIndexes || {})[t], a && cur.addMedia[a].unchooseMedia())
        }
        topError("Upload failed", {
            dt: -1,
            type: 102,
            url: (ge("file_uploader_form" + i) || {})
                .action
        }), Upload.embed(i)
    },
    show: function() {
        cur.uploadInited && show(cur.uploadWrap)
    },
    hide: function() {
        cur.uploadInited && hide(cur.uploadWrap, "im_upload_dropbox")
    },
    checkDragDrop: function() {
        var e = browser,
            r = floatval(browser.version);
        return e.msie && r >= 9 || e.mozilla && r >= 3.5 || e.chrome || e.safari ? (window.XMLHttpRequest || window.XDomainRequest) && (window.FormData || window.FileReader &&
            (window.XMLHttpRequest && XMLHttpRequest.sendAsBinary || window.ArrayBuffer && window.Uint8Array && (window.MozBlobBuilder || window.WebKitBlobBuilder ||
                window.BlobBuilder))) : !1
    },
    init: function() {
        removeEvent(bodyNode, "dragover dragenter");
        var data = cur.upload_options,
            tt = ImUpload.checkDragDrop() ? ' title="' + getLang("mail_photos_drag_hint") + '"' : "",
            submitBox = ge("im_write_form"),
            textsWrap = ge("im_texts");
        submitBox && textsWrap && (textsWrap.insertBefore(cur.uploadWrap = ce("div", {
            className: "im_upload_wrap fl_r",
            innerHTML: '<div id="im_upload" class="im_upload"' + tt + "></div>"
        }), textsWrap.firstChild), submitBox.insertBefore(ce("div", {
            id: "im_upload_dropbox",
            className: "im_upload_dropbox",
            innerHTML: '<div class="im_upload_dropbox_inner noselect"><span class="im_upload_drop_label">' + getLang("mail_drop_photos_here") +
                '</span><span class="im_upload_release_label">' + getLang("mail_release_photos_here") + "</span></div>"
        }), submitBox.firstChild), cur.imUploadInd = Upload.init("im_upload", data.url, data.params, {
            file_name: "photo",
            file_size_limit: 26214400,
            file_types_description: "Image files (*.jpg, *.jpeg, *.png, *.gif)",
            file_types: "*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG;*.gif;*.GIF",
            file_input: null,
            accept: "image/jpeg,image/png,image/gif",
            file_match: data.opts.ext_re,
            lang: data.opts.lang,
            wiki_editor: 0,
            onUploadStart: function(e, r) {
                var i = void 0 !== e.ind ? e.ind : e,
                    t = Upload.options[i];
                "form" == Upload.types[i] && (geByClass1("file", ge("choose_photo_upload"))
                    .disabled = !0), "fileApi" == Upload.types[i] && (cur.notStarted && (boxQueue.hideLast(), delete cur.notStarted), t.multi_progress &&
                    this.onUploadProgress(e, 0, 0))
            },
            onUploadComplete: function(info, res) {
                var params, i = void 0 !== info.ind ? info.ind : info,
                    fileName = (info.fileName ? info.fileName : info)
                    .replace(/[&<>"']/g, "");
                try {
                    params = eval("(" + res + ")")
                } catch (e) {
                    params = q2ajx(res)
                }
                return params.photos ? void ImUpload.photoUploaded(info, params) : void Upload.onUploadError(info)
            },
            onUploadProgress: function(e, r, i) {
                var t = void 0 !== e.ind ? e.ind : e;
                if ("fileApi" == Upload.types[t]) {
                    var a = (cur.attachMediaIndexes || {})[t];
                    if (void 0 === a || a && cur.addMedia[a].chosenMedia || cur.imMedia) {
                        var s = {
                            loaded: r,
                            total: i
                        };
                        e.fileName && (s.fileName = e.fileName.replace(/[&<>"']/g, "")), cur.imMedia.showMediaProgress("photo", t, s)
                    }
                }
            },
            onUploadError: ImUpload.uploadFailed,
            onCheckServerFailed: function() {
                delete cur.uploadInited, ImUpload.hide()
            },
            onUploadCompleteAll: function(e) {
                "form" == Upload.types[e] && Upload.embed(e)
            },
            onDragEnter: function(e) {
                var r = ge("im_write_form")
                    .offsetHeight - (browser.webkit || browser.chrome ? 2 : 0),
                    i = ge("im_upload_dropbox")
                    .firstChild;
                if (setStyle(i, {
                        height: r
                    }), browser.chrome && e.dataTransfer && e.dataTransfer.items) {
                    var t = e.dataTransfer.items[0].type.split("/");
                    if (!t[1].match(/^(jpg|jpeg|png)$/i) && !ge("docs_choose_upload_area_wrap")) {
                        var a = cur.gid ? {
                            imhash: cur.im_doc_hash,
                            from: "from_gim"
                        } : {};
                        cur.dropDoc = !0, cur.chooseMedia = cur.imMedia.chooseMedia, cur.showMediaProgress = cur.imMedia.showMediaProgress, cur.attachCount =
                            cur.imMedia.attachCount, showBox("docs.php", extend({
                                act: "a_choose_doc_box",
                                toId: cur.gid ? -cur.gid : void 0,
                                scrollbar_width: sbWidth(),
                                blockPersonal: cur.gid ? 1 : 0,
                                mail_add: 1
                            }, a), {
                                stat: ["docs.css"]
                            }), setTimeout(ImUpload.hide)
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
            dropbox: "im_upload_dropbox",
            label: data.opts.label,
            dragEl: bodyNode
        }), cur.uploadInited = !0, ImUpload.show())
    }
};
try {
    stManager.done("im.js")
} catch (e) {}
