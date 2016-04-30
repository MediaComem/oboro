window.currentPart = function issunriver(){

parts.push(new Part("arrivee"));
  
parts[parts.length-1].video = true;
    

var options = {hashTracking: false, closeOnOutsideClick: false};

$('#issunriver').append("<div data-remodal-id=\"modal\" ><h2>Issun-River</h2><p>Bouge la souris ou glisse ta main sur l'écran pour aider Issun à rejoindre le rivage!</p><div class=\"instruction-images\"><img src=\"./parts/issunriver/assets/res/swipe-up.png\" alt=\"swipe up\"/></div><button data-remodal-action=\"confirm\" class=\"issunriver-start remodal-confirm\">OK</button></div>   ");


var inst = $('[data-remodal-id=modal]').remodal();
inst.open();

// Start enchant.js
enchant();


    // Starting point
    var bodywidth = $(document).width();
    var bodyheight = $(document).height();
    var islandSwitch = false;
    //console.log("Document height: "+bodyheight);
    //console.log("Document width: "+bodywidth);
    var game = new Game(bodywidth, bodyheight);
    game.preload('./parts/issunriver/assets/res/Hit.mp3',
                 './parts/issunriver/assets/res/bgm.mp3',
                 './parts/issunriver/assets/res/bravo.mp3',
                 './parts/issunriver/assets/res/terre.PNG',
                 './parts/issunriver/assets/res/wave2.gif',
                 './parts/issunriver/assets/res/cherry.png',
				 './parts/issunriver/assets/res/bonus.mp3',
                 './parts/issunriver/assets/res/issun_small.png',
                 './parts/issunriver/assets/res/issun_medium.png',
                 './parts/issunriver/assets/res/issun_big.png',
                 './parts/issunriver/assets/res/tronc_big.png',
                 './parts/issunriver/assets/res/tronc_medium.png',
                 './parts/issunriver/assets/res/tronc_small.png'
                 )
    game.fps = 30;
    
    game.scale = 1;
    game.onload = function() {
        // Jeux chargé
        console.log("Chargement effectué, aide Issun à traverser!");
        var scene = new SceneGame();
        game.pushScene(scene);
    }
    var gameTest = game;
    
   
$(".issunriver-start").on("click",function(){
     game.start();  
});    
     


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
		var bodywidth = $(document).width();
		var bodyheight = $(document).height();
		
        label = new Label('Distance <br>0 M');
        label.x = $(document).width()/10;
        label.y = $(document).height()/10;        
        label.color = 'white';
        label.font = '16px edo';
        label.textAlign = 'center';
        label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
        this.scoreLabel = label;        
        
        var bodywidth = $(document).width();
        var bodyheight = $(document).height();
        bg = new Sprite(bodywidth,bodyheight);        
        bg.image = game.assets['./parts/issunriver/assets/res/wave2.gif'];
       

        issun = new Issun();
        issun.x = game.width/10;
        issun.y =  game.height/4;
        
        this.issun = issun;

        terre = new Terre();
        terre.x = game.width;
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
        
        //backgroundmusic
        this.bgm = game.assets['./parts/issunriver/assets/res/bgm.mp3'];       
        this.bgm.play();
    },
    handleTouchMove: function(evt){
            this.issun.y = evt.localY

        }, 
    handleTouchControl: function (evt) {
        var bodywidth = $(document).width();
        var bodyheight = $(document).height();
        var laneHeight, lane, game;
        laneHeight = bodyheight/6;
        lane = Math.floor(evt.localY/laneHeight);
        this.issun.switchToLaneNumber(lane);
    },
  
    update: function(evt) {
        // +de score avec le temps
        this.scoreTimer += evt.elapsed * 0.001;
        if(this.scoreTimer >= 1)
        {
            this.setScore(this.score + 1);
            this.scoreTimer -= 1;
        }
        //Quand un score est atteind issun va vers l'ile
        if(this.score >= 33){
            this.setScore(33);
            var game;
                game = Game.instance;

                       
                
                var xSpeed, game;
     
                game = Game.instance;
                xSpeed = 200;
                
                //la terre avance, issun aussi 
                
                if(this.terre.x >= game.width-93)
                {
                    
                    this.terre.x -= xSpeed * 0.01;
                }
                
                this.issun.x += xSpeed * 0.03;          
                        
                }
            
            
            
        // Check Création d'enemi
        // En crée jusqu'au score atteind
        if(this.score < 33){
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
        if(this.score < 33){
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
                game.assets['./parts/issunriver/assets/res/Hit.mp3'].play();
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
                game.assets['./parts/issunriver/assets/res/bonus.mp3'].play();
                this.score = this.score+5;
                this.bonusGroup.removeChild(bonus);
                
               
            }
        }
        
        //
        
            if((this.terre).intersect(this.issun)){  
                var game;
                game = Game.instance;
				this.bgm.stop(); 
                game.assets['./parts/issunriver/assets/res/bravo.mp3'].play();
                                
                 if(!islandSwitch){
                    window.next();
                    inst.destroy();
                }
                islandSwitch = true;
                
                
            }
        
        // Loop BGM
        if( this.bgm.currentTime >= this.bgm.duration ){
            this.bgm.play();
        }
    },

    setScore: function (value) {
        this.score = value;
        this.scoreLabel.text = 'Distance<br>' + this.score+" M";
    }
});


/**
*Terre
*/

var Terre = Class.create(Sprite, {
    
initialize: function() {
        var bodywidth = $(document).width();
        var bodyheight = $(document).height();
        Sprite.apply(this,[96, bodyheight]);
        this.image = Game.instance.assets['./parts/issunriver/assets/res/terre.PNG'];   
        
}})

/**
 * Issun
 */
 var Issun = Class.create(Sprite, {

    initialize: function() {
        var bodywidth = $(document).width();
        var bodyheight = $(document).height();
        
        
         
            
    //3 taille de sprite selon la taille du screen      
if (window.matchMedia("(min-width: 900px)").matches) {
  Sprite.apply(this,[90, 109]);
        this.image = Game.instance.assets['./parts/issunriver/assets/res/issun_big.png'];    
} else if (window.matchMedia("(min-width: 500px)").matches) {
  Sprite.apply(this,[50, 59]);
        this.image = Game.instance.assets['./parts/issunriver/assets/res/issun_medium.png'];    
} else {
    Sprite.apply(this,[32, 38]);
        this.image = Game.instance.assets['./parts/issunriver/assets/res/issun_small.png'];    
    
}

        this.animationDuration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
    },
    
    
    
    updateAnimation: function (evt) {
        
                
        this.animationDuration += evt.elapsed * 0.001;       
        if(this.animationDuration >= 0.45)
        {
            this.frame = (this.frame + 1) % 2;
            this.animationDuration -= 0.45;
        }
    },

    
   switchToLaneNumber: function(lane){ 
    var bodywidth = $(document).width();
    var bodyheight = $(document).height();
        var targetY =  50 + (lane)*bodyheight/6;        
        this.y = targetY;
        
    }


});

 /**
 * Enemy 
 */
var Enemy = Class.create(Sprite, {

    initialize: function(lane) {
        var bodywidth = $(document).width();
        var bodyheight = $(document).height();


        if (window.matchMedia("(min-width: 900px)").matches) {
  Sprite.apply(this,[220, 70]);
        this.image = Game.instance.assets['./parts/issunriver/assets/res/tronc_big.png'];    
} else if (window.matchMedia("(min-width: 500px)").matches) {
  Sprite.apply(this,[130, 41]);
        this.image = Game.instance.assets['./parts/issunriver/assets/res/tronc_medium.png'];    
} else {
    Sprite.apply(this,[95, 30]);
        this.image = Game.instance.assets['./parts/issunriver/assets/res/tronc_small.png'];
        
    
}
        
        this.rotationSpeed = 0;
        this.setLane(lane);
        //position des enemies en brut
        var bodywidth = $(document).width();
        this.moveBy(bodywidth,0,0);
        this.addEventListener(Event.ENTER_FRAME, this.update);
    },

    setLane: function(lane) {
        var bodywidth = $(document).width();
		var bodyheight = $(document).height();
        var game, distance;
        game = Game.instance;        
        distance = -(bodyheight/6);
     
        //this.rotationSpeed = Math.random() * 100 - 50;

        
        this.y = game.height/2 - this.height/2 + (lane-1) * distance;
        this.x = -this.width;    
        //this.rotation = Math.floor( Math.random() * 360 );    
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
        Sprite.apply(this,[68, 67]);
        this.image  = Game.instance.assets['./parts/issunriver/assets/res/cherry.png'];      
        this.rotationSpeed = 0;
        this.setLane(lane);
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
        
        this.y = game.height/2 - this.height/2 + (lane) * distance;
        this.x = -this.width;    
        this.rotation = Math.floor( Math.random() * 360 );    
    },

    update: function(evt) { 
        var xSpeed, game;
     
        game = Game.instance;
        xSpeed = 300;
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
		var bodywidth = $(document).width();
        Scene.apply(this);
        this.backgroundColor = '';

        gameOverLabel = new Label("GAME OVER<br><br>Clique pour recommencer");
        gameOverLabel.x = bodywidth/5;
        gameOverLabel.y = 128;
        gameOverLabel.color = 'black';
        gameOverLabel.font = '32px edo';
        gameOverLabel.textAlign = 'center';

        scoreLabel = new Label('Distance<br>' + score + 'M');
        scoreLabel.x = bodywidth/10;
        scoreLabel.y = $(document).height()/10;       
        scoreLabel.color = 'black';
        scoreLabel.font = '16px edo';
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

    

}