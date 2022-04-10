const headers = require('../headers');
function successHandle(res, data){
  res.writeHeader(200, headers);
  res.write(JSON.stringify({
    status: 'success',
    data: data
  }));
  res.end();
}

module.exports = successHandle;