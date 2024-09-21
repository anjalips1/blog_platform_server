const express = require('express')
const authenticateToken = require('../middlewares/auth/authenticateToken')
const { commentValidator } = require('../middlewares/validators/commentValidator')
const { addComment, updateComment, deleteComment } = require('../controllers/commentController')
const sendJson = require('../middlewares/sendJson')
const router = express.Router()

router
.route('/')
.post(authenticateToken,commentValidator('addComment'),async(req,res) => {
    const data = await addComment(req,res)
    sendJson(res,data)
})

router
.route('/:id')
.put(authenticateToken,commentValidator('updateComment'),async(req,res) => {
    const data = await updateComment(req,res)
    sendJson(res,data)
})
.delete(authenticateToken,async(req,res) => {
    const data = await deleteComment(req,res)
    sendJson(res,data)
})

module.exports = router