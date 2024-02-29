const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// localfileuploader -> handler function server ke andar ek location pr file upload krega

exports.localFileUpload = async (req, res) => {
    try {
        //fetch file from request
        const file = req.files.file;
        console.log("File aa gayi durga", file);

        //kis path pr file ko store krna hai server path
        //for split the name

        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH->", path);

        //hm kis path pr file ko move krna chahte hai  then agr err aaye to use handle krna 


        //add path to  the move function
        file.mv(path, (err) => {
            console.log(err);
        });
        //then we add the response 

        //create a succesfull response
        res.json({
            success: true,
            message: "Local file uploaded succesfully",
        });

    } catch (err) {
        console.log("Not able to upload file on server");
        console.log(err);
    }
}




//for check file supported

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

//upload file to cloudinary
async function uploadFileToCloudinary(file, folder, quality) {

    const options = { folder };
    console.log("temp file path", file.tempFilePath); //for temp file

    //jitni quality hme di hai us prakar se km kar denge
    if (quality) {
        options.quality = quality;

    }
    options.resource_type = "auto"; //auto means hm type nhi jante 
    return await cloudinary.uploader.upload(file.tempFilePath, options);

}


//image upload ka handler
exports.imageUpload = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile; //imagefile hmne jo file send ki hai request men uske naam ko darshata hai
        console.log(file);
        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        console.log("File Type:", fileType);

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "file format not supported",
            })
        }

        //file format supported to hm cloudinary pr upload kr denge
        console.log("Uploading to code hep");
        //cloudinary men hmara upload function hai hm usme upload krenge

        const response = await uploadFileToCloudinary(file, "Codehelp");//code help naam ka function hai cloudinary pr
        console.log("response--->", response);
        //db men entry save karni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })
        //    console.log("after file data")
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image succesfully uploaded",
        })



    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: 'something went wrong',
        })

    }
}

//video upload krna hai

exports.videoUpload = async (req, res) => {

    try {

        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;

        //validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();

        console.log("File Type:", fileType);

        // HW - add a upper limit of 5 mb video
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "file format not supported",
            })
        }

        //code help naam ka function hai cloudinary pr
        console.log("Uploading to codehelp")
        const response = await uploadFileToCloudinary(file, "Codehelp");
        console.log("response->", response);

        //db men entry save karni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })
        //for send the response
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Video succesfully uploaded",
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: 'something went wrong',
        })
    }

}

//imazeSizeReducer

exports.imageSizeReducer = async (req, res) => {
    try {

        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        console.log("File Type:", fileType);

        // HW - add a upper limit of 5 mb video based on need
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "file format not supported",
            })
        }

        //code help naam ka function hai cloudinary pr
        console.log("Uploading to codehelp")
        //TODO - height attribute ke dvara quality km krna hai
        const response = await uploadFileToCloudinary(file, "Codehelp", 30);//we sending qualtiy 
        console.log("response->", response);

        //db men entry save karni hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })
        //for send the response
        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "image succesfully uploaded",
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: 'something went wrong',
        })

    }
}

