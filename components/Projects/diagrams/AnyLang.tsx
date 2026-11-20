/*
 * AnyLang pipeline (restyled from public/projects/anylang-arch.svg into the
 * shared system):
 *   Fish + Scish front ends → Cish → RISC-V AST → 32-bit machine code →
 *   program output. Key idea: the output is verified on a hand-written
 *   RISC-V simulator.
 */

import { ArrowDefs, Edge, Node } from './primitives';

const M = 'al-arrow';

export default function AnyLang() {
  return (
    <svg viewBox="0 0 800 500" role="img" aria-label="AnyLang architecture">
      <title>AnyLang architecture</title>
      <ArrowDefs id={M} />

      {/* two front-end sources */}
      <Node x={24} y={24} w={196} h={72} role="input" label="Fish" sub="imperative" />
      <Node x={300} y={24} w={196} h={72} role="input" label="Scish" sub="functional · closures" />

      {/* Cish middle end */}
      <Node x={300} y={168} w={196} h={72} role="processing" label="Cish" sub="functions, heap, pointers" />

      {/* shared RISC-V AST */}
      <Node x={24} y={312} w={472} h={72} role="storage" label="RISC-V AST" sub="encoded instructions" />

      {/* machine code output */}
      <Node x={576} y={312} w={200} h={72} role="output" label="32-bit machine code" />

      {/* key idea: hand-written simulator verifies the output */}
      <Node x={576} y={408} w={200} h={72} role="key" label="Hand-written simulator" sub="verifies the output" />

      {/* edges */}
      {/* Fish → RISC-V AST (straight down the left) */}
      <Edge d="M122 96 L122 312" markerId={M} />
      {/* Scish → Cish */}
      <Edge d="M398 96 L398 168" markerId={M} />
      {/* Cish → RISC-V AST */}
      <Edge d="M360 240 L300 312" markerId={M} />
      {/* RISC-V AST → machine code */}
      <Edge d="M496 348 L576 348" markerId={M} />
      {/* machine code → simulator (verify) */}
      <Edge d="M676 384 L676 408" markerId={M} />
    </svg>
  );
}
