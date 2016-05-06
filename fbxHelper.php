<?php
	//$scene = @$_POST['scene']or die("No data!");
	$materials = array();
	if(true){
		$handle = fopen("Bambo_House.fbx", "r") or die("Unable to open file!");
		$content = fread($handle, filesize("Bambo_House.fbx"));
		fclose($handle);
	}
	$rest;
	$pos = strpos($content,"\tMaterial:");
	if($pos){
		$rest = substr($content, $pos);
		echo $rest;
	}else{
		//echo "not found";
	}
	while(strpos($rest,"Material:")){
		echo "it";
		$x = strpos($rest,"Material:");
		$materials[] = substr($rest, 0,$pos);
		$rest = substr($rest, $pos);
	}
	
	print_r ($materials);
	print_r($rest);
	return;
?>