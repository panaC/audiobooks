
const {
    conversation,
} = require('@assistant/conversation');

const express = require('express')
const bodyParser = require('body-parser')

// Create an app instance
const app = conversation()

app.handle('persist', async (conv) => {

    conv.user.params.red = "rouge";
    conv.user.params.blue = "bleue";

    console.log("Persist end");
});

app.handle('login_ok', async (conv) => {
    // conv.ask(`I didn't understand. Can you tell me something else?`)
    console.log("LOGIN OK");

    await new Promise((v) => setTimeout(() => v(), 5000));
    
    console.log(conv.user.params);
    console.log(conv.user.storage);

    conv.add(conv.user.params.red + " " + conv.user.params.blue);
});

const expressApp = express().use(bodyParser.json())

expressApp.post('/', app)

expressApp.listen(3000);

