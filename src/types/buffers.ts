type MaybeBuffer = WebGLBuffer | null

export interface ModelBuffers {
  position: MaybeBuffer,
  color: MaybeBuffer,
  indicies: MaybeBuffer,
  textureCoord: MaybeBuffer,
  normal: MaybeBuffer,
}