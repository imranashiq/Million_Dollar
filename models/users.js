const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // firstName: {
    //   type: String,
    //   trim: true,
    // },
    // lastName: {
    //   type: String,
    //   trim: true,
    // },
    // country: {
    //   type: String,
    //   trim: true,
    // },
    // gender: {
    //   type: String,
    //   trim: true,
    //   enum: ["male", "female"],
    // },


    // profilePicture: {
    //   type: String,
    // },
    email: {
      type: String,
      trim: true,
    },
    // dob: {
    //   type: String,
    //   trim: true,
    // },

    password: {
      type: String,
      trim: true,
    },
    // verified: {
    //   type: Boolean,
    //   default: false,
    // },

    role: {
      type: String,
      enum: ["user", "influencer", "admin"],
      default: "user",
    },

    setNewPwd: { type: Boolean, default: false },
    forgotPasswordOtp: { type: String },
    forgotPasswordOtpExpire: {
      type: Date,
      default: "",
    },
    verificationOtp: { type: String },
    verificationOtpExpire: {
      type: Date,
      default: "",
    },

    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET
    // {
    //   expiresIn: "3d",
    // }
  );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isCorrect = await bcrypt.compare(candidatePassword, this.password);
  return isCorrect;
};

userSchema.methods.compareVerificationOtp = async function (verificationOtp) {
  const isMatch = await bcrypt.compare(verificationOtp, this.verificationOtp);
  return isMatch;
};
userSchema.methods.compareForgotPasswordOtp = async function (
  forgotPasswordOtp
) {
  const isMatch = await bcrypt.compare(
    forgotPasswordOtp,
    this.forgotPasswordOtp
  );
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
