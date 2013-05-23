<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Publish or unpublish a questionnaire
	$data = array (
		'user_id' 			=> 0,
		'id'				=> $_POST['qid'],
		'published'			=> $_POST['published'],
		'time_stamp'		=> date('Y-m-d H:i:s')
	);
	
	$sql = "UPDATE questionnaires SET published = :published WHERE id = :id";
	$addQuestionnaire = $db->prepare($sql);
	$addQuestionnaire->execute(array(
		':id'			=> $data['id'],
		':published'	=> $data['published'],
	)); 
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Questionnaire id ' . $data['id'] . ' published state set to ' . $data['published'],
		':timestamp'	=> $data['time_stamp'],
	));

?>