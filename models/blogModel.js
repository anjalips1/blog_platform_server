const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref : 'user',
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    comments : {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "comment",
      default: [],
    }
  },
  { versionKey: false, timestamps: true }
);

blogSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("blog", blogSchema);
