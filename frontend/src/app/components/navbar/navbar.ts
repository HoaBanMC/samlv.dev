import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 border-b border-border-subtle backdrop-blur-xl bg-bg-deep/80"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bespoke-bracket flex items-center justify-center">
              <span class="text-primary font-display font-black text-xl">P</span>
            </div>
            <span class="font-display font-black text-xs uppercase tracking-[0.3em]">
              Profile<span class="text-primary">.dev</span>
            </span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <div class="flex items-center gap-2">
              @for (link of navLinks(); track link.path) {
                <a
                  [routerLink]="link.path"
                  routerLinkActive="!text-primary bg-primary/5"
                  [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                  class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-dim hover:text-primary transition-all"
                >
                  {{ link.label() }}
                </a>
              }
            </div>

            <!-- Theme Toggle -->
            <button
              (click)="ts.toggleTheme()"
              class="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all text-xs"
              [title]="ts.theme() === 'light' ? 'Dark Mode' : 'Light Mode'"
            >
              @if (ts.theme() === 'light') {
                <span>🌙</span>
              } @else {
                <span>☀️</span>
              }
            </button>

            <div class="w-px h-6 bg-white/10"></div>

            <!-- Language Switcher -->
            <button
              (click)="langService.toggleLang()"
              class="group flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 hover:border-primary/30 transition-all"
            >
              <span
                class="text-[10px] font-black uppercase tracking-widest"
                [class.text-primary]="langService.lang() === 'en'"
                >EN</span
              >
              <span class="w-2 h-[1px] bg-white/20"></span>
              <span
                class="text-[10px] font-black uppercase tracking-widest"
                [class.text-primary]="langService.lang() === 'vi'"
                >VI</span
              >
            </button>
          </div>

          <!-- Mobile menu button -->
          <button
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            class="md:hidden p-2 text-dim hover:text-primary"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                [attr.d]="mobileMenuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileMenuOpen()) {
        <div
          class="md:hidden border-t border-white/5 bg-bg-deep/95 backdrop-blur-xl animate-reveal"
        >
          <div class="px-6 py-6 space-y-4">
            @for (link of navLinks(); track link.path) {
              <a
                [routerLink]="link.path"
                (click)="mobileMenuOpen.set(false)"
                class="block text-[10px] font-black uppercase tracking-widest text-dim hover:text-primary px-4 py-2"
              >
                {{ link.label() }}
              </a>
            }
            <button
              (click)="langService.toggleLang()"
              class="w-full text-left text-[10px] font-black uppercase tracking-widest text-primary px-4 py-2 border-t border-white/5 pt-4"
            >
              Switch Language ({{ langService.lang() === 'en' ? 'VI' : 'EN' }})
            </button>
          </div>
        </div>
      }
    </nav>
    <div class="h-20"></div>
  `,
})
export class Navbar {
  langService = inject(LanguageService);
  ts = inject(ThemeService);
  mobileMenuOpen = signal(false);

  navLinks = signal([
    { path: '/', label: computed(() => this.langService.t().nav.landing) },
    { path: '/dashboard', label: computed(() => this.langService.t().nav.dashboard) },
    { path: '/profile', label: computed(() => this.langService.t().nav.profile) },
  ]);
}
