<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1>Articles</h1>
			<p class="lead">Here, you can add or edit news articles. If editing, the edit will appear on the users device, next time they have a valid data signal.</p>
			<button class="btn btn-large btn-success" data-target="#addArticle" data-toggle="modal">Add a new article</button>
			<table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th width="150">Channel</th>
                        <!--<th width="40">Alertable</th>//-->
                        <th width="120">Created</th>
                        <th width="40">Actions</th>
                    </tr>
                </thead>
                <tbody>
<?
	$query = $db->query("
	SELECT 
		articles.id, 
		articles.title, 
		articles.channel, 
		articles.alert,
		articles.timestamp, 
		channels.name
	FROM articles
	INNER JOIN channels 
		ON articles.channel = channels.id
	ORDER BY articles.timestamp DESC
	LIMIT 100");

	while($article = $query->fetch(PDO::FETCH_ASSOC)) {
?>
                    <tr data-articleId="<?= $article['id'] ?>">
                        <td><?= $article['title'] ?></td>
                        <td><?= $article['name'] ?></td>
                        <!--<td><?= $article['alert'] ?></td>//-->
                        <td><?= date('d/m/y h:i A', strtotime($article['timestamp'])) ?></td>
                        <td>
                            <button title="Edit this article" class="btn btn-success editArticleBtn editQuestionsBtn">
                                    Edit
                            </button>
                        </td>
                    </tr>
<?
	}
?>
                </tbody>
			</table>
		</div>
		<hr>
		
		<div id="editArticle" class="modal hide fade">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3>Edit an article</h3>
			</div>
			<div class="modal-body">
				<form class="form-horizontal">
					<div class="control-group">
						<label class="control-label" for="inputEditChannel">Channel</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-eye-open"></i></span>
								<select id="inputEditChannel">
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
						<label class="control-label" for="inputEditTitle">Title</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-th-list"></i></span>
								<input type="text" id="inputEditTitle" placeholder="Article Title">
							</div>
						</div>
					</div>
					<!--<div class="control-group">
						<div class="controls">
							<label class="checkbox">
								<input id="inputAlert" type="checkbox"> Alertable?
							</label>
						</div>
					</div>//-->
				</form>
				<p>Article content</p>
				<textarea id="edittextarea"></textarea>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
				<a href="#" id="editArticleSubmit" class="btn btn-success">Edit article</a>
			</div>
		</div>
		
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
					<!--<div class="control-group">
						<div class="controls">
							<label class="checkbox">
								<input id="inputAlert" type="checkbox"> Alertable?
							</label>
						</div>
					</div>//-->
				</form>
				<p>Article content</p>
				<textarea id="textarea"></textarea>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
				<a href="#" id="addArticleSubmit" class="btn btn-success">Add article</a>
			</div>
		</div>
<?php
	require_once('includes/footer.php');
?>

