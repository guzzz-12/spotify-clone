"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import useDebounce from "@/hooks/useDebounce";

const SearchInput = () => {
  const {push} = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, 1000);


  /** Agregar el query string a la URL */
  useEffect(() => {
    if (debouncedValue.trim().length > 0) {
      push(`/search?songTitle=${debouncedValue}`);
    };
  }, [debouncedValue]);


  /** Eliminar el query string de la URL al limpiar el input */
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      push("/search")
    }
  }, [searchTerm]);


  return (
    <div className="relative mt-2">
      <BiSearch
        className="absolute left-2 top-[50%] -translate-y-[50%] text-black pointer-events-none"
        size={24}
      />
      <input
        className="w-full pl-8 pr-2 py-2 text-black bg-neutral-200 rounded-md"
        id="searchSongs"
        type="search"
        name="searchSongs"
        placeholder="Search songs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
};

export default SearchInput;