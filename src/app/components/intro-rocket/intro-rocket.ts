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
  @ViewChild('flashPsiquico') flashPsiquicoRef?: ElementRef<HTMLElement>;
  @ViewChild('giovanniStage') giovanniStageRef?: ElementRef<HTMLElement>;
  @ViewChild('giovanniSvg') giovanniSvgRef?: ElementRef<SVGSVGElement>;
  @ViewChild('dialogoBox') dialogoBoxRef?: ElementRef<HTMLElement>;
  @ViewChild('masterballStage') masterballStageRef?: ElementRef<HTMLElement>;
  @ViewChild('masterballSvg') masterballSvgRef?: ElementRef<SVGSVGElement>;
  @ViewChild('feixeMewtwo') feixeMewtwoRef?: ElementRef<HTMLElement>;
  @ViewChild('mewtwoStage') mewtwoStageRef?: ElementRef<HTMLElement>;
  @ViewChild('mewtwoSvg') mewtwoSvgRef?: ElementRef<SVGSVGElement>;
  @ViewChild('mewtwoAura') mewtwoAuraRef?: ElementRef<HTMLElement>;
  @ViewChild('ondaPsiquica1') onda1Ref?: ElementRef<HTMLElement>;
  @ViewChild('ondaPsiquica2') onda2Ref?: ElementRef<HTMLElement>;

  readonly visivel = signal(this.deveExibirIntro());
  readonly clicado = signal(false);

  private pulsoTweens: gsap.core.Tween[] = [];
  private masterTimeline?: gsap.core.Timeline;

  private deveExibirIntro(): boolean {
    if (typeof window === 'undefined') return true;
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/' || path === '/projetos';
  }

  ngAfterViewInit(): void {
    if (this.visivel()) {
      this.iniciarPulsoLogo();
    }
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
    const flashPsiquico = this.flashPsiquicoRef?.nativeElement;
    const giovanniStage = this.giovanniStageRef?.nativeElement;
    const svg = this.giovanniSvgRef?.nativeElement;
    const dialogo = this.dialogoBoxRef?.nativeElement;
    const masterballStage = this.masterballStageRef?.nativeElement;
    const masterballSvg = this.masterballSvgRef?.nativeElement;
    const feixeMewtwo = this.feixeMewtwoRef?.nativeElement;
    const mewtwoStage = this.mewtwoStageRef?.nativeElement;
    const mewtwoSvg = this.mewtwoSvgRef?.nativeElement;
    const mewtwoAura = this.mewtwoAuraRef?.nativeElement;
    const onda1 = this.onda1Ref?.nativeElement;
    const onda2 = this.onda2Ref?.nativeElement;

    if (
      !overlay ||
      !logoStage ||
      !logo ||
      !flash ||
      !flashPsiquico ||
      !giovanniStage ||
      !svg ||
      !dialogo ||
      !masterballStage ||
      !masterballSvg ||
      !feixeMewtwo ||
      !mewtwoStage ||
      !mewtwoSvg
    ) {
      this.finalizarIntro();
      return;
    }

    const hatGroup = svg.querySelector('.giovanni-hat');
    const strapGroup = svg.querySelector('.giovanni-strap');
    const eyeGlint = svg.querySelector('.giovanni-eye-glint');
    const auraBg = giovanniStage.querySelector('.giovanni-aura');

    const mbTopo = masterballSvg.querySelector('.masterball-topo');
    const mewtwoTail = mewtwoSvg.querySelector('.mewtwo-tail');
    const mewtwoRightArm = mewtwoSvg.querySelector('.mewtwo-right-arm');
    const mewtwoLeftArm = mewtwoSvg.querySelector('.mewtwo-left-arm');
    const mewtwoHead = mewtwoSvg.querySelector('.mewtwo-head');

    // Estados iniciais
    gsap.set(giovanniStage, { autoAlpha: 0 });
    gsap.set(svg, { y: 28, scale: 0.92, opacity: 0, filter: 'brightness(0.12) contrast(1.3)' });
    gsap.set(dialogo, { y: 20, autoAlpha: 0 });
    if (hatGroup) gsap.set(hatGroup, { y: 2.3, rotation: -4, svgOrigin: '10 22' });
    if (strapGroup) gsap.set(strapGroup, { rotation: 0, svgOrigin: '34 43' });
    if (eyeGlint) gsap.set(eyeGlint, { scale: 0, opacity: 0, rotation: 0, svgOrigin: '26.5 11.5' });

    gsap.set(masterballStage, { autoAlpha: 0, x: -55, y: -25 });
    gsap.set(masterballSvg, { scale: 0.35, rotation: -40, transformOrigin: '50% 50%' });
    gsap.set(feixeMewtwo, { scaleY: 0, scaleX: 0.3, opacity: 0 });
    if (mbTopo) gsap.set(mbTopo, { rotation: 0, y: 0, svgOrigin: '1 10' });

    gsap.set(mewtwoStage, { autoAlpha: 0 });
    gsap.set(mewtwoSvg, {
      scale: 0.18,
      y: 45,
      opacity: 0,
      filter: 'brightness(4) saturate(0) drop-shadow(0 0 35px #f0abfc)',
    });
    if (mewtwoTail) gsap.set(mewtwoTail, { rotation: 0, svgOrigin: '41 42' });
    if (mewtwoRightArm) gsap.set(mewtwoRightArm, { rotation: 0, svgOrigin: '22 26' });
    if (mewtwoLeftArm) gsap.set(mewtwoLeftArm, { rotation: 0, svgOrigin: '37 26' });
    if (mewtwoHead) gsap.set(mewtwoHead, { rotation: 0, y: 0, svgOrigin: '30 20' });

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
      // 3. Revelação das cores + movimento de levantar a aba do chapéu e vento no sobretudo
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

    if (eyeGlint) {
      this.animarEstrelaBrilho(eyeGlint, 'giovanniVisivel+=1.2', 0.68, 0.45);
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

      // 4. Após os 5 segundos do Giovanni: A fala some e Giovanni arremessa a Master Ball!
      .addLabel('arremessoMasterball', 'giovanniVisivel+=5')
      .to(
        dialogo,
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.25,
          ease: 'power2.in',
        },
        'arremessoMasterball'
      )
      // Impulso de arremesso do Giovanni e recuo para as sombras
      .to(
        svg,
        {
          x: 22,
          rotation: 8,
          scale: 1.04,
          duration: 0.2,
          ease: 'power2.out',
        },
        'arremessoMasterball+=0.1'
      )
      .set(masterballStage, { autoAlpha: 1 }, 'arremessoMasterball+=0.22')
      .to(
        giovanniStage,
        {
          x: -90,
          scale: 0.88,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        'arremessoMasterball+=0.3'
      )
      // Arco parabólico e giro da Master Ball até o centro do campo
      .to(
        masterballStage,
        {
          x: 0,
          duration: 0.68,
          ease: 'power2.out',
        },
        'arremessoMasterball+=0.22'
      )
      .to(
        masterballStage,
        {
          y: -130,
          duration: 0.3,
          ease: 'power2.out',
        },
        'arremessoMasterball+=0.22'
      )
      .to(
        masterballStage,
        {
          y: 65,
          duration: 0.42,
          ease: 'bounce.out',
        },
        'arremessoMasterball+=0.52'
      )
      .to(
        masterballSvg,
        {
          scale: 1,
          rotation: 720,
          duration: 0.72,
          ease: 'power2.out',
        },
        'arremessoMasterball+=0.22'
      )
      // Balanço de travamento da Master Ball no chão
      .to(
        masterballSvg,
        {
          rotation: 702,
          x: -7,
          duration: 0.11,
          yoyo: true,
          repeat: 3,
          ease: 'sine.inOut',
        },
        'arremessoMasterball+=0.98'
      )

      // 5. Abertura da Master Ball + Feixe de Energia Psíquica
      .addLabel('aberturaMasterball', 'arremessoMasterball+=1.45');

    if (mbTopo) {
      this.masterTimeline.to(
        mbTopo,
        {
          rotation: -62,
          y: -5,
          x: -1,
          duration: 0.26,
          ease: 'back.out(2)',
        },
        'aberturaMasterball'
      );
    }

    this.masterTimeline
      .to(
        feixeMewtwo,
        {
          scaleY: 1,
          scaleX: 1.8,
          opacity: 1,
          duration: 0.28,
          ease: 'power3.out',
        },
        'aberturaMasterball+=0.06'
      )
      .to(
        flashPsiquico,
        {
          opacity: 0.92,
          duration: 0.2,
          ease: 'power2.in',
        },
        'aberturaMasterball+=0.15'
      )
      .to(
        masterballStage,
        {
          autoAlpha: 0,
          scale: 0.5,
          duration: 0.22,
          ease: 'power2.in',
        },
        'aberturaMasterball+=0.28'
      )
      .to(
        flashPsiquico,
        {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        'aberturaMasterball+=0.35'
      )

      // 6. Entrada do Mewtwo no campo + Movimentos clássicos de batalha dos jogos!
      .addLabel('mewtwoEntrada', 'aberturaMasterball+=0.28')
      .set(mewtwoStage, { autoAlpha: 1 }, 'mewtwoEntrada')
      // Materialização da silhueta psíquica para as cores reais
      .to(
        mewtwoSvg,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'back.out(1.2)',
        },
        'mewtwoEntrada'
      )
      .to(
        mewtwoSvg,
        {
          filter: 'brightness(1) saturate(1) drop-shadow(0 0 22px rgba(192, 38, 211, 0.85))',
          duration: 0.7,
          ease: 'power2.out',
        },
        'mewtwoEntrada+=0.45'
      );

    // Movimento 1: Mewtwo encolhe/concentra energia psíquica mais suavemente
    if (mewtwoRightArm) {
      this.masterTimeline.to(
        mewtwoRightArm,
        {
          rotation: -14,
          x: 1,
          duration: 0.65,
          ease: 'sine.inOut',
        },
        'mewtwoEntrada+=0.75'
      );
    }
    if (mewtwoLeftArm) {
      this.masterTimeline.to(
        mewtwoLeftArm,
        {
          rotation: 12,
          duration: 0.65,
          ease: 'sine.inOut',
        },
        'mewtwoEntrada+=0.75'
      );
    }
    if (mewtwoHead) {
      this.masterTimeline.to(
        mewtwoHead,
        {
          rotation: -6,
          y: 1.2,
          duration: 0.65,
          ease: 'sine.inOut',
        },
        'mewtwoEntrada+=0.75'
      );
    }
    this.masterTimeline.to(
      mewtwoSvg,
      {
        y: 6,
        scale: 0.97,
        duration: 0.65,
        ease: 'sine.inOut',
      },
      'mewtwoEntrada+=0.75'
    );

    // Movimento 2: Expansão Psíquica / Pose de Batalha do Mewtwo em ritmo mais cadenciado
    this.masterTimeline.addLabel('gritoMewtwo', 'mewtwoEntrada+=1.45');

    this.masterTimeline.to(
      mewtwoSvg,
      {
        y: -10,
        scale: 1.05,
        duration: 0.7,
        ease: 'back.out(1.5)',
      },
      'gritoMewtwo'
    );

    if (mewtwoRightArm) {
      this.masterTimeline
        .to(
          mewtwoRightArm,
          {
            rotation: 16,
            x: -1,
            y: -1,
            duration: 0.65,
            ease: 'back.out(1.6)',
          },
          'gritoMewtwo'
        )
        .to(
          mewtwoRightArm,
          {
            rotation: 4,
            duration: 1.15,
            repeat: 2,
            yoyo: true,
            ease: 'sine.inOut',
          },
          'gritoMewtwo+=0.7'
        );
    }

    if (mewtwoLeftArm) {
      this.masterTimeline
        .to(
          mewtwoLeftArm,
          {
            rotation: -14,
            duration: 0.65,
            ease: 'back.out(1.6)',
          },
          'gritoMewtwo'
        )
        .to(
          mewtwoLeftArm,
          {
            rotation: -3,
            duration: 1.15,
            repeat: 2,
            yoyo: true,
            ease: 'sine.inOut',
          },
          'gritoMewtwo+=0.7'
        );
    }

    if (mewtwoHead) {
      this.masterTimeline
        .to(
          mewtwoHead,
          {
            rotation: 4,
            y: -1,
            duration: 0.65,
            ease: 'back.out(1.5)',
          },
          'gritoMewtwo'
        )
        .to(
          mewtwoHead,
          {
            rotation: 0,
            y: 0,
            duration: 1.2,
            repeat: 2,
            yoyo: true,
            ease: 'sine.inOut',
          },
          'gritoMewtwo+=0.7'
        );
    }

    if (mewtwoTail) {
      this.masterTimeline.fromTo(
        mewtwoTail,
        { rotation: -7 },
        {
          rotation: 9,
          duration: 1.05,
          repeat: 3,
          yoyo: true,
          ease: 'sine.inOut',
        },
        'mewtwoEntrada+=0.4'
      );
    }

    // Ondas de choque psíquicas + levitação suave do Mewtwo
    if (onda1 && onda2) {
      this.masterTimeline
        .fromTo(
          onda1,
          { scale: 0.5, opacity: 0.85 },
          { scale: 2.2, opacity: 0, duration: 1.5, repeat: 1, ease: 'power2.out' },
          'gritoMewtwo'
        )
        .fromTo(
          onda2,
          { scale: 0.5, opacity: 0.65 },
          { scale: 2.4, opacity: 0, duration: 1.5, repeat: 1, ease: 'power2.out' },
          'gritoMewtwo+=0.5'
        );
    }

    if (mewtwoAura) {
      this.masterTimeline.fromTo(
        mewtwoAura,
        { scale: 0.85, opacity: 0.4 },
        { scale: 1.2, opacity: 0.9, duration: 1.1, repeat: 3, yoyo: true, ease: 'sine.inOut' },
        'mewtwoEntrada+=0.3'
      );
    }

    // Levitação psíquica cadenciada do Mewtwo em campo
    this.masterTimeline
      .to(
        mewtwoSvg,
        {
          y: 4,
          scale: 1,
          duration: 1.15,
          repeat: 2,
          yoyo: true,
          ease: 'sine.inOut',
        },
        'gritoMewtwo+=0.7'
      )
      // 7. Encerramento suave para a tela inicial após a animação do Mewtwo
      .to(
        overlay,
        {
          autoAlpha: 0,
          scale: 1.04,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        'gritoMewtwo+=3.8'
      );
  }

  private animarEstrelaBrilho(
    alvo: Element,
    inicio: string,
    escalaPico: number,
    escalaBase: number
  ): void {
    if (!this.masterTimeline) return;

    this.masterTimeline
      .to(
        alvo,
        {
          scale: escalaPico,
          opacity: 1,
          duration: 0.28,
          ease: 'back.out(2)',
        },
        inicio
      )
      .to(
        alvo,
        {
          scale: escalaBase,
          opacity: 0.92,
          duration: 0.5,
          repeat: 5,
          yoyo: true,
          ease: 'sine.inOut',
        },
        `${inicio}+=0.28`
      )
      .to(
        alvo,
        {
          rotation: 360,
          duration: 2.8,
          ease: 'none',
        },
        inicio
      );
  }

  private finalizarIntro(): void {
    this.visivel.set(false);
    const urlAtual = this.router.url.split('?')[0].replace(/\/+$/, '') || '/';
    if (urlAtual === '/') {
      this.router.navigate(['/projetos']);
    }
  }

  ngOnDestroy(): void {
    this.pulsoTweens.forEach((t) => t.kill());
    this.masterTimeline?.kill();
  }
}
