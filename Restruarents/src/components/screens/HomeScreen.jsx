import React, { useState } from 'react';
import {
  Tag,
  Wallet,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Truck,
} from 'lucide-react';
import { StatusBar } from '@/components/ui/StatusBar';
import { HomeIndicator } from '@/components/ui/HomeIndicator';
import { BEST_SELLERS, POPULAR_ORDERS } from '@/data/mockData';

export const HomeScreen = ({ onSelectDish, onLogout }) => {
  const [orders, setOrders] = useState(POPULAR_ORDERS);
  const [activeToast, setActiveToast] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const showToast = (message) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast(null);
    }, 2800);
  };

  const handleCancelOrder = (id, name) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o))
    );
    showToast(`Order for "${name}" cancelled`);
  };

  return (
    <div className="w-full h-full bg-[#FFFFFF] flex flex-col justify-between overflow-hidden font-sans select-none relative">
      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* Status Bar */}
        <StatusBar theme="dark" />

        <div className="px-5 pt-1 space-y-3.5">
          {/* Location Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                Current Locations
              </p>
              <div className="flex items-center gap-1 mt-0.5 group cursor-pointer">
                <span className="text-[13px] font-semibold text-gray-900 group-hover:text-[#FA5A2A] transition-colors">
                  Model Town, New Delhi
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-[11px] text-gray-400 hover:text-gray-700 font-medium px-2 py-1 rounded-md bg-gray-100"
              >
                Switch
              </button>
            )}
          </div>

          {/* Search bar & Action Badges */}
          <div className="flex items-center gap-2.5 pt-0.5">
            {/* Search/Name input card */}
            <div className="flex-1 h-11 bg-[#F5F6F8] rounded-xl px-3.5 flex items-center gap-2">
              <input
                type="text"
                defaultValue="Karan"
                placeholder="Search..."
                className="bg-transparent text-[14px] font-medium text-gray-800 outline-none w-full placeholder:text-gray-400"
              />
            </div>

            {/* Orange Gradient Offer/Discount Button */}
            <button
              type="button"
              onClick={() => showToast('Discounts & Offers applied! 🎉')}
              className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FFA07A] to-[#FA5A2A] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
              title="Offers & Rewards"
            >
              <Tag className="w-5 h-5 -rotate-45" />
            </button>

            {/* Blue Gradient Wallet Button */}
            <button
              type="button"
              onClick={() => showToast('Fastor Wallet Balance: ₹450.00')}
              className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#5DA7FF] to-[#3B82F6] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
              title="Fastor Wallet"
            >
              <Wallet className="w-5 h-5" />
            </button>
          </div>

          {/* Section: Best Seller */}
          <div className="pt-1">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight mb-2.5">
              Best Seller
            </h2>

            {/* Horizontal Food Slider (Exact 72x108 card aspect ratio) */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {BEST_SELLERS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectDish(item.id)}
                  className="flex-shrink-0 w-[72px] cursor-pointer group"
                >
                  <div className="relative w-[72px] h-[108px] rounded-2xl overflow-hidden bg-gray-100 shadow-xs border border-black/5 group-hover:scale-102 transition-transform">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Exact Price Tag Pill Badge */}
                    <div className="absolute bottom-1 right-0 flex items-center justify-center">
                      {item.price === '$12.99' ? (
                        <div className="relative w-[38px] h-[16px]">
                          <img
                            src="/images/badge-1299.png"
                            alt="$12.99"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="bg-[#FA5A2A] text-white text-[9.5px] font-semibold px-1.5 py-0.5 rounded-l-full rounded-r-xs tracking-tight shadow-xs">
                          {item.price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Offer Banner (Using exact banner asset) */}
          <div className="pt-0.5">
            <div
              onClick={() => onSelectDish('pizza')}
              className="relative w-full h-[126px] rounded-2xl overflow-hidden cursor-pointer shadow-sm group hover:brightness-102 transition-all"
            >
              {/* Exact Figma Background Asset */}
              <img
                src="/images/banner-bg-pizza.png"
                alt="30% OFF Delicious New Dish"
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Exact Overlay Typography */}
              <div className="absolute inset-0 p-4 flex flex-col justify-center z-10 pointer-events-none">
                <p className="text-[12px] font-normal leading-snug text-white/95 max-w-[150px]">
                  Experience our
                  <br />
                  delicious new dish
                </p>
                <p className="mt-1 text-[23px] font-bold tracking-tight text-white drop-shadow-xs">
                  30% OFF
                </p>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="w-5 h-1 rounded-full bg-[#FA5A2A]" />
              <span className="w-1.5 h-1 rounded-full bg-gray-300" />
              <span className="w-1.5 h-1 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Section: Popular Items */}
          <div className="pt-1">
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight mb-2.5">
              Popular Items
            </h2>

            <div className="space-y-3">
              {orders.map((order) => {
                const isCancelled = order.status === 'cancelled';
                return (
                  <div
                    key={order.id}
                    className="p-2.5 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center gap-3"
                  >
                    {/* Item Thumbnail */}
                    <div
                      onClick={() => onSelectDish(order.id)}
                      className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Order Details & Actions */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          onClick={() => onSelectDish(order.id)}
                          className="text-[14px] font-semibold text-gray-900 truncate cursor-pointer hover:text-[#FA5A2A]"
                        >
                          {order.name}
                        </h3>
                        <span className="text-[14px] font-semibold text-[#FA5A2A]">
                          {order.price}
                        </span>
                      </div>

                      {/* Meta: Date & Items */}
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-0.5">
                        <span>{order.date}</span>
                        <span>{order.itemsCount}</span>
                      </div>

                      {/* Action Pill Buttons */}
                      <div className="flex items-center gap-2 mt-2">
                        {isCancelled ? (
                          <span className="text-[11px] font-medium text-red-500 py-1 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Order Cancelled
                          </span>
                        ) : (
                          <>
                            {/* Cancel Order Pill Button */}
                            <button
                              type="button"
                              onClick={() => handleCancelOrder(order.id, order.name)}
                              className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#FF5C50] text-white hover:bg-[#E0483C] active:scale-95 transition-all shadow-xs"
                            >
                              Cancel Order
                            </button>

                            {/* Track Driver Pill Button */}
                            <button
                              type="button"
                              onClick={() => setTrackingOrder(order)}
                              className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#FFF0ED] text-[#FF5A2A] hover:bg-[#FFE3DC] active:scale-95 transition-all"
                            >
                              Track Driver
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {activeToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white px-4 py-2 rounded-full text-[12px] font-medium shadow-xl flex items-center gap-2 backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{activeToast}</span>
        </div>
      )}

      {/* Driver Tracking Bottom Sheet Modal */}
      {trackingOrder && (
        <div className="absolute inset-0 bg-black/50 z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl animate-slide-up">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FA5A2A] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-900">Driver En Route</h4>
                  <p className="text-[11px] text-gray-500">Arriving in ~8 mins for {trackingOrder.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackingOrder(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-500">Delivery Partner</span>
                <span className="font-semibold text-gray-900">Rajesh Kumar (+91 98765 00012)</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-gray-500">Delivery to</span>
                <span className="font-semibold text-gray-900">Model Town, New Delhi</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mt-2">
                <div className="bg-[#FA5A2A] h-2 rounded-full w-3/4 animate-pulse" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTrackingOrder(null)}
              className="w-full py-2.5 bg-[#FA5A2A] text-white rounded-xl text-[13px] font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Home Indicator */}
      <HomeIndicator theme="dark" />
    </div>
  );
};

