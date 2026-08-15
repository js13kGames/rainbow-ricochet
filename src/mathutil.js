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
}