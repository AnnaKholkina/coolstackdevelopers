import { Component, OnInit } from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {Category} from "../shared/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  categories$: Observable<Category[]>

  constructor(private categoriesService: CategoriesService) {
    this.categories$ = new Observable<Category[]>()
  }

  ngOnInit(): void {
    //this.loading = true
    this.categories$ = this.categoriesService.fetch()
  }

}
