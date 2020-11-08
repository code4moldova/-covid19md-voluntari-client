import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { VolunteersFacade } from '../volunteers.facade';
import {
  map,
  takeUntil,
  filter,
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { IVolunteer } from '@shared/models';
import { TagsFacade } from '@shared/tags/tags.facade';
import { GeolocationService } from '@shared/services/geolocation/geolocation.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { EsriMapComponent } from '@shared/esri-map/esri-map.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KIV_ZONES } from '@shared/constants';

const minTemp = 36;
const maxTemp = 41;

@Component({
  templateUrl: './volunteers-details.component.html',
  styleUrls: ['./volunteers-details.component.scss'],
})
export class VolunteersDetailsComponent implements OnInit, OnDestroy {
  public tempStep = '0.1';
  zones = KIV_ZONES;

  public cities = [
    { name: 'Chisinau', value: 'chisinau' },
    { name: 'Balti', value: 'balti' },
  ];

  fakeAddressControl = this.fb.control(null);
  formSubmitted = false;

  addressIsLoading$ = new Subject();
  addresses$ = this.fakeAddressControl.valueChanges.pipe(
    debounceTime(350),
    distinctUntilChanged(),
    filter((address) => address && address.length > 0),
    switchMap((address) => {
      this.addressIsLoading$.next(true);
      return this.geolocationService.getLocation(null, address).pipe(
        map((resp) => resp.candidates),
        finalize(() => {
          this.addressIsLoading$.next(false);
        })
      );
    })
  );

  form = this.fb.group({
    _id: [null],
    first_name: [null, Validators.required],
    last_name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    phone: [
      null,
      [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
    ],
    telegram_id: [null],
    address: [null, Validators.required],
    latitude: [null, Validators.required],
    longitude: [null, Validators.required],
    zone_address: [null, Validators.required],
    is_active: [false, Validators.required],
    facebook_profile: [null],
    age: [null],
    availability: [null],
    suburbia: [null],
    password: [{ value: 'random', disabled: true }, Validators.required],
    created_by: [null, [Validators.maxLength(500)]],
    // team: [null, [Validators.maxLength(500)]],
    profession: [null, [Validators.maxLength(500)]],
    comments: [null, [Validators.maxLength(500)]],
    last_temperature: [minTemp, [Validators.required, ValidateTemperature]],
    need_sim_unite: [false, Validators.required],
    new_volunteer: [false, Validators.required],
    black_list: [false, Validators.required],
    received_cards: [false, Validators.required],
    sent_photo: [false, Validators.required],
    offer: [null, Validators.required],
    received_contract: [false],
    city: ['chisinau'],
  });
  currentVolunteeerId: string;
  componentDestroyed$ = new Subject();
  isLoading$ = this.volunteerFacade.isLoading$;
  error$ = this.volunteerFacade.error$;

  ages$ = this.tagsFacade.agesTags$;
  availabilities$ = this.tagsFacade.availabilitiesTags$;
  teams$ = this.tagsFacade.teamsTags$;
  offers$ = this.tagsFacade.offersTags$;

  hasTelegramChatId$ = this.volunteerFacade.volunteerDetails$.pipe(
    map((volunteer) => !!volunteer?.telegram_chat_id)
  );

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private volunteerFacade: VolunteersFacade,
    private tagsFacade: TagsFacade,
    private geolocationService: GeolocationService,
    private matDialog: MatDialog,
    private elementRef: ElementRef,
    private snackBar: MatSnackBar
  ) {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        tap((id) => (this.currentVolunteeerId = id)),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe((id) => {
        this.currentVolunteeerId = id;
        if (id) {
          this.volunteerFacade.getVolunteerById(id);
        }
      });
  }

  ngOnInit() {
    this.volunteerFacade.volunteerDetails$
      .pipe(
        filter((volunteer) => !!volunteer),
        // Fix issue switching between 'new' and 'details' page
        map((volunteer) =>
          this.currentVolunteeerId ? volunteer : ({} as IVolunteer)
        ),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe((volunteer) => {
        this.form.patchValue(volunteer);
        if (volunteer.address) {
          this.fakeAddressControl.patchValue({ address: volunteer.address });
        }
      });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.volunteerFacade.saveVolunteer(this.form.getRawValue());
      if (this.currentVolunteeerId) {
        combineLatest([
          this.volunteerFacade.isLoading$,
          this.volunteerFacade.error$,
        ])
          .pipe(
            filter(([status, error]) => !status && !error),
            first()
          )
          .subscribe(() => {
            this.router.navigateByUrl('/admin/volunteers/list');
          });
      }
    } else {
      this.snackBar.open('Update required fields', '', {
        duration: 5000,
        panelClass: 'info',
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      const element = this.elementRef.nativeElement.querySelector(
        '.ng-invalid:not(form)'
      );
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  get addressIsInvalid() {
    const city = this.form.get('city');
    const address = this.form.get('address');
    const lat = this.form.get('latitude');
    const lng = this.form.get('longitude');
    return city.invalid || address.invalid || lat.invalid || lng.invalid;
  }

  displayFn(value: any) {
    if (value) {
      return value.address;
    }
  }

  onAddressSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (value) {
      // const [street, city] = value.address.split(', ');
      // const geo = value.location
      //   ? `${value.location.y}, ${value.location.x}`
      //   : null;
      this.form.get('address').patchValue(value.address);
      this.form.get('latitude').patchValue(value.location.y);
      this.form.get('longitude').patchValue(value.location.x);
    }
  }

  showMapDialog() {
    this.matDialog
      .open<
        EsriMapComponent,
        { coors: number[]; address: string },
        { latitude: number; longitude: number; address: string }
      >(EsriMapComponent, {
        data: {
          coors: [
            this.form.get('latitude').value,
            this.form.get('longitude').value,
          ],
          address: this.fakeAddressControl.value?.address,
        },
        panelClass: 'esri-map',
        width: '80%',
        height: '80%',
        maxWidth: '100%',
        maxHeight: '100%',
      })
      .afterClosed()
      .pipe(first())
      .subscribe((coors) => {
        if (coors) {
          this.form.get('latitude').patchValue(coors.latitude);
          this.form.get('longitude').patchValue(coors.longitude);
          this.form.get('address').patchValue(coors.address);
          this.fakeAddressControl.patchValue({ address: coors.address });
        }
      });
  }

  get created_by() {
    return this.form.get('created_by');
  }
  get team() {
    return this.form.get('team');
  }
  get profesia() {
    return this.form.get('profesia');
  }
  get profession() {
    return this.form.get('profession');
  }
  get comments() {
    return this.form.get('comments');
  }
  get last_temperature() {
    return this.form.get('last_temperature');
  }
  get need_sim_unite() {
    return this.form.get('need_sim_unite');
  }
  get new_volunteer() {
    return this.form.get('new_volunteer');
  }
  get black_list() {
    return this.form.get('black_list');
  }
  get received_cards() {
    return this.form.get('received_cards');
  }
  get sent_photo() {
    return this.form.get('sent_photo');
  }
  get received_contract() {
    return this.form.get('received_contract');
  }
  get zone_address() {
    return this.form.get('zone_address');
  }
}

export function ValidateTemperature(control: AbstractControl) {
  if (control.value && (isNaN(control.value) || control.value < minTemp)) {
    return { minlength: { requiredLength: minTemp } };
  }
  if (control.value && (isNaN(control.value) || control.value > maxTemp)) {
    return { maxlength: { requiredLength: maxTemp } };
  }
  return null;
}
