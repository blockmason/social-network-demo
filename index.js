document.addEventListener("DOMContentLoaded", function(event) { 
    
    messages = []
    
    feed = document.getElementById('feed');
    textArea = document.getElementById("textarea");

    function printMessages() {
        messages.forEach(element => {
            var messageText = document.createTextNode(element.message + ' - ');       
            var messageDate = document.createTextNode(element.timestamp + ' - ');
            var messageUser = document.createTextNode(element.user);
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
        while (feed.firstChild) {
            feed.removeChild(feed.firstChild);
        }
    }

    document.getElementById("submitMessage").onclick = function() {submitText()};

    function submitText() {
        if(textArea.value.trim() != ""){
            messageObject = {message: (textArea.value.trim()), timestamp: Date(), user: 'Network User'};
            messages.push(messageObject);
            removeMessages();
            printMessages();
            textArea.value = "";
        }
    }

    printMessages();
});