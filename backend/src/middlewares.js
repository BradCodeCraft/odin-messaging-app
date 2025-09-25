const { request, response } = require("express");
const { PrismaClient } = require("../generated/prisma");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const prisma = new PrismaClient();

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.authenticateUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({ where: { username: username } });

    if (!user) return res.status(404).json({ message: "User Not Found!" });

    const doPasswordsMatch = await compare(password, user.password);

    if (!doPasswordsMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    req.login(user, (err) => {
      if (err) return next(err);
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 */
exports.createJwtToken = (req, res) => {
  const user = req.user;
  const token = sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(201).json({ token: token });
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.doesIdBelongToUser = (req, res, next) => {
  const { userId } = req.params;
  const user = req.user;

  if (parseInt(user.id) == parseInt(userId)) return next();
  return res.status(401).json({ message: "Unauthorized Access" });
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.isRecipientNotUser = (req, res, next) => {
  const { userId } = req.params;
  const { recipientId } = req.body;
  if (parseInt(userId) == parseInt(recipientId))
    return res.status(400).json({ message: "Invalid Recipient" });
  next();
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.doesRecipientExist = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const recipient = await prisma.user.findFirst({
      where: { id: parseInt(recipientId) },
    });
    if (!recipient) return res.status(404).json({ message: "User Not Found" });
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.doesConversationExist = async (req, res, next) => {
  try {
    const { userId, conversationId } = req.params;
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: parseInt(conversationId),
        users: { some: { id: parseInt(userId) } },
      },
      include: { messages: true },
    });
    if (!conversation)
      return res.status(404).json({ message: "Conversation Not Found" });
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.doesMessageExist = async (req, res, next) => {
  try {
    const { userId, conversationId, messageId } = req.params;
    const message = await prisma.message.findFirst({
      where: {
        id: parseInt(messageId),
        senderId: parseInt(userId),
        conversationId: parseInt(conversationId),
      },
    });

    if (!message) return res.status(404).json({ message: "Message Not Found" });
    next();
  } catch (error) {
    next(error);
  }
};
