import { CommonService } from "./common.service";
import { Injectable } from "@angular/core";
import { TimerService } from "./timer.service";
import { Subscription } from "rxjs";
import { DataStorageService } from "./data-storage.service";

export class ILetters {
    letter: string;
    CssClass: string;
  }
@Injectable({providedIn: 'root'})
export class GameEngineService{
    gameOver = false;
    hasNewHighScore = false;
    startingLives = 10;
    guessBonus = 20;
    FullMatchBonus = 30;
    lastBonusAdded = 0;
    currentLives: string[] = [];
    wordsGuessedStreak = 0;
    round = 1;
    availableWords: string[];
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");
    chosenWord: string;
    guessedWord: string;
    fullWord: string;
    hiddenWord: string[];
    allLetters: Array<ILetters> = [];
    enteredLetters: Array<ILetters> = [];
    highScoreSubscription = new Subscription();

    constructor(private commonService: CommonService,
        private timerService: TimerService,
        private dataStorageService: DataStorageService){
    }

    setAllLetters(){
        if(this.allLetters.length > 0){
         for(let i=0; i< this.allLetters.length;i++){
           this.allLetters[i].CssClass = "defaultStyle";
         }
        }else
         this.alphabet.forEach(t => this.allLetters.push({CssClass: "defaultStyle", letter: t}));
       }
    isNewLetter(value: string){
        if(this.enteredLetters){
           const index = this.enteredLetters.findIndex(i => i.letter  === value);
           if(index != -1){
               return false;
           }
        }
        return true;
    }
  
    isLetterInWord(value: string) {
        let isLetterInWord = false;
        let chosenWordLetters = this.chosenWord.split('');
        for (let i = 0; i < chosenWordLetters.length; i++) {
          if (chosenWordLetters[i] === value) {
            isLetterInWord = true;
            this.hiddenWord[i] = value;
          }
        }
        this.guessedWord = this.hiddenWord.join("");
        return isLetterInWord;
      }
    setLives(){
        this.currentLives = [];
        for(let i = 0; i < this.startingLives; i++) {
          this.currentLives.push('♥');
        }
    }
    chooseNewWord() {
        this.hiddenWord = [];
        let index = Math.floor(Math.random() * this.availableWords.length);
        this.chosenWord = this.availableWords[index].toUpperCase();
        for (let i = 0; i < this.chosenWord.length; i++) {
          this.hiddenWord.push('_');
        }
        this.enteredLetters = [];
      }
    loseLife(){
        this.currentLives = this.currentLives.slice(0, this.currentLives.length-1);
        this.commonService.playAudio('negativeBeep');
    }
    isWordCompleted(){
        this.commonService.playAudio('Sparkle');
        const completedWord = this.hiddenWord.indexOf("_", 0);
        if(completedWord < 0) {
          this.wordsGuessedStreak++;
          return true;
        }
        return false;
    }
    checkMatch(){
        if(this.chosenWord == this.guessedWord){
            this.lastBonusAdded = this.guessBonus;
            this.timerService.addTime( this.lastBonusAdded);
            this.commonService.playAudio('win');
            return true;
        }
        return false;
    }
    checkFullMatch(){
        if(this.chosenWord == this.fullWord){
            this.lastBonusAdded = this.FullMatchBonus;
            this.timerService.addTime( this.lastBonusAdded);
            this.commonService.playAudio('Thug');
            return true;
        }
        return false;
    }
    hasLivesLeft(){
        if(this.currentLives.length === 0) {
            this.commonService.playAudio('gameOver');
            this.gameOver = true;
            return false;
           }
        return true;
    }
    endGame() {
       this.timerService.stopTimer();
       this.gameOver = true;
    }
    isNewHighScore() {
        return this.dataStorageService.isNewHighScore(this.timerService.TOTAL_TIME_ELAPSED, this.round);
    }
    getHighScores(){
        return this.dataStorageService.getHighScores();
    }
}