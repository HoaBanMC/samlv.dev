import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'vi';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  lang = signal<Lang>('en');

  translations = {
    en: {
      nav: {
        landing: 'Home',
        dashboard: 'Dashboard',
        profile: 'Profile',
      },
      landing: {
        version: 'Portfolio v2.0',
        headline: 'BEYOND DIGITAL.',
        subheadline:
          'I craft bespoke digital experiences where high-performance engineering meets minimalist design.',
        cta: 'Enter Experience',
        focus: 'Focus',
        available: 'Available',
        avail_status: 'Freelance / Full-time',
        scroll: 'Scroll to explore',
        expertise: 'Core Focus_',
      },
      dashboard: {
        title: 'DASHBOARD_',
        subtitle: 'System Overview',
        desc: 'Curated modules for experimental engineering and design explorations.',
        profile_card: {
          label: 'Active Profile',
          title: 'IDENTITY VIEWER.',
          cta: 'Explore Profile',
        },
        status_card: {
          label: 'Status',
          status: 'ALL SYSTEMS NOMINAL.',
        },
        tech_card: {
          label: 'Build Stack',
        },
        modules: {
          label: 'Modules_',
          total: 'TOTAL',
        },
        contact: 'Get in Touch',
      },
      profile: {
        subtitle: 'Identity_',
        headline: 'I AM',
        bio: 'Passionate about building modern web applications with Angular, interactive 3D modules with Godot, and high-performance computation with Rust WebAssembly.',
        role: 'Senior Developer',
        experience: {
          title: 'The Journey_',
          items: [
            {
              year: '2024 — Present',
              title: 'Senior Full-Stack Developer',
              company: 'Tech Corp',
              desc: 'Leading development of high-performance Angular 21 applications, integrating Godot 3D modules and Rust WASM systems.',
            },
            {
              year: '2022 — 2024',
              title: 'Frontend Engineer',
              company: 'Design Agency',
              desc: 'Architected responsive interfaces and scalable component libraries with TypeScript and TailwindCSS.',
            },
            {
              year: '2020 — 2022',
              title: 'Indie Developer',
              company: 'Startup',
              desc: 'Explored game mechanics in Godot and transitioned into full-stack web engineering.',
            },
          ],
        },
        skills_title: 'The Arsenal_',
      },
    },
    vi: {
      nav: {
        landing: 'Trang chủ',
        dashboard: 'Bảng điều khiển',
        profile: 'Cá nhân',
      },
      landing: {
        version: 'Danh mục v2.0',
        headline: 'VƯƠN XA KỸ THUẬT SỐ.',
        subheadline:
          'Tôi tạo ra các trải nghiệm kỹ thuật số tùy biến, nơi kỹ thuật hiệu suất cao kết hợp cùng thiết kế tối giản.',
        cta: 'Bắt đầu trải nghiệm',
        focus: 'Lĩnh vực',
        available: 'Trạng thái',
        avail_status: 'Tự do / Toàn thời gian',
        scroll: 'Kéo để khám phá',
        expertise: 'Trọng tâm_',
      },
      dashboard: {
        title: 'BẢNG ĐIỀU KHIỂN_',
        subtitle: 'Tổng quan hệ thống',
        desc: 'Các module được tuyển chọn cho kỹ thuật thực nghiệm và khám phá thiết kế.',
        profile_card: {
          label: 'Hồ sơ đang hoạt động',
          title: 'XEM DANH TÍNH.',
          cta: 'Xem hồ sơ',
        },
        status_card: {
          label: 'Trạng thái',
          status: 'HỆ THỐNG BÌNH THƯỜNG.',
        },
        tech_card: {
          label: 'Công nghệ',
        },
        modules: {
          label: 'Module_',
          total: 'TỔNG CỘNG',
        },
        contact: 'Liên hệ ngay',
      },
      profile: {
        subtitle: 'Danh tính_',
        headline: 'TÔI LÀ',
        bio: 'Đam mê xây dựng các ứng dụng web hiện đại kết hợp Angular, game development với Godot Engine, và high-performance computing với Rust WebAssembly.',
        role: 'Lập trình viên Senior',
        experience: {
          title: 'Hành trình_',
          items: [
            {
              year: '2024 — Hiện tại',
              title: 'Lập trình viên Full-Stack Senior',
              company: 'Tập đoàn Công nghệ',
              desc: 'Dẫn dắt phát triển ứng dụng Angular 21 hiệu suất cao, tích hợp module Godot 3D và hệ thống Rust WASM.',
            },
            {
              year: '2022 — 2024',
              title: 'Kỹ sư Frontend',
              company: 'Agency Thiết kế',
              desc: 'Xây dựng kiến trúc giao diện responsive và thư viện component mở rộng với TypeScript và TailwindCSS.',
            },
            {
              year: '2020 — 2022',
              title: 'Lập trình viên độc lập',
              company: 'Startup',
              desc: 'Khám phá cơ chế game trong Godot và chuyển hướng sang kỹ thuật web full-stack.',
            },
          ],
        },
        skills_title: 'Kho vũ khí_',
      },
    },
  };

  t = computed(() => this.translations[this.lang()]);

  toggleLang() {
    this.lang.set(this.lang() === 'en' ? 'vi' : 'en');
  }
}
