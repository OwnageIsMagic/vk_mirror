! function() {
    var e = {
        _textEvent: function(t) {
            var d = t.target,
                s = d.dd,
                i = cur.wdd[s];
            switch (t.type) {
                case "focus":
                    d.focused = !0, (!d.active || i.opts.noMultiSelect && i.chosen && i.chosen[1] == val(d)) && (val(d, ""), d.style.color = "", d.active = 1, d.phd = !1),
                        e._updateTextInput(i), e._updateList(i), i.opts.onTextFocus && i.opts.onTextFocus();
                    break;
                case "blur":
                    d.focused = !1, (d.active = !d.phd && d.value ? 1 : "") ? i.over && i.opts.chooseOnBlur && i.opts.chooseOnBlur(i.over) && (e.select(s), hide(d), i.full ||
                        show(i.add)) : isEmpty(i.selected) && !i.chosen ? (val(d, d.ph), d.style.color = "#777", d.phd = !0) : i.chosen && !val(d) ? val(d, "INPUT" ==
                        d.tagName ? unclean(i.chosen[1]) : i.chosen[1]) : (hide(d), i.full || show(i.add)), e._hideList(i), i.opts.onTextBlur && i.opts.onTextBlur();
                    break;
                case "keydown":
                case "keypress":
                    clearTimeout(i.updateTimer), i.updateTimer = setTimeout(e._updateList.pbind(i, !1), 0);
                    var d = ge("wddi" + i.over + "_" + s);
                    if (t.keyCode == KEY.UP) return d && domPS(d) && e.over(s, domPS(d)
                        .id.replace(/^wddi/, "")
                        .replace(new RegExp("_" + s + "$", ""), ""), !0), cancelEvent(t);
                    if (t.keyCode == KEY.DOWN) return d && domNS(d) && e.over(s, domNS(d)
                        .id.replace(/^wddi/, "")
                        .replace(new RegExp("_" + s + "$", ""), ""), !0), cancelEvent(t);
                    if (t.keyCode == KEY.RETURN) return e.select(s), cancelEvent(t);
                    t.keyCode == KEY.ESC && i.text.blur()
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
                for (var s = d.target; s && s != t.text.parentNode; s = s.parentNode)
                    if (s == t.add) return e._focusText(t)
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
        _updateList: function(t, d, s) {
            if (t.cache[""]) {
                if (s = void 0 !== s ? s : trim(val(t.text)), t.lastQ === s && !d) return void e._showList(t);
                t.lastQ = s, clearTimeout(t.requestTimer);
                var i = t.opts.custom,
                    a = i && i(s);
                a ? e._renderList(t, a) : (a = t.cache[s], a ? e._renderList(t, a, !0) : (a = e._search(t, s), e._renderList(t, a, !t.opts.url), t.opts.url && (t.requestTimer =
                    setTimeout(e._requestList.pbind(t), t.opts.requestWait))))
            }
        },
        _index: function(t) {
            var d, s, i = t.opts.defaultItems,
                a = t.opts.items,
                r = [];
            for (d = 0, s = i.length; s > d; ++d) r.push(d);
            for (t.cache[""] = r, d = 0, s = a.length; s > d; ++d) e._indexItem(t, d, a[d])
        },
        _indexItem: function(e, t, d) {
            var s, i, a, r = "",
                o = e.opts.searchKeys,
                n = {};
            for (s = 0, a = o.length; a > s; ++s) r += " " + (d[o[s]] || "")
                .replace(e.opts.delimeter, " ")
                .replace(/<[^>]*>/g, "");
            for (r += (parseLatin(r) || "") + (parseCyr(r) || ""), r = trim(r.toLowerCase())
                .split(/\s+/), s = 0; s < r.length; s++)
                for (i = 1; i <= e.opts.wholeIndex; i++) {
                    var l = r[s].substr(0, i);
                    n[l] || (e.index[l] || (e.index[l] = []), e.index[l].push(t), n[l] = 1)
                }
        },
        _search: function(e, t) {
            if (t = trim(t.toLowerCase()
                    .replace(e.opts.delimeter, " ")), !t) return e.cache[""];
            var d = e.opts.wholeIndex;
            if (t.length <= d && -1 == t.indexOf(" ")) return e.index[t] || [];
            t = t.split(" ");
            var s, i, a, r = 0,
                o = "";
            for (s = 0, i = t.length; i > s; ++s) {
                var n = t[s].substr(0, d),
                    l = e.index[n];
                if ((!o || !l || l.length < r) && (r = l ? l.length : 0, o = n), !r) return []
            }
            var a = [],
                c = e.opts.searchKeys,
                u = c.length;
            for (s = 0, i = e.index[o].length; i > s; ++s) {
                for (var p = e.index[o][s], f = e.opts.items[p], v = !1, h = "", _ = 0; u > _; ++_) h += " " + (f[c[_]] || "")
                    .replace(e.opts.delimeter, " ")
                    .replace(/<[^>]*>/g, "");
                for (h += (parseLatin(h) || "") + (parseCyr(h) || ""), h = h.toLowerCase(), _ = 0, u = t.length; u > _; ++_)
                    if (-1 == h.indexOf(" " + t[_])) {
                        v = !0;
                        break
                    }
                v || a.push(p)
            }
            return a
        },
        _requestList: function(t) {
            var d = trim(val(t.text));
            d && ajax.post(t.opts.url, extend({
                str: d
            }, t.opts.params || {}), {
                onDone: function(s) {
                    t.cache[d] = e._search(t, d)
                        .concat(s), e._renderList(t, s, !0, !0)
                }
            })
        },
        _renderList: function(t, d, s, i) {
            var a = [],
                r = 0,
                o = t.lastQ,
                n = e._highlight,
                l = t.opts.itemMark;
            t.outdated && (i = !1), i ? r = t.list.childNodes.length : (t.shown = {}, r = 0);
            for (var c = 0, u = d.length; u > c; ++c) {
                var p = d[c];
                isArray(p) || (p = t.opts.items[p]);
                var f = p[0] + "",
                    v = f + "_",
                    h = "";
                if (!(t.selected[v] || t.shown[v] || t.selCount && p[8] > 0)) {
                    t.shown[v] = p;
                    var h, _ = isArray(p[3]) ? "" : " " + onlinePlatformClass(l(p)),
                        m = p[3] ? '<b class="fl_l wddi_thumb' + _ + '"><img class="wddi_img" src="' + (isArray(p[3]) ? "/images/community_" + (window.devicePixelRatio >=
                            2 ? 100 : 50) + ".png" : p[3]) + '" /></b>' : "";
                    r ? h = "wddi" : (h = "wddi_over", t.over = f);
                    var x = o && n(p[1] || "", o) || p[1] || "",
                        w = o && n(p[2] || "", o) || p[2] || "";
                    a.push('<div class="' + h + '" onmousedown="WideDropdown.select(\'' + t.id + "', event)\" onmouseover=\"WideDropdown.over('" + t.id + "', '" + clean(f) +
                        '\')" id="wddi' + f + "_" + t.id + '" onclick="">  <div class="wddi_data">' + m + '    <div class="wddi_text">' + x +
                        '</div>    <div class="wddi_sub">' + w + "</div>  </div></div>"), ++r
                }
            }
            a = a.join(""), !r && s && (a = '<div class="wddi_no">' + (o ? t.opts.noResult : t.opts.introText) + "</div>"), i ? t.list.innerHTML += a : a ? (t.outdated = !
                1, t.list.innerHTML = a) : t.outdated = !0, t.outdated || (t.list.style.height = r > 5 ? "242px" : "", e._showList(t), t.scroll && (r > 6 ? (t.scroll.show(),
                i ? t.scroll.update(!1, !0) : t.scroll.scrollTop()) : t.scroll.hide()), setTimeout(e._checkScroll.pbind(t), 0)), e._updatePos(t)
        },
        _highlight: function(e, t) {
            e = -1 == t.indexOf(" ") ? e.split(" ") : [e];
            var d = [escapeRE(t)],
                s = parseLatin(t),
                i = parseCyr(t),
                a = "";
            null !== s && d.push(escapeRE(s)), null !== i && d.push(escapeRE(i));
            var r = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + d.join("|") + "))(?![^<>]*>)(?![^&;]+;)", "gi");
            for (var o in e) a += (o > 0 ? " " : "") + e[o].replace(r, '$2<span class="wdd_hl">$3</span>');
            return a
        },
        _checkScroll: function(e) {
            void 0 === e.scroll && (e.scroll = !1, stManager.add(["ui_common.css", "ui_common.js"], function() {
                e.scroll = new Scrollbar(e.list, {
                    prefix: "fc_",
                    nomargin: !0,
                    global: !0,
                    nokeys: !0,
                    right: vk.rtl ? "auto" : 0,
                    left: vk.rtl ? 0 : "auto"
                })
            }))
        },
        _updatePos: function(e) {
            var t = e.opts.toup ? -getSize(e.listWrap)[1] - (e.opts.input && getSize(e.opts.input)[1] || 0) : getSize(e.listWrap.parentNode)[1];
            e.listWrap.style.marginTop = t + "px"
        },
        _showList: function(t) {
            t.text.focused && !t.disabled && (isVisible(t.listWrap) || (ge(t.listWrap)
                .style.display = "block", e._updateList(t, !0)), e._updatePos(t), addClass(t.container, "wdd_focused"))
        },
        _hideList: function(e) {
            hide(e.listWrap), removeClass(e.container, "wdd_focused")
        },
        _updateImgs: function(e, t) {
            var d = e.img;
            if (e.img) {
                var s, i = 0,
                    a = [],
                    r = [],
                    o = 0;
                for (var n in e.selected) {
                    var l = e.selected[n],
                        c = l[3],
                        u = l[4],
                        p = l[5],
                        f = l[6];
                    if (isArray(c))
                        for (var d, v = 0, h = c.length; h > v; ++v) d = clone(l), d[0] = f[v], d[3] = c[v], d[4] = u[v], d[5] = p[v], r.push(d);
                    else r.push(l)
                }
                o = r.length;
                for (var n in r) {
                    var _, s, m, x, w, l = r[n],
                        c = l[3],
                        u = l[4];
                    if (o > 3 ? (++i, _ = "wdd_img_tiny " + (1 == i || 4 == i ? "fl_l" : "fl_r")) : _ = 3 == o ? i++ ? "wdd_img_tiny fl_r" : "wdd_img_half fl_l" : 2 == o ?
                        "wdd_img_half " + (i++ ? "fl_r" : "fl_l") : "wdd_img_full", a.push(u ? '<a href="' + u + '" class="' + _ + '">' : '<div class="' + _ + '">'), a.push(
                            '<img class="wdd_img" src="' + c + '" />'), a.push(u ? "</a>" : "</div>"), i >= 4) break
                }
                if (s = a.join("") || e.opts.defImgText || "", e.imgRand = !1, t === !0) val(e.img, s);
                else {
                    for (x = ce("div", {
                            className: "wdd_img_layer",
                            innerHTML: s
                        }), w = e.imgRand = Math.random(), m = domFC(e.img); m && "wdd_img_layer" == m.className;) m = domNS(m);
                    animate(m ? e.img.insertBefore(x, m) : e.img.appendChild(x), {
                        opacity: 1
                    }, 150, function() {
                        e.imgRand === w && val(e.img, s)
                    })
                }
            }
        },
        init: function(t, d) {
            if (!(t = ge(t))) return !1;
            stManager.add(["notifier.css", "notifier.js"]);
            var s = t.id;
            if (!t.id) return !1;
            if (cur.wdd) {
                if (cur.wdd[s]) return !1
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
            var i = {
                id: s,
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
            return (i.text.ph = i.text.getAttribute("placeholder") || "") && t.setAttribute("placeholder", ""), i.text.dd = s, d.toup && addClass(t, "wdd_toup"), i.add = t
                .insertBefore(ce("div", {
                    className: "wdd_add fl_l",
                    innerHTML: '<div class="wdd_add2">  <table cellspacing="0" cellpadding="0"><tr>    <td><div class="wdd_add3">      <nobr>' + getLang(
                            "global_add") + '</nobr>    </div></td>    <td><div class="wdd_add_plus" onmousedown="WideDropdown.focus(\'' + s +
                        "')\"></div></td>  </table></div>"
                }), i.text), i.bubbles = t.insertBefore(ce("div", {
                    className: "wdd_bubbles"
                }), i.add), i.listWrap = t.insertBefore(ce("div", {
                    className: "wdd_lwrap",
                    innerHTML: '<div class="wdd_list"></div>'
                }, {
                    display: "none",
                    width: d.width || getSize(t)[0]
                }), t.firstChild), i.list = geByClass1("wdd_list", i.listWrap), browser.opera_mobile || (i.text.active = val(i.text) ? 1 : "", i.text.getValue = e._getTextValue
                    .bind(i.text), addEvent(i.text, "focus blur " + (browser.opera ? "keypress" : "keydown"), e._textEvent)), setTimeout(e._afterInit.pbind(i), 0), cur.wdd[
                    s] = i
        },
        initSelect: function(t, d) {
            if (!(t = ge(t))) return !1;
            stManager.add(["notifier.css", "notifier.js"]);
            var s = t.id;
            if (!t.id) return !1;
            if (cur.wdd) {
                if (cur.wdd[s]) return !1
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
            var i = {
                id: s,
                container: t,
                text: d.text || geByClass1("wdd_text", t),
                opts: d,
                selected: {},
                selCount: 0,
                index: {},
                delimeter: /[\s\(\)\.,\-]+/g,
                cache: {}
            };
            return i.text.dd = s, d.toup && addClass(t, "wdd_toup"), i.listWrap = t.insertBefore(ce("div", {
                className: "wdd_lwrap",
                innerHTML: '<div class="wdd_list"></div>'
            }, {
                display: "none",
                width: d.width || getSize(t)[0]
            }), t.firstChild), i.list = geByClass1("wdd_list", i.listWrap), setTimeout(e._index.pbind(i), 0), cur.wdd[s] = i
        },
        deinit: function(e, t) {
            if (t || (t = cur), !t.wdd || !(e = ge(e))) return !1;
            var d = e.id;
            if (!e.id) return !1;
            var s = t.wdd[d];
            return s ? (cleanElems(s.text, domPN(s.text)), delete t.wdd[d], !0) : !1
        },
        items: function(t, d, s) {
            var i = cur.wdd[t];
            s || (s = d), extend(i, {
                index: {},
                cache: {}
            }), extend(i.opts, {
                defaultItems: d || [],
                items: s || []
            }), e._index(i), e._updateList(i, !0)
        },
        over: function(e, t, d) {
            var s, i = cur.wdd[e];
            if (i.over && (s = ge("wddi" + i.over + "_" + e)) && (s.className = s.className.replace("wddi_over", "wddi")), i.over = t, (s = ge("wddi" + i.over + "_" + e)) &&
                (s.className = s.className.replace(/wddi(\s|$)/, "wddi_over "), d && i.scroll)) {
                var a = s.offsetTop,
                    r = s.offsetHeight,
                    o = i.list.scrollTop,
                    n = i.list.offsetHeight;
                o > a ? (i.list.scrollTop = a, i.scroll.update()) : a + r > o + n && (i.list.scrollTop = a + r - n, i.scroll.update())
            }
        },
        choose: function(t, d, s, i) {
            var a = cur.wdd[t],
                r = s ? s[0] : a.over,
                o = r + "_";
            if (s || (s = a.shown[o]), void 0 !== r && s) {
                if (a.over = !1, a.opts.onItemSelect && a.opts.onItemSelect(s) === !1) return d && cancelEvent(d);
                a.chosen = s, val(a.text, "INPUT" == a.text.tagName ? unclean(s[1]) : s[1]), a.text.style.color = "", a.text.blur(), e._textEvent({
                    target: a.text,
                    type: a.text.focused ? "focus" : "blur"
                });
                var n = a.opts.onChange && !i ? a.opts.onChange(1, r) : !0,
                    l = 1 === n;
                return 0 !== n && setTimeout(e._updateImgs.pbind(a, l), 0), d && cancelEvent(d)
            }
        },
        select: function(t, d, s) {
            var i = cur.wdd[t],
                a = s ? s[0] : i.over,
                r = a + "_";
            if (i.opts.noMultiSelect) return this.choose(t, d, s);
            if (s || (s = i.shown[r]), void 0 !== a && !i.selected[r] && s) {
                if (i.over = !1, i.opts.onItemSelect && i.opts.onItemSelect(s) === !1) return d && cancelEvent(d);
                i.selected[r] = s, ++i.selCount, i.full = i.opts.maxItems && i.selCount >= i.opts.maxItems || s[8] > 0, i.bubbles.appendChild(ce("div", {
                    id: "wddb" + r + t,
                    className: "summary_tab_sel fl_l",
                    innerHTML: '<div class="summary_tab2">  <table cellspacing="0" cellpadding="0"><tr>    <td><div class="summary_tab3">      <nobr>' + s[1] +
                        '</nobr>    </div></td>    <td><div class="summary_tab_x" onmousedown="WideDropdown.deselect(\'' + t + "', '" + clean(a + "") +
                        "', event)\"></div></td>  </table></div>"
                })), val(i.text, ""), i.text.blur(), e._textEvent({
                    target: i.text,
                    type: i.text.focused ? "focus" : "blur"
                }), i.full ? (hide(i.add), i.arrow.style.visibility = "hidden") : e._updateList(i, !0);
                var o = i.opts.onChange ? i.opts.onChange(1, a) : !0,
                    n = 1 === o;
                return 0 !== o && setTimeout(e._updateImgs.pbind(i, n), 0), d && cancelEvent(d)
            }
        },
        updimgs: function(t) {
            var d = cur.wdd[t],
                s = d.opts.onChange ? d.opts.onChange(0) : !0,
                i = 1 === s;
            0 !== s && setTimeout(e._updateImgs.pbind(d, i), 0)
        },
        deselect: function(t, d, s) {
            var i = cur.wdd[t]; {
                if (!i.disabled) {
                    if (void 0 === d) {
                        i.selCount = i.full = 0, i.arrow.style.visibility = "hidden";
                        for (var a in i.selected) delete i.selected[a];
                        val(i.bubbles, ""), i.text.blur(), hide(i.add), show(i.text), i.text.style.width = i.partWidth - i.textDelta - 2 + "px", e._updateList(i, !0), e._updateImgs(
                            i)
                    } else {
                        var r = d + "_";
                        if (!i.selected[r]) return;
                        delete i.selected[r], re("wddb" + r + t), i.selCount && --i.selCount, i.full = 0, i.arrow.style.visibility = "", i.text.blur(), i.selCount ? (show(
                            i.add), hide(i.text)) : (hide(i.add), show(i.text), e._updateTextInput(i)), e._updateList(i, !0)
                    }
                    var o = i.opts.onChange ? i.opts.onChange(-1, d) : !0,
                        n = 1 === o;
                    return 0 !== o && setTimeout(e._updateImgs.pbind(i, n), 0), s ? cancelEvent(s) : void 0
                }
                if (s) return cancelEvent(s)
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
            var s = cur.wdd[t];
            d && !s.disabled ? (s.disabled = !0, addClass(t, "wdd_disabled")) : !d && s.disabled && (s.disabled = !1, removeClass(t, "wdd_disabled"), e._updateList(s, !0))
        }
    };
    window.WideDropdown = e
}();
try {
    stManager.done("wide_dd.js")
} catch (e) {}
