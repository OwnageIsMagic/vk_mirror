function photoTagger(e, t) {
    if (e = ge(e), !e) return !1;
    var i, n, h, a, o, r, s, d, l, c, g = 0,
        f = e.parentNode,
        v = Math.abs,
        w = Math.min,
        p = Math.max,
        u = Math.floor,
        m = Math.ceil,
        y = (Math.round, function(e) {
            return 0 > e ? -1 : 1
        }),
        x = intval(t.zstart),
        E = intval(t.square),
        z = 0,
        S = intval(t.minw) || 30,
        N = intval(t.minh) || 30,
        C = intval(t.defw) || p(S, 100),
        M = intval(t.defh) || p(N, 100),
        T = vkImage(),
        b = E ? 1 : floatval(t.mina),
        A = E ? 1 : floatval(t.maxa);
    b > 0 && A > 0 && b > A && (A = b), e.src && (T.src = e.src);
    var X, Y, _, H, L, I, W, O, q = {},
        F = 0,
        R = 0,
        j = {},
        k = function(e, t) {
            j = extend(j, e), each(e, function(e) {
                var t = this + ("left" == e ? h : "top" == e ? a : 0);
                X.style[e] = t + "px"
            }), Y.style.marginLeft = -e.left + "px", Y.style.marginTop = -e.top + "px", each(q, function(t) {
                if (t.length < 2) "n" == t || "s" == t ? (this.style.left = h + e.left + intval(e.width / 2) - 5 + "px", this.style.top = a + e.top + ("n" == t ? 0 : e.height) -
                    5 + "px") : (this.style.left = h + e.left + ("w" == t ? 0 : e.width) - 5 + "px", this.style.top = a + e.top + intval(e.height / 2) - 5 + "px");
                else {
                    var i = t.charAt(0),
                        n = t.charAt(1);
                    this.style.left = h + e.left + ("w" == n ? 0 : e.width) - 5 + "px", this.style.top = a + e.top + ("n" == i ? 0 : e.height) - 5 + "px"
                }
            }), t || (o && (o.style.width = m(50 * F / e.width) + "px", o.style.height = m(50 * R / e.height) + "px", o.style.marginLeft = -u(50 * e.left / e.width) + "px", o.style
                .marginTop = -u(50 * e.top / e.width) + "px"), r && (r.style.width = m(100 * F / e.width) + "px", r.style.height = m(100 * R / e.height) + "px", r.style.marginLeft = -
                u(100 * e.left / e.width) + "px", r.style.marginTop = -u(100 * e.top / e.width) + "px"))
        },
        B = 0,
        D = function(e, t) {
            return [w(F, p(0, e - O[0])), w(R, p(0, t - O[1]))]
        },
        G = function() {
            var e = Math.max(intval(window.innerWidth), intval(document.documentElement.clientWidth)),
                t = Math.max(intval(window.innerHeight), intval(document.documentElement.clientHeight));
            s.style.width = e + "px", s.style.height = t + "px"
        },
        J = function(e) {
            e || (e = B);
            var t = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
            switch (z) {
                case 1:
                    return t[(t.indexOf(e) + 2) % 8];
                case 2:
                    return t[(t.indexOf(e) + 4) % 8];
                case 3:
                    return t[(t.indexOf(e) + 6) % 8];
                default:
                    return e
            }
        },
        K = function(e) {
            B && (1 == B || B == o || B == r ? e = "move" : 2 == B ? e = "crosshair" : B.length && (e = J() + "-resize"), s.style.cursor = e)
        },
        P = function(e) {
            switch (z) {
                case 1:
                    return [O[0] + e.pageY - O[1] + u((F - R) / 2), O[1] - e.pageX + O[0] + u((F + R) / 2)];
                case 2:
                    return [O[0] + (O[0] + F - e.pageX), O[1] + (O[1] + R - e.pageY)];
                case 3:
                    return [O[0] - e.pageY + O[1] + u((F + R) / 2), O[1] + e.pageX - O[0] - u((F - R) / 2)];
                default:
                    return [e.pageX, e.pageY]
            }
        },
        Q = function(i) {
            return O = getXY(e), elemWH = getSize(e), H = P(i), W = extend({}, j), d = l = c = !1, i.target == Y ? B = 1 : i.target == _ || i.target == e ? B = 2 : i.target == o ||
                i.target == r ? (B = i.target, j.width && j.height || k({
                    left: 0,
                    top: 0,
                    width: w(100, w(F, R)),
                    height: w(100, w(F, R))
                })) : each(q, function(e) {
                    if (i.target == this) {
                        B = e;
                        var t = H[0] - O[0],
                            n = H[1] - O[1],
                            h = [e.charAt(0), e.length > 1 ? e.charAt(1) : e.charAt(0)];
                        H[0] = j.left + ("w" == h[1] ? 0 : j.width), H[1] = j.top + ("n" == h[0] ? 0 : j.height), L = H[0] - t, I = H[1] - n
                    }
                }), B ? (t.onStart && t.onStart(), 2 != B && B != o && B != r && each(q, function() {
                    setStyle(this, "opacity", .7)
                }), show(s), K(), removeEvent(e, "mousedown", Q), addEvent(bodyNode, "mouseup dragend", V), addEvent(bodyNode, "mousemove", U), cancelEvent(i)) : void 0
        },
        U = function(t) {
            if (window.getSelection) {
                var i = window.getSelection();
                i.removeAllRanges && i.removeAllRanges()
            }
            var n = P(t);
            if (1 == B) {
                var h = W.left + (n[0] - H[0]),
                    a = W.top + (n[1] - H[1]);
                h = w(F - j.width, p(0, h)), a = w(R - j.height, p(0, a)), k(extend(j, {
                    left: h,
                    top: a
                }))
            } else if (2 == B) v(n[0] - H[0]) > 3 && v(n[1] - H[1]) > 3 && (B = 3, K(), O = getXY(e), elemWH = getSize(e), H[0] -= O[0], H[1] -= O[1], show(X, _), each(q, function() {
                show(this), setStyle(this, "opacity", .7)
            }));
            else if (B == o || B == r) {
                var s = B == o ? 50 : 100,
                    h = W.left - u((n[0] - H[0]) * j.width / s),
                    a = W.top - u((n[1] - H[1]) * j.height / s);
                h = w(F - j.width, p(0, h)), a = w(R - j.height, p(0, a)), k(extend(j, {
                    left: h,
                    top: a
                }))
            } else if (B.length) {
                var d = D(n[0] + L, n[1] + I);
                n[0] = d[0], n[1] = d[1];
                var l = n[0] - H[0],
                    c = n[1] - H[1];
                if (!l && !c) return cancelEvent(t);
                var h = j.left,
                    a = j.top,
                    g = j.width,
                    f = j.height,
                    x = 0,
                    E = 0;
                2 == B.length ? (x = "n" == B.charAt(0) ? -1 : 1, E = "w" == B.charAt(1) ? -1 : 1) : (x = "n" == B ? -1 : "s" == B ? 1 : 0, E = "w" == B ? -1 : "e" == B ? 1 : 0),
                    x && f + y(x) * c < N / 2 && (x = -x, H[1] = j.top + (x > 0 ? j.height : 0), c = n[1] - H[1]), E && g + y(E) * l < S / 2 && (E = -E, H[0] = j.left + (E > 0 ? j
                        .width : 0), l = n[0] - H[0]), vsign = x ? y(x) : 0, hsign = E ? y(E) : 0, b > 0 && g + hsign * l < (f + vsign * c) * b && (E ? l = hsign * m((f + vsign *
                        c) * b - g) : c = vsign * u(g / b - f)), A > 0 && g + hsign * l > (f + vsign * c) * A && (x ? c = vsign * m((g + hsign * l) / A - f) : l = hsign * u(f * A -
                        g)), x && (f += y(x) * c, N > f ? (a -= x > 0 ? 0 : N - f - c, f = N) : a += x > 0 ? 0 : c), E && (g += y(E) * l, S > g ? (h -= E > 0 ? 0 : S - g - l, g =
                        S) : h += E > 0 ? 0 : l);
                var C = 0,
                    M = 0,
                    T = 0,
                    Y = 0;
                0 > h ? (C = h, h = 0) : g > F - h && (C = F - h - g), C && (g += C, b > 0 && b * f > g && (Y = u(g / b) - f, f += Y, a -= x > 0 ? 0 : Y)), 0 > a ? (M = a, a = 0) :
                    f > R - a && (M = R - a - f), M && (f += M, A > 0 && g > A * f && (T = u(f * A) - g, g += T, h -= E > 0 ? 0 : T)), k({
                        left: h,
                        top: a,
                        width: g,
                        height: f
                    }), H[0] = j.left + (E > 0 ? j.width : 0), H[1] = j.top + (x > 0 ? j.height : 0), x = x > 0 ? "s" : 0 > x ? "n" : "", E = E > 0 ? "e" : 0 > E ? "w" : "", B !=
                    x + E && (B = x + E, K())
            }
            return 3 == B && (n[0] -= O[0], n[1] -= O[1], n[0] = w(F, p(0, n[0])), n[1] = w(R, p(0, n[1])), K((y((H[0] - n[0]) * (H[1] - n[1]) * (.5 - z % 2)) > 0 ? "nw" : "ne") +
                "-resize"), k({
                left: H[0] > n[0] ? n[0] : H[0],
                top: H[1] > n[1] ? n[1] : H[1],
                width: v(H[0] - n[0]),
                height: v(H[1] - n[1])
            }, !0)), cancelEvent(t)
        },
        V = function(h) {
            O = getXY(e), elemWH = getSize(e);
            var a, o = P(h);
            if (2 == B) {
                o[0] -= O[0], o[1] -= O[1];
                var r = w(F - C, p(0, o[0] - i)),
                    d = w(R - M, p(0, o[1] - n));
                k({
                    left: r,
                    top: d,
                    width: C,
                    height: M
                })
            } else if (3 == B) {
                o[0] -= O[0], o[1] -= O[1], o[0] > H[0] && (a = o[0], o[0] = H[0], H[0] = a), o[1] > H[1] && (a = o[1], o[1] = H[1], H[1] = a);
                var l = H[0] - o[0],
                    c = H[1] - o[1];
                if (o[0] < 0 && (l += o[0], o[0] = 0), o[1] < 0 && (c += o[1], o[1] = 0), l = w(l, F - o[0]), c = w(c, R - o[1]), b > 0 && c * b > l) {
                    var g, f, v = m(c * b) - l,
                        y = intval(v / 2);
                    o[0] -= y, l += v, g = o[0] < 0 ? o[0] : 0, o[0] -= g, o[0] + l + g > F && (g = F - l - o[0]), g && (f = u(g / b), l += g, o[1] -= intval(f / 2), c += f)
                } else if (A > 0 && l > c * A) {
                    var g, f, v = m(l / A) - c,
                        y = intval(v / 2);
                    o[1] -= y, c += v, f = o[1] < 0 ? o[1] : 0, o[1] -= f, o[1] + c + f > R && (f = R - c - o[1]), f && (g = u(f * A), c += f, o[0] -= intval(g / 2), l += g)
                }
                if (S > l) {
                    var v = S - l,
                        y = intval(v / 2);
                    o[0] -= y, l += v, o[0] = w(F - l, p(0, o[0]))
                }
                if (N > c) {
                    var v = N - c,
                        y = intval(v / 2);
                    o[1] -= y, c = N, o[1] = w(R - c, p(0, o[1]))
                }
                k({
                    left: o[0],
                    top: o[1],
                    width: l,
                    height: c
                })
            }
            return show(X, _), each(q, function() {
                    fadeTo(this, 200, .3)
                }), hide(s), B = 0, removeEvent(bodyNode, "mousemove", U), removeEvent(bodyNode, "mouseup", V), removeEvent(bodyNode, "dragend", V), t.onFinish && t.onFinish(),
                cancelEvent(h)
        };
    return function() {
        if (F = T.width, R = T.height, !F || !R) return void(++g < 50 && setTimeout(arguments.callee, 100));
        var d = getSize(e);
        if (F = d[0], R = d[1], f.style.position = "relative", h = e.offsetLeft, a = e.offsetTop, C = w(F, C), i = intval(C / 2), M = w(R, M), n = intval(M / 2), S = w(S, C),
            N = w(N, M), b > 0 && N * b > S ? S = m(N * b) : A > 0 && S > N * A && (N = m(S / A)), E && (t.preview50 && (o = ge(t.preview50)
                .appendChild(ce("img", {
                    src: e.src
                })), addEvent(o, "mousedown", Q)), t.preview100 && (r = ge(t.preview100)
                .appendChild(ce("img", {
                    src: e.src
                })), addEvent(r, "mousedown", Q))), s = bodyNode.appendChild(ce("div", {
                className: "tag_bg fixed"
            })), addEvent(window, "resize", G), G(), e.style.zIndex = x + 20, X = f.appendChild(ce("div", {
                className: "tag_frame",
                innerHTML: '<div class="tag_frame_inner"><img src="' + e.src + '" style="width: ' + F + "px; height: " + R + 'px;" /></div>'
            }, {
                cursor: "move",
                zIndex: x + 40,
                left: 0,
                top: 0
            })), Y = geByTag1("img", X), _ = f.appendChild(ce("div", {
                className: "tag_faded"
            }, {
                cursor: "crosshair",
                left: h,
                top: a,
                width: F,
                height: R,
                zIndex: x + 30
            })), each(["nw", "n", "ne", "w", "e", "sw", "s", "se"], function() {
                var e = this.toString();
                t.square && e.length < 2 || (q[e] = f.appendChild(ce("div", {
                    className: "tag_frame_handle " + e
                }, {
                    cursor: e + "-resize",
                    zIndex: x + 50
                })))
            }), addEvent(f, "mousedown", Q), E && t.crop) {
            for (var l = t.crop.split(","), c = 0; 3 > c; ++c) l[c] = intval(l[c]);
            l[2] < S && (l[2] = S), t.rect = {
                left: l[0],
                top: l[1],
                width: l[2],
                height: l[2]
            }
        }
        t.rect ? (k(t.rect), show(_, X), each(q, function() {
            show(this)
        })) : (e.style.cursor = "crosshair", addEvent(e, "mousedown", Q))
    }(), {
        destroy: function() {
            cleanElems(f, e, X, _, o, r), bodyNode.removeChild(s), f.removeChild(X), f.removeChild(_), each(["nw", "n", "ne", "w", "e", "sw", "s", "se"], function() {
                var e = this.toString();
                q[e] && f.removeChild(q[e])
            }), e.style.cursor = "default", removeEvent(e, "mousedown", Q), removeEvent(window, "resize", G), each(q, function() {
                cleanElems(this)
            })
        },
        reset: function() {
            j = {}, hide(_, X), each(q, function() {
                hide(this)
            }), e.style.cursor = "crosshair", removeEvent(e, "mousedown", Q), addEvent(e, "mousedown", Q)
        },
        resize: function(t, o) {
            d || (d = F, l = R, c = clone(j));
            var r = t / d,
                s = o / l;
            F = t, R = o, C = w(F, C), i = intval(C / 2), M = w(R, M), n = intval(M / 2), S = w(S, C), N = w(N, M), b > 0 && N * b > S ? S = m(N * b) : A > 0 && S > N * A &&
                (N = m(S / A)), h = e.offsetLeft, a = e.offsetTop, setStyle(_, {
                    left: h,
                    top: a,
                    width: t,
                    height: o
                }), setStyle(Y, {
                    width: t,
                    height: o
                }), j.width && (j.left = u(r * c.left), j.width = u(r * c.width), j.top = u(s * c.top), j.height = u(s * c.height), j.width < S && (j.width = S), j.height <
                    N && (j.height = N), k(j))
        },
        rotate: function(e) {
            if (e % 2) {
                var t = b;
                b = 1 / A, A = 1 / t, t = S, S = N, N = t, j.width && (j.width < S && (j.left = p(0, j.left - u((S - j.width) / 2)), j.width = S), j.height < N && (j.top =
                    p(0, j.top - u((N - j.height) / 2)), j.height = N), j.width < j.height * b && (j.height = u(j.width / b)), j.width > j.height * A && (j.width =
                    u(j.height * A)), k(j))
            }
            z = (z + e) % 4, each(q, function(e) {
                this.style.cursor = J(e) + "-resize"
            })
        },
        result: function() {
            var e = F,
                t = R;
            switch (z) {
                case 1:
                    return [t - j.top - j.height, j.left, j.height, j.width];
                case 2:
                    return [e - j.left - j.width, t - j.top - j.height, j.width, j.height];
                case 3:
                    return [j.top, e - j.left - j.width, j.height, j.width];
                default:
                    return [j.left, j.top, j.width, j.height]
            }
        }
    }
}
try {
    stManager.done("tagger.js")
} catch (e) {}
