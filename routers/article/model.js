import mongoose from 'mongoose'

const Schema = mongoose.Schema

const articleSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    lastUpdateDate: { type: Date, default: Date.now },
    tags: { type: [String] },
    category: { type: String },
    priority: { type: Number, default: 0 },
    content: { type: String, required: true },
    comments: { type: Array }
}, { collection: 'articles', versionKey: false })

const Article = mongoose.model('Article', articleSchema)

export default {
  get (id) {
    let args = [].slice.call(arguments, 1)
    args.unshift({ _id: id })
    return Article.findOneAsync.apply(Article, args)
  },
  query: Article.findAsync.bind(Article),
  post (obj) {
    let newArticle = new Article(obj)
    return newArticle.saveAsync()
  },
  update (id, update, opts) {
    if(typeof update.lastUpdateDate === 'undefined') update.lastUpdateDate = new Date()
    return Article.findByIdAndUpdateAsync(id, update, opts)
  },
  remove: Article.findByIdAndRemoveAsync.bind(Article),
  count: Article.countAsync.bind(Article),
  tags () {
    let o = {
      map () {
        emit(1, { tags: this.tags })
      },
      reduce (key, values) {
        let result = { tags: [] }
        values.forEach((val) => {
            val.tags.forEach((i) => {
                if(result.tags.indexOf(i) < 0) result.tags.push(i)
            })
        })
        return result
      }
    }
    return Article.mapReduceAsync(o)
  }
}
