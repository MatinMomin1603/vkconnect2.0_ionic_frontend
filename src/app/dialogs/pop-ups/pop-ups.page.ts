import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, NavParams, LoadingController, AlertController, ModalController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pop-ups',
  templateUrl: './pop-ups.page.html',
  styleUrls: ['./pop-ups.page.scss'],
})
export class PopUpsPage implements OnInit {
  @Input() modelId: any;
  @Input() data: any;
  rating: any;
  myData: any;
  quiz_id: any;
  number: number;
  color: string;
  currentValue: number;
  from: any;
  device: string;
  stars: any = [
    {
      img: 'assets/icon/star.svg',
      img_fill: 'assets/icon/star-fill.svg',
      isSelect: true
    },
    {
      img: 'assets/icon/star.svg',
      img_fill: 'assets/icon/star-fill.svg',
      isSelect: false
    },
    {
      img: 'assets/icon/star.svg',
      img_fill: 'assets/icon/star-fill.svg',
      isSelect: false
    },
    {
      img: 'assets/icon/star.svg',
      img_fill: 'assets/icon/star-fill.svg',
      isSelect: false
    },
    {
      img: 'assets/icon/star.svg',
      img_fill: 'assets/icon/star-fill.svg',
      isSelect: false
    },
  ]
  userObj: any;

  constructor(
    public popOverCtrl: PopoverController,
    public navParams: NavParams,
    public apiService: ApiService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private platform: Platform,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.userObj = JSON.parse(localStorage.getItem('userObj'));
    this.myData = JSON.parse(localStorage.getItem('userD'));
    this.quiz_id = JSON.parse(localStorage.getItem('quiz_id'));
    this.from = JSON.parse(localStorage.getItem('onFeedbackFrom'));
    if (this.modelId == 4) {
      this.quiz_id = JSON.parse(localStorage.getItem('quiz_id'));
      setTimeout(() => {
        this.number = 0;
        this.color = "success";
        this.rating = 1;
      }, 200);
    }

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
  }

  ionViewWillLeave() {
    localStorage.removeItem('onFeedbackFrom');
  }



  close(data: any) {
    this.popOverCtrl.dismiss(data);
  }

  async closeModel(type: any = 'closed') {
    await this.modalController.dismiss(type);
  }

  submitFeedback(type: any) {
    let data = {
      "type": "rating",
      "rating": this.rating
    }
    this.apiService.addAnswers(this.userObj?.user_id, this.quiz_id, data).subscribe(async (response: any) => {
      await this.modalController.dismiss(type);
      if (response.success == false) {
      }
    }, (error: HttpErrorResponse) => {
    });
  }

  rate(rate: any, index: any) {
    this.number = index;
    switch (this.number) {
      case 0:
        this.color = "success";
        this.rating = this.number + 1;
        this.stars[0].isSelect = true;
        this.stars[1].isSelect = false;
        this.stars[2].isSelect = false;
        this.stars[3].isSelect = false;
        this.stars[4].isSelect = false;
        break;
      case 1:
        this.color = "success";
        this.rating = this.number + 1;
        this.stars[0].isSelect = true;
        this.stars[1].isSelect = true;
        this.stars[2].isSelect = false;
        this.stars[3].isSelect = false;
        this.stars[4].isSelect = false;
        break;
      case 2:
        this.color = "success";
        this.rating = this.number + 1;
        this.stars[0].isSelect = true;
        this.stars[1].isSelect = true;
        this.stars[2].isSelect = true;
        this.stars[3].isSelect = false;
        this.stars[4].isSelect = false;
        break;
      case 3:
        this.color = "success";
        this.rating = this.number + 1;
        this.stars[0].isSelect = true;
        this.stars[1].isSelect = true;
        this.stars[2].isSelect = true;
        this.stars[3].isSelect = true;
        this.stars[4].isSelect = false;
        break;
      case 4:
        this.color = "success";
        this.rating = this.number + 1;
        this.stars[0].isSelect = true;
        this.stars[1].isSelect = true;
        this.stars[2].isSelect = true;
        this.stars[3].isSelect = true;
        this.stars[4].isSelect = true;
        break;
    }

  }


}
