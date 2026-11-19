/*
 * MiniTensorCompiler pipeline (from the repo README):
 *   TensorScript source → ts.* dialect (IR) → optimization passes →
 *   Linalg on tensors → LLVM IR / JIT. Key idea: operator fusion
 *   (matmul+relu → fused op) drops intermediate tensor allocations.
 */

import { ArrowDefs, Edge, Node } from './primitives';

const M = 'mtc-arrow';

export default function MiniTensorCompiler() {
  return (
    <svg viewBox="0 0 800 500" role="img" aria-label="MiniTensorCompiler architecture">
      <title>MiniTensorCompiler architecture</title>
      <ArrowDefs id={M} />

      {/* top row: source → ts.* dialect IR */}
      <Node x={24} y={40} w={212} h={76} role="input" label="TensorScript" sub="typed tensor source" />
      <Node x={300} y={40} w={200} h={76} role="storage" label="ts.* dialect" sub="high-level IR" />

      {/* key idea: the fusion / optimisation pass */}
      <Node x={564} y={40} w={212} h={76} role="key-lava" label="Optimization passes" sub="fuse · fold · shape-check" />

      {/* middle: linalg */}
      <Node x={564} y={212} w={212} h={76} role="storage" label="Linalg on tensors" sub="loops, bufferized" />

      {/* bottom: LLVM IR output + JIT */}
      <Node x={300} y={384} w={200} h={76} role="output" label="LLVM IR" sub="native codegen" />
      <Node x={564} y={384} w={212} h={76} role="output" label="JIT execute" sub="ExecutionEngine" />

      {/* edges */}
      <Edge d="M236 78 L300 78" markerId={M} />
      <Edge d="M500 78 L564 78" markerId={M} />
      {/* passes → linalg */}
      <Edge d="M670 116 L670 212" markerId={M} />
      {/* linalg → llvm ir */}
      <Edge d="M564 250 L400 250 L400 384" markerId={M} />
      {/* llvm ir → jit */}
      <Edge d="M500 422 L564 422" markerId={M} />
    </svg>
  );
}
