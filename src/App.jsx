import React, { useState } from 'react';
import { 
  QrCode, Star, AlertTriangle, CheckCircle, Search, 
  MapPin, ShieldAlert, Clock, ArrowRight, Upload, 
  Droplets, Wind, Sparkles, PhoneCall, RefreshCw
} from 'lucide-react';

const INITIAL_TOILETS = [
  {
    id: "GZB-IND-01",
    name: "Swachh Suvidha Kendra - Shipra Mall Gate 2",
    area: "Indirapuram",
    address: "Opposite Shipra Mall, Vaibhav Khand, Indirapuram, Ghaziabad",
    rating: 4.1,
    reviewsCount: 142,
    cleanliness: "Good",
    status: "Operational",
    openTickets: 1,
    lastCleaned: "40 mins ago",
    caretakerPhone: "+91 98765 43210"
  },
  {
    id: "GZB-IND-02",
    name: "Public Sanitation Complex - Kala Patthar Marg",
    area: "Indirapuram",
    address: "Near Kala Patthar Road, Nyay Khand 2, Indirapuram",
    rating: 2.8,
    reviewsCount: 89,
    cleanliness: "Needs Urgent Attention",
    status: "Maintenance Due",
    openTickets: 4,
    lastCleaned: "4 hours ago",
    caretakerPhone: "+91 98765 43211"
  },
  {
    id: "GZB-VSH-01",
    name: "Metro Station Public Toilet - Vaishali Sector 4",
    area: "Vaishali",
    address: "Vaishali Metro Pillar 118, Sector 4, Ghaziabad",
    rating: 3.6,
    reviewsCount: 230,
    cleanliness: "Fair",
    status: "Operational",
    openTickets: 2,
    lastCleaned: "1.5 hours ago",
    caretakerPhone: "+91 98765 43212"
  },
  {
    id: "GZB-VAS-01",
    name: "Community Toilet Block - Vasundhara Sector 10",
    area: "Vasundhara",
    address: "Near Atal Chowk, Sector 10, Vasundhara, Ghaziabad",
    rating: 4.4,
    reviewsCount: 65,
    cleanliness: "Excellent",
    status: "Operational",
    openTickets: 0,
    lastCleaned: "20 mins ago",
    caretakerPhone: "+91 98765 43213"
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

  // Issues list
  const ISSUE_OPTIONS = [
    { id: 'water', label: 'No Water / Taps Dry', icon: Droplets, urgent: true },
    { id: 'smell', label: 'Severe Foul Smell', icon: Wind, urgent: false },
    { id: 'dirty', label: 'Dirty / Unhygienic Floor', icon: Sparkles, urgent: false },
    { id: 'flush', label: 'Broken Flush', icon: AlertTriangle, urgent: false },
    { id: 'lighting', label: 'No Electricity / Dark', icon: AlertTriangle, urgent: false },
    { id: 'lock', label: 'Broken Door / Lock', icon: ShieldAlert, urgent: true }
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
      alert("Kripya star rating select karein!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `GZB-${Math.floor(1000 + Math.random() * 9000)}`;
      const isUrgent = rating <= 2 || selectedIssues.some(i => i === 'water' || i === 'lock');
      
      setSubmittedTicket({
        id: ticketId,
        toiletName: selectedToilet.name,
        area: selectedToilet.area,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Top Navbar */}
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-emerald-800 p-1.5 rounded-lg font-bold text-xs">GNN</span>
            <div>
              <h1 className="text-base font-bold leading-tight">Swachh Ghaziabad</h1>
              <p className="text-[11px] text-emerald-100">Nagar Nigam Toilet Escalation Portal</p>
            </div>
          </div>
          
          <div className="flex space-x-1 bg-emerald-800/80 p-1 rounded-lg text-xs">
            <button 
              onClick={() => { setView('scan'); setSubmittedTicket(null); }}
              className={`px-3 py-1.5 rounded-md font-medium transition ${view === 'scan' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              QR Report
            </button>
            <button 
              onClick={() => setView('search')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${view === 'search' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              Search Area
            </button>
            <button 
              onClick={() => setView('admin')}
              className={`px-3 py-1.5 rounded-md font-medium transition ${view === 'admin' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}>
              Authority Desk
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-xl mx-auto px-4 mt-5">
        
        {/* VIEW 1: CITIZEN QR REPORT FORM */}
        {view === 'scan' && (
          <div>
            {submittedTicket ? (
              <div className="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Shikayat Darj Ho Gayi!</h2>
                <p className="text-xs text-slate-500 mt-1">Grievance Escalated to Ghaziabad Nagar Nigam</p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-5 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ticket ID:</span>
                    <span className="font-bold font-mono text-emerald-700">{submittedTicket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-slate-800">{submittedTicket.toiletName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Priority Level:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${submittedTicket.isUrgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {submittedTicket.isUrgent ? 'CRITICAL (Immediate Action)' : 'Standard Queue'}
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
                  className="w-full bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-800 transition">
                  Doosra Feedback De
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Active Toilet Header */}
                <div className="bg-emerald-50 border-b border-emerald-100 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        Scanned via QR Code
                      </span>
                      <h2 className="text-base font-bold text-slate-900 mt-1">{selectedToilet.name}</h2>
                      <p className="text-xs text-slate-600 flex items-center mt-0.5">
                        <MapPin size={13} className="mr-1 text-emerald-600 flex-shrink-0" />
                        {selectedToilet.address}
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowPosterModal(true)}
                      className="text-xs bg-white border border-emerald-300 text-emerald-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-50">
                      <QrCode size={14} /> Poster
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-5">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      1. Swachhata Rating (Cleanliness)
                    </label>
                    <div className="flex items-center justify-center space-x-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
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
                    {rating > 0 && (
                      <p className="text-center text-xs font-semibold text-slate-600 mt-1.5">
                        {rating <= 2 ? "⚠️ Bahut Kharab (Immediate Escalation)" : rating === 3 ? "Theek Thaak (Needs Cleaning)" : "Saaf Suthra (Good Condition)"}
                      </p>
                    )}
                  </div>

                  {/* Issue Tags */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      2. Kya Samasya Hai? (Select Issues)
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
                            <item.icon size={16} className={isSelected ? 'text-emerald-700' : 'text-slate-400'} />
                            <span className="truncate">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photo Upload Simulation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      3. Live Photo Upload (Proof for Authority)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {photoPreview ? (
                        <div className="flex items-center space-x-3">
                          <img src={photoPreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                          <div className="text-left">
                            <p className="text-xs font-semibold text-emerald-700">Photo Attached</p>
                            <p className="text-[10px] text-slate-500">Tap to change image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-1">
                          <Upload size={20} className="text-slate-400 mb-1" />
                          <p className="text-xs text-slate-600 font-medium">Click to capture / attach photo</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Remarks */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      4. Any Other Feedback
                    </label>
                    <textarea 
                      rows="2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="E.g., Flush kaam nahi kar raha hai, paani nahi aa raha..."
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-800 transition flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Sending to Municipal Officers...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit & Escalate to Nagar Nigam</span>
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
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Filter by Ghaziabad Ward / Area:</label>
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {['All', 'Indirapuram', 'Vaishali', 'Vasundhara'].map(area => (
                  <button
                    key={area}
                    onClick={() => setSearchArea(area)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                      searchArea === area 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredToilets.map(toilet => (
                <div key={toilet.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                        {toilet.id}
                      </span>
                      <div className="flex items-center text-amber-500 font-bold text-xs">
                        <Star size={14} className="fill-amber-400 mr-1" />
                        {toilet.rating} / 5
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mt-1">{toilet.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                      <MapPin size={12} className="mr-1 text-emerald-600 flex-shrink-0" />
                      {toilet.address}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">Last cleaned: {toilet.lastCleaned}</span>
                    <button 
                      onClick={() => {
                        setSelectedToilet(toilet);
                        setView('scan');
                        setSubmittedTicket(null);
                      }}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-3 py-1 rounded-lg hover:bg-emerald-100 transition">
                      Scan / Report This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: AUTHORITY DASHBOARD */}
        {view === 'admin' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase">
                Official Escalation Desk
              </span>
              <h2 className="text-base font-bold text-slate-800 mt-1">Ghaziabad Municipal Monitoring Desk</h2>
              <p className="text-xs text-slate-500">Real-time grievances received from citizen QR scans</p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-red-700">TKT-8912 • Kala Patthar Marg</span>
                  <span className="text-red-600 bg-white px-1.5 py-0.5 rounded border border-red-200">Critical Priority</span>
                </div>
                <p className="text-slate-700">Issues: No Water, Dirty Floor | Rating: 1 Star</p>
                <p className="text-slate-500 text-[10px]">Reported 12 mins ago by Citizen</p>
                <div className="pt-2 flex gap-2">
                  <button className="bg-red-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold">Dispatch Squad</button>
                  <button className="bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded text-[11px]">Mark Resolved</button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-amber-800">TKT-8904 • Shipra Mall Gate 2</span>
                  <span className="text-amber-700 bg-white px-1.5 py-0.5 rounded border border-amber-200">Normal</span>
                </div>
                <p className="text-slate-700">Issues: Severe Foul Smell | Rating: 2 Stars</p>
                <p className="text-slate-500 text-[10px]">Reported 45 mins ago</p>
                <div className="pt-2 flex gap-2">
                  <button className="bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold">Action Taken</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Code Poster Modal for Professor Demo */}
      {showPosterModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-sm w-full rounded-2xl p-5 text-center shadow-xl border">
            <h3 className="font-bold text-slate-800 text-base">Demo Poster for Professor</h3>
            <p className="text-xs text-slate-500 mt-1">Scan directly with phone camera to test:</p>
            
            <div className="my-4 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col items-center">
              {/* Dynamic QR Code from QuickChart */}
              <img 
                src={`https://quickchart.io/qr?text=https://swachh-ghaziabad.vercel.app?toilet=${selectedToilet.id}&size=200`}
                alt="QR Code" 
                className="w-40 h-40 rounded-lg shadow-sm bg-white p-2 border"
              />
              <p className="text-xs font-bold text-slate-800 mt-2">{selectedToilet.name}</p>
              <p className="text-[11px] text-slate-500">ID: {selectedToilet.id} • {selectedToilet.area}</p>
            </div>

            <button 
              onClick={() => setShowPosterModal(false)}
              className="w-full bg-slate-800 text-white py-2 rounded-xl text-xs font-semibold hover:bg-slate-900">
              Close Poster
            </button>
          </div>
        </div>
      )}
    </div>
  );
}