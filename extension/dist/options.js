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
/******/ 	return __webpack_require__(__webpack_require__.s = 43);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
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
    }]);

    return OptionsHelper;
}();

exports.default = OptionsHelper;

/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(44);


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _OptionsHelper = __webpack_require__(3);

var _OptionsHelper2 = _interopRequireDefault(_OptionsHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

    var optionsHelper = new _OptionsHelper2.default();
    optionsHelper.getAll().then(function (options) {
        renderOptions(options);
    });

    function renderOptions(options) {
        document.getElementById('links_checker_timeout').value = options.links_checker_timeout;
        document.getElementById('links_checker_black_list').innerHTML = options.links_checker_black_list.join('\n');
    }

    function saveOptions() {
        var options = {
            links_checker_timeout: document.getElementById('links_checker_timeout').value * 1,
            links_checker_black_list: document.getElementById('links_checker_black_list').value.split('\n')
        };

        optionsHelper.setAll(options).then(function () {
            alert('Save success');
        });
    }

    document.getElementById('save').addEventListener('click', function () {
        saveOptions();
    });

    document.querySelector('#myfile').onchange = function (e) {
        var files = this.files;
        var reader = new FileReader();

        reader.onload = function (e) {
            console.log(e.target.result);
        };

        reader.readAsText(files[0]);
    };
})();

/***/ })

/******/ });