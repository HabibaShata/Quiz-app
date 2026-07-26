import { Component, inject, Type } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationSidebar } from './navigation-sidebar/navigation-sidebar';
import { NavBar } from './nav-bar/nav-bar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, NavigationSidebar, NavBar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {}
