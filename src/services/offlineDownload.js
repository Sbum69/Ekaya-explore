import { PLACES, ITINERARIES } from './data'

const ISLAND_BOUNDS = {
  north: -15.01,
  south: -15.05,
  east: 40.745,
  west: 40.7,
}

const ZOOMS = [12, 13, 14, 15, 16]
const TILE_HOST = 'https://tile.openstreetmap.org'

function lonToTileX(lon, z) {
  return Math.floor(((lon + 180) / 360) * 2 ** z)
}

function latToTileY(lat, z) {
  const rad = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** z)
}

function collectTileUrls() {
  const urls = []
  for (const z of ZOOMS) {
    const xMin = lonToTileX(ISLAND_BOUNDS.west, z)
    const xMax = lonToTileX(ISLAND_BOUNDS.east, z)
    const yMin = latToTileY(ISLAND_BOUNDS.north, z)
    const yMax = latToTileY(ISLAND_BOUNDS.south, z)
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        urls.push(`${TILE_HOST}/${z}/${x}/${y}.png`)
      }
    }
  }
  return urls
}

function collectImageUrls() {
  const urls = new Set()
  for (const p of PLACES) if (p.image) urls.add(p.image)
  for (const i of ITINERARIES) if (i.image) urls.add(i.image)
  return [...urls]
}

export function estimateDownloadSize() {
  return collectTileUrls().length + collectImageUrls().length
}

async function fetchAll(urls, concurrency, onEach, signal) {
  let cursor = 0
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < urls.length) {
      if (signal?.aborted) return
      const i = cursor++
      try {
        await fetch(urls[i], { mode: 'no-cors', cache: 'reload', signal })
      } catch {
        // tile/image may fail individually — keep going
      }
      onEach()
    }
  })
  await Promise.all(workers)
}

export async function downloadOfflineBundle({ onProgress, signal } = {}) {
  const tiles = collectTileUrls()
  const images = collectImageUrls()
  const total = tiles.length + images.length
  let done = 0
  const tick = () => {
    done++
    onProgress?.({ done, total })
  }
  onProgress?.({ done: 0, total })
  await fetchAll(images, 4, tick, signal)
  await fetchAll(tiles, 6, tick, signal)
  return { done, total, aborted: signal?.aborted === true }
}
