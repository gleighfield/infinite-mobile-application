<?php
	
	//Include global config file
	require_once('../includes/config.php');
	
	//Add a question into the database
	$data = array (
		'user_id' 			=> 0,
		'questionnaire'		=> $_POST['questionnaire'],
		'title'				=> $_POST['title'],
		'order'				=> $_POST['order'],
		'type'				=> $_POST['type'],
		'options'			=> $_POST['options'],
		'time_stamp'		=> date('Y-m-d H:i:s')
	);
	
	//Add question to DB
	$sql = "INSERT INTO questions (questionnaire, title, `order`, type, options, created) VALUES (:questionnaire, :title, :order, :type, :options, :created)";
	$addItem = $db->prepare($sql);
	$addItem->execute(array(
		':questionnaire'	=> $data['questionnaire'],
		':title'			=> $data['title'],
		':order'			=> $data['order'],
		':type'				=> $data['type'],
		':options'			=> $data['options'],
		':created'			=> $data['time_stamp']
	));
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Question "' . $data['title'] . '" added to Questionnaire ID ' + $data['questionnaire'],
		':timestamp'	=> $data['time_stamp']
	));

?>