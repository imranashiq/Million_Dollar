const influencerRouter = require("express").Router();
const { createInfluencerProfile, getProfile, uploadPromo, deleteUser, uploadPixelImage } = require("../controllers/influencer");
const userAuth = require("../middlewares/userAuth");
const  upload  = require("../utills/upload");


influencerRouter.post("/createInfluencerProfile",upload.single("file"), createInfluencerProfile);
influencerRouter.get("/getProfile",userAuth, getProfile);
influencerRouter.patch("/uploadPromo",userAuth,upload.single("file"), uploadPromo);
influencerRouter.patch("/uploadPixelImage",userAuth,upload.single("file"), uploadPixelImage);
influencerRouter.patch("/deleteUser",userAuth, deleteUser);



module.exports = influencerRouter;
