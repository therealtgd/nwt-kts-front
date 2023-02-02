import { Component, Input, OnInit } from '@angular/core';
import { ContextData } from 'src/app/dto/context-data';
import { RouteDto } from 'src/app/dto/route-dto';
import { ClientService } from 'src/app/services/client/client.service';

@Component({
  selector: 'app-favorite-routes',
  templateUrl: './favorite-routes.component.html',
  styleUrls: ['./favorite-routes.component.css']
})
export class FavoriteRoutesComponent implements OnInit {
  @Input() user!: ContextData;
  favorites: RouteDto[] = [];

  constructor (
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.clientService.getFavorites()
    .subscribe
    ({
      next: (data) => this.setFavorites(data.body),
      error: (error) => console.log(error.error)
    })
  }
  setFavorites(routeDto: RouteDto[] | null) {
    if (routeDto){
      this.favorites = routeDto;
    }
  }
}
