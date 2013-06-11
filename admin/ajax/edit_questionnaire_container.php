<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Edit questionnaire container that already exists in the system.
	$data = array (
		'user_id' 			=> 0,
        'qId'               => $_POST['qId'],
		'channel'			=> $_POST['channel'],
		'title'				=> $_POST['title'],
		'validto'			=> $_POST['validto'],
		'time_stamp'		=> date('Y-m-d H:i:s'),
	);

    $sql = "
            UPDATE questionnaires
            SET channel = :channel,
                title = :title,
                created = :timestamp,
                validto = :validto
            WHERE id = :qId";

    $editQuestionnaire = $db->prepare($sql);
    $editQuestionnaire->execute(array(
        ':qId'			=> $data['qId'],
        ':channel'		=> $data['channel'],
        ':title'		=> $data['title'],
        ':validto'		=> $data['validto'],
        ':timestamp'	=> $data['time_stamp']
    ));

    //Add log entry
    $sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
    $addLogEntry = $db->prepare($sql);
    $addLogEntry->execute(array(
        ':user_id'		=> $data['user_id'],
        ':comment'		=> 'Questionnaire container edited "' . $data['title'] . '"',
        ':timestamp'	=> $data['time_stamp']
    ));

?>