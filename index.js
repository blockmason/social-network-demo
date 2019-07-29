require('dotenv').config();
const { link } = require('@blockmason/link-sdk');
const fetch = require('node-fetch');
const project = link({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, {
        fetch
    });
    
document.addEventListener("DOMContentLoaded", function (event) {
    feed = document.getElementById('feed');
    textArea = document.getElementById("textarea");
    messages = [];

    // Set message
    async function postMessage(newMessage) {
        await project.post('/postMessage', {
            message: newMessage,
        }).then(() => {
            removeMessages();
            messages = [];

            var allMessages = project.get('/events/Message').then((message) => {
                return message.data;
            });

            allMessages.then(value => {
                value.forEach(message => {
                    messages.push(message);
                })
            }).then(() => {
                console.log('We have the new messages');
                console.log(messages);
                printMessages(messages);
            });
        });
    }

    // Get All Messages
    var allMessages = project.get('/events/Message').then((message) => {
        return message.data;
    });


    allMessages.then(value => {
        value.forEach(message => {
            messages.push(message);
        })
    }).then(() => {
        printMessages(messages);
    });


    // Set Profile
    async function setProfile() {
        await project.post('/setProfile', {
            displayName: 'Mason',
            avatarURL: 'https://blockmason.io/wp-content/uploads/2018/11/BMLogo_no-words_IconColor.png0x1111222233334444555566667777888899990000'
        });
    }

    function printMessages() {
        messages.forEach(message => {
            var messageText = document.createTextNode(message.message + ' - ');
            var messageDate = document.createTextNode(message.timestamp + ' - ');
            var messageUser = document.createTextNode(message.senderId);
            var divElement = document.createElement("DIV");
            var pElement = document.createElement("P");

            var messagesFormated = divElement.appendChild(pElement);

            messagesFormated.appendChild(messageText);
            messagesFormated.appendChild(messageDate);
            messagesFormated.appendChild(messageUser);

            feed.appendChild(messagesFormated)
        });
    }

    function removeMessages() {
        console.log('Cleared All Messages')
        while (feed.firstChild) {
            feed.removeChild(feed.firstChild);
        }
    }

    document.getElementById("submitMessage").onclick = function () { submitText() };

    function submitText() {
        if (textArea.value.trim() != "") {
            messageObject = textArea.value.trim();
            postMessage(messageObject);
            textArea.value = "";
        }
    }

    printMessages();

});