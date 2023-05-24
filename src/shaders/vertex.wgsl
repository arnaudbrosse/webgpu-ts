[[block]] struct Uniforms {
    modelViewProjectionMatrix : mat4x4<f32>;
};

[[group(0), binding(0)]] var<uniform> uniforms: Uniforms;

struct VertexOutput {
    [[builtin(position)]] Position : vec4<f32>;
};

[[stage(vertex)]]
fn main([[location(0)]] position: vec3<f32>) -> VertexOutput {
    var output: VertexOutput;
    output.Position = uniforms.modelViewProjectionMatrix * vec4<f32>(position, 1.0);
    return output;
}