// @ts-ignore Ignore imports that are correctly handled by Parcel
import basicTexturedLightingVSUrl from 'url:./static/shaders/basic_textured_lighting/vertex.vs'
// @ts-ignore Ignore imports that are correctly handled by Parcel
import basicTexturedLightingFSUrl from 'url:./static/shaders/basic_textured_lighting/fragment.fs'

// @ts-ignore Ignore imports that are correctly handled by Parcel
import texturedBlinnPhongVSUrl from 'url:./static/shaders/textured_blinn_phong/vertex.vs'
// @ts-ignore Ignore imports that are correctly handled by Parcel
import texturedBlinnPhongFSUrl from 'url:./static/shaders/textured_blinn_phong/fragment.fs'

// @ts-ignore Ignore imports that are correctly handled by Parcel
import blinnPhongVSUrl from 'url:./static/shaders/blinn_phong/vertex.vs'
// @ts-ignore Ignore imports that are correctly handled by Parcel
import blinnPhongFSUrl from 'url:./static/shaders/blinn_phong/fragment.fs'

// @ts-ignore Ignore imports that are correctly handled by Parcel
import wulffTexUrl from 'url:./static/textures/wulffhunter.png'
// @ts-ignore Ignore imports that are correctly handled by Parcel
import batmanTexUrl from 'url:./static/textures/batman.png'

// @ts-ignore Ignore imports that are correctly handled by Parcel
import wolfUrl from 'url:./static/objects/wolf.obj'

import type { Vector } from './types/vector'
import type {
  BlinnPhongSetup,
  ProgAttrs,
  ProgUnis,
  ShaderProgram,
  ShaderSource,
  SrcAttrs,
  SrcUnis,
} from './types/shaders'
import type { Model } from './types/model'
import type { Scene } from './types/scene'

import { Attribute, Uniform } from './types/shaders'
import { loadShaderProgram, newShaderSource } from './utils/shader'
import { initModelBuffers } from './utils/buffer'
import { drawScene } from './utils/draw'
import { drawPlaceholderText } from './utils/draw_2d'
import { downloadAssetList } from './utils/assets'
import { loadTexture } from './utils/texture'
import { parseObj } from './utils/obj_format'
import { setupKeyPressHandlers, setUpMouseHandlers } from './utils/interaction'

import { CUBE } from './utils/shapes/cube'
import { mapObject } from './utils/utils'

const blinnPhongSetup: BlinnPhongSetup = {
  lightPos: { x: 0, y: 0, z: -10 },
  lightColor: [1,1,1],
  lightPower: 400,
  ambientColor: [0.1,0.1,0.1],
  diffuseColor: [0.1,0.1,0.1],
  specColor: [1,1,1],
  shininess: 16,
}

function initWebGL<
  N extends string,
  A extends Attribute,
  U extends Uniform,
>(
  gl: WebGLRenderingContext,
  models: { [k in string]: Model },
  shaderSources: { [K in N]: ShaderSource<N, SrcAttrs<A>, SrcUnis<U>> },
  rotationVectorPtr: Vector,
) {
  // Set clear color to black, fully opaque
  gl.clearColor(0, 0, 0, 1)
  // Clear the colour buffer with the specified clear colour
  gl.clear(gl.COLOR_BUFFER_BIT)

  const shaderPrograms = mapObject(
    shaderSources,
    (name, source) => [ name, loadShaderProgram(gl, source) ],
  )

  // Load the textures
  const wulffTexture = loadTexture(gl, wulffTexUrl)
  const batmanTexture = loadTexture(gl, batmanTexUrl)

  // Flip image pixels into the bottom-to-top order that WebGL expects
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  const modelBuffers = mapObject(
    models,
    (name, model) => [ name, initModelBuffers(gl, model) ],
  )

  const scene: Scene<ProgAttrs<A>, ProgUnis<U>> = []

  if ('wolf' in models && 'blinnPhong' in shaderPrograms) {
    scene.push({
      model: models.wolf,
      modelBuffers: modelBuffers.wolf,
      shader: shaderPrograms.blinnPhong as ShaderProgram<string, ProgAttrs<A>, ProgUnis<U>>,
      texture: wulffTexture,
      position: { x: -6, y: 0, z: -20 },
      rotation: rotationVectorPtr,
    })
  }

  if ('cube' in models && 'blinnPhong' in shaderPrograms) {
    scene.push({
      model: models.cube,
      modelBuffers: modelBuffers.cube,
      shader: shaderPrograms.blinnPhong as ShaderProgram<string, ProgAttrs<A>, ProgUnis<U>>,
      texture: batmanTexture,
      position: { x: 6, y: 0, z: -20 },
      rotation: rotationVectorPtr,
    })
  }

  // ------------------------------
  // INITIALIZE AND START RENDERING
  // ------------------------------

  let then = 0
  let deltaTime = 0

  function render(now: number) {
    deltaTime = now - then
    then = now

    drawScene(
      gl,
      scene,
      blinnPhongSetup,
    )

    // Recursively render the scene.
    // This IS the performant way of doing it.
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

async function main() {
  const glCanvas = document.querySelector<HTMLCanvasElement>('#glcanvas')
  const textCanvas = document.querySelector<HTMLCanvasElement>('#textcanvas')

  const ctx = textCanvas?.getContext('2d') || undefined

  drawPlaceholderText('Loading...', ctx)

  if (!glCanvas) {
    alert('Canvas not found! Unable to start WebGL.')

    return
  }

  const gl = glCanvas.getContext('webgl')

  if (!gl) {
    alert('Unable to get WebGL context! Please ensure that your browser has WebGL capabilities.')
    return
  }

  const [
    basicVsSource,
    basicFsSource,
    bpVsSource,
    bpFsSource,
    tbpVsSource,
    tbpFsSource,
    wolfSource,
  ] = await downloadAssetList([
    basicTexturedLightingVSUrl,
    basicTexturedLightingFSUrl,
    blinnPhongVSUrl,
    blinnPhongFSUrl,
    texturedBlinnPhongVSUrl,
    texturedBlinnPhongFSUrl,
    wolfUrl,
  ])

  const basicTexturedLightingSource = newShaderSource({
    name: 'basicTexturedLighting',
    vertexSource: basicVsSource,
    fragmentSource: basicFsSource,
    attributesToShaderName: {
      [Attribute.VERTEX_POSITION]: 'aVertexPosition',
      // [Attribute.VERTEX_COLOR]: 'aVertexColor',
      [Attribute.TEXTURE_COORD]: 'aTextureCoord',
      [Attribute.VERTEX_NORMAL]: 'aVertexNormal',
    },
    uniformsToShaderName: {
      [Uniform.PROJECTION_MATRIX]: 'uProjectionMatrix',
      [Uniform.MODEL_VIEW_MATRIX]: 'uModelViewMatrix',
      [Uniform.NORMAL_MATRIX]: 'uNormalMatrix',
      [Uniform.SAMPLER]: 'uSampler',
      // [Uniform.TEXTURE_SIZE]: 'uTextureSize',
    },
  })

  const blinnPhongSource = newShaderSource({
    name: 'blinnPhong',
    vertexSource: bpVsSource,
    fragmentSource: bpFsSource,
    attributesToShaderName: {
      [Attribute.VERTEX_POSITION]: 'aVertexPosition',
      [Attribute.VERTEX_NORMAL]: 'aVertexNormal',
    },
    uniformsToShaderName: {
      [Uniform.PROJECTION_MATRIX]: 'uProjectionMatrix',
      [Uniform.MODEL_VIEW_MATRIX]: 'uModelViewMatrix',
      [Uniform.NORMAL_MATRIX]: 'uNormalMatrix',

      [Uniform.LIGHT_POSITION]: 'lightPos',
      [Uniform.LIGHT_COLOR]: 'lightColor',
      [Uniform.LIGHT_POWER]: 'lightPower',

      [Uniform.AMBIENT_COLOR]: 'ambientColor',
      [Uniform.DIFFUSE_COLOR]: 'diffuseColor',
      [Uniform.SPECULAR_COLOR]: 'specColor',

      [Uniform.SHININESS]: 'shininess',
    },
  })

  const texturedBlinnPhongSource = newShaderSource({
    name: 'texturedBlinnPhong',
    vertexSource: tbpVsSource,
    fragmentSource: tbpFsSource,
    attributesToShaderName: {
      [Attribute.VERTEX_POSITION]: 'aVertexPosition',
      [Attribute.TEXTURE_COORD]: 'aTextureCoord',
      [Attribute.VERTEX_NORMAL]: 'aVertexNormal',
    },
    uniformsToShaderName: {
      [Uniform.PROJECTION_MATRIX]: 'uProjectionMatrix',
      [Uniform.MODEL_VIEW_MATRIX]: 'uModelViewMatrix',
      [Uniform.NORMAL_MATRIX]: 'uNormalMatrix',
      [Uniform.SAMPLER]: 'uSampler',

      [Uniform.LIGHT_POSITION]: 'lightPos',
      [Uniform.LIGHT_COLOR]: 'lightColor',
      [Uniform.LIGHT_POWER]: 'lightPower',

      [Uniform.AMBIENT_COLOR]: 'ambientColor',
      [Uniform.DIFFUSE_COLOR]: 'diffuseColor',
      [Uniform.SPECULAR_COLOR]: 'specColor',

      [Uniform.SHININESS]: 'shininess',
    },
  })

  const wolfObj = parseObj(wolfSource)

  drawPlaceholderText('', ctx)

  const rotation: Vector = {
    x: 45,
    y: 45,
    z: 0,
  }

  if (textCanvas) {
    setUpMouseHandlers(textCanvas, rotation)
    setupKeyPressHandlers(textCanvas, blinnPhongSetup)
  }

  initWebGL(
    gl,
    {
      'cube': CUBE,
      'wolf': wolfObj,
    },
    {
      // 'basicTexturedLighting': basicTexturedLightingSource,
      'blinnPhong': blinnPhongSource,
    },
    rotation,
  )
}

main()