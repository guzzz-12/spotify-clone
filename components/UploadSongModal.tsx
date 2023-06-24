"use client"

import { useEffect, useState, useRef, ChangeEvent, useContext } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { toast } from "react-hot-toast";
import uniqueId from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { AiOutlineUser } from "react-icons/ai";
import { MdDriveFileRenameOutline } from "react-icons/md";

import useUploadModal from "@/hooks/useUploadModal";
import GenericModal from "./GenericModal";
import FormInput from "./FormInput";
import Button from "./Button";
import { UserContext } from "@/context/UserProvider";
import { Database } from "@/types/supabase";
import { imageProcessor } from "@/utils/imageCompression";

const AUTHOR_NAME_REGEX = /^[A-Za-zÀ-ž0-9\s]{3,32}$/;
const SONG_TITLE_REGEX = /^[A-Za-zÀ-ž0-9_\-\s]{3,32}$/;

const SongFormSchema = z.object({
  songAuthor: z
    .string({required_error: "The author is required"})
    .nonempty("The author is required")
    .min(3, "The author name must contain at least 3 characters")
    .max(32, "The author name must contain maximum 32 characters")
    .regex(AUTHOR_NAME_REGEX, {message: "The author name must contain only alphanumeric characters"}),
  songName: z
    .string({required_error: "The title is required"})
    .nonempty("The title is required")
    .min(3, "The title must contain at least 3 characters")
    .max(32, "The title must contain maximum 32 characters")
    .regex(SONG_TITLE_REGEX, {message: "The title must contain only letters, numbers, '-' and '_'"})
});

export type SongFormSchemaType = z.infer<typeof SongFormSchema>;

const UploadSongModal = () => {
  const {refresh} = useRouter();

  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  const {userDetails} = useContext(UserContext);

  const supabase = useSupabaseClient<Database>();

  const {isOpen, onOpenChange} = useUploadModal();

  const methods = useForm<SongFormSchemaType>({resolver: zodResolver(SongFormSchema)});

  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [audioRequiredError, setAudioRequiredError] = useState(false);
  const [imageRequiredError, setImageRequiredError] = useState(false);

  /** Resetear el formulario y el state de los archivos seleccionados */
  useEffect(() => {
    if (!isOpen) {
      methods.reset();

      setSelectedAudioFile(null);
      setSelectedImageFile(null);
      setSelectedImagePreview(null);

      setAudioRequiredError(false);
      setImageRequiredError(false);

      if (audioFileInputRef.current) {
        audioFileInputRef.current.value = "";
      };

      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      };
    }
  }, [isOpen]);


  /** Handler del evento onchange del input del audio*/
  const onAudioFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioRequiredError(false);
    const audioFile = e.target.files?.[0] ?? null;
    setSelectedAudioFile(audioFile);
  };

  
  /** Handler del evento onchange del input de la imagen*/
  const onImageFileChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setImageRequiredError(false);
    const imageFile = e.target.files?.[0] ?? null;

    if (imageFile) {
      try {
        const compressedImage = await imageProcessor(imageFile);
        const imagePreview = URL.createObjectURL(imageFile);
        
        setSelectedImageFile(compressedImage);
        setSelectedImagePreview(imagePreview);

      } catch (error) {
        toast.error("Error processing file. refresh the page and try again")
      }
    };
  };


  /** Enviar el archivo */
  const onSubmitHandler = async (values: SongFormSchemaType) => {
    if (!selectedAudioFile && !selectedImageFile) {
      setAudioRequiredError(true);
      return setImageRequiredError(true);
    };

    if (!selectedAudioFile) {
      return setAudioRequiredError(true)
    };

    if (!selectedImageFile) {
      return setImageRequiredError(true)
    };
    
    try {
      setIsUploading(true);

      const songId = uniqueId();
      const songName = values.songName
      const songAuthor = values.songAuthor;

      const songImageFileOriginalName = selectedImageFile.name.split(".");
      const songImageFileName = songImageFileOriginalName
      .slice(0, -1)
      .join("-")
      .replace(" ", "-")
      .toLowerCase();

      /** Subir la canción al bucket */
      const {data: songData, error: songError} = await supabase
      .storage
      .from("songs")
      .upload(`user-${userDetails?.id}/song-${songName.replace(" ", "-")}-${songId}`, selectedAudioFile, {
        contentType: selectedAudioFile.type,
        cacheControl: "3600"
      });

      if (songError) {
        throw Error(songError.message)
      };

      /** Subir la imagen de la canción al bucket */
      const {data: imageData, error: imageError} = await supabase
      .storage
      .from("images")
      .upload(`user-${userDetails?.id}/image-${songImageFileName}-${songId}`, selectedImageFile, {
        contentType: selectedImageFile.type,
        cacheControl: "3600"
      });

      if (imageError) {
        throw new Error(imageError.message)
      };

      /** Almacenar la data de la canción en la base de datos */
      const {error: dbError} = await supabase.from("songs").insert({
        user_id: userDetails!.id,
        title: songName,
        author: songAuthor,
        song_path: songData.path,
        image_url: imageData.path
      });

      if (dbError) {
        throw new Error(dbError.message)
      };

      toast.success("Song uploaded sucessfully");
      refresh();
      onOpenChange(false);
      
    } catch (error: any) {
      toast.error(`Error uploading file: ${error.message}`);

    } finally {
      setIsUploading(false)
    }
  };

  return (
    <GenericModal
      title="Upload song"
      description=""
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <FormProvider {...methods}>
        <form
          className="flex flex-col justify-between gap-5 w-full p-5"
          noValidate
          onSubmit={methods.handleSubmit(onSubmitHandler)}
        >
          <FormInput
            id="songAuthor"
            type="text"
            name="songAuthor"
            placeholder="Song Author..."
            Icon={AiOutlineUser}
            disabled={isUploading}
          />
          <FormInput
            id="songName"
            type="text"
            name="songName"
            placeholder="Song Name..."
            Icon={MdDriveFileRenameOutline}
            disabled={isUploading}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm text-white">
              Select audio file (.mp3 or .wav)
            </p>

            <label
              className={twMerge("flex items-center w-full h-[45px] px-3 bg-neutral-700 rounded-md cursor-pointer")}
              htmlFor="songFile"
            >
              <span className="text-sm text-white truncate">
                {!selectedAudioFile ? "Choose file" : "Change file - "}
                {selectedAudioFile && selectedAudioFile.name}
              </span>
            </label>

            <input
              ref={audioFileInputRef}
              id="songFile"
              type="file"
              hidden
              accept="audio/mpeg, audio/wav"
              disabled={isUploading}
              onChange={onAudioFileChangeHandler}
            />

            {/* Mensaje de error de audio requerido */}
            <AnimatePresence>
              {audioRequiredError &&
                <motion.p
                  key="audioValidationErrorMessage"
                  className="text-sm font-bold text-red-500"
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                >
                  The song is required
                </motion.p>
              }
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-white">
              Select image file (.jpg, .jpeg, .png, .webp)
            </p>

            <label
              className={twMerge("flex items-center w-full h-[45px] px-3 bg-neutral-700 rounded-md cursor-pointer")}
              htmlFor="imageFile"
            >
              <span className="text-sm text-white truncate">
                {!selectedImageFile ? "Choose file" : "Change file - "}
                {selectedImageFile && selectedImageFile.name}
              </span>
            </label>

            <input
              ref={imageFileInputRef}
              id="imageFile"
              type="file"
              hidden
              accept="image/jpg, image/jpeg, image/png, image/webp"
              disabled={isUploading}
              onChange={onImageFileChangeHandler}
            />

            {/* Mensaje de error de imagen requerida */}
            <AnimatePresence>
              {imageRequiredError &&
                <motion.p
                  key="imageValidationErrorMessage"
                  className="text-sm font-bold text-red-500"
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                >
                  The image is required
                </motion.p>
              }
            </AnimatePresence>

            <AnimatePresence>
              {selectedImagePreview &&
                <motion.div
                  className="w-full"
                  initial={{width: 0, opacity: 0}}
                  animate={{width: "auto", opacity: 1}}
                  exit={{width: 0, opacity: 0}}
                >
                  <img
                    className="block w-auto h-[100px] aspect-video object-cover object-center rounded-sm"
                    src={selectedImagePreview}
                    alt="Selected image preview"
                  />
                </motion.div>
              }
            </AnimatePresence>
          </div>

          <Button
            type="submit"
            disabled={isUploading}
            onClickHandler={() => null}
          >
            Upload file
          </Button>
        </form>
      </FormProvider>
    </GenericModal>
  )
};

export default UploadSongModal;