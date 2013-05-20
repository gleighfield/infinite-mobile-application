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
			alert("There has been an error adding this channel");
		}
	});
};

//Add a new user into the system - attr = firstname, lastname, email, id of selected channel, if admin user or not
function addUser(firstname, lastname, email, channel, admin) {
	loaderShow();
	
	var formData = new FormData;
		formData.append('firstname', firstname);
		formData.append('lastname', lastname);
		formData.append('email', email);
		formData.append('channel', channel);
		formData.append('admin', admin)
	
	$.ajax({
		type: "POST",
		url : 'ajax/add_user.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			loaderHide();
			$('#addUser').modal('hide');
			showNotice('<strong>Success!</strong> "' + firstname + ' ' + lastname + '" was added!');
		},
		error : function (data) {
			alert("There has been an error adding this user");
		}
	});
};

//Add a new article into the system - attr = id of selected channel, title, alertable, content
function addArticle(channel, title, alert, content) {
	loaderShow();
	
	var formData = new FormData;
		formData.append('channel', channel);
		formData.append('title', title);
		formData.append('alert', alert);
		formData.append('content', content);
	
	$.ajax({
		type: "POST",
		url : 'ajax/add_article.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			loaderHide();
			$('#addArticle').modal('hide');
			showNotice('<strong>Success!</strong> " Article "' + title + '" was added!');
		},
		error : function (data) {
			alert("There has been an error adding this article");
		}
	});
};

//Show a notice to the user
function showNotice(message) {
	$('#alert').find('.text').html(message);
	$('#notifications').animate({'top' : '0'}, 500).delay(4000).animate({'top' : '-70px'}, 500);
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
	
	//Init CKE (if any)
	if ($('#textarea').length != 0) {
		CKEDITOR.config.toolbar_Custom=[ ['Format','Templates','Bold','Italic','Underline','-','Superscript','-',['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],'-','NumberedList','BulletedList'], ['Undo','Redo','Link','Unlink']];
		CKEDITOR.replace('textarea', {
			toolbar : 'Custom'
		});
	}
	
	// Add a new channel into the system, click
	$('#addChannelSubmit').click(function (e) {
		e.preventDefault();
		console.log("Add a channel");
		addChannel($('#inputChannelname').val());
	});
	
	//Clear on hide
	$('#addChannel').on('hidden', function () {
		$('#inputChannelname').val('');
	});
	
	// Add a new user into the system, click
	$('#addUserSubmit').click(function (e) {
		e.preventDefault();
		console.log("Add a user");
		var checked = 0;
		if ($('#inputAdmin').attr('checked')) {
			checked = 1;
		}
		addUser($('#inputFirstname').val(), $('#inputLastname').val(), $('#inputEmail').val(), $('#inputChannel').val(), checked);
	});
	
	//Clear on hide
	$('#addUser').on('hidden', function () {
		$('#inputFirstname').val('');
		$('#inputLastname').val('');
		$('#inputEmail').val('');
		$('#inputChannel').val($("#target option:first").val());
		$('#inputAdmin').removeAttr('checked');
	});
	
	// Add a new article into the system
	$('#addArticleSubmit').click(function (e) {
		e.preventDefault();
		console.log("Add an article");
		var checked = 0;
		if ($('#inputAlert').attr('checked')) {
			checked = 1;
		}
		addArticle($('#inputChannel').val(), $('#inputTitle').val(), checked, CKEDITOR.instances.textarea.getData());
	})
	
	//Clear on hide
	$('#addArticle').on('hidden', function () {
		$('#inputChannel').val($("#target option:first").val());
		$('#inputTitle').val('');
		$('#inputAlert').removeAttr('checked');
		CKEDITOR.instances.textarea.setData('');
	});
});