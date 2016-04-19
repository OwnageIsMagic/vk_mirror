! function() {
    var AdsLight = {},
        isVkDomain = "vk.com" === document.domain,
        uaLight = navigator.userAgent.toLowerCase(),
        browserLight = {
            msie6: /msie 6/i.test(uaLight) && !/opera/i.test(uaLight),
            msie7: /msie 7/i.test(uaLight) && !/opera/i.test(uaLight),
            msie8: /msie 8/i.test(uaLight) && !/opera/i.test(uaLight)
        };
    isVkDomain && ("__adsLoaded" in window || (window.__adsLoaded = vkNow()), window.AdsLight = AdsLight), AdsLight.init = function() {
        window.vk__adsLight || (window.vk__adsLight = {}, AdsLight.initUserHandlers(), vk__adsLight.widgetsIds = {}, vk__adsLight.observersInited = !1, vk__adsLight.publishTimers = {},
            vk__adsLight.windowId = Math.round(1e9 * Math.random() + 1), vk__adsLight.activeTab = 0, vk__adsLight.userEventTime = 0, vk__adsLight.wrapVisible = !1,
            vk__adsLight.imagesTimer = !1, vk__adsLight.reloadTimer = !1, vk__adsLight.updateBlockTimer = !1, vk__adsLight.adsCanShow = 1, vk__adsLight.adsSection = !1,
            vk__adsLight.adsShowed = "", vk__adsLight.adsShowedHash = +new Date, vk__adsLight.adsParams = !1, vk__adsLight.updateProgress = 0, vk__adsLight.adsShowedAll = {},
            vk__adsLight.loadComplete = !1, vk__adsLight.loaderParams = !1, vk__adsLight.adsIdsApplyNeeded = {}, vk__adsLight.adsIdsApplyProcess = [], vk__adsLight.adsIdsApplyTimer = !
            1, vk__adsLight.adsIdsApplyLocked = !1, "onfocusin" in window ? window.addEventListener ? (window.addEventListener("focusin", vk__adsLight.userHandlers.onFocusWindow, !
                1), window.addEventListener("focusout", vk__adsLight.userHandlers.onBlurWindow, !1)) : window.attachEvent && (window.attachEvent("onfocusin", vk__adsLight.userHandlers
                .onFocusWindow), window.attachEvent("onfocusout", vk__adsLight.userHandlers.onBlurWindow)) : window.addEventListener && (window.addEventListener("focus",
                vk__adsLight.userHandlers.onFocusWindow, !0), window.addEventListener("blur", vk__adsLight.userHandlers.onBlurWindow, !0)), document.addEventListener ? (
                window.addEventListener("scroll", vk__adsLight.userHandlers.onScrollWindow, !0), document.addEventListener("mousedown", vk__adsLight.userHandlers.onMouseDownDocument, !
                    0)) : document.attachEvent && (window.attachEvent("onscroll", vk__adsLight.userHandlers.onScrollWindow), document.attachEvent("onmousedown",
                vk__adsLight.userHandlers.onMouseDownDocument)), !isVkDomain && window.VK && VK.addCallback && VK.addCallback("adsPublish", AdsLight.handleEvent),
            vk__adsLight.yaDirectLoaded = !1, vk__adsLight.yaDirectAdActive = !1, vk__adsLight.yaDirectLoadTries = 0, vk__adsLight.userHandlers.onInit(!0))
    }, AdsLight.initUserHandlers = function() {
        function e(e) {
            AdsLight.initObservers(), e && AdsLight.handleEvent("ads.onEvent", "onInit", 0), e || AdsLight.loadAds(), document.hasFocus && document.hasFocus() && t(!0)
        }

        function t(e) {
            e && AdsLight.handleEvent("ads.onEvent", "onHasFocus", 0), n()
        }

        function s(e) {
            e && AdsLight.handleEvent("ads.onEvent", "onFocusWindow", 0), r || (r = !0, h = window.vkNow && vkNow() || 0, vk__adsLight.userEventTime = window.vkNow && vkNow() ||
                0, n())
        }

        function i(e) {
            r = !1, window.vkNow && vkNow() - h < 1e3 || (e && AdsLight.handleEvent("ads.onEvent", "onBlurWindow", 0), vk__adsLight.activeTab = window.vkNow && -vkNow() || 0)
        }

        function a(e, t) {
            function s() {
                return "web" === vk__adsLight.adsSection && vkNow() - __adsLoaded >= vk.ads_rotate_interval || vkNow() - __adsLoaded >= 5 * vk.ads_rotate_interval
            }
            return e && !t ? (clearTimeout(c), void(c = setTimeout(function() {
                a(e, !0)
            }, 100))) : (e && AdsLight.handleEvent("ads.onEvent", "onScrollWindow", 0), vk__adsLight.userEventTime = window.vkNow && vkNow() || 0, n(), isVkDomain &&
                window.vkNow && window.vk && vk.ads_rotate_interval && s() && (clearTimeout(_), _ = setTimeout(function() {
                    s() && (__adsLoaded = 0, AdsLight.updateBlock())
                }, 10)), void(isVkDomain && AdsLight.applyAds()))
        }

        function d(e) {
            if (e && AdsLight.handleEvent("ads.onEvent", "onMouseDownDocument", 0), vk__adsLight.userEventTime = window.vkNow && vkNow() || 0, n(), e) {
                for (var t = e.target; t && "A" != t.tagName && !t.onclick;) t = t.parentNode;
                t && o(!0)
            }
        }

        function o(e) {
            e && AdsLight.handleEvent("ads.onEvent", "onMouseDownDocumentAction", 0), clearTimeout(_), l = !0, setTimeout(function() {
                l = !1
            }, 10)
        }

        function n(e) {
            function t() {
                return vkNow() - __adsLoaded >= vk.ads_rotate_interval
            }
            isVkDomain && window.vkNow && window.vk && vk.ads_rotate_interval && !l && vk__adsLight.activeTab < 0 && vkNow() + vk__adsLight.activeTab >= 15e3 && t() && (
                clearTimeout(_), _ = setTimeout(function() {
                    t() && (__adsLoaded = 0, AdsLight.updateBlock())
                }, 10)), vk__adsLight.activeTab = 1
        }
        vk__adsLight.userHandlers = {
            onInit: e,
            onHasFocus: t,
            onFocusWindow: s,
            onBlurWindow: i,
            onScrollWindow: a,
            onMouseDownDocument: d,
            onMouseDownDocumentAction: o,
            onActiveTab: n
        };
        var r = !1,
            l = !1,
            h = !1,
            _ = !1,
            c = !1
    }, AdsLight.initWeb = function(e, t, s, i) {
        if (vk__adsLight.adsSection = e, top !== window) {
            var a = {
                adsPublish: function() {
                    AdsLight.handleEvent.apply(AdsLight, arguments)
                },
                onAdsAttached: function() {
                    vk__adsLight.rpc.callMethod("publish", "ads.subscribeEvents")
                },
                onInit: function() {
                    vk__adsLight.rpc.callMethod("publish", "ads.subscribeEvents")
                }
            };
            try {
                vk__adsLight.rpc = new fastXDM.Client(a), vk__adsLight.rpc.callMethod("adsOnInitLoader", s), vk__adsLight.loaderParams = t, vk__adsLight.adsParamsExport = i
            } catch (d) {
                debugLog(d)
            }
        }
    }, AdsLight.initObservers = function() {
        function e(e) {
            return function() {
                var t = Array.prototype.slice.call(arguments);
                t.unshift(e), AdsLight.handleEvent.apply(AdsLight, t)
            }
        }
        if (window.VK && VK.Observer && VK.Observer.subscribe && !vk__adsLight.observersInited) {
            vk__adsLight.observersInited = !0, VK.Observer.subscribe("ads.isVisibleBlockWrap", e("ads.isVisibleBlockWrap")), VK.Observer.subscribe("ads.subscribeEvents", e(
                "ads.subscribeEvents")), VK.Observer.subscribe("ads.onEvent", e("ads.onEvent")), VK.Observer.subscribe("ads.onAdsShowed", e("ads.onAdsShowed"));
            for (var t in VK.Widgets.RPC) VK.Widgets.RPC[t].methods.adsOnInit && VK.Widgets.RPC[t].callMethod("onAdsAttached")
        }
    }, AdsLight.handleEvent = function() {
        var e = Array.prototype.slice.call(arguments),
            t = e.shift();
        switch (t) {
            case "ads.isVisibleBlockWrap":
                AdsLight.isVisibleBlockWrapRpc.apply(AdsLight, e);
                break;
            case "ads.subscribeEvents":
                var s = e[0];
                s && !vk__adsLight.widgetsIds[s] && (vk__adsLight.widgetsIds[s] = !0), vk__adsLight.userHandlers.onInit(!0);
                break;
            case "ads.onEvent":
                AdsLight.onEvent.apply(AdsLight, e);
                break;
            case "ads.onAdsShowed":
                AdsLight.onAdsShowed.apply(AdsLight, e)
        }
    }, AdsLight.onEvent = function(e, t) {
        if (0 === t) t = [];
        else {
            var s = !1;
            for (var i in t)
                if (t[i] == vk__adsLight.windowId) {
                    s = !0;
                    break
                }
            if (s) return;
            vk__adsLight.userHandlers[e] && vk__adsLight.userHandlers[e](!1)
        }
        t.push(vk__adsLight.windowId), AdsLight.publish(!1, "ads.onEvent", e, t)
    }, AdsLight.onAdsShowed = function(e) {
        0 === e && (e = {});
        var t = [];
        for (var s in e) t.push(parseInt(s));
        t.sort();
        for (var i = [], a = 0, d = t.length; d > a; a++) {
            var s = t[a];
            i.push(e[s].ads_showed_hash)
        }
        i = i.join("_");
        var o = i && e[vk__adsLight.windowId] && i === e[vk__adsLight.windowId].publish_hash,
            n = +new Date;
        e[vk__adsLight.windowId] || (e[vk__adsLight.windowId] = {}, t.push(vk__adsLight.windowId), t.sort()), e[vk__adsLight.windowId].ads_showed = vk__adsLight.adsShowed, e[
            vk__adsLight.windowId].ads_showed_hash = vk__adsLight.adsShowedHash, e[vk__adsLight.windowId].update_progress = vk__adsLight.updateProgress;
        for (var s in vk__adsLight.adsShowedAll)(!e[s] || vk__adsLight.adsShowedAll[s].publish_time > e[s].publish_time) && n - vk__adsLight.adsShowedAll[s].publish_time < 1e4 &&
            (e[s] = vk__adsLight.adsShowedAll[s]);
        for (var i = [], a = 0, d = t.length; d > a; a++) {
            var s = t[a];
            i.push(e[s].ads_showed_hash)
        }
        i = i.join("_"), e[vk__adsLight.windowId].publish_time = n, e[vk__adsLight.windowId].publish_hash = i;
        for (var s in e) vk__adsLight.adsShowedAll[s] = e[s];
        o || AdsLight.publish(!0, "ads.onAdsShowed", e)
    }, AdsLight.publish = function(e, t) {
        function s() {
            for (var e = 0, t = l.length; t > e; e++) l[e]()
        }
        var i = Array.prototype.slice.call(arguments, 1),
            a = i.slice(),
            d = i.slice(),
            o = i.slice(),
            n = i.slice();
        a.unshift("adsPublish"), d.unshift("adsPublish"), o.unshift("adsPublish"), n.unshift("publish");
        var r, l = [];
        if (window.VK && VK.Widgets && VK.Widgets.RPC)
            for (var h in vk__adsLight.widgetsIds) VK.Widgets.RPC[h] && VK.Widgets.RPC[h].callMethod && (r = function() {
                var e = h;
                return function() {
                    VK.Widgets.RPC[e].callMethod.apply(VK.Widgets.RPC[e], a)
                }
            }(), l.push(r));
        !isVkDomain && window.VK && VK.callMethod && (r = function() {
            VK.callMethod.apply(VK, d)
        }, l.push(r)), isVkDomain && "web" !== vk__adsLight.adsSection && window.cur && cur.app && cur.app.runCallback && (r = function() {
            cur.app.runCallback.apply(cur.app, o)
        }, l.push(r)), isVkDomain && "web" === vk__adsLight.adsSection && vk__adsLight.rpc && vk__adsLight.rpc.callMethod && (r = function() {
            vk__adsLight.rpc.callMethod.apply(vk__adsLight.rpc, n)
        }, l.push(r)), clearTimeout(vk__adsLight.publishTimers[t]), l.length > 1 && e ? vk__adsLight.publishTimers[t] = setTimeout(s, 50) : s()
    }, AdsLight.canUpdate = function(e) {
        var t = ge("ads_left"),
            s = e && __adsLoaded === !1,
            i = !0;
        return i = i && t && isVisible(t) && (vk__adsLight.activeTab > 0 && AdsLight.isVisibleBlockWrap() || s), i = i && vk.id && (vk__adsLight.adsCanShow >= 1 || vkNow() +
            vk__adsLight.adsCanShow > 36e5), "web" === vk__adsLight.adsSection ? i = i && 2 === vk__adsLight.loadComplete : (i = i && isVisible("side_bar") && !layers.visible &&
            !isVisible("left_friends"), i = i && !vk.no_ads && (vk.loaded || s)), i
    }, AdsLight.getAjaxParams = function(e, t) {
        var s = {},
            i = AdsLight.canUpdate(!0);
        return t.noAds ? s.al_ad = 0 : i || t.ads ? ((t.ads || window.vkNow && window.vk && vk.ads_rotate_interval && "web" !== vk__adsLight.adsSection && vkNow() -
            __adsLoaded >= vk.ads_rotate_interval) && (__adsLoaded = vkNow(), s.al_ad = 1), (e.al_ad || s.al_ad) && (s.ads_section = vk__adsLight.adsSection, s.ads_showed =
            AdsLight.getAdsShowed())) : s.al_ad = null, s
    }, AdsLight.doRequest = function(e, t) {
        function s(t) {
            var r = +new Date,
                l = 0;
            for (var h in vk__adsLight.adsShowedAll) {
                var _ = vk__adsLight.adsShowedAll[h];
                if (r - _.publish_time >= 3e4) delete vk__adsLight.adsShowedAll[h];
                else if (!i || !n[h]) {
                    if (2 == _.update_progress) {
                        l = h;
                        break
                    }
                    1 == _.update_progress && (!l || l > h) && (l = h)
                }
            }
            t || !l || l == vk__adsLight.windowId ? (clearInterval(a), clearTimeout(d), vk__adsLight.updateProgress = 2, AdsLight.onAdsShowed(0), e()) : l != o && (o = l,
                clearInterval(a), clearTimeout(d), a = setInterval(s, i ? 100 : 200), d = setTimeout(s.pbind(!0), 5050)), n[l] = n[l] ? n[l] + 1 : 1
        }
        var i = "web" === vk__adsLight.adsSection && 1 === vk__adsLight.loadComplete;
        if (!t) return vk__adsLight.updateProgress = 1, AdsLight.onAdsShowed(0), void setTimeout(AdsLight.doRequest.pbind(e, !0), 300);
        var a, d, o = 0,
            n = {};
        s()
    }, AdsLight.getAdsShowed = function() {
        var e = [];
        for (var t in vk__adsLight.adsShowedAll) {
            var s = vk__adsLight.adsShowedAll[t];
            s.ads_showed && e.push(s.ads_showed)
        }
        return e = e.join(",")
    }, AdsLight.updateBlock = function(e, t) {
        function s() {
            i()
        }

        function i() {
            vk__adsLight.updateProgress = 3
        }
        if ("very_lazy" === e) return void(__adsLoaded = 0);
        if ("lazy" === e) {
            if (__adsLoaded) return void(__adsLoaded = 0);
            __adsLoaded = 0
        }
        if ("force" === e && (__adsLoaded = 0), "force_hard" === e && (__adsLoaded = 0), "already" === e) return void(__adsLoaded = vkNow());
        if (!__adsLoaded && __adsLoaded !== !1) {
            if (!t) return clearTimeout(vk__adsLight.updateBlockTimer), void(vk__adsLight.updateBlockTimer = setTimeout(AdsLight.updateBlock.pbind(!1, 1), 1e3));
            var a = AdsLight.canUpdate();
            if (1 == t) return void setTimeout(AdsLight.updateBlock.pbind(!1, 2), 500);
            if (a || "force_hard" == e) {
                __adsLoaded = vkNow();
                var d = {};
                for (var o in vk__adsLight.adsParams) d[o] = vk__adsLight.adsParams[o];
                AdsLight.doRequest(function() {
                    d.ads_showed = AdsLight.getAdsShowed(), d.ya_ad_active = +vk__adsLight.yaDirectAdActive, ajax.post("/ads_rotate.php?act=al_update_ad", d, {
                        ads: 1,
                        onDone: i,
                        onFail: s
                    })
                })
            }
        }
    }, AdsLight.sendExperimentStat = function(e, t) {
        if (!(Math.random() >= .05)) {
            var s;
            switch (t) {
                case "try":
                    s = e + 1;
                    break;
                case "success":
                    s = e + 2;
                    break;
                case "fail":
                    s = e + 3;
                    break;
                case "noresult":
                    s = e + 7;
                    break;
                case "lineup":
                    s = e + 8;
                    break;
                default:
                    return
            }
            ajax.post("/wkview.php?act=mlet&mt=" + s, {}, {
                onFail: function() {
                    return !0
                }
            })
        }
    }, AdsLight.tryExperiment = function(e) {
        for (var t in e) {
            t = intval(t);
            var s = e[t].split(":"),
                i = s[0],
                a = parseInt(s[1]),
                d = s.slice(2);
            switch (vk__adsLight.yaDirectAdActive = !1, i) {
                case "ya_direct":
                    if (AdsLight.sendExperimentStat(a, "lineup"), vk__adsLight.yaCloseLink = d[0], !vk__adsLight.yaDirectLoaded) {
                        if (vk__adsLight.yaDirectLoadTries > 3) continue;
                        return AdsLight.initYaDirect(), void setTimeout(function() {
                            AdsLight.tryExperiment(e)
                        }, 300)
                    }
                    return AdsLight.tryRenderYaDirect(d[1], a, e.slice(t + 1)), !0;
                case "criteo":
                    return AdsLight.sendExperimentStat(a, "lineup"), AdsLight.tryRenderCriteo(a, e.slice(t + 1)), !0;
                case "rb":
                    return AdsLight.sendExperimentStat(a, "lineup"), AdsLight.tryRenderTarget(d[0], a, e.slice(t + 1)), !0;
                case "vk":
                    AdsLight.sendExperimentStat(a, "lineup"), AdsLight.sendExperimentStat(a, "try");
                    var o = vk__adsLight.adsParams;
                    return vk__adsLight.adsParams = vk__adsLight.adsParams || {}, vk__adsLight.adsParams.ignore_experiments = a, AdsLight.updateBlock("force_hard", 2),
                        vk__adsLight.adsParams = o, !0
            }
        }
        return !1
    }, AdsLight.setNewBlock = function(e, t, s, i, a) {
        "string" == typeof t && (vk__adsLight.adsSection = t);
        var d = "<!--ads_experiment";
        if (e && e.slice(0, d.length) === d) {
            var o = e.split(";");
            return void AdsLight.tryExperiment(o.slice(1, -1))
        }
        if (vk__adsLight.adsCanShow = s || "0" === s ? 1 : -vkNow(), vk__adsLight.adsShowed = i, vk__adsLight.adsShowedHash = +new Date, a && (vk__adsLight.adsParams = a), !e)
            if (vk.no_ads) e = "";
            else {
                if ("im" !== vk__adsLight.adsSection || 0 != __seenAds) return void AdsLight.resizeBlockWrap([0, 0], !1, !1, !0);
                e = ""
            }
        __adsLoaded = vkNow();
        var n = ge("ads_left"),
            r = n && isVisible(n) || vk.ad_preview;
        if (!n) {
            var l = ge("side_bar");
            if (!l) return void AdsLight.resizeBlockWrap([0, 0], !1, !1, !0);
            n = l.appendChild(ce("div", {
                id: "ads_left"
            }, {
                display: r ? "block" : "none"
            }))
        }
        AdsLight.showNewBlock(n, e, r), window.vk && vk.ads_rotate_interval && "web" === vk__adsLight.adsSection && (clearInterval(vk__adsLight.reloadTimer), vk__adsLight.reloadTimer =
            setInterval(function() {
                vkNow() - __adsLoaded >= vk.ads_rotate_interval && vkNow() - vk__adsLight.userEventTime <= 3 * vk.ads_rotate_interval / 4 && (__adsLoaded = 0, AdsLight
                    .updateBlock())
            }, vk.ads_rotate_interval)), setTimeout(function() {
            vk__adsLight.updateProgress = 3, AdsLight.onAdsShowed(0)
        }, 100)
    }, AdsLight.showNewBlock = function(e, t, s) {
        function i(e) {
            if (--e.count > 0)
                for (var t in w)
                    if (!w[t].width || !w[t].height) return;
            clearInterval(vk__adsLight.imagesTimer), d()
        }

        function a() {
            if (isVisible(p)) {
                var e = AdsLight.getBlockSize(L);
                e = AdsLight.resizeBlockWrap(e, g, u)
            }
        }

        function d() {
            setStyle(e, {
                overflow: "hidden"
            }), setStyle(p, {
                display: "block",
                position: "absolute",
                left: 0,
                top: 0,
                opacity: 0,
                zIndex: 10,
                width: "100%"
            }), p.style.setProperty("display", "block", "important");
            var t = AdsLight.getBlockSize(L);
            t = AdsLight.resizeBlockWrap(t, g, u), c ? o() : animate(e, {
                width: t[0],
                height: t[1]
            }, v, o.pbind())
        }

        function o() {
            cleanElems(e);
            var t = AdsLight.getBlockSize(L);
            t = AdsLight.resizeBlockWrap(t, !1, u, !0), c ? n() : animate(p, {
                opacity: 1
            }, v, n.pbind())
        }

        function n() {
            if (c)
                if (p.previousSibling)
                    for (var e = p; e = e.previousSibling;) {
                        var t = e.previousSibling ? null : r.pbind();
                        animate(e, {
                            opacity: 0
                        }, v, t)
                    } else r();
                else r()
        }

        function r() {
            for (cleanElems(p); p.previousSibling;) re(p.previousSibling);
            setStyle(p, {
                position: "static",
                zIndex: "",
                width: ""
            }), setStyle(e, {
                width: "",
                height: "",
                overflow: "visible"
            }), window.updSideTopLink && updSideTopLink(), AdsLight.updateExternalStats(e), c || AdsLight.scrollToPreview()
        }
        if (!s || browserLight.msie6 || browserLight.msie7) {
            s || debugLog("Ads container is hidden"), e.innerHTML = t;
            var l = AdsLight.getBlockSize(e);
            return AdsLight.resizeBlockWrap(l, !1, !1, !0), void AdsLight.updateExternalStats(e)
        }
        for (var h = getXY(e)[1], _ = scrollGetY(), c = !t, v = h + 50 > _ + lastWindowHeight ? 0 : 200, g = AdsLight.getBlockSize(e), u = [0, 0], p = e.appendChild("string" ==
                typeof t ? ce("div", {
                    innerHTML: t
                }, {
                    display: "none"
                }) : t), L = geByClass1("ads_ads_box3", p) || p, k = geByTag("img", p), w = [], m = 0, f = k.length; f > m; m++) {
            var A = vkImage();
            A.onload = a, A.onerror = a, A.src = k[m].src, w.push(A)
        }
        clearInterval(vk__adsLight.imagesTimer), vk__adsLight.imagesTimer = setInterval(i.pbind({
            count: 40
        }), 50)
    }, AdsLight.updateExternalStats = function(e) {
        var t;
        t = e && e.getAttribute("external_stats_src") ? [e] : geByClass("ads_ad_external_stats", e);
        for (var s, i = 0; s = t[i]; i++) s.getAttribute("external_stats_complete") || (s.setAttribute("external_stats_complete", 1), vkImage()
            .src = s.getAttribute("external_stats_src"))
    }, AdsLight.addAdsToApply = function(e) {
        var t;
        window.cur ? (window.cur.adsIdsApplyNeeded || (window.cur.adsIdsApplyNeeded = {}), t = window.cur.adsIdsApplyNeeded) : t = vk__adsLight.adsIdsApplyNeeded;
        for (var s in e) t[s] = e[s];
        AdsLight.applyAds()
    }, AdsLight.applyAds = function(e) {
        function t() {
            for (var e in a) {
                var t = ge(e);
                if (t) {
                    if (elemRect = t.getBoundingClientRect(), elemRect.bottom > 0 && elemRect.top < lastWindowHeight) {
                        var i = document.elementFromPoint(elemRect.left + 1, elemRect.top + 1),
                            d = document.elementFromPoint(elemRect.right - 1, elemRect.bottom - 1),
                            o = i && (i === t || isAncestor(i, t)) || d && (d === t || isAncestor(d, t));
                        if (o) {
                            vk__adsLight.adsIdsApplyProcess.push(a[e][0]), delete a[e];
                            continue
                        }
                    }
                    a[e][1] && (vkNow() - vk.started) / 1e3 > a[e][1] && (re(t), delete a[e])
                } else delete a[e]
            }
            s()
        }

        function s(e) {
            if (0 != vk__adsLight.adsIdsApplyProcess.length && !vk__adsLight.adsIdsApplyLocked) {
                if (!e) return clearTimeout(vk__adsLight.adsIdsApplyTimer), void(vk__adsLight.adsIdsApplyTimer = setTimeout(s.pbind(!0), 100));
                vk__adsLight.adsIdsApplyLocked = !0;
                var t = {};
                t.ads_ids_apply = vk__adsLight.adsIdsApplyProcess.join(";"), cur && cur.adsDelayedViewsSrc && (t.ads_src = cur.adsDelayedViewsSrc), vk__adsLight.adsIdsApplyProcess = [],
                    ajax.post("/ads_light.php?act=apply_views", t, {
                        onDone: i,
                        onFail: i
                    })
            }
        }

        function i(e) {
            if (vk__adsLight.adsIdsApplyLocked = !1, e && isObject(e)) {
                for (var t in e) {
                    var s = ge("ads_ad_box2_" + t);
                    if (s)
                        for (var i in e[t]) s.setAttribute(i, e[t][i])
                }
                AdsLight.applyAds()
            }
        }
        var a = window.cur && window.cur.adsIdsApplyNeeded || vk__adsLight.adsIdsApplyNeeded || {};
        if (!isEmpty(a)) return e ? void t() : (clearTimeout(vk__adsLight.adsIdsApplyTimer), void(vk__adsLight.adsIdsApplyTimer = setTimeout(AdsLight.applyAds.pbind(!0), 100)))
    }, AdsLight.isVisibleBlockWrap = function(e) {
        function t(e) {
            vk__adsLight.wrapVisible = e
        }
        var s = ge("ads_left"),
            i = s.getBoundingClientRect(),
            a = [];
        return i.right && i.bottom && (a.push([i.left + 1 * (i.right - i.left) / 5, i.top + 1 * (i.bottom - i.top) / 5]), a.push([i.left + 4 * (i.right - i.left) / 5, i.top +
            4 * (i.bottom - i.top) / 5
        ])), AdsLight.isVisibleBlockWrapCoords(a, s, t, e), vk__adsLight.wrapVisible
    }, AdsLight.isVisibleBlockWrapCoords = function(e, t, s, i) {
        function a(e, t) {
            if (!e || !t) return !1;
            for (; e = e.parentNode;)
                if (e === t) return !0;
            return !1
        }
        for (var d = !1, o = [], n = 0, r = e.length; r > n; n++) {
            var l = document.elementFromPoint(e[n][0], e[n][1]),
                h = l && (l === t || a(l, t)),
                d = d || h;
            h && o.push(e[n])
        }
        d = !!d;
        var _, c = function(e) {
            clearTimeout(_), s(void 0 !== e ? e : d)
        };
        !i && o.length && window != parent && isVkDomain && "web" === vk__adsLight.adsSection && vk__adsLight.rpc && vk__adsLight.rpc.callMethod ? (vk__adsLight.rpc.callMethod(
            "publish", "ads.isVisibleBlockWrap", o, c), _ = setTimeout(c, 300)) : !i && o.length && window != parent && !isVkDomain && window.VK && VK.callMethod ? (VK.callMethod(
            "adsPublish", "ads.isVisibleBlockWrap", o, c), _ = setTimeout(c, 300)) : c()
    }, AdsLight.isVisibleBlockWrapRpc = function(e, t, s) {
        var i;
        i = s ? VK.Widgets.RPC[s].frame : cur.app.frame;
        for (var a = i.getBoundingClientRect(), d = [], o = 0, n = e.length; n > o; o++) {
            var r = e[o][0] + a.left,
                l = e[o][1] + a.top;
            d.push([r, l])
        }
        AdsLight.isVisibleBlockWrapCoords(d, i, t)
    }, AdsLight.getBlockSize = function(e) {
        var t = geByClass("ads_ad_box", e),
            s = geByClass("ads_ad_box5", e);
        each(s, function(e, t) {
            addClass(t, "max_size")
        }), browserLight.msie8 && each(t, function(e, t) {
            var s = Math.ceil(floatval(getStyle(t, "width"))),
                i = Math.ceil(floatval(getStyle(t, "max-width")));
            i && i > 200 && s >= i && (t.style.width = i + "px")
        });
        var i = Math.ceil(floatval(getStyle(e, "width"))),
            a = Math.ceil(floatval(getStyle(e, "height"))),
            d = [i, a];
        return each(s, function(e, t) {
            removeClass(t, "max_size")
        }), d
    }, AdsLight.resizeBlockWrap = function(e, t, s, i) {
        if (!e) return [0, 0];
        var a = e[0],
            d = e[1];
        a && vk__adsLight.adsParams && vk__adsLight.adsParams.ads_ad_unit_width_real > a && (a = vk__adsLight.adsParams.ads_ad_unit_width_real), d && vk__adsLight.adsParams &&
            vk__adsLight.adsParams.ads_ad_unit_height_real > d && (d = vk__adsLight.adsParams.ads_ad_unit_height_real);
        var o = !!(i || t && a > t[0] || s && s[0] && a > s[0]),
            n = !!(i || t && d > t[1] || s && s[1] && d > s[1]);
        return o || n ? (s && (o && (s[0] = a), n && (s[1] = d)), isVkDomain && "web" === vk__adsLight.adsSection && vk__adsLight.rpc && vk__adsLight.rpc.callMethod &&
            vk__adsLight.rpc.callMethod("resizeWidget", o && a, n && d), [a, d]) : [a, d]
    }, AdsLight.loadAds = function() {
        function onComplete(response, nothing, js) {
            if (vk__adsLight.updateProgress = 3, response && isObject(response) && "ads_html" in response) {
                var styleElemOld = ge("ads_style_web_loader"),
                    sheetOld = styleElemOld.sheet ? styleElemOld.sheet : styleElemOld.styleSheet,
                    deleteFunc = sheetOld.deleteRule ? "deleteRule" : "removeRule";
                sheetOld[deleteFunc](0);
                var styleElemNew = ce("style", {
                    type: "text/css"
                });
                styleElemNew.styleSheet ? styleElemNew.styleSheet.cssText = response.css : styleElemNew.appendChild(document.createTextNode(response.css)), headNode.appendChild(
                    styleElemNew), AdsLight.setNewBlock(response.ads_html, response.ads_section, response.ads_can_show, response.ads_showed, response.ads_params);
                var adsParamsExport = response.ads_params_export;
                if (adsParamsExport.ads_params_unclean) {
                    delete adsParamsExport.ads_params_unclean;
                    for (var i in adsParamsExport) adsParamsExport[i] = unclean(adsParamsExport[i])
                }
                vk__adsLight.rpc.callMethod("adsOnInit", response.ads_count, adsParamsExport), vk__adsLight.loadComplete = 2
            } else {
                if ("string" == typeof js) try {
                    eval(js)
                } catch (e) {
                    debugLog(e)
                }
                AdsLight.loadAdsFailed(-3001, adsParamsExport)
            }
        }
        if (isVkDomain && vk__adsLight.loaderParams && !vk__adsLight.loadComplete) {
            vk__adsLight.loadComplete = 1;
            var adsParamsExport = vk__adsLight.adsParamsExport;
            delete vk__adsLight.adsParamsExport;
            var ajaxParams = {};
            for (var i in vk__adsLight.loaderParams) ajaxParams[i] = vk__adsLight.loaderParams[i];
            ajaxParams.url = document.referrer;
            try {
                ajaxParams.url_top = top.location.toString()
            } catch (e) {}
            var isVisibleWeb = AdsLight.isVisibleBlockWrap(!0);
            isVisibleWeb || (ajaxParams.web_invisible = 1), document.documentMode && (ajaxParams.ie_document_mode = document.documentMode), AdsLight.doRequest(function() {
                ajaxParams.ads_showed = AdsLight.getAdsShowed(), ajax.post("/ads_rotate.php?act=ads_web", ajaxParams, {
                    onDone: onComplete,
                    onFail: onComplete
                })
            })
        }
    }, AdsLight.loadAdsFailed = function(e, t) {
        if (!vk__adsLight.rpc) return !1;
        if (-1 === vk__adsLight.loadComplete) return !0;
        if (vk__adsLight.loadComplete = -1, t.ads_params_unclean) {
            delete t.ads_params_unclean;
            for (var s in t) t[s] = unclean(t[s])
        }
        return vk__adsLight.rpc.callMethod("resizeWidget", 0, 0), vk__adsLight.rpc.callMethod("adsOnInit", e, t), !0
    }, AdsLight.handleAllAds = function(e, t, s, i) {
        function a() {
            removeEvent(boxLayerWrap, "scroll", n), hide("ads_ads_all_ads_more")
        }

        function d() {
            var e = window.cur && window.cur.adsIdsApplyNeeded || vk__adsLight.adsIdsApplyNeeded || {};
            !t && isEmpty(e) && a()
        }

        function o(e) {
            return e ? (AdsLight.addAdsToApply(s), void n()) : void setTimeout(o.pbind(!0), 500)
        }

        function n() {
            var e = ge("ads_ads_all_ads_more");
            if (e) {
                var t = e.getBoundingClientRect();
                t.top < lastWindowHeight + i && (c = Math.round(Math.max(c, lastWindowHeight - t.top + i)), r()), AdsLight.applyAds(), d()
            }
        }

        function r(e) {
            if (!e) return void setTimeout(r.pbind(!0), 100);
            if (t && c && !_) {
                _ = !0;
                var s = {};
                s.ads_more = t, s.ads_height = c, ajax.post("/ads_light.php?act=all_ads_more", s, {
                    onDone: l,
                    onFail: h
                })
            }
        }

        function l(e) {
            if (_ = !1, !e) return void h();
            if (t = e.ads_more, AdsLight.addAdsToApply(e.ads_ids_apply), e.ads_html) {
                var s = ge("ads_ads_all_ads_rows"),
                    i = ge("ads_ads_all_ads_more");
                s && (s.innerHTML += e.ads_html, c = !1, n()), i && (i.height = e.ads_more_height)
            }
            d()
        }

        function h() {
            return _ = !1, !0
        }
        var _ = !1,
            c = !1;
        boxLayerWrap.scrollTop = 0;
        var v = {};
        v.onClean = a, e.setOptions(v), t && addEvent(boxLayerWrap, "scroll", n), o(), n()
    }, AdsLight.blockOverOut = function(e, t, s) {
        var i, a = "mouseover" === e.type,
            d = !1;
        if (hasClass(t, s) ? (i = t, toggleClass(i, "over", a), d = a ? 1 : .3) : (i = geByClass1(s, i), i.over = 1, hasClass(i, "over") || (d = a ? .3 : 0)), d !== !1 &&
            animate(i, {
                opacity: d
            }, 200), a && t == i) {
            var o = geByClass1("tooltip_text", i);
            o && showTooltip(i, {
                text: o.innerHTML,
                showdt: 0,
                black: 1,
                shift: [14, 3, 3]
            })
        }
    }, AdsLight.closeNewsBlock = function(e, t, s) {
        function i() {
            return !0
        }
        for (; !hasClass(e, "feed_row");) e = e.parentNode;
        slideUp(e, 200), ajax.post("/ads_light.php?act=close_news", {
            hash: t,
            ads_section: s
        }, {
            onDone: i,
            onFail: i
        })
    }, AdsLight.scrollToPreview = function(e) {
        if (!e) return void setTimeout(AdsLight.scrollToPreview.pbind(!0), 100);
        var t = geByClass1("ads_ads_preview");
        if (t && !hasClass(t, "ads_ads_preview_viewed")) {
            addClass(t, "ads_ads_preview_viewed");
            var s = scrollGetY(),
                i = getXY(t)[1],
                a = getSize(t)[1];
            i + a > s + lastWindowHeight && scrollToY(i - (lastWindowHeight - a) / 2, 500)
        }
    }, AdsLight.overrideClickEvents = function(e, t) {
        function s(e) {
            return e = normEvent(e), r || ("mouseup" == e.type && (2 == e.which || 1 == e.which && checkEvent(e)) ? (r = !0, setTimeout(function() {
                r = !1
            }, 100), a()) : "click" == e.type && 1 == e.which && i()), cancelEvent(e)
        }
        if (!e) return !1;
        var i = e.getAttribute("onclick_inside"),
            a = e.getAttribute("onclick_outside");
        if (!a) return !1;
        i = new Function(i || a), a = new Function(a);
        for (var d, o = geByTag("a", e), n = 0; d = o[n]; n++) d.setAttribute("_href", d.href), d.removeAttribute("href");
        var r = !1;
        return addEvent(e, "click dblclick mousedown mouseup touchstart touchmove touchend", s, !1, !1, !0), t || cur.destroy.push(function(e) {
            cleanElems(e)
        }.pbind(e)), !0
    }, AdsLight.initYaDirect = function() {
        vk__adsLight.yaDirectLoadTries++, vk__adsLight.yaDirectLoading || (vk__adsLight.yaDirectLoading = !0, function(e, t, s, i, a) {
            e[s] = e[s] || [], e[s].push(function() {
                    vk__adsLight.yaDirectLoaded = !0, vk__adsLight.yaDirectLoading = !1
                }), a = t.getElementsByTagName("script")[0], i = t.createElement("script"), i.type = "text/javascript", i.src = "//an.yandex.ru/system/context.js", i.async = !
                0, a.parentNode.insertBefore(i, a)
        }(window, window.document, "yandexContextAsyncCallbacks"))
    }, AdsLight.tryRenderYaDirect = function(e, t, s) {
        if (vk__adsLight.yaDirectLoaded) {
            var i, a = "yandex_ad_" + e;
            if (ge(a)) return void animate(ge(a), {
                opacity: 0
            }, 200, function() {
                re(a), AdsLight.tryRenderYaDirect(e, t, s)
            });
            i = ce("div", {
                id: a
            });
            var d = ge("ads_left");
            d.appendChild(i), i = ge(a), Ya.Context.AdvManager.render({
                blockId: e,
                renderTo: a,
                async: !0,
                onRender: function() {
                    AdsLight.sendExperimentStat(t, "success"), AdsLight.onYaDirectRenderSuccessful(i)
                }
            }, function() {
                AdsLight.sendExperimentStat(t, "fail"), AdsLight.onYaDirectRenderUnsuccessful(s)
            }), AdsLight.sendExperimentStat(t, "try")
        }
    }, AdsLight.onYaDirectRenderSuccessful = function(e) {
        if (vk__adsLight.yaCloseLink) {
            var t = se(
                '<div id="ya_direct" style="display:none;" onmouseover="leftBlockOver(\'ya_direct\');" onmouseout="leftBlockOut(\'ya_direct\');"><div id="left_hideya_direct" class="left_hide_button" onmouseover="leftBlockOver(this);" onmouseout="leftBlockOut(this);" onclick="leftAdBlockClose(\'ya_direct\', \'' +
                vk__adsLight.yaCloseLink + "'); return cancelEvent(event);\"></div></div>");
            t.appendChild(e), e = t
        }
        AdsLight.showNewBlock(ge("ads_left"), e, !0), vk__adsLight.yaDirectAdActive = !0
    }, AdsLight.onYaDirectRenderUnsuccessful = function(e) {
        vk__adsLight.yaDirectAdActive = !1, AdsLight.tryExperiment(e)
    }, AdsLight.tryRenderCriteo = function(e, t) {
        var s = "criteo-iframe",
            i = ge(s);
        return i ? void animate(i, {
            opacity: 0
        }, 200, function() {
            re(i), AdsLight.tryRenderCriteo(t)
        }) : (AdsLight.sendExperimentStat(e, "try"), i = ce("iframe", {
                id: s,
                frameBorder: "0",
                marginWidth: "0",
                marginHeight: "0",
                height: "0",
                width: "118",
                scrolling: "no"
            }, {
                opacity: 0
            }), i.onload = function() {
                i.contentDocument.body.scrollHeight > 400 ? (AdsLight.sendExperimentStat(e, "success"), i.height = 600, animate(i, {
                    opacity: 1
                }, 200)) : (AdsLight.sendExperimentStat(e, "fail"), re(i), AdsLight.tryExperiment(t))
            }, i.src = "/ads_light.php?act=criteo", void ge("ads_left")
            .appendChild(i))
    }, AdsLight.getRBAds = function(e, t, s, i) {
        function a(t, s, i) {
            clearTimeout(d), d = setTimeout(function() {
                i({
                    reason: "timeout"
                })
            }, h), window[o] = function(t) {
                if (clearTimeout(d), t && t[0] && t[0].html) {
                    try {
                        var a = ge(e),
                            o = a && isVisible(a) || vk.ad_preview;
                        if (!a) {
                            var n = ge("side_bar");
                            if (!n) return AdsLight.resizeBlockWrap([0, 0], !1, !1, !0), void i({
                                reason: "no-side-bar"
                            });
                            a = n.appendChild(ce("div", {
                                id: "ads_left"
                            }, {
                                display: o ? "block" : "none"
                            }))
                        }
                        AdsLight.showNewBlock(a, t[0].html, o)
                    } catch (r) {}
                    s(t)
                } else i({
                    reason: "no-ads"
                })
            };
            var a = document.createElement("script");
            a.src = t, document.getElementsByTagName("head")[0].appendChild(a)
        }
        var d, o = "__rb" + (new Date)
            .getTime(),
            n = "13270",
            r = "https://ad.mail.ru/adq/?callback=" + o + "&q%5B%5D=" + n + "%3Fn%3D" + encodeURIComponent(e),
            l = {},
            h = 5e3;
        i && i.test_id && (l.test_id = i.test_id), i && i.vk_id && (l.vk_id = i.vk_id);
        var _;
        for (_ in l) r += "&" + _ + "=" + l[_];
        return a(r, t, s), o
    }, AdsLight.tryRenderTarget = function(e, t, s) {
        var i = {};
        e && (i.test_id = e), window.vk && vk.id && (i.vk_id = vk.id), AdsLight.sendExperimentStat(t, "try");
        var a = !1,
            d = setTimeout(function() {
                AdsLight.sendExperimentStat(t, "noresult"), a && window[a] && (window[a] = function() {}), AdsLight.tryExperiment(s)
            }, 6e3);
        stManager.add(["mrtarg.js", "mrtarg.css"], function() {
            a = AdsLight.getRBAds("ads_left", function() {
                clearTimeout(d), AdsLight.sendExperimentStat(t, "success"), window.RB && window.RB.doCheck && window.RB.doCheck()
            }, function(e) {
                clearTimeout(d), AdsLight.sendExperimentStat(t, "fail"), AdsLight.tryExperiment(s)
            }, i)
        })
    }, AdsLight.init()
}();
try {
    stManager.done("aes_light.js")
} catch (e) {}