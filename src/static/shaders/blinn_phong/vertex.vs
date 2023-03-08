attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 normalInterp;
varying highp vec3 vVertexPosition;

void main(void) {
  vec4 vertexPos4 = uModelViewMatrix * aVertexPosition;
  vVertexPosition = vec3(vertexPos4) / vertexPos4.w;
  gl_Position = uProjectionMatrix * vertexPos4;

  // Transform the normal based on current orientation of the cube
  normalInterp = vec3(uNormalMatrix * vec4(aVertexNormal, 0.0));
}