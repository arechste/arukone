interface HeaderProps {
  theme: string;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <div className="header">
      <div className="logo">arukone</div>
      <button className="theme-btn" onClick={onToggleTheme}>
        {theme === 'dark' ? '\u2600' : '\u263E'}
      </button>
    </div>
  );
}
