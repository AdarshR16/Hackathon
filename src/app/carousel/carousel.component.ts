// ============================================================================

// ============================================================================
import { Component, OnInit, ViewChild, ElementRef, ContentChild, TemplateRef, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
    @ContentChild(TemplateRef)
    tmpl!: TemplateRef<any>;
    
    @ViewChild('content')
    content!: ElementRef;

    @ViewChild('progressScroll')
    progressScroll!: ElementRef;

    @Input()
    data!: any[];

    @Input()
    buttonScrollWidth: number = 150;

    @Input()
    scrollStyle: 'progress-bar' | 'progress-scroll' | undefined;  

    progressBarWidth: number = 0;
    progressScrollLeft: number = 0;

    buttonClicked = false;

    progressTransition!: string | null;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.addTouchScroll();

        window.addEventListener('resize', () => {
            this.adjustScrollPosition(0);
        });
    }

    scrollLeft() {
        this.buttonClicked = true;
        this.enableScrollBehavior();
        this.adjustScrollPosition(-this.buttonScrollWidth);
    }

    scrollRight() {
        this.buttonClicked = true;
        this.enableScrollBehavior();
        this.adjustScrollPosition(this.buttonScrollWidth);
    } 
    
    adjustScrollPosition(adjustment: number) {
        this.content.nativeElement.scrollLeft += adjustment;

        let scrollPercentCompleted = (this.content.nativeElement.scrollLeft + adjustment) / (this.content.nativeElement.scrollWidth - this.content.nativeElement.clientWidth);
        this.progressBarWidth = Math.max(0, Math.min(scrollPercentCompleted, 1)) * 100;

        if (this.progressScroll && this.progressScroll.nativeElement) {
            let progressScrollLeftEndPos = this.content.nativeElement.clientWidth - this.progressScroll.nativeElement.clientWidth;
            let newProgressScrollLeft = scrollPercentCompleted * progressScrollLeftEndPos;        
            this.progressScrollLeft = Math.max(0, Math.min(newProgressScrollLeft, progressScrollLeftEndPos));
        }
    }

    // Horizontal touch scroll
    addTouchScroll() {
        let element = this.content.nativeElement;
        element.addEventListener('touchstart', (event: any) => {
            this.buttonClicked = false;
            this.disableScrollBehavior();
        });

        element.addEventListener('scroll', (event: any) => {
            if (this.buttonClicked) {
                return;
            } 
            this.adjustScrollPosition(0); 
        });        
    } 

    disableScrollBehavior() { 
        this.content.nativeElement.style['scroll-behavior'] = 'unset';
        this.progressTransition = 'unset';     
    }

    enableScrollBehavior() {
        this.content.nativeElement.style['scroll-behavior'] = null;
        this.progressTransition = null;       
    }
}