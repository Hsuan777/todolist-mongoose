const headers = require('../headers');
function errorHandle(res, data){
  res.writeHeader(400, headers);
  res.write(JSON.stringify({
    status: 'false',
    data: data
  }));
  res.end();
}

module.exports = errorHandle;