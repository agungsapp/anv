import React, { useState, useEffect, useRef } from 'react';
import { Heart, Clock3, Flame, Music, X } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showMessage, setShowMessage] = useState(false);
  const [petals, setPetals] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([]);
  const [showMusicPopup, setShowMusicPopup] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLate, setIsLate] = useState(false);
  const [lateCountdown, setLateCountdown] = useState(10);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set anniversary date to January 22, 2025
  const targetDate = new Date('2025-01-22T00:00:00');

  useEffect(() => {
    // Check if we're past the target date
    const now = new Date().getTime();
    const isPastDate = now > targetDate.getTime();
    setIsLate(isPastDate);

    // Create falling petals
    const createPetal = () => {
      const newPetal = {
        id: Date.now(),
        left: Math.random() * 100,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5
      };
      setPetals(prev => [...prev.slice(-50), newPetal]); // Keep max 50 petals
    };

    const petalInterval = setInterval(createPetal, 300);

    // Countdown timer
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setShowMessage(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(petalInterval);
    };
  }, []);

  // Late countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLate && lateCountdown > 0 && !showMessage) {
      timer = setInterval(() => {
        setLateCountdown((prev) => {
          if (prev <= 1) {
            setShowMessage(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLate, lateCountdown, showMessage]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // public/galeri/1.jpeg 
  // sampai 5.jpeg

  const photos = [
    "/galeri/1.jpeg",
    "/galeri/2.jpeg",
    "/galeri/3.jpeg",
    "/galeri/4.jpeg",
    "/galeri/5.jpeg",
    "/galeri/6.jpeg"
  ];
  

  return (
    <div className="min-h-screen bg-pink-50 relative overflow-hidden">
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/perfect.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Control Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-50 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
      >
        <Music className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
      </button>

      {/* Music Popup */}
      {showMusicPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto relative animate-fade-in">
            <button
              onClick={() => setShowMusicPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            {isLate ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">Yah telat dateng nih... 😅</h2>
                <p className="text-gray-600 mb-6">
                  Padahal tadi ada jam mundurnya... {lateCountdown > 0 && `(${lateCountdown})`}
                </p>
                <button
                  onClick={() => {
                    toggleMusic();
                    setShowMusicPopup(false);
                  }}
                  className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Music className="w-5 h-5" />
                  Yaudah maaf ya...
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">Halo Ayang! 💖</h2>
                <p className="text-gray-600 mb-6">
                  Hehe apa ya ini kira kira ? wkwk gedein aja lah speakernya
                </p>
                <button
                  onClick={() => {
                    toggleMusic();
                    setShowMusicPopup(false);
                  }}
                  className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                >
                  apa ya wkw
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Falling Petals */}
      {petals.map(petal => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animation: `fall ${petal.duration}s linear ${petal.delay}s forwards`
          }}
        >
          🌸
        </div>
      ))}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-600 p-4 sm:p-8 text-white text-center relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=1200')] bg-cover bg-center"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 flex flex-wrap items-center justify-center gap-2">
            <Heart className="text-pink-200 animate-float w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" />
            <span className="break-words">Happy 3rd Anniversary, Sayang!</span>
            <Heart className="text-pink-200 animate-float w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" />
          </h1>
          <p className="text-xl sm:text-2xl text-pink-100">Three Years of Love and Counting...</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        {/* Countdown Section */}
        {!isLate && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-8 mb-8 sm:mb-12">
            <div className="text-center mb-6">
              <Clock3 className="inline-block text-pink-500 mb-4" size={32} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Countdown to Our Special Day</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-pink-100 p-3 sm:p-6 rounded-lg shadow-inner">
                  <div className="text-2xl sm:text-4xl font-bold text-pink-600">{value}</div>
                  <div className="text-pink-500 capitalize text-sm sm:text-lg">{unit}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Late Countdown */}
        {isLate && lateCountdown > 0 && !showMessage && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-8 mb-8 sm:mb-12">
            <div className="text-center">
              <Clock3 className="inline-block text-pink-500 mb-4" size={32} />
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Tunggu sebentar ya...</h2>
              <div className="text-4xl sm:text-6xl font-bold text-pink-600 animate-pulse">
                {lateCountdown}
              </div>
            </div>
          </div>
        )}

        {/* Candles */}
        <div className="flex justify-center gap-4 mb-8 sm:mb-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative">
              <Flame 
                className="text-orange-500 animate-flicker" 
                size={24}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
              <div className="w-3 sm:w-4 h-12 sm:h-16 bg-pink-200 rounded-full mx-auto" />
            </div>
          ))}
        </div>

        {/* Anniversary Message */}
        {showMessage && (
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-8 mb-8 sm:mb-12">
            <div className="space-y-6 animate-message-appear">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line animate-message-line">
                Hai 😊, happy anniversary ke-3 tahun sayang 🎉❤️. Hehe maaf ya kalau masih banyak kurangnya dan minusnya 😅. Semoga sehat selalu ya, cah ayu 🌹. Makin sukses buat kita dan dimudahkan semua rencana ke depannya, aamiin 🤲.
              </p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line animate-message-line" style={{ animationDelay: '1s' }}>
                Hehe gapapa ya sekarang masih jarak jauh 🌏✈️, nanti pas ketemu kita rayain bareng-bareng 🥳🎂. Love youuu 😘❤️.
              </p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line animate-message-line" style={{ animationDelay: '2s' }}>
                Makasih sudah bertahan sejauh ini, menerima, dan jadi penyemangat 💪✨, selalu memberikan support. You are the best 🏆! Meski agak galak 😜, tapi di baliknya ada perhatian yang segede kebon 🌳💕 hahaha. Lop lop 🥰.
              </p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line animate-message-line" style={{ animationDelay: '3s' }}>
                Pokoknya jangan sering sedih ya 😔, I'm stay with you 🤗💖.
              </p>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-semibold text-pink-600 mb-4 sm:mb-6 text-center">Our Beautiful Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {photos.map((photo, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-105 aspect-[3/4]">
                <img
                  src={photo}
                  alt={`Our moment ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-6 sm:p-8 text-pink-600">
        <p className="text-base sm:text-lg">With all my love, forever and always ❤️</p>
      </footer>
    </div>
  );
}

export default App;