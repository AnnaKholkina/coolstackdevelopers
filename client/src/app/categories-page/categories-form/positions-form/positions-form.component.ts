import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormGroup, FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})

export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId = ''
  @ViewChild('modal') modalRef: ElementRef

  positions: Position[] = []
  loading = false
  positionId = ''
  modal: MaterialInstance
  form: FormGroup

  constructor(private positionService: PositionsService) {
    this.modalRef = new ElementRef('')
    this.modal = new class implements MaterialInstance {
      close(): void {}
      destroy(): void {}
      open(): void {}
    }
    this.form = new FormGroup({})
  }

  ngOnInit(): void {
    this.form = new FormGroup({
        name: new FormControl(null, Validators.required),
        cost: new FormControl(null, [Validators.required, Validators.min(1)])
      }
    )

    this.loading = true
    this.positionService.fetch(this.categoryId).subscribe(
      positions => {
        this.positions = positions
        this.loading = false
      }
    )
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id!
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onDeletePosition(event: Event, position: Position){
    event.stopPropagation()
    const desicion = window.confirm(`Вы дейстительно хотите удалить позицию "${position.name}"?`)
    if(desicion){
      this.positionService.delete(position).subscribe(
        response =>{
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message)
        }
      )
    }
    else{

    }
  }

  onAddPosition(){
    this.positionId = ''
    this.form.reset({
      name: null,
      cost: null
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onCancel(){
    this.modal.close()
  }

  onSubmit(){
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () =>{
      this.modal.close()
      this.form.reset({name: '', cost: ''})
      this.form.enable()
    }

    if (this.positionId){
      newPosition._id = this.positionId

      this.positionService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('Изменения сохранены')
        },
        error => {
          console.log('Ошибка в том, что я не сохранил ничего')
          this.form.enable()
          MaterialService.toast(error.error.message)
        },
        completed
      )
    }
    else{
      this.positionService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана')
          this.positions.push(position)
        },
        error => {
          this.form.enable()
          MaterialService.toast(error.error.message)
        },
        completed
      )
    }


  }
}
