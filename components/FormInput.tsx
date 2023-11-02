import { useState, useEffect, ElementType } from "react";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { AiFillCheckCircle } from "react-icons/ai";
import { RiErrorWarningFill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

interface Props {
  id: string;
  name: string;
  type: "text" | "number" | "password";
  placeholder: string;
  disabled: boolean;
  Icon: ElementType;
};

const FormInput = ({id, name, type, placeholder, disabled, Icon}: Props) => {
  const [isFieldValidated, setIsFieldValidated] = useState(false);

  const {register, watch, formState: {errors, isSubmitted}} = useFormContext();

  const isInvalid = !!errors[name];
  const fieldValue = watch(name);
  
  // Verificar si el campo es válido
  // El mecanismo de verificación toma en cuenta
  // si el campo es inválido y si ya se intentó
  // enviar el formulario
  useEffect(() => {
    const isValid = !isInvalid && isSubmitted;
    setIsFieldValidated(isValid);
  }, [isInvalid, name, fieldValue, isSubmitted]);

  return (
    <>
      <div className="relative flex flex-col gap-1 basis-full grow-0">
        <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 pointer-event-none">
          <span className="text-base text-white">
            <Icon />
          </span>
        </div>

        <input
          id={id}
          className={twMerge("block w-full h-[45px] pl-8 px-10 text-sm text-white bg-neutral-700 rounded-md border-2 border-transparent outline-transparent", isInvalid && ["border-red-500", "bg-red-900/20"])}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          {...register(name)}
        />

        {/* Íconos al final del input */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3 pointer-event-none">          
          {/* ícono para indicar error de validación */}
          {isInvalid && (
            <motion.div
              key="invalidIcon"
              className="origin-center"
              initial={{scale: 0, opacity: 0, rotateZ: 180}}
              animate={{scale: 1, opacity: 1, rotateZ: 0}}
              exit={{scale: 0, opacity: 0, rotateZ: 180}}
            >
              <RiErrorWarningFill
                className="w-6 h-6 text-sm text-red-500"
              />
            </motion.div>
          )}
          
          {/* Ícono para indicar que el campo es válido */}
          {isFieldValidated &&
            <motion.div
              key="validatedIcon"
              className="origin-center"
              initial={{scale: 0, opacity: 0, rotateZ: 180}}
              animate={{scale: 1, opacity: 1, rotateZ: 0}}
              exit={{scale: 0, opacity: 0, rotateZ: 180}}
            >
            <AiFillCheckCircle
              className="w-6 h-6 text-sm text-green-500"
            />
          </motion.div>
          }
        </div>
      </div>
      
      {/* Mensaje de error de validación */}
      <AnimatePresence>
        {isInvalid &&
          <motion.p
            key="validationErrorMessage"
            className="-mt-3 text-sm font-bold text-red-500"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
          >
            {`${errors[name]?.message}`}
          </motion.p>
        }
      </AnimatePresence>
    </>
  )
};

export default FormInput;