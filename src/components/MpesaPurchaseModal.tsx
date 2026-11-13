import React, { useState } from 'react';
import { CreatorPost, ContentPurchase } from '../types';
import * as api from '../api';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Sparkles,
  Loader2
} from 'lucide-react';

interface MpesaPurchaseModalProps {
  post: CreatorPost | null;
  onClose: () => void;
  onPurchaseSuccess: (purchase: ContentPurchase, post: CreatorPost) => void;
}

export const MpesaPurchaseModal: React.FC<MpesaPurchaseModalProps> = ({
  post,
  onClose,
  onPurchaseSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('0740047265');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'prompt' | 'waiting' | 'success'>('prompt');
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!post) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);
    setStep('waiting');

    try {
      // Simulate real STK push delay
      const res = await api.purchaseContentItem(post.id, phoneNumber);

      setTimeout(() => {
        setIsProcessing(false);
        setReceiptNumber(res.receiptNumber);
        setStep('success');
        onPurchaseSuccess(res.purchase, res.postDetails || post);
      }, 2000);
    } catch (err: any) {
      setIsProcessing(false);
      setStep('prompt');
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-[#140618] border border-[#4a1844] text-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          disabled={isProcessing}
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'prompt' && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  M-Pesa One-Time Payment
                </span>
                <h3 className="font-serif text-xl font-bold text-white">Unlock Exclusive Content</h3>
              </div>
            </div>

            {/* Post Summary Card */}
            <div className="rounded-2xl bg-[#200926] border border-[#40123c] p-3.5 mb-5 flex items-center gap-3.5">
              <img
                src={post.previewUrl || post.mediaUrl}
                alt={post.title}
                className="h-16 w-16 rounded-xl object-cover border border-[#52184d] filter blur-xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#e4a0d2] truncate">
                  by {post.creatorProfile.displayName}
                </p>
                <h4 className="text-sm font-bold text-white truncate">{post.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 uppercase">{post.type}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-sm font-extrabold text-amber-300 font-mono">
                    KSh {post.priceKes}
                  </span>
                </div>
              </div>
            </div>

            {/* Sandbox Notice */}
            <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-200 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Daraja STK Sandbox Active</p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Test mode processes instant simulated unlocks to line <strong className="font-mono text-white">+254740047265</strong>. Live Safaricom production keys can be hooked via environment variables.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-xl bg-rose-500/20 border border-rose-500/40 p-3 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  M-Pesa Registered Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0740047265 or 254740047265"
                    className="w-full rounded-xl bg-[#0a020c] border border-[#4a1844] px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono placeholder:text-slate-600"
                    required
                  />
                  <span className="absolute right-3.5 top-3 text-[11px] text-emerald-400 font-semibold">
                    Kenya 🇰🇪
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  You will receive an STK Push PIN prompt on this mobile phone.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>Pay KSh {post.priceKes} with M-Pesa</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'waiting' && (
          <div className="py-8 text-center space-y-4">
            <div className="relative mx-auto h-16 w-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Lipa Na M-Pesa STK Dispatched</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Check your phone <span className="font-mono text-emerald-400">{phoneNumber}</span> and enter your M-Pesa PIN to complete payment of <span className="font-mono font-bold text-white">KSh {post.priceKes}</span>.
              </p>
            </div>

            <div className="w-full bg-[#200926] rounded-full h-2 overflow-hidden border border-[#40123c]">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-3/4 animate-pulse" />
            </div>

            <p className="text-[11px] text-slate-400">Verifying transaction with Safaricom Daraja...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Payment Verified!</h3>
              <p className="text-xs text-slate-300">
                Exclusive media has been unlocked and added to <strong className="text-white">My Purchases</strong>.
              </p>
            </div>

            {receiptNumber && (
              <div className="rounded-xl bg-[#200926] border border-[#4a1844] p-3 text-xs">
                <span className="text-slate-400">M-Pesa Receipt: </span>
                <span className="font-mono font-bold text-emerald-400">{receiptNumber}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#b64d70] to-[#db2777] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              View Unlocked Content
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
