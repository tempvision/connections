import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

  constructor(private snackBar: MatSnackBar) {

  }

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

  }

  checkCategories(selectedWords: string[], words: any): void | undefined {
    if (this.currentSelection.length !== 4) {
      return;
    }

    const categoriesCount: { [category: string]: number } = {};

    // Count the occurrences of each category in the selected words
    selectedWords.forEach(word => {
      const category = Object.keys(words).find(cat =>
        words[cat].words.includes(word)
      );

      if (category) {
        categoriesCount[category] = (categoriesCount[category] || 0) + 1;
      }
    });

    // Check if three words are from the same category
    const oneAwayCategory = Object.keys(categoriesCount).find(
      category => categoriesCount[category] === 3
    );

    if (oneAwayCategory) {
      return this.showOneAway();
    }

    // Check if all words are in the same category
    const allInSameCategory = Object.keys(categoriesCount).length === 1;

    if (!allInSameCategory) {
      return this.guessIsIncorrect();
    }

    this.guessIsCorrect();
  }

  guessIsCorrect() {

  }

  guessIsIncorrect() {
    this.snackBar.open('Try again', 'Sad! :/');
  }

  showOneAway() { // tbi
    this.snackBar.open('One away!', 'Sad! :/');
  }

  deselect() {
    this.currentSelection = [];
  }

  isWordInCategory(selectedWord: { word: string; category: any }): boolean {
    const category = this.words[selectedWord.category];
    return category && category.words.includes(selectedWord.word);
  }

}
