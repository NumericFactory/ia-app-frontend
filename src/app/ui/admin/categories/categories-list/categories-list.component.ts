import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { CategoryModel } from '../../../../core/models/category.model';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { CreateCategoryFormComponent } from '../create-category-form/create-category-form.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent {

  categories$ = this.adminService.categories$;

  constructor(
    public dialogRef: DialogRef<any>,
    public dialog: Dialog,
    private adminService: AdminGateway,
    @Inject(DIALOG_DATA) public data: CategoryModel[],
  ) { }

  ngOnInit() {
    this.adminService.fetchCategories().subscribe();
  }

  close() {
    this.dialogRef.close();
  }

  openDialogCreateCategory() {
    // open dialog
    this.dialog.open(CreateCategoryFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var'
    });
  }

  openDialogUpdateCategory(event: Event, category: CategoryModel) {
    console.log('category', category);
  }

  deleteCategory(category: CategoryModel) {
    console.log('category', category);
  }

}
