
const redis = require('ioredis');

const offerIdToSlug = require('../helper/offerIdToSlug')

client = redis.createClient()

client.on('connect', () => console.info('Redis connected'))
const HOUR = 3600;
const WEEK = HOUR * 24 * 7;

exports.midWare = (req, res, next) => {
  const key = req.originalUrl
  client.get(key, (err, result) => {
    if (err == null && result != null) {
      res.setHeader('content-type', 'application/json');
      res.send(result)
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        client.setex(key, HOUR, body, (err, reply) => {
          if (reply == 'OK')
            res.sendResponse(body)
        })
      }
      next()
    }
  })
}

exports.midWareLong = (req, res, next) => {
  const key = req.originalUrl
  client.get(key, (err, result) => {
    if (err == null && result != null) {
      res.setHeader('content-type', 'application/json');
      res.send(result)
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        client.setex(key, WEEK, body, (err, reply) => {
          if (reply == 'OK')
            res.sendResponse(body)
        })
      }
      next()
    }
  })
}


exports.midWareRefresh = (req, res, next) => {
  const key = req.originalUrl.replace('/refresh', '')
  client.get(key, (err, result) => {
    res.sendResponse = res.send
    res.send = (body) => {
      client.setex(key, WEEK, body, (err, reply) => {
        if (reply == 'OK')
          res.sendResponse(body)
      })
    }
  })
  next()
}
exports.offerRefresh = async (req, res, next) => {
  const slug = await offerIdToSlug(req.params.id)
  client.del(`/api/offer/${slug.slug}`)
  next();
}

exports.clientRefresh = async (req, res, next) => {
  client.del(req.body.id || req.params.id);
  next();
}

exports.midWareLongBody = (req, res, next) => {
  const key = req.body.id;
  client.get(key, (err, result) => {
    if (err == null && result != null) {
      res.setHeader('content-type', 'application/json');

      res.send(result)
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        client.setex(key, WEEK, body, (err, reply) => {
          if (reply == 'OK')
            res.sendResponse(body)
        })
      }
      next()
    }
  })
}
