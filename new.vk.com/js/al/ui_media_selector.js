function MediaSelector(e, a, i, o) {
    function s(e, a, i) {
        if (e = ge(e), !e) return !1;
        i = i || {}, window.__addMediaIndex || (__addMediaIndex = 0);
        var o = ++__addMediaIndex,
            s = '<div class="media_selector clear_fix"></div>';
        e.innerHTML = s;
        var t, d = domByClass(e, "media_selector"),
            r = (i.reverseMargin || 25, {
                id: o,
                menuNode: d,
                types: a,
                lastTypes: a,
                activate: function(e) {
                    r.touched = e === !0, i.onActivate && i.onActivate()
                },
                show: function() {
                    if (t && (clearTimeout(t), t = 0), r.moreWrap && !hasClass(r.moreWrap, "shown")) {
                        i.forceToUp || replaceClass(r.moreWrap, "to_up", "to_down");
                        var e = domByClass(r.moreWrap, "_more_items"),
                            a = getClientRectOffsetY(e);
                        (a > 0 || i.forceToUp) && replaceClass(r.moreWrap, "to_down", "to_up"), setTimeout(addClass.pbind(r.moreWrap, "shown"), 0)
                    }
                },
                hide: function(e) {
                    if (!t) {
                        var a = function() {
                            t = 0, r.moreWrap && removeClass(r.moreWrap, "shown")
                        };
                        if (e) {
                            var i = domByClass(r.moreWrap, "_more_items");
                            hide(i), a(), setTimeout(show.pbind(i), 0)
                        } else t = setTimeout(a, 300)
                    }
                },
                setOptions: function(e) {
                    extend(i, e)
                },
                setItems: function(e) {
                    for (window.tooltips && tooltips.destroyAll(d); d.firstChild;) re(d.firstChild);
                    var a = void 0 !== i.hideAfterCount ? i.hideAfterCount : 4,
                        o = void 0 !== i.maxShown ? i.maxShown : 3,
                        s = !1,
                        t = i.hideItem,
                        l = (t || e.length > a) && !browser.mobile,
                        n = t && i.hideLabel || getLang("global_media_selector_more");
                    r.moreWrap = !1, r.lastTypes = e, each(e, function(e, a) {
                        var c, h = a[0],
                            _ = a[1],
                            p = a[2];
                        if (l && (t ? h == t : e == o)) {
                            var m = d.appendChild(ce("div", {
                                className: "ms_items_more_wrap"
                            }));
                            addEvent(m, "mouseover click", function(e) {
                                "mouseover" == e.type && r.touched || r.show()
                            }), addEvent(m, "mouseout", function() {
                                r.hide()
                            }), c = m.appendChild(ce("a", {
                                className: "ms_item_more",
                                innerHTML: '<span class="ms_item_more_label">' + n + "</span>"
                            })), c.setAttribute("tabindex", 0);
                            var u = ce("div", {
                                className: "ms_items_more_helper"
                            });
                            s = ce("div", {
                                className: "ms_items_more _more_items"
                            }), u.appendChild(s), c = m.appendChild(u), r.moreWrap = m
                        }
                        c = (s ? s : d)
                            .appendChild(ce("a", {
                                innerHTML: s ? _ : '<span class="blind_label">' + _ + "</span>",
                                className: "ms_item ms_item_" + h + " _type_" + h
                            })), c.setAttribute("tabindex", 0), s || (c.setAttribute("data-title", _), addEvent(c, "mouseover", function() {
                                showTitle(this, !1, !1, {
                                    noZIndex: !0
                                })
                            })), p && addEvent(c, "click", function() {
                                return r.hide(!0), i.onItemClick && !i.onItemClick(h) ? !1 : (p(), !1)
                            })
                    })
                }
            });
        return a && r.setItems(a), browser.msie && (removeEvent(e, "MSPointerDown"), addEvent(e, "MSPointerDown", r.activate.pbind(!0))), removeEvent(e, "mouseover"), addEvent(e,
            "mouseover click", r.activate), i.global || cur.destroy.push(function() {
            removeEvent(e, "mouseover click", r.activate)
        }), r
    }
    var t, d = [];
    o = o || {};
    var r = o.mediaHandlers || {};
    each(i || [], function(e, a) {
        var i = a[0],
            s = a[1],
            l = a[2];
        if (s) {
            var n = !1,
                c = o.toId || cur.postTo,
                h = {
                    to_id: c,
                    blockPersonal: o.blockPersonal
                };
            switch (h.mail_add = o.mail ? 1 : "", i) {
                case "graffiti":
                    n = showBox.pbind("al_wall.php", {
                        act: "canvas_draw_box",
                        to_id: c,
                        flash: browser.flash
                    }, {
                        cache: 1,
                        dark: 1
                    });
                    break;
                case "photos_list":
                    n = showBox.pbind("al_photos.php", extend(h, {
                        act: "choose_photo"
                    }), {
                        cache: 1,
                        stat: ["photos.js", "photos.css", "upload.js"],
                        dark: 1
                    });
                    break;
                case "photo":
                    n = r.photo ? r.photo.pbind(o) : showBox.pbind("al_photos.php", extend(h, {
                        act: "choose_photo",
                        max_files: o.limit || 10
                    }), {
                        cache: 1,
                        stat: ["photos.js", "photos.css", "upload.js"],
                        dark: 1
                    });
                    break;
                case "video":
                    n = showBox.pbind("al_video.php", extend(h, {
                        act: "a_choose_video_box"
                    }), {
                        cache: 1,
                        dark: 1
                    });
                    break;
                case "audio":
                    n = showBox.pbind("audio", extend(h, {
                        act: "a_choose_audio_box"
                    }), {
                        cache: 1,
                        dark: 1
                    });
                    break;
                case "poll":
                    n = function() {
                        t.chooseMedia("poll", "", l)
                    };
                    break;
                case "doc":
                    var _ = o.docParams || {};
                    _ = extend(_, {
                        act: "a_choose_doc_box"
                    }), n = r.doc ? r.doc.pbind(o) : showBox.pbind("docs.php", extend(h, _), {
                        stat: ["docs.css"]
                    });
                    break;
                case "map":
                    n = showBox.pbind("al_places.php", extend(h, {
                        act: "a_choose_place_box"
                    }), {
                        stat: ["places.css", "map.css", "maps.js", "ui_controls.css", "ui_controls.js", "boxes.css"],
                        width: 640,
                        bodyStyle: "padding: 0px;",
                        dark: 1
                    });
                    break;
                case "note":
                    n = showWiki.pbind({
                        note: "new"
                    }, !0, !1, {
                        queue: 1
                    });
                    break;
                case "postpone":
                    n = function() {
                        t.chooseMedia("postpone", s, l)
                    };
                    break;
                case "mark_as_ads":
                    n = function() {
                        t.chooseMedia("mark_as_ads", s, l)
                    };
                    break;
                case "gift":
                    n = function() {
                        var e = o.peer < 2e9 ? o.peer : 0,
                            e = e || cur.peer;
                        o.giftBoxPrepare && o.giftBoxPrepare(e), showBox("al_gifts.php", {
                            act: "get_gift_box",
                            mid: e,
                            fr: e == vk.id ? 1 : 0
                        }, {
                            stat: ["gifts.css", "wide_dd.js", "wide_dd.css"],
                            dark: 1
                        })
                    };
                    break;
                case "market":
                    n = showBox.pbind("al_market.php", extend(h, {
                        act: "a_choose_product_box"
                    }), {
                        cache: 1,
                        dark: 1
                    })
            }
            d.push([i, s, n])
        }
    });
    var l = o.limit || 10,
        n = l > 1,
        c = o.editable && (!browser.msie || browser.version > 8),
        h = o.sortable && (!browser.msie || browser.version > 8),
        _ = s(e, d, {
            onActivate: function() {
                cur.chooseMedia = t.chooseMedia, cur.showMediaProgress = t.showMediaProgress, cur.attachCount = t.attachCount, cur.lastAddMedia = t
            },
            onItemClick: function(e) {
                return n && t.attachCount() >= l && "postpone" !== e && "mark_as_ads" !== e ? (vk.widget ? showBox("blank.php", {
                    code: 1900,
                    limit: l
                }) : showFastBox(getLang("global_error"), getLang("attachments_limit", l)), !1) : !0
            },
            hideAfterCount: o.hideAfterCount,
            topOffset: o.topOffset,
            forceUp: o.forceUp,
            global: o.global,
            maxShown: o.maxShown,
            forceToUp: o.forceToUp
        });
    if (_) {
        a = a || "media_preview";
        var p, m = _.id,
            u = ge(a);
        if (n) {
            u.innerHTML = '<div id="page_pics_preview' + m + '" class="page_pics_preview media_preview clear_fix"></div><div id="page_dpics_preview' + m +
                '" class="page_pics_preview post_thumbed_media page_media_sortable media_preview clear_fix"></div><div id="page_docs_preview' + m +
                '" class="page_docs_preview post_thumbed_media page_media_sortable media_preview clear_fix"></div><div id="page_pdocs_preview' + m +
                '" class="page_docs_preview media_preview clear_fix"></div><div id="page_ldocs_preview' + m +
                '" class="page_docs_preview media_preview clear_fix"></div><div id="page_mpics_preview' + m +
                '" class="page_pics_preview media_preview clear_fix"></div><div id="page_ppdocs_preview' + m +
                '" class="page_docs_preview media_preview clear_fix"></div><div id="page_progress_preview' + m + '" class="page_progress_preview media_preview clear_fix"></div>';
            var g = domFC(u),
                v = domNS(g),
                w = domNS(v),
                f = domNS(w),
                k = domNS(f),
                b = domNS(k),
                C = domNS(b),
                p = domNS(C);
            removeClass(u, "media_preview"), addClass(u, "multi_media_preview")
        } else addClass(u, "med_no_attach"), show(u);
        return t = {
            _addMediaLink: e,
            lnkId: m,
            menu: _,
            types: d,
            phLists: {},
            handlers: {},
            chosenMedias: [],
            _showAddMedia: function() {
                _.show()
            },
            _hideAddMedia: function(e) {
                _.hide(e)
            },
            chooseMedia: function(a, i, s, d, r, p) {
                if (t.onChange && t.onChange(a, i, s, d) === !1) return void 0 !== s.upload_ind && re("upload" + s.upload_ind + "_progress_wrap"), !1;
                if ("note" == a && (cur.pbNoteAdded = !1), inArray(a, o.disabledTypes || [])) return !1;
                if (t.attachCount() >= l && void 0 === s.upload_ind && "postpone" !== a && "mark_as_ads" !== a || geByClass1("medadd_c_market", w)) {
                    if (n) return !1;
                    t.unchooseMedia()
                }
                var y = !1,
                    x = {};
                if (n && (each(t.chosenMedias, function() {
                        return this[0] == a && this[1] == i ? (y = !0, !1) : void(x[this[0]] = x[this[0]] ? x[this[0]] + 1 : 1)
                    }), y)) return !1;
                var S, P = "",
                    M = "",
                    I = "",
                    L = !1,
                    N = w,
                    A = "";
                switch (a) {
                    case "graffiti":
                        isObject(s) || (s = {
                            thumb: s || ""
                        }), P = '<div class="fl_l page_preview_graffiti"><img class="page_preview_graffiti" src="' + s.thumb + '" /></div>', N = L = b;
                        break;
                    case "photos_list":
                        hide(this._addMediaLink), vkImage()
                            .src = s[1];
                        var T = s[3].replace(/^{|}$/g, "");
                        T && (T += ","), T += '"queue":1', S = o.nocl ? "" : " onclick=\"return showPhoto('" + s[4] + "', '" + s[2] + "', " + T.replace(/"/g, "&quot;") +
                            ');"', P = "<div" + S + ' class="fl_l page_preview_photo"><img class="page_preview_photo" src="' + s[1] + '" /></div>', N = L = g;
                        break;
                    case "photo":
                        isObject(s) || (s = {
                                thumb_m: s[0] || "",
                                thumb_s: s[1] || "",
                                list: s[2] || "",
                                view_opts: s[3] || "",
                                upload_ind: s.upload_ind || void 0,
                                peEditable: s.peEditable
                            }), vkImage()
                            .src = s.thumb_m;
                        var T = s.view_opts.replace(/^{|}$/g, "");
                        if (T && (T += ","), T += '"queue":1', t.phLists[i] = s.list, c) {
                            if (!s.editable) return !1;
                            o.nocl || (s.editable.click = t.showPhoto.pbind(i, s.list, parseJSON("{" + T + "}")))
                        }
                        S = o.nocl ? "" : ' onclick="return cur.addMedia[' + t.lnkId + "].showPhoto('" + i + "', '" + s.list + "', {" + T.replace(/"/g, "&quot;") + '});"',
                            P = "<div " + S + ' class="fl_l page_preview_photo' + (p ? " page_preview_ph_graff" : "") + '"><img class="page_preview_photo" src="' + s.thumb_m +
                            '" /></div>', L = 1, N = g;
                        break;
                    case "video":
                        if (isObject(s) || (s = {
                                thumb: s || ""
                            }), c) {
                            if (!s.editable) return !1;
                            o.nocl || (s.editable.click = showVideo.pbind(i, !1, {
                                queue: 1
                            }))
                        }
                        S = o.nocl ? "" : " onclick=\"return showVideo('" + i + "', false, {queue:1});\"", P = "<div" + S +
                            ' class="fl_l page_preview_video"><img class="page_preview_video" src="' + s.thumb + '" /></div>', L = 1, N = g;
                        break;
                    case "audio":
                        if (!s.info) return !1;
                        var B = geByClass1("_audio_row_" + i);
                        B && (s = AudioUtils.getAudioFromEl(B)), P = Page.addAudioPreview(i, s), A = ' id="pam' + m + "_audio" + i + '"';
                        break;
                    case "doc":
                        if (!s.lang) return !1;
                        s.thumb && s.thumb_s ? (P = "gif" == s.ext ? '<a onclick="if (cur.cancelClick) return (cur.cancelClick = false);" target="_blank" href="' + s.href +
                            '" class="pam_dpic"><div class="page_preview_doc_photo"><img src="' + s.thumb +
                            '" align="center" /></div><div class="page_preview_doc_photo_hint doc_gif">' + s.title + "</div>" :
                            '<a onclick="if (cur.cancelClick) return (cur.cancelClick = false);" target="_blank" href="' + s.href +
                            '" class="pam_dpic"><div class="page_preview_doc_photo"><img src="' + s.thumb +
                            '" align="center" /></div><div class="page_preview_doc_photo_hint">' + s.title + "</div>", M = '</a><div class="pam_bg"></div>', N = L = v,
                            A = ' id="pam' + m + "_doc" + i + '"') : (P = "", M = '<div class="page_doc_row"><a target="_blank" href="' + s.href +
                            '" class="page_doc_icon page_doc_icon' + intval(s.type) + '"></a><a target="_blank" href="' + s.href + '" class="page_doc_title">' + s.title +
                            '</a><div class="page_doc_size">' + s.size_str + "</div></div>", A = ' id="pam' + m + "_doc" + i + '"');
                        break;
                    case "share":
                        if (x.share || x.page || !s.lang) return !1;
                        if (isArray(s) && (s = {
                                domain: s[0],
                                url: s[1],
                                initialPattern: s[2],
                                title: s[3],
                                description: s[4],
                                images: [s[5]],
                                user_id: s[6],
                                photo_id: s[7]
                            }), s.media = s.media || i, s.draft) return t.checkURL(s.url), !1;
                        P = '<a target="_blank" href="/away.php?to=' + encodeURIComponent(s.url) + '" class="medadd_h medadd_h_link inl_bl">' + s.lang.profile_choose_link +
                            "</a>", t.shareData = extend(t.shareData || {}, s, {
                                imagesStyles: [""]
                            }), N = k;
                        break;
                    case "poll":
                        if (!s.lang) return !1;
                        P = '<div class="medadd_h medadd_h_poll inl_bl">' + s.lang.q + "</div>", hide(domByClass(_.menuNode, "_type_poll")), N = f;
                        break;
                    case "map":
                        var U = 340,
                            q = 127;
                        P = "<div class=\"fl_l\"><a onclick=\"return showBox('al_places.php', {act: 'geo_box', lat: " + s[0] + ", long: " + s[1] + ", provider: " + intval(
                                s[3]) + '}, {dark: 1});"><div class="page_media_map_point"></div><img class="page_preview_map" width="' + U + '" height="' + q +
                            '" src="/maps?lat=' + s[0] + "&lng=" + s[1] + "&z=11&" + (window.devicePixelRatio >= 2, "w=" + 2 * U + "&h=" + 2 * q) + '" /></a></div>', N = L =
                            b, hide(domByClass(_.menuNode, "_type_map"));
                        break;
                    case "page":
                        if (x.share || x.page || !s.lang) return !1;
                        var D = s.media.split("_");
                        P = '<a href="/page' + s.media + '" onclick="return showWiki({oid: ' + D[0] + ", id: " + D[1] +
                            '}, false, event, {queue: 1})" class="medadd_h medadd_h_page inl_bl">' + s.lang.profile_choose_page + "</a>", N = k;
                        break;
                    case "album":
                        if (s.thumb.match(/^\/images\//) && (s.thumb = ""), c) {
                            if (!s.editable) return !1;
                            extend(s.editable, {
                                title: s.title,
                                size: s.count,
                                click: o.nocl ? !1 : nav.change.pbind({
                                    z: "album" + i
                                })
                            })
                        }
                        var E = s.thumb;
                        vkImage()
                            .src = E, S = o.nocl ? "" : ' href="/album' + i + '" onclick="return nav.change({z: \'album' + i + "'}, event)\"";
                        var F = "fl_l page_album_link" + (E ? "" : " page_album_nocover");
                        P = '<a class="' + F + '" ' + S + ">" + (E ? '<div class="page_album_thumb_wrap"><img class="page_album_thumb" src="' + E + '"/></div>' : "") +
                            '  <div class="page_album_title">    <div class="page_album_size">' + s.count + '</div>    <div class="page_album_title_text">' + s.title +
                            "</div>  </div></a>", L = 1, N = g;
                        break;
                    case "note":
                        if (!s.lang) return !1;
                        P = "<a onclick=\"showWiki({w: 'note" + s.raw + '\', edit: 1}, true, event, {queue: 1})" class="medadd_h medadd_h_note inl_bl">' + s.lang.profile_choose_note +
                            "</a>", M = '<div class="medadd_c medadd_c_note"><a onclick="showWiki({w: \'note' + s.raw +
                            '\', edit: 1}, true, event, {queue: 1})" id="share_note_title' + s.raw + '">' + s.title + "</a></div>", N = k;
                        break;
                    case "market":
                        P = '<div class="medadd_c_market fl_l"><a target="_blank" href="' + s.href + '"><img class="medadd_c_market_thumb fl_l" src="' + s.thumb +
                            '" /></a><div class="medadd_c_market_info fl_l"><a class="medadd_c_market_title" target="_blank" href="' + s.href + '">' + s.title +
                            '</a><div class="medadd_c_market_price">' + s.price + "</div></div>", hide(e);
                        break;
                    case "market_album":
                        if (c) {
                            if (!s.editable) return !1;
                            extend(s.editable, {
                                title: s.title,
                                msize: langNumeric(s.count, s.lang.profile_X_market_items),
                                click: !1
                            })
                        }
                        var D = i.split("_");
                        vkImage()
                            .src = s.thumb, S = o.nocl ? "" : ' href="/market' + D[0] + "?section=album_" + D[1] + '"';
                        var F = "fl_l page_preview_album wall_album_cover_wrap wall_market_album_cover" + (s.thumb ? "" : " page_album_nocover");
                        P = '<a class="' + F + '" ' + S + ">" + (s.thumb ? '<img class="wall_album_cover" src="' + s.thumb + '"/>' : "") +
                            '  <div class="wall_album_caption">    <div class="wall_album_title_wrap clear_fix">      <div class="wall_album_count fl_r">' + s.count +
                            '</div>      <div class="wall_album_title">' + s.title + "</div>    </div>  </div></a>", L = 1, N = g;
                        break;
                    case "postpone":
                        if (P = '<div class="medadd_h medadd_h_timer inl_bl">' + s.lang.profile_choose_timer + '<span id="postpone_preview' + m + '"></span></div>', cur.editingPost &&
                            !n) i = intval(i), i ? s.date = i : s.date = intval(cur.editingPost[7]), ge("wpe_save")
                            .innerHTML = getLang("global_save");
                        else if (cur.editingPost && "wpe_media_preview" == domPN(C)
                            .id) {
                            i = intval(i), i ? s.date = i : s.date = intval(cur.editingPost[7]);
                            var z = geByClass1("medadd_c_timersett", C);
                            if (z) {
                                var R = domPN(z);
                                z = R.innerHTML, re(R)
                            } else z = "";
                            ge("wpe_save")
                                .innerHTML = getLang("global_save")
                        } else {
                            s.draft ? s.date = intval(i) : cur.postponedLastDate && (s.date = intval(cur.postponedLastDate) + 3600);
                            var H = ge("official");
                            H && (isChecked(H) || (checkbox(H), toggle("signed", !0)), addClass(H, "disabled"));
                            var j = ge("send_post");
                            j && (j.innerHTML = s.lang.profile_wall_postpone_btn)
                        }
                        var W = Math.round((new Date)
                            .getTime() / 1e3);
                        intval(s.date) < W && (s.date = W + 3600), hide(domByClass(_.menuNode, "_type_postpone")), N = C;
                        break;
                    case "mark_as_ads":
                        P = '<div class="medadd_h medadd_h_mark_as_ads inl_bl">' + s.lang.global_ads_wall_post_mark_as_ads_action + "</div>", hide(domByClass(_.menuNode,
                            "_type_mark_as_ads")), N = C
                }
                if (n) {
                    var O = t.chosenMedias,
                        V = O.length,
                        $ = c && 1 === L ? !1 : "photos_list" == a ? se('<div class="page_preview_' + a + "_wrap" + I + '" style="position: relative">' + P +
                            '<div class="page_photos_count">' + i.split(",")
                            .length + "</div></div>") : se('<div class="page_preview_' + a + "_wrap" + I + '"' + (o.nocl ? ' style="cursor: default"' : "") + A + ">" + P +
                            '<div nosorthandle="1" class="page_media_x_wrap inl_bl" data-title="' + getLang("dont_attach") +
                            '" onmouseover="showTitle(this)" onclick="cur.addMedia[' + t.lnkId + "].unchooseMedia(" + V +
                            '); return cancelEvent(event);"><div class="page_media_x" nosorthandle="1"></div></div>' + M + "</div>");
                    addClass($, L ? "fl_l" : "clear_fix"), void 0 !== s.upload_ind && re("upload" + s.upload_ind + "_progress_wrap"), o.toggleLnk && toggle(e, t.attachCount() +
                        1 < l), c && 1 === L ? (addClass(N, "editable_thumbs_wrap"), N = domLC(N) && hasClass(domLC(N), "editable_thumbs") ? domLC(N) : N.appendChild(
                        ce("div", {
                            id: "thumbs_edit" + m,
                            className: "editable_thumbs"
                        })), stManager.add(["thumbs_edit.css", "thumbs_edit.js"], function() {
                        o.toggleLnk && toggle(e, t.attachCount() + 1 < l), s.editable.remove = t.unchooseMedia.pbind(V), show(domPN(N));
                        var d = ThumbsEdit.convert(a, i, s.editable, s.peEditable);
                        domFC(N) ? ThumbsEdit.addMedia(N, d, s) : o.teWidth && o.teHeight ? ThumbsEdit.init(N, [d], {
                            width: o.teWidth,
                            height: o.teHeight,
                            force: !0,
                            onMove: o.onAddMediaChange,
                            onUpdate: o.onChangedSize
                        }) : ThumbsEdit.init(N, [d], {
                            onMove: o.onAddMediaChange,
                            force: !0,
                            onUpdate: o.onChangedSize
                        }), toggleClass(u, "media_preview_has_medias", t.hasVisibleRows()), o.onChangedSize && o.onChangedSize()
                    }, !0)) : (show(N), N.appendChild($), h && (N == w ? stManager.add(["sorter.js"], function() {
                        var e = getXY(w),
                            a = getSize(w),
                            i = function() {
                                w.sorter ? sorter.added(w) : N.childNodes.length > 1 && sorter.init(w, {
                                    onReorder: o.onAddMediaChange
                                })
                            };
                        e[0] || e[1] || a[0] || a[1] ? i() : cur.sorterClbk = i, o.onChangedSize && o.onChangedSize()
                    }, !0) : N == v && stManager.add(["qsorter.js"], function() {
                        v.qsorter ? qsorter.added(v) : N.childNodes.length > 1 && qsorter.init(v, t.qsorterOpts()), o.onChangedSize && o.onChangedSize()
                    }, !0)), o.onChangedSize && o.onChangedSize()), O.push([a, i, $, d])
                } else {
                    var V = 0;
                    "postpone" === a ? V = 1 : "mark_as_ads" === a && (V = 2);
                    var $ = se('<div class="' + (L === !1 ? "page_docs_preview" : "page_pics_preview") + (V ? "" : " post_thumbed_media") + '"><div class="page_preview_' +
                        a + '_wrap"' + (o.nocl ? ' style="cursor: default"' : "") + A + ">" + P + '<div nosorthandle="1" class="page_media_x_wrap inl_bl" data-title="' +
                        getLang("dont_attach") + '" onmouseover="showTitle(this)" onclick="cur.addMedia[' + t.lnkId + "].unchooseMedia(" + V +
                        '); return cancelEvent(event);"><div class="page_media_x" nosorthandle="1"></div></div>' + M + "</div></div>");
                    addClass($, L ? "fl_l" : "clear_fix"), void 0 !== s.upload_ind && re("upload" + s.upload_ind + "_progress_wrap"), "postpone" !== a && "mark_as_ads" !==
                        a && (t.chosenMedia = [a, i], t.chosenMediaData = s), t.singleAdded($, a)
                }
                "share" == a ? s.title && !d ? (cur.shareShowImg = 0, t.showPreview(!0), t.shareData.images = !1) : t.showExternalPreview() : "page" == a ? s.nopreview ||
                    (cur.shareShowImg = 0, t.shareData = extend(t.shareData || {}, s, {
                        images: !1
                    }), t.showPreview()) : "poll" == a ? t.createPoll(s) : "postpone" == a ? t.setupPostpone(s, z) : "mark_as_ads" == a && (t.markAsAds = 1), toggleClass(u,
                        "media_preview_has_medias", t.hasVisibleRows()), o.onChangedSize && o.onChangedSize();
                var K = window.event;
                return K && "click" == K.type && (K.ctrlKey || K.metaKey || K.shiftKey) && (r = !0), cur.fileApiUploadStarted && void 0 !== s.upload_ind || cur.preventBoxHide ||
                    r === !0 || inArray(a, ["poll", "share", "page", "postpone", "mark_as_ads"]) || boxQueue.hideLast(), cur.lastPostMsg = !1, o.onMediaAdd && o.onMediaAdd(),
                    cur.onMediaAdded && cur.onMediaAdded(), void 0 !== s.upload_ind && delete s.upload_ind, !1
            },
            unchooseMedia: function(a) {
                if (t.onChange && t.onChange(!1, a) === !1) return !1;
                if (n) {
                    if (void 0 === a) return window.ThumbsEdit && ThumbsEdit.removeAll("thumbs_edit" + m), each(t.chosenMedias, function(e, a) {
                        a && void 0 !== e && t.unchooseMedia(e)
                    }), void(t.urlsCancelled = []);
                    var i, s = t.chosenMedias;
                    if (s[a]) {
                        switch (s[a][2] ? ((i = geByClass1("page_media_x_wrap", s[a][2], "div")) && i.tt && i.tt.el && i.tt.destroy(), domPN(s[a][2]) == w && w.sorter ? (
                            each(w.sorter.elems, function() {
                                setStyle(this, {
                                    top: "auto",
                                    left: "auto",
                                    cursor: "auto"
                                })
                            }), w.sorter.destroy(), re(s[a][2]), w.childNodes.length > 1 && sorter.init(w, {
                                onReorder: o.onAddMediaChange
                            })) : domPN(s[a][2]) == v && v.qsorter ? (each(v.qsorter.elems, function() {
                            setStyle(domFC(this), {
                                top: "auto",
                                left: "auto"
                            }), setStyle(this, {
                                cursor: "auto"
                            })
                        }), v.qsorter.destroy(), re(s[a][2]), v.childNodes.length > 1 && qsorter.init(v, t.qsorterOpts())) : re(s[a][2])) : ("photo" == s[a][0] ||
                            "video" == s[a][0] || "album" == s[a][0]) && window.ThumbsEdit && ThumbsEdit.removeById("thumbs_edit" + m, s[a][0] + s[a][1]), s[a][0]) {
                            case "page":
                            case "share":
                                t.shareData = {}, re(t.sharePreview), hide("medadd_c_linkimg_loader"), clearTimeout(cur.showLoaderTimeout), clearInterval(cur.shareImgInterval),
                                    clearTimeout(cur.shareImgInterval2), clearTimeout(cur.imgLoadTimeout), delete t.sharePreview;
                                break;
                            case "poll":
                                re(t.pollPreview), t.pollPreview = !1, show(domByClass(_.menuNode, "_type_poll"));
                                break;
                            case "map":
                                show(domByClass(_.menuNode, "_type_map"));
                                break;
                            case "market":
                                show(e);
                                break;
                            case "postpone":
                                var d = geByClass1("medadd_c_timersett", t.postponePreview);
                                cur.editingPost && d ? re(domFC(t.postponePreview)) : re(t.postponePreview), t.postponePreview = !1, removeClass("official", "disabled"),
                                    cur.editingPost ? ge("wpe_save")
                                    .innerHTML = getLang("wall_publish_now") : ge("send_post")
                                    .innerHTML = getLang("wall_send"), show(domByClass(_.menuNode, "_type_postpone"));
                                break;
                            case "mark_as_ads":
                                show(domByClass(_.menuNode, "_type_mark_as_ads"))
                        }
                        s[a] = !1
                    }
                    o.toggleLnk && toggle(e, t.attachCount() < l), toggle(g, !!(c ? geByClass1("thumb_wrap", g) : domFC(g))), toggle(v, !!domFC(v)), toggle(w, !!domFC(w)),
                        toggle(f, !!domFC(f)), toggle(k, !!domFC(k)), toggle(b, !!domFC(b)), toggle(C, !!domFC(C)), toggle(p, !!domFC(p))
                } else {
                    var r, i;
                    if (void 0 == a && (a = 0), (i = geByClass("page_media_x_wrap", u, "div")[a]) && i.tt && i.tt.el && i.tt.destroy(), 1 == a && t.postponePreview) {
                        show(geByClass1("add_media_type_" + m + "_postpone", _.menuNode, "a"));
                        var h = domPN(t.postponePreview);
                        window.tooltips && tooltips.destroyAll(h), re(h), t.postponePreview = !1;
                        var y = _.lastTypes;
                        each(_.types, function(e, a) {
                            "postpone" === a[0] && y.push(a)
                        }), _.setItems(y)
                    } else if (2 == a && t.markAsAds) {
                        t.markAsAds = !1;
                        var x = geByClass1("page_preview_mark_as_ads_wrap", u);
                        window.tooltips && x && tooltips.destroyAll(x), re(x);
                        var y = _.lastTypes;
                        each(_.types, function(e, a) {
                            "mark_as_ads" === a[0] && y.push(a)
                        }), _.setItems(y)
                    } else {
                        if (t.postponePreview || t.markAsAds) {
                            for (var h = t.postponePreview && domPN(t.postponePreview), x = t.markAsAds && domPN(geByClass1("page_preview_mark_as_ads_wrap", u)), S = [], P =
                                    0; P < u.childNodes.length; P++) {
                                var M = u.childNodes[P];
                                "DIV" == M.nodeName && M != h && M != x && S.push(M)
                            }
                            each(S, function(e, a) {
                                re(a)
                            });
                            var y = [];
                            each(_.types, function(e, a) {
                                "postpone" === a[0] && t.postponePreview || "mark_as_ads" === a[0] && t.markAsAds || y.push(a)
                            }), _.setItems(y)
                        } else val(u, ""), addClass(u, "med_no_attach"), _.setItems(_.types);
                        t.chosenMedia && (t.chosenMedia = !1, t.chosenMediaData = !1), (r = t.shareData) && (r.url && t.urlsCancelled.push(r.url), r.initialPattern && t.urlsCancelled
                            .push(r.initialPattern), t.shareData = {}), each([t.sharePreview, t.pollPreview], function() {
                            re(this)
                        }), t.sharePreview = t.pollPreview = !1
                    }
                    o.toggleLnk && show(e)
                }
                toggleClass(u, "media_preview_has_medias", t.hasVisibleRows()), cur.onMediaAdded && cur.onMediaAdded(), cur.lastPostMsg = !1, t.onChange && t.onChange(!1)
            },
            singleAdded: function(a, i) {
                "postpone" === i ? u.appendChild(a) : "mark_as_ads" === i ? t.postponePreview ? u.insertBefore(a, domLC(u)) : u.appendChild(a) : domFC(u) ? u.insertBefore(
                    a, domFC(u)) : u.appendChild(a), removeClass(u, "med_no_attach");
                var s = [];
                each(_.lastTypes, function(e, a) {
                    ("postpone" !== a[0] || !t.postponePreview && "postpone" !== i) && ("mark_as_ads" !== a[0] || !t.markAsAds && "mark_as_ads" !== i) && (inArray(
                        i, ["postpone", "mark_as_ads"]) || inArray(a[0], ["postpone", "mark_as_ads"])) && s.push(a)
                }), _.setItems(s), o.toggleLnk && !s.length && hide(e)
            },
            getMedias: function() {
                if (n) {
                    var e = window.ThumbsEdit ? ThumbsEdit.getMedias("thumbs_edit" + m) : [],
                        a = {},
                        i = t.chosenMedias || [],
                        o = [],
                        s = function(e, i, s) {
                            return s[0] + s[1] == e ? (o.push(s), a[e] = !0, !1) : void 0
                        };
                    return each(e, function(e, a) {
                        each(i, s.pbind(a[0] + a[1]))
                    }), each(v.childNodes, function(e, a) {
                        var o = (a.id || "")
                            .match(/^pam\d+_([a-z]+)(-?\d+_\d+)/);
                        o && each(i, s.pbind(o[1] + o[2]))
                    }), each(w.childNodes, function(e, a) {
                        var o = (a.id || "")
                            .match(/^pam\d+_([a-z]+)(-?\d+_\d+)/);
                        o && each(i, s.pbind(o[1] + o[2]))
                    }), each(i, function(e, i) {
                        i && isArray(i) && i.length && !a[i[0] + i[1]] && o.push(i)
                    }), o
                }
                var i = t.chosenMedia;
                return i ? [i[0] + i[1]] : []
            },
            showPhoto: function(e, a, i, o) {
                !cur.pvData || cur.pvShown && cur.pvListId == a || delete cur.pvData[a];
                for (var s in ajaxCache) s.toString()
                    .match(/^\/al_photos\.php\#act=show&draft_photos/) && delete ajaxCache[s];
                var d = t.getMedias(),
                    r = [];
                return each(d, function(e, a) {
                    a && "photo" == a[0] && r.push(a[1] + "/" + (t.phLists[a[1]] || ""))
                }), i.additional = {
                    draft_photos: r.join(";")
                }, showPhoto(e, a, extend(i, {
                    queue: 1
                }), o)
            },
            showMediaProgress: function(a, i, s) {
                if (t.onProgress && t.onProgress(a, i, s) === !1) return !1;
                var d = s.loaded / s.total,
                    r = intval(100 * d),
                    c = (s.fileName || s.name || "")
                    .replace(/[&<>"']/g, ""),
                    h = c ? i + "_" + c : i,
                    _ = c ? c.length > 33 ? c.substr(0, 30) + "..." : c : "",
                    u = ge("upload" + h + "_progress");
                if (u) {
                    show(u);
                    var g = geByClass1("ui_progress_bar", u);
                    setStyle(g, {
                        width: r + "%"
                    })
                } else {
                    cur.attachMediaIndexes || (cur.attachMediaIndexes = {}), cur.attachMediaIndexes[h] = m;
                    var v = _ ? '<div class="attach_label fl_l">' + _ + "</div>" : "",
                        w =
                        '          <div class="fl_l">             <div class="page_attach_progress_wrap" style="margin-top: 3px; margin-bottom: 4px;">               <div id="upload' +
                        h +
                        '_progress" class="page_attach_progress ui_progress">                 <div class="ui_progress_back"></div>                 <div class="ui_progress_bar"></div>               </div>             </div>           </div>' +
                        v + '<div class="progress_x fl_l" onmouseover="animate(this, {opacity: 1}, 200); showTooltip(this, {text: \'' + getLang("dont_attach") +
                        '\', shift: [6, 3, 3]})" onmouseout="animate(this, {opacity: 0.6}, 200);" onclick="Upload.terminateUpload(' + i + ", '" + (c || i) +
                        "', this);\"></div>";
                    if (n) p.appendChild(ce("div", {
                        id: "upload" + h + "_progress_wrap",
                        innerHTML: w,
                        className: "clear_fix upload_" + i + "_progress"
                    }, {
                        marginTop: "6px"
                    })), show(p), o.toggleLnk && toggle(e, t.attachCount() < l);
                    else {
                        var f = ce("div", {
                            id: "upload" + h + "_progress_wrap",
                            innerHTML: w,
                            className: "clear_fix upload_" + i + "_progress"
                        });
                        t.chosenMedia = "progress", t.singleAdded(f, "progress")
                    }
                    o.onChangedSize && o.onChangedSize(), u = ge("upload" + h + "_progress");
                    var g = geByClass1("ui_progress_bar", u);
                    r ? setStyle(g, {
                        width: r + "%"
                    }) : (setStyle(g, {
                        width: "1px"
                    }), hide(u))
                }
            },
            hasVisibleRows: function() {
                var e = !1;
                return each(geByClass("media_preview", u), function() {
                    return isVisible(this) ? (e = !0, !1) : void 0
                }), e
            },
            attachCount: function() {
                if (t.attachedCount) return t.attachedCount();
                if (!u) return 0;
                if (!n) return u.childNodes.length - (t.postponePreview ? 1 : 0) - (t.markAsAds ? 1 : 0);
                var e = (c && window.ThumbsEdit ? (ThumbsEdit.cache()["thumbs_edit" + m] || {})
                        .previews || [] : g.childNodes)
                    .length + v.childNodes.length + b.childNodes.length + w.childNodes.length / (w.sorter ? 2 : 1) + p.childNodes.length;
                return t.sharePreview && ++e, t.pollPreview && ++e, e
            },
            createPoll: function(e) {
                var a, i = e.question ? "" : "1px",
                    o = [];
                e[22] ? "disabled" : "", e[8] ? "" : "disabled";
                t.pollPreview = f.appendChild(ce("div", {
                        className: "medadd_c medadd_c_poll",
                        innerHTML: '<input onkeydown="cur.addMedia[' + m + '].keyPoll(this, event)" class="text dark medadd_c_pollq" id="create_poll_question' + m +
                            '" value="' + (e.question || "") + '" /><div class="medadd_c_pollh">' + e.lang.a +
                            '</div><div class="medadd_c_pollans" id="create_poll_answers' + m + '"></div><div class="medadd_c_polladd_wr" id="create_poll_add' + m +
                            '">  <div class="medadd_c_polladd fakeinput dark" onclick="cur.addMedia[' + m + '].incPoll()">' + e.lang.i + "</div></div>" + (e.edit ?
                                "" : '<div class="checkbox medadd_c_pollcb' + (e.anon ? " on" : "") + '" id="create_poll_anonymous' + m +
                                '" onclick="checkbox(this);cur.addMedia[' + m + '].changedPoll();">' + e.lang.c + "</div>") + (e.pollSettings || "")
                    })), e.answers || (e.answers = [
                        [0, ""],
                        [0, ""]
                    ]), cur.pollAnswerTemplate =
                    '<input onkeydown="cur.addMedia[%lnkid%].keyPoll(this, event)" class="text dark medadd_c_polla" %attrs%/><div class="page_media_x_wrap medadd_c_pollrem" data-title="' +
                    e.lang.d + '" onmouseover="showTitle(this)" onclick="cur.addMedia[%lnkid%].decPoll(this)"><div class="page_media_x"></div></div>';
                for (var s = 0, d = e.answers.length; d > s; ++s) a = e.answers[s], o.push('<div class="medadd_c_polla_wr">' + rs(cur.pollAnswerTemplate, {
                    attrs: (a[0] ? 'id="create_poll_ans' + a[0] + '" ' : "") + (a[1] ? '" value="' + a[1] + '" ' : ""),
                    lnkid: m
                }) + "</div>"), 9 == s && hide("create_poll_add" + m);
                return val("create_poll_answers" + m, o.join("")), e.question ? void elfocus("create_poll_question" + m) : (t.pollPreview.style.height = i, void animate(t.pollPreview, {
                    height: 166
                }, 200, function() {
                    t.pollPreview.style.height = "auto", elfocus("create_poll_question" + m)
                }))
            },
            incPoll: function() {
                var e = ge("create_poll_answers" + m),
                    a = e.childNodes.length,
                    i = o.pollLimit || 10;
                i > a && elfocus(geByTag1("input", e.appendChild(ce("div", {
                    className: "medadd_c_polla_wr",
                    innerHTML: rs(cur.pollAnswerTemplate, {
                        attrs: "",
                        lnkid: m
                    })
                })))), toggle("create_poll_add" + m, i - 1 > a)
            },
            decPoll: function(e) {
                e.tt && e.tt.el && e.tt.destroy(), re(domPN(e)), show("create_poll_add" + m)
            },
            keyPoll: function(e, a) {
                if (a = a || window.event, a && (10 == a.keyCode || 13 == a.keyCode || 9 == a.keyCode)) {
                    var i = hasClass(e, "medadd_c_pollq"),
                        o = a.shiftKey;
                    if (o && i) return;
                    var s = i ? domFC(domNS(domNS(e))) : (o ? domPS : domNS)(domPN(e));
                    return s ? elfocus(geByTag1("input", s)) : o ? elfocus(geByClass1("medadd_c_pollq", domPN(domPN(domPN(e))))) : this.incPoll(), cancelEvent(a)
                }
                t.changedPoll()
            },
            changedPoll: function() {
                o.onMediaChange && o.onMediaChange()
            },
            pollData: function(e) {
                for (var a, i = ge("create_poll_answers" + m), o = trim(val("create_poll_question" + m)), s = {
                        media: o,
                        anonymous: isChecked("create_poll_anonymous" + m)
                    }, t = 0, d = !1, r = domFC(i); r; r = domNS(r))
                    if (a = trim(val(domFC(r)))) {
                        var l = -intval((domFC(r)
                            .id.match(/^create_poll_ans(\d+)$/) || [0, -t++])[1]);
                        s["answers[" + l + "]"] = a, d = !0
                    }
                return o ? d ? s : (domFC(i) || cur.addMedia[m].incPoll(), e !== !0 && notaBene(domFC(domFC(i))), !1) : (e !== !0 && notaBene("create_poll_question" + m), !
                    1)
            },
            urlsCancelled: [],
            shareData: {},
            checkMessageURLs: function(e, a, i) {
                if (!(cur.noCheckMessageURLs || t.chosenMedia || t.urlAttachmentLoading && t.urlAttachmentLoading[0] > vkNow() - 1e4 || t.attachCount() >= l)) {
                    if (cur.reply_to && cur.reply_to[0]) {
                        var o = Wall.getReplyName(cur.reply_to[0]);
                        if (o && isArray(o) && o[1] && (o = o[1]), o) {
                            var s = extractUrls(o, a);
                            for (var d in s) {
                                var r = s[d].url;
                                r.match(/^https?:\/\//) || (r = "http://" + r), inArray(r, t.urlsCancelled) || t.urlsCancelled.push(r)
                            }
                        }
                    }
                    var n = extractUrls(e, a);
                    for (var d in n) {
                        var c = n[d],
                            r = c.url,
                            h = c.query,
                            _ = c.domain,
                            p = r;
                        if (r.match(/^https?:\/\//) || (r = "http://" + r), !inArray(r, t.urlsCancelled) && !inArray(p, t.urlsCancelled)) {
                            var m = !0;
                            if (_.match(/(^|\.|\/\/)(vkontakte\.ru|vk\.com)/) && (m = h.match(
                                    /(#photo|^\/(photo|video|album|page|audio|doc)|z=(album|photo|video)|w=(page|product))(-?\d+_)?\d+|\.(jpg|png|gif)$|market-?\d+\?section=album_\d+|^\/stickers\/.+$|^\/blog\/.+$|^http:\/\/instagram\.com\/p\/.+/
                                ) ? !0 : !1), m) return void t.checkURL(p, i)
                        }
                    }
                }
            },
            clearCheckURL: function() {
                clearTimeout(cur.checkURLTO), re(t.urlAttachmentLoading[2]), n ? toggle(p, p.childNodes > 0) : toggleClass(u, "med_no_attach", !u.childNodes), t.urlAttachmentLoading = !
                    1, setStyle(bodyNode, {
                        cursor: "default"
                    })
            },
            onCheckURLDone: function(e, a) {
                var i = "";
                t.urlAttachmentLoading && (i = t.urlAttachmentLoading[1], t.clearCheckURL()), e ? t.chooseMedia(a[0], a[1], a[2], i, !0) : o.onCheckURLDone && o.onCheckURLDone(
                    e, a)
            },
            checkURL: function(e, a) {
                if (e) {
                    t.urlsCancelled.push(e), t.urlAttachmentLoading = [vkNow(), e], re(t.checkURLForm), t.checkURLForm = ce("div", {
                        innerHTML: '<iframe name="share_parse_iframe' + m + '"></iframe>'
                    }), utilsNode.appendChild(t.checkURLForm);
                    var i = t.checkURLForm.appendChild(ce("form", {
                        action: "share.php?act=url_attachment",
                        method: "post",
                        target: "share_parse_iframe" + m
                    }));
                    each({
                        hash: cur.share_timehash || cur.options.share.timehash || "",
                        index: m,
                        url: e,
                        to_mail: o.mail ? 1 : ""
                    }, function(e, a) {
                        i.appendChild(ce("input", {
                            type: "hidden",
                            name: e,
                            value: a
                        }))
                    }), setStyle(bodyNode, {
                        cursor: "wait"
                    }), window.onUploadDone = t.onCheckURLDone.pbind(!0), window.onUploadFail = t.onCheckURLDone.pbind(!1), a && (cur.checkURLTO = setTimeout(function() {
                        t.urlAttachmentLoading.length > 0 && t.clearCheckURL()
                    }, a)), i.submit()
                }
            },
            addPreview: function(e) {
                return t.sharePreview = k.appendChild(ce("div", {
                    className: "medadd_c medadd_c_link",
                    innerHTML: '<div class="medadd_c_linkcon"><div></div>' + (e ? '<div class="progress medadd_c_linkprg"></div>' : "") + "</div>"
                }))
            },
            shareImgUrl: function(e) {
                var a = t.shareData;
                if (a.images_proxy && a.images_proxy[e]) return a.images_proxy_url + a.images_proxy[e];
                if (a.images) {
                    var i = a.images[e];
                    return isArray(i) && (i = i[0] ? i[0] : ""), i
                }
                return ""
            },
            showPreview: function(e) {
                var i, s, d = t.shareData,
                    r = t.sharePreview || t.addPreview();
                if (d.images && (i = d.images[cur.shareShowImg], s = t.bigLink || d.big_link || i && isArray(i) && i[0] ? "medadd_c_linkimg_big" : ""), d.failed) var l =
                    getLang("page_not_loaded");
                else {
                    var n = e ? "" : 'onload="if (this.width < 130 && !cur.onLoadSwitched) {cur.onLoadSwitched=1;setTimeout(cur.shareShowNext, 0);}"',
                        c = "",
                        h = clean(t.shareImgUrl(cur.shareShowImg));
                    if (d.images && d.images[cur.shareShowImg] && h) {
                        var _ = d.images[cur.shareShowImg],
                            p = s ? 'style="width: 100%"' : d.imagesStyles && d.imagesStyles[cur.shareShowImg] || "";
                        if (c = '<img class="medadd_c_linkimg" src="' + h + '" ' + n + " " + p + " />", c += s ? Page.buildMediaLinkEl(d.domain) : "", d.images.length > 0) {
                            var m = (d.images.length > 1 ? '<div class="medadd_c_linkimg_scroll_wrap medadd_c_linkimg_scroll_wrap_left ' + (0 == cur.shareShowImg ?
                                    "medadd_c_linkimg_scroll_wrap_left_first" : "") + '" onclick="' + (0 == cur.shareShowImg ? "Page.ownerPhoto('" + d.media + "');" :
                                    "cur.shareShowNext(true);") + '"><div class="medadd_c_linkimg_scroll"></div></div>' : "", ""),
                                u = "";
                            cur.shareShowImg < d.images.length - 1 ? m =
                                '<div class="medadd_c_linkimg_scroll_wrap medadd_c_linkimg_scroll_wrap_right" onclick="cur.shareShowNext();"><div class="medadd_c_linkimg_scroll"></div></div>' :
                                cur.shareShowImg == d.images.length - 1 && isArray(_) && _[0] && (m = "");
                            var g = isArray(d.images[d.images.length - 1]) && !!d.images[d.images.length - 1][0],
                                v = d.uniqueImagesCount + intval(g),
                                w = "onmouseover=\"showTooltip(this, {text: '" + getLang("global_link_choose_own_photo") +
                                "', black: 1, shift: [7, 11, 8], appendParentCls: 'post'})\"",
                                f = "onmouseover=\"showTooltip(this, {text: '" + getLang("global_link_remove_photo") +
                                "', black: 1, shift: [7, 11, 8], appendParentCls: 'post'})\"",
                                b = d.media && "_" != d.media ? '<div class="medadd_c_linkimg_controls">  <div class="medadd_c_linkimg_controls_btn_group clear_fix fl_l">' +
                                (v > 1 ?
                                    '    <div class="medadd_c_linkimg_controls_btn_arrows_group">      <div class="medadd_c_linkimg_controls_btn" id="medadd_ctrl_left" onclick="cur.shareShowNext(true);"></div>      <div class="medadd_c_linkimg_controls_btn" id="medadd_ctrl_right" onclick="cur.shareShowNext();"></div>    </div>' :
                                    "") + '    <div class="medadd_c_linkimg_controls_btn ' + (v > 1 ? "medadd_c_btn_side_padd" : "") + '" id="medadd_ctrl_upload" ' + w +
                                " onclick=\"Page.ownerPhoto('" + d.media +
                                '\');"></div>  </div>  <div class="medadd_c_linkimg_controls_btn_group clear_fix fl_r">    <div class="medadd_c_linkimg_controls_btn" id="medadd_ctrl_remove" ' +
                                f + ' onclick="tooltips.hide(this);cur.removeLinkImage(this)"></div>  </div></div>' : "",
                                C = i ? "" : "display: none";
                            c = '<div class="medadd_c_linkimg_container fl_l" style="' + C + '">' + c + b + u +
                                '<div id="medadd_c_linkimg_loader" class="medadd_c_linkimg_loader"></div></div>'
                        }
                    }
                    var y = "";
                    d.microdata && d.microdata_preview_html && (y = d.microdata_preview_html);
                    var x = d.description_short || d.description,
                        l = c + (d.title ? '<h4 class="medadd_c_linkhead">' + d.title + "</h4>" : "") + (!s && d.domain ? '<div class="page_media_link_addr">' + d.domain +
                            "</div>" : "") + (y ? '<div class="medadd_c_linkmicrodata">' + y + "</div>" : "") + (x ? '<div class="medadd_c_linkdsc">' + x + "</div>" : "") +
                        '<div class="clear"></div>'
                }
                if (e) cur.preventShareAnim && (cur.preventShareAnim.stop(), clearInterval(cur.animateUpdateInterval)), val(domFC(r), l), domFC(r)
                    .style.height = "auto", shortCurrency();
                else {
                    !isVisible(k);
                    show(k);
                    var S = ge(a)
                        .appendChild(ce("div", {
                            innerHTML: '<div class="medadd_c_linkcon ' + s + '">' + l + "</div>"
                        }, {
                            position: "absolute",
                            width: getSize(r)[0] - 10,
                            visibility: "hidden"
                        })),
                        P = getSize(S)[1];
                    re(S), val(domFC(r), l), shortCurrency(), cur.animateUpdateInterval = setInterval(function() {
                        o.onChangedSize && o.onChangedSize()
                    }, 100), cur.preventShareAnim = animate(domFC(r), {
                        height: P
                    }, 200, function() {
                        clearInterval(cur.animateUpdateInterval)
                    }), re(geByClass1("medadd_c_linkprg", k))
                }
                s && addClass(geByClass1("medadd_c_linkcon", k), s)
            },
            showExternalPreview: function() {
                var e = t.shareData;
                e.images || (e.images = []);
                var a = [],
                    i = [],
                    s = {};
                if (each(e.images, function(o, t) {
                        s[t] || (s[t] = !0, a.push(t), e.images_proxy && i.push(e.images_proxy[o]))
                    }), e.uniqueImagesCount = a.length, e.images = a, e.images_proxy = i, e.images.push([]), !e.images || !e.images.length) return cur.shareShowImg = 0,
                    void t.showPreview();
                cur.shareShowImg = -1, t.addPreview(!0), e.imagesStyles = {};
                var d = !1;
                cur.shareSetOwnPhoto = function(a) {
                    curBox() && curBox()
                        .hide(), t.bigLink = !0, e.images[e.images.length - 1] = [a.photo_url, a.user_id, a.photo_id], cur.shareShowNext(0, 1)
                }, cur.shareClearOwnPhoto = function() {
                    e.images[e.images.length - 1] = [], cur.shareShowNext(0, 0, 1)
                }, cur.removeLinkImage = function(e) {
                    var a = gpeByClass("medadd_c_linkcon", e);
                    re(gpeByClass("medadd_c_linkimg_container", e)), setStyle(a, "height", ""), t.shareData.noPhoto = !0
                }, cur.shareShowNext = function(a, i, s) {
                    var r = vkImage();
                    cur.prevShareShowDir = a, s || (i ? cur.shareShowImg = e.images.length - 1 : a ? cur.shareShowImg -= 1 : cur.shareShowImg += 1);
                    var l = isArray(e.images[e.images.length - 1]) && !!e.images[e.images.length - 1][0];
                    if (!l && cur.shareShowImg > e.images.length - 2) cur.shareShowImg = 0;
                    else if (cur.shareShowImg > e.images.length - 1) cur.shareShowImg = 0;
                    else if (!l && cur.shareShowImg < 0) cur.shareShowImg = e.images.length - 2;
                    else if (cur.shareShowImg < 0) cur.shareShowImg = e.images.length - 1;
                    else if (0 == cur.shareShowImg)
                        for (var n = 1; n < e.images.length - 1; n++) {
                            var c = vkImage();
                            c.src = t.shareImgUrl(n)
                        }
                    if (!e.images.length || isEmpty(e.images) || void 0 === e.images[cur.shareShowImg]) return t.showPreview(d), void(d = !0);
                    var h = t.shareImgUrl(cur.shareShowImg);
                    h && (r.src = h), isArray(e.images[cur.shareShowImg]) && e.images[cur.shareShowImg][1] && e.images[cur.shareShowImg][2] ? (e.user_id = e.images[cur
                        .shareShowImg][1], e.photo_id = e.images[cur.shareShowImg][2], e.share_own_image = !0) : (e.user_id = void 0, e.photo_id = void 0, e.share_own_image = !
                        1);
                    var _ = null;
                    h && (cur.imgLoadTimeout = _ = setTimeout(function() {
                        cur.shareImgInterval !== !0 && (isArray(e.images[cur.shareShowImg]) || (e.images.splice(cur.shareShowImg, 1), e.images_proxy && e.images_proxy
                            .length > cur.shareShowImg && e.images_proxy.splice(cur.shareShowImg, 1), cur.shareShowNext()))
                    }, 5e3));
                    var p = setTimeout(function() {
                        show("medadd_c_linkimg_loader"), p = null, o.onChangedSize && o.onChangedSize()
                    }, 100);
                    cur.showLoaderTimeout = p;
                    var m = function() {
                        if (r.width || r.height || !h) {
                            var a = r.width,
                                i = r.height,
                                o = "",
                                s = "";
                            if (_ && (clearTimeout(_), _ = null), p && (clearTimeout(p), p = null), hide("medadd_c_linkimg_loader"), clearInterval(cur.shareImgInterval), !
                                isArray(e.images[cur.shareShowImg]) && (20 > a || 20 > i)) {
                                if (e.images.splice(cur.shareShowImg, 1), e.images_proxy && e.images_proxy.length > cur.shareShowImg && e.images_proxy.splice(cur.shareShowImg,
                                        1), e.images.length) return setTimeout(cur.shareShowNext.pbind(0, 0, 1), 0)
                            } else {
                                var l = a >= 537 && i >= 240 && void 0 === e.big_link;
                                if (!l && t.bigLink && cur.shareShowImg != e.images.length - 1) return e.images.splice(cur.shareShowImg, 1), e.images_proxy.splice(
                                    cur.shareShowImg, 1), cur.prevShareShowDir || cur.shareShowImg--, void cur.shareShowNext(cur.prevShareShowDir);
                                t.bigLink = t.bigLink || l, a > 150 && (i = 150 * i / a, a = 150);
                                var n = Math.round(i / 2),
                                    c = Math.round(a / 2);
                                l && i > 150 ? -Math.round(33.5) : -n, a > 150 ? -Math.round(75) : -c;
                                o = "width: " + a + "px; height: " + i + "px;", l && (o = "width: 100%;")
                            }
                            e.images.length > 1 && (s = ""), e.imagesStyles[cur.shareShowImg] = 'style="' + o + '"' + s, t.showPreview(d), d = !0
                        }
                    };
                    clearInterval(cur.shareImgInterval), cur.shareImgInterval = setInterval(m, 300), cur.shareImgInterval2 = setTimeout(m, 0)
                }, cur.shareShowNext()
            },
            uploadShare: function(e) {
                var a = t.shareData,
                    i = t.sharePreview,
                    o = i.appendChild(ce("div", {
                        innerHTML: '<iframe class="upload_frame" name="share_upload_iframe' + m + '"></iframe>'
                    })),
                    s = o.appendChild(ce("form", {
                        action: "/share.php",
                        method: "post",
                        target: "share_upload_iframe" + m
                    })),
                    d = a.images[cur.shareShowImg];
                each({
                    act: "a_photo",
                    url: a.url,
                    index: m,
                    image: d,
                    extra: a.extra || 0,
                    hash: vk.ip_h
                }, function(e, a) {
                    s.appendChild(ce("input", {
                        type: "hidden",
                        name: e,
                        value: a
                    }))
                }), window.onUploadDone = function(a, s) {
                    window.onUploadFail = window.onUploadDone = function() {}, i.removeChild(o), t.shareData = extend(t.shareData, {
                        user_id: s.user_id,
                        photo_id: s.photo_id,
                        photo_url: d,
                        images: []
                    }), setTimeout(e, 0)
                }, window.onUploadFail = function(a, s) {
                    window.onUploadFail = window.onUploadDone = function() {}, i.removeChild(o), t.shareData.images = [], setTimeout(e, 0)
                }, cur.shareLastParseSubmitted = vkNow(), s.submit()
            },
            setupPostpone: function(e, a) {
                var i;
                i = n || C ? C : domPN(geByClass1("page_preview_postpone_wrap", u));
                var s = cur.editingPost && "wpe_media_preview" == domPN(i)
                    .id,
                    d = s || !n ? "" : "1px",
                    r = !1,
                    l = '<div class="clear_fix"><div class="fl_l"><input type="hidden" id="postpone_date' + m + '" value="' + (e.date || "") +
                    '" /></div><div class="fl_l medadd_c_timerat">' + e.lang.profile_wall_postpone_at + '</div><div class="fl_l"><input type="hidden" id="postpone_time' +
                    m + '"/></div></div>';
                cur.editingPost && void 0 != e.friends_only ? (l += '<div class="medadd_c_timersett">', void 0 != e.status_export && (l +=
                            '<div class="checkbox_status_export' + (e.status_export ? " on" : "") + ' fl_l" id="status_export' + m +
                            '" onclick="checkbox(this)" onmouseover="showTooltip(this, {text: \'' + e.lang.export_to_twitter + "', black: 1, shift: [12,4,0]});\"></div>"),
                        void 0 != e.facebook_export && (l += '<div class="checkbox_facebook_export' + (e.facebook_export ? " on" : "") + ' fl_l" id="facebook_export' + m +
                            '" onclick="checkbox(this)" onmouseover="showTooltip(this, {text: \'' + e.lang.export_to_facebook + "', black: 1, shift: [12,4,0]});\"></div>"),
                        l += '<div class="checkbox' + (e.friends_only ? " on" : "") + ' fl_l" id="friends_only' + m + '" onclick="checkbox(this);checkbox(\'status_export' +
                        m + "',!isChecked(this));checkbox('facebook_export" + m + "',!isChecked(this));\">" + e.lang.friends_only + "</div></div>", r = !0) : cur.editingPost &&
                    a && (l += a, r = !0), t.postponePreview = i.appendChild(ce("div", {
                        className: "medadd_c medadd_c_timer clear_fix" + (r ? " medadd_c_nofixed" : ""),
                        innerHTML: l
                    })), t.postponePreview.style.height = d, stManager.add(["ui_controls.css", "ui_controls.js", "datepicker.css", "datepicker.js"], function() {
                        new Datepicker("postpone_date" + m, {
                            time: "postpone_time" + m,
                            width: 155,
                            noPast: !0,
                            minStep: 1,
                            onUpdate: o.onMediaChange
                        }), !s && n && animate(t.postponePreview, {
                            height: 33
                        }, 200, function() {
                            t.postponePreview.style.height = ""
                        })
                    })
            },
            destroy: function() {
                (w || {})
                .sorter && w.sorter.destroy(), (v || {})
                    .qsorter && v.qsorter.destroy()
            },
            qsorterOpts: function() {
                return {
                    xsize: Math.floor(v.offsetWidth / 135),
                    width: 135,
                    height: 102,
                    onReorder: o.onAddMediaChange,
                    clsUp: "pam_dpic_up"
                }
            },
            resized: function() {
                window.ThumbsEdit && ThumbsEdit.setWide("thumbs_edit" + cur.wallEditComposer.addMedia.lnkId), v.qsorter && (v.qsorter.destroy(), qsorter.init(v, t.qsorterOpts()))
            }
        }, cur.addMedia || (cur.addMedia = {}), cur.addMedia[m] = t, o.onAddMediaChange && (t.onChange = o.onAddMediaChange), t
    }
}
try {
    stManager.done("ui_media_selector.js")
} catch (e) {}
