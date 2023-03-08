export interface Model {
  vertexPositions: number[],
  vertexColors?: number[],
  // Defines the triangles that make up
  // the shape using the indicies into the vertex
  // array to specify each triangle's position
  triangleIndicies: number[],
  textureCoordinates: number[],
  vertexNormals: number[],
}