const checkLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: User is not logged in',
    });
  }
};

module.exports = checkLoggedIn;
