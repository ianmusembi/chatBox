/*

To test open several browsers to: http://localhost:3000/index.html

*/
const server = require('http').createServer(handler)
const io = require('socket.io')(server) //wrap server app in socket io capability
const fs = require('fs') //file system to server static files
const url = require('url'); //to parse url strings
const PORT = process.argv[2] || process.env.PORT || 3000 //useful if you want to specify port through environment variable
                                                         //or command-line arguments

const ROOT_DIR = 'html' //dir to serve static files from
let registry = new Map();
let nummUsers = 0

const MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain'
}

function get_mime(filename) {
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES['txt']
}

server.listen(PORT) //start http server listening on PORT

function addToRegistry(name, id){
    //Check if user exists in the registry
    if(!registry.has(name)){
        registry.set(name, id)
        return true
    } else {
        console.log("The user " + name + " all ready exists.")
        return false
    }
}

function getByMapValue(searchValue , map = registry) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
  }
  

function handler(request, response) {
  //handler for http server requests including static files
  let urlObj = url.parse(request.url, true, false)
  console.log('\n============================')
  console.log("PATHNAME: " + urlObj.pathname)
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
  console.log("METHOD: " + request.method)

  let filePath = ROOT_DIR  +   urlObj.pathname
  if (urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html'

  fs.readFile(filePath, function(err, data) {
    if (err) {
      //report error to console
      console.log('ERROR: ' + JSON.stringify(err))
      //respond with not found 404 to client
      response.writeHead(404);
      response.end(JSON.stringify(err))
      return
    }
    response.writeHead(200, {
      'Content-Type': get_mime(filePath)
    })
    response.end(data)
  })

}

//Socket Server
io.on('connection', function(socket) {
  console.log('client connected')
  //console.dir(socket)

  socket.emit('registrationRequest', 'Please register with a username')

  
  // upon receiving a message from a client
  socket.on('clientMessage', function(data) {
    console.log('RECEIVED: ' + data)
    let clientObj = JSON.parse(data)
    let senderName = getByMapValue(socket.id)
    clientObj.sender = senderName
    let clientObjJSON = JSON.stringify(clientObj)
    
    if (clientObj.type  === 'public') {
        //to broadcast message to everyone including sender:
        console.log('SENT (public): ' + clientObjJSON)
        io.emit('broadcastMessage', clientObjJSON) //broadcast to everyone including sender
    }
    
    if (clientObj.type  === 'private') {
        let recipients = clientObj.recipientsArr // recipients of private message

        // find private members and send message
        registry.forEach( function(socketId, usrName ) {
            if (recipients.indexOf(usrName) != -1  // send message to user if this user(socket) is in the recepients array 
                || usrName === clientObj.sender) { // or is the sender of the message
                 console.log('SENT (private): ' + clientObjJSON)
                io.to(socketId).emit ('broadcastMessage', clientObjJSON)
            }
        })

    }

  })

    socket.on('registerClient', function(data) {
        console.log('RECEIVED: ' + data)
        let registrationObj = JSON.parse(data)
        if (addToRegistry(registrationObj.name, socket.id) ) {
            let username = getByMapValue(socket.id)
            let registrationObj = {type : 'private' , username:`${username}` , recipientsArr : [] , sender : '' } 
            socket.emit('userRegistered',  JSON.stringify(registrationObj) )
            console.log(`user ${++nummUsers} - ${registrationObj.username} has been registered`)
        }


    })        


  socket.on('disconnect', function(data) {
    //event emitted when a client disconnects
    
    // find the disconnected client's username and remove the client from the registry
    let username = getByMapValue(socket.id)
    registry.delete(username)
    console.log(`user '${username}' has disconnected`)
    nummUsers--
    
  })
    // //to broadcast message to everyone including sender:
    // io.emit('broadcastMessage', data) //broadcast to everyone including sender
    //  //alternatively to broadcast to everyone except the sender
    //socket.broadcast.emit('broadcastMessage', data)
})

console.log(`Server Running at port ${PORT}  CNTL-C to quit`)
console.log(`To Test:`)
console.log(`Open several browsers to: http://localhost:${PORT}/index.html`)
