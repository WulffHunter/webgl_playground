import { mat4 } from 'gl-matrix'

import type { ModelBuffers } from '../types/buffers'
import type { Actor, Scene } from '../types/scene'
import {
  Attribute,
  AttributeLoc,
  BlinnPhongSetup,
  ShaderProgram,
  Uniform,
  UniformLoc,
} from '../types/shaders'
import { ifAttrLocExists, ifUniLocExists } from './shader'

import { toRadian } from './utils'

function setVertexPositionAttribute<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  gl: WebGLRenderingContext,
  buffers: ModelBuffers,
  shaderProgram: ShaderProgram<string, A, U>,
) {
  ifAttrLocExists(shaderProgram, Attribute.VERTEX_POSITION, loc => {
    // There are 3 components per vertex (x, y, z)
    const numComponents = 3
    // The data in the buffer is 32 bit floats
    const type = gl.FLOAT
    // Don't normalize the data
    const normalize = false
    // There are no extra bytes between each set of values
    const stride = 0
    // Start reading from the buffer at the beginning (no padding)
    const offset = 0

    // Re-attach the `position` buffer to the `ARRAY_BUFFER`
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)

    // Bind the `ARRAY_BUFFER` to the given attribute (indentified by
    // index: here, the `vertexPosition` attribute) and pass the data
    // into it using the provided instructions on how to read it.
    // 
    // It's important that we have this flexibility on how to read the
    // data into the attribute as a single buffer may contain a lot of
    // data per vertex, with chunks intended to be read by specific
    // attributes. For example, if a buffer contains:
    //   [
    //      x1, y1, normal_x1, normal_y1,
    //      x2, y2, normal_x2, normal_y2, ...
    //   ] (where each variable is a 32-bit float)
    // then we may want to send the (x, y) to a `vertexPosition` attribute,
    // but the (normal_x, normal_y) to a `vertexNormal` attribute. This would
    // require us to specify a stride of 16 (calculated as
    // 4 variables * 4 bytes (32 bits / 8 bits per byte)) and an offset of
    // 0 for the `vertexPosition` and 8 (calculated as
    // 2 variables (x and y) * 4 bytes (32 bits / 8 bits per byte)) for the
    // `vertexNormal`.
    // (NOTE: Again, that 32-bit is important: note the byte length of your
    // data!)
    gl.vertexAttribPointer(
      loc,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    )

    // Shader attributes are disabled by default. Now that we've
    // filled this attribute, manually enable it.
    //
    // We've passed in the index that uniquely identifies the vertex
    // attribute that we're working with.
    gl.enableVertexAttribArray(loc)
  })
}

function setColorAttribute<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  gl: WebGLRenderingContext,
  buffers: ModelBuffers,
  shaderProgram: ShaderProgram<string, A, U>,
) {
  ifAttrLocExists(shaderProgram, Attribute.VERTEX_COLOR, loc => {
    // (R,G,B,A)
    const numComponents = 4
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(
      loc,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    )

    gl.enableVertexAttribArray(loc)
  })
}

function setTextureAttribute<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  gl: WebGLRenderingContext,
  buffers: ModelBuffers,
  shaderProgram: ShaderProgram<string, A, U>,
) {
  ifAttrLocExists(shaderProgram, Attribute.TEXTURE_COORD, loc => {
    // S and T
    const numComponents = 2
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
    gl.vertexAttribPointer(
      loc,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    )

    gl.enableVertexAttribArray(loc)
  })
}

function setNormalAttribute<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  gl: WebGLRenderingContext,
  buffers: ModelBuffers,
  shaderProgram: ShaderProgram<string, A, U>,
) {
  ifAttrLocExists(shaderProgram, Attribute.VERTEX_NORMAL, loc => {
    const numComponents = 3
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal)
    gl.vertexAttribPointer(
      loc,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    )

    gl.enableVertexAttribArray(loc)
  })
}

function drawActor<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  gl: WebGLRenderingContext,
  actor: Actor<A, U>,
  projectionMatrix: mat4,
  blinnPhongSetup?: BlinnPhongSetup,
) {
  // Tell WebGL to use the given shader program
  gl.useProgram(actor.shader.program)

  const modelViewMatrix = mat4.create()

  // Now move the drawing position a bit to where we want to start
  // drawing the square
  mat4.translate(
    // Destination
    modelViewMatrix,
    // Matrix to translate
    modelViewMatrix,
    // Amount to translate
    [
      actor.position.x,
      actor.position.y,
      actor.position.z,
    ],
  )
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    // Amount to rotate the scene, in radians
    (actor.rotation.x * Math.PI) / 180,
    [ 0, 1, 0 ], // Rotation around y-axis
  )
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    // Amount to rotate the scene, in radians
    (actor.rotation.y * Math.PI) / 180,
    [ 1, 0, 0 ], // Rotation around x-axis
  )
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    // Amount to rotate the scene, in radians
    (actor.rotation.z * Math.PI) / 180,
    [ 0, 0, 1 ], // Rotation around z-axis
  )

  // Transform the normals with the current orientation
  // of the cube in relation to the light source.
  const normalMatrix = mat4.create()
  mat4.invert(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)

  // Put the positions from the `position` buffer into the
  // `vertexPosition` attribute
  setVertexPositionAttribute(gl, actor.modelBuffers, actor.shader)
  setColorAttribute(gl, actor.modelBuffers, actor.shader)
  setTextureAttribute(gl, actor.modelBuffers, actor.shader)
  setNormalAttribute(gl, actor.modelBuffers, actor.shader)

  // Bind the indicies that describe the shape's triangles
  // to the element array buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, actor.modelBuffers.indicies)

  // Below, we load uniform matricies into the slots recieved
  // from the shader program.
  //
  // This is a lot like how we load vertex information into
  // the attributes, but since this is a uniform matrix
  // rather than an attribute (which is reloaded with a
  // new value per each vertex, so we need to specify
  // reading instructions), we only need to pass it in once.

  ifUniLocExists(actor.shader, Uniform.PROJECTION_MATRIX, loc => {
    gl.uniformMatrix4fv(
      loc,
      false,
      projectionMatrix,
    )
  })
  

  // Upload the model-view and normal matricies to the
  // shader program
  ifUniLocExists(actor.shader, Uniform.MODEL_VIEW_MATRIX, loc => {
    gl.uniformMatrix4fv(
      loc,
      false,
      modelViewMatrix,
    )
  })

  ifUniLocExists(actor.shader, Uniform.NORMAL_MATRIX, loc => {
    gl.uniformMatrix4fv(
      loc,
      false,
      normalMatrix,
    )
  })

  // Tell the shader we bound the texture to texture unit 0
  ifUniLocExists(actor.shader, Uniform.SAMPLER, loc => {
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, actor.texture.texture)
    // Note that above, we bound the texture to index 0. The 0 here
    // represents texture index 0.
    gl.uniform1i(loc, 0)
  })

  // Upload the texture size to the shader
  ifUniLocExists(actor.shader, Uniform.TEXTURE_SIZE, loc => {
    gl.uniform2i(
      loc,
      actor.texture.width,
      actor.texture.height,
    )
  })

  if (blinnPhongSetup) {
    ifUniLocExists(actor.shader, Uniform.LIGHT_POSITION, loc => {
      gl.uniform3fv(
        loc,
        new Float32Array([
          blinnPhongSetup.lightPos.x,
          blinnPhongSetup.lightPos.y,
          blinnPhongSetup.lightPos.z,
        ]),
      )
    })
    
    ifUniLocExists(actor.shader, Uniform.LIGHT_COLOR, loc => {
      gl.uniform3fv(
        loc,
        new Float32Array(blinnPhongSetup.lightColor),
      )
    })
    
    ifUniLocExists(actor.shader, Uniform.LIGHT_POWER, loc => {
      gl.uniform1f(
        loc,
        blinnPhongSetup.lightPower,
      )
    })

    ifUniLocExists(actor.shader, Uniform.AMBIENT_COLOR, loc => {
      gl.uniform3fv(
        loc,
        new Float32Array(blinnPhongSetup.ambientColor),
      )
    })
    
    ifUniLocExists(actor.shader, Uniform.DIFFUSE_COLOR, loc => {
      gl.uniform3fv(
        loc,
        new Float32Array(blinnPhongSetup.diffuseColor),
      )
    })

    ifUniLocExists(actor.shader, Uniform.SPECULAR_COLOR, loc => {
      gl.uniform3fv(
        loc,
        new Float32Array(blinnPhongSetup.specColor),
      )
    })
    
    ifUniLocExists(actor.shader, Uniform.SHININESS, loc => {
      gl.uniform1f(
        loc,
        blinnPhongSetup.shininess,
      )
    })
  }

  // Draw the shape. Now that we've associated the buffer
  // with the shaders, we make the shader run through the
  // data provided in then buffer.
  const vertexCount = actor.model.triangleIndicies.length
  const type = gl.UNSIGNED_SHORT
  const offset = 0
  gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
}

export function drawScene<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  gl: WebGLRenderingContext,
  scene: Scene<A, U>,
  blinnPhongSetup: BlinnPhongSetup,
) {
  // Clear everything to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // Clear everything
  gl.clearDepth(1.0)
  // Enable WebGL to test the depth of a fragment by
  // reading from the depth buffer.
  gl.enable(gl.DEPTH_TEST)
  // Near things obscure far things: the depth must be less than
  // or equal to another depth to overwrite a screen-space pixel
  // buffer.
  gl.depthFunc(gl.LEQUAL)

  // Clear the canvas before we start drawing on it: wipe the
  // color buffer and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our FOV is 45 degrees, with a width/height ration that
  // matches the display size of the canvas and we only want to
  // see objects between 0.1 and 100 units away from the camera.

  // Declare a 45 degree FOV in radians
  const fieldOfView = toRadian(45)
  // The canvas can be onscreen or offscreen: if it's offscreen,
  // set it to 0 since it's not shown anyways
  const aspect = ('clientWidth' in gl.canvas)
    ? gl.canvas.clientWidth / gl.canvas.clientHeight
    : 0
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  for (let actor of scene) {
    drawActor(
      gl,
      actor,
      projectionMatrix,
      blinnPhongSetup,
    )
  }
}