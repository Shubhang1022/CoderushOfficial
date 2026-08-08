import React from 'react';

/**
 * Parses markdown bold syntax (**bold text**) and line breaks (\n) into React elements.
 */
export const renderFormattedText = (text?: string): React.ReactNode => {
  if (!text) return null;

  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Regex splits by **text** while preserving matched bold blocks
    const parts = line.split(/(\*\*[^*]+\*\*)/g);

    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            const innerText = part.slice(2, -2);
            return (
              <strong key={partIdx} className="font-bold text-white drop-shadow-sm">
                {innerText}
              </strong>
            );
          }
          return part;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};
