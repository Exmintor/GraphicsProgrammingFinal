//Vertex Shader
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_Position = u_MvpMatrix * a_Position;\n' +
    '   v_TexCoord = a_TexCoord;\n' +
    '}\n';

//Fragment Shader
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '   gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
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

    //Set the position of vertices
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    //Get storage location of the u_MvpMatrix variable
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (u_MvpMatrix < 0) {
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }

    //Create the MVP matrix
    var mvpMatrix = new Matrix4();


    //Calculate the MVP matrix
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    //Pass the mvp matrix to the vertex shader
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    //Set the textures
    if (!initTextures(gl, n)) {
        console.log('Failed to set the positions of the vertices');
        return;
    }
}

function initVertexBuffers(gl) {
    //Vertex coordinates
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,  // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,  // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0   // v4-v7-v6-v5 back
    ]);
    //Color
    var texCoords = new Float32Array([
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v1-v2-v3 front(blue)
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v3-v4-v5 right(green)
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up(red)
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v1-v6-v7-v2 left
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v7-v4-v3-v2 down
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0 // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);

    //Create buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object.');
        return -1;
    }

    //Write the vertex coordinates to a new buffer object
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
        return -1;
    //Write the colors to a new buffer object
    if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord'))
        return -1;

    //Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    //Create a buffer object
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    //Write data into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    //Get storage location of attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }

    //Pass data to vertex shader's attribute variable
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}

function initTextures(gl, n) {
    //Create texture object
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture object.');
        return -1;
    }

    //Get storage location of u_Sampler
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (u_Sampler < 0) {
        console.log('Failed to get the storage location of u_Sampler');
        return;
    }

    //Crate an image object
    var image = new Image();
    if (!image) {
        console.log('Failed to create the image object.');
        return -1;
    }

    //Register the event handler to be called on loading an image
    image.onload = function () { loadTexture(gl, n, texture, u_Sampler, image); };
    //Tell the browser to load an image
    image.src = 'resources/texture.png';

    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    //Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //Enable the texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    //Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //Set the texture unit 0 to the sampler
    gl.uniform1i(u_Sampler, 0);

    //Set color for clearing canvas to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //Enable the hidden surface removal
    gl.enable(gl.DEPTH_TEST);
    //Clear the canvas and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}