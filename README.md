# jsonp-plug-in



## The main code

path: client/public/jsonp.js

```javascript
function jsonp(options) {
  return new Promise((resolve, reject) => {
    if (!window.jsonpNum) {
      window.jsonpNum = 1
    } else {
      window.jsonpNum++
    }

    let {
      url,
      data = {},
      timeout = 5000,
      cbkey = 'callback'
    } = options

    let cbvalue = 'callback' + window.jsonpNum

    function clear() {
      window[cbvalue] = null
      script.parentNode.removeChild(script);
      clearTimeout(timer)
    }

    let timer = setTimeout(() => {
      reject('Timeout!!!')
    }, timeout)

    let params = ''
    if(Object.keys(data).length) {
      for(let key in data) {
        params += `&${key}=${encodeURIComponent(data[key])}`
      }
      params = params.substr(1)
    }

    url = `${url}?${params}&${cbkey}=${cbvalue}`
    let script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)

    window[cbvalue] = function (res) {
      resolve(res)
      clear()
    }
  })  
}
```

path: HTTP/server.js

```javascript
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
```

