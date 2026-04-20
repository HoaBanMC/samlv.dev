import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
          label: 'Projects_',
          total: 'TOTAL',
        },
        contact: 'Get in Touch',
      },
      profile: {
        subtitle: 'Identity_',
        headline: 'I AM',
        bio: 'Passionate about building modern web applications with Angular and interactive 3D modules with Godot Engine. Focused on clean architecture and high-performance frontend systems.',
        role: 'Angular & Godot Developer',
        experience: {
          title: 'The Journey_',
          items: [
            {
              year: '2024 — Present',
              title: 'Senior Frontend Developer',
              company: 'Freelance / Projects',
              desc: 'Specializing in Angular 21 development, focusing on Zoneless architecture and Signal-based state management.',
            },
            {
              year: '2022 — 2024',
              title: 'Web & Game Developer',
              company: 'Creative Studio',
              desc: 'Architected responsive interfaces and integrated Godot 3D components into web platforms.',
            },
            {
              year: '2020 — 2022',
              title: 'Junior Developer',
              company: 'Independent',
              desc: 'Mastered modern CSS, TypeScript, and began exploring game engine integration for the web.',
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
        desc: 'Các dự án cá nhân và module kỹ thuật thực nghiệm.',
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
          label: 'Dự án_',
          total: 'TỔNG CỘNG',
        },
        contact: 'Liên hệ ngay',
      },
      profile: {
        subtitle: 'Danh tính_',
        headline: 'TÔI LÀ',
        bio: 'Đam mê xây dựng các ứng dụng web hiện đại với Angular và phát triển game/ứng dụng 3D tương tác với Godot Engine. Tập trung vào kiến trúc sạch và hiệu suất cao.',
        role: 'Lập trình viên Angular & Godot',
        experience: {
          title: 'Hành trình_',
          items: [
            {
              year: '2024 — Hiện tại',
              title: 'Lập trình viên Frontend Senior',
              company: 'Freelance / Dự án',
              desc: 'Chuyên sâu phát triển ứng dụng Angular 21, tập trung vào kiến trúc Zoneless và quản lý state bằng Signals.',
            },
            {
              year: '2022 — 2024',
              title: 'Lập trình viên Web & Game',
              company: 'Creative Studio',
              desc: 'Xây dựng giao diện responsive và tích hợp các thành phần Godot 3D lên nền tảng web.',
            },
            {
              year: '2020 — 2022',
              title: 'Lập trình viên trẻ',
              company: 'Độc lập',
              desc: 'Làm chủ CSS hiện đại, TypeScript và bắt đầu khám phá việc tích hợp game engine vào web.',
            },
          ],
        },
        skills_title: 'Kho vũ khí_',
      },
    },
  };

  private platformId = inject(PLATFORM_ID);

  t = computed(() => this.translations[this.lang()]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang_preference') as Lang;
      if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
        this.lang.set(savedLang);
      }

      effect(() => {
        localStorage.setItem('lang_preference', this.lang());
      });
    }
  }

  toggleLang() {
    this.lang.set(this.lang() === 'en' ? 'vi' : 'en');
  }
}
