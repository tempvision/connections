import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatDialog } from '@angular/material/dialog';
import { RulesComponent } from './rules/rules.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'connections';

  randomizedWords: Array<string> = [];
  guessedWords: Array<{ words: Array<string>, categoryName: string, color: string | undefined }> = [];

  // words: any = {
  //   "food": {
  //     "words": ["Пица", "Сьомга", "Киноа", "Манго"],
  //     "categoryName": "Храни"
  //   },
  //   "cars": {
  //     "words": ["Тойота", "Тесла", "Ферари", "Хонда"],
  //     "categoryName": "Автомобили"
  //   },
  //   places: {
  //     "words": ["Париж", "Ню Йорк", "Токио", "Сидни"],
  //     "categoryName": "Места"
  //   },
  //   "instruments": {
  //     "words": ["Пиано", "Китара", "Цигулка", "Тромпет"],
  //     "categoryName": "Инструменти"
  //   }
  // };

  // words: WordsObject = {
  //   pesni: {
  //     "words": ["Кукла", "Спасение", "Шоколад", "Приказка"],
  //     "categoryName": "Песни"
  //   },
  //   media: {
  //     "words": ["Капитал", "Марица", "Дарик", "Бивол"],
  //     "categoryName": "Медии"
  //   },
  //   cheren: {
  //     "words": ["Бъз", "Чай", "Петък", "Дроб"],
  //     "categoryName": "Черен ....."
  //   },
  //   literature: {
  //     "words": ["Фейлетон", "Проза", "Роман", "Басня"],
  //     "categoryName": "Литература"
  //   }
  // };

    words: WordsObject = {
    duhove: {
      "words": ["Вампир", "Тенец", "Караконджул", "Призрак"],
      "categoryName": "Духове"
    },
    kotki: {
      "words": ["Персия", "Бриталния", "Сибир", "Шотландия"],
      "categoryName": "Породи котки, кръстени на държава"
    },
    sastoqniq: {
      "words": ["Твърдо", "Течно", "Газообразно", "Плазма"],
      "categoryName": "Агрегатни състояния"
    },
    ujni: {
      "words": ["Корея", "Америка", "Полюс", "Африка"],
      "categoryName": "Географски понятия с Южен/Южна"
    }
  };

  colors = ["bisque", "aquamarine", "cornsilk", "thistle"];


  currentSelection: Array<string> = [];

  constructor(private snackBar: MatSnackBar,
    private db: AngularFireDatabase,
    public dialog: MatDialog
  ) {

  }


  ngOnInit(): void {
    this.randomizedWords = this.shuffleArray(Object.values(this.words).reduce((acc: any, category: any) => acc.concat(category.words), []));

    const words = this.db.object(`/words`).valueChanges().subscribe(res => console.log(res))

    // const tutorialsRef = this.db.object(`/words/24-11-23`);
    // tutorialsRef.set(this.words);
    console.log(words)

    this.words = this.assignColors(this.words);

    console.log(this.words)

    // assign colors: bisque, aquamarine, cornsilk, thistle

    // this.currentSelection = ["Париж", "Ню Йорк", "Токио", "Сидни"]; // REMOVE

  }

  assignColors(obj: WordsObject): WordsObject {
    const colorDict: WordsObject = {};
    Object.keys(obj).forEach((key, index) => {
      const color = this.colors[index % this.colors.length];
      colorDict[key] = { ...obj[key], color };
      colorDict[key].color = color; // Add color property inside the nested structure
    });
    return colorDict;
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

    this.guessIsCorrect(Object.keys(categoriesCount)[0]);
  }

  guessIsCorrect(category: string) {
    this.randomizedWords = this.randomizedWords.filter(
      word => !this.currentSelection.includes(word)
    );

    this.guessedWords.push({ categoryName: this.words[category].categoryName, words: this.words[category].words, color: this.words[category].color })

    this.currentSelection = [];
  }

  guessIsIncorrect() {
    this.snackBar.open('Try again', 'Sad! :/', { panelClass: ['success-snackbar'], duration: 4000 });
  }

  showOneAway() { // tbi
    this.snackBar.open('One away!', 'Sad! :/', { panelClass: ['success-snackbar'], duration: 4000 });
  }

  deselect() {
    this.currentSelection = [];
  }

  isWordInCategory(selectedWord: { word: string; category: any }): boolean {
    const category = this.words[selectedWord.category];
    return category && category.words.includes(selectedWord.word);
  }

  showRules() {
    this.dialog.open(RulesComponent)
  }

}

interface Category {
  words: string[];
  categoryName: string;
  color?: string; // Optional color property
}

interface WordsObject {
  [key: string]: Category;
}