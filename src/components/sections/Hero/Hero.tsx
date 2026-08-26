// Hero.tsx
import HeroContent from "./HeroContent";
import HeroLogo from "./HeroLogo";

const Hero = () => {
  return (
    <section
      id="home"
      className="
        relative
        pt-[clamp(110px,13vw,170px)]
        lg:pt-[clamp(94px,7vw,110px)]
        pb-[clamp(72px,8vw,100px)]
        lg:pb-[clamp(56px,5vw,88px)]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1180px]
          px-6

          lg:w-[min(82vw,1440px)]
          lg:max-w-none
          lg:px-0

          grid
          lg:grid-cols-[calc(48%-2.5rem)_calc(52%-2.5rem)]
          items-center
          gap-20
        "
      >
        {/* No left offset here: the grid container now mirrors the navbar's
            own box (w-[1000px] / max-w-[82vw], centred), so column 1's left
            edge IS the navbar's left edge. The old marginLeft clamp added up
            to 72px of indent; it evaluated to 0 below ~1025px, so removing it
            affects desktop only. */}
        <div
          className="
            order-2
            lg:order-1
            flex
            justify-center
            lg:justify-start
            md:pl-12
            lg:pl-0
          "
        >
          <HeroContent />
        </div>

        {/* The old inline translateX pushed this column up to +96px right at
            >=1366, which clipped the outer orbit ring against the viewport
            edge. It evaluated to 0 below ~1021px, so dropping it changes
            desktop only and leaves mobile/tablet untouched. */}
        <div
          className="
            order-1
            lg:order-2
            flex
            justify-center
          "
        >
          <HeroLogo />
        </div>
      </div>
    </section>
  );
};

export default Hero;