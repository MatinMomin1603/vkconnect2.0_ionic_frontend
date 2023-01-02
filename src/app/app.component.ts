/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  _id: any;
  userData: any;
  speciality: any;
  private sub: any;
  userObj: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private platform: Platform,
  ) {
    this.sub = this.route.queryParams.subscribe((params: any) => {
      this._id = params['_id'];
      this.speciality = params['speciality'];
      if (typeof this._id != "undefined" && this._id != null && typeof this.speciality != "undefined" && this.speciality != null) {
        let obj = {
          user_id: this?._id,
          speciality: this.speciality
        }
        localStorage.setItem('userObj', JSON.stringify(obj));
      }
    });

  }

  ngOnInit(): void {
    setTimeout(() => {
      this.userObj = JSON.parse(localStorage.getItem('userObj'));
      this.getProfileData(this.userObj._id);
    }, 2000);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ionViewWillEnter() {

  }

  async getProfileData(_id: any) {
    this.apiService.getUserById(_id).subscribe(
      (response: any) => {
        this.userData = response?.data;
        localStorage.setItem('userD', JSON.stringify(response?.data));
        this.apiService.theItem = response?.data;
      },
      (error) => {
      }
    );
  }


}
