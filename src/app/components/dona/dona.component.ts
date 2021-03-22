import { Component, Input, OnInit } from '@angular/core';
import { Label, MultiDataSet, Color } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit {

  // Doughnut
  @Input() title: string = "Sin Titulo";
  @Input() labels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  @Input() data: MultiDataSet = [
    [350, 450, 100],
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public colors: Color[] = [
    { backgroundColor: ['#6857e6', '#009fee', '#f02059'] },
  ];


}
