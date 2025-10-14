import React from 'react';
import NewHeader from '@/components/NewHeader';
import NewsletterFooter from '@/components/NewsletterFooter';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-8">
                A Passion for Real Fermentation
              </h1>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&h=500"
                alt="Colorful kimchi jars arranged beautifully"
                className="w-full max-w-4xl h-96 object-cover rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-[hsl(var(--ff-dark))] mb-8">
                  Our Mission
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    At Futurefoodz, we believe that the future of nutrition lies in the ancient wisdom of fermentation. 
                    Our commitment goes beyond creating delicious products – we're dedicated to preserving traditional 
                    recipes while making them accessible to modern households seeking authentic, gut-healthy foods.
                  </p>
                  <p>
                    Every jar of kimchi and block of tempeh we craft represents our unwavering dedication to quality, 
                    sustainability, and wellness. We source only the finest organic ingredients from local farmers, 
                    ensuring that each bite not only nourishes your body but also supports our community and environment.
                  </p>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&h=400"
                  alt="Fresh ingredients for kimchi and tempeh"
                  className="w-full h-96 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-20 px-6 bg-[hsl(var(--ff-yellow))]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[hsl(var(--ff-dark))] mb-4">
                From Farm to Jar
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-[hsl(var(--ff-navy))] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[hsl(var(--ff-yellow))]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.99.66C8.01 16.34 9.91 10.17 17 8zm.64-1.64c-4.17.3-6.95 3.2-9.15 7.64l1.9.68c2.05-4.05 4.47-6.4 7.25-6.32zm-7.5 12.48c4.17-.3 6.95-3.2 9.15-7.64l-1.9-.68c-2.05 4.05-4.47 6.4-7.25 6.32z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--ff-dark))] mb-4">
                  Sustainably Sourced
                </h3>
                <p className="text-gray-700">
                  We partner with local organic farms to source the freshest, highest-quality ingredients for our fermented foods.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-[hsl(var(--ff-navy))] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[hsl(var(--ff-yellow))]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--ff-dark))] mb-4">
                  Handcrafted with Care
                </h3>
                <p className="text-gray-700">
                  Our small-batch approach ensures every product receives the attention and care traditional fermentation deserves.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-[hsl(var(--ff-navy))] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[hsl(var(--ff-yellow))]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--ff-dark))] mb-4">
                  Perfectly Fermented
                </h3>
                <p className="text-gray-700">
                  Our natural fermentation process maximizes flavor development and probiotic content for optimal health benefits.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <NewsletterFooter />
    </div>
  );
};

export default AboutUs;