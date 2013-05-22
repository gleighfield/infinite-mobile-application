<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Add a questionnaire container into the system.
	$data = array (
		'user_id' 			=> 0,
		'channel'			=> $_POST['channel'],
		'title'				=> $_POST['title'],
		'validto'			=> $_POST['validto'],
		'published'			=> 0, // Not published by default
		'time_stamp'		=> date('Y-m-d H:i:s'),
	);
	
	//Add questionnaire to DB
	$sql = "INSERT INTO questionnaires (channel, title, created, validto, published) VALUES (:channel, :title, :created, :validto, :published)";
	$addQuestionnaire = $db->prepare($sql);
	$addQuestionnaire->execute(array(
		':channel'		=> $data['channel'],
		':title'		=> $data['title'],
		':created'		=> $data['time_stamp'],
		':validto'		=> $data['validto'],
		':published'	=> $data['published'],
	));
	
	$qid = $db->lastInsertId(); 
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Questionnaire container added "' . $data['title'] . '"',
		':timestamp'	=> $data['time_stamp'],
	));
	
	echo $qid;

?>