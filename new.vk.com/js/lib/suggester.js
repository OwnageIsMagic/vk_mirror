function Suggester(t, e) {
    var s = this;
    if (this.inputEl = ge(t), this.opts = extend(e, {}), this.inputEl) {
        data(this.inputEl, "suggester", this), addEvent(this.inputEl, "input keydown change click valueChanged", function(t) {
            if ("valueChanged" == t.type) {
                this._prevData = !1;
                var e = val(s.inputEl);
                e == s._lastQueryText || s._preventNextEvent || s._hideResultsList(), s._preventNextEvent = !1
            } else if ("click" == t.type) s._showResultsList();
            else if ("keydown" == t.type) switch (s.preventShowResults = !1, t.keyCode) {
                case KEY.UP:
                    s._preventNextEvent = !0, s._selectNextItem(-1);
                    break;
                case KEY.DOWN:
                    s._preventNextEvent = !0, s._selectNextItem(1);
                    break;
                case KEY.ENTER:
                    s._selectItem(), s._hideResultsList(), s.preventShowResults = !0;
                    break;
                case KEY.ESC:
                    s._prevInputVal && val(s.inputEl, s._prevInputVal), s._hideResultsList()
            } else s.search(val(this))
        }), this._resultsListEl = se('<div class="' + Suggester.SUGG_CLASS + '"></div>');
        var i = domPN(this.inputEl);
        domLC(i) == this.inputEl ? i.appendChild(this._resultsListEl) : i.insertBefore(this._resultsListEl, this.inputEl), setStyle(this._resultsListEl, "top", getSize(this.inputEl)[
                1]), addEvent(this._resultsListEl, "click", function(t) {
                "li" == t.target.nodeName.toLowerCase() && (s.selected = s._curItems[t.target.getAttribute("data-index")], s._selectItem(), s._hideResultsList())
            }), this._lastQueryText = "", this._initiateRequest = debounce(this._initiateRequest, 200)
            .bind(this)
    }
}
Suggester.MAX_ITEMS = 10, Suggester.SUGG_CLASS = "ui_suggester_results_list", Suggester.prototype.destroy = function() {
    data(this.inputEl, "suggester", null), this._hideResultsList()
}, Suggester.prototype.search = function(t) {
    t = trim(t), this._lastQueryText != t && (this._lastQueryText = t, t ? this._initiateRequest(t) : (this._prevData = !1, this._hideResultsList()))
}, Suggester.prototype._initiateRequest = function(t) {
    var e = this;
    this._hideResultsList(),
        function(t) {
            ajax.post("/hints.php", {
                act: "a_gsearch_hints",
                q: t,
                section: e.opts.section
            }, {
                onDone: function(s) {
                    e._lastQueryText != t || e.preventShowResults || (e._prevData = s, e._showResultsList(s))
                }
            })
        }(t)
}, Suggester.prototype._showResultsList = function(t) {
    t = t || this._prevData || [];
    var e = this;
    if (t = t.filter(function(t) {
            return t[3] != e._lastQueryText
        }), t && t.length) {
        if (val(e.inputEl)) {
            cur.preventInputActions = !0, this._curItems = t;
            var s = "",
                i = "";
            this.opts.sidePadding && (i = 'style="padding-left: ' + this.opts.sidePadding + "; padding-right: " + this.opts.sidePadding + '"'), each(t, function(t, e) {
                    return t >= Suggester.MAX_ITEMS ? !1 : void(s += '<li data-index="' + t + '" ' + i + ">" + e[1] + "</li>")
                }), this._resultsListEl.innerHTML = "<ul>" + s + "</ul>", show(this._resultsListEl), this._wc_event && removeEvent(window, "mousedown", this._wc_event),
                addEvent(window, "mousedown", this._wc_event = this._onWindowClick.bind(this)), cur.destroy.push(function() {
                    e._hideResultsList()
                })
        }
    } else hide(this._resultsListEl)
}, Suggester.prototype._selectNextItem = function(t) {
    if (t = t > 0 ? !0 : !1, isVisible(this._resultsListEl)) {
        var e, s = geByClass1("active", this._resultsListEl);
        if (s) e = (t ? domNS : domPS)(s), e || (e = domPN(s)[t ? "firstChild" : "lastChild"]);
        else {
            var i = geByTag("li", this._resultsListEl);
            e = i[t ? 0 : i.length - 1]
        }
        removeClass(s, "active"), addClass(e, "active"), this._prevInputVal || (this._prevInputVal = val(this.inputEl)), this.selected = this._curItems[e.getAttribute(
            "data-index")], this.opts.onSelect && this.opts.onSelect(this.selected)
    }
}, Suggester.prototype._selectItem = function() {
    this.selected && this.opts.onChoose && this.opts.onChoose(this.selected)
}, Suggester.prototype._onWindowClick = function(t) {
    t.target == this.inputEl || gpeByClass(Suggester.SUGG_CLASS, t.target) || this._hideResultsList()
}, Suggester.prototype._hideResultsList = function() {
    this._wc_event && removeEvent(window, "mousedown", this._wc_event), cur.preventInputActions = this.selected = this._curItems = this._prevInputVal = !1, hide(this._resultsListEl)
};
try {
    stManager.done("suggester.js")
} catch (e) {}
