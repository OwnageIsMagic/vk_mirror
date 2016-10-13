var AppsCheck = {
    init: function() {
        extend(cur, {
            aTabs: ge("apps_tabs"),
            aSubTabs: ge("apps_subtabs")
        }), uiTabs.hideProgress(cur.aTabs), uiTabs.hideProgress(cur.aSubTabs), "reports" != cur.section && val("tab_counter_" + cur.section, cur.totalCount && cur.totalCount <
            100 ? cur.totalCount : ""), cur.nav.push(function(e, t, n) {
            return void 0 === e[0] && e.act ? (this.switchSection(n.act), !1) : void 0
        }.bind(this)), "comments" == cur.section && (each(geByTag("textarea", ge("apps_check_content")), function() {
            placeholderSetup(this, {
                back: !0
            })
        }), removeEvent(document, "click", this.hideEditPostReply), addEvent(document, "click", this.hideEditPostReply))
    },
    switchNavTab: function(e, t, n) {
        if (e != cur.section) {
            var o = ge("nav_tab_" + e);
            if (o) {
                var a = geByClass("app_tab_selected", ge("apps_nav_tabs"));
                for (var s in a) a[s].className = "app_tab";
                o.className = "app_tab_selected"
            }
            return show("apps_check_progress"), nav.change({
                act: e
            }), !1
        }
    },
    switchSection: function(act) {
        ajax.post("apps_check", {
            act: act,
            load: 1
        }, {
            onDone: function(content, script, summary, title, nav_tabs) {
                if (hide("apps_check_progress"), ge("apps_check_content")
                    .innerHTML = content, script) try {
                    eval(script)
                } catch (e) {
                    console.error(e.stack), console.log(script)
                }
                summary && (ge("apps_summary")
                    .innerHTML = summary), title && (document.title = replaceEntities(stripHTML(title))), nav_tabs ? (ge("apps_nav_tabs")
                    .innerHTML = nav_tabs, show("apps_nav_tabs")) : (ge("apps_nav_tabs")
                    .innerHTML = "", hide("apps_nav_tabs")), AppsCheck.hideError(), "requests" != act ? extend(nav.objLoc, {
                    act: act
                }) : delete nav.objLoc.act, delete nav.objLoc.mid, delete nav.objLoc.offset, nav.setLoc(nav.objLoc);
                var box = curBox();
                box && box.hide()
            },
            onFail: AppsCheck.showError
        })
    },
    showError: function(e) {
        hide("apps_check_progress");
        var t = ge("apps_check_error");
        return show("apps_check_error_wrap"), cur.errorShown = !0, t.innerHTML = e, scrollToTop(200), !0
    },
    hideError: function() {
        cur.errorShown && (hide("apps_check_error_wrap"), cur.errorShown = !1)
    },
    changeSummary: function() {
        var e = ge("apps_summary");
        if ("blocked" == cur.section || "requests" == cur.section || "comments" == cur.section || "reports" == cur.section) {
            var t = cur.totalCount ? langNumeric(cur.totalCount, cur.summaryLang.n_requests, !0) : cur.summaryLang.no_requests;
            if (cur.editAnswers && (t += cur.editAnswers), "reports" == cur.section) {
                var n = cur.all_reports ? cur.summaryLang.unverified_apps : cur.summaryLang.all_apps;
                t += '<span class="divider">|</span><span class="app_check_actions"><a href="#" onclick="AppsCheck.switchReports(); return false;">' + n + "</a></span>"
            }
            e.innerHTML = t, ge("tab_counter_" + cur.section) && (ge("tab_counter_" + cur.section)
                .innerHTML = cur.tabCount ? "+" + cur.tabCount : "", toggleClass(ge("tab_" + cur.section), "count", !!cur.tabCount))
        }
    },
    changeAutoAnswer: function(e) {
        var t = unclean(cur.autoanswers[e]);
        if ("comments" == cur.section) {
            if (cur.editing) {
                var n = ge("reply_field" + cur.editing);
                n.value = t, n.focus()
            }
        } else ge("decline_comment")
            .value = t
    },
    actsOver: function(e) {
        if (vk.id) {
            var t = ge("actions" + e);
            t && (t.timeout ? (clearTimeout(t.timeout), removeAttr(t, "timeout")) : fadeIn(t, 200))
        }
    },
    actsOut: function(e) {
        if (vk.id) {
            var t = ge("actions" + e);
            t && (t.timeout = setTimeout(function() {
                removeAttr(t, "timeout"), fadeOut(t, 200)
            }, 1))
        }
    },
    declineRequest: function(e, t) {
        return t = t || "", !showBox("apps_check", {
            act: "decline_box",
            aid: e,
            from: cur.section,
            platform: t
        }, {
            cache: 1,
            params: {
                width: "500px"
            }
        })
    },
    doDeclineRequest: function(e, t, n) {
        cur.deletingRequest || (cur.deletingRequest = !0, t.showProgress(), n = n || "", ajax.post("apps_check", {
            act: "reports" == cur.section ? "disable" : "a_decline_request",
            aid: e,
            rule: cur.selectedRules,
            platform: n,
            comment: ge("decline_comment")
                .value,
            hash: cur.hashes.decline_hash,
            do_return: isChecked("return_check")
        }, {
            onDone: function(n, o) {
                delete cur.deletingRequest, t && t.hide(), o && setTimeout(showFastBox({
                        title: n
                    }, o, getLang("global_close"))
                    .hide, 2e3), slideUp(ge("app" + e), 200, function() {
                    if (re("app" + e), cur.totalCount--, cur.tabCount--, AppsCheck.changeSummary(), !cur.totalCount) {
                        var t = cur.summaryLang.no_requests_msg;
                        ge("apps_check_content")
                            .innerHTML = '<div class="no_rows" id="no_apps">' + t + "</div>"
                    }
                })
            },
            onFail: function() {
                delete cur.deletingRequest, t && t.hide()
            }
        }))
    },
    approveRequest: function(e, t) {
        return t = t || "", !showBox("apps_check", {
            act: "approve_box",
            aid: e,
            platform: t
        }, {
            cache: 1
        })
    },
    changeType: function(e, t, n) {
        t.innerHTML = '<img src="/images/upload.gif" />';
        var o = {
            act: "change_type",
            aid: e,
            hash: cur.hashes.approve_hash
        };
        n && (o.new_type = n), ajax.post("apps_check", o, {
            onDone: function(e) {
                t.innerHTML = e
            }
        })
    },
    doApproveRequest: function(e, t, n) {
        cur.approvingRequest || (cur.approvingRequest = !0, t.showProgress(), n = n || "", ajax.post("apps_check", {
            act: "a_approve_request",
            aid: e,
            hash: cur.hashes.approve_hash,
            platform: n
        }, {
            onDone: function() {
                delete cur.approvingRequest, t && t.hide(), slideUp(ge("app" + e), 200, function() {
                    if (re("app" + e), cur.totalCount--, cur.tabCount--, AppsCheck.changeSummary(), !cur.totalCount) {
                        var t = cur.summaryLang.no_requests_msg;
                        ge("apps_check_content")
                            .innerHTML = '<div class="no_rows" id="no_apps">' + t + "</div>"
                    }
                })
            },
            onFail: function() {
                delete cur.approvingRequest, t && t.hide()
            }
        }))
    },
    showReplies: function(e, t, n, o) {
        buttonLocked(o) || (lockButton(o), ajax.post("apps_check", {
            act: "a_get_comments",
            id: e,
            count: t,
            comments_only: n,
            from: cur.section,
            hash: cur.hashes.comments_hash
        }, {
            cache: 1,
            onDone: function(t) {
                val("app_comments" + e, t)
            },
            onFail: unlockButton.pbind(o)
        }))
    },
    hideRow: function(e) {
        slideUp(ge("app" + e), 200, function() {
            if (re("app" + e), cur.totalCount--, cur.tabCount--, AppsCheck.changeSummary(), !cur.totalCount) {
                var t = cur.summaryLang.no_requests_msg;
                ge("apps_check_content")
                    .innerHTML = '<div class="no_rows" id="no_apps">' + t + "</div>"
            }
        }), ajax.post("apps_check", {
            act: "a_hide_comment",
            id: e,
            hash: cur.hashes.hide_row_hash
        })
    },
    showEditReply: function(e) {
        var t = ge("reply_field" + e);
        return cur.editing === e ? void elfocus(t) : (autosizeSetup(t, {
                minHeight: 32
            }), this.hideEditPostReply(), show("replies_wrap" + e, "comm_answers" + e), hide("reply_link" + e), ge("reply_button" + e)
            .onclick = this.sendReply.pbind(e), cur.editing = e, void elfocus(t))
    },
    hideEditPostReply: function(e) {
        if (cur.editing !== !1 && !isVisible(boxLayerBG) && !isVisible(layerBG)) {
            var t = e && e.target ? e.target : {},
                n = t.id;
            if (cur.editing && (!e || !hasClass(t, "reply_link") && n != "reply_field" + cur.editing && "reply_to_link" != t.className)) {
                var o = cur.editing;
                cur.editing = !1;
                var a = ge("reply_field" + o),
                    s = trim(val(a));
                if (browser.opera_mobile || browser.safari_mobile || s) return;
                hide("comm_answers" + o);
                var c = ge("reply_link" + o);
                c && (show(c), hide("replies_wrap" + o)), a.blur(), a.active || setStyle(a, {
                    height: 14
                }), a.phonblur && a.phonblur()
            }
        }
    },
    checkTextLen: function(e, t, n) {
        var o = trim(e.value)
            .replace(/\n\n\n+/g, "\n\n");
        if (e.lastLen !== o.length || n) {
            var a = e.lastLen = o.length,
                s = cur.options.max_post_len,
                c = a - o.replace(/\n/g, "")
                .length;
            t = ge(t), a > s - 100 || c > 4 ? (show(t), a > s ? t.innerHTML = getLang("global_recommended_exceeded", a - s) : c > 4 ? t.innerHTML = getLang(
                "global_recommended_lines", c - 4) : t.innerHTML = getLang("text_N_symbols_remain", s - a)) : hide(t)
        }
    },
    sendReply: function(e) {
        ajax.post("apps_check", {
            act: "a_post_comment",
            id: e,
            msg: ge("reply_field" + e)
                .getValue(),
            hash: cur.hashes.post_comment_hash
        }, {
            onDone: function(t) {
                var n = ge("reply_field" + e);
                n.value = "", n.blur(), n.phonblur(), AppsCheck.hideEditPostReply(), hide("reply_warn" + e), ge("app_comments" + e)
                    .innerHTML += t
            },
            showProgress: function() {
                lockButton(ge("reply_button" + e))
            },
            hideProgress: function() {
                unlockButton(ge("reply_button" + e))
            }
        })
    },
    getCommentsPage: function(e) {
        return ajax.post("apps_check", {
            act: cur.section,
            mid: cur.mid,
            offset: e,
            load: 1
        }, {
            cache: 1,
            onDone: function(t, n, o) {
                t && (ge("apps_check_content")
                    .innerHTML = t, o && (ge("apps_summary")
                        .innerHTML = o), nav.setLoc(extend(nav.objLoc, {
                        offset: e
                    })))
            },
            showProgress: function() {
                show("apps_check_progress"), show("page_bottom_progress")
            },
            hideProgress: function() {
                hide("apps_check_progress"), hide("page_bottom_progress")
            }
        }), !1
    },
    startCheck: function(e, t, n, o) {
        cur.shownApp && this.finishCheck(cur.shownApp), o && buttonLocked(o) || (lockButton(o), cur.shownApp = e, ajax.post("apps_check", {
            act: "start_check",
            uid: cur.viewer_id,
            app_id: e,
            hash: cur.hashes.check_hash
        }, {
            onDone: function(a) {
                if (unlockButton(o), a.length) showFastBox({
                    onHide: AppsCheck.finishCheck.bind(AppsCheck, e)
                }, a, getLang("global_cancel"));
                else {
                    var s, c = window,
                        r = document.documentElement;
                    if (c.pageNode) {
                        var i = Math.max(intval(c.innerHeight), intval(r.clientHeight)) - 200;
                        s = Math.min(n, i)
                    } else s = n;
                    showFastBox({
                            width: t + sbWidth() + 1,
                            bodyStyle: "padding: 0px;",
                            onHide: AppsCheck.finishCheck.bind(AppsCheck, e)
                        }, '<iframe src="app' + e + '?check=1" style="vertical-align: top;width: 100%; height: ' + s +
                        'px; border: none; overflow-x: hidden" frameborder="0" />', getLang("global_cancel"))
                }
            }
        }))
    },
    startCheckStandalone: function(e, t, n) {
        cur.shownApp && this.finishCheck(cur.shownApp), cur.shownApp = e, showBox("apps_check", {
            act: "start_check",
            app_id: e,
            platform: t,
            uid: cur.viewer_id,
            hash: cur.hashes.check_hash
        }, {
            params: {
                width: "400px",
                bodyStyle: "padding: 20px; line-height: 160%;",
                dark: 1,
                onHide: function() {
                    AppsCheck.finishCheck(e)
                }
            }
        })
    },
    finishCheck: function(e) {
        ajax.post("apps_check", {
            act: "finish_check",
            uid: cur.viewer_id,
            hash: cur.hashes.check_hash
        }, {
            onDone: function(t) {
                cur.shownApp == e && delete cur.shownApp
            }
        })
    },
    toBlackList: function(e, t) {
        cur.addingToBlacklist || (cur.addingToBlacklist = !0, ajax.post("apps_check", {
            act: "to_blacklist",
            id: e,
            hash: cur.hashes.blacklist_hash
        }, {
            onDone: function(e) {
                delete cur.addingToBlacklist, e && (ge("actions" + t)
                    .innerHTML = e)
            }
        }))
    },
    uncomplainApp: function(e) {
        cur.box = showFastBox("", cur.summaryLang.uncomplain_text, cur.summaryLang.uncomplain_ok, function() {
            AppsCheck.doUncomplainApp(e)
        }, getLang("global_cancel"))
    },
    doUncomplainApp: function(e) {
        var t = curBox();
        t.showProgress(), ajax.post("apps_check", {
            act: "uncomplain",
            id: e,
            hash: cur.hashes.uncomplain_hash
        }, {
            onDone: function(n, o) {
                t.hide(), setTimeout(showFastBox({
                        title: n
                    }, o, getLang("global_close"))
                    .hide, 2e3), slideUp(ge("app" + e), 200, function() {
                    if (re("app" + e), cur.totalCount--, cur.tabCount--, AppsCheck.changeSummary(), !cur.totalCount) {
                        var t = cur.summaryLang.no_requests_msg;
                        ge("apps_check_content")
                            .innerHTML = '<div class="no_rows" id="no_apps">' + t + "</div>"
                    }
                })
            }
        })
    },
    editAutoanswers: function() {
        return !showBox("apps_check", {
            act: "edit_autoanswers_box",
            from: cur.section
        }, {})
    },
    removeAutoanswer: function(e) {
        cur.removingAutoAnswer || (cur.removingAutoAnswer = !0, ajax.post("apps_check", {
            act: "a_delete_autoanswer",
            id: e,
            hash: cur.hashes.autoanswers_hash
        }, {
            onDone: function(t) {
                delete cur.removingAutoAnswer, cur.deletedAutoanswers || (cur.deletedAutoanswers = []), cur.deletedAutoanswers[e] = ge("autoanswer_row" + e)
                    .innerHTML, t && (ge("autoanswer_row" + e)
                        .innerHTML = t)
            },
            onFail: function() {
                delete cur.removingAutoAnswer
            },
            showProgress: function() {
                curBox()
                    .showProgress()
            },
            hideProgress: function() {
                curBox()
                    .hideProgress()
            }
        }))
    },
    restoreAutoanswer: function(e) {
        cur.restoringAutoAnswer || (cur.restoringAutoAnswer = !0, ajax.post("apps_check", {
            act: "a_restore_autoanswer",
            id: e,
            hash: cur.hashes.autoanswers_hash
        }, {
            onDone: function() {
                delete cur.restoringAutoAnswer, cur.deletedAutoanswers && cur.deletedAutoanswers[e] && (ge("autoanswer_row" + e)
                    .innerHTML = cur.deletedAutoanswers[e], delete cur.deletedAutoanswers[e])
            },
            onFail: function() {
                delete cur.restoringAutoAnswer
            },
            showProgress: function() {
                curBox()
                    .showProgress()
            },
            hideProgress: function() {
                curBox()
                    .hideProgress()
            }
        }))
    },
    editAutoanswer: function(e) {
        if (!cur.editingAutoAnswer) {
            cur.editingAutoAnswer = !0;
            var t = ge("answer_content" + e)
                .value;
            ajax.post("apps_check", {
                act: "a_edit_autoanswer",
                from: cur.section,
                id: e,
                text: t,
                hash: cur.hashes.autoanswers_hash
            }, {
                onDone: function(n) {
                    delete cur.editingAutoAnswer, slideUp("edit_autoanswer" + e, 200, function() {
                        cur.autoanswers[e] = t, n && (curBox()
                            .bodyNode.innerHTML = n, placeholderSetup("add_answer_text", {
                                back: !0
                            }), placeholderSetup("add_answer_label", {
                                back: !0
                            }))
                    })
                },
                onFail: function() {
                    delete cur.editingAutoAnswer
                },
                showProgress: function() {
                    curBox()
                        .showProgress()
                },
                hideProgress: function() {
                    curBox()
                        .hideProgress()
                }
            })
        }
    },
    addAutoanswer: function(e) {
        if (!cur.addingAutoAnswer) {
            var t = ge("add_answer_label")
                .value,
                n = ge("add_answer_text")
                .value;
            if (!t || !n) {
                var o = t ? ge("add_answer_text") : ge("add_answer_label");
                return notaBene(o), void o.focus()
            }
            cur.addingAutoAnswer = !0, ajax.post("apps_check", {
                act: "a_add_autoanswer",
                from: cur.section,
                name: t,
                text: n,
                hash: cur.hashes.autoanswers_hash
            }, {
                onDone: function(e, t) {
                    delete cur.addingAutoAnswer, slideUp("edit_autoanswer0", 200, function() {
                        cur.autoanswers[t] = n, e && (curBox()
                            .bodyNode.innerHTML = e, placeholderSetup("add_answer_text", {
                                back: !0
                            }), placeholderSetup("add_answer_label", {
                                back: !0
                            }))
                    })
                },
                onFail: function() {
                    delete cur.addingAutoAnswer
                },
                showProgress: function() {
                    curBox()
                        .showProgress()
                },
                hideProgress: function() {
                    curBox()
                        .hideProgress()
                }
            })
        }
    },
    cancelAutoanswer: function(e) {
        slideUp("edit_autoanswer" + e, 200, function() {
            cur.autoanswers[e] ? ge("answer_content" + e) && (ge("answer_content" + e)
                .value = unclean(cur.autoanswers[e])) : ge("answer_content" + e) && (ge("answer_content" + e)
                .value = "")
        })
    },
    switchReports: function() {
        show("apps_check_progress"), ajax.post("apps_check", {
            act: "reports",
            all: 1 - cur.all_reports,
            load: 1
        }, {
            onDone: function(content, script, summary, title) {
                hide("apps_check_progress"), ge("apps_check_content")
                    .innerHTML = content, script && eval(script), summary && (ge("apps_summary")
                        .innerHTML = summary), title && (document.title = replaceEntities(stripHTML(title))), AppsCheck.hideError()
            },
            onFail: AppsCheck.showError
        })
    },
    addCollection: function() {
        return !showBox("/apps_check", {
            act: "edit_collection_box"
        }, {
            params: {
                width: 550
            }
        })
    },
    editCollection: function(e) {
        return !showBox("/apps_check", {
            act: "edit_collection_box",
            collection_id: e
        }, {
            params: {
                width: 550
            }
        })
    },
    updateCollections: function(html, script) {
        var list = ge("apps_collection_rows");
        list && list.sorter && list.sorter.destroy(), html && (ge("apps_check_content")
            .innerHTML = html), script && eval(script), AppsCheck.toggleCollections(ge("apps_toggle_collections"), !!cur.onlyEnabled)
    },
    saveCollection: function(e, t) {
        var n = curBox();
        if (n && !isVisible(n.progress)) {
            if (!val("apps_check_collection_title")) return void notaBene("apps_check_collection_title");
            var o = {
                act: "a_save_collection",
                collection_id: e,
                hash: t,
                title: val("apps_check_collection_title"),
                language: cur.languageDD.val(),
                sex: window.radioBtns.sex.val,
                min_age: cur.minAgeDD.val(),
                max_age: cur.maxAgeDD.val()
            };
            ajax.post("/apps_check", o, {
                onDone: function(e, t) {
                    AppsCheck.updateCollections(e, t), n.hide()
                },
                onFail: function(e) {
                    return ge("apps_collection_error")
                        .innerHTML = e, show("apps_collection_error"), !0
                },
                showProgress: n.showProgress,
                hideProgress: n.hideProgress
            })
        }
    },
    toggleCollections: function(e, t) {
        var n = ge("apps_collection_rows");
        n && n.sorter && n.sorter.destroy(), window.tooltips && tooltips.hideAll(), toggleClass(n, "no_disabled", t);
        var o = 0,
            a = geByClass("apps_collection_row_wrap", n);
        for (var s in a) {
            setStyle(a[s], {
                zIndex: null,
                left: null,
                top: null,
                width: null,
                cursor: null
            });
            var c = !t || !hasClass(a[s], "disabled");
            c && o++, c ? a[s].removeAttribute("skipsort") : a[s].setAttribute("skipsort", 1)
        }
        return cur.onlyEnabled = t, e.innerHTML = t ? getLang("apps_all_collections") : getLang("apps_only_enabled_collections"), toggle("no_apps", !o), !1
    },
    deleteCollection: function(e, t) {
        return !showFastBox({
            title: getLang("apps_delete_collection_title"),
            dark: 1,
            bodyStyle: "padding: 20px; linne-height: 140%;"
        }, getLang("apps_delete_collection_confirm"), getLang("global_delete"), function(n) {
            ajax.post("/apps_check", {
                act: "a_delete_collection",
                collection_id: e,
                hash: t
            }, {
                onDone: function(e, t) {
                    AppsCheck.updateCollections(e, t), curBox()
                        .hide()
                },
                showProgress: lockButton.pbind(n),
                hideProgress: unlockButton.pbind(n)
            })
        }, getLang("global_cancel"))
    },
    enableCollection: function(e, t, n) {
        ajax.post("/apps_check", {
            act: "a_enable_collection",
            collection_id: e,
            enable: t,
            hash: n
        }, {
            onDone: AppsCheck.updateCollections
        })
    },
    addCollectionApp: function() {
        var e = val(cur.aSearch);
        return e ? void showBox("apps_check", {
            act: "add_collection_app_box",
            lnk: e,
            id: intval(cur.listId)
        }, {
            onFail: function(e) {
                return showDoneBox(e), notaBene(cur.aSearch), !0
            }
        }) : notaBene(cur.aSearch)
    },
    removeCollectionApp: function(e, t, n, o) {
        o && cancelEvent(o), ajax.post("apps_check", {
            act: "a_remove_from_collection",
            id: e,
            edit: 1,
            aid: t,
            hash: n
        }, {
            onDone: function(e) {
                var t = ge("apps_list_content");
                t.sorter && t.sorter.destroy(), t.innerHTML = e, cur.sorter && geByClass("apps_cat_row", ge("apps_search_content"))
                    .length && (cur.sorter = qsorter.init("apps_search_content", {
                        onReorder: cur.reorderApps,
                        xsize: 5,
                        width: 154,
                        height: 226
                    }))
            },
            onFail: function(e) {
                return showDoneBox(e), !0
            }
        })
    },
    addFeatured: function() {
        var e = val(cur.input);
        return e ? void showBox("apps_check", {
            act: "add_featured_box",
            lnk: e
        }, {
            onFail: function() {
                return notaBene(cur.input), !0
            }
        }) : notaBene(cur.input)
    },
    actFeatured: function(e, t, n, o, a, s) {
        var c = t.innerHTML;
        t.innerHTML = '<img src="/images/upload.gif" />', ajax.post("apps_check", {
            act: "a_" + e + "_featured",
            aid: n,
            hash: o
        }, {
            onDone: function(e) {
                2 == s ? uiTabs.goTab(domFC(ge("subtab_featured"))) : s ? nav.reload() : (a || t)
                    .innerHTML = e
            },
            onFail: function(e) {
                return t.innerHTML = c, setTimeout(showFastBox(getLang("global_error"), e)
                    .hide, __debugMode ? 3e4 : 3e3), !0
            }
        })
    },
    showStat: function(aid, type, obj) {
        var hideStat = obj.getAttribute("stat");
        hideStat ? (obj.innerHTML = hideStat, hide("apps_check_" + aid + "_graph"), obj.setAttribute("stat", "")) : (obj.setAttribute("stat", obj.innerHTML), obj.innerHTML =
            '<img src="/images/upload.gif"/>', ajax.post("apps_check", {
                act: "a_featured_stat",
                aid: aid
            }, {
                onDone: function(html, js, hideText) {
                    ge("apps_check_" + aid + "_graph")
                        .innerHTML = html, eval(js), obj.innerHTML = hideText, show("apps_check_" + aid + "_graph")
                }
            }))
    },
    showAdsStat: function(e) {
        var t = {};
        t.app_id = e;
        var n = {
            params: {}
        };
        n.cache = 1, showBox("/apps_check?act=ads_stat", t, n)
    },
    _eof: 1
};
try {
    stManager.done("apps_check.js")
} catch (e) {}
