import { Object3D } from './Object3D.ts';
import { Material } from './Material.ts';

import vertexShader from '../shaders/cube/vertex.wgsl';
import fragmentShader from '../shaders/cube/fragment.wgsl';

export class Cube implements Object3D {
  public vertexBuffer: GPUBuffer;
  public material: Material;

  constructor(device: GPUDevice) {
    const vertexData = new Float32Array([-0.5, 0.5, 0.5, 1.0, -0.5, -0.5, 0.5, 1.0, 0.5, -0.5, 0.5, 1.0, -0.5, 0.5, 0.5, 1.0, 0.5, -0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 1.0]);

    this.vertexBuffer = device.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });

    new Float32Array(this.vertexBuffer!.getMappedRange()).set(vertexData);
    this.vertexBuffer!.unmap();

    this.material = new Material(device, vertexShader, fragmentShader);
  }
}
