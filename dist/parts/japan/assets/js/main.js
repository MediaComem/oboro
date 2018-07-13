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


    $('button#btn_email').on('click', function(){
      console.log('dsds');
      var emailToSend = $('input#email').val();
      console.log(emailToSend);

      $.post( "./parts/japan/form.php",{email:emailToSend} ,function( data ) {

        var options = {hashTracking: false, closeOnOutsideClick: false};

        $('#japan').append("<div data-remodal-id=\"modal\" ><h2>Sokoban</h2><p>"+data+"</p><button id=\"mail_added\" data-remodal-action=\"confirm\" class=\"remodal-confirm\">OK</button></div>   ");


        var inst = $('[data-remodal-id=modal]').remodal();
        inst.open();

        $('button#mail_added').on("click",function(){
          $('div.box:nth-child(2)').fadeOut( "slow", function() {
              this.remove();
          });
        });


      });


    })
}
