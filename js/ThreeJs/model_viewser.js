jQuery(function() {
    //console.log( "test" );
    //testThreeJs();
    
    //modell();
    var i = 0;
    jQuery('.canvas').each(function(){
    	//console.log(i+": ");i++;  
    	//console.log(jQuery(this).attr('rotation'));
    	try{
    		createViewer(jQuery(this));
    	}
    	catch(err){
    		console.log(err);
    	}
    });

});
function createViewer(c){
	var container, camera, scene, renderer, mesh,

    objects = [],

    CANVAS_WIDTH = 200,
    CANVAS_HEIGHT = 200;

	container = c;
	//console.log("rotation: "+container.attr('rotation'))

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	renderer.setClearColor( 0xffffff, 0.5 );

	container.append( renderer.domElement );

	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000 );
	//camera.position.y = 150;
	camera.position.z = 30;

	var ambient = new THREE.AmbientLight( 0x101030 );
	//scene.add( ambient );
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 10 );
	scene.add( directionalLight );
	directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 10, 0, 0 );
	scene.add( directionalLight );
	//camera.lookAt( scene.position );
	

	
	var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var texture = new THREE.Texture();

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};

	var loader = new THREE.ImageLoader( manager );
	loader.load( '/wordpress/wp-content/uploads/2016/04/building_col_3.jpg', function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;

	} );
	/*
	var mats;
	var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setBaseUrl( '/wordpress/wp-content/uploads/future/' );
				mtlLoader.setPath( '/wordpress/wp-content/uploads/future/' );
				mtlLoader.load( 'Futuristic Apartment.mtl', function( materials ) {

					materials.preload();
					mats = materials;
	});
	*/

	var loader = new THREE.FBXLoader();
		
	
		//loader.load( '/wordpress/wp-content/plugins/cad-model-viewer/js/ThreeJs/examples/models/fbx/xsi_man_skinning.fbx', function ( object ) {
		loader.load( '/wordpress/wp-content/uploads/2016/04/FBX2013/Bambo-House.fbx', function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.map = texture;
			}
			if ( child instanceof THREE.SkinnedMesh ) {
				

			}

		} );

		//object.position.y = - 95;
		//object.rotation.z += 180;
		//object.rotation.x += 180;
		//object.rotation.y += 180;
		scene.add( object );
		objects.push(object);

	}, onProgress, onError );


	//objects.push( mesh );



	function render() {

    //mesh.rotation.y += 0.01;
    if(container.attr("rotation")=="1"){
    	objects[0].rotation.y += 0.01;
    }  
    renderer.render( scene, camera );

	}

	(function animate() {
    requestAnimationFrame( animate );

    render();
	})();

}