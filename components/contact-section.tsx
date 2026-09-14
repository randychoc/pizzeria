'use client'

import Image from 'next/image'
import { MapPin, Clock, Phone, MessageCircle } from 'lucide-react'
import { contactInfo } from '@/lib/menu-data'
import { Button } from '@/components/ui/button'

type ContactSectionProps = {
  isActive: boolean
}

export function ContactSection({ isActive }: ContactSectionProps) {
  if (!isActive) return null

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full bg-brand-red/10 px-4 py-2">
            <span className="text-2xl">📍</span>
            <span className="text-sm font-medium text-brand-red">Visítanos</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-red sm:text-4xl">
            Encuéntranos
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-brand-red" />
        </div>

        {/* Contact card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
          {/* Logo section */}
          <div className="bg-brand-red px-6 py-10 text-center sm:px-12 sm:py-14">
            <div className="mx-auto mb-4 size-24 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm sm:size-28">
              <Image
                src="/images/newLogoPizzeria.webp"
                alt="Logo Pizzería Las Vegas"
                width={112}
                height={112}
                className="object-cover size-full"
              />
            </div>
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Pizzería Las Vegas
            </h3>
            <p className="mt-2 text-white/80">La Casa de la Pizza</p>
          </div>

          {/* Info section */}
          <div className="divide-y divide-gray-100 p-6 sm:p-8">
            {/* Address */}
            <div className="flex items-start gap-4 pb-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
                <MapPin className="size-6 text-brand-blue" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Dirección</h4>
                <p className="mt-1 text-gray-600">{contactInfo.address}</p>
                <p className="mt-0.5 text-sm text-gray-500">{contactInfo.reference}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 py-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-yellow/30">
                <Clock className="size-6 text-brand-blue" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Horario</h4>
                <p className="mt-1 text-gray-600">{contactInfo.hours}</p>
              </div>
            </div>

            {/* Phone numbers */}
            <div className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10">
                  <Phone className="size-6 text-brand-red" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Llamadas o WhatsApp</h4>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    {contactInfo.phones.map((phone, index) => (
                      <div key={index} className="flex flex-col gap-2 sm:flex-row">
                        <Button
                          asChild
                          variant="outline"
                          className="gap-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-brand-white"
                        >
                          <a href={`tel:${phone.number}`}>
                            <Phone className="size-4" />
                            {phone.display}
                          </a>
                        </Button>
                        <Button
                          asChild
                          className="gap-2 bg-[#25D366] text-white hover:bg-[#1fb855]"
                        >
                          <a 
                            href={`https://api.whatsapp.com/send?phone=${phone.number}&text=PIZZER%C3%8DA%20LAS%20VEGAS.%20Buen%20d%C3%ADa,%20necesito%20pedir%20una%20orden...`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="size-4" />
                            WhatsApp
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
