import React, { useEffect, useState } from 'react';
import { getPublicServices } from '../api/servicesApi';
import { Search, Clock, IndianRupee, FileText, CheckCircle } from 'lucide-react';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

const PublicServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getPublicServices();
        const data = response.data || [];
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Search Filter
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const results = services.filter(service => 
      service.name.toLowerCase().includes(lowerTerm)
    );
    setFilteredServices(results);
  }, [searchTerm, services]);

  const openDocumentsModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 200); // Clear after animation
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Our Services
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Digital solutions for all your needs, at affordable prices.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition duration-150 ease-in-out"
              placeholder="Search services (e.g. Pan Card, Aadhar)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <div 
                key={service._id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {/* Placeholder Icon - Ideally mapped dynamically */}
                      <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    {service.processingTime && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        <Clock size={12} className="mr-1" />
                        {service.processingTime}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h3>

                  <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-4">
                    <IndianRupee size={16} className="mr-1" />
                    {service.fees}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 rounded-b-xl">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                     onClick={() => openDocumentsModal(service)}
                   >
                     View Required Documents
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No services found matching "{searchTerm}".
          </div>
        )}

        {/* Document Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          title={selectedService?.name || 'Service Details'}
        >
           <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Service Fees</span>
                <span className="text-lg font-bold text-blue-800 dark:text-blue-200">₹ {selectedService?.fees}</span>
             </div>

             <div>
               <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                 Documents Required:
               </h4>
               {selectedService?.documentsRequired && selectedService.documentsRequired.length > 0 ? (
                 <ul className="space-y-2">
                   {selectedService.documentsRequired.map((doc, idx) => (
                     <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                       <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                       {doc}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-gray-500 italic">No specific documents listed.</p>
               )}
             </div>

             <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Ready to apply? Visit our center.
                </p>
                <a 
                  href={`https://wa.me/917709577531?text=Hi, I need help with ${selectedService?.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Inquire on WhatsApp
                </a>
             </div>
           </div>
        </Modal>

      </div>
    </div>
  );
};

export default PublicServicesPage;