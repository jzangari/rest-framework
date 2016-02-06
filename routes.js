var Resource = require('./resource');

module.exports={
    'hello-world':new Resource('application/json', require('./hello_world'))
}