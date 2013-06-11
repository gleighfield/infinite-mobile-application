//Add a new row to the table on the page, regardless of type
function addTableRow(row) {
    $('.table').find('tbody').append(row);
}

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
            addTableRow('<tr><td>' + name + '</td></tr>');
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
            data = $.parseJSON(data);
			loaderHide();
			$('#addUser').modal('hide');
			showNotice('<strong>Success!</strong> "' + firstname + ' ' + lastname + '" was added!');
            addTableRow('<tr><td>' + data['user_id'] +'</td><td>' + firstname + '</td><td>' + lastname + '</td><td>' + email + '</td><td>' + data['channel'] + '</td><td>' + data['time_stamp'] + '</td><td>Actions</td></tr>');
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
            data = $.parseJSON(data);
			loaderHide();
			$('#addArticle').modal('hide');
			showNotice('<strong>Success!</strong> " Article "' + title + '" was added!');
            addTableRow('<tr data-articleId="' + data['article_id'] + '"><td>' + title +'</td><td>' + data['channel'] + '</td><td>' + data['time_stamp'] + '</td><td><button title="Edit this article" class="btn btn-success editArticleBtn editQuestionsBtn">Edit</button></td></tr>');
        },
		error : function (data) {
			alert("There has been an error adding this article");
		}
	});
};

//load an article and put into the DOM ready to be edited - attr id of article
function loadEditArticle(articleId) {
	loaderShow();
	var formData = new FormData;
		formData.append('id', articleId);
		formData.append('loadOrEdit', 0);
	
	$.ajax({
		type: "POST",
		url : 'ajax/edit_article.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			data = $.parseJSON(data);
			loaderHide();

			$('#inputEditChannel').val(data['channel']);
			$('#inputEditTitle').val(data['title']);
			CKEDITOR.instances.edittextarea.setData(data['content']);
			$('#editArticleSubmit').attr('data-articleId', articleId);
			$('#editArticle').modal('show');
		},
		error : function (data) {
			alert("There has been an error fetching the data for this article");
		}
	});
}

function editArticle(articleId, channel, title, content) {
	loaderShow();
	var formData = new FormData;
		formData.append('id', articleId);
		formData.append('loadOrEdit', 1);
		formData.append('channel', channel);
		formData.append('title', title);
		formData.append('content', content);
	
	$.ajax({
		type: "POST",
		url : 'ajax/edit_article.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			location.reload();
		},
		error : function (data) {
			alert("There has been an error editing this article");
		}
	});
}

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
			window.location.href = "questionnaire.php?qid=" + data;
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
	var newRow = '<tr><td class="order">' + rowId + '</td><td><div class="input-prepend"><span class="add-on"><i class="icon-tag"></i></span><input type="text" class="questionTitle" placeholder="Choice"></div></td><td><input type="radio" class="questionState" name="correct" value="1"></td><td><button class="btn btn-danger removeRow"><i class="icon-remove icon-white"></i></button></td></tr>';
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
function addQuestion (title, questionType, questionDisplay, order, questionOptions) {
	loaderShow();
	
	if (questionOptions == undefined) {
		questionOptions = ' ';
	}
	
	var rowId = $('#questions').find('tr').length + 1;		
	
	var formData = new FormData;
		formData.append('questionnaire', $('#questionnaire').attr('data-qid'));
		formData.append('title', title);
		formData.append('order', order);
		formData.append('type', questionType);
		formData.append('options', questionOptions);
	
	$.ajax({
		type: "POST",
		url : 'ajax/add_question.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			loaderHide();
			var newRow = '<tr data-questionId="' + data + '"><td class="order">' + rowId + '</td><td>' + title + '</td><td>' + questionDisplay + '</td><td><button class="btn btn-danger removeRowAndDb"><i class="icon-remove icon-white"></i></button></td></tr>';
			//To handle is no tr rows are present
			if (rowId !== 1) {
				target = $('#questions').find('tr:last');
				$(target).after(newRow);
			}
			else {
				$('#questions').html(newRow);
			}
			
			$('#addQuestion').modal("hide");
			showNotice('<strong>Success!</strong> " Question "' + title + '" added!');
		},
		error : function (data) {
			alert("There has been an error adding this question");
		}
	});
}

//Reorder main questions
function reOrderQuestions () {
	$('#questions .order').each(function (i) {
		var order = i + 1;
		var qid = $(this).closest('tr').attr('data-questionId');
		
		//Visually set to user then process due to potential delay
		$(this).html(order);
		
		var formData = new FormData;
			formData.append('questionId', qid);
			formData.append('order', order);
		
		$.ajax({
			type: "POST",
			url : 'ajax/reorder_question.php',
			processData : false,
			contentType : false,
			data : formData,			
			success : function (data) {
				console.log("QUESTIONS RE-OREDER SUCCESSFULLY");
			},
			error : function (data) {
				console.log("THERE HAS BEEN A PROBLEM REORDERING THIS QUESTION ID = " + qid);
			}
		});
	});
}

//Remove a question from the database
function removeQuestion(qid, row) {
	loaderShow();
	
	var formData = new FormData;
		formData.append('questionId', qid);
	
	$.ajax({
		type: "POST",
		url : 'ajax/remove_question.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			reOrderQuestions();
			loaderHide();
			showNotice('<strong>Success!</strong> " Question removed');
			row.fadeOut(350, function () {
				$(this).remove();
			});
		},
		error : function (data) {
			alert("There has been an error removing this question");
		}
	});
}

function publishQuestionnaire(published) {
	loaderShow();
	
	var formData = new FormData;
		formData.append('published', published);
		formData.append('qid', $('#questionnaire').attr('data-qid'));
	
	$.ajax({
		type: "POST",
		url : 'ajax/publish_questionnaire.php',
		processData : false,
		contentType : false,
		data : formData,			
		success : function (data) {
			location.reload();
		},
		error : function (data) {
			alert("There has been an error removing this question");
		}
	});
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

//Fetchs the total number of trs in the question body, thus giving us this items order number
function fetchQuestionOrder() {
	return $('#questions tr').length + 1;
}

//*********************************************************************************************
//GLOBAL FUNCTIONS END
//*********************************************************************************************

$(function () {
	console.log("Scripts loaded");
	
	//Init CKE (if any)
	if ($('#textarea').length != 0) {
		CKEDITOR.config.toolbar_Custom=[ ['Format','Templates','Bold','Italic','Underline','-','Superscript','-',['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],'-','NumberedList','BulletedList'], ['Undo','Redo','Link','Unlink'], ['Image'], ['Source']];
		CKEDITOR.replace('textarea', {
			toolbar : 'Custom'
		});
	}
	
	if ($('#edittextarea').length != 0) {
		CKEDITOR.config.toolbar_Custom=[ ['Format','Templates','Bold','Italic','Underline','-','Superscript','-',['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],'-','NumberedList','BulletedList'], ['Undo','Redo','Link','Unlink'], ['Image'], ['Source']];
		CKEDITOR.replace('edittextarea', {
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
	});
	
	//Edit an article fetch data GETTER
    $('.table').on('click', '.editArticleBtn', function () {
		var articleId = $(this).closest('tr').attr('data-articleId');
		loadEditArticle(articleId);
	});
	
	//Edit an article SETTER
	$('#editArticleSubmit').click(function () {
		var articleId = $(this).attr('data-articleId');
		editArticle(articleId, $('#inputEditChannel').val(), $('#inputEditTitle').val(), CKEDITOR.instances.edittextarea.getData());
	});
	
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
		var order = fetchQuestionOrder();
		
		addQuestion(questionTitle, questionType, "Text Input", order);
	});
	
	//Drop Down list	
	$('#addQuestionnDropDownListSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		var order = fetchQuestionOrder();
		var options = {};
		
		$('#dropDownListOptions tr').each(function (i) {
			var question = {};
				question['title'] = $(this).find(".questionTitle").val();
				question['state'] = 0;
				
			if ($(this).find(".questionState").attr("checked")) {
				//This is the correct answer
				question['state'] = 1;
			}
				
			options[i] = question;
		});
		
		addQuestion(questionTitle, questionType, "Drop down list", order, JSON.stringify(options));
	});
	
	//Slider
	$('#addQuestionnSliderSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		var order = fetchQuestionOrder();
		var options = {};
			options['slidermax'] = $('#inputSliderMaxValue').val();;
			options['sliderstart'] = $('#inputSliderStartValue').val();
			options['sliderstep'] = $('#inputSliderStepValue').val();
		
		addQuestion(questionTitle, questionType, "Slider", order, JSON.stringify(options));
	});
	
	//Radio button
	$('#addRadioButtonSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		var order = fetchQuestionOrder();
		var options = {};
		
		$('#radioButtonOptions tr').each(function (i) {
			var question = {};
				question['title'] = $(this).find(".questionTitle").val();
				question['state'] = 0;
				
			if ($(this).find(".questionState").attr("checked")) {
				//This is the correct answer
				question['state'] = 1;
			}
				
			options[i] = question;
		});
		
		addQuestion(questionTitle, questionType, "Radio buttons", order, JSON.stringify(options));
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
			reOrderQuestions();
		}
	});
	
	//General actions
	$('.addTableOption').click(function () {
		addOptionRow($(this).closest('.tab-pane').find('.table .tableOptions'));
	});
	
	$('.removeRow').live('click', function () {
		removeRow($(this).closest('tr'));
	});
	
	$('#publishQuestionnaire').click(function () {
		var qid = $("#questionnaire").attr("data-qid");
		var x = confirm("Are you sure you want to publish this questionnaire? Changes cannot be made once published")
		if (x) {
			publishQuestionnaire(1);
		}	
	});
	
	$('#unPublishQuestionnaire').click(function () {
		var qid = $("#questionnaire").attr("data-qid");
		var x = confirm("Are you sure you want to take this offline? This action cannot be undone")
		if (x) {
			publishQuestionnaire(0);
		}
	});
	
	//Reset to first form on hide, here to to non visible when hidden
	$('#addQuestion').on('hide', function () {
		$("#myTab a[href=#0]").tab('show');
	});
	
	//Clear on hide
	$('#addQuestion').on('hidden', function () {
		$('#inputQuestionTitle').val('');
		$('#inputQuestionType').val($("#target option:first").val());
		//Reset all radio buttons
		$('.questionState').prop('checked', false);

		//Slider
		$('#inputSliderMaxValue').val('');;
		$('#inputSliderStartValue').val(0);
		$('#inputSliderStepValue').val('5');
		//DropDown
		$('#dropDownListOptions tr:not(:first-child) td').remove();
		$('#dropDownListOptions input').val('');
		
		//Radio
		$('#radioButtonOptions tr:not(:first-child) td').remove();
		$('#radioButtonOptions input').val('');
	});
	
	//Remove question from db
	$('.removeRowAndDb').click(function () {
		var row = $(this).closest('tr');
		var qId = row.attr('data-questionId');
		removeQuestion(qId, row)
	});
//*********************************************************************************************
//QUESTION SCRIPTS END
//*********************************************************************************************
});