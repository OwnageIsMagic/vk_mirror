function Fletcher32() {
    function e(e) {
        for (var o = e.length, i = 0; o;) {
            var l = o > 359 ? 359 : o;
            o -= l;
            do a += t += e[i++]; while (--l);
            t = ((65535 & t) >>> 0) + (t >>> 16), a = ((65535 & a) >>> 0) + (a >>> 16)
        }
    }

    function o() {
        return t = ((65535 & t) >>> 0) + (t >>> 16), a = ((65535 & a) >>> 0) + (a >>> 16), (a << 16 >>> 0 | t) >>> 0
    }
    var t = 65535,
        a = 65535;
    return {
        append: e,
        result: o
    }
}
if (window.jsonpManager || (window.jsonpManager = window.__jsp = {
        c: 1,
        h: {},
        reg: function(e) {
            return __jsp.h[__jsp.c] = isFunction(e) ? e : function() {}, __jsp.c++
        }
    }), !window.Upload) var Upload = {
    init: function(e, o, t, a) {
        window.uploadInterface = void 0 != window.uploadInterface ? uploadInterface + 1 : 0;
        var i = uploadInterface;
        return each(["obj", "dropbox", "options", "vars", "types", "uploadUrls", "callbacks", "checks", "dragTimer"], function(e, o) {
                Upload[o] || (Upload[o] = {})
            }), this.obj[i] = ge(e), a.dropbox && (this.dropbox[i] = ge(a.dropbox)), this.vars[i] = t, a.file_input = ge(a.file_input), this.options[i] = a, a.clear &&
            cur.destroy.push(Upload.deinit.pbind(i)), this.uploadUrls[i] = o, !a.flash_lite || browser.flash || this.checkFileApi() ? a.customShowProgress ? a.customShowProgress() :
            "INPUT" != this.obj[i].tagName || this.checkFileApi() ? a.flash_lite || (this.obj[i].innerHTML =
                '<div class="upload_check loading"><img width="32" height="8" src="/images/upload' + (hasClass(bodyNode, "is_2x") ? "_2x" : "") + '.gif" /></div>') :
            this.obj[i] = ge(a.fieldEl) || this.obj[i].parentNode.firstChild : this.obj[i] = ge(a.fieldEl) || this.obj[i].parentNode.firstChild, a.noCheck ? this.embed(
                i) : this.check(i), i
    },
    deinit: function(e) {
        if (Upload.obj[e]) {
            var o = Upload.options[e] || {},
                t = o.dragEvObj;
            if (t && (removeEvent(t, "dragenter"), removeEvent(t, "dragover"), removeEvent(t, "dragleave")), each(["obj", "dropbox", "options", "vars", "types",
                    "uploadUrls", "callbacks"
                ], function(o, t) {
                    Upload[t] && delete Upload[t][e]
                }), Upload.callbacks) {
                var a = ["oncheck", "ondone", "onfail"];
                each(Upload.flashCallbacks(), function(e, o) {
                    a.push(e)
                }), each(a, function(o, t) {
                    delete Upload.callbacks[t + e]
                })
            }
            clearTimeout(Upload.checks["timer" + e]), clearTimeout(Upload.dragTimer[e]), delete Upload.dragTimer[e]
        }
    },
    check: function(e) {
        var o = this.obj[e],
            t = this.vars[e],
            a = this.options[e],
            i = a.check_url ? a.check_url : this.uploadUrls[e],
            l = {};
        if (a.signed) {
            if (!i) return Upload.onCheckComplete(e);
            extend(l, {
                _jsonp: jsonpManager.reg(function(o) {
                    Upload.onCheckComplete(e, o)
                })
            })
        } else {
            if (!a.check_hash && !a.server) return Upload.onCheckComplete(e);
            this.callbacks["oncheck" + e] = Upload.onCheckComplete.pbind(e);
            var n = ["mid", "aid", "gid", "hash", "rhash"];
            for (var s in n) l[n[s]] = t[n[s]];
            a.check_hash && (l.hash = a.check_hash), a.check_rhash && (l.rhash = a.check_rhash), t.https_resp && (l.https_resp = t.https_resp), t.http_resp && (l.http_resp =
                t.http_resp), extend(l, {
                al: 1,
                act: "check_upload",
                type: a.type,
                ondone: "Upload.callbacks.oncheck" + e
            })
        }
        var d = '<form action="' + i + '" enctype="multipart/form-data" method="post" id="check_upload_form' + e + '" target="check_iframe' + e + '">';
        for (var s in l) d += '<input type="hidden" name="' + s + '" value="' + l[s] + '" />';
        d += '</form><iframe style="visibility: hidden; width: 1px; height: 1px;" id="check_iframe' + e + '" name="check_iframe' + e + '"></iframe>';
        var r = ce("div", {
            id: "check_upload_" + e,
            innerHTML: d,
            className: a.checkClass || ""
        }, {
            display: "none"
        });
        ge("check_upload_" + e) && re("check_upload_" + e), o.appendChild(r);
        var p = ge("check_upload_form" + e);
        try {
            p && p.submit(), clearTimeout(Upload.checks["timer" + e]), this.checks["timer" + e] = setTimeout(Upload.serverFail.pbind(e), 1e4)
        } catch (u) {
            debugLog(u)
        }
    },
    onCheckComplete: function(e, o) {
        clearTimeout(Upload.checks["timer" + e]), delete Upload.checks["timer" + e];
        var t = {},
            a = Upload.options[e],
            i = o;
        if (a.signed) t = parseJSON(o || "{}");
        else {
            o = o || "", o = o.split("&");
            for (var l in o) {
                var n = o[l].split("=");
                t[n[0]] = n[1]
            }
            i = t
        }
        a.customHideProgress && a.customHideProgress(), t.error || t.fail ? Upload.serverFail(e, i) : (a.noCheck = 1, a.onCheckComplete ? a.onCheckComplete(e) : a.flash_lite &&
            browser.flash ? Upload.initFlash(e, Upload.obj[e]) : Upload.embed(e), Upload.serverSuccess(e, i))
    },
    serverFail: function(i, err_obj) {
        var obj = Upload.obj[i],
            options = Upload.options[i],
            vars = Upload.vars[i];
        if (obj && (options.signed || options.server)) {
            if (Upload.fails || (Upload.fails = {}), Upload.fails[i] = Upload.fails[i] ? Upload.fails[i] + 1 : 1, options.signed) {
                var parts = Upload.uploadUrls[i].split("?"),
                    tmp = q2ajx(parts[1]),
                    q = extend({
                        act: "check_result",
                        _resign: tmp._query || parts[1]
                    }, err_obj ? {
                        _query: err_obj
                    } : {
                        _check: options.check_url.split("?")[1]
                    });
                return void ajax.post("upload_fails.php", q, {
                    onDone: function(e, o, t, a) {
                        Upload.fails[i] < options.max_attempts ? (Upload.uploadUrls[i] = e, extend(Upload.options[i], {
                            check_url: o,
                            base_url: t,
                            static_url: a
                        }), Upload.check(i)) : (obj.innerHTML = "", options.lang && options.lang.cannot_upload_title && options.lang.cannot_upload_text &&
                            showFastBox({
                                title: options.lang.cannot_upload_title,
                                width: 430,
                                dark: 1,
                                bodyStyle: "padding: 20px; line-height: 160%;"
                            }, options.lang.cannot_upload_text))
                    }
                })
            }
            var query = extend({
                act: "fail",
                role: options.type,
                mid: vars.mid,
                oid: vars.oid,
                gid: vars.gid,
                aid: vars.aid,
                server: options.server,
                error: options.error,
                hash: options.error_hash
            }, err_obj);
            if (options.custom_hash && extend(query, {
                    custom_hash: options.custom_hash,
                    photo_hash: vars.photo_hash,
                    size: vars.size,
                    fid: vars.fid,
                    vid: vars.vid,
                    tag: vars.tag
                }), window.ajax) ajax.post("upload_fails.php", query, {
                onDone: function(e, o, t) {
                    Upload.fails[i] < options.max_attempts ? (Upload.uploadUrls[i] = e, extend(Upload.options[i], t), extend(Upload.vars[i], o), Upload.check(
                        i)) : (obj.innerHTML = "", options.lang && options.lang.cannot_upload_title && options.lang.cannot_upload_text && showFastBox({
                        title: options.lang.cannot_upload_title,
                        width: 430,
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;"
                    }, options.lang.cannot_upload_text))
                }
            });
            else {
                if (1e5 != options.server) return;
                Ajax.Send("/upload_fails.php", query, function(ajaxObj, response) {
                    try {
                        response = eval("(" + response + ")")
                    } catch (e) {
                        response = null
                    }
                    var opts = response.options,
                        new_vars = response.vars,
                        url = response.upload_url;
                    Upload.fails[i] < options.max_attempts ? (Upload.uploadUrls[i] = url, extend(Upload.options[i], opts), extend(Upload.vars[i], new_vars),
                        Upload.check(i)) : (obj.innerHTML = "", options.lang && options.lang.cannot_upload_title && options.lang.cannot_upload_text &&
                        showFastBox({
                            title: options.lang.cannot_upload_title,
                            width: 430,
                            dark: 1,
                            bodyStyle: "padding: 20px; line-height: 160%;"
                        }, options.lang.cannot_upload_text), options.onCheckServerFailed && options.onCheckServerFailed())
                })
            }
        }
    },
    serverSuccess: function(e, o) {
        var t = Upload.options[e],
            a = Upload.vars[e];
        if (Upload.checked = Upload.checked || {}, Upload.checked[e] = 1, t.signed) return void ajax.post("upload_fails.php", {
            act: "check_result",
            _query: o
        });
        if (t.server || t.error_hash) {
            var i = extend({
                act: "success",
                mid: a.mid,
                oid: a.oid,
                gid: a.gid,
                aid: a.aid,
                server: t.server,
                error: t.error,
                hash: t.error_hash
            }, o);
            window.ajax ? ajax.post("upload_fails.php", i) : Ajax.Send("/upload_fails.php", i)
        }
    },
    embed: function(e) {
        var o = void 0 != e.num ? e.num : e,
            t = this.obj[o],
            a = this.dropbox[o],
            i = this.options[o];
        return i.noEmbed ? void re("check_upload_" + e) : void(i.noCheck && (browser.flash > 9 && i.forceFlash ? this.initFlash(o, t) : this.checkFileApi() && !i.flash_lite ?
            this.initFileApi(o, t, a) : browser.flash > 9 && !i.noFlash ? this.initFlash(o, t) : i.noForm || this.initForm(o, t)))
    },
    checkFileApi: function() {
        return (window.XMLHttpRequest || window.XDomainRequest) && (window.FormData || window.FileReader && (window.XMLHttpRequest && XMLHttpRequest.sendAsBinary ||
            window.ArrayBuffer && window.Uint8Array && (window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder)))
    },
    initFlash: function(e, o) {
        var t = [],
            a = Upload.vars[e],
            i = Upload.options[e],
            l = {
                url: i.flashPath || "/swf/uploader_lite.swf",
                id: "uploader_lite" + e,
                preventhide: !0,
                width: "100%",
                height: browser.safari || browser.msie || browser.chrome && intval(browser.version) < 17 ? i.flashHeight ? i.flashHeight + "px" : cur.flash_lite && !
                    isVisible("photos_flash_add_button") ? "67px" : "25px" : "100%"
            },
            n = {
                swliveconnect: "true",
                allowscriptaccess: "always",
                wmode: browser.msie ? "opaque" : "transparent"
            };
        Upload.types[e] = "flash";
        for (var s in a) t.push(s + "=" + a[s]);
        i.signed || a.ajx || t.push("ajx=1");
        var d = this.flashCallbacks(),
            r = {};
        this.callbacks = this.callbacks || {}, each(d, function(o, t) {
            Upload.callbacks[o + e] = t.pbind(e), r[o] = "Upload.callbacks." + o + e
        });
        var p = clone(a);
        if (extend(p, r, {
                upload_url: Upload.uploadUrls[e],
                file_size_limit: i.file_size_limit,
                file_types_description: i.file_types_description,
                file_types: i.file_types,
                file_name: i.file_name,
                post_data: escape(t.join("&"))
            }), i.flash_lite ? o.innerHTML = '<div class="lite_upload" id="lite_upload' + e +
            '" style="z-index:10000; width: 100%; height: 100%; cursor: pointer;"></div>' : (i.lang.button_browse || (i.lang.button_browse = "������� ����"), i.flat_button ?
                o.innerHTML = '<div id="uploader' + e + '" style="position: relative;"><div id="lite_upload' + e +
                '" style="position: absolute; height: 100%; width: 100%; z-index: 10000; cursor: pointer;"></div><button class="flat_button button_big button_big_width">' +
                i.lang.button_browse + "</button></div>" : o.innerHTML = '<button id="uploader' + e + '" class="flat_button upload_btn ' + (i.buttonClass || "") +
                '" style="position: relative;"><div id="lite_upload' + e +
                '" style="position: absolute; height: 100%; width: 100%; z-index: 10000; cursor: pointer;"></div>' + i.lang.button_browse + "</button>"), renderFlash(
                ge("lite_upload" + e), l, n, p), browser.msie && setStyle(ge("lite_upload" + e), {
                opacity: 0,
                cursor: "pointer"
            }), i.lang.switch_mode) {
            var u = i.lang.switch_mode.replace("{link}", '<a onclick="Upload.switchMode(' + e + ');">');
            u = u.replace("{/link}", "</a>"), o.appendChild(ce("div", {
                innerHTML: u,
                align: "left",
                className: "upload_switch_mode"
            }, {
                marginTop: "15px"
            }))
        }
    },
    initForm: function(e, o) {
        var t = e,
            a = this.vars[t],
            i = this.options[t];
        this.types[t] = "form";
        var l = '<form action="' + this.uploadUrls[t] + '" enctype="multipart/form-data" method="post" id="file_uploader_form' + t + '" target="upload_iframe' + t +
            '" style="text-align: center; width: 100%;">';
        if (i.signed) extend(a, {
            _jsonp: jsonpManager.reg(function(e) {
                Upload.onUploadComplete(t, e)
            })
        });
        else {
            var n = Upload.onUploadComplete.pbind(t),
                s = Upload.onUploadError.pbind(t);
            this.callbacks["ondone" + t] = function() {
                var e = n.pbind.apply(n, arguments);
                setTimeout(function() {
                    e()
                }, 1)
            }, this.callbacks["onfail" + t] = function() {
                var e = s.pbind.apply(s, arguments);
                setTimeout(function() {
                    e()
                }, 1)
            }, extend(a, {
                al: 1,
                ondone: "Upload.callbacks.ondone" + t,
                onfail: "Upload.callbacks.onfail" + t
            })
        }
        for (var d in a) l += '<input type="hidden" name="' + d + '" value="' + a[d] + '" />';
        var r = i.uploadButton ? "Upload.onUploadFileSelected(" + t + ")" : "Upload.onUploadStart(" + t + ");",
            p = '<input type="file" class="file" size="28" onchange="' + r + '" name="' + i.file_name + '" style="cursor: pointer;"' + (i.accept ? ' accept="' + i.accept +
                '"' : "") + '/>    </form><iframe style="position: absolute; visibility: hidden; width: 1px; height: 1px;" id="upload_iframe' + t +
            '" name="upload_iframe' + t + '"></iframe>';
        l += i.label ? i.label.split("{file}")
            .join(p) : p, o.innerHTML = l;
        var u = i.file_input,
            c = geByClass1("file", o, "input");
        delete i.file_input, u && c && (c.parentNode.replaceChild(u, c), u.onchange = function() {
            Upload.onUploadStart(t)
        }, data(u, "changed") && (data(u, "changed", !1), u.onchange())), i.uploadButton && i.setUploadAction ? i.setUploadAction(e, function() {
            Upload.onUploadStart(t)
        }) : i.uploadButton && (ge(i.uploadButton)
            .onclick = function() {
                Upload.onUploadStart(t)
            })
    },
    buttonOver: function(e) {
        var o = Upload.options[e];
        o.flash_lite ? o.hoverEl ? addClass(o.hoverEl, "hover") : isVisible("photos_flash_add_button") ? addClass(ge("photos_flash_add_button"), "hover") : addClass(ge(
            "photos_upload_area"), "hover") : addClass(ge("lite_upload" + e)
            .nextSibling, "hover")
    },
    buttonOut: function(e) {
        var o = Upload.options[e];
        o.flash_lite ? o.hoverEl ? removeClass(o.hoverEl, "hover") : isVisible("photos_flash_add_button") ? (removeClass(ge("photos_flash_add_button"), "hover"),
            removeClass(ge("photos_flash_add_button"), "active")) : removeClass(ge("photos_upload_area"), "hover") : (removeClass(ge("lite_upload" + e)
            .nextSibling, "hover"), removeClass(ge("lite_upload" + e)
            .nextSibling, "active"))
    },
    buttonDown: function(e) {
        Upload.options[e].flash_lite ? isVisible("photos_flash_add_button") && addClass(ge("photos_flash_add_button"), "active") : addClass(ge("lite_upload" + e)
            .nextSibling, "active")
    },
    buttonUp: function(e) {
        Upload.options[e].flash_lite ? isVisible("photos_flash_add_button") && removeClass(ge("photos_flash_add_button"), "active") : removeClass(ge("lite_upload" + e)
            .nextSibling, "active")
    },
    initFileApi: function(e, o, t) {
        var a, i = this.options[e],
            l = i && i.dragEl || window.boxLayerWrap;
        t && l && (Upload.addedDocEvent || (addEvent(document, "drop", Upload.drop), Upload.addedDocEvent = !0), i.dragEvObj = l, addEvent(l, "dragenter", Upload.dragEnter
                .pbind(e)), addEvent(l, "dragover", Upload.dragOver.pbind(e)), addEvent(l, "dragleave", Upload.dragOut.pbind(e))), this.types[e] = "fileApi", i.chooseBox ?
            a = '<input class="file" type="file" size="28" onchange="Upload.onFileApiSend(' + e + ', this.files);"' + (i.multiple ? ' multiple="true"' : "") + (i.accept ?
                ' accept="' + i.accept + '"' : "") + ' name="' + i.file_name + '" style="cursor: pointer;"/>' : i.uploadButton ? (i.lang.button_browse || (i.lang.button_browse =
                    "������� ����"), a = '<button class="flat_button upload_btn fl_l ' + (i.buttonClass || "") + '" onclick="this.nextSibling.nextSibling.click()">' +
                i.lang.button_browse +
                '</button><div class="upload_selected fl_l" style="padding: 4px 0 0 10px;"></div><input class="file" type="file" size="28" onchange="geByClass1(\'upload_selected\', this.parentNode).innerHTML = Upload.getFilesNames(' +
                e + ", this.files); Upload.onUploadFileSelected(" + e + ')"' + (i.multiple ? ' multiple="true"' : "") + (i.accept ? ' accept="' + i.accept + '"' : "") +
                ' name="' + i.file_name + '" style="visibility: hidden; position: absolute;"/><br class="clear" />') : (i.lang.button_browse || (i.lang.button_browse =
                    "������� ����"), a = i.flat_button ? '<button class="upload_btn flat_button button_big_width button_big ' + (i.buttonClass || "") +
                '" onclick="this.nextSibling.click()">' + i.lang.button_browse + '</button><input class="file" type="file" size="28" onchange="Upload.onFileApiSend(' +
                e + ', this.files);"' + (i.multiple ? ' multiple="true"' : "") + (i.accept ? ' accept="' + i.accept + '"' : "") + ' name="' + i.file_name +
                '" style="visibility: hidden; position: absolute;"/>' : '<button class="flat_button upload_btn ' + (i.buttonClass || "") +
                '" onclick="this.nextSibling.click()">' + i.lang.button_browse + '</button><input class="file" type="file" size="28" onchange="Upload.onFileApiSend(' +
                e + ', this.files);"' + (i.multiple ? ' multiple="true"' : "") + (i.accept ? ' accept="' + i.accept + '"' : "") + ' name="' + i.file_name +
                '" style="visibility: hidden; position: absolute;"/>'), i.label ? o.innerHTML = i.label.split("{file}")
            .join(a) : o.innerHTML = a;
        var n = i.file_input,
            s = geByClass1("file", o, "input");
        n && s && (s.parentNode.replaceChild(n, s), n.onchange = function() {
            Upload.onFileApiSend(e, this.files)
        }, data(n, "changed") && (data(n, "changed", !1), setTimeout(n.onchange.bind(n), 0))), i.uploadButton && i.setUploadAction ? i.setUploadAction(e, function() {
            Upload.onFileApiSend(e, geByTag1("input", o)
                .files)
        }) : i.uploadButton && (ge(i.uploadButton)
            .onclick = function() {
                Upload.onFileApiSend(e, geByTag1("input", o)
                    .files)
            })
    },
    switchMode: function(e) {
        Upload.options[e].noFlash = Upload.options[e].noCheck = 1, Upload.embed(e)
    },
    onUploadFileSelected: function(e) {
        Upload.options[e].onUploadFileSelected && Upload.options[e].onUploadFileSelected()
    },
    onUploadStart: function(e, o) {
        cur.fileApiUploadStarted = !0;
        var t = void 0 !== e.ind ? e.ind : e;
        if ("form" == Upload.types[t]) {
            var a = ge("file_uploader_form" + t);
            a.submit();
            var i = geByClass1("file", Upload.obj[t]);
            i.disabled = !0
        }
        var l = Upload.options[t];
        l.onUploadStart && l.onUploadStart(e, o)
    },
    getErrorAdditional: function(e) {
        return e.error && void 0 !== e.server && void 0 !== e.bwact ? (-1 !== e.error.indexOf(":") ? "," : ":") + " from upl_" + intval(e.server) + "?act=" + e.bwact.replace(
            /[^a-zA-Z_0-9]/g, "") : ""
    },
    onUploadComplete: function(e, o, t) {
        var a, i = void 0 !== e.ind ? e.ind : e,
            l = Upload.options[i];
        if (void 0 !== t && i === e && (e = t), e.ind = i, "form" == Upload.types[i]) {
            var n = geByClass1("file", Upload.obj[i]);
            n.disabled = !1
        }
        if (l.onUploadComplete) {
            var s = "";
            if (l.signed) {
                var a = o ? parseJSON(o) : "";
                a ? s = Upload.getErrorAdditional(a) : o = '{"error":"ERR_CLIENT_UPLOAD_FAIL: upload request bad result, url \\"' + Upload.uploadUrls[i] + '\\""}'
            }
            l.onUploadComplete(e, o, s)
        }
        "form" == Upload.types[i] && Upload.onUploadCompleteAll(e, o)
    },
    onUploadCompleteAll: function(e, o, t) {
        var a = void 0 !== e.ind ? e.ind : e,
            i = Upload.options[a];
        if (void 0 !== t && a === e && (e = t), "fileApi" == Upload.types[a]) {
            var l = geByClass1("file", Upload.obj[a], "input");
            l && (l.value = "")
        }
        i.onUploadCompleteAll && i.onUploadCompleteAll(e, o)
    },
    onUploadError: function(e, o) {
        var t = void 0 !== e.ind ? e.ind : e,
            a = Upload.options[t];
        if ("form" == Upload.types[t]) {
            var i = geByClass1("file", Upload.obj[t]);
            i.disabled = !1
        }
        a.signed ? a.onUploadComplete && a.onUploadComplete(e, '{"error":"ERR_CLIENT_UPLOAD_FAIL: upload request fail, code \\"' + o.replace(/([\\\"])/g, "\\$1")
            .replace(/\n/g, "\\n") + '\\", url \\"' + Upload.uploadUrls[t] + '\\""}') : a.onUploadError && a.onUploadError(e, o)
    },
    onConnectionLost: function(e) {
        var o = void 0 !== e.ind ? e.ind : e,
            t = Upload.options[o];
        t.onConnectionLost && t.onConnectionLost(e)
    },
    onUploadProgress: function(e, o, t) {
        var a = void 0 !== e.ind ? e.ind : e,
            i = Upload.options[a];
        i.onUploadProgress && i.onUploadProgress(e, o, t)
    },
    onDebug: function(e, o) {
        var t = void 0 !== e.ind ? e.ind : e,
            a = Upload.options[t];
        a.onDebug && a.onDebug(e, o)
    },
    onSelectClick: function(e, o) {
        var t = void 0 !== e.ind ? e.ind : e,
            a = Upload.options[t];
        a.onSelectClick && a.onSelectClick(e, o)
    },
    getFilesNames: function(e, o) {
        if (o && o.length) {
            var t = this.options[e];
            return t.multiple ? (t.lang.selected_num_files || (t.lang.selected_num_files = ["", "%s ����", "%s �����", "%s ������"]), langNumeric(o.length, t.lang.selected_num_files)) :
                o[0].name.replace(/[&<>"']/g, "")
        }
    },
    checkFileType: function(e, o) {
        var t = !1;
        return each(o.split(";"), function(o, a) {
            return a = a.substr(1)
                .toLowerCase(), e.substr(-a.length)
                .toLowerCase() == a || ".*" == a ? (t = !0, !1) : void 0
        }), t
    },
    onFileApiSend: function(e, o, t) {
        if (o && o.length) {
            var a = this.options[e];
            if (a.file_types) {
                var i = [];
                if (each(o, function(e, o) {
                        Upload.checkFileType(o.name, a.file_types) && i.push(o)
                    }), o = i, !o.length) return
            }
            if (a.reverse_files && (o = Array.prototype.slice.call(o)
                    .reverse()), !a.multiple && o.length > 1 && (o = [o[0]]), a.file_size_limit)
                for (var l in o) {
                    var n = o[l];
                    if (n.size && n.size > a.file_size_limit) return void(a.lang.filesize_error && showFastBox({
                        title: getLang("global_error"),
                        width: 430,
                        dark: 1,
                        bodyStyle: "padding: 20px; line-height: 160%;",
                        onHide: function() {
                            Upload.embed(e), delete cur.notStarted
                        }
                    }, a.lang.filesize_error, getLang("global_continue"), function() {
                        Upload.uploadFiles(e, o, s), a.filesize_hide_last ? curBox()
                            .hide() : boxQueue.hideAll()
                    }, getLang("global_cancel")))
                }
            if (a.photoBox && !t) return Upload.onPhotoAdd(e, o);
            a.beforeUpload && a.beforeUpload(e), cur.notStarted = cur.fileApiUploadStarted = !0, a.multi_progress || this.onUploadStart({
                ind: e,
                fileName: (o[0].fileName || o[0].name || "")
                    .replace(/[&<>"']/g, "")
            });
            var s = o.length;
            if (a.max_files) {
                var d = cur.attachCount;
                if (!d && cur.addMedia) {
                    var r = -1;
                    for (var p in cur.addMedia) p > r && (r = p);
                    r >= 0 && cur.addMedia[r] && cur.addMedia[r].attachCount && (d = cur.addMedia[r].attachCount)
                }
                var u = d ? d() : 0;
                a.max_files - u < o.length && a.lang && a.lang.max_files_warning ? (s = a.max_files - u, showFastBox({
                    title: getLang("global_error"),
                    width: 430,
                    dark: 1,
                    bodyStyle: "padding: 20px; line-height: 160%;",
                    onHide: function() {
                        Upload.embed(e), delete cur.notStarted
                    }
                }, a.lang.max_files_warning, getLang("global_continue"), function() {
                    Upload.uploadFiles(e, o, s), a.max_files_hide_last ? curBox()
                        .hide() : boxQueue.hideAll()
                }, getLang("global_cancel"))) : (a.force_max_files && (s = Math.min(s, a.max_files - (cur.savedPhotos || [])
                    .length)), this.uploadFiles(e, o, s))
            } else this.uploadFiles(e, o, s)
        }
    },
    onPhotoAdd: function(e, o) {
        var t = 0,
            a = 0;
        Upload.fileList = Upload.fileList || {}, Upload.fileList[e] || (Upload.fileList[e] = [], Upload.options[e].onPhotoBox && (t = !0)), each(o, function(o, t) {
            a++;
            var i = Upload.options[e].photoBox,
                l = new RegExp("image.*");
            !t.type.match(l), cur.uploaderPhotoId = (cur.uploaderPhotoId || 0) + 1;
            var n = cur.uploaderPhotoId;
            Upload.fileList[e][n] = t;
            var s = ce("img"),
                d = ce("div", {
                    id: "photos_add_item" + n,
                    className: "photos_add_item",
                    innerHTML: '<span class="photos_add_img photos_add_wait" id="photos_add_cont' + n + '" onmouseover="PhotosAdd.thumbOver(' + n +
                        ', this);" onmouseout="PhotosAdd.thumbOut(' + n + ');"><span class="photos_add_s" id="photos_add_s' + n +
                        '">&nbsp;</span></span><span class="bg">&nbsp;</span>'
                });
            i.appendChild(d);
            var r = new FileReader;
            r.onload = function(e) {
                s.src = e.target.result, s.onload = function() {
                    s.onload = !1;
                    var e, o, t = {
                        w: s.width,
                        h: s.height
                    };
                    t.w > 130 && (e = 130 / t.w, t.w = 130, t.h = parseInt(t.h * e)), t.h > 130 && (o = 130 / t.h, t.h = 130, t.w = parseInt(t.w * o));
                    var a = ce("canvas", {
                            width: t.w,
                            height: t.h
                        }),
                        i = a.getContext("2d");
                    i.drawImage(s, 0, 0, t.w, t.h), delete s;
                    var l = a.toDataURL("image/jpeg");
                    s.src = l;
                    var d = ge("photos_add_s" + n),
                        r = Math.max(t.w, 80),
                        p = Math.min(t.h, 98);
                    setStyle(d, {
                        width: r,
                        height: p,
                        marginLeft: Math.ceil((130 - r) / 2)
                    }), d.innerHTML = "", d.appendChild(s), s.onload = function() {
                        setTimeout(function() {
                            d.parentNode.className = "photos_add_img"
                        }, 0), s.onload = !1
                    }, Upload.finishTask()
                }
            }, Upload.taskToQ(function() {
                r.readAsDataURL(t)
            })
        }), t && a && Upload.options[e].onPhotoBox(), Upload.options[e].onPhotoAdd && a && Upload.options[e].onPhotoAdd()
    },
    uploadPhotos: function(e) {
        var o = [],
            t = Upload.fileList[e];
        for (var a in t) t[a] && o.push(extend(t[a], {
            fileRef: a
        }));
        return Upload.options[e].onUploadStart && Upload.options[e].onUploadStart(), o.length ? (cur.uploadCount = Math.min(500, o.length), Upload.uploadFiles(e, o,
            cur.uploadCount), !0) : !1
    },
    taskToQ: function(e) {
        if (Upload.previewFileQ || (Upload.previewFileQ = []), e && Upload.previewFileQ.push(e), !Upload.doingQ) {
            var o = Upload.previewFileQ.shift();
            o && (Upload.doingQ = !0, o())
        }
    },
    finishTask: function() {
        setTimeout(function() {
            Upload.doingQ = !1, Upload.taskToQ()
        }, 100)
    },
    uploadFiles: function(e, o, t) {
        if (!(0 >= t)) {
            var a, i = this.options[e],
                l = i.signed ? this.vars[e] : extend(this.vars[e], {
                    ajx: 1
                }),
                n = [],
                s = 0,
                d = 0,
                r = 0,
                p = 0,
                u = [];
            i.uploading && (s = i.filesTotalSize || 0, d = i.filesTotalCount || 0, p = i.filesLoadedCount || 0, r = i.filesLoadedSize || 0, u = i.filesQueue), i.file_match &&
                (a = new RegExp(i.file_match, "i"));
            for (var c in l) n.push(c + "=" + l[c]);
            for (var h, f = this.uploadUrls[e] + (this.uploadUrls[e].match(/\?/) ? "&" : "?") + n.join("&"), g = !1, c = 0; t > c; c++) h = (o[c].fileName || o[c].name ||
                    "")
                .replace(/[&<>"']/g, ""), !i.file_match || h.match(a) ? (i.multi_progress && !i.multi_sequence && this.onUploadStart({
                    ind: e,
                    fileName: h
                }), s += o[c].size, d += 1, u.push(o[c])) : g = !0;
            u.reverse(), extend(i, {
                filesQueue: u,
                filesTotalSize: s,
                filesLoadedSize: r,
                filesLoadedCount: p,
                filesTotalCount: d
            }), u.length > 0 ? void 0 !== cur.multiProgressIndex ? (cur.nextQueues || (cur.nextQueues = []), cur.nextQueues.push(e)) : (this.uploadFile(e, u.pop(),
                f), i.multi_progress && (cur.multiProgressIndex = e)) : g && Upload.onUploadError(e, "file type not supported")
        }
    },
    getFileInfo: function(e, o, t) {
        return o.multi_progress ? {
            ind: e,
            fileName: t ? (t.fileName || t.name || "")
                .replace(/[&<>"']/g, "") : "",
            num: o.filesLoadedCount,
            totalSize: o.filesTotalSize,
            loadedSize: o.filesLoadedSize,
            totalCount: o.filesTotalCount,
            file: t
        } : e
    },
    supportsChunkedUpload: function() {
        return !!Blob && !!(Blob.prototype.webkitSlice || Blob.prototype.mozSlice || Blob.prototype.slice) && !!FileReader
    },
    uploadFileChunked: function(e, o, t) {
        function a(e, o) {
            var t = 1048576,
                a = Math.floor(e.size / 2) - t / 2,
                i = [e.slice(0, t), e.slice(a, a + t), e.slice(e.size - t, e.size)];
            ! function l(e) {
                var t = i.shift();
                if (!t) return void o(e);
                var a = new FileReader;
                a.addEventListener("loadend", function(o) {
                    var t = new Uint8Array(o.target.result),
                        a = Fletcher32();
                    a.append(t), e += a.result()
                        .toString(16), l(e)
                }), a.readAsArrayBuffer(t)
            }("")
        }

        function i() {
            for (m.pointer = 0, m.chunksLeft = m.chunksNum; m.activeRequests.length < f && m.pointer < m.fileSize;) l()
        }

        function l() {
            var e = m.pointer,
                o = Math.min(e + m.state.chunkSize, m.fileSize) - 1;
            if (!(e >= m.fileSize)) {
                if (m.state.loaded) {
                    var t = !1;
                    each(m.state.loaded.split(","), function(a, i) {
                        var l = i.match(/^(\d+)-(\d+)\/\d+$/),
                            n = parseInt(l[1]),
                            s = parseInt(l[2]);
                        return e >= n && s >= o ? (t = !0, m.chunksLeft -= Math.ceil((s + 1 - e) / m.state.chunkSize), m.pointer = s + 1, !1) : void 0
                    })
                }
                t ? (s(), l()) : (n(e, o), m.pointer += m.state.chunkSize)
            }
        }

        function n(e, a) {
            var r = (o.slice || o.webkitSlice || o.mozSlice)
                .call(o, e, a + 1),
                u = new XMLHttpRequest;
            u.open("POST", t, !0), u.upload.onprogress = function(o) {
                o.lengthComputable && (m.requestsProgress[e] = o.loaded), s()
            }, u.onload = function(o) {
                m.activeRequests.splice(indexOf(m.activeRequests, o.target), 1), m.retryCount = 0, --m.chunksLeft, 201 == o.target.status ? m.chunksLeft ? (m.state
                    .loaded = o.target.responseText, ls.set(m.storageKey, m.state), l()) : (m.state.loaded = o.target.responseText, ls.set(m.storageKey, m.state),
                    i()) : 200 != o.target.status || m.chunksLeft ? (p(o.target.status, o.target.responseText, e + "-" + a), Upload.onUploadError(c)) : (ls.remove(
                    m.storageKey), d(o.target.responseText)), delete m.requestsProgress[e], s()
            }, u.onerror = function(o) {
                if (m.activeRequests.splice(indexOf(m.activeRequests, o.target), 1), ++m.retryCount <= g) {
                    var t = setTimeout(n.bind(null, e, a), 300 * m.retryCount);
                    m.timeouts.push(t)
                } else m.abort(), Upload.onConnectionLost(c);
                s(), p(o.target.status, o.target.responseText, e + "-" + a)
            }, u.setRequestHeader("Content-Disposition", 'attachment, filename="' + encodeURI(m.fileName) + '"'), u.setRequestHeader("Content-Type", m.fileMime ||
                "application/octet-stream"), u.setRequestHeader("Content-Range", "bytes " + e + "-" + a + "/" + m.fileSize), u.setRequestHeader("Session-ID", m.state
                .sessionId), u.send(r), r = null, m.activeRequests.push(u)
        }

        function s() {
            var t = m.fileSize,
                a = (m.chunksNum - m.chunksLeft) * m.state.chunkSize;
            each(m.requestsProgress, function(e, o) {
                a += o
            }), extend(c, Upload.getFileInfo(e, u, o)), u.multi_progress ? Upload.onUploadProgress(c, a, t) : Upload.onUploadProgress(e, Math.min(a + u.filesLoadedSize,
                u.filesTotalSize), u.filesTotalSize)
        }

        function d(a) {
            extend(c, Upload.getFileInfo(e, u, o)), Upload.options[e].filesLoadedSize += m.fileSize, Upload.options[e].filesLoadedCount += 1, Upload.onUploadComplete(c,
                a), Upload.options[e].filesQueue && Upload.options[e].filesQueue.length > 0 ? Upload.uploadFile(e, Upload.options[e].filesQueue.pop(), t) : (Upload
                .startNextQueue(e), Upload.onUploadCompleteAll(c, a), u.uploading = !1)
        }

        function r(e) {
            each(e.timeouts, function(e, o) {
                clearTimeout(o)
            }), each(e.activeRequests, function(e, o) {
                o.abort()
            }), e.timeouts = [], e.activeRequests = []
        }

        function p(e, o, a) {
            ajax.post("al_video.php", {
                act: "uploadVideoFailStat",
                url: t,
                error: e + "," + o,
                range: a,
                sessionId: m.state.sessionId,
                chunksLeft: m.chunksLeft,
                loaded: m.state.loaded
            })
        }
        var u = this.options[e],
            c = Upload.getFileInfo(e, u, o);
        u.multi_sequence && this.onUploadStart(c);
        var h = 4194304,
            f = 4,
            g = 50,
            U = 864e5,
            m = {
                file: o,
                fileName: (o.name || o.fileName)
                    .replace(/[&<>"']/g, ""),
                fileSize: o.size,
                fileMime: o.type,
                retryCount: 0,
                timeouts: [],
                activeRequests: [],
                requestsProgress: {},
                pointer: 0,
                state: {
                    url: t,
                    started: Date.now(),
                    loaded: null,
                    chunkSize: u.chunkSize || h,
                    sessionId: (1e17 * Math.random())
                        .toString(16)
                }
            };
        m.abort = r.bind(null, m), m.chunksNum = Math.ceil(m.fileSize / m.state.chunkSize), m.chunksLeft = m.chunksNum, a(o, function(e) {
            m.storageKey = ["upload", vk.id, e, m.fileSize].join("_"), u.uploading = !0, u.chunkedUpload = m;
            var o = ls.get(m.storageKey);
            o && (Date.now() - o.started < U ? (m.state = o, t = o.url) : ls.remove(m.storageKey));
            try {
                console.log("%c Warning: if devtools is logging network requests it may cause high memory usage during file upload",
                    "font-size:16px;color:orange;")
            } catch (a) {}
            i()
        })
    },
    resumeUpload: function(e) {
        var o = this.options[e].chunkedUpload;
        Upload.uploadFileChunked(e, o.file, o.state.url)
    },
    uploadFile: function(e, o, t) {
        var a = this.options[e];
        if (a.chunked && Upload.supportsChunkedUpload() && o.size > 4194304) return void Upload.uploadFileChunked.apply(Upload, arguments);
        var i = browser.msie && intval(browser.version) < 10 ? window.XDomainRequest : window.XMLHttpRequest,
            l = Upload.getFileInfo(e, a, o);
        if (a.multi_sequence && this.onUploadStart(l), a.uploading = !0, window.FormData) {
            var n = new FormData;
            o instanceof File ? n.append(a.file_name, o) : n.append(a.file_name, o, o.filename.replace(/[&<>"']/g, ""));
            var s = new i,
                d = !0;
            s.open("POST", t, !0), s.onload = function(i) {
                extend(l, Upload.getFileInfo(e, a, o)), Upload.options[e].filesLoadedSize += o.size, Upload.options[e].filesLoadedCount += 1, Upload.onUploadComplete(
                    l, i.target.responseText), Upload.options[e].filesQueue && Upload.options[e].filesQueue.length > 0 ? Upload.uploadFile(e, Upload.options[e]
                    .filesQueue.pop(), t) : (Upload.startNextQueue(e), Upload.onUploadCompleteAll(l, i.target.responseText), a.uploading = !1)
            }, s.onerror = function(i) {
                extend(l, Upload.getFileInfo(e, a, o)), Upload.options[e].filesTotalSize -= o.size, Upload.options[e].filesTotalCount -= 1, Upload.onUploadError(l,
                    i.target.responseText), Upload.options[e].filesQueue.length > 0 ? Upload.uploadFile(e, Upload.options[e].filesQueue.pop(), t) : (Upload.startNextQueue(
                    e), Upload.onUploadCompleteAll(l, i.target.responseText), a.uploading = !1)
            }, s.upload.onprogress = function(t) {
                d = !1, extend(l, Upload.getFileInfo(e, a, o)), t.lengthComputable && (a.multi_progress ? Upload.onUploadProgress(l, t.loaded, t.total) : Upload.onUploadProgress(
                    e, Math.min(t.loaded + a.filesLoadedSize, a.filesTotalSize), a.filesTotalSize))
            }, s.send(n)
        } else try {
            if (i && !i.prototype.sendAsBinary && window.ArrayBuffer && window.Uint8Array) {
                var r = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
                r && (i.prototype.sendAsBinary = function(e) {
                    for (var o = new ArrayBuffer(e.length), t = new Uint8Array(o, 0), a = 0; a < e.length; a++) t[a] = 255 & e.charCodeAt(a);
                    var i = new r;
                    i.append(o);
                    var l = i.getBlob();
                    this.send(l)
                })
            }
            var p = new FileReader;
            p.onload = function() {
                var n = new i,
                    s = !0;
                n.onload = function(i) {
                    extend(l, Upload.getFileInfo(e, a, o)), Upload.options[e].filesLoadedSize += o.size, Upload.options[e].filesLoadedCount += 1, Upload.onUploadComplete(
                            l, i.target.responseText), Upload.options[e].filesQueue.length > 0 ? Upload.uploadFile(e, Upload.options[e].filesQueue.pop(), t) :
                        (Upload.startNextQueue(e), Upload.onUploadCompleteAll(l, i.target.responseText))
                }, n.onerror = function(i) {
                    extend(l, Upload.getFileInfo(e, a, o)), Upload.options[e].filesTotalSize -= o.size, Upload.options[e].filesTotalCount -= 1, Upload.onUploadError(
                            l, i.target.responseText), Upload.options[e].filesQueue.length > 0 ? Upload.uploadFile(e, Upload.options[e].filesQueue.pop(), t) :
                        (Upload.startNextQueue(e), Upload.onUploadCompleteAll(l, i.target.responseText), a.uploading = !1)
                }, n.upload.onprogress = function(t) {
                    s = !1, extend(l, Upload.getFileInfo(e, a, o)), t.lengthComputable && (a.multi_progress ? (Upload.onUploadProgress(l, t.loaded, t.total),
                        a.uploading = !1) : Upload.onUploadProgress(e, Math.min(t.loaded + a.filesLoadedSize, a.filesTotalSize), a.filesTotalSize))
                }, n.open("POST", t, !0);
                var d = "---------" + irand(1111111111, 9999999999);
                n.setRequestHeader("Content-Type", "multipart/form-data, boundary=" + d);
                var r = "--" + d + "\r\n";
                r += "Content-Disposition: form-data; name='" + a.file_name + "'; filename='" + o.name.replace(/[&<>"']/g, "") + "'\r\n", r +=
                    "Content-Type: application/octet-stream\r\n\r\n", r += p.result + "\r\n", r += "--" + d + "--", n.sendAsBinary(r)
            }, p.readAsBinaryString(o)
        } catch (u) {
            try {
                console.error(u)
            } catch (c) {}
        }
        Upload.options[e].xhr = s
    },
    terminateUpload: function(e, o, t) {
        try {
            var a = Upload.vars[e],
                i = Upload.options[e],
                l = [],
                n = i.filesQueue;
            inQueue = !1, info = i.multi_progress ? {
                ind: e,
                fileName: o.replace(/[&<>"']/g, "")
            } : e, ind = o ? e + "_" + o : e;
            for (var s in a) l.push(s + "=" + a[s]);
            for (var s in n)
                if (o == (n[s].fileName || n[s].name || "")
                    .replace(/[&<>"']/g, "")) {
                    n.splice(s, 1), inQueue = !0;
                    break
                }
            t && t.tt && t.tt.destroy(), re("upload" + ind + "_progress_wrap"), Upload.onUploadComplete(info,
                    '{"error":"ERR_UPLOAD_TERMINATED: upload request was terminated"}'), !inQueue && i.xhr && i.xhr.abort(), !inQueue && i.chunkedUpload && i.chunkedUpload
                .abort();
            var d = this.uploadUrls[e] + (this.uploadUrls[e].match(/\?/) ? "&" : "?") + l.join("&");
            inQueue || (n.length > 0 ? Upload.uploadFile(e, n.pop(), d) : (Upload.startNextQueue(e), Upload.onUploadCompleteAll(info, "")))
        } catch (r) {
            try {
                console.error(r)
            } catch (p) {}
        }
    },
    startNextQueue: function(e) {
        if (void 0 === cur.multiProgressIndex && setTimeout(function() {
                delete cur.fileApiUploadStarted
            }, 1e3), e == cur.multiProgressIndex) {
            var o = this.options[e];
            if (o.multi_progress && cur.nextQueues && cur.nextQueues.length) {
                var t = cur.nextQueues[0],
                    a = Upload.options[t].filesQueue;
                for (cur.nextQueues.splice(0, 1); 0 == a.length && cur.nextQueues.length > 0;) t = cur.nextQueues[0], cur.nextQueues.splice(0, 1), a = Upload.options[t]
                    .filesQueue;
                if (a.length > 0) {
                    var i = Upload.vars[t],
                        l = [];
                    for (var n in i) l.push(n + "=" + i[n]);
                    var s = Upload.uploadUrls[t] + (Upload.uploadUrls[t].match(/\?/) ? "&" : "?") + l.join("&");
                    Upload.uploadFile(t, a.pop(), s), cur.multiProgressIndex = t
                } else delete cur.multiProgressIndex, setTimeout(function() {
                    delete cur.fileApiUploadStarted
                }, 1e3)
            } else delete cur.multiProgressIndex, setTimeout(function() {
                delete cur.fileApiUploadStarted
            }, 1e3)
        }
    },
    isFileDrag: function(e) {
        if (!e || e.target && ("IMG" == e.target.tagName || "A" == e.target.tagName)) return !1;
        if (!e.dataTransfer.types) return !0;
        for (var o = 0; o < e.dataTransfer.types.length; o++)
            if ("Files" == e.dataTransfer.types[o]) return !0;
        return !1
    },
    dragEnter: function(e, o) {
        return cur.uploadDragStarted && 1 != cur.uploadDragStarted || (cur.uploadDragStarted = Upload.isFileDrag(o) ? 2 : 1), 1 != cur.uploadDragStarted && Upload.dropbox[
            e] ? (setTimeout(function() {
            clearTimeout(Upload.dragTimer[e]), delete Upload.dragTimer[e]
        }, 0), Upload.options[e].onDragEnter && Upload.options[e].onDragEnter(o), show(Upload.dropbox[e]), void cancelEvent(o)) : void cancelEvent(o)
    },
    dragOut: function(e, o) {
        return 1 != cur.uploadDragStarted && Upload.dropbox[e] ? (Upload.dragTimer[e] && (clearTimeout(Upload.dragTimer[e]), delete Upload.dragTimer[e]), Upload.dragTimer[
            e] = setTimeout(function() {
            Upload.options[e].visibleDropbox || hide(Upload.dropbox[e]), Upload.options[e].onDragOut && Upload.options[e].onDragOut(), removeClass(Upload.dropbox[
                e], "dropbox_over")
        }, 100), void cancelEvent(o)) : void cancelEvent(o)
    },
    dragOver: function(e, o) {
        if (1 == cur.uploadDragStarted || !Upload.dropbox[e]) return void cancelEvent(o);
        browser.mozilla && intval(browser.version) > 3 && !Upload.options[e].visibleDropbox && (cur.dragOverTimer && (clearTimeout(cur.dragOverTimer), delete cur.dragOverTimer),
            cur.dragOverTimer = setTimeout(function() {
                hide(Upload.dropbox[e])
            }, 100));
        var t = Upload.insideDropbox(e, o);
        o.dataTransfer && (o.dataTransfer.dropEffect = t ? "copy" : "none"), toggleClass(Upload.dropbox[e], "dropbox_over", t), cancelEvent(o)
    },
    drop: function(e) {
        return each(Upload.dropbox, function(o, t) {
            t && (Upload.insideDropbox(o, e) && Upload.onFileApiSend(o, e.dataTransfer.files), Upload.options[o].visibleDropbox || hide(t), Upload.options[o].onDrop &&
                Upload.options[o].onDrop(), removeClass(t, "dropbox_over"))
        }), delete cur.uploadDragStarted, cancelEvent(e), !1
    },
    insideDropbox: function(e, o) {
        for (var t = o.target; t.parentNode;) {
            if (t == Upload.dropbox[e]) return !0;
            t = t.parentNode
        }
        return !1
    },
    flashCallbacks: function() {
        return {
            onUploadStart: Upload.onUploadStart,
            onUploadProgress: Upload.onUploadProgress,
            onUploadSuccess: Upload.onUploadComplete,
            onUploadComplete: Upload.onUploadCompleteAll,
            onUploadError: Upload.onUploadError,
            onDebug: Upload.onDebug,
            onMouseDown: Upload.buttonDown,
            onMouseUp: Upload.buttonUp,
            onMouseOver: Upload.buttonOver,
            onMouseOut: Upload.buttonOut,
            onSelectClick: Upload.onSelectClick
        }
    },
    _eof: 1
};
try {
    stManager.done("upload.js")
} catch (e) {}
