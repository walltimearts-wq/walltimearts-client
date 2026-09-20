import React, { useState } from 'react';

const WHATSAPP_NUMBER = '923229811525';

const WhatsAppButton: React.FC = () => {
  const [visible, setVisible] = useState(true);

  const handleClick = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20need%20help%20with%20an%20order.`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div
      className={`fixed left-4 bottom-4 z-40 flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-full shadow-lg transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      {/* WhatsApp icon */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-2 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.368a4.006 4.006 0 0 0-.427-1.704C16.898 10.658 15.654 10 14 10c-1.657 0-3 .658-3.958 1.611a4.01 4.01 0 0 0-.427 1.704c-.058.986.318 1.834 1.03 2.271a4.006 4.006 0 0 0 1.704.427c.986.058 1.834-.318 2.271-1.03a4.006 4.006 0 0 0 1.704-.427c.986-.058 1.834.318 2.271 1.03a4.006 4.006 0 0 0 .427 1.704c.058.986-.318 1.834-1.03 2.271a4.006 4.006 0 0 0-.427 1.704c-.058.986.318 1.834 1.03 2.271a4.006 4.006 0 0 0 1.704.427c.986.058 1.834-.318 2.271-1.03a4.006 4.006 0 0 0 1.704-.427c.986-.058 1.834.318 2.271 1.03a4.006 4.006 0 0 0 .427 1.704c.058.986-.318 1.834-1.03 2.271a4.006 4.006 0 0 0-.427 1.704c-.058.986.318 1.834 1.03 2.271a4.006 4.006 0 0 0 1.704.427c1.163.143 2.165-.388 2.653-1.287a4.006 4.006 0 0 0 1.287-2.653c.143-1.163-.388-2.165-1.287-2.653a4.02 4.02 0 0 0-2.652-1.287c-1.163-.143-2.165.388-2.653 1.287a4.02 4.02 0 0 0-1.287 2.653c-.143 1.163.388 2.165 1.287 2.653l.001.001z" />
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
        <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
          Need help? Contact us
        </span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
