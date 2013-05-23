<?php
	
	//Include global config file
	require_once('../includes/config.php');
	
	//Delete question from DB
	$data = array (
		'user_id' 			=> 0,
		'id'		=> 		$_POST['questionId'],
		'time_stamp'		=> date('Y-m-d H:i:s')
	);
	
	$sql = "DELETE FROM questions WHERE id = :id";
	$addItem = $db->prepare($sql);
	$addItem->execute(array(
		':id'	=> $data['id']
	));
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Question id ' . $data['id'] . ' deleted',
		':timestamp'	=> $data['time_stamp']
	));
?>