<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1>Channels</h1>
			<p class="lead">Here, you can add a new channel, which you can then assign users, and articles to.</p>
			<button class="btn btn-large btn-success" data-target="#addChannel" data-toggle="modal">Add a new channel</button>
			<table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
<?
	$query = $db->query("
	SELECT 
		name
	FROM channels
	ORDER BY name DESC
	LIMIT 100");

	while($channel = $query->fetch(PDO::FETCH_ASSOC)) {
?>
                    <tr>
                        <td><?= $channel['name'] ?></td>
                    </tr>
<?
	}
?>
                </tbody>
			</table>
		</div>
		<hr>
		
		<div id="addChannel" class="modal hide fade">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3>Add a new channel</h3>
			</div>
			<div class="modal-body">
				<form class="form-horizontal">
					<div class="control-group">
						<label class="control-label" for="inputChannelname">Name</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-eye-open"></i></span>
								<input type="text" id="inputChannelname" placeholder="Name">
							</div>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
				<a href="#" id="addChannelSubmit" class="btn btn-success">Add channel</a>
			</div>
		</div>
		
<?php
	require_once('includes/footer.php');
?>

