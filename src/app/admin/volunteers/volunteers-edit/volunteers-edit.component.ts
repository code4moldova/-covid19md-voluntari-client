import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { generateHoursRange } from '@shared/generate-hours-range';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { weekDays } from '@shared/week-day';
import { Volunteer } from '../shared/volunteer';
import { VolunteersService } from '../volunteers.service';
import { volunteerRoles } from '../shared/volunteer-role';
import { zones } from '@shared/zone';

@Component({
  templateUrl: './volunteers-edit.component.html',
})
export class VolunteersEditComponent implements OnDestroy {
  private _destroy = new Subject<void>();

  weekDays = weekDays;
  hours = generateHoursRange(8, 20);
  zones = zones;
  roles = volunteerRoles;
  volunteer: Volunteer;

  formGroup = this.fb.group({
    is_active: this.fb.control(false),
    black_list: this.fb.control(false),
    first_name: this.fb.control('', Validators.required),
    last_name: this.fb.control('', Validators.required),
    phone: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^[^0]([0-9]){7}$/),
    ]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    zone: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    age: this.fb.control('', [
      Validators.required,
      Validators.min(16),
      Validators.max(50),
      Validators.pattern(/^([0-9]){2}$/),
    ]),
    facebook_profile: this.fb.control('', [
      Validators.required,
      Validators.pattern(
        /(?:https?:\/\/)?(?:www\.)?facebook\.com\/.(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/,
      ),
    ]),
    role: this.fb.control(null, Validators.required),
    availability_days: this.fb.control([], Validators.required),
    availability_hours_start: this.fb.control(null, Validators.required),
    availability_hours_end: this.fb.control(null, Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private volunteerService: VolunteersService,
  ) {
    route.data.pipe(takeUntil(this._destroy)).subscribe((data) => {
      this.volunteer = data.volunteer;
      this.formGroup.patchValue({
        ...this.volunteer,
        role: this.volunteer.role[0],
      });
    });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  getHours() {
    return this.hours.filter(
      (h) => h.value > this.formGroup.get('availability_hours_start')?.value,
    );
  }

  onSubmit(formGroup: FormGroup) {
    if (formGroup.invalid) return;

    this.volunteerService
      .updateVolunteer({
        ...formGroup.value,
        // Backend receives an array of roles
        role: [formGroup.value.role],
        _id: this.volunteer._id,
      })
      .pipe(takeUntil(this._destroy))
      .subscribe();
  }
}
