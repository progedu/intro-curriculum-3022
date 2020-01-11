'use strict';
const postsHandler = require('./posts-handler');
const util = require('./handler-util');

function route(req, res) {
  switch (req.url) {
    case '/posts':
      postsHandler.handle(req, res,{order:[['id', 'DESC']]});
      break;
    case '/logout':
      util.handleLogout(req, res);
      break;
    case'/posts/ASC':
      postsHandler.handle(req, res,{order:[['id', 'ASC']]});
      break;
    case '/posts/DESC':
      postsHandler.handle(req, res,{order:[['id', 'DESC']]});
      break;
    default:
      util.handleNotFound(req, res);
      break;
  }
}

module.exports = {
  route
};