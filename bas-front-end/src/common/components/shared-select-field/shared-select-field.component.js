import {
  Box,
  FormHelperText,
  Grow,
  Paper,
  Popper,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import clsx from "clsx";
import PropTypes from "prop-types";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import classes from "./shared-select-field.style.module.css";

const CustomPaper = (props, className) => {
  return (
    <Popper
      {...props}
      placement="bottom-start"
      transition
      className={clsx(classes.selectDropdown, className)}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <Paper elevation={8}>{props.children}</Paper>
        </Grow>
      )}
    </Popper>
  );
};

export const SharedSelectField = memo((props) => {
  const {
    name,
    options,
    onChange,
    variant,
    errorMsg,
    label,
    required = false,
    placeholder,
    defaultValue,
    disableClearable,
    className,
    disabled,
    onBlur,
    InputProps,
    readOnly,
    ...other
  } = props;

  const { t } = useTranslation();

  const handleChange = (event, values) => {
    if (onChange) {
      onChange(name, values ? values.value : null);
    }
  };

  return (
    <div className={classes.sharedSelectField}>
      {label && (
        <Box className="form-label">
          {required && <p className="required">*</p>}
          {label}
        </Box>
      )}
      <Autocomplete
        options={options}
        noOptionsText={t("common:input.no-options")}
        getOptionLabel={(option) => option && option.label}
        name={name}
        onChange={handleChange}
        disableClearable={disableClearable}
        disabled={disabled}
        value={options.find((item) => item.value === defaultValue) || ""}
        getOptionSelected={(option, value) => option.value === value.value}
        getOptionDisabled={(option) => option.disabled}
        PopperComponent={(props) => CustomPaper(props, className)}
        onBlur={onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            variant={variant}
            placeholder={placeholder}
            className={className && className}
            error={errorMsg ? true : false}
            InputProps={{
              ...params.InputProps,
              ...InputProps,
              readOnly: readOnly || false,
            }}
          />
        )}
        {...other}
      />
      {errorMsg && (
        <FormHelperText className="error-message">{errorMsg}</FormHelperText>
      )}
    </div>
  );
});

SharedSelectField.propTypes = {
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  errorMsg: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

SharedSelectField.defaultProps = {
  native: true,
  onChange: null,
  variant: "outlined",
  errorMsg: "",
  label: "",
  required: false,
  placeholder: "",
};
