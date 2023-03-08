import type { WrappedTexture } from '../types/texture'

import { isPowerOf2 } from './utils'

/**
 * Uploads a single blue pixel into the 2D texture buffer.
 * @param gl The WebGL context
 */
function useTempTexture(gl: WebGLRenderingContext) {
  gl.texImage2D(
    gl.TEXTURE_2D,
    // Level
    0,
    // Internal Format
    gl.RGBA,
    // Width & height (px)
    1, 1,
    // Border
    0,
    // Source format
    gl.RGBA,
    // Source type
    gl.UNSIGNED_BYTE,
    // The single pixel (opaque blue)
    new Uint8Array([ 0, 0, 255, 255 ]),
  )
}

export function loadTexture(
  gl: WebGLRenderingContext,
  url: string,
): WrappedTexture {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  useTempTexture(gl)

  const wrappedTexture: WrappedTexture = {
    texture,
    width: 1,
    height: 1,
  }

  const image = new Image()

  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image,
    )

    wrappedTexture.width = image.width
    wrappedTexture.height = image.height

    // WebGL1 has different requirements for power-of-2 images vs
    // non-power-of-2 images. Thus, we check if the image is a power
    // of 2 in both dimensions.
    //
    // Why is this the case? There are many optimizations the graphics
    // pipeline can make if something is a ^2, e.g. faster to divide
    // and multiply, and simplifies operations. Here, we can generate
    // mipmaps at multiple levels easily because we can divide the
    // image size down by 2 without rounding.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      // Otherwise, as we scale the texture, we have to sample it in texture
      // space. Set the parameters for the sampling and the minification
      // filter.

      // Prevent s-coordinate wrapping (repeating)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      // Prevent t-coordinate wrapping (repeating)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      // Can also use `gl.NEAREST` instead of `gl.LINEAR`. Keep in mind
      // that both of these are approximations: neither of these are
      // mipmaps, which are more efficient.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
  }

  image.src = url
  
  return wrappedTexture
}
