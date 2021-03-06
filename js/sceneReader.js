jQuery(function() {

    jQuery('.model-viewer-canvas').each(function() {
        try {
            sceneReader(jQuery(this));
        } catch (err) {
            console.log(err);
        }
    });

});

function sceneReader(c) {


    var basePath = baseUrl.url + "/files/scenes/"; //injected from wp
    var container, camera, scene, renderer, mesh, controls;
    //console.log(c.children("script").text());
    var sc = jQuery.parseJSON(c.children("script").text());

    var CANVAS_WIDTH = sc["width"];
    var CANVAS_HEIGHT = sc["height"];

    container = c;
    //console.log("rotation: "+container.attr('rotation'))

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
    renderer.setClearColor(sc["bg_color"]);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //console.log(renderer);

    container.append(renderer.domElement);

    var loader = new THREE.ObjectLoader();

    loader.load(basePath + sc["file"] + ".scene", function(e) {


        scene = e;

        var loader = new THREE.FBXLoader();
        loader.load(sc["fbx_file"], function(object) {

            var ob = new THREE.Object3D();
            ob.name = "obj";
            object.traverse(function(child) {

                if (child instanceof THREE.Mesh) {

                    //child.material.map = texture;
                    if (sc["material"] == "lambert") {
                        var objectx = new THREE.Mesh(child.geometry, new THREE.MeshLambertMaterial({
                            color: sc["material_color"]
                        }));
                    } else if (sc["material"] == "phong") {
                        var objectx = new THREE.Mesh(child.geometry, new THREE.MeshPhongMaterial({
                            color: sc["material_color"]
                        }));
                    }
                    objectx.castShadow = true;
                    objectx.receiveShadow = true;
                    ob.add(objectx);

                }

            });

            scene.add(ob);
            console.log(scene);




        });

    });


    loader.load(basePath + sc["file"] + ".cam", function(e) {

        //console.log(e);
        camera = e;

        // if widht and height get changed manually fix the aspect
        camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
        camera.updateProjectionMatrix();

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.15;
        controls.rotateSpeed = 0.15;
        controls.enableZoom = false;
        controls.autoRotate = true;
        controls.enableKeys = false;
        controls.autoRotateSpeed = sc["cam_rotation_speed"] / 100;
        //console.log(controls);

    });


    function render() {

        try {
            controls.update();

            scene.getObjectByName("obj").rotation.x += sc["rot_speed_x"] / 2000;
            scene.getObjectByName("obj").rotation.y += sc["rot_speed_y"] / 2000;
            scene.getObjectByName("obj").rotation.z += sc["rot_speed_z"] / 2000;
            scene.getObjectByName("ground").rotation.x += sc["rot_speed_x"] / 2000;
            scene.getObjectByName("ground").rotation.y += sc["rot_speed_y"] / 2000;
            scene.getObjectByName("ground").rotation.z += sc["rot_speed_z"] / 2000;


        } catch (err) {
            //console.log(err);
        }

        renderer.render(scene, camera);

    }

    (function animate() {
        requestAnimationFrame(animate);
        //stats.begin();
        render();
        //stats.end();
    })();

}