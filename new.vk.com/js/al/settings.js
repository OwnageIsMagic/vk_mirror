var Settings = {
    MAX_LEFT_GROUPS: 5,
    go: function(e, t) {
        var s = Settings.getsect(),
            o = checkEvent(t);
        return o === !1 && (s.className = "", e.parentNode.className = "active_link"), nav.go(e, t)
    },
    getsect: function() {
        for (var e = ge("settings_filters")
                .firstChild; !hasClass(e, "active_link");) e = e.nextSibling;
        return e
    },
    showMsg: function(e, t) {
        t || (t = ge("settings_result")), e ? (showMsg(t, e, "ok_msg", !0), show(t)) : hide(t), scrollToTop(0)
    },
    showError: function(e, t) {
        e = e || getLang("global_unknown_error");
        var s = t ? ge("settings_error_" + t) : ge("settings_result");
        showMsg(s, e, "error", !0), show(s), t || scrollToTop(0)
    },
    toggleBlock: function(e, t) {
        if (e && e.target) {
            var s = e.target;
            o = hasClass(s, "settings_line") ? s : gpeByClass("settings_line", s)
        } else {
            e = ge(e);
            var s = geByClass1("settings_right_control", e),
                o = hasClass(e, "settings_line") ? e : gpeByClass("settings_line", e)
        }
        o && geByClass1("settings_change_block", o) && (!hasClass(o, "unfolded") || hasClass(s, "settings_right_control")) && (cur.changingSetting && cur.changingSetting !=
            o && (removeClass(cur.changingSetting, "unfolded"), window.tooltips && tooltips.hideAll()), toggleClass(o, "unfolded"), cur.changingSetting = o, t &&
            elfocus(t))
    },
    savePrivacyKey: function(e) {
        if ("friends" == e) return void(window.uiPageBlock && uiPageBlock.showSaved("privacy_friends_hide"));
        var t, s = {
            key: e,
            val: Privacy.getValue(e),
            hash: cur.options.hash
        };
        if ("search_access" == e || "updates" == e) {
            if ("updates" == e) {
                var o = Privacy.getValue(e);
                if ("0" != o.substr(0, 1)) {
                    var n = o.substr(2);
                    n.length || (ge("privacy_header")
                        .innerHTML = ge("privacy_edit_updates")
                        .innerHTML = getLang("settings_updates_no_news"))
                }
            }
            t = "al_settings.php", s.act = "a_save_special"
        } else t = "al_friends.php", s.act = "save_privacy";
        clearTimeout(cur["privacy_timer_" + e]), cur["privacy_timer_" + e] = setTimeout(ajax.post.pbind(t, s, {
            onDone: window.uiPageBlock && uiPageBlock.showSaved.pbind("privacy_edit_" + e)
        }), 500)
    },
    initPrivacy: function() {
        cur.onPrivacyChanged = Settings.savePrivacyKey
    },
    initSearchBox: function(e, t, s) {
        extend(cur, t), s && ajax.preload(cur.searchBoxAddress, cur.searchBoxParams, s), window.uiScrollBox && uiScrollBox.init(e, {
            onShow: function() {
                addEvent(boxLayerWrap, "scroll", Settings.boxScrollResize), setTimeout(Settings.boxScrollResize, 0)
            },
            onHide: function() {
                removeEvent(boxLayerWrap, "scroll", Settings.boxScrollResize)
            }
        }), addEvent(boxLayerWrap, "scroll", Settings.boxScrollResize), Settings.boxScrollResize()
    },
    boxScrollResize: function() {
        if (!browser.mobile) {
            var e = lastWindowHeight,
                t = ge(cur.boxMoreLink);
            t && isVisible(t) && e > getXY(t, !0)[1] && cur.boxShowMore()
        }
    },
    moreSearchBoxLoaded: function(e, t, s) {
        cur.searchBoxParams.offset = t;
        for (var o = cur.boxRows, n = ce("div", {
                innerHTML: e
            }); n.firstChild;) o.appendChild(n.firstChild);
        toggle(cur.boxMoreLink, s), s && (cur.loading = 1, ajax.post(cur.searchBoxAddress, cur.searchBoxParams, {
            onDone: function() {
                2 == cur.loading ? Settings.moreSearchBoxLoaded.apply(window, arguments) : cur.loading = !1
            },
            onFail: function() {
                return cur.loading = 0, !0
            },
            cache: 1
        }))
    },
    moreSearchBox: function(e, t, s) {
        var o = cur.boxMoreLink;
        if ((e || isVisible(o) && !hasClass(o, "loading")) && (!e || s != cur.searchBoxParams.q)) {
            if (cur.loading) return void(cur.loading = 2);
            e && (cur.oldBoxParams = {
                q: cur.searchBoxParams.q,
                offset: cur.searchBoxParams.offset
            }, extend(cur.searchBoxParams, {
                q: s,
                offset: 0
            })), ajax.post(cur.searchBoxAddress, cur.searchBoxParams, {
                onDone: function(s, o, n, i) {
                    if (e) {
                        if (i) return extend(cur.searchBoxParams, cur.oldBoxParams), val(t, cur.oldBoxParams.q), void(cur.searchBoxFound && cur.searchBoxFound(
                            i));
                        cur.boxRows.innerHTML = s ? "" : cur.boxNoRowsTpl, curBox()
                            .tbToTop()
                    }
                    Settings.moreSearchBoxLoaded.apply(window, arguments)
                },
                onFail: function() {
                    return cur.loading = 0, !0
                },
                showProgress: function() {
                    cur.searchBoxParams.offset ? addClass(o, "loading") : uiSearch.showProgress(t)
                },
                hideProgress: function() {
                    uiSearch.hideProgress(t), removeClass(o, "loading")
                }
            })
        }
    },
    moreSearchBoxChange: function(e, t) {
        t && "paste" == t.type ? Settings.moreSearchBox(!0, curBox()
            .tbSearchField, e) : e.length || Settings.moreSearchBox(!0, curBox()
            .tbSearchField, "")
    },
    initBlacklist: function() {
        ge("settings_bl_msg") && setTimeout(removeClass.pbind(ge("settings_bl_msg"), "msg_appear"), 0), elfocus("settings_bl_search")
    },
    searchBlacklist: function(e) {
        e && (e = e.toLowerCase());
        var t = ge("settings_bl_empty"),
            s = getLang("settings_blacklist_not_found_by_query"),
            o = ge("settings_bl_list"),
            n = geByClass("settings_bl_row", o),
            i = 0;
        for (var a in n) {
            var r = n[a];
            if (e) {
                var c = geByClass1("settings_bl_name", r);
                c = val(geByTag1("a", c))
                    .toLowerCase(), c.indexOf(e) > -1 ? (show(r), i++) : hide(r)
            } else show(r), i++
        }
        if (e && !i) {
            var l = s.split("{query}")
                .join("<b>" + e.replace(/([<>&#]*)/g, "") + "</b>");
            t.innerHTML = l, show(t), hide("settings_bl_noempty")
        } else hide(t), show("settings_bl_noempty")
    },
    doAddToBlacklist: function(e, t) {
        ajax.post("al_settings.php", {
            act: "search_blacklist",
            query: e,
            hash: cur.options.blacklist_hash
        }, {
            onDone: function(e, t, s) {
                curBox()
                    .hide(), e && -1 != e && (ge("settings_bl_summary")
                        .innerHTML = langNumeric(e, "%s", !0));
                var o = ce("div", {
                        innerHTML: t
                    })
                    .firstChild,
                    n = ge("settings_bl_list");
                re(o.id), n.insertBefore(o, n.firstChild), show("settings_bl_noempty"), hide("settings_bl_empty"), showMsg("settings_bl_result", s, "ok_msg", !
                    0)
            },
            onFail: function(e) {
                return showMsg("settings_search_rows", e, "error", !0), !0
            },
            showProgress: function() {
                "BUTTON" == t.tagName ? lockButton(t) : uiSearch.showProgress(t)
            },
            hideProgress: function() {
                "BUTTON" == t.tagName ? unlockButton(t) : uiSearch.hideProgress(t)
            }
        })
    },
    addToBlacklist: function() {
        return showBox("al_settings.php", {
            act: "blacklist_box"
        }, {
            params: {
                dark: !0
            }
        }), !1
    },
    addToBl: function(e, t, s) {
        ajax.post("al_settings.php", {
            act: "a_add_to_bl",
            id: e,
            hash: t,
            from: "settings"
        }, {
            onDone: function(o) {
                o && (ge("settings_bl_summary")
                    .innerHTML = langNumeric(o, "%s", !0)), hide("settings_bl_label" + e), s.onclick = function() {
                    return Settings.delFromBl(e, t, s), !1
                }, s.innerHTML = getLang("settings_remove")
            },
            onFail: function(e) {
                return setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, e)
                    .hide, 2e3), !0
            },
            showProgress: function() {
                hide(s), show("settings_progress" + e)
            },
            hideProgress: function() {
                show(s), hide("settings_progress" + e)
            }
        })
    },
    delFromBl: function(e, t, s) {
        ajax.post("al_settings.php", {
            act: "a_del_from_bl",
            id: e,
            hash: t,
            from: "settings"
        }, {
            onDone: function(o) {
                ge("settings_bl_summary")
                    .innerHTML = o ? langNumeric(o, "%s", !0) : "", setStyle("settings_bl_label" + e, "display", "inline"), s.onclick = function() {
                        return Settings.addToBl(e, t, s), !1
                    }, s.innerHTML = getLang("settings_restore_blacklist")
            },
            onFail: function(e) {
                return setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, e)
                    .hide, 2e3), !0
            },
            showProgress: function() {
                hide(s), show("settings_progress" + e)
            },
            hideProgress: function() {
                show(s), hide("settings_progress" + e)
            }
        })
    },
    delTopFromBl: function(e, t, s) {
        var o = ce("img", {
            src: "/images/upload.gif"
        });
        ajax.post("al_settings.php", {
            act: "a_del_from_bl",
            id: e,
            hash: t,
            from: "settings"
        }, {
            onDone: function(s) {
                s && (ge("settings_bl_summary")
                    .innerHTML = s ? langNumeric(s, "%s", !0) : ""), setStyle("settings_bl_label" + e, "display", "inline");
                var o = geByTag1("a", geByClass1("settings_bl_action", ge("settings_bl_row" + e)));
                o.onclick = function() {
                    return Settings.addToBl(e, t, o), !1
                }, o.innerHTML = getLang("settings_restore_blacklist"), hide("settings_bl_result")
            },
            showProgress: function() {
                s.parentNode.replaceChild(o, s)
            },
            hideProgress: function() {
                o.parentNode.replaceChild(s, o)
            }
        })
    },
    saveSmsNotify: function(e) {
        lockButton(e);
        var t = {
            act: "a_save_sms_notify",
            hash: cur.options.notify_hash
        };
        each(cur.options.notify_sms_keys, function(e, s) {
            t[s] = Privacy.getValue(s)
        }), t.smsenabled = isChecked("smsenabled") ? 1 : 0, isChecked("daytime") ? (t.daytime_from = ge("daytime_from")
            .value, t.daytime_to = ge("daytime_to")
            .value) : (t.daytime_from = 0, t.daytime_to = 0), val("settings_notify_sms_result", ""), ajax.post("al_settings.php", t, {
            onDone: function(t, s, o) {
                unlockButton(e), s && o ? showFastBox({
                    title: t,
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, s, getLang("settings_subscribe_to_service_btn"), function() {
                    window.open(o), curBox()
                        .hide()
                }, getLang("box_cancel"), function() {
                    checkbox("smsenabled", 0), Settings.smsNotifyCheck(), Settings.saveSmsNotify(), curBox()
                        .hide()
                }) : showMsg("settings_notify_sms_result", t, "ok_msg", !0)
            },
            onFail: function(t) {
                unlockButton(e), checkbox("smsenabled", 0), Settings.smsNotifyCheck(), Settings.saveSmsNotify()
            }
        })
    },
    saveSiteNotify: function(e) {
        var t = {
            act: "a_save_site_notify",
            hash: cur.options.notify_hash
        };
        each(cur.options.notify_site_keys, function(e, s) {
                t[s] = isChecked(s) ? 1 : 0
            }), each(cur.options.notify_site_pkeys, function(e, s) {
                t[s] = Privacy.getValue(s)
            }), t.ienable = isChecked("settings_ienable") ? 1 : 0, t.itexts = isChecked("settings_itexts") ? 1 : 0, clearTimeout(cur.instantNotifyTO), clearTimeout(cur.instantNotifySaveTO),
            cur.instantNotifyTO = setTimeout(ajax.post.pbind("al_settings.php", t, {
                onDone: function() {
                    cur.instantNotifySaveTO = setTimeout(window.uiPageBlock && uiPageBlock.showSaved.pbind(e), 1e3)
                }
            }), 500), TopNotifier && TopNotifier.invalidate()
    },
    checkboxSiteNotify: function(e, t) {
        t.target && hasClass(t.target, "item_sel") || (checkbox(e), Settings.saveSiteNotify(e))
    },
    saveMailNotify: function(e) {
        var t = {
            act: "a_save_mail_notify",
            hash: cur.options.notify_hash
        };
        t.mail_period = Privacy.getValue("mail_period"), each(cur.options.notify_mail_keys, function(e, s) {
            t[s] = isChecked(s) ? 1 : 0
        }), clearTimeout(cur.mailNotifyTO), cur.mailNotifyTO = setTimeout(ajax.post.pbind("al_settings.php", t, {
            onDone: window.uiPageBlock && uiPageBlock.showSaved.pbind(e)
        }), 500)
    },
    saveNotifyPrivacyKey: function(e) {
        "mail_period" == e ? (Settings.saveMailNotify("privacy_edit_" + e), 3 == Privacy.getValue(e) ? hide("mail_options") : show("mail_options")) : "lk_fr" == e ||
            "co_fr" == e ? Settings.saveSiteNotify("privacy_edit_" + e) : "sms_pm_notify" == e && (0 != Privacy.getValue(e) ? hide("sms_pm_privacy_row") : show(
                "sms_pm_privacy_row"))
    },
    initNotify: function() {
        ls.get("sound_notify_off") && removeClass("settings_isounds", "on"), cur.reloadOnMailBind = !0;
        new Dropdown(ge("daytime_from"), ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
            "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
        ], {
            selectedItems: cur.options.time_from,
            dark: 1
        }), new Dropdown(ge("daytime_to"), ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
        ], {
            selectedItems: cur.options.time_to,
            dark: 1
        });
        cur.onPrivacyChanged = Settings.saveNotifyPrivacyKey
    },
    smsNotifyCheck: function() {
        isChecked("smsenabled") ? (slideDown(ge("sms_options"), 200), show("sms_options_msg")) : isVisible("sms_options") && (hide("sms_options_msg"), slideUp(ge(
            "sms_options"), 200))
    },
    smsDayTimeCheck: function() {
        isChecked("daytime") ? slideDown(ge("daytime_from_to"), 200) : slideUp(ge("daytime_from_to"), 200)
    },
    updateInstantSounds: function(e) {
        ls.set("sound_notify_off", isChecked(e) ? 0 : 1), uiPageBlock.showSaved(e)
    },
    smsUnsubscribe: function(e, t, s, o) {
        var n = '<a href="' + e.href + '">' + e.innerHTML + "</a>",
            i = 1;
        if (0 > t) {
            i = o ? 3 : 2;
            var a = o ? getLang("settings_confirm_unsubscribe_event_msg") : getLang("settings_confirm_unsubscribe_group_msg")
        } else var a = getLang("settings_confirm_unsubscribe_fan_msg");
        return a = a.replace("{name}", n), showFastBox({
            title: getLang("settings_confirm_unsubscribe_title"),
            dark: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, a, getLang("box_yes"), function() {
            ajax.post("/settings", {
                act: "a_sms_unsubscribe",
                hash: s,
                oid: t,
                row: i
            }, {
                onDone: function(e) {
                    var t = ge("sms_subscribes_row" + i);
                    e ? t.innerHTML = e : hide(t.parentNode), curBox()
                        .hide()
                },
                progress: curBox()
                    .progress
            })
        }, getLang("box_no")), !1
    },
    checkPIN: function(e) {
        var t = e.value.replace(/[^0-9]/g, "");
        e.value != t && (e.value = t)
    },
    updatePIN: function(e) {
        lockButton(ge("pin_btn")), val("settings_pin_result", "");
        var t = {
            act: "a_change_pin",
            pin: ge("pin")
                .value,
            hash: e
        };
        ajax.post("al_settings.php", t, {
            onDone: function(e) {
                unlockButton(ge("pin_btn")), val("settings_pin_value", t.pin), showMsg("settings_pin_result", e, "ok_msg", !0)
            },
            onFail: function(e) {
                return unlockButton(ge("pin_btn")), showMsg("settings_pin_result", e, "error", !0), !0
            }
        })
    },
    getAdminSelectShowCt: function(e) {
        return Object.keys(e)
            .filter(function(t) {
                return e[t]
            })
            .length
    },
    initMenuBox: function(e, t, s) {
        this.initMenuEvents(e), e.setOptions({
            onHide: function() {
                cur.adminGroupsDirty && (window.Notifier && Notifier.resetCommConnection(), ajax.post("al_settings.php", {
                    act: "a_get_left_menu"
                }, {
                    onDone: function(e) {
                        geByTag1("ol", ge("side_bar"))
                            .innerHTML = e
                    }
                }))
            }
        }), cur.menuSettings = s, this.updateMenuBoxCount(t)
    },
    initMenuEvents: function(e) {
        var t = geByClass1("olist", e.bodyNode),
            s = geByClass1("summary_tabs", e.bodyNode);
        setStyle(s, "display", "inline-block");
        var o = getSize(s)[0] + parseInt(getStyle(s, "marginLeft")) + parseInt(getStyle(s, "marginRight"));
        o > 450 && e.setOptions({
            width: Math.ceil(o)
        }), setStyle(s, "display", null), addEvent(t, "scroll", this.onMenuBoxScroll.pbind(e, t)), this.onMenuBoxScroll(e, t)
    },
    onMenuBoxScroll: function(e, t) {
        var s = domPN(e.bodyNode),
            o = t.scrollHeight,
            n = t.scrollTop,
            i = t.offsetHeight || t.clientHeight;
        toggleClass(s, "olist_topsh", n > 0), toggleClass(s, "olist_botsh", o > n + i)
    },
    updateMenuBoxCount: function(e) {
        var t = curBox(),
            s = cur.menuSettings[e] || {},
            o = Settings.getAdminSelectShowCt(s),
            n = "";
        (1 == e || 2 == e) && (n = '<span class="settings_menu_box_counter">' + getLang("settings_admin_groups_left")
            .replace("{count}", o)
            .replace("{amt}", Settings.MAX_LEFT_GROUPS) + "</span>"), t.setControlsText(n)
    },
    toggleMenuBoxRow: function(e, t, s) {
        var o = cur.menuSettings[t] || {},
            n = Settings.getAdminSelectShowCt(o),
            i = o[s];
        return (1 == t || 2 == t) && (toggleClass(gpeByClass("olist_section", e), "settings_menu_rows_disabled", !i && n >= Settings.MAX_LEFT_GROUPS - 1), !i && n >=
            Settings.MAX_LEFT_GROUPS) ? !1 : (toggleClass(e, "olist_item_wrap_on", !i), o[s] = i ? 0 : 1, Settings.updateMenuBoxCount(t), !1)
    },
    switchMenuBoxSection: function(e, t) {
        var s = curBox();
        each(geByClass("olist_section", s.bodyNode), function() {
                hide(this)
            }), show("settings_menu_" + t), geByClass1("olist", s.bodyNode)
            .scrollTop = 0, Settings.updateMenuBoxCount(t)
    },
    saveMenu: function(e, t) {
        for (var s = curBox(), o = [], n = [], i = [], a = [], r = {
                hash: e,
                act: "a_change_services"
            }, c = 0; 3 >= c; c++) {
            var l = cur.menuSettings[c] || {};
            each(l, function(e, t) {
                switch (c) {
                    case 1:
                        t && n.push(e);
                        break;
                    case 2:
                        i.push(e), t && o.push(e);
                        break;
                    case 3:
                        t || a.push(e);
                        break;
                    default:
                        r[e] = t
                }
            })
        }
        i.length && (r.apps_all = i.join(","), r.apps_on = o.join(",")), r.groups_list = n.join(","), r.service_hidden = a.join(","), ajax.post("al_settings.php", r, {
            onDone: function(e) {
                geByTag1("ol", ge("side_bar"))
                    .innerHTML = e, window.uiPageBlock && uiPageBlock.showSaved("settings_services"), s.hide(), window.Apps && Apps.updateAddToMenuAction()
            },
            showProgress: lockButton.pbind(t),
            hideProgress: unlockButton.pbind(t)
        })
    },
    giftsCheck: function() {
        clearTimeout(cur.giftsUpdateTO), cur.giftsUpdateTO = setTimeout(Settings.giftsSubmit, 200)
    },
    giftsSubmit: function() {
        ajax.post("/al_profile.php", {
            act: "hide_gifts",
            hash: cur.options.hide_gifts_hash,
            shown: isChecked(ge("hide_gifts")) ? 0 : 1
        }, {
            onDone: window.uiPageBlock && uiPageBlock.showSaved.pbind("cposts")
        })
    },
    gifCheck: function() {
        clearTimeout(cur.gifUpdateTO), cur.gifUpdateTO = setTimeout(Settings.gifSubmit, 200)
    },
    gifSubmit: function() {
        ajax.post("/al_settings.php", {
            act: "a_change_autoplay_gif",
            hash: cur.options.gif_autoplay_hash,
            no_autoplay: isChecked(ge("settings_gif_autoplay")) ? 0 : 1
        }, {
            onDone: window.uiPageBlock && uiPageBlock.showSaved.pbind("cposts")
        })
    },
    videoCheck: function() {
        clearTimeout(cur.videoUpdateTO), cur.videoUpdateTO = setTimeout(Settings.videoSubmit, 200)
    },
    videoSubmit: function() {
        ajax.post("/al_settings.php", {
            act: "a_change_autoplay_video",
            hash: cur.options.video_autoplay_hash,
            video_autoplay: isChecked(ge("settings_video_autoplay")) ? 1 : 0
        }, {
            onDone: window.uiPageBlock && uiPageBlock.showSaved.pbind("cposts")
        })
    },
    microblogCheck: function(e) {
        hasClass(ge("settings_" + e), "disabled") || (clearTimeout(cur.microblogUpdateTO), cur.microblogUpdateTO = setTimeout(Settings.microblogSubmit, 200))
    },
    microblogSubmit: function() {
        var e = {
            act: "a_change_microblog",
            hash: cur.options.microblog_hash
        };
        each(["status_default", "no_wall_replies"], function(t, s) {
            e[s] = isChecked(ge("settings_" + s))
        }), ajax.post("/al_settings.php", e, {
            onDone: window.uiPageBlock && uiPageBlock.showSaved.pbind("cposts")
        })
    },
    OTPAuthEnable: function(e) {
        return showBox("al_settings.php", {
            act: "otp_auth_box",
            confirm: e,
            hash: cur.options.otp_hash
        }, {
            params: {
                dark: !0
            }
        }), !1
    },
    OTPAuthAppSet: function(e) {
        return showBox("al_settings.php", {
            act: "otp_auth_app_box",
            hash: cur.options.otp_hash
        }, {
            params: {
                dark: !0
            }
        }), !1
    },
    OTPAuthDisable: function(e) {
        if (buttonLocked(e)) return !1;
        var t = {
            act: "a_otp_auth_save",
            type: "otp_auth",
            hash: cur.options.otp_hash
        };
        ajax.post("al_settings.php", t, {
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e)
        })
    },
    OTPAuthAppDisable: function() {
        if (Settings.otpAuthAppDisabling) return !1;
        Settings.otpAuthAppDisabling = !0, curBox()
            .showProgress();
        var e = {
            act: "a_otp_auth_save",
            type: "otp_auth_by_app",
            hash: cur.options.otp_hash
        };
        ajax.post("al_settings.php", e, {
            onDone: function() {
                Settings.otpAuthAppDisabling = !1, addClass("settings_otp_auth_app_set", "settings_otp_app_disabled"), val("settings_otp_auth_app_set_link",
                        getLang("settings_otp_auth_by_app_enable")), curBox()
                    .hide()
            }
        })
    },
    OTPAuthShowReserveCodes: function(e) {
        return showBox("al_settings.php", {
            act: "otp_auth_reserve_codes_box",
            force_new: e ? 1 : 0
        }, {
            params: {
                dark: !0
            }
        }), !1
    },
    OTPAuthGetTrusted: function(e) {
        var t = ge("settings_otp_auth_trusted");
        if (t && isVisible(t) && (e || geByTag1("img", t))) {
            var s = vk.loginscheme != location.protocol.substr(0, location.protocol.length - 1) ? 1 : 0;
            ajax.post(vk.loginscheme + "://" + location.host + "/al_login.php", {
                act: "is_trusted_browser",
                _http: s
            }, {
                frame: s,
                onDone: function(e) {
                    t.innerHTML = e
                }
            })
        }
    },
    OTPAuthClearTrusted: function(e, t, s) {
        function o() {
            if (!t && cur.options.otp_reset_hash) return cur.onReLoginDoneCallback = function() {
                    ge("settings_reset_sessions_link")
                        .parentNode.innerHTML = '<div class="settings_labeled_notice">' + getLang("setting_all_sessions_reset") + "</div>"
                }, Settings.resetAllSessions(e, '<input name="otp_reset_hash" value="' + cur.options.otp_reset_hash + '" type="hidden" />', e.getAttribute("complete")),
                void(n && n.hide());
            var o = ce("img", {
                    src: "/images/upload" + (window.devicePixelRatio >= 2 ? "_2x" : "") + ".gif"
                }, {
                    width: 32
                }),
                i = vk.loginscheme != location.protocol.substr(0, location.protocol.length - 1) ? 1 : 0;
            ajax.post(vk.loginscheme + "://" + location.host + "/al_login.php", {
                act: "clear_trusted_browsers",
                only_cur: t,
                hash: s,
                _http: i
            }, {
                frame: i,
                onDone: function(t) {
                    n && n.hide(), e.parentNode.innerHTML = '<div class="settings_labeled_notice">' + e.getAttribute("complete") + "</div>"
                },
                showProgress: function() {
                    n ? n.showProgress() : e.parentNode.replaceChild(o, e)
                },
                hideProgress: function() {
                    n ? n.hideProgress() : o.parentNode.replaceChild(e, o)
                }
            })
        }
        var n = !1,
            i = e.getAttribute("confirm");
        i ? (i = i.split("<!!>"), n = showFastBox({
            title: i[0],
            dark: 1,
            bodyStyle: "padding: 20px;"
        }, i[1], i.length > 2 ? i[2] : getLang("box_yes"), o)) : o()
    },
    OTPAppPasswords: function() {
        return showBox("al_settings.php", {
            act: "otp_auth_app_passwords_box"
        }, {
            params: {
                dark: !0
            }
        }), !1
    },
    OTPCreateAppPassword: function(e, t) {
        if (!isButtonLocked(e)) {
            var s = val("settings_app_password_name");
            if (!s.length) return void notaBene("settings_app_password_name");
            val("settings_app_passwords_error", ""), ajax.post("al_settings.php", {
                act: "a_otp_auth_create_app_password",
                name: s,
                hash: t
            }, {
                onDone: function(e, t, s) {
                    showFastBox({
                            title: e,
                            width: 450
                        }, t), ge("settings_app_passwords_table_wrap")
                        .innerHTML = s, hide("settings_app_passwords_empty"), val("settings_app_password_name", "")
                },
                onFail: function(e) {
                    return e && showMsg("settings_app_passwords_error", e, "error", !0), !0
                },
                showProgress: lockButton.pbind(e),
                hideProgress: unlockButton.pbind(e)
            })
        }
    },
    OTPRemoveAppPassword: function(e, t, s) {
        return ajax.post("al_settings.php", {
            act: "a_otp_auth_remove_app_password",
            id: t,
            hash: s
        }, {
            onDone: function() {
                re("settings_app_password" + t), geByTag("tr", "settings_app_passwords_table_wrap")
                    .length <= 1 && (ge("settings_app_passwords_table_wrap")
                        .innerHTML = "", show("settings_app_passwords_empty"))
            },
            showProgress: function() {
                showProgress(e.parentNode), hide(e)
            },
            hideProgress: function() {
                hideProgress(e.parentNode), show(e)
            }
        }), !1
    },
    passwordDone: function(e, t) {
        re(cur.pwchFrame), unlockButton(cur.pwchDestroy), cur.pwchFrame = !1;
        var s, o = "settings_new_pwd";
        switch (e) {
            case 1:
                s = "settings_cant_set_this_password";
                break;
            case -2:
                s = "settings_oldpwd_notcorr", o = "settings_old_pwd";
                break;
            case 2:
                return hide("settings_error_pwd"), val(geByClass1("settings_labeled_text", "chgpass"), getLang("settings_pass_update_just_now")), val("settings_old_pwd",
                    ""), val("settings_new_pwd", ""), val("settings_confirm_pwd", ""), Settings.toggleBlock("chgpass"), Settings.showMsg(getLang(
                    "settings_pass_success")), void(cur.pwchCaptchaBox && (cur.pwchCaptchaBox.hide(), cur.pwchCaptchaBox = !1));
            case -1:
                return void(cur.pwchCaptchaBox = showCaptchaBox(t, 1, cur.pwchCaptchaBox, {
                    onSubmit: Settings.passwordSubmit.pbind(cur.pwchDestroy),
                    onDestroy: function() {}
                }));
            default:
                s = "settings_cant_change_password"
        }
        cur.pwchCaptchaBox && (cur.pwchCaptchaBox.hide(), cur.pwchCaptchaBox = !1), Settings.showError(getLang(s), "pwd"), notaBene(o)
    },
    passwordSubmit: function(e, t, s) {
        var o = val("settings_old_pwd"),
            n = val("settings_new_pwd"),
            i = val("settings_confirm_pwd"),
            a = ge("settings_pwd_tt_place")
            .tt;
        if (!cur.pwchFrame) {
            if (!o) return void notaBene("settings_old_pwd");
            if (!n) return void notaBene("settings_new_pwd");
            if (!i) return void notaBene("settings_confirm_pwd");
            if (a && a.hide({
                    fasthide: !0
                }), n.match(/\s/)) return Settings.showError(getLang("settings_pwd_bad"), "pwd"), notaBene("settings_new_pwd"), void(a && setTimeout(a.show, 10));
            if (n.length < 6) return Settings.showError(getLang("settings_pwd_bad"), "pwd"), notaBene("settings_new_pwd"), void(a && setTimeout(a.show, 10));
            if (i != n) return Settings.showError(getLang("settings_newpwd_notcorr"), "pwd"), notaBene("settings_confirm_pwd"), void(a && setTimeout(a.show, 10));
            cur.pwchDestroy || cur.destroy.push(function(e) {
                re(e.pwchFrame)
            }), cur.pwchDestroy = e, curBox() || lockButton(cur.pwchDestroy);
            var r = {
                act: "changepass",
                _origin: locProtocol + "//" + locHost,
                pass: o,
                new_pass: n
            };
            t && s && (r.captcha_sid = t, r.captcha_key = s), r.phash = cur.options.phash, cur.pwchDone = Settings.passwordDone, cur.pwchFrame = utilsNode.appendChild(ce(
                "iframe", {
                    src: vk.loginscheme + "://login.vk.com/?" + ajx2q(r)
                }))
        }
    },
    mailSubmit: function(e, t) {
        if (t) {
            var s = "";
            re(e)
        } else {
            var s = trim(val("settings_new_mail"));
            if (!s) return void notaBene("settings_new_mail");
            lockButton(e)
        }
        var o = {
            act: "a_bind_mail",
            email: s,
            is_new: 1,
            hash: cur.options.mail_hash
        };
        return ge("settings_new_mail")
            .blur(), hide("settings_error_mail"), ajax.post("al_settings.php", o, {
                onDone: function(t, s) {
                    if (unlockButton(e), s) {
                        var o = ge("chgmail");
                        o.parentNode.replaceChild(se(s), o)
                    }
                    ge("settings_new_mail")
                        .value = "", showDoneBox(t, {
                            out: 4e3,
                            w: 400
                        })
                },
                onFail: function(t) {
                    return unlockButton(e), Settings.showError(t, "mail"), !0
                }
            }), !1
    },
    phoneSubmit: function() {
        var e = {
            act: "change_phone_box",
            hash: cur.options.phone_hash
        };
        showBox("activation.php", e)
    },
    regionalSubmit: function(e) {
        var t = (ge("timezone") || {})
            .value,
            s = {
                act: "a_change_regional",
                timeoffset: t,
                hash: cur.options.regional_hash || cur.options.regional_hashes[t]
            };
        lockButton(e), ajax.post("al_settings.php", s, {
            onDone: function(t) {
                unlockButton(e), Settings.showMsg(t)
            },
            onFail: function(t) {
                return unlockButton(e), Settings.showError(t), !0
            }
        })
    },
    reset_sessions: !1,
    resetAllSessions: function(e, t, s) {
        if (Settings.reset_sessions) return !1;
        Settings.reset_sessions = !0;
        var o = bodyNode.appendChild(ce("div", {
                innerHTML: '<form action="' + vk.loginscheme + '://login.vk.com/" method="POST" target="reset_sessions_frame">  <input name="_origin" value="' + (
                        locProtocol + "//" + locHost) + '" type="hidden" />  <input name="role" value="al_frame" type="hidden" />  <input name="ip_h" value="' + vk
                    .ip_h + '" type="hidden" />  <input name="reset_hash" value="' + cur.options.reset_hash + '" type="hidden" />' + t +
                    '</form><iframe class="upload_frame" name="reset_sessions_frame"></iframe>'
            })),
            n = o.firstChild,
            i = n.nextSibling,
            a = ce("img", {
                src: "/images/upload" + (window.devicePixelRatio >= 2 ? "_2x" : "") + ".gif"
            }, {
                width: 32
            });
        return window.onReLoginDone = function() {
                try {
                    var t = i.contentWindow.location.href;
                    if (t.match(/&hash=/) && !t.match(/&hash=[a-z0-9]+/)) return location.href = base_domain + "login.php?op=logout", !1;
                    re(o)
                } catch (n) {
                    return
                }
                e ? e !== !0 && a.parentNode.replaceChild(ce("div", {
                    className: "settings_labeled_notice",
                    innerHTML: s ? s : getLang("setting_all_sessions_reset")
                }), a) : (box = curBox(), box && (box.hideProgress(), box.setControlsText(getLang("setting_all_sessions_reset"))), j = 0, each(ge("activity_history")
                    .lastChild.childNodes,
                    function(e, t) {
                        if (1 == t.nodeType) {
                            if (j > 1 && !hasClass(t, "settings_old_session")) {
                                addClass(t, "settings_old_session");
                                var s = geByClass("settings_browser_info", t)[0];
                                removeData(s, "tooltip"), removeData(s, "inited")
                            }
                            j++
                        }
                    })), isFunction(cur.onReLoginDoneCallback) && cur.onReLoginDoneCallback()
            }, e ? e !== !0 && e.parentNode.replaceChild(a, e) : curBox()
            .showProgress(), n.submit(), !1
    },
    showUserClientTT: function(e, t) {
        var s = "";
        hasClass(e.parentNode.parentNode, "settings_old_session") && (s = '<div style="font-weight:bold; margin-bottom:5px;">' + getLang("settings_session_terminated") +
            "</div>"), cur.options.ua_tooltips[t] && (s += cur.options.ua_tooltips[t]), s && showTooltip(e, {
            text: s,
            dir: "auto",
            slide: 15,
            className: "settings_user_client_tt",
            hasover: 1
        })
    },
    disabledPrivacy: function() {
        var e = geByClass1("settings_privacy_add_replies_view", ge("content"));
        e && showTooltip(e, {
            black: !0,
            hasover: 1,
            className: "settings_comments_disabled_tt",
            shift: [0, 5],
            text: getLang("settings_comments_disabled_tt")
                .replace("{link}", '<a href="/settings?f=cposts" onclick="return nav.go(this, event, {nocur: true})">')
                .replace("{/link}", "</a>")
        })
    },
    checkAddress: function(e) {
        cur.addrUnchecked = 0, clearTimeout(cur.addressCheckTO), cur.lastAddress != val("settings_addr") && (cur.addressCheckTO = setTimeout(Settings.doCheckAddress, e ||
            0))
    },
    doCheckAddress: function() {
        var e = ge("settings_address_submit"),
            t = e;
        cur.lastAddress = val("settings_addr"), ajax.post("al_settings.php", {
            act: "a_check_address",
            name: cur.lastAddress
        }, {
            onDone: function(e) {
                cur.addrChecked = 1, disableButton(t, !1), t.innerHTML = e
            },
            onFail: function(e) {
                return cur.addrChecked = -1, t.innerHTML = e, disableButton(t, !0), !0
            },
            showProgress: function() {
                lockButton(t), disableButton(t, !1)
            },
            hideProgress: function() {
                unlockButton(t)
            }
        })
    },
    addressSubmit: function(e) {
        if (1 != cur.addrChecked) return void notaBene("settings_addr");
        var t = {
            act: "a_change_address",
            hash: cur.options.address_hash,
            name: val("settings_addr")
        };
        lockButton(e), ajax.post("al_settings.php", t, {
            onDone: function(t) {
                unlockButton(e), Settings.showMsg(t)
            },
            onFail: function(t) {
                return unlockButton(e), t && Settings.showError(t, "addr"), !0
            }
        })
    },
    init: function() {
        cur.checkboxResultsTOs = {}, cur.module = "settings", cur.options.msg && Settings.showMsg(cur.options.msg), each({
            settings_status_default: getLang("settings_status_default_about"),
            settings_no_wall_replies: getLang("settings_no_wall_replies_about")
        }, function(e, t) {
            ge(e)
                .onmouseover = function() {
                    showTooltip(this, {
                        shift: [-20, 8, 8],
                        dir: "auto",
                        text: t,
                        slide: 15,
                        className: "settings_tt",
                        hasover: 1
                    })
                }
        });
        var e = ge("settings_pwd_tt_place");
        each([ge("settings_new_pwd"), ge("settings_confirm_pwd")], function() {
            this && (this.onfocus = function() {
                showTooltip(e, {
                    text: getLang("settings_password_about"),
                    dir: "left",
                    slideX: 15,
                    className: "settings_pwd_tt",
                    shift: [-12, -15, 0],
                    onCreate: function() {
                        removeEvent(e, "mouseout")
                    }
                })
            }, this.onblur = function() {
                e.tt && e.tt.hide && e.tt.hide()
            })
        });
        var t = ge("settings_addr");
        t.onfocus = function() {
            showTooltip(t, {
                text: getLang("settings_addr_intro"),
                dir: "auto",
                slide: 15,
                className: "settings_toup_tt",
                shift: [getSize("prefix_input_prefix")[0], 10],
                onCreate: function() {
                    removeEvent(t, "mouseout"), t.onblur = function() {
                        t.tt.hide()
                    }
                }
            })
        };
        var s = ge("settings_new_mail");
        s && (s.onfocus = function() {
            showTooltip(s, {
                text: getLang("settings_email_about"),
                dir: "auto",
                slide: 15,
                className: "settings_toup_tt",
                shift: [0, 10],
                onCreate: function() {
                    removeEvent(s, "mouseout"), s.onblur = function() {
                        s.tt.hide()
                    }
                }
            })
        }), extend(cur, {
            validationLastCallback: function(e) {
                curBox() && curBox()
                    .hide(), e ? Settings.phoneSubmit() : elfocus("settings_new_phone")
            }
        }), setTimeout(function() {
            if (nav.objLoc.f) {
                var e = ge(nav.objLoc.f.split(",")[0]);
                e && hasClass(e, "settings_line") && Settings.toggleBlock(e.firstChild)
            }
        }, 100), cur.destroy.push(function() {
            window.onLogout = window.onLoginDone = nav.reload
        })
    },
    emailPosts: function(e, t) {
        ajax.post("al_settings.php", {
            act: "send_email_post",
            hash: e
        }, {
            onDone: function(e, s) {
                ge("settings_email_post_msg")
                    .innerHTML = e, setStyle(ge("settings_email_post_msg"), {
                        borderColor: "#D4BC4C",
                        backgroundColor: "#F9F6E7"
                    }), animate(ge("settings_email_post_msg"), {
                        borderColor: "#B9C4DA",
                        backgroundColor: "#FFFFFF"
                    }, 3e3), t.innerHTML = s
            },
            showProgress: function() {
                lockButton(t)
            },
            hideProgress: function() {
                unlockButton(t)
            }
        })
    },
    showPaymentsMethods: function(e, t) {
        return ajax.post("al_settings.php", {
            act: "a_payments_methods",
            hash: t
        }, {
            onDone: function(t) {
                var s = ce("div", {
                    innerHTML: t,
                    className: "unshown"
                });
                e.parentNode.replaceChild(s, e), slideDown(s, 100)
            }
        }), !1
    },
    deletePaymentMethod: function(e, t, s, o) {
        if (!o) return void(cur.confirmBox = showFastBox({
            title: cur.lang.global_action_confirmation,
            dark: 1,
            forceNoBtn: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, cur.lang.settings_delete_payment_method_confirm, getLang("global_delete"), function() {
            Settings.deletePaymentMethod(e, t, s, !0)
        }, getLang("global_cancel")));
        var n = e.parentNode;
        return ajax.post("al_payments.php", {
            act: "a_del_instant_method",
            type: t,
            hash: s
        }, {
            onDone: function(e) {
                n.innerHTML = e
            },
            onDone: function(e) {
                return n.innerHTML = e, !0
            },
            showProgress: function() {
                cur.confirmBox.showProgress()
            },
            hideProgress: function() {
                cur.confirmBox.hide()
            }
        }), !1
    },
    showNextVotesHistory: function(e) {
        return buttonLocked(e) ? void 0 : (lockButton(e), ajax.post("al_settings.php", {
            act: "a_votes_history",
            offset: cur.historyOffset
        }, {
            onDone: function(t, s) {
                var o = ge("settings_votes_history")
                    .tBodies[0];
                if (t)
                    if (unlockButton(e), cur.historyOffset += 100, browser.msie) {
                        var n = se("<table>" + t + "</table>"),
                            a = geByTag("tr", n);
                        for (i in a) 1 == a[i].nodeType && o.appendChild(a[i])
                    } else o.insertAdjacentHTML("beforeEnd", t);
                    (!t || s) && (addClass(o.lastChild, "settings_votes_history_last"), hide(e))
            }
        }), !1)
    },
    initApps: function(opts, appTpl) {
        extend(cur, {
            aSearch: ge("s_search"),
            lShowMoreButton: ge("ui_apps_load_more"),
            lContent: ge("settings_apps_list"),
            aEmptyCont: ge("settings_apps_empty"),
            aSummaryCounter: geByClass1("page_block_header_count", "wide_column"),
            onSilentLoad: {},
            apps: {},
            deletedApps: {},
            appTpl: appTpl || function() {
                return ""
            }
        }), extend(cur, opts), cur.defaultCount = cur.shownApps, cur.appTpl = appTpl || function() {
            return ""
        }, Settings.scrollNode = browser.msie6 ? pageNode : window, addEvent(Settings.scrollNode, "scroll", Settings.scrollCheckApps.bind(this)), setTimeout(function() {
            cur.destroy.push(function() {
                removeEvent(Settings.scrollNode, "scroll", Settings.scrollCheckApps.bind(this))
            })
        }, 0), cur.silent = !0, ajax.post("/al_settings.php", {
            act: "load_apps_silent"
        }, {
            cache: 1,
            local: 1,
            onDone: function(data, count) {
                return (data = eval("(" + data + ")")) ? (void 0 === cur.searchOffset && (cur.searchOffset = 0), cur.curList = "all", cur.appsList = data[cur.curList] ?
                    data : {
                        all: []
                    }, cur.appsCount = count, void this.indexApp(function() {
                        if (cur.silent = !1, cur.onSilentLoad)
                            for (var e in cur.onSilentLoad) isFunction(cur.onSilentLoad[e]) && cur.onSilentLoad[e]()
                    })) : cur.silent = !1
            }.bind(this)
        })
    },
    isDelayedOnSilentLoad: function e(t, s) {
        return cur.silent ? (e.count = e.count || 0, e.count++, cur.onSilentLoad[t || "key_" + e.count] = s, !0) : void 0
    },
    indexApp: function(e) {
        cur.appsIndex = new vkIndexer(cur.appsList.all, function(e) {
            try {
                return cur.apps[parseInt(e[0])] = e, e[3]
            } catch (t) {
                return ""
            }
        }, e)
    },
    scrollCheckApps: function() {
        this.isDelayedOnSilentLoad("scrollCheck", this.scrollCheckApps.bind(this)) || !browser.mobile && !cur.isAppsLoading && !cur.disableAutoMore && isVisible(cur.lShowMoreButton) &&
            (window.innerHeight || document.documentElement.clientHeight || bodyNode.clientHeight) + scrollGetY() + 400 >= cur.lShowMoreButton.offsetTop && this.showAppsRows()
    },
    showAppsRows: function() {
        if (!this.isDelayedOnSilentLoad("showAppsRows", this.showAppsRows.bind(this)) && cur.defaultCount && cur.shownApps < cur.appsCount) {
            var e = clean(cur.searchStr),
                t = "",
                s = cur.appsList[cur.curList] || [],
                o = s.length;
            if (s = this.filterApps(s.slice(cur.shownApps))
                .slice(0, cur.defaultCount), s.length && cur.appTpl) {
                var n = [];
                each(s, function(e, t) {
                    t = clone(t), cur.selection && (t[3] = t[3].replace(cur.selection.re, cur.selection.val)), n.push(cur.appTpl(t, e == s.length - 1, !1))
                }.bind(this)), t = n.join("")
            }
            if (cur.shownApps) t && cur.lContent.appendChild(cf(t));
            else if (t) cur.lContent.innerHTML = t, cur.aSummaryCounter && (cur.aSummaryCounter.innerHTML = langNumeric(o, "%s", !0)), show("settings_apps_noempty"), hide(
                cur.aEmptyCont);
            else {
                var i = getLang("settings_apps_not_found_by_query")
                    .split("{query}")
                    .join("<b>" + e.replace(/([<>&#]*)/g, "") + "</b>");
                cur.aEmptyCont.innerHTML = i,
                    cur.aSummaryCounter && (cur.aSummaryCounter.innerHTML = ""), show(cur.aEmptyCont), hide("settings_apps_noempty")
            }
            cur.shownApps += cur.defaultCount, cur.shownApps >= cur.appsCount ? hide(cur.lShowMoreButton) : (show(cur.lShowMoreButton), this.scrollCheckApps()), cur.aSearch &&
                uiSearch.hideProgress(cur.aSearch)
        }
    },
    filterApps: function(e) {
        for (var t = e.length, s = [], o = 0; t > o; o++) {
            var n = e[o];
            cur.apps && cur.apps[n[0]] && !cur.apps[n[0]].deleted && s.push(n)
        }
        return s
    },
    searchApps: function(e) {
        if (!this.isDelayedOnSilentLoad("searchApps", this.searchApps.bind(this, e))) {
            if (e && " " == e[e.length - 1] && (e[e.length - 1] = "_"), e.length < 2 && (e = ""), cur.ignoreEqual || cur.searchStr !== e) {
                if (cur.searchStr = e || "", e) {
                    var t = cur.appsIndex.search(clean(e));
                    cur.curList = "all_search_" + e, cur.appsList[cur.curList] = t, e += " " + (parseLatin(e) || ""), e = trim(escapeRE(e)
                        .split("&")
                        .join("&amp;")), cur.selection = {
                        re: new RegExp("(" + e.replace(cur.appsIndex.delimiter, "|") + ")", "gi"),
                        val: '<em class="highlight">$1</em>'
                    }
                } else cur.curList = "all", cur.selection = !1;
                window.tooltips && tooltips.hideAll(), cur.aSearch && uiSearch.showProgress(cur.aSearch), this.scrollToSearch(), hide(cur.lShowMoreButton), cur.loadMore =
                    1, cur.shownApps = cur.searchOffset = 0, this.showAppsRows()
            }
            delete cur.ignoreEqual
        }
    },
    showAppSettings: function(e) {
        window.tooltips && tooltips.hideAll(), showBox("/al_apps.php", {
            act: "settings_box_info",
            aid: e,
            from: "profile_settings"
        }, {
            stat: ["apps.css"],
            dark: 1
        })
    },
    removeApp: function(e, t, s, o) {
        if (o && cancelEvent(o), this.removingApp) return !1;
        if (this.isDelayedOnSilentLoad("removeApp" + e, this.removeApp.bind(this, e, t, s))) return !1;
        window.tooltips && tooltips.hideAll();
        var n = ge("app" + e),
            i = "profile_settings",
            a = function() {
                ajax.post("/al_apps.php", {
                    act: "quit",
                    id: e,
                    hash: t,
                    from: i
                }, {
                    onDone: function(t) {
                        window.appsListChanged = !0, cur.apps[e] && (cur.appsIndex.remove(cur.apps[e]), cur.apps[e].deleted = !0), cur.deletedApps[e] = {
                            from: i,
                            html: n.innerHTML
                        }, n && n.appendChild(cf(t.html)), addClass(n, "deleted")
                    }.bind(this),
                    showProgress: function() {
                        addClass(n, "loading"), this.removingApp = !0
                    }.bind(this),
                    hideProgress: function() {
                        removeClass(n, "loading"), this.removingApp = !1
                    }.bind(this)
                })
            }.bind(this);
        a()
    },
    restoreApp: function(e, t) {
        if (this.restoringApp) return !1;
        var s = ge("app" + e);
        return ajax.post("/al_apps.php", {
            act: "join",
            id: e,
            hash: t,
            restore: 1,
            from: "al_apps",
            section: "settings"
        }, {
            onDone: function(t) {
                cur.deletedApps[e] && (s.innerHTML = cur.deletedApps[e].html, delete cur.deletedApps[e]), cur.apps[e] && (delete cur.apps[e].deleted, cur.appsIndex
                    .add(cur.apps[e])), removeClass(s, "deleted")
            }.bind(this),
            showProgress: function() {
                this.restoringApp = !0, addClass(s, "loading")
            }.bind(this),
            hideProgress: function() {
                this.restoringApp = !1, removeClass(s, "loading")
            }.bind(this)
        }), !1
    },
    ttCommon: function(e, t, s, o, n) {
        return o && cancelEvent(o), s ? showTooltip(e, {
            center: s,
            shift: n || [0, 8, 8],
            black: 1,
            text: t
        }) : showTitle(e, t, n)
    },
    scrollToSearch: function() {
        var e = ge("page_header_cont"),
            t = ge("settings_search_wrap");
        if (t && e) {
            var s = getXY(domPN(t))[1] - getSize(e)[1];
            scrollNode.scrollTop > s && scrollToY(s, 200)
        }
    },
    deactivateBox: function() {
        return showBox("al_settings.php", {
            act: "deactivate_box"
        }, {
            params: {
                dark: !0
            }
        }), !1
    },
    httpsOnlySubmit: function(e) {
        ajax.post("al_settings.php", {
            act: "save_https",
            hash: cur.options.https_hash,
            https: isChecked("settings_https_only")
        }, {
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e)
        })
    },
    showValidateDevices: function(e, t) {
        return ajax.post("al_settings.php", {
            act: "a_validate_devices",
            hash: t
        }, {
            onDone: function(t) {
                tooltips.hideAll();
                var s = ce("div", {
                    innerHTML: t,
                    className: "unshown"
                });
                e.parentNode.replaceChild(s, e), slideDown(s, 100)
            }
        }), !1
    },
    deleteValidateDevice: function(e, t, s, o) {
        if (!o) return void(cur.confirmBox = showFastBox({
            title: cur.lang.global_action_confirmation,
            dark: 1,
            forceNoBtn: 1,
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, cur.lang.settings_delete_validate_device_confirm, getLang("global_delete"), function() {
            Settings.deleteValidateDevice(e, t, s, !0)
        }, getLang("global_cancel")));
        var n = e.parentNode;
        return ajax.post("al_settings.php", {
            act: "a_del_validate_device",
            i: t,
            hash: s
        }, {
            onDone: function(e) {
                n.innerHTML = e
            },
            onDone: function(e) {
                return n.innerHTML = e, !0
            },
            showProgress: function() {
                cur.confirmBox.showProgress()
            },
            hideProgress: function() {
                cur.confirmBox.hide()
            }
        }), !1
    },
    showNotifySubscriptions: function() {
        return showBox("al_settings.php", {
            act: "notify_subscriptions_box"
        }, {
            stat: ["indexer.js"]
        }), !1
    },
    notifySubscriptionsInit: function(e, t, s) {
        s.onListClick = Settings.notifySubscriptionToggle, cur.subsOList = new OList(e, t, {}, s), e.removeButtons()
            .addButton(getLang("global_close"), function() {
                e.hide(200)
            }, "yes")
    },
    notifySubscriptionToggle: function(e, t) {
        var s = e.id.match(/-?\d+/)[0],
            o = !1;
        each(cur.subsOList.owners, function() {
            return this[0] == s ? (o = this[4], !1) : void 0
        }), ajax.post("/al_wall.php", {
            act: "a_toggle_posts_subscription",
            subscribe: t ? 1 : 0,
            oid: s,
            hash: o
        }, {
            showProgress: addClass.pbind(e, "olist_item_loading"),
            hideProgress: removeClass.pbind(e, "olist_item_loading")
        })
    }
};
try {
    stManager.done("settings.js")
} catch (e) {}