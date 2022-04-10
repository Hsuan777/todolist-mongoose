const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const headers = require('./headers');
const Todo = require('./models/todo');
const successHandle = require('./handles/successHanlde');
const errorHandle = require('./handles/errorHanlde');

const DB = process.env.DATABASE
mongoose.connect(DB).then(() => {
  console.log('資料庫連線成功');
})
const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => body += chunk);

  if (req.url === '/todos' && req.method === 'GET') {
    try {
      const todos = await Todo.find();
      successHandle(res, todos)
    } catch {
      errorHandle(res, '資料取得失敗，請重新整裡');
    }
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const newTodo = await Todo.create({
          title: data.title,
          done: false,
        });
        successHandle(res, newTodo);
      } catch(error) {
        errorHandle(res, error.errors);
      }
    })
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    await Todo.deleteMany({});
    successHandle(res, '刪除所有資料成功');
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const toDoId = req.url.split('/').pop();
    await Todo.findByIdAndDelete(toDoId);
    successHandle(res, '資料刪除成功');
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const toDoId = req.url.split('/').pop();
        await Todo.findByIdAndUpdate(toDoId, {
          title: data.title
        });
        successHandle(res, '資料編輯成功');
      } catch {
        errorHandle(res, '欄位名稱不正確或無此 ID')
      }
    })
  } else if (req.url === '/todos' && req.method === 'OPTIONS') {
    successHandle(res, 'OPTIONS');
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status: 'false',
      data: '無此頁面'
    }));
    res.end();
  }
}

http.createServer(requestListener).listen(process.env.PORT);