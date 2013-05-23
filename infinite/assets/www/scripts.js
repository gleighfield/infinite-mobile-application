var site_url = "http://infinite.gelstudios.co.uk/ajax/device/";
var loadedArticle = 0;
var loadedQuestionnaire = 0;

//**************************************************************************************************
//Init Functions
function init () {
	if (window.localStorage.getItem("email")) {
		$.mobile.changePage("home.html");
	}
	else {
		//User not yet registered
		//$.mobile.changePage("#login", {transition:"slideup"});
		$.mobile.changePage("home.html", {transition:"slideup"});
	}
}

//Fetch articles that are relavent to this user and channel
function fetchArticles() {
	$.ajax({
		type: "POST",
		url : site_url + 'fetch_articles.php',
		dataType : 'json',
		data : {
			'channel' : window.localStorage.getItem("channel"),
			'user_id' : window.localStorage.getItem("userid")
		},			
		success : function (data) {
			storeArticles(data);
		},
		error : function (xhr) {
  			console.log("ERROR LOADING ARTICLES");
		}
	});
}

function storeArticles(articles) {
	var localArticles = {};
	$.each(articles, function(i) {
		var article = {};
			article['id'] 			= articles[i]['id'];
			article['title'] 		= articles[i]['title'];
			article['content'] 		= articles[i]['content'];
			article['alert']		= articles[i]['alert'];
			article['published'] 	= articles[i]['timestamp'];
		
		localArticles["articleId_" + articles[i]['id']] = article;
	});
	
	window.localStorage.setItem("Articles", JSON.stringify(localArticles));
}

//Fetch questionnaires that are relavent to this user and channel
function fetchQuestionnaires() {
	$.ajax({
		type: "POST",
		url : site_url + 'fetch_questionnaires.php',
		dataType : 'json',
		data : {
			'channel' : window.localStorage.getItem("channel"),
			'user_id' : window.localStorage.getItem("userid")
		},			
		success : function (data) {
			storeQuestionnaires(data);
		},
		error : function (xhr) {
  			console.log("ERROR LOADING QUESTIONNAIRES");
		}
	});
}

function storeQuestionnaires(questionnaires) {
	var localQuestionnaires = {};
	$.each(questionnaires, function(i) {
		var questionnaire = {};
			questionnaire['id'] 		= questionnaires[i]['id'];
			questionnaire['title'] 		= questionnaires[i]['title'];
			questionnaire['options'] 	= questionnaires[i]['options'];
			questionnaire['answers']	= '';
			questionnaire['status'] 	= 0; //Not completed
		
		localQuestionnaires["questionnaireId_" + questionnaires[i]['id']] = questionnaire;
	});
	
	window.localStorage.setItem("Questionnaires", JSON.stringify(localQuestionnaires));
}

//Adds the users details into DOM Local storage
function addUserToLocalStorage (user) {
	window.localStorage.setItem("userid", user['id']);
	window.localStorage.setItem("firstname", user['firstname']);
	window.localStorage.setItem("lastname", user['lastname']);
	window.localStorage.setItem("channel", user['channel']);
	window.localStorage.setItem("email", user['email']);
	window.localStorage.setItem("settings_version", 0.1);
	window.localStorage.setItem("settings_channelName", user['channel_name']);
	window.localStorage.setItem("settings_articlesTotal", 0);
	window.localStorage.setItem("settings_emailTotal", 0);
}

//Wipe the entire devices data
function wipeData() {
	var x = confirm("Are you sure you want to wipe all data on this device?");
	if (x) {
		window.localStorage.clear();
		navigator.app.exitApp(); //Andriod only
	}
}

//**************************************************************************************************
//Login Page Functions
function userLogin (email) {		
	$.ajax({
		type: "POST",
		url : site_url + 'user_login.php',
		dataType : 'json',
		data : {
			'user_email' : email
		},			
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
//Articles Page Functions
function showArticle(articleId) {
	loadedArticle = articleId;
	$.mobile.changePage("articles_container.html", {transition:"pop", changeHash:false});
};

//Load all articles in storage to the screen;
function loadArticles() {
	var articles = $.parseJSON(window.localStorage.getItem("Articles"));	
	var articlesHtml = "";
	$.each(articles, function(i) {
		var html = '<li><a href="#" data-articleId="' + articles[i]['id'] + '" data-icon="arrow-l" class="article">' + articles[i]['title'] + '</a></li>';
		articlesHtml = articlesHtml + html;
	});
	
	$('#articles_list').html(articlesHtml);
}

//Articles Container Page Functions
function loadArticle(articleId) {
	var articles = $.parseJSON(window.localStorage.getItem("Articles"));
	$('#articles_title').html(articles["articleId_" + articleId]['title']);
	$('#articles_content').html(articles["articleId_" + articleId]['content']);
}

//**************************************************************************************************
//Questionnaires Container Page Functions
function showQuestionnaire(questionnaireId) {
	loadedQuestionnaire = questionnaireId;
	$.mobile.changePage("questionnaires_container.html", {transition:"pop", changeHash:false});
}

//Load all questionnaires in storage to the screen;
function loadQuestionnaires() {
	var questionnaires = $.parseJSON(window.localStorage.getItem("Questionnaires"));	
	var questionnairesUnansweredHtml = '<li data-role="list-divider">Unanswered</li>';
	var questionnairesAnsweredHtml = '<li data-role="list-divider">Answered</li>';
	
	$.each(questionnaires, function(i) {
		if (questionnaires[i]['status'] == 0) {
			var html = '<li><a href="#" data-questionnaireId="' + questionnaires[i]['id'] + '" data-icon="arrow-l" class="questionnaire">' + questionnaires[i]['title'] + '</a></li>';
			questionnairesUnansweredHtml = questionnairesUnansweredHtml + html;
		}
		else {
			var html = '<li><span data-questionnaireId="' + questionnaires[i]['id'] + '" class="questionnaire">' + questionnaires[i]['title'] + '</span></li>';
			questionnairesAnsweredHtml = questionnairesAnsweredHtml + html;
		}
	});
	
	$('#questionnaireUnanswered_list').html(questionnairesUnansweredHtml);
	$('#questionnaireAnswered_list').html(questionnairesAnsweredHtml);
}

//**************************************************************************************************
//Questionnaires Container Page Functions
//Load the questionnaire from local storage
function loadQuestionnaire(questionnaireId) {
	var questionnaire = $.parseJSON(window.localStorage.getItem("Questionnaires"))["questionnaireId_" + questionnaireId];
	$('#questionnaires_title').html(questionnaire['title']);
	buildQuestions(questionnaire['options']);
};

//**************************************************************************************************
// QUESTION RENDERING FUNCTIONS START
//**************************************************************************************************

//Determine type and build html
function buildQuestions (questions) {
	var html = "";
	$.each(questions, function(k, v) {

		switch (questions[k]['type']) {
			case '0' :
				html += makeTextInput(questions[k]);
				break;
			case '1' :
				html += makeDropDown(questions[k]);
				break;
			case '2' :
				html += makeSlider(questions[k]);
				break;
			case '3' :
				html += makeRadio(questions[k]);
				break;
			case '4' :
				//				html += makeCheckBox(questions[k]);
				break;
			default :
				alert("Unknown Question Type - Abort");
				return false;
		}
	});

	showQuestions(html, questions['id']);
}

//Renders a text input question
function makeTextInput (q) {
	var question = '<input type="text" name="' + q['qid'] + '" value="">';
	return makeQuestion(q['title'], question, q['qid']);
}

//Renders a dropDown question
function makeDropDown (q) {
	var options = $.parseJSON(q['options']);
	console.log(options);

	var question = '<select name="' + q['qid'] + '">';
		$.each(options, function (k, v) {
			question += '<option value="' + k + '" data-state="' + options[k]['state'] + '">' + options[k]['title'] + '</option>';
		});
	question += '</select>';
	return makeQuestion(q['title'], question, q['id']);
}

//Renders a slider out to the screen
function makeSlider(q) {
	var options = $.parseJSON(q['options']);	
	var question = '<input name="' + q['id'] + '" data-highlight="true" type="range" value="' + options['sliderstart'] + '" min="0" max="' + options['slidermax'] + '" step="' + options['sliderstep'] + '">';
	return makeQuestion(q['title'], question, q['id']);
}

//Renders a radio selection box
function makeRadio (q) {
	var options = $.parseJSON(q['options']);
	console.log(options);
	
	var question = '<fieldset data-role="controlgroup">';
	var count = 0;
		$.each(options, function (k, v) {
			question += '\
			<input type="radio" name="' + q['id'] + '" id="' + q['id'] + '_' + count + '" value="' + k + '">\
     			<label for="' + q['id'] + '_' + count + '">' + options[k]['title'] + '</label>';
			count ++;
		});
	question += '</fieldset>';
	return makeQuestion(q.title, question, q.id);
}

//Constructs titles on a per question basis
function makeQuestion (title, q, id) {
	return '\
		<div class="question">\
			<h3>' + title + '</h3>\
			<div id="' + id + '" class="answer">\
				' + q + '\
			</div>\
		</div>';
}

//Wraps the questions with any header or footer bits and bobs
function wrapQuestions (questions, id) {
	var submit = '<button id="submitQuestionnaire" data-questionnaire="' + id + '">Submit!</button>';
	return questions + submit;
}

//Add to DOM and make it all jquery mobile-ish
function showQuestions(questions, id) {
	$('#questionnaires_content').html(wrapQuestions(questions, id));
	//$('#questionnaire').trigger('create');
};


//**************************************************************************************************
// QUESTION RENDERING FUNCTIONS END
//**************************************************************************************************

//**************************************************************************************************
//Settings Page Functions
function loadSettings() {
		$('#settings_version').html(window.localStorage.getItem("settings_version"));
		$('#settings_email').html(window.localStorage.getItem("email"));
		$('#settings_channelName').html(window.localStorage.getItem("settings_channelName"));
		$('#settings_articlesTotal').html(window.localStorage.getItem("settings_articlesTotal"));
		$('#settings_emailTotal').html(window.localStorage.getItem("settings_emailTotal"));
}

//**************************************************************************************************

/* Dom Ready */
$(function () {
	window.localStorage.setItem("userid", '2');
	window.localStorage.setItem("firstname", 'Graeme');
	window.localStorage.setItem("lastname", 'Leighfield');
	window.localStorage.setItem("channel", 14);
	window.localStorage.setItem("email", 'graeme@gelstudios.co.uk');
	window.localStorage.setItem("settings_version", 0.1);
	window.localStorage.setItem("settings_channelName", 'Channel One');
	window.localStorage.setItem("settings_articlesTotal", 0);
	window.localStorage.setItem("settings_emailTotal", 0);
	
	//Init Check after page has been rendered
	$('#loading').live('pagecreate', function (e) {
		init();
	});
	
	//Login Page Functions
	$('#login_user_submit').click(function () {
		console.log("LOGIN PAGE SHOWN");
		var email = $('#login_user_email').val();
		if (email != null) {
			userLogin(email);
		}
	});
	
	//Home Page Functions
	$('#home').live('pagecreate', function (e) {
		console.log("HOME PAGE SHOWN");
		fetchArticles();
		fetchQuestionnaires();
	});
	
	//Get In Touch Page Functions
	$('#getInTouch').live('pagecreate', function (e) {
		console.log("GET IN TOUCH PAGE SHOWN");
		$('#getInTouch_submit').click(function () {
			sendEmail();
		});
	});
	
	//Articles Page Functions
	$('#articles').live('pagebeforecreate', function (e) {
		console.log("ARTICLES LOADING");
		//Load Articles
		loadArticles();
	});
	
	$('#articles').live('pagecreate', function (e) {
		console.log("ARTICLES PAGE SHOWN");
		$('.article').die().live('click', function () {
			showArticle($(this).attr('data-articleId'));
		});
	});
	
	//Articles Container Page Functions
	$('#articles_container').live('pagebeforecreate', function (e) {
		console.log("ARTICLE ID " + loadedArticle + " LOADED");
		loadArticle(loadedArticle);
	});
	
	$('#articles_container').live('pagecreate', function (e) {
		console.log("ARTICLE SHOWN");
		$('#backButton').die().live('click', function () {
			$.mobile.changePage("articles.html", {transition:"slideup", changeHash:false});
		});
	});
	
	//Questionnaires Page Functions
	$('#questionnaires').live('pagebeforecreate', function (e) {
		console.log("QUESTIONNAIRES LOADING");
		//Load Questionnaires
		loadQuestionnaires();
	});
	
	$('#questionnaires').live('pagecreate', function (e) {
		console.log("QUESTIONNAIRES PAGE SHOWN");
		$('.questionnaire').die().live('click', function () {
			showQuestionnaire($(this).attr('data-questionnaireId'));
		});
	});
	
	//Questionnaires Container Page Functions
	$('#questionnaires_container').live('pagebeforecreate', function (e) {
		console.log("QUESTIONNAIRE ID " + loadedQuestionnaire + " LOADED");
		loadQuestionnaire(loadedQuestionnaire);
	});
	
	$('#questionnaires_container').live('pagecreate', function (e) {
		console.log("QUESTIONNAIRE SHOWN");
		$('#backButton').die().live('click', function () {
			$.mobile.changePage("questionnaires.html", {transition:"slideup", changeHash:false});
		});
	});
	
	//Settings Page Functions
	$('#settings').live('pagecreate', function (e) {
		console.log("SETTINGS PAGE SHOWN");
		loadSettings();
		
		$('#lsClear').live('click', function () {
			wipeData();
		});
	})
});