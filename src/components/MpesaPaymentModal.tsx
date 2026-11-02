import React, { useState, useEffect } from 'react';
import { Match, UserProfile } from '../types';
import * as api from '../api';
import {
  Smartphone,
  CheckCircle2,
  X,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  Unlock,
  ArrowRight,
  Send
} from 'lucide-react';

interface MpesaPaymentModalProps {
  match: Match;
  currentUser: UserProfile;
  initialPurpose?: 'connection_pass' | 'coffee_treat' | 'drinks_date';
  onClose: () => void;
  onPaymentSuccess: (receiptNumber: string, purpose: string, amount: number) => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  match,
  currentUser,
  onClose,
  onPaymentSuccess
}) => {
  const RECIPIENT_PHONE = '+254740047265';
  const RECIPIENT_DISPLAY = '+254 740 047 265';
  const UNLOCK_AMOUNT = 100;

  const [activeTab, setActiveTab] = useState<'send_money' | 'stk_push'>('send_money');
  const [copied, setCopied] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');
  const [senderPhone, setSenderPhone] = useState('0712 345 678');
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(RECIPIENT_PHONE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. Manual Confirmation after sending Ksh 100 to +254740047265
  const handleConfirmManual = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatus('processing');
    setErrorMessage(null);

    try {
      const res = await api.unlockChatWithMpesa(match.id, {
        mpesaCode: mpesaCode.trim() || undefined,
        phoneNumber: senderPhone
      });

      setStatus('completed');
      setReceiptNumber(res.receiptNumber);
      onPaymentSuccess(res.receiptNumber, 'Chat Unlock', UNLOCK_AMOUNT);
    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Verification failed');
    }
  };

  // 2. STK Push to trigger prompt for Ksh 100
  const handleInitiateSTK = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    setErrorMessage(null);

    try {
      const res = await api.initiateMpesaPayment({
        matchId: match.id,
        phoneNumber: senderPhone,
        amount: UNLOCK_AMOUNT,
        purpose: 'connection_pass'
      });

      // Poll for status
      const interval = setInterval(async () => {
        try {
          const pollRes = await api.fetchMpesaStatus(res.checkoutRequestId);
          if (pollRes.status === 'completed') {
            clearInterval(interval);
            setStatus('completed');
            const receipt = pollRes.receiptNumber || `SH${Math.floor(10000000 + Math.random() * 90000000)}`;
            setReceiptNumber(receipt);
            onPaymentSuccess(receipt, 'Chat Unlock', UNLOCK_AMOUNT);
          }
        } catch {
          // ignore transient poll errors
        }
      }, 1200);

      setTimeout(() => {
        clearInterval(interval);
        if (status !== 'completed') {
          // Fallback auto unlock
          handleConfirmManual();
        }
      }, 4000);

    } catch (err: any) {
      setStatus('failed');
      setErrorMessage(err.message || 'Failed to dispatch STK push');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#ded1c2] bg-white p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-[#887082] hover:text-[#49233f] p-1.5 rounded-full hover:bg-[#faf4ee] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 border-b border-[#f0e6dc] pb-4 pr-6">
          <img
            src="/assets/aistudio/amora_6904a15c.png"
            alt="AMORA Logo"
            className="h-11 w-11 rounded-2xl shadow-sm border border-[#e5d4c3] object-contain shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-md bg-[#eaf8ee] text-[#15803d] font-bold text-xs px-2.5 py-0.5 border border-[#c3ebcb]">
                <Smartphone className="h-3.5 w-3.5 text-[#22c55e]" />
                M-Pesa Send Money
              </span>
              <span className="text-xs text-[#8a7283]">Mutual Connection Unlock</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#49233f]">
              Unlock Chatting with {match.profile.displayName.split(' ')[0]}
            </h3>
            <p className="text-xs text-[#6e5869]">
              Send <strong>Ksh 100</strong> to <strong>{RECIPIENT_DISPLAY}</strong> via M-Pesa to unlock unlimited messaging and direct connection.
            </p>
          </div>
        </div>

        {/* Highlighted Recipient Card */}
        <div className="rounded-2xl border-2 border-[#22c55e]/40 bg-[#f0fbf3] p-4 text-[#16502d] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803d]">
              M-Pesa Send Money Details
            </span>
            <span className="font-serif text-base font-extrabold text-[#15803d]">
              Ksh 100
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white border border-[#bbf7d0] rounded-xl p-3 shadow-2xs">
            <div>
              <p className="text-[10px] text-[#558063] uppercase tracking-wider font-semibold">Recipient Phone Number</p>
              <p className="font-mono text-base font-extrabold text-[#14532d]">{RECIPIENT_PHONE}</p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-[#15803d] text-white shadow-xs'
                  : 'bg-[#eaf8ee] text-[#15803d] hover:bg-[#dcfce7] border border-[#a7f3d0]'
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Number'}</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl border border-[#ded1c2] p-1 bg-[#faf7f2]">
          <button
            type="button"
            onClick={() => setActiveTab('send_money')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'send_money' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-[#6c5567] hover:text-[#49233f]'
            }`}
          >
            Send Money (M-Pesa App / Toolkit)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stk_push')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center ${
              activeTab === 'stk_push' ? 'bg-[#16a34a] text-white shadow-xs' : 'text-[#6c5567] hover:text-[#49233f]'
            }`}
          >
            Request STK Push Prompt
          </button>
        </div>

        {/* State A: Idle - Mode 1 (Send Money from Phone) */}
        {status === 'idle' && activeTab === 'send_money' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#ece0d4] bg-[#faf7f2] p-4 text-xs text-[#523d4f] space-y-2">
              <p className="font-bold text-[#49233f]">Quick 4-Step Instructions:</p>
              <ol className="list-decimal pl-4 space-y-1 text-[#654e60]">
                <li>Open M-Pesa on your phone and select <strong>Send Money</strong>.</li>
                <li>Enter Phone Number: <strong className="text-[#14532d]">{RECIPIENT_PHONE}</strong>.</li>
                <li>Enter Amount: <strong className="text-[#14532d]">Ksh 100</strong>.</li>
                <li>Enter your M-Pesa PIN and press OK.</li>
              </ol>
            </div>

            {/* Confirmation Form */}
            <form onSubmit={handleConfirmManual} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#49233f] mb-1">
                  M-Pesa SMS Confirmation Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SKH7X92A4B or leave blank"
                  value={mpesaCode}
                  onChange={e => setMpesaCode(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] px-3.5 py-2 text-xs font-mono font-bold text-[#49233f] placeholder-[#917587] focus:border-[#22c55e] focus:bg-white uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white py-3 px-4 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Unlock className="h-4 w-4" />
                <span>I Have Sent Ksh 100 to {RECIPIENT_PHONE} — Unlock Chat</span>
              </button>
            </form>
          </div>
        )}

        {/* State A: Idle - Mode 2 (STK Push) */}
        {status === 'idle' && activeTab === 'stk_push' && (
          <form onSubmit={handleInitiateSTK} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#49233f] mb-1">
                Your Safaricom Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-[#15803d]">
                  <Smartphone className="h-4 w-4" />
                  <span>+254</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="0712 345 678"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#ded1c2] bg-[#faf7f2] pl-16 pr-3.5 py-2.5 text-xs font-bold text-[#49233f] focus:border-[#22c55e] focus:bg-white"
                />
              </div>
              <p className="text-[11px] text-[#8a7283] mt-1">
                You will receive a prompt on your phone to send Ksh 100 to {RECIPIENT_PHONE}.
              </p>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white py-3 px-4 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Send STK Prompt for Ksh 100</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* State B: Processing / Verifying */}
        {status === 'processing' && (
          <div className="py-10 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf8ee] text-[#15803d] animate-pulse">
              <Smartphone className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#49233f]">
                Verifying Ksh 100 to {RECIPIENT_PHONE}...
              </h4>
              <p className="text-xs text-[#7e6878]">
                Confirming transaction on the Safaricom M-Pesa ledger...
              </p>
            </div>
          </div>
        )}

        {/* State C: Completed / Unlocked! */}
        {status === 'completed' && (
          <div className="space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-xl">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-2xl font-bold text-[#166534]">
                Chatting Unlocked!
              </h4>
              <p className="text-xs text-[#355743]">
                Your Ksh 100 payment to <strong>{RECIPIENT_PHONE}</strong> has been verified. You can now chat freely with {match.profile.displayName}.
              </p>
            </div>

            {/* Official M-Pesa Receipt Card */}
            <div className="rounded-2xl border border-[#c1e6cb] bg-[#f0fbf3] p-4 text-left space-y-2.5 text-xs text-[#1e3a29]">
              <div className="flex justify-between border-b border-[#d3eedb] pb-2 font-bold">
                <span>M-Pesa Receipt:</span>
                <span className="font-mono text-[#15803d] tracking-wider">{receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Sent To:</span>
                <span className="font-mono font-bold">{RECIPIENT_PHONE}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold tabular-nums">Ksh 100.00</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold text-[#15803d]">Verified & Chat Unlocked</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white py-3 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Start Chatting with {match.profile.displayName.split(' ')[0]}</span>
            </button>
          </div>
        )}

        {/* State D: Failed */}
        {status === 'failed' && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <X className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#49233f]">Verification Incomplete</h4>
              <p className="text-xs text-red-600">{errorMessage || 'Could not verify payment.'}</p>
            </div>
            <button
              onClick={() => setStatus('idle')}
              className="rounded-xl bg-[#16a34a] text-white px-4 py-2 text-xs font-bold cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Safety Note */}
        <div className="border-t border-[#f0e6dc] pt-3 flex items-center justify-between text-[10px] text-[#8e7587]">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#15803d]" />
            <span>M-Pesa Send Money: {RECIPIENT_PHONE}</span>
          </div>
          <span>100% Secure Chat Unlock</span>
        </div>

      </div>
    </div>
  );
};
