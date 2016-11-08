var WriteBox = {
    mrg: function(e) {
        return vk.rtl ? {
            marginRight: e
        } : {
            marginLeft: e
        }
    },
    show: function(e, t) {
        var i = t.toData[0],
            o = t.toData[7];
        if (e.setOptions({
                hideButtons: !0,
                width: 502,
                bodyStyle: "padding: 0px; border: 0px;",
                title: t.title,
                titleControls: ('<a class="mail_box_header_link" href="/im?sel=' + i + '" onclick="return WriteBox.toFull(event, ' + i + ')">' + t.mail_go_to_dialog +
                        "</a>")
                    .replace("%s", o)
            }), e.removeButtons(), cur.lang = extend(cur.lang || {}, t.lang), extend(cur, {
                mbTxtInp: {},
                mbEditable: t.editable,
                mbSmile: ge("mbe_smile"),
                toData: t.toData,
                mbEmoji: t.emoji,
                mbMedia: null,
                mbField: ge(t.editable ? "mail_box_editable" : "mail_box_text"),
                mbAva: ge("mail_box_ava"),
                mbMediaTypes: t.mediaTypes,
                mbTo: t.toData,
                mbHash: t.hash,
                mbBannedHim: t.bannedhim
            }), t.emojiRcnt && !cur.mbRcntEmoji) {
            for (var r = [], a = t.emojiRcnt, c = 0, n = a.length; n > c; ++c) {
                var m = a[c];
                m && r.push('<a id="mbe_rc_em_' + m + '" class="mbe_rc_emojibtn" onmousedown="Emoji.addEmoji(cur.emojiWId, \'' + m +
                    "', this); return cancelEvent(event);\">" + Emoji.getEmojiHTML(m, !1, !0) + "</a>")
            }
            cur.mbRcntEmoji = r.join("")
        }
        val("mbe_rcemoji", cur.mbRcntEmoji || ""), cur.peer = WriteBox.getPeer(), cur.sharedImWrite = {}, cur.emojiWId = Emoji.init(cur.mbField, {
            ttDiff: 1,
            controlsCont: ge("mbe_emoji_wrap"),
            shouldFocus: !0,
            onSend: WriteBox.send,
            rPointer: !0,
            noEnterSend: 1,
            noStickers: !!t.checkedRecipent,
            forceTxt: !t.editable,
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
            onStickerSend: function(e, t) {
                var i = trim(Emoji.editableVal(cur.mbField)),
                    o = cur.mbMedia.getMedias(),
                    r = cur.toData[0];
                ajax.post("/al_mail.php", {
                    act: "a_send",
                    to_ids: r,
                    chas: cur.mbHash,
                    msg: "",
                    ts: cur.ts,
                    media: "sticker:" + e,
                    send_sticker: 1,
                    from: "box",
                    sticker_referrer: t
                }, {
                    onDone: function(e, t) {
                        i || o.length ? WriteBox.send(!1) : (t && ls.set("im_draft" + vk.id + "_" + t, !1), curBox()
                            .hide(), showDoneBox(e))
                    },
                    showProgress: lockButton.pbind("mail_box_send"),
                    hideProgress: unlockButton.pbind("mail_box_send"),
                    onFail: function(e) {
                        return setTimeout(showFastBox(getLang("global_error"), e)
                            .hide, 3e3), !0
                    }
                })
            },
            onRecentEmojiUpdate: function() {
                WriteBox.extractEmoji()
            }
        }), Emoji.emojiLoadMore(cur.emojiWId), cur.mbTo[0] ? cur.mbHidden = !1 : cur.mbHidden = !0, cur.imwEmoji = -1;
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
                var t = {
                    mail: 1,
                    nocl: 1,
                    editable: 1,
                    sortable: 1,
                    teWidth: 150,
                    teHeight: 100,
                    toggleLnk: !0
                };
                cur.mbForceAttach && "market" == cur.mbForceAttach[0] && (t.onMediaAdd = function() {
                    for (var e in cur.mbMedia.chosenMedias) "market" == cur.mbMedia.chosenMedias[e][0] && (hide(geByClass1("page_media_x_wrap", cur.mbMedia.chosenMedias[
                        e][2])), cur.mbMedia.chosenMedias.splice(e, 1))
                }), cur.mbMedia = new MediaSelector("mail_box_add_link", "mail_box_added_row", cur.mbMediaTypes, t), cur.mbMedia.onChange = function() {
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
        var t = WriteBox.getPeer();
        if (!(!t || e && t != intval(e) || browser.mobile) && cur.mbMedia) {
            var i = ls.get("im_draft" + vk.id + "_" + t);
            if (cur.mbForceAttach && "market" == cur.mbForceAttach[0] && (i = {
                    txt: unclean(getLang("mail_market_tmpl"))
                        .replace(/<br>/g, "\n"),
                    medias: [cur.mbForceAttach]
                }), i && (WriteBox.editableHasVal(cur.mbField) || (cur.mbEditable ? (val(cur.mbField, clean(i.txt || "")
                        .replace(/\n/g, "<br/>")), window.Emoji && Emoji.editableFocus(cur.mbField, !1, !0)) : val(cur.mbField, i.txt || "")), (i.medias || [])
                    .length && !(cur.mbMedia.chosenMedias || [])
                    .length)) {
                var o = [];
                for (var r in i.medias) i.medias[r] && o.push(i.medias[r].slice(0, 2)
                    .join(","));
                ajax.post("al_im.php", {
                    act: "draft_medias",
                    media: o.join("*")
                }, {
                    onDone: function(e) {
                        cur.mbField && WriteBox.getPeer() == t && (e || [])
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
            for (var t = {
                    txt: trim(Emoji.editableVal(cur.mbField)),
                    medias: []
                }, i = cur.mbMedia.getMedias(), o = 0, r = i.length; r > o; ++o) i[o] && t.medias.push([i[o][0], i[o][1]]);
            t.medias.length || t.txt.length || (t = !1), ls.set("im_draft" + vk.id + "_" + intval(e), t)
        }
    },
    toFull: function(e, t) {
        if (!checkEvent(e)) {
            var i = {
                    0: "im",
                    sel: t
                },
                o = trim(Emoji.editableVal(cur.mbField));
            if (o && (i.message = o), cur.mbMedia.chosenMedias) {
                for (var r = cur.mbMedia.getMedias(), a = [], c = 0, n = r.length; n > c; ++c) {
                    var m = r[c],
                        d = [];
                    for (var l in m) "object" != typeof m[l] && d.push(m[l]);
                    a.push(d.join(","))
                }
                i.media = a.join("*")
            }
            return nav.go(i, null, {
                noback: !0
            }), !1
        }
    },
    send: function(e) {
        if (!buttonLocked("mail_box_send")) {
            var t = trim(Emoji.editableVal(cur.mbField)),
                i = cur.mbMedia.getMedias();
            cur.mbEditable && WriteBox.extractEmoji();
            var o = {
                act: "a_send",
                chas: cur.mbHash,
                message: t,
                title: isVisible("mail_box_title_wrap") && val("mail_box_title") || "",
                from: "box",
                media: [],
                to_ids: []
            };
            cur.mbForceAttach && (o.attach1_type = cur.mbForceAttach[0], o.attach1 = cur.mbForceAttach[1], o.attach1_hash = cur.mbForceAttach[2]);
            for (var r, a = 0, c = i.length; c > a; ++a)(r = i[a]) && o.media.push(r[0] + ":" + r[1]);
            return o.media = o.media.join(","), t || o.media ? (o.to_ids = cur.toData[0], cur.mbBannedHim == o.to_ids && e !== !0 ? void(showBox("al_profile.php", {
                    act: "banned_him",
                    action: "mail",
                    mid: cur.mbBannedHim
                }, {
                    dark: 1
                })
                .onContinue = WriteBox.send.pbind(!0)) : void ajax.post("al_mail.php", o, {
                onDone: function(e, t) {
                    t && ls.set("im_draft" + vk.id + "_" + t, !1), curBox()
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
        for (var t = e.length / 4, i = "", o = 0; t--;) i += String.fromCharCode(parseInt(e.substr(o, 4), 16)), o += 4;
        return i
    },
    editableHasVal: function(e) {
        return e ? "TEXTAREA" == e.tagName ? !!val(e) : !(!geByTag1("IMG", e) && !stripHTML(val(e))
            .replace(/[\s\xa0]/g, "")
            .length) : !1
    },
    checkEditable: function(e, t) {
        cur.mbEditable && Emoji.checkEditable(e, t, {
            height: 180
        })
    },
    cssAnimation: function() {
        var e = intval(browser.version);
        return browser.chrome && e > 14 || browser.mozilla && e > 13 || browser.opera && e > 2 ? !0 : !1
    },
    onKey: function(e) {
        var t = "INPUT" == e.target.tagName || "TEXTAREA" == e.target.tagName || "mail_box_editable" == e.target.id;
        if (!isInputActive()) {
            if (e.keyCode > 40 && !e.ctrlKey && !e.metaKey && !t)
                if (cur.mbEditable) Emoji.editableFocus(cur.mbField, !1, !0);
                else {
                    var i = cur.mbField;
                    !i.active && elfocus(i)
                }
            return !0
        }
    },
    extractEmoji: function() {
        var e = ge("mbe_rcemoji");
        if (e) {
            var t = "",
                i = Emoji.getRecentEmojiSorted()
                .slice(0, 7);
            for (var o in i) {
                var r = i[o];
                t += '<a id="mbe_rc_em_' + r + '" class="mbe_rc_emojibtn" onmousedown="Emoji.addEmoji(cur.emojiWId, \'' + r + "', this); return cancelEvent(event);\">" +
                    Emoji.getEmojiHTML(r, !1, !0) + "</a>"
            }
            val(e, t)
        }
    }
};
try {
    stManager.done("writebox.js")
} catch (e) {}
