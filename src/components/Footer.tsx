import React from 'react';

const Footer = () => {
  const quickLinks = ['Shop', 'About Us', 'Our Process', 'Recipes'];
  const supportLinks = ['Contact Us', 'FAQ', 'Shipping', 'Returns'];

  return (
    <footer className="bg-zinc-900 flex flex-col overflow-hidden items-stretch pl-[38px] pt-[111px] max-md:max-w-full max-md:pl-5 max-md:pt-[100px]">
      <div className="bg-[rgba(0,0,0,0)] flex w-full flex-col mt-[91px] pl-8 pb-[41px] max-md:max-w-full max-md:mt-10 max-md:pl-5">
        <div className="bg-[rgba(0,0,0,0)] z-10 w-full max-w-[1535px] max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-3/12 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(0,0,0,0)] flex grow flex-col text-[15px] text-white font-normal leading-5 w-full pt-11 pb-[107px] max-md:mt-10 max-md:pb-[100px]">
                <p className="w-[280px]">
                  #NoFuss - Just pure, fermented goodness for your health and the planet.
                </p>
              </div>
            </div>
            <div className="w-3/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(0,0,0,0)] flex grow flex-col text-white w-full pr-[73px] pb-[62px] max-md:mt-10">
                <h3 className="text-base font-medium leading-loose">Quick Links</h3>
                <nav className="bg-[rgba(0,0,0,0)] flex flex-col text-sm font-normal leading-none mt-[26px] pr-14 pb-1.5 max-md:pr-5">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      className="leading-none hover:text-yellow-300 transition-colors mt-3.5 first:mt-0"
                    >
                      {link}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="w-3/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(0,0,0,0)] flex grow flex-col text-white w-full pr-[73px] pb-[62px] max-md:mt-10">
                <h3 className="text-base font-medium leading-loose">Support</h3>
                <nav className="bg-[rgba(0,0,0,0)] flex flex-col text-sm font-normal leading-none mt-[26px] pr-14 pb-2.5 max-md:pr-5">
                  {supportLinks.map((link, index) => (
                    <a
                      key={index}
                      href={`#${link.toLowerCase().replace(' ', '-')}`}
                      className="leading-none hover:text-yellow-300 transition-colors mt-[18px] first:mt-0"
                    >
                      {link}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <div className="w-3/12 ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(0,0,0,0)] flex grow flex-col text-base text-white font-medium leading-loose w-full pr-[42px] pb-[142px] max-md:mt-10 max-md:pb-[100px]">
                <h3>Follow Us</h3>
                <img
                  src="https://api.builder.io/api/v1/image/assets/293e78bed62a41a9ab365dc4fe5df9cc/3ce9ab96efc25b542645dadd82eaf23ae136acd9?placeholderIfAbsent=true"
                  alt="Social Media Links"
                  className="aspect-[11.63] object-contain w-[280px] mt-7"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(0,0,0,0)] flex w-full max-w-[1576px] flex-col items-center text-sm text-white font-normal text-center leading-none justify-center px-[70px] py-[31px] max-md:max-w-full max-md:px-5">
          <p>© 2023 Future Foodz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
