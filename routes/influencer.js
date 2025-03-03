const authRouter = require("express").Router();
const { createInfluencerProfile, getProfile, uploadPromo, deleteUser } = require("../controllers/influencer");
const userAuth = require("../middlewares/userAuth");
const { upload } = require("../utills/upload");


authRouter.post("/createInfluencerProfile",upload.single("file"), createInfluencerProfile);
authRouter.get("/getProfile",userAuth, getProfile);
authRouter.patch("/uploadPromo",userAuth,upload.single("file"), uploadPromo);
authRouter.patch("/deleteUser",userAuth, deleteUser);



module.exports = authRouter;
