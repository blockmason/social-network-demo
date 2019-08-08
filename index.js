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
    messageArray = [];
    currentUserDisplayName = '';

    // Get All Messages
    async function getMessages() {
        let allMessages = await project.get('/events/Message');

        return allMessages;
    }

    // Format Messages into message array and Print
    async function formatMessages() {

        messagesJSON = await getMessages();

        messagesJSON.data.forEach(message => {
                messageArray.push(message);
        })

        printMessages();
    }

    // Post a new message
    async function postMessage(newMessage) {

        await project.post('/postMessage', { message: newMessage });
        
        removeMessages();
        messageArray = [];
        formatMessages();
    }


    // Set Profile
    async function setProfile(idOfProfile) {
        // Set some profile settings for the demo
        let profilePost = {
            "id": idOfProfile,
            "displayName": "Mason Link",
            "avatarUrl": 'https://blockmason.link/wp-content/uploads/2019/04/download.jpg'
        }

        await project.post('/setProfile', profilePost);
    }
    // run this once to set up your profile, then just comment it out.
    setProfile(currentUser);

    // Get the profile data based on ID
    async function getProfile(userID) {

        let profileData = await project.get('/getProfile', {
                "id": userID
            });

        return profileData;
    }

    // Print profile data to profile
    async function printProfile() {
        
        let profileData = await getProfile(currentUser);
        currentUserDisplayName = profileData.displayName;
        
        let profileDisplayName = document.createTextNode(currentUserDisplayName);
        
        profileImage.style.cssText = "background-image: url(" + profileData.avatarUrl + ")";
        
        profileUsername.appendChild(profileDisplayName);
    }

    // Format for message element
    function printMessages() {
        //Update the number of posts
        profilePosts.innerText = ("Number of Posts: " + messageArray.length);

        messageArray.forEach(async message => {
            let messageUser = document.createTextNode(currentUserDisplayName);
            let messageText = document.createTextNode('"' + message.message + '" — ');
            let divElement = document.createElement("DIV");
            let pElement = document.createElement("P");
            let messagesFormated = divElement.appendChild(pElement);

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
    getMessages();
    formatMessages();

});