<?php
	require_once('includes/header.php');
?>
		<div class="jumbotron">
			<h1>User Administration</h1>
			<p class="lead">Here, you can add a user into the system</p>
			<button class="btn btn-large btn-success" data-target="#addUser" data-toggle="modal">Add a new user</button>
			<!--<a class="btn btn-large btn-success" href="#">Edit an existing user</a>//-->
			<table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th width="40">User ID</th>
                        <th width="150">Firstname</th>
                        <th width="150">Lastname</th>
                        <th width="40">Email</th>
                        <th width="120">Channel Assigned</th>
                        <th width="120">Created</th>
                        <th width="40">Actions</th>
                    </tr>
                </thead>
                <tbody>
<?
	$query = $db->query("
	SELECT 
		users.id,
		users.firstname,
		users.lastname,
		users.email,
		users.channel,
		users.created,
		channels.name
	FROM users
	INNER JOIN channels 
		ON users.channel = channels.id
	ORDER BY users.id ASC
	LIMIT 100");

	while($user = $query->fetch(PDO::FETCH_ASSOC)) {
?>
                    <tr>
                        <td><?= $user['id'] ?></td>
                        <td><?= $user['firstname'] ?></td>
                        <td><?= $user['lastname'] ?></td>
                        <td><?= $user['email'] ?></td>
                        <td><?= $user['name'] ?></td>
                        <td><?= date('d/m/y h:i A', strtotime($user['created'])) ?></td>
                        <td>
                            <!--<a href="questionnaire.php?qid=<?= $article['id'] ?>" title="Edit this questionnaire" class="btn btn-success editQuestionsBtn">
                                Edit
                            </a>//-->
                        </td>
                    </tr>
<?
	}
?>
                </tbody>
			</table>
		</div>
		<hr>
		
		<div id="addUser" class="modal hide fade">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3>Add a new user</h3>
			</div>
			<div class="modal-body">
				<form class="form-horizontal">
					<div class="control-group">
						<label class="control-label" for="inputFirstname">Firstname</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-user"></i></span>
								<input type="text" id="inputFirstname" placeholder="Firstname" class="required">
							</div>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputLastname">Lastname</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-user"></i></span>
								<input type="text" id="inputLastname" placeholder="Lastname" class="required">
							</div>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputEmail">Email</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-envelope"></i></span>
								<input type="text" id="inputEmail" placeholder="Email" class="required">
							</div>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputChannel">Channel</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-eye-open"></i></span>
								<select id="inputChannel" class="required">
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
						<div class="controls">
							<label class="checkbox">
								<input id="inputAdmin" type="checkbox"> Admin User
							</label>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
				<a href="#" id="addUserSubmit" class="btn btn-success">Add user</a>
			</div>
		</div>
<?php
	require_once('includes/footer.php');
?>

