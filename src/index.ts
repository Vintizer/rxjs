import { from, fromEvent, Observable, of, combineLatest, interval, timer, merge } from "rxjs";
import {
  map,
  catchError,
  debounceTime,
  switchMap,
  delay,
  find,
  scan,
  filter,
  pluck,
  skip,
  startWith,
  take,
  takeLast,
  throttle,
  distinctUntilChanged,
  mergeMap,
  reduce,
  mergeAll,
  toArray,
  flatMap
} from "rxjs/operators";

const inputElement: HTMLInputElement = document.querySelector("#refInput") as HTMLInputElement;
const genderElement: HTMLSelectElement = document.querySelector("#gender") as HTMLSelectElement;
const statusElement: HTMLSelectElement = document.querySelector("#status") as HTMLSelectElement;
const btnElement: HTMLButtonElement = document.querySelector("#getData") as HTMLButtonElement;

interface ICharacter {
  created: string;
  episode: string[];
  gender: "unknown" | "Male" | "Female";
  id: number;
  image: string;
  location: ILocation;
  name: string;
  origin: IOrigin;
  species: string;
  status: "unknown" | "dead" | "alive";
  type: string;
  url: string;
}

interface ILocation {
  name: string;
  url: string;
}
interface IOrigin {
  name: string;
  url: string;
}
interface IInfo {
  count: number;
  next: string;
  pages: number;
  prev: string;
}
interface IResponse {
  info: IInfo;
  results: ICharacter[];
}
function createDom(chars: ICharacter[]) {
  console.log("createDom: ", chars);
  const wrapperElement: HTMLInputElement = document.querySelector(".wrapper") as HTMLInputElement;
  wrapperElement.innerHTML = "";
  chars.forEach(char => {
    const div = document.createElement("div");
    const a: HTMLAnchorElement = document.createElement("a");
    const img: HTMLImageElement = document.createElement("img");
    a.innerHTML = char.name;
    a.setAttribute("href", char.url);
    img.setAttribute("src", char.image);
    img.setAttribute("width", "50");
    img.setAttribute("heigth", "50");
    div.appendChild(a);
    div.appendChild(img);
    wrapperElement.appendChild(div);
  });
}

const filter$: Observable<string> = fromEvent(inputElement, "input").pipe(pluck("target", "value"));
const gender$: Observable<string> = fromEvent(genderElement, "change").pipe(pluck("target", "value"));
const status$: Observable<string> = fromEvent(statusElement, "change").pipe(pluck("target", "value"));

gender$.subscribe(console.log);
status$.subscribe(console.log);

const fetched$: Observable<ICharacter[]> = from(
  fetch(`https://rickandmortyapi.com/api/character/`).then((res: Response) => res.json())
).pipe(
  pluck("results"),
  catchError((err: any) => {
    console.log(err);
    return of(err);
  })
);

fetched$.subscribe(() =>
  from(fetched$).subscribe(createDom, (err: Error) => {
    console.log(err);
  })
);

const filterData$: Observable<ICharacter[]> = filter$.pipe(
  map(val => val),
  debounceTime(500),
  distinctUntilChanged(),
  mergeMap(fil => {
    return fetched$.pipe(
      mergeMap(val => val),
      filter((char: ICharacter) => char.name.toUpperCase().includes(fil.toUpperCase())),
      toArray()
    );
  })
);

const statusData$: Observable<ICharacter[]> = status$.pipe(
  map(val => val),
  mergeMap(status => {
    return fetched$.pipe(
      mergeMap(val => val),
      filter((char: ICharacter) => char.status === status),
      toArray()
    );
  })
);

const genderData$: Observable<ICharacter[]> = gender$.pipe(
  map(val => val),
  mergeMap(gender => {
    return fetched$.pipe(
      mergeMap(val => val),
      filter((char: ICharacter) => char.gender === gender),
      toArray()
    );
  })
);

// filterData$.subscribe(createDom, (err: Error) => {
//   console.log(err);
// });
const res = merge(filterData$, statusData$, genderData$);
const res2 = merge(filter$, status$, gender$);
// res.subscribe(createDom, (err: Error) => {
//   console.log(err);
// });
res2.subscribe(val=>{
  
})
// statusData$.subscribe(createDom, (err: Error) => {
//   console.log(err);
// });
// genderData$.subscribe(createDom, (err: Error) => {
//   console.log(err);
// });
