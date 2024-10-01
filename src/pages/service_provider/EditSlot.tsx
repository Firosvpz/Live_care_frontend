import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { editSlot, getSlotsList } from '../../api/sp_api';
import SpHeader from '../../components/serviceprovider/SpHeader';
import Footer from '../../components/common/Footer';

const EditSlot: React.FC = () => {
  const [slotData, setSlotData] = useState({
    title: '',
    from: '',
    to: '',
    price: '',
    services: [] as string[],
    description: '',
    status: 'open',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slotId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlotDetails = async () => {
      try {
        const { data } = await getSlotsList(1, 100, '');
        console.log('slotId',slotId);
         console.log('slot._id',data);
        const foundSlot = data.find((slot: any) =>  slot._id === slotId);

        if (foundSlot) {
          const schedule = foundSlot.schedule[0] || {};

          const formatDate = (date: string) => {
            const localDate = new Date(date);
          
            // Adjust the date to local time zone using individual components
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
            const day = String(localDate.getDate()).padStart(2, '0');
            const hours = String(localDate.getHours()).padStart(2, '0');
            const minutes = String(localDate.getMinutes()).padStart(2, '0');
          
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          };
          

          setSlotData({
            title: foundSlot.title || '',
            from: formatDate(schedule.from || ''),
            to: formatDate(schedule.to || ''),
            price: schedule.price || '',
            services: schedule.services || [],
            description: schedule.description || '',
            status: foundSlot.status || 'open',
          });
        }
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching slot details:', error.message);
        setLoading(false);
      }
    };

    fetchSlotDetails();
  }, [slotId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSlotData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fromDate = new Date(slotData.from);
    const toDate = new Date(slotData.to);
    console.log('from',fromDate);
    console.log('to',toDate);
    
    if (toDate <= fromDate) {
      setError('The "To" date must be greater than the "From" date.');
      return;
    }

    setError(null); 

    try {
      await editSlot(slotId as string, slotData);
      toast.success('Slot updated successfully.');
      navigate('/sp/get-slots', { state: { refresh: true } }); 
    } catch (error: any) {
      console.error('Error updating slot:', error.message);
      toast.error(error.message);
    }
  };

  const currentDateTime = new Date().toISOString().slice(0, 16);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SpHeader />
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Edit Slot</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>From</label>
            <input
              type="datetime-local"
              name="from"
              value={slotData.from}
              onChange={handleInputChange}
              min={currentDateTime} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>To</label>
            <input
              type="datetime-local"
              name="to"
              value={slotData.to}
              onChange={handleInputChange}
              min={currentDateTime} 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Price</label>
            <input
              type="number"
              name="price"
              value={slotData.price}
              readOnly
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Services</label>
            <input
              type="text"
              name="services"
              value={slotData.services.join(', ')}
              readOnly
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Description</label>
            <textarea
              name="description"
              value={slotData.description}
              onChange={handleInputChange}
              style={{ width: '100%', height: '150px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
            ></textarea>
          </div>
          <button type="submit" style={{ padding: '0.75rem 1.5rem', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
            Update Slot
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditSlot;