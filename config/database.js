const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("DB Connected Succesfully"))
    .catch((error)=>{
        console.log("DB Connecting Issues");
        console.error(error);
        process.exit(1);
    })
};