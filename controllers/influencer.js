const User = require("../models/users");

exports.createInfluencerProfile=async (req,res) => {
    try {
        const {firstName,lastName,userName,bio,facebook,instagram,twitter,projects,email}=req.body
        let check=await User.findOne({email})
        if (!check) {
            return res.status(400).json({success:false,email:"Wrong Email"})
        }
        let profilePicture
        if (req.file) {
             profilePicture="/"+req.file.path
        }

      await User.findOneAndUpdate({email},{firstName,lastName,userName,bio,facebook,instagram,twitter,projects,email,profilePicture,role:"influencer"})
      return res.status(200).json({success:true,message:"Influencer Profile Created"})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

exports.getProfile=async (req,res) => {
    try {
        const {userId}=req.user
        const user=await User.findOne({_id:userId,permanentDeleted:false})
      return res.status(200).json({success:true,data:user})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

exports.uploadPromo=async (req,res) => {
    try {
        const {userId}=req.user
        if (req.file) {
            let promo="/"+req.file.path
            await User.findOneAndUpdate({_id:userId},{promo})
            return res.status(200).json({success:true,message:"Promo Reel Uploaded Successfully"})
        }
   
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

exports.deleteUser=async (req,res) => {
    try {
        const {userId}=req.user
   
            await User.findOneAndUpdate({_id:userId},{permanentDeleted:true})
            return res.status(200).json({success:true,message:"Profile Deleted Successfully"})
        
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}