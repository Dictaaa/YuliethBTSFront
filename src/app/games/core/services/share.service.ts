import { Injectable } from '@angular/core';

export interface ShareCard {
  name: string;
  rank: string;
  rankIcon: string;
  total: number;
  totalStars: number;
  streak: number;
  game?: string;        // si existe, la imagen es de una partida
  points?: number;      // puntos de esa partida
  levelStars?: number;  // estrellas de esa partida (0 a 3)
}

export type ShareResult = 'shared' | 'downloaded' | 'cancelled';

const SITE = 'btspastelito.com'; // cámbialo si tu dirección es otra

@Injectable({ providedIn: 'root' })
export class ShareService {
  async share(card: ShareCard): Promise<ShareResult> {
    const blob = await this.draw(card);
    const file = new File([blob], 'mi-resultado-army.png', { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };

    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({
          files: [file],
          title: 'Mi resultado ARMY',
          text: `¿Cuánto sabes de BTS? Juega en ${SITE} 💜`,
        });
        return 'shared';
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return 'cancelled';
        // si falla por otra razón, se descarga
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-resultado-army.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'downloaded';
  }

  private async draw(c: ShareCard): Promise<Blob> {
    const W = 1080;
    const H = 1350;

    try {
      await Promise.all([document.fonts.load('700 80px Fredoka'), document.fonts.load('600 40px Nunito')]);
    } catch {
      /* si no cargan, se usan las fuentes del sistema */
    }

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const x = canvas.getContext('2d')!;
    const title = (px: number) => `700 ${px}px Fredoka, Nunito, sans-serif`;
    const body = (px: number) => `600 ${px}px Nunito, sans-serif`;

    // Fondo
    const bg = x.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#21152F');
    bg.addColorStop(0.55, '#6C3ACD');
    bg.addColorStop(1, '#B69AEF');
    x.fillStyle = bg;
    x.fillRect(0, 0, W, H);

    // Esferas brillantes
    const orb = (cx: number, cy: number, r: number, c1: string, c2: string, a: number) => {
      const g = x.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      x.globalAlpha = a;
      x.fillStyle = g;
      x.beginPath();
      x.arc(cx, cy, r, 0, Math.PI * 2);
      x.fill();
      x.globalAlpha = 1;
    };
    orb(930, 170, 150, '#ffffff', '#F0C6E9', 0.9);
    orb(130, 1180, 120, '#ffffff', '#B69AEF', 0.85);
    orb(960, 1240, 70, '#ffffff', '#6C3ACD', 0.8);
    orb(80, 230, 50, '#ffffff', '#F0C6E9', 0.7);

    // Notas y corazones
    x.textAlign = 'center';
    x.globalAlpha = 0.4;
    x.fillStyle = '#FFF7FF';
    const deco: [string, number, number, number][] = [
      ['♪', 200, 120, 70], ['♫', 640, 90, 60], ['💜', 420, 200, 56],
      ['♬', 860, 330, 56], ['♪', 100, 520, 64], ['💜', 990, 760, 54],
      ['♫', 70, 900, 62], ['💜', 520, 1290, 50], ['♬', 800, 1300, 58],
    ];
    deco.forEach(([s, px, py, size]) => {
      x.font = body(size);
      x.fillText(s, px, py);
    });
    x.globalAlpha = 1;

    // Tarjeta clara
    x.fillStyle = 'rgba(255, 247, 255, 0.95)';
    this.roundRect(x, 90, 290, 900, 790, 56);
    x.fill();

    const fit = (text: string, px: number, maxW: number, font: (n: number) => string) => {
      while (px > 24) {
        x.font = font(px);
        if (x.measureText(text).width <= maxW) break;
        px -= 2;
      }
      x.font = font(px);
    };

    x.textAlign = 'center';
    const cx = W / 2;

    // Cabecera
    x.fillStyle = '#4a2f80';
    fit(c.game ?? 'MI PROGRESO ARMY', 38, 780, body);
    x.fillText(c.game ?? 'MI PROGRESO ARMY', cx, 372);

    // Nombre
    x.fillStyle = '#21152F';
    fit(c.name || 'ARMY', 96, 780, title);
    x.fillText(c.name || 'ARMY', cx, 490);

    // Rango
    x.fillStyle = '#6C3ACD';
    fit(`${c.rankIcon} ${c.rank}`, 48, 780, title);
    x.fillText(`${c.rankIcon} ${c.rank}`, cx, 575);

    // Puntos
    const big = c.game ? `+${c.points ?? 0}` : String(c.total);
    x.fillStyle = '#6C3ACD';
    fit(big, 190, 780, title);
    x.fillText(big, cx, 770);
    x.fillStyle = '#4a2f80';
    x.font = body(38);
    x.fillText(c.game ? 'puntos en esta partida' : 'puntos en total', cx, 830);

    // Estrellas
    if (c.game) {
      const n = c.levelStars ?? 0;
      x.font = title(84);
      [0, 1, 2].forEach((i) => {
        x.fillStyle = i < n ? '#f5b301' : 'rgba(33, 21, 47, 0.2)';
        x.fillText('★', cx - 110 + i * 110, 935);
      });
    } else {
      x.fillStyle = '#21152F';
      x.font = title(56);
      x.fillText(`⭐ ${c.totalStars} estrellas`, cx, 925);
    }

    // Racha y total
    x.fillStyle = '#21152F';
    x.font = body(42);
    const streak = `🔥 Racha de ${c.streak} ${c.streak === 1 ? 'día' : 'días'}`;
    x.fillText(c.game ? `${streak} · Total ${c.total} pts` : streak, cx, 1015);

    // Pie
    x.fillStyle = '#FFF7FF';
    x.font = title(56);
    x.fillText('¿Cuánto sabes de BTS? 💜', cx, 1175);
    x.fillStyle = '#F0C6E9';
    x.font = body(40);
    x.fillText(SITE, cx, 1240);

    return new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo crear la imagen'))), 'image/png')
    );
  }

  private roundRect(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }
}