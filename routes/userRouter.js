const express = require('express')
const { userValidator } = require('../middlewares/validators/userValidator')
const { userRegister, userLogin } = require('../controllers/userController')
const sendJson = require('../middlewares/sendJson')
const router = express.Router()

router
.route('/register')
.post( userValidator('userRegister'), async (req,res) => {
    const data = await userRegister(req,res)
    sendJson(res,data)
})

router
.route('/login')
.post( userValidator ('login'),async(req,res) => {
    const data = await userLogin(req,res)
    sendJson(res,data)
})

module.exports = router