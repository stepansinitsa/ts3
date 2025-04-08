import  http from 'http';

const HOST_URL = process.env.HOST_URL || '127.0.0.1';

export const setCounter = function(id: any) {
  const data = JSON.stringify({ bookId: id })

  const req = http.request(
    {
      hostname: HOST_URL,
      port: 3001,
      path: `/counter/${id}/incr`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      console.log(`statusCode req-post: ${res.statusCode}`);
      res.on('data', answer => {
        console.log(`Просмотр добавлен: ${JSON.parse(answer).message}`);
      })
    })
    req.on('error', (error) => {
    console.error(error)
  })
  req.write(data);
  req.end();
}

export const getCounter = function(id: any, callback: any) {
  const req = http.request(
    {
      hostname: HOST_URL,
      port: 3001,
      path: `/counter/${id}`,
      method: 'GET'
    }, callback )
    req.on('error', (error) => {
      console.error(error)
      return error;
    })
    req.end();
}
