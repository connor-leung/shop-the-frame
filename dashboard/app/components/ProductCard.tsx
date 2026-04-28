import { ExternalLink } from 'lucide-react';

interface Product {
  id: number;
  image: string;
  title: string;
  priceMin: number;
  priceMax: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-[#212121] rounded-xl overflow-hidden hover:bg-[#2d2d2d] transition-all">
      <div className="flex gap-3 p-3">
        {/* Product Image */}
        <div className="w-24 h-24 flex-shrink-0 bg-[#0f0f0f] rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-sm font-medium text-[#f1f1f1] line-clamp-2 mb-2">
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="#ff0000"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
              </svg>
            </div>
            <span className="text-xs text-[#aaaaaa]">YouTube Shopping</span>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-semibold text-white">
              ${product.priceMin} – ${product.priceMax}
            </span>
            <button className="flex items-center gap-1 text-xs text-[#3ea6ff] hover:text-[#65b8ff] font-medium transition-colors">
              View
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
