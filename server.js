const http = require('http');
const fs = require('fs');
const express = require('express');
const socketio = require('socket.io');
const chokidar = require('chokidar');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);


const filepath = __dirname + '/data.json';
var data = {};
if(fs.existsSync(filepath)) {
	console.log('loading ' + filepath + '...');
	data = JSON.parse(fs.readFileSync(filepath));
} else {
    data = { clickedCount: 0 };
    save();
}

function save() {
	fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    io.emit('data', data);
}


app.use('/', express.static('./client/'));


io.on('connection', socket => {
    console.log('Client connected.');
    socket.emit('data', data);
    socket.on('clicked', () => {
        data.clickedCount++;
        save();
    });
});


/* For Debugging, send a signal when file changes */
chokidar.watch('./client', { depth: 99 }).on('change', (filePath) => {
    if(filePath.match(/\.js$/i) !== null 
            || filePath.match(/\.html$/i) !== null 
            || filePath.match(/\.css$/i) !== null
      ) {
        console.log('file changed!', filePath);
        io.emit('reload');
    };
});




server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("dev listening at", addr.address + ":" + addr.port);
});

