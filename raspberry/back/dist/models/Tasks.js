"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dist = require("sequelize");

var _database = require("../database/database");

var Task = _database.sequelize.define('tasks', {
  id: {
    type: _dist.Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: _dist.Sequelize.TEXT
  },
  done: {
    type: _dist.Sequelize.BOOLEAN
  },
  projectid: {
    type: _dist.Sequelize.INTEGER
  }
}, {
  timestamps: false
});

var _default = Task;
exports["default"] = _default;