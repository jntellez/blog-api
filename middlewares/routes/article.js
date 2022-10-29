const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const Article = require('../controllers/article')
const { isAuthenticated, isRoleAuth } = require('../middlewares/auth')

router.get('/articles/:last?', Article.list)
router.get('/article/:id', Article.get)
router.post('/', isAuthenticated, isRoleAuth(['admin']), Article.create)
router.post('/upload/:id', isAuthenticated, isRoleAuth(['admin']), upload(), Article.upload)
router.get('/image/:image', Article.getImage)
router.put('/:id', isAuthenticated, isRoleAuth(['admin']), Article.update)
router.delete('/:id', isAuthenticated, isRoleAuth(['admin']), Article.delete)
router.get('/search', Article.search)
router.get('/recommended', Article.recommended)
router.patch('/comment/:id', Article.comment)

module.exports = router