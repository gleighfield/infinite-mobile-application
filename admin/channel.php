<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1>Channels</h1>
			<p class="lead">Here, you can add a new channel, which you can then assign questionnaires and news articles to.</p>
			<button class="btn btn-large btn-success" data-target="#addChannel" data-toggle="modal">Add a new channel</button>
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
				<a href="#" class="btn btn-success">Add channel</a>
			</div>
		</div>
<?php
	require_once('includes/footer.php');
?>

