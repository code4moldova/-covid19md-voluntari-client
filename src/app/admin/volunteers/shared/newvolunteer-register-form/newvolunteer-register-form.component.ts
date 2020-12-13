import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { DAYS_OF_WEEK, VOLUNTEER_ROLES, VOLUNTEER_ROLES_ICONS, ZONES } from '@app/shared/constants'
import { IVolunteer } from '@app/shared/models'
import { Subscription } from 'rxjs'
import { VolunteersFacade } from '../../volunteers.facade'
import { FormHoursSelectorComponent } from '../form-hours-selector/form-hours-selector.component'

export interface NewRegistrationFormFields {
  header: string
  controlName: string
  type?: string
  pattern?: string
  errorMessage?: string
}

export interface AvailabilityHours {
  start: number
  end: number
}

@Component({
  templateUrl: './newvolunteer-register-form.component.html',
  styleUrls: ['./newvolunteer-register-form.component.scss']
})
export class NewVolunteerRegisterFormComponent implements OnInit {
  form: FormGroup
  private matDialog: MatDialog
  formFields: Array<NewRegistrationFormFields> = [
    {
      header: 'Nume (Familie)',
      controlName: 'first_name',
      errorMessage: 'atenție, eroare!'
    },
    { header: 'Prenume', controlName: 'last_name' },
    {
      header: 'Număr Telefon',
      controlName: 'phone',
      errorMessage: '8 cifre vă rugăm, fără 0 la început.'
    },
    {
      header: 'Email',
      controlName: 'email',
      errorMessage: 'respectați formatul email'
    },
    { header: 'Sector', controlName: 'zone' },
    { header: 'Adresa', controlName: 'address' },
    {
      header: 'Vîrsta',
      controlName: 'age',
      errorMessage: ' Doar vîrsta cu valorile intre  16 și 50 este acceptata'
    },
    {
      header: 'Profil Rețea Socializare',
      controlName: 'facebook_profile',
      errorMessage: 'atenție, eroare!'
    }
  ]

  stdErrMessage = 'atenție, eroare - cîmp obligatoriu!'
  hrsErrMessage = ''
  startHour = ''
  endHour = ''
  roles = VOLUNTEER_ROLES
  volunteerRolesIncons = VOLUNTEER_ROLES_ICONS
  zones: Array<string> = Object.keys(ZONES).filter((key) => isNaN(+key))
  daysOfWeek = DAYS_OF_WEEK

  constructor(private volunteersService: VolunteersFacade, private dialogRef: MatDialogRef<any>) {}

  checkHoursForError(el: string) {
    console.log(' ~ updateStartHours ~ event', el)
    this.hrsErrMessage = el
    console.log(this.form.value.availability_hours_start)
    console.log(this.form.value.availability_hours_end)
  }

  onSubmit(ev) {
    let newVolunteer: IVolunteer = this.form.value
    console.log(' ~ onSubmit', this.form)

    let endH = this.form.get('availability_hours_end').value.split(':', 1)[0]
    let startH = this.form.get('availability_hours_start').value.split(':', 1)[0]

    newVolunteer = Object.assign({ ...newVolunteer, availability_hours_start: startH, availability_hours_end: endH })
    this.volunteersService.saveVolunteer(newVolunteer)
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      first_name: new FormControl('Test', [Validators.required]),
      last_name: new FormControl('Testerer', [Validators.required]),
      phone: new FormControl('1234567', [Validators.required, Validators.pattern(/^[^0]([0-9]){7}$/)]),
      email: new FormControl('a@gmail.com', [Validators.required, Validators.email]),
      zone: new FormControl('botanica', [Validators.required, Validators.minLength(3)]),
      address: new FormControl('ssssss', [Validators.required]),
      age: new FormControl('40', [
        Validators.required,
        Validators.min(16),
        Validators.max(50),
        Validators.pattern(/^([0-9]){2}$/)
      ]),
      facebook_profile: new FormControl(''),
      role: new FormControl([], [Validators.required, Validators.minLength(1)]),
      availability_days: new FormControl(['monday'], [Validators.required, Validators.minLength(1)]),
      availability_hours_start: new FormControl('08:00', [Validators.required, Validators.minLength(5)]),
      availability_hours_end: new FormControl('12:00', [Validators.required, Validators.minLength(5)])
    })
  }

  closeDialog() {
    this.dialogRef.close()
  }

  enumUnsorted() {}

  openHoursSelectDialog() {
    const dialogRef = this.matDialog.open(
      // FormHoursSelectorComponent,
      FormHoursSelectorComponent,
      {
        data: {},
        maxWidth: '100%',
        maxHeight: '90vh'
      }
    )
  }

  get formAll() {
    return this.form
  }
}
