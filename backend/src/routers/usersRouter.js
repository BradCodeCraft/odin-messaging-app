const { Router } = require("express");
const {
  authenticateUser,
  createJwtToken,
  doesIdBelongToUser,
  doesRecipientExist,
  isRecipientNotUser,
  doesConversationExist,
  doesMessageExist,
} = require("../middlewares");
const {
  getAllUsers,
  createNewUser,
  getUserById,
  updateUserById,
  getAllConversationsByUserId,
  createNewConversationsByUserId,
  getConverationByConversationIdAndUserId,
  deleteConversationByConversationIdAndUserId,
  getAllMessagesByConversationIdAndUserId,
  createNewMessageByConversationIdAndUserId,
  getMessageByMessageIdAndConversationIdAndUserId,
  updateMessageByMessageIdAndConversationIdAndUserId,
  deleteMessageByMessageIdAndConversationIdAndUserId,
} = require("../controllers/usersControllers");
const passport = require("../configs/passport");

const router = Router();
router.route("/").get(getAllUsers).post(createNewUser);
router.route("/login").post(authenticateUser, createJwtToken);
router
  .route("/:userId")
  .all(passport.authenticate("jwt"), doesIdBelongToUser)
  .get(getUserById)
  .put(updateUserById);
router
  .route("/:userId/conversations")
  .all(passport.authenticate("jwt"), doesIdBelongToUser)
  .get(getAllConversationsByUserId)
  .post(isRecipientNotUser, doesRecipientExist, createNewConversationsByUserId);
router
  .route("/:userId/conversations/:conversationId")
  .all(passport.authenticate("jwt"), doesIdBelongToUser, doesConversationExist)
  .get(getConverationByConversationIdAndUserId)
  .delete(deleteConversationByConversationIdAndUserId);
router
  .route("/:userId/conversations/:conversationId/messages")
  .all(passport.authenticate("jwt"), doesIdBelongToUser, doesConversationExist)
  .get(getAllMessagesByConversationIdAndUserId)
  .post(createNewMessageByConversationIdAndUserId);
router
  .route("/:userId/conversations/:conversationId/messages/:messageId")
  .all(
    passport.authenticate("jwt"),
    doesIdBelongToUser,
    doesConversationExist,
    doesMessageExist,
  )
  .get(getMessageByMessageIdAndConversationIdAndUserId)
  .put(updateMessageByMessageIdAndConversationIdAndUserId)
  .delete(deleteMessageByMessageIdAndConversationIdAndUserId);

module.exports = router;
