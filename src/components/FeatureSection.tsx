import React from 'react';

const FeatureSection = () => {
  const features = [
    {
      image: "https://api.builder.io/api/v1/image/assets/293e78bed62a41a9ab365dc4fe5df9cc/1b2900d01d334fe9ed289d604b9478a0b0955a8f?placeholderIfAbsent=true",
      badge: "Best dish",
      title: "Kimchi"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/293e78bed62a41a9ab365dc4fe5df9cc/54210547062808469882f454889b85d212c5d9b4?placeholderIfAbsent=true",
      badge: "Deal",
      title: "Tempeh"
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/293e78bed62a41a9ab365dc4fe5df9cc/0a96aff37d7a40dc7ec9d98b1ada5539d4eb54ba?placeholderIfAbsent=true",
      badge: "Best Deal",
      title: "Kombucha"
    }
  ];

  return (
    <section id="features" className="bg-[rgba(249,202,36,1)] w-full mt-[114px] pt-8 pb-[88px] px-[51px] max-md:max-w-full max-md:mt-10 max-md:px-5">
      <div className="flex w-full max-w-[1572px] items-stretch gap-5 flex-wrap justify-between mr-[35px] max-md:max-w-full max-md:mr-2.5">
        <h2 className="text-[rgba(15,52,96,1)] text-[32px] font-bold my-auto">
          Why we are Healthy?
        </h2>
        <div className="flex items-stretch text-base text-[rgba(0,38,82,1)] font-normal">
          <div className="mr-[-318px] grow shrink basis-auto my-auto max-md:max-w-full">
            Vegan Fermented Foods others
          </div>
          <div className="border flex w-[230px] shrink-0 h-[61px] rounded-[120px] border-[rgba(0,38,82,1)] border-solid" />
        </div>
      </div>
      <div className="mt-[42px] max-md:max-w-full max-md:mt-10">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          {features.map((feature, index) => (
            <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
              <div className="flex flex-col relative min-h-[325px] grow pt-[226px] pb-9 px-12 rounded-xl max-md:max-w-full max-md:mt-[21px] max-md:pt-[100px] max-md:px-5 hover:transform hover:scale-105 transition-transform">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="absolute h-full w-full object-cover inset-0 rounded-xl"
                />
                <div className="relative text-[rgba(249,202,36,1)] text-lg font-medium">
                  {feature.badge}
                </div>
                <h3 className="relative text-white text-2xl font-bold">
                  {feature.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
