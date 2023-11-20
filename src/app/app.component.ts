import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'connections';

  words: Array<string> = [
    "Пица",        // Pizza
    "Сьомга",      // Salmon
    "Киноа",       // Quinoa
    "Манго",       // Mango
    "Авокадо",     // Avocado
    "Шоколад",     // Chocolate
    "Спанак",      // Spinach
    "Суши",        // Sushi
    "Боровинки",   // Blueberries
    "Такос",       // Tacos
    "Паста",       // Pasta
    "Диня",        // Watermelon
    "Пилешко кари",// Chicken curry
    "Броколи",     // Broccoli
    "Сладолед",    // Ice cream
    "Хумус"        // Hummus
  ];

  currentSelection: Array<number> = [];

  ngOnInit(): void {

  }

  selectWord(word: string, wordIndex: number) {
    this.currentSelection.indexOf(wordIndex) !== -1 ?  this.currentSelection.splice(this.currentSelection.indexOf(wordIndex), 1) : this.currentSelection.push(wordIndex);
    console.log(this.currentSelection)
  }
}
