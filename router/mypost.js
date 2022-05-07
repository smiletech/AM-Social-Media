const router = require("express").Router();
const multer = require('multer');
const image = require('../Models/imgconfig');

var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, '../public/image') 
    }, 
    filename: (req, file, cb) => { 
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now()) 
    }  
});

var upload = multer({ storage: storage });
// upload.single('image'),

router.post('/',upload.single('image'), async(req,res)=>{    
       const newImage = new image({
                img:req.file.filename ,
                caption: "req.body.caption",
                like: "req.body.like",
                Comment: "xyz"
            });
    try{
       const feedlike = await newImage.save();
      return res.status(200).json({ status: true, message: "image have uploaded..."},feedlike);
        }
    catch(err)
        {       
        return res
        .status(400)
        .json({ status: false, message: "image not upload..!! ",err });
        }

  });

module.exports = router;
