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
        echo 'Ton adresse email (' . $_POST['email'] . ') a bien été ajoutée à la liste!';
    }
    else
    {
       echo 'Il y a un problème avec ton adresse email (' . $_POST['email'] . ')';   
    }
}
else
{
   echo 'Il y a un problème avec ton adresse email (' . $_POST['email'] . ')';   
}