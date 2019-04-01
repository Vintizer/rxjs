import { ICharacter } from './interfaces';

export function createDom(chars: ICharacter[], document: Document) {
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