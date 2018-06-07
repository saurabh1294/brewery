var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var os = require('os');
var fs = require('fs');
var host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: true
}));

//app.set('port', process.env.PORT || 8001);
//var port = process.env.PORT || 8001;
var server = http.createServer(app);

// Use the below 2 lines while running server directly
/*console.log('Server listening to http://' + host + ':' + port);
app.listen(port, host); */
app.use(express.static(__dirname));

app.get('/', function(req, res) {	
	res.sendFile('./index.html');
})

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
});

app.get('/getData', function(req, res) {
	console.log("Inside getData API call");
	var response = [];
	try {
		for (var i = 0; i < 5; i++) {
			var containerTemperature = randNum(Math.floor(Math.random() * 234327)) % 10 + 3,
				obj = {
					temperature : containerTemperature,
					containerNumber: i
				};
				
				response.push(obj);
		}
		
		res.send(response);
	} catch (err) {
		console.log("Error reading file ", err);
	}
});


function rnd() {
	var today = today = new Date();
	var seed = today.getTime();
	// generate some random seed here
	seed = (seed * 9301 + 49297) % 233280;
	return seed / (233280.0);
}

function randNum(number) {
	//this will return the truncated random number
	var r = rnd();
	if (!r) {
		r++;
	}
	return Math.floor(r * number);
}


// export start module to start server via grunt file
module.exports = {
	start: function(port) {
		server.listen(port);
	}
}
