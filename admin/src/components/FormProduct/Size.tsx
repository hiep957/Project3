import React from "react";
import { useForm, useFieldArray, Controller, useFormContext } from "react-hook-form";
import { ProductType } from "../../../types";
import { Button } from "@mui/material";

type FormValues = {
  sizes: {
    size: string;
    quantity: number;
  }[];
};

const SizeForm = () => {
    const { control, register } = useFormContext<ProductType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sizes",
  });

  

  return (
    <div className="flex flex-col space-y-4">
      <label>Size</label>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col">
          <div className="flex flex-row space-x-3">
            <select
              className="w-1/4 p-2 border rounded"
              {...register(`sizes.${index}.size` as const)}
              defaultValue={field.size}
            >
              <option value="">Chọn size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            <input
              className="w-1/4 p-2 border rounded"
              type="text"
              placeholder="Quantity"
              {...register(`sizes.${index}.quantity` as const)}
              defaultValue={field.quantity}
            />
            <button
              type="button"
              className="p-2 bg-green-400 hover:bg-green-500 transition-all text-white rounded w-1/4"
              onClick={() => remove(index)}
            >
              Xóa
            </button>
          </div>
        </div>
      ))}

      <Button
       
        variant="contained"
        className="mt-2 p-2 bg-green-400 text-white rounded w-1/4"
        onClick={() => append({ size: "", quantity: 0 })}
      >
        Thêm size
      </Button>

      
    </div>
  );
};

export default SizeForm;
