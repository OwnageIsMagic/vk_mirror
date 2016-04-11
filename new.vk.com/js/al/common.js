function topMsg(e, t, o) {
    if (o || (o = "#D6E5F7"), e) {
        clearTimeout(window.topMsgTimer);
        var n = ge("system_msg");
        n.style.backgroundColor = o, n.innerHTML = e, show(n), t && (window.topMsgTimer = setTimeout(topMsg.pbind(!1), 1e3 * t))
    } else hide("system_msg")
}

function topError(text, opts) {
    if (opts || (opts = {}), text.message) {
        var e = text;
        text = "<b>JavaScript error:</b> " + e.message, opts.stack = e.stack, e.stack && __debugMode && (text += "<br/>" + e.stack.replace(/\n/g, "<br/>"));
        try {
            console.log(e.stack)
        } catch (e2) {}
    }
    if (!opts.stack) try {
        eval("0 = 1")
    } catch (e) {
        opts.stack = e.stack
    } - 1 != opts.dt && topMsg(text, opts.dt, "#FFB4A3"), __dev || ge("debuglogwrap") || (delete opts.dt, ajax.plainpost("/errors.php", extend(opts, {
        msg: opts.msg || text,
        module: (window.cur || {})
            .module,
        id: vk.id,
        host: locHost,
        lang: vk.lang,
        loc: (window.nav || {})
            .strLoc,
        realloc: location.toString()
    })))
}

function showMsg(e, t, o, n) {
    var a = "msg" + ("msg" !== o ? " " + o : "");
    n && (a += " msg_appear"), e = ge(e);
    var i = geByClass1(o, e),
        r = i ? i : domFC(e),
        s = e.insertBefore(ce("div", {
            className: a,
            innerHTML: '<div class="msg_text">' + t + "</div>"
        }), r);
    i && re(i), setTimeout(removeClass.pbind(s, "msg_appear"), 0)
}

function nodeUpdated(e, t) {
    setStyle(e, {
        backgroundColor: "#F5F7FA"
    }), animate(e, {
        backgroundColor: "#FFF"
    }, t || 6e3, function(e) {
        setStyle(e, {
            backgroundColor: null
        })
    })
}

function langNumeric(e, t, o) {
    if (!t || !window.langConfig) return e;
    var n;
    if (isArray(t) ? (n = t[1], e != Math.floor(e) ? n = t[langConfig.numRules["float"]] : each(langConfig.numRules["int"], function(o, a) {
            if ("*" == a[0]) return n = t[a[2]], !1;
            var i = a[0] ? e % a[0] : e;
            return -1 != indexOf(a[1], i) ? (n = t[a[2]], !1) : void 0
        })) : n = t, o) {
        for (var a = e.toString()
                .split("."), i = [], r = a[0].length - 3; r > -3; r -= 3) i.unshift(a[0].slice(r > 0 ? r : 0, r + 3));
        a[0] = i.join(langConfig.numDel), e = a.join(langConfig.numDec)
    }
    return n = (n || "%s")
        .replace("%s", e)
}

function langSex(e, t) {
    if (!isArray(t)) return t;
    var o = t[1];
    return window.langConfig ? (each(langConfig.sexRules, function(n, a) {
        return "*" == a[0] ? (o = t[a[1]], !1) : e == a[0] && t[a[1]] ? (o = t[a[1]], !1) : void 0
    }), o) : o
}

function langStr(e) {
    for (var t = e + "", o = arguments, n = o.length, a = 1; n > a; a += 2) {
        var i = "%" == o[a][0] ? o[a] : "{" + o[a] + "}";
        t = t.replace(i, o[a + 1])
    }
    return t
}

function addLangKeys(e, t) {
    var o = t ? window : window.cur;
    o.lang ? extend(o.lang, e) : o.lang = e
}

function getLang() {
    try {
        var e = Array.prototype.slice.call(arguments),
            t = e.shift();
        if (!t) return "...";
        var o = window.cur.lang && window.cur.lang[t] || window.lang && window.lang[t] || window.langpack && window.langpack[t] || window[t];
        if (!o) {
            var n = t.split("_");
            return n.shift(), n.join(" ")
        }
        return isFunction(o) ? o.apply(null, e) : void 0 === e[0] && !isArray(o) || "raw" === e[0] ? o : langNumeric(e[0], o, e[1])
    } catch (a) {
        debugLog("lang error:" + a.message + "(" + Array.prototype.slice.call(arguments)
            .join(", ") + ")")
    }
}

function addTemplates(e) {
    window.templates = window.templates || {}, extend(window.templates, e)
}

function getTemplate(e, t) {
    var o = window.templates = window.templates || {},
        n = o[e];
    return n && t ? rs(n, t) : n || ""
}

function debugLog(e) {
    try {
        window.debuglogClient && debuglogClient(e);
        var t = "[" + ((new Date)
            .getTime() - _logTimer) / 1e3 + "] ";
        if (window.console && console.log) {
            var o = Array.prototype.slice.call(arguments);
            o.unshift(t), browser.msie || browser.mobile ? console.log(o.join(" ")) : console.log.apply(console, o)
        }
    } catch (n) {}
}

function debugEl(e) {
    return e && ((e.tagName || "")
        .toLowerCase() + (e.className ? "." + e.className.replace(/\s+/g, ".") : "") + (e.id && !/^__vk/.test(e.id) ? "#" + e.id : "") || e.toString()) || "[NULL]"
}

function __bf() {}

function ge(e) {
    return "string" == typeof e || "number" == typeof e ? document.getElementById(e) : e
}

function geByTag(e, t) {
    return t = ge(t) || document, t.getElementsByTagName(e)
}

function geByTag1(e, t) {
    return t = ge(t) || document, t.querySelector && t.querySelector(e) || geByTag(e, t)[0]
}

function geByClass(e, t, o) {
    t = ge(t) || document, o = o || "*";
    var n = [];
    if (!browser.msie8 && t.querySelectorAll && "*" != o) return t.querySelectorAll(o + "." + e);
    if (t.getElementsByClassName) {
        var a = t.getElementsByClassName(e);
        if ("*" != o) {
            o = o.toUpperCase();
            for (var i = 0, r = a.length; r > i; ++i) a[i].tagName.toUpperCase() == o && n.push(a[i])
        } else n = Array.prototype.slice.call(a);
        return n
    }
    for (var s = geByTag(o, t), l = new RegExp("(^|\\s)" + e + "(\\s|$)"), i = 0, r = s.length; r > i; ++i) l.test(s[i].className) && n.push(s[i]);
    return n
}

function geByClass1(e, t, o) {
    return t = ge(t) || document, o = o || "*", !browser.msie8 && t.querySelector && t.querySelector(o + "." + e) || geByClass(e, t, o)[0]
}

function gpeByClass(e, t, o) {
    if (t = ge(t), !t) return null;
    for (; o !== t && (t = t.parentNode);)
        if (hasClass(t, e)) return t;
    return null
}

function domQuery(e) {
    return document.querySelectorAll(e)
}

function domClosest(e, t) {
    return hasClass(t, e) ? t : gpeByClass(e, t)
}

function ce(e, t, o) {
    var n = document.createElement(e);
    return t && extend(n, t), o && setStyle(n, o), n
}

function re(e) {
    return e = ge(e), e && e.parentNode && e.parentNode.removeChild(e), e
}

function se(e) {
    return domFC(ce("div", {
        innerHTML: e
    }))
}

function sech(e) {
    return domChildren(ce("div", {
        innerHTML: e
    }))
}

function rs(e, t) {
    return each(t, function(t, o) {
        e = e.replace(new RegExp("%" + t + "%", "g"), ("undefined" == typeof o ? "" : o)
            .toString()
            .replace(/\$/g, "&#036;"))
    }), e
}

function psr(e) {
    return "https:" != locProtocol ? e : (e = e.replace(/http:\/\/(cs(\d+)\.vk\.me\/c(\d+)\/)/gi, "https://$1"), e = e.replace(
        /http:\/\/cs(\d+)\.(userapi\.com|vk\.com|vk\.me|vkontakte\.ru)\/c(\d+)\/(v\d+\/|[a-z0-9\/_:\-]+\.jpg)/gi, "https://pp.vk.me/c$3/$4"), e = e.replace(
        /http:\/\/cs(\d+)\.(userapi\.com|vk\.com|vk\.me|vkontakte\.ru)\/([a-z0-9\/_:\-]+\.jpg)/gi, "https://pp.vk.me/c$1/$3"), e = e.replace(
        /http:\/\/cs(\d+)\.(userapi\.com|vk\.com|vk\.me|vkontakte\.ru)\//gi, "https://ps.vk.me/c$1/"), e = e.replace(/http:\/\/video(\d+)\.vkadre\.ru\//gi,
        "https://ps.vk.me/v$1/"))
}

function domEL(e, t) {
    for (t = t ? "previousSibling" : "nextSibling"; e && !e.tagName;) e = e[t];
    return e
}

function domNS(e) {
    return domEL((e || {})
        .nextSibling)
}

function domPS(e) {
    return domEL((e || {})
        .previousSibling, 1)
}

function domFC(e) {
    return domEL((e || {})
        .firstChild)
}

function domLC(e) {
    return domEL((e || {})
        .lastChild, 1)
}

function domPN(e) {
    return (e || {})
        .parentNode
}

function domChildren(e) {
    for (var t = [], o = e.childNodes, n = 0; n < o.length; n++) o[n].tagName && t.push(o[n]);
    return t
}

function domInsertBefore(e, t) {
    var o = domPN(t);
    return o && o.insertBefore(e, t)
}

function domInsertAfter(e, t) {
    var o = domPN(t);
    return o && o.insertBefore(e, domNS(t))
}

function domByClass(e, t) {
    return e ? geByClass1(t, e) : e
}

function domData(e, t, o) {
    return e ? "undefined" != typeof o ? (e.setAttribute("data-" + t, o), o) : e.getAttribute("data-" + t) : null
}

function domCA(e, t) {
    var o = t ? e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector : function() {
        return !0
    };
    do e = domPN(e); while (e && !o.call(e, t));
    return e
}

function domCA(e, t) {
    var o = t ? e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector : function() {
        return !0
    };
    do e = domPN(e); while (e && !o.call(e, t));
    return e
}

function isAncestor(e, t) {
    var o = ge(e);
    if (t = ge(t), !e || !t) return !1;
    for (; o = o.parentNode;)
        if (o == t) return !0;
    return !1
}

function domClosestPositioned(e) {
    for (var t = domPN(e); t && t != bodyNode;) {
        var o = getStyle(t, "position"),
            n = getStyle(t, "overflow");
        if (inArray(o, ["relative", "absolute", "fixed"]) && "hidden" != n) break;
        t = domPN(t)
    }
    return t
}

function show(e) {
    var t = arguments.length;
    if (t > 1)
        for (var o = 0; t > o; o++) show(arguments[o]);
    else if (e = ge(e), e && e.style) {
        var n = e.olddisplay,
            a = "block",
            i = e.tagName.toLowerCase();
        e.style.display = n || "", "none" === getStyle(e, "display") && (a = hasClass(e, "inline") || hasClass(e, "_inline") ? "inline" : hasClass(e, "_inline_block") ?
            "inline-block" : "tr" !== i || browser.msie ? "table" !== i || browser.msie ? "block" : "table" : "table-row", e.style.display = e.olddisplay = a)
    }
}

function hide(e) {
    var t = arguments.length;
    if (t > 1)
        for (var o = 0; t > o; o++) hide(arguments[o]);
    else if (e = ge(e), e && e.style) {
        var n = getStyle(e, "display");
        e.olddisplay = "none" != n ? n : "", e.style.display = "none"
    }
}

function isVisible(e) {
    return e = ge(e), e && e.style ? "none" != getStyle(e, "display") : !1
}

function clientHeight() {
    return window.innerHeight || docEl.clientHeight || bodyNode.clientHeight
}

function getClientRectOffsetY(e, t, o) {
    e = ge(e), o = o || 0;
    var n = getXY(e)[1],
        a = getSize(e)[1],
        i = window,
        r = document.documentElement,
        s = Math.max(intval(i.innerHeight), intval(r.clientHeight)),
        l = ge("page_header_cont"),
        c = getSize(l)[1],
        d = r.scrollTop || bodyNode.scrollTop || window.scrollY || 0;
    if (t) {
        if (d + c + o > n + a) return n + a - d - c - o;
        if (n > d + s - o) return n - d - s + o
    } else {
        if (d + c + o > n) return n - d + c - o;
        if (n + a > d + s - o) return n + a - d - s + o
    }
    return 0
}

function toggle(e, t) {
    void 0 === t && (t = !isVisible(e)), t ? show(e) : hide(e)
}

function toggleFlash(e, t) {
    if (clearTimeout(hfTimeout), t > 0) return void(hfTimeout = setTimeout(function() {
        toggleFlash(e, 0)
    }, t));
    var o = e ? "visible" : "hidden";
    triggerEvent(document, e ? "unblock" : "block");
    var n = function() {
        this.getAttribute("preventhide") || ("flash_app" == this.id && browser.msie ? e ? setStyle(this, {
            position: "static",
            top: 0
        }) : setStyle(this, {
            position: "absolute",
            top: "-5000px"
        }) : this.style.visibility = o)
    };
    each(geByTag("embed"), n), each(geByTag("object"), n)
}

function boundingRectEnabled(e) {
    return "undefined" != typeof e.getBoundingClientRect
}

function getXYRect(e, t) {
    var o;
    if (t && "inline" == getStyle(e, "display")) {
        var n = e.getClientRects();
        o = n && n[0] || e.getBoundingClientRect()
    } else o = e.getBoundingClientRect();
    return o
}

function getXY(e, t) {
    if (e = ge(e), !e) return [0, 0];
    var o, n, a = {
            top: 0,
            left: 0
        },
        i = e.ownerDocument;
    return i ? (o = i.documentElement, boundingRectEnabled(e) && (a = getXYRect(e, !0)), n = i == i.window ? i : 9 === i.nodeType ? i.defaultView || i.parentWindow : !1, [a.left +
        (t ? 0 : n.pageXOffset || o.scrollLeft) - (o.clientLeft || 0), a.top + (t ? 0 : n.pageYOffset || o.scrollTop) - (o.clientTop || 0)
    ]) : [0, 0]
}

function isWindow(e) {
    return null != e && e === e.window
}

function getSize(e, t, o) {
    function n() {
        if (i = boundingRectEnabled(e) && (a = getXYRect(e, o)) && void 0 !== a.width ? [a.width, a.height] : [e.offsetWidth, e.offsetHeight], t) {
            each(i, function(t, o) {
                var n = t ? ["Top", "Bottom"] : ["Left", "Right"];
                each(n, function() {
                    i[t] -= parseFloat(getStyle(e, "padding" + this)) || 0, i[t] -= parseFloat(getStyle(e, "border" + this + "Width")) || 0
                })
            })
        }
    }
    e = ge(e);
    var a, i = [0, 0],
        r = document.documentElement;
    if (t && "border-box" === getStyle(e, "boxSizing") && (t = !1), e == document) i = [Math.max(r.clientWidth, bodyNode.scrollWidth, r.scrollWidth, bodyNode.offsetWidth, r.offsetWidth),
        Math.max(r.clientHeight, bodyNode.scrollHeight, r.scrollHeight, bodyNode.offsetHeight, r.offsetHeight)
    ];
    else if (e)
        if (isVisible(e)) n();
        else {
            var s = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block"
                },
                l = {},
                c = !1;
            e.style.cssText.indexOf("!important") > -1 && (c = e.style.cssText), each(s, function(t, o) {
                l[t] = e.style[t], e.style[t] = o
            }), n(), each(s, function(t, o) {
                e.style[t] = l[t]
            }), c && (e.style.cssText = c)
        }
    return i
}

function getZoom() {
    var e = ge("zoom_test_1") || document.body.appendChild(ce("div", {
            id: "zoom_test_1"
        }, {
            left: "10%",
            position: "absolute",
            visibility: "hidden"
        })),
        t = ge("zoom_test_2") || document.body.appendChild(ce("div", {
            id: "zoom_test_2"
        }, {
            left: e.offsetLeft + "px",
            position: "absolute",
            visibility: "hidden"
        }));
    return t.offsetLeft / e.offsetLeft
}

function rand(e, t) {
    return Math.random() * (t - e + 1) + e
}

function irand(e, t) {
    return Math.floor(rand(e, t))
}

function isUndefined(e) {
    return "undefined" == typeof e
}

function isFunction(e) {
    return "[object Function]" === Object.prototype.toString.call(e)
}

function isArray(e) {
    return "[object Array]" === Object.prototype.toString.call(e)
}

function isString(e) {
    return "string" == typeof e
}

function isObject(e) {
    return "[object Object]" === Object.prototype.toString.call(e) && !(browser.msie8 && e && "undefined" !== e.item && "undefined" !== e.namedItem)
}

function isEmpty(e) {
    if ("[object Object]" !== Object.prototype.toString.call(e)) return !1;
    for (var t in e)
        if (e.hasOwnProperty(t)) return !1;
    return !0
}

function vkNow() {
    return +new Date
}

function vkImage() {
    return window.Image ? new Image : ce("img")
}

function trim(e) {
    return (e || "")
        .replace(/^\s+|\s+$/g, "")
}

function stripHTML(e) {
    return e ? e.replace(/<(?:.|\s)*?>/g, "") : ""
}

function escapeRE(e) {
    return e ? e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1") : ""
}

function intval(e) {
    return e === !0 ? 1 : parseInt(e) || 0
}

function floatval(e) {
    return e === !0 ? 1 : parseFloat(e) || 0
}

function positive(e) {
    return e = intval(e), 0 > e ? 0 : e
}

function winToUtf(e) {
    return e.replace(/&#(\d\d+);/g, function(e, t) {
            return t = intval(t), t >= 32 ? String.fromCharCode(t) : e
        })
        .replace(/&quot;/gi, '"')
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&amp;/gi, "&")
}

function replaceEntities(e) {
    return se("<textarea>" + (e || "")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;") + "</textarea>")
        .value
}

function clean(e) {
    return e ? e.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;") : ""
}

function unclean(e) {
    return replaceEntities(e.replace(/\t/g, "\n"))
}

function each(e, t) {
    if (isObject(e) || "undefined" == typeof e.length) {
        for (var o in e)
            if (Object.prototype.hasOwnProperty.call(e, o) && t.call(e[o], o, e[o]) === !1) break
    } else
        for (var n = 0, a = e.length; a > n; n++) {
            var i = e[n];
            if (t.call(i, n, i) === !1) break
        }
    return e
}

function indexOf(e, t, o) {
    for (var n = o || 0, a = (e || [])
            .length; a > n; n++)
        if (e[n] == t) return n;
    return -1
}

function inArray(e, t) {
    return -1 != indexOf(t, e)
}

function clone(e, t) {
    var o = isObject(e) || "undefined" == typeof e.length ? {} : [];
    for (var n in e)(!/webkit/i.test(_ua) || "layerX" != n && "layerY" != n && "webkitMovementX" != n && "webkitMovementY" != n) && (t && "object" == typeof e[n] && "prototype" !==
        n && null !== e[n] ? o[n] = clone(e[n]) : o[n] = e[n]);
    return o
}

function arrayKeyDiff(e) {
    var t, o, n = {},
        a = 1,
        i = arguments.length,
        r = arguments;
    for (t in e) {
        for (o = !1, a = 1; i > a; a++) r[a][t] && r[a][t] == e[t] && (o = !0);
        o || (n[t] = e[t])
    }
    return n
}

function extend() {
    var e, t = arguments,
        o = t[0] || {},
        n = 1,
        a = t.length,
        i = !1;
    for ("boolean" == typeof o && (i = o, o = t[1] || {}, n = 2), "object" == typeof o || isFunction(o) || (o = {}); a > n; ++n)
        if (null != (e = t[n]))
            for (var r in e) {
                var s = o[r],
                    l = e[r];
                o !== l && (i && l && "object" == typeof l && !l.nodeType ? o[r] = extend(i, s || (null != l.length ? [] : {}), l) : void 0 !== l && (o[r] = l))
            }
        return o
}

function hasClass(e, t) {
    return e = ge(e), e && 1 === e.nodeType && (" " + e.className + " ")
        .replace(window.whitespaceRegex, " ")
        .indexOf(" " + t + " ") >= 0 ? !0 : !1
}

function addClass(e, t) {
    (e = ge(e)) && !hasClass(e, t) && (e.className = (e.className ? e.className + " " : "") + t)
}

function addClassDelayed(e, t) {
    setTimeout(addClass.pbind(e, t), 0)
}

function removeClass(e, t) {
    (e = ge(e)) && (e.className = trim((e.className || "")
        .replace(new RegExp("(\\s|^)" + t + "(\\s|$)"), " ")))
}

function removeClassDelayed(e, t) {
    setTimeout(removeClass.pbind(e, t), 0)
}

function toggleClass(e, t, o) {
    return void 0 === o && (o = !hasClass(e, t)), (o ? addClass : removeClass)(e, t), o
}

function toggleClassDelayed(e, t, o) {
    return void 0 === o && (o = !hasClass(e, t)), (o ? addClassDelayed : removeClassDelayed)(e, t), o
}

function replaceClass(e, t, o) {
    removeClass(e, t), addClass(e, o)
}

function getStyle(e, t, o) {
    if (e = ge(e), isArray(t)) {
        var n = {};
        return each(t, function(t, o) {
            n[o] = getStyle(e, o)
        }), n
    }
    if (!e) return "";
    if (void 0 === o && (o = !0), !o && "opacity" == t && browser.msie) {
        var a = e.style.filter;
        return a ? a.indexOf("opacity=") >= 0 ? parseFloat(a.match(/opacity=([^)]*)/)[1]) / 100 + "" : "1" : ""
    }
    if (!o && e.style && (e.style[t] || "height" == t)) return e.style[t];
    var i, r = document.defaultView || window;
    if (r.getComputedStyle) {
        t = t.replace(/([A-Z])/g, "-$1")
            .toLowerCase();
        var s = r.getComputedStyle(e, null);
        s && (i = s.getPropertyValue(t))
    } else if (e.currentStyle) {
        if ("opacity" == t && browser.msie) {
            var a = e.currentStyle.filter;
            return a && a.indexOf("opacity=") >= 0 ? parseFloat(a.match(/opacity=([^)]*)/)[1]) / 100 + "" : "1"
        }
        var l = t.replace(/\-(\w)/g, function(e, t) {
            return t.toUpperCase()
        });
        i = e.currentStyle[t] || e.currentStyle[l], "auto" == i && (i = 0), i = (i + "")
            .split(" "), each(i, function(t, o) {
                if (!/^\d+(px)?$/i.test(o) && /^\d/.test(o)) {
                    var n = e.style,
                        a = n.left,
                        r = e.runtimeStyle.left;
                    e.runtimeStyle.left = e.currentStyle.left, n.left = o || 0, i[t] = n.pixelLeft + "px", n.left = a, e.runtimeStyle.left = r
                }
            }), i = i.join(" ")
    }
    if (o && ("width" == t || "height" == t)) {
        var c = getSize(e, !0)[{
            width: 0,
            height: 1
        }[t]];
        i = (intval(i) ? Math.max(floatval(i), c) : c) + "px"
    }
    return i
}

function setStyle(e, t, o) {
    if (e = ge(e)) {
        if ("object" == typeof t) return each(t, function(t, o) {
            setStyle(e, t, o)
        });
        if ("opacity" == t) browser.msie && ((o + "")
            .length ? 1 !== o ? e.style.filter = "alpha(opacity=" + 100 * o + ")" : e.style.filter = "" : e.style.cssText = e.style.cssText.replace(/filter\s*:[^;]*/gi, ""), e
            .style.zoom = 1), e.style.opacity = o;
        else try {
            var n = "number" == typeof o;
            n && /height|width/i.test(t) && (o = Math.abs(o)), e.style[t] = n && !/z-?index|font-?weight|opacity|zoom|line-?height/i.test(t) ? o + "px" : o
        } catch (a) {
            debugLog("setStyle error: ", [t, o], a)
        }
    }
}

function setStyleDelayed(e, t, o) {
    setTimeout(setStyle.pbind(e, t, o), 0)
}

function setPseudoStyle(e, t, o) {
    var n = data(e, "pseudo-id");
    n || (data(e, "pseudo-id", n = irand(1e8, 999999999)), addClass(e, "_pseudo_" + n));
    var a = t + "-style-" + n,
        i = ge(a),
        r = "._pseudo_" + n + ":" + t + "{";
    i || (i = headNode.appendChild(ce("style", {
        id: a,
        type: "text/css"
    }))), each(o, function(e, t) {
        r += e + ": " + t + " !important;"
    }), r += "}", i.sheet ? (i.sheet.cssRules.length && i.sheet.deleteRule(0), i.sheet.insertRule(r, 0)) : i.styleSheet && (i.styleSheet.cssText = r)
}

function data(e, t, o) {
    if (!e) return !1;
    var n, a = e[vkExpand];
    return a || (a = e[vkExpand] = ++vkUUID), o !== n && (vkCache[a] || (vkCache[a] = {}, __debugMode && (vkCache[a].__elem = e)), vkCache[a][t] = o), t ? vkCache[a] && vkCache[a]
        [t] : a
}

function attr(e, t, o) {
    return e = ge(e), "undefined" == typeof o ? e.getAttribute(t) : (e.setAttribute(t, o), o)
}

function removeAttr(e) {
    for (var t = 0, o = arguments.length; o > t; ++t) {
        var n = arguments[t];
        if (void 0 !== e[n]) try {
            delete e[n]
        } catch (a) {
            try {
                e.removeAttribute(n)
            } catch (a) {}
        }
    }
}

function removeData(e, t) {
    var o = e ? e[vkExpand] : !1;
    if (o)
        if (t) {
            if (vkCache[o]) {
                delete vkCache[o][t], t = "";
                var n = 0;
                for (t in vkCache[o])
                    if ("__elem" !== t) {
                        n++;
                        break
                    }
                n || removeData(e)
            }
        } else removeEvent(e), removeAttr(e, vkExpand), delete vkCache[o]
}

function cleanElems() {
    for (var e = arguments, t = 0; t < e.length; ++t) {
        var o = ge(e[t]);
        o && (removeData(o), removeAttr(o, "btnevents"))
    }
}

function animate(e, t, o, n) {
    if (e = ge(e)) {
        var a, i = isFunction(n) ? n : function() {},
            r = extend({}, "object" == typeof o ? o : {
                duration: o,
                onComplete: i
            }),
            s = {},
            l = {},
            c = isVisible(e);
        r.orig = {}, t = clone(t), t.discrete && (r.discrete = 1, delete t.discrete), browser.iphone && (r.duration = 0);
        var d = data(e, "tween"),
            u = c ? "hide" : "show";
        d && d.isTweening && (r.orig = extend(r.orig, d.options.orig), d.stop(!1), d.options.show ? u = "hide" : d.options.hide && (u = "show"));
        for (a in t) {
            if (!d && ("show" == t[a] && c || "hide" == t[a] && !c)) return r.onComplete.call(this, e);
            if ("height" != a && "width" != a || !e.style || (t.overflow || (void 0 == r.orig.overflow && (r.orig.overflow = getStyle(e, "overflow")), e.style.overflow = "hidden"),
                    hasClass(e, "inl_bl") || "TD" == e.tagName || (e.style.display = "block")), /show|hide|toggle/.test(t[a]))
                if ("toggle" == t[a] && (t[a] = u), "show" == t[a]) {
                    var h = 0;
                    r.show = !0, void 0 == r.orig[a] && (r.orig[a] = getStyle(e, a, !1) || "", setStyle(e, a, 0));
                    var p;
                    "height" == a && browser.msie6 ? (p = "0px", e.style.overflow = "") : p = r.orig[a];
                    var f = e.style[a];
                    e.style[a] = p, t[a] = parseFloat(getStyle(e, a, !0)), e.style[a] = f, "height" == a && browser.msie && !t.overflow && (e.style.overflow = "hidden")
                } else void 0 == r.orig[a] && (r.orig[a] = getStyle(e, a, !1) || ""), r.hide = !0, t[a] = 0
        }
        return r.show && !c && show(e), d = new Fx.Base(e, r), each(t, function(t, o) {
            if (/backgroundColor|borderBottomColor|borderLeftColor|borderRightColor|borderTopColor|color|borderColor|outlineColor/.test(t)) {
                var n = "borderColor" == t ? "borderTopColor" : t;
                if (h = getColor(e, n), o = getRGB(o), void 0 === h) return
            } else {
                var a = o.toString()
                    .match(/^([+-]=)?([\d+-.]+)(.*)$/);
                d.cur(t, !0) || 0;
                a && (o = parseFloat(a[2]), a[1] && (o = ("-=" == a[1] ? -1 : 1) * o + o)), r.hide && "height" == t && browser.msie6 && (e.style.height = "0px", e.style.overflow =
                        ""), h = d.cur(t, !0), r.hide && "height" == t && browser.msie6 && (e.style.height = "", e.style.overflow = "hidden"), 0 != h || "width" != t &&
                    "height" != t || (h = 1), "opacity" == t && o > 0 && !c && (setStyle(e, "opacity", 0), h = 0, show(e))
            }(h != o || isArray(h) && h.join(",") == o.join(",")) && (s[t] = h, l[t] = o)
        }), d.start(s, l), data(e, "tween", d), d
    }
}

function cubicBezier(e, t, o, n, a, i) {
    var r, s, l, c, d, u, h = function(t) {
            var n = 1 - t;
            return 3 * n * n * t * e + 3 * n * t * t * o + t * t * t
        },
        p = function(e) {
            var o = 1 - e;
            return 3 * o * o * e * t + 3 * o * e * e * n + e * e * e
        },
        f = function(t) {
            var n = 1 - t;
            return 3 * (2 * (t - 1) * t + n * n) * e + 3 * (-t * t * t + 2 * n * t) * o
        },
        g = a;
    for (l = g, u = 0; 8 > u; u++) {
        if (c = h(l) - g, Math.abs(c) < i) return p(l);
        if (d = f(l), Math.abs(d) < 1e-6) break;
        l -= c / d
    }
    if (r = 0, s = 1, l = g, r > l) return p(r);
    if (l > s) return p(s);
    for (; s > r;) {
        if (c = h(l), Math.abs(c - g) < i) return p(l);
        g > c ? r = l : s = l, l = .5 * (s - r) + r
    }
    return p(l)
}

function fadeTo(e, t, o, n) {
    return animate(e, {
        opacity: o
    }, t, n)
}

function genFx(e, t) {
    var o = {};
    return each(Fx.Attrs.concat.apply([], Fx.Attrs.slice(0, t)), function() {
        o[this] = e
    }), o
}

function getRGB(e) {
    var t;
    return e && isArray(e) && 3 == e.length ? e : (t = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(e)) ? [parseInt(t[1]), parseInt(t[2]), parseInt(t[3])] :
        (t = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(e)) ? [2.55 * parseFloat(t[1]), 2.55 * parseFloat(t[2]), 2.55 *
            parseFloat(t[3])
        ] : (t = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(e)) ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : (t =
            /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(e)) ? [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)] : void 0
}

function getColor(e, t) {
    var o;
    do {
        if (o = getStyle(e, t), o.indexOf("rgba") || (o = ""), "" != o && "transparent" != o || "body" == e.nodeName.toLowerCase()) break;
        t = "backgroundColor"
    } while (e = e.parentNode);
    return getRGB(o)
}

function scrollToY(e, t, o, n) {
    void 0 == t && (t = 400);
    var a = "ontouchstart" in document.documentElement;
    if (a && (t = 0), n || (e = Math.max(0, e - getSize("page_header_cont")[1])), browser.msie6 ? data(pageNode, "tween") && data(pageNode, "tween")
        .stop(!1) : (data(bodyNode, "tween") && data(bodyNode, "tween")
            .stop(!1), data(htmlNode, "tween") && data(htmlNode, "tween")
            .stop(!1)), window.scrollAnimation = !1, t) {
        var i = function() {
            window.scrollAnimation = !1, 2 === o && ("profile" != cur.module && "public" != cur.module && "group" != cur.module && "groups" != cur.module && "event" != cur.module ||
                !window.Wall || Wall.scrollCheck(!1, void 0, !0), updSideTopLink())
        };
        window.scrollAnimation = !0, browser.msie6 ? animate(pageNode, {
            scrollTop: e
        }, t, i) : (animate(htmlNode, {
            scrollTop: e
        }, {
            duration: t,
            transition: Fx.Transitions.easeInCirc,
            onComplete: i
        }), animate(bodyNode, {
            scrollTop: e
        }, {
            duration: t,
            transition: Fx.Transitions.easeInCirc,
            onComplete: i
        }))
    } else {
        if (o && 2 !== o) {
            "profile" != cur.module && "public" != cur.module && "group" != cur.module && "event" != cur.module || !window.Wall || Wall.scrollCheck(!1, e, !0);
            var r = scrollGetY() - e;
            return Math.abs(r) > 6 && scrollToY(e + (r > 0 ? 6 : -6), 0, 2, !0), updSideTopLink(), clearTimeout(window.scrlToTO), void(window.scrlToTO = setTimeout(scrollToY.pbind(
                e, 100, 2, !0), 0))
        }
        window.scroll(scrollGetX(), e), browser.msie6 && (pageNode.scrollTop = e), o || updSideTopLink()
    }
}

function scrollToTop(e) {
    return scrollToY(0, e)
}

function scrollGetX() {
    return window.pageXOffset || scrollNode.scrollLeft || document.documentElement.scrollLeft
}

function scrollGetY() {
    return window.pageYOffset || scrollNode.scrollTop || document.documentElement.scrollTop
}

function shortCurrency() {
    var e = {};
    each(geByClass("_short_currency"), function() {
        var t = this.getAttribute("data-short") || "",
            o = winToUtf(t)
            .length,
            n = getStyle(this, "fontFamily") || "tahoma,arial,sans-serif";
        if (!t) return !0;
        if ("undefined" == typeof e[n]) {
            for (var a = "", i = o - 1; i >= 0; i--) a += "&#8399;";
            var r = ce("div", {
                innerHTML: "<b>" + t + "</b><b>" + a + "</b>"
            }, {
                fontFamily: n,
                fontSize: "24px"
            });
            ge("utils")
                .appendChild(r), e[n] = Math.abs(r.firstChild.offsetWidth - r.lastChild.offsetWidth) >= 3 * o, re(r)
        }
        e[n] && val(this, t)
    })
}

function notaBene(e, t, o) {
    if (e = ge(e)) {
        o || elfocus(e), void 0 === data(e, "backstyle") && data(e, "backstyle", e.style.backgroundColor || "");
        var n = data(e, "back") || data(e, "back", getStyle(e, "backgroundColor")),
            a = {
                notice: "#FFFFE0",
                warning: "#FAEAEA"
            };
        setStyle(e, "backgroundColor", a[t] || t || a.warning), setTimeout(animate.pbind(e, {
            backgroundColor: n
        }, 300, function() {
            e.style.backgroundColor = data(e, "backstyle")
        }), 400)
    }
}

function setTitle(e, t, o) {
    if (e = ge(e), e && !e.titleSet) {
        if (t || (t = e), t.scrollWidth > t.clientWidth) e.setAttribute("title", o || e.innerText || e.textContent);
        else {
            var n = geByTag1("b", e);
            n && n.scrollWidth > n.clientWidth ? e.setAttribute("title", o || e.innerText || e.textContent) : e.removeAttribute("title")
        }
        e.titleSet = 1
    }
}

function addEvent(e, t, o, n, a, i) {
    if (e = ge(e), e && 3 != e.nodeType && 8 != e.nodeType) {
        var r = a ? function() {
            var e = function(e) {
                var t = e.data;
                e.data = a;
                var n = o.apply(this, [e]);
                return e.data = t, n
            };
            return e.handler = o, e
        }() : o;
        e.setInterval && e != window && (e = window);
        var s = data(e, "events") || data(e, "events", {}),
            l = data(e, "handle") || data(e, "handle", function() {
                _eventHandle.apply(arguments.callee.elem, arguments)
            });
        l.elem = e, each(t.split(/\s+/), function(t, o) {
            s[o] || (s[o] = [], !n && e.addEventListener ? e.addEventListener(o, l, i) : !n && e.attachEvent && e.attachEvent("on" + o, l)), s[o].push(r)
        }), e = null
    }
}

function removeEvent(e, t, o, n) {
    if ("undefined" == typeof n && (n = !1), e = ge(e)) {
        var a = data(e, "events");
        if (a)
            if ("string" == typeof t) each(t.split(/\s+/), function(t, i) {
                if (isArray(a[i])) {
                    var r = a[i].length;
                    if (isFunction(o)) {
                        for (var s = r - 1; s >= 0; s--)
                            if (a[i][s] && (a[i][s] === o || a[i][s].handler === o)) {
                                a[i].splice(s, 1), r--;
                                break
                            }
                    } else {
                        for (var s = 0; r > s; s++) delete a[i][s];
                        r = 0
                    }
                    r || (e.removeEventListener ? e.removeEventListener(i, data(e, "handle"), n) : e.detachEvent && e.detachEvent("on" + i, data(e, "handle")), delete a[i])
                }
            }), isEmpty(a) && (removeData(e, "events"), removeData(e, "handle"));
            else
                for (var i in a) removeEvent(e, i)
    }
}

function triggerEvent(e, t, o, n) {
    e = ge(e);
    var a = data(e, "handle");
    if (a) {
        var i = function() {
            a.call(e, extend(o || {}, {
                type: t,
                target: e
            }))
        };
        n ? i() : setTimeout(i, 0)
    }
}

function cancelEvent(e) {
    if (e = e || window.event, !e) return !1;
    for (; e.originalEvent;) e = e.originalEvent;
    return e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.stopImmediatePropagation && e.stopImmediatePropagation(), e.cancelBubble = !0, e.returnValue = !
        1, !1
}

function stopEvent(e) {
    if (e = e || window.event, !e) return !1;
    for (; e.originalEvent;) e = e.originalEvent;
    return e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, !1
}

function _eventHandle(e) {
    e = normEvent(e);
    var t = data(this, "events");
    if (t && "string" == typeof e.type && t[e.type] && t[e.type].length) {
        var o = (t[e.type] || [])
            .slice();
        for (var n in o) {
            if ("mouseover" == e.type || "mouseout" == e.type) {
                for (var a = e.relatedElement; a && a != this;) try {
                    a = a.parentNode
                } catch (i) {
                    a = this
                }
                if (a == this) continue
            }
            var r = o[n].apply(this, arguments);
            if ((r === !1 || -1 === r) && cancelEvent(e), -1 === r) return !1
        }
    }
}

function normEvent(e) {
    e = e || window.event;
    var t = e;
    if (e = clone(t), e.originalEvent = t, e.target || (e.target = e.srcElement || document), 3 == e.target.nodeType && (e.target = e.target.parentNode), !e.relatedTarget && e.fromElement &&
        (e.relatedTarget = e.fromElement == e.target), null == e.pageX && null != e.clientX) {
        var o = document.documentElement,
            n = bodyNode;
        e.pageX = e.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o.clientLeft || 0), e.pageY = e.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o.clientTop ||
            0)
    }
    return !e.which && (e.charCode || 0 === e.charCode ? e.charCode : e.keyCode) && (e.which = e.charCode || e.keyCode), !e.metaKey && e.ctrlKey ? e.metaKey = e.ctrlKey : !e.ctrlKey &&
        e.metaKey && browser.mac && (e.ctrlKey = e.metaKey), !e.which && e.button && (e.which = 1 & e.button ? 1 : 2 & e.button ? 3 : 4 & e.button ? 2 : 0), e
}

function tnActive(e) {
    window.tnAct = e, addClass(e, "active")
}

function tnInactive() {
    removeClass("head_music", "head_play_down"), removeClass("top_logo_down", "tld_d"), removeClass(window.tnAct, "active")
}

function __checkData() {
    var e = [];
    for (var t in vkCache) {
        var o, n = vkCache[t];
        if (n && (o = n.__elem)) {
            var a = o.id;
            if (a || (o.id = a = "__vk" + irand(1e6, 9999999)), ge(a) != o) {
                var i = [];
                for (var r in n)
                    if (!("__elem" == r || "handle" == r && n.events))
                        if ("events" == r) {
                            var s = [];
                            for (var l in n[r]) s.push(l + "(" + n[r][l].length + ")");
                            i.push("{" + s.join(", ") + "}")
                        } else i.push(r);
                e.push("<b>" + debugEl(o) + "</b>: " + i.join(", "))
            }
        }
    }
    return e.join("<br>")
}

function updSeenAdsInfo() {
    var e = (getXY("ads_left", !0) || {})[1];
    if (e && vk.id) {
        var t = isVisible("left_friends") ? getSize(ge("left_friends"))[1] : 0,
            o = getXY("ads_left", !0)[1],
            n = Math.floor(((window.lastWindowHeight || 0) - o + t) / 230);
        __seenAds !== n && (__seenAds = n, setCookie("remixseenads", n, 30))
    }
}

function updSideTopLink(e) {
    if (window.scrollNode && !browser.mobile) {
        var t = ge("page_body"),
            o = getXY(t),
            n = scrollGetY(),
            a = bodyNode.scrollLeft,
            i = ge("side_bar"),
            r = isVisible(i);
        if (window._stlSideTop = Math.max((r ? getSize(i)[1] : 0) - n - (browser.mozilla ? getXY(pageNode)[1] : 0), o[1]), e || a != __scrLeft) {
            var s = ge("page_layout"),
                l = vk.rtl ? s.offsetLeft + s.offsetWidth : 0,
                c = vk.rtl ? (window.lastWindowWidth || 0) - l : s.offsetLeft;
            setStyle(_stlLeft, {
                width: Math.max(c - 1, 0)
            });
            var d = vk.rtl ? o[0] + t.offsetWidth + 5 : c,
                u = vk.rtl ? l - d : o[0] - 5 - d;
            setStyle(_stlSide, {
                left: d - a,
                width: Math.max(u, 0)
            }), __scrLeft = a
        }
        setStyle(_stlSide, {
            top: _stlSideTop,
            height: Math.max((window.lastWindowHeight || 0) - _stlSideTop, 0)
        }), __adsUpdate();
        var h = 200,
            p = _tbLink.loc || _stlWas || n > h,
            f = 0,
            g = !1,
            v = n > 250 && cur._regBar;
        p ? (1 !== _stlShown && (show(_stlLeft, _stlSide), addClass(_stlLeft, "stl_active"), addClass(_stlSide, "stl_active"), _stlShown = 1), _tbLink.loc && cur._noUpLink && (n =
                0), _stlWas && n > 500 && (_stlWas = 0), n > h ? (f = (n - h) / h, (_stlWasSet || _stlBack) && (_stlWasSet = _stlBack = 0, g = 1, val(_stlText, getLang(
                "global_to_top")), removeClass(_stlText, "down"), removeClass(_stlText, "back"))) : (f = (h - n) / h, _stlWas ? _stlWasSet || (_stlWasSet = 1, g = 0, val(
                _stlText, ""), addClass(_stlText, "down"), _stlBack && (_stlBack = 0, removeClass(_stlText, "back"))) : _tbLink.loc && (_stlBack || (_stlBack = 1, g =
                _tbLink.fast ? 1 : 0, val(_stlText, getLang("global_back")), addClass(_stlText, "back"), _stlWasSet && (_stlWasSet = 0, removeClass(_stlText, "down"))))), g !==
            !1 && toggleClass(_stlLeft, "over_fast", hasClass(_stlLeft, "over") && g), setStyle(_stlLeft, {
                opacity: Math.min(Math.max(f, 0), 1)
            })) : 0 !== _stlShown && (hide(_stlLeft, _stlSide), _stlShown = 0), vk.id || (!_regBar && v ? (_regBar = 1, val(ge("reg_bar_content"), cur._regBar), animate(ge(
            "reg_bar"), {
            top: 0,
            transition: Fx.Transitions.sineInOut
        }, 400), animate(ge("stl_bg"), {
            paddingTop: 60,
            transition: Fx.Transitions.sineInOut
        }, 400)) : _regBar && !v && (_regBar = 0, animate(ge("reg_bar"), {
            top: -56,
            transition: Fx.Transitions.sineInOut
        }, 400), animate(ge("stl_bg"), {
            paddingTop: 13,
            transition: Fx.Transitions.sineInOut
        }, 400)))
    }
}

function __adsGetAjaxParams(e, t) {
    if (window.noAdsAtAll) return !1;
    __adsGetAjaxParams = function() {
        return window.AdsLight && AdsLight.getAjaxParams.apply(AdsLight.getAjaxParams, arguments) || {
            al_ad: null
        }
    };
    var o = stManager.add(["aes_light.js"], __adsGetAjaxParams.pbind(e, t));
    return o || {
        al_ad: null
    }
}

function __adsUpdate(e) {
    return window.noAdsAtAll ? !1 : (__adsUpdate = function() {
        window.AdsLight && AdsLight.updateBlock.apply(AdsLight.updateBlock, arguments)
    }, void stManager.add(["aes_light.js"], __adsUpdate.pbind(e)))
}

function __adsSet(e, t, o, n, a) {
    return window.noAdsAtAll ? !1 : (__adsSet = function() {
        var e = "";
        arguments && arguments[0] && (e = arguments[0]), "<!--criteo" === e.slice(0, "<!--criteo".length) && Math.random() < .05 && (window.AdsLight && AdsLight.setNewBlock ?
            ajax.post("/wkview.php?act=mlet&mt=750", {}, {
                onFail: function() {
                    return !0
                }
            }) : ajax.post("/wkview.php?act=mlet&mt=751", {}, {
                onFail: function() {
                    return !0
                }
            })), window.AdsLight && AdsLight.setNewBlock.apply(AdsLight.setNewBlock, arguments)
    }, void stManager.add(["aes_light.js"], __adsSet.pbind(e, t, o, n, a)))
}

function __adsUpdateExternalStats(e) {
    return window.noAdsAtAll ? !1 : (__adsUpdateExternalStats = function() {
        window.AdsLight && AdsLight.updateExternalStats.apply(AdsLight.updateExternalStats, arguments)
    }, void stManager.add(["aes_light.js"], __adsUpdateExternalStats.pbind(e)))
}

function updGlobalPlayer() {}

function toggleGlobalPlayer(e) {}

function updateHeaderStyles(e) {
    var t = [ge("dev_top_nav_wrap"), ge("page_header_wrap")];
    each(t, function(t, o) {
        o && setStyle(o, e)
    })
}

function updateNarrow() {
    var e = ge("narrow_column"),
        t = e && geByClass1("page_block", e),
        o = ge("wide_column");
    if (e && t && o && !isVisible(boxLoader) && !isVisible(boxLayerBG) && !isVisible(layerBG)) {
        var n, a = window.lastWindowHeight || 0,
            i = Math.min(scrollGetY(), bodyNode.clientHeight - a),
            r = ge("page_layout"),
            s = ge("page_header_wrap"),
            l = getSize(s)[1],
            c = "fixed" == getStyle(e, "position"),
            d = intval(getStyle(t, "marginTop")),
            u = intval(getSize(e)[1]) - (c ? d : 0),
            h = intval(getSize(o)[1]),
            p = o.offsetTop,
            f = u >= h - d,
            g = d,
            v = Math.max(0, i + a - h - p - g),
            m = p - l,
            _ = intval(getXY(e)[1]) + (c ? d : 0),
            w = cur.lastSt || 0,
            b = cur.lastStyles || {},
            y = !1;
        m >= i || f ? n = {
            marginTop: 0
        } : i <= Math.min(w, _ - l - d) || a >= l + g + u + d + v ? (n = {
            top: l,
            marginLeft: Math.min(-bodyNode.scrollLeft, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(r)[0]))
        }, y = !0) : i >= Math.max(w, _ + u + g - a) && !v ? (n = {
            bottom: g,
            marginLeft: Math.min(-bodyNode.scrollLeft, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(r)[0]))
        }, y = !0) : n = {
            marginTop: v ? h - u : Math.min(_ - p, h - u + m)
        }, JSON.stringify(n) !== JSON.stringify(b) && (each(b, function(e, t) {
            b[e] = null
        }), setStyle(e, extend(b, n)), cur.lastStyles = n), y !== c && toggleClass(e, "fixed", y), cur.lastSt = i
    }
}

function updateLeftMenu() {
    var e = ge("side_bar_inner"),
        t = ge("page_body");
    if (e && t) {
        var o, n = window.lastWindowHeight || 0,
            a = Math.min(scrollGetY(), bodyNode.clientHeight - n),
            i = ge("page_layout"),
            r = ge("page_header_wrap"),
            s = getSize(r)[1],
            l = intval(getSize(e)[1]),
            c = getXY(e)[1],
            d = intval(getSize(t)[1]),
            u = getXY(t)[1],
            h = l >= d,
            p = cur.menuLastSt || 0,
            f = cur.menuLastStyles || {};
        if (o = 0 >= a || h ? {
                position: "relative",
                marginTop: s
            } : a <= Math.min(p, c - s) ? {
                position: "fixed",
                top: 0,
                marginLeft: Math.min(-bodyNode.scrollLeft, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(i)[0]))
            } : a >= Math.max(p, c + l - s) ? {
                position: "fixed",
                bottom: n - s,
                marginLeft: Math.min(-bodyNode.scrollLeft, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(i)[0]))
            } : {
                position: "relative",
                marginTop: Math.min(c, d + u - l)
            }, JSON.stringify(o) !== JSON.stringify(f)) {
            var g = {
                position: "relative",
                marginTop: null,
                marginLeft: null,
                top: null,
                bottom: null
            };
            setStyle(e, extend(g, o)), cur.menuLastStyles = o
        }
        cur.menuLastSt = a
    }
}

function updateSTL() {
    var e = window,
        t = document.documentElement,
        o = Math.max(intval(e.innerWidth), intval(t.clientWidth));
    toggleClass(bodyNode, "no_stl", o < vk.width + 230), toggleClass(bodyNode, "no_sett", o < vk.width + 62)
}

function checkPageBlocks() {
    var e = ge("content");
    if (e) {
        if (toggleClass(e, "page_block", !geByClass1("page_block", e)), ajax.framedata) return void(cur.onFrameBlocksDone = function() {
            lTimeout(checkPageBlocks, 0)
        });
        var t = geByClass1("wide_column"),
            o = geByClass1("narrow_column");
        if (t && o) {
            var n = geByClass("page_block", t),
                a = n && n.pop();
            for (each(n, function() {
                    setStyle(this, {
                        minHeight: ""
                    })
                }); a && (!isVisible(a) || !getSize(a)[1]);) a = n.pop();
            if (a) {
                var i = getSize(t)[1],
                    r = getSize(o)[1] + ("fixed" == getStyle(o, "position") ? 0 : o.offsetTop);
                r > i && setStyle(a, {
                    minHeight: getSize(a, !0)[1] + r - i
                })
            }
        }
    }
}

function onBodyResize(e) {
    var t = window,
        o = document.documentElement;
    if (t.pageNode) {
        var n = Math.max(intval(t.innerWidth), intval(o.clientWidth)),
            a = Math.max(intval(t.innerHeight), intval(o.clientHeight)),
            i = sbWidth(),
            r = !1;
        if (browser.mobile ? (n = Math.max(n, intval(bodyNode.scrollWidth)), a = Math.max(a, intval(bodyNode.scrollHeight))) : browser.msie7 ? htmlNode.scrollHeight > htmlNode.offsetHeight &&
            !layers.visible && (n += i + 1) : browser.msie8 && htmlNode.scrollHeight + 3 > htmlNode.offsetHeight && !layers.visible && (n += i + 1), t.lastWindowWidth != n || e ===
            !0) {
            r = !0, t.lastInnerWidth = t.lastWindowWidth = n, layerWrap.style.width = boxLayerWrap.style.width = n + "px";
            var s = layer.style.width = boxLayer.style.width = n - i - 2 + "px";
            if (window.mvLayerWrap && !mvcur.minimized && (mvLayerWrap.style.width = n + "px", mvLayer.style.width = s), window.wkLayerWrap && (wkLayerWrap.style.width = n + "px",
                    wkLayer.style.width = s), bodyNode.offsetWidth < vk.width + i + 2 && (n = vk.width + i + 2), n)
                for (var l = pageNode.firstChild; l; l = l.nextSibling)
                    if (l.tagName) {
                        for (var c = (t.lastInnerWidth = n - i * (browser.msie7 ? 2 : 1) - 1) - 1, d = l.firstChild; d; d = d.nextSibling) "scroll_fix" == d.className && (d.style.width =
                            c + "px");
                        updateHeaderStyles({
                            width: c
                        })
                    }
            _pads.shown && Pads.reposition()
        }
        if ((t.lastWindowHeight != a || e === !0) && (r = !0, t.lastWindowHeight = a, layerBG.style.height = boxLayerBG.style.height = layerWrap.style.height = boxLayerWrap.style.height =
                a + "px", window.mvLayerWrap && !mvcur.minimized && (mvLayerWrap.style.height = a + "px"), window.wkLayerWrap && (wkLayerWrap.style.height = a + "px"), _pads.layerBG &&
                (_pads.layerBG.style.height = a + "px"), browser.mozilla && layers.visible ? pageNode.style.height = _oldScroll + a + "px" : browser.msie6 && (pageNode.style.height =
                    a + "px")), vk.noSideTop || updSideTopLink(1), r && t.curRBox && t.curRBox.boxes && window.getWndInner) {
            var u = getWndInner();
            each(curRBox.boxes, function() {
                this._wnd_resize(u[0], u[1])
            })
        }
        setTimeout(updSeenAdsInfo, 0), getAudioPlayer(function(e) {
            e.audioLayer && e.audioLayer.isShown() && e.audioLayer.updatePosition()
        }), window.tooltips && tooltips.rePositionAll(), cur.lSTL && setStyle(cur.lSTL, {
            width: Math.max(getXY(cur.lSTL.el)[0], 0),
            height: a - 1
        }), ge("dev_top_nav") && setStyle(ge("dev_top_nav", "left", null));
        var h = geByClass("ui_search_fixed"),
            p = ge("narrow_column");
        each(h, function() {
            redraw(this, "ui_search_fixed"), setTimeout(redraw.pbind(this, "ui_search_fixed"), 0)
        }), p && (redraw(p, "fixed"), setTimeout(redraw.pbind(p, "fixed"), 0)), updateLeftMenu(), updateNarrow(), updateSTL()
    }
}

function redraw(e, t) {
    e && "fixed" == getStyle(e, "position") && (t ? removeClass(e, t) : setStyle(e, {
        position: "relative"
    }), e.offsetLeft, t ? addClass(e, t) : setStyle(e, {
        position: "fixed"
    }))
}

function onBodyScroll() {
    if (window.pageNode) {
        var e = Math.min(0, Math.max(-bodyNode.scrollLeft, bodyNode.clientWidth - getSize(ge("page_layout"))[0]));
        updateHeaderStyles({
            marginLeft: e
        }), updateLeftMenu(), updateNarrow(), updSideTopLink(), updGlobalPlayer(), _pads.shown && Pads.onScroll()
    }
}

function onDocumentClick(e) {
    if (checkEvent(e)) return !0;
    if (_pads.shown) {
        if (e && e.target && e.target.tagName && "input" != e.target.tagName.toLowerCase() && cur.__mdEvent && e.target != cur.__mdEvent.target) return;
        for (var t = e.target; t != bodyNode && !(!t || t.id && t.id.match(/^(box_|mv_|wk_|pad_)?(layer|pad)_(bg|wrap)$/) || (t.className || "")
                .match(/(^|\s)tt(\s|$)/)); t = domPN(t));
        t == bodyNode && Pads.hide()
    }
    if (ls.set("last_reloaded", []), !cur.onMouseClick || !cur.onMouseClick(e)) {
        if (!(e = window.event || e.originalEvent || e)) return !0;
        for (var o, n, a, i = 8, r = e.target || e.srcElement, s = window; r && r != bodyNode && "A" != r.tagName && i--;) r = r.parentNode;
        if (!r || "A" != r.tagName || r.onclick || r.onmousedown) return !0;
        if (o = r.href, o && (r.getAttribute("target") || nav.baseBlank)) {
            if (cur.hideReferrer && !browser.msie) return (blankWnd = s.open("", "_blank", "")) && (browser.msie && -1 != o.indexOf(";") && (o = "'" + o.replace(/'/g, "%27") + "'"),
                blankWnd.opener = null, blankWnd.document.write('<META HTTP-EQUIV="refresh" content="0; url=' + clean(o) + '">'), blankWnd.document.close()), cancelEvent(e);
            try {
                return s._opener.contentWindow.open(o, "_blank"), setTimeout(s._reopen, 0), cancelEvent(e)
            } catch (l) {
                return !0
            }
        }
        if ("https:" != location.protocol && !o.indexOf("https://")) return !0;
        o = o.replace(/^https?:\/\//i, ""), o.indexOf(location.hostname) || (o = o.replace(location.hostname, "")), (vk.dev && "vk.com" == location.hostname || "new.vk.com" ==
            location.hostname) && (o = o.replace(/^(vkontakte\.ru\/|vk\.com\/)/, "/"));
        var c = {};
        if ((a = o.match(/^\/(.+?)#[\!\/](.+?)$/)) && !a[1].match(/^app(\d+)/) && (c.permanent = a[1], o = "/" + a[2]), o.match(/#$/) || !(n = o.match(/^\/(.*?)(\?|#|$)/))) return !
            0;
        if (n = n[1], n.indexOf(".php") > 0 || n.match(/^(doc\-?\d+_\d+|graffiti\d+|reg\d+|images\/|utils\/|\.js|js\/|\.css|css\/|source\b)/)) return !0;
        var d = r.getAttribute("hrefparams");
        d && (c.params = extend(c.params || {}, q2ajx(d)));
        try {
            return nav.go(o, e, c), cancelEvent(e)
        } catch (e) {
            return !0
        }
    }
}

function onCtrlEnter(e, t) {
    e = e || window.event, (10 == e.keyCode || 13 == e.keyCode && (e.ctrlKey || e.metaKey && browser.mac)) && (t(), cancelEvent(e))
}

function setFavIcon(e, t) {
    if (window.icoNode && (e = e + "?" + ((stVersions || {})
            .favicon || ""), icoNode.getAttribute("href") != e || t)) {
        var o = ce("link", {
            rel: "shortcut icon",
            type: "image/gif",
            href: e
        });
        headNode.replaceChild(o, icoNode), icoNode = o
    }
}

function _stlClick(e) {
    return checkEvent(e) || cancelEvent(e)
}

function _stlMousedown(e) {
    if (e = e || window.event, !checkEvent(e) && !__afterFocus)
        if (_stlWasSet && _stlWas) {
            var t = _stlWas;
            _stlWas = 0, scrollToY(t, 0, !0, !0)
        } else 1 === _stlBack ? _tbLink.onclick() : (_stlWas = scrollGetY(), scrollToY(0, 0, !0, !0))
}

function _stlMouseover(e) {
    var t = e ? e.originalEvent || e : window.event || {},
        o = "mouseover" == t.type && (t.pageX > 0 || t.clientX > 0);
    toggleClass(_stlLeft, "over", o), toggleClass(_stlLeft, "over_fast", o && (0 === _stlBack || _tbLink.fast) && 0 === _stlWasSet), toggleClass(_stlSide, "over", o)
}

function domStarted() {
    if (window.headNode = geByTag1("head"), extend(window, {
            icoNode: geByTag1("link", headNode),
            bodyNode: geByTag1("body"),
            htmlNode: geByTag1("html"),
            utilsNode: ge("utils"),
            _fixedNav: !1,
            _tbLink: {}
        }), addEvent(bodyNode, "resize", onBodyResize.pbind(!1)), utilsNode) {
        browser.mozilla ? addClass(bodyNode, "firefox") : browser.mobile && addClass(bodyNode, "mobfixed");
        var e = [];
        each(browser, function(t, o) {
            o && !inArray(t, ["version", "mac", "search_bot"]) && "flash" !== t.substr(0, 5) && e.push(t)
        }), e = e.join(" "), bodyNode.setAttribute("data-useragent", e);
        for (var t in StaticFiles) {
            var o = StaticFiles[t];
            o.l = 1, "css" == o.t && utilsNode.appendChild(ce("div", {
                id: o.n
            }))
        }
        var n = ge("layer_bg"),
            a = n.nextSibling,
            i = ge("box_layer_bg"),
            r = i.nextSibling;
        if (extend(window, {
                _reopen: function() {
                    re(window._opener), window._opener = utilsNode.appendChild(ce("iframe"))
                },
                layerBG: n,
                boxLayerBG: i,
                layerWrap: a,
                layer: a.firstChild,
                boxLayerWrap: r,
                boxLayer: r.firstChild,
                boxLoader: r.firstChild.firstChild,
                _stlSide: ge("stl_side"),
                _stlLeft: ge("stl_left"),
                _stlShown: 0,
                _stlWas: 0,
                _stlWasSet: 0,
                _stlBack: 0,
                _regBar: 0,
                __afterFocus: !1,
                __needBlur: !1
            }), _reopen(), !browser.mobile) {
            var s = {
                onclick: _stlClick,
                onmousedown: _stlMousedown,
                onmouseover: _stlMouseover,
                onmouseout: _stlMouseover
            };
            val(_stlLeft, '<div id="stl_bg"><nobr id="stl_text">' + getLang("global_to_top") + "</nobr></div>"), extend(_stlLeft, s), extend(_stlSide, s), window._stlBg = _stlLeft
                .firstChild, window._stlText = _stlBg.firstChild, addEvent(window, "blur", function(e) {
                    _wf = -1, __needBlur = !1
                });
            var l = !0;
            addEvent(window, "focus", function(e) {
                _wf = 1, __needBlur || (__afterFocus = __needBlur = !0, setTimeout(function() {
                    __afterFocus = !1
                }, 10), l && (sbWidth(!0), onBodyResize(!0), l = !1))
            })
        }
        addEvent(boxLayerWrap, "click", __bq.hideLastCheck), extend(layers, {
            show: layers._show.pbind(n, a),
            boxshow: layers._show.pbind(i, r),
            wrapshow: layers._show.pbind(n),
            hide: layers._hide.pbind(n, a),
            boxhide: layers._hide.pbind(i, r),
            wraphide: layers._hide.pbind(n)
        }), hab.init(), window._retinaInit ? window._retinaInit() : window._initedCheck = 1
    }
}

function domReady() {
    if (utilsNode) {
        updateSTL();
        var e = ge("side_bar");
        extend(window, {
            pageNode: ge("page_wrap"),
            _fixedNav: e && "fixed" === getStyle(e, "position"),
            _tbLink: ge("top_back_link")
        }), window.scrollNode = browser.msie6 ? pageNode : browser.chrome || browser.safari ? bodyNode : htmlNode, 1 == vk.al && showTitleProgress();
        var t = Math.max(vkNow() - vk.started, 10),
            o = intval((vk.contlen || 1) / t * 1e3);
        if (browser.mozilla && browser.version >= 4 ? o /= 2.5 : browser.mozilla ? o *= 1.5 : browser.msie && browser.version >= 7 ? o /= 1.5 : browser.msie && (o *= 2.5), __stm.lowlimit =
            intval(150 * Math.max(2e6 / o, 1)), __stm.highlimit = 6 * __stm.lowlimit, __stm.lowlimit = Math.min(__stm.lowlimit, 600), onBodyResize(), setTimeout(onBodyResize.pbind(!
                1), 0), _pads.shown && Pads.updateHeight(), addEvent(window, "scroll", onBodyScroll), window.debuglogInit && debuglogInit(), !vk.id && ls.checkVersion() && ls.get(
                "last_reloaded")) try {
            var n = ["sound_notify_off"],
                a = {};
            each(n, function() {
                var e = ls.get(this);
                null !== e && (a[this] = e)
            }), window.localStorage.clear(), each(a, function(e, t) {
                ls.set(e, t)
            })
        } catch (i) {}
        if (Math.random() < 1e-4 && window.performance && performance.timing && performance.timing.navigationStart) {
            var r = (new Date)
                .getTime() - performance.timing.navigationStart;
            statlogsValueEvent("page_load", r, "domReady")
        }
    }
}

function onDomReady(e) {
    e()
}

function serializeForm(e) {
    if ("object" != typeof e) return !1;
    var t = {},
        o = function(t) {
            return geByTag(t, e)
        },
        n = function(o, n) {
            if (n.name)
                if ("text" != n.type && n.type)
                    if (n.getAttribute("bool")) {
                        var a = val(n);
                        if (!a || "0" === a) return;
                        t[n.name] = 1
                    } else t[n.name] = browser.msie && !n.value && e[n.name] ? e[n.name].value : n.value;
            else t[n.name] = val(n)
        };
    return each(o("input"), function(e, t) {
        return "radio" != t.type && "checkbox" != t.type || t.checked ? n(e, t) : void 0
    }), each(o("select"), n), each(o("textarea"), n), t
}

function ajx2q(e) {
    var t = [],
        o = function(e) {
            if (window._decodeEr && _decodeEr[e]) return e;
            try {
                return encodeURIComponent(e)
            } catch (t) {
                return e
            }
        };
    for (var n in e)
        if (null != e[n] && !isFunction(e[n]))
            if (isArray(e[n]))
                for (var a = 0, i = 0, r = e[n].length; r > a; ++a) null == e[n][a] || isFunction(e[n][a]) || (t.push(o(n) + "[" + i + "]=" + o(e[n][a])), ++i);
            else t.push(o(n) + "=" + o(e[n]));
    return t.sort(), t.join("&")
}

function q2ajx(e) {
    if (!e) return {};
    var t = {},
        o = function(e) {
            try {
                return decodeURIComponent(e)
            } catch (t) {
                return window._decodeEr = window._decodeEr || {}, _decodeEr[e] = 1, e
            }
        };
    return e = e.split("&"), each(e, function(e, n) {
        var a = n.split("=");
        if (a[0]) {
            var i = o(a[1] + "");
            if ("[]" == a[0].substr(a.length - 2)) {
                var r = o(a[0].substr(0, a.length - 2));
                t[r] || (t[r] = []), t[r].push(i)
            } else t[o(a[0])] = i
        }
    }), t
}

function vkLocal(e) {
    var t = PageID;
    return function() {
        t == PageID && e.apply(this, arguments)
    }
}

function lTimeout(e, t) {
    return setTimeout(vkLocal(e), t)
}

function requestBox(e, t, o) {
    return e.setOptions({
        onDestroy: o
    }), e.onDone = function() {
        t.apply(null, arguments)
    }, e
}

function activateMobileBox(e) {
    return requestBox(showBox("activation.php", {
        act: "activate_mobile_box",
        hash: e.hash
    }), function() {
        vk.nophone = 0, e.onDone()
    }, e.onFail)
}

function validateMobileBox(e) {
    return requestBox(showBox("activation.php", {
        act: "validate_box",
        captcha: e.acceptCaptcha ? 1 : "",
        skip_push: e.skip_push ? e.skip_push : "",
        hash: e.hash
    }, {
        stat: ["uncommon.css"]
    }), e.onDone, e.onFail)
}

function validatePassBox(e) {
    return requestBox(showBox("activation.php", {
        act: "pass_validate_box",
        hash: e.hash
    }, {
        stat: ["uncommon.css"]
    }), e.onDone, e.onFail)
}

function photoCaptchaBox(e) {
    return requestBox(showBox("pcaptcha.php", {
        act: "box"
    }, {
        stat: ["pcaptcha.css", "pcaptcha.js"]
    }), e.onDone, e.onFail)
}

function HistoryAndBookmarks(e) {
    var t, o = function(e) {
            var t = e.split("#"),
                o = t[0].split("?");
            return o[0] + (o[1] ? "?" + ajx2q(q2ajx(o[1])) : "") + (t[1] ? "#" + t[1] : "")
        },
        n = null,
        a = browser.msie6 || browser.msie7,
        i = function() {
            return n.contentDocument || (n.contentWindow ? n.contentWindow.document : n.document)
        },
        r = extend({
            onLocChange: function() {}
        }, e),
        s = function(e) {
            var t = "";
            if (3 == vk.al) t = (location.pathname || "") + (location.search || "") + (location.hash || "");
            else if (a && !e) try {
                t = i()
                    .getElementById("loc")
                    .innerHTML.replace(/&lt;/gi, "<")
                    .replace(/&gt;/gi, ">")
                    .replace(/&quot;/gi, '"')
                    .replace(/&amp;/gi, "&")
            } catch (n) {
                t = l
            } else t = (location.toString()
                .match(/#(.*)/) || {})[1] || "", t.substr(0, 1) != vk.navPrefix && (t = (location.pathname || "") + (location.search || "") + (location.hash || ""));
            return !t && vk.al > 1 && (t = (location.pathname || "") + (location.search || "")), o(t.replace(/^(\/|!)/, ""))
        },
        l = s(!0),
        c = function(e) {
            try {
                var t = i();
                t.open(), t.write(
                    '<script type="text/javascript">var u=navigator.userAgent,d=location.host.toString().match(/[a-zA-Z]+\\.[a-zA-Z]+$/)[0];if(/opera/i.test(u)||!/msie 6/i.test(u)||document.domain!=d)document.domain=d;</script><div id="loc">' +
                    e.replace("&", "&amp;")
                    .replace('"', "&quot;")
                    .replace(">", "&gt;")
                    .replace("<", "&lt;") + "</div>"), t.close()
            } catch (o) {}
        },
        d = function(e) {
            l = o(e);
            var t = (location.toString()
                .match(/#(.*)/) || {})[1] || "";
            if (!t && vk.al > 1 && (t = (location.pathname || "") + (location.search || "")), t = o(t), t.replace(/^(\/|!)/, "") != l) {
                if (3 == vk.al) try {
                    return void history.pushState({}, "", "/" + l)
                } catch (n) {}
                window.chHashFlag = !0, location.hash = "#" + vk.navPrefix + l, a && s() != l && c(l)
            }
        },
        u = function() {
            var e = s(!0);
            if (e != l)
                if (browser.msie6) {
                    if (reloadCheckFlood({
                            force: !0,
                            from: 6
                        })) return;
                    location.reload(!0)
                } else c(e)
        },
        h = function(e) {
            var t = s();
            (t != l || e === !0) && (r.onLocChange(t), l = t, a && location.hash.replace("#" + vk.navPrefix, "") != t && (location.hash = "#" + vk.navPrefix + t))
        },
        p = function() {
            try {
                if ("complete" != n.contentWindow.document.readyState) return
            } catch (e) {
                return
            }
            h()
        },
        f = function() {
            1 == vk.al && h(!0), 3 == vk.al ? (addEvent(window, "popstate", h), browser.safari && addEvent(window, "hashchange", h)) : a ? (n = ce("iframe", {
                id: "hab_frame"
            }), n.attachEvent("onreadystatechange", p), n.src = "/al_loader.php?act=hab_frame&loc=" + encodeURIComponent(l), utilsNode.appendChild(n), t = setInterval(u,
                200)) : "onhashchange" in window ? addEvent(window, "hashchange", function() {
                window.chHashFlag ? window.chHashFlag = !1 : h()
            }) : t = setInterval(h, 200)
        };
    return {
        setLoc: d,
        getLoc: s,
        init: f,
        setOptions: function(e) {
            r = extend(r, e)
        },
        checker: h,
        stop: function() {
            vk.al < 3 ? (clearInterval(t), a && n.detachEvent("onreadystatechange", p)) : 3 == vk.al && removeEvent(window, "popstate", h)
        }
    }
}

function checkEvent(e) {
    return (e = e || window.event) && ("click" == e.type || "mousedown" == e.type || "mouseup" == e.type) && (e.which > 1 || e.button > 1 || e.ctrlKey || e.shiftKey || browser.mac &&
        e.metaKey) || !1
}

function checkOver(e, t) {
    if (!e) return !0;
    e = e.originalEvent || e, t = t || e.target;
    var o = e.fromElement || e.relatedTarget;
    if (!o || o == t || o == t.parentNode) return !0;
    for (; o != t && o.parentNode && o.parentNode != bodyNode;) o = o.parentNode;
    return o != t
}

function leftBlockOver(e) {
    var t = 1;
    e.id || (e = ge("left_hide" + e), t = 0), (t || !e.timer) && (e.showing ? removeAttr(e, "showing") : (animate(e, {
        opacity: t ? 1 : .5
    }, 200), t && (e.showing = 1))), e.timer && (clearTimeout(e.timer), removeAttr(e, "timer"))
}

function leftBlockOut(e) {
    var t = .5;
    e.id || (e = ge("left_hide" + e), t = 0), e.timer = setTimeout(function() {
        animate(e, {
            opacity: t
        }, 200), removeAttr(e, "timer")
    }, 1)
}

function leftBlockHide(e, t, o) {
    var n = {
        act: "hide_block",
        block: e,
        hash: t
    };
    o && (n.block = o), ajax.post("al_index.php", n, {
        onDone: updSeenAdsInfo
    }), hide("left_block" + e)
}

function leftAdBlockClose(e, t) {
    function o(t) {
        if (t.done) {
            if ("ya_direct" == e) return animate(e, {
                opacity: 0
            }, 200, function() {
                re("ya_direct"), setTimeout(function() {
                    AdsLight.updateBlock("force_hard", 2)
                }, 5e3)
            }), void(vk__adsLight.yaDirectAdActive = !1);
            var o = ge("ads_ad_close_info_" + e);
            if (!o) return !1;
            setStyle(o, {
                opacity: 0
            }), o.style.setProperty("display", "block", "important"), setTimeout(n, 0)
        }
    }

    function n() {
        animate("ads_ad_close_info_" + e, {
            opacity: 1
        }, 200, a)
    }

    function a() {
        setStyle("ads_ad_box2_" + e, {
            visibility: "hidden"
        })
    }
    setStyle("left_hide" + e, {
        visibility: "hidden"
    }), ajax.post(t, {}, {
        noAds: !0,
        onDone: o
    })
}

function leftBlockFriendHide(e, t, o) {
    var n = ge("left_friends");
    if (n) {
        var a = geByClass("left_friend_block", n),
            i = [];
        for (var r in a) {
            var s = a[r].id.split("_");
            i.push(s[2])
        }
        var l = {
            act: "hide_block",
            block: t,
            showed: i.join(","),
            hash: o
        };
        ajax.post("al_index.php", l, {
            onDone: function(e) {
                if (e) {
                    var t = se(e);
                    geByClass("left_friend_block", n)
                        .length >= 2 && hide(t), n.insertBefore(t, geByClass1("left_friend_all_link", n))
                }
                geByClass("left_friend_block", n)
                    .length || hide("left_friend_all_link")
            }
        });
        var c = ge("left_block" + e),
            d = a.pop();
        d && !isVisible(d) ? (show(d), c.parentNode.replaceChild(d, c)) : re(c)
    }
}

function leftBlockToggleFriend(e, t, o, n, a) {
    n && stManager.add(["tooltips.css", "tooltips.js"]), cur.mfid = e, ajax.post("al_friends.php", {
        act: n ? "add" : "remove",
        mid: e,
        mf_type: t,
        hash: o,
        from: "leftblock"
    }, {
        onDone: function(t, o, n) {
            if (!t) return nav.reload();
            var a = ge("left_friend_status_" + e);
            cleanElems(a.firstChild), t ? (show(a), val(a, t)) : hide(a), o && (ajax.preload("al_friends.php", {
                act: "friend_tt",
                mid: e
            }, [o, n]), setTimeout(leftBlockFriendTooltip, 0))
        },
        showProgress: function() {
            var t = (ge("left_friend_subscribed") || {})
                .tt;
            t && (t.hide({
                    fasthide: 1
                }), t.destroy()), ge("left_friend_status_" + e)
                .innerHTML = '<img src="/images/upload' + (window.devicePixelRatio >= 2 ? "_2x" : "") + '.gif" width="32" />'
        },
        hideProgress: function() {
            hide("left_friend_status_" + e)
        },
        onFail: function(e) {
            return e ? (showFastBox({
                title: getLang("global_error")
            }, e), !0) : void 0
        }
    }), cancelEvent(a)
}

function leftBlockFriendTooltip() {
    return showTooltip(ge("left_friend_subscribed"), {
        url: "al_friends.php",
        params: {
            act: "friend_tt",
            mid: cur.mfid,
            from: "leftblock"
        },
        slide: 15,
        hidedt: 500,
        shift: [40, -1, 3],
        className: "preq_tt",
        forcetodown: !0
    })
}

function leftBlockUnpaidGiftsHide(e, t) {
    return showFastBox({
        title: getLang("left_delete_unpaid_gifts_title")
    }, getLang("left_delete_unpaid_gifts_text"), getLang("global_delete"), function() {
        leftBlockHide(e, t), re("payments_box_unpaid_gifts_info"), curBox()
            .hide()
    }, getLang("global_cancel"))
}

function comScoreUDM(e, t) {
    vk.zero || (t = t || document.referrer, vkImage()
        .src = locProtocol + "//" + ("https:" == locProtocol ? "sb" : "b") + ".scorecardresearch.com/p?c1=2&c2=13765216&c3=&c4=" + escape(e) + "&c5=&c7=" + escape(e) + "&c9=" +
        escape(t) + "&c15=&cv=2.0&cj=1&rn=" + Math.random())
}

function updateOtherCounters(e, t) {
    if (!vk.zero) {
        t = t || document.referrer;
        var o = [
                [new RegExp("(\\/(?:write|mail|im|al_im.php))(\\?[a-z0-9&=\\-_]*)?$"), "$1"],
                [new RegExp("(\\/write)(\\d*)(\\?[a-zA-Z0-9&=\\-_]*)?$"), "$1"]
            ],
            n = {
                referrer: t,
                url: e
            };
        each(n, function(e, t) {
                each(o, function() {
                    n[e] = n[e].replace(this[0], this[1])
                })
            }), t = n.referrer, e = n.url, vkImage()
            .src = locProtocol + "//counter.yadro.ru/hit?r" + escape(t) + (void 0 === window.screen ? "" : ";s" + screen.width + "*" + screen.height + "*" + (screen.colorDepth ?
                screen.colorDepth : screen.pixelDepth)) + ";u" + escape(e) + ";" + Math.random(), vkImage()
            .src = locProtocol + "//www.tns-counter.ru/V13a***R>" + t.replace(/\*/g, "%2a") + "*vk_com/ru/UTF-8/tmsec=vksite_total/" + Math.round(1e9 * Math.random()), comScoreUDM(
                e, t), window._tmr = window._tmr || [], window._tmr.push({
                id: "2579437",
                url: e,
                referrer: t,
                type: "pageView",
                start: (new Date)
                    .getTime(),
                pid: vk.id ? vk.id : 0
            })
    }
}

function handlePageView(e) {
    var t = ge("footer_wrap"),
        o = void 0 === e.width ? vk.width : e.width,
        n = void 0 === e.width_dec ? vk.width_dec : e.width_dec,
        a = void 0 === e.width_dec_footer ? vk.width_dec_footer : e.width_dec_footer;
    if ((vk.noleftmenu != e.noleftmenu || vk.nobottommenu != e.nobottommenu || vk.width != e.width || vk.width_dec_footer != e.width_dec_footer) && (vk.noleftmenu != e.noleftmenu &&
            e.noleftmenu && hide("side_bar"), vk.nobottommenu != e.nobottommenu && (e.nobottommenu ? hide("bottom_nav") : show("bottom_nav")), e.noleftmenu && e.nobottommenu ? t &&
            (addClass(t, "simple"), t.style.width = "auto") : t && (removeClass(t, "simple"), t.style.width = o - a + "px")), vk.notopmenu != e.notopmenu && (e.notopmenu ? hide(
            "quick_search", "qsearch_border", "top_search", "top_invite_link", "top_menu_wrap") : show("quick_search", "qsearch_border", "top_search", "top_invite_link",
            "top_menu_wrap")), o != vk.width || n != vk.width_dec) {
        ge("page_layout")
            .style.width = o + "px", ge("page_header")
            .style.width = o + "px", ge("page_body")
            .style.width = o - n + "px", ge("ts_wrap") && hasClass(ge("ts_wrap"), "vk") && (ge("ts_wrap")
                .style.width = o - 191 + "px"), setTimeout(updSideTopLink.pbind(!0), 0), setTimeout(updateSTL, 0);
        try {
            _tbLink.style.maxWidth = _tbLink.parentNode.offsetWidth - 35 + "px"
        } catch (i) {}
    }
    vk.noleftmenu == e.noleftmenu || e.noleftmenu || show("side_bar"), vk.noleftmenu = e.noleftmenu, vk.nobottommenu = e.nobottommenu, vk.notopmenu = e.notopmenu, vk.width = o, vk
        .width_dec = n, vk.width_dec_footer = a, vk.body_class = e.body_class, vk.no_ads = e.no_ads, vk.ad_preview = e.ad_preview
}

function handleSetCount(e, t, o) {
    var n = "",
        a = "",
        i = "spr" == o ? 5 : 3,
        r = '<span class="inl_bl left_count_sign"></span>',
        s = geByClass1("left_count_wrap", e, "span"),
        l = hasClass(geByClass1("left_row", e, "a"), "left_nav_over"),
        c = geByClass1("left_count", e, "span"),
        d = val(c);
    t && (n = t.toString(), n.length > i && (a = ' title="' + stripHTML(langNumeric(t, "%s", !0)) + '"', n = ".." + n.substr(n.length - i)), n = n, r =
        '<span class="inl_bl left_count" ' + a + ">" + n + "</span>");
    var u = function() {
        val(s, r), (t ? removeClass : addClass)(s, "left_void"), setStyle(s, {
            opacity: ""
        })
    };
    if (o && n != val(c) && (n || c) && Pads.invalidate(o), d || l)
        if (n) animateCount(c, n, {
            str: "auto",
            onDone: u
        });
        else if (l) {
        var h = bodyNode.appendChild(se('<span class="left_count_wrap"><span class="inl_bl left_count_sign"></span></span>'));
        plusWidth = getSize(domFC(h))[0], re(h), d && "." == d.charAt(0) && val(c, d.replace("..", "")), animate(c, {
            width: plusWidth
        }, 100, u)
    } else animate(s, {
        opacity: 0
    }, 100, u);
    else u(), setStyle(s, {
        opacity: 0
    }), animate(s, {
        opacity: 1
    }, 100)
}

function handlePageParams(e) {
    vk.id = e.id, e.body_class !== bodyNode.className && (bodyNode.className = e.body_class || ""), updateSTL(), void 0 !== e.pvbig && (vk.pvbig = e.pvbig), void 0 !== e.pvdark &&
        (vk.pvdark = e.pvdark), cur._level = e.level, vk.id && vk.id % 1e3 == 1 && setTimeout(function() {
            window.scrollmarked = {}, statlogsValueEvent("page_scroll", 0, cur.module, "0")
        }, 300), handlePageView(e);
    var t = ge("mvk_footer_lnk");
    if (t && (t.firstChild.href = e.mvklnk || "http://m.vk.com/"), vk.nophone = intval(e.nophone), vk.id) {
        var o = ge("left_blocks");
        o && (o.innerHTML = e.leftblocks || "")
    }
    "leftads" in e && 0 !== e.leftads && __adsSet(e.leftads, e.ads_section || "", e.ads_can_show, e.ads_showed);
    var n = locProtocol + "//" + location.host + "/";
    e.loc && (n += "?" == e.loc.charAt(0) ? nav.strLoc : e.loc);
    var a = document.URL == n ? "" : document.URL;
    if (setTimeout(updateOtherCounters.pbind(n, a), 10), e.counters) {
        var i = (e.counters || "")
            .split(","),
            r = "",
            s = "";
        intval(i[9]) > 0 ? (r = "exchange", s = "act=overview&status=-1") : intval(i[9]) < -1 ? (i[9] = 1, r = "ads", s = "act=a_comeback_office_redirect") : r =
            "ads?act=office&last=1";
        var l = 0,
            c = ge("l_set"),
            d = c && c.nextSibling || !1,
            u = !1,
            h = ["fr", "ph", "vid", "msg", "nts", "gr", "ev", "wsh", "ap", "ads", "ntf", "wk", "docs"],
            p = ["friends", "albums" + vk.id, "video", "", "notes", "groups", "events", "gifts.php?act=wishlist", "apps", r, "feed" + (ge("l_nwsf") ? "?section=notifications" : ""),
                "pages", "docs"
            ],
            f = ["", "act=added", "section=tagged", "", "act=comments", "", "tab=invitations", "", "", s, ge("l_nwsf") ? "" : "section=notifications"];
        if (e.handlecnts) {
            for (; 13 > l; ++l) handlePageCount(h[l], i[l], p[l], f[l]);
            for (var g = d.nextSibling; g; g = g.nextSibling) {
                if (g.tagName && "li" == g.tagName.toLowerCase() && isVisible(g)) {
                    u = !0;
                    break
                }
                if (hasClass(g, "more_div")) break
            }(u ? show : hide)(d);
            for (var v = i.length; v > l; ++l) {
                var m = i[l].split(":"),
                    g = ge("l_app" + intval(m[0]));
                g && handleSetCount(g, intval(m[1]))
            }
            setTimeout(updSeenAdsInfo, 0)
        } else
            for (; 13 > l; ++l) vk.counts[h[l]] = i[l]
    }
}

function handlePageCount(e, t, o, n) {
    var a = intval(t);
    if (void 0 === vk.counts && (vk.counts = {}), vk.counts[e] !== a) {
        if (vk.counts[e] = a, "ntf" == e) return void TopNotifier.setCount(a > 0 ? a : 0);
        var i, r = ge("l_" + e),
            s = hasClass(domFC(r), "left_nav_over");
        r && (handleSetCount(r, a > 0 ? a : 0, e), n && o && (i = a > 0 && n ? "?" + n : "", r.firstChild.href = "/" + o + i)), (a >= 0 || !s) && toggle(r, a >= 0)
    }
}

function processDestroy(e) {
    if (e._back && e._back.hide && e == cur)
        for (var t in e._back.hide) try {
            e._back.hide[t]()
        } catch (o) {
            try {
                console.log(o.stack)
            } catch (n) {}
        }
    if (e.destroy && e.destroy.length)
        for (var t in e.destroy) try {
            e.destroy[t](e)
        } catch (o) {
            try {
                console.log(o.stack)
            } catch (n) {}
        }
}

function globalHistoryDestroy(e) {
    for (var t = 0, o = globalHistory.length; o > t; ++t)
        if (globalHistory[t].loc == e) {
            var n = globalHistory.splice(t, 1)[0];
            processDestroy(n.cur), n.content.innerHTML = "", --t, --o
        }
}

function showBackLink(e, t, o) {
    var n = e;
    if (e = (e || "")
        .replace(/^\//, ""), _tbLink.loc = e, void 0 === o && (o = 0, e))
        for (var a = 0, i = globalHistory.length; i > a; ++a)
            if (globalHistory[a].loc == e) {
                o = 1;
                break
            }
    if (n) {
        try {
            _tbLink.style.maxWidth = _tbLink.parentNode.offsetWidth - 35 + "px"
        } catch (r) {}
        extend(_tbLink, {
            href: "/" + e,
            innerHTML: t,
            fast: o
        }), show(_tbLink), _stlWas = 0
    } else hide(_tbLink);
    updSideTopLink(1)
}

function reloadCheckFlood(e) {
    e = e || {};
    var t, o = ls.get("last_reloaded") || [],
        n = 1,
        a = 5;
    return o.unshift(vkNow()), (n = o.length) > a && (o.splice(a, n - a), n = a), ls.set("last_reloaded", o), t = n == a && o[0] - o[a - 1] < 2e4, t ? (topError(
        '<b>Reloading error</b>, please check internet connection, <b><a href="/page-777107_43991681">clear your cache</a></b> and restart your browser.<br>If problem remains, please <a href="/support?act=new">report it here</a>.', {
            dt: 15,
            type: 6,
            msg: "Reload error, from " + (e.from || 0) + ", forced " + (e.force || 0) + ", url " + (e.url || "") + ", query " + (e.query || "")
        }), !0) : !1
}

function _initCookies() {
    _cookies = {};
    for (var e = document.cookie.split(";"), t = /^[\s]*([^\s]+?)$/i, o = 0, n = e.length; n > o; o++) {
        var a = e[o].split("=");
        2 == a.length && (_cookies[a[0].match(t)[1]] = unescape(a[1].match(t) ? a[1].match(t)[1] : ""))
    }
}

function getCookie(e) {
    return _initCookies(), _cookies[e]
}

function setCookie(e, t, o, n) {
    var a = "";
    if (o) {
        var i = new Date;
        i.setTime(i.getTime() + 24 * o * 60 * 60 * 1e3), a = "; expires=" + i.toGMTString()
    }
    var r = locDomain;
    document.cookie = e + "=" + escape(t) + a + "; path=/" + (r ? "; domain=." + r : "") + (n && "https:" == locProtocol ? "; secure" : "")
}

function dispatchIntro(e, t) {
    "undefined" != typeof dispatchIntroEvent && dispatchIntroEvent(e, t)
}

function parseLatin(e) {
    for (var t = e, o = ["yo", "zh", "kh", "ts", "ch", "sch", "shch", "sh", "eh", "yu", "ya", "YO", "ZH", "KH", "TS", "CH", "SCH", "SHCH", "SH", "EH", "YU", "YA", "'"], n = ["�",
            "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�"
        ], a = 0, i = o.length; i > a; a++) t = t.split(o[a])
        .join(n[a]);
    for (var r = "abvgdezijklmnoprstufhcyABVGDEZIJKLMNOPRSTUFHCY��", s = "������������������������������������������������", a = 0, i = r.length; i > a; a++) t = t.split(r.charAt(
            a))
        .join(s.charAt(a));
    return t == e ? null : t
}

function parseCyr(e) {
    var t, o = e,
        n = ["yo", "zh", "kh", "ts", "ch", "sch", "shch", "sh", "eh", "yu", "ya", "YO", "ZH", "KH", "TS", "CH", "SCH", "SHCH", "SH", "EH", "YU", "YA", "'"],
        a = ["�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�"],
        i = "abvgdezijklmnoprstufhcyABVGDEZIJKLMNOPRSTUFHCY��",
        r = "������������������������������������������������";
    for (t = 0; t < a.length; t++) o = o.split(a[t])
        .join(n[t]);
    for (t = 0; t < r.length; t++) o = o.split(r.charAt(t))
        .join(i.charAt(t));
    return o == e ? null : o
}

function parseLatKeys(e) {
    var t, o = e;
    for (lat = "qwertyuiop[]asdfghjkl;'zxcvbnm,./`", rus = "��������������������������������.�", t = 0; t < lat.length; t++) o = o.split(lat.charAt(t))
        .join(rus.charAt(t));
    return o == e ? null : o
}

function __phCheck(e, t, o, n) {
    t = t || {};
    var a = e.phshown,
        i = e.phcont,
        r = t.back,
        s = t.editable,
        l = t.phColor || "#8C8E91",
        c = t.activeColor || "#C0C8D0",
        d = t.hideBackAfter,
        u = t.timeout || 0 === t.timeout ? t.timeout : 100,
        h = t.period || 200;
    if (s) var p = (void 0 !== e.textContent ? e.textContent : e.innerText) || geByTag("img", e)
        .length;
    else var p = e.value;
    if (a && (r && p || !r && (o && !o.type || p)) ? (hide(i), e.phshown = !1) : a || p || !r && !n || (show(i), e.phshown = !0, browser.opera && n && (e.setAttribute(
            "placeholder", ""), e.removeAttribute("placeholder", ""))), r && !p) {
        if (o && !o.type) {
            var f = d ? hide.pbind(i.firstChild.firstChild) : null;
            clearTimeout(e.phanim), e.phanim = setTimeout(function() {
                animate(i.firstChild.firstChild, {
                    color: c
                }, h, f)
            }, u)
        }
        n && (clearTimeout(e.phanim), d && show(i.firstChild.firstChild), e.phanim = setTimeout(function() {
            animate(i.firstChild.firstChild, {
                color: l
            }, h)
        }, u))
    }
}

function placeholderSetup(e, t) {
    var o, n = ge(e),
        a = !1,
        i = t ? clone(t) : {};
    if (n && (!n.phevents || i.reload) && (o = n.getAttribute ? n.getAttribute("placeholder") : n.placeholder)) {
        n.removeAttribute("placeholder");
        var r = {},
            s = ["Top", "Bottom", "Left", "Right"];
        if (i.pad) r = i.pad;
        else {
            if (i.fast) {
                for (var l = 0; 4 > l; ++l) r["padding" + s[l]] = 3, r["margin" + s[l]] = 0, r["border" + s[l] + "Width"] = 1;
                extend(r, i.styles || {})
            } else {
                for (var c = [], l = 0; 4 > l; ++l) c.push("margin" + s[l]), c.push("padding" + s[l]), c.push("border" + s[l] + "Width");
                r = getStyle(n, c)
            }
            for (var l = 0; 4 > l; ++l) {
                var d = "margin" + s[l],
                    u = "border" + s[l] + "Width";
                r[d] = intval(r[d]) + intval(r[u]) + "px", delete r[u]
            }
        }
        if (i.reload) {
            var h = n.previousSibling;
            h && hasClass(h, "input_back_wrap") && re(h)
        }
        var p = n.phcont = n.parentNode.insertBefore(ce("div", {
                className: "input_back_wrap no_select",
                innerHTML: '<div class="input_back"><div class="input_back_content' + (i.big ? " big" : "") + '" style="width: ' + (getSize(n)[0] - 20) + 'px;">' + o +
                    "</div></div>"
            }), n),
            f = domFC(p);
        domFC(f);
        setStyle(f, r);
        var g = __phCheck.pbind(n, i),
            v = browser.mobile ? g : function(e, t) {
                setTimeout(g.pbind(e, t), 0)
            };
        browser.msie && browser.version < 8 && setStyle(f, {
                marginTop: 1
            }), n.phonfocus = function(e) {
                a || (n.focused = !0, cur.__focused = n, e === !0 && (setStyle(n, {
                    backgroundColor: "#FFF"
                }), hide(f)), v(!0, !1))
            }, n.phonblur = function() {
                a || (cur.__focused = n.focused = !1, show(f), v(!1, !0))
            }, n.phshown = !0, n.phanim = null, (n.value || i.editable && ((void 0 !== n.textContent ? n.textContent : n.innerText) || geByTag("img", n)
                .length)) && (n.phshown = !1, hide(p)), browser.opera_mobile || (addEvent(p, "focus click", function(e) {
                a || (i.editableFocus ? (setTimeout(i.editableFocus.pbind(n), 0), n.phonfocus()) : (n.blur(), n.focus()))
            }), addEvent(n, "focus" + (i.editable ? " click" : ""), n.phonfocus), addEvent(n, "keydown paste cut input", v)), addEvent(n, "blur", n.phonblur), n.check = v, n.getValue =
            function() {
                return i.editable ? n.innerHTML : n.value
            }, n.setPlaceholder = function(e) {
                geByClass1("input_back_content", p)
                    .textContent = e
            }, n.setDisabled = function(e) {
                a = e
            }, n.setValue = function(e) {
                i.editable ? n.innerHTML = e : n.value = e, __phCheck(n, i)
            }, n.phevents = !0, n.phonsize = function() {}, i.global || i.reload || (cur.__phinputs || (cur.__phinputs = [], cur.destroy.push(function(e) {
                for (var t = 0, o = e.length; o > t; ++t) removeData(e[t])
            }.pbind(cur.__phinputs))), cur.__phinputs.push(n))
    }
}

function isInputActive() {
    return document.activeElement && (attr(document.activeElement, "contenteditable") || "INPUT" === document.activeElement.tagName || "textarea" === document.activeElement.tagName)
}

function placeholderInit(e, t) {
    function o(e, t, o, n) {
        t = t || {};
        var a = e.phshown,
            i = e.phcont,
            r = t.editable;
        if (r) {
            var s = void 0 !== e.textContent ? e.textContent : e.innerText;
            s && browser.opera && s.match(/^[ ]+$/) && (s = ""), s || (s = geByTag("img", e)
                .length)
        } else var s = e.value;
        a && s ? (hide(i), e.phshown = !1) : a || s || (show(i), e.phshown = !0, browser.opera && n && (e.setAttribute("placeholder", ""), e.removeAttribute("placeholder", "")))
    }
    var n, a = ge(e),
        i = t ? clone(t) : {},
        r = "undefined" == typeof ce("input")
        .placeholder || a && a.getAttribute && a.getAttribute("contenteditable");
    if (a && (!a.phevents || i.reload) && (n = a.getAttribute ? a.getAttribute("placeholder") : a.placeholder) && (a.getValue = function() {
            return i.editable ? a.innerHTML : a.value
        }, a.setValue = function(e) {
            i.editable ? a.innerHTML = e : a.value = e, r && o(a, i)
        }, a.phonfocus = function() {}, a.phonblur = function() {}, r)) {
        if (a.removeAttribute("placeholder"), i.reload) {
            var s = domNS(a);
            s && hasClass(s, "placeholder") && re(s)
        }
        var l = a.phcont = domInsertAfter(ce("div", {
                className: "placeholder",
                innerHTML: '<div class="ph_input"><div class="ph_content">' + n + "</div></div>"
            }), a),
            c = domFC(l),
            d = (domFC(c), o.pbind(a, i)),
            u = browser.mobile ? d : function(e, t) {
                setTimeout(d.pbind(e, t), 0)
            };
        a.phonfocus = function(e) {
                a.focused = !0, cur.__focused = a, u(!0, !1)
            }, a.phonblur = function() {
                cur.__focused = a.focused = !1, u(!1, !0)
            }, a.phshown = !0, (a.value || i.editable && ((void 0 !== a.textContent ? a.textContent : a.innerText) || geByTag("img", a)
                .length)) && (a.phshown = !1, hide(l)), browser.opera_mobile || (addEvent(l, "focus click", function(e) {
                i.editableFocus ? (setTimeout(i.editableFocus.pbind(a), 0), a.phonfocus()) : (a.blur(),
                    a.focus())
            }), addEvent(a, "focus" + (i.editable ? " click" : ""), a.phonfocus), addEvent(a, "keydown paste cut input", u)), addEvent(a, "blur", a.phonblur), a.check = u, a.phevents = !
            0, a.phonsize = function() {}, i.global || i.reload || (cur.__phinputs || (cur.__phinputs = [], cur.destroy.push(function() {
                if (cur.__phinputs)
                    for (var e = 0, t = cur.__phinputs.length; t > e; ++e) removeData(cur.__phinputs[e])
            })), cur.__phinputs.push(a))
    }
}

function val(e, t, o) {
    return (e = ge(e)) ? (void 0 !== t && (e.setValue ? (e.setValue(t), !o && e.phonblur && e.phonblur()) : "INPUT" == e.tagName || "TEXTAREA" == e.tagName ? e.value = t : void 0 !==
        e.emojiId && window.Emoji ? Emoji.val(e, t) : e.innerHTML = t, triggerEvent(e, "valueChanged")), e.getValue ? e.getValue() : ("INPUT" == e.tagName || "TEXTAREA" ==
        e.tagName ? e.value : e.innerHTML) || "") : void 0
}

function elfocus(e, t, o) {
    e = ge(e);
    try {
        if (e.focus(), (void 0 === t || t === !1) && (t = e.value.length), (void 0 === o || o === !1) && (o = t), e.createTextRange) {
            var n = e.createTextRange();
            n.collapse(!0), n.moveEnd("character", o), n.moveStart("character", t), n.select()
        } else e.setSelectionRange && e.setSelectionRange(t, o)
    } catch (a) {}
}

function curBox() {
    var e = _message_boxes[__bq.curBox];
    return e && e.isVisible() ? e : null
}

function boxRefreshCoords(e) {
    var t = window.innerHeight || document.documentElement.clientHeight || boxLayerBG.offsetHeight,
        o = browser.mobile ? intval(window.pageYOffset) : 0;
    containerSize = getSize(e), e.style.marginTop = Math.max(10, o + (t - containerSize[1]) / 3) + "px"
}

function MessageBox(options, dark) {
    function refreshBox() {
        options.title ? (boxTitle.innerHTML = options.title, removeClass(boxBody, "box_no_title"), show(boxTitleWrap)) : (addClass(boxBody, "box_no_title"), hide(boxTitleWrap)),
            options.titleControls && (boxTitleControls.innerHTML = options.titleControls), toggleClass(boxBody, "box_no_buttons", options.hideButtons), toggleClass(boxTitleWrap,
                "box_grey", options.grey), boxContainer.style.width = "string" == typeof options.width ? options.width : options.width + "px", boxContainer.style.height = "string" ==
            typeof options.height ? options.height : options.height + "px"
    }

    function addButton(e, t, o) {
        ++buttonsCount;
        var o, n = "flat_button";
        "no" == o || "gray" == o ? (n += " secondary", o = "cancel") : o = "ok";
        var a = ce("button", {
                className: n,
                innerHTML: e
            }),
            i = boxButtons.rows[0],
            r = i.insertCell(0);
        return r.appendChild(a), createButton(a, t), btns[o].push(a), a
    }

    function setControlsText(e) {
        boxControlsText.innerHTML = e
    }

    function removeButtons() {
        for (var e = boxButtons.rows[0]; e.cells.length;) cleanElems(e.cells[0]), e.deleteCell(0);
        btns.ok.length = btns.cancel.length = 0
    }

    function showMe(e, t, o) {
        if (!visible && _message_boxes[guid]) {
            visible = !0;
            var n = e === !0 || t ? 0 : options.animSpeed;
            if (options.hideOnBGClick && addEvent(document, "click", __bq.hideBGClick), t || layers.boxshow(), __bq.currHiding) {
                __bq.currHiding.shOther = !0;
                var a = __bq.currHiding.bodyNode.parentNode.parentNode;
                data(a, "tween")
                    .stop(!0)
            }
            n > 0 ? fadeIn(boxContainer, n) : show(boxContainer), boxRefreshCoords(boxContainer), options.onShow && options.onShow(o), _message_box_shown = !0, addClass(boxLayerBG,
                "bg_dark")
        }
    }
    var defaults = {
        title: !1,
        titleControls: "",
        width: 450,
        height: "auto",
        animSpeed: 0,
        bodyStyle: "",
        grey: !1,
        selfDestruct: !0,
        progress: !1,
        hideOnBGClick: !1,
        hideButtons: !1,
        onShow: !1,
        onHideAttempt: !1,
        onBeforeHide: !1,
        onHide: !1,
        onClean: !1,
        onDestroy: !1
    };
    options = extend(defaults, options);
    var buttonsCount = 0,
        boxContainer, boxBG, boxLayout, boxTitleWrap, boxTitle, boxTitleControls, boxCloseButton, boxBody, boxControlsWrap, boxControls, boxButtons, boxProgress, boxControlsText,
        guid = _message_box_guid++,
        visible = !1,
        btns = {
            ok: [],
            cancel: []
        };
    options.progress || (options.progress = "box_progress" + guid);
    var controlsStyle = options.hideButtons ? ' style="display: none"' : "";
    boxContainer = ce("div", {
            className: "popup_box_container" + (options.containerClass ? " " + options.containerClass : ""),
            innerHTML: '<div class="box_layout" onclick="__bq.skip=true;"><div class="box_title_wrap"><div class="box_x_button"></div><div class="box_title_controls"></div><div class="box_title"></div></div><div class="box_body" style="' +
                options.bodyStyle + '"></div><div class="box_controls_wrap"' + controlsStyle +
                '><div class="box_controls"><table cellspacing="0" cellpadding="0" class="fl_r"><tr></tr></table><div class="progress" id="' + options.progress +
                '"></div><div class="box_controls_text"></div></div></div></div>'
        }, {
            display: "none"
        }), hide(boxContainer), boxLayout = domFC(boxContainer), boxTitleWrap = domFC(boxLayout), boxCloseButton = domFC(boxTitleWrap), boxTitle = domLC(boxTitleWrap),
        boxTitleControls = domNS(boxCloseButton), options.noCloseButton && hide(boxCloseButton), boxBody = domNS(boxTitleWrap), boxControlsWrap = domNS(boxBody), boxControls =
        domFC(boxControlsWrap), boxButtons = domFC(boxControls), boxProgress = domNS(boxButtons), boxControlsText = domNS(boxProgress), boxLayer.appendChild(boxContainer),
        refreshBox(), boxRefreshCoords(boxContainer);
    var destroyMe = function() {
            isFunction(options.onClean) && options.onClean(), isFunction(options.onDestroy) && options.onDestroy(), removeButtons(), cleanElems(boxContainer, boxCloseButton,
                boxTitleWrap, boxControlsWrap), boxLayer.removeChild(boxContainer), delete _message_boxes[guid]
        },
        hideMe = function(e, t, o) {
            if (visible) {
                visible = !1;
                var n = e === !0 ? 0 : options.animSpeed;
                options.hideOnBGClick && removeEvent(document, "click", __bq.hideBGClick), isFunction(options.onBeforeHide) && options.onBeforeHide(), _layerAnim && !e && layers.boxhide();
                var a = function() {
                    __bq.currHiding == _message_boxes[guid] && (__bq.currHiding = !1), _layerAnim || _message_boxes[guid].shOther || e || layers.boxhide(), !t && options.selfDestruct ?
                        destroyMe() : hide(boxContainer), isFunction(options.onHide) && options.onHide(o)
                };
                n > 0 ? (__bq.currHiding = _message_boxes[guid], fadeOut(boxContainer, n, a)) : a()
            }
        };
    addEvent(boxCloseButton, "click", __bq.hideLast);
    var retBox = _message_boxes[guid] = {
        guid: guid,
        _show: showMe,
        _hide: hideMe,
        bodyNode: boxBody,
        titleWrap: boxTitleWrap,
        btns: btns,
        show: function() {
            return __bq._show(guid), this
        },
        progress: boxProgress,
        showCloseProgress: addClass.pbind(boxTitleWrap, "box_loading"),
        hideCloseProgress: removeClass.pbind(boxTitleWrap, "box_loading"),
        showProgress: function() {
            hide(boxControlsText), show(boxProgress)
        },
        hideProgress: function() {
            hide(boxProgress), show(boxControlsText)
        },
        hide: function(e) {
            return isFunction(options.onHideAttempt) && !options.onHideAttempt(e) ? !1 : (removeClass(boxLayerBG, "bg_dark"), __bq._hide(guid), !0)
        },
        isVisible: function() {
            return visible
        },
        bodyHeight: function() {
            return getStyle(boxBody, "height")
        },
        content: function(e) {
            return options.onClean && options.onClean(), boxBody.innerHTML = e, boxRefreshCoords(boxContainer), refreshBox(), this
        },
        addButton: function(e, t, o, n) {
            var a = addButton(e, t ? t : this.hide, o);
            return n ? a : this
        },
        setButtons: function(e, t, o, n) {
            var a = this.removeButtons();
            return e ? (a.addButton(e, t), o && a.addButton(o, n, "no"), a) : a.addButton(box_close)
        },
        setControlsText: setControlsText,
        removeButtons: function() {
            return removeButtons(), this
        },
        destroy: destroyMe,
        getOptions: function() {
            return options
        },
        setOptions: function(e) {
            if (options.hideOnBGClick && removeEvent(document, "click", __bq.hideBGClick), options = extend(options, e), "bodyStyle" in e)
                for (var t = options.bodyStyle.split(";"), o = 0, n = t.length; n > o; ++o) {
                    var a = t[o].split(":");
                    a.length > 1 && a[0].length && (boxBody.style[trim(a[0])] = trim(a[1]), boxBody.style.setProperty && boxBody.style.setProperty(trim(a[0]), trim(a[1]),
                        ""))
                }
            return options.hideOnBGClick && addEvent(document, "click", __bq.hideBGClick), toggle(boxControlsWrap, !options.hideButtons), refreshBox(), options.noRefreshCoords ||
                boxRefreshCoords(boxContainer), this
        },
        evalBox: function(js, url, params) {
            var scr = "((function() { return function() { var box = this; " + (js || "") + ";}; })())";
            if (__debugMode) {
                var fn = eval(scr);
                fn.apply(this, [url, params])
            } else try {
                var fn = eval(scr);
                fn.apply(this, [url, params])
            } catch (e) {
                topError(e, {
                    dt: 15,
                    type: 7,
                    url: url,
                    query: params ? ajx2q(params) : void 0,
                    js: js
                })
            }
        }
    };
    return retBox
}

function showBox(e, t, o, n) {
    if (checkEvent(n)) return !1;
    var a = o || {},
        i = a.params || {};
    a.containerClass && (i.containerClass = a.containerClass);
    var r = new MessageBox(i),
        s = {
            onDone: function(o, n, s, l) {
                if (!r.isVisible()) return void(a.onDone && a.onDone(r, l));
                try {
                    show(boxLayerBG), addClass(bodyNode, "layers_shown"), r.setOptions({
                        title: o,
                        hideButtons: i.hideButtons || !1
                    }), a.showProgress ? r.show() : show(r.bodyNode), r.content(n), r.evalBox(s, e, t), a.onDone && a.onDone(r, l)
                } catch (c) {
                    topError(c, {
                        dt: 15,
                        type: 103,
                        url: e,
                        query: ajx2q(t),
                        answer: Array.prototype.slice.call(arguments)
                            .join("<!>")
                    }), r.isVisible() && r.hide()
                }
            },
            onFail: function(e) {
                return r.failed = !0, setTimeout(r.hide, 0), isFunction(a.onFail) ? a.onFail(e) : void 0
            },
            cache: a.cache,
            stat: a.stat,
            fromBox: !0
        };
    return a.prgEl && (a.showProgress = showGlobalPrg.pbind(a.prgEl, {
            cls: a.prgClass,
            w: a.prgW,
            h: a.prgH,
            hide: !0
        }), a.hideProgress = hide.pbind("global_prg")), a.showProgress ? extend(s, {
            showProgress: a.showProgress,
            hideProgress: a.hideProgress
        }) : (r.setOptions({
                title: !1,
                hideButtons: !0
            })
            .show(), __bq.count() < 2 && (hide(boxLayerBG), removeClass(bodyNode, "layers_shown")), hide(r.bodyNode), s.showProgress = function() {
                show(boxLoader), boxRefreshCoords(boxLoader)
            }, s.hideProgress = hide.pbind(boxLoader)), r.removeButtons()
        .addButton(getLang("global_close")), ajax.post(e, t, s), r
}

function showTabbedBox(e, t, o, n) {
    return o = o || {}, o.stat = o.stat || [], o.stat.push("box.js", "boxes.css"), showBox(e, t, o, n)
}

function showFastBox(e, t, o, n, a, i) {
    return new MessageBox("string" == typeof e ? {
            title: e
        } : e)
        .content(t)
        .setButtons(o, n, a, i)
        .show()
}

function showCaptchaBox(e, t, o, n) {
    var a = function(t) {
            if (!t || void 0 === t.keyCode || 10 == t.keyCode || 13 == t.keyCode) {
                var a = geByTag1("input", o.bodyNode);
                if (!trim(a.value) && t !== !0) return void elfocus(a);
                var i = geByTag1("img", o.bodyNode),
                    r = i[0];
                i[1];
                removeEvent(a), removeEvent(r), show(geByClass1("progress", o.bodyNode)), hide(a), n.onSubmit(e, a.value)
            }
        },
        i = o ? !0 : !1,
        r = intval(t) ? "" : "&s=1",
        s = n.imgSrc || "/captcha.php?sid=" + e + r;
    if (!i) {
        var l = '<div class="captcha">  <div><img src="' + s + '"/></div>  <div><input type="text" class="big_text" maxlength="7" placeholder="' + getLang(
            "global_captcha_input_here") + '" /><div class="progress" /></div></div></div>' + (n.addText || "");
        o = showFastBox({
            title: getLang("captcha_enter_code"),
            width: 305,
            onHide: n.onHide,
            onDestroy: n.onDestroy || !1
        }, l, getLang("captcha_send"), function() {
            o.submit()
        }, getLang("captcha_cancel"), function() {
            var e = geByTag1("input", o.bodyNode),
                t = geByTag1("img", o.bodyNode);
            removeEvent(e), removeEvent(t), o.hide()
        })
    }
    o.submit = a.pbind(!0), o.changed = !0;
    var c = geByTag1("input", o.bodyNode),
        d = geByTag1("img", o.bodyNode);
    return i && (c.value = "", d.src = "/captcha.php?sid=" + e + r, hide(geByClass1("progress", o.bodyNode))), show(c), addEvent(c, "keypress", a), addEvent(d, "click", function() {
        this.src = "/captcha.php?sid=" + e + r + "&v=" + irand(1e6, 2e6)
    }), elfocus(c), o
}

function createButton(e, t) {
    if (e = ge(e), e && !e.btnevents) {
        if (hasClass(e, "flat_button")) return void(isFunction(t) && (e.onclick = t.pbind(e)));
        var o = e.parentNode;
        if (hasClass(o, "button_blue") || hasClass(o, "button_gray")) return void(isFunction(t) && (e.onclick = t.pbind(e)));
        var n = !1;
        addEvent(e, "click mousedown mouseover mouseout", function(a) {
            if (!hasClass(o, "locked")) switch (a.type) {
                case "click":
                    if (!n) return;
                    return e.className = "button_hover", t(e), cancelEvent(a);
                case "mousedown":
                    e.className = "button_down";
                    break;
                case "mouseover":
                    n = !0, e.className = "button_hover";
                    break;
                case "mouseout":
                    e.className = "button", n = !1
            }
        }), e.btnevents = !0
    }
}

function actionsMenuItemLocked(e) {
    return (e = ge(e)) ? hasClass(e, "ui_actions_menu_item_lock") : void 0
}

function lockActionsMenuItem(e) {
    if ((e = ge(e)) && hasClass(e, "ui_actions_menu_item") && !hasClass(e, "ui_actions_menu_item_lock")) {
        data(e, "inner", e.innerHTML), addClass(e, "ui_actions_menu_item_lock");
        var t = ce("div", {
            className: "ui_actions_menu_item_lock_text"
        });
        val(t, e.innerHTML), e.appendChild(t), showProgress(e)
    }
}

function unlockActionsMenuItem(e) {
    (e = ge(e)) && hasClass(e, "ui_actions_menu_item") && hasClass(e, "ui_actions_menu_item_lock") && (removeClass(e, "ui_actions_menu_item_lock"), e.innerHTML = data(e, "inner"))
}

function linkLocked(e) {
    return (e = ge(e)) ? hasClass(e, "link_lock") : void 0
}

function lockLink(e) {
    (e = ge(e)) && "a" == e.tagName.toLowerCase() && !linkLocked(e) && addClass(e, "link_lock")
}

function unlockLink(e) {
    (e = ge(e)) && linkLocked(e) && removeClass(e, "link_lock")
}

function lockButton(e) {
    if ((e = ge(e)) && ("button" == e.tagName.toLowerCase() || hasClass(e, "flat_button") || hasClass(e, "wr_header")) && !isButtonLocked(e)) {
        var t = getSize(e);
        addClass(e, "flat_btn_lock"), data(e, "inner", e.innerHTML), setStyle(e, {
            width: t[0],
            height: t[1]
        }), e.innerHTML = "", showProgress(e, "btn_lock")
    }
}

function unlockButton(e) {
    (e = ge(e)) && isButtonLocked(e) && (hideProgress(e), e.innerHTML = data(e, "inner"), removeClass(e, "flat_btn_lock"), setStyle(e, {
        width: null,
        height: null
    }))
}

function buttonLocked(e) {
    return isButtonLocked(e)
}

function isButtonLocked(e) {
    return (e = ge(e)) ? hasClass(e, "flat_btn_lock") : void 0
}

function disableButton(e, t) {
    if ((e = ge(e)) && "button" === e.tagName.toLowerCase())
        if (t) {
            if (!isVisible(e)) return;
            e.parentNode.insertBefore(ce("button", {
                innerHTML: e.innerHTML,
                className: e.className + " button_disabled"
            }), e), hide(e)
        } else {
            var o = domPS(e);
            o && hasClass(o, "button_disabled") && re(o), show(e)
        }
}

function sbWidth(e) {
    if (void 0 === window._sbWidth || e) {
        var t = ce("div", {
            innerHTML: '<div style="height: 75px;">1<br>1</div>'
        }, {
            overflowY: "scroll",
            position: "absolute",
            width: "50px",
            height: "50px"
        });
        bodyNode.appendChild(t), window._sbWidth = Math.max(0, t.offsetWidth - t.firstChild.offsetWidth - 1), bodyNode.removeChild(t)
    }
    return window._sbWidth
}

function checkTextLength(e, t, o, n, a, i, r) {
    var s = t.getValue ? t.getValue() : t.value,
        l = t.lastLen || 0;
    if (t.lastLen !== s.length || i) {
        t.lastLen = s.length;
        var c = {
                "&": 5,
                "<": 4,
                ">": 4,
                '"': 6,
                "\n": n ? 1 : 4,
                "\r": 0,
                "!": 5,
                "'": 5,
                $: 6,
                "\\": 6
            },
            d = {
                1168: 1,
                1169: 1,
                8211: 1,
                8212: 1,
                8216: 1,
                8217: 1,
                8218: 1,
                8230: 1,
                8240: 1,
                8249: 1,
                8250: 1,
                8364: 1,
                8470: 1,
                8482: 1,
                65533: 1
            },
            u = {
                1037: 1,
                1104: 1,
                1117: 1
            };
        a && (c[","] = 5);
        var h = function(e, t) {
                for (var o = 0, n = 0, a = e.length; a > n; n++) {
                    var i = c[e.charAt(n)],
                        s = e.charCodeAt(n);
                    o += void 0 !== i ? i : !r && s >= 128 && (1025 > s || u[s] || s > 1119) && !d[s] && (8220 > s || s > 8222) && (8224 > s || s > 8226) ? ("&#" + s + ";")
                        .length : 1
                }
                return o
            },
            p = function(e, t) {
                for (var o = 0, n = "", a = 0, i = e.length; i > a; a++) {
                    var s = e.charAt(a),
                        l = c[s],
                        h = e.charCodeAt(a);
                    if (o += void 0 !== l ? l : !r && h >= 128 && (1025 > h || u[h] || h > 1119) && !d[h] && (8220 > h || h > 8222) && (8224 > h || h > 8226) ? ("&#" + h + ";")
                        .length : 1, o > t) break;
                    n += s
                }
                return n
            },
            f = h(s, n);
        if (o = ge(o), f > e - 100)
            if (show(o), f > e)
                if (a) {
                    var g = val(t, p(s, Math.min(e, l)));
                    t.lastLen = g.length, o.innerHTML = getLang("text_N_symbols_remain", 0)
                } else o.innerHTML = getLang("text_exceeds_symbol_limit", f - e);
        else o.innerHTML = getLang("text_N_symbols_remain", e - f);
        else hide(o)
    }
}

function autosizeSetup(e, t) {
    if (e = ge(e)) {
        if (e.autosize) return void e.autosize.update();
        t.minHeight = intval(t.minHeight) || intval(getStyle(e, "height")), t.maxHeight = intval(t.maxHeight);
        var o, n = getSize(e)[0] || intval(getStyle(e, "width")),
            a = getStyle(e, "fontSize");
        1 > n && (n = intval(getStyle(e, "width", !1))), a.indexOf("em") > 0 && (a = floatval(a) * vk.fs), a = intval(a);
        var i = {
                width: n,
                height: 10,
                fontFamily: getStyle(e, "fontFamily"),
                fontSize: a + "px",
                lineHeight: o = getStyle(e, "lineHeight"),
                boxSizing: getStyle(e, "boxSizing")
            },
            r = ["Top", "Bottom", "Left", "Right"];
        each(r, function() {
                i["padding" + this] = t.ignorePadding ? "0" : getStyle(e, "padding" + this)
            }), e.autosize = {
                options: t,
                helper: ce("textarea", {
                    className: "ashelper"
                }, i),
                handleEvent: function(t, o) {
                    var n = o.charCode ? String.fromCharCode(o.charCode) : o.charCode;
                    if (void 0 === n && (n = String.fromCharCode(o.keyCode), 10 == o.keyCode || 13 == o.keyCode ? n = "\n" : !browser.msie && o.keyCode <= 40 && (n = "")), !n)
                        return t;
                    if (!browser.msie) return t.substr(0, e.selectionStart) + n + t.substr(e.selectionEnd);
                    var a = document.selection.createRange();
                    return a.text && (t = t.replace(a.text, "")), t + n
                },
                update: function(t) {
                    var n = e.value;
                    !t || "blur" == t.type || "keyup" == t.type || browser.msie && "keypress" != t.type || t.ctrlKey || t.altKey || t.metaKey || (n = e.autosize.handleEvent(n,
                        t)), n || (n = " "), e.autosize.helper.value != n && (e.autosize.helper.value = n);
                    var a, i = e.autosize.options,
                        r = getSize(e, !0)[1],
                        s = e.autosize.helper.scrollHeight;
                    i.exact && (a = s % o) > 2 && (s -= a - 2), s < i.minHeight && (s = i.minHeight);
                    var l = {
                            overflow: "hidden"
                        },
                        c = getStyle(e, "overflow")
                        .indexOf("auto") > -1 ? "auto" : "hidden";
                    i.maxHeight && s > i.maxHeight && (s = i.maxHeight, extend(l, {
                        overflow: "auto",
                        overflowX: "hidden"
                    })), (r != s || c != l.overflow) && (l.height = s, setStyle(e, l), isFunction(i.onResize) && i.onResize(s))
                }
            }, t.exact && ("normal" == o && (o = "120%"), o = intval(o.indexOf("%") > 0 ? a * intval(o) / 100 : o)), utilsNode.appendChild(e.autosize.helper), browser.opera_mobile ?
            (setStyle(e, {
                overflow: "hidden"
            }), e.autosize.update(), addEvent(e, "blur", e.autosize.update)) : (addEvent(e, "keydown keyup keypress", e.autosize.update), setTimeout(function() {
                setStyle(e, {
                    overflow: "hidden",
                    resize: "none"
                }), e.autosize.update();
                var t = val(e);
                val(e, " ", !0), val(e, t, !0)
            }, 0))
    }
}

function goAway(e, t, o) {
    if (-1 != (t || {})
        .h || checkEvent(o)) return !0;
    if (-1 != (t || {})
        .h) {
        var n = e.match(/https?:\/\/([a-zA-Z0-9\-_\.]+\.)?(vk\.com|vkontakte\.ru)(\/|$)/i);
        if (n && "api." != n[1].toLowerCase()) return location.href = e, !1;
        var a = intval(getCookie("remixsettings_bits"));
        if (/https?:\/\/([a-zA-Z0-9\-_]+\.)(vk\.com|vkontakte\.ru)(\/|$)/i.test(locBase) || 1 & a) return window.open("/away.php?to=" + encodeURIComponent(e) + (t && void 0 !== t.h ?
            "&h=" + t.h : ""), "_blank"), !1
    }
    var i = extend({
        act: "a_go",
        to: e
    }, t || {});
    return !showBox("away.php", i, {}, o)
}

function isChecked(e) {
    return e = ge(e), hasClass(e, "on") ? 1 : ""
}

function checkbox(e, t) {
    return e = ge(e), e && !hasClass(e, "disabled") ? (void 0 === t && (t = !isChecked(e)), toggleClass(e, "on", t), !1) : void 0
}

function disable(e, t) {
    return e = ge(e), void 0 === t && (t = !hasClass(e, "disabled")), toggleClass(e, "disabled", t), !1
}

function radioval(e) {
    return radioBtns[e] ? radioBtns[e].val : !1
}

function radiobtn(e, t, o) {
    return radioBtns[o] ? (each(radioBtns[o].els, function() {
        this == e ? addClass(this, "on") : removeClass(this, "on")
    }), radioBtns[o].val = t) : void 0
}

function renderFlash(e, t, o, n) {
    if (!t.url || !t.id) return !1;
    t = extend({
        version: 9,
        width: 1,
        height: 1
    }, t);
    var a = t.url;
    return stVersions[a] || (stVersions[a] = ""), __debugMode && stVersions[a] < 1e6 && (stVersions[a] += irand(1e6, 2e6)), stVersions[a] && (t.url += (-1 == t.url.indexOf("?") ?
        "?" : "&") + "_stV=" + stVersions[a]), o = extend({
        quality: "high",
        flashvars: ajx2q(n)
    }, o), browser.flash < t.version ? !1 : (ge(e)
        .innerHTML = browser.flashwrap(t, o), !0)
}

function playAudioNew() {
    var e = arguments;
    e[e.length - 1] !== !1 && (e = Array.prototype.slice.apply(arguments)
        .concat([!0])), stManager.add(["audioplayer.js", "audioplayer.css"], function() {
        audioPlayer.operate.apply(null, e)
    })
}

function _addAudio(e) {
    stManager.add(["audio.js"], function() {
        Audio.addShareAudio(e)
    })
}

function showAudioClaimWarning(e, t, o, n, a, i) {
    var r, s;
    "crap" == i ? (r = getLang(n >= 0 ? "audio_crap_warning_text" : "audio_crap_warning") || getLang(n > 0 ? "audio_claim_warning_objection" : 0 == n ? "audio_claim_warning_text" :
            "audio_claim_warning"), s = getLang("audio_crap_warning_title") || getLang("audio_claim_warning_title")) : (r = getLang(n > 0 ? "audio_claim_warning_objection" : 0 ==
            n ? "audio_claim_warning_text" : "audio_claim_warning"), s = getLang("audio_claim_warning_title")), r = r.split("{audio}")
        .join("<b>" + a + "</b>"), r = r.split("{objection_link}")
        .join('<a href="/help?act=cc_objection&claim=' + n + "&content=audio" + e + "_" + t + '">' + getLang("audio_claim_objection") + "</a>"), r = r.split("{delete_link}")
        .join('<a href="#" onclick="deleteAudioOnClaim(' + e + "," + t + ",'" + o + "'); return false;\">" + getLang("audio_claim_delete") + "</a>"), cur.claimWarning =
        showFastBox({
            title: s,
            width: 470
        }, r)
}

function deleteAudioOnClaim(e, t, o) {
    if (cur.silent) return void(cur.onSilentLoad = function() {
        deleteAudioOnClaim(e, t, o)
    });
    if (cur.deleting) return !1;
    cur.deleting = !0;
    var n = ge("audio" + t),
        a = getSize(geByClass1("play_btn", n))[1];
    return ajax.post("/audio", {
        act: "delete_audio",
        oid: e,
        aid: t,
        hash: o,
        restore: 1
    }, {
        onDone: function(e, o) {
            cur.claimWarning && cur.claimWarning.hide(), cur.deleting = !1, cur.deletedAudios || (cur.deletedAudios = []), cur.deletedAudios[t] = ge("audio" + t)
                .innerHTML, n.innerHTML = e, setStyle(geByClass1("dld", n), {
                    height: a + "px"
                }), n.style.cursor = "auto", n.setAttribute("nosorthandle", "1"), o && (cur.summaryLang.delete_all = o), cur.audios && cur.audiosIndex && (cur.audiosIndex
                    .remove(cur.audios[t]), cur.audios[t].deleted = !0), cur.sectionCount--, Audio && Audio.changeSummary()
        }
    }), !1
}

function sureDeleteAll(title, text, where, objectId, toId, fromId, hash, event) {
    if (!checkEvent(event)) {
        var box = showFastBox({
            title: title
        }, text, getLang("global_delete"), function(btn) {
            ajax.post("/delete_all.php", {
                act: where,
                object_id: objectId,
                to_id: toId,
                from_id: fromId,
                hash: hash,
                loc: nav.objLoc[0]
            }, {
                onDone: function(res) {
                    eval(res), box.hide()
                },
                showProgress: lockButton.pbind(btn),
                hideProgress: unlockButton.pbind(btn)
            })
        }, getLang("global_cancel"));
        return !1
    }
}

function onLoginFailed(e, t) {
    switch (__qlClear(), e) {
        case -1:
            location.href = location.href.replace(/^http:/, "https:");
            break;
        case 4:
            location.href = "/login.php?m=1&email=" + t.email;
            break;
        default:
            location.href = "/login.php"
    }
}

function onLoginCaptcha(e, t) {
    __qlClear(), unlockButton(window.__qfBtn), window.qloginBox = showCaptchaBox(e, t, window.qloginBox, {
        onSubmit: function(e, t) {
            ge("quick_captcha_sid")
                .value = e, ge("quick_captcha_key")
                .value = t, ge("quick_login_form")
                .submit()
        },
        onHide: function() {
            window.qloginBox = !1
        }
    })
}

function callHub(e, t) {
    this.count = t || 1, this.done = function(t) {
        this.count -= t || 1, this.count <= 0 && e()
    }
}

function showWriteMessageBox(e, t) {
    cur.onFriendMessage && cur.onFriendMessage(), stManager.add(["page.js", "wide_dd.js"]);
    var o = showBox("al_mail.php", {
        act: "write_box",
        to: t
    }, {
        stat: ["writebox.js", "writebox.css", "wide_dd.css", "page.css", "emoji.js", "notifier.css"],
        cache: 1
    }, e);
    return o && cancelEvent(e), !o
}

function startVideocall(e, t, o) {
    if (checkEvent(e)) return !0;
    var n = (ge("videocall_btn") || {})
        .tt;
    n && n.hide && n.destroy && (n.hide({
            fasthide: 1
        }), n.destroy()), n = (ge("profile_am_subscribed") || {})
        .tt, n && n.hide && n.destroy && (n.hide({
            fasthide: 1
        }), n.destroy());
    var a = ["call.js", "call.css", "notifier.js", "notifier.css"],
        i = new callHub(function() {
            Call.rtmpServer = i.data[0], Call.rtmfpServer = i.data[1], window.langpack = extend(window.langpack || {}, i.data[2]), vk.vc_h = i.data[3], Call.start(t, o)
        }, 2);
    stManager.add(a, function() {
        i.done()
    });
    var r = {
        onDone: function() {
            i.data = arguments, i.done()
        },
        params: {
            act: "init"
        },
        loader: !0
    };
    return ajax.post("call.php", r.params, r), !1
}

function showTooltip(e, t) {
    (vk.loaded || t.noload) && e && (e.temphide || (e.temphide = function() {
        e.showing = !1
    }, addEvent(e, "mouseout", e.temphide)), e.showing = !0, "loadingstat" != e.tt && (e.tt || (e.tt = "loadingstat"), domClosest("fc_tab", e) && (t.appendEl = bodyNode),
        cur.cancelTooltip = !1, t.stat && stManager.add(t.stat), stManager.add(["tooltips.js", "tooltips.css"], function() {
            "loadingstat" == e.tt && (e.tt = !1), e.showing && !cur.cancelTooltip && (_cleanHide(e), e.tt && e.tt.el && !t.force || (tooltips.create(e, t), t.onCreate &&
                t.onCreate()), tooltips.show(e, t))
        })))
}

function showTitle(e, t, o, n) {
    e = ge(e);
    var a = function() {
        return t || e.getAttribute("data-title")
    };
    if (browser.msie && browser.version < 9) e.setAttribute("title", a());
    else {
        if (!o) {
            var i = Math.round(20 - getSize(e)[0] / 2);
            o = [i, 8]
        }
        showTooltip(e, extend({
            text: a,
            shift: o,
            black: 1
        }, n || {}))
    }
}

function showHint(e, t) {
    e = ge(e), t = t || {};
    var o = function() {
        return e.getAttribute("data-title")
    };
    browser.msie && browser.version < 9 ? e.setAttribute("title", o()
        .replace("<br>", "\n")) : showTooltip(e, extend({
        text: o,
        dir: "auto",
        width: 300,
        shift: [22, 8]
    }, t))
}

function reportAd(e) {
    showBox("/reports.php?act=a_report_ad_box", {
        ad_id: e
    }, {
        params: {
            width: 370
        },
        stat: ["ui_controls.js", "ui_controls.css"]
    })
}

function updateMoney(e) {
    if (void 0 !== e && e !== !1) {
        vk.balance = e;
        var t = geByClass("votes_balance_nom");
        for (var o in t) t[o].innerHTML = e + " " + getLang("votes_flex", e);
        var n = e * (vk.vcost || 7),
            t = geByClass("money_balance_nom");
        for (var o in t) t[o].innerHTML = getLang("global_money_amount_rub", n, !0)
    }
}

function zNav(e, t, o) {
    var n = e.z,
        a = e.f,
        i = e.w,
        r = (n || "")
        .match(/^([a-z_]+)(-?\d+(?:_\d+)?)\/?(.*)/i);
    if (delete e.z, delete e.f, delete e.w, t || (t = {}), isEmpty(e)) {
        if (a && (handleScroll(a), void 0 === n)) return !1;
        if (t.hist)
            if (n || i) {
                if (layerQueue.back("wiki", i, (r || {})[1], (r || {})[2])) return !1
            } else if (n === !1 && o.w && layerQueue.back("wiki", o.w)) return !1;
        if (i) return n === !1 ? layers.fullhide(t.hist ? 2 : !1) : (o || (o = clone(nav.objLoc)), i && (o.w = i), a && (o.f = a), delete o.z, nav.setLoc(o)), showWiki({
            w: i
        }, "note_new" == i, !1, {
            onLoaded: n && zNav.pbind({
                z: n
            }, extend(t, {
                queue: 1
            }))
        }), !1;
        if ("giftbox" == n) return !showBox("/al_gifts.php", {
            act: "get_gift_box",
            mid: t.id || 0,
            fr: t.is && t.id != vk.id ? 0 : 1,
            link: nav.objLoc[0]
        }, {
            stat: ["gifts.css", "ui_controls.js", "ui_controls.css"],
            cache: 1
        }, window.event);
        if ("validatebox" == n) return !validateMobileBox({
            closeLink: 1,
            onDone: function() {
                ge("change_phone_wrap")
                    .parentNode.removeChild(ge("change_phone_wrap"))
            }
        });
        if ("upload_video" == n) return VideoUpload.showBox();
        if (n === !1 || i === !1) {
            var s = !window.wkcur || !wkcur.shown || layers.fullhide != WkView.hide;
            !layers.fullhide || !s && i !== !1 || t.asBox || (!t.hist || o.z || o.w || -1 !== o[0].indexOf("/") || o[0].match(/^(photo|video)(-?\d+_\d+)$/) || layerQueue.clear(),
                layers.fullhide(t.hist ? 2 : !1));
            var l = curBox();
            return l && l.wkRaw && l.hide(), !1
        }
        if (n && r) {
            var c = function() {
                return delete nav.objLoc.z, nav.setLoc(nav.objLoc), !0
            };
            switch (r[1]) {
                case "photo":
                    return showPhoto(r[2], r[3], extend(t, {
                        onFail: c,
                        noHistory: !0
                    })), !1;
                case "albums":
                    return showAlbums(r[2], extend(t, {
                        onFail: c,
                        noHistory: !0
                    })), !1;
                case "album":
                    return showAlbum(r[2], extend(t, {
                        onFail: c,
                        noHistory: !0
                    })), !1;
                case "tag":
                case "photo_tag":
                    return showPhotoTags(r[2], extend(t, {
                        onFail: c,
                        noHistory: !0
                    })), !1;
                case "video":
                    var d = r[3],
                        u = extend(t, {
                            onFail: c,
                            noLocChange: 1
                        });
                    if (d) {
                        var h = [],
                            p = "";
                        if (each(d.split("/"), function(e, t) {
                                0 == t.indexOf("pl_") ? p = t : h.push(t)
                            }), d = h.join("/"), p) {
                            p = p.substr("pl_".length);
                            var f = cur.currentModule ? cur.currentModule() : cur.module;
                            u = extend(u, {
                                playlistId: p,
                                module: f,
                                focusPlay: 1,
                                addParams: {
                                    force_no_repeat: 1,
                                    show_next: 1,
                                    playlist_id: p
                                }
                            })
                        }
                    }
                    return showVideo(r[2], d, u), !1;
                case "screen":
                    return stManager.add(["index.js"], function() {
                        setTimeout(JoinPhotoview.show.pbind(intval(r[2])), 0)
                    }), !1;
                case "single":
                    return void 0 === i && stManager.add(["single_pv.css", "single_pv.js"], ge(n)
                        .onclick), !1
            }
        }
    }
}

function handleScroll(e) {
    e = e.split(",");
    var t = cur.named || {},
        o = e[0] && (t[e[0]] || ge(e[0])) || !1,
        n = e[1] && (t[e[1]] || ge(e[1])) || !1;
    if (!o && !n) {
        if (o = document.getElementsByName(e[0])[0], !o) return;
        o = o.nextSibling
    }
    var a = ge("page_header_wrap") || ge("dev_top_nav_wrap");
    setTimeout(function() {
        o && scrollToY(getXY(o)[1] - (a ? getSize(a)[1] : 0), 0), n && elfocus(n)
    }, 300)
}

function showGlobalPrg(e, t) {
    var o = getXY(e),
        n = getSize(e),
        a = t || {},
        i = a.w || 32,
        r = a.h || 13,
        s = ge("global_prg");
    s.className = a.cls || "progress", setStyle(s, {
        left: o[0] + Math.floor((n[0] - i) / 2) + intval(a.shift ? a.shift[0] : 0),
        top: o[1] + Math.floor((n[1] - r) / 2) + intval(a.shift ? a.shift[1] : 0),
        width: i,
        height: r,
        display: "block",
        "z-index": a.zIndex ? a.zIndex : null
    }), a.hide && (e.style.visibility = "hidden")
}

function showManyPhoto(e, t, o, n) {
    Page.showManyPhoto(e, t, o, n)
}

function showPhoto(e, t, o, n) {
    if (cur.viewAsBox) return cur.viewAsBox();
    if (!(checkEvent(n) || cur._editMode && cur._editMode(n))) {
        var a = ["photoview.js", "photoview.css", "page.js", "page.css"],
            i = window.Photoview;
        if (o.img && (o.showProgress = function() {
                showProgress(o.img)
            }, o.hideProgress = function() {
                hideProgress(o.img)
            }), i && i.showPhoto(e, t, o) === !1) return !1;
        var r = !0;
        return o.temp && !(cur.pvNoTemp || {})[e] && stManager.add(a, function() {
            extend(cur, {
                    pvCancelLoad: function() {
                        r = !1
                    },
                    pvData: cur.pvData || {},
                    pvOptions: cur.pvOptions || {}
                }), cur.pvData.temp = [o.temp], cur.pvOptions.temp_final = o.temp_final, cur.pvOptions.temp_summary = o.temp_summary, cur.pvOptions.queue = o.queue,
                Photoview.show("temp", 0)
        }), extend(o, {
            onDone: function(n) {
                Photoview.list(e, t, n), Photoview.loaded.apply(window, arguments), r && ("deleted" == n ? Photoview.showDeleted.apply(window, arguments) : Photoview.showPhoto(
                    e, t, o, !0))
            },
            stat: a,
            cache: 1
        }), o.temp_final ? !1 : (ajax.post("al_photos.php", extend({
            act: "show",
            gid: cur.gid,
            photo: e,
            list: t,
            module: cur.module || ""
        }, o.additional), o), !1)
    }
}

function showAlbums(e, t, o) {
    if (cur.viewAsBox) return cur.viewAsBox();
    if (!checkEvent(o)) return stManager.add(["photoview.js", "photoview.css"], function() {
        Photoview.showAlbums(e, t)
    }), !1
}

function showAlbum(e, t, o) {
    if (cur.viewAsBox) return cur.viewAsBox();
    if (!checkEvent(o)) return stManager.add(["photoview.js", "photoview.css"], function() {
        Photoview.showAlbum(e, t)
    }), !1
}

function showPhotoTags(e, t, o) {
    if (cur.viewAsBox) return cur.viewAsBox();
    if (!checkEvent(o)) return stManager.add(["photoview.js", "photoview.css"], function() {
        Photoview.showTagged(e, t)
    }), !1
}

function showVideoTags(e, t, o) {
    if (cur.viewAsBox) return cur.viewAsBox();
    if (!checkEvent(o)) return stManager.add(["video.js", "video.css", "photoview.js", "photoview.css"], function() {
        Photoview.showVideoTags(e, t)
    }), !1
}

function showVideo(e, t, o, n) {
    if (cur.viewAsBox) return cur.viewAsBox();
    if (checkEvent(n)) return !0;
    if (window.mvcur && mvcur.mvShown && mvcur.minimized && mvcur.videoRaw == e) return Videoview.unminimize(), !1;
    o || (o = {});
    var a = nav.objLoc.claim,
        i = ["videoview.js", "videoview.css", "page.js", "page.css"],
        r = o.addParams && /^-?\d+_\d+$/.test(o.addParams.post_id) && o.addParams.post_id;
    !o.playlistId && r && (/^public|groups|profile$/.test(cur.module) && hasClass("post" + r, "own") ? o.playlistId = "wall_" + cur.oid : o.playlistId = "post_" + o.addParams.post_id);
    var r = o.addParams && /^-?\d+_\d+$/.test(o.addParams.post_id) && o.addParams.post_id;
    if (!o.playlistId && r && (/^public|groups|profile$/.test(cur.module) && hasClass("post" + r, "own") ? o.playlistId = "wall_" + cur.oid : o.playlistId = "post_" + o.addParams.post_id),
        o.playlistId && (o.addParams = extend(o.addParams, {
            playlist_id: o.playlistId
        }), !window.VideoPlaylist || !VideoPlaylist.getList(o.playlistId)))
        if (/^wall_/.test(o.playlistId)) {
            var s = cur.wallVideos && cur.wallVideos[o.playlistId];
            o.addParams.load_playlist = s && s.list.length >= 50 ? 0 : 1
        } else o.addParams.load_playlist = intval(/^(?:post_)?-?\d+_-?\d+$/.test(o.playlistId));
    var l = new callHub(function() {
        o.hidden ? o.hidden(l.data, o, t, e) : Videoview.showVideo.apply(Videoview, l.data)
    }, 2);
    stManager.add(i, function() {
        o.hidden || (revertLastInlineVideo(), Videoview.show(n, e, t, o)), l.done()
    }), extend(o, {
        onDone: function() {
            l.data = arguments, l.done()
        },
        cache: "status" != t
    });
    var c = o.params;
    return c || (c = {
            act: "show",
            video: e,
            list: t,
            autoplay: o.autoplay ? 1 : 0,
            ad_video: o.ad_video,
            module: o.module || currentModule() || "",
            svids: o.svids
        }), o.addParams && (c = extend(c, o.addParams)), trim(c.module) || extend(c, {
            _nol: JSON.stringify(nav.objLoc)
        }), a && (c.claim = a), ajax.post("al_video.php", c, o), vkImage()
        .src = locProtocol +
        "//vk.com/rtrg?r=w*Z1Flwi3QdbWaoLMc7zOA*7Cr4Nrtojr9otHjsjIhsb2CVqRWalgbvxZw3MzxZa6be3Siu2XY3gvK5fysYtWLWgNwHMpjRTupSGZrcGRNlj7fduqq9*t7ij6CX4aMcBTD5be8mIXJsbTsvP8Zl2RZEd76a4FTuCOFqzMxqGtFc-", !
        1
}

function showInlineVideo(videoId, listId, options, ev, thumb) {
    if (checkEvent(ev)) return !0;
    if (window.mvcur && mvcur.mvShown) return showVideo(videoId, listId, options, ev);
    options = options || {}, options.params = options.params || {
        act: "show_inline",
        video: videoId,
        list: listId,
        autoplay: options.autoplay ? 1 : 0,
        module: options.module || cur.module || ""
    }, trim(options.params.module) || extend(options.params, {
        _nol: JSON.stringify(nav.objLoc)
    });
    var h = thumb.clientHeight,
        w = thumb.clientWidth,
        btn = geByClass1("video_play_inline", thumb, "div");
    return extend(options.params, {
        width: w,
        height: h
    }), extend(options.params, options.addParams), options.onDone = function(title, html, js, opts) {
        revertLastInlineVideo(), hide(thumb);
        var videoWrap = ce("div", {
            id: "page_video_inline_wrap" + videoId,
            className: "page_video_inline_wrap",
            innerHTML: html
        }, {
            width: w,
            height: h
        });
        _videoLastInlined = [videoWrap, thumb], thumb.parentNode.appendChild(videoWrap), cur.mvOpts = opts && opts.mvData ? opts.mvData : !1;
        try {
            eval("(function () {" + js + "})();")
        } catch (e) {}
        if (!options.params.mute) {
            var _n = window.Notifier,
                _a = window.audioPlayer;
            _n && setTimeout(function() {
                _n.lcSend("video_start")
            }, 0);
            var ap = window.ap;
            ap && ap.isPlaying() && (ap.pause(), ap.pausedByVideo = 1)
        }
    }, options.onFail = function(e) {
        return setTimeout(showFastBox({
                title: getLang("global_error")
            }, e)
            .hide, 2e3), !0
    }, options.showProgress = function() {
        addClass(btn, "video_play_inline_loading")
    }, options.hideProgress = function() {
        removeClass(btn, "video_play_inline_loading")
    }, stManager.add("videoview.js", function() {
        ajax.post("al_video.php", options.params, options), vkImage()
            .src = locProtocol +
            "//vk.com/rtrg?r=w*Z1Flwi3QdbWaoLMc7zOA*7Cr4Nrtojr9otHjsjIhsb2CVqRWalgbvxZw3MzxZa6be3Siu2XY3gvK5fysYtWLWgNwHMpjRTupSGZrcGRNlj7fduqq9*t7ij6CX4aMcBTD5be8mIXJsbTsvP8Zl2RZEd76a4FTuCOFqzMxqGtFc-"
    }), !1
}

function revertLastInlineVideo(e) {
    if (_videoLastInlined) {
        var t, o = !1;
        if ((e = ge(e)) && (t = _videoLastInlined[0])) {
            for (; t = t.parentNode;)
                if (t == e) {
                    o = !0;
                    break
                }
            if (!o) return
        }
        re(_videoLastInlined[0]), show(_videoLastInlined[1]), _videoLastInlined = !1, cur.videoInlinePlayer && (cur.videoInlinePlayer.destroy(), delete cur.videoInlinePlayer),
            delete cur.mvOpts
    }
}

function pauseLastInlineVideo() {
    if (_videoLastInlined) {
        var e = ge("video_player") || window.html5video || null;
        e && e.playVideo && e.playVideo(!1)
    }
}

function showWiki(e, t, o, n) {
    if (checkEvent(o)) return !0;
    var n = n || {};
    if (0 !== cur.gid && (e.gid = cur.gid), window.wkcur && wkcur.shown && wkcur.wkRaw == e.w && e.w && !e.reply) return WkView.restoreLayer(n), cancelEvent(o);
    (window.wkcur && wkcur.hideTitle || e.hide_title) && (n.hide_title = e.hide_title = 1);
    var a = n.stat || ["wkview.js", "wkview.css", "wk.css", "wk.js"];
    t && a.push("wk_editor.js", "wk_editor.css");
    var i = {
        stat: a,
        loader: !n.noloader,
        onDone: function(e, t, a, i) {
            WkView.show(e, t, extend(a, n), i, o)
        },
        onFail: function(e) {
            return WkView.showError(e)
        }
    };
    if (nav.objLoc.claim && (e.claim = nav.objLoc.claim), e.w && "/query" == e.w.substr(-6)) {
        var r = clone(nav.objLoc);
        delete r[0], delete r.w, e.query = JSON.stringify(r)
    }
    return n.preload && extend(i, n.preload), ajax.post("wkview.php", extend({
        act: "show",
        loc: nav.objLoc[0]
    }, e), i), cancelEvent(o)
}

function videoCallback(e) {
    var t = e.shift();
    if (!window.Videoview || !Videoview.playerCallback[t]) throw Error("Unregistered player callback: " + t);
    Videoview.playerCallback[t].apply(Videoview, e)
}

function showApp(e, t, o, n, a, i) {
    i || (i = {});
    var r = extend({
        w: "app" + t
    }, i);
    if (n && (isObject(n) ? r = extend(r, n) : r.ref = n), cur.apps && cur.apps[t] || !o) {
        delete r.w;
        var s = "app" + t + (a ? "_" + a : ""),
            l = nav.objLoc && !nav.objLoc[1] && nav.objLoc[0] === s;
        return nav.go("/" + s + nav.toStr(r), e, {
            nocur: l
        })
    }
    a && (r.mid = a);
    var c = {
        stat: ["wkview.js", "wkview.css", "apps.js", "apps.css"]
    };
    return showWiki(r, !1, e, c)
}

function showDoneBox(e, t) {
    t = t || {};
    var o = (t.w || 380) + 20,
        n = t.w ? ' style="width: ' + t.w + 'px;"' : "",
        a = bodyNode.offsetWidth,
        i = ce("div", {
            className: "top_result_baloon_wrap fixed",
            innerHTML: '<div class="top_result_baloon"' + n + ">" + e + "</div>"
        }, {
            left: (a - o) / 2
        });
    bodyNode.insertBefore(i, pageNode);
    var r = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : boxLayerBG.offsetHeight,
        s = browser.mobile ? intval(window.pageYOffset) : 0;
    containerSize = getSize(i), i.style.top = Math.max(10, s + (r - containerSize[1]) / 3) + "px";
    var l = t.out || 2e3,
        c = function() {
            setTimeout(function() {
                return t.permit && !t.permit() ? void c() : void fadeOut(i.firstChild, 500, function() {
                    re(i), t.callback && t.callback()
                })
            }, l)
        };
    c()
}

function animateCount(e, t, o) {
    if (e = ge(e), o = o || {}, t = o.str ? trim(t.toString()) || "" : positive(t), e) {
        if (browser.msie6 || browser.mobile && !browser.safari_mobile && !browser.android) return void val(e, t || "");
        var n = data(e, "curCount"),
            a = data(e, "nextCount");
        if ("number" == typeof a || o.str && "string" == typeof a) return void(t != a && data(e, "nextCount", t));
        if ("number" == typeof n || o.str && "string" == typeof n) return void(t != n && data(e, "nextCount", t));
        if (n = o.str ? trim(val(e)
                .toString()) || "" : positive(val(e)), "auto" === o.str && (o.str = !n.match(/^\d+$/) || !t.match(/^\d+$/), o.str || (n = positive(n), t = positive(t))), n != t) {
            data(e, "curCount", t);
            var i, r, s, l = o.str ? n.length == t.length ? t > n : n.length < t.length : t > n,
                c = (l ? t : n)
                .toString(),
                d = (l ? n : t)
                .toString(),
                u = [],
                h = [],
                p = "",
                f = "";
            for (o.str || (d = new Array(c.length - d.length + 1)
                    .join("0") + d), i = 0, r = c.length; r > i && (s = c.charAt(i)) === d.charAt(i); i++) u.push(s);
            if (p = c.substr(i), f = d.substr(i), o.str) {
                for (i = p.length; i > 0 && (s = p.charAt(i)) === f.charAt(i); i--) h.unshift(s);
                h.length && (p = p.substr(0, i + 1), f = f.substr(0, i + 1))
            }
            u = u.join("")
                .replace(/\s$/, "&nbsp;"), h = h.join("")
                .replace(/^\s/, "&nbsp;"), trim(val(e)) || val(e, "&nbsp;");
            var g = e.clientHeight || e.offsetHeight;
            val(e, '<div class="counter_wrap inl_bl"></div>');
            var v, m, _, w, b = e.firstChild,
                y = !0;
            u.length && b.appendChild(v = ce("div", {
                className: "counter_const inl_bl",
                innerHTML: u
            })), u.length || (f = f.replace(/^0+/, "")), (!f || "0" == f && !u.length) && (f = "&nbsp;", y = u.length ? !0 : !1), b.appendChild(_ = ce("div", {
                className: "counter_anim_wrap inl_bl"
            })), _.appendChild(w = ce("div", {
                className: "counter_anim " + (l ? "counter_anim_inc" : "counter_anim_dec"),
                innerHTML: '<div class="counter_anim_big"><span class="counter_anim_big_c">' + p + "</span></div>" + (y ?
                    '<div class="counter_anim_small"><span class="counter_anim_small_c">' + f + "</span></div>" : "")
            }, y ? {
                marginTop: l ? -g : 0
            } : {
                right: 0
            })), o.str && setStyle(w, {
                textAlign: "right",
                right: 0
            });
            var x = getSize(geByClass1("counter_anim_big_c", w, "span"))[0],
                k = y ? "&nbsp;" == f ? x : getSize(geByClass1("counter_anim_small_c", w, "span"))[0] : 0;
            if (h.length && b.appendChild(m = ce("div", {
                    className: "counter_const inl_bl",
                    innerHTML: h
                })), setStyle(b, {
                    width: (v && getSize(v)[0] || 0) + (m && getSize(m)[0] || 0) + x + 0
                }), void 0 === browser.csstransitions) {
                var C = browser,
                    L = floatval(C.version);
                browser.csstransitions = C.chrome && L >= 9 || C.mozilla && L >= 4 || C.opera && L >= 10.5 || C.safari && L >= 3.2 || C.safari_mobile || C.android
            }
            var T = browser.csstransitions;
            setStyle(_, {
                width: l ? k : x
            });
            var S = function() {
                    val(e, t || " ");
                    var n = data(e, "nextCount");
                    data(e, "curCount", !1), data(e, "nextCount", !1), ("number" == typeof n || o.str && "string" == typeof n) && setTimeout(animateCount.pbind(e, n, o), 0), o.onDone &&
                        o.onDone()
                },
                E = y ? {
                    marginTop: l ? 0 : -g
                } : {
                    marginRight: l ? -k : 0
                };
            T ? (getStyle(_, "width"), addClass(_, "counter_css_anim_wrap"), x != k && setStyle(_, {
                width: l ? x : k
            }), y && setStyle(w, E), setTimeout(S, 300), o.fadeMode && (setStyle(geByClass1("counter_anim_big", e), "opacity", 1), setStyle(geByClass1("counter_anim_small",
                e), "opacity", 0))) : (x != k && animate(_, {
                width: l ? x : k
            }, {
                duration: 100
            }), y ? animate(w, E, {
                duration: 300,
                transition: Fx.Transitions.easeOutCirc,
                onComplete: S
            }) : setTimeout(S, 300))
        }
    }
}

function topHeaderClose(e) {
    cur.headerDestroy && cur.headerDestroy(), cur.headerDestroy = e
}

function topHeaderClearClose() {
    delete cur.headerDestroy
}

function mentionOver(e, t) {
    t = t || {}, showTooltip(e, {
        url: "al_wall.php",
        params: {
            act: "mention_tt",
            mention: e.getAttribute("mention_id"),
            from: "wall"
        },
        shift: t.shift || [52, 7, 7],
        hidedt: 500,
        showdt: 500,
        slide: 15,
        dir: "auto",
        appendEl: domClosest("_im_mess_stack", e) || domClosest("rb_box_wrap", e) || domClosest("wk_cont", e) || domClosest("scroll_fix_wrap", e)
    })
}

function mentionClick(e, t, o) {
    e && e.tt && e.tt.hide && e.tt.hide({
        fasthide: 1
    });
    var n = e;
    if (n.tagName && "a" == n.tagName.toLowerCase() && !n.getAttribute("target") && !nav.baseBlank) {
        o = o || {};
        var a = n.getAttribute("hrefparams");
        a && (o.params = extend(o.params || {}, q2ajx(a))), n = n.href || "", n = n.replace(/^https?:\/\//i, ""), n.indexOf(location.hostname) || (n = n.replace(location.hostname,
            "")), n = n.replace(/^(vkontakte\.ru\/|vk\.com\/)/, "/");
        var i;
        if (n.match(/#$/) || !(i = n.match(/^\/(.*?)(\?|#|$)/))) return !0;
        if (i = i[1], i.indexOf(".php") > 0 || i.match(/^(doc\-?\d+_\d+|graffiti\d+|reg\d+|images|utils|\.js|js\/|\.css|css\/)/)) return !0
    }
    return nav.go(n, t, o)
}

function headPlayPause(e) {
    var t = currentAudioId();
    if (window.audioPadShown || t || Pads.show("mus"), t || (t = ls.get("audio_id"), t && (window.padPlClicked = !0)), t) playAudioNew(t);
    else {
        var o = padAudioPlaylist();
        o && o.start ? playAudioNew(o.start) : (addClass(ge("head_play_btn"), "playing"), window.onPlaylistLoaded = function() {
            var e = padAudioPlaylist();
            e && e.start && playAudioNew(e.start)
        })
    }
    e && cancelEvent(e)
}

function currentAudioId() {
    return window.audioPlayer && audioPlayer.id
}

function padAudioPlaylist() {
    return window.audioPlaylist || ls.get("pad_playlist")
}

function menuSettings(e) {
    return showTabbedBox("al_settings.php", {
        act: "menu_box",
        type: e
    })
}

function testRedesign(e, t, o, n) {
    var a = "BUTTON" == e.tagName;
    return (a ? buttonLocked(e) : linkLocked(e)) ? !1 : (a ? lockButton(e) : lockLink(e), o ? showBox("al_index.php", {
        act: "test_redesign_box",
        hash: t,
        type: n
    }, {
        onDone: a ? unlockButton.pbind(e) : unlockLink.pbind(e)
    }) : (ajax.post("al_index.php", {
        act: "a_test_redesign",
        hash: t,
        type: n
    }, extend({
        onDone: function(e) {
            e.reload ? location = location.protocol + "//vk.com/" + nav.strLoc : (e.leftNav && val(geByTag1("ol", ge("side_bar")), e.leftNav), e.html &&
                val("test_redesign_wrap", e.html))
        }.bind(this),
        onFail: a ? unlockButton.pbind(e) : unlockLink.pbind(e),
        showProgress: a ? lockButton.pbind(e) : lockLink.pbind(e)
    })), !1))
}

function mobileOnlineTip(e, t) {
    var o = (t.right ? 278 : 35) + (browser.opera ? 1 : 0);
    return showTooltip(e, {
        url: "al_login.php",
        params: {
            act: "mobile_tt",
            mid: t.mid,
            was: t.was
        },
        slide: 15,
        ajxdt: 200,
        showdt: 200,
        hidedt: 200,
        forcetoup: t.forcetoup,
        toup: !1,
        dir: "auto",
        appendParentCls: t.appendParentCls,
        shift: [o, 8, 8],
        className: "mobile_tt" + (t.right ? " mobile_tt_right" : "")
    })
}

function pageVerifiedTip(e, t) {
    return showTooltip(e, {
        url: t.gid ? "al_groups.php" : "al_profile.php",
        params: {
            act: "verified_tt",
            mid: t.mid || 0,
            gid: t.gid || 0
        },
        slide: 15,
        ajxdt: 200,
        showdt: 200,
        hidedt: 200,
        dir: "auto",
        shift: [94, 7, 7],
        className: "verified_tt"
    })
}

function cssAnim(e, t, o, n) {
    var a = intval(browser.version);
    if (e && (browser.chrome && a > 14 || browser.mozilla && a > 13 || browser.opera && a > 2)) {
        var i, r = "all " + o.duration + "ms " + (o.func || "ease-out");
        e.style.WebkitTransition = r, e.style.MozTransition = r, e.style.OTransition = r, e.style.transition = r;
        var i = function() {
            return browser.opera && intval(browser.version) <= 12 ? e.removeEventListener("oTransitionEnd", i) : removeEvent(e,
                    "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", i), e.style.WebkitTransition = "", e.style.MozTransition = "", e.style.OTransition = "",
                e.style.transition = "", n && n(), !1
        };
        n && (browser.opera && intval(browser.version) <= 12 ? e.addEventListener("oTransitionEnd", i) : addEvent(e,
            "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", i)), setTimeout(setStyle.pbind(e, t), 0)
    } else animate(e, t, extend(o, {
        onComplete: n
    }))
}

function imagesLoader(e, t) {
    function o(e, t) {
        i[e] && (--r, delete i[e]), t || obj.processLoad()
    }

    function n(t) {
        var o = 0,
            n = t;
        if (n && n.offsetParent)
            do
                if (o += n.offsetTop, e && n.offsetParent === e) break;
        while (n = n.offsetParent);
        return o
    }
    var a = {
            top_load: 0,
            bottom_load: 2,
            load_limit: 10,
            need_load_class: "__need_load",
            skip_process_load: !1,
            use_iframe: !1
        },
        i = [],
        r = 0,
        s = null,
        l = extend(a, t);
    return obj = {}, obj.processLoad = function() {
        for (var t in i) {
            var a = i[t],
                c = a[0],
                d = a[1];
            (d.width || d.height || vkNow() - c > 2e4) && i[t] && o.call(d, t, !0)
        }
        if (clearTimeout(s), r && (s = setTimeout(obj.processLoad, 500)), !(r >= l.load_limit)) {
            var u = geByClass(l.need_load_class, e || bodyNode),
                h = [];
            if (e) var p = e.offsetHeight,
                f = e.scrollTop - p * l.top_load,
                g = e.scrollTop + p * l.bottom_load;
            for (var v = 0, m = u.length; m > v && r < l.load_limit; v++) {
                var d = u[v];
                if ("IMG" == d.tagName) {
                    var t = d.getAttribute("data-src");
                    if (t) {
                        if (e) {
                            var _ = n(d),
                                w = _ + d.parentNode.offsetHeight;
                            if (_ > g) continue;
                            if (f > w) continue
                        }
                        h.push([d, t])
                    }
                }
            }
            each(h, function() {
                var e = this[0],
                    t = this[1];
                obj.iloader && obj.iloader.add(t, o, e), e.src = t, e.removeAttribute("data-src"), removeClass(e, l.need_load_class), i[t] || (++r, i[t] = [vkNow(), e])
            }), clearTimeout(s), r && (s = setTimeout(obj.processLoad, 500))
        }
    }, obj.destroy = function() {
        i = [], r = 0, clearTimeout(s)
    }, l.use_iframe && window.IframeLoader && (obj.iloader = new IframeLoader), l.skip_process_load || obj.processLoad(), obj
}

function IframeLoader() {
    function e(e) {
        try {
            return e.contentDocument ? e.contentDocument : e.contentWindow && e.contentWindow.document ? e.contentWindow.document : e.document
        } catch (t) {}
        return !1
    }

    function t(e) {
        return l && l.body ? '<img id="___img' + e + '" />' : '<img class="___img' + e + '" />'
    }

    function o(e) {
        return l && l.body ? l.getElementById("___img" + e) : geByClass1("___img" + e, c)
    }

    function n() {
        s = utilsNode.appendChild(ce("iframe")), l = e(s), c = l && l.body ? l.body : utilsNode.appendChild(ce("div", {}, {
            display: "none"
        })), d = 0, u = []
    }

    function a(e, n, a) {
        var i = d++;
        u[i] = {
            src: e,
            onLoad: n,
            that: a
        }, c.appendChild(ce("div", {
            innerHTML: t(i)
        }));
        var r = o(i);
        r.src = e, r.onload = function() {
            var e = u[i];
            e && (e.onLoad && e.onLoad.call(e.that || window, e.src), delete u[i], c.removeChild(o(i)
                .parentNode))
        }
    }

    function i() {
        re(s), h = [];
        for (var e in u) h.push(u[e]);
        n()
    }

    function r(e) {
        if (!h) return [];
        var t = [];
        for (var o in h) {
            var n = h[o];
            a(n.src, n.onLoad, n.that), t.push(n.that)
        }
        if (h = null, e) {
            var i = [];
            each(t, function() {
                i.push([this, this.src]), this.src = "", hide(this)
            }), setTimeout(function() {
                each(i, function() {
                    var e = this[0],
                        t = this[1];
                    e.src = t, show(e)
                })
            }, 10)
        }
        return t
    }
    var s, l, c, d, u, h;
    return n(), {
        add: a,
        abort: i,
        repeat: r
    }
}

function getCaretBoundingRect(e) {
    var t = e.getBoundingClientRect(),
        o = null,
        n = null;
    if (t.top === t.bottom) return {
        left: 0,
        top: 0,
        bottom: 0
    };
    if (document.selection) n = document.selection.createRange(), o = n.getClientRects() || [], o.length || (n.text = "_", n.moveStart("character", -1), o = n.getClientRects(), n.text =
        ""), o = o[o.length - 1];
    else if (window.getSelection) {
        var a = getSelection();
        if (n = a.getRangeAt(0), n.collapsed) {
            var i = n.startOffset;
            n.setStart(n.startContainer, 0), o = n.getClientRects(), n.setStart(n.startContainer, i)
        }
        o = o.length ? o[o.length - 1] : {
            right: t.left,
            top: t.top,
            bottom: t.top
        }
    }
    return {
        left: o.right - t.left,
        top: o.top - t.top,
        bottom: o.bottom - t.top
    }
}

function getSelectionText() {
    var e = "";
    return window.getSelection ? e = window.getSelection()
        .toString() : document.selection && "Control" != document.selection.type && (e = document.selection.createRange()
            .text), e
}

function aquireLock(e, t, o) {
    var n = "lockkk_" + e;
    if (ls.get(n) !== !0) {
        ls.set(n, !0);
        try {
            t()
        } catch (a) {}
        return void ls.set(n, !1)
    }
    ls.checkVersion() ? o || setTimeout(aquireLock.pbind(e, t, !0), 100) : t()
}

function statNavigationTiming() {
    if (window.clientStatsInitedNT) return !1;
    if (Math.random() < .001 && window.performance && performance.timing) {
        var e = {};
        performance.timing.redirectStart && performance.timing.redirectEnd && (e.redirect = performance.timing.redirectEnd - performance.timing.redirectStart), performance.timing.domainLookupStart &&
            performance.timing.domainLookupEnd && (e.domainLookup = performance.timing.domainLookupEnd - performance.timing.domainLookupStart), performance.timing.connectStart &&
            performance.timing.connectEnd && (e.connect = performance.timing.connectEnd - performance.timing.connectStart, performance.timing.secureConnectionStart && (e.secureConnection =
                performance.timing.connectEnd - performance.timing.secureConnectionStart)), performance.timing.requestStart && performance.timing.responseStart && (e.request =
                performance.timing.responseStart - performance.timing.requestStart, performance.timing.responseEnd && (e.response = performance.timing.responseEnd - performance.timing
                    .responseStart)), performance.timing.unloadEventStart && performance.timing.unloadEventEnd && (e.unloadEvent = performance.timing.unloadEventEnd - performance.timing
                .unloadEventStart), performance.timing.domLoading && performance.timing.domComplete && (e.processing = performance.timing.domComplete - performance.timing.domLoading),
            performance.timing.domContentLoadedEventStart && performance.timing.domContentLoadedEventEnd && (e.domContentLoadedEvent = performance.timing.domContentLoadedEventEnd -
                performance.timing.domContentLoadedEventStart), performance.timing.loadEventStart && performance.timing.loadEventEnd && (e.loadEvent = performance.timing.loadEventEnd -
                performance.timing.loadEventStart);
        for (var t in e) statlogsValueEvent("navigation_timing", e[t], t);
        window.clientStatsInitedNT = !0
    }
}

function statDurationsLoadImage() {
    if (Math.random() < .001 && window.performance && window.performance.getEntriesByType) {
        if (window.clientStatsInited) return !1;
        var e = window.performance.getEntriesByType("resource");
        if (!e) return !1;
        for (var t = {}, o = {}, n = 0; n < e.length; n++)
            if (e[n] && "img" == e[n].initiatorType)
                if (e[n].duration < 100) t["<100"] = (t["<100"] || 0) + 1;
                else if (e[n].duration < 250) t["100-250"] = (t["100-250"] || 0) + 1;
        else if (e[n].duration < 500) t["250-500"] = (t["250-500"] || 0) + 1;
        else if (e[n].duration < 1e3) t["500-1000"] = (t["500-1000"] || 0) + 1;
        else if (e[n].duration < 2e3) t["1000-2000"] = (t["1000-2000"] || 0) + 1;
        else if (e[n].duration < 5e3) t["2000-5000"] = (t["2000-5000"] || 0) + 1;
        else if (t[">5000"] = (t[">5000"] || 0) + 1, e[n].name && e[n].name.indexOf("pp.vk.me") > 0) {
            var a = "";
            a = e[n].name, a = a.substr(a.indexOf("pp.vk.me") + 9), a.indexOf("/") > 0 && (a = a.substr(0, a.indexOf("/")), o[a] = (o[a] || 0) + 1)
        }
        for (var i in t) statlogsValueEvent("img_load", t[i], i);
        for (var i in o) statlogsValueEvent("img_slow", o[i], i);
        window.clientStatsInited = !0
    }
}

function statlogsValueEvent(e, t, o, n, a) {
    if ("undefined" != typeof e && "undefined" != typeof t) {
        var i, r = "remixsts",
            s = [].slice.apply(arguments, [2, 5]);
        aquireLock("stats_cookie_lock", function() {
            try {
                i = JSON.parse(getCookie(r)), i = i.data
            } catch (o) {
                i = []
            }
            for (i.push([Math.round(Date.now() / 1e3), e, t].concat(s)); i.length > 100;) i.shift();
            var n = Math.round(rand(0, 1e9));
            setCookie(r, JSON.stringify({
                data: i,
                uniqueId: n
            }), .01)
        })
    }
}

function getProgressBarEl(e) {
    return geByClass1("ui_progress_bar", e)
}

function onLoaded(e) {
    vk.loaded ? e() : addEvent(window, "load", e)
}

function currentModule() {
    return cur.currentModule ? cur.currentModule() : cur.module
}

function formatTime(e) {
    var t, o, n;
    return e = Math.max(e, 0), o = e % 60, t = 10 > o ? "0" + o : o, e = Math.floor(e / 60), n = e % 60, t = n + ":" + t, e = Math.floor(e / 60), e > 0 && (10 > n && (t = "0" + t),
        t = e + ":" + t), t
}

function debounce(e, t, o) {
    var n;
    return function() {
        var a = this,
            i = arguments,
            r = function() {
                n = null, o || e.apply(a, i)
            },
            s = o && !n;
        clearTimeout(n), n = setTimeout(r, t), s && e.apply(a, i)
    }
}

function throttle(e, t) {
    var o;
    return function() {
        o || (e.apply(this, arguments), o = setTimeout(function() {
            o = !1
        }, t))
    }
}

function shuffle(e) {
    for (var t, o, n = e.length; n > 0;) o = Math.floor(Math.random() * n), n--, t = e[n], e[n] = e[o], e[o] = t;
    return e
}

function getProgressHtml(e, t) {
    return rs(vk.pr_tpl, {
        id: e || "",
        cls: t || ""
    })
}

function showProgress(e, t, o, n) {
    if (e = ge(e)) {
        var a;
        return hasClass(e, "pr") ? a = e : (a = se(rs(vk.pr_tpl, {
            id: t || "",
            cls: o || ""
        })), n ? domInsertBefore(a, e) : e.appendChild(a)), setTimeout(function() {
            setStyle(a, {
                opacity: 1
            })
        }), a
    }
}

function hideProgress(e) {
    e && (hasClass(e, "pr") ? setStyle(e, {
        opacity: 0
    }) : re(geByClass1("pr", e)))
}

function initTopAudioPlayer() {
    stManager.add(["audioplayer.js"], function() {
        TopAudioPlayer.init()
    })
}

function toggleAudioLyrics(e, t, o, n) {
    var a = gpeByClass("_audio_row", t),
        i = (geByClass1("audio_info", a), geByClass1("audio_lyrics", a));
    return i.innerHTML ? (toggle(i), cancelEvent(e), !1) : (n = intval(n), n && (addClass(a, "audio_loading"), showProgress(a), ajax.post("al_audio.php", {
        act: "get_lyrics",
        aid: o,
        lid: n
    }, {
        onDone: function(e) {
            hideProgress(a), removeClass(a, "audio_loading"), i.innerHTML = e, show(i)
        }
    }), cancelEvent(e)), !1)
}

function toggleAudio(e, t) {
    return cur.cancelClick ? cur.cancelClick = !1 : t && (hasClass(t.target, "audio_lyrics") || domClosest("_audio_duration_wrap", t.target) || domClosest("_audio_inline_player",
        t.target)) ? !1 : void stManager.add(["audioplayer.js", "ui_controls.js", "ui_controls.css", "indexer.js"], function() {
        AudioUtils.toggleAudio(e)
    })
}

function getAudioPlayer(e) {
    return stManager.add(["audioplayer.js", "ui_controls.js", "ui_controls.css"], function() {
        window.ap = window.ap || new AudioPlayer, e && e(window.ap)
    }), window.ap
}

function prepareAudioLayer(e) {
    stManager.add(["audio.js", "audioplayer.js", "ui_controls.js", "ui_controls.css", "audio.css", "suggester.js", "auto_list.js", "indexer.js"], function() {
        e && e()
    })
}

function showAudioLayer(e, t) {
    return prepareAudioLayer(function() {
        AudioUtils.showAudioLayer(t)
    }), cancelEvent(e)
}

function audioSetNext(e, t, o) {
    return getAudioPlayer(function(t) {
        var o = gpeByClass("_audio_row", e);
        hasClass(o, "audio_added_next") || (addClass(o, "audio_added_next"), t.setNext(AudioUtils.buildAudioFromRow(o)))
    }), cancelEvent(o)
}

function audioShowActionTooltip(e) {
    if (!cur._addRestoreInProgress) {
        var t = gpeByClass("_audio_row", e) || gpeByClass("_audio_page_player", e),
            o = e.id,
            n = domData(t, "full-id");
        switch (cur._audioAddRestoreInfo = cur._audioAddRestoreInfo || {}, o) {
            case "delete":
                if (hasClass(t, "recoms")) o = getLang("audio_dont_show");
                else {
                    var a = cur._restores && cur._restores[n];
                    o = a && a.deleteAll ? a.deleteAll.text : getLang("audio_delete_audio")
                }
                break;
            case "audio_add":
            case "add":
                if (hasClass(t, "recoms") && hasClass(t, "audio_deleted")) o = getLang("audio_restore_audio");
                else {
                    var i = cur._audioAddRestoreInfo[n];
                    if (i && "deleted" == i.state) o = getLang("audio_restore_audio");
                    else if (i && i.state == AudioUtils.AUDIO_STATE_ADDED) o = getLang("audio_delete_audio");
                    else {
                        var r = window.AudioPage ? AudioPage(e) : !1;
                        o = getLang(r && r.options.oid < 0 && r.options.canAudioAddToGroup ? "audio_add_to_group" : "audio_add_to_audio")
                    }
                }
                break;
            case "edit":
                o = getLang("audio_edit_audio");
                break;
            case "next":
                o = cur.lang && cur.lang.global_audio_set_next_audio || getLang("audio_set_next_audio");
                break;
            case "recom":
                o = getLang("audio_show_recommendations")
        }
        var s = {
            text: function() {
                return o
            },
            black: 1,
            shift: [15, 10, 0],
            needLeft: !0
        };
        gpeByClass("_im_mess_stack", e) ? (s.appendParentCls = "_im_mess_stack", s.shift = [13, 10, 0], s.noZIndex = !0) : gpeByClass("top_notify_wrap", e) && (s.appendParentCls =
            "top_notify_wrap"), showTooltip(e, s)
    }
}

function addAudio(e, t) {
    return stManager.add(["audioplayer.js"], function() {
        AudioUtils.addAudio(e)
    }), cancelEvent(t)
}

function isToday(e) {
    var t = new Date;
    return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate()
}

function isYesterday(e) {
    var t = new Date(e.getTime() + 864e5);
    return isToday(t)
}

function isTomorrow(e) {
    var t = new Date(e.getTime() - 864e5);
    return isToday(t)
}

function leadingZero(e) {
    return e >= 10 ? e : "0" + e
}

function langDate(e, t, o, n, a, i) {
    var r;
    i || (i = ""), isArray(t) || (t = ["", t, t, t, t]), "number" == typeof e || "string" == typeof e ? (e > 2147483646e3 && (e = 0), e += o, r = new Date(e)) : r = e, a ? t = t[1] :
        (tmp = "", isToday(r) ? tmp = t[3] : isYesterday(r) ? tmp = t[2] : isTomorrow(r) ? tmp = t[4] : tmp = t[1], !tmp && t[1] && (tmp = t[1]), t = tmp), amPm = "";
    var s = {
        hours: r.getHours(),
        minutes: r.getMinutes(),
        seconds: r.getSeconds(),
        day: r.getDate(),
        month: r.getMonth() + 1,
        year: r.getFullYear()
    };
    switch (3 === vk.lang && (amPm = r.getHours() > 11 ? "pm" : "am", s.hours = r.getHours() % 12 == 0 ? 12 : r.getHours() % 12), vk.lang) {
        case 1:
            switch (r.getHours()) {
                case 11:
                    t = t.replace("�", "��");
                    break;
                case 0:
                    t = t.replace("�", "�")
            }
            break;
        case 3:
            !isToday(r) || isYesterday(r) || isTomorrow(r) || (t = i + t);
            break;
        case 12:
        case 73:
            1 == r.getHours() && (t = t.repalce(" &#224;s ", " &#224; "))
    }
    return 68 === vk.lang && (s.year = s.year + 543), t.replace("{hour}", s.hours)
        .replace("{num_hour}", leadingZero(s.hours))
        .replace("{minute}", leadingZero(s.minutes))
        .replace("{day}", s.day)
        .replace("{num_day}", leadingZero(s.day))
        .replace("{month}", n[s.month])
        .replace("{year}", s.year)
        .replace("{short_year}", s.year % 100)
        .replace("{second}", leadingZero(s.seconds))
        .replace("{am_pm}", amPm)
}

function getShortDate(e, t, o, n) {
    return e *= 1e3, "undefined" == typeof o && (o = !0), "undefined" == typeof n && (n = getLang("months_of", "raw")), curTime = Date.now(), curDate = new Date(curTime), date =
        new Date(e), e > curTime && e - curTime < 864e5 && curDate.getDate() == date.getDate() ? langDate(e, "{hour}:{minute} {am_pm}", t, [], !o) : date.getYear() != curDate.getYear() ||
        e < curTime - 157248e5 ? langDate(e, getLang("global_date", "raw"), t, n, !o) : langDate(e, getLang("global_short_date", "raw"), t, n, !o)
}

function getShortDateOrTime(e, t, o, n) {
    return isToday(new Date(1e3 * e)) ? langDate(1e3 * e, "{hour}:{minute} {am_pm}", 1e3 * t, [], !o) : getShortDate(e, 1e3 * t, o, n)
}

function langWordNumeric(e, t, o) {
    return isArray(t) && e < t.length ? t[e] : langNumeric(e, o)
}

function getDateText(e, t) {
    var o = "";
    e += t;
    var n = parseInt(Date.now() / 1e3) - e;
    if (5 > n) o = getLang("global_just_now");
    else if (60 > n) {
        var a = n;
        o = langWordNumeric(a, getLang("global_word_secs_ago", "raw"), getLang("global_secs_ago", "raw"))
    } else if (3600 > n) {
        var i = intval(n / 60);
        o = langWordNumeric(i, getLang("global_word_mins_ago", "raw"), getLang("global_mins_ago", "raw"))
    } else if (14400 > n) {
        var r = intval(n / 3600);
        o = langWordNumeric(r, getLang("global_word_hours_ago", "raw"), getLang("global_hours_ago", "raw"))
    } else o = getSmDate(e);
    return o
}

function getSmDate(e, t, o) {
    "undefined" == typeof o && (o = !0), "undefined" == typeof t && (t = 0);
    var n = new Date,
        a = n.getFullYear(),
        i = n.getMonth(),
        r = new Date(1e3 * e),
        s = r.getFullYear(),
        l = r.getMonth();
    return a > s && (i > 1 || 9 > l || a - s >= 2) ? langDate(1e3 * e, getLang("global_date", "raw"), t, getLang("months_sm_of", "raw"), !o) : langDate(1e3 * e, getLang(
        "global_short_date_time", "raw"), t, getLang("months_sm_of", "raw"), !o)
}

function hashCode(e) {
    var t = 0;
    if (0 === e.length) return t;
    for (var o = 0, n = e.length; n > o; o++) {
        var a = e.charCodeAt(o);
        t = (t << 5) - t + a, t |= 0
    }
    return t
}

function fixImHeight() {
    var e = document.getElementById("im--page");
    if (e) {
        var t = window.innerHeight - 80;
        e.style.height = t + "px"
    }
}
if (function() {
        "use strict";

        function e() {}

        function t(e, t) {
            for (var o = e.length; o--;)
                if (e[o].listener === t) return o;
            return -1
        }

        function o(e) {
            return function() {
                return this[e].apply(this, arguments)
            }
        }
        var n = e.prototype,
            a = this,
            i = a.EventEmitter;
        n.getListeners = function(e) {
            var t, o, n = this._getEvents();
            if (e instanceof RegExp) {
                t = {};
                for (o in n) n.hasOwnProperty(o) && e.test(o) && (t[o] = n[o])
            } else t = n[e] || (n[e] = []);
            return t
        }, n.flattenListeners = function(e) {
            var t, o = [];
            for (t = 0; t < e.length; t += 1) o.push(e[t].listener);
            return o
        }, n.getListenersAsObject = function(e) {
            var t, o = this.getListeners(e);
            return o instanceof Array && (t = {}, t[e] = o), t || o
        }, n.addListener = function(e, o) {
            var n, a = this.getListenersAsObject(e),
                i = "object" == typeof o;
            for (n in a) a.hasOwnProperty(n) && -1 === t(a[n], o) && a[n].push(i ? o : {
                listener: o,
                once: !1
            });
            return this
        }, n.on = o("addListener"), n.addOnceListener = function(e, t) {
            return this.addListener(e, {
                listener: t,
                once: !0
            })
        }, n.once = o("addOnceListener"), n.defineEvent = function(e) {
            return this.getListeners(e), this
        }, n.defineEvents = function(e) {
            for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
            return this
        }, n.removeListener = function(e, o) {
            var n, a, i = this.getListenersAsObject(e);
            for (a in i) i.hasOwnProperty(a) && (n = t(i[a], o), -1 !== n && i[a].splice(n, 1));
            return this
        }, n.off = o("removeListener"), n.addListeners = function(e, t) {
            return this.manipulateListeners(!1, e, t)
        }, n.removeListeners = function(e, t) {
            return this.manipulateListeners(!0, e, t)
        }, n.manipulateListeners = function(e, t, o) {
            var n, a, i = e ? this.removeListener : this.addListener,
                r = e ? this.removeListeners : this.addListeners;
            if ("object" != typeof t || t instanceof RegExp)
                for (n = o.length; n--;) i.call(this, t, o[n]);
            else
                for (n in t) t.hasOwnProperty(n) && (a = t[n]) && ("function" == typeof a ? i.call(this, n, a) : r.call(this, n, a));
            return this
        }, n.removeEvent = function(e) {
            var t, o = typeof e,
                n = this._getEvents();
            if ("string" === o) delete n[e];
            else if (e instanceof RegExp)
                for (t in n) n.hasOwnProperty(t) && e.test(t) && delete n[t];
            else delete this._events;
            return this
        }, n.removeAllListeners = o("removeEvent"), n.emitEvent = function(e, t) {
            var o, n, a, i, r = this.getListenersAsObject(e);
            for (a in r)
                if (r.hasOwnProperty(a))
                    for (n = r[a].length; n--;) o = r[a][n], o.once === !0 && this.removeListener(e, o.listener), i = o.listener.apply(this, t || []), i === this._getOnceReturnValue() &&
                        this.removeListener(e, o.listener);
            return this
        }, n.trigger = o("emitEvent"), n.emit = function(e) {
            var t = Array.prototype.slice.call(arguments, 1);
            return this.emitEvent(e, t)
        }, n.setOnceReturnValue = function(e) {
            return this._onceReturnValue = e, this
        }, n._getOnceReturnValue = function() {
            return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
        }, n._getEvents = function() {
            return this._events || (this._events = {})
        }, e.noConflict = function() {
            return a.EventEmitter = i, e
        }, "function" == typeof define && define.amd ? define(function() {
            return e
        }) : "object" == typeof module && module.exports ? module.exports = e : a.EventEmitter = e
    }.call(this), 1 == vk.al ? (location.search || "/" != location.pathname) && location.replace("/") : (3 != vk.al || history.pushState || (vk.al = 2), location.search ||
        "/index.php" != location.pathname || location.replace("/"), vk.version = !1), window.stVersions || (window.navMap = window.stVersions = window.stTypes = {}, window._rnd =
        1), window.__debugMode = !0, window._wf = 0, !window._ua) var _ua = navigator.userAgent.toLowerCase();
if (!window.locDomain) var locDomain = location.host.toString()
    .match(/[a-zA-Z]+\.[a-zA-Z]+\.?$/)[0];
if (!window.StaticFiles) var StaticFiles = {};
var parseJSON = window.JSON && JSON.parse ? function(obj) {
        try {
            return JSON.parse(obj)
        } catch (e) {
            return topError("<b>parseJSON:</b> " + e.message, {
                dt: -1,
                type: 5,
                answer: obj
            }), eval("(" + obj + ")")
        }
    } : function(obj) {
        return eval("(" + obj + ")")
    },
    cur = {
        destroy: [],
        nav: []
    },
    browser = {
        version: (_ua.match(/.+(?:me|ox|on|rv|it|era|opr|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
        opera: /opera/i.test(_ua) || /opr/i.test(_ua),
        msie: /msie/i.test(_ua) && !/opera/i.test(_ua) || /trident\//i.test(_ua) || /edge/i.test(_ua),
        msie6: /msie 6/i.test(_ua) && !/opera/i.test(_ua),
        msie7: /msie 7/i.test(_ua) && !/opera/i.test(_ua),
        msie8: /msie 8/i.test(_ua) && !/opera/i.test(_ua),
        msie9: /msie 9/i.test(_ua) && !/opera/i.test(_ua),
        msie_edge: /edge/i.test(_ua) && !/opera/i.test(_ua),
        mozilla: /firefox/i.test(_ua),
        chrome: /chrome/i.test(_ua) && !/edge/i.test(_ua),
        safari: !/chrome/i.test(_ua) && /webkit|safari|khtml/i.test(_ua),
        iphone: /iphone/i.test(_ua),
        ipod: /ipod/i.test(_ua),
        iphone4: /iphone.*OS 4/i.test(_ua),
        ipod4: /ipod.*OS 4/i.test(_ua),
        ipad: /ipad/i.test(_ua),
        android: /android/i.test(_ua),
        bada: /bada/i.test(_ua),
        mobile: /iphone|ipod|ipad|opera mini|opera mobi|iemobile|android/i.test(_ua),
        msie_mobile: /iemobile/i.test(_ua),
        safari_mobile: /iphone|ipod|ipad/i.test(_ua),
        opera_mobile: /opera mini|opera mobi/i.test(_ua),
        opera_mini: /opera mini/i.test(_ua),
        mac: /mac/i.test(_ua),
        search_bot: /(yandex|google|stackrambler|aport|slurp|msnbot|bingbot|twitterbot|ia_archiver|facebookexternalhit)/i.test(_ua)
    },
    mobPlatforms = {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 1
    };
! function() {
    var e = [0, 0, 0],
        t = "ShockwaveFlash.ShockwaveFlash",
        o = "embed",
        n = 'type="application/x-shockwave-flash" ',
        a = function(e) {
            return e.toString()
                .replace("&", "&amp;")
                .replace('"', "&quot;")
        };
    if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
        var i = navigator.plugins["Shockwave Flash"];
        if (i && i.description)
            for (var r = i.description.replace(/([a-zA-Z]|\s)+/, "")
                    .replace(/(\s+r|\s+b[0-9]+)/, ".")
                    .split("."), s = 0; 3 > s; ++s) e[s] = r[s] || 0
    } else {
        if (_ua.indexOf("Windows CE") >= 0)
            for (var l = !0, r = 6; l;) try {
                ++r, l = new ActiveXObject(t + "." + r), e[0] = r
            } catch (c) {} else try {
                var l = new ActiveXObject(t + ".7");
                e = l.GetVariable("$version")
                    .split(" ")[1].split(",")
            } catch (c) {}
        o = "object", n = 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '
    }
    browser.flashwrap = "embed" == o ? function(e, t) {
        t = extend({
            id: e.id,
            name: e.id,
            width: e.width,
            height: e.height,
            style: e.style,
            preventhide: e.preventhide
        }, t), browser.flash >= e.version ? t.src = e.url : t.src = e.express;
        var o = [];
        for (var i in t) {
            var r = t[i];
            void 0 !== r && null !== r && o.push(i + '="' + a(r) + '" ')
        }
        return "<embed " + n + o.join("") + "/>"
    } : function(e, t) {
        browser.flash >= e.version ? t.movie = e.url : t.movie = e.express;
        var o = {
                id: e.id,
                width: e.width,
                height: e.height,
                style: e.style,
                preventhide: e.preventhide
            },
            i = [];
        for (var r in o) {
            var s = o[r];
            void 0 !== s && null !== s && i.push(r + '="' + a(s) + '" ')
        }
        var l = [];
        for (var r in t) {
            var s = t[r];
            void 0 !== s && null !== s && l.push('<param name="' + r + '" value="' + a(s) + '" />')
        }
        return "<object " + n + i.join("") + ">" + l.join("") + "</object>"
    }, e[0] < 7 && (e = [0, 0, 0]), browser.flash = intval(e[0]), browser.flashfull = {
        major: browser.flash,
        minor: intval(e[1]),
        rev: intval(e[2])
    }, setCookie("remixflash", intval(e[0]) + "." + intval(e[1]) + "." + intval(e[2]), 30)
}(), browser.android && (setCookie("remixscreen_width", window.screen.width, 365), setCookie("remixscreen_height", window.screen.height, 365), setCookie("remixscreen_dpr", window.devicePixelRatio ||
        1, 365)), setCookie("remixscreen_depth", screen.pixelDepth ? screen.pixelDepth : screen.colorDepth, 365), browser.msie6 || delete StaticFiles["ie6.css"], browser.msie7 ||
    delete StaticFiles["ie7.css"];
for (var i in StaticFiles) {
    var f = StaticFiles[i];
    f.t = -1 != i.indexOf(".css") ? "css" : "js", f.n = i.replace(/[\/\.]/g, "_"), f.l = 0, f.c = 0
}
window.locHost = location.host, window.locProtocol = location.protocol, window.__dev = /[a-z0-9_\-]+\.[a-z0-9_\-]+\.[a-z0-9_\-]+\.[a-z0-9_\-]+/i.test(locHost), __dev || (
        __debugMode = !1), window.locHash = location.hash.replace("#/", "")
    .replace("#!", ""), window.locBase = location.toString()
    .replace(/#.+$/, "");
var _logTimer = (new Date)
    .getTime();
window.cf = function(e) {
    var t = e.createDocumentFragment(),
        o = e.createElement("div"),
        n = e.createRange && e.createRange();
    return t.appendChild(o), n && n.selectNodeContents(o), n && n.createContextualFragment ? function(t) {
        return t ? n.createContextualFragment(t) : e.createDocumentFragment()
    } : function(t) {
        if (!t) return e.createDocumentFragment();
        o.innerHTML = t;
        for (var n = e.createDocumentFragment(); o.firstChild;) n.appendChild(o.firstChild);
        return n
    }
}(document);
var hfTimeout = 0;
Function.prototype.pbind = function() {
    var e = Array.prototype.slice.call(arguments);
    return e.unshift(window), this.bind.apply(this, e)
}, Function.prototype.rpbind = function() {
    var e = Array.prototype.slice.call(arguments);
    return e.unshift(window), this.rbind.apply(this, e)
}, Function.prototype.rbind = function() {
    var e = this,
        t = Array.prototype.slice.call(arguments),
        o = t.shift(),
        n = t.shift();
    return function() {
        var a = Array.prototype.slice.call(arguments);
        return e.apply(o, t.concat(a)), n
    }
}, Function.prototype.bind || (Function.prototype.bind = function() {
    var e = this,
        t = Array.prototype.slice.call(arguments),
        o = t.shift();
    return function() {
        var n = Array.prototype.slice.call(arguments);
        return e.apply(o, t.concat(n))
    }
}), window.whitespaceRegex = /[\t\r\n\f]/g;
var vkExpand = "VK" + vkNow(),
    vkUUID = 0,
    vkCache = {},
    Fx = {
        Transitions: {
            linear: function(e, t, o, n) {
                return o * e / n + t
            },
            sineInOut: function(e, t, o, n) {
                return -o / 2 * (Math.cos(Math.PI * e / n) - 1) + t
            },
            halfSine: function(e, t, o, n) {
                return o * Math.sin(Math.PI * (e / n) / 2) + t
            },
            easeOutBack: function(e, t, o, n) {
                var a = 1.70158;
                return o * ((e = e / n - 1) * e * ((a + 1) * e + a) + 1) + t
            },
            easeInCirc: function(e, t, o, n) {
                return -o * (Math.sqrt(1 - (e /= n) * e) - 1) + t
            },
            easeOutCirc: function(e, t, o, n) {
                return o * Math.sqrt(1 - (e = e / n - 1) * e) + t
            },
            easeInQuint: function(e, t, o, n) {
                return o * (e /= n) * e * e * e * e + t
            },
            easeOutQuint: function(e, t, o, n) {
                return o * ((e = e / n - 1) * e * e * e * e + 1) + t
            },
            easeOutCubic: function(e, t, o, n) {
                return o * ((e = e / n - 1) * e * e + 1) + t
            },
            swiftOut: function(e, t, o, n) {
                return o * cubicBezier(.4, 0, .22, 1, e / n, 4 / n) + t
            }
        },
        Attrs: [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity", "left", "top"]
        ],
        Timers: [],
        TimerId: null
    },
    fx = Fx;
Fx.Base = function(e, t, o) {
    this.el = ge(e), this.name = o, this.options = extend({
        onStep: function() {},
        onComplete: function() {},
        transition: t.transition || Fx.Transitions.sineInOut,
        duration: 500
    }, t || {})
}, each({
    slideDown: genFx("show", 1),
    slideUp: genFx("hide", 1),
    slideToggle: genFx("toggle", 1),
    fadeIn: {
        opacity: "show"
    },
    fadeOut: {
        opacity: "hide"
    },
    fadeToggle: {
        opacity: "toggle"
    }
}, function(e, t) {
    window[e] = function(e, o, n) {
        return animate(e, t, o, n)
    }
}), Fx.Base.prototype = {
    start: function(e, t) {
        function o(e) {
            return n.step(e)
        }
        this.from = e, this.to = t, this.time = vkNow(), this.isTweening = !0;
        var n = this;
        return o.el = this.el, o() && Fx.Timers.push(o) && !Fx.TimerId && (Fx.TimerId = setInterval(function() {
            for (var e = Fx.Timers, t = e.length, o = 0; t > o; o++) e[o]() || (e.splice(o--, 1), t--);
            t || (clearInterval(Fx.TimerId), Fx.TimerId = null)
        }, 13)), this
    },
    stop: function(e) {
        for (var t = Fx.Timers, o = t.length - 1; o >= 0; o--) t[o].el == this.el && (e && t[o](!0), t.splice(o, 1));
        this.isTweening = !1
    },
    step: function(e) {
        var t = vkNow();
        if (!e && t < this.time + this.options.duration) {
            this.cTime = t - this.time, this.now = {};
            for (p in this.to)
                if (isArray(this.to[p])) {
                    var o, n = [];
                    for (o = 0; 3 > o; o++) {
                        if (void 0 === this.from[p] || void 0 === this.to[p]) return !1;
                        n.push(Math.min(parseInt(this.compute(this.from[p][o], this.to[p][o])), 255))
                    }
                    this.now[p] = n
                } else this.now[p] = this.compute(this.from[p], this.to[p]), this.options.discrete && (this.now[p] = intval(this.now[p]));
            return this.update(), !0
        }
        return setTimeout(this.options.onComplete.bind(this, this.el), 10), this.now = extend(this.to, this.options.orig), this.update(), this.options.hide && hide(this.el),
            this.isTweening = !1, !1
    },
    compute: function(e, t) {
        var o = t - e;
        return this.options.transition(this.cTime, e, o, this.options.duration)
    },
    update: function() {
        this.options.onStep(this.now);
        for (var e in this.now) isArray(this.now[e]) ? setStyle(this.el, e, "rgb(" + this.now[e].join(",") + ")") : void 0 != this.el[e] ? this.el[e] = this.now[e] :
            setStyle(this.el, e, this.now[e])
    },
    cur: function(e, t) {
        return null == this.el[e] || this.el.style && null != this.el.style[e] ? parseFloat(getStyle(this.el, e, t)) || 0 : this.el[e]
    }
};
var KEY = window.KEY = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DEL: 8,
    TAB: 9,
    RETURN: 13,
    ENTER: 13,
    ESC: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    SPACE: 32
};
addEvent(window, "unload", function() {
    for (var e in vkCache) vkCache[e].handle && vkCache[e].handle.elem != window && removeEvent(vkCache[e].handle.elem)
}), addEvent(window, "DOMContentLoaded load", function() {
    vk.loaded || (vk.loaded = !0, updSideTopLink()), checkPageBlocks()
}), addEvent(window, "mouseup dragstart", tnInactive), addEvent(document, "mouseup dragstart", tnInactive), __debugMode && addEvent(document, "keydown", function(e) {
    120 != e.keyCode || e.charCode || showFastBox({
        title: "Debug"
    }, __checkData())
}), addEvent(document, "mousedown", function(e) {
    _wf = 1, cur.__mdEvent = e
});
var _layerAnim = !1,
    layers = {
        sh: !_layerAnim || browser.msie || browser.iphone ? function(e, t) {
            show(e), t && t()
        } : function(e, t) {
            fadeIn(e, 200, t)
        },
        hd: !_layerAnim || browser.msie || browser.iphone ? function(e, t) {
            hide(e), t && t()
        } : function(e, t) {
            fadeOut(e, 200, t)
        },
        visible: !1,
        _show: function(e, t, o, n) {
            setStyle(e, {
                    opacity: o || "",
                    backgroundColor: n || ""
                }), layers.visible || (toggleFlash(), browser.mozilla ? (window._oldScroll = htmlNode.scrollTop, pageNode.style.height = _oldScroll + (window.lastWindowHeight ||
                    0) + "px", pageNode.style.marginTop = -_oldScroll + "px") : browser.msie6 || ((browser.msie7 ? htmlNode : bodyNode)
                    .style.overflow = "hidden")), layers.visible = !0, addClass(bodyNode, "layers_shown"), t.visibilityHide ? removeClass(t, "box_layer_hidden") : show(t),
                layers.sh(e), pauseLastInlineVideo(), window.updateWndVScroll && updateWndVScroll()
        },
        _hide: function(e, t) {
            var o = function() {
                t && t.visibilityHide ? addClass(t, "box_layer_hidden") : hide(t), isVisible(layerWrap) || cur._inLayer || isVisible(boxLayerWrap) && !boxLayerWrap.visibilityHide ||
                    !(window.mvcur && mvcur.minimized || !isVisible(window.mvLayerWrap)) || isVisible(window.wkLayerWrap) || (layers.visible = !1, removeClass(bodyNode,
                        "layers_shown"), toggleFlash(!0), browser.mozilla ? (pageNode.style.height = "auto", pageNode.style.marginTop = "0px", window._oldScroll && (
                        htmlNode.scrollTop = _oldScroll)) : browser.msie6 || ((browser.msie7 ? htmlNode : bodyNode)
                        .style.overflow = "auto")), window.updateWndVScroll && updateWndVScroll()
            };
            layers.hd(e, o)
        }
    },
    __lq = layerQueue = {
        push: function(e) {
            var t, o = __lq.count() ? __lq._layers[__lq._layers.length - 1] : !1;
            if (cur.pvShown && "temp" != cur.pvListId) t = ["photo", cur.pvData[cur.pvListId][cur.pvIndex].id, cur.pvListId, {
                onHide: cur.pvOptions.onHide,
                scroll: layerWrap.scrollTop,
                onShow: e,
                noHistory: !!cur.pvNoHistory,
                histLen: cur.pvHistoryLength
            }];
            else if (window.mvcur && mvcur.mvShown && !mvcur.minimized) {
                var n = {
                    scroll: mvLayerWrap.scrollTop,
                    noHistory: !!mvcur.noHistory,
                    nomin: !0,
                    prevLoc: mvcur.mvPrevLoc
                };
                VideoPlaylist.getCurListId() && (n = extend(n, {
                    playlistId: VideoPlaylist.getCurListId(),
                    module: Videoview.getVideoModule(),
                    addParams: {
                        force_no_repeat: 1,
                        show_next: 1
                    }
                })), t = ["video", mvcur.videoRaw, mvcur.listId, n]
            } else {
                if (!window.wkcur || !wkcur.shown) return !1;
                t = ["wiki", wkcur.wkRaw, !1, {
                    toScroll: wkLayerWrap.scrollTop,
                    prevLoc: wkcur.prevLoc,
                    myLoc: wkcur.myLoc
                }]
            }
            return o && t[0] == o[0] && t[1] == o[1] && t[2] == o[2] || __lq._layers.push(t), __lq.skipVideo = !1, !0
        },
        noHistory: function() {
            for (var e = __lq._layers, t = e.length; t > 0; --t) "photo" == e[t - 1][0] ? e[t - 1][3].noHistory = 1 : "video" == e[t - 1][0] && (e[t - 1][3].noHistory = 1)
        },
        hide: function() {
            __lq._bl = !0, window.WkView && layers.fullhide == WkView.hide ? (hide(wkLayerWrap), clearTimeout(wkcur.showT)) : layers.fullhide && layers.fullhide(!0, !0),
                setTimeout(layerQueue.unblock, 5)
        },
        unblock: function() {
            __lq._bl = !1
        },
        pop: function() {
            if (__lq.count() && !__lq._bl) {
                var e = __lq._layers.pop();
                return __lq.skipVideo && (__lq.skipVideo = !1, "video" == e[0]) ? (__lq._layers.push(e), void(__lq.skipVideo = !1)) : void("photo" == e[0] ? (extend(e[3], {
                    fromQueue: !0
                }), showPhoto(e[1], e[2], e[3], !1)) : "video" == e[0] ? (extend(e[3], {
                    fromQueue: !0
                }), showVideo(e[1], e[2], e[3], !1)) : "wiki" == e[0] && showWiki({
                    w: e[1]
                }, !1, !1, e[3]))
            }
        },
        back: function(e, t, o, n) {
            for (var a = __lq._layers, i = a.length; i > 0; --i)
                if (a[i - 1][0] == e && a[i - 1][1] == t || a[i - 1][0] == o && a[i - 1][1] == n) return __lq._layers = a.slice(0, i), __lq.pop(), !0;
            return !1
        },
        count: function() {
            return __lq._layers.length
        },
        clear: function() {
            __lq._layers = []
        },
        _layers: []
    };
window.__seenAds = intval(getCookie("remixseenads")), window.__scrLeft = 0, window.__adsLoaded = vkNow(), window._pads || (_pads = {
        cache: {}
    }), window._iconAdd = window.devicePixelRatio >= 2 ? "_2x" : "",
    function() {
        var e, t, o = 1,
            n = !1;
        browser.mozilla ? n = function() {
            setFavIcon("/images/icons/prgicon.gif")
        } : (browser.chrome || browser.opera && !browser.opera_mobile) && (n = function() {
            o = o % 4 + 1, setFavIcon("/images/icons/prgicon" + o + ".gif"), e = setTimeout(arguments.callee, 250)
        }), window.showTitleProgress = function(o) {
            return browser.mozilla || browser.chrome ? void 0 : o > 0 ? void(t = setTimeout(showTitleProgress.pbind(!1), o)) : void(e || (document.body && (document.body.style
                .cursor = "progress"), n && n()))
        }, window.hideTitleProgress = function() {
            browser.mozilla || browser.chrome || (clearTimeout(t), document.body.style.cursor = "default", e && (clearTimeout(e), e = !1), (browser.mozilla || browser.chrome ||
                browser.opera && !browser.opera_mobile) && setFavIcon("/images/favicon" + (vk.intnat ? "_vk" : "new") + _iconAdd + ".ico?" + stVersions.favicon))
        }
    }(), vk.width = 960, vk.started = vkNow();
var PageID = 1,
    NextPageID = 1,
    stManager = {
        _waiters: [],
        _wait: function() {
            var e = __stm._waiters.length,
                t = {},
                o = [];
            if (!e) return clearInterval(__stm._waitTimer), void(__stm._waitTimer = !1);
            for (var n = 0; e > n; ++n) {
                for (var a = __stm._waiters[n][0], i = 0, r = a.length; r > i; ++i) {
                    var s = a[i];
                    if (!t[s])
                        if (StaticFiles[s].l || "css" != StaticFiles[s].t || "none" != getStyle(StaticFiles[s].n, "display") || __stm.done(s), StaticFiles[s].l) t[s] = 1;
                        else if (t[s] = -1, vk.loaded) {
                        var l = ++StaticFiles[s].c;
                        (l > __stm.lowlimit && stVersions[s] > 0 || l > __stm.highlimit) && (stVersions[s] < 0 ? (topError("<b>Error:</b> Could not load <b>" + s + "</b>.", {
                            dt: 5,
                            type: 1,
                            msg: "Failed to load with " + __stm.lowlimit + "/" + __stm.highlimit + " limits (" + (vkNow() - vk.started) / 100 + " ticks passed)",
                            file: s
                        }), StaticFiles[s].l = 1, t[s] = 1) : (topMsg("Some problems with loading <b>" + s + "</b>...", 5), stVersions[s] = irand(-1e4, -1), __stm._add(s,
                            StaticFiles[s])))
                    }
                    t[s] > 0 && (a.splice(i, 1), --i, --r)
                }
                a.length || (o.push(__stm._waiters.splice(n, 1)[0][1]), --n, --e)
            }
            for (var n = 0, e = o.length; e > n; ++n) o[n]()
        },
        _addCss: function(e) {
            var t = headNode.appendChild(ce("style", {
                type: "text/css",
                media: "screen"
            }));
            t.sheet ? t.sheet.insertRule(e, 0) : t.styleSheet && (t.styleSheet.cssText = e)
        },
        _srcPrefix: function(e, t) {
            if (!vk.stDomains || __dev || -1 == e.indexOf(".js") && -1 == e.indexOf(".css") || -1 != e.indexOf("lang") || -1 != e.indexOf("dyn-") || -1 != e.indexOf(
                    "loader_nav") || "https:" == location.protocol) return "";
            if (-1 != e.indexOf(".css")) return "http://st0.vk.me";
            e = e.replace(/[^a-z\d\.\-_]/gi, "");
            var o, n = intval(t),
                a = e.length;
            for (o = 0; a > o; o++) n += e.charCodeAt(o);
            return "http://st" + (n % vk.stDomains + 1) + ".vk.me"
        },
        _add: function(e, t) {
            var o = e.replace(/[\/\.]/g, "_"),
                n = stVersions[e],
                a = e + "?" + n,
                i = stManager._srcPrefix(e, n);
            if (t && t.l && "css" == t.t && __stm._addCss("#" + o + " {display: block; }"), StaticFiles[e] = {
                    v: n,
                    n: o,
                    l: 0,
                    c: 0
                }, -1 != e.indexOf(".js")) {
                var r = "/js/";
                stTypes.fromLib[e] ? r += "lib/" : /^lang\d/i.test(e) || stTypes.fromRoot[e] || -1 != e.indexOf("/") || (r += "al/"), StaticFiles[e].t = "js", "common.js" == e ?
                    setTimeout(stManager.done.bind(stManager)
                        .pbind("common.js"), 0) : headNode.appendChild(ce("script", {
                        type: "text/javascript",
                        src: i + r + a
                    }))
            } else if (-1 != e.indexOf(".css")) {
                var r = "/css/" + (vk.css_dir || "") + (stTypes.fromRoot[e] || -1 != e.indexOf("/") ? "" : "al/");
                headNode.appendChild(ce("link", {
                    type: "text/css",
                    rel: "stylesheet",
                    href: i + r + a
                })), StaticFiles[e].t = "css", ge(o) || utilsNode.appendChild(ce("div", {
                    id: o
                }))
            }
        },
        add: function(e, t, o) {
            var n = [],
                a = document.documentElement;
            isArray(e) || (e = [e]);
            for (var i in e) {
                var r = e[i]; - 1 != r.indexOf("?") && (r = r.split("?")[0]), /^lang\d/i.test(r) ? stVersions[r] = stVersions.lang : stVersions[r] || (stVersions[r] = 1);
                var s = browser.opera && 768 == a.clientHeight && 1024 == a.clientWidth;
                (s || __debugMode) && !browser.iphone && !browser.ipad && "common.js" != r && "common.css" != r && stVersions[r] > 0 && stVersions[r] < 1e9 && (stVersions[r] +=
                    irand(1e9, 2e9));
                var l = StaticFiles[r];
                l && l.v == stVersions[r] || __stm._add(r, l), t && !StaticFiles[r].l && n.push(r)
            }
            if (t) {
                if (!n.length) return o === !0 ? setTimeout(t, 0) : t();
                __stm._waiters.push([n, t]), __stm._waitTimer || (__stm._waitTimer = setInterval(__stm._wait, 100))
            }
        },
        done: function(e) {
            stVersions[e] < 0 && topMsg('<b>Warning:</b> Something is bad, please <b><a href="/page-777107_43991681">clear your cache</a></b> and restart your browser.', 10),
                StaticFiles[e].l = 1
        }
    },
    __stm = stManager,
    ajaxCache = {},
    globalAjaxCache = {},
    iframeTO = 0,
    ajax = {
        _init: function() {
            var e = !1;
            try {
                if (e = new XMLHttpRequest) return void(ajax._req = function() {
                    return new XMLHttpRequest
                })
            } catch (t) {}
            each(["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"], function() {
                try {
                    var t = "" + this;
                    if (e = new ActiveXObject(t)) return function(e) {
                        ajax._req = function() {
                            return new ActiveXObject(e)
                        }
                    }(t), !1
                } catch (o) {}
            }), ajax._req || browser.search_bot || location.replace("/badbrowser.php")
        },
        _getreq: function() {
            return ajax._req || ajax._init(), ajax._req()
        },
        _frameover: function(e, t) {
            var o = iframeTransport.parentNode;
            o.innerHTML = "", utilsNode.removeChild(o), iframeTransport = !1, (e || t) && ajax.framegot(!1, !1, e, t), ajax.framegot(!1), cur.onFrameBlocksDone && cur.onFrameBlocksDone(),
                ajax.tOver = (new Date)
                .getTime()
        },
        _receive: function(cont, html, js, bench, params) {
            var c = cont && ge(cont);
            if (c && html && (c.firstChild ? c.appendChild(cf(html)) : val(c, html)), js) {
                var scr = "(function(){" + js + ";})()";
                if (__debugMode) eval(scr);
                else try {
                    eval(scr)
                } catch (e) {
                    topError(e, {
                        dt: 15,
                        type: 8,
                        url: ajax._frameurl,
                        js: js,
                        answer: Array.prototype.slice.call(arguments)
                            .join("<!>")
                    })
                }
                bench && (ajax.tModule = cur.module)
            }
            params && "leftads" in params && __adsSet(params.leftads, params.ads_section || "", params.ads_can_show, params.ads_showed), ajax._framenext()
        },
        framedata: !1,
        _framenext: function() {
            if ((ajax.framedata || {})
                .length) {
                var e = ajax.framedata.shift();
                e === !0 ? ajax._framenext() : e === !1 ? (ajax.framedata = !1, cur.onFrameBlocksDone && cur.onFrameBlocksDone()) : iframeTO = lTimeout(ajax._receive.pbind(e[0],
                    e[1], e[2], !0, e[3]), 0)
            }
        },
        framegot: function(e, t, o, n) {
            ajax.framedata && (ajax.framedata.push(void 0 === t && void 0 === o && void 0 === n ? e : [e, t, o, n]), 1 == ajax.framedata.length && ajax._framenext())
        },
        framepost: function(e, t, o) {
            clearTimeout(iframeTO), window.iframeTransport && ajax._frameover(), window.iframeTransport = utilsNode.appendChild(ce("div", {
                    innerHTML: "<iframe></iframe>"
                }))
                .firstChild, ajax._framedone = o, ajax.framedata = [!0], e += "?" + ("string" != typeof t ? ajx2q(t) : t), e += ("?" != e.charAt(e.length - 1) ? "&" : "") +
                "_rndVer=" + irand(0, 99999), ajax._frameurl = iframeTransport.src = e
        },
        plainpost: function(e, t, o, n, a) {
            var i = ajax._getreq(),
                r = "string" != typeof t ? ajx2q(t) : t;
            i.onreadystatechange = function() {
                4 == i.readyState && (i.status >= 200 && i.status < 300 ? o && o(i.responseText, i) : n && n(i.responseText, i))
            };
            try {
                i.open("POST", e, !0)
            } catch (s) {
                return !1
            }
            return a || (i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), i.setRequestHeader("X-Requested-With", "XMLHttpRequest")), i.send(r), i
        },
        post: function(e, t, o) {
            "/" != e.substr(0, 1) && "http" != e.substr(0, 4) && (e = "/" + e);
            var n = extend({
                    _captcha: !1,
                    _box: !1
                }, o || {}),
                a = extend({
                    al: n.frame ? -1 : 1
                }, t),
                i = vkNow(),
                r = vk.spentLastSendTS ? Math.round((i - vk.spentLastSendTS) / 1e3) : 0;
            return vk.sampleUser >= 0 && cur.module && r >= 1 && (window.curNotifier && curNotifier.idle_manager && !curNotifier.idle_manager.is_idle && (a = extend({
                _smt: cur.module + ":" + r
            }, a)), vk.spentLastSendTS = i), n.progress && (n.showProgress || (n.showProgress = function() {
                var e = ge(n.progress);
                hasClass(e, "pr") && setStyle(e, "opacity", 1), show(e)
            }), n.hideProgress || (n.hideProgress = function() {
                var e = ge(n.progress);
                hasClass(e, "pr") && setStyle(e, "opacity", 0), hide(e)
            })), n.loader && (n.showProgress = function() {
                boxRefreshCoords(boxLoader), show(boxLoader), show(boxLayerWrap)
            }, n.hideProgress = function() {
                hide(boxLoader), hide(boxLayerWrap)
            }), ajax._post(e, a, n)
        },
        preload: function(e, t, o) {
            "/" != e.substr(0, 1) && (e = "/" + e), ajaxCache[e + "#" + ajx2q(t)] = o
        },
        invalidate: function(e, t) {
            void 0 === e ? ajaxCache = {} : delete ajaxCache[ajax._getCacheKey(e, t)]
        },
        _getCacheKey: function(e, t) {
            var o = clone(t);
            return delete o.al, delete o.al_ad, delete o.ads_section, delete o.ads_showed, delete o.captcha_sid, delete o.captcha_key, delete o._smt, delete o._preload, e +
                "#" + ajx2q(o)
        },
        _debugLog: function(e, t) {
            window.debuglogGot && debuglogGot(t, e)
        },
        _parseRes: function(e, t) {
            window._updateDebug = !1;
            for (var o = e.length - 1; o >= 0; --o) {
                var n = e[o];
                if ("<!" == n.substr(0, 2)) {
                    var a = n.indexOf(">"),
                        i = n.substr(2, a - 2);
                    switch (n = n.substr(a + 1), i) {
                        case "json":
                            e[o] = parseJSON(n);
                            break;
                        case "int":
                            e[o] = intval(n);
                            break;
                        case "float":
                            e[o] = floatval(n);
                            break;
                        case "bool":
                            e[o] = intval(n) ? !0 : !1;
                            break;
                        case "null":
                            e[o] = null;
                            break;
                        case "pageview_candidate":
                            e.pop();
                            break;
                        case "debug":
                            ajax._debugLog(n, t), e.pop()
                    }
                }
            }
        },
        _post: function(url, q, o) {
            !q.captcha_sid && o.showProgress && o.showProgress();
            var cacheKey = !1;
            extend(q, __adsGetAjaxParams(q, o)), o.cache && (cacheKey = ajax._getCacheKey(url, q));
            var hideBoxes = function() {
                    for (var e = 0, t = arguments.length; t > e; ++e) {
                        var o = arguments[e];
                        o && o.isVisible() && (o.setOptions({
                            onHide: !1,
                            onDestroy: !1
                        }), o.hide())
                    }
                    return !1
                },
                fail = function(e, t) {
                    return o.hideProgress && o.hideProgress(), o._suggest && cleanElems(o._suggest), o._suggest = o._captcha = o._box = hideBoxes(o._captcha, o._box), -1 != e.indexOf(
                        "The page is temporarily unavailable") && __dev ? (ajax._post(url, q, o), !1) : void(o.onFail && o.onFail(e) === !0 || topError(e, {
                        dt: 5,
                        type: 3,
                        status: t.status,
                        url: url,
                        query: q && ajx2q(q)
                    }))
                };
            if (o.local && (fail = vkLocal(fail)), o.stat) {
                var statAct = !1;
                stManager.add(o.stat, function() {
                    statAct && statAct(), o.stat = !1
                })
            }
            var processResponse = function(code, answer) {
                if (o.cache) {
                    var answ = ajaxCache[cacheKey];
                    answ && answ._loading && (setTimeout(function() {
                        for (var e in answ._callbacks) answ._callbacks[e](code, answer)
                    }, 0), delete ajaxCache[cacheKey])
                }
                if (o.stat) return o.stat = !1, statAct = processResponse.pbind(code, answer), !1;
                switch (o.cache && !o.forceGlobalCache && (code || (ajaxCache[cacheKey] = answer)), o.hideProgress && o.hideProgress(), 2 != code && (o._captcha && (o._suggest &&
                    cleanElems(o._suggest), o._suggest = o._captcha = hideBoxes(o._captcha)), o._box = hideBoxes(o._box)), code) {
                    case 1:
                        ge("confirm_mail") ? showFastBox({
                                width: 430,
                                title: ge("confirm_mail_title")
                                    .value,
                                onDestroy: o.onFail
                            }, '<div class="confirm_mail">' + ge("confirm_mail")
                            .innerHTML + "</div>") : topMsg("<b>Error!</b> Email is not confirmed!");
                        break;
                    case 2:
                        var resend = function(e, t) {
                                var n = extend(q, {
                                        captcha_sid: e,
                                        captcha_key: t
                                    }),
                                    a = o.cache ? extend(o, {
                                        cache: -1
                                    }) : o;
                                ajax._post(url, n, a)
                            },
                            addText = "";
                        o._captcha = showCaptchaBox(answer[0], intval(answer[1]), o._captcha, {
                            onSubmit: resend,
                            addText: addText,
                            onDestroy: function() {
                                o.onFail && o.onFail()
                            }
                        }), o._suggest = geByClass1("phone_validation_link", o._captcha.bodyNode), o._suggest && addEvent(o._suggest, "click", function() {
                            o._box = validateMobileBox({
                                onDone: o._captcha.submit
                            })
                        });
                        break;
                    case 11:
                    case 12:
                        var no = o.cache ? extend(o, {
                            cache: -1
                        }) : o;
                        o._box = validateMobileBox({
                            acceptCaptcha: 11 == code,
                            onDone: function(e, t) {
                                vk.nophone = 0, e && (o._captcha = curBox()), ajax._post(url, e ? extend(q, {
                                    captcha_sid: e,
                                    captcha_key: t
                                }) : q, no)
                            },
                            onFail: o.onFail,
                            hash: answer[0]
                        });
                        break;
                    case 14:
                        var no = o.cache ? extend(o, {
                            cache: -1
                        }) : o;
                        o._box = photoCaptchaBox({
                            onDone: ajax._post.pbind(url, q, no),
                            onFail: o.onFail
                        });
                        break;
                    case 15:
                        var no = o.cache ? extend(o, {
                            cache: -1
                        }) : o;
                        o._box = validatePassBox({
                            onDone: ajax._post.pbind(url, q, no),
                            onFail: o.onFail,
                            hash: answer[0]
                        });
                        break;
                    case 3:
                        var no = o.cache ? extend(o, {
                            cache: -1
                        }) : o;
                        window.onReLoginDone = ajax._post.pbind(url, q, no), window.onReLoginFailed = function(e) {
                            -1 === e ? location.href = location.href.replace(/^http:/, "https:") : e ? nav.go("/") : window.onReLoginDone()
                        }, utilsNode.appendChild(ce("iframe", {
                            src: vk.loginscheme + "://login.vk.com/?" + ajx2q({
                                role: "al_frame",
                                _origin: locProtocol + "//" + locHost,
                                ip_h: answer[0] || vk.ip_h
                            })
                        }));
                        break;
                    case 4:
                        intval(answer[1]) ? nav.go(answer[0], !1, {
                            nocur: "2" === answer[1],
                            noback: answer[1] === !0 ? !0 : !1,
                            showProgress: o.showProgress,
                            hideProgress: o.hideProgress
                        }) : (hab.stop(), location.href = answer[0]);
                        break;
                    case 5:
                        nav.reload({
                            force: intval(answer[0]),
                            from: 1,
                            url: url,
                            query: q && ajx2q(q)
                        });
                        break;
                    case 6:
                        var no = o.cache ? extend(o, {
                            cache: -1
                        }) : o;
                        o._box = activateMobileBox({
                            onDone: ajax._post.pbind(url, q, no),
                            onFail: o.onFail,
                            hash: answer[0]
                        });
                        break;
                    case 7:
                        o.onFail && o.onFail(), topMsg(answer[0], 10);
                        break;
                    case 8:
                        if (o.onFail && o.onFail(answer[0])) return;
                        topError(answer[0] + (answer[2] ? " #" + answer[2] : ""), {
                            dt: answer[1] ? 0 : 10,
                            type: 4,
                            url: url,
                            query: q && ajx2q(q)
                        });
                        break;
                    case 9:
                        if ((o.fromBox || o.forceDone) && (o.onDone && o.onDone.apply(window, answer), o.fromBox)) break;
                        o._box = showFastBox({
                            title: trim(answer[0])
                        }, answer[1]);
                        var no = extend(clone(o), {
                            showProgress: o._box.showProgress,
                            hideProgress: o._box.hideProgress
                        });
                        o.cache && (no.cache = -1), o._box = requestBox(o._box, function(e) {
                            isVisible(o._box.progress) || (e || (e = {
                                _votes_ok: 1
                            }), ajax._post(url, extend(q, e), no))
                        }, o.onFail), o._box.evalBox(answer[2]);
                        break;
                    case 10:
                        o._box = showFastBox({
                            title: answer[0] || getLang("global_charged_zone_title"),
                            onHide: o.onFail
                        }, answer[1], getLang("global_charged_zone_continue"), function() {
                            var e = extend(q, {
                                charged_confirm: answer[3]
                            });
                            ajax._post(url, e, o)
                        }, getLang("global_cancel"));
                        break;
                    case 13:
                        eval("(function(){" + answer[0] + ";})()");
                        break;
                    default:
                        if (-1 == code || -2 == code) {
                            var adsShowed = answer.pop(),
                                adsCanShow = answer.pop(),
                                adsHtml = answer.pop();
                            __adsSet(adsHtml, null, adsCanShow, adsShowed)
                        }
                        o.onDone && o.onDone.apply(window, answer)
                }
                window._updateDebug && _updateDebug()
            };
            o.local && (processResponse = vkLocal(processResponse));
            var done = function(e, t) {
                o.bench && (ajax.tDone = (new Date)
                        .getTime()), e = e.replace(/^<!--/, "")
                    .replace(/-<>-(!?)>/g, "--$1>"), trim(e)
                    .length || (t = [8, getLang("global_unknown_error")], e = stVersions.nav + "<!><!>" + vk.lang + "<!>" + stVersions.lang + "<!>8<!>" + t[1]);
                var n = e.split("<!>"),
                    a = intval(n.shift());
                if (!a) return fail("<pre>" + e + "</pre>", {
                    status: -1
                });
                if (vk.version && vk.version != a) return void(a && n.length > 4 ? nav.reload({
                    force: !0,
                    from: 2,
                    url: url,
                    query: q && ajx2q(q)
                }) : nav.strLoc ? location.replace(locBase) : topError("Server error.", {
                    type: 100
                }));
                vk.version = !1;
                var i = n.shift(),
                    r = intval(n.shift()),
                    s = intval(n.shift());
                o.frame && (n = t);
                var l = intval(n.shift());
                if (vk.lang != r && o.canReload) return void nav.reload({
                    force: !0,
                    from: 3,
                    url: url,
                    query: q && ajx2q(q)
                });
                var c = function() {
                    var e = ["common.css"];
                    if (browser.msie6 ? e.push("ie6.css") : browser.msie7 && e.push("ie7.css"), i) {
                        i = i.split(",");
                        for (var t = 0, a = i.length; a > t; ++t) e.push(i[t])
                    }
                    if (stVersions.lang < s) {
                        stVersions.lang = s;
                        for (var t in StaticFiles) /^lang\d/i.test(t) && e.push(t)
                    }
                    if (!o.frame) try {
                        ajax._parseRes(n, o._reqid)
                    } catch (r) {
                        topError("<b>JSON Error:</b> " + r.message, {
                            type: 5,
                            answer: n.join("<!>"),
                            url: url,
                            query: q && ajx2q(q)
                        })
                    }
                    stManager.add(e, processResponse.pbind(l, n))
                };
                return a <= stVersions.nav ? c() : (headNode.appendChild(ce("script", {
                    type: "text/javascript",
                    src: "/js/loader_nav" + a + "_" + vk.lang + ".js"
                })), void setTimeout(function() {
                    return a <= stVersions.nav ? c() : void setTimeout(arguments.callee, 100)
                }, 0))
            };
            if (o.local && (done = vkLocal(done)), o.cache > 0 || o.forceGlobalCache) {
                var answer = ajaxCache[cacheKey];
                if (answer && answer._loading) return void answer._callbacks.push(processResponse);
                if (answer && !o.forceGlobalCache) return processResponse(0, answer), void(3 === o.cache && delete ajaxCache[cacheKey]);
                if (answer = globalAjaxCache[cacheKey]) return -1 == answer || isFunction(answer) ? globalAjaxCache[cacheKey] = o.onDone : o.onDone.apply(window, answer), void(
                    o.hideProgress && o.hideProgress())
            }
            return ajaxCache[cacheKey] = {
                _loading: 1,
                _callbacks: []
            }, window.debuglogSent ? (o._reqid = debuglogSent(url + (q ? ": " + ajx2q(q)
                .replace(/&/g, "&amp;") : "")), o.frame && (window._lfrid = o._reqid)) : o._reqid = 0, o.frame ? ajax.framepost(url, q, done) : ajax.plainpost(url, q, done,
                fail)
        },
        tGetParam: function() {
            if (ajax.tStart && ajax.tModule) {
                var e = ajax.tDone - ajax.tStart,
                    t = ajax.tProcess - ajax.tDone,
                    o = ajax.tRender - ajax.tProcess,
                    n = ajax.tOver - ajax.tStart,
                    a = [e, t, o, n, ajax.tModule];
                for (var i in a) {
                    if (a[i] < 0) return !1;
                    if (!a[i] && 0 !== a[i]) return !1
                }
                return ajax.tStart = !1, a.join(",")
            }
        }
    };
window.hab = new HistoryAndBookmarks({
    onLocChange: function(e) {
        nav.go("/" + e, void 0, {
            back: !0,
            hist: !0
        })
    }
}), vk.counts = {};
var globalHistory = [],
    nav = {
        getData: function(e) {
            if (e.length) {
                for (var t in navMap)
                    if ("<" != t[0]) {
                        var o = e.match(new RegExp("^" + t, "i"));
                        if (o) return {
                            url: navMap[t][0],
                            files: navMap[t][1]
                        }
                    }
                var o = e.match(/^[a-z0-9\-_]+\.php$/i);
                return o ? {
                    url: e
                } : {
                    url: navMap["<other>"][0],
                    files: navMap["<other>"][1]
                }
            }
            return {
                url: navMap["<void>"][0],
                files: navMap["<void>"][1]
            }
        },
        reload: function(e) {
            reloadCheckFlood(e) || (e = e || {}, e.force ? (hab.stop(), location.href = "/" + nav.strLoc) : nav.go("/" + nav.strLoc, void 0, extend({
                nocur: !0
            }, e)))
        },
        link: function(e, t) {
            if (checkEvent(t) || cur.noAjaxNav) {
                var e = e.replace(new RegExp("^(" + locProtocol + "//" + locHost + ")?/?", "i"), "");
                window.open(e)
            } else nav.go(e)
        },
        go: function(loc, ev, opts) {
            if (!checkEvent(ev) && !cur.noAjaxNav) {
                if (opts = opts || {}, loc.tagName && "a" == loc.tagName.toLowerCase()) {
                    if ("_blank" == loc.target || nav.baseBlank) return;
                    var _params = loc.getAttribute("hrefparams");
                    if (_params && (opts.params = extend(opts.params || {}, q2ajx(_params))), loc = loc.href || "", ev && !(loc || "")
                        .match(new RegExp("^" + locProtocol + "//" + locHost, "i"))) return
                }
                var strLoc = "",
                    objLoc = {},
                    changed = {};
                if ("string" == typeof loc ? (loc = loc.replace(new RegExp("^(" + locProtocol + "//" + locHost + ")?/?", "i"), ""), strLoc = loc, objLoc = nav.fromStr(loc)) :
                    (loc[0] || (loc[0] = ""), strLoc = nav.toStr(loc), objLoc = loc), statDurationsLoadImage(), statNavigationTiming(), window.AudioUtils && AudioUtils.updateCurrentPlaying(!
                        0), !opts.nocur) {
                    changed = clone(objLoc);
                    for (var i in nav.objLoc) nav.objLoc[i] == changed[i] ? delete changed[i] : void 0 === changed[i] && (changed[i] = !1);
                    if (zNav(clone(changed), {
                            hist: opts.hist,
                            asBox: opts.asBox
                        }, objLoc) === !1) return nav.setLoc(strLoc), !1
                }
                if (!opts.nocur && (vk.loaded || !changed[0]))
                    for (var curnav = cur.nav || [], i = curnav.length - 1; i >= 0; i--) {
                        var oldUrl = document.URL;
                        if (curnav[i](clone(changed), nav.objLoc, objLoc, opts) === !1) {
                            var currentURL = locProtocol + "//" + location.host + "/" + strLoc,
                                referrer = oldUrl == currentURL ? "" : oldUrl;
                            return setTimeout(updateOtherCounters.pbind(currentURL, referrer), 10), !1
                        }
                    }
                if (4 == vk.al || !vk.loaded && (!window.audioPlayer || !audioPlayer.player) && changed[0]) return setTimeout(function() {
                    location.href = "/" + (strLoc || "")
                        .replace("%23", "#")
                }, 0), !1;
                if (topHeaderClose(), opts.back) {
                    if (cur._back && cur._back.onBack) return cur._back.onBack();
                    for (var i = 0, l = globalHistory.length; l > i; ++i)
                        if (globalHistory[i].loc == strLoc) {
                            var h = globalHistory.splice(i, 1)[0],
                                wNode = ge("wrap3"),
                                tNode = ge("title"),
                                onback = cur._onback;
                            return window.tooltips && tooltips.destroyAll(), hide("audio_tip_wrap"), processDestroy(cur), radioBtns = h.radioBtns, ajaxCache = h.ajaxCache,
                                PageID = h.pid, boxQueue.hideAll(!1, !0), layerQueue.clear(), layers.fullhide && layers.fullhide(!0), showBackLink(), cur = h.cur, setTimeout(
                                    function() {
                                        if (wNode.innerHTML = "", wNode.parentNode.replaceChild(h.content, wNode), (vk.width != h.width || vk.width_dec_footer != h.width_dec_footer) &&
                                            handlePageView(h), scrollToY(h.scrollTop, 0), document.title = h.htitle, tNode.innerHTML = h.title, h.bodyClass !== bodyNode.className &&
                                            (bodyNode.className = h.bodyClass || "", vk.body_class = h.bodyClass || ""), setStyle(tNode.parentNode, "display", h.hideHeader ?
                                                "none" : "block"), cur._back.show)
                                            for (var e = 0, t = cur._back.show.length; t > e; ++e) cur._back.show[e]();
                                        if (onback)
                                            for (var e = 0, t = onback.length; t > e; ++e) onback[e]();
                                        nav.setLoc(strLoc);
                                        var o = h.back || {};
                                        setTimeout(function() {
                                            showBackLink(o[0], o[1], o[2]), (nav.objLoc.z || nav.objLoc.w) && zNav({
                                                z: nav.objLoc.z,
                                                w: nav.objLoc.w
                                            }, {}), updateSTL(), updateLeftMenu()
                                        }, 10), window.AudioUtils && AudioUtils.updateCurrentPlaying(!0)
                                    }, 10), !1
                        }
                }
                var dest = objLoc[0];
                delete objLoc[0];
                var where = nav.getData(dest);
                opts.noframe || (opts.tstat = ajax.tGetParam(), ajax.tStart = (new Date)
                    .getTime(), opts.bench = !0), opts.params && opts.params._ref || (opts.params = extend(opts.params || {}, {
                    _ref: nav.objLoc[0] || ""
                })), where.files && stManager.add(where.files), where.params = extend({
                    __query: dest,
                    al_id: vk.id
                }, objLoc, opts.params || {});
                var post_id = ev && ev.target && ev.target.getAttribute ? ev.target.getAttribute("data-post-id") : "",
                    parent_post_id = post_id ? ev.target.getAttribute("data-parent-post-id") : "";
                !where.params._post && post_id && (where.params._post = post_id), !where.params._parent_post && parent_post_id && (where.params._parent_post = parent_post_id),
                    opts.cl_id && (where.params.fr_click = cur.oid + "," + opts.cl_id + "," + cur.options.fr_click), opts.tstat && (where.params._tstat = opts.tstat), opts.permanent &&
                    (where.params._permanent = opts.permanent);
                var curNavVersion = ++NextPageID,
                    done = function(title, html, js, params) {
                        if (curNavVersion === NextPageID) {
                            try {
                                params._id = params.id
                            } catch (e) {
                                return topError(e, {
                                    dt: 15,
                                    type: 6,
                                    msg: "Error: " + e.message + ", (params undefined?), title: " + title + ", html: " + html + ", js: " + js,
                                    url: where.url,
                                    query: ajx2q(where.params),
                                    answer: arguments.length
                                })
                            }
                            if (opts.bench && (ajax.tProcess = (new Date)
                                    .getTime()), stVersions["common.js"] > StaticFiles["common.js"].v) {
                                if (nav.setLoc(params.loc || nav.strLoc), reloadCheckFlood({
                                        force: !0,
                                        from: 4
                                    })) return;
                                return void location.reload(!0)
                            }
                            var newPage = void 0 === where.params.al_id || where.params.al_id != params.id || params.fullPage,
                                _back = cur._back,
                                wNode = ge("wrap3"),
                                tNode = ge("title"),
                                hist = !1;
                            if ((strLoc == (cur._back || {})
                                    .loc || newPage || opts.back) && (_back = !1), (opts.noback || params.level && (!cur._level || params.level <= cur._level) && opts.noback !==
                                    !1) && (_back = !1, (opts.noback || cur._level && params.level < cur._level) && showBackLink()), window.tooltips && tooltips.destroyAll(),
                                each(geByClass("page_actions_wrap"), function() {
                                    hide(this)
                                }), hide("audio_tip_wrap"), _back) {
                                if (revertLastInlineVideo(), hist = {
                                        loc: _back.loc || nav.strLoc,
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
                                        bodyClass: vk.body_class,
                                        back: _tbLink.loc ? [_tbLink.loc, val(_tbLink), _tbLink.fast] : !1
                                    }, tNode && tNode.parentNode && !isVisible(tNode.parentNode) && (hist.hideHeader = !0), globalHistoryDestroy(hist.loc), globalHistory.length >
                                    2) {
                                    var h = globalHistory.shift();
                                    processDestroy(h.cur), h.content.innerHTML = ""
                                }
                                if (cur._back.hide)
                                    for (var i = 0, l = cur._back.hide.length; l > i; ++i) cur._back.hide[i]();
                                _back.text && showBackLink(hist.loc, _back.text, 1)
                            } else _tbLink.fast = 0, processDestroy(cur);
                            if (PageID = NextPageID, each(radioBtns, function(e, t) {
                                    t.keep || delete radioBtns[e]
                                }), ajaxCache = {}, boxQueue.hideAll(!1, !0), layerQueue.clear(), layers.fullhide && layers.fullhide(!0), cur = {
                                    destroy: [],
                                    nav: []
                                }, _stlWas = 0, newPage) {
                                for (cleanElems("quick_login_button", "quick_expire", "search_form", "top_links", "bottom_nav"); globalHistory.length;) {
                                    var h = globalHistory.shift();
                                    processDestroy(h.cur), h.content.innerHTML = ""
                                }
                                var oldTopW = ge("dev_top_nav_wrap") && getSize("dev_top_nav_wrap")[0] || ge("page_header_wrap") && getSize("page_header_wrap")[0] || 0;
                                pageNode.innerHTML = html, oldTopW && updateHeaderStyles({
                                    width: oldTopW
                                }), _tbLink = ge("top_back_link");
                                try {
                                    _tbLink.style.maxWidth = _tbLink.parentNode.offsetWidth - 35 + "px"
                                } catch (e) {}
                                browser.mobile || onBodyResize(!0)
                            } else {
                                if (_back) {
                                    var newW = ce("div", {
                                        id: "wrap3"
                                    });
                                    extend(hist, {
                                        content: wNode.parentNode.replaceChild(newW, wNode),
                                        title: tNode.innerHTML
                                    }), globalHistory.push(hist), wNode = newW
                                }
                                var oldTopW = ge("dev_top_nav_wrap") && getSize("dev_top_nav_wrap")[0] || ge("page_header_wrap") && getSize("page_header_wrap")[0] || 0;
                                wNode.innerHTML = html, where.params && "im" === where.params.__query && fixImHeight(), oldTopW && updateHeaderStyles({
                                    width: oldTopW
                                }), tNode.innerHTML = title, (title ? show : hide)(tNode.parentNode), window.AudioUtils && AudioUtils.updateCurrentPlaying(!0)
                            }
                            checkPageBlocks(), updateSTL(), handlePageParams(params), opts.noscroll || params.noscroll || scrollToTop(0), opts.bench && (ajax.tRender = (new Date)
                                    .getTime()), nav.curLoc = params.loc, js && eval("(function(){" + js + ";})()"), ajax._framenext(), opts.onDone && opts.onDone(), browser.mobile &&
                                onBodyResize(), changed.f && handleScroll(changed.f), nav.setLoc(params.loc || ""), lTimeout(function() {
                                    window.AudioUtils && AudioUtils.updateCurrentPlaying(!0), TopSearch && TopSearch.tsNeedsClear && (TopSearch.clear(), TopSearch.toggleInput(!
                                        1), delete TopSearch.tsNeedsClear), TopMenu.toggle(!1)
                                }, browser.chrome ? 100 : 50)
                        }
                    };
                return window.Page && (Page.postsSave(), Page.postsSend(), Page.postsClearTimeouts()), updSeenAdsInfo(), __adsUpdate("already"), _pads.shown && Pads.hide(), (
                    "im" === nav.objLoc[0] || "im" === changed[0]) && (where.params = extend({}, where.params, {
                    _full_page: !0
                })), ajax.post(where.url, where.params, {
                    onDone: function() {
                        var e = arguments;
                        if (__debugMode) done.apply(null, e);
                        else try {
                            done.apply(null, e)
                        } catch (t) {
                            topError(t, {
                                dt: 15,
                                type: 6,
                                url: where.url,
                                query: ajx2q(where.params),
                                js: e[2],
                                answer: Array.prototype.slice.call(arguments)
                                    .join("<!>")
                            })
                        }
                    },
                    onFail: opts.onFail || function(e) {
                        return e ? (setTimeout(showFastBox({
                                title: getLang("global_error")
                            }, e)
                            .hide, __debugMode ? 3e4 : 3e3), !0) : void 0
                    },
                    frame: opts.noframe ? 0 : 1,
                    canReload: !0,
                    showProgress: opts.showProgress || showTitleProgress,
                    hideProgress: opts.hideProgress || hideTitleProgress,
                    cache: opts.search ? 1 : "",
                    bench: opts.bench
                }), !1
            }
        },
        setLoc: function(e) {
            "string" == typeof e ? (nav.strLoc = e, nav.objLoc = nav.fromStr(e)) : (nav.strLoc = nav.toStr(e), nav.objLoc = e), hab.setLoc(nav.strLoc)
        },
        change: function(e, t, o) {
            var n = clone(nav.objLoc);
            return each(e, function(e, t) {
                t === !1 ? delete n[e] : n[e] = t
            }), nav.go(n, t, o)
        },
        fromStr: function(e) {
            e = e.split("#");
            var t = e[0].split("?"),
                o = {
                    0: t[0] || ""
                };
            return e[1] && (o["#"] = e[1]), extend(q2ajx(t[1] || ""), o)
        },
        toStr: function(e) {
            e = clone(e);
            var t = e["#"] || "",
                o = e[0] || "";
            delete e[0], delete e["#"];
            var n = ajx2q(e);
            return (n ? o + "?" + n : o) + (t ? "#" + t : "")
        },
        init: function() {
            nav.strLoc = hab.getLoc(), nav.objLoc = nav.fromStr(nav.strLoc)
        }
    };
nav.init();
var _cookies;
vk.time && !browser.opera_mobile && setTimeout(function() {
    var e = new Date,
        t = [0, e.getMonth() + 1, e.getDate(), e.getHours(), e.getMinutes()];
    1 == t[1] && 12 == vk.time[1] ? vk.time[1] = 0 : 12 == t[1] && 1 == vk.time[1] ? t[1] = 0 : (t[1] > vk.time[1] + 1 || vk.time[1] > t[1] + 1) && (t[1] = vk.time[1] = t[
            2] = vk.time[2] = 0), t[1] > vk.time[1] && 1 == t[2] ? 31 == vk.time[2] || (4 == vk.time[1] || 6 == vk.time[1] || 9 == vk.time[1] || 11 == vk.time[1]) && 30 ==
        vk.time[2] || 2 == vk.time[1] && (29 == vk.time[2] || 28 == vk.time[2] && vk.time[0] % 4) ? vk.time[2] = 0 : vk.time[2] = t[2] = 0 : vk.time[1] > t[1] && 1 == vk.time[
            2] && (31 == t[2] || (4 == t[1] || 6 == t[1] || 9 == t[1] || 11 == t[1]) && 30 == t[2] || 2 == t[1] && (29 == t[2] || 28 == t[2] && vk.time[0] % 4) ? t[2] = 0 :
            t[2] = vk.time[2] = 0), (t[2] > vk.time[2] + 1 || vk.time[2] > t[2] + 1) && (t[2] = vk.time[2] = 0);
    var o = 60 * (60 * (24 * (t[2] - vk.time[2]) + (t[3] - vk.time[3])) + (t[4] - vk.time[4])); - 55800 > o ? o += 86400 : o > 37800 && (o -= 86400);
    var n = 0,
        a = Math.abs(o),
        i = [-12, -11, -10, -9, -8, -7, -6, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1, 0, 1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 8.5, 9, 9.5, 10, 11, 12, 13];
    for (var r in i) {
        var s = Math.round(3600 * (i[r] - 3)),
            l = Math.abs(o - s);
        a > l && (a = l, n = s)
    }
    vk.dt = n, getCookie("remixdt") != vk.dt && setCookie("remixdt", vk.dt, 365);
    var c = intval(getCookie("remixrt"));
    window.devicePixelRatio >= 2 && (!browser.iphone || getCookie("remixme")) ? 1 & c || (setCookie("remixrt", 1 | c, 365), window._retinaInit = function() {
        stManager.add(["retina.css"]), addClass(document.body, "is_2x")
    }, window._initedCheck && window._retinaInit()) : 1 & c && setCookie("remixrt", 1 ^ c, 365)
}, 0);
var _message_box_guid = 0,
    _message_boxes = [],
    _show_flash_timeout = 0,
    __bq = boxQueue = {
        hideAll: function(e, t) {
            if (e)
                for (; __bq.count();) __bq.hideLast();
            else {
                if (__bq.count()) {
                    var o = _message_boxes[__bq._boxes.pop()];
                    o._in_queue = !1, o._hide(!1, !1, t)
                }
                for (; __bq.count();) {
                    var o = _message_boxes[__bq._boxes.pop()];
                    o._in_queue = !1
                }
            }
        },
        hideLast: function(e, t) {
            if (__bq.count()) {
                var o = _message_boxes[__bq._boxes[__bq.count() - 1]];
                if (e === !0 && (o.changed || __bq.skip || t && t.target && t.target.tagName && "input" != t.target.tagName.toLowerCase() && cur.__mdEvent && t.target != cur.__mdEvent
                        .target)) return void(__bq.skip = !1);
                o.hide()
            }
            return t && "click" == t.type ? cancelEvent(t) : void 0
        },
        hideBGClick: function(e) {
            e && e.target && /^box_layer/.test(e.target.id) && __bq.hideLast()
        },
        count: function() {
            return __bq._boxes.length
        },
        _show: function(e) {
            var t = _message_boxes[e];
            if (t && !t._in_queue) {
                __bq.count() ? _message_boxes[__bq._boxes[__bq.count() - 1]]._hide(!0, !0) : window.tooltips && tooltips.hideAll(), t._in_queue = !0;
                var o = __bq.count() ? !0 : !1;
                __bq.curBox = e, t._show(o || __bq.currHiding, o), __bq._boxes.push(e)
            }
        },
        _hide: function(e) {
            var t = _message_boxes[e];
            if (t && t._in_queue && __bq._boxes[__bq.count() - 1] == e && t.isVisible() && (t._in_queue = !1, __bq._boxes.pop(), t._hide(__bq.count() ? !0 : !1), __bq.count())) {
                var o = __bq._boxes[__bq.count() - 1];
                __bq.curBox = o, _message_boxes[o]._show(!0, !0, !0)
            }
        },
        _boxes: [],
        curBox: 0
    };
__bq.hideLastCheck = __bq.hideLast.pbind(!0), browser.mobile || addEvent(document, "keydown", function(e) {
    if (_wf = 1, e.keyCode == KEY.ESC && __bq.count() && !cur._noEscHide) return __bq.hideLast(), -1;
    var t = [176, 177, 178, 179],
        o = !1;
    window.audioPlayer && (t.push(KEY.LEFT), t.push(KEY.RIGHT)), each(t, function(t, n) {
        return e.keyCode == n ? (o = !0, !1) : void 0
    }), o && getAudioPlayer(function(t) {
        t.onMediaKeyPressedEvent(e)
    }), Chat.inited && 191 == e.keyCode && (e.ctrlKey || e.metaKey && browser.mac) && Chat.showFriends()
});
var radioBtns = {};
window.__qlTimer = null, window.__qlClear = function() {
    clearTimeout(__qlTimer), setTimeout(function() {
        clearTimeout(__qlTimer)
    }, 2e3)
}, window.onLoginDone = function() {
    __qlClear(), nav.reload({
        force: !0,
        from: 6
    })
}, window.onLogout = function() {
    if (__qlClear(), window.audioPlayer && (audioPlayer.stop(), toggleGlobalPlayer(!1)), window.Notifier && Notifier.standby(), window.FastChat && FastChat.standby(), window.Page &&
        Page.postsClear(), ls.checkVersion()) try {
        window.localStorage.clear()
    } catch (e) {}
    nav.reload({
        from: 5
    })
};
var gSearch = new function() {
        this.on = 0;
        var e = this;
        this.hub = new callHub(function() {
            e.onShow && e.onShow()
        }, 2), this.hintsHub = new callHub(function() {
            e.showStartHints()
        }, 2), this.load = function() {
            ge("quick_search") && (this.loading || (this.loading = !0, stManager.add("qsearch.js", function() {
                e.hub.done()
            }), ajax.post("hints.php", {
                act: "a_start_hints"
            }, {
                onDone: function(t) {
                    e.startHintsText = trim(t), e.hintsHub.done()
                }
            })))
        }, this.show = function(t, o) {
            return ge("quick_search") ? this.on ? this.go(t) : (this.on = 1, show(e.sCont), placeholderSetup("search_input"), ge("search_input")
                .setAttribute("autocomplete", "off"), addClass(ge("qsearch_link"), "active"), this.prev_content = ge("content"), this.qsearch_cont || (this.qsearch_cont =
                    ce("div", {
                        id: "content",
                        innerHTML: '<div style="padding: 200px; text-align: center;"><img src="/images/progress7.gif"/></div>'
                    })), this.prev_content.parentNode.replaceChild(this.qsearch_cont, this.prev_content), this.loading || this.load(), e.hub.done(), e.hintsHub.done(), t ?
                cancelEvent(t) : void 0) : void 0
        }, this.go = function(t) {
            var o = "/gsearch.php?section=" + (e.last_section || "people") + "&q=" + trim(ge("search_input")
                .value) + "&name=1";
            return cancelEvent(t || window.event), location.href = o, !1
        }, this.hide = function(t, o) {
            if (ge("quick_search") && (!e.active || o) && e.on) {
                if (e.on = 0, toggleFlash(), e.beforeHide && e.beforeHide()) return !0;
                ge("search_input")
                    .setValue ? ge("search_input")
                    .setValue("") : ge("search_input")
                    .value = "", hide(e.sCont), removeClass(ge("qsearch_link"), "active"), e.qsearch_cont.parentNode.replaceChild(e.prev_content, e.qsearch_cont)
            }
        }, this.init = function(e) {
            this.sCont = ge("quick_search"), this.opt = e || {}
        };
        this.preload = function() {}
    },
    _cleanHide = function(e) {
        e.temphide && (removeEvent(e, "mouseout", e.temphide), removeAttr(e, "temphide"), removeAttr(e, "showing"))
    };
window._videoLastInlined = !1;
var Chat = {
    maxHeight: 300,
    tabs: {},
    counters: {},
    showFriends: function() {
        curFastChat.clistBox.visible ? curFastChat.clistBox.options.fixed ? FastChat.clistHide() : curFastChat.clistBox.show() : (FastChat.clistShow(), Chat.cont.tt &&
            Chat.cont.tt.destroy && Chat.cont.tt.destroy())
    },
    showTT: function() {
        hasClass(Chat.wrap, "chat_active") || hasClass(Chat.wrap, "chat_expand") || showTooltip(Chat.cont, {
            text: getLang("head_fr_online_tip") + " (" + (browser.mac ? "Cmd" : "Ctrl") + "+?)",
            shift: [-2, 4, 0],
            showdt: 0,
            black: 1
        })
    },
    init: function() {
        Chat.wrap = ce("div", {
                id: "chat_onl_wrap",
                className: "chat_onl_wrap",
                innerHTML: '<div class="chat_tt_wrap"></div><div class="chat_onl_inner"><div class="chat_cont_scrolling"><div class="chat_onl_height"></div></div><div class="chat_cont_sh_top"></div><div class="chat_cont_sh_bottom"></div><a class="chat_tab_wrap" id="chat_tab_wrap" onclick="Chat.showFriends()" onmouseover="Chat.showTT();"><div class="chat_onl_cont"><div class="chat_onl" id="chat_onl"></div></div></a></div>'
            }), utilsNode.appendChild(Chat.wrap), Chat.scrollNode = geByClass1("chat_cont_scrolling", Chat.wrap), Chat.ttNode = geByClass1("chat_tt_wrap", Chat.wrap), Chat
            .itemsCont = Chat.scrollNode.firstChild, Chat.onl = ge("chat_onl"), Chat.cont = Chat.onl.parentNode.parentNode, hide(Chat.wrap), Chat.inited = !0, stManager._addCss(
                ".layers_shown .chat_onl_wrap {margin-right: " + sbWidth() + "px;}")
    }
};
TopMenu = {
    init: function() {
        if (this.inited) return !1;
        var e = ge("top_profile_link"),
            t = ge("top_profile_menu");
        return e && t ? (addEvent(e, "mousedown", TopMenu.clicked), void(this.inited = !0)) : !1
    },
    clicked: function(e) {
        return checkEvent(e) ? !1 : void TopMenu.toggle()
    },
    toggle: function(e) {
        var t = ge("top_profile_link"),
            o = ge("top_profile_menu");
        void 0 === e && (e = !hasClass(o, "shown")), toggleClass(t, "active", e), toggleClass(o, "shown", e), browser.msie8 && (setStyle(o, {
            display: "table"
        }), setTimeout(setStyle.pbind(o, {
            display: ""
        }), 0)), e ? topHeaderClose(TopMenu.toggle.bind(this, !1)) : topHeaderClearClose()
    },
    show: function() {
        TopMenu.hidetimer && (clearTimeout(TopMenu.hidetimer), TopMenu.hidetimer = 0), TopMenu.toggle(!0)
    },
    hide: function() {
        TopMenu.hidetimer || (TopMenu.hidetimer = setTimeout(function() {
            TopMenu.toggle(!1), TopMenu.hidetimer = 0
        }, 200))
    },
    select: function(e, t) {
        return checkEvent(t) ? !0 : (TopMenu.toggle(!1), nav.go(e, t, {
            noback: !0
        }))
    }
};
var TopNotifier = {
    preload: function() {
        var e = ["notifier.js", "notifier.css"];
        stManager.add(e, function() {
            TopNotifier.preload()
        })
    },
    show: function(e) {
        if (checkEvent(e) !== !0) {
            var t = ["notifier.js", "notifier.css"];
            return stManager.add(t, function() {
                TopNotifier.show(id)
            }), cancelEvent(e)
        }
    },
    showTooltip: function(e) {
        var t = ["notifier.js", "notifier.css"];
        stManager.add(t, function() {
            TopNotifier.showTooltip(e)
        })
    },
    invalidate: __bf,
    setCount: __bf
};
TopSearch = {
    cache: {},
    lists: {},
    maxItems: 8,
    init: function() {
        if (this.inited) return !1;
        var e = ge("ts_input"),
            t = ge("ts_wrap"),
            o = ge("ts_cont_wrap");
        return Chat.init(), e ? (addEvent(e, "focus", function() {
            TopSearch.deselect(), trim(val(this)) && addClass(o.firstChild, "active"), TopSearch.toggleInput(!0)
        }), addEvent(e, "keydown", function(n) {
            switch (n.keyCode) {
                case KEY.DOWN:
                case KEY.UP:
                    TopSearch.moveSelection(n.keyCode), cancelEvent(n);
                    break;
                case KEY.ENTER:
                    var a = geByClass1("active", o);
                    if (a) TopSearch.select(a, n);
                    else {
                        var i = trim(val(this));
                        i && (e.blur(), hide(t), TopSearch.tsNeedsClear = !0, nav.go("/search?c[section]=auto&c[q]=" + encodeURIComponent(i)))
                    }
                    cancelEvent(n);
                    break;
                case KEY.TAB:
                case KEY.ESC:
                    TopSearch.clear(), TopSearch.toggleInput(!1), topHeaderClearClose()
            }
        }), addEvent(e, "keyup", function(e) {
            switch (e.keyCode) {
                case KEY.DOWN:
                case KEY.UP:
                case KEY.ENTER:
                case KEY.ESC:
                    cancelEvent(e);
                    break;
                default:
                    TopSearch.prepareRows(trim(val(this)))
            }
        }), addEvent(e, "paste", function() {
            setTimeout(function() {
                TopSearch.prepareRows(trim(val(e)))
            }, 10)
        }), addEvent(document, "mousedown", function(t) {
            e.blur(), domClosest("audio_layout", t.target) || domClosest("layer_wrap", t.target) || topHeaderClose()
        }), void(this.inited = !0)) : !1
    },
    clear: function() {
        var e = ge("ts_input");
        e.setValue(""), e.blur(), e.phonblur(), this.prepareRows()
    },
    select: function(e, t, o) {
        if (checkEvent(t)) return !0;
        var n = ge("ts_cont_wrap"),
            a = ge("ts_input"),
            i = trim(val(a))
            .length,
            r = e.getAttribute("hinttype");
        if (i || (a.blur(), this.toggleInput(!1)), o && hasClass(t.target, "ts_contact_status")) return ajax.post("al_search.php", {
            act: "save_metrics",
            ql: i,
            mk: "chat_box"
        }), this.writeBox(o), this.clear(), this.toggleInput(!1), !1;
        hide(n), this.tsNeedsClear = !0;
        var s = nav.go(e, t);
        return ajax.post("al_search.php", {
            act: "save_metrics",
            ql: i,
            mk: r
        }), s
    },
    deselect: function() {
        var e = ge("ts_cont_wrap");
        each(geByClass("active", e), function(e, t) {
            removeClass(t, "active")
        })
    },
    itemOver: function(e, t, o) {
        1 == t && TopSearch.deselect();
        var n = inArray(e.getAttribute("hintType"), ["h_friends", "h_correspondents", "h_chats"]);
        toggleClass(e, "write", n), t && addClass(e, "active")
    },
    moveSelection: function(e) {
        var t, o = ge("ts_cont_wrap"),
            n = geByClass1("active", o);
        switch (e) {
            case KEY.UP:
                t = n ? this.getNextNode(n, -1, "a") || n : !1;
                break;
            case KEY.DOWN:
                t = n ? this.getNextNode(n, 1, "a") || n : o.firstChild
        }
        return this.deselect(), t && addClass(t, "active"), !1
    },
    getNextNode: function(e, t, o) {
        for (var n = e, a = domPN(e);;) {
            if (n = t > 0 ? domNS(n) : domPS(n), n || (n = t > 0 ? domFC(a) : domLC(a)), o && n.tagName && n.tagName.toLowerCase() == o || !o && n) return n;
            if (n === e) return !1
        }
    },
    toggleInput: function(e) {
        e = !!e;
        var t = ge("ts_cont_wrap");
        isVisible(t) != e && (toggle("ts_cont_wrap", e), e && topHeaderClose(function() {
            TopSearch.clear(), TopSearch.toggleInput(!1)
        }))
    },
    getList: function(e) {
        switch (e) {
            case "friends":
                return this.lists.friends || this.topFriends || {};
            case "publics":
            case "events":
            case "groups":
            case "apps":
            case "chats":
            case "search":
                return this.lists[e] || {}
        }
        return {}
    },
    onlines: function() {
        return window.curFastChat && curFastChat.onlines || this.lists.onlines || {}
    },
    initFriendsList: function() {
        var e = this;
        if (e.friendsLoaded) return !1;
        if (cur.initingFL || vk.isBanned) return !1;
        var t = function(e) {
                for (var t in e) return !1;
                return !0
            },
            o = function() {
                cur.initingFL = !0, ajax.post("al_search.php", {
                    act: "get_top_friends"
                }, {
                    cache: 1,
                    onDone: function(t) {
                        delete cur.initingFL, e.topFriends = t, e.updateCache("friends"), e.forceUpdate = !0, e.prepareRows(cur.tsStr || ""), n()
                    },
                    onFail: function() {
                        delete cur.initingFL
                    }
                })
            },
            n = function() {
                return e.friendsLoaded ? !1 : (cur.initingFL = !0, void ajax.post("al_search.php", {
                    act: "get_pages"
                }, {
                    cache: 1,
                    onDone: function(t) {
                        delete cur.initingFL, e.friendsLoaded || (each(t, function(t, o) {
                            e.lists[t] = o, "onlines" != t && e.updateCache(t)
                        }), e.friendsLoaded = !0)
                    },
                    onFail: function() {
                        delete cur.initingFL
                    }
                }))
            },
            a = e.getList("friends");
        t(a) ? o() : (e.updateCache("friends"), e.forceUpdate = !0, e.prepareRows(cur.tsStr || ""), n())
    },
    getSimilarQueries: function(e) {
        e = e.toLowerCase();
        var t, o = [e];
        return (t = parseLatin(e)) && o.push(t), (t = parseLatKeys(e)) && o.push(t), (t = parseCyr(e)) && o.push(t), o
    },
    searchCache: function(e, t) {
        var o = TopSearch.getList(e);
        if (!t) return !1;
        var n, a, i, r, s, l, c, d = this.getSimilarQueries(t);
        if (void 0 !== this.cache[e][t]) return d;
        c = this.cache[e][t] = {};
        for (var a in d)
            if (n = d[a], r = this.cache[e][" " + n.charAt(0)
                    .toLowerCase()
                ]) {
                s = new RegExp("(^|[\\s\\-\\(\\)\\.,;|:]+)" + escapeRE(n), "gi");
                for (i in r) l = o[i + "_"], isArray(l) && null !== l[0].match(s) && (c[i] = 1)
            }
        i = 0;
        for (var a in c) i++;
        return c._num = i, d
    },
    updateCache: function(e, t, o) {
        var n, a, i, r = t || this.getList(e);
        this.cache[e] = o && this.cache[e] || {};
        for (var s in r) {
            n = r[s][0], s = intval(s), i = n.split(/[\s\-\(\)\.,;|:]+/);
            for (var l in i) a = " " + i[l].charAt(0)
                .toLowerCase(), this.cache[e][a] = this.cache[e][a] || {}, this.cache[e][a][s] = 1
        }
    },
    listSearch: function(e, t, o, n) {
        var a = TopSearch,
            i = [],
            r = {};
        return t ? (a.searchCache(e, t), r = a.cache[e] && a.cache[e][t] || {}) : each(a.getList(e), function(e) {
            var t = intval(e);
            r[t] = 1
        }), each(a.getList(e), function(e) {
            var t = intval(e),
                a = r[t];
            if ((!n || !n[t]) && a) return o-- ? void i.push([t, this]) : !1
        }), i
    },
    row: function(e, t, o, n, a, i, r, s) {
        var l = 0;
        return i && (n = n.replace(i, '$1<em class="ts_clist_hl">$2</em>')), inArray(r, ["h_friends", "h_correspondents", "h_chats"]) && (l = e), s || (s = ""),
            '<a href="' + t + '" class="ts_contact ' + (a ? mobPlatforms[a] ? "ts_contact_mobile" : "ts_contact_online" : "") + ' clear_fix" id="ts_contact' + e +
            '" onclick="return TopSearch.select(this, event, ' + l +
            ');" onmousedown="event.cancelBubble = true;" onmouseover="TopSearch.itemOver(this, 1, event);"  onmouseout="TopSearch.itemOver(this, 0, event);" hinttype="' +
            r + '"><span class="ts_contact_photo fl_l"><img class="ts_contact_img" src="' + o +
            '"/></span><span class="ts_contact_name fl_l"><span class="ts_contact_title">' + n + '</span><div class="ts_contact_info">' + s +
            '</div></span><div class="ts_contact_status"></div></a>'
    },
    searchLists: function(e) {
        var t = TopSearch,
            o = {};
        return o = e ? {
            friends: {
                order: 0,
                count: t.maxItems - 1,
                label: getLang("global_friends")
            },
            groups: {
                order: 1,
                count: 4,
                label: getLang("global_communities")
            },
            publics: {
                count: 2,
                parent: "groups"
            },
            events: {
                count: 1,
                parent: "groups"
            },
            apps: {
                order: 2,
                count: 1,
                label: getLang("global_apps")
            },
            chats: {
                order: 3,
                count: t.maxItems - 1,
                label: getLang("global_chats")
            },
            search: {
                order: 4,
                count: t.maxItems - 1,
                label: getLang("head_search_results")
            }
        } : {
            friends: {
                order: 0,
                count: t.maxItems,
                label: getLang("global_friends")
            }
        }
    },
    initListsHtml: function() {
        TopSearch.listsHtml = []
    },
    addToListsHtml: function(e, t, o) {
        var n = TopSearch,
            a = n.searchLists(o),
            i = (a[e] || {})
            .parent || e,
            r = a[i] || {},
            s = r.order || 0,
            l = r.label || "";
        n.listsHtml[s] = n.listsHtml[s] || (o && l ? ['<div class="ts_search_sep">' + l + "</div>"] : []), n.listsHtml[s].push(t)
    },
    htmlRows: function(e) {
        var t = TopSearch,
            o = [],
            n = "";
        for (var a in t.listsHtml) o.push(t.listsHtml[a].join(""));
        if (e) {
            var i = (e.length > 27 ? e.substr(0, 25) + ".." : e, "#" == e[0] ? "statuses" : "auto"),
                r = getLang("#" == e[0] ? "global_news_search_results" : "global_show_all_results");
            n += '<a href="/search?c[section]=' + i + "&c[q]=" + encodeURIComponent(e) +
                '" class="ts_search_link clear_fix active" id="ts_search_link" onclick="return TopSearch.select(this, event);" onmousedown="event.cancelBubble = true;" onmouseover="TopSearch.itemOver(this, 1, event);"><span class="ts_contact_name fl_l">' +
                r + '</span><div class="ts_contact_status "></div></a>'
        }
        return n + o.join("")
    },
    prepareRows: function(e) {
        var t = TopSearch,
            o = "";
        if (limit = t.maxItems, tsWrap = ge("ts_cont_wrap"), curLink = geByClass1("active", tsWrap), activeId = curLink ? curLink.id : "", !tsWrap) return !1;
        if (cur.tsStr && cur.tsStr == e && !t.forceUpdate) return !1;
        delete t.forceUpdate, t.initListsHtml();
        var n, a = {};
        e && (n = [], each(this.getSimilarQueries(e), function() {
                n.push(escapeRE(this))
            }), n = new RegExp("([ -]|^|s|&nbsp;|\b)(" + n.join("|") + ")", "gi"), cur.lastRe = n, limit--), each(t.searchLists(e), function(o, i) {
                if (t.cache[o]) {
                    var r = i.count,
                        s = t.listSearch(o, e, r, a),
                        l = [],
                        c = 0;
                    if (!isEmpty(s)) {
                        for (var d in s) {
                            if (!limit || c >= r) break;
                            l.push(s[d]), limit--, c++
                        }
                        if (l.length)
                            for (var d in l) {
                                var u, h = l[d][1],
                                    p = intval(l[d][0]),
                                    f = p > 0 ? t.onlines()[p] : !1,
                                    g = h[0],
                                    v = h[2],
                                    m = h[4],
                                    _ = "search" == o ? h[3] : "h_" + o;
                                u = t.row(p, v, h[1], g, f, n, _, m), t.addToListsHtml(o, u, e), a[p] = 1
                            }
                    }
                }
            }), tsWrap.innerHTML = t.htmlRows(e), limit && e && "#" != e[0] && this.hintsSearch(e, cur.lastRe || !1), (o || e) && (cur.tsStr = e), activeId && ge(activeId) &&
            addClass(ge(activeId), "active")
    },
    hintsSearch: function(e, t) {
        var o, n, a, i = TopSearch,
            r = ge("ts_input"),
            s = ge("ts_cont_wrap");
        ajax.post("al_search.php", {
            act: "get_pages_hints",
            q: e
        }, {
            cache: 1,
            onDone: function(l) {
                if (trim(val(r)) != e) return !1;
                if (!l) return !1;
                var c = i.maxItems - geByClass("ts_contact", s)
                    .length - 1,
                    d = {};
                each(l, function(o) {
                    var n = intval(o),
                        r = this[0],
                        s = this[2],
                        l = this[3],
                        u = this[4],
                        h = i.searchLists(e),
                        p = l.replace("h_", ""),
                        f = (h[p] || {})
                        .parent || p;
                    if (void 0 === h[f] && (f = "search"), d[f] = d[f] || {}, d[f][o] = this, i.lists[f] = i.lists[f] || {}, i.lists[f][o] = this, ge(
                            "ts_contact" + n)) return !0;
                    if (!c--) return !1;
                    var g = i.row(n, s, this[1], r, !1, t, l, u);
                    return i.addToListsHtml(f, g, e), a = !0, !0
                });
                for (var u in d) i.updateCache(u, d[u], !0);
                a && (o = geByClass1("active", s), n = o ? o.id : "", s.innerHTML = i.htmlRows(e), n && ge(n) && addClass(ge(n), "active"))
            }
        })
    },
    writeBox: function(e) {
        window.curFastChat && curFastChat.inited && window.FastChat ? FastChat.selectPeer(e) : e > 0 && 2e9 > e ? showWriteMessageBox(!1, e) : nav.go("/im?sel=" + e)
    }
};
var _postsSeen = {},
    _postsSaved = {},
    _postsSaveTimer, _postsSendTimer, _postsCleanTimer, _postsSeenModules = {},
    _postsExtras = {},
    ls = {
        checkVersion: function() {
            return void 0 !== window.localStorage && void 0 !== window.JSON
        },
        set: function(e, t) {
            this.remove(e);
            try {
                return ls.checkVersion() ? localStorage.setItem(e, JSON.stringify(t)) : !1
            } catch (o) {
                return !1
            }
        },
        get: function(e) {
            if (!ls.checkVersion()) return !1;
            try {
                return JSON.parse(localStorage.getItem(e))
            } catch (t) {
                return !1
            }
        },
        remove: function(e) {
            try {
                localStorage.removeItem(e)
            } catch (t) {}
        }
    },
    mobilePromo = showBox.pbind("al_login.php", {
        act: "mobile",
        box: 1
    }),
    Pads = {
        preload: function(e) {
            var t = ["pads.css", "pads.js", "notifier.js"];
            "msg" == e && t.push("pads_im.css", "pads_im.js", "page.css", "page.js"), stManager.add(t, function() {
                Pads.preload(e)
            })
        },
        show: function(e, t) {
            if (checkEvent(t) !== !0 && !browser.msie6) {
                var o = ["pads.css", "pads.js", "notifier.js"];
                return "msg" == e && o.push("pads_im.css", "pads_im.js", "page.css", "page.js"), stManager.add(o, function() {
                    Pads.show(e)
                }), cancelEvent(t)
            }
        },
        invalidate: __bf
    };
Object.keys || (Object.keys = function(e) {
    var t = [];
    for (var o in e) e.hasOwnProperty(o) && t.push(o);
    return t
}), window.VideoConstants = {
    VIDEO_ITEM_INDEX_OWNER_ID: 0,
    VIDEO_ITEM_INDEX_ID: 1,
    VIDEO_ITEM_INDEX_THUMB: 2,
    VIDEO_ITEM_INDEX_TITLE: 3,
    VIDEO_ITEM_INDEX_FLAGS: 4,
    VIDEO_ITEM_INDEX_DURATION: 5,
    VIDEO_ITEM_INDEX_HASH: 6,
    VIDEO_ITEM_INDEX_MODER_ACTS: 7,
    VIDEO_ITEM_INDEX_OWNER: 8,
    VIDEO_ITEM_INDEX_DATE: 9,
    VIDEO_ITEM_INDEX_VIEWS: 10,
    VIDEO_ITEM_FLAG_EXTERNAL: 1,
    VIDEO_ITEM_FLAG_DOMAIN_YT: 2,
    VIDEO_ITEM_FLAG_DOMAIN_COUB: 4,
    VIDEO_ITEM_FLAG_DOMAIN_RT: 8,
    VIDEO_ITEM_FLAG_DOMAIN_PLADFORM: 16,
    VIDEO_ITEM_FLAG_DOMAIN_VIMEO: 32,
    VIDEO_ITEM_FLAG_CAN_EDIT: 64,
    VIDEO_ITEM_FLAG_CAN_DELETE: 128,
    VIDEO_ITEM_FLAG_CAN_ADD: 256,
    VIDEO_ITEM_FLAG_PRIVATE: 512,
    VIDEO_ITEM_FLAG_NO_AUTOPLAY: 1024,
    VIDEO_ITEM_FLAG_ADDED: 2048,
    VIDEO_ITEM_FLAG_SKIP_THUMB_LOAD: 4096,
    VIDEO_ITEM_FLAG_NEED_SIGN_IN: 8192,
    VIDEO_ITEM_FLAG_HD: 16384
};
try {
    stManager.done("common.js")
} catch (e) {}
