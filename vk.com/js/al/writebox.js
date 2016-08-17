var WriteBox = {
    mrg: function(e) {
        return vk.rtl ? {
            marginRight: e
        } : {
            marginLeft: e
        }
    },
    show: function(e, i) {
        var t = i.toData[0],
            r = i.toData[7];
        if (e.setOptions({
                hideButtons: !0,
                width: 502,
                bodyStyle: "padding: 0px; border: 0px;",
                title: i.title,
                titleControls: ('<a class="mail_box_header_link" href="/im?sel=' + t + '" onclick="return WriteBox.toFull(event, ' + t + ')">' + i.mail_go_to_dialog +
                        "</a>")
                    .replace("%s", r)
            }), e.removeButtons(), cur.lang = extend(cur.lang || {}, i.lang), extend(cur, {
                mbTxtInp: {},
                mbEditable: i.editable,
                mbSmile: ge("mbe_smile"),
                toData: i.toData,
                mbEmoji: i.emoji,
                mbMedia: null,
                mbField: ge(i.editable ? "mail_box_editable" : "mail_box_text"),
                mbAva: ge("mail_box_ava"),
                mbMediaTypes: i.mediaTypes,
                mbTo: i.toData,
                mbHash: i.hash,
                mbBannedHim: i.bannedhim
            }), i.emojiRcnt && !cur.mbRcntEmoji) {
            for (var o = [], a = i.emojiRcnt, n = 0, c = a.length; c > n; ++n) {
                var m = a[n];
                m && o.push('<a id="mbe_rc_em_' + m + '" class="mbe_rc_emojibtn" onmousedown="Emoji.addEmoji(cur.emojiWId, \'' + m +
                    "', this); return cancelEvent(event);\">" + Emoji.getEmojiHTML(m, !1, !0) + "</a>")
            }
            cur.mbRcntEmoji = o.join("")
        }
        val("mbe_rcemoji", cur.mbRcntEmoji || ""), cur.peer = WriteBox.getPeer(), cur.sharedImWrite = {}, cur.emojiWId = Emoji.init(cur.mbField, {
            ttDiff: 1,
            controlsCont: ge("mbe_emoji_wrap"),
            shouldFocus: !0,
            onSend: WriteBox.send,
            rPointer: !0,
            noEnterSend: 1,
            noStickers: !!i.checkedRecipent,
            forceTxt: !i.editable,
            sharedTT: cur.sharedImWrite,
            txt: ge("mail_box_editable"),
            checkEditable: WriteBox.checkEditable,
            saveDraft: WriteBox.saveDraft,
            rceCont: ge("mbe_rcemoji_cont"),
            addMediaBtn: ge("mail_box_add_row"),
            sendWrap: ge("mail_box_controls"),
            onKeyAction: function(e) {
                clearTimeout(cur.saveWriteBoxDraft), cur.saveWriteBoxDraft = setTimeout(WriteBox.saveDraft, "paste" == e.type ? 0 : 300)
            },
            onStickerSend: function(e, i) {
                var t = trim(Emoji.editableVal(cur.mbField)),
                    r = cur.mbMedia.getMedias(),
                    o = cur.toData[0];
                ajax.post("/al_mail.php", {
                    act: "a_send",
                    to_ids: o,
                    chas: cur.mbHash,
                    msg: "",
                    ts: cur.ts,
                    media: "sticker:" + e,
                    send_sticker: 1,
                    from: "box",
                    sticker_referrer: i
                }, {
                    onDone: function(e, i) {
                        t || r.length ? WriteBox.send(!1) : (i && ls.set("im_draft" + vk.id + "_" + i, !1), curBox()
                            .hide(), showDoneBox(e))
                    },
                    showProgress: lockButton.pbind("mail_box_send"),
                    hideProgress: unlockButton.pbind("mail_box_send"),
                    onFail: function(e) {
                        return setTimeout(showFastBox(getLang("global_error"), e)
                            .hide, 3e3), !0
                    }
                })
            }
        }), cur.mbTo[0] ? cur.mbHidden = !1 : cur.mbHidden = !0, cur.imwEmoji = -1;
        var d = cur.postTo;
        cur.postTo = !1, e.setOptions({
            onHide: function() {
                removeEvent(document, "keydown", WriteBox.onKey), cur.mbEmojiShown && Emoji.ttClick(cur.emojiWId, cur.mbSmile, !0), cur.mbOnMouseClick && (cur.onMouseClick =
                    cur.mbOnMouseClick, cur.mbOnMouseClick = !1), browser.mozilla
            },
            onShow: function() {
                addEvent(document, "keydown", WriteBox.onKey), cur.mbOnMouseClick || (cur.mbOnMouseClick = cur.onMouseClick), browser.mozilla, cur.sorterClbk &&
                    (cur.sorterClbk(), delete cur.sorterClbk)
            },
            onClean: function() {
                clearTimeout(cur.mbSaveDraftTO), delete cur.mbSaveDraftTO, delete cur.mbField, cur.postTo = d, cur.mbEmojiScroll = cur.mbEmojiExpanded = !1,
                    cur.mbForceAttach = !1, window.WideDropdown && WideDropdown.deinit("mail_box_dd")
            }
        }), addEvent(document, "keydown", WriteBox.onKey), cur.mbOnMouseClick || (cur.mbOnMouseClick = cur.onMouseClick), stManager.add(["page.js", "page.css"],
            function() {
                var i = {
                    mail: 1,
                    nocl: 1,
                    editable: 1,
                    sortable: 1,
                    teWidth: 150,
                    teHeight: 100,
                    toggleLnk: !0
                };
                cur.mbForceAttach && "market" == cur.mbForceAttach[0] && (i.onMediaAdd = function() {
                    for (var e in cur.mbMedia.chosenMedias) "market" == cur.mbMedia.chosenMedias[e][0] && (hide(geByClass1("page_media_x_wrap", cur.mbMedia.chosenMedias[
                        e][2])), cur.mbMedia.chosenMedias.splice(e, 1))
                }), cur.mbMedia = new MediaSelector("mail_box_add_link", "mail_box_added_row", cur.mbMediaTypes, i), cur.mbMedia.onChange = function() {
                    e.changed = !0, setTimeout(function() {
                        WriteBox.saveDraft()
                    }, 100)
                }, ls.checkVersion() && cur.mbTo[0] && WriteBox.restoreDraft(cur.mbTo[0])
            })
    },
    getPeer: function() {
        return intval(cur.toData[0])
    },
    restoreDraft: function(e) {
        var i = WriteBox.getPeer();
        if (!(!i || e && i != intval(e) || browser.mobile) && cur.mbMedia) {
            var t = ls.get("im_draft" + vk.id + "_" + i);
            if (cur.mbForceAttach && "market" == cur.mbForceAttach[0] && (t = {
                    txt: unclean(getLang("mail_market_tmpl"))
                        .replace(/<br>/g, "\n"),
                    medias: [cur.mbForceAttach]
                }), t && (WriteBox.editableHasVal(cur.mbField) || (cur.mbEditable ? (val(cur.mbField, clean(t.txt || "")
                        .replace(/\n/g, "<br/>")), window.Emoji && Emoji.editableFocus(cur.mbField, !1, !0)) : val(cur.mbField, t.txt || "")), (t.medias || [])
                    .length && !(cur.mbMedia.chosenMedias || [])
                    .length)) {
                var r = [];
                for (var o in t.medias) t.medias[o] && r.push(t.medias[o].slice(0, 2)
                    .join(","));
                ajax.post("al_im.php", {
                    act: "draft_medias",
                    media: r.join("*")
                }, {
                    onDone: function(e) {
                        cur.mbField && WriteBox.getPeer() == i && (e || [])
                            .length && each(e, function() {
                                var e = [this[0], this[1], this[2], this[3], !0];
                                cur.mbMedia.chooseMedia.apply(cur.mbMedia, e)
                            })
                    }
                })
            }
            WriteBox.checkEditable(cur.emojiWId, cur.mbField), WriteBox.checkLen(cur.mbField)
        }
    },
    saveDraft: function() {
        var e = WriteBox.getPeer();
        if (e) {
            for (var i = {
                    txt: trim(Emoji.editableVal(cur.mbField)),
                    medias: []
                }, t = cur.mbMedia.getMedias(), r = 0, o = t.length; o > r; ++r) t[r] && i.medias.push([t[r][0], t[r][1]]);
            i.medias.length || i.txt.length || (i = !1), ls.set("im_draft" + vk.id + "_" + intval(e), i)
        }
    },
    toFull: function(e, i) {
        if (!checkEvent(e)) {
            var t = {
                    0: "im",
                    sel: i
                },
                r = trim(Emoji.editableVal(cur.mbField));
            if (r && (t.message = r), cur.mbMedia.chosenMedias) {
                for (var o = cur.mbMedia.getMedias(), a = [], n = 0, c = o.length; c > n; ++n) {
                    var m = o[n],
                        d = [];
                    for (var l in m) "object" != typeof m[l] && d.push(m[l]);
                    a.push(d.join(","))
                }
                t.media = a.join("*")
            }
            return nav.go(t, null, {
                noback: !0
            }), !1
        }
    },
    send: function(e) {
        if (!buttonLocked("mail_box_send")) {
            var i = trim(Emoji.editableVal(cur.mbField)),
                t = cur.mbMedia.getMedias();
            cur.mbEditable && WriteBox.extractEmoji();
            var r = {
                act: "a_send",
                chas: cur.mbHash,
                message: i,
                title: isVisible("mail_box_title_wrap") && val("mail_box_title") || "",
                from: "box",
                media: [],
                to_ids: []
            };
            cur.mbForceAttach && (r.attach1_type = cur.mbForceAttach[0], r.attach1 = cur.mbForceAttach[1], r.attach1_hash = cur.mbForceAttach[2]);
            for (var o, a = 0, n = t.length; n > a; ++a)(o = t[a]) && r.media.push(o[0] + ":" + o[1]);
            return r.media = r.media.join(","), i || r.media ? (r.to_ids = cur.toData[0], cur.mbBannedHim == r.to_ids && e !== !0 ? void(showBox("al_profile.php", {
                    act: "banned_him",
                    action: "mail",
                    mid: cur.mbBannedHim
                }, {
                    dark: 1
                })
                .onContinue = WriteBox.send.pbind(!0)) : void ajax.post("al_mail.php", r, {
                onDone: function(e, i) {
                    i && ls.set("im_draft" + vk.id + "_" + i, !1), curBox()
                        .hide(), showDoneBox(e)
                },
                showProgress: lockButton.pbind("mail_box_send"),
                hideProgress: unlockButton.pbind("mail_box_send")
            })) : cur.mbEditable ? Emoji.editableFocus(cur.mbField) : elfocus(cur.mbField)
        }
    },
    checkLen: function(e) {
        cur.mbTxtInp.value = Emoji.editableVal(e), checkTextLength(4096, cur.mbTxtInp, "mail_box_warn"), toggle("mail_box_title_wrap", cur.mbTxtInp.lastLen > 200)
    },
    codeToChr: function(e) {
        for (var i = e.length / 4, t = "", r = 0; i--;) t += String.fromCharCode(parseInt(e.substr(r, 4), 16)), r += 4;
        return t
    },
    editableHasVal: function(e) {
        return e ? "TEXTAREA" == e.tagName ? !!val(e) : !(!geByTag1("IMG", e) && !stripHTML(val(e))
            .replace(/[\s\xa0]/g, "")
            .length) : !1
    },
    checkEditable: function(e, i) {
        cur.mbEditable && Emoji.checkEditable(e, i, {
            height: 180
        })
    },
    cssAnimation: function() {
        var e = intval(browser.version);
        return browser.chrome && e > 14 || browser.mozilla && e > 13 || browser.opera && e > 2 ? !0 : !1
    },
    onKey: function(e) {
        var i = "INPUT" == e.target.tagName || "TEXTAREA" == e.target.tagName || "mail_box_editable" == e.target.id;
        if (!isInputActive()) {
            if (e.keyCode > 40 && !e.ctrlKey && !e.metaKey && !i)
                if (cur.mbEditable) Emoji.editableFocus(cur.mbField, !1, !0);
                else {
                    var t = cur.mbField;
                    !t.active && elfocus(t)
                }
            return !0
        }
    },
    extractEmoji: function() {
        var e = geByClass("emoji", cur.mbField),
            i = {};
        for (var t in e) i[Emoji.getCode(e[t])] = 1;
        var r = ge("mbe_rcemoji"),
            o = "",
            a = 0;
        for (var n in i) ge("mbe_rc_em_" + n) || (o += '<a id="mbe_rc_em_' + n + '" class="mbe_rc_emojibtn" onmousedown="Emoji.addEmoji(cur.emojiWId, \'' + n +
            "', this); return cancelEvent(event);\">" + Emoji.getEmojiHTML(n, !1, !0) + "</a>", a -= 22);
        cur.mbRcntEmoji = (o + val(r))
            .split("a><a")
            .slice(0, 7)
            .join("a><a"), cur.mbRcntEmoji.match(/<\/$/) && (cur.mbRcntEmoji += "a>"), r.insertBefore(cf(o), r.firstChild), setStyle(r, {
                marginLeft: a
            }), animate(r, {
                marginLeft: 0
            }, {
                duration: 150,
                transition: Fx.Transitions.easeOutCubic,
                onComplete: function() {
                    var e = geByClass("mbe_rc_emojibtn", r)
                        .slice(7);
                    for (var i in e) re(e[i])
                }
            })
    }
};
try {
    stManager.done("writebox.js")
} catch (e) {}
