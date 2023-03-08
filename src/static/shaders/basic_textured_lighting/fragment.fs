varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform sampler2D uSampler;

void main(void) {
  // Fetch the color of the texel from the texture
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  // Fragment color multiplies texel color by lighting,
  // plus the original texel alpha
  gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}