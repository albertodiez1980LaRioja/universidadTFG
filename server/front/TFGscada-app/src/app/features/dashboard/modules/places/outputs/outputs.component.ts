import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../users/users-interfaces';
import { IOutput } from '../places-interfaces';
import { OutputsService } from './outputs.service';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {
  @Input() idPlace: any = 1;
  outputs: IOutput[] = [];
  outputsLabels: string[] = [];
  color = 'primary';
  checked = true;
  disabled = false;

  constructor(public outputsService: OutputsService) { }

  ngOnInit(): void {
    let userJson: IUser = JSON.parse(localStorage.getItem('user') as string) as IUser;
    this.outputsService.getOutputs().subscribe({
      next: (result: any) => {
        const outputAux: IOutput = {
          date: new Date(),
          placeId: this.idPlace,
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
      },
      error: (err: any) => {
        console.log(err);
      }
    });


  }

  fetchOutputs() {
    this.outputsService.get(this.idPlace).subscribe({
      next: (response: any) => {
        console.log('llegados', response.data);
        for (let i = 0; i < this.outputs.length; i++) {
          const aux = response.data.find((element: IOutput) => element != null && element.outputId == (i + 1));
          if (aux) {
            this.outputs[aux.outputId - 1] = aux;
          }
        }
      },
      error: (error: any) => {
        console.log('Fail: ');
      }
    });
  }

  change($event: any, i: number) {
    this.outputs[i].date = new Date();
    this.outputs[i].value = $event.checked;
    this.outputsService.post(this.outputs[i]).subscribe({
      next: (response: any) => {
        this.fetchOutputs();
      },
      error: (err: any) => {
        console.log(err);
      }
    });;
  }

}
