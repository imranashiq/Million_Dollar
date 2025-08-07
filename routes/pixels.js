const pixelRouter = require("express").Router();
const { createPixel, getPixelsByUser, updatePixel, deletePixel, getAllPixels, getPixelStatistics } = require("../controllers/pixels");
const userAuth = require("../middlewares/userAuth");
const { upload } = require("../utills/upload");


pixelRouter.post("/createPixel", createPixel);
pixelRouter.get("/getPixelsByUser",userAuth, getPixelsByUser);
pixelRouter.get("/getAllPixels",getAllPixels);
pixelRouter.get("/pixel-statistics", getPixelStatistics);
pixelRouter.patch("/updatePixel", updatePixel);
pixelRouter.patch("/deletePixel", deletePixel);



module.exports = pixelRouter;
