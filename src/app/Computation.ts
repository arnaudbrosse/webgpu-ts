import computeShader from '../shaders/compute.wgsl';

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

export class Computation {
  private device!: GPUDevice;
  private readonly pipeline: GPUComputePipeline;

  constructor() {
    this.device = device!;

    const module = this.device.createShaderModule({
      code: computeShader
    });

    this.pipeline = this.device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: module,
        entryPoint: 'cs'
      }
    });

    const input = new Float32Array([1, 3, 5]);

    const workBuffer = this.device.createBuffer({
      size: input.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });

    this.device.queue.writeBuffer(workBuffer, 0, input);

    const resultBuffer = this.device.createBuffer({
      size: input.byteLength,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: workBuffer } }]
    });

    const encoder = this.device.createCommandEncoder();

    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(3); // input.byteLength
    pass.end();

    encoder.copyBufferToBuffer(workBuffer, 0, resultBuffer, 0, resultBuffer.size);

    this.device.queue.submit([encoder.finish()]);

    resultBuffer.mapAsync(GPUMapMode.READ).then(() => {
      const result = new Float32Array(resultBuffer.getMappedRange().slice(0));
      resultBuffer.unmap();

      console.log('input', input);
      console.log('result', result);
    });
  }
}
