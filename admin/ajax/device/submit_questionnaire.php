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

	$answers = "";
	foreach ($data['answers'] as $key => $value) {
		//Questionnaire ID, Question ID, UserID, response
		$answers .= "(" . $data['questionnaire'] . ", " . $key . ", " . $data['user_id'] . ", '" .  $value. "'), ";
	}
	$answers = substr($answers, 0, -2);
	
	//Add completion entry into DB
	$sql = "INSERT INTO completed_questionnaires (questionnaire, user_id, completed) VALUES (:questionnaire, :user_id, :completed)";
	$addQuestionnaireEntry = $db->prepare($sql);
	$addQuestionnaireEntry->execute(array(
		':questionnaire'=> $data['questionnaire'],
		':user_id'		=> $data['user_id'],
		':completed'	=> $data['completed'],
	));
	
	//Add answers into DB
	$sql = "INSERT INTO answers (questionnaireid, questionid, userid, response) VALUES " . $answers;
	$addAnswersEntry = $db->prepare($sql);
	$addAnswersEntry->execute();

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