	//suffix is used for production (with .min)
	var suffix="";

	//Part object is used for each part of the website
	window.Part = function Part(part,callback){

		var that = this;

		this.baseUrl = "./parts/" + part +"/";


		this.exec = {};

		this.part = part;

		this.ready = function(callback){
			var loadingReady = false;
			
			var watchDownload = function(){
				setTimeout(function(){
									if(that.dom != undefined && that.style != undefined && that.js != undefined){
										callback();
									}
									else{
										watchDownload();
									}
								},50);
			}

			watchDownload();
			
			return;
			
		}
		

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
			  	//stores the function for a later execution
			  	that.js = true;
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

		//apply the style stored in the object
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
				
				if(ifMobile()){
					//change all the videos to lower qualities
					$("#" +that.part  + " video").html("");

					var tags = '<source src="./parts/part-name/assets/video/video-name.mp4" type="video/mp4" />'
							 +'<source src="./parts/part-name/assets/video/video-name.webm" type="video/webm" />'
 						 	 +'<!--<source src="./parts/part-name/assets/video/video-name.ogv" type="video/ogg" />-->';

					//replace the string
					tags = tags.replace(/part-name/g, that.part);	

 					tags = tags.replace(/video-name/g, that.part+"-sq");

					$("#" +that.part  + " video").append(tags);
					
					//if it's chrome and mobile we add the controls 
					// NOTE : it's impossible to autoplay videos with chrome mobile
					if(ifChrome()){
						//add controls to the video if it's chrome
						$("#" +that.part  + " video").attr("controls","controls");
					}
				}	

			}


		}
		//remove the other parts with a fadeout effect
		this.removeOthers = function(){
			//remove all the other site parts except the current one
		 	$(".site-part").not("."+that.part).fadeOut( "fast", function() {
			  	$(".site-part").not("."+that.part).remove();
			  });
		}

		//get the css at the creation of the object
		$.get(that.baseUrl+"assets/css/"+that.part+ suffix+".css", function( css ) {
				that.style = css;
		});

		//get the html content 
		$.get( this.baseUrl  + this.part + ".html", function( html ) {
		 	that.dom = html;
		 	//get the script
			that.getScript();

		});


		this.ready(callback);

	}

	//if the browser is mobile returns true
	function ifMobile(){

		return( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

	}

	//if the browser is chrome returns true
	function ifChrome(){
		// please note, 
		// that IE11 now returns undefined again for window.chrome
		// and new Opera 30 outputs true for window.chrome
		// and new IE Edge outputs to true now for window.chrome
		// and if not iOS Chrome check
		// so use the below updated condition
		var isChromium = window.chrome,
		    winNav = window.navigator,
		    vendorName = winNav.vendor,
		    isOpera = winNav.userAgent.indexOf("OPR") > -1,
		    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
		    isIOSChrome = winNav.userAgent.match("CriOS");

		if(isIOSChrome){
		   return true;
		} else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
		  return true;
		} else { 
		   return false;
		}

	}
	
	//video object helps us to automatically switch between parts at the end of videos
	function Video(part){
		var that = this;

		this.video = $("#" +part  + " video").get(0);

   
		this.video.ontimeupdate = function() {
		    if(that.video.currentTime >= that.video.duration-1){
		      that.video.pause();
		    }
		}

		this.video.onpause = function(){
   			window.next();
  		}

	}


window.parts = [];//the array containing the different parts of the adventure

//the current function to be executed
window.currentPart = {};

//transition to the next part
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

//append the next part, load the html code in the dom (hidden)
window.appendNext = function(part,callback){
	if(callback == undefined){
			parts.push(new Part(part,function(){
			parts[parts.length-1].appendToBody();
		}));
	}
	else{
		parts.push(new Part(part,callback));
	}
	
}



$(function() {
	
	//get the last part played
	var lastPartPlayed = localStorage.getItem("lastPartPlayed");

	//if the lastPart is defined and not empty we jump to the last part
	if(lastPartPlayed != undefined){
		window.appendNext(lastPartPlayed,function(){
			 parts[0].appendToBody();
		 	 parts[0].applyStyle();
		 	 parts[0].show();
		 	 parts[0].exec();
		});
	}
	else{
		//else we start at the beginning
		window.appendNext("intro",function(){
			 parts[0].appendToBody();
		 	 parts[0].applyStyle();
		 	 parts[0].show();
		 	 parts[0].exec();
		});
	}
});
