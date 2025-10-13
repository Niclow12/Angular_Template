import { Component } from '@angular/core';
import { MenuHeaderComponent } from "./menu-header/menu-header.component";
import { MenuOptionsComponent } from "./menu-options/menu-options.component";

@Component({
  selector: 'app-side-menu',
  imports: [MenuHeaderComponent, MenuOptionsComponent],
  templateUrl: './side-menu.component.html'
})
export class SideMenuComponent { }
