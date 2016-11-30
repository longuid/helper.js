(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash'), require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash', 'jquery'], factory) :
  (factory((global.helper = global.helper || {}),global._,global.$));
}(this, (function (exports,_,$) { 'use strict';

var ___default = 'default' in _ ? _['default'] : _;
$ = 'default' in $ ? $['default'] : $;

/**
 * Created by Yinxiong on 2016/11/20.
 */

var noop = function () {};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var delay = function (fn, time) {
  return setTimeout(fn, time || 0);
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var queryString = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var go = function (url, isNewWindow) {
    var local = location,
        href = '';
    if (url == 'me') {
        href = local.href;
    } else if (/^#/.test(url)) {
        href = local.origin + local.pathname + url;
    } else {
        href = url;
    }
    if (!isNewWindow) {
        local.href = href;
    } else {
        window.open(href);
    }
    return local;
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var paramsEncode = function (obj) {
    var str = '';
    for (var key in obj) {
        if (str != '') {
            str += '&';
        }
        str += key + '=' + encodeURIComponent(obj[key]);
    }
    return str;
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var parseCode = function (content, defaultValue) {
    defaultValue = defaultValue || void 0;
    if (!content) {
        return defaultValue;
    }
    if (typeof content == 'string') {
        return content ? new Function('return ' + content)() : defaultValue;
    }
    return content;
};

/**
 * Created by Administrator on 2016/10/13.
 */
var validator = {
    required: {
        message: function message() {
            return 'required';
        },
        validate: function validate(val, required) {
            return !required ? true : ___default.isString(val) ? !!___default.trim(val) : ___default.isArray(val) || ___default.isObject(val) ? ___default.size(val) > 0 : true;
        }
    },
    maxlength: {
        message: function message() {
            return 'maxlength';
        },
        validate: function validate(val, num) {
            return ___default.isString(val) && val.length <= num;
        }
    },
    minlength: {
        message: function message() {
            return 'minlength';
        },
        validate: function validate(val, num) {
            return ___default.isString(val) && val.length >= num;
        }
    },
    max: {
        message: function message() {
            return 'max';
        },
        validate: function validate(val, num) {
            return validator.number(val, true) && +val <= num;
        }
    },
    min: {
        message: function message() {
            return 'min';
        },
        validate: function validate(val, num) {
            return validator.number(val, true) && +val >= num;
        }
    },
    number: {
        message: function message() {
            return 'must number';
        },
        validate: function validate(val, required) {
            return !required ? true : /^\d+(\.\d+)?$/.test(val);
        }
    },
    digits: {
        message: function message() {
            return 'must digits';
        },
        validate: function validate(val, required) {
            return !required ? true : /^\d+$/.test(val);
        }
    },
    range: {
        message: function message(condition) {
            return 'Must be between ' + condition[0] + ' and ' + condition[1];
        },
        validate: function validate(val, range) {
            return val.length >= range[0] && val.length <= range[1];
        }
    }
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var pending = 0;

/**
 *
 * @param elements
 * @param callback
 * @returns {Function}
 */
var documentClick = function (elements) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;


    var $document = $(document);

    var els = (!_.isArray(elements) ? [elements] : $.makeArray(elements)).map(function (element) {
        return element && element.jquery ? element[0] : element;
    });

    var len = els.length;

    var name = 'mousedown.clickDocumentHide' + pending++;

    $document.bind(name, function (e) {
        var target = e.target;
        var r = 0;
        var el = void 0;
        for (var i = 0; i < len; i++) {
            el = els[i];
            if (target != el && !$.contains(el, target)) {
                r++;
            } else {
                break;
            }
        }
        if (r == len) {
            callback(e, el);
        }
    });

    return function () {
        $document.unbind(name);
    };
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var lazyResize = function (options) {
    var timer = null;
    var isEnd = false;
    var $win = $(window);

    var setting = {
        name: 'scroll resize',
        init: true,
        end: noop,
        start: noop,
        delay: 50
    };

    if (_.isFunction(options)) {
        setting.end = options;
    } else {
        setting = Object.assign(setting, options);
    }

    $win.on(setting.name, function (e) {
        clearTimeout(timer);
        if (!isEnd) {
            isEnd = true;
            setting.start.call($win, e);
        }
        timer = delay(function () {
            isEnd = false;
            setting.end.call($win, e);
        }, setting.delay);
    });

    if (setting.init) {
        $win.trigger(setting.name.split(' ')[0]);
    }

    return function () {
        $win.off(setting.name);
    };
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var lazyLoad = function () {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$context = _ref.context,
        context = _ref$context === undefined ? null : _ref$context,
        _ref$height = _ref.height,
        height = _ref$height === undefined ? 0 : _ref$height;

    var $win = $(window);
    var _context = $(context);

    if (!_context.length) return;

    var pageTop = function pageTop() {
        return document.documentElement.clientHeight + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - height;
    };
    var imgLoad = function imgLoad() {
        _context.find('img[orgSrc]').each(function () {
            if ($(this).offset().top <= pageTop() && $(this).is(':visible')) {
                var orgSrc = this.getAttribute('orgSrc');
                this.setAttribute('src', orgSrc);
                this.removeAttribute('orgSrc');
            }
        });
    };
    $win.bind('lazyload', imgLoad);
    lazyResize('scroll.lazyload', imgLoad);
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var onAnimateEnd = function (el, fn) {
    var name = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    el.one(name, fn);
    return function () {
        el.unbind(name);
    };
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

var onTransitionEnd = function (el, fn) {
    var name = 'webkitTransitionEnd oTransitionEnd transitionend';
    el.one(name, fn);
    return function () {
        el.unbind(name);
    };
};

/**
 * Created by Yinxiong on 2016/11/20.
 */

exports.noop = noop;
exports.delay = delay;
exports.queryString = queryString;
exports.go = go;
exports.paramsEncode = paramsEncode;
exports.parseCode = parseCode;
exports.validator = validator;
exports.documentClick = documentClick;
exports.lazyLoad = lazyLoad;
exports.onAnimateEnd = onAnimateEnd;
exports.onTransitionEnd = onTransitionEnd;
exports.lazyResize = lazyResize;

Object.defineProperty(exports, '__esModule', { value: true });

})));