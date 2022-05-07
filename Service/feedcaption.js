const router = require("express").Router();
var cloudinary = require('cloudinary');
var bodyParser = require('body-parser'); 
var path = require('path'); 
const imgModel=require("../Models/imgconfig")
var fs = require('fs'); 
var multer = require('multer');
var cloudinary = require('cloudinary').v2;


// set cloud
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// setup multer
  var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
});

var upload = multer({ storage: storage });

router.get('/', (req, res) => { 
      imgModel.find({}, (err, items) => { 
          if (err) { 
              console.log(err); 
          } 
          else { 
              res.json({ items: items }); 
          } 
      }); 
    });
    
router.post('/', upload.single('image'), (req, res, next) => { 
        const data = {
         image: req.file.path
        }
        cloudinary.uploader.upload(data.image)
        .then((result)=>{
         const image = new imgModel({
                img: result.url
            });
    const response = image.save();
         res.status(200).send({
          message: "success",
          result
         });
        }).catch((error) => {
         res.status(500).send({
          message: "failure",
          error
         });
        });
    });


    module.exports = router;

    // app.use
// app.use('/upload-image',upload.array('image'),async()=>{

// const uploader=async(path)=>await cloudinary.uploads(path,'Images')
 
// if(req.method==='POST'){
//    const urls=[]
//    const files=req.files;
//    for(const file of files){
//      const {path}=file;
//      const newPath=await uploader(path)
//      urls.push(newPath)
//      fs.unlinkSync(path)
//    }
//    return res
//    .status(200)
//    .json({ status: true, message: "image uploaded  successfully",data:urls });
//  }
//  else{
//   return res
//   .status(400)
//   .json({ status: false, message: "image not uploaded " });
//  }

// })




// app.use("/",)