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


	function Part(part){

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
			$("#"+that.part).css("display","block");
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
		 	$(".site-part").not("."+that.part).remove();
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

	 }, 1000);*/


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

	 }, 1000);



	//
	/*var maVid = document.getElementById("vid");

  maVid.ontimeupdate = function() {

    console.log(maVid.currentTime)
    if(maVid.currentTime >= 25){
      maVid.pause()


    }
  };

  maVid.onpause = function(){
    $('div#animatedDenis').append('<div class="denis wow slideInLeft data-wow-duration=" 0.1s""><img src="image/ptits_denis/content.png" class="img-responsive spych" alt="" width="80px" ></div><span class="glyphicon glyphicon-menu-down wow slideInRight data-wow-duration=" 0.1s"" ></span>');

  }*/



});
