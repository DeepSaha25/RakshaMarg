import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import docImg from '../assets/doc.png';
import pilotImg from '../assets/pilot.png';
import soldierImg from '../assets/soldier.png';

const HeroSection = () => {
  const images = [docImg, pilotImg, soldierImg];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Image Carousel */}
          <div className="mb-8 inline-flex items-center justify-center animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl animate-shield" />
              <div className="relative bg-gradient-to-br from-primary to-navy-dark p-6 rounded-2xl shadow-elevated">
                <img 
                  key={currentImageIndex}
                  src={images[currentImageIndex]} 
                  alt="Role Icon" 
                  className="w-23 h-20 object-contain animate-fade-in"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 
            className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-gradient">Raksha</span>
            <span className="text-primary">Marg</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl font-display font-medium text-primary/80 mb-4 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Know Your Route. Travel with Confidence.
          </p>

          {/* Description */}
          <p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            RakshaMarg helps women evaluate the safety of routes before traveling — day or night. 
            Make informed decisions and travel with awareness.
          </p>

          {/* CTA Button */}
          <div 
            className="animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <Link to="/check-route">
              <Button variant="hero" size="xl" className="group">
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Trust indicator */}
          <div 
            className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: '1s' }}
          >
            <Shield className="w-4 h-4 text-secondary" />
            <span>Empowering safe travels across India</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;