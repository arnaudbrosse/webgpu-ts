import vertexShader from '../shaders/vertex.wgsl';
import fragmentShader from '../shaders/fragment.wgsl';

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

export class Triangle {
  private canvas: HTMLCanvasElement;
  private device!: GPUDevice;
  private context!: GPUCanvasContext;
  private format: GPUTextureFormat;
  private pipeline: GPURenderPipeline;
  private renderPassDescriptor!: GPURenderPassDescriptor;

  constructor() {
    this.canvas = document.createElement('canvas');
    const devicePixelRatio = window.devicePixelRatio || 1;
    this.canvas.width = innerWidth * devicePixelRatio;
    this.canvas.height = innerHeight * devicePixelRatio;
    document.body.appendChild(this.canvas);

    this.device = device!;
    this.context = this.canvas.getContext('webgpu')!;
    this.format = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({ device: this.device, format: this.format });

    const module = this.device.createShaderModule({
      code: vertexShader + fragmentShader
    });

    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: module,
        entryPoint: 'vs'
      },
      fragment: {
        module: module,
        entryPoint: 'fs',
        targets: [{ format: this.format }]
      }
    });

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    };

    this.render();
  }

  public render() {
    const encoder = this.device.createCommandEncoder();

    const pass = encoder.beginRenderPass(this.renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    pass.draw(3);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
