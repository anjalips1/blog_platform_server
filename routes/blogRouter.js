const express = require('express')
const authenticateToken = require('../middlewares/auth/authenticateToken')
const { blogValidator } = require('../middlewares/validators/blogValidator')
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blogController')
const sendJson = require('../middlewares/sendJson')
const router = express.Router()

router
.route('/')
.post(authenticateToken, blogValidator('addBlog'),async(req,res) => {
    const data = await createBlog(req,res)
    sendJson(res,data)
})
.get(blogValidator('allBlogs'),async(req,res) => {
    const data = await getAllBlogs(req,res)
    sendJson(res,data)
})

router
.route('/:id')
.get(async(req,res) => {
    const data = await getBlogById(req,res)
    sendJson(res,data)
})
.put(authenticateToken,blogValidator('addBlog'),async(req,res) => {
    const data = await updateBlog(req,res)
    sendJson(res,data)
})
.delete(authenticateToken,async(req,res) => {
    const data = await deleteBlog(req,res)
    sendJson(res,data)
})

module.exports = router