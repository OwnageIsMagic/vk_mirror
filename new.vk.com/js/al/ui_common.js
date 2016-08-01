function OList(t, i, e, s) {
    0 === e.length && (e = {}), s = s || {}, this.indexer = new vkIndexer(i, s.getName ? s.getName : function(t) {
            return t[1]
        }), this.owners = i, this.tpl = s.tpl, this.rsTpl = s.rsTpl, this.idIndex = s.idIndex || 0, this.selected = e, this.getUnsorted = s.getUnsorted, this.unsortedIndex = s.unsortedIndex ||
        0, this.box = t, this.filter = s.filter, s.onTabUpdate && (this.onTabUpdate = s.onTabUpdate), s.onListClick && (this.onListClick = s.onListClick), t.setButtons(getLang(
            "global_save"), function(e) {
            var n = {},
                l = [],
                r = [];
            each(i, function() {
                !o.invertedSelection && o.selected[this[o.idIndex]] || o.invertedSelection && !o.selected[this[o.idIndex]] ? (n[this[o.idIndex]] = this, l.push(this[o.idIndex])) :
                    r.push(this[o.idIndex])
            }), cur.onOListSave(l, r, n, s.ret || {}, e) !== !1 && t.hide(200)
        }, getLang("global_cancel")), s.box_options && t.setOptions(s.box_options);
    var o = this;
    this.scrollNode = geByClass1("privacy_olist", t.bodyNode), this.moreEl = geByClass1("olist_more", t.bodyNode, "a"), this.olistEl = geByClass1("olist", t.bodyNode, "div"), this
        .olistFilter = ge("olist_filter_actions"), this.sel = s.sel || 0, this.tabs = geByClass1("ui_tabs", t.bodyNode), this.noSelMsg = s.noSelMsg || getLang(
            "friends_no_user_selected"), this.invertedSelection = !1;
    var n = geByClass1("olist_tab_sel", this.tabs);
    this.selCnt = intval(val(geByClass1("ui_tab_count", n)));
    var l = this.filter ? this.filter : this.filter = ge("olist_filter");
    setTimeout(elfocus.pbind(l), 100), this.moreEl && (isVisible(this.moreEl) ? this.moreEl.onclick = function(t) {
        return o.renderList("", 60), cancelEvent(t)
    } : (re(this.moreEl), show(this.moreEl))), addEvent(this.olistEl, "click", this.onMouseEvent.bind(this)), addEvent(this.scrollNode, "scroll", this.onScroll.bind(this));
    var r = o.sel ? o.sel > 0 ? "sel" : "unsel" : "all",
        a = geByClass1("olist_tab_" + r, o.tabs);
    a = a && geByClass1("ui_tab", a), (cur.onOListTabChange = function(t, i) {
        t && uiTabs.switchTab(t), void 0 === i && (i = void 0 === o.selPrev ? 0 : o.selPrev), o.selPrev = o.sel, o.sel = i, o.renderList(val(l), 0, i), setTimeout(elfocus.pbind(
            l), 100)
    })(a, o.sel), cur.onOlistChange = o.renderList.bind(this), cur.onOlistSelect = o.onOlistSelect.bind(this), cur.onOlistFilters = o.onOlistFilters.bind(this)
}

function Slider(t, i) {
    if (this.constructor != Slider) throw new Error("Slider was called without 'new' operator");
    if (!t) throw new Error("No element was provided for Slider");
    t = ge(t), this.options = i || {
        size: 1
    }, this.options.backValue = this.options.backValue || 0;
    var e = 100 * this.options.backValue,
        s = this.options.withBackLine ? '<div class="slider_back" style="width:' + e + '%"></div>' : "",
        o = '<div class="slider_slide"><div class="slider_loading_bar" style="opacity: 0; display: none;"></div> ' + s +
        ' <div class="slider_amount"></div> <div class="slider_handler"></div> </div>';
    this._el = ce("div", {
        innerHTML: o,
        className: "slider",
        id: t.getAttribute("id") || ""
    });
    for (var n = t.classList, l = this, r = 0, a = n.length; a > r; r++) addClass(this._el, n[r]);
    each(this._el.attributes, function(t, i) {
            ("id" != i.name || "class" != i.name) && l._el.setAttribute(i.name, i.value)
        }), t.parentNode.replaceChild(this._el, t), data(this._el, "slider", this), this._amountEl = geByClass1("slider_amount", this._el), this._handlerEl = geByClass1(
            "slider_handler", this._el), this._slideEl = geByClass1("slider_slide", this._el), this._backEl = geByClass1("slider_back", this._el), this._progressEl = geByClass1(
            "slider_loading_bar", this._el), this.options.color && (setStyle(this._amountEl, {
            backgroundColor: this.options.color
        }), setStyle(this._handlerEl, {
            backgroundColor: this.options.color
        })), this.options.backColor && setStyle(this._slideEl, {
            backgroundColor: this.options.backColor
        }), addClass(this._el, "slider_size_" + this.options.size), this.options.debounce && (this._onValueChangeDebounced = debounce(this._onValueChange, this.options.debounce)),
        i.formatHint && (addEvent(this._el, "mousemove", this._ev_onMouseOver = this._onMouseOver.bind(this)), addEvent(this._el, "mouseleave", this._ev_onMouseLeave = this._onMouseLeave
            .bind(this))), addEvent(this._el, "mousedown", this._ev_onMouseDown = this._onMouseDown.bind(this)), this.setValue(this.options.value || 0, this.options.fireChangeEventOnInit ?
            !1 : !0, !1), this.setBackValue(this.options.backValue)
}
var uiTabs = {
        initTabs: function(t, i) {
            if (!(browser.msie && intval(browser.version) < 10 || browser.opera && intval(browser.version) < 15 || hasClass(t, "ui_tabs_sliding"))) {
                var e = getSize(i)[0],
                    s = i.offsetLeft,
                    o = geByClass1("_ui_tabs_slider", t);
                if (!domData(t, "inited")) {
                    var n = {
                        width: e + "px",
                        marginLeft: s
                    };
                    setStyle(o, n)
                }
            }
        },
        tryInit: function(t) {
            if (!domData(t, "inited")) {
                var i = geByClass1("ui_tab_group_sel", t) || geByClass1("ui_tab_sel", t);
                i && uiTabs.initTabs(t, i), domData(t, "inited", 1)
            }
        },
        goTab: function(t, i, e) {
            if (checkEvent(i)) return !0;
            var s = gpeByClass("ui_tabs", t);
            return e || geByClass1("ui_tab_sel", s) != t ? (uiTabs.switchTab(t), uiTabs.showProgress(s), nav.go(t, i)) : !1
        },
        switchTab: function(t, i) {
            var e = gpeByClass("ui_tabs", t),
                s = geByClass1("ui_tab_sel", e),
                o = null,
                n = null,
                l = hasClass(s, "ui_tab_group_item") ? n = gpeByClass("ui_tab_group", s) : s,
                r = hasClass(t, "ui_tab_group_item") ? o = gpeByClass("ui_tab_group", t) : t;
            if (t != s) {
                if (t != r && (uiTabs.toggleGroup(r, !1), uiTabs.resetLabel(r, t)), l) {
                    uiTabs.initTabs(e, l), i = i || {}, i.noAnim || r === l || (addClass(e, "ui_tabs_sliding"), clearTimeout(cur.tabSlidingTO), cur.tabSlidingTO = setTimeout(
                        removeClass.pbind(e, "ui_tabs_sliding"), 300));
                    var a = geByClass1("_ui_tabs_slider", e),
                        h = intval(a.style.marginLeft),
                        d = {
                            width: getSize(r)[0] + "px"
                        };
                    d[cssTransformProp] = "translateX(" + (r.offsetLeft - h) + "px)", setStyle(a, d), s != l && r != l && uiTabs.resetLabel(l), l != s && removeClass(l,
                        "ui_tab_group_sel"), removeClass(s, "ui_tab_sel")
                }
                if (r != t && addClass(r, "ui_tab_group_sel"), addClass(t, "ui_tab_sel"), n && removeClass(n, "ui_tab_hide_separator"), o) {
                    e = geByClass1("ui_tab_group_items", o, "div")
                        .children;
                    var c = null;
                    each(e, function(t, i) {
                        "SPAN" === i.tagName ? c = i : hasClass(domFC(i), "ui_tab_sel") || (c = null)
                    }), c && addClass(o, "ui_tab_hide_separator")
                }
            }
            return !1
        },
        resetLabel: function(t, i) {
            var e = geByClass1("ui_tab_group_label", t, "span");
            e && (e.innerHTML = (i || e)
                .getAttribute("data-default-label"))
        },
        toggleGroup: function(t, i) {
            var e = data(t, "visibletimer");
            e && clearTimeout(e), data(t, "visibletimer", setTimeout(toggleClass.pbind(t, "visible", i), i ? 0 : 100)), toggleClass(t, "shown", i)
        },
        showGroup: function(t) {
            var i = data(t, "hidetimer");
            i && (clearTimeout(i), data(t, "hidetimer", 0)), uiTabs.toggleGroup(t, !0)
        },
        hideGroup: function(t) {
            var i = data(t, "hidetimer");
            i || data(t, "hidetimer", setTimeout(function() {
                uiTabs.toggleGroup(t, !1), data(t, "hidetimer", 0)
            }, 200))
        },
        showProgress: function(t) {
            hasClass(t, "ui_tabs") || (t = gpeByClass("ui_tabs", t)), addClass(t, "ui_tabs_loading")
        },
        hideProgress: function(t) {
            hasClass(t, "ui_tabs") || (t = gpeByClass("ui_tabs", t)), removeClass(t, "ui_tabs_loading")
        },
        showSearch: function(t, i) {
            if (checkEvent(i)) return !0;
            var e = gpeByClass("ui_tabs", t),
                s = (domByClass(e, "ui_search"), domByClass(e, "_field"));
            return addClass(e, "ui_tabs_search_opened"), uiSearch.focus(s), !1
        },
        hideSearch: function(t, i) {
            if (checkEvent(i)) return !0;
            var e = gpeByClass("ui_tabs", t);
            return removeClass(e, "ui_tabs_search_opened"), !1
        }
    },
    uiActionsMenu = {
        keyToggle: function(t, i) {
            if (!checkKeyboardEvent(i)) return !1;
            var e = domClosest("_ui_menu_wrap", t);
            e && uiActionsMenu.toggle(e, !hasClass(e, "shown"))
        },
        toggle: function(t, i) {
            var e = data(t, "dummyMenu");
            e && (t = e), toggleClass(t, "shown", i)
        },
        show: function(t, i, e) {
            var s = data(t, "hidetimer");
            s && (clearTimeout(s), data(t, "hidetimer", 0));
            var o = data(t, "origMenu");
            if (o && (s = data(o, "hidetimer")) && (clearTimeout(s), data(t, "hidetimer", 0)), e && e.appendParentCls) {
                var n = geByClass1("_ui_menu", t),
                    l = domClosest("_ui_menu_wrap", t);
                if (n) {
                    var r = domClosest(e.appendParentCls, n),
                        a = getXY(r),
                        h = getXY(l),
                        d = se('<div class="' + l.className +
                            ' ui_actions_menu_dummy_wrap" onmouseover="uiActionsMenu.show(this);" onmouseout="uiActionsMenu.hide(this);"></div>');
                    d.appendChild(n), r.appendChild(d), data(t, "dummyMenu", d), data(d, "origMenu", t), t = d;
                    var c = intval(getStyle(n, "top")),
                        u = intval(getStyle(n, "left")),
                        p = intval(getStyle(n, "right")),
                        v = {
                            top: h[1] - a[1] + c
                        };
                    if (p ? v.right = getSize(r)[0] + a[0] - h[0] - getSize(l)[0] + p : v.left = h[0] - a[0] + u, setStyle(n, v), e.processHoverCls) {
                        var g = domClosest(e.processHoverCls, l);
                        addEvent(t, "mouseover", addClass.pbind(g, "hover")), addEvent(t, "mouseout", removeClass.pbind(g, "hover"))
                    }
                }
            }
            uiActionsMenu.toggle(t, !0)
        },
        hide: function(t, i) {
            var e = data(t, "hidetimer");
            e || data(t, "hidetimer", setTimeout(function() {
                uiActionsMenu.toggle(t, !1), data(t, "hidetimer", 0)
            }, 200))
        }
    },
    uiRightMenu = {
        initMenu: function(t, i) {
            if (!(browser.msie && intval(browser.version) < 10 || browser.opera && intval(browser.version) < 15 || hasClass(t, "ui_rmenu_sliding"))) {
                var e = geByClass1("ui_rmenu_item", t),
                    s = geByClass1("ui_rmenu_item_sel", t),
                    o = s || e,
                    n = getSize(o)[1],
                    l = o.offsetTop,
                    r = geByClass1("_ui_rmenu_slider", t);
                if (!i) {
                    var a = {
                        height: n,
                        top: s ? l : 0
                    };
                    setStyle(r, a), addClass(t, "ui_rmenu_sliding")
                }
            }
        },
        go: function(t, i, e, s) {
            if (checkEvent(i)) return !0;
            var o = gpeByClass("ui_rmenu", t);
            return geByClass1("ui_rmenu_item_sel", o) == t ? !1 : (uiRightMenu.switchMenu(t), uiRightMenu.showProgress(t), e === !1 ? !1 : nav.go(e || t, i, extend({
                fromMenu: !0
            }, s || {})))
        },
        switchMenu: function(t, i) {
            var e = gpeByClass("ui_rmenu", t),
                s = geByClass1("ui_rmenu_item_sel", e);
            if (t == s && !i) return !1;
            var o = hasClass(t, "_audio_album_item");
            uiRightMenu.initMenu(e, o);
            var n = getSize(t)[1],
                l = t.offsetTop,
                r = [],
                a = [],
                h = domPN(t);
            if (o && (l += getXY(h)[1] - getXY(e)[1]), hasClass(e, "_ui_rmenu_auto_expand")) {
                var d = geByClass("_ui_rmenu_sublist", e),
                    c = hasClass(t, "_ui_rmenu_subitem") ? gpeByClass("_ui_rmenu_sublist", t) : hasClass(domNS(t), "_ui_rmenu_sublist") ? domNS(t) : !1;
                each(d, function() {
                    isVisible(this) && this !== c && (r.push(this), hide(this))
                }), c && !isVisible(c) && (a.push(c), show(c)), l = t.offsetTop, each(r, function() {
                    show(this)
                }), each(a, function() {
                    hide(this)
                })
            }
            var u = geByClass1("_ui_rmenu_slider", e),
                p = intval(u.style.top),
                v = {
                    height: n
                };
            return browser.msie_edge ? v.marginTop = l - p + "px" : v[cssTransformProp] = "translateY(" + (l - p) + "px)", setStyle(u, v), removeClass(s, "ui_rmenu_item_sel"),
                addClass(t, "ui_rmenu_item_sel"), hasClass(e, "_ui_rmenu_auto_expand") ? each(r.concat(a), function() {
                    uiRightMenu.toggleSubmenu(this)
                }) : hasClass(t, "_ui_rmenu_subitem") && !isVisible(domPN(t)) && uiRightMenu.toggleSubmenu(domPN(t)), !1
        },
        unselectAll: function(t) {
            removeClass(t, "ui_rmenu_sliding"), removeClass(geByClass1("ui_rmenu_item_sel", t), "ui_rmenu_item_sel")
        },
        hideSliding: function(t) {
            removeClass(t, "ui_rmenu_sliding")
        },
        showSliding: function(t) {
            addClass(t, "ui_rmenu_sliding")
        },
        showProgress: function(t) {
            hasClass(t, "ui_rmenu") || (t = gpeByClass("ui_rmenu", t));
            var i = geByClass1("ui_rmenu_item_sel", t);
            hideProgress(t), showProgress(domFC(i), "", "", !0), addClass(t, "ui_rmenu_loading")
        },
        hideProgress: function(t) {
            hasClass(t, "ui_rmenu") || (t = gpeByClass("ui_rmenu", t)), hideProgress(t);
            var i = gpeByClass("ui_rmenu", t);
            removeClass(t, "ui_rmenu_loading"), uiRightMenu.hideSliding(i)
        },
        toggleSubmenu: function(name, ref) {
            var menu = gpeByClass("ui_rmenu", ref),
                el, submenu;
            if ("string" == typeof name ? submenu = geByClass1("_ui_rmenu_" + name + "_list", menu) : (submenu = name, name = submenu.getAttribute("data-sublist-id")), el =
                geByClass1("_ui_rmenu_" + name + "_toggle", menu), !submenu) return !1;
            void 0 !== ref && uiRightMenu.hideSliding(menu), el && toggleClass(el, "ui_rmenu_item_expanded", !isVisible(submenu)), slideToggle(submenu, submenu && getSize(
                submenu)[1] ? 100 : 0), setTimeout(updateNarrow, 100);
            var onToggle = domData(el, "on-toggle");
            return onToggle && setTimeout(function() {
                eval(onToggle)
            }, 150), !1
        }
    },
    uiPageBlock = {
        showSaved: function(t) {
            var i = ge(t),
                e = i && gpeByClass("page_block", i),
                s = e && geByClass1("page_block_saved", e);
            if (i && e && s) {
                var o = animate.pbind(s, {
                    opacity: 1
                }, 200, animate.pbind(s, {
                    opacity: 0
                }, 2e3));
                uiPageBlock.scrollToStart(e, o)
            }
        },
        scrollToStart: function(t, i) {
            var e = getXY(t)[1],
                s = 60,
                o = 200;
            scrollGetY() > e - s ? (scrollToY(e - s, o), i && setTimeout(i, o)) : i && i()
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
            var i = data(t, "eventHandlers") || [];
            each(i, function(t, i) {
                i.stop()
            })
        },
        startEvents: function(t) {
            var i = data(t, "eventHandlers") || [];
            each(i, function(t, i) {
                i.stop(), i.start()
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
        onKeyDown: function(t, i) {
            if (cur.preventInputActions && -1 != [KEY.RETURN, KEY.ESC, KEY.DOWN, KEY.UP].indexOf(i.keyCode)) return cancelEvent(i);
            if (i.keyCode == KEY.RETURN) {
                t = uiSearch.getFieldEl(t);
                var e = data(t, "opts"),
                    s = t.getValue();
                return e.onEnter && e.onEnter(t, s, i), cancelEvent(i)
            }
            if (i.keyCode == KEY.ESC) {
                var o = !!val(t);
                return uiSearch.reset(t, !1, i), o ? cancelEvent(i) : !0
            }
            setTimeout.pbind(uiSearch.onChanged.pbind(t, !1, i), 0)
        },
        onBlurred: function(t, i) {
            var e = data(t, "opts");
            e.onBlur && e.onBlur.call(t, i)
        },
        onChanged: function(t, i, e) {
            t = uiSearch.getFieldEl(t);
            var s = data(t, "opts"),
                o = uiSearch.getWrapEl(t),
                n = t.getValue();
            toggleClass(o, "ui_search_field_empty", !n), i || s.onChange && s.onChange.call(t, n, e)
        },
        focus: function(t) {
            t = uiSearch.getFieldEl(t), elfocus(t)
        },
        reset: function(t, i, e) {
            t = uiSearch.getFieldEl(t);
            var s = data(t, "opts"),
                o = uiSearch.getWrapEl(t),
                n = t.getValue();
            n ? (t.setValue(""), uiSearch.onChanged(t, i, e), i || s.onEnter && s.onEnter(t, ""), elfocus(t)) : s.in_tabs && uiTabs.hideSearch(o)
        },
        showProgress: function(t) {
            t = uiSearch.getFieldEl(t);
            var i = uiSearch.getWrapEl(t);
            addClass(i, "ui_search_loading")
        },
        hideProgress: function(t) {
            t = uiSearch.getFieldEl(t);
            var i = uiSearch.getWrapEl(t);
            removeClass(i, "ui_search_loading")
        },
        scrollResize: function(t) {
            if (!browser.mobile) {
                t = uiSearch.getFieldEl(t);
                var i, e = uiSearch.getWrapEl(t),
                    s = e && domPN(e),
                    o = e && hasClass(e, "ui_search_fixed"),
                    n = cur.uiSearchPageBlock || gpeByClass("page_block", t),
                    l = getSize(ge("page_header"))[1] || 0,
                    r = e && isAncestor(e, boxLayerWrap);
                if (e && s && (r || gpeByClass("scroll_fix", e)) && (!t.ignoreFixed || o) && isVisible(s)) {
                    var a = r ? getXY(s, !0)[1] < 0 : getXY(s, !0)[1] < ge("page_header_cont")
                        .offsetHeight;
                    if (a) {
                        var h = intval(getStyle(t, "width"));
                        !o && h && (setStyle(s, "height", getSize(e)[1]), setStyle(e, "width", h), addClass(e, "ui_search_fixed"));
                        var d = Math.min(0, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(ge("page_layout"))[0]));
                        if (setStyle(e, {
                                marginLeft: d
                            }), n) {
                            var c = getXY(n)[1] + getSize(n)[1] - scrollGetY() - t.offsetHeight;
                            i = Math.min(l, Math.max(-t.offsetHeight, c)), i != cur.lastUISearchPos && (setStyle(e, "top", i), cur.lastUISearchPos = i)
                        }
                    } else o && (setStyle(s, "height", ""), setStyle(e, {
                        top: "",
                        marginLeft: ""
                    }), cur.lastUISearchPos = !1, removeClass(e, "ui_search_fixed"))
                }
            }
        },
        initFilters: function(t, i) {
            function e(t, i) {
                toggleClass(t, "shown", i)
            }
            var s = uiSearch.getWrapEl(t),
                o = geByClass1("ui_search_fltr_control", s),
                n = {
                    start: function() {
                        addEvent(o, "click", function(t) {
                            (!hasClass(o, "shown") || hasClass(t.target, "ui_search_fltr_control")) && e(o)
                        }), addEvent(o, "mouseover", function() {
                            if (hasClass(o, "shown")) {
                                var t = data(o, "hidetimer");
                                t && (clearTimeout(t), data(o, "hidetimer", 0)), e(o, !0)
                            }
                        }), addEvent(o, "mouseout", function() {
                            var t = data(o, "hidetimer");
                            t || data(o, "hidetimer", setTimeout(function() {
                                e(o, !1), data(o, "hidetimer", 0)
                            }, 200))
                        })
                    },
                    stop: removeEvent.pbind(o, "click mouseover mouseout")
                };
            data(t, "eventHandlers", (data(t, "eventHandlers") || [])
                .concat([n])), n.start();
            var l = uiSearch._getTokensPane(t);
            addEvent(l, "click", function(i) {
                if (hasClass(i.target, "token_title") || hasClass(i.target, "token_del")) {
                    var e = gpeByClass("token", i.target),
                        s = e.getAttribute("data-id");
                    uiSearch.removeFilter(t, s)
                }
            })
        },
        removeAllFilters: function(t) {
            var i = uiSearch._getTokensPane(t),
                e = data(i, "cur_filters");
            each(extend({}, e), function(i) {
                uiSearch.removeFilter(t, i)
            })
        },
        toggleFilter: function(t, i, e, s) {
            s ? uiSearch.addFilter(t, i, e) : uiSearch.removeFilter(t, i)
        },
        addFilter: function(t, i, e) {
            if (i && e) {
                var s = uiSearch._getTokensPane(t),
                    o = data(s, "cur_filters") || {};
                o[i] = e, data(s, "cur_filters", o), uiSearch._renderFilters(s, o)
            }
        },
        removeFilter: function(t, i) {
            var e = uiSearch._getTokensPane(t),
                s = data(e, "cur_filters") || {},
                o = !!s[i];
            delete s[i], data(e, "cur_filters", s);
            var n = data(t, "rto");
            if (clearTimeout(n), n = setTimeout(function() {
                    uiSearch._renderFilters(e, s)
                }, 1), data(t, "rto", n), o) {
                var l = uiSearch.getFieldEl(t),
                    r = data(l, "opts");
                r.onFilterRemoved && r.onFilterRemoved(i, l)
            }
        },
        _getTokensPane: function(t) {
            var i = uiSearch.getWrapEl(t) || t;
            return geByClass1("ui_search_filters_pane", i)
        },
        _renderFilters: function(t, i) {
            var e = (isEmpty(i), geByClass1("ui_search_filters", t));
            if (isEmpty(i)) removeClass(t, "expanded"), setTimeout(function() {
                e.innerHTML = "", hide(t)
            }, 200);
            else {
                show(t), setTimeout(function() {
                    addClass(t, "expanded")
                });
                var s = [],
                    o = {},
                    n = 0;
                each(i, function(t, i) {
                    var e = !1,
                        l = !1,
                        r = t.match(/(.*?)_([^_]+)$/),
                        a = r && r[2] || !1;
                    r = r && r[1] || !1, r && (void 0 !== o[r] && "from" === a ? l = o[r] : void 0 !== o[r] && (e = o[r] + 1), o[r] = n);
                    var h = '<div class="token" id="token' + t + '" data-id="' + t + '"><div class="token_title">' + clean(i) +
                        '</div><div class="token_del"></div></div>';
                    l !== !1 ? s.splice(l, 0, h) : e !== !1 ? s.splice(e, 0, h) : s.push(h), n++
                }), e.innerHTML = s.join("")
            }
        }
    },
    uiScrollBox = {
        init: function(t, i) {
            cur.lSTL && re(cur.lSTL), i = i || {};
            var e = i.parent = i.parent || boxLayerWrap;
            extend(cur, {
                lSTLWrap: e,
                lSTL: e.appendChild(ce("div", {
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
                lSTLOpts: i
            }), t && t.setOptions({
                onShow: uiScrollBox.show,
                onHide: uiScrollBox.hide
            }), t && t.scrollInited || (addEvent(e, "scroll", uiScrollBox.onScroll), t.scrollInited = !0), onBodyResize(), uiScrollBox.onScroll()
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
                var i = cur.lSTLWrap;
                if (!__afterFocus) {
                    var e = 0,
                        s = i.scrollTop;
                    cur.lSTLWasSet && cur.lSTLWas ? (e = cur.lSTLWas, cur.lSTLWas = 0) : cur.lSTLWas = s, i.scrollTop = e
                }
                return cancelEvent(t)
            }
        },
        onScroll: function() {
            if (cur.lSTL) {
                var t = cur.lSTLWrap,
                    i = t.scrollTop,
                    e = 200,
                    s = cur.lSTLWas || i > e,
                    o = 0;
                cur.lSTL.style.marginTop = Math.min(i, boxLayer.scrollHeight - cur.lSTL.scrollHeight - 1) + "px", s ? (1 !== cur.lSTLShown && (show(cur.lSTL), cur.lSTLShown =
                    1), cur.lSTLWas && i > 500 && (cur.lSTLWas = 0), i > e ? (o = (i - e) / e, cur.lSTLWasSet && (cur.lSTLWasSet = 0, val(domLC(cur.lSTL), getLang(
                    "global_to_top")), removeClass(domLC(cur.lSTL), "down"))) : (o = (e - i) / e, cur.lSTLWas && (cur.lSTLWasSet || (cur.lSTLWasSet = 1, val(domLC(cur.lSTL),
                    ""), addClass(domLC(cur.lSTL), "down"))))) : 0 !== cur.lSTLShown && (hide(cur.lSTL), cur.lSTLShown = 0), setStyle(cur.lSTL, {
                    opacity: Math.min(Math.max(o, 0), 1)
                })
            }
        }
    },
    uiPhotoZoom = {
        over: function(t, i, e) {
            if (!browser.mobile) {
                hasClass(t, "ui_zoom_wrap") || addClass(t, "ui_zoom_wrap"), cur.bigphCache = cur.bigphCache || {}, e = e || {};
                var s = domFC(t),
                    o = cur.bigphCache[i];
                "A" == s.tagName && hasClass(s, "ui_zoom_outer") || (s = t.insertBefore(se('<a class="ui_zoom_outer" href="' + (o && o._id ? "/photo" + o._id + "?all=1" :
                            "/albums" + i) + '" aria-label="' + clean(getLang("global_photo_full_size")) +
                        '"><div class="ui_zoom_inner"><div class="ui_zoom"><div class="ui_zoom_icon"></div></div></div></a>'), domFC(t)), s._uid = i, s.offsetHeight,
                    addClass(s, "ui_zoom_added")), s.onclick = uiPhotoZoom.click.pbind(t, i, e), e.fastLoad && uiPhotoZoom.load(t, i, e)
            }
        },
        click: function(t, i, e, s) {
            if (!s || checkEvent(s) === !1) {
                e.fastLoad || uiPhotoZoom.load(t, i, e);
                var o = cur.bigphCache[i];
                if (o) return "load" == o || "show" == o ? (cur.bigphCache[i] = "show", cancelEvent(s)) : (e.onBeforeShow && e.onBeforeShow(), extend(o, extend({
                    jumpTo: {
                        z: "albums" + i
                    }
                }, e.showOpts || {})), showPhoto(o._id, "album" + i + "_0/rev", o, s))
            }
        },
        load: function(t, i, e) {
            var s = domFC(t),
                o = cur.bigphCache[i];
            void 0 === o && (cur.bigphCache[i] = "load", ajax.post("al_photos.php", {
                act: "fast_get_photo",
                oid: i
            }, {
                onDone: function(o) {
                    if (!o) return t.onmouseover = function() {}, void re(s);
                    var n = "show" == cur.bigphCache[i];
                    cur.bigphCache[i] = o, s.href = "/photo" + o._id + "?all=1", n && uiPhotoZoom.click(t, i, e)
                },
                onFail: function() {
                    return t.onmouseover = function() {}, re(domFC(t)), !0
                }
            }))
        }
    },
    uiScroll = function() {
        var t = function(t, i) {
            if (!(t = this.ge(t))) throw new Error("uiScroll container is undefined");
            t.__uiScroll__ && t.__uiScroll__.destroy(), this.options = extend({
                    global: !1,
                    "native": !1,
                    theme: "default",
                    reversed: !1,
                    autoresize: !0,
                    preserveEdgeBelow: !1,
                    barMinHeight: 30,
                    preserveEdgeBelowThreshold: 20,
                    stopScrollPropagation: !0,
                    minContentHeight: 0,
                    onmoreThreshold: null,
                    hidden: !1,
                    shadows: !1,
                    scrollElements: [],
                    onresize: null,
                    onscroll: null,
                    onscrollstart: null,
                    onscrollstop: null,
                    ondrag: null,
                    ondragstart: null,
                    ondragstop: null,
                    onupdate: null,
                    onmore: null
                }, i), this.options["native"] && (this.options.shadows = !1), browser.mobile && (this.options.stopScrollPropagation = !1), isArray(this.options.scrollElements) ||
                (this.options.scrollElements = []), this.removeEvents = [], this.removeElements = [], this.dragging = !1, this.released = !0, this.noMore = !1, this.dragY =
                null, this.dragScroll = null, this.shadowTop = !1, this.shadowBottom = !1, this.unnecessary = !1, this.disabled = !1, this.stopped = !0, this.stoppedTimeout =
                null, this.fixSizeDefault = null, this.animation = null, this.blockerScrollTop = 500, this.emitter = new EventEmitter, isFunction(this.options.onresize) &&
                this.emitter.addListener("resize", this.options.onresize), isFunction(this.options.onscroll) && this.emitter.addListener("scroll", this.options.onscroll),
                isFunction(this.options.onscrollstart) && this.emitter.addListener("scrollstart", this.options.onscrollstart), isFunction(this.options.onscrollstop) && this.emitter
                .addListener("scrollstop", this.options.onscrollstop), isFunction(this.options.ondrag) && this.emitter.addListener("drag", this.options.ondrag), isFunction(
                    this.options.ondragstart) && this.emitter.addListener("dragstart", this.options.ondragstart), isFunction(this.options.ondragstop) && this.emitter.addListener(
                    "dragstop", this.options.ondragstop), isFunction(this.options.onupdate) && this.emitter.addListener("update", this.options.onupdate), isFunction(this.options
                    .onmore) && this.emitter.addListener("more", this.options.onmore), this.el = {
                    container: t,
                    overflow: ce("div", {
                        className: "ui_scroll_overflow"
                    }),
                    outer: ce("div", {
                        className: "ui_scroll_outer"
                    }, {
                        margin: this.options.stopScrollPropagation ? this.blockerScrollTop + "px 0" : void 0
                    }),
                    inner: ce("div", {
                        className: "ui_scroll_inner"
                    }),
                    shadowTop: ce("div", {
                        className: "ui_scroll_shadow_top"
                    }),
                    shadowBottom: ce("div", {
                        className: "ui_scroll_shadow_bottom"
                    }),
                    content: ce("div", {
                        className: "ui_scroll_content"
                    }),
                    barContainer: ce("div", {
                        className: "ui_scroll_bar_container"
                    }),
                    barOuter: ce("div", {
                        className: "ui_scroll_bar_outer"
                    }),
                    barInner: ce("div", {
                        className: "ui_scroll_bar_inner"
                    })
                };
            var e = cf(),
                s = ["ui_scroll_container"];
            for (each(isArray(this.options.theme) ? this.options.theme : trim(this.options.theme + "")
                    .split(/\s+/),
                    function(t, i) {
                        i && s.push("ui_scroll_" + i + "_theme")
                    }), addClass(this.el.container, s.join(" ")), this.options.hidden && addClass(this.el.container, "ui_scroll_hidden"); this.el.container.firstChild;) this.el
                .content.appendChild(this.el.container.firstChild);
            if (this.el.outer.appendChild(this.el.inner), this.el.inner.appendChild(this.el.content), this.options.stopScrollPropagation ? (this.el.blocker = ce("div", {
                    className: "ui_scroll_blocker"
                }), this.addEvent(this.el.blocker, "scroll", this.fixBlocker.bind(this)), this.el.blocker.appendChild(this.el.outer), this.el.overflow.appendChild(this.el.blocker)) :
                this.el.overflow.appendChild(this.el.outer), e.appendChild(this.el.overflow), this.options["native"] ? addClass(this.el.container, "ui_scroll_native") : (this.el
                    .barOuter.appendChild(this.el.barInner), this.el.barContainer.appendChild(this.el.barOuter), e.appendChild(this.el.barContainer), this.options.shadows && (
                        this.el.overflow.appendChild(this.el.shadowTop), this.el.overflow.appendChild(this.el.shadowBottom)), this.options.scrollElements.push(this.el.barContainer)
                ), this.options.autoresize) {
                var o = this.addResizeSensor(this.el.inner),
                    n = this.addResizeSensor(this.el.overflow);
                this.startResizeListening = function() {
                    o(), n()
                }
            }
            this.removeElements.push(this.el.overflow, this.el.barContainer), this.el.container.appendChild(e), this.options.reversed && (this.el.outer.scrollTop = this.el.outer
                .scrollHeight), this.el.container.__uiScroll__ = this.api = {
                container: this.el.container,
                scroller: this.el.outer,
                content: this.el.content,
                emitter: this.emitter,
                ondragstart: this.dragstart.bind(this),
                ondragstop: this.dragstop.bind(this),
                ondrag: this.drag.bind(this),
                destroy: this.destroy.bind(this),
                disable: this.disable.bind(this, !0),
                enable: this.disable.bind(this, !1),
                scrollTop: this.scrollTop.bind(this),
                scrollBottom: this.scrollBottom.bind(this),
                scrollBy: this.scrollBy.bind(this),
                scrollIntoView: this.scrollIntoView.bind(this),
                update: this.init.bind(this),
                updateAbove: this.updateAbove.bind(this),
                updateBelow: this.updateBelow.bind(this),
                data: {
                    scrollTop: null,
                    scrollBottom: null,
                    scrollHeight: null,
                    viewportHeight: null
                },
                db: this
            }, this.init();
            var l = "onwheel" in this.el.outer ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : browser.mozilla ? "MozMousePixelScroll" : "DOMMouseScroll";
            return this.addEvent(this.el.container, l, function(t) {
                this.animation && this.animation.stop(), this.options.stopScrollPropagation && !this.disabled && this.isScrollEventUnused(t) && cancelEvent(t)
            }.bind(this)), this.options["native"] || this.addEvent(this.el.barInner, "mousedown", this.dragstart.bind(this)), each(this.options.scrollElements, function(t,
                i) {
                this.addEvent(i, l, function(t) {
                    this.disabled || (this.scrollBy(this.scrollEventDelta(t)), (this.options.stopScrollPropagation || !this.isScrollEventUnused(t)) &&
                        cancelEvent(t))
                }.bind(this))
            }.bind(this)), this.options.reversed && this.addEvent(this.el.container, "mousedown touchstart pointerdown", function(t) {
                this.released = !1, this.noMore = !0;
                var i = this.addEvent(document, "mouseup contextmenu touchend pointerup", function(t) {
                    removeEvent(i), this.released = !0, this.noMore && this.stopped && !this.dragging && (this.noMore = !1, this.more())
                }.bind(this))
            }.bind(this)), this.addEvent(this.el.outer, "scroll", function() {
                this.update() && (this.stopped ? (this.stopped = !1, this.emitEvent("scrollstart")) : this.options["native"] || this.stopped !== !1 || (this.stopped =
                        0, addClass(this.el.container, "ui_scroll_scrolled")), this.emitEvent("scroll"), this.stoppedTimeout && clearTimeout(this.stoppedTimeout),
                    this.stoppedTimeout = setTimeout(function() {
                        this.stopped || (this.stopped = !0, this.options["native"] || removeClass(this.el.container, "ui_scroll_scrolled"), this.emitEvent(
                            "scrollstop"), this.noMore && this.released && !this.dragging && (this.noMore = !1, this.more()))
                    }.bind(this), 200))
            }.bind(this)), this.api
        };
        return t.prototype = {
            ge: function(t) {
                return t = isString(t) && "_" === t[0] ? geByClass1(t) : ge(t)
            },
            init: function() {
                if (this.fixBlocker(), !this.inited) {
                    if (!this.el.container.scrollWidth || this.disabled) return;
                    this.fixSize(!0), this.options.autoresize && this.startResizeListening(), this.options.global || cur.destroy.push(this.destroy.bind(this)), this.inited = !
                        0
                }
                return this.update(), this.api
            },
            addEvent: function(t, i, e) {
                return this.removeEvents.push([t, i, e]), addEvent(t, i, e), e
            },
            destroy: function() {
                if (this.disabled = !0, this.fixSize(), this.animation && this.animation.stop(), this.moreTimeout && clearTimeout(this.moreTimeout), this.dragstopHandler &&
                    removeEvent(document, "mouseup contextmenu", this.dragstopHandler), this.dragHandler && removeEvent(document, "mousemove", this.dragHandler), each(this
                        .removeEvents,
                        function(t, i) {
                            removeEvent.apply(null, i)
                        }), this.el.overflow.parentNode == this.el.container) {
                    for (var t = cf(); this.el.content.firstChild;) t.appendChild(this.el.content.firstChild);
                    this.el.container.appendChild(t)
                }
                return this.el.container.className = this.el.container.className.replace(/\bui_scroll_.+?\b/g, " "), each(this.removeElements, function(t, i) {
                    re(i)
                }), this.el.container.scrollTop = this.api.data.scrollTop, delete this.el.container.__uiScroll__, this.api
            },
            updateAbove: function(t) {
                if (isFunction(t)) {
                    this.animation && this.animation.stop();
                    var i = this.el.outer.scrollHeight - this.el.outer.scrollTop - this.el.overflow.offsetHeight;
                    t(), this.el.outer.scrollTop = this.el.outer.scrollHeight - this.el.overflow.offsetHeight - i
                }
                return this.api
            },
            updateBelow: function(t) {
                if (isFunction(t)) {
                    this.animation && this.animation.stop();
                    var i = this.options.preserveEdgeBelow && this.api.data.scrollBottom <= this.options.preserveEdgeBelowThreshold;
                    t(), i && this.scrollBottom()
                }
                return this.api
            },
            fixSize: function(t) {
                this.options["native"] || (t && null == this.fixSizeDefault && (this.fixSizeDefault = this.el.container.style.width), setStyle(this.el.container, "width",
                    t ? getSize(this.el.container, !0)[0] || this.fixSizeDefault || "" : this.fixSizeDefault || ""))
            },
            fixBlocker: function() {
                this.options.stopScrollPropagation && (this.el.blocker.scrollTop = this.blockerScrollTop)
            },
            emitEvent: function(t) {
                this.disabled || this.inited && this.emitter.emitEvent(t, [this.api])
            },
            scrollEventDelta: function(t) {
                var i = 0,
                    e = void 0 !== t.deltaMode ? t.deltaMode : "MozMousePixelScroll" == t.type ? 0 : 1,
                    s = 15,
                    o = 30 * s;
                return "wheel" == t.type ? i = t.deltaY : void 0 !== t.wheelDeltaX && void 0 !== t.wheelDeltaY ? (i = .025 * -t.wheelDeltaY, browser.mac && browser.opera &&
                    (i *= .1)) : void 0 !== t.wheelDelta ? i = .025 * -t.wheelDelta : t.detail && 2 === t.axis && (i = t.detail), i * (1 == e ? s : 2 == e ? o : 1)
            },
            isScrollEventUnused: function(t, i) {
                var i = this.scrollEventDelta(t);
                return i > 0 ? !this.api.data.scrollBottom : !this.api.data.scrollTop
            },
            addResizeSensor: function(t) {
                if (browser.msie9 || browser.opera && browser.version < 13) {
                    var i = !1,
                        e = !1,
                        s = function() {
                            return o.contentDocument ? (o.contentDocument.defaultView.addEventListener("resize", function() {
                                this.update() && (this.fixBlocker(), this.emitEvent("resize"))
                            }.bind(this)), void(this.update() && (this.fixBlocker(), this.emitEvent("resize")))) : setTimeout(s, 100)
                        }.bind(this),
                        o = ce("object", {
                            type: "text/html",
                            className: "ui_scroll_resize_object",
                            data: browser.msie9 ? "javascript: '<script>window.onload = function(){document.write(\\'<script>document.domain=\\\"" + document.domain +
                                "\\\"<\\\\/script>\\');document.close()}</script>'" : "about:blank",
                            onload: function() {
                                e = !0, i && s()
                            }
                        });
                    return t.appendChild(o), this.removeElements.push(o),
                        function() {
                            i = !0, e && s()
                        }.bind(this)
                }
                var o = ce("div", {
                        className: "ui_scroll_resize_sensor"
                    }),
                    n = ce("div", {
                        className: "ui_scroll_resize_sensor ui_scroll_resize_expand"
                    }),
                    l = ce("div", {
                        className: "ui_scroll_resize_sensor ui_scroll_resize_shrink"
                    }),
                    r = ce("div"),
                    a = ce("div"),
                    h = null;
                return n.appendChild(r), l.appendChild(a), o.appendChild(n), o.appendChild(l), t.appendChild(o), this.removeElements.push(o), n.onscroll = l.onscroll =
                    function() {
                        var i = (t.offsetWidth || 1e4) + 10,
                            e = (t.offsetHeight || 1e4) + 10;
                        r.style.width = i + "px", r.style.height = e + "px", n.scrollLeft = i, n.scrollTop = e, l.scrollLeft = i, l.scrollTop = e, h !== (h = i + " " + e) &&
                            this.update() && (this.fixBlocker(), this.emitEvent("resize"))
                    }.bind(this)
            },
            disable: function(t) {
                return this.disabled = !!t, t ? (this.animation && this.animation.stop(), this.fixSize()) : (this.fixSize(!0), this.update()), toggleClass(this.el.container,
                    "ui_scroll_disabled", this.disabled), this.api
            },
            dragstart: function(t) {
                return this.disabled || this.dragging || this.options["native"] ? void 0 : (t || (t = window.event), this.dragging = !0, this.animation && this.animation.stop(),
                    this.options.reversed && (this.noMore = !0), setStyle(bodyNode, "cursor", "pointer"), addEvent(document, "mouseup contextmenu", this.dragstartHandler =
                        this.dragstop.bind(this)), addEvent(document, "mousemove", this.dragHandler = this.drag.bind(this)), addClass(this.el.container,
                        "ui_scroll_dragging"), this.dragScroll = this.options.reversed ? this.api.data.scrollBottom : this.api.data.scrollTop, this.dragY = t.screenY,
                    cancelEvent(t), this.emitEvent("dragstart"), this.api)
            },
            dragstop: function(t) {
                return this.disabled || !this.dragging || this.options["native"] ? void 0 : (t || (t = window.event), this.dragging = !1, this.dragstopHandler &&
                    removeEvent(document, "mouseup contextmenu", this.dragstopHandler),
                    this.dragHandler && removeEvent(document, "mousemove", this.dragHandler), setStyle(bodyNode, "cursor", ""), removeClass(this.el.container,
                        "ui_scroll_dragging"), this.noMore && (this.noMore = !1, this.more()), t && "contextmenu" !== t.type && cancelEvent(t), this.emitEvent(
                        "dragstop"), this.api)
            },
            drag: function(t) {
                if (!this.disabled && this.dragging && !this.options["native"]) {
                    t || (t = window.event);
                    var i = (t.screenY - this.dragY) * (this.api.data.scrollHeight / this.el.barOuter.scrollHeight);
                    return this.el.outer.scrollTop = this.options.reversed ? this.el.outer.scrollHeight - this.el.overflow.offsetHeight - this.dragScroll + i : this.dragScroll +
                        i, cancelEvent(t), this.emitEvent("drag"), this.api
                }
            },
            scroll: function(t, i, e) {
                return this.animation && this.animation.stop(), i ? (i = "number" != typeof i || !Number.isFinite(i) || i % 1 ? 300 : Math.abs(i), this.animation = new Fx.Base({
                        scrollTop: this.el.outer.scrollTop
                    }, {
                        transition: Fx.Transitions.easeOutCubic,
                        onStep: function(t) {
                            this.el.outer.scrollTop = t.scrollTop
                        }.bind(this),
                        duration: i,
                        onComplete: isFunction(e) ? e.pbind(this.api) : void 0
                    })
                    .start({
                        scrollTop: this.el.outer.scrollTop
                    }, {
                        scrollTop: t
                    })) : (this.el.outer.scrollTop = t, isFunction(e) && e(this.api)), this.api
            },
            scrollTop: function(t, i, e) {
                return this.disabled || this.dragging ? void 0 : this.scroll(intval(t), i, e)
            },
            scrollBottom: function(t, i, e) {
                return this.disabled || this.dragging ? void 0 : this.scroll(this.el.outer.scrollHeight - this.el.overflow.offsetHeight - intval(t), i, e)
            },
            scrollBy: function(t, i, e) {
                return this.disabled || this.dragging ? void 0 : this.scroll(this.el.outer.scrollTop + intval(t), i, e)
            },
            scrollIntoView: function(t, i, e) {
                if ((t = this.ge(t)) && t.compareDocumentPosition(this.el.content) & Node.DOCUMENT_POSITION_CONTAINS) {
                    var s = getXY(t)[1],
                        o = getXY(this.el.overflow)[1],
                        n = getSize(t)[1];
                    o >= s && s + n >= o + this.api.data.viewportHeight || s >= o && s + n <= o + this.api.data.viewportHeight ? isFunction(e) && (i ? setTimeout(e.bind(
                        this.api), 0) : e(this.api)) : n > this.api.data.viewportHeight || o > s ? this.scrollTop(s - o + this.api.data.scrollTop - (this.options.shadows ?
                        getSize(this.el.shadowTop)[1] : 0), i, e) : this.scrollTop(s - o + this.api.data.scrollTop + n - this.api.data.viewportHeight + (this.options.shadows ?
                        getSize(this.el.shadowBottom)[1] : 0), i, e)
                }
                return this.api
            },
            update: function() {
                if (!this.inited || this.disabled) return !1;
                var t = this.el.overflow.offsetHeight,
                    i = this.el.inner.offsetHeight,
                    e = this.el.outer.scrollTop,
                    s = Math.max(0, i - e - t);
                if (t !== this.api.data.viewportHeight || i !== this.api.data.scrollHeight || e !== this.api.data.scrollTop || s !== this.api.data.scrollBottom) {
                    if (this.api.data.viewportHeight = t, this.api.data.scrollHeight = i, this.api.data.scrollTop = e, this.api.data.scrollBottom = s, !this.options[
                            "native"]) {
                        var o = Math.max(this.options.minContentHeight, i),
                            n = t >= o;
                        if (!n) {
                            var l = Math.max(this.options.barMinHeight, this.el.barOuter.offsetHeight * t / o);
                            this.el.barInner.style.top = Math.max(0, (this.el.barOuter.offsetHeight - l) * Math.min(1, e / (o - t))) + "px", this.el.barInner.style.height =
                                l + "px"
                        }
                        this.options.shadows && (this.shadowTop != (e && !n) && toggleClass(this.el.container, "ui_scroll_shadow_top_visible", this.shadowTop = e && !n),
                                this.shadowBottom != (s && !n) && toggleClass(this.el.container, "ui_scroll_shadow_bottom_visible", this.shadowBottom = s && !n)), this.unnecessary !==
                            n && (toggleClass(this.el.container, "ui_scroll_unnecessary", n), this.unnecessary = n)
                    }
                    return this.emitEvent("update"), this.more(), !0
                }
                return !1
            },
            more: function() {
                !this.noMore && (this.options.reversed ? this.api.data.scrollTop : this.api.data.scrollBottom) <= (null !== this.options.onmoreThreshold ? this.options.onmoreThreshold :
                    2 * this.api.data.viewportHeight) && this.emitEvent("more")
            }
        }, t
    }();
window.Scrollbar = window.Scrollbar || function() {
    function t(t) {
        if (!this.inited) return !1;
        if (t || (t = window.event), this.isHorizontal) {
            var i = Math.floor((this.contWidth() - this.scrollWidth) * Math.min(1, (t.screenX - this.moveX) / (this.scrollbarSize - this.innerWidth - 6)));
            isFunction(this.options.onScroll) && this.options.onScroll(this.obj.scrollLeft - i, this), this.obj.scrollLeft = i
        } else {
            var i = Math.floor((this.contHeight() - this.scrollHeight) * Math.min(1, (t.screenY - this.moveY) / (this.scrollbarSize - this.innerHeight - 6)));
            isFunction(this.options.onScroll) && this.options.onScroll(this.obj.scrollTop - i, this), this.obj.scrollTop = i
        }
        return this.update(!0), !1
    }

    function i() {
        return this.inited ? (this.moveY = this.moveX = this.isDown = !1, this.isOut && this.contOut(), removeEvent(document, "mousemove", this.mouseMove), removeEvent(
                document, "mouseup", this.mouseUp), setStyle(document.body, "cursor", "default"), setStyle(this.obj, {
                pointerEvents: ""
            }), removeClass(this.inner, "scrollbar_hovered"), isFunction(this.options.stopDrag) && this.options.stopDrag(), isFunction(this.options.onHold) && this.options
            .onHold(!1), !1) : !1
    }

    function e(t) {
        if (!this.inited) return !1;
        if (!this.moveY && !checkEvent(t)) return t || (t = window.event), addEvent(document, "mousemove", this.mouseMove), addEvent(document, "mouseup", this.mouseUp),
            setStyle(document.body, "cursor", "pointer"), setStyle(this.obj, {
                pointerEvents: "none"
            }), this.isHorizontal ? this.moveX = t.screenX - (this.inner.offsetLeft || 0) : this.moveY = t.screenY - (this.inner.offsetTop || 0), addClass(this.inner,
                "scrollbar_hovered"), isFunction(this.options.startDrag) && this.options.startDrag(), isFunction(this.options.onHold) && this.options.onHold(!0), this.isDown = !
            0, cancelEvent(t)
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
            "scrollWidth" : "scrollHeight", this.topShadow = !1, this.bottomShadow = !1, this[this.scrollProp + "Last"] = this.obj[this.scrollProp], this.destroyList = [],
            this.mouseDown = e.bind(this), this.mouseMove = t.bind(this), this.mouseUp = i.bind(this), setTimeout(function() {
                setStyle(o, {
                    overflow: "hidden"
                }), this.scrollbar = ce("div", {
                    className: (this.options.prefix ? this.options.prefix + "scrollbar_cont " : "") + "scrollbar_cont" + (this.isHorizontal ?
                        " scrollbar_cont_horiz" : "") + (this.options.hidden ? " scrollbar_hidden" : "")
                }), this.inner = ce("div", {
                    className: (this.options.prefix ? this.options.prefix + "scrollbar_inner " : "") + "scrollbar_inner"
                }), this.scrollbar.appendChild(this.inner);
                var t = this.widthUpdated();
                this.options.shadows && (o.parentNode.insertBefore(this.topShadowDiv = ce("div", {
                    className: (this.options.prefix ? this.options.prefix + "scrollbar_top " : "") + "scrollbar_top"
                }, {
                    width: t[0]
                }), o), o.parentNode.insertBefore(this.bottomShadowDiv = ce("div", {
                    className: (this.options.prefix ? this.options.prefix + "scrollbar_bottom " : "") + "scrollbar_bottom"
                }, {
                    width: t[0]
                }), o.nextSibling)), o.parentNode.insertBefore(this.scrollbar, o);
                var i = s.bind(this),
                    e = this.wheel.bind(this),
                    n = "onwheel" in ce("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : browser.mozilla ? "MozMousePixelScroll" : "DOMMouseScroll";
                if (addEvent(o, n, e), addEvent(this.scrollbar, n, e), this.options.scrollElements && each(this.options.scrollElements, function(t, i) {
                        addEvent(i, n, e)
                    }), addEvent(this.scrollbar, "mouseover", this.contOver.bind(this)), addEvent(this.scrollbar, "mouseout", this.contOut.bind(this)), addEvent(this.scrollbar,
                        "mousedown", this.contDown.bind(this)), browser.safari_mobile) {
                    var l = function(t) {
                            this.isHorizontal ? cur.touchX = t.touches[0].pageX : cur.touchY = t.touches[0].pageY
                        }.bind(this),
                        r = function(t) {
                            return this.isHorizontal ? (cur.touchDiff = cur.touchX - (cur.touchX = t.touches[0].pageX), o.scrollLeft += cur.touchDiff, o.scrollLeft > 0 &&
                                this.shown !== !1 && this.update(!0)) : (cur.touchDiff = cur.touchY - (cur.touchY = t.touches[0].pageY), o.scrollTop += cur.touchDiff,
                                o.scrollTop > 0 && this.shown !== !1 && this.update(!0)), cancelEvent(t)
                        }.bind(this),
                        a = function() {
                            cur.animateInt = setInterval(function() {
                                cur.touchDiff = .9 * cur.touchDiff, cur.touchDiff < 1 && cur.touchDiff > -1 ? clearInterval(cur.animateInt) : (o[self.scrollProp] +=
                                    cur.touchDiff, this.update(!0))
                            }.bind(this), 0)
                        }.bind(this);
                    addEvent(o, "touchstart", l), addEvent(o, "touchmove", r), addEvent(o, "touchend", a), this.destroyList.push(function() {
                        removeEvent(o, "touchstart", l), removeEvent(o, "touchmove", r), removeEvent(o, "touchend", a)
                    })
                }
                addEvent(this.inner, "mousedown", this.mouseDown), this.options.nokeys ? this.onkeydown = i : addEvent(window, "keydown", i), this.destroyList.push(
                        function() {
                            removeEvent(o, n, e), this.options.scrollElements && each(this.options.scrollElements, function(t, i) {
                                removeEvent(i, n, e)
                            }), removeEvent(this.inner, "mousedown", this.mouseDown), removeEvent(window, "keydown", i), re(this.scrollbar)
                        }.bind(this)), this.isHorizontal || (this.contHeight() <= this.scrollHeight ? hide(this.bottomShadowDiv) : this.bottomShadow = !0), this.options.onInit &&
                    this.options.onInit(), this.inited = !0, this.update(!0), this.options.global || cur.destroy.push(this.destroy.bind(this))
            }.bind(this), 0)
    }
    return o.prototype = {
        wheel: function(t) {
            if (!this.disabled) {
                t || (t = window.event);
                var i = 0,
                    e = this.obj[this.scrollProp];
                if (deltaMode = void 0 !== t.deltaMode ? t.deltaMode : "MozMousePixelScroll" == t.type ? 0 : 1, pixelRatio = 1, pixelsPerLine = 15, pixelsPerPage = 30 *
                    pixelsPerLine, "wheel" == t.type ? i = -(this.isHorizontal ? t.deltaX : t.deltaY) : void 0 !== t.wheelDeltaX && void 0 !== t.wheelDeltaY ? (i =
                        .025 * (this.isHorizontal ? t.wheelDeltaX : t.wheelDeltaY), browser.mac && browser.opera && (i *= .1)) : void 0 !== t.wheelDelta ? i = .025 * t
                    .wheelDelta : t.detail && t.axis === (this.isHorizontal ? 1 : 2) && (i = -t.detail), i = i * pixelRatio * (1 == deltaMode ? pixelsPerLine : 2 ==
                        deltaMode ? pixelsPerPage : 1)) return this.obj[this.scrollProp] -= i, isFunction(this.options.onScroll) && this.options.onScroll(i, this), e !=
                    this.obj[this.scrollProp] && this.shown !== !1 && (this.update(!0), addClass(this.inner, "scrollbar_hovered"), clearTimeout(this.moveTimeout),
                        this.moveTimeout = setTimeout(function() {
                            removeClass(this.inner, "scrollbar_hovered")
                        }.bind(this), 300)), !this.shown && !this.options.forceCancelEvent || this.isHorizontal && e == this.obj[this.scrollProp] ? void 0 : !1
            }
        },
        setOptions: function(t) {
            extend(this.options, t)
        },
        widthUpdated: function() {
            var t, i = getSize(this.obj);
            return t = this.isHorizontal ? {
                marginLeft: this.options.top + "px",
                marginTop: i[1] + 3 + "px",
                width: i[0] - this.options.top - this.options.bottom + "px"
            } : {
                marginTop: this.options.top + "px",
                marginLeft: this.options.nomargin ? 0 : i[0] - (this.options.mlDiff || 7) + "px",
                height: i[1] - this.options.top - this.options.bottom + "px"
            }, this.options.nomargin && (void 0 !== this.options.right && "auto" !== this.options.right ? (t.right = this.options.right, t.left = "auto") : void 0 !==
                this.options.left && (t.right = "auto", t.left = this.options.left)), this.scrollWidth = i[0], this.scrollHeight = i[1], this.scrollbarSize = i[
                this.isHorizontal ? 0 : 1] - this.options.top - this.options.bottom, setStyle(this.scrollbar, t), setTimeout(function() {
                removeClass(this.scrollbar, "no_transition")
            }.bind(this)), i
        },
        contOver: function() {
            this.isOut = !1, this.shown && addClass(this.scrollbar, "scrollbar_c_overed")
        },
        contOut: function() {
            this.isOut = !0, this.isDown || removeClass(this.scrollbar, "scrollbar_c_overed")
        },
        contDown: function(t) {
            if (t || (t = window.event), this.isHorizontal) {
                var i = t.offsetX - this.innerWidth / 2 + 5,
                    e = this.scrollbarSize - this.innerWidth;
                this.obj.scrollLeft = Math.floor((this.contWidth() - this.scrollWidth) * Math.min(1, i / e))
            } else {
                var i = t.offsetY - this.innerHeight / 2 + 5,
                    e = this.scrollbarSize - this.innerHeight;
                this.obj.scrollTop = Math.floor((this.contHeight() - this.scrollHeight) * Math.min(1, i / e))
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
        getScrollHeight: function() {
            return this.scrollHeight
        },
        scrollTop: function(t) {
            return "undefined" == typeof t ? this.obj.scrollTop : (this.obj.scrollTop = parseInt(t), void this.update(!1, !0))
        },
        scrollBottom: function(t) {
            return "undefined" == typeof t ? this.contHeight() - this.scrollHeight - this.obj.scrollTop : (this.obj.scrollTop = this.contHeight(!0) - this.scrollHeight -
                t, void this.update(!0, !0))
        },
        smoothScroll: function(t, i, e) {
            var s = this.obj.scrollTop + t;
            "undefined" == typeof e && (e = 300);
            var o = this,
                n = new Fx.Base({
                    scrollTop: this.obj.scrollTop
                }, {
                    transition: Fx.Transitions.easeOutCubic,
                    onStep: function(t) {
                        o.obj.scrollTop = t.scrollTop, o.update(!0)
                    },
                    duration: e,
                    onComplete: function() {
                        i && i(scroll)
                    }
                });
            n.start({
                scrollTop: this.obj.scrollTop
            }, {
                scrollTop: s
            })
        },
        scrollLeft: function(t) {
            this.obj.scrollLeft = parseInt(t), this.update(!1, !0)
        },
        destroy: function(t) {
            each(this.destroyList || [], function(t, i) {
                i()
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
        update: function(t, i) {
            if (this.inited && !this.hidden) {
                if (!t && (this.isHorizontal ? this.moveX : this.moveY)) return !0;
                var e, s, o;
                if (i && (e = getSize(this.obj), this.isHorizontal ? (this.scrollWidth = e[0], e = Math.round(this.scrollWidth - this.options.top - this.options.bottom),
                        this.scrollbarSize !== e && (this.scrollbar.style.width = e + "px")) : (this.scrollHeight = e[1], e = Math.round(this.scrollHeight - this.options
                        .top - this.options.bottom), this.scrollbarSize !== e && (this.scrollbar.style.height = e + "px")), this.scrollbarSize = e), this.isHorizontal ?
                    (e = this.contWidth()) <= Math.round(this.scrollWidth) : (e = this.contHeight()) <= Math.round(this.scrollHeight)) return hide(this.inner, this.bottomShadowDiv,
                    this.topShadowDiv), this.scrollbar.style.pointerEvents = "none", this.topShadow = this.bottomShadow = this.shown = !1, isFunction(this.options
                    .more) && e - this.obj[this.scrollProp] < 2 * this[this.scrollDimensionProp] && this.options.more(this), void(this[this.scrollProp + "Last"] =
                    this.obj[this.scrollProp]);
                this.shown || (show(this.inner), this.scrollbar.style.pointerEvents = "", this.shown = !0);
                var o = this.val();
                isFunction(this.options.scrollChange) && this.options.scrollChange(o), this.lastProgress = Math.min(1, o / (e - (this.isHorizontal ? this.scrollWidth :
                        this.scrollHeight))), this.lastProgress > 0 != this.topShadow && ((this.topShadow = !this.topShadow) ? show : hide)(this.topShadowDiv), this.lastProgress <
                    1 != this.bottomShadow && ((this.bottomShadow = !this.bottomShadow) ? show : hide)(this.bottomShadowDiv), this.isHorizontal ? (s = Math.max(40,
                            Math.floor(this.scrollbarSize * this.scrollWidth / e)), s !== this.innerWidth && (this.inner.style.width = (this.innerWidth = s) + "px"),
                        this.inner.style.marginLeft = (this.scrollbarSize - s - 2 * this.options.padding) * this.lastProgress + this.options.padding + "px") : (s =
                        Math.max(40, Math.floor(this.scrollbarSize * this.scrollHeight / e)), s !== this.innerHeight && (this.inner.style.height = (this.innerHeight =
                            s) + "px"), this.inner.style.marginTop = (this.scrollbarSize - s - 2 * this.options.padding) * this.lastProgress + this.options.padding +
                        "px"), isFunction(this.options.more) && e - this.obj[this.scrollProp] < 2 * this[this.scrollDimensionProp] && this.options.more(this), this[
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
            i = this.moreEl,
            e = this.scrollNode,
            s = e.scrollHeight,
            o = e.scrollTop,
            n = e.offsetHeight || e.clientHeight;
        toggleClass(t, "olist_topsh", o > 0), toggleClass(t, "olist_botsh", s > o + n), i && i.offsetTop && i.onclick && o + n + 200 >= s && i.onclick()
    },
    onMouseEvent: function(t) {
        var i = t.originalTarget || t.target;
        if (hasClass(i, "olist_item_wrap") || (i = gpeByClass("olist_item_wrap", i)), i && i != bodyNode) {
            if (hasClass(i, "olist_item_loading")) return cancelEvent(t);
            if (checkEvent(t)) return !0;
            this.box.changed = !0;
            var e = i.id.match(/-?\d+/)[0],
                s = !this.invertedSelection && this.selected[e] || this.invertedSelection && !this.selected[e];
            if (toggleClass(i, "olist_item_wrap_on", !s), this.selected[e] = !s || this.invertedSelection, this.selCnt += !s || this.invertedSelection ? 1 : -1, this.selTabUpdate(),
                this.onListClick && this.onListClick(i, s), this.scrollNode.scrollTop < 50) {
                var o = this.filter;
                setTimeout(elfocus.pbind(o), 100)
            }
            return cancelEvent(t)
        }
    },
    onOlistSelect: function(t, i) {
        uiActionsMenu.toggle(this.olistFilter, !1);
        var e = this.selCnt,
            s = this.selected;
        switch (i.ctrlKey || i.metaKey || i.shiftKey || (s = {}, e = 0), t) {
            case "all":
                s = {}, e = 0, each(this.owners, function() {
                    s[this[0]] = 1, e++
                });
                break;
            case "none":
                s = {}, e = 0;
                break;
            case "people":
                each(this.owners, function() {
                    this[0] > 0 && !s[this[0]] && (s[this[0]] = 1, e++)
                });
                break;
            case "groups":
                each(this.owners, function() {
                    this[0] < 0 && !s[this[0]] && (s[this[0]] = 1, e++)
                });
                break;
            default:
                var o = intval(t.replace("list", "")),
                    n = 1 << o;
                each(this.owners, function() {
                    this[4] & n && !s[this[0]] && (s[this[0]] = 1, e++)
                })
        }
        return this.selCnt = e, this.selected = s, this.selTabUpdate(), this.renderList(), !1
    },
    onOlistFilters: function(t, i) {
        return uiActionsMenu.show(t, i), addEvent(document, "mousedown", function(i) {
            uiActionsMenu.toggle(t, !1), removeEvent(document, "mousedown", arguments.callee)
        }), i && cancelEvent(i)
    },
    selTabUpdate: function() {
        if (this.isAlbumEdit) return void(this.onTabUpdate && this.onTabUpdate());
        if (this.tabs) {
            var t = this.selCnt,
                i = this.owners.length - t,
                e = geByClass1("olist_tab_sel", this.tabs),
                s = geByClass1("olist_tab_unsel", this.tabs);
            val(geByClass1("ui_tab_count", e), t || ""), val(geByClass1("ui_tab_count", s), i || ""), this.onTabUpdate && this.onTabUpdate()
        }
    },
    renderList: function(t, i, e) {
        i = i || 0, e = e || this.sel;
        var s, o, n, l = i ? 60 : 120,
            r = this;
        t && (t = t.replace(/\u2013|\u2014/g, "-")), s = t ? this.indexer.search(t) : this.owners, r.unsortedIndex == e && r.getUnsorted && (s = r.getUnsorted(s)), o =
            this.selected;
        var a = r.invertedSelection ? !(this.sel < 0) : this.sel < 0;
        if (n = r.tpl, e && r.unsortedIndex != e) {
            var h = [];
            each(s, function() {
                var t = this[r.idIndex];
                return (!a && o[t] || a && !o[t]) && (h.push(this), h.length > i + l) ? !1 : void 0
            }), s = h
        }
        var d = s.length;
        s = s.slice(i, i + l);
        var c = [];
        if (t) {
            t = clean(t);
            var u = escapeRE(t),
                p = parseLatin(t);
            null != p && (u = u + "|" + escapeRE(p));
            var v = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + u + "))(?![^<>]*>)(?![^&;]+;)", "gi")
        }
        var g = r.rsTpl ? r.rsTpl : function(t, i, e, s, o) {
            var n = !e && s[t[0]] || e && !s[t[0]],
                l = t[1];
            if (i) {
                l = -1 == i.indexOf(" ") ? l.split(" ") : [l];
                var r = "";
                for (var a in l) r += (a > 0 ? " " : "") + l[a].replace(o, "$2<em>$3</em>");
                l = r
            }
            return {
                id: t[0],
                name: l,
                photo: t[2],
                classname: n ? " olist_item_wrap_on" : "",
                link: t[3] || (t[0] > 0 ? "id" + t[0] : "club" + -t[0])
            }
        };
        each(s, function() {
                c.push(rs(n, g(this, t, r.invertedSelection, o, v)))
            }), i || c.length || c.push('<div class="no_rows">' + (t ? getLang("global_search_not_found")
                .replace("{search}", t) : r.noSelMsg) + "</div>"), re(this.moreEl), c = c.join(" "), i ? this.olistEl.appendChild(cf(c)) : val(this.olistEl, c), d > i +
            l && (this.olistEl.appendChild(this.moreEl), this.moreEl.onclick = function(e) {
                return r.renderList(t, i + l), cancelEvent(e)
            }), r.box && r.box.scroll && r.box.scroll.update(!1, !0), r.onScroll()
    }
});
var uiBox = {
    addShadows: function(t) {
        setTimeout(function() {
            var i = domFC(t.bodyNode),
                e = function() {
                    toggleClass(domPN(t.bodyNode), "box_topsh", i.scrollTop > 0), toggleClass(domPN(t.bodyNode), "box_botsh", i.scrollTop + (i.offsetHeight || i.clientHeight) <
                        i.scrollHeight)
                };
            addEvent(i, "scroll", e), setTimeout(e, 10)
        }, 10)
    }
};
Slider.prototype.toggleLoading = function(t) {
    t = !!t, toggle(this._progressEl, t), setStyle(this._progressEl, "opacity", t ? 1 : 0)
}, Slider.prototype.destroy = function(t) {
    this.options.formatHint && (removeEvent(this._el, "mousemove", this._ev_onMouseOver), removeEvent(this._el, "mouseleave", this._ev_onMouseLeave), removeEvent(this._el,
        "mousedown", this._ev_onMouseDown)), re(this._el), re(this._currHintEl)
}, Slider.prototype._updateHint = function(t, i) {
    this._currHintEl || (this._currHintEl = se('<div class="slider_hint" id="slider_hint"></div>'), this.options.hintClass && addClass(this._currHintEl, this.options.hintClass),
        this._el.appendChild(this._currHintEl)), this._width = this._width || getSize(this._el)[0];
    var e = this._getPos(),
        s = Math.round(t.pageX - e[0]),
        o = this._width;
    if (s = i ? Math.min(Math.max(0, s), o) : s, s >= 0 && o >= s) {
        var n = s / o;
        this._currHintEl.innerHTML = this.options.formatHint ? this.options.formatHint.call(this, n) : n;
        var l = getSize(this._currHintEl);
        setStyle(this._currHintEl, {
            left: this._slideEl.offsetLeft + s - l[0] / 2,
            top: this._slideEl.offsetTop - l[1] - 10
        }), !i && this._toggleHint(!0)
    } else !i && this._toggleHint(!1);
    this.options.formatHint || this._toggleHint(!1)
}, Slider.prototype._toggleHint = function(t) {
    toggleClass(this._currHintEl, "visible", t)
}, Slider.prototype._onMouseOver = function(t) {
    Slider._currenSliderDrag || hasClass(this._el, "active") || this._updateHint(t)
}, Slider.prototype._onMouseLeave = function(t) {
    hasClass(this._el, "active") || this._toggleHint(!1)
}, Slider.prototype._onMouseDown = function(t) {
    0 == t.button && (delete cur._sliderMouseUpNowEl, addEvent(window, "mousemove", this._ev_onMouseMove = this._onMouseMove.bind(this)), addEvent(window, "mouseup", this._ev_onMouseUp =
            this._onMouseUp.bind(this)), this._width = getSize(this._el)[0], this._onMouseMove(t), Slider._currenSliderDrag = this, addClass(this._el, "active"),
        cancelEvent(t))
}, Slider.prototype._onMouseUp = function(t) {
    cur._sliderMouseUpNowEl = this._el, removeEvent(window, "mousemove", this._ev_onMouseMove), removeEvent(window, "mouseup", this._ev_onMouseUp), clearTimeout(this._debounceto),
        this._onValueChange(), removeClass(this._el, "active"), Slider._currenSliderDrag = !1, this._toggleHint(!1), this.options.onEndDragging && this.options.onEndDragging(
            this._currValue)
}, Slider.prototype._onMouseMove = function(t) {
    var i = this._getPos(),
        e = Math.max(t.pageX, i[0]);
    e = Math.min(e, i[0] + this._width), e -= i[0], this.setValue(e / this._width, !0, !0), this._onValueChangeDebounced ? this._onValueChangeDebounced() : this._onValueChange(),
        this._toggleHint(!0), this._updateHint(t, !0), cancelEvent(t)
}, Slider.prototype._getPos = function() {
    return this._slidePos = getXY(this._slideEl)
}, Slider.LOGFBASE = 35, Slider.prototype._logf = function(t) {
    if (!this.options.log) return t;
    var i = Slider.LOGFBASE;
    return (Math.pow(i, t) - 1) / (i - 1)
}, Slider.prototype._unlogf = function(t) {
    function i(t, i) {
        return Math.log(i) / Math.log(t)
    }
    if (!this.options.log) return t;
    var e = Slider.LOGFBASE;
    return i(e, 1 + t * (e - 1))
}, Slider.prototype.setValue = function(t, i, e) {
    if (!hasClass(this._el, "active") || e) {
        var s = e ? this._logf(t) : t;
        if (this._currValue != s) {
            this._currValue = s;
            var o = e ? t : this._unlogf(t);
            o = 100 * o + "%", setStyle(this._amountEl, {
                width: o
            }), setStyle(this._handlerEl, {
                left: o
            }), !i && this._onValueChange()
        }
    }
}, Slider.prototype.setBackValue = function(t) {
    toggleClass(this._backEl, "slider_back_transition", t > this._backValue), this._backValue = t;
    var i = 100 * t + "%";
    setStyle(this._backEl, {
        width: i
    })
}, Slider.prototype._onValueChange = function() {
    this._lastValue = this._lastValue || 0, this._lastValue != this._currValue && (this._lastValue = this._currValue, this.options.onChange && this.options.onChange(this._currValue))
};
try {
    stManager.done("ui_common.js")
} catch (e) {}
