<?php

	//Include global config file
	require_once('../includes/config.php');
	
	//Publish or unpublish a questionnaire
	$data = array (
		'user_id' 			=> 0,
		'id'				=> $_POST['aid'],
        'channel'           => $_POST['channel'],
        'aName'              => $_POST['name'],
		'published'			=> $_POST['published'],
		'time_stamp'		=> date('Y-m-d H:i:s')
	);
	
	$sql = "UPDATE articles SET status = :published WHERE id = :id";
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
		':comment'		=> 'Article "' . $data['id'] . '" published state set to ' . $data['published'],
		':timestamp'	=> $data['time_stamp'],
	));

    //Are we pusblishing or un publishing? We only want an alert for a publish.
    if ($data['published'] == 1) {
        //Start alert
        $alert = json_encode(array(
            "tags"      => array($data['channel']),
            "android"   => array(
                "alert"     => "New article '" . $data['aName'] . "'",
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
    }
    else {
        echo json_encode($data);
    }
    //End alert
?>