import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() {
    const url = localStorage.getItem('theme') || './assets/css/colors/blue-dark.css';
    this.linkTheme?.setAttribute('href', url);
   }


  changeTheme(theme: string){
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme(): void {

    const links: NodeListOf<Element> = document.querySelectorAll('.selector');

    links.forEach( l => {
      l.classList.remove('working');
      const eleTheme = l.getAttribute('data-theme');
      const btnUrl = `./assets/css/colors/${eleTheme}.css`
      const currentTheme = this.linkTheme?.getAttribute('href');
      if(btnUrl === currentTheme){
        l.classList.add('working');
      }
    });
  }

}
