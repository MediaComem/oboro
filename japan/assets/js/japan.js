window.currentPart = function japan(){
$('#reset').on('click', function(event) {
        localStorage.removeItem('lastPartPlayed');
		location.reload();
            });
			
$('#issunriver').on('click', function(event) {
        localStorage.setItem('lastPartPlayed', 'issunriver');
		location.reload();
            });
			
$('#sokoban').on('click', function(event) {
        localStorage.setItem('lastPartPlayed', 'sokoban');
		location.reload();
            });
			
$('#stomachjump').on('click', function(event) {
        localStorage.setItem('lastPartPlayed', 'stomachjump');
		location.reload();
            });			
}