import url from 'url'
import qs from 'qs'
import bodyParser from 'body-parser'
import {Router} from 'express'
import Article from './model'
import checkAuth from '../../middlewares/checkAuth'

const router = Router()
const getQuery = (req) => qs.parse(url.parse(req.url).query)

router.param('article_id', (req, res, next, id) => {
  req.article_id = id
  next()
})

router.get('/count', (req, res, next) => {
  let query = getQuery(req)
  Article.count(query.conditions)
    .then(function(c) {
      res.json({count: c})
    })
    .catch(function(err) {
      next(err)
    })
})

router.get('/tags', function(req, res, next) {
  Article.tags()
    .then(function(ret) {
      var tags = ret[0][0].value
      res.json(tags)
    })
    .catch(function(err) {
      next(err)
    })
})

router.get('/', (req, res) => { console.log(req.query)
  let query = getQuery(req)
  Article.query(query.conditions, query.fields, query.options)
    .then((articles) => {
      res.json(articles)
    })
    .catch((err) => {
      next(err)
    })
})

router.get('/:article_id', (req, res, next) => {
    let query = getQuery(req)
    Article.get(req.article_id, query.fields, query.options)
      .then((article) => {
        res.json(article)
      })
      .catch((err) => {
        next(err)
      })
})

// check authentication for any HTTP method that not GET
router.use(checkAuth)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/', (req, res, next) => {
  Article.post(req.body)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      next(err)
    })
})

router.put('/:article_id', (req, res, next) => {
  Article.update(req.article_id, req.body)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      next(err)
    })
})

router.delete('/:article_id', (req, res, next) => {
  Article.remove(req.article_id)
    .then((result) => {
      res.json(result)
    })
    .catch((err) => {
      next(err)
    })
})

export default router
