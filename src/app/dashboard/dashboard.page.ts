/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import * as moment from 'moment';
import { map, retry, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  moment: any = moment;
  percent: any = 50;
  quiz_list: any;
  myData: any;
  activeQuiz: any = [];
  summary: any = [];
  canResume: boolean = false;
  attended_questions: any;
  myScoreCard: any;
  timeLeft: number;
  remainingTime: any;
  customLoader: any;
  spinner: boolean = false;
  quiz_ids: any = [];
  currentQuiz: any;
  device: any;
  userId: any;
  userData: any;
  oddArray: any = [];
  evenArray: any = [];
  today = new Date();
  todaysQuiz: any;
  array: any = [
    {
      _id: '6336a7256673164ea1d1723b',
      image: 'assets/images/uterine.jpg'
    },
    {
      _id: '6353d44579e497ce88f9cf6b',
      image: 'assets/images/breast_cancer.jpg'
    },
    {
      _id: '635fc5f9a18c8756f212307b',
      image: 'assets/images/cervical.jpg'
    },
    {
      _id: '636a0741e326cee1c7d276ea',
      image: 'assets/images/pph.jpg'
    },

  ];
  userObj: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    public loadingController: LoadingController,
    private platform: Platform,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.route.queryParams.subscribe((params: any) => {
        if (typeof params._id != 'undefined' && params._id != null && typeof params.speciality != 'undefined' && params.speciality != null) {
          const obj = {
            user_id: params?._id,
            speciality: params.speciality
          };
          localStorage.setItem('userObj', JSON.stringify(obj));
        }
      });
    }, 2000);
  }

  ngOnDestroy(): void {
  }

  ionViewWillLeave() {
  }

  ionViewWillEnter() {
    this.userObj = JSON.parse(localStorage.getItem('userObj'));
    this.oddArray = [];
    this.evenArray = [];
    setTimeout(() => {
      this.myData = JSON.parse(localStorage.getItem('userD'));
      this.getQuizList(this.userObj?.speciality);
    }, 200);
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

    this.canResume = false;
    this.myScoreCard = {};
    this.myScoreCard.percentage = 0;
  }

  gotoReport(from: any, quiz_id: any) {
    localStorage.setItem('onReportFrom', JSON.stringify(from));
    this.router.navigate(['/quiz/leaderboard'], { queryParams: { quiz_id, _id: this.userObj?.user_id } });
  }

  async getProfileData() {
    this.apiService.getUserData(this.userId).subscribe(
      (response: any) => {
        this.userData = response?.data;
        localStorage.setItem('userD', JSON.stringify(response?.data));
        this.userObj = JSON.parse(localStorage.getItem('userD'));
        if (this.userData) {
          this.getQuizList(this.userObj?.speciality);
        }
      },
      (error) => {
      }
    );
  }

  getQuizList(speciality: any) {
    this.apiService.presentCustomLoader().then(() => {
      this.apiService.getActiveQuizList(speciality).pipe(retry(2)).subscribe((response: any) => {
        this.quiz_list = response.data;
        // this.quiz_list = this.quiz_list?.map(v => ({ ...v, ...this.array?.find(sp => sp._id === v._id) }));
        if (!response.data) {
          this.apiService.dismissCustomLoader();
        }
        this.quiz_ids = response?.data?.map((e: any) => e = e._id);
        this.activeQuiz = this.quiz_list?.filter((e: any) => e.is_activate == true);
        // this.apiService.dismissCustomLoader();
        if (this.activeQuiz?.length) {
          this.quizSummary(this.userObj?.user_id, this.quiz_ids);
          // this.apiService.dismissCustomLoader();
        }
      }, (error: HttpErrorResponse) => {
        this.apiService.dismissCustomLoader();
      });
    });
  }

  myScorecard(user_id: any) {
    this.presentCustomLoader().then(() => {
      this.apiService.myScoreCard(user_id).subscribe((response: any) => {
        this.myScoreCard = response.data;
        if (this.myScoreCard == null) {
          this.myScoreCard = {};
          this.myScoreCard.percentage = 0;
        }
        this.dismissCustomLoader();
      }, (error: HttpErrorResponse) => {
        this.dismissCustomLoader();
      });
    });
  }

  quizSummary(user_id: any, quiz_ids: any) {
    this.today = new Date();
    const data = {
      user_id,
      quiz_ids
    };
    this.apiService.quizSummaries(data).subscribe((response: any) => {
      this.summary = response.data;
      this.apiService.dismissCustomLoader();
      const firstObj = this.quiz_list?.filter(element => moment(element.scheduled_at).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD'));
      if (firstObj.length) {
        this.todaysQuiz = firstObj[0];
        this.quiz_list.splice(this.quiz_list.findIndex(element => moment(element.scheduled_at).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD')), 1);
      }
      else {
        this.todaysQuiz = null;
      }

      this.quiz_list = this.quiz_list?.map(v => ({ ...v, ...this.summary?.find(sp => sp.quiz_id === v._id) }));
      for (let i = 0; i < this.quiz_list.length; i++) {
        if (i % 2 != 0) {
          this.oddArray.push(this.quiz_list[i]);
        }
        else {
          this.evenArray.push(this.quiz_list[i]);
        }
      }
      if (response.success == false) {
      }
    }, (error: HttpErrorResponse) => {
      this.apiService.dismissCustomLoader();
    });
  }

  resume() {
    if (this.activeQuiz[0]?.questions.length && this.summary?.answers.length && this.activeQuiz[0]?.questions.length != this.summary?.answers.length) {
      localStorage.setItem('activeQuestion', JSON.stringify(this.attended_questions));
      this.router.navigate(['/quiz/questions']);
    }
  }


  goToQuestions(quiz_id: any, quiz_data: any, is_completed: any, i: any, type: any) {
    localStorage.setItem('quiz_id', JSON.stringify(quiz_id));
    this.currentQuiz = this.summary?.filter((e: any) => e.quiz_id == quiz_id);

    if ((this.currentQuiz?.length && quiz_data?.questions?.length && this.currentQuiz[0]?.total && quiz_data?.questions?.length == this.currentQuiz[0]?.total) || is_completed == true) {
      localStorage.setItem('onSummaryFrom', JSON.stringify('quiz/dashboard'));
      this.router.navigate(['quiz/summary']);
    }
    else if (this.currentQuiz?.length && quiz_data?.questions?.length && this.currentQuiz[0]?.total && quiz_data?.questions?.length != this.currentQuiz[0]?.total) {
      localStorage.setItem('activeQuestion', JSON.stringify(this.currentQuiz[0]?.total));
      this.router.navigate(['/quiz/questions'],{ queryParams: {quizid: quiz_id, title: quiz_data.quiz_name, image_url: quiz_data.image} });
    }
    else {
      if (type == 'odd') {
        this.oddArray[i].spinner = true;
      }
      else if (type == 'even') {
        this.evenArray[i].spinner = true;
      }
      this.apiService.registerForQuiz({ user_id: this.userObj?.user_id, quiz_id }).subscribe((response: any) => {
        if (type == 'odd') {
          this.oddArray[i].spinner = false;
        }
        else if (type == 'even') {
          this.evenArray[i].spinner = false;
        }
        this.router.navigate(['quiz/questions'],{ queryParams: { quizid: quiz_id, title: quiz_data.quiz_name, image_url: quiz_data.image} });

        if (response.success == false) {
        }
      }, (error: HttpErrorResponse) => {
        if (type == 'odd') {
          this.oddArray[i].spinner = false;
        }
        else if (type == 'even') {
          this.evenArray[i].spinner = false;
        }
      });
    }
  }

  replay(quiz_id: any) {
    localStorage.setItem('quiz_id', JSON.stringify(quiz_id));
    const data = {
      type: 'replay'
    };
    this.apiService.addAnswers(this.userObj?.user_id, quiz_id, data).subscribe((response: any) => {
      this.router.navigate(['quiz/questions']);
      if (response.success == false) {
      }
    }, (error: HttpErrorResponse) => {
    });
  }

  /* LOADERS */

  async presentCustomLoader() {
    this.customLoader = await this.loadingController.create({
      translucent: false,
      spinner: 'lines',
      message: 'Loading!...',
      animated: true,
      backdropDismiss: true,
      cssClass: 'custom-loading-class',
    });
    await this.customLoader.present();
  }

  async dismissCustomLoader() {
    await this.customLoader.dismiss();
  }

}
