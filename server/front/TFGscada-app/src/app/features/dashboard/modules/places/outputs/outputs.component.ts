import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../users/users-interfaces';
import { IOutput, IPlace } from '../places-interfaces';
import { OutputsService } from './outputs.service';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {
  @Input() place: IPlace | undefined;
  @Input() allPlaces: IPlace[] | undefined;
  outputs: IOutput[] = [];
  outputsLabels: string[] = [];
  color = 'primary';
  checked = true;
  disabled = false;
  doNext = true;


  constructor(public outputsService: OutputsService) { }


  ngOnInit(): void {
    this.doNext = true;
    console.log('Todos los lugares', this.allPlaces);
    let userJson: IUser = JSON.parse(localStorage.getItem('user') as string) as IUser;
    this.outputsService.getOutputs().subscribe({
      next: (result: any) => {
        let idPlace = 1;
        if (this.place != undefined)
          idPlace = this.place.id;
        else if (this.allPlaces != undefined && this.allPlaces.length > 0) {
          this.place = this.allPlaces[0];
          idPlace = this.place.id;
        }
        this.selected = this.place?.id.toString();
        const outputAux: IOutput = {
          date: new Date(),
          placeId: idPlace,
          personId: userJson.id,
          outputId: 0,
          value: false,
          sended: false
        }
        for (let i = 0; i < result.data.length; i++) {
          outputAux.outputId = result.data[i].id;
          outputAux.outputId = i + 1;
          this.outputsLabels.push(result.data[i].name);
          this.outputs.push({ ...outputAux });
        }
        this.fetchOutputs();
        const funcion = () => {
          setTimeout(async () => {
            if (this.readed) {
              this.readed = false;
              this.fetchOutputs();
            }
            else
              console.log('No se ha terminado de actulizar de la vez anterior');
            if (this.doNext)
              setTimeout(funcion, 1000);
          }, 1000);
        };
        setTimeout(funcion, 1000);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  readed = false;
  selected: any;

  fetchOutputs() {
    this.readed = false;
    //this.place.id = id;
    if (this.place?.id != this.selected) {
      this.place = this.allPlaces?.find((element) => element.id == this.selected);
    }
    if (this.place != undefined) {
      this.outputsService.get(this.place.id).subscribe({
        next: (response: any) => {
          for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].sended = false;
            this.outputs[i].value = false;
          }
          for (let i = 0; i < this.outputs.length; i++) {
            const aux = response.data.find((element: IOutput) => element != null && element.outputId == (i + 1));
            if (aux) {
              this.outputs[aux.outputId - 1] = aux;
            }
          }
          this.readed = true;
        },
        error: (error: any) => {
          console.log('Fail: ');
          this.readed = true;
        }
      });
    }
  }

  change($event: any, i: number) {
    this.outputs[i].date = new Date();
    this.outputs[i].value = $event.checked;
    this.outputs[i].sended = false;
    this.outputs[i].placeId = this.selected;
    this.outputsService.post(this.outputs[i]).subscribe({
      next: (response: any) => {
        this.fetchOutputs();
      },
      error: (err: any) => {
        console.log(err);
      }
    });;
  }

  ngOnDestroy() {
    this.doNext = false;
  }

}
