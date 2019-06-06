
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt')
const Gpio = require('onoff').Gpio;

function turnOn(fake){
    statusUpdate('Turning on...');
    if(fake){
        console.log("FAKE - Water is turned on");
    } else {
        const led = new Gpio(120, 'out');
        led.writeSync(1)
        led.unexport();
    }

    statusUpdate('Done turning on');

    /*
    Safety timeout when to close down the watering if no one turns it off
    setTimeout(function(){
            led.writeSync(0);
            led.unexport();
        },5000)*/
}

function turnOff(fake){
    statusUpdate('Turning off...');
    if(fake){
        console.log("FAKE - Water is turned off");
    } else {
        const led = new Gpio(120, 'out');
        led.writeSync(0);
        led.unexport();
    }
    statusUpdate('Done turning off');
}

function watering(fake, state){
    if(state == "0"){
        turnOff(fake);
    } else{
        turnOn(fake);
    }
}

function statusUpdate(message){
    console.log(message);
    client.publish('watering/statustext', message)
}

client.on('connect', function () {
  client.subscribe('watering/command', function (err) {
    if (!err) {
        statusUpdate('Connected and await command(1 or 0)');
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  statusUpdate('Recieved:' + message);

  watering(1, message.toString());
  //client.end()
})


console.log("Starting listener");