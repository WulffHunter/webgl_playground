import type { vec3 } from 'gl-matrix'

import type { Vector } from './vector'

export type AttributeLoc = ReturnType<WebGLRenderingContext["getAttribLocation"]>
export type UniformLoc = ReturnType<WebGLRenderingContext["getUniformLocation"]>

export enum Attribute {
  VERTEX_POSITION = 'vertexPosition',
  VERTEX_COLOR = 'vertexColor',
  TEXTURE_COORD = 'textureCoord',
  VERTEX_NORMAL = 'vertexNormal',
}

export enum Uniform {
  PROJECTION_MATRIX = 'projectionMatrix',
  MODEL_VIEW_MATRIX = 'modelViewMatrix',
  NORMAL_MATRIX = 'normalMatrix',
  SAMPLER = 'sampler',
  LIGHT_POSITION = 'lightPosition',
  LIGHT_COLOR = 'lightColor',
  LIGHT_POWER = 'lightPower',
  AMBIENT_COLOR = 'ambientColor',
  DIFFUSE_COLOR = 'diffuseColor',
  SPECULAR_COLOR = 'specularColor',
  SHININESS = 'shininess',
  TEXTURE_SIZE = 'textureSize',
}

export type SrcAttrs<A extends Attribute> = Record<A, string>
export type SrcUnis<U extends Uniform> = Record<U, string>

export type ShaderSource<
  N extends string,
  A extends Partial<Record<Attribute, string>>,
  U extends Partial<Record<Uniform, string>>,
> = {
  name: N,
  vertexSource: string,
  fragmentSource: string,
  attributesToShaderName: A,
  uniformsToShaderName: U,
}

export type ProgAttrs<A extends Attribute> = Record<A, AttributeLoc>
export type ProgUnis<U extends Uniform> = Record<U, UniformLoc>

export type ShaderProgram<
  N extends string,
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
> = {
  program: WebGLProgram,
  type: N,
  attribLocations: A,
  uniformLocations: U,
}

export type ShaderType =
  | WebGLRenderingContext["VERTEX_SHADER"]
  | WebGLRenderingContext["FRAGMENT_SHADER"]

export interface BlinnPhongSetup {
  lightPos: Vector,
  lightColor: vec3
  lightPower: number,

  ambientColor: vec3,
  diffuseColor: vec3,
  specColor: vec3,

  shininess: number,
}

export type ShaderProgFromSrc<N extends string, T extends ShaderSource<N, any, any>> =
  T extends ShaderSource<
    N,
    Record<infer A extends Attribute, string>,
    Record<infer U extends Uniform, string>
  >
    ? ShaderProgram<N, Record<A, AttributeLoc>, Record<U, AttributeLoc>>
    : never
