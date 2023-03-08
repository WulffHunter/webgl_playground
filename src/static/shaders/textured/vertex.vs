attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  // Assign the appropriate texture coordinate here so that the
  // fragment shader will get the same variable and know which
  // coordinates to sample from
  vTextureCoord = aTextureCoord;
}