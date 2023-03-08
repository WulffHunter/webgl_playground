import type { BlinnPhongSetup } from '../types/shaders'
import type { Vector } from '../types/vector'

import { toRotation } from './utils'

export function setUpMouseHandlers(
  canvas: HTMLCanvasElement,
  rotationVectorPtr: Vector,
) {
  const clickStart: Vector = {
    x: 0,
    y: 0,
    z: 0,
  }

  let startRot: Vector | undefined = undefined

  const cancelFn = () => {
    canvas.style.cursor = 'grab'
    startRot = undefined
  }

  canvas.addEventListener('mousedown', e => {
    canvas.style.cursor = 'grabbing'

    clickStart.x = e.clientX
    clickStart.y = e.clientY

    startRot = { ...rotationVectorPtr }
  })

  canvas.addEventListener('mousemove', e => {
    if (startRot) {
      rotationVectorPtr.x = toRotation(startRot.x + (e.clientX - clickStart.x))
      rotationVectorPtr.y = toRotation(startRot.y + (e.clientY - clickStart.y))
    }
  })

  canvas.addEventListener('mouseup', cancelFn)
  canvas.addEventListener('mouseleave', cancelFn)
}

export function setupKeyPressHandlers(
  canvas: HTMLCanvasElement,
  blinnPhongSetup: BlinnPhongSetup,
) {
  window.onkeydown = e => {
    switch (e.key) {
      case 'w':
        blinnPhongSetup.lightPos.z += 1
        break
      case 's':
        blinnPhongSetup.lightPos.z -= 1
        break
      case 'a':
        blinnPhongSetup.lightPos.x += 1
        break
      case 'd':
        blinnPhongSetup.lightPos.x -= 1
        break
      case 'q':
        blinnPhongSetup.lightPos.y += 1
        break
      case 'e':
        blinnPhongSetup.lightPos.y -= 1
        break
      case 'u':
        blinnPhongSetup.lightPower += 1
        break
      case 'i':
        blinnPhongSetup.lightPower -= 1
        break
      default:
        return
    }
  }
}
