/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  customLoader: any;
  homeLoader: any;
  // public quiz_url = "http://localhost:3000/quiz";
  public quiz_url = "https://bv97lpde32.execute-api.ap-south-1.amazonaws.com/quiz";
  public servered_url = "https://apis.vkonnecthealth.com";

  monthNames = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december"
  ];

  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
  ) { }

  itemValue = new BehaviorSubject(this.theItem);

  set theItem(value) {
    this.itemValue.next(value); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('theItem', JSON.stringify(value));
  }

  get theItem() {
    return JSON.parse(localStorage.getItem('theItem'));
  }

  async presentCustomLoader() {
    this.customLoader = await this.loadingController.create({
      translucent: false,
      spinner: "lines",
      message: "Loading!...",
      animated: true,
      backdropDismiss: true,
      cssClass: 'custom-loading-class',
    });
    await this.customLoader.present();
  }

  async dismissCustomLoader() {
    await this.customLoader.dismiss();
  }


  async presentHomeLoader() {
    this.homeLoader = await this.loadingController.create({
      translucent: false,
      spinner: "lines",
      message: "Loading!...",
      animated: true,
      backdropDismiss: true,
      cssClass: 'custom-loading-class',
    });
    await this.homeLoader.present();
  }

  async dismissHomeLoader() {
    await this.homeLoader.dismiss();
  }

  /* check for Quiz of the current Month */
  checkQuiz(user_id: any, speciality: any) {
    let month = this.monthNames[new Date().getMonth()];
    console.log('month :', month);
    return this.http
      .get(this.quiz_url + "/getQuizByMonth/" + month + "/" + user_id + "/" + speciality)
      .pipe(map((results) => results));
  }

  // /* Get User By Id */
  getUserData(user_id: any) {
    return this.http
      .get(this.quiz_url + "/getUserById?id=" + user_id)
      .pipe(map((results) => results));
  }

  /* Get User By Id */
  getUserById(user_id: any) {
    return this.http
      .get(this.servered_url + "/api/user/player?user_id=" + user_id)
      .pipe(map((results) => results));
  }

  /* get All Quiz List */
  getQuizList(speciality: any) {
    return this.http
      .get(this.quiz_url + "/getActiveQuiz?speciality=" + speciality)
      .pipe(map((results) => results));
  }

  /* gwt Active Quiz List */
  getActiveQuizList(speciality: any) {
    return this.http
      .get(this.quiz_url + "/getActiveQuizList?speciality=" + speciality)
      .pipe(map((results) => results));
  }

  /* get Question List by Quiz Id */
  getQuestionList(quiz_id: any) {
    return this.http
      .get(this.quiz_url + "/getQuizById/" + quiz_id)
      .pipe(map((results) => results));
  }

  /* Get monthly report list */
  getMonthlyReportList(user_id: any) {
    return this.http
      .get(this.quiz_url + "/monthlyQuizReport/" + user_id)
      .pipe(map((results) => results));
  }

  /* Register for Quiz */
  registerForQuiz(data: any) {
    console.log('data ???:', data);
    return this.http
      .post(this.quiz_url + "/registerUserForQuiz", data)
      .pipe(map((results) => results));
  }

  /* Add answers */
  addAnswers(user_id: any, quiz_id: any, data) {
    return this.http
      // .patch(this.quiz_url + "/addAnswers/" + user_id + "/" + quiz_id, data)
      .post(this.quiz_url + "/addAnswers/" + user_id + "/" + quiz_id, data)
      .pipe(map((results) => results));
  }

  /* Quiz Summary */
  quizSummary(user_id: any, quiz_id: any) {
    return this.http
      .get(this.quiz_url + "/quizSummary/" + user_id + "/" + quiz_id)
      .pipe(map((results) => results));
  }

  /* Summary of All Quiz */
  quizSummaries(data: any) {
    return this.http
      .post(this.quiz_url + "/quizSummary", data)
      .pipe(map((results) => results));
  }

  /* My ScoreCard */
  myScoreCard(user_id: any) {
    return this.http
      .get(this.quiz_url + "/myQuizDashboard/" + user_id)
      .pipe(map((results) => results));
  }

  /* Leader Board */
  leaderBoard(user_id: any, speciality: any) {
    return this.http
      .get(this.quiz_url + "/leaderBoard?user_id=" + user_id + '&speciality=' + speciality)
      .pipe(map((results) => results));
  }

  /* QuizWise LaederBoard */
  quizWiseleaderBoard(user_id: any, quiz_id: any) {
    return this.http
      .get(this.quiz_url + "/quizWiseLeaderBoard?user_id=" + user_id + '&quiz_id=' + quiz_id)
      .pipe(map((results) => results));
  }

  getLatestQuiz(user_id: any, speciality: any) {
    return this.http
      .get(this.quiz_url + "/getLatestQuiz/" + user_id + "/" + speciality)
      .pipe(map((results) => results));
  }

  getTodaysQuiz(speciality:any){
    return this.http.get(this.quiz_url+ "/getTodaysQuiz?speciality="+speciality).pipe(map((result)=> result));
  }
}
