precision highp float;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

uniform vec3 lightPos;
uniform vec3 lightColor;
uniform highp float lightPower;

uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specColor;

uniform highp float shininess;

lowp float screenGamma = 2.2;

varying highp vec3 normalInterp;
varying highp vec3 vVertexPosition;

void main() {
  vec3 normal = normalize(normalInterp);
  vec3 lightDir = lightPos - vVertexPosition;
  // Square the distance
  float distance = length(lightDir);
  distance = distance * distance;
  lightDir = normalize(lightDir);

  // Intensity of the diffuse light (matte)
  float lambertian = max(dot(lightDir, normal), 0.0);
  float specular = 0.0;

  if (lambertian > 0.0) {

    vec3 viewDir = normalize(-vVertexPosition);

    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, shininess);
  }

  vec3 BlinnPhong = ambientColor +
    diffuseColor * lambertian * lightColor * lightPower / distance +
    specColor * specular * lightColor * lightPower / distance;

  // apply gamma correction (assume ambientColor, diffuseColor and specColor
  // have been linearized, i.e. have no gamma correction in them)
  vec3 colorGammaCorrected = pow(BlinnPhong, vec3(1.0 / screenGamma));
  // use the gamma corrected color in the fragment
  gl_FragColor = vec4(colorGammaCorrected, 1.0);
}
