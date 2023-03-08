/**
------------ one pass outline shader ------------
  original author: Richman Stewart
  applies a gaussian blur horizontally and vertically
  behind the original texture and makes it black
------------------ use ------------------------
  outline_thickness - outline spread amount
  outlineColour - colour of the outline
**/

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

uniform ivec2 uTextureSize;
uniform sampler2D uSampler;

lowp float outline_thickness = 0.2;
lowp vec3 outlineColour = vec3(0.0, 0.0, 1.0);
lowp float outlineThreshold = 0.5;

highp vec4 texelFetch(sampler2D tex, ivec2 size, highp vec2 coord) {
  return texture2D(
    tex,
    vec2(
      coord.x / float(size.x),
      coord.y / float(size.y)
    )
  );
}

void main() {
  highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

  if (texelColor.a <= outlineThreshold) {
    gl_FragColor = vec4(outlineColour, 1.0);
    // highp float uv_x = vTextureCoord.x * float(uTextureSize.x);
    // highp float uv_y = vTextureCoord.y * float(uTextureSize.y);

    // highp float sum = 0.0;
    // for (lowp float n = 0.0; n < 9.0; ++n) {
    //   uv_y = (vTextureCoord.y * float(uTextureSize.y)) + (outline_thickness * (n - 4.5));
    //   highp float h_sum = 0.0;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x - (4.0 * outline_thickness), uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x - (3.0 * outline_thickness), uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x - (2.0 * outline_thickness), uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x - outline_thickness, uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x, uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x + outline_thickness, uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x + (2.0 * outline_thickness), uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x + (3.0 * outline_thickness), uv_y)).a;
    //   h_sum += texelFetch(uSampler, uTextureSize, vec2(uv_x + (4.0 * outline_thickness), uv_y)).a;
    //   sum += h_sum / 9.0;
    // }

    // if (sum / 9.0 >= 0.0001) {
    //   gl_FragColor = vec4(outlineColour, 1);
    // }
  } else {
    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
}