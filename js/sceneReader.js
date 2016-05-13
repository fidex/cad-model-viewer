jQuery(function() {
    var i = 0;
    jQuery('.canvas').each(function(){
    	console.log(i+": ");i++;  
    	

    	try{
    		sceneReader(jQuery(this));
    	}
    	catch(err){
    		console.log(err);
    	}
    });
    //sceneReader();

});
function sceneReader(c){
	console.log("begin creating Scene");
	var basePath = "/wordpress/wp-content/uploads/cad-model-viewer/";
	var container, camera, scene, renderer, mesh, controls;
	console.log(c.children("script").text());
	var sc = jQuery.parseJSON(c.children("script").text());
	console.log(sc);
    objects = [],

    CANVAS_WIDTH = sc["width"],
    CANVAS_HEIGHT = sc["height"];

	container = c;
	//console.log("rotation: "+container.attr('rotation'))

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
	renderer.setClearColor( sc["bg_color"] );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	container.append( renderer.domElement );

	
	
	

	
	var loader = new THREE.ObjectLoader();	
	
	loader.load( basePath+sc["file"]+".scene", function ( e ) {

		
		scene = e;
		//scene.children[4].visible =false; //box ausblenden

		var loader = new THREE.FBXLoader();		
		loader.load( e.children[4].name , function ( object ) {			
		
		var ob = new THREE.Object3D();
		ob.name ="obj";
		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				//child.material.map = texture;
				if(sc["material"]=="lambert"){
					var objectx = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({color: 0xfcfcfc}));
				}else if(sc["material"]=="phong"){
					var objectx = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({color: 0xfcfcfc}));
				}
				ob.add( objectx );
				
			}			
			
		} );
		ob.traverse( function ( child ) {
			child.castShadow =true;
			child.receiveShadow = true;
		} );

		if(false){ // fix rotation
		object.rotation.z = 90 * Math.PI/180;
		object.rotation.x = -90 * Math.PI/180;
		}
		//object.rotation.x = e.children[4].rotation.x;
		//object.rotation.z = e.children[4].rotation.z;
		//object.position.y = - 95;
		//console.log(object);
		scene.add( ob );
		console.log(scene);

	});
        //scene.add = e.children[0];        
        //scene.add = e.children[1];
        //scene.add = e.children[2];
        //scene.add = e.children[3];

	} );

	
	loader.load( basePath+sc["file"]+".cam", function ( e ) {

		console.log(e);
        camera = e;
        controls = new THREE.OrbitControls( camera, renderer.domElement );
	    controls.enableDamping = true;
	    controls.dampingFactor = 0.15;
	    controls.rotateSpeed = 0.15;
	    controls.enableZoom = false; 
	    controls.autoRotate = true;	
	    controls.autoRotateSpeed = sc["cam_rotation_speed"]/100;       
	    console.log(controls);

	} );    
	

	function render() {


	

    try{
    	controls.update();
		
		scene.getObjectByName("obj").rotation.x += sc["rot_speed_x"]/2000 ;
		scene.getObjectByName("obj").rotation.y += sc["rot_speed_y"]/2000 ;
		scene.getObjectByName("obj").rotation.z += sc["rot_speed_z"]/2000 ;		

	}catch(err){
		//console.log(err);
	}
    
    renderer.render( scene, camera );

	}

	(function animate() {
    requestAnimationFrame( animate );

    render();
	})();

}
