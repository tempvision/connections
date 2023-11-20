import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'connections';

  randomizedWords: Array<string> = [];

  words: any = {
    food: {
      words: ["Пица", "Сьомга", "Киноа", "Манго"],
      categoryName: "Храни"
    },
    cars: {
      words: ["Тойота", "Тесла", "Ферари", "Хонда"],
      categoryName: "Автомобили"
    },
    places: {
      words: ["Париж", "Ню Йорк", "Токио", "Сидни"],
      categoryName: "Места"
    },
    instruments: {
      words: ["Пиано", "Китара", "Цигулка", "Тромпет"],
      categoryName: "Инструменти"
    }
  };


  currentSelection: Array<string> = [];

  ngOnInit(): void {
    this.randomizedWords = this.shuffleArray(Object.values(this.words).reduce((acc: any, category: any) => acc.concat(category.words), []));
  }

  shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  selectWord(word: string) {
    if (this.currentSelection.length === 4 && !this.currentSelection.includes(word)) {
      return;
    }

    if (this.currentSelection.includes(word)) {
      // If the word is already selected, remove it
      this.currentSelection = this.currentSelection.filter(selectedWord => selectedWord !== word);
    } else {
      // If the word is not selected, add it
      this.currentSelection.push(word);
    }

    if (this.currentSelection.length > 1) {
      const result = this.checkCategories(this.currentSelection, this.words);

      if (result) {
        console.log("All selected words are from the same category!");
      } else {
        console.log("Selected words are from different categories or no category!");
      }
    }
  }

  checkCategories(selectedWords: string[], words: any): boolean {
    if (selectedWords.length === 0) {
      return false; // No selected words
    }

    const firstCategory = Object.keys(words).find(category => // get the category of the first word and compare the other words
      words[category].words.includes(selectedWords[0])
    );

    if (!firstCategory) {
      return false; // First word doesn't belong to any category
    }

    return selectedWords.every(word =>
      Object.keys(words).some(category =>
        category === firstCategory && words[category].words.includes(word)
      )
    );
  }

  isWordInCategory(selectedWord: { word: string; category: any }): boolean {
    const category = this.words[selectedWord.category];
    return category && category.words.includes(selectedWord.word);
  }

}
