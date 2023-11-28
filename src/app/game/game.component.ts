import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatDialog } from '@angular/material/dialog';
import { RulesComponent } from '../rules/rules.component';
import { ResultComponent } from '../result/result.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  randomizedWords: Array<string> = [];
  guessedWords: Array<{ words: Array<string>, categoryName: string, color: string | undefined }> = [];

  words: WordsObject;

  colors = ["#B74F6F", "#ADBDFF", "#FAA381", "#230C0F"];

  currentSelection: Array<string> = [];
  guessedWordsColor: Array<any> = [];
  livesLeft: number = 5;

  constructor(private snackBar: MatSnackBar,
    private db: AngularFireDatabase,
    public dialog: MatDialog
  ) {
  }


  ngOnInit(): void {
    this.userHasReadTheRules() ? '' : this.showRules();
    this.db.object(`/words/${new Date().toJSON().slice(0, 10)}`).valueChanges().subscribe((res: any) => {
      console.log(res)
      this.words = res;
      this.randomizedWords = this.randomizeWords(this.words)
    })
  }

  userHasReadTheRules() {
    return localStorage.getItem('user-has-read-the-rules') ? true : false;
  }

  randomizeWords(words: WordsObject) {
    return this.shuffleArray(Object.values(words).reduce((acc: any, category: any) => acc.concat(category.words), []));
  }

  getLives(count: number) {
    return Array(count).fill(0).map((x, i) => i);
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

  getRemainingCategory() {
    const remainingCategories: any = [];

    Object.keys(this.words).forEach(category => {
      const remainingWords = this.words[category].words.filter(word => this.randomizedWords.includes(word));
      if (remainingWords.length > 0) {
        remainingCategories.push({
          words: remainingWords,
          categoryName: this.words[category].categoryName,
          color: this.words[category].color
        });
      }
    });

    if (remainingCategories.length > 0) {
      // If there are remaining categories, return the first one
      return remainingCategories;
    }

    // If no remaining categories, return undefined
    return undefined;
  }

  checkLives() {
    this.livesLeft -= 1;

    if (this.livesLeft === 0) {
      const remainingCategory = this.getRemainingCategory();

      if (remainingCategory) {
        this.guessedWords = [...this.guessedWords, ...remainingCategory];
      }
      this.openResults();
      return;
    }
  }

  openResults() {
    this.dialog.open(ResultComponent, {
      data: {
        colors: this.guessedWordsColor
      }
    })
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
      this.checkLives();
      return this.showOneAway();
    }

    // Check if all words are in the same category
    const allInSameCategory = Object.keys(categoriesCount).length === 1;

    if (!allInSameCategory) {
      this.checkLives();
      return this.guessIsIncorrect();
    }

    this.guessIsCorrect(Object.keys(categoriesCount)[0]);

  }

  guessIsCorrect(category: string) {
    this.randomizedWords = this.randomizedWords.filter(
      word => !this.currentSelection.includes(word)
    );

    const categoryColors = this.currentSelection.map(word => this.words[category].color);
    this.guessedWordsColor.push(categoryColors);

    this.guessedWords.push({ categoryName: this.words[category].categoryName, words: this.words[category].words, color: this.words[category].color })

    this.currentSelection = [];

    if (this.guessedWords.length === 4) {
      this.openResults();
    }
  }

  guessIsIncorrect() {
    this.snackBar.open('Опитай пак', 'Ок! :/', { panelClass: ['success-snackbar'], duration: 4000 });

    const incorrectColors = this.currentSelection.map(word => {
      const category = Object.keys(this.words).find(cat =>
        this.words[cat].words.includes(word)
      );
      return category ? this.words[category].color : "";
    });

    this.guessedWordsColor.push(incorrectColors);
  }

  showOneAway() { // tbi
    this.snackBar.open('Много близо!', 'Ок! :/', { panelClass: ['success-snackbar'], duration: 4000 });

    const oneAwayColors = this.currentSelection.map(word => {
      const category = Object.keys(this.words).find(cat =>
        this.words[cat].words.includes(word)
      );
      return category ? this.words[category].color : "";
    });

    this.guessedWordsColor.push(oneAwayColors);
  }

  deselect() {
    this.currentSelection = [];
  }

  isWordInCategory(selectedWord: { word: string; category: any }): boolean {
    const category = this.words[selectedWord.category];
    return category && category.words.includes(selectedWord.word);
  }

  showRules() {
    this.dialog.open(RulesComponent);
    localStorage.setItem('user-has-read-the-rules', 'true');
  }

}

export interface Category {
  words: string[];
  categoryName: string;
  color?: string; // Optional color property
}

export interface WordsObject {
  [key: string]: Category;
}

