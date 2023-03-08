import type { ModelBuffers } from '../types/buffers'
import type { Model } from '../types/model'

function initPositionBuffer(gl: WebGLRenderingContext, model: Model) {
  const positionBuffer = gl.createBuffer()

  // Put the `positionBuffer` into the `ARRAY_BUFFER` slot while we
  // fill it.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Generate a buffer of data in a format that the GPU can read.
  // Using `getAttribLocation`, we know where shader variables have been
  // allocated on the GPU: here, we're collecting the vertex position
  // data into a buffer that will be uploaded into those shader
  // variable locations.
  //
  // Since we attached `positionBuffer` to the `ARRAY_BUFFER` slot,
  // writing `positions` into the `ARRAY_BUFFER` should write to
  // `positionBuffer`
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.vertexPositions),
    gl.STATIC_DRAW,
  )

  return positionBuffer
}

function initIndexBuffer(gl: WebGLRenderingContext, model: Model) {
  const indexBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(model.triangleIndicies),
    gl.STATIC_DRAW,
  )

  return indexBuffer
}

function initTextureBuffer(gl: WebGLRenderingContext, model: Model) {
  const textureCoordBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.textureCoordinates),
    gl.STATIC_DRAW,
  )

  return textureCoordBuffer
}

function initColorBuffer(gl: WebGLRenderingContext, model: Model) {
  if (model.vertexColors) {
    const colorBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(model.vertexColors),
      gl.STATIC_DRAW,
    )

    return colorBuffer
  }

  return null
}

function initNormalBuffer(gl: WebGLRenderingContext, model: Model) {
  const normalBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(model.vertexNormals),
    gl.STATIC_DRAW,
  )

  return normalBuffer
}

export function initModelBuffers(gl: WebGLRenderingContext, model: Model): ModelBuffers {
  const positionBuffer = initPositionBuffer(gl, model)
  const colorBuffer = initColorBuffer(gl, model)
  const indexBuffer = initIndexBuffer(gl, model)
  const textureBuffer = initTextureBuffer(gl, model)
  const normalBuffer = initNormalBuffer(gl, model)

  return {
    position: positionBuffer,
    color: colorBuffer,
    indicies: indexBuffer,
    textureCoord: textureBuffer,
    normal: normalBuffer,
  }
}