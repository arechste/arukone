interface HeaderProps {
  theme: string;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <div className="header">
      <div className="logo">arukone</div>
      <button className="btn btn--icon" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? '\u2600' : '\u263E'}
      </button>
    </div>
  );
}
