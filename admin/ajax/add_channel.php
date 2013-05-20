<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Add a channel into the database, only one required field which is the name.
	$data = array (
		'user_id' 			=> 0,
		'name'				=> $_POST['name'],
		'time_stamp'		=> date('Y-m-d H:i:s')
	);
	
	//Add channel to DB
	$sql = "INSERT INTO channels (name) VALUES (:name)";
	$addItem = $db->prepare($sql);
	$addItem->execute(array(
		':name'	=> $data['name']
	));
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Channel added titled "' . $data['name'] . '"',
		':timestamp'	=> $data['time_stamp']
	));

?>