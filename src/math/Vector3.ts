export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  dot(b: Vector3): number {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  }

  cross(b: Vector3): Vector3 {
    const x = this.y * b.z - this.z * b.y;
    const y = this.z * b.x - this.x * b.z;
    const z = this.x * b.y - this.y * b.x;
    return new Vector3(x, y, z);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vector3 {
    const magnitude = this.magnitude();
    return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
  }

  add(vector: Vector3): Vector3 {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  subtract(vector: Vector3): Vector3 {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divide(scalar: number): Vector3 {
    if (scalar !== 0) {
      return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    } else {
      throw new Error('Cannot divide by zero.');
    }
  }
}
