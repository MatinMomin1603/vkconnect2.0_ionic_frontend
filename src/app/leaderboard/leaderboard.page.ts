import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  myData: any;
  from: any;
  isShow: boolean = false;
  isDeviceReady: number;
  quiz_id: any;
  device: string;
  type = 'today';
  userObj: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private platform: Platform,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.quiz_id = params['quiz_id'];
    });
  }

  ionViewWillEnter() {
    this.userObj = JSON.parse(localStorage.getItem('userObj'));
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.device = 'android';
      } else if (this.platform.is('ios')) {
        this.device = 'ios';
      } else if (this.platform.is('desktop')) {
        this.device = 'desktop';
      } else {
        //fallback to browser APIs or
      }
    });
    this.from = JSON.parse(localStorage.getItem('onReportFrom'))
    this.myData = JSON.parse(localStorage.getItem('userD'));
    if (this.from == 'leaderBoard') {
      this.getQuizWiseLeaderBoard(this.userObj?.user_id, this.quiz_id)
    }
    else {
    }
  }

  report: any = []

  ngOnInit() {
  }

  segmentChanged(ev: any) {
  }

  ngOnDestroy(): void {
    localStorage.removeItem('onReportFrom');
  }

  /* Quiz Wise LeaderBoard */
  getQuizWiseLeaderBoard(user_id, quiz_id: any) {
    this.apiService.presentCustomLoader().then(() => {
      this.apiService.quizWiseleaderBoard(user_id, quiz_id).subscribe((response: any) => {
        this.report = response.data;
        this.isShow = true;
        this.apiService.dismissCustomLoader();
        if (response.success == false) {
        }
      }, (error: HttpErrorResponse) => {
        this.apiService.dismissCustomLoader();
      });
    });
  }
}
