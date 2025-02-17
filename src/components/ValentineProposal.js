import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const ValentineProposal = () => {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState(null);
  const [showHearts, setShowHearts] = useState(false);
  const [celebrationHearts, setCelebrationHearts] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const moveNoButton = () => {
    const buttonWidth = 150;
    const buttonHeight = 50;
    const safeZoneWidth = 500;
    const safeZoneHeight = 600;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    const safeZoneLeft = centerX - safeZoneWidth / 2;
    const safeZoneRight = centerX + safeZoneWidth / 2;
    const safeZoneTop = centerY - safeZoneHeight / 2;
    const safeZoneBottom = centerY + safeZoneHeight / 2;
    
    // Get current mouse position
    const mouseX = window.event?.clientX ?? 0;
    const mouseY = window.event?.clientY ?? 0;
    
    let x, y, distanceFromMouse;
    do {
      if (Math.random() < 0.5) {
        x = Math.random() * (safeZoneLeft - buttonWidth);
      } else {
        x = safeZoneRight + Math.random() * (viewportWidth - safeZoneRight - buttonWidth);
      }
      
      if (Math.random() < 0.5) {
        y = Math.random() * (safeZoneTop - buttonHeight);
      } else {
        y = safeZoneBottom + Math.random() * (viewportHeight - safeZoneBottom - buttonHeight);
      }
      
      // Check if new position is far enough from mouse
      distanceFromMouse = Math.sqrt(
        Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2)
      );
    } while (
      (x > safeZoneLeft - buttonWidth && 
      x < safeZoneRight && 
      y > safeZoneTop - buttonHeight && 
      y < safeZoneBottom) ||
      distanceFromMouse < 100 // Ensure button moves at least 100px away from cursor
    );
    
    x = Math.max(0, Math.min(x, viewportWidth - buttonWidth));
    y = Math.max(0, Math.min(y, viewportHeight - buttonHeight));
    
    setNoButtonPosition({ x, y });
  };

  const createCelebrationHeart = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    return {
      id: Math.random(),
      x: Math.random() * viewportWidth,
      y: Math.random() * viewportHeight,
      size: 20 + Math.random() * 30,
      speedX: (Math.random() - 0.5) * 10,
      speedY: (Math.random() - 0.5) * 10
    };
  };

  const handleAccept = () => {
    setAccepted(true);
    setShowHearts(true);
    
    // Create initial hearts
    const hearts = Array.from({ length: 15 }, () => createCelebrationHeart());
    setCelebrationHearts(hearts);

    // Animate hearts
    const animateHearts = () => {
      setCelebrationHearts(prevHearts => {
        if (prevHearts.length === 0) return [];
        
        return prevHearts.map(heart => ({
          ...heart,
          x: heart.x + heart.speedX,
          y: heart.y + heart.speedY,
          speedY: heart.speedY + 0.1 // Add gravity effect
        })).filter(heart => 
          heart.x > -100 && 
          heart.x < window.innerWidth + 100 && 
          heart.y > -100 && 
          heart.y < window.innerHeight + 100
        );
      });
    };

    const animation = setInterval(animateHearts, 50);
    setTimeout(() => {
      clearInterval(animation);
      setCelebrationHearts([]);
      setShowHearts(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Main content */}
      <div className="text-center z-10 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          {accepted ? "Yay! You're my Valentine! 💖" : "Will you be my Valentine? 🥺"}
        </h1>

        {/* Image display */}
        <div className="mb-8">
          <img
            src={accepted 
              ? "https://media1.tenor.com/m/dk4NTv8_-AsAAAAd/aaa-bbb.gif"
              : "https://i.pinimg.com/originals/23/6e/dd/236edd320f07f4fb99a823ae19ef7c49.gif"
            }
            alt={accepted ? "Happy celebration gif" : "Cute asking gif"}
            className="rounded-lg shadow-lg mx-auto w-[300px] h-[300px] object-cover"
          />
        </div>

        {/* Buttons */}
        {!accepted && (
          <div className="space-x-4 flex justify-center items-center">
            <button
              onClick={handleAccept}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform"
            >
              Yes! 💝
            </button>

            <button
              onMouseEnter={moveNoButton}
              onClick={moveNoButton}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-8 rounded-full shadow-lg transition-all duration-200"
              style={noButtonPosition ? {
                position: 'fixed',
                left: `${noButtonPosition.x}px`,
                top: `${noButtonPosition.y}px`,
                zIndex: 20
              } : {}}
            >
              No 😢
            </button>
          </div>
        )}
      </div>

      {/* Celebration Hearts */}
      {celebrationHearts.map(heart => (
        <Heart
          key={heart.id}
          className="absolute text-pink-500"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'none',
            position: 'fixed',
            zIndex: 30
          }}
          fill="#ec4899"
        />
      ))}

      {/* Background hearts */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-200 opacity-50"
              style={{
                left: `${(i * 10)}%`,
                top: `${((i * 15) % 100)}%`,
                transform: `scale(${0.5 + (i * 0.1)})`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ValentineProposal;