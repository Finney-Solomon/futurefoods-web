import React from "react";
import { Button } from "./ui/button";

const NewHero = () => {
    return (
        <section className="relative bg-white">
            <div className="mx-auto max-w-[1760px] px-6 pb-20 sm:px-10 lg:px-16 xl:px-24">
                <div className="relative grid items-center gap-y-8 lg:grid-cols-[minmax(300px,1fr)_minmax(360px,520px)_minmax(360px,1fr)] lg:gap-x-8">
                    <h1 className="justify-self-start text-left text-[56px] font-extrabold leading-[0.95] tracking-normal text-[hsl(var(--ff-dark))] sm:text-[72px] md:text-[92px] lg:text-[108px] xl:text-[126px]">
                        Taste the
                    </h1>

                    <div className="relative order-3 flex justify-center lg:order-none">
                        <div className="relative h-[240px] w-[240px] overflow-hidden rounded-full sm:h-[300px] sm:w-[300px] md:h-[380px] md:w-[380px] lg:h-[440px] lg:w-[440px] xl:h-[520px] xl:w-[520px]">
                            <img
                                src="/lovable-uploads/homescreen.png"
                                alt="Fresh Salad Bowl"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="justify-self-end text-right">
                        <h1 className="text-[56px] font-extrabold leading-[0.95] tracking-normal sm:text-[72px] md:text-[92px] lg:text-[108px] xl:text-[126px]">
                            <span className="italic text-[hsl(var(--ff-yellow))]">Future</span>
                        </h1>
                        <h1 className="mt-3 text-[56px] font-extrabold leading-[0.95] tracking-normal text-[hsl(var(--ff-dark))] sm:text-[72px] md:text-[92px] lg:text-[108px] xl:text-[126px]">
                            of Food
                        </h1>
                    </div>
                </div>

                <p className="mt-12 text-center text-[22px] italic tracking-[0.08em] text-[hsl(var(--ff-dark))] md:text-[24px]">
                    Revolutionizing <span className="not-italic font-semibold">nutrition</span>
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="rounded-full bg-[hsl(var(--ff-yellow))] px-10 py-6 text-lg font-semibold text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90"
                        onClick={() => (window.location.href = "/shop")}
                    >
                        Shop now
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full border-2 border-[hsl(var(--ff-dark))] px-10 py-6 text-lg font-semibold text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-dark))] hover:text-white"
                    >
                        Learn more
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default NewHero;
