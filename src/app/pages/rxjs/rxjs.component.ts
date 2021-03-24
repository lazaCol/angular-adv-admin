import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervalSubs: Subscription;

  constructor() { 
    // this.retornaObservable().pipe(
    //   retry()
    // ).subscribe(valor => {
    //   console.log('Subs: ', valor);
      
    // }, err =>{
    //   console.warn('Error: ', err);
      
    // }, ()=>{
    //   console.info('Obs terminado');
    // });

    this.intervalSubs = this.retornaInterval()
    .subscribe( valor => console.log(valor));

  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  ngOnInit(): void {
  }


  retornaInterval(): Observable<number>{
    const intervalo$ = interval(500)
    .pipe(
      map( valor => {
        return valor + 1;
      }),
      filter(valor => valor % 2 === 0 ? true : false),
      // take(10),
    )

    return intervalo$;
  }

  retornaObservable(): Observable<number>{
    let i = -1;

    const obs$ = new Observable<number>(observer => {
      const intervalo = setInterval(() => {
        // console.log('tick');
        i++;
        observer.next(i);

        if(i === 4){
          clearInterval(intervalo);
          observer.complete();
        }

        if(i === 2){
          observer.error('es 2')
        }
        
      }, 1000)
    });

    return obs$;
  }

}
