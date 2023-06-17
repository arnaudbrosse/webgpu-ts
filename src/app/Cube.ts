import vertexShader from '../shaders/cube/vertex.wgsl';
import fragmentShader from '../shaders/cube/fragment.wgsl';

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

export class Cube {
  private canvas: HTMLCanvasElement;
  private device!: GPUDevice;
  private context!: GPUCanvasContext;
  private format: GPUTextureFormat;
  private pipeline: GPURenderPipeline;
  private vertexBuffer: GPUBuffer;

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
        entryPoint: 'vs',
        buffers: [{ arrayStride: 4 * 4, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x4' }] }]
      },
      fragment: {
        module: module,
        entryPoint: 'fs',
        targets: [{ format: this.format }]
      },
      primitive: {
        topology: 'triangle-list'
      }
    });

    const vertexData = new Float32Array([-0.5, 0.5, 0.5, 1.0, -0.5, -0.5, 0.5, 1.0, 0.5, -0.5, 0.5, 1.0, -0.5, 0.5, 0.5, 1.0, 0.5, -0.5, 0.5, 1.0, 0.5, 0.5, 0.5, 1.0]);

    this.vertexBuffer = this.device?.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });

    new Float32Array(this.vertexBuffer!.getMappedRange()).set(vertexData);
    this.vertexBuffer!.unmap();
  }

  public render() {
    const encoder = this.device.createCommandEncoder();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    };

    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.draw(6, 1, 0, 0);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
