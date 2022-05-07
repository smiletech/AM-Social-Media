const router = require("express").Router();
const Joi = require("joi");
const User = require('../Models/config')
const bcrypt = require("bcryptjs");
const verify = require("../Service/verify")
const jwt = require("jsonwebtoken");
const { json } = require("express");

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const changeSchema = Joi.object({
  password: Joi.string().min(6).required(),
  newpassword: Joi.string().min(6).required(),
});



router.post("/", async (req, res) => {
  try {
    const value = await loginSchema.validateAsync(req.body);


    const currentUser = await User.findOne({ email: req.body.email });
    if (!currentUser)
      return res
        .status(400)
        .json({ status: false, message: "Email does't exist" });

    const currentPass = await bcrypt.compare(
      req.body.password,
      currentUser.password
    );
    if (!currentPass)
      return res
        .status(400)
        .json({ status: false, message: "Password does not match" });

    // token
    const token = jwt.sign({ _id: currentUser._id }, process.env.TOKEN_SECERT, {
      expiresIn: "24hr",
    });

    res.header("auth-token", token)
    return res.status(200).json({ status: true, message: "Log in Sucessfully", currentUser, token: token });

  } catch (err) {
    return res
      .status(400)
      .json({ status: false, message: err.details[0].message });
  }
});

//  log in google
//localhost:8080/login/google-login

router.post("/google-login", async (req, res) => {
  try {
    const currentUser = await User.findOne({ email: req.body.email });
    if (!currentUser)
      return res
        .status(400)
        .json({ status: false, message: "Email does't exist" });

    const token = jwt.sign({ _id: currentUser._id }, process.env.TOKEN_SECERT, {
      expiresIn: "24hr",
    });
    res.header("auth-token", token)
    return res.status(200).json({ status: true, message: "Log in Sucessfully", currentUser, token: token });
  }
  catch (err) {
    return res
      .status(400)
      .json({ status: false, message: err.details[0].message });
  }

})

router.patch("/changepwd/:id", verify, async (req, res) => {
  try {
    const value = await changeSchema.validateAsync(req.body);
    // hashing Password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value.newpassword, salt);
    value.newpassword = hash;
    //  const user = new User(value);

    const currentUser = await User.findOne({ _id: req.params.id });

    if (!currentUser)
      return res
        .status(400)
        .json({ status: false, message: "id does't exist" });

    console.log(currentUser.password);

    const currentPass = await bcrypt.compare(
      req.body.password,
      currentUser.password
    );

    console.log(currentPass);
    if (!currentPass)
      return res
        .status(400)
        .json({ status: false, message: "Password does not match" });


    const Updated = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          password: value.newpassword
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
      .json({ status: true, message: "One User Updtaed", Updated });


  } catch (err) {
    return res
      .status(400)
      .json({ status: false, message: err });
  }
})


module.exports = router;
