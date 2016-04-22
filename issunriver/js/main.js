// Start enchant.js
enchant();

//var bodywidth = $(document).width()/2;
//--> A adapter à la div jeux
//var bodywidth = $(document).width()/2;

window.onload = function() {
    // Starting point
	var bodywidth = $(document).width()/2;
	var bodyheight = $(document).height()/2;
	
	console.log("Document height: "+bodyheight);
	console.log("Document width: "+bodywidth);
    var game = new Game(bodywidth, bodyheight);
    game.preload('res/IssunSheet.png',
                 'res/waste.png',
                 'res/Hit.mp3',
                 'res/bgm.mp3',
				 'res/terre.PNG');
    game.fps = 30;
	
    game.scale = 1;
    game.onload = function() {
        // Once Game finish loading
        console.log("JEUX BIEN CHARGE!");
        var scene = new SceneGame();
        game.pushScene(scene);
    }
    window.scrollTo(0,0);
    game.start(); 
     
};

/**
 * SceneGame  
 */
var SceneGame = Class.create(Scene, {
    /**
     * The main gameplay scene.     
     */
    initialize: function() {
        var game, label, bg, issun, terre, iceGroup;
 
        // Call superclass constructor
        Scene.apply(this);
 
        // Access to the game singleton instance
        game = Game.instance;
 
        label = new Label('SCORE<br>0');
        label.x = 9;
        label.y = 32;        
        label.color = 'white';
        label.font = '16px strong';
        label.textAlign = 'center';
        label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
        this.scoreLabel = label;        
		
		var bodywidth = $(document).width()/2;
		var bodyheight = $(document).height()/2;
		bg = new Sprite(bodywidth,bodyheight);        
        //bg.image = game.assets['res/hokusai.png'];
       

        issun = new Issun();
        issun.x = game.width/10;
        issun.y =  game.height/4;
        
        this.issun = issun;

		terre = new Terre();
		terre.x = game.width/1.1;
		//terre.y =  game.height/4;
		terre.y =  0;
		
		this.terre = terre;
				
        iceGroup = new Group();
        this.iceGroup = iceGroup;
 
        this.addChild(bg);
        this.addChild(iceGroup);
        this.addChild(issun);
		this.addChild(terre);
        this.addChild(label);
        
        //move issun on 6 "lane"
        this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
        this.addEventListener(Event.ENTER_FRAME,this.update);
        //move issun live on Y axis
        this.addEventListener(Event.TOUCH_MOVE,this.handleTouchMove);
        
        

        // Instance variables
        this.generateIceTimer = 0;
        this.scoreTimer = 0;
		this.terreTimer = 0;
        this.score = 0;

        this.bgm = game.assets['res/bgm.mp3']; // Add this line
 
        // Start BGM
        //this.bgm.play();
    },
    handleTouchMove: function(evt){
            this.issun.y = evt.localY
            console.log("HandleTouchMove: "+evt.localY);
        }, 
    handleTouchControl: function (evt) {
        var bodywidth = $(document).width()/2;
		var bodyheight = $(document).height()/2;
        var laneHeight, lane, game;
        //laneHeight = 440/3;
        laneHeight = bodyheight/6;
		
		console.log("Y Click position: "+evt.localY);
		
        //lane = Math.floor(evt.y/laneHeight);
		lane = Math.floor(evt.localY/laneHeight);
		console.log("Correspond à la ligne: "+lane);
        //lane = Math.max(Math.min(2,lane),0);
						
        this.issun.switchToLaneNumber(lane);
		//this.issun.onenterframe();
    },
  
    update: function(evt) {
        // Score increase as time pass
        this.scoreTimer += evt.elapsed * 0.001;
        if(this.scoreTimer >= 1)
        {
            this.setScore(this.score + 1);
            this.scoreTimer -= 1;
        }
		//Quand un score est atteind issun atteind l'ile
		if(this.score >= 5){
			this.setScore(5);
			var game;
                game = Game.instance;
                game.assets['res/Hit.mp3'].play();			

								
                this.iceGroup.remove(ice);
                this.bgm.stop();        
                
				var xSpeed, game;
     
				game = Game.instance;
				xSpeed = 200;
				
				//la terre avance, issun aussi 999 à remplacer par le bord de la frame
				
				if(this.terre.x >= 999)
				{
				this.terre.x -= xSpeed * 0.03;
				}
				
				this.issun.x += xSpeed * 0.03;          
				// if(this.issun.x > game.width)
					// {
					// this.parentNode.removeChild(this);          
					// }
				
					
				}
			
			
        // Check if it's time to create a new set of obstacles
        this.generateIceTimer += evt.elapsed * 0.001;
        if(this.generateIceTimer >= 1)
        {
            var ice;
            this.generateIceTimer -= 1;
            ice = new Ice(Math.floor(Math.random()*6));
            this.iceGroup.addChild(ice);
        }

        // Check collision
		
		//N'entre pas dans la boucle de collision si le score le score est atteind
        if(this.score < 5){
		for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--) {
            var ice;
            ice = this.iceGroup.childNodes[i];
            if(ice.intersect(this.issun)){  
                var game;
                game = Game.instance;
                game.assets['res/Hit.mp3'].play();
                this.iceGroup.removeChild(ice);
                this.bgm.stop();
                game.replaceScene(new SceneGameOver(this.score));        
                break;
            }
        }
		}
		
		//
		
            if((this.terre).intersect(this.issun)){  
                var game;
                game = Game.instance;
                game.assets['res/Hit.mp3'].play();
                //this.iceGroup.removeChild(ice);
                //this.bgm.stop();
                //game.replaceScene(new SceneFinale());
				console.log("WINDOWS.NEXT");
				
                
			}
		
        // Loop BGM
        if( this.bgm.currentTime >= this.bgm.duration ){
            this.bgm.play();
        }
    },

    setScore: function (value) {
        this.score = value;
        this.scoreLabel.text = 'SCORE<br>' + this.score;
    }
});


/**
*Terre
*/

var Terre = Class.create(Sprite, {
	
initialize: function() {
        // Call superclass constructor
		var bodywidth = $(document).width()/2;
		var bodyheight = $(document).height()/2;
        //Sprite.apply(this,[103, 347]);
		Sprite.apply(this,[103, bodyheight]);
		this.image = Game.instance.assets['res/terre.PNG'];   
        
}})

/**
 * Issun
 */
 var Issun = Class.create(Sprite, {
    /**
     * The player character.     
     */
    initialize: function() {
        // Call superclass constructor
		var bodywidth = $(document).width()/2;
		var bodyheight = $(document).height()/2;
        Sprite.apply(this,[30, 43]);
        this.image = Game.instance.assets['res/IssunSheet.png'];        
        this.animationDuration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
    },
	
	
	
    updateAnimation: function (evt) {
		
				
		this.animationDuration += evt.elapsed * 0.001;       
        if(this.animationDuration >= 0.25)
        {
            this.frame = (this.frame + 1) % 2;
            this.animationDuration -= 0.25;
        }
    },

	
   switchToLaneNumber: function(lane){ 
	var bodywidth = $(document).width()/2;
	var bodyheight = $(document).height()/2;   
        //var targetY = 310 - this.height/2 + (lane-1)*90;
		var targetY =  50 + (lane)*bodyheight/6;
		
        this.y = targetY;
        
    }


});

 /**
 * Ice Cube
 */
var Ice = Class.create(Sprite, {
    /**
     * The obstacle that the issun must avoid
     */
    initialize: function(lane) {
		var bodywidth = $(document).width()/2;
		var bodyheight = $(document).height()/2;
        // Call superclass constructor
        Sprite.apply(this,[63, 38]);
        this.image  = Game.instance.assets['res/waste.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
		//position des ices en brut
		var bodywidth = $(document).width()/2;
		this.moveBy(bodywidth,100,0);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
		var bodywidth = $(document).width()/2;
	var bodyheight = $(document).height()/2;
        var game, distance;
        game = Game.instance;        
        distance = -(bodyheight/6);
     
        this.rotationSpeed = Math.random() * 100 - 50;
     
	 
		//var targetY =  this.height/2 + (lane)*73;
        //this.y = game.height/2 - this.height/2 + (lane - 1) * distance;
		
		this.y = game.height/2 - this.height/2 + (lane) * distance;
        this.x = -this.width;    
        this.rotation = Math.floor( Math.random() * 360 );    
    },

    update: function(evt) { 
        var xSpeed, game;
     
        game = Game.instance;
        xSpeed = 200;
     
		//- pour droite gauche
        this.x -= xSpeed * evt.elapsed * 0.001;
        this.rotation += this.rotationSpeed * evt.elapsed * 0.001;           
        if(this.x > game.width)
        {
            this.parentNode.removeChild(this);          
        }
    }
});





/**
 * SceneGameOver  
 */
var SceneGameOver = Class.create(Scene, {
    initialize: function(score) {
        var gameOverLabel, scoreLabel;
        Scene.apply(this);
        this.backgroundColor = '';

        gameOverLabel = new Label("GAME OVER<br>Tap to Restart");
        gameOverLabel.x = 8;
        gameOverLabel.y = 128;
        gameOverLabel.color = 'black';
        gameOverLabel.font = '32px strong';
        gameOverLabel.textAlign = 'center';

        scoreLabel = new Label('SCORE<br>' + score);
        scoreLabel.x = 9;
        scoreLabel.y = 32;        
        scoreLabel.color = 'black';
        scoreLabel.font = '16px strong';
        scoreLabel.textAlign = 'center';

        this.addChild(gameOverLabel);
        this.addChild(scoreLabel);

        this.addEventListener(Event.TOUCH_START, this.touchToRestart);


    },

    touchToRestart: function(evt) {
        var game = Game.instance;
        game.replaceScene(new SceneGame());
    }
});