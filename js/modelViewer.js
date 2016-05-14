jQuery(function() {

	stats = new Stats();

	mv = new ModelViewer();

	
	var container = jQuery( '#stats' );
	console.log(stats.dom);
	stats.dom.style.top = "150px";
	stats.dom.style.left = "150px";
	container.append( stats.dom );
	

    jQuery('#dataHandle').change(function(){
    	var temp = JSON.parse(jQuery(this).val());
    	if(temp["url"].match(/fbx$/)){
    		mv.shortcode["file"] = temp["url"];
    		console.log(shortcode["file"]);
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
   
    var i = 0;
    
    jQuery('#shortcode').change(function(){
    	mv.readShortcode();
    });

    jQuery('.parameter').change(function(){
    	if(jQuery(this).attr("type")=="checkbox"){
    		mv.shortcode[jQuery(this).attr("id")] = +jQuery(this).is(':checked');
    	}else{
    		mv.shortcode[jQuery(this).attr("id")] = jQuery(this).val();
    	}
    	
    	console.log(shortcode);
    	//createShortcode();
    });

    jQuery('.canvas').each(function(){
    	//console.log(i+": ");i++;  
    	//console.log(jQuery(this).attr('rotation'));
    	try{
    		mv.createViewer();
    		mv.animate();
    	}
    	catch(err){
    		console.log(err.stack);
    	}
    });
    jQuery('#c_reload').click(function(){
    	try{
		mv.createViewer();
		//mv.animate();
		}
		catch(err){
			console.log(err);
		}
	});
    jQuery('#c_save').click(function(){
    	//createViewer();
    	mv.filename = jQuery("#filename").val()
    	if(filename){
    		checkFilename(filename);
    	}else{
    		alert("please insert a filename");
    		jQuery("#filename").css("background-color","rgba(255,0,0,0.5)");
    	}

    });
    jQuery('.filename').click(function(){
    	jQuery(this).addClass("active");
    	mv.shortcode["file"]= jQuery(this).text() // 0 = path
    	console.log(jQuery(this).text());
		//createShortcode();
    	mc.createViewer();
    	
    });
    jQuery('#colorPicker').change(function(){
    	//console.log(jQuery(this).val());
    	mv.shortcode["bg_color"] = jQuery(this).val();
    });
    jQuery('#ground_color').change(function(){
    	mv.changeGroundColor(new THREE.Color(jQuery(this).val()));
    	
    });
    jQuery('#fix_axis').change(function(){
    	mv.fixAxis();    	
    });
    jQuery('#cam_rotation_speed').change(function(){
    	  mv.cameraRotation(jQuery(this).val());
    });    
   // createShortcode();

});
