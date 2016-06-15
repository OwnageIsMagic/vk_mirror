function OList(t, e, i, s) {
    0 === i.length && (i = {}), s = s || {}, this.indexer = new vkIndexer(e, s.getName ? s.getName : function(t) {
            return t[1]
        }), this.owners = e, this.tpl = s.tpl, this.rsTpl = s.rsTpl, this.idIndex = s.idIndex || 0, this.selected = i, this.getUnsorted = s.getUnsorted, this.unsortedIndex = s.unsortedIndex ||
        0, this.box = t, this.filter = s.filter, s.onTabUpdate && (this.onTabUpdate = s.onTabUpdate), s.onListClick && (this.onListClick = s.onListClick), t.setButtons(getLang(
            "global_save"), function(i) {
            var n = {},
                l = [],
                r = [];
            each(e, function() {
                !o.invertedSelection && o.selected[this[o.idIndex]] || o.invertedSelection && !o.selected[this[o.idIndex]] ? (n[this[o.idIndex]] = this, l.push(this[o.idIndex])) :
                    r.push(this[o.idIndex])
            }), cur.onOListSave(l, r, n, s.ret || {}, i) !== !1 && t.hide(200)
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
    a = a && geByClass1("ui_tab", a), (cur.onOListTabChange = function(t, e) {
        t && uiTabs.switchTab(t), void 0 === e && (e = void 0 === o.selPrev ? 0 : o.selPrev), o.selPrev = o.sel, o.sel = e, o.renderList(val(l), 0, e), setTimeout(elfocus.pbind(
            l), 100)
    })(a, o.sel), cur.onOlistChange = o.renderList.bind(this), cur.onOlistSelect = o.onOlistSelect.bind(this), cur.onOlistFilters = o.onOlistFilters.bind(this)
}

function Slider(t, e) {
    if (this.constructor != Slider) throw new Error("Slider was called without 'new' operator");
    if (!t) throw new Error("No element was provided for Slider");
    t = ge(t), this.options = e || {
        size: 1
    }, this.options.backValue = this.options.backValue || 0;
    var i = 100 * this.options.backValue,
        s = this.options.withBackLine ? '<div class="slider_back" style="width:' + i + '%"></div>' : "",
        o = '<div class="slider_slide"><div class="slider_loading_bar" style="opacity: 0; display: none;"></div> ' + s +
        ' <div class="slider_amount"></div> <div class="slider_handler"></div> </div>';
    this._el = ce("div", {
        innerHTML: o,
        className: "slider",
        id: t.getAttribute("id") || ""
    });
    for (var n = t.classList, l = this, r = 0, a = n.length; a > r; r++) addClass(this._el, n[r]);
    each(this._el.attributes, function(t, e) {
            ("id" != e.name || "class" != e.name) && l._el.setAttribute(e.name, e.value)
        }), t.parentNode.replaceChild(this._el, t), data(this._el, "slider", this), this._amountEl = geByClass1("slider_amount", this._el), this._handlerEl = geByClass1(
            "slider_handler", this._el), this._slideEl = geByClass1("slider_slide", this._el), this._backEl = geByClass1("slider_back", this._el), this._progressEl = geByClass1(
            "slider_loading_bar", this._el), this.options.color && (setStyle(this._amountEl, {
            backgroundColor: this.options.color
        }), setStyle(this._handlerEl, {
            backgroundColor: this.options.color
        })), this.options.backColor && setStyle(this._slideEl, {
            backgroundColor: this.options.backColor
        }), addClass(this._el, "slider_size_" + this.options.size), this.options.debounce && (this._onValueChangeDebounced = debounce(this._onValueChange, this.options.debounce)),
        e.formatHint && (addEvent(this._el, "mousemove", this._ev_onMouseOver = this._onMouseOver.bind(this)), addEvent(this._el, "mouseleave", this._ev_onMouseLeave = this._onMouseLeave
            .bind(this))), addEvent(this._el, "mousedown", this._ev_onMouseDown = this._onMouseDown.bind(this)), this.setValue(this.options.value || 0, this.options.fireChangeEventOnInit ?
            !1 : !0, !0), this.setBackValue(this.options.backValue)
}
var uiTabs = {
        initTabs: function(t, e) {
            if (!(browser.msie && intval(browser.version) < 10 || browser.opera && intval(browser.version) < 15 || hasClass(t, "ui_tabs_sliding"))) {
                var i = getSize(e)[0],
                    s = e.offsetLeft,
                    o = geByClass1("_ui_tabs_slider", t);
                if (!domData(t, "inited")) {
                    var n = {
                        width: i + "px",
                        marginLeft: s
                    };
                    setStyle(o, n)
                }
            }
        },
        tryInit: function(t) {
            if (!domData(t, "inited")) {
                var e = geByClass1("ui_tab_sel", t);
                e && uiTabs.initTabs(t, e), domData(t, "inited", 1)
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
                l = hasClass(s, "ui_tab_group_item") ? n = gpeByClass("ui_tab_group", s) : s,
                r = hasClass(t, "ui_tab_group_item") ? o = gpeByClass("ui_tab_group", t) : t;
            if (t != s) {
                if (t != r && (uiTabs.toggleGroup(r, !1), uiTabs.resetLabel(r, t)), l) {
                    uiTabs.initTabs(i, l), e = e || {}, e.noAnim || r === l || (addClass(i, "ui_tabs_sliding"), clearTimeout(cur.tabSlidingTO), cur.tabSlidingTO = setTimeout(
                        removeClass.pbind(i, "ui_tabs_sliding"), 300));
                    var a = geByClass1("_ui_tabs_slider", i),
                        h = intval(a.style.marginLeft),
                        u = {
                            width: getSize(r)[0] + "px"
                        };
                    u[cssTransformProp] = "translateX(" + (r.offsetLeft - h) + "px)", setStyle(a, u), s != l && r != l && uiTabs.resetLabel(l), l != s && removeClass(l,
                        "ui_tab_group_sel"), removeClass(s, "ui_tab_sel")
                }
                if (r != t && addClass(r, "ui_tab_group_sel"), addClass(t, "ui_tab_sel"), n && removeClass(n, "ui_tab_hide_separator"), o) {
                    i = geByClass1("ui_tab_group_items", o, "div")
                        .children;
                    var d = null;
                    each(i, function(t, e) {
                        "SPAN" === e.tagName ? d = e : hasClass(domFC(e), "ui_tab_sel") || (d = null)
                    }), d && addClass(o, "ui_tab_hide_separator")
                }
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
            var i = data(t, "dummyMenu");
            i && (t = i), toggleClass(t, "shown", e)
        },
        show: function(t, e, i) {
            var s = data(t, "hidetimer");
            s && (clearTimeout(s), data(t, "hidetimer", 0));
            var o = data(t, "origMenu");
            if (o && (s = data(o, "hidetimer")) && (clearTimeout(s), data(t, "hidetimer", 0)), i && i.appendParentCls) {
                var n = geByClass1("_ui_menu", t),
                    l = domClosest("_ui_menu_wrap", t);
                if (n) {
                    var r = domClosest(i.appendParentCls, n),
                        a = getXY(r),
                        h = getXY(l),
                        u = se('<div class="' + l.className +
                            ' ui_actions_menu_dummy_wrap" onmouseover="uiActionsMenu.show(this);" onmouseout="uiActionsMenu.hide(this);"></div>');
                    u.appendChild(n), r.appendChild(u), data(t, "dummyMenu", u), data(u, "origMenu", t), t = u;
                    var d = intval(getStyle(n, "top")),
                        c = intval(getStyle(n, "left")),
                        p = intval(getStyle(n, "right")),
                        _ = {
                            top: h[1] - a[1] + d
                        };
                    if (p ? _.right = getSize(r)[0] + a[0] - h[0] - getSize(l)[0] + p : _.left = h[0] - a[0] + c, setStyle(n, _), i.processHoverCls) {
                        var v = domClosest(i.processHoverCls, l);
                        addEvent(t, "mouseover", addClass.pbind(v, "hover")), addEvent(t, "mouseout", removeClass.pbind(v, "hover"))
                    }
                }
            }
            uiActionsMenu.toggle(t, !0)
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
                    l = o.offsetTop,
                    r = geByClass1("_ui_rmenu_slider", t);
                if (!e) {
                    var a = {
                        height: n,
                        top: s ? l : 0
                    };
                    setStyle(r, a), addClass(t, "ui_rmenu_sliding")
                }
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
                l = [],
                r = [],
                a = domPN(t);
            if (s && (n += getXY(a)[1] - getXY(e)[1]), hasClass(e, "_ui_rmenu_auto_expand")) {
                var h = geByClass("_ui_rmenu_sublist", e),
                    u = hasClass(t, "_ui_rmenu_subitem") ? gpeByClass("_ui_rmenu_sublist", t) : hasClass(domNS(t), "_ui_rmenu_sublist") ? domNS(t) : !1;
                each(h, function() {
                    isVisible(this) && this !== u && (l.push(this), hide(this))
                }), u && !isVisible(u) && (r.push(u), show(u)), n = t.offsetTop, each(l, function() {
                    show(this)
                }), each(r, function() {
                    hide(this)
                })
            }
            var d = geByClass1("_ui_rmenu_slider", e),
                c = intval(d.style.top),
                p = {
                    height: o
                };
            return browser.msie_edge ? p.marginTop = n - c + "px" : p[cssTransformProp] = "translateY(" + (n - c) + "px)", setStyle(d, p), removeClass(i, "ui_rmenu_item_sel"),
                addClass(t, "ui_rmenu_item_sel"), hasClass(e, "_ui_rmenu_auto_expand") ? each(l.concat(r), function() {
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
            var e = geByClass1("ui_rmenu_item_sel", t);
            hideProgress(t), showProgress(domFC(e), "", "", !0), addClass(t, "ui_rmenu_loading")
        },
        hideProgress: function(t) {
            hasClass(t, "ui_rmenu") || (t = gpeByClass("ui_rmenu", t)), hideProgress(t);
            var e = gpeByClass("ui_rmenu", t);
            removeClass(t, "ui_rmenu_loading"), uiRightMenu.hideSliding(e)
        },
        toggleSubmenu: function(name, ref) {
            var menu = gpeByClass("ui_rmenu", ref),
                el, submenu;
            if ("string" == typeof name ? submenu = geByClass1("_ui_rmenu_" + name + "_list", menu) : (submenu = name, name = submenu.getAttribute("data-sublist-id")), el =
                geByClass1("_ui_rmenu_" + name + "_toggle", menu), !submenu) return !1;
            void 0 !== ref && uiRightMenu.hideSliding(menu), el && toggleClass(el, "ui_rmenu_item_expanded", !isVisible(submenu)), slideToggle(submenu, submenu && getSize(
                submenu)[1] ? 100 : 0);
            var onToggle = domData(el, "on-toggle");
            return onToggle && setTimeout(function() {
                eval(onToggle)
            }, 150), !1
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
            if (!browser.mobile) {
                t = uiSearch.getFieldEl(t);
                var e, i = uiSearch.getWrapEl(t),
                    s = i && domPN(i),
                    o = i && hasClass(i, "ui_search_fixed"),
                    n = cur.uiSearchPageBlock || gpeByClass("page_block", t),
                    l = getSize(ge("page_header"))[1] || 0,
                    r = i && isAncestor(i, boxLayerWrap);
                if (i && s && (r || gpeByClass("scroll_fix", i)) && (!t.ignoreFixed || o) && isVisible(s)) {
                    var a = r ? getXY(s, !0)[1] < 0 : getXY(s, !0)[1] < ge("page_header_cont")
                        .offsetHeight;
                    if (a) {
                        var h = intval(getStyle(t, "width"));
                        !o && h && (setStyle(s, "height", getSize(i)[1]), setStyle(i, "width", h), addClass(i, "ui_search_fixed"));
                        var u = Math.min(0, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(ge("page_layout"))[0]));
                        if (setStyle(i, {
                                marginLeft: u
                            }), n) {
                            var d = getXY(n)[1] + getSize(n)[1] - scrollGetY() - t.offsetHeight;
                            e = Math.min(l, Math.max(-t.offsetHeight, d)), e != cur.lastUISearchPos && (setStyle(i, "top", e), cur.lastUISearchPos = e)
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
            var s = uiSearch.getWrapEl(t),
                o = geByClass1("ui_search_fltr_control", s),
                n = {
                    start: function() {
                        addEvent(o, "click", function(t) {
                            (!hasClass(o, "shown") || hasClass(t.target, "ui_search_fltr_control")) && i(o)
                        }), addEvent(o, "mouseover", function() {
                            if (hasClass(o, "shown")) {
                                var t = data(o, "hidetimer");
                                t && (clearTimeout(t), data(o, "hidetimer", 0)), i(o, !0)
                            }
                        }), addEvent(o, "mouseout", function() {
                            var t = data(o, "hidetimer");
                            t || data(o, "hidetimer", setTimeout(function() {
                                i(o, !1), data(o, "hidetimer", 0)
                            }, 200))
                        })
                    },
                    stop: removeEvent.pbind(o, "click mouseover mouseout")
                };
            data(t, "eventHandlers", (data(t, "eventHandlers") || [])
                .concat([n])), n.start();
            var l = uiSearch._getTokensPane(t);
            addEvent(l, "click", function(e) {
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
                var l = uiSearch.getFieldEl(t),
                    r = data(l, "opts");
                r.onFilterRemoved && r.onFilterRemoved(e, l)
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
                        l = !1,
                        r = t.match(/(.*?)_([^_]+)$/),
                        a = r && r[2] || !1;
                    r = r && r[1] || !1, r && (void 0 !== o[r] && "from" === a ? l = o[r] : void 0 !== o[r] && (i = o[r] + 1), o[r] = n);
                    var h = '<div class="token" id="token' + t + '" data-id="' + t + '"><div class="token_title">' + clean(e) +
                        '</div><div class="token_del"></div></div>';
                    l !== !1 ? s.splice(l, 0, h) : i !== !1 ? s.splice(i, 0, h) : s.push(h), n++
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
                var l = s.bind(this),
                    r = this.wheel.bind(this),
                    a = "onwheel" in ce("div") ? "wheel" : void 0 !== document.onmousewheel ? "mousewheel" : browser.mozilla ? "MozMousePixelScroll" : "DOMMouseScroll";
                if (addEvent(o, a, r), addEvent(this.scrollbar, a, r), this.options.scrollElements && each(this.options.scrollElements, function(t, e) {
                        addEvent(e, a, r)
                    }), addEvent(this.scrollbar, "mouseover", this.contOver.bind(this)), addEvent(this.scrollbar, "mouseout", this.contOut.bind(this)), addEvent(this.scrollbar,
                        "mousedown", this.contDown.bind(this)), browser.safari_mobile) {
                    var h = function(t) {
                            this.isHorizontal ? cur.touchX = t.touches[0].pageX : cur.touchY = t.touches[0].pageY
                        }.bind(this),
                        u = function(t) {
                            return this.isHorizontal ? (cur.touchDiff = cur.touchX - (cur.touchX = t.touches[0].pageX), o.scrollLeft += cur.touchDiff, o.scrollLeft > 0 &&
                                this.shown !== !1 && this.update(!0)) : (cur.touchDiff = cur.touchY - (cur.touchY = t.touches[0].pageY), o.scrollTop += cur.touchDiff,
                                o.scrollTop > 0 && this.shown !== !1 && this.update(!0)), cancelEvent(t)
                        }.bind(this),
                        d = function() {
                            cur.animateInt = setInterval(function() {
                                cur.touchDiff = .9 * cur.touchDiff, cur.touchDiff < 1 && cur.touchDiff > -1 ? clearInterval(cur.animateInt) : (o[self.scrollProp] +=
                                    cur.touchDiff, this.update(!0))
                            }.bind(this), 0)
                        }.bind(this);
                    addEvent(o, "touchstart", h), addEvent(o, "touchmove", u), addEvent(o, "touchend", d), this.destroyList.push(function() {
                        removeEvent(o, "touchstart", h), removeEvent(o, "touchmove", u), removeEvent(o, "touchend", d)
                    })
                }
                addEvent(this.inner, "mousedown", this.mouseDown), this.options.nokeys ? this.onkeydown = l : addEvent(window, "keydown", l), this.destroyList.push(
                        function() {
                            removeEvent(o, a, r), this.options.scrollElements && each(this.options.scrollElements, function(t, e) {
                                removeEvent(e, a, r)
                            }), removeEvent(this.inner, "mousedown", this.mouseDown), removeEvent(window, "keydown", l), re(this.scrollbar)
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
                        .025 * (this.isHorizontal ? t.wheelDeltaX : t.wheelDeltaY), browser.mac && browser.opera && (e *= .1)) : void 0 !== t.wheelDelta ? e = .025 * t
                    .wheelDelta : t.detail && t.axis === (this.isHorizontal ? 1 : 2) && (e = -t.detail), e = e * pixelRatio * (1 == deltaMode ? pixelsPerLine : 2 ==
                        deltaMode ? pixelsPerPage : 1)) return this.obj[this.scrollProp] -= e, isFunction(this.options.onScroll) && this.options.onScroll(e, this), i !=
                    this.obj[this.scrollProp] && this.shown !== !1 && (this.update(!0), addClass(this.inner, "scrollbar_hovered"), clearTimeout(this.moveTimeout),
                        this.moveTimeout = setTimeout(function() {
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
        smoothScroll: function(t, e, i) {
            var s = this.obj.scrollTop + t;
            "undefined" == typeof i && (i = 300);
            var o = this,
                n = new Fx.Base({
                    scrollTop: this.obj.scrollTop
                }, {
                    transition: Fx.Transitions.easeOutCubic,
                    onStep: function(t) {
                        o.obj.scrollTop = t.scrollTop, o.update(!0)
                    },
                    duration: i,
                    onComplete: function() {
                        e && e(scroll)
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
                this.onListClick && this.onListClick(e, s), this.scrollNode.scrollTop < 50) {
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
        var s, o, n, l = e ? 60 : 120,
            r = this;
        t && (t = t.replace(/\u2013|\u2014/g, "-")), s = t ? this.indexer.search(t) : this.owners, r.unsortedIndex == i && r.getUnsorted && (s = r.getUnsorted(s)), o =
            this.selected;
        var a = r.invertedSelection ? !(this.sel < 0) : this.sel < 0;
        if (n = r.tpl, i && r.unsortedIndex != i) {
            var h = [];
            each(s, function() {
                var t = this[r.idIndex];
                return (!a && o[t] || a && !o[t]) && (h.push(this), h.length > e + l) ? !1 : void 0
            }), s = h
        }
        var u = s.length;
        s = s.slice(e, e + l);
        var d = [];
        if (t) {
            t = clean(t);
            var c = escapeRE(t),
                p = parseLatin(t);
            null != p && (c = c + "|" + escapeRE(p));
            var _ = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + c + "))(?![^<>]*>)(?![^&;]+;)", "gi")
        }
        var v = r.rsTpl ? r.rsTpl : function(t, e, i, s, o) {
            var n = !i && s[t[0]] || i && !s[t[0]],
                l = t[1];
            if (e) {
                l = -1 == e.indexOf(" ") ? l.split(" ") : [l];
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
                d.push(rs(n, v(this, t, r.invertedSelection, o, _)))
            }), e || d.length || d.push('<div class="no_rows">' + (t ? getLang("global_search_not_found")
                .replace("{search}", t) : r.noSelMsg) + "</div>"), re(this.moreEl), d = d.join(" "), e ? this.olistEl.appendChild(cf(d)) : val(this.olistEl, d), u > e +
            l && (this.olistEl.appendChild(this.moreEl), this.moreEl.onclick = function(i) {
                return r.renderList(t, e + l), cancelEvent(i)
            }), r.box && r.box.scroll && r.box.scroll.update(!1, !0), r.onScroll()
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
Slider.prototype.toggleLoading = function(t) {
    t = !!t, toggle(this._progressEl, t), setStyle(this._progressEl, "opacity", t ? 1 : 0)
}, Slider.prototype.destroy = function(t) {
    this.options.formatHint && (removeEvent(this._el, "mousemove", this._ev_onMouseOver), removeEvent(this._el, "mouseleave", this._ev_onMouseLeave), removeEvent(this._el,
        "mousedown", this._ev_onMouseDown)), re(this._el), re(this._currHintEl)
}, Slider.prototype._updateHint = function(t, e) {
    this._currHintEl || (this._currHintEl = se('<div class="slider_hint" id="slider_hint"></div>'), this.options.hintClass && addClass(this._currHintEl, this.options.hintClass),
        this._el.appendChild(this._currHintEl)), this._width = this._width || getSize(this._el)[0];
    var i = this._getPos(),
        s = Math.round(t.pageX - i[0]),
        o = this._width;
    if (s = e ? Math.min(Math.max(0, s), o) : s, s >= 0 && o >= s) {
        var n = s / o;
        this._currHintEl.innerHTML = this.options.formatHint ? this.options.formatHint.call(this, n) : n;
        var l = getSize(this._currHintEl);
        setStyle(this._currHintEl, {
            left: this._slideEl.offsetLeft + s - l[0] / 2,
            top: this._slideEl.offsetTop - l[1] - 10
        }), !e && this._toggleHint(!0)
    } else !e && this._toggleHint(!1);
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
    var e = this._getPos(),
        i = Math.max(t.pageX, e[0]);
    i = Math.min(i, e[0] + this._width), i -= e[0], this.setValue(i / this._width, !0, !0), this._onValueChangeDebounced ? this._onValueChangeDebounced() : this._onValueChange(),
        this._toggleHint(!0), this._updateHint(t, !0), cancelEvent(t)
}, Slider.prototype._getPos = function() {
    return this._slidePos = getXY(this._slideEl)
}, Slider.prototype.setValue = function(t, e, i) {
    if (!hasClass(this._el, "active") || i) {
        var s = 100 * t + "%";
        setStyle(this._amountEl, {
            width: s
        }), setStyle(this._handlerEl, {
            left: s
        }), i && (this._currValue = t), !e && this._onValueChange()
    }
}, Slider.prototype.setBackValue = function(t) {
    toggleClass(this._backEl, "slider_back_transition", t > this._backValue), this._backValue = t;
    var e = 100 * t + "%";
    setStyle(this._backEl, {
        width: e
    })
}, Slider.prototype._onValueChange = function() {
    this._lastValue = this._lastValue || 0, this._lastValue != this._currValue && (this._lastValue = this._currValue, this.options.onChange && this.options.onChange(this._currValue))
};
try {
    stManager.done("ui_common.js")
} catch (e) {}
