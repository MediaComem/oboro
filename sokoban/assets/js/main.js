window.currentPart = function sokoban(){


var options = {hashTracking: false, closeOnOutsideClick: false};

$('#sokoban').append("<div data-remodal-id=\"modal\" ><h2>Sokoban</h2><p>Utilise les flêches ou appuie sur les boutons pour faire bouger les pierres !</p><div class=\"instruction-images\"><img src=\"./sokoban/assets/img/left-right-up-down.png\" alt=\"left-right-up-down\"/></div><button data-remodal-action=\"confirm\" class=\"remodal-confirm\">OK</button></div>   ");


var inst = $('[data-remodal-id=modal]').remodal();
inst.open();


	/***/
var level = new Array();

var levelDataLine = new Array();
levelDataLine[0] = "@@@@@@@@@@@@@@@@@";
levelDataLine[1] = "@  @  @  @  @ x @";
levelDataLine[2] = "@> o  @     @   @";
levelDataLine[3] = "@  @     @      @";
levelDataLine[4] = "@  @  @  @  @   @";
levelDataLine[5] = "@@@@@@@@@@@@@@@@@";

level[0] = new levelObject(levelDataLine);

levelDataLine = new Array();
levelDataLine[0] = "@@@@@@@@@@@@@@@@@";
levelDataLine[1] = "@@@@@@@@@     <@@";
levelDataLine[2] = "@@@@@@@@@ o@  @@@";
levelDataLine[3] = "@@@@@@@@@     @@@";
levelDataLine[4] = "@@@@@@@@@   @ @@@";
levelDataLine[5] = "@x     @@   o   @";
levelDataLine[6] = "@@              @";
levelDataLine[7] = "@x     @@@@@@@@@@";
levelDataLine[8] = "@@@@@@@@@@@@@@@@@";

level[1] = new levelObject(levelDataLine);

levelDataLine = new Array();
levelDataLine[0] = "@@@@@@@@@@@@@@@@@";
levelDataLine[1] = "@@@@@@   @@@@@@@@";
levelDataLine[2] = "@@@@@@ @>o @@@@@@";
levelDataLine[3] = "@@@@@@x  @ @@@@@@";
levelDataLine[4] = "@@@@@@ ox  @@@@@@";
levelDataLine[5] = "@@@@@@@  @@@@@@@@";
levelDataLine[6] = "@@@@@@@  @@@@@@@@";
levelDataLine[7] = "@@@@@@@@@@@@@@@@@";

level[2] = new levelObject(levelDataLine);



function levelObject(datalineArray){
	this.cratesToPlace = 0;
	this.levelMapOrig = new Array();
	this.levelHeight = datalineArray.length;
	for(i=0;i<this.levelHeight;i++){
		this.levelMapOrig[i] = new Array();
		this.levelWidth = datalineArray[i].length;
		for(j=0;j<this.levelWidth;j++){
			if(datalineArray[i].charAt(j) == "@"){
				this.levelMapOrig[i][j] = 1;
			}else if(datalineArray[i].charAt(j) == "o"){
				this.levelMapOrig[i][j] = 2;
			}else if(datalineArray[i].charAt(j) == "x"){
				this.levelMapOrig[i][j] = 3;
				this.cratesToPlace += 1;
			}else if(datalineArray[i].charAt(j) == "^"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 0;
			}else if(datalineArray[i].charAt(j) == "v"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 3;
			}else if(datalineArray[i].charAt(j) == "<"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 1;
			}else if(datalineArray[i].charAt(j) == ">"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 2;
			}else {
				this.levelMapOrig[i][j] = 0;
			}
		}
	}
}


/***/

parts.push(new Part("ogre"));
  
parts[parts.length-1].video = true;


var Direction = {
    Up: 0,
    Left: 1,
    Right: 2,
    Down: 3
};

var Tile = {
    None: -1,
    Empty: 0,
    Wall: 1,
    Crate: 2,
    Slot: 3,
    Start: 4
};

//graphics
var canvas;
var context;


canvas = document.getElementById("myDrawing");
context = canvas.getContext("2d");



var ImageLoader = {
    imgArray: [],
    toLoad: 0,
    tileArray: [],
    callback: 0,
    init: function(array,callback){
            this.imgArray = array;
            this.toLoad = this.imgArray.length;
            this.callback = callback;
            for(i in this.imgArray){
                    this.tileArray[i] = 0;
            }
    },
    startLoading: function(){
            for(i in this.imgArray){
                    img = new Image;
                    img.src = this.imgArray[i];
                    img.imgIndex = i;
                    img.onload = function(){
                            ImageLoader.finishedLoading(this);
                    }
            }
    },
    finishedLoading: function(img){
            this.toLoad -= 1;
            this.tileArray[img.imgIndex] = new tileFromImage(img);
            if(this.toLoad <= 0){
                    this.callback(this.tileArray);
            }
    }
}

ImageLoader.init(new Array("./sokoban/assets/img/textures/ground.png","./sokoban/assets/img/textures/wall.png","./sokoban/assets/img/textures/stone2.png"),mapTilesLoaded);
ImageLoader.startLoading();


var playerTileSet;
var floorTile;
var wallTile;
var crateTile;

playerDirOffset = new Array(3,1,2,0);
playerAniOffset = new Array(0,1,2,3);
var mapTiles = new Array();
var playerTiles = new Array();

//selected level
var currentLevel = 0;
var levelMap;
var placedCrates;
var moves = 0;
var pushes = 0;

var tileXSize = 32;
var tileYSize = 32;

// History of moves, to undo if necessary.
var step = new Array();
var maxSteps = 500;

//Player
var player = new playerObject();
function playerObject(){
    this.x = 0;
    this.y = 0;
    this.startX = 0;
    this.startY = 0;
    this.startDir = 0;
    this.d = 3;
    this.ani = 0;

    this.animate = function(){
        this.ani++;
        if(this.ani > 3){this.ani=0;}
    }

    this.setStartPos = function(x,y,d){
        this.startX = x;
        this.startY = y;
        this.startDir = d;
    }

    this.setPos = function(x,y,d){
        this.x = x;
        this.y = y;
        this.d = d;
    }

    this.reset = function(){
        this.setPos(this.startX,this.startY,this.startDir);
    }

    this.moveUp = function(){

        if(handleMove(Direction.Up)){

                this.y -= 1;
                moves += 1;

        }
        this.d = Direction.Up;

        this.animate();
    }

    this.moveDown = function(){
        if(handleMove(Direction.Down)){
                this.y += 1;
                moves += 1;
        }
        this.d = Direction.Down;
        this.animate();
    }

    this.moveLeft = function(){
        if(handleMove(Direction.Left)){
                this.x -= 1;
                moves += 1;
        }
        this.d = Direction.Left;
        this.animate();
    }

    this.moveRight = function(){
        if(handleMove(Direction.Right)){
                this.x += 1;
                moves += 1;
        }
        this.d = Direction.Right;
        this.animate();
    }
}

function stepObject(px,py,pd,cm,cx,cy,cd){
    this.playerPrevX = px;
    this.playerPrevY = py;
    this.playerPrevDir = pd;
    this.crateMoved = cm;
    if(this.crateMoved){
        this.crateX = cx;
        this.crateY = cy;
        this.cratePushDir = cd;
    }
}

function addStep(px,py,pd,cm,cx,cy,cd){
    if(step.length === maxSteps){
        step.shift();
    }
    step.push(new stepObject(px,py,pd,cm,cx,cy,cd));
}

function undoMove(){
    if(step.length > 0){
        var thisStep = step.pop();
        player.setPos(thisStep.playerPrevX,thisStep.playerPrevY,thisStep.playerPrevDir);
        if(thisStep.crateMoved){
            switch(thisStep.cratePushDir){
                case Direction.Up:
                    levelMap[thisStep.crateY][thisStep.crateX] = Tile.Empty;
                    levelMap[thisStep.crateY + 1][thisStep.crateX] = Tile.Crate;
                break;
                case Direction.Left:
                    levelMap[thisStep.crateY][thisStep.crateX] = Tile.Empty;
                    levelMap[thisStep.crateY][thisStep.crateX + 1] = Tile.Crate;
                break;
                case Direction.Right:
                    levelMap[thisStep.crateY][thisStep.crateX] = Tile.Empty;
                    levelMap[thisStep.crateY][thisStep.crateX - 1] = Tile.Crate;
                break;
                case Direction.Down:
                    levelMap[thisStep.crateY][thisStep.crateX] = Tile.Empty;
                    levelMap[thisStep.crateY - 1][thisStep.crateX] = Tile.Crate;
                break;
            }
        }
        drawField();
    } else {
        console.log("No more moves to undo!");
    }
}

function tileFromImage(img){
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx.drawImage(img,0,0,32,32);
}

function tileFromSubImage(img, srcX, srcY, subW, subH){
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 32;
    this.canvas.height = 32;
    this.ctx.drawImage(img,srcX,srcY,subW,subH,0,0,32,32);
}


function loadPlayerTiles(){

    playerTileSet = new Image();
    playerTileSet.src = "./sokoban/assets/img/my_sprites_charset.png";
    playerTileSet.onload = function(){
            context.drawImage(playerTileSet,0,0);
            for(i=0;i<4;i++){
                    playerTiles[i] = new Array();
                    for(j=0;j<4;j++){
                            playerTiles[i].push(new tileFromSubImage(playerTileSet,j*32,i*32,32,32));
                    }
            }
            resetLevel();
    }
}

function mapTilesLoaded(tileArray){

    mapTiles = tileArray;
    loadPlayerTiles();
}




function bordersWallsOnly(map,x,y,xMax,yMax){
    //alert(map[0][0])
    for(yDif = -1; yDif <= 1; yDif++){
        for(xDif = -1; xDif <= 1; xDif++){
            if(!(yDif === 0 && xDif === 0)){
                newX = x + xDif;
                newY = y + yDif;
                if(newX >= 0 && newX <= xMax){
                    if(newY >= 0 && newY <= yMax){
                        //alert(newY)
                        if(map[newY][newX] != Tile.Wall && map[newY][newX] != Tile.None){
                            return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function removeWalls(map){
    //alert(map)
    xMax = level[currentLevel].levelWidth - 1;
    yMax = level[currentLevel].levelHeight - 1;
    xMin = 0;
    yMin = 0;
    for(i=0;i<=yMax;i++){
        for(j=0;j<=xMax;j++){
            if(bordersWallsOnly(map,j,i,xMax,yMax)){
                map[i][j] = Tile.None;
            }
        }
    }
}

function resetLevel(){
    levelMap = new Array();
    for(i=0;i<level[currentLevel].levelHeight;i++){
        levelMap[i] = new Array();
        for(j=0;j<level[currentLevel].levelWidth;j++){
            switch(level[currentLevel].levelMapOrig[i][j]){
                case 1:
                    levelMap[i][j] = Tile.Wall;
                break;
                case 2:
                    levelMap[i][j] = Tile.Crate;
                break;
                case 3:
                    levelMap[i][j] = Tile.Empty;
                break;
                case 4:
                    levelMap[i][j] = Tile.Empty;
                break;
                default:
                    levelMap[i][j] = Tile.Empty;
                break;
            }
        }
    }

    player.setStartPos(level[currentLevel].playerStartX,level[currentLevel].playerStartY,level[currentLevel].playerStartDir);
    player.reset();

    placedCrates = 0;
    moves = 0;
    pushes = 0;
    step.length = 0;

    //interface changes
    //updateStats();
    resizeInterface();
    removeWalls(levelMap);
    drawField();
}

function gotoNextLevel(){
    if(currentLevel < (level.length - 1)){
        currentLevel += 1;
        clearCanvas();
        resetLevel();
        drawField();
    }
}

function gotoPrevLevel(){
    if(currentLevel > 0){
        currentLevel -= 1;
        clearCanvas();
        resetLevel();
        drawField();
    }
}

function clearCanvas(){
    var canvas = document.getElementById("myDrawing");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}


function checkField(){
    placedCrates = 0;
    for(i=0;i<level[currentLevel].levelHeight;i++){
        for(j=0;j<level[currentLevel].levelWidth;j++){
            if(levelMap[i][j] === Tile.Crate){
                if(level[currentLevel].levelMapOrig[i][j] === Tile.Slot){
                    placedCrates += 1;
                }
            }
        }
    }
    if(placedCrates === level[currentLevel].cratesToPlace){
        if((currentLevel + 1) < level.length){
            gotoNextLevel();
        } else {

            console.log('VIDEO SUIVANTE')

            window.next();
            inst.destroy();
            /*
            show bpx id suiv.
            */
        }
    }
}

function drawField(){
    for(i=0;i<level[currentLevel].levelHeight;i++){
        for(j=0;j<level[currentLevel].levelWidth;j++){
                drawTile(j,i);
        }
    }
    context.drawImage(playerTiles[playerDirOffset[player.d]][player.ani].canvas,player.x*tileXSize,player.y*tileYSize);
}

function drawPartial(){
    switch(player.d){
        case Direction.Up:
            drawTile(player.x,player.y - 1);
            drawTile(player.x,player.y + 1);
        break;
        case Direction.Left:
            drawTile(player.x + 1,player.y);
            drawTile(player.x - 1,player.y);
        break
        case Direction.Right:
            drawTile(player.x + 1,player.y);
            drawTile(player.x - 1,player.y);
        break;
        case Direction.Down:
            drawTile(player.x,player.y - 1);
            drawTile(player.x,player.y + 1);
        break;
    }
    drawTile(player.x,player.y);
    context.drawImage(playerTiles[playerDirOffset[player.d]][player.ani].canvas,player.x*tileXSize,player.y*tileYSize);
}

function drawTile(x,y){
    switch(levelMap[y][x]){
        case Tile.None:
            drawRectangle(x*tileXSize,y*tileYSize,tileXSize,tileYSize, "transparent");
            break;
        case Tile.Wall:
            context.drawImage(mapTiles[Tile.Wall].canvas,x*tileXSize,y*tileYSize);
            break;
        case Tile.Crate:
            context.drawImage(mapTiles[Tile.Crate].canvas,x*tileXSize,y*tileYSize);
            break;
        default:
            context.drawImage(mapTiles[Tile.Empty].canvas,x*tileXSize,y*tileYSize);
            if(level[currentLevel].levelMapOrig[y][x] === Tile.Slot){
                drawCircle(x*tileXSize + 16, y*tileYSize + 16, 7, "#000000");
                drawCircle(x*tileXSize + 16, y*tileYSize + 16, 3, "#d2047b");
            }
            if(level[currentLevel].levelMapOrig[y][x] === Tile.Start){
                drawCircle(x*tileXSize + 16, y*tileYSize + 16, 7, "transparent");
            }
        break;
    }
}

function handleMove(moveDir){
    var xdif = 0;
    var ydif = 0;
    switch(moveDir){
        case Direction.Up:
            ydif = -1;
        break;
        case Direction.Left:
            xdif = -1;
        break;
        case Direction.Right:
            xdif = 1;
        break;
        case Direction.Down:
            ydif = 1;
        break;
    }
    if(levelMap[player.y + ydif][player.x + xdif] != Tile.Wall){
        if(levelMap[player.y + ydif][player.x + xdif] === Tile.Crate){
            if(levelMap[player.y + (ydif * 2)][player.x + (xdif * 2)] === Tile.Empty){
                levelMap[player.y + ydif][player.x + xdif] = Tile.Empty;
                levelMap[player.y + (ydif * 2)][player.x + (xdif * 2)] = Tile.Crate;
                addStep(player.x, player.y, player.d, true, player.x + (xdif * 2), player.y + (ydif * 2),moveDir);
                pushes += 1;
                return true;
            }
        } else {
            addStep(player.x,player.y,player.d,false,0,0,0);
            return true;
        }
    }
    return false;
}
// Controls button adds






document.onkeydown = function(e){
    var thisEvent = e;
    // add support for webkit key events
    switch(thisEvent.keyCode){
        case 38: player.moveUp(); break;
        case 37: player.moveLeft(); break;
        case 39: player.moveRight(); break;
        case 40: player.moveDown(); break;
				case 78: gotoNextLevel(); break;
        case 0:
            if(thisEvent.charCode === 114){
                resetLevel();
            } else if (thisEvent.charCode === 117) {
                undoMove();
            }
        break;
    }
    drawPartial();
    checkField();
    //updateStats();
};

function drawCircle(x,y,r,fillCol){
    context.fillStyle=fillCol;
    context.beginPath();
    context.arc(x,y,r,0,Math.PI*2,true);
    context.closePath();
    context.fill();
}

function drawRectangle(x,y,w,h,fillCol){
    context.fillStyle=fillCol;
    context.fillRect(x,y,w,h);
}

function updateStats(){
    var infoField = document.getElementById("levelInfo");
    infoField.innerHTML = "Level: " + (currentLevel + 1);
    infoField = document.getElementById("stepsInfo");
    infoField.innerHTML = "Moves: " + moves;
    infoField = document.getElementById("pushesInfo");
    infoField.innerHTML = "Pushes: " + pushes;
    infoField = document.getElementById("cratesInfo");
    infoField.innerHTML = "Crates in place: " + placedCrates + " / "  + level[currentLevel].cratesToPlace;
}

function resizeInterface(){
    canvas.width = level[currentLevel].levelWidth * tileXSize;
    canvas.height = level[currentLevel].levelHeight * tileYSize;
    /*
    var scorePanel = document.getElementById("scoreBoard");
    var levelPanel = document.getElementById("levelControl");
    scorePanel.style.width = "" + canvas.width + "px";
    levelPanel.style.width = "" + canvas.width + "px";

    var helpDiv = document.getElementById("help");
    helpDiv.style.top = (canvas.offsetTop + 10) + "px";
    helpDiv.style.left = (canvas.offsetLeft + 10) + "px";
    helpDiv.style.width = (canvas.width - 30) + "px";
    helpDiv.style.height = (canvas.height - 30) + "px";*/
}

function showHelp(){
    var helpDiv = document.getElementById("help");
    //alert (helpDiv.style.);
    helpDiv.style.display = "block";
}

function hideHelp(){
    var helpDiv = document.getElementById("help");
    //alert (helpDiv.style.);
    helpDiv.style.display = "none";
}



$(function() {

  // Controls for mobile devices

  $('#arrow_top').on('click', function(){

    var e = $.Event("keydown", { keyCode: 38}); //"keydown" if that's what you're doing

    $('body').trigger(e);
    console.log('fdfddfdkg')
  })
  $('#arrow_bottom').on('click', function(){
    var e = $.Event("keydown", { keyCode: 40}); //"keydown" if that's what you're doing
    $("body").trigger(e);
  })
  $('#arrow_left').on('click', function(){
    var e = $.Event("keydown", { keyCode: 37}); //"keydown" if that's what you're doing
    $("body").trigger(e);
  })
  $('#arrow_right').on('click', function(){
    var e = $.Event("keydown", { keyCode: 39}); //"keydown" if that's what you're doing
    $("body").trigger(e);
  })

  // Control for cancel move and reload level

  $('#btn_game_reload').on('click', function(){

    resetLevel();
  })

  $('#btn_game_cancel').on('click', function(){
    undoMove();
  })
/*
  // Adding instructions
  var title = "Aide le panda!";
  var description = "Pousse les pierres sur leurs emplacements pour libérer ton amis le panda.";

  $('#instructions h3').text(title);
  $('#instructions p.description').text(description);

//  var cmd = $('<span>commandes:</span>');
  var cmd_img = "<img src=\"./assets/img/arrowkeys.png\" class=\"img-responsive\"/>";
  var cmd_description = "Déplacements";

  //$('#instructions p.inst_controls').html(cmd);
  $('#instructions p.inst_controls').append('<br/>'+cmd_img)
  $('#instructions p.inst_controls').append('<br/><br/>'+cmd_description)
*/
  // prevent double tap
  $.fn.nodoubletapzoom = function() {
      $(this).bind('touchstart', function preventZoom(e){
          var t2 = e.timeStamp;
          var t1 = $(this).data('lastTouch') || t2;
          var dt = t2 - t1;
          var fingers = e.originalEvent.touches.length;
          $(this).data('lastTouch', t2);
          if (!dt || dt > 500 || fingers > 1){
              return; // not double-tap
          }
          e.preventDefault(); // double tap - prevent the zoom
          // also synthesize click events we just swallowed up
          $(e.target).trigger('click');
      });
  };
  $("body").nodoubletapzoom();

  /*function isTouchDevice() {
      return 'ontouchstart' in document.documentElement;
  }
  if (isTouchDevice()) {
    // on Mobile
    console.log('mobile')
}
else {
    // on Desktop
    console.log('desktop')
}*/


  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

     //alert('mobile')
     $('head').append('<link rel=\"stylesheet\" href=\"./sokoban/mqmobile.css\" />')


    //
     /*function toggleFullScreen() {
        if (!document.fullscreenElement &&    // alternative standard method
            !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        } else {
          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
        }
      }

     $('#arrow_bottom').on('click', function(){

       toggleFullScreen();
     })*/



  }



});





}
