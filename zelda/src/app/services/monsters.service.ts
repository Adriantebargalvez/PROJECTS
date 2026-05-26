import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {monsterApi} from "../components/components/mosters";

@Injectable({
  providedIn: 'root'
})
export class MonstersService {

  constructor(private http: HttpClient) {
  }

  getmonsters(): Observable<monsterApi> {
    return this.http.get<monsterApi>
    ("https://botw-compendium.herokuapp.com/api/v3/compendium/category/monsters");
  }
}
