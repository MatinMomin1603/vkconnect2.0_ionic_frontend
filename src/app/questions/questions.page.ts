/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { IonSlides, PopoverController, LoadingController, Platform, ModalController } from '@ionic/angular';
import { PopUpsPage } from '../dialogs/pop-ups/pop-ups.page';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  dataReturned: any;
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  myData: any;
  isEndSlide = false;
  indexKey: any;
  quiz_data: any;
  loader: any;
  customLoader: HTMLIonLoadingElement;
  device: string;
  modelData: any;
  constructor(
    private router: Router,
    public popoverCtrl: PopoverController,
    private apiService: ApiService,
    public loadingController: LoadingController,
    private platform: Platform,
    public modalController: ModalController,
    public activatedroute: ActivatedRoute,
  ) { }
  sliderOne: any;
  quiz_id: any;
  question_list: any = [];
  isShow = false;
  todaysQuiz = false;


  gotoQuizSummary() {
    this.router.navigate(['/queans-report']);
  }

  formGroup!: FormGroup;
  question: any = [];
  option: any;
  activeQuestionObj: any;
  userObj: any;
  quizid: any;

  ngOnInit() {
    this.buildForm();
    this.activatedroute.paramMap.subscribe(params => {
       if(params.get('todaysQuiz')){
        this.todaysQuiz = true;
       }
    })
     this.activatedroute.queryParams.subscribe((params: any) => {
      if (typeof params._id != 'undefined' && params._id != null && typeof params.speciality != 'undefined' && params.speciality != null) {
        const obj = {
          user_id: params?._id,
          speciality: params.speciality
        };
        localStorage.setItem('userObj', JSON.stringify(obj));
      }

      if(typeof params.quizid != 'undefined' && params.quizid != null){
        this.quiz_id = params.quizid;
        this.todaysQuiz = false;
        localStorage.setItem('quiz_id', JSON.stringify(this.quiz_id));
      }
    });
  }

  ionViewWillEnter() {
    this.userObj = JSON.parse(localStorage.getItem('userObj'));
    this.myData = JSON.parse(localStorage.getItem('userD'));
    this.getQuestionList();
    this.indexKey = JSON.parse(localStorage.getItem('activeQuestion')) ? JSON.parse(localStorage.getItem('activeQuestion')) : 0;
    this.sliderOne =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: this.question_list
    };

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

  ngAfterViewInit() {
    setTimeout(() => {
      this.slideWithNav.lockSwipes(true);
    }, 1500);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('activeQuestion');
  }

  ionViewWillLeave() {
    localStorage.removeItem('activeQuestion');
  }

  slidesDidLoad(slides: IonSlides): void {
    if (this.indexKey) {
      setTimeout(() => {
        this.slideWithNav.slideTo(this.indexKey);
      }, 500);
      setTimeout(() => {
        if (this.indexKey == this.question_list.length - 1) {
          this.isEndSlide = true;
        }
        else {
          this.isEndSlide = false;
        }
      }, 1000);
    }
  }

  getTodaysQuiz(speciality){
    this.apiService.getTodaysQuiz(speciality).subscribe((response:any)=>{
      if(response.status){
        this.quiz_id = response.data[0]._id;
        localStorage.setItem('quiz_id', JSON.stringify(this.quiz_id));
      }
    })
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.question && changes.question.currentValue && !changes.question.firstChange) {
      this.formGroup.patchValue({ answer: '' });
    }
  }

  buildForm() {
    this.formGroup = new FormGroup({
      answer: new FormControl(['', Validators.required])
    });
  }

  async presentCustomLoader() {
    this.customLoader = await this.loadingController.create({
      translucent: false,
      spinner: 'lines',
      message: 'Downloading please wait!...',
      animated: true,
      backdropDismiss: true,
      cssClass: 'custom-loading-class',
    });
    await this.customLoader.present();
  }

  async dismissCustomLoader() {
    await this.customLoader.dismiss();
  }


  radioChange(answer: any, i, question_id: any, answer_value: any) {
    if (this.question_list[i].isAnswered == true) {
      return false;
    }
    this.question_list[i].selectedOption = answer?.option;
    this.question_list[i].isAnswered = true;
    const data = {
      question_id,
      answer: answer?.option,
      answer_value: answer?.value
    };
    this.apiService.addAnswers(this.userObj?.user_id, this.quiz_id, data).subscribe((response: any) => {
      if (response.success == false) {
      }
    }, (error: HttpErrorResponse) => {
    });
  }

  // mark the correct answer regardless of which option is selected once answered
  isCorrect(option: string, obj: any, i, j): boolean {
    return this.question_list[i].selectedOption && option === obj.answer;
  }

  // mark incorrect answer if selected
  isIncorrect(option: string, obj: any, i, j): boolean {
    return option !== obj.answer && option === this.question_list[i].selectedOption;
  }

  onSubmit() {
    this.formGroup.reset({ answer: null });
  }

   async getQuestionList() {  
    if(this.todaysQuiz){
      await this.getTodaysQuiz(this.userObj.speciality);
    } 
    this.quiz_id = JSON.parse(localStorage.getItem('quiz_id'));
    this.apiService.presentCustomLoader().then(() => {
      this.apiService.getQuestionList(this.quiz_id).subscribe((response: any) => {
        this.apiService.dismissCustomLoader();
        this.quiz_data = response.data;
        this.question_list = response.data.questions;
        if (this.indexKey == this.question_list.length - 1) {
          this.isEndSlide = true;
        }
        else {
          this.isEndSlide = false;
        }
        this.isShow = true;
        this.question_list.forEach((e) => {
          e.options.forEach((el) => {
            const option = el?.option;
            switch (option) {
              case 'A':
                el.image = 'assets/icon/a.svg';
                break;
              case 'B':
                el.image = 'assets/icon/b.svg';
                break;
                break;
              case 'C':
                el.image = 'assets/icon/c.svg';
                break;
                break;
              case 'D':
                el.image = 'assets/icon/d.svg';
                break;
              default:
                el.image = 'assets/icon/a.svg';
            }
          });
        });

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
        modelId: 1,
        data: explanation,
      }
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
      }
    });
    return await modal.present();
  }

  //Move to Next slide
  slideNext(i: any) {
    if (i == this.question_list.length - 1 && this.isEndSlide == true) {
      localStorage.setItem('onFeedbackFrom', JSON.stringify('questions'));
      this.router.navigate(['summary']);
    }
    this.slideWithNav.lockSwipeToPrev(false);
    this.slideWithNav.lockSwipeToNext(false);
    this.slideWithNav.slideNext(800);
    this.slideWithNav.lockSwipeToPrev(true);
    this.slideWithNav.lockSwipeToNext(true);
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }

  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
      if (object.isEndSlide == true) {
        this.isEndSlide = true;
      }
    });
  }
}
