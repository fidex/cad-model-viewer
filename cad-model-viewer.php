<?php
/**
* Plugin Name: Cad Modell Viewer
* Plugin URI: http://mypluginuri.com/
* Description: A brief description about your plugin.
* Version: 1.0 or whatever version of the plugin (pretty self explanatory)
* Author: Fide Schuermeyer
* Author URI: Author's website
* License: A "Slug" license name e.g. GPL12
*/

/* 
Shortcodes
Widget
template tag
*/
function enqueue_media_uploader()
{
    wp_enqueue_media();
}

add_action("admin_enqueue_scripts", "enqueue_media_uploader");



add_shortcode( 'foobar', 'foobar_func' );
add_action('admin_menu', 'my_menu');

function my_menu() {
    //add_menu_page('My Page Title', 'My Menu Title', 'manage_options', 'my-page-slug', 'my_function');
    add_object_page( 'modell viewer', 'modell viewer' , 'manage_options', 'modell_viewer', 'backendPage');
    
}


$count = 0;

function foobar_func( $atts ){	

    /*
    $foobar_atts = shortcode_atts( array(
        'file'=>'samplepath',
        'width'=>'400',
        'height'=>'400',
        "bg_color"=>"#ffffff",
        "material"=>"phong",
        "cam_rotation"=>"0",
        "cam_rotation_speed"=>"0",
        "rot_speed_x"=>"0",
        "rot_speed_y"=>"0",
        "rot_speed_z"=>"0",      
        "ground_color"=>'#b4fb29'
    ), $atts );
    */

	
	wp_enqueue_script('jQuery');
    wp_enqueue_script('threejs',plugin_dir_url(__FILE__) ."/js/ThreeJs/build/three.min.js");
    wp_enqueue_script('statsjs',plugin_dir_url(__FILE__) ."/js/stats.js/build/stats.min.js");
    wp_enqueue_script('threeOrbei',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/OBJLoader.js");
    wp_enqueue_script('threeFBX',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/FBXLoader.js");
    wp_enqueue_script('threeMTL',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/MTLLoader.js");
    wp_enqueue_script('threeOrb',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/controls/OrbitControls.js");
    wp_enqueue_script('threetrack',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/controls/TrackballControls.js");

    wp_enqueue_script('threeMTLx',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/BinaryLoader.js");
    wp_enqueue_script('threeOBJx',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/exporters/SceneExporter.js");
    wp_enqueue_script('threeMTLy',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/Detector.js");
    
    //wp_enqueue_script('threeMTL',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/renderers/Projector.js");
    //wp_enqueue_script('threeMTL',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/renderers/CanvasRenderer.js");

    //wp_enqueue_script("testLight.js",plugin_dir_url(__FILE__) ."/js/testLight.js"); php or die
    //wp_enqueue_script("modelViewer",plugin_dir_url(__FILE__) ."/js/modelViewer.js");
    wp_enqueue_script("sceneReader",plugin_dir_url(__FILE__) ."/js/sceneReader.js");
 
    

    $output .= '<div class="canvas" style="width:200px;height:200px;">';
    	$output  .='<script type="json">';
        $output  .=json_encode($atts);
        $output  .='</script>';
    $output .='</div>';

    return $output;
}
function backendPage(){

    wp_enqueue_script('jQuery');
    wp_enqueue_script('threejs',plugin_dir_url(__FILE__) ."/js/ThreeJs/build/three.min.js");
    wp_enqueue_script('statsjs',plugin_dir_url(__FILE__) ."/js/stats.js/build/stats.min.js");
    wp_enqueue_script('threeOrbei',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/OBJLoader.js");
    wp_enqueue_script('threeFBX',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/FBXLoader.js");
    wp_enqueue_script('threeMTL',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/MTLLoader.js");
    wp_enqueue_script('threeOrb',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/controls/OrbitControls.js");
    wp_enqueue_script('threetrack',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/controls/TrackballControls.js");

    wp_enqueue_script('threeMTLx',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/BinaryLoader.js");
    wp_enqueue_script('threeOBJx',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/exporters/SceneExporter.js");
    wp_enqueue_script('threeMTLy',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/Detector.js");
    wp_enqueue_script('threeMTLyyxc',plugin_dir_url(__FILE__) ."/js/ThreeJs/src/loaders/ObjectLoader.js");
    wp_enqueue_script('threeMTLyyxcasd',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/loaders/deprecated/SceneLoader.js");
    //wp_enqueue_script('threeMTL',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/renderers/Projector.js");
    //wp_enqueue_script('threeMTL',plugin_dir_url(__FILE__) ."/js/ThreeJs/examples/js/renderers/CanvasRenderer.js");

    //wp_enqueue_script("testLight.js",plugin_dir_url(__FILE__) ."/js/testLight.js"); php or die
    wp_enqueue_script("upload.js",plugin_dir_url(__FILE__) ."/js/upload.js");
    wp_enqueue_script("modelViewer",plugin_dir_url(__FILE__) ."/js/modelViewer.js");

    //wp_enqueue_script("sceneReader",plugin_dir_url(__FILE__) ."/js/sceneReader.js");
    wp_localize_script( "modelViewer", 'ajaxUrl', array(
        'ajax_url' => admin_url( 'writeFile.php' )
    ));



	//echo get_home_path()."<br>";
	$dir    = get_home_path().'wp-content/uploads';
	$files1 = scandir($dir);
	//print_r($files1);

	$array = array();
    $files = array();
	//http://stackoverflow.com/questions/20045622/php-recursivedirectoryiterator
	foreach ($iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dir, 
        RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST) as $item) {
    // Note SELF_FIRST, so array keys are in place before values are pushed.

        $subPath = $iterator->getSubPathName();
            if($item->isDir()) {
                // Create a new array key of the current directory name.
                $array[$subPath] = array();
            }
            else {
                // Add a new element to the array of the current file name.
                $array[$subPath][] = $subPath;
                if((substr($subPath, -3) === "fbx")){
                $files[] = $subPath;
                //echo $subPath;
                }
            }
    }
    //foreach ($files as $f) {
    //    print_r("<li class='filename'>".$f."</li>");
    //}
    //print_r($files);
    readfile(plugin_dir_url(__FILE__) ."/js/modelViewer.php");

}

?>

