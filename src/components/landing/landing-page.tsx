import Navbar from './navbar';
import HeroSection from './hero-section';
import ServicesSection from './services-section';
import HowItWorksSection from './how-it-works-section';
import AudienceSection from './audience-section';
import ClearInfoSection from './clear-info-section';
// import Footer from './footer';

export default function LandingPage() {
    return (
        <div className="font-(family-name:--font-roboto-slab)">
            <Navbar />
            <main>
                <HeroSection />
                <ServicesSection />
                <HowItWorksSection />
                <AudienceSection />
                <ClearInfoSection />
            </main>
            {/* <Footer /> */}
        </div>
    );
}
