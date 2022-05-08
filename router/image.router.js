const router = require("express").Router();
const Feed = require("../Models/imgconfig");
const verify = require("../Service/verify");
const imgUpload = require("../imgfile");
const dotenv = require("dotenv");

const cloudinary=require("cloudinary").v2

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

router.post("/post",(req, res,nex) => {
const file=req.files.image
console.log(file);

cloudinary.uploader.upload(file.tempFilePath,async(err,result)=>{
  console.log(result);

 const feed = new Feed({
    img: result.secure_url,
    caption: req.body.caption,
    username: req.body.username,
  });

  try {
    const updatepost = await feed.save();
    return res.send({
      success: true,
      message: "Post Inserted successfully",
      updatepost,
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err,
    });
  }



})

 });





// *****************************************************
router.post("/upload", verify, imgUpload, async (req, res) => {
  console.log("first");
  if (req.file) {
    return res.status(200).send({
      success: true,
      message: req.file,
    });
  } else {
    return res.status(400).send({
      success: false,
      message: "something went wrong ",
    });
  }
});



// post router for feed post
// router.post("/post",verify, imgUpload, async (req, res) => {
//   const feed = new Feed({
//     img: req.file.filename,
//     caption: req.body.caption,
//     username: req.body.username,
//   });

//   try {
//     const updatepost = await feed.save();
//     return res.send({
//       success: true,
//       message: "Post Inserted successfully",
//       updatepost,
//     });
//   } catch (err) {
//     return res.status(400).send({
//       success: false,
//       message: err,
//     });
//   }
// });

//
//localhost:8080/?page=1&limit=3000

router.get("/", verify, async (req, res) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.limit);

  console.log(page + "......" + size);
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  const allpost = await Feed.find().sort({ _id: -1 }).limit(limit).skip(skip);
  if (allpost) {
    return res.json({
      status: true,
      message: "post retrived successfully",
      post: allpost,
    });
  } else {
    res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  console.log("ok");
});

//**************Extra Api  */
router.put("/:Id", verify, imgUpload, async (req, res) => {
  try {
    const Updated = await Feed.findOneAndUpdate(
      { _id: req.params.Id },
      {
        $set: {
          img: req.file.filename,
          caption: req.body.caption,
        },
      },
      { new: true }
    );
    if (!Updated)
      return res
        .status(400)
        .json({ status: false, message: "User not exist!!" });

    return res
      .status(200)
      .json({ status: true, message: "One Post Updtaed", post: Updated });
  } catch (err) {
    return res.status(400).json({ status: false, message: err });
  }
});

// ********APIs************
router.put("/like/:id",verify, async (req, res) => {
  const userid = req.body.id;
  const userComment = req.body.comment || "";
  const userCommenter = req.body.commenter || "";
  try {
    const users = await Feed.findOne({ _id: req.params.id });
    if (!users) return res.status(400).json({ status: false, users });
    let pos = -1;

    if (userComment === "") {
      let pos = -1;
      users.like.map((ele, index) => (ele === userid) ? pos = index : "");

      if (users.like.length === 0) { users.like.push(userid) } else {
        pos !== -1 ? users.like.splice(pos, 1) : users.like.push(userid);
      }
      console.log(userid);
    } else users.comment.push({ userId: userid, comment: userComment, commenter: userCommenter });



    const saved = await users.save();
    if (saved)
      return res.status(200).json({
        status: true,
        user: users,
        like: users.like.length,
        comment: users.comment,
      });
    else
      return res.status(400).json({
        status: false,
        message: "data not saved",
      });
  } catch (err) {
    return res.status(400).json({ status: false, message: err });
  }
});

//
router.delete("/:Id", verify, async (req, res) => {
  try {
    const Deletedpost = await Feed.findOneAndRemove({ _id: req.params.Id });
    if (!Deletedpost)
      return res
        .status(400)
        .json({ status: false, message: "post not exist!!" });
    return res.status(200).json({
      status: true,
      message: "Post Deleted successfully",
      Deletedpost,
    });
  } catch (err) {
    return res.status(400).json({ status: false, message: err.message });
  }
});


module.exports = router;
