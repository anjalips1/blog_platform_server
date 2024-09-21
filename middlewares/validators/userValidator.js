const { body } = require('express-validator')
const userValidator = (validationType) => {  
    switch (validationType) {
        case 'userRegister':
            return [
                body('name')
                    .trim()
                    .notEmpty()
                    .withMessage("Name is required"),

                body('email')
                    .trim()
                    .notEmpty()
                    .withMessage("Email is required")
                    .isEmail()
                    .withMessage("Please enter a valid email" ),

                body('username')
                    .trim()
                    .notEmpty()
                    .withMessage("Username is required"),

                body('password')
                    .trim()
                    .notEmpty()
                    .withMessage("Password is required")
                    .isLength({min : 4 , max : 12})
                    .withMessage("Password length should be in between 4-12")
            ]

        case 'login':
            return [
                body('email')
                    .trim()
                    .notEmpty()
                    .withMessage("Email is required"),

                body('password')
                    .trim()
                    .notEmpty()
                    .withMessage("Password is required")
            ]
        
    }
}


module.exports = { userValidator }