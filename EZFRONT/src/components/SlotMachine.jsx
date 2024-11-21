import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const SlotMachine = ({ reels }) => {
  const [spinning, setSpinning] = useState(reels.map(() => false));

  // Handle sequential spinning logic
  useEffect(() => {
    let isMounted = true; // To avoid state updates if component unmounts

    const spinReelsSequentially = async () => {
      while (isMounted) {
        // Start spinning each reel one by one
        for (let i = 0; i < reels.length; i++) {
          if (!isMounted) break;
          // Set the current reel to spinning
          setSpinning(prev => {
            const newSpinning = [...prev];
            newSpinning[i] = true;
            return newSpinning;
          });

          // Wait for 500ms before starting the next reel
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Wait for 2 seconds (total spin duration)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Stop spinning each reel one by one
        for (let i = 0; i < reels.length; i++) {
          if (!isMounted) break;
          // Set the current reel to not spinning
          setSpinning(prev => {
            const newSpinning = [...prev];
            newSpinning[i] = false;
            return newSpinning;
          });

          // Wait for 300ms before stopping the next reel
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Wait for 1 second before the next spin cycle
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    spinReelsSequentially();

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, [reels.length]);

  return (
    <div className="flex flex-col items-center justify-center">
      
      {/* Internal Styles for Animations and Shadows */}
      <style>
        {`
          @keyframes spin {
            0% { transform: translateY(0); }
            25% { transform: translateY(-100%); }
            50% { transform: translateY(-200%); }
            75% { transform: translateY(-300%); }
            100% { transform: translateY(0); }
          }
          @keyframes gradient-border {
            0% {
              // border-color: #ff00c8;
            }

            100% {
              // border-color: #ff00c8;
            }
          }
          @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: 200px 0; }
          }
          .animate-spin-reel {
            animation: spin 2s ease-in-out infinite;
          }
          .animate-gradient-border {
            animation: gradient-border 4s linear infinite;
            border-image: linear-gradient(45deg, #3D3A40, #76ABAE) 1;
          }
          .font-pacifico {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>

      <div className="flex flex-col items-center mt-4">
        {/* Slot machine always stays in one row, regardless of screen size */}
        <div className="flex gap-1 p-1 md:p-2 border-2 md:border-4 animate-gradient-border rounded-lg">
          {reels.map((reel, index) => (
            <div key={index} className="flex justify-center w-auto h-5 md:w-12 md:h-12 overflow-hidden relative border-l-0 border-r-0 md:border-l-2 md:border-r-2 border-headerBackground rounded">
              <div className={`flex flex-col items-center text-lg md:text-5xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-transparent bg-clip-text shadow-pink-neon ${spinning[index] ? 'animate-spin-reel' : ''}`}>
                {reel.map((char, i) => (
                  <span key={i} className="block">{char}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SlotMachine.propTypes = {
  reels: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default SlotMachine;
