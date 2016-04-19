$(function() {
	//the array containing the different parts of the adventure
	var parts = {};



	function Part(part){

		this.baseUrl = "./" + part +"/";
		var that = this;
		
		
		//load the script
		//e.g /stomachjump/assets/js/stomachjump.js
		this.getScript = function(){

			$.getScript(this.baseUrl + "assets/js/"+ part +".js") 
			 .done(function( script, textStatus ) {
			    console.log( textStatus );
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


		//get the html content
		$.get( this.baseUrl + "/stomachjump.html", function( data ) {
		 	this.dom = data;

		 	//appends to the body
			$( "body" ).append( "<div id='"+part+"'>"+this.dom+"</div>" );

			that.getStyle;
			that.getScript;

		});	


	}

	//loads for example the stomachjump
	parts["stomachjump"] = new Part("stomachjump");

	//load the part of the site
	function loader(part){
		//get the scripts
	}
  
});
