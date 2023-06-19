import { Scene } from './Scene.ts';
import { Camera } from './Camera.ts';
import { Mesh } from './Mesh.ts';

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

export class Renderer {
  private readonly canvas: HTMLCanvasElement;
  public device!: GPUDevice;
  private context!: GPUCanvasContext;
  private readonly format: GPUTextureFormat;
  public aspectRatio: number;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.aspectRatio = window.devicePixelRatio || 1;
    this.canvas.width = innerWidth * this.aspectRatio;
    this.canvas.height = innerHeight * this.aspectRatio;
    document.body.appendChild(this.canvas);

    this.device = device!;
    this.context = this.canvas.getContext('webgpu')!;
    this.format = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({ device: this.device, format: this.format });
  }

  public render(scene: Scene, _camera: Camera) {
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
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

      const bindGroup = this.device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: object.material.uniformBuffer } }]
      });

      this.device.queue.writeBuffer(object.material.uniformBuffer, 0, object.material.uniformValues);

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
      pass.setBindGroup(0, bindGroup);
      pass.setVertexBuffer(0, object.geometry.positionBuffer);
      pass.setIndexBuffer(object.geometry.indexBuffer, 'uint16'); // Specify index buffer and format
      pass.drawIndexed(object.geometry.indexCount);
      pass.end();

      this.device.queue.submit([encoder.finish()]);
    });
  }
}
