<?php

	//Include global config file
	require_once('../../includes/config.php');
	
	//Fetch all avalible questionnaires to a user via their channel
	$data = array (
		'user_id'		=> $_POST['user_id'],
		'channel'		=> $_POST['channel'],
		'time_stamp'	=> date('Y-m-d H:i:s'),
	);

	$sql = "SELECT id, firstname, lastname, channel FROM users WHERE id = :id";
	$userQuery = $db->prepare($sql);
	$userQuery->execute(array(
		':id'		=> $data['user_id']
	));
	
	$user = $userQuery->fetch(PDO::FETCH_ASSOC);

	//Return questionnaires matching channel ID and published status of 1
	$sql = "
	SELECT id, title
	FROM questionnaires 
	WHERE validto > :validto
		AND channel = :channel
		AND published = 1
	ORDER BY validto DESC";
	$questionnairesQuery = $db->prepare($sql);
	$questionnairesQuery->execute(array(
		':validto'	=> $data['time_stamp'],
		':channel'	=> $data['channel']
	));

	//Array to hold all the questionnaires and there answers
	$questionnaires = array();
	
	while ($questionnaire = $questionnairesQuery->fetch(PDO::FETCH_ASSOC)) {
		//Individual questionnaire array container
		$q = array();
		$q['id'] = $questionnaire['id'];
		$q['title'] = $questionnaire['title'];
		
		
		$sql = "
		SELECT id, title, `order`, type, options
		FROM questions 
		WHERE questionnaire = :questionnaire
		ORDER BY `order` ASC";
		$questionsQuery = $db->prepare($sql);
		$questionsQuery->execute(array(
			':questionnaire'	=> $q['id']
		));
		
		while ($question = $questionsQuery->fetch(PDO::FETCH_ASSOC)) {
			//Individual question array container
			$questions = array();
			$questions['qid'] = $question['id'];
			$questions['order'] = $question['order'];
			$questions['title'] = $question['title'];
			$questions['type']	= $question['type'];
			$questions['options'] = $question['options'];
			$q['options'][$questions['order']] = $questions;
		}
		$questionnaires[$q['id']] = $q;
	}

	//Add log entry
	$sql = "INSERT INTO user_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $user['id'],
		':comment'		=> $user['firstname'] . ' ' . $user['lastname'] . ' questionnaires synced to device',
		':timestamp'		=> $data['time_stamp']
	));

	header('Content-Type: application/json');
	echo json_encode($questionnaires);
?>