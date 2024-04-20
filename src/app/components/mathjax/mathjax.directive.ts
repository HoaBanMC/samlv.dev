import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef,
  Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MathService } from './math.service'
import { LoadingComponent } from './loading/loading.component';
// tslint:disable-next-line:directive-selector
// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[mathJax]' })
export class MathJaxDirective implements OnChanges, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('mathJax') value = '';
  @Input() noWait: boolean;
  @Output() loadComplete = new EventEmitter();
  private alive$ = new Subject<boolean>();
  private readonly el: HTMLElement;
  cmpRef: ComponentRef<any>;
  constructor(
    private mathService: MathService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public vcRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['value'] && changes['value'].currentValue) {
      this.render();
    }
  }
  updateComponent() {

    if (this.cmpRef) {
      this.cmpRef.destroy();
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
    this.cmpRef = this.vcRef.createComponent(factory)
    this.renderer.appendChild(
      this.vcRef.element.nativeElement,
      this.cmpRef.injector.get(LoadingComponent).elementRef.nativeElement
    );
    this.cdRef.detectChanges();
  }

  private render() {
    this.renderer.addClass(this.elementRef.nativeElement, 'fadein');
    this.updateComponent();
    this.mathService
      .ready()
      .pipe(
        take(1),
        takeUntil(this.alive$)
      )
      .subscribe(() => {
        this.mathService.render(this.el, this.value, this.noWait).then(() => {
            this.loadComplete.emit(true);
        })
      });
  }

  ngOnDestroy() {
    this.alive$.next(false);
    this.mathService.i = 0;
  }
}
