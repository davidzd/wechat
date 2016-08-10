/**
 * The MIT License
 * Copyright (c) 2014 Essoduke Chang. http://essoduke.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * jQuery TWzipcode 台灣郵遞區號 jQuery 擴充套件
 * 輕鬆地建立多組台灣郵遞區號下拉清單，讀取快速、完全不需使用資料庫。
 *
 * @author Essoduke Chang
 * @see http://app.essoduke.org/twzipcode/
 * @version 1.6.7
 *
 * [Changelog]
 * 恢復 detect(bool) 參數的支援，可設置是否自動讀取用戶的位置（瀏覽器需 GeoLocation API 支援）
 *
 * Last Modified 2014.08.29.143917'楊梅區':'222','平鎮區':'sss'
 */
;(function ($, window, undefined) {

    'use strict';

    // Zipcode JSON data
    var data = regionData;/*{
        '台北市': {'中正區': '100', '大同區': '103', '中山區': '104', '松山區': '105', '大安區': '106', '萬華區': '108', '信義區': '110', '士林區': '111', '北投區': '112', '內湖區': '114', '南港區': '115', '文山區': '116'},
        '新北市': {
            '中和區': '235', '永和區': '234', '新莊區': '242', '新店區': '231', '蘆洲區': '247', '板橋區': '220',
            '土城區': '236', '三重區': '241', '五股區': '248', '淡水區': '251', '林口區': '244', '鶯歌區': '239',
            '汐止區': '221', '樹林區': '238', '泰山區': '243', '三峽區': '237',
          // '萬里區': '207', '金山區': '208','石碇區': '223',
          // '瑞芳區': '224', '平溪區': '226', '雙溪區': '227', '貢寮區': '228', '坪林區': '232',
          // '烏來區': '233', '八里區': '249', '三芝區': '252', '石門區': '253'
        },
        '桃園市': {'龜山區': '333','中壢區':'320','桃園區':'330','蘆竹區':'338','楊梅區':'326','平鎮區':'324'},
        '新竹市': {'東區': '300A', '北區': '300B', '香山區': '300C'
        },
        '新竹縣': {
          '竹北市': '302',
          // '湖口鄉': '303', '新豐鄉': '304', '新埔鎮': '305', '關西鎮': '306', '芎林鄉': '307',
          // '寶山鄉': '308', '五峰鄉': '311', '橫山鄉': '312', '尖石鄉': '313', '北埔鄉': '314',
          // '峨嵋鄉': '315'
        },
        '台中市':{
            '中區':'400','東區':'401','南區':'402','西區':'403','北區':'404',
            '北屯區':'406','西屯區':'407','南屯區':'408',
            '大里區':'412','潭子區':'427','大雅區':'428','太平區':'411','霧峰區':'413',
            '神岡區':'429','豐原區':'420',
        },
        // '基隆市':{
        //     '仁愛區':'200','信義區':'201','中正區':'202','中山區':'203','安樂區':'204','暖暖區':'205','七堵區':'206',
        // },
    };*/

    /**
     * _hasOwnProperty for compatibility IE
     * @param {Object} obj Object
     * @param {string} property Property name
     * @return {bool}
     * @version 2.4.3
     */
    function _hasOwnProperty (obj, property) {
        try {
            return !window.hasOwnProperty ?
                   Object.prototype.hasOwnProperty.call(obj, property.toString()) :
                   obj.hasOwnProperty(property.toString());
        } catch (ignore) {
        }
    }
    /**
     * twzipcode Constructor
     * @param {Object} container HTML element
     * @param {(Object|string)} options User settings
     * @constructor
     */
    function TWzipcode (container, options) {
        /**
         * Default settings
         * @type {Object}
         */
        var defaults = {
            'countyName': 'county',
            'countySel': '',
            'css': [],
            'detect': false,             // v1.6.7
            'districtName': 'district',
            'districtSel': '',
            'onCountySelect': null,      // v1.5
            'onDistrictSelect': null,    // v1.5
            'onZipcodeKeyUp': null,      // v1.5
            'readonly': false,
            'zipcodeName': 'zipcode',
            'zipcodeSel': '',
            'zipcodeIntoDistrict': false // v1.6.6
        };
        /**
         * DOM of selector
         * @type {Object}
         */
        this.container = $(container);
        /**
         * Merge the options
         * @type {Object}
         */
        this.options = $.extend({}, defaults, options);
        // initialize
        this.init();
    }
    /**
     * twzipcode prototype
     */
    TWzipcode.prototype = {

        VERSION: '1.6.7',

        /**
         * Method: Get all post data
         * @return {Object}
         */
        data: function () {
            var wrap = this.wrap;
            return _hasOwnProperty(data, wrap.county.val()) ? data[wrap.county.val()] : data;
        },

        /**
         * Method: Serialize the data
         * @return {string}
         */
        serialize: function () {
            var result = [],
                obj = {},
                ele = {},
                s = {};
            obj = this.container.find('select,input');
            if (obj.length) {
                obj.each(function () {
                    ele = $(this);
                    result.push(ele.attr('name') + '=' + ele.val());
                });
            } else {
                $(this).children().each(function () {
                    s = $(this);
                    result.push(s.attr('name') + '=' + s.val());
                });
            }
            return result.join('&');
        },

        /**
         * Method: Destroy the container.
         * @this {twzipcode}
         */
        destroy: function () {
            $.data(this.container.get(0), 'twzipcode', null);
            if (this.container.length) {
                return this.container.empty().off('change keyup blur');
            }
        },

        /**
         * Method: Reset the selected items to default.
         * @this {twzipcode}
         */
        reset: function (container, obj) {
            var self = this,
                wrap = self.wrap,
                county = {},
                list = {
                    'county': '<option value="">縣市</option>',
                    'district': '<option value="">鄉鎮市區</option>'
                },
                tpl = [];

            switch (obj) {
            case 'district':
                wrap.district.empty().html(list.district);
                break;
            default:
                wrap.county.empty().html(list.county);
                wrap.district.empty().html(list.district);
                for (county in data) {
                    if (_hasOwnProperty(data, county)) {
                        tpl.push('<option value="' + county + '">' + county + '</option>');
                    }
                }
                $(tpl.join('')).appendTo(wrap.county);
                break;
            }
            wrap.zipcode.val('');
        },

        /**
         * Binding the event of the elements
         * @this {twzipcode}
         */
        bindings: function () {

            var self = this,
                opts = self.options,
                wrap = self.wrap,
                dz   = '',
                dc   = '',
                dd   = '';

            // county
            wrap.county.on('change', function () {
                var val = $(this).val(),
                    district = {},
                    tpl = [];

                wrap.district.empty();

                if (val) {
                    if (true === opts.zipcodeIntoDistrict) {
                        for (district in data[val]) {
                            if (_hasOwnProperty(data[val], district)) {
                                tpl.push('<option value="' + district + '">');
                                tpl.push(data[val][district] + ' ' + district);
                                tpl.push('</option>');
                            }
                        }
                    } else {
                        for (district in data[val]) {
                            if (_hasOwnProperty(data[val], district)) {
                                tpl.push('<option value="' + district + '">');
                                tpl.push(district);
                                tpl.push('</option>');
                            }
                        }
                    }
                    wrap.district.append(tpl.join('')).trigger('change');
                } else {
                    wrap.county.find('option:first').prop('selected', true);
                    self.reset('district');
                }
                // County callback binding
                if ('function' === typeof opts.onCountySelect) {
                    opts.onCountySelect.call(this, wrap.county);
                }
            });
            // District
            wrap.district.on('change', function () {
                var val = $(this).val();
                if (wrap.county.val()) {
                    wrap.zipcode.val(data[wrap.county.val()][val]);
                }
                // District callback binding
                if ('function' === typeof opts.onDistrictSelect) {
                    opts.onDistrictSelect.call(this, wrap.district);
                }
            });
            // Zipcode
            wrap.zipcode.on('keyup blur', function () {
                var obj = $(this),
                    val = '',
                    i   = '',
                    j   = '';
                obj.val(obj.val().replace(/[^0-9]/g, ''));
                val = obj.val().toString();

                if (3 === val.length) {
                    for (i in data) {
                        if (_hasOwnProperty(data, i)) {
                            for (j in data[i]) {
                                if (_hasOwnProperty(data[i], j)) {
                                    if (val === data[i][j]) {
                                        wrap.county.val(i).trigger('change');
                                        wrap.district.val(j).trigger('change');
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                // Zipcode callback binding
                if ('function' === typeof opts.onZipcodeKeyUp) {
                    opts.onZipcodeKeyUp.call(this, wrap.zipcode);
                }
            });

            dz = undefined !== self.role.zipcode.data('value') ?
                 self.role.zipcode.data('value') :
                 opts.zipcodeSel;

            dc = undefined !== self.role.county.data('value') ?
                 self.role.county.data('value') :
                 (_hasOwnProperty(data, opts.countySel) ? opts.countySel : '');

            dd = undefined !== self.role.district.data('value') ?
                 self.role.district.data('value') :
                 opts.districtSel;

            // Default value
            if (dc) {
                self.wrap.county.val(dc).trigger('change');
                if (_hasOwnProperty(data[dc], dd)) {
                    self.wrap.district.val(dd).trigger('change');
                }
            }
            if (dz && 3 === dz.toString().length) {
                self.wrap.zipcode.val(dz).trigger('blur');
            }
        },

        /**
         * Geolocation detect
         * @this {twzipcode}
         */
        geoLocation: function () {
			var self = this,
                geolocation = navigator.geolocation,
                options = {
                    'maximumAge': 600000,
                    'timeout': 3000,
                    'enableHighAccuracy': false
                };

            if (!geolocation) {
                return;
            }

            geolocation.getCurrentPosition(
                function (loc) {
                    var latlng = {};
                    if (_hasOwnProperty(loc, 'coords') &&
                        _hasOwnProperty(loc.coords, 'latitude') &&
                        _hasOwnProperty(loc.coords, 'longitude')
                    ) {
                        latlng = [loc.coords.latitude, loc.coords.longitude];
                        $.getJSON(
                            '//maps.googleapis.com/maps/api/geocode/json',
                            {
                                'sensor' : false,
                                'address': latlng.join(',')
                            },
                            function (data) {
                                var postal = '';
                                if (data &&
                                    _hasOwnProperty(data, 'results') &&
                                    _hasOwnProperty(data.results[0], 'address_components') &&
                                    undefined !== data.results[0].address_components[0]
                                ) {
                                    postal = data.results[0]
                                                 .address_components[data.results[0].address_components.length - 1]
                                                 .long_name;
                                    if (postal) {
                                        self.wrap.zipcode.val(postal.toString()).trigger('blur');
                                    }
                                }
                            });
                    }
                },
                function (error) {
                    //console.error(error);
                },
                options
            );
        },

        /**
         * twzipcode Initialize
         * @this {twzipcode}
         */
        init: function () {

            var self = this,
                container = self.container,
                opts = self.options,
                role = {
                    county: container.find('[data-role=county]:first'),
                    district: container.find('[data-role=district]:first'),
                    zipcode: container.find('[data-role=zipcode]:first')
                },
                countyName = role.county.data('name') || opts.countyName,
                districtName = role.district.data('name') || opts.districtName,
                zipcodeName = role.zipcode.data('name') || opts.zipcodeName,
                readonly = role.zipcode.data('readonly') || opts.readonly;

            // Elements create
            $('<select/>')
                .attr('name', countyName)
                .addClass(role.county.data('style') || (undefined !== opts.css[0] ? opts.css[0] : ''))
                .appendTo(role.county.length ? role.county : container);

            $('<select/>')
                .attr('name', districtName)
                .addClass(role.district.data('style') || (undefined !== opts.css[1] ? opts.css[1] : ''))
                .appendTo(role.district.length ? role.district : container);

            $('<input/>')
                .attr({'type': 'text', 'name': zipcodeName})
                .prop('readonly', readonly)
                .addClass(role.zipcode.data('style') || (undefined !== opts.css[2] ? opts.css[2] : ''))
                .appendTo(role.zipcode.length ? role.zipcode : container);

            self.wrap = {
                'county': container.find('select[name="' + countyName + '"]:first'),
                'district': container.find('select[name="' + districtName + '"]:first'),
                'zipcode': container.find('input[type=text][name="' + zipcodeName + '"]:first')
            };

            if (true === opts.zipcodeIntoDistrict) {
                self.wrap.zipcode.hide();
            }

            self.role = role;
            // Reset the elements
            self.reset();
            // Elements events binding
            self.bindings();
            // Geolocation
            if (true === opts.detect) {
                self.geoLocation();
            }
        }
    };

    /**
     * jQuery twzipcode instance
     * @param {Object} options Plugin settings
     * @public
     */
    $.fn.twzipcode = function (options) {
        if ('string' === typeof options) {
            switch (options) {
            case 'data':
            case 'destroy':
            case 'reset':
            case 'serialize':
                var result = {},
                    instance = {};
                this.each(function () {
                    instance = $.data(this, 'twzipcode');
                    if (instance instanceof TWzipcode && 'function' === typeof instance[options]) {
                        result = instance[options].apply(instance, Array.prototype.slice.call(arguments, 1));
                    }
                });
                break;
            }
            return undefined !== result ? result : this;
        } else {
            return this.each(function () {
                if (!$.data(this, 'twzipcode')) {
                    $.data(this, 'twzipcode', new TWzipcode(this, options));
                }
            });
        }
    };

}(jQuery, window));
