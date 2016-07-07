var Privacy = {
    flistBox: function(e, i, r, t, s, l) {
        if (cur.flistTpl = t, 0 === r.length && (r = {}), cur.flistList = cur.flistFriends = i, cur.flistSelectedList = r && r[0] ? r : [], cur.flistSelected = {}, each(r,
                function() {
                    cur.flistSelected[this[0]] = 1
                }), cur.flistSelectedShowed = 0, cur.flistIndex = new vkIndexer(i, function(e) {
                return e[1] + " " + e[4]
            }), e.removeButtons(), e.addButton(s || getLang("global_save"), function() {
                var i = ge("flist_list_name"),
                    r = !1;
                if (isVisible(i)) {
                    if (r = i.value, !r) return notaBene(i);
                    placeholderSetup(i, {
                        back: !0
                    }), elfocus(i, 0, i.value.length)
                }
                var t = {},
                    s = [];
                return each(cur.flistSelectedList, function() {
                    t[this[0]] = this, s.push(this[0])
                }), cur.flistFriendsPrivacy ? (ajax.post("al_settings.php", {
                    act: "hide_friends",
                    hash: l,
                    ids: s.join(",")
                }, {
                    onDone: function(i, r) {
                        showDoneBox(cur.flistFriendsPrivacyText), e.hide()
                    },
                    showProgress: e.showProgress,
                    hiderogress: e.hideProgress
                }), showDoneBox(cur.flistFriendsPrivacyText, {
                    out: 4e3
                }), void(cur.flistNavReload && setTimeout(function() {
                    nav.reload()
                }, 2e3))) : (cur.onFlistSave && cur.onFlistSave(s, t, l, r), void(e.leaveOnSave || e.hide()))
            }), cur.flistTooltip) {
            var c = ge("flist_sel"),
                a = {
                    className: "flist_info_tt",
                    text: cur.flistTooltip,
                    width: 250,
                    nohide: 1,
                    nohideover: 1
                };
            a = cur.flistTooltipRight ? extend(a, {
                dir: "left",
                slideX: -15,
                shift: [-getSize(c)[0] - 15, -28]
            }) : extend(a, {
                dir: "right",
                slideX: 15,
                shift: [265, -28]
            }), showTooltip(c, a), stManager.add(["tooltips.js"], function() {
                e.setOptions({
                    onHide: tooltips.hide.pbind(c)
                })
            })
        } else e.addButton(getLang("global_cancel"), function() {
            e.hide()
        }, "no");
        var n = ge("flist_all_list");
        getSize(n)[1];
        return cur.flistScrollbar = new Scrollbar("flist_scroll_wrap", {
                nomargin: !0,
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto",
                more: Privacy.flistMore,
                onScroll: function(e) {
                    ge("flist_scroll_wrap")
                        .scrollTop > 0 ? addClass("flist_cont", "flist_scrolled") : removeClass("flist_cont", "flist_scrolled")
                }
            }), cur.flistAllCont = ge("flist_all_list"), cur.flistSelCont = ge("flist_sel_list"), cur.flistSearchEl = ge("flist_search"), cur.flistLimit && cur.flistSelectedCnt >=
            cur.flistLimit - 1 && Privacy.flistFull(), cur.flistCountStr && cur.flistSelectedCnt > 0 && (ge("flist_sel_summary")
                .innerHTML = langNumeric(cur.flistSelectedCnt, cur.flistCountStr)), !1
    },
    flistMore: function() {
        for (var e = cur.flistShown + 60; cur.flistShown < e && Privacy.flistShowOne(cur.flistList[cur.flistShown + 1]);) ++cur.flistShown;
        setTimeout(function() {
            cur.flistScrollbar.update()
        }, 10)
    },
    flistShowOne: function(e, i) {
        if (!e) return !1;
        if (ge("flist_item_wrap" + e[0])) return show(ge("flist_item_wrap" + e[0])), !0;
        var r = e[1];
        cur.flistSelection && (r = r.replace(cur.flistSelection.re, cur.flistSelection.val));
        var t = ce("div", {
            id: "flist_item_wrap" + e[0],
            className: "flist_item_wrap" + (cur.flistSelected[e[0]] ? " flist_item_checked" : ""),
            innerHTML: cur.flistTpl.replace("%id%", e[0])
                .replace("%name%", r)
                .replace("%photo%", e[2])
        });
        return i ? cur.flistAllCont.insertBefore(t, cur.flistAllCont.firstChild) : cur.flistAllCont.appendChild(t), !0
    },
    flistSelect: function(e, i, r) {
        var t = ge("flist_item_wrap" + e),
            s = i.parentNode;
        if ("flist_item_sel" == s.id.slice(0, 14) || hasClass(t, "flist_item_checked")) {
            delete cur.flistSelected[e];
            for (var l = 0; l < cur.flistSelectedList.length; l++)
                if (cur.flistSelectedList[l][0] == e) {
                    cur.flistSelectedList.splice(l, 1);
                    break
                }
            t && removeClass(t, "flist_item_checked");
            var c = ge("flist_item_sel" + e);
            if (c && (re(c), cur.flistSelectedCnt > cur.flistSelInRow && cur.flistSelectedList[cur.flistSelInRow - 1])) {
                var a = cur.flistSelectedList[cur.flistSelInRow - 1];
                ge("flist_item_sel" + a[0]) || cur.flistSelCont.insertBefore(ce("div", {
                    id: "flist_item_sel" + a[0],
                    className: "flist_item_wrap",
                    innerHTML: cur.flistTpl.replace("%id%", a[0])
                        .replace("%name%", a[1])
                        .replace("%photo%", a[2])
                }), ge("flist_sel_show_all"))
            }
            cur.flistSelectedCnt--, 0 == cur.flistSelectedCnt ? (show("flist_info"), cur.flistSelectedShowed || hide("flist_search_toggler_wrap")) : cur.flistSelectedCnt >
                cur.flistSelInRow ? (val("flist_sel_show_all", "+" + (cur.flistSelectedCnt - cur.flistSelInRow)), removeClass("flist_sel_show_all", "unshown")) : cur.flistSelectedCnt ==
                cur.flistSelInRow && addClass("flist_sel_show_all", "unshown"), cur.flistLimit && cur.flistSelectedCnt == cur.flistLimit - 1 && removeClass(cur.flistAllCont,
                    "flist_full"), curBox()
                .changed = !0
        } else if (!hasClass(t, "flist_item_checked")) {
            if (cur.flistLimit && cur.flistSelectedCnt >= cur.flistLimit) return Privacy.flistFull(r || window.event), !1;
            var n = val(t);
            if (addClass(t, "flist_item_checked"), 0 == cur.flistSelectedCnt && (hide("flist_info"), show("flist_search_toggler_wrap")), cur.flistSelectedCnt++, cur.flistSelCont
                .insertBefore(ce("div", {
                    id: "flist_item_sel" + e,
                    className: "flist_item_wrap",
                    innerHTML: n
                }), cur.flistSelCont.firstChild), cur.flistSelectedCnt > cur.flistSelInRow) {
                var o = geByClass("flist_item_wrap", cur.flistSelCont);
                re(o[o.length - 1]), val("flist_sel_show_all", "+" + (cur.flistSelectedCnt - cur.flistSelInRow)), removeClass("flist_sel_show_all", "unshown")
            }
            cur.flistLimit && cur.flistSelectedCnt >= cur.flistLimit && Privacy.flistFull(r || window.event);
            for (var l = 0; l < cur.flistFriends.length; l++)
                if (cur.flistFriends[l] && cur.flistFriends[l][0] == e) {
                    cur.flistSelectedList.unshift(cur.flistFriends[l]);
                    break
                }
            cur.flistSelected[e] = 1, cur.flistSearchStr && Privacy.flistSearch(!1)
        }
        return cur.flistCountStr && val("flist_sel_summary", cur.flistSelectedCnt > 0 ? langNumeric(cur.flistSelectedCnt, cur.flistCountStr) : cur.flistNoSelStr), cur.flistScrollbar
            .update(), !1
    },
    flistFull: function(e) {
        if (e) {
            var i;
            if (hasClass(e.target, "flist_item_thumb") ? i = e.target : (hasClass(e.target, "flist_item") && (i = e.target) || (i = gpeByClass("flist_item", e.target))) &&
                (i = geByClass1("flist_item_thumb", i)), i) {
                window.tooltips && window.tooltips.hideAll();
                showTooltip(i, {
                    text: cur.limitTooltip,
                    className: "flist_max_size_tt",
                    dir: "auto",
                    slide: -15,
                    shift: [15, 10],
                    nohide: 1,
                    nohideover: 1,
                    hasover: 1
                });
                setTimeout(function() {
                    tooltips.hide(i)
                }, 2e3)
            }
        }
        addClass(cur.flistAllCont, "flist_full")
    },
    flistSearch: function(e) {
        cur.flistSearchStr = e, e ? (cur.flistList = (cur.flistSelectedShowed ? cur.flistSelectedIndex : cur.flistIndex)
            .search(e), cur.flistSelection = {
                re: new RegExp("(" + e.replace(cur.flistIndex.delimiter, "|")
                    .replace(/[\/\\\(\)\[\]\{\}\*,]/g, "")
                    .replace(/^\||\|$/g, "") + ")", "gi"),
                val: '<em class="highlight">$1</em>'
            }, cur.flistScrollbar.scrollTop(0)) : (cur.flistList = cur.flistSelectedShowed ? cur.flistSelectedList : cur.flistFriends, cur.flistSelection = !1, val(cur
            .flistSearchEl, "")), cur.flistList.length && (cur.flistAllCont.innerHTML = "", cur.flistShown = -1, Privacy.flistMore())
    },
    flistToggleAllSelected: function() {
        cur.flistSelectedShowed ? (cur.flistSelectedShowed = 0, removeClass("flist_sel_show_all", "flist_sel_showed_all"), removeClass("flist_search_toggler", "on"), 0 ==
            cur.flistSelectedCnt && hide("flist_search_toggler_wrap"), Privacy.flistSearch(!1)) : (cur.flistSelectedShowed = 1, addClass("flist_sel_show_all",
                "flist_sel_showed_all"), addClass("flist_search_toggler", "on"), cur.flistList = cur.flistSelectedList, cur.flistAllCont.innerHTML = "", cur.flistShown = -
            1, Privacy.flistMore(), cur.flistSelectedIndex = new vkIndexer(cur.flistSelectedList, function(e) {
                return e[1] + " " + e[4]
            })), cur.flistSelection = !1, val(cur.flistSearchEl, "")
    },
    hideFriends: function(e, i) {
        var r = cur.privacy[e][2];
        showBox("al_friends.php", {
            act: "select_friends_box",
            from: "friends_privacy",
            Checked: r.join(",")
        }, {
            stat: ["privacy.js", "privacy.css", "indexer.js"],
            params: {
                dark: 1
            }
        }), cur.onFlistSave = function(i, r, t) {
            ajax.post("al_settings.php", {
                act: "hide_friends",
                hash: t,
                ids: i.join(",")
            }, {
                onDone: function(i, r) {
                    ge("privacy_" + e + "_hide")
                        .innerHTML = i, cur.privacy[e] = r, cur.onPrivacyChanged && cur.onPrivacyChanged(e)
                }
            })
        }
    },
    customType: 4,
    someType: 5,
    listsType: 6,
    update: function(e) {
        var i = ge("privacy_edit_" + e),
            r = cur.privacy[e],
            t = r[0],
            s = cur.privacy[e + "_types"] || cur.privacy._types,
            l = cur.privacy[e + "_lists"] || cur.privacy._lists || {},
            c = {};
        for (var a in l) {
            var n = parseInt(a);
            c[n] = l[a]
        }
        if (i) {
            i.innerHTML = s[t];
            var o = ge("privacy_header");
            o && (o.innerHTML = s[t]);
            var u = gpeByClass("privacy_edit_wrap", i);
            if (u && u.nextSibling)
                if (t == Privacy.listsType) {
                    var v = [];
                    for (var a in r[2]) {
                        var d = -r[2][a],
                            f = (d - 1) % 8 + 1;
                        c[d] && v.push(100 > d ? '<a href="/friends?section=list' + d + '" class="group' + f + '">' + c[d] + "</a>" : '<span class="group' + f + '">' + c[d] +
                            "</span>")
                    }
                    u.nextSibling.innerHTML = (v.length ? ": " : "") + v.join(", ")
                } else u.nextSibling.innerHTML = "";
            if (u && hasClass(u, "privacy_graphic")) {
                var p = 0 == t && "hidden_friends" !== e || t == Privacy.customType && r[1] && r[2] && "0" == r[2][0] || 1 == t && "appscall" === e;
                (p ? removeClass : addClass)(u, "privacy_locked")
            }
        }
        cur.onPrivacyChanged && cur.onPrivacyChanged(e)
    },
    someSaved: function(e, i, r, t) {
        cur.privacy[e] = [Privacy.someType, 0, i, []];
        for (var s = i.length, l = [], c = 0; s > c && 5 > c; ++c) {
            var a = i[c],
                n = t ? r[c] : r[a],
                o = n[4].replace(/'/g, "");
            l.push('<a href="/' + (o ? o : "id" + a) + '" onclick="return nav.go(this, event)">' + (n[5] || n[1]) + "</a>")
        }
        l = l.join(", "), s > 5 && (l += " " + getLang("privacy_N_friends_some", s - 5));
        var u = ge("privacy_edit_" + e),
            v = gpeByClass("privacy_edit_wrap", u),
            d = cur.privacy[e + "_types"] || cur.privacy._types;
        u.innerHTML = d[Privacy.someType], v.nextSibling.innerHTML = ": " + l, cur.onPrivacyChanged && cur.onPrivacyChanged(e)
    },
    customSaved: function(e, i, r, t) {
        if (cur.privacy[e] = i, 1 == i[1] && !i[3].length || i[0] == Privacy.listsType) Privacy.update(e);
        else if (i[0] == Privacy.someType) Privacy.someSaved(e, i[2], r, !0);
        else {
            var s = ge("privacy_edit_" + e),
                l = gpeByClass("privacy_edit_wrap", s),
                c = cur.privacy[e + "_types"] || cur.privacy._types,
                a = cur.privacy[e + "_lists"] || cur.privacy._lists || {},
                n = c[Privacy.listsType],
                o = "";
            if (1 == i[1]) n = c[i[2][0]];
            else {
                o = [];
                for (var u = r.length, v = !1, d = 0; u > d && 5 > d; ++d) {
                    var f = r[d],
                        p = f[0];
                    if (p > 0) {
                        var _ = f[4].replace(/'/g, "");
                        v = !0, o.push('<a href="/' + (_ ? _ : "id" + p) + '" onclick="return nav.go(this, event)">' + f[5] + "</a>")
                    } else {
                        var h = -p,
                            y = (h - 1) % 8 + 1;
                        o.push('<a href="/friends?section=list' + h + '" class="group' + y + '">' + a[h] + "</a>")
                    }
                }
                v && (n = c[Privacy.someType]), o = ": " + o.join(", "), u > 5 && (o += " " + getLang("privacy_N_friends_some", u - 5))
            }
            if (t.length) {
                for (var u = t.length, S = [], d = 0; u > d && 5 > d; ++d) {
                    var f = t[d],
                        p = f[0];
                    if (p > 0) {
                        var _ = f[4].replace(/'/g, "");
                        S.push('<a href="/' + (_ ? _ : "id" + p) + '" onclick="return nav.go(this, event)">' + f[6] + "</a>")
                    } else {
                        var h = -p,
                            y = (h - 1) % 8 + 1;
                        S.push('<a href="/friends?section=list' + h + '" class="group' + y + '">' + a[h] + "</a>")
                    }
                }
                o += ", " + getLang("global_privacy_except") + " " + S.join(", "), u > 5 && (o += " " + getLang("privacy_N_friends_more", u - 5))
            }
            s.innerHTML = n, l.nextSibling.innerHTML = o, hasClass(l, "privacy_graphic") && (i[1] && i[2] && "0" == i[2][0] ? removeClass : addClass)(l, "privacy_locked"),
                cur.onPrivacyChanged && cur.onPrivacyChanged(e)
        }
    },
    choose: function(e, i, r) {
        var t = cur.privSel,
            s = cur.privacy[t],
            l = cur.privacy._noselect || "chat_actions" == t;
        if (l) return cur.onPrivacyChanged && cur.onPrivacyChanged(t, i, r), Privacy.qhide(), cancelEvent(e);
        if (i == Privacy.customType) {
            var c, a, n = [],
                o = "";
            return s[0] == Privacy.customType ? (c = s[1], a = s[2], n = s[3]) : s[0] == Privacy.someType || s[0] == Privacy.listsType ? (c = 0, a = s[2]) : (c = 1, a = s[
                    2]), cur.onCprivSave = Privacy.customSaved.pbind(t), cur.privacy.custom_box_type ? o = cur.privacy.custom_box_type : "apps_invite" == t || "videocalls" ==
                t ? o = "fronly" : "hidden_friends" == t && (o = "hidden_friends"), showBox("al_friends.php", extend(cur.privacy.chooseBoxOpts || {}, {
                    act: "custom_privacy_box",
                    type: c,
                    plus: a.join(","),
                    minus: n.join(","),
                    opt: o
                }), {
                    stat: ["ui_controls.js", "ui_controls.css"],
                    dark: 1
                })
        }
        if (i == Privacy.someType) {
            var u = s[0] == Privacy.someType || s[0] == Privacy.complexType && 0 == s[1] ? s[2].join(",") : "";
            return cur.onFlistSave = function(e, i) {
                Privacy.someSaved(t, e, i)
            }, showTabbedBox("al_friends.php", extend(cur.privacy.chooseBoxOpts || {}, {
                act: "select_friends_box",
                Checked: u
            }), {
                stat: ["ui_controls.js"]
            })
        }
        if (i == Privacy.listsType) {
            var v = ge("privacy_l_item" + r);
            if ("l_item_sel" == v.className) {
                v.className = "l_item";
                var d = indexOf(s[2], -r); - 1 != d && s[2].splice(d, 1), s[2].length || "updates" == t || (cur.privacy[t] = [0, 1, [0],
                    []
                ])
            } else v.className = "l_item_sel", s[0] != i && (s = cur.privacy[t] = [i, 0, [],
                []
            ]), s[2].push(-r);
            return Privacy.update(t), cancelEvent(e)
        }
        cur.privacy[t] = [i, 1, [i],
            []
        ], Privacy.update(t), Privacy.qhide()
    },
    select: function(e, i) {
        if (i || e !== cur.privSelIndex) {
            if (cur.privSelIndex !== !1) {
                var r = ge("privacy_item" + cur.privSelIndex);
                r && (r.className = "item"), cur.privSelIndex == Privacy.listsType && cur.privacy[cur.privSel][0] != Privacy.listsType && (Privacy.toup ? hide(r.previousSibling) :
                    hide(r.nextSibling))
            }
            cur.privSelIndex = e;
            var r = ge("privacy_item" + cur.privSelIndex),
                t = cur.privSelIndex == Privacy.someType ? "_plus" : "";
            r.nextSibling && r.nextSibling.id == "privacy_item" + Privacy.listsType && isVisible(r.nextSibling.nextSibling) ? r.className = "last item_sel" + t : e ==
                Privacy.listsType ? Privacy.toup ? show(r.previousSibling) : show(r.nextSibling) : r.className = "item_sel" + t
        }
    },
    unselect: function(e) {
        e == cur.privSelIndex && (ge("privacy_item" + e)
            .className = "item", cur.privSelIndex = !1)
    },
    hide: function(e) {
        if (e > 0) return void(cur.hidePrivacyTimer = setTimeout(Privacy.hide.pbind(0), e));
        clearTimeout(cur.hidePrivacyTimer);
        var i = ge("privacy_header");
        i && (-1 == e ? (hide(cur.privEl), i && i.tt && i.tt.hide()) : isVisible && (fadeOut(cur.privEl, 200), i.tt && i.tt.hide()), cur.privSel = cur.privSelIndex = !1,
            removeEvent(document, "click", Privacy.qhide))
    },
    show: function(e, i, r, t) {
        var s = cur.privacy[r],
            l = (-1 != r.indexOf("actions"), gpeByClass("privacy_edit_wrap", e));
        if (s && l) {
            if (cur.onPrivacyShow && cur.onPrivacyShow(r), cur.privEl || (cur.privEl = ge("privacy_dropdown")) && (cur.privRows = cur.privEl.firstChild), cur.privEl) {
                if (cur.privEl.parentNode != l) {
                    re(cur.privEl), cur.privEl = l.appendChild(cur.privEl);
                    var c = ge("privacy_header");
                    c && c.tt && c.tt.hide()
                }
            } else cur.privEl = l.appendChild(ce("div", {
                id: "privacy_dropdown",
                innerHTML: '<div class="rows"></div>'
            })), cur.privRows = cur.privEl.firstChild, addEvent(cur.privEl, "mouseout", Privacy.hide.pbind(500)), addEvent(cur.privEl, "mouseover", function() {
                clearTimeout(cur.hidePrivacyTimer)
            });
            cur.privEl.className = "privacy_dropdown privacy_dropdown_" + r, setTimeout(addEvent.pbind(document, "click", Privacy.qhide), 1);
            var a = cur.privacy[r + "_types"] || cur.privacy._types,
                n = cur.privacy[r + "_lists"] || cur.privacy._lists || {},
                o = cur.privacy[r + "_hidden"] || cur.privacy._hidden || {},
                u = getStyle(e, "fontSize") || vk.fs;
            setStyle(cur.privRows, {
                fontSize: u
            }), cur.privSelIndex = s[0], o[cur.privSelIndex] && (cur.privSelIndex = 0);
            var v, d, f = [],
                p = !1;
            for (var _ in n) {
                p = !0;
                break
            }
            f.push('<div class="header" onclick="Privacy.hide(-1)"><div id="privacy_header" class="header_label">' + e.innerHTML + "</div></div>"), f.push(
                '<div class="body">');
            for (var _ in a)
                if (!o[_]) {
                    if (v = _ == cur.privSelIndex && _ != Privacy.listsType ? "_sel" : "", d = "onmouseover=\"Privacy.select('" + _ +
                        "')\" onclick=\"Privacy.choose(event, '" + _ + "')\"", _ == Privacy.listsType) {
                        if (!p) continue
                    } else d += " onmouseout=\"Privacy.unselect('" + _ + "')\"";
                    v && _ == Privacy.someType && (v += "_plus"), f.push('<div class="item' + v + '" id="privacy_item' + _ + '" ' + d + ">" + a[_] + "</div>")
                }
            if (a[Privacy.listsType] && p) {
                var h = cur.privSelIndex != Privacy.listsType;
                f.push('<div id="privacy_lists" class="privacy_lists">'), f.push('<div class="l_header" onclick="return cancelEvent(event)"><div class="l_header_label">' +
                    a[Privacy.listsType] + "</div></div>");
                for (var _ in n) {
                    var y = parseInt(_),
                        v = h ? "" : inArray(-y, s[2]) ? "_sel" : "";
                    f.push('<div class="l_item' + v + '" id="privacy_l_item' + y + '" onclick="Privacy.choose(event, ' + Privacy.listsType + ", " + y +
                        ')"><div class="privacy_item_icon"></div>' + n[_] + "</div>")
                }
                f.push("</div>")
            }
            f.push("</div>"), cur.privRows.innerHTML = f.join(""), cur.privSel = r;
            var S = data(cur.privEl, "tween");
            if (S && S.stop(!0), show(cur.privEl), a[Privacy.listsType] && h && hide("privacy_lists"), Privacy.toup = !1, getClientRectOffsetY(cur.privEl) > 0 &&
                getClientRectOffsetY(cur.privEl, !1, getSize(cur.privEl)[1]) > 0) {
                Privacy.toup = !0;
                var g = cur.privRows;
                g.appendChild(g.firstChild);
                for (var m = g.firstChild, C = m.firstChild, w = !1; C.nextSibling && C.nextSibling != w; C = m.firstChild) w = w ? m.insertBefore(C, w) : m.appendChild(C);
                var P = m.firstChild;
                if ("privacy_lists" == P.id)
                    for (var C = P.firstChild, w = !1; C.nextSibling && C.nextSibling != w; C = P.firstChild) w = w ? P.insertBefore(C, w) : P.appendChild(C)
            }
            Privacy.toup ? addClass(cur.privEl, "pdd_to_up") : removeClass(cur.privEl, "pdd_to_up"), cur.privacy[r + "_ralign"] ? addClass(cur.privEl, "pdd_ralign") :
                removeClass(cur.privEl, "pdd_ralign");
            var T = cur.privacy[r + "_help"],
                x = cur.privacy[r + "_help_w"];
            if (T) {
                var c = ge("privacy_header"),
                    b = getSize(c);
                showTooltip(c, {
                    text: T,
                    width: x ? x : 300,
                    dir: "left",
                    slideX: 15,
                    shift: [-(b[0] + 10), -b[1] / 2, 0],
                    nohide: !0
                })
            }
            return cancelEvent(i)
        }
    },
    getValue: function(e) {
        var i = cur.privacy[e],
            r = [];
        if (i[0] < Privacy.customType) r = [i[0]];
        else if (i[0] == Privacy.someType) r = [4, i[2].join(",")];
        else if (i[0] == Privacy.listsType) {
            var t = [];
            for (var s in i[2]) t.push(-i[2][s]);
            r = [5, t.join(",")]
        } else r = [-1, i[1], i[2].join(","), i[3].join(",")];
        return r.join("_")
    }
};
Privacy.qhide = Privacy.hide.pbind(-1);
try {
    jsDispatcher.triggerOnload("privacy.js")
} catch (e) {}
try {
    stManager.done("privacy.js")
} catch (e) {}
