const routeNotFoundHandler = (req, res, next) => {
  return res.status(404).send({
    status: 'fail',
    data: {
      message: 'Route not found',
    },
  });
};

module.exports = routeNotFoundHandler;
