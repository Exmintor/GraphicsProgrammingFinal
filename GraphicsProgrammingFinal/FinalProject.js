//Vertex Shader
var VSHADER_SOURCE =
    'void main() {\n' +
    '}\n';

//Fragment Shader
var FSHADER_SOURCE =
    'void main() {\n' +
    '}\n';

//OBJ file
var OBJ_SOURCE = 
'# This file uses centimeters as units for non- parametric coordinates.\n' +
'mtllib RobertBox.mtl\n' +
'g default\n' +
'v - 3.269264 - 3.269264 3.269264\n' +
'v 3.269264 - 3.269264 3.269264\n' +
'v - 3.269264 3.269264 3.269264\n' +
'v 3.269264 3.269264 3.269264\n' +
'v - 3.269264 3.269264 - 3.269264\n' +
'v 3.269264 3.269264 - 3.269264\n' +
'v - 3.269264 - 3.269264 - 3.269264\n' +
'v 3.269264 - 3.269264 - 3.269264\n' +
'vt 0.383749 0.499803\n' +
'vt 0.624411 0.499802\n' +
'vt 0.624411 0.740465\n' + 
'vt 0.383749 0.740464\n' +
'vt 0.624411 0.259140\n' +
'vt 0.383749 0.259141\n' +
'vt 0.383749 0.018479\n' +
'vt 0.624411 0.018478\n' +
'vt 0.383749 0.981126\n' +
'vt 0.624411 0.981127\n' +
'vt 0.143087 0.499803\n' +
'vt 0.143087 0.740465\n' +
'vt 0.865073 0.740465\n' +
'vt 0.865073 0.499803\n' +
'vn 0.000000 0.000000 1.000000\n' +
'vn 0.000000 0.000000 1.000000\n' +
'vn 0.000000 0.000000 1.000000\n' +
'vn 0.000000 0.000000 1.000000\n' +
'vn 0.000000 1.000000 0.000000\n' +
'vn 0.000000 1.000000 0.000000\n' +
'vn 0.000000 1.000000 0.000000\n' +
'vn 0.000000 1.000000 0.000000\n' +
'vn 0.000000 0.000000 - 1.000000\n' +
'vn 0.000000 0.000000 - 1.000000\n' +
'vn 0.000000 0.000000 - 1.000000\n' +
'vn 0.000000 0.000000 - 1.000000\n' +
'vn 0.000000 - 1.000000 0.000000\n' +
'vn 0.000000 - 1.000000 0.000000\n' +
'vn 0.000000 - 1.000000 0.000000\n' +
'vn 0.000000 - 1.000000 0.000000\n' +
'vn 1.000000 0.000000 0.000000\n' +
'vn 1.000000 0.000000 0.000000\n' +
'vn 1.000000 0.000000 0.000000\n' +
'vn 1.000000 0.000000 0.000000\n' +
'vn - 1.000000 0.000000 0.00000\n' +
'vn - 1.000000 0.000000 0.000000\n' +
'vn - 1.000000 0.000000 0.000000\n' +
'vn - 1.000000 0.000000 0.000000\n' +
's off\n' +
'g pCube1\n' +
'usemtl initialShadingGroup\n' +
'f 1/ 11 / 1 2/ 1 / 2 4/ 4 / 3 3/ 12 / 4\n' +
'f 3/ 9 / 5 4/ 4 / 6 6/ 3 / 7 5/ 10 / 8\n' +
'f 5/ 13 / 9 6/ 3 / 10 8/ 2 / 11 7/ 14 / 12\n' +
'f 7/ 5 / 13 8/ 2 / 14 2/ 1 / 15 1/ 6 / 16\n' +
'f 2/ 1 / 17 8/ 2 / 18 6/ 3 / 19 4/ 4 / 20\n' +
'f 7/ 5 / 21 1/ 6 / 22 3/ 7 / 23 5/ 8 / 24\n';

//Main Function
function main() {
    //Retrieve canvas by ID
    var canvas = document.getElementById('webgl');

    //Get rendering context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    //Set color for clearing canvas to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //Clear the canvas and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}