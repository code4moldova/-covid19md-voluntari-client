import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Observable, BehaviorSubject, zip, forkJoin } from 'rxjs';
import { map, count, take, takeUntil } from 'rxjs/operators';

import {
  RequestsFacadeService,
  RequestPageParams,
} from '@services/requests/requests-facade.service';
import { UsersFacadeService } from '@services/users/users-facade.service';
import { GeolocationService } from '@services/geolocation/geolocation.service';

import {
  FilterInputColumns,
  FilterSelectColumns,
  FilterObservableSelectColumns,
} from '@models/filter';
import { IRequest } from '@models/requests';
import { IUser } from '@models/user';
import { ZoneI } from '@models/geolocation';
import { TagsFacadeService } from '@services/tags/tags-facade.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { saveRequestSuccessAction } from '@store/requests-store/actions';
import { RequestDetailsComponent } from '../request-details/request-details.component';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = [
    'icons',
    'name',
    'phone',
    'sector',
    'createdDate',
    'status',
    'fixer',
  ];
  dataSource$: Observable<IRequest[]>;
  isLoading$ = this.requestsFacade.isLoading$;
  newRequest$ = this.requestsFacade.newRequests;
  count$ = this.requestsFacade.requestsCount$;

  public inputColumns: FilterInputColumns[];
  public selectColumns: FilterSelectColumns<{
    label: string;
    _id: string | boolean;
  }>[];
  public observableSelectColumns: FilterObservableSelectColumns<
    IUser | ZoneI
  >[];
  public selectedIndex: number = 0;

  lastFilter = {};
  page: RequestPageParams = { pageSize: 20, pageIndex: 1 };

  private isActive = [
    {
      label: 'Yes',
      _id: true,
    },
    {
      label: 'No',
      _id: false,
    },
  ];

  @ViewChild('empty', { static: true }) empty: ElementRef;
  selectedTab: string = 'all';
  selectedTabIndex$ = this.activeRoute.queryParams.pipe(
    map((params) => {
      const status = params['status'];

      if (status) {
        this.selectedTab = status;

        return (
          this.tagsFacade.getStatusOptions().findIndex((stats) => {
            return stats._id === status;
          }) + 1
        );
      }
      return 0;
    })
  );
  filteredRows: any;

  allStatuses = this.tagsFacade.getStatusOptions();

  allStatusesCounts$: BehaviorSubject<number[]> = new BehaviorSubject([]);

  constructor(
    private requestsFacade: RequestsFacadeService,
    private usersFacadeService: UsersFacadeService,
    private geolocationService: GeolocationService,
    private tagsFacade: TagsFacadeService,
    private renderer: Renderer2,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private actions$: ActionsSubject
  ) {
    this.getAllStatusesCount();
  }

  getAllStatusesCount() {
    const requests = [{}, ...this.allStatuses].map((status) =>
      this.helperGetCountByStatus(status['_id'])
    );
    forkJoin(requests)
      .pipe(take(1))
      .subscribe((res) => {
        this.allStatusesCounts$.next(res);
      });
  }

  helperGetCountByStatus(status: string) {
    return this.requestsFacade
      .getRequestByStatus(status)
      .pipe(map((res) => res.count));
  }

  zoneById$(zoneId: string) {
    return this.requestsFacade.zones$.pipe(
      map((zones) => zones.find((z) => z._id === zoneId))
    );
  }

  operatorById$(fixer: string) {
    return this.usersFacadeService.users$.pipe(
      map((users) => users.find((u) => u._id === fixer))
    );
  }

  ngOnInit() {
    this.fetchRequests();
    this.usersFacadeService.getUsers();
    this.dataSource$ = this.requestsFacade.requests$;

    this.inputColumns = [
      { name: 'First Name', value: 'first_name' },
      { name: 'Last Name', value: 'last_name' },
      { name: 'Phone', value: 'phone', icon: 'phone' },
    ];

    this.observableSelectColumns = [
      { name: 'Fixer', value: 'fixer', array: this.usersFacadeService.users$ },
      {
        name: 'Zone address',
        value: 'zone_address',
        array: this.geolocationService.getZonesFromFilter(),
      },
    ];

    this.selectColumns = [
      { name: 'Is Active', value: 'is_active', array: this.isActive },
    ];
  }

  getStatusLabel(status: string) {
    const allStatuses = this.tagsFacade.getStatusOptions();
    return (allStatuses.find((s) => s._id === status) || {}).label || 'unknown';
  }

  onTabChanged(event: MatTabChangeEvent) {
    let status = null;

    if (typeof event.tab.textLabel !== 'string') {
      status = event.tab.textLabel['_id'];
      this.selectedTab = status;
    }

    this.helperGetCountByStatus(status).subscribe((count) => {
      const counts = this.allStatusesCounts$.getValue();
      counts[event.index] = count;
      this.allStatusesCounts$.next(counts);
    });

    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: {
        status,
      },
      queryParamsHandling: 'merge',
    });

    return;
  }

  fetchRequests() {
    this.requestsFacade.getRequests(this.page);
    this.requestsFacade.resetNewRequests();
  }

  queryResult(criteria: { [keys: string]: string }) {
    this.lastFilter = criteria;
    this.page = { pageSize: 20, pageIndex: 1 };
    this.requestsFacade.getRequests(this.page, criteria);
  }

  onPageChange(event: PageEvent) {
    this.page = { pageSize: event.pageSize, pageIndex: event.pageIndex + 1 };
    this.requestsFacade.getRequests(this.page, this.lastFilter);
  }

  onExport() {
    this.requestsFacade.getExportRequests().subscribe((res) => {
      console.log(res);
      this.downloadCsv(res);
    });
  }

  downloadCsv(blob: Blob) {
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, 'requests.csv');
    } else {
      const a = this.renderer.createElement('a');
      this.renderer.setAttribute(a, 'href', window.URL.createObjectURL(blob));
      this.renderer.setAttribute(a, 'download', 'requests.csv');

      a.click();
    }
  }

  openNewRequestDialog() {
    let dialogRef = this.matDialog.open(RequestDetailsComponent, {
      data: {},
      maxWidth: '100%',
      maxHeight: '90vh',
    });

    this.actions$
      .pipe(
        ofType(saveRequestSuccessAction),
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe(() => {
        this.requestsFacade.getRequests(this.page, this.lastFilter);
        this.getAllStatusesCount();
        dialogRef.close();
      });
  }
}
