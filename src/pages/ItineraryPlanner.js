import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  MoreVertical,
  Menu,
  Trash2,
  Link,
  Plus,
} from "lucide-react";

const ItineraryPlanner = () => {
  const [itinerary, setItinerary] = useState([
    {
      id: 1,
      name: "India Gate",
      rating: 4.6,
      reviews: 281124,
      description:
        "India Gate is a war memorial located in New Delhi, along the Rajpath. It is dedicated to the 82,000 soldiers, both Indian and British.",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
      color: "bg-purple-500",
      number: 1,
    },
    {
      id: 2,
      name: "Red Fort",
      rating: 4.5,
      reviews: 168720,
      description:
        "The Red Fort is a historical fort in the old Delhi area, on the banks of Yamuna.",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
      color: "bg-red-500",
      number: 2,
    },
    {
      id: 3,
      name: "Qutub Minar",
      rating: 4.5,
      reviews: 151556,
      description:
        "Qutub Minar is a minaret or a victory tower located in the Qutub complex, a UNESCO World Heritage Site in Delhi's Mehrauli area.",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&h=300&fit=crop",
      color: "bg-purple-600",
      number: 3,
    },
    {
      id: 4,
      name: "Lotus Temple",
      rating: 4.5,
      reviews: 67772,
      description:
        "Located in the national capital of New Delhi, the Lotus Temple is an edifice dedicated to the Bahai faith.",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      color: "bg-gray-700",
      number: 4,
    },
    {
      id: 5,
      name: "Humayun's tomb",
      rating: 4.5,
      reviews: 46024,
      description:
        "Humayun's tomb is the final resting place of the Mughal Emperor Humayun.",
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
      color: "bg-green-600",
      number: 5,
    },
    {
      id: 6,
      name: "Jama Masjid",
      rating: 4.4,
      reviews: 52340,
      description:
        "Jama Masjid of Delhi is one of the largest mosques in India, located in Old Delhi.",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
      color: "bg-blue-600",
      number: 6,
    },
    {
      id: 7,
      name: "Akshardham Temple",
      rating: 4.7,
      reviews: 89234,
      description:
        "Akshardham is a Hindu temple complex in Delhi, showcasing millennia of traditional Hindu culture.",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      color: "bg-orange-600",
      number: 7,
    },
    {
      id: 8,
      name: "Chandni Chowk",
      rating: 4.3,
      reviews: 71298,
      description:
        "Chandni Chowk is one of the oldest and busiest markets in Old Delhi, India.",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&h=300&fit=crop",
      color: "bg-yellow-600",
      number: 8,
    },
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchDraggedItem, setTouchDraggedItem] = useState(null);
  const draggedRef = useRef(null);
  const containerRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Auto-scroll functionality
  const startAutoScroll = (direction, speed = 1) => {
    if (scrollIntervalRef.current) return;
    
    setIsAutoScrolling(true);
    scrollIntervalRef.current = setInterval(() => {
      if (containerRef.current) {
        const scrollAmount = direction === 'up' ? -10 * speed : 10 * speed;
        containerRef.current.scrollBy(0, scrollAmount);
      }
    }, 16); // ~60fps
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsAutoScrolling(false);
  };

  const handleAutoScroll = (clientY) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollThreshold = 100;
    const maxSpeed = 3;

    // Calculate distance from edges
    const distanceFromTop = clientY - rect.top;
    const distanceFromBottom = rect.bottom - clientY;

    if (distanceFromTop < scrollThreshold && container.scrollTop > 0) {
      // Near top edge - scroll up
      const speed = Math.max(1, maxSpeed * (1 - distanceFromTop / scrollThreshold));
      startAutoScroll('up', speed);
    } else if (distanceFromBottom < scrollThreshold && 
               container.scrollTop < (container.scrollHeight - container.clientHeight)) {
      // Near bottom edge - scroll down
      const speed = Math.max(1, maxSpeed * (1 - distanceFromBottom / scrollThreshold));
      startAutoScroll('down', speed);
    } else {
      stopAutoScroll();
    }
  };

  // Desktop drag handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    setIsDragging(true);
    draggedRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDragging(false);
    draggedRef.current = null;
    stopAutoScroll();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    handleAutoScroll(e.clientY);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedRef.current !== null && draggedRef.current !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    stopAutoScroll();

    if (draggedItem === null || draggedItem === dropIndex) {
      return;
    }

    reorderItems(draggedItem, dropIndex);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e, index) => {
    // Only handle touch on drag handle
    if (!e.target.closest('.drag-handle')) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY, index });
    setTouchDraggedItem(index);
    setIsDragging(true);
    draggedRef.current = index;
  };

  const handleTouchMove = (e) => {
    if (!touchStart || touchDraggedItem === null) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // Start dragging after minimum movement
    if (deltaY > 10) {
      setDraggedItem(touchDraggedItem);
      
      // Handle auto-scroll
      handleAutoScroll(touch.clientY);
      
      // Find drop target
      const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
      const dropTarget = elements.find(el => el.closest('.drop-zone'));
      
      if (dropTarget) {
        const dropIndex = parseInt(dropTarget.closest('.drop-zone').dataset.index);
        if (dropIndex !== touchDraggedItem) {
          setDragOverIndex(dropIndex);
        }
      } else {
        setDragOverIndex(null);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || touchDraggedItem === null) return;
    
    e.preventDefault();
    stopAutoScroll();
    
    if (draggedItem !== null && dragOverIndex !== null && draggedItem !== dragOverIndex) {
      reorderItems(draggedItem, dragOverIndex);
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchDraggedItem(null);
    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDragging(false);
    draggedRef.current = null;
  };

  // Reorder items function
  const reorderItems = (fromIndex, toIndex) => {
    const newItinerary = [...itinerary];
    const draggedCard = newItinerary[fromIndex];

    newItinerary.splice(fromIndex, 1);
    const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    newItinerary.splice(insertIndex, 0, draggedCard);

    // Update numbers
    const updatedItinerary = newItinerary.map((item, index) => ({
      ...item,
      number: index + 1,
    }));

    setItinerary(updatedItinerary);
    setDragOverIndex(null);
  };

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  const ActivityCard = ({ activity, index, isDraggedOver, isDraggedItem }) => (
    <div
      className={`drop-zone ${
        isDraggedOver
          ? "border-2 border-blue-400 bg-blue-50 transform scale-[1.02] shadow-lg"
          : ""
      }`}
      data-index={index}
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={(e) => handleDragEnter(e, index)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, index)}
      onTouchStart={(e) => handleTouchStart(e, index)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`
          bg-white rounded-lg p-3 md:p-4 mb-3 shadow-sm border border-gray-100
          cursor-move transition-all duration-300 ease-out
          hover:shadow-md hover:border-gray-200
          ${
            isDraggedItem
              ? "opacity-60 transform rotate-1 scale-105 shadow-xl z-50"
              : ""
          }
          ${
            isDragging && !isDraggedItem
              ? "transition-transform duration-300"
              : ""
          }
        `}
        style={{
          zIndex: isDraggedItem ? 1000 : 1,
        }}
      >
        <div className="flex items-start space-x-3">
          {/* Drag Handle - Mobile */}
          <div className="drag-handle flex md:hidden items-center justify-center w-8 h-8 flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing touch-none">
            <div className="flex flex-col space-y-0.5">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>

          {/* Activity Number - Desktop */}
          <div className="hidden md:flex items-center justify-center w-8 h-8 flex-shrink-0 mt-1">
            <div
              className={`w-6 h-6 rounded-full ${activity.color} flex items-center justify-center`}
            >
              <span className="text-xs font-bold text-white">
                {activity.number}
              </span>
            </div>
          </div>

          {/* Activity Image */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={activity.image}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Activity Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 leading-tight">
                  {activity.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {activity.rating}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    ({activity.reviews.toLocaleString()})
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {activity.description}
                </p>
              </div>

              {/* Action Icons */}
              <div className="flex items-start space-x-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <MapPin className="w-4 h-4 text-blue-500" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Link className="w-4 h-4 text-gray-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drag Handle - Desktop */}
        <div className="hidden md:flex justify-center mt-3 opacity-40 drag-handle cursor-grab active:cursor-grabbing">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const CreateButton = () => (
    <div className="bg-white rounded-lg p-3 md:p-4 mb-3 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3">
        {/* Drag Handle - Mobile (disabled for create button) */}
        <div className="flex md:hidden items-center justify-center w-8 h-8 flex-shrink-0 opacity-30">
          <div className="flex flex-col space-y-0.5">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Create Button Icon */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">Cr</span>
        </div>

        {/* Create Button Text */}
        <div className="flex-1">
          <span className="text-gray-500 text-sm">Create...</span>
        </div>

        {/* Plus Icon */}
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="md:hidden max-w-sm mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-pink-500">Y2Z TRAVEL</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Auto-scroll indicator */}
        {isAutoScrolling && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs z-50 shadow-lg">
            Auto-scrolling...
          </div>
        )}

        {/* Drag instruction */}
        <div className="p-4 pb-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-blue-700 text-center">
              <span className="inline-flex items-center mr-1">
                <div className="flex flex-col space-y-0.5">
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                </div>
              </span>
              Touch and drag the grip icon to reorder items
            </p>
          </div>
        </div>

        {/* Itinerary Section */}
        <div 
          ref={containerRef}
          className="px-4 pb-8 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Itinerary</h2>
            <p className="text-sm text-gray-500">Day</p>
          </div>

          {/* Activity Cards */}
          <div className="space-y-2 relative">
            {itinerary.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                isDraggedOver={dragOverIndex === index && draggedItem !== index}
                isDraggedItem={draggedItem === index}
              />
            ))}
            <CreateButton />
          </div>

          {/* Add Activity Button */}
          <button className="w-full mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium">
            + Add Activity
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen">
        {/* Left Panel - Itinerary */}
        <div className="w-1/2 bg-white">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-pink-500 mb-4">
              Y2Z TRAVEL
            </h1>
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Itinerary
              </h2>
              <p className="text-gray-500">Day</p>
            </div>
          </div>

          {/* Auto-scroll indicator */}
          {isAutoScrolling && (
            <div className="absolute top-32 left-6 bg-blue-500 text-white px-3 py-1 rounded-full text-xs z-50 shadow-lg">
              Auto-scrolling...
            </div>
          )}

          {/* Activity Cards */}
          <div
            ref={containerRef}
            className="p-6 space-y-3 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            {itinerary.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                isDraggedOver={dragOverIndex === index && draggedItem !== index}
                isDraggedItem={draggedItem === index}
              />
            ))}
            <CreateButton />
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-1/2 relative">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
            {/* Map placeholder with realistic elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-8 h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map text overlay */}
            <div className="absolute bottom-8 right-8 text-6xl font-bold text-gray-300 opacity-50 transform rotate-45">
              MAP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanner;