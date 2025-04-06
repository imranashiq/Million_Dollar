const MarketPlace = require("../models/marketPlace");
const User = require("../models/users");


exports.createMarketPlace=async (req,res) => {
    try {
        const {userId}=req.user
        const {price,isBid,timer}=req.body
        if (!price||!isBid||!timer) {
          return res.status(400).json({success:false,message:"Please Provide All Required Fields"})
        }
        let check=await MarketPlace.findOne({userId,active:true})
        if (check) {
          return res.status(200).json({success:true,message:"You Already Have Pixels In Market Place"})
        }
        const user=await User.findOne({_id:userId})
      await MarketPlace.create({selectedPixels:user.selectedPixels,price,userId,isBid,timer})
      return res.status(200).json({success:true,message:"MarketPlace Added"})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

exports.getAllMarketPlace=async (req,res) => {
    try {
        const marketplace=await MarketPlace.find().populate("userId").sort({createdAt:-1})
        if (!marketplace) {
            return res.status(200).json({success:true,message:"No Data Available"})
        }
        return res.status(200).json({success:true,data:marketplace})
    } catch (error) {
        return res.status(200).json({success:true,message:error.message})
    }
}
exports.createBid = async (req, res) => {
  try {
    const { mpId } = req.params;
    const { userId } = req.user;  
    const { bidPrice } = req.body;

    if (!bidPrice) {
      return res.status(400).json({ success: false, message: "Please provide a bid price" });
    }

    const marketplace = await MarketPlace.findById(mpId);
    if (!marketplace) {
      return res.status(400).json({ success: false, message: "Invalid marketplace ID" });
    }

    const existingBid = marketplace.bids.find(bid => bid.bidder.toString() === userId.toString());
    if (existingBid) {
      return res.status(400).json({ success: false, message: "You have already placed a bid" });
    }

    marketplace.bids.push({
      bidder: userId,
      bidPrice: bidPrice,
    });

    if (bidPrice < marketplace.price) {
     return res.status(400).json({success:false,message:"The value should be less than reserve price"})
    }

    await marketplace.save();

    return res.status(200).json({ success: true, message:"Bid Placed Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBids=async (req,res) => {
    try {
        const {userId}=req.user
        const marketplace=await MarketPlace.find({userId}).populate("userId").sort({createdAt:-1}).select("bids")
        if (!marketplace) {
            return res.status(200).json({success:true,message:"No Data Available"})
        }
        return res.status(200).json({success:true,data:marketplace})
    } catch (error) {
        return res.status(200).json({success:true,message:error.message})
    }
}

exports.DeleteMarketPlace=async (req,res) => {
  try {
    let {mpId}=req.params
      const marketplace=await MarketPlace.findOneAndUpdate({_id:mpId},{permanentDeleted:true,active:false})
      if (!marketplace) {
          return res.status(200).json({success:true,message:"No Data Available"})
      }
      return res.status(200).json({success:true,message:"Deactivated Successfully"})
  } catch (error) {
      return res.status(200).json({success:true,message:error.message})
  }
}