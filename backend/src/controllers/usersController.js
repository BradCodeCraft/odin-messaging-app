const { request, response } = require("express");
const { PrismaClient } = require("../../generated/prisma");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const json = require("jsonwebtoken");

const client = new PrismaClient();

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getAllUsers = async function getAllUsers(req, res, next) {
  try {
    const users = await client.user.findMany({});

    return res.status(200).json({ users: users });
  } catch (error) {
    next(error);
  }
};

const validateNewUser = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username Must Not Be Empty!"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password Must Not Be Empty!"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email Must Not Be Empty!")
    .isEmail()
    .withMessage("Email Format Is Invalid!"),
];

exports.createNewUser = [
  validateNewUser,
  /**
   * @param {request} req
   * @param {response} res
   * @param {() => void} next
   */
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        next(errors);
      }

      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.SALT),
      );
      const user = await client.user.create({
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
exports.createJwtForUser = async function createJwtForUser(req, res, next) {
  try {
    const token = json.sign({ user: req.user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Authentication Successful!",
      user: req.user,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param {request} req
 * @param {response} res
 * @param {() => void} next
 */
exports.getUserById = async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;

    const user = await client.user.findFirst({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
