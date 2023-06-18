export class Camera {
  private near: number;
  private far: number;
  private fov: number;
  private aspect: number;
  private projectionMatrix: Float32Array;
  private viewMatrix: Float32Array;
  private position: Float32Array;
  private target: Float32Array;
  private up: Float32Array;

  constructor(near: number, far: number, fov: number, aspect: number) {
    this.near = near;
    this.far = far;
    this.fov = fov;
    this.aspect = aspect;

    this.projectionMatrix = new Float32Array(16);
    this.viewMatrix = new Float32Array(16);
    this.position = new Float32Array(3);
    this.target = new Float32Array(3);
    this.up = new Float32Array([0, 1, 0]);
  }
}
