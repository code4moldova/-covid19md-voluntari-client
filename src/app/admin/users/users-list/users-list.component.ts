import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { map, takeUntil, tap } from 'rxjs/operators';
import { UsersFacade } from '../users.facade';
import { ActionsSubject } from '@ngrx/store';
import { createUserSuccessAction } from '../users.actions';
import { ofType } from '@ngrx/effects';
import { UsersCreateComponent } from '@users/users-create/users-create.component';
import { forkJoin, Subject } from 'rxjs';
import { User } from '@users/shared/user';
import { UsersService } from '@users/users.service';
import { UsersListResponse } from '@users/shared/users-list-response';
import { UserRole } from '@users/shared/user-role';

@Component({
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit, OnDestroy {
  private _onDestroy = new Subject<void>();
  UserRole = UserRole;
  displayedColumns = ['name', 'phone', 'email', 'role', 'details'];
  isLoading$ = this.usersFacade.isLoading$;
  dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = (undefined as unknown) /* this mutes TS */ as MatPaginator;
  tabs: Tab[] = [
    {
      label: 'Activi',
      count: 0,
      is_active: true,
    },
    {
      label: 'Inactivi',
      count: 0,
      is_active: false,
    },
    {
      label: 'Toti',
      count: 0,
      is_active: undefined,
    },
  ];
  activeTab = this.tabs[0];
  perPageOptions = [10, 20, 50, 100];
  perPage = this.perPageOptions[0];
  page: PageEvent = {
    pageSize: this.perPage,
    pageIndex: 0,
    length: 0,
  };

  constructor(
    private usersFacade: UsersFacade,
    private usersService: UsersService,
    private matDialog: MatDialog,
    private actions$: ActionsSubject
  ) {}

  ngOnInit(): void {
    this.usersFacade.users$
      .pipe(takeUntil(this._onDestroy))
      .subscribe((users) => {
        this.page.length = users.count;
        this.dataSource.data = users.list;
      });

    this.getUsers();
    this.getTabsCount();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onPageChange(page: PageEvent) {
    this.page = page;
    this.getUsers();
  }

  onTabChange(tab: Tab) {
    this.activeTab = tab;
    this.paginator.firstPage();
    this.getUsers();
  }

  getUsers() {
    this.usersFacade.getUsers({
      is_active: this.activeTab.is_active,
      page: this.page.pageIndex,
      per_page: this.page.pageSize,
    });
  }

  getTabsCount() {
    const service = this.usersService;
    const kindOfAllUsers = {
      page: 0,
      // TODO: maybe better we make a new endpoint that returns only the counts
      per_page: Number.MAX_SAFE_INTEGER,
    };

    forkJoin([
      service.getList({ ...kindOfAllUsers, is_active: true }),
      service.getList({ ...kindOfAllUsers, is_active: false }),
      service.getList({ ...kindOfAllUsers, is_active: undefined }),
    ])
      .pipe(map(extractUsersListsCounts), takeUntil(this._onDestroy))
      .subscribe(([activeUsers, nonActiveUsers, allUsers]) => {
        const activeTab = this.tabs.find((t) => t.is_active === true);
        const nonActiveTab = this.tabs.find((t) => t.is_active === false);
        const allTab = this.tabs.find((t) => t.is_active === undefined);
        // In reality tabs exist, we check to make TS happy
        if (activeTab) activeTab.count = activeUsers;
        if (nonActiveTab) nonActiveTab.count = nonActiveUsers;
        if (allTab) allTab.count = allUsers;
      });
  }

  openNewUserDialog() {
    const dialogRef = this.matDialog.open(UsersCreateComponent, {
      width: '550px',
    });

    this.actions$
      .pipe(
        ofType(createUserSuccessAction),
        tap(() => this.usersFacade.getUsers()),
        takeUntil(dialogRef.afterClosed())
      )
      .subscribe(() => dialogRef.close());
  }
}

type Tab = {
  label: string;
  count: number;
  is_active: undefined | boolean;
};

function extractUsersListsCounts(results: UsersListResponse[]): number[] {
  return results.map((users) => users.list.length);
}
