import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {  Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchApprovedAndUnblockedProviders, getProfileDetails } from '../../api/user_api'
import { updateUserInfo } from '../../redux/slices/user_slice'
import { ServiceProvider } from '../../types/serviceproviders'
import UserHeader from '../../components/user/Header'
import Footer from '../../components/common/Footer'

export default function ApprovedSp() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  useEffect(() => {
    const loadServiceProviders = async () => {
      try {
        const providersData = await fetchApprovedAndUnblockedProviders()
        setProviders(providersData)
        setFilteredProviders(providersData)
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    loadServiceProviders()
  }, [])

  useEffect(() => {
    const filterProviders = () => {
      const lowercasedSearchTerm = searchTerm.toLowerCase()
      const filtered = providers.filter((provider) =>
        provider.name.toLowerCase().includes(lowercasedSearchTerm) ||
        provider.service.toLowerCase().includes(lowercasedSearchTerm)
      )
      setFilteredProviders(filtered)
      setCurrentPage(1)
    }
    filterProviders()
  }, [searchTerm, providers])

  const fetchUserInfo = async () => {
    const response = await getProfileDetails()
    if (response.success) {
      dispatch(updateUserInfo(response.data))
      return response.data
    }
    return null
  }

  const handleViewDetails = (providerId: string) => {
    navigate(`/user/sp-details/${providerId}`)
  }

  const handleSlotDetails = async (serviceProviderId: string) => {
    const userInfo = await fetchUserInfo()
    if (userInfo.hasCompletedDetails !== true) {
      navigate(`/user/verify-userdetails`)
    } else {
      navigate(`/user/slot-details/${serviceProviderId}`)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    )
  }

  const indexOfLastProvider = currentPage * itemsPerPage
  const indexOfFirstProvider = indexOfLastProvider - itemsPerPage
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider)
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>
  }

  return (
    <>
      <UserHeader />
      <div
        className="min-h-screen bg-cover  bg-center bg-fixed py-12 px-4 sm:px-6 lg:px-8 "
        style={{ backgroundImage: "url(../images/spHomee.jpg)" }}
      >
        <div className="max-w-7xl mx-auto ">
          <div className=" bg-opacity-90 outset bg-black/80 rounded-lg shadow-xl p-8 mb-8">
            <div className="text-4xl font-bold text-gray-100 mb-6 text-center">Service Providers</div>
            <div className="mb-6 flex justify-center">
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Search by name or service"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-12 pr-4   bg-black/20 text-white border rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                />
                {/* <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              </div>
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {currentProviders.map((provider) => (
                <motion.div
                  key={provider._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className=" bg-black/80 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition duration-300"
                >
                  <div className="relative">
                    <img
                      src={provider.profile_picture || 'https://via.placeholder.com/300x200'}
                      alt={provider.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-60"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h2 className="text-2xl font-bold mb-1">{provider.name}</h2>
                      <p className="text-sm">{provider.service}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {renderStars(provider.ratingAverage)}
                      <span className="ml-2 text-gray-600">{provider.ratingAverage.toFixed(1)}</span>
                    </div>
                    {/* <p className="text-gray-600 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {provider.location || 'Location not specified'}
                    </p>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {provider.availability || 'Availability not specified'}
                    </p> */}
                    <p className="text-sm text-gray-500 mb-4">{provider.specialization}</p>
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleViewDetails(provider._id)}
                        className="btn btn-outline-primary"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleSlotDetails(provider._id)}
                        className="btn btn-outline-success"
                      >
                        View Slots
                      </button>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredProviders.length === 0 && (
            <p className="text-center text-white text-xl mt-6 bg-gray-800 bg-opacity-75 p-4 rounded-lg">No service providers found.</p>
          )}
          {filteredProviders.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-8 bg-black/80 bg-opacity-90 p-4 rounded-lg">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center w-auto px-2 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300 text-sm"
          >
            <ChevronLeft className="mr-1" /> Previous
          </button>
          <span className="text-gray-100 font-medium text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center w-auto px-2 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-300 text-sm"
          >
            Next <ChevronRight className="ml-1" />
          </button>
        </div>
        
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}