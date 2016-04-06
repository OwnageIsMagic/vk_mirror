function GridSorter(t, e, i) {
    if (isObject(e) ? i = e : this._dragElClass = e, this.options = extend({
            dragThreshold: GridSorter.DRAG_THRESHOLD_DIST
        }, i), this._contEl = ge(t), this._contEl) {
        this._excludedCount = 0;
        for (var o = 0; o < this._contEl.children.length; o++) this._contEl.children[o].getAttribute("nodrag") && this._excludedCount++;
        addEvent(this._contEl, "mousedown", this._ev_mousedown_handler = this._onMouseDown.bind(this)), setStyle(this._contEl, "position", "relative")
    }
}
GridSorter.AUTO_SCROLL_DY = 10, GridSorter.DRAG_THRESHOLD_DIST = 0, GridSorter.AUTO_SCROLL_DISTANCE_THRESHOLD = 300, GridSorter.AUTO_SCROLL_GAP = 300, GridSorter.prototype.destroy =
    function() {
        this._deinitEvents(!0)
    }, GridSorter.prototype._getParentDragItemEl = function(t) {
        for (var e, i = t; i && (e = domPN(i)) != this._contEl;) i = e;
        return i == this._curPlaceholderEl && (i = null), i
    }, GridSorter.prototype._onMouseDown = function(t) {
        if (!(this._disabled || 0 != t.button || this._curDragEl || domData(t.target, "nodrag") || attr(t.target, "nodrag")) && (this._dragElClass ? hasClass(t.target, this._dragElClass) :
                1)) {
            var e = this._getParentDragItemEl(t.target);
            if (e && !attr(e, "nodrag") && (re(geByClass1("ui_gridsorter_placeholder"), this._contEl), this._ensureGridIsActual(), !(this._grid.length <= 1))) {
                var i = window.getComputedStyle(e),
                    o = getXY(e);
                this._initial = {
                    candidateEl: e,
                    x: t.clientX,
                    y: t.clientY,
                    itemMargin: {
                        x: parseInt(i.marginLeft),
                        y: parseInt(i.marginTop)
                    },
                    shift: {
                        x: t.pageX - o[0],
                        y: t.pageY - o[1]
                    }
                }, addEvent(document, "mousemove", this._ev_mousemove_handler = this._onMouseMove.bind(this)), addEvent(document, "mouseup", this._ev_mouseup_handler = this._onMouseUp
                    .bind(this)), cur.cancelClick = !1, cancelEvent(t)
            }
        }
    }, GridSorter.prototype._dist = function(t) {
        return Math.abs(t.clientX - this._initial.x) + Math.abs(t.clientY - this._initial.y)
    }, GridSorter.prototype._onMouseUp = function(t) {
        var e = this._curDragEl,
            i = !1,
            o = this;
        if (this._curDragEl) {
            this._curDragEl = null, removeClass(e, "ui_gridsorter_moveable_notrans"), this._curOverCell || (this._curOverCell = {
                el: this._curPlaceholderEl,
                pos: getXY(this._curPlaceholderEl),
                size: getSize(this._curPlaceholderEl)
            });
            var r = this._curOverCell.pos,
                s = this._curOverCell.el,
                l = (getXY(s), getSize(e)),
                n = this._getItemMargins();
            r[0] += this._curOverCell.size[0] - l[0] - n[0], r[1] += this._curOverCell.size[1] - l[1] - n[1], setTimeout(function() {
                i || o._setPos(e, {
                    left: r[0],
                    top: r[1]
                })
            }), setTimeout(function() {
                if (re(o._curPlaceholderEl), removeClass(o._contEl, "ui_gridsorter_cont"), i)
                    for (var t = 0, r = o._grid.length; r > t; t++) cell = o._grid[t], o._setPos(cell.el, {
                        left: null,
                        top: null
                    });
                else {
                    var l = o._isShiftToLeft ? domNS(s) : s;
                    o._contEl.insertBefore(e, l);
                    var n, h = -1,
                        a = (o._getContShift(), o._initial.hasInlineSize);
                    o._setPos(e, {
                        left: null,
                        top: null
                    }), a || setStyle(e, {
                        width: null,
                        height: null
                    });
                    for (var t = 0, r = o._grid.length; r > t; t++) cell = o._grid[t], (cell.dirty || cell.el == e) && (o._setPos(cell.el, {
                        left: null,
                        top: null
                    }), a || setStyle(cell.el, {
                        width: null,
                        height: null
                    }), cell.pos = o._calcElementPos(cell.el), cell.dirty = !1), cell.el == e ? n = t : cell.el == s && (overCell = cell, h = t);
                    if (h >= 0) {
                        var _ = o._grid.splice(n, 1);
                        o._grid.splice(h, 0, _[0])
                    }
                }
                removeClass(e, "ui_gridsorter_moveable"), o._curOverCell = o._curPlaceholderEl = null, i && o.update(), s != e && !i && o.options.onReorder && o.options.onReorder(
                    e, l, domPS(e))
            }, 210), this._dist(t) > 5 && (cancelEvent(t), cur.cancelClick = !0)
        }
        this._updateScrollbar(), this._deinitEvents(), e && this._overEl && this.options.onDragLeave && this.options.onDragLeave(this._overEl, e), e && this._overEl && this.options
            .onDragDrop && (i = this.options.onDragDrop(this._overEl, e)), this._overEl = null, clearInterval(this._sti)
    }, GridSorter.prototype._deinitEvents = function(t) {
        t && removeEvent(this._contEl, "mousedown", this._ev_mousedown_handler), removeEvent(document, "mousemove", this._ev_mousemove_handler), removeEvent(document, "mouseup",
            this._ev_mouseup_handler)
    }, GridSorter.prototype._setPos = function(t, e) {
        !this.options.noPosTransform && this._grid.length > 100 && (this._hasTranslateFeauture || (this._hasTranslateFeauture = window.getComputedStyle(t)
            .getPropertyValue("transform"))) ? null === e.left || null === e.top ? setStyle(t, "transform", null) : setStyle(t, "transform", "translate(" + e.left + "px, " + e
            .top + "px)") : setStyle(t, e)
    }, GridSorter.prototype._recalc = function() {
        var t = this._curDragEl,
            e = this._curOverCell.el;
        if (this._initGrid(), e != t)
            for (var i, o, r = 0, s = !1, l = getSize(t), n = this._getItemMargins(), h = 0, a = this._grid.length; a > h; h++)
                if (i = this._grid[h], 2 != r)
                    if (i.el != t)
                        if (i.el == e && r++, 1 == r || 2 == r) {
                            var _ = s ? this._grid[h - 1] : this._grid[h + 1],
                                d = o ? o.size[0] - l[0] - n[0] : 0,
                                c = o ? o.size[1] - l[1] - n[1] : 0;
                            this._setPos(i.el, {
                                left: -(i.pos[0] - _.pos[0]) + d,
                                top: -(i.pos[1] - _.pos[1]) + c
                            }), o = i, i.dirty = !0, this._isShiftToLeft = s
                        } else i.dirty && (this._setPos(i.el, {
                            left: null,
                            top: null
                        }), i.dirty = !1);
        else s = !r, r++;
        else i.dirty && (this._setPos(i.el, {
            left: null,
            top: null
        }), i.dirty = !1);
        else
            for (var h = 0, a = this._grid.length; a > h; h++) {
                var i = this._grid[h];
                i.el != t && i.dirty && (i.dirty = !1, this._setPos(i.el, {
                    left: null,
                    top: null
                }))
            }
    }, GridSorter.prototype.disable = function() {
        this._disabled = !0
    }, GridSorter.prototype.enable = function() {
        this._disabled = !1, this._initGrid(!0)
    }, GridSorter.prototype.update = function() {
        this._disabled || this._initGrid(!0)
    }, GridSorter.prototype._ensureGridIsActual = function() {
        this._initGrid()
    }, GridSorter.prototype._needGridUpdate = function() {
        if (!this._grid) return 1;
        this._contInfo = this._contInfo || {}, this._contInfo.prevSize = this._contInfo.prevSize || getSize(this._contEl);
        var t = 0,
            e = this._contEl.children.length - this._excludedCount - intval(!!this._curPlaceholderEl);
        if (e != this._grid.length) t = e > this._grid.length ? 2 : 1, this._contInfo.prevSize = getSize(this._contEl);
        else {
            var i = getSize(this._contEl),
                o = this._contInfo.prevSize;
            (o[0] != i[0] || o[1] != i[1]) && (t = 3), this._contInfo.prevSize = i
        }
        return t
    }, GridSorter.prototype._initGrid = function(t) {
        var e = t ? 1 : this._needGridUpdate();
        if (e) {
            1 == e && (this._grid = [], this._contInfo && (delete this._contInfo.pos, delete this._contInfo.size));
            var i = this._grid ? this._grid[this._grid.length - 1] : null;
            this._grid = this._grid || [];
            var o, r = !!i,
                s = this._contEl.children;
            if (0 != s.length)
                for (var l = this._getItemMargins(), n = this._curDragEl ? this._grid.length : 0, h = n, a = s.length; a > h; h++) el = s[h], i && el == i.el ? r = !1 : r || el ==
                    this._curPlaceholderEl || el.getAttribute("nodrag") || (o = getSize(el), o[0] += l[0], o[1] += l[1], this._grid.push({
                        el: el,
                        size: o,
                        pos: this._calcElementPos(el)
                    }))
        }
    }, GridSorter.prototype._getRelativeMousePos = function(t) {
        var e = this._getContPos(),
            i = this._getContShift();
        return {
            left: t.clientX - e[0] - i[0],
            top: t.clientY - e[1] - i[1]
        }
    }, GridSorter.prototype._updateDraggablePosition = function(t) {
        if (this._curDragEl) {
            var e = this._getRelativeMousePos(t),
                i = this._getItemShift(),
                o = this._getContShift();
            this._setPos(this._curDragEl, {
                left: e.left - this._initial.shift.x - i[0] + o[0],
                top: e.top - this._initial.shift.y - i[1] + o[1]
            })
        }
    }, GridSorter.prototype._getContShift = function() {
        if (this._contInfo = this._contInfo || {}, !this._contInfo.shift) {
            var t = window.getComputedStyle(this._contEl);
            this._contInfo.shift = [parseFloat(t.paddingLeft), parseFloat(t.paddingTop)]
        }
        return this._contInfo.shift
    }, GridSorter.prototype._getContSize = function() {
        return this._contInfo = this._contInfo || {}, this._contInfo.size = getSize(this._contEl), this._contInfo.size
    }, GridSorter.prototype._getContPos = function() {
        return this._contInfo = this._contInfo || {}, this._contInfo.pos = getXY(this._contEl), this._contInfo.pos[1] -= scrollNode.scrollTop, this._contInfo.pos
    }, GridSorter.prototype._getItemShift = function() {
        if (this._contInfo = this._contInfo || {}, !this._contInfo.itemShift) {
            var t = window.getComputedStyle(domFC(this._contEl));
            this._contInfo.itemShift = [parseFloat(t.marginLeft), parseFloat(t.marginTop)]
        }
        return this._contInfo.itemShift
    }, GridSorter.prototype._getItemMargins = function() {
        if (this._contInfo = this._contInfo || {}, !this._contInfo.itemMargins) {
            var t = window.getComputedStyle(domFC(this._contEl));
            this._contInfo.itemMargins = [parseFloat(t.marginLeft) + parseFloat(t.marginRight), parseFloat(t.marginTop) + parseFloat(t.marginBottom)]
        }
        return this._contInfo.itemMargins
    }, GridSorter.prototype._calcElementPos = function(t) {
        var e = this._getContShift(),
            i = this._getItemShift();
        return [t.offsetLeft - e[0] - i[0], t.offsetTop - e[1] - i[1]]
    }, GridSorter.prototype._updateScrollbar = throttle(function() {
        var t = this.options.wrapNode || scrollNode,
            e = data(t, "sb");
        e && e.update(!1, !0)
    }, 500), GridSorter.prototype._getWrapNodeHeight = function() {
        var t = this.options.wrapNode || scrollNode;
        return this._wrapNodeHeight = this._wrapNodeHeight || getSize(t)[1]
    }, GridSorter.prototype._onMouseMove = function(t) {
        function e() {
            return i.options.wrapNode ? i.options.wrapNode.scrollTop : scrollGetY()
        }
        var i = this;
        if (this._curDragEl) {
            this._ensureGridIsActual();
            var o = !t,
                r = e();
            o && (t = {
                clientX: this._lastMousePos.x,
                clientY: this._lastMousePos.y
            }), this._lastMousePos = {
                x: t.clientX,
                y: t.clientY
            }, this._updateDraggablePosition(t);
            var s = (this._getContShift(), this._getContSize()),
                l = (this._getContPos(), this._getRelativeMousePos(t)),
                n = !1,
                h = l.left > 0 && l.left < s[0] && l.top > 0 && l.top < s[1];
            if (h)
                for (var a, _ = 0, d = this._grid.length - 1, c = 50; c;) {
                    var p = _ + Math.floor((d - _) / 2);
                    if (a = this._grid[p], l.left > a.pos[0] && l.top > a.pos[1] && l.left < a.pos[0] + a.size[0] && l.top < a.pos[1] + a.size[1]) {
                        n = a;
                        break
                    }
                    if (_ == d) break;
                    l.top < a.pos[1] || l.left < a.pos[0] && l.top < a.pos[1] + a.size[1] ? d = d == p ? d - 1 : p : _ = _ == p ? _ + 1 : p, c--
                } else {
                    for (var g, u, f, v, S = 999999, E = 0, m = this._grid.length; m > E; E++) {
                        var a = this._grid[E];
                        f = l.left - (a.pos[0] + a.size[0] / 2), v = l.top - (a.pos[1] + a.size[1] / 2), u = f * f + v * v, S > u && (S = u, g = a)
                    }
                    n = g
                }!n || this._curOverCell && this._curOverCell.el == n.el || (this._curOverCell = n, this._recalc());
            var y = !1;
            !n == this._grid[this._grid.length - 1] && (y = !0);
            var s = (this._getContPos(), this._getContSize()),
                C = !0,
                I = this.options.wrapNode ? getSize(this.options.wrapNode)[1] : window.innerHeight || docEl.clientHeight || bodyNode.clientHeight,
                D = s[1] - I - r + GridSorter.AUTO_SCROLL_GAP > 0,
                G = 0;
            if (G = this.options.wrapNode ? t.clientY - getXY(this.options.wrapNode)[1] : t.clientY, (this._autoscrollSpeed > 0 && !D || this._autoscrollSpeed < 0 && !C) &&
                clearInterval(this._sti), !o) {
                var P = I / 6,
                    w = 0;
                (C || D) && (C && P > G ? w = -(P - G) / P : D && G > I - P && (w = +(G - I + P) / P));
                var z = Math.abs(w),
                    M = Math.abs(this._prevAutoscrollSpeed);
                M > z || z == M && !this._autoscrollSpeed ? (this._prevAutoscrollSpeed = w, w = 0) : this._prevAutoscrollSpeed = w, this._autoscrollSpeed = w, this._sti && (
                    clearInterval(this._sti), this._sti = !1), this._autoscrollSpeed && (this._sti = setInterval(function() {
                    var t = i.options.wrapNode || scrollNode,
                        o = t.scrollTop,
                        r = Math.ceil(i._autoscrollSpeed * GridSorter.AUTO_SCROLL_DY);
                    t.scrollTop = e() + r, o != t.scrollTop && (i._updateScrollbar(), i._onMouseMove())
                }, 1))
            }
            if (this.options.onDragOverElClass) {
                var b = t.target;
                hasClass(b, this.options.onDragOverElClass) || (b = gpeByClass(this.options.onDragOverElClass, b)) ? this._overEl != b && (this._overEl && this.options.onDragLeave &&
                    this.options.onDragLeave(this._overEl, this._curDragEl), this.options.onDragEnter && this.options.onDragEnter(b, this._curDragEl), this._overEl = b) : (
                    this._overEl && this.options.onDragLeave && this.options.onDragLeave(this._overEl, this._curDragEl), this._overEl = null)
            }
        } else if (this._dist(t) > this.options.dragThreshold) {
            this._curDragEl = this._initial.candidateEl;
            var T = getSize(this._curDragEl),
                O = (getXY(this._curDragEl), window.getComputedStyle(this._curDragEl));
            this._initial.hasInlineSize = !(!this._curDragEl.style.width && !this._curDragEl.style.height), setStyle(this._curDragEl, {
                width: T[0],
                height: T[1]
            }), this._curPlaceholderEl = ce("div", {
                className: "ui_gridsorter_placeholder"
            }), setStyle(this._curPlaceholderEl, {
                width: T[0] + parseFloat(O.marginLeft) + parseFloat(O.marginRight),
                height: T[1] + parseFloat(O.marginTop) + parseFloat(O.marginBottom)
            }), this._contEl.insertBefore(this._curPlaceholderEl, this._curDragEl), addClass(this._curDragEl, "ui_gridsorter_moveable"), addClass(this._curDragEl,
                "ui_gridsorter_moveable_notrans"), addClass(this._contEl, "ui_gridsorter_cont"), this._onMouseMove(t), this._updateDraggablePosition(t)
        }
        cancelEvent(t)
    };
try {
    jsDispatcher.triggerOnload("lib/grid_sorter")
} catch (e) {}
try {
    stManager.done("grid_sorter.js")
} catch (e) {}
