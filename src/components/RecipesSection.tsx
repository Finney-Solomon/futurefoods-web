import React from 'react';
import { Button } from './ui/button';

const RecipesSection = () => {
  const recipes = [
    {
      image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=400&h=300",
      title: "Lorem Ipsum",
      description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    },
    {
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=400&h=300",
      title: "Lorem Ipsum", 
      description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    },
    {
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&h=300",
      title: "Lorem Ipsum",
      description: "dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    }
  ];

  return (
    <section className="bg-[hsl(var(--ff-navy))] py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-5xl font-bold text-white mb-6">
          Recipes & Inspiration
        </h2>
        <p className="text-white text-2xl font-light mb-16">
          Get Creative in the Kitchen!
        </p>
        
        {/* Recipe Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {recipes.map((recipe, index) => (
            <div key={index}>
              <img 
                src={recipe.image}
                alt={`Recipe ${index + 1}`}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            </div>
          ))}
        </div>
        
        {/* Recipe Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {recipes.map((recipe, index) => (
            <div key={index} className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                {recipe.title}
              </h3>
              <p className="text-white text-base leading-relaxed">
                {recipe.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Explore Button */}
        {/* <Button 
          size="lg"
          className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 px-12 py-4 text-lg font-semibold rounded-full"
        >
          Explore Recipes
        </Button> */}
      </div>
    </section>
  );
};

export default RecipesSection;