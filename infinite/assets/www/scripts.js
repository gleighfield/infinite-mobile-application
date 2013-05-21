var site_url = "http://infinite.gelstudios.co.uk/ajax/device/";
var loadedArticle = 0;

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
	$.mobile.changePage("articles_container.html", {transition:"pop"});
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

//**************************************************************************************************
//Articles Container Page Functions
function loadArticle(articleId) {
	var articles = $.parseJSON(window.localStorage.getItem("Articles"));
	$('#articles_title').html(articles["articleId_" + articleId]['title']);
	$('#articles_content').html(articles["articleId_" + articleId]['content']);
};

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
		console.log("LOGIN CREATED");
		var email = $('#login_user_email').val();
		if (email != null) {
			userLogin(email);
		}
	});
	
	//Home Page Functions
	$('#home').live('pagecreate', function (e) {
		console.log("HOME CREATED");
		fetchArticles();
		$('#lsClear').live('click', function () {
			wipeData();
		});
	});
	
	//Get In Touch Page Functions
	$('#getInTouch').live('pagecreate', function (e) {
		console.log("GET IN TOUCH CREATED");
		$('#getInTouch_submit').click(function () {
			sendEmail();
		});
	});
	
	//Articles Page Functions
	$('#articles').live('pagecreate', function (e) {
		console.log("ARTICLES CREATED");
		//Load Articles
		loadArticles();
		$('.article').live('click', function () {
			showArticle($(this).attr('data-articleId'));
		});
	});
	
	//Articles Container Page Functions
	$('#articles_container').live('pagecreate', function (e) {
		console.log("ARTICLES CONTAINER CREATED FOR ARTICLE ID " + loadedArticle);
		loadArticle(loadedArticle);
	});

});