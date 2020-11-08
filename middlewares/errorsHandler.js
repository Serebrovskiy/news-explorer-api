const { message } = require('../utils/errorsMessages');

module.exports = ((err, req, res, next) => {
  res.status(err.status || 500)
    .send({ message: err.status === 500 ? message.serverError : err.message });
  next();
});
