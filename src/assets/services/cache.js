const CACHE_PREFIX = 'weather_cache:';
const inMemoryCache = new Map();

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    // localStorage may be unavailable in some environments
  }
  return null;
}

function buildCacheKey(key) {
  return `${CACHE_PREFIX}${key}`;
}

function saveCache(key, value, ttlMinutes = 15) {
  const payload = {
    data: value,
    expiresAt: Date.now() + ttlMinutes * 60_000,
    storedAt: Date.now(),
  };

  const storage = getStorage();
  const serialized = JSON.stringify(payload);

  if (storage) {
    try {
      storage.setItem(buildCacheKey(key), serialized);
      return;
    } catch (error) {
      // Fallback to memory cache if localStorage is full or unavailable
    }
  }

  inMemoryCache.set(buildCacheKey(key), payload);
}

function loadCache(key) {
  const cacheKey = buildCacheKey(key);
  const storage = getStorage();
  let payload = null;

  if (storage) {
    try {
      const item = storage.getItem(cacheKey);
      if (item) {
        payload = JSON.parse(item);
      }
    } catch (error) {
      storage.removeItem(cacheKey);
    }
  }

  if (!payload) {
    payload = inMemoryCache.get(cacheKey) || null;
  }

  if (!payload) {
    return null;
  }

  if (typeof payload.expiresAt !== 'number' || Date.now() > payload.expiresAt) {
    removeCache(key);
    return null;
  }

  return payload.data;
}

function removeCache(key) {
  const cacheKey = buildCacheKey(key);
  const storage = getStorage();

  if (storage) {
    try {
      storage.removeItem(cacheKey);
    } catch (error) {
      // ignore remove failure
    }
  }

  inMemoryCache.delete(cacheKey);
}

function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

async function fetchWithCache(key, fetcher, ttlMinutes = 15) {
  const cachedData = loadCache(key);

  if (!isOnline()) {
    if (cachedData) {
      return cachedData;
    }
    throw new Error('Offline e sem dados em cache disponíveis');
  }

  try {
    const freshData = await fetcher();
    saveCache(key, freshData, ttlMinutes);
    return freshData;
  } catch (error) {
    if (cachedData) {
      return cachedData;
    }
    throw error;
  }
}

export { saveCache, loadCache, removeCache, fetchWithCache, isOnline };
