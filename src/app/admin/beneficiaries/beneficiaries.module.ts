import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentsModule } from '@shared/material.module';
import { SharedModule } from '@shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { BeneficiariesComponent } from './beneficiaries.component';
import { BeneficiariesListComponent } from './beneficiaries-list/beneficiaries-list.component';
import { BeneficiaryDetailsComponent } from './beneficiary-details/beneficiary-details.component';
import { BeneficiaryNewComponent } from './beneficiary-new/beneficiary-new.component';
import { BeneficiaryEditComponent } from './beneficiary-edit/beneficiary-edit.component';
import { DisabilityComponent } from './shared/disability/disability.component';
import { RequestStatusComponent } from './shared/request-status/request-status.component';
import { RequestTypeComponent } from './shared/request-type/request-type.component';
import { BeneficiaryListComponent } from './shared/beneficiary-list/beneficiary-list.component';
import { RouterModule } from '@angular/router';
import { beneficiariesRoutes } from './beneficiaries.routes';
import { SpecialConditionTitlePipe } from './shared/special-condition-title.pipe';
import { ZoneTitlePipe } from './shared/zone-title.pipe';
import { PrettyDatePipe } from '@shared/pretty-date.pipe';

@NgModule({
  declarations: [
    BeneficiariesComponent,
    BeneficiariesListComponent,
    BeneficiaryDetailsComponent,
    BeneficiaryNewComponent,
    ZoneTitlePipe,
    SpecialConditionTitlePipe,
    PrettyDatePipe,
    BeneficiaryEditComponent,
    DisabilityComponent,
    RequestStatusComponent,
    RequestTypeComponent,
    BeneficiaryListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(beneficiariesRoutes),
    MaterialComponentsModule,
    SharedModule,
    NgxMaskModule.forChild(),
  ],
})
export class BeneficiariesModule {}
