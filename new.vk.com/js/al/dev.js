var Dev = {
    init: function(e) {
        cur.searchEl = ge("dev_top_input"), cur.nav.push(function(e, t, r) {
            if (("dev" == t[0] || "dev/" == t[0]) && !t.act || "dev" !== t[0].substr(0, 3)) return !0;
            if ("dev/" == r[0].substr(0, 4) || "dev" == r[0] && r.act && cur.page) {
                var a = r[0].substr(4);
                if (a) return Dev.switchPage(a, r.edit, r), !1
            }
        });
        var t = function(e) {
            if (cur.edit && 83 == e.keyCode && (e.ctrlKey || e.metaKey)) {
                var t = ge("dev_save_button");
                return t.click(), cancelEvent(e)
            }
            e.keyCode == KEY.RETURN && hasClass(e.target, "dev_param_field") && ge("dev_req_run_btn")
                .click()
        };
        Dev.scrollnode = browser.msie6 ? pageNode : window, window.scrollTop = bodyNode.scrollTop = pageNode.scrollTop = htmlNode.scrollTop = 0, addEvent(document,
            "keydown", t), addEvent(Dev.scrollnode, "scroll", Dev.scrollCheck), addEvent(window, "resize", Dev.onResize), setTimeout(Dev.scrollCheck, 50), cur.destroy.push(
            function() {
                removeEvent(document, "keydown", t), removeEvent(Dev.scrollnode, "scroll", Dev.scrollCheck), removeEvent(window, "resize", Dev.onResize)
            }), Dev.initPage(e), Dev.initSuggestions(), Dev.onResize(), placeholderSetup("dev_top_input"), cur.verDD && Dev.checkMethodParams()
    },
    initPage: function(e) {
        if (e.edit) {
            var t = ge("dev_method_desc");
            placeholderSetup(t, {
                back: !0
            });
            var r = ge("dev_edit_simular");
            placeholderSetup(r, {
                back: !0
            });
            var a = geByClass("dev_textarea", ge("dev_page"));
            for (var s in a) autosizeSetup(a[s], {});
            elfocus(t)
        }
        if (e.res && Dev.requestResult(parseJSON(e.res)), extend(cur, e), cur.editors = [], e.editors)
            for (var s in e.editors) {
                var o = e.editors[s];
                cur.initEdit.apply(cur.initEdit, o)
            }
        this.checkBlockHeight(), this.scrollToAnchor()
    },
    checkBlockHeight: function() {
        var e = ge("dev_left_nav"),
            t = ge("dev_page_wrap1"),
            r = t && geByClass1("dev_page_block", t) || t;
        if (e && r && !geByClass1("no_min_height", r)) {
            var a = getSize(e),
                s = getSize(t),
                o = intval(getStyle(r, "paddingTop")),
                n = intval(getStyle(r, "paddingBottom"));
            s[1] < a[1] && setStyle(r, {
                minHeight: a[1] - o - n
            }), onBodyResize(!0)
        }
    },
    diselectLeftNav: function() {
        var e = geByClass1("nav_selected", "dev_left_nav");
        if (e) {
            removeClass(e, "nav_selected");
            var t = e.id.replace("dev_mlist_", ""),
                r = ge("dev_mlist_submenu_" + t);
            r ? hide(r) : hide(e.parentNode)
        }
    },
    setLeftNav: function(e) {
        if ("null" == e) return void Dev.diselectLeftNav();
        var t = ge("dev_mlist_" + e);
        if (t) {
            var r = ge("dev_mlist_submenu_" + e);
            r ? show(r) : geByClass1("nav_selected", t.parentNode) || (addClass(t, "nav_selected"), show(t.parentNode))
        }
    },
    animLeftNav: function(e, t) {
        var r = ge("dev_left_nav");
        if (r && t) {
            var a, s, o = ge("dev_left_nav_mark"),
                n = e && e.offsetTop || 0,
                i = e ? hasClass(e, "submenu") ? domPN(e) : domNS(e) : !1,
                l = t ? hasClass(t, "submenu") ? domPN(t) : domNS(t) : !1;
            i !== l && (hide(i), show(l)), e && (a = t.offsetTop || 0, s = a != n ? intval(30 * Math.log(Math.abs(a - n) / 5)) : 0, setStyle(o, {
                height: getSize(e)[1],
                top: n
            }), addClass(r, "anim"), animate(o, {
                height: getSize(t)[1],
                top: a
            }, {
                duration: s,
                transition: Fx.Transitions.easeOutCirc,
                onComplete: function() {
                    removeClass(r, "anim"), setStyle(o, {
                        display: ""
                    })
                }
            }), i && i !== l && (show(i), slideUp(i, s)), l && i !== l && (hide(l), slideDown(l, s)))
        }
    },
    onResize: function() {
        var e = ge("dev_left_nav"),
            t = ge("dev_page_acts"),
            r = function(e) {
                "fixed" == getStyle(e, "position") && (setStyle(e, {
                    position: "relative"
                }), e.offsetLeft, setStyle(e, {
                    position: "fixed"
                }))
            };
        e && (r(e), setTimeout(r.pbind(e), 0)), t && (r(t), setTimeout(r.pbind(t), 0)), Dev.scrollCheck()
    },
    scrollCheck: function() {
        var e = geByClass1("dev_left_nav_wrap");
        if (!e) return !1;
        var t, r, a = window.lastWindowHeight || 0,
            s = Math.min(scrollGetY(), bodyNode.clientHeight - a),
            o = 0,
            n = ge("dev_top_nav_wrap"),
            i = getSize(n)[1],
            l = ge("dev_footer_wrap"),
            c = isVisible(l) ? getSize(l)[1] : 0,
            d = (getXY(e)[1], getSize(e)[1]),
            v = intval(getStyle(e, "marginTop")),
            u = ge("dev_page_wrap"),
            p = getSize(u)[1],
            g = v - 5,
            _ = d > p,
            h = Math.max(0, c + s + a - bodyNode.clientHeight - g),
            m = void 0 === cur.filterLastPos ? i : cur.filterLastPos,
            f = cur.lastSt || 0;
        (s > 0 || browser.msie) && !_ ? (t = "fixed", o = a - i > d + v + g + h ? i : Math.max(Math.min(i, m + f - s), a - d - v - g - h), r = Math.min(0, Math.max(-
                bodyNode.scrollLeft, bodyNode.clientWidth - getSize(ge("page_layout"))[0])), cur.filterLastPos = o) : (t = "relative", o = r = 0, cur.filterLastPos = i),
            cur.lastSt = s, setStyle(e, {
                top: o + "px",
                marginLeft: r + "px",
                position: t
            })
    },
    scrollToAnchor: function() {
        handleScroll((nav.fromStr(nav.curLoc || nav.strLoc)
                .f || "")
            .replace(/\+/g, " "))
    },
    switchPage: function(page, edit, opts) {
        cur.page = page;
        var pageRaw = page.split(".");
        Dev.switchSection(pageRaw[0], !1, !0);
        var mlist = ge("dev_mlist_list"),
            curSel = geByClass1("nav_selected", ge("dev_left_nav")),
            isMethod = !!pageRaw[1] || "execute" == page,
            newSel;
        if (isMethod ? (newSel = ge("dev_mlist_" + pageRaw[0]), (!newSel || hasClass(newSel, "dev_mlist_item")) && (newSel = "orders" == pageRaw[0] && ge(
                "dev_mlist_payments") || ge("dev_mlist_methods"))) : (newSel = ge("dev_mlist_" + page.replace(".", "_")), !newSel && cur.sections && cur.sections[page] &&
                (newSel = ge("dev_mlist_" + page) || "orders" == page && ge("dev_mlist_payments") || ge("dev_mlist_methods"))), newSel ? (removeClass(curSel,
                "nav_selected"), addClass(newSel, "nav_selected")) : cur.noSelFound = !0, Dev.animLeftNav(curSel, newSel), isMethod && mlist) {
            var curMSel = geByClass1("nav_selected", mlist),
                newMSel = ge("dev_mlist_" + page.replace(".", "_"));
            removeClass(curMSel, "nav_selected"), newSel && addClass(newMSel, "nav_selected")
        }
        var actsCont = ge("dev_page_acts"),
            pageOpts = {
                preload: 1
            };
        opts && opts.translate && (pageOpts.translate = opts.translate), opts && opts.f && (pageOpts.f = opts.f), edit ? pageOpts.edit = 1 : opts && "history" == opts.act &&
            (pageOpts.act = "history"), opts && opts.ver && (pageOpts.ver = opts.ver), ajax.post("/dev/" + page, pageOpts, {
                onDone: function(title, text, acts, top_section, edit_sections, isPage, opts, js, bodyClass, parent_section) {
                    window.tooltips && tooltips.hideAll(), ge("dev_header_name")
                        .innerHTML = title, ge("dev_page_cont")
                        .innerHTML = text, ge("dev_page_acts")
                        .innerHTML = acts, ge("dev_page_sections")
                        .innerHTML = edit_sections, top_section && ge("dev_top_" + top_section) && (each(geByClass("dev_top_link", ge("dev_top_nav")), function() {
                            removeClass(this, "sel")
                        }), addClass(ge("dev_top_" + top_section), "sel")), bodyClass !== bodyNode.className && (bodyNode.className = bodyClass), delete pageOpts.preload,
                        delete cur.verDD, Dev.setLeftNav(parent_section), nav.setLoc("dev/" + page + nav.toStr(pageOpts)), toggle("dev_method_narrow", !isPage &&
                            "history" !== pageOpts.act), Dev.initPage(opts), js && eval("(function(){" + js + ";})()"), scrollToTop(0)
                },
                showProgress: function() {},
                hideProgress: function() {}
            })
    },
    switchSection: function(e, t, r) {
        if (cur.sect != e) {
            if (!cur.sections || !cur.sections[e]) {
                if (r) return;
                e = "users"
            }
            var a = geByClass1("nav_selected", ge("dev_mlist_list"));
            removeClass(a, "nav_selected");
            var s = cur.sections[e].list,
                o = cur.sections[e].name;
            ge("dev_section_menu")
                .innerHTML = o, cur.methodsDD && cur.methodsDD.header && cur.methodsDD.header.firstChild && (cur.methodsDD.header.firstChild.innerHTML = o);
            var n = "",
                i = !1;
            for (var l in s) {
                var o = s[l][0],
                    c = s[l][1];
                i || (i = o), n += '<a id="dev_mlist_' + o.replace(/\./g, "_") + '" class="dev_mlist_item' + (cur.page == o ? " nav_selected" : "") + (c ? " " + c : "") +
                    '" href="/dev/' + o + '">' + o + "</a>"
            }
            var d = ge("dev_mlist_list");
            d.innerHTML = n, cur.sect = e, t && nav.go("/dev/" + e)
        }
    },
    getParamName: function(e) {
        var t = e.id.replace(/^dev_edit_/, "");
        return t.substr(0, 1)
            .toUpperCase() + t.substr(1)
    },
    saveDoc: function(e, t) {
        var r = {
            act: "a_save_page",
            hash: e,
            page: cur.page,
            type: cur.type
        };
        nav.objLoc.translate && (r.translate = parseInt(nav.objLoc.translate));
        var a = geByClass("dev_textarea", ge("dev_page"));
        for (var s in a) r[Dev.getParamName(a[s])] = val(a[s]);
        if (cur.editors)
            for (var s in cur.editors) {
                var o = cur.editors[s];
                o && (r[Dev.getParamName(o.cont)] = o.val()), debugLog("ed", o)
            }
        var n = geByClass("dev_input", ge("dev_page"));
        for (var s in n) r[Dev.getParamName(n[s])] = val(n[s]);
        var i = [];
        if (cur.dropDowns)
            for (var s in cur.dropDowns) {
                var l = cur.dropDowns[s],
                    c = l.val();
                if (-1 != parseInt(c))
                    for (var d in l.options.defaultItems) {
                        var v = l.options.defaultItems[d];
                        if (v[0] == c) {
                            i.push(v[2]);
                            break
                        }
                    }
            }
        r.parents = i.join(",");
        var u = ge("settings_page_hidden");
        u && (r.page_settings_hidden = u.checked ? 1 : 0), ajax.post("dev", r, {
            onDone: function(e) {
                showDoneBox(e)
            },
            showProgress: lockButton.pbind(t),
            hideProgress: unlockButton.pbind(t)
        })
    },
    parentChange: function(dd, v, objId) {
        for (var cont = ge(objId), el = cont, nextEl = el.nextSibling; nextEl;) {
            if (hasClass(nextEl, "dev_sel_section")) {
                for (var i in cur.dropDowns) cur.dropDowns[i].container.parentNode == nextEl && cur.dropDowns.splice(i, 1);
                re(nextEl)
            } else el = nextEl;
            nextEl = el.nextSibling
        }
        if (-1 == parseInt(v)) var name = "";
        else {
            var name = "";
            for (var i in dd.defaultItems) parseInt(dd.defaultItems[i][0]) == parseInt(v) && (name = dd.defaultItems[i][2])
        }
        var prg = ge("dev_sections_progress"),
            parents = [];
        if (cur.dropDowns)
            for (var i in cur.dropDowns) {
                var iItem = cur.dropDowns[i],
                    value = iItem.val();
                if (-1 == parseInt(value)) break;
                for (var k in iItem.options.defaultItems) {
                    var kItem = iItem.options.defaultItems[k];
                    if (debugLog(kItem), kItem[0] == value) {
                        parents.push(kItem[2]);
                        break
                    }
                }
            }
        ajax.post("dev", {
            act: "a_get_sections",
            name: name,
            page: cur.page,
            parents: parents.join(","),
            hash: cur.editHash
        }, {
            onDone: function(rows, js) {
                cont.parentNode.insertBefore(cf(rows), prg), eval("(function(){" + js + ";})()")
            },
            showProgress: show.pbind(prg),
            hideProgress: hide.pbind(prg)
        })
    },
    changeConsoleCheckBox: function(e) {
        checkbox(e);
        var t = hasClass(e, "on") ? 1 : 0;
        val(geByClass1("dev_param_checkbox_val", e), t)
    },
    checkMethodParams: function() {
        for (var e = geByClass("dev_param_item", ge("dev_params_wrap")), t = cur.verDD.val()
                .split("."), r = parseInt(t[0]), a = parseInt(t[1]), s = 0; s < e.length; s++) {
            var o = e[s],
                n = o.getAttribute("data-from-version"),
                i = o.getAttribute("data-deprecated-from"),
                l = Dev.checkParamVersion(n.split("."), r, a),
                c = Dev.checkParamVersion(i.split("."), r, a, 1),
                d = geByClass1("dev_param_disabled_helper", o);
            if (d.tt && d.tt.destroy(), l || c) {
                addClass(o, "dev_param_disabled");
                var v = [];
                c && v.push(cur.lang.developers_deprecated_from_err.replace("%s", i)), l && v.push(cur.lang.developers_from_version_err.replace("%s", n)), d.setAttribute(
                    "onmouseover", "showTooltip(this, {text: '" + v.join("<br>") + "', shift: [0,0,0], black: 1})")
            } else removeClass(o, "dev_param_disabled")
        }
    },
    checkParamVersion: function(e, t, r, a) {
        var s = parseInt(e[0]),
            o = parseInt(e[1]);
        if (0 == s) return !1;
        if (a) {
            if (t > s || s == t && r >= o) return !0
        } else if (s > t || s == t && o > r) return !0;
        return !1
    },
    methodRun: function(e, t, r) {
        var a = {
                hash: e
            },
            s = geByClass("dev_param_item", ge("dev_params_wrap"));
        window.tooltips && tooltips.hideAll();
        var a = {
            act: "a_run_method",
            method: cur.page,
            hash: e
        };
        for (var o in s)
            if (!hasClass(s[o], "dev_param_disabled")) {
                var n = geByClass1("dev_param_field", s[o]);
                if (hasClass(n, "dev_param_checkbox")) var i = hasClass(n, "on") ? 1 : 0;
                else var i = val(n);
                "" !== i && (a["param_" + n.id.substr(10)] = i)
            }
        if (cur.edit && (a._edit = "1"), cur.verDD && (a.param_v = cur.verDD.val_full()[1]), r)
            for (var o in r) a["param_" + o] = r[o];
        var l = [];
        for (var o in a) "param_" == o.substr(0, 6) && l.push("params[" + o.substr(6) + "]=" + encodeURIComponent(a[o]));
        history.pushState({}, "", location.pathname + "?" + l.join("&"));
        var c = function(r) {
            r && (r = r.replace(/^<pre>(.*)<\/pre>$/, "$1"));
            try {
                var a = parseJSON(r);
                a.error && 14 == a.error.error_code && (cur.appCaptcha = showCaptchaBox(a.error.captcha_sid, 0, !1, {
                    onSubmit: function(r, a) {
                        Dev.methodRun(e, t, {
                            captcha_sid: r,
                            captcha_key: a
                        }), cur.appCaptcha.hide()
                    },
                    imgSrc: a.error.captcha_img
                })), Dev.requestResult(a)
            } catch (s) {
                Dev.requestError(r)
            }
            return !0
        };
        ajax.post("dev", a, {
            onDone: c,
            onFail: c,
            showProgress: lockButton.pbind(t),
            hideProgress: unlockButton.pbind(t)
        })
    },
    btHide: function(e) {
        var t = e.parentNode;
        if (hide(t), hasClass(e, "dev_result_lbracket")) var r = "[...]";
        else var r = "{...}";
        var a = se('<span class="dev_result_hidden" onclick="Dev.btShow(this);">' + r + "</span>");
        t.parentNode.insertBefore(a, t)
    },
    btShow: function(e) {
        var t = e.nextSibling;
        re(e), show(t)
    },
    checkUploadUrl: function(e) {
        return e && e.match(/^((https?:\/\/)?)(?:[a-z0-9\.]+\.)?(vkontakte\.ru|vk\.com)\//gi) ? !0 : !1
    },
    wrapObject: function(e, t, r, a) {
        var s = "";
        if (cur.wrapNum || (cur.wrapNum = 0), null === e) return '<span class="dev_result_num">null</span>';
        switch (typeof e) {
            case "object":
                var o = [];
                if ("[object Array]" == Object.prototype.toString.call(e)) {
                    for (var n in e) o.push(Dev.wrapObject(e[n], null, n, e));
                    s += '<span class="dev_result_block"><span class="dev_result_lbracket" onclick="Dev.btHide(this);">[</span>' + o.join(", ") +
                        '<span class="dev_result_lbracket" onclick="Dev.btHide(this);">]</span></span>'
                } else {
                    for (var n in e) o.push('<span class="dev_result_key">' + clean(n) + ":</span> " + Dev.wrapObject(e[n], null, n, e));
                    var i = '<div class="dev_result_obj">' + o.join(",<br/>") + "</div>";
                    t ? s += i : (s += '<span class="dev_result_block"><span id="dev_wrap_open_' + cur.wrapNum +
                        '" class="dev_result_bracket" onclick="Dev.btHide(this);">{</span><br/>' + i + '<span id="dev_wrap_close_' + cur.wrapNum +
                        '" class="dev_result_bracket" onclick="Dev.btHide(this);">}</span></span>', cur.wrapNum += 1)
                }
                break;
            case "string":
                var l = clean(e);
                if (e.match(/^https?:\/\/.*/)) {
                    var c, d = "";
                    e.match(/^.*\.(jpe?g|png|gif)$/i) && (d = 'onmouseover="return Dev.onMouseOverImageLink(this);" onmouseout="return Dev.onMouseOutImageLink()"'), c = e.length >
                        40 ? l.substr(0, 17) + "..." + l.substr(-19) : l, l = '<a href="' + l + '" target="_blank" ' + d + ">" + c + "</a>"
                }
                l = l.replace(/\n/g, "<br />"), s += '<span class="dev_result_str">\'' + l + "'</span>";
                break;
            case "number":
                var v, u = '<span class="dev_result_num">' + e + "</span>";
                a && "id" == r ? (a.first_name ? v = "id" + e : a.screen_name && (v = "" + a.screen_name), v && (u = '<a target=_blank href="/' + v + '" mention_id="' + v +
                    '" onmouseover="mentionOver(this)">' + u + "</a>")) : ("date" == r || "created" == r || "updated" == r || "edited" == r) && (u =
                    '<span onmouseover="Dev.onMouseOverDate(this)" onmouseout="Dev.onMouseOut()" data-date="' + e + '">' + u + "</span>"), s += u;
                break;
            case "boolean":
                s += '<span class="dev_result_bool">' + e + "</span>";
            default:
                debugLog("unknown type", typeof e)
        }
        return t && e.response && e.response.upload_url && Dev.checkUploadUrl(e.response.upload_url) && (s +=
            '<div class="dev_upload_form"><form id="dev_file_submit" action="' + clean(e.response.upload_url) +
            '" target="dev_upload_iframe" enctype="multipart/form-data" method="post"><input type="file" name="file" onchange="this.parentNode.submit(); show(\'dev_upload_iframe_wrap\')" class="dev_upload_input" /></form></div><div id="dev_upload_iframe_wrap"><iframe id="dev_upload_iframe" name="dev_upload_iframe"></iframe></div>'
        ), s
    },
    showObjTooltip: function(e, t, r) {
        window.tooltips && window.tooltips.hideAll(), showTooltip(e, {
            content: '<div class="dev_tt_preview">' + t + "</div>",
            slide: 15,
            shift: [0, 0, -4],
            className: "wall_tt dev_tt",
            hasover: !1,
            nohideover: !0,
            center: 1,
            showdt: 0,
            onShowStart: r
        })
    },
    onMouseOut: function() {
        delete window.cur.currTooltipTarget
    },
    onMouseOverDate: function(e) {
        function t(t) {
            t && window.cur.currTooltipTarget == e && Dev.showObjTooltip(e, t), window.cur.prettyTimestamps[a] = t
        }
        window.cur.prettyTimestamps || (window.cur.prettyTimestamps = {}), window.cur.currTooltipTarget = e;
        var r, a = e.getAttribute("data-date");
        (r = window.cur.prettyTimestamps[a]) ? t(r): ajax.post("/dev", {
            act: "date_format",
            date: a
        }, {
            onDone: t
        })
    },
    onMouseOutImageLink: function() {
        cur.overedDevLink = null, window.tooltips && tooltips.hideAll()
    },
    onMouseOverImageLink: function(e) {
        var t = new Image;
        cur.overedDevLink = e, t.onload = function() {
            cur.overedDevLink == e && Dev.showObjTooltip(e, '<img align="center" src="' + e.href + '"/> <div class="resolution"></div>', function(e) {
                var r = geByClass1("resolution", e.container);
                geByTag1("img", e.container);
                r.innerHTML = t.width + " x " + t.height
            })
        }, t.src = e.href
    },
    requestError: function(e) {
        var t = '<pre class="dev_result_error">' + e.replace(/<\/?pre>/g, "") + "</pre>",
            r = ge("dev_result");
        r && (r.innerHTML = t, addClass(domPN(r), "has_res"))
    },
    requestResult: function(e) {
        if (ge("dev_const_start_from")) {
            var t = ge("dev_req_next");
            e && e.response && e.response.next_from ? (cur.nextFrom = e.response.next_from, show(t)) : hide(t)
        }
        var r = Dev.wrapObject(e, !0),
            e = ge("dev_result");
        e && (e.innerHTML = r, addClass(domPN(e), "has_res"))
    },
    nextPage: function(e, t) {
        val("dev_const_start_from", cur.nextFrom), Dev.methodRun(e, t)
    },
    resultMove: function(e) {
        var t = ge("dev_result");
        if (!hasClass(e, "dev_result_lbracket") && !hasClass(e, "dev_result_bracket")) return !1;
        for (; e;) {
            if (hasClass(e, "dev_result_block")) {
                addClass(e, "dev_result_highlight");
                break
            }
            if (e = e.parentNode, e == t) break
        }
        cur.highLighted != e && (removeClass(cur.highLighted, "dev_result_highlight"), cur.highLighted = e)
    },
    onSearchChange: function(e, t) {
        if (t) switch (t.keyCode) {
            case KEY.DOWN:
                return Dev.selSuggRow(!1, 1, t);
            case KEY.UP:
                return Dev.selSuggRow(!1, -1, t);
            case KEY.RETURN:
                return Dev.onSearchSelect();
            case KEY.ESC:
                val(e, "")
        }
        setTimeout(function() {
            var t = val(e)
                .toLowerCase()
                .replace(/[^a-z�-�]+/g, "");
            if (t) {
                if (t == cur.prevSearch) return show("dev_search_suggest");
                for (var r = "", a = 0; a < t.length; a++) r += t.substr(a, 1) + ".*?";
                var s = new RegExp(".*?(" + r + ")", "i"),
                    o = new RegExp("^(" + r + ")", "i"),
                    n = [];
                for (var a in cur.sections) {
                    var i = cur.sections[a].list;
                    for (var l in i) {
                        var c = i[l][0],
                            d = c.match(o);
                        if (d) n.push([c, c.length]);
                        else {
                            var d = c.match(s);
                            d && n.push([c, c.length + 2])
                        }
                    }
                }
                n = n.sort(function(e, t) {
                    return e[1] < t[1] ? -1 : e[1] > t[1] ? 1 : 0
                });
                var v = [];
                for (var a in n) v.push(n[a][0]);
                Dev.showSuggestions(v, t)
            } else Dev.showSuggestions();
            cur.prevSearch = t
        }, 0)
    },
    initSuggestions: function() {
        var e = ge("dev_search_suggest_list");
        debugLog("init sugg"), stManager.add(["notifier.css", "notifier.js"], function() {
            debugLog("go next"), cur.scroll = new Scrollbar(e, {
                prefix: "fc_",
                nomargin: !0,
                global: !0,
                nokeys: !0,
                right: vk.rtl ? "auto" : 0,
                left: vk.rtl ? 0 : "auto"
            })
        })
    },
    showSuggestions: function(e, t) {
        if (e && e.length) {
            for (var r = ge("dev_search_suggest_list"), a = "", s = [], o = 0; o < t.length; o++) s.push(t.substr(o, 1));
            var n = new RegExp(s.join(".*?"), "i");
            for (var o in e) {
                var i = e[o];
                i = i.replace(n, function(e) {
                    return "<em>" + e + "</em>"
                }), a += '<a class="dev_search_row" onmousedown="return Dev.onSearchSelect(event);" onmouseover="Dev.selSuggRow(this);">' + i + "</a>"
            }
            r.innerHTML = a, show("dev_search_suggest"), cur.scroll && (cur.scroll.scrollTop(0), cur.scroll.update(!1, !0))
        } else hide("dev_search_suggest"), debugLog("hiden")
    },
    onSearchSelect: function(e) {
        var t = ge("dev_search_suggest_list"),
            r = ge("dev_top_input"),
            a = geByClass1("dev_sugg_sel", t),
            s = !1,
            o = val(r);
        if (a) s = val(a)
            .replace(/<[^>]*>/g, "");
        else {
            firstSel = geByClass1("dev_search_row", t);
            var n = (val(firstSel) || "")
                .replace(/<[^>]*>/g, "");
            n && 0 === n.replace(/[\. ]/g, "")
                .toLowerCase()
                .indexOf(o.replace(/[\. ]/g, "")
                    .toLowerCase()) && (s = 0 === n.split(".")[0].toLowerCase()
                    .indexOf(o.toLowerCase()) ? n.split(".")[0] : n)
        }
        return s ? (nav.go("dev/" + s), val(r, "")) : nav.go("dev?act=search&q=" + o), Dev.onSearchChange(r, e), cancelEvent(e)
    },
    selSuggRow: function(e, t, r) {
        if (!isVisible(ge("dev_search_suggest"))) return !1;
        var a = ge("dev_search_suggest_list"),
            s = geByClass1("dev_sugg_sel", a);
        if (!e) {
            if (1 == t && s) e = s.nextSibling;
            else if (-1 == t && s && (e = s.previousSibling, !e)) {
                var o = geByClass("dev_search_row", a);
                e = o[o.length - 1]
            }
            e || (e = geByClass1("dev_search_row", a))
        }
        if (s != e && (s && removeClass(s, "dev_sugg_sel"), addClass(e, "dev_sugg_sel"), t)) {
            var n = getXY(e)[1],
                i = getXY(a)[1],
                l = n - i - a.scrollTop,
                c = (getSize(e)[1], getSize(a)[1] - getSize(e)[1]);
            l > c ? cur.scroll.scrollTop(a.scrollTop + l - c) : 0 > l && cur.scroll.scrollTop(Math.max(0, a.scrollTop + l))
        }
        return cancelEvent(r)
    },
    onSearchBlur: function() {
        hide("dev_search_suggest")
    },
    checkParamVal: function(e, t, r, a) {
        switch (t.keyCode) {
            case KEY.UP:
                ("int" == r || "positive" == r) && val(e, intval(val(e)) + 1);
                break;
            case KEY.DOWN:
                ("int" == r || "positive" == r) && val(e, intval(val(e)) - 1)
        }
        setTimeout(function() {
            var t = val(e),
                a = t;
            switch (r) {
                case "int":
                    t = "-" == t ? "-" : intval(t);
                    break;
                case "positive":
                    t = positive(t)
            }
            t != a ? addClass(e, "dev_wrong_val") : removeClass(e, "dev_wrong_val")
        }, 0)
    },
    toggleMethodListHeader: function(e) {
        var t = val(e);
        hasClass(e, "dev_methods_list_min") ? (removeClass(e, "dev_methods_list_min"), addClass(e, "dev_methods_list_max")) : t || (addClass(e, "dev_methods_list_min"),
            removeClass(e, "dev_methods_list_max"))
    },
    expandResult: function() {
        var e = ge("dev_result"),
            t = ge("dev_req_table"),
            r = ge("dev_req_table_wrap"),
            a = scrollGetY();
        return e && hasClass(domPN(e), "has_res") && !hasClass(t, "wide") ? (addClass(t, "wide"), setStyle(r, {
            height: getSize(t)[1]
        }), scrollToY(a, 0), void addEvent(document, "click", function(a) {
            for (var s = a.target; s && s !== domPN(e);) s = domPN(s);
            s || (removeClass(t, "wide"), setStyle(r, {
                height: null
            }), removeEvent(document, "click", arguments.callee))
        })) : !1
    },
    showPageSettings: function() {},
    reportError: function(e, t) {
        return !showBox("/bugs", {
            act: "new_box",
            doc: e,
            doc_title: replaceEntities(t)
        }, {
            stat: ["wide_dd.js", "wide_dd.css", "page.css", "page.js", "upload.js"],
            cache: 1,
            dark: 1,
            params: {
                width: 500,
                hideButtons: !0,
                bodyStyle: "border: 0px; padding: 0px"
            }
        })
    },
    paletteDown: function(e, t, r, a) {
        var s = ge("dev_palette"),
            o = getSize(s)[1];
        if (void 0 === r) var r = e.offsetY || e.layerY;
        var r = Math.max(0, Math.min(r, o)),
            n = Math.round(r / (o / 360));
        n = Math.abs(n - 360), n = 360 == n ? 0 : n, ge("dev_colors")
            .style.backgroundColor = "rgb(" + Dev.hsv2rgb(n, 100, 100) + ")", a || Dev.setColor(Dev.hsv2rgb(n, cur.pickerX, cur.pickerY)), cur.pickerT = n;
        var i = ge("dev_picker1");
        if (setStyle(i, {
                marginTop: r - 1
            }), t) {
            var l = e.clientY,
                c = function(e) {
                    Dev.paletteDown(e, !1, r + e.clientY - l)
                };
            addEvent(window, "mousemove", c), addEvent(window, "mouseup", function(e) {
                removeEvent(window, "mousemove", c)
            })
        }
        return cancelEvent(e)
    },
    colorsDown: function(e, t, r, a, s) {
        var o = ge("dev_picker2"),
            n = ge("dev_colors"),
            i = getSize(n);
        if (void 0 === r) var r = e.offsetX || e.layerX;
        if (void 0 === a) var a = e.offsetY || e.layerY;
        if (a = Math.max(0, Math.min(a, i[1])), r = Math.max(0, Math.min(r, i[0])), setStyle(o, {
                marginTop: a - 6,
                marginLeft: r - 7
            }), cur.pickerX = r / i[0] * 100, cur.pickerY = 100 - a / i[1] * 100, s || Dev.setColor(Dev.hsv2rgb(cur.pickerT, cur.pickerX, cur.pickerY)), t) {
            var l = e.clientY,
                c = e.clientX,
                d = function(e) {
                    Dev.colorsDown(e, !1, r + e.clientX - c, a + e.clientY - l)
                };
            addEvent(window, "mousemove", d), addEvent(window, "mouseup", function(e) {
                removeEvent(window, "mousemove", d)
            })
        }
        return cancelEvent(e)
    },
    hsv2rgb: function(e, t, r) {
        debugLog("try", e, t, r);
        var a, s, o, n, i, l, c, d;
        switch (t /= 100, r /= 100, i = Math.floor(e / 60), a = e / 60 - i, s = r * (1 - t), o = r * (1 - t * a), n = r * (1 - (1 - a) * t), i) {
            case 0:
                l = r, c = n, d = s;
                break;
            case 1:
                l = o, c = r, d = s;
                break;
            case 2:
                l = s, c = r, d = n;
                break;
            case 3:
                l = s, c = o, d = r;
                break;
            case 4:
                l = n, c = s, d = r;
                break;
            case 5:
                l = r, c = s, d = o
        }
        return [parseInt(255 * l), parseInt(255 * c), parseInt(255 * d)]
    },
    rgb2hsv: function(e) {
        var t, r, a, s, o, n = e[0] / 255,
            i = e[1] / 255,
            l = e[2] / 255,
            c = Math.max(n, i, l),
            d = c - Math.min(n, i, l),
            v = function(e) {
                return (c - e) / 6 / d + .5
            };
        return 0 == d ? s = o = 0 : (o = d / c, t = v(n), r = v(i), a = v(l), n === c ? s = a - r : i === c ? s = 1 / 3 + t - a : l === c && (s = 2 / 3 + r - t), 0 > s ? s +=
            1 : s > 1 && (s -= 1)), {
            h: Math.round(360 * s),
            s: Math.round(100 * o),
            v: Math.round(100 * c)
        }
    },
    hex2rgb: function(e) {
        var t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        e = e.replace(t, function(e, t, r, a) {
            return t + t + r + r + a + a
        });
        var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
        return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [0, 0, 0]
    },
    setColor: function(e) {
        var t = ge("dev_colorbox" + cur.colorNum);
        setStyle(t, {
            backgroundColor: "rgb(" + e.join(",") + ")"
        });
        var r = ge("widget_color" + cur.colorNum),
            a = [e[0].toString(16), e[1].toString(16), e[2].toString(16)];
        for (var s in a) 1 == a[s].length && (a[s] = "0" + a[s]);
        val(r, a.join("")
            .toUpperCase()), cur.soonUpdatePreview()
    },
    showColorBox: function(e, t, r) {
        if (browser.msie && browser.version < 9) return !1;
        cur.colorNum = t;
        var a = ge("dev_widget_colors"),
            s = ge("dev_colorpicker"),
            o = ge("dev_colors"),
            n = ge("dev_palette"),
            i = !1;
        if (!cur.colorShown) {
            fadeIn(s, 200);
            var i = !0;
            cur.colorShown = !0
        }
        var l = getXY(e)[1] - getXY(a)[1];
        if (cur.colorInited) animate(s, {
            marginTop: -180 + l
        }, 200);
        else {
            setStyle(s, {
                marginTop: -180 + l
            });
            for (var c = getSize(n), d = n.getContext("2d"), v = d.createLinearGradient(c[0] / 2, c[1], c[0] / 2, 0), u = [
                    [255, 0, 0],
                    [255, 255, 0],
                    [0, 255, 0],
                    [0, 255, 255],
                    [0, 0, 255],
                    [255, 0, 255],
                    [255, 0, 0]
                ], p = 0; 6 >= p; p++) _ = "rgb(" + u[p][0] + "," + u[p][1] + "," + u[p][2] + ")", v.addColorStop(1 * p / 6, _);
            d.fillStyle = v, d.fillRect(0, 0, c[0], c[1]), addEvent(document, "mouseup", function() {
                cur.paletteDown = !1
            })
        }
        var g = ge("widget_color" + cur.colorNum),
            _ = val(g),
            h = Dev.hex2rgb(_),
            m = Dev.rgb2hsv(h);
        Dev.paletteDown(!1, !1, (360 - m.h) / 360 * getSize(n)[1], !0);
        var f = getSize(o);
        Dev.colorsDown(!1, !1, m.s / 100 * f[0], (100 - m.v) / 100 * f[1], !0);
        var w = function(e) {
            for (var t = e.target; t;) {
                if ("dev_colorpicker" == t.id || hasClass(t, "dev_colorbox_cont")) return cur.colorBoxHideTimeout && (debugLog("cancel Hide"), clearTimeout(cur.colorBoxHideTimeout),
                    cur.colorBoxHideTimeout = !1), !1;
                t = t.parentNode
            }
            return cur.colorBoxHideTimeout ? !1 : void(cur.colorBoxHideTimeout = setTimeout(function() {
                fadeOut(s, 200), cur.colorShown = !1, removeEvent(window, "mousemove", w)
            }, 500))
        };
        return i && addEvent(window, "mousemove", w), cur.colorInited = !0, cancelEvent(r)
    },
    addVersion: function(e) {
        var t = {
            act: "a_save_version",
            ver: val("dev_edit_number"),
            methods: val("dev_edit_methods"),
            text: val("dev_edit_ver_text"),
            text_en: val("dev_edit_ver_text_en"),
            hash: e
        };
        ajax.post("dev.php", t, {
            onDone: function() {
                nav.go("/dev/versions")
            },
            onFail: function(e) {
                return e = ge(e), e ? (notaBene(e), !0) : void 0
            }
        })
    },
    checkWallURL: function(e) {
        var t, r = /([!()?., \n\r\t \u00A0]|^)((https?:\/\/)?((?:[a-z0-9_\-]+\.)+[a-z]{2,6})(\/.*?)?(\#.*?)?)(&nbsp;|[ \t\r\n \u00A0]|$)/i;
        if (e && (t = e.match(r))) {
            e = e.substr(t.index + t[0].length);
            var a = t[2],
                s = t[5] || "";
            a.match(/^https?:\/\//) || (a = "http://" + a);
            var o = !1;
            return t[4].match(/(^|\.|\/\/)(vkontakte\.ru|vk\.com)/) && (o = s.match(/wall(-?\d+)_(\d+)(\?reply=(\d+))?$/)), o = o && o[4] ? o[1] + "_" + o[4] : o && o[2] ?
                o[1] + "_" + o[2] : !1
        }
    },
    _eof: 1
};
try {
    stManager.done("dev.js")
} catch (e) {}
