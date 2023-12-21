import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { WordsObject } from '../game/game.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  apiResponse: any; // Your API response goes here
  nextFreeDate: string;
  newWords: WordsObject = {};
  firstCategory: FormGroup;
  secondCategory: FormGroup;
  thirdCategory: FormGroup;
  fourthCategory: FormGroup;
  loggedIn: boolean;
  username: string;
  allWords: Array<any>;
  constructor(private db: AngularFireDatabase, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.firstCategory = this.fb.group({
      number: { value: '1', disabled: true },
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
      color: ['#B74F6F'],
      categoryInfo: [''],
    });

    this.secondCategory = this.fb.group({
      number: { value: '2', disabled: true },
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
      color: ['#ADBDFF'],
      categoryInfo: [''],
    });

    this.thirdCategory = this.fb.group({
      number: { value: '3', disabled: true },
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
      color: ['#230C0F'],
      categoryInfo: [''],
    });

    this.fourthCategory = this.fb.group({
      number: { value: '4', disabled: true },
      displayCategory: ['', Validators.required],
      word1: ['', Validators.required],
      word2: ['', Validators.required],
      word3: ['', Validators.required],
      word4: ['', Validators.required],
      color: ['#FAA381'],
      categoryInfo: [''],
    });

    window.location.href === 'http://localhost:4200/admin' ? this.loggedIn = true : this.loggedIn = false;

    // colors: 230C0F FAA381 EAF2D7 #B74F6F #ADBDFF
    // https://coolors.co/b74f6f-adbdff-eaf2d7-faa381-230c0f

    this.db.object(`/words`).valueChanges().subscribe((res: any) => { console.log(res); this.apiResponse = res; this.allWords = Object.keys(res); this.findNextFreeDate(res) })

  }

  findNextFreeDate(apiResponse: any) {
    const dateStrings = Object.keys(apiResponse);

    // Convert date strings to Date objects
    const dateObjects = dateStrings.map(dateString => new Date(dateString));

    // Get the last date
    const lastDate = dateObjects[dateObjects.length - 1];

    const missingDate = this.findMissingDate(apiResponse)

    // Calculate the next date by adding one day (86400000 milliseconds) to the last date
    const nextDate = new Date(lastDate.getTime() + 86400000);

    // Format the next date as a string in the 'YYYY-MM-DD' format
    this.nextFreeDate = missingDate ? missingDate : nextDate.toISOString().split('T')[0];
  }

  findMissingDate(data: any) {
    const dates = Object.keys(data).sort();

    for (let i = 0; i < dates.length - 1; i++) {
      const currentDate = dates[i];
      const nextDate = dates[i + 1];

      const currentDateObj = new Date(currentDate);
      const nextDateObj = new Date(nextDate);

      currentDateObj.setDate(currentDateObj.getDate() + 1);

      if (currentDateObj.toISOString().slice(0, 10) !== nextDateObj.toISOString().slice(0, 10)) {
        return currentDateObj.toISOString().slice(0, 10);
      }
    }

    return null; // No missing date found
  }



  saveWords() {

    if (this.firstCategory.valid && this.secondCategory.valid && this.thirdCategory.valid && this.fourthCategory.valid) {
      this.formatWords(this.firstCategory.getRawValue());
      this.formatWords(this.secondCategory.getRawValue());
      this.formatWords(this.thirdCategory.getRawValue());
      this.formatWords(this.fourthCategory.getRawValue());

      console.log(this.newWords)

      this.newWords['randomizedWords'] = this.randomizeWords(this.newWords)
      console.log(this.newWords)

      const wordsAreDuplicated = this.hasDuplicates(this.newWords['randomizedWords']);
      console.log(wordsAreDuplicated)

      if (wordsAreDuplicated) {
        this.snackBar.open('има дублицирана дума ВЕ', 'OF DOBREEE', { panelClass: ['success-snackbar'], duration: 4000 });
        this.newWords = {};
        return;
      }

      const newDatesRef = this.db.object(`/words/${this.nextFreeDate}`);
      newDatesRef.set(this.newWords);

      console.log(this.newWords)
      console.log(newDatesRef)

      this.resetForms();
    } else {
      this.snackBar.open('има nestho nevalidno tuka wa', 'OF DOBREEE', { panelClass: ['success-snackbar'], duration: 4000 });
    }
  }

  hasDuplicates(array: any) {
    return new Set(array).size !== array.length;
  }

  randomizeWords(words: WordsObject) {
    return this.shuffleArray(Object.values(words).reduce((acc: any, category: any) => acc.concat(category.words), []));
  }


  shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  formatWords(rawValue: any) {
    this.newWords[rawValue.number] = {
      words: [rawValue.word1, rawValue.word2, rawValue.word3, rawValue.word4],
      categoryName: rawValue.displayCategory,
      color: rawValue.color,
      categoryInfo: rawValue.categoryInfo ? rawValue.categoryInfo : null
    }

  }

  resetForms() {
    this.firstCategory.reset();
    this.secondCategory.reset();
    this.thirdCategory.reset();
    this.fourthCategory.reset();
  }

  login() {
    if (this.username === 'magdi' || this.username === 'naka') {
      this.loggedIn = true;
    }
  }
}
