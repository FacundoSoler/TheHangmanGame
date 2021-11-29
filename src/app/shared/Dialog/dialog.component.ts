import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonService } from "../common.service";
import { DataStorageService } from "../data-storage.service";
import { GameEngineService } from "../game-engine.service";
import { ILanguage } from "../language.interface";
import { TimerService } from "../timer.service";

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogMaterialComponent implements OnInit, AfterViewInit, OnDestroy {
  isDataAvailable = false;
  playerName = '';
  bonus = 0;
  languageTemplate: ILanguage;
  highScoreSubscription: Subscription;
  timer;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private commonService: CommonService,
  public gameEngineService: GameEngineService,
  private timerService: TimerService,
  private dataStorageService: DataStorageService,
  private changeDetector: ChangeDetectorRef,
  private route: Router) {}

  ngOnInit() {
    if(!this.commonService.language) {
      this.languageTemplate = this.commonService.setLanguage('EN');
    } else {
      this.languageTemplate = this.commonService.language;
    }
    this.commonService.languageSubject.subscribe(() => {
      this.languageTemplate = this.commonService.language;
    })

    if(this.gameEngineService.checkMatch() || this.gameEngineService.checkFullMatch()){
      this.isDataAvailable = true;
      return;
    }
    this.gameEngineService.gameOver = true;
    this.gameEngineService.hasNewHighScore = false;
    this.highScoreSubscription = this.gameEngineService.getHighScores().subscribe(res => {
      this.dataStorageService.data = res;
      this.gameEngineService.hasNewHighScore = this.gameEngineService.isNewHighScore();
      this.isDataAvailable = true;
     });
  }
  ngOnDestroy() {
    if(this.highScoreSubscription)
      this.highScoreSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.changeDetector.detectChanges();
  }
  onCloseDialog(){
    this.commonService.stopAudio();
    if(this.gameEngineService.hasNewHighScore) {
      this.dataStorageService.saveHighScore({
        name: this.playerName, round: this.gameEngineService.round, totalSeconds: this.timerService.totalTimeString(),
        averageSeconds: this.timerService.averageRoundTime(this.gameEngineService.round), timeStamp: new Date()
      }).then(res => {
        this.route.navigate(['/highscores'], {queryParams: {id: res.id, p: 1}});
      }, err => console.log(err));
    } 
    if(this.gameEngineService.gameOver) {
      this.route.navigate(['/highscores'], {queryParams: {p: 1}});
      }
  }
}
