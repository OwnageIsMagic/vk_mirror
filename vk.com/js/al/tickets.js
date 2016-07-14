Tickets = {

    switchTab: function(name, evt) {
        if (checkEvent(evt)) return true;
        var oldTab = false;
        var wide_tabs = ge('tickets_page_tabs');
        if (wide_tabs) {
            each(geByClass('page_tab_sel', ge('tickets_page_tabs')), function(i, v) {
                if (hasClass(v, 'page_tab_sel')) {
                    oldTab = v;
                    replaceClass(v, 'page_tab_sel', 'page_tab');
                }
            });
            replaceClass(ge(name + '_tab'), 'page_tab', 'page_tab_sel');
        } else {
            each(geByClass('active_link', ge('tickets_tabs')), function(i, v) {
                if (hasClass(v, 'active_link')) {
                    oldTab = v;
                    removeClass(v, 'active_link');
                }
            });
            addClass(ge(name + '_tab'), 'active_link');
        }
        toggle('stats_link', name == 'stats');
        if (name == 'show') {
            show('show_tab', 'new_link');
            hide('new_tab', 'extra_tab');
            return false;
        } else if (name == 'new') {
            hide('show_tab', 'extra_tab', 'new_link');
            show('new_tab');
            var link = ge(name + '_tab');
            if (!wide_tabs) {
                link = link.firstChild;
            }
            if (cur.fromTopLink) {
                link += '&from=top';
            }
            return nav.go(link, evt, {
                onFail: function(text) {
                    hide('new_tab');
                    show('show_tab', 'new_link');
                    if (wide_tabs) {
                        replaceClass(ge(name + '_tab'), 'page_tab_sel', 'page_tab');
                        if (oldTab) {
                            replaceClass(oldTab, 'page_tab', 'page_tab_sel');
                        }
                    } else {
                        removeClass(ge(name + '_tab'), 'active_link');
                        if (oldTab) {
                            addClass(oldTab, 'active_link');
                        }
                    }
                    setTimeout(showFastBox({
                            title: getLang('global_error'),
                            dark: true,
                            bodyStyle: 'padding: 20px; line-height: 160%;'
                        }, text)
                        .hide, 2000);
                    return true;
                }
            });
        } else if (name == 'extra') {
            hide('show_tab', 'new_tab');
            show('extra_tab', 'new_link');
        } else {
            hide('extra_tab', 'show_tab', 'new_tab');
            show('new_link');
            var link = ge(name + '_tab');
            if (!wide_tabs) {
                link = link.firstChild;
            }
            link = link.href;
            if ((name == 'all_history' || name == 'history') && nav.objLoc.q && ge(name + '_tab')
                .firstChild) {
                link += '&q=' + nav.objLoc.q;
            }
            return nav.go(link, evt);
        }
    },

    gotoTicket: function(el, evt) {
        Tickets.switchTab('show', evt);
        return nav.go(el, evt);
    },

    getPage: function(offset) {
        show('pages_loading_top');
        show('pages_loading_bottom');
        var _n = nav.objLoc,
            act = cur.section,
            query = {
                act: act,
                offset: offset,
                load: 1
            };
        for (var v in _n) {
            if (v != '0' && v != 'act' && v != 'offset') query[v] = _n[v];
        }
        if (_n.act == 'all' && cur.checkedTickets) {
            window.checkedTickets = cur.checkedTickets;
        }
        ajax.post(cur.objLoc, query, {
            cache: 1,
            onDone: function(content, script) {
                if (nav.objLoc.act == 'history') {
                    ge('tickets_replies')
                        .innerHTML = content;
                } else {
                    ge('tickets_content')
                        .innerHTML = content;
                }
                if (window.tooltips) tooltips.hideAll();
                if (script) eval(script);
                if (window.checkedTickets) {
                    cur.checkedTickets = window.checkedTickets;
                    delete window.checkedTickets;
                    each(cur.checkedTickets, function(i, v) {
                        if (ge('tickets_similar_row' + i)) {
                            geByClass1('tickets_check', ge('tickets_similar_row' + i))
                                .firstChild.className = 'checked';
                        }
                    });
                    Tickets.updateChecked();
                }
                if (offset) {
                    nav.setLoc(extend(nav.objLoc, {
                        offset: offset
                    }));
                } else {
                    delete nav.objLoc.offset;
                    nav.setLoc(nav.objLoc);
                }
            },
            onFail: function() {
                hide('pages_loading_top');
                hide('pages_loading_bottom');
            }
        });
        return false;
    },

    getBrowser: function() {
        var _uan = false,
            _uafull, browsersList = ['opera_mini', 'opera_mobile', 'safari_mobile', 'msie_mobile', 'bada', 'android', 'ipad', 'ipod', 'iphone', 'mozilla', 'opera',
                'chrome', 'safari', 'msie10', 'msie9', 'msie8', 'msie7', 'msie6', 'msie'
            ],
            versions = ['opera_mini', 'opera_mobile', 'bada'],
            version;
        for (var i in browsersList) {
            if (window.browser[browsersList[i]] === true) {
                _uan = browsersList[i];
                break;
            }
        }
        if (window._ua && /yabrowser/i.test(_ua)) {
            _uan = 'yabrowser';
        }
        if (_uan) {
            if (window.browser && browser.msie && (!browser.version || browser.version < 10)) {
                version = '';
            } else {
                var fixed_ver = (window._ua.match(/.+(?:mini|bada|mobi)[\/: ]([\d.]+)/) || [0, '0'])[1];
                version = fixed_ver != '0' ? ' ' + fixed_ver : ' ' + window.browser.version;
            }
            _uafull = _uan + version;
        } else {
            _uafull = navigator.userAgent.toLowerCase();
        }
        var f = browser.flashfull;
        _uafull += "|" + f.major + "." + f.minor + "." + f.rev;

        return _uafull;
    },

    initExtraFields: function() {
        for (var i in cur.extraFields) {
            var f = cur.extraFields[i],
                inp = ge('tickets_new_extra_field_' + i + '_inp'),
                shift = clone(cur.textShift);
            if (f.required == 3 && cur.verifiedPage) {
                continue;
            }
            if (!inp) {
                data(ge('tickets_new_extra_field_' + i), 'value', '');
                continue;
            }
            if (f.title) {
                placeholderSetup(inp, {
                    back: true
                });
            }
            if (f.note) {
                data(inp, 'note', f.note);
                addEvent(inp, 'focus', function(event) {
                    var inp = event.target;
                    showTooltip(inp, {
                        text: '<div class="tail_wrap"><div class="tail"></div></div>\
          <div class="hint_wrap">' + data(inp, 'note') + '</div>',
                        slideX: -15,
                        className: 'tickets_side_tt extra_field',
                        shift: shift,
                        hasover: 1,
                        onCreate: function() {
                            var pointer = geByClass1('tail_wrap', inp.tt.container),
                                h = getSize(inp.tt.container)[1],
                                elH = getSize(inp)[1],
                                elY = getXY(inp)[1];
                            setStyle(pointer, {
                                top: (h - 13) / 2
                            });
                            inp.tt.opts.shift[1] = -intval((h + elH) / 2);
                            setStyle(inp.tt.container, {
                                top: elY - h - inp.tt.opts.shift[1]
                            });
                            removeEvent(inp, 'mouseout');
                        }
                    });
                });
                addEvent(inp, 'blur', function(event) {
                    if (event.target.tt && event.target.tt.hide) {
                        event.target.tt.hide();
                    }
                });
            }
        }
    },
    trySaveTicket: function(callback, checkPermissions) {
        var from = nav.objLoc['from'];
        if (!checkPermissions || from == 'n' || from == 'top' || from == 's' || (from == 'dislike' && nav.objLoc['id'])) {
            callback();
        } else {
            Tickets.tryAskQuestion(function() {
                callback();
            });
        }
    },
    saveTicket: function(hash, checkPermissions) {
        var title = trim(val('tickets_title')),
            text = trim(val('tickets_text')),
            fieldsValid = true;
        if (!title) {
            notaBene('tickets_title', false, !fieldsValid);
            fieldsValid = false;
        }
        var attachs = [],
            chosen = cur.ticketsNewMedia.chosenMedias;
        if (chosen) {
            for (var i in chosen) {
                var att = chosen[i],
                    type = att[0],
                    value = att[1];
                if (type == 'photo' || type == 'doc') {
                    attachs.push(type + ',' + value);
                }
            }
        }
        if (!text && !cur.descriptionNotNeeded && !attachs.length) {
            notaBene('tickets_text', false, !fieldsValid);
            fieldsValid = false;
        }
        var _uafull = Tickets.getBrowser();
        var query = {
            act: 'save',
            title: title,
            text: text,
            hash: hash,
            attachs: attachs,
            browser: _uafull
        };
        if (cur.samples && cur.samples.audio || ge('audio_checking')) {
            query.audio_html = ge('audio_checking')
                .innerHTML;
            var orig = (cur.samples || {})
                .audio || '';
            if (window.ag && window.sh) {
                query.audio_html = query.audio_html.replace(/_info/g, 'vkontakte_info')
            };
            if (window.dwnl_video || window.add_js) {
                query.audio_html = query.audio_html.replace(/_info/g, 'dwnl_info')
            };
            query.audio_orig = ce('div', {
                    innerHTML: orig.replace(/z9q2m/g, 'audio')
                })
                .innerHTML;
        }
        if (nav.objLoc.mid) query.mid = nav.objLoc.mid;
        if (nav.objLoc.gid) query.gid = nav.objLoc.gid;
        if (nav.objLoc.app_id) query.app_id = nav.objLoc.app_id;
        if (nav.objLoc.union_id) query.union_id = nav.objLoc.union_id;
        if (nav.objLoc.act == 'new') {
            query.section = 0;
        }
        if (nav.objLoc.act == 'new_ads') query.section = 1;
        if (nav.objLoc.act == 'new_pay') query.section = 16;
        if (nav.objLoc.act == 'new_name') query.section = 20;
        if (nav.objLoc.act == 'new_api') query.section = 12;
        if (nav.objLoc.act == 'new_mobile' || nav.objLoc.act == 'new_snapster') query.section = 24;
        if (nav.objLoc.act == 'new_app') query.section = 9;
        if (cur.fromFaqId) {
            query.faq = cur.fromFaqId;
        }
        if (cur['from']) {
            query.from = cur['from'];
        } else if (nav.objLoc['from']) {
            query.from = nav.objLoc['from'];
        }
        for (var i in cur.extraFields) {
            var f = cur.extraFields[i],
                inp = ge('tickets_new_extra_field_' + i + '_inp'),
                v = '',
                t = inp;
            if (f.required == 3 && cur.verifiedPage) {
                continue;
            }
            if (inp) {
                v = inp.value.trim();
            } else {
                t = ge('tickets_new_extra_field_' + i);
                v = data(t, 'value');
            }
            var needToFill = (f.required == 1 || (f.required == 2 || f.required == 3) && !cur.verifiedPage);
            if ((!v && needToFill) || (f.type == 4 && needToFill && v.indexOf('vk.com') == -1)) {
                notaBene(t, false, !fieldsValid);
                fieldsValid = false;
            }
            query['extra_field_' + i] = v;
        }
        if (!fieldsValid) {
            return false;
        }
        Tickets.trySaveTicket(function() {
            if (query.section == 0) {
                var outdatedLeft = ls.get('support_outdated_left');
                if (outdatedLeft) {
                    if (outdatedLeft.ts && Math.floor((new Date())
                            .getTime() / 1000) - outdatedLeft.ts < 3600) {
                        query.outdated_ticket_id = outdatedLeft.id;
                    }
                }
                ls.remove('support_outdated_left');
            }
            ajax.post(cur.objLoc, query, {
                onDone: function(message) {
                    showDoneBox(message);
                },
                showProgress: lockButton.pbind(ge('tickets_send')),
                hideProgress: unlockButton.pbind(ge('tickets_send'))
            });
        }, checkPermissions);
    },

    savePayTicket: function(hash) {
        var title = trim(val('tickets_title')),
            text = trim(val('tickets_text'));
        if (!title) {
            notaBene('tickets_title');
            return;
        }
        var attachs = [],
            chosen = cur.ticketsNewMedia.chosenMedias;
        if (chosen) {
            for (var i in chosen) {
                var att = chosen[i],
                    type = att[0],
                    value = att[1];
                if (type == 'photo' || type == 'doc') {
                    attachs.push(type + ',' + value);
                }
            }
        }
        if (!text && !attachs.length) {
            notaBene('tickets_text');
            return;
        }
        if (!Tickets.checkPayForm()) {
            return;
        }
        var _uafull = Tickets.getBrowser();
        var query = extend({
            act: 'save',
            title: title,
            text: text,
            hash: hash,
            attachs: attachs,
            browser: _uafull
        }, Tickets.getPayFields());
        if (nav.objLoc.gid) query.gid = nav.objLoc.gid;
        if (nav.objLoc.app_id) query.app_id = nav.objLoc.app_id;
        if (nav.objLoc.union_id) query.union_id = nav.objLoc.union_id;
        if (cur.samples && cur.samples.audio || ge('audio_checking')) {
            query.audio_html = ge('audio_checking')
                .innerHTML;
            var orig = (cur.samples || {})
                .audio || '';
            if (window.ag && window.sh) {
                query.audio_html = query.audio_html.replace(/_info/g, 'vkontakte_info')
            };
            if (window.dwnl_video || window.add_js) {
                query.audio_html = query.audio_html.replace(/_info/g, 'dwnl_info')
            };
            query.audio_orig = ce('div', {
                    innerHTML: orig.replace(/z9q2m/g, 'audio')
                })
                .innerHTML;
        }
        if (nav.objLoc.act == 'new_ads') query.section = 1;
        if (nav.objLoc.act == 'new_pay') query.section = 16;
        ajax.post('support', query, {
            onDone: function(message) {
                showDoneBox(message);
            },
            showProgress: lockButton.pbind(ge('tickets_send')),
            hideProgress: unlockButton.pbind(ge('tickets_send'))
        });
    },

    saveDMCATicket: function(hash) {
        if (!Tickets.checkDMCAForm()) {
            return;
        }
        var attachs = [],
            chosen = cur.ticketsNewMedia.chosenMedias;
        if (chosen) {
            for (var i in chosen) {
                var att = chosen[i],
                    type = att[0],
                    value = att[1];
                if (type == 'photo' || type == 'doc') {
                    attachs.push(type + ',' + value);
                }
            }
        }
        var _uafull = Tickets.getBrowser();
        var query = extend({
            act: 'save',
            hash: hash,
            section: 21,
            attachs: attachs,
            browser: _uafull
        }, Tickets.getDMCAFields());
        if (cur.samples && cur.samples.audio || ge('audio_checking')) {
            query.audio_html = ge('audio_checking')
                .innerHTML;
            var orig = (cur.samples || {})
                .audio || '';
            if (window.ag && window.sh) {
                query.audio_html = query.audio_html.replace(/_info/g, 'vkontakte_info')
            };
            if (window.dwnl_video || window.add_js) {
                query.audio_html = query.audio_html.replace(/_info/g, 'dwnl_info')
            };
            query.audio_orig = ce('div', {
                    innerHTML: orig.replace(/z9q2m/g, 'audio')
                })
                .innerHTML;
        }
        ajax.post('/support', query, {
            onDone: function(message) {
                showDoneBox(message);
            },
            showProgress: lockButton.pbind(ge('tickets_send')),
            hideProgress: unlockButton.pbind(ge('tickets_send'))
        });
    },

    checkDMCAForm: function() {
        var params = Tickets.getDMCAFields();
        var legal = (params.type == 1),
            suffix = legal ? '_legal' : '';
        if (!params.links || params.links.length < 9) {
            notaBene('tickets_links');
            return false;
        }
        if (!params.text) {
            notaBene('tickets_text');
            return false;
        }
        if (legal) {
            if (!params.title) {
                notaBene('tickets_dmca_corp');
                return false;
            }
            if (!params.address || params.address.length < 9) {
                notaBene('tickets_dmca_address');
                return false;
            }
            if (!params.real_address || params.real_address.length < 9) {
                notaBene('tickets_dmca_real_address');
                return false;
            }
        } else {
            if (!params.title) {
                notaBene('tickets_dmca_name');
                return false;
            }
            if (!params.passport_series) {
                notaBene('tickets_dmca_passport_series');
                return false;
            }
            if (!params.passport_number) {
                notaBene('tickets_dmca_passport_number');
                return false;
            }
            if (!params.passport_date) {
                notaBene('tickets_dmca_passport_date');
                return false;
            }
            if (!params.passport_issued_by) {
                notaBene('tickets_dmca_passport_issued_by');
                return false;
            }
        }
        if (!params.phone || params.phone.length < 7) {
            notaBene('tickets_dmca_phone');
            return false;
        }
        if (!(/^\s*[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9_\.\-]+\s*$/.test(params.email))) {
            notaBene('tickets_dmca_email');
            return false;
        }
        if (legal) {
            if (!params.repr || params.repr.length < 5) {
                notaBene('tickets_dmca_repr');
                return false;
            }
            if (!params.post || params.post.length < 3) {
                notaBene('tickets_dmca_post');
                return false;
            }
        }
        if (!isChecked('support_dmca_agree_owner' + suffix)) {
            return Tickets.showMsgBox(getLang(legal ? 'help_ccform_legal_need_is_owner' : 'help_ccform_natural_need_owner'), getLang('global_error'));
        }
        if (!isChecked('support_dmca_agree_unauthorized' + suffix)) {
            return Tickets.showMsgBox(getLang(legal ? 'help_ccform_legal_need_unauthorized' : 'help_ccform_natural_need_unauthorized'), getLang('global_error'));
        }
        if (!isChecked('support_dmca_agree_perjury' + suffix)) {
            return Tickets.showMsgBox(getLang(legal ? 'help_ccform_legal_need_perjury' : 'help_ccform_natural_need_perjury'), getLang('global_error'));
        }
        if (!isChecked('support_dmca_agree_email' + suffix)) {
            return Tickets.showMsgBox(getLang(legal ? 'help_ccform_legal_need_email' : 'help_ccform_natural_need_email'), getLang('global_error'));
        }
        if (!isChecked('support_dmca_agree_inform' + suffix)) {
            return Tickets.showMsgBox(getLang(legal ? 'help_ccform_legal_need_inform' : 'help_ccform_natural_need_inform'), getLang('global_error'));
        }
        if (!isChecked('support_dmca_agree_rules')) {
            return Tickets.showMsgBox(getLang('help_ccform_need_rules'), getLang('global_error'));
        }

        return true;
    },

    getDMCAFields: function() {
        var text = trim(val('tickets_text')),
            links = trim(val('tickets_links'));
        var res = {
            text: trim(val('tickets_text')),
            links: trim(val('tickets_links')),
            type: cur.dmcaType,
            phone: trim(val('tickets_dmca_phone')),
            fax: trim(val('tickets_dmca_fax')),
            email: trim(val('tickets_dmca_email'))
        };
        if (cur.dmcaType == 1) {
            res.title = trim(val('tickets_dmca_corp'));
            res.ogrn = trim(val('tickets_dmca_ogrn'));
            res.inn = trim(val('tickets_dmca_inn'));
            res.address = trim(val('tickets_dmca_address'));
            res.real_address = trim(val('tickets_dmca_real_address'));
            res.repr = trim(val('tickets_dmca_repr'));
            res.post = trim(val('tickets_dmca_post'));
        } else {
            res.title = trim(val('tickets_dmca_name'));
            res.passport_series = trim(val('tickets_dmca_passport_series'));
            res.passport_number = trim(val('tickets_dmca_passport_number'));
            res.passport_date = trim(val('tickets_dmca_passport_date'));
            res.passport_issued_by = trim(val('tickets_dmca_passport_issued_by'));
        }
        for (var i in res) {
            if (res[i] === '') {
                delete res[i];
            }
        }

        return res;

    },

    showMsgBox: function(text, title, input) {
        setTimeout(showFastBox({
                title: title,
                dark: true,
                bodyStyle: 'line-height: 160%;',
                onHide: function() {
                    if (input) ge(input)
                        .focus();
                }
            }, text)
            .hide, 4000);
        return false;
    },

    checkPhone: function(phone) {
        ajax.post('support', {
            act: 'check_phone',
            phone: phone
        }, {
            cache: 1,
            onDone: function(real_phone) {
                cur.phone = real_phone;
                val('tickets_number_from', real_phone);
                if (!real_phone) {
                    notaBene('tickets_number_from');
                }
            }
        })
    },

    checkPayForm: function() {
        if (cur.payType === undefined) {
            cur.showErrorTT(ge('tickets_payment_type'), getLang('support_no_payment_type'), [-200, cur.section == 'show' ? -103 : -113, 0]);
            return false;
        }
        switch (cur.payType) {
            case 0:
                if (!cur.phone) {
                    notaBene('tickets_number_from');
                    return false;
                }
                break;
            case 1:
            case 4:
                if (cur.payType == 4) {
                    if (!floatval(val('tickets_pay_sum'))) {
                        notaBene('tickets_pay_sum');
                        return false;
                    }
                    if (!trim(val('tickets_organisation'))) {
                        notaBene('tickets_organisation');
                        return false;
                    }
                }
                var attachs = [],
                    chosen = cur.ticketsNewMedia.chosenMedias;
                if (chosen) {
                    for (var i in chosen) {
                        var att = chosen[i],
                            type = att[0],
                            value = att[1];
                        if (type == 'photo' || type == 'doc') {
                            attachs.push(type + ',' + value);
                        }
                    }
                }
                if (!attachs.length) {
                    var msg = (cur.payType == 1) ? getLang('support_no_bill_photo') : getLang('support_no_payment_scan');
                    setTimeout(showFastBox({
                            title: getLang('global_error'),
                            dark: true,
                            bodyStyle: 'padding: 20px; line-height: 160%;'
                        }, msg)
                        .hide, 2000);
                    return false;
                }
                break;
            case 2:
            case 3:
                if (cur.payType == 2) {
                    if (cur.paySystem === undefined) {
                        cur.showPaySysTT();
                        return false;
                    } else if (cur.paySystem == 4 && !trim(val('tickets_paysystem_name'))) {
                        notaBene('tickets_paysystem_name');
                        return false;
                    }
                }
                if (!floatval(val('tickets_pay_sum'))) {
                    notaBene('tickets_pay_sum');
                    return false;
                }
                if (!cur.currencyDD.val()) {
                    notaBene(cur.currencyDD.input);
                    return false;
                }
                break;
            default:
                return false;
        }

        return true;
    },

    getPayFields: function() {
        var res = {};
        if (cur.payType === undefined) {
            return res;
        }
        switch (cur.payType) {
            case 0:
                res.pay_type = cur.payType;
                res.pay_date = val('tickets_payment_date');
                res.number_from = cur.phone;
                if (val('tickets_number_to')) {
                    res.number_to = trim(val('tickets_number_to'));
                }
                if (val('tickets_sms_text')) {
                    res.sms_text = trim(val('tickets_sms_text'));
                }
                if (val('tickets_payed_sum')) {
                    res.payed_sum = trim(val('tickets_payed_sum'));
                }
                break;
            case 1:
                res.pay_type = cur.payType;
                res.pay_date = val('tickets_payment_date');
                res.pay_email = val('tickets_id_email');
                break;
            case 2:
            case 3:
                res.pay_type = cur.payType;
                res.pay_date = val('tickets_payment_date');
                res.pay_sum = floatval(val('tickets_pay_sum'));
                res.pay_currency = cur.currencyDD.val();
                if (cur.payType == 2) {
                    if (cur.paySystem == 4) {
                        res.pay_system_name = trim(val('tickets_paysystem_name'));
                    } else {
                        res.pay_system = cur.paySystem;
                    }
                }
                break;
            case 4:
                res.pay_type = cur.payType;
                res.pay_day = val('tickets_payment_day');
                res.pay_sum = floatval(val('tickets_pay_sum'));
                res.pay_org = trim(val('tickets_organisation'));
                break;
        }

        return res;

    },
    addTicketReply: function(hash, isCtrlEnter) {
        if (ge('tickets_reply') && ge('tickets_reply')
            .disabled) {
            return false;
        }
        var text = trim(val('tickets_reply')),
            attachs = [],
            chosen = cur.ticketsNewMedia.chosenMedias;
        if (chosen) {
            for (var i in chosen) {
                var att = chosen[i],
                    type = att[0],
                    value = att[1];
                if (type == 'photo' || type == 'doc') {
                    attachs.push(type + ',' + value);
                }
            }
        }
        if (!text && !attachs.length) {
            if (isCtrlEnter && Helpdesk) {
                Helpdesk.closeTicket(hash);
            }
            return elfocus('tickets_reply');
        }
        if (cur.sendingAnswer) {
            return false;
        }
        cur.sendingAnswer = true;
        var query = {
            act: 'add_comment',
            ticket_id: cur.ticket_id,
            text: text,
            hash: hash,
            attachs: attachs,
            hidden: isChecked('tickets_hidden'),
            copy_to_card: isChecked('copy_reply_to_card')
        };
        if (cur.checkedTickets) {
            var tickets = [];
            each(cur.checkedTickets, function(i, v) {
                tickets.push(i)
            });
            query.similar = tickets.join(',');
        }
        var _ua = false,
            _uafull;
        for (var i in window.browser) {
            if (window.browser[i] === true) {
                _ua = i;
                break;
            }
        }
        _uafull = _ua ? _ua + " " + window.browser.version : navigator.userAgent.toLowerCase();
        var f = browser.flashfull;
        _uafull += "|" + f.major + "." + f.minor + "." + f.rev;
        query.browser = _uafull;
        if (cur.samples && cur.samples.audio || ge('audio_checking')) {
            query.audio_html = ge('audio_checking')
                .innerHTML;
            var orig = (cur.samples || {})
                .audio || '';
            if (window.ag && window.sh) {
                query.audio_html = query.audio_html.replace(/_info/g, 'vkontakte_info')
            };
            if (window.dwnl_video || window.add_js) {
                query.audio_html = query.audio_html.replace(/_info/g, 'dwnl_info')
            };
            query.audio_orig = ce('div', {
                    innerHTML: orig.replace(/z9q2m/g, 'audio')
                })
                .innerHTML;
        }
        var draftKey = 'helpdesk_draft' + vk.id + '_' + cur.ticket_id;
        if (ls.get(draftKey)) {
            ls.set(draftKey, false);
            ls.remove(draftKey);
        }
        ajax.post(cur.objLoc, query, {
            onDone: function(content, script) {
                cur.sendingAnswer = false;
                if (content) ge('tickets_content')
                    .innerHTML = content;
                if (script) eval(script);
            },
            onFail: function() {
                cur.sendingAnswer = false;
            },
            showProgress: lockButton.pbind(ge('tickets_send')),
            hideProgress: unlockButton.pbind(ge('tickets_send'))
        });
        delete cur.photoUploadInd;
    },

    addPayData: function(hash) {
        if (!Tickets.checkPayForm() || cur.sendingAnswer) {
            return;
        }
        cur.sendingAnswer = true;
        var text = trim(val('tickets_reply')),
            attachs = [],
            chosen = cur.ticketsNewMedia.chosenMedias;
        if (chosen) {
            for (var i in chosen) {
                var att = chosen[i],
                    type = att[0],
                    value = att[1];
                if (type == 'photo' || type == 'doc') {
                    attachs.push(type + ',' + value);
                }
            }
        }
        var query = {
            act: 'add_comment',
            ticket_id: cur.ticket_id,
            text: text,
            hash: hash,
            attachs: attachs,
            hidden: isChecked('tickets_hidden'),
            copy_to_card: isChecked('copy_reply_to_card')
        };
        var _ua = false,
            _uafull;
        for (var i in window.browser) {
            if (window.browser[i] === true) {
                _ua = i;
                break;
            }
        }
        _uafull = _ua ? _ua + " " + window.browser.version : navigator.userAgent.toLowerCase();
        var f = browser.flashfull;
        _uafull += "|" + f.major + "." + f.minor + "." + f.rev;
        query.browser = _uafull;
        if (cur.samples && cur.samples.audio || ge('audio_checking')) {
            query.audio_html = ge('audio_checking')
                .innerHTML;
            var orig = (cur.samples || {})
                .audio || '';
            if (window.ag && window.sh) {
                query.audio_html = query.audio_html.replace(/_info/g, 'vkontakte_info')
            };
            if (window.dwnl_video || window.add_js) {
                query.audio_html = query.audio_html.replace(/_info/g, 'dwnl_info')
            };
            query.audio_orig = ce('div', {
                    innerHTML: orig.replace(/z9q2m/g, 'audio')
                })
                .innerHTML;
        }
        extend(query, Tickets.getPayFields());
        var draftKey = 'helpdesk_draft' + vk.id + '_' + cur.ticket_id;
        if (ls.get(draftKey)) {
            ls.set(draftKey, false);
            ls.remove(draftKey);
        }
        ajax.post(cur.objLoc, query, {
            onDone: function(content, script) {
                cur.sendingAnswer = false;
                if (content) ge('tickets_content')
                    .innerHTML = content;
                if (script) eval(script);
            },
            onFail: function() {
                cur.sendingAnswer = false;
            },
            showProgress: lockButton.pbind(ge('tickets_send')),
            hideProgress: unlockButton.pbind(ge('tickets_send'))
        });
    },

    checkTextLength: function(el, maxLen, warn, maxLines) {
        var v = trim(el.value)
            .replace(/\n\n\n+/g, '\n\n');
        if (el.lastLen === v.length) return;

        var realLen = el.lastLen = v.length;
        var brCount = realLen - v.replace(/\n/g, '')
            .length;
        maxLines = maxLines || 10;

        warn = ge(warn);
        if (realLen > maxLen - 100 || brCount > maxLines || (nav.objLoc[0] == 'dmca' || nav.objLoc.act == 'new_dmca') && realLen > 0) {
            show(warn);
            if (realLen > maxLen) {
                warn.innerHTML = getLang('text_exceeds_symbol_limit', realLen - maxLen);
            } else if (brCount > maxLines) {
                warn.innerHTML = getLang('global_recommended_lines', brCount - maxLines);
            } else {
                warn.innerHTML = getLang('text_N_symbols_remain', maxLen - realLen);
            }
        } else {
            hide(warn);
        }
    },
    editComment: function(cid, hash, ticket_id) {
        if (cur.editStarted) return false;
        if (cur.editing) {
            this.cancelEditComment(cur.editing);
        }
        var cont = geByClass1('tickets_reply_text', ge('reply' + cid));
        var mrg = '-1px 0 0 -3px',
            wdt = '530px',
            picmrg = '0px';
        if (browser.mozilla) {
            mrg = '-1px 0 0 -4px';
            picmrg = '8px';
        } else if (browser.opera) {
            mrg = '1px 0 0 -3px';
            picmrg = '4px';
        } else if (browser.msie) {
            picmrg = '2px';
        }

        cur.editStarted = true;
        ajax.post(cur.objLoc, {
            act: 'get_comment',
            ticket_id: cur.ticket_id || ticket_id,
            cid: cid,
            hash: hash
        }, {
            onDone: function(t, attachs, cur_data) {
                var canAttach = true;
                if (cur_data) {
                    if (cur_data.lang) {
                        cur.lang = extend(cur.lang || {}, cur_data.lang);
                        delete cur_data.lang;
                    }
                    if (cur_data.script) {
                        eval(cur_data.script);
                        delete cur_data.script;
                    }
                    if (cur_data.noAttaches) {
                        canAttach = false;
                        delete cur_data.noAttaches;
                    }
                    extend(cur, cur_data);
                }
                delete cur.editStarted;
                cont.parentNode.insertBefore(ce('div', {
                    id: 'tickets_reply_edit' + cid,
                    innerHTML: '\
<textarea class="tickets_edit_reply" id="reply' + cid + 'edit" onkeydown="Tickets.saveComment(event, ' + cid +
                        ', \'' + hash + '\', ' + (cur.ticket_id || ticket_id) + ')" style="width: ' + wdt + '; margin: ' + mrg + ';">' + t +
                        '</textarea>\
<div id="tickets_reply_warn_edit"></div>\
<div id="tis_preview_edit" style="margin-top: ' + picmrg +
                        '" class="clear_fix"></div>\
<div id="tis_upload_edit" class="clear_fix"><div id="tis_uploader_edit"></div></div>\
<div style="margin: 8px 0 8px 0;">\
  <div class="fl_r" id="tis_add_lnk_edit"><span class="add_media_lnk">' +
                        getLang('global_add_media') + '</span></div>\
  <button class="flat_button fl_l" id="save_butn' + cid +
                        '" onclick="Tickets.doSaveComment(' + cid + ', \'' + hash + '\', ' + (cur.ticket_id || ticket_id) + ')">' + getLang(
                            'global_save') + '</button>\
  <button class="flat_button secondary fl_l" style="margin-left: 10px;" id="cancel_butn' +
                        cid + '" style="margin-left: 10px;" onclick="Tickets.cancelEditComment(' + cid + ')">' + getLang('global_cancel') +
                        '</button>\
  <div id="edit_progress' + cid +
                        '" style="margin: 5px 0px 0px 10px; vertical-align: 0px; float: left; display: none"><img src="/images/upload.gif"/></div>\
</div>'
                }, {
                    display: 'none'
                }), cont);
                if (canAttach) {
                    var attachOpts = {
                        limit: 5,
                        oneClick: cur.oneClickUpload,
                        target: 'edit'
                    };
                    if (cur.addScreenShot) {
                        attachOpts.photoCallback = cur.addScreenShot;
                    }
                    cur.ticketsEditMedia = Tickets.initAddMedia(ge('tis_add_lnk_edit')
                        .firstChild, 'tis_preview_edit', cur.mediaTypes, attachOpts);
                }
                autosizeSetup(ge('reply' + cid + 'edit'), {
                    minHeight: 17
                });

                setTimeout(function() {
                    show(cont.previousSibling);
                    hide(geByClass1('tickets_reply_text', ge('reply' + cid)));
                    hide(geByClass1('tickets_reply_actions', ge('reply' + cid)));
                    hide('attachs' + cid);
                    cur.editing = cid;

                    if (canAttach) {
                        for (var i in attachs) {
                            cur.ticketsEditMedia.chooseMedia(attachs[i][0], attachs[i][1], attachs[i][2]);
                        }
                    }
                    elfocus('reply' + cid + 'edit');
                }, 0);
            },
            onFail: function(error) {
                delete cur.editStarted;
                hide('reply_actions' + cid);
                return Tickets.showError(error);
            }
        });
        return false;
    },

    saveComment: function(event, cid, hash, ticket_id) {
        if (event && event.keyCode == 27) {
            this.cancelEditComment(cur.editing);
            return;
        }
        if (event && (event.ctrlKey || event.metaKey && browser.mac) && (event.keyCode == 10 || event.keyCode == 13)) this.doSaveComment(cid, hash, ticket_id);
    },

    cancelEditComment: function(cid) {
        show(geByClass1('tickets_reply_text', ge('reply' + cid)));
        show(geByClass1('tickets_reply_actions', ge('reply' + cid)));
        show('attachs' + cid);
        re('tickets_reply_edit' + cid);
        delete cur.editing;
    },

    doSaveComment: function(cid, hash, ticket_id) {
        var v = trim(val('reply' + cid + 'edit'));
        var attachs = [],
            chosen = cur.ticketsEditMedia && cur.ticketsEditMedia.chosenMedias || [];
        if (chosen) {
            for (var i in chosen) {
                var att = chosen[i],
                    type = att[0],
                    value = att[1];
                if (type == 'photo' || type == 'doc') {
                    attachs.push(type + ',' + value);
                }
            }
        }
        if (!v && !attachs.length) {
            notaBene('reply' + cid + 'edit');
            return;
        }
        ajax.post(cur.objLoc, {
            act: 'edit_comment',
            ticket_id: ticket_id,
            cid: cid,
            text: v,
            attachs: attachs,
            hash: hash
        }, {
            onDone: function(text, attachs) {
                var cont = geByClass1('tickets_reply_text', ge('reply' + cid)),
                    acts = geByClass1('tickets_reply_actions', ge('reply' + cid));
                cont.innerHTML = text;
                show(geByClass1('tickets_reply_text', ge('reply' + cid)));
                show(acts);
                show('attachs' + cid);
                if (attachs !== 0) {
                    if (attachs) {
                        var attNode = ge('attachs' + cid);
                        if (!attNode) {
                            attNode = acts.parentNode.insertBefore(ce('div', {
                                id: 'attachs' + cid,
                                className: 'clear_fix tr_attachs'
                            }), acts);
                        }
                        attNode.innerHTML = attachs;
                    } else {
                        re('attachs' + cid);
                    }
                }
                re('tickets_reply_edit' + cid);
                delete cur.editing;
            },
            onFail: function(error) {
                hide('reply_actions' + cid);
                return Tickets.showError(error);
            },
            showProgress: lockButton.pbind(ge('save_butn' + cid)),
            hideProgress: unlockButton.pbind(ge('save_butn' + cid))
        });
    },
    deleteComment: function(cid, hash, ticket_id) {
        ajax.post(cur.objLoc, {
            act: 'delete_comment',
            ticket_id: cur.ticket_id || ticket_id,
            cid: cid,
            hash: hash
        }, {
            onDone: function(res) {
                var cont = ge('reply' + cid)
                    .firstChild;
                if (cont) {
                    if (!cur.deletedComments) cur.deletedComments = [];
                    cur.deletedComments[cid] = cont.innerHTML;
                    cont.innerHTML = res;
                }
            },
            onFail: function(error) {
                hide('reply_actions' + cid);
                return Tickets.showError(error);
            }
        });
        return false;
    },
    restoreComment: function(cid, hash, ticket_id) {
        ajax.post(cur.objLoc, {
            act: 'restore_comment',
            ticket_id: cur.ticket_id || ticket_id,
            cid: cid,
            hash: hash
        }, {
            onDone: function(res) {
                var cont = ge('reply' + cid)
                    .firstChild;
                if (cont) cont.innerHTML = cur.deletedComments[cid];
            },
            onFail: function(error) {
                hide('reply_actions' + cid);
                return Tickets.showError(error);
            }
        });
        return false;
    },
    rateComment: function(reply_id, rate, hash) {
        if (cur.replyRating) return false;
        cur.replyRating = true;
        ajax.post('support', {
            act: 'rate_comment',
            ticket_id: cur.ticket_id,
            reply_id: reply_id,
            rate: rate,
            hash: hash
        }, {
            onDone: function(text) {
                delete cur.replyRating;
                ge('reply_actions' + reply_id)
                    .innerHTML = text;
            },
            onFail: function() {
                delete cur.replyRating;
            }
        });
        return false;
    },
    deleteTicket: function(ticket_id, hash) {
        var box = showFastBox({
            title: cur.lang['delete_title'],
            dark: true,
            bodyStyle: 'padding: 20px; line-height: 160%;',
            width: 430
        }, cur.lang['delete_confirm'], cur.lang['delete'], function() {
            ajax.post(cur.objLoc, {
                act: 'delete',
                ticket_id: ticket_id,
                hash: hash
            }, {
                progress: box.progress,
                onFail: function(text) {
                    box.hide();
                }
            });
        }, getLang('global_cancel'));
        return false;
    },
    showMsg: function(text) {
        var msg = ge('tickets_msg');
        if (!msg) {
            var parent;
            switch (cur.section) {
                case 'show':
                    parent = ge('tickets_reply_rows');
                    break;
                case 'list':
                    parent = ge('tickets_list');
                    break;
                case 'new_faq':
                    parent = ge('tickets_faq_msg');
                    show('tickets_faq_msg');
                    break;
            }
            msg = parent.insertBefore(ce('div', {
                id: 'tickets_msg',
                className: 'msg'
            }), parent.firstChild);
        }
        re('tickets_error');
        msg.innerHTML = text;
        msg.style.backgroundColor = '#F4EBBD';
        animate(msg, {
            backgroundColor: '#F9F6E7'
        }, 2000);
        return true;
    },
    showError: function(error) {
        var err = ge('tickets_error');
        if (!err) {
            var parent;
            switch (cur.section) {
                case 'show':
                    parent = ge('tickets_reply_rows');
                    break;
                case 'list':
                    parent = ge('tickets_list');
                    break;
                case 'new_faq':
                    parent = ge('tickets_faq_msg');
                    show('tickets_faq_msg');
                    break;
            }
            err = parent.insertBefore(ce('div', {
                id: 'tickets_error',
                className: 'error'
            }), parent.firstChild);
        }
        re('tickets_msg');
        hide('tickets_progress');
        err.innerHTML = error;
        err.style.backgroundColor = '#FACEBB';
        animate(err, {
            backgroundColor: '#FFEFE8'
        }, 2000);
        scrollToTop(200);
        return true;
    },
    closeTicketByAuthor: function(hash) {
        ajax.post('support', {
            act: 'close_ticket_by_author',
            ticket_id: cur.ticket_id,
            hash: hash
        }, {
            onDone: addClass.pbind('tickets_thank_you_form', 'you_re_welcome'),
            showProgress: addClass.pbind('tickets_thank_you_form', 'processing'),
            hideProgress: removeClass.pbind('tickets_thank_you_form', 'processing')
        });
    },
    reopenTicketByAuthor: function(hash) {
        ajax.post('support', {
            act: 'reopen_ticket_by_author',
            ticket_id: cur.ticket_id,
            hash: hash
        }, {
            onDone: removeClass.pbind('tickets_thank_you_form', 'you_re_welcome'),
            showProgress: addClass.pbind('tickets_thank_you_form', 'processing'),
            hideProgress: removeClass.pbind('tickets_thank_you_form', 'processing')
        });
        return false;
    },
    showPostField: function() {
        hide('tickets_thank_you_form');
        show('tickets_post_field');
        elfocus('tickets_reply');
    },
    hidePostField: function() {
        show('tickets_thank_you_form');
        hide('tickets_post_field');
    },
    showAllReplies: function() {
        var link = ge('show_all_replies_link'),
            pr = geByClass1('progress', link),
            label = geByClass1('label', link);
        hide(label);
        show(pr);
        ajax.post(cur.objLoc, {
            act: 'show',
            id: cur.ticket_id,
            all: 1
        }, {
            onDone: function(content, script) {
                if (content) ge('tickets_reply_rows')
                    .innerHTML = content;
                if (script) eval(script);
            },
            onFail: function() {
                show(label);
                hide(pr);
            }
        });
        return false;
    },
    showPhoto: function(photoRaw, listId, opts) {
        var cbox = curBox();
        if (!cbox) {
            return showPhoto(photoRaw, listId, opts);
        }
        var btns = [];
        each(geByTag('button', cbox.bodyNode.nextSibling), function() {
            btns.push([this.innerHTML, this.onclick, hasClass(this, 'flat_button') ? 'yes' : 'no']);
        });
        cur.boxBackup = {
            body: document.createDocumentFragment(),
            width: getSize(cbox.bodyNode.parentNode)[0],
            hideButtons: !isVisible(cbox.bodyNode.nextSibling),
            bodyStyle: cbox.bodyNode.getAttribute('style'),
            title: geByClass1('box_title', cbox.bodyNode.previousSibling)
                .innerHTML,
            btns: btns
        };
        var boxBody = cbox.bodyNode;
        cur.scrollTopBack = boxLayerWrap.scrollTop;
        opts.onShow = function() {
            while (boxBody.firstChild) {
                cur.boxBackup.body.appendChild(boxBody.firstChild);
            }
        }
        opts.onHide = function() {
            box = showFastBox('', '');
            box.setOptions({
                hideButtons: cur.boxBackup.hideButtons,
                title: cur.boxBackup.title,
                bodyStyle: cur.boxBackup.bodyStyle,
                width: cur.boxBackup.width
            });
            box.bodyNode.appendChild(cur.boxBackup.body);
            if (cur.boxBackup.btns) {
                box.removeButtons();
                each(cur.boxBackup.btns.reverse(), function() {
                    box.addButton.apply(box, this);
                });
            }
            box.setOptions({}); // clear box coords
            boxLayerWrap.scrollTop = cur.scrollTopBack;
        }
        return showPhoto(photoRaw, listId, opts);
    },
    showAddScreenBox: function(onShow) {
        var opts = {
            title: getLang('support_adding_screen'),
            width: 460,
            bodyStyle: 'padding: 0px',
            dark: 1
        };
        if (onShow) {
            opts.onShow = onShow;
        }
        return showFastBox(opts, cur.screenBox);
    },
    showAddDocBox: function(onShow) {
        var opts = {
            title: getLang('support_adding_doc'),
            width: 460,
            bodyStyle: 'padding: 0px',
            dark: 1
        };
        if (onShow) {
            opts.onShow = onShow;
        }
        return showFastBox(opts, cur.docBox);
    },
    showAddExtraFieldFileBox: function(index, withSize) {
        return showFastBox({
            onShow: Tickets.initExtraFieldUpload.pbind('tis_add_data', {
                hideOnStart: true,
                fieldIndex: index,
                withSize: withSize
            }),
            title: getLang('support_adding_image'),
            width: 460,
            bodyStyle: 'padding: 0px',
            dark: 1,
            hideButtons: true
        }, cur.extraFieldsBox);
    },
    choosePhotoUploaded: function(info, params, addMedia) {
        var i = info.ind !== undefined ? info.ind : info,
            fileName = (info.fileName || info)
            .replace(/[&<>"']/g, ''),
            ind = info.fileName ? i + '_' + info.fileName : info,
            prg = ge('upload' + ind + '_progress_wrap');

        prg && hide(geByClass1('progress_x', prg));
        ajax.post('al_photos.php', extend({
            act: 'choose_uploaded_support'
        }, params), {
            onDone: function(media, data) {
                addMedia.chooseMedia('photo', media, extend(data, {
                    upload_ind: i + '_' + fileName
                }));
            },
            onFail: Tickets.chooseFail.pbind(addMedia, info)
        });
    },
    chooseDocUploaded: function(info, params, addMedia) {
        var i = info.ind !== undefined ? info.ind : info,
            fileName = (info.fileName || info)
            .replace(/[&<>"']/g, ''),
            ind = info.fileName ? i + '_' + info.fileName : info,
            prg = ge('upload' + ind + '_progress_wrap');

        prg && hide(geByClass1('progress_x', prg));
        ajax.post('docs.php', extend({
            act: 'a_save_doc',
            from: 'choose',
            support_hash: cur.uploadDocData.support_hash
        }, params), {
            onDone: function(oid, id, data) {
                re('upload' + ind + '_progress_wrap');
                addMedia.chooseMedia('doc', oid + '_' + id, data);
            },
            onFail: Tickets.chooseFail.pbind(addMedia, info)
        });
    },
    chooseExtraFieldUploaded: function(fieldIndex, info, params) {
        var i = info.ind !== undefined ? info.ind : info,
            fileName = (info.fileName || info)
            .replace(/[&<>"']/g, ''),
            ind = info.fileName ? i + '_' + info.fileName : info,
            prg = ge('upload' + ind + '_progress_wrap');

        prg && hide(geByClass1('progress_x', prg));
        ajax.post('al_photos.php', extend({
            act: 'choose_uploaded_support'
        }, params), {
            onDone: function(media, data) {
                Tickets.chooseExtraFieldComplete(fieldIndex, media, extend(data, {
                    upload_ind: i + '_' + fileName
                }));
            },
            onFail: function(code) {
                Tickets.chooseFail(null, info, code);
            }
        });
    },
    removeExtraFieldFile: function(evt, fieldIndex) {
        var p = evt.target.parentNode;
        if (p.tt && p.tt.hide) {
            p.tt.hide();
        }
        re('tickets_new_extra_field__file_' + fieldIndex);
        hide('tickets_new_extra_field__uploaded_' + fieldIndex, 'tis_add_lnk');
        show('tickets_new_extra_field__upload_btn_' + fieldIndex, 'tickets_new_extra_field__example_' + fieldIndex, 'tickets_new_extra_field__note_' + fieldIndex);
        data(ge('tickets_new_extra_field_' + fieldIndex), 'value', '');
    },
    allExtraFieldFilesUploaded: function() {
        for (var i in cur.extraFields) {
            var f = cur.extraFields[i];
            if (f.type == 6 || f.type == 7 || f.type == 8) {
                var v = data(ge('tickets_new_extra_field_' + i), 'value');
                if (!v) {
                    return false;
                }
            }
        }
        return true;
    },
    chooseExtraFieldComplete: function(fieldIndex, media, uplData) {
        if (uplData.upload_ind === undefined) {
            return false;
        }

        if (!isObject(uplData)) {
            uplData = {
                thumb_m: uplData[0] || '',
                thumb_s: uplData[1] || '',
                list: uplData[2] || '',
                view_opts: uplData[3] || '',
                upload_ind: uplData.upload_ind || undefined
            };
        }
        vkImage()
            .src = uplData.thumb_m;
        var preview = '<div onclick="return Tickets.showPhoto(\'' + media + '\', \'' + uplData.list + '\', ' + uplData.view_opts.replace(/"/g, '&quot;') +
            ');" class="fl_l page_preview_photo"><img class="page_preview_photo" src="' + uplData.thumb_m + '" /></div>';

        var mediaEl = se('<div class="page_preview_photo_wrap fl_l" id="tickets_new_extra_field__file_' + fieldIndex + '">' + preview +
            '<div class="page_media_x_wrap inl_bl" ' + (browser.msie ? 'title' : 'tootltip') + '="' + getLang('dont_attach') +
            '" onmouseover="if (browser.msie) return; showTooltip(this, {text: this.getAttribute(\'tootltip\'), shift: [13, 3, 3], black: 1})"><div class="page_media_x" onclick="Tickets.removeExtraFieldFile(event, ' +
            fieldIndex + ');"></div></div></div>');

        re('upload' + uplData.upload_ind + '_progress_wrap');
        data(ge('tickets_new_extra_field_' + fieldIndex), 'value', media);
        ge('tickets_new_extra_field__uploaded_' + fieldIndex)
            .appendChild(mediaEl);

        if (!cur.fileApiUploadStarted) {
            boxQueue.hideLast();
        }

        cur.lastPostMsg = false;

        if (uplData.upload_ind !== undefined) {
            delete uplData.upload_ind;
        }
        if (Tickets.allExtraFieldFilesUploaded()) {
            show('tis_add_lnk');
        }
        return false;
    },
    chooseFail: function(addMedia, info, code) {
        var i = info.ind !== undefined ? info.ind : info,
            fileName = (info.fileName || info)
            .replace(/[&<>"']/g, '');
        if (Upload.types[i] == 'fileApi' && !Upload.options[i].wiki_editor) {
            var lnkId, ind = info.fileName ? i + '_' + info.fileName : info;
            if (addMedia) {
                re('upload' + ind + '_progress_wrap');
            }
        }
        var msg = '',
            type = (Upload.options[i] || {})
            .type || '';
        if (type == 'doc') {
            msg = getLang('support_upload_fail');
        } else if (type == 'photo') {
            msg = getLang('support_photo_upload_fail');
        }
        if (msg) {
            setTimeout(showFastBox({
                    title: getLang('global_error'),
                    dark: 1,
                    bodyStyle: 'padding: 20px; line-height: 160%;'
                }, msg)
                .hide, 4000);
        }
        topError('Upload failed', {
            dt: -1,
            type: 102,
            url: (ge('file_uploader_form' + i) || {})
                .action
        });
        Upload.embed(i);
    },

    initPhotoUpload: function(el, params) {
        el = ge(el);
        if (!el) return;

        var uploadData = cur.uploadPhotoData,
            opts = (uploadData || {})
            .options,
            addMedia;
        switch (params.target) {
            case 'auto':
                addMedia = cur.ticketsAutoMedia;
                uploadData = cur.autoUploadData, opts = uploadData.options
                break;
            case 'template':
                addMedia = cur.ticketsTemplateMedia;
                uploadData = cur.templateUploadData, opts = uploadData.options
                break;
            case 'edit':
                addMedia = cur.ticketsEditMedia;
                break;
            case 'new':
            default:
                addMedia = cur.ticketsNewMedia;
                break;
        }
        return Upload.init(el, uploadData.url, uploadData.vars, {
            file_name: 'photo',

            file_size_limit: 1024 * 1024 * 5, // 5Mb
            file_types_description: 'Image files (*.jpg, *.jpeg, *.png, *.gif)',
            file_types: '*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG;*.gif;*.GIF',
            accept: 'image/jpeg,image/png,image/gif',
            file_match: '\.(gif|jpg|jpeg|png)$',
            lang: opts.lang,

            onUploadStart: function(info, res) {
                var i = info.ind !== undefined ? info.ind : info,
                    options = Upload.options[i];
                if (Upload.types[i] == 'form') {
                    geByClass1('file', el)
                        .disabled = true;
                }
                if (Upload.types[i] == 'fileApi') {
                    if (cur.notStarted) {
                        if (params && params.hideOnStart) boxQueue.hideLast();
                        delete cur.notStarted;
                    }
                    if (options.multi_progress) this.onUploadProgress(info, 0, 0);
                }
            },
            onUploadComplete: function(info, res) {
                var params;
                try {
                    params = eval('(' + res + ')');
                } catch (e) {
                    params = q2ajx(res);
                }
                if (!params.photos) {
                    Upload.onUploadError(info);
                    return;
                }
                Tickets.choosePhotoUploaded(info, params, addMedia);
            },
            onUploadProgress: function(info, bytesLoaded, bytesTotal) {
                var i = info.ind !== undefined ? info.ind : info;
                if (Upload.types[i] == 'fileApi') {
                    var lnkId = (cur.attachMediaIndexes || {})[i];
                    if (lnkId === undefined || lnkId && cur.addMedia[lnkId].chosenMedia) {
                        var data = {
                            loaded: bytesLoaded,
                            total: bytesTotal
                        };
                        if (info.fileName) {
                            data.fileName = info.fileName.replace(/[&<>"']/g, '');
                        }
                        addMedia.showMediaProgress('photo', i, data);
                    }
                } else if (Upload.types[i] == 'flash') {
                    if (!ge('form' + i + '_progress')) {
                        var obj = Upload.obj[i],
                            objHeight = getSize(obj)[1],
                            tm = objHeight / 2 + 10;
                        var node = obj.firstChild;
                        while (node) {
                            if (node.nodeType == 1) {
                                if (node.id == 'uploader' + i && browser.msie) {
                                    setStyle(node, {
                                        position: 'relative',
                                        left: '-5000px'
                                    });
                                } else {
                                    setStyle(node, {
                                        visibility: 'hidden'
                                    });
                                }
                            }
                            node = node.nextSibling;
                        }
                        obj.appendChild(ce('div', {
                            innerHTML: '<div class="tickets_progress_wrap">\
            <div id="form' + i +
                                '_progress" class="tickets_progress" style="width: 0%;"></div>\
          </div></div>'
                        }, {
                            height: tm + 'px',
                            marginTop: -tm + 'px'
                        }));
                    }
                    var percent = intval(bytesLoaded / bytesTotal * 100);
                    setStyle(ge('form' + i + '_progress'), {
                        width: percent + '%'
                    });
                }
            },
            onUploadError: Tickets.chooseFail.pbind(addMedia),
            onUploadCompleteAll: function(info) {
                var i = info.ind !== undefined ? info.ind : info;
                if (Upload.types[i] !== 'fileApi') {
                    if (params.hideOnStart) {
                        boxQueue.hideLast();
                    } else {
                        Upload.embed(i);
                    }
                }
            },

            multiple: 1,
            multi_progress: 1,
            max_files: params && params.max_files || 5,
            max_files_hide_last: 1,
            clear: 1,
            type: 'photo',
            max_attempts: 3,
            file_input: cur.uploadInput,
            server: opts.server,
            error: opts.default_error,
            error_hash: opts.error_hash,
            dropbox: 'tis_dropbox'
        });
    },

    initDocUpload: function(el, params) {
        el = ge(el);
        if (!el) return;

        var uploadData = params.uploadData || cur.uploadDocData,
            opts = uploadData.options,
            addMedia;
        switch (params.target) {
            case 'auto':
                addMedia = cur.ticketsAutoMedia;
                break;
            case 'template':
                addMedia = cur.ticketsTemplateMedia;
                break;
            case 'edit':
                addMedia = cur.ticketsEditMedia;
                break;
            case 'new':
            default:
                addMedia = cur.ticketsNewMedia;
                break;
        }
        return Upload.init(el, uploadData.url, uploadData.vars, {
            file_name: 'file',

            file_size_limit: 1024 * 1024 * 200, // 200Mb
            file_types_description: 'Documents',
            file_types: '*.*;',
            lang: opts.lang,

            onUploadStart: function(info, res) {
                var i = info.ind !== undefined ? info.ind : info,
                    options = Upload.options[i];
                if (Upload.types[i] == 'form') {
                    geByClass1('file', el)
                        .disabled = true;
                }
                if (Upload.types[i] == 'fileApi') {
                    if (cur.notStarted) {
                        if (params && params.hideOnStart) boxQueue.hideLast();
                        delete cur.notStarted;
                    }
                    if (options.multi_progress) this.onUploadProgress(info, 0, 0);
                }
            },
            onUploadComplete: function(info, res) {
                var fileName = (info.fileName || info)
                    .replace(/[&<>"']/g, ''),
                    params;
                try {
                    params = eval('(' + res + ')');
                } catch (e) {
                    params = q2ajx(res);
                }
                if (!params.file) {
                    Upload.onUploadError(info);
                    return;
                }
                Tickets.chooseDocUploaded(info, params, addMedia);
            },
            onUploadProgress: function(info, bytesLoaded, bytesTotal) {
                var i = info.ind !== undefined ? info.ind : info;
                if (Upload.types[i] == 'fileApi') {
                    var lnkId = (cur.attachMediaIndexes || {})[i];
                    if (lnkId === undefined || lnkId && cur.addMedia[lnkId].chosenMedia) {
                        var data = {
                            loaded: bytesLoaded,
                            total: bytesTotal
                        };
                        if (info.fileName) {
                            data.fileName = info.fileName.replace(/[&<>"']/g, '');
                        }
                        addMedia.showMediaProgress('doc', i, data);
                    }
                } else if (Upload.types[i] == 'flash') {
                    if (!ge('form' + i + '_progress')) {
                        var obj = Upload.obj[i],
                            objHeight = getSize(obj)[1],
                            tm = objHeight / 2 + 10;
                        var node = obj.firstChild;
                        while (node) {
                            if (node.nodeType == 1) {
                                if (node.id == 'uploader' + i && browser.msie) {
                                    setStyle(node, {
                                        position: 'relative',
                                        left: '-5000px'
                                    });
                                } else {
                                    setStyle(node, {
                                        visibility: 'hidden'
                                    });
                                }
                            }
                            node = node.nextSibling;
                        }
                        obj.appendChild(ce('div', {
                            innerHTML: '<div class="tickets_progress_wrap">\
            <div id="form' + i +
                                '_progress" class="tickets_progress" style="width: 0%;"></div>\
          </div></div>'
                        }, {
                            height: tm + 'px',
                            marginTop: -tm + 'px'
                        }));
                    }
                    var percent = intval(bytesLoaded / bytesTotal * 100);
                    setStyle(ge('form' + i + '_progress'), {
                        width: percent + '%'
                    });
                }
            },
            onCheckComplete: params && params.onCheckComplete || false,
            onUploadError: Tickets.chooseFail.pbind(addMedia),
            onUploadCompleteAll: function(info) {
                var i = info.ind !== undefined ? info.ind : info;
                if (Upload.types[i] !== 'fileApi') {
                    if (params.hideOnStart) {
                        boxQueue.hideLast();
                    } else {
                        Upload.embed(i);
                    }
                }
            },

            multiple: 1,
            multi_progress: 1,
            max_files: params && params.max_files || 5,
            max_files_hide_last: 1,
            clear: 1,
            type: 'doc',
            max_attempts: 3,
            file_input: cur.uploadInput,
            server: opts.server,
            error: opts.default_error,
            error_hash: opts.error_hash,
            dropbox: 'tis_dropbox'
        });
    },

    showExtraFieldProgress: function(index, i, data, lnkId) {
        var frac = data.loaded / data.total,
            percent = intval(frac * 100),
            fileName = (data.fileName || data.name || '')
            .replace(/[&<>"']/g, ''),
            ind = fileName ? i + '_' + fileName : i,
            label = fileName ? (fileName.length > 33 ? fileName.substr(0, 30) + '...' : fileName) : '';

        var prg = ge('upload' + ind + '_progress');
        if (!prg) {
            hide('tickets_new_extra_field__upload_btn_' + index, 'tickets_new_extra_field__example_' + index, 'tickets_new_extra_field__note_' + index);
            var container = ge('tickets_new_extra_field__uploaded_' + index);

            if (!cur.attachMediaIndexes) cur.attachMediaIndexes = {};
            cur.attachMediaIndexes[ind] = lnkId;

            var progress = '\
<div class="fl_l"><div class="page_attach_progress_wrap" style="margin-top: 3px; margin-bottom: 4px;">\
  <div id="upload' + ind +
                '_progress" class="page_attach_progress"></div>\
</div></div></div>' + (label ? '<div class="attach_label fl_l">' + label + '</div>' : '') +
                '<div class="progress_x fl_l" onmouseover="animate(this, {opacity: 1}, 200); showTooltip(this, {text: \'' + getLang('dont_attach') +
                '\', shift: [6, 3, 3]})" onmouseout="animate(this, {opacity: 0.6}, 200);" onclick="Upload.terminateUpload(' + i + ', \'' + (fileName || i) + '\');"></div>';

            container.appendChild(ce('div', {
                id: 'upload' + ind + '_progress_wrap',
                innerHTML: progress,
                className: 'clear_fix upload_' + i + '_progress'
            }, {
                marginTop: '6px'
            }));
            show(container);
            prg = ge('upload' + ind + '_progress');
            prg.full = false;

            if (percent) {
                setStyle(prg, {
                    width: prg.full ? (intval(prg.full * frac) + 'px') : percent + '%'
                })
            } else {
                setStyle(prg, {
                    width: '1px'
                });
                hide(prg);
            }
        } else {
            show(prg);
            if (prg.full) {
                var tw = data(prg, 'tween'),
                    w = intval(prg.full * frac);
                if (tw && tw.isTweening) {
                    tw.to.width = w;
                } else {
                    animate(prg, {
                        width: w + 'px'
                    }, 500);
                }
            } else {
                setStyle(prg, {
                    width: percent + '%'
                });
            }
        }
    },

    initExtraFieldUpload: function(el, params) {
        el = ge(el);
        if (!el) return;
        var about = ge('tis_about');
        if (about) {
            about.innerHTML = getLang(params.withSize ? 'support_extra_field_limits_photo' : 'support_extra_field_limits');
        }
        var uploadData = cur.uploadExtraFieldsData,
            opts = uploadData.options,
            fieldIndex = params.fieldIndex;

        return Upload.init(el, uploadData.url, uploadData.vars, {
            file_name: 'file',

            file_size_limit: 1024 * 1024 * 10, // 10Mb
            file_types_description: 'Image files (*.jpg, *.jpeg, *.png)',
            file_types: '*.jpg;*.JPG;*.jpeg;*.JPEG;*.png;*.PNG',
            accept: 'image/jpeg,image/png',
            file_match: '\.(jpg|jpeg|png)$',
            lang: opts.lang,

            onUploadStart: function(info, res) {
                var i = info.ind !== undefined ? info.ind : info,
                    options = Upload.options[i];
                if (Upload.types[i] == 'form') {
                    geByClass1('file', el)
                        .disabled = true;
                }
                if (Upload.types[i] == 'fileApi') {
                    if (cur.notStarted) {
                        if (params && params.hideOnStart) boxQueue.hideLast();
                        delete cur.notStarted;
                    }
                    if (options.multi_progress) this.onUploadProgress(info, 0, 0);
                }
            },
            onUploadComplete: function(info, res) {
                var params;
                try {
                    params = eval('(' + res + ')');
                } catch (e) {
                    params = q2ajx(res);
                }
                if (!params.photos) {
                    Upload.onUploadError(info);
                    return;
                }
                Tickets.chooseExtraFieldUploaded(fieldIndex, info, params);
            },
            onUploadProgress: function(info, bytesLoaded, bytesTotal) {
                var i = info.ind !== undefined ? info.ind : info;
                if (Upload.types[i] == 'fileApi') {
                    var lnkId = (cur.attachMediaIndexes || {})[i];
                    //if (lnkId === undefined || lnkId) { //  && cur.addMedia[lnkId].chosenMedia
                    var data = {
                        loaded: bytesLoaded,
                        total: bytesTotal
                    };
                    if (info.fileName) {
                        data.fileName = info.fileName.replace(/[&<>"']/g, '');
                    }

                    Tickets.showExtraFieldProgress(fieldIndex, i, data, lnkId);
                } else if (Upload.types[i] == 'flash') {
                    if (!ge('form' + i + '_progress')) {
                        var obj = Upload.obj[i],
                            objHeight = getSize(obj)[1],
                            tm = objHeight / 2 + 10;
                        var node = obj.firstChild;
                        while (node) {
                            if (node.nodeType == 1) {
                                if (node.id == 'uploader' + i && browser.msie) {
                                    setStyle(node, {
                                        position: 'relative',
                                        left: '-5000px'
                                    });
                                } else {
                                    setStyle(node, {
                                        visibility: 'hidden'
                                    });
                                }
                            }
                            node = node.nextSibling;
                        }
                        obj.appendChild(ce('div', {
                            innerHTML: '<div class="tickets_progress_wrap">\
          <div id="form' + i +
                                '_progress" class="tickets_progress" style="width: 0%;"></div>\
        </div></div>'
                        }, {
                            height: tm + 'px',
                            marginTop: -tm + 'px'
                        }));
                    }
                    var percent = intval(bytesLoaded / bytesTotal * 100);
                    setStyle(ge('form' + i + '_progress'), {
                        width: percent + '%'
                    });
                }
            },
            onCheckComplete: false,
            onUploadError: function() {},
            onUploadCompleteAll: function(info) {
                var i = info.ind !== undefined ? info.ind : info;
                if (Upload.types[i] !== 'fileApi') {
                    if (params.hideOnStart) {
                        boxQueue.hideLast();
                    } else {
                        Upload.embed(i);
                    }
                }
            },
            multiple: false,
            multi_progress: 1,
            clear: 1,
            type: 'photo',
            max_attempts: 3,
            file_input: null,
            server: opts.server,
            error: opts.default_error,
            error_hash: opts.error_hash,
            dropbox: 'tis_dropbox'
        });
    },

    initAddMedia: function(lnk, previewId, mediaTypes, opts) {
        var types = [],
            bgposes = {
                photo: 3,
                doc: -64
            },
            addMedia;
        opts = opts || {};
        var target = opts.target || 'new',
            uploadId, uploaderId, inputId;
        switch (target) {
            case 'auto':
                uploadId = 'tis_upload_auto';
                uploaderId = 'tis_uploader_auto';
                break;
            case 'template':
                uploadId = 'tis_upload_template';
                uploaderId = 'tis_uploader_template';
                break;
            case 'edit':
                uploadId = 'tis_upload_edit';
                uploaderId = 'tis_uploader_edit';
                break;
            case 'new':
            default:
                uploadId = 'tis_upload';
                uploaderId = 'tis_uploader';
        }
        each(mediaTypes || [], function(i, v) {
            if (!v[1]) return;
            var handler = false;
            switch (v[0]) {
                case 'photo':
                    handler = function() {
                        inputId = 'tickets_photo_input' + target;
                        stManager.add('upload.js', function() {
                            if (opts.photoCallback) {
                                cur.lastAddMedia = addMedia;
                                cur.lastMediaTarget = target;
                                opts.photoCallback();
                            } else if (opts.oneClick) {
                                var inp = ge(inputId);
                                if (!inp) inp = ge(uploadId)
                                    .appendChild(ce('input', {
                                        type: 'file',
                                        multiple: 'true',
                                        id: inputId,
                                        onchange: function() {
                                            data(this, 'changed', true);
                                            cur.uploadInput = this;
                                            Tickets.initPhotoUpload(uploaderId, {
                                                target: target
                                            });
                                        }
                                    }));
                                inp.click();
                            } else {
                                Tickets.showAddScreenBox(Tickets.initPhotoUpload.pbind('tis_add_data', {
                                    hideOnStart: true,
                                    target: target
                                }));
                            }
                        });
                    }
                    break;
                case 'doc':
                    handler = function() {
                        inputId = 'tickets_doc_input' + target;
                        stManager.add('upload.js', function() {
                            if (opts.oneClick) {
                                var inp = ge(inputId);
                                if (!inp) inp = ge(uploadId)
                                    .appendChild(ce('input', {
                                        type: 'file',
                                        multiple: 'true',
                                        id: inputId,
                                        onchange: function() {
                                            data(this, 'changed', true);
                                            cur.uploadInput = this;
                                            Tickets.initDocUpload(uploaderId, {
                                                target: target
                                            });
                                        }
                                    }));
                                inp.click();
                            } else {
                                Tickets.showAddDocBox(Tickets.initDocUpload.pbind('tis_add_data', {
                                    hideOnStart: true,
                                    target: target
                                }));
                            }
                        });
                    }
                    break;
            }
            var icon = false,
                bgpos = ('3px ' + bgposes[v[0]] + 'px'),
                url = false,
                name = v[1].replace(/\s/g, '&nbsp;');
            types.push([v[0], v[1], bgpos, handler, url, icon]);
        });

        var limit = opts.limit || 10;

        var isDev = hasClass(bodyNode, 'dev');
        var menu = initCustomMedia(lnk, types, {
            reverseMargin: isDev ? 27 : 25,
            menuNodeClass: isDev ? 'dev' : '',
            topOffset: isDev ? 1 : 0,
            onShow: function() {
                cur.chooseMedia = addMedia.chooseMedia;
                cur.showMediaProgress = addMedia.showMediaProgress;
                cur.attachCount = addMedia.attachCount;
            },
            onItemClick: function(type) {
                if (addMedia.attachCount() >= limit) {
                    showFastBox({
                        title: getLang('global_error'),
                        dark: 1,
                        bodyStyle: 'padding: 20px; line-height: 160%;'
                    }, getLang('attachments_limit', limit));
                    return false;
                }
                return true;
            }
        });

        if (!menu) return;
        previewId = previewId || 'media_preview';

        var lnkId = menu.id,
            previewEl = ge(previewId),
            progressEl, picsEl, docsEl;

        val(previewEl, '<div id="page_pics_preview' + lnkId + '" class="page_pics_preview media_preview clear_fix"></div><div id="page_docs_preview' + lnkId +
            '" class="page_docs_preview media_preview clear_fix"></div><div id="page_progress_preview' + lnkId +
            '" class="page_progress_preview media_preview clear_fix"></div>');
        var picsEl = previewEl.childNodes[0],
            docsEl = previewEl.childNodes[1],
            progressEl = previewEl.childNodes[2];
        removeClass(previewEl, 'media_preview');
        addClass(previewEl, 'multi_media_preview');

        addMedia = {
            _addMediaLink: lnk,
            lnkId: lnkId,
            menu: menu,
            handlers: {},
            chosenMedias: [],
            _showAddMedia: function() {
                menu.show();
            },
            _hideAddMedia: function(noTimeout) {
                menu.hide(noTimeout);
            },
            chooseMedia: function(type, media, data, url, noboxhide) {
                if (addMedia.onChange && addMedia.onChange(type, media, data) === false) {
                    return false;
                }
                if (addMedia.attachCount() >= limit && data.upload_ind === undefined) {
                    return false;
                }
                var preview = '',
                    postview = '',
                    toPics = false,
                    oncl;
                switch (type) {
                    case 'photo':
                        if (!isObject(data)) {
                            data = {
                                thumb_m: data[0] || '',
                                thumb_s: data[1] || '',
                                list: data[2] || '',
                                view_opts: data[3] || '',
                                upload_ind: data.upload_ind || undefined
                            };
                        }
                        vkImage()
                            .src = data.thumb_s;
                        oncl = opts.nocl ? '' : ' onclick="return Tickets.showPhoto(\'' + media + '\', \'' + data.list + '\', ' + data.view_opts.replace(/"/g,
                            '&quot;') + ');"';
                        preview = '<div ' + oncl + ' class="fl_l page_preview_photo"><img class="page_preview_photo" src="' + data.thumb_s + '" /></div>';
                        toPics = true;
                        break;
                    case 'doc':
                        if (!data.lang) return false;
                        if (data.thumb && data.thumb_s) {
                            preview = '<a target="_blank" href="' + data.href + '" class="fl_l"><div class="page_preview_doc_photo"><img src="' + data.thumb_s +
                                '" align="center"></div><div class="page_preview_doc_photo_hint">' + data.title + '</div></a>';
                            toPics = true;
                        } else {
                            preview = '<a target="_blank" href="' + data.href + '" class="medadd_h medadd_h_doc inl_bl">' + data.lang.profile_choose_doc + '</a>';
                            postview = '<div class="medadd_c medadd_c_doc"><a target="_blank" href="' + data.href + '">' + data.title + '</a></div>';
                        }
                        break;
                }
                var medias = addMedia.chosenMedias,
                    ind = medias.length,
                    mediaEl = (type == 'photos_list') ?
                    se('<div class="page_preview_' + type + '_wrap" style="position: relative">' + preview + '<div class="page_photos_count">' + media.split(',')
                        .length + '</div></div>') :
                    se('<div class="page_preview_' + type + '_wrap"' + (opts.nocl ? ' style="cursor: default"' : '') + '>' + preview +
                        '<div class="page_media_x_wrap inl_bl" ' + (browser.msie ? 'title' : 'tootltip') + '="' + getLang('dont_attach') +
                        '" onmouseover="if (browser.msie) return; showTooltip(this, {text: this.getAttribute(\'tootltip\'), shift: [13, 3, 3], black: 1})" onclick="cur.addMedia[' +
                        addMedia.lnkId + '].unchooseMedia(' + ind + ')"><div class="page_media_x"></div></div>' + postview + '</div>');
                addClass(mediaEl, toPics ? 'fl_l' : 'clear_fix');
                if (data.upload_ind !== undefined) re('upload' + data.upload_ind + '_progress_wrap');
                (toPics ? picsEl : docsEl)
                .appendChild(mediaEl);
                medias.push([type, media, mediaEl, url]);

                toggle(picsEl, picsEl.childNodes.length > 0);
                toggle(docsEl, docsEl.childNodes.length > 0);
                toggle(progressEl, progressEl.childNodes.length > 0);

                if (!cur.fileApiUploadStarted && noboxhide !== true) {
                    boxQueue.hideLast();
                }

                cur.lastPostMsg = false;
                if (opts.onMediaAdd) {
                    opts.onMediaAdd();
                }

                if (data.upload_ind !== undefined) {
                    delete data.upload_ind;
                }
                if (cur.canUseDrafts) {
                    clearTimeout(cur.saveDraftTO);
                    Tickets.saveDraft(cur.ticket_id);
                }
                return false;
            },
            unchooseMedia: function(ind) {
                if (addMedia.onChange && addMedia.onChange(false, ind) === false) {
                    return false;
                }
                if (ind === undefined) {
                    each(addMedia.chosenMedias, function(k, v) {
                        if (v && k !== undefined) addMedia.unchooseMedia(k);
                    });
                    return;
                }
                var medias = addMedia.chosenMedias,
                    x;
                if (medias[ind]) {
                    if ((x = geByClass1('page_media_x_wrap', medias[ind][2], 'div')) && x.tt && x.tt.el) {
                        x.tt.destroy();
                    }
                    re(medias[ind][2]);
                    medias[ind] = false;
                }
                toggle(picsEl, picsEl.childNodes.length > 0);
                toggle(docsEl, docsEl.childNodes.length > 0);
                toggle(progressEl, progressEl.childNodes.length > 0);

                cur.lastPostMsg = false;

                if (addMedia.onChange) addMedia.onChange(false);
                if (cur.canUseDrafts) {
                    clearTimeout(cur.saveDraftTO);
                    Tickets.saveDraft(cur.ticket_id);
                }
            },
            showMediaProgress: function(type, i, info) {
                if (addMedia.onProgress && addMedia.onProgress(type, i, info) === false) {
                    return false;
                }
                var frac = info.loaded / info.total,
                    percent = intval(frac * 100),
                    fileName = (info.fileName || info.name || '')
                    .replace(/[&<>"']/g, ''),
                    ind = fileName ? i + '_' + fileName : i,
                    label = fileName ? (fileName.length > 33 ? fileName.substr(0, 30) + '...' : fileName) : '';

                var prg = ge('upload' + ind + '_progress');
                if (!prg) {
                    if (!cur.attachMediaIndexes) cur.attachMediaIndexes = {};
                    cur.attachMediaIndexes[ind] = lnkId;

                    var progress = '\
<div class="fl_l"><div class="page_attach_progress_wrap" style="margin-top: 3px; margin-bottom: 4px;">\
  <div id="upload' +
                        ind + '_progress" class="page_attach_progress"></div>\
</div></div></div>' + (label ? '<div class="attach_label fl_l">' + label + '</div>' :
                            '') + '<div class="progress_x fl_l" onmouseover="animate(this, {opacity: 1}, 200); showTooltip(this, {text: \'' + getLang('dont_attach') +
                        '\', shift: [6, 3, 3]})" onmouseout="animate(this, {opacity: 0.6}, 200);" onclick="Upload.terminateUpload(' + i + ', \'' + (fileName || i) +
                        '\');"></div>';

                    progressEl.appendChild(ce('div', {
                        id: 'upload' + ind + '_progress_wrap',
                        innerHTML: progress,
                        className: 'clear_fix upload_' + i + '_progress'
                    }, {
                        marginTop: '6px'
                    }));
                    show(progressEl);
                    prg = ge('upload' + ind + '_progress');
                    prg.full = false;

                    if (percent) {
                        setStyle(prg, {
                            width: prg.full ? (intval(prg.full * frac) + 'px') : percent + '%'
                        })
                    } else {
                        setStyle(prg, {
                            width: '1px'
                        });
                        hide(prg);
                    }
                } else {
                    show(prg);
                    if (prg.full) {
                        var tw = data(prg, 'tween'),
                            w = intval(prg.full * frac);
                        if (tw && tw.isTweening) {
                            tw.to.width = w;
                        } else {
                            animate(prg, {
                                width: w + 'px'
                            }, 500);
                        }
                    } else {
                        setStyle(prg, {
                            width: percent + '%'
                        });
                    }
                }
            },

            attachCount: function() {
                if (addMedia.attachedCount) {
                    return addMedia.attachedCount();
                }
                if (!previewEl) {
                    return 0;
                }
                var num = picsEl.childNodes.length + docsEl.childNodes.length + progressEl.childNodes.length;
                return num;
            },

            // Inline Share
            urlsCancelled: [],
            shareData: {},
            checkMessageURLs: function(message, inactive) {
                if (addMedia.chosenMedia || addMedia.urlAttachmentLoading && addMedia.urlAttachmentLoading[0] > vkNow() - 10000 || addMedia.attachCount() >= limit) {
                    return;
                }

                var urls = extractUrls(message, inactive);
                for (var i in urls) {
                    var urlInfo = urls[i];
                    var url = urlInfo['url'],
                        query = urlInfo['query'],
                        domain = urlInfo['domain'],
                        initialUrl = url;

                    if (!url.match(/^https?:\/\//)) {
                        url = 'http://' + url;
                    }
                    if (inArray(url, addMedia.urlsCancelled) || inArray(initialUrl, addMedia.urlsCancelled)) {
                        continue;
                    }
                    var valid = true;
                    if (domain.match(/(^|\.|\/\/)(vkontakte\.ru|vk\.com)/)) {
                        valid = query.match(
                            /(#photo|^\/(photo|video|album|page|audio|doc)|z=(album|photo|video)|w=(page))(-?\d+_)?\d+|\.(jpg|png|gif)$|^http:\/\/instagram\.com\/p\/.+/
                        ) ? true : false;
                    }
                    if (valid) {
                        addMedia.checkURL(initialUrl);
                        return;
                    }
                }
            },
            onCheckURLDone: function(result, data) {
                var url = '';
                if (addMedia.urlAttachmentLoading) {
                    re(addMedia.urlAttachmentLoading[2]);
                    toggle(progressEl, progressEl.childNodes > 0);
                    url = addMedia.urlAttachmentLoading[1];
                    addMedia.urlAttachmentLoading = false;
                    setStyle(bodyNode, {
                        cursor: 'default'
                    });
                }

                if (result) {
                    if (inArray(data[0], ["photo", "doc"])) {
                        addMedia.chooseMedia(data[0], data[1], data[2], url, true);
                    }
                } else if (opts.onCheckURLDone) {
                    opts.onCheckURLDone(result, data);
                }
            },
            checkURL: function(url) {
                if (!url) return;
                addMedia.urlsCancelled.push(url);
                addMedia.urlAttachmentLoading = [vkNow(), url];

                re(addMedia.checkURLForm);
                addMedia.checkURLForm = ce('div', {
                    innerHTML: '<iframe name="share_parse_iframe' + lnkId + '"></iframe>'
                });
                utilsNode.appendChild(addMedia.checkURLForm);
                var parseForm = addMedia.checkURLForm.appendChild(ce('form', {
                    action: 'share.php?act=url_attachment',
                    method: 'post',
                    target: 'share_parse_iframe' + lnkId
                }));

                each({
                    hash: cur.share_timehash || cur.options.share.timehash || '',
                    index: lnkId,
                    url: url
                }, function(i, v) {
                    parseForm.appendChild(ce('input', {
                        type: 'hidden',
                        name: i,
                        value: v
                    }));
                });

                window.onUploadDone = addMedia.onCheckURLDone.pbind(true);
                window.onUploadFail = addMedia.onCheckURLDone.pbind(false);

                parseForm.submit();
            },
        }

        if (!cur.addMedia) {
            cur.addMedia = {};
        }

        cur.addMedia[lnkId] = addMedia;
        return addMedia;
    },
    toggleFAQRow: function(id, hash, el, evt) {
        if (!evt.target) {
            evt.target = evt.srcElement || document;
        }
        if (evt.target.tagName.toLowerCase() == 'a') return true;
        toggle('tickets_faq_short_text' + id, !isVisible('tickets_faq_short_text' + id));
        toggle('tickets_faq_full_text' + id, !isVisible('tickets_faq_full_text' + id));
        if (isVisible('tickets_faq_full_text' + id)) {
            addClass(el, 'detailed');
            if (vk.id) {
                Tickets.setFAQclicked(id, hash, 0, false);
            }
        } else {
            removeClass(el, 'detailed');
            Tickets.cancelFAQclicked(id);
        }
        return false;
    },
    setFAQclicked: function(id, hash, fromNew, now) {
        if (now) {
            clearTimeout(cur.faqViewTimeouts[id]);
            cur.faqViewTimeouts[id] = null;
            ajax.post('support', {
                act: 'faq_clicked',
                faq_id: id,
                hash: hash,
                from_new: fromNew
            }, {
                cache: 1
            });
        } else if (!cur.faqViewTimeouts.hasOwnProperty(id)) {
            cur.faqViewTimeouts[id] = setTimeout(function() {
                ajax.post('support', {
                    act: 'faq_clicked',
                    faq_id: id,
                    hash: hash,
                    from_new: fromNew
                }, {
                    cache: 1
                });
            }, 1500);
        }
    },

    cancelFAQclicked: function(id) {
        if (cur.faqViewTimeouts[id]) {
            clearTimeout(cur.faqViewTimeouts[id]);
            delete cur.faqViewTimeouts[id];
        }
    },
    rateFAQ: function(id, val, hash, fromNew, quiet) {
        if (!vk.id) return false;
        ajax.post('support', {
            act: 'faq_rate',
            faq_id: id,
            val: val,
            hash: hash,
            from_new: fromNew
        });
        Tickets.setFAQclicked(id, hash, fromNew, true);

        if (!quiet) {
            hide('tickets_faq_links' + id);
            if (val > 0) {
                show('tickets_faq_useful' + id);
            } else {
                var b = ge('tickets_faq_unuseful' + id),
                    btns = geByClass1('help_table_question_rated_additional__btns', b);
                show(b, geByClass1('help_table_question_rated_additional', b));
                hide(btns, geByClass1('help_table_question__rated_final', b), geByClass1('help_table_question__rated_no_perm', b));
                slideDown(btns, 200);
            }
        }
        return false;
    },
    rateFAQAdditional: function(id, additional_id, hash, evt) {
        if (!vk.id) return false;
        var b = ge('tickets_faq_unuseful' + id);
        ajax.post('support', {
            act: 'faq_rate_additional',
            faq_id: id,
            additional_id: additional_id,
            hash: hash
        });
        hide(geByClass1('help_table_question_rated_additional', b));
        show(geByClass1('help_table_question__rated_final', b));
        if (additional_id == 2) {
            if (cur.askQuestion.permission) {
                Tickets.tryAskQuestion(function() {
                    Tickets.goToForm(id, 'dislike');
                });
            } else {
                show(geByClass1('help_table_question__rated_no_perm', b));
            }
        }
    },
    cancelRateFAQ: function(id, val, hash, evt) {
        if (!vk.id) return false;
        ajax.post('support', {
            act: 'faq_rate',
            faq_id: id,
            val: val,
            cancel: 1,
            hash: hash
        });
        hide('tickets_faq_useful' + id, 'tickets_faq_unuseful' + id);
        show('tickets_faq_links' + id);
        if (evt) {
            evt.stopPropagation();
        }
        return false;
    },
    rateFAQUrgent: function(id, val, hash) {
        if (!vk.id) return false;
        ajax.post('support', {
            act: 'faq_rate',
            faq_id: id,
            val: val,
            hash: hash,
            from_new: 1
        });
        Tickets.setFAQclicked(id, hash, 1, true);
        hide('tickets_faq_urgent_links' + id);
        if (val > 0) {
            show('tickets_faq_useful' + id);
            slideUp('tickets_new_wrap', 450);
        } else {
            show('tickets_faq_unuseful' + id);
        }
        return false;
    },
    cancelRateFAQUrgent: function(id, val, hash) {
        if (!vk.id) return false;
        ajax.post('support', {
            act: 'faq_rate',
            faq_id: id,
            val: val,
            cancel: 1,
            hash: hash
        });
        hide('tickets_faq_useful' + id, 'tickets_faq_unuseful' + id);
        show('tickets_faq_urgent_links' + id);
        var form = ge('tickets_new_wrap');
        if (!isVisible(form)) {
            slideDown(form, 500);
        }
        return false;
    },
    showAverageTime: function(time, confirmCallback) {
        if (cur.timeShown) {
            Tickets.toggleDetailedForm();
            return;
        }
        var msg = getLang('support_wait_message')
            .replace(/\{time\}/g, time) + '<div class="tickets_wait_img"><img src="/images/pics/support_wait.png" /></div>';
        var box = showFastBox({
            title: getLang('support_average_wait_time'),
            width: 430,
            dark: true,
            bodyStyle: 'padding: 20px; line-height: 160%;'
        }, msg, getLang('support_ask_question'), function() {
            box.hide();
            cur.timeShown = true;
            confirmCallback();
        }, getLang('support_back_to_faq'));
    },
    toggleDetailedForm: function(force) {
        var title = ge('tickets_title');
        toggleClass(ge('tickets_content'), 'detailed');
        if (isVisible('tickets_detailed_form')) {
            title.setAttribute('placeholder', cur.lang.placeholder_title);
            removeClass(ge('tickets_search_reset'), 'shown');
            if (force) ge('tickets_text')
                .focus();
        } else {
            title.setAttribute('placeholder', cur.lang.placeholder_default);
            var str = trim(ge('tickets_title')
                .value);
            if (str) {
                addClass(ge('tickets_search_reset'), 'shown');
            }
            cur.toggleCanceled = true;
            delete cur.toggled;
            Tickets.searchFAQ(str);
            title.focus();
        }
        placeholderSetup(ge('tickets_title'), {
            back: true,
            reload: true
        });
    },

    getSearchQuery: function() {
        var input = ge('tickets_title') || ge('faq_search_form__title');
        return input ? input.value : '';
    },

    getFormQuery: function(act, ask) {
        var q = {
            0: 'support',
            act: act,
            title: Tickets.getSearchQuery()
        };
        if (ask) q['ask'] = 1;
        return q;
    },

    switchToPayForm: function(event, ask) {
        lockButton('tickets_create_pay');
        return nav.go(Tickets.getFormQuery('new_pay', ask), event);
    },

    switchToAdsForm: function(event, ask) {
        lockButton('tickets_create_ads');
        return nav.go(Tickets.getFormQuery('new_ads', ask), event);
    },

    switchToNameForm: function(event, ask) {
        lockButton('tickets_create_name');
        return nav.go(Tickets.getFormQuery('new_name', ask), event);
    },

    switchToApiForm: function(event, ask) {
        lockButton('tickets_create_api');
        return nav.go(Tickets.getFormQuery('new_api', ask), event);
    },

    switchToMobileForm: function(event, ask) {
        lockButton('tickets_create_mobile');
        return nav.go(Tickets.getFormQuery('new_mobile', ask), event);
    },

    updateFAQ: function(e, obj) {
        clearTimeout(cur.faqTimeout);
        cur.faqTimeout = setTimeout((function() {
                var origStr = obj.value,
                    str = trim(origStr),
                    strLow = str.toLowerCase(),
                    words = str.split(' '),
                    textInput = ge('tickets_text');

                if (origStr.length >= 70 && textInput && !textInput.value && !cur.flood) {
                    if (!isVisible('tickets_detailed_form')) Tickets.toggleDetailedForm();
                    obj.value = '';
                    textInput.focus();
                    textInput.value = origStr;
                }
                if (isVisible('tickets_detailed_form')) {
                    var bl = ge('tickets_redesign_block');
                    if (!cur.ignoreNewDesign && bl && !isVisible(bl) && strLow.indexOf('��������') != -1 || (strLow.indexOf('������') != -1 && (strLow.indexOf(
                            '�����') != -1 || strLow.indexOf('��������') != -1 || strLow.indexOf('����������') != -1))) {
                        slideDown(bl, 200);
                        //hide('tickets_detailed_form');
                    }
                    return;
                }
                if (str == cur.searchStr && (words.length < 4 || words.length == 4 && origStr[origStr.length - 1] != ' ')) {
                    return;
                }
                if (str) {
                    addClass(ge('tickets_search_reset'), 'shown');
                } else {
                    removeClass(ge('tickets_search_reset'), 'shown');
                }
                cur.searchStr = str;
                clearTimeout(cur.searchFAQTimeout);
                cur.searchFAQTimeout = setTimeout((function() {
                        Tickets.searchFAQ(cur.searchStr);
                    })
                    .bind(this), 300);

                if (!browser.mobile) scrollToTop();
            })
            .bind(this), 10);
    },
    setNewDesign: function(btn, hash) {
        ajax.post('support', {
            act: 'set_new_design',
            hash: hash
        }, {
            showProgress: lockButton.pbind(btn),
            hideProgress: unlockButton.pbind(btn)
        });
    },
    searchFAQ: function(val) {
        if (val[val.length - 1] == ' ') {
            val[val.length - 1] = '_';
        }
        addClass(ge('tickets_search'), 'loading');
        setStyle(ge('tickets_search_reset'), {
            opacity: .6
        });
        var query = {
            act: 'get_faq',
            q: val,
            from: nav.objLoc.act
        };
        if (nav.objLoc.gid) query.gid = nav.objLoc.gid;
        if (nav.objLoc.app_id) query.app_id = nav.objLoc.app_id;
        if (nav.objLoc.union_id) query.union_id = nav.objLoc.union_id;
        if (cur.tlmd && cur.showAll) {
            delete cur.showAll;
            query.show_all = 1;
            if (cur.from_ads) {
                query.from = 'ads';
            }
        }
        ajax.post('support', query, {
            cache: 1,
            hideProgress: removeClass.pbind('tickets_search', 'loading'),
            onDone: function(cont, button) {
                var origStr = ge('tickets_title')
                    .value,
                    words = trim(origStr)
                    .split(' '),
                    needToggle = false;
                if (!cur.toggleCanceled && (words.length > 4 || words.length == 4 && origStr[origStr.length - 1] == ' ') && !cur.flood) needToggle = true;
                if (cont) {
                    ge('tickets_faq_list')
                        .innerHTML = ce('div', {
                            innerHTML: cont
                        })
                        .firstChild.innerHTML;
                } else {
                    if (button) ge('tickets_faq_button')
                        .innerHTML = button;
                    if (needToggle) {
                        cur.toggled = true;
                        Tickets.toggleDetailedForm();
                    }
                }
                if (cur.tlmd) {
                    if (val) {
                        extend(nav.objLoc, {
                            q: val
                        });
                    } else {
                        delete nav.objLoc.q;
                    }
                    if (nav.objLoc.act == 'faq') {
                        var title = val ? val : getLang('support_page_title');
                        if (!vk.id) {
                            title += ' | ' + getLang('global_vkontakte');
                        }
                        document.title = title;
                    }
                    if (cont) {
                        cur.faqRowsOpened = false;
                        removeClass(ge('faq_toggle_all'), 'shown');
                    }
                    nav.setLoc(nav.objLoc);
                }
            }
        });
    },

    clearSearch: function(el, event) {
        var field = ge('tickets_title');
        setStyle(el, {
            opacity: .6
        });
        field.value = '';
        ge('tickets_title')
            .focus();
        Tickets.updateFAQ(event, field);
    },
    checkOver: function(el, mid) {
        el.firstChild.className = cur.checkedTickets[mid] ? 'over_checked' : 'over';
        showTooltip(el, {
            text: cur.lang.take_question,
            showdt: 200,
            shift: [-20, -20, 0]
        })
    },
    checkOut: function(el, mid) {
        el.firstChild.className = cur.checkedTickets[mid] ? 'checked' : '';
    },
    updateChecked: function() {
        if (ge('tickets_search_options')) {
            var tickets = [];
            each(cur.checkedTickets, function(i, v) {
                tickets.push(i)
            });
            var c = tickets.length;
            if (c) {
                hide('tickets_all_search');
                ge('t_n_marked')
                    .innerHTML = langNumeric(c, cur.lang.x_tickets_checked, true);
                show('tickets_all_selected');
            } else {
                show('tickets_all_search');
                hide('tickets_all_selected');
            }
        }
    },
    checkChange: function(el, mid) {
        if (cur.checkedTickets[mid]) {
            delete cur.checkedTickets[mid];
            el.firstChild.className = 'over';
        } else {
            cur.checkedTickets[mid] = true;
            el.firstChild.className = 'over_checked';
        }
        this.updateChecked();
    },
    saveDraft: function(ticket_id, evType) {
        var txt = ge('tickets_reply');
        if (browser.mobile || !txt || txt.disabled || !cur.canUseDrafts) return;

        var message = val(txt),
            data = {
                txt: trim(message),
                medias: []
            },
            m = (cur.ticketsNewMedia || {})
            .chosenMedias || [];

        for (var i = 0, l = m.length; i < l; ++i) {
            if (m[i]) data.medias.push([m[i][0], m[i][1]]);
        }
        if (!data.medias.length && !data.txt.length) {
            data = false;
        }
        ls.set('helpdesk_draft' + vk.id + '_' + ticket_id, data);

        if (txt && cur.ticketsNewMedia && (evType == 'paste' || evType == 'keyup')) {
            cur.ticketsNewMedia.checkMessageURLs(message, evType != 'keyup');
        }
    },
    listUpdateSearch: function(e, obj) {
        clearTimeout(cur.faqTimeout);
        if (cur.faqSearchBlocked) {
            return;
        }
        cur.faqTimeout = setTimeout((function() {
                var origStr = obj.value,
                    str = trim(origStr),
                    words = str.split(' ');

                if (str == cur.listSearchStr && (words.length < 4 || words.length == 4 && origStr[origStr.length - 1] != ' ')) {
                    return;
                }
                if (str.length > 0 && str.length < 3) {
                    return;
                }
                if (str.length > 70 && cur.askQuestion.permission > 0) {
                    cur.faqSearchBlocked = true;
                    addClass(ge('faq_search_form'), 'loading');
                    nav.go('support?act=new&from=t&title=' + encodeURIComponent(str));
                    return;
                }

                if (str) {
                    addClass(ge('tickets_search_reset'), 'shown');
                } else {
                    removeClass(ge('tickets_search_reset'), 'shown');
                }
                cur.listSearchStr = str;
                clearTimeout(cur.searchFAQTimeout);
                cur.searchFAQTimeout = setTimeout((function() {
                        Tickets.listSearch(cur.listSearchStr);
                    })
                    .bind(this), 300);

                if (!browser.mobile) scrollToTop();
            })
            .bind(this), 10);
    },

    listSearch: function(v) {

        addClass(ge('faq_search_form'), 'loading');
        setStyle(ge('tickets_search_reset'), {
            opacity: .6
        });

        var query = {
            act: 'load_faq_list',
            q: v
        };

        clearTimeout(cur.searchFAQStatTimeout);
        ajax.post('support', query, {
            cache: 1,
            onDone: function(content, showButton, altButtonId, saveSearchHash, clickedData, showNote) {
                var qlist = ge('help_table_questions_l'),
                    updateLoc = true;
                removeClass(ge('faq_search_form'), 'loading');
                toggle('help_table_too_simple_query', showNote);

                if (content == '') {
                    var valAdded = (v.indexOf(cur.listPrevSearchStr) != -1 || !cur.listPrevSearchStr),
                        valRemoved = (cur.listPrevSearchStr.indexOf(v) != -1);
                    if (!valAdded && !valRemoved || Tickets.listNotFoundVisible() || cur.listPrevSearchStr.length < 4) {
                        Tickets.listShowNotFound(v);
                    } else {
                        updateLoc = false;
                        toggle('tickets_unuseful', v.trim()
                            .indexOf(' ') != -1 && geByClass('help_table_question', 'help_table_questions_l')
                            .length > 1);
                        var repl = ge('help_table_not_found_replaced');
                        if (!isVisible(repl)) {
                            show(repl);
                            ge('help_table_not_found_replaced__prev_query')
                                .innerHTML = clean(cur.listPrevSearchStr);
                        }
                        ge('help_table_not_found_replaced__query')
                            .innerHTML = clean(v);
                    }
                } else {
                    hide('help_table_not_found_replaced');
                    Tickets.listHideNotFound();
                    qlist.innerHTML = content;
                    Tickets.listSetTitle(getLang(v ? 'support_list_search_result_title' : 'support_list_popular_questions'));
                    Tickets.listToggleUnusefulButton(showButton);
                    Tickets.listShowAltButton(altButtonId);
                    if (v == '') {
                        addClass(ge('help_table_category_top'), 'help_table_categories__a_sel');
                    }
                }

                Tickets.listOpenFAQs();

                if (updateLoc) {
                    if (v) {
                        Tickets.listDiselectCategory();
                    }
                    var obj = {
                        act: 'faqs',
                        0: 'support'
                    };
                    if (v) {
                        obj['q'] = v;
                    }
                    nav.setLoc(obj);
                }
                cur.listPrevSearchStr = v;

                if (v != '' && ge('faq_search_form__title')
                    .tt) {
                    ge('faq_search_form__title')
                        .tt.hide();
                }

                if (saveSearchHash) {
                    cur.searchFAQStatTimeout = setTimeout(function() {
                        ajax.post('support', {
                            act: 'save_last_search',
                            hash: saveSearchHash
                        });
                    }, 3000);
                }

                if (clickedData) {
                    var p = clickedData.split('|');
                    Tickets.setFAQclicked(p[0], p[1], 1, false);
                }
            },
            onFail: function() {
                removeClass(ge('tickets_search'), 'loading');
            }
        });
    },
    listToggleQuestion: function(e, id, hash) {
        if (checkEvent(e)) {
            return true;
        }
        var question = e.target.parentNode;
        var ans = geByClass1('help_table_question__ans', question);

        if (isVisible(ans)) {
            removeClass(question, 'help_table_question_visible');
            slideUp(ans, 200);
            Tickets.cancelFAQclicked(id);
        } else {
            addClass(question, 'help_table_question_visible');
            slideDown(ans, 200);
            Tickets.setFAQclicked(id, hash, 1, false);
        }
        return false;
    },
    listToggleUnusefulButton: function(v) {
        toggle(ge('tickets_unuseful'), v);
    },
    listShowAltButton: function(altButtonId) {
        each(geByClass('secondary', ge('help_table_questions_btn')), function(i, e) {
            if (altButtonId == '' || e.id != altButtonId) {
                hide(e);
            } else {
                show(e);
            }
        });
    },
    goToForm: function(from_faq_id, from) {
        var urlParams = '';
        if (from_faq_id) {
            urlParams += '&id=' + from_faq_id;
        } else {
            var titleInput = ge('faq_search_form__title'),
                title = '';
            if (titleInput) {
                title = titleInput.value.trim();
                if (title) {
                    urlParams += '&title=' + encodeURIComponent(title);
                }
            }
        }
        if (from) {
            urlParams += '&from=' + from;
        }
        nav.go('support?act=new' + urlParams);
        return false;
    },
    goToList: function(categoryId, questionId, evt) {
        if (evt !== null && checkEvent(evt)) {
            return true;
        }

        var e = Tickets.listSelectCategory(categoryId, true);
        var query = {
            act: 'load_faq_list'
        };
        if (categoryId != 'top') {
            query['c'] = categoryId;
        }

        ajax.post('support', query, {
            cache: 1,
            onDone: function(content, showButton, altButtonId, saveSearchHash, clickedData, showNote) {
                hide('help_table_not_found_replaced', 'help_table_too_simple_query');
                Tickets.listHideNotFound();
                Tickets.listToggleUnusefulButton(showButton);
                Tickets.listClearSearchInput();
                Tickets.listOpenFAQs();

                Tickets.listRemoveCategoryLoading();
                Tickets.listSetTitle(e.innerHTML);
                Tickets.listShowAltButton(altButtonId);

                var obj = {
                    act: 'faqs'
                };
                obj[0] = 'support';
                if (categoryId != 'top') {
                    obj['c'] = categoryId;
                }
                if (questionId) {
                    obj['id'] = questionId;
                }
                nav.setLoc(obj);

                ge('help_table_questions_l')
                    .innerHTML = content;
                if (questionId) {
                    Tickets.listScrollToQuestion(questionId);
                    var p = clickedData.split('|');
                    Tickets.setFAQclicked(questionId, p[1], 1, false);
                } else {
                    scrollToY(0, 200);
                }
            }
        });
        return false;
    },
    listScrollToQuestion: function(questionId) {
        var question = null;
        if (questionId) {
            question = ge('help_table_question_' + questionId);
        }
        if (question) {
            scrollToY(getXY(question)[1]);
            if (!hasClass(question, 'help_table_question_visible')) {
                addClass(question, 'help_table_question_visible');
            }
            var ans = geByClass1('help_table_question__ans', question);
            if (!isVisible(ans)) {
                show(ans);
            }
        }
    },
    listClearSearchInput: function() {
        val('faq_search_form__title', '');
        removeClass(ge('tickets_search_reset'), 'shown');
    },
    listClearSearch: function(el, event) {
        var field = ge('faq_search_form__title');
        setStyle(el, {
            opacity: .6
        });
        field.value = '';
        ge('faq_search_form__title')
            .focus();
        if (nav.objLoc['act'] == 'faqs') {
            Tickets.listUpdateSearch(event, field);
        } else {
            removeClass(el, 'shown');
        }
    },
    listSelectCategory: function(categoryId, add_loading) {
        each(geByClass('help_table_categories__a_sel', ge('help_table_categories')), function(i, v) {
            if ('help_table_category_' + categoryId != v.id) {
                removeClass(v, 'help_table_categories__a_sel');
            }
        });
        var e = ge('help_table_category_' + categoryId);
        addClass(e, 'help_table_categories__a_sel');
        if (add_loading) {
            addClass(e, 'loading');
        }
        return e;
    },
    listDiselectCategory: function() {
        each(geByClass('help_table_categories__a', ge('help_table_categories')), function(i, v) {
            removeClass(v, 'help_table_categories__a_sel');
        });
    },
    listRemoveCategoryLoading: function() {
        each(geByClass('loading', ge('help_table_categories')), function(i, v) {
            removeClass(v, 'loading');
        });
    },
    listSetTitle: function(title) {
        var e = ge('help_table_questions__title');
        if (title) {
            show(e);
            e.innerHTML = title;
        } else {
            hide(e);
        }
    },
    listOpenFAQs: function() {
        hide(ge('help_tiles'));
        show(ge('help_faqs'));
        removeClass(ge('help_tab'), 'active_link');
        addClass(ge('faqs_tab'), 'active_link');
    },
    listOpenTiles: function() {
        show(ge('help_tiles'));
        hide(ge('help_faqs'));
        addClass(ge('help_tab'), 'active_link');
        removeClass(ge('faqs_tab'), 'active_link');
        nav.setLoc({
            0: 'support',
            act: 'home'
        });

        Tickets.listClearSearchInput();
        return false;
    },
    tryAskQuestion: function(callback) {
        var s = 2;
        if (cur.askQuestion) {
            s = cur.askQuestion.permission;
        }
        if (!s) {
            setTimeout(showFastBox({
                    dark: 1,
                    bodyStyle: 'line-height: 160%;',
                    title: getLang('global_error')
                }, getLang('support_flood_error'))
                .hide, 4000);
        } else if (s == 1) {
            Tickets.showAverageTime(cur.askQuestion.time, callback);
            return false;
        } else {
            callback();
        }
        return false;
    },
    listNotFoundVisible: function() {
        return hasClass('help_table_questions', 'help_table_questions_not_found');
    },
    listHideNotFound: function() {
        removeClass('help_table_questions', 'help_table_questions_not_found');
    },
    listShowNotFound: function(query) {
        addClass('help_table_questions', 'help_table_questions_not_found');
        ge('help_table_not_found__query')
            .innerHTML = clean(query);
        var btn = ge('help_table_not_found__btn');
        if (!isVisible(btn) && query.trim()
            .indexOf(' ') != -1) {
            show(btn);
        }
    },
    closeMobileNotice: function(hash) {
        slideUp('tickets_mobile_notice', 200);
        ajax.post('support', {
            act: 'hide_mobile_notice',
            hash: hash
        });
    },
    listClearCache: function() {
        var obj = nav.objLoc;
        obj['cc'] = 1;
        nav.go(obj);
    },
    storeOutdatedLeft: function(ticket_id) {
        ls.set('support_outdated_left', {
            id: ticket_id,
            ts: Math.floor((new Date())
                .getTime() / 1000)
        });
        console.log('Win');
    },
    _eof: 1
};
try {
    stManager.done('tickets.js');
} catch (e) {}
