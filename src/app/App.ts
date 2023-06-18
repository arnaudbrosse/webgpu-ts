import { Mesh } from './Mesh.ts';
import { Renderer } from './Renderer.ts';
import { CubeGeometry } from './CubeGeometry.ts';
import { Material } from './Material.ts';

import vertexShader from '../shaders/cube/vertex.wgsl';
import fragmentShader from '../shaders/cube/fragment.wgsl';

export class App {
  private renderer: Renderer;
  private readonly cube: Mesh;

  constructor() {
    this.renderer = new Renderer();

    const geometry = new CubeGeometry(this.renderer.device);
    const material = new Material(this.renderer.device, vertexShader, fragmentShader);
    this.cube = new Mesh(material, geometry);

    this.render();
  }

  private render() {
    this.renderer.render(this.cube);
    requestAnimationFrame(this.render);
  }
}
