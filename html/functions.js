function registerUser() {
  let message = document.getElementById('registrationInput').value.trim()
  if( !IsValidUsrName(message)) return //do nothing
  let messageObj = { type: 'registration' , name: message }
  let messageObjJSON = JSON.stringify(messageObj)
  socket.emit('registerClient', messageObjJSON)
  document.getElementById('registrationInput').value = ''

}

function sendMessage() {
  let msgInputStr = document.getElementById('msgInput').value.trim()
  if(msgInputStr === '') return //do nothing

  let splitIndex = msgInputStr.indexOf(':') // to identify where to split the user input into users and message 
  // console.log(`splitIndex : ${splitIndex}`)
  let userStr = msgInputStr.slice(0, splitIndex + 1) 
  // console.log(`userStr : ${userStr}`)
  let message = msgInputStr.replace(userStr, '')
  // console.log(`message : ${message}`) 
  userStr = userStr.replace(':', '')
  // console.log(`userStr (${typeof(userStr)}) : ${userStr}`)
  let recipientsArr = userStr.split(',')
  for (i in recipientsArr) {
    recipientsArr[i] = recipientsArr[i].trim()
  }
  // console.log(`recipientsArr (${typeof(recipientsArr)}): ${recipientsArr}   length :${recipientsArr.length}`)
  let messageObj = {type:'private' , text: message , recipientsArr: recipientsArr , sender: ''}
  if (recipientsArr.length < 2 ) { // if the recepients array only contains an empty string
    if (recipientsArr[0] === '' ) {// empty the recipients array and set the message type to public
      recipientsArr = []
      messageObj.type = 'public'
    }
  }
  let messageObjJSON = JSON.stringify(messageObj)
  socket.emit('clientMessage', messageObjJSON)
  //console.log('sent to server')
  document.getElementById('msgInput').value = ''
}

function deleteMessage (){

  document.getElementById("msgInput").value = ""

}

function clearMyChat() {
  // get the chat area and clear it
  let msgHTML = document.getElementById('messages')
  // let msgDiv = document.createElement('div')
  let text = ""

  msgHTML.innerHTML = ''
  // msgDiv.textContent = text
  // document.getElementById('messages').appendChild(msgDiv)
}

function handleKeyUp(event) {
  const ENTER_KEY = 13 //keycode for enter key
  // let messageDisplayStyle = document.getElementById('send_button').style.display
  if (event.which === ENTER_KEY) {
    registerUser() 
    sendMessage()
    
    return false //don't propogate event
  } 

}

function handleKeyDown(event) {
  const ENTER_KEY = 13 //keycode for enter key
  // let messageDisplayStyle = document.getElementById('send_button').style.display
  // let regsitrationDisplayStyle = document.getElementById('register_button').style.display
  if (event.which === ENTER_KEY) {
      registerUser() 
      sendMessage()

    // console.log('handlekeydown function running')
    return false //don't propogate event
  } 

}

function IsValidUsrName (usrname) {
  let firstIsLetter = /^[a-zA-Z]/ 
  let lettersAndChars = /^[a-zA-Z0-9]*$/ 
  return firstIsLetter.test(usrname) && lettersAndChars.test(usrname)
  // return lettersAndChars.test(usrname)

}


function registrationMessageDivExists () {
  return !(document.getElementById("registration-message") == null)
}

