import type { Model } from '../../types/model'

import { WHITE, RED, GREEN, BLUE } from '../color'

// The square vertex positions, as (x, y, z).
// Note that all of the z components are `1.0`.
const squareVertexPositions = [
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,
  1.0, -1.0, 1.0,
  -1.0, -1.0, 1.0,
]

const squareVertexColors = [
  ...WHITE,
  ...RED,
  ...GREEN,
  ...BLUE,
]

const triangleIndicies = [
  0,
  1,
  2,
  2,
  3,
  1,
]

const textureCoordinates = [
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
]

const vertexNormals = [
  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
]

export const SQUARE: Model = {
  vertexPositions: squareVertexPositions,
  vertexColors: squareVertexColors,
  triangleIndicies,
  textureCoordinates,
  vertexNormals,
}