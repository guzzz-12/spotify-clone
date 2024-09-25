import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import { AiOutlineUser } from "react-icons/ai";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";
import GenericModal from "@/components/GenericModal";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { UserContext } from "@/context/UserProvider";
import useUpdateSongModal from "@/hooks/useUpdateSongModal";
import { supabaseBrowserClient } from "@/utils/supabaseBrowserClient";
import { AUTHOR_NAME_REGEX, SONG_TITLE_REGEX } from "@/utils/validationRegex";

const SongFormSchema = z.object({
  songAuthor: z
    .string()
    .min(0, {message: "The author name is required"})
    .min(3, "The author name must contain at least 3 characters")
    .max(32, "The author name must contain maximum 32 characters")
    .regex(AUTHOR_NAME_REGEX, {message: "The author name must contain only alphanumeric characters"}),
  songName: z
    .string()
    .min(0, {message: "The title is required"})
    .min(3, "The title must contain at least 3 characters")
    .max(32, "The title must contain maximum 32 characters")
    .regex(SONG_TITLE_REGEX, {message: "The title must contain only letters, numbers, '-' and '_'"})
});

export type SongFormSchemaType = z.infer<typeof SongFormSchema>;

const UpdateSongModal = () => {
  const {refresh} = useRouter();

  const {userDetails} = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const formProps = useForm<SongFormSchemaType>({
    resolver: zodResolver(SongFormSchema),
    defaultValues: {
      songAuthor: "",
      songName: ""
    }
  });

  const {updatedSongId, isOpen, setIsOpen} = useUpdateSongModal();

  const supabase = supabaseBrowserClient;

  useEffect(() => {
    if (updatedSongId) {
      supabase
      .from("songs")
      .select("*")
      .eq("id", updatedSongId)
      .then(({data, error}) => {
        if (error) {
          toast.error("Error fetching song. Refresh the page and try again.");
          setIsOpen(false);
        }

        if (data) {
          const {author, title} = data[0];
          formProps.setValue("songAuthor", author);
          formProps.setValue("songName", title);
        }

        setLoading(false);
      })
    }

    return () => {
      setLoading(true);
      formProps.reset();
    }
  }, [updatedSongId, isOpen]);


  const onSubmitHandler = async (values: SongFormSchemaType) => {
    try {
      setSubmitting(true);

      await supabase
      .from("songs")
      .update({author: values.songAuthor, title: values.songName})
      .eq("id", updatedSongId!)
      .eq("user_id", userDetails!.id);

      refresh();

      toast.success("Song updated succesfully");
      
    } catch (error: any) {
      toast.error("Error updating song. Refresh the page and try again.");

    } finally {
      setSubmitting(false);
      setIsOpen(false);
      formProps.reset();
    }
  }

  return (
    <GenericModal
      title="Update song"
      description=""
      isOpen={isOpen}
      onOpenChange={(open: boolean) => {
        if (submitting || loading) return null;

        setIsOpen(open);
      }}
    >
      {loading &&
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black/90 z-10">
          <BeatLoader size={15} color="rgb(74 222 128)" />
        </div>
      }

      {!loading &&
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
              disabled={submitting}
            />

            <FormInput
              id="songName"
              type="text"
              name="songName"
              placeholder="Song Title..."
              Icon={MdDriveFileRenameOutline}
              disabled={submitting}
            />

          <Button
            className="flex justify-between items-center"
            type="submit"
            disabled={submitting}
            onClickHandler={() => null}
          >
            <AnimatePresence>
              {submitting && (
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
              {submitting ? "Updating song..." : "Update song"}
            </span>
          </Button>
          </form>
        </FormProvider>
      }
    </GenericModal>
  )
}

export default UpdateSongModal