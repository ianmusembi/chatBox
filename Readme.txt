Author  :IAN MUSEMBI
Version : 1.0.0


README FILE

To start the node server open the directory and run the command
    node server.js


To Test
    http://localhost:3000/index.html


Additional Information
	For instance where sender sends private message to a non-existing user , message will only be shown on
	sender's browser as private message (in beige)

	The first colon (':') that appears in the text from the user is used as the delimiter for the message
	recepients of the private message and the message itself. Anything after the first colon, including other punctuation symbols will
	be part of the message.
	
	Recepients of the private messages are separated using commas and the list of recepients is ended using a colon ':'
	
	For example, in a group containing Joe, James, Jamie, Jane and Jack , if Jack wants to send a private message to Joe and Jane , they
	they will send the following message;
		Joe, Jane : [CONTENT OF THE MESSAGE]
		
	For messages for all members of the chat, there is no need to have a list of recepients before the message.
	
	In the special scenario where the user wants to send a public message that contains a colom, send the message with a colon at the beginning

	
