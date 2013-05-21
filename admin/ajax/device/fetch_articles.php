<?php

	//Include global config file
	require_once('../../includes/config.php');
	
	//Fetch all avalible articles to a user via their channel
	$data = array (
		'user_id'		=> $_POST['user_id'],
		'channel'		=> $_POST['channel'],
		'time_stamp'		=> date('Y-m-d H:i:s'),
	);

	$sql = "SELECT id, firstname, lastname, channel FROM users WHERE id = :id";
	$userQuery = $db->prepare($sql);
	$userQuery->execute(array(
		':id'		=> $data['user_id']
	));
	
	$user = $userQuery->fetch(PDO::FETCH_ASSOC);

	//Return articles matching channel ID
	$sql = "SELECT id, title, alert, content, status, timestamp FROM articles WHERE channel = :channel ORDER BY timestamp DESC";
	$articlesQuery = $db->prepare($sql);
	$articlesQuery->execute(array(
		':channel'	=> $data['channel']
	));

	$articles = $articlesQuery->fetchAll(PDO::FETCH_ASSOC);

	//Add log entry
	$sql = "INSERT INTO user_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $user['id'],
		':comment'		=> $user['firstname'] . ' ' . $user['lastname'] . ' articles synced to device',
		':timestamp'		=> $data['time_stamp']
	));

	header('Content-Type: application/json');
	echo json_encode($articles);
?>