import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { People } from './models/people';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Consumir-Api';
  http = inject(HttpClient);
  urlApi = 'http://localhost:5140';
  people$?: Observable<People[]>;
  peopleFound$?: Observable<People>;
  peopleFoundValue = "";
  newPeople = "";
  idUpdate = "";
  nameUpdate = "";

  ngOnInit(): void {
    this.getPeople();
  }

  getPeople() {
    this.people$ = this.http.get<People[]>(`${this.urlApi}/people`)
  }

  getPeopleByName() {
    if (!this.peopleFoundValue)
      return;

    this.peopleFound$ = this.http.get<People>(`${this.urlApi}/people/${this.peopleFoundValue}`);
  }

  addNewPeople() {
    if (!this.newPeople)
      return;

    const peopleCreate: People = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: this.newPeople
    }

    this.http.post<void>(`${this.urlApi}/people`, peopleCreate)
      .subscribe(_ => {
        this.getPeople()
        this.newPeople = "";
      });
  }

  getPeopleClicked(people: People) {
    this.idUpdate = people.id;
    this.nameUpdate = people.name;
  }

  updateNamePeople() {
    if (!this.nameUpdate || !this.idUpdate)
      return;

    const url = `${this.urlApi}/people/${this.idUpdate}`

    const people: People = {
      id: this.idUpdate,
      name: this.nameUpdate
    }

    this.http.put<People>(url, people).subscribe(_ => {
      this.getPeople();
      this.nameUpdate = "";
    });
  }

  removePeople(id: string) {
    id = this.idUpdate;
    if(!id)
      return

    this.http.delete<void>(`${this.urlApi}/people/${id}`).subscribe(_ => {
      this.getPeople();
      this.nameUpdate = "";
    })
  }
}
