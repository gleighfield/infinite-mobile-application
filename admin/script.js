//Add a new channel into the system - attr = name of channel
function addChannel(name) {
	loaderShow();
	
	var formData = new FormData;
		formData.append('name', name);
	
	$.ajax({
		type: "POST",
		url : 'ajax/add_channel.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			loaderHide();
			$('#addChannel').modal('hide');
			showNotice('<strong>Success!</strong> Channel titled "' + name + '" added!');
		},
		error : function (data) {
			alert("There has been an error adding this news item");
		}
	});
};


//Show a notice to the user
function showNotice(message) {
	$('#alert').find('.text').html(message);
	$('#notifications').animate({'top' : '0'}, 500).delay(2000).animate({'top' : '-70px'}, 500);
};

//Show the loader
function loaderShow() {
	console.log("Loader show");
	$('#loader').stop().fadeIn(500);
}

//Hide the loader
function loaderHide() {
	console.log("Loader hide");
	$('#loader').stop().fadeOut(500);
}


$(function () {
	console.log("Scripts loaded");
	
	// Add a new channel into the system, click
	$('#addChannelSubmit').click(function (e) {
		e.preventDefault();
		console.log("Add a channel");
		addChannel($('#inputChannelname').val());
	});
	
	$('#addChannel').on('hidden', function () {
		$('#inputChannelname').val('');
	});
});