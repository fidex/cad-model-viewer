class ModelViewer {

    constructor() {
        //this.initializeShortCode(); 
        //this.createShortcode();
        this.ini();
    }
    ini() {
        this.init = {
            "light_color":"#ffffff",
            "light_intensity":"1",
            "ambient_light_color":"#404040",
            "ambient_light_intensity":"0.5",
            "ground_color":"#ffffff",
            

        }
    }
    initializeShortCode() {

        this.shortcode = {
                "file": "",
                "fbx_file":"/wordpress/wp-content/plugins/cad-model-viewer/files/R2D2_Standing.fbx",
                "width": "400",
                "height": "400",
                "bg_color": "#ffffff",                
                "cam_rotation_speed": "0",
                "rot_speed_x": "0",
                "rot_speed_y": "0",
                "rot_speed_z": "0",
                "material": "phong",
                "material_color":"#ffffff",

            }
            //console.log("test this");
        jQuery.each(shortcode, function(key, value) {
            //console.log(key+" : "+value);
        });

    }   
    

    createViewer() {

        console.log(this.shortcode);

        this.container = jQuery('.canvas');
        if (this.container.has('canvas')) {
            this.container.empty();
        }

        this.filepath = this.shortcode["fbx_file"]; // = '/wordpress/wp-content/uploads/';I:\Bacherlorarbeit\xampp\apps\wordpress\htdocs\wp-content\plugins\cad-model-viewer
      
        //CANVAS_WIDTH = jQuery("#c_width").val();
        //CANVAS_HEIGHT = jQuery("#c_height").val();

        this.CANVAS_WIDTH = this.shortcode["width"];
        this.CANVAS_HEIGHT = this.shortcode["height"];

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        this.renderer.setClearColor(this.shortcode["bg_color"], 1);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        console.log(this.renderer);

        this.container.append(this.renderer.domElement);

        this.scene = new THREE.Scene();

        var ambiLight = new THREE.AmbientLight(this.init["ambient_light_color"],this.init["ambient_light_intensity"]/100);
        ambiLight.name = "AmbientLight";
        this.scene.add(ambiLight);

        this.camera = new THREE.PerspectiveCamera(50, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 1, 100000);
        this.camera.up = new THREE.Vector3(0, 1, 0);

        var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.15;
        controls.rotateSpeed = 0.15;
        //controls.enableZoom = false; 
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0;
        console.log(controls);
        this.controls = controls;

        var loader = new THREE.FBXLoader();
       
        loader.load(this.filepath, function(object) {

            var ob = new THREE.Object3D();

            object.traverse(function(child) {

                if (child instanceof THREE.Mesh) {


                    if (this.shortcode["material"] == "lambert") {
                        var objectx = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({
                            color: this.shortcode["material_color"]
                        }));
                    } else if (this.shortcode["material"] == "phong") {
                        var objectx = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
                            color: this.shortcode["material_color"]
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
            this.originalRotation = ob.rotation.clone();
            this.bbox.update();

            this.zoomCamera(this.bbox);
            this.createGround(this.bbox);
            this.createDirectionalLight(this.bbox);
            //console.log(scene);
            this.bbox.name = "bbox";
            ///bbox.visible = false;
            this.scene.add(this.bbox);
            console.log(this.scene);


        }.bind(this));


        

        
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
        var c = new THREE.Color(this.init["ground_color"]);
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
        this.originalRotationGround = mesh.rotation.clone();
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
    resetObjectRotation(){
        var ob = this.scene.getObjectByName("obj");
        ob.rotation.x = this.originalRotation.clone().x;
        ob.rotation.y = this.originalRotation.clone().y;
        ob.rotation.z = this.originalRotation.clone().z;

        var g = this.scene.getObjectByName("ground");
        g.rotation.x = this.originalRotationGround.clone().x;
        g.rotation.y = this.originalRotationGround.clone().y;
        g.rotation.z = this.originalRotationGround.clone().z;
    }
    createDirectionalLight(bbox){
        console.log(this.init);
        var light = new THREE.DirectionalLight(this.init["light_color"], this.init["light_intensity"]);
        light.position.set(Math.abs(bbox.box.min.x - bbox.box.max.x), bbox.box.max.y *1.5,Math.abs(bbox.box.min.z - bbox.box.max.z));
        light.castShadow = true;

        var d = Math.abs(bbox.box.min.y - bbox.box.max.y); // make this scale with obj size;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        light.name = "DirectionalLight";
        //light.shadow.camera.far = 10000;
        this.scene.add(light);

    }
    setAmbientLightIntensity(intensity){
         this.scene.getObjectByName("AmbientLight").intensity =  intensity;
    }
    setAmbientLightColor(color){
        this.scene.getObjectByName("AmbientLight").color = new THREE.Color(color);
    }
    setLightColor(color){
        this.scene.getObjectByName("DirectionalLight").color = new THREE.Color(color);
    }
    setLightIntensity(intensity){
        console.log(intensity);
        this.scene.getObjectByName("DirectionalLight").intensity =  intensity;
    }
}