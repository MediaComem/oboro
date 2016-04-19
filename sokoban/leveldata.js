var level = new Array();

var levelDataLine = new Array();
levelDataLine[0] = "@@@@@@@@@@@@@@@@@";
levelDataLine[1] = "@  @  @  @  @ x @";
levelDataLine[2] = "@> o  @     @   @";
levelDataLine[3] = "@  @     @      @";
levelDataLine[4] = "@  @  @  @  @   @";
levelDataLine[5] = "@@@@@@@@@@@@@@@@@";
level[0] = new levelObject(levelDataLine);

levelDataLine = new Array();
levelDataLine[0] = "@@@@@@@@@@@@@@@@@";
levelDataLine[1] = "@@@@@@@@@     <@@";
levelDataLine[2] = "@@@@@@@@@ o@  @@@";
levelDataLine[3] = "@@@@@@@@@     @@@";
levelDataLine[4] = "@@@@@@@@@@    @@@";
levelDataLine[5] = "@@@@@@@@@   @ @@@";
levelDataLine[6] = "@x     @@   o   @";
levelDataLine[7] = "@@              @";
levelDataLine[8] = "@x     @@@@@@@@@@";
levelDataLine[9] = "@@@@@@@@@@@@@@@@@";

level[1] = new levelObject(levelDataLine);

levelDataLine = new Array();
levelDataLine[0] = "@@@@@@@@@@@@@@@@@";
levelDataLine[1] = "@@@@@@   @@@@@@@@";
levelDataLine[2] = "@@@@@@ @>o @@@@@@";
levelDataLine[3] = "@@@@@@x  @ @@@@@@";
levelDataLine[4] = "@@@@@@ ox  @@@@@@";
levelDataLine[5] = "@@@@@@@  @@@@@@@@";
levelDataLine[6] = "@@@@@@@  @@@@@@@@";
levelDataLine[7] = "@@@@@@@@@@@@@@@@@";

level[2] = new levelObject(levelDataLine);



function levelObject(datalineArray){
	this.cratesToPlace = 0;
	this.levelMapOrig = new Array();
	this.levelHeight = datalineArray.length;
	for(i=0;i<this.levelHeight;i++){
		this.levelMapOrig[i] = new Array();
		this.levelWidth = datalineArray[i].length;
		for(j=0;j<this.levelWidth;j++){
			if(datalineArray[i].charAt(j) == "@"){
				this.levelMapOrig[i][j] = 1;
			}else if(datalineArray[i].charAt(j) == "o"){
				this.levelMapOrig[i][j] = 2;
			}else if(datalineArray[i].charAt(j) == "x"){
				this.levelMapOrig[i][j] = 3;
				this.cratesToPlace += 1;
			}else if(datalineArray[i].charAt(j) == "^"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 0;
			}else if(datalineArray[i].charAt(j) == "v"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 3;
			}else if(datalineArray[i].charAt(j) == "<"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 1;
			}else if(datalineArray[i].charAt(j) == ">"){
				this.levelMapOrig[i][j] = 4;
				this.playerStartX = j;
				this.playerStartY = i;
				this.playerStartDir = 2;
			}else {
				this.levelMapOrig[i][j] = 0;
			}
		}
	}
}
