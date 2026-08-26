import { Helmet } from "react-helmet-async";

import Services from "../../components/sections/Services/Services";
import WhyChoose from "../../components/sections/WhyChoose/WhyChoose";

const ServicesPage = () => (
  <>
    <Helmet>
      <title>AFAQ AI | Services</title>
    </Helmet>
    <Services />
    <WhyChoose />
  </>
);

export default ServicesPage;
