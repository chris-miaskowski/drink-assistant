// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true
});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.test = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));
    response.status(200).send('OK');
});

exports.postDrink = functions.https.onRequest((request, response) => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    const agent = new WebhookClient({ request, response });

    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    function yourFunctionHandler(agent) {
        const batch = db.batch();
        const drinkCollection = db.collection('drink');
        const intakes = request.body.queryResult.outputContexts[0].parameters['drink-intake'];
        intakes.forEach(intake => {
            const drinkDoc = drinkCollection.doc(`ID-${Date.now()}`);
            batch.set(drinkDoc, intake);
        });
        return batch.commit().then(() => {
            return agent.add('Done 6!');
        });

        // const drinkDoc = drinkCollection.doc(`ID-${Date.now()}`);
        // return drinkDoc.set(intakes[0]).then();
    }
    // // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('notify-about-drink - yes', yourFunctionHandler);
    agent.handleRequest(intentMap);
});
