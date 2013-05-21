<?php

	//Include global config file
	require_once('../../includes/config.php');
	
	//Check the user is allowed to log into the system
	$data = array (
		'user_email'		=> $_POST['user_email'],
		'time_stamp'		=> date('Y-m-d H:i:s'),
	);

	$data['user_email'] = "graeme@gelstudios.co.uk";
	
	//Return user information
	$sql = "SELECT id, firstname, lastname, channel FROM users WHERE email = :email";
	$userQuery = $db->prepare($sql);
	$userQuery->execute(array(
		':email'	=> $data['user_email']
	));
	
	$user = $userQuery->fetch(PDO::FETCH_ASSOC);
	
	if (!$user) {
		header('HTTP/1.1 403 ' . $s['login_error']);
		return false;
	}

	//Return user information
	$sql = "SELECT name FROM channels WHERE id = :channelId";
	$channelQuery = $db->prepare($sql);
	$channelQuery->execute(array(
		':channelId'	=> $user['channel']
	));

	$channel = $channelQuery->fetch(PDO::FETCH_ASSOC);

	//Add channel name
	$user['channel_name'] = $channel['name'];
	
	//Add log entry
	$sql = "INSERT INTO user_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'	=> $user['id'],
		':comment'	=> $user['firstname'] . ' '. $user['lastname'] . '(' . $data['user_email'] . ') linked!',
		':timestamp'	=> $data['time_stamp']
	));
	
	echo json_encode($user);

?>