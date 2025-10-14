import { Component, input } from '@angular/core';
import { GifListItemComponent } from "./gif-list-item/gif-list-item.component";
import { Gif } from '../../interfaces/gif.interface';

interface imageUrls {
  url: string;
}
@Component({
  selector: 'gift-list',
  imports: [GifListItemComponent],
  templateUrl: './gift-list.component.html'
})
export class GiftListComponent {

  gifs = input.required<Gif[]>()

 }
