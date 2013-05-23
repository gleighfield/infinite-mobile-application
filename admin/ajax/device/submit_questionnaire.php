<?php

	//Include global config file
	require_once('../../includes/config.php');
	
	//Fetch all avalible questionnaires to a user via their channel
	$data = array (
		'questionnaire'	=> $_POST['questionnaire'],
		'user_id'		=> $_POST['user_id'],
		'completed'		=> date('Y-m-d H:i:s'),
		'answers'		=> $_POST['answers']
	);

	$answers = array();

	foreach ($data['answers'] as $key => $value) {
		//Questionnaire ID, Question ID, UserID, response
		$answer = array($data['questionnaire'], $key, $data['user_id'], $value);
		array_push($answers, $answer);
	}

	echo print_r($answers);

	return true;

	$sql = "SELECT id, firstname, lastname, channel FROM users WHERE id = :id";
	$userQuery = $db->prepare($sql);
	$userQuery->execute(array(
		':id'		=> $data['user_id']
	));
	
	$user = $userQuery->fetch(PDO::FETCH_ASSOC);


	//Add log entry
	$sql = "INSERT INTO user_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $user['id'],
		':comment'		=> 'Questionnaire ID ' . $data['questionnaire'] . ' submitted from user ' . $user['firstname'] . ' ' . $user['lastname'],
		':timestamp'		=> $data['time_stamp']
	));
?>