Bugs = {
    init: function() {
        cur.module = "bugs", cur.nav.push(function(e, t, a) {
            return void 0 === e[0] && e.act ? ("show" != a.act && "show" != t.act ? this.switchSection(a.act) : this.loadBugsPage(a), !1) : void 0
        }.bind(this))
    },
    loadBugsPage: function(objLoc) {
        var query = extend({
            part: 1
        }, objLoc);
        delete query[0], ajax.post("/bugs", query, {
            onDone: function(content, script) {
                ge("bugs_content") && (ge("bugs_content")
                        .innerHTML = content), script && eval(script), window.Dev && Dev.checkBlockHeight(), window.tooltips && tooltips.hideAll(), scrollToTop(),
                    nav.setLoc(objLoc)
            }
        })
    },
    switchSection: function(e) {
        cur.params = {
            act: e,
            load: 1
        }, val("bugs_search_input", ""), removeClass(ge("bugs_search_reset"), "shown"), this.searchAll()
    },
    getPage: function(offset) {
        show("bugs_pages_top"), show("bugs_pages_bottom");
        var _n = nav.objLoc,
            act = nav.objLoc.act || cur.section,
            query = {
                act: act,
                offset: offset,
                load: 1
            };
        for (var v in _n) "0" != v && "act" != v && "offset" != v && (query[v] = _n[v]);
        return ajax.post("bugs", query, {
            cache: 1,
            onDone: function(content, script, filters) {
                ge("bugs_table")
                    .innerHTML = content, ge("bugs_filters") && (ge("bugs_filters")
                        .innerHTML = filters), script && eval(script), window.Dev && Dev.checkBlockHeight(), window.tooltips && tooltips.hideAll(), scrollToTop(),
                    offset ? extend(nav.objLoc, {
                        offset: offset
                    }) : delete nav.objLoc.offset, nav.setLoc(nav.objLoc)
            },
            hideProgress: function() {
                hide("bugs_pages_top"), hide("bugs_pages_bottom")
            }
        }), !1
    },
    subscribeBug: function(e, t) {
        ajax.post("bugs", {
            act: "subscribe",
            id: cur.bug_id,
            subscribe: t,
            hash: cur.hashes.subscribe_hash
        }, {
            onDone: function(e) {
                e && (ge("bugs_view_subscribe")
                    .innerHTML = se(e)
                    .innerHTML)
            },
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e)
        })
    },
    getSearchParams: function(e) {
        var t = {
                q: trim(val(e)),
                load: 1,
                cache: 1
            },
            a = 0;
        if (cur.bugsDD && (a = intval(cur.bugsDD.val())), a || (a = (isChecked("bugs_chk_opened") ? 1 : 0) + (isChecked("bugs_chk_closed") ? 2 : 0) + (isChecked(
                "bugs_chk_declined") ? 4 : 0)), cur.tags) {
            var o = [];
            for (var s in cur.tags) o.push(s);
            o.length && (t.tags = o.join(","))
        }
        var i = "subscriptions" == cur.type ? 7 : 1;
        return a != i && (t.status = "" + a), (t.q || t.tags) && "all" != nav.objLoc && "trending" != nav.objLoc.act && (nav.objLoc.act = "all"), nav.objLoc.act && (t.act =
            nav.objLoc.act), t
    },
    sameParams: function(e) {
        if (!cur.params) return !1;
        for (var t in e)
            if (e[t] != cur.params[t]) return !1;
        for (var t in cur.params)
            if (e[t] != cur.params[t]) return !1;
        return !0
    },
    updateAllSearch: function(e, t, a) {
        t && t.keyCode == KEY.ESC && Bugs.clearAllSearch(), a = a || 10, clearTimeout(cur.searchTimeout), cur.searchTimeout = setTimeout(function() {
            var t = Bugs.getSearchParams(e);
            toggleClass(ge("bugs_search_reset"), "shown", !!t.q), (!Bugs.sameParams(t) || cur.ignoreEqual) && (delete cur.ignoreEqual, cur.params = t, Bugs.searchAll()),
                scrollToTop()
        }.bind(this), a)
    },
    searchAll: function() {
        var query = cur.params || Bugs.getSearchParams(ge("bugs_search_input"));
        (query.q || query.tags) && window.AppsEdit && AppsEdit.animSubTab(ge("tab_" + query.act)), ajax.post("bugs", query, {
            cache: 1,
            onDone: function(cont, script, filters) {
                ge("bugs_table")
                    .innerHTML = cont, ge("bugs_filters") && (ge("bugs_filters")
                        .innerHTML = filters), script && eval(script), window.Dev && Dev.checkBlockHeight(), delete nav.objLoc.offset, each(["q", "status",
                        "tags", "act"
                    ], function(e, t) {
                        query[t] ? nav.objLoc[t] = query[t] : delete nav.objLoc[t]
                    }), nav.setLoc(nav.objLoc)
            },
            showProgress: addClass.pbind(ge("bugs_search"), "loading"),
            hideProgress: removeClass.pbind(ge("bugs_search"), "loading")
        })
    },
    clearAllSearch: function() {
        var e = ge("bugs_search_input");
        e.value = "", e.focus(), this.updateAllSearch(e, !1)
    },
    showNewBox: function() {
        return !showBox("bugs", {
            act: "new_box"
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
    checkTextLength: function(e, t, a) {
        var o = trim(e.value)
            .replace(/\n\n\n+/g, "\n\n");
        if (e.lastLen !== o.length) {
            var s = e.lastLen = o.length,
                i = s - o.replace(/\n/g, "")
                .length;
            a = ge(a), s > t - 100 || i > 10 ? (show(a), s > t ? a.innerHTML = getLang("global_recommended_exceeded", s - t) : i > 10 ? a.innerHTML = getLang(
                "global_recommended_lines", i - 10) : a.innerHTML = getLang("text_N_symbols_remain", t - s)) : hide(a)
        }
    },
    checkNewFields: function(e) {
        if (!trim(val("bugs_new_title"))) return notaBene(ge("bugs_new_title")), !1;
        if (!e && !curBox()
            .changed) return notaBene("bugs_new_text"), !1;
        if (cur.wdd && cur.wdd.wdd_new_tags) {
            var t = [];
            for (var a in cur.wdd.wdd_new_tags.selected) t.push(cur.wdd.wdd_new_tags.selected[a][0]);
            if (!t.length) return notaBene(ge("wdd_new_tags")), notaBene(ge("bugs_new_tags")), !1
        }
        return !0
    },
    saveBug: function(e) {
        if (!this.checkNewFields(e)) return !1;
        var t = {
            act: "save",
            hash: cur.hashes.save_hash,
            title: trim(val("bugs_new_title")),
            text: val("bugs_new_text")
        };
        if (e && (t.id = e), cur.wdd && cur.wdd.wdd_new_tags) {
            var a = [];
            for (var o in cur.wdd.wdd_new_tags.selected) a.push(cur.wdd.wdd_new_tags.selected[o][0]);
            a.length && (t.tags = a)
        }
        var s = [],
            i = cur.bugsNewMedia.chosenMedias;
        if (s)
            for (var o in i) {
                var r = i[o],
                    n = r[0],
                    d = r[1];
                ("photo" == n || "doc" == n) && s.push(n + "," + d)
            }
        return s.length && (t.attachs = s), ajax.post("bugs", t, {
            showProgress: lockButton.pbind("bugs_submit_button"),
            hideProgress: function() {
                curBox() && curBox()
                    .hide()
            },
            onDone: function(e, t, a) {
                e && (ge("bugs_view_description")
                    .innerHTML = e), t && (ge("bugs_view_data")
                    .innerHTML = t), a && Bugs.showMsg(a)
            },
            onFail: function(e) {
                return Bugs.showError(e)
            }
        }), !1
    },
    addBug: function() {
        return Bugs.saveBug()
    },
    editBug: function() {
        return Bugs.saveBug(cur.bug_id)
    },
    addScreen: function(e) {
        var t = {
            title: getLang("bugs_adding_screen"),
            width: 440,
            bodyStyle: "padding: 0px"
        };
        return e && (t.onShow = e), showFastBox(t, cur.screenBox)
    },
    addDoc: function(e) {
        var t = {
            title: getLang("bugs_adding_doc"),
            width: 440,
            bodyStyle: "padding: 0px"
        };
        return e && (t.onShow = e), showFastBox(t, cur.docBox)
    },
    choosePhotoUploaded: function(e, t) {
        var a = void 0 !== e.ind ? e.ind : e,
            o = (e.fileName || e)
            .replace(/[&<>"']/g, ""),
            s = e.fileName ? a + "_" + e.fileName : e,
            i = ge("upload" + s + "_progress_wrap");
        i && hide(geByClass1("progress_x", i)), ajax.post("al_photos.php", extend({
            act: "choose_uploaded_support"
        }, t), {
            onDone: function(e, t) {
                cur.bugsNewMedia.chooseMedia("photo", e, extend(t, {
                    upload_ind: a + "_" + o
                }))
            },
            onFail: Bugs.chooseFail.pbind(e)
        })
    },
    chooseDocUploaded: function(e, t) {
        var a = void 0 !== e.ind ? e.ind : e,
            o = ((e.fileName || e)
                .replace(/[&<>"']/g, ""), e.fileName ? a + "_" + e.fileName : e),
            s = ge("upload" + o + "_progress_wrap");
        s && hide(geByClass1("progress_x", s)), ajax.post("docs.php", extend({
            act: "a_save_doc",
            from: "choose"
        }, t), {
            onDone: function(e, t, a) {
                re("upload" + o + "_progress_wrap"), cur.bugsNewMedia.chooseMedia("doc", e + "_" + t, a)
            },
            onFail: Bugs.chooseFail.pbind(e)
        })
    },
    chooseFail: function(e, t) {
        var a = void 0 !== e.ind ? e.ind : e,
            o = (e.fileName || e)
            .replace(/[&<>"']/g, "");
        if ("fileApi" == Upload.types[a] && !Upload.options[a].wiki_editor) {
            var s, i = e.fileName ? a + "_" + e.fileName : e;
            cur.imMedia ? (re("upload" + i + "_progress_wrap"), s = cur.imMedia.lnkId, cur.addMedia[s].unchooseMedia()) : cur.addMedia && (re("upload" + i +
                "_progress_wrap"), s = (cur.attachMediaIndexes || {})[o], s && cur.addMedia[s].unchooseMedia())
        }
        topError("Upload failed", {
            dt: -1,
            type: 102,
            url: (ge("file_uploader_form" + a) || {})
                .action
        }), Upload.embed(a)
    },
    initPhotoUpload: function(el, params) {
        if (el = ge(el)) {
            cur.screens || (cur.screens = {});
            var uploadData = cur.uploadPhotoData,
                opts = uploadData.options;
            return Upload.init(el, uploadData.url, uploadData.vars, {
                file_name: "photo",
                file_size_limit: 5242880,
                file_types_description: "Image files (*.jpg, *.jpeg, *.png, *.gif)",
                file_types: "*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG;*.gif;*.GIF",
                accept: "image/jpeg,image/png,image/gif",
                file_match: ".(gif|jpg|jpeg|png)$",
                lang: opts.lang,
                onUploadStart: function(e, t) {
                    var a = void 0 !== e.ind ? e.ind : e,
                        o = Upload.options[a];
                    "form" == Upload.types[a] && (geByClass1("file", el)
                            .disabled = !0), "fileApi" == Upload.types[a] && (cur.notStarted && (params && params.hideOnStart && boxQueue.hideLast(), delete cur
                            .notStarted), o.multi_progress && this.onUploadProgress(e, 0, 0)), curBox()
                        .changed = !0
                },
                onUploadComplete: function(info, res) {
                    var fileName = (info.fileName || info)
                        .replace(/[&<>"']/g, ""),
                        params;
                    try {
                        params = eval("(" + res + ")")
                    } catch (e) {
                        params = q2ajx(res)
                    }
                    return params.photos ? void Bugs.choosePhotoUploaded(info, params) : void Upload.onUploadError(info)
                },
                onUploadProgress: function(e, t, a) {
                    var o = void 0 !== e.ind ? e.ind : e;
                    if ("fileApi" == Upload.types[o]) {
                        var s = (cur.attachMediaIndexes || {})[o];
                        if (void 0 === s || s && cur.addMedia[s].chosenMedia || cur.imMedia) {
                            var i = {
                                loaded: t,
                                total: a
                            };
                            e.fileName && (i.fileName = e.fileName.replace(/[&<>"']/g, "")), cur.bugsNewMedia.showMediaProgress("photo", o, i)
                        }
                    } else if ("flash" == Upload.types[o]) {
                        if (!ge("form" + o + "_progress")) {
                            for (var r = Upload.obj[o], n = getSize(r)[1], d = n / 2 + 10, u = r.firstChild; u;) 1 == u.nodeType && (u.id == "uploader" + o &&
                                browser.msie ? setStyle(u, {
                                    position: "relative",
                                    left: "-5000px"
                                }) : setStyle(u, {
                                    visibility: "hidden"
                                })), u = u.nextSibling;
                            r.appendChild(ce("div", {
                                innerHTML: '<div class="bugs_progress_wrap">            <div id="form' + o +
                                    '_progress" class="bugs_progress" style="width: 0%;"></div>          </div></div>'
                            }, {
                                height: d + "px",
                                marginTop: -d + "px"
                            }))
                        }
                        var l = intval(t / a * 100);
                        setStyle(ge("form" + o + "_progress"), {
                            width: l + "%"
                        })
                    }
                },
                onUploadError: Bugs.chooseFail,
                onUploadCompleteAll: function(e) {
                    var t = void 0 !== e.ind ? e.ind : e;
                    "fileApi" !== Upload.types[t] && (params.hideOnStart ? boxQueue.hideLast() : Upload.embed(t))
                },
                multiple: 1,
                multi_progress: 1,
                max_files: params && params.max_files || 5,
                max_files_hide_last: 1,
                clear: 1,
                type: "photo",
                max_attempts: 3,
                file_input: curBox()
                    .inp,
                server: opts.server,
                error: opts.default_error,
                error_hash: opts.error_hash,
                dropbox: "bas_dropbox"
            })
        }
    },
    initDocUpload: function(el, params) {
        if (el = ge(el)) {
            var uploadData = cur.uploadDocData,
                opts = uploadData.options;
            return Upload.init(el, uploadData.url, uploadData.vars, {
                file_name: "file",
                file_size_limit: 209715200,
                file_types_description: "Documents",
                file_types: "*.*;",
                lang: opts.lang,
                onUploadStart: function(e, t) {
                    var a = void 0 !== e.ind ? e.ind : e,
                        o = Upload.options[a];
                    "form" == Upload.types[a] && (geByClass1("file", el)
                            .disabled = !0), "fileApi" == Upload.types[a] && (cur.notStarted && (params && params.hideOnStart && boxQueue.hideLast(), delete cur
                            .notStarted), o.multi_progress && this.onUploadProgress(e, 0, 0)), curBox()
                        .changed = !0
                },
                onUploadComplete: function(info, res) {
                    var fileName = (info.fileName || info)
                        .replace(/[&<>"']/g, ""),
                        params;
                    try {
                        params = eval("(" + res + ")")
                    } catch (e) {
                        params = q2ajx(res)
                    }
                    return params.file ? void Bugs.chooseDocUploaded(info, params) : void Upload.onUploadError(info)
                },
                onUploadProgress: function(e, t, a) {
                    var o = void 0 !== e.ind ? e.ind : e;
                    if ("fileApi" == Upload.types[o]) {
                        var s = (cur.attachMediaIndexes || {})[o];
                        if (void 0 === s || s && cur.addMedia[s].chosenMedia || cur.imMedia) {
                            var i = {
                                loaded: t,
                                total: a
                            };
                            e.fileName && (i.fileName = e.fileName.replace(/[&<>"']/g, "")), cur.bugsNewMedia.showMediaProgress("doc", o, i)
                        }
                    } else if ("flash" == Upload.types[o]) {
                        if (!ge("form" + o + "_progress")) {
                            for (var r = Upload.obj[o], n = getSize(r)[1], d = n / 2 + 10, u = r.firstChild; u;) 1 == u.nodeType && (u.id == "uploader" + o &&
                                browser.msie ? setStyle(u, {
                                    position: "relative",
                                    left: "-5000px"
                                }) : setStyle(u, {
                                    visibility: "hidden"
                                })), u = u.nextSibling;
                            r.appendChild(ce("div", {
                                innerHTML: '<div class="bugs_progress_wrap">            <div id="form' + o +
                                    '_progress" class="bugs_progress" style="width: 0%;"></div>          </div></div>'
                            }, {
                                height: d + "px",
                                marginTop: -d + "px"
                            }))
                        }
                        var l = intval(t / a * 100);
                        setStyle(ge("form" + o + "_progress"), {
                            width: l + "%"
                        })
                    }
                },
                onCheckComplete: params && params.onCheckComplete || !1,
                onUploadError: Bugs.chooseFail,
                onUploadCompleteAll: function(e) {
                    var t = void 0 !== e.ind ? e.ind : e;
                    "fileApi" !== Upload.types[t] && (params.hideOnStart ? boxQueue.hideLast() : Upload.embed(t))
                },
                multiple: 1,
                multi_progress: 1,
                max_files: params && params.max_files || 5,
                max_files_hide_last: 1,
                clear: 1,
                type: "photo",
                max_attempts: 3,
                file_input: curBox()
                    .inp,
                server: opts.server,
                error: opts.default_error,
                error_hash: opts.error_hash,
                dropbox: "bas_dropbox"
            })
        }
    },
    initAddMedia: function(e, t, a, o) {
        var s, i = [],
            r = {
                photo: 3,
                doc: -64
            };
        o = o || {}, each(a || [], function(e, t) {
            if (t[1]) {
                var a = !1;
                switch (t[0]) {
                    case "photo":
                        a = function() {
                            if (o.oneClick) {
                                var e = ge("bug_photo_input"),
                                    t = ge("bugs_view_comments") || curBox() && geByClass1("bugs_new_cont", curBox()
                                        .bodyNode);
                                e || (e = t.appendChild(ce("input", {
                                    type: "file",
                                    multiple: "true",
                                    id: "bug_photo_input",
                                    onchange: function() {
                                        data(this, "changed", !0), curBox()
                                            .inp = this, Bugs.initPhotoUpload("bas_upload")
                                    }
                                }))), e.click()
                            } else Bugs.addScreen(Bugs.initPhotoUpload.pbind("bas_add_data", {
                                hideOnStart: !0
                            }))
                        };
                        break;
                    case "doc":
                        a = function() {
                            if (o.oneClick) {
                                var e = ge("bug_doc_input"),
                                    t = ge("bugs_view_comments") || curBox() && geByClass1("bugs_new_cont", curBox()
                                        .bodyNode);
                                e || (e = t.appendChild(ce("input", {
                                    type: "file",
                                    multiple: "true",
                                    id: "bug_doc_input",
                                    onchange: function() {
                                        data(this, "changed", !0), curBox()
                                            .inp = this, Bugs.initDocUpload("bas_upload")
                                    }
                                }))), e.click()
                            } else Bugs.addDoc(Bugs.initDocUpload.pbind("bas_add_data", {
                                hideOnStart: !0
                            }))
                        }
                }
                var s = !1,
                    n = "3px " + r[t[0]] + "px",
                    d = !1;
                t[1].replace(/\s/g, "&nbsp;");
                i.push([t[0], t[1], n, a, d, s])
            }
        });
        var n = o.limit || 10,
            d = initCustomMedia(e, i, {
                onShow: function() {
                    cur.chooseMedia = s.chooseMedia, cur.showMediaProgress = s.showMediaProgress, cur.attachCount = s.attachCount
                },
                onItemClick: function(e) {
                    return s.attachCount() >= n ? (showFastBox(getLang("global_error"), getLang("attachments_limit", n)), !1) : !0
                }
            });
        if (d) {
            t = t || "media_preview";
            var u, l, c, g = d.id,
                p = ge(t);
            val(p, '<div id="page_pics_preview' + g + '" class="page_pics_preview media_preview clear_fix"></div><div id="page_docs_preview' + g +
                '" class="page_docs_preview media_preview clear_fix"></div><div id="page_progress_preview' + g +
                '" class="page_progress_preview media_preview clear_fix"></div>');
            var l = p.childNodes[0],
                c = p.childNodes[1],
                u = p.childNodes[2];
            return removeClass(p, "media_preview"), addClass(p, "multi_media_preview"), s = {
                _addMediaLink: e,
                lnkId: g,
                menu: d,
                handlers: {},
                chosenMedias: [],
                _showAddMedia: function() {
                    d.show()
                },
                _hideAddMedia: function(e) {
                    d.hide(e)
                },
                chooseMedia: function(e, t, a, i, r) {
                    if (s.onChange && s.onChange(e, t, a) === !1) return !1;
                    if (s.attachCount() >= n && void 0 === a.upload_ind) return !1;
                    var d, g = "",
                        p = "",
                        _ = !1;
                    switch (e) {
                        case "photo":
                            isObject(a) || (a = {
                                    thumb_m: a[0] || "",
                                    thumb_s: a[1] || "",
                                    list: a[2] || "",
                                    view_opts: a[3] || "",
                                    upload_ind: a.upload_ind || void 0
                                }), vkImage()
                                .src = a.thumb_s, d = o.nocl ? "" : " onclick=\"return Bugs.showPhoto('" + t + "', '" + a.list + "', " + a.view_opts.replace(/"/g,
                                    "&quot;") + ');"', g = "<div " + d + ' class="fl_l page_preview_photo"><img class="page_preview_photo" src="' + a.thumb_s +
                                '" /></div>', _ = !0;
                            break;
                        case "doc":
                            if (!a.lang) return !1;
                            a.thumb && a.thumb_s ? (g = '<a target="_blank" href="' + a.href + '" class="fl_l"><div class="page_preview_doc_photo"><img src="' + a.thumb_s +
                                '" align="center"></div><div class="page_preview_doc_photo_hint">' + a.title + "</div></a>", _ = !0) : (g =
                                '<a target="_blank" href="' + a.href + '" class="medadd_h medadd_h_doc inl_bl">' + a.lang.profile_choose_doc + "</a>", p =
                                '<div class="medadd_c medadd_c_doc"><a target="_blank" href="' + a.href + '">' + a.title + "</a></div>")
                    }
                    var h = s.chosenMedias,
                        f = h.length,
                        b = "photos_list" == e ? se('<div class="page_preview_' + e + '_wrap" style="position: relative">' + g + '<div class="page_photos_count">' +
                            t.split(",")
                            .length + "</div></div>") : se('<div class="page_preview_' + e + '_wrap"' + (o.nocl ? ' style="cursor: default"' : "") + ">" + g +
                            '<div class="page_media_x_wrap inl_bl" ' + (browser.msie ? "title" : "tootltip") + '="' + getLang("bugs_dont_attach") +
                            '" onmouseover="if (browser.msie) return; showTooltip(this, {text: this.getAttribute(\'tootltip\'), shift: [13, 3, 3], black: 1})" onclick="cur.addMedia[' +
                            s.lnkId + "].unchooseMedia(" + f + ')"><div class="page_media_x"></div></div>' + p + "</div>");
                    return addClass(b, _ ? "fl_l" : "clear_fix"), void 0 !== a.upload_ind && re("upload" + a.upload_ind + "_progress_wrap"), (_ ? l : c)
                        .appendChild(b), h.push([e, t, b, i]), toggle(l, l.childNodes.length > 0), toggle(c, c.childNodes.length > 0), toggle(u, u.childNodes.length >
                            0), cur.fileApiUploadStarted || r === !0 || boxQueue.hideLast(), cur.lastPostMsg = !1, o.onMediaAdd && o.onMediaAdd(), void 0 !== a.upload_ind &&
                        delete a.upload_ind, !1
                },
                unchooseMedia: function(e) {
                    if (s.onChange && s.onChange(!1, e) === !1) return !1;
                    if (void 0 === e) return void each(s.chosenMedias, function(e, t) {
                        t && void 0 !== e && s.unchooseMedia(e)
                    });
                    var t, a = s.chosenMedias;
                    a[e] && ((t = geByClass1("page_media_x_wrap", a[e][2], "div")) && t.tt && t.tt.el && t.tt.destroy(), re(a[e][2]), a[e] = !1), toggle(l, l.childNodes
                        .length > 0), toggle(c, c.childNodes.length > 0), toggle(u, u.childNodes.length > 0), cur.lastPostMsg = !1, s.onChange && s.onChange(!1)
                },
                showMediaProgress: function(e, t, a) {
                    if (s.onProgress && s.onProgress(e, t, a) === !1) return !1;
                    var o = a.loaded / a.total,
                        i = intval(100 * o),
                        r = (a.fileName || a.name || "")
                        .replace(/[&<>"']/g, ""),
                        n = r ? t + "_" + r : t,
                        d = r ? r.length > 33 ? r.substr(0, 30) + "..." : r : "",
                        l = ge("upload" + n + "_progress");
                    if (l)
                        if (show(l), l.full) {
                            var c = data(l, "tween"),
                                p = intval(l.full * o);
                            c && c.isTweening ? c.to.width = p : animate(l, {
                                width: p + "px"
                            }, 500)
                        } else setStyle(l, {
                            width: i + "%"
                        });
                    else {
                        cur.attachMediaIndexes || (cur.attachMediaIndexes = {}), cur.attachMediaIndexes[n] = g;
                        var _ = '<div class="fl_l"><div class="page_attach_progress_wrap" style="margin-top: 3px; margin-bottom: 4px;">  <div id="upload' + n +
                            '_progress" class="page_attach_progress"></div></div></div></div>' + (d ? '<div class="attach_label fl_l">' + d + "</div>" : "") +
                            '<div class="progress_x fl_l" onmouseover="animate(this, {opacity: 1}, 200); showTooltip(this, {text: \'' + getLang("bugs_dont_attach") +
                            '\', shift: [6, 3, 3]})" onmouseout="animate(this, {opacity: 0.6}, 200);" onclick="Upload.terminateUpload(' + t + ", '" + (r || t) +
                            "');\"></div>";
                        u.appendChild(ce("div", {
                            id: "upload" + n + "_progress_wrap",
                            innerHTML: _,
                            className: "clear_fix upload_" + t + "_progress"
                        }, {
                            marginTop: "6px"
                        })), show(u), l = ge("upload" + n + "_progress"), l.full = !1, i ? setStyle(l, {
                            width: l.full ? intval(l.full * o) + "px" : i + "%"
                        }) : (setStyle(l, {
                            width: "1px"
                        }), hide(l))
                    }
                },
                attachCount: function() {
                    if (s.attachedCount) return s.attachedCount();
                    if (!p) return 0;
                    var e = l.childNodes.length + c.childNodes.length + u.childNodes.length;
                    return e
                }
            }, cur.addMedia || (cur.addMedia = {}), cur.addMedia[g] = s, s
        }
    },
    showMsg: function(e) {
        var t = ge("bugs_msg");
        if (!t) {
            var a;
            switch (cur.section) {
                case "show":
                    a = ge("bugs_content");
                    break;
                case "list":
                    a = ge("bugs_list")
            }
            t = a.insertBefore(ce("div", {
                id: "bugs_msg",
                className: "msg"
            }), a.firstChild)
        }
        return re("bugs_error"), t.innerHTML = e, t.style.backgroundColor = "#F4EBBD", animate(t, {
            backgroundColor: "#F9F6E7"
        }, 2e3), !0
    },
    showError: function(e) {
        var t = ge("bugs_error");
        if (!t) {
            var a;
            switch (cur.section) {
                case "show":
                    a = ge("bugs_content");
                    break;
                case "list":
                    a = ge("bugs_list")
            }
            t = a.insertBefore(ce("div", {
                id: "bugs_error",
                className: "error"
            }), a.firstChild)
        }
        return re("bugs_msg"), hide("bugs_progress"), t.innerHTML = e, t.style.backgroundColor = "#FACEBB", animate(t, {
            backgroundColor: "#FFEFE8"
        }, 2e3), scrollToTop(200), !0
    },
    showDeleteBox: function() {
        return !showFastBox({
            title: getLang("bugs_delete_bug_title"),
            dark: 1,
            bodyStyle: "border: 0px; padding: 0px;",
            width: 460,
            hideButtons: !0
        }, getLang("bugs_sure_delete_bug"))
    },
    showEditBox: function() {
        return !showBox("bugs", {
            act: "edit_box",
            id: cur.bug_id
        }, {
            stat: ["wide_dd.js", "wide_dd.css", "page.css", "page.js", "upload.js"],
            dark: 1,
            params: {
                width: 500,
                hideButtons: !0,
                bodyStyle: "border: 0px; padding: 0px"
            }
        })
    },
    showStatusBox: function() {
        return !showBox("bugs", {
            act: "status_box",
            id: cur.bug_id
        }, {
            stat: ["ui_controls.js", "ui_controls.css"],
            dark: 1,
            params: {
                width: 500,
                hideButtons: !0,
                bodyStyle: "border: 0px; padding: 0px"
            }
        })
    },
    saveStatus: function() {
        var e = {
            act: "status",
            hash: cur.hashes.save_hash,
            status: cur.statusSelect.val(),
            id: cur.bug_id,
            text: val("bugs_new_text")
        };
        return ajax.post("bugs", e, {
            showProgress: lockButton.pbind("bugs_submit_button"),
            hideProgress: function() {
                curBox() && curBox()
                    .hide()
            },
            onDone: function(e, t, a) {
                e && (ge("bugs_view_description")
                    .innerHTML = e), t && (ge("bugs_view_data")
                    .innerHTML = t), a && Bugs.showMsg(a)
            },
            onFail: function(e) {
                return Bugs.showError(e)
            }
        }), !1
    },
    declineToSupport: function(e, t) {
        if (cur.declineStarted || !e || !t) return !1;
        cur.declineStarted = !0;
        var a = {
            act: "status",
            hash: e,
            status: 4,
            id: cur.bug_id,
            text: t
        };
        return ajax.post("bugs", a, {
            hideProgress: function() {
                cur.declineStarted = !1
            },
            onDone: function(e, t, a) {
                e && (ge("bugs_view_description")
                    .innerHTML = e), t && (ge("bugs_view_data")
                    .innerHTML = t), a && Bugs.showMsg(a)
            },
            onFail: function(e) {
                return Bugs.showError(e)
            }
        }), !1
    },
    deleteBug: function(e) {
        ajax.post("bugs", {
            act: "delete",
            id: cur.bug_id,
            hash: cur.hashes.delete_hash
        }, {
            showProgress: lockButton.pbind(e),
            hideProgress: function() {
                curBox() && curBox()
                    .hide()
            }
        })
    },
    deleteReply: function(e, t) {
        var a = ge("bug_update" + e);
        if (a) return ajax.post("bugs", {
            act: "delete_reply",
            id: e,
            hash: t
        }, {
            onDone: function(t) {
                cur.deletedReplies = cur.deletedReplies || {}, cur.deletedReplies[e] = a.innerHTML, a.innerHTML = t
            },
            onFail: function(e) {
                return Bugs.showError(e)
            }
        }), !1
    },
    restoreReply: function(e, t) {
        var a = ge("bug_update" + e);
        if (a) return ajax.post("bugs", {
            act: "restore_reply",
            id: e,
            hash: t
        }, {
            onDone: function() {
                a.innerHTML = (cur.deletedReplies || {})[e]
            },
            onFail: function(e) {
                return Bugs.showError(e)
            }
        }), !1
    },
    editReply: function(e, t) {
        if (cur.editStarted) return !1;
        cur.editing && this.cancelEditReply(cur.editing);
        var a = geByClass1("bugs_update_text", ge("bug_update" + e)),
            o = "1px 0 0 -3px",
            s = "385px",
            i = "8px";
        return browser.mozilla ? o = "1px 0 0 -4px" : browser.opera ? o = "2px 0 0 -3px" : browser.msie && (i = "10px"), cur.editStarted = !0, ajax.post("bugs", {
            act: "get_reply",
            id: e,
            hash: t
        }, {
            onDone: function(r) {
                delete cur.editStarted, a.parentNode.insertBefore(ce("div", {
                    id: "bug_update_edit" + e,
                    innerHTML: '<textarea class="bug_edit_update" id="bug_update' + e + 'edit" onkeydown="Bugs.saveReply(event, \'' + e + "', '" +
                        t + '\')" style="width: ' + s + "; margin: " + o + ';">' + r + '</textarea><div style="margin: ' + i +
                        ' 0 8px -3px; height: 23px">  <div class="fl_l button_blue">    <button id="save_butn' + e +
                        '" onclick="Bugs.doSaveReply(\'' + e + "', '" + t + "')\">" + getLang("global_save") +
                        '</button>  </div>  <div class="fl_l button_gray" style="margin-left: 10px;">    <button id="cancel_butn' + e +
                        '" onclick="Bugs.cancelEditReply(\'' + e + "')\">" + getLang("global_cancel") + '</button>  </div>  <div id="edit_progress' +
                        e +
                        '" style="margin: 5px 0px 0px 10px; vertical-align: 0px; float: left; display: none"><img src="/images/upload.gif"/></div></div>'
                }, {
                    display: "none"
                }), a), autosizeSetup(ge("bug_update" + e + "edit"), {
                    minHeight: 17
                }), setTimeout(function() {
                    show(a.previousSibling), hide(geByClass1("bugs_update_text", ge("bug_update" + e))), hide(geByClass1("bugs_update_info", ge(
                        "bug_update" + e))), elfocus("bug_update" + e + "edit"), cur.editing = e
                }, 0)
            },
            onFail: function(e) {
                return delete cur.editStarted, Bugs.showError(e)
            }
        }), !1
    },
    saveReply: function(e, t, a) {
        return e && 27 == e.keyCode ? void this.cancelEditReply(cur.editing) : void(e && e.ctrlKey && (10 == e.keyCode || 13 == e.keyCode) && this.doSaveReply(t, a))
    },
    cancelEditReply: function(e) {
        show(geByClass1("bugs_update_text", ge("bug_update" + e))), show(geByClass1("bugs_update_info", ge("bug_update" + e))), re("bug_update_edit" + e), delete cur.editing
    },
    doSaveReply: function(e, t) {
        var a = trim(val("bug_update" + e + "edit"));
        ajax.post("bugs", {
            act: "edit_reply",
            id: e,
            text: a,
            hash: t
        }, {
            onDone: function(t) {
                var a = geByClass1("bugs_update_text", ge("bug_update" + e)),
                    o = geByClass1("bugs_update_info", ge("bug_update" + e));
                a.innerHTML = t, show(a, o), re("bug_update_edit" + e), delete cur.editing
            },
            onFail: function(e) {
                return Bugs.showError(e)
            },
            showProgress: lockButton.pbind(ge("save_butn" + e)),
            hideProgress: unlockButton.pbind(ge("save_butn" + e))
        })
    },
    showPhoto: function(e, t, a) {
        var o = curBox();
        cur.boxBackup = document.createDocumentFragment();
        var s = o.bodyNode;
        return cur.scrollTopBack = boxLayerWrap.scrollTop, a.onShow = function() {
            for (; s.firstChild;) cur.boxBackup.appendChild(s.firstChild)
        }, a.onHide = function() {
            box = showFastBox("", ""), box.setOptions({
                hideButtons: !0,
                title: !1,
                width: 500,
                bodyStyle: "border: 0px; padding: 0px;"
            }), box.bodyNode.appendChild(cur.boxBackup), box.setOptions({}), boxLayerWrap.scrollTop = cur.scrollTopBack
        }, showPhoto(e, t, a)
    },
    selectTag: function(e, t) {
        return checkEvent(t) || "subscriptions" == cur.type ? !1 : (cur.tags = cur.tags || {}, cur.tags[e] = 1, addClass(ge("filter_tag" + e), "summary_tab_sel"),
            removeClass(ge("filter_tag" + e), "summary_tab"), ge("bugs_selected_tags")
            .appendChild(ge("filter_tag" + e)), toggle("selected_tags_wrap", geByClass("bugs_filter_tag", ge("bugs_selected_tags"))
                .length), toggle("tags_wrap", geByClass("bugs_filter_tag", ge("bugs_tags"))
                .length), void Bugs.updateAllSearch(ge("bugs_search_input"), t))
    },
    deselectTag: function(e, t) {
        return checkEvent(t) || "subscriptions" == cur.type ? !1 : (delete cur.tags[e], removeClass(ge("filter_tag" + e), "summary_tab_sel"), addClass(ge("filter_tag" + e),
                "summary_tab"), ge("bugs_tags")
            .appendChild(ge("filter_tag" + e)), toggle("selected_tags_wrap", geByClass("bugs_filter_tag", ge("bugs_selected_tags"))
                .length), toggle("tags_wrap", geByClass("bugs_filter_tag", ge("bugs_tags"))
                .length), void Bugs.updateAllSearch(ge("bugs_search_input"), t))
    },
    showSubscribed: function(e) {
        return !showBox("bugs", {
            act: "subscribers_box",
            id: e || cur.bug_id
        }, {
            dark: 1,
            params: {
                width: 500,
                bodyStyle: "padding: 0px"
            }
        })
    },
    registerDragZone: function(e) {
        addEvent(document, "dragenter dragover", function(t) {
            return Bugs.checkHtml5Uploader() ? (setTimeout(function() {
                clearTimeout(cur.dragTimer), delete cur.dragTimer
            }, 0), e.on(t), cancelEvent(t)) : void 0
        }), addEvent(document, "dragleave", function(t) {
            cur.dragTimer && (clearTimeout(cur.dragTimer), delete cur.dragTimer), cur.dragTimer = setTimeout(function() {
                e.un(t)
            }, 100), cancelEvent(t)
        }), addEvent(document, "drop", function(t) {
            return e.un(t, !0), e.drop(t.dataTransfer.files, t), cancelEvent(t)
        }), cur.destroy.push(function() {
            removeEvent(document, "dragenter dragover"), removeEvent(document, "dragleave"), removeEvent(document, "drop")
        })
    },
    toggleBugDescription: function(e) {
        return animate(e, {
            marginBottom: 0,
            height: 0
        }, 200, re.pbind(e)), slideDown(ge("bugs_new_text_wrap"), 200), elfocus("bugs_new_text"), !1
    },
    checkHtml5Uploader: function() {
        return (window.XMLHttpRequest || window.XDomainRequest) && (window.FormData || window.FileReader && (window.XMLHttpRequest && XMLHttpRequest.sendAsBinary || window
            .ArrayBuffer && window.Uint8Array && (window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)))
    },
    _eof: 1
};
try {
    stManager.done("bugs.js")
} catch (e) {}
