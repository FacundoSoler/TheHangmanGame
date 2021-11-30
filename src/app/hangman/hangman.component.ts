import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener,
   Injector, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../shared/common.service';
import { DialogMaterialComponent } from '../shared/dialog/dialog.component';
import { TimerService } from '../shared/timer.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ILanguage } from '../shared/language.interface';
import { GameEngineService } from '../shared/game-engine.service';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.css']
})
export class HangManComponent implements OnInit, OnDestroy {
  languageTemplate: ILanguage;
  message: string;
  messageClass = 'fail';
  defaultLetterClass = "defaultLetter";
  showSplashScreen = true;
  timerSubscription = new Subscription();
  @ViewChild("hangmanAnimation") hangmanAnimation: ElementRef;

  constructor(
    public dialog: MatDialog,
    public gameEngineService: GameEngineService,
    private commonService: CommonService,
    private timerService: TimerService,
    private actRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.setLanguage();
    this.actRoute.queryParams.subscribe(params => {
      params['p'] ? this.onStartGame(): null;
    });
  }
  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
    this.gameEngineService.highScoreSubscription.unsubscribe();
  }
  onStartGame() {
    this.setInitVariables();
  }
  onEndGame() {
    this.gameEngineService.endGame();
    this.showSplashScreen = true;
  }
  setInitVariables() {
    this.showSplashScreen = false;
    this.gameEngineService.gameOver = false;
    this.gameEngineService.round = 1;
    this.setDictionary();
    this.gameEngineService.chooseNewWord();
    this.resetTimer();
    this.setLives();
    this.gameEngineService.setAllLetters();
  }
  setDictionary() {
    this.gameEngineService.availableWords = this.commonService.setDictionary(this.commonService.languageSelected);
  }
  setLives() {
   this.gameEngineService.setLives();
   this.setHangManAnimation();
 }
 setHangManAnimation() {
  if(this.hangmanAnimation && this.gameEngineService.currentLives.length > 0) {
    this.hangmanAnimation.nativeElement.src =
    '../../assets/HangmanAnimation' + (this.gameEngineService.startingLives - this.gameEngineService.currentLives.length) + '.png';
  }
}
setLanguage() {
  if(!this.commonService.language)
    this.languageTemplate = this.commonService.setLanguage('EN');
  else {
    this.languageTemplate = this.commonService.language;
    this.commonService.languageSubject.subscribe(() => {
     this.languageTemplate = this.commonService.language;
    });
  }
}
clearControls(){
  window.scroll(0, 0);
  var guessedWord = <HTMLInputElement>document.getElementById('guessedWord');
  guessedWord.value = '';
  this.message = '';
  this.gameEngineService.enteredLetters = [];
  this.stopTimer();
}
showMessage(success: boolean) {
  this.message = this.languageTemplate.hangmanSection.failMessage.replace('X', this.gameEngineService.currentLives.length.toString());
  if(success)
    this.message = '... Excellent ! You are doing great ! ...';
  success === true ? this.messageClass = 'success' : this.messageClass = 'fail';
}
 loseLife() {
  this.gameEngineService.loseLife();
  this.showMessage(false);
  this.setHangManAnimation();

  if(!this.gameEngineService.hasLivesLeft()) 
    this.showRoundResults();
}
keepLife() {
  this.showMessage(true);
  if(this.gameEngineService.isWordCompleted()){
    this.showRoundResults();
  }
}
onSelectLetter(event) {
    let value: string = event.target.innerHTML;
    var isNewLetter = this.gameEngineService.isNewLetter(value);
    if (isNewLetter) {
     let indexLetter = this.gameEngineService.allLetters.findIndex(i => i.letter == value);
      if(!this.gameEngineService.isLetterInWord(value)) {
        this.loseLife();
         this.gameEngineService.allLetters[indexLetter].CssClass = "fail";
      } else {
        this.keepLife();
        this.gameEngineService.allLetters[indexLetter].CssClass = "success";
      }
      this.gameEngineService.enteredLetters.push({CssClass: "defaultLetter", letter: value});
    }
}
  resetTimer() {
    this.timerService.resetTimer();
    this.timerSubscription.unsubscribe();
    this.timerSubscription = this.timerService.timerSubject.subscribe(() => {
      this.outOfTime();
    })
  }
  startTimer() {
     this.timerService.startTimer();
  }
  stopTimer() {
    this.timerService.stopTimer();
  }
  outOfTime() {
    this.gameEngineService.endGame();
    this.showRoundResults();
  }
  onGuessWord(element: any) {
    this.gameEngineService.fullWord = element.value;
    this.showRoundResults();
  }
  nextRound() {
    this.clearControls();
    if(this.gameEngineService.currentLives.length === 0) {
      this.gameEngineService.round = 1;
      this.gameEngineService.wordsGuessedStreak = 0;
    } else {
      this.gameEngineService.round++;
    }
    this.startTimer();
    this.setLives();
    this.gameEngineService.chooseNewWord();
    this.gameEngineService.setAllLetters();
  }
  showRoundResults() {
    this.stopTimer();
    const dialog = this.dialog.open(DialogMaterialComponent, {
            disableClose: true,
            panelClass: ['custom-modalbox'],
            data: {
              totalTime: this.timerService.totalTimeString(),
              averageRoundTime: this.timerService.averageRoundTime(this.gameEngineService.round)
            }
    });
    dialog.afterClosed().subscribe((res) => {
            if(!this.gameEngineService.gameOver) 
              this.nextRound();
    });
  }
}
