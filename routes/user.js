const express = require('express')

const router = express.Router()

const Auth = require('../controllers/auth')
const { isAuthenticated, isRoleAuth } = require('../middlewares/auth')
const upload = require('../middlewares/upload')

router.post('/register', isAuthenticated, isRoleAuth(['admin']), Auth.register)
router.post('/login', Auth.login)
router.post('/userUpload/:id', isAuthenticated, isRoleAuth(['admin']), upload(), Auth.upload)
router.get('/getUser', isAuthenticated, isRoleAuth(['admin', 'user']), Auth.getUser)
router.get('/checkAuth', isAuthenticated, isRoleAuth(['admin']), Auth.checkAuth)

module.exports = router