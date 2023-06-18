import { Material } from './Material.ts';
import { Geometry } from './Geometry.ts';

export class Object3D {
  public material: Material;
  public geometry: Geometry;

  constructor(material: Material, geometry: Geometry) {
    this.material = material;
    this.geometry = geometry;
  }
}
