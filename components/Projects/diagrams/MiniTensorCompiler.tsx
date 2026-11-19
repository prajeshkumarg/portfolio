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
      <text x={x + 16} y={sub || chips ? y + 24 : y + h / 2 + 5} fill="var(--ink)" fontSize="15" fontWeight="600">
        {title}
      </text>
      {sub ? (
        <text x={x + 16} y={y + 42} fill="var(--muted)" fontSize="13">
          {sub}
        </text>
      ) : null}
      {chips ? (
        <g>
          {chips.map((c, i) => {
            // lay chips out left→right, wrapping by a rough char width
            const cw = c.length * 7.2 + 18;
            const prior = chips.slice(0, i).reduce((a, s) => a + s.length * 7.2 + 18 + 8, 0);
            const cx = x + 16 + prior;
            const cy = y + h - 30;
            return (
              <g key={c}>
                <rect x={cx} y={cy} width={cw} height={21} rx="5" fill={color} fillOpacity="0.16" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
                <text x={cx + cw / 2} y={cy + 14.5} fill="var(--ink-dim)" fontSize="12" fontFamily="var(--font)" textAnchor="middle">
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

/* a small lowering-step label that sits on an edge between two stages */
function StepLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} fill="var(--muted)" fontSize="11.5" fontStyle="italic">
      {text}
    </text>
  );
}

export default function MiniTensorCompiler() {
  return (
    <svg viewBox="0 0 800 560" role="img" aria-label="MiniTensorCompiler architecture">
      <title>MiniTensorCompiler architecture</title>
      <ArrowDefs id={M} />

      {/* frontend source */}
      <Stage x={150} y={16} w={500} h={56} color={SRC} title="TensorScript source" sub="fn mlp(x: tensor<4x8xf32>) → …  ·  typed tensor language" />
      <StepLabel x={408} y={92} text="recursive-descent parser · direct MLIR emission" />
      <Edge d="M400 72 L400 108" markerId={M} />

      {/* ts.* dialect — high-level IR with op chips */}
      <Stage
        x={120}
        y={108}
        w={560}
        h={78}
        color={IR}
        title="ts.* dialect"
        sub="high-level IR — one op per tensor operation"
        chips={['ts.matmul', 'ts.add', 'ts.relu', 'ts.transpose', 'ts.reduce_sum']}
      />
      <Edge d="M400 186 L400 222" markerId={M} />

      {/* the three optimization passes, broken out as a band */}
      <text x={120} y={214} fill="var(--muted)" fontSize="11" letterSpacing="1.5" fontWeight="600">
        OPTIMIZATION PASSES
      </text>
      <Stage x={120} y={222} w={168} h={64} color={PASS} title="Shape inference" sub="validate dims" />
      <Stage x={302} y={222} w={168} h={64} color={PASS} title="Constant folding" sub="fold at compile time" />
      <Stage
        x={484}
        y={222}
        w={196}
        h={64}
        color={KEY}
        title="Operator fusion"
        sub="matmul+relu → fused op"
        isKey
      />
      <Edge d="M400 286 L400 322" markerId={M} />

      {/* Linalg on tensors */}
      <Stage
        x={120}
        y={322}
        w={560}
        h={78}
        color={IR}
        title="Linalg on tensors"
        sub="affine maps over iteration domains"
        chips={['linalg.matmul', 'linalg.generic', 'linalg.fill']}
      />
      <StepLabel x={408} y={420} text="one-shot bufferization (tensor → memref) · Linalg→SCF→CF" />
      <Edge d="M400 400 L400 436" markerId={M} />

      {/* LLVM dialect */}
      <Stage
        x={120}
        y={436}
        w={560}
        h={60}
        color={LOWER}
        title="LLVM dialect"
        sub="explicit load / store / branch — MLIR → LLVM IR"
      />

      {/* two output targets */}
      <Edge d="M250 496 L250 516 L190 516 L190 520" markerId={M} />
      <Edge d="M550 496 L550 516 L610 516 L610 520" markerId={M} />
      <Stage x={40} y={520} w={300} h={32} color={OUT} title="Native machine code" />
      <Stage x={460} y={520} w={300} h={32} color={OUT} title="JIT · LLVM ExecutionEngine" />
    </svg>
  );
}
