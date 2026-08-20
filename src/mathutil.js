export default class MathUtil{
    static crossProduct(out, vector1, vector2) {
        out.x = vector1.y * vector2.z - vector1.z * vector2.y;
        out.y = vector1.z * vector2.x - vector1.x * vector2.z;
        out.z = vector1.x * vector2.y - vector1.y * vector2.x;
    }

    static normalize(out) {
        var length = out.x * out.x + out.y * out.y + out.z * out.z;
        if (length > 0) length = 1 / Math.sqrt(length);
        out.x *= length;
        out.y *= length;
        out.z *= length;
    }

    static bresenham(x, y, ex, ey, maxLength) {
        const points = [];
        const dx = Math.abs(ex - x);
        const dy = Math.abs(ey - y);
        const sx = Math.sign(ex - x);
        const sy = Math.sign(ey - y);
        let err = dx - dy;

        for (let i = 0; i < maxLength; i++) {
            points.push({ x, y });
            if (x === ex && y === ey) break;

            const e = 2 * err;
            if (e > -dy) err -= dy, x += sx;
            if (e < dx) err += dx, y += sy;
        }

        return points;
    }

    // Generate a random number between min and max;
    static getRandom(min, max){
        return Math.random() * (max - min) + min
    }
}