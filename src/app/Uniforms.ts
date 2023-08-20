class Uniforms {
  private buffer: GPUBuffer;
  private size: number;
  private data: Float32Array;
  private device: GPUDevice;
  private uniforms: Record<string, Float32Array>;

  constructor(device: GPUDevice, size: number) {
    this.device = device;
    this.size = size;
    this.data = new Float32Array(size);
    this.buffer = device.createBuffer({
      size: this.data.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.uniforms = {};
  }

  private offset(name: string) {
    let offset = 0;
    return (name: string) => {
      const result = offset;
      offset += this.uniforms[name].byteLength;
      return result;
    };
  }

  public set(name: string, value: Float32Array) {
    const offset = this.offset(name);
    this.data.set(value, offset);
  }

  public get(name: string): Float32Array {
    const offset = this.offset(name);
    return this.data.slice(offset, offset + 4);
  }

  public bind(bindGroup: GPUBindGroup, bindingIndex: number) {
    bindGroup.setBuffer(bindingIndex, this.buffer);
  }
}
