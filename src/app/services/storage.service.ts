import { Injectable } from '@angular/core';
import IFavorite from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private key: string = "my-pokemons"

  get(): Promise<IFavorite[]> {
    return new Promise((resolve, reject)=>{

      let data: any = sessionStorage.getItem(this.key)
      if(data === null){
        return resolve([])
      } else{
        let res: IFavorite[] = JSON.parse(data)
        return resolve(res)
      }
  })
    
  }
  
  add(pokemon: IFavorite){
    return new Promise(async (resolve, reject)=>{
      let list: IFavorite[] = await this.get()

      if(list.find((f:IFavorite) => f.name == pokemon.name)){
        return resolve(false)
      }

      list.push(pokemon)
      let stringified = JSON.stringify(list)
      sessionStorage.setItem(this.key, stringified)
      return resolve(true)
    })
  }

  update(pokemon: IFavorite){
    return new Promise(async (resolve, reject)=>{
      let pokemons =  await this.get()
      if(pokemons.length > 0){
        let index = pokemons.findIndex( (f:IFavorite) => f.name === pokemon.name )
        if(index !== -1){
          pokemons[index] = pokemon
          let stringified = JSON.stringify(pokemons)
          sessionStorage.setItem(this.key, stringified)
          resolve(null)
        }
      }
  })
  }

  remove(pokemon: IFavorite): Promise<any>{
    return new Promise(async (resolve, reject)=>{
      try{
        let pokemons = await this.get()
        if(pokemons.length > 0){     
          if(pokemons.length === 1){
            sessionStorage.setItem(this.key, JSON.stringify([]))
            return resolve(true)
          }else{
            for(let i = 0; i<pokemons.length; i++){
              if(pokemons[i].name === pokemon.name){
                pokemons.splice(i,1)
              }
              sessionStorage.setItem(this.key, JSON.stringify(pokemons))
            }
            
          }
          return resolve(true)
        }
        return resolve(false)
      }catch(ex){
        return reject(ex)
      }
  })
  }



}
