<?php
	$scene = @$_POST['scene']or die("No data!");

	if(true){
		$myfile = fopen("newfile.scene", "w") or die("Unable to open file!");
		fwrite($myfile, $_POST['scene']);
		fclose($myfile);
	}
	if(true){
		$myfile = fopen("newfile.cam", "w") or die("Unable to open file!");		
		fwrite($myfile, $_POST['cam']);
		fclose($myfile);
	}
	return;
?>