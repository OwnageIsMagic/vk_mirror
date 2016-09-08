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
        ajax.post(T, {
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
            o["case"] = D.selectedItems()[0][0];
            var s = L.selectedItems();
            s.length && (o.case_token = L.selectedItems()[0][1])
        }
        ajax.post(T, o, {
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e),
            onDone: function(e, t) {
                if (e && o.key) {
                    var s = document.querySelector(".tr_key[data-key=" + o.key + "]");
                    s && (removeClass(s, "tr_untranslated"), geByClass1("_tr_key_inner", s)
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

    function i() {
        r("")
    }

    function l(e) {
        var t = document.querySelector(".tr_key[data-key=" + e + "]");
        t = t ? domNS(t) : !1, t && (e = domData(t, "key"), r(e))
    }

    function r(e, s) {
        var i = showBox(T, {
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
            onDone: function(i, r) {
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
                                L.setData(L._selectedItems = n)
                            }, 100)
                        }
                    })
                }), E = !1, ge("tr_function_chooser") && (E = new InlineDropdown("tr_function_chooser", {
                    withArrow: !0,
                    onSelect: a
                }));
                var y = ge("tr_section_chooser");
                y && new Dropdown(y, r.sections, {
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
                }), D = L = !1;
                var f = ge("tr_case");
                if (f) {
                    var p = domData(f, "selected");
                    D = new Dropdown(f, JSON.parse(domData(f, "cases")), {
                        big: !0,
                        width: 200,
                        selectedItems: p,
                        onChange: function(e, t) {}
                    })
                }
                var k = ge("tr_case_token");
                if (k) {
                    var p = domData(k, "selected");
                    L = new Dropdown(k, [], {
                        big: !0,
                        width: 200,
                        selectedItems: p,
                        onChange: function(e, t) {}
                    })
                }
                var m = ge("tr_new_key"),
                    x = ge("tr_new_key_error");
                if (m) {
                    var b = "";
                    addEvent(m, "change input", debounce(function() {
                        var e = val(m);
                        b != e && (b = e, ajax.post(T, {
                            act: "check_new_key",
                            key: e
                        }, {
                            onDone: function(e) {
                                toggle(x, !!e)
                            }
                        }))
                    }, 200))
                }
                if (m) elfocus(m);
                else {
                    var w = geByClass("_tr_text_value"),
                        C = 3 == cur.langId ? w[1] : w[0];
                    setTimeout(function() {
                        elfocus(C), C.select()
                    })
                }
                if (r.isDeleted) i.addButton(getLang("box_restore"), function(t) {
                    _(t, e, r.editHash)
                }, "yes");
                else {
                    var B = i.addButton(e ? getLang("global_save") : getLang("tran_create_key"), function(e) {
                        o(e, r.editHash, !1, s)
                    }, "yes", !0);
                    if (e && cur.isSuperTranslator) {
                        cur.sections = r.sections;
                        var j = "<a onclick=\"TR.deleteKey('" + e + "', '" + r.editHash + "')\">" + getLang("tran_delete_key") +
                            '</a><span class="divider">|</span><a onclick="TR.cloneKey(\'' + e + "', '" + r.editHash + "')\">" + getLang("tran_copy_key") + "</a>";
                        i.setControlsText(j)
                    }
                    addEvent(window, "keydown", cur.onBoxKeyDownEvent = function(t) {
                        t.ctrlKey && t.keyCode == KEY.ENTER && o(B, r.editHash, function() {
                            boxQueue.hideAll(), l(e)
                        }, s)
                    })
                }
                i.addButton(getLang("global_cancel"), i.hide, "no")
            }
        });
        i.removeButtons(), e && !s && nav.setLoc(extend({}, nav.objLoc, {
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
        }), nav.objLoc.key && r(nav.objLoc.key)
    }

    function _(e, t, n) {
        lockButton(e), ajax.post(T, {
            act: "restore_key",
            hash: n,
            key: t
        }, {
            onDone: function() {
                boxQueue.hideAll(), r(t)
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
                lockButton(n), ajax.post(T, {
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
            trim(a) && (lockButton(n), ajax.post(T, {
                act: "clone_key",
                hash: t,
                key: e,
                new_key: a,
                move: intval(hasClass(ge("tr_clone_box_move_checkbox"), "on")),
                with_log: intval(hasClass(ge("tr_clone_box_save_log_checkbox"), "on"))
            }, {
                onDone: function() {
                    boxQueue.hideAll(), r(a)
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
        var t = showBox(T, {
            act: "edit_translator_box",
            translator_id: e
        }, {
            params: {
                bodyStyle: "padding: 25px; overflow: hidden;",
                width: 430
            },
            onDone: function(t, n) {
                function a(e) {
                    ajax.post(T, {
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
                    i = domData(o, "selected"),
                    l = ge("tr_to_lang_selector"),
                    r = JSON.parse(domData(l, "langs")),
                    c = domData(l, "selected");
                o = new Dropdown(o, s, {
                    big: !0,
                    width: 130,
                    autocomplete: !0,
                    selectedItems: i,
                    onChange: function(e) {}
                }), o.disable(!!e), l = new Dropdown(l, r, {
                    big: !0,
                    width: 180,
                    autocomplete: !0,
                    selectedItems: c,
                    onChange: function(e) {}
                }), l.disable(!!e);
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
                    _ ? (a.translator_id = domData(_, "user-id"), a.is_add = 1) : a.translator_id = e, a.translator_id && (a.lang_id = l.selectedItems()[0][0],
                        a.parent_lang_id = o.selectedItems()[0][0], a.is_coordinator = intval(hasClass(geByClass1("tr_translator_is_coordinator"), "on")),
                        ajax.post(T, a, {
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
        showProgress(domPN(e), "", "tr_translator_bottom_progress"), hide(e), ajax.post(T, {
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
            i = domData(o, "selected");
        t = new Dropdown(t, n, {
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
            selectedItems: i,
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

    function x(e) {
        var t = cur.languages;
        e && (t = cur.languagesIndex.search(e));
        var n = "";
        each(t, function(e, t) {
                n += getTemplate("lang_row", t)
            }), geByClass1("tr_languages_list")
            .innerHTML = n
    }

    function b(e, t, n) {
        if ("click" != e.type || e.altKey || n) {
            var a = curBox();
            a && "key-edit-dialog" == a.bodyNode.children[0].id && a.hide();
            var o = "lang_" == t.id.substr(0, 5) ? t.id.substr(5) : t.id;
            return r(o, t), cancelEvent(e)
        }
    }

    function w() {
        setCookie(I, C() ? "" : "1", 360), nav.reload({
            force: !0
        })
    }

    function C() {
        return !!getCookie(I)
    }

    function B(e, t, n, a, o) {
        if (checkEvent(e)) return !0;
        var s = C() ? "Disable inline translation" : "Enable inline translation",
            i = "",
            l = "",
            r = (t || "")
            .split(",");
        r = r[0] || 0, r && (i = "");
        showFastBox({
                title: "Select option",
                width: 300,
                bodyStyle: "padding: 0px",
                dark: 1,
                flatButtons: !0,
                onClean: function() {
                    cleanElems("translation_toggle", "translation_to_page", "translation_show_all")
                }
            }, l + '      <div class="translation_box">        <div class="button_blue flat_button" id="translation_toggle">' + s + "</div>        " + i +
            '        <a class="button_link" href="/translation">          <div class="flat_button secondary" id="translation_to_page">Go to translation page</div>        </a>        <a id="show_untranslated" class="button_link" href="/translation?section_id=untranslated">          <div class="flat_button secondary" id="">Show untranslated phrases</div>        </a>        <div class="help">          <a href="/club16000">Help</a>         </div>      </div>'
        );
        return ge("translation_toggle")
            .onclick = w, ge("translation_to_page")
            .onclick = function() {}, !1
    }
    var D, L, E, j, T = "al_translations.php",
        I = "remixinline_trans";
    e.TR = {
        openKey: r,
        newKey: i,
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
        searchLang: debounce(x, 50),
        t: b,
        menu: B
    }
}(window);
try {
    stManager.done("translation.js")
} catch (e) {}
