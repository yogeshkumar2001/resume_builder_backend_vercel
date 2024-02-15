const { createUser, getAllUser, getUsersById, updateUser, deleteUserById } = require("../Controller");

const userRoute = require("express").Router();
userRoute.post("/create", createUser);
userRoute.get("/getall", getAllUser);
userRoute.route("/:id").get(getUsersById).patch(updateUser).delete(deleteUserById);

module.exports.userRoute = userRoute;


