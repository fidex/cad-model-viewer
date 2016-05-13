var shortcode = {};
var container, camera, scene, renderer, mesh, controls, bbox, stats;
var pos_min, pos_max;

//var storage;
var objects = [];
jQuery(function() {

	stats = new Stats();	
	
	var container = jQuery( '#stats' );
	console.log(stats.dom);
	stats.dom.style.top = "150px";
	stats.dom.style.left = "150px";
	container.append( stats.dom );
	//stats.showPanel( 0 );

	initializeShortCode();
    //console.log( "test" );
    //testThreeJs();
    
    //modell();
    //alert(ajaxUrl.ajax_url);
    //saveFileToServer()

    jQuery('#dataHandle').change(function(){
    	var temp = JSON.parse(jQuery(this).val());
    	if(temp["url"].match(/fbx$/)){
    		shortcode["file"] = temp["url"];
    		console.log(shortcode["file"]);
    		try{
			createViewer();
			}
			catch(err){
				console.log(err);
			}
    	}else{
    		alert("Unsuported file format");
    	}
    	
       
        
    });
   
    var i = 0;
    
    jQuery('#shortcode').change(function(){
    	readShortcode();
    });

    jQuery('.parameter').change(function(){
    	if(jQuery(this).attr("type")=="checkbox"){
    		shortcode[jQuery(this).attr("id")] = +jQuery(this).is(':checked');
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
    	try{
		createViewer();
		}
		catch(err){
			console.log(err);
		}
	});
    jQuery('#c_save').click(function(){
    	//createViewer();
    	filename = jQuery("#filename").val()
    	if(filename){
    		checkFilename(filename);
    	}else{
    		alert("please insert a filename");
    		jQuery("#filename").css("background-color","rgba(255,0,0,0.5)");
    	}

    });
    jQuery('.filename').click(function(){
    	jQuery(this).addClass("active");
    	shortcode["file"]= jQuery(this).text() // 0 = path
    	console.log(jQuery(this).text());
		//createShortcode();
    	tryToCreateViewer(jQuery(this).text());
    	
    });
    jQuery('#colorPicker').change(function(){
    	//console.log(jQuery(this).val());
    	shortcode["bg_color"] = jQuery(this).val();
    });
    jQuery('#ground_color').change(function(){
    	changeGroundColor(new THREE.Color(jQuery(this).val()));
    	
    });
    jQuery('#fix_axis').change(function(){
    	fixAxis();    	
    });
    jQuery('#cam_rotation_speed').change(function(){
    	  cameraRotation()
    });    
   // createShortcode();

});
/***
	
*/
function initializeShortCode(){
	shortcode = {
		"file":"samplepath",
        "width":"400",
        "height":"400",
        "bg_color":"#ffffff",
        "material":"phong",
        "cam_rotation_speed":"0",
        "rot_speed_x":"0",
        "rot_speed_y":"0",
        "rot_speed_z":"0",      
       		

	}
	
	//console.log("test this");
	jQuery.each(shortcode, function (key,value){

		console.log(key+" : "+value);
	});
	
}
function createShortcode(){
	var exporter = new THREE.SceneExporter();
	//shortcode[0] = 
	sc = "[foobar ";
	//sc+=' scene="'+ JSON.stringify(scene.toJSON()) +'"';
	
	jQuery.each(shortcode, function (key,value){
		sc += ' '+key+'="'+value+'"';
		//console.log(key+" : "+value);
	});

	sc +="]";
	console.log (sc);
	jQuery("#shortcode").val(sc);
	
	//console.log(scene);
	//console.log(camera);
	//saveFileToServer(storage+"\n#\n"+camstorage);
	//rendstorage = JSON.stringify(renderer.toJSON());

}
function saveFileToServer(){
	
	
	var t = scene.clone();
	t.remove(t.getObjectByName("obj"));
	console.log(scene);
	storage = JSON.stringify(t.toJSON());
	camstorage = JSON.stringify(camera.toJSON());
	filename = jQuery("#filename").val();

	jQuery.ajax({
	  type: 'POST',
	  url: "/wordpress/wp-content/plugins/cad-model-viewer/writeFile.php",
	  data: {"filename":filename,"scene":storage,"cam":camstorage}, 
	  success: function(msg){
	  	//alert(msg);
	  	shortcode["file"] = filename;
	  	createShortcode();

	  },
	  complete: function(){
	  	console.log("i am COMPLETE");
	  },
	  error: function(){
	  	console.log("WTH");
	  }
	});

}
function checkFilename(name){

	jQuery.ajax({
	  type: 'POST',
	  url: "/wordpress/wp-content/plugins/cad-model-viewer/checkFilename.php",
	  data: {"filename":name},
	  success: function(msg){
	  	
	  	if(msg=="true"){
	  		alert("filename already taken, please insert a new");
	  		jQuery('#filename').val("");
	  	}else{
	  		saveFileToServer();
	  	}


	  },
	  complete: function(msg){
	  	//console.log("i am COMPLETE"+ msg);
	  },
	  error: function(msg){ 
	  }
	});

}
function readShortcode(){

}
function tryToCreateViewer(){
	try{
		createViewer();
	}
	catch(err){
		console.log(err);
	}
}

function createViewer(){
	container = jQuery('.canvas');
	if(container.has("canvas")){
		container.empty();
	}

	var filepath ="";// = '/wordpress/wp-content/uploads/';
	if(shortcode["file"]=="samplepath"){
		filepath = '/wordpress/wp-content/uploads/2016/04/Bambo_House.fbx';
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
	scene.add( new THREE.AmbientLight( 0x404040, 1.0 ) );
	
	camera = new THREE.PerspectiveCamera( 50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 100000 );
	//camera.position.y = 300;
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

	
    

	/*
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
	*/
	//var loader = new THREE.ImageLoader( manager );
	//loader.load( '/wordpress/wp-content/uploads/2016/04/building_col_3.jpg', function ( image ) {

		//texture.image = image;
		//texture.needsUpdate = true;

	//} );
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
			
		console.log(object);
		//object.up = new THREE.Vector3(1,0,0);
		//object.name = "obj";
		var ob = new THREE.Object3D();
			
		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				//child.material.map = texture;
				if(shortcode["material"]=="lambert"){
					var objectx = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({color: 0xfcfcfc}));
				}else if(shortcode["material"]=="phong"){
					var objectx = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({color: 0xfcfcfc}));
				}
				ob.add( objectx );
				
			}			
			
		} );
		ob.traverse( function ( child ) {
			child.castShadow =true;
			child.receiveShadow = true;
		} );

		//object.position.y = - 95;
		//objects[0]= ob;
		ob.name="obj";
		//ob.rotation.z = 90 * Math.PI/180;
		//ob.rotation.x = -90 * Math.PI/180;
		console.log(ob);
		
		//objects.push(object);

		bbox = new THREE.BoundingBoxHelper( ob, 0xfff000 );
		//bs = THREE.BoundingSphereHelper(ob, 0xfff000 );
		//bs.update();
		//console.log(bs);
		scene.add( ob);
		
		bbox.update();
		zoomCamera(bbox);
		createGround(bbox);
		console.log(scene);
		bbox.name = filepath;
		bbox.visible = false;
		scene.add( bbox );

	});

	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
        controls.dampingFactor = 0.15;
        controls.rotateSpeed = 0.15;
        //controls.enableZoom = false; 
        controls.autoRotate = true;	
        controls.autoRotateSpeed = 0;       
        console.log(controls);
        

	


}

function render() {
	

	controls.update();

	//camera.position.y = shortcode["ini_rot_z"];
	//camera.lookAt
	//camera.lookAt(new THREE.Vector3(0,0,0));

	//initial rotation
	jQuery.each(objects , function( index, value ) {
  		//objects[index].rotation.x = jQuery("#ini_rot_x").val()/100;
	});


	

	try{
		
		scene.getObjectByName("obj").rotation.x += shortcode["rot_speed_x"]/2000 ;
		scene.getObjectByName("obj").rotation.y += shortcode["rot_speed_y"]/2000 ;
		scene.getObjectByName("obj").rotation.z += shortcode["rot_speed_z"]/2000 ;
		//console.log(scene.getObjectByName("obj").rotation);
		
		//eu = new THREE.Euler();
		//eu.setFromVector3( new THREE.Vector3(1,0,0));
		//scene.getObjectByName("asd").rotation.x += shortcode["x_axis"]/100;

		//objects[0].rotation.y += shortcode["y_axis"]/100;
		//objects[0].rotation.z += shortcode["z_axis"]/100;
		

	}catch(err){
		console.log(err);
	}
    
    renderer.render( scene, camera );
   

}

function animate() {
	stats.begin();
	
	render();

	stats.end();
    requestAnimationFrame( animate );

    
}
function zoomCamera(bbox){
	//http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
	var fov = 50 * ( Math.PI / 180 ); 
	var height = Math.abs(bbox.box.min.y - bbox.box.max.y);
	var width =  Math.abs(bbox.box.min.x - bbox.box.max.x);
	var center = new THREE.Vector3(
		Math.abs(bbox.box.min.x - bbox.box.max.x),
		Math.abs(bbox.box.min.y - bbox.box.max.y),
		Math.abs(bbox.box.min.z - bbox.box.max.z)
		);
	if(bbox.box.min.y > 0){ //basic 
		scene.position.y-= height/2;
	}
	//camera.lookAt(center);
	console.log(bbox);

// Calculate the camera distance
//var distance = Math.abs( Math.max(width,height)  / Math.sin( fov / 2 ) );
//camera.position.z = distance;
 camera.position.y += center.y;

 camera.position.z = (bbox.box.min.y) +Math.abs( Math.max(width,height) / Math.sin( fov / 2 ) );


}
function createGround(bbox){


	var widthx =  Math.abs(bbox.box.min.x - bbox.box.max.x);
	var widthz =  Math.abs(bbox.box.min.z - bbox.box.max.z);
	var c = new THREE.Color(shortcode["ground_color"]);
	var groundMaterial = new THREE.MeshPhongMaterial();
	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( widthx, widthz ), groundMaterial );
	mesh.material.color = c;
	mesh.name="ground";

	//console.log(mesh);
	//console.log(bbox);
	mesh.position.y = bbox.box.min.y;
	//mesh.position.x = -widthx*0.05*0.8;
	//mesh.position.z = -widthz*0.1*0.8;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );
	
	console.log(scene.getObjectByName("ground"));
}
function cameraRotation(){
	controls.autoRotateSpeed = shortcode["cam_rotation_speed"]/100;
}
function enableCameraRotation(){
	controls.autoRotate = true;	
}
function changeGroundColor(c){
	scene.getObjectByName("ground").material.color = c;
}
function changeGroundVisibility(bool){
	scene.getObjectByName("ground").visible = bool;
}
function fixAxis(){
	ob = scene.getObjectByName("obj");
	ob.rotation.z = 90 * Math.PI/180;
	ob.rotation.x = -90 * Math.PI/180;
	bbox.update;
	createGround(bbox);
}
