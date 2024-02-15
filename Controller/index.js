const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
const { userModel } = require("../Model/userModel");
const { resumeModel } = require("../Model/resumeModel");
const { OAuth2Client } = require('google-auth-library');
dotenv.config()

const CLIENT_ID = process.env.GOOGLE_PRIVATE_KEY;
const client = new OAuth2Client(CLIENT_ID);

exports.test = async (req, res) => {
    return res.json({
        message: "done",
        status: 200
    })
}
exports.createUser = async (req, res) => {
    try {
        const userData = req.body.data; // Use provided userDataObj or fallback to req.body.data
        const userObj = await userModel.create(userData);
        res.json({
            message: "User created successfully",
            data: userObj,
            status: 200
        })
    }
    catch (error) {
        res.json({
            error: error,
            message: "failed to create user",
            status: 400
        })
    }
}
exports.getAllUser = async (req, res) => {
    try {
        let users = await userModel.find({});
        //    let is =  user[0]._id.toString();
        res.json({
            message: "Success",
            status: 200,
            data: users
        })
    } catch (error) {
        res.json({
            message: "failed to get all users",
            status: 400,
            error: error
        })
    }
}
exports.getUsersById = async (req, res) => {
    try {
        let { id } = req.params
        let userObj = await userModel.findById(id);
        res.json({
            message: "Success",
            data: userObj,
            status: 200
        })
    } catch (error) {
        res.json({
            message: "failed to get user by id ",
            error: error,
            status: 400
        })
    }
}



exports.updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let reqData = req.body;
        let updatedUserObj = await userModel.findByIdAndUpdate(id, reqData, { new: true });
        res.json({
            message: "user updated successfully",
            data: updatedUserObj,
            status: 200
        })
    }
    catch (error) {
        res.json({
            message: "failed to updated user",
            error: error,
            status: 400
        })
    }
}
exports.deleteUserById = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedObj = await userModel.findByIdAndDelete(id);
        res.json({
            message: "Success",
            data: deletedObj,
            status: 200
        })
    }
    catch (error) {
        res.json({
            message: "error",
            error: error,
            status: 400
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body.data;
        let user = await userModel.findOne({ email: email }).exec();
        if (user && user.password == password) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '120s' })
            res.json({
                data: user,
                message: "user logged in successfully",
                status: 200,
                token: token
            })
        } else {
            res.json({
                data: null,
                message: "user failed to log in",
                status: 400
            })
        }
    }
    catch (error) {
        res.json({
            error: error,
            message: "user failed to log in",
            status: 400
        })
    }
}

exports.verifyUserToken = async (req, res) => {
    try {
        const { token } = req.body;
        const verify = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

        res.json({
            data: verify.userId,
            message: "token verify successfull",
            status: 200
        })
    }
    catch (error) {
        res.json({
            error: error,
            message: "token verify failed",
            status: 400
        })
    }
}

//resume create
exports.saveResume = async (req, res) => {
    try {
        let data = req.body.data.Data;
        let resumeObj = await resumeModel.create(data);
        if (resumeObj) {
            return res.json({
                data: resumeObj,
                message: "resume saved successfully",
                status: 200
            })
        }
    } catch (error) {
        return res.json({
            error: error,
            message: "failed to save resume",
            status: 400
        })
    }
}
exports.deleteResumeByid = async(req, res)=>{
        try{
            let id = req.params.id;
            let deletedObj = await resumeModel.findByIdAndDelete(id);
            if(deletedObj){
                res.status(200).json({
                    data:deletedObj,
                    message:"Resume deleted successfully",
                    status:200
                })
            }
        }catch(error){
            res.status(200).json({
                error:error,
                message:"Resume deletion failed",
                status:400
            })
        }
}
exports.getResumeById = async (req, res) => {
    try {
        const { resumeId, userId } = req.query;
        let resumeObj = null
        if (resumeId) {
            resumeObj = await resumeModel.findById(resumeId);
        } else if (userId) {
            resumeObj = await resumeModel.find({ userId: userId })
        } else {
            // Handle the case where neither resumeId nor userId is provided
            return res.status(400).json({
                message: "Either resumeId or userId must be provided",
            });
        }

        if (resumeObj) {
            return res.json({
                data: resumeObj,
                message: "Successfully get resume",
                status: 200,
            });
        } else {
            return res.json({
                message: "Resume not found",
                status: 404,
            });
        }
    } catch (error) {
        return res.json({
            error: error.message,
            message: "Failed to get resume",
            status: 400,
        });
    }
};
async function createUserByGoogle(userData) {
    try {
        const userObj = await userModel.create(userData);
        if(userObj.email){
            return {
                message: "user created successfully",
                data: userObj,
                status: 200
            }
        }else{
            return {
                error: "error",
                message: "failed to create user",
                status: 400
            }
        }
    }
    catch (error) {
        return {
            error: error,
            message: "failed to create user",
            status: 400
        }
    }
}
exports.googleUserVerify = async (req, res) => {
    try {
        const { idToken } = req.body.data;
        // Verify the Google ID Token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: CLIENT_ID,
        });

        const payload = await ticket.getPayload();
        console.log(payload)
        if (payload.email_verified) {
            let userEmailExists = await userModel.findOne({ email: payload.email });

            if (userEmailExists) {
                return res.json({
                    data: userEmailExists,
                    status: 200,
                    message: "Login user Successfully"
                });
            } else {
                let userObj = {
                    email: payload.email,
                    name: payload.name,
                    GAuthUser: true,
                    imgUrl:payload.picture
                };
                console.log(userObj)
                try{
                    let userData = await createUserByGoogle(userObj);
                    console.log(userData)
                    if (userData.data.email) {
                        return res.json({
                            data: userData,
                            status: 200,
                            message: "Login and created user Successfully"
                        });
                } 
            }catch(error) {
                    return res.status(400).json({
                        status: 400,
                        error: "Failed to create user"
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error in googleUserVerify:", error);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error"
        });
    }
};