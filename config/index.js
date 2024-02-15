const mongoose = require("mongoose");

async function connectDB(){
    try{
        let connect = await mongoose.connect(process.env.DB_URL);
        console.log("connectedd");
    }
    catch(error){
        console.log(error)
    }
}
module.exports.connectDB = connectDB;