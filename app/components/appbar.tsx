import { SearchFormModal } from "./search-teacher";


export default function AppBar() {
  return (
    <header className="flex h-16 items-center justify-center gap-4 border-b border-b-blue-500 bg-white/95 backdrop-blur-sm px-6 z-10">
        <SearchFormModal/>
    </header>
  );
}