import { useChatStore } from '@/lib/stores/chatStore';
import { roomsApi } from '@/lib/api-client';
import { mockRooms } from '@/lib/mock-data';
import { useGlobalBookingStore } from '@/lib/stores/globalBookingStore';

const HOTEL_KNOWLEDGE = {
  rooms: [
    { name: 'Deluxe King Room', price: '₹7,499/night', capacity: 2, amenities: 'WiFi, Smart TV, Minibar, Room Service, City View' },
    { name: 'Presidential Suite', price: '₹24,999/night', capacity: 4, amenities: 'WiFi, Jacuzzi, Private Balcony, Butler Service, Panoramic View' },
    { name: 'Executive Double Room', price: '₹4,999/night', capacity: 2, amenities: 'WiFi, Work Desk, Coffee Maker, Room Service' },
    { name: 'Garden View Suite', price: '₹12,999/night', capacity: 3, amenities: 'WiFi, Private Terrace, Rain Shower, Garden View' },
    { name: 'Standard Twin Room', price: '₹2,999/night', capacity: 2, amenities: 'WiFi, TV, Air Conditioning' },
    { name: 'The Penthouse', price: '₹49,999/night', capacity: 6, amenities: 'Private Kitchen, Butler Service, 360° Views, Jacuzzi, Wine Cellar' },
  ],
  checkin: '3:00 PM',
  checkout: '11:00 AM',
  address: '123 Luxury Avenue, Paradise City',
  phone: '+1 (555) 123-4567',
  amenities: ['24/7 Room Service', 'Spa & Wellness Center', 'Rooftop Pool', 'Fine Dining Restaurant', 'Fitness Center', 'Concierge Service', 'Valet Parking', 'Free High-Speed WiFi'],
  policies: {
    cancellation: 'Free cancellation up to 48 hours before check-in.',
    pets: 'Pet-friendly rooms available on request (additional fee applies).',
    parking: 'Complimentary valet parking for all guests.',
  },
};

function generateResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Room & pricing questions
  if (msg.includes('room') || msg.includes('suite') || msg.includes('stay') || msg.includes('accommodation')) {
    const roomList = HOTEL_KNOWLEDGE.rooms
      .map(r => `• **${r.name}** — ${r.price} (up to ${r.capacity} guests)\n  _${r.amenities}_`)
      .join('\n\n');
    return `We have 6 luxurious accommodations available:\n\n${roomList}\n\nWould you like to book any of these? Visit our Rooms page to check availability!`;
  }

  if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('cheap') || msg.includes('budget') || msg.includes('afford')) {
    return `Our rates range from **₹2,999/night** (Standard Twin) to **₹49,999/night** (The Penthouse).\n\n🏷️ Use code **WELCOME20** for 20% off your first booking!\n\nHere's a quick overview:\n• Standard Twin — ₹2,999\n• Executive Double — ₹4,999\n• Deluxe King — ₹7,499\n• Garden View Suite — ₹12,999\n• Presidential Suite — ₹24,999\n• The Penthouse — ₹49,999`;
  }

  // Check-in/check-out
  if (msg.includes('check-in') || msg.includes('checkin') || msg.includes('check in')) {
    return `Check-in time is **${HOTEL_KNOWLEDGE.checkin}**. Early check-in may be available upon request, subject to availability. Just let the front desk know!`;
  }

  if (msg.includes('check-out') || msg.includes('checkout') || msg.includes('check out')) {
    return `Check-out time is **${HOTEL_KNOWLEDGE.checkout}**. Late check-out can be arranged for an additional fee. Contact the front desk to request it.`;
  }

  // Amenities
  if (msg.includes('amenity') || msg.includes('amenities') || msg.includes('facility') || msg.includes('facilities') || msg.includes('pool') || msg.includes('spa') || msg.includes('gym') || msg.includes('fitness')) {
    const amenityList = HOTEL_KNOWLEDGE.amenities.map(a => `• ${a}`).join('\n');
    return `Here are our hotel amenities:\n\n${amenityList}\n\nAll amenities are complimentary for our guests!`;
  }

  // Booking
  if (msg.includes('book') || msg.includes('reserv')) {
    return `To make a booking:\n\n1. Browse our available rooms on the **Rooms** page\n2. Select your dates and room type\n3. Fill in your details and confirm\n\n🏷️ Don't forget to use promo code **WELCOME20** for 20% off your first stay!\n\nNeed help choosing a room? Just ask me!`;
  }

  // Cancellation
  if (msg.includes('cancel') || msg.includes('refund')) {
    return `**Cancellation Policy:** ${HOTEL_KNOWLEDGE.policies.cancellation}\n\nFor cancellations within 48 hours of check-in, a one-night charge may apply. Contact us at ${HOTEL_KNOWLEDGE.phone} for assistance with modifications.`;
  }

  // Parking
  if (msg.includes('parking') || msg.includes('car') || msg.includes('valet')) {
    return `🚗 ${HOTEL_KNOWLEDGE.policies.parking}\n\nSelf-parking is also available in our secured underground garage.`;
  }

  // Pets
  if (msg.includes('pet') || msg.includes('dog') || msg.includes('cat') || msg.includes('animal')) {
    return `🐾 ${HOTEL_KNOWLEDGE.policies.pets}\n\nWe provide pet beds, bowls, and treats upon request. Please inform us at the time of booking.`;
  }

  // Location & contact
  if (msg.includes('location') || msg.includes('address') || msg.includes('where') || msg.includes('direction') || msg.includes('map')) {
    return `📍 We're located at **${HOTEL_KNOWLEDGE.address}**.\n\nWe're easily accessible from the airport (20 min drive) and the city center (5 min walk). Need directions? Call us at ${HOTEL_KNOWLEDGE.phone}.`;
  }

  if (msg.includes('contact') || msg.includes('phone') || msg.includes('call') || msg.includes('email')) {
    return `You can reach us at:\n\n📞 **Phone:** ${HOTEL_KNOWLEDGE.phone}\n📍 **Address:** ${HOTEL_KNOWLEDGE.address}\n\nOur front desk is available 24/7!`;
  }

  // WiFi
  if (msg.includes('wifi') || msg.includes('internet') || msg.includes('wi-fi')) {
    return `📶 **Free high-speed WiFi** is available throughout the hotel — in all rooms, lobby, restaurant, and pool area. No password needed, just connect to "Lotus Heaven Guest".`;
  }

  // Food & dining
  if (msg.includes('food') || msg.includes('restaurant') || msg.includes('breakfast') || msg.includes('dinner') || msg.includes('dining') || msg.includes('eat')) {
    return `🍽️ **Dining at Lotus Heaven:**\n\n• **The Golden Lotus** — Fine dining, open 6 PM - 11 PM\n• **Garden Café** — Casual dining & breakfast buffet, 6 AM - 10 PM\n• **Rooftop Bar** — Cocktails & light bites, 4 PM - midnight\n• **Room Service** — Available 24/7\n\nBreakfast is complimentary for all suite bookings!`;
  }

  // Greetings
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good evening')) {
    return `Hello! Welcome to Lotus Heaven! 🌸\n\nI can help you with:\n• 🏨 Room information & availability\n• 💰 Pricing & promotions\n• 📋 Booking assistance\n• 🏊 Hotel amenities & facilities\n• 📍 Location & directions\n\nWhat would you like to know?`;
  }

  // Thank you
  if (msg.includes('thank') || msg.includes('thanks')) {
    return `You're welcome! 😊 It's my pleasure to help. If you need anything else during your stay or while planning your visit, don't hesitate to ask!\n\n🌟 We look forward to welcoming you at Lotus Heaven!`;
  }

  // Default / fallback
  return `I'd be happy to help! Here are some things I can assist with:\n\n• 🏨 **Rooms & Suites** — types, pricing, amenities\n• 📅 **Bookings** — how to reserve, modify, or cancel\n• 🏊 **Amenities** — pool, spa, gym, dining\n• 🕐 **Check-in/out** — times and policies\n• 📍 **Location** — directions and contact info\n• 🐾 **Pet Policy** — pet-friendly options\n\nJust ask me anything specific!`;
}

export const useAIChat = () => {
  const { messages, addMessage, isTyping, setIsTyping } = useChatStore();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    addMessage('user', content);
    setIsTyping(true);

    // Simulate slight delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const msg = content.toLowerCase();
    
    // Check if user has intent to book
    const isBookingIntent = msg.includes('book') || msg.includes('stay in') || msg.includes('reserve') || msg.includes('checkout');
    
    if (isBookingIntent) {
      let rooms: any[] = [];
      try {
        const result = await roomsApi.getAll();
        rooms = Array.isArray(result) ? result : (result.data ?? []);
      } catch (err) {
        console.error('Failed to fetch rooms in AI chat:', err);
      }
      if (!rooms || rooms.length === 0) {
        rooms = mockRooms;
      }
      
      let matchedRoom = null;
      if (msg.includes('deluxe') || msg.includes('king')) {
        matchedRoom = rooms.find(r => r.name.toLowerCase().includes('deluxe') || r.name.toLowerCase().includes('king'));
      } else if (msg.includes('presidential')) {
        matchedRoom = rooms.find(r => r.name.toLowerCase().includes('presidential'));
      } else if (msg.includes('executive') || msg.includes('double')) {
        matchedRoom = rooms.find(r => r.name.toLowerCase().includes('executive') || r.name.toLowerCase().includes('double'));
      } else if (msg.includes('garden')) {
        matchedRoom = rooms.find(r => r.name.toLowerCase().includes('garden'));
      } else if (msg.includes('twin') || msg.includes('standard')) {
        matchedRoom = rooms.find(r => r.name.toLowerCase().includes('standard') || r.name.toLowerCase().includes('twin'));
      } else if (msg.includes('penthouse')) {
        matchedRoom = rooms.find(r => r.name.toLowerCase().includes('penthouse'));
      }
      
      if (matchedRoom) {
        useGlobalBookingStore.getState().openBooking(matchedRoom);
        const response = `I've opened the booking assistant for the **${matchedRoom.name}** for you! Please complete the dates and guest count in the checkout window.`;
        addMessage('assistant', response);
        setIsTyping(false);
        return;
      }
    }

    const response = generateResponse(content);
    addMessage('assistant', response);
    setIsTyping(false);
  };

  const clearChat = () => {
    useChatStore.getState().clearMessages();
  };

  return { messages, isLoading: isTyping, sendMessage, clearChat };
};
