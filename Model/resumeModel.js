const mongoose = require("mongoose");

let resumeSchema = mongoose.Schema({
    skinId: {
        type:String, required: true
    },
    skinPath:{
        type:String,required:true
    },
    userDetails:{
        type:String,required:true
    },
    userId:{
        type:String,required:true
    }
})
let resumeModel = mongoose.model("Resumes",resumeSchema);
module.exports.resumeModel = resumeModel;