const asyncHandler = require('express-async-handler');

exports.getProfile = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: {
      user: {
        userId: req.user.userId,
        username: req.user.username,
      },
    },
  });
});
