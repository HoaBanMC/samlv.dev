import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  template: `
    <div
      class="relative min-h-screen flex flex-col justify-center px-6 lg:px-24 overflow-hidden bespoke-scan"
    >
      <!-- High-end Breathable Blurs -->
      <div
        class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-vibrant-purple opacity-[0.05] blur-[150px] rounded-full pointer-events-none"
      ></div>
      <div
        class="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-vibrant-cyan opacity-[0.03] blur-[120px] rounded-full pointer-events-none"
      ></div>

      <main class="relative z-10 max-w-5xl animate-reveal bespoke-bracket p-12 lg:p-20">
        <header class="mb-12">
          <div class="inline-flex items-center gap-3 mb-8">
            <span class="w-12 h-[1px] bg-primary"></span>
            <span class="text-xs font-black uppercase tracking-[0.3em] text-primary">{{
              ls.t().landing.version
            }}</span>
          </div>
          <h1
            class="text-7xl lg:text-9xl font-display font-bold leading-[0.9] tracking-tighter mb-8"
          >
            {{ ls.t().landing.headline.split(' ')[0] }} <br />
            <span class="bespoke-gradient-text-vibrant italic">{{
              ls.t().landing.headline.split(' ').slice(1).join(' ')
            }}</span>
          </h1>
          <p class="text-xl lg:text-2xl text-dim max-w-2xl leading-relaxed font-sans font-light">
            {{ ls.t().landing.subheadline }}
          </p>
        </header>

        <footer class="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          <button
            routerLink="/dashboard"
            class="group relative px-10 py-5 bg-text-main text-bg-deep font-black uppercase text-xs tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span class="relative z-10">{{ ls.t().landing.cta }}</span>
            <div
              class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
          </button>

          <div class="flex gap-12">
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-widest text-dim mb-1">{{
                ls.t().landing.focus
              }}</span>
              <span class="text-sm font-bold uppercase tracking-tighter"
                >Angular / Rust / Godot</span
              >
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] uppercase tracking-widest text-dim mb-1">{{
                ls.t().landing.available
              }}</span>
              <span class="text-sm font-bold uppercase tracking-tighter">{{
                ls.t().landing.avail_status
              }}</span>
            </div>
          </div>
        </footer>
      </main>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-12 right-12 flex flex-col items-center gap-4 opacity-30">
        <span
          class="text-[10px] uppercase tracking-[0.5em] origin-right rotate-90 translate-x-12 translate-y-12 whitespace-nowrap"
          >{{ ls.t().landing.scroll }}</span
        >
        <div class="w-[1px] h-24 bg-white/20 relative overflow-hidden">
          <div
            class="absolute top-0 left-0 w-full h-1/2 bg-primary animate-[scroll_2s_infinite]"
          ></div>
        </div>
      </div>
    </div>

    <!-- Expertise Section (Bespoke Grid) -->
    <section
      class="py-32 px-6 lg:px-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden"
    >
      <div class="max-w-7xl mx-auto relative z-10">
        <h2 class="text-5xl font-display font-bold mb-24 tracking-tighter">
          {{ ls.t().landing.expertise }}
        </h2>

        <div class="grid lg:grid-cols-3 gap-8">
          @for (card of highlights(); track card.title; let i = $index) {
            <div
              class="group p-10 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40 transition-all duration-300"
            >
              <div
                class="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500"
                [class]="card.color"
              >
                <i [class]="card.icon"></i>
              </div>
              <h3 class="text-3xl font-display font-bold mb-6 tracking-tight uppercase">
                {{ card.title }}
              </h3>
              <p class="text-dim leading-relaxed mb-8">{{ card.desc }}</p>
              <div class="flex flex-wrap gap-2">
                @for (tech of card.techs; track tech) {
                  <span
                    class="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-primary/70 border border-white/5"
                    >{{ tech }}</span
                  >
                }
              </div>
            </div>
          }
        </div>
      </div>
      <!-- Decorative lines -->
      <div class="absolute top-0 left-1/4 w-px h-full bg-white/5"></div>
      <div class="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>
    </section>

    <style>
      .vertical-text {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
      }
      @keyframes scroll {
        0% {
          transform: translateY(-100%);
        }
        100% {
          transform: translateY(200%);
        }
      }
    </style>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Landing {
  ls = inject(LanguageService);

  highlights = signal([
    {
      title: 'Angular Architect',
      desc: 'Building scalable, enterprise-grade frontend applications with clean architecture and reactive state management.',
      icon: 'fa-brands fa-angular',
      color: 'text-brand-angular',
      border: 'border-l-primary/30',
      techs: ['RxJS', 'Signals', 'NGRX'],
    },
    {
      title: 'Rust & WASM',
      desc: 'Developing high-performance systems and WebAssembly modules for blazingly fast computations in the browser.',
      icon: 'fa-brands fa-rust',
      color: 'text-brand-rust',
      border: 'border-l-primary/10',
      techs: ['Cargo', 'Wasm-Pack', 'Serde'],
    },
    {
      title: 'Game Engine Visualization',
      desc: 'Integrating Godot 4.x into web platforms for immersive 3D experiences and data-driven simulations.',
      icon: 'fa-solid fa-gamepad',
      color: 'text-brand-godot',
      border: 'border-l-primary/20',
      techs: ['GDScript', 'Shaders', 'WebGL'],
    },
  ]);
}
