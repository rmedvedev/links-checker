/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 57);
/******/ })
/************************************************************************/
/******/ ({

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OptionsHelper = __webpack_require__(4);

var _OptionsHelper2 = _interopRequireDefault(_OptionsHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinksChecker = function () {
    function LinksChecker() {
        _classCallCheck(this, LinksChecker);

        this.linksList = null;
        this.checkerIndex = null;
        this.optionsHelper = new _OptionsHelper2.default();
        this._options = null;
    }

    _createClass(LinksChecker, [{
        key: 'init',
        value: function init() {
            var $this = this;
            this._getOptions().then(function () {
                $this.linksList = $this._filterLinks($this._findLinks());
                chrome.runtime.sendMessage({
                    name: 'linksCount',
                    count: $this.linksList.length
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, {
        key: '_getOptions',
        value: function _getOptions() {
            var $this = this;
            return this.optionsHelper.getAll().then(function (options) {
                return $this._options = options;
            });
        }
    }, {
        key: 'getLinks',
        value: function getLinks() {
            return this.linksList;
        }
    }, {
        key: '_findLinks',
        value: function _findLinks() {
            var links = [];
            document.querySelectorAll('a').forEach(function (linkNode) {
                links.push({
                    domNode: linkNode,
                    status: null,
                    parsed_url: {
                        protocol: linkNode.protocol,
                        hostname: linkNode.hostname,
                        pathname: linkNode.pathname,
                        hash: linkNode.hash,
                        search: linkNode.search
                    }
                });
            });

            return links;
        }
    }, {
        key: '_filterLinks',
        value: function _filterLinks(links) {
            var $this = this;
            return links.filter(function (link) {
                return $this._options.links_checker_black_list.indexOf(link.domNode.href) === -1;
            });
        }
    }, {
        key: '_clearStyles',
        value: function _clearStyles() {
            this.linksList.forEach(function (link) {
                link.domNode.classList.remove('checker-link', 'checker-success', 'checker-error', 'checker-progress');
                link.domNode.classList.add('checker-link');
            });
        }
    }, {
        key: 'stopCheckLinks',
        value: function stopCheckLinks() {
            this.checkerIndex = null;
            console.log('Stop checking links.');
        }
    }, {
        key: 'checkLinks',
        value: function checkLinks() {
            var restart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (restart) {
                this.checkerIndex = 0;
                this._clearStyles();
                this.linksList.map(function (link) {
                    link.status = null;
                });
            }

            var link = this.linksList[this.checkerIndex];
            if (link) {
                link.domNode.classList.add('checker-progress');
                chrome.runtime.sendMessage({
                    name: 'checkLink',
                    link: link.domNode.href,
                    index: this.checkerIndex
                });
                this.checkerIndex++;
            } else {
                console.log('Stop checking links.');
            }
        }
    }, {
        key: 'checkLinksCallback',
        value: function checkLinksCallback(message) {
            if (this.checkerIndex !== null) {
                var css = 'checker-error',
                    color = 'red';
                if (message.status >= 200 && message.status < 300) {
                    css = 'checker-success';
                    color = '';
                }
                this.linksList[message.index].domNode.classList.remove('checker-success', 'checker-error', 'checker-progress');
                this.linksList[message.index].domNode.classList.add(css);

                console.log('%c' + this.linksList[message.index].domNode.href + ' - ' + message.status + ' ' + message.requestTime + 'ms', 'color:' + color);

                if (this.linksList[message.index].status === null) {
                    this.checkLinks();
                }

                this.linksList[message.index].status = message.status;
            }
        }
    }, {
        key: 'rescanTimeoutLinks',
        value: function rescanTimeoutLinks() {
            console.log('Rechecking timeout links.');
            for (var key in this.linksList) {
                if (this.linksList[key].status === 0 || this.linksList[key].status === 504) {
                    this.checkerIndex = 0;
                    chrome.runtime.sendMessage({
                        name: 'checkLink',
                        link: this.linksList[key].domNode.href,
                        index: key
                    });
                }
            }
        }
    }, {
        key: 'checkOne',
        value: function checkOne(link, callback) {
            var xhr = new XMLHttpRequest();

            var startTime = new Date().getTime();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                    var requestTime = new Date().getTime() - startTime;
                    callback(xhr.status, requestTime);
                    xhr.abort();
                }
            };

            xhr.onerror = function () {
                var requestTime = new Date().getTime() - startTime;
                callback(xhr.status, requestTime);
                xhr.abort();
            };

            xhr.ontimeout = function () {
                var requestTime = new Date().getTime() - startTime;
                callback(0, requestTime);
                xhr.abort();
            };

            if (this._options) {
                xhr.timeout = this._options.links_checker_timeout;
                xhr.open('GET', link);
                xhr.send();
            } else {
                this.optionsHelper.getAll().then(function (options) {
                    xhr.timeout = options.links_checker_timeout;
                    xhr.open('GET', link);
                    xhr.send();
                });
            }
        }
    }]);

    return LinksChecker;
}();

exports.default = LinksChecker;

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OptionsHelper = function () {
    function OptionsHelper() {
        _classCallCheck(this, OptionsHelper);

        this.LINKS_CHECKER_BLACK_LIST = 'links_checker_black_list';
        this.LINKS_CHECKER_TIMEOUT = 'links_checker_timeout';

        this.defaultOptions = {};
        this.defaultOptions[this.LINKS_CHECKER_BLACK_LIST] = [];
        this.defaultOptions[this.LINKS_CHECKER_TIMEOUT] = 30 * 1000;
    }

    _createClass(OptionsHelper, [{
        key: 'getAll',
        value: function getAll() {
            var $this = this;
            return new Promise(function (resolve) {
                chrome.storage.sync.get($this.defaultOptions, resolve);
            });
        }
    }, {
        key: 'setAll',
        value: function setAll(options) {
            return new Promise(function (resolve) {
                chrome.storage.sync.set(options, resolve);
            });
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            return new Promise(function (resolve) {
                chrome.storage.sync.set({ key: value }, resolve);
            });
        }
    }]);

    return OptionsHelper;
}();

exports.default = OptionsHelper;

/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(58);


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ContentModule = __webpack_require__(59);

var _ContentModule2 = _interopRequireDefault(_ContentModule);

var _ContentModule3 = __webpack_require__(61);

var _ContentModule4 = _interopRequireDefault(_ContentModule3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var linksCheckerModule = new _ContentModule2.default();
    var pageInfoModule = new _ContentModule4.default();

    chrome.runtime.onMessage.addListener(function (message) {
        linksCheckerModule.handle(message);
        pageInfoModule.handle(message);
    });

    pageInfoModule.handle({ name: 'init' });
})();

/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LinksChecker = __webpack_require__(24);

var _LinksChecker2 = _interopRequireDefault(_LinksChecker);

__webpack_require__(60);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentModule = function () {
    function ContentModule() {
        _classCallCheck(this, ContentModule);

        this.linksChecker = new _LinksChecker2.default();
        this.linksChecker.init();
    }

    _createClass(ContentModule, [{
        key: 'getLinks',
        value: function getLinks() {
            this.linksChecker.getLinks();
        }
    }, {
        key: 'handle',
        value: function handle(message) {
            switch (message.name) {
                case 'checkLinks':
                    this.linksChecker.checkLinks(true);
                    console.log('Start checking links.');
                    break;
                case 'checkingLinksCallback':
                    this.linksChecker.checkLinksCallback(message);
                    break;
                case 'stopCheckLinks':
                    this.linksChecker.stopCheckLinks();
                    break;
                case 'rescanTimeoutLinks':
                    this.linksChecker.rescanTimeoutLinks();
                    break;
            }
        }
    }]);

    return ContentModule;
}();

exports.default = ContentModule;

/***/ }),

/***/ 60:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PageInfoProvider = __webpack_require__(62);

var _PageInfoProvider2 = _interopRequireDefault(_PageInfoProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageInfoModule = function () {
    function PageInfoModule() {
        _classCallCheck(this, PageInfoModule);

        this.pageInfoProvider = new _PageInfoProvider2.default();
    }

    _createClass(PageInfoModule, [{
        key: 'handle',
        value: function handle(message) {
            switch (message.name) {
                case 'init':
                case 'getPageInfo':
                    chrome.runtime.sendMessage({
                        name: 'pageInfo',
                        pageInfo: this.pageInfoProvider.getInfo(),
                        cookies: this.pageInfoProvider.getCookies(),
                        metaTags: this.pageInfoProvider.getMetaTags()
                    });
                    break;
            }
        }
    }]);

    return PageInfoModule;
}();

exports.default = PageInfoModule;

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageInfoProvider = function () {
    function PageInfoProvider() {
        _classCallCheck(this, PageInfoProvider);
    }

    _createClass(PageInfoProvider, [{
        key: 'getInfo',


        //common info about page
        value: function getInfo() {
            var pageInfo = {};
            pageInfo.https = location.protocol === 'https:';
            pageInfo.title = document.title;
            pageInfo.host = location.hostname;
            pageInfo.path = location.pathname;
            pageInfo.query_string = location.search;
            pageInfo.url = location.href;

            return pageInfo;
        }
    }, {
        key: 'getCookies',


        //cookies
        value: function getCookies() {
            return document.cookie;
        }
    }, {
        key: 'getMetaTags',


        //array of page's meta tags
        value: function getMetaTags() {
            var metaTags = [];
            Array.from(document.getElementsByTagName('meta')).forEach(function (element) {
                metaTags.push(element.outerHTML);
            });

            return metaTags;
        }
    }]);

    return PageInfoProvider;
}();

exports.default = PageInfoProvider;

/***/ })

/******/ });