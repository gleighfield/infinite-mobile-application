<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1>Questionnaires</h1>
			<p class="lead">Here, you can add a basic questionnaire to users in a specific channel.</p>
			<p class="lead">To get started, you need to add a questionnaire container.</p>
			<button class="btn btn-large btn-success" data-target="#addQuestionnaireContainer" data-toggle="modal">Add a new questionnaire container</button>
<?
	$query = $db->query("SELECT * FROM questionnaires");
	if ($query->fetch(PDO::FETCH_ASSOC)) {

?>
				<table class="table table-striped table-bordered">
					<tr>
						<th width="40">Actions</th>
						<th>Title</th>
						<th width="40">Questions</th>
						<th>Channel</th>
						<th>Expires</th>
						<th width="30">Published?</th>
					</tr>
<?
		$query = $db->query("
		SELECT 
			questionnaires.id, 
			questionnaires.title, 
			questionnaires.channel, 
			questionnaires.validto, 
			questionnaires.published, 
			channels.name
		FROM questionnaires
		INNER JOIN channels 
			ON questionnaires.channel = channels.id
		ORDER BY validto DESC");

		while($questionnaire = $query->fetch(PDO::FETCH_ASSOC)) {
			$questionCount = $db->query("SELECT COUNT(id) FROM questions WHERE questionnaire = 3")->fetch(PDO::FETCH_NUM);			
			
			$publishedIcon = '<i class="icon-remove"></i>';
			if ($questionnaire['published'] == 1) {
				$publishedIcon = '<i class="icon-ok"></i>';
			}
?>
						<tr>
							<td>
								<a href="questionnaire.php?qid=<?= $questionnaire['id'] ?>" title="Edit this questionnaire">
									<i class="icon-edit"></i>
								</a>
							</td>
							<td><?= $questionnaire['title'] ?></td>
							<td><?= $questionCount[0] ?></td>
							<td><?= $questionnaire['name'] ?></td>
							<td><?= date('d/m/y h:i A', strtotime($questionnaire['validto'])) ?></td>
							<td><?= $publishedIcon ?></td>
						</tr>
<?
		}
?>
				</table>
<?
	}
?>
		</div>
		<hr>
		
		<div id="addQuestionnaireContainer" class="modal hide fade">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3>Add a new questionnaire container</h3>
			</div>
			<div class="modal-body">
				<p>First, you must create a questionnaire container.</p>
				<p>Simply select the channel, give it a title, and set the open until date.</p>
				<p>You can add questions and publish the questionnaire later.</p>
				<hr>
				<form class="form-horizontal">
					<div class="control-group">
						<label class="control-label" for="inputChannel">Channel</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-eye-open"></i></span>
								<select id="inputChannel">
									<option>Select Channel...</option>
									
<?
	$query = $db->query("SELECT * FROM channels ORDER BY name");
	while($data = $query->fetch(PDO::FETCH_ASSOC)) {
?>
									<option value="<?= $data['id'] ?>"><?= $data['name'] ?></option>
<?
	}
?>
								</select>
							</div>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputTitle">Title</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-th-list"></i></span>
								<input type="text" id="inputTitle" placeholder="Article Title">
							</div>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputDate">Open until date</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-calendar"></i></span>
								<input type="date" id="inputDate" placeholder="Article Title">
							</div>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputTime">Open until time</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-time"></i></span>
								<input type="time" id="inputTime" value="12:00" placeholder="Article Title">
							</div>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
				<a href="#" id="addQuestionnaireContainerSubmit" class="btn btn-success">Add questionnaire container</a>
			</div>
		</div>
<?php
	require_once('includes/footer.php');
?>

