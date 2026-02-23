# 🚀 KẾ HOẠCH DỰ ÁN: PROFILE CÁ NHÂN

> **Tech stack:** Angular 21 (Zoneless, Signals) + Godot 4 (export HTML5) + Rust WASM + TailwindCSS v4

---

## 1. Tổng quan kiến trúc

```
profile-demo/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── landing/          # Trang chủ / Landing page
│   │   │   ├── dashboard/        # Dashboard liệt kê chức năng
│   │   │   └── profile/          # Trang profile chi tiết + model 3D
│   │   ├── components/
│   │   │   ├── navbar/           # Thanh điều hướng
│   │   │   └── footer/           # Footer
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts         # provideRouter, provideHttpClient...
│   ├── styles.css                # TailwindCSS v4 (CSS-first @theme)
│   ├── index.html
│   └── main.ts                   # bootstrapApplication()
├── public/
│   └── godot/                    # Godot HTML5 export output
├── rust-wasm/                    # Rust WASM module
│   ├── src/lib.rs
│   ├── Cargo.toml
│   └── pkg/
├── agents/
│   └── KE_HOACH.md
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 2. Angular 21 — Công nghệ hiện đại

### Nguyên tắc cốt lõi

| Công nghệ                  | Chi tiết                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------- |
| **Zoneless**               | Mặc định trong Angular 21 — **không dùng zone.js**, change detection dựa trên Signals |
| **Signals**                | Dùng `signal()`, `computed()`, `effect()` cho toàn bộ state management                |
| **Standalone**             | 100% standalone components, không NgModule                                            |
| **Built-in Control Flow**  | `@if`, `@for`, `@switch` — không dùng `*ngIf`, `*ngFor`                               |
| **inject()**               | Dùng `inject()` function thay vì constructor injection                                |
| **Vitest**                 | Test runner mặc định thay Karma                                                       |
| **Signal inputs**          | `input()`, `input.required()` thay `@Input()`                                         |
| **Signal outputs**         | `output()` thay `@Output()` + EventEmitter                                            |
| **model()**                | Two-way binding mới thay `@Input()` + `@Output()`                                     |
| **viewChild/contentChild** | `viewChild()` signal query thay `@ViewChild()`                                        |
| **Router**                 | `withComponentInputBinding()` cho route params → signal inputs                        |

### Những thứ **KHÔNG** sử dụng

- ❌ `zone.js`
- ❌ `NgModule`, `declarations`, `imports` trong module
- ❌ `*ngIf`, `*ngFor`, `*ngSwitch` (dùng `@if`, `@for`, `@switch`)
- ❌ `@Input()`, `@Output()` decorator (dùng `input()`, `output()` function)
- ❌ `@ViewChild()`, `@ContentChild()` decorator
- ❌ Constructor injection (dùng `inject()`)
- ❌ `EventEmitter` (dùng `output()`)
- ❌ RxJS cho state management (dùng Signals, RxJS chỉ cho HTTP/async streams)
- ❌ Karma (dùng Vitest)

---

## 3. Các trang chính

### 3.1 🏠 Landing Page (`/`)

| Thành phần           | Mô tả                                      |
| -------------------- | ------------------------------------------ |
| **Hero Section**     | Tên, tagline, avatar animation, nút CTA    |
| **Giới thiệu nhanh** | 2-3 dòng về bản thân, tech stack yêu thích |
| **Highlights**       | Cards nổi bật: dự án, kỹ năng, kinh nghiệm |
| **Animation**        | Scroll-based animation, gradient động      |

### 3.2 📊 Dashboard (`/dashboard`)

| Thành phần           | Mô tả                                  |
| -------------------- | -------------------------------------- |
| **Feature Grid**     | Card grid các chức năng/module         |
| **Quick Stats**      | Thống kê nhanh (projects, skills, exp) |
| **Navigation Cards** | Link tới trang/chức năng tương ứng     |

### 3.3 👤 Profile (`/profile`)

| Thành phần              | Mô tả                                      |
| ----------------------- | ------------------------------------------ |
| **Info Panel**          | Tên, bio, contact, social links            |
| **Skills Section**      | Kỹ năng với progress bar / tag cloud       |
| **Experience Timeline** | Timeline kinh nghiệm                       |
| **Godot 3D Model**      | Nhân vật 3D render bằng Godot HTML5 export |

---

## 4. TailwindCSS v4

- CSS-first config — dùng `@theme` block trong `styles.css`
- Không cần `tailwind.config.js`
- Dùng `@tailwindcss/postcss` plugin
- Custom color palette, typography, spacing trong `@theme`

---

## 5. Phân chia giai đoạn

### 🔹 GĐ 1: Khởi tạo project

- [ ] `ng new profile-demo --standalone --skip-tests --style css --routing --ssr false`
- [ ] Angular 21 mặc định zoneless (không cần cấu hình thêm)
- [ ] Cài TailwindCSS v4: `@tailwindcss/postcss`
- [ ] Cấu hình `styles.css` với `@theme` (colors, fonts)
- [ ] Setup routing trong `app.routes.ts`
- [ ] Tạo `navbar` + `footer` components

### 🔹 GĐ 2: Landing Page

- [ ] `LandingComponent` — standalone, signals
- [ ] Hero section với CSS animation
- [ ] Phần giới thiệu + highlight cards
- [ ] Responsive (mobile-first)

### 🔹 GĐ 3: Dashboard

- [ ] `DashboardComponent` — standalone, signals
- [ ] Feature card grid (`@for` loop)
- [ ] Data từ signal array
- [ ] Hover effects, transitions

### 🔹 GĐ 4: Profile Page

- [ ] `ProfileComponent` — standalone, signals
- [ ] Info panel + skills + timeline
- [ ] Khu vực nhúng Godot (placeholder/iframe-ready)

### 🔹 GĐ 5: Godot Integration

- [ ] Tạo Godot project (riêng biệt)
- [ ] Export HTML5 → `/public/godot/`
- [ ] Nhúng vào Profile page qua iframe/canvas

### 🔹 GĐ 6: Rust WASM

- [ ] `wasm-pack new rust-wasm`
- [ ] Build module → import vào Angular
- [ ] Kết nối với UI

---

## 6. Code pattern mẫu (Angular 21)

```typescript
// Component mẫu — Angular 21 style
@Component({
  selector: "app-landing",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./landing.component.html",
})
export class LandingComponent {
  // Signals cho state
  name = signal("Tên của bạn");
  title = signal("Full-Stack Developer");

  // Computed signal
  greeting = computed(() => `Xin chào, tôi là ${this.name()}`);

  // inject() thay constructor injection
  private router = inject(Router);

  // Signal input (nhận từ parent)
  theme = input<"dark" | "light">("dark");

  // Signal output
  themeChange = output<string>();
}
```

```html
<!-- Template — Built-in control flow -->
@if (isLoaded()) {
<h1>{{ greeting() }}</h1>
@for (skill of skills(); track skill.id) {
<div class="skill-card">{{ skill.name }}</div>
} } @else {
<div>Loading...</div>
}
```

---

## 7. Verification Plan

### Automated

- `ng build` — build thành công không lỗi
- `ng serve` — chạy local tại `http://localhost:4200`

### Manual (Browser)

- `/` → Landing page hiển thị đầy đủ
- `/dashboard` → Danh sách chức năng
- `/profile` → Thông tin + khu vực model 3D
- Responsive trên mobile viewport
- Navigation giữa các trang

---

## 8. Ghi chú

> [!IMPORTANT]
>
> - Angular 21 mặc định **zoneless** — không cần cài `zone.js`
> - Toàn bộ dùng **Signals** — không dùng pattern cũ
> - Godot & Rust WASM (GĐ 5-6) cần tool riêng biệt

> [!NOTE]
> Yêu cầu điều chỉnh bất kỳ phần nào trước khi bắt đầu triển khai.
