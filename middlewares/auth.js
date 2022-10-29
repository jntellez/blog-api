const express = require('express')
const { expressjwt } = require('express-jwt')
require('dotenv').config()

const User = require('../models/User')

const validateJwt = expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] })

const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id)
        if(!user) {
            return res.status(401).end()
        }
        req.auth = user
        next()
    }
    catch(e) {
        next(e)
    }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser)

/**
 * Docstrings
 * @param {Array<String>} roles strings de los roles autorizados
 * @return {void} next
 */
const isRoleAuth = (roles) => async (req, res, next) => {
    try {
        if([].concat(roles).includes(req.auth.role)) {
            next()
        }
        else {
            res.status(409).send('No tienes permisos')
        }
    }
    catch(e) {
        next(e)
    }
}

module.exports = { isAuthenticated, isRoleAuth, validateJwt }