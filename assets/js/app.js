
	window.Part = function Part(part){

		var that = this;

		this.baseUrl = "./" + part +"/";


		this.exec = {};

		this.part = part;


		//returns the jquery element
		this.getElement = function(){
			return $("#"+this.part)
		}

		//show the the div
		this.show = function(){
			$("#"+that.part).fadeIn( "fast", function() {
			    // Animation complete
			  });;
		}

		//hide the div
		this.hide = function(){
			$("#"+that.part).css("display","none");
		}


		//load the script
		//e.g /stomachjump/assets/js/stomachjump.js
		this.getScript = function(){

			//$("#"+this.part).append('<script type="text/javascript" src="'+this.baseUrl+'assets/js/'+this.part+'.js"> </script>')

			$.getScript(that.baseUrl + "assets/js/"+ part +".js")
			 .done(function( script, textStatus ) {
			  	//executes the code
			  	that.exec = window.currentPart;

			  })
			  .fail(function( jqxhr, settings, exception ) {
			    console.log("error : " + exception);
			});
		}

		//load the css
		//e.g /stomachjump/assets/css/stomachjump.css
		this.getStyle = function(){
			$('<link class="site-part ' + that.part + '">')
	  		.appendTo('head')
	  		.attr({type : 'text/css', rel : 'stylesheet'})
	  		.attr('href', this.baseUrl + "assets/css/" + part + ".css");

		}

		this.applyStyle = function(){
			$('<style class="site-part ' + that.part + '">'+that.style+'</style>')
	  		.appendTo('head')
		}

		this.appendToBody = function(){
			//appends to the body
			$( "body" ).append( "<div class='site-part "+ that.part+"' id='"+ that.part+"'>"+"</div>" );
			$("#"+that.part).append(that.dom);
			$("#"+that.part).css("display","none");
		}

		this.removeOthers = function(){
			//remove all the other site parts except the current one
		 	$(".site-part").not("."+that.part).fadeOut( "fast", function() {
			  	$(".site-part").not("."+that.part).remove();
			  });
		}

		$.get(that.baseUrl+"/assets/css/"+that.part+".css", function( css ) {
				that.style = css;
		});

		//get the html content and append it to the DOM
		$.get( this.baseUrl + "/" + this.part + ".html", function( html ) {

		 	that.dom = html;

			that.getScript();

		});

	}

	function Video(part){
		var that = this;

		this.video = $("#" +part  + " video").get(0);


		this.video.ontimeupdate = function() {

			console.log(that.video.currentTime );
		    if(that.video.currentTime >= that.video.duration){
		      that.video.pause();
		    }
		}

		this.video.onpause = function(){
   			window.next();
  	}

	}


window.parts = []//the array containing the different parts of the adventure
window.currentPart = {};
window.next = function(){
	//executes the script contained in the last added part
	var lastPart = parts[parts.length-1];

	lastPart.removeOthers();
	lastPart.appendToBody();

	if(lastPart.video){
		//creates the object if the part is a video
		lastPart.video = new Video(lastPart.part);
	}

	lastPart.applyStyle();
	lastPart.show();

	if(typeof(lastPart.exec) === 'function' ){
		lastPart.exec();
	}


  	// store the last part's name in the loacal storage
	localStorage.setItem("lastPartPlayed", lastPart.part);
}

$(function() {



	var lastPartPlayed = localStorage.getItem("lastPartPlayed");
	if(lastPartPlayed != undefined){
		parts.push(new Part(lastPartPlayed));
	}
	else{
		parts.push(new Part("intro"));
	}


	setTimeout(function(){
			 parts[0].appendToBody();	
		 	 parts[0].applyStyle();
		 	 parts[0].show();
		 	 parts[0].exec();


  	},1000);	

	

});
