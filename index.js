
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt')
const Gpio = require('onoff').Gpio;

function turnOn(fake){
    if(fake){
        console.log("FAKE - Water is turned on");
    } else {
        const led = new Gpio(120, 'out');
        led.writeSync(1)
        led.unexport();
    }

    /*
    Safety timeout when to close down the watering if no one turns it off
    setTimeout(function(){
            led.writeSync(0);
            led.unexport();
        },5000)*/
}

function turnOff(fake){
    if(fake){
        console.log("FAKE - Water is turned off");
    } else {
        const led = new Gpio(120, 'out');
        led.writeSync(0);
        led.unexport();
    }
}

function watering(fake, state){
    if(state == "0"){
        turnOff(fake);
    } else{
        turnOn(fake);
    }
}

client.on('connect', function () {
  client.subscribe('watering', function (err) {
    if (!err) {
      client.publish('watering', 'Hello mqtt')
    }
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())

  watering(1, message.toString());
  //client.end()
})


console.log("Starting listener");