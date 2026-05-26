import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {equipamentApi} from "../components/components/equipament";
import {zeldaApi} from "../components/components/zelda";

@Injectable({
  providedIn: 'root'
})
export class ZeldaService {

  constructor(private http: HttpClient) {
  }

  getzelda(): Observable<zeldaApi> {
    return this.http.get<zeldaApi>
    ("https://botw-compendium.herokuapp.com/api/v3/compendium/all");
  }
}
