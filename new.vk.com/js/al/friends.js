var Friends = {
    init: function(friendsTpl, commonTpl) {
        extend(cur, {
            fSearchWrap: geByClass1("friends_search_cont", "friends"),
            fSearch: ge("s_search"),
            fSearchFilterLnk: geByClass1("ui_search_fltr_control", "market_search_wrap"),
            module: "friends",
            fListEl: ge("friends_list"),
            showMore: ge("show_more"),
            pageEnd: ge("page_end"),
            fContent: ge("list_content"),
            fSearchContent: ge("friends_search_cont"),
            friendsTpl: friendsTpl,
            commonTpl: commonTpl,
            savedMasks: {},
            friends: {},
            timeouts: {}
        }), cur.secData || (cur.secData = {}), cur.curList = cur.section, placeholderInit(cur.fSearch), setTimeout(function() {
            isVisible("friends_search_input_wrap") && elfocus(cur.fSearch)
        }, 0), Friends.scrollNode = browser.msie6 ? pageNode : window, addEvent(Friends.scrollNode, "scroll", Friends.scrollResize), setTimeout(function() {
            cur.destroy.push(function() {
                clearTimeout(cur.resizeTimeout), removeEvent(Friends.scrollNode, "scroll", Friends.scrollResize)
            })
        }, 0), cur.silent || this.indexAll(function() {
            "list" == cur.section.substr(0, 4) && (cur.friendsList[cur.section] = Friends.filter(cur.friendsList.all, cur.section)), cur.friendsList[cur.section] &&
                cur.friendsList[cur.section].length || show("friends_not_found")
        }), cur.nav.push(function(e, r, s) {
            if ("id" in e || "sort" in e || "act" in e || isEmpty(e)) return !0;
            if ("friends" == s[0] || "al_friends.php" == s[0] && e.section) {
                var n = e.section;
                return "requests" != n && "all_requests" != n && "out_requests" != n || cur.requestsCount || cur.suggCount || cur.allRequestsCount || cur.outRequestsCount ?
                    "requests" != n || cur.requestsCount || cur.suggCount ? "all_requests" != n || cur.allRequestsCount ? ("out_requests" != n || cur.outRequestsCount) &&
                    ("subscribers" != n || cur.subscribersCount) ? (("all" == n || "online" == n || "requests" == n || "all_requests" == n || "out_requests" == n) &&
                        __adsUpdate("force"), "all_requests" != n || "sort" in e || cur.sortByCommon || (delete s.sort, setTimeout(Friends.changeSummary, 0)), this
                        .section(s.section, function() {
                            this.changeSummary(), nav.setLoc(s)
                        }.bind(this)), !1) : nav.change({
                        section: "all"
                    }) : nav.change({
                        section: cur.requestsCount || cur.suggCount ? "requests" : "out_requests"
                    }) : nav.change({
                        section: cur.allRequestsCount ? "all_requests" : "out_requests"
                    }) : nav.change({
                        section: "all"
                    })
            }
            return "al_friends.php" == s[0] || "friends" == s[0] ? !1 : void 0
        }.bind(this)), cur.silent && ajax.post("al_friends.php", {
            act: "load_friends_silent",
            id: cur.oid,
            gid: cur.gid,
            sort: nav.objLoc.sort
        }, {
            onDone: function(data, occupations, filters) {
                removeClass(cur.showMore, "load_more"), cur.silent = !1;
                var obj = eval("(" + data + ")");
                if (obj) {
                    cur.occupations = extend(cur.occupations || {}, occupations);
                    for (var i in obj) cur.friendsList[i] = obj[i];
                    this.indexAll(function() {
                        "list" == cur.section.substr(0, 4) && (cur.friendsList[cur.section] = Friends.filter(cur.friendsList.all, cur.section)), (cur.onSilentLoad ||
                            Friends.showMore)()
                    }), filters.cities && stManager.add(["ui_controls.js", "ui_controls.css"], function() {
                        cur.cityFilter.setData(filters.cities), cur.cityFilterOpened && (hide("friends_fltr_progress"), cur.cityFilter.showDefaultList())
                    })
                }
            }.bind(this),
            local: 1
        })
    },
    indexAll: function(e) {
        var r = cur.friendsList.all;
        cur.friendsIndex = new vkIndexer(r, function(e) {
            var r = parseInt(e[0]);
            return cur.friends && r && (cur.friends[r] = e), e[5] || ""
        }, function() {
            cur.silent || (cur.friendsList.online = Friends.filter(r, "online"), "common" == cur.section && (cur.friendsList.common = Friends.filter(r, "common")),
                e && e()), Friends.initBackFunc()
        }), "phonebook" == cur.section && Friends.indexPhone()
    },
    indexPhone: function() {
        cur.phoneIndex = new vkIndexer(cur.friendsList.phonebook, function(e) {
            var r = e[11][0] || "",
                s = e[11][1] || "",
                n = e[11][2] || "";
            return [e[5], r, r.replace(/[^0-9\+]/g, ""), s, s.replace(/[^0-9\+]/g, ""), n].join(" ")
        })
    },
    initBackFunc: function() {
        cur._back = {
            text: cur.backLang,
            show: [function() {
                addEvent(Friends.scrollNode, "scroll", Friends.scrollResize)
            }],
            hide: [function() {
                if (Friends.searchTimout && clearTimeout(Friends.searchTimout), cur.timeouts)
                    for (var e in cur.timeouts) clearTimeout(cur.timeouts);
                removeEvent(Friends.scrollNode, "scroll", Friends.scrollResize)
            }]
        }
    },
    switchTab: function(e, r, s) {
        if (checkEvent(s)) return !0;
        uiTabs.switchTab(e);
        var n = {
            0: "friends",
            section: r
        };
        return checkEvent(s) || nav.change(n)
    },
    switchMenu: function(e, r, s) {
        if (void 0 !== e.href && checkEvent(s)) return !0;
        var n = gpeByClass("ui_rmenu", e);
        if (geByClass1("ui_rmenu_item_sel", n) == e) return !1;
        uiRightMenu.switchMenu(e);
        var i = {
            0: "friends",
            section: r
        };
        if (vk.id != cur.oid) i.id = cur.oid;
        else if (cur.gid) return nav.change({
            section: r
        }), !1;
        return "find" == nav.objLoc.act && uiRightMenu.showProgress(e), nav.go(i, s), scrollToTop(0), !1
    },
    filter: function(e, r) {
        var s = e ? e.length : 0,
            n = [];
        if ("list" == r.substr(0, 4)) {
            var i = parseInt(r.substr(4));
            r = "list"
        }
        for (var t = 0; s > t; t++) {
            var o = e[t];
            if (!cur.filterIds || cur.filterIds[parseInt(o[0])]) switch (r) {
                case "online":
                    intval(o[4]) && n.push(o);
                    break;
                case "common":
                    cur.commonCount && o[11] && n.push(o);
                    break;
                case "list":
                    parseInt(o[6]) & 1 << i && n.push(o);
                    break;
                default:
                    n.push(o)
            }
        }
        return n
    },
    loadMore: function(start, end, force_section) {
        var section = force_section ? force_section : cur.section,
            list = cur.curList,
            curData = cur.secData[section],
            showMore = "sugg_requests" == force_section ? ge("friends_search_more") : cur.showMore;
        curData.loading || (curData.loading = !0, addClass(showMore, "load_more"), show(showMore), ajax.post("/friends", extend({
            act: "get_section_friends",
            section: section,
            offset: start,
            id: cur.oid,
            gid: cur.gid,
            sort: nav.objLoc.sort
        }, cur.filter), {
            onDone: function(data, preload) {
                removeClass(showMore, "load_more");
                var response = eval("(" + data + ")");
                cur.friendsList && (cur.friendsList[list] || (cur.friendsList[list] = []), "requests" == list && response.sugg_requests ? Array.prototype.push
                    .apply(cur.friendsList.sugg_requests, response.sugg_requests) : Array.prototype.push.apply(cur.friendsList[list], response[section]),
                    this.showMore(!1, start, end), curData.loading = !1, curData.preload = preload)
            }.bind(this)
        }))
    },
    showMore: function(e, r, s, n) {
        if (!cur.friendsList) return !1;
        var t = cur.curList,
            o = cur.friendsList[t],
            c = cur.friendsPerPage,
            u = "requests" == cur.section && !e && cur.suggCount && (!isVisible(cur.showMore) || hasClass(cur.showMore, "manual")),
            a = cur.showMore,
            d = cur.section,
            l = cur.sectionCount,
            f = cur.shownFriends;
        if (u || "requests" != cur.section || !cur.suggCount || cur.shownFriends || r || (c = 3, addClass(cur.showMore, "manual"), show(cur.showMore)), -1 === e && (
                hasClass(cur.showMore, "manual") && (removeClass(cur.showMore, "manual"), cur.pageEnd = ge("friends_search_wrap")), e = !1), !u) {
            if (!o || !o.length) {
                if (0 == cur.shownFriends && !cur.searchCount) {
                    if (cur.isLoading) return !1;
                    cur.searchStr ? (addClass("friends_not_found", "friends_search"), ge("search_ph")
                        .innerHTML = cur.searchStr.replace(/([<>&#]*)/g, "")) : removeClass("friends_not_found", "friends_search"), removeClass("friends_not_found",
                        "friends_only_other");
                    var h = "";
                    "list" == cur.curList.substr(0, 4) ? cur.filterIds ? (h = cur.summaryLang.list_not_found_filter, h = h.replace("{link}",
                                '<a onclick="Friends.clearFilter(true);">')
                            .replace("{/link}", "</a>")) : (h = cur.summaryLang.list_not_found, h = h.replace("{link}", '<a onclick="Friends.editList(-1);">')
                            .replace("{/link}", "</a>")) : "requests" == cur.section ? h = cur.summaryLang.friends_no_friend_requests : cur.filter ? (h = cur.summaryLang.not_found_filter,
                            h = h.replace("{link}", '<a onclick="Friends.clearFilter(true);">')
                            .replace("{/link}", "</a>")) : h = cur.summaryLang.not_found, ge("friends_not_found_text")
                        .innerHTML = h, show("friends_not_found")
                }
                return e && (cur.fContent.innerHTML = ""), cur.searchCount && Friends.serverSearchMore(), hide("show_more", "friends_search_more"), void("requests" == cur.section &&
                    e && cur.suggCount && (cur.fSearchContent.innerHTML = "", this.showMore(!1, r, s, n), show("friends_search_wrap")))
            }
            isVisible("friends_not_found") && (hide("friends_not_found"), removeClass("friends_not_found", "friends_only_other"))
        }
        u && (o = (cur.friendsList.sugg_requests || [])
            .slice(), d = "sugg_requests", l = cur.suggCount, a = ge("friends_search_more"), f = cur.shownSugg), void 0 == r && (r = f), void 0 == s && (s = f + c);
        var _ = o.slice(r, s);
        if (!_.length) {
            var g = cur.secData[d];
            return g && g.preload && Friends.loadMore(r, s, d), cur.searchCount && Friends.serverSearchMore(), void(f >= l && hide(a))
        }
        var p = [];
        e && (cur.fContent.innerHTML = "");
        for (i in _) {
            if (cur.selection) {
                var m = _[i].slice();
                m[5] = m[5].replace(cur.selection.re, cur.selection.val)
            } else var m = _[i];
            if (++f, u ? ++cur.shownSugg : ++cur.shownFriends, m) {
                var v = "";
                u && (v = "sugg_requests"), Array.prototype.push.apply(p, Friends.drawFriend(m, v))
            }
        }
        return n ? '<div class="friends_list_bl">' + p.join("") + "</div>" : ((u ? cur.fSearchContent : cur.fContent)
            .appendChild(ce("div", {
                innerHTML: p.join(""),
                className: "friends_list_bl"
            })), f >= l ? (hide(a), cur.pageEnd = ge("page_end")) : show(a), void(!u && "requests" == cur.section && e && -1 !== e && cur.suggCount && (cur.fSearchContent
                .innerHTML = "", this.showMore(!1, r, s, n), show("friends_search_wrap"))))
    },
    updateList: function(e, r) {
        return cur.silent ? (cur.onSilentLoad = function() {
            Friends.updateList(e, !0)
        }, void(trim(e) && (hide(cur.showMore), cur.fContent.innerHTML = '<div class="friends_wide_loading"></div>'))) : (clearTimeout(Friends.searchTimout), void(
            Friends.searchTimout = setTimeout(function() {
                e && cur.searchStr == e || (cur.searchStr = e, e ? ("all" != cur.section && "phonebook" != cur.section && (this.selectTab("all"), this.selectSection(
                        "all"), cur.curList = cur.section = "all", nav.setLoc(extend(nav.objLoc, {
                        section: "all"
                    }))), this.search(e, cur.section), this.changeSummary()) : cur.section != cur.curList || r ? (this.showSection(), this.changeSummary(),
                        this.showMore()) : (this.hideLoading(), cur.searchCount = 0, this.showMore()), hasClass(cur.fSearchWrap, "ui_search_fixed") &&
                    scrollToY(ge("friends_search_input_wrap")
                        .offsetTop, 0))
            }.bind(Friends), 10)))
    },
    showSection: function(e) {
        if (cur.shownFriends = cur.shownSugg = 0, cur.curList = cur.section = e || cur.section, vk.id == cur.oid) {
            var r = "requests" == cur.section || "all_requests" == cur.section || "out_requests" == cur.section;
            if (removeClass("friends", "friends_phonebook"), removeClass("friends", "friends_requests"), hide(cur.fSearchFilterLnk, "friends_sort_control",
                    "friends_req_block"), r) {
                ("requests" == cur.section && cur.requestsCount > 50 || "all_requests" == cur.section && cur.allRequestsCount > 10) && show("friends_sort_control"), hide(
                    "friends_search_input_wrap", "friends_search_header"), show("friends_sugg_header");
                var s = (cur.requestsCount || cur.suggCount ? 1 : 0) + (cur.allRequestsCount ? 1 : 0) + (cur.outRequestsCount ? 1 : 0);
                toggle(geByClass1("friends_section_requests", "narrow_column"), s >= 1), toggle("friends_tab_requests", cur.requestsCount > 0 || cur.suggCount > 0), toggle(
                    "friends_tab_all_requests", cur.allRequestsCount > 0), toggle("friends_tab_out_requests", cur.outRequestsCount > 0), addClass("friends",
                    "friends_requests")
            } else if ("phonebook" == cur.section) show("friends_search_input_wrap", cur.fSearchFilterLnk), Friends.showListHeader(cur.summaryLang.friends_filter_phonebook),
                addClass("friends", "friends_phonebook");
            else if ("recent" == cur.section) show("friends_search_input_wrap", cur.fSearchFilterLnk), Friends.showListHeader(cur.summaryLang.friends_tab_recently_added);
            else if (hide("friends_sugg_header"), show("friends_search_input_wrap", "friends_search_header", cur.fSearchFilterLnk), cur.requestsCount && cur.friendsList.requests) {
                var n = ge("friends_req_block");
                geByClass1("_friends_list", n)
                    .innerHTML = cur.commonTpl(cur.friendsList.requests[0], "requests")
                    .join(""), show(n)
            }
            val(geByClass1("_label", cur.showMore), r ? cur.summaryLang.friends_show_more_requests : cur.summaryLang.friends_show_more_friends)
        } else cur.gid || ("subscribers" == cur.section ? (hide("friends_search_input_wrap"), Friends.showListHeader(cur.summaryLang.friends_tab_subscribers)) : show(
            "friends_search_input_wrap"));
        isVisible("friends_search_input_wrap") && (hasClass("friends_search_input_wrap", "ui_search_fixed") && setStyle(cur.fSearchWrap, {
            width: ""
        }), uiSearch.scrollResize(cur.fSearchWrap), elfocus(cur.fSearch)), cur.filterIds && (cur.curList += "_filter");
        var i = cur.friendsList[cur.curList];
        if (!i) {
            if ("recent" == e || "phonebook" == e || "requests" == e) var t = e;
            else var t = "all";
            i = cur.friendsList[cur.curList] = this.filter(cur.friendsList[t], cur.section)
        }
        return cur.sectionCount = i ? i.length : 0, cur.selection = !1, cur.filter && !cur.filterIds ? (Friends.changeFilter(), cur.searchStr || this.clearServerSearch(), !
            1) : void this.showMore(!0)
    },
    updateView: function() {
        cur.fContent.innerHTML = this.showMore(!1, 0, cur.shownFriends, !0)
    },
    showLoading: function() {
        cur.isLoading = 1, uiSearch && uiSearch.showProgress("s_search")
    },
    hideLoading: function() {
        cur.isLoading = 0, uiSearch && uiSearch.hideProgress("s_search")
    },
    serverSearchMore: function() {
        return "requests" == cur.section ? void Friends.showMore() : void(cur.serverLoadingMore || cur.searchFinished || (cur.serverLoadingMore = !0, ajax.post("friends", {
            act: "server_search",
            q: cur.searchStr,
            offset: cur.searchOffset
        }, {
            onDone: function(e, r, s) {
                cur.searchFinished = !r, cur.searchFinished && hide("friends_search_more"), cur.searchOffset = s, cur.serverLoadingMore = !1, e && ge(
                        "friends_search_cont")
                    .appendChild(ce("div", {
                        innerHTML: e,
                        className: "friends_list_bl"
                    }))
            },
            showProgress: function() {
                addClass(ge("friends_search_more"), "load_more")
            },
            hideProgress: function() {
                removeClass(ge("friends_search_more"), "load_more")
            }
        })))
    },
    serverSearch: function(e, r, s) {
        cur.searchCount = 0, Friends.showLoading(), cur.serverSearchStr = e, clearTimeout(cur.serverSearchTimeout);
        var n = [];
        for (var i in s) n.push(s[i][0]);
        cur.serverSearchTimeout = setTimeout(function() {
            ajax.post("friends", {
                act: "server_search",
                q: e,
                exclude: n.join(",")
            }, {
                onDone: function(s, n, i) {
                    if (cur.searchOffset = i, cur.searchFinished = !n, Friends.hideLoading(), cur.searchStr == e) {
                        if (cur.searchCount = n, 0 == cur.shownFriends && (hide("friends_search_wrap"), cur.fContent.innerHTML = "", Friends.showMore()), !
                            n) return void Friends.changeSummary();
                        cur.searchFinished ? hide("friends_search_more") : show("friends_search_more"), ge("friends_search_cont")
                            .innerHTML = '<div class="friends_list_bl">' + s + "</div>", show("friends_search_wrap"), Friends.changeSummary(), r ?
                            removeClass("friends_not_found", "friends_only_other") : (addClass("friends_not_found", "friends_only_other"), removeClass(
                                "friends_not_found", "friends_search"), show("friends_not_found"))
                    }
                },
                onFail: Friends.hideLoading
            })
        }.bind(this), 300)
    },
    clearServerSearch: function() {
        hide("friends_search_wrap"), hide("friends_search_more"), cur.searchCount = 0, cur.pageEnd = ge("page_end")
    },
    goToSearch: function(e) {
        nav.go("friends?act=find&c%5Bname%5D=1&c%5Bq%5D=" + encodeURIComponent(cur.searchStr) + "&c%5Bsection%5D=people")
    },
    search: function(e, r, s, n) {
        if (cur.shownFriends = 0, cur.section = r, e) {
            var i, t = "phonebook" == r ? cur.phoneIndex : cur.friendsIndex;
            if (-1 == e) {
                if ("phonebook" == r) var o = r;
                else var o = "all";
                i = this.filter(cur.friendsList[o], r), e = "", e != cur.searchStr && this.clearServerSearch()
            } else {
                i = t.search(e), cur.filterIds && (i = this.filter(i, r));
                var c = i.length;
                c && (e == cur.serverSearchStr || cur.sectionCount || this.clearServerSearch()), 5 > c && cur.oid == vk.id && !cur.gid && "phonebook" != r && this.serverSearch(
                    e, c, i)
            }
            var u = cur.section;
            if (cur.filterIds && (u += "_filter"), e && (u += "_search_" + e), cur.curList == u && !n) return;
            cur.curList = u, cur.friendsList[cur.curList] = i;
            var a = {
                all: 1,
                online: 1,
                common: 1
            };
            if ("" == e && cur.filterIds && a[r]) {
                delete a[r];
                for (var d in a) cur.friendsList[d] && (i = this.filter(cur.friendsList[o], d), cur.friendsList[d + "_filter"] = i)
            }
            e && (e += " " + (parseLatin(e) || ""), e = trim(escapeRE(e.replace(/[,]/g, ""))), cur.selection = {
                re: new RegExp("(" + e.replace(t.delimiter, "|")
                    .replace(/(^\||\|$|\?)/g, "") + ")", "gi"),
                val: '<em class="highlight">$1</em>'
            })
        } else cur.curList = cur.section, cur.selection = !1, cur.searchStr && this.clearServerSearch();
        cur.sectionCount = cur.friendsList[cur.curList].length, this.searchTimout = setTimeout(function() {
            this.showMore(!0), s && (Friends.onSectionChange(), s())
        }.bind(this), 10)
    },
    changeSummary: function(e) {
        var r = {
            all: cur.allFriendsCount,
            common: cur.commonCount
        };
        if (cur.friendsList.online && (r.online = cur.friendsList.online.length), cur.gid || vk.id != cur.oid || (r = extend(r, {
                requests: cur.requestsCount ? cur.requestsCount : "",
                all_requests: cur.allRequestsCount,
                out_requests: cur.outRequestsCount
            })), "list" == cur.curList.slice(0, 4) || "phonebook" == cur.curList.slice(0, 9)) ge("friends_list_count")
            .innerHTML = cur.sectionCount ? langNumeric(cur.sectionCount, "%s", !0) : "";
        else if ("subscribers" == cur.section) ge("friends_list_count")
            .innerHTML = cur.subscribersCount ? langNumeric(cur.subscribersCount, "%s", !0) : "";
        else if ("requests" == cur.section && cur.suggCount) ge("friends_sugg_count")
            .innerHTML = cur.suggCount ? langNumeric(cur.suggCount, "%s", !0) : "";
        else if (-1 != cur.curList.indexOf("_search_") || cur.filterIds) {
            if ("all" == cur.section) {
                if (!cur.sectionCount && !cur.searchCount && cur.isLoading) return;
                r.all = cur.sectionCount
            } else r.all = cur.friendsList.all_filter.length; - 1 == cur.curList.indexOf("_search_") ? (cur.friendsList.online_filter && (r.online = cur.friendsList.online_filter
                .length), cur.friendsList.common_filter && (r.common = cur.friendsList.common_filter.length)) : r.online = r.common = ""
        }
        if (each(r, function(e, r) {
                var s = ge("friends_tab_" + e);
                if (s) {
                    var n = geByClass1("ui_tab_count", s);
                    n && (n.innerHTML = r ? langNumeric(r, "%s", !0) : "")
                }
            }), !cur.gid && vk.id == cur.oid) {
            var s = intval(r.requests + cur.suggCount);
            s = s ? langNumeric(s, "%s", !0) : "", val(geByClass1("ui_rmenu_count", "ui_rmenu_requests"), s), val(geByClass1("page_block_header_count", "friends_req_block"),
                s), (s > 1 ? show : hide)(domPN(ge("friends_request_load_more")))
        }
        document.title = replaceEntities(stripHTML(cur.htitles[cur.section] || cur.htitles.all))
    },
    showListHeader: function(e, r) {
        ge("friends_list_title")
            .innerHTML = e, ge("friends_list_count")
            .innerHTML = "", each(ge("friends_tabs_wrap")
                .childNodes,
                function() {
                    "friends_tab_list" === this.id ? (removeClass(this, "unshown"), r ? vk.id == cur.oid && ((25 > r ? show : hide)("friends_list_delete_btn"), show(
                        "friends_list_edit_btn")) : hide("friends_list_edit_btn", "friends_list_delete_btn")) : addClass(this, "unshown")
                })
    },
    selectTab: function(e) {
        var e = geByClass1("ui_tab", "friends_tab_" + e),
            r = gpeByClass("ui_tabs", e);
        each(ge("friends_tabs_wrap")
            .childNodes,
            function() {
                this == r ? removeClass(this, "unshown") : addClass(this, "unshown")
            }), uiTabs.switchTab(e)
    },
    selectSection: function(e) {
        var r = geByClass1("friends_section_" + e, "narrow_column");
        r && uiRightMenu.switchMenu(r)
    },
    selectTabAndSection: function(e) {
        if ("all" == e || "online" == e || "common" == e || "members" == e) this.selectTab(e), this.selectSection("all");
        else if ("all_requests" == e || "requests" == e || "out_requests" == e) this.selectTab(e), this.selectSection("requests");
        else if ("list" == e.substr(0, 4)) {
            var r = parseInt(e.substr(4)),
                s = "";
            s = r >= 25 && 29 >= r ? cur.publicLists[r] : cur.userLists[r], this.showListHeader(s, r), isVisible("ui_rmenu_lists_list") || uiRightMenu.toggleSubmenu(
                "lists"), this.selectSection(e)
        } else this.selectTab("all"), this.selectSection(e)
    },
    onSectionChange: function() {
        window.tooltips && tooltips.hideAll()
    },
    section: function(type, callback, updateData) {
        if (Friends.clearServerSearch(), type || (type = "all"), updateData || ("online" != type || cur.oid == vk.id) && -1 == type.indexOf("requests") && "recent" != type ||
            "list" == type.substr(0, 4) || (Friends.clearFilter(), Friends.updateCurFilters()), type || (type = cur.requestsCount && cur.requestsCount > 0 && cur.requestsCount <
                100 || cur.suggCount ? "requests" : "all"), cur.requestsCount || cur.suggCount || cur.allRequestsCount || cur.outRequestsCount || hide(geByClass1(
                "friends_section_requests", "narrow_column")), hide("friends_req_block"), type != cur.section && (cur.fSearch.setValue(""), cur.searchStr = ""), this.selectTabAndSection(
                type), cur.silent && "out_requests" != type) return cur.onSilentLoad = function() {
            Friends.section(type, callback)
        }, void(type != cur.section && (hide(cur.showMore), cur.fContent.innerHTML = '<div class="friends_wide_loading"></div>'));
        if (cur.secData[type] || (cur.secData[type] = {}), !updateData && cur.friendsList[type] || "all" == type || "requests" == type && cur.friendsList.sugg_requests)
            return this.showSection(type), callback(), Friends.onSectionChange(), void(cur.filter && Friends.changeFilter());
        switch (type) {
            case "online":
            case "common":
                this.search(-1, type, callback);
                break;
            case "phonebook":
                var tab = geByClass1("friends_section_phonebook", "narrow_column");
                uiRightMenu.showProgress(tab), ajax.post("/al_friends.php", {
                    act: "phonebook",
                    id: nav.objLoc.id
                }, {
                    onDone: function(e) {
                        if (e) {
                            cur.shownFriends = 0, cur.curList = cur.section = type;
                            var r = cur.friendsList.all,
                                s = [];
                            if (r)
                                for (var n = 0, i = r.length; i > n; n++) {
                                    var t = r[n],
                                        o = e[t[0]];
                                    o && (t.push(o), s.push(t))
                                }
                            return s.sort(function(e, r) {
                                    return e[5].localeCompare(r[5], {
                                        sensitivity: "base"
                                    })
                                }), cur.friendsList[cur.section] = s, cur.sectionCount = s.length, cur.fContent.innerHTML = "", uiRightMenu.hideProgress(tab),
                                Friends.showSection(type), Friends.onSectionChange(), callback(), Friends.indexPhone(), cur.filterIds ? (cur.curList +=
                                    "_filter", Friends.search(cur.searchStr || -1, cur.section, !1, !0), void Friends.changeSummary()) : void this.showMore()
                        }
                    }.bind(this)
                });
                break;
            case "recent":
                var tab = geByClass1("friends_section_recent", "narrow_column");
                uiRightMenu.showProgress(tab), ajax.post("/al_friends.php", {
                    act: "recent"
                }, {
                    onDone: function(e) {
                        if (e) {
                            cur.shownFriends = 0, cur.curList = cur.section = type;
                            var r = [];
                            len = e.length;
                            for (var s = 0; s < len; s++) {
                                var n = cur.friends[e[s]];
                                n && r.push(n)
                            }
                            cur.friendsList[cur.section] = r, cur.sectionCount = r.length, cur.fContent.innerHTML = "", uiRightMenu.hideProgress(tab), Friends.showSection(
                                type), Friends.onSectionChange(), callback(), this.showMore()
                        }
                    }.bind(this)
                });
                break;
            case "out_requests":
                cur.fContent.innerHTML = '<div class="friends_wide_loading"></div>', ajax.post("/friends", {
                    act: "out_requests"
                }, {
                    onDone: function(data, occupations) {
                        var obj = eval("(" + data + ")");
                        obj && (extend(cur.occupations, occupations), extend(cur.friendsList, obj), this.indexAll(function() {
                            Friends.section(type, callback)
                        }))
                    }.bind(this)
                });
                break;
            default:
                "list" == type.substr(0, 4) && this.search(-1, type, callback)
        }
    },
    scrollResize: function() {
        if (!browser.mobile) {
            var e = document.documentElement,
                r = window.innerHeight || e.clientHeight || bodyNode.clientHeight,
                s = scrollGetY();
            cur.pageEnd && (s + 3 * r > cur.pageEnd.offsetTop && setTimeout(function() {
                Friends.showMore()
            }, 0), !isVisible("friends_search_input_wrap"))
        }
    },
    drawFriend: function(e, r) {
        return "requests" == cur.section || "all_requests" == cur.section || "out_requests" == cur.section ? cur.commonTpl(e, r || cur.section) : cur.friendsTpl(e, cur.section)
    },
    inviteToGroup: function(e, r, s, n, i) {
        var t = function(n) {
            for (var i in cur.friendsList[cur.curList]) {
                var t = cur.friendsList[cur.curList][i];
                if (t[0] == s) {
                    t[11] = n, n ? link = '<button class="flat_button button_small button_wide secondary" onclick="return Friends.inviteToGroup(this, ' + r + ", " + s +
                        ", 1, '" + t[12] + "')\">" + getLang("friends_cancel_invite") + "</button>" : link =
                        '<button class="flat_button button_small button_wide" onclick="return Friends.inviteToGroup(this, ' + r + ", " + s + ", 0, '" + t[12] + "')\">" +
                        getLang("friends_send_invite") + "</button>", e.parentNode.replaceChild(se(link), e);
                    break
                }
            }
        };
        return n ? ajax.post("/al_page.php", {
            act: "a_cancel_invite",
            mid: s,
            gid: r,
            hash: i
        }, {
            onDone: function(e) {
                t(0)
            },
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e)
        }) : ajax.post("/al_page.php", {
            act: "a_invite",
            mid: s,
            gid: r,
            hash: i
        }, {
            onDone: function(r, n) {
                r ? t(1) : (showMsg("res" + s, n, "msg"), hide(e))
            },
            showProgress: lockButton.pbind(e),
            hideProgress: unlockButton.pbind(e)
        }), !1
    },
    acceptRequest: function(e, r, s, n) {
        var i = ge("request_controls_" + e);
        i.parentNode;
        s || (i.innerHTML = '<div class="progress_inline"></div>'), ajax.post("al_friends.php", {
            act: "add",
            mid: e,
            hash: r,
            request: 1,
            select_list: 1
        }, {
            onDone: function(r) {
                i.innerHTML = r, Friends.processRequest(e, !0, n), cur.friendsList && (delete cur.friendsList.recent, delete cur.friendsList.online, Friends.indexAll())
            },
            onFail: function(e) {
                return e ? (showFastBox(getLang("global_error"), e), !0) : void 0
            },
            showProgress: lockButton.pbind(s),
            hideProgress: unlockButton.pbind(s)
        })
    },
    declineRequest: function(e, r, s) {
        var n = ge("request_controls_" + e);
        n.parentNode;
        s || (n.innerHTML = '<div class="progress_inline"></div>'), ajax.post("al_friends.php", {
            act: "remove",
            mid: e,
            hash: r,
            report_spam: 1,
            from_section: cur.section
        }, {
            onDone: function(r) {
                cur.declinedRequestsCnt = cur.declinedRequestsCnt + 1 || 1, hasClass(gpeByClass("friends_user_row", n), "friends_user_request") && cur.declinedRequestsCnt >=
                    2 && cur.requestsCount > 1 && (r +=
                        '<button class="friends_decline_all flat_button button_small secondary" onclick="Friends.subscribeAllRequests(this, \'' + cur.declineAllHash +
                        "')\">" + cur.summaryLang.friends_hide_all_requests + "</button>"), n.innerHTML = r, Friends.processRequest(e, !1)
            },
            onFail: function(e) {
                return e ? (showFastBox(getLang("global_error"), e), !0) : void 0
            },
            showProgress: lockButton.pbind(s),
            hideProgress: unlockButton.pbind(s)
        })
    },
    processRequest: function(e, r, s) {
        if (cur.friendsList) {
            for (var n = cur.friendsList[s ? "sugg_requests" : "requests"] || [], i = n.length, t = !1; i--;)
                if (n[i][0] == e) {
                    var o = n.splice(i, 1)[0];
                    s ? --cur.suggCount : --cur.requestsCount, Friends.changeSummary(), r ? (t = !0, o.pop(), cur.friendsList.all ? cur.friendsList.all.push(o) : cur.friendsList
                        .all = [o], cur.friends[o[0]] = o) : s ? (cur.shownSugg--, cur.suggCount--) : (cur.shownFriends--, cur.sectionCount--)
                }
            if (r) {
                for (var n = cur.friendsList.all_requests || [], i = n.length; i--;)
                    if (n[i][0] == e) {
                        var o = n.splice(i, 1)[0];
                        --cur.allRequestsCount, t || (o.pop(), cur.friendsList.all ? cur.friendsList.all.push(o) : cur.friendsList.all = [o], cur.friends[o[0]] = o)
                    }
            } else
                for (var n = cur.friendsList.out_requests || [], i = n.length; i--;)
                    if (n[i][0] == e) {
                        var o = n.splice(i, 1)[0];
                        --cur.outRequestsCount
                    }
        }
    },
    actionPossible: function(e, r, s, n) {
        if (window.tooltips && tooltips.hide(n), cur.possibleAdded || (cur.possibleAdded = {}), !cur.possibleAdded[e]) {
            cur.possibleAdded[e] = 1;
            var i = gpeByClass("right_list_row", n);
            if (s) var t = {
                act: "add",
                mid: e,
                hash: r,
                request: 1
            };
            else var t = {
                act: "hide_possible",
                mid: e,
                hash: r
            };
            return ajax.post("al_friends.php", t, {
                onDone: function(e) {
                    s && showDoneBox(e);
                    var r = i.parentNode,
                        n = geByClass1("unshown", r);
                    n && domInsertBefore(n, i), fadeOut(i, 500, function() {
                        re(i), n || geByClass1("right_list_row", r) || slideUp("friends_possible_block", 100)
                    }), n && setTimeout(fadeIn.pbind(n, 200, removeClass.pbind(n, "unshown")), 500)
                },
                onFail: function(e) {
                    return e ? (showFastBox(getLang("global_error"), e), !0) : void 0
                }
            }), s && cur.friendsList && (delete cur.friendsList.out_requests, cur.outRequestsCount++, this.changeSummary("out_requests"), "out_requests" == cur.section &&
                nav.change({
                    section: "out_requests"
                })), !1
        }
    },
    actionFindUser: function(e, r, s, n) {
        window.tooltips && tooltips.hide(n);
        var i = gpeByClass("friends_find_user", n),
            t = geByClass1("friends_find_user_result", i);
        if (t.innerHTML = '<div class="progress_inline"></div>', s) var o = {
            act: "add",
            mid: e,
            hash: r,
            from: "possible"
        };
        else var o = {
            act: "hide_possible",
            mid: e,
            hash: r
        };
        return ajax.post("al_friends.php", o, {
            onDone: function(e) {
                addClass(i, "touched"), t.innerHTML = e
            },
            onFail: function(e) {
                return e ? (showFastBox(getLang("global_error"), e), !0) : void 0
            },
            showProgress: addClass.pbind(i, "loading"),
            hideProgress: removeClass.pbind(i, "loading")
        }), !1
    },
    actionFindUserCancel: function(e, r, s, n) {
        var i = gpeByClass("friends_find_user", n),
            t = geByClass1("friends_find_user_result", i);
        if (t.innerHTML = '<div class="progress_inline"></div>', removeClass(i, "touched"), s) var o = {
            act: "remove",
            mid: e,
            hash: r
        };
        else var o = {
            act: "cancel_hide_possible",
            mid: e,
            hash: r
        };
        return ajax.post("al_friends.php", o, {
            onDone: function(e) {},
            onFail: function(e) {
                return e ? (showFastBox(getLang("global_error"), e), !0) : void 0
            },
            showProgress: addClass.pbind(i, "loading"),
            hideProgress: removeClass.pbind(i, "loading")
        }), !1
    },
    reportSpam: function(e, r) {
        var s = ge("request_controls_" + e);
        s || (s = ge("result_msg"), removeClass(s, "msg")), s.innerHTML = '<div class="progress_inline"></div>', ajax.post("al_friends.php", {
            act: "report_spam",
            mid: e,
            hash: r
        }, {
            onDone: function(e) {
                s.innerHTML = e
            }
        })
    },
    restoreFriend: function(e, r) {
        var s = gpeByClass("_actions_menu", e);
        ajax.post("al_friends.php", {
            act: "add",
            mid: r,
            hash: cur.userHash,
            cats: cur.savedMasks[r]
        }, {
            onDone: Friends.onRemoveFriend.pbind(r, !0),
            showProgress: addClass.pbind(s, "action_progress"),
            hideProgress: removeClass.pbind(s, "action_progress")
        })
    },
    deleteFriend: function(e, r, s) {
        var n = gpeByClass("_actions_menu", s);
        return ajax.post("al_friends.php", {
            act: "remove",
            mid: r,
            hash: cur.userHash
        }, {
            onDone: Friends.onRemoveFriend.pbind(r, !1),
            showProgress: function() {
                uiActionsMenu.hide(n), addClass(n, "action_progress")
            },
            hideProgress: function() {
                removeClass(n, "action_progress")
            }
        }), !1
    },
    onRemoveFriend: function(e, r) {
        (cur.friendsList[cur.curList] || [])
        .length < 10;
        for (var s in cur.friendsList) "all" != s && "requests" != s && "all_requests" != s && "out_requests" != s && delete cur.friendsList[s];
        var n = cur.friendsList.all;
        n.length;
        e = positive(e);
        var i = ge("friends_user_row" + e),
            t = cur.friends[e];
        t && i ? (r ? (t[6] = cur.savedMasks[e], delete cur.savedMasks[e]) : (cur.savedMasks[e] = t[6], t[6] = 0), toggleClass(i, "deleted", !t[6])) : re(i), Friends.indexAll(
            function() {})
    },
    showCommonBox: function(e, r) {
        return showTabbedBox("al_page.php", {
            act: "box",
            oid: r,
            tab: "common"
        }, {
            cache: 1
        }, e), !1
    },
    toList: function(e) {
        var r = "list" + e;
        return nav.change({
            0: "al_friends.php",
            section: r
        }), scrollToTop(0), !1
    },
    searchFriendToggle: function(e, r, s) {
        var n = s ? ge("friends_subsc" + e) : ge("friends_unsubsc" + e),
            i = s ? ge("friends_unsubsc" + e) : ge("friends_subsc" + e);
        ajax.post("al_friends.php", {
            act: s ? "add" : "remove",
            mid: e,
            hash: r,
            from: "friends"
        }, {
            onDone: function(e) {
                hide(n), show(i)
            },
            showProgress: lockButton.pbind(n),
            hideProgress: unlockButton.pbind(n)
        })
    },
    checkCat: function(e, r, s, n) {
        if (1 == n) var i = isChecked(e);
        else var i = hasClass(e, "checked"),
            t = ge("lists" + r);
        var o = cur.friends[r];
        return o ? (o[6] = parseInt(o[6]), i ? (o[6] & 1 << s && (o[6] -= 1 << s), t && (t.innerHTML = Friends.getLists(o[6]))) : (o[6] & 1 << s || (o[6] += 1 << s), t &&
            (t.innerHTML = Friends.getLists(o[6]))), 1 == n ? checkbox(e) : (i ? removeClass : addClass)(e, "checked"), cur.timeouts["list" + r] && clearTimeout(
            cur.timeouts["list" + r]), delete cur.friendsList["list" + s], delete cur.friendsList["list" + o[6]], void(cur.timeouts["list" + r] = setTimeout(
            function() {
                ajax.post("al_friends.php", {
                    act: "save_cats",
                    uid: r,
                    cats: o[6],
                    hash: cur.userHash
                }, {
                    onDone: function(e) {
                        if (n) {
                            var s = ge("friends_added_" + r);
                            !cur["fr_add_text_" + r] && s && (cur["fr_add_text_" + r] = s.innerHTML), fadeTo(s, 100, 0, function() {
                                s.innerHTML = e, fadeTo(s, 100, 1)
                            }), clearTimeout(cur["fr_add_timeout_" + r]), cur["fr_add_timeout_" + r] = setTimeout(function() {
                                fadeTo(s, 100, 0, function() {
                                    s.innerHTML = cur["fr_add_text_" + r], fadeTo(s, 100, 1)
                                })
                            }, 2e3)
                        }
                    }
                })
            }))) : !1
    },
    getLists: function(e) {
        for (var r = [], s = 29; s >= 25; s--) 1 << s & e && cur.publicLists[s] && r.push('<span class="friends_lists_group group', (s - 1) % 8 + 1,
            '" onmousedown="Friends.toList(', s, ');">', cur.publicLists[s], "</span>");
        if (vk.id == cur.oid)
            for (var s in cur.userLists) 1 << s & e && !cur.publicLists[s] && cur.userLists[s] && r.push('<span class="friends_lists_group group', (s - 1) % 8 + 1,
                '" onmousedown="Friends.toList(', s, ');">', cur.userLists[s], "</span>");
        return r.join("")
    },
    subscribeAllRequests: function(e, r) {
        showFastBox(cur.summaryLang.global_action_confirmation, cur.summaryLang.friends_confirm_subscribe_all_requests, getLang("box_yes"), function() {
            ajax.post("al_friends.php", {
                act: "subscribe_all_requests",
                hash: r,
                once: 1
            }, {
                showProgress: lockButton.pbind(e),
                hideProgress: unlockButton.pbind(e)
            })
        }, getLang("box_no"))
    },
    hideAllSuggs: function(e, r) {
        showFastBox(cur.summaryLang.global_action_confirmation, cur.summaryLang.friends_confirm_hide_all_suggs, getLang("box_yes"), function() {
            ajax.post("al_friends.php", {
                act: "hide_all_suggs",
                hash: r
            }, {
                showProgress: lockButton.pbind(e),
                hideProgress: unlockButton.pbind(e)
            })
        }, getLang("box_no"))
    },
    editList: function(e) {
        if (cur.silent) return void(cur.onSilentLoad = function() {
            Friends.editList(e)
        });
        var r = [];
        if (-1 == e && (e = intval(cur.curList.substr(4))), e)
            for (var s = Friends.filter(cur.friendsList.all, cur.curList), n = s.length; n--;) r.push(s[n][0]);
        else e = 0;
        showTabbedBox("al_friends.php", {
            act: "select_friends_box",
            Checked: r.join(","),
            from: "list",
            list_name: e ? replaceEntities(stripHTML(cur.userLists[e])) : "",
            list_id: e
        }, {
            stat: ["privacy.js", "ui_controls.js", "ui_controls.css"],
            cache: 1,
            onFail: function(e) {
                return setTimeout(showFastBox(getLang("global_error"), e)
                    .hide, 3e3), !0
            }
        }), cur.onFlistSave = function(r, s, n, i) {
            var t = [];
            for (var o in s) t.push(parseInt(o));
            return ajax.post("al_friends.php", {
                act: "save_list",
                title: i,
                cat_id: e,
                Friends: t.join(","),
                hash: n
            }, {
                onDone: function(r, s) {
                    Friends.editListClient(e, r, s, t)
                },
                onFail: function(e) {
                    return setTimeout(showFastBox(getLang("global_error"), e, getLang("global_close"))
                        .hide, 4e3), !0
                }
            }), Friends.clearFilter(), Friends.updateCurFilters(), !1
        }
    },
    editListClient: function(e, r, s, n) {
        var i = "list" + r;
        if (0 == e) {
            var t = "<div onclick=\"return Friends.switchMenu(this, 'list" + r + '\', event);"  class="ui_rmenu_subitem ui_rmenu_item_sel friends_section_list' + r + '">' +
                s + "</div>";
            ge("ui_rmenu_lists_list")
                .insertBefore(ce("div", {
                    innerHTML: t
                }), geByClass1("friends_create_list", "narrow_column"));
            var o = n.length,
                c = 1 << parseInt(r);
            for (cur.friendsList[i] = []; o--;) {
                var u = cur.friends[n[o]];
                u[6] = parseInt(u[6]), u[6] & c || (u[6] += c, cur.friendsList[i].push(u))
            }
            return cur.userLists[r] = s, Friends.indexAll(), removeClass(ge("main_class"), "no_lists"), nav.change({
                0: "friends",
                section: i
            })
        }
        25 > r && (geByClass1("friends_section_list" + r, "narrow_column")
            .innerHTML = s,
            cur.userLists[r] = s);
        var c = 1 << r;
        cur.friendsList[i] = [];
        for (var a in cur.friends) {
            var u = cur.friends[a],
                d = -1 != n.indexOf(parseInt(u[0]));
            d && cur.friendsList[i].push(u), u[6] = parseInt(u[6]), u[6] & c ? d || (u[6] -= c) : d && (u[6] += c)
        }
        return Friends.indexAll(), Friends.section(i, function() {
            Friends.changeSummary(), nav.setLoc({
                0: "friends",
                section: i
            })
        })
    },
    createList: function(e) {
        return Friends.editList(0), cancelEvent(e)
    },
    deleteList: function(e) {
        -1 == e && (e = intval(cur.curList.substr(4))), showBox("al_friends.php", {
            act: "delete_list_box",
            list_id: e
        })
    },
    deleteListClient: function(e) {
        re(geByClass1("friends_section_list" + e, "narrow_column"));
        var r = 1 << e;
        for (var s in cur.friends) cur.friends[s][6] & r && (cur.friends[s][6] -= r);
        delete cur.userLists[e];
        var n = 0;
        for (var s in cur.userLists) n++;
        return n || addClass(ge("main_class"), "no_lists"), nav.change({
            0: "friends",
            section: "all"
        })
    },
    selectList: function(e, r, s) {
        Friends.ddShow(r, e, s)
    },
    showListsDD: function(e, r, s) {
        var n = gpeByClass("ui_actions_menu", r),
            i = geByClass1("ui_actions_menu_sublist", n);
        if (i) {
            var t = data(i, "hidetimer");
            return clearTimeout(t), void data(i, "hidetimer", 0)
        }
        for (var o, c = cur.friends[parseInt(e)], u = parseInt(c[6]), a = [], d = [28, 29, 27, 25, 26], l = 0; 5 > l; ++l) o = d[l], cur.publicLists[o] && a.push(
            '<a class="ui_actions_menu_item' + (u & 1 << parseInt(o) ? " checked" : "") + '" onclick="Friends.checkCat(this, ' + e + ", " + o + ');">' + cur.publicLists[
                o] + "</a>");
        for (var o in cur.userLists)
            if (25 > o) {
                var f = cur.userLists[o];
                f.length > 20 && (f = trim(f.substr(0, 18)) + "..."), a.push('<a class="ui_actions_menu_item' + (u & 1 << parseInt(o) ? " checked" : "") +
                    '" onclick="Friends.checkCat(this, ' + e + ", " + o + ');">' + f + "</a>")
            }
        a = se('<div class="ui_actions_menu_sublist shown" onmouseover="Friends.showListsDD(' + e + ', this, event);" onmouseout="Friends.hideListsDD(this);">' + a.join("") +
            "</div>"), n.appendChild(a)
    },
    hideListsDD: function(e) {
        var r = gpeByClass("ui_actions_menu", e),
            s = geByClass1("ui_actions_menu_sublist", r);
        if (s) {
            var n = data(s, "hidetimer");
            n || data(s, "hidetimer", setTimeout(function() {
                data(s, "hidetimer", 0), re(s)
            }, 150))
        }
    },
    hideSuggestion: function(e, r, s) {
        var n = ge("request_controls_" + e);
        ajax.post("al_friends.php", {
            act: "hide_suggestion",
            mid: e,
            hash: r,
            report_spam: 1
        }, {
            onDone: function(r) {
                cur.hiddenSuggestionsCnt = cur.hiddenSuggestionsCnt + 1 || 1, hasClass(gpeByClass("friends_user_row", n), "friends_user_request") && cur.hiddenSuggestionsCnt >=
                    2 && cur.suggCount > 1 && (r +=
                        '<button class="friends_decline_all flat_button button_small secondary" onclick="Friends.hideAllSuggs(this, \'' + cur.declineAllHash +
                        "')\">" + cur.summaryLang.friends_hide_all_suggs + "</button>"), n.innerHTML = r, Friends.processRequest(e, !1, !0)
            },
            onFail: function(e) {
                return e ? (showFastBox(getLang("global_error"), e), !0) : void 0
            },
            showProgress: lockButton.pbind(s),
            hideProgress: unlockButton.pbind(s)
        })
    },
    addRecommend: function(e, r, s, n) {
        n = n.parentNode, n.innerHTML = '<img src="/images/upload.gif" />', ajax.post("al_friends.php", {
            act: "a_suggest_friends",
            mid: e,
            uids: r,
            hash: s,
            from: "add"
        }, {
            onDone: function(e) {
                n.innerHTML = e
            },
            onFail: function(e) {
                n.innerHTML = e
            }
        })
    },
    suggestBox: function(e) {
        var r = showBox("al_friends.php", {
            act: "select_friends_box",
            from: "suggest_friends",
            friend_id: e
        }, {
            stat: ["privacy.js", "privacy.css", "indexer.js", "profile.css"],
            params: {
                dark: 1
            }
        });
        return r.leaveOnSave = !0, cur.onFlistSave = function(s, n, i) {
            ajax.post("al_friends.php", {
                act: "a_suggest_friends",
                mid: e,
                ids: s.join(","),
                hash: i
            }, {
                onDone: function(e) {
                    r.hide(), showDoneBox(e)
                },
                showProgress: r.showProgress,
                hideProgress: r.hideProgress
            })
        }, !1
    },
    getAgeFromData: function(e, r) {
        return e = parseInt(e), !e > 0 && (e = r.ageTo), Friends.getRangeData(r.ageFrom, e, 1, r.langAgeFrom + " ", r.langAgeFromEmpty)
    },
    getAgeToData: function(e, r) {
        return e = parseInt(e), !e > 0 && (e = r.ageFrom), Friends.getRangeData(e, r.ageTo, 1, r.langAgeTo + " ", r.langAgeToEmpty)
    },
    getRangeData: function(e, r, s, n, i) {
        if (e > r) return !1;
        var t = [
            [0, i]
        ];
        if (0 > s)
            for (var o = r; o >= e; o += s) t.push([o, n + o]);
        else if (s > 0)
            for (var o = e; r >= o; o += s) t.push([o, n + o]);
        return t
    },
    radioFilter: function(e, r, s) {
        radiobtn(e, r, "friends_radio_sex"), (s || void 0 == s) && Friends.changeFilter()
    },
    initFilters: function(e) {
        stManager.add(["ui_controls.js", "ui_controls.css"], function() {
            cur.cityFilter = new Dropdown(ge("friends_fltr_city"), e.cities, {
                big: 1,
                zeroPlaceholder: !0,
                onChange: Friends.changeFilter,
                onShow: function() {
                    cur.silent && (cur.cityFilterOpened = !0, show("friends_fltr_progress"))
                }
            }), cur.ageFromFilter = new Dropdown(ge("friends_age_from"), Friends.getAgeFromData(e.ageTo, e), {
                zeroPlaceholder: !0,
                big: 1,
                onChange: function(r) {
                    cur.ageToFilter.setData(Friends.getAgeToData(r, e)), Friends.changeFilter()
                }
            }), cur.ageToFilter = new Dropdown(ge("friends_age_to"), Friends.getAgeToData(e.ageFrom, e), {
                zeroPlaceholder: !0,
                big: 1,
                onChange: function(r) {
                    cur.ageFromFilter.setData(Friends.getAgeFromData(r, e)), Friends.changeFilter()
                }
            }), window.radioBtns.friends_radio_sex = {
                els: Array.prototype.slice.apply(geByClass("radiobtn", ge("friends_radio_sex"))),
                val: 0
            }
        })
    },
    clearFilter: function(e, r) {
        cur.cityFilter && (r && "city" != r || cur.cityFilter.selectItem(0, !1), r && "age_from" != r || cur.ageFromFilter.selectItem(0, !1), r && "age_to" != r || cur.ageToFilter
            .selectItem(0, !1), r && "sex" != r || Friends.radioFilter(ge("friends_radio_any"), 0, !1), cur.filterIds = !1, cur.filter = !1, e && Friends.changeFilter()
        )
    },
    filterParams: function() {
        var e = {
            city: parseInt(cur.cityFilter.val()),
            sex: parseInt(radioBtns.friends_radio_sex.val),
            age_from: parseInt(cur.ageFromFilter.val()),
            age_to: parseInt(cur.ageToFilter.val())
        };
        return e.city || e.sex || e.age_from || e.age_to ? e : !1
    },
    changeFilter: function() {
        return cur.silent ? (cur.onSilentLoad = function() {
            Friends.changeFilter()
        }, hide(cur.showMore), void(cur.fContent.innerHTML = '<div class="friends_wide_loading"></div>')) : (cur.filter = Friends.filterParams(), void(cur.filter ?
            ajax.post("friends", extend({
                act: "filter_friends",
                uid: cur.oid
            }, cur.filter), {
                onDone: function(e) {
                    cur.filterIds = {};
                    for (var r in e) cur.filterIds[e[r]] = 1;
                    for (var r in cur.friendsList) "filter" == r.split("_")
                        .pop() && delete cur.friendsList[r];
                    inArray(cur.section, ["all", "online", "phonebook"]) || (Friends.selectTab("all"), Friends.selectSection("all"), cur.curList = cur.section =
                        "all", nav.setLoc(extend(nav.objLoc, {
                            section: "all"
                        }))), Friends.search(cur.searchStr || -1, cur.section, !1, !0), Friends.changeSummary(), Friends.updateCurFilters()
                },
                progress: "friends_fltr_progress",
                cache: 1
            }) : (cur.filterIds && (cur.filterIds = !1), Friends.updateList(), Friends.updateCurFilters())))
    },
    updateCurFilters: function() {
        var e = ge("friends_cur_filters");
        if (cur.filter) {
            for (var r in cur.filter) {
                var s = cur.filter[r],
                    n = "",
                    i = !1,
                    t = !1,
                    o = ge("friends_filters_token_" + r);
                if (s) {
                    switch (r) {
                        case "city":
                            n = cur.cityFilter.val_full()[1];
                            break;
                        case "age_from":
                            n = cur.ageFromFilter.val_full()[1], i = "age_to";
                            break;
                        case "age_to":
                            n = cur.ageToFilter.val_full()[1], t = "age_from";
                            break;
                        case "sex":
                            n = 2 == s ? getLang("sex_m") : getLang("sex_fm")
                    }
                    n = stripHTML(n);
                    var c = '<span class="label">' + n + '</span><span class="del_icon"></span>';
                    if (o) o.innerHTML = c;
                    else {
                        var u = ce("div", {
                            id: "friends_filters_token_" + r,
                            className: "token",
                            innerHTML: c,
                            onclick: Friends.clearFilter.pbind(!0, r)
                        });
                        i && ge("friends_filters_token_" + i) ? domInsertBefore(u, ge("friends_filters_token_" + i)) : t && ge("friends_filters_token_" + t) ?
                            domInsertAfter(u, ge("friends_filters_token_" + t)) : e.appendChild(u)
                    }
                } else o && re(o)
            }
            show(e)
        } else hide(e), e.innerHTML = ""
    },
    changeFriendsOrder: function(e, r) {
        var s = domPN(e);
        "date" === r && "date" !== nav.objLoc.sort ? (nav.change({
            sort: !1
        }), addClass(s, "friends_sort_sel_date"), removeClass(s, "friends_sort_sel_common")) : "common" === r && "common" !== nav.objLoc.sort && (nav.change({
            sort: "common"
        }), addClass(s, "friends_sort_sel_common"), removeClass(s, "friends_sort_sel_date"))
    },
    findAdd: function(e, r, s) {
        ajax.post("al_friends.php", {
            act: "add",
            mid: e,
            hash: r,
            request: 1,
            short_resp: 1
        }, {
            onDone: function(e) {
                var r = s.parentNode;
                r.innerHTML = '<div class="friends_imp_status" style="display: none;">' + e + "</div>", fadeIn(r.firstChild, 200)
            },
            onFail: function(e) {
                return e ? (showFastBox(getLang("global_error"), e), !0) : void 0
            },
            showProgress: lockButton.pbind(s),
            hideProgress: unlockButton.pbind(s)
        })
    },
    toggleFindFilters: function() {
        function e(e, r, s) {
            return animate(e, {
                height: "show",
                paddingTop: "show",
                paddingBottom: "show"
            }, r, s)
        }
        return isVisible("friends_filters_block") ? (hide("friends_import_stub", "friends_filters_header", "friends_clear_link", "results"), show("friends_import_header",
            "friends_list_wrap"), e("friends_import_block", 500), slideUp("friends_filters_block", 500, function() {
            show("friends_filters_stub")
        }), nav.setLoc("friends?act=find"), val("search_query", ""), cur.params && (cur.params["c[q]"] = ""), cur.disableAutoMore = !0, scrollToTop()) : (hide(
            "friends_filters_stub"), e("friends_filters_block", 500), slideUp("friends_import_block", 500, function() {
            show("friends_import_stub")
        }), cur.disableAutoMore = !1, searcher.updResults()), !1
    },
    extendedSearchQuery: function() {
        isVisible("friends_filters_block") || Friends.toggleFindFilters(), searcher.onEnter()
    },
    clearFindParams: function(e, r) {
        return hide("search_clear_params"), uiSearch.reset(e, !1, r)
    }
};
try {
    stManager.done("friends.js")
} catch (e) {}
