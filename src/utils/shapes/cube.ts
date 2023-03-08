import type { Model } from '../../types/model'

import {
  RED,
  GREEN,
  BLUE,
  YELLOW,
  PURPLE,
  CYAN,
} from '../color'

// Cube courtesy of MDN:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Creating_3D_objects_using_WebGL
const cubeVerticies = [
  // Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

  // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

  // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

  // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

  // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
]

const cubeVertexColors = [
  // FRONT
  ...RED, ...RED, ...RED, ...RED,
  // BACK
  ...GREEN, ...GREEN, ...GREEN, ...GREEN,
  // TOP
  ...BLUE, ...BLUE, ...BLUE, ...BLUE,
  // BOTTOM
  ...YELLOW, ...YELLOW, ...YELLOW, ...YELLOW,
  // RIGHT
  ...PURPLE, ...PURPLE, ...PURPLE, ...PURPLE,
  // LEFT
  ...CYAN, ...CYAN, ...CYAN, ...CYAN,
]

const triangleIndicies = [
  //FRONT
  0,
  1,
  2,
  0,
  2,
  3,
  // BACK
  4,
  5,
  6,
  4,
  6,
  7,
  // TOP
  8,
  9,
  10,
  8,
  10,
  11,
  // BOTTOM
  12,
  13,
  14,
  12,
  14,
  15,
  // RIGHT
  16,
  17,
  18,
  16,
  18,
  19,
  // LEFT
  20,
  21,
  22,
  20,
  22,
  23,
]

const textureCoordinates = [
  // Front
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Back
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Top
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Bottom
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Right
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Left
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
]

const vertexNormals = [
  // Front
  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
  // Back
  0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
  // Top
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
  // Bottom
  0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
  // Right
  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
  // Left
  -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
]

export const CUBE: Model = {
  vertexPositions: cubeVerticies,
  vertexColors: cubeVertexColors,
  triangleIndicies,
  textureCoordinates,
  vertexNormals,
}