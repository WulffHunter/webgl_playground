import type {
  Attribute,
  ShaderSource,
  ShaderType,
  ShaderProgram,
  Uniform,
  AttributeLoc,
  UniformLoc,
} from '../types/shaders'

import { mapObject } from './utils'

export function newShaderSource<
  N extends string,
  A extends Partial<Record<Attribute, string>>,
  U extends Partial<Record<Uniform, string>>,
>(source: {
  name: N,
  vertexSource: string,
  fragmentSource: string,
  attributesToShaderName: A,
  uniformsToShaderName: U,
}): ShaderSource<N, A, U> {
  return source
}

/**
 * Uploads and compiles a source shader
 * @param gl The WebGL context
 * @param type Vertex or Fragment shader (use `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`)
 * @param source The shader program as text
 */
export function loadShader(
  gl: WebGLRenderingContext,
  type: ShaderType,
  source: string, 
) {
  const shader = gl.createShader(type)

  if (!shader) {
    alert('Failed to create a new shader object!')
    gl.deleteShader(shader)
    return null
  }

  // Send the source to the shader object
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occured while compiling the shader: ${
      gl.getShaderInfoLog(shader)
    }`)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export function initShaderProgram<
  N extends string,
  A extends Partial<Record<Attribute, string>>,
  U extends Partial<Record<Uniform, string>>,
>(
  gl: WebGLRenderingContext,
  shaderSource: ShaderSource<N, A, U>,
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, shaderSource.vertexSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, shaderSource.fragmentSource)
  const shaderProgram = gl.createProgram()
  
  if (!vertexShader || !fragmentShader || !shaderProgram) {
    alert(`Failed to initialize a part of the shader programs! Program initialized: ${
      !!shaderProgram
    }`)
    return null
  }

  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)

  // Link the shader program itself to the WebGL context
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(`Failed to link the shaders to the program!`)
    return null
  }

  return shaderProgram
}

export function loadShaderProgram<
  N extends string,
  A extends Attribute,
  Attrs extends Partial<Record<A, string>>,
  U extends Uniform,
  Unis extends Partial<Record<U, string>>,
>(
  gl: WebGLRenderingContext,
  shaderSource: ShaderSource<N, Attrs, Unis>,
): ShaderProgram<
  N,
  Record<A, AttributeLoc>,
  Record<U, UniformLoc>
> | undefined {
  const shaderProgram = initShaderProgram(gl, shaderSource)

  if (!shaderProgram) {
    return undefined
  }

  // We've allocated spaces on the GPU for these variables.
  // To send data into these variables, we need to ask WebGL where
  // it allocated these variables, so that we know where to send
  // the data.

  const attribLocations = mapObject(
    shaderSource.attributesToShaderName,
    (a, s) => [ a as A, gl.getAttribLocation(shaderProgram, s as string) ],
  )
  const uniformLocations = mapObject(
    shaderSource.uniformsToShaderName,
    (u, s) => [ u as U, gl.getUniformLocation(shaderProgram, s as string) ],
  )

  return {
    program: shaderProgram,
    type: shaderSource.name,
    attribLocations,
    uniformLocations,
  }
}

export function ifAttrLocExists<
  N extends string,
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  shaderProgram: ShaderProgram<N, A, U>,
  attribute: Attribute,
  onExists: (location: AttributeLoc) => void,
) {
  const attrLoc = shaderProgram.attribLocations[attribute]

  if (
    attribute in shaderProgram.attribLocations &&
    attrLoc !== undefined
  ) {
    onExists(attrLoc)
  }
}

export function ifUniLocExists<
  N extends string,
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
>(
  shaderProgram: ShaderProgram<N, A, U>,
  uniform: Uniform,
  onExists: (location: UniformLoc) => void,
) {
  const uniLoc = shaderProgram.uniformLocations[uniform]

  if (
    uniform in shaderProgram.uniformLocations &&
    uniLoc !== undefined
  ) {
    onExists(uniLoc)
  }
}
