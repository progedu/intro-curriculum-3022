'use strict';
const pug = require('pug');
const util = require('./handler-util');
const Post = require('./post');

function handle(req, res) {
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
        res.end(pug.renderFile('./views/posts.pug', {
          posts: posts
        }));
      });
      break;

    case 'POST':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();    // Bufferオブジェクトのconcat()メソッドでデータを結合した後、文字列に変換
        const decoded = decodeURIComponent(body);    // エンコードされている可能性があるので、decodedURIComponent()でエンコード
        const content = decoded.split('content=')[1];   // 本文のみ抽出したので、split()関数を使用して抽出（[0]には日付が入っている）
        console.info('投稿されました: ' + content);
        Post.create({    // sequelize上でデータベースを作成（post.jsで作成したオブジェクト）
          content: content,
          trackingCookie: null,
          postedBy: req.user
        }).then(() => {
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
  handle
};
