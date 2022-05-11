"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dist = require("sequelize");

var _database = require("../database/database");

var _Tasks = _interopRequireDefault(require("./Tasks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// importamos la cadena de conexion
var Proyect = _database.sequelize.define('Project', {
  id: {
    type: _dist.Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: _dist.Sequelize.TEXT
  },
  priority: {
    type: _dist.Sequelize.INTEGER
  },
  description: {
    type: _dist.Sequelize.TEXT
  },
  deliverydate: {
    type: _dist.Sequelize.DATE
  }
}, {
  timestamps: false
});

Proyect.hasMany(_Tasks["default"], {
  foreignKey: 'projectid',
  sourceKey: 'id'
}); // uno a varios

_Tasks["default"].belongsTo(Proyect, {
  foreignKey: 'projectid',
  sourceKey: 'id'
});

var _default = Proyect;
exports["default"] = _default;