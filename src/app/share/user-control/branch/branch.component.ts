import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { BehaviorSubject, Observable } from 'rxjs';
import { DashboardService } from 'src/app/pages/dashboard/dashboard.service';
type State = { id: number; name: string };
@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent {

  private _branch: any;
  @Input() get branch(): Date {
    return this._branch;
  }
  @Output() branchChange: EventEmitter<any> = new EventEmitter<any>();
  set branch(value: any) {
    this._branch = value;
    this.branchChange.emit(this._branch);
  }
  private _dataBranch: any;
  @Input() get dataBranch(): any {
    return this._dataBranch;
  }
  @Output() dataBranchChange: EventEmitter<any> = new EventEmitter<any>();
  set dataBranch(value: any) {
    this._dataBranch = value;
    this.dataBranchChange.emit(this._dataBranch);
  }
  currentBranch$: Observable<any>;
  constructor(public dashboardService: DashboardService) {
    this.currentBranch$ = this.dashboardService.currentBranch$;
    // dashboardService.getBranch().subscribe(res=>{
    //   this.dataBranch = res;
    // })
  }
  ngOnInit(): void {

    this.currentBranch$.subscribe(res => {
      if (res && res.length <= 1) {
        this.branch = res[0].abbR_NAME;
      }
    })
  }
  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   console.log('branch',this.dataBranch)
    // }, 60000);

  }
  // @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  // focus$ = new Subject<string>();
  // click$ = new Subject<string>();

  // states: State[] = [
  //   { id: 0, name: 'Alabama' },
  //   { id: 1, name: 'Alaska' },
  //   { id: 2, name: 'American Samoa' },
  //   { id: 3, name: 'Arizona' },
  //   { id: 4, name: 'Arkansas' },
  //   { id: 5, name: 'California' },
  //   { id: 6, name: 'Colorado' },
  //   { id: 7, name: 'Connecticut' },
  //   { id: 8, name: 'Delaware' },
  //   { id: 9, name: 'District Of Columbia' },
  //   { id: 10, name: 'Federated States Of Micronesia' },
  //   { id: 11, name: 'Florida' },
  //   { id: 12, name: 'Georgia' },
  //   { id: 13, name: 'Guam' },
  //   { id: 14, name: 'Hawaii' },
  //   { id: 15, name: 'Idaho' },
  //   { id: 16, name: 'Illinois' },
  //   { id: 17, name: 'Indiana' },
  //   { id: 18, name: 'Iowa' },
  //   { id: 19, name: 'Kansas' },
  //   { id: 20, name: 'Kentucky' },
  //   { id: 21, name: 'Louisiana' },
  //   { id: 22, name: 'Maine' },
  //   { id: 23, name: 'Marshall Islands' },
  //   { id: 24, name: 'Maryland' },
  //   { id: 25, name: 'Massachusetts' },
  //   { id: 26, name: 'Michigan' },
  //   { id: 27, name: 'Minnesota' },
  //   { id: 28, name: 'Mississippi' },
  //   { id: 29, name: 'Missouri' },
  //   { id: 30, name: 'Montana' },
  //   { id: 31, name: 'Nebraska' },
  //   { id: 32, name: 'Nevada' },
  //   { id: 33, name: 'New Hampshire' },
  //   { id: 34, name: 'New Jersey' },
  //   { id: 35, name: 'New Mexico' },
  //   { id: 36, name: 'New York' },
  //   { id: 37, name: 'North Carolina' },
  //   { id: 38, name: 'North Dakota' },
  //   { id: 39, name: 'Northern Mariana Islands' },
  //   { id: 40, name: 'Ohio' },
  //   { id: 41, name: 'Oklahoma' },
  //   { id: 42, name: 'Oregon' },
  //   { id: 43, name: 'Palau' },
  //   { id: 44, name: 'Pennsylvania' },
  //   { id: 45, name: 'Puerto Rico' },
  //   { id: 46, name: 'Rhode Island' },
  //   { id: 47, name: 'South Carolina' },
  //   { id: 48, name: 'South Dakota' },
  //   { id: 49, name: 'Tennessee' },
  //   { id: 50, name: 'Texas' },
  //   { id: 51, name: 'Utah' },
  //   { id: 52, name: 'Vermont' },
  //   { id: 53, name: 'Virgin Islands' },
  //   { id: 54, name: 'Virginia' },
  //   { id: 55, name: 'Washington' },
  //   { id: 56, name: 'West Virginia' },
  //   { id: 57, name: 'Wisconsin' },
  //   { id: 58, name: 'Wyoming' },
  // ];
  // formatter = (state: State) => state.name;

  // search: OperatorFunction<string, readonly { id: any; name: any }[]> = (text$: Observable<string>) => {
  //   const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
  //   const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
  //   const inputFocus$ = this.focus$;

  //   return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
  //     map((term) => this.states.filter((state) => new RegExp(term, 'mi').test(state.name)).slice(0, 10)),);
  // }

  // text$.pipe(
  // 	debounceTime(200),
  // 	distinctUntilChanged(),
  // 	filter((term) => term.length >= 0),
  // 	map((term) => this.states.filter((state) => new RegExp(term, 'mi').test(state.name)).slice(0, 10)),
  // );

  data: Array<Select2OptionData> = [
    {
      id: 'heliotrope',
      text: 'Heliotrope',
      //data: { color: 'white', name: 'Heliotrope' },
    },
    {
      id: 'hibiscus',
      text: 'Hibiscus',
      //data: { color: 'red', name: 'Hibiscus' },
    },
  ];
}
