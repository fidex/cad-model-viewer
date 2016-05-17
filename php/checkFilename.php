<?php
	$filename = @$_POST['filename']or die("No data!");

	if(file_exists("../../../uploads/cad-model-viewer/".$filename.".scene")){
		die("true");
	}
	die("false");

?>