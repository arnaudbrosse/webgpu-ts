import { Material } from './Material.ts';

export interface Object3D {
  vertexBuffer: GPUBuffer;
  material: Material;
}
