const { validationResult } = require("express-validator");
const { handleError } = require("../middlewares/handleError");
const commentsModel = require("../models/commentsModel");
const blogModel = require("../models/blogModel");

const addComment = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {code : 400 , message : errors.errors[0].msg}
        }
        const blog = await blogModel.findById(req.body.blogId)
        if(!blog){
            return { code : 400 ,message : "Blog not found"}
        }
        const data = {
            content : req.body.content,
            user : req.user
        }
        const comment = await commentsModel(data).save()
        blog.comments.push(comment?._id);
        await blog.save()
        return { message : "Comment added successfully" , data : comment}
        
    } catch (error) {
        return handleError(error)  
    }
}


const updateComment = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {code : 400 , message : errors.errors[0].msg}
        }
        const comment = await commentsModel.findById(req.params.id)
        if(!comment){
            return { code : 400 , message : "Comment not found"}
        }else if(comment.user == req.user){
            const updatedComment = await commentsModel.findByIdAndUpdate(req.params.id,{
                content : req.body.content
            },{new : true})
            return { message : "Comment updated successfully" , data : updatedComment }
        }else{
            return { code : 403 , message : "Access Denied! Cannot update this comment"}
        }
        
    } catch (error) {
        return handleError(error)
    }
}

const deleteComment = async(req,res) => {
    try {
        const comments = await commentsModel.findById(req.params.id) 
        if(!comments){
            return {code : 400, message : "Comment not found"}
        }else if(comments.user == req.user){
            const blog = await blogModel.findOne({comments : {$in : req.params.id}})
            if(blog){
                blog.comments.pull(req.params.id);
                await blog.save()
            }
            await commentsModel.findByIdAndDelete(req.params.id)
            return { message : "Comment deleted successfully" }
        }else{
            return { code : 403 , message : "Access Denied! Cannot delete this comment"}
        }
        
    } catch (error) {
        return handleError(error)
    }
}


module.exports = {
    addComment,
    updateComment,
    deleteComment
}