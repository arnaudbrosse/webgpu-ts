import { Object3D } from './Object3D.ts';

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

export class Renderer {
  private canvas: HTMLCanvasElement;
  public device!: GPUDevice;
  private context!: GPUCanvasContext;
  private format: GPUTextureFormat;

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
  }

  public render(object: Object3D) {
    const pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: object.material.vertexShaderModule,
        entryPoint: 'vs',
        buffers: [{ arrayStride: 3 * 4, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] }]
      },
      fragment: {
        module: object.material.fragmentShaderModule,
        entryPoint: 'fs',
        targets: [{ format: this.format }]
      },
      primitive: {
        topology: 'triangle-list'
        // cullMode: 'back'
      }
    });

    const encoder = this.device.createCommandEncoder();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    };

    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, object.geometry.positionBuffer);
    pass.setIndexBuffer(object.geometry.indexBuffer, 'uint16'); // Specify index buffer and format
    pass.drawIndexed(object.geometry.indexCount);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
