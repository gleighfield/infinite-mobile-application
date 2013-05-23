<?php
	
	//Include global config file
	require_once('../includes/config.php');
	
	//Ammend a questions order in the database, as an action of re-ordering manually, or deletion of a question
	$data = array (
		'user_id' 			=> 0,
		'id'		=> 		$_POST['questionId'],
		'order'		=>		$_POST['order'],
		'time_stamp'		=> date('Y-m-d H:i:s')
	);
	
	$sql = "UPDATE questions SET `order` = :order WHERE id = :id";
	$addItem = $db->prepare($sql);
	$addItem->execute(array(
		':id'		=> $data['id'],
		':order'	=> $data['order']
	));
?>