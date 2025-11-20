import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicPosts } from '../features/posts/api/postsApi';
import { getPublicServices } from '../features/services/api/servicesApi';
import { ArrowRight, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

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
        // Assuming the API returns { data: [...] } based on your structure
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Priyal Net Cafe
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Your one-stop destination for Online Forms, Government Job Applications, and Digital Services.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/posts">
              <Button variant="secondary" size="lg">
                View Latest Jobs
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-blue-700 hover:text-white">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest Updates</h2>
          <Link to="/posts" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View All <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {post.postName}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>Last Date: {formatDate(post.lastDate)}</span>
                  </div>
                  <Link to={`/posts/${post._id}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-10">
              No updates available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide a wide range of digital services to make your life easier.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service._id} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* You can map specific icons based on service name later */}
                    <ArrowRight size={24} /> 
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                    Fees: {service.fees}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                Services are being updated.
              </div>
            )}
          </div>
           <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" size="lg">
                See All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location / Contact Mini Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
               <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Visit Us Today</h2>
               
               <div className="flex items-start gap-4">
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600 mt-1">
                   <MapPin size={24} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Address</h3>
                   <p className="text-gray-600 dark:text-gray-300">Near ST Stand, Islampur, Maharashtra</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="bg-green-100 p-3 rounded-full text-green-600 mt-1">
                   <Phone size={24} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Call Us</h3>
                   <p className="text-gray-600 dark:text-gray-300">+91 77095 77531</p>
                 </div>
               </div>

                <div className="flex items-start gap-4">
                 <div className="bg-purple-100 p-3 rounded-full text-purple-600 mt-1">
                   <Clock size={24} />
                 </div>
                 <div>
                   <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Opening Hours</h3>
                   <p className="text-gray-600 dark:text-gray-300">Mon - Sat: 9:00 AM - 8:00 PM</p>
                 </div>
               </div>
            </div>
            
            {/* Map Placeholder or Image */}
            <div className="flex-1 w-full h-64 md:h-80 bg-gray-200 rounded-xl overflow-hidden">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.608664432246!2d74.2564!3d17.0435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDAyJzM2LjYiTiA3NMKwMTUnMjMuMCJF!5e0!3m2!1sen!2sin!4v1631234567890!5m2!1sen!2sin" 
                 width="100%" 
                 height="100%" 
                 style={{border:0}} 
                 allowFullScreen="" 
                 loading="lazy"
                 title="Shop Location"
               ></iframe>
            </div>
         </div>
      </section>

    </div>
  );
};

export default HomePage;