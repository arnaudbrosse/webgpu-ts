import { Mesh } from './Mesh.ts';
import { Renderer } from './Renderer.ts';
import { CubeGeometry } from './CubeGeometry.ts';
import { Material } from './Material.ts';
import { Scene } from './Scene.ts';
import { Camera } from './Camera.ts';

import vertexShader from '../shaders/cube/vertex.wgsl';
import fragmentShader from '../shaders/cube/fragment.wgsl';

export class App {
  private renderer: Renderer;
  private readonly scene: Scene;
  private readonly camera: Camera;

  constructor() {
    this.renderer = new Renderer();
    this.scene = new Scene();
    this.camera = new Camera(0.1, 100, 45, this.renderer.aspectRatio);

    const geometry = new CubeGeometry(this.renderer.device);
    const material = new Material(this.renderer.device, vertexShader, fragmentShader);
    const cube = new Mesh(material, geometry);

    this.scene.add(cube);

    this.render();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  }
}
