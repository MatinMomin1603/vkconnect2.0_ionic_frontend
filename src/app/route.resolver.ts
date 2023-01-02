import { ApiService } from 'src/app/services/api.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteResolver implements Resolve<any> {
  _id: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.subscribe((params: any) => {
      this._id = params['_id'];
    });

  }

  resolve(route: ActivatedRouteSnapshot) {
    setTimeout(() => {
    }, 2000);
    return this.apiService.getUserById(route.paramMap.get('_id'));
  }
}
