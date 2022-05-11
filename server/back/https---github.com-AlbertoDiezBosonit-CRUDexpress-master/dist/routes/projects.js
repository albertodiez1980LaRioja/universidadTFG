"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _proyect = require("../controllers/proyect.controller");

var router = (0, _express.Router)();
router.get('/', _proyect.createProject); // el endpoint y el manejador
//router.post('',function(){}); // el endpoint y el manejador

var _default = router;
exports["default"] = _default;