import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShopService } from '../../core/services/shop.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

type Cat = 'todos' | 'lightstick' | 'album' | 'ropa' | 'accesorio' | 'otro';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductCardComponent, RevealDirective],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {
  private svc = inject(ShopService);

  products = toSignal(this.svc.products$, { initialValue: [] });
  cat = signal<Cat>('todos');
  onlyDeals = signal(false);

  cats: { key: Cat; label: string }[] = [
    { key: 'todos', label: 'Todo' },
    { key: 'lightstick', label: '💜 Lightsticks' },
    { key: 'album', label: '💿 Álbumes' },
    { key: 'ropa', label: '👕 Ropa' },
    { key: 'accesorio', label: '🎀 Accesorios' },
    { key: 'otro', label: '🛍️ Otros' },
  ];

  stores = [
    { name: 'Weverse Shop', url: 'https://shop.weverse.io', note: 'Tienda oficial' },
    { name: 'Amazon', url: 'https://www.amazon.com/s?k=BTS+official', note: 'Verifica que sea oficial' },
    { name: 'Mercado Libre Colombia', url: 'https://listado.mercadolibre.com.co/bts', note: 'Cuidado con las imitaciones' },
  ];

  list = computed(() =>
    this.products().filter((p) => {
      const okCat = this.cat() === 'todos' || p.category === this.cat();
      const hasDeal = !!p.price && !!p.originalPrice && p.originalPrice > p.price;
      return okCat && (!this.onlyDeals() || hasDeal);
    })
  );
}