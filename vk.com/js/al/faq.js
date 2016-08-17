FAQ = {
    getSectionExtend: function() {
        if (nav.objLoc.hasOwnProperty("section")) return {
            section: nav.objLoc.section
        };
        var e = ge("current_section");
        return e ? {
            section: val(e)
        } : {}
    },
    switchSubTab: function(e, t, a) {
        return checkEvent(a) || hasClass(e, "active") ? !1 : (each(geByClass("faq_subtab1", ge("faq_subtabs")), function(e, t) {
            removeClass(t, "active")
        }), addClass(e, "active"), show("faq_subtabs_progress"), nav.go(t, a))
    },
    showMsg: function(e) {
        var t = ge("faq_msg");
        if (!t) {
            var a;
            switch (cur.section) {
                case "all":
                    a = cur.tlmd ? ge("tlmd_found_list") : ge("faq_list");
                    break;
                case "new":
                    a = ge("faq_msg_p"), show("faq_msg_p");
                    break;
                case "tiles":
                    a = ge("faq_tiles_editor");
                    break;
                case "sort":
                    a = ge("faq_sort_editor")
            }
            t = a.insertBefore(ce("div", {
                id: "faq_msg",
                className: "info_msg"
            }), a.firstChild)
        }
        return re("faq_error"), t.innerHTML = e, !0
    },
    showError: function(e) {
        var t = ge("faq_error");
        if (!t) {
            var a;
            switch (cur.section) {
                case "all":
                    a = ge("faq_list");
                    break;
                case "new":
                case "edit":
                    a = ge("faq_msg_p"), show("faq_msg_p")
            }
            t = a.insertBefore(ce("div", {
                id: "faq_error",
                className: "error"
            }), a.firstChild)
        }
        return re("faq_msg"), hide("faq_progress"), t.innerHTML = e, t.style.backgroundColor = "#FACEBB", animate(t, {
            backgroundColor: "#FFEFE8"
        }, 2e3), scrollToTop(200), !0
    },
    handleTagsPos: function() {
        if (!ge("faq_tags_td")) return !1;
        var e = scrollGetY(),
            t = window.lastWindowHeight || 0,
            a = 0,
            i = ge("faq_tags_td"),
            o = getXY(i)[1],
            r = getSize(i)[1],
            s = ge("faq_tags"),
            l = (getXY(s)[1], getSize(s)[1]),
            n = Math.max(0, e + t - r - o),
            d = 20 > r - l,
            _ = cur.filterLastPos || 0,
            c = cur.lastSt || 0,
            f = getSize("page_header_cont")[1];
        e > o && !d ? (addClass(s, "fixed"), a = t > l ? Math.min(f, t - l - n) : Math.max(Math.min(f, _ + c - e), t - l - n)) : (removeClass(s, "fixed"), a = 0), cur.filterLastPos =
            a, cur.lastSt = e, setStyle(s, {
                top: a + "px"
            })
    },
    selectTag: function(e, t) {
        cur.tagsDD.addTag("#" + e), scrollToTop()
    },
    toggleAllRows: function(e) {
        cur.faqRowsOpened = !cur.faqRowsOpened, each(geByClass("faq_row", "tlmd_found_list"), setTimeout.pbind(function(e, t) {
            var a = t.id.substr(7);
            a && toggleClass(geByClass1("faq_inner_row", t), "detailed", cur.faqRowsOpened)
        }, 0)), toggleClass(e, "shown")
    },
    checkTextLength: function(e, t, a) {
        var i = trim(e.value)
            .replace(/\n\n\n+/g, "\n\n");
        if (e.lastLen !== i.length) {
            var o = e.lastLen = i.length,
                r = o - i.replace(/\n/g, "")
                .length;
            a = ge(a), o > t - 100 || r > 10 ? (show(a), o > t ? a.innerHTML = getLang("global_recommended_exceeded", o - t) : r > 10 ? a.innerHTML = getLang(
                "global_recommended_lines", r - 10) : a.innerHTML = getLang("text_N_symbols_remain", t - o)) : hide(a)
        }
    },
    appendExtraField: function(e) {
        var t = ge("faq_optional_extra_fields_list"),
            a = ge("faq_optional_extra_field_example");
        if (t) {
            for (var i = a.cloneNode(!0), o = 0; ge("faq_optional_extra_field_" + o);) o++;
            i.id = "faq_optional_extra_field_" + o, t.appendChild(i);
            var r = geByClass1("faq_optional_extra_field_type__inp", i);
            r.id = i.id + "_type";
            var s = geByClass1("faq_optional_extra_field__title", i);
            s.id = i.id + "_title", placeholderSetup(s, {
                back: !0
            });
            var l = geByClass1("faq_optional_extra_field__note", i);
            l.id = i.id + "_note", placeholderSetup(l, {
                back: !0
            });
            var n = geByClass1("faq_optional_extra_field_required__inp", i);
            n.id = i.id + "_required", t.children.length >= 10 && hide(e), FAQ.prepareExtraField(i, r, n, s, l)
        }
    },
    prepareExtraField: function(e, t, a, i, o) {
        var r = new Dropdown(t, cur.selData.extra_field_types, {
            width: 191,
            introText: "",
            noResult: "",
            multiselect: !1,
            autocomplete: !1,
            big: 1
        });
        data(e, "typeSelector", r), placeholderSetup(i, {
            back: !0
        }), placeholderSetup(o, {
            back: !0
        });
        var s = new Dropdown(a, cur.selData.extra_field_required_types, {
            width: 191,
            introText: "",
            noResult: "",
            multiselect: !1,
            autocomplete: !1,
            big: 1
        });
        data(e, "requiredSelector", s);
        var l = geByClass1("faq_optional_extra_field__close", e);
        addEvent(l, "click", FAQ.removeExtraField.pbind(e))
    },
    removeExtraField: function(e) {
        var t = data(e, "typeSelector");
        t.destroy.bind(t)(), re(e), show("faq_optional_extra_field_add")
    },
    destroyExtraFields: function() {
        for (var e = 0; 10 > e; e++) {
            var t = ge("faq_optional_extra_field_" + e);
            if (t) {
                var a = data(t, "typeSelector"),
                    i = data(t, "requiredSelector");
                a.destroy.bind(a)(), i.destroy.bind(i)()
            }
        }
    },
    saveFAQ: function(e) {
        var t = trim(val("faq_title")),
            a = trim(val("faq_text")),
            i = trim(val("faq_keywords")),
            o = trim(val("faq_description"));
        if (!t) return notaBene("faq_title");
        var r = [];
        if (cur.screens)
            for (var s in cur.screens) r.push(cur.screens[s][0]);
        if (!a && !r.length) return notaBene("faq_text");
        var l = cur.langsDD && cur.langsDD.val() || 0,
            n = {
                act: "save",
                title: t,
                text: a,
                keywords: i,
                description: o,
                hash: e,
                imgs: r,
                faq_id: cur.id,
                fixed: isChecked("fix_faq"),
                urgent: isChecked("urgent_faq"),
                server: trim(val("faq_server")),
                id_mask: trim(val("faq_id_mask")),
                cdn: trim(val("faq_cdn")),
                language: l,
                parent_id: l ? cur.parentId : 0,
                about_phone: isChecked("faq_about_phone"),
                about_profile: isChecked("faq_about_profile"),
                about_group: isChecked("faq_about_group"),
                about_email: isChecked("faq_about_email"),
                hidden: isChecked("hidden_faq"),
                disable_have_question: isChecked("disable_have_question_faq")
            };
        if (cur.sectionSelector) {
            if (n.section = intval(cur.sectionSelector.val()), 0 == n.section || 39 == n.section) {
                var d = cur.desktopCategorySelector.val();
                n.categories = d, n.spec_section = cur.specSectionSelector.val()
            } else if (31 == n.section) {
                var _ = cur.platformSelector.val();
                if (!_) return elfocus(cur.platformSelector.input), notaBene(cur.platformSelector.selector);
                n.platforms = _;
                var d = cur.categorySelector.val();
                if (!d) return elfocus(cur.categorySelector.input), notaBene(cur.categorySelector.selector);
                n.categories = d
            }
        } else ge("default_section") && (n.section = val("default_section"));
        if (cur.actionButtonSelector && (n.action_id = intval(cur.actionButtonSelector.val()), 0 != n.action_id && (n.action_label = ge("faq_action_btn_label")
                .value.trim()), 7 == n.action_id)) {
            if (!n.action_label) return elfocus("faq_action_btn_label"), notaBene("faq_action_btn_label");
            if (n.action_url = ge("faq_action_btn_url")
                .value.trim(), !n.action_url) return elfocus("faq_action_btn_url"), notaBene("faq_action_btn_url")
        }
        if (ge("faq_optional_extra_field_add") && (!cur.sectionSelector || 0 == cur.sectionSelector.val() || 39 == cur.sectionSelector.val())) {
            for (var c = {}, f = ge("faq_optional_extra_fields_list")
                    .children, s = 0; s < f.length; s++) {
                var u = f[s];
                c["ef_" + s + "_type"] = data(u, "typeSelector")
                    .val(), c["ef_" + s + "_title"] = geByClass1("faq_optional_extra_field__title", u)
                    .value, c["ef_" + s + "_note"] = geByClass1("faq_optional_extra_field__note", u)
                    .value, c["ef_" + s + "_required"] = data(u, "requiredSelector")
                    .val()
            }
            n = extend(n, c)
        }
        if (ge("description_not_needed") && (n.descr_not_needed = isChecked("description_not_needed")), ge("description_placeholder_key") && (n.description_placeholder_key =
                val("description_placeholder_key")), ge("description_tooltip_key") && (n.description_tooltip_key = val("description_tooltip_key")), cur.faqFromAllCheckbox &&
            cur.faqFromCheckboxes) {
            var p = [],
                g = cur.faqFromAllCheckbox.val();
            g ? p.push(g) : each(cur.faqFromCheckboxes, function(e, t) {
                var a = t.val();
                a && p.push(a)
            }), n.from_list = p.join(",")
        }
        ajax.post(nav.objLoc[0], n, {
            onFail: FAQ.showError,
            showProgress: lockButton.pbind(ge("faq_send")),
            hideProgress: unlockButton.pbind(ge("faq_send"))
        })
    },
    toggleUrgent: function(e) {
        checkbox(e), isChecked(e) ? slideDown("faq_from_chb_list", 300) : slideUp("faq_from_chb_list", 300)
    },
    addScreen: function(e) {
        showFastBox({
                title: getLang("support_adding_screen"),
                width: 440,
                bodyStyle: "padding: 0px"
            }, '<div class="fis_box">  <div class="info_msg fis_about">' + getLang("support_screen_you_can") +
            '</div>  <div id="fis_add_data"></div>  <div class="fis_warn_text">' + getLang("support_screen_warn") +
            '</div>  <div id="fis_dropbox" class="dropbox">    <div class="dropbox_wrap">      <div class="dropbox_area">' + getLang("drop_files_here") +
            "</div>    </div>  </div></div>  "), stManager.add("upload.js", FAQ.initUpload.pbind(e))
    },
    attachCount: function(e) {
        var t = ge("fis_preview" + (e ? "_edit" : "")),
            a = ge("fis_prg_preview" + (e ? "_edit" : ""));
        return t.childNodes.length + a.childNodes.length
    },
    unchoose: function(e, t) {
        re("fis_preview" + e), t ? delete cur.screensEdit[e] : delete cur.screens[e], toggle("fis_add_lnk" + (t ? "_edit" : ""), FAQ.attachCount(t) < 5)
    },
    choose: function(e, t, a, i) {
        var o = "",
            r = ge("fis_preview" + (t ? "_edit" : ""));
        ge("fis_prg_preview" + (t ? "_edit" : ""));
        isObject(i) || (i = {
                thumb_m: i[0] || "",
                thumb_s: i[1] || "",
                list: i[2] || "",
                view_opts: i[3] || "",
                upload_ind: i.upload_ind || void 0
            }), vkImage()
            .src = i.thumb_s, o = "<div onclick=\"return showPhoto('" + a + "', '" + i.list + "', " + i.view_opts.replace(/"/g, "&quot;") +
            ');" class="fl_l fis_preview"><img class="fis_photo" src="' + i.thumb_s + '" /></div>';
        var s = ce("div", {
                innerHTML: '<div id="fis_preview' + e + '" class="fis_preview_wrap">' + o + '<div class="fis_x fl_l" ' + (browser.msie ? "title" : "tooltip") + '="' +
                    getLang("dont_attach") +
                    '" onmouseover="if (browser.msie) return; showTooltip(this, {text: this.getAttribute(\'tooltip\'), shift: [6, 3, 3]})" onclick="FAQ.unchoose(\'' +
                    e + "'" + (t ? ", 1" : "") + ')"></div></div>'
            })
            .firstChild;
        addClass(s, "fl_l"), re("upload" + e + "_progress_wrap"), r.appendChild(s), t ? cur.screensEdit[e] = [a, s] : cur.screens[e] = [a, s], cur.fileApiUploadStarted ||
            boxQueue.hideLast(), toggle("fis_add_lnk" + (t ? "_edit" : ""), FAQ.attachCount(t) < 5)
    },
    chooseUploaded: function(e, t) {
        var a = void 0 !== e.ind ? e.ind : e,
            i = (e.fileName ? e.fileName : e, e.fileName ? a + "_" + e.fileName : e);
        if (ge("upload" + i + "_progress_wrap")) {
            var o = geByClass1("fis_prg_x", ge("upload" + i + "_progress_wrap"));
            o && hide(o)
        }
        ajax.post("al_photos.php", extend({
            act: "choose_uploaded_support"
        }, t), {
            onDone: FAQ.choose.pbind(i, Upload.options[a].forEdit),
            onFail: FAQ.chooseFail.pbind(e),
            progress: "form" == Upload.types[a] && curBox() ? curBox()
                .progress : null
        })
    },
    chooseFail: function(e, t) {
        var a = void 0 !== e.ind ? e.ind : e,
            i = (e.fileName ? e.fileName : e, Upload.options[a].forEdit);
        if ("fileApi" == Upload.types[a]) {
            var o = e.fileName ? a + "_" + e.fileName : e;
            re("upload" + o + "_progress_wrap"), FAQ.unchoose(o, i)
        }
        curBox() && hide(curBox()
            .progress), topError("Upload failed", {
            dt: -1,
            type: 102,
            url: (ge("file_uploader_form" + a) || {})
                .action
        }), Upload.embed(a), toggle("fis_add_lnk" + (i ? "_edit" : ""), FAQ.attachCount(i) < 5)
    },
    showScreenProgress: function(e, t) {
        var a = Upload.options[e].forEdit,
            i = ge("fis_prg_preview" + (a ? "_edit" : "")),
            o = intval(t.loaded / t.total * 100),
            r = t.fileName || t.name || "",
            s = r ? e + "_" + r : e,
            l = r ? r.length > 33 ? r.substr(0, 30) + "..." : r : "";
        if (i) {
            if (ge("upload" + s + "_progress_wrap")) setStyle(ge("upload" + s + "_progress"), {
                width: o + "%"
            }), show("upload" + s + "_progress");
            else {
                var n = '<div class="fis_progress_wrap">  <div id="upload' + s + '_progress" class="fis_progress" style="width: ' + o + '%;"></div></div></div>',
                    d = ce("div", {
                        id: "upload" + s + "_progress_wrap",
                        innerHTML: '<div class="fl_l">' + n + "</div>" + (l ? '<div class="fis_label fl_l">' + l + "</div>" : "") +
                            '<div class="fis_prg_x fl_l" onmouseover="animate(this, {opacity: 1}, 200); showTooltip(this, {text: \'' + getLang("dont_attach") +
                            '\', shift: [6, 3, 3]})" onmouseout="animate(this, {opacity: 0.6}, 200);" onclick="Upload.terminateUpload(' + e + ", '" + (r || e) +
                            "');\"></div>",
                        className: "clear_fix"
                    }, {
                        marginTop: "6px"
                    });
                i.appendChild(d), show(i), toggle("fis_add_lnk" + (a ? "_edit" : ""), FAQ.attachCount(a) < 5), o || hide("upload" + s + "_progress")
            }
            return !1
        }
    },
    initUpload: function(forEdit) {
        if (ge("fis_add_data")) {
            cur.screens || (cur.screens = {});
            var opts = cur.uploadData.options;
            Upload.init("fis_add_data", cur.uploadData.url, cur.uploadData.vars, {
                file_name: "photo",
                file_size_limit: 5242880,
                file_types_description: "Image files (*.jpg, *.jpeg, *.png, *.gif)",
                file_types: "*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG;*.gif;*.GIF",
                accept: "image/jpeg,image/png,image/gif",
                file_match: ".(gif|jpg|png)$",
                lang: opts.lang,
                onUploadStart: function(e, t) {
                    var a = void 0 !== e.ind ? e.ind : e,
                        i = Upload.options[a];
                    "form" == Upload.types[a] && (curBox() && show(curBox()
                            .progress), geByClass1("file", ge("fis_add_data"))
                        .disabled = !0), "fileApi" == Upload.types[a] && (cur.notStarted && (curBox()
                        .hide(), delete cur.notStarted), i.multi_progress && this.onUploadProgress(e, 0, 0))
                },
                onUploadComplete: function(info, res) {
                    var params, i = void 0 !== info.ind ? info.ind : info,
                        fileName = info.fileName ? info.fileName : info;
                    try {
                        params = eval("(" + res + ")")
                    } catch (e) {
                        params = q2ajx(res)
                    }
                    if (!params.photos) return void Upload.onUploadError(info);
                    var options = Upload.options[i];
                    FAQ.chooseUploaded(info, params)
                },
                onUploadProgress: function(e, t, a) {
                    var i = void 0 !== e.ind ? e.ind : e;
                    if ("fileApi" == Upload.types[i]) {
                        var o = {
                            loaded: t,
                            total: a
                        };
                        e.fileName && (o.fileName = e.fileName), FAQ.showScreenProgress(i, o)
                    }
                },
                onUploadError: FAQ.chooseFail,
                noFlash: 1,
                multiple: 1,
                multi_progress: 1,
                max_files: 5 - FAQ.attachCount(forEdit),
                clear: 1,
                type: "photo",
                max_attempts: 3,
                server: opts.server,
                error: opts.default_error,
                error_hash: opts.error_hash,
                dropbox: "fis_dropbox",
                forEdit: forEdit
            })
        }
    },
    deleteFAQ: function(e, t) {
        var a = showFastBox({
            title: cur.lang.delete_title,
            width: 430
        }, cur.lang.delete_confirm, cur.lang["delete"], function() {
            ajax.post(nav.objLoc[0], {
                act: "delete",
                faq_id: e,
                hash: t
            }, {
                progress: a.progress,
                onFail: function(e) {
                    return a.hide(), FAQ.showError(e), !0
                }
            })
        }, getLang("global_cancel"));
        return !1
    },
    toggleRow: function(e, t, a) {
        return a.target || (a.target = a.srcElement || document), "a" == a.target.tagName.toLowerCase() ? !0 : (toggle("faq_short_text" + e, !isVisible("faq_short_text" +
            e)), toggle("faq_full_text" + e, !isVisible("faq_full_text" + e)), isVisible("faq_full_text" + e) ? (addClass(t, "detailed"), cur.tlmd && ajax.post(nav
            .objLoc[0], {
                act: "faq_clicked",
                faq_id: e,
                hash: cur.faq_hash
            }, {
                cache: 1
            })) : removeClass(t, "detailed"), !1)
    },
    toggleRowPrevent: function(e, t) {
        var a = gpeByClass("faq_inner_row", t);
        hasClass(a, "detailed") && e.target && "a" != e.target.tagName.toLowerCase() && cancelEvent(e)
    },
    setSearchString: function(e, t, a) {
        FAQ.updateSearchString(t, a, !0)
    },
    updateSearchString: function(e, t, a) {
        cur.prevSearch = cur.prevSearch || "", e = trim(e), (cur.prevSearch != e || !e || a) && (clearTimeout(cur.searchTimeout), a ? (cur.prevSearch = e, FAQ.updateSearch(
            e)) : cur.searchTimeout = setTimeout(function() {
            cur.prevSearch = e, FAQ.updateSearch(e)
        }, 350))
    },
    updateSearchCheckbox: function() {
        FAQ.updateSearch(ge("faq_content_search__text")
            .value.trim())
    },
    updateSearch: function(e) {
        var t = nav.objLoc;
        e ? t.q = e : delete t.q, isChecked("search_disabled") ? t.disabled = 1 : delete t.disabled, isChecked("search_expired") ? t.expired = 1 : delete t.expired,
            isChecked("search_with_action") ? t.with_action = 1 : delete t.with_action, isChecked("search_with_ef") ? t.with_ef = 1 : delete t.with_ef, nav.setLoc(t);
        var a = extend({}, t);
        a.act = "load_list", delete a[0], ajax.post(nav.objLoc[0], a, {
            showProgress: uiSearch.showProgress.pbind("faq_content_search__text"),
            hideProgress: uiSearch.hideProgress.pbind("faq_content_search__text"),
            onDone: function(e) {
                var t = se(e),
                    a = ge("faq_list");
                a.parentNode.replaceChild(t, a)
            }
        })
    },
    saveTilesTop: function(e, t, a) {
        var i = {
            act: "save_tiles",
            lang: t,
            hash: a
        };
        each(geByClass("faq_tiles_editor_tile__questions", ge("faq_tiles_editor__tiles")), function(e, t) {
            var a = [];
            each(t.children, function(e, t) {
                a.push(t.id.replace("faq_tiles_editor_tile_question", ""))
            });
            var o = t.id.replace("faq_tiles_editor_tile__questions", "");
            i["faq" + o] = a.join(",")
        }), ajax.post(nav.objLoc[0], i, {
            showProgress: function() {
                addClass(e, "flat_btn_lock")
            },
            hideProgress: function() {
                removeClass(e, "flat_btn_lock")
            }
        })
    },
    tilesShowSearch: function(e, t) {
        hide(e.target);
        var a = ge("faq_tiles_editor_tile_search__input" + t);
        return show(a), geByClass1("selector_input", a)
            .focus(), !1
    },
    tilesQuestionRemove: function(e, t) {
        var a = ge("faq_tiles_editor_tile_question" + e),
            i = a.parentNode,
            o = i.id.replace("faq_tiles_editor_tile__questions", "");
        FAQ.tilesSorterDestroy(i), re(a), sorter.init(i, {}), i.hasChildNodes() || hide(i), geByClass("faq_tiles_editor_tile_question", i)
            .length < cur.perCategoryLimit && show("faq_tiles_editor_tile_search" + o), t && t.stopPropagation()
    },
    tilesQuestionAdd: function(e, t, a) {
        if (t) {
            var i = ge("faq_tiles_editor_tile_question" + t);
            i && FAQ.tilesQuestionRemove(t);
            var i = ce("div", {
                className: "faq_tiles_editor_tile_question",
                id: "faq_tiles_editor_tile_question" + t
            });
            i.innerHTML = '<span class="faq_tiles_editor_tile_question__title">' + a +
                '</span>    <span class="faq_tiles_editor_tile_question__remove" onclick="FAQ.tilesQuestionRemove(' + t + ', event);"></span>';
            var o = ge("faq_tiles_editor_tile__questions" + e);
            show(o), FAQ.tilesSorterDestroy(o), o.appendChild(i), sorter.init(o, {}), geByClass("faq_tiles_editor_tile_question", o)
                .length >= cur.perCategoryLimit && hide("faq_tiles_editor_tile_search" + e)
        }
    },
    tilesSorterDestroy: function(e) {
        e.sorter.destroy(), each(geByClass("faq_tiles_editor_tile_question", e), function(e, t) {
            t.removeAttribute("style")
        })
    },
    saveQuestionsSort: function(e, t, a, i, o) {
        var r = {
                act: "save_sort",
                lang: t,
                category: a,
                hash: i
            },
            s = [];
        o || each(geByClass("faq_sort_editor_question", ge("faq_sort_editor__questions")), function(e, t) {
            s.push(t.id.replace("faq", ""))
        }), r.ids = s.join(","), ajax.post(nav.objLoc[0], r, {
            showProgress: function() {
                addClass(e, "flat_btn_lock")
            },
            hideProgress: function() {
                removeClass(e, "flat_btn_lock")
            }
        })
    },
    sortQuestionsReorder: function(e) {
        var t = e.getAttribute("position"),
            a = FAQ.sortQuestionsGetPosition(e);
        t != a ? addClass(e, "faq_sort_editor_question_moved") : removeClass(e, "faq_sort_editor_question_moved"), each(geByClass("faq_sort_editor_question_moved", ge(
            "faq_sort_editor_question")), function(e, t) {
            var a = t.getAttribute("position"),
                i = FAQ.sortQuestionsGetPosition(t);
            a == i && removeClass(t, "faq_sort_editor_question_moved")
        })
    },
    sortQuestionsGetPosition: function(e) {
        for (var t = 0, a = e; a;) t++, a = a.previousSibling;
        return Math.floor(t / 2) - 1
    },
    saveDictionary: function(e, t, a) {
        hide("faq_dictionary__submit_note"), ajax.post(nav.objLoc[0], {
            act: "dictionary_save",
            lang: t,
            hash: a,
            beginning_words: val("faq_dictionary__beginning_words"),
            middle_words: val("faq_dictionary__middle_words")
        }, {
            onDone: function(e, t) {
                val("faq_dictionary__beginning_words", e), val("faq_dictionary__middle_words", t), show("faq_dictionary__submit_note"), setTimeout(function() {
                    fadeOut("faq_dictionary__submit_note", 500)
                }, 3e3)
            },
            showProgress: function() {
                addClass(e, "processing")
            },
            hideProgress: function() {
                removeClass(e, "processing")
            }
        })
    },
    showHistory: function(e, t, a) {
        return !showBox(nav.objLoc[0], {
            act: "show_history",
            id: e,
            faq_id: t,
            hash: a
        }, {
            params: {
                bodyStyle: "padding: 0px",
                width: 650
            }
        })
    },
    updateFAQ: function(e, t) {
        clearTimeout(cur.faqTimeout), cur.faqTimeout = setTimeout(function() {
            var e = t.value,
                a = trim(e),
                i = a.split(" "),
                o = ge("tickets_text");
            e.length >= 70 && o && !o.value && !cur.flood && (isVisible("tickets_detailed_form") || FAQ.toggleDetailedForm(), t.value = "", o.focus(), o.value = e),
                isVisible("tickets_detailed_form") || a == cur.searchStr && (i.length < 4 || 4 == i.length && " " != e[e.length - 1]) || (a ? addClass(ge(
                        "tickets_search_reset"), "shown") : removeClass(ge("tickets_search_reset"), "shown"), cur.searchStr = a, clearTimeout(cur.searchFAQTimeout),
                    cur.searchFAQTimeout = setTimeout(function() {
                        FAQ.searchFAQ(cur.searchStr)
                    }.bind(this), 300), browser.mobile || scrollToTop())
        }.bind(this), 10)
    },
    searchFAQ: function(e) {
        " " == e[e.length - 1] && (e[e.length - 1] = "_"), addClass(ge("tickets_search"), "loading"), setStyle(ge("tickets_search_reset"), {
            opacity: .6
        });
        var t = {
            act: "get_faq",
            q: e,
            from: nav.objLoc.act
        };
        nav.objLoc.gid && (t.gid = nav.objLoc.gid), nav.objLoc.app_id && (t.app_id = nav.objLoc.app_id), nav.objLoc.union_id && (t.union_id = nav.objLoc.union_id), cur.tlmd &&
            cur.showAll && (delete cur.showAll, t.show_all = 1, cur.from_ads && (t.from = "ads")), ajax.post("tlmd", t, {
                cache: 1,
                hideProgress: removeClass.pbind("tickets_search", "loading"),
                onDone: function(t, a) {
                    var i = ge("tickets_title")
                        .value,
                        o = trim(i)
                        .split(" "),
                        r = o.length > 4 || 4 == o.length && " " == i[i.length - 1];
                    if (t ? ge("tlmd_found_list")
                        .innerHTML = se(t)
                        .innerHTML : (a && (ge("tickets_faq_button")
                            .innerHTML = a), r && (cur.toggled = !0, FAQ.toggleDetailedForm())), cur.tlmd) {
                        if (e ? extend(nav.objLoc, {
                                q: e
                            }) : delete nav.objLoc.q, "faq" == nav.objLoc.act) {
                            var s = e ? e : getLang("support_page_title");
                            vk.id || (s += " | " + getLang("global_vkontakte")), document.title = s
                        }
                        t && (cur.faqRowsOpened = !1, removeClass(ge("faq_toggle_all"), "shown")), nav.setLoc(nav.objLoc)
                    }
                }
            })
    },
    toggleDetailedForm: function(e) {
        var t = ge("tickets_title");
        if (toggleClass(ge("tickets_content"), "detailed"), isVisible("tickets_detailed_form")) t.setAttribute("placeholder", cur.lang.placeholder_title), removeClass(ge(
                "tickets_search_reset"), "shown"), e && ge("tickets_text")
            .focus();
        else {
            t.setAttribute("placeholder", cur.lang.placeholder_default);
            var a = trim(ge("tickets_title")
                .value);
            a && addClass(ge("tickets_search_reset"), "shown"), cur.toggleCanceled = !0, delete cur.toggled, FAQ.searchFAQ(a), t.focus()
        }
        placeholderSetup(ge("tickets_title"), {
            back: !0,
            reload: !0
        })
    },
    clearSearch: function(e, t) {
        var a = ge("tickets_title");
        setStyle(e, {
                opacity: .6
            }), a.value = "", ge("tickets_title")
            .focus(), FAQ.updateFAQ(t, a)
    },
    slideToggle: function(e) {
        var t = gpeByClass("tlmd_slide", e),
            a = !hasClass(t, "tlmd_slide_opened"),
            i = geByClass1("tlmd_slide_brick", t);
        toggleClass(t, "tlmd_slide_opened"), a ? (hide(i), slideDown(geByClass1("tlmd_slide_content", t), 500)) : (slideUp(geByClass1("tlmd_slide_content", t), 300),
            setTimeout(show.pbind(i), 300))
    },
    _eof: 1
};
try {
    stManager.done("faq.js")
} catch (e) {}
