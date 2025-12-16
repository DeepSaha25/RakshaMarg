import React from 'react';
import { Shield, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo

const TrustSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-dark to-primary" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 animate-float">
          <Shield className="w-20 h-20" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '2s' }}>
          <Heart className="w-16 h-16" />
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float" style={{ animationDelay: '4s' }}>
          <Star className="w-12 h-12" />
        </div>
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          {/* Icon */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/30 rounded-full blur-xl animate-pulse-slow" />
              <div className="relative bg-secondary/20 backdrop-blur-sm p-5 rounded-full border border-secondary/30">
                {/* Replaced Shield icon with Logo */}
                <img src={logo} alt="RakshaMarg Logo" className="w-12 h-12 object-contain" />
              </div>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="font-display text-2xl md:text-4xl font-semibold mb-6 leading-relaxed">
            "Technology for Protection, Not Fear"
          </blockquote>

          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            RakshaMarg is committed to creating a world where every woman can travel with dignity, 
            confidence, and complete awareness of her surroundings.
          </p>

          <p className="text-base opacity-80 mb-10 max-w-xl mx-auto">
            We believe that safety begins with knowledge. Our mission is to empower, not alarm — 
            to inform, not frighten. Together, we can make every journey a safe one.
          </p>

          {/* CTA */}
          <Link to="/check-route">
            <Button 
              variant="outline" 
              size="xl" 
              className="border-2 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm"
            >
              Start Your Safe Journey
            </Button>
          </Link>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-70">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Privacy First</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Women-Centric</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="text-sm">Trusted Platform</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;