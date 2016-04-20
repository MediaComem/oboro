$(function() {
	//the array containing the different parts of the adventure
	var parts = {};



	function Part(part){

		this.baseUrl = "./" + part +"/";
		var that = this;

		this.part = part;


		//returns the jquery element
		this.getElement = function(){
			return $("#"+this.part)
		}

		//show the the div
		this.show = function(){
			$("#"+this.part).css("visibility","visible");
		}

		//hide the div
		this.hide = function(){
			$("#"+this.part).css("visibility","hidden");
		}


		//load the script
		//e.g /stomachjump/assets/js/stomachjump.js
		this.getScript = function(){

			$.getScript(this.baseUrl + "assets/js/"+ part +".js")
			 .done(function( script, textStatus ) {
			  	console.log("srpit loaded")
			  })
			  .fail(function( jqxhr, settings, exception ) {
			    console.log("error : " + exception);
			});
		}

		//load the css
		//e.g /stomachjump/assets/css/stomachjump.css
		this.getStyle = function(){
			$('<link>')
	  		.appendTo('head')
	  		.attr({type : 'text/css', rel : 'stylesheet'})
	  		.attr('href', this.baseUrl + "assets/css/" + part + ".css");

		}


		//get the html content and append it to the DOM
		$.get( this.baseUrl + "/" + this.part + ".html", function( data ) {
		 	that.dom = data;

		 	that.getStyle();


		 	//appends to the body
			$( "body" ).append( "<div id='"+ that.part+"'>"+"</div>" );
			$("#"+that.part).append(that.dom);
			$("#"+that.part).css("visibility","hidden");

			that.getScript();

		});

	}

	//load for example the stomachjump
	parts["stomachjump"] = new Part("stomachjump");

	//load the sokoban
	parts["sokoban"] = new Part("sokoban");




	// Events
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
