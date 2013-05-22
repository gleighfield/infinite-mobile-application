//*********************************************************************************************
//AJAX FUNCTIONS START
//*********************************************************************************************
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

//Add a new questionnaire container into the system - attr = channel, title, validToDate, validToTime
function addQuestionnaireContainer(channel, title, date, time) {
	loaderShow();
	
	//Lets make the date something nice
	var validTo = date + " " + time + ":00";
	
	var formData = new FormData;
		formData.append('channel', channel);
		formData.append('title', title);
		formData.append('validto', validTo);
	
	$.ajax({
		type: "POST",
		url : 'ajax/add_questionnaire_container.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			loaderHide();
			$('#addQuestionnaireContainer').modal('hide');
			showNotice('<strong>Success!</strong> " Questionnaire container "' + title + '" was added!');
		},
		error : function (data) {
			alert("There has been an error adding this questionnaire");
		}
	});
}
//*********************************************************************************************
//AJAX FUNCTIONS END
//*********************************************************************************************

//*********************************************************************************************
//QUESTION FUNCTIONS START
//*********************************************************************************************
//Switchs tabs on the question type choice select
function switchTabs (tab) {
	$("#myTab a[href=#" + tab + "]").tab('show');
}

//Adds a new question row
function addOptionRow(target) {
	var rowId = target.find('tr').length + 1;	
	target = target.find('tr:last');
	var newRow = '<tr><td class="order">' + rowId + '</td><td><div class="input-prepend"><span class="add-on"><i class="icon-tag"></i></span><input type="text" placeholder="Choice"></div></td><td><input type="radio" name="correct" value="1"></td><td><button class="btn btn-danger removeRow"><i class="icon-remove icon-white"></i></button></td></tr>';
	$(target).after(newRow);
}

//Removes a question row
function removeRow (row) {
	var container = row.closest('.tableOptions').attr('id');
	row.fadeOut(350, function () {
		$(this).remove();
		reorderOptions("#" + container);
	});
}

//Makes the numbers order correctly
function reorderOptions(tableOptions) {
	$(tableOptions + ' .order').each(function (i) {
		$(this).html(i + 1);
	});
}

//Function add question to screen and hide window
function addQuestion (title, type) {
	var rowId = $('#questions').find('tr').length + 1;
	var newRow = '<tr><td class="order">' + rowId + '</td><td>' + title + '</td><td>' + type + '</td><td><button class="btn btn-danger removeRow"><i class="icon-remove icon-white"></i></button></td></tr>';
	
	//To handle is no tr rows are present
	if (rowId !== 1) {
		target = $('#questions').find('tr:last');
		$(target).after(newRow);
	}
	else {
		$('#questions').html(newRow);
	}
	
	$('#addQuestion').modal("hide");
}
//*********************************************************************************************
//QUESTION FUNCTIONS END
//*********************************************************************************************

//*********************************************************************************************
//GLOBAL FUNCTIONS START
//*********************************************************************************************

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
//*********************************************************************************************
//GLOBAL FUNCTIONS END
//*********************************************************************************************

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
	
	// Add a new questionnaire container into the system
	$('#addQuestionnaireContainerSubmit').click(function (e) {
		e.preventDefault();
		console.log("Add a questionnaire");
		addQuestionnaireContainer($('#inputChannel').val(), $('#inputTitle').val(), $('#inputDate').val(), $('#inputTime').val());
	})
	
	//Clear on hide
	$('#addQuestionnaireContainer').on('hidden', function () {
		$('#inputChannel').val($("#target option:first").val());
		$('#inputTitle').val('');
		$('#inputDate').val('');
		$('#inputTime').val('12:00');
	});
	
//*********************************************************************************************
//QUESTION SCRIPTS START
//*********************************************************************************************
	$('#inputQuestionType').change(function () {
		switchTabs($(this).val());
	});
	
	//Text input
	$('#addQuestionnTextInputSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		addQuestion(questionTitle, "Text Input");
	});
	
	//Drop Down list	
	$('#addQuestionnDropDownListSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		addQuestion(questionTitle, "Drop down list");
	});
	
	//Slider
	$('#addQuestionnSliderSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		var sliderMax =	$('#inputSliderMaxValue').val();
		var sliderStart = $('#inputSliderStartValue').val();
		var sliderStep = $('#inputSliderStepValue').val();
		addQuestion(questionTitle, "Slider");
	});
	
	//Radio button
	$('#addRadioButtonSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		addQuestion(questionTitle, "Radio buttons");
	});
	
	//Sortable dropdownlist options
	$('#dropDownListOptions').sortable({
		axis		: "y",
		containment	: "parent",
		cursor		: "move",
		opacity		: "0.7",
		stop		: function (event, ui) {
			reorderOptions('#dropDownListOptions');
		}
	});
	
	//Sortable radio button options
	$('#radioButtonOptions').sortable({
		axis		: "y",
		containment	: "parent",
		cursor		: "move",
		opacity		: "0.7",
		stop		: function (event, ui) {
			reorderOptions('#radioButtonOptions');
		}
	});
	
	//Sortable questions
	$('#questions').sortable({
		axis		: "y",
		containment	: "parent",
		cursor		: "move",
		opacity		: "0.7",
		stop		: function (event, ui) {
			reorderOptions('#questions');
		}
	});
	
	//General multi purpose actions
	$('.addTableOption').click(function () {
		addOptionRow($(this).closest('.tab-pane').find('.table .tableOptions'));
	});
	
	$('.removeRow').live('click', function () {
		removeRow($(this).closest('tr'));
	});
//*********************************************************************************************
//QUESTION SCRIPTS END
//*********************************************************************************************
});