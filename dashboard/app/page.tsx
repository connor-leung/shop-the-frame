import { PlaySquare, Sparkles, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { MotionDiv } from './components/MotionDiv';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8eaff] via-[#f0f2ff] to-[#fef3f3]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
              <img src="/shopping-logo-512x512.png" alt="Shop the Frame" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Shop the Frame</span>
          </div>
          <a
            href="#download"
            className="px-5 py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-full text-sm font-medium hover:bg-white transition-all shadow-sm"
          >
            Get Extension
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-slate-700 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#FFD93D]" />
              <span>Powered by Gemini AI</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Shop what you see,
              <br />
              <span className="bg-gradient-to-r from-[#6B7FED] to-[#FF6B6B] bg-clip-text text-transparent">
                instantly
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Pause any YouTube video and discover shoppable products from what&apos;s on screen.
              No more searching—just click, shop, and go.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#download"
                className="px-8 py-4 bg-gradient-to-r from-[#6B7FED] to-[#FF6B6B] text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Add to Chrome — It&apos;s Free
              </a>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 rounded-full font-semibold text-lg shadow-lg hover:bg-white transition-all"
              >
                Try Demo
              </Link>
            </div>
          </MotionDiv>

          {/* Hero Image */}
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1578747522731-9e5a179b02f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzb2Z0JTIwbmF0dXJhbCUyMG1pbmltYWxpc3QlMjBsaWZlc3R5bGUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3Nzc0MDM0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Shop the Frame in action"
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Extension Preview */}
            <MotionDiv
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block"
            >
              <div className="w-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 mb-1">
                    <img src="/shopping-logo-512x512.png" alt="" className="w-5 h-5 object-contain" />
                    <h3 className="text-base font-semibold text-slate-900">Shop the Frame</h3>
                  </div>
                  <p className="text-xs text-slate-500">AI-powered shopping assistant</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="bg-slate-50 rounded-2xl p-3 flex gap-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 flex gap-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Shopping made effortless
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Transform how you discover and buy products from your favorite videos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFD93D]/20 to-[#FFD93D]/30 rounded-2xl flex items-center justify-center mb-5">
                <Sparkles className="w-7 h-7 text-[#FFD93D]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered Detection</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced Gemini AI identifies products in any video frame with incredible accuracy.
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#6B7FED]/20 to-[#6B7FED]/30 rounded-2xl flex items-center justify-center mb-5">
                <Zap className="w-7 h-7 text-[#6B7FED]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant Results</h3>
              <p className="text-slate-600 leading-relaxed">
                Get shopping options in seconds. No typing, no searching—just instant product matches.
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF6B6B]/30 rounded-2xl flex items-center justify-center mb-5">
                <PlaySquare className="w-7 h-7 text-[#FF6B6B]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">YouTube Native</h3>
              <p className="text-slate-600 leading-relaxed">
                Seamlessly integrated into your YouTube experience. Shop without leaving the page.
              </p>
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-slate-600">
              Three simple steps to shop anything you see
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#6B7FED] to-[#FF6B6B] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Pause the video</h3>
                <p className="text-slate-600 text-lg">
                  Stop at any moment where you see something you like
                </p>
              </div>
              <div className="w-full md:w-80 h-48 bg-slate-100 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1735720518679-4c0673e59035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcm9vbSUyMHNldHVwJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NzQwMzEzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Pause video"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#6B7FED] to-[#FF6B6B] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                2
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Click the extension</h3>
                <p className="text-slate-600 text-lg">
                  Open Shop the Frame and let AI analyze the scene
                </p>
              </div>
              <div className="w-full md:w-80 h-48 bg-slate-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6B7FED]/20 to-[#FF6B6B]/20 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <img src="/shopping-logo-512x512.png" alt="" className="w-10 h-10 object-contain" />
                  </div>
                  <p className="text-slate-500 text-sm">Extension Panel</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#6B7FED] to-[#FF6B6B] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Browse and buy</h3>
                <p className="text-slate-600 text-lg">
                  Explore matched products and shop with one click
                </p>
              </div>
              <div className="w-full md:w-80 h-48 bg-slate-100 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1758445045824-3c6a3316dbbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaWZlc3R5bGUlMjBzaG9wcGluZyUyMGNhc3VhbHxlbnwxfHx8fDE3Nzc0MDMxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Shop products"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#6B7FED] to-[#FF6B6B] rounded-[2.5rem] p-12 md:p-16 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform how you shop?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of shoppers discovering products effortlessly with Shop the Frame
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#6B7FED] rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Globe className="w-6 h-6" />
              Add to Chrome — Free Forever
            </a>
            <p className="text-white/90 text-sm mt-6">
              No credit card required • Install in seconds
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                <img src="/shopping-logo-512x512.png" alt="" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-semibold text-slate-900">Shop the Frame</span>
            </div>
            <p className="text-slate-500 text-sm">
              Powered by Gemini AI • Made with ❤️ for YouTube shoppers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
