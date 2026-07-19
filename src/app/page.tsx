import Link from "next/link";

const featuredCategories = [
  { name: "Pizzas", emoji: "🍕", slug: "classic" },
  { name: "Burgers", emoji: "🍔", slug: "burgers" },
  { name: "Pasta", emoji: "🍝", slug: "pasta" },
  { name: "Shakes", emoji: "🥤", slug: "shakes" },
  { name: "Fries", emoji: "🍟", slug: "fries" },
  { name: "Combos", emoji: "🔥", slug: "combos" },
];

const stats = [
  { label: "Happy Customers", value: "1000+" },
  { label: "Menu Items", value: "80+" },
  { label: "Rating", value: "3.7 ★" },
  { label: "Years Serving", value: "2+" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream via-white to-cream-dark overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-brand/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-cream-dark/50 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-24 lg:pb-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Hello Food"
              className="h-40 sm:h-48 lg:h-56 w-auto mx-auto mb-6"
            />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              Open Daily · Closes 11 PM
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Fresh Food, Made with{" "}
              <span className="text-brand">Love</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-xl mx-auto mb-8 leading-relaxed">
              Delicious pizzas, burgers, pasta, shakes, and more in the heart of
              Pilibhit. Order online for quick delivery or visit us today.
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      star <= 4 ? "text-yellow-400" : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted">3.7 / 5 (230 reviews)</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-brand-hover transition-all hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                View Menu &amp; Order
              </Link>
              <a
                href="tel:+918476931313"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-foreground border-2 border-border px-8 py-3.5 rounded-full text-base font-semibold hover:border-brand hover:text-brand transition-all active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat) => (
              <div key={stat.label} className="py-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-brand">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Our <span className="text-brand">Menu</span>
            </h2>
            <p className="text-muted max-w-md mx-auto">
              From crispy pizzas to refreshing shakes — explore our full menu
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/menu?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-brand/30 hover:bg-cream/50 transition-all"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-brand font-semibold text-sm hover:underline underline-offset-4"
            >
              View Full Menu
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 sm:py-20 bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                <iframe
                  src="https://maps.google.com/maps?q=JRG6%2B3J+Pilibhit,+Uttar+Pradesh&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hello Food Location"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">Find Us</h3>
                <p className="text-sm text-muted">
                  77, Gandhi Stadium Rd, Ballabh Nagar Colony, Pilibhit, Uttar Pradesh 262001
                </p>
                <p className="text-xs text-muted mt-1">
                  Opposite Gandhi Stadium
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Visit <span className="text-brand">Hello Food</span>
                </h2>
                <p className="text-muted leading-relaxed">
                  Located in the heart of Pilibhit, we serve fresh and delicious
                  food daily. Whether you&apos;re craving a cheesy pizza, a
                  loaded burger, or a refreshing shake — we&apos;ve got you
                  covered.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border">
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-brand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Hours
                    </h4>
                    <p className="text-xs text-muted mt-0.5">
                      Open daily, closes 11 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border">
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-brand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Phone
                    </h4>
                    <a
                      href="tel:+918476931313"
                      className="text-xs text-muted mt-0.5 hover:text-brand transition-colors"
                    >
                      084769 31313
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border">
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <span className="text-lg">💰</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Price Range
                    </h4>
                    <p className="text-xs text-muted mt-0.5">₹200–400 per person</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border">
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center shrink-0">
                    <span className="text-lg">🚗</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Service Modes
                    </h4>
                    <p className="text-xs text-muted mt-0.5">
                      Dine-in · Drive-through · Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20 bg-brand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Hungry? Order Now!
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Browse our full menu, customize your order, and get it delivered
            fresh to your doorstep.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-white text-brand px-8 py-3.5 rounded-full text-base font-semibold hover:bg-cream transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Explore Menu
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
