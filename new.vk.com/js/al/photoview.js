var Photoview = {
        MIN_WIDTH: 600,
        MIN_HEIGHT: 450,
        SIDE_COLUMN_WIDTH: 350,
        SIDE_MIN_GAP: 70,
        VERTICAL_MIN_GAP: 10,
        BOTTOM_BAR_HEIGHT: 52,
        SIDE_NAV_PANELS_MAX_WIDTH: 120,
        SIDE_NAV_PANELS_MIN_WIDTH: 25,
        blank: "/images/blank.gif",
        blankf: function() {},
        cacheSize: 3,
        allSizes: ["x", "y", "z"],
        genUrl: function(e, o) {
            return o.match(/\.[a-z]{3}$/i) || (o += ".jpg"), o.match(/https?:\/\//i) ? o : (e || "")
                .replace(/\/[a-z0-9_:\.]*$/i, "") + "/" + o
        },
        genData: function(e, o) {
            var t, r, a, i, p = "x" == o ? 3 : "y" == o ? 2 : "z" == o ? 1 : 0,
                v = ["w", "z", "y", "x"].slice(p);
            for (a = 0; 4 - p > a && (i = v[a], !(t = e[i + "_"])) && !(r = e[i + "_src"]); ++a);
            return t || (t = [r]), {
                src: Photoview.genUrl(e.base, t[0]),
                width: t[2] && t[1],
                height: t[1] && t[2]
            }
        },
        actionInfo: function() {
            return ge("pv_action_info") || domPN(cur.pvTags)
                .insertBefore(ce("div", {
                    id: "pv_action_info",
                    className: "pv_right_block"
                }), cur.pvTags)
        },
        locNav: function(e, o, t, r) {
            if (cur.pvListId == "newtag" + vk.id + (t.rev ? "/rev" : "") && t[0] == "albums" + vk.id && "added" == t.act) return Photoview.hide(r.hist), !1;
            if (t = nav.toStr(t), t.replace("?rev=1", "/rev") == cur.pvListId && cur.pvShown) return Photoview.hide(r.hist), !1;
            var a = t.match(/^photo(-?\d+_\d+)\??((all=1|newtag=\d+)(&rev=1)?|(rev=1&)?tag=\d+|rev=1)?$/);
            if (a) {
                var i = cur.pvListId;
                i && cur.pvShown || (i = "added" == nav.objLoc.act ? "newtag" + vk.id + (nav.objLoc.rev ? "/rev" : "") : nav.strLoc.replace("?rev=1", "/rev"));
                var p = cur.pvData[i];
                if (p)
                    for (var v = 0, n = p.length; n > v; ++v)
                        if (p[v] && p[v].id == a[1]) return Photoview.show(i, v, !1, cur.pvRoot), !1
            }
        },
        updateLocNav: function() {
            if (cur.pvRoot) {
                for (var e = 0, o = cur.nav.length; o > e; ++e)
                    if (cur.nav[e] == Photoview.locNav) return;
                cur.nav.push(Photoview.locNav)
            } else
                for (var e = 0, o = cur.nav.length; o > e; ++e) cur.nav[e] == Photoview.locNav && (cur.nav.splice(e, 1), --e, --o)
        },
        toggleOnPhotoControls: function(e) {
            e = !!e, toggle(cur.pvHHWrap, e), toggle(cur.pvFSWrap, e)
        },
        checkLayerVisibility: function() {
            return cur.pvShown ? !0 : (debugLog("layerqueue.hide from photoview"), layerQueue.hide(), addEvent(window, "resize", Photoview.onResize), addEvent(document,
                "keydown", Photoview.onKeyDown), addEvent(layerWrap, "click", Photoview.onLayerClick), boxQueue.hideAll(), setStyle(layerBG, {
                opacity: ""
            }), layers.show(), void(layers.fullhide = Photoview.hide))
        },
        emojiShowTT: function(e, o) {
            return void 0 === cur.pvEmoji ? !1 : Emoji.ttShow(cur.pvEmoji, e, o)
        },
        emojiHideTT: function(e, o) {
            return void 0 === cur.pvEmoji ? !1 : Emoji.ttHide(cur.pvEmoji, e, o)
        },
        onHHLikeClick: function(e) {
            var o = geByClass1("pv_hh_like");
            return toggleClass(o, "pv_liked"), 2 != e.button ? (Photoview.like(), cancelEvent(e)) : void 0
        },
        onHHMouseMove: throttle(function(e) {
            var o = getSize(cur.pvHH),
                t = getXY(cur.pvHH);
            t[0] += o[0] / 2, t[1] += o[1] / 2;
            var r = Math.sqrt((t[0] - e.pageX) * (t[0] - e.pageX) + (t[1] - e.pageY) * (t[1] - e.pageY)),
                a = 220 / r - 1;
            a = Math.min(1, Math.max(0, a)), setStyle(cur.pvHH, "opacity", Math.min(1, Math.max(0, a)))
        }, 60),
        toggleLightModeClass: function(e) {
            e = e ? cur.pvIsLightMode : !1, toggleClass(cur.pvBox, "pv_light_mode", !!e)
        },
        createLayer: function(e) {
            var o = "pv_dark";
            cur.pvFixed = bodyNode.appendChild(ce("div", {
                className: "pv_fixed fixed " + o,
                innerHTML: ""
            })), addClass(layerWrap, o), addClass(layerBG, o);
            var t = !!(cur.pvVideoTagsShown || cur.pvAlbumsShown || cur.pvAlbumShown || cur.pvPhotoTagShown);
            cur.pvIsLightMode = 0 == nav.objLoc[0].indexOf("blog/") || inArray(nav.objLoc[0], ["blog", "about"]);
            var r = Photoview.hhCheck() ? "" : ' style="display: none;"',
                a = (Photoview.canFullscreen() ? "" : ' style="display: none;"', cur.pvAlbumsShown ? cur.pvAlbumsData[cur.pvAlbumsShown].html : ""),
                i = cur.pvAlbumShown ? cur.pvAlbumData[cur.pvAlbumShown].html : "",
                p = cur.pvVideoTagsShown ? cur.pvVideoTagsData.html : "",
                v = t ? "display: none" : "",
                n = t ? "" : "display: none",
                s = cur.pvAlbumsShown ? "" : "display: none",
                c = cur.pvAlbumShown ? "" : "display: none",
                u = cur.pvVideoTagsShown ? "" : "display: none";
            cur.pvPhotoTagShown && (i = cur.pvPhotoTagData[cur.pvPhotoTagShown].html, c = ""), ge("pv_comments") && (cur.pvBackupComments = ge("pv_comments"), domPN(ge(
                    "pv_comments"))
                .removeChild(ge("pv_comments")));
            var l = '<div style="' + n +
                '" class="box_title_wrap box_grey"><div class="box_x_button" onclick="Photoview.hide(0)"></div><div class="box_title_controls"></div><div class="box_title"></div></div>',
                d = "onmouseenter=\"addClass(layer, 'pv_mouse_over_nav_panel')\" onmouseleave=\"removeClass(layer, 'pv_mouse_over_nav_panel')\"",
                h = '       <div class="pv_nav_panel" id="pv_nav_panel_right" ' + d +
                '>         <div class="pv_nav_panel_btn" id="pv_nav_close" onmousedown="cur.pvClicked = true; Photoview.onLayerClick(event, true);" onclick="Photoview.onLayerClick(event);"><div></div></div>         <div class="pv_nav_panel_btn pv_nav_arrow" id="pv_nav_right" onmousedown="cur.pvClicked = true; Photoview.show(false, cur.pvIndex + 1, event);"><div></div></div>       </div>       <div class="pv_nav_panel" id="pv_nav_panel_left" ' +
                d +
                '>         <div class="pv_nav_panel_btn pv_nav_arrow" id="pv_nav_left" onmousedown="cur.pvClicked = true; Photoview.show(false, cur.pvIndex - 1, event);"><div></div></div>       </div>     ',
                g = cur.pvIsLightMode ? "" : '      <div class="pv_hh_like_wrap" ' + r +
                ' onclick="return Photoview.show(false, cur.pvIndex + 1, event);" >         <div class="pv_hh_like" onclick="return Photoview.onHHLikeClick(event)">           <div class="pv_hh_like_base"></div>           <div class="pv_hh_like_liked"></div>         </div>       </div>     ',
                m = cur.pvIsLightMode ? "" :
                '      <div class="pv_fs_wrap" onclick="return Photoview.show(false, cur.pvIndex + 1, event);">         <div class="pv_fs_btn" onclick="return Photoview.fullscreen(event);"><div></div></div>       </div>     ',
                _ =
                '      <div class="pv_bottom_info clear_fix">         <div class="pv_bottom_info_left"><span class="pv_album_name" onmouseover="setTitle(this)"></span><span class="pv_counter"></span></div>         ' +
                (cur.pvIsLightMode ? "" : '<div class="pv_bottom_actions"></div>') + "       </div>",
                w = cur.pvIsLightMode ? "" :
                '      <div class="pv_narrow_column_wrap">        <div class="pv_narrow_column_cont wall_module">          <div class="narrow_column" id="pv_narrow"></div>        </div>      </div>',
                f = getProgressHtml("pv_image_progress");
            layer.innerHTML = '    <div class="pv_cont">    ' + h +
                '       <div id="pv_box" onclick="cur.pvClicked = true;" onmouseenter="removeClass(layer, \'pv_mouse_over_close\')" onmouseleave="addClass(layer, \'pv_mouse_over_close\')">         ' +
                l + '        <div id="pv_photo_wrap" class="clear_fix pv_photo_wrap" style="' + v +
                '">           <div class="no_select pv_data" onmousemove="Photoview.onHHMouseMove(event)">                      <div id="pv_tag_info" class="clear_fix">               <div class="pv_tag_info_buttons_wrap"></div>               <div class="pv_tag_info_text"></div>             </div>            <div id="pv_tag_frame"></div>            <div id="pv_tag_faded"></div>            <div id="pv_tag_person" onmouseout="Photoview.hideTag()"></div>            <div class="pv_img_area_wrap">               <div class="pv_img_progress_wrap">' +
                f +
                '</div>               <a onmouseout="Photoview.hideTag()" onmousedown="if (!cur.pvTagger && checkEvent(event) === false) return Photoview.show(false, cur.pvIndex + 1, event);" onselectstart="return cancelEvent(event);" onclick="return checkEvent(event)" href="" id="pv_photo"></a>            </div>             ' +
                g + m + _ + "          </div>" + w + '        </div>        <div id="pv_albums_wrap" class="pv_white_bg photos_container_albums" style="' + s + '">' + a +
                '</div>        <div id="pv_album_wrap" class="pv_white_bg" style="' + c + '">' + i + '</div>        <div id="pv_vtagged_wrap" class="pv_white_bg" style="' + u +
                '">' + p + "</div>      </div>        </div>", cur.pvYourComment && domPN(ge("pv_your_comment"))
                .replaceChild(cur.pvYourComment, ge("pv_your_comment")), extend(cur, {
                    pvCont: domFC(layer),
                    pvBox: ge("pv_box"),
                    pvTitle: geByClass1("box_title_wrap"),
                    pvTitleText: geByClass1("box_title"),
                    pvNavPanels: geByClass("pv_nav_panel"),
                    pvNavClose: ge("pv_nav_close"),
                    pvNavRight: ge("pv_nav_right"),
                    pvNavLeft: ge("pv_nav_left"),
                    pvNavPanelLeft: ge("pv_nav_panel_left"),
                    pvNavPanelRight: ge("pv_nav_panel_right"),
                    pvNarrowColumnWrap: geByClass1("pv_narrow_column_wrap"),
                    pvNarrowColumn: geByClass1("pv_narrow_column_cont"),
                    pvLeftNav: ge("pv_left_nav"),
                    pvRightNav: ge("pv_right_nav"),
                    pvPhotoWrap: ge("pv_photo_wrap"),
                    pvAlbumWrap: ge("pv_album_wrap"),
                    pvAlbumsWrap: ge("pv_albums_wrap"),
                    pvVTagsWrap: ge("pv_vtagged_wrap"),
                    pvTagInfo: ge("pv_tag_info"),
                    pvTagFrame: ge("pv_tag_frame"),
                    pvTagFaded: ge("pv_tag_faded"),
                    pvTagPerson: ge("pv_tag_person"),
                    pvPhoto: ge("pv_photo"),
                    pvCommentsData: ge("pv_comments_data"),
                    pvTagInfoText: geByClass1("pv_tag_info_text"),
                    pvTagInfoButtons: geByClass1("pv_tag_info_buttons_wrap"),
                    pvBottomInfo: geByClass1("pv_bottom_info"),
                    pvAlbumName: geByClass1("pv_album_name"),
                    pvCounter: geByClass1("pv_counter"),
                    pvBottomActions: geByClass1("pv_bottom_actions"),
                    pvBottomLeft: geByClass1("pv_bottom_info_left"),
                    pvNarrow: ge("pv_narrow"),
                    pvWide: ge("pv_wide"),
                    pvHHWrap: geByClass1("pv_hh_like_wrap"),
                    pvHH: geByClass1("pv_hh_like"),
                    pvImgProgress: ge("pv_image_progress"),
                    pvFSWrap: geByClass1("pv_fs_wrap"),
                    pvFS: ge("pv_fs"),
                    pvFSFg: ge("pv_fs_fg"),
                    pvActions: ge("pvs_actions"),
                    pvYourComment: ge("pv_your_comment"),
                    pvAddMedia: domFC(ge("pv_add_media")),
                    pvMediaPreview: ge("pv_media_preview"),
                    pvCommentSend: ge("pv_comment_send"),
                    pvComment: ge("pv_comment"),
                    pvAsGroup: ge("pv_reply_as_group")
                }), addEvent(cur.pvPhoto, "mousemove", Photoview.onMouseMove), addEvent(layerWrap, "scroll", Photoview.scrollResize), Photoview.updateSize(), t && uiScrollBox.init(!
                    1, {
                        parent: layerWrap
                    })
        },
        doShowAlbums: function(e, o) {
            if (e = intval(e), !o || 2 != o.button && 3 != o.which) {
                if (clearTimeout(window.__pvhideTimer), __afterFocus) return o ? cancelEvent(o) : !1;
                if (cur.pvTagger && (Phototag.stopTag(), o !== !1)) return o ? cancelEvent(o) : !1;
                var t = (cur.pvAlbumsData || {})[e];
                if (t) {
                    Photoview.checkLayerVisibility(), cur.pvRoot = !1, Photoview.updateLocNav(), Photoview.toggleLightModeClass(!1), o && o.pageX && o.pageY && extend(cur, {
                        pvOldX: o.pageX,
                        pvOldY: o.pageY,
                        pvOldT: vkNow()
                    }), cur.pvShown = !0, cur.pvAlbumsShown = e, cur.pvFixed && val("pva_owner") == e || extend(cur, {
                        pvaOffset: t.opts.offset,
                        pvaCount: t.opts.count,
                        pvaPhotosOffset: t.opts.photos_offset,
                        pvaPhotosCount: t.opts.photos_count,
                        pvShowAllAlbums: !1
                    }), cur.pvFixed ? (val("pva_owner") != e && val(cur.pvAlbumsWrap, t.html), isVisible(cur.pvAlbumsWrap) || (hide(cur.pvPhotoWrap, cur.pvAlbumWrap, cur.pvVTagsWrap),
                        show(cur.pvAlbumsWrap), Photoview.updateSize(), layerWrap.scrollTop = val("pva_scroll"))) : Photoview.createLayer(!0), uiScrollBox.show(), show(cur
                        .pvTitle), show(cur.pvAlbumsWrap), cur.pvTitleText.innerHTML = t.opts.summary, cur.pvListId && "temp" != cur.pvListId ? extend(cur, {
                        pvOldListId: cur.pvListId,
                        pvOldIndex: cur.pvIndex
                    }) : (!browser.msie || browser.version > 8) && (cur.pvClicked = !1), Photoview.toggleNavControls(), cur.pvListId = !1;
                    var r = extend(nav.objLoc, {
                        z: "albums" + cur.pvAlbumsShown
                    });
                    return nav.strLoc != nav.toStr(r) && (cur.pvNoHistory || ++cur.pvHistoryLength, nav.setLoc(r)), Photoview.updatePeriods(), o ? cancelEvent(o) : !1
                }
            }
        },
        jumpToAlbums: function(e) {
            return "temp" == cur.pvListId && (cur.pvCancelLoad(), cur.pvJumpTo.z == "albums" + val("pva_owner") && cur.pvJumpTo.z == nav.objLoc.z) ? void showAlbums(val(
                "pva_owner"), {
                noHistory: !0
            }) : (e && (cur.pvListId = !1), extend(cur, {
                pvJumpFrom: !1,
                pvJumpSteps: 0
            }), void nav.change(cur.pvJumpTo))
        },
        jumpToAlbum: function(e) {
            return "temp" == cur.pvListId && (cur.pvCancelLoad(), cur.pvJumpTo.z == "album" + val("pvsa_album") && cur.pvJumpTo.z == nav.objLoc.z) ? void showAlbum(val(
                "pvsa_album"), {
                noHistory: !0
            }) : (e && (cur.pvListId = !1), extend(cur, {
                pvJumpFrom: !1,
                pvJumpSteps: 0
            }), void nav.change(cur.pvJumpTo))
        },
        jumpToTagged: function(e) {
            return "temp" == cur.pvListId && (cur.pvCancelLoad(), cur.pvJumpTo.z == "tag" + val("pvsa_tag") && cur.pvJumpTo.z == nav.objLoc.z) ? void showTagged(val("pvsa_tag"), {
                noHistory: !0
            }) : (cur.pvJumpTo.z == "tag" + val("pvsa_tag") && (cur.pvJumpTo.z = "photo_" + cur.pvJumpTo.z), e && (cur.pvListId = !1), extend(cur, {
                pvJumpFrom: !1,
                pvJumpSteps: 0
            }), void nav.change(cur.pvJumpTo))
        },
        doShowAlbum: function(e, o) {
            if (!o || 2 != o.button && 3 != o.which) {
                if (clearTimeout(window.__pvhideTimer), __afterFocus) return o ? cancelEvent(o) : !1;
                if (cur.pvTagger && (Phototag.stopTag(), o !== !1)) return o ? cancelEvent(o) : !1;
                var t = (cur.pvAlbumData || {})[e];
                if (t) {
                    Photoview.checkLayerVisibility(), cur.pvRoot = !1, Photoview.updateLocNav(), Photoview.toggleLightModeClass(!1), o && o.pageX && o.pageY && extend(cur, {
                            pvOldX: o.pageX,
                            pvOldY: o.pageY,
                            pvOldT: vkNow()
                        }), cur.pvShown || cur.pvAlbumShown || cur.pvAlbumsShown || layerQueue.push(), uiScrollBox.show(), cur.pvShown = !0, cur.pvAlbumShown = e, cur.pvFixed &&
                        val("pvsa_album") == e || extend(cur, {
                            pvsaOffset: t.opts.offset,
                            pvsaCount: t.opts.count
                        }), cur.pvFixed ? (val("pvsa_album") != e && val(cur.pvAlbumWrap, t.html), isVisible(cur.pvAlbumWrap) || (hide(cur.pvPhotoWrap, cur.pvAlbumsWrap, cur.pvVTagsWrap),
                            show(cur.pvAlbumWrap), Photoview.updateSize(), layerWrap.scrollTop = val("pvsa_scroll"))) : Photoview.createLayer(), show(cur.pvTitle), show(cur.pvAlbumWrap);
                    var r = t.opts.author || "";
                    if (cur.pvTitleText.innerHTML = (r ? r + '<span class="divider"></span> ' : "") + t.opts.summary, cur.pvListId && "temp" != cur.pvListId) {
                        extend(cur, {
                            pvOldListId: cur.pvListId,
                            pvOldIndex: cur.pvIndex
                        });
                        var a = (cur.pvListId || "")
                            .split("/");
                        a[0] && Photoview.showRepeat(ge(a[0]))
                    } else(!browser.msie || browser.version > 8) && (cur.pvClicked = !1);
                    Photoview.toggleNavControls(), cur.pvListId = !1;
                    var i = extend(nav.objLoc, {
                        z: "album" + cur.pvAlbumShown
                    });
                    return nav.strLoc != nav.toStr(i) && (cur.pvNoHistory || ++cur.pvHistoryLength, nav.setLoc(i)), o ? cancelEvent(o) : !1
                }
            }
        },
        doShowTagged: function(e, o) {
            if (e = intval(e), !o || 2 != o.button && 3 != o.which) {
                if (clearTimeout(window.__pvhideTimer), __afterFocus) return o ? cancelEvent(o) : !1;
                if (cur.pvTagger && (Phototag.stopTag(), o !== !1)) return o ? cancelEvent(o) : !1;
                var t = (cur.pvPhotoTagData || {})[e];
                if (t) {
                    if (Photoview.checkLayerVisibility(), cur.pvRoot = !1, Photoview.updateLocNav(), Photoview.toggleLightModeClass(!1), o && o.pageX && o.pageY && extend(cur, {
                            pvOldX: o.pageX,
                            pvOldY: o.pageY,
                            pvOldT: vkNow()
                        }), cur.pvShown = !0, cur.pvPhotoTagShown = e, cur.pvFixed && val("pvsa_tag") == e || extend(cur, {
                            pvsaOffset: t.opts.offset,
                            pvsaCount: t.opts.count
                        }), cur.pvFixed ? (val("pvsa_tag") != e && val(cur.pvAlbumWrap, t.html), isVisible(cur.pvAlbumWrap) || (hide(cur.pvPhotoWrap, cur.pvAlbumsWrap, cur.pvVTagsWrap),
                            show(cur.pvAlbumWrap), Photoview.updateSize(), layerWrap.scrollTop = val("pvsa_scroll"))) : Photoview.createLayer(), show(cur.pvTitle), show(cur.pvAlbumWrap),
                        cur.pvTitleText.innerHTML = t.opts.summary, cur.pvListId && "temp" != cur.pvListId) {
                        extend(cur, {
                            pvOldListId: cur.pvListId,
                            pvOldIndex: cur.pvIndex
                        });
                        var r = (cur.pvListId || "")
                            .split("/");
                        r[0] && Photoview.showRepeat(ge(r[0]))
                    } else(!browser.msie || browser.version > 8) && (cur.pvClicked = !1);
                    Photoview.toggleNavControls(), cur.pvListId = !1;
                    var a = extend(nav.objLoc, {
                        z: "photo_tag" + cur.pvPhotoTagShown
                    });
                    return nav.strLoc != nav.toStr(a) && (cur.pvNoHistory || ++cur.pvHistoryLength, nav.setLoc(a)), o ? cancelEvent(o) : !1
                }
            }
        },
        doShowVideoTags: function(e, o) {
            if (!o || 2 != o.button && 3 != o.which) {
                if (clearTimeout(window.__pvhideTimer), __afterFocus) return o ? cancelEvent(o) : !1;
                if (cur.pvTagger && (Phototag.stopTag(), o !== !1)) return o ? cancelEvent(o) : !1;
                var t = cur.pvVideoTagsData;
                if (t) {
                    Photoview.checkLayerVisibility(), cur.pvRoot = !1, Photoview.updateLocNav(), o && o.pageX && o.pageY && extend(cur, {
                        pvOldX: o.pageX,
                        pvOldY: o.pageY,
                        pvOldT: vkNow()
                    }), cur.pvShown = !0, cur.pvVideoTagsShown = e, cur.pvFixed && val("pvsa_vtag") == e || extend(cur, {
                        pvsaOffset: t.opts.offset,
                        pvsaCount: t.opts.count
                    }), t.opts.lang && (cur.lang = extend(cur.lang || {}, t.opts.lang)), cur.pvFixed ? (val("pvsa_vtag") != e && val(cur.pvVTagsWrap, t.html), isVisible(
                        cur.pvVTagsWrap) || (hide(cur.pvPhotoWrap, cur.pvAlbumsWrap, cur.pvAlbumWrap), show(cur.pvVTagsWrap), Photoview.updateSize(), layerWrap.scrollTop =
                        val("pvsa_scroll"))) : Photoview.createLayer(), hide(cur.pvLeft, cur.pvLeftNav, cur.pvRightNav, cur.pvClose), cur.pvListId = !1;
                    var r = extend(nav.objLoc, {
                        z: "video_tag" + cur.pvVideoTagsShown
                    });
                    return nav.strLoc != nav.toStr(r) && (cur.pvNoHistory || ++cur.pvHistoryLength, nav.setLoc(r)), o ? cancelEvent(o) : !1
                }
            }
        },
        toggleNavControls: function(e) {
            each([cur.pvNavRight, cur.pvNavLeft, cur.pvNavClose, cur.pvNavPanelLeft, cur.pvNavPanelRight], function() {
                hide(this)
            }), isString(e) && (e = e.split(" ")), each(e || [], function(e, o) {
                switch (o) {
                    case "close":
                        show(cur.pvNavClose, cur.pvNavPanelRight);
                        break;
                    case "left":
                        show(cur.pvNavLeft, cur.pvNavPanelLeft);
                        break;
                    case "right":
                        show(cur.pvNavRight, cur.pvNavPanelRight)
                }
            })
        },
        show: function(e, o, t, r) {
            if (!t || 2 != t.button && 3 != t.which) {
                if (Photoview.destroyPeriod(), clearTimeout(window.__pvhideTimer), "temp" == e && cur.pvShown) {
                    if (cur.pvListId && "temp" != cur.pvListId) return;
                    cur.pvWasShown = !0
                } else cur.pvWasShown = !1;
                if (__afterFocus) return t ? cancelEvent(t) : !1;
                if (cur.pvTagger && (Phototag.stopTag(), t !== !1)) return t ? cancelEvent(t) : !1;
                if (e === !1) {
                    if (cur.pvAlbumsShown || cur.pvAlbumShown || cur.pvPhotoTagShown) {
                        if (cur.pvOldListId) return extend(cur, {
                            pvJumpTo: cur.pvOldJumpTo,
                            pvJumpFrom: cur.pvOldJumpFrom,
                            pvJumpSteps: cur.pvOldJumpSteps
                        }), o == cur.pvOldIndex + 1 && ++cur.pvOldIndex, Photoview.show(cur.pvOldListId, cur.pvOldIndex, t, r);
                        Photoview.toggleNavControls()
                    }
                    e = cur.pvListId
                }
                var a = ((cur.pvData || {})[e] || {})
                    .length,
                    i = e != cur.pvListId;
                if (a) {
                    t && t.pageX && t.pageY && extend(cur, {
                            pvOldX: t.pageX,
                            pvOldY: t.pageY,
                            pvOldT: vkNow()
                        }), (cur.pvOptions || {})
                        .queue && (debugLog("pushing in photoview.show"), layerQueue.push(), cur.pvOptions.queue = !1, cur.pvHistoryLength = 0), Photoview.checkLayerVisibility() ||
                        (i = !0);
                    var p = o + (0 > o ? a : o >= a ? -a : 0),
                        v = i ? 1 : cur.pvIndex > o ? -1 : 1;
                    if (!i && !cur.pvCanvas) {
                        if (cur.pvJumpTo) {
                            cur.pvJumpSteps += o - cur.pvIndex;
                            var n = p === cur.pvJumpFrom && cur.pvJumpSteps >= a;
                            if (n) return extend(cur, {
                                pvOldJumpFrom: cur.pvJumpFrom,
                                pvOldJumpSteps: cur.pvJumpSteps - (o - cur.pvIndex),
                                pvOldJumpTo: cur.pvJumpTo
                            }), Photoview.jumpToAlbums(cur.pvJumpSteps < 0);
                            if (v > 0 && (p < cur.pvJumpFrom && p + 4 > cur.pvJumpFrom || p < cur.pvJumpFrom + a && p + 4 > cur.pvJumpFrom + a)) {
                                vkImage()
                                    .src = stManager._srcPrefix(".css") + "/images/icons/post_hh" + (window.devicePixelRatio >= 2 ? "_2x" : "") + ".png?3";
                                var s = cur.pvJumpTo.z.match(/^albums(-?\d+)$/);
                                s && (cur.pvAlbumsData || (cur.pvAlbumsData = {}), cur.pvAlbumsData[s[1]] || (cur.pvAlbumsData[s[1]] = "loading", ajax.post("al_photos.php", {
                                    act: "show_albums",
                                    owner: s[1],
                                    other: 1
                                }, {
                                    onDone: Photoview.loadedAlbums
                                })))
                            }
                            cur.pvJumpSteps <= -a && (cur.pvJumpSteps += a)
                        }
                        if (1 == a && o != cur.pvIndex && ("temp" != e || cur.pvOptions.temp_final)) return Photoview.hide(), t ? cancelEvent(t) : !1
                    }
                    i && "temp" != e && (cur.pvJumpFrom === !1 && (cur.pvJumpFrom = p), cur.pvRoot = r, Photoview.updateLocNav()), o = p;
                    var c = cur.pvData[e][o];
                    if (c && (c.x_ || c.x_src)) {
                        cur.pvIndex = o, cur.pvShown = !0, cur.pvAlbumsShowing = cur.pvAlbumsShown = !1, cur.pvAlbumShowing = cur.pvAlbumShown = !1, cur.pvPhotoTagShowing =
                            cur.pvPhotoTagShown = !1, cur.pvVideoTagShowing = cur.pvVideoTagsShown = !1, cur.pvListId = e, Photoview.calculateVeryBig();
                        var u = "";
                        switch (cur.pvVeryBig) {
                            case 3:
                                u = "w";
                                break;
                            case 2:
                            case 1:
                                u = "z";
                                break;
                            default:
                                u = "y"
                        }
                        return cur.pvCurData = Photoview.genData(c, u), cur.pvFixed || Photoview.createLayer(), cur.pvCurrent && (cur.pvCurrent.onload = Photoview.blankf, cur.pvCurrent
                                .src = Photoview.blank), delete cur.pvCurrent, cur.pvCurrent = vkImage(), cur.pvCurrent.onload = Photoview.preload.pbind(o, v), cur.pvCurrent.src =
                            cur.pvCurData.src, i && Photoview.toggleNavControls(a > 1 ? "left right close" : "close"), hideProgress(cur.pvCounter), "temp" != e || cur.pvOptions
                            .temp_final ? "temp" == e && cur.pvOptions.temp_final && cur.pvOptions.temp_summary || (cur.pvCounter.innerHTML = a > 1 ? getLang(
                                    "photos_photo_counter_num_of_N")
                                .replace("%s", cur.pvIndex + 1)
                                .replace(/%s|{count}/, a) : "") : showProgress(cur.pvCounter, "", "pr_baw"), cur.pvCurPhoto = c, cur.pvCurData.width && cur.pvCurData.height ?
                            Photoview.doShow() : (cur.pvCurData = cur.pvCurrent, cur.pvTimerPassed = 0, clearTimeout(cur.pvTimer), cur.pvTimer = setTimeout(Photoview.doShow, 0)),
                            cur.pvBox && toggleClass(cur.pvBox, "photos_is_albums_view", !!cur.pvAlbumsShown), t ? cancelEvent(t) : !1
                    }
                }
            }
        },
        _checkWebGL: function() {
            function e() {
                try {
                    var e = document.createElement("canvas");
                    e.width = e.height = 100;
                    var o = {
                        preserveDrawingBuffer: !0,
                        premultipliedAlpha: !1
                    };
                    return !!window.WebGLRenderingContext && (e.getContext("webgl", o) || e.getContext("experimental-webgl", o))
                } catch (t) {
                    return !1
                }
            }
            return navigator.userAgent.indexOf("Windows NT 5.1") >= 0 ? -1 : e() ? 1 : browser.safari ? (debugLog("photo editor: webgl enable needed"), -2) : (debugLog(
                "photo editor: webgl not suported"), -1)
        },
        openEditor: function(e, o) {
            function t(t) {
                return t || debugLog("photo editor: CORS not available (" + o + ")"), showBox("al_photos.php", {
                    act: "edit_photo",
                    photo: e ? e : cur.pvData[cur.pvListId][cur.pvIndex].id,
                    webgl: Photoview._checkWebGL(),
                    cors: t
                }, {
                    dark: 1,
                    stat: ["ui_controls.css", "ui_controls.js"]
                })
            }
            o = o ? o : cur.pvCurData.src;
            var r = vkImage();
            r.onerror = function() {
                t(0)
            }, r.onload = function() {
                t(1)
            }, r.crossOrigin = "", r.src = o
        },
        showSpamActions: function() {
            show(geByClass1("pv_more_acts_hidden")), cur.pvMoreActionsTooltip.updatePosition()
        },
        doShow: function() {
            var e = cur.pvCurData;
            if ((!e.width || !e.height) && cur.pvTimerPassed < 5e3) return clearTimeout(cur.pvTimer), cur.pvTimerPassed += 100, void(cur.pvTimer = setTimeout(Photoview.doShow,
                100));
            if (cur.pvShown) {
                if (cur.pvCanvas) return void Photoview.pvCanvasSet();
                if (Photoview.toggleLightModeClass(!0), isVisible(cur.pvAlbumsWrap) && (val("pva_scroll", layerWrap.scrollTop), hide(cur.pvAlbumsWrap), show(cur.pvPhotoWrap),
                        Photoview.updateSize()), isVisible(cur.pvAlbumWrap) && (val("pvsa_scroll", layerWrap.scrollTop), hide(cur.pvAlbumWrap), show(cur.pvPhotoWrap),
                        Photoview.updateSize()), uiScrollBox.hide(), hide(cur.pvTitle), cur.pvPhoto.innerHTML = '<img src="' + e.src + '" />', Photoview.updatePhotoDimensions(),
                    "temp" == cur.pvListId) return hide(cur.pvCommentsData), Photoview.toggleOnPhotoControls(!1), void Photoview.updateVerticalPosition();
                Photoview.toggleOnPhotoControls(!0);
                var o = cur.pvCurPhoto,
                    t = o.commshown >= 0 ? !1 : -o.commshown;
                !o.taginfo && o.actions.tag && o.tags[0] < cur.pvMaxTags ? "" : ' style="display: none"';
                addClass(cur.pvHH, "no_transition"), toggleClass(cur.pvHH, "pv_liked", !!o.liked), setTimeout(removeClass.pbind(cur.pvHH, "no_transition"), 2), cur.pvTagger &&
                    Phototag.stopTag(), Photoview.hideTag(!0), (e.width < 200 || e.height < 200) && (o.actions.prof = !1, o.actions.dialog = !1);
                var r = "";
                if (("NA" != o.album && 2 != t || o.graffiti) && (r = o.album), !cur.pvIsLightMode) {
                    var a = "";
                    a += '<div id="pv_author_block" class="clear_fix">';
                    var i = "";
                    "NA" != o.author && (i = o.author), i && (o.author_href && (a += '<a class="pv_author_img" href="' + o.author_href + '">'), a +=
                            '<div class="ow_ava ow_ava_comm" style="background-image: url(\'' + o.author_photo + "');\"></div>", o.author_href && (a += "</a>")), a +=
                        '        <div id="pv_author_info">           <div id="pv_author_name">' + i +
                        '</div>           <div class="pv_date_info_wrap">             <span id="pv_date_info">' + o.date +
                        "</span>           </div>         </div>       </div>", a += getProgressHtml("pv_progress");
                    var p = o.liked ? "pv_liked" : "",
                        v = cur.pvCommsLikes[o.id],
                        n = v[0],
                        s = v[1];
                    if (a += '<div id="pv_like" class="pv_like _like_wrap ' + p +
                        '" onmouseover="Photoview.likeOver(this)" onclick="Photoview.like();">         <i class="pv_like_icon _icon"></i>         <span class="pv_like_link _link">' +
                        getLang("photos_i_like") + '</span>         <span class="pv_like_count _count">' + (s || "") + "</span>       </div>", 1 & o.actions.edit || o.desc) {
                        var c = (o.desc, "<div" + (1 & o.actions.edit ? ' class="pv_can_edit pv_desc_cont" onclick="Photoview.editInline(event)"' + (o.desc ? ' onmouseover=""' :
                                "") : ' class="pv_cant_edit pv_desc_cont"') + ">" + (o.desc || '<span class="pv_desc_edit">' + getLang("photos_edit_desc") + "</span>") +
                            "</div>");
                        a += '<div id="pv_desc" class="pv_right_block">' + c + "</div>"
                    }
                    a += '<div id="pv_microdata">' + (o.microdata_html ? o.microdata_html : "") + (o.microdata_preview_button ? o.microdata_preview_button : "") + "</div>", o.microdata_html &&
                        shortCurrency();
                    var u = o.tagshtml ? "" : ' style="display: none"';
                    a += '<div id="pv_tags"' + u + ' class="pv_right_block">' + getLang("photos_onthisphoto") + ": " + o.tagshtml + "</div>";
                    var l = o.place ? '<span class="pv_place_label"></span> <a class="pv_place_a" id="pv_place_a" onclick="Photoview.showPlace()">' + o.place + "</a>" : "";
                    if (a += '<div id="pv_place" class="pv_right_block">' + l + "</div>", a += n.tagName ? '<div id="pv_comments_place"></div>' : trim(n), cur.pvReplyForm &&
                        re(cur.pvReplyForm), cur.pvReplyForm = null, t || !o.actions.comm ? show(geByClass1("pv_closed_commments_placeholder")) : o.reply_form && (hide(
                                geByClass1("pv_closed_commments_placeholder")), cur.pvReplyForm = se(o.reply_form), cur.pvNarrowColumn.appendChild(cur.pvReplyForm), cur.onReplyFormSizeUpdate =
                            cur.onMediaAdded = Photoview.updateRightBlock), a +=
                        '<div id="pv_rotate"><form method="POST" target="pv_rotate_frame" name="pv_rotate_form" id="pv_rotate_form"></form></div></div>', cur.pvNarrow.innerHTML =
                        "", Photoview.updateRightBlock(), cur.pvNarrow.innerHTML = a, n.tagName) {
                        each(geByClass("page_gif_loading", n), function() {
                            Page.hideGif(this, !1)
                        });
                        var d = ge("pv_comments_place");
                        domPN(d)
                            .replaceChild(n, d)
                    }
                    if (cur.pvNarrowScrollbar && (cur.pvNarrowScrollbar.destroy(), re(cur.pvNarrowScrollbar.scrollbar)), cur.pvNarrowScrollbar = new Scrollbar(cur.pvNarrow, {
                            global: !0,
                            nokeys: !0,
                            prefix: "pv_",
                            right: vk.rtl ? "auto" : 0,
                            left: vk.rtl ? 0 : "auto",
                            nomargin: !0
                        }), o.reply_form) {
                        var h = geByClass1("reply_field", cur.pvNarrowColumn);
                        data(h, "send", Photoview.sendComment), placeholderInit(h, {
                            editable: 1
                        })
                    }
                    cur.editing = !1, Photoview.updateRightBlock()
                }
                r = r || "", cur.pvAlbumName.innerHTML = r;
                var g = [];
                if (vk.id && g.push('<a id="pv_share" onclick="Photoview.sendPhoto()">' + getLang("photos_share_from_view") + "</a>"), !o.taginfo && o.actions.tag && o.tags[0] <
                    cur.pvMaxTags && g.push(
                        "<a id=\"pv_tag_link\" onclick=\"stManager.add(['phototag.js', 'phototag.css', 'tagger.css', 'tagger.js'], function() { Phototag.startTag(); })\">" +
                        getLang("photos_tagperson") + "</a>"), o.actions.del && g.push('<a id="pv_delete" onclick="Photoview.deletePhoto()">' + getLang("photos_pv_act_delete") +
                        "</a>"), o.actions.save && g.push('<a id="pv_save_to_me" onclick="Photoview.savePhoto()">' + getLang("photos_pv_act_save") + "</a>"), !cur.pvIsLightMode
                ) {
                    var m = [],
                        _ = [];
                    o.actions.spam && (m.push(["spam", getLang("photos_report"), "", "Photoview.showSpamActions()"]), m.push("sep"), _ = cur.pvReasons), o.actions.edit && m.push(
                        ["pe", getLang("photos_pv_act_photoeditor"), "Photoview.openEditor()"]), o.actions.rot && (m.push(["rotate_ccw", getLang("photos_pv_act_rotate_ccw"),
                        "Photoview.rotatePhoto(-1)"
                    ]), m.push(["rotate_cw", getLang("photos_pv_act_rotate_cw"), "Photoview.rotatePhoto(1)"]), m.push("sep")), o.actions.place && m.push(["place", getLang(
                        "photos_edit_add_place"), "Photoview.editPlace()"]), o.actions.prof && m.push(["to_profile", getLang("photos_pv_act_to_avatar"),
                        "showBox('al_page.php', {act: 'owner_photo_edit', photo: '" + o.id +
                        "'}, {stat: ['owner_photo.css', 'owner_photo.js', 'tagger.css', 'tagger.js']})"
                    ]), o.actions.move && o.actions.cover && m.push(["as_title", getLang("photos_album_to_cover"),
                        "ajax.post('al_photos.php', {act: 'a_set_as_album_title', photo: '" + o.id + "', hash: '" + o.hash + "'}, {onDone: showDoneBox})"
                    ]);
                    var w = "";
                    each(_, function(e, o) {
                        w += '<div class="pv_more_act_item pv_more_spam_act_item" id="pv_more_spam_act_' + o[0] + '">' + o[1] + "</div>"
                    }), w = w ? '<div class="pv_more_acts_hidden">' + w + "</div>" : "";
                    var f = "";
                    each(m, function(e, o) {
                            f += "sep" == o ? '<div class="pv_more_act_item_sep"></div>' : '<div class="pv_more_act_item" onmouseover="' + (o[3] || "") + '" onclick="' + (
                                o[2] || "") + '" id="pv_more_act_' + o[0] + '">' + o[1] + "</div>"
                        }), f += '<a class="pv_more_act_item" id="pv_more_act_download" target="_blank" href="' + Photoview.genData(o, "w")
                        .src + '">' + getLang("photos_pv_act_open_original") + "</a>", f = '<div class="pv_more_acts">' + f + "</div>", m.length && (m = JSON.stringify(m), m =
                            m.replace(/\"/g, "&quot;"), g.push('<a class="pv_actions_more" data-items="' + m + '">' + getLang("photos_actions_more") + "</a>")), g = g.join(
                            '<span class="divider"></span>'), cur.pvBottomActions.innerHTML = g, cur.pvMoreActionsTooltip = new ElementTooltip(geByClass1("pv_actions_more"), {
                            id: "pv_more_acts_tt",
                            to: "down",
                            elClassWhenTooltip: "pv_more_shown",
                            content: w + f,
                            offset: [0, -5]
                        })
                }
                Photoview.updatePhotoDimensions(), extend(cur, {
                        pvTagLink: ge("pv_tag_link"),
                        pvLikeIcon: geByClass1("pv_like_icon"),
                        pvLikeLink: geByClass1("pv_like_link"),
                        pvDesc: ge("pv_desc"),
                        pvTags: ge("pv_tags"),
                        pvEditing: !1,
                        pvProgress: ge("pv_progress")
                    }), o.deleted || !o.author ? (cleanElems("pv_confirm_tag", "pv_delete_tag", "pv_prof_cancel", "pv_prof_done"), isArray(o.deleted) && Photoview.toggleTopInfoPanel(
                        o.deleted[0], o.deleted[1]), hide(cur.pvHHWrap), Photoview.toggleDeletedState(!0)) : o.taginfo ? (cleanElems("pv_confirm_tag", "pv_delete_tag",
                        "pv_prof_cancel", "pv_prof_done"), Photoview.toggleTopInfoPanel(o.taginfo,
                        '        <button class="flat_button" id="pv_confirm_tag" onclick="Photoview.confirmTag(' + o.tagid + ', this)">' + getLang("photos_confirm_tag") +
                        '</button>         <button class="flat_button secondary black" id="pv_delete_tag" onclick="Photoview.deleteTag(' + o.tagid + ', this)">' + getLang(
                            "photos_delete_tag") + "</button>       </div>"), show(cur.pvCommentsData), Photoview.hhCheck() && show(cur.pvHHWrap)) : (Photoview.toggleTopInfoPanel(!
                        1), Photoview.toggleDeletedState(!1), Photoview.hhCheck() && show(cur.pvHHWrap)), (cur.pvOptions || {})
                    .scroll && (layerWrap.scrollTop = cur.pvOptions.scroll), cur.pvBodyScrollTop = bodyNode.scrollTop, setTimeout(function() {
                        void 0 !== cur.pvBodyScrollTop && (bodyNode.scrollTop = cur.pvBodyScrollTop, delete cur.pvBodyScrollTop)
                    }, 0), Photoview.updateVerticalPosition(), setTimeout(Photoview.afterShow, 2)
            }
        },
        toggleTopInfoPanel: function(e, o) {
            var t = isString(e) ? !0 : !!e;
            void 0 !== e && (cur.pvTagInfoText.innerHTML = e), void 0 !== o && (cur.pvTagInfoButtons.innerHTML = o), toggleClass(cur.pvFSWrap, "pv_top_panel_shown", t),
                toggleClass(cur.pvHHWrap, "pv_top_panel_shown", t), toggle(cur.pvTagInfo, t), Photoview.updateRightBlock()
        },
        toggleDeletedState: function(e) {
            e = !!e, toggleClass(cur.pvCont, "pv_deleted_state", e), Photoview.updateRightBlock()
        },
        afterShow: function() {
            cur.pvPhoto.href = "/photo" + cur.pvCurPhoto.id, cur.pvPhoto.focus(), 4 & cur.pvCurPhoto.actions.edit && !cur.pvCurPhoto.desc && Photoview.editInline();
            var e = cur.pvPhoto.firstChild.offsetLeft,
                o = cur.pvPhoto.firstChild.offsetTop;
            cur.pvTagFrame.innerHTML = '<img src="' + cur.pvCurData.src + '" />', setStyle(cur.pvTagFaded, {
                    width: cur.pvPhWidth + "px",
                    height: cur.pvPhHeight + "px",
                    left: e + "px",
                    top: o + "px"
                }), setStyle(cur.pvTagFrame, {
                    left: e + "px",
                    top: o + "px"
                }), setStyle(cur.pvTagPerson, {
                    left: e + "px",
                    top: o + "px"
                }), (cur.pvOptions || {})
                .scroll && (layerWrap.scrollTop = cur.pvOptions.scroll, cur.pvOptions.scroll = 0);
            var t = document.URL;
            Photoview.updateLoc(), cur.pvCandidate && (t == document.URL && (t = ""), setTimeout(window.comScoreUDM && comScoreUDM.pbind(locProtocol + "//" + location.host +
                "/al_photos.php?comscorekw=pageview_candidate", t), 10), delete cur.pvCandidate), Photoview.updatePhotoDimensions()
        },
        pvCanvasUpdate: function(e) {
            var o = cur.pvCurData;
            if (cur.pvCanvas && o && o.width && o.height) {
                cur.pvScrWidth = cur.pvCanvas.offsetWidth, cur.pvScrHeight = cur.pvCanvas.offsetHeight;
                var t = 1,
                    r = 0,
                    a = o.width || 604,
                    i = o.height || 453,
                    p = ge("pv_fs_img_fade") || ge("pv_fs_img_wrap"),
                    v = p && domFC(p);
                t = cur.pvScrWidth / a, i * t > cur.pvScrHeight && (t = cur.pvScrHeight / i), t > 1.25 && (t = 1.25), a = Math.floor(a * t), i = Math.floor(i * t), r = Math.floor(
                    (cur.pvScrHeight - i) / 2), (cur.pvFSWidth != a || cur.pvFSHeight != i || cur.pvFSTop != r || e) && (cur.pvFSWidth = a, cur.pvFSHeight = i, cur.pvFSTop =
                    r, v && setStyle(v, {
                        marginTop: r,
                        width: a,
                        height: i
                    }))
            }
        },
        pvCanvasSet: function() {
            var e = cur.pvCurData;
            if (cur.pvCanvas && e) {
                var o, t = vkImage(),
                    r = function() {
                        ge("pv_fs_img_fade") && (re("pv_fs_img_wrap"), ge("pv_fs_img_fade")
                            .id = "pv_fs_img_wrap")
                    };
                r(), domFC(ge("pv_fs_img_wrap")) && cur.pvSlideNeedAnimation ? (cur.pvSlideNeedAnimation = !1, cur.pvCanvas.insertBefore(se(
                        '<div id="pv_fs_img_fade"><img src="' + e.src + '" /></div>'), ge("pv_fs_img_wrap")), o = function() {
                        cssAnim(ge("pv_fs_img_wrap"), {
                            opacity: 0
                        }, {
                            duration: 1e3
                        }, function() {
                            r(), Photoview.fullscreenOnLoad()
                        }), cssAnim(ge("pv_fs_img_fade"), {
                            opacity: 1
                        }, {
                            duration: 1e3
                        })
                    }) : (val(ge("pv_fs_img_wrap"), '<img src="' + e.src + '" />'), o = Photoview.fullscreenOnLoad), Photoview.pvCanvasUpdate(!0), t.onload = o, t.src = e.src,
                    window.FullscreenPV && FullscreenPV.updateInfo()
            }
        },
        updateLoc: function() {
            var e, o = cur.pvListId;
            cur.pvRoot ? (e = {
                0: "photo" + cur.pvCurPhoto.id
            }, "photos" == o.substr(0, 6) ? e.all = 1 : "tag" == o.substr(0, 3) ? e.tag = intval(o.substr(3)) : "newtag" == o.substr(0, 6) && (e.newtag = intval(o.substr(
                6))), -1 != o.indexOf("/rev") && (e.rev = 1)) : e = extend(nav.objLoc, {
                z: "photo" + cur.pvCurPhoto.id + "/" + (cur.pvCurPhoto.list_override || o)
            }), nav.strLoc != nav.toStr(e) && (cur.pvNoHistory || ++cur.pvHistoryLength, nav.setLoc(e), (cur.pvOptions || {})
                .fromQueue && (cur.pvNoHistory = !0, cur.pvHistoryLength = 0)), cur.pvOptions && (cur.pvOptions.fromQueue = !1)
        },
        canFullscreen: function() {
            var e = browser,
                o = floatval(browser.version);
            return !e.mobile && (document.fullscreenEnabled || document.msFullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || e.safari &&
                o > 5);
        },
        fullscreenOnLoad: function() {
            window.FullscreenPV && FullscreenPV.slide()
        },
        fullscreenEnd: function(e) {
            var o = cur.pvCanvas;
            o && (cleanElems(o), re(o), clearTimeout(cur.pvFSTimer), clearTimeout(cur.pvFSControlsTimer), cur.pvCanvas = cur.pvFSControls = cur.pvFSTimer = cur.pvFSControlsTimer = !
                1, removeEvent(document, "webkitfullscreenchange mozfullscreenchange fullscreenchange webkitfullscreenerror mozfullscreenerror fullscreenerror"), show(
                    pageNode), cur.pvCanvasUpdateTO && clearInterval(cur.pvCanvasUpdateTO), void 0 !== cur.pvScrWasY && (scrollToY(cur.pvScrWasY, 0), delete cur.pvScrWasY),
                e !== !0 && (Photoview.updateSize(), Photoview.show(cur.pvListId, cur.pvIndex)))
        },
        fullscreen: function(e) {
            if (!cur.pvCanvas) {
                var o = cur.pvCanvas = bodyNode.appendChild(ce("div", {
                        className: "fixed",
                        id: "pv_fullscreen",
                        innerHTML: '<div id="pv_fs_img_wrap"></div>'
                    })),
                    t = o.requestFullscreen || o.requestFullScreen || o.webkitRequestFullScreen || o.mozRequestFullScreen || o.msRequestFullscreen;
                cur.pvFinishing = !1, stManager.add(["fullscreen_pv.css", "fullscreen_pv.js"], function() {
                    FullscreenPV.init()
                }), addEvent(document, "webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", Photoview.onFullscreen), addEvent(document,
                    "webkitfullscreenerror mozfullscreenerror MSFullscreenError fullscreenerror", Photoview.fullscreenEnd.pbind(!0));
                try {
                    t.call(o)
                } catch (r) {
                    cur.pvPartScreen = !0, Photoview.onFullscreen()
                }
                cancelEvent(e)
            }
        },
        fullscreenStop: function(e) {
            cur.pvFinishing = e === !0, cur.pvPartScreen = !1;
            var o = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitCancelFullScreen;
            try {
                o.call(document)
            } catch (t) {
                Photoview.onFullscreen()
            }
            setTimeout(Photoview.fullscreenEnd, 30)
        },
        onFullscreen: function() {
            document.fullscreenElement || document.fullScreenElement || document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen || cur.pvPartScreen ?
                (cur.pvTagger && Phototag.stopTag(), cur.pvScrWidth = cur.pvCanvas.offsetWidth, cur.pvScrHeight = cur.pvCanvas.offsetHeight, cur.pvScrWasY = scrollGetY(), hide(
                    pageNode), cur.pvCanvasUpdateTO = setInterval(Photoview.pvCanvasUpdate.pbind(!1), 100), cur.pvFinishing || (Photoview.updateSize(), Photoview.show(cur.pvListId,
                    cur.pvIndex))) : Photoview.fullscreenEnd(cur.pvFinishing)
        },
        showDD: function(e, o) {
            if (!hasClass(e, "pv_report_blocked") && o && (clearTimeout(cur.hideShareTimer), e.blur(), !hasClass(o, "pv_dd_hiding"))) {
                if (isVisible(o)) return fadeIn(o, 0);
                cur.ddShown && Photoview.hideDD(0), cur.ddShown = o, setTimeout(addEvent.pbind(document, "click", Photoview.hideDD), 1), show(o)
            }
        },
        hideDD: function(e) {
            if (e > 0) return void(cur.hideShareTimer = setTimeout(Photoview.hideDD.pbind(0), e));
            var o = cur.ddShown;
            o && (-1 == e ? hide(o) : (addClass(o, "pv_dd_hiding"), fadeOut(o, 200, function() {
                removeClass(o, "pv_dd_hiding")
            })), removeEvent(document, "click", Photoview.hideDD), cur.ddShown = !1)
        },
        createDD: function(e, o) {
            return '<div onmouseover="Photoview.showDD(this.previousSibling, this);" onmouseout="Photoview.hideDD(500)" onclick="Photoview.hideDD(-1)" class="pvs_dd fixed"><table cellspacing="0" cellpadding="0"><tr>    <td class="pvs_side_sh"><div class="pvs_side_sh_el"></div></td>    <td>      <div class="pvs_header_wrap"><div class="pvs_header"><span class="pvs_header_text">' +
                o + '</span></div></div>      <div class="pvs_acts">' + e +
                '</div>      <div class="pvs_sh1"></div><div class="pvs_sh2"></div>    </td>    <td class="pvs_side_sh"><div class="pvs_side_sh_el"></div></td>  </tr></table></div>'
        },
        report: function(e, o) {
            var t = cur.pvCurPhoto.id.split("_");
            ajax.post("reports.php", {
                act: "new_report",
                type: "photo",
                reason: o,
                hash: e,
                oid: t[0],
                item_id: t[1]
            }, {
                onDone: function(e) {
                    var o = ge("pv_report");
                    o.parentNode.replaceChild(ce("div", {
                        className: "pv_report_blocked",
                        innerHTML: e
                    }), o)
                },
                showProgress: function() {
                    var e = ge("pv_report");
                    addClass(e, "pv_report_blocked")
                },
                hideProgress: function() {
                    var e = ge("mv_report");
                    removeClass(e, "pv_report_blocked")
                }
            })
        },
        showShare: function() {
            clearTimeout(cur.hideShareTimer);
            var e = ge("pvs_dd");
            return ge("pv_share")
                .blur(), isVisible(e) ? fadeIn(e, 0) : (setTimeout(addEvent.pbind(document, "click", Photoview.hideShare), 1), void show(e))
        },
        hideShare: function(e) {
            if (e > 0) return void(cur.hideShareTimer = setTimeout(Photoview.hideShare.pbind(0), e));
            var o = ge("pvs_dd");
            o && (-1 == e ? hide(o) : fadeOut(o, 200), removeEvent(document, "click", Photoview.hideShare))
        },
        savePhoto: function() {
            var e = cur.pvListId,
                o = cur.pvIndex,
                t = cur.pvData[e][o];
            ajax.post("al_photos.php", {
                act: "save_me",
                photo: t.id,
                list: e,
                hash: t.hash
            });
            var r = ge("pv_save_to_me");
            domPN(r)
                .replaceChild(ce("div", {
                    className: "pv_save_to_me_saved",
                    innerHTML: getLang("photos_pv_act_save_saved")
                }), r)
        },
        sendPhoto: function() {
            var e = cur.pvListId,
                o = cur.pvIndex,
                t = cur.pvData[e][o];
            showBox("like.php", {
                act: "publish_box",
                object: "photo" + t.id,
                list: e,
                to: "mail"
            }, {
                stat: ["page.js", "page.css", "wide_dd.js", "wide_dd.css", "sharebox.js"]
            })
        },
        moveToAlbum: function(e, o, t) {
            ajax.post("al_photos.php", {
                act: "a_move_photo",
                photo: e,
                album_id: o,
                hash: t
            }, {
                onDone: function(e, o) {
                    curBox()
                        .hide();
                    var t = ge("pv_album_name");
                    t && (t.innerHTML = e), cur.pvCurPhoto.album = e, showDoneBox('<div class="pv_done_box">' + getLang("photos_move_to_album_success")
                        .replace("{album}", e) + "</div>")
                }
            })
        },
        setTags: function(e) {
            return Photoview.hideTag(), e ? (show(cur.pvTags), window.tooltips && each(geByClass("delete", cur.pvTags), function() {
                tooltips.destroy(this)
            }), void(cur.pvTags.innerHTML = getLang("photos_onthisphoto") + ": " + e)) : void hide(cur.pvTags)
        },
        preload: function(e, o) {
            window.updateWndVScroll && updateWndVScroll();
            var t = cur.pvListId,
                r = ((cur.pvData || {})[t] || {})
                .length;
            if (r) {
                var a = cur.pvVeryBig > 2 ? "w" : cur.pvVeryBig ? "z" : "y",
                    i = cur.pvVeryBig > 1 ? "z" : cur.pvVeryBig ? "z" : "y",
                    p = cur.pvVeryBig > 1 ? "z" : cur.pvVeryBig ? "y" : "x",
                    v = cur.pvVeryBig > 1 ? "y" : cur.pvVeryBig ? "x" : 0;
                cur.pvLastFrom = e, cur.pvLastDirection = o;
                for (var n = 0; n < Math.min(Photoview.cacheSize, r - Photoview.cacheSize); ++n) {
                    for (var s = e + (n + 1) * -o; s >= r;) s -= r;
                    for (; 0 > s;) s += r;
                    var c = cur.pvData[t][s];
                    if (c)
                        for (var u = 0, l = Photoview.allSizes.length; l > u; ++u) {
                            var d = Photoview.allSizes[u];
                            c[d] && c[d].src && (c[d].src = Photoview.blank, delete c[d])
                        }
                }
                for (var n = 0; n < Photoview.cacheSize; ++n) {
                    for (var s = e + (n + 1) * o; s >= r;) s -= r;
                    for (; 0 > s;) s += r;
                    var c = cur.pvData[t][s];
                    if (!c || !c.id) {
                        (!c || vkNow() - c > 3e3) && (cur.pvData[t][s] = vkNow(), setTimeout(function() {
                            ajax.post("al_photos.php", {
                                act: "show",
                                list: t,
                                offset: Photoview.realOffset(t, s, -1),
                                direction: o
                            }, {
                                onDone: Photoview.loaded
                            })
                        }, 10));
                        break
                    }
                    c[a] || (c[a + "_src"] ? (c[a] = vkImage(), c[a].src = c[a + "_src"]) : (c[a] = 1, c[i] || (c[i + "_src"] ? (c[i] = vkImage(), c[i].src = c[i + "_src"]) :
                        (c[i] = 1, c[p] || (c[p + "_src"] ? (c[p] = vkImage(), c[p].src = c[p + "_src"]) : (c[p] = 1, c[v] || (c[v + "_src"] ? (c[v] = vkImage(), c[
                            v].src = c[v + "_src"]) : (c[v] = 1, c.x || (c.x = vkImage(), c.x.src = c.x_src)))))))))
                }
            }
        },
        hide: function(e, o) {
            if (cur.pvShown && (!__afterFocus || o === !0)) {
                if (cur.pvCanvas && Photoview.fullscreenStop(!0), cur.prevPhotoWidth = cur.prevPhotoHeight = 0, (cur.pvJumpTo || {})
                    .z == "albums" + val("pva_owner") && !cur.pvAlbumsShown && 0 === e) return Photoview.jumpToAlbums(!0);
                if ((cur.pvJumpTo || {})
                    .z == "album" + val("pvsa_album") && !cur.pvAlbumShown && 0 === e) return Photoview.jumpToAlbum(!0);
                if ((cur.pvJumpTo || {})
                    .z == "tag" + val("pvsa_tag") && !cur.pvPhotoTagShown && 0 === e) return Photoview.jumpToTagged(!0);
                if ("temp" == cur.pvListId) cur.pvCancelLoad();
                else if (!cur.pvNoHistory && !e && cur.pvHistoryLength > 0 && cur.pvHistoryLength < 10) return cur.pvNoHistory = !0, __adsUpdate("very_lazy"), cur.pvBodyScrollTop =
                    bodyNode.scrollTop, history.go(-cur.pvHistoryLength);
                if (e !== !0 && !layerQueue.count()) {
                    var t;
                    cur.pvRoot ? ("newtag" == cur.pvListId.substr(0, 6) ? (t = "albums" + vk.id + "?act=added", -1 != cur.pvListId.indexOf("/rev") && (t += "&rev=1")) : t =
                        cur.pvListId.replace(/^photos/, "albums")
                        .replace("/rev", "?rev=1"), nav.setLoc(t)) : (t = clone(nav.objLoc), delete t.z), nav.strLoc != nav.toStr(t) && nav.setLoc(t), __adsUpdate(
                        "very_lazy")
                }
                window.__pvhideTimer = setTimeout(Photoview.doHide.pbind(cur), 0), __adsUpdate(), cur.pvAlbumsShowing = cur.pvAlbumsShown = !1, cur.pvAlbumShowing = cur.pvAlbumShown = !
                    1, cur.pvPhotoTagShowing = cur.pvPhotoTagShown = !1, cur.pvVideoTagShowing = cur.pvVideoTagsShown = !1
            }
        },
        doHide: function(e) {
            void 0 !== cur.pvBodyScrollTop && (bodyNode.scrollTop = cur.pvBodyScrollTop, delete cur.pvBodyScrollTop), e.pvHistoryLength = 0, cur.pvTagger && Phototag.stopTag(),
                cleanElems("pv_confirm_tag", "pv_delete_tag", "pv_prof_cancel", "pv_prof_done"), e.pvFriends && (cleanElems("pv_add_tag", "pv_cancel_tag", e.pvFriends.firstChild
                    .firstChild, e.pvFriends), re(e.pvFriends), e.pvFriends = e.pvFriendName = !1), Wall.cancelEdit(!0), removeEvent(e.pvPhoto, "mousemove", Photoview.onMouseMove);
            var o = e.pvListId,
                t = ((e.pvData || {})[o] || {})
                .length;
            if (e.pvLastDirection && t) {
                for (var r = 0; r < Photoview.cacheSize; ++r) {
                    for (var a = e.pvLastFrom + (r + 1) * e.pvLastDirection; a >= t;) a -= t;
                    for (; 0 > a;) a += t;
                    var i = e.pvData[o][a];
                    if (i)
                        for (var p = 0, v = Photoview.allSizes.length; v > p; ++p) {
                            var n = Photoview.allSizes[p];
                            i[n] && i[n].src && (i[n].src = Photoview.blank, delete i[n])
                        }
                }
                e.pvLastDirection = e.pvLastFrom = !1
            }
            cur.pvYourComment = re(cur.pvYourComment), layers.hide(), layers.fullhide = !1, Photoview.hideTag(!0), each(["pvLeft", "pvClose", "pvFixed"], function() {
                var o = this + "";
                re(e[o]), e[o] = !1
            }), window.tooltips && tooltips.destroyAll(cur.pvBox), browser.mobile && (ge("footer")
                .style.height = "");
            var s = vk.pvdark ? "pv_dark" : "pv_light";
            removeClass(layerWrap, s), removeClass(layerBG, s), layerBG.style.opacity = "", e.pvShown = e.pvListId = e.pvClicked = !1, removeEvent(window, "resize", Photoview.onResize),
                removeEvent(document, "keydown", Photoview.onKeyDown), removeEvent(layerWrap, "click", Photoview.onLayerClick), removeEvent(layerWrap, "scroll", Photoview.scrollResize);
            var c = cur.pvOptions && cur.pvOptions.onHide;
            if (cur.pvOptions) {
                var c = cur.pvOptions.onHide;
                cur.pvOptions.onHide = !1, c && c()
            }
            if (layerQueue.pop(), Photoview.destroyPeriod(), e.pvPreloaded && e === cur) {
                for (var u = geByClass1("photos_container"), l = ce("div", {
                        innerHTML: e.pvPreloaded
                    }); l.firstChild;) u.appendChild(l.firstChild);
                u.qsorter && setTimeout(qsorter.added.pbind(u), 0), e.pvPreloaded = !1
            }
            uiScrollBox.hide(), cur.pvPhoto.innerHTML = "", setStyle(cur.pvPhoto, {
                width: null,
                height: null
            }), setStyle(cur.pvCont, {
                width: null,
                height: null
            })
        },
        editPhoto: function() {},
        descTT: function(e) {
            return showTooltip(e, {
                text: getLang("photos_edit_desc"),
                black: 1,
                shift: [-160, 13, 0],
                showdt: 0,
                appendParentCls: "narrow_column"
            })
        },
        editInline: function(e, o) {
            if ("A" != ((e || window.event || {})
                    .target || {})
                .tagName && !cur.pvEditing) {
                window.tooltips && window.tooltips.hideAll();
                var t = cur.pvListId,
                    r = cur.pvIndex,
                    a = cur.pvData[t][r],
                    o = !a.desc,
                    i = function(e) {
                        if (cur.pvShown && cur.pvListId == t && cur.pvIndex == r && !cur.pvEditing) {
                            cur.pvEditing = [t, r];
                            var o = cur.pvDesc.appendChild(ce("div", {
                                    innerHTML: '        <textarea class="dark" id="pv_edit_text" onkeydown="onCtrlEnter(event, Photoview.saveInline)" onkeyup="checkTextLength(cur.pvCaptionLimit, this, ge(\'pv_caption_warn\'));" placeholder="' +
                                        getLang("photos_edit_desc_intro") + '">' + e + '</textarea>        <div id="pv_caption_warn"><div>'
                                }, {
                                    display: "none"
                                })),
                                a = ge("pv_edit_text");
                            autosizeSetup(a, {
                                minHeight: 21,
                                maxHeight: 350
                            }), setTimeout(function() {
                                show(o), elfocus(a), addEvent(a, "blur", Photoview.saveInline), hide(cur.pvDesc.firstChild), cur.pvNarrow.scrollTop = 0
                            }, 1)
                        }
                    };
                o ? i("") : ajax.post("al_photos.php", {
                    act: "edit_desc",
                    photo: a.id
                }, {
                    onDone: i,
                    progress: cur.pvProgress
                })
            }
        },
        cancelInline: function() {
            cur.pvEditing = !1, removeEvent(ge("pv_edit_text"), "blur"), show(cur.pvDesc.firstChild), re(cur.pvDesc.firstChild.nextSibling)
        },
        saveInline: function() {
            if (cur.pvEditing) {
                removeEvent(ge("pv_edit_text"), "blur");
                var e = cur.pvEditing[0],
                    o = cur.pvEditing[1],
                    t = cur.pvData[e][o],
                    r = trim(val("pv_edit_text"));
                return geByClass1("pv_desc_edit", cur.pvDesc) && !r ? Photoview.cancelInline() : void ajax.post("al_photos.php", {
                    act: "save_desc",
                    photo: t.id,
                    hash: t.hash,
                    text: r
                }, {
                    onDone: function(r) {
                        t.desc = r;
                        var a = cur.pvShown && e == cur.pvListId && o == cur.pvIndex;
                        if (a) {
                            cur.pvEditing = !1;
                            var i = domFC(cur.pvDesc);
                            val(i, r || '<span class="pv_desc_edit">' + getLang("photos_edit_desc") + "</span>"), i.onmouseover = r ? Photoview.descTT.pbind(i) :
                                function() {}, show(i), re(domNS(i))
                        }
                    },
                    progress: cur.pvProgress
                })
            }
        },
        cmp: function(e, o) {
            var t = e.length,
                r = o.length;
            return r > t ? -1 : t > r ? 1 : o > e ? -1 : e > o ? 1 : 0
        },
        receiveComms: function(e, o, t, r, a, i) {
            if (e == cur.pvListId && o == cur.pvIndex) {
                for (var p = ce("div", {
                        innerHTML: t
                    }), v = ge("pv_comments_list"), n = current = domLC(v), s = getXY(current, !0)[1], c = cur.pvData[e][o], u = domLC(p); u; u = domLC(p)) {
                    for (c.actions.comm && addClass(u, "reply_replieable"); current && Photoview.cmp(current.id, u.id) > 0;) current = domPS(current);
                    current && !Photoview.cmp(current.id, u.id) ? (v.replaceChild(u, current), current = u) : (current && domNS(current) ? v.insertBefore(u, domNS(current)) :
                        !current && domFC(v) ? a === !0 ? (--c.commshown, p.removeChild(u)) : v.insertBefore(u, domFC(v)) : v.appendChild(u), ++c.commshown)
                }
                i && n && (layerWrap.scrollTop += getXY(n, !0)[1] - s), cur.pvCommsLikes[c.id][0] = v, extend(cur.pvReplyNames, r), Photoview.updateComms(), cur.pvNarrowScrollbar &&
                    cur.pvNarrowScrollbar.update()
            }
        },
        commSaved: function(e) {
            if (cur.pvShown) {
                var o = ge("pv_comments"),
                    t = o ? cur.pvData[cur.pvListId][cur.pvIndex] : !1,
                    r = e.match(/^(-?\d+)photo(_\d+)/);
                t && r && ge("pv_comment" + r[1] + r[2]) && (cur.pvCommsLikes[t.id][0] = o)
            }
        },
        comments: function(e) {
            if (e) {
                var o = domFC(ge("pv_comments"))
                    .id || "";
                if (!isVisible("pv_comments_header") || isVisible("pv_comments_progress") || Photoview.cmp(o, "pv_comment" + e) < 0) return
            }
            var t = cur.pvListId,
                r = cur.pvIndex,
                a = cur.pvData[t][r],
                i = ge("pv_comments_header");
            ajax.post("al_photos.php", {
                act: "photo_comments",
                offset: a.commshown,
                photo: a.id
            }, {
                onDone: function(o, a) {
                    Photoview.receiveComms(t, r, o, a, !1, e), e && ge("pv_comment" + e) && Photoview.showComment(e)
                },
                showProgress: function() {
                    i.innerHTML = "", showProgress(i)
                },
                hideProgress: function() {
                    hideProgress(i)
                }
            })
        },
        updateComms: function(e) {
            var o = cur.pvData[cur.pvListId][cur.pvIndex],
                t = "",
                r = ge("pv_comments_header");
            o.commcount > o.commshown && (t = getLang("photos_show_prev_comments", o.commcount - o.commshown)), toggleClass(ge("pv_comments_list"), "unshown", !e && 0 == o.commcount),
                toggle(r, t), toggle(geByClass1("pv_no_commments_placeholder"), 0 == o.commcount && !geByClass1("_post_content", cur.pvBox)), r.innerHTML = t
        },
        commentClick: function(e, o, t) {
            var r = e.id.replace("pv_comment", ""),
                a = r.split("_");
            if (!Wall.checkReplyClick(e, o)) {
                var i = geByClass1("wall_reply_more", e, "a");
                return i && isVisible(i) ? (removeClass(e, "reply_moreable"), void i.onclick()) : void(t && a[1] && isVisible(cur.pvYourComment) && Photoview.commentTo(r, t, o))
            }
        },
        commentChanged: function() {
            checkTextLength(cur.pvCommLimit, cur.pvComment, ge("pv_comment_warn")), cur.pvCommenting = cur.pvData[cur.pvListId][cur.pvIndex].id
        },
        commentTo: function(e, o, t) {
            var r = (e || "")
                .split("_"),
                a = r[1],
                i = cur.pvData[cur.pvListId][cur.pvIndex],
                p = cur.pvReplyTo && cur.pvReplyNames[cur.pvReplyTo[0]] || "",
                v = cur.pvReplyNames[o] || "",
                n = cur.pvComment,
                s = ge("pv_reply_to_title");
            cur.pvCommenting = i.id, e ? (cur.pvReplyTo = [o, a], val(s, v[0]), show(s, "pv_del_reply_to"), setStyle(s, {
                maxWidth: ge("pv_comment_submit")
                    .offsetWidth - domPN(ge("pv_comment_send"))
                    .offsetWidth - (isVisible(cur.pvAsGroup) ? cur.pvAsGroup.offsetWidth : 0) - domPN(cur.pvAddMedia)
                    .offsetWidth - 31
            })) : (cur.pvReplyTo = !1, hide(s, "pv_del_reply_to"));
            var c = trim(val(n)),
                u = e && geByClass1("pv_reply_to", ge("pv_comment" + e));
            if (!c || p && !winToUtf(p[1])
                .indexOf(c)) {
                var l = e && !checkEvent(t) ? replaceEntities(v[1]) : "";
                l = l.replace(/ /g, "&nbsp;"), val(n, l)
            }
            toggleClass(cur.pvAsGroup, "on", !(!i.actions.asgr || !u || u.getAttribute("rid") !== r[0])), void 0 !== n.emojiId && window.Emoji ? Emoji.focus(n) : elfocus(n)
        },
        updateRightBlock: function() {
            var e = getSize(geByClass1("pv_data"))[1];
            setStyle(cur.pvNarrow, "height", e - (cur.pvReplyForm ? getSize(cur.pvReplyForm)[1] : 0));
            var o = geByClass1("pv_no_commments_placeholder_wrap");
            if (o && (isVisible(o.children[0]) || isVisible(o.children[1]))) {
                var t = getSize(cur.pvNarrow)[1],
                    r = getSize(o)[1],
                    a = getSize("pv_comments_list")[1],
                    i = ge("pv_comments"),
                    p = t - i.offsetTop - a;
                setStyle(o, "margin-top", Math.max(0, p / 2 - r / 2))
            }
            cur.pvNarrowScrollbar && cur.pvNarrowScrollbar.update(!0, !0)
        },
        sendComment: function(e, o, t) {
            var r = cur.pvListId,
                a = cur.pvIndex,
                i = cur.pvData[r][a],
                p = ge("reply_field" + e),
                v = p && data(p, "composer"),
                n = (cur.pvReplyNames[(cur.reply_to || {})[0]] || [])[1],
                s = geByClass1("addpost_button", cur.pvReplyForm),
                c = t.stickerId;
            if (c) var u = {
                message: "",
                attach1_type: "sticker",
                attach1: c
            };
            else {
                var u = v ? Composer.getSendParams(v, Photoview.sendComment.pbind(e)) : {
                    message: trim(Emoji.editableVal(p))
                };
                if (u.delayed) return;
                if (!u.attach1_type && (!u.message || n && !n.indexOf(u.message))) return void Emoji.editableFocus(p, !1, !0)
            }
            hide("reply_warn" + e), ajax.post("al_photos.php", Wall.fixPostParams(extend(u, {
                act: "post_comment",
                photo: i.id,
                hash: i.hash,
                fromview: 1,
                from_group: isVisible(cur.pvAsGroup) ? isChecked(cur.pvAsGroup) : "",
                reply_to: (cur.reply_to || {})[1]
            })), {
                onDone: function(t, n) {
                    ++i.commcount, Photoview.receiveComms(r, a, t, n, !0), c || (v ? Composer.reset(v) : Emoji.val(p, "")), p.autosize && p.autosize.update(),
                        browser.mobile ? Wall.hideEditReply(e) : (Emoji.editableFocus(p, !1, !0), Wall.cancelReplyTo(e, o)), re("reply_link" + e), cur.pvNarrowScrollbar &&
                        cur.pvNarrowScrollbar.scrollTop(cur.pvNarrowScrollbar.obj.scrollHeight), Photoview.updateRightBlock()
                },
                showProgress: function() {
                    lockButton(s)
                },
                hideProgress: function() {
                    unlockButton(s)
                }
            })
        },
        highlightComment: function(e) {
            if (e = ge(e)) {
                var o = animate.pbind(e, {
                        backgroundColor: "#ECEFF3"
                    }, 200, function() {
                        setTimeout(function() {
                            animate(e, {
                                backgroundColor: "#FFF"
                            }, 200, function() {
                                setStyle(e, {
                                    backgroundColor: ""
                                })
                            })
                        }, 1e3)
                    }),
                    t = getXY(e, !0)[1];
                0 > t || t > lastWindowHeight - 200 ? animate(layerWrap, {
                    scrollTop: layerWrap.scrollTop + t - 50
                }, 300, o) : o()
            }
        },
        showComment: function(e) {
            var o = ge("pv_comment" + e);
            return o ? Photoview.highlightComment(o) : Photoview.comments(e), !1
        },
        commDone: function(node, text, del, script) {
            if (node) {
                var fc = domFC(node),
                    msg = domNS(fc),
                    ph = void 0 == cur.pvListId || void 0 == cur.pvIndex ? !1 : cur.pvData[cur.pvListId][cur.pvIndex];
                if (!text) return show(fc), hide(msg), void(ph ? (++ph.commcount, ++ph.commshown, Photoview.updateComms()) : window.photos && cur.offset && photos.recache(cur.offset,
                    1));
                msg ? (msg.innerHTML = text, show(msg)) : node.appendChild(ce("div", {
                        innerHTML: text
                    })), hide(fc), del && (ph ? (--ph.commshown, --ph.commcount, Photoview.updateComms(del)) : window.photos && cur.offset && photos.recache(cur.offset, -1)),
                    ph && (cur.pvCommsLikes[ph.id][0] = ge("pv_comments")), script && eval(script)
            }
        },
        commProgress: function(e, o) {
            var t = ge("pv_actions" + e);
            if (t) {
                var r = t.firstChild.nextSibling;
                if (o !== !0) return hide(r), void show(t.firstChild);
                hide(t.firstChild), r || (r = t.appendChild(ce("div", {
                    className: "progress"
                }))), show(r)
            }
        },
        commParams: function(e, o) {
            return {
                onDone: Photoview.commDone.pbind(e, o),
                progress: "pv_progress" + e + o,
                stat: ["privacy.js", "privacy.css"]
            }
        },
        commAction: function(e, o, t, r) {
            var a = gpeByClass("reply", o),
                i = gpeByClass("post_actions", o),
                p = "post_actions_progress";
            hasClass(a, p) || ajax.post("al_photos.php", {
                act: e + "_comment",
                comment: t,
                hash: r
            }, {
                onDone: Photoview.commDone.pbind(a),
                showProgress: addClass.pbind(i, p),
                hideProgress: removeClass.pbind(i, p)
            })
        },
        onLayerClick: function(e, o) {
            if (cur.pvClicked && !o || __afterFocus || e && cur.__mdEvent && e.target != cur.__mdEvent.target) return void(cur.pvClicked = !1);
            if (!e || 2 != e.button && 3 != e.which && !e.pvHandle) {
                e && (e.pvHandle = !0);
                var t = e.pageX,
                    r = e.pageY;
                if (null == t && null != e.clientX) {
                    var a = document.documentElement,
                        i = bodyNode;
                    t = event.clientX + (a && a.scrollLeft || i && i.scrollLeft || 0) - (a.clientLeft || 0), r = event.clientY + (a && a.scrollTop || i && i.scrollTop || 0) -
                        (a.clientTop || 0)
                }
                var p = Math.abs(t - intval(cur.pvOldX)),
                    v = Math.abs(r - intval(cur.pvOldY));
                (p > 3 || v > 3) && vkNow() - intval(cur.pvOldT) > 300 && (cur.pvTagger ? Phototag.stopTag() : Photoview.hide(0))
            }
        },
        onMouseMove: function(e) {
            var o = cur.pvPhoto.firstChild;
            if (!cur.pvTagger && o) {
                var t = getXY(o),
                    r = cur.pvData[cur.pvListId][cur.pvIndex],
                    a = 100 * (e.pageX - t[0]) / cur.pvPhWidth,
                    i = 100 * (e.pageY - t[1]) / cur.pvPhHeight;
                for (var p in r.tags) {
                    var v = r.tags[p];
                    if (a > v[0] && a < v[2] && i > v[1] && i < v[3]) return void Photoview.showDynTag(p)
                }
                Photoview.hideTag()
            }
        },
        onKeyDown: function(e) {
            return e.returnValue === !1 ? !1 : e.keyCode == KEY.ESC && cur.pvEditing ? (Photoview.cancelInline(), cancelEvent(e)) : (e.altKey && e.keyCode == KEY.RETURN &&
                Photoview.canFullscreen() && (cur.pvCanvas ? Photoview.fullscreenStop() : Photoview.fullscreen()), e.keyCode == KEY.SPACE && cur.pvCanvas && window.FullscreenPV &&
                (FullscreenPV.startSlide(), FullscreenPV.showControls(!0)), window.Emoji && Emoji.shown || e.target && ("INPUT" == e.target.tagName || "TEXTAREA" == e.target
                    .tagName || "DIV" == e.target.tagName && e.target.contentEditable) ? !0 : e.keyCode == KEY.ESC ? (cur.pvCanvas ? Photoview.fullscreenStop() : cur.pvTagger ?
                    Phototag.stopTag() : e.vkCanceled || curBox() || Photoview.hide(0), cancelEvent(e)) : (cur.pvTagger || boxQueue.count() || cur.pvComment && cur.pvComment
                    .focused || (e.keyCode == KEY.RIGHT ? Photoview.show(cur.pvListId, cur.pvIndex + 1) : e.keyCode == KEY.LEFT && Photoview.show(cur.pvListId, cur.pvIndex -
                        1)), cur.pvCanvas && window.FullscreenPV ? !1 : void 0))
        },
        updateVerticalPosition: function() {
            if (cur.pvCont) {
                var e = getSize(cur.pvCont),
                    o = clientHeight(),
                    t = o / 2 - e[1] / 2;
                setStyle(layer, "margin-top", Math.round(t))
            }
        },
        calculateVeryBig: function() {
            var e = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            e > 1800 ? cur.pvVeryBig = 3 : e > 1200 ? cur.pvVeryBig = 2 : e > 800 ? cur.pvVeryBig = 1 : cur.pvVeryBig = !1, window.devicePixelRatio > 1 && (cur.pvVeryBig += 1,
                cur.pvVeryBig = Math.min(3, cur.pvVeryBig))
        },
        updatePhotoDimensions: function(e) {
            removeClass(cur.pvBottomInfo, "pv_with_line_break");
            var o = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                t = Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                r = getSize(cur.pvBottomInfo)[1],
                a = Photoview.MIN_WIDTH,
                i = Photoview.MIN_HEIGHT,
                p = Math.max(a, o - Photoview.SIDE_COLUMN_WIDTH - 2 * Photoview.SIDE_MIN_GAP),
                v = t - r - 2 * Photoview.VERTICAL_MIN_GAP;
            Photoview.calculateVeryBig();
            var n = cur.pvCurData || {
                    width: a,
                    height: i
                },
                s = n.width / n.height,
                c = Math.min(p, n.width),
                u = c / s;
            u = Math.min(v, u), c = u * s;
            var l = getXY(cur.pvBottomLeft)[0] + getSize(cur.pvBottomLeft)[0] > getXY(cur.pvBottomActions)[0] - 20;
            toggleClass(cur.pvBottomInfo, "pv_with_line_break", l), e && (cur.prevPhotoWidth = cur.prevPhotoHeight = 0);
            var d = cur.prevPhotoWidth = Math.max(c, a, cur.prevPhotoWidth || 0),
                h = cur.prevPhotoHeight = Math.max(u, i, cur.prevPhotoHeight || 0),
                g = h / 2 - u / 2;
            if (g > 0 && !isVisible(cur.pvTagInfo)) {
                var m = getSize(cur.pvPhoto)[1] + r,
                    _ = m / 2 - u / 2;
                _ > r && (g = _)
            }
            setStyle(domFC(cur.pvPhoto), {
                width: c,
                height: u,
                marginTop: g
            }), cur.pvTagFrame && setStyle(domFC(cur.pvTagFrame), {
                width: c,
                height: u,
                marginTop: g
            }), setStyle(cur.pvPhoto, {
                width: d,
                height: h
            });
            var w = (cur.pvIsLightMode ? 0 : Photoview.SIDE_COLUMN_WIDTH) + d;
            setStyle(cur.pvCont, "width", w);
            var f = getXY(cur.pvBox),
                P = f[0],
                T = o - f[0] - getSize(cur.pvBox)[0];
            setStyle(cur.pvNavPanels[1], "width", P), setStyle(cur.pvNavPanels[0], "width", T);
            var b = 100 > P;
            toggleClass(cur.pvNavPanels[0], "pv_nav_panel_icon_centered", b), toggleClass(cur.pvNavPanels[1], "pv_nav_panel_icon_centered", b), Photoview.updateRightBlock(),
                Photoview.updateVerticalPosition(), f = getXY(cur.pvBox);
            var C = Math.max(f[1] - bodyNode.scrollTop, .4 * t / 2);
            setStyle(ge("pv_nav_close"), "height", C), cur.pvPhWidth = c, cur.pvPhHeight = u
        },
        onResize: function() {
            lastWindowWidth,
            lastWindowHeight,
            sbWidth();
            if (cur.pvCanvas) {
                var e = !1,
                    o = cur.pvVeryBig,
                    t = cur.pvCanvas.offsetWidth,
                    r = cur.pvCanvas.offsetHeight;
                return cur.pvVeryBig = t > 1280 || r > 1280 ? 2 : t > 807 || r > 807 ? 1 : !1, void((e = o != cur.pvVeryBig) && setTimeout(Photoview.preload.pbind(cur.pvIndex,
                    cur.pvLastDirection || 1), 10))
            }
            if (cur.pvAlbumsShown || cur.pvAlbumShown || cur.pvPhotoTagShown ? setStyle(cur.pvCont, "width", 800) : Photoview.updatePhotoDimensions(!0), cur.pvPhoto) {
                if (browser.mozilla && cur.pvPhoto.firstChild) {
                    var a = cur.pvPhoto.firstChild.offsetLeft,
                        i = (lastWindowWidth - cur.pvActualWidth) % 2 && (cur.pvActualWidth - cur.pvPhWidth) % 2 ? 4 : 3;
                    setStyle(cur.pvTagFrame, {
                        left: a - i + "px"
                    })
                }
                Photoview.scrollResize()
            }
        },
        updateSize: function() {
            cur.pvBox && toggleClass(cur.pvBox, "photos_is_albums_view", !!cur.pvAlbumsShown || !!cur.pvAlbumShown), onBodyResize(), Photoview.onResize()
        },
        activate: function(e) {
            e && e.timeout ? (clearTimeout(e.timeout), removeAttr(e, "timeout")) : isVisible(e) && fadeTo(e, 200, vk.pvdark ? 1 : .7)
        },
        deactivate: function(e) {
            e && isVisible(e) && !e.timeout && (e.timeout = setTimeout(function() {
                removeAttr(e, "timeout"), fadeTo(e, 200, .4)
            }, 1))
        },
        deletePhoto: function(e) {
            var o = cur.pvListId,
                t = cur.pvIndex,
                r = cur.pvData[o][t],
                a = curBox();
            return cur.deletionProgress = cur.deletionProgress || {}, cur.deletionProgress[r.id] ? void 0 : (cur.deletionProgress[r.id] = !0, cur.pvTagger && ev !== !1 ? void Phototag
                .stopTag() : void ajax.post("al_photos.php", {
                    act: "delete_photo",
                    photo: r.id,
                    hash: r.hash,
                    set_prev: isChecked("pvb_prev_check"),
                    sure: intval(e)
                }, {
                    onDone: function(e, i) {
                        return cur.deletionProgress[r.id] = !1, a ? (a.hide(), nav.go("/id0", !1, {
                            nocur: !0
                        })) : i ? showFastBox(e, i, getLang("global_delete"), Photoview.deletePhoto.pbind(1), getLang("global_cancel")) : void(o == cur.pvListId &&
                            t == cur.pvIndex && (cleanElems("pv_confirm_tag", "pv_delete_tag", "pv_prof_cancel", "pv_prof_done"), Photoview.toggleTopInfoPanel(
                                getLang("photo_deleted"), e), r.deleted = [cur.pvTagInfoText.innerHTML, cur.pvTagInfoButtons.innerHTML], Photoview.toggleDeletedState(!
                                0)))
                    }
                }))
        },
        restorePhoto: function(e) {
            var o = cur.pvListId,
                t = cur.pvIndex,
                r = cur.pvData[o][t];
            isButtonLocked(e) || ajax.post("al_photos.php", {
                act: "restore_photo",
                photo: r.id,
                hash: r.hash
            }, {
                onDone: function(e) {
                    r.deleted = !1, o == cur.pvListId && t == cur.pvIndex && (cleanElems("pv_confirm_tag", "pv_delete_tag", "pv_prof_cancel", "pv_prof_done"),
                        Photoview.toggleTopInfoPanel(!1), Photoview.toggleDeletedState(!1))
                },
                showProgress: lockButton.pbind(e),
                hideProgress: unlockButton.pbind(e)
            })
        },
        spamPhoto: function(e, o, t) {
            var r = cur.pvListId,
                a = cur.pvIndex,
                i = cur.pvData[r][a];
            if (!isButtonLocked(t)) return cur.pvTagger && ev !== !1 ? void Phototag.stopTag() : void ajax.post("al_photos.php", {
                act: "spam_photo",
                photo: i.id,
                hash: i.hash,
                spam_hash: o,
                pv: 1
            }, {
                onDone: function(e, o) {
                    o && (i.deleted = e), r == cur.pvListId && a == cur.pvIndex && (cleanElems("pv_confirm_tag", "pv_delete_tag", "pv_prof_cancel",
                        "pv_prof_done"), Photoview.toggleTopInfoPanel(getLang("photo_marked_as_spam_restore"), e), o && hide(cur.pvCommentsData))
                },
                showProgress: lockButton.pbind(t),
                hideProgress: unlockButton.pbind(t)
            })
        },
        rotatePhoto: function(e) {
            var o = ge("pv_rotate_progress");
            if (!isVisible(o)) {
                show(o), ge("pv_rotate")
                    .appendChild(ce("div", {
                        id: "pv_rotate_frame",
                        className: "upload_frame",
                        innerHTML: '<iframe name="pv_rotate_frame"></iframe>'
                    }));
                var t = cur.pvListId,
                    r = cur.pvIndex,
                    a = cur.pvData[t][r],
                    i = ge("pv_rotate_form");
                i.innerHTML = "", i.action = a.rotate[0];
                var p = extend({
                    act: "do_rotate",
                    to: e,
                    list_id: t,
                    index: r,
                    fid: a.id
                }, a.rotate);
                if (e = (e + 4) % 4, "rotate_photo" == p.act && (p.angle = (p.angle + e) % 4), p["rot" + e]) return p.act = "done_rotate", p.complete = 1, void ajax.post(
                    "/al_photos.php", p, {
                        onDone: Photoview.rotateDone,
                        onFail: function() {
                            Photoview.rotateDone()
                        }
                    });
                for (var v in p) 0 != v && i.appendChild(ce("input", {
                    type: "hidden",
                    name: v,
                    value: p[v]
                }));
                i.submit()
            }
        },
        rotateDone: function(e) {
            hide("pv_rotate_progress");
            var o = ge("pv_rotate_frame");
            if (o && (re(o), e)) {
                var t = e.list_id,
                    r = e.index,
                    a = cur.pvData[t][r];
                extend(a, {
                    x_src: e.x_src,
                    y_src: e.y_src,
                    z_src: e.z_src,
                    w_src: e.w_src,
                    base: e.base,
                    x_: e.x_,
                    y_: e.y_,
                    z_: e.z_,
                    w_: e.w_,
                    x: 0,
                    y: 0,
                    z: 0,
                    w: 0,
                    tags: e.tags,
                    tagged: e.tagged,
                    tagshtml: e.html
                }), extend(a.rotate, {
                    photo: e.photo,
                    hash: e.hash,
                    rhash: e.rhash,
                    angle: e.angle,
                    rot1: e.rot1,
                    rot3: e.rot3
                }), t == cur.pvListId && r == cur.pvIndex && Photoview.show(t, r)
            }
        },
        likeUpdate: function(e, o, t) {
            o = intval(o);
            var r = cur.pvListId,
                a = cur.pvIndex,
                i = (cur.pvData[r][a], ge("pv_like")),
                p = (domByClass(i, "_icon"), domByClass(i, "_count"));
            if (p) {
                var v = i.tt || {},
                    n = clone(v.opts || {}),
                    s = domByClass(v.container, "_content"),
                    c = domByClass(v.container, "_title");
                t && c && val(c, t), v && (v.likeInvalidated = !0), animateCount(p, o), toggleClass(i, "pv_liked", e), toggleClass(i, "no_likes", !o), toggleClass(s,
                    "me_hidden", !e), o ? !v.el || isVisible(v.container) || t || tooltips.show(v.el, extend(n, {
                    showdt: 0
                })) : v.el && v.hide(), toggleClass(cur.pvHH, "pv_liked", !!e)
            }
        },
        like: function() {
            if (vk.id) {
                var e = cur.pvListId,
                    o = cur.pvIndex,
                    t = cur.pvData[e][o];
                if (cur.pvLikeInProgress = cur.pvLikeInProgress || {}, !cur.pvLikeInProgress[t.id]) {
                    cur.pvLikeInProgress[t.id] = !0;
                    var r = t.liked = !t.liked;
                    cur.pvCommsLikes[t.id][1] += r ? 1 : -1, ajax.post("like.php", {
                        act: "a_do_" + (r ? "" : "un") + "like",
                        object: "photo" + t.id,
                        hash: t.hash,
                        from: "photo_viewer"
                    }, {
                        onDone: function(a, i) {
                            return cur.pvLikeInProgress[t.id] -= 1, cur.pvListId == e && cur.pvIndex == o ? Photoview.likeUpdate(r, a, i) : (cur.pvCommsLikes[t.id]
                                [1] = a, void(t.liked = r))
                        }
                    }), Photoview.likeUpdate(r, cur.pvCommsLikes[t.id][1])
                }
            }
        },
        likeShare: function(e) {
            if (vk.id) {
                var o = cur.pvListId,
                    t = cur.pvIndex,
                    r = cur.pvData[o][t],
                    a = ge("like_share_photo" + r.id),
                    i = isChecked(a);
                checkbox(a), ajax.post("like.php", {
                    act: "a_do_" + (i ? "un" : "") + "publish",
                    object: "photo" + r.id,
                    list: o,
                    hash: e,
                    from: "photo_viewer"
                }, {
                    onDone: function(e, a) {
                        return cur.pvListId == o && cur.pvIndex == t ? Photoview.likeUpdate(!0, e, a) : (cur.pvCommsLikes[r.id][1] = e, void(r.liked = !0))
                    }
                }), Photoview.likeUpdate(!0, cur.pvCommsLikes[r.id][1] + (r.liked ? 0 : 1))
            }
        },
        likeOver: function(e) {
            var o = cur.pvListId,
                t = cur.pvIndex,
                r = cur.pvData[o][t],
                a = domByClass(e, "_icon");
            if (a && !cur.viewAsBox) {
                var i = 41,
                    p = getXY(e)[0],
                    v = getXY(a)[0],
                    n = getSize(a, !0)[0],
                    s = v + n / 2 - p - i;
                showTooltip(e, {
                    url: "like.php",
                    params: {
                        act: "a_get_stats",
                        object: "photo" + r.id,
                        list: o
                    },
                    slide: 15,
                    shift: [-s, 6],
                    ajaxdt: 100,
                    showdt: 400,
                    hidedt: 200,
                    typeClass: "like_tt",
                    className: "pv_like_tt",
                    dir: "auto"
                })
            }
        },
        likeOut: function() {
            var e = cur.pvListId,
                o = cur.pvIndex,
                t = cur.pvData[e][o];
            t.liked || setTimeout(animate.pbind(cur.pvLikeIcon, {
                opacity: .4
            }, 200, !1), 1)
        },
        tagOver: function(e) {
            animate(e, {
                backgroundColor: "#6B8DB1"
            }, 200), showTooltip(e, {
                text: getLang("photos_delete_tag"),
                shift: [0, -2, 0]
            })
        },
        tagOut: function(e) {
            e.parentNode && e.parentNode.parentNode && animate(e, {
                backgroundColor: "#C4D2E1"
            }, 200)
        },
        deleteTag: function(e, o) {
            var t = cur.pvListId,
                r = cur.pvIndex,
                a = cur.pvData[t][r];
            if (a.tagid) {
                if (isVisible("pv_tag_handling")) return
            } else if (ge("pv_action_progress")) return;
            var i = o ? 1 : 0;
            ajax.post("al_photos.php", {
                act: "delete_tag",
                photo: a.id,
                tag: e,
                hash: a.hash,
                top_panel: i
            }, {
                onDone: function(e, o, i, p, v) {
                    a.tagid ? (a.taginfo = a.tagid = !1, cleanElems("pv_confirm_tag", "pv_delete_tag", "pv_prof_cancel", "pv_prof_done"), Photoview.toggleTopInfoPanel(
                            getLang("photos_tag_deleted"), e), addClass(cur.pvTagInfoButtons, "no_events"), setTimeout(function() {
                            removeClass(cur.pvTagInfoButtons, "no_events")
                        }, 1e3)) : Photoview.actionInfo()
                        .innerHTML = e, void 0 !== o && (a.tags = o, a.tagged = i, a.tagshtml = p, cur.pvListId == t && cur.pvIndex == r && (Photoview.setTags(p),
                            (!a.taginfo && a.actions.tag && o[0] < cur.pvMaxTags ? show : hide)(cur.pvTagLink)))
                },
                onFail: function(e) {
                    return e ? (Photoview.actionInfo()
                        .innerHTML = e, !0) : void 0
                },
                showProgress: function() {
                    if (lockButton(o), a.tagid);
                    else {
                        var e = Photoview.actionInfo();
                        e.innerHTML = "", showProgress(e)
                    }
                },
                hideProgress: function() {
                    unlockButton(o), a.tagid || re(Photoview.actionInfo())
                }
            })
        },
        restoreTag: function(e) {
            if (!ge("pv_action_progress")) {
                var o = cur.pvListId,
                    t = cur.pvIndex,
                    r = cur.pvData[o][t];
                ajax.post("al_photos.php", {
                    act: "restore_tag",
                    photo: r.id,
                    tag: e,
                    hash: r.hash
                }, {
                    onDone: function(e, a, i, p) {
                        void 0 !== a && (r.tags = a, r.tagged = i, r.tagshtml = p, cur.pvListId == o && cur.pvIndex == t && (Photoview.setTags(p), (!r.taginfo && r
                                .actions.tag && a[0] < cur.pvMaxTags ? show : hide)(cur.pvTagLink))), Photoview.actionInfo()
                            .innerHTML = e
                    },
                    onFail: function(e) {
                        return e ? (Photoview.actionInfo()
                            .innerHTML = e, !0) : void 0
                    },
                    showProgress: function() {
                        var e = Photoview.actionInfo();
                        e.innerHTML = "", showProgress(e)
                    },
                    hideProgress: function() {
                        re(Photoview.actionInfo())
                    }
                })
            }
        },
        confirmTag: function(e, o) {
            var t = cur.pvListId,
                r = cur.pvIndex,
                a = cur.pvData[t][r];
            isVisible("pv_tag_handling") || ajax.post("al_photos.php", {
                act: "confirm_tag",
                tag: e,
                photo: a.id,
                hash: a.hash
            }, {
                onDone: function(e, o, i, p) {
                    a.tags = e, a.tagged = o, a.tagshtml = i, a.taginfo = a.tagid = !1, t == cur.pvListId && r == cur.pvIndex && (Photoview.setTags(i), (!a.taginfo &&
                        a.actions.tag && e[0] < cur.pvMaxTags ? show : hide)(cur.pvTagLink), cleanElems("pv_confirm_tag", "pv_delete_tag", "pv_prof_cancel",
                        "pv_prof_done"), Photoview.toggleTopInfoPanel(!1))
                },
                showProgress: function() {
                    lockButton(o)
                },
                hideProgress: function() {
                    unlockButton(o)
                }
            })
        },
        toProfileTag: function() {
            var e = cur.pvData[cur.pvListId][cur.pvIndex].tagged[vk.id];
            e && !cur.pvTagger && Photoview.showTag(e)
        },
        showTag: function(e) {
            if (clearTimeout(cur.pvHidingTag), cur.pvShowingTag != e) {
                var o = clone(cur.pvData[cur.pvListId][cur.pvIndex].tags[e]);
                each(o, function(e, t) {
                    var r = cur[e % 2 ? "pvPhHeight" : "pvPhWidth"];
                    o[e] = Math.max(3, Math.min(r - 3, positive(t * r / 100)))
                });
                var t = 0;
                isVisible(cur.pvTagInfo) && trim(cur.pvTagInfo.innerHTML) && (t = getSize(cur.pvTagInfo)[1]);
                var r = domFC(cur.pvPhoto);
                t += parseFloat(getStyle(r, "margin-top")), setStyle(cur.pvTagFrame, {
                    marginLeft: o[0] + "px",
                    marginTop: o[1] + "px",
                    width: o[2] - o[0] + "px",
                    height: o[3] - o[1] + "px",
                    top: t
                }), setStyle(cur.pvTagFrame.firstChild, {
                    marginLeft: -o[0] + "px",
                    marginTop: -o[1] + "px"
                }), setStyle(cur.pvTagFaded, {
                    top: t
                }), cur.pvShowingTag = e, browser.msie ? show(cur.pvTagFrame, cur.pvTagFaded) : (fadeIn(cur.pvTagFrame, 200), fadeIn(cur.pvTagFaded, 200))
            }
        },
        showDynTag: function(e) {
            if (clearTimeout(cur.pvHidingTag), cur.pvShowingTag != e) {
                var o = clone(cur.pvData[cur.pvListId][cur.pvIndex].tags[e]),
                    t = ge("pv_tag" + e);
                if (t) {
                    each(o, function(e, t) {
                        o[e] = positive(t * cur[e % 2 ? "pvPhHeight" : "pvPhWidth"] / 100)
                    });
                    var r = 0;
                    isVisible(cur.pvTagInfo) && (r = getSize(cur.pvTagInfo)[1]), setStyle(cur.pvTagPerson, {
                        marginLeft: o[0] + "px",
                        marginTop: r + o[3] + "px",
                        minWidth: o[2] - o[0] + "px"
                    }), cur.pvTagPerson.innerHTML = t.firstChild.innerHTML;
                    var a = getSize(cur.pvTagPerson);
                    o[3] + a[1] > cur.pvPhHeight && setStyle(cur.pvTagPerson, {
                        marginTop: cur.pvPhHeight - a[1] + "px"
                    }), cur.pvTagPerson.onmouseover = Photoview.showDynTag.pbind(e), cur.pvShowingTag = e, browser.msie ? show(cur.pvTagPerson) : fadeIn(cur.pvTagPerson,
                        200)
                }
            }
        },
        hideTag: function(e) {
            e === !0 && (clearTimeout(cur.pvHidingTag), hide(cur.pvTagFaded, cur.pvTagFrame, cur.pvTagPerson), cur.pvShowingTag = !1), cur.pvShowingTag && (clearTimeout(cur.pvHidingTag),
                cur.pvHidingTag = setTimeout(function() {
                    browser.msie ? hide(cur.pvTagFaded, cur.pvTagFrame, cur.pvTagPerson) : cur.pvShowingTag && (fadeOut(cur.pvTagFaded, 200), fadeOut(cur.pvTagFrame,
                        200), fadeOut(cur.pvTagPerson, 200)), cur.pvShowingTag = !1
                }, 0))
        },
        realOffset: function(e, o, t) {
            var r = o;
            if (!cur.pvData || !cur.pvData[e]) return r;
            for (var a = 0; o > a; a++) cur.pvData[e][a] && (cur.pvData[e][a].deleted || cur.pvData[e][a].moved) && (r += t);
            return r
        },
        realCount: function(e, o) {
            var t = o;
            if (!cur.pvData || !cur.pvData[e]) return t;
            for (var r = 0; r < cur.pvData[e].length; r++) cur.pvData[e][r] && (cur.pvData[e][r].deleted || cur.pvData[e][r].moved) && t++;
            return t
        },
        list: function(e, o, t) {
            "deleted" != t && (cur.pvList || (cur.pvList = {}), cur.pvList[e + "_" + o] = t)
        },
        loaded: function(e, o, t, r, a) {
            if ("deleted" != e) {
                if (a && (extend(cur, {
                        lang: extend(cur.lang || {}, a.lang),
                        pvHash: a.hash,
                        pvCommLimit: a.commlimit,
                        pvCaptionLimit: a.captionlimit,
                        pvMaxTags: a.maxtags,
                        pvReasons: a.reasons,
                        pvReplyNames: extend(cur.pvReplyNames || {}, a.names || {}),
                        pvMediaTypes: a.media
                    }), window.pvcur = extend(window.pvcur || {}, {
                        wallTpl: a.wallTpl
                    }), cur.options || (cur.options = {}), cur.options.share || (cur.options.share = a.share), val(cur.pvAsGroup, "<div></div>" + getLang(
                        "wall_reply_as_group")), val("pv_comment_header", getLang("photos_yourcomment")), val(domFC(ge("pv_add_media")), getLang("global_add_media"))), o =
                    Photoview.realCount(e, o), t = Photoview.realOffset(e, t, 1), cur.pvData || (cur.pvData = {}), cur.pvCommsLikes || (cur.pvCommsLikes = {}), cur.pvData[e])
                    if (cur.pvData[e].length < o)
                        for (var i = cur.pvData[e].length; o > i; ++i) cur.pvData[e].push(void 0);
                    else cur.pvData[e].length > o && (cur.pvData[e] = cur.pvData[e].slice(0, o));
                else cur.pvData[e] = new Array(o);
                for (var i = (vkNow(), 0), p = r.length; p > i; ++i) {
                    for (var v = t + i, n = clone(r[i]); v >= o;) v -= o;
                    cur.pvCommsLikes[n.id] = [n.comments, n.likes, vkNow(), !1], delete n.comments, delete n.likes, cur.pvData[e][v] = n
                }
                cur.pvCandidate = 1
            }
        },
        showDeleted: function(e, o, t) {
            cur.pvShown && "temp" == cur.pvListId && (o += "<br><br>" + t), showFastBox({
                title: getLang("global_error"),
                onHide: function() {
                    cur.pvShown && "temp" == cur.pvListId && Photoview.hide(!0)
                }
            }, o)
        },
        spamDeleted: function(e, o, t) {
            isVisible(curBox()
                .progress) || ajax.post("al_photos.php", {
                act: "spam_photo",
                photo: o,
                hash: t,
                from: "deleted"
            }, {
                onDone: function(o) {
                    domPN(e)
                        .replaceChild(ce("span", {
                            innerHTML: o
                        }), e)
                },
                showProgress: curBox()
                    .showProgress,
                hideProgress: curBox()
                    .hideProgress
            })
        },
        showPhoto: function(e, o, t, r) {
            if ((!cur.pvShown || "temp" == cur.pvListId && !cur.pvWasShown || void 0 !== t.noHistory) && (debugLog("in showPhoto noHistory: " + t.noHistory), cur.pvNoHistory =
                    t.noHistory, cur.pvHistoryLength = t.noHistory ? 0 : t.histLen || 0), extend(cur, {
                    pvJumpTo: t.jumpTo || !1,
                    pvJumpFrom: !1,
                    pvJumpSteps: 0
                }), o = cur.pvList && cur.pvList[e + "_" + o] || o, cur.pvData && cur.pvData[o]) {
                var a = cur.pvData[o],
                    i = !0,
                    p = cur.pvOptions && cur.pvOptions.onHide;
                cur.pvOptions = t, cur.pvOptions.onHide || (cur.pvOptions.onHide = p);
                for (var v = 0, n = a.length; n > v; ++v)
                    if (a[v]) {
                        if (a[v].id === e) return Photoview.show(o, v, !1, t.root), t.onShow && t.onShow(), !1
                    } else i = !1;
                return i && r ? (t.onEmpty && t.onEmpty(), !1) : void 0
            }
        },
        loadedAlbums: function(e, o, t, r) {
            cur.pvAlbumsData && (ajax.preload("al_photos.php", extend({
                offset: r.offset,
                part: 1,
                owner: e
            }, {
                act: "show_albums"
            }), t), cur.curYear = r.cur_year, cur.pvAlbumsData[e] = {
                html: o,
                opts: r
            }, cur.pvAlbumsShowing == e && (Photoview.doShowAlbums(e, !1), boxRefreshCoords(layer)))
        },
        showAlbums: function(e, o) {
            e = intval(e), cur.pvAlbumsData || (cur.pvAlbumsData = {}), "temp" == cur.pvListId && cur.pvCancelLoad(), cur.pvNoHistory = o.noHistory, cur.pvHistoryLength = 0,
                cur.pvAlbumsShowing = e;
            var t = o.onFail;
            cur.pvAlbumsData[e] ? "loading" != cur.pvAlbumsData[e] && (Photoview.doShowAlbums(e, !1), boxRefreshCoords(layer)) : (cur.pvAlbumsData[e] = "loading", ajax.post(
                "al_photos.php", {
                    act: "show_albums",
                    owner: e
                }, extend(o, {
                    onDone: Photoview.loadedAlbums,
                    onFail: function(o) {
                        return t && t(o), delete cur.pvAlbumsData[e], cur.pvAlbumsData[e], layers.fullhide && layers.fullhide(!0), !0
                    }
                })))
        },
        loadedAlbum: function(e, o, t, r) {
            cur.pvAlbumData && (t && ajax.preload("al_photos.php", extend({
                offset: r.offset,
                part: 1,
                album: e
            }, {
                act: "show_album"
            }), t), cur.pvAlbumData[e] = {
                html: o,
                opts: r
            }, cur.pvAlbumShowing == e && (Photoview.doShowAlbum(e, !1), boxRefreshCoords(layer)))
        },
        showAlbum: function(e, o) {
            cur.pvAlbumData || (cur.pvAlbumData = {}), "temp" == cur.pvListId && cur.pvCancelLoad(), cur.pvNoHistory = o.noHistory, cur.pvHistoryLength = 0, cur.pvAlbumShowing =
                e;
            var t = o.onFail;
            cur.pvAlbumData[e] ? "loading" != cur.pvAlbumData[e] && (Photoview.doShowAlbum(e, !1), boxRefreshCoords(layer)) : (cur.pvAlbumData[e] = "loading", ajax.post(
                "al_photos.php", {
                    act: "show_album",
                    album: e
                }, extend(o, {
                    onDone: Photoview.loadedAlbum,
                    onFail: function(o) {
                        return t && t(o), delete cur.pvAlbumData[e], cur.pvAlbumData[e], layers.fullhide(!0), !0
                    }
                })))
        },
        loadedTagged: function(e, o, t) {
            cur.pvPhotoTagData && (cur.pvPhotoTagData[e] = {
                html: o,
                opts: t
            }, cur.pvPhotoTagShowing == e && (Photoview.doShowTagged(e, !1), boxRefreshCoords(layer)))
        },
        showTagged: function(e, o) {
            e = intval(e), cur.pvPhotoTagData || (cur.pvPhotoTagData = {}), "temp" == cur.pvListId && cur.pvCancelLoad(), cur.pvNoHistory = o.noHistory, cur.pvHistoryLength =
                0, cur.pvPhotoTagShowing = e;
            var t = o.onFail;
            cur.pvPhotoTagData[e] ? "loading" != cur.pvPhotoTagData[e] && (Photoview.doShowTagged(e, !1), boxRefreshCoords(layer)) : (cur.pvPhotoTagData[e] = "loading", ajax.post(
                "al_photos.php", {
                    act: "show_tag",
                    mid: e
                }, extend(o, {
                    onDone: Photoview.loadedTagged,
                    onFail: function(o) {
                        return t && t(o), delete cur.pvPhotoTagData[e], cur.pvPhotoTagData[e], layers.fullhide(!0), !0
                    }
                })))
        },
        loadedVideoTags: function(e, o, t, r) {
            ajax.preload("/al_video.php", {
                act: "show_video_tags",
                offset: r.offset,
                part: 1,
                mid: e
            }, t), cur.pvVideoTagsData = {
                html: o,
                opts: r
            }, cur.pvVideoTagShowing == e && (Photoview.doShowVideoTags(e, !1), boxRefreshCoords(layer))
        },
        showVideoTags: function(e, o) {
            cur.pvNoHistory = o.noHistory, cur.pvHistoryLength = 0, cur.pvVideoTagShowing = e, cur.videoBackOnClick = !0;
            var t = o.onFail;
            cur.pvVideoTagsData ? "loading" != cur.pvVideoTagsData && (Photoview.doShowVideoTags(e, !1), boxRefreshCoords(layer)) : (cur.pvVideoTagsData = "loading", ajax.post(
                "/al_video.php", {
                    act: "show_video_tags",
                    mid: e
                }, extend(o, {
                    onDone: Photoview.loadedVideoTags,
                    onFail: function(e) {
                        return t && t(e), delete cur.pvVideoTagsData, layers.fullhide && layers.fullhide(!0), !0
                    }
                })))
        },
        updatePeriods: function() {
            Photoview.periods = geByClass("photos_period_delimiter")
        },
        destroyPeriod: function() {
            Photoview.fixedPeriod && (re(Photoview.fixedPeriod), Photoview.fixedPeriod = !1, Photoview.fixedPeriodEl = !1)
        },
        fixPeriod: function() {
            if (Photoview.periods && Photoview.periods.length) {
                var e = scrollGetY(),
                    o = !1,
                    t = !1,
                    r = getSize(Photoview.periods[0])[1];
                for (var a in Photoview.periods) {
                    var i = getXY(Photoview.periods[a])[1];
                    if (i >= e) break;
                    o = Photoview.periods[a];
                    var p = intval(a) + 1;
                    t = Photoview.periods[p] ? getXY(Photoview.periods[p])[1] - e : !1
                }
                if (o) {
                    o == Photoview.fixedPeriodEl || (Photoview.fixedPeriod ? Photoview.fixedPeriod.innerHTML = o.innerHTML : (Photoview.fixedPeriod = ce("div", {
                        innerHTML: o.innerHTML,
                        className: "pva_period_fixed"
                    }, {
                        left: getXY(o)[0] + "px"
                    }), utils.appendChild(Photoview.fixedPeriod)), Photoview.fixedPeriodEl = o);
                    var v = t !== !1 ? t - r : 0;
                    v >= 0 && (v = 0), Photoview.fixedPeriodTop !== v && (setStyle(Photoview.fixedPeriod, {
                        top: v + "px"
                    }), Photoview.fixedPeriodTop = v)
                } else !o && Photoview.fixedPeriod && (re(Photoview.fixedPeriod), Photoview.fixedPeriod = !1, Photoview.fixedPeriodEl = !1)
            }
        },
        scrollResize: function() {
            if (!browser.mobile && cur.pvShown && (cur.pvAlbumsShown || cur.pvAlbumShown || cur.pvPhotoTagShown || cur.pvVideoTagsShown)) {
                var e = ge("ui_pv_photos_load_more"),
                    o = ge("ui_pva_more_load_more"),
                    t = 3 * lastWindowHeight;
                isVisible(e) && t > getXY(e)[1] - (browser.msie6 ? 0 : scrollGetY()) && (cur.pvVideoTagsShown ? Photoview.loadVideoTags() : cur.pvPhotoTagShown ? Photoview.loadTaggedPhotos() :
                        cur.pvAlbumsShown ? Photoview.loadAlbumsPhotos() : Photoview.loadAlbumPhotos()), cur.pvAlbumsShowing && Photoview.fixPeriod(), cur.pvAlbumsShown && cur
                    .pvShowAllAlbums && isVisible(o) && t > getXY(o)[1] - (browser.msie6 ? 0 : scrollGetY()) && Photoview.loadAlbums()
            }
        },
        loadAlbums: function() {
            cur.pvShowAllAlbums = !0, Photoview.loadAlbumsPhotos(!0)
        },
        loadedAlbumsPhotos: function(e, o, t, r) {
            if (cur.pvaLoading = 0, cur.pvAlbumsShown) {
                t ? cur.pvaOffset = e : cur.pvaPhotosOffset = e, r && (cur.curYear = r);
                var a = t ? ge("pva_content") : ge("pva_content_photos"),
                    i = t ? ge("ui_pva_more_load_more") : ge("ui_pv_photos_load_more"),
                    p = t ? {
                        act: "show_albums"
                    } : {
                        act: "show_albums",
                        only_photos: 1,
                        cur_year: cur.curYear
                    },
                    v = t ? cur.pvaOffset : cur.pvaPhotosOffset,
                    n = t ? cur.pvaCount : cur.pvaPhotosCount;
                if (a) {
                    for (var s = ce("div", {
                            innerHTML: o
                        }); s.firstChild;) {
                        if (hasClass(s.firstChild, "photos_period_delimiter")) {
                            var c = domData(s.firstChild, "year");
                            if (geByClass1("photos_period_delimiter_" + c)) {
                                re(s.firstChild);
                                continue
                            }
                        }
                        a.appendChild(s.firstChild)
                    }
                    return Photoview.onResize(), Photoview.updatePeriods(), e >= n || !o ? void hide(i) : void(t && (cur.pvaLoading = 1, ajax.post("al_photos.php", extend({
                        offset: v,
                        part: 1,
                        owner: cur.pvAlbumsShown
                    }, p || {}), {
                        onDone: function() {
                            debugLog("preload done: " + cur.pvaLoading), 2 == cur.pvaLoading ? Photoview.loadedAlbumsPhotos.apply(window, arguments) : cur.pvaLoading = !
                                1
                        },
                        onFail: function() {
                            return cur.pvaLoading = 0, !0
                        }
                    })))
                }
            }
        },
        loadAlbumsPhotos: function(e) {
            var o = e ? ge("ui_pva_more_load_more") : ge("ui_pv_photos_load_more"),
                t = e ? {
                    act: "show_albums"
                } : {
                    act: "show_albums",
                    only_photos: 1
                },
                r = e ? cur.pvaOffset : cur.pvaPhotosOffset;
            return cur.pvAlbumsShown && o && isVisible(o) && !isButtonLocked(o) ? cur.pvaLoading ? void(cur.pvaLoading = 2) : void ajax.post("al_photos.php", extend({
                offset: r,
                part: 1,
                owner: cur.pvAlbumsShown
            }, t || {}), {
                cache: t.only_photos ? 0 : 1,
                onDone: Photoview.loadedAlbumsPhotos,
                onFail: function() {
                    return cur.pvaLoading = 0, !0
                },
                showProgress: function() {
                    lockButton(o)
                },
                hideProgress: function() {
                    unlockButton(o)
                }
            }) : void 0
        },
        loadedAlbumPhotos: function(e, o) {
            if (cur.pvaLoading = 0, cur.pvAlbumShown) {
                cur.pvsaOffset = e;
                var t = ge("pvsa_content_photos"),
                    r = ge("ui_pv_photos_load_more");
                if (t) {
                    if (t.appendChild(cf(o)), e >= cur.pvsaCount) return hide(r), void Photoview.onResize();
                    setTimeout(function() {
                        Photoview.onResize()
                    }, 10), cur.pvsaLoading = 1, ajax.post("al_photos.php", {
                        offset: cur.pvsaOffset,
                        part: 1,
                        album: cur.pvAlbumShown,
                        act: "show_album"
                    }, {
                        onDone: function() {
                            2 == cur.pvsaLoading ? Photoview.loadedAlbumPhotos.apply(window, arguments) : (cur.pvsaLoading = !1, ajax.preload("al_photos.php", {
                                offset: cur.pvsaOffset,
                                part: 1,
                                album: cur.pvAlbumShown,
                                act: "show_album"
                            }, arguments))
                        },
                        onFail: function() {
                            return cur.pvsaLoading = 0, !0
                        }
                    })
                }
            }
        },
        loadAlbumPhotos: function() {
            var e = ge("ui_pv_photos_load_more"),
                o = cur.pvsaOffset;
            return cur.pvAlbumShown && e && isVisible(e) && !isButtonLocked(e) ? cur.pvsaLoading ? void(cur.pvsaLoading = 2) : void ajax.post("al_photos.php", {
                act: "show_album",
                album: cur.pvAlbumShown,
                offset: o,
                part: 1
            }, {
                onDone: Photoview.loadedAlbumPhotos,
                onFail: function() {
                    return cur.pvsaLoading = 0, !0
                },
                showProgress: function() {
                    lockButton(e)
                },
                hideProgress: function() {
                    unlockButton(e)
                },
                cache: !0
            }) : void 0
        },
        loadedTaggedPhotos: function(e, o) {
            if (cur.pvaLoading = 0, cur.pvPhotoTagShown) {
                cur.pvsaOffset = e;
                var t = ge("pvsa_content_photos"),
                    r = ge("ui_pv_photos_load_more");
                if (t) {
                    if (t.appendChild(cf(o)), Photoview.onResize(), e >= cur.pvsaCount || !o) return void hide(r);
                    cur.pvsaLoading = 1, ajax.post("al_photos.php", extend({
                        offset: cur.pvsaOffset,
                        part: 1,
                        mid: cur.pvPhotoTagShown
                    }, {
                        act: "show_tag"
                    }), {
                        onDone: function() {
                            debugLog("preload done: ", cur.pvsaLoading), 2 == cur.pvsaLoading ? Photoview.loadedTaggedPhotos.apply(window, arguments) : cur.pvsaLoading = !
                                1
                        },
                        onFail: function() {
                            return cur.pvsaLoading = 0, !0
                        }
                    })
                }
            }
        },
        loadTaggedPhotos: function(e) {
            var o = ge("ui_pv_photos_load_more"),
                t = cur.pvsaOffset;
            return cur.pvPhotoTagShown && o && isVisible(o) && !isButtonLocked(o) ? cur.pvsaLoading ? void(cur.pvsaLoading = 2) : void ajax.post("al_photos.php", {
                act: "show_tag",
                mid: cur.pvPhotoTagShown,
                offset: t,
                part: 1
            }, {
                onDone: Photoview.loadedTaggedPhotos,
                onFail: function() {
                    return cur.pvsaLoading = 0, !0
                },
                showProgress: function() {
                    lockButton(o)
                },
                hideProgress: function() {
                    unlockButton(o)
                },
                cache: 1
            }) : void 0
        },
        loadedMoreVideoTags: function(e, o) {
            if (cur.pvaLoading = 0, cur.pvVideoTagsShown) {
                cur.pvsaOffset = e;
                var t = ge("pva_video_tags"),
                    r = ge("pva_more_videos");
                if (t) {
                    if (t.appendChild(cf(o)), Photoview.onResize(), e >= cur.pvsaCount || !o) return void hide(r);
                    cur.pvsaLoading = 1, ajax.post("/al_video.php", extend({
                        act: "show_video_tags",
                        offset: cur.pvsaOffset,
                        part: 1,
                        mid: cur.pvVideoTagsShown
                    }), {
                        cache: 1,
                        onDone: function() {
                            debugLog("preload done: ", cur.pvsaLoading), 2 == cur.pvsaLoading ? Photoview.loadedMoreVideoTags.apply(window, arguments) : cur.pvsaLoading = !
                                1
                        },
                        onFail: function() {
                            return cur.pvsaLoading = 0, !0
                        }
                    })
                }
            }
        },
        loadVideoTags: function(e) {
            var o = ge("pva_more_videos"),
                t = ge("pva_more_videos_prg"),
                r = cur.pvsaOffset;
            if (cur.pvVideoTagsShown && o && isVisible(o) && !isVisible(t)) return cur.pvsaLoading ? void(cur.pvsaLoading = 2) : void ajax.post("/al_video.php", {
                act: "show_video_tags",
                mid: cur.pvVideoTagsShown,
                offset: r,
                part: 1
            }, {
                onDone: Photoview.loadedMoreVideoTags,
                onFail: function() {
                    return cur.pvsaLoading = 0, !0
                },
                showProgress: function() {
                    show(t), hide(o.firstChild)
                },
                hideProgress: function() {
                    show(o.firstChild), hide(t)
                },
                cache: 1
            })
        },
        thumbOver: function(e, o) {
            clearTimeout((cur.pvHideTO || {})[o]);
            var t = geByClass1("pva_title", e),
                r = t.previousSibling,
                a = getSize(geByClass1("pva_desc", e))[1];
            5 > a || (animate(t, {
                marginTop: 146 - (a + 7)
            }, {
                duration: 200,
                transition: Fx.Transitions.easeOutCirc
            }), "pva_repeat" == r.className && animate(r, {
                marginTop: 43 - Math.floor((a + 7) / 2)
            }, {
                duration: 200,
                transition: Fx.Transitions.easeOutCirc
            }))
        },
        thumbOut: function(e, o) {
            cur.pvHideTO || (cur.pvHideTO = {}), cur.pvHideTO[o] = setTimeout(function() {
                var o = geByClass1("pva_title", e),
                    t = o.previousSibling;
                animate(o, {
                    marginTop: 146
                }, 200), "pva_repeat" == t.className && animate(t, {
                    marginTop: 43
                }, 200)
            }, 150)
        },
        photoAct: function(e) {
            if (!(cur.pvAlbumsShown || cur.pvAlbumShown || cur.pvPhotoTagShown) && cur.pvCurPhoto.author) {
                var o = getXY(cur.pvHH, !0);
                o[0] ? cur.hhPos = o : o = cur.hhPos || [0, 0];
                var t = cur.pvHH,
                    r = Math.abs(e.clientX - o[0] - 36),
                    a = e.clientY - o[1];
                if (120 > r && 130 > a && a > -45) {
                    if (cur.pvHHShowing) return;
                    cur.pvHHShowing = !0, show(t), animate(t.firstChild, {
                        opacity: 1
                    }, 400), cur.rvPreloadBig || (vkImage()
                        .src = "/images/icons/post_big_hh.png", cur.rvPreloadBig = !0)
                } else {
                    if (!cur.pvHHShowing) return;
                    cur.pvHHShowing = !1, animate(t.firstChild, {
                        opacity: 0
                    }, 400)
                }
            }
        },
        fsMove: function(e) {
            if (!(cur.pvAlbumsShown || cur.pvAlbumShown || cur.pvPhotoTagShown) && cur.pvCurPhoto.author) {
                var o = getXY(cur.pvActions),
                    t = getSize(cur.pvActions),
                    r = Math.max(100, .2 * cur.pvPhWidth);
                e.pageX > o[0] - r && e.pageX < o[0] + t[0] + r && e.pageY > o[1] - r && e.pageY < o[1] + t[1] + r ? addClass(cur.pvActions, "visible") : removeClass(cur.pvActions,
                    "visible")
            }
        },
        hhCheck: function() {
            return (!browser.msie || intval(browser.version) > 9) && !cur.pvNoLikes
        },
        showRepeat: function(e) {
            e && !geByClass1("pva_repeat", e) && geByClass1("pva_link", e)
                .insertBefore(ce("div", {
                    className: "pva_repeat",
                    innerHTML: '<div class="pva_repeat_blob">  <div class="pva_repeat_cont"><img class="pva_repeat_img png" src="' + stManager._srcPrefix(".css") +
                        "/images/icons/post_hh" + (window.devicePixelRatio >= 2 ? "_2x" : "") + '.png?3" /><span class="pva_repeat_text">' + getLang(
                            "photos_repeat_album") + "</span></div></div>"
                }), geByClass1("pva_title", e))
        },
        showPlace: function() {
            var e = cur.pvCurPhoto.geohash;
            showBox("al_places.php", {
                act: "show_photo_place",
                geohash: e,
                photo: cur.pvCurPhoto.id
            }, {
                cache: 1
            })
        },
        editPlace: function() {
            var e = cur.pvCurPhoto.geohash;
            showBox("al_places.php", {
                act: "show_photo_place",
                edit: 1,
                geohash: e || "",
                photo: cur.pvCurPhoto.id
            })
        },
        updatePlace: function(e, o) {
            var t = ge("pv_edit_place");
            o ? (t && (t.innerHTML = o ? o + "." : ""), ge("pv_place")
                .innerHTML = o ? '<span class="pv_place_label"></span> <a class="pv_place_a" id="pv_place_a" onclick="Photoview.showPlace()">' + o + "</a>" : "", hide(
                    "pv_add_place")) : setTimeout(function() {
                ajax.post("al_photos.php", {
                    act: "get_photo_place",
                    photo: e
                }, {
                    onDone: function(o, t) {
                        Photoview.updatePlace(e, o)
                    }
                })
            }, 1e3)
        },
        reportComment: function(e, o, t) {
            stManager.add(["privacy.js", "privacy.css"], function() {
                return Privacy.show(e, o, "report_" + t)
            })
        }
    },
    photoview = Photoview;
try {
    stManager.done("photoview.js")
} catch (e) {}
