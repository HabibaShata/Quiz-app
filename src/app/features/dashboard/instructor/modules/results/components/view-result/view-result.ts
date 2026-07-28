import { Component } from '@angular/core';

@Component({
  selector: 'quiz-app-view-result',
  imports: [],
  templateUrl: './view-result.html',
  styleUrl: './view-result.scss',
})
export class ViewResult {

  ngOnInit(): void {
   //id router params
   //if id call endpoint for results
   // this.fetchAllresult(id)
  }

  //fetchAllresult(id){
  // resultList.find(result => result.id === id)
  //}
}
