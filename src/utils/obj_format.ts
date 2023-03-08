// This is not a full .OBJ parser.
// see http://paulbourke.net/dataformats/obj/

import { Model } from '../types/model'

export function parseObj(objFile: string) {
  const model: Model = {
    vertexPositions: [],
    textureCoordinates: [],
    vertexNormals: [],
    triangleIndicies: [],
  }

  // .OBJ files are 1-indexed (instead of 0-indexed).
  // Insert garbage data to fill the 0th indexes
  model.vertexPositions.push(0, 0, 0)
  model.textureCoordinates.push(0, 0)
  model.vertexNormals.push(0, 0, 0)

  function addVertex(vertexStr: string) {
    // This is a string of the style `number/number/number`
    const position = vertexStr.split('/').map(parseInt)

    model.triangleIndicies.push(position[0])
  }

  const keywordHandlerMap = {
    'v': (parts: string[]) => {
      model.vertexPositions.push(...parts.map(parseFloat))
    },
    'vn': (parts: string[]) => {
      model.vertexNormals.push(...parts.map(parseFloat))
    },
    'vt': (parts: string[]) => {
      model.textureCoordinates.push(...parts.map(parseFloat))
    },
    'f': (parts: string[]) => {
      const numTriangles = parts.length - 2

      for (let triangle = 0; triangle < numTriangles; triangle++) {
        addVertex(parts[0])
        addVertex(parts[triangle + 1])
        addVertex(parts[triangle + 2])
      }
    },
  }

  const keywordRegex = /(\w*)(?: )*(.*)/

  const lines = objFile.split('\n')

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo].trim()

    if (line === '' || line.startsWith('#')) {
      continue
    }

    const regexMatch = keywordRegex.exec(line)

    if (!regexMatch) {
      continue
    }

    const [ _, keyword, unparsedArgs ] = regexMatch

    const parts = line.split(/\s+/).slice(1)
    const handler = keywordHandlerMap[keyword]

    if (!handler) {
      console.warn(`[OBJ Parser] Unhandled keyword: ${keyword} at line ${lineNo + 1}`)
      continue
    }

    handler(parts, unparsedArgs.split(' '))
  }

  console.log(model)

  return model
}