<?php

	//Include global config file
	require_once('../../includes/config.php');
	
	//Submit an email to system admin
	$data = array (
		'user_id'		=> $_POST['user_id'],
		'user_email'		=> $_POST['user_email'],
		'message'		=> $_POST['message'],
		'telephone'		=> $_POST['telephone'],
		'time_stamp'		=> date('Y-m-d H:i:s'),
	);
	
	//Add channel to DB
	$sql = "SELECT firstname, lastname, channel FROM users WHERE id = :userid";
	$userQuery = $db->prepare($sql);
	$userQuery->execute(array(
		':userid'	=> $data['user_id']
	));
	
	$user = $userQuery->fetch(PDO::FETCH_ASSOC);
	
	if (!$user) {
		header('HTTP/1.1 403 No user with such ID here');
		return false;
	}

	//Lets build up our message
	$message = 'Name: <strong>' . $user['firstname'] . ' ' . $user['lastname'] . '</strong><br />';
	$message.= 'eMail: ' . $data['user_email'] . '<br />';
    	$message.= 'Telephone Number: ' . $data['telephone'] . '<br />';
	
	$message.= '<hr />';
	$message.= 'Message:<br />"' . $data['message'] .'"';

	$to      = $s['email_address'];
	$subject = $s['email_title'];
	$message = $message;

	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	$headers .= 'From: ' . $data['user_email'] . "\r\n";
	$headers .= 'Reply-To: ' . $data['user_email'] . "\r\n";

	mail($to, $subject, $message, $headers);
	
	//Add log entry
	$sql = "INSERT INTO user_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Email sent to admin from ' . $data['user_email'],
		':timestamp'		=> $data['time_stamp']
	));

?>