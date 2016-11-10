var Groups = {
    init: function(o) {
        if (extend(cur, {
                module: "groups",
                hideOther: Groups.hideOther,
                otherActs: Groups.otherActs,
                options: o,
                oid: -o.group_id,
                postTo: -o.group_id,
                _back: {
                    loc: o.loc,
                    show: [],
                    hide: [],
                    text: o.back
                }
            }), ge("group_wall") && wall.init(extend(o, {
                automore: 1
            })), cur.nav.push(function(o) {
                o[0] && clearTimeout(Groups.keyTO)
            }), o.cntKey && Groups.subscribe(o.cntKey), o.age_disclaimer) {
            var e = !1,
                n = function() {
                    e || (o.age_disclaimer_back ? history.back() : location.href = "/")
                },
                t = showFastBox({
                        title: getLang("groups_age_warning"),
                        width: 470,
                        hideOnBGClick: !1,
                        onHide: n,
                        forceNoBtn: 1
                    }, '<div class="group_age_disclaimer">' + getLang("groups_age_disclaimer") +
                    '<br><div class="checkbox group_age_checkbox" onclick="checkbox(this); disableButton(curBox().proceedButton, !isChecked(this))"><div></div>' + getLang(
                        "groups_age_accepted") + "</div></div>");
            t.removeButtons();
            var s = t.addButton(getLang("global_cancel"), n, "no", !0);
            addClass(s, "group_age_disclaimer_close"), t.proceedButton = t.addButton(getLang("groups_age_approve"), function() {
                e = !0, removeClass(ge("group"), "hidden"), t.hide(), o.age_disclaimer_hash ? ajax.post("al_groups.php", {
                    act: "a_set_user_age",
                    hash: o.age_disclaimer_hash
                }) : setCookie("remixage18", 1), cur.zNavInfo && zNav(cur.zNavInfo.info, cur.zNavInfo.opts)
            }, "yes", !0);
            var a = geByClass1("box_controls", domPN(t.bodyNode));
            addClass(a, "group_age_disclaimer_box"), replaceClass(domFC(a), "fl_r", "fl_l"), disableButton(t.proceedButton, 1)
        }
    },
    switchTab: function(o, e, n) {
        return checkEvent(n) ? !0 : "wiki" == e && hasClass(o, "ui_tab_sel") ? nav.go(o, n) : (ge("page_info_wrap")
            .className = "page_info_wrap " + e, uiTabs.switchTab(o))
    },
    toggleFave: function(o, e, n, t) {
        void 0 != cur.toggleFaveAct && (n = cur.toggleFaveAct), ajax.post("fave.php", {
            act: n ? "a_add_group" : "a_delete_group",
            gid: -cur.oid,
            hash: e
        }, {
            onDone: function(e) {
                val(o, e), cur.toggleFaveAct = !n
            },
            showProgress: window.Page && Page.actionsDropdownLock.pbind(o),
            hideProgress: window.Page && Page.actionsDropdownUnlock.pbind(o)
        }), cancelEvent(t)
    },
    showInviteBox: function(o, e) {
        return !showBox("al_page.php", {
            act: "a_invite_box",
            gid: e
        }, {
            params: {
                bodyStyle: "padding: 0px;",
                width: 560
            }
        }, o)
    },
    votingUpdate: function(html, js) {
        var mod = ge("group_voting");
        mod.parentNode.replaceChild(ce("div", {
                innerHTML: html
            })
            .firstChild, mod), js && eval(js)
    },
    vote: function(o, e, n, t) {
        radiobtn(o, t, "vote_option" + n);
        var s = hasClass(o.firstChild, "progress") ? o.firstChild : o.insertBefore(ce("span", {
            className: "fl_r progress"
        }), o.firstChild);
        ajax.post("al_voting.php", {
            act: "vote",
            option_id: t,
            owner_id: e,
            voting_id: n,
            hash: cur.polls[n].hash
        }, {
            onDone: Groups.votingUpdate,
            progress: s
        })
    },
    subscribe: function(o) {
        window.Notifier && Notifier.addKey(o, Groups.updates), Groups.keyTO = setTimeout(Groups.subscribe, 3e4)
    },
    votingAction: function(o) {
        var e = 0;
        switch (o) {
            case 101:
                o = "openclose", e = 0;
                break;
            case 102:
                o = "openclose", e = 1;
                break;
            case 103:
                o = "tomain", e = 0;
                break;
            case 104:
                o = "tomain", e = 1
        }
        ajax.post("al_voting.php", {
            act: o,
            owner_id: cur._voting.oid,
            voting_id: cur._voting.vid,
            state: e,
            context: "group",
            hash: cur._voting.hash
        }, {
            onDone: Groups.votingUpdate
        })
    },
    toggleFeedIgnored: function(o, e, n) {
        ajax.post("al_feed.php", {
            act: cur.options.ignored_news ? "a_unignore_owner" : "a_ignore_owner",
            owner_id: cur.oid,
            hash: e,
            from: "group"
        }, {
            onDone: function(e) {
                val(o, e), cur.options.ignored_news = !cur.options.ignored_news
            },
            showProgress: window.Page && Page.actionsDropdownLock.pbind(o),
            hideProgress: window.Page && Page.actionsDropdownUnlock.pbind(o)
        }), cancelEvent(n)
    },
    toggleLiveSubscription: function(o, e, n) {
        ajax.post("al_video.php", {
            act: cur.options.ignored_lives ? "a_subscribe_live" : "a_unsubscribe_live",
            owner_id: cur.oid,
            hash: e,
            from: "group"
        }, {
            onDone: function(e) {
                val(o, e), cur.options.ignored_lives = !cur.options.ignored_lives
            },
            showProgress: window.Page && Page.actionsDropdownLock.pbind(o),
            hideProgress: window.Page && Page.actionsDropdownUnlock.pbind(o)
        }), cancelEvent(n)
    },
    showLinks: function() {
        var o = showBox("al_groups.php", {
            act: "show_links",
            oid: cur.oid
        });
        o.setOptions({
            onHideAttempt: function() {
                return cur.reloadAfterClose && (nav.reload({
                    noscroll: !0
                }), cur.reloadAfterClose = !1), !0
            }
        })
    },
    showEvents: function() {
        var o = showBox("al_groups.php", {
            act: "show_events",
            oid: cur.oid
        });
        o.setOptions({
            onHideAttempt: function() {
                return cur.reloadAfterClose && (nav.reload({
                    noscroll: !0
                }), cur.reloadAfterClose = !1), !0
            }
        })
    },
    updateCnt: function(o) {
        o = parseInt(o);
        var e = geByClass1("_group_message_cnt");
        e && (e.textContent = o, toggleClass(e, "unshown", 0 === o))
    },
    updates: function(o, e) {
        each(e.events, function(o, e) {
            var n = e.split("<!>"),
                t = n[1];
            switch (t) {
                case "update_cnt":
                    Groups.updateCnt(n[4])
            }
        })
    },
    updateActions: function(o, e, n) {
        val("page_actions", o);
        var t = geByClass1("_page_actions_container");
        t && e && domPN(t)
            .replaceChild(se(e), t), void 0 !== n && val("group_moder_info", n)
    },
    enter: function(o, e, n, t, s) {
        var a, i;
        if (o = ge(o), hasClass(o, "flat_button")) a = lockButton.pbind(o), i = unlockButton.pbind(o);
        else {
            if (o.firstChild && "progress" == o.firstChild.className) return;
            a = function() {
                o.oldhtml = o.innerHTML, o.innerHTML = '<span class="progress" style="display: block"></span>'
            }, i = function() {
                o.innerHTML = o.oldhtml
            }
        }
        window.Page && hasClass(o, "page_actions_btn") && Page.actionsDropdownHide(domPS(o), 1), ajax.post("al_groups.php", {
            act: "enter",
            gid: e,
            hash: n,
            context: t
        }, {
            onDone: function(o, e) {
                if (s) return s();
                Groups.updateActions(o, e), toggle("page_actions", o);
                var n = geByClass1("_groups_invite_block");
                n && slideUp(n, 200), nav.reload({
                    noframe: !0,
                    noscroll: !0
                })
            },
            onFail: function(o) {
                return o ? (setTimeout(showFastBox({
                        title: getLang("global_error"),
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, o)
                    .hide, 3e3), !0) : void 0
            },
            showProgress: a,
            hideProgress: i
        })
    },
    confirm: function(o, e, n, t, s) {
        var a = showFastBox({
            title: getLang("global_warning"),
            bodyStyle: "padding: 20px; line-height: 160%;"
        }, getLang(o), getLang("group_leave_group"), function() {
            a.hide(), Groups.leave(e, n, t, s)
        }, getLang("global_cancel"))
    },
    leave: function(o, e, n, t, s) {
        var a, i;
        if (o = ge(o), hasClass(o, "flat_button")) a = lockButton.pbind(o), i = unlockButton.pbind(o);
        else {
            if (o.firstChild && "progress" == o.firstChild.className) return;
            a = function() {
                o.oldhtml = o.innerHTML, o.innerHTML = '<span class="progress" style="display: block"></span>'
            }, i = function() {
                o.innerHTML = o.oldhtml
            }
        }
        window.Page && hasClass(o, "page_actions_btn") && Page.actionsDropdownHide(domPS(o), 1), ajax.post("al_groups.php", {
            act: "leave",
            gid: e,
            hash: n,
            context: t
        }, {
            onDone: function(o, e) {
                if (s) return s();
                Groups.updateActions(o, e), toggle("page_actions", o);
                var n = geByClass1("_groups_invite_block");
                n && slideUp(n, 200), nav.reload({
                    noframe: !0
                })
            },
            showProgress: a,
            hideProgress: i
        })
    },
    otherActs: function(o) {
        if (clearTimeout(cur.hideOtherTimer), !o) return !1;
        o.blur();
        var e = ge("page_other_acts");
        return isVisible(e) ? !1 : (e.style.marginLeft = "-1px", e.style.marginTop = "-21px", show(e), !1)
    },
    hideOther: function(o) {
        if (o > 0) cur.hideOtherTimer = setTimeout(cur.hideOther, o);
        else {
            var e = ge("page_other_acts"); - 1 == o ? hide(e) : fadeOut(e, 200)
        }
    },
    toggleTop: function(o, e, n, t, s) {
        ajax.post("al_groups.php", {
            act: "a_toggle_top",
            gid: e,
            hash: n,
            nocis: s
        }, {
            onDone: function(e) {
                o.innerHTML = e
            },
            showProgress: window.Page && Page.actionsDropdownLock.pbind(o),
            hideProgress: window.Page && Page.actionsDropdownUnlock.pbind(o)
        })
    },
    toggleStickers: function(o, e, n, t) {
        ajax.post("al_groups.php", {
            act: "a_toggle_stickers",
            gid: e,
            hash: n
        }, {
            onDone: function(e) {
                o.innerHTML = e
            },
            showProgress: window.Page && Page.actionsDropdownLock.pbind(o),
            hideProgress: window.Page && Page.actionsDropdownUnlock.pbind(o)
        })
    },
    toggleFastAccess: function(o, e, n) {
        function t(n) {
            var t = n ? getLang("groups_fast_menu_access_invert") : getLang("groups_fast_menu_access");
            val(o, t), o.setAttribute("data-value", n), "groups_list" == cur.module && window.GroupsList && GroupsList.updateGroupField(e, 11, n)
        }
        var s = 1 ^ intval(o.getAttribute("data-value")),
            a = hasClass(o, "page_actions_item") || hasClass(o, "ui_actions_menu_item");
        return ajax.post("al_settings.php", {
            act: "a_toggle_admin_fast",
            gid: e,
            hash: n,
            update_menu: 1
        }, {
            onDone: function(o, e) {
                a && t(o), geByTag1("ol", ge("side_bar"))
                    .innerHTML = e, window.Notifier && Notifier.resetCommConnection()
            },
            onFail: function(o) {
                return a || t(0), "too_much_groups" !== o ? !1 : (showFastBox(getLang("global_error"), getLang("groups_left_menu_full", 5)), !0)
            }.bind(),
            showProgress: a && function() {
                hasClass(o, "page_actions_item") ? window.Page && Page.actionsDropdownLock(o) : lockActionsMenuItem(o)
            },
            hideProgress: a && function() {
                hasClass(o, "page_actions_item") ? window.Page && Page.actionsDropdownUnlock(o) : unlockActionsMenuItem(o)
            }
        }), a || t(s), !1
    },
    showMapBox: function(o, e, n) {
        window.showZeroZoneBox && showZeroZoneBox("places", function() {
            events.showMapBox(o, e, n)
        }) || showTabbedBox("/al_places.php", {
            act: "show_photo_place",
            place_id: o
        }, {
            stat: ["places.css", "map.css", "maps.js", "ui_controls.css", "ui_controls.js"]
        })
    },
    showAddressBox: function(o, e) {
        window.showZeroZoneBox && showZeroZoneBox("places", function() {
            events.showAddressBox(o, e)
        }) || showBox("places.php", {
            act: "a_get_address_box",
            country: o,
            address: e
        }, {
            stat: ["places.css", "map.css", "maps.js", "ui_controls.css", "ui_controls.js"],
            params: {
                width: 640,
                bodyStyle: "padding:0;"
            }
        })
    },
    uploadPhotos: function(o, e) {
        var n = (window.XMLHttpRequest || window.XDomainRequest) && (window.FormData || window.FileReader && (window.XMLHttpRequest && XMLHttpRequest.sendAsBinary ||
            window.ArrayBuffer && window.Uint8Array && (window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)));
        if (!n || !e) return nav.go(o, e);
        if (checkEvent(e)) return !0;
        cur.onPhotoInputChange = function(n) {
            return window.filesToUpload = n, nav.go(o, e)
        };
        var t = ge("page_upload_photos_input");
        return t || (t = se(
            '<input id="page_upload_photos_input" class="file page_upload_photos_input" type="file" onchange="cur.onPhotoInputChange(this.files);" multiple="true" accept="image/jpeg,image/png,image/gif" name="photo" />'
        )), t.click(e), !1
    }
};
try {
    stManager.done("groups.js")
} catch (e) {}
