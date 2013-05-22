<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1><?= $s['site_name']; ?></h1>
			<p class="lead">From this administration area you can add users, create questionnaires, and create news articles.</p>
			<a class="btn btn-large btn-success" href="user.php">User Area</a>
			<!--<a class="btn btn-large btn-success" href="#">Questionnaires</a>
			<a class="btn btn-large btn-success" href="#">Articles</a>//-->
		</div>
		<hr>
		<div class="row-fluid">
			<div class="span4">
				<h2>Users</h2>
				<ul>
					<li>Test Item One <i class="icon-cog"></i></li> 
					<li>Test Item Two <i class="icon-cog"></i></li>
					<li>Test Item Three <i class="icon-cog"></i></li>
					<li>Test Item Four <i class="icon-cog"></i></li>
					<li>Test Item Five <i class="icon-cog"></i></li>
				</ul>
			</div>
			<div class="span4">
				<h2>Questionnaires</h2>
				<ul>
<?
	$query = $db->query("
	SELECT 
		questionnaires.id, 
		questionnaires.title, 
		questionnaires.channel, 
		channels.name
		FROM questionnaires
		INNER JOIN channels 
			ON questionnaires.channel = channels.id
		ORDER BY validto DESC");

	while($questionnaire = $query->fetch(PDO::FETCH_ASSOC)) {
?>
					<li><?= $questionnaire['title'] ?> |  <?= $questionnaire['name'] ?> <a href="questionnaire.php?qid=<?= $questionnaire['id'] ?>"><i class="icon-search"></i></a></li>
<?
	}
?>
				</ul>
			</div>
			<div class="span4">
				<h2>News Articles</h2>
				<ul>
					<li>Test Item One <i class="icon-cog"></i> <i class="icon-trash"></i></li>
					<li>Test Item Two <i class="icon-cog"></i> <i class="icon-trash"></i></li>
					<li>Test Item Three <i class="icon-cog"></i> <i class="icon-trash"></i></li>
					<li>Test Item Four <i class="icon-cog"></i> <i class="icon-trash"></i></li>
					<li>Test Item Five <i class="icon-cog"></i> <i class="icon-trash"></i></li>
				</ul>
			</div>
		</div>
<?php
	require_once('includes/footer.php');
?>

