import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // const promesa = new Promise((resolve, reject) => {

    //   if(false){

    //     resolve('hello word');
    //   }else{
    //     reject('algo salio mal');
    //   }
      
    // });

    // promesa.then((d) =>{
    //   console.log(d);
      
    // })
    // .catch(console.log)

    // console.log('ola voce');

    this.getUsuarios().then(usuarios =>{
      console.log(usuarios);
      
    })
    
  }

  getUsuarios(){
    const promesa = new Promise((resolve) => {

      fetch('https://reqres.in/api/users')
      .then( resp => resp.json())
      .then(body => resolve(body));

    })

    return promesa;
  }

}
