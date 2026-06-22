import AboutUs from "@/components/about";
import HomePage from "./home/page";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import BrandsWeDeal from "@/components/BrandsWeDeal";
import ProjectGallery from "@/components/Projectgallery";
import Testimonials from "@/components/Testimonials";
import StatsCounter from "@/components/StatsCounter";
import InquiryForm from "@/components/InquiryForm";
import ContactLocation from "@/components/ContactLocation";


export default function Page() {
  return (
    <>
      <HomePage />
      <ProductCategories />
      <FeaturedProducts />
      <AboutUs />

      <WhyChooseUs />
      <BrandsWeDeal />
      <ProjectGallery />
      <Testimonials />
      <StatsCounter />
      <InquiryForm />
      <ContactLocation />
      
    </>
  );
}
