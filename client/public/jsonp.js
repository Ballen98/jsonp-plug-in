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
      reject('超时了')
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