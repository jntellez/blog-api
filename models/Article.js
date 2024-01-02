const mongoose = require('mongoose')

const Article = mongoose.model('Article', {
    title: { type: String, required: true, minLength: 3 },
    content: { type: String, required: true, minLength: 3 },
    image: { type: String },
    comments: { type: String, required: true },
    languages: { type: String, required: true, minLength: 1 },
    date: { type: Date, default: Date.now },
})

module.exports = Article