'use strict';
 
const functions = require('firebase-functions');
const admin=require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
  
  credential:admin.credential.applicationDefault(),
  databaseURL: 'ws://yo-yo-pizza-eymkdi.firebaseio.com/'
});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  
function putDataIntoDb(agent){
  const type=agent.parameters.type;
  const size=agent.parameters.size;
  const count=agent.parameters.count;
  const phoneno=agent.parameters.phoneno;
  const address=agent.parameters.address;
 var status='start prepraring';
 
  //var mail = mailid;
  return admin.database().ref(phoneno).set({
   
   type: type,
    size: size,
    address: address,
    count: count,
    status: status
  });
  
}
 
  function getStatusOfOrder(agent){
    
    	const st = agent.parameters.phone_number;
     return admin.database().ref(st).once('value').then((snapshot) =>{
    
      const value=snapshot.child('status').val();
      if(value!==null){
        agent.add(`your Pizza ${value}`);
      }else{
      	agent.add(`Please enter vvalid contact no. again`);
      }
    });
   
   
  }
  
  function function2(agent){
    
    	const st = agent.parameters.phone_number2;
     return admin.database().ref(st).once('value').then((snapshot) =>{
    
      const value=snapshot.child('status').val();
      if(value!==null){
        agent.add(`your Pizza ${value}`);
      }else{
      	agent.add(`Please enter valid contact no. again`);
      }
    });
   
   
  }
  
  
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
   intentMap.set('Order_Pizza',putDataIntoDb);
   intentMap.set('get_status', getStatusOfOrder);
  intentMap.set('get_Status2',function2);
  agent.handleRequest(intentMap);
});
