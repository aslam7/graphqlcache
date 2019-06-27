'use strict';

import compose from 'composable-middleware';
const interceptor = require('express-interceptor');
const generateKey = require('./generate-key');
let cache;

module.exports = function init(cacheOptions = {}) {

  init._cache = cache = require('./cache')(cacheOptions);
};

module.exports.clearCache = function(customKey, cb = () => { }) {
  if (!customKey) {
    cache.clear(cb);
    return;
  }
  cache.del(customKey, cb);
};

function isMutation(query) {
  query = query.replace(/\s\s+/g, ' ').trim();
  return (query.substr(0,8) === 'mutation')
}
module.exports.intercept = interceptor((req,res) =>{
  return {
    isInterceptable: function(){
      if(
        req.shouldIntercept &&
        req.body &&
        req.body.query &&
        res.get('Content-Type') === 'application/json'
      ) return true;
      return false;
    },
    intercept: function(body, send) {
      let { query } = req.body;
      query = query.replace(/\s\s+/g, ' ').trim();
      if (query.substr(0,5) ==='query') query = query.substr(5);
      const key = generateKey(query);
      cache.set(key, body, 60, () => {
        send(body);
      });
    }
  };
})
module.exports.sendIfCached = function () {
    return compose()
    .use((req, res, next) => {
      if(!req.body || !req.body.query || isMutation(req.body.query)) {
        return next();
      }
      let { query } = req.body;
      query = query.replace(/\s\s+/g, ' ').trim();
      if (query.substr(0,5) ==='query') query = query.substr(5);
      const key = generateKey(query);
      return cache.get(key, (err, cachedResults) => {
        if(!cachedResults) {
          req.shouldIntercept = true;
          return next();
        }
        return res.send(cachedResults)
      }) 
  })
}


