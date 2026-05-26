import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {materialsApi} from "../components/components/materials";

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  constructor(private http: HttpClient) {
  }

  gematerials(): Observable<materialsApi> {
    return this.http.get<materialsApi>
    ("https://botw-compendium.herokuapp.com/api/v3/compendium/category/materials");
  }
}
