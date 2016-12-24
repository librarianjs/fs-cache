var path = require('path')
var fs = require('fs')
var mkdir = promisify(fs.mkdir)
var readFile = promisify(fs.readFile)
var writeFile = promisify(fs.writeFile)

function init () {
  return mkdir(this.dir).then(null, function (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  })
}

function get (key) {
  return readFile(path.join(this.dir, key)).then(null, function (e) {
    if (e.code === 'ENOENT') {
      return null
    }
  })
}

function put (key, data) {
  return writeFile(path.join(this.dir, key), data)
}

function FileSystemCache(options){
  options = options || {}
  this.dir = options.dir || '/tmp/librarian-cache-'+Date.now()
}

FileSystemCache.prototype = {
  init: init,
  put: put,
  get: get,
}

module.exports = FileSystemCache

function promisify (fn) {
  return function () {
    var args = [].slice.call(arguments)
    return new Promise(function(resolve, reject){
      args.push(function (err, data) {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
      fn.apply(null, args)
    })
  }
}
