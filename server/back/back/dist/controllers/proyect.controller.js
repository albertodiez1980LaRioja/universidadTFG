"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProject = createProject;

function createProject(req, res) {
  console.log(req.body);
  res.send('received');
}