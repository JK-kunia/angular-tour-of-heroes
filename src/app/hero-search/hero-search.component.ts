import { Component, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";

@Component({
  selector: "app-hero-search",
  templateUrl: "./hero-search.component.html",
  styleUrls: ["./hero-search.component.scss"],
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // 検索語をobservableストリームにpushする
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // 各キーストロークの後検索前に300ms待つ
      debounceTime(300),
      // 直前と同じ検索語は無視する
      distinctUntilChanged(),
      // 検索語が変わるたびに、新しい検索observableにスイッチする
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }
}
