jQuery(function() {
    
    var i = 0;
    jQuery('#c_reload').click(function(){
    	//createViewer();
    	testIt();
    });
    

});
function testIt(){
	var container, camera, scene, renderer, mesh,

    objects = [],

    CANVAS_WIDTH = 400,
    CANVAS_HEIGHT = 400;

	container = jQuery('#lightTest');
	//console.log("rotation: "+container.attr('rotation'))

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	renderer.setClearColor( 0xffffff);

	container.append( renderer.domElement );

	
	scene = new THREE.Scene();
	
	//camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
	//camera.position.y = 150;
	//camera.position.z = 30;
	

	
	var loader = new THREE.ObjectLoader();	
	
	loader.load( '/wordpress/wp-content/plugins/cad-model-viewer/newfile.scene', function ( e ) {

		console.log(e);
        scene = e;

	} );

	
	loader.load( '/wordpress/wp-content/plugins/cad-model-viewer/newfile.cam', function ( e ) {

		console.log(e);
        camera = e;

	} );
    
	

	function render() {

    //mesh.rotation.y += 0.01;
    
    renderer.render( scene, camera );

	}

	(function animate() {
    requestAnimationFrame( animate );

    render();
	})();

}
