class ModelViewer {

    constructor() {
        this.initializeShortCode(); 
        this.createShortcode();
    }

    initializeShortCode() {

        this.shortcode = {
                "file": "samplepath",
                "width": "400",
                "height": "400",
                "bg_color": "#ffffff",
                "material": "phong",
                "cam_rotation_speed": "0",
                "rot_speed_x": "0",
                "rot_speed_y": "0",
                "rot_speed_z": "0",

            }
            //console.log("test this");
        jQuery.each(shortcode, function(key, value) {
            //console.log(key+" : "+value);
        });

    }
    createShortcode() {

        var sc = "[foobar ";
        //sc+=' scene="'+ JSON.stringify(scene.toJSON()) +'"';

        jQuery.each(this.shortcode, function(key, value) {
            sc += ' ' + key + '="' + value + '"';
            //console.log(key+" : "+value);
        });
        sc += "]";
        console.log(sc);
        jQuery("#shortcode").val(sc);

        //console.log(scene);
        //console.log(camera);
        //saveFileToServer(storage+"\n#\n"+camstorage);
        //rendstorage = JSON.stringify(renderer.toJSON());

    }
    

    createViewer() {

        console.log(shortcode);

        this.container = jQuery('.canvas');
        if (this.container.has("canvas")) {
            this.container.empty();
        }

        this.filepath = ""; // = '/wordpress/wp-content/uploads/';
        if (this.shortcode["file"] == "samplepath") {
            this.filepath = '/wordpress/wp-content/uploads/2016/04/Bambo_House.fbx';
        } else {
            this.filepath += this.shortcode["file"];
        }



        //CANVAS_WIDTH = jQuery("#c_width").val();
        //CANVAS_HEIGHT = jQuery("#c_height").val();

        this.CANVAS_WIDTH = this.shortcode["width"];
        this.CANVAS_HEIGHT = this.shortcode["height"];

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        this.renderer.setClearColor(this.shortcode["bg_color"], 1);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.append(this.renderer.domElement);

        this.scene = new THREE.Scene();
        //scene.fog = new THREE.Fog( 0xffffff, 50, 100 );
        this.scene.add(new THREE.AmbientLight(0x404040, 1.0));

        this.camera = new THREE.PerspectiveCamera(50, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 1, 100000);
        //camera.position.y = 300;
        this.camera.up = new THREE.Vector3(0, 1, 0);
        //camera.lookAt(new THREE.Vector3(0,0,0));



        //
        var light = new THREE.DirectionalLight(0xdfebff, 0.25);
        light.position.set(0, 200, 0);
        light.castShadow = true;

        //light.shadow.mapSize.width = 1024;
        //light.shadow.mapSize.height = 1024;
        var d = 10;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        light.shadow.camera.far = 1000;
        this.scene.add(light);
        //

        var light1, light2, light3;
        light1 = new THREE.PointLight(0xffffff, 0.2);
        light1.castShadow = true;
        light1.position.set(1000, 1000, 1000);
        this.scene.add(light1);

        light2 = new THREE.PointLight(0x0040ff, 1, 100);
        light2.castShadow = true;
        light2.position.set(0, 30, 0);
        //scene.add( light2 );

        light3 = new THREE.PointLight(0x80ff80, 2, 50);
        light2.position.set(0, 0, 30);
        //scene.add( light3 );

        var loader = new THREE.FBXLoader();
       
        loader.load(this.filepath, function(object) {

            var ob = new THREE.Object3D();

            object.traverse(function(child) {

                if (child instanceof THREE.Mesh) {


                    if (this.shortcode["material"] == "lambert") {
                        var objectx = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({
                            color: 0xfcfcfc
                        }));
                    } else if (this.shortcode["material"] == "phong") {
                        var objectx = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
                            color: 0xfcfcfc
                        }));
                    }
                    objectx.castShadow = true;
                    objectx.receiveShadow = true;
                    ob.add(objectx);

                }

            }.bind(this));

            ob.name = "obj";

            this.bbox = new THREE.BoundingBoxHelper(ob, 0xfff000);

            this.scene.add(ob);
            this.originalRotation = ob.rotation;
            this.bbox.update();

            this.zoomCamera(this.bbox);
            this.createGround(this.bbox);
            //console.log(scene);
            this.bbox.name = this.filepath;
            ///bbox.visible = false;
            this.scene.add(this.bbox);
            console.log(this.scene);


        }.bind(this));


        var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.15;
        controls.rotateSpeed = 0.15;
        //controls.enableZoom = false; 
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0;
        console.log(controls);
        this.controls = controls;
    }
    /*  */
    render() {

        this.controls.update();

        try {

            this.scene.getObjectByName("obj").rotation.x += this.shortcode["rot_speed_x"] / 2000;
            this.scene.getObjectByName("obj").rotation.y += this.shortcode["rot_speed_y"] / 2000;
            this.scene.getObjectByName("obj").rotation.z += this.shortcode["rot_speed_z"] / 2000;
            this.scene.getObjectByName("ground").rotation.x += this.shortcode["rot_speed_x"] / 2000;
            this.scene.getObjectByName("ground").rotation.y += this.shortcode["rot_speed_y"] / 2000;
            this.scene.getObjectByName("ground").rotation.z += this.shortcode["rot_speed_z"] / 2000;


        } catch (err) {
            console.log(err);
        }

        this.renderer.render(this.scene, this.camera);


    }
    /*  */
    animate() {


        try {

            stats.begin();
            this.render();
            stats.end();

            /*
        		var that = this; // use this, if .bind causes lag
        		requestAnimationFrame( function() { that.animate(); } );
	       */
            requestAnimationFrame(this.animate.bind(this));

        } catch (err) {
            console.log(err.stack)
        }




    }
    zoomCamera(bbox) {
        //http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
        var fov = 50 * (Math.PI / 180);
        var height = Math.abs(bbox.box.min.y - bbox.box.max.y);
        var width = Math.abs(bbox.box.min.x - bbox.box.max.x);
        var center = new THREE.Vector3(
            Math.abs(bbox.box.min.x - bbox.box.max.x),
            Math.abs(bbox.box.min.y - bbox.box.max.y),
            Math.abs(bbox.box.min.z - bbox.box.max.z)
        );
        if (bbox.box.min.y > 0) { //basic 
            this.scene.position.y -= height / 2;
        }
        //camera.lookAt(center);
        console.log(bbox);

        // Calculate the camera distance
        //var distance = Math.abs( Math.max(width,height)  / Math.sin( fov / 2 ) );
        //camera.position.z = distance;
        this.camera.position.y += center.y;
        //camera.position.x = 10;
        //console.log(camera);

        this.camera.position.z = (bbox.box.min.y) + Math.abs(Math.max(width, height) / Math.sin(fov / 2));


    }
    createGround(bbox) {

        var widthx = Math.abs(bbox.box.min.x - bbox.box.max.x);
        var widthz = Math.abs(bbox.box.min.z - bbox.box.max.z);
        var c = new THREE.Color(this.shortcode["ground_color"]);
        var groundMaterial = new THREE.MeshPhongMaterial();
        //var mesh = new THREE.Mesh( new THREE.BoxGeometry( widthx *1.2 , widthz *1.2 , 0.1 ), groundMaterial );
        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(widthx, widthz), Math.max(widthx, widthz), 0.1, 32), groundMaterial);
        mesh.position.x = bbox.box.min.x + widthx / 2;
        mesh.position.z = bbox.box.min.z + widthz / 2;

        mesh.material.color = c;
        mesh.name = "ground";

        //console.log(mesh);
        //console.log(bbox);
        mesh.position.y = bbox.box.min.y;
        //mesh.position.x = -widthx*0.05*0.8;
        //mesh.position.z = -widthz*0.1*0.8;
        //mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        //console.log(scene.getObjectByName("ground"));
    }
    cameraRotation(speed) {
        this.shortcode["cam_rotation_speed"] = speed/100
        this.controls.autoRotateSpeed = speed / 100;
    }
    changeGroundColor(c) {        
        this.scene.getObjectByName("ground").material.color = c;
    }
    changeGroundVisibility(bool) {
        this.scene.getObjectByName("ground").visible = bool;
    }
    fixAxis() {
        this.scene.remove(this.scene.getObjectByName("ground"));
        var ob = this.scene.getObjectByName("obj");        
        //ob.rotation.z = 90 * Math.PI/180;
        ob.rotation.x = -90 * Math.PI / 180;      
        this.bbox.update();

        this.createGround(this.bbox);
        this.zoomCamera(this.bbox);        
    }
    resetObject(){
        ob = this.scene.getObjectByName("obj");
        ob.rotation = this.originalRotation;
    }
    saveFileToServer() {

        var t = this.scene.clone();
        t.remove(t.getObjectByName("obj"));

        var storage = JSON.stringify(t.toJSON());
        var camstorage = JSON.stringify(camera.toJSON());
        var filename = jQuery("#filename").val();

        jQuery.ajax({
            type: 'POST',
            url: "/wordpress/wp-content/plugins/cad-model-viewer/writeFile.php",
            data: {
                "filename": filename,
                "scene": storage,
                "cam": camstorage
            },
            success: function(msg) {
                //alert(msg);
                this.shortcode["file"] = filename;
                this.createShortcode();

            },
            complete: function() {

            },
            error: function() {

            }
        });

    }
    checkFilename(name) {

        jQuery.ajax({
            type: 'POST',
            url: "/wordpress/wp-content/plugins/cad-model-viewer/checkFilename.php",
            data: {
                "filename": name
            },
            success: function(msg) {

                if (msg == "true") {
                    alert("filename already taken, please insert a new");
                    jQuery('#filename').val("");
                } else {
                    this.saveFileToServer();
                }

            },
            complete: function(msg) {

            },
            error: function(msg) {}
        });

    }
}