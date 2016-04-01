function initPublicNewSection(e) {
    extend(cur, {
        showError: function(e) {
            return ge("new_public_error")
                .innerHTML = e, show("new_public_error"), scrollToTop(), !0
        },
        newPageSubmit: function(o) {
            var t = trim(val("new_public_name"));
            if (!t) return void notaBene("new_public_name");
            var n = window.radioBtns.new_public_type.val;
            return n ? isChecked("new_public_confirm") ? void ajax.post("al_public.php", {
                act: "a_new",
                name: t,
                type: n,
                hash: e.hash
            }, {
                onFail: function(e) {
                    return e ? cur.showError(e) : void 0
                },
                showProgress: lockButton.pbind(o),
                hideProgress: unlockButton.pbind(o)
            }) : void cur.showError(getLang("public_new_no_agreement_error")) : void cur.showError(getLang("public_new_no_type_error"))
        }
    })
}
window["public"] = window.Public = {
    toggleFave: function(e, o, t, n) {
        void 0 != cur.toggleFaveAct && (t = cur.toggleFaveAct), ajax.post("fave.php", {
            act: t ? "a_add_group" : "a_delete_group",
            gid: -cur.oid,
            hash: o
        }, {
            onDone: function(o) {
                e.firstChild.nextSibling.innerHTML = o, cur.toggleFaveAct = !t
            },
            progress: e.firstChild
        }), cancelEvent(n)
    },
    switchHelpSteps: function(e) {
        var o = ge("public_help_steps_module");
        hasClass(o, "closed") ? removeClass(o, "closed") : addClass(o, "closed"), ajax.post("al_public.php", {
            act: "a_switch_help_steps",
            pid: cur.options.public_id,
            hash: e
        }, {
            onDone: function() {}
        })
    },
    showMapBox: function(e, o, t) {
        if (!window.showZeroZoneBox || !showZeroZoneBox("places", function() {
                Public.showMapBox()
            })) {
            if (!cur.boxForMap) {
                var n = {
                    bodyStyle: "padding: 0;",
                    width: 597,
                    title: e,
                    onShow: function() {
                        cur.boxMap && cur.boxMap.redraw()
                    }
                };
                cur.boxForMap = showFastBox(n, '<div class="box_loader"></div>'), cur.boxForMap.setControlsText('<a href="' + t + '">' + getLang("events_goto_search") +
                    "</a>")
            }
            cur.boxMap ? cur.boxForMap.show() : (cur.boxForMap.content('<div id="boxMap" style="width: 595px; height: 500px"></div>'), cur.boxMap = new VkMap(ge("boxMap"), {
                type: "yandex",
                key: cur.mapKey,
                onReady: function() {
                    cur.boxMap.updateAddress({
                        str: e,
                        zoom: o
                    }), cur.boxForMap.setOptions({
                        title: cur.boxMap.getShowAddress()
                    }), cur.boxMap.updateMap()
                }
            }))
        }
    },
    showLinks: function(e) {
        var o = showBox("/al_public.php", {
            act: "a_get_links",
            pid: cur.options.public_id,
            type: e
        }, {
            params: {
                width: 467
            }
        });
        o.setOptions({
            onHideAttempt: function() {
                return cur.reloadAfterClose && (nav.reload({
                    noscroll: !0
                }), cur.reloadAfterClose = !1), !0
            }
        })
    },
    showEvents: function(e) {
        var o = showBox("/al_public.php", {
            act: "a_get_events",
            pid: cur.options.public_id,
            edit: e
        }, {
            params: {
                width: 467
            }
        });
        o.setOptions({
            onHideAttempt: function() {
                return cur.reloadAfterClose && (nav.reload({
                    noscroll: !0
                }), cur.reloadAfterClose = !1), !0
            }
        })
    },
    otherActs: function(e) {
        if (clearTimeout(cur.hideOtherTimer), !e) return !1;
        e.blur();
        var o = ge("page_other_acts");
        return isVisible(o) ? !1 : (o.style.marginLeft = "-1px", o.style.marginTop = "-21px", show(o), !1)
    },
    hideOther: function(e) {
        if (e > 0) cur.hideOtherTimer = setTimeout(cur.hideOther, e);
        else {
            var o = ge("page_other_acts"); - 1 == e ? hide(o) : fadeOut(o, 200)
        }
    },
    updateBlock: function(e, o) {
        e = ge(e), e && o && domPN(e)
            .replaceChild(se(o), e)
    },
    unSubscribe: function(el) {
        var sp, hp;
        if (el = ge(el), el && "button" == el.tagName.toLowerCase()) sp = lockButton.pbind(el), hp = unlockButton.pbind(el);
        else if (el) {
            if (el.firstChild && "progress" == el.firstChild.className) return;
            sp = function() {
                el.oldhtml = el.innerHTML, el.innerHTML = '<span class="progress" style="display: block"></span>'
            }, hp = function() {
                el.innerHTML = el.oldhtml
            }, window.Page && hasClass(el, "page_actions_btn") && Page.actionsDropdownHide(domPS(el), 1)
        }
        return ajax.post("al_public.php", {
            act: "a_leave",
            pid: cur.options.public_id,
            hash: cur.options.enterHash
        }, {
            onDone: function(status, followers, js) {
                Public.updateStatusHtml(ge("page_actions_btn"), status), Public.updateBlock("public_followers", followers), js && eval(js)
            },
            showProgress: sp,
            hideProgress: hp
        }), !1
    },
    subscribe: function(el) {
        var sp, hp;
        if (el = ge(el), el && "button" == el.tagName.toLowerCase()) sp = lockButton.pbind(el), hp = unlockButton.pbind(el);
        else if (el) {
            if (el.firstChild && "progress" == el.firstChild.className) return;
            sp = function() {
                el.oldhtml = el.innerHTML, el.innerHTML = '<span class="progress" style="display: block"></span>'
            }, hp = function() {
                el.innerHTML = el.oldhtml
            }, window.Page && hasClass(el, "page_actions_btn") && Page.actionsDropdownHide(domPS(el), 1)
        }
        return ajax.post("al_public.php", {
            act: "a_enter",
            pid: cur.options.public_id,
            hash: cur.options.enterHash
        }, {
            onDone: function(status, followers, js) {
                Public.updateStatusHtml(ge("public_subscribe"), status), Public.updateBlock("public_followers", followers), js && eval(js)
            },
            onFail: function(e) {
                return e ? (showFastBox({
                    title: getLang("global_error"),
                    onHide: nav.reload,
                    bodyStyle: "padding: 20px; line-height: 160%;"
                }, e), !0) : void 0
            },
            showProgress: sp,
            hideProgress: hp
        }), !1
    },
    updateStatusHtml: function(e, o) {
        var t = domPN(e),
            n = domPN(t),
            i = domPN(n),
            r = ce("div");
        t.innerHTML = o[1], r.appendChild(n), i.innerHTML = o[0] + r.innerHTML + o[2]
    },
    editEvent: function(e, o, t) {
        showBox("/al_page.php", {
            act: "a_edit_event_box",
            pid: e
        })
    },
    deleteEvent: function(e, o, t) {
        cur.reloadAfterClose = !0, ajax.post("al_public.php", {
            act: "a_delete_event",
            pid: e,
            eid: o,
            hash: t
        }, {
            onDone: function(o) {
                window.tooltips && tooltips.destroyAll(ge("public_event_cell" + e)), curBox()
                    .content(o)
            }
        })
    },
    searchApp: function(e, o) {
        e != cur.lastLink && ajax.post("al_public.php", {
            act: "a_search_app",
            pid: cur.options.public_id,
            page: e
        }, {
            onDone: function(e, t, n, i, r, a) {
                return e ? (ge("public_app_error_msg")
                    .innerHTML = e, void(cur.appId = !1)) : (cur.appHash = r, cur.appId = t, ge("public_app_error_msg")
                    .innerHTML = "", ge("public_app_image")
                    .innerHTML = n, ge("public_app_info")
                    .innerHTML = i, void 0 !== a && (ge("public_app_address")
                        .value = a), void(o && o(e)))
            }
        })
    },
    showPlaces: function(e) {
        var o = showBox("al_public.php", {
            act: "a_get_places",
            pid: cur.options.public_id,
            edit: e
        }, {
            params: {
                width: 467,
                progress: "qwerty"
            },
            stat: ["ui_controls.js", "ui_controls.css"]
        });
        o.setOptions({
            onHideAttempt: function() {
                return cur.reloadAfterClose && (nav.reload({
                    noscroll: !0
                }), cur.reloadAfterClose = !1), !0
            }
        })
    },
    addPlace: function(e) {
        showBox("al_page.php", {
            act: "a_edit_place_box",
            gid: e
        }, {
            stat: ["maps.js", "ui_controls.js", "ui_controls.css", "selects.js"]
        })
    },
    deletePlace: function(e, o, t) {
        return isVisible(curBox()
            .progess) ? !1 : (cur.reloadAfterClose = !0, curBox()
            .showProgress(), ajax.post("al_page.php", {
                act: "a_delete_place",
                gid: e,
                place_id: o,
                hash: t
            }, {
                progress: curBox()
                    .progress,
                onDone: function(e) {
                    curBox()
                        .content(e), curBox()
                        .hideProgress()
                }
            }), !1)
    },
    rssImport: function() {
        var e = showBox("al_public.php", {
            act: "set_rss_import_box",
            pid: cur.oid
        }, {
            params: {
                width: 410
            }
        });
        e.removeButtons(), e.addButton(getLang("global_cancel"), e.hide, "no"), e.addButton(getLang("global_save"), function() {
            ajax.post("al_public.php", {
                act: "a_set_rss_import",
                pid: cur.oid,
                url: ge("rss_import_url")
                    .value,
                hash: ge("rss_import_hash")
                    .value
            }, {
                onDone: function(e) {
                    ge("public_import_rss_tag")
                        .innerHTML = e
                }
            }), e.hide()
        }, "yes")
    },
    init: function(e) {
        extend(cur, {
            oid: -e.public_id,
            module: "public",
            options: e,
            postTo: -e.public_id,
            mid: -e.public_id,
            editing: !1,
            hideOther: Public.hideOther,
            otherActs: Public.otherActs,
            otherCount: e.otherCount,
            _back: {
                show: [],
                hide: [],
                text: e.back
            }
        }), ge("public_wall") && wall.init(extend(e, {
            automore: 1
        })), each(geByClass("_group_send_msg"), function(e, o) {
            addEvent(o, "click", Public.sendMessage.bind(this))
        })
    },
    sendMessage: function(e) {
        showWriteMessageBox(e, cur.oid)
    },
    toggleRss: function(e, o, t, n) {
        e.innerHTML = '<img src="/images/upload.gif" />', ajax.post("al_groups.php", {
            act: "a_toggle_rss",
            gid: o,
            hash: t
        }, {
            onDone: function(o) {
                e.innerHTML = o
            }
        })
    },
    toggleSubscription: function(e, o, t, n) {
        void 0 != cur.toggleSubscriptionAct && (t = cur.toggleSubscriptionAct), ajax.post("al_wall.php", {
            act: "a_toggle_posts_subscription",
            subscribe: t ? 1 : 0,
            oid: cur.oid,
            hash: o
        }, {
            onDone: function(o) {
                e.firstChild.nextSibling.innerHTML = o, cur.toggleSubscriptionAct = !t
            },
            progress: e.firstChild
        }), cancelEvent(n)
    },
    toggleTop: function(e, o, t, n, i) {
        e.innerHTML = '<img src="/images/upload.gif" />', ajax.post("al_groups.php", {
            act: "a_toggle_top",
            gid: o,
            hash: t,
            nocis: i
        }, {
            onDone: function(o) {
                e.innerHTML = o
            }
        })
    },
    toggleBrand: function(e, o, t, n) {
        e.innerHTML = '<img src="/images/upload.gif" />', ajax.post("al_groups.php", {
            act: "a_toggle_brand",
            gid: o,
            hash: t
        }, {
            onDone: function(o) {
                e.innerHTML = o
            }
        })
    },
    toggleStickers: function(e, o, t, n) {
        e.innerHTML = '<img src="/images/upload.gif" />', ajax.post("al_groups.php", {
            act: "a_toggle_stickers",
            gid: o,
            hash: t
        }, {
            onDone: function(o) {
                e.innerHTML = o
            }
        })
    },
    uploadPhotos: function(e, o) {
        var t = (window.XMLHttpRequest || window.XDomainRequest) && (window.FormData || window.FileReader && (window.XMLHttpRequest && XMLHttpRequest.sendAsBinary ||
            window.ArrayBuffer && window.Uint8Array && (window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)));
        if (!t || !o) return nav.go(e, o);
        if (checkEvent(o)) return !0;
        cur.onPhotoInputChange = function(t) {
            return window.filesToUpload = t, nav.go(e, o)
        };
        var n = ge("page_upload_photos_input");
        return n || (n = se(
            '<input id="page_upload_photos_input" class="file page_upload_photos_input" type="file" onchange="cur.onPhotoInputChange(this.files);" multiple="true" accept="image/jpeg,image/png,image/gif" name="photo" />'
        )), n.click(o), !1
    }
}, window.showMapBox = Public.showMapBox;
var PagedList = function(e, o, t) {
    function n(e) {
        for (var o = [], t = 0; t < e.length; ++t) o[t] = e[t];
        return o
    }
    var i = function(e, o) {
            if (!isArray(e) || !isArray(o)) return e == o;
            for (var t = 0; t < e.length; ++t)
                if (e[t] != o[t]) return !1;
            return !0
        },
        r = {
            getRow: function(e) {
                return ""
            },
            setPages: function(e, o, t) {},
            filter: function(e, o) {
                return !0
            },
            perPage: 30,
            emptyRow: function(e) {
                return "<div>no rows</div>"
            }
        };
    t = t ? extend(r, t) : r, this.data = o;
    for (var a = [], s = 0; s < o.length; ++s) a.push(o[s]);
    var l = [],
        p = 0;
    this.setData = function(e) {
        this.data = e, this.getPage(0, l, !0)
    };
    var c = t.getRow.bind(this);
    this.getPage = function(o, r, s) {
        if (void 0 === r && (r = l), p != o || !i(r, l) || s) {
            if (p = o, t.onStart && t.onStart(), !i(r, l)) {
                l = n(r), a = [];
                for (var u = 0; u < this.data.length; ++u)(!r || t.filter(r, this.data[u])) && a.push(this.data[u])
            }
            if (!a.length) return ge(e)
                .innerHTML = t.emptyRow(r), t.setPages(0, 0, "top"), void t.setPages(0, 0, "bottom");
            for (var d = [], u = o * t.perPage; u < Math.min(a.length, (o + 1) * t.perPage); ++u) {
                var g = a[u];
                d.push(c(g, l))
            }
            var h = getSize(ge(e))[1];
            if (ge(e)
                .innerHTML = d.join(""), setStyle(ge(e), {
                    height: o ? h : "auto"
                }), t.onShow)
                for (var u = o * t.perPage; u < Math.min(a.length, (o + 1) * t.perPage); ++u) {
                    var g = a[u];
                    t.onShow(g, u)
                }
            var _ = Math.ceil(a.length / t.perPage);
            t.setPages(o, _, "top"), t.setPages(o, _, "bottom"), t.onEnd && t.onEnd()
        }
    }, this.highlight = function(e, o) {
        if (o = trim(o), !o) return e;
        e = -1 == o.indexOf(" ") ? e.split(" ") : [e];
        var t = "",
            n = parseLatin(o);
        null != n && (o = o + "|" + n);
        var i = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + o.replace("+", "\\+") + "))(?![^<>]*>)(?![^&;]+;)", "gi");
        for (var r in e) t += (r > 0 ? " " : "") + e[r].replace(i, "$2<em>$3</em>");
        return t
    }
};
window.replaceChars = function(e, o) {
    for (var t = "", n = 0; n < e.length; n++) {
        var i = e.charCodeAt(n);
        switch (i) {
            case 38:
                t += "&amp;";
                break;
            case 60:
                t += "&lt;";
                break;
            case 62:
                t += "&gt;";
                break;
            case 34:
                t += "&quot;";
                break;
            case 13:
                t += "";
                break;
            case 10:
                t += o ? "	" : "<br>";
                break;
            case 33:
                t += "&#33;";
                break;
            case 39:
                t += "&#39;";
                break;
            default:
                t += i > 128 && 192 > i || i > 1280 ? "&#" + i + ";" : e.charAt(n)
        }
    }
    return t
};
try {
    stManager.done("public.js")
} catch (e) {}
