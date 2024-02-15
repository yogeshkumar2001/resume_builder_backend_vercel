const route  = require('express').Router();
const controller = require("../Controller/index");

route.get("/test",controller.test)
module.exports  = route;