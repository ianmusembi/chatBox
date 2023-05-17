//Add event listeners
document.addEventListener('DOMContentLoaded', function() {
  //This function is called after the browser has loaded the web page

  //add listener to buttons
  document.getElementById('send_button').addEventListener('click', sendMessage)

  document.getElementById('register_button').addEventListener('click', registerUser)

  document.getElementById('clear_button').addEventListener('click', clearMyChat)

  document.getElementById('delete_button').addEventListener('click', deleteMessage)

  //add keyboard handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  //document.addEventListener('keyup', handleKeyUp)
})