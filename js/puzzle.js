var _level = null;

var stage = null;
var canvas = null;
var img = null;

var puzzleWidth = null;
var puzzleHeight = null;

var pieces = null;
var pieceWidth = null;
var pieceHeight = null;

var currentPiece = null;
var currentDropPiece = null;

var mouse = null;

function init()
{
    img = new Image();
    img.addEventListener('load', onImage, false);
    
    if (typeof(Storage)!== "undefined" && localStorage.getItem('level') != null)
        _level = localStorage.getItem('level');
    else
        _level = 4;

    img.src = "./images/puzzle.jpg";
}

function onImage(e)
{
    pieceWidth = Math.floor(img.width / _level)
    pieceHeight = Math.floor(img.height / _level)
    puzzleWidth = pieceWidth * _level;
    puzzleHeight = pieceHeight * _level;
    setCanvas();
    initPuzzle();
    shufflePuzzle();
}

function setCanvas()
{
    canvas = document.getElementById('canvas');
    stage = canvas.getContext('2d');
    canvas.width = puzzleWidth;
    canvas.height = puzzleHeight;
    canvas.style.border = "5px solid white";
}

function initPuzzle()
{
    pieces = [];
    mouse = {x:0, y:0};
    currentPiece = null;
    currentDropPiece = null;
    stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
    buildPieces();
}

function buildPieces()
{
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;

    for(i = 0; i < _level * _level; i++)
    {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        pieces.push(piece);
        xPos += pieceWidth;

        if(xPos >= puzzleWidth)
        {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
}

function shufflePuzzle()
{
    pieces = shuffleArray(pieces);
    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);

    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;

    for(i = 0; i < pieces.length; i++)
    {
        piece = pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
        stage.strokeRect(xPos, yPos, pieceWidth,pieceHeight);
        xPos += pieceWidth;

        if(xPos >= puzzleWidth)
        {
            xPos = 0;
            yPos += pieceHeight;
        }
    }

    document.onmousedown = onPuzzleClick;
}

function onPuzzleClick(e)
{
    if(e.layerX || e.layerX == 0)
    {
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0)
    {
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
    }

    currentPiece = checkPieceClicked();

    if(currentPiece != null)
    {
        stage.clearRect(currentPiece.xPos,currentPiece.yPos,pieceWidth,pieceHeight);
        stage.save();
        stage.globalAlpha = 0.9;
        stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
        stage.restore();
        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}

function checkPieceClicked()
{
    var i;
    var piece;

    for(i = 0;i < pieces.length;i++)
    {
        piece = pieces[i];

        if(!(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)))
            return piece;
    }

    return null;
}

function updatePuzzle(e)
{
    currentDropPiece = null;

    if(e.layerX || e.layerX == 0)
    {
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0)
    {
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
    }

    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);

    var i;
    var piece;

    for(i = 0; i < pieces.length; i++)
    {
        piece = pieces[i];

        if(piece == currentPiece)
            continue;

        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);

        if(currentDropPiece == null)
            if(!(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)))
            {
                currentDropPiece = piece;
                stage.save();
                stage.globalAlpha = .4;
                stage.fillStyle = '#80cc80';
                stage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
                stage.restore();
            }
    }

    stage.save();
    stage.globalAlpha = .6;
    stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
    stage.restore();
    stage.strokeRect( mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth,pieceHeight);
}

function pieceDropped(e)
{
    document.onmousemove = null;
    document.onmouseup = null;

    if(currentDropPiece != null)
    {
        var tmp = {xPos:currentPiece.xPos, yPos:currentPiece.yPos};
        currentPiece.xPos = currentDropPiece.xPos;
        currentPiece.yPos = currentDropPiece.yPos;
        currentDropPiece.xPos = tmp.xPos;
        currentDropPiece.yPos = tmp.yPos;
    }

    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin()
{
    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);

    var gameWin = true;
    var i;
    var piece;

    for(i = 0; i < pieces.length; i++)
    {
        piece = pieces[i];
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
        if(piece.xPos != piece.sx || piece.yPos != piece.sy)
            gameWin = false;
    }

    if(gameWin)
        setTimeout(gameOver, 500);
}

function gameOver()
{
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
}

function shuffleArray(o)
{
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function saveOptions()
{
    if (typeof(Storage) !== "undefined")
    {
        localStorage.setItem('level', $('#level').val());
        gameOver();
    }
    else
        alert("El navegador no puede trabajar offline.");
}

function handleFileSelect(evt)
{
    var f = evt.target.files[0]; 

    if (f.type.match('image.*'))
    {
        var reader = new FileReader();
        reader.onload = (function(theFile)
        {
            return function(e)
            {
                img = new Image();
                img.addEventListener('load',onImage,false);
                img.src = e.target.result;
            };
        })(f);

        reader.readAsDataURL(f);
    }
}

$(document).ready(function()
{
    document.getElementById('pic').addEventListener('change', handleFileSelect, false);
});