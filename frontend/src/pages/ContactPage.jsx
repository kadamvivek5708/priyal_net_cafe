import { Phone, MapPin, Instagram, MessageCircle, Clock } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';

const ContactPage = () => {
  const contactInfo = {
    phone: "+917709577531",
    instagram: "https://www.instagram.com/priyal_net_cafe",
    whatsapp: "https://wa.me/917709577531",
    address: "Near ST Stand, Islampur, Maharashtra",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.608664432246!2d74.2564!3d17.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDAyJzM2LjYiTiA3NMKwMTUnMjMuMCJF!5e0!3m2!1sen!2sin!4v1631234567890!5m2!1sen!2sin" 
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-600 dark:text-gray-300">
            प्रियल नेट कॅफे - इस्लामपूर
            </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            कोणत्याही ऑनलाइन फॉर्म, भरती, किंवा डिजिटल सेवेसाठी आम्हाला संपर्क करा. आम्ही तुम्हाला मदत करण्यास तत्पर आहोत.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Call Card */}
          <a href={`tel:${contactInfo.phone}`} className="block group">
            <Card className="h-full border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
              <CardBody className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                  <Phone size={32} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">कॉल करा</h3>
                <p className="text-gray-600 dark:text-gray-300">{contactInfo.phone}</p>
                <span className="text-sm text-blue-600 font-medium">Call Now &rarr;</span>
              </CardBody>
            </Card>
          </a>

          {/* WhatsApp Card */}
          <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="h-full border-l-4 border-l-green-500 hover:shadow-lg transition-all">
              <CardBody className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:scale-110 transition-transform">
                  <MessageCircle size={32} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">व्हॉट्सॲप</h3>
                <p className="text-gray-600 dark:text-gray-300">Chat on WhatsApp</p>
                <span className="text-sm text-green-600 font-medium">Message &rarr;</span>
              </CardBody>
            </Card>
          </a>

          {/* Instagram Card */}
          <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="block group">
            <Card className="h-full border-l-4 border-l-pink-500 hover:shadow-lg transition-all">
              <CardBody className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-full group-hover:scale-110 transition-transform">
                  <Instagram size={32} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">इंस्टाग्राम</h3>
                <p className="text-gray-600 dark:text-gray-300">@priyal_net_cafe</p>
                <span className="text-sm text-pink-600 font-medium">Follow Us &rarr;</span>
              </CardBody>
            </Card>
          </a>
        </div>

        {/* Location & Hours Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Info Side */}
          <div className="space-y-6">
            <Card>
              <CardBody className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-red-500 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">पत्ता (Address)</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      प्रियाल नेट कॅफे,<br />
                      एस.टी. स्टँड शेजारी,<br />
                      इस्लामपूर, महाराष्ट्र - 415409
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="text-purple-500 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">वेळ (Timings)</h3>
                    <div className="space-y-1 text-gray-600 dark:text-gray-300">
                      <p className="flex justify-between w-48"><span>सोम - शनि:</span> <span>9:00 AM - 8:00 PM</span></p>
                      <p className="flex justify-between w-48"><span>रविवार:</span> <span>बंद (Closed)</span></p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Map Side */}
          <div className="h-80 lg:h-auto rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
            <iframe 
              src={contactInfo.mapUrl}
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Priyal Net Cafe Location"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;