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
      //DBから全部取ってきたら、データである posts を渡す。引数に{order:[['id', 'DESC']]}入れたらID大きい順（最新のが上に表示できる）
      Post.findAll({order:[['id', 'DESC']]}).then((posts) => {
        res.end(pug.renderFile('./views/posts.pug', {
          posts: posts
        }));
      });
      
      break;
    case 'POST':
      //TODO POSTの処理
      let body = '';//文字列として
      req.on('data',(chank) => {//細切れデータが送られてきたら受け取って
        body = body + chank;//どんどん足していく。文字列連結
      }).on('end', () => {//送り終わったら
        const decoded = decodeURIComponent(body);
        const content = decoded.split('content=')[1];//配列にして文字部分だけ取る。
        console.info('投稿されました:' + content);
        
        Post.create({//データベースに保存する処理
          content: content,
          trackingCookie: null,
          postedBy:　req.user
        }).then(() => {
          handleRedirectPosts(req, res);//投稿が完了し、DB保存できたらリダイレクトする
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


module.exports = {
  handle
};