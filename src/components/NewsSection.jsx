import React from 'react'
import officialImg from '../assets/officila.jpg'
import preorderImg from '../assets/preoder.jpg'
import launchImg from '../assets/lunch.jpg'

const newsItems = [
  {
    id: 'release-date',
    title: 'Official Release Date',
    date: 'November 19, 2026',
    image: officialImg,
    alt: 'GTA VI Official Release Date Announcement',
    buttonText: 'See more',
  },
  {
    id: 'pre-orders',
    title: 'Pre-orders opened',
    date: 'June 25, 2026',
    image: preorderImg,
    alt: 'GTA VI Pre-orders Opened Announcement',
    buttonText: 'See more',
  },
  {
    id: 'launch-gallery',
    title: 'Launch Gallery Date',
    date: 'November 5, 2026',
    image: launchImg,
    alt: 'GTA VI Launch Gallery Date Announcement',
    buttonText: 'See more',
  },
]

export default function NewsSection() {
  return (
    <section className="w-full bg-transparent py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-16 transition-colors duration-500">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="text-left mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-white font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-tight leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            News and updates
          </h2>
          <p className="mt-2.5 sm:mt-3 text-slate-400 font-sans font-medium text-sm sm:text-base md:text-lg">
            Get the latest GTA VI news, updates, and announcements.
          </p>
        </div>

        {/* 3-Column News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-[#122038] hover:bg-[#152745] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 flex flex-col justify-between shadow-[0_12px_35px_rgba(0,0,0,0.45)] border border-[#1d355c]/30 hover:border-[#2d4e82]/60 transition-all duration-300 group hover:-translate-y-1.5"
            >
              {/* Card Image */}
              <div className="w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.35)] bg-slate-900/60">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-104 pointer-events-none"
                  loading="lazy"
                />
              </div>

              {/* Card Text & Action Button */}
              <div className="flex flex-col items-start text-left mt-4 sm:mt-5 flex-1 justify-between">
                <div>
                  <h3 className="text-white font-sans font-bold text-lg sm:text-xl lg:text-[21px] tracking-tight leading-snug group-hover:text-[#ffd666] transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-slate-400 font-sans text-xs sm:text-sm font-medium">
                    {item.date}
                  </p>
                </div>

                {/* Yellow Pill Button matching reference */}
                <button
                  type="button"
                  className="mt-5 sm:mt-6 inline-flex items-center gap-2 bg-[#f5b642] hover:bg-[#e8aa33] text-neutral-950 font-sans font-bold text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_4px_14px_rgba(245,182,66,0.35)] hover:shadow-[0_6px_20px_rgba(245,182,66,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <span>{item.buttonText}</span>
                  <span className="font-mono text-sm transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
