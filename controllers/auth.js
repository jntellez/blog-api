const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validateJwt } = require('../middlewares/auth')

const User = require('../models/User')

const signToken = _id => jwt.sign({ _id }, process.env.SECRET)

const Auth = {
    login: async (req, res) => {
        const { body } = req
        try {
            const user = await User.findOne({ email: body.email })
            if(!user) {
                res.status(401).send('Usuario y/o contraseña invalida')
            }
            else {
                const isMatch = await bcrypt.compare(body.password, user.password)
                if(isMatch) {
                    const signed = signToken(user._id)
                    res.send(signed)
                }
                else {
                    res.status(401).send('Usuario y/o contraseña invalida')
                }
            }
        }
        catch(e) {
            res.status(500).send(e.message)
        }
    },

    register: async (req, res) => {
        const { body } = req
        try {
            const isUser = await User.findOne({ email: body.email })
            if(isUser) {
                return res.status(401).send('Este usuario ya existe')
            }
            if(body.name.length < 3) {
                return res.status(401).send('El nombre debe contener minimo 3 caracteres')
            }
            if(body.lastname.length < 3) {
                return res.status(401).send('El apellido debe contener minimo 3 caracteres')
            }
            if(body.email.length < 5) {
                return res.status(401).send('El email debe contener minimo 5 caracteres')
            }
            if(body.password.length < 6) {
                return res.status(401).send('La contraseña debe contener minimo 6 caracteres')
            }
            const salt = await bcrypt.genSalt()
            const hashed = await bcrypt.hash(body.password, salt)
            const user = await User.create({
                name: body.name.toLowerCase(),
                lastname: body.lastname.toLowerCase(),
                image: null,
                email: body.email,
                password: hashed,
                salt
            })
            const signed = signToken(user._id)

            res.send({ signed, _id: user._id })
        }
        catch(e) {
            res.status(500).send(e.message)
        }
    },

    checkAuth: async (req, res) => {
        const { role } = req.auth
        res.send(role)
        //res.send(true)
    },

    getUser: async (req, res) => {
        const { name, lastname, image } = req.auth
        res.status(200).send({ name, lastname, image })
    },

    upload: async (req, res) => {
        const { id } = req.params
        const { filename } = req.file
        
        if(id && filename) {
            const article = await User.findOneAndUpdate({ _id: id }, { image: filename })
            return res.status(200).send(article._id)
        }
        res.status(200).send('La imagen o el usuario no existen')
    }
}

module.exports = Auth