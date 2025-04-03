import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { AlarmService } from "common/services/alarm.service";
import { notify } from "common/utils";
import { useFormik } from "formik";
import { t } from "i18next";
import { memo, useState } from "react";
import * as Yup from "yup";
import styles from "./alarm-setting-dialog.style.module.css";

const initValue = {
  operator: "",
  warning: "",
  emergency: "",
  operatorMessage: "",
  warningMessage: "",
  emergencyMessage: "",
};
const AlarmTable = ({
  distanceRows,
  speedRows,
  angleRows,
  zone,
  setData,
  setLoading,
}) => {
  const [editMode, setEditMode] = useState({
    key: "",
    side: "",
  });

  const updateAlarmState = (data, values) => {
    setData(
      {
        operator: {
          ...data.operator,
          rightValue: values.operator === "" ? "" : Number(values.operator),
          message: values.operatorMessage?.trim(),
        },
        warning: {
          ...data.warning,
          leftValue: values.operator === "" ? "" : Number(values.operator),
          rightValue: values.warning === "" ? "" : Number(values.warning),
          message: values.warningMessage?.trim(),
        },
        emergency: {
          ...data.emergency,
          leftValue: values.warning === "" ? "" : Number(values.warning),
          rightValue: values.emergency === "" ? "" : Number(values.emergency),
          message: values.emergencyMessage?.trim(),
        },
      },
      editMode.key,
      editMode.side,
    );
  };

  const handleUpdate = async (values) => {
    if (!editMode.key || !editMode.side) return;
    setLoading(true);
    const submitData =
      editMode.key === "distance"
        ? distanceRows[editMode.side]
        : editMode.key === "speed"
          ? speedRows[editMode.side]
          : angleRows[editMode.side];
    const body = Object.keys(submitData).map((key) => {
      const record = {
        id: submitData[key].alarmSettingId,
        alarmType: editMode.key,
        alarmZone: `zone_${zone}`,
        ...(editMode.key && { alarmSensor: editMode.side }),
        value: values[key],
        message: values[`${key}Message`]?.trim(),
      };
      if (!record.value && record.value !== 0) {
        delete record.value;
      }
      return record;
    });
    try {
      const result = await AlarmService.updateSetting(body);
      setLoading(false);
      console.log("body", body);
      if (result?.data?.success) {
        notify("success", t("alarm:update_success"));
        updateAlarmState(submitData, values);
        setEditMode({ key: "", side: "" });
        return;
      }
      notify("error", t("alarm:update_fail"));
    } catch (error) {
      setLoading(false);
      notify("error", t("alarm:update_fail"));
    }
  };

  const {
    values,
    handleChange,
    handleSubmit,
    touched,
    errors,
    setFieldTouched,
    setTouched,
    setValues,
  } = useFormik({
    initialValues: initValue,
    onSubmit: handleUpdate,
    validationSchema: Yup.object().shape({
      operator: Yup.number(t("common:note.invalid-number"))
        .typeError(t("common:note.invalid-number"))
        .required(t("common:note.required-message"))
        .test("validate", function (value) {
          const { warning } = this.parent;
          if (editMode.key === "distance") {
            const leftValue =
              distanceRows?.[editMode.side]?.operator?.leftValue;
            if (value <= warning) {
              return this.createError({
                message: t("alarm:value_greater", { number: warning }),
              });
            }
            if (leftValue && value >= leftValue) {
              return this.createError({
                message: t("alarm:value_less", { number: leftValue }),
              });
            }
          } else {
            const leftValue =
              editMode.key === "speed"
                ? speedRows?.[editMode.side]?.operator?.leftValue
                : angleRows?.[editMode.side]?.operator?.leftValue;
            if (value >= warning) {
              return this.createError({
                message: t("alarm:value_less", { number: warning }),
              });
            }
            if (leftValue && value <= leftValue) {
              return this.createError({
                message: t("alarm:value_greater", { number: leftValue }),
              });
            }
          }
          return true;
        }),
      warning: Yup.number(t("common:note.invalid-number"))
        .typeError(t("common:note.invalid-number"))
        .required(t("common:note.required-message"))
        .test("validate", function (value) {
          const { operator, emergency } = this.parent;
          if (editMode.key === "distance") {
            if (value >= operator) {
              return this.createError({
                message: t("alarm:value_less", { number: operator }),
              });
            }
            if (value <= emergency) {
              return this.createError({
                message: t("alarm:value_greater", { number: emergency }),
              });
            }
          } else {
            if (value <= operator) {
              return this.createError({
                message: t("alarm:value_greater", { number: operator }),
              });
            }
            if (value >= emergency) {
              return this.createError({
                message: t("alarm:value_less", { number: emergency }),
              });
            }
          }
          return true;
        }),
      emergency: Yup.number(t("common:note.invalid-number"))
        .typeError(t("common:note.invalid-number"))
        .nullable()
        .test("validate", function (value) {
          const { warning } = this.parent;
          if (editMode.key === "distance") {
            if (!value && value !== 0) {
              return this.createError({
                message: t("common:note.invalid-number"),
              });
            }
            if (value >= warning) {
              return this.createError({
                message: t("alarm:value_less", { number: warning }),
              });
            }
          } else {
            if (value <= warning) {
              return this.createError({
                message: t("alarm:value_greater", { number: warning }),
              });
            }
            if (editMode.key === "angle") {
              if (!value && value !== 0) {
                return this.createError({
                  message: t("common:note.required-message"),
                });
              }
              if (value > 90) {
                return this.createError({
                  message: t("alarm:value_less", { number: 90 }),
                });
              }
            }
          }
          return true;
        }),
      operatorMessage: Yup.string(),
      warningMessage: Yup.string(),
      emergencyMessage: Yup.string(),
    }),
  });

  const handleEdit = (side, key) => {
    const editingData =
      key === "distance"
        ? distanceRows
        : key === "speed"
          ? speedRows
          : angleRows;
    let operator = editingData[side].operator?.rightValue ?? "";
    let warning = editingData[side].warning?.rightValue ?? "";
    let emergency = editingData[side].emergency?.rightValue ?? "";
    setTouched({});
    setValues({
      ...initValue,
      operator,
      warning,
      emergency,
      operatorMessage: editingData[side].operator?.message,
      warningMessage: editingData[side].warning?.message,
      emergencyMessage: editingData[side].emergency?.message,
    });
    if (editMode.key === key && editMode.side === side) {
      setEditMode({ key: "", side: "" });
      return;
    }
    setEditMode({
      key,
      side,
    });
  };

  const headerTitle = [
    {
      title: t("alarm:type"),
      minWidth: 80,
    },
    {
      title: t("alarm:sensor"),
      minWidth: 110,
    },
    {
      title: t("alarm:level"),
      minWidth: 150,
    },
    {
      title: t("alarm:condition"),
      minWidth: 230,
    },
    {
      title: t("alarm:alarm_message"),
      minWidth: 250,
    },
  ];

  const renderLevel = (level) => {
    switch (level) {
      case "operator":
        return (
          <Box display="flex" alignItems="center">
            <div
              className={styles.levelBox}
              style={{
                backgroundColor: "#69AE3A",
              }}
            />
            <p className={styles.levelText}>{t("alarm:operator")}</p>
          </Box>
        );
      case "warning":
        return (
          <Box display="flex" alignItems="center">
            <div
              className={styles.levelBox}
              style={{
                backgroundColor: "#FFE146",
              }}
            />
            <p className={styles.levelText}>{t("alarm:warning")}</p>
          </Box>
        );
      case "emergency":
        return (
          <Box display="flex" alignItems="center">
            <div
              className={styles.levelBox}
              style={{
                backgroundColor: "#EA3636",
              }}
            />
            <p className={styles.levelText}>{t("alarm:emergency")}</p>
          </Box>
        );
      default:
        return "";
    }
  };

  const renderConditionText = (
    leftValue,
    leftCondition,
    rightCondition,
    rightValue,
    isEdit,
    title,
    level,
  ) => {
    if (!leftValue && !rightValue) return "N/A";
    if (isEdit && title === "distance") {
      return (
        <div className={styles.inputValueContainer}>
          <p>|{t("alarm:warning_value")}| &gt;=</p>&nbsp;
          <input
            name={level}
            className={`${styles.inputValue} ${
              errors[level] && touched[level] ? styles.inputError : ""
            }`}
            value={values[level]}
            onChange={(e) => {
              if (/^-?\d*$/.test(e.target.value)) {
                handleChange({
                  target: {
                    name: level,
                    value: e.target.value,
                  },
                });
              }
            }}
            onBlur={() => setFieldTouched(level)}
          />
          {errors[level] && touched[level] && (
            <p className={styles.inputErrorText}>{errors[level]}</p>
          )}
        </div>
      );
    }
    if (isEdit) {
      return (
        <div className={styles.inputValueContainer}>
          <p>|{t("alarm:warning_value")}| &lt;=</p>&nbsp;
          <input
            className={styles.inputValue}
            value={values[level]}
            onChange={(e) => {
              if (/^-?\d*$/.test(e.target.value)) {
                handleChange({
                  target: {
                    name: level,
                    value: e.target.value,
                  },
                });
              }
            }}
            style={{
              borderColor: errors[level] && touched[level] ? "red" : "",
              color: errors[level] && touched[level] ? "red" : "",
            }}
            onBlur={() => setFieldTouched(level)}
          />
          {errors[level] && touched[level] && (
            <p className={styles.inputErrorText}>{errors[level]}</p>
          )}
        </div>
      );
    }
    if (title === "distance") {
      return (
        <p className={styles.conditionText}>
          {`${leftValue === "" ? "+∞" : leftValue} ${leftCondition} ${t(
            "alarm:warning_value",
          )} ${rightCondition} ${rightValue === "" ? "-∞" : rightValue}`}
        </p>
      );
    }
    return (
      <p className={styles.conditionText}>
        {`${leftValue === "" ? "-∞" : leftValue} ${leftCondition} ${t(
          "alarm:warning_value",
        )} ${rightCondition} ${rightValue === "" ? "+∞" : rightValue}`}
      </p>
    );
  };

  const renderDetailSensorCol = (data, side, level, title) => {
    const _data = data?.[level];
    const isEdit = editMode.key === title && editMode.side === side;
    return (
      <>
        <TableCell style={{ minWidth: 150 }}>{renderLevel(level)}</TableCell>
        <TableCell style={{ minWidth: 230 }}>
          {renderConditionText(
            _data?.leftValue,
            _data?.leftCondition,
            _data?.rightCondition,
            _data?.rightValue,
            isEdit,
            title,
            level,
          )}
        </TableCell>
        <TableCell
          style={{
            minWidth: 250,
            maxWidth: 250,
          }}
        >
          {isEdit ? (
            <>
              <input
                name={`${level}Message`}
                className={styles.inputMessage}
                placeholder={t("alarm:input_content")}
                value={values[`${level}Message`]}
                onChange={handleChange}
              />
            </>
          ) : (
            <Tooltip
              title={_data?.message}
              disableHoverListener={!_data?.message}
              enterTouchDelay={0}
            >
              {_data?.message ? (
                <p className={styles.messageText}>{_data?.message}</p>
              ) : (
                <p className={styles.placeholderMessageText}>
                  {t("alarm:alarm_detail_message")}
                </p>
              )}
            </Tooltip>
          )}
        </TableCell>
      </>
    );
  };

  const renderRow = (row, title) => {
    if (title === "angle") {
      return (
        <>
          <TableRow>
            <TableCell style={{ minWidth: 80 }} rowSpan={5}>
              <Box display="flex" alignItems="center">
                <p>{t(`alarm:${title}`)}</p>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ minWidth: 110 }} rowSpan={4} align="center">
              -
            </TableCell>
          </TableRow>
          <TableRow className={styles.noBorderRow}>
            {renderDetailSensorCol(
              row?.undefined,
              "undefined",
              "operator",
              title,
            )}
          </TableRow>
          <TableRow className={styles.noBorderRow}>
            {renderDetailSensorCol(
              row?.undefined,
              "undefined",
              "warning",
              title,
            )}
          </TableRow>
          <TableRow className={styles.noPaddingRow}>
            {renderDetailSensorCol(
              row?.undefined,
              "undefined",
              "emergency",
              title,
            )}
          </TableRow>
        </>
      );
    }

    return (
      <>
        <TableRow>
          <TableCell style={{ minWidth: 80 }} rowSpan={9}>
            <Box display="flex" alignItems="center">
              <p>{t(`alarm:${title}`)}</p>
              {title === "distance" && (
                <Tooltip
                  title={t(`alarm:distance_tooltip`)}
                  className={styles.tooltip}
                  enterTouchDelay={0}
                >
                  <InfoOutlinedIcon className={styles.infoIcon} />
                </Tooltip>
              )}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ minWidth: 110 }} rowSpan={4}>
            {t(`berth:dock_information.left_sensor`)}
          </TableCell>
        </TableRow>
        <TableRow className={styles.noBorderRow}>
          {renderDetailSensorCol(
            row?.left_sensor,
            "left_sensor",
            "operator",
            title,
          )}
        </TableRow>
        <TableRow className={styles.noBorderRow}>
          {renderDetailSensorCol(
            row?.left_sensor,
            "left_sensor",
            "warning",
            title,
          )}
        </TableRow>
        <TableRow className={styles.noPaddingRow}>
          {renderDetailSensorCol(
            row?.left_sensor,
            "left_sensor",
            "emergency",
            title,
          )}
        </TableRow>
        <TableRow>
          <TableCell rowSpan={5} style={{ minWidth: 110 }}>
            {t(`berth:dock_information.right_sensor`)}
          </TableCell>
        </TableRow>
        <TableRow className={styles.noBorderRow}>
          {renderDetailSensorCol(
            row?.right_sensor,
            "right_sensor",
            "operator",
            title,
          )}
        </TableRow>
        <TableRow className={styles.noBorderRow}>
          {renderDetailSensorCol(
            row?.right_sensor,
            "right_sensor",
            "warning",
            title,
          )}
        </TableRow>
        <TableRow className={styles.noPaddingRow}>
          {renderDetailSensorCol(
            row?.right_sensor,
            "right_sensor",
            "emergency",
            title,
          )}
        </TableRow>
      </>
    );
  };

  const renderEditSection = (key, side) => {
    if (editMode.key === key && editMode.side === side)
      return (
        <div className={styles.editContainer} key={`${key}-${side}`}>
          <IconButton onClick={() => handleSubmit(side, key)} disableRipple>
            <CheckIcon
              className={styles.editIcon}
              style={{ color: "#69AE3A" }}
            />
          </IconButton>
          <IconButton onClick={() => handleEdit(side, key)} disableRipple>
            <CloseIcon
              className={styles.editIcon}
              style={{
                color: "#EA3636",
              }}
            />
          </IconButton>
        </div>
      );

    return (
      <div className={styles.editContainer} key={`${key}-${side}`}>
        <IconButton onClick={() => handleEdit(side, key)} disableRipple>
          <EditIcon className={styles.editIcon} />
        </IconButton>
      </div>
    );
  };

  return (
    <Box display="flex" position="relative">
      <TableContainer
        component={Paper}
        style={{
          padding: 0,
          paddingRight: 120,
          flex: 1,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {headerTitle.map((item) => (
                <TableCell
                  key={item.title}
                  style={{
                    minWidth: item.width,
                  }}
                >
                  {item.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {distanceRows && (
            <TableBody>{renderRow(distanceRows, "distance")}</TableBody>
          )}
          <TableBody>{renderRow(speedRows, "speed")}</TableBody>
          <TableBody>{renderRow(angleRows, "angle")}</TableBody>
        </Table>
      </TableContainer>

      <div className={styles.actionContainer}>
        <div className={styles.actionTitle}>{t("alarm:action")}</div>
        {distanceRows &&
          ["left_sensor", "right_sensor"].map((key) =>
            renderEditSection("distance", key),
          )}
        {["left_sensor", "right_sensor"].map((key) =>
          renderEditSection("speed", key),
        )}
        {["undefined"].map((key) => renderEditSection("angle", key))}
      </div>
    </Box>
  );
};

export default memo(AlarmTable);
