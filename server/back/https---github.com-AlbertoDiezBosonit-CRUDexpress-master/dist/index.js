"use strict";

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function main() {
  _app["default"].listen(3000);

  console.log('servidor levantado en el 3000');
}

;
main();