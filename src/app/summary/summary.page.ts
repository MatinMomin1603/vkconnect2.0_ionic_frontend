/* eslint-disable @typescript-eslint/semi */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { PopUpsPage } from '../dialogs/pop-ups/pop-ups.page';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  dataReturned: any;
  myData: any;
  from: any;
  quiz_id: any;
  summary: any = [];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  isShow: boolean = false;
  onSummaryFrom: any;
  quiz_data: any;
  isDeviceReady: number;
  device: string;
  modelData: any;
  userObj: any;


  constructor(
    private router: Router,
    public popoverCtrl: PopoverController,
    private platform: Platform,
    private apiService: ApiService,
    public modalController: ModalController
  ) { }

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

    if (document.documentElement.clientWidth >= 768) {
      this.isDeviceReady = 0;
    } else if (document.documentElement.clientWidth <= 768) {
      this.isDeviceReady = 1;
    }
    this.from = JSON.parse(localStorage.getItem('onReportFrom'))
    this.myData = JSON.parse(localStorage.getItem('userD'));
    this.quiz_id = JSON.parse(localStorage.getItem('quiz_id'));
    this.onSummaryFrom = JSON.parse(localStorage.getItem('onSummaryFrom'));
    this.quizSummary(this.userObj?.user_id, this.quiz_id)
  }


  ngOnInit() {
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    localStorage.removeItem('onSummaryFrom');
  }

  ionViewWillLeave() {
    localStorage.removeItem('onSummaryFrom');
  }

  quizSummary(user_id: any, quiz_id: any) {
    this.apiService.presentCustomLoader().then(() => {
      this.apiService.quizSummary(user_id, quiz_id).subscribe((response: any) => {
        this.apiService.dismissCustomLoader();
        this.summary = response.data;
        this.isShow = true;
        if (response.success == false) {
        }
      }, (error: HttpErrorResponse) => {
        this.apiService.dismissCustomLoader();
      });
    });
  }


  async explanation(explanation: any) {
    const modal = await this.modalController.create({
      component: PopUpsPage,
      cssClass: 'custom-modal',
      componentProps: {
        "modelId": 1,
        "data": explanation,
      }
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
      }
    });
    return await modal.present();
  }

  async thanksPopup() {
    const modal = await this.modalController.create({
      component: PopUpsPage,
      cssClass: this.device == 'desktop' ? 'thanks-modal' : this.device == 'android' ? 'thanks-modal-mobile-android' : 'thanks-modal-mobile-ios',
      componentProps: {
        "modelId": 2,
      }
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        if (this.modelData == 'submitted') {
          this.congrats();
        }
      }
    });
    return await modal.present();
  }


  async congrats() {
    const modal = await this.modalController.create({
      component: PopUpsPage,
      cssClass: this.device == 'desktop' ? 'thanks-modal' : this.device == 'android' ? 'congrats-modal-mobile-android' : 'congrats-modal-mobile',
      componentProps: {
        "modelId": 3,
      }
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        this.router.navigate(['quiz/dashboard']);
      }
    });
    return await modal.present();
  }

  async welcomePopup() {
    const popover = await this.popoverCtrl.create({
      component: PopUpsPage,
      componentProps: {
        "paramID": 15,
      },

      animated: true,
      showBackdrop: false,
      mode: "md",
      backdropDismiss: true,
      cssClass: 'my-quiz-pop',

    });
    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data == undefined) {
        return;
      }
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        if (this.dataReturned == 'submitted') {

        }
      }
    });
    return await popover.present();
  }


  async feedback() {
    const modal = await this.modalController.create({
      component: PopUpsPage,
      cssClass: this.device == 'desktop' ? 'feedback-modal' : 'feedback-modal-mobile-android',
      componentProps: {
        "modelId": 4,
      }
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        if (this.modelData == 'submitted') {
          this.thanksPopup();
        }
      }
    });
    return await modal.present();
  }
}
