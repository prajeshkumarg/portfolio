/*
 * Shared SVG primitives for the Projects architecture diagrams. One visual
 * system: role-coloured rounded-rect nodes, muted bone edges with small
 * arrowheads, one highlighted key-idea node per diagram. No hex anywhere —
 * every colour is a --viz-* / --ink / --muted CSS variable, so the diagrams
 * inherit the page theme and Switzer (via currentColor/CSS) applies to labels.
 *
 * Role → colour (identical in every diagram):
 *   input   = sky      processing = violet
 *   storage = amber    output     = jade
 *   key     = rose (or lava)
 */

export type Role = 'input' | 'processing' | 'storage' | 'output' | 'key' | 'key-lava';

const ROLE_VAR: Record<Role, string> = {
  input: 'var(--viz-sky)',
  processing: 'var(--viz-violet)',
  storage: 'var(--viz-amber)',
  output: 'var(--viz-jade)',
  key: 'var(--viz-rose)',
  'key-lava': 'var(--viz-lava)',
};

/** A rounded-rect node: 1.5px stroke in the role colour, fill at ~12% of it. */
export function Node({
  x,
  y,
  w,
  h,
  role,
  label,
  sub,
  className,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  role: Role;
  label: string;
  sub?: string;
  className?: string;
}) {
  const color = ROLE_VAR[role];
  const isKey = role === 'key' || role === 'key-lava';
  // label sits a touch higher when there's a sub-label beneath it
  const labelY = sub ? y + h / 2 - 3 : y + h / 2 + 1;
  return (
    <g className={className}>
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
      <text
        x={x + w / 2}
        y={labelY}
        fill="var(--ink)"
        fontSize="18"
        fontWeight="600"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
      {sub ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 17}
          fill="var(--muted)"
          fontSize="14.5"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
}

/** A directed edge. `d` is a path; the flowing dash + arrowhead come from CSS. */
export function Edge({ d, markerId }: { d: string; markerId: string }) {
  return (
    <path
      className="vizEdge"
      d={d}
      fill="none"
      stroke="var(--viz-line)"
      strokeWidth="1.5"
      markerEnd={`url(#${markerId})`}
    />
  );
}

/** The arrowhead marker. One per diagram (ids must be unique across the DOM). */
export function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6.5"
        markerHeight="6.5"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill="var(--viz-line)" />
      </marker>
    </defs>
  );
}
