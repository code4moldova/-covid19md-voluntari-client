import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentsModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EsriMapComponent } from './esri-map/esri-map.component';
import { FilterComponent } from './filter/filter.component';
import { GoBackDirective } from './directives/go-back.directive';
import { PrettyDatePipe } from './pretty-date.pipe';
import { AppBadgeComponent } from './app-badge/app-badge.component';
import { ReadOnlyInputComponent } from '@shared/components/read-only-input/read-only-input.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialComponentsModule,
    FlexLayoutModule,
    TranslateModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialComponentsModule,
    FlexLayoutModule,
    TranslateModule,
    EsriMapComponent,
    FilterComponent,
    GoBackDirective,
    PrettyDatePipe,
    AppBadgeComponent,
    ReadOnlyInputComponent,
  ],
  declarations: [
    EsriMapComponent,
    FilterComponent,
    GoBackDirective,
    PrettyDatePipe,
    AppBadgeComponent,
    ReadOnlyInputComponent,
  ],
})
export class SharedModule {}
