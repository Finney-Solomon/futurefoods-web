import React from 'react';

interface ProductCardProps {
  image: string;
  price: string;
  name: string;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, price, name, description }) => {
  return (
    <article className="self-stretch min-w-60 w-[351px] my-auto rounded-[0px_0px_0px_0px]">
      <div className="flex flex-col items-stretch bg-white pb-[34px] rounded-xl border-[1.5px] border-solid border-[#DBDFD0] hover:shadow-lg transition-shadow">
        <img
          src={image}
          alt={name}
          className="aspect-[1.53] object-contain w-full rounded-[0px_0px_0px_0px]"
        />
        <div className="self-center flex w-[246px] max-w-full flex-col items-center mt-[30px]">
          <div className="text-[#AD343E] text-2xl leading-none tracking-[-0.72px] font-bold">
            {price}
          </div>
          <h3 className="text-[#2C2F24] text-xl leading-[1.3] mt-[15px] font-bold">
            {name}
          </h3>
          <p className="text-[#414536] text-base font-normal leading-6 mt-[15px] text-center">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
