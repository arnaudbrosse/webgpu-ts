export class Quaternion {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  constructor(x: number, y: number, z: number, w: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public set(x: number, y: number, z: number, w: number): Quaternion {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  public rotateX(angle: number): Quaternion {
    const halfAngle = angle * 0.5;
    this.x = Math.sin(halfAngle);
    this.y = 0;
    this.z = 0;
    this.w = Math.cos(halfAngle);
    return this;
  }

  public rotateY(angle: number): Quaternion {
    const halfAngle = angle * 0.5;
    this.x = 0;
    this.y = Math.sin(halfAngle);
    this.z = 0;
    this.w = Math.cos(halfAngle);
    return this;
  }

  public rotateZ(angle: number): Quaternion {
    const halfAngle = angle * 0.5;
    this.x = 0;
    this.y = 0;
    this.z = Math.sin(halfAngle);
    this.w = Math.cos(halfAngle);
    return this;
  }

  public invert(): Quaternion {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  public normalize(): Quaternion {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    this.x /= length;
    this.y /= length;
    this.z /= length;
    this.w /= length;
    return this;
  }

  public multiply(other: Quaternion): Quaternion {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;

    this.x = w * other.x + x * other.w + y * other.z - z * other.y;
    this.y = w * other.y + y * other.w + z * other.x - x * other.z;
    this.z = w * other.z + z * other.w + x * other.y - y * other.x;
    this.w = w * other.w - x * other.x - y * other.y - z * other.z;

    return this;
  }

  public dot(other: Quaternion): number {
    return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
  }

  public fromEuler(x: number, y: number, z: number): Quaternion {
    const halfX = x * 0.5;
    const halfY = y * 0.5;
    const halfZ = z * 0.5;

    const cosX = Math.cos(halfX);
    const sinX = Math.sin(halfX);
    const cosY = Math.cos(halfY);
    const sinY = Math.sin(halfY);
    const cosZ = Math.cos(halfZ);
    const sinZ = Math.sin(halfZ);

    this.x = sinX * cosY * cosZ + cosX * sinY * sinZ;
    this.y = cosX * sinY * cosZ - sinX * cosY * sinZ;
    this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
    this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;

    return this;
  }
}
