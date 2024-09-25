"use client"

import { useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { toast } from "react-hot-toast";
import uniqueId from "uniqid";
import { AiOutlineUser } from "react-icons/ai";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";

import useUploadModal from "@/hooks/useUploadModal";
import GenericModal from "./GenericModal";
import FormInput from "./FormInput";
import Button from "./Button";
import { UserContext } from "@/context/UserProvider";
import { fileToBase64, imageProcessor } from "@/utils/imageCompression";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";
import { ACCEPTED_AUDIO_TYPES, ACCEPTED_IMAGE_TYPES, AUTHOR_NAME_REGEX, SONG_TITLE_REGEX } from "@/utils/validationRegex";


const SongFormSchema = z.object({
  songAuthor: z
    .string({required_error: "The author is required"})
    .min(0, {message: "The author is required"})
    .min(3, "The author name must contain at least 3 characters")
    .max(32, "The author name must contain maximum 32 characters")
    .regex(AUTHOR_NAME_REGEX, {message: "The author name must contain only alphanumeric characters"}),
  songName: z
    .string({required_error: "The title is required"})
    .min(0, {message: "The title is required"})
    .min(3, "The title must contain at least 3 characters")
    .max(32, "The title must contain maximum 32 characters")
    .regex(SONG_TITLE_REGEX, {message: "The title must contain only letters, numbers, '-' and '_'"}),
  songFile: z
    .any()
    .refine((file: File) => !!file, "The song is required")
    .refine((file) => file.size <= 20000000, "The song must be maximum 20 MB")
    .refine(
      (file) => ACCEPTED_AUDIO_TYPES.includes(file.type),
      "Only .mp3 and .wav formats are supported."
    ),
  image: z
    .any()
    .refine((file: File) => !!file, "The image is required")
    .refine((file) => file.size <= 5000000, "The image must be maximum 5 MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type SongFormSchemaType = z.infer<typeof SongFormSchema>;

const UploadSongModal = () => {
  const {refresh} = useRouter();

  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);

  const {userDetails} = useContext(UserContext);

  const [processingImage, setProcessingImage] = useState(false);

  const supabase = supabaseBrowserClient;

  const {isOpen, onOpenChange} = useUploadModal();

  const formProps = useForm<SongFormSchemaType>({
    resolver: zodResolver(SongFormSchema),
    defaultValues: {
      songAuthor: "",
      songName: "",
      songFile: "",
      image: "",
    }
  });

  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  /** Resetear el formulario y el state de los archivos seleccionados al cerrar el modal */
  const onCloseModalHandler = () => {
    formProps.reset();

    setSelectedAudioFile(null);
    setSelectedImageFile(null);
    setSelectedImagePreview(null);

    if (audioFileInputRef.current) {
      audioFileInputRef.current.value = "";
    };

    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = "";
    };
  }


  /** Handler del evento onchange del input del audio*/
  const onAudioFileChangeHandler = (audio: File | null) => {
    if (audio) {
      setSelectedAudioFile(audio);

      formProps.setValue("songFile", audio);
      formProps.trigger("songFile");
    }
  };

  
  /** Handler del evento onchange del input de la imagen*/
  const onImageFileChangeHandler = async (img: File | null) => {
    if (img) {
      setProcessingImage(true);
  
      const compressedImg = await imageProcessor(img) as File;
      const imgPreview = await fileToBase64(compressedImg);
  
      setProcessingImage(false);
  
      setSelectedImageFile(compressedImg);
      setSelectedImagePreview(imgPreview);
  
      formProps.setValue("image", compressedImg);
      formProps.trigger("image");
    }
  };


  /** Enviar el archivo */
  const onSubmitHandler = async (values: SongFormSchemaType) => {
    try {
      setIsUploading(true);

      const songId = uniqueId();
      const songName = values.songName
      const songAuthor = values.songAuthor;

      const songImageFileOriginalName = values.songFile.name.split(".");
      const songImageFileName = songImageFileOriginalName
      .slice(0, -1)
      .join("-")
      .replace(" ", "-")
      .toLowerCase();

      /** Subir la canción al bucket */
      const {data: songData, error: songError} = await supabase
      .storage
      .from("songs")
      .upload(`user-${userDetails?.id}/song-${songName.replace(" ", "-")}-${songId}`, values.songFile, {
        contentType: values.songFile.type,
        cacheControl: "3600"
      });

      if (songError) {
        throw Error(songError.message)
      };

      /** Subir la imagen de la canción al bucket */
      const {data: imageData, error: imageError} = await supabase
      .storage
      .from("images")
      .upload(`user-${userDetails?.id}/image-${songImageFileName}-${songId}`, values.image, {
        contentType: values.image.type,
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
      onOpenChange={(open: boolean) => {
        if (isUploading) return null;

        if (!open) {
          onCloseModalHandler();
        }

        onOpenChange(open);
      }}
    >
      <FormProvider {...formProps}>
        <form
          className="flex flex-col justify-between gap-5 w-full p-5"
          noValidate
          onSubmit={formProps.handleSubmit(onSubmitHandler)}
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
            placeholder="Song Title..."
            Icon={MdDriveFileRenameOutline}
            disabled={isUploading}
          />

          <div className="flex flex-col gap-3">
            <p className="text-sm text-white">
              Select audio file (.mp3 or .wav)
            </p>

            <label
              className={twMerge("flex items-center w-full h-[45px] px-3 bg-neutral-700 rounded-md cursor-pointer")}
              htmlFor="audioFile"
            >
              <span className="text-sm text-white truncate">
                {!selectedAudioFile && "Choose file"}
                {selectedAudioFile && selectedAudioFile.name}
              </span>
            </label>

            <Controller
              control={formProps.control}
              name="image"
              render={() => {
                return (
                  <input
                    ref={imageFileInputRef}
                    id="audioFile"
                    hidden
                    type="file"
                    accept={ACCEPTED_AUDIO_TYPES.join(", ")}
                    multiple={false}
                    disabled={processingImage || isUploading}
                    onChange={(e) => {
                      if (e.target.files) {
                        onAudioFileChangeHandler(e.target.files[0])
                      }
                    }}
                  />
                )
              }}
            />

            <AnimatePresence>
              {formProps.formState.errors.songFile &&
                <motion.p
                  key="audioValidationErrorMessage"
                  className="text-sm text-left text-red-500 font-bold translate-y-[-5px]"
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                >
                  {formProps.formState.errors.songFile.message as string}
                </motion.p>
              }
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-white">
              Select image file (.jpg, .jpeg, .png, .webp)
            </p>

            <label
              className={twMerge("flex items-center w-full h-[45px] px-3 bg-neutral-700 rounded-md cursor-pointer")}
              htmlFor="imageFile"
            >
              <span className="text-sm text-white truncate">
                {!selectedImageFile && "Choose file"}
                {selectedImageFile && selectedImageFile.name}
              </span>
            </label>

            <Controller
              control={formProps.control}
              name="image"
              render={() => {
                return (
                  <input
                    ref={imageFileInputRef}
                    id="imageFile"
                    hidden
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(", ")}
                    multiple={false}
                    disabled={processingImage || isUploading}
                    onChange={(e) => {
                      if (e.target.files) {
                        onImageFileChangeHandler(e.target.files[0]);
                      }
                    }}
                  />
                )
              }}
            />

            <AnimatePresence>
              {formProps.formState.errors.image &&
                <motion.p
                  key="imageValidationErrorMessage"
                  className="text-sm text-left text-red-500 font-bold translate-y-[-5px]"
                  initial={{height: 0, opacity: 0}}
                  animate={{height: "auto", opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                >
                  {formProps.formState.errors.image.message as string}
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
                    className="block w-auto h-[120px] aspect-square object-cover object-center rounded-sm"
                    src={selectedImagePreview}
                    alt="Selected image preview"
                  />
                </motion.div>
              }
            </AnimatePresence>
          </div>

          <Button
            className="flex justify-between items-center"
            type="submit"
            disabled={isUploading}
            onClickHandler={() => null}
          >
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  className="block mr-2 animate-spin"
                  initial={{size: 0, opacity: 0}}
                  animate={{size: "auto", opacity: 1}}
                  exit={{size: 0, opacity: 0}}
                >
                  <BiLoaderAlt size={24} />
                </motion.div>
              )}
            </AnimatePresence>
            <span>
              {isUploading ? "Uploading song" : "Upload song"}
            </span>
          </Button>
        </form>
      </FormProvider>
    </GenericModal>
  )
};

export default UploadSongModal;