var photos = {
    LOAD_TYPE_PHOTOS: "photos",
    LOAD_TYPE_ALBUMS: "albums",
    LOAD_TYPE_TAGGED: "tagged",
    changeAlbumPhoto: function(o) {
        showBox("al_photos.php", {
            act: "change_thumb_box",
            album: o
        })
    },
    onMouseOverEditRow: function(o) {
        var e = geByClass1("photos_photo_edit_row_desc_placeholder", o),
            t = geByClass1("photos_photo_edit_row_desc_input", o);
        setTitle(e, !1, val(t))
    },
    editInitSorter: function() {
        var o = ge("photos_container_photos");
        cur.photosEditSorter = new GridSorter(o, "photos_photo_edit_row_selector", {
            onReorder: photos.reorderPhotos
        })
    },
    updateEditHeaderPos: function() {
        void 0 === cur.photosEditHeaderEl && (cur.photosEditHeaderEl = geByClass1("photos_edit_selection_header")), cur.photosEditHeaderEl && (cur.photosEditHeaderElOffset =
            cur.photosEditHeaderElOffset || getXY(cur.photosEditHeaderEl)[1] - getSize(ge("page_header_cont"))[1], scrollGetY() >= cur.photosEditHeaderElOffset ?
            hasClass(cur.photosEditHeaderEl, "photos_header_fixed") || (addClass(cur.photosEditHeaderEl, "photos_header_fixed"), setStyle(cur.photosEditHeaderEl, {
                width: getSize(ge("page_body"))[0]
            }), setStyle(domNS(cur.photosEditHeaderEl), {
                "margin-top": getSize(cur.photosEditHeaderEl)[1] + "px"
            })) : (removeClass(cur.photosEditHeaderEl, "photos_header_fixed"), setStyle(cur.photosEditHeaderEl, {
                width: ""
            }), setStyle(domNS(cur.photosEditHeaderEl), {
                "margin-top": 0
            })))
    },
    _editGetSelectedCount: function() {
        var o = geByClass("photos_edit_selected")
            .length;
        if (cur.photoEditSelectedAll) {
            var e = geByClass("photos_photo_edit_row")
                .length;
            o = e > o ? cur.count - e + o : cur.count
        }
        return o
    },
    editSelectAll: function(o) {
        cur.photoEditSelectedAll = !o, each(geByClass("photos_photo_edit_row"), function() {
            toggleClass(this, "photos_edit_selected", cur.photoEditSelectedAll)
        }), photos._editUpdateSelectedCounter()
    },
    _editUpdateSelectedCounter: function() {
        var o, e = photos._editGetSelectedCount();
        o = e ? getLang("photos_edit_selected_count")
            .replace("{total}", cur.count)
            .replace("{count}", e) : langNumeric(cur.count, cur.lang.photos_edit_selected_count_initial, !0), val(ge("photos_edit_selected_label"), o), toggleClass(ge(
                "photos_edit_selected_actions"), "photos_selected", !!e);
        var t = ge("photos_select_all_toggle");
        cur.photosEditSelectedHalf = e >= cur.count / 2, cur.photosEditSelectedHalf ? val(t, getLang("photos_edit_deselect_all")) : val(t, getLang("photos_edit_select_all"))
    },
    selectEditPhoto: function(o, e) {
        var t = gpeByClass("photos_photo_edit_row", e),
            r = toggleClass(t, "photos_edit_selected");
        if (o.shiftKey && cur.photoEditPrevSelectedRowEl && cur.photoEditPrevSelectedRowEl != t)
            for (var a = gpeByClass("photos_edit_photos_container", e), i = domFC(a), s = 0; 2 > s && i;)(i == cur.photoEditPrevSelectedRowEl || i == t) && s++, s &&
                toggleClass(i, "photos_edit_selected", r), i = domNS(i);
        return cur.photoEditPrevSelectedRowEl = t, photos._editUpdateSelectedCounter(), !1
    },
    MAX_DESC_INPUT_HEIGHT: 600,
    startEditPhotoDescription: function(o, e) {
        function t(o, e, t, r) {
            var a = clean(val(t))
                .split("\n")
                .join("</br>") + "&nbsp;",
                i = ce("div", {
                    innerHTML: a,
                    className: "photos_photo_edit_row_desc_input"
                }, {
                    width: getSize(e)[0],
                    display: "block",
                    visibility: "hidden"
                });
            o.appendChild(i);
            var s = getSize(i)[1] + (browser.msie ? 10 : 0);
            setStyle(t, {
                height: Math.min(photos.MAX_DESC_INPUT_HEIGHT, Math.round(s))
            }), re(i)
        }
        photos.stopEditPhotoDescription();
        var r = gpeByClass("photos_edit_photos_container", e),
            a = hasClass(e, "photos_photo_edit_row") ? e : gpeByClass("photos_photo_edit_row", e),
            i = geByClass1("photos_photo_edit_row_desc_cont", a),
            s = geByClass1("photos_photo_edit_row_desc_placeholder", a),
            n = geByClass1("photos_photo_edit_row_desc_input", a);
        val(n, n.getAttribute("data-orig-desc")), t(i, s, n), show(n), addEvent(document, "click", photos.stopEditPhotoDescription), removeEvent(n, "input"), addEvent(n,
            "input", t.pbind(i, s, n)), n.select(), addClass(r, "photos_desc_editing"), addClass(a, "photos_row_desc_editing"), o && cancelEvent(o)
    },
    onEditPhotoDescriptionKeyPress: function(o) {
        switch (o.keyCode) {
            case 27:
                photos.stopEditPhotoDescription(null, !0);
                break;
            case 9:
                photos.stopEditPhotoDescription(null, !1);
                var e = gpeByClass("photos_photo_edit_row", o.currentTarget);
                e = domNS(e), e && photos.startEditPhotoDescription(null, e), cancelEvent(o)
        }
    },
    stopEditPhotoDescription: function(o, e) {
        if (!o || !hasClass(o.target, "photos_photo_edit_row_desc_input")) {
            removeEvent(document, "click", photos.stopEditPhotoDescription);
            var t;
            each(geByClass("photos_row_desc_editing"), function() {
                t = this, removeClass(t, "photos_row_desc_editing");
                var o = geByClass1("photos_photo_edit_row_desc_placeholder", t),
                    r = geByClass1("photos_photo_edit_row_desc_input", t),
                    a = t.getAttribute("data-id"),
                    i = t.getAttribute("data-edit-hash"),
                    s = "";
                if (e) s = r.getAttribute("data-orig-desc");
                else {
                    s = trim(val(r));
                    var n = r.getAttribute("data-orig-desc");
                    s != n && ajax.post("al_photos.php", {
                        act: "save_desc",
                        photo: a,
                        hash: i,
                        text: s,
                        edit: 1
                    }, {}), r.setAttribute("data-orig-desc", s), o.titleSet = !1
                }
                val(o, clean(s) || getLang("photos_add_description_placeholder")), toggleClass(o, "photos_edit_has_desc", !!s), hide(r)
            }), removeClass(gpeByClass("photos_edit_photos_container", t), "photos_desc_editing")
        }
    },
    updatePeriods: function() {
        cur.periods = geByClass("photos_period_delimiter")
    },
    destroyPeriod: function() {
        cur.fixedPeriod && (re(cur.fixedPeriod), cur.fixedPeriod = !1, cur.fixedPeriodEl = !1)
    },
    fixPeriod: function() {
        if (ge("photos_albums_block") && (photos.headerHeight = photos.headerHeight || getSize(ge("page_header_cont"))[1], cur.periods && cur.periods.length)) {
            var o = scrollGetY() + photos.headerHeight,
                e = !1,
                t = !1,
                r = getSize(cur.periods[0])[1];
            for (var a in cur.periods) {
                var i = getXY(cur.periods[a])[1];
                if (i >= o) break;
                e = cur.periods[a];
                var s = intval(a) + 1;
                t = cur.periods[s] ? getXY(cur.periods[s])[1] - o : !1
            }
            if (e) {
                if (e == cur.fixedPeriodEl) setTimeout(function() {
                    setStyle(cur.fixedPeriod, {
                        left: getXY(e)[0] + "px"
                    })
                });
                else {
                    if (cur.fixedPeriod) cur.fixedPeriod.innerHTML = e.innerHTML;
                    else {
                        var n = cur.fixedPeriod = ce("div", {
                            innerHTML: e.innerHTML,
                            className: "photos_period_delimiter_fixed"
                        }, {
                            left: getXY(e)[0] + "px"
                        });
                        ge("page_body")
                            .appendChild(cur.fixedPeriod), (cur._back ? cur._back.hide : cur.destroy)
                            .push(function() {
                                re(n)
                            })
                    }
                    cur.fixedPeriodEl = e
                }
                var d = t !== !1 ? t - r : 0;
                d >= 0 && (d = 0), cur.fixedPeriodTop !== d && (setStyle(cur.fixedPeriod, {
                    top: d + "px"
                }), cur.fixedPeriodTop = d)
            } else !e && cur.fixedPeriod && (re(cur.fixedPeriod), cur.fixedPeriod = !1, cur.fixedPeriodEl = !1)
        }
    },
    scrollResize: function() {
        if (!browser.mobile && !cur.pvShown) {
            var o = document.documentElement,
                e = window.innerHeight || o.clientHeight || bodyNode.clientHeight,
                t = scrollGetY(),
                r = ge("ui_photos_load_more"),
                a = ge("ui_albums_load_more"),
                i = ge("ui_tagged_load_more"),
                s = .8 * e;
            isVisible(r) && r.offsetTop - (t + e) < s && photos.load(), isVisible(a) && cur.showAllAlbums && a.offsetTop - (t + e) < s && photos.load(photos.LOAD_TYPE_ALBUMS),
                isVisible(i) && cur.showAllTagged && i.offsetTop - (t + e) < s && photos.load(photos.LOAD_TYPE_TAGGED), cur.fixPeriods && photos.fixPeriod(), photos.updateEditHeaderPos()
        }
    },
    initScroll: function() {
        cur.module = "photos", photos.scrollnode = browser.msie6 ? pageNode : window, addEvent(photos.scrollnode, "scroll", photos.scrollResize), addEvent(window, "resize",
            photos.scrollResize), removeEvent(window, "load", photos.initScroll), cur.destroy.push(function() {
            removeEvent(photos.scrollnode, "scroll", photos.scrollResize), removeEvent(window, "resize", photos.scrollResize)
        })
    },
    recache: function(o, e) {
        if (cur.loading) return cur.loading = 1, void setTimeout(photos.recache.pbind(o, e), 100);
        for (var t = cur.offset; ajaxCache["/" + nav.objLoc[0] + "#act=" + nav.objLoc.act + "&offset=" + t + "&part=1"]; t += 20) {
            var r = ajaxCache["/" + nav.objLoc[0] + "#act=" + nav.objLoc.act + "&offset=" + t + "&part=1"];
            r[0] += e, ajaxCache["/" + nav.objLoc[0] + "#act=" + nav.objLoc.act + "&offset=" + (t + e) + "&part=1"] = r, delete ajaxCache["/" + nav.objLoc[0] + "#act=" +
                nav.objLoc.act + "&offset=" + t + "&part=1"]
        }
        cur.offset += e
    },
    loaded: function(o, e, t, r) {
        r || (cur.loading = 0);
        var a, i, s, n, d, c;
        switch (r = r || photos.LOAD_TYPE_PHOTOS) {
            case photos.LOAD_TYPE_TAGGED:
                cur.taggedOffset = o, s = cur.moreFromTagged, d = cur.moreTaggedOpts, n = cur.taggedOffset;
                break;
            case photos.LOAD_TYPE_ALBUMS:
                cur.albumsOffset = o, s = cur.moreFromAlbums, d = cur.moreAlbumsOpts, n = cur.albumsOffset, c = cur.albumsCount;
                break;
            default:
                cur.offset = o, s = cur.moreFrom, d = cur.moreOpts, n = cur.offset, c = cur.count
        }
        a = ge("photos_container_" + r), i = ge("ui_" + r + "_load_more");
        for (var l = ce("div", {
                innerHTML: trim(e)
            }); l.firstChild;) {
            if (hasClass(l.firstChild, "photos_period_delimiter")) {
                var h = l.firstChild.getAttribute("data-year");
                if (geByClass1("photos_period_delimiter_" + h)) {
                    re(l.firstChild);
                    continue
                }
            }
            cur.photoEditSelectedAll && addClass(l.firstChild, "photos_edit_selected"), a.appendChild(l.firstChild)
        }
        return t && extend(cur.privacy, t), r == photos.LOAD_TYPE_PHOTOS && photos.updatePeriods(), o >= c || !e ? void hide(i) : void(r != photos.LOAD_TYPE_PHOTOS && (cur
            .loading = 1, ajax.post(s, extend({
                offset: n,
                part: 1
            }, d || {}), {
                cache: 1,
                onDone: function() {
                    2 == cur.loading ? photos.loaded.apply(window, arguments) : cur.loading = !1
                },
                onFail: function() {
                    return cur.loading = 0, !0
                }
            })))
    },
    load: function(o) {
        var e, t, r, a;
        switch (o = o || photos.LOAD_TYPE_PHOTOS) {
            case photos.LOAD_TYPE_PHOTOS:
                e = ge("ui_photos_load_more"), t = cur.moreFrom, r = cur.moreOpts, a = cur.offset;
                break;
            case photos.LOAD_TYPE_TAGGED:
                e = ge("ui_tagged_load_more"), t = cur.moreFromTagged, r = cur.moreTaggedOpts, a = cur.taggedOffset;
                break;
            case photos.LOAD_TYPE_ALBUMS:
                e = ge("ui_albums_load_more"), t = cur.moreFromAlbums, r = cur.moreAlbumsOpts, a = cur.albumsOffset
        }
        if (t && isVisible(e) && !isButtonLocked(e)) {
            if (cur.loading) return void(cur.loading = 2);
            o == photos.LOAD_TYPE_PHOTOS && r && (cur.loading = 1), ajax.post(t, extend({
                offset: a,
                part: 1
            }, r || {}), {
                onDone: photos.loaded,
                onFail: function() {
                    return cur.loading = 0, !0
                },
                showProgress: function() {
                    lockButton(e)
                },
                hideProgress: function() {
                    unlockButton(e)
                },
                cache: 1
            })
        }
    },
    loadMoreButtonClick: function(o) {
        switch (o) {
            case photos.LOAD_TYPE_ALBUMS:
                cur.showAllAlbums = !0;
                break;
            case photos.LOAD_TYPE_TAGGED:
                cur.showAllTagged = !0
        }
        this.load(o)
    },
    reorderAlbums: function(o, e, t) {
        var r = o.id.replace("album", ""),
            a = (e && e.id || "")
            .replace("album", ""),
            i = (t && t.id || "")
            .replace("album", "");
        ajax.post("al_photos.php", {
            act: "reorder_albums",
            album: r,
            before: a,
            after: i,
            hash: cur.reorderHash
        })
    },
    reorderPhotos: function(o, e, t) {
        var r = "edit" == nav.objLoc.act ? "photo_edit_row_" : "photo_row_",
            a = o.id.replace(r, ""),
            i = (e && e.id || "")
            .replace(r, ""),
            s = (t && t.id || "")
            .replace(r, "");
        ajax.post("al_photos.php", {
            act: "reorder_photos",
            photo: a,
            before: i,
            after: s,
            rev: nav.objLoc.rev,
            hash: cur.reorderHash
        })
    },
    privacy: function(o) {
        if ("photos_move" == o) {
            var e = Privacy.getValue(o);
            return e = e.split("_"), e = e[2], e != cur.album.split("_")[1] && photos.movePhoto(e), !0
        }
        var t = o.match(/^album(\d+)/);
        if (t) {
            var r = ge("album" + vk.id + "_" + t[1]);
            if (r) {
                if (r.helper) {
                    var a = getSize(r);
                    if (a[0] != r.w || a[1] != r.h) {
                        setStyle(r.helper, {
                            width: a[0],
                            height: a[1] - ge("photos_container")
                                .sorter.dh
                        }), extend(r, {
                            x: r.x - r.w / 2 + a[0] / 2,
                            w: a[0],
                            y: r.y - r.h / 2 + a[1] / 2,
                            h: a[1]
                        });
                        for (var i = r.nextSibling; i && i.nextSibling; i = i.nextSibling.nextSibling) setStyle(i.nextSibling, {
                            left: i.offsetLeft,
                            top: i.offsetTop
                        })
                    }
                }
                clearTimeout(cur["privacy_timer_" + o]), cur["privacy_timer_" + o] = setTimeout(ajax.post.pbind("al_friends.php", {
                    act: "save_privacy",
                    key: o,
                    val: Privacy.getValue(o),
                    hash: cur.privacyHash
                }), 500)
            }
        }
    },
    deleteAlbum: function(o, e) {
        showFastBox({
            title: getLang("photos_deleting_album"),
            dark: 1,
            bodyStyle: "padding: 20px;"
        }, getLang("photos_sure_del_album"), getLang("global_delete"), function(t) {
            ajax.post("al_photos.php", {
                act: "delete_album",
                album: o,
                hash: e
            }, {
                showProgress: lockButton.pbind(t),
                hideProgress: unlockButton.pbind(t)
            })
        }, getLang("global_cancel"))
    },
    showSaved: function(o, e) {
        var t = ge(o),
            r = function() {
                setTimeout(animate.pbind(t, {
                    backgroundColor: e,
                    borderLeftColor: "#D8DFEA",
                    borderRightColor: "#D8DFEA",
                    borderTopColor: "#D8DFEA",
                    borderBottomColor: "#D8DFEA"
                }, 1e3), 1e3)
            };
        isVisible(t) ? animate(t, {
            backgroundColor: "#E7F1F9",
            borderLeftColor: "#4C96D4",
            borderRightColor: "#4C96D4",
            borderTopColor: "#4C96D4",
            borderBottomColor: "#4C96D4"
        }, 200, r) : (show(t), r())
    },
    saveAlbum: function(o) {
        var e = {
            act: "save_album",
            album: cur.album,
            hash: cur.albumhash,
            title: ge("album_title")
                .value,
            desc: ge("album_description")
                .value
        };
        if (!e.title) return notaBene("album_title");
        var t = cur.album.replace(vk.id + "_", "");
        cur.privacy["album" + t] ? extend(e, {
            view: Privacy.getValue("album" + t),
            comm: Privacy.getValue("albumcomm" + t)
        }) : ge("album_only_check") && extend(e, {
            main: isChecked("album_main_check"),
            only: isChecked("album_only_check"),
            comm: isChecked("album_comments_check")
        }), ajax.post("al_photos.php", e, {
            onDone: function() {
                var o = ge("album_main_check");
                o && isChecked(o) && (addClass(o, "on"), addClass(o, "disabled"), hide("album_delete_action"));
                var e = ge("photos_changes_saved");
                setStyle(e, {
                    opacity: 1
                }), setTimeout(function() {
                    setStyle(e, {
                        opacity: 0
                    })
                }, 1500)
            },
            showProgress: lockButton.pbind(o),
            hideProgress: unlockButton.pbind(o)
        })
    },
    savePhotos: function() {
        for (var o = {
                act: "save_photos",
                album: cur.album,
                hash: cur.albumhash
            }, e = ge("photos_container"), t = 0, r = e.firstChild; r; r = r.nextSibling)
            if (r.firstChild && isVisible(r.firstChild)) {
                var a = r.id.replace("photo_edit_row", "");
                o["photo_id" + t] = a, o["photo_desc" + t] = ge("photo_caption" + a)
                    .value, ++t
            }
        ajax.post("al_photos.php", o, {
            onDone: function() {
                for (var o = e.firstChild; o; o = o.nextSibling)
                    if (o.firstChild && isVisible(o.firstChild)) {
                        var t = o.id.replace("photo_edit_row", "");
                        ge("photo_save_result" + t)
                            .innerHTML = getLang("photos_privacy_description")
                    }
                cur.descs = !1, scrollToTop(200), photos.showSaved("photos_saved_msg", "#F3F8FC"), ge("photos_container")
                    .sorter && sorter.update(ge("photos_container")
                        .sorter.elems[0])
            },
            progress: "photos_save_progress"
        })
    },
    deleteSelectedPhotos: function(o) {
        var e = [];
        each(geByClass("photos_edit_selected"), function() {
            e.push(this.getAttribute("data-id"))
        });
        var t = intval(photos._editGetSelectedCount() > e.length),
            r = cur.album.split("_");
        showBox("/al_photos.php", {
            act: "delete_selected_box",
            photo_ids: t ? "" : e.join(","),
            owner_id: r[0],
            album_id: r[1],
            all: t
        }, {
            onDone: function() {
                var e = curBox();
                e.removeButtons(), e.addButton(getLang("photos_del_selected_box_yes"), function(e) {
                    show("photos_del_box_progress"), hide("photos_del_box_text"), re(e);
                    var t = ge("photos_del_box_progress_text");
                    photos.doEditBatchProcess({
                        act: "a_delete_photos",
                        hash: o,
                        owner_id: r[0],
                        album_id: r[1]
                    }, cur.editDeletePhotosArray, ge("photos_del_box_progress_wrap"), "photos_del_selected_title_progress", function(o, e, r, a,
                        i) {
                        val(t, getLang("photos_del_selected_box_text_progress")
                            .replace("{count}", a)
                            .replace("{total}", i)), cur.count = Math.max(cur.count - o, 0), each(r, function(o, e) {
                            re("photo_edit_row_" + e), cur.count = Math.max(cur.count, 0)
                        }), photos._editUpdateSelectedCounter()
                    }, function() {
                        var o = curBox();
                        if (o && o.hide(), 0 == cur.count) nav.reload();
                        else {
                            var e = geByClass("photos_photo_edit_row")
                                .length;
                            40 > e && photos.load()
                        }
                    })
                }), e.addButton(getLang("box_cancel"), function() {
                    e.hide(), cur.editDeletePhotosArray = !1
                }, "no")
            }
        })
    },
    doEditBatchProcess: function(o, e, t, r, a, i) {
        function s(e) {
            if (!_.isVisible()) return i(u), void(document.title = p);
            var t = n.slice(e * c, (e + 1) * c);
            ajax.post("/al_photos.php", extend({
                photos: t.join(",")
            }, o), {
                onDone: function(o, n) {
                    u += o, e++, setStyle(h, {
                        width: 100 * e / l + "%"
                    });
                    var c = getLang(r)
                        .replace("{count}", u)
                        .replace("{total}", d);
                    document.title = c, a(o, n, t, u, d), l > e ? s(e) : setTimeout(function() {
                        document.title = p, i(u, n)
                    }, 200)
                }
            })
        }
        var n = e.split(","),
            d = n.length,
            c = cur.editPhotosMaxChunkSize || 50,
            l = Math.ceil(d / c),
            h = geByClass1("photos_progress_bar", ge(t)) || geByClass1("ui_progress_bar", ge(t)),
            u = 0,
            p = document.title,
            _ = curBox();
        a(0, !1, [], 0, d), s(0)
    },
    _showProgressPanel: function(o) {
        var e = se('<div class="photo_delete_progress _photo_delete_progress"><div class="round_spinner"></div></div>');
        return o.appendChild(e), e
    },
    _hideProgressPanel: function(o) {
        re(geByClass1("_photo_delete_progress", o))
    },
    deletePhoto: function(o, e, t) {
        var r;
        if ("" === o && t && (r = gpeByClass("photos_photo_edit_row", t), o = attr(r, "data-id"), e = attr(r, "data-edit-hash")), r = r || ge("photo_edit_row_" + o)) {
            var a = photos._showProgressPanel(r);
            addClass(r, "photos_deleted"), ajax.post("al_photos.php", {
                act: "delete_photo",
                photo: o,
                hash: e,
                edit: 1
            }, {
                onDone: function(o) {
                    re(a), r.appendChild(se(o)), photos.recache(cur.offset, -1), cur.count -= 1, photos._editUpdateSelectedCounter(), cur.count < 2 && hide(
                        "album_thumb_action"), ge("photos_go_to_album_cont") && !cur.count && hide("photos_go_to_album_cont"), cur.photoAddUpdate && cur.photoAddUpdate(
                        r), cur.introTooltipHide && cur.introTooltipHide(!0)
                }
            })
        }
    },
    restorePhoto: function(o, e, t) {
        var r = ge("photo_edit_row_" + e);
        if (r && hasClass(r, "photos_deleted")) {
            var a = photos._showProgressPanel(r);
            re(geByClass1("photos_restore", r)), ajax.post("al_photos.php", {
                act: "restore_photo",
                photo: e,
                hash: t,
                edit: 1
            }, {
                onDone: function() {
                    re(a), removeClass(r, "photos_deleted"), photos.recache(cur.offset, 1), cur.count += 1, photos._editUpdateSelectedCounter(), cur.count > 1 &&
                        show("album_thumb_action"), ge("photos_go_to_album_cont") && cur.count && show("photos_go_to_album_cont"), cur.photoAddUpdate && cur.photoAddUpdate(
                            r)
                },
                progress: "photo_restore_progress" + e
            })
        }
    },
    showMove: function(o, e, t) {
        var r = cur.moveddc,
            a = ge("photos_move_link" + o);
        cur.privacyPhotoMove ? Privacy.show(a, t, "photos_move") : (cur.zIndexUpdated && (photos.hideMove(), cur.noZIndexUpdate = !0), ge("photo_edit_row" + o) && (cur.zIndexUpdated =
            o, setStyle(ge("photo_edit_row" + o), {
                zIndex: 150
            })), photos.hideMove()), extend(cur, {
            movelnk: a,
            moveph: o,
            movehash: e
        }), cur.privacyPhotoMove || (a.parentNode.replaceChild(r, a), cur.movedd.focus(), cur.movedd.showDefaultList(), addEvent(document, "click", photos.hideMove))
    },
    hideMove: function() {
        if (cur.noZIndexUpdate) return void delete cur.noZIndexUpdate;
        if (!cur.privacyPhotoMove) {
            if (cur.movelnk) try {
                cur.moveddc.parentNode.replaceChild(cur.movelnk, cur.moveddc), cur.movelnk = !1, cur.movedd.clear(), cur.zIndexUpdated && ge("photo_edit_row" + cur.zIndexUpdated) &&
                    (setStyle(ge("photo_edit_row" + cur.zIndexUpdated), {
                        zIndex: 100
                    }), delete cur.zIndexUpdated)
            } catch (o) {}
            removeEvent(document, "click", photos.hideMove)
        }
    },
    movePhoto: function(o, e, t) {
        o = intval(o);
        var r = show.pbind("photo_return_progress" + e),
            a = hide.pbind("photo_return_progress" + e);
        if (!e) {
            if (!o || o == cur.album.split("_")[1]) return photos.hideMove();
            e = cur.moveph, t = cur.movehash, r = function() {
                hide("photo_delete_link" + e), show("photo_edit_progress" + e)
            }, a = function() {
                hide("photo_edit_progress" + e), show("photo_delete_link" + e)
            }
        }
        ajax.post("al_photos.php", {
            act: "move_photo",
            album: o,
            photo: e,
            hash: t
        }, {
            onDone: function(t) {
                var r = ge("photo_edit_row" + e);
                if (r && r.firstChild) {
                    if (o == cur.album.split("_")[1]) {
                        if (isVisible(r.firstChild)) return;
                        r.removeChild(r.firstChild.nextSibling), show(r.firstChild), photos.recache(cur.offset, 1), ++cur.count, cur.count > 1 && show(
                            "album_thumb_action")
                    } else {
                        if (!isVisible(r.firstChild)) return;
                        photos.hideMove(), hide(r.firstChild), r.appendChild(ce("div", {
                            innerHTML: t
                        })), photos.recache(cur.offset, -1), --cur.count, cur.count < 2 && hide("album_thumb_action")
                    }
                    cur.photoAddUpdate && cur.photoAddUpdate(r), cur.introTooltipHide && cur.introTooltipHide(!0), ge("photos_go_to_album_cont") && toggle(
                        "photos_go_to_album_cont", !!cur.count)
                }
            },
            onFail: function(o) {
                return photos.hideMove(), o ? (setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px;"
                    }, o)
                    .hide, 2e3), !0) : void 0
            },
            showProgress: r,
            hideProgress: a
        })
    },
    updateThumbs: function(o, e) {
        var t = ge("photos_add_img" + cur.peEditPhoto);
        t && (t.src = o)
    },
    editPhoto: function(o, e, t) {
        cur.peEditPhoto = o, showBox("al_photos.php", {
            act: "edit_photo",
            photo: o,
            webgl: 1,
            stat: ["ui_controls.css", "ui_controls.js"]
        }, {
            dark: 1
        })
    },
    backupDesc: function(o) {
        cur.descs || (cur.descs = {}), cur.descs[o] = trim(ge("photo_caption" + o)
            .value)
    },
    saveDesc: function(o, e) {
        var t = ge("photo_caption" + o)
            .value,
            r = cur.descs[o];
        delete cur.descs[o], trim(t) != r && ajax.post("al_photos.php", {
            act: "save_desc",
            photo: o,
            hash: e,
            text: t,
            edit: 1
        }, {
            onDone: function(e) {
                ge("photo_save_result" + o)
                    .innerHTML = e
            },
            onFail: function(e) {
                return ge("photo_save_result" + o)
                    .innerHTML = '<div class="photo_save_error">' + e + "</div>", !0
            },
            showProgress: function() {
                ge("photo_save_result" + o)
                    .innerHTML = getLang("photos_privacy_description"), show("photo_save_progress" + o)
            },
            hideProgress: function() {
                hide("photo_save_progress" + o)
            }
        })
    },
    genFile: function(o, e, t) {
        return ce("div", {
            innerHTML: '<a class="photo_file_cancel" id="photo_cancel' + o + '" onclick="' + e + '">' + t +
                '</a><div class="photo_file_button">  <div class="file_button_gray">    <div class="file_button" id="photo_file_button' + o + '">' + getLang(
                    "photos_choose_file") + "</div>  </div></div>    "
        })
    },
    initFile: function(o) {
        FileButton.init("photo_file_button" + o, {
            name: "photo",
            id: "photo_file" + o,
            accept: "image/jpeg,image/png,image/gif",
            onchange: photos.fileSelected
        })
    },
    addFile: function() {
        var o = cur.files.length,
            e = photos.genFile(o, "photos.fileCancel(" + o + ")", getLang("global_cancel"));
        extend(e, {
                className: "photo_upload_file",
                id: "photo_upload_row" + o
            }), ge("photo_upload_files")
            .appendChild(e), photos.initFile(o), cur.files.push({})
    },
    filesLoad: function() {
        for (var o = 0, e = 0; o < cur.files.length; ++o) {
            var t = ge("photo_file" + o)
                .value;
            if (t) break
        }
        if (o != cur.files.length) {
            cur.allcont = utilsNode.appendChild(ce("div", {
                innerHTML: '<iframe name="photo_frame_all"></iframe><form target="photo_frame_all" id="photo_form_all" method="POST" action="' + cur.url +
                    '" enctype="multipart/form-data"></form>    '
            })), form = ge("photo_form_all");
            var r = extend(cur.fields, {
                act: "do_add",
                al: 1,
                from_host: locHost,
                ondone: "photos.filesDone",
                onfail: "photos.filesFail"
            });
            for (e in r) form.appendChild(ce("input", {
                name: e,
                value: r[e]
            }));
            for (o = 0, e = 0; o < cur.files.length; ++o) {
                var a = ge("photo_file" + o);
                a.value && (a.name = "file" + e, form.appendChild(a), ++e)
            }
            form.submit()
        }
    },
    fileSelected: function() {
        var o = intval(this.id.replace("photo_file", ""));
        if (cur.files[o].deleting || !cur.files[o].cont && !cur.files[o].id) {
            cur["fileDone" + o] = photos.fileDone.pbind(o), cur["fileFail" + o] = photos.fileFail.pbind(o), cur.files[o].cont = utilsNode.appendChild(ce("div", {
                innerHTML: '<iframe name="photo_frame' + o + '"></iframe><form target="photo_frame' + o + '" id="photo_form' + o + '" method="POST" action="' +
                    cur.url + '" enctype="multipart/form-data"></form>    '
            })), form = ge("photo_form" + o);
            var e = extend(cur.fields, {
                act: "do_add",
                al: 1,
                from_host: locHost,
                ondone: "cur.fileDone" + o,
                onfail: "cur.fileFail" + o
            });
            for (var t in e) form.appendChild(ce("input", {
                name: t,
                value: e[t]
            }));
            form.appendChild(this), form.submit();
            var r = ge("photo_file_button" + o);
            lockButton(r), setTimeout(function() {
                    r.innerHTML = r.innerHTML
                }, 0), show("photo_cancel" + o), ge("photo_cancel" + o)
                .innerHTML = getLang("global_cancel"), o == cur.files.length - 1 && photos.addFile()
        }
    },
    fileDone: function(o, e) {
        hide("photo_cancel" + o);
        for (var t = "", r = o + 1; r < cur.files.length; ++r)
            if (cur.files[r].id && !cur.files[r].deleting) {
                t = cur.files[r].id;
                break
            }
        setTimeout(ajax.post.pbind("al_photos.php", extend({
            act: "done_add",
            before: t,
            context: 1
        }, q2ajx(e)), {
            onDone: function(e, t) {
                return e ? (cur.files[o].cont.innerHTML = "", utilsNode.removeChild(cur.files[o].cont), extend(cur.files[o], {
                        id: e,
                        deleting: !1,
                        cont: !1
                    }), ge("photo_upload_row" + o)
                    .innerHTML = t, autosizeSetup("photo_caption" + e, {
                        minHeight: 30
                    }), void show("photo_delete" + e)) : photos.fileFail(o, 0)
            },
            onFail: function(e) {
                return e ? (setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px;"
                    }, e)
                    .hide, 3e3), photos.fileCancel(o), !0) : void 0
            }
        }), 0)
    },
    fileCancel: function(o, e) {
        if (cur.files[o].cont && (cur.files[o].cont.innerHTML = "", utilsNode.removeChild(cur.files[o].cont)), !e) {
            var t = ge("photo_file_button" + o);
            unlockButton(t), t.innerHTML = getLang("photos_choose_file"), cur.files[o] = {}, photos.initFile(o), hide("photo_cancel" + o)
        }
    },
    fileFail: function(o, e) {
        photos.fileCancel(o)
    },
    fileDelete: function(o, e) {
        for (var t = 0; t < cur.files.length && cur.files[t].id != o;) ++t;
        if (t != cur.files.length && !cur.files[t].deleting) {
            cur.files[t].deleting = !0, ajax.post("al_photos.php", {
                act: "delete_photo",
                photo: o,
                hash: e,
                edit: 2
            }, {
                onFail: function() {
                    cur.files[t].deleting = !1
                }
            });
            var r = ge("photo_edit_row" + o);
            r.parentNode.insertBefore(photos.genFile(t, "photos.fileRestore('" + o + "', '" + e + "')", getLang("global_restore")), r), hide(r), photos.initFile(t), show(
                "photo_cancel" + t)
        }
    },
    fileRestore: function(o, e) {
        for (var t = 0, r = ""; t < cur.files.length && cur.files[t].id != o;) ++t;
        if (t != cur.files.length && cur.files[t].deleting && -1 !== cur.files[t].deleting) {
            if (cur.files[t].cont) return photos.fileCancel(t);
            for (var a = t + 1; a < cur.files.length; ++a)
                if (cur.files[a].id && !cur.files[a].deleting) {
                    r = cur.files[a].id;
                    break
                }
            cur.files[t].deleting = -1, ajax.post("al_photos.php", {
                act: "restore_photo",
                photo: o,
                hash: e,
                before: r,
                edit: 2
            }, {
                onDone: function() {
                    cur.files[t].deleting = !1
                }
            });
            var i = ge("photo_edit_row" + o);
            show(i), re(i.previousSibling)
        }
    },
    filesDone: function(o) {
        setTimeout(ajax.post.pbind("al_photos.php", extend({
            act: "done_add",
            context: 2
        }, q2ajx(o))), 0)
    },
    filesFail: function() {
        for (var o = 0; o < cur.files.length; ++o) photos.fileCancel(o);
        cur.allcont.innerHTML = "", utilsNode.removeChild(cur.allcont), cur.allcont = !1
    },
    chooseFlash: function() {
        return browser.flash < 10 ? animate(ge("photo_flash_needed"), {
            backgroundColor: "#FFEFE8",
            borderBottomColor: "#E89B88",
            borderLeftColor: "#E89B88",
            borderRightColor: "#E89B88",
            borderTopColor: "#E89B88"
        }, 100, function() {
            animate(ge("photo_flash_needed"), {
                backgroundColor: "#FFFFFF",
                borderBottomColor: "#CCCCCC",
                borderLeftColor: "#CCCCCC",
                borderRightColor: "#CCCCCC",
                borderTopColor: "#CCCCCC"
            }, 500)
        }) : (cur.photoCheckFails = 0, show("photo_flash_upload"), hide("photo_default_upload"), void hide("photo_upload_unavailable"))
    },
    chooseDefault: function() {
        cur.photoCheckFails = 0, show("photo_default_upload"), hide("photo_flash_upload"), cur.serverChecked ? (show("photo_upload_files"), hide("photo_default_check")) :
            (hide("photo_upload_files"), show("photo_default_check"), cur.checkUpload())
    },
    flashWidth: function() {
        return -1 == _ua.indexOf("Mac") || -1 == _ua.indexOf("Opera") && -1 == _ua.indexOf("Firefox") ? "600" : "601"
    },
    activeTab: function(o) {
        for (var e = domPN(domPN(o)), t = domFC(e); t; t = domNS(t)) removeClass(t, "active_link");
        addClass(domPN(o), "active_link")
    },
    checkHtml5Uploader: function() {
        return (window.XMLHttpRequest || window.XDomainRequest) && (window.FormData || window.FileReader && (window.XMLHttpRequest && XMLHttpRequest.sendAsBinary || window
            .ArrayBuffer && window.Uint8Array && (window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)))
    },
    upload: function(o, e) {
        return e && (2 == e.button || e.ctrlKey) ? (photos.checkHtml5Uploader() && (o.href += "&html5=1"), !0) : void 0 !== cur.uplId && window.Upload && Upload.checked &&
            Upload.checked[cur.uplId] && photos.checkHtml5Uploader() ? (ge("photos_upload_input")
                .click(), !1) : !0
    },
    uploadLink: function(o, e) {
        return photos.checkHtml5Uploader() && (o.href += "&html5=1"), nav.go(o, e)
    },
    onUploadSelect: function(o) {
        if (ge("photos_upload_area")) {
            window.filesToUpload = o;
            var e = ge("photos_upload_area")
                .innerHTML;
            ge("photos_upload_area")
                .innerHTML = '<img src="/images/upload.gif">', nav.go(ge("photos_upload_area")
                    .href + "&html5=1", !1, {
                        onFail: function(o) {
                            return ge("photos_upload_area")
                                .innerHTML = e, setTimeout(showFastBox({
                                        title: getLang("global_error"),
                                        dark: 1,
                                        bodyStyle: "padding: 20px;"
                                    }, o)
                                    .hide, 3e3), !0
                        }
                    })
        }
    },
    thumbOver: function(o, e, t) {
        cur.hideTO && cur.hideTO[e] && clearTimeout(cur.hideTO[e]);
        var r = geByClass1("description", o),
            a = geByClass1("photo_album_title", o),
            i = getSize(r)[1];
        animate(a, {
            marginTop: 163 - (i ? i + 7 : 0)
        }, {
            duration: 200,
            transition: Fx.Transitions.easeOutCirc
        });
        var s = geByClass1("photo_album_info_back", o),
            n = geByClass1("photo_album_info_cont", o);
        if (s && n) {
            if (s.over && !t) return void(s.over = 0);
            var d = t ? .6 : .5,
                c = t ? 1 : .8;
            t && (s.over = 1), animate(s, {
                opacity: d
            }, {
                duration: 200,
                transition: Fx.Transitions.easeOutCirc
            }), animate(n, {
                opacity: c
            }, {
                duration: 200,
                transition: Fx.Transitions.easeOutCirc
            })
        }
    },
    thumbOut: function(o, e, t) {
        var r = geByClass1("photo_album_info_back", o),
            a = geByClass1("photo_album_info_cont", o),
            i = function() {
                if (t) {
                    var e = (geByClass1("description", o), geByClass1("photo_album_title", o));
                    animate(e, {
                        marginTop: 163
                    }, 200)
                }
                if (r && a) {
                    var i = t ? 0 : .5,
                        s = t ? 0 : .8;
                    animate(r, {
                        opacity: i
                    }, 200), animate(a, {
                        opacity: s
                    }, 200)
                }
            };
        t ? (cur.hideTO = cur.hideTO || {}, cur.hideTO[e] = setTimeout(i, 150)) : i()
    },
    openEditor: function(o) {
        stManager.add(["photoview.js", "photoview.css"], function() {
            var e = gpeByClass("photos_photo_edit_row", o);
            cur.onPESave = function(o) {
                curBox()
                    .hide(), setStyle(geByClass1("photos_photo_edit_row_thumb", e), "background-image", "url('" + o + "')"), cur.onPESave = !1, bodyNode.style.overflow =
                    "auto"
            };
            var t = e.getAttribute("data-id");
            Photoview.openEditor(t, cur.savedThumbs ? cur.savedThumbs[t] : e.getAttribute("data-thumb"))
        })
    },
    addToAlbum: function() {
        showBox("/al_photos.php", {
            act: "move_photos_box",
            photos: (cur.savedPhotos || [])
                .join(",")
        }, {
            params: {
                dark: 1
            }
        })
    },
    movePhotosBox: function(o, e) {
        "" === o && e && (o = gpeByClass("photos_photo_edit_row", e)
            .getAttribute("data-id"));
        var t = [];
        o ? t.push(o) : each(geByClass("photos_edit_selected"), function() {
            t.push(this.getAttribute("data-id"))
        });
        var r = intval(photos._editGetSelectedCount() > t.length),
            a = cur.album.split("_");
        showBox("/al_photos.php", {
            act: "a_move_to_album_box",
            photo_ids: r ? "" : t.join(","),
            owner_id: a[0],
            from_album_id: a[1],
            all: r
        })
    },
    doMovePhotos: function(o, e, t, r, a, i) {
        var s = geByClass1("photos_album_counter", e),
            n = geByClass1("photos_album_thumb", e),
            d = ge("pv_move_to_album_progress");
        n.insertBefore(d, n.children[0]), show(d), addClass(e, "photos_in_progress"), addClass(gpeByClass("photos_container_albums", e), "photos_inactive"), photos.doEditBatchProcess({
            act: "move_photos_2",
            to_album_id: t,
            from_album_id: r,
            owner_id: a,
            hash: i
        }, cur.editPhotosArray, ge("pv_move_to_album_progress"), "photos_move_in_progress_title", function(o, e, t) {
            cur.count = Math.max(cur.count - o, 0), val(s, +val(s) + o), each(t, function(o, e) {
                re("photo_edit_row_" + e), cur.count = Math.max(cur.count, 0)
            }), photos._editUpdateSelectedCounter()
        }, function(o, e) {
            var r = curBox();
            r && r.hide();
            var i = langNumeric(o, cur.lang.photos_x_photos_moved_no_cancel);
            if (i = i.replace("{album}", '<a href="/album' + a + "_" + t + '">' + clean(e) + "</a>"), showDoneBox(i), 0 == cur.count) nav.reload();
            else {
                var s = geByClass("photos_photo_edit_row")
                    .length;
                40 > s && photos.load()
            }
        }), cancelEvent(o)
    },
    publishPhotos: function(o) {
        if (cur.savedPhotos) {
            cur.savingPhotos = !0;
            var e = {
                act: "post",
                type: "photos_upload",
                to_id: vk.id,
                attach1_type: "photos_list",
                attach1: (cur.savedPhotos || [])
                    .join(","),
                hash: cur.post_hash
            };
            ajax.post("/al_wall.php", e, {
                showProgress: lockButton.pbind(o),
                onDone: function() {
                    delete cur._back, nav.go("/al_profile.php"), showBackLink()
                }
            })
        }
        return !1
    },
    registerDragZone: function(o) {
        addEvent(document, "dragenter dragover", function(e) {
            return photos.checkHtml5Uploader() ? (setTimeout(function() {
                clearTimeout(cur.dragTimer), delete cur.dragTimer
            }, 0), o.on(e), cancelEvent(e)) : void 0
        }), addEvent(document, "dragleave", function(e) {
            cur.dragTimer && (clearTimeout(cur.dragTimer), delete cur.dragTimer), cur.dragTimer = setTimeout(function() {
                o.un(e)
            }, 100), cancelEvent(e)
        }), addEvent(document, "drop", function(e) {
            return o.un(e, !0), o.drop(e.dataTransfer.files), cancelEvent(e)
        }), cur.destroy.push(function() {
            removeEvent(document, "dragenter dragover"), removeEvent(document, "dragleave"), removeEvent(document, "drop")
        })
    },
    openWebcamPhoto: function() {
        var o = showBox("al_photos.php", {
            act: "webcam_photo",
            oid: cur.oid
        }, {
            params: {
                dark: 1
            }
        });
        o.setOptions({
            width: 644
        })
    },
    initWebcam: function(o, e) {
        cur.lang = extend(cur.lang || {}, e), o.setOptions({
            hideButtons: !0,
            width: 644,
            bodyStyle: "padding:0px;border:0px;"
        }), photos.cameraInit()
    },
    cameraInit: function() {
        var o = ["ajx=1"];
        for (var e in Upload.vars[cur.uplId]) o.push(e + "=" + Upload.vars[cur.uplId][e]);
        var t = Upload.uploadUrls[cur.uplId] + (Upload.uploadUrls[cur.uplId].match(/\?/) ? "&" : "?") + o.join("&"),
            r = {
                s_noCamera: getLang("profile_no_camera"),
                s_noAccess: getLang("profile_no_camera_access"),
                s_setAccess: getLang("profile_set_camera_access"),
                s_capture: getLang("profile_capture_image"),
                s_videoMode: getLang("profile_to_video_mode"),
                upload_url: t,
                saveClbk: "photos.cameraPhotoDone",
                hideClbk: "photos.uploadReturn",
                overClbk: "photos.cameraBtnOver",
                outClbk: "photos.cameraBtnOut",
                downClbk: "photos.cameraBtnDown",
                upClbk: "photos.cameraBtnUp",
                showSaveClbk: "photos.showCameraSaveBtn",
                hideSaveClbk: "photos.hideCameraSaveBtn",
                hideCaptureClbk: "photos.hideCameraCaptureBtn",
                progressClbk: "photos.cameraSaveProgress",
                getBtnsPos: "photos.updateCameraButtonsPos",
                jpgQuality: "95"
            };
        for (var a in r) r[a] = winToUtf(r[a]);
        var i = {
                url: "/swf/CaptureImg.swf",
                id: "flash_camera",
                width: 604,
                height: 480,
                preventhide: 1,
                style: "visibility: visible",
                version: 9
            },
            o = {
                allownetworking: "true",
                wmode: "transparent"
            };
        return this.addWebcamPhotoControls = geByClass1("add_webcam_photo_controls"), hide("camera_button_no"), renderFlash("webcam_photo", i, o, r), !1
    },
    cameraPhotoDone: function(o) {
        delete this.addWebcamPhotoControls, o = JSON.parse(o.replace(/\\"/g, '"')), ajax.post("al_photos.php", extend({
            act: "choose_uploaded"
        }, o), {
            onDone: function(o, e) {
                var t = curBox();
                t && t.hide(), photos.showEditView(o, e)
            }
        })
    },
    updateCameraButtonsPos: function() {
        var o = this.addWebcamPhotoControls,
            e = [],
            t = getXY(o);
        getSize(o);
        setStyle(this.addWebcamPhotoControls, {
            visibility: "visible"
        });
        var r = function(o, r) {
            if (isVisible(r.parentNode)) {
                var a = getXY(r),
                    i = getSize(r);
                e.push([a[0] - t[0], a[1] - t[1], i[0] + 2, i[1] + 2])
            }
        };
        each(geByTag("button", o), r), each(geByClass("button", o), r), 1 == e.length && e.push([999, 999, 1, 1]), ge("flash_camera")
            .setButtonsPos && ge("flash_camera")
            .setButtonsPos(e)
    },
    showCameraSaveBtn: function() {
        show("camera_button_no"), ge("camera_button_yes")
            .innerHTML = getLang("profile_oph_camera_save"), ge("camera_button_no")
            .innerHTML = getLang("profile_to_video_mode"), this.updateCameraButtonsPos()
    },
    hideCameraSaveBtn: function(o) {
        hide("camera_button_no");
        var e = ge("camera_button_no");
        ge("camera_button_yes")
            .innerHTML = getLang("profile_capture_image"), e && (e.innerHTML = getLang("profile_oph_camera_back")), o || this.updateCameraButtonsPos()
    },
    hideCameraCaptureBtn: function() {
        hide(ge("camera_button_no")
                .parentNode), ge("camera_button_yes")
            .innerHTML = getLang("profile_no_camera_back"), this.updateCameraButtonsPos()
    },
    cameraSaveProgress: function(o) {
        var e = ge("camera_button_yes");
        e && (o ? lockButton(e) : unlockButton(e))
    },
    cameraBtnOver: function(o) {
        var e = geByClass1(o, this.addWebcamPhotoControls);
        e && addClass(e, "hover")
    },
    cameraBtnOut: function(o) {
        var e = geByClass1(o, this.addWebcamPhotoControls);
        e && (removeClass(e, "hover"), removeClass(e, "active"))
    },
    cameraBtnDown: function(o) {
        var e = geByClass1(o, this.addWebcamPhotoControls);
        e && addClass(e, "active")
    },
    cameraBtnUp: function(o) {
        var e = geByClass1(o, this.addWebcamPhotoControls);
        e && removeClass(e, "active")
    },
    uploadReturn: function() {
        curBox()
            .hide(), delete this.addWebcamPhotoControls
    },
    showEditView: function(o, e) {
        cur.webcamPhotoMedia = o, cur.pvPhoto = null, cur.uploadPhotoData = e, stManager.add(["photoview.js"], function() {
            Photoview.openEditor(o, e.editable.sizes.x[0])
        })
    },
    onFiltersSave: function() {
        cur.imMedia ? cur.imMedia.chooseMedia("photo", cur.webcamPhotoMedia, extend(cur.uploadPhotoData, {
            upload_ind: cur.imUploadInd + "_selfie"
        })) : cur.chooseMedia("photo", cur.webcamPhotoMedia, extend(cur.uploadPhotoData, {
            upload_ind: cur.uplId + "_selfie"
        })), delete cur.webcamPhotoMedia, delete cur.uploadPhotoData
    },
    returnToWebcam: function() {
        curBox()
            .hide(), this.openWebcamPhoto()
    }
};
try {
    stManager.done("photos.js")
} catch (e) {}
