const router = require("express").Router();
// const Image=require("../Models/imgconfig");
// var bodyParser = require('body-parser'); 
// // var path = require('path'); 
// const fs = require('fs'); 
// const multer = require('multer');


// var storage = multer.diskStorage({ 
//     destination: (req, file, cb) => { 
//         cb(null, './Images') 
//     }, 
//     filename: (req, file, cb) => { 
//         console.log(file);
//         cb(null, file.fieldname + '-' + Date.now()) 
//     }  
// });


// var upload = multer({ storage: storage });
// upload.single('image'),

router.post('/upload',(req,res)=>{
    console.log("first")
});

module.exports = router;




// try{
      
//     const obj = {
//         img: {
//             data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
//             contentType: "image/png"
//         }
//     }
//     // const newImage = new Image({
//     //     image: obj.img,
//     //     caption:"abc",
//     //     like:0,
//     //     Comment:["xyz"]

//     // });
//     // newImage.save();

//  return res.status(200).json({ status: true, message: "image have uploaded...",req});
// }catch(err)
// {       
// return res
// return res
// return res
// .status(400)
// .json({ status: false, message: "image not upload..!! ",err });
// }