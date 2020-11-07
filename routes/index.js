const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const usersRouter = require('./users');
const articlesRouter = require('./articles');
const { validateCreateUser, validateLogin } = require('../middlewares/requestValidation');
const NotFoundError = require('../errors/not-found-err');
const { message } = require('../utils/errorsMessages');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use('/users', auth, usersRouter);
router.use('/articles', auth, articlesRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError(message.notFoundRes));
});

module.exports = router;
