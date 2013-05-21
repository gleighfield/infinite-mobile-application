var site_url = "http://infinite.gelstudios.co.uk/ajax/device/";

//**************************************************************************************************
//Init Functions
function init () {
	if (window.localStorage.getItem("email")) {
		$.mobile.changePage("#home");
	}
	else {
		//User not yet registered
		//$.mobile.changePage("#login", {transition:"slideup"});
		$.mobile.changePage("#home", {transition:"slideup"});
	}
}

//Adds the users details into DOM Local storage
function addUserToLocalStorage (user) {
	window.localStorage.setItem("userid", user['id']);
	window.localStorage.setItem("firstname", user['firstname']);
	window.localStorage.setItem("lastname", user['lastname']);
	window.localStorage.setItem("email", user['email']);
}

//Wipe the entire devices data
function wipeData() {
	window.localStorage.clear();
}

//**************************************************************************************************
//Login Page Functions
function userLogin (email) {		
	$.ajax({
		type: "POST",
		url : site_url + 'user_login.php',
		dataType : 'json',
		data : 'user_email=' + email,			
		success : function (data) {
			addUserToLocalStorage(data);
			alert("Thanks " + data['firstname'] + ", you have been successfully registered.");
			$.mobile.changePage("#home", {transition:"slidedown"});
		},
		error : function (xhr) {
  			alert(xhr.statusText);
		}
	});
}

//**************************************************************************************************
//Get In Touch Page Functions
function sendEmail () {
	var message = $("#getInTouch_message").val();
	var telephone = $("#getInTouch_telephone").val();
	
	if (message == "" || telephone == "") {
		alert("Please enter a valid message and/or telephone number");
		return false;
	}

	$.ajax({
		type: "POST",
		url : site_url + 'submit_email.php',
		dataType : 'json',
		data : {
			'message' 		: message,
			'telephone' 	: telephone,
			'user_email'	: window.localStorage.getItem("email"),
			'user_id'		: window.localStorage.getItem("userid")
		},			
		success : function (data) {
			alert("Thanks " + window.localStorage.getItem('firstname') + ", your email has been successfully sent.");
			$.mobile.changePage("home.html", {transition:"slidedown"});
		},
		error : function (xhr) {
  			alert(xhr.statusText);
		}
	});
}

//**************************************************************************************************

/* Dom Ready */
$(function () {
	window.localStorage.setItem("userid", '2');
	window.localStorage.setItem("firstname", 'Graeme');
	window.localStorage.setItem("lastname", 'Leighfield');
	window.localStorage.setItem("email", 'graeme@gelstudios.co.uk');
	
	//Init Check after page has been rendered
	$('#loading').live('pagecreate', function (e) {
		init();
	});
	
	//Login Page Functions
	$('#login_user_submit').click(function () {
		var email = $('#login_user_email').val();
		if (email != null) {
			userLogin(email);
		}
	});
	
	//Get In Touch Page Functions
	$('#getInTouch').live('pagecreate', function (e) {
		$('#getInTouch_submit').click(function () {
			sendEmail();
		});
	});
	
	$('#lsClear').click(function () {
		wipeData();
		navigator.app.exitApp(); //Andriod only
	});
});