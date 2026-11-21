import { Component, Input, computed, signal } from '@angular/core';
import { Product } from '../../core/models/product.model';

const ICONS: Record<string, string> = {
  lightstick: '💜',
  album: '💿',
  ropa: '👕',
  accesorio: '🎀',
  otro: '🛍️',
};

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private _p = signal<Product | null>(null);

  @Input({ required: true }) set product(v: Product) {
    this._p.set(v);
  }
  get product(): Product {
    return this._p()!;
  }

  imgOk = signal(true);

  icon = computed(() => ICONS[this._p()?.category ?? 'otro']);

  discount = computed(() => {
    const p = this._p();
    if (!p?.price || !p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  });

  money(n: number) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);
  }

  checked(iso: string) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}