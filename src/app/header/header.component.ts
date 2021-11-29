import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "../shared/common.service";
import { ILanguage } from "../shared/language.interface";
import { TimerService } from "../shared/timer.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   flagRoute = './assets/NZ_Flag.png';
   language: ILanguage;
   isGameOver = true;
   burgerVisible = false;
   @ViewChild('soundControl') soundControl: ElementRef;

  constructor(public  commonService: CommonService, private timerService: TimerService) {
  }

  ngOnInit() {
    this.setInitVariables();
  }
  setInitVariables() {
    this.commonService.languageSubject.subscribe(() => {
      this.language = this.commonService.language;
      this.flagRoute = this.commonService.language.menuSection.flagRoute;
    });
    this.commonService.isGameOverSubject.subscribe(isGameOverParam => {
       this.isGameOver = isGameOverParam;
    });
  }

  setAudioMode() {
    this.commonService.setAudioMode(this.soundControl);
  }

  onSelectLanguage(value) {
     this.language = this.commonService.setLanguage(value);
  }
  onActiveMenu(elementTarget) {
    this.timerService.stopTimer();
    this.commonService.isGameOverSubject.next(true);
    var current = document.getElementsByClassName('active');
    current[0].classList.remove('active');
    elementTarget.classList.add('active');
    this.burgerVisible ? this.onBurgerToggle(): null;
    window.scroll(0,0);
  }
  onBurgerToggle() {
    this.burgerVisible = true;
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

     // Toggle Nav
     nav.classList.toggle('nav-active');
     // Animate Links
    navLinks.forEach((link, index) => {
      let linkEl = <HTMLElement>link;
      if(linkEl.style.animation)
          linkEl.style.animation = '';
      else      
          linkEl.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
    });
    // Burger animation
    burger.classList.toggle('toggle');
  }
}
