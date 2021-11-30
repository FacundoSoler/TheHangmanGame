import * as WordList from '../word-bank.json';
import * as WordListSpanish from '../word-bank-spanish.json';
import { Subject } from "rxjs";
import { ILanguage } from './language.interface';
import { ElementRef } from '@angular/core';

export class CommonService {
  language: ILanguage;
  languageSelected: string;
  languageSubject = new Subject<void>();
  isGameOverSubject = new Subject<boolean>();
  audio: HTMLAudioElement;
  audioOn = true;

  playAudio(fileName: string) {
    if(this.audioOn) {
      this.audio = new Audio('../../assets/' + fileName + '.mp3');
      this.audio.play();
    }
  }
  stopAudio() {
    if(this.audio)
    this.audio.src = null;
  }
  setAudioMode(control: ElementRef) {
    this.audioOn = !this.audioOn;
    this.audioOn ? control.nativeElement.src = '../../assets/audio_on.gif': control.nativeElement.src = '../../assets/audio_off.gif' ;
  }
  setLanguage(chosenLanguage: string) {
    this.languageSelected = chosenLanguage;
    switch(chosenLanguage) {
      case 'SPA':
      this.language = {
        hangmanSection: {
          round: 'Ronda',
          hiddenWord: 'Palabra oculta',
          wordStreak: 'Palabras adivinadas',
          lettersEntered: 'Seleccione letra',
          guessWord: 'Palabra',
          guessButton: 'Adivinar',
          enterLetter: 'Letra',
          restart: 'Recomenzar',
          lives: 'Vidas',
          startGame: 'COMENZAR JUEGO',
          totalTime: 'Tiempo Total',
          timeLeft: 'Tiempo Restante',
          seconds: 'segundos',
          failMessage: 'Tienes X vidas restantes',
          successMessage: '... Excelente ! Sigue así ! ...'
        },
        hangmanDialogSection: {
          roundResults: 'Ronda',
          results: 'Resultados',
          failure: 'No has adivinado la palabra ... Intenta nuevamente !',
          success: 'Adivinaste la palabra ! Felicitaciones !',
          hiddenWord: 'La palabra secreta era',
          livesLeft: 'Vidas Restantes',
          wordsGuessed: 'Palabras Adivinadas',
          totalTime: 'Tiempo Total',
          averageTime: 'Tiempo Promedio por Ronda',
          OKbutton: 'Continuar',
          bonus: 'segundos agregados como Bonus',
          newHighScore: 'Has alcanzado un nuevo Puntaje Máximo !',
          highScoreName: 'Ingresa tu Nombre'
        },
        menuSection: {
          flagRoute: '../../assets/Spain_Flag.png',
          play: 'Jugar',
          highScores: 'Puntuaciones Máximas',
          multiplayer: 'Multijugador'
        },
        footer: {
          footer: 'Este juego fue desarrollado por Facundo Soler. Todos los derechos reservados 2021.'
        },
        highScoresSection: {
          title: 'Top 10 Puntuaciones Máximas',
          name: 'Nombre',
          round: 'Ronda',
          totalTime: 'Tiempo Total',
          date: 'Fecha',
          playAgain: 'Jugar de nuevo'
        }
      };
      break;

      case 'EN':
        this.language = {
        hangmanSection: {
          round: 'Round',
          hiddenWord: 'Hidden Word',
          wordStreak: 'Word Streak',
          lettersEntered: 'Select Letters',
          guessWord: 'Word',
          guessButton: 'Guess',
          enterLetter: 'Letter',
          restart: 'Restart',
          lives: 'Lives',
          startGame: 'START GAME',
          totalTime: 'Total Time',
          timeLeft: 'Time Left',
          seconds: 'seconds',
          failMessage: 'You have X lives left',
          successMessage: '... Excellent ! You are doing great ! ...'
        },
        hangmanDialogSection: {
          roundResults: 'Round',
          results: 'Results',
          failure: 'You did not guess the word... Better luck next time !',
          success: 'You guessed the word ! Congratulations !',
          hiddenWord: 'The hidden word was',
          livesLeft: 'Lives left',
          wordsGuessed: 'Words guessed',
          totalTime: 'Total Time',
          averageTime: 'Average Round Time',
          OKbutton: 'Continue',
          bonus: 'seconds added as Bonus',
          newHighScore: 'You have set a new High Score !',
          highScoreName: 'Enter your Name'
        },
        menuSection: {
          flagRoute: '../../assets/NZ_Flag.png',
          play: 'Play',
          highScores: 'High Scores',
          multiplayer: 'Multiplayer'
        },
        footer: {
          footer: 'This game was developed by Facundo Soler. All rights reserved 2021.'
        },
        highScoresSection: {
          title: 'Top 10 Highest Scores',
          name: 'Name',
          round: 'Round',
          totalTime: 'Total Time',
          date: 'Date',
          playAgain: 'Play Again'
        }
      };
        break;
    }
    this.languageSubject.next();
    return this.language;
  }
  setDictionary(languageSelected: string) {
    switch(languageSelected) {
      case 'EN':
        return WordList.default;
     case 'SPA':
      return WordListSpanish.default;
    }
  }
  changeActiveMenu(optionId) {
    var current = document.getElementsByClassName('active');
    current[0].classList.remove('active');
    const newActiveOption = document.getElementById(optionId);
    newActiveOption.classList.add('active');
  }
}
