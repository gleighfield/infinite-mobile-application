var site_url = "http://infinite.gelstudios.co.uk/ajax/device/";

//For development production site
//site_url = "http://infinite.gelstudios.co.uk/live/ajax/device/";

var applicationVersion = 0.1;
var loadedArticle = 0;
var loadedQuestionnaire = 0;
var push;
var deviceId;

//**************************************************************************************************
//Init Functions
function init () {
	if (window.localStorage.getItem("email")) {
		$.mobile.changePage("home.html");
	}
	else {
		//User not yet registered
		console.log("LOGIN PAGE SHOWN DUE TO NO STORED LOCAL DATA");
		$.mobile.changePage("#login", {transition:"slideup"});
	}
}

//**************************************************************************************************
//Login Page Functions
function userLogin (email) {	

	push.getPushID(function (id) {
		deviceId = id;
	});
	
	$.ajax({
		type: "POST",
		url : site_url + 'user_login.php',
		dataType : 'json',
		data : {
			'user_email' 	: email,
			'push_id'		: deviceId
		},			
		success : function (data) {
			initApplication(data, email);
		},
		error : function (xhr) {
  			alert(xhr.statusText);
		}
	});
}

//Basic init of the application including all placeholders for content as and when required
function initApplication (user, email) {

	window.localStorage.setItem("userid", user['id']);
	window.localStorage.setItem("firstname", user['firstname']);
	window.localStorage.setItem("lastname", user['lastname']);
	window.localStorage.setItem("channel", user['channel']);
	window.localStorage.setItem("email", email);
	window.localStorage.setItem("settings_version", applicationVersion);
	window.localStorage.setItem("settings_channelName", user['channel_name']);
	window.localStorage.setItem("settings_emailTotal", 0);
	
	alert("Thanks " + window.localStorage.getItem('firstname') + ", you have been successfully registered.");
	
	console.log("USER REGISTERED");
	
	//Set tag as channel ID
	var new_tag = window.localStorage.getItem('channel');
	var new_alias = window.localStorage.getItem('email');
	
	//Add a push tag
	console.log("GEL STUDIOS ADDING NEW PUSH TAG : " + new_tag)
	push.getTags(function(obj) {
		if (obj.tags.indexOf(new_tag) == -1) {
			console.log("GEL STUDIOS VALID TAG : " + new_tag)
			obj.tags = obj.tags.concat([new_tag])
			push.setTags(obj.tags, function() {
				add_tag(new_tag)
				console.log("GEL STUDIOS TAG ADDED : " + new_tag)
			})
		}
	})
		
	//Add an alias
    push.setAlias(new_alias, function() {
		console.log("GEL STUDIOS ALIAS SET : " + new_alias)
	})
	
	$.mobile.changePage("home.html", {transition:"slidedown"});
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
	var localArticles = $.parseJSON(window.localStorage.getItem("Articles"));
	var newLocalArticles = {};
	//If no storage is returned, set as empty object
	if (localArticles == null) {
		localArticles = {};
	}
	$.each(articles, function(i) {
		//If this already exsits or the published time stamp is not equal to that of the remote version, skip
		if (!localArticles["articleId_" + articles[i]['id']] || localArticles["articleId_" + articles[i]['id']]['published'] != articles[i]['timestamp']) {
			var article = {};
				article['id'] 			= articles[i]['id'];
				article['title'] 		= articles[i]['title'];
				article['content'] 		= articles[i]['content'];
				article['alert']		= articles[i]['alert'];
				article['published'] 	= articles[i]['timestamp'];
			
			newLocalArticles["articleId_" + articles[i]['id']] = article;
			console.log('NEW OR UPDATED ARTICLE' + articles[i]['id']);
		}
		else {
			newLocalArticles["articleId_" + articles[i]['id']] = localArticles["articleId_" + articles[i]['id']];
		}
	});
	window.localStorage.setItem("Articles", JSON.stringify(newLocalArticles));
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
	var localQuestionnaires = $.parseJSON(window.localStorage.getItem("Questionnaires"));
	//If no storage is returned, set as empty object
	if (localQuestionnaires == null) {
		localQuestionnaires = {};
	}
	$.each(questionnaires, function(i) {
		//If this already exsits or the created time stamp is not equal to that of the remote version, skip
		if (!localQuestionnaires["questionnaireId_" + questionnaires[i]['id']] || localQuestionnaires["questionnaireId_" + questionnaires[i]['id']]['published'] != questionnaires[i]['created']) {
			var questionnaire = {};
				questionnaire['id'] 		= questionnaires[i]['id'];
				questionnaire['title'] 		= questionnaires[i]['title'];
				questionnaire['options'] 	= questionnaires[i]['options'];
				questionnaire['answers']	= '';
				questionnaire['published']  = questionnaires[i]['created'];
				questionnaire['status'] 	= 0; //Not completed
			
			localQuestionnaires["questionnaireId_" + questionnaires[i]['id']] = questionnaire;
			console.log('SAVED QUESTIONNAIRE' + questionnaires[i]['id']);
		}
	});
	window.localStorage.setItem("Questionnaires", JSON.stringify(localQuestionnaires));
}

//Wipe the entire devices data
function wipeData() {
	var x = confirm("Are you sure you want to wipe all data and reset this application?");
	if (x) {
		window.localStorage.clear();
		navigator.app.exitApp(); //Andriod only
	}
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
			
			var emailTotal = parseInt(window.localStorage.getItem("settings_emailTotal"));
			emailTotal++;
			window.localStorage.setItem("settings_emailTotal", emailTotal);
			
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
	var questionnairesSavedAnswersHtml = '<li data-role="list-divider">Saved Answers</li>';
	var questionnairesAnsweredHtml = '<li data-role="list-divider">Answered</li>';
	
	$.each(questionnaires, function(i) {
		//New
		if (questionnaires[i]['status'] == 0) {
			var html = '<li><a href="#" data-questionnaireId="' + questionnaires[i]['id'] + '" data-icon="arrow-l" class="questionnaire">' + questionnaires[i]['title'] + '</a></li>';
			questionnairesUnansweredHtml += html;
		}
		//Saved questions
		else if (questionnaires[i]['status'] == 1) {
			var html = '<li><a href="#" data-questionnaireId="' + questionnaires[i]['id'] + '" data-icon="arrow-l" class="questionnaire">' + questionnaires[i]['title'] + '</a></li>';
			questionnairesSavedAnswersHtml += html;
		}
		//Published
		else if (questionnaires[i]['status'] == 2){
			var html = '<li><span data-questionnaireId="' + questionnaires[i]['id'] + '" class="questionnaire">' + questionnaires[i]['title'] + '</span></li>';
			questionnairesAnsweredHtml += html;
		}
	});
	
	$('#questionnaireUnanswered_list').html(questionnairesUnansweredHtml);
	$('#questionnaireSavedAnswers_list').html(questionnairesSavedAnswersHtml);
	$('#questionnaireAnswered_list').html(questionnairesAnsweredHtml);
}

//**************************************************************************************************
//Questionnaires Container Page Functions
//Load the questionnaire from local storage
function loadQuestionnaire(questionnaireId) {
	var questionnaire = $.parseJSON(window.localStorage.getItem("Questionnaires"))["questionnaireId_" + questionnaireId];
	$('#questionnaires_title').html(questionnaire['title']);
	buildQuestions(questionnaire['options'], questionnaire['id'], questionnaire['answers']);
};

//**************************************************************************************************
// QUESTION RENDERING FUNCTIONS START
//**************************************************************************************************

//Determine type and build html
function buildQuestions (questions, qId, answers) {
	console.log(answers);

	var html = "";
	$.each(questions, function(k, v) {
		switch (questions[k]['type']) {
			case '0' :
				html += makeTextInput(questions[k], answers[questions[k]['qid']]);
				break;
			case '1' :
				html += makeDropDown(questions[k], answers[questions[k]['qid']]);
				break;
			case '2' :
				html += makeSlider(questions[k], answers[questions[k]['qid']]);
				break;
			case '3' :
				html += makeRadio(questions[k], answers[questions[k]['qid']]);
				break;
			case '4' :
				//				html += makeCheckBox(questions[k], answers);
				break;
			default :
				alert("Unknown Question Type - Abort");
				return false;
		}
	});

	showQuestions(html, qId);
}

//Renders a text input question
function makeTextInput (q, answer) {
	if (answer == undefined) {
		answer = '';
	}
	
	var question = '<input type="text" name="' + q['qid'] + '" value="' + answer + '">';
	return makeQuestion(q['title'], question, q['qid']);
}

//Renders a dropDown question
function makeDropDown (q, answer) {
	var options = $.parseJSON(q['options']);
	
	if (answer == undefined) {
		answer = '';
	}	
	
	var question = '<select name="' + q['qid'] + '">';
		$.each(options, function (k, v) {
			var selected = '';
			if (k == answer) {
				selected = 'selected'
			}
			question += '<option value="' + k + '" data-state="' + options[k]['state'] + '" ' + selected + '>' + options[k]['title'] + '</option>';
		});
	question += '</select>';
	return makeQuestion(q['title'], question, q['qid']);
}

//Renders a slider out to the screen
function makeSlider(q, answer) {
	var options = $.parseJSON(q['options']);
	
	if (answer == undefined) {
		answer = options['sliderstart'];
	}	
	var question = '<input name="' + q['qid'] + '" data-highlight="true" type="range" value="' + answer + '" min="0" max="' + options['slidermax'] + '" step="' + options['sliderstep'] + '">';
	return makeQuestion(q['title'], question, q['qid']);
}

//Renders a radio selection box
function makeRadio (q, answer) {
	var options = $.parseJSON(q['options']);	
	
	if (answer == undefined) {
		answer = '';
	}
	
	var question = '<fieldset data-role="controlgroup">';
	var count = 0;
		$.each(options, function (k, v) {
			var checked = '';
			if (k == answer) {
				checked = 'checked="checked"';
			}
			
			question += '\
			<input type="radio" name="' + q['qid'] + '" id="' + q['id'] + '_' + count + '" value="' + k + '" ' + checked + '>\
     			<label for="' + q['id'] + '_' + count + '">' + options[k]['title'] + '</label>';
			count ++;
		});
	question += '</fieldset>';
	return makeQuestion(q['title'], question, q['qid']);
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
};

//**************************************************************************************************
// QUESTION RENDERING FUNCTIONS END
//**************************************************************************************************

//**************************************************************************************************
// QUESTION SUBMITTION AND SAVING FUNCTIONS START
//**************************************************************************************************

function saveQuestions(qId, confirm) {
	var questionnaires = $.parseJSON(window.localStorage.getItem("Questionnaires"));
	var questionnaire = questionnaires['questionnaireId_' + qId];
	var answers = {};
	var questionsLength = $('.answer').length;
	$('.answer').each(function (i) {
		var ele = $(this);
		var l = ele.find('input[name]').length;
		var id = ele.attr('id');
		var a = '';
		
		//Drop down list
		if(l == 0) {
			a = ele.find('option:selected').val();
		}
		
		//Normal text value box or slider
		if(l == 1) {
			a = ele.find('input').val();
		}
		
		//Radio options
		if(l > 1) {
			a = ele.find('label.ui-radio-on').closest('.ui-radio').find('input').val();
		}
		
		answers[id] = a;		
	});
	
	//Update the answers field on the array
	questionnaire['answers'] = answers;
	questionnaire['status'] = 1; //Set as saved answers
	
	//Update the global object with the new id
	questionnaires['questionnaireId_' + qId] = questionnaire;
	
	//Save back to storage
	window.localStorage.setItem("Questionnaires", JSON.stringify(questionnaires));
	
	if (confirm) {
		alert("Answers saved");
		$.mobile.changePage("questionnaires.html", {transition:"slideup", changeHash:false});
	}
}

function submitQuestionnaire(qId) {
	var questionnaires = $.parseJSON(window.localStorage.getItem("Questionnaires"));
	var questionnaire = questionnaires['questionnaireId_' + qId];
	var answers = questionnaire['answers'];
	
	$.ajax({
		type: "POST",
		url : site_url + 'submit_questionnaire.php',
		dataType : 'json',
		data : {
			'questionnaire' : qId,
			'user_id' 		: window.localStorage.getItem("userid"),
			'channel' 		: window.localStorage.getItem("channel"),
			'answers'		: answers
		},			
		success : function (data) {
			//Set questionnaire as submitted
			questionnaire['status'] = 2; //Answered
	
			//Update the global object with the new id
			questionnaires['questionnaireId_' + qId] = questionnaire;
	
			//Save back to storage
			window.localStorage.setItem("Questionnaires", JSON.stringify(questionnaires));

			alert("Questionnaire submitted");
			$.mobile.changePage("questionnaires.html", {transition:"slideup", changeHash:false});
		},
		error : function (xhr) {
  			console.log("ERROR SUBMITTING QUESTIONNAIRE");
		}
	});
}

//**************************************************************************************************
// QUESTION SUBMITTION AND SAVING FUNCTIONS END
//**************************************************************************************************


//**************************************************************************************************
//Settings Page Functions
function loadSettings() {
		$('#settings_version').html(window.localStorage.getItem("settings_version"));
		$('#settings_email').html(window.localStorage.getItem("email"));
		$('#settings_channelName').html(window.localStorage.getItem("settings_channelName"));
		$('#settings_articlesTotal').html(window.localStorage.getItem("settings_articlesTotal"));
		$('#settings_questionnairesTotal').html(window.localStorage.getItem("settings_questionnairesTotal"));
		$('#settings_emailTotal').html(window.localStorage.getItem("settings_emailTotal"));
}

//External url trigger
function externalLink(url) {
	window.open(url, '_system');
}

//**************************************************************************************************

/* Dom Ready */
$(function () {
	
	//ExternalLink handler
	$('.externalLink, #articles_content a').live('click', function (e) {
		e.preventDefault();
		var url = $(this).attr('href');
		externalLink(url);
	});
	
	//Init Check after page has been rendered
	$('#loading').live('pagecreate', function (e) {
		init();
		
		$('.lsClear').die().live('click', function () {
			wipeData();
		});
	});
	
	//Login Page Functions
	$('#login_user_submit').click(function () {
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
	$('#getInTouch').die().live('pagecreate', function (e) {
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
		
		$('#saveAnswers').die().live('click', function () {
			var questionnaire = $('#submitQuestionnaire').attr('data-questionnaire');
			saveQuestions(questionnaire, true);
		});
		
		$('#submitQuestionnaire').die().live('click', function () {
			var questionnaire = $(this).attr('data-questionnaire');
			saveQuestions(questionnaire);
			submitQuestionnaire(questionnaire);
		});
	});
	
	//Settings Page Functions
	$('#settings').die().live('pagecreate', function (e) {
		console.log("SETTINGS PAGE SHOWN");
		loadSettings();
		
		$('.lsClear').die().live('click', function () {
			wipeData();
		});
	})
});

var startTest = function() {
	$('body').imagesLoaded(function($images, $proper, $broken ) {

		// see console output for debug info
		ImgCache.options.debug = true;
		ImgCache.options.usePersistentCache = true;

		ImgCache.init(function() {
			// 1. cache images
			for (var i = 0; i < $proper.length; i++) {
				ImgCache.cacheFile($($proper[i]).attr('src'));
			}
			// 2. broken images get replaced
			for (var i = 0; i < $broken.length; i++) {
				ImgCache.useCachedFile($($broken[i]));
			}

		});
	});
};

if (typeof(cordova) !== 'undefined') {
	document.addEventListener('deviceready', startTest, false);
} else {
	$(document).ready(startTest);
}

/* PUSH NOTIFICATIONS FUNCTIONS *
//Set the quiet time
function setPushQuietTime(startHour, startMinute, endHour, endMinute) {
      push.setQuietTime(startHour, startMinute, endHour, endMinute, function() {
        	console.log("GEL STUDIOS QUIET TIME SET")
      })
})

/* PUSH NOTIFICATIONS INIT*/
function pushInit() {
	document.addEventListener("deviceready", function() {		
		
    	push = window.pushNotification
    	
    	function on_push(data) {
			console.log("GEL STUDIOS - RECIVED PUSH : " + data.message);
			//We got a push, lets now fetch our new data.
			fetchArticles();
			fetchQuestionnaires();
			jQuery.mobile.changePage(window.location.href, {
		        allowSamePageTransition: true,
		        transition: 'none',
		        reloadPage: true
		    });
		}
		
		function on_reg(error, appID) {
		  	if (!error) {
		    	console.log("GEL STUDIOS - REG SUCCESS ID : " + appId);
		  	}
		}

    	// Reset Badge on resume
    	document.addEventListener("resume", function() {
      		push.resetBadge()

    	})

    	push.getIncoming(function (incoming) {
      		if(incoming.message) {
        		console.log("GEL STUDIOS INCOMING PUSH : " + incoming.message)
      		} else {
        		console.log("No incoming message")
      		}
    	})

    	push.registerEvent('registration', on_reg)
    	push.registerEvent('push', on_push)

	/* GETTERS */
	
	    //push.isPushEnabled(function(has_push) {})
	    //push.isSoundEnabled(function(has_sound) {})
	    //push.isVibrateEnabled(function(has_vibrate) {})
	    //push.isQuietTimeEnabled(function(has_quiettime) {})
	    //push.isLocationEnabled(function(enabled) {})
	    //push.getAlias(function (alias) {});
	    
	   	//Fetch tags
/*	    push.getTags(function(obj) {
	      	obj.tags.forEach(function(tag) {
	      		console.log("GEL STUDIOS TAG : " + tag)
	      	})
	    }) */
	    
	    //Fetch Quiet Time
/*	    push.getQuietTime(function(obj) {
		      //start hour val = obj.startHour, //start min val = obj.startMinute, //end hour val = obj.endHour, //end min val = valobj.endMinute
	    }) */
	    
	/* SETTERS */

		//Enable of disable push notifications
	    //push.enablePush()
	    //push.disablePush()

		//Enable of disable sound
		//push.setSoundEnabled(true)
	    //push.setSoundEnabled(false)

		//Enable of disable vibrate
        //push.setVibrateEnabled(true)
        //push.setVibrateEnabled(false)

		//Enable of disable quiet time 
	    //push.setQuietTimeEnabled(true)
	    //push.setQuietTimeEnabled(false)

		//Enable or disable location based services 
	    //push.enableLocation()
	    //push.disableLocation()

		//Fetch ID
	    push.getPushID(function (id) {
		      	if(id) {
			        console.log("GEL STUDIOS GOT PUSH ID : " + id);		         
		      	}
	    })

	    push.registerForNotificationTypes(push.notificationType.badge | push.notificationType.sound | push.notificationType.alert)
	    
	    //If android do something unique
	    if (device.platform != "Android") {}
	    
	}, false)
}
/* PUSH NOTIFICATIONS END*/