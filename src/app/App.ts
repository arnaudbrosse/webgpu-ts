import { Cube } from './Cube.ts';

export class App {
  private cube: Cube;

  constructor() {
    this.cube = new Cube();

    this.render();
  }

  private render() {
    this.cube.render();
    requestAnimationFrame(this.render);
  }
}
