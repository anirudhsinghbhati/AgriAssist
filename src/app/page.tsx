
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Leaf, BrainCircuit, LineChart, BarChart, CloudSun, Users, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/landing-header';
import { Footer } from '@/components/layout/landing-footer';
import { FallingLeaves } from '@/components/falling-leaves';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Advisory',
    description: 'Get personalized crop recommendations, pest detection, and yield predictions powered by cutting-edge AI.',
  },
  {
    icon: LineChart,
    title: 'Market Insights',
    description: 'Access real-time market prices for your crops to make informed selling decisions and maximize your profits.',
  },
  {
    icon: BarChart,
    title: 'Farm Management',
    description: 'Easily track your finances, manage your inventory, and view detailed reports on your farm\'s performance.',
  },
  {
    icon: CloudSun,
    title: 'Weather Alerts',
    description: 'Stay ahead of the weather with accurate forecasts, climate alerts, and pest warnings for your specific location.',
  },
  {
    icon: Users,
    title: 'Community & Experts',
    description: 'Connect with fellow farmers, share knowledge, and get one-on-one advice from agricultural specialists.',
  },
  {
    icon: Leaf,
    title: 'Resource Hub',
    description: 'Access a rich library of guides on seed selection, organic pest control, and sustainable farming practices.',
  },
];

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-green-200 to-amber-200 dark:from-sky-900 dark:via-emerald-900 dark:to-yellow-900 -z-10">
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-800/80 to-transparent">
               <div className="grass-container">
                    <div className="grass"></div>
                    <div className="grass"></div>
                    <div className="grass"></div>
                    <div className="grass"></div>
                    <div className="grass"></div>
                </div>
            </div>
             <FallingLeaves />
          </div>

          <div className="container relative mx-auto px-4 text-center text-white">
            <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline" style={{ animationDelay: '0.2s' }}>
              Smart Farming for a Brighter Future
            </h1>
            <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-white/80" style={{ animationDelay: '0.4s' }}>
              GreenRoots empowers farmers with AI-driven insights, real-time data, and expert advice to increase yield and profitability.
            </p>
            <div className="animate-fade-in-up mt-10" style={{ animationDelay: '0.6s' }}>
              <Button asChild size="lg">
                <Link href="/login">
                  Get Started for Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-foreground">
                Everything Your Farm Needs in One App
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From planting to profit, GreenRoots provides the tools you need to succeed.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="animate-fade-in-up group relative flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-2xl overflow-hidden"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-card-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
