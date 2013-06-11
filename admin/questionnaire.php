<?php
	require_once('includes/header.php');
	
	//Grab fed questionnaire
	$qid = $_GET['qid'];
	
	if (!$qid) {
		die("Not allowed to access directly");
	}
	
	$query = $db->query("SELECT * FROM questionnaires WHERE id =" . $qid);
	$questionnaire = $query->fetch(PDO::FETCH_ASSOC);
?>
		<div class="jumbotron" id="questionnaire" data-qid="<?= $qid ?>">
			<h1><?= $questionnaire['title'] ?></h1>
			<p class="lead">Here, you can add questions to this questionnaire, and arrange their order. When you are finshed, press published.</p>
			<p class="lead">Once a questionnaire is published, changes <strong>cannot</strong> be made.</p>
<? 	if ($questionnaire['published'] == 0) { ?>
			<button class="btn btn-large btn-success" data-target="#addQuestion" data-toggle="modal">Add a new question</button>
			<button class="btn btn-large btn-primary" id="publishQuestionnaire" data->Publish this questionnaire!</button>
			<table class="table table-striped table-bordered">
				<thead>
					<tr>
						<th width="50">Order</th>
						<th>Title</th>
						<th width="150">Question Type</th>
						<th width="100">Actions</th>
					</tr>
				</thead>
				<tbody class="tableOptions ourQuestions" id="questions">
<? 	} else { ?>
			<button class="btn btn-large btn-danger" id="unPublishQuestionnaire">Take this questionnaire offline!</button>
			<table class="table table-striped table-bordered">
				<thead>
					<tr>
						<th width="50">Order</th>
						<th>Title</th>
						<th width="150">Question Type</th>
					</tr>
				</thead>
				<tbody class="tableOptions ourQuestions">
<? 	} ?>
<?
	$query = $db->query("
	SELECT 
		id,
		title, 
		`order`, 
		type
	FROM questions
	WHERE questionnaire = ". $qid ."
	ORDER BY `order` ASC");

	while($question = $query->fetch(PDO::FETCH_ASSOC)) {
		$qType = "";
		switch($question['type']) {
			case 0 :
				$qType = "Text input";
				break;
			case 1 :
				$qType = "Drop down list";
				break;
			case 2 :
				$qType = "Slider";
				break;
			case 3 :
				$qType = "Radio buttons";
				break;
			case 4 :
				$qType = "Check boxes";
				break;
		}
?>
					<tr data-questionId="<?= $question['id'] ?>">
						<td class="order"><?= $question['order'] ?></td>
						<td><?= $question['title'] ?></td>
						<td><?= $qType ?></td>
<? 	if ($questionnaire['published'] == 0) { ?>
						<td>
							<button class="btn btn-danger removeRowAndDb">
								<i class="icon-remove icon-white"></i>
							</button>
						</td>
<? 	} ?>
					</tr>
<?
	}
?>
				
				</tbody>
			</table>
			<p>Drag a row up, or down by the "Order" column to re-order.</p>
		</div>
		<hr>
		
		<div id="addQuestion" class="modal hide fade">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3>Add a new question</h3>
			</div>
			<div class="modal-body">
				<p>Question addition help</p>
				<hr>
				<form class="form-horizontal">
					<div class="control-group">
						<label class="control-label" for="inputQuestionTitle">Question</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class="icon-tag"></i></span>
								<input type="text" id="inputQuestionTitle" placeholder="Question">
							</div>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="inputChannel">Type</label>
						<div class="controls">
							<div class="input-prepend">
								<span class="add-on"><i class=" icon-question-sign"></i></span>
								<select id="inputQuestionType">
									<option value="0">Text input</option>
									<option value="1">Drop down list</option>
									<option value="2">Slider</option>
									<option value="3">Radio buttons</option>
									<!--<option value="4">Check boxes</option>//-->
								</select>
							</div>
						</div>
					</div>
				</form>
				
				<ul id="myTab" class="questionTypes nav nav-tabs">
					<li class="active">
						<a href="#0" data-toggle="tab">Text input</a>
					</li>
					<li class="">
						<a href="#1" data-toggle="tab">Drop down list</a>
					</li>
					<li class="">
						<a href="#2" data-toggle="tab">Slider</a>
					</li>
					<li class="">
						<a href="#3" data-toggle="tab">Radio buttons</a>
					</li>
					<li class="">
						<a href="#4" data-toggle="tab">Check boxes</a>
					</li>
				</ul>
			
				<div id="myTabContent" class="tab-content">
					<div class="tab-pane fade active in" id="0">
						<p>Text inputs are best used to gain feedback from a user. Such uses include "any comments/feedback" e.t.c</p>
						<p>There is no 'correct' response for this question type.</p>
						<form class="form-horizontal">
							<div class="control-group">
								<label class="control-label" for="addQuestionnTextInputSubmit">&nbsp;</label>
								<div class="controls">
									<a href="#" id="addQuestionnTextInputSubmit" class="btn btn-success">Add text input question</a>
								</div>
							</div>
						</form>
					</div>
					<div class="tab-pane fade" id="1">
						<p>Drop down lists are good for selecting single option values, without taking up much screen space.</p>
						<p>Drag a row up, or down by the "Order" column to re-order.</p>
						<table class="table table-striped table-bordered">
							<thead>
								<tr>
									<th>Order</th>
									<th>Option</th>
									<th width="115">Correct Option?</th>
									<th width="50">Remove</th>
								</tr>
							</thead>
							<tbody class="tableOptions" id="dropDownListOptions">
								<tr>
									<td class="order">1</td>
									<td>
										<div class="input-prepend">
											<span class="add-on"><i class="icon-tag"></i></span>
											<input type="text" class="questionTitle" placeholder="Choice">
										</div>
									</td>
									<td>
										<input type="radio" class="questionState" name="correct" value="1">
									</td>
									<td>
										<button class="btn btn-danger removeRow"><i class="icon-remove icon-white"></i></button>
									</td>
								</tr>
							</tbody>
						</table>
						</form>
						<a href="#" class="btn btn-primary rightBtn addTableOption">
							<i class="icon-plus icon-white"></i> Add another drop down list option
						</a>
						<form class="form-horizontal">
							<div class="control-group">
								<label class="control-label" for="addQuestionnTextInputSubmit">&nbsp;</label>
								<div class="controls">
									<a href="#" id="addQuestionnDropDownListSubmit" class="btn btn-success">Add drop down list question</a>
								</div>
							</div>
						</form>
					</div>
					<div class="tab-pane fade" id="2">
						<p>A slider can be used to obtain a number value. Select a start, max and step value.</p>
						<p>A step value indicates the increments to use.</p>
						<form class="form-horizontal">
							<div class="control-group">
								<label class="control-label" for="inputSliderMaxValue">Max Value</label>
								<div class="controls">
									<div class="input-prepend">
										<span class="add-on"><i class="icon-tasks"></i></span>
										<input type="number" id="inputSliderMaxValue" placeholder="Max Value">
									</div>
								</div>
							</div>
							<div class="control-group">
								<label class="control-label" for="inputSliderStartValue">Start Value</label>
								<div class="controls">
									<div class="input-prepend">
										<span class="add-on"><i class="icon-tasks"></i></span>
										<input type="number" id="inputSliderStartValue" placeholder="Start Value" value="0">
									</div>
								</div>
							</div>
							<div class="control-group">
								<label class="control-label" for="inputSliderStepValue">Step Value</label>
								<div class="controls">
									<div class="input-prepend">
										<span class="add-on"><i class="icon-tasks"></i></span>
										<input type="number" id="inputSliderStepValue" placeholder="Step Value" value="5">
									</div>
								</div>
							</div>
							<div class="control-group">
								<label class="control-label" for="addQuestionnTextInputSubmit">&nbsp;</label>
								<div class="controls">
									<a href="#" id="addQuestionnSliderSubmit" class="btn btn-success">Add slider question</a>
								</div>
							</div>
						</form>
					</div>
					<div class="tab-pane fade" id="3">
						<p>Radio buttons are similar to drop down lists, they just display differently.</p>
						<p>Drag a row up, or down by the "Order" column to re-order.</p>
						<table class="table table-striped table-bordered">
							<thead>
								<tr>
									<th>Order</th>
									<th>Option</th>
									<th width="115">Correct Option?</th>
									<th width="50">Remove</th>
								</tr>
							</thead>
							<tbody class="tableOptions" id="radioButtonOptions">
								<tr>
									<td class="order">1</td>
									<td>
										<div class="input-prepend">
											<span class="add-on"><i class="icon-tag"></i></span>
											<input type="text" class="questionTitle" placeholder="Choice">
										</div>
									</td>
									<td>
										<input type="radio" class="questionState" name="correct" value="1">
									</td>
									<td>
										<button class="btn btn-danger removeRow"><i class="icon-remove icon-white"></i></button>
									</td>
								</tr>
							</tbody>
						</table>
						</form>
						<a href="#" class="btn btn-primary rightBtn addTableOption">
							<i class="icon-plus icon-white"></i> Add another radio button option
						</a>
						<form class="form-horizontal">
							<div class="control-group">
								<label class="control-label" for="addQuestionnTextInputSubmit">&nbsp;</label>
								<div class="controls">
									<a href="#" id="addRadioButtonSubmit" class="btn btn-success">Add radio button question</a>
								</div>
							</div>
						</form>
					</div>
					<div class="tab-pane fade" id="4">
						<p>Check boxes</p>
					</div>
				</div>
				
				
				
			</div>
			<div class="modal-footer">
				<a href="#" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</a>
			</div>
		</div>
<?php
	require_once('includes/footer.php');
?>

