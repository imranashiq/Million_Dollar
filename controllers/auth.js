const User = require("../models/users");
const { validateEmail } = require("../utills/emailValidator");
const { validateRequiredFields } = require("../utills/validateRequiredFields");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
    } = req.body;
    const requiredFields = [
      "email"
    ];
    const missingFieldMessage = validateRequiredFields(
      requiredFields,
      req.body
    );
    if (missingFieldMessage) {
      return res.status(400).json({
        success: false,
        message: missingFieldMessage,
      });
    }
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email is not valid" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User Already Exist With This Email",
      });
    }
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Password & Confirm Password",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password & Confirm Password Are Not Same",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ success: true, message: "User Registered Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Email & Password" });
    }
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter a Valid Email" });
    }
    const user = await User.findOne({
      email: email.toLowerCase(),
      permanentDeleted: false,
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No User With This Email" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password is wrong" });
    }
    // const userOtp = await User.findOne({
    //   email: email.toLowerCase(),
    //   permanentDeleted: false,
    //   verified: false,
    // });
    // if (userOtp) {
    //   // console.log("shaka boom");
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please Verify Your Account",
    //     verified: "false",
    //   });
    // }
    const token = await user.createJWT();
    res.status(200).json({
      success: true,
      message: "Login Successfull",
      data: await User.findOne({
        email: email.toLowerCase(),
        permanentDeleted: false,
      }).select(
        "-password -setNewPwd -forgotPasswordOtp -forgotPasswordOtpExpire"
      ),
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { userData } = req.body;

    const { emailVerified } = userData;
    if (!emailVerified) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    const { email } = userData;
    const oldUser = await User.findOne({ email, permanentDeleted: false });
    // const existingUser = await User.findOne({ email,permanentDeleted:true});

    if (oldUser) {
   
        await User.findOneAndUpdate(
          { _id: oldUser._id },
          { deviceToken: userData.deviceToken }
        );

        const token = await oldUser.createJWT();
        return res.status(200).json({
          success: true,

          token,
          message: "Logged in Successfully",
          data: {
            _id: oldUser._id,
            email: oldUser.email,
            role: oldUser?.role,
          },
        });
      }
    // }

    // else if (existingUser) {
    //   await User.findOne({_id:existingUser._id},{
    //     permanentDeleted:false
    //   })
    // }

    const newUser = await User.create({
      email,
      role:"user"
    });

    const token = await newUser.createJWT();


    return res.status(200).json({
      success: true,
      token,
      message: "Logged in Successfully",
      data: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser?.role,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};