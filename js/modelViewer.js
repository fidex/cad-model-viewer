var shortcode = {};
var container, camera, scene, renderer, mesh, controls;
var pos_min, pos_max;

//var storage;
var objects = [];
jQuery(function() {
	initializeShortCode();
    //console.log( "test" );
    //testThreeJs();
    
    //modell();
    //alert(ajaxUrl.ajax_url);
    //saveFileToServer()
   
    var i = 0;

    jQuery('#shortcode').change(function(){
    	//console.log("hey there, stay out of here");
    	readShortcode();
    });

    jQuery('.parameter').change(function(){
    	if(jQuery(this).attr("type")=="checkbox"){
    		shortcode[jQuery(this).attr("id")] = jQuery(this).is(':checked');
    	}else{
    		shortcode[jQuery(this).attr("id")] = jQuery(this).val();
    	}
    	
    	console.log(shortcode);
    	//createShortcode();
    });

    jQuery('.canvas').each(function(){
    	//console.log(i+": ");i++;  
    	//console.log(jQuery(this).attr('rotation'));
    	try{
    		createViewer();
    		animate();
    	}
    	catch(err){
    		console.log(err);
    	}
    });
    jQuery('#c_reload').click(function(){
    	//createViewer();
    	createShortcode();
    });
    jQuery('#c_save').click(function(){
    	//createViewer();
    	saveFileToServer();
    	createShortcode();
    });
    jQuery('.filename').click(function(){
    	jQuery(this).addClass("active");
    	shortcode["file"]= jQuery(this).text() // 0 = path
    	console.log(jQuery(this).text());
		createShortcode();
    	tryToCreateViewer(jQuery(this).text());
    	
    });
    jQuery('#colorPicker').change(function(){
    	//console.log(jQuery(this).val());
    	shortcode["bg_color"] = jQuery(this).val();
    });
    createShortcode();

});
/***
	
*/
function initializeShortCode(){
	shortcode = {
		"file":"samplepath",
		"width":"400",
		"height":"400",
		"ini_rot_x":"0",
		"ini_rot_y":"0",
		"ini_rot_z":"0",
		"ini_pos_x":"0",
		"ini_pos_y":"0",
		"ini_pos_z":"30",
		"bg_color":"#ffffff",
		"material":"lambert",
		"":"",
		"":"",
		"":"",
		"":"",
		"":"",
		"":"",
		"":"",
		"":"",
		"originalColor":"true",
		"fog":"true",
		"ground":"true",


		

	}
	
	//console.log("test this");
	jQuery.each(shortcode, function (key,value){

		console.log(key+" : "+value);
	});
	
}
function createShortcode(){
	var exporter = new THREE.SceneExporter();
	//shortcode[0] = 
	sc = "[ foobar ";
	//sc+=' scene="'+ JSON.stringify(scene.toJSON()) +'"';
	
	jQuery.each(shortcode, function (key,value){
		sc += ' '+key+'="'+value+'"';
		//console.log(key+" : "+value);
	});

	sc +="]";
	console.log ("Shortcode: "+sc);
	jQuery("#shortcode").val(sc);
	storage = JSON.stringify(scene.toJSON());
	camstorage = JSON.stringify(camera.toJSON());
	console.log(scene);
	console.log(camera);
	//saveFileToServer(storage+"\n#\n"+camstorage);
	//rendstorage = JSON.stringify(renderer.toJSON());

}
function saveFileToServer(){
	jQuery.ajax({
	  type: 'POST',
	  url: "/wordpress/wp-content/plugins/cad-model-viewer/writeFile.php",
	  data: {"scene":storage,"cam":camstorage}, // zu einer variable 3d obj mit 2 kindern machen
	  success: function(msg){
	  	//alert(msg);

	  },
	  complete: function(){
	  	console.log("i am COMPLETE");
	  }
	});

}
function readShortcode(){

}
function tryToCreateViewer(p){
	try{
		createViewer(p);
	}
	catch(err){
		console.log(err);
	}
}

function createViewer(path){
	container = jQuery('.canvas');
	if(container.has("canvas")){
		container.empty();
	}

	var filepath = '/wordpress/wp-content/uploads/';
	if(shortcode["file"]=="samplepath"){
		filepath = '/wordpress/wp-content/uploads/2016/05/Tie_Fighter.fbx';
	}else {
		filepath += shortcode["file"];
	}

	

    CANVAS_WIDTH = jQuery("#c_width").val();
    CANVAS_HEIGHT = jQuery("#c_height").val();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	renderer.setClearColor( shortcode["bg_color"],1);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	container.append( renderer.domElement );

	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0xffffff, 50, 100 );
	scene.add( new THREE.AmbientLight( 0x404040, 2.0 ) );
	
	camera = new THREE.PerspectiveCamera( 60, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 100000 );
	camera.position.z = 30;
	camera.up = new THREE.Vector3(0,1,0);
	//camera.lookAt(new THREE.Vector3(0,0,0));
	

	
	//
	light = new THREE.DirectionalLight( 0xdfebff, 0.25 );
	light.position.set( 0, 200, 0 );
	light.castShadow = true;
	//light.shadow.mapSize.width = 1024;
	//light.shadow.mapSize.height = 1024;
	var d = 10;
	light.shadow.camera.left = - d;
	light.shadow.camera.right = d;
	light.shadow.camera.top = d;
	light.shadow.camera.bottom = - d;
	light.shadow.camera.far = 1000;
	scene.add( light );
	//

	var light1,light2,light3;
	light1 = new THREE.PointLight( 0xffffff, 0.2 );
	light1.castShadow = true;
	light1.position.set(1000,1000,1000);	
	scene.add( light1 );

	light2 = new THREE.PointLight( 0x0040ff, 1, 100 );
	light2.castShadow = true;				
	light2.position.set(0,30,0);
	//scene.add( light2 );

	light3 = new THREE.PointLight( 0x80ff80, 2, 50 );
	light2.position.set(0,0,30);
	//scene.add( light3 );

	
    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xb4fb29, /*specular: 0x111111*/ } );
	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
	mesh.position.y = -5;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	//scene.add( mesh );

	
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
	var mtlLoader = new THREE.MTLLoader();
				mtlLoader.setBaseUrl( '/wordpress/wp-content/uploads/future/' );
				mtlLoader.setPath( '/wordpress/wp-content/uploads/future/' );
				mtlLoader.load( 'Futuristic_Apartment.mtl', function( materials ) {
					materials.preload();
					var objLoader = new THREE.OBJLoader();
					objLoader.setMaterials( materials );
					objLoader.setPath( '/wordpress/wp-content/uploads/future/' );
					objLoader.load( 'Futuristic_Apartment.obj', function ( object ) {
						//object.position.y = - 95;
						object.castShadow = true;
						object.receiveShadow = true;
						console.log("OBJ!!!!!");
						console.log(object);
						scene.add( object );
					}, onProgress, onError );
				});
	
	*/
	

	var loader = new THREE.FBXLoader();

		
	
		//loader.load( '/wordpress/wp-content/plugins/cad-model-viewer/js/ThreeJs/examples/models/fbx/xsi_man_skinning.fbx', function ( object ) {
		loader.load( filepath , function ( object ) {
			
		console.log(object)
			
			
		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				//child.material.map = texture;
				if(shortcode["material"]=="lambert"){
					var objectx = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({color: 0xfcfcfc, map: texture} /*{ color: 0x555555, specular: 0x111111, shininess: 50 }*/  )  );
				}else if(shortcode["material"]=="phong"){
					var objectx = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({color: 0xbfcfcfc, map: texture})  );
				}
				object.add( objectx );
				
			}			
			
		} );
		object.traverse( function ( child ) {
			child.castShadow =true;
			child.receiveShadow = true;
		} );

		//object.position.y = - 95;
		//console.log(object);
		scene.add( object );
		objects.push(object);

		var bbox = new THREE.BoundingBoxHelper( object, 0xfff000 );
		bbox.update();
		zoomCamera(bbox);
		//console.log(bbox);
		//scene.add( bbox );

	}, onProgress, onError );

	/*controls = new THREE.TrackballControls( camera );

				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;

				controls.noZoom = false;
				controls.noPan = false;

				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;*/
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.15;
        controls.rotateSpeed = 0.15;
        controls.enableZoom = false;
        console.log(controls);
        

	
	console.log(scene);
	createShortcode();

}

function render() {

	controls.update();
	//camera.position.y = shortcode["ini_rot_z"];
	//camera.lookAt
	//camera.lookAt(new THREE.Vector3(0,0,0));

	//initial rotation
	jQuery.each(objects , function( index, value ) {
  		objects[index].rotation.x = jQuery("#ini_rot_x").val()/100;
	});
	objects[0].rotation.x = jQuery("#ini_rot_x").val()/100;
	objects[0].rotation.y = jQuery("#ini_rot_y").val()/100;
	objects[0].rotation.z = jQuery("#ini_rot_z").val()/100;

	try{
		//console.log(jQuery("#ini_pos_x").val());
		objects[0].position.x = jQuery("#ini_pos_x").val();
		objects[0].position.y = jQuery("#ini_pos_y").val();
		objects[0].position.z = jQuery("#ini_pos_z").val();

	}catch(err){
		console.log(err);
	}
    //mesh.rotation.y += 0.01;
    if(container.attr("rotation")=="1"){
    	objects[0].rotation.y += 0.01;
    }  
    renderer.render( scene, camera );

}

function animate() {
    requestAnimationFrame( animate );

    render();
}
function zoomCamera(bbox){
	var fov = 50 * ( Math.PI / 180 ); 
	var height = Math.abs(bbox.box.min.y - bbox.box.max.y);
	var width =  Math.abs(bbox.box.min.x - bbox.box.max.x);

// Calculate the camera distance
var distance = Math.abs( Math.max(width,height) *0.7 / Math.sin( fov / 2 ) );
camera.position.z = distance;
/*
var fov = 50 * ( Math.PI / 180 );
var objectSize = 0.6 + ( 0.5 * Math.sin( Date.now() * 0.001 ) );

var cameraPosition = new THREE.Vector3(
    0,
    sphereMesh.position.y + Math.abs( objectSize / Math.sin( fov / 2 ) ),
    0
);
*/
}


