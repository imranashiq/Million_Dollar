const influencerRouter = require("express").Router();
const { followUser, getFollowers, getFollowing } = require("../controllers/auth");
const { createInfluencerProfile, getProfile, uploadPromo, deleteUser, uploadPixelImage, SelectPixel, getInfluencer, addCoins, deductCoins,getInfluencerById, uploadCover, editProfile, createCharge, verifyPayment, initializePayment } = require("../controllers/influencer");
const userAuth = require("../middlewares/userAuth");
const  upload  = require("../utills/upload");


influencerRouter.post("/createInfluencerProfile",upload.single("file"), createInfluencerProfile);
influencerRouter.patch("/SelectPixel", SelectPixel);
influencerRouter.patch("/addCoins", addCoins);
influencerRouter.patch("/editProfile",userAuth, editProfile);

influencerRouter.patch("/deductCoins", deductCoins);
influencerRouter.get("/getProfile",userAuth, getProfile);
influencerRouter.get("/getInfluencer", getInfluencer);
influencerRouter.get("/getInfluencerById/:id", getInfluencerById);
influencerRouter.patch("/uploadPromo",userAuth,upload.single("file"), uploadPromo);
influencerRouter.patch("/uploadCover",userAuth,upload.single("file"), uploadCover);
influencerRouter.patch("/uploadPixelImage",userAuth,upload.single("file"), uploadPixelImage);
influencerRouter.patch("/deleteUser",userAuth, deleteUser);
influencerRouter.patch("/followUser",userAuth, followUser);
influencerRouter.patch("/getFollowers",userAuth, getFollowers);
influencerRouter.patch("/getFollowing",userAuth, getFollowing);
influencerRouter.post("/initialize",initializePayment);
influencerRouter.get("/verify/:reference",verifyPayment);







module.exports = influencerRouter;
