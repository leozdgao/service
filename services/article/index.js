import url from 'url';
import qs from 'qs';
import {Router} from 'express';
import Article from './model';

const router = Router();
const getQuery = (req) => qs.parse(url.parse(req.url).query);

router.param('article_id', (req, res, next, id) => {
  req.article_id = id;
  next();
});

router.get('/count', (req, res, next) => {
  let query = getQuery(req);
  Article.count(query.conditions)
    .then(function(c) {
      res.json({count: c});
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/tags', function(req, res, next) {
  Article.tags()
    .then(function(ret) {
      var tags = ret[0][0].value;
      res.json(tags);
    })
    .catch(function(err) {
      next(err);
    });
});

router.get('/', (req, res) => { console.log(req.query);
  let query = getQuery(req);
  Article.query(query.conditions, query.fields, query.options)
    .then((articles) => {
      res.json(articles);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:article_id', (req, res, next) => {
    let query = getQuery(req);
    Article.get(req.article_id, query.fields, query.options)
      .then((article) => {
        res.json(article);
      })
      .catch((err) => {
        next(err);
      });
});

router.post('/', require('body-parser').json(), (req, res, next) => {
  Article.post(req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:article_id', require('body-parser').json(), (req, res, next) => {
  Article.update(req.article_id, req.body)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:article_id', (req, res, next) => {
  Article.remove(req.article_id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      next(err);
    });
});

export default router;
