var timerStart = Date.now();
jQuery(function() {

    console.log(ajaxUrl.url);

	stats = new Stats();

	mv = new ModelViewer(jQuery(".canvas"));
    //mv.initializeShortCode();
    createViewer();    
	
	var container = jQuery( '#stats' );
	console.log(stats.dom);
	stats.dom.style.top = "150px";
	stats.dom.style.left = "150px";
	//container.append( stats.dom );	

    jQuery('#dataHandle').change(function(){
    	var temp = JSON.parse(jQuery(this).val());
    	if(temp["url"].match(/fbx$/)){
    		mv.init["fbx_file"] = temp["url"];
    		try{
			     mv.createViewer();
			}
			catch(err){
				console.log(err);
			}
    	}else{
    		alert("Unsuported file format");
    	}        
    });  

    jQuery('.parameter').change(function(){
    	if(jQuery(this).attr("type")=="checkbox"){
    		mv.init[jQuery(this).attr("name")] = +jQuery(this).is(':checked');
    	}else if(jQuery(this).attr("type")=="radio"){
            if(jQuery(this).is(':checked')){
                mv.init[jQuery(this).attr("name")] = jQuery(this).val();
            }
        }
        else{
            //console.log(jQuery(this).val());
    		mv.init[jQuery(this).attr("name")] = jQuery(this).val();
    	}
    	
    	console.log(mv.init);
    	
    });    
    jQuery('#c_reload').click(function(){
    	try{
		mv.createViewer();
		mv.animate();
		}
		catch(err){
			console.log(err);
		}
	});
    jQuery('#c_save').click(function(){
    	
    	mv.filename = jQuery("#filename").val();
    	if(mv.filename){
    		checkFilename(jQuery("#filename").val());
    	}else{
    		alert("Please insert a filename");
    		jQuery("#filename").css("background-color","rgba(255,0,0,0.5)");
    	}

    });
    jQuery('#reset_rotation').click(function(){
        mv.resetObjectRotation();
        jQuery('#rot_speed_x').val(0);
        jQuery('#rot_speed_y').val(0);
        jQuery('#rot_speed_z').val(0);
        jQuery('#rot_speed_x').change();
        jQuery('#rot_speed_y').change();
        jQuery('#rot_speed_z').change();

    });
    jQuery('.filename').click(function(){
    	jQuery(this).addClass("active");
    	mv.init["fbx_file"]= jQuery(this).text() // 0 = path
    	console.log(jQuery(this).text());
    	createViewer();
    	
    });
    jQuery('#colorPicker').change(function(){
    	mv.init["bg_color"] = jQuery(this).val();
    });
    jQuery('#ground_color').change(function(){
    	mv.changeGroundColor(new THREE.Color(jQuery(this).val()));    	
    });
    jQuery('#ground').change(function(){
        mv.changeGroundVisibility(jQuery(this).is(':checked'));       
    });
    /*jQuery('#fix_axis').change(function(){
    	mv.fixAxis();    	
    });*/
    jQuery('#cam_rotation_speed').change(function(){
    	  mv.cameraRotation(jQuery(this).val());
    });
    jQuery('#light_color').change(function(){
          mv.setLightColor(jQuery(this).val());
    }); 
    jQuery('#ambient_light_color').change(function(){
          mv.setAmbientLightColor(jQuery(this).val());
    }); 
    jQuery('#light_intensity').change(function(){
          mv.setLightIntensity(jQuery(this).val()/100);
    }); 
    jQuery('#ambient_light_intensity').change(function(){
          mv.setAmbientLightIntensity(jQuery(this).val()/200);
    }); 
   

});
function createViewer(){
    jQuery('.initParameter').each(function(){
        if(jQuery(this).attr("type")=="radio"){
            if(jQuery(this).is(':checked')){
                mv.init[jQuery(this).attr("name")] = jQuery(this).val();
            }
        }else{
            //console.log(jQuery(this).val());
            mv.init[jQuery(this).attr("name")] = jQuery(this).val();
        }
        
        console.log(mv.init);
        //createShortcode();
    });

    try{
            mv.createViewer();            
            mv.animate();
        }
        catch(err){
            console.log(err.stack);
        }


}
function saveFileToServer() {

        var t = mv.scene.clone();
        t.remove(t.getObjectByName("obj"));
        var filename = jQuery("#filename").val();
        jQuery.ajax({
            type: 'POST',
            url: ajaxUrl.url+"php/writeFile.php",
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
function checkFilename(name) {
        if(name ==""){
            return alert("Please insert a filename");
        }
       
        jQuery.ajax({
            type: 'POST',
            url: ajaxUrl.url+"php/checkFilename.php",
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
function createShortcode() {

        var sc = "[cad_modelviewer ";        
        console.log(mv.getShortcode());
        jQuery.each(mv.getShortcode(), function(key, value) {
            sc += ' ' + key + '="' + value + '"';
            //console.log(key+" : "+value);
        });
        sc += "]";
        console.log(sc);
        jQuery("#shortcode").val(sc);        

    }
