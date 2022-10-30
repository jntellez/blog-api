const Article = require('../models/Article')
const fs = require('fs')

const remove = async (req, res, next) => {
    const { id } = req.params
    const article = await Article.findById(id)
    if(!article) return res.status(404).send("Este articulo no existe")
    const file = article.image
    const pathFile = `./public/uploads/${file}`
    fs.unlinkSync(pathFile)
    next()
}

module.exports = remove