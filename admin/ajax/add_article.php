<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Add an article into the database
	$data = array (
		'user_id' 			=> 0,
		'channel'			=> $_POST['channel'],
		'title'				=> $_POST['title'],
		'alert'				=> $_POST['alert'],
		'content'			=> stripslashes($_POST['content']),
		'time_stamp'		=> date('Y-m-d H:i:s'),
		'status'			=> 1 //Enabled by default
	);

	$sql = "INSERT INTO articles (channel, title, alert, content, user_id, timestamp, status) VALUES (:channel, :title, :alert, :content, :user_id, :timestamp, :status)";
	$addItem = $db->prepare($sql);
	$addItem->execute(array(
		':channel'		=> $data['channel'],
		':title'		=> $data['title'],
		':alert'		=> $data['alert'],
		':content'		=> $data['content'],
		':user_id'		=> $data['user_id'],
		':timestamp'	=> $data['time_stamp'],
		':status'		=> $data['status']
	));

    $data['article_id'] = $db->lastInsertId();
	
	//Add log entry
	$sql = "INSERT INTO admin_log (user_id, comment, timestamp) VALUES (:user_id, :comment, :timestamp)";
	$addLogEntry = $db->prepare($sql);
	$addLogEntry->execute(array(
		':user_id'		=> $data['user_id'],
		':comment'		=> 'Article added "' . $data['title'] . '"',
		':timestamp'	=> $data['time_stamp']
	));

    //Fetch the cat name to return to the user to display on screen, and make the created date and time nice
    $sql = "SELECT name FROM channels WHERE id = :id";
    $returnCatName = $db->prepare($sql);
    $returnCatName->execute(array(
        ':id'           => $data['channel'],
    ));

    $data['channel'] = $returnCatName->fetchColumn();
    $data['time_stamp'] = date('d/m/y h:i A', strtotime($data['time_stamp']));

//Start alert
    $alert = json_encode(array(
        "tags"      => $data['channel'],
        "android"   => array(
            "alert"     => "New article '" . $data['title'] . "'",
        ),
    ));

    $session = curl_init(PUSHURL);
    curl_setopt($session, CURLOPT_USERPWD, APPKEY . ':' . PUSHSECRET);
    curl_setopt($session, CURLOPT_POST, True);
    curl_setopt($session, CURLOPT_POSTFIELDS, $alert);
    curl_setopt($session, CURLOPT_HEADER, False);
    curl_setopt($session, CURLOPT_RETURNTRANSFER, True);
    curl_setopt($session, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    $content = curl_exec($session);

    // Check if any error occured
    $response = curl_getinfo($session);
    if($response['http_code'] != 200) {
        echo "Not sent ".
            $response['http_code'] . "\n";
    } else {
        echo json_encode($data);
    }

    curl_close($session);
//End alert

?>