// Start enchant.js
enchant();

//var bodywidth = $(document).width();
//--> A adapter à la div jeux
//var bodywidth = $(document).width();

window.onload = function() {
    // Starting point
	var bodywidth = $(document).width();
	var bodyheight = $(document).height();
	
	console.log("Document height: "+bodyheight);
	console.log("Document width: "+bodywidth);
    var game = new Game(bodywidth, bodyheight);
    game.preload('res/IssunSheet.png',
                 'res/waste.png',
                 'res/Hit.mp3',
                 'res/bgm.mp3',
				 'res/alcool.mp3',
				 'res/bravo.mp3',
				 'res/terre.PNG',
                 'res/water.PNG',
				 'res/hokusai.gif',
				 'res/jura.png'  );
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
        var game, label, bg, issun, terre, enemyGroup;
 
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
		
		var bodywidth = $(document).width();
		var bodyheight = $(document).height();
		bg = new Sprite(bodywidth,bodyheight);        
        bg.image = game.assets['res/hokusai.gif'];
       

        issun = new Issun();
        issun.x = game.width/10;
        issun.y =  game.height/4;
        
        this.issun = issun;

		terre = new Terre();
		terre.x = game.width;
		
	
		//terre.y =  game.height/4;
		terre.y =  0;
		
		this.terre = terre;
				
        enemyGroup = new Group();
        this.enemyGroup = enemyGroup;
		
		bonusGroup = new Group();
        this.bonusGroup = bonusGroup;
 
        this.addChild(bg);
        this.addChild(enemyGroup);
		this.addChild(bonusGroup);
        this.addChild(issun);
		this.addChild(terre);
        this.addChild(label);
        
        //move issun on 6 "lane"
        this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
        this.addEventListener(Event.ENTER_FRAME,this.update);
        //move issun live on Y axis
        this.addEventListener(Event.TOUCH_MOVE,this.handleTouchMove);
        
        

        // Instance variables
		this.generateBonusTimer = 0;
        this.generateEnemyTimer = 0;
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
        var bodywidth = $(document).width();
		var bodyheight = $(document).height();
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
		if(this.score >= 25){
			this.setScore(25);
			var game;
                game = Game.instance;
                //game.assets['res/Hit.mp3'].play();			

								
                //this.enemyGroup.remove(enemy);
                this.bgm.stop();        
                
				var xSpeed, game;
     
				game = Game.instance;
				xSpeed = 200;
				
				//la terre avance, issun aussi 999 à remplacer par le bord de la frame
				
				if(this.terre.x >= game.width-100)
				{
					
					this.terre.x -= xSpeed * 0.01;
				}
				
				this.issun.x += xSpeed * 0.03;          
				// if(this.issun.x > game.width)
					// {
					// this.parentNode.removeChild(this);          
					// }
				
					
				}
			
			
			
        // Check if it's time to create a new set of obstacles
		// En crée jusqu'au score atteind
		if(this.score < 25){
        this.generateEnemyTimer += evt.elapsed * 0.001;
        if(this.generateEnemyTimer >= 1)
        {
            var enemy;
            this.generateEnemyTimer -= 1;
            enemy = new Enemy(Math.floor(Math.random()*6));
            this.enemyGroup.addChild(enemy);
        }
		}
		// Generated bonus
		if(this.score < 25){
        this.generateBonusTimer += evt.elapsed * 0.001;
        if(this.generateBonusTimer >= 1)
        {
            var bonus;
            this.generateBonusTimer -= 1;
            bonus = new Bonus(Math.floor(Math.random()*15));
            this.bonusGroup.addChild(bonus);
        }
		}
        // Check collision
		
		       
		for (var i = this.enemyGroup.childNodes.length - 1; i >= 0; i--) {
            var enemy;
            enemy = this.enemyGroup.childNodes[i];
            if(enemy.intersect(this.issun)){  
                var game;
                game = Game.instance;
                game.assets['res/Hit.mp3'].play();
                this.enemyGroup.removeChild(enemy);
                this.bgm.stop();
                game.replaceScene(new SceneGameOver(this.score));        
                break;
            }
        }
		
		// Check positive
		
		       
		for (var i = this.bonusGroup.childNodes.length - 1; i >= 0; i--) {
            var bonus;
            bonus = this.bonusGroup.childNodes[i];
            if(bonus.intersect(this.issun)){  
                var game;
                game = Game.instance;
                game.assets['res/alcool.mp3'].play();
				//console.log(this.score);
				this.score = this.score+5;
				this.bonusGroup.removeChild(bonus);
				
               
            }
        }
		
		//
		
            if((this.terre).intersect(this.issun)){  
                var game;
                game = Game.instance;
                game.assets['res/bravo.mp3'].play();
                //this.enemyGroup.removeChild(enemy);
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
		var bodywidth = $(document).width();
		var bodyheight = $(document).height();
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
		var bodywidth = $(document).width();
		var bodyheight = $(document).height();
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
	var bodywidth = $(document).width();
	var bodyheight = $(document).height();   
        //var targetY = 310 - this.height/2 + (lane-1)*90;
		var targetY =  50 + (lane)*bodyheight/6;
		
        this.y = targetY;
        
    }


});

 /**
 * Enemy Cube
 */
var Enemy = Class.create(Sprite, {
    /**
     * The obstacle that the issun must avoid
     */
    initialize: function(lane) {
		var bodywidth = $(document).width();
		var bodyheight = $(document).height();
        // Call superclass constructor
        Sprite.apply(this,[63, 38]);
        this.image  = Game.instance.assets['res/waste.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
		//position des enemys en brut
		var bodywidth = $(document).width();
		this.moveBy(bodywidth,100,0);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
		var bodywidth = $(document).width();
	var bodyheight = $(document).height();
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
 * Bonus
 */
var Bonus = Class.create(Sprite, {
    
    initialize: function(lane) {
		var bodywidth = $(document).width();
		var bodyheight = $(document).height();
        // Call superclass constructor
        Sprite.apply(this,[64, 81]);
        this.image  = Game.instance.assets['res/jura.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
		//position des enemys en brut
		var bodywidth = $(document).width();
		this.moveBy(bodywidth,100,0);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
		var bodywidth = $(document).width();
	var bodyheight = $(document).height();
        var game, distance;
        game = Game.instance;        
        distance = -(bodyheight/6);
     
        this.rotationSpeed = 20;
     
	 
		//var targetY =  this.height/2 + (lane)*73;
        //this.y = game.height/2 - this.height/2 + (lane - 1) * distance;
		
		this.y = game.height/2 - this.height/2 + (lane) * distance;
        this.x = -this.width;    
        this.rotation = Math.floor( Math.random() * 360 );    
    },

    update: function(evt) { 
        var xSpeed, game;
     
        game = Game.instance;
        xSpeed = 300;
     
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