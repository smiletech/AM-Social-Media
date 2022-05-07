const router = require("express").Router();
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const verify=require("../Service/verify")
const User=require("../Models/config")
const jwt = require("jsonwebtoken");
const { json } = require("express");
const { limit } = require("@hapi/joi/lib/common");
const { result } = require("@hapi/joi/lib/base");
// register

const Registerschema = Joi.object({
  firstname: Joi.string().min(4).required(),
  lastname: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required()
});

// for sign up
router.post("/", async (req, res) => {
    try {
      const value = await Registerschema.validateAsync(req.body);
      // hashing Password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(value.password, salt);
      value.password = hash;
      const user = new User(value);
  
      // check User already exist
      const userExist = await User.findOne({ email: req.body.email });
      if (userExist)
        return res
          .status(400)
          .json({ status: false, message: "user already exist" });
  
      // // Save data
      await user.save();  
      return res.status(200).json({ status: true, message: "Register  Sucessfully" , user });
    
    } catch (err) {
      return res
        .status(400)
        .json({ status: false, message: err.details[0].message });
    }
  });

// user limit

// router.get("/user",verify,paginationData(User),(req,res)=>{

//   res,json(paginationresult)
// });

// 
// function paginationData(model){
//   return async (req,res,next)=>{
//     const page=parseInt(req.query.page)
//     const limit=parseInt(req.query.limit)
//     const startindex = (page-1)*limit
//     const endpage = page*limit
//     const results={}
//     if(startindex>0)
//     {
//       results.previous={
//       page:page-1,
//       limit:limit
//     }
//   }
//     if(endpage< await model.countDocuments().exec())
//     {
//       results.next={
//       page:page+1,
//       limit
//     }
//     }
    
//    try{ results.result= await model.find().limit(limit).skip(startindex).exec()
//       res.paginationresult=results;
//       next()
    
//     }
//       catch(err){
//       return res.status(500).json({message:err})
//       }
  
  
  
//     }
// }

// 
  
router.get("/All",verify, async (req, res) => {
    const users = await User.find();
    return res.status(200).json({ status: true, users });
  });


  module.exports = router;