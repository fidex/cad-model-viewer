//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var camera, scene, renderer,
			particle1, particle2, particle2,
			light1, light2, light3, light4,
			object, loader;

			var clock = new THREE.Clock();

			init();
			animate();

			function init() {

				var container = document.getElementById( 'lightTest' );

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 100;

				scene = new THREE.Scene();

				//loader = new THREE.BinaryLoader();
				loader = new THREE.FBXLoader();

				var callback = function( geometry ) {
					object.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

					//child.material.map = texture;
					//var bbox = new THREE.Box3().setFromObject(geometry);
					object = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial( { color: 0x555555, specular: 0x111111, shininess: 50 }  )  );
					//object.scale.x = object.scale.y = object.scale.z = 0.80;
					scene.add( object );
					child.visible=true;
					child.castShadow =true;
					child.receiveShadow = true;
					}
					

					} );
					

				};

				//loader.load( "/wordpress/wp-content/plugins/cad-model-viewer/js/ThreeJs/examples/obj/walt/WaltHead_bin.js", callback );
				loader.load( "/wordpress/wp-content/uploads/2016/04/FBX2013/Bambo-House.fbx", callback );
				//loader.load( "/wordpress/wp-content/plugins/cad-model-viewer/js/ThreeJs/examples/models/fbx/xsi_man.fbx", callback );
				
				var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );

				light1 = new THREE.PointLight( 0xff0040, 2, 50 );
				light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
				scene.add( light1 );

				light2 = new THREE.PointLight( 0x0040ff, 2, 50 );
				light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
				scene.add( light2 );

				light3 = new THREE.PointLight( 0x80ff80, 2, 50 );
				light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
				scene.add( light3 );

				light4 = new THREE.PointLight( 0xffaa00, 2, 50 );
				light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
				scene.add( light4 );

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var time = Date.now() * 0.0005;
				var delta = clock.getDelta();

				if( object ) object.rotation.y -= 0.5 * delta;

				light1.position.x = Math.sin( time * 0.7 ) * 30;
				light1.position.y = Math.cos( time * 0.5 ) * 40;
				light1.position.z = Math.cos( time * 0.3 ) * 30;

				light2.position.x = Math.cos( time * 0.3 ) * 30;
				light2.position.y = Math.sin( time * 0.5 ) * 40;
				light2.position.z = Math.sin( time * 0.7 ) * 30;

				light3.position.x = Math.sin( time * 0.7 ) * 30;
				light3.position.y = Math.cos( time * 0.3 ) * 40;
				light3.position.z = Math.sin( time * 0.5 ) * 30;

				light4.position.x = Math.sin( time * 0.3 ) * 30;
				light4.position.y = Math.cos( time * 0.7 ) * 40;
				light4.position.z = Math.sin( time * 0.5 ) * 30;

				renderer.render( scene, camera );

			}