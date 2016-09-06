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
            n = !1,
            a = "";
        each(e, function(o) {
            addEvent(this, "input change", function(s) {
                var r = val(this);
                if (n || val(t[o], r), a != val(e[0])) {
                    a = val(e[0]);
                    var i = a.match(/(\{[a-zA-Z_]+\})/g) || [],
                        l = [];
                    each(i, function(e, t) {
                        l.push([e, t])
                    }), setTimeout(function() {
                        C.setData(l)
                    }, 100)
                }
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
        ajax.post(L, {
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
        o.lang_id = intval(void 0 !== nav.objLoc.lang_id ? nav.objLoc.lang_id : cur.langId), o.key = val("tr_new_key") || val("tr_key_input"), B && (o.function_type = B.getSelected()[
                0]), o.lang_ids = [], each(geByClass("_tr_key_edit_wrap"), function() {
                var e = domData(this, "lang-id"),
                    t = [];
                each(geByClass("_tr_text_value", this), function() {
                    t.push(val(this))
                }), t = t.length > 1 ? "@@" + t.join("@") : t[0], o["Value_" + e] = t, o.lang_ids.push(e)
            }), o.lang_ids = o.lang_ids.join(","), o.description = val("tr_description_edit"), o.extended_wiki = intval(hasClass("tr_extra_wiki", "on")), o.disable_inline = intval(
                hasClass("tr_extra_disable_inline", "on")), o["export"] = intval(hasClass("tr_extra_export_to_js", "on")), o.has_case = intval(hasClass("tr_extra_case", "on")), o.mark_untranslated =
            intval(hasClass("tr_extra_mark_as_untranslated", "on")), o.has_case && (o["case"] = b.selectedItems()[0][0], o.case_token = C.selectedItems()[0][1]), ajax.post(L, o, {
                showProgress: lockButton.pbind(e),
                hideProgress: unlockButton.pbind(e),
                onDone: function(e, t) {
                    if (e && o.key) {
                        var s = document.querySelector(".tr_key[data-key=" + o.key + "]");
                        s && (removeClass(s, "tr_untranslated"), geByClass1("_tr_key_inner", s)
                            .innerHTML = e), a && (a.innerHTML = t, a.className = "translated")
                    } else nav.reload();
                    boxQueue.hideAll(), n && n(e)
                }
            })
    }

    function s(e) {
        toggle(geByClass1("_tr_case_controls"), e)
    }

    function r() {
        l("")
    }

    function i(e) {
        var t = document.querySelector(".tr_key[data-key=" + e + "]");
        t = t ? domNS(t) : !1, t && (e = domData(t, "key"), l(e))
    }

    function l(e, s) {
        var r = showBox(L, {
            act: "open_key",
            key: e,
            lang_id: intval(nav.objLoc.lang_id),
            section_id: intval(nav.objLoc.section)
        }, {
            params: {
                bodyStyle: "padding: 20px 0 0; overflow: hidden;",
                width: 550,
                onHide: function() {
                    nav.setLoc(extend({}, nav.objLoc, {
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
                B = !1, ge("tr_function_chooser") && (B = new InlineDropdown("tr_function_chooser", {
                    withArrow: !0,
                    onSelect: a
                }));
                var g = ge("tr_section_chooser");
                g && new Dropdown(g, l.sections, {
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
                }), b = C = !1;
                var h = ge("tr_case");
                h && (b = new Dropdown(h, JSON.parse(domData(h, "cases")), {
                    big: !0,
                    width: 200,
                    onChange: function(e, t) {}
                }));
                var v = ge("tr_case_token");
                v && (C = new Dropdown(v, [], {
                    big: !0,
                    width: 200,
                    onChange: function(e, t) {}
                }));
                var y = ge("tr_new_key"),
                    f = ge("tr_new_key_error");
                if (y) {
                    var p = "";
                    addEvent(y, "change input", debounce(function() {
                        var e = val(y);
                        p != e && (p = e, ajax.post(L, {
                            act: "check_new_key",
                            key: e
                        }, {
                            onDone: function(e) {
                                toggle(f, !!e)
                            }
                        }))
                    }, 200))
                }
                if (y) elfocus(y);
                else {
                    var k = geByClass("_tr_text_value"),
                        x = 3 == cur.langId ? k[1] : k[0];
                    setTimeout(function() {
                        elfocus(x), x.select()
                    })
                }
                if (l.isDeleted) r.addButton(getLang("box_restore"), function(t) {
                    _(t, e, l.editHash)
                }, "yes");
                else {
                    var m = r.addButton(e ? getLang("global_save") : getLang("tran_create_key"), function(e) {
                        o(e, l.editHash, !1, s)
                    }, "yes", !0);
                    if (e && cur.isSuperTranslator) {
                        cur.sections = l.sections;
                        var w = "<a onclick=\"TR.deleteKey('" + e + "', '" + l.editHash + "')\">" + getLang("tran_delete_key") +
                            '</a><span class="divider">|</span><a onclick="TR.cloneKey(\'' + e + "', '" + l.editHash + "')\">" + getLang("tran_copy_key") + "</a>";
                        r.setControlsText(w)
                    }
                    addEvent(window, "keydown", cur.onBoxKeyDownEvent = function(t) {
                        t.ctrlKey && t.keyCode == KEY.ENTER && o(m, l.editHash, function() {
                            boxQueue.hideAll(), i(e)
                        }, s)
                    })
                }
                r.addButton(getLang("global_cancel"), r.hide, "no")
            }
        });
        r.removeButtons(), e && nav.setLoc(extend({}, nav.objLoc, {
            key: e
        }))
    }

    function c() {
        var e = ge("tr_keys_lang_selector"),
            t = JSON.parse(domData(e, "langs"));
        D = new Dropdown(e, t, {
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
        }), nav.objLoc.key && l(nav.objLoc.key)
    }

    function _(e, t, n) {
        lockButton(e), ajax.post(L, {
            act: "restore_key",
            hash: n,
            key: t
        }, {
            onDone: function() {
                boxQueue.hideAll(), l(t)
            }
        })
    }

    function d(e) {
        showFastBox({
                title: getLang("tran_delete_box_title"),
                bodyStyle: "padding: 20px; line-height: 160%;",
                dark: 1,
                forceNoBtn: 1
            }, getLang("tran_delete_key_text")
            .replace(/{key}/, e), getLang("box_yes"),
            function(t) {
                lockButton(t), ajax.post(L, {
                    act: "delete_key",
                    hash: hash,
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
            trim(a) && (lockButton(n), ajax.post(L, {
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
        var n = {
            search: t ? t : null
        };
        t && (n.section = !1), nav.change(n)
    }

    function h(e) {
        var t = showBox(L, {
            act: "edit_translator_box",
            translator_id: e
        }, {
            params: {
                bodyStyle: "padding: 25px; overflow: hidden;",
                width: 430
            },
            onDone: function(t, n) {
                function a(e) {
                    ajax.post(L, {
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
                        ajax.post(L, a, {
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
        showProgress(domPN(e), "", "tr_translator_bottom_progress"), hide(e), ajax.post(L, {
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

    function x(e) {
        cur.languages = e, cur.languagesIndex = new vkIndexer(e, function(e) {
            return e.name_rus + " " + e.name_eng + " " + e.name_native
        })
    }

    function m(e) {
        var t = cur.languages;
        e && (t = cur.languagesIndex.search(e));
        var n = "";
        each(t, function(e, t) {
                n += getTemplate("lang_row", t)
            }), geByClass1("tr_languages_list")
            .innerHTML = n
    }

    function w(e, t, n) {
        if ("click" != e.type || e.altKey || n) {
            var a = curBox();
            a && "key-edit-dialog" == a.bodyNode.children[0].id && a.hide();
            var o = "lang_" == t.id.substr(0, 5) ? t.id.substr(5) : t.id;
            return l(o, t), cancelEvent(e)
        }
    }
    var b, C, B, D, L = "al_translations.php";
    e.TR = {
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
        initLanguagesPage: x,
        searchLang: debounce(m, 50),
        t: w
    }
}(window);
try {
    stManager.done("translation.js")
} catch (e) {}
