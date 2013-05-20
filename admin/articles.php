<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1>Articles</h1>
			<p class="lead">Here, you can add news articles into the system on a per-channel basis</p>
			<button class="btn btn-large btn-success" data-target="#addArticle" data-toggle="modal">Add a new article</button>
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

