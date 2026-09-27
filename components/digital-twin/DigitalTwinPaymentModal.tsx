"use client";

import React, { useState } from 'react';
import { useResort } from '../../context/ResortContext';
import { Room } from '../../types/resort';
import { 
  X, ShieldCheck, Lock, CreditCard, Smartphone, CheckCircle2, 
  Sparkles, ArrowRight, Loader2, QrCode, Key, Building2, Calendar, DollarSign
} from 'lucide-react';
import { dispatchResortAlert } from '@/lib/store/resort-store';

interface PaymentModalProps {
  room: Room | null;
  onClose: () => void;
}

export const DigitalTwinPaymentModal: React.FC<PaymentModalProps> = ({ room, onClose }) => {
  const { assignRoom, selectedGuest, addNotification } = useResort();

  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NET_BANKING' | 'POINTS'>('CARD');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState<string>(selectedGuest.name || 'Rahul Sharma');
  const [expiry, setExpiry] = useState<string>('09/28');
  const [cvv, setCvv] = useState<string>('•••');
  const [upiId, setUPIId] = useState<string>('rahul@okaxis');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!room) return null;

  const nightlyPrice = room.price;
  const nights = selectedGuest.stayNights || 2;
  const subtotal = nightlyPrice * nights;
  const taxes = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + taxes;

  const handlePayAndBook = () => {
    setIsProcessing(true);

    setTimeout(async () => {


      
      const customerName = selectedGuest.name || "A customer";

      // Update room state in context (which also adds state and notifications)
      const booked = await assignRoom(room.id, customerName);
      setIsProcessing(false);
      if (!booked) return;
      setIsSuccess(true);
      
      // 1. Guest Notification
      addNotification(
        'Booking Successful!',
        `Your booking has been successful! Room ${room.roomNumber} (${room.type}) has been reserved for you.`,
        'success'
      );

      // 2. Manager Notification
      addNotification(
        'Manager Notification',
        `${customerName} has booked Room ${room.roomNumber} of the hotel.`,
        'info'
      );

      // 3. Manager Alert in Resort Store (navbar notification bell & alerts list)
      try {
        dispatchResortAlert({
          type: "BOOKING",
          severity: "INFO",
          title: "New Room Booking",
          message: `${customerName} has booked Room ${room.roomNumber} of the hotel.`,
          actionUrl: "/digital-twin",
        });
      } catch (err) {
        console.error(err);
      }
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl glass-panel border border-emerald-500/50 rounded-3xl p-6 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200 bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                256-Bit SSL Encrypted Payment Gateway
              </span>
            </div>
            <h3 className="text-xl font-black text-white glow-text">
              Reserve & Book Room {room.roomNumber}
            </h3>
            <p className="text-xs text-slate-400">
              {room.type} • Floor {room.floor} • {room.view} • {selectedGuest.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* SUCCESS BOOKING CONFIRMATION PASS */
          <div className="py-6 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                Booking Confirmed & Room Reserved!
              </span>
              <h4 className="text-2xl font-black text-white">
                Payment Successful: ₹{totalAmount.toLocaleString()}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Transaction ID: <span className="font-mono text-slate-200">TXN-360-{Math.floor(100000 + Math.random() * 900000)}</span>. Digital Key & QR pass generated.
              </p>
            </div>

            {/* Digital Key Card Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-500/40 text-left max-w-md mx-auto shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  <span className="font-extrabold text-sm text-white">Smart Resort Digital Room Key</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Guest Name</span>
                  <span className="font-bold text-slate-100">{selectedGuest.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Room Number</span>
                  <span className="font-black text-blue-400 font-mono text-base">ROOM {room.roomNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Nights</span>
                  <span className="font-bold text-slate-100">{nights} Nights</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
            >
              Back to 3D Digital Twin
            </button>
          </div>
        ) : isProcessing ? (
          /* PROCESSING SCREEN */
          <div className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-white">Verifying Payment & Lock Security...</h4>
            <p className="text-xs text-slate-400">Communicating with bank authorization gateway & updating 3D Digital Twin state.</p>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="space-y-5 mt-4">
            {/* Price Breakdown Banner */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Room Rate ({room.type} × {nights} Nights)</span>
                <span className="font-bold text-slate-200">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Taxes & Luxury Resort Fees (18% GST)</span>
                <span className="font-bold text-slate-200">₹{taxes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Total Amount Payable</span>
                <span className="text-amber-400 font-mono text-base">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    paymentMethod === 'CARD' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit / Debit</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    paymentMethod === 'UPI' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>UPI / GPay</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('POINTS')}
                  className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    paymentMethod === 'POINTS' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Loyalty Points</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            {paymentMethod === 'CARD' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-[11px] text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : paymentMethod === 'UPI' ? (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Enter VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUPIId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  placeholder="name@upi"
                />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                You have <strong>14,500 VIP Loyalty Points</strong> available. 10,000 points will be applied to cover this booking.
              </div>
            )}

            {/* Action Trigger */}
            <div className="pt-2">
              <button
                onClick={handlePayAndBook}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{totalAmount.toLocaleString()} & Confirm Reservation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
