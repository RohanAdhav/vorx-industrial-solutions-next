/**
 * Floor visualiser engine (framework-free, runs fully in the browser).
 *
 * Why the preview now matches the download:
 *  - `work` is an off-screen canvas holding the FULL-resolution composite. Downloads come from here.
 *  - `display` is the on-screen canvas. Its backing store is sized to (CSS size x devicePixelRatio) and the
 *    photo is drawn into it with high-quality, step-down resampling. Previously the full image was simply
 *    squeezed by CSS, which the browser does with fast, low-quality scaling (jagged / soft preview).
 *  - Marker points are drawn on `display` only, so they are crisp and never end up in the export.
 */
export type RGB = [number, number, number];
type Pt = [number, number];
type Area = { mask: Uint8ClampedArray; x0: number; y0: number; x1: number; y1: number; mean: number; rgb: RGB };

const MAX_SIDE = 2400; // longest side of the working image

export class FloorEngine {
  private work = document.createElement("canvas");
  private wctx = this.work.getContext("2d")!;
  private dctx: CanvasRenderingContext2D;
  private base: ImageData | null = null;
  private areas: Area[] = [];
  private points: Pt[] = [];
  private active = -1;
  private coverage = 0.92;
  private rgb: RGB = [123, 122, 114];
  private colourName = "Concrete grey";
  private dirty = true;
  private scaled: HTMLCanvasElement | null = null;
  private raf = 0;
  private u = 1; // backing pixels per CSS pixel

  constructor(
    private display: HTMLCanvasElement,
    private stage: HTMLElement,
    private say: (msg: string) => void,
    private onLoaded: () => void,
  ) {
    this.dctx = display.getContext("2d")!;
  }

  destroy() { cancelAnimationFrame(this.raf); }

  /* ---------- public API ---------- */
  async load(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return this.say("That file is not an image. Choose a JPG, PNG or WebP photo.");
    try {
      let bmp: ImageBitmap;
      try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
      catch { bmp = await createImageBitmap(file); }
      const s = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
      this.work.width = Math.round(bmp.width * s);
      this.work.height = Math.round(bmp.height * s);
      this.wctx.imageSmoothingQuality = "high";
      this.wctx.fillStyle = "#fff";
      this.wctx.fillRect(0, 0, this.work.width, this.work.height);
      this.wctx.drawImage(bmp, 0, 0, this.work.width, this.work.height);
      bmp.close?.();
      this.base = this.wctx.getImageData(0, 0, this.work.width, this.work.height);
      this.areas = []; this.points = []; this.active = -1; this.dirty = true; this.scaled = null;
      this.onLoaded();
      this.draw();
      this.say(`${file.name} loaded. Click the corners of the concrete floor.`);
    } catch {
      this.say("This photo could not be opened. Try a different image.");
    }
  }

  setColour(rgb: RGB, name: string) {
    this.rgb = rgb; this.colourName = name;
    if (!this.base) return;
    if (this.points.length === 0 && this.active >= 0) {
      this.areas[this.active].rgb = rgb; this.dirty = true;
      this.say(`Previewing ${name}. Choose another colour or download the preview.`);
    } else if (this.points.length >= 3) { this.apply(); return; }
    this.draw();
  }

  setCoverage(pct: number) {
    this.coverage = pct / 100;
    this.dirty = true;
    this.schedule();
  }

  refit() { this.scaled = null; this.schedule(); }

  addPoint(clientX: number, clientY: number) {
    if (!this.base) return;
    const r = this.display.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * this.work.width;
    const y = ((clientY - r.top) / r.height) * this.work.height;
    if (x < 0 || y < 0 || x > this.work.width || y > this.work.height) return;
    if (this.points.length === 0) this.active = -1;
    this.points.push([x, y]);
    this.draw();
    const n = this.points.length;
    this.say(n < 3 ? `${n} point${n > 1 ? "s" : ""} marked. Add at least three points.` : `${n} points marked. Apply coating preview when ready.`);
  }

  apply() {
    if (!this.base) return this.say("Upload a floor photo first.");
    if (this.points.length < 3) return this.say("Add at least three points around the floor, then apply the coating.");
    const w = this.work.width, h = this.work.height;
    const mc = document.createElement("canvas"); mc.width = w; mc.height = h;
    const mg = mc.getContext("2d", { willReadFrequently: true })!;
    mg.beginPath(); this.points.forEach((p, i) => (i ? mg.lineTo(p[0], p[1]) : mg.moveTo(p[0], p[1])));
    mg.closePath(); mg.fillStyle = "#fff"; mg.fill();
    const alpha = mg.getImageData(0, 0, w, h).data, d = this.base.data;
    const mask = new Uint8ClampedArray(w * h);
    let x0 = w, y0 = h, x1 = 0, y1 = 0, sum = 0, wsum = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, a = alpha[i * 4 + 3];
      if (!a) continue;
      mask[i] = a;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      const p = i * 4;
      sum += ((0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2]) / 255) * a; wsum += a;
    }
    if (!wsum) return this.say("That shape has no area. Place the corners further apart.");
    this.areas.push({ mask, x0, y0, x1, y1, mean: Math.max(0.05, sum / wsum), rgb: this.rgb });
    this.active = this.areas.length - 1; this.points = []; this.dirty = true;
    this.draw();
    this.say(`${this.colourName} coating preview applied. Choose another colour to compare, or download the preview.`);
  }

  clear() {
    if (!this.base) return this.say("No photo selected.");
    if (this.points.length) { this.points = []; this.say("Marked points cleared. Click the corners of the floor to start again."); }
    else if (this.areas.length) { this.areas = []; this.active = -1; this.dirty = true; this.say("Coating removed. Click the corners of the floor to start again."); }
    else this.say("Nothing to clear yet.");
    this.draw();
  }

  download() {
    if (!this.base) return this.say("Upload a floor photo first.");
    if (this.points.length >= 3) this.apply();
    if (!this.areas.length) return this.say("Mark at least three points on the floor and choose a colour, then download.");
    this.flush();
    this.work.toBlob((blob) => {
      if (!blob) return this.say("Could not create the image. Try again.");
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url; a.download = "vorx-floor-preview.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      this.say("Preview downloaded.");
    }, "image/png");
  }

  /* ---------- rendering ---------- */
  private schedule() { cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(() => this.draw()); }

  /** Paint areas into the full-resolution work canvas (only when something changed). */
  private flush() {
    if (!this.base || !this.dirty) return;
    const out = new ImageData(new Uint8ClampedArray(this.base.data), this.base.width, this.base.height);
    this.areas.forEach((a) => this.paintArea(out.data, a));
    this.wctx.putImageData(out, 0, 0);
    this.dirty = false; this.scaled = null;
  }

  private paintArea(out: Uint8ClampedArray, a: Area) {
    const w = this.work.width, [cr, cg, cb] = a.rgb;

    for (let y = a.y0; y <= a.y1; y++) {
      for (let x = a.x0; x <= a.x1; x++) {
        const i = y * w + x, m = a.mask[i];

        if (!m) continue;

        const p = i * 4;
        const r = out[p];
        const g = out[p + 1];
        const b = out[p + 2];

        const k = (m / 255) * this.coverage;

        out[p] = r + (cr - r) * k;
        out[p + 1] = g + (cg - g) * k;
        out[p + 2] = b + (cb - b) * k;
      }
    }
  }
  /** Resample `work` to exactly tw x th using repeated halving + high-quality smoothing (avoids aliasing). */
  private downscale(tw: number, th: number) {
    let src: HTMLCanvasElement = this.work;
    while (src.width / 2 >= tw && src.height / 2 >= th) {
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(src.width / 2)); c.height = Math.max(1, Math.round(src.height / 2));
      const g = c.getContext("2d")!; g.imageSmoothingQuality = "high"; g.drawImage(src, 0, 0, c.width, c.height);
      src = c;
    }
    const out = document.createElement("canvas"); out.width = tw; out.height = th;
    const g = out.getContext("2d")!; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
    g.drawImage(src, 0, 0, tw, th);
    return out;
  }

  private draw() {
    if (!this.base) return;
    this.flush();
    const sw = this.stage.clientWidth, sh = this.stage.clientHeight;
    if (!sw || !sh) return;
    const k = Math.min(sw / this.work.width, sh / this.work.height);
    const cssW = this.work.width * k, cssH = this.work.height * k;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const tw = Math.round(cssW * dpr), th = Math.round(cssH * dpr);
    this.u = tw / cssW;
    this.display.style.width = `${cssW}px`; this.display.style.height = `${cssH}px`;
    if (this.display.width !== tw || this.display.height !== th) { this.display.width = tw; this.display.height = th; this.scaled = null; }
    if (!this.scaled || this.scaled.width !== tw || this.scaled.height !== th) this.scaled = this.downscale(tw, th);
    this.dctx.clearRect(0, 0, tw, th);
    this.dctx.drawImage(this.scaled, 0, 0);
    if (this.points.length) this.drawPoints(tw / this.work.width, th / this.work.height);
  }

  private drawPoints(sx: number, sy: number) {
    const c = this.dctx, u = this.u, pts = this.points.map((p) => [p[0] * sx, p[1] * sy]);
    c.save(); c.strokeStyle = c.fillStyle = "#ffc425"; c.lineWidth = 1.5 * u; c.lineJoin = "round";
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
    pts.forEach((p) => { c.beginPath(); c.arc(p[0], p[1], 4.5 * u, 0, Math.PI * 2); c.fill(); });
    c.restore();
  }
}
