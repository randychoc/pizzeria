'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Bike, Menu, X, Phone } from 'lucide-react'
import { menuData, contactInfo } from '@/lib/menu-data'
import { Button } from '@/components/ui/button'

type HeaderProps = {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function Header({ activeCategory, onCategoryChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = [...menuData.map(cat => ({ id: cat.id, name: cat.name })), { id: 'contacto', name: 'Contacto' }]

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar with red background */}
      {/* Gradient option (pending client approval): style={{ background: 'linear-gradient(135deg, #c31e23 0%, #7a1f52 50%, #173185 100%)' }} */}
      <div className="bg-brand-blue text-brand-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Image
                  src="/images/newLogoPizzeria.jpeg"
                  alt="Logo Pizzería Las Vegas"
                  width={48}
                  height={48}
                  className="object-cover size-full"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl text-balance">
                  Pizzería Las Vegas
                </h1>
                <p className="text-xs text-white hidden sm:block">La Casa de la Pizza</p>
              </div>
            </div>
            
            <a 
              href={`tel:${contactInfo.phones[0].number}`}
              className="hidden md:flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Phone className="size-4" />
              {contactInfo.phones[0].display}
            </a>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Delivery banner */}
      <div className="bg-brand-yellow text-[#1a1a1a]">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3">
            <Bike className="size-5 shrink-0 text-brand-red" />
            <p className="min-w-0 text-center text-sm font-semibold sm:text-base">
              {contactInfo.deliveryNote}
            </p>
            <Bike className="size-5 shrink-0 text-brand-red hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => onCategoryChange(category.id)}
                  className={`relative px-5 py-4 text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'text-brand-red'
                      : 'text-gray-600 hover:text-brand-red'
                  }`}
                >
                  {category.name}
                  {activeCategory === category.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-b border-gray-100 shadow-lg">
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => {
                    onCategoryChange(category.id)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full px-6 py-4 text-left text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-brand-red/5 text-brand-red'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
