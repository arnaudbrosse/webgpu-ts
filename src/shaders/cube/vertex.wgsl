struct VertexInput {
	@location(0) position: vec4f,
};

struct VertexOutput  {
	@builtin(position) position: vec4f,
};

@vertex
fn vs(input: VertexInput) -> VertexOutput {
	var output: VertexOutput;
	output.position = input.position;
	return output;
}