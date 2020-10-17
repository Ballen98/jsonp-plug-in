const http = require('http');
const url = require('url')

http.createServer((req, res)=>{
  let urlObj = url.parse(req.url, true)
  let pathname = urlObj.pathname
  let query = urlObj.query
  console.log(query)
  if(pathname == '/jsonp'){
    if(query && query.jsonpCallback){
      res.writeHead(200, {'Context-Type': 'appliction/javascript'})
      let data = {
        username : 'ballen',
        password : '123456'
      }
      let callback = `${query.jsonpCallback}(${JSON.stringify(data)})`
      res.end(callback)
    }
  }
}).listen(8888,()=>{
  console.log('http server start')
})