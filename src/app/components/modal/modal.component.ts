import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  createAt: Date = new Date()
  name: string = ""

  Form: FormGroup = new FormGroup({
    alias: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
   this.name = this.data.pokemon.name
   this.createAt = this.data.pokemon.createAt? this.data.pokemon.createAt : new Date()
   this.Form.controls.alias.setValue(this.data.pokemon.alias? this.data.pokemon.alias : '')
  }

  onSubmit(): void {
    this.dialogRef.close({
      name: this.name,
      createAt: this.createAt,
      alias: this.Form.controls.alias.value
    })
  }
  onClose():void {
    this.dialogRef.close()
  }

}
