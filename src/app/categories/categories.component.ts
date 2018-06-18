import { MzToastService } from 'ng2-materialize';
import { CategoryType } from './models/category-type';
import { ResponseModel } from './../utils/response-model';
import { CategoryPost } from './models/category-post';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Category } from './models/category';
import { CategoryList } from './models/category-list';
import { CategoriesService } from './services/categories.service';
import { CategoryPut } from './models/category-put';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  types: CategoryType[] = [];
  categories: CategoryList[];
  category: Category = {
    Id: 0,
    Name: '',
    Type: ''
  };

  deleteId: Number;

  constructor(
    private categoriesService: CategoriesService,
    private toaster: MzToastService
  ) { }

  ngOnInit() {
    this.categories = this.getAll();
    this.types = this.getTypes();
  }

  getTypes() {
    return this.categoriesService.getTypes();
  }

  getTypeDescription(typeId: Number): String {
    const categoryType = this.types.find(
      function(type: CategoryType) {
        return type.Id === typeId;
      }
    );
    return categoryType.Description;
  }

  getAll(): CategoryList[] {
    const categoriesList = new Array<CategoryList>();
    this.categoriesService.getAll().subscribe((data: ResponseModel) => {
      if (data.StatusCode === 200) {
        Object.assign(categoriesList, data.Content);
      }
    });
    return categoriesList;
  }

  getById(categoryId: Number): Category {
    const category = new Category();
    this.categoriesService.getById(categoryId).subscribe((data: ResponseModel) => {
      if (data.StatusCode === 200) {
        Object.assign(category, data.Content);
      }
    });
    return category;
  }

  editCategory(categoryId: Number) {
    this.category = this.getById(categoryId);
  }

  onSubmitEditForm() {
    // Validações do front-end
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.category.Name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.category.Name.length < 2 || this.category.Name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (this.IsNullOrWhiteSpace(this.category.Type.toString())) {
      this.toaster.show('Selecione um tipo para a categoria.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (formIsValid) {
      this.edit(this.category);
    }
  }

  edit(categoryPut: CategoryPut) {
    this.categoriesService.update(categoryPut).subscribe(
      (data: ResponseModel) => {
      if (data.StatusCode === 200) {
        this.categories = this.getAll();
        this.toaster.show(data.Content, 4000, 'toast-success');
      } else {
        if (data.StatusCode === 500) {
          this.toaster.show('Houve um erro ao tentar atualizar o registro.', 4000, 'toast-danger');
        } else {
          this.toaster.show(data.Content, 4000, 'toast-danger');
        }
      }
    },
    () => {
      this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
    });
  }

  deleteCategory(categoryId: Number) {
    this.deleteId = categoryId;
  }

  delete() {
    if (this.deleteId > 0) {
      this.categoriesService.delete(this.deleteId).subscribe(
        (data: ResponseModel) => {
          if (data.StatusCode === 200) {
            this.categories = this.getAll();
            this.toaster.show(data.Content, 4000, 'toast-success');
          } else {
            if (data.StatusCode === 500) {
              this.toaster.show('Houve um erro ao tentar inserir o registro.', 4000, 'toast-danger');
            } else {
              this.toaster.show(data.Content, 4000, 'toast-danger');
            }
          }
        },
        (err: HttpErrorResponse) => {
          this.toaster.show('Houve um erro ao conectar com o servidor.', 4000, 'toast-danger');
        }
      );
    }
  }

  onSubmitAddForm() {
    let formIsValid: Boolean = true;

    if (this.IsNullOrWhiteSpace(this.category.Name)) {
      this.toaster.show('Nome inválido.', 4000, 'toast-danger');
      formIsValid = false;
      return;
    }

    if (this.category.Name.length < 2 || this.category.Name.length > 30) {
      this.toaster.show('Nome deve conter no mínimo 2 caracteres e no máximo 30.', 4000, 'toast-danger');
      formIsValid = false;
      return;
    }

    if (this.IsNullOrWhiteSpace(this.category.Type.toString())) {
      this.toaster.show('Selecione um tipo para a categoria.', 4000, 'toast-danger');
      formIsValid = false;
    }

    if (formIsValid) {
      this.insert(this.category);
    }
  }

  insert(categoryPost: CategoryPost) {
    this.categoriesService.insert(categoryPost).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          this.categories = this.getAll();
          this.toaster.show(data.Content, 4000, 'toast-success');
        } else {
          if (data.StatusCode === 500) {
            this.toaster.show('Houve um erro ao deletar o registro.', 4000, 'toast-danger');
          } else {
            this.toaster.show(data.Content, 4000, 'toast-danger');
          }
        }
      }
    );
  }

  IsNullOrWhiteSpace(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}
