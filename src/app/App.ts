import { Cube } from './Cube.ts';
import { Renderer } from './Renderer.ts';

export class App {
  private renderer: Renderer;
  private readonly cube: Cube;

  constructor() {
    this.renderer = new Renderer();
    this.cube = new Cube(this.renderer.device);

    this.render();
  }

  private render() {
    this.renderer.render(this.cube);
    requestAnimationFrame(this.render);
  }
}
