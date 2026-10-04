var TimeLimitedCache = function() {
    this.cache = new Map();
};

// Store or replace a value and schedule its expiration.
TimeLimitedCache.prototype.set = function(key, value, duration) {
    const now = Date.now();
    const existing = this.cache.get(key);

    const alreadyExists =
        existing !== undefined && existing.expiresAt > now;

    if (existing !== undefined) {
        clearTimeout(existing.timer);
    }

    const timer = setTimeout(() => {
        const current = this.cache.get(key);

        // Delete only if this is still the same entry.
        if (current && current.expiresAt <= Date.now()) {
            this.cache.delete(key);
        }
    }, duration);

    this.cache.set(key, {
        value,
        expiresAt: now + duration,
        timer
    });

    return alreadyExists;
};

// Return the value if the key is still active.
TimeLimitedCache.prototype.get = function(key) {
    const entry = this.cache.get(key);

    if (!entry || entry.expiresAt <= Date.now()) {
        if (entry) {
            clearTimeout(entry.timer);
            this.cache.delete(key);
        }
        return -1;
    }

    return entry.value;
};

// Remove expired entries and return the active count.
TimeLimitedCache.prototype.count = function() {
    const now = Date.now();

    for (const [key, entry] of this.cache) {
        if (entry.expiresAt <= now) {
            clearTimeout(entry.timer);
            this.cache.delete(key);
        }
    }

    return this.cache.size;
};