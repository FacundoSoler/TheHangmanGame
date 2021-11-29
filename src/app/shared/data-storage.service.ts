import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export interface IHighScore {
  name: string;
  round: number;
  totalSeconds: string;
  averageSeconds: number;
  timeStamp: Date;
}
@Injectable({providedIn: 'root'})
export class DataStorageService {
  data: any = null;
  constructor(private fireStore: AngularFirestore) {
  }

   getHighScores() {
     return this.fireStore
     .collection('highScores', ref => ref.orderBy('round', 'desc').orderBy('totalSeconds', 'asc').limit(10))
     .snapshotChanges();
  } 
  async getAllHighScores() {
    const document = this.fireStore.collection('highScores').doc('GiZzjgewbQ1MyvKt9me8');
    const doc = await document.get();
 }

   saveHighScore(data: IHighScore) {
      return this.fireStore
      .collection('highScores')
      .add(data);
   }

    isNewHighScore(totalSeconds: number, round: number) {
      const secondsTop10 = this.data[this.data.length - 1].payload.doc.data().totalSeconds;
      const roundTop10: number = this.data[this.data.length - 1].payload.doc.data().round;
      const index = secondsTop10.indexOf(":", 0);
      const minutes: number = +secondsTop10.slice(0, index);
      const seconds: number = +secondsTop10.slice(index +1 , secondsTop10.length);
      const sum: number = (minutes * 60) + seconds;

      if(round > roundTop10) 
        return true;
      if(round === roundTop10) {
        if(totalSeconds < sum) 
          return true;
      }
      return false;
  }
}
