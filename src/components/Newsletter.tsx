import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="bg-[rgba(0,0,0,0)] self-center flex w-[896px] max-w-full flex-col items-center px-20 max-md:px-5">
      <div className="flex w-[448px] max-w-full flex-col items-stretch">
        <h2 className="text-white text-[35px] font-bold leading-none text-center self-center">
          Stay Fresh!
        </h2>
        <form onSubmit={handleSubmit} className="bg-[rgba(0,0,0,0)] flex items-stretch gap-4 mt-[39px] max-md:max-w-full">
          <div className="bg-[rgba(255,255,255,0.4)] flex flex-col overflow-hidden text-base text-white font-normal leading-loose grow shrink-0 basis-0 w-fit pt-3 pb-5 px-4 rounded-[50px] max-md:pr-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-transparent outline-none placeholder-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitted}
            className="bg-[rgba(249,202,36,1)] flex flex-col items-stretch text-[15px] text-[rgba(0,38,82,1)] font-bold whitespace-nowrap text-center leading-loose justify-center px-[33px] py-[18px] rounded-[40px] hover:bg-yellow-400 transition-colors disabled:opacity-50 max-md:px-5"
          >
            {isSubmitted ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
