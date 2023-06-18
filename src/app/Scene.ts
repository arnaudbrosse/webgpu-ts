import { Object3D } from './Object3D.ts';

export class Scene {
  public objects: Object3D[];

  constructor() {
    this.objects = [];
  }

  public add(object: Object3D) {
    this.objects.push(object);
  }

  public remove(object: Object3D) {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }
  }

  public traverse(callback: (object: Object3D) => void) {
    this.objects.forEach((object) => {
      callback(object);
    });
  }
}
