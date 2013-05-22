
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

$(function () {
	console.log("Questionnaire scripts loaded");
	$('#addQuestion').modal("show");
	
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
});