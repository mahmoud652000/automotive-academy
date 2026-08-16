import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=1920" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-right">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              جاهز للعناية بسيارتك؟
            </h2>
            <p className="text-white/80 text-lg">
              احجز موعدك الآن واحصل على فحص مجاني لسيارتك
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/booking" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-all duration-300">
              احجز موعد
            </Link>
            <a href="tel:01001234567" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-3 px-8 rounded-lg transition-all duration-300">
              اتصل بنا
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
