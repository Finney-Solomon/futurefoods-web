import React from "react";

const NewFeaturedProducts = () => {
  const products = [
    {
      // Tempeh first (as in the screenshot)
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1600&q=80",
      name: "Tempeh",
      price: "$ 9.99",
    },
    {
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1600&q=80",
      name: "Kimchi",
      price: "$ 15.99",
    },
    {
      image:
        "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=1600&q=80",
      name: "Kombucha",
      price: "$ 7.25",
    },
    {
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1600&q=80",
      name: "Kimchi",
      price: "$ 20.99",
    },
  ];

  const desc =
    "Made with eggs, lettuce, salt, oil and other ingredients.";

  const Card = ({ image, name, price }: (typeof products)[number]) => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img
        src={image}
        alt={name}
        className="h-[200px] w-full object-cover"
      />
      <div className="p-6 text-center">
        <div className="mb-2 text-[22px] font-bold text-[#c0392b]">{price}</div>
        <h3 className="mb-3 text-lg font-extrabold text-[hsl(var(--ff-dark))]">
          {name}
        </h3>
        <p className="mx-auto max-w-[260px] text-sm leading-6 text-gray-600">
          {desc}
        </p>
      </div>
    </div>
  );

  return (
    <section className="bg-white :py-14 mx-auto max-w-[1400px] px-6 py-14 md:py-18">
      <div className="mx-auto max-w-[1400px]">
        {/* Title */}
        <h2 className="mb-10 text-left text-[44px] leading-[1] font-extrabold tracking-tight text-[hsl(var(--ff-dark))] md:text-[72px]">
          Featured Products
        </h2>

        {/* Row 1 */}
        <div className="mb-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={`row1-${p.name}-${p.price}`} {...p} />
          ))}
        </div>

        {/* Row 2 (same items, same order) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card key={`row2-${p.name}-${p.price}`} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewFeaturedProducts;
