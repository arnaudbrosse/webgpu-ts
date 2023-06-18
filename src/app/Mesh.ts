import { Object3D } from './Object3D.ts';
import { Material } from './Material.ts';
import { Geometry } from './Geometry.ts';

export class Mesh extends Object3D {
  constructor(material: Material, geometry: Geometry) {
    super(material, geometry);
  }
}
