<?php
//Config file

//DB CONNECTION
$db_host = 'localhost';
$db_table = 'gelst463_infinite';
$db_user = 'gelst463_mobile';
$db_pass = 'gelstud1oS';

$db = new PDO('mysql:host='.$db_host.';dbname='.$db_table, $db_user, $db_pass);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

//Application configuration options
$s = array(
	site_name 	=> 'Site Name',
	copyright 	=> 'CR INFO',
	login_error	=> 'Sorry, no user with that email address has been registered'
);

?>