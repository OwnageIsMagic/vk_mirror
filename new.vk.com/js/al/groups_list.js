var GroupsList = {
    showCreateBox: function() {
        return !showBox("/al_groups.php", {
            act: "create_box"
        })
    },
    createGroup: function(r, s) {
        var e = ge("group_create_title");
        return trim(val(e)) ? void ajax.post("al_groups.php", {
            act: "create",
            title: trim(val(e)),
            cls: radioval("club_type"),
            hash: r
        }, {
            onDone: function(r) {
                "title" == r && notaBene(ge("group_create_title"))
            },
            onFail: function(r) {
                return r ? (setTimeout(showFastBox({
                        title: getLang("global_error"),
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, r)
                    .hide, 3e3), !0) : void 0
            },
            showProgress: lockButton.pbind(s),
            hideProgress: unlockButton.pbind(s)
        }) : notaBene(e)
    },
    rand: function() {
        return Math.floor(1e4 * Math.random())
    },
    enter: function(r, s, e, o, t) {
        if (cur.invSwitching) return setTimeout(GroupsList.enter.pbind(r, s, e, o, t), 100), !1;
        var i, c, l = cur.scrollList.tab;
        "button" != r.tagName.toLowerCase() ? (r.backhtml || (r.backhtml = r.innerHTML), i = function() {
            var s = getSize(r)[0];
            r.innerHTML = '<span class="progress_inline"></span>', setStyle(domFC(r), {
                width: s
            })
        }, c = function() {
            r.innerHTML = r.backhtml
        }) : (i = lockButton.pbind(r), c = unlockButton.pbind(r));
        var n = GroupsList.rand(),
            u = GroupsList.rand();
        cur.scrollList[n] = u, cur.invSwitching = !0, ajax.post("/al_groups.php", {
            act: "enter",
            gid: s,
            hash: e,
            context: "2" + (o ? "_" + o : "")
        }, {
            onDone: function(r, e) {
                if (cur.invSwitching = !1, cur.scrollList && cur.scrollList[n] == u) {
                    var i = cur.scrollList.lists[l],
                        c = t ? 5 : 1;
                    if ("unsure" == o ? c = t ? 5 : 3 : "decline" == o ? c = t ? -3 : -1 : "undecided" == o && (c = 4), i && "loading" != i && "update" != i)
                        for (var a = 0, p = i.length; p > a; ++a) i[a][2] == s && (i[a][1] = c);
                    else cur.scrollList.processed[l][s] = c;
                    if (r && cur.scrollList.lists.groups) {
                        var h = cur.scrollList.lists.groups;
                        if ("join" != o && "unsure" != o && o) {
                            if ("undecided" == o)
                                for (var a in h) h[a][2] == r[2] && (h.splice(a, 1), cur.scrollList.counts.groups--)
                        } else h.unshift(r), cur.scrollList.counts.groups++;
                        GroupsList.updateIndexer(h), GroupsList.showMore(!0)
                    }
                    var d = ge("gl_inv" + s),
                        g = d && geByClass1("group_row_status", d);
                    d && (g.basehtml = g.innerHTML, g.innerHTML = e)
                }
            },
            onFail: function(r) {
                return r ? (setTimeout(showFastBox(getLang("global_error"), r)
                    .hide, 3e3), !0) : void 0
            },
            showProgress: i,
            hideProgress: c
        })
    },
    leave: function(r, s, e, o) {
        if (cur.invSwitching) return setTimeout(GroupsList.leave.pbind(r, s, e, o), 100), !1;
        if (!r.firstChild || "progress_inline" != r.firstChild.className) {
            var t, i, c = GroupsList.rand(),
                l = GroupsList.rand(),
                n = cur.scrollList.tab;
            cur.scrollList[c] = l, "button" != r.tagName.toLowerCase() ? (r.backhtml || (r.backhtml = r.innerHTML), t = function() {
                var s = getSize(r)[0];
                r.innerHTML = '<span class="progress_inline"></span>', setStyle(domFC(r), {
                    width: s
                })
            }, i = function() {
                r.innerHTML = r.backhtml
            }) : (t = lockButton.pbind(r), i = unlockButton.pbind(r)), cur.invSwitching = !0, ajax.post("/al_groups.php", {
                act: "leave",
                gid: s,
                hash: e,
                context: 2
            }, {
                onDone: function(r, e) {
                    if (cur.invSwitching = !1, cur.scrollList && cur.scrollList[c] == l) {
                        var o = cur.scrollList.lists[n];
                        if (o && "loading" != o && "update" != o)
                            for (var t = 0, i = o.length; i > t; ++t) o[t][2] == s && (o[t][1] = -1);
                        else cur.scrollList.processed[n][s] = -1;
                        var u = ge("gl_inv" + s),
                            a = u && geByClass1("group_row_status", u);
                        u && (a.basehtml = a.innerHTML, a.innerHTML = e)
                    }
                },
                showProgress: t,
                hideProgress: i
            })
        }
    },
    spam: function(r, s, e) {
        if (!domFC(r) || "progress_inline" != domFC(r)) {
            var o = GroupsList.rand(),
                t = GroupsList.rand(),
                i = cur.scrollList.tab;
            cur.scrollList[o] = t, ajax.post("/al_groups.php", {
                act: "spam",
                gid: s,
                hash: e,
                context: 1
            }, {
                onDone: function(r) {
                    if (cur.scrollList && cur.scrollList[o] == t) {
                        var e = cur.scrollList.lists[i];
                        if (e && "loading" != e && "update" != e)
                            for (var c = 0, l = e.length; l > c; ++c) e[c][2] == s && (e[c][1] = -2);
                        else cur.scrollList.processed[i][s] = -2;
                        var n = ge("gl_inv" + s),
                            u = n && geByClass1("group_row_status", n);
                        n && (u.innerHTML = r)
                    }
                },
                showProgress: function() {
                    r.oldhtml = r.innerHTML;
                    var s = getSize(r)[0];
                    r.innerHTML = '<span class="progress_inline"></span>', setStyle(domFC(r), {
                        width: s
                    })
                },
                hideProgress: function() {
                    r.innerHTML = r.oldhtml
                }
            })
        }
    },
    cancel: function(r, s, e) {
        if (!domFC(r) || "progress_inline" != domFC(r)
            .className) {
            var o = GroupsList.rand(),
                t = GroupsList.rand(),
                i = cur.scrollList.tab;
            cur.scrollList[o] = t, ajax.post("/al_groups.php", {
                act: "cancel",
                gid: s,
                hash: e,
                context: 1
            }, {
                onDone: function() {
                    if (cur.scrollList && cur.scrollList[o] == t) {
                        var r = cur.scrollList.lists[i];
                        if (r && "loading" != r && "update" != r) {
                            for (var e in r) r[e][2] == s && (r.splice(e, 1), cur.scrollList.counts.groups--);
                            GroupsList.updateIndexer(r), GroupsList.showMore(!0)
                        } else cur.scrollList.processed[i][s] = 0;
                        var c = ge("gl_inv" + s),
                            l = c && geByClass1("group_row_status", c);
                        c && l && l.basehtml && (l.innerHTML = l.basehtml)
                    }
                },
                showProgress: function() {
                    r.oldhtml = r.innerHTML;
                    var s = getSize(r)[0];
                    r.innerHTML = '<span class="progress_inline"></span>', setStyle(domFC(r), {
                        width: s
                    })
                },
                hideProgress: function() {
                    r.innerHTML = r.oldhtml
                }
            })
        }
    },
    updateIndexer: function(r) {
        cur.scrollList.cache.groups = {
            all: []
        };
        var s = cur.scrollList.cache.groups;
        for (var e in r) s.all.push(e);
        cur.scrollList.index.groups = new vkIndexer(s.all, function(s) {
            return r[s][0]
        })
    },
    rejectAll: function(r, s) {
        showFastBox(getLang("global_warning"), getLang("groups_sure_reject_all"), getLang("groups_reject_all_inv"), function(r) {
            ajax.post("/al_groups.php", {
                act: "reject_all",
                hash: s
            }, {
                showProgress: lockButton.pbind(r),
                hideProgress: unlockButton.pbind(r)
            })
        }, getLang("global_cancel"))
    },
    scrollCheck: function() {
        if (!browser.mobile && cur.scrollList) {
            var r = ge("ui_" + cur.scrollList.tab + "_load_more"),
                s = ge("ui_search_load_more");
            if (isVisible(r) || (r = s, isVisible(r))) {
                var e = document.documentElement,
                    o = window.innerHeight || e.clientHeight || bodyNode.clientHeight,
                    t = scrollGetY();
                (t + o > r.offsetTop || cur.searchOffset && t + 2 * o > r.offsetTop) && GroupsList.showMore()
            }
        }
    },
    initScroll: function() {
        GroupsList.destroyScroll(), addEvent(window, "scroll", GroupsList.scrollCheck), addEvent(window, "resize", GroupsList.scrollCheck)
    },
    destroyScroll: function() {
        removeEvent(window, "scroll", GroupsList.scrollCheck), removeEvent(window, "resize", GroupsList.scrollCheck)
    },
    locNav: function(r, s, e) {
        var o = r.tab,
            t = o || ("events" == e.act ? "future" : "groups");
        return delete r.tab, isEmpty(r) && void 0 !== o ? (hide("groups_list_tab_" + cur.scrollList.tab), GroupsList.updateSummary(cur.scrollList.counts[cur.scrollList.tab]),
            cur.scrollList.tab = t, cur.scrollList.summary = geByClass1("ui_tab_count", ge("groups_" + t + "_tab")), show("groups_list_tab_" + t), checkPageBlocks(),
            nav.setLoc(e), window.uiSearch && uiSearch.reset(cur.scrollList.query, !0), elfocus(cur.scrollList.query), GroupsList.updateSummary(cur.scrollList.counts[t]),
            cur.scrollList.offset = ge("groups_list_" + t)
            .childNodes.length, GroupsList.showMore(!0), window.uiTabs && uiTabs.hideProgress(ge("groups_" + t + "_tab")), !1) : void 0
    },
    init: function(r) {
        extend(cur, {
            module: "groups_list",
            _back: {
                text: getLang("groups_back_to_list"),
                show: [GroupsList.initScroll, elfocus.pbind("groups_list_search")],
                hide: [GroupsList.destroyScroll]
            },
            scrollList: {
                tab: r.tab,
                url: "al_groups.php",
                params: {
                    act: "get_list",
                    mid: r.mid
                },
                prefix: "groups_list_",
                query: ge("groups_list_search"),
                queryCont: gpeByClass("_wrap", ge("groups_list_search")),
                queryWrap: ge("group_u_search_input_wrap"),
                summary: geByClass1("ui_tab_count", ge("groups_" + (r.tab || "groups") + "_tab")),
                searchSummary: ge("groups_search_summary"),
                invites: ge("groups_invites_wrap"),
                invitesPreload: ge("groups_invites_preload"),
                invitesMoreLnk: ge("ui_invites_load_more"),
                searchWrap: ge("groups_list_search_wrap"),
                searchCont: ge("groups_list_search_cont"),
                eventsPopular: ge("events_popular_list"),
                perpage: 20,
                offset: ge("groups_list_" + r.tab)
                    .childNodes.length,
                lists: {},
                cache: {},
                index: {},
                processed: {
                    groups: {},
                    admin: {},
                    inv: {},
                    future: {},
                    past: {}
                },
                filtered: {},
                queries: {},
                counts: r.counts,
                genEmpty: r.genEmpty,
                genRow: r.genRow,
                genSummary: r.genSummary,
                genGroupsSummary: r.genGroupsSummary,
                invShown: r.invShown
            },
            filter: r.filter
        }), setTimeout(elfocus.pbind(cur.scrollList.query), 0), cur.nav.push(GroupsList.locNav), setTimeout(GroupsList.load, 0), vk.version ? addEvent(window, "load",
            GroupsList.initScroll) : GroupsList.initScroll(), cur.destroy.push(function(r) {
            r == cur && GroupsList.destroyScroll()
        }), GroupsList.initAdvancedSearchBlock(r)
    },
    initAdvancedSearchBlock: function(r) {
        return
    },
    updateSummary: function(r, s) {
        val(s ? cur.scrollList.searchSummary : cur.scrollList.summary, r ? langNumeric(r, "%s", !0) : "")
    },
    load: function(r, s) {
        var e = s || cur.scrollList.tab;
        if (!cur.scrollList.lists[e]) {
            var o = GroupsList.rand(),
                t = GroupsList.rand();
            cur.scrollList[o] = t, cur.scrollList.lists[e] = "loading", ajax.post(cur.scrollList.url, extend(cur.scrollList.params, {
                tab: e
            }), {
                onDone: function(s) {
                    if (cur.scrollList && cur.scrollList[o] == t) {
                        var i = "update" == cur.scrollList.lists[e];
                        if (i || "loading" == cur.scrollList.lists[e]) {
                            cur.scrollList.cache[e] = {
                                all: []
                            };
                            for (var c = cur.scrollList.processed[e], l = 0, n = s.length; n > l; ++l) res = c[s[l][2]], res && (s[l][1] = res), cur.scrollList
                                .cache[e].all.push(l);
                            cur.scrollList.lists[e] = s;
                            var u = i ? function() {
                                cur.scrollList && cur.scrollList[o] == t && cur.scrollList.tab == e && GroupsList.showMore(r)
                            } : function() {};
                            cur.scrollList.index[e] = new vkIndexer(cur.scrollList.cache[e].all, function(r) {
                                return cur.scrollList.lists[e][r][0]
                            }, u)
                        }
                    }
                },
                local: 1
            })
        }
    },
    getHighlight: function(r) {
        var s = cur.scrollList.index[cur.scrollList.tab],
            e = s.delimiter,
            o = s.trimmer;
        return r += " " + (parseLatin(r) || ""), r = escapeRE(r)
            .replace(/&/g, "&amp;"), r = r.replace(o, "")
            .replace(e, "|"), {
                re: new RegExp("(" + r + ")", "gi"),
                val: '<span class="highlight">$1</span>'
            }
    },
    showMore: function(r) {
        var s = cur.scrollList.tab,
            e = cur.scrollList.lists[s];
        if (!e || "loading" == e || "update" == e) return e || GroupsList.load(r), void(cur.scrollList.lists[s] = "update");
        var s = cur.scrollList.tab,
            e = cur.scrollList.cache[s].all,
            o = trim(cur.scrollList.query.value);
        cur.searchStr = o, void 0 === cur.scrollList.queries[s] && (cur.scrollList.queries[s] = "");
        var t = r || o != cur.scrollList.queries[s];
        if (t || r !== !1) {
            cur.scrollList.queries[s] = o;
            var i = !1;
            if (o) {
                if (e = cur.scrollList.cache[s]["_" + o], void 0 === e) {
                    var c = cur.scrollList.index[s].search(o),
                        l = {};
                    e = [];
                    for (var n = 0, u = c.length; u > n; ++n) l[c[n]] || (l[c[n]] = !0, e.push(c[n]));
                    e.sort(function(r, s) {
                        return r - s
                    }), cur.scrollList.cache[s]["_" + o] = e
                }
                i = GroupsList.getHighlight(o)
            }
            var a = e.length,
                p = ge(cur.scrollList.prefix + s),
                h = ge("ui_" + s + "_load_more");
            if (GroupsList.updateSummary(a), !a) return p.innerHTML = cur.scrollList.genEmpty(o), void(o && GroupsList.needSearch(s) ? t ? (GroupsList.serverSearch(p, o),
                hide(h)) : cur.searchOffset && GroupsList.serverSearchMore(p, o) : (hide(h), hide(cur.scrollList.searchWrap), show(cur.scrollList.eventsPopular),
                cur.searchOffset = 0));
            for (var d = t ? 0 : cur.scrollList.offset, g = Math.min(a, d + cur.scrollList.perpage), L = [], n = d; g > n; ++n) {
                var f = cur.scrollList.lists[s][e[n]];
                if (f) {
                    var v = f[0];
                    i && (v = v.replace(i.re, i.val)), L.push(cur.scrollList.genRow(f, v))
                }
            }
            if (o || d && !t || (hide(cur.scrollList.searchWrap), show(cur.scrollList.eventsPopular), cur.searchOffset = 0), t)
                if (hasClass(cur.scrollList.queryCont, "ui_search_fixed") && scrollToY(getXY(cur.scrollList.queryWrap)[1] + 1, 0), p.innerHTML = L.join(""),
                    checkPageBlocks(), cur.searchOffset = !1, e.length < 5 && o && GroupsList.needSearch(s)) {
                    var _ = [];
                    for (var n in e) {
                        var m = cur.scrollList.lists[s][e[n]];
                        _.push(m[2])
                    }
                    GroupsList.serverSearch(p, o, _)
                } else hide(cur.scrollList.searchWrap), show(cur.scrollList.eventsPopular), cur.searchOffset = 0;
            else p.innerHTML += L.join(""), cur.searchOffset && GroupsList.serverSearchMore(p, o);
            cur.scrollList.offset = g, cur.searchOffset || (a > g ? show : hide)(h)
        }
    },
    showMoreInvites: function(r) {
        if (!cur.loadingInvites) {
            for (var s = cur.scrollList.invites && geByClass1("groups_list", cur.scrollList.invites), e = cur.scrollList.invitesPreload, o = cur.scrollList.invitesMoreLnk; domFC(
                    e);) s.appendChild(domFC(e)), cur.scrollList.invShown++;
            toggle(o, cur.scrollList.counts.invite > cur.scrollList.invShown), isVisible(o) && ajax.post("/al_groups.php", {
                act: "more_invites",
                offset: cur.scrollList.invShown
            }, {
                onDone: function(r) {
                    e.innerHTML = r
                },
                showProgress: function() {
                    cur.loadingInvites = !0
                },
                hideProgress: function() {
                    cur.loadingInvites = !1
                }
            })
        }
    },
    serverSearchMore: function(r, s) {
        if (!cur.searchLoadingMore) {
            cur.searchLoadingMore = 1;
            var e = ge("ui_search_load_more");
            e.innerHTML;
            ajax.post("/al_groups.php", GroupsList.extendWithAdvancedParams({
                act: "server_search",
                q: s,
                offset: cur.searchOffset,
                exclude: cur.searchExclude.join(",")
            }), {
                onDone: function(r, s, e) {
                    cur.searchLoadingMore = 0, r ? (cur.searchOffset += r, cur.scrollList.searchCont.appendChild(cf(s))) : cur.searchOffset = 0, (!s || e >= r ?
                        hide : show)("ui_search_load_more")
                },
                onFail: function() {
                    cur.searchLoadingMore = 0
                },
                showProgress: lockButton.pbind(domFC(e)),
                hideProgress: unlockButton.pbind(domFC(e))
            })
        }
    },
    extendedSearch: function(r, s) {
        var e = geByClass1("groups_section_search");
        if (window.searcher && e) {
            var o = searcher.getSectionParams();
            o["c[category]"] ? (uiRightMenu.switchMenu(e), uiRightMenu.showProgress(e), nav.go(e.href + "&c[q]=" + s)) : searcher.onEnter()
        } else nav.go("/groups?act=catalog&c[q]=" + s)
    },
    extendWithAdvancedParams: function(r) {
        return cur.isAdvancedSearch ? extend(r || {}, {
            extended: 1,
            safe: intval(cur.searchSafe),
            sort: intval(cur.searchSort || -1),
            type: intval(cur.searchGroupType || -1)
        }) : r
    },
    needSearch: function(r) {
        return "groups" == r || "future" == r || "past" == r
    },
    serverSearch: function(r, s, e) {
        return GroupsList.needSearch(cur.scrollList.tab) ? (clearTimeout(cur.searchTimeout), void(cur.searchTimeout = setTimeout(function() {
            cur.searchStr == s && (cur.searchExclude = e || [], ajax.post("/al_groups.php", GroupsList.extendWithAdvancedParams({
                act: "server_search",
                q: s,
                exclude: cur.searchExclude.join(",")
            }), {
                onDone: function(r, e, o) {
                    cur.searchStr == s && (r ? (cur.scrollList.searchCont.innerHTML = e, show(cur.scrollList.searchWrap), hide(cur.scrollList
                        .eventsPopular), (r > o || !e) && show("ui_search_load_more")) : (cur.scrollList.searchCont.innerHTML = "",
                        hide(cur.scrollList.searchWrap), show(cur.scrollList.eventsPopular)), checkPageBlocks(), GroupsList.updateSummary(
                        r, !0), cur.searchOffset = r)
                },
                showProgress: uiSearch.showProgress.pbind(cur.scrollList.query),
                hideProgress: uiSearch.hideProgress.pbind(cur.scrollList.query)
            }))
        }, 300))) : !1
    },
    showMapBox: function(r, s, e) {
        window.showZeroZoneBox && showZeroZoneBox("places", function() {
            GroupsList.showMapBox(r, s, e)
        }) || showTabbedBox("/al_places.php", {
            act: "show_photo_place",
            place_id: r
        }, {
            stat: ["places.css", "map.css", "maps.js", "ui_controls.css", "ui_controls.js"]
        })
    },
    feedbanGroup: function(r, s, e) {
        var o = -s;
        ajax.post("/al_fans.php", {
            act: "feedtgl",
            oid: o,
            hash: e
        }, {
            onDone: function(e, o) {
                if (r.innerHTML = o, cur.scrollList.lists && cur.scrollList.lists.groups) {
                    var t = cur.scrollList.lists.groups;
                    if (t && t.length)
                        for (var i = 0, c = t.length; c > i; ++i)
                            if (t[i][2] == s) {
                                cur.scrollList.lists.groups[i][12] = e;
                                break
                            }
                }
            },
            showProgress: function() {
                r.innerHTML = '<span class="progress_inline"></span>'
            }
        })
    }
};
try {
    stManager.done("groups_list.js")
} catch (e) {}
