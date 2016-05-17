<script>
</script>
<div id="stats"></div>
<div class="row">
    <div class="col-md-5">
        <div class="row">
            <h1>Shortcode Generator</h1>
            <div class="col-md-6">
                
                <input type="text" id="shortcode" value=""></input>
            </div>
            <div class="col-md-6">
                <input type="hidden" name="dataHandle" id="dataHandle" value=""/> 
                Filename:<input type="text" required name="filename" id="filename" value=""/> 
                <button id="c_save">Save</button>
            </div>
        </div>
        <hr>
        <div class="row">
            <h2> Basic Settings</h2><button id="c_reload">Reload</button>
            <h5>(Changes need a Reload) </h5>
            <div class="col-md-6">
                Canvas Width:&nbsp;    <input type="number" required name="width" class="parameter"  id="c_width"  value="400"/><br> 
                Canvas Height:         <input type="number" required name="height"class="parameter"  id="c_height" value="400"/><br>
            </div>
            <div class="col-md-6">
                Background Color:<input type="color" name="bg_color" value="#ffffff" class="parameter"/>   
            </div>
              
            
        </div>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <h2>Light</h2>
                Color:&nbsp;<input type="color" id="light_color" name="light_color" value="#ffffff" class="initParameter"/>
                <input type="range" size="" name="light_intensity" id="light_intensity" min="0" max="200" value="100" class="">
            </div>
            <div class="col-md-6">
                <h2>Ambient Light</h2>
                Color:&nbsp;<input type="color" name="ambient_light_color" id="ambient_light_color" value="#ffffff" class="initParameter"/>
                <input type="range" size="" name="ambient_light_intensity" id="ambient_light_intensity" min="0" max="200" value="100" class="">
            </div>
        </div>
        <hr>
            
   
    <h1>Animations</h1>
    <h2>Objekt Rotation</h2><button id="reset_rotation">Reset</button><br>
    
    Rotation Speed X<input type="range" size="" name="rot_speed_x" id="rot_speed_x" min="0" max="200" value="0" class="parameter">
    Rotation Speed Y<input type="range" size="" name="rot_speed_y" id="rot_speed_y" min="0" max="200" value="0" class="parameter">
    Rotation Speed Z<input type="range" size="" name="rot_speed_z" id="rot_speed_z" min="0" max="200" value="0" class="parameter">

    <hr>
    <h2>Camera Rotation</h2>
    Rotation Speed<input type="range" size="" name="cam_rotation_speed" id="cam_rotation_speed" min="0" max="200" value="0" class="parameter">

    <hr>
    <div class="row">
        <h2>Advanced Settings</h2>
            <div class="col-md-6">
                
                <!--input type="checkbox" name="fog" id="fog" value="fog" class="parameter">Fog<br-->
                <!--input type="checkbox" name="fix_axis" id="fix_axis" value="fix_axis" class="parameter">Fix Axis<br-->
                <input type="checkbox" name="ground" id="ground" value="ground" checked>Ground
                <input type="color" name="ground_color" id="ground_color" value="#ffffff" class="initParameter"/>
            </div>
            <div class="col-md-6">
                Material<br>
                <input type="radio" name="material" value="phong" checked class="parameter"> Phong<br>
                <input type="radio" name="material" value="lambert" class="parameter">  Lambert<br> 
                Material Color<input type="color" name="material_color" id="material_color" value="#ffffff" class="parameter"/>
                <br>(need reload!)
            </div>
        </div>
    

    <hr>
    </div>
    <div class="col-md-6">
        <div id="fileHandler"></div>
        <div class="canvas">            
        </div>
    </div>
    <style>        
    </style>    
    
</div>