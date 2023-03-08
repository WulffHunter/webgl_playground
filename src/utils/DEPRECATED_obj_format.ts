// This is not a full .OBJ parser.
// see http://paulbourke.net/dataformats/obj/

export function parseObj(objFile: string) {
  // We start with data in the 0th position because
  // faces in .OBJ files start at 1.
  const objPositions = [[0,0,0]]
  const objTexCoords = [[0,0]]
  const objNormals = [[0,0,0]]

  // Same order as the indicies for the `f` (face) keyword
  const objVertexData = [
    objPositions,
    objTexCoords,
    objNormals,
  ]

  // Same order as the indicies for the `f` (face) keyword
  let webglVertexData: [number[], number[], number[]] = [
    // Positions
    [],
    // Texture Coordinates
    [],
    // Normals
    [],
  ]

  function addVertex(vertexStr: string) {
    // This is a string of the style `number/number/number`
    const position = vertexStr.split('/')

    position.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return
      }

      const objIndex = parseInt(objIndexStr)
      // Either take the index we were given, or make one up from
      // the verticies we already have
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length)
      // Push the data in the given row into 
      webglVertexData[i].push(...objVertexData[i][index])
    })
  }

  const keywordHandlerMap = {
    'v': (parts: string[]) => {
      objPositions.push(parts.map(parseFloat))
    },
    'vn': (parts: string[]) => {
      objNormals.push(parts.map(parseFloat))
    },
    'vt': (parts: string[]) => {
      objTexCoords.push(parts.map(parseFloat))
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

  console.log(objVertexData, webglVertexData)
}