<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1>Logs</h1>
			<p class="lead">A basic log of the last 25 things to have happened...</p>
			
			<ul id="myTab" class="nav nav-tabs">
				<li class="active"><a href="#userLogs" data-toggle="tab">User Logs</a></li>
				<li class=""><a href="#adminLogs" data-toggle="tab">Admin Logs</a></li>
            </ul>
			
			<div id="myTabContent" class="tab-content">
				<div class="tab-pane fade active in" id="userLogs">
					<table class="table table-striped table-bordered">
						<tr>
							<th>User Log Entry</th>
							<th>Date</th>
						</tr>
<?
	$query = $db->query("SELECT user_id, comment, timestamp FROM user_log ORDER BY timestamp DESC LIMIT 25");
	while($log = $query->fetch(PDO::FETCH_ASSOC)) {
?>
						<tr>
							<td><?= $log['comment'] ?></td>
							<td><?= date('d/m/y h:i A', strtotime($log['timestamp'])) ?></td>
						</tr>
<?
	}
?>
					</table>
				</div>
				<div class="tab-pane fade" id="adminLogs">
					<table class="table table-striped table-bordered">
						<tr>
							<th>Admin Log Entry</th>
							<th>Date</th>
						</tr>
<?
	$query = $db->query("SELECT user_id, comment, timestamp FROM admin_log ORDER BY timestamp DESC LIMIT 25");
	while($log = $query->fetch(PDO::FETCH_ASSOC)) {
?>
						<tr>
							<td><?= $log['comment'] ?></td>
							<td><?= date('d/m/y h:i A', strtotime($log['timestamp'])) ?></td>
						</tr>
<?
	}
?>
					</table>
				</div>
            </div>
		</div>
		<hr>
		
		<div id="addArticle" class="modal hide fade">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3>Add a new article</h3>
			</div>
			<div class="modal-body">
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
						<div class="controls">
							<label class="checkbox">
								<input id="inputAlert" type="checkbox"> Alertable?
							</label>
						</div>
					</div>
				</form>
				<p>Article content</p>
				<textarea id="textarea"></textarea>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
				<a href="#" id="addArticleSubmit" class="btn btn-success">Add Article</a>
			</div>
		</div>
<?php
	require_once('includes/footer.php');
?>

