import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import IFavorite from 'src/app/models/favorite.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  subscriber: Subscription = new Subscription;
  pokemonList: IFavorite[] = []
  rootPokemonList: IFavorite[] = []
  total: number = 0
  page: number = 1
  search: string = ""

  constructor(private _storageService: StorageService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadFavorites()
  }

  async loadFavorites(){
    let list: IFavorite[] = await this._storageService.get()
    if(list.length > 0){
      this.pokemonList = list
      this.rootPokemonList = list
    }else{
      this.pokemonList = []
      this.rootPokemonList = []
    }
    
  }

  updatePokemon(pokemon: IFavorite, index: number){

    let obs = this.dialog.open(ModalComponent, { minWidth: '300px', data: {pokemon, action: 1} })
      .afterClosed().subscribe(myPokemon => {    
        if(myPokemon)  
          this._storageService.update(myPokemon).then(()=>this.loadFavorites())

      });

      this.subscriber.add(obs)

  }

  async removePokemon(pokemon: IFavorite, index: number){
    if(confirm(`Esta seguro de quitar de favoritos a ${pokemon.name}`)){
      this._storageService.remove(pokemon).then(()=>this.loadFavorites())
      
    }
    

    
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

}
