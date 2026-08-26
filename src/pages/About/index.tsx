import { Helmet } from "react-helmet-async";

import About from "../../components/sections/About/About";
import Process from "../../components/sections/Process/Process";

/**
 * Why Choose AFAQ now renders on the Services page (directly after Services)
 * instead of here — see pages/Services/index.tsx. The component itself is
 * untouched; only which page renders it changed.
 */
const AboutPage = () => (
  <>
    <Helmet>
      <title>AFAQ AI | About</title>
    </Helmet>
    <About />
    <Process />
  </>
);

export default AboutPage;
