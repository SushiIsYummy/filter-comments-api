const User = require('../models/user');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const generateJwtToken = require('../utils/generateJwtToken');

exports.signInUser = [
  body('username')
    .isLength({ min: 1 })
    .withMessage('Username must be specified')
    .escape(),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password must be specified')
    .escape(),
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

    const existingUser = await User.findOne({
      username: req.body.username,
    }).exec();
    if (!existingUser) {
      return res.status(401).json({
        status: 'fail',
        data: {
          error: {
            message: 'Incorrect username or password',
          },
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        data: {
          error: {
            message: 'Incorrect username or password',
          },
        },
      });
    }

    const payload = {
      userId: existingUser._id,
      username: existingUser.username,
    };

    const token = generateJwtToken(payload);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'You have signed in successfully',
        signed_in: true,
        user: {
          userId: existingUser._id,
          username: existingUser.username,
        },
      },
    });
  }),
];

exports.signOutUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({
      status: 'success',
      data: {
        message: 'No active session to sign out from',
      },
    });
  }

  res.clearCookie('jwt');
  return res.status(200).json({
    status: 'success',
    data: {
      message: 'You have signed out successfully',
    },
  });
});

exports.getSignInStatus = asyncHandler(async (req, res, next) => {
  if (req.user) {
    return res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
        signed_in: true,
      },
    });
  }

  return res.status(401).json({
    status: 'success',
    data: {
      message: 'You are not signed in',
      signed_in: false,
    },
  });
});
