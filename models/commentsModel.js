const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
