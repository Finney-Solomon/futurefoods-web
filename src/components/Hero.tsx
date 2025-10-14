import React from 'react';

const Hero = () => {
  const handleShopNow = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="flex w-full max-w-[1437px] flex-col items-center ml-[65px] mt-[89px] max-md:max-w-full max-md:mt-10">
      <div className="self-stretch max-md:max-w-full max-md:pr-5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <div className="w-[73%] max-md:w-full max-md:ml-0">
            <h1 className="text-[rgba(0,38,82,1)] text-9xl font-semibold leading-[120px] mr-[-910px] mt-[43px] max-md:max-w-full max-md:text-[40px] max-md:leading-[42px] max-md:mt-10">
              Taste the{" "}
              <span className="font-bold italic text-[rgba(255,202,106,1)]">
                Future
              </span>{" "}
              <br />
              <span className="text-[96px] max-md:text-[40px]"> of Food</span>
            </h1>
          </div>
          <div className="w-[27%] ml-5 max-md:w-full max-md:ml-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/293e78bed62a41a9ab365dc4fe5df9cc/86b9534f19f830c438cdbabae5fb83d730a18fd6?placeholderIfAbsent=true"
              alt="Future Food"
              className="aspect-[1.08] object-contain w-full grow max-md:max-w-full"
            />
          </div>
        </div>
      </div>
      <h2 className="text-[rgba(0,38,82,1)] text-[32px] font-bold text-center ml-[106px] mt-3.5">
        <span className="font-normal italic">Revolutionizing</span> nutrition
      </h2>
      <div className="flex items-center gap-4 text-base text-[#002652] font-bold text-right flex-wrap ml-[72px] mt-[41px] max-md:max-w-full max-md:mt-10">
        <button
          onClick={handleShopNow}
          className="bg-[rgba(249,202,36,1)] self-stretch flex min-w-60 min-h-16 items-center gap-2.5 justify-center w-[368px] my-auto px-8 py-5 rounded-[118px] hover:bg-yellow-400 transition-colors max-md:px-5"
        >
          <span className="self-stretch my-auto">Shop now</span>
        </button>
        <button
          onClick={handleLearnMore}
          className="self-stretch flex min-w-60 min-h-16 items-center gap-2.5 justify-center w-[368px] my-auto px-8 py-5 rounded-[118px] border-[rgba(0,38,82,1)] border-solid border-2 hover:bg-[rgba(0,38,82,1)] hover:text-white transition-colors max-md:px-5"
        >
          <span className="self-stretch my-auto">Learn more</span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
