function OList(t, e, i, s) {
    0 === i.length && (i = {}), s = s || {}, this.indexer = new vkIndexer(e, s.getName ? s.getName : function(t) {
            return t[1]
        }), this.owners = e, this.tpl = s.tpl, this.rsTpl = s.rsTpl, this.idIndex = s.idIndex || 0, this.selected = i, this.getUnsorted = s.getUnsorted, this.unsortedIndex = s.unsortedIndex ||
        0, this.box = t, this.filter = s.filter, s.onTabUpdate && (this.onTabUpdate = s.onTabUpdate), t.setButtons(getLang("global_save"), function(i) {
            var n = {},
                r = [],
                l = [];
            each(e, function() {
                !o.invertedSelection && o.selected[this[o.idIndex]] || o.invertedSelection && !o.selected[this[o.idIndex]] ? (n[this[o.idIndex]] = this, r.push(this[o.idIndex])) :
                    l.push(this[o.idIndex])
            }), cur.onOListSave(r, l, n, s.ret || {}, i) !== !1 && t.hide(200)
        }, getLang("global_cancel")), s.box_options && t.setOptions(s.box_options);
    var o = this;
    this.scrollNode = geByClass1("privacy_olist", t.bodyNode), this.moreEl = geByClass1("olist_more", t.bodyNode, "a"), this.olistEl = geByClass1("olist", t.bodyNode, "div"), this
        .olistFilter = ge("olist_filter_actions"), this.sel = s.sel || 0, this.tabs = geByClass1("ui_tabs", t.bodyNode), this.noSelMsg = s.noSelMsg || getLang(
            "friends_no_user_selected"), this.invertedSelection = !1;
    var n = geByClass1("olist_tab_sel", this.tabs);
    this.selCnt = intval(val(geByClass1("ui_tab_count", n)));
    var r = this.filter ? this.filter : this.filter = ge("olist_filter");
    setTimeout(elfocus.pbind(r), 100), this.moreEl && (isVisible(this.moreEl) ? this.moreEl.onclick = function(t) {
        return o.renderList("", 60), cancelEvent(t)
    } : (re(this.moreEl), show(this.moreEl))), addEvent(this.olistEl, "click", this.onMouseEvent.bind(this)), addEvent(this.scrollNode, "scroll", this.onScroll.bind(this));
    var l = o.sel ? o.sel > 0 ? "sel" : "unsel" : "all",
        a = geByClass1("olist_tab_" + l, o.tabs);
    a = a && geByClass1("ui_tab", a), (cur.onOListTabChange = function(t, e) {
        t && uiTabs.switchTab(t), void 0 === e && (e = void 0 === o.selPrev ? 0 : o.selPrev), o.selPrev = o.sel, o.sel = e, o.renderList(val(r), 0, e), setTimeout(elfocus.pbind(
            r), 100)
    })(a, o.sel), cur.onOlistChange = o.renderList.bind(this), cur.onOlistSelect = o.onOlistSelect.bind(this), cur.onOlistFilters = o.onOlistFilters.bind(this)
}
var uiTabs = {
        initTabs: function(t, e) {
            if (!(browser.msie && intval(browser.version) < 10 || browser.opera && intval(browser.version) < 15 || hasClass(t, "ui_tabs_sliding"))) {
                var i = getSize(e)[0],
                    s = e.offsetLeft;
                setPseudoStyle(t, "before", {
                    width: i + "px",
                    left: s + "px"
                })
            }
        },
        goTab: function(t, e, i) {
            if (checkEvent(e)) return !0;
            var s = gpeByClass("ui_tabs", t);
            return i || geByClass1("ui_tab_sel", s) != t ? (uiTabs.switchTab(t), uiTabs.showProgress(s), nav.go(t, e)) : !1
        },
        switchTab: function(t, e) {
            var i = gpeByClass("ui_tabs", t),
                s = geByClass1("ui_tab_sel", i),
                o = null,
                n = null,
                r = hasClass(s, "ui_tab_group_item") ? n = gpeByClass("ui_tab_group", s) : s,
                l = hasClass(t, "ui_tab_group_item") ? o = gpeByClass("ui_tab_group", t) : t;
            if (t != s && (t != l && (uiTabs.toggleGroup(l, !1), uiTabs.resetLabel(l, t)), r && (uiTabs.initTabs(i, r), e = e || {}, e.noAnim || l === r || (addClass(i,
                    "ui_tabs_sliding"), clearTimeout(cur.tabSlidingTO), cur.tabSlidingTO = setTimeout(removeClass.pbind(i, "ui_tabs_sliding"), 300)), setPseudoStyle(i,
                    "before", {
                        width: getSize(l)[0] + "px",
                        left: l.offsetLeft + "px"
                    }), s != r && l != r && uiTabs.resetLabel(r), r != s && removeClass(r, "ui_tab_group_sel"), removeClass(s, "ui_tab_sel")), l != t && addClass(l,
                    "ui_tab_group_sel"), addClass(t, "ui_tab_sel"), n && removeClass(n, "ui_tab_hide_separator"), o)) {
                i = geByClass1("ui_tab_group_items", o, "div")
                    .children;
                var a = null;
                each(i, function(t, e) {
                    "SPAN" === e.tagName ? a = e : hasClass(domFC(e), "ui_tab_sel") || (a = null)
                }), a && addClass(o, "ui_tab_hide_separator")
            }
            return !1
        },
        resetLabel: function(t, e) {
            var i = geByClass1("ui_tab_group_label", t, "span");
            i && (i.innerHTML = (e || i)
                .getAttribute("data-default-label"))
        },
        toggleGroup: function(t, e) {
            var i = data(t, "visibletimer");
            i && clearTimeout(i), data(t, "visibletimer", setTimeout(toggleClass.pbind(t, "visible", e), e ? 0 : 100)), toggleClass(t, "shown", e), browser.msie8 && (setStyle(
                t, {
                    display: "table"
                }), setTimeout(setStyle.pbind(t, {
                display: ""
            }), 0))
        },
        showGroup: function(t) {
            var e = data(t, "hidetimer");
            e && (clearTimeout(e), data(t, "hidetimer", 0)), uiTabs.toggleGroup(t, !0)
        },
        hideGroup: function(t) {
            var e = data(t, "hidetimer");
            e || data(t, "hidetimer", setTimeout(function() {
                uiTabs.toggleGroup(t, !1), data(t, "hidetimer", 0)
            }, 200))
        },
        showProgress: function(t) {
            hasClass(t, "ui_tabs") || (t = gpeByClass("ui_tabs", t)), addClass(t, "ui_tabs_loading")
        },
        hideProgress: function(t) {
            hasClass(t, "ui_tabs") || (t = gpeByClass("ui_tabs", t)), removeClass(t, "ui_tabs_loading")
        },
        showSearch: function(t, e) {
            if (checkEvent(e)) return !0;
            var i = gpeByClass("ui_tabs", t),
                s = (domByClass(i, "ui_search"), domByClass(i, "_field"));
            return addClass(i, "ui_tabs_search_opened"), uiSearch.focus(s), !1
        },
        hideSearch: function(t, e) {
            if (checkEvent(e)) return !0;
            var i = gpeByClass("ui_tabs", t);
            return removeClass(i, "ui_tabs_search_opened"), !1
        }
    },
    uiActionsMenu = {
        toggle: function(t, e) {
            toggleClass(t, "shown", e)
        },
        show: function(t, e) {
            var i = data(t, "hidetimer");
            i && (clearTimeout(i), data(t, "hidetimer", 0)), uiActionsMenu.toggle(t, !0)
        },
        hide: function(t, e) {
            var i = data(t, "hidetimer");
            i || data(t, "hidetimer", setTimeout(function() {
                uiActionsMenu.toggle(t, !1), data(t, "hidetimer", 0)
            }, 200))
        }
    },
    uiRightMenu = {
        initMenu: function(t, e) {
            if (!(browser.msie && intval(browser.version) < 10 || browser.opera && intval(browser.version) < 15 || hasClass(t, "ui_rmenu_sliding"))) {
                var i = geByClass1("ui_rmenu_item", t),
                    s = geByClass1("ui_rmenu_item_sel", t),
                    o = s || i,
                    n = getSize(o)[1],
                    r = o.offsetTop;
                e || (setPseudoStyle(t, "before", {
                    height: n + "px",
                    top: s ? r + "px" : null
                }), addClass(t, "ui_rmenu_sliding"))
            }
        },
        go: function(t, e, i, s) {
            if (checkEvent(e)) return !0;
            var o = gpeByClass("ui_rmenu", t);
            return geByClass1("ui_rmenu_item_sel", o) == t ? !1 : (uiRightMenu.switchMenu(t), uiRightMenu.showProgress(t), i === !1 ? !1 : nav.go(i || t, e, extend({
                fromMenu: !0
            }, s || {})))
        },
        switchMenu: function(t) {
            var e = gpeByClass("ui_rmenu", t),
                i = geByClass1("ui_rmenu_item_sel", e);
            if (t == i) return !1;
            var s = hasClass(t, "_audio_album_item");
            uiRightMenu.initMenu(e, s);
            var o = getSize(t)[1],
                n = t.offsetTop,
                r = [],
                l = [],
                a = domPN(t);
            if (s && (n += getXY(a)[1] - getXY(e)[1]), hasClass(e, "_ui_rmenu_auto_expand")) {
                var h = geByClass("_ui_rmenu_sublist", e),
                    c = hasClass(t, "_ui_rmenu_subitem") ? gpeByClass("_ui_rmenu_sublist", t) : hasClass(domNS(t), "_ui_rmenu_sublist") ? domNS(t) : !1;
                each(h, function() {
                    isVisible(this) && this !== c && (r.push(this), hide(this))
                }), c && !isVisible(c) && (l.push(c), show(c)), n = t.offsetTop, each(r, function() {
                    show(this)
                }), each(l, function() {
                    hide(this)
                })
            }
            return setPseudoStyle(e, "before", {
                height: o + "px",
                top: n + "px"
            }), removeClass(i, "ui_rmenu_item_sel"), addClass(t, "ui_rmenu_item_sel"), hasClass(e, "_ui_rmenu_auto_expand") ? each(r.concat(l), function() {
                uiRightMenu.toggleSubmenu(this)
            }) : hasClass(t, "_ui_rmenu_subitem") && !isVisible(domPN(t)) && uiRightMenu.toggleSubmenu(domPN(t)), !1
        },
        unselectAll: function(t) {
            removeClass(t, "ui_rmenu_sliding"), removeClass(geByClass1("ui_rmenu_item_sel", t), "ui_rmenu_item_sel")
        },
        hideSliding: function(t) {
            removeClass(t, "ui_rmenu_sliding")
        },
        showProgress: function(t) {
            hasClass(t, "ui_rmenu") || (t = gpeByClass("ui_rmenu", t));
            var e = geByClass1("ui_rmenu_item_sel", t);
            hideProgress(t), showProgress(domFC(e), "", "", !0), addClass(t, "ui_rmenu_loading")
        },
        hideProgress: function(t) {
            hasClass(t, "ui_rmenu") || (t = gpeByClass("ui_rmenu", t)), hideProgress(t);
            var e = gpeByClass("ui_rmenu", t);
            removeClass(t, "ui_rmenu_loading"), uiRightMenu.hideSliding(e)
        },
        toggleSubmenu: function(t, e) {
            var i, s, o = gpeByClass("ui_rmenu", e);
            return "string" == typeof t ? s = geByClass1("_ui_rmenu_" + t + "_list", o) : (s = t, t = s.getAttribute("data-sublist-id")), i = geByClass1("_ui_rmenu_" + t +
                "_toggle", o), s ? (void 0 !== e && uiRightMenu.hideSliding(o), i && toggleClass(i, "ui_rmenu_item_expanded", !isVisible(s)), slideToggle(s, s && getSize(s)[
                1] ? 100 : 0), !1) : !1
        }
    },
    uiPageBlock = {
        showSaved: function(t) {
            var e = ge(t),
                i = e && gpeByClass("page_block", e),
                s = i && geByClass1("page_block_saved", i);
            if (e && i && s) {
                var o = animate.pbind(s, {
                    opacity: 1
                }, 200, animate.pbind(s, {
                    opacity: 0
                }, 2e3));
                uiPageBlock.scrollToStart(i, o)
            }
        },
        scrollToStart: function(t, e) {
            var i = getXY(t)[1],
                s = 60,
                o = 200;
            scrollGetY() > i - s ? (scrollToY(i - s, o), e && setTimeout(e, o)) : e && e()
        }
    },
    uiSearch = {
        getWrapEl: function(t) {
            return domClosest("_wrap", t)
        },
        getFieldEl: function(t) {
            return t = ge(t), hasClass("_field", t) ? t : domByClass(uiSearch.getWrapEl(t), "_field")
        },
        stopEvents: function(t) {
            var e = data(t, "eventHandlers") || [];
            each(e, function(t, e) {
                e.stop()
            })
        },
        startEvents: function(t) {
            var e = data(t, "eventHandlers") || [];
            each(e, function(t, e) {
                e.stop(), e.start()
            })
        },
        init: function(el, options) {
            el = uiSearch.getFieldEl(el);
            var wrapEl = uiSearch.getWrapEl(el),
                initJs = !options && domData(wrapEl, "init-js");
            if (!options) return void(initJs && (domData(wrapEl, "init-js", ""), eval("(function() {" + initJs + "})();")));
            if (!data(el, "inited")) {
                if (data(el, "inited", 1), data(el, "eventHandlers", []), placeholderInit(el), data(el, "opts", options), addEvent(el, "keydown", uiSearch.onKeyDown.pbind(el)),
                    addEvent(el, "paste cut input", function(t) {
                        setTimeout(uiSearch.onChanged.pbind(el, !1, t), 0)
                    }), addEvent(el, "blur", uiSearch.onBlurred.pbind(el)), options.onBlur && addEvent(el, "blur", options.onBlur), options.onFocus && addEvent(el, "focus",
                        options.onFocus), options.fixed) {
                    var scrollNode = isAncestor(el, boxLayerWrap) ? boxLayerWrap : window,
                        onSearchScroll = uiSearch.scrollResize.pbind(el),
                        eventHandler = {
                            stop: removeEvent.pbind(scrollNode, "scroll", onSearchScroll),
                            start: addEvent.pbind(scrollNode, "scroll", onSearchScroll)
                        };
                    data(el, "eventHandlers", (data(el, "eventHandlers") || [])
                        .concat([eventHandler])), eventHandler.start()
                }
                cur.destroy.push(uiSearch.stopEvents.pbind(el)), uiSearch.initFilters(el, options)
            }
        },
        onKeyDown: function(t, e) {
            if (cur.preventInputActions && -1 != [KEY.RETURN, KEY.ESC, KEY.DOWN, KEY.UP].indexOf(e.keyCode)) return cancelEvent(e);
            if (e.keyCode == KEY.RETURN) {
                t = uiSearch.getFieldEl(t);
                var i = data(t, "opts"),
                    s = t.getValue();
                return i.onEnter && i.onEnter(t, s, e), cancelEvent(e)
            }
            if (e.keyCode == KEY.ESC) {
                var o = !!val(t);
                return uiSearch.reset(t, !1, e), o ? cancelEvent(e) : !0
            }
            setTimeout.pbind(uiSearch.onChanged.pbind(t, !1, e), 0)
        },
        onBlurred: function(t, e) {
            var i = data(t, "opts");
            i.onBlur && i.onBlur.call(t, e)
        },
        onChanged: function(t, e, i) {
            t = uiSearch.getFieldEl(t);
            var s = data(t, "opts"),
                o = uiSearch.getWrapEl(t),
                n = t.getValue();
            toggleClass(o, "ui_search_field_empty", !n), e || s.onChange && s.onChange.call(t, n, i)
        },
        focus: function(t) {
            t = uiSearch.getFieldEl(t), elfocus(t)
        },
        reset: function(t, e, i) {
            t = uiSearch.getFieldEl(t);
            var s = data(t, "opts"),
                o = uiSearch.getWrapEl(t),
                n = t.getValue();
            n ? (t.setValue(""), uiSearch.onChanged(t, e, i), e || s.onEnter && s.onEnter(t, ""), elfocus(t)) : s.in_tabs && uiTabs.hideSearch(o)
        },
        showProgress: function(t) {
            t = uiSearch.getFieldEl(t);
            var e = uiSearch.getWrapEl(t);
            addClass(e, "ui_search_loading")
        },
        hideProgress: function(t) {
            t = uiSearch.getFieldEl(t);
            var e = uiSearch.getWrapEl(t);
            removeClass(e, "ui_search_loading")
        },
        scrollResize: function(t) {
            if (!browser.mobile && !t.ignoreFixed) {
                t = uiSearch.getFieldEl(t);
                var e, i = uiSearch.getWrapEl(t),
                    s = i && domPN(i),
                    o = i && hasClass(i, "ui_search_fixed"),
                    n = cur.uiSearchPageBlock || gpeByClass("page_block", t),
                    r = getSize(ge("page_header"))[1] || 0,
                    l = i && isAncestor(i, boxLayerWrap);
                if (i && s && (l || gpeByClass("scroll_fix", i))) {
                    var a = l ? getXY(s, !0)[1] < 0 : getXY(s, !0)[1] < ge("page_header_cont")
                        .offsetHeight;
                    if (a) {
                        var h = intval(getStyle(t, "width"));
                        !o && h && (setStyle(s, "height", getSize(i)[1]), setStyle(i, "width", h), addClass(i, "ui_search_fixed"));
                        var c = Math.min(0, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(ge("page_layout"))[0]));
                        if (setStyle(i, {
                                marginLeft: c
                            }), n) {
                            var u = getXY(n)[1] + getSize(n)[1] - scrollGetY() - t.offsetHeight;
                            e = Math.min(r, Math.max(-t.offsetHeight, u)), e != cur.lastUISearchPos && (setStyle(i, "top", e), cur.lastUISearchPos = e)
                        }
                    } else o && (setStyle(s, "height", ""), setStyle(i, {
                        top: "",
                        marginLeft: ""
                    }), cur.lastUISearchPos = !1, removeClass(i, "ui_search_fixed"))
                }
            }
        },
        initFilters: function(t, e) {
            function i(t, e) {
                toggleClass(t, "shown", e), browser.msie8 && (setStyle(t, {
                    display: "table"
                }), setTimeout(setStyle.pbind(t, {
                    display: ""
                }), 0))
            }
            var s = uiSearch.getWrapEl(t);
            link = geByClass1("ui_search_fltr_control", s), eventHandler = {
                start: function() {
                    addEvent(link, "click", function(t) {
                        (!hasClass(link, "shown") || hasClass(t.target, "ui_search_fltr_control")) && i(link)
                    }), addEvent(link, "mouseover", function() {
                        if (hasClass(link, "shown")) {
                            var t = data(link, "hidetimer");
                            t && (clearTimeout(t), data(link, "hidetimer", 0)), i(link, !0)
                        }
                    }), addEvent(link, "mouseout", function() {
                        var t = data(link, "hidetimer");
                        t || data(link, "hidetimer", setTimeout(function() {
                            i(link, !1), data(link, "hidetimer", 0)
                        }, 200))
                    })
                },
                stop: removeEvent.pbind(link, "click mouseover mouseout")
            }, data(t, "eventHandlers", (data(t, "eventHandlers") || [])
                .concat([eventHandler])), eventHandler.start();
            var o = uiSearch._getTokensPane(t);
            addEvent(o, "click", function(e) {
                if (hasClass(e.target, "token_title") || hasClass(e.target, "token_del")) {
                    var i = gpeByClass("token", e.target),
                        s = i.getAttribute("data-id");
                    uiSearch.removeFilter(t, s)
                }
            })
        },
        removeAllFilters: function(t) {
            var e = uiSearch._getTokensPane(t),
                i = data(e, "cur_filters");
            each(extend({}, i), function(e) {
                uiSearch.removeFilter(t, e)
            })
        },
        toggleFilter: function(t, e, i, s) {
            s ? uiSearch.addFilter(t, e, i) : uiSearch.removeFilter(t, e)
        },
        addFilter: function(t, e, i) {
            if (e && i) {
                var s = uiSearch._getTokensPane(t),
                    o = data(s, "cur_filters") || {};
                o[e] = i, data(s, "cur_filters", o), uiSearch._renderFilters(s, o)
            }
        },
        removeFilter: function(t, e) {
            var i = uiSearch._getTokensPane(t),
                s = data(i, "cur_filters") || {},
                o = !!s[e];
            delete s[e], data(i, "cur_filters", s);
            var n = data(t, "rto");
            if (clearTimeout(n), n = setTimeout(function() {
                    uiSearch._renderFilters(i, s)
                }, 1), data(t, "rto", n), o) {
                var r = uiSearch.getFieldEl(t),
                    l = data(r, "opts");
                l.onFilterRemoved && l.onFilterRemoved(e, r)
            }
        },
        _getTokensPane: function(t) {
            var e = uiSearch.getWrapEl(t) || t;
            return geByClass1("ui_search_filters_pane", e)
        },
        _renderFilters: function(t, e) {
            var i = (isEmpty(e), geByClass1("ui_search_filters", t));
            if (isEmpty(e)) removeClass(t, "expanded"), setTimeout(function() {
                i.innerHTML = "", hide(t)
            }, 200);
            else {
                show(t), setTimeout(function() {
                    addClass(t, "expanded")
                });
                var s = [],
                    o = {},
                    n = 0;
                each(e, function(t, e) {
                    var i = !1,
                        r = !1,
                        l = t.match(/(.*?)_([^_]+)$/),
                        a = l && l[2] || !1;
                    l = l && l[1] || !1, l && (void 0 !== o[l] && "from" === a ? r = o[l] : void 0 !== o[l] && (i = o[l] + 1), o[l] = n);
                    var h = '<div class="token" id="token' + t + '" data-id="' + t + '"><div class="token_title">' + e + '</div><div class="token_del"></div></div>';
                    r !== !1 ? s.splice(r, 0, h) : i !== !1 ? s.splice(i, 0, h) : s.push(h), n++
                }), i.innerHTML = s.join("")
            }
        }
    },
    uiScrollBox = {
        init: function(t, e) {
            cur.lSTL && re(cur.lSTL), e = e || {};
            var i = e.parent = e.parent || boxLayerWrap;
            extend(cur, {
                lSTLWrap: i,
                lSTL: i.appendChild(ce("div", {
                    id: "layer_stl",
                    innerHTML: '<div id="layer_stl_bg" class="fixed"></div><div id="layer_stl_cl"></div><nobr id="layer_stl_text" class="fixed">' + getLang(
                        "global_to_top") + "</nobr>",
                    el: t.bodyNode,
                    onclick: cancelEvent,
                    onmousedown: uiScrollBox.lSTLDown,
                    sc: uiScrollBox.onScroll
                })),
                lSTLShown: 0,
                lSTLWas: 0,
                lSTLWasSet: 0,
                lSTLOpts: e
            }), t && t.setOptions({
                onShow: uiScrollBox.show,
                onHide: uiScrollBox.hide
            }), t && t.scrollInited || (addEvent(i, "scroll", uiScrollBox.onScroll), t.scrollInited = !0), onBodyResize(), uiScrollBox.onScroll()
        },
        hide: function() {
            var t = cur.lSTLOpts;
            t && t.parent && (removeEvent(t.parent, "scroll", uiScrollBox.onScroll), hide(cur.lSTL), cur.lSTLShown = 0, t.onHide && t.onHide())
        },
        show: function() {
            var t = cur.lSTLOpts;
            t && t.parent && (addEvent(t.parent, "scroll", uiScrollBox.onScroll), setTimeout(uiScrollBox.onScroll, 0), t.onShow && t.onShow())
        },
        lSTLDown: function(t) {
            if (t = t || window.event, !checkEvent(t)) {
                var e = cur.lSTLWrap;
                if (!__afterFocus) {
                    var i = 0,
                        s = e.scrollTop;
                    cur.lSTLWasSet && cur.lSTLWas ? (i = cur.lSTLWas, cur.lSTLWas = 0) : cur.lSTLWas = s, e.scrollTop = i
                }
                return cancelEvent(t)
            }
        },
        onScroll: function() {
            if (cur.lSTL) {
                var t = cur.lSTLWrap,
                    e = t.scrollTop,
                    i = 200,
                    s = cur.lSTLWas || e > i,
                    o = 0;
                cur.lSTL.style.marginTop = Math.min(e, boxLayer.scrollHeight - cur.lSTL.scrollHeight - 1) + "px", s ? (1 !== cur.lSTLShown && (show(cur.lSTL), cur.lSTLShown =
                    1), cur.lSTLWas && e > 500 && (cur.lSTLWas = 0), e > i ? (o = (e - i) / i, cur.lSTLWasSet && (cur.lSTLWasSet = 0, val(domLC(cur.lSTL), getLang(
                    "global_to_top")), removeClass(domLC(cur.lSTL), "down"))) : (o = (i - e) / i, cur.lSTLWas && (cur.lSTLWasSet || (cur.lSTLWasSet = 1, val(domLC(cur.lSTL),
                    ""), addClass(domLC(cur.lSTL), "down"))))) : 0 !== cur.lSTLShown && (hide(cur.lSTL), cur.lSTLShown = 0), setStyle(cur.lSTL, {
                    opacity: Math.min(Math.max(o, 0), 1)
                })
            }
        }
    },
    uiPhotoZoom = {
        over: function(t, e, i) {
            if (!browser.mobile) {
                hasClass(t, "ui_zoom_wrap") || addClass(t, "ui_zoom_wrap"), cur.bigphCache = cur.bigphCache || {}, i = i || {};
                var s = domFC(t),
                    o = cur.bigphCache[e];
                "A" == s.tagName && hasClass(s, "ui_zoom_outer") || (s = t.insertBefore(se('<a class="ui_zoom_outer" href="' + (o && o._id ? "/photo" + o._id + "?all=1" :
                        "/albums" + e) + '"><div class="ui_zoom_inner"><div class="ui_zoom"><div class="ui_zoom_icon"></div></div></div></a>'), domFC(t)), s._uid = e, s.offsetHeight,
                    addClass(s, "ui_zoom_added")), s.onclick = uiPhotoZoom.click.pbind(t, e, i), i.fastLoad && uiPhotoZoom.load(t, e, i)
            }
        },
        click: function(t, e, i, s) {
            if (!s || checkEvent(s) === !1) {
                i.fastLoad || uiPhotoZoom.load(t, e, i);
                var o = cur.bigphCache[e];
                if (o) return "load" == o || "show" == o ? (cur.bigphCache[e] = "show", cancelEvent(s)) : (i.onBeforeShow && i.onBeforeShow(), extend(o, extend({
                    jumpTo: {
                        z: "albums" + e
                    }
                }, i.showOpts || {})), showPhoto(o._id, "album" + e + "_0/rev", o, s))
            }
        },
        load: function(t, e, i) {
            var s = domFC(t),
                o = cur.bigphCache[e];
            void 0 === o && (cur.bigphCache[e] = "load", ajax.post("al_photos.php", {
                act: "fast_get_photo",
                oid: e
            }, {
                onDone: function(o) {
                    if (!o) return t.onmouseover = function() {}, void re(s);
                    var n = "show" == cur.bigphCache[e];
                    cur.bigphCache[e] = o, s.href = "/photo" + o._id + "?all=1", n && uiPhotoZoom.click(t, e, i)
                },
                onFail: function() {
                    return t.onmouseover = function() {}, re(domFC(t)), !0
                }
            }))
        }
    };
window.Scrollbar = window.Scrollbar || function() {
    function t(t) {
        if (t || (t = window.event), this.isHorizontal) {
            var e = Math.floor((this.contWidth() - this.scrollWidth) * Math.min(1, (t.screenX - this.moveX) / (this.scrollbarSize - this.innerWidth - 6)));
            isFunction(this.options.onScroll) && this.options.onScroll(this.obj.scrollLeft - e, this), this.obj.scrollLeft = e
        } else {
            var e = Math.floor((this.contHeight() - this.scrollHeight) * Math.min(1, (t.screenY - this.moveY) / (this.scrollbarSize - this.innerHeight - 6)));
            isFunction(this.options.onScroll) && this.options.onScroll(this.obj.scrollTop - e, this), this.obj.scrollTop = e
        }
        return this.update(!0), !1
    }

    function e() {
        return this.moveY = this.moveX = this.isDown = !1, this.isOut && this.contOut(), removeEvent(document, "mousemove", this.mouseMove), removeEvent(document, "mouseup",
            this.mouseUp), setStyle(document.body, "cursor", "default"), setStyle(this.obj, {
            pointerEvents: ""
        }), removeClass(this.inner, "scrollbar_hovered"), isFunction(this.options.stopDrag) && this.options.stopDrag(), isFunction(this.options.onHold) && this.options.onHold(!
            1), !1
    }

    function i(t) {
        return this.moveY || checkEvent(t) ? void 0 : (t || (t = window.event), addEvent(document, "mousemove", this.mouseMove), addEvent(document, "mouseup", this.mouseUp),
            setStyle(document.body, "cursor", "pointer"), setStyle(this.obj, {
                pointerEvents: "none"
            }), this.isHorizontal ? this.moveX = t.screenX - (this.inner.offsetLeft || 0) : this.moveY = t.screenY - (this.inner.offsetTop || 0), addClass(this.inner,
                "scrollbar_hovered"), isFunction(this.options.startDrag) && this.options.startDrag(), isFunction(this.options.onHold) && this.options.onHold(!0), this.isDown = !
            0, cancelEvent(t))
    }

    function s(t) {
        switch (t || (t = window.event), t.keyCode) {
            case 40:
                this.obj[this.scrollProp] += 40;
                break;
            case 38:
                this.obj[this.scrollProp] -= 40;
                break;
            case 34:
                this.obj[this.scrollProp] += this[this.scrollDimensionProp];
                break;
            case 33:
                this.obj[this.scrollProp] -= this[this.scrollDimensionProp];
                break;
            default:
                return !0
        }
        return this.update(!0), cancelEvent(t)
    }

    function o(o, n) {
        this.obj = o = ge(o), this.options = extend({
                nomargin: !1,
                horizontal: !1,
                top: 0,
                bottom: 0,
                padding: 3,
                prefix: "",
                hidden: 0
            }, n || {}), this.isHorizontal = this.options.horizontal, this.scrollProp = this.isHorizontal ? "scrollLeft" : "scrollTop", this.scrollDimensionProp = this.isHorizontal ?
            "scrollWidth" : "scrollHeight", this.topShadow = !1, this.bottomShadow = !1, this[this.scrollProp + "Last"] = this.obj[this.scrollProp], setTimeout(function() {
                setStyle(o, {
                    overflow: "hidden"
                }), this.scrollbar = ce("div", {
                    className: (this.options.prefix ? this.options.prefix + "scrollbar_cont " : "") + "scrollbar_cont" + (this.isHorizontal ?
                        " scrollbar_cont_horiz" : "") + (this.options.hidden ? " scrollbar_hidden" : "")
                }), this.inner = ce("div", {
                    className: (this.options.prefix ? this.options.prefix + "scrollbar_inner " : "") + "scrollbar_inner"
                }), this.scrollbar.appendChild(this.inner);
                var n = this.widthUpdated();
                this.options.shadows && (o.parentNode.insertBefore(this.topShadowDiv = ce("div", {
                        className: (this.options.prefix ? this.options.prefix + "scrollbar_top " : "") + "scrollbar_top"
                    }, {
                        width: n[0]
                    }), o), o.parentNode.insertBefore(this.bottomShadowDiv = ce("div", {
                        className: (this.options.prefix ? this.options.prefix + "scrollbar_bottom " : "") + "scrollbar_bottom"
                    }, {
                        width: n[0]
                    }), o.nextSibling)), o.parentNode.insertBefore(this.scrollbar, o), this.destroyList = [], this.mouseDown = i.bind(this), this.mouseMove = t.bind(this),
                    this.mouseUp = e.bind(this);
                var r = s.bind(this),
                    l = this.wheel.bind(this),
                    a = "onwheel" in ce("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : browser.mozilla ? "MozMousePixelScroll" : "DOMMouseScroll";
                if (addEvent(o, a, l), addEvent(this.scrollbar, a, l), this.options.scrollElements && each(this.options.scrollElements, function(t, e) {
                        addEvent(e, a, l)
                    }), addEvent(this.scrollbar, "mouseover", this.contOver.bind(this)), addEvent(this.scrollbar, "mouseout", this.contOut.bind(this)), addEvent(this.scrollbar,
                        "mousedown", this.contDown.bind(this)), browser.safari_mobile) {
                    var h = function(t) {
                            this.isHorizontal ? cur.touchX = t.touches[0].pageX : cur.touchY = t.touches[0].pageY
                        }.bind(this),
                        c = function(t) {
                            return this.isHorizontal ? (cur.touchDiff = cur.touchX - (cur.touchX = t.touches[0].pageX), o.scrollLeft += cur.touchDiff, o.scrollLeft > 0 &&
                                this.shown !== !1 && this.update(!0)) : (cur.touchDiff = cur.touchY - (cur.touchY = t.touches[0].pageY), o.scrollTop += cur.touchDiff,
                                o.scrollTop > 0 && this.shown !== !1 && this.update(!0)), cancelEvent(t)
                        }.bind(this),
                        u = function() {
                            cur.animateInt = setInterval(function() {
                                cur.touchDiff = .9 * cur.touchDiff, cur.touchDiff < 1 && cur.touchDiff > -1 ? clearInterval(cur.animateInt) : (o[self.scrollProp] +=
                                    cur.touchDiff, this.update(!0))
                            }.bind(this), 0)
                        }.bind(this);
                    addEvent(o, "touchstart", h), addEvent(o, "touchmove", c), addEvent(o, "touchend", u), this.destroyList.push(function() {
                        removeEvent(o, "touchstart", h), removeEvent(o, "touchmove", c), removeEvent(o, "touchend", u)
                    })
                }
                addEvent(this.inner, "mousedown", this.mouseDown), this.options.nokeys ? this.onkeydown = r : addEvent(window, "keydown", r), this.destroyList.push(
                        function() {
                            removeEvent(o, a, l), this.options.scrollElements && each(this.options.scrollElements, function(t, e) {
                                removeEvent(e, a, l)
                            }), removeEvent(this.inner, "mousedown", this.mouseDown), removeEvent(window, "keydown", r)
                        }.bind(this)), this.isHorizontal || (this.contHeight() <= this.scrollHeight ? hide(this.bottomShadowDiv) : this.bottomShadow = !0), this.options.onInit &&
                    this.options.onInit(), this.inited = !0, this.update(!0), this.options.global || cur.destroy.push(this.destroy.bind(this))
            }.bind(this), 0)
    }
    return o.prototype = {
        wheel: function(t) {
            if (!this.disabled) {
                t || (t = window.event);
                var e = 0,
                    i = this.obj[this.scrollProp];
                if (deltaMode = void 0 !== t.deltaMode ? t.deltaMode : "MozMousePixelScroll" == t.type ? 0 : 1, pixelRatio = 1, pixelsPerLine = 15, pixelsPerPage = 30 *
                    pixelsPerLine, "wheel" == t.type ? e = -(this.isHorizontal ? t.deltaX : t.deltaY) : void 0 !== t.wheelDeltaX && void 0 !== t.wheelDeltaY ? (e =
                        .025 * (this.isHorizontal ? t.wheelDeltaX : t.wheelDeltaY), console.log(t.wheelDeltaY, t), browser.mac && browser.opera && (e *= .1)) : void 0 !==
                    t.wheelDelta ? e = .025 * t.wheelDelta : t.detail && t.axis === (this.isHorizontal ? 1 : 2) && (e = -t.detail), e = e * pixelRatio * (1 ==
                        deltaMode ? pixelsPerLine : 2 == deltaMode ? pixelsPerPage : 1)) return this.obj[this.scrollProp] -= e, isFunction(this.options.onScroll) &&
                    this.options.onScroll(e, this), i != this.obj[this.scrollProp] && this.shown !== !1 && (this.update(!0), addClass(this.inner,
                        "scrollbar_hovered"), clearTimeout(this.moveTimeout), this.moveTimeout = setTimeout(function() {
                        removeClass(this.inner, "scrollbar_hovered")
                    }.bind(this), 300)), !this.shown && !this.options.forceCancelEvent || this.isHorizontal && i == this.obj[this.scrollProp] ? void 0 : !1
            }
        },
        setOptions: function(t) {
            extend(this.options, t)
        },
        widthUpdated: function() {
            var t, e = getSize(this.obj);
            return t = this.isHorizontal ? {
                marginLeft: this.options.top + "px",
                marginTop: e[1] + 3 + "px",
                width: e[0] - this.options.top - this.options.bottom + "px"
            } : {
                marginTop: this.options.top + "px",
                marginLeft: this.options.nomargin ? 0 : e[0] - (this.options.mlDiff || 7) + "px",
                height: e[1] - this.options.top - this.options.bottom + "px"
            }, this.options.nomargin && (void 0 !== this.options.right && "auto" !== this.options.right ? (t.right = this.options.right, t.left = "auto") : void 0 !==
                this.options.left && (t.right = "auto", t.left = this.options.left)), this.scrollWidth = e[0], this.scrollHeight = e[1], this.scrollbarSize = e[
                this.isHorizontal ? 0 : 1] - this.options.top - this.options.bottom, setStyle(this.scrollbar, t), setTimeout(function() {
                removeClass(this.scrollbar, "no_transition")
            }.bind(this)), e
        },
        contOver: function() {
            this.isOut = !1, this.shown && addClass(this.scrollbar, "scrollbar_c_overed")
        },
        contOut: function() {
            this.isOut = !0, this.isDown || removeClass(this.scrollbar, "scrollbar_c_overed")
        },
        contDown: function(t) {
            if (t || (t = window.event), this.isHorizontal) {
                var e = t.offsetX - this.innerWidth / 2 + 5,
                    i = this.scrollbarSize - this.innerWidth;
                this.obj.scrollLeft = Math.floor((this.contWidth() - this.scrollWidth) * Math.min(1, e / i))
            } else {
                var e = t.offsetY - this.innerHeight / 2 + 5,
                    i = this.scrollbarSize - this.innerHeight;
                this.obj.scrollTop = Math.floor((this.contHeight() - this.scrollHeight) * Math.min(1, e / i))
            }
            this.update(!0), this.mouseDown(t)
        },
        hide: function(t) {
            hide(this.topShadowDiv, this.bottomShadowDiv, this.scrollbar), this.hidden = !0
        },
        show: function(t) {
            show(this.topShadowDiv, this.bottomShadowDiv, this.scrollbar), this.hidden = !1
        },
        disable: function() {
            this.hide(), this[this.scrollProp](0), this.disabled = !0
        },
        enable: function() {
            this.show(), this.update(), this.disabled = !1
        },
        scrollTop: function(t) {
            this.obj.scrollTop = parseInt(t), this.update(!1, !0)
        },
        scrollBottom: function(t) {
            return "undefined" == typeof t ? this.contHeight() - this.scrollHeight - this.obj.scrollTop : (this.obj.scrollTop = this.contHeight(!0) - this.scrollHeight -
                t, void this.update(!0, !0))
        },
        scrollLeft: function(t) {
            this.obj.scrollLeft = parseInt(t), this.update(!1, !0)
        },
        destroy: function(t) {
            each(this.destroyList || [], function(t, e) {
                e()
            })
        },
        contHeight: function() {
            return Math.round(this.options.contHeight || this.obj.scrollHeight)
        },
        contWidth: function() {
            return Math.round(this.options.contWidth || this.obj.scrollWidth)
        },
        val: function(t) {
            return t && (this.obj[this.scrollProp] = t, this.update(!0, !0)), this.obj[this.scrollProp]
        },
        update: function(t, e) {
            if (this.inited && !this.hidden) {
                if (!t && (this.isHorizontal ? this.moveX : this.moveY)) return !0;
                var i, s, o;
                if (e && (i = getSize(this.obj), this.isHorizontal ? (this.scrollWidth = i[0], i = Math.round(this.scrollWidth - this.options.top - this.options.bottom),
                        this.scrollbarSize !== i && (this.scrollbar.style.width = i + "px")) : (this.scrollHeight = i[1], i = Math.round(this.scrollHeight - this.options
                        .top - this.options.bottom), this.scrollbarSize !== i && (this.scrollbar.style.height = i + "px")), this.scrollbarSize = i), this.isHorizontal ?
                    (i = this.contWidth()) <= Math.round(this.scrollWidth) : (i = this.contHeight()) <= Math.round(this.scrollHeight)) return hide(this.inner, this.bottomShadowDiv,
                    this.topShadowDiv), this.scrollbar.style.pointerEvents = "none", this.topShadow = this.bottomShadow = this.shown = !1, isFunction(this.options
                    .more) && i - this.obj[this.scrollProp] < 2 * this[this.scrollDimensionProp] && this.options.more(this), void(this[this.scrollProp + "Last"] =
                    this.obj[this.scrollProp]);
                this.shown || (show(this.inner), this.scrollbar.style.pointerEvents = "", this.shown = !0);
                var o = this.val();
                isFunction(this.options.scrollChange) && this.options.scrollChange(o), this.lastProgress = Math.min(1, o / (i - (this.isHorizontal ? this.scrollWidth :
                        this.scrollHeight))), this.lastProgress > 0 != this.topShadow && ((this.topShadow = !this.topShadow) ? show : hide)(this.topShadowDiv), this.lastProgress <
                    1 != this.bottomShadow && ((this.bottomShadow = !this.bottomShadow) ? show : hide)(this.bottomShadowDiv), this.isHorizontal ? (s = Math.max(40,
                            Math.floor(this.scrollbarSize * this.scrollWidth / i)), s !== this.innerWidth && (this.inner.style.width = (this.innerWidth = s) + "px"),
                        this.inner.style.marginLeft = (this.scrollbarSize - s - 2 * this.options.padding) * this.lastProgress + this.options.padding + "px") : (s =
                        Math.max(40, Math.floor(this.scrollbarSize * this.scrollHeight / i)), s !== this.innerHeight && (this.inner.style.height = (this.innerHeight =
                            s) + "px"), this.inner.style.marginTop = (this.scrollbarSize - s - 2 * this.options.padding) * this.lastProgress + this.options.padding +
                        "px"), isFunction(this.options.more) && i - this.obj[this.scrollProp] < 2 * this[this.scrollDimensionProp] && this.options.more(this), this[
                        this.scrollProp + "Last"] = this.obj[this.scrollProp]
            }
        },
        restore: function() {
            this.obj[this.scrollProp] = this[this.scrollProp + "Last"]
        }
    }, o
}(), extend(OList.prototype, {
    onScroll: function() {
        var t = domPN(this.box.bodyNode),
            e = this.moreEl,
            i = this.scrollNode,
            s = i.scrollHeight,
            o = i.scrollTop,
            n = i.offsetHeight || i.clientHeight;
        toggleClass(t, "olist_topsh", o > 0), toggleClass(t, "olist_botsh", s > o + n), e && e.offsetTop && e.onclick && o + n + 200 >= s && e.onclick()
    },
    onMouseEvent: function(t) {
        var e = t.originalTarget || t.target;
        if (hasClass(e, "olist_item_wrap") || (e = gpeByClass("olist_item_wrap", e)), e && e != bodyNode) {
            if (hasClass(e, "olist_item_loading")) return cancelEvent(t);
            if (checkEvent(t)) return !0;
            this.box.changed = !0;
            var i = e.id.match(/-?\d+/)[0],
                s = !this.invertedSelection && this.selected[i] || this.invertedSelection && !this.selected[i];
            if (toggleClass(e, "olist_item_wrap_on", !s), this.selected[i] = !s || this.invertedSelection, this.selCnt += !s || this.invertedSelection ? 1 : -1, this.selTabUpdate(),
                this.scrollNode.scrollTop < 50) {
                var o = this.filter;
                setTimeout(elfocus.pbind(o), 100)
            }
            return cancelEvent(t)
        }
    },
    onOlistSelect: function(t, e) {
        uiActionsMenu.toggle(this.olistFilter, !1);
        var i = this.selCnt,
            s = this.selected;
        switch (e.ctrlKey || e.metaKey || e.shiftKey || (s = {}, i = 0), t) {
            case "all":
                s = {}, i = 0, each(this.owners, function() {
                    s[this[0]] = 1, i++
                });
                break;
            case "none":
                s = {}, i = 0;
                break;
            case "people":
                each(this.owners, function() {
                    this[0] > 0 && !s[this[0]] && (s[this[0]] = 1, i++)
                });
                break;
            case "groups":
                each(this.owners, function() {
                    this[0] < 0 && !s[this[0]] && (s[this[0]] = 1, i++)
                });
                break;
            default:
                var o = intval(t.replace("list", "")),
                    n = 1 << o;
                each(this.owners, function() {
                    this[4] & n && !s[this[0]] && (s[this[0]] = 1, i++)
                })
        }
        return this.selCnt = i, this.selected = s, this.selTabUpdate(), this.renderList(), !1
    },
    onOlistFilters: function(t, e) {
        return uiActionsMenu.show(t, e), addEvent(document, "mousedown", function(e) {
            uiActionsMenu.toggle(t, !1), removeEvent(document, "mousedown", arguments.callee)
        }), e && cancelEvent(e)
    },
    selTabUpdate: function() {
        if (this.isAlbumEdit) return void(this.onTabUpdate && this.onTabUpdate());
        if (this.tabs) {
            var t = this.selCnt,
                e = this.owners.length - t,
                i = geByClass1("olist_tab_sel", this.tabs),
                s = geByClass1("olist_tab_unsel", this.tabs);
            val(geByClass1("ui_tab_count", i), t || ""), val(geByClass1("ui_tab_count", s), e || ""), this.onTabUpdate && this.onTabUpdate()
        }
    },
    renderList: function(t, e, i) {
        e = e || 0, i = i || this.sel;
        var s, o, n, r = e ? 60 : 120,
            l = this;
        t && (t = t.replace(/\u2013|\u2014/g, "-")), s = t ? this.indexer.search(t) : this.owners, l.unsortedIndex == i && l.getUnsorted && (s = l.getUnsorted(s)), o =
            this.selected;
        var a = l.invertedSelection ? !(this.sel < 0) : this.sel < 0;
        if (n = l.tpl, i && l.unsortedIndex != i) {
            var h = [];
            each(s, function() {
                var t = this[l.idIndex];
                return (!a && o[t] || a && !o[t]) && (h.push(this), h.length > e + r) ? !1 : void 0
            }), s = h
        }
        var c = s.length;
        s = s.slice(e, e + r);
        var u = [];
        if (t) {
            t = clean(t);
            var d = escapeRE(t),
                p = parseLatin(t);
            null != p && (d = d + "|" + escapeRE(p));
            var v = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + d + "))(?![^<>]*>)(?![^&;]+;)", "gi")
        }
        var g = l.rsTpl ? l.rsTpl : function(t, e, i, s, o) {
            var n = !i && s[t[0]] || i && !s[t[0]],
                r = t[1];
            if (e) {
                r = -1 == e.indexOf(" ") ? r.split(" ") : [r];
                var l = "";
                for (var a in r) l += (a > 0 ? " " : "") + r[a].replace(o, "$2<em>$3</em>");
                r = l
            }
            return {
                id: t[0],
                name: r,
                photo: t[2],
                classname: n ? " olist_item_wrap_on" : "",
                link: t[3] || (t[0] > 0 ? "id" + t[0] : "club" + -t[0])
            }
        };
        each(s, function() {
                u.push(rs(n, g(this, t, l.invertedSelection, o, v)))
            }), e || u.length || u.push('<div class="no_rows">' + (t ? getLang("global_search_not_found")
                .replace("{search}", t) : l.noSelMsg) + "</div>"), re(this.moreEl), u = u.join(" "), e ? this.olistEl.appendChild(cf(u)) : val(this.olistEl, u), c > e +
            r && (this.olistEl.appendChild(this.moreEl), this.moreEl.onclick = function(i) {
                return l.renderList(t, e + r), cancelEvent(i)
            }), l.box && l.box.scroll && l.box.scroll.update(!1, !0), l.onScroll()
    }
});
var uiBox = {
    addShadows: function(t) {
        setTimeout(function() {
            var e = domFC(t.bodyNode),
                i = function() {
                    toggleClass(domPN(t.bodyNode), "box_topsh", e.scrollTop > 0), toggleClass(domPN(t.bodyNode), "box_botsh", e.scrollTop + (e.offsetHeight || e.clientHeight) <
                        e.scrollHeight)
                };
            addEvent(e, "scroll", i), setTimeout(i, 10)
        }, 10)
    }
};
try {
    stManager.done("ui_common.js")
} catch (e) {}
