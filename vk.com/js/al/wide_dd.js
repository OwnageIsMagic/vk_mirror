! function() {
    var e = {
        _textEvent: function(t) {
            var d = t.target,
                i = d.dd,
                s = cur.wdd[i];
            switch (t.type) {
                case "focus":
                    d.focused = !0, (!d.active || s.opts.noMultiSelect && s.chosen && s.chosen[1] == val(d)) && (val(d, ""), d.style.color = "", d.active = 1, d.phd = !1),
                        e._updateTextInput(s), e._updateList(s), s.opts.onTextFocus && s.opts.onTextFocus();
                    break;
                case "blur":
                    d.focused = !1, (d.active = !d.phd && d.value ? 1 : "") ? s.over && s.opts.chooseOnBlur && s.opts.chooseOnBlur(s.over) && (e.select(i), hide(d), s.full ||
                        show(s.add)) : isEmpty(s.selected) && !s.chosen ? (val(d, d.ph), d.style.color = "#777", d.phd = !0) : s.chosen && !val(d) ? val(d, "INPUT" ==
                        d.tagName ? unclean(s.chosen[1]) : s.chosen[1]) : (hide(d), s.full || show(s.add)), e._hideList(s), s.opts.onTextBlur && s.opts.onTextBlur();
                    break;
                case "keydown":
                case "keypress":
                    clearTimeout(s.updateTimer), s.updateTimer = setTimeout(e._updateList.pbind(s, !1), 0);
                    var d = ge("wddi" + s.over + "_" + i);
                    if (t.keyCode == KEY.UP) return d && domPS(d) && e.over(i, domPS(d)
                        .id.replace(/^wddi/, "")
                        .replace(new RegExp("_" + i + "$", ""), ""), !0), cancelEvent(t);
                    if (t.keyCode == KEY.DOWN) return d && domNS(d) && e.over(i, domNS(d)
                        .id.replace(/^wddi/, "")
                        .replace(new RegExp("_" + i + "$", ""), ""), !0), cancelEvent(t);
                    if (t.keyCode == KEY.RETURN) return e.select(i), cancelEvent(t);
                    t.keyCode == KEY.ESC && s.text.blur()
            }
        },
        _getTextValue: function() {
            return this.active ? this.value : ""
        },
        _widenTextInput: function(t) {
            vk.rtl ? t.text.style.width = Math.max((t.text.offsetTop > 20 ? t.fullWidth : t.partWidth) - t.fullWidth + (t.text.offsetLeft + t.text.offsetWidth) - 2, t.addWidth) -
                t.textDelta + "px" : t.text.style.width = Math.max((t.text.offsetTop > 20 ? t.fullWidth : t.partWidth) - (t.text.offsetLeft - t.textOffset) - 2, t.addWidth) -
                t.textDelta + "px", e._showList(t)
        },
        _updateTextInput: function(t) {
            t.addWidth && (t.text.style.width = t.addWidth - t.textDelta + "px", setTimeout(e._widenTextInput.pbind(t), 0))
        },
        _focusText: function(t) {
            t.full || t.disabled || (hide(t.add), show(t.text), e._updateTextInput(t), setTimeout(elfocus.pbind(t.text), 0))
        },
        _clickEvent: function(t, d) {
            if (d.target != t.arrow) {
                if (d.target == t.text.parentNode) return e._focusText(t);
                for (var i = d.target; i && i != t.text.parentNode; i = i.parentNode)
                    if (i == t.add) return e._focusText(t)
            }
        },
        _arrDownEvent: function(t, d) {
            isVisible(t.listWrap) ? e._hideList(t) : e._focusText(t)
        },
        _afterInit: function(t) {
            e._index(t), browser.opera_mobile || e._textEvent({
                target: t.text,
                type: t.text.focused ? "focus" : "blur"
            }), extend(t, {
                addWidth: getSize(t.add)[0],
                textDelta: getSize(t.text)[0] - intval(getStyle(t.text, "width")),
                fullWidth: getSize(domPN(t.text))[0] - 4,
                textOffset: t.text.offsetLeft
            }), t.partWidth = t.fullWidth - getSize(t.arrow)[0], t.text.focused ? e._updateList(t) : e._updateTextInput(t), addEvent(t.text.parentNode, "click", e._clickEvent
                .pbind(t)), addEvent(t.arrow, "mousedown", e._arrDownEvent.pbind(t)), t.opts.noMultiSelect && t.opts.chosen && e.choose(t.id, !1, t.opts.chosen, !0)
        },
        _updateList: function(t, d, i) {
            if (t.cache[""]) {
                if (i = void 0 !== i ? i : trim(val(t.text)), t.lastQ === i && !d) return void e._showList(t);
                t.lastQ = i, clearTimeout(t.requestTimer);
                var s = t.opts.custom,
                    r = s && s(i);
                r ? e._renderList(t, r) : (r = t.cache[i], r ? e._renderList(t, r, !0) : (r = e._search(t, i), e._renderList(t, r, !t.opts.url), t.opts.url && (t.requestTimer =
                    setTimeout(e._requestList.pbind(t), t.opts.requestWait))))
            }
        },
        _index: function(t) {
            var d, i, s = t.opts.defaultItems,
                r = t.opts.items,
                a = [];
            for (d = 0, i = s.length; i > d; ++d) a.push(d);
            for (t.cache[""] = a, d = 0, i = r.length; i > d; ++d) e._indexItem(t, d, r[d])
        },
        _indexItem: function(e, t, d) {
            var i, s, r, a = "",
                n = e.opts.searchKeys,
                o = {};
            for (i = 0, r = n.length; r > i; ++i) a += " " + (d[n[i]] || "")
                .replace(e.opts.delimeter, " ")
                .replace(/<[^>]*>/g, "");
            for (a += (parseLatin(a) || "") + (parseCyr(a) || ""), a = trim(a.toLowerCase())
                .split(/\s+/), i = 0; i < a.length; i++)
                for (s = 1; s <= e.opts.wholeIndex; s++) {
                    var l = a[i].substr(0, s);
                    o[l] || (e.index[l] || (e.index[l] = []), e.index[l].push(t), o[l] = 1)
                }
        },
        _search: function(e, t) {
            if (t = trim(t.toLowerCase()
                    .replace(e.opts.delimeter, " ")), !t) return e.cache[""];
            var d = e.opts.wholeIndex;
            if (t.length <= d && -1 == t.indexOf(" ")) return e.index[t] || [];
            t = t.split(" ");
            var i, s, r, a = 0,
                n = "";
            for (i = 0, s = t.length; s > i; ++i) {
                var o = t[i].substr(0, d),
                    l = e.index[o];
                if ((!n || !l || l.length < a) && (a = l ? l.length : 0, n = o), !a) return []
            }
            var r = [],
                c = e.opts.searchKeys,
                u = c.length;
            for (i = 0, s = e.index[n].length; s > i; ++i) {
                for (var p = e.index[n][i], f = e.opts.items[p], _ = !1, v = "", h = 0; u > h; ++h) v += " " + (f[c[h]] || "")
                    .replace(e.opts.delimeter, " ")
                    .replace(/<[^>]*>/g, "");
                for (v += (parseLatin(v) || "") + (parseCyr(v) || ""), v = v.toLowerCase(), h = 0, u = t.length; u > h; ++h)
                    if (-1 == v.indexOf(" " + t[h])) {
                        _ = !0;
                        break
                    }
                _ || r.push(p)
            }
            return r
        },
        _requestList: function(t) {
            var d = trim(val(t.text));
            d && ajax.post(t.opts.url, extend({
                str: d
            }, t.opts.params || {}), {
                onDone: function(i) {
                    t.cache[d] = e._search(t, d)
                        .concat(i), e._renderList(t, i, !0, !0)
                }
            })
        },
        _renderList: function(t, d, i, s) {
            var r = [],
                a = 0,
                n = t.lastQ,
                o = e._highlight,
                l = t.opts.itemMark;
            t.outdated && (s = !1), s ? a = (t.list.__uiScroll__ ? t.list.__uiScroll__.content : t.list)
                .childNodes.length : (t.shown = {}, a = 0);
            for (var c = 0, u = d.length; u > c; ++c) {
                var p = d[c];
                isArray(p) || (p = t.opts.items[p]);
                var f = p[0] + "",
                    _ = f + "_",
                    v = "";
                if (!(t.selected[_] || t.shown[_] || t.selCount && p[8] > 0)) {
                    t.shown[_] = p;
                    var v, h = isArray(p[3]) ? "" : " " + onlinePlatformClass(l(p)),
                        m = p[3] ? '<b class="fl_l wddi_thumb' + h + '"><img class="wddi_img" src="' + (isArray(p[3]) ? "/images/community_" + (window.devicePixelRatio >=
                            2 ? 100 : 50) + ".png" : p[3]) + '" /></b>' : "";
                    a ? v = "wddi" : (v = "wddi_over", t.over = f);
                    var x = n && o(p[1] || "", n) || p[1] || "",
                        w = n && o(p[2] || "", n) || p[2] || "";
                    r.push('<div class="' + v + '" onmousedown="WideDropdown.select(\'' + t.id + "', event)\" onmousemove=\"WideDropdown.over('" + t.id + "', '" + clean(f) +
                        '\')" id="wddi' + f + "_" + t.id + '" onclick="">  <div class="wddi_data">' + m + '    <div class="wddi_text">' + x +
                        '</div>    <div class="wddi_sub">' + w + "</div>  </div></div>"), ++a
                }
            }
            r = r.join(""), !a && i && (r = '<div class="wddi_no">' + (n ? t.opts.noResult : t.opts.introText) + "</div>"), s ? (t.list.__uiScroll__ ? t.list.__uiScroll__.content :
                    t.list)
                .innerHTML += r : r ? (t.outdated = !1, (t.list.__uiScroll__ ? t.list.__uiScroll__.content : t.list)
                    .innerHTML = r) : t.outdated = !0, t.outdated || (t.list.style.height = a > 5 ? "242px" : "", e._showList(t), t.scroll && t.scroll.scrollTop(),
                    setTimeout(e._checkScroll.pbind(t), 0)), e._updatePos(t)
        },
        _highlight: function(e, t) {
            e = -1 == t.indexOf(" ") ? e.split(" ") : [e];
            var d = [escapeRE(t)],
                i = parseLatin(t),
                s = parseCyr(t),
                r = "";
            null !== i && d.push(escapeRE(i)), null !== s && d.push(escapeRE(s));
            var a = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + d.join("|") + "))(?![^<>]*>)(?![^&;]+;)", "gi");
            for (var n in e) r += (n > 0 ? " " : "") + e[n].replace(a, '$2<span class="wdd_hl">$3</span>');
            return r
        },
        _checkScroll: function(e) {
            void 0 === e.scroll && (e.scroll = !1, stManager.add(["ui_common.css", "ui_common.js"], function() {
                e.scroll = new uiScroll(e.list, {
                    global: !0
                })
            }))
        },
        _updatePos: function(e) {
            var t = e.opts.toup ? -getSize(e.listWrap)[1] - (e.opts.input && getSize(e.opts.input)[1] || 0) : getSize(e.listWrap.parentNode)[1];
            e.listWrap.style.marginTop = t + "px"
        },
        _showList: function(t) {
            t.text.focused && !t.disabled && (isVisible(t.listWrap) || (ge(t.listWrap)
                .style.display = "block", t.scroll && t.scroll.update(), e._updateList(t, !0)), e._updatePos(t), addClass(t.container, "wdd_focused"))
        },
        _hideList: function(e) {
            hide(e.listWrap), removeClass(e.container, "wdd_focused")
        },
        _updateImgs: function(e, t) {
            var d = e.img;
            if (e.img) {
                var i, s = 0,
                    r = [],
                    a = [],
                    n = 0;
                for (var o in e.selected) {
                    var l = e.selected[o],
                        c = l[3],
                        u = l[4],
                        p = l[5],
                        f = l[6];
                    if (isArray(c))
                        for (var d, _ = 0, v = c.length; v > _; ++_) d = clone(l), d[0] = f[_], d[3] = c[_], d[4] = u[_], d[5] = p[_], a.push(d);
                    else a.push(l)
                }
                n = a.length;
                for (var o in a) {
                    var h, i, m, x, w, l = a[o],
                        c = l[3],
                        u = l[4];
                    if (n > 3 ? (++s, h = "wdd_img_tiny " + (1 == s || 4 == s ? "fl_l" : "fl_r")) : h = 3 == n ? s++ ? "wdd_img_tiny fl_r" : "wdd_img_half fl_l" : 2 == n ?
                        "wdd_img_half " + (s++ ? "fl_r" : "fl_l") : "wdd_img_full", r.push(u ? '<a href="' + u + '" class="' + h + '">' : '<div class="' + h + '">'), r.push(
                            '<img class="wdd_img" src="' + c + '" />'), r.push(u ? "</a>" : "</div>"), s >= 4) break
                }
                if (i = r.join("") || e.opts.defImgText || "", e.imgRand = !1, t === !0) val(e.img, i);
                else {
                    for (x = ce("div", {
                            className: "wdd_img_layer",
                            innerHTML: i
                        }), w = e.imgRand = Math.random(), m = domFC(e.img); m && "wdd_img_layer" == m.className;) m = domNS(m);
                    animate(m ? e.img.insertBefore(x, m) : e.img.appendChild(x), {
                        opacity: 1
                    }, 150, function() {
                        e.imgRand === w && val(e.img, i)
                    })
                }
            }
        },
        init: function(t, d) {
            if (!(t = ge(t))) return !1;
            stManager.add(["notifier.css", "notifier.js"]);
            var i = t.id;
            if (!t.id) return !1;
            if (cur.wdd) {
                if (cur.wdd[i]) return !1
            } else cur.wdd = {};
            d = extend({
                cacheLength: 1e4,
                requestWait: 300,
                wholeIndex: 2,
                maxItems: 29,
                searchKeys: [1],
                defaultItems: d.items || [],
                items: d.defaultItems || [],
                itemMark: function(e) {
                    return intval(e[5])
                }
            }, d || {});
            var s = {
                id: i,
                container: t,
                text: geByClass1("wdd_text", t),
                arrow: geByClass1("wdd_arr", t),
                img: d.img && ge(d.img),
                opts: d,
                selected: {},
                selCount: 0,
                index: {},
                delimeter: /[\s\(\)\.,\-]+/g,
                cache: {}
            };
            return (s.text.ph = s.text.getAttribute("placeholder") || "") && t.setAttribute("placeholder", ""), s.text.dd = i, d.toup && addClass(t, "wdd_toup"), s.add = t
                .insertBefore(ce("div", {
                    className: "wdd_add fl_l",
                    innerHTML: '<div class="wdd_add2">  <table cellspacing="0" cellpadding="0"><tr>    <td><div class="wdd_add3">      <nobr>' + getLang(
                            "global_add") + '</nobr>    </div></td>    <td><div class="wdd_add_plus" onmousedown="WideDropdown.focus(\'' + i +
                        "')\"></div></td>  </table></div>"
                }), s.text), s.bubbles = t.insertBefore(ce("div", {
                    className: "wdd_bubbles"
                }), s.add), s.listWrap = t.insertBefore(ce("div", {
                    className: "wdd_lwrap",
                    innerHTML: '<div class="wdd_list"></div>'
                }, {
                    display: "none",
                    width: d.width || getSize(t)[0]
                }), t.firstChild), s.list = geByClass1("wdd_list", s.listWrap), browser.opera_mobile || (s.text.active = val(s.text) ? 1 : "", s.text.getValue = e._getTextValue
                    .bind(s.text), addEvent(s.text, "focus blur " + (browser.opera ? "keypress" : "keydown"), e._textEvent)), setTimeout(e._afterInit.pbind(s), 0), cur.wdd[
                    i] = s
        },
        initSelect: function(t, d) {
            if (!(t = ge(t))) return !1;
            stManager.add(["notifier.css", "notifier.js"]);
            var i = t.id;
            if (!t.id) return !1;
            if (cur.wdd) {
                if (cur.wdd[i]) return !1
            } else cur.wdd = {};
            d = extend({
                cacheLength: 1e4,
                requestWait: 300,
                wholeIndex: 2,
                maxItems: 29,
                searchKeys: [1],
                defaultItems: d.items || [],
                items: d.defaultItems || [],
                itemMark: function(e) {
                    return intval(e[5])
                }
            }, d || {});
            var s = {
                id: i,
                container: t,
                text: d.text || geByClass1("wdd_text", t),
                opts: d,
                selected: {},
                selCount: 0,
                index: {},
                delimeter: /[\s\(\)\.,\-]+/g,
                cache: {}
            };
            return s.text.dd = i, d.toup && addClass(t, "wdd_toup"), s.listWrap = t.insertBefore(ce("div", {
                className: "wdd_lwrap",
                innerHTML: '<div class="wdd_list"></div>'
            }, {
                display: "none",
                width: d.width || getSize(t)[0]
            }), t.firstChild), s.list = geByClass1("wdd_list", s.listWrap), setTimeout(e._index.pbind(s), 0), cur.wdd[i] = s
        },
        deinit: function(e, t) {
            if (t || (t = cur), !t.wdd || !(e = ge(e))) return !1;
            var d = e.id;
            if (!e.id) return !1;
            var i = t.wdd[d];
            return i ? (cleanElems(i.text, domPN(i.text)), delete t.wdd[d], !0) : !1
        },
        items: function(t, d, i) {
            var s = cur.wdd[t];
            i || (i = d), extend(s, {
                index: {},
                cache: {}
            }), extend(s.opts, {
                defaultItems: d || [],
                items: i || []
            }), e._index(s), e._updateList(s, !0)
        },
        over: function(e, t, d) {
            var i = cur.wdd[e];
            if (i.over != t) {
                i.over && replaceClass("wddi" + i.over + "_" + e, "wddi_over", "wddi"), i.over = t;
                var s = ge("wddi" + i.over + "_" + e);
                replaceClass(s, "wddi", "wddi_over"), d && i.scroll.scrollIntoView(s.firstElementChild || s)
            }
        },
        choose: function(t, d, i, s) {
            var r = cur.wdd[t],
                a = i ? i[0] : r.over,
                n = a + "_";
            if (i || (i = r.shown[n]), void 0 !== a && i) {
                if (r.over = !1, r.opts.onItemSelect && r.opts.onItemSelect(i) === !1) return d && cancelEvent(d);
                r.chosen = i, val(r.text, "INPUT" == r.text.tagName ? unclean(i[1]) : i[1]), r.text.style.color = "", r.text.blur(), e._textEvent({
                    target: r.text,
                    type: r.text.focused ? "focus" : "blur"
                });
                var o = r.opts.onChange && !s ? r.opts.onChange(1, a) : !0,
                    l = 1 === o;
                return 0 !== o && setTimeout(e._updateImgs.pbind(r, l), 0), d && cancelEvent(d)
            }
        },
        select: function(t, d, i) {
            var s = cur.wdd[t],
                r = i ? i[0] : s.over,
                a = r + "_";
            if (s.opts.noMultiSelect) return this.choose(t, d, i);
            if (i || (i = s.shown[a]), void 0 !== r && !s.selected[a] && i) {
                if (s.over = !1, s.opts.onItemSelect && s.opts.onItemSelect(i) === !1) return d && cancelEvent(d);
                s.selected[a] = i, ++s.selCount, s.full = s.opts.maxItems && s.selCount >= s.opts.maxItems || i[8] > 0, s.bubbles.appendChild(ce("div", {
                    id: "wddb" + a + t,
                    className: "summary_tab_sel fl_l",
                    innerHTML: '<div class="summary_tab2">  <table cellspacing="0" cellpadding="0"><tr>    <td><div class="summary_tab3">      <nobr>' + i[1] +
                        '</nobr>    </div></td>    <td><div class="summary_tab_x" onmousedown="WideDropdown.deselect(\'' + t + "', '" + clean(r + "") +
                        "', event)\"></div></td>  </table></div>"
                })), val(s.text, ""), s.text.blur(), e._textEvent({
                    target: s.text,
                    type: s.text.focused ? "focus" : "blur"
                }), s.full ? (hide(s.add), s.arrow.style.visibility = "hidden") : e._updateList(s, !0);
                var n = s.opts.onChange ? s.opts.onChange(1, r) : !0,
                    o = 1 === n;
                return 0 !== n && setTimeout(e._updateImgs.pbind(s, o), 0), d && cancelEvent(d)
            }
        },
        updimgs: function(t) {
            var d = cur.wdd[t],
                i = d.opts.onChange ? d.opts.onChange(0) : !0,
                s = 1 === i;
            0 !== i && setTimeout(e._updateImgs.pbind(d, s), 0)
        },
        deselect: function(t, d, i) {
            var s = cur.wdd[t]; {
                if (!s.disabled) {
                    if (void 0 === d) {
                        s.selCount = s.full = 0, s.arrow.style.visibility = "hidden";
                        for (var r in s.selected) delete s.selected[r];
                        val(s.bubbles, ""), s.text.blur(), hide(s.add), show(s.text), s.text.style.width = s.partWidth - s.textDelta - 2 + "px", e._updateList(s, !0), e._updateImgs(
                            s)
                    } else {
                        var a = d + "_";
                        if (!s.selected[a]) return;
                        delete s.selected[a], re("wddb" + a + t), s.selCount && --s.selCount, s.full = 0, s.arrow.style.visibility = "", s.text.blur(), s.selCount ? (show(
                            s.add), hide(s.text)) : (hide(s.add), show(s.text), e._updateTextInput(s)), e._updateList(s, !0)
                    }
                    var n = s.opts.onChange ? s.opts.onChange(-1, d) : !0,
                        o = 1 === n;
                    return 0 !== n && setTimeout(e._updateImgs.pbind(s, o), 0), i ? cancelEvent(i) : void 0
                }
                if (i) return cancelEvent(i)
            }
        },
        focus: function(t) {
            e._focusText(cur.wdd[t])
        },
        clear: function(t) {
            var d = cur.wdd[t];
            val(d.text, ""), d.text.blur(), e._textEvent({
                target: d.text,
                type: d.text.focused ? "focus" : "blur"
            }), e._updateList(d, !0)
        },
        disable: function(t, d) {
            var i = cur.wdd[t];
            d && !i.disabled ? (i.disabled = !0, addClass(t, "wdd_disabled")) : !d && i.disabled && (i.disabled = !1, removeClass(t, "wdd_disabled"), e._updateList(i, !0))
        }
    };
    window.WideDropdown = e
}();
try {
    stManager.done("wide_dd.js")
} catch (e) {}
