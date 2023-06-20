export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public set(x: number, y: number, z: number): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public add(vector: Vector3): Vector3 {
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
  }

  public subtract(vector: Vector3): Vector3 {
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
  }

  public multiply(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  public divide(scalar: number): Vector3 {
    if (scalar !== 0) {
      return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    } else {
      throw new Error('Cannot divide by zero.');
    }
  }

  public dot(b: Vector3): number {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  }

  public cross(b: Vector3): Vector3 {
    const x = this.y * b.z - this.z * b.y;
    const y = this.z * b.x - this.x * b.z;
    const z = this.x * b.y - this.y * b.x;
    return new Vector3(x, y, z);
  }

  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public normalize(): Vector3 {
    const magnitude = this.magnitude();
    return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
  }
}
