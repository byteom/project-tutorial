
'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
  Label,
} from 'recharts';

function normalDensity(mu: number, sigma: number, x: number) {
  return (
    (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2))
  );
}

const generateBellCurveData = (mu: number, sigma: number, points = 100) => {
  const data = [];
  const minX = mu - 4 * sigma;
  const maxX = mu + 4 * sigma;

  for (let i = 0; i < points; i++) {
    const x = minX + (i / (points - 1)) * (maxX - minX);
    data.push({ x, y: normalDensity(mu, sigma, x) });
  }
  return data;
};

interface BellCurveChartProps {
  score: number;
}

export function BellCurveChart({ score }: BellCurveChartProps) {
  const mu = 50;
  const sigma = 15;
  const data = useMemo(() => generateBellCurveData(mu, sigma), [mu, sigma]);
  
  const scoreY = useMemo(() => normalDensity(mu, sigma, score), [mu, sigma, score]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#e57373" stopOpacity={0.8} />
            <stop offset="50%" stopColor="#81c784" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#64b5f6" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <XAxis dataKey="x" tick={false} axisLine={false} />
        <YAxis tick={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
          }}
          labelFormatter={() => ''}
          formatter={(value, name) => {
            if (name === 'score') return [score.toFixed(0), 'Your Score'];
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          strokeWidth={2}
          fill="url(#colorUv)"
          fillOpacity={0.6}
          dot={false}
        />
        <ReferenceDot
            x={score}
            y={scoreY}
            r={8}
            fill="#e53935"
            stroke="hsl(var(--background))"
            strokeWidth={2}
            isFront={true}
        >
             <Label value="Your Score" position="top" offset={10} fill="hsl(var(--foreground))"/>
        </ReferenceDot>
      </AreaChart>
    </ResponsiveContainer>
  );
}
