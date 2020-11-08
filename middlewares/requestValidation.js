const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL } = require('validator');
const { message } = require('../utils/errorsMessages');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value) => {
      if (!isURL(value)) throw new CelebrateError(message.celebrateErrorUrl);
      return value;
    }),
    image: Joi.string().required().custom((value) => {
      if (!isURL(value)) throw new CelebrateError(message.celebrateErrorUrl);
      return value;
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateArticle,
  validateId,
};
