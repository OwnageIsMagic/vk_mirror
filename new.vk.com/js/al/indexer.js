function vkIndexer(r, e, t) {
    this.list = r, this.iterCur = 0, this.iterEnd = r ? r.length : 0, this.index = {}, this.callback = t || function() {}, this.prepareFunc = e || function(r) {
        return r
    }, setTimeout(this.indexIteration.bind(this), 10)
}
vkIndexer.prototype.delimiter = vkIndexer.delimiter = new RegExp("[\\s\\-\\.,\\\"\\'\\�\\(\\)\\[\\]\\{\\}\\+\\?\\\\]+", "g"), vkIndexer.prototype.trimmer = new RegExp(
    "^[\\s\\-\\.,\\\"\\'\\�\\(\\)\\[\\]\\{\\}\\+\\?\\\\]+|[\\s\\-,\\\"\\'\\�\\(\\)\\[\\]\\{\\}\\\\]+$", "g"), vkIndexer.prototype.toTranslit = {
    1072: "a",
    1073: "b",
    1074: "v",
    1075: "g",
    1076: "d",
    1077: "e",
    1078: "zh",
    1079: "z",
    1080: "i",
    1081: "y",
    1082: "k",
    1083: "l",
    1084: "m",
    1085: "n",
    1086: "o",
    1087: "p",
    1088: "r",
    1089: "s",
    1090: "t",
    1091: "u",
    1092: "f",
    1093: "h",
    1094: "ts",
    1095: "ch",
    1096: "sh",
    1097: "sh",
    1099: "y",
    1101: "e",
    1102: "yu",
    1103: "ya",
    1105: "e",
    1098: "",
    1100: ""
}, vkIndexer.prototype.toLocalCase = {
    f: "a",
    ",": "b",
    "<": "b",
    d: "v",
    u: "g",
    l: "d",
    t: "e",
    ";": "zh",
    ":": "zh",
    p: "z",
    b: "i",
    q: "y",
    r: "k",
    k: "l",
    v: "m",
    y: "n",
    j: "o",
    g: "p",
    h: "r",
    c: "s",
    n: "t",
    e: "u",
    a: "f",
    "[": "h",
    "{": "kh",
    w: "ts",
    x: "ch",
    i: "sh",
    o: "sh",
    s: "y",
    "'": "e",
    '"': "e",
    ".": "yu",
    ">": "yu",
    z: "ya",
    "`": "e",
    "~": "e",
    m: "",
    "]": "",
    "}": ""
}, vkIndexer.prototype.toLocalTranslit = {
    1072: "f",
    1074: "d",
    1075: "u",
    1076: "l",
    1077: "t",
    1079: "p",
    1080: "b",
    1081: "q",
    1082: "r",
    1083: "k",
    1084: "v",
    1085: "y",
    1086: "j",
    1087: "g",
    1088: "h",
    1089: "c",
    1090: "n",
    1091: "e",
    1092: "a",
    1094: "w",
    1095: "x",
    1096: "i",
    1097: "o",
    1099: "s",
    1103: "z",
    1098: "m"
}, vkIndexer.prototype.indexIteration = function() {
    for (var r = Math.min(this.iterEnd, this.iterCur + 200), e = this.iterCur; r > e; e++) {
        var t = this.list[e];
        t._order = e, this.add(t)
    }
    this.iterCur = e, e >= this.iterEnd ? this.callback(this) : setTimeout(this.indexIteration.bind(this), 10)
}, vkIndexer.prototype.strToPrefixes = function(r) {
    for (var e = {}, t = winToUtf(r)
            .toLowerCase()
            .split(this.delimiter), i = t.length; i--;) {
        var n = t[i],
            o = "";
        if (n) {
            for (var s = 0; 6 > s; s++) {
                var a = n.charCodeAt(s);
                if (a) {
                    var h = this.toTranslit[a],
                        f = n.substr(s, 1);
                    o += void 0 != h ? h : f
                }
            }
            e[o] = 1
        }
    }
    return e
}, vkIndexer.prototype.strToSearchPrefixes = function(r) {
    for (var e = [], t = r.toLowerCase()
            .split(this.delimiter), i = t.length; i--;) {
        var n = {},
            o = t[i],
            s = "",
            a = "",
            h = "",
            f = o.length > 1;
        if (o) {
            for (var d = 0; 6 > d; d++) {
                var u = o.charCodeAt(d);
                if (u) {
                    var v = this.toTranslit[u],
                        p = o.substr(d, 1);
                    if (s += void 0 != v ? v : p, f) {
                        var c = this.toLocalCase[p],
                            l = this.toLocalTranslit[u];
                        a += void 0 != c ? c : p, h += void 0 != l ? l : p
                    }
                }
            }
            n[s] = 1, f && (n[a] = 2, n[h] = 3), e.push(n)
        }
    }
    return e
}, vkIndexer.prototype.toIndexTree = function(r, e) {
    for (var t = this.index, i = 0; 6 > i; i++) {
        var n = r.substr(i, 1) || -1;
        t = t[n] ? t[n] : t[n] = 5 == i ? [] : {}
    }
    t.push(e)
}, vkIndexer.prototype.remove = function(r) {
    var e = this.prepareFunc(r),
        t = this.strToPrefixes(e);
    for (var i in t) {
        for (var n = this.index, o = 0; 6 > o; o++) {
            var s = i.substr(o, 1) || -1;
            if (!n[s]) break;
            n = n[s]
        }
        if (n.length)
            for (var o in n)
                if (this.equals(n[o], r)) {
                    n.splice(o, 1);
                    break
                }
    }
}, vkIndexer.prototype.equals = function(r, e) {
    for (var t in r) switch (typeof r[t]) {
        case "object":
            if (!this.equals(r[t], e[t])) return !1;
            break;
        case "function":
            if ("undefined" == typeof r[t] || r[t].toString() != e[t].toString()) return !1;
            break;
        default:
            if (r[t] != e[t]) return !1
    }
    for (var t in e)
        if ("undefined" == typeof e[t]) return !1;
    return !0
}, vkIndexer.prototype.intersect = function(r, e) {
    for (var t = []; r.length > 0 && e.length > 0;) r[0]._order < e[0]._order ? r.shift() : r[0]._order > e[0]._order ? e.shift() : (this.equals(r[0], e[0]) && t.push(r.shift()),
        e.shift());
    return t
}, vkIndexer.prototype.add = function(r) {
    var e = this.prepareFunc(r),
        t = this.strToPrefixes(e);
    for (var i in t) this.toIndexTree(i, r)
}, vkIndexer.prototype.search = function(r) {
    var e = this.index,
        t = this.strToSearchPrefixes(r),
        i = [],
        n = !1;
    for (var o in t) {
        if (n && !i) break;
        var s = this.localSearch(t[o], 0, e);
        s.sort(function(r, e) {
            return r._order - e._order
        }), i = n ? this.intersect(i, s) : s, n = !0
    }
    for (var a = i[0], h = i.length + 1, f = [], d = 1; h > d; d++) {
        var u = i[d];
        u != a && (f.push(a), a = u)
    }
    return f
}, vkIndexer.prototype.localSearch = function(r, e, t) {
    if (!t) return [];
    var i = {};
    for (var n in r) {
        var o = n.substr(e, 1) || -1;
        i[o] || (i[o] = {}), i[o][n] = 1
    }
    if (6 == e++ || !t) return t;
    var s = [];
    for (var o in i)
        if (-1 == o)
            for (var a in t) s.push.apply(s, this.localSearch(i[o], e, t[a]));
        else {
            var h = this.localSearch(i[o], e, t[o]);
            s.push.apply(s, h)
        }
    return s
};
try {
    stManager.done("indexer.js")
} catch (e) {}
