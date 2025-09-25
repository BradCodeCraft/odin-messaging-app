const { request, response } = require("express");
const { PrismaClient } = require("../../generated/prisma");
const { body, validationResult } = require("express-validator");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const validateCredentialsOfNewUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username Is Missing")
    .toLowerCase()
    .custom(async (username) => {
      const user = await prisma.user.findFirst({
        where: { username: username },
      });
      if (user) {
        throw new Error("Username Already Exists");
      }
    }),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage(
      "Password Must Have At Least 1 Uppercase, Lowercase, Special, And Numerical Character",
    ),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email Is Missing")
    .isEmail()
    .withMessage("Email Is Invalid")
    .toLowerCase(),
];

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.createNewUser = [
  validateCredentialsOfNewUser,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, email } = req.body;
      const hashedPassword = await hash(
        password,
        parseInt(process.env.BCRYPT_SALT),
      );
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          email: email,
        },
      });
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findFirst({
      where: { id: parseInt(userId) },
    });

    if (!user) return res.status(404).json({ message: "User Not Found" });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const validateUpdatedCredentials = [
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage(
      "Password Must Have At Least 1 Uppercase, Lowercase, Special, And Numerical Character",
    ),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email Is Missing")
    .isEmail()
    .withMessage("Email Is Invalid")
    .toLowerCase(),
];

exports.updateUserById = [
  validateUpdatedCredentials,
  /**
   * @param {request} req
   * @param {response} res
   * @param {() => void} next
   */
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.params;
      const { password, email } = req.body;
      const hashedPassword = await hash(
        password,
        parseInt(process.env.BCRYPT_SALT),
      );
      const user = await prisma.user.update({
        data: { password: hashedPassword, email: email },
        where: { id: parseInt(userId) },
      });
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getAllConversationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findFirst({
      where: { id: parseInt(userId) },
      select: { conversations: true },
    });
    return res.status(200).json(user.conversations);
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.createNewConversationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { recipientId } = req.body;
    const conversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: parseInt(userId) }, { id: parseInt(recipientId) }],
        },
      },
      include: { users: true, messages: true },
    });
    return res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getConverationByConversationIdAndUserId = async (req, res, next) => {
  try {
    const { conversationId, userId } = req.params;
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: parseInt(conversationId),
        users: { some: { id: parseInt(userId) } },
      },
      include: { users: true, messages: true },
    });

    return res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.deleteConversationByConversationIdAndUserId = async (
  req,
  res,
  next,
) => {
  try {
    const { conversationId } = req.params;
    await prisma.conversation.delete({
      where: { id: parseInt(conversationId) },
    });
    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getAllMessagesByConversationIdAndUserId = async (req, res, next) => {
  try {
    const { userId, conversationId } = req.params;
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: parseInt(conversationId),
        users: { some: { id: parseInt(userId) } },
      },
      include: { messages: true },
    });

    return res.status(200).json(conversation.messages);
  } catch (error) {
    next(error);
  }
};

const validateNewMessage = [body("content")];

exports.createNewMessageByConversationIdAndUserId = [
  validateNewMessage,
  /**
   * @param {request} req
   * @param {response} res
   * @param {() => void} next
   */
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, conversationId } = req.params;
      const { content } = req.body;
      const message = await prisma.message.create({
        data: {
          content: content,
          conversationId: parseInt(conversationId),
          senderId: parseInt(userId),
        },
        include: { sender: true },
      });
      return res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getMessageByMessageIdAndConversationIdAndUserId = async (
  req,
  res,
  next,
) => {
  try {
    const { userId, conversationId, messageId } = req.params;
    const message = await prisma.message.findFirst({
      where: {
        id: parseInt(messageId),
        senderId: parseInt(userId),
        conversationId: parseInt(conversationId),
      },
      include: { sender: true },
    });
    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

const validateUpdatedMessage = [body("content")];

exports.updateMessageByMessageIdAndConversationIdAndUserId = [
  validateUpdatedMessage,
  /**
   * @param {request} req
   * @param {response} res
   * @param {() => void} next
   */
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId, conversationId, messageId } = req.params;
      const { content } = req.body;
      const message = await prisma.message.update({
        data: { content: content },
        where: {
          id: parseInt(messageId),
          senderId: parseInt(userId),
          conversationId: parseInt(conversationId),
        },
        include: { sender: true },
      });
      return res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  },
];

exports.deleteMessageByMessageIdAndConversationIdAndUserId = async (
  req,
  res,
  next,
) => {
  try {
    const { userId, conversationId, messageId } = req.params;
    await prisma.message.delete({
      where: {
        id: parseInt(messageId),
        senderId: parseInt(userId),
        conversationId: parseInt(conversationId),
      },
    });
    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};
