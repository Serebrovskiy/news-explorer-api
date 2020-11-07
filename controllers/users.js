const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const { message } = require('../utils/errorsMessages');
const { JWT_SECRET, NODE_ENV } = require('../config');

// создаём пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      const userPassword = user;
      userPassword.password = '';
      res.send(userPassword);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(message.conflictUser));
      } else next(err);
    });
};

// проверяем почту и пароль и возвращаем JWT
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError(message.emailOrPasswordError)));
};

// возвращаем информацию о пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .populate('owner')
    .orFail(new NotFoundError(message.notFoundUser))
    .then((user) => res.send(user))
    .catch(next);
};
