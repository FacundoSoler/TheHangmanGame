import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../shared/common.service";
import { DataStorageService } from "../shared/data-storage.service";
import { ILanguage } from "../shared/language.interface";

@Component({
  selector: 'app-highScores',
  templateUrl: './high-score.component.html',
  styleUrls: ['./high-score.component.css']
})
export class HighScoreComponent implements OnInit {
  data: any = null;
  showHighScoresTable = false;
  highscoreId = '';
  redirectedFromPlay;
  languageTemplate: ILanguage;

  constructor(
    private dataStorageSevice: DataStorageService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
     this.setInitVariables();
     this.getData();
     window.scroll(0,0);
  }
  setInitVariables() {
    this.commonService.changeActiveMenu('HighScores');
    this.languageTemplate = this.commonService.language;

    this.commonService.languageSubject.subscribe(() => {
      this.languageTemplate = this.commonService.language;
    });
    this.route.queryParams.subscribe(params => {
      this.highscoreId = params['id'];
      params['p'] ? this.redirectedFromPlay = true: this.redirectedFromPlay = false;
    });
  }
  getData() {
    this.dataStorageSevice.getHighScores().subscribe((res) => {
      this.data = res;
      this.showHighScoresTable = true;
      this.dataStorageSevice.data = res;
   });
  }
  onPlayAgain() {
   this.router.navigate(['../hangman'], {queryParams: {p: 1}});
  }
}
