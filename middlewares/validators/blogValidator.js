const { body, query ,param} = require('express-validator')
const blogValidator = (validationType) => {        
    switch (validationType) {
        case 'addBlog':
            return [
                body('title')
                    .trim()
                    .notEmpty()
                    .withMessage("Title is required"),

                body('content')
                    .trim()
                    .notEmpty()
                    .withMessage("Content is required"),

                body('tags')
                    .optional()
                    .isArray()
                    .withMessage("Tags should be an array"),
            ]

        case 'allBlogs':
            return [
                query('page')
                    .optional({ nullable: true, checkFalsy: true })
                    .trim()
                    .isInt({ min: 1 })
                    .withMessage("Page should be a positive integer"),

                query('limit')
                    .optional({ nullable: true, checkFalsy: true })
                    .trim()
                    .isInt({ min: 1 })
                    .withMessage("Limit should be a positive integer")
            ]
        
    }
}


module.exports = { blogValidator }