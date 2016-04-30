window.currentPart = function arrivee(){
	//get the HTML video and play it
	var video = parts[parts.length-1].video.video;
	video.play();
	
	//load the next item
	window.appendNext("sokoban");    
}
