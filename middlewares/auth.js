const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const { message } = require('../utils/errorsMessages');
const { JWT_SECRET, NODE_ENV } = require('../config');

const auth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError(message.unauthorized);
  }

  req.user = payload;

  next();
};

module.exports = auth;
