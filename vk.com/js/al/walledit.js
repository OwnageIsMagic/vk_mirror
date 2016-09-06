var WallEdit = {
    handleEditEsc: function(e) {
        e.keyCode == KEY.ESC && WallEdit.cancelEditPost()
    },
    editPost: function(e, t, i, o, a, n) {
        if (!window.Emoji) return stManager.add(["emoji.js", "notifier.css"], function() {
            WallEdit.editPost(e, t, i, o, a, n)
        }), !1;
        var s = ge("wpe_text");
        if (cur.editingPost && (cur.editingPost[0] != e || cur.editingPost[1]) && s) return window.Emoji ? Emoji.focus(s) : !1;
        var d, r, l = window.wkcur && wkcur.shown && wkcur.post == e ? geByClass1("_wall_post_cont", wkLayer) : ge("wpt" + e);
        d = "photo_comment" == a.reply ? ge("post" + e) : "video_comment" == a.reply ? ge("mv_comment" + e.replace(/(\d+)video_(\d+)mv/, "$1_$2")) : "market_comment" == a.reply ?
            ge("market_comment" + e.replace(/(\d+)market_(\d+)/, "$1_$2")) : ge("post" + e), r = a.wkview ? "wl_post_actions_wrap" : a.reply ? "wpe_bottom" + e :
            geByClass1("ui_actions_menu_wrap", d), addClass(d, "wpe_wrap");
        var c = geByClass1("post_edit_button", d) || geByClass1("reply_edit_button", d);
        c && setStyle(c, {
            visibility: "hidden"
        }), cur.editingPost = [e, l, r, a];
        var p = null;
        a.wkview ? (p = geByClass1("post_author", ge("wl_post"), "div"), WkView.wallOnEdit(e, a)) : p = geByClass1(a.reply ? "reply_author" : "post_author", d), hide(
            geByClass1("wall_signed", domPN(l)));
        var u = ce("span", {
                className: "wpe_info"
            }),
            _ = geByClass1(a.reply ? "like_wrap" : "post_full_like_wrap", d, "div"),
            w = ge("post_publish_wrap" + e);
        p && (re(geByClass1("wpe_info", p)), cur.editingPost.push(p.appendChild(u))), cur.editingPost.push(_), cur.editingPost.push(w), cur.lang = extend(cur.lang || {}, a
                .lang), cur.options = extend(cur.options || {}, {
                share: a.share
            }), cur.editHash = o, val(u, " - " + (a.reply ? getLang("wall_editing_reply") : getLang("wall_editing_post"))), addEvent(window, "keydown", WallEdit.handleEditEsc),
            t = Emoji.emojiToHTML(clean(replaceEntities(t)), !0);
        browser.opera_mobile ? "blur" : "keyup";
        l.parentNode.insertBefore(ce("div", {
            id: "wpe_cont",
            innerHTML: '<div class="clear_fix"><div class="wpe_text_cont _emoji_field_wrap"><div class="emoji_smile_wrap _emoji_wrap"><div class="emoji_smile _emoji_btn" title="' +
                stripHTML(getLang("wall_reply_emoji_hint")) +
                '" onmouseover="return WallEdit.emojiShowTT(this, event);" onmouseout="return WallEdit.emojiHideTT(this, event);" onmousedown="return cancelEvent(event);"><div class="emoji_smile_icon"></div></div></div><div id="wpe_text" class="dark" contenteditable="true">' +
                t + '</div></div></div><div id="wpe_warn"></div><div id="wpe_media_preview" class="clear_fix media_preview"></div>' + (a.signed ?
                    '<div id="wpe_signed" class="checkbox' + (a.signed > 0 ? " on" : "") + '" onclick="checkbox(this)">' + getLang("wall_suggest_subscribe") +
                    "</div>" : "") + (a.add ? '<div class="wpe_auth">' + a.add + "</div>" : "") + '<div class="wpe_buttons">' + (a.noatt ? "" :
                    '<div id="wpe_add_media" class="page_add_media"><span class="add_media_lnk"></span></div>') +
                '<button id="wpe_save" class="flat_button" onclick="WallEdit.savePost()">' + (w && intval(w.getAttribute("data-suggest")) ? getLang(
                    "wall_publish_suggest") : getLang("global_save")) +
                '</button>  <button class="wpe_cancel flat_button secondary button_light" onclick="WallEdit.cancelEditPost()">' + getLang("global_cancel") +
                "</button></div>"
        }, {
            display: "none"
        }), l);
        var g = {
                introText: getLang("profile_mention_start_typing"),
                noResult: getLang("profile_mention_not_found")
            },
            m = function() {
                var e = ge("wpe_text");
                return Emoji.init(e, {
                    ttDiff: -48,
                    rPointer: !0,
                    controlsCont: e.parentNode,
                    shouldFocus: !0,
                    onSend: function() {
                        WallEdit.savePost()
                    },
                    noEnterSend: !0,
                    noStickers: !0,
                    checkEditable: function() {
                        Wall.checkPostLen.pbind(e, "wpe_warn", Emoji.val(e))
                    },
                    initUploadForImagePasteCallback: window.Page ? Page.initUploadForImagePaste : void 0
                })
            };
        return a.noatt ? void setTimeout(function() {
            addClass("wpe_media_preview", "med_no_attach"), show(l.previousSibling, "wpe_media_preview"), hide(l, r, _, w), cur.wallEditComposer = Composer.init(ge(
                "wpe_text"), {
                lang: g
            }), Emoji.editableFocus("wpe_text"), cur.weEmoji = m()
        }, 0) : void setTimeout(function() {
            show(l.previousSibling), hide(l, r, _, w);
            var t, o = [],
                s = [];
            a.reply ? (each(n, function() {
                inArray(this[0], ["photo", "video", "audio", "doc", "link"]) && o.push(this)
            }), s = ["album"]) : a.copy ? (each(n, function() {
                inArray(this[0], ["photo", "video", "audio", "doc", "postpone", "mark_as_ads"]) && o.push(this)
            }), s = ["album", "share", "link", "page"]) : o = n, o.length > 0 && (t = {
                lnk: ge("wpe_add_media")
                    .firstChild,
                preview: "wpe_media_preview",
                types: o,
                options: {
                    toId: e.split("_")[0],
                    disabledTypes: s,
                    limit: a.copy ? 1 : a.reply ? 2 : 10,
                    toggleLnk: a.reply || a.copy,
                    editable: !a.reply && !a.copy,
                    sortable: !a.reply && !a.copy
                }
            }, a.teWidth && (t.options.teWidth = a.teWidth), a.teHeight && (t.options.teHeight = a.teHeight), ("photo_comment" == a.reply ||
                "video_comment" == a.reply) && (t.options.nocl = 1), "photo_comment" == a.reply && (t.options.maxShown = 0, t.options.hideAfterCount = 0));
            var c = ge("wpe_text");
            if (cur.wallEditComposer = Composer.init(c, {
                    lang: g,
                    media: t
                }), t) {
                cur.wallEditMedia = cur.dropboxAddMedia = cur.wallEditComposer.addMedia, WallUpload.attachToEl(d);
                for (var p = 0, u = i.length; u > p; ++p) cur.wallEditMedia.chooseMedia.apply(cur.wallEditMedia, i[p]), "postpone" == i[p][0] && cur.editingPost.push(
                    i[p][1])
            }
            cur.weEmoji = m(), cur.onEditFormSizeUpdate && cur.onEditFormSizeUpdate()
        }, 0)
    },
    emojiShowTT: function(e, t) {
        return void 0 === cur.weEmoji ? !1 : Emoji.ttShow(cur.weEmoji, e, t)
    },
    emojiHideTT: function(e, t) {
        return void 0 === cur.weEmoji ? !1 : Emoji.ttHide(cur.weEmoji, e, t)
    },
    cancelEditPost: function(e, t, i) {
        if (cur.editingPost) {
            var o = cur.editingPost[0],
                a = ge(cur.editingPost[1]),
                n = ge(cur.editingPost[2]),
                s = cur.editingPost[3],
                d = ge("wpe_save"),
                r = cur.editingPost[4],
                l = cur.editingPost[5],
                c = cur.editingPost[6],
                p = cur.editingPost[7];
            if (o && a && d && !buttonLocked(d)) {
                var u = ge("wpe_text");
                if (0 === e) return window.Emoji ? Emoji.focus(u) : !1;
                cur.editingPost = cur.dropboxAddMedia = !1, removeEvent(window, "keydown", WallEdit.handleEditEsc), WallUpload.attachToEl("submit_post_box"), Wall.deinitComposer(
                    u);
                var _ = ge("wpe_add_media");
                _ && cleanElems(_.firstChild);
                var w = ge("post" + o),
                    g = geByClass1("post_edit_button", w) || geByClass1("reply_edit_button", w);
                if (g && setStyle(g, {
                        visibility: ""
                    }), removeClass(w, "wpe_wrap"), -1 == e) return void Wall.postponedPublished(o);
                if (void 0 !== e) {
                    val(a, e), val(r, " - " + (s && s.reply ? getLang("wall_reply_saved") : getLang("wall_post_saved")));
                    var m = geByClass1("rel_date", w);
                    if (p) {
                        t && m && (m.innerHTML = t);
                        var v = geByClass1("page_fronly", o);
                        i && !v ? r.nextSibling ? r.parentNode.insertBefore(se(i), r.nextSibling) : r.parentNode.appendChild(se(i)) : !i && v && re(v)
                    }
                    setTimeout(animate.pbind(r, {
                            opacity: 0
                        }, 500, re.pbind(r)), 1500), o.match(/^-?\d+photo_/) ? window.Photoview && Photoview.commSaved(o) : o.match(/^-?\d+video_/) && window.Videoview &&
                        Videoview.commSaved(o)
                } else re(r);
                show(n, a, l, c), show(geByClass1("wall_signed", domPN(a))), re(a.previousSibling), s.wkview && WkView.wallOnEdited(o), "exchange" == s.from && re(
                    "exchange_msg");
                var h = window.audioPlayer;
                h && h.showCurrentTrack && h.showCurrentTrack()
            }
        }
    },
    savePost: function() {
        if (cur.editingPost) {
            var e = cur.editingPost[0],
                t = ge("wpe_save"),
                i = cur.editingPost[3],
                o = cur.editingPost[6];
            if (e && t && !buttonLocked(t)) {
                var a = cur.wallEditComposer,
                    n = cur.wallEditMedia || {},
                    s = Composer.getSendParams(a, WallEdit.savePost),
                    d = cur.onepost ? "one" : (window.wkcur || {})
                    .shown ? "wk" : "";
                if (i.from ? d = i.from : e.match(/^-?\d+photo_/) && cur.pvShown ? d = "photo" : e.match(/^-?\d+video_/) && window.mvcur && mvcur.mvShown && !mvcur.minimized ?
                    d = "video" : e.match(/^-?\d+market_/) && ge("market_comments_wrap") && (d = "market"), !s.delayed) {
                    var r;
                    if ((r = ge("status_export" + n.lnkId)) && (s.status_export = isChecked(r)), (r = ge("facebook_export" + n.lnkId)) && (s.facebook_export = isChecked(r)),
                        (r = ge("friends_only" + n.lnkId)) && (s.friends_only = isChecked(r)), !s.attach1_type && !s.message && !i.copy) return window.Emoji ? Emoji.focus(
                        ge("wpe_text")) : !1;
                    if (o && intval(o.getAttribute("data-suggest"))) extend(s, {
                        act: "post",
                        suggest: e,
                        signed: isChecked("wpe_signed"),
                        hash: cur.editHash,
                        to_id: e.split("_")[0]
                    }), ajax.post("al_wall.php", Wall.fixPostParams(s), {
                        showProgress: lockButton.pbind(t),
                        hideProgress: unlockButton.pbind(t),
                        onDone: Wall.suggestPublished.pbind(e)
                    });
                    else {
                        extend(s, {
                            act: "save",
                            post: e,
                            whole: 1,
                            hash: cur.editHash,
                            signed: isChecked("wpe_signed"),
                            from: d
                        }), vk.widget && cur.options && extend(s, {
                            max_w: cur.options.max_w,
                            reply_max_w: cur.options.reply_max_w,
                            from: cur.options.from
                        });
                        var l = ge("wpe_cont"),
                            c = geByClass1("wpe_error", l);
                        c && hide(c), ajax.post("al_wall.php", Wall.fixPostParams(s), {
                            showProgress: lockButton.pbind(t),
                            hideProgress: unlockButton.pbind(t),
                            onDone: WallEdit.cancelEditPost,
                            onFail: function(e) {
                                return c || (c = se('<div class="wpe_error error"><div>'), l.insertBefore(c, domFC(l))), val(c, e || getLang(
                                    "global_unknown_error")), isVisible(c) || (slideDown(c, 100), vk.widget && cur.scrollbar && cur.scrollbar.scrollIntoView(
                                    c, 100)), !0
                            }
                        })
                    }
                }
            }
        }
    }
};
try {
    stManager.done("walledit.js")
} catch (e) {}
