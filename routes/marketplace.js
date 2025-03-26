const marketPlaceRouter = require("express").Router();
const { createMarketPlace, getAllMarketPlace, createBid, getAllBids } = require("../controllers/marketPlace");
const userAuth = require("../middlewares/userAuth");
const  upload  = require("../utills/upload");


marketPlaceRouter.post("/createMarketPlace",userAuth, createMarketPlace);
marketPlaceRouter.post("/createBid",userAuth, createBid);
marketPlaceRouter.get("/getAllMarketPlace", getAllMarketPlace);
marketPlaceRouter.patch("/getAllBids",userAuth, getAllBids);



module.exports = marketPlaceRouter;
