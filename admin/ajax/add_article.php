<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Add a channel into the database, only one required field which is the name.
	$data = array (
		'user_id' 			=> 0,
		'channel'			=> $_POST['channel'],
		'title'				=> $_POST['title'],
		'alert'				=> $_POST['alert'],
		'content'			=> $_POST['content'],
		'time_stamp'		=> date('Y-m-d H:i:s'),
		'status'			=> 1 //Enabled by default
	);
	
	//Add channel to DB
	$sql = "INSERT INTO articles (channel, title, alert, content, user_id, timestamp, status) VALUES (:channel, :title, :alert, :content, :user_id, :timestamp, :status)";
	$addItem = $db->prepare($sql);
	$addItem->execute(array(
		':channel'		=> $data['channel'],
		':title'		=> $data['title'],
		':alert'		=> $data['alert'],
		':content'		=> $data['content'],
		':user_id'		=> $data['user_id'],
		':timestamp'	=> $data['time_stamp'],
		':status'		=> $data['status']
	));
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Article added "' . $data['title'] . '"',
		':timestamp'	=> $data['time_stamp']
	));

?>