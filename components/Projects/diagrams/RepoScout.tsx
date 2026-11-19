/*
 * repo-scout architecture (from docs/SPEC.md) — drawn as a two-layer system
 * rather than a single flowchart row:
 *
 *   INGEST (background, keyed on SHA):  repo  →  clone + tree-sitter parse
 *      feeds ↓
 *   INDEX store:  pgvector (cylinder)  +  Redis cache (bolt)
 *      read by ↓
 *   QUERY:  tool-using agent  →  cited answer
 *
 * Key idea (highlighted, rose): every claim cites file:line, validated against
 * the pinned SHA. Uses small iconography (GitHub mark, DB cylinder, cache bolt,
 * agent spark, document) and the shared --viz-* role palette, so it still reads
 * as one system with the other two diagrams.
 */

import { ArrowDefs, Edge } from './primitives';

const M = 'rs-arrow';

/* ---- small role-coloured node with an inline icon, title and sub-label ---- */
function IconNode({
  x,
  y,
  w,
  h,
  color,
  title,
  sub,
  icon,
  isKey,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  title: string;
  sub?: string;
  icon: React.ReactNode;
  isKey?: boolean;
}) {
  const tx = x + 58; // text starts to the right of the icon
  const titleY = sub ? y + h / 2 - 3 : y + h / 2 + 1;
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
      {/* icon badge */}
      <g transform={`translate(${x + 18}, ${y + h / 2 - 14})`} stroke={color} fill="none" strokeWidth="1.8">
        {icon}
      </g>
      <text x={tx} y={titleY} fill="var(--ink)" fontSize="15" fontWeight="600" dominantBaseline="middle">
        {title}
      </text>
      {sub ? (
        <text x={tx} y={y + h / 2 + 15} fill="var(--muted)" fontSize="13" dominantBaseline="middle">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/* ---- iconography (stroke = currentColor via parent `stroke`) ---- */

// GitHub-ish repo mark: a simple octocat-free git node (circle + fork lines)
const RepoIcon = (
  <>
    <circle cx="8" cy="7" r="3.2" />
    <circle cx="8" cy="22" r="3.2" />
    <circle cx="20" cy="10" r="3.2" />
    <path d="M8 10.2 L8 18.8" />
    <path d="M8 13 Q8 10 11 10 L17 10" />
  </>
);

// parse: braces around a dot (code chunking)
const ParseIcon = (
  <>
    <path d="M9 3 Q4 3 4 9 Q4 14 1 14 Q4 14 4 19 Q4 25 9 25" />
    <path d="M19 3 Q24 3 24 9 Q24 14 27 14 Q24 14 24 19 Q24 25 19 25" strokeWidth="1.8" transform="translate(-6,0)" />
    <circle cx="14" cy="14" r="1.6" fill={undefined} />
  </>
);

// pgvector: a database cylinder
const DbIcon = (
  <>
    <ellipse cx="14" cy="6" rx="10" ry="3.4" />
    <path d="M4 6 L4 22 Q4 25.4 14 25.4 Q24 25.4 24 22 L24 6" />
    <path d="M4 14 Q4 17.4 14 17.4 Q24 17.4 24 14" />
  </>
);

// Redis cache: a lightning bolt (fast lookup)
const CacheIcon = (
  <>
    <path d="M16 2 L6 15 L13 15 L11 26 L22 11 L15 11 Z" strokeLinejoin="round" />
  </>
);

// agent: a spark / starburst (the tool-using loop)
const AgentIcon = (
  <>
    <path d="M14 3 L14 25" />
    <path d="M3 14 L25 14" />
    <path d="M6 6 L22 22" />
    <path d="M22 6 L6 22" />
    <circle cx="14" cy="14" r="3.4" />
  </>
);

// answer with a citation: a document with a line marked
const DocIcon = (
  <>
    <path d="M6 2 L17 2 L23 8 L23 26 L6 26 Z" strokeLinejoin="round" />
    <path d="M17 2 L17 8 L23 8" />
    <path d="M10 14 L19 14" />
    <path d="M10 19 L16 19" />
  </>
);

export default function RepoScout() {
  const SKY = 'var(--viz-sky)';
  const VIOLET = 'var(--viz-violet)';
  const AMBER = 'var(--viz-amber)';
  const JADE = 'var(--viz-jade)';
  const ROSE = 'var(--viz-rose)';

  return (
    <svg viewBox="0 0 800 500" role="img" aria-label="repo-scout architecture">
      <title>repo-scout architecture</title>
      <ArrowDefs id={M} />

      {/* ---- layer labels, like an architecture diagram's bands ---- */}
      <text x={24} y={30} fill="var(--muted)" fontSize="12" letterSpacing="2" fontWeight="600">
        INGEST
      </text>
      <text x={24} y={214} fill="var(--muted)" fontSize="12" letterSpacing="2" fontWeight="600">
        INDEX
      </text>
      <text x={24} y={366} fill="var(--muted)" fontSize="12" letterSpacing="2" fontWeight="600">
        QUERY
      </text>
      {/* faint band separators */}
      <line x1={24} y1={190} x2={776} y2={190} stroke="var(--viz-line)" strokeOpacity="0.2" strokeWidth="1" />
      <line x1={24} y1={342} x2={776} y2={342} stroke="var(--viz-line)" strokeOpacity="0.2" strokeWidth="1" />

      {/* ---- INGEST row ---- */}
      <IconNode x={24} y={42} w={224} h={76} color={SKY} title="GitHub repo" sub="shallow clone @ SHA" icon={RepoIcon} />
      <IconNode x={328} y={42} w={244} h={76} color={VIOLET} title="tree-sitter parse" sub="chunk by symbol" icon={ParseIcon} />

      {/* ---- INDEX store: two side-by-side stores ---- */}
      <IconNode x={200} y={234} w={212} h={76} color={AMBER} title="pgvector" sub="embeddings + FTS" icon={DbIcon} />
      <IconNode x={452} y={234} w={200} h={76} color={AMBER} title="Redis" sub="progress + cache" icon={CacheIcon} />

      {/* ---- QUERY: agent → answer, with the key idea highlighted ---- */}
      <IconNode x={24} y={388} w={236} h={76} color={VIOLET} title="tool-using agent" sub="search · grep · read_file" icon={AgentIcon} />
      <IconNode
        x={320}
        y={388}
        w={456}
        h={76}
        color={ROSE}
        title="Answer — every claim cites file:line"
        sub="citations validated against the pinned SHA"
        icon={DocIcon}
        isKey
      />

      {/* ---- edges ---- */}
      {/* ingest flow */}
      <Edge d="M248 80 L328 80" markerId={M} />
      {/* parse → index (both stores) */}
      <Edge d="M400 118 L400 190 L306 190 L306 234" markerId={M} />
      <Edge d="M450 118 L552 190 L552 234" markerId={M} />
      {/* index → agent (reads from the stores) */}
      <Edge d="M306 310 L306 342 L142 342 L142 388" markerId={M} />
      {/* agent → answer */}
      <Edge d="M260 426 L320 426" markerId={M} />
    </svg>
  );
}
