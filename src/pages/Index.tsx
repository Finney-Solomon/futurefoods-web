import React from 'react';
import NewHeader from '@/components/NewHeader';
import NewHero from '@/components/NewHero';
import HealthySection from '@/components/HealthySection';
import WhyFuturefoodsSection from '@/components/WhyFuturefoodsSection';
import NewFeaturedProducts from '@/components/NewFeaturedProducts';
import FermentationAdvantage from '@/components/FermentationAdvantage';
import RecipesSection from '@/components/RecipesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import NewsletterFooter from '@/components/NewsletterFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <NewHeader />
      
      {/* Hero Section */}
      <NewHero />
      
      {/* Why we are Healthy Section */}
      <HealthySection />
      
      {/* Why futurefoodz Section */}
      <WhyFuturefoodsSection />
      
      {/* Featured Products Section */}
      <NewFeaturedProducts />
      
      {/* The Fermentation Advantage Section */}
      <FermentationAdvantage />
      
      {/* Recipes & Inspiration Section */}
      <RecipesSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Call to Action Section */}
      {/* <CTASection /> */}
      
      {/* Newsletter & Footer */}
      <NewsletterFooter />
    </div>
  );
};

export default Index;
