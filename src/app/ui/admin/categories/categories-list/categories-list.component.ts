import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { CategoryModel } from '../../../../core/models/category.model';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { CreateCategoryFormComponent } from '../create-category-form/create-category-form.component';
import { AsyncPipe } from '@angular/common';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { UpdateCategoryFormComponent } from '../update-category-form/update-category-form.component';
import { CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, DragDropModule } from '@angular/cdk/drag-drop';

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
    private confirmationService: ConfirmDialogService,
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
    event.stopPropagation();
    // open dialog
    this.dialog.open(UpdateCategoryFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '900px',
      maxWidth: '100%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: category
    });
  }

  async deleteCategory(event: Event, category: CategoryModel) {
    event.stopPropagation();
    if (category.id === undefined) {
      return;
    }
    const deleteCategoryConfirmation = await this.confirmationService
      .confirm('Supprimer', 'Confirmer pour supprimer cette catégorie')
    if (!deleteCategoryConfirmation) {
      return;
    }
    this.adminService.deleteCategory(category.id).subscribe();
  }

}
