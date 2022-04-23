import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private api_url: string = environment.api_url

  constructor(
    private _http: HttpClient
  ) { }

  get(pageNumbre: number= 0, limit: number = 10000):Observable<any>{
    if(pageNumbre >= 1){
      --pageNumbre
      pageNumbre = pageNumbre * limit
    }
    return this._http.get(`${this.api_url}pokemon?offset=${pageNumbre}&limit=${limit}`)
  }

}
