const DOMAIN =  "websockettictactoe.co.uk" // set to "127.0.0.1" or your servers ip/domain name if you want to host your own server you will need to change wss to ws as well unless you have a certificate
const PORT = "6080"

let canvas;
let canvasContext;
let player = [275, 275]
let players = []
let speed = 200
let direction = [0, 0]
let width = 50
let height = 50

let websocket = new WebSocket(`wss://${DOMAIN}:${PORT}/`);

websocket.onmessage = function (event)
{
    data = JSON.parse(event.data);
    switch (data.type) 
    {
        case 'new':
            console.log("testing")
            break;
        case 'update':
            players = data.players
            break;
    }
}

function init()
{
    canvas = document.getElementById('app');
    canvasContext = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyUp);

    window.requestAnimationFrame(draw);
}

function update(dTime)
{
    let old_pos = [player[0], player[1]]

    player[0] += speed * direction[0] * dTime
    player[1] += speed * direction[1] * dTime

    if (old_pos[0] != player[0] || old_pos[1] != player[1])
    {
        websocket.send(JSON.stringify({action: 'move', "pos": player}));
    }
}

let oldTimeStamp = 0;
function draw(timeStamp)
{
    dTime = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    update(dTime);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < players.length; i++)
    {
        colorRect(players[i][0], players[i][1], width, height, "#FFFFFF")
    }

    colorRect(player[0], player[1], width, height, "#FF0000")

    window.requestAnimationFrame(draw);
}

init();

function colorRect(leftX, topY, width, height, color)
{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}


let upKeyDown = false;
let downKeyDown = false;
let rightKeyDown = false;
let leftKeyDown = false;

function keyUp(evt)
{
    switch(evt.keyCode)
    {
        case 37:
            leftKeyDown = false;
            break
        case 38:
            upKeyDown = false;
            break
        case 39:
            rightKeyDown = false;
            break
        case 40:
            downKeyDown = false;
            break
    }
    direction[0] = rightKeyDown - leftKeyDown;
    direction[1] = downKeyDown - upKeyDown;
    
}

function keyPressed(evt)
{   

    switch(evt.keyCode)
    {
        case 37:
            if (!leftKeyDown)
            {  
                direction[0] = -1
                leftKeyDown = true;
            }
            break
        case 38:
            if (!upKeyDown)
            {
                direction[1] = -1
                upKeyDown = true;
            }
            break
        case 39:
            if (!rightKeyDown)
            {   
                direction[0] = 1
                rightKeyDown = true;
            }
            break
        case 40:
            if (!downKeyDown)
            {
                direction[1] = 1
                downKeyDown = true;
            }
            break
    }
}