window.currentPart = function depart(){
	//get the HTML video and play it
	var video = parts[parts.length-1].video.video;
	video.play();

	window.appendNext("issunriver");
}