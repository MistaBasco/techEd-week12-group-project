import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="sticky top-0 flex h-8 bg-slate-400 items-center">
      <h1 className="font-bold m-2 text-2xl">Overrated&trade;</h1>
      <NavBar />
      {/* searchbar, sign-in button */}
    </header>
  );
}
