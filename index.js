
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://mqtt')
var Gpio = require('chip-gpio').Gpio;

function watering(fake){
    if(fake){
        console.log("Water is turned on");
        setTimeout(function(){
            console.log("Watering is turned of");
        },5000)
    } else{
        var led = new Gpio(120, 'out');
        led.write(1);
        setTimeout(function(){
            led.write(0);
            led.unexport();
        },5000)
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
  watering(1);
  //client.end()
})


console.log("Starting listener");