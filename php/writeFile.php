<?php
	//$scene = @$_POST['scene']or die("No data!");
	$basePath = "../../../uploads/cad-model-viewer/";
	$filename = $_POST['filename']or die("No data!");;	//unlink("newfile.scene");
	//unlink("newfile.cam");

	
		$myfile = fopen($basePath.$filename.".scene", "w") or die("Unable to open file!");
		fwrite($myfile, $_POST['scene']) or die("error");
		fclose($myfile);

		$myfile = fopen($basePath.$filename.".cam", "w") or die("Unable to open file!");		
		fwrite($myfile, $_POST['cam']) or die("error");
		fclose($myfile);
	
	return;
?>