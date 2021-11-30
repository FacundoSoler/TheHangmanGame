import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogMaterialComponent } from './shared/dialog/dialog.component';
import { HourglassComponent } from './shared/hourglass/hourglass.component';
import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { FormsModule } from '@angular/forms';
import { HighScoreComponent } from './highScores/high-score.component';
import { RouterModule, Routes } from '@angular/router';
import { HangManComponent } from './hangman/hangman.component';
import { HeaderComponent } from './header/header.component';
import { CommonService } from './shared/common.service';
import { TimerService } from './shared/timer.service';
import { GameEngineService } from './shared/game-engine.service';

const routes: Routes = [
  {path: '', redirectTo: 'hangman', pathMatch:'full'},
  {path: 'hangman', component: HangManComponent},
  {path: 'highscores', component: HighScoreComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DialogMaterialComponent,
    HourglassComponent,
    HighScoreComponent,
    HangManComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [CommonService, TimerService, GameEngineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
