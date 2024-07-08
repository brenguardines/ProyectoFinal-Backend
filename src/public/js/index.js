/*
const socket = io();

let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Identify",
    input: "Text",
    text: "Enter a user to identify in the chat",
    inputValidator: (value) => {
        return !value && "You need to write a name to continue"
    },
    allowOutsideClick: false,
}).then(result => {
    user = result.value;
})

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter"){
        if(chatBox.value.trim().length > 0){ 
            socket.emit("message", {user: user, message: chatBox.value})
            chatBox.value = "";
        }
    }
})

socket.on("message", (data) => {
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach(message => {
        messages = messages + `${message.user} says: ${message.message} <br>`;
    })

    log.innerHTML = messages;
})
*/