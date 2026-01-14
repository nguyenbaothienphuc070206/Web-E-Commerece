type CacheEntry<V> = {
  value: V
  expiresAt: number
}

export class TTLCache<K, V> {
  private store = new Map<K, CacheEntry<V>>()

  constructor(private readonly ttlMs: number, private readonly maxSize = 500) {}

  get(key: K): V | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key: K, value: V) {
    if (this.store.size >= this.maxSize) {
      // Drop oldest entry (Map preserves insertion order)
      const oldestKey = this.store.keys().next().value as K | undefined
      if (oldestKey !== undefined) this.store.delete(oldestKey)
    }
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs })
  }

  delete(key: K) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}
