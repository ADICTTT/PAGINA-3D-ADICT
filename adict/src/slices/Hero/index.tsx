import { Content } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/Bounded";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="grid">
        <div className="grid h-screen place-items-center">
          <div className="grid auto-rows-min place-items-center text-center">
            <h1 className="hero-header lg:text-[13rem] text-7xl font-black uppercase leading-[.8] text-orange-500 md:text-[9rem] lg;text-[13rem]">
              <PrismicRichText field={slice.primary.heading} />
            </h1>
          <PrismicRichText field={slice.primary.subheading} />
          <PrismicRichText field={slice.primary.body} />
          <PrismicNextLink field={slice.primary.button_link} />
          {slice.primary.button_text}
          </div>
        </div>

        <div className="text-side relative z-[80] grid h-screen items-center gap-4 md:grid-cols-2">
          <PrismicNextImage field={slice.primary.cans_image} />
          <PrismicRichText field={slice.primary.second_heading} />
          <PrismicRichText field={slice.primary.second_body} />
        </div>
      </div>
      </Bounded>
  );
};

export default Hero;
