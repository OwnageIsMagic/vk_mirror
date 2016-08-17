var Market = {
        init: function() {
            extend(cur, {
                searchInp: ge("market_search_input"),
                searchEl: geByClass1("market_search", "market_search_wrap"),
                listEl: ge("market_list"),
                more: ge("ui_items_load_more"),
                notFound: ge("not_found"),
                catalogEl: ge("market_list_wrap"),
                albumbEl: ge("market_albums_list"),
                tabsEl: geByClass1("ui_content_tabs", "market_list_wrap"),
                pageHeaderEl: ge("market_page_header"),
                headerEl: geByClass1("page_block_sub_header", "market_list_wrap")
            }), Market.initFilters(), Market.initScroll(), setTimeout(function() {
                cur.destroy.push(function() {
                    Market.deinitScroll()
                })
            }, 0), Market._createSorters()
        },
        switchTab: function(e, t, r) {
            var o = geByClass1("side_link", gpeByClass("ui_tabs", t));
            return uiTabs.switchTab(t), ajax.post("/al_market.php", {
                id: cur.oid,
                section: e,
                load: 1,
                tab: 1
            }, {
                onDone: function(t, r, o) {
                    cur.listEl.innerHTML = r, o ? show(cur.more) : hide(cur.more), Market.section(e)
                },
                showProgress: addClass.pbind(o, "round_spinner"),
                hideProgress: removeClass.pbind(o, "round_spinner")
            }), !1
        },
        section: function(e) {
            if (e = e || "", !e && "comments" == cur.mSection) {
                var t = geByClass("ui_crumb", cur.pageHeaderEl),
                    r = geByClass("ui_crumb_sep", cur.pageHeaderEl),
                    o = t[t.length - 2].textContent;
                re(t[t.length - 1]), re(t[t.length - 2]), re(r[r.length - 1]), domPN(t[0])
                    .appendChild(ce("div", {
                        className: "ui_crumb",
                        innerHTML: o
                    }))
            }
            return cur.mSection = e, nav.setLoc("market" + cur.oid + (e ? "?section=" + e : "")), ge("market")
                .className = "page_block", document.title = replaceEntities(stripHTML(cur.htitles[e] || cur.htitles[""])), Market._createSorters(), !1
        },
        _createSorters: function() {
            cur.itemsSorter && cur.itemsSorter.destroy(), cur.albumsSorter && cur.albumsSorter.destroy(), cur.canEdit && ((!cur.mSection || "albums" == cur.mSection) && cur.albumsCount >
                1 && (cur.itemsSorter = new GridSorter("market_albums_cont", "market_album_photo_img", {
                    onReorder: Market._onAlbumReorder
                })), (!cur.mSection || cur.aid) && cur.itemsCount > 1 && !hasClass("market", "market_search_section") && (cur.itemsSorter = new GridSorter(cur.listEl,
                    "market_row_img", {
                        onReorder: Market._onItemReorder
                    })))
        },
        _reinitSorters: function(e) {
            cur.canEdit && (clearTimeout(cur._rsto), cur._rsto = setTimeout(function() {
                cur.itemsSorter ? e ? cur.itemsSorter.disable() : cur.itemsSorter.enable() : Market._createSorters()
            }))
        },
        _onItemReorder: function(e, t, r) {
            var o = e.getAttribute("data-id"),
                a = r ? r.getAttribute("data-id") : null,
                s = t ? t.getAttribute("data-id") : null;
            ajax.post("al_market.php", {
                act: "a_reorder_items",
                oid: cur.oid,
                aid: cur.aid,
                id: o,
                before: s,
                after: a,
                hash: cur.reorderHash
            })
        },
        _onAlbumReorder: function(e, t, r) {
            var o = e.getAttribute("data-id"),
                a = r ? r.getAttribute("data-id") : null,
                s = t ? t.getAttribute("data-id") : null;
            ajax.post("al_market.php", {
                act: "a_reorder_albums",
                oid: cur.oid,
                aid: o,
                before: s,
                after: a,
                hash: cur.reorderHash
            })
        },
        initFilters: function() {
            cur.searchFilters = {}, each(["market_fltr_price_from", "market_fltr_price_to"], function(e, t) {
                elem = ge(t), cur.searchFilters[t.replace("market_fltr_", "")] = elem, placeholderInit(elem), addEvent(elem, "change", Market.updateList), addEvent(
                    elem, "keydown",
                    function(e) {
                        e.keyCode == KEY.ENTER && Market.updateList()
                    }), addEvent(elem, "keydown keyup keypress paste cut drop input blur", function(e) {
                    var t = elem.value.replace(/[^0-9\.]/g, "");
                    return elem.value != t && val(elem, t), !0
                })
            }), stManager.add(["ui_controls.js", "ui_controls.css"], function() {
                cur.searchFilters.sort = new Dropdown(ge("market_fltr_order"), cur.orderList, {
                    big: 1,
                    selectedItems: cur.order,
                    onChange: Market.updateList.pbind(!1)
                }), Market.updateFiltersPane()
            })
        },
        getFilterValue: function(e) {
            var t = !1;
            if ("Selector" == e.__className) t = clone(e.selectedItems()[0]), t.push(t[0] == e.options.defaultItems[0][0]);
            else if ("INPUT" == e.tagName) {
                var r = val(e);
                if (t = [r, r, "" === r], "text" == e.type) {
                    var o = gpeByClass("ui_search_fltr_sel", e),
                        a = domPS(o);
                    if (hasClass(a, "ui_search_fltr_label")) {
                        var s = a.textContent,
                            i = "",
                            n = geByClass1("ui_search_fltr_label_postfix", a);
                        n && (i = n.getAttribute("data-prefix"), n = n.textContent, s = s.replace(n, "")
                            .replace(/,\s$/, ""), i && (n = !1)), geByClass1("ui_search_fltr_sep", o) && each(geByTag("input", o), function(t, r) {
                            r == e && (s += " " + (0 == t ? getLang("market_filter_range_from") : getLang("market_filter_range_to")))
                        }), t[1] = s + (i ? " " + i : " ") + t[1] + (n ? " " + n : "")
                    }
                }
            }
            return t
        },
        clearFilter: function(e) {
            "Selector" == e.__className ? e.selectItem(e.options.defaultItems[0][0], !1) : "INPUT" == e.tagName && val(e, "")
        },
        updateFiltersPane: function() {
            each(cur.searchFilters, function(e, t) {
                var r = Market.getFilterValue(t);
                uiSearch.toggleFilter(cur.searchInp, e, r[1], !r[2])
            })
        },
        onFilterRemoved: function(e) {
            Market.clearFilter(cur.searchFilters[e]), cur.filterIsRemoved = !0, Market.updateList()
        },
        getSearchParams: function() {
            var e = {
                q: trim(val(cur.searchInp)),
                load: 1,
                id: cur.oid,
                offset: cur.searchOffset || 0
            };
            return each(cur.searchFilters, function(t, r) {
                var o = Market.getFilterValue(r);
                e[t] = o[0]
            }), cur.aid && (e.aid = cur.aid), "disabled" == cur.mSection && (e.disabled = 1), e
        },
        sameParams: function(e) {
            if (!cur.params) return !1;
            for (var t in e)
                if (e[t] != cur.params[t]) return !1;
            for (var t in cur.params)
                if (e[t] != cur.params[t]) return !1;
            return !0
        },
        onChangeQuery: function(e) {
            !e && cur.params && cur.params.q && Market.updateList()
        },
        updateList: function(e) {
            clearTimeout(cur.searchTimeout);
            var t = function() {
                e && e > 0 ? cur.searchOffset = e : cur.searchOffset = 0;
                var t = Market.getSearchParams();
                (!Market.sameParams(t) || cur.ignoreEqual) && (delete cur.ignoreEqual, e || hasClass("shown", geByClass1("ui_search_fltr_control", "market_search_wrap")) ||
                    uiSearch && uiSearch.showProgress(cur.searchInp), cur.params = t, Market.searchItems(), "comments" == cur.mSection && Market.section("")), t.offset ||
                    scrollToTop()
            };
            e ? t() : cur.searchTimeout = setTimeout(t.bind(this), 10)
        },
        searchItems: function() {
            var e = cur.params || Market.getSearchParams();
            ajax.post("/al_market.php", e, {
                cache: 1,
                onDone: function(t, r, o) {
                    var a = geByClass1("market_summary_text", "market_list_wrap");
                    if (a) {
                        var s = "";
                        s = t ? getLang("market_summary_X_goods", t, !0) : getLang("market_summary_no_goods"), a.innerHTML = s
                    } else val("market_items_count", t ? langNumeric(t, "%s", !0) : "");
                    e.offset > 0 ? cur.listEl.appendChild(cf(r)) : (cur.listEl.innerHTML = r, cur.searchOffset = 0), o ? show(cur.more) : hide(cur.more), cur.searchOffset ||
                        t ? removeClass("market", "market_content_not_found") : (e.q ? (addClass(cur.notFound, "market_q_search"), ge("search_ph")
                            .innerHTML = e.q.replace(/([<>&#]*)/g, "")) : removeClass(cur.notFound, "market_q_search"), addClass("market",
                            "market_content_not_found"), hide(cur.more)), cur.filterIsRemoved ? cur.filterIsRemoved = !1 : Market.updateFiltersPane();
                    var i = 0;
                    each(e, function(e, t) {
                        (!inArray(e, ["id", "load", "sort", "offset", "disabled"]) && "" != t || "sort" == e && 0 != t) && i++
                    }), i ? addClass("market", "market_search_section") : (removeClass("market", "market_search_section"), cur.albumsCount && show(cur.albumbEl),
                        cur.tabsEl && (show(cur.tabsEl), hide(cur.headerEl))), Market._reinitSorters(i > 0), each(e, function(e, t) {
                        !t || 0 == t || inArray(e, ["load", "id", "offset", "aid"]) || "sort" == e && 0 == t ? delete nav.objLoc[e] : nav.objLoc[e] = t
                    }), nav.setLoc(nav.objLoc)
                },
                showProgress: function() {
                    show("market_fltr_progress"), cur.isSearchLoading = !0
                },
                hideProgress: function() {
                    hide("market_fltr_progress"), uiSearch && uiSearch.hideProgress(cur.searchInp), unlockButton(cur.more), cur.isSearchLoading = !1
                }
            })
        },
        clearItemsSearch: function() {
            window.uiSearch && (uiSearch.reset(cur.searchInp, !1), uiSearch.removeAllFilters(cur.searchInp)), elfocus(cur.searchInp), removeClass(cur.searchEl, "not_empty"),
                Market.updateList()
        },
        loadComments: function(e) {
            if (!cur.loadComments) {
                cur.searchOffset = e, cur.loadComments = 1;
                var t = {
                    load: 1,
                    section: "comments",
                    id: cur.oid,
                    offset: cur.searchOffset || 0
                };
                ajax.post("/al_market.php", t, {
                    onDone: function(e, t, r) {
                        cur.listEl.appendChild(cf(t)), unlockButton(cur.more), r ? show(cur.more) : hide(cur.more), cur.loadComments = 0
                    }
                })
            }
        },
        showMore: function() {
            if ("albums" == cur.mSection) return !1;
            var e = cur.searchOffset || 0;
            return e += cur.itemsPerPage, lockButton(cur.more), "comments" == cur.mSection ? Market.loadComments(e) : Market.updateList(e), !1
        },
        showAllAlbums: function(e) {
            var t = ge("market_albums_wrap"),
                r = ge("market_albums_cont"),
                o = data(t, "expanded");
            setStyle(t, "max-height", o ? "" : getSize(r)[1] + "px"), o = !o, data(t, "expanded", o), e.innerHTML = getLang(o ? "market_hide_all_albums_toggle" :
                "market_show_all_albums_toggle"), o || setTimeout(function() {
                animate(geByTag1("body"), {
                    scrollTop: 0,
                    transition: Fx.Transitions.easeOutCubic
                }, 700)
            }, 300)
        },
        initScroll: function() {
            Market.scrollnode = browser.msie6 ? pageNode : window, Market.deinitScroll(), window.scrollTop = bodyNode.scrollTop = pageNode.scrollTop = htmlNode.scrollTop = 0,
                addEvent(Market.scrollnode, "scroll", Market.scrollCheck), addEvent(window, "resize", Market.scrollCheck)
        },
        deinitScroll: function() {
            removeEvent(Market.scrollnode, "scroll", Market.scrollCheck), removeEvent(window, "resize", Market.scrollCheck)
        },
        scrollCheck: function() {
            if (!(browser.mobile || cur.isSearchLoading || cur.disableAutoMore)) {
                var e = document.documentElement,
                    t = window.innerHeight || e.clientHeight || bodyNode.clientHeight,
                    r = scrollGetY(),
                    o = cur.more;
                isVisible(o) && r + 3 * t > o.offsetTop && o.onclick()
            }
        },
        uploadInit: function(e, t, r) {
            cur.lang = extend(cur.lang || {}, t.lang);
            var o = {
                file_name: "photo",
                file_size_limit: 26214400,
                file_types_description: "Image files (*.jpg, *.jpeg, *.png, *.gif)",
                file_types: "*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG;*.gif;*.GIF;*.bmp;*.BMP",
                accept: "image/*",
                lang: t.lang,
                clear: 1,
                noFlash: 1,
                signed: t.signed,
                type: "photo",
                buttonClass: "secondary small",
                max_attempts: 3,
                server: t.server,
                base_url: t.base_url,
                static_url: t.static_url,
                errorObj: t.errorObj
            };
            return o = r ? extend(o, {
                check_url: t.check_url
            }) : extend(o, {
                multiple: !0,
                multi_progress: !0,
                force_max_files: !0,
                max_files: t.maxFiles,
                noCheck: !0,
                dropbox: "market_ei_photos_dropbox"
            }), Upload.init(e, t.url, cur.mkOptions.photoVars, extend(o, {
                onUploadStart: function(e, r) {
                    curBox()
                        .changed = !0, "form" == Upload.types[e] && show(box.progress), re(geByClass1("error", t.errorObj))
                },
                onCheckComplete: function(e) {
                    e == cur.uploadId && cur.extraUploadId && Upload.uploadUrls[cur.extraUploadId] && (Upload.uploadUrls[cur.extraUploadId] = Upload.uploadUrls[
                        cur.uploadId]), Upload.embed(e)
                },
                onUploadComplete: function(e, t, o) {
                    var a = parseJSON(t) || {
                        error: "ERR_CLIENT_BAD_RESPONSE: bad request response"
                    };
                    if (a.error || !a.photos) return void Market.uploadFail(r, e, a.error + (o || ""));
                    var s = void 0 !== e.ind ? e.ind : e;
                    if (r) {
                        var i = Upload.options[cur.uploadId].base_url + "upload.php?act=market_photo_crop&_query=" + encodeURIComponent(t) + "&_origin=" +
                            encodeURIComponent(locProtocol + "//" + locHost);
                        Market.cropPhoto(a.photos[0], i), Upload.embed(s)
                    } else {
                        var n = (e.fileName || e)
                            .replace(/[&<>"']/g, ""),
                            c = e.fileName ? s + "_" + e.fileName : e,
                            u = ge("upload" + c + "_progress_wrap");
                        u && hide(geByClass1("market_prg_x", u)), a.photos = JSON.stringify(a.photos), ajax.post("al_photos.php", extend({
                            act: "choose_uploaded"
                        }, a), {
                            onDone: function(t, r) {
                                Market.choosePhoto(e, t, extend(r, {
                                    upload_ind: s + "_" + n
                                }))
                            },
                            onFail: Market.uploadFail.pbind(r, e)
                        })
                    }
                },
                onUploadProgress: function(e, t, o) {
                    var a = void 0 !== e.ind ? e.ind : e;
                    if (r) {
                        var s = getProgressBarEl(ge("form" + a + "_progress"));
                        if (!s) {
                            for (var i = Upload.obj[a], n = getSize(i)[1], c = n / 2 + 10, u = i.firstChild; u;) 1 == u.nodeType && (u.id == "uploader" + a &&
                                browser.msie ? setStyle(u, {
                                    position: "relative",
                                    left: "-5000px"
                                }) : setStyle(u, {
                                    visibility: "hidden"
                                })), u = u.nextSibling;
                            i.appendChild(ce("div", {
                                className: "market_upload_progress_wrap",
                                innerHTML: '<div id="form' + a +
                                    '_progress" class="ui_progress">                <div class="ui_progress_back"></div>                <div class="ui_progress_bar"></div>              </div>'
                            }, {
                                height: c + "px",
                                marginTop: -c + "px"
                            })), s = getProgressBarEl(ge("form" + a + "_progress"))
                        }
                        var l = intval(t / o * 100);
                        setStyle(s, {
                            width: l + "%"
                        })
                    } else {
                        if ("fileApi" == Upload.types[a]) {
                            var m = {
                                loaded: t,
                                total: o
                            };
                            e.fileName && (m.fileName = e.fileName.replace(/[&<>"']/g, ""))
                        }
                        Market.showUploadPhotoProgress(a, m)
                    }
                },
                onUploadError: function(e, t) {
                    Market.uploadFail(r, e, t)
                }
            }))
        },
        uploadExtraPhotos: function(e) {
            return void 0 !== cur.extraUploadId && void 0 !== cur.uploadId && window.Upload && Upload.checked && Upload.checked[cur.uploadId] ? (geByTag1("input",
                    "market_ei_photo_upload")
                .click(), !1) : !0
        },
        uploadFail: function(e, t, r) {
            r.match(/^ERR_[A-Z0-9_]+/) || (r = 'ERR_CLIENT_BAD_ERROR: error "' + r.toString() + '"');
            var o, a = r.match(/^(ERR_[A-Z0-9_]+)/),
                s = a[1];
            switch (s) {
                case "ERR_UPLOAD_FILE_NOT_SUPPORTED":
                    o = getLang("profile_oph_err_format");
                    break;
                case "ERR_UPLOAD_FILE_NOT_UPLOADED":
                    o = getLang("profile_oph_err_upload")
                        .replace("{link}", '<a href="/support?act=new&from=ph">')
                        .replace("{/link}", "</a>");
                    break;
                case "ERR_UPLOAD_BAD_IMAGE_SIZE":
                    o = getLang("profile_oph_err_size")
                        .replace("{min}", "400")
                        .replace("{max}", '7<span class="num_delim"> </span>000');
                    break;
                case "ERR_UPLOAD_TERMINATED":
                    return;
                default:
                    o = getLang("profile_oph_err_unknown")
                        .replace("{link}", '<a href="/support?act=new&from=ph">')
                        .replace("{/link}", "</a>")
            }
            if (o = o.replace("{sorry}", "<b>" + getLang("global_error_occured") + "</b>"), 2 === e) {
                var i = ge("market_photo_crop_error");
                return val(i, o), show(i), !0
            }
            var n = void 0 !== t.ind ? t.ind : t,
                c = Upload.options[n];
            if (e) {
                var u = Upload.obj[n],
                    l = domPN(u);
                hasClass(l, "market_upload_progress") && removeClass(l, "market_upload_progress")
            } else {
                var m = (t.fileName ? t.fileName : t, t.fileName ? n + "_" + t.fileName : t);
                re("upload" + m + "_progress_wrap"), Market.unchoosePhoto(n)
            }
            return Upload.embed(n), showMsg(c.errorObj, o, "error", !0), !0
        },
        choosePhoto: function(e, t, r) {
            var o = void 0 !== e.ind ? e.ind : e,
                a = ge("market_ei_photos");
            isObject(r) || (r = {
                    thumb_m: r[0] || "",
                    thumb_s: r[1] || "",
                    list: r[2] || "",
                    view_opts: r[3] || "",
                    upload_ind: r.upload_ind || void 0
                }), vkImage()
                .src = r.thumb_m, isArray(cur.itemPhotos) || (cur.itemPhotos = []);
            var s = cur.itemPhotos.length;
            cur.itemPhotos.push(t);
            var i = '<div class="market_ei_photo"><img class="market_ei_img" src="' + r.thumb_m + '" />',
                n = '<div class="_ei_photo market_ei_photo_wrap market_ei_photo%ind% inl_bl" id="market_ei_photo%ind%">' + i +
                '<div nosorthandle="1" class="ui_thumb_x_button ui_thumb_small_x" data-title="' + getLang("dont_attach") +
                '" onmouseover="showTitle(this)" onclick="Market.unchoosePhoto(%ind%); return cancelEvent(event);"><div class="ui_thumb_x" nosorthandle="1"></div></div></div></div>',
                c = se(rs(n, {
                    ind: s
                }));
            a.insertBefore(c, ge("market_ei_photo_add"));
            var u = e.fileName || e.name || "",
                l = u ? o + "_" + u : o;
            re("upload" + l + "_progress_wrap"), u && ((!browser.msie || browser.version > 8) && cur.itemPhotos.length > 1 ? stManager.add(["usorter.js"], function() {
                a.usorter ? usorter.added(a) : cur.itemPhotos.length > 1 && usorter.init(a, {
                    clsUp: "market_ei_preview_up"
                })
            }) : a.usorter && a.usorter.destroy()), toggle("market_ei_photo_add", Market.uploadedPhotosCount() < Upload.options[cur.extraUploadId].max_files)
        },
        unchoosePhoto: function(e) {
            window.tooltips && tooltips.hide(geByClass1("ui_thumb_x_button", "market_ei_photo" + e)), re("market_ei_photo" + e), toggle("market_ei_photo_add", Market.uploadedPhotosCount() <
                Upload.options[cur.extraUploadId].max_files);
            var t = ge("market_ei_photos");
            t.usorter && (t.usorter.destroy(), t.usorter = !1), cur.itemPhotos.length > 1 && stManager.add(["usorter.js"], function() {
                usorter.init(t, {
                    clsUp: "market_ei_preview_up"
                })
            })
        },
        uploadedPhotosCount: function() {
            var e = ge("market_ei_photos"),
                t = ge("market_ei_photos_progress");
            return e.childNodes.length + t.childNodes.length - 1
        },
        getUploadedPhotos: function() {
            if (!cur.itemPhotos) return [];
            var e, t = [];
            return each(geByClass("_ei_photo", "market_ei_photos"), function(r, o) {
                (e = (o.className || "")
                    .match(/market_ei_photo(\d+)/)) && (e = intval(e[1]), t.push(cur.itemPhotos[e]))
            }), t
        },
        showUploadPhotoProgress: function(e, t) {
            var r = ge("market_ei_photos_progress"),
                o = intval(t.loaded / t.total * 100),
                a = t.fileName || t.name || "",
                s = a ? e + "_" + a : e,
                i = a ? a.length > 33 ? a.substr(0, 30) + "..." : a : "";
            if (r) {
                var n = getProgressBarEl(ge("upload" + s + "_progress_wrap"));
                if (!n) {
                    var c = '  <div class="ui_progress">    <div class="ui_progress_back"></div>    <div class="ui_progress_bar" style="width: ' + o +
                        '%;"></div>  </div></div>',
                        u = ce("div", {
                            id: "upload" + s + "_progress_wrap",
                            innerHTML: '<div class="market_prg_wrap">' + c + "</div>" + (i ? '<div class="market_prg_label">' + i + "</div>" : "") +
                                '<div class="market_prg_x" data-title="' + getLang("dont_attach") + '" onmouseover="showTitle(this)" onclick="Upload.terminateUpload(' + e +
                                ", '" + (a || e) + "'); if (window.tooltips) tooltips.hide(this);\"></div>",
                            className: "clear_fix"
                        }, {
                            marginTop: "6px"
                        });
                    r.appendChild(u), n = getProgressBarEl(ge("upload" + s + "_progress_wrap")), show(r), toggle("market_ei_photo_add", Market.uploadedPhotosCount() < Upload.options[
                        e].max_files)
                }
                return o ? (setStyle(n, {
                    width: o + "%"
                }), show("upload" + s + "_progress")) : hide("upload" + s + "_progress"), !1
            }
        },
        cropPhoto: function(e, t) {
            if (!e || !e.sizes) return void Market.uploadFail(!0);
            for (var r = !1, o = !1, a = 0; a < e.sizes.length; a++) {
                var s = e.sizes[a];
                "x" == s[0] ? (r = e.sizes[a], o || (o = s)) : "y" == s[0] ? o && "x" != o[0] || (o = s) : "z" == s[0] ? o && "x" != o[0] && "y" != o[0] || (o = s) : "w" == s[
                    0] && (o && "x" != o[0] && "y" != o[0] && "z" != o[0] || (o = s))
            }
            if (!r) return void Market.uploadFail(!0);
            var i = Upload.options[cur.extraUploadId].static_url + "v" + r[1] + "/" + r[2] + "/" + r[3] + ".jpg",
                n = "width: " + r[4] + "px; height: " + r[5] + "px;";
            cur.photoCropOpts = {
                size: [o[4], o[5]],
                thumbSize: [r[4], r[5]],
                uploadUrl: t
            }, cur.photoTaggerDestroy || (cur.photoTaggerDestroy = function() {
                cur.photoTagger && (cur.photoTagger.destroy(), delete cur.photoTagger)
            }, cur.destroy.push(function() {
                cur.photoTaggerDestroy()
            }));
            var c = ge("market_photo_crop")
                .innerHTML.replace(new RegExp("_tmpl", "g"), "");
            box = showFastBox({
                title: getLang("market_photo_crop_title"),
                hideButtons: !0,
                grey: !0,
                width: 644,
                bodyStyle: "padding:20px;border:0px",
                onClean: cur.photoTaggerDestroy
            }, c), val("market_photo_crop_thumb", '<div style="' + n + 'margin: 0px auto;"><img id="market_photo_crop_img" src="' + i + '" style="' + n +
                "\" onload=\"stManager.add(['tagger.css', 'tagger.js'], Market.cropInit);\" /></div>")
        },
        cropInit: function() {
            var e, t = cur.photoCropOpts,
                r = t.size,
                o = t.thumbSize,
                a = [Math.max(100, Math.ceil(400 * o[0] / r[0])), Math.max(100, Math.ceil(400 * o[1] / r[1]))];
            t.rect ? e = {
                left: Math.floor(t.rect[0] * o[0] / r[0]),
                top: Math.floor(t.rect[1] * o[1] / r[1]),
                width: Math.ceil(t.rect[2] * o[0] / r[0]),
                height: Math.ceil(t.rect[3] * o[1] / r[1])
            } : (e = {
                width: Math.max(a[0], o[0] - 40),
                height: Math.max(a[1], o[1] - 40)
            }, e.width > e.height && (e.width = e.height), e.height > e.width && (e.height = e.width), e.left = Math.floor((o[0] - e.width) / 2), e.top = Math.floor((o[
                1] - e.height) / 2)), cur.photoTagger && cur.photoTagger.destroy(), cur.photoTagger = photoTagger("market_photo_crop_img", {
                minw: a[0],
                minh: a[1],
                square: 1,
                rect: e,
                zstart: 1e3
            })
        },
        cropDone: function() {
            if (cur.photoTagger) {
                var e = cur.photoTagger.result(),
                    t = cur.photoCropOpts,
                    r = t.size[0] / t.thumbSize[0],
                    o = t.size[1] / t.thumbSize[1],
                    a = [Math.floor(e[0] * r), Math.floor(e[1] * o), Math.ceil(e[2] * r), Math.ceil(e[3] * o), 0, 0, Math.ceil(e[2] * r)],
                    s = cur.photoCropOpts.uploadUrl + "&_crop=" + encodeURIComponent(a.join(","));
                lockButton("market_photo_crop_done"), clearTimeout(cur.cropTimer), cur.cropTimer = setTimeout(Market.cropSuccess.pbind(
                    '{"error":"ERR_CLIENT_UPLOAD_TIMEOUT: no response on market_photo_crop iframe request"}'), 1e4), stManager.add(["upload.js"], function() {
                    var e = jsonpManager.reg(Market.cropSuccess);
                    utilsNode.appendChild(ce("iframe", {
                        src: s + "&_jsonp=" + e + "&_origin=" + encodeURIComponent(locProtocol + "//" + locHost)
                    }))
                })
            }
        },
        cropSuccess: function(e) {
            clearTimeout(cur.cropTimer);
            var t = parseJSON(e) || {},
                r = "market_photo_crop_done";
            t.error ? (unlockButton(r), Market.uploadFail(2, !1, t.error + Upload.getErrorAdditional(t))) : (cur.photoTooltipHide && (cur.photoTooltipHide(!0), curBox.hide()),
                ajax.post("al_market.php", {
                    act: "save_photo",
                    _query: e
                }, {
                    onDone: function(e, t) {
                        ge("market_ei_main_photo")
                            .src = t, cur.itemPhoto = e, curBox()
                            .hide()
                    },
                    onFail: function(e) {
                        return Market.uploadFail(2, !1, e), !0
                    },
                    showProgress: lockButton.pbind(r),
                    hideProgress: unlockButton.pbind(r)
                }))
        },
        showEditBox: function(e, t, r) {
            return t || (t = cur.oid), showBox("al_market.php", {
                act: "a_edit_item_box",
                id: e,
                oid: t,
                aid: cur.aid
            }, {
                dark: 1
            }), r && cancelEvent(r)
        },
        saveItem: function(e) {
            if (!buttonLocked("btn")) {
                if (cur.uiTags) {
                    var t = cur.uiTags.val_full(),
                        r = [];
                    if (t && t.length)
                        for (var o in t) r.push(t[o][1])
                } else var r = [];
                var a = {
                    oid: cur.mkOptions.oid,
                    name: val("item_name"),
                    description: val("item_description"),
                    category: cur.uiCategory.val(),
                    tags: r.join(","),
                    price: val("item_price"),
                    photo: JSON.stringify(cur.itemPhoto),
                    extraPhotos: Market.getUploadedPhotos()
                        .join(","),
                    albums: cur.uiAlbums ? cur.uiAlbums.val() : 0,
                    disabled: isChecked("item_disabled"),
                    hash: cur.mkOptions.hash
                };
                if (cur.mkOptions.item_id && (a.id = cur.mkOptions.item_id), !a.name.length) return void notaBene("item_name");
                if (!a.description.length) return void notaBene("item_description");
                if (!floatval(a.price)) return void notaBene("item_price");
                re(geByClass1("error", "market_edit_item_box")), ajax.post("al_market.php?act=a_save_item", a, {
                    onDone: function(e, t) {
                        if (curBox()
                            .hide(), cur.mkOptions.item_id) {
                            var r = ge("market_item" + cur.mkOptions.item_id);
                            r && (r.innerHTML = se(e)
                                .innerHTML)
                        } else nav.reload();
                        cur.aid && nav.reload(), t && each(t, function(e, t) {
                            var r = geByClass1("market_album_size", "market_album_block" + e);
                            r && (r.innerHTML = t)
                        }), a.disabled && !a.id ? nav.change({
                            section: "disabled"
                        }) : (a.disabled || "disabled" == cur.mSection && !a.disabled) && addClass("market_item" + a.id, "market_row_disabled")
                    },
                    onFail: function(e) {
                        return showMsg("market_edit_item_box", e, "error", !0), ge("box_layer_wrap")
                            .scrollTop = 0, !0
                    },
                    showProgress: lockButton.pbind(e),
                    hideProgress: unlockButton.pbind(e)
                })
            }
        },
        deleteItem: function(e, t, r) {
            var o = showFastBox({
                title: getLang("market_item_delete_confirm_title"),
                dark: 1
            }, getLang("market_item_delete_confirm"), getLang("global_delete"), function() {
                if (void 0 !== e) var a = {
                    oid: t,
                    id: e,
                    hash: r
                };
                else var a = {
                    oid: cur.mkOptions.oid,
                    id: cur.mkOptions.item_id,
                    hash: cur.mkOptions.hash
                };
                ajax.post("al_market.php?act=a_delete_item", a, {
                    onDone: function(e, t) {
                        for (; boxQueue.count();) boxQueue.hideLast(!1, window.event);
                        if (window.WkView && WkView.hide(), re("market_item" + a.id), "market" == cur.module) {
                            cur.itemsCount--;
                            var r = "",
                                o = "";
                            cur.itemsCount > 0 ? (r = langNumeric(cur.itemsCount, "%s", !0), o = getLang("market_summary_X_goods", cur.itemsCount, !0)) : (
                                o = getLang("market_summary_no_goods"), geByClass1("market_empty", cur.notFound)
                                .innerHTML = cur.aid ? getLang("market_album_empty") : getLang("market_catalog_empty"), hide(cur.listEl), show(cur.notFound)
                            );
                            var s = geByClass1("market_summary_text", "market_list_wrap");
                            s ? s.innerHTML = o : val("market_items_count", r), t && each(t, function(e, t) {
                                var r = geByClass1("market_album_size", "market_album_block" + e);
                                r && (r.innerHTML = t)
                            })
                        }
                        showDoneBox(e)
                    },
                    showProgress: o.showProgress,
                    hideProgress: o.hideProgress
                }), Market._reinitSorters(!0)
            });
            return !1
        },
        deleteAlbum: function(e, t) {
            return showFastBox({
                title: getLang("market_delete_album_title"),
                dark: 1
            }, getLang("market_delete_album_sure"), getLang("global_delete"), function() {
                ajax.post("/al_market.php?act=a_delete_album", {
                    aid: e,
                    oid: cur.oid,
                    hash: t
                }, {
                    onDone: function() {
                        var t = ge("market_album_block" + e);
                        curBox()
                            .hide(), cur.albumsCount--, cur.albumsSorter && qsorter.remove(ge("market_albums_cont"), t), re(t);
                        var r = "";
                        cur.albumsCount > 0 ? r = langNumeric(cur.albumsCount, "%s", !0) : (hide("market_albums_wrap"), show("market_no_albums_wrap")), ge(
                                "market_albums_count")
                            .innerHTML = r, cur.aid && nav.go("/market" + cur.oid)
                    }
                })
            }), !1
        },
        editAlbum: function(e) {
            return showBox("al_market.php?act=edit_album_box", {
                oid: cur.oid,
                aid: e
            }, {
                dark: 1
            }), !1
        },
        createAlbum: function() {
            return showBox("al_market.php?act=edit_album_box", {
                oid: cur.oid
            }, {
                dark: 1
            }), !1
        },
        showItem: function(e, t, r, o) {
            if (checkEvent(r)) return !0;
            var a = "";
            return o ? a = o : cur.module && (a = cur.module), showWiki({
                w: "product" + e + "_" + t + "/query",
                from: a
            }), !1
        },
        showWriteMessage: function(e, t, r, o) {
            stManager.add(["page.js", "wide_dd.js"]), cur.mbForceAttach = ["market", r, o];
            var a = showBox("al_mail.php", {
                act: "write_box",
                to: t,
                hash: o,
                from: "market" + r
            }, {
                stat: ["writebox.js", "writebox.css", "wide_dd.css", "page.css", "emoji.js", "notifier.css"],
                cache: 1
            }, e);
            return a && cancelEvent(e), !a
        },
        itemBoxinit: function() {
            if (cur.mkOptions.post) {
                var e = ge("reply_field" + cur.mkOptions.post);
                e && (data(e, "send", Market.sendComment), placeholderInit(e, {
                    editable: 1
                }))
            }
            cur.mkComments || (cur.mkComments = {});
            var t = ge("market_comments_wrap");
            cur.mkComments[cur.mkOptions.itemRaw] && domPN(t)
                .replaceChild(cur.mkComments[cur.mkOptions.itemRaw], t), cur.mkYourComment = !1, cur.editing = !1, cur.tsDiff = cur.walTpl && cur.walTpl.abs_timestamp ? 900 *
                Math.round((vkNow() / 1e3 - cur.walTpl.abs_timestamp) / 900) : 0, cur.mkTimeUpdateInt = setInterval(function() {
                    Wall.updateTimes("market_comments")
                }, 1e4), cur.destroy.push(function() {
                    clearInterval(cur.mkTimeUpdateInt)
                }), cur.mkOptions.photos && cur.mkOptions.photos.length > 1 && addEvent(domPN(ge("market_item_photo")), "click", Market.switchPhoto.pbind(!1)), cur.mkOptions.canEnlarge &&
                show("market_item_bigph");
            for (var r = 1; r < cur.mkOptions.photos.length && 5 >= r; r++) vkImage()
                .src = cur.mkOptions.photos[r].thumb_x;
            wkcur._hide.push(function() {
                removeEvent(domPN(ge("market_item_photo")), "click")
            }), cur.mkOptions.ddActions && new InlineDropdown("market_item_actions", {
                items: cur.mkOptions.ddActions,
                withArrow: !0,
                keepTitle: !0,
                autoShow: !0,
                autoHide: 300,
                onSelect: function(e) {
                    Market[e]()
                }
            }), WkView.updateSize()
        },
        switchPhoto: function(e, t) {
            if (Market.outPhotoThumb(), void 0 === e || e === !1) e = cur.mkOptions.photoIndex + 1, e >= cur.mkOptions.photos.length && (e = 0);
            else if (!t) return void(cur.switchPhotoTO = setTimeout(Market.switchPhoto.pbind(e, !0), 50));
            return e >= cur.mkOptions.photos.length ? !1 : (cur.mkOptions.photoIndex = e, ge("market_item_photo")
                .src = cur.mkOptions.photos[e].thumb_x, removeClass(geByClass1("market_item_thumb_active", "market_item_photos_sidebar"), "market_item_thumb_active"), void addClass(
                    "market_item_thumb" + e, "market_item_thumb_active"))
        },
        outPhotoThumb: function() {
            cur.switchPhotoTO && (clearTimeout(cur.switchPhotoTO), cur.switchPhotoTO = !1)
        },
        showPhotoActions: function(e) {
            var t = ge("market_item_bigph"),
                r = getXY(t),
                o = getSize(t),
                a = 100;
            e.pageX > r[0] - a && e.pageX < r[0] + o[0] + a && e.pageY > r[1] - a && e.pageY < r[1] + o[1] + a ? addClass(t, "visible") : removeClass(t, "visible")
        },
        showBigPhoto: function(e) {
            if (!cur.mkOptions.canEnlarge) return !1;
            var t = cur.mkOptions.photos[cur.mkOptions.photoIndex];
            return removeClass("market_item_bigph", "visible"), showPhoto(t.id, "market" + cur.mkOptions.itemRaw, parseJSON(t.view_opts), e), !1
        },
        likeUpdate: function(e, t, r) {
            t = intval(t);
            var o = ge("market_like"),
                a = (domByClass(o, "_icon"), domByClass(o, "_count"));
            if (a) {
                var s = o.tt || {},
                    i = clone(s.opts || {});
                countInput = domByClass(s.container, "_value"), content = domByClass(s.container, "_content"), titleNode = domByClass(s.container, "_title"), r && titleNode &&
                    val(titleNode, r), s && (s.likeInvalidated = !0), countInput && (countInput.value = t), cur.mkOptions.likes = t, animateCount(a, t), cur.mkOptions.liked =
                    e, toggleClass(o, "my_like", e), toggleClass(o, "no_likes", !t), toggleClass(content, "me_hidden", !e), t ? !s.el || isVisible(s.container) || r ||
                    tooltips.show(s.el, extend(i, {
                        showdt: 0
                    })) : s.el && s.hide()
            }
        },
        like: function() {
            if (vk.id) {
                var e = !cur.mkOptions.liked;
                ajax.post("like.php", {
                    act: "a_do_" + (e ? "" : "un") + "like",
                    object: cur.mkOptions.like_obj,
                    hash: cur.mkOptions.likehash
                }, {
                    onDone: function(t, r) {
                        return Market.likeUpdate(e, t, r)
                    }
                }), Market.likeUpdate(e, cur.mkOptions.likes + (e ? 1 : -1))
            }
        },
        likeShare: function(e) {
            if (vk.id) {
                var t = ge("like_share_" + cur.mkOptions.like_obj),
                    r = isChecked(t);
                checkbox(t), ajax.post("like.php", {
                    act: "a_do_" + (r ? "un" : "") + "publish",
                    object: cur.mkOptions.like_obj,
                    hash: e
                }, {
                    onDone: Market.likeUpdate.pbind(!0)
                });
                var o = ge("like_real_count_" + cur.mkOptions.like_obj),
                    a = o ? o.value : val("like_count" + cur.mkOptions.like_obj),
                    s = hasClass(ge("like_icon" + cur.mkOptions.like_obj), "my_like");
                Market.likeUpdate(!0, intval(a) + (s ? 0 : 1))
            }
        },
        likeShareCustom: function() {
            vk.id && showBox("like.php", {
                act: "publish_box",
                object: cur.mkOptions.like_obj,
                list: ""
            })
        },
        likeOver: function(e) {
            var t = domByClass(e, "_icon");
            if (t && !cur.viewAsBox) {
                var r = 41,
                    o = getXY(e)[0],
                    a = getXY(t)[0],
                    s = getSize(t, !0)[0],
                    i = a + s / 2 - o - r;
                showTooltip(e, {
                    url: "like.php",
                    params: {
                        act: "a_get_stats",
                        object: cur.mkOptions.like_obj
                    },
                    slide: 15,
                    shift: [-i, 6],
                    ajaxdt: 100,
                    showdt: 400,
                    hidedt: 200,
                    typeClass: "like_tt",
                    className: "market_like_tt",
                    dir: "auto"
                })
            }
        },
        updateCommentsOnScroll: function(e) {
            return !1
        },
        commDone: function(node, text, del, script) {
            if (node) {
                var fChild = domFC(node),
                    msg = domNS(fChild);
                if (!text) return show(fChild), hide(msg), void(cur.mkOptions && void 0 !== cur.mkOptions.commCount && (++cur.mkOptions.commCount, ++cur.mkOptions.commShown,
                    Market.updateComms()));
                msg ? (msg.innerHTML = text, show(msg)) : node.appendChild(ce("div", {
                    innerHTML: text
                })), hide(fChild), cur.mkOptions && void 0 !== cur.mkOptions.commCount && (del ? (--cur.mkOptions.commCount, --cur.mkOptions.commShown, Market.updateComms()) :
                    (setTimeout(WkView.updateHeight, 2), cur.mkComments || (cur.mkComments = {}), cur.mkComments[cur.mkOptions.itemRaw] = ge("market_comments_wrap")),
                    script && eval(script))
            }
        },
        commAction: function(e, t, r, o) {
            var a = gpeByClass("reply", t);
            actionsWrap = gpeByClass("post_actions", t), hasClass(a, "post_actions_progress") || ajax.post("al_market.php", {
                act: e + "_comment",
                comment: r,
                hash: o
            }, {
                onDone: Market.commDone.pbind(a),
                showProgress: addClass.pbind(actionsWrap, "post_actions_progress"),
                hideProgress: removeClass.pbind(actionsWrap, "post_actions_progress")
            })
        },
        comments: function(e) {
            if (e) {
                var t = domFC(ge("market_comments"))
                    .id || "";
                if (!isVisible("market_comments_header") || geByClass1("progress_inline", "market_comments_header") || WkView.cmp(t, "post" + e) < 0) return
            }
            ajax.post("al_market.php", {
                act: "a_get_comments",
                offset: cur.mkOptions.commShown,
                item: cur.mkOptions.itemRaw
            }, {
                onDone: function(t, r) {
                    Market.receiveComms(t, r, !1, e), e && ge("post" + e) && Wall.scrollHighlightReply("post" + e)
                },
                showProgress: function() {
                    ge("market_comments_header")
                        .innerHTML = "", showProgress("market_comments_header")
                },
                hideProgress: function() {
                    ge("market_comments_header")
                        .innerHTML = ""
                }
            })
        },
        updateComms: function() {
            setTimeout(WkView.updateHeight, 2);
            var e = "";
            cur.mkOptions.commCount > cur.mkOptions.commShown && (e = cur.mkOptions.commCount - cur.mkOptions.commShown), ge("market_comments_summary")
                .innerHTML = getLang("market_view_comments_summary", cur.mkOptions.commCount), ge("market_comments_header")
                .innerHTML = getLang("market_show_previous_comments", e), show("market_comments_wrap"), toggleClass("market_comments_wrap", "market_comments_expanded", !e),
                WkView.updateSize(), cur.mkComments || (cur.mkComments = {}), cur.mkComments[cur.mkOptions.itemRaw] = ge("market_comments_wrap")
        },
        receiveComms: function(e, t, r, o) {
            for (var a = ce("div", {
                    innerHTML: e
                }), s = ge("market_comments"), i = current = domLC(s), n = getXY(current, !0)[1], c = domLC(a); c; c = domLC(a)) {
                for (ge("market_reply_form") && addClass(c, "reply_replieable"); current && WkView.cmp(current.id, c.id) > 0;) current = domPS(current);
                current && !WkView.cmp(current.id, c.id) ? (s.replaceChild(c, current), current = c) : (current && domNS(current) ? (s.insertBefore(c, domNS(current)), ++cur.mkOptions
                        .commCount) : !current && domFC(s) ? r === !0 ? (--cur.mkOptions.commShown, a.removeChild(c)) : s.insertBefore(c, domFC(s)) : s.appendChild(c), ++
                    cur.mkOptions.commShown)
            }
            o && i && (wkLayerWrap.scrollTop += getXY(i, !0)[1] - n), extend(cur.mkOptions.reply_names, t), window.updateWndVScroll && updateWndVScroll(), Market.updateComms()
        },
        commSaved: function(e) {
            var t = ge("market_comments_wrap"),
                r = t ? cur.mkOptions.itemRaw : !1,
                o = e.match(/^(-?\d+)market(_\d+)/);
            r && o && ge("market_comment" + o[1] + o[2]) && (cur.mkComments || (cur.mkComments = {}), cur.mkComments[cur.mkOptions.itemRaw] = t)
        },
        sendComment: function(e, t, r) {
            var o = ge("reply_field" + e),
                a = ge("reply_button" + e),
                s = (ge("feedback_row" + e), (cur.mkOptions.reply_names[(cur.reply_to || {})[0]] || [])[1]),
                i = o && data(o, "composer");
            if (r.stickerId) var n = {
                message: "",
                attach1_type: "sticker",
                attach1: r.stickerId
            };
            else {
                var n = i ? Composer.getSendParams(i, Market.sendComment.pbind(e)) : {
                    message: trim(Emoji.editableVal(o))
                };
                if (n.delayed) return;
                if (!n.attach1_type && (!n.message || s && !s.indexOf(n.message))) return void Emoji.editableFocus(o, !1, !0)
            }
            hide("reply_warn" + e), ajax.post("al_market.php", Wall.fixPostParams(extend(n, {
                act: "post_comment",
                item: cur.mkOptions.itemRaw,
                hash: cur.mkOptions.hash,
                from_group: hasClass(domClosest("_submit_post_box", ge("market_reply_as_group")), "as_group") ? 1 : "",
                reply_to: (cur.reply_to || {})[1]
            })), {
                onDone: function(r, a) {
                    ++cur.mkOptions.commCount, Market.receiveComms(r, a, !0), wkLayerWrap.scrollTop = wkLayerWrap.scrollHeight, i ? Composer.reset(i) : Emoji.val(o,
                        ""), o.autosize && o.autosize.update(), browser.mobile ? Wall.hideEditReply(e) : (Emoji.editableFocus(o, !1, !0), Wall.cancelReplyTo(e,
                        t)), re("reply_link" + e)
                },
                onFail: function(e) {
                    return o ? (showTooltip(o, {
                        text: e,
                        showdt: 200,
                        forcetodown: 0,
                        slide: 15
                    }), Emoji.editableFocus(o, !1, !0), !0) : void 0
                },
                showProgress: lockButton.pbind(a),
                hideProgress: unlockButton.pbind(a)
            })
        },
        reportComment: function(e, t, r) {
            stManager.add(["privacy.js", "privacy.css"], function() {
                return Privacy.show(e, t, "report_" + r)
            })
        },
        _onEdit: function() {
            window.WkView && WkView.hide(), Market.showEditBox(cur.mkOptions.itemId, cur.mkOptions.itemOwnerId)
        },
        _onDelete: function() {
            Market.deleteItem(cur.mkOptions.itemId, cur.mkOptions.itemOwnerId, cur.mkOptions.editHash)
        }
    },
    MarketChooseBox = {
        init: function() {
            extend(cur.marketChooseBox, {
                searchInputEl: ge("market_search_input"),
                tabAll: ge("market_subtab_pane_all"),
                tabAlbums: ge("market_subtab_pane_albums"),
                tabAlbum: ge("market_subtab_pane_album"),
                tabSearch: ge("market_subtab_pane_search"),
                tabs: geByClass1("market_choose_box_tabs"),
                curTab: null,
                curTabId: "all",
                prevTab: null,
                curAlbum: 0,
                curAlbumCount: 0,
                box: ge("market_choose_box"),
                more: ge("ui_all_load_more"),
                isLoading: !1
            }), MarketChooseBox.setCurrentTab(cur.marketChooseBox.tabAll), MarketChooseBox.initScroll()
        },
        initScroll: function() {
            addEvent(ge("box_layer_wrap"), "scroll", MarketChooseBox.onScroll)
        },
        onScroll: function() {
            if (cur.marketChooseBox.disableScroll[cur.marketChooseBox.curTabId]) return !1;
            var e = geByClass1("ui_load_more_btn", cur.marketChooseBox.curTab);
            if (e) {
                var t = clientHeight(),
                    r = scrollGetY(),
                    o = getXY(e);
                r + t > o[1] - t / 2 && MarketChooseBox.showMore(cur.marketChooseBox.curTabId, e)
            }
        },
        showMore: function(e, t) {
            if (!cur.marketChooseBox.isLoading) {
                if (-1 == ["search", "album", "albums", "all"].indexOf(e)) return !1;
                var r = {
                    type: e,
                    to_id: cur.oid,
                    act: "a_choose_box_get_items",
                    offset: cur.marketChooseBox.position[e],
                    limit: cur.marketChooseBox.perPage[e]
                };
                if ("search" == e) {
                    var o = trim(val(cur.marketChooseBox.searchInputEl));
                    r.q = o, r.album_id = cur.marketChooseBox.curAlbum
                } else "album" == e && (r.album_id = cur.marketChooseBox.curAlbum);
                ajax.post("/al_market.php", r, {
                    cache: 1,
                    onDone: function(r, o, a) {
                        t.insertAdjacentHTML("beforeBegin", o), cur.marketChooseBox.position[e] += r, a || (hide(geByClass1("ui_load_more_btn", cur.marketChooseBox
                            .curTab)), cur.marketChooseBox.disableScroll[e] = !0)
                    },
                    showProgress: function() {
                        cur.marketChooseBox.isLoading = !0
                    },
                    hideProgress: function() {
                        cur.marketChooseBox.isLoading = !1
                    }
                })
            }
        },
        setCurrentTab: function(e) {
            cur.marketChooseBox.prevTab = cur.marketChooseBox.curTab, hide(cur.marketChooseBox.prevTab), cur.marketChooseBox.curTab = e, e == cur.marketChooseBox.tabAll ? cur.marketChooseBox
                .curTabId = "all" : e == cur.marketChooseBox.tabAlbums ? cur.marketChooseBox.curTabId = "albums" : e == cur.marketChooseBox.tabAlbum ? cur.marketChooseBox.curTabId =
                "album" : e == cur.marketChooseBox.tabSearch && (cur.marketChooseBox.curTabId = "search"), show(cur.marketChooseBox.curTab)
        },
        switchTabInBox: function(e, t) {
            cancelEvent(t);
            var r = gpeByClass("ui_tabs", e);
            if (geByClass1("ui_tab_sel", r) == e) return !1;
            uiTabs.switchTab(e);
            var o = e.parentElement.getAttribute("data-id");
            return "all" == o ? MarketChooseBox.setCurrentTab(cur.marketChooseBox.tabAll) : "albums" == o && MarketChooseBox.setCurrentTab(cur.marketChooseBox.tabAlbums), !1
        },
        getAlbum: function(e, t, r) {
            cancelEvent(r);
            var o = "album";
            cur.marketChooseBox.position[o] = 0, cur.marketChooseBox.disableScroll[o] = !1;
            var a = {
                type: o,
                offset: cur.marketChooseBox.position[o],
                limit: cur.marketChooseBox.perPage[o],
                act: "a_choose_box_get_items",
                to_id: e,
                album_id: t
            };
            ajax.post("/al_market.php", a, {
                onDone: function(e, r, a) {
                    cur.marketChooseBox.tabAlbum.innerHTML = r, cur.marketChooseBox.position[o] = e, a || (cur.marketChooseBox.disableScroll[o] = !0), cur.marketChooseBox
                        .curAlbum = t, 0 == e && hide(cur.marketChooseBox.searchInputEl), MarketChooseBox.setCurrentTab(cur.marketChooseBox.tabAlbum), hide(cur.marketChooseBox
                            .tabs), MarketChooseBox.showBackButton()
                },
                showProgress: function() {
                    cur.marketChooseBox.isLoading = !0
                },
                hideProgress: function() {
                    cur.marketChooseBox.isLoading = !1
                }
            })
        },
        showBackButton: function() {
            var e = curBox();
            geByClass1("box_title", e.titleWrap)
                .innerHTML = '<div class="back" onclick="MarketChooseBox.chooseBoxBack();">' + getLang("market_box_title_back") + "</div>"
        },
        attachItem: function(e, t, r, o) {
            if (cancelEvent(o), "item" == e) {
                var a = {
                    act: "a_market_attach",
                    owner_id: t,
                    item_id: r
                };
                ajax.post("/al_market.php", a, {
                    onDone: function(e, t) {
                        cur.chooseMedia("market", e, t, !1, !1, !1)
                    }
                })
            } else if ("album" == e) {
                var a = {
                    act: "a_market_attach",
                    owner_id: t,
                    item_id: r,
                    is_album: !0
                };
                ajax.post("/al_market.php", a, {
                    onDone: function(e, t, r) {
                        cur.chooseMedia("market_album", e, t, r, !0, !1);
                        var o = curBox();
                        o.hide()
                    }
                })
            }
        },
        chooseBoxBack: function() {
            if (cur.marketChooseBox.curTab == cur.marketChooseBox.tabSearch) MarketChooseBox.backFromSearch();
            else {
                var e = curBox();
                geByClass1("box_title", e.titleWrap)
                    .innerHTML = getLang("market_choose_product_title"), MarketChooseBox.setCurrentTab(cur.marketChooseBox.prevTab), show(cur.marketChooseBox.tabs), show(cur.marketChooseBox
                        .searchInputEl)
            }
        },
        onChangeQuery: function() {
            MarketChooseBox.searchItems()
        },
        backFromSearch: function() {
            var e = curBox();
            geByClass1("box_title", e.titleWrap)
                .innerHTML = getLang("market_choose_product_title"), show(cur.marketChooseBox.tabs), MarketChooseBox.setCurrentTab(cur.marketChooseBox.prevTab), cur.marketChooseBox
                .searchInputEl.value = ""
        },
        searchItems: function() {
            var e = trim(val(cur.marketChooseBox.searchInputEl));
            if ("" == e || e.length <= 3) return cur.marketChooseBox.curTab == cur.marketChooseBox.tabSearch && MarketChooseBox.backFromSearch(), !1;
            var t = "search";
            cur.marketChooseBox.position[t] = 0;
            var r = {
                type: t,
                offset: cur.marketChooseBox.position[t],
                limit: cur.marketChooseBox.perPage[t],
                q: e,
                album_id: cur.marketChooseBox.curAlbum,
                to_id: cur.oid,
                act: "a_choose_box_get_items"
            };
            ajax.post("/al_market.php", r, {
                cache: 1,
                onDone: function(e, r, o) {
                    cur.marketChooseBox.position[t] = e, cur.marketChooseBox.tabSearch.innerHTML = r, cur.marketChooseBox.curTab != cur.marketChooseBox.tabSearch &&
                        (hide(cur.marketChooseBox.tabs), MarketChooseBox.showBackButton(), MarketChooseBox.setCurrentTab(cur.marketChooseBox.tabSearch))
                },
                showProgress: function() {
                    cur.marketChooseBox.isLoading = !1
                },
                hideProgress: function() {
                    cur.marketChooseBox.isLoading = !1
                }
            })
        }
    },
    MarketTags = {
        init: function(e, t) {
            if (!this.inited) {
                var r = this;
                this.inited = !0, this.input = e, this.cont = e.parentNode;
                var o = ce("div", {
                    className: "results_container",
                    innerHTML: '<div class="result_list"></div><div class="result_list_shadow"><div class="shadow1"></div><div class="shadow2"></div></div>'
                });
                this.cont.appendChild(o), this.resultList = geByClass("result_list", o)[0], this.resultListShadow = geByClass("result_list_shadow", o)[0], hide(this.resultList,
                        this.resultListShadow), browser.chrome ? this.resultList.style.opacity = 1 : browser.safari || setStyle(this.resultListShadow, "top", browser.mozilla ?
                        0 : browser.msie && browser.version < 8 ? 0 : -1), this.resultList.style.width = this.resultListShadow.style.width = o.style.width = getSize(e)[0] +
                    "px", this.onShowCallback = t ? t.onShow : !1, this.initSelect(t), cur.indexTags = new vkIndexer(cur.tagsList, function(e) {
                        return e[1]
                    }), addEvent(e, "keyup click mouseup", r.inputUpHandler), addEvent(document, "click", r.documentClick), addEvent(e, "keypress keydown", r.inputDownHandler)
            }
        },
        inputUpHandler: function(e) {
            var t = MarketTags;
            if (t.select) {
                if ((t.select.isVisible() && t.select.active > -1 || cur.preventISRequest) && (delete cur.preventISRequest, inArray(e.keyCode, [KEY.UP, KEY.DOWN, KEY.PAGEUP,
                        KEY.PAGEDOWN, KEY.RETURN
                    ]))) return cancelEvent(e);
                clearTimeout(cur.requestTimeout);
                var r = val(t.input);
                return t.currentTerm = r, r ? void(cur.requestTimeout = setTimeout(function() {
                    var e = cur.indexTags.search(r),
                        o = t.getHighlight(r);
                    list = [];
                    for (var a = 0, s = e.length; s > a; a++) {
                        var i = clone(e[a]);
                        o && (i.push(""), i.push(i[1]), i[1] = i[1].replace(o.re, o.val)), list.push(i)
                    }
                    t.showSelectList(r, list)
                }, 300)) : void t.showSelectList(r, cur.tagsList.slice(0, 10))
            }
        },
        documentClick: function(e) {
            var t = MarketTags;
            t.select && e.target != t.input && t.select.hide()
        },
        inputDownHandler: function(e) {
            var t = MarketTags;
            if (t.select) {
                if (!t.select || t.select.active < 0) return e.keyCode == KEY.RETURN && t.select && (cur.preventISRequest = !0, t.select.hide()), !0;
                if (e.keyCode == KEY.RETURN || 10 == e.keyCode) {
                    if (t.select && t.select.isVisible()) return triggerEvent(document, e.type, e), cancelEvent(e)
                } else if (e.keyCode == KEY.SPACE) {
                    var r, o = t.select.list.childNodes[t.select.active],
                        a = o ? o.getAttribute("val") : "";
                    if (each(t.lastItems, function() {
                            this[0] == a && (r = this)
                        }), !r) return;
                    return val(input, r[3] + " "), focusAtEnd(input), cancelEvent(e)
                }
                return !0
            }
        },
        initSelect: function(e) {
            if (!this.select && window.Select && window._ui && this.resultList && this.resultListShadow) {
                this.guid = _ui.reg(this);
                var t = this;
                this.select = new Select(this.resultList, this.resultListShadow, {
                    selectFirst: !1,
                    onItemSelect: this.onItemSelect.bind(this),
                    onShow: function() {
                        return isFunction(t.onShowCallback) && t.onShowCallback(), _ui.sel(t.guid)
                    },
                    onHide: _ui.sel.pbind(!1),
                    cycle: !0
                }), this.select.hide()
            }
        },
        showSelectList: function(e, t) {
            var r = this;
            if (this.select) {
                if (t = isArray(t) && t.length ? t : [], !t.length) return void r.select.hide();
                this.select.clear(), this.lastItems = t, this.select.content(t), this.select.show(), isFunction(this.onShowCallback) && this.onShowCallback()
            }
        },
        onItemSelect: function(e) {
            if (this.select) {
                this.select.hide();
                var t;
                if (each(this.lastItems, function() {
                        this[0] == e && (t = this)
                    }), t) {
                    var r = ce("div", {
                            innerHTML: t[1]
                        }),
                        o = r.innerText || r.textContent;
                    o = "#" + o.replace(" ", "_"), val(this.input, o), toggleClass(cur.searchEl, "not_empty", !0), Market.updateList()
                }
            }
        },
        onEvent: function(e) {
            e.type == (browser.opera || browser.mozilla ? "keypress" : "keydown") && this.select.handleKeyEvent(e)
        },
        getHighlight: function(e) {
            var t = cur.indexTags,
                r = t.delimiter,
                o = t.trimmer;
            return e += " " + (parseLatin(e) || ""), e = escapeRE(e)
                .replace(/&/g, "&amp;"), e = e.replace(o, "")
                .replace(r, "|"), {
                    re: new RegExp("(" + e + ")", "gi"),
                    val: "<em>$1</em>"
                }
        },
        destroy: function(e) {
            cleanElems(this.resultList, this.resultListShadow), clearTimeout(e ? e.requestTimeout : cur.requestTimeout), removeEvent(this.input, "keyup click mouseup", this.inputUpHandler),
                removeEvent(document, "click", this.documentClick), removeEvent(this.input, "keypress keydown", this.inputDownHandler), this.select && (this.select.destroy(),
                    delete this.select), this.resultList && re(this.resultList.parentNode), delete this.lastItems, this.inited = !1
        }
    };
try {
    stManager.done("market.js")
} catch (e) {}
