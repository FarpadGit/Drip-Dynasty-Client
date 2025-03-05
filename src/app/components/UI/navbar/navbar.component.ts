import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavlinkComponent } from './navlink.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherMenu } from '@ng-icons/feather-icons';

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ featherMenu })],
  template: `<ng-template #content><ng-content /></ng-template>
    <header
      class="min-h-12"
      [ngStyle]="{
        '--navlink-bg': navlinkStyles.bg,
        '--navlink-text': navlinkStyles.text,
        '--navlink-hover-bg': navlinkStyles['hover-bg'],
        '--navlink-hover-text': navlinkStyles['hover-text'],
        '--navlink-active-bg': navlinkStyles['active-bg'],
        '--navlink-active-text': navlinkStyles['active-text'],
      }"
    >
      <nav
        [class]="
          'relative border-x-0 justify-center mt-12 px-4 gap-3 z-10 ' +
          variantClasses
        "
        [ngClass]="{
          'hidden sm:flex': areWeOnAdmin,
          'flex sm:font-Raitor': !areWeOnAdmin
        }"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </nav>

      <!-- Mobile Menu -->
      @if(areWeOnAdmin) {
      <div class="block sm:hidden absolute top-[3%] right-[10%]">
        <button class="relative flex z-20" (click)="openMobileMenu()">
          <ng-icon name="featherMenu" size="2rem" />
        </button>
        @if(mobileMenuOpen === true) {
        <div
          class="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.7)] flex justify-end z-20"
          (click)="closeMobileMenu()"
        ></div>
        }
        <div
          class="fixed top-0 right-0 bg-background p-8 w-[75vw] h-screen z-30 transition-transform duration-300"
          [ngClass]="{
            'translate-x-0': mobileMenuOpen === true,
            'translate-x-full': mobileMenuOpen === false
          }"
          (click)="$event.stopPropagation()"
        >
          @if(isMobile) {
          <div class="flex flex-col gap-4 items-stretch">
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </div>
          }
        </div>
      </div>
      }
    </header>`,
})
export class NavbarComponent implements AfterContentInit, OnDestroy {
  variantClasses: string = '';
  @Input() set variant(value: 'simple' | 'transparent' | 'drip') {
    switch (value) {
      case 'simple':
        {
          this.variantClasses = 'bg-foreground text-background';
          this.navlinkStyles.text =
            'hsl(var(--foreground)) sm:hsl(var(--background))';
          this.navlinkStyles['hover-bg'] = 'hsl(var(--secondary))';
          this.navlinkStyles['hover-text'] = 'hsl(var(--secondary-foreground))';
          this.navlinkStyles['active-bg'] = 'hsl(var(--secondary))';
          this.navlinkStyles['active-text'] =
            'hsl(var(--secondary-foreground))';
        }
        break;
      case 'transparent':
        {
          this.variantClasses = 'bg-transparent text-background';
          this.navlinkStyles.text = 'hsl(var(--foreground))';
          this.navlinkStyles['hover-bg'] = 'hsl(var(--secondary))';
          this.navlinkStyles['hover-text'] = 'hsl(var(--secondary-foreground))';
          this.navlinkStyles['active-bg'] = 'hsl(var(--secondary))';
          this.navlinkStyles['active-text'] =
            'hsl(var(--secondary-foreground))';
        }
        break;
      case 'drip':
      default:
        {
          this.variantClasses =
            'bg-background text-foreground border-gradient-green';
          this.navlinkStyles.text = 'hsl(var(--foreground))';
          this.navlinkStyles['hover-bg'] = 'hsl(var(--border))';
          this.navlinkStyles['hover-text'] = 'hsl(var(--foreground))';
          this.navlinkStyles['active-bg'] = 'hsl(var(--border))';
          this.navlinkStyles['active-text'] = 'hsl(var(--foreground))';
        }
        break;
    }
  }
  navlinkStyles = {
    bg: 'transparent',
    text: '',
    'hover-bg': '',
    'hover-text': '',
    'active-bg': '',
    'active-text': '',
  };

  @ContentChildren(NavlinkComponent) children:
    | QueryList<NavlinkComponent>
    | undefined;
  mobileMenuOpen: boolean = false;
  subs: Subscription[] = [];

  constructor(private router: Router) {
    this.variant = 'drip';
  }

  ngAfterContentInit(): void {
    this.children?.forEach((link) =>
      this.subs.push(link.click.subscribe(() => this.closeMobileMenu()))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  get areWeOnAdmin() {
    return this.router.url.includes('admin');
  }

  openMobileMenu() {
    document.body.style.overflow = 'hidden';
    this.mobileMenuOpen = true;
  }

  closeMobileMenu() {
    document.body.style.removeProperty('overflow');
    this.mobileMenuOpen = false;
  }

  get isMobile() {
    return window.screen.width <= 640;
  }
}
