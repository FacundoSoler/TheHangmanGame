import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class TimerService {
  FULL_DASH_ARRAY = 283;
  TIME_LIMIT_ORIGINAL = 60;
  TIME_LIMIT = this.TIME_LIMIT_ORIGINAL;
  TOTAL_TIME_ELAPSED = 0;
  TIME_TO_ADD = 20;
  WARNING_THRESHOLD = this.TIME_LIMIT * 0.5;
  ALERT_THRESHOLD = this.TIME_LIMIT * 0.25;
  COLOR_CODES = {
   info: {
     color: "green"
   },
   warning: {
     color: "orange",
     threshold: this.WARNING_THRESHOLD
   },
   alert: {
     color: "red",
     threshold: this.ALERT_THRESHOLD
   }
 };
  timePassed = 0;
  timeLeft = this.TIME_LIMIT;
  timerInterval = null;
  remainingPathColor = this.COLOR_CODES.info.color;
  timerSubject = new Subject();

 onTimesUp() {
  this.TIME_LIMIT = this.TIME_LIMIT_ORIGINAL;
  clearInterval(this.timerInterval);
  this.timerSubject.next();
}

startTimer() {
  this.timePassed = 0;
  this.updateColourAlerts();
  this.timerInterval = setInterval(() => {
    this.TOTAL_TIME_ELAPSED = this.TOTAL_TIME_ELAPSED + 1;
    this.timePassed = this.timePassed += 1;
    this.timeLeft = this.TIME_LIMIT - this.timePassed;
    document.getElementById("base-timer-label").innerHTML = this.formatTime(
      this.timeLeft
    );
    this.setCircleDasharray();
    this.setRemainingPathColor(this.timeLeft);

    if (this.timeLeft === 0) 
      this.onTimesUp();
  }, 1000);
}
resetTimer(){
  this.TIME_LIMIT = this.TIME_LIMIT_ORIGINAL;
  this.TOTAL_TIME_ELAPSED = 0;
  this.startTimer();
}
stopTimer() {
  window.clearInterval(this.timerInterval);
}

addTime(addingTime: number) {
  this.TIME_LIMIT = this.timeLeft + addingTime;
  this.updateColourAlerts();
}
updateColourAlerts() {
  this.WARNING_THRESHOLD = this.TIME_LIMIT * 0.5;
  this.ALERT_THRESHOLD = this.TIME_LIMIT * 0.25;
  this.COLOR_CODES.warning.threshold = this.WARNING_THRESHOLD;
  this.COLOR_CODES.alert.threshold = this.ALERT_THRESHOLD;
}
totalTimeString() {
  let time = this.TOTAL_TIME_ELAPSED;
    let minutes = Math.floor((time / 60));
    let seconds = (time - (minutes * 60)).toString();
    if(seconds.toString().length === 1) {
      seconds = '0' + seconds;
    }
    let totalTimeElapsed = minutes + ':' + seconds;
    return totalTimeElapsed;
}
averageRoundTime(lastRound: number) {
   return Math.round(this.TOTAL_TIME_ELAPSED / lastRound);
}

 formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds: any = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = this.COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  } else {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(alert.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  }
}

 calculateTimeFraction() {
  const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
  return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
}

 setCircleDasharray() {
  const circleDasharray = `${(
    this.calculateTimeFraction() * this.FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
}
