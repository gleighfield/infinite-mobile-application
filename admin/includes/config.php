<?php
//Config file

//DB CONNECTION
$db_host = 'localhost';
$db_table = 'gelst463_infinite';
$db_user = 'gelst463_mobile';
$db_pass = 'gelstud1oS';

$db = mysql_connect($db_host, $db_user, $db_pass) or die("MySQL PDO Connection Error");
mysql_select_db($db_table, $db);

//Application configuration options
$s = array(
	site_name => 'Site Name',
	copyright => 'CR INFO'
);

?>