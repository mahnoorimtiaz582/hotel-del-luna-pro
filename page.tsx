'use client';
import { useState, useEffect } from 'react';

interface Room {
  id: number;
  name: string;
  capacity: number;
  price: number;
  available: boolean;
}

const DEMO_ROOMS: Room[] = [
  { id: 1, name: "Presidential Suite", capacity: 6, price: 1200, available: true },
  { id: 2, name: "Deluxe Room", capacity: 4, price: 800, available: true },
  { id: 3, name: "Comfort Room", capacity: 3, price: 500, available: true },
  { id: 4, name: "Standard Room", capacity: 2, price: 300, available: true },
];

// Fixed star positions (pre-generated)
const STARS = Array.from({ length: 60 }, (_, i) => ({
  top: (i * 17) % 100,
  left: (i * 13) % 100,
  width: ((i * 7) % 15) / 10 + 0.8,
  height: ((i * 11) % 15) / 10 + 0.8,
  opacity: ((i * 3) % 30) / 100 + 0.3
}));

export default function Home() {
  const [guests, setGuests] = useState<number>(2);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAvailable, setTotalAvailable] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Calendar States
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3));
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [bookedDates] = useState<Set<string>>(new Set([
    '2026-04-05', '2026-04-06', '2026-04-12', '2026-04-13',
    '2026-04-14', '2026-04-20', '2026-04-21', '2026-04-27'
  ]));
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);

  useEffect(() => {
    setMounted(true);
    searchRooms();
  }, []);

  useEffect(() => {
    if (mounted) {
      searchRooms();
    }
  }, [guests]);

  const searchRooms = () => {
    setLoading(true);
    setTimeout(() => {
      const available = DEMO_ROOMS.filter(r => r.capacity >= guests);
      setRooms(available);
      setTotalAvailable(available.length);
      setLoading(false);
    }, 300);
  };

  const formatDateKey = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: any[] = [];
    for (let i = 0; i < startOffset; i++) {
      days.push({ type: 'empty', key: `empty-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = formatDateKey(year, month, d);
      days.push({
        type: 'day',
        day: d,
        dateKey,
        isBooked: bookedDates.has(dateKey),
        isSelected: selectedDates.has(dateKey)
      });
    }
    return days;
  };

  const toggleDate = (dateKey: string) => {
    if (bookedDates.has(dateKey)) return;
    setSelectedDates(prev => {
      const newSet = new Set(prev);
      newSet.has(dateKey) ? newSet.delete(dateKey) : newSet.add(dateKey);
      return newSet;
    });
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    setSelectedDates(new Set());
  };

  const handleReserve = (room: Room) => {
    setSelectedRoomForBooking(room);
    setShowCalendar(true);
  };

  const confirmBooking = () => {
    if (selectedDates.size === 0) {
      alert('✨ Please select at least one night.');
      return;
    }
    const sortedDates = Array.from(selectedDates).sort();
    alert(`✨ Reservation Confirmed! ✨\n\nRoom: ${selectedRoomForBooking?.name}\nNights: ${selectedDates.size}\nTotal: $${selectedDates.size * (selectedRoomForBooking?.price || 0)}`);
    setShowCalendar(false);
    setSelectedDates(new Set());
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const calendarDays = generateCalendarDays();

  const SilverCrown = () => (
    <svg width="50" height="40" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto', display: 'block', opacity: 0.7 }}>
      <path d="M10 70 L15 20 L35 40 L50 10 L65 40 L85 20 L90 70 Z" fill="#A8A8B8" stroke="#C0C0C0" strokeWidth="2" />
      <circle cx="50" cy="10" r="6" fill="#D4D4DC" />
      <circle cx="25" cy="30" r="5" fill="#B8B8C8" />
      <circle cx="75" cy="30" r="5" fill="#B8B8C8" />
      <rect x="15" y="70" width="70" height="8" rx="2" fill="#9090A0" />
    </svg>
  );

  const SmallSilverCrown = () => (
    <svg width="30" height="24" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto', display: 'block', opacity: 0.6 }}>
      <path d="M6 42 L9 12 L21 24 L30 6 L39 24 L51 12 L54 42 Z" fill="#A8A8B8" stroke="#C0C0C0" strokeWidth="1.5" />
      <circle cx="30" cy="6" r="4" fill="#D4D4DC" />
      <circle cx="15" cy="18" r="3" fill="#B8B8C8" />
      <circle cx="45" cy="18" r="3" fill="#B8B8C8" />
      <rect x="9" y="42" width="42" height="5" rx="2" fill="#9090A0" />
    </svg>
  );

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d1a 30%, #050510 100%)',
      padding: '40px 20px',
      position: 'relative',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Moon */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '12%',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #f5f3e8, #e8e4d8, #d4cfc0)',
        boxShadow: '0 0 15px rgba(200,195,180,0.3)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Fixed Stars */}
      {STARS.map((star, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${star.top}%`,
          left: `${star.left}%`,
          width: `${star.width}px`,
          height: `${star.height}px`,
          borderRadius: '50%',
          background: `rgba(255,250,240,${star.opacity})`,
          pointerEvents: 'none'
        }} />
      ))}

      {/* Calendar Modal */}
      {showCalendar && selectedRoomForBooking && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowCalendar(false)}>
          <div style={{
            maxWidth: '450px',
            width: '90%',
            background: '#12122a',
            borderRadius: '24px',
            padding: '25px',
            border: '0.5px solid rgba(168,168,184,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <SmallSilverCrown />
              <h3 style={{ color: '#c8c8d4' }}>{selectedRoomForBooking.name}</h3>
              <p style={{ color: '#88889a' }}>${selectedRoomForBooking.price}/night</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', color: '#a8a8b8', cursor: 'pointer' }}>←</button>
              <span style={{ color: '#d4d4dc' }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
              <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', color: '#a8a8b8', cursor: 'pointer' }}>→</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} style={{ color: '#666680', fontSize: '0.7rem' }}>{d}</span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '20px' }}>
              {calendarDays.map((item) => {
                if (item.type === 'empty') return <div key={item.key} style={{ aspectRatio: '1/1' }}></div>;
                return (
                  <div key={item.dateKey} onClick={() => toggleDate(item.dateKey)} style={{
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.isBooked ? 'rgba(100,30,30,0.5)' : (item.isSelected ? 'rgba(168,168,184,0.3)' : 'rgba(168,168,184,0.05)'),
                    borderRadius: '6px',
                    color: item.isBooked ? '#996666' : (item.isSelected ? '#d4d4dc' : '#88889a'),
                    cursor: item.isBooked ? 'not-allowed' : 'pointer',
                    fontSize: '0.75rem',
                    textDecoration: item.isBooked ? 'line-through' : 'none'
                  }}>{item.day}</div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px', fontSize: '0.65rem', color: '#666680' }}>
              <span>○ Available</span>
              <span>● Booked</span>
              <span>◉ Selected</span>
            </div>

            <div style={{ borderTop: '0.5px solid rgba(168,168,184,0.2)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a8a8b8' }}>
                <span>Selected nights:</span>
                <span>{selectedDates.size}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d4d4dc', fontSize: '1rem', marginBottom: '15px' }}>
                <span>Total:</span>
                <span>${selectedDates.size * (selectedRoomForBooking?.price || 0)}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setShowCalendar(false); setSelectedDates(new Set()); }} style={{
                  flex: 1, padding: '10px', background: 'transparent', color: '#88889a',
                  border: '0.5px solid rgba(168,168,184,0.3)', borderRadius: '30px', cursor: 'pointer'
                }}>CANCEL</button>
                <button onClick={confirmBooking} style={{
                  flex: 2, padding: '10px', background: 'rgba(168,168,184,0.1)', color: '#d4d4dc',
                  border: '0.5px solid rgba(168,168,184,0.5)', borderRadius: '30px', cursor: 'pointer'
                }}>CONFIRM</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(15, 15, 35, 0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(192,192,192,0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ marginBottom: '10px' }}><SilverCrown /></div>
          <h1 style={{ fontSize: '3.2rem', color: '#d4d4dc', letterSpacing: '6px', fontWeight: '300' }}>
            Hotel Del Luna
          </h1>
          <p style={{ color: '#88889a', fontSize: '0.8rem', letterSpacing: '4px' }}>
            Where elegance meets the eternal
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            min="1"
            max="10"
            style={{
              padding: '12px 24px',
              borderRadius: '40px',
              border: '0.5px solid rgba(168,168,184,0.3)',
              backgroundColor: 'rgba(15,15,35,0.9)',
              color: '#a8a8b8',
              textAlign: 'center'
            }}
          />
          <button onClick={searchRooms} style={{
            padding: '12px 36px',
            background: 'transparent',
            color: '#a8a8b8',
            border: '0.5px solid rgba(168,168,184,0.4)',
            borderRadius: '40px',
            cursor: 'pointer'
          }}>SEARCH ROOMS</button>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#88889a' }}>REVEALING CHAMBERS...</p>}

        {!loading && rooms.length > 0 && (
          <div>
            <h2 style={{ color: '#a8a8b8', textAlign: 'center' }}>
              ✦ {totalAvailable} ROOMS FOR {guests} GUEST(S) ✦
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginTop: '30px' }}>
              {rooms.map((room) => (
                <div key={room.id} style={{
                  background: 'rgba(168,168,184,0.04)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '0.5px solid rgba(168,168,184,0.15)'
                }}>
                  <SmallSilverCrown />
                  <h3 style={{ color: '#c8c8d4', textAlign: 'center' }}>{room.name}</h3>
                  <p style={{ color: '#808090', textAlign: 'center' }}>CAPACITY: {room.capacity} guests</p>
                  <p style={{ color: '#808090', textAlign: 'center' }}>
                    RATE: <span style={{ color: '#b0b0c0' }}>${room.price}</span>/night
                  </p>
                  <p style={{ color: '#6a8a6a', textAlign: 'center' }}>✦ AVAILABLE ✦</p>
                  <button onClick={() => handleReserve(room)} style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '20px',
                    background: 'transparent',
                    color: '#9090a0',
                    border: '0.5px solid rgba(168,168,184,0.3)',
                    borderRadius: '30px',
                    cursor: 'pointer'
                  }}>RESERVE</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && rooms.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#88889a' }}>✦ NO ROOMS AVAILABLE FOR {guests} GUEST(S) ✦</p>
            <p style={{ color: '#606070' }}>please inquire for different arrangements</p>
          </div>
        )}
      </div>
    </div>
  );
}