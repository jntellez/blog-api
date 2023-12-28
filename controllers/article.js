const Articles = require('../models/Article')
const fs = require('fs')
const path = require('path')

const Article = {
    list: async (req, res) => {   
        const query = Articles.find({})

        const { last } = req.params
        if(last) query.limit(5)

        const articles = await query.sort('-_id')
        if(!articles) return res.status(200).send('No hay articulos por mostrar')
        res.status(200).send(articles)
    },

    get: async (req, res) => {
        const { id } = req.params
        if(id) {
            const article = await Articles.findOne({ _id: id })
            if(article) return res.status(200).send(article)
            return res.status(200).send('Este articulo no existe')
        }
        res.status(200).send('No existe este articulo')
    },
    
    create: async (req, res) => {
        try {
            const article = new Articles(req.body)
            if(!article) return res.status(200).send('Faltan datos por enviar')
            const savedArticle = await article.save()
            if(savedArticle) return res.status(201).send(savedArticle._id)
            res.status(500).send('No se ha podido guardar el articulo')
        }
        catch(err) {
            res.status(200).send({ error: err.message, message: 'Ha ocurrido un error' })
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params
            if(id) {
                const article = await Articles.findOne({ _id: id })
                if(!article) return res.status(200).send('No existe este articulo')
                Object.assign(article, req.body)
                const updatedArticle = await article.save()
                if(updatedArticle) return res.sendStatus(204)
            }
            res.status(200).send('No existe este articulo')
        }
        catch(err) {
            res.status(500).send({
                error: err.message,
                message: 'No se ha podido actualizar el articulo'
            })
        }
    },

    delete: async (req, res) => {
        const { id } = req.params
        if(!id) return res.status(200).send('Este articulo no existe')
        const article = await Articles.findOne({ _id: id })
        if(article) article.remove()
        res.status(204).send('El artículo se ha eliminado correctamente')
    },

    upload: async (req, res) => {
        const { id } = req.params
        const { filename } = req.file
        
        if(id && filename) {
            const article = await Articles.findOneAndUpdate({ _id: id }, { image: filename })
            return res.status(200).send(article._id)
        }
        res.status(200).send('La imagen o el articulo no existen')
    },

    getImage: (req, res) => {
        const file = req.params.image
        const filePath = `./public/uploads/${file}`

        if(fs.existsSync(filePath)) {
            return res.status(200).sendFile(path.resolve(filePath))
        }
        res.status(200).send('No existe esta imagen')
    },

    search: async (req, res) => {
        const { search } = req.query
        const searched = await Articles.find({ $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ]})
        .sort([['data', 'descending']])

        res.status(200).send(searched)
    },

    recommended: async (_req, res) => {
        const query = await Articles.find({})

        if (!query) res.status(200).send('No hay articulos')
        
        query.sort((art1, art2) => {
            const comment1 = JSON.parse(art1.comments)
            const comment2 = JSON.parse(art2.comments)
            
            if(comment1.count < comment2.count) return 1
            else if(comment1.count > comment2.count) return -1
            else return 0
        })

        const recommended = []
        const recommendedLength = query.length >= 3 ? 3 : query.length
        for (let i = 0; i < recommendedLength; i++) {
            recommended[i] = query[i]
        }

        res.status(200).send(recommended)
    },

    comment: async (req, res) => {
        
        const article = await Articles.findById(req.params.id)
        const comments = JSON.parse(article.comments)
        if(!article) res.status(404).send('Este artículo no existe')

        const temp = [...comments.comments, req.body]
        const newComment = { comments: temp, count: comments.count + 1 }
        const updateArticle = await Articles.findByIdAndUpdate(req.params.id, { comments: JSON.stringify(newComment) })
        if(updateArticle) res.status(200).send('Comentario guardado')
    }
}

module.exports = Article