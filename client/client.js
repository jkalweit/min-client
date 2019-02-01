var socket = io();
socket.on('reload', function() {
    window.location.reload();
});

function el(tag, innerHTML, parent) {
    var element = document.createElement(tag);
    element.innerHTML = innerHTML || '';
    if(parent) parent.appendChild(element);
    return element;
}


window.onload = function() {
    console.log('Building client...');

    var main = document.getElementById('main');
    main.innerHTML = '';
    var message = el('h2', 'Ready.', main);
    var button = el('button', 'Do Test!', main);
    button.onclick = function() { 
        socket.emit('clicked');
        console.log('Did test!');
    };


    socket.on('data', function(data) {
        console.log('data', data);
        message.innerHTML = 'Clicked: ' + data.clickedCount;
    });

    console.log('Built client.');
};
