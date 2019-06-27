# graphqlcache-server #


## About ##

graphqlcache-server module will let you cache graphql query data, if it finds the similar query it will return cached data.

## Usage ##

```javascript
import express from 'express'
import { graphqlExpress } from 'apollo-server-express';
import { graphql } from 'graphql';

var graphqlcache = require('graphqlcache-server');

const app = express();


graphqlcache({
  engine: 'redis',    /* If you don't specify the redis engine,      */
  port: 6379,         /* the query results will be cached in memory. */
  host: 'localhost'
})


app.use(graphqlcache.intercept)

app.use('/graphql', graphqlcache.sendIfCached(), graphqlExpress({ schema }));
