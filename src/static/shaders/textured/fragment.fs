varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  // Using `vTextureCoord` (which was assigned in the
  // vertex shader), get the color from the texel.
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}