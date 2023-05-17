//connect to server and retain the socket
//connect to same host that served the document

//const socket = io('http://' + window.document.location.host)
const socket = io() //by default connects to same server that served the page
let myUserName = ''

socket.on('registrationRequest', function(message) {

  // if condition avoids duplication of the registration-message div
  if (document.getElementById("registration-message") == null) {
    let msgDiv = document.createElement('div')
    msgDiv.id = "registration-message"
    msgDiv.style.textAlign = 'center'
    let parentDiv = document.getElementById('registrationDiv')
    let registrationInput = document.getElementById("registrationInput")

    msgDiv.textContent = message
    parentDiv.insertBefore(msgDiv, registrationInput)
  }
})

socket.on('userRegistered', function(message) {
  // If the user is succesfully registered ..
  registrationObj = JSON.parse(message)
  // store the username
   myUserName = registrationObj.username
  let welcomeDiv = document.getElementById("registration-message")
  welcomeDiv.innerHTML = `Hello ${myUserName}! <br> Welcome to ChatBox`

  // Reveal the hidden message box and send message button 
  document.getElementById('messages').classList.remove("hidden")
  document.getElementById("send-box").classList.remove("hidden")

  document.getElementById('messages').classList.add("container")
  document.getElementById('send-box').classList.add("container")

  document.getElementById('msgInput').style.display = 'inline-block'
  document.getElementById('send_button').style.display = 'inline-block'
  document.getElementById('delete_button').style.display = 'inline-block'
  document.getElementById('clear_button').style.display = 'inline-block'

  // hide the registration ELEMENTS on the DOM
  // document.getElementById('registrationDiv').style.display = 'none'
  document.getElementById('register_button').style.display = 'none'
  document.getElementById('registrationInput').style.display = 'none'
  // document.getElementById('register_button').classList.add("hidden")
  // document.getElementById('registrationInput').classList.add("hidden")
  
})

socket.on('broadcastMessage', function(data) {

  let responseObj = JSON.parse(data)
  let msgDiv = document.createElement('div')
  let msgSenderDiv = document.createElement('div')
  let msgTextDiv = document.createElement('div')
  msgSenderDiv.innerHTML = responseObj.sender
  msgTextDiv.textContent = responseObj.text

   if ( responseObj.sender === myUserName) {
    msgSenderDiv.classList.add("hidden")
    msgDiv.classList.add("own-message")
   }
  msgSenderDiv.classList.add("message-sender")
  msgTextDiv.classList.add("message-text")
  msgDiv.classList.add("message")

 
  if (msgSenderDiv != null){
    msgDiv.appendChild(msgSenderDiv)
  }
  msgDiv.appendChild(msgTextDiv)



  

  // console.log('response object' + responseObj + '   '  + typeof(responseObj))
  // console.log(`${msgDiv.innerHTML}`)

  // msgDiv.textContent = responseObj.sender + ' : ' + responseObj.text

  
  // displays the 'you are connected to the chat server' responseObj in black
  if  (responseObj.sender === '') {
    msgDiv.textContent = responseObj.text
  } 
  // display private messages in red
  else if (responseObj.type === 'private') {
    // msgDiv.style.color = 'red'
    msgTextDiv.classList.add("private-message")
  }
  // display response's own messages in blue

  
  // all public messages are displayed in black as the style.color attribute remains unchanged

  document.getElementById('messages').appendChild(msgDiv)
})