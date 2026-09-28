package com.connectx.security;

import com.connectx.exception.RateLimitExceededException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class RateLimiterService {

    private final Map<String, ConcurrentLinkedDeque<Long>> requestLogs = new ConcurrentHashMap<>();

    /**
     * Checks rate limit for a given key and action.
     *
     * @param key Identifies client (e.g. IP + endpoint, or email + endpoint)
     * @param maxRequests Maximum allowed requests in window
     * @param windowSeconds Window duration in seconds
     */
    public void checkRateLimit(String key, int maxRequests, long windowSeconds) {
        long now = System.currentTimeMillis();
        long windowStart = now - (windowSeconds * 1000);

        ConcurrentLinkedDeque<Long> timestamps = requestLogs.computeIfAbsent(key, k -> new ConcurrentLinkedDeque<>());

        // Evict expired timestamps
        while (!timestamps.isEmpty() && timestamps.peekFirst() < windowStart) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= maxRequests) {
            throw new RateLimitExceededException("Too many requests. Please try again in a few moments.");
        }

        timestamps.addLast(now);
    }
}
