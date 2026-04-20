import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isItineraryDifficulty, isPlaceCategory } from '../src/domain/tourism.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

function readJson(relPath) {
  const fullPath = path.join(root, relPath)
  const raw = fs.readFileSync(fullPath, 'utf8')
  return JSON.parse(raw)
}

const PLACES = readJson('src/data/places.json')
const ITINERARIES = readJson('src/data/itineraries.json')
const NOTIFICATIONS = readJson('src/data/notifications.json')
const ARTICLES = readJson('src/data/articles.json')
const TIMELINE = readJson('src/data/timeline.json')
const BADGES = readJson('src/data/badges.json')
const PT = readJson('src/i18n/pt.json')
const EN = readJson('src/i18n/en.json')

const HTTP_URL = /^https?:\/\/.+/
const ALLOWED_ZONES = [
  { name: 'Ilha (Stone Town)', lat: -15.0345, lng: 40.734, maxKm: 1.4 },
  { name: 'Ilha (Macuti Sul)', lat: -15.0405, lng: 40.7327, maxKm: 1.1 },
  { name: 'Cabaceira/Mossuril', lat: -15.008, lng: 40.7665, maxKm: 3.8 },
]
const REQUIRED_I18N_KEYS = [
  'pages.map.title',
  'pages.map.found',
  'pages.map.total',
  'pages.map.view_favourites',
  'pages.map.places_suffix',
  'pages.map.quick_view',
  'pages.map.current_filter_count',
  'pages.map.highlights_title',
  'pages.map.highlights_subtitle',
  'pages.map.view_all',
  'pages.map.view_place',
  'pages.map.no_results',
  'pages.routes.stats_routes',
  'pages.routes.stats_stops',
  'pages.routes.stats_avg_duration',
  'pages.routes.highlights_label',
  'pages.routes.mark_done',
  'pages.routes.done',
  'pages.experiences.includes_label',
  'pages.experiences.start_action',
]

function pick(obj, dotPath) {
  return dotPath.split('.').reduce((acc, key) => acc?.[key], obj)
}

function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function pushError(errors, message) {
  errors.push(message)
}

function validateUniqueIds(errors, items, label) {
  const ids = items.map((item) => item.id)
  const set = new Set(ids)
  if (set.size !== ids.length) {
    pushError(errors, `${label}: duplicate ids detected`)
  }
}

function validate() {
  const errors = []

  validateUniqueIds(errors, PLACES, 'PLACES')
  validateUniqueIds(errors, ITINERARIES, 'ITINERARIES')
  validateUniqueIds(errors, NOTIFICATIONS, 'NOTIFICATIONS')
  validateUniqueIds(errors, ARTICLES, 'ARTICLES')
  validateUniqueIds(errors, TIMELINE, 'TIMELINE')
  validateUniqueIds(errors, BADGES, 'BADGES')

  for (const place of PLACES) {
    if (!isPlaceCategory(place.category)) {
      pushError(errors, `${place.id}/${place.name}: invalid category "${place.category}"`)
    }
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) {
      pushError(errors, `${place.id}/${place.name}: invalid lat/lng`)
    }
    if (place.lat < -90 || place.lat > 90 || place.lng < -180 || place.lng > 180) {
      pushError(errors, `${place.id}/${place.name}: lat/lng out of bounds`)
    }
    const nearest = ALLOWED_ZONES.map((zone) => ({
      zone,
      km: distanceKm(zone, { lat: place.lat, lng: place.lng }),
    })).sort((a, b) => a.km - b.km)[0]
    if (nearest.km > nearest.zone.maxKm) {
      pushError(
        errors,
        `${place.id}/${place.name}: ${nearest.km.toFixed(2)}km outside ${nearest.zone.name} (max ${nearest.zone.maxKm}km)`,
      )
    }
    if (!place.name?.trim() || place.name.length < 3 || place.name.length > 80) {
      pushError(errors, `${place.id}: place name length invalid`)
    }
    if (
      !place.description?.trim() ||
      place.description.length < 30 ||
      place.description.length > 260
    ) {
      pushError(errors, `${place.id}/${place.name}: place description length invalid`)
    }
    if (!Array.isArray(place.tags) || place.tags.length < 2) {
      pushError(errors, `${place.id}/${place.name}: place tags invalid`)
    }
    if (!HTTP_URL.test(place.image || '')) {
      pushError(errors, `${place.id}/${place.name}: place image url invalid`)
    }
  }

  const placeIds = new Set(PLACES.map((place) => place.id))
  for (const itinerary of ITINERARIES) {
    if (!isItineraryDifficulty(itinerary.difficulty)) {
      pushError(
        errors,
        `${itinerary.id}/${itinerary.title}: invalid difficulty "${itinerary.difficulty}"`,
      )
    }
    if (!Array.isArray(itinerary.placeIds)) {
      pushError(errors, `${itinerary.id}/${itinerary.title}: placeIds should be array`)
      continue
    }
    if (itinerary.stops !== itinerary.placeIds.length) {
      pushError(errors, `${itinerary.id}/${itinerary.title}: stops should equal placeIds.length`)
    }
    for (const id of itinerary.placeIds) {
      if (!placeIds.has(id)) {
        pushError(errors, `${itinerary.id}/${itinerary.title}: missing place id "${id}"`)
      }
    }
    if (!itinerary.title?.trim() || itinerary.title.length < 5 || itinerary.title.length > 90) {
      pushError(errors, `${itinerary.id}: itinerary title length invalid`)
    }
    if (
      !itinerary.description?.trim() ||
      itinerary.description.length < 20 ||
      itinerary.description.length > 220
    ) {
      pushError(errors, `${itinerary.id}/${itinerary.title}: itinerary description length invalid`)
    }
    if (!/^(\d+)h$/.test(itinerary.duration || '')) {
      pushError(
        errors,
        `${itinerary.id}/${itinerary.title}: itinerary duration should look like 4h`,
      )
    }
    if (!HTTP_URL.test(itinerary.image || '')) {
      pushError(errors, `${itinerary.id}/${itinerary.title}: itinerary image url invalid`)
    }
  }

  for (const article of ARTICLES) {
    if (!article.title?.trim() || article.title.length < 8) {
      pushError(errors, `${article.id}: article title too short`)
    }
    if (!article.excerpt?.trim() || article.excerpt.length < 40) {
      pushError(errors, `${article.id}: article excerpt too short`)
    }
    if (!Array.isArray(article.sections) || article.sections.length < 2) {
      pushError(errors, `${article.id}: article sections invalid`)
    }
    if (!HTTP_URL.test(article.image || '')) {
      pushError(errors, `${article.id}: article image url invalid`)
    }
  }

  for (const key of REQUIRED_I18N_KEYS) {
    if (pick(PT, key) === undefined) {
      pushError(errors, `pt.json missing key: ${key}`)
    }
    if (pick(EN, key) === undefined) {
      pushError(errors, `en.json missing key: ${key}`)
    }
  }

  return errors
}

const errors = validate()
if (errors.length > 0) {
  console.error(`\nData validation failed with ${errors.length} issue(s):`)
  for (const err of errors) {
    console.error(`- ${err}`)
  }
  process.exit(1)
}

console.log('Data validation passed')
