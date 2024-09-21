const { validationResult } = require("express-validator");
const blogModel = require("../models/blogModel");
const { handleError } = require("../middlewares/handleError");
const commentsModel = require("../models/commentsModel");


const createBlog = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {code : 400 , message : errors.errors[0].msg}
        }
        const data = {
            title : req.body.title,
            content : req.body.content,
            tags : req.body.tags ?? [],
            author : req.user
        }
        const blog = await blogModel(data).save()
        return { message : "Blog created successfully" , data : blog}
        
    } catch (error) {
        return handleError(error)  
    }
}

const getAllBlogs = async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {code : 400 , message : errors.errors[0].msg}
        }
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const data = await blogModel.paginate({},{
            page : page,
            limit : limit,
            sort: { createdAt: -1 },
            populate : [{
                path: 'author',
                select: '-password'
            },{ path : 'comments'}]
        })

        return { message : "List of blogs" , data}
    } catch (error) {
        return handleError(error)
    }
}

const getBlogById = async(req,res) => {
    try {        
        const data = await blogModel.findById(req.params.id).populate({
            path: 'author',
            select: '-password'
        })
        if(!data){
            return { code : 400 , message : "Blog not found"}
        }else{            
            return { message : "Blog details" , data }
        }
    } catch (error) {
        return handleError(error)
    }
}

const updateBlog = async(req,res) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            return {code : 400 , message : errors.errors[0].msg}
        }

        const blog = await blogModel.findById(req.params.id)
        
        if(!blog){
            return { code : 400 , message : "Blog not found"}
        }else if(blog.author == req.user){

            const updatedBlog = await blogModel.findByIdAndUpdate(req.params.id,{
                title : req.body.title,
                content : req.body.content,
                tags : req.body.tags ?? []
            },{new : true})

            return { message : "Blog updated successfully" , data : updatedBlog }
        }else{
            return { code : 403 , message : "Access Denied! Cannot update this blog"}
        }
        
    } catch (error) {
        return handleError(error)
    }
}

const deleteBlog = async(req,res) => {
    try {    
        const blog = await blogModel.findById(req.params.id) 
        if(!blog){
            return {code : 400, message : "Blog not found"}
        }else if(blog.author == req.user){
            await blogModel.findByIdAndDelete(req.params.id)
            await commentsModel.deleteMany({_id : blog.comments})
            return { message : "Blog deleted successfully" }
        }else{
            return { code : 403 , message : "Access Denied! Cannot delete this blog"}
        }
        
    } catch (error) {
        return handleError(error)
    }
}


module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
}