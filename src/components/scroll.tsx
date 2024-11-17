function Scroll ({ targetId, children, className = '', ...props }) {
  return (
    <a href={`#${targetId}`} className={`button-base ${className}`} {...props}>
      <h2>{children}</h2>
    </a>
  );
}

function Target ({ children }) {
  return (
    <h2>{children}</h2>
  );
}