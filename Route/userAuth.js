const { loginUser, verifyUserToken, googleUserVerify } = require("../Controller");

let authRoute = require("express").Router();

authRoute.route("/").post(loginUser)
authRoute.route("/verify").post(verifyUserToken)
authRoute.post('/google-login', googleUserVerify);

module.exports.authRoute = authRoute;