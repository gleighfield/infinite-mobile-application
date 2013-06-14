<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Select a user from the database
	$data = array (
		'loadOrEdit' 	=> $_POST['loadOrEdit'],
		'id'			=> $_POST['id'],
		'user_id' 		=> 0,
		'firstname'		=> $_POST['firstname'],
		'lastname'		=> $_POST['lastname'],
        'email'         => $_POST['email'],
        'channel'		=> $_POST['channel'],
		'time_stamp'	=> date('Y-m-d H:i:s'),
	);
	
	//Loading a user, to be returned to then be edited.
	if ($data['loadOrEdit'] == 0) {
		$sql = "SELECT id, firstname, lastname, email, channel FROM users WHERE id = :id";
		$userQuery = $db->prepare($sql);
		$userQuery->execute(array(
			':id'	=> $data['id']
		));
		
		echo json_encode($userQuery->fetch(PDO::FETCH_ASSOC));
	}
	
	//Editing a user
	if ($data['loadOrEdit'] == 1) {
		$sql = "
		UPDATE users
		SET firstname = :firstname,
			lastname = :lastname,
			email = :email,
			channel = :channel
		WHERE id = :id";
		$editArticle = $db->prepare($sql);
		$editArticle->execute(array(
			':id'			=> $data['id'],
			':firstname'	=> $data['firstname'],
			':lastname'		=> $data['lastname'],
			':email'		=> $data['email'],
            ':channel'		=> $data['channel']
		));
		
		//Add log entry
		$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
		$addLogEntry = $db->prepare($sql);
		$addLogEntry->execute(array(
			':user_id'		=> $data['user_id'],
			':comment'		=> 'User id "' . $data['id'] . '" edited',
			':timestamp'	=> $data['time_stamp']
		));
	}
?>