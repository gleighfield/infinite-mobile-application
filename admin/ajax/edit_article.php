<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Select an article from the database
	$data = array (
		'loadOrEdit' 	=> $_POST['loadOrEdit'],
		'id'			=> $_POST['id'],
		'user_id' 		=> 0,
		'channel'		=> $_POST['channel'],
		'title'			=> $_POST['title'],
		'content'		=> $_POST['content'],
		'time_stamp'	=> date('Y-m-d H:i:s'),
	);
	
	//Loading an article, to be returned to then be edited.
	if ($data['loadOrEdit'] == 0) {
		$sql = "SELECT id, channel, title, alert, content FROM articles WHERE id = :id";
		$articleQuery = $db->prepare($sql);
		$articleQuery->execute(array(
			':id'	=> $data['id']
		));
		
		echo json_encode($articleQuery->fetch(PDO::FETCH_ASSOC));
	}
	
	//Editing an article
	if ($data['loadOrEdit'] == 1) {
		$sql = "
		UPDATE articles 
		SET channel = :channel, 
			title = :title, 
			content = :content, 
			user_id = :user_id, 
			timestamp = :timestamp
		WHERE id = :id";
		$editArticle = $db->prepare($sql);
		$editArticle->execute(array(
			':id'			=> $data['id'],
			':channel'		=> $data['channel'],
			':title'		=> $data['title'],
			':content'		=> $data['content'],
			':user_id'		=> $data['user_id'],
			':timestamp'	=> $data['time_stamp']
		));
		
		//Add log entry
		$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
		$addLogEntry = $db->prepare($sql);
		$addLogEntry->execute(array(
			':user_id'		=> $data['user_id'],
			':comment'		=> 'Article edited "' . $data['title'] . '"',
			':timestamp'	=> $data['time_stamp']
		));
	}
?>