<?php
$to = "simon.carlier@heig-vd.ch";
$from = "no-reply@oboro.club";

$headers = "De: " . $from . "\r\n";

$subject = "JAPAN IMPACT TRANSMEDIA";
$body = "Nouvel email: " . $_POST['email'];


if( filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) )
{ 
    if (mail($to, $subject, $body, $headers, "-f " . $from))
    {
        echo 'Ton adresse email (' . $_POST['email'] . ') a bien �t� ajout�e � la liste!';
		# ATTENTION ne pas oubli� de CHMOD 600 mails.json
		$json = file_get_contents('mails.json');
		$data = json_decode($json);
		$data[] = $_POST['email'];
		file_put_contents('mails.json', json_encode($data));
    }
    else
    {
       echo 'Il y a un probl�me avec ton adresse email (' . $_POST['email'] . ')';   
    }
}
else
{
   echo 'Il y a un probl�me avec ton adresse email (' . $_POST['email'] . ')';   
}