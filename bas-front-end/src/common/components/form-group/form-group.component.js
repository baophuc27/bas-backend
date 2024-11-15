import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import clsx from "clsx";
import { SharedInputField, SharedSelectField } from "common/components";
import { memo } from "react";

const getField = (item, formik) => {
  switch (item.fieldType) {
    case "select":
      return (
        <SharedSelectField
          placeholder={item.placeholder}
          errorMsg={formik.touched[item.name] && formik.errors[item.name]}
          label={item.label}
          disableClearable
          required={item.required}
          name={item.name}
          options={item.options}
          defaultValue={formik.values[item.name]}
          onChange={formik.setFieldValue}
          disabled={item.disabled ? item.disabled : formik.isSubmitting}
          className={clsx(
            item.disabled && "disabled-field",
            item.className && item.clasName,
          )}
        />
      );

    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={formik.values[item.name]}
              {...formik.getFieldProps(item.name)}
              name={item.name}
              color="primary"
            />
          }
          label={item.label}
        />
      );

    case "heading":
      return <h3>{item?.value}</h3>;

    case "radio":
      return (
        <FormControl component="fieldset">
          <Box className="form-label">{item.label}</Box>
          <RadioGroup
            aria-label={item.name}
            name={item.name}
            value={formik.values[item.name]}
            {...formik.getFieldProps(item.name)}
          >
            <Box display="flex">
              {item.options?.map((option) => (
                <FormControlLabel
                  value={option.value}
                  control={<Radio color="primary" />}
                  label={option.label}
                  disabled={option.disabled}
                />
              ))}
            </Box>
          </RadioGroup>
        </FormControl>
      );

    default:
      return (
        <SharedInputField
          name={item.name}
          label={item.label}
          type={item.type}
          placeholder={item.placeholder}
          {...formik.getFieldProps(item.name)}
          disabled={item.disabled ? item.disabled : formik.isSubmitting}
          required={item.required}
          errorMsg={formik.touched[item.name] && formik.errors[item.name]}
          multiline={item.multiline}
          rows={item.rows}
          inputProps={item?.inputProps}
          className={item.disabled ? "disabled-field" : ""}
          isPasswordField={item.isPasswordField}
          hint={item?.hint}
          {...(item?.onChange ? { onChange: item?.onChange } : {})}
        />
      );
  }
};

export const FormGroup = memo((props) => {
  const { items, formik, loading, mb = 3, disabled = false } = props;

  return (
    <Grid container>
      {items
        .filter((item) => !item.notRender)
        .map((item) => {
          if (disabled) {
            item["disabled"] = true;
          }

          return (
            <Grid key={item.name} item xs={item.width || 12}>
              <Box mb={mb} {...(item?.styles ? item?.styles : {})}>
                {loading ? (
                  <Box>
                    <Skeleton width={120} height={25} />
                    <Skeleton height={74} />
                  </Box>
                ) : (
                  getField(item, formik)
                )}
              </Box>
            </Grid>
          );
        })}
    </Grid>
  );
});
