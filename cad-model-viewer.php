<?php
/**
* Plugin Name: Cad Modell Viewer
* Plugin URI: https://github.com/fidex/cad-model-viewer
* Description: this plugin allows diplaying of FBX-files inside wordpress pages
* Version: 1.0 
* Author: Fide Schuermeyer
* Author URI: Author's website
* License: MIT 
*/

add_action("admin_enqueue_scripts", "enqueue_media_uploader");
add_shortcode( 'cad_modelviewer', 'modeviewer_shorcode_func' );
add_shortcode( 'cad_modelviewer_test', 'modeviewer_shorcode_test_func' );
add_action('admin_menu', 'create_backend_page');
register_activation_hook( __FILE__, 'activation' );

function activation() {
    // Activation code here...
}

/*
enables the access of the wordPress media library through javascript
*/
function enqueue_media_uploader()
{
    wp_enqueue_media();
}
/*
handels the interpretion of the shortcode cad_modelviewer
*/
function modeviewer_shorcode_func( $atts ){	

	wp_enqueue_script('jQuery');
    wp_enqueue_script('three.js',plugin_dir_url(__FILE__) ."/js/three.js/build/three.min.js");
    wp_enqueue_script('statsjs',plugin_dir_url(__FILE__) ."/js/stats.js/src/stats.js");    
    wp_enqueue_script('threeFBX',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/loaders/FBXLoader.js");   
    wp_enqueue_script('threeOrb',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/controls/OrbitControls.js");    
    wp_enqueue_script("sceneReader",plugin_dir_url(__FILE__) ."/js/sceneReader.js"); 

    wp_localize_script( "sceneReader", 'baseUrl', array(
        'url' => ( plugin_dir_url(__FILE__))
    ));   

    $output .= '<div class="model-viewer-canvas">';
    	$output  .='<script type="json">';
        $output  .=json_encode($atts);
        $output  .='</script>';
    $output .='</div>';

    return $output;
}
/*
    creates a new backend page
*/
function create_backend_page() {
    add_object_page( 'modell viewer', 'modell viewer' , 'manage_options', 'modell_viewer', 'backendPage');
    
}
/*
    handels the content of the backend page
*/
function backendPage(){

    wp_enqueue_script('jQuery');
    wp_enqueue_script('three.js',plugin_dir_url(__FILE__) ."/js/three.js/build/three.min.js");
    wp_enqueue_script('statsjs',plugin_dir_url(__FILE__) ."/js/stats.js/build/stats.min.js");
    wp_enqueue_style ('twitterBootstrap', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
    wp_enqueue_style ('stylecss',plugin_dir_url(__FILE__) ."/css/style.css");
    wp_enqueue_script('threeOrbei',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/loaders/OBJLoader.js");
    wp_enqueue_script('threeFBX',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/loaders/FBXLoader.js");
    wp_enqueue_script('threeMTL',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/loaders/MTLLoader.js");
    wp_enqueue_script('threeOrb',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/controls/OrbitControls.js");
    wp_enqueue_script('threetrack',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/controls/TrackballControls.js");

    wp_enqueue_script('threeMTLx',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/loaders/BinaryLoader.js");
    wp_enqueue_script('threeOBJx',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/exporters/SceneExporter.js");
    wp_enqueue_script('threeMTLy',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/Detector.js");
    wp_enqueue_script('threeMTLyyxc',plugin_dir_url(__FILE__) ."/js/three.js/src/loaders/ObjectLoader.js");
    wp_enqueue_script('threeMTLyyxcasd',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/loaders/deprecated/SceneLoader.js");
    
    wp_enqueue_script("upload.js",plugin_dir_url(__FILE__) ."/js/upload.js");
    wp_enqueue_script("modelViewer",plugin_dir_url(__FILE__) ."/js/modelViewer.js");
    wp_enqueue_script("uiHandler",plugin_dir_url(__FILE__) ."/js/uiHandler.js");

    //wp_enqueue_script("sceneReader",plugin_dir_url(__FILE__) ."/js/sceneReader.js");
    wp_localize_script( "uiHandler", 'ajaxUrl', array(
        'url' => ( plugin_dir_url(__FILE__))
    ));
    

    readfile(plugin_dir_url(__FILE__) ."/php/modelViewer.php");


    
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
    print_r('<div class="row" hidden><h3>ftp file list</h3><br>select your files here if they were uploaded via ftp<br>');
    foreach ($files as $f) {
        print_r("<li class='filename'>".$f."</li>");
    }
    print_r('</div>');
    //print_r($files);
    

}
/*
    shortcode used for creating the tests
*/
function modeviewer_shorcode_test_func( $atts ){  
    
    wp_enqueue_script('jQuery');
    wp_enqueue_script('tests',plugin_dir_url(__FILE__) ."/js/test.js");
    wp_enqueue_script('three.js',plugin_dir_url(__FILE__) ."/js/three.js/build/three.min.js");
    wp_enqueue_script('statsjs',plugin_dir_url(__FILE__) ."/js/stats.js/src/stats.js");    
    wp_enqueue_script('threeFBX',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/loaders/FBXLoader.js");   
    wp_enqueue_script('threeOrb',plugin_dir_url(__FILE__) ."/js/three.js/examples/js/controls/OrbitControls.js");    
    wp_enqueue_script("sceneReader",plugin_dir_url(__FILE__) ."/js/sceneReader.js"); 

    wp_localize_script( "tests", 'baseUrl', array(
        'url' => ( plugin_dir_url(__FILE__))
    ));   

    $output .= '<div class="model-viewer-test-canvas">';
        $output .= '<div class="test-container">';
        $output .='</div>';
    $output .='</div>';

    return $output;
}

?>

