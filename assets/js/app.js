window.parts = []//the array containing the different parts of the adventure
window.currentPart = {};
window.next = function(){
	//executes the script contained in the last added part
	var lastPart = parts[parts.length-1];

	lastPart.removeOthers();
	lastPart.applyStyle();
	lastPart.show();
	lastPart.exec();
}

$(function() {


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



		 	//appends to the body
			$( "body" ).append( "<div class='site-part "+ that.part+"' id='"+ that.part+"'>"+"</div>" );
			$("#"+that.part).append(that.dom);
			$("#"+that.part).css("display","none");

			that.getScript();

		});

	}

	function Video(part){
		var that = this;

		this.video = $("#" +part  + " video").get(0);


		this.video.ontimeupdate = function() {
		    if(that.video.currentTime >= that.video.duration){
		      that.video.pause()
		    }
		}

		this.video.onpause = function(){
   			window.next();
  		}

	}

	parts.push(new Part("issunriver"));


	setTimeout(function(){

		parts[0].removeOthers();
		parts[0].applyStyle();
		parts[0].show();
		parts[0].exec();

		parts.push(new Part("sokoban"));

	},1000);



	 	/*setTimeout(function(){
	 	parts["stomachjump"].removeOthers();
	 	parts["stomachjump"].applyStyle();
 		parts["stomachjump"].show();
		parts["stomachjump"].exec();

 //var issunriver = new Part("issunriver");
	parts.push(new Part("issunriver"));
	
	setTimeout(function(){
			

	 parts[0].applyStyle();
	 parts[0].show();
	 parts[0].exec();
	 parts.push(new Part("intro"));
	 parts[1].video = new Video("intro");
	 
	 setTimeout(function(){
			parts.push(new Part("sokoban"));
	 },1000)
	 
	 
 },1000)


	parts.push(new Part("intro"));


	setTimeout(function(){

 	 parts[0].applyStyle();
 	 parts[0].show();
 	 parts[0].exec();
	 parts.push(new Part('sokoban'));

  },1000)





	//load for example the stomachjump
	//parts["stomachjump"] = new Part("stomachjump");


	//parts.push(new Part("intro"));




	// txtArea[0].value

	//parts["pingouin"] = new Part("pingouin");

	 /*setTimeout(function(){
	 	parts[0].video = new Video("intro");
		parts[0].show();

	 	//loads the other page while the user is playing
	  	parts.push(new Part("stomachjump"));



	 var sokoban = new Part("sokoban");


	//parts["pingouin"] = new Part("pingouin");

	 setTimeout(function(){
	 	sokoban.applyStyle();
	 	sokoban.show();
	 	sokoban.exec();

	 	//loads the other page while the user is playing
	  parts["stomachjump"] = new Part("stomachjump");

	 	/*setTimeout(function(){
	 	parts["stomachjump"].removeOthers();
	 	parts["stomachjump"].applyStyle();
 		parts["stomachjump"].show();
		parts["stomachjump"].exec();

	},20000)*/









});
