const { body } = require("express-validator");
const commentValidator = (validationType) => {
  switch (validationType) {
    case "addComment":
      return [
        body("content").trim().notEmpty().withMessage("Content is required"),

        body("blogId").trim().notEmpty().withMessage("Blog Id is required"),
      ];
      
    case "updateComment":
      return [
        body("content").trim().notEmpty().withMessage("Content is required"),
      ];
  }
};

module.exports = { commentValidator };
