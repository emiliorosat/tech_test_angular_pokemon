import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import IFavorite from 'src/app/models/favorite.model';
import { IPokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { StorageService } from 'src/app/services/storage.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriber: Subscription = new Subscription;
  pokemonList: IPokemon[] = []
  rootPokemonList:IPokemon[] = []
  total: number = 0
  page: number = 1
  search: string = ""

  constructor(
    private _pokemonService: PokemonService,
    private _storageService: StorageService,
    private dialog: MatDialog
  ) { }
  ngOnDestroy(): void {
    this.subscriber.unsubscribe()
  }

  ngOnInit(): void {
    this.getPokemons()
  }

  searchAction(e:any){
    if(e === ""){
      this.pokemonList = this.rootPokemonList
    }else{
      this.pokemonList = this.rootPokemonList.filter( x => {
        return new RegExp(e, "gi").test(x.name)
      } )
    }
  }

  toggleFavorite(pokemon: IPokemon){

    
    if(pokemon.isFavorite){
      if(confirm(`Quiere quitar de favoritos a ${pokemon.name}`)){
        let myPokemon: IFavorite  = { createAt: new Date(), name: pokemon.name, alias: "" }
        this._storageService.remove(myPokemon).then((r:boolean)=> this.ckeckIsFavorite() )
      }
      
    }else{

      let obs = this.dialog.open(ModalComponent, { minWidth: '300px', data: {pokemon, action: 1} })
      .afterClosed().subscribe(myPokemon => {    
        if(myPokemon)  
          this._storageService.add(myPokemon).then(() => this.ckeckIsFavorite() )

      });

      this.subscriber.add(obs)
    }

      
    }
  

  async ckeckIsFavorite(){
    let fav: IFavorite[] = await this._storageService.get()
    if(fav.length > 0){
      let newList:IPokemon[] = this.rootPokemonList.map((p:IPokemon)=>{
        if(fav.findIndex( (f:IFavorite)=> p.name === f.name ) !== -1){
          return {...p, isFavorite: true}
        }
        return {...p, isFavorite: false}
      })

      this.pokemonList = newList
      this.rootPokemonList = newList
    }else{
      let newList:IPokemon[] = this.rootPokemonList.map((p:IPokemon)=> {return {...p, isFavorite: false}} )
      this.pokemonList = newList
      this.rootPokemonList = newList
    }
    
    
  }
  
  getPokemons(){

     const obs = this._pokemonService.get().subscribe(
      (res: any)=>{
        if(res){
          this.rootPokemonList = res.results
          this.ckeckIsFavorite()
          this.total = res.count
        }
      }
    )
    
    this.subscriber.add(obs)
  }

}
