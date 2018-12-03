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
var OBJ_SOURCE = null;

//Main Function
function main() {
    readOBJ('resources/Skull.txt');
}

function readOBJ(fileName) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 4) {
            OBJ_SOURCE = request.responseText;
            start();
        }
    }

    request.open('GET', fileName, true);
    request.send();
}
//Start function
function start() {
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
    mvpMatrix.lookAt(1, 1, 7, 0, 0, 0, 0, 1, 0);

    //Pass the mvp matrix to the vertex shader
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    //Set the textures
    if (!initTextures(gl, n)) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    canvas.onmousedown = function () { lockMouse(canvas); };
    canvas.onmouseup = function () { unlockMouse(); };
}

function initVertexBuffers(gl) {
    var objString = OBJ_SOURCE;

    //Vertex coordinates
    var tempVertices = parseVertexes(objString);
    var vertexIndexes = parseIndex(objString, 'vertex');
    var numVertexes = vertexIndexes.length;
    var vertices = new Float32Array(numVertexes * 3);
    for (var i = 0; i < numVertexes; i++) {
        vertices[i * 3] = tempVertices[vertexIndexes[i] * 3];
        vertices[i * 3 + 1] = tempVertices[vertexIndexes[i] * 3 + 1];
        vertices[i * 3 + 2] = tempVertices[vertexIndexes[i] * 3 + 2];
    }

    //Texture Coordinates
    var tempTexCoords = parseTextureCoordinates(objString);
    var textureIndexes = parseIndex(objString, 'texture');
    var numTextures = textureIndexes.length;
    var texCoords = new Float32Array(numTextures * 2);
    for (var i = 0; i < numTextures; i++) {
        texCoords[i * 2] = tempTexCoords[textureIndexes[i] * 2];
        texCoords[i * 2 + 1] = tempTexCoords[textureIndexes[i] * 2 + 1];
    }

    //Write the vertex coordinates to a new buffer object
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
        return -1;
    //Write the texture coordinates to a new buffer object
    if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord'))
        return -1;

    return numVertexes;
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
    image.src = 'resources/SkullTexture.jpg';

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

    //Draw the image
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function parseVertexes(objString) {
    var vertexArray = new Array(0);

    var lines = objString.split('\n');
    lines.push(null);
    var index = 0;

    var line;
    var sp = new StringParser();
    while ((line = lines[index++]) != null) {
        sp.init(line);
        var command = sp.getWord();
        if (command == null)
            continue;
        if (command == 'v') {
            var x = sp.getFloat();
            var y = sp.getFloat();
            var z = sp.getFloat();
            vertexArray.push(x);
            vertexArray.push(y);
            vertexArray.push(z);
        }
    }

    return vertexArray;
}

function parseTextureCoordinates(objString) {
    var coordinateArray = new Array(0);

    var lines = objString.split('\n');
    lines.push(null);
    var index = 0;

    var line;
    var sp = new StringParser();
    while ((line = lines[index++]) != null) {
        sp.init(line);
        var command = sp.getWord();
        if (command == null)
            continue;
        if (command == 'vt') {
            var u = sp.getFloat();
            var v = sp.getFloat();
            coordinateArray.push(u);
            coordinateArray.push(v);
        }
    }

    return coordinateArray;
}

function parseIndex(objString, vtn) {
    var indexes = new Array(0);

    var lines = objString.split('\n');
    lines.push(null);
    var index = 0;

    var line;
    var sp = new StringParser();
    while ((line = lines[index++]) != null) {
        sp.init(line);
        var command = sp.getWord();
        if (command == null)
            continue;
        if (command == 'f') {
            for (; ;) {
                var word = sp.getWord();
                if (word == null)
                    break;
                var subWords = word.split('/');
                if (vtn == 'vertex') {
                    var vertexIndex = parseInt(subWords[0]) - 1;
                    indexes.push(vertexIndex);
                }
                if (vtn == 'texture') {
                    var textureIndex = parseInt(subWords[1] - 1);
                    indexes.push(textureIndex);
                }
                if (vtn == 'normal') {
                    var normalIndex = parseInt(subWords[2]) - 1;
                    indexes.push(normalIndex);
                }
            }
        }
    }

    return indexes;
}

function lockMouse(canvas) {
    canvas.requestPointerLock();
}
function unlockMouse() {
    document.exitPointerLock();
}


//---STRING PARSER------------------------------------------------------
// Constructor
var StringParser = function (str) {
    this.str;   // Store the string specified by the argument
    this.index; // Position in the string to be processed
    this.init(str);
}
// Initialize StringParser object
StringParser.prototype.init = function (str) {
    this.str = str;
    this.index = 0;
}

// Skip delimiters
StringParser.prototype.skipDelimiters = function () {
    for (var i = this.index, len = this.str.length; i < len; i++) {
        var c = this.str.charAt(i);
        // Skip TAB, Space, '(', ')
        if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"') continue;
        break;
    }
    this.index = i;
}

// Skip to the next word
StringParser.prototype.skipToNextWord = function () {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    this.index += (n + 1);
}

// Get word
StringParser.prototype.getWord = function () {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    if (n == 0) return null;
    var word = this.str.substr(this.index, n);
    this.index += (n + 1);

    return word;
}

// Get integer
StringParser.prototype.getInt = function () {
    return parseInt(this.getWord());
}

// Get floating number
StringParser.prototype.getFloat = function () {
    return parseFloat(this.getWord());
}

// Get the length of word
function getWordLength(str, start) {
    var n = 0;
    for (var i = start, len = str.length; i < len; i++) {
        var c = str.charAt(i);
        if (c == '\t' || c == ' ' || c == '(' || c == ')' || c == '"')
            break;
    }
    return i - start;
}