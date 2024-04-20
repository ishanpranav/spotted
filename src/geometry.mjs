// geometry.mjs

// Calculate geometric Euclidean distance by manix - Github Gist
// https://gist.github.com/manix/7ce097c73728e07178af74cb4c62a341

/**
 * 
 * @param {*} p 
 * @param {*} q 
 * @returns 
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 */
export function haversineDistance(p, q) {
    const radians = Math.PI / 180;
    const a =
        Math.pow(Math.sin((q.latitude - p.latitude) * radians / 2), 2) +
        Math.cos(p.latitude) * radians * Math.cos(q.latitude * radians) *
        Math.pow(Math.sin((q.longitude - p.longitude) * radians / 2), 2);

    return 12742000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
