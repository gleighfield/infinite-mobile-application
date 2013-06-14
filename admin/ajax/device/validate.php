<?php

	//Include global config file
	require_once('../../includes/config.php');
	
	//Check the user is allowed to log into the system
	$data = array (
		'id'		    => $_POST['id']
	);
	
	//Return user information
	$sql = "SELECT id, firstname, lastname, channel, email FROM users WHERE id = :id";
	$userQuery = $db->prepare($sql);
	$userQuery->execute(array(
		':id'	=> $data['id']
	));
	
	$user = $userQuery->fetch(PDO::FETCH_ASSOC);

    //Can extend this in the future to handle deleted or blocked users
	
	echo json_encode($user);

?>