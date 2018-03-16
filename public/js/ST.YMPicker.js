ST.YMPicker = $.createClass($.Widget.Control,
    function(_base) {
        var setting = {
            id: "",
            year: "",
            month: "",
            day: "",
            minYear: 1901,
            maxYear: 2050,
            btnClass: ["pre_no", "next_no"],
            temp: "common_monthpicker_temp"
        };
        return {
            init: function(ops) {
                var t = this;
                t.config = $.extend({},
                    setting);
                $.extend(t.config, ops);
                _base.init.call(t, zIdx);
                var c = t.config,
                    d = new Date();
                if (!c.year) c.year = d.getFullYear();
                if (!c.month) c.month = d.getMonth() + 1;
                if (!c.day) c.day = d.getDate();
                t.cid = c.id;
                var pos = $.getBound(t.cid),
                    zIdx = 100500;
                t.pos = pos;
                $(ST.JTE.fetch(c.temp).getFilled({
                    controlId: t.ctrlId,
                    year: c.year,
                    minYear:c.minYear,
                    month: c.month,
                    day: c.day,
                    pos: pos
                })).appendTo("body");
                t.Jid = $("#" + t.ctrlId).css({
                    width: pos.w,
                    height: pos.h,
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    background: "#fff",
                    "z-index": zIdx
                });
                t.Jid.click(function(e){
                    $.stopEvent(e);
                });
                t.$v = $("#YMP_V_" + t.ctrlId).bind("click", function(e) {
                        if (!t.$year.isShown) {
                            if (t._year >= c.maxYear) t._year -= 10;
                            ST.JTE.fetch("common_monthpicker_year_temp").toFill("YMP_Y_" + t.ctrlId, {
                                "cyear": c.year,
                                "minYear":c.minYear,
                                "year": t._year,
                                "a": 1
                            });
                            t.toggleYearPicker();
                            var y = t.getIntYears(t._year);
                            t._updateBtn(y);
                        }
                    });
                t.$month = $("#YMP_M_" + t.ctrlId).bind("click", function(e) {
                        var em = e.target;
                        if (em && em.tagName.contains(/^a$/i) || (em = em.parentNode, em.tagName.contains(/^a$/i))) {
                            var val = $(em).data("val");
                            if (!val) return;
                            t.$v.data("val", val);
                            t.toggleMonthPicker();
                        }
                    });
                t.$year = $("#YMP_Y_" + t.ctrlId).bind("click", function(e) {
                        var em = e.target;
                        if (em && em.tagName.contains(/^a$/i) || (em = em.parentNode, em.tagName.contains(/^a$/i))) {
                            var val = $(em).data("val");
                            if (!val) return;
                            t.$v.data("val", val);
                            t._year = val;
                            ST.JTE.fetch("common_monthpicker_month_temp").toFill("YMP_M_" + t.ctrlId, {
                                "cyear": c.year,
                                "year": t._year,
                                "month": c.month
                            });
                            t.toggleYearPicker();
                            t._updateBtn();
                        }
                    });
                $("#YMP_L_" + t.ctrlId).bind("click", function(e) {
                        t._turnL();
                    });
                $("#YMP_N_" + t.ctrlId).bind("click", function(e) {
                        t._turnN();
                    });
                delete t.init;
                return t;
            },
            _updateBtn: function(y) {
                var t = this,
                    c = t.config;
                if (!y) y = t._year;
                $("#YMP_L_" + t.ctrlId).toggleClass(c.btnClass[0], y <= c.minYear ? true: false);
                $("#YMP_N_" + t.ctrlId).toggleClass(c.btnClass[1], y >= c.maxYear ? true: false);
            },
            _turnL: function() {
                var t = this,
                    c = t.config,
                    y = t._year;
                if (t.$year.isShown) {
                    t._year -= 10;
                    if (t._year < c.minYear) t._year = c.minYear;
                    ST.JTE.fetch("common_monthpicker_year_temp").toFill("YMP_Y_" + t.ctrlId, {
                        "cyear": c.year,
                        "minYear":c.minYear,
                        "year": t._year,
                        "a": 1
                    });
                    y = t.getIntYears(t._year);
                    t.$v.text((y < c.minYear ? c.minYear: y) + "-" + (y + 11));
                    t._updateBtn(y);
                } else {
                    t._year -= 1;
                    if (t._year <= c.minYear) t._year = c.minYear;
                    ST.JTE.fetch("common_monthpicker_month_temp").toFill("YMP_M_" + t.ctrlId, {
                        "cyear": c.year,
                        "year": t._year,
                        "month": c.month
                    });
                    t.$v.text(t._year + "年");
                    t._updateBtn();
                }
            },
            _turnN: function() {
                var t = this,
                    c = t.config,
                    y = t._year;
                if (t.$year.isShown) {
                    t._year += 10;
                    if (t._year >= c.maxYear) t._year = y;
                    ST.JTE.fetch("common_monthpicker_year_temp").toFill("YMP_Y_" + t.ctrlId, {
                        "cyear": c.year,
                        "minYear":c.minYear,
                        "year": t._year,
                        "a": 1
                    });
                    y = t.getIntYears(t._year);
                    t.$v.text(y + "-" + (y + 11));
                    t._updateBtn(y + 11);
                } else {
                    t._year += 1;
                    if (t._year >= c.maxYear) t._year = c.maxYear;
                    ST.JTE.fetch("common_monthpicker_month_temp").toFill("YMP_M_" + t.ctrlId, {
                        "cyear": c.year,
                        "year": t._year,
                        "month": c.month
                    });
                    t.$v.text(t._year + "年");
                    t._updateBtn();
                }
            },
            getIntYears: function(year, fix) {
                if (!fix) fix = 1;
                var a, b = fix,
                    c;
                year = year.toString();
                while (fix > 0) {
                    c = Number(year.charAt(year.length - fix));
                    a = (fix > 1 ? (c == 0 ? 1 : c) : c) * Math.pow(10, fix - 1);
                    year = year - a;
                    year = year.toString();
                    fix--;
                }
                year = year - 1;
                return year;
            },
            updateText: function(flag) {
                var t = this,
                    c = t.config;
                var val = t.$v.data("val").toString().split("-");
                var year = Number(val[0]);
                var month = Number(val[1] || "");
                if (t.$year.isShown) {
                    var y = t.getIntYears(t._year || year);
                    t.$v.text((y < c.minYear ? c.minYear: y) + "-" + (y + 11));
                    t._month = month;
                } else {
                    t.$v.text(year + "年");
                }
                if (!t._year) t._year = c.year;
            },
            toggleYearPicker: function() {
                var t = this,
                    c = t.config,
                    s;
                if (t.$year.isShown) {
                    s = {
                        top: -t.pos.h
                    };
                    t.$year.isShown = false;
                } else {
                    s = {
                        top: "0px"
                    };
                    t.$year.isShown = true;
                }
                t.toggleMonthPicker();
                t.updateText();
                t.$year.stop().animate(s, 500, "swing");
            },
            toggleMonthPicker: function() {
                var t = this,
                    c = t.config,s,
                    fn;
                if (t.$month.isShown) {
                    s = {
                        top: -t.pos.h
                    };
                    if (!t.$year.isShown) {
                        fn = function() {
                            var args = {};
                            args = {
                                date: t.$v.data("val")
                            };
                            t.onSelected && t.onSelected(args);
                            if (!args.cancle) t.hide();
                        }
                    }
                    t.$month.isShown = false;
                } else {
                    s = {
                        top: "0px"
                    };
                    t.$month.isShown = true;
                }
                t.updateText();
                t.$month.stop().animate(s, 500, "swing", fn);
            },
            show: function(y, m) {
                var t = this,
                    c = t.config;
                t._year = y;
                t.$v.data("val", y + "-" + m);
                ST.JTE.fetch("common_monthpicker_month_temp").toFill("YMP_M_" + t.ctrlId, {
                    "cyear": c.year,
                    "year": t._year,
                    "month": c.month
                });
                t.toggleMonthPicker();
                t._updateBtn();
                t.onShow && t.onShow();
                _base.show.call(t);
            },
            dispos: function() {
                var t = this;
                delete t.Jid;
                delete t.$month;
                delete t.$year;
                delete t.$v;
            },
            onSelected: "",
            onShow:""
        }
    });
