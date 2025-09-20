const { Router } = require("express");
const {
  getAllUsers,
  createNewUser,
  getUserById,
  createJwtForUser,
} = require("../controllers/usersController");
const passport = require("../config/passport");

const router = Router();

router.route("/").get(getAllUsers).post(createNewUser);
router.route("/login").post(passport.authenticate("local"), createJwtForUser);
router.route("/:userId").get(getUserById);

module.exports = router;
