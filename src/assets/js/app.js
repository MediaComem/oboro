	var suffix="";

	window.Part = function Part(part){

		var that = this;

		this.baseUrl = "./parts/" + part +"/";


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

			$.getScript(that.baseUrl + "assets/js/"+ part+suffix+".js")
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
	  		.attr('href', this.baseUrl + "assets/css/" + part + suffix +".css");

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

			//if there is a data-automatic set in the HTML
			var automaticVideo = $("#" +that.part  + " video").data('automatic');

			//if we specify in the html or js that at the end of the video the next one will be loaded
			if(automaticVideo != undefined){
				//creates the object if the part is a video
				that.video = new Video(that.part);
			}


		}

		this.removeOthers = function(){
			//remove all the other site parts except the current one
		 	$(".site-part").not("."+that.part).fadeOut( "fast", function() {
			  	$(".site-part").not("."+that.part).remove();
			  });
		}

		$.get(that.baseUrl+"assets/css/"+that.part+ suffix+".css", function( css ) {
				that.style = css;
		});

		//get the html content and append it to the DOM
		
		$.get( this.baseUrl + "/" + this.part + ".html", function( html ) {

		 	that.dom = html;

			that.getScript();

		});

	}

	function ifMobile(){

		return( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

	}

	function Video(part){
		var that = this;

		this.video = $("#" +part  + " video").get(0);

   
		this.video.ontimeupdate = function() {

			console.log(that.video.currentTime );
			console.log(that.video.duration);

		    if(that.video.currentTime >= that.video.duration-1){
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

	lastPart.applyStyle();
	lastPart.show();

	if(typeof(lastPart.exec) === 'function' ){
		lastPart.exec();
	}


  	// store the last part's name in the loacal storage
	localStorage.setItem("lastPartPlayed", lastPart.part);
}

window.appendNext = function(part,notAppend){
	parts.push(new Part(part));

	if(notAppend==undefined){
		//after two seconds it appends to the body	
		setTimeout(function(){
			parts[parts.length-1].appendToBody();
		},2000);
	}
}

$(function() {



	var lastPartPlayed = localStorage.getItem("lastPartPlayed");
	if(lastPartPlayed != undefined){
		window.appendNext(lastPartPlayed,false);
	}
	else{
		window.appendNext("intro",false);
	}

	//parts.push(new Part("stomachjump"))

	setTimeout(function(){
			console.log(ifMobile());
			 parts[0].appendToBody();
		 	 parts[0].applyStyle();
		 	 parts[0].show();
		 	 parts[0].exec();


  	},1000);



});
