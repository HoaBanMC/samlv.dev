import { Component, signal, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
  colorClass: string;
}

@Component({
  selector: 'app-profile',
  template: `
    <div class="min-h-screen bg-bg-deep text-white font-sans transition-colors duration-500 pb-24">
      <!-- Main Content Container -->
      <div class="max-w-5xl mx-auto px-6 py-12 md:py-24 space-y-32">
        <!-- Hero Section -->
        <section
          class="flex flex-col md:flex-row gap-12 items-center md:items-start animate-reveal"
        >
          <!-- Avatar Icon -->
          <div class="relative shrink-0">
            <div
              class="w-48 h-48 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-8xl text-primary shadow-2xl"
            >
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div
              class="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl shadow-lg border-4 border-bg-deep"
            >
              <i class="fa-solid fa-check"></i>
            </div>
          </div>

          <!-- Hero Info -->
          <div class="flex-1 text-center md:text-left space-y-6">
            <span
              class="inline-block px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              {{ ls.t().profile.role }}
            </span>
            <h1
              class="text-6xl lg:text-8xl font-display font-extrabold tracking-tighter leading-none uppercase"
            >
              {{ name() }}
            </h1>
            <p class="text-xl text-dim leading-relaxed max-w-2xl">
              {{ ls.t().profile.bio }}
            </p>

            <!-- Hero Actions -->
            <div class="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <button
                class="px-8 py-4 bg-primary text-white font-bold rounded-full hover:shadow-primary/20 hover:shadow-2xl active:scale-95 transition-all flex items-center gap-3"
              >
                <i class="fa-solid fa-envelope"></i>
                <span>Hire Me</span>
              </button>
              <button
                class="px-8 py-4 bg-white/5 text-white font-bold border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-3"
              >
                <i class="fa-solid fa-file-pdf"></i>
                <span>Download CV</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Skill Grid Section -->
        <section class="animate-reveal [animation-delay:0.2s]">
          <div class="flex items-center gap-6 mb-12">
            <div class="h-px bg-white/10 flex-1"></div>
            <h2 class="text-2xl font-display font-bold uppercase tracking-widest">
              {{ ls.t().profile.skills_title }}
            </h2>
            <div class="h-px bg-white/10 flex-1"></div>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (skill of skills(); track skill.name) {
              <div
                class="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40 transition-all duration-300"
              >
                <div class="flex items-center gap-4 mb-6">
                  <div
                    [class]="
                      'w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl ' +
                      skill.colorClass
                    "
                  >
                    <i [class]="skill.icon"></i>
                  </div>
                  <h3 class="text-xl font-bold tracking-tight uppercase">{{ skill.name }}</h3>
                </div>

                <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div
                    [class]="
                      'h-full transition-all duration-1000 ' +
                      skill.colorClass.replace('text-', 'bg-')
                    "
                    [style.width.%]="skill.level"
                  ></div>
                </div>

                <div
                  class="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-dim"
                >
                  <span>Proficiency</span>
                  <span [class]="'font-mono ' + skill.colorClass">{{ skill.level }}%</span>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Experience Timeline -->
        <section class="animate-reveal [animation-delay:0.4s]"></section>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Profile {
  ls = inject(LanguageService);

  name = signal('Khoa');

  socials = signal([
    { icon: 'fa-brands fa-github', label: 'GitHub', url: 'https://github.com/khoa-dev' },
    { icon: 'fa-brands fa-linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: 'fa-brands fa-x-twitter', label: 'Twitter', url: 'https://twitter.com' },
  ]);

  skills = signal<Skill[]>([
    {
      name: 'Angular',
      level: 90,
      icon: 'fa-brands fa-angular',
      color: 'var(--color-brand-angular)',
      colorClass: 'text-brand-angular',
    },
    {
      name: 'TypeScript',
      level: 88,
      icon: 'fa-brands fa-js',
      color: 'var(--color-brand-typescript)',
      colorClass: 'text-brand-typescript',
    },
    {
      name: 'Godot Engine',
      level: 75,
      icon: 'fa-solid fa-gamepad',
      color: 'var(--color-brand-godot)',
      colorClass: 'text-brand-godot',
    },
    {
      name: 'Rust',
      level: 70,
      icon: 'fa-brands fa-rust',
      color: 'var(--color-brand-rust)',
      colorClass: 'text-brand-rust',
    },
    {
      name: 'WebAssembly',
      level: 65,
      icon: 'fa-solid fa-bolt',
      color: 'var(--color-secondary)',
      colorClass: 'text-secondary',
    },
    {
      name: 'TailwindCSS',
      level: 85,
      icon: 'fa-solid fa-palette',
      color: 'var(--color-brand-tailwind)',
      colorClass: 'text-brand-tailwind',
    },
    {
      name: 'GLSL',
      level: 60,
      icon: 'fa-solid fa-wand-magic-sparkles',
      color: 'var(--color-secondary)',
      colorClass: 'text-secondary',
    },
  ]);
}
