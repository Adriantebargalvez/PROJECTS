import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {treasure, treasureApi} from "../components/components/treasure";

@Injectable({
  providedIn: 'root'
})
export class TreasureService {

  constructor(private http: HttpClient) {
  }

  gettreasure(): Observable<treasureApi> {
    return this.http.get<treasureApi>
    ("https://botw-compendium.herokuapp.com/api/v3/compendium/category/treasure");
  }
}
