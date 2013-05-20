var site_url = "http://infinite.gelstudios.co.uk/ajax/device/";

function userLogin (email) {
	var formData = new FormData;
		formData.append('user_email', email);
		
	$.ajax({
		type: "POST",
		url : site_url + 'user_login.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			$('#addChannel').modal('hide');
			alert(data);
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