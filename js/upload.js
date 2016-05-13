// comments

var media_uploader = null;
var data_handle;

jQuery(function() {
    
    data_handle = jQuery('#dataHandle');
    jQuery('.upp').click( function(){
         open_media_uploader();
         console.log(data_handle);
    });
});



function open_media_uploader()
{
    
    media_uploader = wp.media({
        titel: "Select or upload a file",
        button: {
          text: 'Load this file'
        }, 
        multiple: false
    });
    //console.log(media_uploader.on());
    /*media_uploader.on("insert", function(){
        var json = media_uploader.state().get("selection").first().toJSON();
        
        
        
    });*/
    media_uploader.on( 'select', function() {
      
      // Get media attachment details from the frame state
      var attachment = media_uploader.state().get('selection').first().toJSON();
      //console.log(attachment);
      

      data_handle.val(JSON.stringify(attachment));  
      var temp = JSON.parse(JSON.stringify(attachment));
      if(!temp["url"].match(/fbx$/)){
        alert("Please choose a .fbx file");
        media_uploader.open();
        return;
      }
      
      data_handle.change(); //fire change function


      
    });

    media_uploader.open();
}