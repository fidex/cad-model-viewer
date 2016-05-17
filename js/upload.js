// comments
var data_handle;

jQuery(function() {
  
    var media_uploader = wp.media({
        title: "Select or upload a file",
        button: {
          text: 'Load this file'
        }, 
        multiple: false
    });

    media_uploader.on( 'select', function() {
            // Get media attachment details from the frame state
      var attachment = media_uploader.state().get('selection').first().toJSON();

      if(!attachment["url"].match(/.fbx$/)){        
        media_uploader.open();
        alert("Please choose a .fbx file");
        return;
      }else{        
        data_handle.val(JSON.stringify(attachment));  
        data_handle.change(); //fire change function
      }

    });
    
    data_handle = jQuery('#dataHandle');
    jQuery('#fileHandler').click( function(){
         media_uploader.open();
         //console.log(data_handle);
    });
});
