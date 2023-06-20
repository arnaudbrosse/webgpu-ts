import { Vector3 } from '../math/Vector3.ts';
import { Matrix4 } from '../math/Matrix4.ts';
import { Quaternion } from '../math/Quaternion.ts';

export class Object3D {
  protected matrix: Matrix4;
  protected matrixWorld: Matrix4;
  protected position: Vector3;
  protected rotation: Vector3;
  protected scale: Vector3;
  protected quaternion: Quaternion;
  protected up: Vector3;

  constructor() {
    this.matrix = new Matrix4();
    this.matrixWorld = new Matrix4();

    this.position = new Vector3(0, 0, 0);
    this.rotation = new Vector3(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
    this.quaternion = new Quaternion(0, 0, 0, 1);
    this.up = new Vector3(0, 1, 0);
  }

  public applyMatrix(matrix: Matrix4): void {
    this.matrix.multiply(matrix);
  }

  public applyQuaternion(quaternion: Quaternion): void {
    this.quaternion.multiply(quaternion);
  }

  public translate(x: number, y: number, z: number): void {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
  }

  public rotate(x: number, y: number, z: number): void {
    this.rotation.x += x;
    this.rotation.y += y;
    this.rotation.z += z;
  }

  public lookAt(target: Vector3): void {
    this.matrix = Matrix4.lookAt(this.position, target, this.up);
  }
}
