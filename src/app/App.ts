import vertexShader from '../shaders/vertex.wgsl';
import fragmentShader from '../shaders/fragment.wgsl';

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

export class App {
  private canvas: HTMLCanvasElement;
  private device!: GPUDevice;
  private context!: GPUCanvasContext;
  private format!: GPUTextureFormat;

  constructor(format: GPUTextureFormat = 'bgra8unorm') {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);

    this.device = device!;

    this.context = this.canvas.getContext('webgpu')!;
    this.format = format;
    this.context.configure({ device: this.device, format: this.format });

    const vertexBuffer = this.device.createBuffer({
      size: vertices.length * 4,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
    vertexBuffer.unmap();

    const indexBuffer = this.device.createBuffer({
      size: indices.length * 4,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Uint32Array(indexBuffer.getMappedRange()).set(indices);
    indexBuffer.unmap();

    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: 'uniform'
          }
        }
      ]
    });

    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout]
    });

    const vertexShaderModule = this.device.createShaderModule({
      code: vertexShader
    });
    const fragmentShaderModule = this.device.createShaderModule({
      code: fragmentShader
    });

    // Create the render pipeline
    const pipeline = this.device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: vertexShaderModule,
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: 12,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x3'
              }
            ]
          }
        ]
      },
      fragment: {
        module: fragmentShaderModule,
        entryPoint: 'main',
        targets: [
          {
            format: format
          }
        ]
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'none'
      }
    });

    // Create the command encoder
    const commandEncoder = this.device.createCommandEncoder();

    // Create the bind group
    const bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: vertexBuffer
          }
        }
      ]
    });

    // Begin the render pass
    const textureView = this.context.getCurrentTexture().createView();
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          storeOp: 'store'
        }
      ]
    };
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setIndexBuffer(indexBuffer, 'uint32');
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.drawIndexed(indices.length, 1, 0, 0, 0);
    passEncoder.endPass();

    // Submit the command encoder to the GPU
    const commandBuffer = commandEncoder.finish();
    this.device.queue.submit([commandBuffer]);
  }
}
