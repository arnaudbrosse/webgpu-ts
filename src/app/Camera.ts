import { Matrix4 } from '../math/Matrix4.ts';
import { Object3D } from './Object3D.ts';

export class Camera extends Object3D {
  public near: number;
  public far: number;
  public fov: number;
  public aspect: number;
  public projectionMatrix: Matrix4;

  constructor(near: number, far: number, fov: number, aspect: number) {
    super();

    this.near = near;
    this.far = far;
    this.fov = fov;
    this.aspect = aspect;

    this.projectionMatrix = Matrix4.perspective(fov * (Math.PI / 180), aspect, near, far);
  }
}
