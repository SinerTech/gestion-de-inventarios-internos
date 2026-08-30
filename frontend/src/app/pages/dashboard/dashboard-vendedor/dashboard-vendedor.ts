import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  selector: 'app-dashboard-vendedor',
  styleUrl: './dashboard-vendedor.css',
  templateUrl: './dashboard-vendedor.html',
})
export class DashboardVendedor {}