jQuery(function() {
    //console.log( "test" );
    //testThreeJs();
    
    //modell();
    console.log(test);
    var i = 0;
    jQuery('.canvas').each(function(){
    	console.log(i+": ");i++;  
    	console.log(jQuery(this).attr('rotation'));

    	try{
    		testIt(jQuery(this));
    	}
    	catch(err){
    		console.log(err);
    	}
    });

});
function testIt(c){
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
	

	/*
	mesh = new THREE.Mesh( 
	    new THREE.BoxGeometry( 200, 200, 200, 1, 1, 1 ), 
	    new THREE.MeshBasicMaterial( { color : 0xff0000, wireframe: true } 
	) );
	scene.add( mesh );
	*/

	// Load in the mesh and add it to the scene. //http://localhost/wordpress/wp-content/plugins/cad-model-viewer//js/main.js?ver=4.4.2'>
    /*  var loader = new THREE.JSONLoader();
      loader.load( "/wordpress/wp-content/plugins/cad-model-viewer/js/ThreeJs/examples/obj/cubecolors/cubecolors.js", function(geometry){
        var material = new THREE.MeshLambertMaterial({color: 0x55B663});
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
      });
	*/
	
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
function modell(){
	var container;

			var camera, scene, renderer;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;


			init();
			animate();


			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, 1000 / 1000, 1, 2000 );
				camera.position.z = 250;


				// scene

				scene = new THREE.Scene();

				var ambient = new THREE.AmbientLight( 0x101030 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 );
				scene.add( directionalLight );

				//camera.lookAt(scene.position);
				// texture

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
				loader.load( '/wordpress/wp-content/plugins/cad-model-viewer/js/ThreeJs/examples/textures/UV_Grid_Sm.jpg', function ( image ) {

					texture.image = image;
					texture.needsUpdate = true;

				} );

				// model

				var loader = new THREE.OBJLoader( manager );
				loader.load( '/wordpress/wp-content/plugins/cad-model-viewer/js/ThreeJs/examples/obj/male02/male02.obj', function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							//child.material.map = texture;

						}

					} );

					object.position.y = - 95;
					scene.add( object );

				}, onProgress, onError );

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) / 2;
				mouseY = ( event.clientY - windowHalfY ) / 2;

			}

			//

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * .05;
				camera.position.y += ( - mouseY - camera.position.y ) * .05;

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}
}