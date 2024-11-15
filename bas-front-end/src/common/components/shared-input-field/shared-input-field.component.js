import {
  Box,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/styles";
import PropTypes, { node } from "prop-types";
import { memo, useState } from "react";
import classes from "./shared-input-field.style.module.css";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export const SharedInputField = memo((props) => {
  const {
    className = "",
    name,
    onChange,
    variant,
    errorMsg,
    label,
    value,
    required = false,
    placeholder,
    type,
    onBlur,
    disabled,
    multiline,
    rows,
    nowrap,
    boldLabel,
    isPasswordField = false,
    onKeyPress,
    inputProps = {},
    InputProps = {},
    endAdornment,
    Prefix = null,
    hint,
    min,
    max,
  } = props;
  const styles = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={classes.sharedInputField}>
      {label && (
        <Box
          className="form-label"
          style={{
            ...(nowrap && { whiteSpace: "nowrap" }),
            ...(boldLabel && { fontWeight: "bold" }),
          }}
        >
          {required && <p className="required">*</p>}
          {label}
        </Box>
      )}

      {hint && hint !== "" && <p className={classes.hint}>{hint}</p>}

      <Box style={{ display: "flex", alignItems: "center" }}>
        {Prefix}

        <TextField
          onKeyPress={onKeyPress}
          size="medium"
          variant={variant}
          onBlur={onBlur}
          onChange={onChange}
          value={type !== "number" ? value || "" : value}
          error={errorMsg ? true : false}
          type={isPasswordField ? (showPassword ? "text" : type) : type}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          multiline={multiline}
          minRows={rows}
          className={className + " " + styles.root}
          min={min}
          max={max}
          InputProps={
            isPasswordField
              ? {
                  ...InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        disableRipple
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : endAdornment
                ? {
                    ...InputProps,
                    endAdornment: endAdornment,
                  }
                : InputProps
          }
          inputProps={inputProps}
          style={{
            flex: 1,
          }}
        />
      </Box>

      {errorMsg && (
        <FormHelperText className="error-message">{errorMsg}</FormHelperText>
      )}
    </div>
  );
});

SharedInputField.propTypes = {
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  errorMsg: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  endAdornment: node,
};

SharedInputField.defaultProps = {
  onChange: null,
  variant: "outlined",
  errorMsg: "",
  label: "",
  required: false,
  type: "text",
  placeholder: "",
};
