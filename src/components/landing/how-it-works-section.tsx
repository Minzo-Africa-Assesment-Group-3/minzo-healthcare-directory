import { ArrowLeftRight, PhoneCall, Search } from 'lucide-react';

const steps = [
    { title: 'Search', icon: Search, text: 'Look for doctors, hospitals, pharmacies or services near you' },
    { title: 'Compare', icon: ArrowLeftRight, text: 'View details, services, ratings and reviews to make the right choice.' },
    { title: 'Contact', icon: PhoneCall, text: 'Get in touch, book an appointment or visit in person.' },
];

export default function HowItWorksSection() {
    return (
        <section id="about" className="scroll-mt-16 bg-[#E8EDF1] py-14 md:py-20">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">How Minzo Works</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-gray-700 sm:text-base">
                        Find, compare and connect with healthcare providers in just a few steps
                    </p>
                </div>

                <ol className="mt-8 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">
                    {steps.map(({ title, icon: Icon, text }, i) => (
                        <li
                            key={title}
                            className="mx-auto flex w-full max-w-xs flex-col items-center rounded-2xl bg-[#F8FAFA] px-6 py-8 text-center md:max-w-none"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0C486D] text-sm font-semibold text-white">
                                {i + 1}
                            </span>
                            <div className="mt-5 flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E1EDE2] text-gray-800">
                                    <Icon className="h-4 w-4" aria-hidden />
                                </span>
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            </div>
                            <p className="mt-4 max-w-[14rem] text-sm leading-relaxed text-gray-700 md:max-w-xs">{text}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
