import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="border-t border-border bg-surface/80 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 rounded bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold"
            >
              P
            </div>
            <span class="text-text-secondary text-sm"
              >Profile<span class="text-primary-light">.dev</span></span
            >
          </div>
          <p class="text-text-muted text-sm">
            Built with <span class="text-primary-light">Angular 21</span> ·
            <span class="text-secondary">Godot</span> ·
            <span class="text-accent">Rust WASM</span>
          </p>
          <p class="text-text-muted text-xs">© 2026 — All rights reserved</p>
        </div>
      </div>
    </footer>
  `,
})
export class Footer {}
