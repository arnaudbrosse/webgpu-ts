import { Object3D } from './Object3D.ts';
import { Material } from './Material.ts';
import { Geometry } from './Geometry.ts';

export class Mesh extends Object3D {
  public material: Material;
  public geometry: Geometry;

  constructor(material: Material, geometry: Geometry) {
    super();
    this.material = material;
    this.geometry = geometry;
  }
}
