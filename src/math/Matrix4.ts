import { Vector3 } from './Vector3.ts';

export class Matrix4 {
  elements: number[];

  constructor() {
    this.elements = new Array(16).fill(0);
  }

  static identity(): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements[0] = 1;
    matrix.elements[5] = 1;
    matrix.elements[10] = 1;
    matrix.elements[15] = 1;
    return matrix;
  }

  static translation(x: number, y: number, z: number): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements[0] = 1;
    matrix.elements[5] = 1;
    matrix.elements[10] = 1;
    matrix.elements[12] = x;
    matrix.elements[13] = y;
    matrix.elements[14] = z;
    matrix.elements[15] = 1;
    return matrix;
  }

  static rotationX(angle: number): Matrix4 {
    const matrix = new Matrix4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    matrix.elements[0] = 1;
    matrix.elements[5] = cos;
    matrix.elements[6] = sin;
    matrix.elements[9] = -sin;
    matrix.elements[10] = cos;
    matrix.elements[15] = 1;
    return matrix;
  }

  static rotationY(angle: number): Matrix4 {
    const matrix = new Matrix4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    matrix.elements[0] = cos;
    matrix.elements[2] = -sin;
    matrix.elements[5] = 1;
    matrix.elements[8] = sin;
    matrix.elements[10] = cos;
    matrix.elements[15] = 1;
    return matrix;
  }

  static rotationZ(angle: number): Matrix4 {
    const matrix = new Matrix4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    matrix.elements[0] = cos;
    matrix.elements[1] = sin;
    matrix.elements[4] = -sin;
    matrix.elements[5] = cos;
    matrix.elements[10] = 1;
    matrix.elements[15] = 1;
    return matrix;
  }

  static scale(x: number, y: number, z: number): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements[0] = x;
    matrix.elements[5] = y;
    matrix.elements[10] = z;
    matrix.elements[15] = 1;
    return matrix;
  }

  static lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4 {
    const matrix = new Matrix4();

    const zAxis = eye.subtract(target).normalize();
    const xAxis = up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis).normalize();

    matrix.elements[0] = xAxis.x;
    matrix.elements[1] = yAxis.x;
    matrix.elements[2] = zAxis.x;
    matrix.elements[3] = 0;
    matrix.elements[4] = xAxis.y;
    matrix.elements[5] = yAxis.y;
    matrix.elements[6] = zAxis.y;
    matrix.elements[7] = 0;
    matrix.elements[8] = xAxis.z;
    matrix.elements[9] = yAxis.z;
    matrix.elements[10] = zAxis.z;
    matrix.elements[11] = 0;
    matrix.elements[12] = -xAxis.dot(eye);
    matrix.elements[13] = -yAxis.dot(eye);
    matrix.elements[14] = -zAxis.dot(eye);
    matrix.elements[15] = 1;

    return matrix;
  }

  multiply(matrix: Matrix4): Matrix4 {
    const result = new Matrix4();
    const a = this.elements;
    const b = matrix.elements;
    const out = result.elements;

    const a11 = a[0],
      a12 = a[1],
      a13 = a[2],
      a14 = a[3],
      a21 = a[4],
      a22 = a[5],
      a23 = a[6],
      a24 = a[7],
      a31 = a[8],
      a32 = a[9],
      a33 = a[10],
      a34 = a[11],
      a41 = a[12],
      a42 = a[13],
      a43 = a[14],
      a44 = a[15];

    const b11 = b[0],
      b12 = b[1],
      b13 = b[2],
      b14 = b[3],
      b21 = b[4],
      b22 = b[5],
      b23 = b[6],
      b24 = b[7],
      b31 = b[8],
      b32 = b[9],
      b33 = b[10],
      b34 = b[11],
      b41 = b[12],
      b42 = b[13],
      b43 = b[14],
      b44 = b[15];

    out[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    out[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    out[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    out[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    out[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    out[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    out[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    out[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    out[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    out[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    out[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    out[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    out[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    out[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    out[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    out[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return result;
  }

  transpose(): Matrix4 {
    const matrix = new Matrix4();

    const a = this.elements;
    const out = matrix.elements;

    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];

    return matrix;
  }

  static perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
    const matrix = new Matrix4();

    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    matrix.elements[0] = f / aspect;
    matrix.elements[5] = f;
    matrix.elements[10] = (far + near) * nf;
    matrix.elements[11] = -1;
    matrix.elements[14] = 2 * far * near * nf;
    matrix.elements[15] = 0;

    return matrix;
  }

  inverse(): Matrix4 {
    const matrix = new Matrix4();

    const a = this.elements;
    const out = matrix.elements;

    const a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    const a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
    const a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det === 0) {
      throw new Error('Matrix is not invertible.');
    }

    const invDet = 1 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    out[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    out[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    out[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    out[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    out[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    out[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    out[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    out[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return matrix;
  }
}
