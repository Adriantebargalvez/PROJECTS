import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Watch } from './watch';

@Injectable({
  providedIn: 'root',
})
export class WatchCatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'https://tempolux-api.onrender.com';

  // El catálogo se pide una sola vez al backend y se comparte con shareReplay(1).
  // Así, si varios componentes se suscriben, sólo se hace una única petición HTTP.
  private readonly watches$ = this.http
    .get<Watch[]>(`${this.apiBaseUrl}/api/watches`)
    .pipe(shareReplay(1));

  getWatches(): Observable<Watch[]> {
    return this.watches$;
  }
}
