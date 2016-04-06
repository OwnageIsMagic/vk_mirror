if (!window.Emoji) var Emoji = {
    opts: {},
    last: 0,
    shownId: !1,
    hasNewStickers: !1,
    preventMouseOver: !1,
    ttShift: 45,
    stickers: {},
    init: function(e, i) {
        var o = Emoji.last;
        if (i.txt = e, i.id = o, i.fieldWrap = gpeByClass("_emoji_field_wrap", e), i.emojiWrap = domByClass(i.fieldWrap, "_emoji_wrap"), i.emojiBtn = domByClass(i.emojiWrap,
                "_emoji_btn"), i.emojiWrap && data(i.emojiWrap, "optId", o), e.emojiId = o, i.forceTxt) i.editable = 0, placeholderInit(e);
        else {
            if (i.editable = 1, setTimeout(function() {
                    placeholderInit(e, {
                        editable: 1,
                        editableFocus: Emoji.editableFocus,
                        global: i.global
                    }), i.shouldFocus && Emoji.editableFocus(e, !1, !0)
                }, 0), browser.mozilla) try {
                document.execCommand("enableObjectResizing", !1, !1), cur.destroy.push(function() {
                    document.execCommand("enableObjectResizing", !1, !0)
                })
            } catch (t) {}
            addEvent(window, "mousemove", function(e) {
                Emoji.preventMouseOver = !1
            }), addEvent(e, browser.opera ? "click" : "mousedown", function(t) {
                return t.target && "IMG" == t.target.tagName && Emoji.getCode(t.target) ? (Emoji.editableFocus(e, t.target, t.offsetX > 8), cancelEvent(t)) :
                    void(Emoji.shown && Emoji.ttClick(o, geByClass1("emoji_smile", i.controlsCont), !0))
            }), addEvent(e, "keypress keydown keyup paste", function(t) {
                if ("keydown" == t.type) {
                    var s = i.ctrlSend ? i.ctrlSend() : i.noEnterSend;
                    if (t.keyCode == KEY.RETURN || 10 == t.keyCode) {
                        if (i.forceEnterSend && i.onSend) return i.onSend(), cancelEvent(t);
                        var r = cur.ctrl_submit && !i.noCtrlSend;
                        if ((r || s) && (t.ctrlKey || browser.mac && t.metaKey) || !r && !t.shiftKey && !(t.ctrlKey || browser.mac && t.metaKey)) {
                            if (!Emoji.emojiEnter(o, t)) return !1;
                            if (!s || t.ctrlKey || browser.mac && t.metaKey) return Emoji.ttClick(o, geByClass1("emoji_smile", i.controlsCont), !0), i.onSend(),
                                cancelEvent(t)
                        }
                    }
                    if (t.ctrlKey && t.keyCode == KEY.RETURN) {
                        var a = this.value;
                        if (i.editable) Emoji.insertHTML("<div><br/></div>");
                        else {
                            if ("number" == typeof this.selectionStart && "number" == typeof this.selectionEnd) {
                                var n = this.selectionStart;
                                this.value = a.slice(0, n) + "\n" + a.slice(this.selectionEnd), this.selectionStart = this.selectionEnd = n + 1
                            } else if (document.selection && document.selection.createRange) {
                                this.focus();
                                var l = document.selection.createRange();
                                l.text = "\r\n", l.collapse(!1), browser.opera && (l.moveEnd("character", 0), l.moveStart("character", 0)), l.select()
                            }
                            e.autosize.update(), setTimeout(function() {
                                e.autosize.update()
                            }, 0)
                        }
                        return !1
                    }
                    if (t.keyCode == KEY.TAB && !(t.ctrlKey || browser.mac && t.metaKey)) return Emoji.shown ? (Emoji.editableFocus(e, !1, !0, void 0, !0),
                        Emoji.ttClick(o, geByClass1("emoji_smile", i.controlsCont), !0)) : Emoji.ttClick(o, geByClass1("emoji_smile", i.controlsCont), !
                        1, !0, void 0, !0), cancelEvent(t);
                    if (t.keyCode == KEY.ESC) {
                        if (Emoji.shown) return Emoji.editableFocus(e, !1, !0, void 0, !0), Emoji.ttClick(o, geByClass1("emoji_smile", i.controlsCont), !0),
                            cancelEvent(t);
                        if (i.onEsc) return i.onEsc(t)
                    }
                }
                return "paste" == t.type ? (Emoji.onEditablePaste(e, i, o, t), i.checkEditable && setTimeout(i.checkEditable.pbind(o, e), 0)) : "keyup" == t.type ?
                    i.checkEditable && i.checkEditable(o, e) : "keydown" == t.type && i.checkEditable && setTimeout(i.checkEditable.pbind(o, e), 0), i.onKeyAction &&
                    i.onKeyAction(t), cur.onReplyFormSizeUpdate && cur.onReplyFormSizeUpdate(t), !0
            })
        }
        if (!i.noStickers && window.emojiStickers && (hasClass(e, "im_editable") || hasClass(e, "fc_editable"))) {
            for (var s in window.emojiStickers)
                if (window.emojiStickers[s][2]) {
                    Emoji.hasNewStickers = window.emojiStickers[s][2];
                    break
                }
            Emoji.hasNewStickers < 0 && !Emoji.noNewStickers && setTimeout(function() {
                each(geByClass("emoji_smile_icon"), function(e, i) {
                    geByClass1("emoji_smile_icon_promo", i.parentNode.parentNode) || (i.parentNode.parentNode.appendChild(ce("div", {
                        className: "emoji_smile_icon_promo"
                    })), addEvent(i, "mouseover", function() {
                        showTooltip(this, {
                            text: getLang("global_store_stickers_new_available"),
                            shift: [7, 1, 4],
                            showdt: 0,
                            black: 1
                        })
                    }))
                })
            }, hasClass(e, "fc_editable") ? 200 : 0)
        }
        return window.Notifier && Notifier.addRecvClbk("emoji", 0, Emoji.lcRecv, !0), Emoji.opts[Emoji.last] = i, Emoji.last++
    },
    lcRecv: function(e) {
        switch (e.act) {
            case "updateTabs":
                Emoji.updateTabs(e.newStickers)
        }
    },
    correctCaret: function(e) {
        var i = getCaretBoundingRect(e)
            .bottom;
        (0 > i || i > e.offsetHeight) && (e.scrollTop += i - e.offsetHeight)
    },
    insertWithBr: function(e, i) {
        i && Emoji.insertHTML(clean(i)
            .replace(/\n/g, "<br/>"))
    },
    focusTrick: function(e, i, o, t, s) {
        s || (s = e);
        var r = ce("TEXTAREA", {
            className: "emoji_tmp_textarea"
        });
        e.parentNode.appendChild(r), r.focus(), setTimeout(function() {
            var a = s.scrollTop;
            re(r), e.focus(), s.scrollTop = a, Emoji.setRange(t), i(val(r)), o(e)
        }, 0)
    },
    finalizeInsert: function(e) {
        Emoji.cleanCont(e), setTimeout(Emoji.correctCaret.pbind(e), 10)
    },
    getClipboard: function(e) {
        return e.clipboardData ? e.clipboardData.getData("text") : window.clipboardData ? window.clipboardData.getData("Text") : !1
    },
    onEditablePaste: function(e, i, o, t, s) {
        var r = !1;
        "true" === e.getAttribute("contenteditable") && (r = Emoji.getRange());
        var a = this.getClipboard(t);
        return a && r && !s ? (this.insertWithBr(r, a), setTimeout(this.finalizeInsert.bind(this, e), 0), cancelEvent(t)) : void(r && this.focusTrick(e, this.insertWithBr
            .pbind(r), this.finalizeInsert.bind(this, e), r))
    },
    cleanCont: function(e) {
        for (var i = e.firstChild; i;) {
            var o = i.nextSibling;
            switch (i.nodeType) {
                case 1:
                    if ("tmp_paste_cont" == i.id) break;
                    if ("DIV" == i.tagName || "P" == i.tagName || "SPAN" == i.tagName) i.setAttribute("style", ""), i.className = "", i.id = "", Emoji.cleanCont(i);
                    else if ("IMG" == i.tagName) Emoji.getCode(i) || re(i);
                    else if ("BR" != i.tagName) {
                        var t = Emoji.editableVal(i, {
                                saveEmoji: !0
                            }),
                            s = cf(clean(t)
                                .replace(/\n/g, "<br/>"));
                        s.lastChild;
                        i.parentNode.replaceChild(s, i)
                    }
                    break;
                case 3:
                    var r = clean(i.textContent || i.innerText);
                    r && r.match(Emoji.emojiRegEx) && (r = r.replace(Emoji.emojiRegEx, Emoji.emojiReplace)
                        .replace(/\uFE0F/g, ""), i.parentNode.replaceChild(cf(r), i))
            }
            i = o
        }
    },
    focus: function(e, i) {
        Emoji.editableFocus(e, !1, !0);
        var o = e.parentNode;
        if (i) {
            var t = getXY(o)[1],
                s = scrollGetY(),
                r = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : boxLayerBG.offsetHeight,
                a = getSize(o)[1];
            t + a > s + r ? scrollToY(t - r + a + 60, 100) : s > t && scrollToY(t - 60, 100)
        }
    },
    destroy: function(e) {
        Emoji.opts[e].txt.blur(), Emoji.opts[e].imagesLoader && Emoji.opts[e].imagesLoader.destroy(), delete Emoji.opts[e]
    },
    editableFocus: function(e, i, o, t, s) {
        if (!e || s && document.activeElement === e) return !1;
        if (e = ge(e), e.focus(), e.phonfocus && e.phonfocus(), "undefined" != typeof window.getSelection && "undefined" != typeof document.createRange) {
            var r = window.getSelection();
            if (browser.opera && !o) r.collapse(i || e, 0);
            else {
                var a = document.createRange();
                i ? a.selectNode(i) : a.selectNodeContents(e), t || a.collapse(o ? !1 : !0);
                var r = window.getSelection();
                r.removeAllRanges(), r.addRange(a)
            }
        } else if ("undefined" != typeof document.body.createTextRange) {
            var n = document.body.createTextRange();
            n.moveToElementText(i || e), n.collapse(o ? !1 : !0), n.select()
        }
    },
    getRange: function() {
        if (window.getSelection) {
            if (sel = window.getSelection(), sel.getRangeAt && sel.rangeCount) return sel.getRangeAt(0)
        } else if (document.selection && document.selection.createRange) return document.selection.createRange();
        return null
    },
    setRange: function(e) {
        window.getSelection ? (sel = window.getSelection(), sel.removeAllRanges(), sel.addRange(e)) : document.selection && e.select && e.select()
    },
    val: function(e, i) {
        return void 0 === i ? Emoji.editableVal(e) : (i = Emoji.emojiToHTML(i, !0), i = i.replace(/ $/, "&nbsp;"), e.setValue ? (e.setValue(i), e.phonblur && e.phonblur()) :
            e.innerHTML = i, !0)
    },
    editableVal: function(e, i) {
        if (!e) return "";
        if ("TEXTAREA" == e.tagName) return val(e);
        for (var o = e.firstChild, t = "", s = new RegExp("^(DIV|P|LI|OL|TR|TD|BLOCKQUOTE)$"); o;) {
            switch (o.nodeType) {
                case 3:
                    var r = o.data.replace(/^\n|\n$/g, " ")
                        .replace(/[\n\xa0]/g, " ")
                        .replace(/[ ]+/g, " ");
                    t += r;
                    break;
                case 1:
                    var r = Emoji.editableVal(o);
                    if (o.tagName && o.tagName.match(s) && r) {
                        "\n" != r.substr(-1) && (r += "\n");
                        for (var a = o.previousSibling; a && 3 == a.nodeType && "" == trim(a.nodeValue);) a = a.previousSibling;
                        !a || a.tagName && a.tagName.match(s) || (r = "\n" + r)
                    } else if ("IMG" == o.tagName) {
                        var n = Emoji.getCode(o);
                        n && (r += i && i.saveEmoji ? Emoji.getEmojiHTML(n) : Emoji.codeToChr(n))
                    } else "BR" == o.tagName && (r += "\n");
                    t += r
            }
            o = o.nextSibling
        }
        return t
    },
    cssEmoji: {
        D83DDE0A: [0, ":-)"],
        D83DDE03: [1, ":-D"],
        D83DDE09: [2, ";-)"],
        D83DDE06: [3, "xD"],
        D83DDE1C: [4, ";-P"],
        D83DDE0B: [5, ":-p"],
        D83DDE0D: [6, "8-)"],
        D83DDE0E: [7, "B-)"],
        D83DDE12: [8, ":-("],
        D83DDE0F: [9, ";-]"],
        D83DDE14: [10, "3("],
        D83DDE22: [11, ":'("],
        D83DDE2D: [12, ":_("],
        D83DDE29: [13, ":(("],
        D83DDE28: [14, ":o"],
        D83DDE10: [15, ":|"],
        D83DDE0C: [16, "3-)"],
        D83DDE20: [17, ">("],
        D83DDE21: [18, ">(("],
        D83DDE07: [19, "O:)"],
        D83DDE30: [20, ";o"],
        D83DDE33: [21, "8|"],
        D83DDE32: [22, "8o"],
        D83DDE37: [23, ":X"],
        D83DDE1A: [24, ":-*"],
        D83DDE08: [25, "}:)"],
        2764: [26, "<3"],
        D83DDC4D: [27, ":like:"],
        D83DDC4E: [28, ":dislike:"],
        "261D": [29, ":up:"],
        "270C": [30, ":v:"],
        D83DDC4C: [31, ":ok:"]
    },
    imgEmoji: {
        D83DDE15: 1,
        D83DDE1F: 1,
        D83DDE2E: 1,
        D83DDE34: 1
    },
    getEmojiHTML: function(e, i, o, t) {
        var s = browser.msie && intval(browser.version) > 8 ? ' contenteditable="false"' : "";
        if (void 0 != Emoji.cssEmoji[e]) {
            var r = 17 * -Emoji.cssEmoji[e][0];
            return "<img" + s + ' src="/images/blank.gif" emoji="' + e + '" ' + (i ? 'alt="' + i + '"' : i) + ' class="emoji_css" style="background-position: 0px ' + r +
                'px;" />'
        }
        return Emoji.imgEmoji[e] || !i || o ? t ? '<img class="emoji emoji_need_load" ' + (i ? 'alt="' + i + '"' : "") +
            ' src="/images/blank.gif" data-src="/images/emoji/' + e + (window.devicePixelRatio >= 2 ? "_2x" : "") + '.png" />' : '<img class="emoji" ' + (i ? 'alt="' +
                i + '"' : "") + ' src="/images/emoji/' + e + (window.devicePixelRatio >= 2 ? "_2x" : "") + '.png" />' : i
    },
    codeToChr: function(e) {
        for (var i = Math.round(e.length / 4), o = "", t = 0; i--;) o += String.fromCharCode(parseInt(e.substr(t, 4), 16)), t += 4;
        return o
    },
    checkEditable: function(e, i, o) {
        var t = i.scrollHeight,
            s = Emoji.opts[e];
        if (!s) return !1;
        s.scPaddings || (s.scPaddings = intval(getStyle(i, "paddingTop")) + intval(getStyle(i, "paddingBottom"))), t -= s.scPaddings;
        var r = s.tt;
        if (t > o.height + (browser.mozilla && s.isChat ? 0 : 5)) {
            if (!s.isSized) {
                setStyle(i, {
                    height: o.height + "px",
                    overflowY: "auto"
                });
                var a = geByClass1("emoji_smile", s.controlsCont),
                    n = geByClass1("emoji_smile_icon_promo", s.controlsCont),
                    l = ge("im_upload"),
                    c = sbWidth();
                setStyle(a, vk.rtl ? {
                    left: 1 + c
                } : {
                    right: 1 + c
                }), n && setStyle(n, vk.rtl ? {
                    left: 2 + c
                } : {
                    right: 2 + c
                }), l && setStyle(l.parentNode, vk.rtl ? {
                    left: 1 + c
                } : {
                    right: 1 + c
                }), r && setStyle(r, vk.rtl ? {
                    left: (s.ttDiff || 31) + c
                } : {
                    right: (s.ttDiff || 31) + c
                }), s.isSized = !0
            }
        } else if (s.isSized) {
            setStyle(i, {
                height: "auto",
                overflowY: "hidden"
            });
            var a = geByClass1("emoji_smile", s.controlsCont),
                n = geByClass1("emoji_smile_icon_promo", s.controlsCont),
                l = ge("im_upload");
            setStyle(a, vk.rtl ? {
                left: 1
            } : {
                right: 1
            }), n && setStyle(n, vk.rtl ? {
                left: 2
            } : {
                right: 2
            }), l && setStyle(l.parentNode, vk.rtl ? {
                left: 1
            } : {
                right: 1
            }), r && setStyle(r, vk.rtl ? {
                left: s.ttDiff || 31
            } : {
                right: s.ttDiff || 31
            }), s.isSized = !1
        }
        s.onResize && s.onResize()
    },
    emojiEnter: function(e, i) {
        var o = Emoji.opts[e],
            t = (o.ctrlSend ? o.ctrlSend() : o.noEnterSend) || cur.ctrl_submit && !o.noCtrlSend;
        if (o.emojiFocused && o.emojiOvered && o.openedByTabKey && (t ? !(i.ctrlKey || browser.mac && i.metaKey) : !i.shiftKey)) {
            if (0 === o.curTab) {
                var s = geByTag1("img", o.emojiOvered);
                Emoji.addEmoji(e, Emoji.getCode(s), o.emojiOvered)
            }
            return cancelEvent(i)
        }
        return !0
    },
    insertHTML: function(e) {
        if (browser.msie && parseInt(browser.version) < 12)
            if (document.selection) {
                var i = document.selection.createRange();
                i.pasteHTML && i.pasteHTML(e)
            } else {
                var i = document.getSelection()
                    .getRangeAt(0),
                    o = document.createElement("span");
                i.surroundContents(o), o.innerHTML = e, i.collapse(!1)
            }
        else e && document.execCommand("insertHTML", !1, e)
    },
    addEmoji: function(e, o, t) {
        if (e === !1 || o === !1) return !1;
        var s = Emoji.opts[e];
        if (s.editable) {
            var a = Emoji.getEmojiHTML(o),
                n = s.txt,
                l = window.getSelection ? window.getSelection() : !1;
            if (l && l.rangeCount)
                if (r = l.getRangeAt(0), r.commonAncestorContainer) var c = r.commonAncestorContainer;
                else var c = r.parentElement ? r.parentElement() : r.item(0);
            else var c = !1;
            for (el = c; el && el != n;) el = el.parentNode;
            var m = n.lastChild || {};
            browser.mozilla && "BR" == m.tagName && !m.previousSibling && re(n.lastChild), el || Emoji.editableFocus(n, !1, !0), Emoji.insertHTML(a);
            var d = geByClass("emoji", n);
            d.push.apply(d, geByClass("emoji_css", n));
            for (i in d) {
                var D = d[i].previousSibling;
                if (D && 3 == D.nodeType && D.textContent && 32 == D.textContent.charCodeAt(0)) {
                    var u = D.previousSibling;
                    u && 3 == u.nodeType && u.textContent && 160 == u.textContent.charCodeAt(u.textContent.length - 1) && re(D)
                }
            }
            n.check && n.check(), setTimeout(Emoji.correctCaret.pbind(n), 5)
        } else {
            var j = s.txt,
                E = j.value;
            if (browser.iphone || browser.ipad) var p = Emoji.codeToChr(o);
            else var p = Emoji.cssEmoji[o][1] + " ";
            var f, g;
            void 0 != j.selectionStart && void 0 != j.selectionEnd ? (f = j.selectionEnd, j.value = E.slice(0, j.selectionStart) + p + E.slice(f), j.selectionStart = j
                .selectionEnd = f + p.length) : "undefined" != typeof document.selection && "undefined" != typeof document.selection.createRange && (j.focus(), g =
                document.selection.createRange(), g.text = p, g.select())
        }
        s.checkEditable && s.checkEditable(e, s.txt), s.saveDraft && s.saveDraft()
    },
    showShadow: function() {
        return !(browser.msie && browser.version < 10)
    },
    scrollToggleArrow: function(e, i, o, t) {
        var s = geByClass1("emoji_tabs_" + i + "_s", o.tt);
        t ? (e ? show : hide)(s) : e ? fadeIn(s, 200) : fadeOut(s, 200), o[i + "Shown"] = e
    },
    scrollTabs: function(e, i) {
        var o = Emoji.opts[e];
        if (o) {
            var t = geByClass1("emoji_tabs_wrap", o.tt),
                s = t.firstChild.clientWidth - t.clientWidth;
            if (i) {
                var r = t.scrollLeft + 170;
                if (r >= s) {
                    r = s;
                    var a = geByClass1("emoji_tabs_r_s", o.tt);
                    fadeOut(a, 200), o.rShown = !1, Emoji.scrollToggleArrow(!1, "r", o)
                }
                r && !o.lShown && Emoji.scrollToggleArrow(!0, "l", o)
            } else {
                var r = Math.max(t.scrollLeft - 170, 0);
                0 >= r && (r = 0, Emoji.scrollToggleArrow(!1, "l", o)), s > r && !o.rShown && Emoji.scrollToggleArrow(!0, "r", o)
            }
            o.scrollLeft = r, animate(t, {
                scrollLeft: r
            }, 300)
        }
    },
    show: function(e, i) {
        var o = data(domPN(e), "optId");
        isUndefined(o) || Emoji.ttShow(o, e, i)
    },
    hide: function(e, i, o) {
        var t = data(domPN(e), "optId");
        isUndefined(t) || Emoji.ttHide(t, e, i, o)
    },
    ttShow: function(e, i, o) {
        var t = Emoji.opts[e];
        clearTimeout(t.ctt), clearTimeout(t.stt), t.scrolling && (t.afterScrollFn = !1), t.ttShown || (i ? t.obj = i : i = t.obj, Emoji.ttClick(e, i, !1, !0, o))
    },
    ttHide: function(e, i, o, t) {
        var s = Emoji.opts[e];
        if (clearTimeout(s.stt), s.ttShown) {
            if (s.scrolling) return void(s.afterScrollFn = Emoji.ttHide.pbind(e, i, o, t));
            i = i || s.obj || geByClass1("emoji_smile", s.controlsCont);
            var r = function() {
                    Emoji.ttClick(e, i, !0, !1, o)
                },
                a = s.ttShowT || 0;
            t || vkNow() - a < 200 ? r() : (clearTimeout(s.ctt), s.ctt = setTimeout(r, 300))
        }
    },
    ttClick: function(e, i, o, t, s, r) {
        var a = Emoji.opts[e];
        if (a && !(o && !Emoji.shown || t && Emoji.shown) && (i || (i = Emoji.shown || ge(-3 == cur.peer ? "imw_smile" : "im_smile")))) {
            i.tt && i.tt.destroy && i.tt.destroy(), !a.tt && a.sharedTT && a.sharedTT.emojiTT && (a.tt = a.sharedTT.emojiTT, a.emojiScroll = a.sharedTT.emojiScroll, a.allEmojiId =
                a.sharedTT.emojiAllId);
            var n = a.tt;
            if (!n) {
                var l = ls.get("stickers_tab");
                if (a.curTab = cur.stickersTab = 0, -1 === l && !a.noStickers) {
                    var c = ls.get("recent_stickers");
                    c && (Emoji.stickers[-1] = c, a.curTab = cur.stickersTab = -1)
                }
                var m = '<div class="emoji_tabs_l_s" onclick="Emoji.scrollTabs(' + e +
                    ', 0);"><div class="emoji_sprite emoji_tabs_l_sc"></div><div class="emoji_sprite emoji_tabs_l_si"></div></div><div class="emoji_tabs_r_s" onclick="Emoji.scrollTabs(' +
                    e + ', 1);"><div class="emoji_sprite emoji_tabs_r_sc"></div><div class="emoji_sprite emoji_tabs_r_si"></div></div>';
                m += Emoji.getTabsCode([
                        [0, 1]
                    ], e), m += '<span class="emoji_tabs_wrap"><span id="emoji_tabs_cont_' + e + '" class="emoji_tabs_cont">', a.noStickers || window.emojiStickers ===
                    !1 || void 0 === window.emojiStickers || (m += Emoji.getTabsCode(window.emojiStickers, e));
                var d = "",
                    D = 'onclick="Emoji.showStickersStore(' + e + ');"',
                    u = "showTooltip(this, {text: '" + getLang("global_store_stickers") + "', shift: [4,6,6], showdt: 0, black: 1});";
                D += a.rPointer ? " onmouseover=\"addClass(this.parentNode.parentNode.parentNode, 'emoji_shop_over');" + u +
                    '"  onmouseout="removeClass(this.parentNode.parentNode.parentNode, \'emoji_shop_over\');"' : ' onmouseover="' + u + '"', m += "</span></span>", a.noStickers ||
                    (m += '<a class="fl_r emoji_shop" ' + D + '><div class="emoji_sprite emoji_shop_icon">' + (Emoji.hasNewStickers ?
                        '<div class="emoji_shop_icon_badge">' + Math.abs(Emoji.hasNewStickers) + "</div>" : "") + "</div></a>"), Emoji.showShadow() || (d +=
                        " emoji_no_opacity"), a.noStickers && (d += " emoji_no_tabs");
                var j = Emoji.getTabCont(e, cur.stickersTab),
                    n = ce("div", {
                        id: "emoji_block_" + e,
                        className: "emoji_tt_wrap tt_down" + d,
                        innerHTML: '<div class="emoji_block_cont"><div class="emoji_block_rel"><div class="emoji_sprite emoji_expand_shadow"></div><div class="emoji_sprite emoji_expand_shadow_top"></div><div class="emoji_list_cont"><div class="emoji_list"><div class="emoji_scroll">' +
                            j + '</div></div></div></div><div class="emoji_tabs clear_fix">' + m + "</div></div>",
                        onmouseover: function(i) {
                            hasClass(n, "emoji_animated") || Emoji.ttShow(e, !1, i)
                        },
                        onmouseout: function(i) {
                            hasClass(n, "emoji_animated") || Emoji.ttHide(e, !1, i)
                        }
                    });
                a.tt = n, Emoji.reappendEmoji(e, n), Emoji.emojiOver(e, geByClass1("emoji_scroll", n)
                    .firstChild), a.sharedTT && (a.sharedTT.emojiTT = n), Emoji.checkEmojiSlider(a), a.imagesLoader = imagesLoader(geByClass1("emoji_list", n), {
                    use_iframe: !0,
                    need_load_class: "emoji_need_load"
                })
            }
            if (clearTimeout(a.ttEmojiHide), Emoji.shownId !== !1 && Emoji.shownId != e && Emoji.ttClick(Emoji.shownId, geByClass1("emoji_smile", Emoji.opts[Emoji.shownId]
                    .controlsCont), !0), Emoji.preventMouseOver = !1, Emoji.shown) {
                var E = {
                    opacity: 0
                };
                setTimeout(function() {
                        geByClass1("emoji_block_cont", n);
                        addClass(n, "emoji_animated"), animate(n, E, 200, function() {
                            removeClass(n, "emoji_animated"), hide(n)
                        })
                    }, 10), Emoji.shown = !1, Emoji.shownId = !1, a.ttShown = !1, a.emojiFocused = !1, cur.onMouseClick = !1, removeEvent(document, "keydown", Emoji.emojiMove),
                    removeClass(i, "emoji_smile_on"), a.onHide && a.onHide()
            } else {
                a.openedByTabKey = !!r, show(n);
                var E = {
                    opacity: 1
                };
                Emoji.repositionEmoji(e, i, n), setTimeout(function() {
                        show(n), addClass(n, "emoji_animated"), animate(n, E, 200, function() {
                            removeClass(n, "emoji_animated")
                        })
                    }, 10), Emoji.shownId = e, Emoji.shown = i, cur.emojiList = geByClass1("emoji_list", n), a.ttShown = !0, a.ttShowT = vkNow(), a.emojiFocused = !0,
                    removeEvent(document, "keydown", Emoji.emojiMove), setTimeout(function() {
                        cur.onMouseClick = function(i) {
                            for (var o = i.target; o;) {
                                if ("im_texts" == o.id || hasClass(o, "emoji_tt_wrap") || hasClass(o, "imw_emoji_wrap")) return !1;
                                o = o.parentNode
                            }
                            Emoji.ttClick(e, !1, !0)
                        }, addEvent(document, "keydown", Emoji.emojiMove)
                    }, 0), addClass(i, "emoji_smile_on"), a.emojiScroll && a.emojiExpanded && (a.emojiScroll.update(!1, !0), browser.msie && 0 === a.curTab && a.emojiOvered &&
                        Emoji.scrollToListEl(e, a.emojiOvered)), a.onShow && a.onShow()
            }
            if (a.emojiExpanded || Emoji.emojiExpand(e, n), -1 === a.curTab && a.recentSticker) {
                var i = ge("emoji_sticker_item" + e + "_-1_" + a.recentSticker);
                i && i.parentNode.insertBefore(i, i.parentNode.firstChild)
            }
            return each(geByClass("emoji_smile_icon_promo"), function(e, i) {
                removeEvent(geByClass1("emoji_smile_icon", i.parentNode), "mouseover"), re(i), Emoji.noNewStickers = !0
            }), cancelEvent(s)
        }
    },
    curEmojiSet: ["D83DDE0A", "D83DDE03", "D83DDE09", "D83DDE06", "D83DDE1C", "D83DDE0B", "D83DDE0D", "D83DDE0E", "D83DDE12", "D83DDE0F", "D83DDE14", "D83DDE22",
        "D83DDE2D", "D83DDE29", "D83DDE28", "D83DDE10", "D83DDE0C", "D83DDE04", "D83DDE07", "D83DDE30", "D83DDE32", "D83DDE33", "D83DDE37", "D83DDE02", "2764",
        "D83DDE1A", "D83DDE15", "D83DDE2F", "D83DDE26", "D83DDE35", "D83DDE20", "D83DDE21", "D83DDE1D", "D83DDE34", "D83DDE18", "D83DDE1F", "D83DDE2C", "D83DDE36",
        "D83DDE2A", "D83DDE2B", "263A", "D83DDE00", "D83DDE25", "D83DDE1B", "D83DDE16", "D83DDE24", "D83DDE23", "D83DDE27", "D83DDE11", "D83DDE05", "D83DDE2E",
        "D83DDE1E", "D83DDE19", "D83DDE13", "D83DDE01", "D83DDE31", "D83DDE08", "D83DDC7F", "D83DDC7D", "D83DDC4D", "D83DDC4E", "261D", "270C", "D83DDC4C", "D83DDC4F",
        "D83DDC4A", "270B", "D83DDE4F", "D83DDC43", "D83DDC46", "D83DDC47", "D83DDC48", "D83DDCAA", "D83DDC42", "D83DDC8B", "D83DDCA9", "2744", "D83CDF4A", "D83CDF77",
        "D83CDF78", "D83CDF85", "D83DDCA6", "D83DDC7A", "D83DDC28", "D83DDD1E", "D83DDC79", "26BD", "26C5", "D83CDF1F", "D83CDF4C", "D83CDF7A", "D83CDF7B", "D83CDF39",
        "D83CDF45", "D83CDF52", "D83CDF81", "D83CDF82", "D83CDF84", "D83CDFC1", "D83CDFC6", "D83DDC0E", "D83DDC0F", "D83DDC1C", "D83DDC2B", "D83DDC2E", "D83DDC03",
        "D83DDC3B", "D83DDC3C", "D83DDC05", "D83DDC13", "D83DDC18", "D83DDC94", "D83DDCAD", "D83DDC36", "D83DDC31", "D83DDC37", "D83DDC11", "23F3", "26BE", "26C4",
        "2600", "D83CDF3A", "D83CDF3B", "D83CDF3C", "D83CDF3D", "D83CDF4B", "D83CDF4D", "D83CDF4E", "D83CDF4F", "D83CDF6D", "D83CDF37", "D83CDF38", "D83CDF46",
        "D83CDF49", "D83CDF50", "D83CDF51", "D83CDF53", "D83CDF54", "D83CDF55", "D83CDF56", "D83CDF57", "D83CDF69", "D83CDF83", "D83CDFAA", "D83CDFB1", "D83CDFB2",
        "D83CDFB7", "D83CDFB8", "D83CDFBE", "D83CDFC0", "D83CDFE6", "D83DDE38"
    ],
    curEmojiKeys: {},
    emojiShowMore: function(e) {
        var i = Emoji.opts[e];
        if (i && !i.curTab)
            if (Emoji.allEmojiCodes) {
                var o, t = 0,
                    s = geByClass1("emoji_scroll", i.tt),
                    r = "";
                for (re("im_emoji_progress");
                    (o = Emoji.allEmojiCodes[i.allEmojiId]) && (i.allEmojiId += 1, i.sharedTT && (i.sharedTT.emojiAllId = i.allEmojiId), Emoji.curEmojiKeys[o] || (r +=
                        Emoji.emojiWrapItem(e, o), t += 1, !(t > 128))););
                r && (s.appendChild(cf(r)), i.emojiScroll.update(!1, !0))
            } else cur.onEmojiLoad = Emoji.emojiShowMore.pbind(e)
    },
    emojiLoadMore: function(e) {
        var i = Emoji.opts[e];
        if (i.emojiMoreSt = 1, Emoji.allEmojiCodes) i.allEmojiId = 0, i.sharedTT && (i.sharedTT.emojiAllId = 0), cur.onEmojiLoad && cur.onEmojiLoad();
        else {
            var o = {
                act: "get_emoji_list"
            };
            Emoji.hasNewStickers < 0 && (o.new_shown = 1), ajax.post("al_im.php", o, {
                onDone: function(e, o) {
                    Emoji.stickers = o, Emoji.stickers[-1] && ls.set("recent_stickers", Emoji.stickers[-1]), i.allEmojiId = 0, i.sharedTT && (i.sharedTT.emojiAllId =
                        0), Emoji.allEmojiCodes = e, cur.onEmojiLoad && cur.onEmojiLoad(), Emoji.onStickersLoad && (Emoji.onStickersLoad(), Emoji.onStickersLoad = !
                        1)
                }
            })
        }
    },
    ttEmojiList: function(e) {
        var i = [],
            o = Emoji.curEmojiSet,
            t = [];
        for (var s in o) {
            var r = o[s];
            Emoji.curEmojiKeys[r] = 1;
            var a = Emoji.emojiWrapItem(e, r, s);
            i.push(a)
        }
        t.length && i.unshift.apply(i, t);
        var n = '<div align="center" id="im_emoji_progress"><span class="progress_inline progress_gray"></span></div>';
        return i.join("") + n
    },
    emojiWrapItem: function(e, i, o) {
        var t = Emoji.cssEmoji[i];
        if (t) var s = ' title="' + t[1] + '"';
        else var s = "";
        if (browser.mobile) var r = "";
        else var r = ' onmouseover="return Emoji.emojiOver(' + e + ', this, true);"';
        return '<a class="emoji_smile_cont ' + ("2764" != i && o && 54 > o ? "emoji_smile_shadow" : "") + '" ' + s + " onmousedown=\"Emoji.addEmoji(Emoji.shownId, '" +
            i + '\', this); return cancelEvent(event);" onclick="return cancelEvent(event);"' + r + '><div class="emoji_bg"></div><div class="emoji_shadow"></div>' +
            Emoji.getEmojiHTML(i, !1, !1, !0) + "</a>"
    },
    reappendEmoji: function(e, i) {
        var o = Emoji.opts[e];
        if (o && o.rceCont && (o.addMediaBtn ? o.sendWrap.insertBefore(o.rceCont, o.addMediaBtn) : o.sendWrap.appendChild(o.rceCont)), i) {
            o.controlsCont;
            o.emojiWrap ? o.emojiWrap.appendChild(i) : o.obj.appendChild(i), clearTimeout(cur.ttEmojiHide), hide(i)
        }
    },
    ttCalcHeight: function(e, i, o) {
        window.headH = window.headH || ge("page_header") && getSize(ge("page_header"))[1] || 0;
        var t = (window.pageNode && window.browser.mozilla ? Math.min(getSize(pageNode)[1], window.lastWindowHeight) : window.lastWindowHeight) || getScroll()[3],
            s = window.scrollGetY ? scrollGetY() : getScroll()[1],
            r = getXY(i)[1],
            a = getSize(i)[1],
            n = geByClass1("emoji_list", o),
            l = Emoji.opts[e].emojiSmileHeigh,
            c = headH,
            m = Emoji.opts[e].emojiRowsCount,
            d = 9,
            D = 8;
        isAncestor(i, pageNode) || (c = 0), setStyle(n, {
            height: m * l + D
        });
        var u, j, E = getSize(o)[1],
            p = r - d - c - s,
            f = t + s - r - a - d;
        for (u = E > p && E > f ? p >= f : p >= E, j = u ? p : f; E > j && m > 4;) m--, E -= l;
        Emoji.opts[e].emojiRowsCount = m, Emoji.opts[e].emojiSmileHeigh = l, setStyle(n, {
            height: m * l + D
        }), toggleClass(o, "tt_down", u), toggleClass(o, "tt_up", !u)
    },
    repositionEmoji: function(e, i, o) {
        var t, s = Emoji.opts[e];
        if (s) {
            if (o.parentNode && getXY && getStyle && setStyle && geByClass && (t = geByClass1("emoji_rpointer", o))) {
                var r = parseInt(getStyle(o, "width")),
                    a = 266,
                    n = 7,
                    l = 10,
                    c = getXY(i)[0],
                    m = parseInt(getStyle(i, "width")),
                    d = getXY(o.parentNode)[0];
                a + n + l > c + m / 2 ? (setStyle(o, "left", -r - d), setStyle(t, "left", c + m / 2 - 2 * l + "px")) : (setStyle(o, "left", ""), setStyle(t, "left", ""))
            } else setStyle(o, "left", "");
            var D = geByClass1("emoji_list", o),
                u = geByClass1("emoji_smile_cont", D);
            Emoji.opts[e].emojiSmileHeigh = u && getSize(u)[1] || 26, Emoji.opts[e].emojiRowsCount = 9, Emoji.ttCalcHeight(e, i, o)
        }
    },
    emojiOver: function(e, i, o) {
        if (browser.mobile || o && Emoji.preventMouseOver) return !0;
        var t = Emoji.opts[e];
        addClass(i, "emoji_over"), t.emojiOvered && t.emojiOvered != i && removeClass(t.emojiOvered, "emoji_over"), t.emojiOvered = i
    },
    emojiExpand: function(e, i) {
        var o = Emoji.opts[e],
            t = geByClass1("emoji_list", i);
        if (addClass(i, "emoji_expanded"), Emoji.emojiLoadMore(e), o.emojiScroll) o.emojiScroll.enable();
        else {
            var s = !1;
            o.emojiScroll = new Scrollbar(t, {
                prefix: "emoji_",
                nomargin: !0,
                global: !0,
                nokeys: !0,
                right: vk.rtl ? "auto" : 9,
                left: vk.rtl ? 9 : "auto",
                startDrag: function() {
                    o.scrolling = !0
                },
                stopDrag: function() {
                    o.scrolling = !1, o.afterScrollFn && o.afterScrollFn()
                },
                scrollChange: function(e) {
                    window.tooltips && (tooltips.destroyAll(), cur.ttScrollTime = (new Date)
                        .getTime()), Emoji.showShadow() && (e && !s ? (show(geByClass1("emoji_expand_shadow_top", o.tt)), s = !0) : !e && s && (s = !1,
                        hide(geByClass1("emoji_expand_shadow_top", o.tt)))), o.imagesLoader && o.imagesLoader.processLoad()
                },
                more: Emoji.emojiShowMore.pbind(e)
            }), o.sharedTT && (o.sharedTT.emojiScroll = o.emojiScroll)
        }
        o.emojiExpanded = !0
    },
    emojiMove: function(e) {
        var i = Emoji.shownId,
            o = Emoji.opts[i];
        if (Emoji.shown && o.emojiFocused && o.openedByTabKey) {
            var t = null;
            switch (e.keyCode) {
                case KEY.LEFT:
                    t = o.emojiOvered.previousSibling, cancelEvent(e);
                    break;
                case KEY.RIGHT:
                    t = o.emojiOvered.nextSibling, cancelEvent(e);
                    break;
                case KEY.UP:
                    var s = 11;
                    for (t = o.emojiOvered; t.previousSibling && --s > 0;) t = t.previousSibling;
                    if (cancelEvent(e), s > 1) return !1;
                    break;
                case KEY.DOWN:
                    var s = 11;
                    for (t = o.emojiOvered; t.nextSibling && --s > 0;) t = t.nextSibling;
                    if (cancelEvent(e), s > 1) return !1;
                    break;
                case KEY.ENTER:
                    if (!Emoji.emojiEnter(i, e)) return cancelEvent(e), !1;
                    break;
                default:
                    return !0
            }
            if (t) return Emoji.scrollToListEl(i, t), Emoji.preventMouseOver = !0, Emoji.emojiOver(i, t), !1
        }
        return !0
    },
    scrollToListEl: function(e, i) {
        if (cur.emojiList.contains(i)) {
            var o = Emoji.opts[e],
                t = i.offsetTop - cur.emojiList.scrollTop;
            t >= o.emojiSmileHeigh * o.emojiRowsCount ? animate(cur.emojiList, {
                scrollTop: cur.emojiList.scrollTop + (t - o.emojiSmileHeigh * (o.emojiRowsCount - 1))
            }, 80, function() {
                o.emojiScroll.update(!0, !0)
            }) : 0 > t && animate(cur.emojiList, {
                scrollTop: cur.emojiList.scrollTop + t
            }, 80, function() {
                o.emojiScroll.update(!0, !0)
            })
        }
    },
    anim: function(e, i) {
        clearInterval(cur._imAnim);
        var o = 300,
            t = 45 / (o / 13),
            s = 1 / (o / 13),
            r = Math.floor(o / 13),
            a = 0,
            n = domLC(e),
            l = domFC(e),
            c = i ? 0 : 45,
            m = i ? 45 : 0,
            d = i ? 1 : 0,
            D = i ? 0 : 1;
        cur._imAnim = setInterval(function() {
            ++a;
            var o = a >= r ? m : c + t * a * (i ? 1 : -1),
                u = o - 45,
                j = a >= r ? D : d + s * a * (i ? -1 : 1),
                E = 1 - j;
            n.style.WebkitTransform = n.style.OTransform = n.style.transform = "rotate(" + o + "deg)", l.style.WebkitTransform = l.style.OTransform = l.style.transform =
                "rotate(" + u + "deg)", n.style.opacity = j, l.style.opacity = E, a >= r && (clearInterval(cur._imAnim), (i ? addClass : removeClass)(e,
                        "emoji_smile_on"), n.style.WebkitTransform = n.style.OTransform = n.style.transform = l.style.WebkitTransform = l.style.OTransform = l.style
                    .transform = n.style.opacity = l.style.opacity = "")
        }, 13)
    },
    tplSmile: function(e) {
        return '<div class="emoji_smile_wrap _emoji_wrap">  <div class="emoji_smile _emoji_btn" title="' + e +
            '" onmouseover="return Emoji.show(this, event);" onmouseout="return Emoji.hide(this, event);" onclick="return cancelEvent(event);">    <div class="emoji_smile_icon"></div>  </div></div>'
    },
    emojiToHTML: function(e, i, o) {
        if (browser.ipad || browser.iphone) return e;
        e = e.replace(/&nbsp;/g, " ")
            .replace(/<br>/g, "\n");
        for (var t = {
                D83DDE07: /(\s|^)([0O�]:\))([\s\.,]|$)/g,
                D83DDE09: /(\s|^)(;-\)+)([\s\.,]|$)/g,
                D83DDE06: /(\s|^)([X�x�]-?D)([\s\.,]|$)/g,
                D83DDE0E: /(\s|^)(B-\))([\s\.,]|$)/g,
                D83DDE0C: /(\s|^)(3-\))([\s\.,]|$)/g,
                D83DDE20: /(\s|^)(&gt;\()([\s\.,]|$)/g,
                D83DDE30: /(\s|^)(;[o�O�])([\s\.,]|$)/g,
                D83DDE33: /(\s|^)(8\|)([\s\.,]|$)/g,
                D83DDE32: /(\s|^)(8-?[o�O�])([\s\.,]|$)/g,
                D83DDE0D: /(\s|^)(8-\))([\s\.,]|$)/g,
                D83DDE37: /(\s|^)(:[X�])([\s\.,]|$)/g,
                D83DDE28: /(\s|^)(:[o�O�])([\s\.,]|$)/g,
                2764: /(\s|^)(&lt;3)([\s\.,]|$)/g
            }, s = 0; 2 > s; s++)
            for (var r in t) e = e.replace(t[r], function(e, i, o, t) {
                return (i || "") + Emoji.getEmojiHTML(r) + (t || "")
            });
        var t = {
            D83DDE0A: /(:-\))([\s\.,]|$)/g,
            D83DDE03: /(:-D)([\s\.,]|$)/g,
            D83DDE1C: /(;-[P�])([\s\.,]|$)/g,
            D83DDE0B: /(:-[p�])([\s\.,]|$)/g,
            D83DDE12: /(:-\()([\s\.,]|$)/g,
            "263A": /(:-?\])([\s\.,]|$)/g,
            D83DDE0F: /(;-\])([\s\.,]|$)/g,
            D83DDE14: /(3-?\()([\s\.,]|$)/g,
            D83DDE22: /(:&#039;\()([\s\.,]|$)/g,
            D83DDE2D: /(:_\()([\s\.,]|$)/g,
            D83DDE29: /(:\(\()([\s\.,]|$)/g,
            D83DDE10: /(:\|)([\s\.,]|$)/g,
            D83DDE21: /(&gt;\(\()([\s\.,]|$)/g,
            D83DDE1A: /(:-\*)([\s\.,]|$)/g,
            D83DDE08: /(\}:\))([\s\.,]|$)/g,
            D83DDC4D: /(:like:)([\s\.,]|$)/g,
            D83DDC4E: /(:dislike:)([\s\.,]|$)/g,
            "261D": /(:up:)([\s\.,]|$)/g,
            "270C": /(:v:)([\s\.,]|$)/g,
            D83DDC4C: /(:ok:|:��:)([\s\.,]|$)/g
        };
        for (var r in t) e = e.replace(t[r], function(e, i, o) {
            return Emoji.getEmojiHTML(r) + (o || "")
        });
        return e = e.replace(/\n/g, "<br>"), i && (e = e.replace(Emoji.emojiRegEx, Emoji.emojiReplace)), e
    },
    emojiReplace: function(e) {
        var i = 0,
            o = "",
            t = "",
            s = "",
            r = [],
            a = [],
            n = !0;
        e.match(/\uFE0F\u20E3/g) && (e = e.replace(/\uFE0F/g, ""));
        do {
            var s = e.charCodeAt(i++);
            if (s) {
                var l = s.toString(16)
                    .toUpperCase(),
                    c = e.charAt(i - 1);
                if (8419 != s) o += l, t += c, c.match(Emoji.emojiCharSeq) || (a.push(o), r.push(t), o = "", t = "");
                else {
                    var m = i - 2,
                        d = e.charAt(m);
                    a.push("003" + d + "20E3"), r.push(d), o = "", t = ""
                }
            } else n = !1
        } while (n);
        o && (a.push(o), r.push(t));
        var D = "",
            u = !1,
            j = !1;
        i = 0, o = "", t = "";
        for (var i in a) {
            var l = a[i],
                c = r[i];
            if (c.match(/\uD83C[\uDFFB-\uDFFF]/)) o += l, t += c;
            else if (u) o += l, t += c, u = !1;
            else {
                if ("200C" == l || "200D" == l) {
                    if (o) {
                        u = !0;
                        continue
                    }
                    D += c
                }
                if (c.match(/\uD83C[\uDDE6-\uDDFF]/)) {
                    if (j) {
                        o += l, t += c, j = !1;
                        continue
                    }
                    j = !0
                } else j && (j = !1);
                o && (D += Emoji.getEmojiHTML(o, t, !0)), o = l, t = c
            }
        }
        return o && (D += Emoji.getEmojiHTML(o, t, !0)), D
    },
    emojiCharSeq: /[0-9\uD83D\uD83C\uD83E]/,
    emojiRegEx: /((?:[\u203C\u2049\u2122\u2328\u2601\u260E\u261d\u2626\u262A\u2638\u2639\u263a\u267B\u267F\u2702\u2708]|[\u2600\u26C4\u26BE\u2705\u2764]|[\u2194-\u2199\u21AA\u21A9]|[\u231A-\u231B]|[\u23E9-\u23EF]|[\u23F0-\u23F4]|[\u23F8-\u23FA]|[\u24C2]|[\u25AA-\u25AB]|[\u25B6\u25C0]|[\u25FB-\u25FE]|[\u2602-\u2618]|[\u2648-\u2653]|[\u2660-\u2668]|[\u26A0-\u26FA]|[\u2692-\u269C]|[\u262E-\u262F]|[\u2622-\u2623]|[\u2709-\u2764]|[\u2795-\u2797]|[\u27A1]|[\u27BF]|[\u2934-\u2935]|[\u2B05-\u2B07]|[\u2B1B]|[\u2B50\u2B55]|[\u303D]|[\u3297\u3299]|[\uE000-\uF8FF]|[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]|[0-9]\u20E3|[\u0023-\u0039\u203C-\u21AA]\uFE0F\u20E3|[\u200C\u200D])+)/g,
    emojiFlagRegEx: /\uD83C\uDDE8\uD83C\uDDF3|\uD83C\uDDE9\uD83C\uDDEA|\uD83C\uDDEA\uD83C\uDDF8|\uD83C\uDDEB\uD83C\uDDF7|\uD83C\uDDEC\uD83C\uDDE7|\uD83C\uDDEE\uD83C\uDDF9|\uD83C\uDDEF\uD83C\uDDF5|\uD83C\uDDF0\uD83C\uDDF7|\uD83C\uDDF7\uD83C\uDDFA|\uD83C\uDDFA\uD83C\uDDF8/,
    getCode: function(e) {
        var i = !1;
        if ("emoji" == e.className) {
            var o = e.src.match(/\/([a-zA-Z0-9]+)(_2x)?.png/);
            if (o) var i = o[1]
        } else if ("emoji_css" == e.className) var i = e.getAttribute("emoji");
        return i
    },
    getTabCont: function(e, i) {
        var o = window.devicePixelRatio >= 2 ? "128" : "64";
        if (i) {
            var t = "",
                s = Emoji.stickers[i];
            if (!s) return "";
            var r = s.stickers,
                a = 64,
                n = 256 / a;
            for (var l in r) t += '<a id="emoji_sticker_item' + e + "_" + i + "_" + r[l][0] + '" class="emoji_sticker_item" onclick="Emoji.stickerClick(' + e + ", " +
                r[l][0] + ", " + r[l][1] + ', this);"><img class="emoji_need_load" width="' + parseInt(r[l][1] / n) + '" height="' + a +
                '" src="/images/blank.gif" data-src="/images/stickers/' + r[l][0] + "/" + o + '.png" /></a>'
        } else var t = Emoji.ttEmojiList(e);
        return t
    },
    tabSwitch: function(e, i, o) {
        if (!Emoji.stickers || isEmpty(Emoji.stickers)) return Emoji.onStickersLoad = Emoji.tabSwitch.pbind(e, i, o), !1;
        var t = Emoji.opts[o],
            s = t.tt,
            r = geByClass1("emoji_tabs", s),
            a = geByClass1("emoji_tab_sel", r);
        if (a != e) {
            t.imagesLoader && (t.imagesLoader.iloader && t.imagesLoader.iloader.abort(), t.imagesLoader.destroy()), removeClass(a, "emoji_tab_sel"), addClass(e,
                "emoji_tab_sel"), t.curTab = i, cur.stickersTab = i, ls.set("stickers_tab", i), t.allEmojiId = 0;
            var n = Emoji.getTabCont(o, i),
                l = geByClass1("emoji_scroll", s);
            l.innerHTML = n, t.imagesLoader && t.imagesLoader.processLoad(), t.emojiOvered && 0 === t.curTab && Emoji.emojiOver(o, geByClass1("emoji_scroll", s)
                .firstChild), t.emojiScroll.scrollTop(), t.emojiScroll.update()
        }
    },
    stickerClick: function(e, i, o, t) {
        var s = Emoji.opts[e];
        Emoji.stickers[-1] || (Emoji.stickers[-1] = {
            stickers: []
        });
        for (var r in Emoji.stickers[-1].stickers) Emoji.stickers[-1].stickers[r][0] == i && Emoji.stickers[-1].stickers.splice(r, 1);
        Emoji.stickers[-1].stickers.unshift([i, o]), ls.set("recent_stickers", Emoji.stickers[-1]), s.onStickerSend && s.onStickerSend(i), Emoji.ttHide(e, !1, !1, !0),
            s.recentSticker = i
    },
    stickerOver: function(e, i) {
        var o = {
                act: "a_stickers_hover",
                sticker_id: e,
                from: cur.module
            },
            t = (cur.tooltips || [])
            .length;
        if (isObject(i.tt) && "IMG" === i.firstChild.nodeName) return i.tt.show();
        var s = {
            url: "al_im.php",
            params: o,
            index: t,
            className: "subscribe_post_tt sticker_extra_tt sticker_extra_tt" + t,
            shift: function() {
                return [-138, 0, -220]
            },
            hasover: 1,
            slideX: 15,
            showsp: 150,
            cache: 1,
            forcetodown: !0,
            no_shadow: !0
        };
        return showTooltip(i, s);
    },
    selectPeer: function(e) {
        if (void 0 !== e) {
            var i = Emoji.opts[e];
            if (i.peer) return i.peer
        }
        var o = cur.peer || (cur.mbTo ? cur.mbTo[0] : "");
        if (-3 == o && cur.wdd.imw_dd) {
            var t = 0;
            for (var s in cur.wdd.imw_dd.selected) o = cur.wdd.imw_dd.selected[s][0], t += 1;
            t > 1 && (o = "")
        }
        return o
    },
    showMyStickers: function() {
        cur.boxMyStickers = showBox("al_im.php", {
            act: "stickers_my"
        }, {
            dark: 1,
            stat: ["im.css", "imn.js", "sorter.js"]
        })
    },
    showStickersStore: function(e) {
        var i = Emoji.selectPeer(e);
        cur.boxStickersStore = showBox("al_im.php", {
            act: "stickers_store",
            peer: i,
            box: 1
        }, {
            dark: 1,
            stat: ["im.css", "imn.js", "page_help.css", "sorter.js"]
        }), each(geByClass("emoji_smile_icon_promo"), function(e, i) {
            geByClass1("emoji_smile_icon", i.parentNode), re(i)
        }), each(geByClass("emoji_shop_icon_badge"), function(e, i) {
            re(i)
        }), Emoji.hasNewStickers = !1
    },
    previewSticker: function(e, i, o, t) {
        if (o = o || {}, t && checkEvent(t)) return !0;
        var s = {
                act: "sticker_preview",
                pack_id: e
            },
            r = Emoji.selectPeer();
        if (o.peer ? s.peer = o.peer : r && (s.peer = r), o.preview && (s.preview = 1), o.name) {
            var a = nav.objLoc[0].split("/");
            "stickers" == a[0] && a[1] != o.name && nav.setLoc({
                0: "stickers/" + o.name
            })
        }
        return cur.boxStickersPreview = showBox("al_im.php", s, {
            dark: 1,
            stat: ["im.css", "imn.js"],
            onFail: function(i) {
                return window.emojiStickersDisabled || (window.emojiStickersDisabled = {}), window.emojiStickersDisabled[e] = !0, i ? !0 : void 0
            }
        }), cancelEvent(t), !1
    },
    isStickerPackEnabled: function(e, i) {
        var o = !1;
        if (!window.emojiStickers && i) return ajax.post("al_im.php", {
            act: "a_stickers_list"
        }, {
            onDone: function(e) {
                window.emojiStickers = e, i()
            }
        }), 0;
        if (!window.emojiStickers) return !1;
        for (var t in window.emojiStickers)
            if (window.emojiStickers[t][0] == e) {
                o = window.emojiStickers[t][1] ? !0 : !1;
                break
            }
        return o
    },
    clickSticker: function(e, i, o) {
        if (window.emojiStickersDisabled && window.emojiStickersDisabled[e]) return !0;
        if (82 == e) return showWiki({
            w: "vk2016"
        }, !1, o);
        if (i) {
            var t = Emoji.isStickerPackEnabled(e, Emoji.clickSticker.pbind(e, i, o));
            if (0 === t) return !1;
            if (t) {
                var s = !1;
                if (i.getAttribute("contenteditable")) s = i;
                else {
                    for (var r = i.parentNode, a = !1;
                        (r = r.parentNode) && !hasClass(r, "js-im-page");)
                        if (hasClass(r, "fc_tab")) {
                            a = !0;
                            break
                        }
                    if (!r) return !1;
                    a ? s = geByClass1("fc_editable", r) : hasClass(r, "js-im-page") && (s = geByClass1("_im_text"))
                }
                if (s) {
                    var n = Emoji.opts[s.emojiId];
                    Emoji.ttClick(s.emojiId, geByClass1("emoji_smile", s.parentNode.parentNode), !1, !0);
                    var l = geByClass1("emoji_tabs_wrap", n.tt),
                        c = geByClass1("emoji_tab_" + e, l),
                        m = l.scrollLeft,
                        d = l.firstChild.clientWidth - l.clientWidth;
                    if (c.offsetLeft > m) {
                        for (; m + 5 * c.clientWidth < c.offsetLeft;) m += 5 * c.clientWidth;
                        m >= d && (m = d, hide(geByClass1("emoji_tabs_r_s", n.tt)), n.rShown = !1, Emoji.scrollToggleArrow(!1, "r", n)), m && !n.lShown && Emoji.scrollToggleArrow(!
                            0, "l", n)
                    } else {
                        for (; m > c.offsetLeft;) m = Math.max(m - 5 * c.clientWidth, 0);
                        0 >= m && (m = 0, Emoji.scrollToggleArrow(!1, "l", n)), d > m && !n.rShown && Emoji.scrollToggleArrow(!0, "r", n)
                    }
                    n.scrollLeft = m, l.scrollLeft = m, !Emoji.stickers || isEmpty(Emoji.stickers) ? (Emoji.onStickersLoad = Emoji.tabSwitch.pbind(c, e, s.emojiId),
                        removeClass(geByClass1("emoji_tab_sel", l), "emoji_tab_sel"), addClass(c, "emoji_tab_sel"), geByClass1("emoji_scroll", n.tt)
                        .innerHTML = '<div class="emojo_scroll_progress"></div>') : Emoji.tabSwitch(c, e, s.emojiId)
                }
            }
        }
        return i && t || Emoji.previewSticker(e), o && cancelEvent(o), !1
    },
    buyStickers: function(e, i, o, t, s) {
        if (o) {
            o.innerHTML;
            if (hasClass(o, "secondary")) return !0
        }
        var r = Emoji.selectPeer();
        return ajax.post("/al_im.php", {
            act: "a_stickers_buy",
            pack_id: e,
            hash: t,
            peer: r
        }, {
            onDone: function(i, o, t) {
                each(geByClass("_sticker_btn_" + e), function() {
                    this.innerHTML = t, this.onmouseover = "", this.onclick = "", addClass(this, "secondary")
                }), cur.boxStickersPreview && cur.boxStickersPreview.hide(), showDoneBox(i), o && Emoji.updateTabs(o, !0);
                var s = cur.tabbedStickersBox;
                if (s && s.tbUpdate)
                    for (var r in s.tbUpdate) s.tbUpdate[r] = 1;
                var a = cur.emojiId && cur.emojiId[cur.peer];
                if (a) {
                    var n = geByClass1("emoji_tab_" + e, Emoji.opts[a].tt);
                    n && Emoji.tabSwitch(n, e, a)
                }
            },
            showProgress: lockButton.pbind(o),
            hideProgress: unlockButton.pbind(o),
            onFail: function(e) {
                return e && setTimeout(showFastBox(getLang("global_error"), e)
                    .hide, 3e3), !0
            }
        }), cancelEvent(i)
    },
    stickerAct: function(e, i, o, t, s) {
        if (s && hasClass(e, "secondary")) return !0;
        var r = (e.innerHTML, s ? hasClass(e, "secondary") : hasClass(e, "_im_sticker_activated"));
        r ? state = 1 : state = 0;
        var a = cur.tabbedStickersBox;
        if (a)
            for (var n in a.tbUpdate) a.tbUpdate[n] = 1;
        return ajax.post("/al_im.php", {
            act: "a_stickers_switch",
            pack_id: i,
            hash: o,
            state: state,
            from_btn: s ? 1 : 0
        }, {
            onDone: function(o, t, r) {
                s || (e.innerHTML = o, e.onmouseover = "", setStyle(e, {
                    width: "auto"
                }), toggleClass(e, "_im_sticker_activated", !state)), each(geByClass("_sticker_btn_" + i), function() {
                    this.innerHTML = r, this.onmouseover = "", toggleClass(this, "secondary", !state)
                }), Emoji.updateTabs(t, !0);
                var a = e.parentNode.parentNode;
                if (!s) {
                    if (cur.stickersSorter.destroy(), state) {
                        show("im_stickers_deact");
                        var n = ge("im_stickers_deact_wrap");
                        n.firstChild ? n.insertBefore(a, n.firstChild) : n.appendChild(a), setStyle(a, {
                            cursor: "default"
                        })
                    } else {
                        var n = ge("im_stickers_my_wrap");
                        n.appendChild(a);
                        var l = ge("im_stickers_deact_wrap");
                        l.childNodes.length || hide("im_stickers_deact")
                    }
                    cur.stickersSorterInit()
                }
            },
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e)
        }), cancelEvent(t)
    },
    getTabsCode: function(e, i) {
        var o = "",
            t = [];
        e && t.push.apply(t, e), t.length > 1 && (Emoji.hasNewStickers = !1);
        for (var s in t) {
            var r = t[s][0],
                a = t[s][1];
            if (a) var n = "return Emoji.tabSwitch(this, " + r + ", " + i + ");";
            else var n = "return Emoji.previewSticker(" + r + ");";
            t[s][2] && (Emoji.hasNewStickers = t[s][2]), o += -1 === r ? '<a class="emoji_tab emoji_tab_img_cont emoji_tab_recent emoi_tab_' + r + " emoji_tab_" + r +
                (cur.stickersTab == r ? " emoji_tab_sel" : "") + '" onclick="' + n + '"><span class="emoji_tab_icon emoji_sprite emoji_tab_icon_recent"></span></a>' :
                r ? '<a class="emoji_tab emoji_tab_img_cont emoi_tab_' + r + " emoji_tab_" + r + (cur.stickersTab == r ? " emoji_tab_sel" : "") + (a ? "" :
                    " emoji_tab_promo") + '" onclick="' + n + '"><img width="22" height="22" src="/images/store/stickers/' + r + "/thumb_" + (window.devicePixelRatio >=
                    2 ? "44" : "22") + '.png" class="emoji_tab_img"/></a>' : '<a class="emoji_tab emoji_tab_' + r + (cur.stickersTab == r ? " emoji_tab_sel" : "") + (a ?
                    "" : " emoji_tab_promo") + '" onclick="' + n + '"><div class="emoji_tab_icon emoji_sprite emoji_tab_icon_' + r + '"></div></a>'
        }
        return o
    },
    updateTabs: function(e, i) {
        e && i && window.Notifier && Notifier.lcSend("emoji", {
            act: "updateTabs",
            newStickers: e
        }), void 0 === e ? window.emojiStickers || ajax.post("al_im.php", {
            act: "a_stickers_list"
        }, {
            onDone: Emoji.updateTabs
        }) : window.emojiStickers = e;
        for (var o in Emoji.opts) {
            var t = Emoji.opts[o];
            if (!t.noStickers) {
                var s = "";
                s += Emoji.getTabsCode(window.emojiStickers, o);
                var r = ge("emoji_tabs_cont_" + o);
                r && (r.innerHTML = s), Emoji.checkEmojiSlider(t)
            }
        }
    },
    checkEmojiSlider: function(e) {
        var i = geByClass1("emoji_tabs_wrap", e.tt),
            o = !1;
        if (i) {
            if (i.firstChild.clientWidth && i.firstChild.clientWidth > i.clientWidth + i.scrollLeft) o = !0;
            else {
                var t = i.firstChild.childNodes;
                t.length > 6 && (e.scrollLeft || 0) < 34 * (t.length - 6) - 16 && (o = !0)
            }
            var s = vk.rtl ? "l" : "r";
            o ? (e.sliderShown = !0, Emoji.scrollToggleArrow(!0, s, e, !0)) : e.sliderShown && (e.sliderShown = !1, Emoji.scrollToggleArrow(!1, s, e, !0))
        }
    },
    giftSticker: function(e, i, o, t) {
        t = t || {};
        var s = {
            act: "stickers_gift_box",
            pack_id: e,
            peers: i
        };
        return t.from && (s.from = t.from), boxLayerWrap.scrollTop = 0, showBox("/al_im.php", s, {
            stat: ["wide_dd.js", "wide_dd.css", "notifier.css", "notifier.js"],
            dark: 1
        }), cancelEvent(o)
    },
    showStickerTT: function(e) {
        var i = e.getAttribute("data-title");
        i && showTooltip(e, {
            text: i,
            slide: 15,
            shift: [74 - getSize(e)[0] / 2, 120, 5],
            className: "sticker_hint_tt",
            hasover: 1
        })
    },
    __eof: 1
};
try {
    stManager.done("emoji.js")
} catch (e) {}
