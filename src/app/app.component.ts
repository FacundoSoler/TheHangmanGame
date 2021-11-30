import { Component, OnInit } from '@angular/core';
import { CommonService } from './shared/common.service';
import { ILanguage } from './shared/language.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'HangmanFS';
  languageTemplate: ILanguage;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.languageTemplate = this.commonService.setLanguage('EN');
    this.commonService.languageSubject.subscribe(() => {
       this.languageTemplate = this.commonService.language;
    });
  }

  onActivate(event) {
     window.scroll(0,0);
  }

  onGameOver(event) {
    console.log('onGameOver AppComponent');
    console.log(event);
  }
}
