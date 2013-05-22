function switchTabs (tab) {
	console.log("Switch tabs to " + tab);
	$("#myTab a[href=#" + tab + "]").tab('show');
}

$(function () {
	console.log("Questionnaire scripts loaded");
	$('#addQuestion').modal("show");
	var questionTitle = $('#inputQuestionTitle').val();
	
	//Text input
	$('#addQuestionnTextInputSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		console.log(questionTitle + " " + questionType);
	});
	
	//Slider
	$('#addQuestionnSliderSubmit').click(function () {
		var questionTitle = $('#inputQuestionTitle').val();
		var questionType = $('#inputQuestionType').val();
		var sliderMax =	$('#inputSliderMaxValue').val();
		var sliderStart = $('#inputSliderStartValue').val();
		var sliderStep = $('#inputSliderStepValue').val();
		console.log(questionTitle + " " + questionType + " " + sliderMax + " " + sliderStart + " " + sliderStep);
	});
	
	$('#inputQuestionType').change(function () {
		switchTabs($(this).val());
	});
});