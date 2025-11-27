import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicPosts } from '../features/posts/api/postsApi';
import { getPublicServices } from '../features/services/api/servicesApi';
import { ArrowRight, MapPin, Phone, Clock, IndianRupee } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

// Import the uploaded image directly if it's in the public folder or src/assets
// Assuming it's placed in public/logo-marathi.png for now, or handled via import if in assets
// Since I cannot move the file for you, I will assume you place it in `frontend/public/logo-marathi.png`
// OR I can use a placeholder path that you can update.

const HomePage = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts and services in parallel
        const [postsData, servicesData] = await Promise.all([
          getPublicPosts(),
          getPublicServices()
        ]);
        
        // Take only the first 3 items for the home page
        setLatestPosts((postsData.data || []).slice(0, 3));
        setServices((servicesData.data || []).slice(0, 4));
      } catch (error) {
        console.error("Failed to load home page data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('mr-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">

          
          {/* Hero Image - Using your uploaded image style */}
          <div className="flex-1 flex justify-center">
             {/* Use the actual path where you save the image */}
             <img 
               src="/logo-marathi.png" 
               alt="Priyal Net Cafe Marathi Logo" 
               className="w-full max-w-md object-contain transform hover:scale-105 transition-transform duration-300"
               onError={(e) => {
                 e.target.onerror = null; 
                 // Fallback if image not found
                 e.target.src="https://placehold.co/600x400/3b82f6/ffffff?text=Priyal+Net+Cafe&font=roboto";
               }}
             />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              आपले स्वागत आहे ! <br />
              <span className="text-blue-600">प्रियल नेट कॅफे</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto md:mx-0">
              सर्व प्रकारचे ऑनलाइन फॉर्म, सरकारी नोकरी अर्ज, आणि डिजिटल सेवांसाठीचे हक्काचे ठिकाण.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/posts">
                <Button size="lg" className="w-full sm:w-auto">
                  नवीन जाहिराती पहा
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  आमच्या सेवा 
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white border-l-4 border-blue-600 pl-4">
            नवीनतम अपडेट्स 
          </h2>
          <Link to="/posts" className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm md:text-base hover:underline">
            सर्व पहा <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <div key={post._id} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.postName}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs">
                       <span className="text-gray-500 block">अंतिम तारीख :</span>
                       <span className="font-semibold text-red-500">{formatDate(post.lastDate)}</span>
                    </div>
                    <Link to={`/posts/${post._id}`}>
                      <Button size="sm" variant="outline" className="text-xs">माहिती पहा</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500">सध्या कोणतेही नवीन अपडेट्स उपलब्ध नाहीत.</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="bg-blue-50 dark:bg-gray-800/50 py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Top section container */}
      <div className="mb-10">

        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white border-l-4 border-blue-600 pl-4">
            आमच्या प्रमुख सेवा
          </h2>
          <Link
            to="/services"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm md:text-base hover:underline"
          >
            सर्व पहा <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mt-3 pl-[1.05rem]">
          आम्ही तुम्हाला जलद आणि अचूक ऑनलाइन सेवा पुरवू .
        </p>

      </div>


          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service._id} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-600 text-center group">
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} /> 
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm font-medium flex items-center justify-center gap-1">
                    <IndianRupee size={14}/> {service.fees}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500 py-8">
                सेवांची यादी लवकरच उपलब्ध होईल.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location / Contact Mini Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            
            <div className="p-8 md:p-12 flex-1 space-y-8 bg-white dark:bg-gray-800">
               <div>
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">आजच भेट द्या </h2>
                 <p className="text-gray-600 dark:text-gray-400">आमच्या केंद्रावर येऊन अधिक माहिती मिळवा.</p>
               </div>
               
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="bg-blue-50 p-3 rounded-lg text-blue-600 mt-1">
                     <MapPin size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white">पत्ता </h3>
                     <p className="text-gray-600 dark:text-gray-300">एस.टी. स्टँड शेजारी, इस्लामपूर, महाराष्ट्र</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="bg-green-50 p-3 rounded-lg text-green-600 mt-1">
                     <Phone size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white">संपर्क</h3>
                     <p className="text-gray-600 dark:text-gray-300">+91 7709577531</p>
                   </div>
                 </div>

                  <div className="flex items-start gap-4">
                   <div className="bg-purple-50 p-3 rounded-lg text-purple-600 mt-1">
                     <Clock size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white">वेळ</h3>
                     <p className="text-gray-600 dark:text-gray-300">सोम - शनि: 9:00 AM - 6:00 PM</p>
                   </div>
                 </div>
               </div>
            </div>
            
            {/* Map Placeholder or Image */}
            <div className="flex-1 bg-gray-200 h-64 md:h-auto min-h-[300px]">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d189.77084153275454!2d74.259835!3d17.046542!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDAyJzQ3LjYiTiA3NMKwMTUnMzUuNCJF!5e0!3m2!1sen!2sin!4v1732533800000!5m2!1sen!2sin" 
                 width="100%" 
                 height="100%" 
                 style={{border:0}} 
                 allowFullScreen="" 
                 loading="lazy"
                 title="Shop Location"
                 className="w-full h-full"
               ></iframe>
            </div>
         </div>
      </section>

    </div>
  );
};

export default HomePage;