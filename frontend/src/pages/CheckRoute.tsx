import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Navigation, Search, Shield, AlertTriangle, CheckCircle, Info, Share2, Lightbulb, Clock, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import mapImage from '@/assets/map.png';
import { analyzeRouteSafety, getIncidentDetails, RouteInfo, IncidentDetail } from '@/services/navigation';

const safetyTips = [
  "Share your live location with a trusted contact.",
  "Keep emergency contacts easily accessible.",
  "Prefer well-lit and populated routes.",
  "Trust your instincts — if something feels wrong, seek help.",
  "Keep your phone charged and carry a power bank.",
  "Note landmarks along your route for easier navigation.",
];

const CheckRoute = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [safestRouteName, setSafestRouteName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Incident Details Modal State
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);
  const [incidents, setIncidents] = useState<IncidentDetail[]>([]);
  const [loadingIncidents, setLoadingIncidents] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displayedIncidentCount, setDisplayedIncidentCount] = useState(0);

  const handleCheckRoute = async () => {
    if (!fromLocation || !toLocation) return;

    setIsAnalyzing(true);
    setError(null);
    setShowResults(false);

    try {
      const data = await analyzeRouteSafety(fromLocation, toLocation);
      setRoutes(data.routes);
      setSafestRouteName(data.safest_route);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze route safety. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewDetails = async (route: RouteInfo) => {
    setSelectedRoute(route);
    setIncidents([]);
    setDisplayedIncidentCount(0);
    setIsDialogOpen(true);

    // Load first batch of incidents
    await loadMoreIncidents(route, 0);
  };

  const loadMoreIncidents = async (route: RouteInfo, currentCount: number) => {
    if (!route.incident_ids || route.incident_ids.length === 0) return;

    setLoadingIncidents(true);
    const nextIds = route.incident_ids.slice(currentCount, currentCount + 10);

    if (nextIds.length === 0) {
      setLoadingIncidents(false);
      return;
    }

    try {
      const newIncidents = await getIncidentDetails(nextIds);
      setIncidents(prev => [...prev, ...newIncidents]);
      setDisplayedIncidentCount(currentCount + nextIds.length);
    } catch (err) {
      console.error('Failed to load incidents', err);
    } finally {
      setLoadingIncidents(false);
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSafetyScoreBg = (score: number) => {
    if (score >= 80) return 'border-green-500/50 bg-green-500/10';
    if (score >= 60) return 'border-yellow-500/50 bg-yellow-500/10';
    return 'border-red-500/50 bg-red-500/10';
  };

  return (
    <>
      <Helmet>
        <title>Check Route Safety | RakshaMarg</title>
        <meta name="description" content="Prioritize safety over speed. Analyze route safety with RakshaMarg." />
      </Helmet>

      <div className="min-h-screen bg-brand-dark flex flex-col font-sans text-white selection:bg-brand-teal/30">
        <Navbar />

        <main className="flex-1 pt-24 md:pt-32 pb-20">

          {/* Header Section */}
          <section className="container px-4 mb-12">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-sm font-medium mb-6"
              >
                <Shield className="w-4 h-4" />
                <span>Safety First Navigation</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Not just the fastest route <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-purple">
                  — the safest one.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-white/60 max-w-2xl mx-auto mb-8"
              >
                Lighting  •  Crowd presence  •  Area risk patterns  •  Time of travel
              </motion.p>
            </div>
          </section>

          {/* New Input Section (Timeline without Time) */}
          <section className="container px-4 mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -z-10" />

                <div className="space-y-8">
                  {/* Timeline UI */}
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[1.65rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand-teal/50 via-white/10 to-brand-purple/50 md:left-8" />

                    {/* Start Location */}
                    <div className="relative flex items-center gap-4 md:gap-6 mb-8">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0 z-10">
                        <div className="w-3 h-3 bg-brand-teal rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs uppercase tracking-wider text-white/40 font-bold mb-2 block ml-1">Start Location</label>
                        <Input
                          type="text"
                          placeholder="Where are you starting from?"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          className="h-14 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-brand-teal rounded-xl text-lg"
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="relative flex items-center gap-4 md:gap-6">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0 z-10">
                        <MapPin className="w-6 h-6 text-brand-purple" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs uppercase tracking-wider text-white/40 font-bold mb-2 block ml-1">Destination</label>
                        <Input
                          type="text"
                          placeholder="Where do you want to go?"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          className="h-14 bg-black/20 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-brand-purple rounded-xl text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA Area */}
                  <div className="pt-4">
                    <Button
                      size="xl"
                      className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-brand-purple to-brand-teal text-white hover:opacity-90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]"
                      onClick={handleCheckRoute}
                      disabled={!fromLocation || !toLocation || isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Analysing Safety Patterns...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Search className="w-5 h-5" />
                          <span>Analyze Route Safety</span>
                        </div>
                      )}
                    </Button>
                    <div className="flex items-center justify-center gap-4 mt-4 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                      <span>Takes ~3 seconds</span>
                      <span>•</span>
                      <span>Privacy-first</span>
                      <span>•</span>
                      <span>No live tracking stored</span>
                    </div>
                    {error && (
                      <div className="mt-4 text-center text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Results Section */}
          {showResults && routes.length > 0 && (
            <section className="container px-4 mb-16 animate-fade-in scroll-mt-24" id="results">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-6 h-6 text-brand-teal" />
                  <h2 className="text-2xl font-bold">Route Analysis Results</h2>
                </div>

                {routes.map((route, index) => {
                  const isSafest = route.route_name === safestRouteName;
                  return (
                    <div
                      key={index}
                      className={`bg-white/5 rounded-3xl p-6 border ${isSafest ? 'border-brand-teal shadow-[0_0_20px_rgba(45,212,191,0.15)]' : 'border-white/10'} relative overflow-hidden transition-all hover:bg-white/10`}
                    >
                      {isSafest && (
                        <div className="absolute top-0 right-0 bg-brand-teal text-brand-dark px-4 py-1 text-xs font-bold rounded-bl-xl">
                          SAFEST OPTION
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex-1 space-y-2">
                          <h3 className="font-bold text-lg text-white/90">{route.route_name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              {route.incident_count} Recent Incidents
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Shield className="w-4 h-4 text-brand-purple" />
                              {route.bounds_analyzed} Zones Analyzed
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${getSafetyScoreColor(route.safety_score)}`}>{route.safety_score}%</div>
                            <div className="text-xs uppercase tracking-wider text-white/40 font-bold">Safety Score</div>
                          </div>

                          <Button
                            onClick={() => handleViewDetails(route)}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold border ${getSafetyScoreBg(route.safety_score)}`}>
                        Risk Level: {route.risk_level}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}


          {/* Safety Tips */}
          <section className="container px-4">
            <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-purple/20 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-brand-purple" />
                </div>
                <h2 className="font-display text-xl font-bold text-white">
                  Smart Travel Tips
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {safetyTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-black/20 rounded-2xl border border-white/5"
                  >
                    <div className="w-6 h-6 bg-brand-teal/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-brand-teal">{index + 1}</span>
                    </div>
                    <p className="text-sm text-white/70">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
        <Footer />

        {/* Incident Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-brand-dark/95 backdrop-blur-xl border-white/10 text-white max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">

            <DialogHeader className="p-6 border-b border-white/10 bg-black/20 shrink-0">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Safety Incidents
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Reported incidents along {selectedRoute?.route_name ? `"${selectedRoute.route_name.substring(0, 30)}..."` : 'the route'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {incidents.length > 0 ? (
                incidents.map((incident, idx) => (
                  <div key={`${incident.id}-${idx}`} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-brand-teal">{incident.categories || 'Uncategorized Incident'}</h4>
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded bg-black/20">{incident.incident_date}</span>
                    </div>
                    <p className="text-sm text-white/80 mb-3 leading-relaxed">{incident.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {incident.area}, {incident.city}
                      </div>
                      {(incident.time_from !== '00:00:00') && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {incident.time_from}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                !loadingIncidents && <div className="text-center py-10 text-white/40">No details available for incidents on this route.</div>
              )}

              {loadingIncidents && (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loadingIncidents && selectedRoute && selectedRoute.incident_ids && displayedIncidentCount < selectedRoute.incident_ids.length && (
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5 text-white"
                  onClick={() => selectedRoute && loadMoreIncidents(selectedRoute, displayedIncidentCount)}
                >
                  Load More Incidents
                </Button>
              )}
            </div>

          </DialogContent>
        </Dialog>

      </div>
    </>
  );
};

export default CheckRoute;