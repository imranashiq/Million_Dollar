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

   let user1= await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const token = await user1.createJWT();

    return res
      .status(200)
      .json({ success: true, message: "User Registered Successfully" ,token});
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
    const { email } = req.body;
console.log(req.body)
    // const { emailVerified } = userData;
    // if (!emailVerified) {
    //   return res.status(400).json({ success: false, message: "Invalid email" });
    // }
    // const { email } = userData;
    const oldUser = await User.findOne({ email, permanentDeleted: false });
    // const existingUser = await User.findOne({ email,permanentDeleted:true});

    if (oldUser) {

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
    console.log(error.message)
    return res.status(400).json({ success: false, message: error.message });
  }
};



exports.followUser = async (req, res) => {
  try {
      const followerId = req.user.userId;  
      const { followeeId } = req.body; 
      if (followerId === followeeId) {
          return res.status(400).json({ success: false, message: "You cannot follow yourself" });
      }

      const follower = await User.findById(followerId);
      const followee = await User.findById(followeeId);

      if (!follower) return res.status(404).json({ success: false, message: "Follower not found" });
      if (!followee) return res.status(404).json({ success: false, message: "Followee not found" });

      if (follower.following.includes(followeeId)) {
          follower.following = follower.following.filter(followingId => followingId.toString() !== followeeId.toString());

          followee.followers = followee.followers.filter(followerId => followerId.toString() !== followerId.toString());

          await follower.save();
          await followee.save();

          return res.status(200).json({ success: true, message: "Unfollowed successfully" });
      } else {
          followee.followers.push(followerId);
          follower.following.push(followeeId);

          await follower.save();
          await followee.save();

          return res.status(200).json({ success: true, message: "Followed successfully" });
      }
  } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
      const userId = req.user.userId;  

      const user = await User.findById(userId).populate('followers');

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
return res.status(200).json({success:true,data:user.followers,total:user.followers.length})
  } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
  }
};


exports.getFollowing = async (req, res) => {
  try {
      const userId = req.user.userId;
      const user = await User.findById(userId).populate('following');

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({success:true,data:user.following,total:user.following.length})
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
  }
};