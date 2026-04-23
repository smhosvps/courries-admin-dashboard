// frontend/src/pages/admin/deliveries/[id].tsx
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  MapPin,
  Package,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Star,
  Truck,
  CheckCircle,
  X,
  Calendar,
  Weight,
  Ruler,
  CreditCard,
  TrendingUp,
  Shield,
  Award,
  Navigation,
  Loader2,
  Map,
  Navigation2,
  Circle,
  Flag
} from 'lucide-react';

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { formatDate, formatDistance, formatDuration, formatCurrency } from '@/utils/formatters';
import { useAssignDeliveryToPartnerMutation, useGetAvailablePartnersQuery, useGetDeliveryDetailsQuery } from '@/redux/features/adminDeliveryApi.ts/adminDeliveryApi';


// Updated Map Component
const DeliveryMap = ({ pickup, delivery }: { pickup: any; delivery: any }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapError, setMapError] = useState(false);

  // Extract coordinates
  const pickupCoords = pickup?.location?.coordinates || [];
  const deliveryCoords = delivery?.location?.coordinates || [];
  
  const hasValidPickup = pickupCoords.length === 2 && pickupCoords[0] && pickupCoords[1];
  const hasValidDelivery = deliveryCoords.length === 2 && deliveryCoords[0] && deliveryCoords[1];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!hasValidPickup && !hasValidDelivery) return;

    try {
      // Calculate center point
      const centerLat = hasValidPickup ? pickupCoords[1] : deliveryCoords[1];
      const centerLng = hasValidPickup ? pickupCoords[0] : deliveryCoords[0];

      // Initialize map with free tile provider
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors'
            }
          },
          layers: [{
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }]
        },
        center: [centerLng, centerLat],
        zoom: 13
      });

      // Add navigation control
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add markers when map loads
      map.current.on('load', () => {
        // Add pickup marker
        if (hasValidPickup) {
          const pickupEl = document.createElement('div');
          pickupEl.className = 'w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
          pickupEl.innerHTML = '<span class="text-white text-xs font-bold">P</span>';
          
          new maplibregl.Marker({ element: pickupEl })
            .setLngLat([pickupCoords[0], pickupCoords[1]])
            .setPopup(new maplibregl.Popup().setHTML(`
              <div class="p-2">
                <strong class="text-green-600">Pickup Location</strong><br>
                ${pickup.address || ''}<br>
                Contact: ${pickup.contactName || ''}
              </div>
            `))
            .addTo(map.current!);
        }

        // Add delivery marker
        if (hasValidDelivery) {
          const deliveryEl = document.createElement('div');
          deliveryEl.className = 'w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
          deliveryEl.innerHTML = '<span class="text-white text-xs font-bold">D</span>';
          
          new maplibregl.Marker({ element: deliveryEl })
            .setLngLat([deliveryCoords[0], deliveryCoords[1]])
            .setPopup(new maplibregl.Popup().setHTML(`
              <div class="p-2">
                <strong class="text-red-600">Delivery Location</strong><br>
                ${delivery.address || ''}<br>
                Contact: ${delivery.contactName || ''}
              </div>
            `))
            .addTo(map.current!);
        }

        // Fit bounds to show both markers
        if (hasValidPickup && hasValidDelivery) {
          const bounds = new maplibregl.LngLatBounds()
            .extend([pickupCoords[0], pickupCoords[1]])
            .extend([deliveryCoords[0], deliveryCoords[1]]);
          
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      });

    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [pickup, delivery]);

  if (!hasValidPickup && !hasValidDelivery) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No location coordinates available</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Map className="h-12 w-12 text-red-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">Failed to load map</p>
          <button 
            onClick={() => setMapError(false)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Map Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Pickup</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Delivery</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        {hasValidPickup && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${pickupCoords[1]},${pickupCoords[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors shadow-lg"
            title="Navigate to pickup"
          >
            <Navigation2 className="h-4 w-4 text-green-600" />
          </a>
        )}
        {hasValidDelivery && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${deliveryCoords[1]},${deliveryCoords[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors shadow-lg"
            title="Navigate to delivery"
          >
            <Flag className="h-4 w-4 text-red-600" />
          </a>
        )}
      </div>
    </div>
  );
};

// Avatar Component with Fallback
const Avatar = ({ user, size = 'md' }: { user: any; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-lg',
    lg: 'h-16 w-16 text-xl'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || user.fullName}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
      />
    );
  }

  // Generate consistent color based on user ID or name
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-yellow-500 to-yellow-600',
    'from-red-500 to-red-600',
    'from-indigo-500 to-indigo-600'
  ];
  
  const colorIndex = (user?._id?.charCodeAt(0) || 0) % colors.length;
  const gradientColor = colors[colorIndex];

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-md`}>
      <User className={`${iconSizes[size]} text-white`} />
    </div>
  );
};

export default function DeliveryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);

  const { data: deliveryData, isLoading: deliveryLoading } = useGetDeliveryDetailsQuery(
    id as string,
    { skip: !id }
  );

  console.log(deliveryData);

  const { data: partnersData, isLoading: partnersLoading } = useGetAvailablePartnersQuery(undefined, {
    skip: !showAssignModal
  });

  const [assignDelivery, { isLoading: assigning }] = useAssignDeliveryToPartnerMutation();

  const delivery = deliveryData?.data;
  const partners = partnersData?.data || [];

  const handleAssign = async () => {
    if (!selectedPartner) return;

    try {
      await assignDelivery({
        deliveryId: id as string,
        partnerId: selectedPartner,
      }).unwrap();
      
      setAssignSuccess(true);
      setTimeout(() => {
        setShowAssignModal(false);
        setAssignSuccess(false);
        setSelectedPartner(null);
      }, 2000);
    } catch (error) {
      console.error('Assign error:', error);
    }
  };

  if (deliveryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading delivery details...</p>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Delivery Not Found</h2>
          <p className="text-gray-600 mb-4">The delivery you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/deliveries')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Deliveries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-6 px-4 ">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard-super-admin/manage-deliveries')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Deliveries
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Delivery 
                </h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {delivery.trackingId}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Status: {delivery.status}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Payment: {delivery.paymentStatus}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {delivery.deliveryType}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-[6px] hover:bg-blue-700 flex items-center gap-2 transition-colors shadow-sm"
            >
              <User className="h-5 w-5" />
              Assign to Partner
            </button>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Map className="h-5 w-5 mr-2 text-blue-600" />
              Route Map
            </h2>
            <button
              onClick={() => setShowFullMap(!showFullMap)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Navigation className="h-4 w-4" />
              {showFullMap ? 'Show Less' : 'Expand Map'}
            </button>
          </div>
          
          <div className={showFullMap ? 'h-96' : 'h-64'}>
            <DeliveryMap pickup={delivery.pickup} delivery={delivery.delivery} />
          </div>

          {/* Location Summary */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
              <Circle className="h-4 w-4 text-green-600 fill-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Pickup</p>
                <p className="text-green-700">{delivery.pickup.address}</p>
                {delivery.pickup.location?.coordinates && (
                  <p className="text-xs text-green-600 mt-1">
                    Lat: {delivery.pickup.location.coordinates[1]?.toFixed(6)}, 
                    Lng: {delivery.pickup.location.coordinates[0]?.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
              <MapPin className="h-4 w-4 text-red-600 fill-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Delivery</p>
                <p className="text-red-700">{delivery.delivery.address}</p>
                {delivery.delivery.location?.coordinates && (
                  <p className="text-xs text-red-600 mt-1">
                    Lat: {delivery.delivery.location.coordinates[1]?.toFixed(6)}, 
                    Lng: {delivery.delivery.location.coordinates[0]?.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Delivery Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Customer Information
              </h2>
              <div className="flex items-start">
                <Avatar user={delivery.customer} size="lg" />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {delivery.customer.fullName}
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{delivery.customer.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{delivery.customer.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Customer since {formatDate(delivery.customer.joinedAt, { format: 'long' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup & Delivery Locations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Pickup & Delivery Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup */}
                <div className="relative">
                  <div className="absolute -left-2 top-0 h-full w-0.5 bg-green-200"></div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></div>
                    Pickup Location
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar user={delivery.pickup} size="sm" />
                      <p className="text-gray-900 font-medium">
                        {delivery.pickup.contactName}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      {delivery.pickup.contactPhone}
                    </p>
                    <p className="text-gray-700 mt-3 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{delivery.pickup.address}</span>
                    </p>
                    {delivery.pickup.instructions && (
                      <p className="text-gray-500 text-sm mt-3 italic bg-white p-2 rounded border border-green-100">
                        📝 Note: {delivery.pickup.instructions}
                      </p>
                    )}
                    {delivery.pickup.scheduledTime && (
                      <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        Scheduled: {formatDate(delivery.pickup.scheduledTime, { includeTime: true })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery */}
                <div className="relative">
                  <div className="absolute -left-2 top-0 h-full w-0.5 bg-red-200"></div>
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <div className="h-2.5 w-2.5 bg-red-500 rounded-full mr-2"></div>
                    Delivery Location
                  </h3>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar user={delivery.delivery} size="sm" />
                      <p className="text-gray-900 font-medium">
                        {delivery.delivery.contactName}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-red-600" />
                      {delivery.delivery.contactPhone}
                    </p>
                    <p className="text-gray-700 mt-3 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{delivery.delivery.address}</span>
                    </p>
                    {delivery.delivery.instructions && (
                      <p className="text-gray-500 text-sm mt-3 italic bg-white p-2 rounded border border-red-100">
                        📝 Note: {delivery.delivery.instructions}
                      </p>
                    )}
                    {delivery.delivery.scheduledTime && (
                      <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-600" />
                        Scheduled: {formatDate(delivery.delivery.scheduledTime, { includeTime: true })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Distance & Duration */}
              {(delivery.distance || delivery.estimatedDuration) && (
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                  {delivery.distance && (
                    <div className="flex items-center text-gray-600">
                      <Navigation className="h-4 w-4 mr-1 text-blue-600" />
                      Distance: {formatDistance(delivery.distance)}
                    </div>
                  )}
                  {delivery.estimatedDuration && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1 text-blue-600" />
                      Est. Duration: {formatDuration(delivery.estimatedDuration)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Package Details
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="font-medium text-gray-900 capitalize flex items-center gap-1">
                    <Package className="h-4 w-4 text-blue-600" />
                    {delivery.package.type}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Weight</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Weight className="h-4 w-4 text-blue-600" />
                    {delivery.package.weight} kg
                  </p>
                </div>
                {delivery.package.dimensions && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-blue-600" />
                      {delivery.package.dimensions.length} x {delivery.package.dimensions.width} x {delivery.package.dimensions.height} cm
                    </p>
                  </div>
                )}
                {delivery.package.value && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Declared Value</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      {formatCurrency(delivery.package.value)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{delivery.package.description}</p>
              </div>

              {delivery.package.images && delivery.package.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-3">Package Images</p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {delivery.package.images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Package ${index + 1}`}
                        className="h-20 w-20 rounded-lg object-cover border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing & Timeline */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Pricing Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    Base Price
                  </span>
                  <span className="font-medium text-gray-900">{formatCurrency(delivery.basePrice || 0)}</span>
                </div>
                
                {delivery.distanceFee > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-gray-400" />
                      Distance Fee
                    </span>
                    <span className="font-medium text-gray-900">{formatCurrency(delivery.distanceFee)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    Service Fee
                  </span>
                  <span className="font-medium text-gray-900">{formatCurrency(delivery.serviceFee || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    Tax
                  </span>
                  <span className="font-medium text-gray-900">{formatCurrency(delivery.tax || 0)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 mt-2 bg-blue-50 -mx-2 px-2 rounded-lg">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-blue-600">{formatCurrency(delivery.totalAmount)}</span>
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-gray-500">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </span>
                    <span className="font-medium capitalize">{delivery.paymentMethod}</span>
                  </div>
                  
                  {delivery.paidAt && (
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Paid On
                      </span>
                      <span className="font-medium">{formatDate(delivery.paidAt, { includeTime: true })}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Timeline
              </h2>
              <div className="space-y-4">
                {delivery.timeline?.map((event: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="relative flex items-center justify-center">
                      <div className={`h-3 w-3 rounded-full ${
                        index === 0 ? 'bg-green-500 ring-4 ring-green-100' : 'bg-blue-500'
                      }`} />
                      {index < delivery.timeline.length - 1 && (
                        <div className="absolute top-3 left-1.5 h-full w-0.5 bg-gray-200" />
                      )}
                    </div>
                    <div className="ml-4 flex-1 pb-4">
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {event.status.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.timestamp, { includeTime: true })}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          Location recorded
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Partner Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assign Delivery to Partner
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {assignSuccess ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Successfully Assigned!</h4>
                  <p className="text-gray-600">
                    Delivery has been assigned to the partner
                  </p>
                </div>
              ) : (
                <>
                  {partnersLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                      <p className="text-gray-600">Loading available partners...</p>
                    </div>
                  ) : partners.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-yellow-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="h-12 w-12 text-yellow-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No Available Partners</h4>
                      <p className="text-gray-600">There are no available delivery partners at the moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {partners.map((partner: any) => (
                        <button
                          key={partner._id}
                          onClick={() => setSelectedPartner(partner._id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            selectedPartner === partner._id
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <Avatar user={partner} size="md" />
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900">{partner.name}</h4>
                                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                                  <Star className="h-3 w-3 text-yellow-600 fill-yellow-600 mr-1" />
                                  <span className="text-xs font-medium text-yellow-700">
                                    {partner.rating?.toFixed(1) || '0.0'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Truck className="h-3 w-3" />
                                  {partner.vehicle?.type || 'No vehicle'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Award className="h-3 w-3" />
                                  {partner.totalDeliveries || 0} deliveries
                                </span>
                                <span className="flex items-center gap-1">
                                  <div className={`h-2 w-2 rounded-full ${
                                    partner.online ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                                  }`} />
                                  <span className="text-xs text-gray-600">
                                    {partner.online ? 'Online' : 'Offline'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {!assignSuccess && partners.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedPartner(null);
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedPartner || assigning}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {assigning ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      'Assign Delivery'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}