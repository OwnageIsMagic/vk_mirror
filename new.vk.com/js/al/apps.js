function appCallback(t) {
    var e = t.shift();
    return cur.app && cur.app.funcs ? (cur.app.funcs[e] || setTimeout(function() {
        throw new Error("unsupported app method: " + e)
    }, 0), setTimeout(function(i) {
        return i.app.funcs[e].apply(i.app, t)
    }.pbind(cur), 0), !0) : !0
}
window._iconAdd || (window._iconAdd = window.devicePixelRatio >= 2 ? "_2x" : ""),
    function(t) {
        function e() {
            var t = "";
            for (i = 0; i < 5; i++) t += Math.ceil(15 * Math.random())
                .toString(16);
            return t
        }

        function s(t, e, i, o, a) {
            t[e] ? i.apply(o) : (a = a || 0, 1e3 > a && setTimeout(function() {
                s(t, e, i, o, a + 1)
            }, 0))
        }

        function o(e) {
            setTimeout(function() {
                var i = document.createElement("script");
                i.type = "text/javascript", i.src = e || t.fastXDM.helperUrl, s(document, "body", function() {
                    document.getElementsByTagName("HEAD")[0].appendChild(i)
                })
            }, 0)
        }

        function a(t, e) {
            d.loaded ? t.apply(e, [d]) : p.push([e, t])
        }

        function n() {
            if (d.loaded = !0, p.length > 0)
                for (callback in p) p[callback][1].apply(p[callback][0], [d])
        }

        function r(t, e) {
            a(function(s) {
                var o = s.json.parse(t);
                if (o[0]) {
                    o[1] || (o[1] = []);
                    for (i in o[1])
                        if (o[1][i] && o[1][i]._func) {
                            var a = o[1][i]._func;
                            o[1][i] = function() {
                                var t = Array.prototype.slice.call(arguments);
                                t.unshift("_func" + a), e.callMethod.apply(e, t)
                            }
                        }
                    setTimeout(function() {
                        if (!e.methods[o[0]]) throw Error("fastXDM: Method " + o[0] + " is undefined");
                        e.methods[o[0]].apply(e, o[1])
                    }, 0)
                }
            })
        }

        function c(t, e) {
            for (var i in e) t[i] && "object" == typeof t[i] ? c(t[i], e[i]) : t[i] = e[i]
        }
        if (!t.fastXDM) {
            var l = {},
                p = [],
                d = {};
            t.fastXDM = {
                    _id: 0,
                    helperUrl: "http://userapi.com/js/api/xdmHelper.js",
                    Server: function(i) {
                        this.methods = i || {}, this.id = t.fastXDM._id++, this.key = e(), this.methods["%init%"] = this.methods.__fxdm_i = function() {
                            t.fastXDM.run(this.id), this.methods.onInit && this.methods.onInit()
                        }, this.frameName = "fXD" + this.key, this.server = !0, l[this.key] = [r, this]
                    },
                    Client: function(e) {
                        if (this.methods = e || {}, this.id = t.fastXDM._id++, t.fastXDM.run(this.id), 0 != window.name.indexOf("fXD")) throw Error(
                            "Wrong window.name property.");
                        this.key = window.name.substr(3), this.caller = window.parent, l[this.key] = [r, this], this.client = !0, t.fastXDM.on("helper", function() {
                            t.fastXDM.onClientStart(this)
                        }, this), a(function(t) {
                            t.send(this, t.json.stringify(["%init%"]));
                            var e = this.methods;
                            setTimeout(function() {
                                e.onInit && e.onInit()
                            }, 0)
                        }, this)
                    },
                    onMessage: function(t) {
                        if (!t.data || "string" != typeof t.data) return !1;
                        var e = t.data.substr(0, 5);
                        l[e] && l[e][0](t.data.substr(6), l[e][1])
                    },
                    setJSON: function(t) {
                        d.json = t
                    },
                    getJSON: function(t) {
                        return t ? void a(function(e) {
                            t(e.json)
                        }) : d.json
                    },
                    setEnv: function(t) {
                        for (i in t) d[i] = t[i];
                        n()
                    },
                    _q: {},
                    on: function(t, e, i) {
                        this._q[t] || (this._q[t] = []), -1 == this._q[t] ? e.apply(i) : this._q[t].push([e, i])
                    },
                    run: function(t) {
                        if (this._q[t] && this._q[t].length > 0)
                            for (i in this._q[t]) this._q[t][i][0].apply(this._q[t][i][1]);
                        this._q[t] = -1
                    },
                    waitFor: s
                }, t.fastXDM.Server.prototype.start = function(e, i) {
                    if (e.contentWindow) this.caller = e.contentWindow, this.frame = e, t.fastXDM.on("helper", function() {
                        t.fastXDM.onServerStart(this)
                    }, this);
                    else {
                        var s = this;
                        i = i || 0, 50 > i && setTimeout(function() {
                            s.start.apply(s, [e, i + 1])
                        }, 100)
                    }
                }, t.fastXDM.Server.prototype.destroy = function() {
                    l && l.indexOf && l.splice(l.indexOf(this.key), 1)
                }, t.fastXDM.Server.prototype.append = function(t, e, i) {
                    var s = document.createElement("DIV");
                    s.innerHTML = '<iframe name="' + this.frameName + '" ' + (i || "") + " />";
                    var o = s.firstChild,
                        a = this;
                    return setTimeout(function() {
                        o.frameBorder = "0", e && c(o, e), t.insertBefore(o, t.firstChild), a.start(o)
                    }, 0), o
                }, t.fastXDM.Client.prototype.callMethod = t.fastXDM.Server.prototype.callMethod = function() {
                    var e = Array.prototype.slice.call(arguments),
                        o = e.shift();
                    for (i in e)
                        if ("function" == typeof e[i]) {
                            this.funcsCount = (this.funcsCount || 0) + 1;
                            var n = e[i],
                                r = "_func" + this.funcsCount;
                            this.methods[r] = function() {
                                n.apply(this, arguments), delete this.methods[r]
                            }, e[i] = {
                                _func: this.funcsCount
                            }
                        }
                    s(this, "caller", function() {
                        t.fastXDM.on(this.id, function() {
                            a(function(t) {
                                t.send(this, t.json.stringify([o, e]))
                            }, this)
                        }, this)
                    }, this)
                }, t.JSON && "object" == typeof t.JSON && t.JSON.parse && t.JSON.stringify && '{"a":[1,2,3]}' == t.JSON.stringify({
                    a: [1, 2, 3]
                })
                .replace(/ /g, "") ? d.json = {
                    parse: t.JSON.parse,
                    stringify: t.JSON.stringify
                } : t.fastXDM._needJSON = !0, t.postMessage ? (d.protocol = "p", d.send = function(t, e) {
                    t.caller.postMessage(t.key + ":" + e, "*")
                }, t.addEventListener ? t.addEventListener("message", t.fastXDM.onMessage, !1) : t.attachEvent("onmessage", t.fastXDM.onMessage), t.fastXDM._needJSON ? (t.fastXDM
                    ._onlyJSON = !0, o()) : n()) : o()
        }
    }(window);
var vkApp = function(t, e, i, s) {
    if (i = i || {}, e = e || {}, window.parent && window.parent != window && !e.checking) return !1;
    var o = this;
    if (this.cont = ge(t), this.cont) {
        if (i.hash = i.hash || "", -1 != i.hash.indexOf("#")) {
            var a = i.hash.split("#")
                .pop();
            (a || "")
            .substr(0, 1) == vk.navPrefix ? i.hash = "" : i.hash = a
        }
        if (this.params = i, this.onReady = new Array, 1 == e.type) {
            var n = e.src,
                r = [];
            for (var c in i) "hash" == c ? r.push(c + "=" + encodeURIComponent(i[c])) : r.push(c + "=" + i[c]);
            n += (-1 == n.indexOf("?") ? "?" : "&") + r.join("&")
        }
        e.inlineApp && (o.inlineApp = !0), o.options = extend({
            heightMax: 4500
        }, e), this.funcs = {
            onInit: function() {
                return e.heightSync && o.RPC.callMethod("getHeight", function(t) {
                    o.setHeight(t)
                }), o.inited || (o.inited = !0, s && s(), o.inlineApp || o.onAppReady()), !0
            },
            ApiCall: function(t, e) {
                var i = t.shift();
                o.api(i, t[0], e)
            },
            _getAppInfo: function(t) {
                t([o.params.api_id, window.location.hash])
            },
            api: function(t, e, i) {
                o.api(e, i, function(e) {
                    o.apiCallback(t, e)
                })
            },
            setHeight: function(t) {
                o.setHeight(t)
            },
            scrollWindow: function(t, e) {
                if (!o.inlineApp) {
                    var i = Math.max(t, 0);
                    e = intval(e), e && e > 0 ? (animate(htmlNode, {
                        scrollTop: i
                    }, e), animate(bodyNode, {
                        scrollTop: i
                    }, e)) : window.scroll(0, i)
                }
            },
            scrollTop: function(t) {
                var e = window.innerHeight || document.documentElement.clientHeight || bodyNode.clientHeight;
                cur.appTopOffset || (cur.appTopOffset = getXY(cur.app.cont)[1]);
                var i = 0;
                curNotifier && curNotifier.idle_manager && curNotifier.idle_manager.is_idle && (i = 1), cur.app.runCallback("onScrollTop", parseInt(scrollGetY()),
                    parseInt(e), parseInt(cur.appTopOffset), i)
            },
            scrollSubscribe: function(t) {
                var e = function() {
                        var t = window.innerHeight || document.documentElement.clientHeight || bodyNode.clientHeight;
                        o.runCallback("onScroll", parseInt(scrollGetY()), parseInt(t))
                    },
                    i = function() {
                        addEvent(browser.msie6 ? pageNode : window, "scroll", e)
                    };
                i(), t && e(), cur._back ? (cur._back.show.push(i), cur._back.hide.push(function() {
                    removeEvent(browser.msie6 ? pageNode : window, "scroll", e)
                })) : cur.destroy.push(function() {
                    removeEvent(browser.msie6 ? pageNode : window, "scroll", e)
                })
            },
            saveWallPost: function(t) {
                showBox("al_apps.php", {
                    act: "save_wall_post_box",
                    hash: t,
                    aid: cur.aid
                }, {
                    params: {
                        dark: 1
                    }
                })
            },
            showRequestBox: function(t, e, i) {
                showBox("al_apps.php", {
                    act: "show_request_box",
                    aid: cur.aid,
                    message: e,
                    uid: t,
                    request_key: i
                }, {
                    params: {
                        width: 430,
                        dark: 1
                    },
                    onFail: function(t) {
                        return cur.app.runCallback("onRequestFail", t), !0
                    }
                })
            },
            showInstallPushBox: function() {
                showBox("al_apps.php", {
                    act: "show_install_push_box",
                    aid: cur.aid
                }, {
                    params: {
                        width: 430,
                        dark: 1
                    },
                    onFail: function(t) {
                        return cur.app.runCallback("onInstallPushFail", t), !0
                    }
                })
            },
            showProfilePhotoBox: function(t) {
                showBox("al_apps.php", {
                    act: "show_profile_photo_box",
                    hash: t,
                    aid: cur.aid
                }, {
                    params: {
                        dark: 1
                    }
                })
            },
            setTitle: function(t) {
                if (!o.inlineApp) {
                    t = t.replace(/[<>]+/gi, "");
                    var e = cur.backLang;
                    e = e ? e : getLang("global_vkontakte"), document.title = e + (t ? " | " + t : "")
                }
            },
            resizeWindow: function(t, e) {
                o.setWidth(t), o.setHeight(e)
            },
            getLocationProtocol: function(t) {
                t(location.protocol)
            },
            setLocation: function(t, e) {
                t = t.toString(), cur.appLoc = t, e && cur.app.runCallback("onLocationChanged", t), nav.setLoc(extend(nav.objLoc, {
                    "#": t
                }))
            },
            setNavigation: function() {},
            showInstallBox: function() {
                if (cur.appUser) Apps.onAppAdded();
                else {
                    if (cur.installBoxShown) return;
                    cur.installBoxShown = !0;
                    var t = showBox("apps", {
                        act: "install_box",
                        aid: e.aid
                    }, {
                        params: {
                            dark: 1
                        }
                    });
                    t.setOptions({
                        onHide: function() {
                            setTimeout(function() {
                                cur.installBoxShown = !1
                            }, 3e3)
                        }
                    })
                }
            },
            showSettingsBox: function(t) {
                if (!cur.settingsBoxShown) {
                    cur.settingsBoxShown = !0;
                    var i = showBox("apps", {
                        act: "settings_box",
                        aid: e.aid,
                        mask: t
                    }, {
                        params: {
                            dark: 1,
                            width: 550
                        }
                    });
                    i.setOptions({
                        onHide: function() {
                            setTimeout(function() {
                                cur.settingsBoxShown = !1
                            }, 3e3)
                        }
                    })
                }
            },
            showInviteBox: function() {
                Apps.showInviteBox(e.aid, e.hash)
            },
            showPaymentBox: function(t) {
                showBox("al_apps.php", {
                    act: "show_payment_box",
                    votes: t,
                    aid: e.aid
                }, {
                    params: {
                        dark: 1
                    }
                })
            },
            showLeadsPaymentBox: function(t) {
                showBox("al_apps.php", {
                    act: "show_payment_box",
                    aid: e.aid,
                    offers: isArray(t) ? t.join(",") : intval(t) || 1
                }, {
                    params: {
                        dark: 1
                    }
                })
            },
            showOrderBox: function(t) {
                if ("object" != typeof t) {
                    var i = Array.prototype.slice.call(arguments);
                    t = {}, each(i, function() {
                        var e = this.split("=");
                        2 == e.length && (t[e[0]] = e[1])
                    })
                }
                var s = {};
                for (var o in t) inArray(o, ["type", "votes", "offer_id", "item", "currency"]) && (s[o] = t[o] + "");
                "offers" == s.type && isArray(s.offer_id) && (s.offer_id = s.offer_id.join(",")), s.act = "show_order_box", s.aid = e.aid, s.hash = e.hash, showBox(
                    "al_apps.php", s, {
                        params: {
                            dark: 1
                        },
                        onFail: function(t) {
                            return showFastBox({
                                title: getLang("global_error")
                            }, t), !0
                        }
                    }), cur.onAppOrderCancel = function() {
                    cur.app.runCallback("onOrderCancel")
                }, cur.onAppOrderSuccess = function(t) {
                    cur.app.runCallback("onOrderSuccess", t)
                }, cur.onAppOrderFail = function(t) {
                    cur.app.runCallback("onOrderFail", t)
                }
            },
            showMerchantPaymentBox: function(t) {
                if (!o.inlineApp) {
                    if ("object" != typeof t) {
                        var e = Array.prototype.slice.call(arguments);
                        t = {}, each(e, function() {
                            var e = this.split("=");
                            2 == e.length && (t[e[0]] = e[1])
                        })
                    }
                    var i = {};
                    for (var s in t)
                        if ("merchant_id" != s && "required_fields" != s)
                            if (0 != s.indexOf("custom_")) {
                                if (0 == s.indexOf("item_")) {
                                    var a = s.substr(5),
                                        n = ["id_", "name_", "description_", "price_", "currency_", "quantity_", "photo_url_", "digital_"],
                                        r = !1;
                                    for (var c in n)
                                        if (0 == a.indexOf(n[c])) {
                                            r = !0;
                                            break
                                        }
                                    if (r) {
                                        i[s] = t[s];
                                        continue
                                    }
                                }
                            } else i[s] = t[s];
                    else i[s] = t[s];
                    var l = 1;
                    "test_mode" in t && (l = "0" == t.test_mode.toString() ? 0 : 1), i.show_in_box = 1;
                    var p = l ? "al_paytest.php" : "al_pay.php";
                    cur.payMerchantBox = showBox(p, i, {
                        params: {
                            bodyStyle: "padding: 0;",
                            width: 534,
                            dark: 1
                        },
                        stat: ["selects.js", "pay.css", "ui_controls.js", "ui_controls.css"],
                        onFail: function(t) {
                            return showFastBox({
                                title: getLang("global_error")
                            }, t), !0
                        }
                    }), cur.onMerchantPaymentCancel = function() {
                        cur.app.runCallback("onMerchantPaymentCancel")
                    }, cur.onMerchantPaymentSuccess = function(t) {
                        cur.app.runCallback("onMerchantPaymentSuccess", t)
                    }, cur.onMerchantPaymentFail = function(t) {
                        cur.app.runCallback("onMerchantPaymentFail", t)
                    }
                }
            },
            showPortlet: function(t) {
                return !1
            },
            addToMenu: function() {
                ajax.post("al_apps.php", {
                    act: "add_left_menu",
                    aid: cur.aid,
                    hash: cur.app.options.hash
                }, {
                    onDone: function(t) {
                        Apps.updateLeftNav(t.left_nav), t.left_nav_error && showFastBox({
                            title: getLang("global_error")
                        }, t.left_nav_error), Apps.updateAddToMenuAction()
                    }
                })
            },
            adsPublish: function() {
                AdsLight.handleEvent.apply(AdsLight, arguments)
            },
            callUser: function(t, e, i) {
                showBox("al_apps.php", {
                    act: "call_user",
                    uid: t,
                    key: e,
                    aid: cur.aid,
                    msg: i
                }, {
                    dark: 1,
                    onFail: function(t) {
                        return cur.app.runCallback("onCallFail", t), !0
                    }
                })
            },
            debug: function() {
                debugLog(1 == arguments.length ? arguments[0] : arguments)
            }
        }, i.widget ? (o.options.type = 1, o.options.widget = !0) : (renderFlash(ge("flash_api_external_cont"), {
            url: "/swf/api_external.swf",
            id: "flash_api_external",
            width: 1,
            height: 1,
            preventhide: 1,
            version: 9
        }, {
            allowFullScreen: !0,
            allowscriptaccess: "always",
            allownetworking: "all",
            wmode: "opaque"
        }, {
            debug: i.debug ? 1 : 0,
            lc_name: i.lc_name
        }), o.externalFrame = ge("flash_api_external"));
        var l = o.options.wmode || "opaque";
        if (o.options.no_init) return !1;
        var p = 1;
        switch (o.options.type) {
            case 1:
                this.RPC = new fastXDM.Server(this.funcs);
                var d = {
                    src: n,
                    width: "100%",
                    overflow: "hidden",
                    scrolling: "no"
                };
                o.options.widget || (d.height = o.options.height + "px"), this.frame = this.RPC.append(o.cont, d,
                    'webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"');
                break;
            case 2:
                debugLog("is wrapper");
                var u = {
                    url: e.src,
                    id: "flash_app",
                    width: o.options.width,
                    height: o.options.height,
                    version: 10
                };
                "opaque" == l && (u.preventhide = 1), p = renderFlash(o.cont, u, {
                    allowFullScreen: !0,
                    allowscriptaccess: "never",
                    allowFullScreenInteractive: "true",
                    allownetworking: "all",
                    bgcolor: "#F7F7F7",
                    wmode: l
                }, i), o.frame = ge("flash_app");
                break;
            case 3:
                var u = {
                    url: e.src,
                    id: "flash_app",
                    width: o.options.width,
                    height: o.options.height,
                    version: 9
                };
                "opaque" == l && (u.preventhide = 1), p = renderFlash(o.cont, u, {
                    allowFullScreen: !0,
                    allownetworking: "all",
                    allowscriptaccess: "never",
                    allowFullScreenInteractive: "true",
                    wmode: l
                }, i), o.frame = ge("flash_app")
        }
        p || (o.cont.innerHTML = '<div class="apps_no_flash_msg"><img src="/images/upload' + (hasClass(bodyNode, "is_2x") ? "_2x" : "") + '.gif" width="32" height="8"/></div>',
            ajax.post("al_apps.php", {
                act: "no_flash",
                total: browser.iphone || browser.ipad ? 1 : 0
            }, {
                onDone: function(t) {
                    o.cont.innerHTML = t
                }
            })), i.widget && setTimeout(function() {
            o.inited || show("app_connect_error")
        }, 8e3), cur.destroy.push(function() {
            this.RPC && this.RPC.destroy()
        }.bind(this))
    }
};
vkApp.prototype.boxApp = function(t) {}, vkApp.prototype.onAppReady = function() {
    for (var t in this.onReady) this.onReady[t]()
}, vkApp.prototype.runCallback = function() {
    var t = Array.prototype.slice.call(arguments),
        e = t[0],
        i = "customEvent";
    if (-1 != "onLocationChanged,onMerchantPaymentSuccess,onBalanceChanged,onWindowResized,onSettingsChanged".indexOf(e)) {
        i = e;
        var s = t.slice(1)
    } else var s = t.slice();
    switch (this.options.type) {
        case 1:
            if (this.RPC.callMethod("runCallback", t), !this.options.widget && !browser.iphone && !browser.ipad) try {
                this.externalFrame[i](s)
            } catch (o) {}
            break;
        case 2:
            try {
                this.externalFrame[i](s)
            } catch (o) {}
            break;
        case 3:
            try {
                this.externalFrame[i](s)
            } catch (o) {}
    }
}, vkApp.prototype.apiCallback = function(t, e) {
    Array.prototype.slice.call(arguments);
    try {
        this.externalFrame.apiCallback(t, e)
    } catch (i) {}
}, vkApp.prototype.setHeight = function(t) {
    if (t) {
        this.inlineApp && t > this.options.heightMax && (t = this.options.heightMax);
        var e = t + "px";
        this.frame.style.height = e, this.options.boxed || (this.cont.style.height = e), this.options.onResize && this.options.onResize()
    }
}, vkApp.prototype.setWidth = function(t) {
    if (t && !this.inlineApp && cur.app) {
        getSize(cur.app.cont);
        t = Math.min(Math.max(t, 100), 1e3), handlePageView({
            width: Math.max(t, 625) + 166
        }), this.frame.style.width = this.cont.style.width = t + "px"
    }
}, vkApp.prototype.balanceUpdated = function(t) {
    this.runCallback("onBalanceChanged", t)
}, vkApp.prototype.checkMethod = function(t, e, i) {
    var s = t.toLowerCase();
    if ("wall.post" == s || "activity.set" == s) {
        var o = e["wall.post" == s ? "message" : "text"];
        o || (o = ""), showBox("apps", {
            act: "wall_post_box",
            aid: this.options.aid,
            post_id: e.post_id,
            owner_id: e.owner_id,
            lat: e.lat,
            "long": e["long"],
            place_id: e.place_id,
            from_group: e.from_group,
            publish_date: e.publish_date,
            signed: e.signed,
            attachments: e.attachments || e.attachment,
            text: o,
            method: s
        }, {
            params: {
                width: "430px",
                dark: 1
            }
        });
        var a = this;
        return cur.apiWallPost = function(s, o) {
            o ? i && i({
                error: o
            }) : a.api(t, extend(e, {
                method_access: s
            }), i)
        }, !1
    }
    return !0
}, vkApp.prototype.checkMethodResult = function(t, e, i, s) {
    switch (t) {
        case "photos.saveProfilePhoto":
            if (!i.error) return cur.profilePhotoBoxCallback = function(t) {
                s(t ? {
                    response: {
                        photo_src: i.response.photo_src
                    }
                } : {
                    error: {
                        error_code: 10007,
                        error_msg: "Operation denied by user"
                    }
                }), window.profilePhotoBoxCallback = !1
            }, cur.app.funcs.showProfilePhotoBox(i.response.photo_hash), !1
    }
    return !0
}, vkApp.prototype.onLocChanged = function(t) {
    t || (t = ""), cur.appLoc != t && (cur.appLoc = t, this.runCallback("onLocationChanged", t))
}, vkApp.prototype.api = function(method, inputParams, callback, captcha) {
    function sName(t, e) {
        return t[0] > e[0] ? 1 : t[0] < e[0] ? -1 : 0
    }
    var self = this;
    if (2 == arguments.length && (callback = params, inputParams = {}), inputParams || (inputParams = {}), captcha || inputParams.method_access || inputParams.method_force ||
        this.checkMethod(method, inputParams, callback)) {
        delete inputParams.callback, delete inputParams.access_token;
        var params = {
            v: "3.0",
            api_id: this.params.api_id,
            method: method,
            format: "json",
            rnd: parseInt(1e4 * Math.random())
        };
        if (inputParams)
            for (var i in inputParams) i = trim(i), /^(rnd|format|api[\s.\[_]id|method|callback|access[\s.\[_]token)(\s*\[|$)/.test(i) || (params[i] = inputParams[i]);
        var lParams = [];
        for (i in params) lParams.push([i, params[i]]);
        lParams.sort(sName);
        var sig = this.params.viewer_id;
        for (i in lParams) sig += lParams[i][0] + "=" + lParams[i][1];
        sig += this.params.secret, params.sid = this.params.sid, stManager.add("md5.js", function() {
            params.sig = MD5(sig);
            var done = function(text) {
                    var response = eval("(" + text + ")");
                    if (response.error && 14 == response.error.error_code) cur.appCaptcha = showCaptchaBox(response.error.captcha_sid, 0, !1, {
                        onSubmit: function(t, e) {
                            inputParams.captcha_sid = t, inputParams.captcha_key = e, self.api(method, inputParams, callback, !0), cur.appCaptcha.setOptions({
                                    onHide: function() {}
                                })
                                .hide()
                        },
                        onHide: function() {
                            callback(response)
                        },
                        imgSrc: response.error.captcha_img
                    });
                    else {
                        if (captcha && cur.appCaptcha.setOptions({
                                onHide: function() {}
                            })
                            .hide(), !self.checkMethodResult(method, inputParams, response, callback)) return;
                        callback && callback(response)
                    }
                },
                fail = function() {
                    debugLog("Ajax fail")
                };
            ajax.plainpost(self.params.api_script || "/api.php", params, done, fail)
        })
    }
};
var AppsSlider = function(t) {
    if (this.options = extend({
            inner: null,
            outer: null,
            next: null,
            prev: null,
            infinite: !0,
            slideshowDuration: 4e3,
            animationDuration: 500
        }, t || {}), this.required = null, this.current = null, this.slideNext = null, this.slidePrev = null, this.slideCurrent = null, this.options.outer && this.options.inner &&
        (this.outer = ge(this.options.outer), this.inner = ge(this.options.inner), this.outer && this.inner)) {
        if (this.slideshow = !1, this.animation = {
                stop: function() {}
            }, this.slideshowTimeout = null, this.interacted = !1, this.slides = domChildren(this.inner), this.options.infinite) {
            if (!this.slides.length) return void re(this.outer);
            if (this.slides.length < 3)
                for (var e = null, i = 0; this.slides.length < 4;) e = this.slides[i++].cloneNode(!0), this.slides.push(e), this.inner.appendChild(e)
        }(this.arrowNext = ge(this.options.next)) && addEvent(this.arrowNext, "mousedown", this.next.bind(this)), (this.arrowPrev = ge(this.options.prev)) && addEvent(this.arrowPrev,
            "mousedown", this.prev.bind(this)), this.inited = !1, this.init()
    }
};
AppsSlider.prototype = {
    init: function() {
        return void 0 !== this.inited ? this.inited ? !0 : 0 !== this.outer.offsetWidth && 0 !== this.slides[0].offsetWidth ? (this.widthOuter = this.outer.offsetWidth,
            this.widthInner = this.inner.offsetWidth, this.widthSlide = this.widthInner / this.slides.length, this.offsetInner = this.inner.offsetLeft, this.widthSide =
            (this.widthOuter - this.widthSlide) / 2, this.indexNext = this.slides.length - 1, this.indexPrev = 0, this.indexMargin = (this.slides.length - 1) / 2 | 0,
            this.indexRequired = this.indexCurrent = this.getIndex(), this.highlight(), this.rearrange(), this.slideshow && !this.slideshowTimeout && this.slideshowStart(),
            this.inited = !0) : void 0 : void 0
    },
    highlight: function() {
        this.slideHighlighted && (removeClass(this.slideHighlighted, "selected"), this.slideHighlighted = null, this.indexHighlighted = null), this.indexHighlighted !==
            this.indexCurrent && (this.indexHighlighted = this.indexCurrent, this.slideHighlighted = this.slides[this.getIndex(this.indexCurrent)], addClass(this.slideHighlighted,
                "selected"))
    },
    handler: function(t) {
        var e = t.target && (t.target === this.outer || this.outer.contains(t.target));
        this.interacted != e && (this.interacted = e, e ? (this.slideshowInterrupted = this.slideshow, this.slideshowStop()) : (this.slideshow = this.slideshowInterrupted,
            this.slideshow && this.slideshowStart()))
    },
    slideshowStart: function() {
        this.slideshow = !0, this.interacted || (this.slideshowStop(), this.slideshow = !0, this.slideshowTimeout = setTimeout(function() {
            this.slideshowTimeout = null, vk.rtl ? this.indexRequired-- : this.indexRequired++, this.serve()
        }.bind(this), this.options.slideshowDuration))
    },
    slideshowStop: function() {
        this.slideshow = !1, this.slideshowTimeout && (clearTimeout(this.slideshowTimeout), this.slideshowTimeout = null)
    },
    addHandler: function() {
        this.init() && (this.removeHandler(), addEvent(document, "mousemove", this.handler.bind(this)))
    },
    removeHandler: function() {
        removeEvent(document, "mousemove", this.handler.bind(this))
    },
    requireIndex: function(t) {
        this.indexRequired = this.getIndex(t || 0), this.serve()
    },
    next: function() {
        if (this.init()) {
            if (!this.options.infinite && this.indexRequired >= this.slides.length - 1) return;
            this.indexRequired++, this.serve()
        }
    },
    prev: function() {
        if (this.init()) {
            if (!this.options.infinite && this.indexRequired < 1) return;
            this.indexRequired--, this.serve()
        }
    },
    getIndex: function(t, e) {
        return void 0 !== t ? (t = t % this.slides.length + (0 > t ? this.slides.length : 0), t === this.slides.length ? 0 : t) : (t = (this.offsetInner - this.widthSide) /
            -this.widthSlide, e ? t : Math.round(t))
    },
    serve: function() {
        if (this.init()) {
            var t = this.getIndex(this.indexRequired),
                e = this.required != t,
                i = -(this.indexRequired * this.widthSlide - (this.widthOuter - this.widthSlide) / 2);
            this.required = t, e && isFunction(this.options.onRequired) && this.options.onRequired(), this.options.infinite || (this.indexRequired = this.required), this.animation
                .stop(), this.animation = new Fx.Base({
                    style: {}
                }, {
                    duration: this.options.animationDuration,
                    transition: Fx.Transitions.easeOutCubic,
                    onComplete: this.served.bind(this),
                    onStep: function(t) {
                        this.offsetInner = t.left, setStyle(this.inner, "left", this.offsetInner);
                        var e = this.indexCurrent;
                        this.indexCurrent = this.getIndex(), e !== this.indexCurrent && (this.indexCurrent === this.indexRequired && this.highlight(), this.rearrange(),
                            isFunction(this.options.onChange) && this.options.onChange())
                    }.bind(this)
                }), this.animation.start({
                    left: this.offsetInner
                }, {
                    left: i
                })
        }
    },
    served: function() {
        var t = this.indexCurrent - this.getIndex(this.indexCurrent);
        t > 30 && (this.indexPrev = 0, this.indexNext = this.slides.length - 1, this.indexCurrent -= t, this.indexRequired -= t, this.offsetInner = -(this.indexRequired *
            this.widthSlide - (this.widthOuter - this.widthSlide) / 2), this.inner.style.left = this.offsetInner + "px", each(this.slides, function(t, e) {
            e.style.left = 0
        }.bind(this))), this.rearrange(), isFunction(this.options.onSlide) && this.options.onSlide(), this.slideshow && this.slideshowStart()
    },
    rearrange: function() {
        if (this.options.infinite) {
            for (; this.indexCurrent >= this.indexNext - this.indexMargin;) index = this.getIndex(this.indexNext), this.slides[index].style.left = (this.indexNext - index) *
                this.widthSlide + "px", this.indexNext++, this.indexPrev++;
            for (; this.indexCurrent <= this.indexPrev + this.indexMargin;) index = this.getIndex(this.indexPrev), this.slides[index].style.left = (this.indexPrev - index) *
                this.widthSlide + "px", this.indexPrev--, this.indexNext--
        }
        this.current = this.getIndex(this.indexCurrent), this.slideNext = this.slides[this.options.infinite ? this.getIndex(this.indexCurrent + 1) : this.indexCurrent + 1] ||
            null, this.slidePrev = this.slides[this.options.infinite ? this.getIndex(this.indexCurrent - 1) : this.indexCurrent - 1] || null, this.slideCurrent = this.slides[
                this.current]
    }
}, window.Apps || (window.Apps = {
    optionHiddenClass: "apps_hidden",
    optionLoadingClass: "loading",
    address: "apps",
    init: function(obj, appTpl) {
        if (extend(cur, {
                module: "apps",
                preventFastBack: !1,
                aTabs: ge("apps_top_tabs"),
                aSearch: ge("s_search"),
                aSearchWrap: ge("apps_search"),
                aWrap: ge("apps_wrap"),
                aSummary: ge("apps_summary"),
                aSummaryCounter: ge("apps_summary_counter"),
                lShowMoreButton: ge("apps_list_show_more"),
                lPreload: ge("apps_list_preload"),
                lContent: ge("apps_list_content"),
                fWrap: ge("apps_feed"),
                fShowMoreButton: ge("apps_feed_show_more"),
                rNotCounter: ge("apps_recent_notifications_counter"),
                rNotWrap: ge("apps_recent_notifications_wrap"),
                rNotNoContent: ge("apps_recent_notifications_no_content"),
                rNotBlackList: ge("apps_recent_notifications_black_list"),
                rNotShowMoreButton: ge("apps_recent_notifications_show_more"),
                rAppsWrap: ge("apps_recent_apps_wrap"),
                rAppsShowMoreButton: ge("apps_recent_more"),
                rAppsNoContent: ge("apps_recent_apps_no_content"),
                onSilentLoad: {},
                apps: {},
                deletedApps: {},
                appTpl: appTpl || function() {
                    return ""
                }
            }), extend(cur, obj), cur.defaultCount = cur.shownApps, "notifications" === nav.objLoc.act && (delete nav.objLoc.act, nav.objLoc.tab = "notifications", nav
                .setLoc(nav.objLoc)), this.setHistoryBackRules(), this.searchLoadFromAddressBar(), cur.aSearch && uiSearch.startEvents(cur.aSearch), setTimeout(
                function() {
                    this.scrollCheckBinded = this.scrollCheck.bind(this), this.sliderInit(), this.feedInit(), this.notificationsInit(), cur.scrollToHeader && (
                            setTimeout(this.scrollToHeader.bind(this), 100), delete cur.scrollToHeader), cur.scrollToTop && (scrollToTop(), delete cur.scrollToTop),
                        this.startEvents(), cur.destroy.push(function(t) {
                            setTimeout(function() {
                                var e;
                                t.fScrollbar && cur.fScrollbar != t.fScrollbar && (e = !1, globalHistory.forEach(function(i) {
                                    i.cur != t && i.cur.fScrollbar == t.fScrollbar && (e = !0)
                                }), e || t.fScrollbar.destroy()), t.rNotScrollbar && cur.rNotScrollbar != t.rNotScrollbar && (e = !1, globalHistory.forEach(
                                    function(i) {
                                        i.cur != t && i.cur.rNotScrollbar == t.rNotScrollbar && (e = !0)
                                    }), e || t.rNotScrollbar.destroy())
                            }, 0)
                        }.pbind(cur)), cur.destroy.push(this.stopEvents.bind(this)), cur.aSearch && uiSearch.scrollResize(cur.aSearch)
                }.bind(this), 0), cur.silent_mode) {
            cur.silent = !0, cur.preload && (cur.leavePreloadedHeader || delete cur.preload.header, cur.leavePreloadedBefore || delete cur.preload.before);
            var query = {
                    act: "load_apps_silent",
                    gid: cur.gid,
                    oid: cur.oid,
                    header: cur.leavePreloadedHeader ? 0 : 1,
                    before: cur.leavePreloadedBefore ? 0 : 1,
                    section: cur.section,
                    preload: 1,
                    preloaded: []
                },
                prop = null;
            for (prop in cur.preload || {}) query.preloaded.push(prop);
            ajax.post(this.address, query, {
                cache: 1,
                local: 1,
                onDone: this.withFastBackCheck(function(data, opts, preload, preload_before, preload_header) {
                    return opts && (opts = eval("(" + opts + ")"), extend(opts.lang, cur.lang || {}), extend(cur, opts)), cur.preload = extend(cur.preload ||
                        {}, preload), cur.preload.before = preload_before, cur.preload.header = preload_header, (data = eval("(" + data + ")")) ? (
                        void 0 === cur.searchOffset && (cur.searchOffset = 0), cur.curList = "all", cur.appsList = data[cur.curList] ? data : {
                            all: []
                        }, cur.sectionCount = this.isSection("catalog", "list") && !cur.searchStr ? 0 : cur.appsList[cur.curList].length, void this
                        .indexAll(function() {
                            if (cur.silent = !1, cur.onSilentLoad)
                                for (var t in cur.onSilentLoad) isFunction(cur.onSilentLoad[t]) && cur.onSilentLoad[t]()
                        })) : cur.silent = !1
                }.bind(this))
            })
        }
    },
    withFastBackCheck: function(t) {
        cur.preventFastBack = !0;
        var e = cur;
        return function() {
            cur === e && (cur.preventFastBack = !1, t.apply(this, Array.prototype.slice.call(arguments)))
        }
    },
    startEvents: function() {
        addEvent(window, "scroll", this.scrollCheckBinded), addEvent(window, "resize", this.scrollCheckBinded), this.initUpdates(), this.scrollCheck(), this.sliderStart()
    },
    stopEvents: function() {
        removeEvent(window, "scroll", this.scrollCheckBinded), removeEvent(window, "resize", this.scrollCheckBinded), this.stopUpdates(), this.sliderStop()
    },
    isSection: function() {
        for (var t = arguments.length; t--;)
            if (arguments[t] === cur.section) return !0;
        return !1
    },
    isDelayedOnSilentLoad: function t(e, i) {
        return cur.silent ? (t.count = t.count || 0, t.count++, cur.onSilentLoad[e || "key_" + t.count] = i, !0) : void 0
    },
    handlePageCount: function(t) {
        return handlePageCount("ap", t)
    },
    incomingCall: function(t) {
        stManager.add(["notifier.js", "notifier.css", "apps.css", "call.css"], function() {
            var e = se('<div><div class="call_apps_wrap clear_fix">' + t + "</div></div>"),
                i = geByClass1("call_invitation_wrap", e, "div"),
                s = {
                    movable: i,
                    startLeft: parseInt((window.innerWidth - 224) / 2) + "px",
                    startTop: parseInt((window.innerHeight - 404) / 2) + "px",
                    startWidth: 224,
                    startHeight: 404,
                    resize: !1,
                    onBeforeHide: function() {},
                    onDragEnd: function(t, e) {},
                    onResize: function(t, e) {}
                };
            Apps.appCall && Apps.appCall.close(), Apps.appCall = new RBox(e, s)
        }), Notifier.setRecvClbk("apps_call_hide", function() {
            Apps.appCall && (Apps.appCall.close(), Apps.appCall = !1)
        })
    },
    callApprove: function(t) {
        Notifier.lcSend("apps_call_hide", (new Date)
            .getTime()), Apps.appCall && (Apps.appCall.close(), Apps.appCall = !1), nav.go(t)
    },
    callReject: function() {
        Notifier.lcSend("apps_call_hide", (new Date)
            .getTime()), Apps.callOnReject()
    },
    callOnReject: function() {
        Apps.appCall && (Apps.appCall.close(), Apps.appCall = !1), ajax.post("/al_apps.php", {
            act: "do_call_reject"
        }, {
            onDone: function() {}
        })
    },
    editBlacklist: function() {
        return showBox(this.address, {
            act: "blacklist_box",
            height: lastWindowHeight
        }, {
            stat: ["privacy.css", "indexer.js"]
        }), !1
    },
    blacklistInit: function(t, e, i) {
        function s() {
            if (n.scrollTop > 0 ? addClass(t.bodyNode.parentNode, "olist_topsh") : removeClass(t.bodyNode.parentNode, "olist_topsh"), n.scrollTop + (n.offsetHeight ||
                    n.clientHeight) < r.scrollHeight ? addClass(t.bodyNode.parentNode, "olist_botsh") : removeClass(t.bodyNode.parentNode, "olist_botsh"), c && c.offsetTop &&
                c.onclick) {
                var e = c.offsetTop,
                    i = r.scrollTop,
                    s = r.offsetHeight || r.clientHeight;
                i + s + 100 >= e && c.onclick()
            }
        }

        function o(i) {
            var s = i.originalTarget || i.target;
            if (hasClass(s, "olist_item_wrap") || (s = gpeByClass("olist_item_wrap", s)), s && s != bodyNode) {
                if (hasClass(s, "olist_item_loading")) return cancelEvent(i);
                if (checkEvent(i)) return !0;
                t.changed = !0;
                var o = s.id.match(/-?\d+/)[0],
                    a = l[o],
                    n = !1;
                return each(e, function() {
                    return this[0] == o ? (n = this[4], !1) : void 0
                }), ajax.post("/al_apps.php", {
                    act: "a_blacklist_delete",
                    cancel: a ? 1 : 0,
                    owner_id: o,
                    hash: n
                }, {
                    onDone: function() {
                        toggleClass(s, "olist_item_wrap_on", !a), l[o] = !a
                    },
                    showProgress: function() {
                        addClass(s, "olist_item_loading")
                    },
                    hideProgress: function() {
                        removeClass(s, "olist_item_loading")
                    }
                }), r.scrollTop < 50 && setTimeout(function() {
                    elfocus(d), val(d)
                        .length && d.select()
                }, 100), cancelEvent(i)
            }
        }

        function a(s, o) {
            o = o || 0;
            var n, d, u = o ? 60 : 120;
            s && (s = clean(s)
                .replace(/\u2013|\u2014/g, "-")), n = s ? p.search(s) : e, d = i.tpl;
            var h = n.length;
            n = n.slice(o, o + u);
            var f = [];
            if (s) {
                var g = escapeRE(s),
                    _ = parseLatin(s);
                null != _ && (g = g + "|" + escapeRE(_));
                var v = new RegExp("(?![^&;]+;)(?!<[^<>]*)((\\(*)(" + g + "))(?![^<>]*>)(?![^&;]+;)", "gi")
            }
            var w = function(t, e, i, s) {
                var o = (i[t[0]], t[1]);
                if (e) {
                    o = -1 == e.indexOf(" ") ? o.split(" ") : [o];
                    var a = "";
                    for (var n in o) a += (n > 0 ? " " : "") + o[n].replace(s, "$2<em>$3</em>");
                    o = a
                }
                return {
                    id: t[0],
                    name: o,
                    photo: t[2],
                    link: t[3] || (t[0] > 0 ? "id" + t[0] : "app" + (-t[0] + 1e9))
                }
            };
            each(n, function() {
                    f.push(rs(d, w(this, s, l, v)))
                }), o || f.length || f.push('<div class="no_rows">' + (s ? getLang("global_search_not_found")
                    .replace("{search}", clean(s)) : i.lang.apps_blacklist_empty) + "</div>"), re(c), f = f.join(" "), o ? r.appendChild(cf(f)) : val(r, f), h > o + u &&
                (r.appendChild(c), c.onclick = function(t) {
                    return a(s, o + u), cancelEvent(t)
                }), t && t.scroll && t.scroll.update(!1, !0)
        }
        i = i || {};
        var n = geByClass1("apps_blacklist_wrap", t.bodyNode),
            r = geByClass1("apps_blacklist", t.bodyNode),
            c = geByClass1("olist_more", t.bodyNode, "a"),
            l = {},
            p = new vkIndexer(e, function(t) {
                return t[1]
            });
        t.setOptions({
                width: 560,
                bodyStyle: "padding: 0px"
            }), t.removeButtons()
            .addButton(getLang("global_close"), function() {
                t.hide(200)
            }, "yes"), r.parentNode.style.height = i.boxHeight + "px";
        var d = ge("apps_blacklist_filter");
        i.nofocus || setTimeout(elfocus.pbind(d), 100);
        var u = data(d, "opts");
        data(d, "opts", extend(u, {
            onChange: a
        })), c && (isVisible(c) ? c.onclick = function(t) {
            return a("", 60), cancelEvent(t)
        } : (re(c), show(c))), addEvent(r, "click", o), addEvent(n, "scroll", s), setTimeout(s, 10)
    },
    initDescription: function(t) {
        var e = geByClass1("apps_i_description_content");
        val(e, t);
        var i = parseInt(getStyle(e, "line-height")),
            s = Math.ceil(getSize(e)[1] / i);
        s > 7 && (setStyle(e, "height", 5 * i), val(e, t), removeClass(geByClass1("apps_i_description_show_more"), this.optionHiddenClass))
    },
    showFullDescription: function() {
        addClass(geByClass1("apps_i_description_show_more"), this.optionHiddenClass), setStyle(geByClass1("apps_i_description_content"), "height", "")
    },
    appSsSliderNext: function() {
        cur.appSsSlider && cur.appSsSlider.next()
    },
    adjustRunBoxSize: function(t) {
        if (t) {
            var e = getSize(t),
                i = {
                    marginTop: -e[1] / 2
                };
            i[vk.rtl ? "marginRight" : "marginLeft"] = -e[0] / 2, setStyle(t, i)
        }
    },
    initAppSsSlider: function() {
        var t = ge("apps_i_slider_next"),
            e = ge("apps_i_slider_prev"),
            i = ge("apps_i_slider_outer"),
            s = ge("apps_i_slider_thumbs"),
            o = s ? domPN(s) : null,
            a = s ? s.children : [],
            n = null,
            r = null,
            c = function() {
                if (s) {
                    var t = o.offsetWidth,
                        e = s.scrollWidth;
                    if (t >= e || !e || !t) return;
                    var i = a[n],
                        c = (s.offsetLeft, i.offsetLeft),
                        l = i.offsetWidth,
                        p = -c + (t - l) / 2;
                    p = Math.max(-e + t, Math.min(0, p)), r && r.stop(), r = animate(s, {
                        left: p
                    }, {
                        duration: cur.appSsSlider.options.animationDuration,
                        transition: Fx.Transitions.easeOutCubic
                    })
                }
            },
            l = function(t) {
                s && t !== n && (null !== n && removeClass(a[n], "selected"), n = t, addClass(a[n], "selected"), c())
            };
        if (onRequired = function() {
                l(null !== cur.appSsSlider.required ? cur.appSsSlider.required : cur.appSsSlider.current)
            }, onChange = function() {
                cur.appSsSlider.slideNext ? addClass(t, "apps_i_slider_available") : removeClass(t, "apps_i_slider_available"), cur.appSsSlider.slidePrev ? addClass(e,
                        "apps_i_slider_available") : removeClass(e, "apps_i_slider_available"), hasClass(cur.appSsSlider.slideCurrent, "apps_promo_video_slide") ?
                    addClass(i, "apps_i_slider_video") : removeClass(i, "apps_i_slider_video"), cur.appSsSlider.slideNext ? removeClass(i, "apps_i_slider_run") :
                    addClass(i, "apps_i_slider_run")
            }, cur.appSsSlider = new AppsSlider({
                inner: ge("apps_i_slider_inner"),
                outer: i,
                next: t,
                prev: e,
                onChange: onChange,
                onRequired: onRequired,
                infinite: !1
            }), onChange(), onRequired(), this.adjustRunBoxSize(ge("apps_i_run_box")), each(a, function(t, e) {
                var i = new Image;
                i.onload = c, i.src = geByTag1("img", e)
                    .src, addEvent(e, "click", function() {
                        cur.appSsSlider && cur.appSsSlider.requireIndex(t);
                    })
            }), cur.promoVideo) {
            var p = ge("apps_promo_video_thumb");
            p && showInlineVideo(cur.promoVideo, "", {
                autoplay: 1,
                module: "app_promo",
                addParams: {
                    min_controls: 1
                }
            }, null, p)
        }
    },
    showWinInstructions: function(t, e, i) {
        setTimeout(function() {
            new MessageBox({
                    width: 800,
                    title: cur.winInstrTitle,
                    hideButtons: !0,
                    containerClass: "apps_win_instr_wrap"
                })
                .content(rs(trim(cur.winInstrTpl), {
                    download_link: e,
                    help_link: i
                }))
                .show()
        }.bind(this), 500)
    },
    sendInstallRequest: function(t, e, i, s, o, a) {
        if (t && !isButtonLocked(t) && !hasClass(t, "button_disabled")) {
            lockButton(t);
            var n = getSize(t);
            e ? ajax.post(this.address, {
                act: "send_install_request",
                aid: i,
                ref: s,
                cid: o,
                hash: a
            }, {
                hideProgress: function() {
                    var e = getLang("apps_install_push_sent_msg");
                    unlockButton(t), addClass(t, "button_disabled"), setStyle(t, "width", n[0]), val(t, e);
                    var i = ge("apps_i_run_box");
                    addClass(i, "sent"), val(i, e), this.adjustRunBoxSize(i)
                }.bind(this)
            }) : (cur.ref = s, ajax.post(this.address, {
                act: "send_install_request_box",
                aid: i
            }, {
                onDone: function(e, o, a) {
                    if (unlockButton(t), o) {
                        cur.lang || (cur.lang = {}), extend(cur.lang, e);
                        var n = new MessageBox({
                            title: getLang("apps_get_push_w_install_link")
                        });
                        n.removeButtons(), n.content(o), n.addButton(getLang("apps_install_sms_send"), function(t) {
                            var e = ge("apps_i_request_btn");
                            if (t && e && !isButtonLocked(t)) {
                                var o = getSize(e);
                                lockButton(t), ajax.post(this.address, {
                                    act: "send_install_request",
                                    ref: s,
                                    aid: i,
                                    cid: -3,
                                    hash: a
                                }, {
                                    onFail: function(e) {
                                        if (e) {
                                            var i = ge("app_sms_tt_error");
                                            val(i, e), show(i), unlockButton(t)
                                        }
                                    },
                                    onDone: function() {
                                        this.ttDestroyAll(), n.hide();
                                        var i = getLang("apps_install_push_sent_msg");
                                        unlockButton(t), addClass(e, "button_disabled"), setStyle(e, "width", o[0]), val(e, i);
                                        var s = ge("apps_i_run_box");
                                        addClass(s, "sent"), val(s, i), this.adjustRunBoxSize(s)
                                    }.bind(this)
                                })
                            }
                        }.bind(this), "yes"), n.addButton(getLang("global_cancel"), n.hide, "no"), n.show()
                    } else showBox("activation.php", {
                        act: "change_phone_box",
                        hash: a
                    })
                }.bind(this)
            }))
        }
    },
    deletingApp: !1,
    showInviteBox: function(t, e) {
        t || (t = cur.app.options.aid, e = cur.app.options.hash), showTabbedBox("al_friends.php", {
            act: "select_friends_box",
            Checked: "",
            invite: 1,
            aid: t,
            from: "apps"
        }, {
            stat: ["privacy.js", "ui_controls.js", "ui_controls.css"],
            cache: 1,
            params: {
                dark: 1
            }
        }), cur.onFlistSave = function(i, s) {
            ajax.post("apps", {
                act: "invite_friends",
                aid: t,
                friends: i.join(","),
                hash: e
            }, {
                onDone: function(t, e) {
                    setTimeout(showFastBox({
                            title: t
                        }, e)
                        .hide, 2e3)
                },
                onFail: function(t) {
                    return setTimeout(showFastBox({
                            title: getLang("global_error")
                        }, t)
                        .hide, 2e3), !0
                }
            })
        }
    },
    showAppFriends: function(t, e) {
        return !showBox(Apps.address, {
            act: "show_app_friends_box",
            aid: t
        }, {
            cache: 1,
            params: {
                width: "400px",
                bodyStyle: "padding: 0px"
            },
            stat: ["boxes.css"],
            dark: 1
        }, e)
    },
    recountAddVotes: function(t) {
        var e = t.value.replace(/[^0-9]/g, "");
        val("add_votes", langNumeric(e, votes_flex)), e > 0 && ge("app_pay_withdraw") && (ge("app_pay_withdraw")
            .value = 0, this.recountWithdrawVotes(ge("app_pay_withdraw")))
    },
    recountWithdrawVotes: function(t) {
        var e = t.value.replace(/[^0-9]/g, "");
        val("withdraw_votes", langNumeric(e, votes_flex)), e > 0 && (ge("app_pay_add")
            .value = 0, this.recountAddVotes(ge("app_pay_add")))
    },
    initAppView: function(t, e) {
        cur.nav.push(function(t, e, i, s) {
            return void 0 !== t[0] || t.join || s.pass ? void 0 : t["#"] ? (cur.app.onLocChanged(t["#"]), s.back ? 3 != vk.al && nav.setLoc(i) : nav.setLoc(i), !
                1) : (nav.setLoc(i), !1)
        });
        var i = function(t) {
            "block" == t.type ? cur.app.runCallback("onWindowBlur") : cur.app.runCallback("onWindowFocus")
        };
        cur.app.onReady.push(function() {
            cur.app.onLocChanged(t.hash), addEvent(document, "block unblock", i, !0), cur.destroy.push(function() {
                removeEvent(document, "block unblock", i)
            })
        }), e.icon && (setFavIcon(e.icon), cur.destroy.push(function() {
            setFavIcon("/images/favicon" + (vk.intnat ? "_vk" : "new") + _iconAdd + ".ico")
        }))
    },
    loadSettings: function(t) {
        ajax.post(this.address, {
            act: "show_settings",
            aid: cur.aid
        }, extend({
            cache: 1
        }, t))
    },
    showSettings: function() {
        this.ttHideAll(), cur.settShown ? (scrollToTop(200), cur.settShown = !1, delete ajaxCache["/apps#act=show_settings&aid=" + cur.aid]) : showBox(this.address, {
            act: "show_settings",
            aid: cur.aid
        }, {
            params: {
                dark: 1
            }
        })
    },
    saveSettings: function(t, e, i, s) {
        if (!cur.savingSettings) {
            i || (s && s.btn && lockButton(s.btn), show("apps_settings_progress"));
            var o = curBox(),
                a = ge("app_pay_add"),
                n = ge("app_pay_withdraw"),
                r = {
                    act: "save_settings",
                    aid: t,
                    hash: e,
                    from: "appview",
                    app_settings_1: isChecked(ge("app_settings_1")),
                    app_settings_256: isChecked(ge("app_settings_256")),
                    add: a ? a.value : 0,
                    withdraw: n ? n.value : 0,
                    only_checkboxes: i ? 1 : 0,
                    cur_aid: cur.aid
                };
            isVisible("app_settings_2097152") && (r.app_settings_2097152 = isChecked(ge("app_settings_2097152"))), ajax.post("apps", r, extend({
                onDone: function(t) {
                    if (s && s.btn && unlockButton(s.btn), t.left_nav && this.updateLeftNav(t.left_nav), !i && cur.app && cur.app.runCallback(
                            "onSettingsChanged", t.settings), cur.settingsOnLoad = !1, void 0 !== t.coins && cur.app && cur.app.balanceUpdated(t.coins),
                        void 0 !== t.balance && updateMoney(t.balance), o && !i && o.hide(), t.left_nav_error) {
                        i && checkbox("app_settings_256", 256 & t.settings);
                        var e = new MessageBox({
                            title: getLang("global_error")
                        });
                        e.content(t.left_nav_error)
                            .addButton(getLang("global_close"), e.hide, "yes")
                            .show()
                    }
                    this.updateAddToMenuAction()
                }.bind(this),
                onFail: function(t) {
                    t && val("apps_settings_error", t), show("apps_settings_error"), hide("apps_settings_progress"), scrollToTop(200)
                },
                showProgress: function() {
                    cur.savingSettings = !0, o && i && o.showProgress()
                },
                hideProgress: function() {
                    cur.savingSettings = !1, o && i && o.hideProgress()
                }
            }, s || {}))
        }
    },
    updateAddToMenuAction: function() {
        var t = ge("app_add_to_menu_action");
        if (t && cur.aid && cur.app && cur.app.options) {
            var e = ge("l_app" + cur.aid);
            actionsMenuItemLocked(t) && unlockActionsMenuItem(t), t.setAttribute("onclick", "return Apps.addToMenu(" + cur.aid + ", '" + cur.app.options.hash + "', " +
                intval(!e) + ", this);"), val(t, e ? getLang("apps_remove_from_left_menu") : getLang("apps_add_to_left_menu"))
        }
    },
    addToMenu: function(t, e, i, s) {
        actionsMenuItemLocked(s) || ajax.post("al_apps.php", {
            act: "a_left_menu",
            aid: t,
            hash: e,
            show: i
        }, {
            onDone: function(t) {
                this.updateLeftNav(t.left_nav), t.left_nav_error && showFastBox({
                    title: getLang("global_error")
                }, t.left_nav_error), this.updateAddToMenuAction()
            }.bind(this),
            showProgress: lockActionsMenuItem.pbind(s),
            hideProgress: unlockActionsMenuItem.pbind(s)
        })
    },
    showAppSettings: function(t, e) {
        this.ttHideAll(), e ? showBox(this.address, {
            act: "settings_box_info",
            aid: t
        }, {
            params: {
                dark: 1
            }
        }) : showBox(this.address, {
            act: "settings_box",
            aid: t,
            mask: 0,
            main: 1
        }, {
            params: {
                dark: 1
            }
        })
    },
    updateOnline: function() {
        ajax.post(Apps.address, {
            act: "update_online",
            aid: cur.aid,
            hash: cur.app.options.hash
        }, {
            ads: 1
        })
    },
    updateOffline: function(t) {
        ajax.post(Apps.address, {
            act: "update_offline",
            aid: (t || cur)
                .aid,
            hash: (t || cur)
                .app.options.hash
        })
    },
    deleteApp: function(t, e, i, s) {
        if (!this.deletingApp) {
            this.deletingApp = !0;
            var o = function(i, s, o, a) {
                ajax.post(this.address, {
                    act: "quit",
                    id: t,
                    hash: e || cur.app.options.hash,
                    from: "app"
                }, {
                    onDone: this.withFastBackCheck(function(t) {
                        this.deletingApp = !1, window.appsListChanged = !0, this.notificationsSetCounters(t.count_all), t.left_nav && this.updateLeftNav(
                            t.left_nav), cur._back = !1, i.apply(null, [].slice.call(arguments))
                    }.bind(this)),
                    onFail: this.withFastBackCheck(function() {
                        this.deletingApp = !1, s.apply(null, [].slice.call(arguments))
                    }.bind(this)),
                    showProgress: o,
                    hideProgress: a
                })
            }.bind(this);
            switch (s) {
                case "appactions":
                    o(function() {
                        nav.go("/apps", !1)
                    }, function(t) {
                        t && showFastBox({
                            title: getLang("global_error")
                        }, t), unlockActionsMenuItem(i)
                    }, lockActionsMenuItem.pbind(i));
                    break;
                default:
                    var a = curBox();
                    o(function() {
                        nav.go("/apps", !1)
                    }, function(t) {
                        if (t) {
                            var e = ge("apps_settings_error");
                            val(e, t), show(e), scrollToTop()
                        }
                        a && a.hideProgress()
                    }, function() {
                        a && a.showProgress()
                    })
            }
        }
    },
    reportApp: function(t, e) {
        showBox("al_reports.php", {
            act: "report_app_box",
            app_id: t,
            place_id: e
        }, {
            params: {
                dark: 1
            },
            stat: ["ui_controls.js", "ui_controls.css"]
        })
    },
    cancelInstall: function() {
        nav.go("/apps", !1)
    },
    approveInstall: function(t, e, i, s) {
        var o = extend(nav.objLoc, {
            join: 1,
            hash: t,
            sett: e
        });
        isChecked("apps_notifications_checkbox") && isVisible("apps_notifications_checkbox") && (o.notify = 1), i && val(i, '<img src="/images/upload' + (hasClass(
            bodyNode, "is_2x") ? "_2x" : "") + '.gif" width="32" height="8"/>'), s && lockButton(s), window.appsListChanged = 1, nav.go(o, !1, {
            pass: !0
        })
    },
    installApp: function(t, e, i) {
        ajax.post(Apps.address, {
            act: "do_install",
            aid: t,
            hash: e
        }, {
            onDone: function(t) {
                t == cur && (Apps.onAppAdded(), i && i())
            }.pbind(cur)
        })
    },
    onAppAdded: function() {
        window.appsListChanged = !0, cur.preload && delete cur.preload.before, cur.app && (cur.app.runCallback("onApplicationAdded"), cur.appUser = !0, hide(
            "apps_install_btn"), show("apps_show_settings"))
    },
    rateOver: function(t) {
        cur.rated || hasClass(t, "not_installed") || addClass(t, "over");
        var e = "",
            i = [],
            s = 0,
            o = cur.appUser ? cur.userRate ? getLang("apps_you_voted") : getLang("apps_you_not_voted") : getLang("apps_rating_title"),
            a = rs(cur.rateStatsLabelTpl, {
                label: o
            });
        for (var n in cur.rateStats || {}) s += intval(cur.rateStats[n]);
        val("app_rate_label", o);
        for (var r = 1; 5 >= r; r++) {
            e += '<span class="app_rate stats fl_r"></span>';
            var c = intval(cur.rateStats[r]),
                l = s ? intval(100 * c / s) : 0,
                p = langNumeric(c, "%s", !0),
                d = cur.userRate != 10 * r && cur.userRate ? "" : "my";
            i.push(rs(cur.rateStatsRowTpl, {
                id: "apps_rate_row" + r,
                stars: e,
                count: p,
                percent: l,
                classname: d
            }));
            var u = ge("apps_rate_row" + r);
            u && (setStyle(geByClass1("app_rate_bg", u), {
                    width: l + "%"
                }), val(geByClass1("app_rate_percent", u), l + "%"), val(geByClass1("app_rate_cnt", u), p), geByClass1("app_rate_stars", u)
                .className = "app_rate_stars fl_l " + d)
        }
        a += i.reverse()
            .join(""), showTooltip(t, {
                text: a,
                slideX: 15,
                className: "app_rate_tt",
                shift: [cur.installPage ? -70 : -66, 0, -36],
                forcetodown: !0,
                dir: "left",
                hasover: 1
            })
    },
    rateOut: function(t) {
        Apps.showRate(), removeClass(t, "over")
    },
    rateApp: function(t) {
        if (cur.rated) return !1;
        var e = ge("apps_ratings");
        cur.appRate = cur.userRate = t, Apps.rateOut(e), cur.rated = !0, ajax.post("/al_apps.php", {
            act: "rate_app",
            aid: cur.aid,
            rate: t,
            hash: cur.rate_hash
        }, {
            onDone: function(t) {
                cur.rateStats = t, Apps.rateOver(e)
            }
        })
    },
    showRate: function(t) {
        if (cur.rated) return !1;
        var e = intval(cur.appRate || 0),
            i = geByClass("app_rate", ge("apps_ratings")),
            s = Math.floor((e + 2) / 10),
            o = Math.floor((e + 2) / 5) - s;
        for (var a in i) {
            var n = "app_rate fl_l " + (s > a ? "full" : o > a ? "half" : "empty");
            i[a].className = n
        }
        if (t) {
            var r = Math.floor(t / 10);
            for (var a in i) {
                if (a >= r) break;
                i[a].className += " over"
            }
        }
    },
    recentTabsUpdate: function(needApps, needNotifications) {
        if (cur.rAppsWrap && cur.rNotWrap) {
            if (needApps = window.appsListChanged || needApps, needNotifications = window.notificationsListChanged || needNotifications, delete window.appsListChanged,
                delete window.notificationsListChanged, !needApps && !needNotifications) return;
            ajax.post(this.address, {
                act: "update_recent",
                notifications: needNotifications,
                apps: needApps,
                hash: cur.recentUpdateHash
            }, {
                onDone: this.withFastBackCheck(function(apps, notifications) {
                    if (apps && (each(geByClass("apps_recent_row", cur.rAppsWrap), function(t, e) {
                                re(e)
                            }), apps[0] ? (show(cur.rAppsShowMoreButton), hide(cur.rAppsNoContent), domInsertBefore(cf(apps[0]), cur.rAppsShowMoreButton)) :
                            (hide(cur.rAppsShowMoreButton), show(cur.rAppsNoContent)), cur.recentOffset = apps[1], apps[2])) {
                        apps[2] = eval("(" + apps[2] + ")");
                        for (var i in apps[2]) cur.apps[apps[2][i][0]] = apps[2][i]
                    }
                    if (notifications) {
                        each(geByClass("apps_notification_row", cur.rNotWrap), function(t, e) {
                            re(e)
                        });
                        var tab = ge("apps-recent-notifications-tab");
                        notifications[0] ? ((notifications[2] ? hide : show)(cur.rNotShowMoreButton), show(tab), hide(cur.rNotNoContent),
                            domInsertBefore(cf(notifications[0]), cur.rNotShowMoreButton)) : (hide(cur.rNotShowMoreButton), show(cur.rNotNoContent),
                            "notifications" != nav.objLoc.tab && hide(tab)), cur.notificationsOffset = notifications[1], this.notificationsSetCounters(
                            notifications[3]), this.notificationsInit()
                    }
                }.bind(this)),
                showProgress: function() {
                    needApps && addClass(cur.rAppsWrap, this.optionLoadingClass), needNotifications && addClass(domPN(cur.rNotWrap), this.optionLoadingClass)
                },
                hideProgress: this.withFastBackCheck(function() {
                    needApps && removeClass(cur.rAppsWrap, this.optionLoadingClass), needNotifications && removeClass(domPN(cur.rNotWrap), this.optionLoadingClass)
                }.bind(this))
            })
        }
    },
    optionNotificationsReadTimeout: 1e3,
    notificationsReadTimeout: null,
    notificationsRemovedCount: 0,
    notificationTabSelect: function() {
        nav.objLoc.tab = "notifications", nav.setLoc(nav.objLoc), removeClass(cur.rNotBlackList, this.optionHiddenClass), cur.rNotScrollbar && cur.rNotScrollbar.update(!
            1, !0), this.notificationsReadContent(cur.rNotWrap.scrollTop || 0)
    },
    notificationsInit: function() {
        cur.rNotWrap && cur.notificationsOffset && !cur.rNotScrollbar ? (this.notificationsRemovedCount = 0, cur.rNotScrollbar = new Scrollbar(cur.rNotWrap, {
            global: !0,
            prefix: "light_",
            nomargin: !0,
            nokeys: !0,
            top: 15,
            bottom: 15,
            padding: 0,
            right: vk.rtl ? "auto" : 13,
            left: vk.rtl ? 13 : "auto",
            more: this.notificationsLoadContent.bind(this),
            scrollChange: this.notificationsReadContent.bind(this)
        }), this.notificationsReadContent(0)) : cur.rNotWrap && cur.rNotScrollbar && (cur.rNotScrollbar.update(!1, !0), this.notificationsReadContent(0))
    },
    notificationsMarkReaded: function(t) {
        t.removeAttribute("data-read"), removeClass(t, "apps_notification_row_new")
    },
    notificationsReadContent: function(t) {
        "notifications" === nav.objLoc.tab && (this.notificationsReadTimeout && clearTimeout(this.notificationsReadTimeout), this.notificationsReadTimeout = setTimeout(
            function() {
                var e = cur.rNotWrap.offsetTop,
                    i = [],
                    s = [];
                each(cur.rNotWrap.querySelectorAll('div[data-read="1"]'), function(o, a) {
                    a.offsetTop - e + a.offsetHeight / 2 <= t + cur.rNotWrap.offsetHeight && (i.push(a.getAttribute("data-id")), s.push(a))
                }), i.length && ajax.post(this.address, {
                    act: "a_mark",
                    notif_ids: i.join(","),
                    hash: cur.notificationsHash
                }, {
                    onDone: this.withFastBackCheck(function(t) {
                        this.notificationsSetCounters(t), each(s, function(t, e) {
                            this.notificationsMarkReaded(e)
                        }.bind(this))
                    }.bind(this))
                })
            }.bind(this), this.optionNotificationsReadTimeout))
    },
    notificationsLoadContent: function() {
        isVisible(cur.rNotShowMoreButton) && !isButtonLocked(cur.rNotShowMoreButton) && (lockButton(cur.rNotShowMoreButton), ajax.post(this.address, {
            act: "more_notifications",
            offset: cur.notificationsOffset,
            hash: cur.notificationsHash
        }, {
            onDone: this.withFastBackCheck(function(t, e, i) {
                unlockButton(cur.rNotShowMoreButton), cur.notificationsOffset = e, t && cur.rNotWrap && cur.rNotWrap.insertBefore(cf(t), cur.rNotShowMoreButton),
                    i && hide(cur.rNotShowMoreButton), cur.rNotScrollbar.update(!1, !0)
            }),
            onFail: this.withFastBackCheck(function() {
                hide(cur.rNotShowMoreButton)
            })
        }))
    },
    notificationsRemoveAll: function(t, e, i, s, o) {
        if (!linkLocked(t) && !checkEvent(o)) {
            var a = showFastBox({
                title: e
            }, i, getLang("global_delete"), function(e) {
                ajax.post(this.address, {
                    act: "remove_all_notifications_and_requests",
                    hash: s
                }, {
                    onDone: this.withFastBackCheck(function(t) {
                        each(geByClass("apps_notification_row", cur.rNotWrap), function(t, e) {
                            re(e)
                        }), cur.rNotScrollbar && (cur.rNotScrollbar.destroy(), cur.rNotScrollbar.hide(), delete cur.rNotScrollbar), hide(
                            cur.rNotShowMoreButton), show(cur.rNotNoContent), this.handlePageCount(t)
                    }.bind(this)),
                    showProgress: function() {
                        lockButton(e), lockLink(t)
                    },
                    hideProgress: this.withFastBackCheck(function() {
                        unlockButton(e), unlockLink(t), a.hide()
                    })
                })
            }.bind(this), getLang("global_cancel"));
            return !1
        }
    },
    notificationsSetCounters: function(t) {
        if (void 0 !== t && (this.handlePageCount(t), cur.rNotCounter)) {
            var e = 1e3 > t ? t + "" : ".." + (t + "")
                .substr(-3);
            t && removeClass(cur.rNotCounter, this.optionHiddenClass), t ? removeClass(cur.rNotCounter, "ui_tab_count_hidden") : addClass(cur.rNotCounter,
                "ui_tab_count_hidden"), animateCount(cur.rNotCounter, e, {
                str: e,
                onDone: t ? void 0 : addClass.pbind(cur.rNotCounter, this.optionHiddenClass)
            })
        }
    },
    rejectRequest: function(t, e, i, s) {
        if (!buttonLocked(t)) {
            var o = ge("apps_notification_" + e);
            this.notificationsMarkReaded(o), data(o, "html", o.innerHTML), setStyle(o, {
                minHeight: getSize(o)[1]
            }), ajax.post(this.address, {
                act: "reject_" + s,
                rid: e,
                hash: i
            }, {
                onDone: this.withFastBackCheck(function(t, e, i) {
                    e = cf(trim(e)), this.notificationsRemovedCount++ > 1 && domFC(e)
                        .appendChild(cf(cur.notificationsRemoveAllTpl || "")), val(t, ""), t.appendChild(e), addClass(t, "apps_notification_service"),
                        this.notificationsSetCounters(i), cur.rNotScrollbar.update(!1, !0)
                }.bind(this, o)),
                showProgress: lockButton.pbind(t),
                hideProgress: this.withFastBackCheck(unlockButton.pbind(t))
            }), cur.rNotScrollbar.update(!1, !0), cur.preload && delete cur.preload.before
        }
    },
    requestsRestore: function(t, e, i) {
        if (!linkLocked(t)) {
            var s = ge("apps_notification_" + e);
            ajax.post(this.address, {
                act: "request_restore",
                rid: e,
                hash: i
            }, {
                onDone: this.withFastBackCheck(function(t, e) {
                    this.notificationsRemovedCount--, val(t, data(t, "html")), removeClass(t, "apps_notification_service"), setStyle(t, {
                        minHeight: ""
                    }), this.notificationsSetCounters(e), cur.rNotScrollbar.update(!1, !0)
                }.bind(this, s)),
                showProgress: lockLink.pbind(t),
                hideProgress: this.withFastBackCheck(unlockLink.pbind(t))
            }), cur.rNotScrollbar.update(!1, !0), cur.preload && delete cur.preload.before
        }
    },
    deleteNotification: function(t, e, i, s) {
        if (!buttonLocked(t)) {
            var o = ge("apps_notification_" + e);
            setStyle(o, {
                minHeight: getSize(o)[1]
            }), ajax.post(this.address, {
                act: "delete_notification",
                nid: e,
                aid: i,
                hash: s
            }, {
                onDone: this.withFastBackCheck(function(t, e, i) {
                    e = cf(trim(e)), this.notificationsRemovedCount++ > 1 && domFC(e)
                        .appendChild(cf(cur.notificationsRemoveAllTpl || "")), val(t, ""), t.appendChild(e), addClass(t, "apps_notification_service"),
                        this.notificationsSetCounters(i)
                }.bind(this, o)),
                showProgress: lockButton.pbind(t),
                hideProgress: this.withFastBackCheck(unlockButton.pbind(t))
            })
        }
    },
    denyNotifications: function(t, e, i, s) {
        if (!linkLocked(t)) {
            var o = ge("apps_notification_" + e);
            setStyle(o, {
                minHeight: getSize(o)[1]
            }), ajax.post(this.address, {
                act: "deny_notifications",
                aid: i,
                hash: s
            }, {
                onDone: this.withFastBackCheck(function(t, e) {
                    addClass(t, "apps_notification_service"), e && val(t, e)
                }.pbind(o)),
                showProgress: lockLink.pbind(t),
                hideProgress: this.withFastBackCheck(unlockLink.pbind(t))
            })
        }
    },
    requestsBanUser: function(t, e, i, s) {
        if (!linkLocked(t)) {
            var o = ge("apps_notification_" + e);
            setStyle(o, {
                minHeight: getSize(o)[1]
            }), ajax.post(this.address, {
                act: "request_ban_user",
                mid: i,
                hash: s
            }, {
                onDone: this.withFastBackCheck(function(t, e) {
                    addClass(t, "apps_notification_service"), e && val(t, e)
                }.pbind(o)),
                showProgress: lockLink.pbind(t),
                hideProgress: this.withFastBackCheck(unlockLink.pbind(t))
            })
        }
    },
    removingApp: !1,
    restoringApp: !1,
    appsTabSelect: function(t) {
        delete nav.objLoc.tab, nav.setLoc(nav.objLoc), addClass(cur.rNotBlackList, this.optionHiddenClass)
    },
    updateLeftNav: function(t) {
        t && val(geByTag1("ol", ge("side_bar")), t)
    },
    restoreApp: function(t, e) {
        if (this.restoringApp) return !1;
        var i = ge("app" + t);
        return cur.deletedApps[t] && "al_apps" == cur.deletedApps[t].from && val(geByClass1("app_deleted_layer", i, "div"), cur.progressTpl), ajax.post(this.address, {
            act: "join",
            gid: cur.gid,
            id: t,
            hash: e,
            restore: 1,
            from: "al_apps",
            section: cur.section
        }, {
            onDone: this.withFastBackCheck(function(e) {
                cur.deletedApps[t] && (val(i, cur.deletedApps[t].html), e.left_nav && this.updateLeftNav(e.left_nav), delete cur.deletedApps[t]), cur.apps[
                    t] && (delete cur.apps[t].deleted, cur.appsIndex.add(cur.apps[t])), removeClass(i, "deleted")
            }.bind(this)),
            showProgress: function() {
                this.restoringApp = !0, addClass(i, this.optionLoadingClass)
            }.bind(this),
            hideProgress: this.withFastBackCheck(function() {
                this.restoringApp = !1, removeClass(i, this.optionLoadingClass)
            }.bind(this))
        }), !1
    },
    removeApp: function(t, e, i, s, o) {
        if (s && cancelEvent(s), this.removingApp) return !1;
        if (this.isDelayedOnSilentLoad("removeApp" + t, this.removeApp.bind(this, t, e, i))) return !1;
        this.ttHideAll();
        var a = i ? ge("recent" + t) : ge("app" + t),
            n = a && cur.lContent && cur.lContent.contains(a) && this.isSection("settings") ? "settings" : i ? "recent" : "al_apps",
            r = function() {
                if ("al_apps" == n) {
                    var i = a && geByClass1("app_deleted_layer", a, "div");
                    val(i, cur.progressTpl)
                } else if ("recent" == n) var s = cur.rAppsWrap && geByClass1("apps_recent_row_hidden", cur.rAppsWrap);
                ajax.post(this.address, {
                    act: "quit",
                    gid: cur.gid,
                    id: t,
                    hash: e,
                    offset: cur.recentOffset,
                    from: n
                }, {
                    onDone: this.withFastBackCheck(function(e) {
                        "apps" == cur.module && (delete cur.preload, "notifications" != nav.objLoc.tab && cur.rNotWrap && this.isSection("catalog",
                            "list") ? this.recentTabsUpdate(!1, !0) : (window.notificationsListChanged = !0, e.count_all && this.notificationsSetCounters(
                            e.count_all)), window.appsListChanged = !0, cur.apps[t] && (cur.appsIndex.remove(cur.apps[t]), cur.apps[t].deleted = !
                            0), e.left_nav && this.updateLeftNav(e.left_nav), "settings" == n ? (cur.deletedApps[t] = {
                            from: n,
                            html: a.innerHTML
                        }, a && a.appendChild(cf(e.html))) : "recent" == n ? (s && removeClass(s, "apps_recent_row_hidden"), hide(a), e.html &&
                            domInsertBefore(cf(e.html), cur.rAppsShowMoreButton), geByClass1("apps_recent_row", cur.rAppsWrap) ? cur.recentOffset +=
                            e.offset : (hide(cur.rAppsShowMoreButton), show(cur.rAppsNoContent), cur.recentOffset = 0)) : (cur.deletedApps[t] = {
                            from: n,
                            html: a.innerHTML
                        }, e.html && val(i, e.html)), addClass(a, "deleted"))
                    }.bind(this)),
                    showProgress: function() {
                        addClass(a, this.optionLoadingClass), this.removingApp = !0
                    }.bind(this),
                    hideProgress: this.withFastBackCheck(function() {
                        removeClass(a, this.optionLoadingClass), this.removingApp = !1
                    }.bind(this))
                })
            }.bind(this);
        if ("recent" == n) var c = showFastBox({
            title: getLang("apps_quit_app_box_title")
        }, getLang(o ? "apps_game_quit_confirm" : "apps_quit_confirm"), getLang("apps_remove"), function() {
            r(), c.hide()
        }, getLang("global_cancel"));
        else if (cur.adminApps && cur.adminApps[t]) var c = showFastBox({
            title: getLang("apps_deletingapp")
        }, getLang("apps_admin_quit"), getLang("global_delete"), function() {
            r(), c.hide()
        }, getLang("global_cancel"));
        else r()
    },
    runApp: function(t, e, i, s, o, a) {
        if (!vk.id) return showDoneBox(cur.pleaseSignInLang), !1;
        lockButton(t);
        var n = clone(nav.objLoc);
        delete n.w, nav.setLoc(n), window.appsListChanged = 1;
        var r = "/" + e + "?join=1&hash=" + i + "&sett=" + s;
        if (cur.fromInstallBox && (r += "&from_install=" + (1 == cur.fromInstallBox ? 1 : 2)), o)
            if (isObject(o))
                for (var c in o) "w" != c && (r += "&" + c + "=" + o[c]);
            else "" != o && (r += "&ref=" + o);
        a && (r += "&mid=" + a), nav.objLoc["#"] && (r += "#" + nav.objLoc["#"]), nav.go(r)
    },
    updatesInterval: null,
    stopUpdates: function() {
        this.updatesInterval && clearInterval(this.updatesInterval)
    },
    initUpdates: function(t) {
        t && t.key && (cur.updatesKey = t.key);
        var e = function() {
            if (window.Notifier && cur.updatesKey) {
                Notifier.addKey(cur.updatesKey, function(t, e) {
                    if (cur.updatesKey) {
                        if (e.events)
                            for (var i in e.events) this.parseEvent(e.events[i]);
                        e.ts && (cur.updatesKey.ts = e.ts)
                    }
                }.bind(this))
            }
        }.bind(this);
        e(), this.updatesInterval = setInterval(e, 1e4), cur.destroy.push(this.stopUpdates.bind(this))
    },
    parseEvent: function(t) {
        function e() {
            cur.fScrollbar && cur.fScrollbar.update(!1, !0), s ? c.removeEventListener("oTransitionEnd", e) : removeEvent(c,
                "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", e)
        }
        var t = t.split("<!>"),
            i = t[0];
        if (cur.updatesVersion && i == cur.updatesVersion) {
            var s = browser.opera && intval(browser.version) <= 12,
                o = t[3],
                a = new Date,
                n = a.getHours(),
                r = a.getMinutes();
            10 > n && (n = "0" + n), 10 > r && (r = "0" + r), o = o.replace("{date}", n + ":" + r);
            var c = cf(o);
            cur.fWrap && (addClass(c, "apps_feed_row_just_added"), cur.fWrap.insertBefore(c, domFC(cur.fWrap)), s ? c.addEventListener("oTransitionEnd", e) : addEvent(
                    c, "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", e), setTimeout(removeClass.pbind(c, "apps_feed_row_just_added"), 10),
                window.tooltips && tooltips.hideAll())
        }
    },
    feedInit: function() {
        cur.fWrap && cur.feedOffset && !cur.fScrollbar && (cur.fScrollbar = new Scrollbar(cur.fWrap, {
            global: !0,
            prefix: "light_",
            nomargin: !0,
            nokeys: !0,
            bottom: 15,
            padding: 0,
            right: vk.rtl ? "auto" : 13,
            left: vk.rtl ? 13 : "auto",
            more: this.feedLoadContent.bind(this)
        }))
    },
    feedLoadContent: function() {
        isVisible(cur.fShowMoreButton) && !isButtonLocked(cur.fShowMoreButton) && ajax.post(this.address, {
            act: "more_feed",
            offset: cur.feedOffset,
            hash: cur.feedHash
        }, {
            onDone: this.withFastBackCheck(function(t, e, i) {
                cur.feedOffset = e, t && cur.fWrap && cur.fWrap.insertBefore(cf(t), cur.fShowMoreButton), i && hide(cur.fShowMoreButton), cur.fScrollbar
                    .update(!1, !0)
            }),
            showProgress: lockButton.pbind(cur.fShowMoreButton),
            hideProgress: this.withFastBackCheck(unlockButton.pbind(cur.fShowMoreButton))
        })
    },
    myAppOver: function(t, e, i) {
        return hasClass(e, "deleted") || !vk.id ? !1 : void showTooltip(e, {
            url: this.address,
            params: {
                act: "show_app_friends_tt",
                aid: t,
                no_size: i ? 1 : 0
            },
            typeClass: "tt_black",
            slide: 15,
            center: 1,
            shift: [0, 8, 8],
            ajaxdt: 200,
            showdt: 300,
            hidedt: 200,
            dir: "auto"
        })
    },
    ttScore: function(t, e, i) {
        var s = void 0;
        return cur.ttScoreShown && window.tooltips && (tooltips.hideAll(), s = 0), showTooltip(t, {
            center: 1,
            black: 1,
            shift: [0, 8, 8],
            showsp: s,
            text: '<div class="apps_score_tt_cont"><b>'.concat(e, "</b>", i ? '<div class="apps_score_tt">' + i + "</div>" : "", "</div>")
        })
    },
    ttCommon: function(t, e, i) {
        return i = extend({
            parent: void 0,
            center: void 0,
            event: 0,
            appendEl: void 0,
            shift: void 0
        }, i), 0 === i.event && (i.event = window.event), i.event && cancelEvent(i.event), i.appendEl && (i.appendEl = ge(i.appendEl)), i.center ? showTooltip(t, {
            center: i.center,
            shift: i.shift || [0, 8, 8],
            black: 1,
            appendEl: i.appendEl,
            text: e
        }) : showTitle(t, e, i.shift, i)
    },
    ttHideAll: function() {
        window.tooltips && tooltips.hideAll()
    },
    ttDestroyAll: function() {
        window.tooltips && tooltips.destroyAll()
    },
    scrollToHeader: function() {
        var t = ge("apps_header_block"),
            e = ge("page_header_cont");
        if (t && e) {
            var i = Math.max(0, getXY(t)[1] - parseInt(getStyle(t, "marginTop"), 10));
            scrollNode.scrollTop + getSize(e)[1] > i && scrollToY(i, 200)
        }
    },
    scrollToSearch: function() {
        var t = ge("page_header_cont");
        if (cur.aSearchWrap && t) {
            var e = getXY(domPN(cur.aSearchWrap))[1] - getSize(t)[1];
            scrollNode.scrollTop > e && scrollToY(e, 200)
        }
    },
    scrollCheck: function() {
        this.isDelayedOnSilentLoad("scrollCheck", this.scrollCheck.bind(this)) || !browser.mobile && !cur.isAppsLoading && !cur.disableAutoMore && isVisible(cur.lShowMoreButton) &&
            (window.innerHeight || document.documentElement.clientHeight || bodyNode.clientHeight) + scrollGetY() + 400 >= cur.lShowMoreButton.offsetTop && this.searchLoadContent()
    },
    searchFocusedClass: "apps_search_focused",
    backupListContent: function(t) {
        if (cur.backupList || t) {
            if (cur.backupList && !cur.backupList.contentCopied && t) {
                for (cur.backupList.content = document.createDocumentFragment(); cur.lContent.firstChild;) cur.backupList.content.appendChild(cur.lContent.firstChild);
                for (cur.backupList.preload = document.createDocumentFragment(); cur.lPreload.firstChild;) cur.backupList.content.appendChild(cur.lPreload.firstChild);
                cur.backupList.contentCopied = !0
            }
        } else cur.backupList = {
            cur: {
                loadMore: cur.loadMore,
                shownApps: cur.shownApps,
                sectionCount: cur.sectionCount,
                searchOffset: cur.searchOffset
            },
            content: null,
            preload: null,
            contentCopied: !1
        }
    },
    restoreListContent: function() {
        return cur.backupList ? (this.searchProgress(!1), val(cur.lContent, ""), val(cur.lPreload, ""), extend(cur, cur.backupList.cur), cur.lContent.appendChild(cur.backupList
            .content), cur.lPreload.appendChild(cur.backupList.preload), delete cur.backupList, !0) : (delete cur.backupList, !1)
    },
    indexAll: function(t) {
        cur.appsIndex = new vkIndexer(cur.appsList.all, function(t) {
            try {
                return cur.apps[parseInt(t[0])] = t, t[3]
            } catch (e) {
                return ""
            }
        }, t)
    },
    searchUpdate: function(t) {
        if (!this.isDelayedOnSilentLoad("searchUpdate", this.searchUpdate.bind(this, t))) {
            if (t = this.searchValFix(t), t.length < 2 && (t = ""), cur.ignoreEqual || cur.searchStr !== t) {
                this.isSection("list") && t && this.backupListContent(), cur.searchStr = t || "";
                var e = this.isSection("apps", "settings", "manage", "reports", "ads") ? "all" : "search";
                if (t && this.isSection("apps", "settings", "manage", "reports", "ads")) {
                    var i = cur.appsIndex.search(clean(t));
                    cur.curList = e + "_search_" + t, cur.appsList[cur.curList] = i, t += " " + (parseLatin(t) || ""), t = trim(escapeRE(t)
                        .split("&")
                        .join("&amp;")), cur.selection = {
                        re: new RegExp("(" + t.replace(cur.appsIndex.delimiter, "|") + ")", "gi"),
                        val: "<span>$1</span>"
                    }
                } else cur.curList = e, cur.selection = !1;
                this.ttHideAll(), this.searchProgress(!0), this.scrollToSearch(), hide(cur.lShowMoreButton), this.isSection("catalog", "list") && this.searchWriteToAddressBar(),
                    cur.loadMore = 1, cur.shownApps = cur.searchOffset = 0, this.showRows()
            }
            delete cur.ignoreEqual
        }
    },
    showRows: function() {
        if (!this.isDelayedOnSilentLoad("showRows", this.showRows.bind(this))) {
            if (cur.searchStr) this.isSection("list", "catalog") && this.searchLoadContent();
            else {
                if (this.isSection("list")) return this.restoreListContent() || (extend(cur, {
                    searchOffset: 0,
                    sectionCount: 0,
                    shownApps: 0,
                    loadMore: 0
                }), this.searchCatalog(cur.searchStr, cur.searchOffset)), window[cur.loadMore ? "show" : "hide"](cur.lShowMoreButton), !1;
                if (this.isSection("catalog")) return extend(cur, {
                    searchOffset: 0,
                    sectionCount: 0,
                    shownApps: 0,
                    loadMore: 0
                }), val(cur.lContent, ""), val(cur.lPreload, ""), this.switchLayout("catalog"), this.searchProgress(!1), this.sliderStart(), window[cur.loadMore ?
                    "show" : "hide"](cur.lShowMoreButton), !1
            }
            if (this.isSection("settings", "manage", "apps", "reports", "ads")) {
                if (cur.defaultCount && cur.shownApps < cur.sectionCount) {
                    var t = clean(cur.searchStr),
                        e = this.isSection("manage"),
                        i = "",
                        s = cur.appsList[cur.curList] || [],
                        o = s.length;
                    if (s = this.filter(s.slice(cur.shownApps))
                        .slice(0, cur.defaultCount), s.length && cur.appTpl) {
                        var a = [];
                        each(s, function(t, i) {
                            i = clone(i), cur.selection && (i[3] = i[3].replace(cur.selection.re, cur.selection.val)), a.push(cur.appTpl(i, t == s.length - 1,
                                e))
                        }.bind(this)), i = a.join("")
                    }
                    cur.shownApps ? i && cur.lContent.appendChild(cf(i)) : i ? (val(cur.lContent, i), val(cur.aSummaryCounter, o)) : (val(cur.lContent, cur.aSummary.innerHTML
                            .replace("{query}", "<b>" + t + "</b>")), val(cur.aSummaryCounter, "")), cur.shownApps += cur.defaultCount, cur.shownApps >= cur.sectionCount ?
                        hide(cur.lShowMoreButton) : (show(cur.lShowMoreButton), this.scrollCheck()), this.searchProgress(!1)
                }
                return !1
            }
            return !0
        }
    },
    searchLoadContent: function() {
        if (this.isSection("catalog", "list")) {
            if (cur.searchStr || (cur.searchStr = ""), cur.lPreload.innerHTML) {
                for (var t = document.createDocumentFragment(); cur.lPreload.firstChild;) t.appendChild(cur.lPreload.firstChild);
                cur.lContent.appendChild(t)
            }
            return cur.loadMore ? this.searchCatalog(cur.searchStr, cur.searchOffset) : (cur.loadMore = !0, hide(cur.lShowMoreButton)), !1
        }
        return this.isSection("apps", "manage", "settings", "reports", "ads") ? this.showRows() : !0
    },
    searchCatalog: function(t, e) {
        t = this.searchValFix(t), ajax.post(this.address, {
            act: !t && this.isSection("list") ? cur.list : "search",
            q: t,
            offset: e,
            oid: cur.oid,
            from: cur.section,
            catalog_search: 1,
            id: cur.listId || void 0
        }, {
            cache: t ? 0 : 1,
            onDone: this.withFastBackCheck(function(e, i, s) {
                t == this.searchValFix(cur.searchStr) && (this.isSection("catalog", "list") && (cur.searchStr && this.sliderStop(), this.switchLayout(
                    cur.searchStr ? "list" : cur.section), this.searchWriteToAddressBar()), this.backupListContent(!0), e && val(cur.lContent,
                    e), val(cur.lPreload, i || ""), cur.loadMore = !!i, extend(cur, s), cur.loadMore && show(cur.lShowMoreButton), this.scrollCheck())
            }.bind(this)),
            showProgress: function() {
                cur.isAppsLoading = !0, lockButton(cur.lShowMoreButton)
            }.bind(this),
            hideProgress: this.withFastBackCheck(function() {
                cur.isAppsLoading = !1, this.searchProgress(!1), unlockButton(cur.lShowMoreButton)
            }.bind(this))
        })
    },
    filter: function(t) {
        for (var e = t.length, i = [], s = 0; e > s; s++) {
            var o = t[s];
            cur.apps && cur.apps[o[0]] && !cur.apps[o[0]].deleted && i.push(o)
        }
        return i
    },
    searchLoadFromAddressBar: function() {
        setTimeout(function() {
            cur.searchStr = this.searchValFix(nav.objLoc.q || "")
        }.bind(this), 0)
    },
    searchWriteToAddressBar: function(t) {
        nav.setLoc(extend(nav.objLoc, {
            q: cur.searchStr ? cur.searchStr : null
        }))
    },
    searchValFix: function(t) {
        return t ? (" " == t[t.length - 1] && (t[t.length - 1] = "_"), t) : ""
    },
    searchProgress: function(t) {
        cur.aSearch && uiSearch[t ? "showProgress" : "hideProgress"](cur.aSearch)
    },
    searchFocused: function() {
        cur.aWrap && addClass(cur.aWrap, Apps.searchFocusedClass)
    },
    searchBlured: function() {
        cur.aWrap && removeClass(cur.aWrap, Apps.searchFocusedClass)
    },
    searchReset: function() {
        cur.aSearch && uiSearch.reset(cur.aSearch), cur.searchStr = ""
    },
    switchLayout: function(t) {
        cur.aWrap && (removeClass(cur.aWrap, "apps_catalog_layout"), removeClass(cur.aWrap, "apps_list_layout"), removeClass(cur.aWrap, "apps_manage_layout"),
            removeClass(cur.aWrap, "apps_settings_layout"), removeClass(cur.aWrap, "apps_apps_layout"), removeClass(cur.aWrap, "apps_page_layout"), addClass(cur.aWrap,
                "apps_" + t + "_layout"))
    },
    geTabBySection: function(t) {
        var e = ge("apps_tab_" + t);
        return e && (e = geByTag1("a", e)) ? e : !1
    },
    setHistoryBackRules: function() {
        cur._back = {
            show: [function() {
                if (cur._back.swap && each(cur._back.swap, function(t, e) {
                        e.dummy.parentNode.replaceChild(e.content, e.dummy)
                    }), cur.fScrollbar && cur.fScrollbar.restore(), cur.rNotScrollbar && cur.rNotScrollbar.restore(), delete cur._back.swap, setTimeout(
                        function() {
                            var t = nav.objLoc && ge("notifications" == nav.objLoc.tab ? "apps-recent-notifications-tab" : "apps-recent-apps-tab");
                            t && this.switchTabPrepared(t.getElementsByTagName("a")[0]), cur.aSearch && (uiSearch.startEvents(cur.aSearch), cur.aSearch.value =
                                cur.searchStr || "", uiSearch.scrollResize(cur.aSearch)), this.searchWriteToAddressBar(cur.searchStr)
                        }.bind(this), 0), this.ttHideAll(), this.recentTabsUpdate(), this.startEvents(), cur.aTabs) {
                    var t = this.geTabBySection(this.isSection("list") ? cur.list + (cur.listId || "") : cur.section);
                    t && uiTabs.switchTab(t), uiTabs.hideProgress(cur.aTabs)
                }
            }.bind(this)],
            hide: [this.stopEvents.bind(this), this.ttHideAll.bind(this)],
            text: cur.backLang
        }
    },
    switchTabPrepared: function(tabAnchor) {
        var tabWrap = document.querySelectorAll('div[data-tab="' + domPN(tabAnchor)
            .id + '"]')[0];
        if (!tabWrap) return !0;
        var tabGroup = tabWrap.getAttribute("data-tab-group"),
            tabLoc = tabAnchor.getAttribute("href"),
            tabCallback = tabWrap.getAttribute("data-tab-callback"),
            tabWraps = document.querySelectorAll('div[data-tab-group="' + tabGroup + '"]');
        return each(tabWraps, function(t, e) {
            e !== tabWrap && addClass(e, this.optionHiddenClass)
        }.bind(this)), uiTabs.switchTab(tabAnchor), removeClass(tabWrap, this.optionHiddenClass), tabCallback && eval("(function(){" + tabCallback + ";})()"), !1
    },
    switchTab: function(section, event, noSearchReset, target) {
        if (event && checkEvent(event)) return !0;
        if ((this.isSection("list") ? cur.list + cur.listId : section) == cur.section) return cur.searchStr && this.searchReset(), !1;
        var noscroll = !1,
            scrollToHeader = !1,
            scrollToTop = !1,
            newSection = ~"/apps/catalog/settings/reports/manage/".indexOf(section) ? section : "list",
            newLayout = "reports" == newSection ? "apps" : newSection;
        "catalog" == cur.section && "list" == newSection || "list" == cur.section && "catalog" == newSection || "list" == cur.section && "list" == newSection ?
            scrollToHeader = noscroll = !0 : cur.section !== newSection && (scrollToTop = noscroll = !0);
        var preload = cur.preload && cur.preload[section];
        if (!cur.preventFastBack && preload && (null !== preload.header || cur.leavePreloadedHeader || cur.preload.header) && (null !== preload.before || cur.leavePreloadedBefore ||
                cur.preload.before)) {
            this.ttDestroyAll();
            var oldWrapper = ge("wrap3"),
                title = ge("title");
            if (cur._back) {
                window.revertLastInlineVideo && revertLastInlineVideo(), each(cur._back.hide, function(t, e) {
                    e && e()
                }), globalHistoryDestroy(cur._back.loc || nav.strLoc), globalHistory.length > 2 && globalHistoryDestroy(globalHistory[0].loc);
                var oldBefore = ge("apps_before"),
                    oldHeader = ge("apps_header");
                oldWrapper.parentNode.replaceChild(oldWrapper.cloneNode(!0), oldWrapper), cur.fScrollbar && cur.fScrollbar.restore(), cur.rNotScrollbar && cur.rNotScrollbar
                    .restore();
                var hist = {
                    content: oldWrapper,
                    title: title.innerHTML,
                    loc: cur._back.loc || nav.strLoc,
                    cur: cur,
                    radioBtns: radioBtns,
                    ajaxCache: ajaxCache,
                    pid: PageID,
                    scrollTop: scrollGetY(),
                    htitle: document.title.toString(),
                    width: vk.width,
                    width_dec: vk.width_dec,
                    width_dec_footer: vk.width_dec_footer,
                    noleftmenu: vk.noleftmenu,
                    notopmenu: vk.notopmenu,
                    nobottommenu: vk.nobottommenu,
                    hideHeader: title.parentNode && !isVisible(title.parentNode) ? !0 : void 0
                };
                hist.back = _tbLink && _tbLink.loc ? [_tbLink.loc, val(_tbLink), _tbLink.fast] : !1, showBackLink(hist.loc, cur._back.text, 1), globalHistory.push(hist)
            } else _tbLink && (_tbLink.fast = 0), processDestroy(cur);
            PageID = NextPageID, radioBtns = {}, ajaxCache = {}, boxQueue.hideAll(), layerQueue.clear(), layers.fullhide && layers.fullhide(!0);
            var oldCur = cur;
            cur = {
                aWrap: ge("apps_wrap"),
                scrollToHeader: scrollToHeader,
                scrollToTop: scrollToTop,
                destroy: [],
                nav: [],
                preload: oldCur.preload,
                _back: oldCur._back
            };
            var newJs = [],
                tmp = null;
            null !== preload.before ? val("apps_before", preload.before) : oldCur.leavePreloadedBefore ? (oldCur._back && (tmp = {
                        dummy: ce("div"),
                        content: oldBefore
                    }, oldCur._back.swap || (oldCur._back.swap = []), oldCur._back.swap.push(tmp), oldBefore.parentNode.replaceChild(tmp.dummy, oldBefore), tmp =
                    ge("apps_before"), tmp.parentNode.replaceChild(oldBefore, tmp), oldCur.fScrollbar && oldCur.fScrollbar.restore(), oldCur.rNotScrollbar &&
                    oldCur.rNotScrollbar.restore()), extend(cur, {
                    updatesKey: oldCur.updatesKey,
                    updatesVersion: oldCur.updatesVersion,
                    fScrollbar: oldCur.fScrollbar,
                    feedOffset: oldCur.feedOffset,
                    feedHash: oldCur.feedHash,
                    rNotScrollbar: oldCur.rNotScrollbar,
                    notificationsOffset: oldCur.notificationsOffset,
                    notificationsHash: oldCur.notificationsHash,
                    recentOffset: oldCur.recentOffset,
                    recentUpdateHash: oldCur.recentUpdateHash
                })) : (val("apps_before", oldCur.preload.before[0]), newJs.push(oldCur.preload.before[1])), null !== preload.header ? val("apps_header", preload.header) :
                oldCur.leavePreloadedHeader ? oldCur._back && (tmp = {
                    dummy: ce("div"),
                    content: oldHeader
                }, oldCur._back.swap || (oldCur._back.swap = []), oldCur._back.swap.push(tmp), oldHeader.parentNode.replaceChild(tmp.dummy, oldHeader), tmp = ge(
                    "apps_header"), tmp.parentNode.replaceChild(oldHeader, tmp)) : (val("apps_header", oldCur.preload.header[0]), newJs.push(oldCur.preload.header[1])),
                val("apps_after", preload.after || ""), val("apps_content", preload.content || ""), val("apps_list_content", preload.list_content || ""), val(
                    "apps_list_preload", preload.list_preload || ""), this.switchLayout(newLayout), each(newJs, function(i, js) {
                    js && eval("(function(){" + js + ";})()")
                }), preload.js && eval("(function(){" + preload.js + ";})()"), __adsUpdate("force"), nav.objLoc = {
                    0: this.address,
                    act: "catalog" === section ? void 0 : section,
                    tab: "catalog" === newSection || "list" === newSection ? nav.objLoc.tab : void 0,
                    mid: nav.objLoc.mid,
                    gid: nav.objLoc.gid,
                    add: nav.objLoc.add
                }, nav.setLoc(nav.objLoc), this.searchReset();
            var tab = this.geTabBySection(section);
            return tab && setTimeout(uiTabs.switchTab.pbind(tab), 0), window[cur.loadMore ? "show" : "hide"](cur.lShowMoreButton), !1
        }
        target && addClass(target, "apps_header_progress");
        var tab = this.geTabBySection(section);
        return tab && (uiTabs.switchTab(tab), uiTabs.showProgress(tab)), nav.go({
            0: this.address,
            act: "catalog" === section ? void 0 : section,
            tab: "catalog" === newSection || "list" === newSection ? nav.objLoc.tab : void 0,
            mid: nav.objLoc.mid,
            gid: nav.objLoc.gid,
            add: nav.objLoc.add
        }, !1, {
            onDone: function(t) {
                removeClass(target, "apps_header_progress"), extend(cur, {
                    scrollToHeader: scrollToHeader,
                    scrollToTop: scrollToTop
                })
            }.pbind(cur),
            noscroll: noscroll
        })
    },
    sliderInit: function() {
        "catalog" != cur.section || cur.featuredSlider || (cur.featuredSlider = new AppsSlider({
            inner: "apps_featured_slides",
            outer: "apps_featured_slider",
            next: "apps_featured_next",
            prev: "apps_featured_prev",
            onSlide: function(t) {
                window.AdsLight && AdsLight.applyAds()
            }
        }))
    },
    sliderStart: function() {
        cur.featuredSlider && (cur.featuredSlider.slideshowStart(), cur.featuredSlider.addHandler())
    },
    sliderStop: function() {
        cur.featuredSlider && (cur.featuredSlider.removeHandler(), cur.featuredSlider.slideshowStop())
    }
});
try {
    stManager.done("apps.js")
} catch (e) {}
