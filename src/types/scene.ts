import type {
  Attribute,
  AttributeLoc,
  ShaderProgram,
  Uniform,
  UniformLoc,
} from './shaders'
import type { WrappedTexture } from './texture'
import type { Vector } from './vector'
import type { ModelBuffers } from './buffers'
import type { Model } from './model'

export type Actor<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
> = {
  model: Model,
  modelBuffers: ModelBuffers,
  texture: WrappedTexture,
  shader: ShaderProgram<string, A, U>,
  position: Vector,
  rotation: Vector,
}

export type Scene<
  A extends Partial<Record<Attribute, AttributeLoc>>,
  U extends Partial<Record<Uniform, UniformLoc>>,
> = Actor<A, U>[]