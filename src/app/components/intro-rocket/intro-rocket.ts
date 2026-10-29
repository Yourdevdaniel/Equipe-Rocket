import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-intro-rocket',
  standalone: true,
  templateUrl: './intro-rocket.html',
  styleUrl: './intro-rocket.css',
})
export class IntroRocket implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);

  @ViewChild('overlay') overlayRef?: ElementRef<HTMLElement>;
  @ViewChild('logoStage') logoStageRef?: ElementRef<HTMLElement>;
  @ViewChild('logoBtn') logoBtnRef?: ElementRef<HTMLElement>;
  @ViewChild('anel1') anel1Ref?: ElementRef<HTMLElement>;
  @ViewChild('anel2') anel2Ref?: ElementRef<HTMLElement>;
  @ViewChild('textoClique') textoCliqueRef?: ElementRef<HTMLElement>;
  @ViewChild('flashVermelho') flashRef?: ElementRef<HTMLElement>;
  @ViewChild('giovanniStage') giovanniStageRef?: ElementRef<HTMLElement>;
  @ViewChild('giovanniSvg') giovanniSvgRef?: ElementRef<SVGSVGElement>;
  @ViewChild('dialogoBox') dialogoBoxRef?: ElementRef<HTMLElement>;

  readonly visivel = signal(true);
  readonly clicado = signal(false);

  private pulsoTweens: gsap.core.Tween[] = [];
  private masterTimeline?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    this.iniciarPulsoLogo();
  }

  private iniciarPulsoLogo(): void {
    const logo = this.logoBtnRef?.nativeElement;
    const anel1 = this.anel1Ref?.nativeElement;
    const anel2 = this.anel2Ref?.nativeElement;
    const texto = this.textoCliqueRef?.nativeElement;

    if (!logo || !anel1 || !anel2 || !texto) return;

    gsap.set(logo, { scale: 1 });

    this.pulsoTweens.push(
      gsap.to(logo, {
        scale: 1.08,
        boxShadow: '0 0 55px rgba(225, 29, 72, 0.85), 0 0 110px rgba(225, 29, 72, 0.45)',
        duration: 1.05,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }),
      gsap.fromTo(
        anel1,
        { scale: 0.95, opacity: 0.75 },
        { scale: 1.65, opacity: 0, duration: 1.9, repeat: -1, ease: 'power2.out' }
      ),
      gsap.fromTo(
        anel2,
        { scale: 0.95, opacity: 0.5 },
        { scale: 1.95, opacity: 0, duration: 1.9, delay: 0.65, repeat: -1, ease: 'power2.out' }
      ),
      gsap.to(texto, {
        opacity: 0.35,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    );
  }

  iniciarSequencia(): void {
    if (this.clicado()) return;
    this.clicado.set(true);

    this.pulsoTweens.forEach((t) => t.kill());
    this.pulsoTweens = [];

    const overlay = this.overlayRef?.nativeElement;
    const logoStage = this.logoStageRef?.nativeElement;
    const logo = this.logoBtnRef?.nativeElement;
    const flash = this.flashRef?.nativeElement;
    const giovanniStage = this.giovanniStageRef?.nativeElement;
    const svg = this.giovanniSvgRef?.nativeElement;
    const dialogo = this.dialogoBoxRef?.nativeElement;

    if (!overlay || !logoStage || !logo || !flash || !giovanniStage || !svg || !dialogo) {
      this.finalizarIntro();
      return;
    }

    const hatGroup = svg.querySelector('.giovanni-hat');
    const strapGroup = svg.querySelector('.giovanni-strap');
    const eyeGlint = svg.querySelector('.giovanni-eye-glint');
    const auraBg = giovanniStage.querySelector('.giovanni-aura');

    gsap.set(giovanniStage, { autoAlpha: 0 });
    gsap.set(svg, { y: 28, scale: 0.92, opacity: 0, filter: 'brightness(0.12) contrast(1.3)' });
    gsap.set(dialogo, { y: 20, autoAlpha: 0 });
    if (hatGroup) {
      gsap.set(hatGroup, { y: 2.3, rotation: -4, svgOrigin: '10 22' });
    }
    if (strapGroup) {
      gsap.set(strapGroup, { rotation: 0, svgOrigin: '34 43' });
    }
    if (eyeGlint) {
      gsap.set(eyeGlint, { scale: 0, opacity: 0, svgOrigin: '26.5 11.5' });
    }

    this.masterTimeline = gsap.timeline({
      onComplete: () => this.finalizarIntro(),
    });

    // 1. Pulso de impacto na logo + clarão escarlate
    this.masterTimeline
      .to(logo, {
        scale: 1.28,
        boxShadow: '0 0 90px rgba(225, 29, 72, 1)',
        duration: 0.22,
        ease: 'power2.out',
      })
      .to(
        flash,
        {
          opacity: 0.85,
          duration: 0.15,
          ease: 'power2.in',
        },
        '-=0.08'
      )
      .to(logoStage, {
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.25,
        ease: 'power3.in',
      })
      .to(flash, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
      })
      // 2. Entrada da silhueta do Giovanni (permanece 5 segundos na tela)
      .set(giovanniStage, { autoAlpha: 1 }, '-=0.35')
      .addLabel('giovanniVisivel')
      .to(
        svg,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
        },
        'giovanniVisivel'
      )
      // 3. Revelação das cores + movimento de levantar a aba do chapéu (hat tip) e vento no sobretudo
      .to(
        svg,
        {
          filter: 'brightness(1) contrast(1)',
          duration: 0.65,
          ease: 'power2.inOut',
        },
        'giovanniVisivel+=0.55'
      );

    if (hatGroup) {
      this.masterTimeline.to(
        hatGroup,
        {
          y: 0,
          rotation: 0,
          duration: 0.85,
          ease: 'back.out(1.6)',
        },
        'giovanniVisivel+=0.75'
      );
    }

    if (strapGroup) {
      this.masterTimeline.to(
        strapGroup,
        {
          rotation: -9,
          duration: 0.38,
          repeat: 11,
          yoyo: true,
          ease: 'sine.inOut',
        },
        'giovanniVisivel+=0.4'
      );
    }

    if (auraBg) {
      this.masterTimeline.fromTo(
        auraBg,
        { scale: 0.8, opacity: 0.3 },
        { scale: 1.18, opacity: 0.85, duration: 0.9, repeat: 4, yoyo: true, ease: 'sine.inOut' },
        'giovanniVisivel+=0.2'
      );
    }

    // 4. Brilho no olho do Giovanni + frase temática
    if (eyeGlint) {
      this.masterTimeline
        .to(
          eyeGlint,
          {
            scale: 2.1,
            opacity: 1,
            rotation: 90,
            duration: 0.28,
            ease: 'back.out(2)',
          },
          'giovanniVisivel+=1.2'
        )
        .to(
          eyeGlint,
          {
            scale: 1.15,
            opacity: 0.85,
            duration: 0.6,
            repeat: 5,
            yoyo: true,
            ease: 'sine.inOut',
          },
          'giovanniVisivel+=1.48'
        );
    }

    this.masterTimeline
      .to(
        dialogo,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          ease: 'power2.out',
        },
        'giovanniVisivel+=1.1'
      )
      // 5. Permanece 5 segundos completos em cena antes de encerrar suavemente para a tela inicial
      .to(
        overlay,
        {
          autoAlpha: 0,
          scale: 1.03,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        'giovanniVisivel+=5'
      );
  }

  private finalizarIntro(): void {
    this.visivel.set(false);
    this.router.navigate(['/projetos']);
  }

  ngOnDestroy(): void {
    this.pulsoTweens.forEach((t) => t.kill());
    this.masterTimeline?.kill();
  }
}
