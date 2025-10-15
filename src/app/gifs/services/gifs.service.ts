import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs'

const loadFromLocalStorage = () => {
  const gifFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifFromLocalStorage)
  console.log("gifs from local storage: ", gifs)
  return gifs;
}


@Injectable({ providedIn: 'root' })
export class GifService {
  private http = inject(HttpClient)

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);



  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());

  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

  constructor() {
    this.loadTrendingGifs();    
  }

  saveToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString)
  })

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

  searchGifs(query: string): Observable<Gif[]> {
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
          this.searchHistory.update(history => ({
            ...history,
            [query.toLowerCase()]: items,
          }))
          // console.log('Gifs Por search: ', items);
        })

        // TODO: Historial

      )


  }



  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? []
  }

}