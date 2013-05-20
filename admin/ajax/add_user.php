<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Add a channel into the database, only one required field which is the name.
	$data = array (
		'user_id' 			=> 0,
		'firstname'			=> $_POST['firstname'],
		'lastname'			=> $_POST['lastname'],
		'email'				=> $_POST['email'],
		'channel'			=> $_POST['channel'],
		'admin'				=> $_POST['admin'],
		'status'			=> 1, //Enabled by default
		'time_stamp'		=> date('Y-m-d H:i:s')
	);
	
	//Add channel to DB
	$sql = "INSERT INTO users (firstname, lastname, email, channel, created, admin, status) VALUES (:firstname, :lastname, :email, :channel, :created, :admin, :status)";
	$addItem = $db->prepare($sql);
	$addItem->execute(array(
		':firstname'	=> $data['firstname'],
		':lastname'		=> $data['lastname'],
		':email'		=> $data['email'],
		':channel'		=> $data['channel'],
		':created'		=> $data['time_stamp'],
		':admin'		=> $data['admin'],
		':status'		=> $data['status']
	));
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'User added "' . $data['firstname'] . ' ' . $data['lastname'] . '" with an email address of "' . $data['email'] . '"',
		':timestamp'	=> $data['time_stamp']
	));

?>