const User = require("../models/users");

exports.createInfluencerProfile=async (req,res) => {
    try {
        const {firstName,lastName,userName,bio,facebook,instagram,twitter,projects,email}=req.body
        console.log(req.body)
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

exports.SelectPixel=async (req,res) => {
    try {
        const {email,selectedPixels,subtotal}=req.body
        console.log(req.body)
        let check=await User.findOne({email})
        if (!check) {
            return res.status(400).json({success:false,email:"Wrong Email"})
        }
        const deduction=check.coins-subtotal
        console.log(deduction)
        if (deduction<0) {
            return res.status(400).json({success:trie,message:"You Don't Enough Coins"})
        }


      await User.findOneAndUpdate({email},{selectedPixels,coins:deduction})
      return res.status(200).json({success:true,message:"Pixels Selected"})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

exports.addCoins=async (req,res) => {
    try {
        const {email,coins}=req.body
        console.log(req.body)
        let check=await User.findOne({email})
        if (!check) {
            return res.status(400).json({success:false,email:"Wrong Email"})
        }

      await User.findOneAndUpdate({email},{coins:check.coins+coins})
      return res.status(200).json({success:true,message:"Coins Added"})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}


exports.editProfile=async (req,res) => {
    try {
        const {userId}=req.user
        const {firstName,lastName,userName,bio,facebook,instagram,twitter,projects,profilePicture,email,promo,cover}=req.body
      

      await User.findOneAndUpdate({_id:userId},{firstName,lastName,userName,bio,facebook,instagram,twitter,projects,profilePicture,email,promo,cover})
      return res.status(200).json({success:true,message:"Profile Updated Successfully"})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

exports.deductCoins=async (req,res) => {
    try {
        const {email,coins}=req.body
        let check=await User.findOne({email})
        if (!check) {
            return res.status(400).json({success:false,email:"Wrong Email"})
        }
        const deduction=check.coins-coins
        if (deduction<0) {
            return res.status(400).json({success:trie,message:"You Don't Enough Coins"})
        }

      await User.findOneAndUpdate({email},{coins:check.coins-coins})
      return res.status(200).json({success:true,message:"Coins deducted"})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

exports.uploadPixelImage=async (req,res) => {
    try {
        const {userId}=req.user
        if (req.file) {
            let pixelImage="/"+req.file.path
            await User.findOneAndUpdate({_id:userId},{pixelImage})
            return res.status(200).json({success:true,message:"Pixel Image Uploaded Successfully"})
        }

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

exports.getInfluencer=async (req,res) => {
    try {
        // const {userId}=req.user
        const user=await User.find({role:"influencer",permanentDeleted:false})
      return res.status(200).json({success:true,data:user})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}
exports.getInfluencerById=async (req,res) => {
    try {
        const {id}=req.params
        const user=await User.find({role:"influencer",permanentDeleted:false,_id:id})
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

exports.uploadCover=async (req,res) => {
    try {
        const {userId}=req.user
        if (req.file) {
            let cover="/"+req.file.path
            await User.findOneAndUpdate({_id:userId},{cover})
            return res.status(200).json({success:true,message:"Cover Uploaded Successfully"})
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