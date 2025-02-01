import React from 'react';
import DiffMatchPatch from 'diff-match-patch';

const DiffViewer = ({ originalText, correctedText }) => {
  const getDiffHighlights = () => {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(originalText, correctedText);
    dmp.diff_cleanupSemantic(diffs);

    return diffs.map((diff, index) => {
      const [operation, text] = diff;
      
      let style = {};
      if (operation === -1) { // deletion
        style = { backgroundColor: 'rgba(255, 0, 0, 0.2)', textDecoration: 'line-through' };
      } else if (operation === 1) { // insertion
        style = { backgroundColor: 'rgba(0, 255, 0, 0.2)' };
      }

      return <span key={index} style={style}>{text}</span>;
    });
  };

  return (
    <div className="diff-viewer">
      {getDiffHighlights()}
    </div>
  );
};

export default DiffViewer;