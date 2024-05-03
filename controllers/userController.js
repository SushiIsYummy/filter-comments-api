const User = require('../models/user');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const generateJwtToken = require('../utils/generateJwtToken');

exports.createUser = [
  body('username')
    .custom((username) => !/\s/.test(username))
    .withMessage('No spaces are allowed in the username')
    .custom(async (username) => {
      const existingUser = await User.findOne({ username: username }).exec();
      if (existingUser) {
        throw new Error('The username is already taken');
      }
      return true;
    })
    .withMessage('The username is already taken')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Username must be specified'),
  // TODO: Password input currently has no strict requirements.
  // Consider adding password strength validation rules in the future if needed.
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password must be specified'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      console.log(value);
      console.log(req.body.password);
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        data: {
          errors: errors.array(),
        },
      });
    }

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          throw new Error();
        }
        // store hashedPassword in DB
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
        });
        const savedUser = await user.save();

        const payload = {
          userId: savedUser._id,
          username: savedUser.username,
        };

        const token = generateJwtToken(payload);

        res.cookie('jwt', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({
          status: 'success',
          data: {
            signed_in: true,
            user: {
              userId: savedUser._id,
              username: req.body.username,
            },
          },
        });
      });
    } catch (err) {
      return next(err);
    }
  }),
];

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { userId, username } = req.user;
  const userIdToDelete = req.params.userId;

  if (userId !== userIdToDelete) {
    return res.status(403).json({
      status: 'fail',
      data: {
        message: 'You are unauthorized to delete this account',
      },
    });
  }

  await User.deleteOne({ _id: userIdToDelete });

  return res.status(200).json({
    status: 'success',
    data: {
      user: {
        userId: userIdToDelete,
        username,
      },
      deleted: true,
    },
  });
});
