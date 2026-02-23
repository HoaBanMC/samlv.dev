import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

interface Feature {
  id: string;
  icon: string;
  title: string;
  desc: string;
  route: string;
  tags: string[];
  status: 'active' | 'coming-soon' | 'beta';
  gradient: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-bg-deep text-white font-sans transition-colors duration-500 pb-24">
      <div class="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <!-- Header Section -->
        <header class="mb-20 animate-reveal">
          <div class="flex items-center gap-4 mb-6">
            <span class="w-12 h-px bg-primary"></span>
            <span class="text-xs font-black uppercase tracking-[0.4em] text-primary">
              {{ ls.t().dashboard.subtitle }}
            </span>
          </div>
          <h1 class="text-6xl lg:text-8xl font-display font-bold tracking-tighter mb-4 uppercase">
            {{ ls.t().dashboard.title }}
          </h1>
          <p class="text-dim text-xl font-light max-w-2xl leading-relaxed">
            {{ ls.t().dashboard.desc }}
          </p>
        </header>

        <!-- Premium Bento Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-6 gap-6 min-h-[1000px] animate-reveal [animation-delay:0.2s]"
        >
          <!-- Hero Profile Card (2x3) -->
          <div
            class="md:col-span-2 md:row-span-3 p-12 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden backdrop-blur-3xl"
          >
            <!-- Background Glow -->
            <div
              class="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700"
            ></div>

            <div class="relative z-10">
              <span
                class="inline-block px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-8"
              >
                Executive Profile
              </span>
              <h2
                class="text-6xl font-display font-extrabold tracking-tighter leading-none uppercase mb-6"
              >
                {{ ls.t().dashboard.profile_card.title }}
              </h2>
              <p class="text-dim text-lg leading-relaxed max-w-sm mb-8">
                Mastering the art of performance-first web applications and interactive systems.
              </p>
              <div class="flex gap-3">
                <span
                  class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                  >Angular 21</span
                >
                <span
                  class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                  >WASM Core</span
                >
              </div>
            </div>

            <button
              routerLink="/profile"
              class="relative z-10 w-fit px-10 py-4 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-4"
            >
              <span>{{ ls.t().dashboard.profile_card.cta }}</span>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Godot Engine Visualization (1x3) -->
          <div
            class="md:col-span-1 md:row-span-3 p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center group backdrop-blur-xl"
          >
            <div
              class="w-32 h-32 bg-brand-godot/10 rounded-[2rem] flex items-center justify-center text-6xl text-brand-godot mb-10 group-hover:rotate-12 transition-all duration-500 shadow-2xl shadow-brand-godot/5"
            >
              <i class="fa-solid fa-gamepad"></i>
            </div>
            <h3 class="text-2xl font-bold uppercase tracking-tighter mb-4">
              {{ features()[1].title }}
            </h3>
            <p
              class="text-xs text-dim leading-relaxed max-w-[180px] uppercase font-bold tracking-widest opacity-60"
            >
              Real-time 3D <br />
              Visualization Engine
            </p>
          </div>

          <!-- Status Card (1x2) -->
          <div
            class="md:col-span-1 md:row-span-2 p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] flex flex-col justify-between backdrop-blur-xl"
          >
            <span class="text-[10px] font-black uppercase tracking-widest text-dim">{{
              ls.t().dashboard.status_card.label
            }}</span>
            <div class="space-y-2">
              <div class="text-4xl font-display font-bold tracking-tighter text-primary">
                PROJECTS_OK
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span class="text-[10px] font-black uppercase tracking-widest opacity-50"
                  >Systems Operational</span
                >
              </div>
            </div>
          </div>

          <!-- Feature List (2x3) -->
          <div
            class="md:col-span-2 md:row-span-3 p-10 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl"
          >
            <div class="flex justify-between items-center mb-10">
              <h3 class="text-2xl font-display font-bold uppercase tracking-widest">
                {{ ls.t().dashboard.modules.label }}
              </h3>
              <span class="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]"
                >Core Modules_</span
              >
            </div>
            <div class="grid gap-4">
              @for (feature of features(); track feature.id) {
                <div
                  class="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/40 hover:bg-white/10 transition-all cursor-pointer group/item"
                >
                  <div class="flex items-center gap-6">
                    <div
                      [class]="
                        'w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl ' +
                        (feature.id === 'profile'
                          ? 'text-brand-angular'
                          : feature.id === 'wasm-engine'
                            ? 'text-brand-rust'
                            : 'text-primary')
                      "
                    >
                      <i [class]="feature.icon"></i>
                    </div>
                    <div>
                      <div class="text-xs font-black uppercase tracking-widest mb-1">
                        {{ feature.title }}
                      </div>
                      <div class="text-[9px] text-dim font-bold uppercase tracking-tighter">
                        {{ feature.status }} // {{ feature.tags[0] }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center opacity-0 group-hover/item:opacity-100 group-hover/item:bg-primary group-hover/item:text-white transition-all"
                  >
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- CTA Contact (1x3) -->
          <div
            routerLink="/profile"
            class="md:col-span-1 md:row-span-3 p-12 bg-primary text-white rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-8 cursor-pointer group relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div
              class="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-4xl group-hover:scale-110 transition-all duration-500 relative z-10"
            >
              <i class="fa-solid fa-paper-plane"></i>
            </div>
            <div class="relative z-10">
              <h3 class="text-xl font-black uppercase tracking-widest mb-2">
                {{ ls.t().dashboard.contact }}
              </h3>
              <p class="text-xs opacity-70 font-bold uppercase tracking-tighter">
                Let's build something <br />
                extraordinary.
              </p>
            </div>
          </div>

          <!-- Tech Stack Mini (1x1) -->
          <div
            class="md:col-span-1 md:row-span-1 p-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] flex items-center justify-around text-2xl text-dim backdrop-blur-xl"
          >
            <i class="fa-brands fa-angular hover:text-brand-angular transition-colors"></i>
            <i class="fa-brands fa-rust hover:text-brand-rust transition-colors"></i>
            <i class="fa-solid fa-gamepad hover:text-brand-godot transition-colors"></i>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Dashboard {
  ls = inject(LanguageService);

  features = signal<Feature[]>([
    {
      id: 'profile',
      icon: 'fa-brands fa-angular',
      title: 'Profile Module',
      desc: 'Advanced profile management with Angular Signals and localized data structures.',
      route: '/profile',
      tags: ['Angular 21', 'Signals'],
      status: 'active',
      gradient: 'from-brand-angular/20',
    },
    {
      id: 'character-3d',
      icon: 'fa-solid fa-gamepad',
      title: 'Godot Engine',
      desc: 'Real-time 3D character visualization powered by Godot 4.x hardware acceleration.',
      route: '/dashboard',
      tags: ['Godot 4', 'WASM'],
      status: 'beta',
      gradient: 'from-brand-godot/20',
    },
    {
      id: 'wasm-engine',
      icon: 'fa-brands fa-rust',
      title: 'Rust Core',
      desc: 'High-performance WebAssembly computation engine for heavy-duty system tasks.',
      route: '/dashboard',
      tags: ['Rust', 'Cargo'],
      status: 'active',
      gradient: 'from-brand-rust/20',
    },
    {
      id: 'localization',
      icon: 'fa-solid fa-language',
      title: 'Multilingual',
      desc: 'Smart localization system supporting Vietnamese and English with seamless switching.',
      route: '/dashboard',
      tags: ['i18n', 'L10n'],
      status: 'active',
      gradient: 'from-primary/20',
    },
  ]);
}
