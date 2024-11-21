import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

type Props = {
  placeholder: string;
  value?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  sx?: TextFieldProps["sx"];
  row?: number;
};

const InputComponent = ({
  placeholder,
  value,
  onChange,
  sx,
  row = 1,
}: Props) => {
  return (
    <TextField
      id="outlined-multiline-static"
      multiline
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      variant="outlined"
      rows={row}
      sx={{
        width: "100%",
        backgroundColor: "#F7F7F7",
        marginBottom: "20px",
        ...sx,
      }}
    />
  );
};

export default InputComponent;
