<script>
var rendstorage;
var storage; 
var camstorage;
</script>
<div>
	<h1>Shortcode</h1>
	<input type="text" id="shortcode" value=""></input>
	<?php

	?>
	<div class="upp" style="background-color:red;width:30px;height:30px;"></div>

    Width:    <input type="number" required name="width" class="parameter"	id="c_width"  value="400"/> 
    Height:   <input type="number" required name="height"class="parameter"	id="c_height" value="400"/> 	
    <button id="c_reload">Reload</button>
    <button id="c_save">Save</button>
    <hr>
    <!--div>
        <h2>Position</h2>
        X<input type="number" value="0" id="ini_pos_x" class="parameter"/>
        Y<input type="number" value="0" id="ini_pos_y" class="parameter"/>
        Z<input type="number" value="0" id="ini_pos_z" class="parameter"/>
    </div>
    <div>
        <h2>Rotation</h2>
        X<input type="range" width="50"size="" name="ini_rot_x" id="ini_rot_x" min="1" max="600" value="0" class="parameter">
        Y<input type="range" size="" name="ini_rot_y" id="ini_rot_y" min="1" max="100" value="0" class="parameter">
        Z<input type="range" size="" name="ini_rot_z" id="ini_rot_z" min="1" max="100" value="0" class="parameter">
        </div-->
    <h2>Hintergrundfarbe</h2>
    <input type="color" id="bg_color" value="#ffffff" class="parameter"/>
    <h1>Animationen</h1>
    <h2>Objekt Rotation</h2>
    

    <hr>
    <h2>Settings</h2>
    <input type="checkbox" name="fog" id="fog" value="fog" class="parameter">Fog<br>
    <input type="checkbox" name="ground" id="ground" value="ground" class="parameter">Ground<br>

    <hr>
    <div class="canvas"></div>
    <div id="lightTest"></div>

</div>