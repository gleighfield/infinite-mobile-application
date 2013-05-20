<?php
	//Include global config file
	require_once('config.php');
?>
<!-- HEADER START //-->
<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="assets/css/bootstrap.min.css" rel="stylesheet" media="screen">
		<link href="assets/css/bootstrap-responsive.min.css" rel="stylesheet" media="screen">
		<link href="assets/css/styles.css" rel="stylesheet" media="screen">
	</head>
	<body>
		<div id="loader">
			<div id="fountainG">
				<div id="fountainG_1" class="fountainG"></div>
				<div id="fountainG_2" class="fountainG"></div>
				<div id="fountainG_3" class="fountainG"></div>
				<div id="fountainG_4" class="fountainG"></div>
				<div id="fountainG_5" class="fountainG"></div>
				<div id="fountainG_6" class="fountainG"></div>
				<div id="fountainG_7" class="fountainG"></div>
				<div id="fountainG_8" class="fountainG"></div>
			</div>
		</div>
		<div class="container">
			<div class="masthead">
				<h3 class="muted"><?= $s['site_name']; ?></h3>
				<div class="navbar">
					<div class="navbar-inner">
						<div class="container">
							<ul class="nav">
								<li>
									<a href="/"><i class="icon-home"></i> Home</a>
								</li>
								<li>
									<a href="user.php"><i class="icon-user"></i> Users</a>
								</li>
								<li>
									<a href="channel.php"><i class="icon-eye-open"></i> Channels</a>
								</li>
								<!--<li>
									<a href="#"><i class="icon-icon-question-sign"></i> Questionnaires</a>
								</li>
								<li>
									<a href="#"><i class="icon-list"></i> Articles</a>
								</li>
								<li>
									<a href="#">item</a>
								</li>
								<li>
									<a href="#">item</a>
								</li>//-->
							</ul>
						</div>
					</div>
				</div>
			</div>
<!-- HEADER END //-->
