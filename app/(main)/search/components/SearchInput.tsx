"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { FilterBy } from "../page";
import useDebounce from "@/hooks/useDebounce";

const SearchInput = () => {
  const {push} = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<FilterBy>("title");
  const debouncedValue = useDebounce(searchTerm, 1000);


  /** Agregar el query string a la URL */
  useEffect(() => {
    if (debouncedValue.trim().length > 0) {
      push(`/search?term=${debouncedValue}&filterBy=${filterBy}`);
    };
  }, [debouncedValue, filterBy]);


  /** Eliminar el query string de la URL al limpiar el input */
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      push("/search")
    }
  }, [searchTerm]);


  return (
    <div className="flex flex-col gap-2">
      <div className="relative mt-2">
        <BiSearch
          className="absolute left-2 top-[50%] -translate-y-[50%] text-black pointer-events-none"
          size={24}
        />
        <input
          className="w-full pl-9 pr-2 py-2 text-black bg-neutral-200 rounded-md"
          id="searchSongs"
          type="search"
          name="searchSongs"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form className="flex justify-start items-center gap-3">
        <p>Filter by:</p>
        <RadioGroup.Root
          className="flex flex-row gap-4"
          defaultValue="title"
          aria-label="View density"
          onValueChange={(val: FilterBy) => setFilterBy(val)}
        >
          <div className="flex items-center">
            <RadioGroup.Item
              id="title"
              className="bg-white w-5 h-5 rounded-full shadow-[0_2px_10px] shadow-black hover:bg-gray-300 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-pointer"
              value="title"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[10px] after:h-[10px] after:rounded-[50%] after:bg-emerald-800" />
            </RadioGroup.Item>
            <label
              className="pl-2 text-base text-white leading-none cursor-pointer"
              htmlFor="title"
            >
              Title
            </label>
          </div>

          <div className="flex items-center">
            <RadioGroup.Item
              id="author"
              className="bg-white w-5 h-5 rounded-full shadow-[0_2px_10px] shadow-black hover:bg-gray-300 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-pointer"
              value="author"
            >
              <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[10px] after:h-[10px] after:rounded-[50%] after:bg-emerald-800" />
            </RadioGroup.Item>
            <label
              className="pl-2 text-base text-white leading-none cursor-pointer"
              htmlFor="author"
            >
              Author
            </label>
          </div>
        </RadioGroup.Root>
      </form>
    </div>
  )
};

export default SearchInput;