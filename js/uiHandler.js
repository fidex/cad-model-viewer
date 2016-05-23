jQuery(function() {

    mv = new ModelViewer(jQuery(".canvas")); //create model viewer and pass dom element

    createViewer(); //create the viewer with dafault values


    jQuery('#ftpList').toggle(); //hide ftp list

    //Event Handler for the selection of new files
    jQuery('#dataHandle').change(function() {
        var temp = JSON.parse(jQuery(this).val());
        if (temp["url"].match(/fbx$/)) {
            mv.init["fbx_file"] = temp["url"];
            try {
                createViewer();
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Unsuported file format");
        }
    });
    //Event Handler for parameter change
    jQuery('.parameter').change(function() {
        if (jQuery(this).attr("type") == "checkbox") {
            mv.init[jQuery(this).attr("name")] = +jQuery(this).is(':checked');
        } else if (jQuery(this).attr("type") == "radio") {
            if (jQuery(this).is(':checked')) {
                mv.init[jQuery(this).attr("name")] = jQuery(this).val();
            }
        } else {
            //console.log(jQuery(this).val());
            mv.init[jQuery(this).attr("name")] = jQuery(this).val();
        }

        console.log(mv.init);

    });
    //reload button
    jQuery('#c_reload').click(function() {
        try {
            createViewer()
        } catch (err) {
            console.log(err);
        }
    });
    //save button calls checkFilename -> saveFileToServer -> createShortcode
    jQuery('#c_save').click(function() {

        mv.filename = jQuery("#filename").val();
        if (mv.filename) {
            checkFilename(jQuery("#filename").val());
        } else {
            alert("Please insert a filename");
            jQuery("#filename").css("background-color", "rgba(255,0,0,0.5)");
        }

    });
    //reset rotation button
    jQuery('#reset_rotation').click(function() {
        mv.resetObjectRotation();
        jQuery('#rot_speed_x').val(0);
        jQuery('#rot_speed_y').val(0);
        jQuery('#rot_speed_z').val(0);
        jQuery('#rot_speed_x').change();
        jQuery('#rot_speed_y').change();
        jQuery('#rot_speed_z').change();

    });
    // ftp file list load function
    jQuery('.filename').click(function() {
        //console.log(ajaxUrl.url.split("plugins/")[0]+"uploads/");

        mv.init["fbx_file"] = ajaxUrl.url.split("plugins/")[0] + "uploads/" + jQuery(this).text() // fix path       
        createViewer();

    });
    //bgcolor change function
    jQuery('#colorPicker').change(function() {
        mv.init["bg_color"] = jQuery(this).val();
    });
    //ground color change function
    jQuery('#ground_color').change(function() {
        mv.changeGroundColor(new THREE.Color(jQuery(this).val()));
    });
    //ground select box change function
    jQuery('#ground').change(function() {
        mv.changeGroundVisibility(jQuery(this).is(':checked'));
    });
    /*jQuery('#fix_axis').change(function(){
        mv.fixAxis();       
    });*/
    //cam rotation change function
    jQuery('#cam_rotation_speed').change(function() {
        mv.cameraRotation(jQuery(this).val());
    });
    //light color change function
    jQuery('#light_color').change(function() {
        mv.setLightColor(jQuery(this).val());
    });
    //ambient light color change function 
    jQuery('#ambient_light_color').change(function() {
        mv.setAmbientLightColor(jQuery(this).val());
    });
    //light intensity change function 
    jQuery('#light_intensity').change(function() {
        mv.setLightIntensity(jQuery(this).val() / 100);
    });
    //ambient light intensity change function 
    jQuery('#ambient_light_intensity').change(function() {
        mv.setAmbientLightIntensity(jQuery(this).val() / 200);
    });
    //toggle funtion for the ftp file list
    jQuery('#toggleList').click(function() {
        jQuery('#ftpList').toggle();
    });

});
/*
    reads init params and creates the modelViewer
*/
function createViewer() {
    jQuery('.initParameter').each(function() {
        if (jQuery(this).attr("type") == "radio") {
            if (jQuery(this).is(':checked')) {
                mv.init[jQuery(this).attr("name")] = jQuery(this).val();
            }
        } else {
            mv.init[jQuery(this).attr("name")] = jQuery(this).val();
        }
        console.log(mv.init);

    });

    try {
        mv.createViewer();
        mv.animate();
    } catch (err) {
        console.log(err.stack);
    }


}
/*
    send the scene and the camera to the server to be saved for later use
*/
function saveFileToServer() {

    var t = mv.scene.clone();
    t.remove(t.getObjectByName("obj"));
    var filename = jQuery("#filename").val();
    jQuery.ajax({
        type: 'POST',
        url: ajaxUrl.url + "php/writeFile.php",
        data: {
            "filename": filename,
            "scene": JSON.stringify(t.toJSON()),
            "cam": JSON.stringify(mv.camera.toJSON()),
        },
        success: function(msg) {
            mv.init["file"] = filename;
            createShortcode();
        }
    });

}
/*
    checks if the filename is available 
*/
function checkFilename(name) {
    if (name == "") {
        return alert("Please insert a filename");
    }

    jQuery.ajax({
        type: 'POST',
        url: ajaxUrl.url + "php/checkFilename.php",
        data: {
            "filename": name
        },
        success: function(msg) {

            if (msg == "true") {
                alert("filename already taken, please insert a new");
                jQuery('#filename').val("");
            } else {
                saveFileToServer();
            }

        },
        complete: function(msg) {

        },
        error: function(msg) {
            console.log(msg);
        }
    });

}
/*
    creates the shortcode
*/
function createShortcode() {

    var sc = "[cad_modelviewer ";
    console.log(mv.getShortcode());
    jQuery.each(mv.getShortcode(), function(key, value) {
        sc += ' ' + key + '="' + value + '"';
    });
    sc += "]";
    console.log(sc);
    jQuery("#shortcode").val(sc);

}