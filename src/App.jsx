import React, { useState, useEffect } from 'react';
import { 
  QrCode, Star, AlertTriangle, CheckCircle, Search, 
  MapPin, ShieldAlert, Upload, Droplets, Wind, Sparkles, 
  RefreshCw, ArrowRight, ExternalLink, Camera
} from 'lucide-react';

const INITIAL_TOILETS = [
  {
    id: "GZB-SNJ-01",
    name: "Swachh Bharat Public Toilet - Sanjay Nagar",
    area: "Sanjay Nagar",
    address: "Rani Jhansi Marg, J-Block, Block J, Sector 23, Sanjay Nagar, Ghaziabad, UP 201017",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    rating: 3.8,
    reviewsCount: 114,
    cleanliness: "Moderate",
    status: "Operational",
    openTickets: 1,
    lastCleaned: "35 mins ago",
    caretakerPhone: "+91 98102 34567"
  },
  {
    id: "GZB-NYG-01",
    name: "Nagar Nigam Suvidha Complex - Naya Ganj",
    area: "Naya Ganj",
    address: "6 B, Near IOCL & BPCL Petrol Pump, Pran Garhi, Old Bus Stand, Hapur Rd, Navyug Market, Naya Ganj, Ghaziabad",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80",
    rating: 3.2,
    reviewsCount: 168,
    cleanliness: "Needs Attention",
    status: "Operational",
    openTickets: 3,
    lastCleaned: "2 hours ago",
    caretakerPhone: "+91 98110 54321"
  },
  {
    id: "GZB-IND-01",
    name: "Public Toilet Complex - Shipra Mall",
    area: "Indirapuram",
    address: "Opposite Shipra Mall Gate 2, Vaibhav Khand, Indirapuram, Ghaziabad",
    image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80",
    rating: 4.2,
    reviewsCount: 142,
    cleanliness: "Good",
    status: "Operational",
    openTickets: 0,
    lastCleaned: "15 mins ago",
    caretakerPhone: "+91 98765 43210"
  },
  {
    id: "GZB-VSH-01",
    name: "Metro Sanitation Facility - Vaishali Sector 4",
    area: "Vaishali",
    address: "Vaishali Metro Pillar 118, Sector 4, Ghaziabad",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    rating: 3.6,
    reviewsCount: 230,
    cleanliness: "Fair",
    status: "Operational",
    openTickets: 2,
    lastCleaned: "1 hour ago",
    caretakerPhone: "+91 98765 43212"
  }
];

export default function App() {
  const [view, setView] = useState('scan'); // 'scan', 'search', 'admin'
  const [toilets] = useState(INITIAL_TOILETS);
  const [selectedToilet, setSelectedToilet] = useState(INITIAL_TOILETS[0]);
  const [searchArea, setSearchArea] = useState('All');
  
  // Feedback Form State
  const [rating, setRating] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [comment, setComment] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [showPosterModal, setShowPosterModal] = useState(false);

  // URL Query Param Check (Agar koi direct QR scan karke aaye)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toiletId = params.get('toilet');
    if (toiletId) {
      const found = INITIAL_TOILETS.find(t => t.id.toLowerCase() === toiletId.toLowerCase());
      if (found) {
        setSelectedToilet(found);
        setView('scan');
      }
    }
  }, []);

  const ISSUE_OPTIONS = [
    { id: 'water', label: 'No Water / Taps Dry', icon: Droplets, urgent: true },
    { id: 'smell', label: 'Foul Smell / Stink', icon: Wind, urgent: false },
    { id: 'dirty', label: 'Dirty / Muddy Floor', icon: Sparkles, urgent: false },
    { id: 'flush', label: 'Broken Flush', icon: AlertTriangle, urgent: false },
    { id: 'light', label: 'Dark / No Light', icon: AlertTriangle, urgent: false },
    { id: 'lock', label: 'Door Lock Broken', icon: ShieldAlert, urgent: true }
  ];

  const handleIssueToggle = (id) => {
    setSelectedIssues(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Kripya cleanliness rating (stars) select karein!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `GZB-${Math.floor(1000 + Math.random() * 9000)}`;
      const isUrgent = rating <= 2 || selectedIssues.includes('water') || selectedIssues.includes('lock');
      
      setSubmittedTicket({
        id: ticketId,
        toiletName: selectedToilet.name,
        address: selectedToilet.address,
        rating,
        issues: selectedIssues,
        isUrgent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setIsSubmitting(false);
    }, 800);
  };

  const filteredToilets = searchArea === 'All' 
    ? toilets 
    : toilets.filter(t => t.area.toLowerCase() === searchArea.toLowerCase());

  // Current domain for QR link
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://swachh-ghaziabad.vercel.app';
  const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(`${currentDomain}?toilet=${selectedToilet.id}`)}&size=300`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      {/* Top Navbar */}
      <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-white text-emerald-800 font-black text-xs px-2 py-1 rounded shadow-sm">
              GNN
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Swachh Ghaziabad</h1>
              <p className="text-[10px] text-emerald-200">Public Toilet Feedback & Action Portal</p>
            </div>
          </div>
          
          <div className="flex space-x-1 bg-emerald-900/60 p-1 rounded-xl text-xs">
            <button 
              onClick={() => { setView('scan'); setSubmittedTicket(null); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${view === 'scan' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              Report
            </button>
            <button 
              onClick={() => setView('search')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${view === 'search' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              Directory
            </button>
            <button 
              onClick={() => setView('admin')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${view === 'admin' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              Nagar Nigam
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-4 mt-4">
        
        {/* VIEW 1: QR REPORT / FEEDBACK */}
        {view === 'scan' && (
          <div>
            {submittedTicket ? (
              <div className="bg-white border border-emerald-200 rounded-3xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={36} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Shikayat Darj Ho Gayi!</h2>
                <p className="text-xs text-slate-500 mt-1">Escalated to Ghaziabad Sanitation Officer</p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-5 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ticket ID:</span>
                    <span className="font-bold font-mono text-emerald-800">{submittedTicket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Toilet:</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[200px]">{submittedTicket.toiletName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Priority:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${submittedTicket.isUrgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {submittedTicket.isUrgent ? 'CRITICAL (Immediate Action)' : 'Normal Queue'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSubmittedTicket(null);
                    setRating(0);
                    setSelectedIssues([]);
                    setComment('');
                    setPhotoPreview(null);
                  }}
                  className="w-full bg-emerald-700 text-white py-3 rounded-2xl text-sm font-semibold hover:bg-emerald-800 transition">
                  Doosra Feedback Submit Karein
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                {/* Toilet Banner Photo + Details */}
                <div className="relative h-44 bg-slate-800">
                  <img 
                    src={selectedToilet.image} 
                    alt={selectedToilet.name} 
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          QR Verified • {selectedToilet.id}
                        </span>
                        <h2 className="text-base font-bold mt-1 text-white leading-tight">{selectedToilet.name}</h2>
                        <p className="text-xs text-slate-200 flex items-start mt-0.5 line-clamp-2">
                          <MapPin size={12} className="mr-1 text-emerald-400 flex-shrink-0 mt-0.5" />
                          {selectedToilet.address}
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowPosterModal(true)}
                        className="bg-white/90 backdrop-blur text-emerald-950 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm hover:bg-white flex-shrink-0 ml-2">
                        <QrCode size={14} /> QR Poster
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      1. Toilet Condition Rating
                    </label>
                    <div className="flex items-center justify-center space-x-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="transition hover:scale-110 focus:outline-none">
                          <Star 
                            size={32} 
                            className={star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Issues */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      2. Kya Problem Hai? (Select All That Apply)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ISSUE_OPTIONS.map((item) => {
                        const isSelected = selectedIssues.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleIssueToggle(item.id)}
                            className={`p-2.5 text-left rounded-xl border text-xs flex items-center space-x-2 transition ${
                              isSelected 
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' 
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}>
                            <item.icon size={15} className={isSelected ? 'text-emerald-700' : 'text-slate-400'} />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      3. Live Photo Evidence
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {photoPreview ? (
                        <div className="flex items-center space-x-3">
                          <img src={photoPreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl border" />
                          <div className="text-left">
                            <p className="text-xs font-semibold text-emerald-700">Photo Attached Successfully</p>
                            <p className="text-[10px] text-slate-500">Tap to change image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-2">
                          <Camera size={22} className="text-slate-400 mb-1" />
                          <p className="text-xs text-slate-600 font-medium">Click to take / upload photo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      4. Additional Comment
                    </label>
                    <textarea 
                      rows="2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Kuch aur batana ho (e.g. gate tuta hai, safai nahi hui...)"
                      className="w-full text-xs p-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Submit */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-emerald-800 transition flex items-center justify-center space-x-2 shadow-md">
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Escalating to Nagar Nigam...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit & Alert Authority</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SEARCH DIRECTORY */}
        {view === 'search' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
              <label className="block text-xs font-bold text-slate-600 mb-2">Filter by Area in Ghaziabad:</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {['All', 'Sanjay Nagar', 'Naya Ganj', 'Indirapuram', 'Vaishali'].map(area => (
                  <button
                    key={area}
                    onClick={() => setSearchArea(area)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                      searchArea === area 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredToilets.map(toilet => (
                <div key={toilet.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                  <div className="h-28 relative">
                    <img src={toilet.image} alt={toilet.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {toilet.id}
                    </span>
                    <span className="absolute top-2 right-2 bg-white/90 text-amber-600 font-bold text-xs px-2 py-0.5 rounded-full flex items-center shadow">
                      ★ {toilet.rating}
                    </span>
                  </div>
                  <div className="p-3.5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{toilet.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{toilet.address}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 text-[11px]">Cleaned: {toilet.lastCleaned}</span>
                      <button 
                        onClick={() => {
                          setSelectedToilet(toilet);
                          setView('scan');
                          setSubmittedTicket(null);
                        }}
                        className="bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-xl hover:bg-emerald-800 transition">
                        Select & Scan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: AUTHORITY DASHBOARD */}
        {view === 'admin' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Official Desk
              </span>
              <h2 className="text-base font-bold text-slate-800 mt-1">Ghaziabad Municipal Action Center</h2>
              <p className="text-xs text-slate-500">Live escalation queue from citizen QR scans</p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-red-700">TKT-7821 • Sanjay Nagar Sector 23</span>
                  <span className="text-red-600 bg-white px-1.5 py-0.5 rounded border border-red-200">Critical Priority</span>
                </div>
                <p className="text-slate-700 font-medium">Issue: No Water & Dirty Floor (Rating 1★)</p>
                <p className="text-slate-500 text-[10px]">Reported 10 mins ago via QR scan</p>
                <div className="pt-2 flex gap-2">
                  <button className="bg-red-700 text-white px-3 py-1 rounded-xl text-[11px] font-semibold">Dispatch Cleaning Squad</button>
                  <button className="bg-white border border-slate-300 text-slate-700 px-3 py-1 rounded-xl text-[11px]">Mark Resolved</button>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-amber-800">TKT-7809 • Naya Ganj (Navyug Market)</span>
                  <span className="text-amber-700 bg-white px-1.5 py-0.5 rounded border border-amber-200">Normal</span>
                </div>
                <p className="text-slate-700 font-medium">Issue: Broken Door Lock (Rating 2★)</p>
                <p className="text-slate-500 text-[10px]">Reported 35 mins ago</p>
                <div className="pt-2 flex gap-2">
                  <button className="bg-emerald-700 text-white px-3 py-1 rounded-xl text-[11px] font-semibold">Send Plumber/Carpenter</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Real QR Poster Modal for Professor Demo */}
      {showPosterModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center shadow-2xl border">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Nagar Nigam Official Poster
            </span>
            <h3 className="font-bold text-slate-900 text-base mt-1">Scan for Cleanliness Feedback</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Professor can scan directly with mobile camera</p>
            
            <div className="my-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col items-center">
              <img 
                src={qrUrl} 
                alt="QR Code" 
                className="w-48 h-48 rounded-xl shadow-md bg-white p-2 border"
              />
              <p className="text-xs font-bold text-slate-800 mt-3 text-center">{selectedToilet.name}</p>
              <p className="text-[11px] text-slate-500 text-center mt-1 leading-tight">{selectedToilet.address}</p>
            </div>

            <button 
              onClick={() => setShowPosterModal(false)}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-800">
              Close Poster
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

 