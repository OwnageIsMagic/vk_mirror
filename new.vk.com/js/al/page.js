function initCustomMedia(e, a, t) {
    if (e = ge(e), !e) return !1;
    t = t || {}, window.__addMediaIndex || (__addMediaIndex = 0);
    var o = ++__addMediaIndex;
    if (t.bgsprite) var i = t.bgsprite;
    else if (window.devicePixelRatio >= 2) {
        var i = "/images/icons/attach_icons_2x.png?6";
        t.bgSize = "20px 220px"
    } else var i = "/images/icons/attach_icons.png?6";
    if (vkImage()
        .src = i, t.tooltip) var l =
        '<div class="rows"><div class="add_media_items"></div><div class="add_media_pointer"><div class="chats_sp add_media_pointer_icon"></div></div></div>';
    else var l = '<div class="rows"><div class="add_media_items"><div class="add_media_head noselect"><nobr>' + e.innerHTML + "</nobr></div></div></div>";
    window.customMenuNode || (window.customMenuNode = domFC(domFC(pageNode.appendChild(ce("div", {
        id: "",
        innerHTML: '<div class="scroll_fix" id="custom_menu_wrap" style="width:' + (lastInnerWidth - 1) + 'px"><div id="custom_menu_cont"></div></div>'
    })))));
    var s = ce("div", {
            id: "add_media_menu_" + o,
            className: "add_media_menu " + (t.menuNodeClass || ""),
            innerHTML: '<div class="add_media_rows">' + l + "</div>"
        }, {
            position: "absolute"
        }),
        r = geByClass1("add_media_items", s, "div");
    customMenuNode.appendChild(s);
    var n, d = t.reverseMargin || 25,
        c = {
            id: o,
            fixed: -1,
            menuNode: s,
            updateFixed: function(a) {
                if (!(-1 != c.fixed && -1 != a && void 0 !== a && c.fixed == a || -1 != c.fixed && void 0 === a)) {
                    if (void 0 === a || -1 == a) {
                        var t = e;
                        for (c.fixed = !1; t;) {
                            if ("fixed" == getStyle(t, "position")) {
                                c.fixed = !0;
                                break
                            }
                            t = t.offsetParent
                        }
                    } else c.fixed = a;
                    c.fixed ? (setStyle(customMenuNode, {
                        position: ""
                    }), addClass(customMenuNode, "fixed")) : (setStyle(customMenuNode, {
                        position: "absolute"
                    }), removeClass(customMenuNode, "fixed")), isVisible(s) && c._updatePosition(!0)
                }
            },
            show: function(a, o) {
                if (clearTimeout(n), s && !isVisible(s)) {
                    e.blur(), c.updateFixed(-1);
                    var i = c._updatePosition(),
                        l = s.firstChild;
                    browser.msie && browser.version < 9 || browser.mobile ? show(s) : (setStyle(l, {
                        height: 26,
                        overflow: "hidden"
                    }), fadeIn(s, 200), c.reverse && (setStyle(l, {
                        position: "absolute",
                        bottom: -d,
                        width: getSize(l.firstChild)[0]
                    }), setStyle(l.firstChild, {
                        position: "absolute",
                        bottom: "0px"
                    })), animate(l, {
                        height: i - 2
                    }, 200, function() {
                        setStyle(l.firstChild, {
                            position: "relative",
                            bottom: ""
                        }), setStyle(l, {
                            height: "",
                            overflow: "",
                            position: "static"
                        })
                    })), t.onShow && t.onShow()
                }
                return a === !0 ? (c.touched = !0, clearTimeout(c.toucht), removeEvent(bodyNode, "MSPointerDown", c.iecheckhide), c.toucht = setTimeout(addEvent.pbind(bodyNode,
                    "MSPointerDown", c.iecheckhide), 500), cancelEvent(o)) : void 0
            },
            iecheckhide: function() {
                c.touched && setTimeout(c.hide.pbind(!0), 500), clearTimeout(c.toucht), removeEvent(bodyNode, "MSPointerDown", c.iecheckhide)
            },
            _updatePosition: function(a) {
                var o = getXY(e, c.fixed),
                    i = 0,
                    l = t.leftOffset || 0,
                    n = t.topOffset || 0,
                    p = o[1] + n - 4 + (browser.msie && browser.version < 8 ? 1 : 0),
                    u = s.firstChild,
                    _ = geByClass1("add_media_more", s);
                if (vk.rtl) {
                    var h = lastInnerWidth - 4 - o[0] - 3 * getSize(e)[0] / 2 + l;
                    0 > h && (i = -h, h = 0), setStyle(s, {
                        right: h,
                        top: p
                    })
                } else {
                    var g = o[0] + l - getSize(s)[0] / 2 + getSize(e)[0] / 2;
                    0 > g && (i = g, g = 0), setStyle(s, {
                        left: g,
                        top: p
                    })
                }
                setStyle(u.firstChild, {
                    width: "100%"
                }), setStyle(geByClass1("add_media_pointer", s), {
                    position: "relative",
                    left: i + "px"
                }), a || (setStyle(s, {
                    visibility: "hidden",
                    display: "block"
                }), _ && (hide(_), show(_.nextSibling)));
                var m = getSize(u),
                    w = c.fixed ? 0 : scrollGetY(),
                    f = m;
                a || (_ && (show(_), hide(_.nextSibling), f = getSize(u)), setStyle(s, {
                    visibility: "",
                    display: "none"
                }));
                var v = !1;
                if (m[1] - d < p - w && lastWindowHeight + w < p + m[1] || t.forceUp ? (setStyle(u, "marginTop", -f[1] + d), c.reverse || (v = !0)) : (setStyle(u, "marginTop", -
                        4), c.reverse && (v = !0)), v) {
                    for (var b = r.childNodes, y = b.length, k = (c.moreWrap || {})
                            .lastChild || {}; y--;) r.appendChild(b[y]);
                    for (b = k.childNodes, y = (b || [])
                        .length; y--;) k.appendChild(b[y]);
                    c.reverse = !c.reverse, (c.reverse ? addClass : removeClass)(s, "add_media_rev")
                }
                return f[1]
            },
            hide: function(e) {
                clearTimeout(n);
                var a = browser.msie && browser.version < 9 || browser.mobile ? hide.pbind(s) : fadeOut.pbind(s, 100);
                if (e === !0) c.touched = !1, a();
                else {
                    if (c.touched) return;
                    n = setTimeout(a, 300)
                }
                t.onHide && t.onHide()
            },
            setOptions: function(e) {
                each(e, function(e, a) {
                    switch (e) {
                        case "bgsprite":
                            vkImage()
                                .src = i = a
                    }
                }), extend(t, e)
            },
            setItems: function(e) {
                for (var a = r.firstChild, l = r.lastChild; a != l; a = r.firstChild, l = r.lastChild) r.removeChild(hasClass(a, "add_media_head") ? l : a);
                var n = /mac/.test(_ua) && browser.mozilla ? {
                        height: 19
                    } : {},
                    p = !1,
                    u = t.hideItem,
                    _ = (u || e.length > 6) && !browser.mobile,
                    h = u && t.hideLabel || getLang("global_add_media_more");
                if (c.moreWrap = !1, each(e, function(e, a) {
                        var l, g = {
                                innerHTML: "<nobr>" + a[1].replace(/\s/g, "&nbsp;") + "</nobr>",
                                className: "add_media_type_" + o + "_" + a[0] + " add_media_item"
                            },
                            m = a[6] || {
                                backgroundImage: "url(" + (a[5] || i) + ")",
                                backgroundPosition: a[2] || "0 0"
                            };
                        if (!a[6] && t.bgSize && (m.backgroundSize = t.bgSize), _ && (u ? a[0] == u : 3 == e)) {
                            var w = s.firstChild,
                                f = r.appendChild(ce("div", {
                                    className: "add_media_more_wrap"
                                }));
                            addEvent(f, "mouseover click", function(e) {
                                if (("mouseover" != e.type || !c.touched) && (clearTimeout(c.moreHide), !isVisible(f.lastChild) && (show(f.lastChild), hide(f.firstChild),
                                        c.reverse))) {
                                    var a = getSize(w);
                                    setStyle(w, "marginTop", -a[1] + d)
                                }
                            }), addEvent(f, "mouseout", function() {
                                clearTimeout(c.moreHide), c.moreHide = setTimeout(function() {
                                    if (hide(f.lastChild), show(f.firstChild), c.reverse) {
                                        var e = getSize(w);
                                        setStyle(w, "marginTop", -e[1] + d)
                                    }
                                }, 300)
                            }), l = f.appendChild(ce("a", {
                                className: "add_media_more add_media_item",
                                innerHTML: "<nobr>" + h + "</nobr>"
                            })), p = ce("div", {
                                className: "add_media_more_node",
                                innerHTML: '<div class="unshown"></div>'
                            }, {
                                display: "none"
                            }), l = f.appendChild(p), c.moreWrap = f
                        }
                        extend(m, n), a[4] && (g.href = a[4]), l = (p ? p : r)
                            .appendChild(ce("a", g, m)), a[3] && addEvent(l, "click", function() {
                                return c.hide(!0), t.onItemClick && !t.onItemClick(a[0]) ? !1 : (a[3](), !1)
                            })
                    }), t.tooltip) {
                    var g = geByClass1("add_media_pointer", s);
                    addEvent(r.firstChild, "mouseover", function() {
                        addClass(g, "add_media_pointer_hover")
                    }), addEvent(r.firstChild, "mouseout", function() {
                        removeClass(g, "add_media_pointer_hover")
                    })
                }
            }
        };
    return a && c.setItems(a), browser.msie && (removeEvent(e, "MSPointerDown"), addEvent(e, "MSPointerDown", c.show.pbind(!0)), addEvent(s, "MSPointerDown", c.show.pbind(!0))),
        removeEvent(e, "mouseover"), addEvent(e, "mouseover click", c.show), addEvent(e, "mouseout", c.hide), addEvent(s, "mouseover", c.show), addEvent(s, "mouseout", c.hide),
        addEvent(s, "click", cancelEvent), addEvent(geByClass1("add_media_header", s), "click", function(e) {
            c.show(!0), cancelEvent(e)
        }), t.global || cur.destroy.push(function() {
            cleanElems(s), re(s), removeEvent(e, "click", c.show), browser.msie && (clearTimeout(c.toucht), removeEvent(bodyNode, "MSPointerDown", c.iecheckhide))
        }), c
}

function extractUrls(e, a) {
    for (var t, o = a ? urlInactiveExp : urlActiveExp, i = []; e && (t = e.match(o));) {
        e = e.substr(t.index + t[0].length);
        var l = 0;
        t[4] || (l = 7), i.push({
            url: t[2 + l],
            query: t[5 + l] || "",
            domain: t[4 + l]
        })
    }
    return i
}

function initAddMedia(e, a, t, o) {
    var i, l = [],
        s = {
            graffiti: -152,
            video: -20,
            photo: 3,
            audio: -42,
            poll: -108,
            doc: -64,
            map: -86,
            note: -130,
            postpone: -173,
            gift: -196
        };
    o = o || {}, each(t || [], function(e, a) {
        if (a[1]) {
            var t = !1,
                r = o.toId || cur.postTo,
                n = {
                    to_id: r,
                    scrollbar_width: sbWidth(),
                    blockPersonal: o.blockPersonal
                };
            switch (n.mail_add = o.mail ? 1 : "", a[0]) {
                case "graffiti":
                    t = showBox.pbind("al_wall.php", {
                        act: "canvas_draw_box",
                        to_id: r,
                        flash: browser.flash
                    }, {
                        cache: 1,
                        dark: 1
                    });
                    break;
                case "photos_list":
                    t = showBox.pbind("al_photos.php", extend(n, {
                        act: "choose_photo"
                    }), {
                        cache: 1,
                        stat: ["photos.js", "photos.css", "upload.js"],
                        dark: 1
                    });
                    break;
                case "photo":
                    t = showBox.pbind("al_photos.php", extend(n, {
                        act: "choose_photo",
                        max_files: o.limit || 10
                    }), {
                        cache: 1,
                        stat: ["photos.js", "photos.css", "upload.js"],
                        dark: 1
                    });
                    break;
                case "video":
                    t = showBox.pbind("al_video.php", extend(n, {
                        act: "a_choose_video_box"
                    }), {
                        cache: 1,
                        dark: 1
                    });
                    break;
                case "audio":
                    t = showBox.pbind("audio", extend(n, {
                        act: "a_choose_audio_box"
                    }), {
                        cache: 1,
                        dark: 1
                    });
                    break;
                case "poll":
                    t = function() {
                        i.chooseMedia("poll", "", a[2])
                    };
                    break;
                case "doc":
                    var d = o.docParams || {};
                    t = showBox.pbind("docs.php", extend(n, extend({
                        act: "a_choose_doc_box"
                    }, d)), {
                        stat: ["docs.css"]
                    });
                    break;
                case "map":
                    t = showBox.pbind("al_places.php", extend(n, {
                        act: "a_choose_place_box"
                    }), {
                        stat: ["places.css", "map.css", "maps.js", "ui_controls.css", "ui_controls.js", "boxes.css"],
                        width: 640,
                        bodyStyle: "padding: 0px;",
                        dark: 1
                    });
                    break;
                case "note":
                    t = showWiki.pbind({
                        note: "new"
                    }, !0, !1, {
                        queue: 1
                    });
                    break;
                case "postpone":
                    t = function() {
                        i.chooseMedia("postpone", a[1], a[2])
                    };
                    break;
                case "gift":
                    t = function() {
                        var e = cur.peer < 2e9 ? cur.peer : 0;
                        cur.giftCurrentPrivacy = 1, cur.giftCurrentMessage = trim(clean(IM.getPlainText())), cur.onGiftSended = val.pbind(ge("im_editable" + e), ""),
                            cur.giftSendFrom = "im", showBox("al_gifts.php", {
                                act: "get_gift_box",
                                mid: e,
                                fr: e == vk.id ? 1 : 0
                            }, {
                                stat: ["gifts.css", "wide_dd.js", "wide_dd.css"],
                                dark: 1
                            })
                    }
            }
            var c = "app" == a[0],
                p = c ? a[4] : !1,
                u = c ? "5px 5px" : "3px " + s[a[0]] + "px",
                _ = c ? "/app" + a[2] + "?to_id=" + r : !1;
            a[1].replace(/\s/g, "&nbsp;");
            l.push([a[0], a[1], u, t, _, p])
        }
    });
    var r = o.limit || 10,
        n = r > 1,
        d = o.editable && (!browser.msie || browser.version > 8),
        c = o.sortable && (!browser.msie || browser.version > 8),
        p = initCustomMedia(e, l, {
            onShow: function() {
                cur.chooseMedia = i.chooseMedia, cur.showMediaProgress = i.showMediaProgress, cur.attachCount = i.attachCount, cur.lastAddMedia = i
            },
            onItemClick: function(e) {
                return n && i.attachCount() >= r && "postpone" !== e ? (showFastBox(getLang("global_error"), getLang("attachments_limit", r)), !1) : !0
            },
            tooltip: o.tooltip,
            topOffset: o.topOffset,
            forceUp: o.forceUp,
            global: o.global
        });
    if (p) {
        a = a || "media_preview";
        var u, _ = p.id,
            h = ge(a);
        if (n) {
            h.innerHTML = '<div id="page_pics_preview' + _ + '" class="page_pics_preview media_preview clear_fix"></div><div id="page_dpics_preview' + _ +
                '" class="page_pics_preview page_media_sortable media_preview clear_fix"></div><div id="page_docs_preview' + _ +
                '" class="page_docs_preview page_media_sortable media_preview clear_fix"></div><div id="page_pdocs_preview' + _ +
                '" class="page_docs_preview media_preview clear_fix"></div><div id="page_ldocs_preview' + _ +
                '" class="page_docs_preview media_preview clear_fix"></div><div id="page_mpics_preview' + _ +
                '" class="page_pics_preview media_preview clear_fix"></div><div id="page_ppdocs_preview' + _ +
                '" class="page_docs_preview media_preview clear_fix"></div><div id="page_progress_preview' + _ + '" class="page_progress_preview media_preview clear_fix"></div>';
            var g = domFC(h),
                m = domNS(g),
                w = domNS(m),
                f = domNS(w),
                v = domNS(f),
                b = domNS(v),
                y = domNS(b),
                u = domNS(y);
            removeClass(h, "media_preview"), addClass(h, "multi_media_preview")
        } else addClass(h, "med_no_attach"), show(h);
        return i = {
            _addMediaLink: e,
            lnkId: _,
            menu: p,
            phLists: {},
            handlers: {},
            chosenMedias: [],
            _showAddMedia: function() {
                p.show()
            },
            _hideAddMedia: function(e) {
                p.hide(e)
            },
            chooseMedia: function(a, t, l, s, u, h) {
                if (i.onChange && i.onChange(a, t, l, s) === !1) return !1;
                if ("note" == a && (cur.pbNoteAdded = !1), inArray(a, o.disabledTypes || [])) return !1;
                if (i.attachCount() >= r && void 0 === l.upload_ind && "postpone" !== a || geByClass1("medadd_c_market", w)) {
                    if (n) return !1;
                    i.unchooseMedia()
                }
                var k = !1,
                    C = {};
                if (n && (each(i.chosenMedias, function() {
                        return this[0] == a && this[1] == t ? (k = !0, !1) : void(C[this[0]] = C[this[0]] ? C[this[0]] + 1 : 1)
                    }), k)) return !1;
                var x, S = "",
                    P = "",
                    T = !1,
                    L = w,
                    M = "";
                switch (a) {
                    case "graffiti":
                        isObject(l) || (l = {
                            thumb: l || ""
                        }), S = '<div class="fl_l page_preview_graffiti"><img class="page_preview_graffiti" src="' + l.thumb + '" /></div>', L = T = b;
                        break;
                    case "photos_list":
                        hide(this._addMediaLink), vkImage()
                            .src = l[1];
                        var E = l[3].replace(/^{|}$/g, "");
                        E && (E += ","), E += "queue:1", x = o.nocl ? "" : " onclick=\"return showPhoto('" + l[4] + "', '" + l[2] + "', " + E.replace(/"/g, "&quot;") +
                            ');"', S = "<div" + x + ' class="fl_l page_preview_photo"><img class="page_preview_photo" src="' + l[1] + '" /></div>', L = T = g;
                        break;
                    case "photo":
                        isObject(l) || (l = {
                                thumb_m: l[0] || "",
                                thumb_s: l[1] || "",
                                list: l[2] || "",
                                view_opts: l[3] || "",
                                upload_ind: l.upload_ind || void 0
                            }), vkImage()
                            .src = l.thumb_m;
                        var E = l.view_opts.replace(/^{|}$/g, "");
                        if (E && (E += ","), E += "queue:1", i.phLists[t] = l.list, d) {
                            if (!l.editable) return !1;
                            o.nocl || (l.editable.click = i.showPhoto.pbind(t, l.list, parseJSON("{" + E + "}")))
                        }
                        x = o.nocl ? "" : ' onclick="return cur.addMedia[' + i.lnkId + "].showPhoto('" + t + "', '" + l.list + "', {" + E.replace(/"/g, "&quot;") + '});"',
                            S = "<div " + x + ' class="fl_l page_preview_photo' + (h ? " page_preview_ph_graff" : "") + '"><img class="page_preview_photo" src="' + l.thumb_m +
                            '" /></div>', T = 1, L = g;
                        break;
                    case "video":
                        if (isObject(l) || (l = {
                                thumb: l || ""
                            }), d) {
                            if (!l.editable) return !1;
                            o.nocl || (l.editable.click = showVideo.pbind(t, !1, {
                                queue: 1
                            }))
                        }
                        x = o.nocl ? "" : " onclick=\"return showVideo('" + t + "', false, {queue:1});\"", S = "<div" + x +
                            ' class="fl_l page_preview_video"><img class="page_preview_video" src="' + l.thumb + '" /></div>', T = 1, L = g;
                        break;
                    case "audio":
                        if (!l.info) return !1;
                        S = Page.addAudioPreview(t, l), M = ' id="pam' + _ + "_audio" + t + '"';
                        break;
                    case "app":
                        S = '<div class="app fl_l"><img src="' + l[0] + '" /><span>' + l[1] + "</span></div>", each(geByClass("add_media_type_" + _ + "_app", p.menuNode,
                            "a"), function() {
                            hide(this)
                        });
                        break;
                    case "doc":
                        if (!l.lang) return !1;
                        l.thumb && l.thumb_s ? (S = '<a onclick="if (cur.cancelClick) return (cur.cancelClick = false);" target="_blank" href="' + l.href +
                            '" class="fl_l pam_dpic"><div class="page_preview_doc_photo"><img src="' + l.thumb_s +
                            '" align="center"></div><div class="page_preview_doc_photo_hint">' + l.title + "</div>", P = '</a><div class="pam_bg"></div>', L = T = m, M =
                            ' id="pam' + _ + "_doc" + t + '"') : (S = '<a target="_blank" href="' + l.href + '" class="medadd_h medadd_h_doc inl_bl">' + l.lang.profile_choose_doc +
                            "</a>", P = '<div class="medadd_c medadd_c_doc"><a target="_blank" href="' + l.href + '" title="' + l.title + '">' + l.title + "</a></div>",
                            M = ' id="pam' + _ + "_doc" + t + '"');
                        break;
                    case "share":
                        if (C.share || C.page || !l.lang) return !1;
                        if (isArray(l) && (l = {
                                domain: l[0],
                                url: l[1],
                                initialPattern: l[2],
                                title: l[3],
                                description: l[4],
                                images: [l[5]],
                                user_id: l[6],
                                photo_id: l[7]
                            }), l.media = l.media || t, l.draft) return i.checkURL(l.url), !1;
                        S = '<a target="_blank" href="/away.php?to=' + encodeURIComponent(l.url) + '" class="medadd_h medadd_h_link inl_bl">' + l.lang.profile_choose_link +
                            "</a>", i.shareData = extend(i.shareData || {}, l, {
                                imagesStyles: [""]
                            }), L = v;
                        break;
                    case "poll":
                        if (!l.lang) return !1;
                        S = '<div class="medadd_h medadd_h_poll inl_bl">' + l.lang.q + "</div>", hide(geByClass1("add_media_type_" + _ + "_poll", p.menuNode, "a")), L = f;
                        break;
                    case "map":
                        S = "<div class=\"fl_l\"><a onclick=\"return showBox('al_places.php', {act: 'geo_box', lat: " + l[0] + ", long: " + l[1] + ", provider: " + intval(
                            l[3]) + '}, {dark: 1});"><div class="page_media_map_point"></div><img class="page_preview_map" width="174" height="70" src="/maps?lat=' + l[
                            0] + "&lng=" + l[1] + "&z=11&" + (window.devicePixelRatio >= 2, "w=360&h=140") + '" /></a></div>', L = T = b, hide(geByClass1(
                            "add_media_type_" + _ + "_map", ge("add_media_menu_" + _)));
                        break;
                    case "page":
                        if (C.share || C.page || !l.lang) return !1;
                        var N = l.media.split("_");
                        S = '<a href="/page' + l.media + '" onclick="return showWiki({oid: ' + N[0] + ", id: " + N[1] +
                            '}, false, event, {queue: 1})" class="medadd_h medadd_h_page inl_bl">' + l.lang.profile_choose_page + "</a>", L = v;
                        break;
                    case "note":
                        if (!l.lang) return !1;
                        S = "<a onclick=\"showWiki({w: 'note" + l.raw + '\', edit: 1}, true, event, {queue: 1})" class="medadd_h medadd_h_note inl_bl">' + l.lang.profile_choose_note +
                            "</a>", P = '<div class="medadd_c medadd_c_note"><a onclick="showWiki({w: \'note' + l.raw +
                            '\', edit: 1}, true, event, {queue: 1})" id="share_note_title' + l.raw + '">' + l.title + "</a></div>", L = v;
                        break;
                    case "market":
                        S = '<div class="medadd_c_market fl_l"><a target="_blank" href="' + l.href + '"><img class="medadd_c_market_thumb fl_l" src="' + l.thumb +
                            '" /></a><div class="medadd_c_market_info fl_l"><a class="medadd_c_market_title" target="_blank" href="' + l.href + '">' + l.title +
                            '</a><div class="medadd_c_market_price">' + l.price + "</div></div>", hide(e);
                        break;
                    case "market_album":
                        if (d) {
                            if (!l.editable) return !1;
                            extend(l.editable, {
                                title: l.title,
                                msize: langNumeric(l.count, l.lang.profile_X_market_items),
                                click: !1
                            })
                        }
                        var N = t.split("_");
                        vkImage()
                            .src = l.thumb, x = o.nocl ? "" : ' href="/market' + N[0] + "?section=album_" + N[1] + '"';
                        var W = "fl_l page_preview_album wall_album_cover_wrap wall_market_album_cover" + (l.thumb ? "" : " page_album_nocover");
                        S = '<a class="' + W + '" ' + x + ">" + (l.thumb ? '<img class="wall_album_cover" src="' + l.thumb + '"/>' : "") +
                            '  <div class="wall_album_caption">    <div class="wall_album_title_wrap clear_fix">      <div class="wall_album_count fl_r">' + l.count +
                            '</div>      <div class="wall_album_title">' + l.title + "</div>    </div>  </div></a>", T = 1, L = g;
                        break;
                    case "postpone":
                        if (S = '<div class="medadd_h medadd_h_timer inl_bl">' + l.lang.profile_choose_timer + '<span id="postpone_preview' + _ + '"></span></div>', cur.editingPost &&
                            !n) t = intval(t), t ? l.date = t : l.date = intval(cur.editingPost[7]), ge("wpe_save")
                            .innerHTML = getLang("global_save");
                        else if (cur.editingPost && "wpe_media_preview" == domPN(y)
                            .id) {
                            t = intval(t), t ? l.date = t : l.date = intval(cur.editingPost[7]);
                            var B = geByClass1("medadd_c_timersett", y);
                            if (B) {
                                var A = domPN(B);
                                B = A.innerHTML, re(A)
                            } else B = "";
                            ge("wpe_save")
                                .innerHTML = getLang("global_save")
                        } else {
                            l.draft ? l.date = intval(t) : cur.postponedLastDate && (l.date = intval(cur.postponedLastDate) + 3600);
                            var j = ge("official");
                            j && (isChecked(j) || (checkbox(j), toggle("signed", !0)), addClass(j, "disabled"));
                            var I = ge("send_post");
                            I && (I.innerHTML = l.lang.profile_wall_postpone_btn)
                        }
                        hide(geByClass1("add_media_type_" + _ + "_postpone", p.menuNode, "a")), L = y
                }
                if (n) {
                    var D = i.chosenMedias,
                        R = D.length,
                        U = d && 1 === T ? !1 : "photos_list" == a ? se('<div class="page_preview_' + a + '_wrap" style="position: relative">' + S +
                            '<div class="page_photos_count">' + t.split(",")
                            .length + "</div></div>") : se('<div class="page_preview_' + a + '_wrap"' + (o.nocl ? ' style="cursor: default"' : "") + M + ">" + S +
                            '<div nosorthandle="1" class="page_media_x_wrap inl_bl" ' + (browser.msie && browser.version < 9 ? "title" : "tootltip") + '="' + getLang(
                                "dont_attach") +
                            '" onmouseover="if (browser.msie && browser.version < 9) return; showTooltip(this, {text: this.getAttribute(\'tootltip\'), shift: [14, 3, 3], black: 1})" onclick="cur.addMedia[' +
                            i.lnkId + "].unchooseMedia(" + R + '); return cancelEvent(event);"><div class="page_media_x" nosorthandle="1"></div></div>' + P + "</div>");
                    addClass(U, T ? "fl_l" : "clear_fix"), void 0 !== l.upload_ind && re("upload" + l.upload_ind + "_progress_wrap"), o.toggleLnk && toggle(e, i.attachCount() +
                        1 < r), d && 1 === T ? (addClass(L, "editable_thumbs_wrap"), L = domLC(L) && hasClass(domLC(L), "editable_thumbs") ? domLC(L) : L.appendChild(
                        ce("div", {
                            id: "thumbs_edit" + _,
                            className: "editable_thumbs"
                        })), stManager.add(["thumbs_edit.css", "thumbs_edit.js"], function() {
                        o.toggleLnk && toggle(e, i.attachCount() + 1 < r), l.editable.remove = i.unchooseMedia.pbind(R), show(domPN(L));
                        var s = ThumbsEdit.convert(a, t, l.editable);
                        domFC(L) ? ThumbsEdit.addMedia(L, s) : o.teWidth && o.teHeight ? ThumbsEdit.init(L, [s], {
                            width: o.teWidth,
                            height: o.teHeight,
                            onMove: o.onAddMediaChange
                        }) : ThumbsEdit.init(L, [s], {
                            onMove: o.onAddMediaChange
                        })
                    }, !0)) : (show(L), L.appendChild(U), c && (L == w ? stManager.add(["sorter.js"], function() {
                        var e = getXY(w),
                            a = getSize(w),
                            t = function() {
                                w.sorter ? sorter.added(w) : L.childNodes.length > 1 && sorter.init(w, {
                                    onReorder: o.onAddMediaChange
                                })
                            };
                        e[0] || e[1] || a[0] || a[1] ? t() : cur.sorterClbk = t
                    }, !0) : L == m && stManager.add(["qsorter.js"], function() {
                        m.qsorter ? qsorter.added(m) : L.childNodes.length > 1 && qsorter.init(m, i.qsorterOpts())
                    }, !0))), D.push([a, t, U, s])
                } else {
                    var R = "postpone" === a ? 1 : 0,
                        U = se('<div class="' + (T === !1 ? "page_docs_preview" : "page_pics_preview") + '"><div class="page_preview_' + a + '_wrap"' + (o.nocl ?
                                ' style="cursor: default"' : "") + M + ">" + S + '<div nosorthandle="1" class="page_media_x_wrap inl_bl" ' + (browser.msie && browser.version <
                                9 ? "title" : "tootltip") + '="' + getLang("dont_attach") +
                            '" onmouseover="if (browser.msie && browser.version < 9) return; showTooltip(this, {text: this.getAttribute(\'tootltip\'), shift: [14, 3, 3], black: 1})" onclick="cur.addMedia[' +
                            i.lnkId + "].unchooseMedia(" + R + '); return cancelEvent(event);"><div class="page_media_x" nosorthandle="1"></div></div>' + P +
                            "</div></div>");
                    void 0 !== l.upload_ind && re("upload" + l.upload_ind + "_progress_wrap"), "postpone" !== a && (i.chosenMedia = [a, t], i.chosenMediaData = l), i.singleAdded(
                        U, a)
                }
                "share" == a ? l.title && !s ? (cur.shareShowImg = 0, i.showPreview(!0), i.shareData.images = !1) : i.showExternalPreview() : "page" == a ? l.nopreview ||
                    (cur.shareShowImg = 0, i.shareData = extend(i.shareData || {}, l, {
                        images: !1
                    }), i.showPreview()) : "poll" == a ? i.createPoll(l) : "postpone" == a && i.setupPostpone(l, B);
                var H = window.event;
                return H && "click" == H.type && (event.ctrlKey || event.metaKey || event.shiftKey) && (u = !0), cur.fileApiUploadStarted && void 0 !== l.upload_ind || cur
                    .preventBoxHide || u === !0 || inArray(a, ["poll", "share", "page", "postpone"]) || boxQueue.hideLast(), cur.lastPostMsg = !1, o.onMediaAdd && o.onMediaAdd(),
                    void 0 !== l.upload_ind && delete l.upload_ind, !1
            },
            unchooseMedia: function(a) {
                if (i.onChange && i.onChange(!1, a) === !1) return !1;
                if (n) {
                    if (void 0 === a) return window.ThumbsEdit && ThumbsEdit.removeAll("thumbs_edit" + _), each(i.chosenMedias, function(e, a) {
                        a && void 0 !== e && i.unchooseMedia(e)
                    }), void(i.urlsCancelled = []);
                    var t, l = i.chosenMedias;
                    if (l[a]) {
                        switch (l[a][2] ? ((t = geByClass1("page_media_x_wrap", l[a][2], "div")) && t.tt && t.tt.el && t.tt.destroy(), domPN(l[a][2]) == w && w.sorter ? (
                            each(w.sorter.elems, function() {
                                setStyle(this, {
                                    top: "auto",
                                    left: "auto",
                                    cursor: "auto"
                                })
                            }), w.sorter.destroy(), re(l[a][2]), w.childNodes.length > 1 && sorter.init(w, {
                                onReorder: o.onAddMediaChange
                            })) : domPN(l[a][2]) == m && m.qsorter ? (each(m.qsorter.elems, function() {
                            setStyle(domFC(this), {
                                top: "auto",
                                left: "auto"
                            }), setStyle(this, {
                                cursor: "auto"
                            })
                        }), m.qsorter.destroy(), re(l[a][2]), m.childNodes.length > 1 && qsorter.init(m, i.qsorterOpts())) : re(l[a][2])) : ("photo" == l[a][0] ||
                            "video" == l[a][0] || "album" == l[a][0]) && window.ThumbsEdit && ThumbsEdit.removeById("thumbs_edit" + _, l[a][0] + l[a][1]), l[a][0]) {
                            case "page":
                            case "share":
                                i.shareData = {}, re(i.sharePreview), delete i.sharePreview;
                                break;
                            case "poll":
                                re(i.pollPreview), i.pollPreview = !1, show(geByClass1("add_media_type_" + _ + "_poll", p.menuNode, "a"));
                                break;
                            case "app":
                                each(geByClass("add_media_type_" + _ + "_app", p.menuNode, "a"), function() {
                                    show(this)
                                });
                                break;
                            case "map":
                                show(geByClass1("add_media_type_" + _ + "_map", ge("add_media_menu_" + _)));
                                break;
                            case "market":
                                show(e);
                                break;
                            case "postpone":
                                var s = geByClass1("medadd_c_timersett", i.postponePreview);
                                cur.editingPost && s ? re(domFC(i.postponePreview)) : re(i.postponePreview), i.postponePreview = !1, removeClass("official", "disabled"),
                                    cur.editingPost ? ge("wpe_save")
                                    .innerHTML = getLang("wall_publish_now") : ge("send_post")
                                    .innerHTML = getLang("wall_send"), show(geByClass1("add_media_type_" + _ + "_postpone", p.menuNode, "a"))
                        }
                        l[a] = !1
                    }
                    o.toggleLnk && toggle(e, i.attachCount() < r), toggle(g, !!(d ? geByClass1("thumb_wrap", g) : domFC(g))), toggle(m, !!domFC(m)), toggle(w, !!domFC(w)),
                        toggle(f, !!domFC(f)), toggle(v, !!domFC(v)), toggle(b, !!domFC(b)), toggle(y, !!domFC(y)), toggle(u, !!domFC(u))
                } else {
                    var c, t;
                    if (void 0 == a && (a = 0), (t = geByClass("page_media_x_wrap", h, "div")[a]) && t.tt && t.tt.el && t.tt.destroy(), a && i.postponePreview) show(
                        geByClass1("add_media_type_" + _ + "_postpone", p.menuNode, "a")), re(domPN(i.postponePreview)), i.postponePreview = !1;
                    else {
                        if (i.postponePreview) {
                            for (var k = domPN(i.postponePreview), C = 0; C < h.childNodes.length; C++) {
                                var x = h.childNodes[C];
                                "DIV" == x.nodeName && x != k && re(x)
                            }
                            each(geByClass("add_media_item", p.menuNode, "a"), function(e, a) {
                                hasClass(a, "add_media_type_" + _ + "_postpone") || show(a)
                            })
                        } else val(h, ""), addClass(h, "med_no_attach"), each(geByClass("add_media_item", p.menuNode, "a"), function(e, a) {
                            show(a)
                        });
                        i.chosenMedia && (i.chosenMedia = !1, i.chosenMediaData = !1), (c = i.shareData) && (c.url && i.urlsCancelled.push(c.url), c.initialPattern && i.urlsCancelled
                            .push(c.initialPattern), i.shareData = {}), each([i.sharePreview, i.pollPreview], function() {
                            re(this)
                        }), i.sharePreview = i.pollPreview = !1
                    }
                    o.toggleLnk && show(e)
                }
                cur.lastPostMsg = !1, i.onChange && i.onChange(!1)
            },
            singleAdded: function(a, t) {
                i.postponePreview ? h.insertBefore(a, domFC(h)) : h.appendChild(a), removeClass(h, "med_no_attach");
                var l = 0;
                each(geByClass("add_media_item", p.menuNode, "a"), function(e, a) {
                    "postpone" === t || hasClass(a, "add_media_type_" + _ + "_postpone") ? isVisible(a) && l++ : hide(a)
                }), o.toggleLnk && !l && hide(e)
            },
            getMedias: function() {
                if (n) {
                    var e = window.ThumbsEdit ? ThumbsEdit.getMedias("thumbs_edit" + _) : [],
                        a = {},
                        t = i.chosenMedias || [],
                        o = [],
                        l = function(e, t, i) {
                            return i[0] + i[1] == e ? (o.push(i), a[e] = !0, !1) : void 0
                        };
                    return each(e, function(e, a) {
                        each(t, l.pbind(a[0] + a[1]))
                    }), each(m.childNodes, function(e, a) {
                        var o = (a.id || "")
                            .match(/^pam\d+_([a-z]+)(-?\d+_\d+)/);
                        o && each(t, l.pbind(o[1] + o[2]))
                    }), each(w.childNodes, function(e, a) {
                        var o = (a.id || "")
                            .match(/^pam\d+_([a-z]+)(-?\d+_\d+)/);
                        o && each(t, l.pbind(o[1] + o[2]))
                    }), each(t, function(e, t) {
                        t && isArray(t) && t.length && !a[t[0] + t[1]] && o.push(t)
                    }), o
                }
                var t = i.chosenMedia;
                return t ? [t[0] + t[1]] : []
            },
            showPhoto: function(e, a, t, o) {
                !cur.pvData || cur.pvShown && cur.pvListId == a || delete cur.pvData[a];
                for (var l in ajaxCache) l.toString()
                    .match(/^\/al_photos\.php\#act=show&draft_photos/) && delete ajaxCache[l];
                var s = i.getMedias(),
                    r = [];
                return each(s, function(e, a) {
                    a && "photo" == a[0] && r.push(a[1] + "/" + (i.phLists[a[1]] || ""))
                }), t.additional = {
                    draft_photos: r.join(";")
                }, showPhoto(e, a, extend(t, {
                    queue: 1
                }), o)
            },
            showMediaProgress: function(a, t, l) {
                if (i.onProgress && i.onProgress(a, t, l) === !1) return !1;
                var s = l.loaded / l.total,
                    d = intval(100 * s),
                    c = (l.fileName || l.name || "")
                    .replace(/[&<>"']/g, ""),
                    p = c ? t + "_" + c : t,
                    h = c ? c.length > 33 ? c.substr(0, 30) + "..." : c : "",
                    g = ge("upload" + p + "_progress");
                if (g)
                    if (show(g), g.full) {
                        var m = data(g, "tween"),
                            w = intval(g.full * s);
                        m && m.isTweening ? m.to.width = w : animate(g, {
                            width: w + "px"
                        }, 500)
                    } else setStyle(g, {
                        width: d + "%"
                    });
                else {
                    cur.attachMediaIndexes || (cur.attachMediaIndexes = {}), cur.attachMediaIndexes[p] = _;
                    var f = '<div class="fl_l"><div class="page_attach_progress_wrap" style="margin-top: 3px; margin-bottom: 4px;">  <div id="upload' + p +
                        '_progress" class="page_attach_progress"></div></div></div></div>' + (h ? '<div class="attach_label fl_l">' + h + "</div>" : "") +
                        '<div class="progress_x fl_l" onmouseover="animate(this, {opacity: 1}, 200); showTooltip(this, {text: \'' + getLang("dont_attach") +
                        '\', shift: [6, 3, 3]})" onmouseout="animate(this, {opacity: 0.6}, 200);" onclick="Upload.terminateUpload(' + t + ", '" + (c || t) +
                        "', this);\"></div>";
                    if (n) u.appendChild(ce("div", {
                        id: "upload" + p + "_progress_wrap",
                        innerHTML: f,
                        className: "clear_fix upload_" + t + "_progress"
                    }, {
                        marginTop: "6px"
                    })), show(u), o.toggleLnk && toggle(e, i.attachCount() < r);
                    else {
                        var v = ce("div", {
                            id: "upload" + p + "_progress_wrap",
                            innerHTML: f,
                            className: "clear_fix upload_" + t + "_progress"
                        });
                        i.chosenMedia = "progress", i.singleAdded(v, "progress")
                    }
                    g = ge("upload" + p + "_progress"), g.full = !1, d ? setStyle(g, {
                        width: g.full ? intval(g.full * s) + "px" : d + "%"
                    }) : (setStyle(g, {
                        width: "1px"
                    }), hide(g))
                }
            },
            attachCount: function() {
                if (i.attachedCount) return i.attachedCount();
                if (!h) return 0;
                if (!n) return h.childNodes.length - (i.postponePreview ? 1 : 0);
                var e = (d && window.ThumbsEdit ? (ThumbsEdit.cache()["thumbs_edit" + _] || {})
                        .previews || [] : g.childNodes)
                    .length + m.childNodes.length + b.childNodes.length + w.childNodes.length / (w.sorter ? 2 : 1) + u.childNodes.length;
                return i.sharePreview && ++e, i.pollPreview && ++e, e
            },
            createPoll: function(e) {
                var a, t = e.question ? "" : "1px",
                    o = [];
                e[22] ? "disabled" : "", e[8] ? "" : "disabled";
                i.pollPreview = f.appendChild(ce("div", {
                        className: "medadd_c medadd_c_poll",
                        innerHTML: '<input onkeydown="cur.addMedia[' + _ + '].keyPoll(this, event)" class="text medadd_c_pollq" id="create_poll_question' + _ +
                            '" value="' + (e.question || "") + '" /><div class="medadd_c_pollh">' + e.lang.a +
                            '</div><div class="medadd_c_pollans" id="create_poll_answers' + _ + '"></div><div class="medadd_c_polladd_wr" id="create_poll_add' + _ +
                            '">  <div class="medadd_c_polladd" onclick="cur.addMedia[' + _ + '].incPoll()">' + e.lang.i + "</div></div>" + (e.edit ? "" :
                                '<div class="checkbox medadd_c_pollcb' + (e.anon ? " on" : "") + '" id="create_poll_anonymous' + _ +
                                '" onclick="checkbox(this);cur.addMedia[' + _ + '].changedPoll();">' + e.lang.c + "</div>")
                    })), e.answers || (e.answers = [
                        [0, ""],
                        [0, ""]
                    ]), cur.pollAnswerTemplate =
                    '<input onkeydown="cur.addMedia[%lnkid%].keyPoll(this, event)" class="text medadd_c_polla" %attrs%/><div class="page_media_x_wrap medadd_c_pollrem inl_bl" ' +
                    (browser.msie ? "title" : "tootltip") + '="' + e.lang.d +
                    '" onmouseover="if (browser.msie) return; showTooltip(this, {text: this.getAttribute(\'tootltip\'), shift: [14, 3, 3], black: 1})" onclick="cur.addMedia[%lnkid%].decPoll(this)"><div class="page_media_x"></div></div>';
                for (var l = 0, s = e.answers.length; s > l; ++l) a = e.answers[l], o.push('<div class="medadd_c_polla_wr">' + rs(cur.pollAnswerTemplate, {
                    attrs: (a[0] ? 'id="create_poll_ans' + a[0] + '" ' : "") + (a[1] ? '" value="' + a[1] + '" ' : ""),
                    lnkid: _
                }) + "</div>"), 9 == l && hide("create_poll_add" + _);
                return val("create_poll_answers" + _, o.join("")), e.question ? void elfocus("create_poll_question" + _) : (i.pollPreview.style.height = t, void animate(i.pollPreview, {
                    height: 166
                }, 200, function() {
                    i.pollPreview.style.height = "auto", elfocus("create_poll_question" + _)
                }))
            },
            incPoll: function() {
                var e = ge("create_poll_answers" + _),
                    a = e.childNodes.length;
                10 > a && elfocus(geByTag1("input", e.appendChild(ce("div", {
                    className: "medadd_c_polla_wr",
                    innerHTML: rs(cur.pollAnswerTemplate, {
                        attrs: "",
                        lnkid: _
                    })
                })))), toggle("create_poll_add" + _, 9 > a)
            },
            decPoll: function(e) {
                e.tt && e.tt.el && e.tt.destroy(), re(domPN(e)), show("create_poll_add" + _)
            },
            keyPoll: function(e, a) {
                if (a = a || window.event, a && (10 == a.keyCode || 13 == a.keyCode || 9 == a.keyCode)) {
                    var t = hasClass(e, "medadd_c_pollq"),
                        o = a.shiftKey;
                    if (o && t) return;
                    var l = t ? domFC(domNS(domNS(e))) : (o ? domPS : domNS)(domPN(e));
                    return l ? elfocus(geByTag1("input", l)) : o ? elfocus(geByClass1("medadd_c_pollq", domPN(domPN(domPN(e))))) : this.incPoll(), cancelEvent(a)
                }
                i.changedPoll()
            },
            changedPoll: function() {
                o.onMediaChange && o.onMediaChange()
            },
            pollData: function(e) {
                for (var a, t = ge("create_poll_answers" + _), o = trim(val("create_poll_question" + _)), i = {
                        media: o,
                        anonymous: isChecked("create_poll_anonymous" + _)
                    }, l = 0, s = !1, r = domFC(t); r; r = domNS(r))
                    if (a = trim(val(domFC(r)))) {
                        var n = -intval((domFC(r)
                            .id.match(/^create_poll_ans(\d+)$/) || [0, -l++])[1]);
                        i["answers[" + n + "]"] = a, s = !0
                    }
                return o ? s ? i : (domFC(t) || cur.addMedia[_].incPoll(), e !== !0 && (notaBene(domFC(domFC(t))), elfocus(domFC(domFC(t)))), !1) : (e !== !0 && (notaBene(
                    "create_poll_question" + _), elfocus("create_poll_question" + _)), !1)
            },
            urlsCancelled: [],
            shareData: {},
            checkMessageURLs: function(e, a) {
                if (!(i.chosenMedia || i.urlAttachmentLoading && i.urlAttachmentLoading[0] > vkNow() - 1e4 || i.attachCount() >= r)) {
                    if (cur.reply_to && cur.reply_to[0]) {
                        var t = Wall.getReplyName(cur.reply_to[0]);
                        if (t && isArray(t) && t[1] && (t = t[1]), t) {
                            var o = extractUrls(t, a);
                            for (var l in o) {
                                var s = o[l].url;
                                s.match(/^https?:\/\//) || (s = "http://" + s), inArray(s, i.urlsCancelled) || i.urlsCancelled.push(s)
                            }
                        }
                    }
                    var n = extractUrls(e, a);
                    for (var l in n) {
                        var d = n[l],
                            s = d.url,
                            c = d.query,
                            p = d.domain,
                            u = s;
                        if (s.match(/^https?:\/\//) || (s = "http://" + s), !inArray(s, i.urlsCancelled) && !inArray(u, i.urlsCancelled)) {
                            var _ = !0;
                            if (p.match(/(^|\.|\/\/)(vkontakte\.ru|vk\.com)/) && (_ = c.match(
                                    /(#photo|^\/(photo|video|album|page|audio|doc)|z=(album|photo|video)|w=(page|product))(-?\d+_)?\d+|\.(jpg|png|gif)$|market-?\d+\?section=album_\d+|^\/stickers\/.+$|^\/vk2016+$|^http:\/\/instagram\.com\/p\/.+/
                                ) ? !0 : !1), _) return void i.checkURL(u)
                        }
                    }
                }
            },
            onCheckURLDone: function(e, a) {
                var t = "";
                i.urlAttachmentLoading && (re(i.urlAttachmentLoading[2]), n ? toggle(u, u.childNodes > 0) : toggleClass(h, "med_no_attach", !h.childNodes), t = i.urlAttachmentLoading[
                    1], i.urlAttachmentLoading = !1, setStyle(bodyNode, {
                    cursor: "default"
                })), e ? i.chooseMedia(a[0], a[1], a[2], t, !0) : o.onCheckURLDone && o.onCheckURLDone(e, a)
            },
            checkURL: function(e) {
                if (e) {
                    i.urlsCancelled.push(e), i.urlAttachmentLoading = [vkNow(), e], re(i.checkURLForm), i.checkURLForm = ce("div", {
                        innerHTML: '<iframe name="share_parse_iframe' + _ + '"></iframe>'
                    }), utilsNode.appendChild(i.checkURLForm);
                    var a = i.checkURLForm.appendChild(ce("form", {
                        action: "share.php?act=url_attachment",
                        method: "post",
                        target: "share_parse_iframe" + _
                    }));
                    each({
                        hash: cur.share_timehash || cur.options.share.timehash || "",
                        index: _,
                        url: e,
                        to_mail: o.mail ? 1 : ""
                    }, function(e, t) {
                        a.appendChild(ce("input", {
                            type: "hidden",
                            name: e,
                            value: t
                        }))
                    }), setStyle(bodyNode, {
                        cursor: "wait"
                    }), window.onUploadDone = i.onCheckURLDone.pbind(!0), window.onUploadFail = i.onCheckURLDone.pbind(!1), a.submit()
                }
            },
            addPreview: function(e) {
                return i.sharePreview = v.appendChild(ce("div", {
                    className: "medadd_c medadd_c_link",
                    innerHTML: '<div class="medadd_c_linkcon"><div></div>' + (e ? '<div class="progress medadd_c_linkprg"></div>' : "") + "</div>"
                }))
            },
            shareImgUrl: function(e) {
                var a = i.shareData;
                if (a.images_proxy && a.images_proxy[e]) return a.images_proxy_url + a.images_proxy[e];
                if (a.images) {
                    var t = a.images[e];
                    return isArray(t) && (t = t[0] ? t[0] : ""), t
                }
                return ""
            },
            showPreview: function(e) {
                var t, o, l = i.shareData,
                    s = i.sharePreview || i.addPreview();
                if (l.images && (t = l.images[cur.shareShowImg], o = i.bigLink || l.big_link || t && isArray(t) && t[0] ? "medadd_c_linkimg_big" : ""), l.failed) var r =
                    getLang("page_not_loaded");
                else {
                    var n = e ? "" : 'onload="if (this.width < 130 && !cur.onLoadSwitched) {cur.onLoadSwitched=1;setTimeout(cur.shareShowNext, 0);}"',
                        d = "",
                        c = clean(i.shareImgUrl(cur.shareShowImg));
                    if (l.images && l.images[cur.shareShowImg] && c) {
                        var p = l.images[cur.shareShowImg],
                            u = o ? 'style="width: 100%"' : l.imagesStyles && l.imagesStyles[cur.shareShowImg] || "";
                        if (d = '<img class="medadd_c_linkimg" src="' + c + '" ' + n + " " + u + " />", d += o ? Page.buildMediaLinkEl(l.domain) : "", l.images.length > 0) {
                            var _ = (l.images.length > 1 ? '<div class="medadd_c_linkimg_scroll_wrap medadd_c_linkimg_scroll_wrap_left ' + (0 == cur.shareShowImg ?
                                    "medadd_c_linkimg_scroll_wrap_left_first" : "") + '" onclick="' + (0 == cur.shareShowImg ? "Page.ownerPhoto('" + l.media + "');" :
                                    "cur.shareShowNext(true);") + '"><div class="medadd_c_linkimg_scroll"></div></div>' : "", ""),
                                h = "";
                            cur.shareShowImg < l.images.length - 1 ? _ =
                                '<div class="medadd_c_linkimg_scroll_wrap medadd_c_linkimg_scroll_wrap_right" onclick="cur.shareShowNext();"><div class="medadd_c_linkimg_scroll"></div></div>' :
                                cur.shareShowImg == l.images.length - 1 && isArray(p) && p[0] && (_ = "");
                            var g = isArray(l.images[l.images.length - 1]) && !!l.images[l.images.length - 1][0],
                                m = l.uniqueImagesCount + intval(g),
                                w = "onmouseover=\"showTooltip(this, {text: '" + getLang("global_link_choose_own_photo") + "', black: 1, shift: [7, 1, 0]})\"",
                                f = "onmouseover=\"showTooltip(this, {text: '" + getLang("global_link_remove_photo") + "', black: 1, shift: [7, 1, 0]})\"",
                                b = l.media && "_" !== l.media ?
                                '<div class="medadd_c_linkimg_controls">  <div class="medadd_c_linkimg_controls_btn_group clear_fix fl_l">' + (m > 1 ?
                                    '    <div class="medadd_c_linkimg_controls_btn_arrows_group">      <div class="medadd_c_linkimg_controls_btn" id="medadd_ctrl_left" onclick="cur.shareShowNext(true);"></div>      <div class="medadd_c_linkimg_controls_btn" id="medadd_ctrl_right" onclick="cur.shareShowNext();"></div>    </div>' :
                                    "") + '    <div class="medadd_c_linkimg_controls_btn ' + (m > 1 ? "medadd_c_btn_side_padd" : "") + '" id="medadd_ctrl_upload" ' + w +
                                " onclick=\"Page.ownerPhoto('" + l.media +
                                '\');"></div>  </div>  <div class="medadd_c_linkimg_controls_btn_group clear_fix fl_r">    <div class="medadd_c_linkimg_controls_btn" id="medadd_ctrl_remove" ' +
                                f + ' onclick="tooltips.hide(this);cur.removeLinkImage(this)"></div>  </div></div>' : "",
                                y = t ? "" : "display: none";
                            d = '<div class="medadd_c_linkimg_container fl_l" style="' + y + '">' + d + b + h +
                                '<div id="medadd_c_linkimg_loader" class="medadd_c_linkimg_loader"></div></div>'
                        }
                    }
                    var k = "";
                    l.microdata && l.microdata_preview_html && (k = l.microdata_preview_html);
                    var C = l.description_short || l.description,
                        r = d + (l.title ? '<h4 class="medadd_c_linkhead">' + l.title + "</h4>" : "") + (!o && l.domain ? '<div class="page_media_link_addr">' + l.domain +
                            "</div>" : "") + (k ? '<div class="medadd_c_linkmicrodata">' + k + "</div>" : "") + (C ? '<div class="medadd_c_linkdsc">' + C + "</div>" : "") +
                        '<div class="clear"></div>'
                }
                if (e) cur.preventShareAnim && cur.preventShareAnim.stop(), val(domFC(s), r), domFC(s)
                    .style.height = "auto", shortCurrency();
                else {
                    !isVisible(v);
                    show(v);
                    var x = ge(a)
                        .appendChild(ce("div", {
                            innerHTML: '<div class="medadd_c_linkcon ' + o + '">' + r + "</div>"
                        }, {
                            position: "absolute",
                            width: getSize(s)[0] - 10,
                            visibility: "hidden"
                        })),
                        S = getSize(x)[1];
                    re(x), val(domFC(s), r), shortCurrency(), cur.preventShareAnim = animate(domFC(s), {
                        height: S
                    }, 200), re(geByClass1("medadd_c_linkprg", v))
                }
                o && addClass(geByClass1("medadd_c_linkcon", v), o)
            },
            showExternalPreview: function() {
                var e = i.shareData;
                e.images || (e.images = []);
                var a = [],
                    t = [],
                    o = {};
                if (each(e.images, function(i, l) {
                        o[l] || (o[l] = !0, a.push(l), e.images_proxy && t.push(e.images_proxy[i]))
                    }), e.uniqueImagesCount = a.length, e.images = a, e.images_proxy = t, e.images.push([]), !e.images || !e.images.length) return cur.shareShowImg = 0,
                    void i.showPreview();
                cur.shareShowImg = -1, i.addPreview(!0), e.imagesStyles = {};
                var l = !1;
                cur.shareSetOwnPhoto = function(a) {
                    curBox() && curBox()
                        .hide(), i.bigLink = !0, e.images[e.images.length - 1] = [a.photo_url, a.user_id, a.photo_id], cur.shareShowNext(0, 1)
                }, cur.shareClearOwnPhoto = function() {
                    e.images[e.images.length - 1] = [], cur.shareShowNext(0, 0, 1)
                }, cur.removeLinkImage = function(e) {
                    var a = gpeByClass("medadd_c_linkcon", e);
                    re(gpeByClass("medadd_c_linkimg_container", e)), setStyle(a, "height", ""), i.shareData.noPhoto = !0
                }, cur.shareShowNext = function(a, t, o) {
                    var s = vkImage();
                    cur.prevShareShowDir = a, o || (t ? cur.shareShowImg = e.images.length - 1 : a ? cur.shareShowImg -= 1 : cur.shareShowImg += 1);
                    var r = isArray(e.images[e.images.length - 1]) && !!e.images[e.images.length - 1][0];
                    if (!r && cur.shareShowImg > e.images.length - 2) cur.shareShowImg = 0;
                    else if (cur.shareShowImg > e.images.length - 1) cur.shareShowImg = 0;
                    else if (!r && cur.shareShowImg < 0) cur.shareShowImg = e.images.length - 2;
                    else if (cur.shareShowImg < 0) cur.shareShowImg = e.images.length - 1;
                    else if (0 == cur.shareShowImg)
                        for (var n = 1; n < e.images.length - 1; n++) {
                            var d = vkImage();
                            d.src = i.shareImgUrl(n)
                        }
                    if (!e.images.length || isEmpty(e.images) || void 0 === e.images[cur.shareShowImg]) return i.showPreview(l), void(l = !0);
                    var c = i.shareImgUrl(cur.shareShowImg);
                    c && (s.src = c), isArray(e.images[cur.shareShowImg]) && e.images[cur.shareShowImg][1] && e.images[cur.shareShowImg][2] ? (e.user_id = e.images[cur
                        .shareShowImg][1], e.photo_id = e.images[cur.shareShowImg][2], e.share_own_image = !0) : (e.user_id = void 0, e.photo_id = void 0, e.share_own_image = !
                        1);
                    var p = null;
                    c && (p = setTimeout(function() {
                        cur.shareImgInterval !== !0 && (isArray(e.images[cur.shareShowImg]) || (e.images.splice(cur.shareShowImg, 1), e.images_proxy && e.images_proxy
                            .length > cur.shareShowImg && e.images_proxy.splice(cur.shareShowImg, 1), cur.shareShowNext()))
                    }, 5e3));
                    var u = setTimeout(function() {
                            show("medadd_c_linkimg_loader"), u = null
                        }, 100),
                        _ = function() {
                            if (s.width || s.height || !c) {
                                var a = s.width,
                                    t = s.height,
                                    o = "",
                                    r = "";
                                if (p && (clearTimeout(p), p = null), u && (clearTimeout(u), u = null), hide("medadd_c_linkimg_loader"), clearInterval(cur.shareImgInterval), !
                                    isArray(e.images[cur.shareShowImg]) && (20 > a || 20 > t)) {
                                    if (e.images.splice(cur.shareShowImg, 1), e.images_proxy && e.images_proxy.length > cur.shareShowImg && e.images_proxy.splice(cur.shareShowImg,
                                            1), e.images.length) return setTimeout(cur.shareShowNext.pbind(0, 0, 1), 0)
                                } else {
                                    var n = a >= 537 && t >= 240;
                                    if (!n && i.bigLink && cur.shareShowImg != e.images.length - 1) return e.images.splice(cur.shareShowImg, 1), e.images_proxy.splice(
                                        cur.shareShowImg, 1), cur.prevShareShowDir || cur.shareShowImg--, void cur.shareShowNext(cur.prevShareShowDir);
                                    i.bigLink = i.bigLink || n, a > 150 && (t = 150 * t / a, a = 150);
                                    var d = Math.round(t / 2),
                                        _ = Math.round(a / 2);
                                    n && t > 150 ? -Math.round(33.5) : -d, a > 150 ? -Math.round(75) : -_;
                                    o = "width: " + a + "px; height: " + t + "px;", n && (o = "width: 100%;")
                                }
                                e.images.length > 1 && (r = ""), e.imagesStyles[cur.shareShowImg] = 'style="' + o + '"' + r, i.showPreview(l), l = !0
                            }
                        };
                    clearInterval(cur.shareImgInterval), cur.shareImgInterval = setInterval(_, 300), setTimeout(_, 0)
                }, cur.shareShowNext()
            },
            uploadShare: function(e) {
                var a = i.shareData,
                    t = i.sharePreview,
                    o = t.appendChild(ce("div", {
                        innerHTML: '<iframe class="upload_frame" name="share_upload_iframe' + _ + '"></iframe>'
                    })),
                    l = o.appendChild(ce("form", {
                        action: "/share.php",
                        method: "post",
                        target: "share_upload_iframe" + _
                    })),
                    s = a.images[cur.shareShowImg];
                each({
                    act: "a_photo",
                    url: a.url,
                    index: _,
                    image: s,
                    extra: a.extra || 0,
                    hash: vk.ip_h
                }, function(e, a) {
                    l.appendChild(ce("input", {
                        type: "hidden",
                        name: e,
                        value: a
                    }))
                }), window.onUploadDone = function(a, l) {
                    window.onUploadFail = window.onUploadDone = function() {}, t.removeChild(o), i.shareData = extend(i.shareData, {
                        user_id: l.user_id,
                        photo_id: l.photo_id,
                        photo_url: s,
                        images: []
                    }), setTimeout(e, 0)
                }, window.onUploadFail = function(a, l) {
                    window.onUploadFail = window.onUploadDone = function() {}, t.removeChild(o), i.shareData.images = [], setTimeout(e, 0)
                }, cur.shareLastParseSubmitted = vkNow(), l.submit()
            },
            setupPostpone: function(e, a) {
                var t;
                t = n || y ? y : domPN(geByClass1("page_preview_postpone_wrap", h));
                var l = cur.editingPost && "wpe_media_preview" == domPN(t)
                    .id,
                    s = l || !n ? "" : "1px",
                    r = !1,
                    d = '<div class="clear_fix"><div class="fl_l"><input type="hidden" id="postpone_date' + _ + '" value="' + (e.date || "") +
                    '" /></div><div class="fl_l medadd_c_timerat">' + e.lang.profile_wall_postpone_at + '</div><div class="fl_l"><input type="hidden" id="postpone_time' +
                    _ + '"/></div></div>';
                cur.editingPost && void 0 != e.friends_only ? (d += '<div class="medadd_c_timersett">', void 0 != e.status_export && (d +=
                            '<div class="checkbox_status_export' + (e.status_export ? " on" : "") + ' fl_l" id="status_export' + _ +
                            '" onclick="checkbox(this)" onmouseover="showTooltip(this, {text: \'' + e.lang.export_to_twitter + "', black: 1, shift: [12,4,0]});\"></div>"),
                        void 0 != e.facebook_export && (d += '<div class="checkbox_facebook_export' + (e.facebook_export ? " on" : "") + ' fl_l" id="facebook_export' + _ +
                            '" onclick="checkbox(this)" onmouseover="showTooltip(this, {text: \'' + e.lang.export_to_facebook + "', black: 1, shift: [12,4,0]});\"></div>"),
                        d += '<div class="checkbox' + (e.friends_only ? " on" : "") + ' fl_l" id="friends_only' + _ + '" onclick="checkbox(this);checkbox(\'status_export' +
                        _ + "',!isChecked(this));checkbox('facebook_export" + _ + "',!isChecked(this));\">" + e.lang.friends_only + "</div></div>", r = !0) : cur.editingPost &&
                    a && (d += a, r = !0), i.postponePreview = t.appendChild(ce("div", {
                        className: "medadd_c medadd_c_timer clear_fix" + (r ? " medadd_c_nofixed" : ""),
                        innerHTML: d
                    })), i.postponePreview.style.height = s, stManager.add(["ui_controls.css", "ui_controls.js", "datepicker.css", "datepicker.js"], function() {
                        new Datepicker("postpone_date" + _, {
                            time: "postpone_time" + _,
                            width: 120,
                            noPast: !0,
                            minStep: 1,
                            onUpdate: o.onMediaChange
                        }), !l && n && animate(i.postponePreview, {
                            height: 33
                        }, 200, function() {
                            i.postponePreview.style.height = ""
                        })
                    })
            },
            destroy: function() {
                (w || {})
                .sorter && w.sorter.destroy(), (m || {})
                    .qsorter && m.qsorter.destroy()
            },
            qsorterOpts: function() {
                return {
                    xsize: Math.floor(m.offsetWidth / 110),
                    width: 110,
                    height: 83,
                    onReorder: o.onAddMediaChange,
                    clsUp: "pam_dpic_up"
                }
            },
            resized: function() {
                window.ThumbsEdit && ThumbsEdit.setWide("thumbs_edit" + cur.wallEditComposer.addMedia.lnkId), m.qsorter && (m.qsorter.destroy(), qsorter.init(m, i.qsorterOpts()))
            }
        }, cur.addMedia || (cur.addMedia = {}), cur.addMedia[_] = i, o.onAddMediaChange && (i.onChange = o.onAddMediaChange), i
    }
}
var Page = {
        buildMediaLinkEl: function(e) {
            return '<div class="page_media_link_url"><div class="page_media_link_icon"></div><div class="page_media_link_text">' + e + "</div></div>"
        },
        showManyPhoto: function(e, a, t, o) {
            allPhotos = [];
            return each(domPN(e)
                .childNodes,
                function(e, a) {
                    var t = a && a.getAttribute && a.getAttribute("onclick"),
                        o = t.match(/'(-?\d+_\d+)'\s*,\s*'([a-f0-9]{18})'/i);
                    o && allPhotos.push(o[1] + "/" + o[2])
                }), o.additional = {
                draft_photos: allPhotos.join(";")
            }, showPhoto(a, t, extend(o, {
                queue: 1
            }))
        },
        inviteToGroup: function(e, a, t, o, i) {
            var l = domPN(e),
                s = domPN(domPN(e)),
                r = function(e) {
                    var o = e ? 1 : 0,
                        s = e ? getLang("friends_cancel_event_invite") : getLang("friends_send_event_invite");
                    l.innerHTML = '<a onclick="return page.inviteToGroup(this, ' + a + ", " + t + ", " + o + ", '" + i + "')\">" + s + "</a>"
                };
            return o ? (ajax.post("/al_page.php", {
                act: "a_cancel_invite",
                mid: t,
                gid: a,
                hash: i
            }), r(0)) : (ajax.post("/al_page.php", {
                act: "a_invite",
                mid: t,
                gid: a,
                hash: i
            }, {
                onDone: function(e, a) {
                    if (!e) {
                        r(0), hide(l);
                        var t = geByClass1("error", s),
                            o = se('<div class="page_members_box_error error"><div class="msg_text">' + a + "</div></div>");
                        t ? s.replaceChild(o, t) : s.insertBefore(o, s.firstChild)
                    }
                }
            }), r(1)), !1
        },
        showPageMembers: function(e, a, t) {
            return cur.viewAsBox ? (cur.viewAsBox(), cancelEvent(e)) : !showTabbedBox("al_page.php", {
                act: "box",
                oid: a,
                tab: t
            }, {
                cache: 1
            }, e)
        },
        showPageVideos: function(e, a) {
            return cur.viewAsBox ? (cur.viewAsBox(), cancelEvent(e)) : !showBox("al_video.php", {
                act: "a_choose_video_box",
                review: 1,
                to_id: a
            }, {
                cache: 1,
                grey: 1
            })
        },
        showPageAudios: function(e, a) {
            return cur.viewAsBox ? (cur.viewAsBox(), cancelEvent(e)) : !showBox("/al_audio.php", {
                act: "audios_box",
                oid: a
            }, {
                cache: 1,
                params: {
                    width: 638
                }
            }, e)
        },
        ownerPhotoFast: function() {
            var e = ge("owner_photo_bubble_input");
            e || (e = ge("owner_photo_wrap")
                .appendChild(ce("input", {
                    type: "file",
                    id: "owner_photo_bubble_input",
                    onchange: function() {
                        data(this, "changed", !0), showBox("al_page.php", {
                                act: "owner_photo_box",
                                oid: cur.oid
                            })
                            .inp = this
                    }
                }))), e.click()
        },
        ownerPhoto: function(e) {
            showBox("al_page.php", {
                act: "owner_photo_box",
                oid: e || cur.oid
            }, {
                stat: ["owner_photo.css", "owner_photo.js"]
            })
        },
        ownerCrop: function(e) {
            showBox("al_page.php", {
                act: "owner_photo_crop",
                oid: e || cur.oid
            }, {
                stat: ["owner_photo.css", "owner_photo.js"]
            })
        },
        editPhoto: function(e) {
            cur.hideOther(), showBox("al_page.php", extend(e || {}, {
                act: "a_edit_photo"
            }), {
                params: {
                    bodyStyle: "padding: 16px 7px"
                },
                stat: ["tagger.js", "tagger.css"]
            })
        },
        deletePhoto: function(e, a) {
            cur.hideOther();
            var t = showFastBox({
                title: getLang("global_warning")
            }, getLang("sure_delete_photo"), getLang("global_delete"), function() {
                ajax.post("al_page.php", {
                    act: "a_delete_photo",
                    hash: a,
                    oid: e
                }, {
                    showProgress: t.showProgress,
                    hideProgress: t.hideProgress
                })
            }, getLang("global_cancel"))
        },
        shareCurrent: function() {
            var e = geByClass1("current_audio", ge("page_current_info"));
            return e || nav.reload(), e = e.getAttribute("data-audio"), e || nav.reload(), e = e.split("_"), (e.length < 3 || "s" != e[2].substr(0, 1)) && nav.reload(), !
                showBox("like.php", {
                    act: "publish_box",
                    object: "audio" + e[0] + "_" + e[1],
                    list: e[2] + (e[3] && "h" == e[3].charAt(0) ? "_" + e[3] : "")
                }, {
                    stat: ["page.js", "page.css", "wide_dd.js", "wide_dd.css", "sharebox.js"]
                })
        },
        playCurrent: function(e, a, t) {
            var o = e.parentNode;
            return Page.playLive(a, t, {
                showProgress: function() {
                    showProgress(o)
                },
                hideProgress: function() {
                    hideProgress(o)
                }
            })
        },
        playLive: function(e, a, t) {
            getAudioPlayer(function(o) {
                ajax.post("al_audio.php", {
                    act: "play_audio_status",
                    id: e,
                    hash: a
                }, extend(t, {
                    onDone: function(e, a, t) {
                        var i = o.getPlaylist(AudioUtils.makePlaylistId(AudioUtils.AUDIO_PLAYLIST_TYPE_CURRENT, t));
                        i.has_more = !1, i.statusOf = t, i.title = a.audio_litening_to_user, o.pushAudiosToPlaylist(i, e), o.play(e, i)
                    }
                }))
            })
        },
        audioStatusUpdate: function(e) {
            var a = isChecked("currinfo_audio"),
                t = window.ap ? AudioUtils.audioObject(window.ap.getCurrentAudio()) : !1;
            t && !window.ap.isPlaying() && (t = "");
            var o = t ? window.ap.getCurrentPlaylist() : !1,
                i = 0;
            o && (i = intval(o.playbackParams.top_audio || o.playbackParams.top)), ajax.post("al_audio.php", {
                act: "toggle_status",
                hash: e,
                exp: a,
                id: t.fullId,
                oid: vk.id,
                top: i
            }, {
                onDone: function(e) {
                    vk.id == cur.oid && e && val("current_info", e)
                }
            })
        },
        audioListenersOver: function(e, a) {
            showTooltip(e, {
                url: "al_audio.php",
                params: {
                    act: "listeners_tt",
                    oid: a
                },
                slide: 15,
                shift: [24, 10, 10],
                ajaxdt: 100,
                showdt: 400,
                hidedt: 200,
                asrtl: 1,
                dir: "auto",
                typeClass: "audio_tt",
                appendParentCls: "scroll_fix_wrap"
            })
        },
        showAudioListeners: function(e, a) {
            function t() {
                var e = ge("listeners_more_link"),
                    a = ge("listeners_more_link_trigger");
                isVisible(a) && boxLayerWrap.scrollHeight - 500 < boxLayerWrap.scrollTop + boxLayerWrap.offsetHeight && (hide(a), e.click())
            }
            return a.cancelBubble = !0, cur.audioListenersOnDone = {
                onHide: function() {
                    removeEvent(window.boxLayerWrap, "scroll", t)
                },
                onDone: function(e, a) {
                    window.audioListenersOffset = 0, a ? addEvent(window.boxLayerWrap, "scroll", t) : (re("listeners_more_link"), re("listeners_more_link_trigger"))
                }
            }, !showBox("/al_audio.php", {
                act: "listeners_box",
                oid: e
            }, extend(cur.audioListenersOnDone, {
                cache: 1
            }))
        },
        moreAudioListeners: function(e) {
            window.audioListenersOffset += 50;
            var a = geByClass1("fans_rows"),
                t = ge("listeners_more_link");
            ajax.post("/al_audio.php", {
                act: "listeners_box",
                oid: e,
                offset: window.audioListenersOffset
            }, {
                onDone: function(e, o) {
                    for (var i = ce("div", {
                            innerHTML: e
                        }), l = domFC(i); l; l = domFC(i)) a.appendChild(l);
                    if (o) {
                        var s = ge("listeners_more_link_trigger");
                        show(s)
                    } else re(t), re("listeners_more_link_trigger")
                },
                showProgress: lockButton.pbind(t),
                hideProgress: unlockButton.pbind(t)
            })
        },
        postsUnseen: function(e) {
            window._postsExtras || (_postsExtras = {});
            var a = vkNow(),
                t = !1;
            for (i in e)
                for (j in e[i])
                    if ("module" != j && "index" != j && "q" != j) {
                        var o = _postsExtras[j];
                        o && -1 == o.diff && (o.diff = a - o.start, t = !0)
                    }
            t && Page.postsClearTimeouts()
        },
        postsSeen: function(e) {
            var a, t, o, i, l, s, r, n;
            if (vk.id && e.length && !vk.pd) {
                window._postsSeenModules || (_postsSeenModules = {}), window._postsExtras || (_postsExtras = {});
                var d = vkNow();
                for (a in e) {
                    r = Page.getPostModuleCode(e[a].module ? e[a].module : ""), index = e[a].index, n = e[a].q;
                    for (t in e[a]) "module" != t && "index" != t && "q" != t && (_postsSeenModules[t] = r, i = e[a][t], l = _postsSeen[t], s = _postsSaved[t], -1 == s || -1 ==
                        l || 1 == i && (s || l) || (o = _postsSeen[t] = i, _postsExtras[t] = {
                            start: d,
                            diff: -1,
                            index: index,
                            q: n
                        }, _postsExtras[t].session_id = cur.feed_session_id ? cur.feed_session_id : "na"))
                }
                o && Page.postsClearTimeouts()
            }
        },
        postsClearTimeouts: function() {
            clearTimeout(_postsSaveTimer), _postsSaveTimer = setTimeout(Page.postsSave, 2500), clearTimeout(_postsSendTimer), _postsSendTimer = setTimeout(Page.postsSend, 5e3)
        },
        postsSave: function() {
            if (!ls.checkVersion() || isEmpty(_postsSeen)) return _postsSeen;
            var e, a, t, o, i, l = ls.get("posts_sent") || {},
                s = ls.get("posts_seen") || {},
                r = ls.get("posts_seen_modules") || {},
                n = ls.get("posts_extras") || {},
                d = Math.floor((vk.ts + Math.floor((vkNow() - vk.started) / 1e3)) / 3600);
            window._postsExtras || (_postsExtras = {});
            for (a in _postsSeen) i = _postsSeen[a], _postsExtras[a] && (n[a] = {
                    diff: _postsExtras[a].diff,
                    index: _postsExtras[a].index,
                    q: _postsExtras[a].q,
                    session_id: _postsExtras[a].session_id ? _postsExtras[a].session_id : "na"
                }, delete _postsExtras[a]), t = a.split("_"), "ad" !== t[0] && "posthashtag" !== t[0] && (t[0] = intval(t[0]), t[1] = intval(t[1])), o = (l[t[0]] || {})[t[1]],
                t[0] != vk.id && (!o || -1 == i && o > 0) && (s[t[0]] || (s[t[0]] = {}, delete r[a]), (!s[t[0]][t[1]] || -1 == i && s[t[0]][t[1]] > 0) && (e = s[t[0]][t[1]] =
                    d * i, r[a] = _postsSeenModules[a])), _postsSaved[a] = i;
            _postsSeen = {}, _postsSeenModules = {}, e && (ls.set("posts_seen", s), ls.set("posts_seen_modules", r), ls.set("posts_extras", n))
        },
        getPostModuleCode: function(e) {
            switch (e) {
                case "feed":
                    return "f";
                case "public":
                    return "c";
                case "profile":
                    return "p";
                case "feed_search":
                    return "s";
                case "feed_news_recent":
                    return "r";
                case "feed_news":
                    return "r";
                case "feed_news_top":
                    return "t";
                case "feed_other":
                    return "o";
                default:
                    return ""
            }
        },
        postsSend: function() {
            var e, a, t, o, i = {},
                l = {},
                s = {},
                r = [];
            if (ls.checkVersion()) i = ls.get("posts_seen"), l = ls.get("posts_seen_modules") || {}, s = ls.get("posts_extras") || {};
            else {
                t = Page.postsSave();
                for (e in t) sn = t[e], p = e.split("_"), "ad" !== p[0] && "posthashtag" !== p[0] && (p[0] = intval(p[0]), p[1] = intval(p[1])), i[p[0]] || (i[p[0]] = {}), (!i[
                    p[0]][p[1]] || -1 == sn && i[p[0]][p[1]] > 0) && (i[p[0]][p[1]] = sn)
            }
            for (e in i) {
                t = [];
                for (a in i[e]) {
                    var n = e + "_" + a;
                    o = l[n] || "";
                    var d = s[n],
                        c = "s" == o && d.q ? d.q : "";
                    c = c.replace(/[,;:]/g, ""), c && (c = ":" + c);
                    var u = d && d.session_id ? d.session_id : "na",
                        _ = d && "ad" != e && "posthashtag" != e ? ":" + d.diff + ":" + d.index + ":" + u + c : "";
                    t.push(o + (i[e][a] > 0 ? a : -a) + _)
                }
                t.length && r.push(e + "_" + t.join(","))
            }
            return r.length ? vk.id ? void ajax.post("al_page.php", {
                act: "seen",
                data: r.join(";")
            }, {
                onDone: function() {
                    if (!ls.checkVersion()) return extend(_postsSaved, _postsSeen);
                    var e, a, t = ls.get("posts_seen") || {},
                        o = ls.get("posts_sent") || {},
                        l = ls.get("posts_seen_modules");
                    for (e in i) {
                        for (a in i[e]) o[e] || (o[e] = {}), -1 != o[e][a] && (o[e][a] = i[e][a]), (t[e] || {})[a] && (delete t[e][a], delete l[e + "_" + a]);
                        t[e] && isEmpty(t[e]) && (delete t[e], delete l[e + "_" + a])
                    }
                    ls.set("posts_seen", t), ls.set("posts_sent", o), ls.set("posts_seen_modules", l), clearTimeout(_postsCleanTimer), _postsCleanTimer =
                        setTimeout(Page.postsClean, 1e4)
                }
            }) : Page.postsClear() : void 0
        },
        postsClean: function() {
            if (window.curNotifier && curNotifier.idle_manager && !curNotifier.idle_manager.is_idle) return debugLog("waiting ls clean.."), clearTimeout(_postsCleanTimer),
                void(_postsCleanTimer = setTimeout(Page.postsClean, 1e4));
            debugLog("cleaning ls..");
            var e, a, t, o = Math.floor((vk.ts + Math.floor((vkNow() - vk.started) / 1e3)) / 3600),
                i = ls.get("posts_sent") || {},
                l = 0;
            for (e in i) {
                for (a in i[e]) t = i[e][a], o - (t > 0 ? t : -t) > 24 && (delete i[e][a], l = 1);
                isEmpty(i[e]) && (delete i[e], l = 1)
            }
            ls.set("posts_sent", i)
        },
        postsClear: function() {
            ls.set("posts_seen", {}), ls.set("posts_extras", {}), ls.set("posts_sent", _postsSaved = _postsSeen = _postsSeenModules = _postsExtras = {})
        },
        showContacts: function(e, a, t) {
            var o = showBox("/al_page.php", {
                act: "a_get_contacts",
                oid: e,
                edit: a
            });
            o.setOptions({
                onHideAttempt: function() {
                    return cur.reloadAfterClose && (t ? t() : (nav.reload({
                        noscroll: !0
                    }), cur.reloadAfterClose = !1)), !0
                }
            })
        },
        showContactTT: function(e, a) {
            showTooltip(e, {
                text: function() {
                    return a
                },
                slideX: 15,
                className: "pedit_tt",
                hasover: 1,
                shift: [-getSize(e)[0] - 10, -15, -15],
                dir: "left",
                appendParentCls: "scroll_fix_wrap",
                onCreate: function() {
                    e.tt && setTimeout(e.tt.hide, 3e3)
                }
            })
        },
        editContact: function(oid, mid, hash, callback) {
            var b = showBox("al_page.php", {
                    act: "a_edit_contact_box",
                    mid: mid,
                    oid: oid
                })
                .setButtons(getLang("global_save"), function(btn) {
                    function onSearch() {
                        var params = {
                            act: "a_add_contact",
                            mid: mid,
                            oid: oid
                        };
                        return params.hash = hash, hash || (params.hash = ge("group_contact_hash")
                                .value), params.title = val("group_contact_position"), params.phone = val("group_contact_phone"), params.email = val("group_contact_email"),
                            mid || !ge("group_contact_memlink") || (params.page = val("group_contact_memlink"), params.page || params.phone || params.email) ? void ajax.post(
                                "al_page.php", params, {
                                    onDone: function(res, script) {
                                        b.hide();
                                        var box = curBox();
                                        box ? (box.content(res), ge("public_contacts_list") && ge("public_contacts_list")
                                            .sorter && ge("public_contacts_list")
                                            .sorter.destroy(), script && eval(script), toggle("group_add_contact", ge("public_contacts_list")
                                                .childNodes.length < 30)) : page.showContacts(oid, 1, callback)
                                    },
                                    onFail: function(e) {
                                        return ge("group_contact_error") ? (ge("group_contact_error")
                                            .innerHTML = e, show("group_contact_error_wrap"), !0) : void 0
                                    },
                                    showProgress: lockButton.pbind(btn),
                                    hideProgress: unlockButton.pbind(btn)
                                }) : void b.hide()
                    }
                    cur.reloadAfterClose = !0, mid || cur.lastContact == val("group_contact_memlink") ? onSearch() : page.searchContact(oid, val("group_contact_memlink"),
                        onSearch)
                }, getLang("global_cancel"));
            return !1
        },
        searchContact: function(e, a, t) {
            return trim(a) ? void(a != cur.lastContact && ajax.post("al_page.php", {
                act: "a_search_contact",
                oid: e,
                page: a
            }, {
                onDone: function(e, o, i, l) {
                    cur.lastContact = a, ge("group_contact_name")
                        .innerHTML = i, ge("group_contact_image")
                        .innerHTML = o, ge("group_contact_hash")
                        .value = l, e ? t ? t() : hide("group_contact_error_wrap") : (notaBene("group_contact_memlink", "", !0), hide(
                            "group_contact_error_wrap"))
                }
            })) : (cur.lastContact = "", void(t && t()))
        },
        deleteContact: function(oid, mid, hash) {
            return cur.reloadAfterClose = !0, ajax.post("al_page.php", {
                act: "a_delete_contact",
                oid: oid,
                mid: mid,
                hash: hash
            }, {
                onDone: function(res, script) {
                    var box = curBox();
                    box.content(res), ge("public_contacts_list") && ge("public_contacts_list")
                        .sorter && ge("public_contacts_list")
                        .sorter.destroy(), script && eval(script), toggle("group_add_contact", ge("public_contacts_list")
                            .childNodes.length < 30)
                }
            }), !1
        },
        reorderContacts: function(e, a, t, o, i) {
            var l = t.id.replace("group_contact_cell", ""),
                s = (o && o.id || "")
                .replace("group_contact_cell", ""),
                r = (i && i.id || "")
                .replace("group_contact_cell", "");
            cur.reloadAfterClose = !0, ajax.post("/al_page.php", {
                act: "a_reorder_contacts",
                oid: e,
                mid: l,
                before: s,
                after: r,
                hash: a
            })
        },
        initStatusEditable: function(e) {
            return e.emojiInited ? !1 : (e.emojiInited = !0, void stManager.add(["emoji.js", "notifier.css"], function() {
                Emoji.init(e, {
                    ttDiff: -48,
                    rPointer: !0,
                    controlsCont: domPN(e),
                    noStickers: !0,
                    forceEnterSend: !0,
                    onSend: Page.infoSave,
                    checkEditable: function() {
                        var a = Emoji.editableVal(e),
                            t = 140;
                        a.length > t && (Emoji.val(e, clean(a.substr(0, t))), Emoji.editableFocus(e, !1, !0))
                    }
                })
            }))
        },
        infoEdit: function(e) {
            if (cur.viewAsBox) return cur.viewAsBox();
            var a = ge("current_info")
                .tt;
            a && a.hide && a.hide({
                    fasthide: !0
                }), show("currinfo_editor", "currinfo_fake"), hide("currinfo_wrap"), isVisible("currinfo_app") && !cur.ciApp ? (show("currinfo_audio"), hide("currinfo_app")) :
                cur.ciApp && (hide("currinfo_audio"), show("currinfo_app"));
            var t = ge("current_info")
                .firstChild,
                o = ge("currinfo_input"),
                i = geByTag1("a", t);
            if (Page.initStatusEditable(o, cur.infoOld), cur.infoEditing = "my_current_info" == t.className, cur.infoEditing) {
                var l = i ? i.innerHTML : t.innerHTML;
                l = l.replace(/<img[^>]+alt="([^"]+)"[^>]*>/g, "$1"), cur.infoOld = trim(clean(stripHTML(l)))
            } else cur.infoOld = "";
            window.Emoji ? (Emoji.val(o, winToUtf(cur.infoOld)), Emoji.editableFocus(o, !1, !0, !0)) : (val(o, winToUtf(cur.infoOld)), elfocus(o)), addEvent(window, "keydown",
                    Page.infoKeydown), addEvent(document, "mousedown", Page.infoMousedown), ge("currinfo_save")
                .onclick = Page.infoSave
        },
        infoCancel: function() {
            hide("currinfo_editor", "currinfo_fake"), show("currinfo_wrap"), cleanElems("currinfo_save", "currinfo_cancel"), removeEvent(window, "keydown", Page.infoKeydown),
                removeEvent(document, "mousedown", Page.infoMousedown), cur.ciApp = !1
        },
        infoShowShare: function() {
            if (cur.viewAsBox) return cur.viewAsBox();
            var e = ge("current_info"),
                a = getLang("share_current_info");
            showTooltip(e, {
                content: '<div class="content"><div class="checkbox">' + a + "</div></div>",
                className: "share_tt",
                init: function() {
                    addEvent(geByClass1("checkbox", e.tt.container), "click", function() {
                        checkbox(this), ajax.post("al_page.php", {
                            act: "share_currinfo",
                            hash: cur.options.info_hash,
                            oid: cur.oid,
                            checked: isChecked(this)
                        }, {
                            onDone: Wall.receive
                        })
                    })
                },
                toup: !1,
                showdt: 0,
                slide: 10,
                shift: [6, 8, 8],
                dir: "auto",
                hidedt: 200,
                onClean: function() {
                    cleanElems(geByClass1("checkbox", e.tt.container))
                }
            })
        },
        infoKeydown: function(e) {
            e.keyCode == KEY.ESC && Page.infoCancel()
        },
        infoMousedown: function(e) {
            for (var a = e.target; a.parentNode;) {
                if ("currinfo_editor" == a.id) return;
                a = a.parentNode
            }
            Page.infoCancel()
        },
        infoSave: function() {
            if (cur.viewAsBox) return cur.viewAsBox();
            var e = ge("currinfo_input"),
                a = trim((window.Emoji ? Emoji.editableVal : val)(e))
                .replace(/\n/g, " ");
            return a == cur.infoOld || a == winToUtf(cur.infoOld) ? Page.infoCancel() : (a = trim(a)
                .substr(0, 140), void ajax.post("al_page.php", {
                    act: "current_info",
                    oid: cur.oid,
                    info: a,
                    hash: cur.options.info_hash
                }, {
                    onDone: function() {
                        var e = a ? "my" : "no",
                            t = a ? '<span class="current_text">' + Emoji.emojiToHTML(a.replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/"/g, "&quot;"), !0) + "</span>" : getLang("change_current_info");
                        ge("current_info")
                            .innerHTML = ge("currinfo_fake")
                            .innerHTML = '<span class="' + e + '_current_info">' + t + "</span>", Page.infoCancel();
                        var o = ge("current_info"),
                            i = o.tt;
                        i && i.el && (i.destroy(), removeEvent(o, "mouseover")), a && (addEvent(o, "mouseover", Page.infoShowShare), Page.infoShowShare())
                    },
                    onFail: function(e) {
                        return e ? void 0 : !0
                    },
                    showProgress: lockButton.pbind("currinfo_save"),
                    hideProgress: unlockButton.pbind("currinfo_save"),
                    stat: ["tooltips.js", "tooltips.css", "emoji.js"]
                }))
        },
        mentionInit: function(e) {},
        showGif: function(e, a, t) {
            if (a && (a.ctrlKey || a.metaKey)) return !0;
            cur.gifAdded = cur.gifAdded || {}, (cur.activeGif && domPN(domPN(cur.activeGif)) == domPN(domPN(e)) || hasClass(domPN(cur.activeGif), "page_gif_large") && !t) &&
                Page.hideGif(cur.activeGif, !1);
            var o, i = e.getAttribute("data-doc"),
                l = e.getAttribute("data-hash"),
                s = e.getAttribute("data-add-txt") || "",
                r = e.getAttribute("data-add-hash"),
                n = e.getAttribute("data-share-txt") || "",
                d = e.getAttribute("data-post"),
                c = e.getAttribute("data-reply"),
                p = e.getAttribute("data-preview"),
                u = e.getAttribute("data-width"),
                _ = e.getAttribute("data-height"),
                h = !1,
                g = hasClass(domPN(e), "page_gif_large"),
                m = !a;
            if (d) {
                var w, f, v;
                v = d.split("_"), w = v[0], f = v[1], statlogsValueEvent("show_post_gif", 1, w, f)
            }
            if (p) {
                var b = ce("video");
                b.canPlayType && b.canPlayType("video/mp4")
                    .replace("no", "") && (h = !0)
            }
            var y = e.href + "&wnd=1&module=" + cur.module;
            h ? (o = ce("video", {
                autoplay: !0,
                loop: "loop",
                poster: e.getAttribute("data-thumb"),
                className: "pages_gif_img page_gif_big"
            }, {
                width: u ? u + "px" : null,
                height: _ ? _ + "px" : null,
                background: g ? "transparent url(" + e.getAttribute("data-thumb") + ") no-repeat 0 0" : "",
                backgroundSize: "cover"
            }), o.appendChild(ce("source", {
                type: "video/mp4",
                src: y + "&mp4=1"
            }))) : o = ce("img", {
                src: y,
                className: "pages_gif_img"
            }, {
                width: u ? u + "px" : null,
                height: _ ? _ + "px" : null
            });
            var k = '<div class="page_gif_share" onmouseover="showTooltip(this, {text: \'' + n +
                "', black: 1, shift: [7, 6, 6], toup: 0, needLeft: 1})\" onclick=\"return Page.shareGif(this, '" + i + "', '" + l +
                '\', event)"><div class="page_gif_share_icon"></div></div>';
            r && (k += '<div class="page_gif_add" onmouseover="return Page.overGifAdd(this, \'' + s + "', '" + i + "', event);\" onclick=\"return Page.addGif(this, '" + i +
                "', '" + l + "', '" + r + '\', event);"><div class="page_gif_add_icon"></div></div>'), k = '<div class="page_gif_actions">' + k + "</div>";
            var C = '<div class="page_gif_progress_icon" style="display:none;">' + rs(vk.pr_tpl, {
                    id: "",
                    cls: ""
                }) + "</div>",
                x = ce("a", {
                    href: e.href,
                    className: "page_gif_preview" + (cur.gifAdded[i] ? " page_gif_added" : ""),
                    innerHTML: C + (g ? '<div class="page_gif_label">gif</div>' : "") + k,
                    onclick: cancelEvent
                }, {
                    background: h ? "" : (getStyle(domFC(e), "background") || "")
                        .replace(/"/g, "'"),
                    width: u ? u + "px" : "",
                    height: _ ? _ + "px" : ""
                });
            x.appendChild(o), cur.activeGif = x, domPN(e)
                .insertBefore(x, e), hide(e);
            var S = !1,
                P = function() {
                    (getSize(o)[0] || getSize(o)[1]) && (clearInterval(T), o.onload = o.onloadeddata = null, S = !0, hide(domFC(x)), x.style.background = "", x.setAttribute(
                        "onclick", "return Page.hideGif(this, event);"), addClass(o, "page_gif_big"), addClass(x, "page_gif_loaded"), statlogsValueEvent("gif_play", 0, h ?
                        "mp4" : "gif"))
                };
            if (a ? show(domFC(x)) : setTimeout(function() {
                    S || show(domFC(x))
                }, 300), h) o.onloadeddata = P;
            else {
                var T = setInterval(P, 10);
                o.onload = P
            }
            domPN(e)
                .setAttribute("data-playing", 1);
            var L = m ? "autoplay" : "manual",
                M = cur.module || "other",
                E = d ? "post" : c ? "reply" : "";
            return statlogsValueEvent("gif_show", L, M, E), cancelEvent(a)
        },
        hideGif: function(e, a) {
            if (a && (a.ctrlKey || a.metaKey)) return !0;
            var t = domPN(e),
                o = domNS(e);
            return t.removeAttribute("data-playing"), a && removeClass(t, "page_gif_autoplay"), re(e), show(o), delete cur.activeGif, !1
        },
        overGifAdd: function(e, a, t, o) {
            return cur.gifAdded = cur.gifAdded || {}, cur.gifAdded[t] && (a = cur.gifAdded[t].tooltip, !a) ? !1 : (showTooltip(e, {
                text: a,
                black: 1,
                shift: [7, 6, 6],
                toup: 0,
                needLeft: 1
            }), !1)
        },
        addGif: function(e, a, t, o, i) {
            cur.gifAdded = cur.gifAdded || {}, e.tt && e.tt.hide();
            var l = gpeByClass("page_gif_large", e) || domPN(e);
            return cur.gifAdded[a] ? ajax.post("docs.php", {
                act: "a_delete",
                oid: vk.id,
                did: cur.gifAdded[a].did,
                hash: cur.gifAdded[a].hash
            }, {
                onDone: function() {
                    removeClass(l, "page_gif_added"), e.tt && e.tt.el && e.tt.destroy(), delete cur.gifAdded[a]
                }
            }) : (addClass(e, "page_gif_adding"), ajax.post("docs.php", {
                act: "a_add",
                doc: a,
                hash: t,
                add_hash: o
            }, {
                onDone: function(t, o, i, s) {
                    showDoneBox(t), addClass(l, "page_gif_added"), e.tt && e.tt.el && e.tt.destroy(), cur.gifAdded[a] = {
                        tooltip: o,
                        did: i[0],
                        hash: s
                    }
                }
            })), cancelEvent(i)
        },
        shareGif: function(e, a, t, o) {
            return e.tt && e.tt.hide(), showBox("like.php", {
                act: "publish_box",
                object: "doc" + a,
                list: t
            }, {
                stat: ["wide_dd.js", "wide_dd.css", "sharebox.js"]
            }), cancelEvent(o)
        },
        actionsDropdown: function(e, a) {
            return !e && a ? void a() : void show(e)
        },
        actionsDropdownHide: function(e, a) {
            return 1 === a ? hide(e) : (clearTimeout(cur.actDdHide), void(cur.actDdHide = setTimeout(function() {
                fadeOut(e, 200, hide.pbind("page_actions_sublist"))
            }, 150)))
        },
        actionsDropdownUnhide: function() {
            clearTimeout(cur.actDdHide)
        },
        actionsPreloadFeedLists: function(el, sh) {
            ajax.post("al_feed.php", {
                act: "a_get_lists_by_item",
                item_id: cur.oid
            }, {
                onDone: function(html, js) {
                    sh && (ge("page_actions_wrap") || (domPN(el)
                        .insertBefore(se(html), el), eval(js)))
                },
                cache: 1
            })
        },
        feedListsDDShow: function() {
            var e = ge("page_actions_item_lists");
            if (addClass(e, "page_actions_item_unfolded"), ge("page_actions_sublist")) return clearTimeout(cur.feedListsDDHide), void show("page_actions_sublist");
            var a = [];
            for (var t in cur.options.feedLists) {
                var o = cur.options.feedLists[t];
                o.length > 20 && (o = trim(o.substr(0, 18)) + "..."), a.push('<a id="page_feed_item' + t + '" class="page_actions_item page_actions_subitem' + (cur.options.feedListsSet &&
                    cur.options.feedListsSet[t] ? " checked" : "") + '" onclick="Page.feedListsCheck(this, ' + t + ');">' + o + "</a>")
            }
            a = se('<div id="page_actions_sublist" onmouseover="Page.feedListsDDShow();">' + a.join("") + "</div>"), domPN(e)
                .appendChild(a)
        },
        feedListsDDHide: function() {
            clearTimeout(cur.feedListsDDHide), cur.feedListsDDHide = setTimeout(function() {
                hide("page_actions_sublist"), removeClass("page_actions_item_lists", "page_actions_item_unfolded")
            }, 150)
        },
        feedListsCheck: function(e, a) {
            var t = hasClass(e, "checked");
            t ? (cur.options.feedListsSet[a] = 0, cur.options.feedListsChanges[a] = -1) : (cur.options.feedListsSet[a] = 1, cur.options.feedListsChanges[a] = 1), toggleClass(e,
                "checked", !t), cur.feedListsTO && clearTimeout(cur.feedListsTO);
            var o = [];
            for (var i in cur.options.feedListsChanges) o.push(cur.options.feedListsChanges[i] * i);
            o.length && (cur.feedListsTO = setTimeout(function() {
                ajax.post("al_feed.php", {
                    act: "a_toggle_lists",
                    item_id: cur.oid,
                    lists_ids: o.join(","),
                    hash: cur.options.feedListsHash
                }, {
                    onDone: function() {
                        cur.options.feedListsChanges = {}
                    }
                })
            }))
        },
        addAudioPreview: function(e, a) {
            if (stManager.add(["audioplayer.css", "audioplayer.js"]), isObject(a)) {
                var t = e.split("_"),
                    o = a.info.split(",");
                a = [e, t[0], o[0], a.title, a.performer, intval(o.length > 1 ? o[1] : a.duration), 0, 0, "", 0, 0, 0, 0]
            }
            return AudioUtils.drawAudio(a, !0)
        }
    },
    page = Page,
    Wall = {
        deleteAll: function(e, a, t) {
            ajax.post("al_wall.php", {
                act: "delete_all",
                post: a,
                hash: t
            }, {
                onDone: function(a) {
                    var t = domPN(domPN(e));
                    t.oldt = val(t), val(t, a)
                },
                showProgress: function() {
                    hide(e), show(domNS(e) || domPN(e)
                        .appendChild(ce("div", {
                            className: "progress"
                        })))
                },
                hideProgress: function() {
                    show(e), re(domNS(e))
                }
            })
        },
        restoreAll: function(e, a, t) {
            var o = cur.wallRnd = Math.floor(1e5 * Math.random());
            ajax.post("al_wall.php", {
                act: "restore_all",
                post: a,
                hash: t,
                rnd: o
            }, {
                onDone: function(a) {
                    var t = domPN(e);
                    val(t, t.oldt)
                },
                showProgress: function() {
                    hide(e), show(domNS(e) || domPN(e)
                        .appendChild(ce("span", {
                            className: "progress_inline"
                        })))
                },
                hideProgress: function() {
                    show(e), re(domNS(e))
                }
            })
        },
        block: function(e, a, t, o) {
            ajax.post("al_wall.php", {
                act: "block",
                post: a,
                hash: t,
                bl: o
            }, {
                onDone: function(a) {
                    o ? (domPN(e)
                        .insertBefore(ce("div", {
                            innerHTML: a
                        }), e), hide(e)) : (show(domNS(domPN(e))), re(domPN(e)))
                },
                showProgress: function() {
                    var a = o ? ce("div", {
                        className: "progress"
                    }) : ce("span", {
                        className: "progress_inline"
                    });
                    hide(e), show(domNS(e) || domPN(e)
                        .appendChild(a))
                },
                hideProgress: function() {
                    show(e), re(domNS(e))
                }
            })
        },
        blockEx: function(e, a) {
            showBox("groupsedit.php", {
                act: "bl_edit",
                name: "id" + a,
                gid: e,
                auto: 1
            }, {
                stat: ["page.css", "ui_controls.js", "ui_controls.css"],
                dark: 1
            })
        },
        withMentions: !(browser.mozilla && browser.version.match(/^2\./) || browser.mobile),
        editPost: function(e, a, t, o) {
            if (cur.editingPost && ge("wpe_text")) {
                var i = gpeByClass("wall_posts", ge("wpe_text"));
                if (!i || isVisible(i)) return t && t(), notaBene("wpe_text");
                Wall.cancelEdit()
            }
            cur.editingPost = [e], Wall.withMentions ? stManager.add(["ui_controls.css", "ui_controls.js", "mentions.js", "walledit.js"]) : stManager.add(["walledit.js"]),
                ajax.post("al_wall.php", extend({
                    act: "edit",
                    post: e,
                    mention: Wall.withMentions ? 1 : ""
                }, a), {
                    onDone: function() {
                        var a = Array.prototype.slice.call(arguments);
                        a.unshift(e), WallEdit.editPost.apply(window, a), o && o()
                    },
                    onFail: function() {
                        cur.editingPost = !1, t && t()
                    },
                    showProgress: function() {
                        lockButton("wpe_edit" + e), lockButton("post_publish" + e), addClass(geByClass1("post_actions", "post" + e), "post_actions_progress")
                    },
                    hideProgress: function() {
                        unlockButton("wpe_edit" + e), unlockButton("post_publish" + e), removeClass(geByClass1("post_actions", "post" + e), "post_actions_progress")
                    }
                })
        },
        fixPost: function(link, post, hash, value) {
            return ajax.post("al_wall.php", {
                act: "a_fix_post",
                post: post,
                hash: hash,
                value: value
            }, {
                onDone: function(js) {
                    js && eval(js);
                    var postEl = cur.wallLayer == post ? ge("wl_post") : ge("post" + post);
                    each(geByClass("post_fixed"), function() {
                        removeClass(this, "post_fixed")
                    }), toggleClass(postEl, "post_fixed", value), link && (val(link, getLang(value ? "wall_unfix_post" : "wall_fix_post")), link.onclick =
                        function() {
                            return Wall.fixPost(link, post, hash, value ? 0 : 1)
                        }), cur.onWKFix && (cur.onWKFix(value), delete cur.onWKFix)
                },
                showProgress: lockButton.pbind("wpe_fix" + post),
                hideProgress: unlockButton.pbind("wpe_fix" + post)
            }), !1
        },
        cancelEdit: function(e) {
            if (cur.editingPost) {
                if (e === !0 && cur.editingPost[0].match(/^-?\d+_/)) return;
                window.WallEdit ? WallEdit.cancelEditPost() : cur.editingPost = !1
            }
        },
        searchWall: function() {},
        switchTabContent: function(e) {
            switch (hide("page_wall_posts", "page_postponed_posts", "page_suggested_posts", "page_search_posts"), e) {
                case "own":
                case "all":
                    show("page_wall_posts");
                    break;
                case "postponed":
                    show("page_postponed_posts"), hide("wall_more_link");
                    break;
                case "suggested":
                    show("page_suggested_posts");
                    break;
                case "search":
                    show("page_search_posts")
            }
        },
        switchWall: function(e, a, t) {
            if (a && checkEvent(a)) return !0;
            var o = {
                all: 0,
                own: 0
            };
            ge("page_wall_switch");
            return ge("page_wall_count_all") && (o.all = intval(ge("page_wall_count_all")
                    .value)), ge("page_wall_count_own") && (o.own = intval(ge("page_wall_count_own")
                    .value)), t || (t = "own" == cur.wallType ? "all" : "own"), a && "click" == a.type && a.clientX && cur.wallTab == t && cur.wallType == t ? nav.go(e, a) : !
                o.own && inArray(cur.wallTab, ["all", "own"]) ? cancelEvent(a) : (replaceClass("page_wall_posts", cur.wallType, t), cur.wallType = t, Wall.update(), uiTabs.switchTab(
                    e), uiTabs.hideProgress(e), wall.switchTabContent(t), cur.wallTab = t, cancelEvent(a))
        },
        showSuggested: function(e, a, t, o) {
            if (a && checkEvent(a)) return !0;
            if (!cur.oid) return !1;
            if (uiTabs.switchTab(e), cur.wallTab = "suggested", void 0 !== t) wall.suggestLoaded(t, o);
            else {
                if (cur.suggestedLoading) return !1;
                var i = cur.suggestedLoading = cur.oid;
                uiTabs.showProgress(e), ajax.post("al_wall.php", {
                    act: "get_suggests",
                    owner_id: cur.oid
                }, {
                    onDone: function(a, t) {
                        cur.suggestedLoading = !1, uiTabs.hideProgress(e), i === cur.oid && "suggested" == cur.wallTab && wall.suggestLoaded.apply(window,
                            arguments)
                    }
                })
            }
            return !1
        },
        suggestLoaded: function(e, a) {
            val("page_suggested_posts", e), toggle("wall_more_link", a), wall.switchTabContent("suggested")
        },
        suggestMore: function() {
            var e = ge("page_suggested_posts"),
                a = ge("wall_more_link");
            buttonLocked(a) || ajax.post("al_wall.php", {
                act: "get_suggests",
                owner_id: cur.oid,
                offset: geByClass("post", e)
                    .length - geByClass("dld", e)
                    .length
            }, {
                onDone: function(t, o) {
                    for (var i = ce("div", {
                            innerHTML: t
                        }), l = domFC(i); l;) ge(l.id) || !hasClass(l, "post") ? re(l) : e.appendChild(l), l = domFC(i);
                    toggle(a, o)
                },
                showProgress: lockButton.pbind(a),
                hideProgress: unlockButton.pbind(a)
            })
        },
        suggestUpdate: function(e) {
            var a = ge("page_suggests_count"),
                t = intval(val(a));
            !a || -1 !== e && 1 !== e || val(a, t += e)
        },
        suggestPublished: function(e, a) {
            if (cur.onepost) return nav.go("/wall" + cur.oid);
            if (Wall.suggestUpdate(-1), showDoneBox(a), cur.wallMyDeleted[e] = 1, ("full_own" == cur.wallType || "full_all" == cur.wallType) && (Pagination.recache(-1),
                    FullWall.updateSummary(cur.pgCount)), intval(val("page_suggests_count"))) re("post" + e);
            else {
                var t = ge("wall_rmenu");
                t ? (geByClass1("ui_rmenu_item", t)
                    .click(), hide(geByClass1("_wall_menu_suggested", t))) : ge("wall_tabs") && (geByClass1("ui_tab", ge("wall_tabs"))
                    .click(), hide("page_wall_suggest"))
            }
        },
        showPostponed: function(e, a, t) {
            if (a && checkEvent(a)) return !0;
            if (!cur.oid) return !1;
            if (uiTabs.switchTab(e), cur.wallTab = "postponed", void 0 !== t) Wall.postponedLoaded(t);
            else {
                if (cur.postponedLoading) return !1;
                var o = cur.postponedLoading = cur.oid;
                uiTabs.showProgress(e), ajax.post("al_wall.php", {
                    act: "get_postponed",
                    owner_id: cur.oid
                }, {
                    onDone: function(a) {
                        cur.postponedLoading = !1, uiTabs.hideProgress(e), o === cur.oid && "postponed" == cur.wallTab && Wall.postponedLoaded(a)
                    }
                })
            }
            return !1
        },
        postponedLoaded: function(e) {
            val("page_postponed_posts", e), wall.switchTabContent("postponed")
        },
        postponedPublished: function(e, a) {
            if (cur.onepost) return nav.go("/wall" + cur.oid);
            ("full_own" == cur.wallType || "full_all" == cur.wallType) && (Pagination.recache(-1), FullWall.updateSummary(cur.pgCount)), a && showDoneBox(a), cur.wallMyDeleted[
                e] = 1;
            var t = geByClass("post", ge("page_postponed_posts")),
                o = ge("post" + e);
            if (t.length <= 1 && inArray(o, t)) {
                var i = ge("wall_rmenu");
                i ? (geByClass1("ui_rmenu_item", i)
                    .click(), hide(geByClass1("_wall_menu_postponed", i))) : ge("wall_tabs") && (geByClass1("ui_tab", ge("wall_tabs"))
                    .click(), hide("page_wall_postponed"))
            } else re(o)
        },
        onWallSearchSend: function(e, a) {
            a ? Wall.showSearch(a, 0) : Wall.hideSearch()
        },
        showSearch: function(e, a) {
            if (cur.searchLoading && cur.searchLoading == e || !cur.oid) return !1;
            var t = cur.oid;
            cur.wallQuery = cur.searchLoading = e, "search" != cur.wallTab && (cur.prevWallTab = cur.wallTab, cur.wallTab = "search");
            var o = ge("wall_more_link");
            return ajax.post("al_wall.php", {
                act: "s",
                search: 1,
                q: e,
                owner_id: cur.oid,
                offset: a,
                inline: 1
            }, {
                onDone: function(i, l, s) {
                    if (t === cur.oid && "search" == cur.wallTab) {
                        var r = ge("page_search_posts");
                        a || val(r, ""), r.appendChild(cf(i)), wall.switchTabContent("search"), toggle(o, s > l), o.onclick = Wall.showSearch.pbind(e, l)
                    }
                },
                showProgress: function() {
                    uiSearch.showProgress("wall_search"), a && lockButton(o)
                },
                hideProgress: function() {
                    cur.searchLoading = !1, uiSearch.hideProgress("wall_search"), a && unlockButton(o)
                }
            }), !1
        },
        hideSearch: function() {
            delete cur.wallQuery, cur.prevWallTab && (cur.wallTab = cur.prevWallTab, cur.prevWallTab = !1, wall.switchTabContent(cur.wallTab), wall.update())
        },
        publishPostponedPost: function(e, a, t) {
            showFastBox(getLang("publish_postponed_title"), getLang("publish_postponed_confirm"), getLang("publish_postponed_btn"), function() {
                curBox()
                    .hide(), ajax.post("al_wall.php", {
                        act: "publish_postponed",
                        post: e,
                        from: t,
                        hash: a
                    }, {
                        onDone: Wall.postponedPublished.pbind(e),
                        showProgress: lockButton.pbind("wpe_publish" + e),
                        hideProgress: unlockButton.pbind("wpe_publish" + e)
                    })
            }, getLang("global_cancel"))
        },
        cmp: function(e, a) {
            var t = e.length,
                o = a.length;
            return o > t ? -1 : t > o ? 1 : a > e ? -1 : e > a ? 1 : 0
        },
        receive: function(e, a) {
            var t = ce("div", {
                    innerHTML: e
                }),
                o = ge("page_wall_posts"),
                i = !!cur.options.revert,
                l = i ? o.firstChild : o.lastChild,
                s = 0;
            for (el = i ? t.firstChild : t.lastChild; el; el = re(i ? t.firstChild : t.lastChild))
                if ("input" != el.tagName.toLowerCase()) {
                    if (!hasClass(el, "post_fixed")) {
                        for (; l && l.tagName && "div" == l.tagName.toLowerCase() && !hasClass(l, "post_fixed") && Wall.cmp(l.id, el.id) < 0;) l = i ? l.nextSibling : l.previousSibling;
                        ++s, l ? Wall.cmp(l.id, el.id) ? i ? o.insertBefore(el, l) : o.insertBefore(el, l.nextSibling) : (o.replaceChild(el, l), l = el, --s) : i ? o.appendChild(
                            el) : o.insertBefore(el, o.firstChild), placeholderSetup(geByTag1("textarea", el), {
                            fast: 1
                        })
                    }
                } else {
                    var r = ge(el.id);
                    r && o.replaceChild(el, r)
                }("full_own" == cur.wallType || "full_all" == cur.wallType) && (Pagination.recache(s), FullWall.updateSummary(cur.pgCount)), Wall.update(), extend(cur.options.reply_names,
                a), Wall.updateMentionsIndex()
        },
        showMore: function(e) {
            if (cur.viewAsBox) return cur.viewAsBox();
            if (!cur.wallLayer) {
                if ("suggested" == cur.wallTab) return Wall.suggestMore();
                var a = cur.wallType,
                    t = ge("wall_more_link"),
                    o = cur.wallLoading = cur.oid;
                ajax.post("al_wall.php", {
                    act: "get_wall",
                    owner_id: cur.oid,
                    offset: e,
                    type: a,
                    fixed: cur.options.fixed_post_id || ""
                }, {
                    onDone: function(e, a, t) {
                        o === cur.oid && (delete cur.wallLoading, setTimeout(Wall.receive.pbind(e, a), 0), cur.wallVideos && each(t, function(e, a) {
                            cur.wallVideos[e] && (cur.wallVideos[e].list = cur.wallVideos[e].list.concat(a.list))
                        }))
                    },
                    showProgress: lockButton.pbind(t),
                    hideProgress: unlockButton.pbind(t)
                })
            }
        },
        checkTextLen: function(e, a, t) {
            var o = trim(Emoji.editableVal(e)
                .replace(/\n\n\n+/g, "\n\n"));
            if (e.lastLen !== o.length || t) {
                var i = e.lastLen = o.length,
                    l = (cur.options || {})
                    .max_post_len || (window.mvcur || {})
                    .maxReplyLength,
                    s = i - o.replace(/\n/g, "")
                    .length;
                a = ge(a), i > l - 100 || s > 4 ? (show(a), i > l ? a.innerHTML = getLang("global_recommended_exceeded", i - l) : s > 4 ? a.innerHTML = getLang(
                    "global_recommended_lines", s - 4) : a.innerHTML = getLang("text_N_symbols_remain", l - i)) : hide(a)
            }
        },
        checkPostLen: function(e, a, t, o) {
            var i = ge(e);
            if (t = trim(t)
                .replace(/\n\n\n+/g, "\n\n"), i && (i.lastLen !== t.length || o)) {
                var l = i.lastLen = t.length,
                    s = cur.options.max_post_len,
                    r = l - t.replace(/\n/g, "")
                    .length,
                    n = ge(a);
                l > s - 100 || r > 4 ? (l > s ? n.innerHTML = getLang("global_recommended_exceeded", l - s) : r > 4 ? n.innerHTML = getLang("global_recommended_lines", r - 4) :
                    n.innerHTML = getLang("text_N_symbols_remain", s - l), show(n)) : hide(n)
            }
        },
        postChanged: function(e) {
            isVisible("submit_post") && hasClass(ge("submit_post_box"), "shown") || Wall.showEditPost(), vk.id && intval(cur.oid) == vk.id && (clearTimeout(cur.postAutosave),
                e === !0 ? Wall.saveDraft() : cur.postAutosave = setTimeout(Wall.saveDraft, 10 === e ? 10 : 1e3))
        },
        saveDraft: function() {
            if (cur.noDraftSave) return void(cur.noDraftSave = !1);
            if (!cur.postSent && vk.id == intval(cur.oid)) {
                var e = cur.wallAddMedia || {},
                    a = e.chosenMedia || {},
                    t = cur.wallAddMedia ? e.getMedias() : [],
                    o = e.shareData || {};
                if (msg = trim((window.Emoji ? Emoji.editableVal : val)(ge("post_field"))), attachI = 0, params = {
                        act: "save_draft",
                        message: msg,
                        hash: cur.options.post_hash
                    }, isArray(a) && a.length && t.push(clone(a)), t.length) {
                    var i = !1;
                    if (each(t, function(a, t) {
                            if (t) {
                                var l = this[0],
                                    s = this[1];
                                switch (l) {
                                    case "poll":
                                        var r = e.pollData(!0);
                                        if (!r) return i = !0, !1;
                                        s = r.media, delete r.media, params = extend(params, r);
                                        break;
                                    case "share":
                                        if (o.failed || !o.url || !o.title && (!o.images || !o.images.length) && !o.photo_url) return cur.shareLastParseSubmitted && vkNow() -
                                            cur.shareLastParseSubmitted < 2e3 ? (i = !0, !1) : void 0;
                                        s = o.user_id && o.photo_id ? o.user_id + "_" + o.photo_id : "", o.initialPattern && trim(msg) == o.initialPattern && (params.message =
                                            ""), params = extend(params, {
                                            url: o.url,
                                            title: replaceEntities(o.title),
                                            description: replaceEntities(o.description),
                                            extra: o.extra,
                                            extra_data: o.extraData,
                                            photo_url: replaceEntities(o.photo_url),
                                            open_graph_data: (o.openGraph || {})
                                                .data,
                                            open_graph_hash: (o.openGraph || {})
                                                .hash
                                        });
                                        break;
                                    case "page":
                                        o.initialPattern && trim(msg) == o.initialPattern && (params.message = "");
                                        break;
                                    case "postpone":
                                        var n = val("postpone_date" + e.lnkId);
                                        return void(params = extend(params, {
                                            postpone: n
                                        }))
                                }
                                this[3] && trim(msg) == this[3] && (params.message = ""), params["attach" + (attachI + 1) + "_type"] = l, params["attach" + (attachI + 1)] =
                                    s, attachI++
                            }
                        }), i) return
                }
                ajax.post("al_wall.php", Wall.fixPostParams(params), {
                    onFail: function() {
                        return !0
                    }
                })
            }
        },
        setDraft: function(e) {
            if (e[0] || e[1]) {
                var a = ge("post_field");
                a && (Emoji.val(a, clean(replaceEntities(e[0] || ""))
                    .replace(/\n/g, "<br/>")), Wall.showEditPost(function() {
                    setTimeout(function() {
                        if (e[1] && cur.wallAddMedia)
                            for (var a in e[1]) cur.noDraftSave = !0, cur.wallAddMedia.chooseMedia.apply(cur.wallAddMedia, e[1][a])
                    }, 0)
                }))
            }
        },
        initPostEditable: function(e) {
            var a = cur.postField;
            return !a || a.emojiInited ? !1 : (a.emojiInited = !0, void stManager.add(["emoji.js", "notifier.css"], function() {
                Emoji.init(a, {
                    ttDiff: -42,
                    rPointer: !0,
                    controlsCont: domPN(a),
                    noStickers: !0,
                    onSend: Wall.sendPost,
                    noEnterSend: !0,
                    checkEditable: Wall.postChanged
                }), addClass(a, "submit_post_inited"), e && setTimeout(Wall.setDraft.pbind(e), 0)
            }))
        },
        showEditPost: function(e) {
            var a = ge("post_field");
            return cur.viewAsBox ? (setTimeout(function() {
                a.blur()
            }, 0), cur.viewAsBox()) : void(0 !== cur.editing && (setTimeout(function() {
                cur.withUpload && (cur.uploadAdded ? WallUpload.show() : (cur.uploadAdded = !0, window.Upload ? WallUpload.init() : stManager.add(["upload.js"],
                    function() {
                        WallUpload.init()
                    })))
            }, 0), Wall.initComposer(a, {
                lang: {
                    introText: getLang("profile_mention_start_typing"),
                    noResult: getLang("profile_mention_not_found")
                },
                checkLen: Wall.postChanged,
                onValueChange: Wall.onPostValChange
            }, e), Wall.hideEditPostReply(), addClass("submit_post_box", "shown"), cur.editing = 0))
        },
        initComposer: function(e, a, t) {
            data(e, "composer") ? t && t() : cur.composerAdded ? (composer = Composer.init(e, a), t && t(), cur.destroy.push(Composer.destroy.bind(Composer)
                .pbind(composer))) : stManager.add(["wide_dd.css", "wide_dd.js"], function() {
                cur.composerAdded = !0, composer = Composer.init(e, a), t && t(), cur.destroy.push(Composer.destroy.bind(Composer)
                    .pbind(composer))
            })
        },
        deinitComposer: function(e) {
            var a = data(e, "composer");
            a && Composer.destroy(a), e.emojiId && window.Emoji && Emoji.destroy(e.emojiId)
        },
        hasComposerMedia: function(e) {
            var a = e && data(e, "composer");
            return a && a.addMedia ? a.addMedia.attachCount() > 0 : !1
        },
        composerListShown: function(e) {
            var a = e && data(e, "composer");
            if (!a) return !1;
            var t = a.wdd,
                o = 0;
            for (var i in t.shown) o += 1;
            return t && isVisible(t.listWrap) && o ? !0 : !1
        },
        onPostValChange: function() {
            cur.wallAddMedia && cur.wallAddMedia.checkMessageURLs.apply(window, arguments), ("full_own" == cur.wallType || "full_all" == cur.wallType) && Pagination.pageTopUpdated()
        },
        hideEditPost: function(e) {
            cur.editing = !1;
            var a = ge("post_field"),
                t = cur.wallAddMedia || {},
                o = trim((window.Emoji ? Emoji.editableVal : val)(a));
            !browser.opera_mobile && a && (e || !(o || t.chosenMedia || t.attachCount && t.attachCount() > 0)) && (removeClass("submit_post_box", "shown"), a && !o && cur.postMention &&
                (cur.postMention.options.minHeight = cur.emptyPostheight || 14), cur.onWallSendCancel && cur.onWallSendCancel(), window.WallUpload && WallUpload.hide(),
                cur.wallAddMedia && cur.wallAddMedia._hideAddMedia(!0))
        },
        clearInput: function() {
            show("page_add_media");
            var e = ge("post_field");
            if (Wall.withMentions) {
                var a = data(e, "mention");
                a && (a.rtaEl.innerHTML = "", hide(a.cont), show(e))
            }
            val(e, ""), e.blur(), e.phonblur(), Wall.hideEditPost(!0), cur.wallAddMedia && cur.wallAddMedia.unchooseMedia(), checkbox("export_status", !1)
        },
        fixPostParams: function(e) {
            var a = clone(e);
            return a.Message = e.message, delete a.message, a
        },
        sendPost: function() {
            var e = cur.wallAddMedia || {},
                a = e.chosenMedia || {},
                t = cur.wallAddMedia ? e.getMedias() : [],
                o = e.shareData || {};
            msg = trim((window.Emoji ? Emoji.editableVal : val)(ge("post_field"))), postponePost = !1;
            var i = cur.options.suggesting ? "suggest" : cur.wallType,
                l = {
                    act: "post",
                    message: msg,
                    to_id: cur.postTo,
                    type: i,
                    friends_only: isChecked("friends_only"),
                    status_export: isChecked("status_export"),
                    facebook_export: ge("facebook_export") ? isChecked("facebook_export") ? 1 : 0 : "",
                    official: isChecked("official"),
                    signed: isChecked("signed"),
                    hash: cur.options.post_hash,
                    from: cur.from ? cur.from : "",
                    fixed: cur.options.fixed_post_id || ""
                },
                s = (cur.postTo == vk.id || l.official || cur.options.only_official, 0);
            if (isArray(a) && a.length && t.push(clone(a)), t.length) {
                var r = !1;
                if (each(t, function(a, t) {
                        if (t) {
                            var i = this[0],
                                n = this[1];
                            switch (i) {
                                case "poll":
                                    var d = e.pollData();
                                    if (!d) return r = !0, !1;
                                    n = d.media, delete d.media, l = extend(l, d);
                                    break;
                                case "share":
                                    if (o.failed || !o.url || !o.title && (!o.images || !o.images.length) && !o.photo_url) return cur.shareLastParseSubmitted && vkNow() -
                                        cur.shareLastParseSubmitted < 2e3 ? (r = !0, !1) : void 0;
                                    if (n = !o.noPhoto && o.user_id && o.photo_id ? o.user_id + "_" + o.photo_id : "", o.images && o.images.length && !o.share_own_image)
                                        return e.uploadShare(Wall.sendPost), r = !0, !1;
                                    o.initialPattern && trim(msg) == o.initialPattern && (l.message = ""), l = extend(l, {
                                        url: o.url,
                                        title: replaceEntities(o.title),
                                        description: replaceEntities(o.description),
                                        extra: o.extra,
                                        extra_data: o.extraData,
                                        photo_url: o.noPhoto ? "" : replaceEntities(o.photo_url),
                                        open_graph_data: (o.openGraph || {})
                                            .data,
                                        open_graph_hash: (o.openGraph || {})
                                            .hash
                                    });
                                    break;
                                case "page":
                                    o.initialPattern && trim(msg) == o.initialPattern && (l.message = "");
                                    break;
                                case "postpone":
                                    var c = val("postpone_date" + e.lnkId);
                                    return l = extend(l, {
                                        postpone: c
                                    }), cur.postponedLastDate = c, void(postponePost = !0)
                            }
                            this[3] && trim(msg) == this[3] && (l.message = ""), l["attach" + (s + 1) + "_type"] = i, l["attach" + (s + 1)] = n, s++
                        }
                    }), r) return
            }
            if (!s && !msg) return void elfocus("post_field");
            var n = ge("send_post");
            n && buttonLocked(n) || (cur.postAutosave && clearTimeout(cur.postAutosave), hide("submit_post_error"), cur.postSent = !0, setTimeout(function() {
                ajax.post("al_wall.php", Wall.fixPostParams(l), {
                    onDone: function(e, a) {
                        if (Wall.clearInput(), cur.postSent = !1, postponePost) return "feed" == i && showDoneBox(e, {
                            out: 3e3
                        }), show("page_wall_postponed"), void Wall.showPostponed(geByClass1("ui_tab", "page_wall_postponed"), !1, e);
                        if (("full_own" == i || "full_all" == i) && cur.pgStart) {
                            var t = clone(nav.objLoc);
                            return delete t.offset, vk.id != cur.oid && delete t.own, nav.go(t)
                        }
                        if (vk.id != cur.oid && "full_own" == i) {
                            var t = clone(nav.objLoc);
                            return delete t.own, nav.go(t)
                        }
                        return "feed" == i ? cur.wallPostCb() : "suggest" == i ? (show("page_wall_suggest"), Wall.showSuggested(geByClass1("ui_tab",
                            "page_wall_suggest"), !1, e, a), Wall.suggestUpdate()) : ("suggested" == cur.wallTab ? Wall.showSuggested(geByClass1(
                            "ui_tab", ge("page_wall_suggest"))) : ge("wall_tabs") && (removeClass(ge("wall_tabs"), "page_tabs_hidden"),
                            geByClass1("ui_tab", ge("wall_tabs"))
                            .click()), Wall.receive(e, a), void(cur.onWallSendPost && cur.onWallSendPost()))
                    },
                    onFail: function(e) {
                        return cur.postSent = !1, e ? (ge("submit_post_error")
                            .innerHTML = e, isVisible("submit_post_error") || slideDown("submit_post_error", 100), !0) : !0
                    },
                    showProgress: function() {
                        lockButton(n)
                    },
                    hideProgress: function() {
                        unlockButton(n)
                    }
                })
            }, 0))
        },
        _repliesLoaded: function(e, a, t, o, i) {
            var l = ge("replies" + e);
            if (l) {
                var s = l.nextSibling,
                    r = vkNow();
                if (a) {
                    var n = l.offsetHeight;
                    l.innerHTML = t, scrollToY(scrollGetY() + (l.offsetHeight - n), 0, void 0, !0), setTimeout(Wall.scrollHighlightReply.pbind("post" + a), 0)
                } else l.innerHTML = t;
                if (debugLog("render in", vkNow() - r), s && "replies_open" == s.className && re(s), ajax._framenext(), e == cur.wallLayer) {
                    var d = wkcur.reverse;
                    extend(wkcur, {
                        offset: !d && i.offset || 0,
                        loaded: i.num || geByClass("reply", l, "div")
                            .length,
                        count: i.count
                    }), extend(wkcur.options.reply_names, o), WkView.wallUpdateReplies(), d || (wkLayerWrap.scrollTop = wkLayerWrap.scrollHeight, WkView.wallUpdateRepliesOnScroll())
                } else extend(cur.options.reply_names, o), Wall.repliesSideSetup(e);
                Wall.updateMentionsIndex(), setTimeout(function() {
                    getAudioPlayer(function(e) {
                        e.updateCurrentPlaying(!0)
                    })
                }, 10)
            }
        },
        repliesSideSetup: function(e) {
            if (cur.wallLayer == e) return void WkView.wallUpdateReplies();
            var a = (ge("post" + e), ge("replies" + e)),
                t = a && geByClass1("wr_header", a, "a"),
                o = (a && a.offsetHeight || 0, window.innerHeight || document.documentElement.clientHeight || bodyNode.clientHeight, ge("replies_side" + e));
            if (cur.wallMyOpened[e] && t) {
                if (!o) {
                    var i = se('<div class="replies_side_wrap"><div id="replies_side' + e + '" class="replies_side"></div></div>');
                    a.parentNode.insertBefore(i, a), o = i.firstChild, o.onclick = Wall.repliesSideClick.pbind(e), o.onmouseover = Wall.repliesSideOver.pbind(e), o.onmouseout =
                        Wall.repliesSideOut.pbind(e)
                }
                show(o), a.onmouseover = Wall.repliesSideOver.pbind(e), a.onmouseout = Wall.repliesSideOut.pbind(e), Wall.repliesSideOver(e)
            } else hide(o), a.onmouseover = null, a.onmouseout = null
        },
        repliesSideClick: function(e) {
            var a = (ge("post" + e), ge("replies" + e)),
                t = (a && geByClass1("wr_header", a, "a"), scrollGetY()),
                o = getXY(a)[1];
            return t > o && scrollToY(o - 100, 0), hide("replies_side" + e), Wall.showReplies(e, 3, !1)
        },
        repliesSideOver: function(e) {
            var a = ge("replies" + e),
                t = ge("replies_side" + e),
                o = getXY(domPN(t))[1],
                i = getSize(t)[1],
                l = getXY(a)[1],
                s = a.offsetHeight,
                r = window.lastWindowHeight || 0,
                n = o + i - r + 15,
                d = l + s - r;
            cur.wallRepliesSideOver = [e, t, n, d], Wall.repliesSideUpdate()
        },
        repliesSideOut: function(e) {
            cur.wallRepliesSideOver && cur.wallRepliesSideOver[0] == e && delete cur.wallRepliesSideOver
        },
        repliesSideUpdate: function(e) {
            var a = cur.wallRepliesSideOver;
            if (a) {
                var t, o = a[1],
                    i = a[4] || {},
                    l = a[5] || "",
                    s = "replies_side";
                void 0 === e && (e = scrollGetY()), e < a[2] ? t = {
                    marginTop: 0,
                    opacity: 1
                } : e < a[3] ? (s += " replies_side_fixed", t = {
                    opacity: Math.max(0, Math.min(1, (a[3] - e) / 200))
                }) : (s += " replies_side_hidden", t = {
                    marginTop: a[3] - a[2],
                    opacity: 0
                }), JSON.stringify(i) !== JSON.stringify(t) && (each(i, function(e, a) {
                    i[e] = null
                }), setStyle(o, extend(i, t)), a[4] = t), l != s && (o.className = s, a[5] = s)
            }
        },
        highlightReply: function(e) {
            e = ge(e), e && (addClass(e, "reply_highlighted"), setTimeout(function() {
                removeClass(e, "reply_highlighted")
            }, 1500))
        },
        scrollHighlightReply: function(e) {
            if (e = ge(e)) {
                if (cur.wallLayer || e.id.match(/^post-?\d+(photo|video|market)?_\d+$/) && (window.wkcur && wkcur.shown || window.mvcur && mvcur.mvShown || cur.pvShown)) {
                    var a = getXY(e, !0)[1];
                    return void(0 > a || a > lastWindowHeight - 200 ? animate(wkLayerWrap, {
                        scrollTop: wkLayerWrap.scrollTop + a - 50
                    }, 300, Wall.highlightReply.pbind(e)) : Wall.highlightReply(e))
                }
                var t = getXY(e),
                    a = t[1],
                    o = scrollGetY() + getSize("page_header")[1];
                o > a ? (scrollToY(a, 300), setTimeout(Wall.highlightReply.pbind(e), 300)) : Wall.highlightReply(e)
            }
        },
        showReply: function(e, a) {
            if (cur.viewAsBox) return !1;
            if (window.mvcur && mvcur.post == e) return Videoview.showComment(a), !1;
            var t = ge("post" + a);
            return t ? Wall.scrollHighlightReply(t) : cur.wallLayer == e ? WkView.wallShowPreviousReplies(a) : e.match(/market/) ? Market.comments(e) : Wall.showReplies(e, !1,
                a), !1
        },
        showReplies: function(e, a, t, o) {
            if (checkEvent(o || window.event)) return !0;
            if (cur.viewAsBox) return cur.viewAsBox();
            if (cur.wallLayer != e || !wkcur.reverse) {
                cur.wallMyOpened[e] = 3 != a;
                var i = {
                        act: "get_replies",
                        post: e,
                        count: a
                    },
                    l = {
                        onDone: Wall._repliesLoaded.pbind(e, t),
                        showProgress: lockButton.pbind("wrh" + e),
                        hideProgress: unlockButton.pbind("wrh" + e),
                        local: 1
                    };
                if (t || a && !(a > 20) || (extend(i, {
                        cont: "replies" + e
                    }), extend(l, {
                        frame: 1
                    }), cur.onFrameBlocksDone = function() {
                        setTimeout(Wall.repliesSideSetup.pbind(e), browser.msie ? 100 : 10)
                    }), ajax.post("al_wall.php", i, l), !browser.msie && a > 0 && 10 > a) {
                    for (var s = ge("replies" + e), r = s && s.lastChild, n = []; n.length < a && r;) "DIV" == r.tagName && hasClass(r, "reply") && n.push(r), r = r.previousSibling;
                    if (n.length == a) {
                        var d = geByClass("reply", s, "div")
                            .length;
                        for (val(s, '<a class="wr_header wrh_all"></a>'), Wall.updateRepliesHeader(e, s.firstChild, a, d), hide("replies_side" + e); n.length;) s.appendChild(n
                            .pop());
                        lockButton("wrh" + e)
                    }
                }
                return !1
            }
        },
        moreReplies: function(e, a, t, o) {
            var i = {
                act: "get_replies",
                offset: a,
                post: e,
                count: t
            };
            return extend(i, {
                rev: o.rev,
                from: o.from
            }), ajax.post("al_wall.php", i, {
                onDone: function(a, t, i) {
                    var l = ge("replies" + e);
                    o.clear ? l.innerHTML = a : o.rev || o.append ? l.appendChild(cf(a)) : l.innerHTML = a + l.innerHTML, extend((e == cur.wallLayer ? wkcur : cur)
                        .options.reply_names, t), o.onDone && o.onDone(a, t, i), Wall.updateMentionsIndex()
                },
                showProgress: o.showProgress,
                hideProgress: o.hideProgress
            }), !1
        },
        emojiOpts: {},
        getReplyName: function(e) {
            if (cur.pvShown && cur.pvReplyNames) return cur.pvReplyNames[e] || [];
            if (window.mvcur && mvcur.mvShown) return mvcur.mvReplyNames[e] || [];
            var a, t = {};
            return t = cur.wallLayer ? wkcur : cur, a = (t.options || {})
                .reply_names, a = a || {}, a[e] || []
        },
        emojiShowTT: function(e, a, t) {
            return void 0 === Wall.emojiOpts[e] ? !1 : Emoji.ttShow(Wall.emojiOpts[e], a, t)
        },
        emojiHideTT: function(e, a, t) {
            return void 0 === Wall.emojiOpts[e] ? !1 : Emoji.ttHide(Wall.emojiOpts[e], a, t)
        },
        initReplyEditable: function(e, a, t, o) {
            return e.emojiInited ? !1 : (e.emojiInited = !0, void stManager.add(["emoji.js", "notifier.css"], function() {
                var i = Emoji.init(e, {
                    ttDiff: o ? -40 : -42,
                    rPointer: !0,
                    controlsCont: a,
                    shouldFocus: !0,
                    onSend: function() {
                        Wall.sendReply(t), e.blur()
                    },
                    ctrlSend: function() {
                        return Wall.customCur()
                            .wallTpl.reply_multiline || Wall.composerListShown(e)
                    },
                    checkEditable: Wall.checkTextLen.pbind(e, "reply_warn" + t),
                    onStickerSend: function(e) {
                        Wall.sendReply(t, !1, {
                            stickerId: e
                        })
                    }
                });
                if (Wall.emojiOpts[t] = i, cur.afterEmojiInit && cur.afterEmojiInit[t]) {
                    var l = geByClass1("emoji_smile", Emoji.opts[i].controlsCont);
                    isVisible(l) && (cur.afterEmojiInit[t](), delete cur.afterEmojiInit[t])
                }
            }))
        },
        showEditReply: function(e, a, t) {
            if (cur.viewAsBox) return setTimeout(function() {
                ge("reply_field" + e)
                    .blur()
            }, 0), cur.viewAsBox();
            var o = ge("reply_field" + e),
                i = cur.wallLayer ? ge("wl_reply_form_inner") : ge("post" + e),
                l = ge("reply_fakebox" + e),
                s = ge("reply_box" + e);
            if (!i && l ? i = gpeByClass("_post_wrap", l) : !i && s && (i = gpeByClass("_post_wrap", s)), l) {
                var r = ge("post_hash" + e),
                    n = intval(r && r.getAttribute("can_reply_as_group")) > 0,
                    d = l.getAttribute("data-owner-photo") || (geByClass1("post_img", i) || {})
                    .src || "";
                s = se(rs(cur.wallTpl.reply_form, {
                    add_buttons: n ? rs(cur.wallTpl.reply_form_official, {
                        post_id: e,
                        owner_photo: d
                    }) : "",
                    post_id: e,
                    owner_photo: d
                })), l.parentNode.replaceChild(s, l), o = ge("reply_field" + e)
            }
            if (Wall.initReplyEditable(o, s, e, t), cur.editing === e) return Emoji.editableFocus(o, !1, !0), cancelEvent(a);
            if (Wall.hideEditPostReply(), addClass(i, "reply_box_open"), setStyle("replies_wrap" + e, {
                    display: ""
                }), cur.editing = e, window.Emoji && setTimeout(Emoji.editableFocus.pbind(o, !1, !0), 0), !data(o, "composer")) {
                var c, p = [];
                c = window.mvcur && mvcur.mvShown ? mvcur.mvMediaTypes : cur.wallLayer == e ? wkcur.options.rmedia_types : cur.options.rmedia_types, each(c || cur.options.media_types ||
                    [],
                    function() {
                        inArray(this[0], ["photo", "video", "audio", "doc", "link", "page"]) && p.push(this)
                    });
                var u;
                p.length > 0 && e.match(/^-?\d+_(photo|video|topic|market)?\d+(mv)?$/) ? (u = {
                    lnk: ge("reply_add_media_" + e),
                    preview: ge("reply_media_preview" + e),
                    types: p,
                    options: {
                        limit: 2,
                        disabledTypes: ["album"],
                        toggleLnk: !0
                    }
                }, e.match(/^-?\d+_topic/) && extend(u.options, {
                    disabledTypes: ["album", "share", "link", "page"],
                    limit: 10,
                    editable: 1,
                    sortable: 1,
                    teWidth: 280,
                    teHeight: 200
                })) : re("reply_add_media_" + e), Wall.initComposer(o, {
                    lang: {
                        introText: getLang("profile_mention_start_typing"),
                        noResult: getLang("profile_mention_not_found")
                    },
                    wddClass: "reply_composer_dd",
                    width: getSize(o.parentNode)[0],
                    media: u
                })
            }
            return triggerEvent(window, "scroll"), void 0 !== o.emojiId && cur.afterEmojiInit && cur.afterEmojiInit[e] && (cur.afterEmojiInit[e](), delete cur.afterEmojiInit[e]),
                cur.wallTpl && cur.wallTpl.reply_multiline_intro && ajax.post("al_wall.php", {
                    act: "a_ctrl_submit_intro",
                    hash: cur.wallTpl.poll_hash
                }, {
                    onDone: function(a) {
                        a && cur.editing === e && Wall.replySubmitTooltip(e, 1)
                    },
                    onFail: function() {
                        return !0
                    }
                }), window.mvcur && mvcur.post == e && Videoview.updateReplyFormPos(), cur.onReplyFormSizeUpdate && isFunction(cur.onReplyFormSizeUpdate) && cur.onReplyFormSizeUpdate(
                    o), cancelEvent(a)
        },
        hideEditReply: function(e) {
            cur.editing = !1;
            var a, t = ge("reply_field" + e),
                o = cur.wallLayer ? ge("wl_reply_form_inner") : ge("post" + e),
                i = ge("reply_box" + e),
                l = cur.reply_to && Wall.getReplyName(cur.reply_to[0]),
                s = trim(window.Emoji ? Emoji.editableVal(t) : ""),
                r = Wall.hasComposerMedia(t);
            if (!o && i && (o = gpeByClass("_post_wrap", i)), t && !r && (l && isArray(l) && (s && l[1].indexOf(s) || (val(t, ""), s = "")), !(browser.opera_mobile || browser.safari_mobile ||
                    s))) {
                removeClass(o, "reply_box_open"), (a = ge("reply_link" + e)) && hide("replies_wrap" + e), t.blur(), triggerEvent(window, "scroll"), val("reply_to" + e, ""),
                    hide("reply_to_title" + e), cur.reply_to = !1, cur.onReplyFormSizeUpdate && cur.onReplyFormSizeUpdate();
                var n = cur.replySubmitSettings;
                n && n.tt && n.tt.el && n.tt.destroy()
            }
        },
        replyNamesRE: function() {
            var e = ((cur.wallLayer ? wkcur : cur)
                    .options || {})
                .reply_names;
            if (!e) return !1;
            var a = [];
            return each(e, function() {
                a.push(escapeRE(this[1]))
            }), new RegExp("^(" + a.join("|") + ")")
        },
        replyTo: function(e, a, t, o) {
            var i = window.cur.wallLayer == e ? wkcur : window.cur;
            Wall.showEditReply(e, o), val("reply_to" + e, a);
            var l = i.reply_to && Wall.getReplyName(i.reply_to[0]);
            i.reply_to = [t, a];
            var s = Wall.getReplyName(t),
                r = ge("reply_as_group" + e),
                n = e.match(/^(-?\d+)_([a-z]+)?(\d+)([a-z]+)?$/),
                d = n[1],
                c = n[2] || "",
                p = n[4] || "",
                u = ge("post" + d + c + "_" + a),
                _ = u && geByClass1("reply_to", u, "a"),
                h = Wall.replyNamesRE(),
                g = isArray(s) ? s[0] : s;
            g = '<a class="reply_to_mem" onclick="return wall.showReply(\'' + e + "', '" + d + c + "_" + a + p + "');\">" + g + "</a>";
            var m = '<span class="reply_to_cancel" onclick="return Wall.cancelReplyTo(\'' + e + '\', event);"></span><div class="reply_to_label">' + langStr(getLang(
                "global_reply_to"), "user", g) + "</div>";
            if (val("reply_to_title" + e, m), isArray(s) && window.Emoji) {
                var w = ge("reply_field" + e),
                    f = trim(Emoji.val(w));
                f = f.replace(/&nbsp;/g, " "), !f || l && isArray(l) && !winToUtf(l[1])
                    .indexOf(f) ? Emoji.val(w, s[1]) : h && (f = f.replace(h, s[1]), Emoji.val(w, f)), Emoji.focus(w, !0)
            }
            return show("reply_to_title" + e), toggleClass(r, "on", r && isVisible(r.parentNode) && 0 > d && _ && _.getAttribute("rid") === d ? !0 : !1), i.onReplyFormSizeUpdate &&
                i.onReplyFormSizeUpdate(), stopEvent(o), !1
        },
        cancelReplyTo: function(e, a) {
            var t = window.cur.wallLayer == e ? wkcur : window.cur,
                o = ge("reply_field" + e),
                i = t.reply_to && Wall.getReplyName(t.reply_to[0]),
                l = trim(window.Emoji ? Emoji.editableVal(o) : ""),
                s = Wall.replyNamesRE();
            return isArray(i) && window.Emoji && (l && i[1].indexOf(l) ? s && (l = l.replace(s, ""), Emoji.val(o, l)) : (l = "", Emoji.val(o, l)), Emoji.focus(o, !0)), val(
                "reply_to" + e, ""), hide("reply_to_title" + e), window.mvcur && mvcur.post == e ? mvcur.mvReplyTo = !1 : t.reply_to = !1, stopEvent(a), !1
        },
        replySubmitTooltip: function(e, a, t) {
            var o = e && window.cur.wallLayer == e ? wkcur : window.cur,
                i = e && ge("reply_box" + e),
                l = i && geByClass1("button_blue", i, "div"),
                s = o.replySubmitSettings;
            if (!(t && l && isVisible(l) || (t = t || l, hasClass(t, "flat_button") && buttonLocked(t)))) {
                if (s || (s = o.replySubmitSettings = ce("div", {
                        className: "reply_submit_hint_tt_point"
                    })), !a) return void(s && s.tt && s.tt.hide && s.tt.hide());
                if (s.parentNode == t && s.tt && s.tt.show) return void s.tt.show();
                s.tt && s.tt.el && s.tt.destroy(), t.insertBefore(s, t.firstChild);
                var r = Wall.customCur()
                    .wallTpl.reply_multiline ? 1 : 0,
                    n = rs(Wall.customCur()
                        .wallTpl.reply_multiline_hint, {
                            enabled: r ? "on" : "",
                            disabled: r ? "" : "on"
                        });
                showTooltip(s, {
                    text: n,
                    typeClass: "tt_default_right",
                    slide: 15,
                    shift: [0, 8],
                    asrtl: 1,
                    hasover: 1,
                    toup: !1,
                    showdt: 700,
                    hidedt: 700,
                    dir: "auto",
                    noZIndex: !0,
                    onCreate: function() {
                        radioBtns.reply_submit = {
                            els: Array.prototype.slice.apply(geByClass("radiobtn", ge("reply_submit_hint_opts"))),
                            val: n ? 1 : 0
                        }
                    }
                })
            }
        },
        onReplySubmitChanged: function(e, a) {
            if (cur.wallTpl.reply_multiline = e, a) {
                var t = cur.replySubmitSettings;
                t && t.tt && t.tt.el && t.tt.destroy()
            } else ajax.post("al_wall.php", {
                act: "a_save_ctrl_submit",
                value: e,
                hash: cur.wallTpl.poll_hash
            }), window.Notifier && Notifier.lcSend("wall_reply_multiline", {
                value: e
            })
        },
        onReplySubmit: function(e, a) {
            var t = (window.cur.wallLayer == e ? wkcur : window.cur, ge("reply_field" + e));
            if (a.keyCode == KEY.RETURN || 10 == a.keyCode) {
                var o = data(t, "composer"),
                    i = o && o.wdd && o.wdd.listWrap && isVisible(o.wdd.listWrap);
                if (Wall.customCur()
                    .wallTpl.reply_multiline && (a.ctrlKey || browser.mac && a.metaKey) || !Wall.customCur()
                    .wallTpl.reply_multiline && !a.shiftKey && !(a.ctrlKey || browser.mac && a.metaKey) && !i) return Wall.sendReply(e), cancelEvent(a)
            }
            if (a.ctrlKey && a.keyCode == KEY.RETURN) {
                var l = val(t),
                    s = Composer.getCursorPosition(t);
                return val(t, l.substr(0, s) + "\n" + l.substr(s)), elfocus(t, s + 1, s + 1), t.autosize.update(), setTimeout(function() {
                    t.autosize.update()
                }, 0), cancelEvent(a)
            }
        },
        sendReply: function(e, a, t) {
            if (t = extend({}, t), window.mvcur && mvcur.post == e) return Videoview.sendComment(e, a, t.stickerId);
            var o, i = window.cur.wallLayer == e,
                l = i ? wkcur : window.cur,
                s = ge("reply_field" + e),
                r = s && data(s, "composer"),
                n = l.reply_to && Wall.getReplyName(l.reply_to[0]),
                d = s && data(s, "send");
            if (d && isFunction(d)) return d(e, a, t);
            if (t.stickerId) var c = {
                message: "",
                attach1_type: "sticker",
                attach1: t.stickerId
            };
            else {
                var c = r ? Composer.getSendParams(r, Wall.sendReply.pbind(e)) : {
                    message: trim(Emoji.editableVal(s))
                };
                if (c.delayed) return;
                if (!c.attach1_type && (!c.message || isArray(n) && !n[1].indexOf(c.message))) return void Emoji.editableFocus(ge("reply_field" + e), !1, !0);
                r ? o = Composer.reset(r) : window.Emoji && Emoji.val(s, ""), s.autosize && s.autosize.update()
            }
            l.wallMyOpened = l.wallMyOpened || {}, l.wallMyReplied[e] = 1, l.wallMyOpened[e] = 1;
            var p = ge("post_hash" + e) ? ge("post_hash" + e)
                .value : l.options.post_hash,
                u = ge("reply_as_group" + e),
                _ = null;
            if (extend(c, {
                    act: "post",
                    type: l.wallType,
                    reply_to: e,
                    reply_to_msg: val("reply_to" + e),
                    reply_to_user: l.reply_to && l.reply_to[0] || 0,
                    start_id: val("start_reply" + e),
                    from: i && "wkview" || "",
                    hash: p
                }), l.reverse && (c.rev = 1), u && isVisible(u.parentNode) && (c.from_group = isChecked(u)),
                browser.mobile ? Wall.hideEditReply(e) : (Emoji.editableFocus(s, !1, !0), Wall.cancelReplyTo(e, a)), ajax.post("al_wall.php", Wall.fixPostParams(c), {
                    onDone: function(a, t, o, i) {
                        return "full" == l.wallType ? FullWall.onReplySent.apply(window, arguments) : (l.wallMyReplied[e] = 0, re("reply_link" + e), hide("reply_warn" +
                            e), void Wall._repliesLoaded(e, !1, t, o, i))
                    },
                    onFail: function() {
                        _ && re(_), r ? o = Composer.restore(r, o) : val(s, c.message), s.autosize && s.autosize.update()
                    },
                    showProgress: lockButton.pbind(ge("reply_button" + e)),
                    hideProgress: unlockButton.pbind(ge("reply_button" + e))
                }), !c.from_group && c.message) {
                var h = ge("replies" + e),
                    g = - ++l.wallMyRepliesCnt,
                    m = Emoji.emojiToHTML(clean(c.message), !0),
                    w = c.reply_to_user < 0 ? getLang("wall_replied_to_group") : l.options.reply_names[c.reply_to_user] && l.options.reply_names[c.reply_to_user][0],
                    f = w ? rs(l.wallTpl.reply_link_to, {
                        to_user: w
                    }) : "";
                if (_ = se(rs(l.wallTpl.reply_fast, {
                        reply_id: "0_" + g,
                        message: m.replace(/\n/g, "<br/>"),
                        to_link: f,
                        date: Wall.getNowRelTime(l)
                    })), h && !isVisible(h) || ge("reply_link" + e)) re("reply_link" + e), show("replies_wrap" + e);
                else if (!l.onepost) {
                    var v = h.nextSibling;
                    if (v && "replies_open" == v.className && Wall.openNewComments(e), !i) {
                        var b = geByClass1("wr_header", h, "a"),
                            y = geByClass("reply", h, "div")
                            .length + 1,
                            k = y;
                        b && (k = intval(b.getAttribute("offs")
                            .split("/")[1]) + 1), (k > 5 || k > y) && (b || h.insertBefore(b = ce("a", {
                            className: "wr_header"
                        }), h.firstChild), Wall.updateRepliesHeader(e, b, y, k))
                    }
                }
                l.reverse ? h.insertBefore(_, h.firstChild) : h.appendChild(_), i && (WkView.wallUpdateReplies(), l.reverse || (wkLayerWrap.scrollTop = wkLayerWrap.scrollHeight,
                    WkView.wallUpdateRepliesOnScroll()))
            }
        },
        postTooltip: function(e, a, t) {
            if (!cur.viewAsBox) {
                var o = (t || {})
                    .reply,
                    i = t.className || "";
                showTooltip(e, {
                    url: "al_wall.php",
                    params: extend({
                        act: "post_tt",
                        post: a
                    }, t || {}),
                    slide: 15,
                    shift: [!o || o % 2 ? 27 : 329, 6, 6],
                    ajaxdt: 100,
                    showdt: 400,
                    hidedt: 200,
                    dir: "auto",
                    className: "rich wall_tt" + i
                })
            }
        },
        hideEditPostReply: function(e) {
            if (cur.editing !== !1 && !isVisible(boxLayerBG) && !isVisible(layerBG)) {
                var a = e && e.target ? e.target : {},
                    t = a.id;
                cur.editing ? cur.editingHide ? cur.editingHide(cur.editing, a) : (!e || !hasClass(a, "reply_link") && t != "reply_field" + cur.editing && "reply_to_link" != a
                        .className) && Wall.hideEditReply(cur.editing) : (cur.wallAddMedia || {})
                    .chosenMedia || e && "post_field" == t || Wall.hideEditPost()
            }
        },
        deletePost: function(e, a, t, o) {
            (cur.wallLayer ? wkcur : cur)
            .wallMyDeleted[e] = 1;
            var i = ge("post" + e),
                l = geByClass1("post_actions", i);
            ajax.post("al_wall.php", {
                act: "delete",
                post: e,
                hash: a,
                root: t ? 1 : 0,
                confirm: o ? 1 : 0,
                from: "wall"
            }, {
                onDone: function(o, l, s) {
                    if (s) var r = showFastBox(o, s, getLang("global_delete"), function() {
                        r.hide(), wall.deletePost(e, a, t, 1)
                    }, getLang("box_cancel"));
                    else {
                        var n = geByClass1("_post_content", i) || geByClass1("feedback_row_t", i);
                        revertLastInlineVideo(n);
                        var d = ge("post_del" + e);
                        d ? (d.innerHTML = '<span class="dld_inner">' + o + "</span>", show(d)) : i.appendChild(ce("div", {
                                id: "post_del" + e,
                                className: "dld",
                                innerHTML: '<span class="dld_inner">' + o + "</span>"
                            })), hide(n), "post_publish" == domNS(n)
                            .className && hide(domNS(n)), "full_own" == cur.wallType || "full_all" == cur.wallType ? (Pagination.recache(-1), FullWall.updateSummary(
                                cur.pgCount)) : "full" == cur.wallType && hasClass(i, "reply") && (cur.pgOffset--, cur.pgCount--, FullWall.repliesSummary(cur.pgCount)),
                            hasClass(i, "suggest") ? Wall.suggestUpdate(-1) : hasClass(i, "postponed") || ("own" == cur.wallType || "all" == cur.wallType) && (
                                hasClass(i, "own") && ++cur.deletedCnts.own, hasClass(i, "all") && ++cur.deletedCnts.all, Wall.update())
                    }
                },
                showProgress: function() {
                    lockButton("post_nopublish" + e), addClass(l, "post_actions_progress")
                },
                hideProgress: function() {
                    unlockButton("post_nopublish" + e), removeClass(l, "post_actions_progress")
                }
            });
            var s = ge("delete_post" + e);
            s && s.tt && s.tt.el && s.tt.destroy()
        },
        markAsSpam: function(post, hash, el) {
            ajax.post("al_wall.php", {
                act: "spam",
                post: post,
                hash: hash,
                from: el ? "inline" : ""
            }, {
                onDone: function(msg, js) {
                    if (el) domPN(el)
                        .replaceChild(ce("div", {
                            innerHTML: msg
                        }), el);
                    else {
                        var r = ge("post" + post),
                            t = geByClass1("_post_content", r) || geByClass1("feedback_row_t", r);
                        revertLastInlineVideo(r);
                        var pd = ge("post_del" + post);
                        pd ? (pd.innerHTML = '<span class="dld_inner">' + msg + "</span>", show(pd)) : r.appendChild(ce("div", {
                            id: "post_del" + post,
                            className: "dld",
                            innerHTML: '<span class="dld_inner">' + msg + "</span>"
                        })), hide(t)
                    }
                    js && eval(js)
                },
                showProgress: el ? function() {
                    hide(el), show(domNS(el) || domPN(el)
                        .appendChild(ce("span", {
                            className: "progress_inline"
                        })))
                } : !1,
                hideProgress: el ? function() {
                    show(el), re(domNS(el))
                } : !1,
                stat: ["privacy.js", "privacy.css"]
            });
            var btn = ge("delete_post" + post);
            btn && btn.tt && btn.tt.el && btn.tt.destroy()
        },
        restorePost: function(e, a, t) {
            (cur.wallLayer ? wkcur : cur)
            .wallMyDeleted[e] = 0, ajax.post("al_wall.php", {
                act: "restore",
                post: e,
                hash: a,
                root: t ? 1 : 0
            }, {
                onDone: function(a) {
                    var t = ge("post_del" + e);
                    if (t) {
                        var o = ge("post" + e),
                            i = geByClass1("_post_content", o) || geByClass1("feedback_row_t", o);
                        show(i), "post_publish" == domNS(i)
                            .className && show(domNS(i)), hide(t), "full_own" == cur.wallType || "full_all" == cur.wallType ? (Pagination.recache(1), FullWall.updateSummary(
                                cur.pgCount)) : "full" == cur.wallType && hasClass(o, "reply") && (cur.pgOffset++, cur.pgCount++, FullWall.repliesSummary(cur.pgCount)),
                            hasClass(o, "suggest") ? Wall.suggestUpdate(1) : hasClass(o, "postponed") || ("own" == cur.wallType || "all" == cur.wallType) && (
                                hasClass(o, "own") && --cur.deletedCnts.own, hasClass(o, "all") && --cur.deletedCnts.all, Wall.update())
                    }
                }
            })
        },
        blockPostApp: function(e, a, t, o) {
            ajax.post("al_wall.php", {
                act: "block_post_app",
                aid: e,
                from: a,
                hash: t
            }, {
                onDone: function(e) {
                    o.parentNode.parentNode.innerHTML = e
                },
                showProgress: lockButton.pbind(o),
                hideProgress: unlockButton.pbind(o)
            })
        },
        checkPostClick: function(e, a, t) {
            if (a = a || window.event, !e || !a) return !0;
            var o = a.target || a.srcElement,
                i = 8,
                l = !1,
                s =
                /wall_post_text|published_comment|post_media|page_event_share|page_public_share|page_group_share|feed_friends|feed_videos|feed_explain_list|explain|feed_photos|feedback_row/;
            do
                if (!o || o == e || o.onclick || o.onmousedown || inArray(o.tagName, ["A", "IMG", "TEXTAREA", "EMBED", "OBJECT"]) || inArray(o.className, ["play_new",
                        "page_video_inline_wrap"
                    ]) || (l = o.className.match(s))) break;
            while (i-- && (o = o.parentNode));
            if (!l) return !1;
            if (cur.postClicked || (cur.postClicked = {}), !t || !cur.postClicked[e]) {
                var r = trim((window.getSelection && window.getSelection() || document.getSelection && document.getSelection() || document.selection && document.selection.createRange()
                        .text || "")
                    .toString());
                if (r) return !1;
                t && (cur.postClicked[e] = !0, setTimeout(function() {
                    cur.postClicked[e] = !1
                }, 2e3))
            }
            return o || !0
        },
        postClick: function(e, a, t) {
            var o = (e || "")
                .match(/^(-?\d+)_(wall)?(\d+)$/),
                i = ge("post" + e);
            if (t && t.skipCheck) var l = !0;
            else var l = Wall.checkPostClick(i, a);
            if (l) {
                if (l !== !0) {
                    var s = geByClass1("wall_post_more", l, "a");
                    if (s && isVisible(s)) return s.onclick(), void(o || removeClass(i, "wall_post_over"))
                }
                if (o && !hasClass(i, "suggest") && !cur.onepost) {
                    var r = "wall" + o[1] + "_" + o[3];
                    browser.mobile && a ? nav.go(r) : checkEvent(a) ? window.open(r, "_blank") : (Wall.hideEditPostReply(), Wall.postFull("wall" + o[1] + "_" + o[3], !1, t))
                }
            }
        },
        postClickStat: function(e) {
            e = normEvent(e);
            var a = e.currentTarget,
                t = [];
            a.getAttribute("data-ad-view") && (t.push(Wall.postsGetRaws(a)), Page.postsSeen(t), __adsUpdateExternalStats(a))
        },
        copyHistory: function(e, a, t, o) {
            e = e || window.event;
            var i = e.target || e.srcElement,
                l = 8,
                s = !1,
                r = /published_a_quote/;
            do
                if (!i || (s = i.className.match(r)) || i.onclick || i.onmousedown || inArray(i.tagName, ["A", "IMG"])) break;
            while (l-- && (i = i.parentNode));
            if (s) {
                var n = trim((window.getSelection && window.getSelection() || document.getSelection && document.getSelection() || document.selection && document.selection.createRange()
                        .text || "")
                    .toString());
                if (!n) return ajax.post("al_wall.php", {
                    act: "copy_history",
                    post: t,
                    offset: o
                }, {
                    onDone: function(e) {
                        if (domPN(a) && (hide(a), e)) {
                            var t = hasClass(domPN(a), "published_by_quote") ? domPN(a) : a;
                            domPN(t)
                                .insertBefore(cf(e), domNS(t)), isAncestor(t, "im_rows") ? IM.updateScroll(!0) : isAncestor(t, "wl_post") && WkView.wallUpdateReplies()
                        }
                    }
                }), cancelEvent(e)
            }
        },
        postFull: function(e, a, t) {
            if (e.match(/^wall-?\d+_\d+$/) && !(t || {})
                .nolist) switch (cur.wallType) {
                case "all":
                case "full_all":
                    e += "/all"
            }
            return showWiki({
                w: e
            }, !1, a, t)
        },
        checkReplyClick: function(e, a) {
            if (a = a || window.event, !e || !a) return !1;
            var t = a.target || a.srcElement,
                o = 8,
                i = !1;
            do
                if (!t || t == e || t.onclick || t.onmousedown || "A" == t.tagName && !hasClass(t, "_reply_lnk") || inArray(t.tagName, ["IMG", "TEXTAREA", "EMBED", "OBJECT"]) ||
                    "wpe_cont" == t.id || (i = hasClass(t, "_reply_content"))) break;
            while (o-- && (t = t.parentNode));
            if (!i) return !0;
            var l = trim((window.getSelection && window.getSelection() || document.getSelection && document.getSelection() || document.selection && document.selection.createRange()
                    .text || "")
                .toString());
            return l ? !0 : !1
        },
        replyClick: function(e, a, t, o) {
            var i = e.split("_"),
                l = intval(i[0]),
                s = i[1].replace(/-?\d+$/, ""),
                r = ge("post" + l + s + "_" + a);
            if (cur.stickerClicked || !Wall.checkReplyClick(r, t)) {
                (t || {})
                .cancelBubble = !0;
                var n = geByClass1("wall_reply_more", r, "a");
                if (n && isVisible(n)) return removeClass(r, "reply_moreable"), void n.onclick();
                if (o) {
                    var d = cur.stickerClicked || !1,
                        c = ge("reply_field" + e);
                    cur.stickerClicked = !1, !d || c && c.emojiInited || (cur.afterEmojiInit = cur.afterEmojiInit || {}, cur.afterEmojiInit[e] = function() {
                        Emoji.clickSticker(d, ge("reply_field" + e))
                    }), Wall.replyTo(e, a, o, t), d && c && c.emojiInited && Emoji.clickSticker(d, c)
                }
            }
        },
        stickerClick: function(e, a, t) {
            if ((t || {})
                .cancelBubble = !0, !window.Emoji) return void stManager.add(["emoji.js", "notifier.css"], function() {
                Wall.stickerClick(e, a)
            });
            if (!a) return void Emoji.clickSticker(e, !1);
            var o = Emoji.isStickerPackEnabled(e, Wall.stickerClick.pbind(e, a));
            if (0 !== o)
                if (o) {
                    var i = a.parentNode,
                        l = 8;
                    do
                        if (!i || hasClass(i, "reply")) break;
                    while (l-- && (i = i.parentNode));
                    i && i.onclick && (cur.stickerClicked = e, i.onclick())
                } else Emoji.clickSticker(e, !1)
        },
        domPost: function(e) {
            return ge("post" + e)
        },
        likeFullUpdate: function(e, a, t) {
            var o = a.match(/^(wall|photo|video|note|topic|wall_reply|note_reply|photo_comment|video_comment|topic_comment|market_comment|)(-?\d+_)(\d+)/),
                i = o ? o[2] + ("wall" == o[1] ? "" : o[1]) + o[3] : a;
            Wall.likeUpdate(e, i, t.like_my, t.like_num, t.like_title), Wall.likeShareUpdate(e, i, t.share_my, t.share_num, t.share_title)
        },
        likeUpdate: function(e, a, t, o, i, l) {
            o = intval(o);
            var s = a.match(/(-?\d+)(_?)(photo|video|note|topic|wall_reply|note_reply|photo_comment|video_comment|topic_comment|market_comment|)(\d+)/),
                r = (s[3] || "wall", s[1] + "_" + s[4]),
                n = e && gpeByClass("_post_content", e) || wall.domPost(r),
                d = domByClass(n, l ? "_share_wrap" : "_like_wrap"),
                c = (domByClass(d, "_icon"), domByClass(d, "_count"));
            if (c) {
                var p = d.tt || {},
                    u = clone(p.opts || {}),
                    _ = domByClass(p.container, "_value"),
                    h = domByClass(p.container, "_content"),
                    g = domByClass(p.container, "_title");
                i && g && val(g, i), p && (p.likeInvalidated = !0), _ && (_.value = o), animateCount(c, o), toggleClass(d, l ? "my_share" : "my_like", t), toggleClass(d, l ?
                    "no_shares" : "no_likes", !o), toggleClass(h, "me_hidden", !t), o ? !p.el || isVisible(p.container) || i || tooltips.show(p.el, extend(u, {
                    showdt: 0
                })) : p.el && p.hide()
            }
        },
        likeShareUpdate: function(e, a, t, o, i) {
            return Wall.likeUpdate(e, a, t, o, i, !0)
        },
        like: function(e, a) {
            if (vk.id && !cur.viewAsBox) {
                var t = wall.domPost(e),
                    o = domByClass(t, "_like_wrap"),
                    i = domByClass(o, "_icon"),
                    l = domByClass(o, "_count"),
                    s = hasClass(i, "fw_like_icon") ? hasClass(i, "fw_my_like") : hasClass(o, "my_like"),
                    r = e.match(/(-?\d+)(_?)(photo|video|note|topic|market|wall_reply|note_reply|photo_comment|video_comment|topic_comment|market_comment|)(\d+)/),
                    n = (r[3] || "wall") + r[1] + "_" + r[4],
                    d = cur.module;
                cur.wallType && (d = "feed" == cur.wallType ? "feed_" + ("news" == cur.section && cur.subsection ? cur.subsection : cur.section) : "wall_" + (cur.onepost ?
                    "one" : (cur.wallType || "")
                    .indexOf("full_") ? "page" : "full")), ajax.post("like.php", {
                    act: "a_do_" + (s ? "un" : "") + "like",
                    object: n,
                    hash: a,
                    wall: 2,
                    from: d
                }, {
                    onDone: Wall.likeFullUpdate.pbind(!1, e)
                });
                var c = val(ge("like_real_count_wall" + e) || l);
                Wall.likeUpdate(!1, e, !s, intval(c) + (s ? -1 : 1)), cur.onWallLike && cur.onWallLike()
            }
        },
        likeShare: function(e, a) {
            if (vk.id && !cur.viewAsBox) {
                var t = e.match(/(-?\d+)(_?)(photo|video|note|topic|market|wall_reply|note_reply|photo_comment|video_comment|topic_comment|market_comment|)(\d+)/),
                    o = (t[3] || "wall") + t[1] + "_" + t[4],
                    i = ge("like_share_" + o),
                    l = isChecked(i),
                    s = cur.wallType ? "feed" == cur.wallType ? "feed_" + cur.section : "wall_" + (cur.onepost ? "one" : (cur.wallType || "")
                        .indexOf("full_") ? "page" : "full") : cur.module;
                checkbox(i), ajax.post("like.php", {
                    act: "a_do_" + (l ? "un" : "") + "publish",
                    object: o,
                    hash: a,
                    wall: 2,
                    ref: s
                }, {
                    onDone: Wall.likeFullUpdate.pbind(!1, e)
                });
                var r = wall.domPost(e),
                    n = domByClass(r, "_like_wrap"),
                    d = domByClass(n, "_icon"),
                    c = val(ge("like_real_count_wall" + e) || domByClass(r, "_count")),
                    p = hasClass(d, "fw_like_icon") ? hasClass(d, "fw_my_like") : hasClass(n, "my_like");
                Wall.likeUpdate(!1, e, !0, intval(c) + (p ? 0 : 1))
            }
        },
        likeShareCustom: function(e, a) {
            var t = e.match(/(-?\d+)(_?)(photo|video|note|topic|market|wall_reply|note_reply|photo_comment|video_comment|topic_comment|market_comment|)(\d+)/),
                o = (t[3] || "wall") + t[1] + "_" + t[4];
            showBox("like.php", extend({
                act: "publish_box",
                object: o
            }, a))
        },
        likeShareCheckLen: function(e, a, t) {
            e = ge(e), a = ge(a), t = t || 255;
            var o = trim(val(e))
                .replace(/\n\n\n+/g, "\n\n");
            if (e.lastLen !== o.length) {
                var i = e.lastLen = o.length,
                    l = i - o.replace(/\n/g, "")
                    .length;
                i > t - 50 || l > 4 ? (i > t ? val(a, getLang("text_exceeds_symbol_limit", i - t)) : l > 4 ? val(a, getLang("global_recommended_lines", l - 4)) : val(a,
                    getLang("text_N_symbols_remain", t - i)), show(a)) : hide(a)
            }
        },
        showLikesPage: function(e, a, t) {
            cur.likesBox.loadTabContent("like.php", {
                act: "a_get_members",
                object: e,
                published: a,
                offset: t,
                wall: 1
            }, a)
        },
        clearLikesCache: function(e, a) {
            var t = "^/like.php#" + ajx2q({
                    act: "a_get_members",
                    object: e,
                    published: a,
                    offset: 12345,
                    wall: 1,
                    tab: a,
                    only_content: 1
                })
                .replace("12345", "\\d+") + "$",
                o = new RegExp(t, "i");
            for (var i in ajaxCache) o.test(i) && delete ajaxCache[i]
        },
        showPhoto: function(e, a, t, o, i) {
            return !showBox("al_photos.php", {
                act: "photo_box",
                to_id: e,
                photo: a,
                hash: t
            }, {
                cache: 1
            }, o.href ? i : !1)
        },
        _animDelX: function(e, a, t, o) {},
        domFC: function(e) {
            for (e = domFC(e); e && e.id.match(/page_wall_count_/);) e = domNS(e);
            return e
        },
        domPS: function(e) {
            for (e = domPS(e); e && e.id.match(/page_wall_count_/);) e = domPS(e);
            return e
        },
        scrollCheck: function(e, a, t) {
            var o, i, l, s, a = void 0 == a ? scrollGetY() : a,
                r = 0,
                n = [],
                d = window.innerHeight || document.documentElement.clientHeight || bodyNode.clientHeight;
            if (window.scrollAnimation) return !1;
            if (Wall.repliesSideUpdate(a), cur.wallPage) {
                var c = "suggested" == cur.wallTab ? ge("page_suggested_posts") : ge("page_wall_posts");
                if ((domPN(cur.topRow) != c || ((cur.topRow || {})
                            .id || "")
                        .match(/page_wall_count_/)) && (cur.topRow = Wall.domFC(c)), vk.id && cur.topRow && !cur.topRow.id.match(/page_wall_count_/) && !((window.curNotifier ||
                            {})
                        .idle_manager || {})
                    .is_idle) {
                    for (postsUnseen = [], i = Wall.domPS(cur.topRow); i; i = Wall.domPS(i)) cur.topRow.offsetTop > a && (cur.topRow = i), i.unseen || (i.unseen = !0,
                        postsUnseen.push(Wall.postsGetRaws(i)));
                    for (Page.postsUnseen(postsUnseen), i = cur.topRow; i && (o = r ? r : i.offsetTop, !(o >= a + d)); i = l) l = domNS(i), ((l || {})
                            .id || "")
                        .match(/page_wall_count_/) && (l = null), r = l ? l.offsetTop : o + i.offsetHeight, a > r && l && (cur.topRow = l), s = i.bits || 0, s >= 3 || (s |= (o >=
                            a && a + d > o ? 1 : 0) | (r >= a && a + d > r ? 2 : 0)) && (i.bits = s, 3 == s && n.push(Wall.postsGetRaws(i)));
                    Page.postsSeen(n)
                }
            }!cur.wallAutoMore || cur.wallLoading || cur.viewAsBox || (i = ge("wall_more_link"), isVisible(i) && a + lastWindowHeight + 1e3 > getXY(i)[1] && i.onclick())
        },
        postsGetRaws: function(e) {
            var a, t = indexOf(domPN(e)
                    .children, e),
                o = {};
            if (!e) return o;
            o.module = cur.module, o.index = t;
            var i = e.getAttribute("data-ad-view");
            return i && (o["ad_" + i] = 1), hasClass(e, "own") ? ((a = e.id.match(/^post(-?\d+_\d+)$/)) && (o[a[1]] = 1, (a = (e.getAttribute("data-copy") || "")
                .match(/^(-?\d+_\d+)$/)) && (o[a[1]] = -1)), o) : o
        },
        pollVote: function(option, post, params, attachI) {
            if (cur.viewAsBox) return cur.viewAsBox();
            addClass(option, "on");
            var progress = geByClass1("progress", option);
            ajax.post("widget_poll.php", extend(params, {
                act: "a_vote",
                no_widget: 1,
                inline: 1,
                sid: post,
                i: attachI
            }), {
                onDone: function(html, script) {
                    val("post_poll" + post, html), script && eval(script)
                },
                showProgress: addClass.pbind(progress, "progress_inline"),
                hideProgress: removeClass.pbind(progress, "progress_inline")
            })
        },
        pollFull: function(e, a, t, o) {
            return stManager.add("wkpoll.js"), showWiki({
                w: "poll" + a,
                opt_id: o
            }, !1, t, {
                queue: 1
            })
        },
        pollOver: function(e, a, t) {
            showTooltip(e, {
                url: "al_wall.php",
                params: {
                    act: "poll_opt_stats",
                    post_raw: a,
                    opt_id: t
                },
                slide: 15,
                ajaxdt: 100,
                showdt: 400,
                hidedt: 200,
                dir: "auto",
                typeClass: "poll_tt"
            })
        },
        foTT: function(e, a, t) {
            t && t.oid && (a = t.oid == vk.id ? getLang("wall_my_friends_only") : val("wpfo" + t.pid)), showTitle(e, a)
        },
        update: function() {
            if (cur.wallLayer) return void WkView.wallUpdateReplies();
            if (!("all" != cur.wallType && "own" != cur.wallType || "all" != cur.wallTab && "own" != cur.wallTab)) {
                var e = {
                        all: intval(val("page_wall_count_all")),
                        own: intval(val("page_wall_count_own"))
                    },
                    a = e[cur.wallType];
                cur.oid < 0 && cur.options.fixed_post_id && (a -= 1), "suggested" != cur.wallTab && val("page_wall_posts_count", a ? langNumeric(a, cur.options.wall_counts) :
                    cur.options.wall_no);
                var t = ge("wall_more_link"),
                    o = intval(cur.deletedCnts[cur.wallType]),
                    i = geByClass(cur.wallType, ge("page_wall_posts"))
                    .length - o,
                    l = i;
                cur.options.fixed_post_id && cur.options.wall_oid < 0 && (l += 1), l >= e[cur.wallType] - o ? hide(t) : (show(t), t.onclick = Wall.showMore.pbind(i)),
                    shortCurrency(), window.mvcur && mvcur.mvShown && Videoview.updatePlaylistBoxPosition(), cur.gifAutoplayScrollHandler && cur.gifAutoplayScrollHandler()
            }
        },
        getAbsDate: function(e, a) {
            a = a || window.cur;
            var t, o = new Date(e || vkNow()),
                i = o.getHours(),
                l = o.getMinutes(),
                s = "";
            return a.wallTpl.time_system && (s = a.wallTpl.time_system[i > 11 ? 1 : 0], i = i % 12 || 12), t = i > 9 ? i : "0" + i, l = l > 9 ? l : "0" + l, a.wallTpl.date_format
                .replace("{am_pm}", s)
                .replace("{hour}", i)
                .replace("{num_hour}", t)
                .replace("{minute}", l)
        },
        getNowRelTime: function(e) {
            e = e || window.cur;
            var a = vkNow();
            return '<span class="rel_date rel_date_needs_update" time="' + intval(a / 1e3 - (e.tsDiff || 0)) + '" abs_time="' + Wall.getAbsDate(a, e) + '">' + getLang(
                "wall_just_now") + "</span>"
        },
        getNewPostHTML: function(e, a, t, o) {
            o = o || window.cur;
            var i, l = [],
                s = e[2],
                r = s.split("_")[0],
                n = "",
                d = e[4].split("|");
            1 == e[8] ? n += o.wallTpl.reply_link : r != vk.id && (n += o.wallTpl.own_reply_link);
            var c = e[3].replace("mem_link", "author")
                .replace("memLink", "author");
            return -1 != e[6].indexOf('id="wpfo') && (c += '<span class="page_fronly inl_bl" onmouseover="Wall.foTT(this, false, {oid: \'' + r + "', pid: '" + e[2] +
                "'})\"></span>"), a > (e[9] == r ? 1 : 0) || r == vk.id || e[9] == vk.id ? l.push(o.wallTpl.del) : e[2].split("_")[0] != e[4] && l.push(o.wallTpl.spam), (a >
                1 && e[9] == r || r == vk.id || e[9] == vk.id) && l.push(o.wallTpl.edit), i = {
                oid: r,
                name: c,
                actions: l.length ? rs(o.wallTpl.post_actions, {
                    actions: l.join("")
                }) : "",
                replies: "",
                reply_link: n,
                own_reply_link: o.wallTpl.own_reply_link,
                reply_box: 1 == e[8] ? o.wallTpl.reply_box : "",
                photo: psr(d[0]),
                link: e[5],
                text: psr(e[6]),
                date: Wall.getNowRelTime(o),
                post_id: e[2],
                poll_hash: o.wallTpl.poll_hash,
                date_postfix: "",
                can_reply_as_group: 0 > r && a > 1 ? 1 : 0,
                post_url: "/wall" + s.replace("_wall_reply", "_"),
                owner_photo: psr(d[1] || d[0]),
                online_class: r > 0 ? " online" : ""
            }, t && extend(i, t(i, e)), rs(rs(o.wallTpl.post, i), i)
        },
        getNewReplyHTML: function(e, a, t, o) {
            o = o || window.cur;
            var i = [],
                l = ge("reply_field" + e[2]) || ge("reply_fakebox" + e[2]) || ge("fwr_text"),
                s = "",
                r = "",
                n = "",
                d = e[10] ? " " + e[10] : "";
            a > 0 || !e[2].indexOf(vk.id + "_") || e[4] == vk.id ? i.push(o.wallTpl.del_reply) : e[2].split("_")[0] != e[4] && i.push(o.wallTpl.spam_reply), (a > 1 && e[4] ==
                intval(e[2]) || e[4] == vk.id) && i.push(o.wallTpl.edit_reply), -1 != e[8].indexOf('class="wall_reply_more"') && (s += "reply_moreable"), l && (s +=
                " reply_replieable", r = o.wallTpl.reply_link_wrap, o.options.reply_names[e[4]] || (o.options.reply_names[e[4]] = [e[11], e[12]])), s && (n =
                " onclick=\"Wall.replyClick('%post_id%', %reply_msg_id%, event, %reply_uid%)\""), i = rs(o.wallTpl.reply_actions, {
                actions: i.join("")
            });
            var c = {
                name: e[5].replace("mem_link", "author"),
                photo: psr(e[6]),
                link: e[7],
                text: psr(e[8]),
                classname: s,
                actions: i,
                attr: n,
                date: Wall.getNowRelTime(o),
                to_link: d,
                answer_link: r,
                post_id: e[2],
                reply_id: e[3],
                like_id: e[3].replace("_", "_wall_reply"),
                reply_msg_id: e[3].split("_")[1],
                reply_uid: e[4] || "false"
            };
            return t && extend(c, t(c)), rs(o.wallTpl.reply, c)
        },
        updatePostImages: function(e) {
            return e.replace(/<img[^>]+>/g, function(e) {
                return e.match(/class=/) ? e.replace("src=", "data-src=")
                    .replace('class="', 'class="__need_img ') : e
            })
        },
        loadPostImages: function(e) {
            each(geByClass("__need_img", e, "img"), function() {
                var e = this.getAttribute("data-src");
                e && (this.src = e, this.removeAttribute("data-src")), removeClass(this, "__need_img")
            })
        },
        openNewComments: function(e) {
            var a = ge("replies" + e),
                t = a.nextSibling,
                o = geByClass1("wr_header", a, "a"),
                i = 0,
                l = geByClass("reply", a, "div")
                .length,
                s = l,
                r = t.newCnt;
            Wall.loadPostImages(a), each(clone(geByClass("new_reply", a, "div")), function() {
                return removeClass(this, "new_reply"), nodeUpdated(this), i++, 100 == i ? !1 : void 0
            }), o && (s = i + intval(o.getAttribute("offs")
                .split("/")[1])), l += -r + i, (s > 3 || s > l) && (o || a.insertBefore(o = ce("a", {
                className: "wr_header"
            }), a.firstChild), Wall.updateRepliesHeader(e, o, l, s)), cur.wallMyOpened[e] = 1, t && "replies_open" == t.className && (r > 100 ? (t.innerHTML = getLang(
                "news_x_new_replies_more", Math.min(100, r - i)), t.newCnt -= i) : re(t)), Wall.repliesSideSetup(e)
        },
        langWordNumeric: function(e, a, t) {
            return langWordNumeric(e, a, t)
        },
        updateTimes: function(e) {
            if ((cur.lang || {})
                .wall_X_seconds_ago_words) {
                var a = intval(vkNow() / 1e3),
                    t = [];
                a -= cur.tsDiff, each(geByClass("rel_date_needs_update", e || ge("page_wall_posts"), "span"), function(e, o) {
                    if (o) {
                        var i = intval(o.getAttribute("time")),
                            l = a - i,
                            s = o.getAttribute("abs_time");
                        5 > l ? s = getLang("wall_just_now") : 60 > l ? s = Wall.langWordNumeric(l, cur.lang.wall_X_seconds_ago_words, cur.lang.wall_X_seconds_ago) :
                            3600 > l ? s = Wall.langWordNumeric(intval(l / 60), cur.lang.wall_X_minutes_ago_words, cur.lang.wall_X_minutes_ago) : 14400 > l ? s = Wall.langWordNumeric(
                                intval(l / 3600), cur.lang.wall_X_hours_ago_words, cur.lang.wall_X_hours_ago) : t.push(o), o.innerHTML = s
                    }
                }), each(t, function() {
                    removeClass(this, "rel_date_needs_update")
                })
            }
        },
        updateRepliesHeader: function(e, a, t, o) {
            if (!cur.onepost) {
                var i, l, s = a.href,
                    r = 3,
                    n = 0;
                if (!s && (l = e.match(/^(-?\d+)_(photo|video|note|topic|video|)(\d+)$/))) {
                    var d = l[2] || "wall";
                    switch (s = "/" + d + l[1] + "_" + l[3], d) {
                        case "topic":
                            s += "?offset=last&scroll=1";
                            break;
                        case "wall":
                            s += "?offset=last&f=replies"
                    }
                    a.href = s
                }
                o > t ? 100 > t ? (o > 100 ? (i = getLang("wall_show_n_of_m_last", 100), i = i.replace("{count}", o)) : i = getLang("wall_show_all_n_replies", o), r = !1) : i =
                    getLang("wall_hide_replies") : (i = getLang("wall_hide_replies"), n = 1), toggleClass(a, "wrh_all", n), a.innerHTML = i, a.onclick = Wall.showReplies.pbind(
                        e, r, !1), a.setAttribute("offs", t + "/" + o)
            }
        },
        updatePoll: function(e) {
            vk.id && ajax.post("al_wall.php", {
                act: "post_poll",
                post_raw: e
            }, {
                onDone: function(a) {
                    if (a) {
                        var t = ge("post_poll" + e),
                            o = geByTag1("table", t);
                        if (o)
                            for (var i = 0; i < o.rows.length; ++i) {
                                var l = o.rows[i].tt;
                                l && l.destroy && l.destroy()
                            }
                        val(t, a)
                    }
                },
                onFail: function() {
                    return !0
                }
            })
        },
        updatePollResults: function(post_raw, newPollDataTxt) {
            var pollWrapEl = ge("post_poll" + post_raw),
                pollTable = geByTag1("table", pollWrapEl),
                pollRaw = val("post_poll_raw" + post_raw);
            if (pollWrapEl) {
                var newPollData = eval("(" + newPollDataTxt + ")"),
                    totalVotes = 0,
                    maxVotes = 0,
                    pollStats = "";
                if (each(newPollData, function() {
                        totalVotes += this[1], this[1] > maxVotes && (maxVotes = this[1])
                    }), pollTable && pollRaw) {
                    each(newPollData, function(e) {
                        pollStats += rs(cur.wallTpl.poll_stats, {
                            option_text: this[0],
                            css_percent: totalVotes ? Math.round(100 * this[1] / maxVotes) : 0,
                            count: langNumeric(this[1], "%s", !0),
                            percent: totalVotes ? Math.round(1e3 * this[1] / totalVotes) / 10 : 0,
                            handlers: val("post_poll_open" + post_raw) ? " onmouseover=\"Wall.pollOver(this, '" + post_raw + "', " + e + ')"' : "",
                            row_class: ""
                        })
                    });
                    for (var i = 0; i < pollTable.rows.length; ++i) {
                        var t = pollTable.rows[i].tt;
                        t && t.destroy && t.destroy()
                    }
                    val(pollTable, pollStats)
                }
                var codeLink = geByClass1("page_poll_code", pollWrapEl, "a"),
                    totalEl = geByClass1("page_poll_total", pollWrapEl);
                val(totalEl, langNumeric(totalVotes, cur.lang.wall_X_people_voted || "%", !0)), codeLink && totalEl.insertBefore(codeLink, domFC(totalEl))
            }
        },
        updated: function(e, a, t) {
            var o = e ? wkcur : window.cur;
            if (o.wallAddQueue && o.wallAddQueue.key == a) {
                if (t.failed) return void(o.wallAddQueue = !1);
                if (o.wallAddQueue.ts = t.ts, isArray(t.events) && t.events.length) {
                    var i = (t.events.length, e ? wkLayerWrap.scrollTop : scrollGetY()),
                        l = i,
                        s = !(o.wallType || "")
                        .indexOf("full"),
                        r = o.onepost,
                        n = e ? !0 : !1,
                        d = e;
                    if (!s || !(nav.objLoc.q || nav.objLoc.search || nav.objLoc.day)) {
                        each(t.events, function() {
                            var a = this.split("<!>"),
                                t = a[0],
                                i = a[1],
                                c = a[2],
                                p = 0,
                                u = 0,
                                _ = e && window.cur.wallLayer == c && ge("wl_post_body");
                            if (_ && "del_reply" != i || (_ = ge("post" + c), isAncestor(_, e ? wkLayerWrap : pageNode) || (_ = null)), t == o.options.qversion) {
                                switch (i) {
                                    case "new_post":
                                        if (_) break;
                                        if (s && o.pgStart > 0) {
                                            o.pgOffset++;
                                            break
                                        }
                                        o.oid == vk.id && vk.id == a[9] && window.curNotifier && curNotifier.idle_manager.is_idle && Wall.clearInput();
                                        var h = ge("page_wall_posts"),
                                            g = h.lastChild,
                                            m = s ? FullWall.addTetaTet : !1,
                                            w = intval(a[a.length - 1]),
                                            f = void 0 !== o.options.is_admin ? o.options.is_admin : o.options.wall_oid < 0 ? 8 & w ? 2 : 2 & w ? 1 : 0 : 0,
                                            v = se(Wall.getNewPostHTML(a, f, m, o)),
                                            b = h.firstChild;
                                        if (ge("post" + c)) break;
                                        for (g && g != v ? re(g) : g = !1, s ? g || o.pgOffset++ : (val("page_wall_count_all", intval(val("page_wall_count_all")) + 1),
                                                addClass(v, "all"), intval(a[10]) && (val("page_wall_count_own", intval(val("page_wall_count_own")) + 1), addClass(v,
                                                    "own"))); b && ("INPUT" == b.tagName || 1 != b.nodeType || hasClass(b, "post_fixed"));) b = b.nextSibling;
                                        h.insertBefore(v, b), ge("post_poll_id" + c) && Wall.updatePoll(c), p = v.offsetHeight, u = getXY(v, d)[1], nodeUpdated(v),
                                            Wall.updateMentionsIndex();
                                        break;
                                    case "edit_post":
                                        var y = ge("wpt" + c);
                                        if (!isVisible(_) || !y) break;
                                        var k = geByClass1("wall_post_more", y);
                                        k && (k = isVisible(domNS(k))), p = -y.offsetHeight, u = getXY(y, d)[1];
                                        var C = psr(rs(a[3], {
                                            poll_hash: o.wallTpl.poll_hash
                                        }));
                                        val(y, C), k && (k = geByClass1("wall_post_more", y), k && k.onclick()), ge("post_poll_id" + c) && Wall.updatePoll(c), p += y.offsetHeight,
                                            nodeUpdated(y);
                                        break;
                                    case "edit_reply":
                                        var x = a[3],
                                            y = ge("wpt" + x);
                                        if (!isVisible("post" + x) || !y) break;
                                        var k = geByClass1("wall_reply_more", y);
                                        k && (k = isVisible(domNS(k))), p = -y.offsetHeight, u = getXY(y, d)[1], val(y, psr(a[4])), k && (k = geByClass1(
                                            "wall_reply_more", y), k && k.onclick()), p += y.offsetHeight, nodeUpdated(y);
                                        break;
                                    case "post_parsed_link":
                                        if (!_) break;
                                        var S = geByClass1("wall_postlink_preview_btn_disabled", _);
                                        if (!S) break;
                                        intval(a[3]) ? removeClass(S, "wall_postlink_preview_btn_disabled") : re(S);
                                        break;
                                    case "del_post":
                                        if (!isVisible(_)) break;
                                        o.wallMyDeleted[c] || r || (p = -_.offsetHeight, u = getXY(_, d)[1], revertLastInlineVideo(_), addClass(_, "unshown"), s || n ||
                                            (val("page_wall_count_all", intval(val("page_wall_count_all")) - 1), a[3] && val("page_wall_count_own", intval(val(
                                                "page_wall_count_own")) - 1)));
                                        break;
                                    case "res_post":
                                        if (!_ || isVisible(_)) break;
                                        o.wallRnd == a[4] && removeClass(_, "unshown"), s ? o.pgOffset++ : (val("page_wall_count_all", intval(val("page_wall_count_all")) +
                                            1), a[3] && val("page_wall_count_own", intval(val("page_wall_count_own")) + 1));
                                        break;
                                    case "new_reply":
                                        if (!_ || o.wallMyReplied[c] || ge("post" + a[3]) || r && o.pgOffset < o.pgCount || n && (o.reverse ? o.offset : o.offset + o.loaded <
                                                o.count)) break;
                                        var P = ge("replies" + c),
                                            T = ge("replies_wrap" + c),
                                            w = intval(a[a.length - 1]),
                                            f = void 0 !== o.options.is_admin ? o.options.is_admin : o.options.wall_oid < 0 ? 8 & w ? 2 : 2 & w ? 1 : 0 : 0,
                                            v = se(Wall.getNewReplyHTML(a, f, !1, o)),
                                            L = !1,
                                            M = n ? P.offsetHeight : _.offsetHeight;
                                        if (isVisible(P) && isVisible(T) && !isVisible("reply_link" + c)) {
                                            var E = P.nextSibling,
                                                N = geByClass("new_reply", P, "div")
                                                .length + 1;
                                            if (n || r || o.wallMyOpened[c]) {
                                                if (!r) {
                                                    E && "replies_open" == E.className && re(E), L = !0;
                                                    var W = geByClass1("wr_header", P, "a"),
                                                        B = geByClass("reply", P, "div")
                                                        .length + 1,
                                                        A = B;
                                                    W && (A = intval(W.getAttribute("offs")
                                                        .split("/")[1]) + 1), (A > 5 || A > B) && (W || P.insertBefore(W = ce("a", {
                                                        className: "wr_header"
                                                    }), P.firstChild), Wall.updateRepliesHeader(c, W, B, A))
                                                }
                                            } else addClass(v, "new_reply"), E && "replies_open" == E.className || (E = ce("div", {
                                                    className: "replies_open",
                                                    onclick: Wall.openNewComments.pbind(c)
                                                }), P.parentNode.insertBefore(E, P.nextSibling)), E.innerHTML = getLang("wall_x_new_replies_more", Math.min(100, N)), E
                                                .newCnt = N
                                        } else re("reply_link" + c), show(T, P), L = !0;
                                        (e ? o.reverse : !1) && P.firstChild ? P.insertBefore(v, P.firstChild) : P.appendChild(v), L && nodeUpdated(v), n ? (o.count++,
                                            o.loaded++, WkView.wallUpdateReplies(), p = P.offsetHeight - M, u = getXY(v, d)[1]) : (r && (FullWall.repliesSummary(a[
                                            13]), o.pgOffset++, o.pgCount++, FullWall.repliesSummary(o.pgCount), Pagination.pageReady(!1), FullWall.onePostOnScroll(!
                                            1, !1, !0)), p = _.offsetHeight - M, u = getXY(L ? v : E)[1], Wall.repliesSideSetup(c)), Wall.updateMentionsIndex();
                                        break;
                                    case "del_reply":
                                        if (o.wallMyDeleted[c] || !_) break;
                                        if (p = -_.offsetHeight, u = getXY(_, d)[1], revertLastInlineVideo(_), o.layerpost) hide(_), o.count--, o.loaded--;
                                        else {
                                            r && (o.pgOffset--, o.pgCount--, FullWall.repliesSummary(o.pgCount));
                                            var j = _.parentNode.id.match(/replies(-?\d+_\d+)/);
                                            re(_), j && Wall.repliesSideSetup(j[1])
                                        }
                                        break;
                                    case "like_post":
                                    case "like_reply":
                                        var I = "like_reply" == i ? c.replace("_", "_wall_reply") : c,
                                            D = e && c == window.cur.wallLayerLike,
                                            R = D ? ge("wk_like_count") : ge("like_count" + I),
                                            U = D ? ge("wk_like_icon") : ge("like_icon" + I);
                                        if (!_ && !R) break;
                                        var H = U && U.parentNode,
                                            F = (intval(val(R)), intval(a[3]));
                                        animateCount(R, F), val("like_real_count_wall" + c, F), toggleClass(U, "no_likes", 0 >= F), H && H.tt && !isVisible(H.tt.container) &&
                                            H.tt.destroy && H.tt.destroy(), setStyle(U, {
                                                opacity: "",
                                                visibility: ""
                                            });
                                        break;
                                    case "vote_poll":
                                        if (!_) break;
                                        Wall.updatePollResults(c, a[3]);
                                        break;
                                    case "upd_ci":
                                        var O = a[2],
                                            V = ge("current_info"),
                                            _ = V || ge("page_current_info"),
                                            q = ' data-audio="' + a[4] + '"';
                                        if (!_) break;
                                        switch (a[3]) {
                                            case "audio":
                                                var z = geByClass1("current_audio_cnt");
                                                z && z.tt && z.tt.hide();
                                                var G = intval(a[5] || ""),
                                                    Y = G ? "" : " hidden",
                                                    K = q;
                                                V || (K += " onmouseover=\"showTooltip(this, {forcetoup: true, text: '" + o.options.ciAudioTip +
                                                    "', black: 1, shift: [14, 5, 5]})\" onclick=\"Page.playCurrent(this, this.getAttribute('data-audio'), '" + o.options
                                                    .ciAudioHash + "')\""), O = rs(o.options.ciAudioTpl, {
                                                    text: O,
                                                    attrs: K,
                                                    count: G,
                                                    cnt_class: Y
                                                }), wall.updateOwnerStatus(O, _, a, V);
                                                break;
                                            case "app":
                                                var X = a[6] ? "[12, 5, 5]" : "[15, 5, 5]",
                                                    $ = a[6] ? " current_app_icon" : "",
                                                    K = V ? ' onclick="cur.ciApp = ' + a[4] + '"' : " onmouseover=\"showTooltip(this, {forcetoup: true, text: '" + o.options
                                                    .ciAppTip + "', black: 1, shift: " + X + '})" href="' + a[5] + '?ref=14" onclick="return showApp(event, ' + a[4] +
                                                    ', 1, 14, cur.oid)"';
                                                a[6] && (K += " style=\"background-image: url('" + a[6] + "')\""), O = '<a class="current_app' + $ + '"' + K + ">" + O +
                                                    "</a>", wall.updateOwnerStatus(O, _, a, V);
                                                break;
                                            default:
                                                stManager.add(["emoji.js"], function() {
                                                    O = O ? '<span class="current_text">' + Emoji.emojiToHTML(O, !0) + "</span>" : O, wall.updateOwnerStatus(O,
                                                        _, a, V)
                                                })
                                        }
                                        break;
                                    case "upd_ci_cnt":
                                        var V = ge("current_info"),
                                            Q = intval(a[2]),
                                            _ = V || ge("page_current_info"),
                                            R = _ && geByClass1("current_audio_cnt", _);
                                        R && (R.tt && R.tt.destroy(), toggleClass(R, "hidden", 0 == Q), animateCount(R, Q))
                                }
                                p && (e ? 0 > u : l > u) && (l += p)
                            }
                        });
                        scrollGetY();
                        l != i && i > 100 && (e ? wkLayerWrap.scrollTop = l : scrollToY(l, 0)), Wall.update()
                    }
                }
            }
        },
        updateOwnerStatus: function(e, a, t, o) {
            if (o) {
                var i = e ? "my_current_info" : "no_current_info";
                e = '<span class="' + i + '">' + (e || getLang("change_current_info")) + "</span>", val(a.parentNode.nextSibling, e), !isVisible("currinfo_editor") && cur.oid >
                    0 && (toggle("currinfo_audio", "app" != t[3]), toggle("currinfo_app", "app" == t[3]), addClass("currinfo_app", "on"))
            }
            val(a, e)
        },
        updateMentionsIndex: function(e) {
            if (clearTimeout(cur.wallUpdateMentionsIndexTO), !e) return void(cur.wallUpdateMentionsIndexTO = setTimeout(wall.updateMentionsIndex.pbind(!0), 300));
            var a = {},
                t = [],
                o = new RegExp("^(https?://(vk.com|" + location.host.replace(/\./, "\\.") + "))?/?"),
                i = [];
            each(geByClass("author", bodyNode, "a"), function() {
                var e = val(this),
                    i = this.href.replace(o, "");
                if (void 0 === a[i]) {
                    var l = intval(this.getAttribute("data-from-id"));
                    l && l != vk.id && (a[i] = t.length, t.push([l, e, "@" + i, "/images/camera_c.gif"]))
                }
            }), i = i.concat(Array.prototype.slice.apply(geByClass("post_image", bodyNode, "a"))), i = i.concat(Array.prototype.slice.apply(geByClass("reply_image",
                bodyNode, "a"))), each(i, function() {
                var e = this.href.replace(o, ""),
                    i = a[e];
                if (void 0 !== i) {
                    for (var l = domFC(this); l && "IMG" != l.tagName;) l = domNS(l);
                    l && (t[i][3] = l.getAttribute("src"), delete a[e])
                }
            }), cur.wallMentions = t
        },
        initUpdates: function(e) {
            if (e && window.Notifier) {
                var a = cur.wallAddQueue,
                    t = function() {
                        cur.wallAddQueue && Notifier.addKey(cur.wallAddQueue, Wall.updated.pbind(!1))
                    };
                cur.wallAddQueue = e, t(), a || (checkInt = setInterval(t, 1e4), cur.destroy.push(function() {
                    clearInterval(checkInt)
                }))
            }
        },
        initWallOptions: function(e) {
            extend(cur, {
                wallType: e.wall_type,
                wallTpl: e.wall_tpl,
                wallMyDeleted: {},
                tsDiff: e.wall_tpl && e.wall_tpl.abs_timestamp ? 900 * Math.round((vkNow() / 1e3 - e.wall_tpl.abs_timestamp) / 900) : 0,
                wallMyOpened: {},
                wallMyReplied: {},
                wallMentions: [],
                wallMyRepliesCnt: 0
            }), e.wall_tpl && e.wall_tpl.lang && (cur.lang = extend(cur.lang || {}, e.wall_tpl.lang)), window.Notifier && Notifier.addRecvClbk("wall_reply_multiline",
                "wall",
                function(e) {
                    Wall.onReplySubmitChanged(e.value, 1)
                }, !0)
        },
        init: function(e) {
            Wall.initWallOptions(e), extend(cur, {
                wallInited: !0,
                postField: ge("post_field"),
                wallSearch: ge("wall_search"),
                wallPage: ge("profile") || ge("group") || ge("public"),
                wallPageNarrow: ge("narrow_column"),
                wallUploadOpts: e.upload || !1,
                deletedCnts: {
                    own: 0,
                    all: 0
                }
            }), cur.destroy.push(function(e) {
                cleanElems(e.postField)
            });
            var a = removeEvent.pbind(document, "click", Wall.hideEditPostReply);
            cur._back ? (cur._back.hide.push(a), cur._back.show.push(a), cur._back.show.push(addEvent.pbind(document, "click", Wall.hideEditPostReply))) : cur.destroy.push(a);
            var t = ge("page_wall_count_own");
            "own" != cur.wallType || intval(t && t.value) || (replaceClass("page_wall_posts", cur.wallType, "all"), cur.wallType = "all"), cur.wallTab = cur.wallType, Wall.update(),
                Wall.initUpdates(e.add_queue_key), e.wall_tpl && (cur.timeUpdateInt = setInterval(function() {
                    Wall.updateTimes(e.wallCont)
                }, 1e4), cur.destroy.push(function() {
                    clearInterval(cur.timeUpdateInt)
                }));
            var o = window;
            if (addEvent(o, "scroll", Wall.scrollCheck), addEvent(window, "resize", Wall.scrollCheck), cur.destroy.push(function() {
                    removeEvent(o, "scroll", Wall.scrollCheck), removeEvent(window, "resize", Wall.scrollCheck)
                }), cur.wallAutoMore = e.automore, Wall.initPostEditable(e.draft), cur.wallSearch && placeholderInit(cur.wallSearch), removeEvent(document, "click", Wall.hideEditPostReply),
                addEvent(document, "click", Wall.hideEditPostReply), e.media_types && (cur.wallAddMedia = new MediaSelector(ge("page_add_media"), "media_preview", e.media_types,
                    extend({
                        onAddMediaChange: function() {
                            Wall.postChanged(10)
                        },
                        onMediaChange: function() {
                            Wall.postChanged()
                        },
                        editable: 1,
                        sortable: 1
                    }, e.media_opts || {}))), cur.withUpload = window.WallUpload && !browser.safari_mobile && ("all" == cur.wallType || "own" == cur.wallType || "feed" == cur.wallType) &&
                Wall.withMentions && cur.wallUploadOpts, cur.withUpload && WallUpload.checkDragDrop()) {
                var i = function() {
                        removeEvent(document, "dragover dragenter drop dragleave", l)
                    },
                    l = function(e) {
                        if (r !== !1 && (clearTimeout(r), r = !1), cur.uploadInited) return i(), cancelEvent(e);
                        switch (e.type) {
                            case "drop":
                                s = !1, delete cur.wallUploadFromDrag, hide("post_upload_dropbox");
                                break;
                            case "dragleave":
                                r = setTimeout(function() {
                                    s = !1, delete cur.wallUploadFromDrag, hide("post_upload_dropbox")
                                }, 100);
                                break;
                            case "dragover":
                            case "dragenter":
                                s || (s = !e.target || "IMG" != e.target.tagName && "A" != e.target.tagName ? 2 : 1, 2 == s && setTimeout(Wall.showEditPost, 0)), 2 == s && (
                                    cur.wallUploadFromDrag = 1)
                        }
                        return cancelEvent(e)
                    },
                    s = !1,
                    r = !1;
                addEvent(document, "dragover dragenter drop dragleave", l), cur.destroy.push(i)
            }
            Wall.updateMentionsIndex()
        },
        switchOwner: function(e) {
            toggleClass(geByClass1("_ui_toggler", e), "on"), uiSearch.showProgress("wall_search"), cur.options.params.owners_only = cur.options.params.owners_only ? null : 1,
                nav.change({
                    owners_only: cur.options.params.owners_only,
                    offset: null
                })
        },
        replyAsGroup: function(e) {
            return hasClass(e, "checkbox_official") ? (checkbox(e), e.tt && e.tt.show && e.tt.show(), void(hasClass(e, "addpost_opt") && toggleClass("signed", "shown",
                isChecked(e)))) : !1
        },
        replyAsGroupOver: function(e, a, t) {
            if (!hasClass(e, "checkbox_official")) return !1;
            var o = function() {
                    return hasClass(e, "on") ? t : a
                },
                i = hasClass(e, "addpost_opt") ? [8, 7] : [0, 8];
            showTooltip(e, {
                text: o,
                black: 1,
                shift: i
            })
        },
        reportPost: function(e, a, t) {
            stManager.add(["privacy.js", "privacy.css"], function() {
                return Privacy.show(e, a, "report_" + t)
            })
        },
        parsePostId: function(e) {
            var a = e.match(/(-?\d+)(_?)(photo|video|note|topic|market|wall_reply|note_reply|photo_comment|video_comment|topic_comment|market_comment|)(\d+)/);
            return {
                type: a[3] || "wall",
                id: a[1] + "_" + a[4]
            }
        },
        likeIt: function(e, a, t, o) {
            if (stopEvent(o), vk.id && !cur.viewAsBox) {
                var i = wall.parsePostId(a),
                    l = i.type,
                    s = i.id,
                    r = e && gpeByClass("_post_content", e) || wall.domPost(s),
                    n = domByClass(r, "_like_wrap"),
                    d = (domByClass(n, "_icon"), domByClass(n, "_count")),
                    c = hasClass(n, "my_like"),
                    p = cur.wallType ? "feed" == cur.wallType ? "feed_" + cur.section : "wall_" + (cur.onepost ? "one" : (cur.wallType || "")
                        .indexOf("full_") ? "page" : "full") : cur.module;
                ajax.post("like.php", {
                    act: c ? "a_do_unlike" : "a_do_like",
                    object: l + s,
                    hash: t,
                    wall: 2,
                    from: p
                }, {
                    onDone: Wall.likeFullUpdate.pbind(e, a)
                });
                var u = val(ge("like_real_count_wall" + a) || d);
                Wall.likeUpdate(e, a, !c, intval(u) + (c ? -1 : 1)), cur.onWallLike && cur.onWallLike()
            }
        },
        likesShow: function(e, a, t) {
            t = t || {};
            var o = wall.parsePostId(a),
                i = o.type,
                l = o.id,
                s = i + l,
                r = e && gpeByClass("_post_content", e) || wall.domPost(l),
                n = t.share ? "_share_wrap" : "_like_wrap",
                d = domByClass(r, n),
                c = domByClass(d, "_icon"),
                p = r && domByClass(r, "_share_wrap");
            if (c && !cur.viewAsBox) {
                var u = 41,
                    _ = getXY(d)[0],
                    h = getXY(c)[0],
                    g = getSize(c, !0)[0],
                    m = h + g / 2 - _ - u;
                showTooltip(c.parentNode, {
                    url: "/like.php",
                    params: extend({
                        act: "a_get_stats",
                        object: s,
                        has_share: p ? 1 : ""
                    }, t.share ? {
                        published: 1
                    } : {}),
                    slide: 15,
                    shift: [-m, 6],
                    ajaxdt: 100,
                    showdt: 400,
                    hidedt: 200,
                    dir: "auto",
                    checkLeft: !0,
                    reverseOffset: 80,
                    tip: {
                        over: function() {
                            Wall.likesShow(e, a, t)
                        }
                    },
                    typeClass: "like_tt",
                    className: t.cl || ""
                })
            }
        },
        sharesShow: function(e, a, t) {
            Wall.likesShow(e, a, extend(t, {
                share: 1
            }))
        },
        sharesOpen: function(e, a, t) {
            stopEvent(e);
            var o = wall.parsePostId(a),
                i = o.type,
                l = o.id,
                s = i + l;
            showBox("/like.php", extend({
                act: "publish_box",
                object: s
            }, t))
        },
        customCur: function() {
            return window.wkcur && wkcur.shown ? wkcur : window.mvcur && mvcur.mvShown ? mvcur : window.pvcur && cur.pvShown ? pvcur : cur
        }
    },
    wall = Wall;
WallUpload = {
    photoUploaded: function(e, a) {
        var t = void 0 !== e.ind ? e.ind : e,
            o = (e.fileName ? e.fileName : e)
            .replace(/[&<>"']/g, ""),
            i = e.fileName ? t + "_" + e.fileName : e,
            l = ge("upload" + i + "_progress_wrap");
        l && hide(geByClass1("progress_x", l)), ajax.post("al_photos.php", extend({
            act: "choose_uploaded"
        }, a), {
            onDone: function(e, a) {
                cur.wallAddMedia.chooseMedia("photo", e, extend(a, {
                    upload_ind: t + "_" + o
                }))
            },
            onFail: WallUpload.uploadFailed.pbind(e)
        })
    },
    uploadFailed: function(e, a) {
        var t = void 0 !== e.ind ? e.ind : e,
            o = (e.fileName ? e.fileName : e)
            .replace(/[&<>"']/g, "");
        if ("fileApi" == Upload.types[t] && !Upload.options[t].wiki_editor) {
            var i, l = e.fileName ? t + "_" + e.fileName : e;
            cur.imMedia ? (re("upload" + l + "_progress_wrap"), i = cur.imMedia.lnkId, cur.addMedia[i].unchooseMedia()) : cur.addMedia && (re("upload" + l +
                "_progress_wrap"), i = (cur.attachMediaIndexes || {})[o], i && cur.addMedia[i].unchooseMedia())
        }
        topError("Upload failed", {
            dt: -1,
            type: 102,
            url: (ge("file_uploader_form" + t) || {})
                .action
        }), Upload.embed(t)
    },
    show: function() {
        if (cur.uploadInited) {
            "feed" == cur.wallType ? removeClass(cur.uploadWrap, "post_upload_min_wrap") : show(cur.uploadWrap)
        }
    },
    hide: function() {
        cur.uploadInited && ("feed" == cur.wallType ? addClass(cur.uploadWrap, "post_upload_min_wrap") : hide(cur.uploadWrap), hide("post_upload_dropbox"))
    },
    checkDragDrop: function() {
        var e = browser,
            a = floatval(browser.version);
        return e.msie && a >= 9 || e.mozilla && a >= 3.5 || e.chrome || e.safari ? (window.XMLHttpRequest || window.XDomainRequest) && (window.FormData || window.FileReader &&
            (window.XMLHttpRequest && XMLHttpRequest.sendAsBinary || window.ArrayBuffer && window.Uint8Array && (window.MozBlobBuilder || window.WebKitBlobBuilder ||
                window.BlobBuilder))) : !1
    },
    init: function() {
        removeEvent(bodyNode, "dragover dragenter");
        var data = cur.wallUploadOpts,
            field = ge("post_field");
        if (WallUpload.checkDragDrop()) {
            field.parentNode.insertBefore(cur.uploadWrap = ce("div", {
                className: "post_upload_wrap fl_r",
                innerHTML: '<div id="post_field_upload" class="post_upload"></div>'
            }), field);
            var submitBox = ge("submit_post_box");
            submitBox.insertBefore(ce("div", {
                id: "post_upload_dropbox",
                className: "post_upload_dropbox",
                innerHTML: '<div class="post_upload_dropbox_inner"><div class="post_upload_label drop_label">' + (data.opts.lang.wall_drop_photos_here ||
                    "Drop files here") + '</div><div class="post_upload_label release_label">' + (data.opts.lang.wall_release_photos_here ||
                    "Release button to attach files") + "</div></div>"
            }), submitBox.firstChild), Upload.init("post_field_upload", data.url, data.params, {
                file_name: "photo",
                file_size_limit: 5242880,
                file_types_description: "Image files (*.jpg, *.jpeg, *.png, *.gif)",
                file_types: "*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG;*.gif;*.GIF",
                file_input: null,
                accept: "image/jpeg,image/png,image/gif",
                file_match: data.opts.ext_re,
                lang: data.opts.lang,
                wiki_editor: 0,
                onUploadStart: function(e, a) {
                    var t = void 0 !== e.ind ? e.ind : e,
                        o = Upload.options[t];
                    "form" == Upload.types[t] && (geByClass1("file", ge("choose_photo_upload"))
                        .disabled = !0), "fileApi" == Upload.types[t] && (cur.notStarted && (boxQueue.hideLast(), delete cur.notStarted), o.multi_progress &&
                        this.onUploadProgress(e, 0, 0))
                },
                onUploadComplete: function(info, res) {
                    var params, i = void 0 !== info.ind ? info.ind : info,
                        fileName = (info.fileName ? info.fileName : info)
                        .replace(/[&<>"']/g, "");
                    try {
                        params = eval("(" + res + ")")
                    } catch (e) {
                        params = q2ajx(res)
                    }
                    return params.photos ? void WallUpload.photoUploaded(info, params) : void Upload.onUploadError(info)
                },
                onUploadProgress: function(e, a, t) {
                    var o = void 0 !== e.ind ? e.ind : e;
                    if ("fileApi" == Upload.types[o]) {
                        var i = (cur.attachMediaIndexes || {})[o];
                        if (void 0 === i || i && cur.addMedia[i].chosenMedia || cur.imMedia) {
                            var l = {
                                loaded: a,
                                total: t
                            };
                            e.fileName && (l.fileName = e.fileName.replace(/[&<>"']/g, "")), cur.wallAddMedia.showMediaProgress("photo", o, l)
                        }
                    }
                },
                onUploadError: WallUpload.uploadFailed,
                onCheckServerFailed: function() {
                    delete cur.uploadInited, WallUpload.hide()
                },
                onUploadCompleteAll: function(e) {
                    "form" == Upload.types[e] && Upload.embed(e)
                },
                onDragEnter: function() {
                    Wall.showEditPost()
                },
                noFlash: 1,
                multiple: 1,
                multi_progress: 1,
                max_files: 10,
                chooseBox: 1,
                clear: 1,
                type: "photo",
                max_attempts: 3,
                server: data.opts.server,
                error: data.opts.default_error,
                error_hash: data.opts.error_hash,
                dropbox: "post_upload_dropbox",
                label: data.opts.label,
                dragEl: bodyNode
            }), cur.uploadInited = !0, WallUpload.show(), cur.wallUploadFromDrag && (1 == cur.wallUploadFromDrag && show("post_upload_dropbox"), delete cur.wallUploadFromDrag)
        }
    }
};
var urlActiveExp =
    /(?:([!()?., \n\r\t \u00A0]|^)((https?:\/\/)?((?:[a-z0-9_\-]+\.)+(?:[a-z]{2,7}|xn--p1ai|xn--j1amh|xn--80asehdb|xn--80aswg))(\/.*?)?(\#.*?)?)(?:[\.!:;,\*\(\)]*(&nbsp;|[ \t\r\n \u00A0]))|([!()?., \n\r\t \u00A0]|^)((https?:\/\/)?((?:[a-z0-9�-����_\-]+\.)+(?:��|���|������|����|���))(\/.*?)?(\#.*?)?)(?:[\.!:;,\*\(\)]*(&nbsp;|[ \t\r\n \u00A0])))/i,
    urlInactiveExp =
    /(?:([!()?., \n\r\t \u00A0]|^)((https?:\/\/)?((?:[a-z0-9_\-]+\.)+(?:[a-z]{2,7}|xn--p1ai|xn--j1amh|xn--80asehdb|xn--80aswg))(\/.*?)?(\#.*?)?)(?:[\.!:;,\*\(\)&]*(&nbsp;|[ \t\r\n \u00A0]|$))|([!()?., \n\r\t \u00A0]|^)((https?:\/\/)?((?:[a-z0-9�-����_\-]+\.)+(?:��|���|������|����|���))(\/.*?)?(\#.*?)?)(?:[\.!:;,\*\(\)&]*(&nbsp;|[ \t\r\n \u00A0]|$)))/i;
Composer = {
    init: function(e, a) {
        if (!(e = ge(e))) return null;
        var t = data(e, "composer");
        return t ? t : (t = {
            input: e,
            inited: !1,
            options: a
        }, data(e, "composer", t), e.parentNode.insertBefore(t.wddWrap = ce("div", {
            className: "composer_wdd clear_fix " + (a.wddClass || ""),
            id: e.id + "_composer_wdd",
            innerHTML: '<input type="hidden" id="' + e.id + '_composer_wdd_term"/>'
        }, {
            width: a.width || getSize(e)[0]
        }), e.nextSibling), t.wddInput = t.wddWrap.firstChild, t.wdd = WideDropdown.initSelect(t.wddWrap, extend({
            text: t.wddInput,
            input: e,
            url: "hints.php",
            params: {
                act: "a_json_friends",
                from: "composer"
            },
            noResult: a.lang.noResult || "",
            introText: a.lang.introText || "",
            onItemSelect: Composer.onItemSelect.bind(Composer)
                .pbind(t)
        }, a.wddOpts || {})), e.dd = t.wddWrap.id, Composer.initEvents(t), a.media && (t.addMedia = new MediaSelector(a.media.lnk, a.media.preview, a.media.types,
            a.media.options)), setStyle(t.wddWrap, "width", ""), t.inited = !0, t)
    },
    initEvents: function(e) {
        addEvent(e.input, "keyup keydown keypress", Composer.onKeyEvent.pbind(e)), addEvent(e.input, "click mousedown mouseup focus blur paste", Composer.onMouseEvent.pbind(
            e))
    },
    destroy: function(e) {
        WideDropdown.deinit(e.wddWrap), cleanElems(e.input, e.wddWrap), re(e.wddWrap), e.inited = !1, e.addMedia && e.addMedia.destroy(), data(e.input, "composer", null)
    },
    onKeyEvent: function(e, a) {
        var t = e.wdd && inArray(a.keyCode, [KEY.UP, KEY.DOWN, KEY.RETURN]);
        if ("keypress" == a.type || "keydown" == a.type) {
            if (a.keyCode == KEY.RETURN || 10 == a.keyCode) {
                if (e.select && e.select.isVisible()) return triggerEvent(document, a.type, a), cancelEvent(a);
                if (a.ctrlKey && isFunction(e.options.onSubmit)) return !0
            }
            if (a.keyCode == KEY.TAB) {
                var o = e.input,
                    i = window.Emoji ? Emoji.editableVal(o) : "",
                    l = Composer.getCursorPosition(o);
                if (curValue = i.substr(0, l) + "" + i.substr(l), matches = curValue.match(/^[\s\S]*(@|\*)[\S]+\s*\([\s\S]*?\001[\s\S]*?\)\s*/), matches) {
                    var s = matches[0].length - 1;
                    return elfocus(e.input, s, s), cancelEvent(a)
                }
            }
            var r = 0;
            for (var n in e.wdd.shown) r += 1;
            if (t && isVisible(e.wdd.listWrap) && r) return a.type == (browser.opera ? "keypress" : "keydown") && WideDropdown._textEvent(a), cancelEvent(a)
        }
        if ("keyup" == a.type && !t) {
            if (65 == a.keyCode && a.ctrlKey) return;
            e.wdd && inArray(a.keyCode, [KEY.SPACE, KEY.HOME, 190, 191, 78, 55, 49]) && Composer.hideSelectList(e), Composer.updateAutoComplete(e, a)
        }
    },
    onMouseEvent: function(e, a) {
        return "blur" == a.type ? void Composer.hideSelectList(e) : (("focus" == a.type || "click" == a.type) && Composer.updateAutoComplete(e, a), void("paste" == a.type &&
            setTimeout(Composer.updateAutoComplete.pbind(e, a), 0)))
    },
    updateAutoComplete: function(e, a) {
        var t = e.input,
            o = window.Emoji ? Emoji.editableVal(t) : val(t),
            i = o,
            l = Math.max(i.lastIndexOf("@"), i.lastIndexOf("*")),
            s = l > -1 ? i.substr(l + 1) : !1;
        s && s.match(/&nbsp;|[,\.\(\)\?\!\s\n \u00A0]|\#/) && (s = !1), e.curValue = o, e.curTerm = s, e.curPos = l, val(e.wddInput, s), Composer.toggleSelectList(e), (
            "keyup" == a.type || "paste" == a.type) && (e.options.onValueChange && e.options.onValueChange(i, "keyup" != a.type), e.addMedia && e.addMedia.checkMessageURLs(
            i, "keyup" != a.type), e.options.checkLen && e.options.checkLen(o))
    },
    toggleSelectList: function(e) {
        var a = e.curTerm;
        a === !1 ? Composer.hideSelectList(e) : Composer.showSelectList(e, a)
    },
    hideSelectList: function(e) {
        e.wddInput.focused = !1, WideDropdown._hideList(e.wdd)
    },
    showSelectList: function(e, a) {
        e.wddInput.focused = !0, WideDropdown.items(e.wdd.id, cur.wallMentions || []), WideDropdown._updateList(e.wdd, !1, a)
    },
    onItemSelect: function(e, a) {
        if (!a) return !1;
        var t, o, i = a[2].replace("@", ""),
            l = a[1],
            s = e.curValue.substr(0, e.curPos),
            r = e.curValue.substr(e.curPos);
        i || (i = itemId > 0 ? "id" + itemId : "club" + Math.abs(itemId));
        var n = s.match(/\#[\w_\.\u0400-\u04FF]+$/i) ? !0 : !1,
            d = window.Emoji && void 0 !== e.input.emojiId;
        return d || (l = replaceEntities(l)), cur.selNum = (cur.selNum || 0) + 1, r = r.replace(/^(@|\*)[^\s]*(?:\s+\((?:(.*?)\))?\s*)?/, function(e, a, s) {
            var r = a + i + " ";
            return n ? t = o = r.length : (r += "(" + (d ? '<span id="tmp_sel_' + cur.selNum + '">' : ""), t = r.length, r += l.replace(/[\(\)\]\[]/g, ""), o = r.length,
                r += (d ? "</span>" : "") + ") "), r
        }), t += e.curPos, o += e.curPos, Composer.hideSelectList(e), d ? (Emoji.val(e.input, clean(s) + r), Emoji.focus(e.input), Emoji.editableFocus(e.input, ge(
            "tmp_sel_" + cur.selNum), !1, !0)) : (val(e.input, s + r), elfocus(e.input, t, o)), !1
    },
    getCursorPosition: function(e) {
        if (e.selectionStart) return e.selectionStart;
        if (!document.selection) return 0;
        var a = "",
            t = document.selection.createRange(),
            o = t.text,
            i = t.duplicate(),
            l = 0;
        try {
            i.moveToElementText(e)
        } catch (s) {
            return 0
        }
        return t.text = o + a, l = i.text.indexOf(a), t.moveStart("character", -1), t.text = "", browser.msie && -1 == l ? e.value.length : l
    },
    getSendParams: function(e, a, t) {
        var o = e.addMedia || {},
            i = o.chosenMedia || {},
            l = o && o.getMedias ? o.getMedias() : [],
            s = o.shareData || {},
            r = e && e.options.media && e.options.media.options.limit || 0,
            n = e.input,
            d = trim(window.Emoji ? Emoji.editableVal(n) : val(n)),
            c = {
                message: d
            },
            p = 0;
        if (isArray(i) && i.length && l.push(clone(i)), setStyle(bodyNode, {
                cursor: "default"
            }), l.length) {
            each(l, function(e, i) {
                if (isArray(i) && i.length) {
                    var l = this[0],
                        n = this[1];
                    if (p >= r && "postpone" != l) return !1;
                    switch (l) {
                        case "poll":
                            var u = o.pollData(t);
                            if (!u) return c.delayed = !0, !1;
                            intval(n) && (c.poll_id = intval(n)), n = u.media, delete u.media, c = extend(c, u);
                            break;
                        case "share":
                            if (s.failed || !s.url || !s.title && (!s.images || !s.images.length) && !s.photo_url) return cur.shareLastParseSubmitted && vkNow() -
                                cur.shareLastParseSubmitted < 2e3 ? (c.delayed = !0, !1) : void 0;
                            if (n = s.user_id + "_" + s.photo_id, s.images && s.images.length && !t) return o.uploadShare(a), c.delayed = !0, !1;
                            s.initialPattern && trim(d) == s.initialPattern && (c.message = ""), extend(c, {
                                url: s.url,
                                title: replaceEntities(s.title),
                                description: replaceEntities(s.description),
                                extra: s.extra,
                                extra_data: s.extraData,
                                photo_url: replaceEntities(s.photo_url),
                                open_graph_data: (s.openGraph || {})
                                    .data,
                                open_graph_hash: (s.openGraph || {})
                                    .hash
                            });
                            break;
                        case "page":
                            s.initialPattern && trim(d) == s.initialPattern && (c.message = "");
                            break;
                        case "postpone":
                            return void(c.postpone = cur.postponedLastDate = val("postpone_date" + o.lnkId))
                    }
                    this[3] && trim(d) == this[3] && (c.message = ""), c["attach" + (p + 1) + "_type"] = l, c["attach" + (p + 1)] = n, p++
                }
            })
        }
        return o.multi || c.postpone || !o.postponePreview || (c.postpone = cur.postponedLastDate = val("postpone_date" + o.lnkId)), c
    },
    reset: function(e) {
        var a = e.input,
            t = val(a),
            o = e.addMedia,
            i = {
                value: t
            };
        return window.Emoji ? Emoji.val(a, "") : a.innerHTML = "", o && (i.urlsCancelled = clone(o.urlsCancelled), o.unchooseMedia(), o.urlsCancelled = []), i
    },
    restore: function(e, a) {
        var t = e.input,
            o = Composer.reset(e);
        return val(t, a.value || ""), o
    }
}, window._postsSendTimer || (_postsSendTimer = setTimeout(Page.postsSend, 1e4));
try {
    stManager.done("page.js")
} catch (e) {}
