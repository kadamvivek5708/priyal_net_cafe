import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../../admin/api/adminServicesApi';

// UI Components
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../../components/ui/Card';
import { 
  ArrowLeft, 
  IndianRupee, 
  FileText, 
  Clock,
  Edit
} from 'lucide-react';

const AdminServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await getServiceById(serviceId);
        if (response.success) {
            setService(response.data);
        } else {
            setError("Service data not found");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
        fetchServiceData();
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">{error || "Service not found"}</p>
        <Button onClick={() => navigate('/admin/services')}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto">
        
        {/* Header / Nav */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin/services')} className="pl-0 hover:bg-transparent">
             <ArrowLeft size={20} className="mr-2" /> मागे जा 
          </Button>
          
          <Button onClick={() => navigate(`/admin/services/edit/${serviceId}`)}>
            <Edit size={18} className="mr-2" /> Edit
          </Button>
        </div>

        {/* Main Detail Card */}
        <Card className="overflow-hidden">
           
           {/* Card Header with Status */}
           <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                 <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {service.name}
                    </h1>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-sm font-bold ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                 </div>
              </div>
           </div>

           <CardBody className="space-y-8">
              
              {/* Fees & Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                        <IndianRupee size={16} className="mr-2" /> फी 
                    </h3>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{service.fees}</p>
                 </div>

                 <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center">
                        <Clock size={16} className="mr-2" />आवश्यक वेळ
                    </h3>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{service.processingTime || 'N/A'}</p>
                 </div>
              </div>

              {/* Documents */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText size={16} className="mr-2" /> आवश्यक कागदपत्रे 
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {service.documentsRequired?.map((doc, i) => (
                       <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-100 dark:border-blue-800">
                          {doc}
                       </span>
                    ))}
                 </div>
                 {(!service.documentsRequired || service.documentsRequired.length === 0) && (
                    <p className="text-gray-500 italic text-sm">काहीही माहिती उपलब्ध नाही.</p>
                 )}
              </div>

           </CardBody>
        </Card>

      </div>
    </div>
  );
};

export default AdminServiceDetailPage;