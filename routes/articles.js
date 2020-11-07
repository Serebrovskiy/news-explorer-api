const router = require('express').Router();
const { validateArticle, validateId } = require('../middlewares/requestValidation');

const {
  getAllArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', getAllArticles);
router.post('/', validateArticle, createArticle);
router.delete('/:articleId', validateId, deleteArticle);

module.exports = router;
