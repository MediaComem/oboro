window.currentPart = function japan(){
$('#reset').on('click', function(event) {
        localStorage.removeItem(key);

            });
$('#issunriver').on('click', function(event) {
        localStorage.setItem('lastPartPlayed', 'issunriver');

            });
$('#sokoban').on('click', function(event) {
        localStorage.setItem('lastPartPlayed', 'sokoban');

            });
$('#stomachjump').on('click', function(event) {
        localStorage.setItem('lastPartPlayed', 'stomachjump');

            });			
}