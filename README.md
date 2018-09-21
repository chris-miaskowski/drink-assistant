# drink-assistant

https://firebase.google.com/docs/functions/get-started

`firebase deploy --only functions` to deploy


https://firebase.google.com/docs/functions/local-emulator#serve_functions_using_a_cloud_functions_shell 
`cd functions/ && firebase serve` to run functions locally


`firebase functions:shell` to test locally
```
let data = require('./functions/fulfillment.json');
addDrink({ method: "POST", json: true, body: data });
```