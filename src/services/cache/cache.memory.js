const cache = new Map()

async function get(key) {
  return await cache.get(key)
}

function set(key, value, ttl = 60) {
  cache.set(key, value)
  setTimeout(() => cache.delete(key), ttl * 1000)
}

function clear(key) {
  cache.delete(key)
}

export { get, set, clear }
