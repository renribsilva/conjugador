const NoteRefList = ({ noteRef }) => {
  if (!noteRef || Object.keys(noteRef).length === 0) {
    return null; 
  }  
  return (
    <ol>
      {Object.keys(noteRef)
        .sort((a, b) => parseInt(a) - parseInt(b)) 
        .map((key) => (
          Array.isArray(noteRef[key]) && noteRef[key].map((text, index) => (
            <li key={`${key}-${index}`}>{text}</li>
          ))
        ))}
    </ol>
  );
}

export default NoteRefList