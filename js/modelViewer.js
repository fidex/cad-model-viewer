class ModelViewer {

    /*
        ModelViewer contructor.
        requires a dom element to which the the animation will appended 
    */
    constructor(domElement) {
            this.domElement = domElement;
            this.ini();
            this.initializeShortCode();
        }
        /*
            initializes variables used in this class. init[] should be used to pass data to objects of the class
        */
    ini() {
            this.init = {
                "file": "test",
                "fbx_file": "/wordpress/wp-content/plugins/cad-model-viewer/files/R2D2_Standing.fbx",
                "width": "400",
                "height": "400",
                "bg_color": "#ffffff",
                "cam_rotation_speed": "0",
                "rot_speed_x": "0",
                "rot_speed_y": "0",
                "rot_speed_z": "0",
                "material": "phong",
                "material_color": "#ffffff",
                "light_color": "#ffffff",
                "light_intensity": "1",
                "ambient_light_color": "#404040",
                "ambient_light_intensity": "0",
                "ground_color": "#ffffff",
            }
            console.log(this.init);
        }
        /*
            defines the parameters of the shortcode
        */
    initializeShortCode() {

            this.shortcode = {
                "file": " ",
                "fbx_file": " ",
                "width": " ",
                "height": " ",
                "bg_color": " ",
                "cam_rotation_speed": " ",
                "rot_speed_x": " ",
                "rot_speed_y": " ",
                "rot_speed_z": " ",
                "material": " ",
                "material_color": " ",

            }
            console.log(this.shortcode);
        }
        /*
            returns the shortcode after initializing it
        */
    getShortcode() {
            console.log(this.init["file"]);
            console.log(this.shortcode);
            jQuery.each(this.shortcode, function(key, value) {
                console.log(key);
                this.shortcode[key] = this.init[key];
            }.bind(this));
            return this.shortcode;

        }
        /*
            Main function:
            Setting up the renderer, camera and scene with the object, ligts and ground.
        */
    createViewer() {

            console.log(this.init);

            this.container = this.domElement;
            if (this.container.has('canvas')) { //allows only one renderer inside the container
                this.container.empty();
            }

            // variables for later use
            this.filepath = this.init["fbx_file"];
            this.CANVAS_WIDTH = this.init["width"];
            this.CANVAS_HEIGHT = this.init["height"];

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
            this.renderer.setClearColor(this.init["bg_color"], 1);

            //enabling shadows
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            this.container.append(this.renderer.domElement); //append the renderer the  the dom

            //creating the scene
            this.scene = new THREE.Scene();

            //adding ambient light to the scene
            var ambiLight = new THREE.AmbientLight(this.init["ambient_light_color"], this.init["ambient_light_intensity"]);
            ambiLight.name = "AmbientLight";
            this.scene.add(ambiLight);

            //creating the camera
            this.camera = new THREE.PerspectiveCamera(50, this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 1, 10000);
            this.camera.up = new THREE.Vector3(0, 1, 0);

            //creating orbit controls 
            var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.15;
            controls.rotateSpeed = 0.15;
            //controls.enableZoom = false; 
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0;
            console.log(controls);
            this.controls = controls;


            //creating a FBXLoader and loading the given file
            var loader = new THREE.FBXLoader();

            loader.load(this.filepath, function(object) {

                /*new object
                //this is used as a container for the mesh-objects created below.
                //this object then contains a the object loaded from the file.
                //the copy uses some simple materials opposed to the original. 
                // -> see, three.js THREE.FBXLoader() material support
                */
                console.log(console);
                var ob = new THREE.Object3D();

                //creating a copy of each child with a new material
                //also enabling shadows for the new objects
                object.traverse(function(child) {

                    if (child instanceof THREE.Mesh) {

                        if (this.init["material"] == "lambert") {
                            var m = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({
                                color: this.init["material_color"]
                            }));
                        } else if (this.init["material"] == "phong") {
                            var m = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
                                color: this.init["material_color"]
                            }));
                        }
                        m.castShadow = true;
                        m.receiveShadow = true;
                        ob.add(m);

                    }

                }.bind(this));

                this.originalRotation = ob.rotation.clone(); //saving the rotation for later use
                // give the object a name so that it can be refered to when accessing the scene
                ob.name = "obj";
                this.scene.add(ob);

                //create a bounding box for the obejct
                this.bbox = new THREE.BoundingBoxHelper(ob, 0xfff000);
                this.bbox.visible = false;
                this.bbox.update();

                this.zoomCamera(this.bbox); //fitting the camera
                this.createGround(this.bbox); //creating a fitting ground for the object
                this.createLight(this.bbox); //creating a fitting light for the object

                this.bbox.name = "bbox"; // give the bounding box a name so that it can be refered to when accessing the scene          
                this.scene.add(this.bbox);

            }.bind(this));

        }
        /*
            main rendering loop
        */
    render() {

            this.controls.update();

            try {

                this.scene.getObjectByName("obj").rotation.x += this.init["rot_speed_x"] / 2000;
                this.scene.getObjectByName("obj").rotation.y += this.init["rot_speed_y"] / 2000;
                this.scene.getObjectByName("obj").rotation.z += this.init["rot_speed_z"] / 2000;
                this.scene.getObjectByName("ground").rotation.x += this.init["rot_speed_x"] / 2000;
                this.scene.getObjectByName("ground").rotation.y += this.init["rot_speed_y"] / 2000;
                this.scene.getObjectByName("ground").rotation.z += this.init["rot_speed_z"] / 2000;


            } catch (err) {
                console.log(err);
            }

            this.renderer.render(this.scene, this.camera);


        }
        /*
            calls the render function on requestAnimationFrame
        */
    animate() {

            try {
                this.render();

                /*
                var that = this; // use this, if .bind causes lag
                requestAnimationFrame( function() { that.animate; } );
           */
                requestAnimationFrame(this.animate.bind(this));

            } catch (err) {
                console.log(err.stack)
            }




        }
        /*
            Positions the camera to fit the object using its bounding box
        */
    zoomCamera(bbox) {
            //http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
            //http://stackoverflow.com/questions/2866350/move-camera-to-fit-3d-scene
            console.log(this.camera);
            var fov = this.camera.fov * (Math.PI / 180); //degrees to radian
            var height = Math.abs(bbox.box.min.y - bbox.box.max.y);
            var width = Math.abs(bbox.box.min.x - bbox.box.max.x);

            this.camera.position.y = height / 2;
            if (bbox.box.min.y > 0) { //basic fix
                this.scene.position.y = -height / 2;
            }

            this.camera.position.z = Math.abs(((Math.max(width, height) * 0.5) * 1.5) / Math.tan(fov / 2));

        }
        /*
        Adds a platform to the scene using the objects bounding box. The platform is flat cylinder with a radius slightly lager than
        the objects radius. the platform is then positioned so that the object is in its middle
        */
    createGround(bbox) {

            var widthx = Math.abs(bbox.box.min.x - bbox.box.max.x);
            var widthz = Math.abs(bbox.box.min.z - bbox.box.max.z);
            var c = new THREE.Color(this.init["ground_color"]);
            var groundMaterial = new THREE.MeshPhongMaterial();
            //var mesh = new THREE.Mesh( new THREE.BoxGeometry( widthx *1.2 , widthz *1.2 , 0.1 ), groundMaterial );
            var mesh = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(widthx, widthz), Math.max(widthx, widthz), 0.1, 32), groundMaterial);

            //mesh.position.x = bbox.box.min.x + widthx / 2;
            //mesh.position.z = bbox.box.min.z + widthz / 2;

            mesh.material.color = c;
            mesh.name = "ground";
            mesh.position.y = bbox.box.min.y;
            mesh.receiveShadow = true;
            this.originalRotationGround = mesh.rotation.clone();
            this.scene.add(mesh);

        }
        /*
            alters the cameras auto rotation speed
            input: Numbers
        */
    cameraRotation(speed) {
            this.init["cam_rotation_speed"] = speed / 100
            this.controls.autoRotateSpeed = speed / 100;
        }
        /*
            alters the color of the ground
            input: THREE.Color
        */
    changeGroundColor(c) {
            this.scene.getObjectByName("ground").material.color = c;
        }
        /*
            alters the visibility of the ground
            input: boolean 
        */
    changeGroundVisibility(bool) {
            this.scene.getObjectByName("ground").visible = bool;
        }
        /*
            fixes the rotation of certain objects that get messed up during the transformation between fbx formats
            deprecated
        */
    fixAxis() {
            this.scene.remove(this.scene.getObjectByName("ground"));
            var ob = this.scene.getObjectByName("obj");
            //ob.rotation.z = 90 * Math.PI/180;
            ob.rotation.x = -90 * Math.PI / 180;
            this.bbox.update();

            this.createGround(this.bbox);
            this.zoomCamera(this.bbox);
        }
        /*
            resets the obejcts and the grounds roation
        */
    resetObjectRotation() {
            var ob = this.scene.getObjectByName("obj");
            ob.rotation.x = this.originalRotation.clone().x;
            ob.rotation.y = this.originalRotation.clone().y;
            ob.rotation.z = this.originalRotation.clone().z;

            var g = this.scene.getObjectByName("ground");
            g.rotation.x = this.originalRotationGround.clone().x;
            g.rotation.y = this.originalRotationGround.clone().y;
            g.rotation.z = this.originalRotationGround.clone().z;
        }
        /*
            Adds a directional Light to the scene based on the objects bounding box.
            The light is positioned in the upper right corner in front of the object
        */
    createLight(bbox) {
        console.log(this.init);
        var dlight = new THREE.DirectionalLight(this.init["light_color"], 0.2);
        dlight.position.set(-Math.abs(bbox.box.min.x - bbox.box.max.x), 0, -Math.abs(bbox.box.min.z - bbox.box.max.z));
        var light = new THREE.PointLight(this.init["light_color"], this.init["light_intensity"]);
        light.position.set(Math.abs(bbox.box.min.x - bbox.box.max.x), bbox.box.max.y * 1.5, Math.abs(bbox.box.min.z - bbox.box.max.z));

        light.castShadow = true;
        light.name = "DirectionalLight"

        //var d = Math.abs(bbox.box.min.y - bbox.box.max.y); // make this scale with obj size;
        /*
        var w = Math.max(Math.abs(bbox.box.min.x - bbox.box.max.x),Math.abs(bbox.box.min.z - bbox.box.max.z));
        light.shadow.camera.left = -w;
        light.shadow.camera.right = w;
        light.shadow.camera.top = w;
        light.shadow.camera.bottom = -w;
        light.name = "DirectionalLight";
        */
        //light.shadow.camera.far = 10000;
        this.scene.add(dlight);
        this.scene.add(light);

    }
    setAmbientLightIntensity(intensity) {
        this.scene.getObjectByName("AmbientLight").intensity = intensity;
    }
    setAmbientLightColor(color) {
        this.scene.getObjectByName("AmbientLight").color = new THREE.Color(color);
    }
    setLightColor(color) {
        this.scene.getObjectByName("DirectionalLight").color = new THREE.Color(color);
    }
    setLightIntensity(intensity) {
        this.scene.getObjectByName("DirectionalLight").intensity = intensity;
    }
}