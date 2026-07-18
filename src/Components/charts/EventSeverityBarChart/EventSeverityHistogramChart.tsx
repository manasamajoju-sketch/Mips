import { useRef, useEffect, useCallback } from 'react';
import type { SeverityHistogramBar } from '../../../types/eventSeverityHistogram';
import { HISTOGRAM_MAX_VALUE, SEVERITY_BUCKET_COLORS } from '../../../Constants/eventSeverityHistogramData';
import styles from './EventSeverityHistogramChart.module.scss';

interface EventSeverityHistogramChartProps {
  bars: SeverityHistogramBar[];
}

const Y_TICKS      = 4;
const LABEL_COLOR  = 'rgba(0,0,0,0.38)';   // visible on light bg
const GRID_COLOR   = 'rgba(0,0,0,0.07)';
const AXIS_LINE    = 'rgba(0,0,0,0.12)';

export default function EventSeverityHistogramChart({ bars }: EventSeverityHistogramChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.offsetWidth;
    const H   = canvas.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    if (W === 0 || H === 0 || bars.length === 0) return;

    // ── Layout ────────────────────────────────────────────────────────
    const fontSize = Math.max(8, Math.min(11, W * 0.05));
    ctx.font = `${fontSize}px system-ui, sans-serif`;

    // Measure widest y-axis label to set exact yAxisW
    const maxLabel = String(HISTOGRAM_MAX_VALUE);
    const yAxisW   = ctx.measureText(maxLabel).width + 8;   // label + gap
    const xAxisH   = fontSize + 6;                          // one line + padding
    const padTop   = 4;
    const padRight = 6;

    const plotX = yAxisW;
    const plotY = padTop;
    const plotW = W - yAxisW - padRight;
    const plotH = H - padTop - xAxisH;

    const n     = bars.length;
    const slotW = plotW / n;
    const barW  = Math.max(6, Math.min(slotW * 0.6, 28));

    // ── Y-axis grid lines + labels ────────────────────────────────────
    ctx.textAlign    = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= Y_TICKS; i++) {
      const val = Math.round((HISTOGRAM_MAX_VALUE / Y_TICKS) * (Y_TICKS - i));
      const y   = plotY + (i / Y_TICKS) * plotH;

      // Grid line across plot area
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth   = 0.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(plotX, y);
      ctx.lineTo(plotX + plotW, y);
      ctx.stroke();

      // Y label
      ctx.fillStyle = LABEL_COLOR;
      ctx.fillText(String(val), plotX - 4, y);
    }

    // ── Y-axis vertical line ──────────────────────────────────────────
    ctx.strokeStyle = AXIS_LINE;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(plotX, plotY);
    ctx.lineTo(plotX, plotY + plotH);
    ctx.stroke();

    // ── X-axis horizontal line ────────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(plotX, plotY + plotH);
    ctx.lineTo(plotX + plotW, plotY + plotH);
    ctx.stroke();

    // ── Bars + X-axis labels ──────────────────────────────────────────
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';

    bars.forEach((bar, i) => {
      const pct    = Math.min(bar.value / HISTOGRAM_MAX_VALUE, 1);
      const bh     = pct * plotH;
      const bx     = plotX + i * slotW + (slotW - barW) / 2;
      const by     = plotY + plotH - bh;
      const color  = SEVERITY_BUCKET_COLORS[bar.bucket] ?? '#888';
      const radius = Math.min(4, barW / 3);

      // Bar
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(bx, by, barW, bh, [radius, radius, 0, 0]);
      ctx.fill();

      // X-axis label — use xAxisLabel if provided, else bucket name
      const xLabel = bar.xAxisLabel ?? bar.bucket ?? String(i + 1);
      ctx.fillStyle = LABEL_COLOR;
      ctx.fillText(xLabel, bx + barW / 2, plotY + plotH + 4);
    });
  }, [bars]);

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(draw);
    });
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-label="Event severity histogram"
    />
  );
}