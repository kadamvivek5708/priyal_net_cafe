import React, { useEffect, useState } from 'react';
import { getPublicServices } from '../../services/api/servicesApi';
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
    setTimeout(() => setSelectedService(null), 200); 
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
            ईतर सेवा...
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            सर्व प्रकारच्या डिजिटल सेवा माफक दरात उपलब्ध.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 sticky top-20 z-30">
          <div className="relative shadow-md rounded-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="सेवा शोधा (उदा. पॅन कार्ड, आधार)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Services Grid - Focused on Cards */}
        {filteredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <div 
                key={service._id} 
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden h-full"
              >
                <div className="p-6 flex-1 flex flex-col items-center text-center relative">
                  
                  {/* Icon Circle */}
                  <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText size={28} strokeWidth={1.5} />
                  </div>

                  {/* Service Name */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {service.name}
                  </h3>

                  {/* Processing Time Badge */}
                  {service.processingTime && (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 mb-4">
                      <Clock size={12} className="mr-1" />
                      {service.processingTime}
                    </div>
                  )}

                  {/* Fees */}
                  <div className="mt-auto flex items-center justify-center text-gray-900 dark:text-white font-bold text-xl">
                    <IndianRupee size={18} className="mr-1 text-gray-400" />
                    {service.fees}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                   <Button 
                     variant="outline" 
                     size="sm" 
                     className="w-full border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-700 transition-colors"
                     onClick={() => openDocumentsModal(service)}
                   >
                     कागदपत्रे पहा
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p>"{searchTerm}" साठी कोणतीही सेवा सापडली नाही.</p>
          </div>
        )}

        {/* Document Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          title={selectedService?.name || 'Service Details'}
        >
           <div className="space-y-5">
             
             {/* Modal Header Info */}
             <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div>
                    <span className="block text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">फी </span>
                    <span className="text-xl font-bold text-blue-900 dark:text-blue-100">₹ {selectedService?.fees}</span>
                </div>
                {selectedService?.processingTime && (
                    <div className="text-right">
                        <span className="block text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">कालावधी </span>
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{selectedService.processingTime}</span>
                    </div>
                )}
             </div>

             {/* Documents List */}
             <div>
               <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                 <FileText size={16} className="mr-2 text-gray-500" />
                 आवश्यक कागदपत्रे :
               </h4>
               {selectedService?.documentsRequired && selectedService.documentsRequired.length > 0 ? (
                 <ul className="space-y-2 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                   {selectedService.documentsRequired.map((doc, idx) => (
                     <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                       <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 shrink-0" />
                       {doc}
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-gray-500 italic pl-4">कागदपत्रांची माहिती उपलब्ध नाही.</p>
               )}
             </div>

             {/* Modal Actions */}
             <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  अर्ज करण्यासाठी आमच्या केंद्राला भेट द्या किंवा WhatsApp करा.
                </p>
                <a 
                  href={`https://wa.me/917709577531?text=नमस्कार , मला ${selectedService?.name} काढण्यासाठी  मदत हवी आहे.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-center transition-colors shadow-sm hover:shadow-md"
                >
                  WhatsApp वर चौकशी करा
                </a>
             </div>
           </div>
        </Modal>

      </div>
    </div>
  );
};

export default PublicServicesPage;