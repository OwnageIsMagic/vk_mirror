var abp = abp || !1,
    scripts = document.getElementsByTagName("script"),
    script = scripts[scripts.length - 1];
if (script) {
    for (var query = script.src.replace(/^[^\?]+\??/, "")
            .split("&"), params = {}, i = 0; i < query.length; i++) {
        var param = query[i].split("=");
        params[param[0]] = param[1]
    }
    1 == params.ch ? abp = !0 : 2 == params.ch && (abp = abp && !1)
}
