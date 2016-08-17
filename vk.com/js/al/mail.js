var mail = {
    fastGo: function(e, i) {
        if (checkEvent(i)) {
            var a = e.match(/mail\?act=show&id=(\d+)/);
            if (a) {
                var r = a[1],
                    t = cur.mail_cached[r];
                t && t.unread && !t.deleted && (cur.new_msg--, mail.updateUnread(), t.unread = !1, ge("mess" + r)
                    .className = "")
            }
            return !1
        }
        return nav.go(e)
    },
    getListParams: function() {
        var e = {
            section: cur.section
        };
        return "inbox" == e.section && (e.filter = cur.filter), "search" == cur.section && (e.q = val("s_search"), e.q || (delete e.section, delete e.q)), e.section &&
            "inbox" != e.section || delete e.section, e
    },
    updateList: function(e) {
        nav.go(extend({
            0: "mail"
        }, mail.getListParams(), e || {}))
    },
    updateUnread: function() {
        handlePageCount("msg", cur.new_msg)
    },
    showMessage: function(e) {
        var i = cur.mail_cached[e];
        if (i) {
            if (i.deleted) return !1;
            ge("mail_top_msg_wrap")
                .innerHTML = "", i.unread ? (ge("mess" + e)
                    .className = "", i.unread = !1, "new" == cur.filter && (cur.count--, mail.updateSummary()), ajax.post("al_mail.php", {
                        act: "show",
                        id: e
                    }, {
                        onDone: function(e) {
                            if ("new" == cur.filter && (cur.offset--, cur.count = e), "spam" == cur.section) {
                                var i = ge("mail_unread_spam_count"),
                                    a = val(geByTag1("b", i)) - 1;
                                val(i, a > 0 ? "(<b>" + a + "</b>)" : "")
                            }
                            cur.new_msg = e, mail.updateUnread()
                        },
                        ads: 1
                    }), cur.new_msg--, mail.updateUnread()) : ajax.post("ads_rotate.php", {
                    act: "al_update_ad"
                }, {
                    ads: 1
                });
            var a = cur.msg_tpl;
            each(["id", "photo", "link", "date", "topic", "message", "header", "warning", "button_label", "history", "online", "buttons"], function(e, r) {
                a = a.replace("%" + r + "%", i[r])
            });
            var r = (cur._back, ge("mail_content")),
                t = hab.getLoc(),
                o = ce("div", {
                    id: "mail_content",
                    innerHTML: a
                }),
                s = scrollNode.scrollTop;
            return cur._back_local = {
                content: r.parentNode.replaceChild(o, r),
                section: cur.section,
                filter: cur.filter || "all",
                htitle: document.title.toString(),
                loc: t,
                scrollTop: s,
                back: window._tbLink && _tbLink.loc ? [_tbLink.loc, val(_tbLink), _tbLink.fast] : !1
            }, document.title = i.htitle, mail.setSection("msg"), nav.setLoc("mail?act=show&id=" + e), showBackLink(cur._back_local.loc, getLang("mail_return_to_list"), !
                0), scrollNode.scrollTop = 0, !browser.mobile && elfocus("mail_reply_field"), mail.initThread(extend(i.options, {
                media_types: cur.msg_media_types
            })), !1
        }
    },
    showMsgsList: function(e, i, a) {
        if (!cur._back_local) return !0;
        var r = cur._back_local;
        if (e !== !1) {
            var t = e.section || "inbox",
                o = e.filter || "all";
            if (cur.ignore_local || r.section != t || "inbox" == t && r.filter != o) return !0
        }
        cur._back_local = !1;
        var s = (cur._back, ge("mail_content"));
        return s.parentNode.replaceChild(r.content, s), mail.setSection(r.section), document.title = r.htitle, r.back ? showBackLink(r.back[0], r.back[1], r.back[2]) :
            showBackLink(!1), nav.setLoc(r.loc), i ? scrollNode.scrollTop = r.scrollTop : (scrollNode.scrollTop = 0, mail.updateList(a)), !1
    },
    doPost: function() {
        var e = ge("mail_send");
        if (!geByClass1("button_lock", e.parentNode, "span")) {
            var i = "msg" == cur.section ? ge("mail_reply_field") : ge("mail_write_field");
            if (i) {
                var a = trim(val(i)),
                    r = cur.addMailMedia && cur.addMailMedia.chosenMedias || [];
                if (!a && !r.length) return void notaBene(i);
                if ("write" == cur.section && !cur.toPeople.val()) return void cur.toPeople.input.focus();
                lockButton(e);
                var t = {
                    act: "a_send",
                    chas: mail.decodehash(cur.thread.hash),
                    message: a
                };
                if (r.length) {
                    var o = [];
                    r && (each(r, function(e, i) {
                        i && o.push(i[0] + ":" + i[1])
                    }), t.media = o.join(","))
                }
                "write" == cur.section ? (extend(t, {
                    to_ids: cur.toPeople.val(),
                    title: val("mail_topic"),
                    from: "write"
                }), cur.thread.extra_hash && (t.extra_chas = mail.decodehash(cur.thread.extra_hash))) : extend(t, {
                    to_id: cur.thread.id,
                    title: cur.thread.reply_title,
                    from: "msg",
                    to_reply: cur.thread.msg_id
                }), ajax.post("al_mail.php", t, {
                    onDone: function(e, i, a, r) {
                        if (cur._back_local) {
                            if (mail.showMsgsList(!1, !1, r), ge("mail_top_msg_wrap")
                                .innerHTML = a, "outbox" == cur.section) {
                                var t = ce("div", {
                                        innerHTML: "<table><tbody>" + i + "</tbody></table>"
                                    })
                                    .firstChild.rows[0];
                                ge("mail_rows_t")
                                    .insertRow(t, 0)
                            }
                        } else nav.go(extend({
                            0: "mail"
                        }, r))
                    },
                    onFail: function(i) {
                        return i ? (setTimeout(showFastBox(getLang("global_error"), i)
                            .hide, 5e3), unlockButton(e), !0) : void 0
                    }
                })
            }
        }
    },
    showHistory: function() {
        ajax.post("/al_mail.php", {
            act: "history",
            id: cur.thread.id
        }, {
            onDone: function(e, i) {
                ge("mail_history")
                    .innerHTML = i, mail.applyThreadOptions(e), mail.scrollCheck()
            },
            showProgress: function() {
                show("mail_history_open_progress"), hide("mail_history_open"), cur.isMailLoading = !0
            },
            hideProgress: function() {
                hide("mail_history_open_progress"), cur.isMailLoading = !1
            }
        })
    },
    showMoreThread: function() {
        if (!cur.isMailLoading) {
            var e = ge("show_more_link"),
                i = geByTag1("tbody", ge("mail_history_t")),
                a = ge("mail_history_t_next") && geByTag1("tbody", ge("mail_history_t_next"));
            if (e && isVisible(e) && a) {
                for (var r; r = a.firstChild;) i.appendChild(r);
                mail.applyThreadOptions({}), cur.thread.has_more && ajax.post("/al_mail.php", {
                    act: "history",
                    id: cur.thread.id,
                    offset: cur.thread.offset
                }, {
                    onDone: function(e, i) {
                        if (browser.msie || browser.opera) {
                            var r = ce("div", {
                                    innerHTML: "<table><tbody>" + i + "</tbody></table>"
                                })
                                .firstChild.firstChild;
                            a.parentNode.replaceChild(r, a)
                        } else a.innerHTML = i;
                        mail.applyThreadOptions(e), mail.scrollCheck()
                    },
                    showProgress: function() {
                        hide("show_more"), show("show_more_progress"), cur.isMailLoading = !0
                    },
                    hideProgress: function() {
                        show("show_more"), hide("show_more_progress"), cur.isMailLoading = !1
                    }
                })
            }
        }
    },
    showFullHistory: function() {
        if (!cur.isMailLoading) {
            var e, i = ge("show_more_link"),
                a = geByTag1("tbody", ge("mail_history_t")),
                r = ge("mail_history_t_next") && geByTag1("tbody", ge("mail_history_t_next")),
                t = ge("mail_history_full"),
                o = val(t);
            if (i && isVisible(i) && r) {
                for (; e = r.firstChild;) a.appendChild(e);
                mail.applyThreadOptions({})
            }
            if (!cur.thread.has_more && (debugLog(cur.thread.delete_all_link), cur.thread.delete_all_link)) return void val(t, cur.thread.delete_all_link);
            val(t, '<img src="/images/upload.gif" />'), ajax.post("/al_mail.php", {
                act: "history",
                id: cur.thread.id,
                offset: -cur.thread.offset
            }, {
                onDone: function(e, i) {
                    if (i)
                        for (var r, s = ce("div", {
                                    innerHTML: "<table><tbody>" + i + "</tbody></table>"
                                })
                                .firstChild.firstChild; r = s.firstChild;) a.appendChild(r);
                    val(t, e.delete_all_link || o), setStyle(t, {
                        visibility: "visible",
                        display: "inline"
                    }), mail.applyThreadOptions(e)
                },
                onFail: function() {
                    return val(t, cur.thread.delete_all_link || ""), setStyle(t, {
                        visibility: "visible",
                        display: "block"
                    }), !0
                },
                showProgress: function() {
                    cur.isMailLoading = !0
                },
                hideProgress: function() {
                    cur.isMailLoading = !1
                }
            })
        }
    },
    applyThreadOptions: function(e) {
        extend(cur.thread, e);
        var i = (ge("mail_history_t_next") || {
                rows: []
            })
            .rows.length > 0;
        setStyle("show_more_link", "display", e.has_more || i ? "block" : "none")
    },
    showMore: function() {
        if (!cur.isMailLoading) {
            var e = ge("show_more_link"),
                i = geByTag1("tbody", ge("mail_rows_t")),
                a = ge("mail_rows_t_next") && geByTag1("tbody", ge("mail_rows_t_next"));
            if (a) {
                for (var r, t = scrollGetY(); r = a.firstChild;) i.appendChild(r);
                return r && (scrollToY(t, 0), setTimeout(function() {
                    scrollToY(t + 1, 0)
                }, 100)), cur.has_more ? void ajax.post("/al_mail.php", extend(mail.getListParams(), {
                    offset: cur.offset
                }), {
                    onDone: function(e, i) {
                        if (browser.msie || browser.opera) {
                            var r = ce("div", {
                                    innerHTML: "<table><tbody>" + i + "</tbody></table>"
                                })
                                .firstChild.firstChild;
                            a.parentNode.replaceChild(r, a)
                        } else a.innerHTML = i;
                        mail.applyOptions(e), mail.scrollCheck()
                    },
                    showProgress: function() {
                        hide("show_more"), show("show_more_progress"), cur.isMailLoading = !0
                    },
                    hideProgress: function() {
                        show("show_more"), hide("show_more_progress"), cur.isMailLoading = !1
                    }
                }) : void hide(e)
            }
        }
    },
    applyOptions: function(e, i) {
        e.mail_cached && (cur.mail_cached = extend(cur.mail_cached || {}, e.mail_cached), delete e.mail_cached);
        var a = (ge("mail_rows_t_next") || {
                rows: []
            })
            .rows.length > 0;
        return setStyle("show_more_link", "display", e.has_more || a ? "block" : "none"), i ? (e.section && mail.setSection(e.section), void extend(cur, e)) : void extend(
            cur, e)
    },
    switchSection: function(e) {
        ("search" == cur.section || val("s_search")) && (mail.setSection(e), mail.updateList())
    },
    setSection: function(e) {
        e != cur.section && e && (ge("tab_" + cur.section) && removeClass(ge("tab_" + cur.section), "active_link"), cur.section = e, addClass(ge("tab_" + cur.section),
            "active_link"))
    },
    setFilter: function(e) {
        return cur.filter = e, mail.updateList(), !1
    },
    dec_hash: function(e) {
        ! function(e) {
            cur.decodedHashes[e] = function(e) {
                var i = ge ? "" : "___";
                for (____ = 0; ____ < e.length; ++____) i += e.charAt(e.length - ____ - 1);
                return geByClass ? i : "___"
            }(e.substr(e.length - 5) + e.substr(4, e.length - 12))
        }(e)
    },
    decodehash: function(e) {
        return mail.dec_hash(e), cur.decodedHashes[e]
    },
    checkOver: function(e, i) {
        e.firstChild.className = cur.messChecked[i] ? "over_checked" : "over"
    },
    checkOut: function(e, i) {
        e.firstChild.className = cur.messChecked[i] ? "checked" : ""
    },
    checkSome: function(e, i, a, r, t) {
        if (e && (void 0 === t && (t = r ? a ? "checked" : "" : a ? "over_checked" : "over"), cur.messChecked[i] = a, e.firstChild.className = t), intval(i)) cur.messChecked[
            i] = a;
        else
            for (var o = ge("mail_rows_t"), s = 0; s < o.rows.length; ++s) {
                var c = o.rows[s],
                    l = c.id ? intval(c.id.replace(/^mess/, "")) : 0;
                l && mail.checkSome(c.cells[0], l, a, r, a ? "checked" : "")
            }
    },
    checkChange: function(e, i) {
        cur.lastCheckAct = !1, cur.messChecked[i] ? (mail.checkSome(e, i, ""), intval(i) ? --cur.messCheckedNum : cur.messCheckedNum = 0) : (mail.checkSome(e, i, "1"),
            intval(i) ? ++cur.messCheckedNum : cur.messCheckedNum = ge("mail_rows_t")
            .rows.length), mail.toggleActions()
    },
    updateSummary: function() {
        var e = "";
        e = cur.messCheckedNum ? getLang("mail_X_selected", cur.messCheckedNum) : langNumeric(cur.count, cur.summary), ge("mail_summary")
            .innerHTML = e
    },
    toggleActions: function() {
        mail.updateSummary(), cur.messCheckedNum && !cur.actionsShown ? (show("mail_bar_act"), hide("mail_bar_search")) : !cur.messCheckedNum && cur.actionsShown && (hide(
            "mail_bar_act"), show("mail_bar_search")), cur.actionsShown = cur.messCheckedNum > 0
    },
    showChatMembers: function(e) {
        2e9 >= e || showBox("al_im.php", {
            act: "a_show_members_box",
            chat: e - 2e9,
            from: "mail"
        }, {
            stat: ["boxes.css", "im.css"]
        })
    },
    showForwardedBox: function(e, i, a) {
        showBox("al_im.php", {
            act: "a_show_forward_box",
            id: e,
            ref_id: i,
            hash: a,
            from: "mail"
        }, {
            stat: ["im.css"]
        })
    },
    scrollCheck: function() {
        if (!(browser.mobile || cur.isMailLoading || cur.disableAutoMore)) {
            var e = ge("show_more_link");
            if (isVisible(e)) {
                var i = document.documentElement,
                    a = window.innerHeight || i.clientHeight || bodyNode.clientHeight,
                    r = scrollGetY();
                r + a > e.offsetTop && e.onclick()
            }
        }
    },
    initScrollCheck: function() {
        mail.scrollnode = browser.msie6 ? pageNode : window, window.scrollTop = bodyNode.scrollTop = pageNode.scrollTop = htmlNode.scrollTop = 0, addEvent(mail.scrollnode,
            "scroll", mail.scrollCheck), addEvent(window, "resize", mail.scrollCheck), cur.destroy.push(function() {
            removeEvent(mail.scrollnode, "scroll", mail.scrollCheck), removeEvent(window, "resize", mail.scrollCheck)
        })
    },
    initThread: function(e) {
        hide("header"), cur.thread = {}, mail.applyThreadOptions(e), cur.section = "msg", cur.addMailMedia = null, cur.decodedHashes = {}, cur.listRowsHTML || (cur.listRowsHTML = {}),
            mail.initScrollCheck(), browser.mobile || (autosizeSetup(ge("mail_reply_field"), {
                maxHeight: 300,
                padding: 3
            }), setTimeout(function() {
                !browser.mobile && elfocus("mail_reply_field")
            }, 0)), stManager.add(["page.js", "page.css"], function() {
                cur.addMailMedia = initAddMedia("mail_add_link", "mail_media_preview", e.media_types, {
                    mail: 1
                })
            })
    },
    initWrite: function(e) {
        hide("header"), cur.thread = {}, mail.applyThreadOptions(e), cur.section = "write", cur.addMailMedia = null, cur.decodedHashes = {}, cur.listRowsHTML = {}, mail.initScrollCheck(),
            cur.toPeople = new Autocomplete(ge("mail_to"), "hints.php?act=a_json_friends&from=mail", {
                width: 302,
                maxItems: 29,
                introText: getLang("mail_start_typing"),
                noResult: getLang("mail_not_found"),
                imageId: "to_image",
                placeholder: getLang("mail_choose_recipient"),
                defaultItems: e.friends,
                customSearch: function(e) {
                    return -1 != e.indexOf("@") ? [
                        [clean(e), clean(e), cur.lang.mail_enter_email_address, "/images/pics/contact_info.png", 0, ""]
                    ] : !1
                },
                chooseFirst: function(e) {
                    return -1 != e.indexOf("@")
                },
                placeholderColored: !0,
                autocomplete: !0,
                cacheLength: 1e4,
                multiselect: !0
            }), browser.mobile || (autosizeSetup(ge("mail_write_field"), {
                maxHeight: 300,
                padding: 3
            }), setTimeout(function() {
                !browser.mobile && elfocus("mail_write_field")
            }, 0)), cur.toPeople.showImage = function(e, i) {
                var a = ge(this.options.imageId);
                if (!a) return !1;
                if (void 0 === i) {
                    e || (e = this.resultField.value.split(",")[0]);
                    var r = this._selectedItems.concat(this.currenDataItems);
                    if (r && r.length)
                        for (var t in r)
                            if (r[t] && r[t][0] == e) {
                                i = r[t];
                                break
                            }
                }
                if (void 0 !== i && "string" == typeof i[3] && i[3].length) {
                    if ("none" == i[3]) a.style.display = "none";
                    else if (cur.thread.id != e) {
                        a.style.display = "", a.src = i[3], a.parentNode.href = i[0] > 2e9 ? "/im?sel=c" + (i[0] - 2e9) : i[0] > 0 ? "/id" + i[0] : "/write?email=" + i[0],
                            a.parentNode.setAttribute("target", "_blank"), a.parentNode.target = "_blank";
                        var o = "";
                        i[4] && (o = langSex(1, window.global_online), i[4] > 0 && i[4] < 6 && (o +=
                                '<b class="mob_onl mail_show_mob_onl" onmouseover="mobileOnlineTip(this, {mid: ' + i[0] + '})" onclick="mobilePromo()"></b>'), o =
                            '<div class="mail_envelope_online">' + o + "</div>"), val("to_online", o);
                        var s = getLang("mail_show_history_user")
                            .replace("{user}", i[5]);
                        val("mail_history", '<a id="mail_history_open" href="#" onclick="mail.showHistory(\'' + clean(e) + "'); return false;\">" + s +
                            '</a><div id="mail_history_open_progress"><img src="images/upload.gif" /></div>'), cur.thread.id = e
                    }
                } else a.style.display = "", a.setAttribute("src", "/images/question_100.gif"), a.parentNode.href = "javascript: void(0);", a.parentNode.setAttribute(
                        "target", ""), a.parentNode.target = "", cur.thread.id = 0, ge("to_online")
                    .innerHTML = "", ge("mail_history")
                    .innerHTML = "";
                return !0
            }, stManager.add(["page.js", "page.css"], function() {
                cur.addMailMedia = initAddMedia("mail_add_link", "mail_media_preview", e.media_types, {
                    mail: 1
                }), e.media_type && (cur.chooseMedia = cur.addMailMedia.chooseMedia, cur.chooseMedia(e.media_type, e.media_id, e.media_data))
            })
    },
    init: function(e) {
        if (hide("header"), mail.applyOptions(e, !0), mail.initScrollCheck(), placeholderSetup("s_search"), cur.messCheckedNum = 0, cur.messChecked = {}, cur.actionsShown =
            0, cur.listRowsHTML = {}, cur.module = "mail", cur.hideReferrer = !0, cur.nav.push(function(e, i, a, r) {
                if (void 0 === e[0]) {
                    var t = clone(a);
                    if (delete t[0], "show" == e.act) return mail.showMessage(e.id);
                    if (!a.act) {
                        if ("show" == i.act && !mail.showMsgsList(t, r.back)) return !1;
                        hide("mail_summary_right"), show("mail_summary_progress"), mail.setSection(a.section || "inbox")
                    }
                    return !0
                }
            }), e.left_menu) {
            var i = geByTag1("a", ge("l_msg"));
            i && (i.href = "/mail")
        }
    },
    toggleAll: function() {
        return "all" == cur.lastCheckAct ? mail.toggleNone() : (cur.lastCheckAct = "all", mail.checkSome(!1, 0, "1", !0), cur.messCheckedNum = ge("mail_rows_t")
            .rows.length, mail.toggleActions(), !1)
    },
    toggleNone: function() {
        return cur.lastCheckAct = !1, mail.checkSome(!1, 0, "", !0), cur.messCheckedNum = 0, mail.toggleActions(), !1
    },
    selectRead: function() {
        if ("read" == cur.lastCheckAct) return mail.toggleNone();
        cur.lastCheckAct = "read";
        for (var e = ge("mail_rows_t"), i = 0; i < e.rows.length; ++i) {
            var a = e.rows[i],
                r = a.id ? intval(a.id.replace(/^mess/, "")) : 0;
            if (r) {
                var t = intval(a.getAttribute("read")) ? "1" : "";
                t != (cur.messChecked[r] || "") && (mail.checkSome(a.cells[0], r, t, !0), cur.messCheckedNum += t ? 1 : -1)
            }
        }
        return mail.toggleActions(), !1
    },
    selectUnread: function() {
        if ("new" == cur.lastCheckAct) return mail.toggleNone();
        cur.lastCheckAct = "new";
        for (var e = ge("mail_rows_t"), i = 0; i < e.rows.length; ++i) {
            var a = e.rows[i],
                r = a.id ? intval(a.id.replace(/^mess/, "")) : 0;
            if (r) {
                var t = intval(a.getAttribute("read")) ? "" : "1";
                t != (cur.messChecked[r] || "") && (mail.checkSome(a.cells[0], r, t, !0), cur.messCheckedNum += t ? 1 : -1)
            }
        }
        return mail.toggleActions(), !1
    },
    deleteMsg: function(e) {
        var i = ge("mb" + e),
            a = ge("ma" + e),
            r = ge("mess" + e);
        cur.listRowsHTML[e];
        return r && i && a ? (cur.mail_cached[e].deleted = !0, cur.listRowsHTML[e] = [i.innerHTML, a.innerHTML, r.className], a.innerHTML =
            '<img src="/images/upload.gif" />', ajax.post("al_mail.php", {
                act: "a_delete",
                id: e,
                from: cur.section,
                hash: cur.mark_hash
            }, {
                onDone: function(e, t, o) {
                    r.className = "mail_del_row", i.innerHTML = t, a.innerHTML = o, cur.offset--
                }
            }), cur.mail_cached[e].unread && (cur.new_msg--, mail.updateUnread()), cur.count--, void mail.updateSummary()) : !1
    },
    reportMsg: function(e, i) {
        var a = ge("mb" + e),
            r = ge("ma" + e),
            t = ge("mess" + e),
            o = cur.listRowsHTML[e];
        return t && a && r ? ("mail_del_row" == t.className || o || (cur.listRowsHTML[e] = [a.innerHTML, r.innerHTML, t.className]), r.innerHTML =
            '<img src="/images/upload.gif" />', a.innerHTML = "", cur.mail_cached[e].unread && !cur.mail_cached[e].deleted && (cur.new_msg--, mail.updateUnread()),
            "spam" == cur.section ? cur.count++ : cur.mail_cached[e].deleted || cur.count--, mail.updateSummary(), void ajax.post("al_mail.php", {
                act: "a_report_spam",
                id: e,
                from: cur.section,
                del: i,
                hash: cur.mark_hash
            }, {
                onDone: function(i, s, c) {
                    "spam" == cur.section ? (cur.mail_cached[e].deleted = !1, a.innerHTML = o[0], r.innerHTML = o[1], t.className = o[2], cur.mail_cached[e].deleted ||
                        cur.offset++) : (cur.mail_cached[e].deleted = !0, t.className = "mail_spam_row", a.innerHTML = s, r.innerHTML = c, cur.mail_cached[
                        e].deleted || cur.offset--)
                }
            })) : !1
    },
    restoreMsg: function(e) {
        var i = ge("mb" + e),
            a = ge("ma" + e),
            r = ge("mess" + e),
            t = cur.listRowsHTML[e];
        return r && i && a ? (cur.mail_cached[e].deleted = !1, i.innerHTML = '<img src="/images/upload.gif" />', a.innerHTML = "", ajax.post("al_mail.php", {
            act: "a_restore",
            id: e,
            from: cur.section,
            hash: cur.mark_hash
        }, {
            onDone: function() {
                i.innerHTML = t[0], a.innerHTML = t[1], r.className = t[2], cur.offset++
            }
        }), cur.mail_cached[e].unread && (cur.new_msg++, mail.updateUnread()), cur.count++, void mail.updateSummary()) : !1
    },
    restoreSpamMsg: function(e, i, a) {
        var r = "inbox" == cur.section && (i || 32784 & intval(a)),
            t = ge("mb" + e),
            o = ge("ma" + e),
            s = ge("mess" + e),
            c = cur.listRowsHTML[e];
        return s && t && o ? ("mail_spam_row" == s.className || c || (cur.listRowsHTML[e] = [t.innerHTML, o.innerHTML, s.className]), "spam" == cur.section || r ? (o.innerHTML =
            '<img src="/images/upload.gif" />', cur.mail_cached[e].deleted = !0) : (t.innerHTML = '<img src="/images/upload.gif" />', cur.mail_cached[e].deleted = !
            1), ajax.post("al_mail.php", {
            act: "a_restore_spam",
            id: e,
            from: r ? "spam" : cur.section,
            hash: cur.mark_hash
        }, {
            onDone: function(e, i, a) {
                "spam" == cur.section || r ? (t.innerHTML = i, o.innerHTML = a, cur.offset--) : (t.innerHTML = c[0], o.innerHTML = c[1], s.className = c[2],
                    cur.offset++)
            }
        }), void(r || (cur.count += intval("spam" == cur.section ? -1 : 1), "spam" != cur.section && cur.mail_cached[e].unread && (cur.new_msg++, mail.updateUnread()),
            mail.updateSummary()))) : !1
    },
    markMsgs: function(e, i) {
        if (e && "0" != e && !cur.isMarking) {
            var a = [];
            each(cur.messChecked, function(e, i) {
                return i && e && (a.push(e), a.length > 100) ? !1 : void 0
            });
            var r = mail.updateList,
                t = new callHub(function() {
                    mail.scrollCheck(), mail.updateSummary(), ge("mail_rows_t")
                        .rows.length || nav.go("/mail")
                }, 2);
            ajax.post("mail?act=a_mark", {
                mark: e,
                msgs_ids: a.join(","),
                hash: cur.mark_hash
            }, {
                onDone: function(e, i) {
                    e || r(), mail.checkSome(!1, 0, "", !0), cur.messCheckedNum = 0, mail.toggleActions(), t.done(), cur.new_msg = i, mail.updateUnread()
                },
                onFail: r,
                showProgress: function() {
                    lockButton(i), cur.isMarking = !0
                },
                hideProgress: function() {
                    unlockButton(i), cur.isMarking = !1
                }
            }), "del" == e || "new" == e && "read" == cur.filter || "read" == e && "new" == cur.filter ? (each(a, function(e, i) {
                var a = ge("mess" + i);
                a && (a.parentNode.removeChild(a), cur.offset--, cur.count--, cur.mail_cached[i].unread && cur.new_msg--, delete cur.mail_cached[i], t.done())
            }), mail.updateSummary()) : each(a, function(i, a) {
                var r = ge("mess" + a);
                r && (r.className = "new" == e ? "new_msg" : "", r.setAttribute("read", "new" == e ? "" : "1"), cur.mail_cached[a].unread && "read" == e ? (cur.new_msg--,
                        "new" == cur.filter && cur.count--) : cur.mail_cached[a].unread || "new" != e || (cur.new_msg++, "new" == cur.filter && cur.count++),
                    cur.mail_cached[a].unread = "new" == e)
            }), mail.updateSummary(), mail.updateUnread()
        }
    },
    deleteAllSpamMessages: function(e) {
        var i = function() {
                ajax.post("/al_mail.php", {
                    act: "a_flush_spam",
                    hash: e
                }, {
                    onDone: function() {
                        a.hide()
                    }
                })
            },
            a = showFastBox(getLang("mail_deleteall1"), getLang("mail_delete_all_spam"), getLang("mail_delete"), i, getLang("mail_close"), r),
            r = function() {
                a.hide()
            }
    },
    deleteAllHistory: function(e, i) {
        var a = function() {
                ajax.post("/al_im.php", {
                    act: "a_flush_history",
                    hash: i,
                    id: e
                }, {
                    onDone: function() {
                        r.hide()
                    }
                })
            },
            r = showFastBox(getLang("mail_deleteall1"), getLang("mail_sure_to_delete_all"), getLang("mail_delete"), a, getLang("mail_close"), t),
            t = function() {
                r.hide()
            }
    },
    list_actions: {
        "delete": "deleteMsg",
        report_spam: "reportMsg",
        restore_spam: "restoreSpamMsg"
    },
    actShowMsg: function(e, i) {
        return mail.showMsgsList(!1, !0) === !1 && mail[mail.list_actions[e]](i, !0) !== !1 ? !1 : (nav.go({
            0: "mail",
            act: "a_" + (e || "delete"),
            id: i,
            from: "msg",
            hash: cur.mark_hash || cur.thread.mark_hash
        }), ge("mail_envelope_actions") && (ge("mail_envelope_actions")
            .innerHTML = '<img src="/images/upload.gif" />'), !1)
    },
    deleteHistMsg: function(e) {
        var i = ge("ma" + e),
            a = ge("mess" + e);
        return a && i ? (i.innerHTML = '<img src="/images/upload.gif" />', void ajax.post("al_mail.php", {
            act: "a_delete",
            id: e,
            from: "history",
            hash: cur.mark_hash || cur.thread.mark_hash
        }, {
            onDone: function(e, r) {
                addClass(a, "mail_del_row"), i.innerHTML = r
            }
        })) : !1
    },
    restoreHistMsg: function(e) {
        var i = ge("ma" + e),
            a = ge("mess" + e);
        return a && i ? (i.innerHTML = '<img src="/images/upload.gif" />', void ajax.post("al_mail.php", {
            act: "a_restore",
            id: e,
            from: "history",
            hash: cur.mark_hash || cur.thread.mark_hash
        }, {
            onDone: function(e, r) {
                removeClass(a, "mail_del_row"), i.innerHTML = r
            }
        })) : !1
    },
    histHeadState: function(e) {
        setStyle("mail_history_full", "visibility", e ? "visible" : "hidden")
    },
    histMessState: function(e, i) {
        setStyle("ma" + i, "visibility", e ? "visible" : "hidden")
    }
};
try {
    stManager.done("mail.js")
} catch (e) {}
