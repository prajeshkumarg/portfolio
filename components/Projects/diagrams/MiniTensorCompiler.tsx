/*
 * MiniTensorCompiler — the full MLIR lowering stack from the repo README,
 * drawn as a dense progressive-lowering architecture (not a four-box row):
 *
 *   TensorScript source
 *     │ recursive-descent parser (direct MLIR emission, no AST)
 *   ts.* dialect  [ts.matmul · ts.add · ts.relu · ts.transpose]
 *     │ optimization passes:  shape inference · constant folding · operator fusion
 *   Linalg on tensors  [linalg.matmul · linalg.generic · linalg.fill]
 *     │ one-shot bufferization (tensor → memref) · Linalg→SCF · SCF→CF
 *   LLVM dialect  [llvm.load · llvm.store · llvm.fadd · llvm.fmul]
 *     │ MLIR → LLVM IR translation
 *   LLVM IR  →  native machine code  /  JIT (ExecutionEngine)
 *
 * Key idea (highlighted): operator fusion — matmul+relu → fused op — removes
 * intermediate tensor allocations. Runs its own cooler --viz-mtc-* palette so
 * it reads as a distinct system from repo-scout and AnyLang.
 */

import { ArrowDefs, Edge } from './primitives';

const M = 'mtc-arrow';

const SRC = 'var(--viz-mtc-source)';
const IR = 'var(--viz-mtc-ir)';
const PASS = 'var(--viz-mtc-pass)';
const LOWER = 'var(--viz-mtc-lower)';
const OUT = 'var(--viz-mtc-out)';
const KEY = 'var(--viz-mtc-key)';

/* ---- a stage block: title, sub-label, and optional inline "op" chips ---- */
function Stage({
  x,
  y,
  w,
  h,
  color,
  title,
  sub,
  chips,
  isKey,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  title: string;
  sub?: string;
  chips?: string[];
  isKey?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill={color}
        fillOpacity="0.12"
        stroke={color}
        strokeWidth="1.5"
        className={isKey ? 'vizKeyNode' : undefined}
      />
      <text x={x + 16} y={sub || chips ? y + 26 : y + h / 2 + 6} fill="var(--ink)" fontSize="18" fontWeight="600">
        {title}
      </text>
      {sub ? (
        <text x={x + 16} y={y + 46} fill="var(--muted)" fontSize="14.5">
          {sub}
        </text>
      ) : null}
      {chips ? (
        <g>
          {chips.map((c, i) => {
            // lay chips out left→right, wrapping by a rough char width
            const cw = c.length * 8 + 20;
            const prior = chips.slice(0, i).reduce((a, s) => a + s.length * 8 + 20 + 9, 0);
            const cx = x + 16 + prior;
            const cy = y + h - 33;
            return (
              <g key={c}>
                <rect x={cx} y={cy} width={cw} height={24} rx="5" fill={color} fillOpacity="0.16" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
                <text x={cx + cw / 2} y={cy + 16.5} fill="var(--ink-dim)" fontSize="13.5" fontFamily="var(--font)" textAnchor="middle">
                  {c}
                </text>
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
}

/* The MLIR lowering stack, top to bottom. */
export default function MiniTensorCompiler() {
  return (
    <svg viewBox="0 0 800 552" role="img" aria-label="MiniTensorCompiler architecture">
      <title>MiniTensorCompiler architecture</title>
      <ArrowDefs id={M} />

      {/* frontend source */}
      <Stage x={130} y={14} w={540} h={62} color={SRC} title="TensorScript source" sub="typed tensor language — parsed straight to MLIR" />
      <Edge d="M400 76 L400 100" markerId={M} />

      {/* ts.* dialect — high-level IR with op chips */}
      <Stage
        x={110}
        y={100}
        w={580}
        h={86}
        color={IR}
        title="ts.* dialect"
        sub="high-level IR, one op per tensor operation"
        chips={['ts.matmul', 'ts.add', 'ts.relu', 'ts.transpose']}
      />
      <Edge d="M400 186 L400 214" markerId={M} />

      {/* the three optimization passes, broken out as a band */}
      <text x={110} y={206} fill="var(--muted)" fontSize="13" letterSpacing="1.5" fontWeight="600">
        OPTIMIZATION PASSES
      </text>
      <Stage x={110} y={214} w={178} h={66} color={PASS} title="Shape inference" sub="validate dims" />
      <Stage x={302} y={214} w={178} h={66} color={PASS} title="Constant folding" sub="fold at compile time" />
      <Stage
        x={494}
        y={214}
        w={196}
        h={66}
        color={KEY}
        title="Operator fusion"
        sub="matmul+relu → fused op"
        isKey
      />
      <Edge d="M400 280 L400 308" markerId={M} />

      {/* Linalg on tensors */}
      <Stage
        x={110}
        y={308}
        w={580}
        h={86}
        color={IR}
        title="Linalg on tensors"
        sub="bufferized, lowered through SCF to control flow"
        chips={['linalg.matmul', 'linalg.generic', 'linalg.fill']}
      />
      <Edge d="M400 394 L400 422" markerId={M} />

      {/* LLVM dialect */}
      <Stage
        x={110}
        y={422}
        w={580}
        h={62}
        color={LOWER}
        title="LLVM dialect"
        sub="explicit load / store / branch → LLVM IR"
      />

      {/* two output targets */}
      <Edge d="M260 484 L260 500 L200 500 L200 506" markerId={M} />
      <Edge d="M540 484 L540 500 L600 500 L600 506" markerId={M} />
      <Stage x={40} y={506} w={312} h={36} color={OUT} title="Native machine code" />
      <Stage x={448} y={506} w={312} h={36} color={OUT} title="JIT · ExecutionEngine" />
    </svg>
  );
}
