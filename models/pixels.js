const mongoose = require("mongoose");

const pixelSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      },
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

module.exports = mongoose.model("Pixel", pixelSchema);
