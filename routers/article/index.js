import url from 'url'
import qs from 'qs'
import bodyParser from 'body-parser'
import { Router } from 'express'
import Article from './model'
import checkAuth from '../../middlewares/checkAuth'

const router = Router()
const getQuery = (req) => qs.parse(url.parse(req.url).query)

router.param('article_id', (req, res, next, id) => {
  req.article_id = id
  next()
})

router.get('/count', (req, res, next) => {
  const query = getQuery(req)
  Article.count(query.conditions)
    .then((c) => {
      res.json({ count: c })
    })
    .catch(next)
})

router.get('/tags', (req, res, next) => {
  Article.tags()
    .then((ret) => {
      const tags = ret[0][0].value
      res.json(tags)
    })
    .catch(next)
})

router.get('/', (req, res, next) => {
  const query = getQuery(req)
  Article.query(query.conditions, query.fields, query.options)
    .then((articles) => {
      res.json(articles)
    })
    .catch(next)
})

router.get('/:article_id', (req, res, next) => {
  const query = getQuery(req)
  Article.get(req.article_id, query.fields, query.options)
    .then((article) => {
      res.json(article)
    })
    .catch(next)
})

// check authentication for any HTTP method that not GET
router.use(checkAuth)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/', (req, res, next) => {
  Article.post(req.body)
    .then((result) => {
      res.json(result)
    })
    .catch(next)
})

router.put('/:article_id', (req, res, next) => {
  Article.update(req.article_id, req.body)
    .then((result) => {
      res.json(result)
    })
    .catch(next)
})

router.delete('/:article_id', (req, res, next) => {
  Article.remove(req.article_id)
    .then((result) => {
      res.json(result)
    })
    .catch(next)
})

export default router
