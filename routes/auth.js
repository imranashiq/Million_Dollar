const authRouter = require("express").Router();
const {
  register,
  login,
  googleLogin
} = require("../controllers/auth");
// const userAuth = require("../middlewares/userAuth");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/googleLogin", googleLogin);


module.exports = authRouter;
