const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');
const { message } = require('../utils/errorsMessages');

// возвращаем все сохраненные пользователем статьи
module.exports.getAllArticles = (req, res, next) => {
  Article.find({})
    .then((article) => res.send(article))
    .catch(next);
};

// создаем статью
module.exports.createArticle = (req, res, next) => {
  const { _id } = req.user;
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: _id,
  })
    .then((article) => res.send(article))
    .catch(next);
};

// удаляем сохраненную статью по id
module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .orFail(new NotFoundError(message.notFoundArticle))
    .then((article) => {
      if (article.owner.toString() === req.user._id) {
        article.remove()
          .then((removeArticle) => res.send(removeArticle));
      } else {
        throw new ForbiddenError(message.forbiddenArticle);
      }
    })
    .catch(next);
};
