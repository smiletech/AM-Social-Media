var mongoose = require("mongoose");
var imageSchema = new mongoose.Schema(
  {
  

    img: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      minlength: 6,
    },
    username:{
      type: String,
    },
    like: [
      
    ],
    comment: [
      {
        userId: { type: String },
        comment: { type: String },
        commenter:{ type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Image", imageSchema);
