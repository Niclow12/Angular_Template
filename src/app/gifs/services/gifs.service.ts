import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient)

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory =signal<Record<string, Gif[]>>({});

  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

  constructor() {
    this.loadTrendingGifs();
    console.log('Servicio de GIFS inicializado');
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20
        }
      }).subscribe((resp) => {
        const gifs = GifMapper.mapGiphtItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        console.log('Gifs Transformados: ', gifs);
      })
  }

  searchGifs(query: string) {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          q: query,
          limit: 20
        }
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphtItemsToGifArray(items)),
        tap(items => {
          this.searchHistory.update( history => ({
            ...history,
            [query.toLowerCase()]: items,
          }))
          // console.log('Gifs Por search: ', items);
        })

        // TODO: Historial

      )

    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphtItemsToGifArray(resp.data);
    //   this.gifSearch.set(gifs);
    //   this.trendingGifsLoading.set(false);
    //   console.log('Gifs Por search: ', gifs);
    // })
  }

}