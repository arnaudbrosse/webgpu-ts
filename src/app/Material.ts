export class Material {
  vertexShaderModule: GPUShaderModule;
  fragmentShaderModule: GPUShaderModule;

  constructor(device: GPUDevice, vertexShader: string, fragmentShader: string) {
    this.vertexShaderModule = device.createShaderModule({
      code: vertexShader
    });
    this.fragmentShaderModule = device.createShaderModule({
      code: fragmentShader
    });
  }
}
