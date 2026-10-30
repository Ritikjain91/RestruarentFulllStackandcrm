import React, { useState } from 'react';
import { ArrowLeft, Heart, CheckCircle2, ShoppingBag } from 'lucide-react';
import { StatusBar } from '@/components/ui/StatusBar';
import { HomeIndicator } from '@/components/ui/HomeIndicator';
import { PIZZA_PORTIONS } from '@/data/mockData';

export const DishDetailScreen = ({
  onBack,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(3);
  const [selectedPortionId, setSelectedPortionId] = useState('jumbo');
  const [isLiked, setIsLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const basePrice = 14.0;
  const currentPortion =
    PIZZA_PORTIONS.find((p) => p.id === selectedPortionId) || PIZZA_PORTIONS[3];
  const itemUnitPrice = basePrice;
  const totalPrice = (itemUnitPrice + currentPortion.priceDelta) * quantity;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    setToastMessage(`Added ${quantity}x Jumbo Pizza to cart!`);
    if (onAddToCart) {
      onAddToCart({
        portion: currentPortion.name,
        quantity,
        totalPrice,
      });
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between overflow-hidden font-sans select-none relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Top Header with Status Bar */}
        <div className="relative">
          <StatusBar theme="dark" />

          {/* Navigation Overlay */}
          <div className="px-5 py-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 -ml-1 flex items-center justify-center text-gray-800 hover:text-[#FA5A2A] transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[#FA5A2A] transition-colors"
              aria-label="Favorite"
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? 'fill-[#FA5A2A] text-[#FA5A2A]' : 'text-gray-600'
                }`}
              />
            </button>
          </div>

          {/* Large Hero Dish Image */}
          <div className="px-5 pt-1">
            <div className="relative w-full h-[220px] rounded-[24px] overflow-hidden bg-gray-100 shadow-md">
              <img
                src="/images/pizza.png"
                alt="Pepperoni Delight Pizza"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pt-5 pb-6">
          {/* Price & Quantity Stepper */}
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold text-[#FA5A2A] tracking-tight">
              ₹14.00
            </span>

            {/* Stepper: (-) 3 (+) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrease}
                className="w-6 h-6 rounded-full bg-[#FA5A2A] text-white flex items-center justify-center text-base font-bold shadow-xs active:scale-90 transition-transform cursor-pointer"
                aria-label="Decrease quantity"
              >
                –
              </button>
              <span className="text-[17px] font-bold text-gray-900 w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="w-6 h-6 rounded-full bg-[#FA5A2A] text-white flex items-center justify-center text-base font-bold shadow-xs active:scale-90 transition-transform cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Dish Title & Description */}
          <div className="mt-4">
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight leading-snug">
              Lorem ipsum dolor sit amet
            </h1>
            <p className="mt-1.5 text-[12px] text-gray-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore.
            </p>
          </div>

          {/* Personal Portion Section */}
          <div className="mt-6">
            <h2 className="text-[15px] font-bold text-gray-900 tracking-tight mb-3">
              Personal portion
            </h2>

            <div className="space-y-3.5">
              {PIZZA_PORTIONS.map((portion) => {
                const isSelected = selectedPortionId === portion.id;
                return (
                  <div
                    key={portion.id}
                    onClick={() => setSelectedPortionId(portion.id)}
                    className="flex items-center justify-between cursor-pointer py-0.5 group"
                  >
                    <span className="text-[13px] text-gray-700 font-medium group-hover:text-gray-900">
                      {portion.name} ({portion.slides} Slides)
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-gray-600 font-normal">
                        ${portion.priceDelta.toFixed(2)}
                      </span>

                      {/* Custom Radio Button */}
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#FA5A2A]'
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#FA5A2A]" />
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

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full text-[12px] font-medium shadow-xl flex items-center gap-2 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Bottom Add to Cart CTA */}
      <div className="px-6 pt-2 pb-1 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full h-[50px] rounded-xl font-semibold text-[15px] text-white bg-[#FA5A2A] hover:bg-[#E84E20] shadow-md shadow-orange-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to cart
        </button>

        {/* Home Indicator */}
        <HomeIndicator theme="dark" />
      </div>
    </div>
  );
};

