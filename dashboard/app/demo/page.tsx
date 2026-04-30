'use client';

import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ItemChip } from '../components/ItemChip';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type ViewState = 'idle' | 'loading' | 'results' | 'error' | 'empty';

export default function DemoPage() {
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [selectedItem, setSelectedItem] = useState(0);

  const detectedItems = [
    "Modern lamp",
    "Wooden furniture",
    "Throw pillows",
    "Wall art",
    "Plants"
  ];

  const productsByCategory = {
    "Modern lamp": [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1764837253468-023c1ed51fea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
        title: "Modern Black Lamp with Golden Interior",
        priceMin: 89,
        priceMax: 129
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
        title: "Contemporary Floor Lamp - Minimalist Design",
        priceMin: 145,
        priceMax: 199
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
        title: "Arc Floor Lamp with Marble Base",
        priceMin: 299,
        priceMax: 389
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&h=400&fit=crop",
        title: "Adjustable Desk Lamp - Brass Finish",
        priceMin: 79,
        priceMax: 119
      },
      {
        id: 5,
        image: "https://images.unsplash.com/photo-1565006041347-4f60e8a1fabe?w=400&h=400&fit=crop",
        title: "Tripod Floor Lamp - Wooden Legs",
        priceMin: 165,
        priceMax: 225
      }
    ],
    "Wooden furniture": [
      {
        id: 6,
        image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
        title: "Mid-Century Modern Armchair - Walnut Frame",
        priceMin: 459,
        priceMax: 699
      },
      {
        id: 7,
        image: "https://images.unsplash.com/photo-1624870701221-e61f079aad5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
        title: "Scandinavian Dining Table Set - White Oak",
        priceMin: 899,
        priceMax: 1299
      },
      {
        id: 8,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
        title: "Modern Coffee Table - Natural Wood",
        priceMin: 329,
        priceMax: 479
      },
      {
        id: 9,
        image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&h=400&fit=crop",
        title: "Storage Cabinet - Teak Wood Finish",
        priceMin: 549,
        priceMax: 789
      },
      {
        id: 10,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop",
        title: "Minimalist Bookshelf - Oak Construction",
        priceMin: 379,
        priceMax: 529
      }
    ],
    "Throw pillows": [
      {
        id: 11,
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop",
        title: "Velvet Throw Pillow Set - Sage Green",
        priceMin: 45,
        priceMax: 69
      },
      {
        id: 12,
        image: "https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=400&h=400&fit=crop",
        title: "Linen Cushion Cover Set - Neutral Tones",
        priceMin: 39,
        priceMax: 59
      },
      {
        id: 13,
        image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=400&h=400&fit=crop",
        title: "Geometric Pattern Pillows - Modern Design",
        priceMin: 49,
        priceMax: 79
      },
      {
        id: 14,
        image: "https://images.unsplash.com/photo-1617794990461-3a5369e4c062?w=400&h=400&fit=crop",
        title: "Faux Fur Throw Pillow - Cream White",
        priceMin: 55,
        priceMax: 89
      }
    ],
    "Wall art": [
      {
        id: 15,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop",
        title: "Abstract Canvas Print - Neutral Palette",
        priceMin: 89,
        priceMax: 149
      },
      {
        id: 16,
        image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=400&fit=crop",
        title: "Botanical Line Art Print Set - Framed",
        priceMin: 129,
        priceMax: 199
      },
      {
        id: 17,
        image: "https://images.unsplash.com/photo-1582561424760-0ff7a3d308c8?w=400&h=400&fit=crop",
        title: "Minimalist Photography Print - Black & White",
        priceMin: 79,
        priceMax: 119
      }
    ],
    "Plants": [
      {
        id: 18,
        image: "https://images.unsplash.com/photo-1658855999454-9f489a34855e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&h=400",
        title: "Modern Plant Stand with Potted Greenery",
        priceMin: 69,
        priceMax: 109
      },
      {
        id: 19,
        image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
        title: "Ceramic Planter Set - White Matte Finish",
        priceMin: 45,
        priceMax: 75
      },
      {
        id: 20,
        image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=400&fit=crop",
        title: "Hanging Planter - Macrame Design",
        priceMin: 35,
        priceMax: 55
      },
      {
        id: 21,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
        title: "Fiddle Leaf Fig Tree - Large Indoor Plant",
        priceMin: 89,
        priceMax: 149
      }
    ]
  };

  const products = productsByCategory[detectedItems[selectedItem] as keyof typeof productsByCategory] || [];

  const handleShopFrame = () => {
    setViewState('loading');
    setTimeout(() => {
      setViewState('results');
    }, 2000);
  };

  const handleTryAnother = () => {
    setViewState('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8eaff] via-[#f0f2ff] to-[#fef3f3] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-700 font-medium mb-8 hover:bg-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Try the Extension
          </h1>
          <p className="text-xl text-slate-600">
            Interact with Shop the Frame to see how it works
          </p>
        </div>

        {/* Demo Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Simulated YouTube Video */}
          <div className="flex-1 max-w-3xl">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-slate-400 text-sm">youtube.com/watch?v=example</span>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop"
                  alt="Video frame preview"
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/75 text-white text-sm px-3 py-1.5 rounded-lg">
                  ▶ Playing
                </div>
                <div className="absolute bottom-4 right-4 bg-black/75 text-white text-sm px-3 py-1.5 rounded-lg">
                  2:14 / 8:32
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Getting settled into my new NYC apartment (alone)
                </h2>
                <p className="text-slate-600 text-sm">
                  Watch as I set up my minimalist apartment with these amazing finds...
                </p>
              </div>
            </div>
          </div>

          {/* Extension Panel */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#0f0f0f] rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
              {/* Header */}
              <div className="p-5 border-b border-[#272727]">
                <div className="flex items-center gap-2.5 mb-1">
                  <img src="/shopping-logo-512x512.png" alt="" className="w-6 h-6 object-contain" />
                  <h1 className="text-lg font-semibold text-white">Shop the Frame</h1>
                </div>
                <p className="text-sm text-[#aaaaaa]">Powered by Gemini + YouTube Shopping</p>
              </div>

              {/* Scrollable Content */}
              <div className="max-h-[600px] overflow-y-auto">
                {/* Screenshot Preview */}
                <div className="p-5 pb-4">
                  <div className="relative rounded-xl overflow-hidden bg-[#272727]">
                    <img
                      src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop"
                      alt="Video frame preview"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-black/90 text-white text-xs font-medium px-2.5 py-1 rounded">
                      2:14
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="px-5 pb-5">
                  <button
                    onClick={handleShopFrame}
                    disabled={viewState === 'loading'}
                    className="w-full bg-gradient-to-r from-[#6B7FED] to-[#FF6B6B] hover:opacity-90 disabled:opacity-80 text-white py-2.5 px-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {viewState === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing frame…
                      </>
                    ) : (
                      'Shop the frame'
                    )}
                  </button>
                </div>

                {/* Detected Items Section */}
                {(viewState === 'results' || viewState === 'error') && (
                  <div className="px-5 pb-4">
                    <h2 className="text-sm font-medium text-[#f1f1f1] mb-3">Detected items</h2>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {detectedItems.map((item, index) => (
                        <ItemChip
                          key={index}
                          label={item}
                          active={index === selectedItem}
                          onClick={() => setSelectedItem(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Results Section */}
                {viewState === 'loading' && (
                  <div className="px-5">
                    <h2 className="text-sm font-medium text-[#f1f1f1] mb-4">Finding products</h2>
                    <div className="space-y-3">
                      <LoadingSkeleton />
                      <LoadingSkeleton />
                      <LoadingSkeleton />
                    </div>
                  </div>
                )}

                {viewState === 'results' && (
                  <div className="px-5 pb-6">
                    <h2 className="text-sm font-medium text-[#f1f1f1] mb-4">
                      {products.length} products found
                    </h2>
                    <div className="space-y-3">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {viewState === 'empty' && (
                  <div className="px-5 pb-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#272727] rounded-full flex items-center justify-center mx-auto mb-4">
                        <img src="/shopping-logo-512x512.png" alt="" className="w-10 h-10 object-contain opacity-50" />
                      </div>
                      <p className="text-[#aaaaaa] text-sm">
                        Looking for products from YouTube Shopping…
                      </p>
                    </div>
                  </div>
                )}

                {viewState === 'error' && (
                  <div className="px-5 pb-6">
                    <div className="bg-[#272727] border border-[#3f3f3f] rounded-xl p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-[#f1f1f1] mb-3">
                            Couldn&apos;t identify products in this frame. Try another moment.
                          </p>
                          <button
                            onClick={handleTryAnother}
                            className="text-sm text-[#6B7FED] font-medium hover:text-[#8A9AFF]"
                          >
                            Try another frame
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* State Toggle Buttons (for demo purposes) */}
              <div className="p-4 border-t border-[#272727] bg-[#0f0f0f]">
                <p className="text-xs text-[#717171] mb-2">Demo controls:</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setViewState('idle')}
                    className="text-xs px-2.5 py-1.5 bg-[#272727] border border-[#3f3f3f] rounded-lg hover:bg-[#3f3f3f] text-white transition-colors"
                  >
                    Idle
                  </button>
                  <button
                    onClick={() => setViewState('loading')}
                    className="text-xs px-2.5 py-1.5 bg-[#272727] border border-[#3f3f3f] rounded-lg hover:bg-[#3f3f3f] text-white transition-colors"
                  >
                    Loading
                  </button>
                  <button
                    onClick={() => setViewState('results')}
                    className="text-xs px-2.5 py-1.5 bg-[#272727] border border-[#3f3f3f] rounded-lg hover:bg-[#3f3f3f] text-white transition-colors"
                  >
                    Results
                  </button>
                  <button
                    onClick={() => setViewState('empty')}
                    className="text-xs px-2.5 py-1.5 bg-[#272727] border border-[#3f3f3f] rounded-lg hover:bg-[#3f3f3f] text-white transition-colors"
                  >
                    Empty
                  </button>
                  <button
                    onClick={() => setViewState('error')}
                    className="text-xs px-2.5 py-1.5 bg-[#272727] border border-[#3f3f3f] rounded-lg hover:bg-[#3f3f3f] text-white transition-colors"
                  >
                    Error
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
