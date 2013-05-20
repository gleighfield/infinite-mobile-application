<?php

	//Include global config file
	require_once('../../includes/config.php');
	
	//Add a channel into the database, only one required field which is the name.
	$data = array (
		'user_email'		=> $_POST['user_email'],
		'time_stamp'		=> date('Y-m-d H:i:s'),
	);
	
	//Add channel to DB
	$sql = "SELECT id, firstname, lastname, channel FROM users WHERE email = :email";
	$userQuery = $db->prepare($sql);
	$userQuery->execute(array(
		':email'	=> $data['user_email']
	));
	
	$user = $userQuery->fetch();
	
	if (!$user) {
		header('HTTP/1.1 403 ' . $s['login_error']);
		return false;
	}
	
	//Add log entry
	$sql = "INSERT INTO user_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $user['id'],
		':comment'		=> $user['firstname'] . ' '. $user['lastname'] . ' (' . $data['user_email'] . ') linked!',
		':timestamp'	=> $data['time_stamp']
	));
	
	echo json_encode($user);

?>