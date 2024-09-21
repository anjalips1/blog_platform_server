const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel");
const { handleError } = require("../middlewares/handleError");

const userRegister = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {            
            return {code : 400 , message : errors.errors[0].msg}
        }
        
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, genSalt);
        const data = {
            name : req.body.name,
            email : req.body.email,
            username : req.body.username,
            password : hashedPassword
        }

        const user = await userModel(data).save()
        return { message : "User registered successfully", data : user }
    } catch (error) {
        return handleError(error)
    }
}

const userLogin = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {code : 400 , message : errors.errors[0].msg}
        }
        const userData = await userModel.findOne({
            email : req.body.email
        })
        if(!userData){
            return { code : 400 , message : "Invalid username or password"}
        }
        const passwordMatch = await bcrypt.compare(req.body.password, userData.password);
        if(passwordMatch){
            const token = jwt.sign(
                { id: userData._id, email: userData.email },
                process.env.SECRET_KEY,
                { expiresIn: "24h" }
              );
              return { message : "User logged in successfully" , data : token }
        }else{            
            return { code : 400 , message : "Invalid username or password"}
        }
        
    } catch (error) {
        return handleError(error)
    }
}

module.exports = {
    userRegister,
    userLogin
}