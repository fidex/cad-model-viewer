<?php
	$filename = @$_POST['filename']or die("No data!");

	if(file_exists("../files/scenes/".$filename.".scene")){
		die("true");
	}
	die("false");

?>