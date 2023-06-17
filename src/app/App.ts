import { Vector3 } from '../math/Vector3.ts';
import { Matrix4 } from '../math/Matrix4.ts';

import vertexShader from '../shaders/cube/vertex.wgsl';
import fragmentShader from '../shaders/cube/fragment.wgsl';

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

export class App {
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

    // Buffer
    const positions = new Float32Array([
      1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1,
      1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1
    ]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]);

    const positionBuffer = this.device.createBuffer({
      size: positions.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true
    });
    new Float32Array(positionBuffer.getMappedRange()).set(positions);
    positionBuffer.unmap();

    const indexBuffer = this.device.createBuffer({
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX,
      mappedAtCreation: true
    });
    new Uint16Array(indexBuffer.getMappedRange()).set(indices);
    indexBuffer.unmap();

    // Material
    const module = this.device.createShaderModule({
      code: vertexShader + fragmentShader
    });

    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: module,
        entryPoint: 'vs',
        buffers: [
          {
            arrayStride: 3 * 4, // 3 floats, 4 bytes each
            attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }]
          }
        ]
      },
      fragment: {
        module: module,
        entryPoint: 'fs',
        targets: [{ format: this.format }]
      }
    });

    const uniformBuffer = this.device.createBuffer({
      size: positions.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const ubindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
            offset: 0,
            size: positionBuffer
          }
        },
        {
          binding: 1,
          resource: sampler
        },
        {
          binding: 2,
          resource: cubemapTexture.createView({
            dimension: 'cube'
          })
        }
      ]
    });

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    };

    // Camera
    const aspect = this.canvas.width / this.canvas.height;
    const projectionMatrix = mat4.perspective((2 * Math.PI) / 5, aspect, 1, 3000);

    const modelMatrix = mat4.scaling(vec3.fromValues(1000, 1000, 1000));
    const modelViewProjectionMatrix = mat4.create() as Float32Array;
    const viewMatrix = mat4.identity();

    const tmpMat4 = mat4.create();

    requestAnimationFrame(this.render);
  }

  private updateTransformationMatrix() {
    const now = Date.now() / 800;

    mat4.rotate(viewMatrix, vec3.fromValues(1, 0, 0), (Math.PI / 10) * Math.sin(now), tmpMat4);
    mat4.rotate(tmpMat4, vec3.fromValues(0, 1, 0), now * 0.2, tmpMat4);

    mat4.multiply(tmpMat4, modelMatrix, modelViewProjectionMatrix);
    mat4.multiply(projectionMatrix, modelViewProjectionMatrix, modelViewProjectionMatrix);
  }

  public render() {
    this.updateTransformationMatrix();

    this.device.queue.writeBuffer(uniformBuffer, 0, modelViewProjectionMatrix.buffer, modelViewProjectionMatrix.byteOffset, modelViewProjectionMatrix.byteLength);

    // this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();

    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginRenderPass(this.renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    pass.setVertexBuffer(0, positionBuffer);
    pass.setIndexBuffer(indicesBuffer, 'uint16');
    pass.setBindGroup(0, bindGroup);
    pass.drawIndexed(indices.length);
    pass.end();

    this.device.queue.submit([encoder.finish()]);

    requestAnimationFrame(this.render);
  }
}
