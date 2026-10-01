"use client";
import { useEffect, useRef, useState } from "react";
import { FloorEngine, type RGB } from "@/lib/floorEngine";

const COLOURS: [string, string][] = [
  ["Concrete grey", "#7b7a72"], ["Steel blue", "#4a657a"], ["Industrial green", "#4e7350"], ["Oxide red", "#9a5a4a"],
  ["Charcoal", "#2c2f31"], ["Sand", "#b59d68"], ["Off-white", "#dedbd0"], ["Navy", "#1f3a68"],
];
const hexToRgb = (hex: string): RGB => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

export default function Visualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const engine = useRef<FloorEngine | null>(null);
  const [status, setStatus] = useState("No photo selected.");
  const [loaded, setLoaded] = useState(false);
  const [colour, setColour] = useState(0);
  const [coverage, setCoverage] = useState(92);
  const [drag, setDrag] = useState<"stage" | "upload" | null>(null);

  useEffect(() => {
    const e = new FloorEngine(canvasRef.current!, stageRef.current!, setStatus, () => setLoaded(true));
    e.setColour(hexToRgb(COLOURS[0][1]), COLOURS[0][0]);
    engine.current = e;
    const ro = new ResizeObserver(() => e.refit());
    ro.observe(stageRef.current!);
    return () => { ro.disconnect(); e.destroy(); };
  }, []);

  const pick = () => fileRef.current?.click();
  const dropProps = (zone: "stage" | "upload") => ({
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDrag(zone); },
    onDragLeave: () => setDrag(null),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setDrag(null); engine.current?.load(e.dataTransfer.files[0]); },
  });

  return (
    <section className="viz-layout" aria-label="Floor visualiser">
      <aside className="panel" aria-labelledby="panel-title">
        <h2 id="panel-title">Build your preview</h2>
        <input ref={fileRef} type="file" accept="image/*" hidden aria-label="Upload floor photo"
          onChange={(e) => { engine.current?.load(e.target.files?.[0]); e.target.value = ""; }} />
        <button type="button" className={`upload${drag === "upload" ? " dragging" : ""}`} onClick={pick} {...dropProps("upload")}>Upload current floor photo</button>

        <p className="field-label" id="colour-label">Epoxy coating colour</p>
        <div className="swatches" role="group" aria-labelledby="colour-label">
          {COLOURS.map(([name, hex], i) => (
            <button key={name} type="button" className="swatch" style={{ background: hex }} title={name} aria-label={name} aria-pressed={i === colour}
              onClick={() => { setColour(i); engine.current?.setColour(hexToRgb(hex), name); }} />
          ))}
        </div>

        <label className="field-label" htmlFor="coverage">Coating coverage <span>{coverage}%</span></label>
        <input id="coverage" type="range" min={40} max={100} value={coverage}
          onChange={(e) => { const v = Number(e.target.value); setCoverage(v); engine.current?.setCoverage(v); }} />

        <button type="button" className="btn btn-primary btn-block btn-lg" onClick={() => engine.current?.apply()}>Apply epoxy coating</button>
        <button type="button" className="btn btn-outline btn-block btn-lg" onClick={() => engine.current?.clear()}>Clear marked area</button>
        <button type="button" className="btn btn-outline btn-block btn-lg" onClick={() => engine.current?.download()}>Download preview</button>
        <p className="panel-hint">After uploading, click the corners of the concrete floor. Add at least three points, then apply the coating.</p>
      </aside>

      <div>
        <div ref={stageRef} className={`stage${drag === "stage" ? " dragging" : ""}`} {...dropProps("stage")}>
          {!loaded && (
            <div className="stage-empty">
              <h3>Start with a floor photo</h3>
              <p>Choose a clear photo taken from standing height for the best perspective preview.</p>
              <button type="button" className="btn btn-primary" onClick={pick}>Upload floor photo</button>
            </div>
          )}
          <canvas ref={canvasRef} hidden={!loaded} role="img" aria-label="Floor photo. Click the corners of the floor to mark an area."
            onClick={(e) => engine.current?.addPoint(e.clientX, e.clientY)} />
        </div>
        <p className="stage-status" role="status" aria-live="polite">{status}</p>
      </div>
    </section>
  );
}
