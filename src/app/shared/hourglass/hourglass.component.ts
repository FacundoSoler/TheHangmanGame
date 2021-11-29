import { Component} from "@angular/core";
import { TimerService } from "../timer.service";

@Component({
selector: 'app-hourglass',
templateUrl: './hourglass.component.html',
styleUrls: ['./hourglass.component.css']
})
export class HourglassComponent {

 constructor(private timerService: TimerService) {

 }
 // Credit: Mateusz Rybczonec

 // All interaction with Hourglass component is done in the "timer.service"
}
