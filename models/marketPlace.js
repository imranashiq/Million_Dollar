const mongoose = require("mongoose");

const marketPlaceSchema = new mongoose.Schema(
  {
    price:Number,
    isBid:{type:Boolean,default:false},
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      },
      bids:[{
        bidder:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
          },
          bidPrice:Number
      }],
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    selectedPixels: [
      {
        startPos: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
        endPos: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("MarketPlace", marketPlaceSchema);
