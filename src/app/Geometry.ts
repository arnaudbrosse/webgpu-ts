export class Geometry {
  public positionBuffer: GPUBuffer;
  public indexBuffer: GPUBuffer;
  public indexCount: number;

  constructor(device: GPUDevice, positions: Float32Array, indices: Uint16Array) {
    this.positionBuffer = device.createBuffer({
      size: positions.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });

    new Float32Array(this.positionBuffer.getMappedRange()).set(positions);
    this.positionBuffer.unmap();

    this.indexBuffer = device.createBuffer({
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX,
      mappedAtCreation: true
    });

    new Uint16Array(this.indexBuffer.getMappedRange()).set(indices);
    this.indexBuffer.unmap();

    this.indexCount = indices.length;
  }
}
