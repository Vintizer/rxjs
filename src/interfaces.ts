export interface ICharacter {
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