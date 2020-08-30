'use strict';

var pug = require('pug');

var util = require('./handler-util');

var Post = require('./post');

function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      Post.findAll({
        order: [['id', 'DESC']]
      }).then(function (posts) {
        res.end(pug.renderFile('./views/posts.pug', {
          posts: posts
        }));
      });
      break;

    case 'POST':
      var body = [];
      req.on('data', function (chunk) {
        body.push(chunk);
      }).on('end', function () {
        body = Buffer.concat(body).toString();
        var decoded = decodeURIComponent(body);
        var content = decoded.split('content=')[1];
        console.info('投稿されました: ' + content);
        Post.create({
          content: content,
          trackingCookie: null,
          postedBy: req.user
        }).then(function () {
          handleRedirectPosts(req, res);
        });
      });
      break;

    default:
      util.handleBadRequest(req, res);
      break;
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

module.exports = {
  handle: handle
};