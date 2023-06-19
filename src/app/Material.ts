export type Uniforms = Record<string, any>;

export class Material {
  public vertexShaderModule: GPUShaderModule;
  public fragmentShaderModule: GPUShaderModule;
  public uniforms: Uniforms;
  public uniformBuffer: GPUBuffer;
  public uniformValues: Float32Array;

  constructor(device: GPUDevice, vertexShader: string, fragmentShader: string, uniforms: Uniforms = {}) {
    this.uniforms = uniforms;
    const bufferSize = Object.values(uniforms).reduce((acc, curr) => acc + curr.byteLength, 0);

    this.uniformBuffer = device.createBuffer({
      size: Math.max(16, bufferSize),
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this.uniformValues = new Float32Array(bufferSize / 4);
    Object.values(uniforms).forEach((uniform, index) => {
      this.uniformValues.set(uniform, index * 4);
    });

    this.vertexShaderModule = device.createShaderModule({
      code: vertexShader
    });

    this.fragmentShaderModule = device.createShaderModule({
      code: fragmentShader
    });
  }
}
