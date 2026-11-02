import React, { useRef, useState, useEffect } from 'react';
import { UserProfile, VideoMedia } from '../types';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, UserPlus, MapPin, GraduationCap } from 'lucide-react';

interface VideoIntroModalProps {
  profile: UserProfile;
  video: VideoMedia;
  onClose: () => void;
  onConnect?: (profile: UserProfile) => void;
  hasPendingRequest?: boolean;
  isMatched?: boolean;
}

export const VideoIntroModal: React.FC<VideoIntroModalProps> = ({
  profile,
  video,
  onClose,
  onConnect,
  hasPendingRequest,
  isMatched
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked if unmuted
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#0d040f] border border-[#3b1233] shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-[#d946ef] to-[#ec4899] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Top Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-[#ec4899] animate-pulse" />
            <span>Video Introduction</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/10"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/10"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Video Element */}
        <div className="relative flex-1 bg-black flex items-center justify-center cursor-pointer min-h-[380px]" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={video.url}
            poster={video.posterUrl || profile.photos[0]?.url}
            className="w-full h-full object-cover max-h-[65vh]"
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="p-4 rounded-full bg-[#ec4899]/90 text-white shadow-lg transform hover:scale-110 transition-transform">
                <Play className="h-8 w-8 fill-current ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Profile Details Overlay */}
        <div className="p-4 bg-gradient-to-t from-black via-[#16061a] to-transparent text-white space-y-3 z-10 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                {profile.displayName}, {profile.age}
                {profile.isAvailable && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Available Now
                  </span>
                )}
              </h4>
              <p className="text-xs text-[#c8a6c3] flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#ec4899]" />
                {profile.university}
                {profile.distanceKm !== undefined && (
                  <span className="text-[#a882a2]">· ~{profile.distanceKm} km away</span>
                )}
              </p>
            </div>
          </div>

          {video.caption && (
            <p className="text-xs text-[#f1d7ec] bg-white/5 border border-white/10 rounded-xl p-2.5 leading-relaxed">
              "{video.caption}"
            </p>
          )}

          {/* Quick Connect CTA */}
          {onConnect && !isMatched && (
            <button
              onClick={() => {
                onClose();
                onConnect(profile);
              }}
              disabled={hasPendingRequest}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                hasPendingRequest
                  ? 'bg-white/10 text-stone-400 border border-white/10 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white hover:from-[#c25a7d] hover:to-[#ec4899] shadow-md shadow-[#db2777]/20 active:scale-95'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              {hasPendingRequest ? 'Request Pending' : 'Send Connection Request'}
            </button>
          )}

          {isMatched && (
            <div className="text-center py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs font-medium text-emerald-300">
              ✓ Mutually Connected · Chat Unlocked
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
