import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {creaturesApi} from "../components/components/creatures";

@Injectable({
  providedIn: 'root'
})
export class CreaturesService {

  constructor(private http: HttpClient) { }
  getcreatures(): Observable<creaturesApi>{
    return this.http.get<creaturesApi>
    ("https://botw-compendium.herokuapp.com/api/v3/compendium/category/creatures");
  }
}
