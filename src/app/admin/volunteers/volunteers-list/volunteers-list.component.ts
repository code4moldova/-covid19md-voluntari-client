import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';

import { VolunteerPageParams, VolunteersFacade } from '../volunteers.facade';
import { TagsFacade } from '@shared/tags/tags.facade';
import { GeolocationService } from '@shared/services/geolocation/geolocation.service';

import { IVolunteer } from '@shared/models';
import { ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { map, take, takeUntil } from 'rxjs/operators';
import { saveVolunteerSuccessAction } from '../volunteers.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { KIV_ZONES, VOLUNTEER_ROLES } from '@shared/constants';
import { FilterObservableSelectColumns } from '@shared/filter/filter.types';
import { VolunteersCreateComponent } from '../volunteers-create/volunteers-create.component';

@Component({
  templateUrl: './volunteers-list.component.html',
})
export class VolunteersListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = [
    'icons',
    'name',
    'phone',
    'zone',
    'availableHours',
  ];
  dataSource$: Observable<IVolunteer[]>;
  isLoading$ = this.volunteersFacade.isLoading$;
  count$ = this.volunteersFacade.count$;
  allStatusesCounts$: BehaviorSubject<number[]> = new BehaviorSubject([]);
  observableSelectColumns: FilterObservableSelectColumns[];
  tabs: Tab[] = [
    { label: 'Activi', status: 'active' },
    { label: 'Inactivi', status: 'inactive' },
    { label: 'Blacklist', status: 'blacklist' },
    { label: 'Toti', status: null },
  ];
  activeTab = this.tabs[0];
  selectedTabStatus$ = this.activeRoute.queryParams.pipe(
    map((params) => {
      const status = params.status;
      if (status) {
        this.activeTab = this.tabs.find((tab) => tab.status === status);
        return status;
      }
      return null;
    })
  );

  page: VolunteerPageParams = { pageSize: 20, pageIndex: 1 };
  lastFilter = {};
  filterForm = this.fb.group({
    query: [null],
    zone: [null],
    role: [null],
  });
  zones = KIV_ZONES;
  roles = VOLUNTEER_ROLES;
  tagById$ = (id: any) => this.tagsFacadeService.availabilitiesById$(id);

  constructor(
    private fb: FormBuilder,
    private volunteersFacade: VolunteersFacade,
    private tagsFacadeService: TagsFacade,
    private matDialog: MatDialog,
    private actions$: ActionsSubject,
    private geolocationService: GeolocationService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activeRoute.queryParams.pipe(take(1)).subscribe((params) => {
      this.filterForm.patchValue(params);
    });
  }

  ngOnInit() {
    this.getAllStatusesCount();
    this.volunteersFacade.getVolunteers(this.page);
    this.dataSource$ = this.volunteersFacade.volunteers$;
    this.onTabChange(this.activeTab);

    this.observableSelectColumns = [
      {
        name: 'Offer',
        value: 'offer',
        array: this.tagsFacadeService.offersTags$,
      },
      {
        name: 'Sector',
        value: 'zone_address',
        array: of(KIV_ZONES),
      },
    ];
  }

  // TODO
  onVolunteersImport(): void {}

  // TODO
  onVolunteersExport(): void {}

  getAllStatusesCount() {
    const requests = this.tabs.map((tab) =>
      this.helperGetCountByStatus(tab.status)
    );
    forkJoin(requests)
      .pipe(take(1))
      .subscribe((res) => {
        this.allStatusesCounts$.next(res);
      });
  }

  helperGetCountByStatus(status: string) {
    return this.volunteersFacade
      .getByStatus(status)
      .pipe(map((res) => res.count));
  }

  queryResult(criteria: { [keys: string]: string }) {
    this.lastFilter = criteria;
    this.page = { pageSize: 20, pageIndex: 1 };
    this.volunteersFacade.getVolunteers(this.page, criteria);
  }

  onPageChange(event: PageEvent) {
    this.page = { pageSize: event.pageSize, pageIndex: event.pageIndex + 1 };
    this.volunteersFacade.getVolunteers(this.page, this.lastFilter);
  }

  openNewVolunteerDialog() {
    const dialogRef = this.matDialog.open(VolunteersCreateComponent, {
      width: '550px',
    });

    this.actions$
      .pipe(
        ofType(saveVolunteerSuccessAction),
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe(() => {
        this.volunteersFacade.getVolunteers(this.page, this.lastFilter);
        dialogRef.close();
      });
  }

  onTabChange(tab: Tab) {
    this.activeTab = tab;
    this.paginator.firstPage();
    this.getUsers();
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: {
          status: tab.status,
        },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  getUsers() {
    let filters = {};
    if (this.activeTab.status !== null) {
      filters = { status: this.activeTab.status };
    }
    this.volunteersFacade.getVolunteers(this.page, filters);
  }

  onSearchSubmit() {
    const query: any = {};
    const filters = this.filterForm.value;
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].length > 0) {
        query[key] = filters[key];
      }
    });
    if (this.activeTab) {
      query.status = this.activeTab;
    }
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: {
          ...query,
        },
      })
      .then();
  }

  // for type hints
  _(element): IVolunteer {
    return element as IVolunteer;
  }
}

type Tab = {
  label: string;
  status: string;
};
