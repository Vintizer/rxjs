import { ICharacter } from "./interfaces";
import { from, fromEvent, Observable, of, merge, BehaviorSubject, ReplaySubject } from "rxjs";
import { map, catchError, debounceTime, pluck, distinctUntilChanged } from "rxjs/operators";
import { createDom } from "./dom";

const inputElement: HTMLInputElement = document.querySelector("#refInput") as HTMLInputElement;
const genderElement: HTMLSelectElement = document.querySelector("#gender") as HTMLSelectElement;
const statusElement: HTMLSelectElement = document.querySelector("#status") as HTMLSelectElement;

const filterSubj$ = new BehaviorSubject("");
const statusSubj$ = new BehaviorSubject("All");
const genderSubj$ = new BehaviorSubject("All");

const filter$: Observable<string> = fromEvent(inputElement, "input").pipe(
  map((event: Event) => (event.target as HTMLInputElement).value),
  debounceTime(500),
  distinctUntilChanged(),
  map(val => `filter ${val}`)
);
const gender$: Observable<string> = fromEvent(genderElement, "change").pipe(
  pluck("target", "value"),
  map(val => `gender ${val}`)
);
const status$: Observable<string> = fromEvent(statusElement, "change").pipe(
  pluck("target", "value"),
  map(val => `status ${val}`)
);

const getData$ = new ReplaySubject<ICharacter[]>(1);

const getFetchedData$ = from(
  fetch(`https://rickandmortyapi.com/api/character/`).then((res: Response) => res.json())
).pipe(
  pluck("results"),
  catchError((err: any) => {
    console.log(err);
    return of(err);
  })
);

getFetchedData$.subscribe(data => getData$.next(data));

const res$ = merge(filter$, status$, gender$);
function prepareData(val: string) {
  const splitIndex: number = val.indexOf(" ");
  const filterVal: string = val.slice(splitIndex + 1);
  switch (val.slice(0, splitIndex)) {
    case "filter":
      filterSubj$.next(filterVal);
      break;
    case "gender":
      genderSubj$.next(filterVal);
      break;
    case "status":
      statusSubj$.next(filterVal);
      break;
  }

  const curFilter: string = filterSubj$.getValue();
  const curGender: string = genderSubj$.getValue();
  const curStatus: string = statusSubj$.getValue();

  getData$.subscribe(chars => {
    const filteredChars: ICharacter[] = chars.filter(char => {
      const isFilter: boolean = char.name.toUpperCase().includes(curFilter.toUpperCase());
      const isGender: boolean = curGender === "All" ? true : char.gender === curGender;
      const isStatus: boolean = curStatus === "All" ? true : char.status === curStatus;
      return isFilter && isGender && isStatus;
    });

    createDom(filteredChars, document);
  });
}
res$.subscribe(prepareData);
prepareData("filter ");
