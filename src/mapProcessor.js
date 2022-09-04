const fs = require('fs')

const args = process.argv.slice(2)
if (args.length === 2) {
  doTheThing(args[0], args[1])
} else {
  console.error('what the hell damn guy')
}

function doTheThing (filebase, name) {
  const output = { name, scaleFactor: 0.3 }
  // READ MAP
  try {
    const mapData = fs.readFileSync(`data/maps/${filebase}.txt`, 'utf8')
    const map = processMapData(mapData.split('\n'))
    output.map = map.lines
    output.width = map.width
    output.height = map.height
    output.offsetTop = map.offsetTop
    output.offsetLeft = map.offsetLeft
  } catch (err) {
    console.error('error with layer 0', err)
  }
  // READ LEGEND (points)
  try {
    const legendData = fs.readFileSync(`data/maps/${filebase}_1.txt`, 'utf8')
    const legend = processMapData(legendData.split('\n'))
    output.legend = legend.lines
  } catch (err) {
    console.error('error with layer 1', err)
  }

  // WRITE
  try {
    fs.writeFileSync(`data/maps/${filebase}.js`, `exports.zone = ${JSON.stringify(output)}`, 'utf8')
  } catch (err) {
    console.error(err)
  }
}

function processMapData (rawMapData) {
  const mapData = {
    lines: [],
    width: 0,
    height: 0,
    offsetTop: 0,
    offsetLeft: 0
  }

  let maxX = 0
  let maxY = 0
  let minX = 0
  let minY = 0

  rawMapData.forEach(line => {
    const type = line.charAt(0)
    if (type === 'L') {
      const splitLine = line.slice(2).split(' ').map(ele => parseInt(ele))
      // Y X Z
      const p1 = { x: splitLine[0], y: splitLine[1], z: splitLine[2] }
      const p2 = { x: splitLine[3], y: splitLine[4], z: splitLine[5] }
      // R G B
      const color = { r: splitLine[6], g: splitLine[7], b: splitLine[8] }

      maxX = p1.x > maxX ? p1.x : maxX
      maxX = p2.x > maxX ? p2.x : maxX
      minX = p1.x < minX ? p1.x : minX
      minX = p2.x < minX ? p2.x : minX
      maxY = p1.y > maxY ? p1.y : maxY
      maxY = p2.y > maxY ? p2.y : maxY
      minY = p1.y < minY ? p1.y : minY
      minY = p2.y < minY ? p2.y : minY

      mapData.lines.push({ type, p1, p2, color })
      mapData.lines.sort((a, b) => {
        if (a.p1.x > b.p1.x) {
          return 1
        } else if (a.p1.x > b.p1.x) {
          return -1
        } else {
          return 0
        }
      })
    } else if (type === 'P') {
      // "P 30.8579, 723.1355, -29.264, 255, 0, 0, 3, to_The_Plane_of_Knowledge_(Click_Book)",
      const splitLine = line.slice(2).split(' ')
      const caption = splitLine.pop()
      const fontSize = splitLine.pop()
      const ints = splitLine.map(ele => parseInt(ele))
      const point = { x: ints[0], y: ints[1], z: ints[2] }
      const color = { r: ints[3], g: ints[4], b: ints[5] }
      const p = { type, point, color, caption, fontSize }
      mapData.lines.push(p)
    }
  })
  mapData.offsetTop = Math.abs(minY)
  mapData.offsetLeft = Math.abs(minX)
  mapData.width = Math.abs(maxX) + Math.abs(minX)
  mapData.height = Math.abs(maxY) + Math.abs(minY)
  return mapData
}
