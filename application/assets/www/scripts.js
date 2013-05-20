var site_url = "http://infinite.gelstudios.co.uk/ajax/device/";

function userLogin (email) {		
	$.ajax({
		type: "POST",
		url : site_url + 'user_login.php',
		dataType : 'json',
		data : 'user_email=' + email,			
		success : function (data) {
			$('#addChannel').modal('hide');
			alert(data['firstname']);
		},
		error : function (xhr) {
  			alert(xhr.statusText);
		}
	});
}

$(function () {
	$('#login').modal('show');
	
	$('#userLogin').click(function () {
		var email = $('#user_email').val();
		if (email != null) {
			userLogin(email);
		}
	});
});