//Requirements
require('dotenv').config();
const { link } = require('@blockmason/link-sdk');
const fetch = require('node-fetch');
const project = link({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, {
    fetch
});

//When Document Ready
document.addEventListener("DOMContentLoaded", function (event) {
    feed = document.getElementById('feed');
    textArea = document.getElementById("textarea");
    profileImage = document.getElementById("profile-image");
    profileUsername = document.getElementById("user-name");
    profilePosts = document.getElementById("number-of-posts");
    document.getElementById("submitMessage").onclick = function () { submitText() };

    // For this demo we set the user to user 0
    currentUser = 0;
    messages = [];


    // Get All Messages
    async function getMessages() {
        var allMessages = project.get('/events/Message').then((message) => {
            return message.data;
        });

        return allMessages;
    }

    // Format Messages into message array and Print
    async function formatMessages(unformatedMessages) {

        unformatedMessages.then(value => {
            value.forEach(message => {
                messages.push(message);
            })
        }).then(() => {
            printMessages(messages);
        });
    }

    // Set message
    async function postMessage(newMessage) {
        await project.post('/postMessage', {
            message: newMessage,
        }).then(() => {
            removeMessages();
            messages = [];

            updatedMessages = getMessages();
            formatMessages(updatedMessages);
        });
    }


    // Set Profile
    async function setProfile(idOfProfile) {
        // Set some profile settings for the demo
        const profilePost = {
            "id": idOfProfile,
            "displayName": "Mason Link",
            "avatarUrl": 'https://blockmason.link/wp-content/uploads/2019/04/download.jpg'
        }

        await project.post('/setProfile', profilePost);
    }
    // run this once to set up your profile
    // setProfile(0);

    // Get the profile data based on ID and update profile
    function getProfile(userID) {

        return new Promise(resolve => {
            resolve(project.get('/getProfile', {
                "id": userID
            }));
        })
    }

    // Print profile data to profile
    async function printProfile() {
        var profileData = await getProfile(currentUser);
        var profileDisplayName = document.createTextNode(profileData.displayName);
        profileImage.style.cssText = "background-image: url(" + profileData.avatarUrl + ")";
        profileUsername.appendChild(profileDisplayName);
    }

    // Format for message element
    function printMessages() {
        //Update the number of posts
        profilePosts.innerText = ("Number of Posts: " + messages.length);

        messages.forEach(async message => {
            var messageUserData = await getProfile(message.senderId);
            var messageUser = document.createTextNode(messageUserData.displayName);
            var messageText = document.createTextNode('"' + message.message + '" — ');
            var divElement = document.createElement("DIV");
            var pElement = document.createElement("P");
            var messagesFormated = divElement.appendChild(pElement);

            messagesFormated.appendChild(messageText);
            messagesFormated.appendChild(messageUser);

            feed.appendChild(messagesFormated)
        });
    }

    // Clear existing messages
    function removeMessages() {
        console.log('Cleared All Messages')
        while (feed.firstChild) {
            feed.removeChild(feed.firstChild);
        }
    }

    // The function to submit text from textArea
    function submitText() {
        if (textArea.value.trim() != "") {
            messageObject = textArea.value.trim();
            postMessage(messageObject);
            textArea.value = "";
        }
    }

    //Initialization
    printProfile(currentUser);
    var startingMessages = getMessages();
    formatMessages(startingMessages);

});