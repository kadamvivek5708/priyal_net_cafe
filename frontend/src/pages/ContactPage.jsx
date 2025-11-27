import { Phone, MapPin, Instagram, MessageCircle, Clock } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';

const ContactPage = () => {
  const contactInfo = {
    phone: "+917709577531",
    instagram: "https://www.instagram.com/priyal_net_cafe",
    whatsapp: "https://wa.me/917709577531",
    address: "Near ST Stand, Islampur, Maharashtra",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d189.77084153275454!2d74.259835!3d17.046542!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDAyJzQ3LjYiTiA3NMKwMTUnMzUuNCJF!5e0!3m2!1sen!2sin!4v1732533800000!5m2!1sen!2sin",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            प्रियल नेट कॅफे - इस्लामपूर
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            कोणत्याही ऑनलाइन फॉर्म, भरती, किंवा डिजिटल सेवेसाठी आम्हाला संपर्क करा.
            आम्ही तुम्हाला मदत करण्यास तत्पर आहोत.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {/* CALL */}
          <a href={`tel:${contactInfo.phone}`} className="block group">
            <Card className="h-full border-l-4 border-blue-500 hover:shadow-lg transition-all rounded-xl">
              <CardBody className="flex flex-col items-center text-center space-y-3 py-5 sm:py-6">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                  <Phone size={28} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">कॉल करा</h3>
                <p className="text-gray-600 dark:text-gray-300">{contactInfo.phone}</p>
              </CardBody>
            </Card>
          </a>

          {/* WHATSAPP */}
          <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="h-full border-l-4 border-green-500 hover:shadow-lg transition-all rounded-xl">
              <CardBody className="flex flex-col items-center text-center space-y-3 py-5 sm:py-6">
                <div className="p-3 bg-green-100 text-green-700 dark:text-green-400 rounded-full group-hover:scale-110 transition-transform">
                  <MessageCircle size={28} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">व्हॉट्सॲप</h3>
                <p className="text-gray-600 dark:text-gray-300">Chat on WhatsApp</p>
              </CardBody>
            </Card>
          </a>

          {/* INSTAGRAM */}
          <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="h-full border-l-4 border-pink-500 hover:shadow-lg transition-all rounded-xl">
              <CardBody className="flex flex-col items-center text-center space-y-3 py-5 sm:py-6">
                <div className="p-3 bg-pink-100 text-pink-700 dark:text-pink-400 rounded-full group-hover:scale-110 transition-transform">
                  <Instagram size={28} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">इंस्टाग्राम</h3>
                <p className="text-gray-600 dark:text-gray-300">@priyal_net_cafe</p>
              </CardBody>
            </Card>
          </a>

        </div>


        {/* INFO + MAP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* INFO BOX */}
          <Card className="rounded-xl shadow-md">
            <CardBody className="space-y-8">

              {/* ADDRESS */}
              <div className="flex gap-4 items-start">
                <MapPin className="text-red-500 shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">पत्ता</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    प्रियल नेट कॅफे,<br />
                    एस.टी. स्टँड शेजारी,<br />
                    इस्लामपूर, महाराष्ट्र - 415409
                  </p>
                </div>
              </div>

              {/* TIMINGS */}
              <div className="flex gap-4 items-start">
                <Clock className="text-purple-500 shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">वेळ</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    सोमवार - शनिवार<br />
                    9:00 AM - 6:00 PM<br />
                    रविवार: बंद राहील
                  </p>
                </div>
              </div>

            </CardBody>
          </Card>

          {/* MAP */}
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700
                          h-72 sm:h-80 md:h-96 lg:h-full">
            <iframe
              src={contactInfo.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Priyal Net Cafe Location"
              className="w-full h-full"
            ></iframe>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
