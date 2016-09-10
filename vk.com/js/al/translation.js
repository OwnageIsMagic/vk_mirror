! function(e) {
    function t() {
        each(geByClass("_tr_text_value"), function() {
            autosizeSetup(this, {
                minHeight: 50,
                maxHeight: 450
            })
        })
    }

    function n() {
        var e = geByClass("_tr_text_value", geByClass("_tr_key_edit_wrap")[0]),
            t = geByClass("_tr_text_value", geByClass("_tr_key_edit_wrap")[1]),
            n = !1;
        each(e, function(e) {
            addEvent(this, "input change", function(a) {
                var o = val(this);
                n || val(t[e], o)
            })
        }), each(t, function() {
            addEvent(this, "input change", function() {
                n = !0
            }), addEvent(this, "focus", function() {
                n || this.select()
            })
        })
    }

    function a(e) {
        ajax.post(S, {
            act: "function_type",
            function_type: e
        }, {
            onDone: function(e, n) {
                var a = geByClass("_tr_key_edit_wrap"),
                    o = [],
                    s = [];
                each(geByClass("_tr_text_value", a[0]), function() {
                    o.push(val(this))
                }), each(geByClass("_tr_text_value", a[1]), function() {
                    s.push(val(this))
                }), e = se(e), n = se(n), each(geByClass("_tr_text_value", e), function(e) {
                    val(this, e < o.length ? o[e] : "")
                }), each(geByClass("_tr_text_value", n), function(e) {
                    val(this, e < s.length ? s[e] : "")
                }), domReplaceEl(a[0], e), domReplaceEl(a[1], n), t()
            }
        })
    }

    function o(e, t, n, a) {
        var o = {
            act: "save_key",
            hash: t
        };
        if (o.lang_id = intval(void 0 !== nav.objLoc.lang_id ? nav.objLoc.lang_id : cur.langId), o.key = val("tr_new_key") || val("tr_key_input"), E && (o.function_type = E.getSelected()[
                0]), o.lang_ids = [], each(geByClass("_tr_key_edit_wrap"), function() {
                var e = domData(this, "lang-id"),
                    t = [];
                each(geByClass("_tr_text_value", this), function() {
                    t.push(val(this))
                }), t = t.length > 1 ? "@@" + t.join("@") : t[0], o["Value_" + e] = t, o.lang_ids.push(e)
            }), o.lang_ids = o.lang_ids.join(","), o.description = val("tr_description_edit"), o.extended_wiki = intval(hasClass("tr_extra_wiki", "on")), o.disable_inline = intval(
                hasClass("tr_extra_disable_inline", "on")), o["export"] = intval(hasClass("tr_extra_export_to_js", "on")), o.has_case = intval(hasClass("tr_extra_case", "on")), o.mark_untranslated =
            intval(hasClass("tr_extra_mark_as_untranslated", "on")), o.has_case) {
            o["case"] = L.selectedItems()[0][0];
            var s = T.selectedItems();
            s.length && (o.case_token = T.selectedItems()[0][1])
        }
        ajax.post(S, o, {
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e),
            onDone: function(e, t, s) {
                if (s) {
                    each(s[0], function(e, t) {
                        e = e.substr(1);
                        var n = ge("tr_section_counter_" + e);
                        n && (t[0] ? n.innerHTML = "+" + t[0] : n.innerHTML = "")
                    });
                    var r = ge("tr_section_counter_total");
                    s[1] ? r.innerHTML = "+" + s[1] : r.innerHTML = ""
                }
                if (e && o.key) {
                    var i = document.querySelector(".tr_key[data-key=" + o.key + "]");
                    i && (removeClass(i, "tr_untranslated"), geByClass1("_tr_key_inner", i)
                        .innerHTML = e), a && (a.innerHTML = t, a.className = "translated")
                } else nav.reload();
                boxQueue.hideAll(), n && n(e), o.mark_untranslated && nav.reload()
            }
        })
    }

    function s(e) {
        if (toggle(geByClass1("_tr_case_controls"), e), e) {
            var t = geByClass("_tr_text_value", geByClass("_tr_key_edit_wrap")[0]);
            t.length && triggerEvent(t[0], "change")
        }
    }

    function r() {
        l("")
    }

    function i(e) {
        var t = document.querySelector(".tr_key[data-key=" + e + "]");
        t = t ? domNS(t) : !1, t && (e = domData(t, "key"), l(e))
    }

    function l(e, s) {
        var r = showBox(S, {
            act: "open_key",
            key: e,
            lang_id: intval(nav.objLoc.lang_id),
            section_id: intval(nav.objLoc.section)
        }, {
            params: {
                bodyStyle: "padding: 20px 0 0; overflow: hidden;",
                width: 550,
                onHide: function() {
                    s || nav.setLoc(extend({}, nav.objLoc, {
                        key: null
                    })), cur.onBoxKeyDownEvent && removeEvent(window, "keydown", cur.onBoxKeyDownEvent)
                }
            },
            onDone: function(r, l) {
                if (t(), e || n(), e) {
                    var c = geByClass1("_tr_history_rows"),
                        d = geByClass1("_tr_history_resizer");
                    if (getSize(c)[1] >= c.scrollHeight) re(d), setStyle(geByClass1("_tr_history_rows"), "height", "inherit");
                    else {
                        var u, d = geByClass1("_tr_history_resizer");
                        addEvent(d, "mousedown", function(e) {
                            var t = getXY(c);
                            return u && removeEvent(window, "mousemove", u), addEvent(window, "mousemove", u = function(e) {
                                setStyle(c, {
                                    height: Math.min(c.scrollHeight, Math.max(50, e.pageY - t[1]))
                                })
                            }), addEvent(window, "mouseup", function(e) {
                                removeEvent(window, "mousemove", u)
                            }), cancelEvent(e)
                        })
                    }
                }
                var g = geByClass("_tr_text_value", geByClass("_tr_key_edit_wrap")[0]),
                    h = "",
                    v = !1;
                each(g, function(e) {
                    addEvent(this, "input change", function(e) {
                        if (h != val(g[0])) {
                            h = val(g[0]);
                            var t = h.match(/(\{[a-zA-Z_]+\})/g) || [],
                                n = [];
                            each(t, function(e, t) {
                                n.push([e, t])
                            }), clearTimeout(v), v = setTimeout(function() {
                                T.setData(T._selectedItems = n)
                            }, 100)
                        }
                    })
                }), E = !1, ge("tr_function_chooser") && (E = new InlineDropdown("tr_function_chooser", {
                    withArrow: !0,
                    onSelect: a
                }));
                var y = ge("tr_section_chooser");
                y && new Dropdown(y, l.sections, {
                    big: !0,
                    selectedItems: intval(nav.objLoc.section),
                    onChange: function(e, t) {
                        var n = ge("tr_new_key"),
                            a = val(n)
                            .split("_")
                            .slice(1)
                            .join("_");
                        val(n, t[3] + "_" + a)
                    }
                }), L = T = !1;
                var f = ge("tr_case");
                if (f) {
                    var p = domData(f, "selected");
                    L = new Dropdown(f, JSON.parse(domData(f, "cases")), {
                        big: !0,
                        width: 200,
                        selectedItems: p,
                        onChange: function(e, t) {}
                    })
                }
                var k = ge("tr_case_token");
                if (k) {
                    var p = domData(k, "selected");
                    T = new Dropdown(k, [], {
                        big: !0,
                        width: 200,
                        selectedItems: p,
                        onChange: function(e, t) {}
                    })
                }
                var m = ge("tr_new_key"),
                    w = ge("tr_new_key_error");
                if (m) {
                    var x = "";
                    addEvent(m, "change input", debounce(function() {
                        var e = val(m);
                        x != e && (x = e, ajax.post(S, {
                            act: "check_new_key",
                            key: e
                        }, {
                            onDone: function(e) {
                                toggle(w, !!e)
                            }
                        }))
                    }, 200))
                }
                if (m) elfocus(m);
                else {
                    var b = geByClass1("_tr_text_value");
                    setTimeout(function() {
                        elfocus(b), b.select()
                    })
                }
                if (l.isDeleted) r.addButton(getLang("box_restore"), function(t) {
                    _(t, e, l.editHash)
                }, "yes");
                else {
                    var C = r.addButton(e ? getLang("global_save") : getLang("tran_create_key"), function(e) {
                        o(e, l.editHash, !1, s)
                    }, "yes", !0);
                    if (e && cur.isSuperTranslator) {
                        cur.sections = l.sections;
                        var B = "<a onclick=\"TR.deleteKey('" + e + "', '" + l.editHash + "')\">" + getLang("tran_delete_key") +
                            '</a><span class="divider">|</span><a onclick="TR.cloneKey(\'' + e + "', '" + l.editHash + "')\">" + getLang("tran_copy_key") + "</a>";
                        r.setControlsText(B)
                    }
                    addEvent(window, "keydown", cur.onBoxKeyDownEvent = function(t) {
                        t.ctrlKey && t.keyCode == KEY.ENTER && o(C, l.editHash, function() {
                            boxQueue.hideAll(), i(e)
                        }, s)
                    })
                }
                r.addButton(getLang("global_cancel"), r.hide, "no")
            }
        });
        r.removeButtons(), e && !s && nav.setLoc(extend({}, nav.objLoc, {
            key: e
        }))
    }

    function c() {
        var e = ge("tr_keys_lang_selector"),
            t = JSON.parse(domData(e, "langs"));
        j = new Dropdown(e, t, {
                big: !0,
                width: 190,
                placeholder: t[0][1],
                autocomplete: !0,
                selectedItems: nav.objLoc.lang_id || cur.langId,
                onChange: function(e) {
                    e = e || 0, nav.change({
                        lang_id: e
                    })
                }
            }), nav.objLoc.key && l(nav.objLoc.key), ge("tr_keys_search")
            .select()
    }

    function _(e, t, n) {
        lockButton(e), ajax.post(S, {
            act: "restore_key",
            hash: n,
            key: t
        }, {
            onDone: function() {
                boxQueue.hideAll(), l(t)
            }
        })
    }

    function d(e, t) {
        showFastBox({
                title: getLang("tran_delete_box_title"),
                bodyStyle: "padding: 20px; line-height: 160%;",
                dark: 1,
                forceNoBtn: 1
            }, getLang("tran_delete_key_text")
            .replace(/{key}/, e), getLang("box_yes"),
            function(n) {
                lockButton(n), ajax.post(S, {
                    act: "delete_key",
                    hash: t,
                    key: e
                }, {
                    onDone: function() {
                        boxQueue.hideAll()
                    }
                })
            }, getLang("box_no"))
    }

    function u(e, t) {
        var n = '<div class="tr_clone_box"><h4 class="subheader">' + getLang("tran_clone_box_new_key_label") +
            '</h4><input id="tr_clone_box_section_sel" /><input class="tr_clone_box_key dark text" id="tr_clone_box_key" type="text" /><div id="tr_clone_box_move_checkbox" class="checkbox" onclick="checkbox(this)">' +
            getLang("tran_move_key_checkbox") + '</div><div id="tr_clone_box_save_log_checkbox" class="checkbox" onclick="checkbox(this)">' + getLang("tran_save_log_key_checkbox") +
            "</div></div>";
        showFastBox({
            title: getLang("tran_clone_key_box_title"),
            bodyStyle: "padding: 20px; line-height: 160%;",
            dark: 1,
            forceNoBtn: 1,
            width: 450,
            onShow: function() {
                new Dropdown(ge("tr_clone_box_section_sel"), cur.sections, {
                    big: !0,
                    autocomplete: !0,
                    onChange: function(e, t) {
                        var n = ge("tr_clone_box_key"),
                            a = val(n)
                            .split("_")
                            .slice(1)
                            .join("_");
                        val(n, t[3] + "_" + a)
                    }
                })
            }
        }, n, getLang("box_save"), function(n) {
            var a = val("tr_clone_box_key");
            trim(a) && (lockButton(n), ajax.post(S, {
                act: "clone_key",
                hash: t,
                key: e,
                new_key: a,
                move: intval(hasClass(ge("tr_clone_box_move_checkbox"), "on")),
                with_log: intval(hasClass(ge("tr_clone_box_save_log_checkbox"), "on"))
            }, {
                onDone: function() {
                    boxQueue.hideAll(), l(a)
                }
            }))
        }, getLang("box_cancel"))
    }

    function g(e, t) {
        t = trim(t);
        var n = {
            search: t ? t : null
        };
        t && (n.section = !1), nav.change(n)
    }

    function h(e) {
        var t = showBox(S, {
            act: "edit_translator_box",
            translator_id: e
        }, {
            params: {
                bodyStyle: "padding: 25px; overflow: hidden;",
                width: 430
            },
            onDone: function(t, n) {
                function a(e) {
                    ajax.post(S, {
                        act: "check_mem_link",
                        link: e
                    }, {
                        onDone: function(e, t, n) {
                            re(geByClass1("tr_mem_ava")), e ? (domPN(_)
                                .appendChild(se('<a href="' + n + '" class="tr_mem_ava ow_ava ow_ava_small" style="background-image: url(\'' + t +
                                    "')\"></a>")), domData(_, "user-id", e)) : domData(_, "user-id", null)
                        }
                    })
                }
                var o = ge("tr_from_lang_selector"),
                    s = JSON.parse(domData(o, "langs")),
                    r = domData(o, "selected"),
                    i = ge("tr_to_lang_selector"),
                    l = JSON.parse(domData(i, "langs")),
                    c = domData(i, "selected");
                o = new Dropdown(o, s, {
                    big: !0,
                    width: 130,
                    autocomplete: !0,
                    selectedItems: r,
                    onChange: function(e) {}
                }), o.disable(!!e), i = new Dropdown(i, l, {
                    big: !0,
                    width: 180,
                    autocomplete: !0,
                    selectedItems: c,
                    onChange: function(e) {}
                }), i.disable(!!e);
                var _ = geByClass1("tr_translator_link");
                if (_) {
                    a = debounce(a, 200);
                    var d = "";
                    addEvent(_, "change input", function() {
                        var e = val(_);
                        e != d && (d = e, a(e))
                    })
                }
                t.addButton(getLang("global_save"), function(t) {
                    var a = {
                        act: "save_translator",
                        hash: n.hash
                    };
                    _ ? (a.translator_id = domData(_, "user-id"), a.is_add = 1) : a.translator_id = e, a.translator_id && (a.lang_id = i.selectedItems()[0][0],
                        a.parent_lang_id = o.selectedItems()[0][0], a.is_coordinator = intval(hasClass(geByClass1("tr_translator_is_coordinator"), "on")),
                        ajax.post(S, a, {
                            showProgress: lockButton.pbind(t),
                            hideProgress: unlockButton.pbind(t),
                            onDone: function() {
                                var e = curBox();
                                e && e.hide(), nav.reload()
                            }
                        }))
                }, "yes", !0);
                t.addButton(getLang("global_cancel"), t.hide, "no"), e && t.setControlsText('<a onclick="TR.deleteTranslator(this, ' + e + ", '" + n.hash + "')\">" +
                    getLang("global_delete") + "</a>")
            }
        });
        t.removeButtons()
    }

    function v(e, t, n) {
        showProgress(domPN(e), "", "tr_translator_bottom_progress"), hide(e), ajax.post(S, {
            act: "delete_translator",
            translator_id: t,
            hash: n
        }, {
            onDone: function() {
                var e = curBox();
                e && e.hide(), nav.reload()
            }
        })
    }

    function y() {
        h()
    }

    function f(e) {
        cur.translatorsList = e, cur.translatorsIndex = new vkIndexer(e, function(e) {
            return e.raw_name
        });
        var t = ge("tr_translators_stat_date_selector"),
            n = JSON.parse(domData(t, "dates")),
            a = domData(t, "selected"),
            o = ge("tr_translators_language_selector"),
            s = JSON.parse(domData(o, "langs")),
            r = domData(o, "selected");
        I = new Dropdown(t, n, {
            big: !0,
            width: 200,
            selectedItems: a,
            onChange: function(e) {
                nav.change({
                    stat_date: e
                })
            }
        }), o = new Dropdown(o, s, {
            big: !0,
            width: 200,
            autocomplete: !0,
            placeholder: s[0][1],
            selectedItems: r,
            onChange: function(e) {
                "" !== e && nav.change({
                    lang_id: -1 == e ? null : e
                })
            }
        })
    }

    function p(e) {
        var t = toggleClass(domFC(e), "on");
        setTimeout(function() {
            nav.change({
                coordinators: t ? 1 : null
            })
        })
    }

    function k(e) {
        e = trim(e);
        var t = cur.translatorsList;
        e && (t = cur.translatorsIndex.search(e));
        var n = "";
        each(t, function(e, t) {
                n += getTemplate("translator_row", t)
            }), geByClass1("tr_translators")
            .innerHTML = n
    }

    function m(e) {
        cur.languages = e, cur.languagesIndex = new vkIndexer(e, function(e) {
            return e.name_rus + " " + e.name_eng + " " + e.name_native
        })
    }

    function w(e) {
        var t = cur.languages;
        e && (t = cur.languagesIndex.search(e));
        var n = "";
        each(t, function(e, t) {
                n += getTemplate("lang_row", t)
            }), geByClass1("tr_languages_list")
            .innerHTML = n
    }

    function x(e, t, n) {
        if ("click" != e.type || e.altKey || n) {
            var a = curBox();
            a && "key-edit-dialog" == a.bodyNode.children[0].id && a.hide();
            var o = "lang_" == t.id.substr(0, 5) ? t.id.substr(5) : t.id;
            return l(o, t), cancelEvent(e)
        }
    }

    function b() {
        setCookie(H, C() ? "" : "1", 360), nav.reload({
            force: !0
        })
    }

    function C() {
        return !!getCookie(H)
    }

    function B(e, t, n, a, o) {
        if (checkEvent(e)) return !0;
        var s = C() ? "Disable inline translation" : "Enable inline translation",
            r = "",
            i = "",
            l = (t || "")
            .split(",");
        l = l[0] || 0, l && (r = "");
        showFastBox({
                title: "Select option",
                width: 300,
                bodyStyle: "padding: 0px",
                dark: 1,
                flatButtons: !0,
                onClean: function() {
                    cleanElems("translation_toggle", "translation_to_page", "translation_show_all")
                }
            }, i + '      <div class="translation_box">        <div class="button_blue flat_button" id="translation_toggle">' + s + "</div>        " + r +
            '        <a class="button_link" href="/translation">          <div class="flat_button secondary" id="translation_to_page">Go to translation page</div>        </a>        <a id="show_untranslated" class="button_link" href="/translation?section_id=untranslated">          <div class="flat_button secondary" id="">Show untranslated phrases</div>        </a>        <div class="help">          <a href="/club16000">Help</a>         </div>      </div>'
        );
        return ge("translation_toggle")
            .onclick = b, ge("translation_to_page")
            .onclick = function() {}, !1
    }

    function D(e) {
        var t = I.selectedItems()[0][0];
        showBox(S, {
            act: "show_translator_log",
            translator_id: e,
            date: t
        }, {
            params: {
                width: 550
            }
        })
    }
    var L, T, E, j, I, S = "al_translations.php",
        H = "remixinline_trans";
    e.TR = {
        showTranslatorTranslations: D,
        openKey: l,
        newKey: r,
        hasCaseChanged: s,
        initTranslationsPage: c,
        initTranslatorsPage: f,
        searchKey: g,
        deleteKey: d,
        cloneKey: u,
        editTranslator: h,
        deleteTranslator: v,
        addTranslator: y,
        toggleCoordinatorsOnly: p,
        searchTranslators: debounce(k, 50),
        initLanguagesPage: m,
        searchLang: debounce(w, 50),
        t: x,
        menu: B
    }
}(window);
try {
    stManager.done("translation.js")
} catch (e) {}
