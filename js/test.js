var time = performance.now();
var count = 5;
var domObject = '<div class="model-viewer-canvas"><script type="json">{"file":"test","fbx_file":"\/wordpress\/wp-content\/plugins\/cad-model-viewer\/files\/R2D2_Standing.fbx","width":"400","height":"400","bg_color":"#ffffff","cam_rotation_speed":"100","rot_speed_x":"0","rot_speed_y":"0","rot_speed_z":"0","material":"phong","material_color":"#ffffff"}</script></div>';
var stats;
var result = [];
var testContainer;
var container;
var testfile = "R2D2_Standing";
var name = "R2D2 nexus4 Chrome";
var rotation = "1";
var timeover = false;
var res = {};
jQuery(function() {

    stats = new Stats();
    //stats.dom.style.top = "150px";
    //stats.dom.style.left = "150px";
    //container.append( stats.dom ); 

    container = jQuery('.model-viewer-test-canvas');
    testContainer = jQuery('.test-container');
    container.append('<button name="test" value="test" id="testButton">Test</button>');


    jQuery('#testButton').click(function() {
        console.log("test starting, lags expected");
        test();
    });


    // add dom elements


});
jQuery(window).load(function() {
    var everythingLoad = performance.now() - time;
    console.log("Time until everything loaded: ", everythingLoad);
});

function test() {
    testXObjects(count);
}

function testXObjects(x) {

    res = {};
    res["name"] = name;
    res["file"] = testfile;
    res["rotation"] = rotation;
    res["count"] = x;
    testContainer.empty();

    for (i = 0; i < x; i++) {
        testContainer.append(domObject);
    }


    // start creating 
    time = performance.now();
    window.setTimeout(saveHighestFPS, 60000);
    jQuery('.model-viewer-canvas').each(function() {
        try {
            sceneReader(jQuery(this));
        } catch (err) {
            console.log(err);
        }
    });



    // controll performance
    (function animat() {

        if (timeover == false) {
            stats.begin()
            if (parseInt(stats.getFPS(), 10) < 60) {
                //console.log(parseInt(stats.getFPS(),10));
                requestAnimationFrame(animat);
                stats.end();
            } else {
                //console.log("läuft"+parseInt(stats.getFPS(),10));
                timeover = true;
                res["time"] = (performance.now() - time) / 1000;
                console.log("reaching 60 fps after: " + (performance.now() - time) / 1000);
                console.log(res);
                result.push(res);
                window.setTimeout(saveToServer(JSON.stringify(res)), 10000);
            }
        }
    })();

}

function saveHighestFPS() {
    if (!timeover) {
        console.log("over");
        timeover = true;
        res["fps"] = parseInt(stats.getFPS(), 10);
        saveToServer(JSON.stringify(res));
    }

}

function saveToServer(data) {

    jQuery.ajax({
        type: 'POST',
        url: baseUrl.url + "php/writeTestFile.php",
        data: {
            "data": data,
        },
        success: function(msg) {
            console.log("data saved to server");
        },
        error: function() {
            console.log("data save failed");
        }
    });

}