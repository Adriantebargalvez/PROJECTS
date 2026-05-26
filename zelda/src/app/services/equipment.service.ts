import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {equipamentApi} from "../components/components/equipament";

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private http: HttpClient) {
  }

  getcreatures(): Observable<equipamentApi> {
    return this.http.get<equipamentApi>
    ("https://botw-compendium.herokuapp.com/api/v3/compendium/category/equipment");
  }
}
