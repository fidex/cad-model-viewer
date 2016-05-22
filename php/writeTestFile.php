<?php
	//$scene = @$_POST['scene']or die("No data!");
	$basePath = "../files/";
	$filename = $_POST['data']or die("No data!");;	
	//unlink("newfile.cam");

	
		$myfile = fopen($basePath."test.txt", "a") or die("Unable to open file!");
		$txt = $_POST['data'];
		fwrite($myfile, "\n". $txt);
		fclose($myfile);
	
	return;
?>