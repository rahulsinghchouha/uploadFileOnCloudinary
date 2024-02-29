const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }


});

//post model
fileSchema.post('save', async function(doc)
{
    try{
        console.log("DOC",doc);

        //transporter
        //Shift this configuration under config folder

        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,

            }
        });

        //send mail
        let info = await transporter.sendMail({
            from:`Hello - by Elon Musk`,
            to:doc.email,  //jo bhi hmne document mai email id send ki hai vo
            subject:"New File uploaded on Cloudinary ",
            html:`<h2> Hello Jee </h2> <p>File Uploaded view here: <a href="${doc.imageUrl}
            ">${doc.imageUrl}</a></p>`,
        })

        console.log("INFO --->",info);


    }catch(error)
    {
        console.error(error);

    }

}
)





//exports modules
const File = mongoose.model("File",fileSchema);
module.exports = File; 
