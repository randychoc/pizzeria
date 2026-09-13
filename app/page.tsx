'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { MenuSection } from '@/components/menu-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { menuData } from '@/lib/menu-data'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('pizzas')

  // Al cambiar de categoría la sección se reemplaza pero el scroll se queda
  // donde estaba, dejando la categoría nueva empezada a media página.
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    window.scrollTo(0, 0)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {menuData.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
            />
          ))}
          
          <ContactSection isActive={activeCategory === 'contacto'} />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
