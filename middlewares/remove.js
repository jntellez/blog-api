const Article = require('../models/Article')
const fs = require('fs')

const remove = async (req, res, next) => {
    try {
        const { id } = req.params
        const article = await Article.findById(id)

        if (!article) {
            return res.status(404).send("Este artículo no existe")
        }

        const file = article.image
        const pathFile = `./public/uploads/${file}`

        try {
            fs.unlinkSync(pathFile)
        } catch (error) {
            console.error("Error al eliminar el archivo:", error)
        }

        next()
    } catch (error) {
        console.error("Error en la función remove:", error)
        next(error)
    }
}

module.exports = remove